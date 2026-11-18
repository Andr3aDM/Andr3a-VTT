// js/systems/ncs/sheet.js
// Modulo "Non Cedere al Sonno" (sistema 'ncs') — scheda del Protagonista, semplice come quella cartacea di una pagina.
// Testi scritti da noi, terminologia ufficiale. Le scritte sono in italiano nel DOM e le traduce lang.js (IT/EN).
// Sul token: pcSheet = { system: 'ncs', ... }. Sincronizzazione come le altre schede: il Master invia PC_SHEET_SYNC,
// il Giocatore (anche locale/TV) invia PLAYER_UPDATE_PC_SHEET. Valori che RESTANO tra un tiro e l'altro:
// Disciplina, Follia Permanente, Sfinimento (la Follia scelta per un tiro non sta sulla scheda: vedi la finestra del tiro).
(function () {
    'use strict';
    const WIN_ID = 'ncs-sheet-window';
    const SEND_DELAY_MS = 350;
    const MAX_DISCIPLINE = 3;
    const MAX_EXHAUSTION = 6;
    const QUESTIONS = [
        ['awake', 'Cosa ti tiene sveglio?'],
        ['happened', 'Cosa ti è appena successo?'],
        ['surface', 'Cosa c\'è in superficie?'],
        ['depths', 'Cosa giace in profondità?'],
        ['path', 'Qual è la tua strada?']
    ];

    let currentTokenId = null;
    let sheet = null;
    let displayedRev;
    let sendTimer = null;
    let pendingReload = false;
    let readOnly = false;
    const stats = { commits: 0, sends: 0, reloads: 0, echoSkips: 0 };

    const T = (s) => { try { return (typeof window.t === 'function') ? window.t(s) : s; } catch (e) { return s; } };
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const clampInt = (v, min, max) => { const n = Math.floor(Number(v)); return isFinite(n) ? Math.max(min, Math.min(max, n)) : min; };
    const getEngine = () => (typeof engine !== 'undefined' && engine) ? engine : window.engine;
    const getNetwork = () => (typeof network !== 'undefined' && network) ? network : window.network;
    const notify = (msg, level) => {
        if (level === 'warn' && typeof window.vttWarn === 'function') return window.vttWarn(msg);
        if (typeof window.vttNotify === 'function') return window.vttNotify(msg, level);
        console.log(msg);
    };
    const newRev = () => 'ncs_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

    function getToken() {
        const eng = getEngine();
        if (!eng || !Array.isArray(eng.tokens)) return null;
        return currentTokenId ? (eng.tokens.find(t => t.id === currentTokenId) || null) : null;
    }

    function blankSheet(name) {
        return {
            system: 'ncs', name: name || '', iAm: '',
            questions: { awake: '', happened: '', surface: '', depths: '', path: '' },
            discipline: 3, permanentMadness: 0, exhaustion: 0,
            reactions: [{ type: 'fight', filled: false }, { type: 'flight', filled: false }, { type: 'flight', filled: false }],
            exhaustionTalent: '', madnessTalent: '', scars: []
        };
    }

    // Completa una scheda arrivata da un token o da un file (campi mancanti, valori fuori scala)
    function normalize(ps, fallbackName) {
        const s = blankSheet(fallbackName);
        if (!ps || typeof ps !== 'object') return s;
        s.name = typeof ps.name === 'string' ? ps.name : s.name;
        s.iAm = typeof ps.iAm === 'string' ? ps.iAm : '';
        const q = (ps.questions && typeof ps.questions === 'object') ? ps.questions : {};
        QUESTIONS.forEach(([k]) => { s.questions[k] = typeof q[k] === 'string' ? q[k] : ''; });
        s.discipline = ps.discipline === undefined ? 3 : clampInt(ps.discipline, 0, MAX_DISCIPLINE);
        s.permanentMadness = clampInt(ps.permanentMadness, 0, MAX_DISCIPLINE);
        s.exhaustion = clampInt(ps.exhaustion, 0, MAX_EXHAUSTION);
        if (Array.isArray(ps.reactions) && ps.reactions.length) {
            s.reactions = ps.reactions.slice(0, 3).map(r => ({ type: (r && r.type === 'fight') ? 'fight' : 'flight', filled: !!(r && r.filled) }));
            while (s.reactions.length < 3) s.reactions.push({ type: 'flight', filled: false });
        }
        s.exhaustionTalent = typeof ps.exhaustionTalent === 'string' ? ps.exhaustionTalent : '';
        s.madnessTalent = typeof ps.madnessTalent === 'string' ? ps.madnessTalent : '';
        s.scars = Array.isArray(ps.scars) ? ps.scars.map(x => ({ text: String((x && x.text) || ''), marked: !!(x && x.marked), transformed: !!(x && x.transformed) })) : [];
        if (ps._ncsRev) s._ncsRev = ps._ncsRev;
        if (ps.updatedAt) s.updatedAt = ps.updatedAt;
        return s;
    }

    function canEditToken(tok) {
        const eng = getEngine();
        if (!tok) return false;
        if (eng && eng.isDM) return true;
        if (typeof isTokenOwnedByLocalPlayer === 'function') return !!isTokenOwnedByLocalPlayer(tok);
        return true;
    }

    // ---------------- Salvataggio nel token e invio ----------------
    function commitToToken(tok, isUserChange) {
        if (!tok || !sheet) return;
        sheet.system = 'ncs';
        if (isUserChange) {
            sheet.updatedAt = Date.now();
            sheet._ncsRev = newRev();
            displayedRev = sheet._ncsRev;
            stats.commits++;
        }
        tok.pcSheet = JSON.parse(JSON.stringify(sheet));
        tok.hasPcSheet = true;
        if (sheet.name && sheet.name.trim()) tok.name = sheet.name.trim();
        updateTitle();
    }

    function sendNow(tok) {
        const eng = getEngine();
        const net = getNetwork();
        stats.sends++;
        if (eng && eng.isDM) {
            if (typeof window.upsertTokenInCampaign === 'function') window.upsertTokenInCampaign(tok);
            if (typeof window.broadcastPcSheetSync === 'function') window.broadcastPcSheetSync(tok);
            if (typeof window.syncState === 'function') window.syncState(true, false);
            if (typeof eng.renderTokensLayer === 'function') eng.renderTokensLayer();
        } else if (net && (net.mode === 'client' || net.mode === 'offline')) {
            net.send({
                type: 'PLAYER_UPDATE_PC_SHEET',
                payload: { tokenId: tok.id, player: net.playerName || null, pcSheet: tok.pcSheet, adventureJournal: tok.adventureJournal || '' }
            });
        }
    }

    function scheduleSend() {
        if (sendTimer) clearTimeout(sendTimer);
        sendTimer = setTimeout(flushSend, SEND_DELAY_MS);
    }

    function flushSend() {
        if (!sendTimer) return false;
        clearTimeout(sendTimer);
        sendTimer = null;
        const tok = getToken();
        if (!tok || !sheet) return false;
        commitToToken(tok, false);
        sendNow(tok);
        return true;
    }

    // Modifica dell'utente: subito nel token, invio dopo una breve pausa (una raffica di clic = un invio)
    function userChanged(rerender) {
        if (readOnly) return;
        const tok = getToken();
        if (!tok) return;
        commitToToken(tok, true);
        scheduleSend();
        if (rerender) render(); else renderWarnings();
    }

    // ---------------- Finestra ----------------
    function ensureWindow() {
        let win = document.getElementById(WIN_ID);
        if (win) return win;
        win = document.createElement('div');
        win.id = WIN_ID;
        win.className = 'ncs-window';
        win.style.display = 'none';
        win.innerHTML = `
            <div class="ncs-header" id="ncs-sheet-header">
                <span id="ncs-sheet-title">🌙 Scheda Protagonista</span>
                <span class="ncs-header-btns">
                    <button type="button" class="ncs-icon-btn" data-act="export" title="Esporta la scheda in un file JSON">⬇</button>
                    <button type="button" class="ncs-icon-btn" data-act="import" title="Importa la scheda da un file JSON">⬆</button>
                    <button type="button" class="ncs-icon-btn" data-act="close" title="Chiudi">✕</button>
                </span>
            </div>
            <div class="ncs-body" id="ncs-sheet-body"></div>`;
        document.body.appendChild(win);
        if (typeof window.makeDraggable === 'function') window.makeDraggable(win, win.querySelector('.ncs-header'));
        win.addEventListener('click', onClick);
        win.addEventListener('change', onChange);
        win.addEventListener('input', onInput);
        win.addEventListener('focusout', () => {
            setTimeout(() => { if (pendingReload && !isTypingInside()) { pendingReload = false; reloadFromToken(); } }, 0);
        });
        return win;
    }

    function isOpen() {
        const win = document.getElementById(WIN_ID);
        return !!(win && win.style.display !== 'none');
    }

    function isTypingInside() {
        const win = document.getElementById(WIN_ID);
        const a = document.activeElement;
        return !!(win && a && win.contains(a) && (a.tagName === 'INPUT' && a.type === 'text' || a.tagName === 'TEXTAREA'));
    }

    function updateTitle() {
        const el = document.getElementById('ncs-sheet-title');
        if (!el) return;
        const name = (sheet && sheet.name && sheet.name.trim()) || '';
        el.textContent = '🌙 Scheda Protagonista' + (name ? ' — ' + name : '');
    }

    function render() {
        const body = document.getElementById('ncs-sheet-body');
        if (!body || !sheet) return;
        const ro = readOnly ? ' disabled' : '';
        const txt = (f, v, ph) => `<input type="text" class="ncs-input" data-f="${f}" value="${esc(v)}" placeholder="${esc(ph || '')}"${ro}>`;
        const qs = QUESTIONS.map(([k, label]) => `<label class="ncs-row"><span class="ncs-label">${label}</span>${txt('q.' + k, sheet.questions[k])}</label>`).join('');
        const exBoxes = [1, 2, 3, 4, 5, 6].map(i => `<button type="button" class="ncs-box ncs-ex${i <= sheet.exhaustion ? ' on' : ''}" data-act="ex" data-i="${i}"${ro} title="Sfinimento ${i}"></button>`).join('');
        const reactions = sheet.reactions.map((r, i) => `
            <span class="ncs-reaction">
                <select class="ncs-select" data-f="reaction-type" data-i="${i}"${ro}>
                    <option value="fight"${r.type === 'fight' ? ' selected' : ''}>Lotta</option>
                    <option value="flight"${r.type === 'flight' ? ' selected' : ''}>Fuggi</option>
                </select>
                <input type="checkbox" class="ncs-check" data-f="reaction-filled" data-i="${i}"${r.filled ? ' checked' : ''}${ro} title="Riquadro riempito">
            </span>`).join('');
        const scars = sheet.scars.map((s, i) => `
            <div class="ncs-scar${s.transformed ? ' ncs-scar-done' : ''}">
                <input type="text" class="ncs-input" data-f="scar-text" data-i="${i}" value="${esc(s.text)}"${ro}>
                <label class="ncs-mini" title="Rievocata in questa sessione (il segno si cancella a fine sessione)"><input type="checkbox" data-f="scar-marked" data-i="${i}"${s.marked ? ' checked' : ''}${ro || s.transformed ? ' disabled' : ''}> <span>segnata</span></label>
                <label class="ncs-mini" title="Trasformata: resta nella storia ma non si può più usare"><input type="checkbox" data-f="scar-transformed" data-i="${i}"${s.transformed ? ' checked' : ''}${ro}> <span>trasformata</span></label>
                <button type="button" class="ncs-icon-btn" data-act="scar-del" data-i="${i}"${ro} title="Togli la Cicatrice">✕</button>
            </div>`).join('');
        body.innerHTML = `
            ${readOnly ? '<div class="ncs-note">Solo lettura: questa scheda appartiene a un altro giocatore.</div>' : ''}
            <label class="ncs-row"><span class="ncs-label">Mi chiamo…</span>${txt('name', sheet.name)}</label>
            <label class="ncs-row"><span class="ncs-label">e sono…</span>${txt('iAm', sheet.iAm)}</label>
            ${qs}
            <div class="ncs-sep"></div>
            <div class="ncs-row ncs-stat"><span class="ncs-label">⚪ Disciplina</span>
                <button type="button" class="ncs-step" data-act="disc-"${ro}>−</button><b class="ncs-val" id="ncs-val-discipline">${sheet.discipline}</b><button type="button" class="ncs-step" data-act="disc+"${ro}>+</button></div>
            <div class="ncs-row ncs-stat"><span class="ncs-label">🔴 Follia Permanente</span>
                <button type="button" class="ncs-step" data-act="pm-"${ro}>−</button><b class="ncs-val" id="ncs-val-permanent">${sheet.permanentMadness}</b><button type="button" class="ncs-step" data-act="pm+"${ro}>+</button></div>
            <div class="ncs-row ncs-stat"><span class="ncs-label">⚫ Sfinimento</span>
                <button type="button" class="ncs-box ncs-ex0" data-act="ex" data-i="0"${ro} title="Sfinimento 0">0</button>${exBoxes}<b class="ncs-val" id="ncs-val-exhaustion">${sheet.exhaustion}</b></div>
            <div class="ncs-row ncs-stat"><span class="ncs-label">Reazioni</span>${reactions}</div>
            <div id="ncs-warnings" class="ncs-warnings"></div>
            <div class="ncs-sep"></div>
            <label class="ncs-row"><span class="ncs-label">Talento di Sfinimento</span>${txt('exhaustionTalent', sheet.exhaustionTalent)}</label>
            <label class="ncs-row"><span class="ncs-label">Talento di Follia</span>${txt('madnessTalent', sheet.madnessTalent)}</label>
            <div class="ncs-row ncs-col"><span class="ncs-label">Cicatrici</span>${scars}
                <button type="button" class="ncs-add" data-act="scar-add"${ro}>+ Aggiungi Cicatrice</button></div>
            ${readOnly ? '' : '<div class="ncs-sep"></div><button type="button" class="ncs-roll-btn" data-act="roll" title="Apri la finestra del tiro">🎲 Tira</button>'}`;
        renderWarnings();
        updateTitle();
        if (window.ncsRoll && typeof window.ncsRoll.refresh === 'function') window.ncsRoll.refresh();
    }

    function renderWarnings() {
        const box = document.getElementById('ncs-warnings');
        if (!box || !sheet) return;
        const w = [];
        if (sheet.exhaustion >= MAX_EXHAUSTION) w.push('Sfinimento a 6: un altro aumento ti fa Crollare.');
        if (sheet.reactions.every(r => r.filled)) w.push('Reazioni tutte piene: alla prossima Reazione Schizzi.');
        if (sheet.discipline <= 0) w.push('Disciplina a 0: il Protagonista diventa un Incubo.');
        box.innerHTML = w.map(x => `<div class="ncs-warn">⚠️ <span>${x}</span></div>`).join('');
    }

    // ---------------- Eventi ----------------
    function onClick(e) {
        const btn = e.target.closest('[data-act]');
        if (!btn) return;
        const act = btn.getAttribute('data-act');
        if (act === 'close') { manager.close(); return; }
        if (act === 'export') { manager.exportSingleCharacterJson(getToken()); return; }
        if (act === 'import') { if (!readOnly) manager.importSingleCharacterJson(getToken()); return; }
        if (act === 'roll') { if (!readOnly && window.ncsRoll) { flushSend(); window.ncsRoll.open(getToken()); } return; }
        if (readOnly || !sheet) return;
        const i = parseInt(btn.getAttribute('data-i'), 10);
        if (act === 'disc-') sheet.discipline = clampInt(sheet.discipline - 1, 0, MAX_DISCIPLINE);
        else if (act === 'disc+') sheet.discipline = clampInt(sheet.discipline + 1, 0, MAX_DISCIPLINE);
        else if (act === 'pm-') sheet.permanentMadness = clampInt(sheet.permanentMadness - 1, 0, MAX_DISCIPLINE);
        else if (act === 'pm+') sheet.permanentMadness = clampInt(sheet.permanentMadness + 1, 0, MAX_DISCIPLINE);
        else if (act === 'ex') sheet.exhaustion = (i === sheet.exhaustion && i > 0) ? i - 1 : clampInt(i, 0, MAX_EXHAUSTION);
        else if (act === 'scar-add') sheet.scars.push({ text: '', marked: false, transformed: false });
        else if (act === 'scar-del') sheet.scars.splice(i, 1);
        else return;
        userChanged(true);
    }

    function setField(f, value, i) {
        if (f === 'name') sheet.name = value;
        else if (f === 'iAm') sheet.iAm = value;
        else if (f.startsWith('q.')) sheet.questions[f.slice(2)] = value;
        else if (f === 'exhaustionTalent') sheet.exhaustionTalent = value;
        else if (f === 'madnessTalent') sheet.madnessTalent = value;
        else if (f === 'scar-text' && sheet.scars[i]) sheet.scars[i].text = value;
        else return false;
        return true;
    }

    function onInput(e) {
        const el = e.target;
        const f = el.getAttribute && el.getAttribute('data-f');
        if (!f || readOnly || !sheet || el.type === 'checkbox' || el.tagName === 'SELECT') return;
        if (setField(f, el.value, parseInt(el.getAttribute('data-i'), 10))) userChanged(false);
    }

    function onChange(e) {
        const el = e.target;
        const f = el.getAttribute && el.getAttribute('data-f');
        if (!f || readOnly || !sheet) return;
        const i = parseInt(el.getAttribute('data-i'), 10);
        if (f === 'reaction-type' && sheet.reactions[i]) sheet.reactions[i].type = el.value === 'fight' ? 'fight' : 'flight';
        else if (f === 'reaction-filled' && sheet.reactions[i]) sheet.reactions[i].filled = !!el.checked;
        else if (f === 'scar-marked' && sheet.scars[i]) sheet.scars[i].marked = !!el.checked;
        else if (f === 'scar-transformed' && sheet.scars[i]) { sheet.scars[i].transformed = !!el.checked; if (el.checked) sheet.scars[i].marked = false; userChanged(true); return; }
        else { flushSend(); return; } // campi di testo: all'uscita parte subito l'invio in attesa
        userChanged(false);
    }

    // ---------------- Caricamento ----------------
    function loadToken(tok) {
        currentTokenId = tok.id;
        readOnly = !canEditToken(tok);
        const ps = (tok.pcSheet && tok.pcSheet.system === 'ncs') ? tok.pcSheet : null;
        sheet = normalize(ps, tok.name || '');
        displayedRev = ps ? ps._ncsRev : undefined;
        render();
    }

    function reloadFromToken() {
        const tok = getToken();
        if (!tok) return;
        stats.reloads++;
        loadToken(tok);
    }

    // ---------------- File JSON ----------------
    function buildExport(tok) {
        return {
            vttBackupType: 'character_sheet_ncs_v1',
            exportedAt: new Date().toISOString(),
            system: 'ncs',
            name: (tok && tok.name) || (sheet && sheet.name) || 'Protagonista',
            owner: (tok && tok.owner) || null,
            owners: (tok && tok.owners) || [],
            pcSheet: (tok && tok.pcSheet && tok.pcSheet.system === 'ncs') ? tok.pcSheet : (sheet || blankSheet()),
            adventureJournal: (tok && tok.adventureJournal) || ''
        };
    }

    // Applica al token una scheda letta da un file. Rifiuta le schede di altri sistemi.
    function applyImport(tok, data) {
        if (!tok || !data || typeof data !== 'object') return { ok: false, reason: 'invalid' };
        const ps = data.pcSheet || null;
        if (!ps || (ps.system && ps.system !== 'ncs') || (data.system && data.system !== 'ncs')) return { ok: false, reason: 'otherSystem' };
        const clean = normalize(ps, data.name || tok.name);
        clean.system = 'ncs';
        clean.updatedAt = Date.now();
        clean._ncsRev = newRev();
        tok.pcSheet = clean;
        tok.hasPcSheet = true;
        if (clean.name && clean.name.trim()) tok.name = clean.name.trim();
        if (data.adventureJournal !== undefined) tok.adventureJournal = data.adventureJournal;
        if (tok.id === currentTokenId) { sheet = normalize(clean); displayedRev = clean._ncsRev; render(); }
        sendNow(tok);
        return { ok: true };
    }

    // ---------------- Gestore registrato nel sistema ----------------
    const manager = {
        open(token = null) {
            const eng = getEngine();
            const tok = token || (eng && Array.isArray(eng.tokens) ? eng.tokens.find(t => t.id === eng.selectedTokenId) : null);
            if (!tok) { notify(T('Seleziona prima il token del Protagonista sulla mappa!'), 'warn'); return; }
            if (isOpen() && currentTokenId && currentTokenId !== tok.id) flushSend();
            const win = ensureWindow();
            loadToken(tok);
            win.style.display = 'flex';
        },

        close() {
            flushSend();
            const win = document.getElementById(WIN_ID);
            if (win) win.style.display = 'none';
            return true;
        },

        refreshIfOpen(tokenId) {
            if (window.ncsRoll && typeof window.ncsRoll.refresh === 'function') window.ncsRoll.refresh();
            if (!isOpen()) return;
            if (tokenId && tokenId !== currentTokenId) return;
            const tok = getToken();
            if (!tok) return;
            if (sendTimer) { flushSend(); return; }           // la modifica dell'utente in attesa prevale
            const inRev = tok.pcSheet ? tok.pcSheet._ncsRev : undefined;
            if (inRev !== undefined && inRev === displayedRev) { stats.echoSkips++; return; } // eco della propria modifica
            if (isTypingInside()) { pendingReload = true; return; }                         // si ricarica all'uscita dal campo
            reloadFromToken();
        },

        commitSheetChanges(token, syncNetwork = true) {
            if (!token || token.id !== currentTokenId || !sheet) return;
            commitToToken(token, true);
            if (syncNetwork) { if (sendTimer) { clearTimeout(sendTimer); sendTimer = null; } sendNow(token); }
        },

        exportSingleCharacterJson(token) {
            const tok = token || getToken();
            if (!tok) return null;
            const payload = buildExport(tok);
            try {
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.download = `${String(payload.name || 'Protagonista').replace(/[^a-zA-Z0-9_\-]/g, '_')}_NCS_Scheda.json`;
                a.href = url;
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (e) { console.warn('[NCS] esportazione:', e); }
            return payload;
        },

        importSingleCharacterJson(token) {
            const tok = token || getToken();
            if (!tok) return;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.style.display = 'none';
            input.onchange = (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (re) => {
                    let res;
                    try { res = applyImport(tok, JSON.parse(re.target.result)); } catch (err) { res = { ok: false, reason: 'invalid' }; }
                    if (res.ok) notify(T('Scheda del Protagonista importata!'), 'info');
                    else notify(T(res.reason === 'otherSystem' ? 'Il file contiene una scheda di un altro sistema di gioco.' : 'File JSON non valido.'), 'warn');
                };
                reader.readAsText(file);
            };
            document.body.appendChild(input); input.click(); document.body.removeChild(input);
        },

        // Modifica la scheda NCS di un token (aperta o no): fn(scheda) cambia i valori; nuova revisione e invio subito.
        // Usata dalla finestra del tiro (+1 Sfinimento volontario, effetti a un clic). false se non modificabile.
        applyToToken(tok, fn) {
            if (!tok || typeof fn !== 'function' || !canEditToken(tok)) return false;
            if (tok.id === currentTokenId && sheet) {
                if (sendTimer) { clearTimeout(sendTimer); sendTimer = null; }
                fn(sheet);
                sheet.discipline = clampInt(sheet.discipline, 0, MAX_DISCIPLINE);
                sheet.permanentMadness = clampInt(sheet.permanentMadness, 0, MAX_DISCIPLINE);
                sheet.exhaustion = clampInt(sheet.exhaustion, 0, MAX_EXHAUSTION);
                commitToToken(tok, true);
                if (isOpen()) render();
            } else {
                const s = normalize((tok.pcSheet && tok.pcSheet.system === 'ncs') ? tok.pcSheet : null, tok.name || '');
                fn(s);
                s.discipline = clampInt(s.discipline, 0, MAX_DISCIPLINE);
                s.permanentMadness = clampInt(s.permanentMadness, 0, MAX_DISCIPLINE);
                s.exhaustion = clampInt(s.exhaustion, 0, MAX_EXHAUSTION);
                s.system = 'ncs'; s.updatedAt = Date.now(); s._ncsRev = newRev();
                tok.pcSheet = s; tok.hasPcSheet = true;
            }
            sendNow(tok);
            return true;
        },
        // Scheda NCS normalizzata di un token (copia), senza aprirla
        getSheetOf(tok) {
            if (!tok) return null;
            if (tok.id === currentTokenId && sheet) return JSON.parse(JSON.stringify(sheet));
            return normalize((tok.pcSheet && tok.pcSheet.system === 'ncs') ? tok.pcSheet : null, tok.name || '');
        },
        canEdit(tok) { return canEditToken(tok); },

        // Per i test e per i passi successivi (finestra del tiro)
        _state: () => ({ currentTokenId, sheet: sheet ? JSON.parse(JSON.stringify(sheet)) : null, displayedRev, readOnly, pendingSend: !!sendTimer, stats: Object.assign({}, stats) }),
        _buildExport: buildExport,
        _applyImport: applyImport,
        _normalize: normalize,
        _blankSheet: blankSheet
    };

    if (typeof window !== 'undefined') {
        window.ncsSheetManager = manager;
        if (window.systemManager) {
            window.systemManager.registerSystem('ncs', {
                id: 'ncs',
                name: 'Non Cedere al Sonno',
                badge: '🌙 NCS',
                optionLabel: '🌙 Non Cedere al Sonno',
                ui: {
                    badge: '🌙 Non Cedere al Sonno',
                    badgeBg: '#1e1633',
                    badgeColor: '#c4b5fd',
                    badgeBorder: '#7c3aed',
                    // Niente Classe Armatura ne' PV temporanei; niente schede mostro (il GM tira solo il Dolore)
                    hideAc: true,
                    hideTempHp: true,
                    hideStatblockButton: true,
                    statblockIcon: '👁️',
                    statblockLabel: '👁️ Incubo',
                    statblockTitle: 'In Non Cedere al Sonno gli avversari sono indicati dai dadi di Dolore',
                    pcIcon: '🌙',
                    pcLabel: '🌙 Scheda Protagonista',
                    pcTitle: 'Apri o crea la Scheda del Protagonista',
                    pcTitleNamed: 'Apri la Scheda del Protagonista: {name}',
                    // Pannello token del Giocatore
                    playerPcLabel: '🌙 Apri Scheda Protagonista',
                    playerPcTitle: 'Apri la Scheda del tuo Protagonista',
                    playerStatblockLabel: '👁️ Incubo',
                    // Un token "personaggi" senza scheda apre una Scheda Protagonista nuova col doppio clic
                    pcWithoutSheet: true
                },
                matchesSheet(pcSheet) { return !!(pcSheet && pcSheet.system === 'ncs'); },
                // Canale dei moduli e stato condiviso: il conflitto in corso (finestra del tiro, roll.js)
                onNetworkMessage(data, ctx) {
                    if (window.ncsRoll && window.ncsRoll.onNetworkMessage) window.ncsRoll.onNetworkMessage(data, ctx);
                    if (window.ncsCoins && window.ncsCoins.onNetworkMessage) window.ncsCoins.onNetworkMessage(data, ctx);
                },
                getSharedState() {
                    const a = (window.ncsRoll && window.ncsRoll.getSharedState) ? window.ncsRoll.getSharedState() : null;   // conflitto in corso
                    const b = (window.ncsCoins && window.ncsCoins.getSharedState) ? window.ncsCoins.getSharedState() : null; // Coppe
                    return (a || b) ? Object.assign({}, a || {}, b || {}) : null;
                },
                applySharedState(sys) {
                    if (window.ncsRoll && window.ncsRoll.applySharedState) window.ncsRoll.applySharedState(sys);
                    if (window.ncsCoins && window.ncsCoins.applySharedState) window.ncsCoins.applySharedState(sys);
                },
                getSheetManager() { return manager; },
                getCompendium() { return null; }
            });
        }
    }
})();
