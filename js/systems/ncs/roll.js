// js/systems/ncs/roll.js
// Modulo "Non Cedere al Sonno" — CONFLITTO CONDIVISO (passi C3 + C3b). Calcolo in rules.js, scheda in sheet.js.
// - Il Giocatore tira i suoi dadi (bianchi Disciplina, neri Sfinimento, rossi Follia) dalla propria scheda;
//   il Master riceve la finestra del conflitto, imposta e tira il Dolore (viola), poi "Concludi" quando la scena e' finita.
// - Il Master tiene la versione valida del conflitto e la invia a tutti (SYS_MSG del canale dei moduli); la finestra si
//   apre solo al Giocatore coinvolto e al Master, oppure a tutti con "Mostra a tutti".
// - Si puo' partire dal Giocatore ("Tira i miei dadi") o dal Master ("Apri il conflitto"); il Master puo' tirare entrambe
//   le parti (PNG, gioco in locale). Un conflitto alla volta. Chi entra a meta' lo riceve in STATE_SYNC.sys.
// - Pool dalla scheda + scelte del tiro (Follia 0-6, +1 Sfinimento volontario una volta per tiro, Talento); contatore
//   "Dadi nel tiro: N / massimo". +1 volontario salvato subito sulla scheda; risultato in chat alla conclusione;
//   effetti come pulsanti a un clic (Dominanza: chi possiede il Protagonista; fallimento: il Master).
(function () {
    'use strict';
    const WIN_ID = 'ncs-roll-window';
    const MAX_CHOSEN = 6;
    const MAX_EXH = 6;
    const POOL_STYLE = {
        discipline: 'background:#f3f4f6;color:#111;border:1px solid #d1d5db;',
        exhaustion: 'background:#0b0b0f;color:#f3f4f6;border:1px solid #6b7280;',
        madness: 'background:#b91c1c;color:#fff;border:1px solid #fca5a5;',
        pain: 'background:#6d28d9;color:#fff;border:1px solid #c4b5fd;'
    };
    const POOL_ICON = { discipline: '⚪', exhaustion: '⚫', madness: '🔴', pain: '🟣' };
    const POOL_NAME = { discipline: 'Disciplina', exhaustion: 'Sfinimento', madness: 'Follia', pain: 'Dolore' };
    const EFFECT_TEXT = {
        reduceExhaustionOrFreeReaction: 'il giocatore può togliere 1 Sfinimento o liberare una Reazione',
        gainExhaustion: '+1 Sfinimento',
        fillReaction: 'il giocatore riempie una Reazione (Lotta o Fuggi)',
        gainDespair: '+1 Moneta nella Coppa della Disperazione'
    };
    const FAIL_TEXT = { gainExhaustion: '+1 Sfinimento', fillReaction: 'riempire una Reazione' };
    const REJECT_TEXT = {
        busy: 'Il Master sta già risolvendo un conflitto.',
        notOwner: 'Questo Protagonista non è tuo.',
        already: 'Il Protagonista ha già tirato in questo conflitto.',
        noToken: 'Protagonista non trovato sulla mappa.',
        requestRejected: 'Il Master ha rifiutato la richiesta.',
        notEnoughHope: 'Non ci sono abbastanza Monete di Speranza.',
        notEnoughDespair: 'Non ci sono abbastanza Monete di Disperazione.',
        noConflict: 'Nessun conflitto aperto.',
        alreadyHelped: 'Questo Protagonista sta già aiutando.',
        invalid: 'Richiesta non valida.'
    };

    let conflict = null;          // ultimo stato noto (sul Master: quello valido)
    let viewTokenId = null;       // Protagonista mostrato quando non c'e' un conflitto
    let choices = { chosenMadness: 0, voluntary: false, talent: 'none' };
    let masterPain = 0;           // ultimo Dolore usato dal Master
    let used = new Set();         // effetti gia' applicati (per conflitto, su questo dispositivo)
    let usedFor = null;
    let dismissed = null;         // finestra chiusa a mano: { id, updatedAt }
    let lastApplied = null;       // ultimo stato ricevuto applicato (id + updatedAt)
    let nextDice = null, nextPain = null, nextReroll = null, nextHelp = null; // per i test
    let helperTokenId = null;     // Giocatore che aiuta: il suo Protagonista (non quello del conflitto)
    const stats = { playerRolls: 0, painRolls: 0, broadcasts: 0, concluded: 0, rejects: 0 };

    const T = (s) => { try { return (typeof window.t === 'function') ? window.t(s) : s; } catch (e) { return s; } };
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const getEngine = () => (typeof engine !== 'undefined' && engine) ? engine : window.engine;
    const getNetwork = () => (typeof network !== 'undefined' && network) ? network : window.network;
    const R = () => window.ncsRules;
    const S = () => window.ncsSheetManager;
    const isDM = () => { const e = getEngine(); return !!(e && e.isDM); };
    const myName = () => { const n = getNetwork(); return (n && n.playerName) ? String(n.playerName).trim().toLowerCase() : ''; };
    const warn = (m) => { if (typeof window.vttWarn === 'function') window.vttWarn(T(m)); else console.warn(m); };

    function tokenById(id) {
        const eng = getEngine();
        return (eng && Array.isArray(eng.tokens) && id) ? (eng.tokens.find(t => t.id === id) || null) : null;
    }
    function ownersOf(tok) {
        if (!tok) return [];
        const list = Array.isArray(tok.owners) && tok.owners.length ? tok.owners : (tok.owner ? [tok.owner] : []);
        return list.map(o => String(o).trim()).filter(Boolean);
    }
    const ownsConflict = (c) => !!(c && myName() && (c.owners || []).some(o => String(o).trim().toLowerCase() === myName()));
    const helpsHere = (c) => !!(c && myName() && (c.helpers || []).some(h => String(h.player || '').trim().toLowerCase() === myName()));
    const involvedHere = (c) => !!c && (isDM() || c.showAll || ownsConflict(c) || helpsHere(c));
    const shadowCount = (c) => (c && c.mods ? c.mods.filter(m => m.type === 'shadow').length : 0);
    const hopeCount = (c) => (c && c.mods ? c.mods.filter(m => m.type === 'hope').length : 0);
    const coinsNow = () => (window.ncsCoins && window.ncsCoins.get) ? window.ncsCoins.get() : { despair: 0, hope: 0 };
    const isActive = (c) => !!c && (c.status === 'draft' || c.status === 'open');
    // Un conflitto "occupa" il Master se e' aperto o se la sua bozza ha gia' dei dadi (una bozza vuota non blocca nessuno)
    const isBlocking = (c) => !!c && (c.status === 'open' || (c.status === 'draft' && !!(c.playerDice || c.painDice)));
    const currentTokenId = () => (conflict && conflict.status !== 'cancelled') ? conflict.tokenId : viewTokenId;

    function newConflict(tok, sheet) {
        return {
            id: 'ncsc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            tokenId: tok.id, heroName: (sheet && sheet.name) || tok.name || '', owners: ownersOf(tok),
            choices: null, playerDice: null, pain: masterPain, painDice: null,
            mods: [], helpers: [], pending: [], rerolls: 0,
            showAll: false, status: 'draft', result: null, updatedAt: Date.now()
        };
    }

    // Dadi attuali del conflitto: tiri + modifiche con le Monete (Ombre: +/- un 6; Luce: un "1" alla Disciplina)
    function currentPools(c) {
        if (!c || !R()) return null;
        let pools = {
            discipline: (c.playerDice && c.playerDice.discipline) || [], exhaustion: (c.playerDice && c.playerDice.exhaustion) || [],
            madness: (c.playerDice && c.playerDice.madness) || [], pain: c.painDice || []
        };
        pools = JSON.parse(JSON.stringify(pools));
        (c.mods || []).forEach(m => {
            if (m.type === 'shadow') { const r = R().castShadow(pools, m.pool, m.action); if (r.ok) pools = r.pools; }
            else if (m.type === 'hope') pools = R().addHopeSuccess(pools).pools;
        });
        return pools;
    }

    function computeResult(c) {
        if (!c || !c.playerDice || !c.painDice || !R()) return null;
        const pools = currentPools(c);
        const res = R().resolve(Object.assign({}, pools, {
            talent: (c.choices && c.choices.talent) || 'none',
            helpers: (c.helpers || []).map(h => h.dice),
            shadowsSpent: shadowCount(c), hopeSpent: hopeCount(c)
        }));
        res.voluntary = !!(c.choices && c.choices.voluntary);
        res.heroName = c.heroName;
        res.helpersInfo = (c.helpers || []).map(h => ({ name: h.heroName || h.player || '', dice: h.dice, successes: R().countSuccesses(h.dice) }));
        res.rerolls = c.rerolls || 0;
        return res;
    }

    // ---------------- Rete (canale dei moduli) ----------------
    function send(to, kind, payload) {
        const net = getNetwork();
        try { if (net && typeof net.send === 'function') net.send({ type: 'SYS_MSG', sys: 'ncs', to, kind, payload }); }
        catch (e) { console.warn('[NCS] invio:', e); }
    }
    // Il Master invia a tutti lo stato del conflitto (i client aprono la finestra solo se coinvolti o "Mostra a tutti")
    function broadcastState() {
        if (!isDM() || !conflict) return;
        conflict.updatedAt = Date.now();
        conflict.result = computeResult(conflict);
        stats.broadcasts++;
        send('players', 'state', { conflict });
    }

    // ---------------- Pool e contatore ----------------
    function heroSheet() { const tok = tokenById(currentTokenId()); return (tok && S()) ? S().getSheetOf(tok) : null; }
    function preview(sheet) {
        const dp = R().dicePools(sheet, { chosenMadness: choices.chosenMadness, voluntaryExhaustion: choices.voluntary });
        const total = dp.discipline + dp.exhaustion + dp.madness;
        const max = (sheet.discipline || 0) + (sheet.permanentMadness || 0) + MAX_EXH + MAX_CHOSEN;
        const canVoluntary = !choices.voluntary && (sheet.exhaustion || 0) < MAX_EXH;
        return { dp, total, max, canVoluntary, madnessLeft: MAX_CHOSEN - choices.chosenMadness };
    }

    // ---------------- Finestra ----------------
    function ensureWindow() {
        let win = document.getElementById(WIN_ID);
        if (win) return win;
        win = document.createElement('div');
        win.id = WIN_ID;
        win.className = 'ncs-window ncs-roll-window';
        win.style.display = 'none';
        win.innerHTML = `
            <div class="ncs-header"><span><span>🎲 Conflitto</span> — <span id="ncs-roll-hero"></span></span>
                <span class="ncs-header-btns"><button type="button" class="ncs-icon-btn" data-act="close" title="Chiudi">✕</button></span></div>
            <div class="ncs-body" id="ncs-roll-body"></div>`;
        document.body.appendChild(win);
        if (typeof window.makeDraggable === 'function') window.makeDraggable(win, win.querySelector('.ncs-header'));
        win.addEventListener('click', onClick);
        win.addEventListener('change', onChange);
        return win;
    }
    const isOpen = () => { const w = document.getElementById(WIN_ID); return !!(w && w.style.display !== 'none'); };
    function show() { const w = ensureWindow(); render(); w.style.display = 'flex'; }
    function hide() { const w = document.getElementById(WIN_ID); if (w) w.style.display = 'none'; }

    function diceHtml(pool, dice, dominant) {
        if (!dice || !dice.length) return '';
        return `<span style="margin-right:6px;white-space:nowrap;">${POOL_ICON[pool]}${dice.map(d =>
            `<span class="ncs-die" style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:4px;font-weight:900;font-size:12px;margin:1px;${POOL_STYLE[pool]}${d <= 3 ? 'box-shadow:0 0 0 2px #22c55e;' : 'opacity:0.75;'}">${d}</span>`).join('')}${dominant ? ' ★' : ''}</span>`;
    }

    function resultHtml(res) {
        const pools = ['discipline', 'exhaustion', 'madness', 'pain'].map(p => diceHtml(p, res.pools[p], res.dominant === p)).join('');
        const win = res.winner === 'player' ? '<span>vince il Protagonista</span>' : '<span>vince il GM</span>';
        const extra = [];
        if (res.voluntary) extra.push('<span>+1 Sfinimento volontario</span>');
        if (res.talent === 'minor') extra.push('<span>Talento di Sfinimento: uso minore</span>');
        if (res.talent === 'major') extra.push('<span>Talento di Sfinimento: uso maggiore</span>');
        const coinsLine = [];
        if (res.shadowsSpent) coinsLine.push(`🌑 <span>Ombre</span> ${res.shadowsSpent}`);
        if (res.hopeSpent) coinsLine.push(`🌕 <span>Migliorare i Successi</span> +${res.hopeSpent}`);
        if (res.rerolls) coinsLine.push(`🎭 <span>Cicatrice rievocata</span>`);
        const helpers = (res.helpersInfo || []).map(h => `<div style="background:rgba(34,197,94,0.10);border:1px dashed #22c55e;border-radius:5px;padding:2px 5px;margin:2px 0;">🤝 <b><span>Aiuto</span></b> — ${esc(h.name)}: ${diceHtml('discipline', h.dice)} <b>+${h.successes}</b> <span class="ncs-hint">(<span>solo successi, non conta per la Forza</span>)</span></div>`).join('');
        const dom = res.dominant
            ? `<div><span>Domina</span>: ${POOL_ICON[res.dominant]} <b><span>${POOL_NAME[res.dominant]}</span></b> → <span>${EFFECT_TEXT[res.effect]}</span></div>` : '';
        const fail = (res.winner === 'gm' && res.failureOptions.length)
            ? `<div style="color:#fca5a5;"><span>Conseguenza del fallimento (la sceglie il GM):</span> ${res.failureOptions.map(o => `<span>${FAIL_TEXT[o]}</span>`).join(' / ')}</div>` : '';
        return `<div style="border-left:3px solid #8b5cf6;padding-left:6px;margin:2px 0;font-size:12px;">
            <div style="color:#c4b5fd;font-weight:bold;">🌙 <span>Tiro di Non Cedere al Sonno</span>${extra.length ? ' · ' + extra.join(' · ') : ''}</div>
            <div style="margin:3px 0;line-height:1.7;">${pools}</div>
            ${helpers}${coinsLine.length ? `<div>${coinsLine.join(' · ')}</div>` : ''}
            <div><b><span>Protagonista</span></b> <span>Grado</span> <b>${res.playerGrade}</b> · <b><span>GM</span></b> <span>Grado</span> <b>${res.gmGrade}</b> → <b>${win}</b></div>
            ${dom}${fail}</div>`;
    }

    function choicesSummary(ch) {
        if (!ch) return '';
        const bits = [];
        if (ch.chosenMadness) bits.push(`<span>🔴 Follia scelta</span> ${ch.chosenMadness}`);
        if (ch.voluntary) bits.push('<span>+1 Sfinimento volontario</span>');
        if (ch.talent === 'minor') bits.push('<span>Talento di Sfinimento: uso minore</span>');
        if (ch.talent === 'major') bits.push('<span>Talento di Sfinimento: uso maggiore</span>');
        return bits.length ? `<div class="ncs-hint">${bits.join(' · ')}</div>` : '';
    }

    function canRollPlayerPart(c, tok) {
        if (!tok || !S() || !S().canEdit(tok)) return false;
        if (c && c.playerDice) return false;
        if (c && !isActive(c) && c.status !== 'concluded') return false;
        return true;
    }

    function render() {
        const body = document.getElementById('ncs-roll-body');
        if (!body) return;
        const c = conflict && conflict.status !== 'cancelled' ? conflict : null;
        const tok = tokenById(currentTokenId());
        const sheet = heroSheet();
        const heroEl = document.getElementById('ncs-roll-hero');
        if (heroEl) heroEl.textContent = (c && c.heroName) || (sheet && sheet.name) || (tok && tok.name) || '';
        const dm = isDM();
        const concluded = !!(c && c.status === 'concluded');
        const parts = [];

        // --- Protagonista ---
        parts.push('<div class="ncs-section-title"><span>Protagonista</span></div>');
        if (c && c.playerDice) {
            parts.push(`<div class="ncs-roll-row" style="line-height:1.7;">${diceHtml('discipline', c.playerDice.discipline)}${diceHtml('exhaustion', c.playerDice.exhaustion)}${diceHtml('madness', c.playerDice.madness)}</div>${choicesSummary(c.choices)}`);
        } else if (!concluded && sheet && canRollPlayerPart(c, tok)) {
            const p = preview(sheet);
            const talentMinorOk = (sheet.exhaustion || 0) >= 1 || choices.voluntary;
            parts.push(`
            <div class="ncs-roll-row"><span class="ncs-label">⚪ Disciplina</span><b class="ncs-val" id="ncs-roll-disc">${sheet.discipline}</b><span class="ncs-hint">dalla scheda</span></div>
            <div class="ncs-roll-row"><span class="ncs-label">⚫ Sfinimento</span><b class="ncs-val" id="ncs-roll-exh">${p.dp.exhaustion}</b>
                <label class="ncs-mini"><input type="checkbox" data-f="voluntary"${choices.voluntary ? ' checked' : ''}${(sheet.exhaustion >= MAX_EXH && !choices.voluntary) || choices.talent === 'major' ? ' disabled' : ''}> <span>+1 volontario</span></label></div>
            <div class="ncs-roll-row"><span class="ncs-label">🔴 Follia Permanente</span><b class="ncs-val">${sheet.permanentMadness}</b><span class="ncs-hint">dalla scheda</span></div>
            <div class="ncs-roll-row"><span class="ncs-label">🔴 Follia scelta</span>
                <button type="button" class="ncs-step" data-act="mad-">−</button><b class="ncs-val" id="ncs-roll-mad">${choices.chosenMadness}</b><button type="button" class="ncs-step" data-act="mad+">+</button><span class="ncs-hint">solo per questo tiro</span></div>
            <div class="ncs-roll-row"><span class="ncs-label">Talento di Sfinimento</span>
                <label class="ncs-mini"><input type="radio" name="ncs-talent" data-f="talent" value="none"${choices.talent === 'none' ? ' checked' : ''}> <span>no</span></label>
                <label class="ncs-mini"><input type="radio" name="ncs-talent" data-f="talent" value="minor"${choices.talent === 'minor' ? ' checked' : ''}${talentMinorOk ? '' : ' disabled'}> <span>uso minore</span></label>
                <label class="ncs-mini"><input type="radio" name="ncs-talent" data-f="talent" value="major"${choices.talent === 'major' ? ' checked' : ''}${(sheet.exhaustion >= MAX_EXH && choices.talent !== 'major') ? ' disabled' : ''}> <span>uso maggiore</span></label></div>
            <div class="ncs-counter"><span>Dadi nel tiro:</span> <b id="ncs-roll-count">${p.total}</b> / <b id="ncs-roll-max">${p.max}</b><br>
                <span class="ncs-hint">Puoi ancora aggiungere:</span> <span class="ncs-hint" id="ncs-roll-left">${p.canVoluntary ? '⚫ +1 · ' : ''}🔴 ${p.madnessLeft}</span></div>
            <button type="button" class="ncs-go" data-act="rollMine"${p.total > 0 ? '' : ' disabled'}>${dm ? '🎲 Tira i dadi del Protagonista' : '🎲 Tira i miei dadi'}</button>`);
        } else {
            parts.push('<div class="ncs-hint"><span>In attesa dei dadi del Protagonista</span></div>');
        }
        // Aiuti (solo successi di Disciplina, evidenziati)
        (c && c.helpers || []).forEach(h => {
            parts.push(`<div class="ncs-help-row">🤝 <b><span>Aiuto</span></b> — ${esc(h.heroName || h.player || '')}: ${diceHtml('discipline', h.dice)} <b>+${R().countSuccesses(h.dice)}</b></div>`);
        });
        // Monete e Cicatrici del Giocatore durante il conflitto (prima del Concludi)
        const live = !!(c && c.status === 'open' && c.playerDice);
        const mainTok = c ? tokenById(c.tokenId) : null;
        const iAmMain = !!(c && (dm ? !(c.owners || []).length : ownsConflict(c)));
        if (live && iAmMain && mainTok && S() && S().canEdit(mainTok)) {
            const sh = S().getSheetOf(mainTok);
            const scars = (sh.scars || []).map((x, i) => ({ x, i })).filter(o => o.x.text && !o.x.marked && !o.x.transformed);
            const poolsWithDice = ['discipline', 'exhaustion', 'madness'].filter(k => (c.playerDice[k] || []).length);
            const mine = (c.pending || []).filter(q => !dm && String(q.player || '').trim().toLowerCase() === myName());
            parts.push(`<div class="ncs-fx">
                <button type="button" data-act="hopeSuccess"${coinsNow().hope >= 1 ? '' : ' disabled'}>🌕 <span>+1 successo (1 Speranza)</span></button>
                ${scars.length && poolsWithDice.length ? `<select class="ncs-select" data-f="scarIdx">${scars.map(o => `<option value="${o.i}">${esc(o.x.text)}</option>`).join('')}</select>
                <select class="ncs-select" data-f="scarPool">${poolsWithDice.map(k => `<option value="${k}">${POOL_ICON[k]} ${POOL_NAME[k]}</option>`).join('')}</select>
                <button type="button" data-act="scarReroll">🎭 <span>Rievoca una Cicatrice</span></button>` : ''}
            </div>${mine.length ? '<div class="ncs-hint">⏳ <span>In attesa del Master</span></div>' : ''}`);
        }
        // Chi aiuta: un altro Giocatore tira la Disciplina del proprio Protagonista
        if (live && !dm && helperTokenId && !ownsConflict(c) && !helpsHere(c)) {
            const ht = tokenById(helperTokenId);
            if (ht && S() && S().canEdit(ht)) {
                const hs = S().getSheetOf(ht);
                parts.push(`<div class="ncs-sep"></div><button type="button" class="ncs-go" data-act="helpRoll"${hs.discipline > 0 ? '' : ' disabled'}>🤝 <span>Aiuta con la Disciplina</span> (${esc(hs.name || ht.name || '')}: ${hs.discipline})</button>`);
            }
        }

        // --- GM (Dolore) ---
        parts.push('<div class="ncs-sep"></div><div class="ncs-section-title"><span>GM</span> · 🟣 <span>Dolore</span></div>');
        if (c && c.painDice) {
            parts.push(`<div class="ncs-roll-row">${diceHtml('pain', c.painDice) || '<span class="ncs-hint">0</span>'}</div>`);
        } else if (dm && !concluded) {
            const pain = c ? c.pain : masterPain;
            parts.push(`<div class="ncs-roll-row"><span class="ncs-label">🟣 Dolore (GM)</span>
                <button type="button" class="ncs-step" data-act="pain-">−</button><b class="ncs-val" id="ncs-roll-pain">${pain}</b><button type="button" class="ncs-step" data-act="pain+">+</button></div>
                <button type="button" class="ncs-go ncs-go-pain" data-act="rollPain">🟣 Tira il Dolore</button>`);
        } else {
            parts.push(c && c.status !== 'draft'
                ? `<div class="ncs-hint"><span>In attesa del GM</span> · 🟣 ${c.pain}</div>`
                : '<div class="ncs-hint"><span>Lo imposta il GM</span></div>');
        }

        // --- Gettare un'Ombra (Master) e richieste dei Giocatori ---
        if (dm && c && c.status === 'open' && (c.playerDice || c.painDice)) {
            const cur = currentPools(c);
            const desp = coinsNow().despair;
            const btns = ['discipline', 'exhaustion', 'madness', 'pain'].filter(k => (cur[k] || []).length).map(k =>
                `<span class="ncs-shadow">${POOL_ICON[k]}<button type="button" data-act="shadow:${k}:add"${desp >= 1 ? '' : ' disabled'}>+6</button><button type="button" data-act="shadow:${k}:remove"${desp >= 1 && cur[k].includes(6) ? '' : ' disabled'}>−6</button></span>`).join('');
            parts.push(`<div class="ncs-sep"></div><div class="ncs-section-title">🌑 <span>Gettare un'Ombra</span> · <span>Disperazione</span> ${desp}</div><div class="ncs-fx">${btns}</div>`);
        }
        if (dm && c && (c.pending || []).length && c.status === 'open') {
            parts.push(`<div class="ncs-requests">${c.pending.map(q => `<div class="ncs-request"><b>${esc(q.player || '')}</b>: ${q.kind === 'hope'
                ? '🌕 <span>+1 successo (1 Speranza)</span>'
                : `🎭 <span>Rievoca una Cicatrice</span> «${esc(q.scarText || '')}» → ${POOL_ICON[q.pool] || ''} <span>${POOL_NAME[q.pool] || ''}</span>`}
                <div><button type="button" class="ncs-mini-btn ncs-light" data-act="pend-ok:${esc(q.id)}">✔ <span>Approva</span></button>
                <button type="button" class="ncs-mini-btn" data-act="pend-no:${esc(q.id)}">✖ <span>Rifiuta</span></button></div></div>`).join('')}</div>`);
        }

        // --- Comandi del Master ---
        if (dm && c && !concluded) {
            parts.push(`<div class="ncs-sep"></div><div class="ncs-roll-row">
                <label class="ncs-mini"><input type="checkbox" data-f="showAll"${c.showAll ? ' checked' : ''}> <span>Mostra a tutti</span></label></div>
                <div class="ncs-fx">
                    ${c.status === 'draft' ? '<button type="button" data-act="openConflict">📣 Apri il conflitto</button>' : ''}
                    <button type="button" data-act="conclude"${c.playerDice && c.painDice ? '' : ' disabled'}>✔ Concludi</button>
                    <button type="button" data-act="cancel">✖ Annulla</button>
                </div>`);
        }

        // --- Risultato ---
        const res = c ? (c.result || computeResult(c)) : null;
        if (res) {
            parts.push(`<div class="ncs-sep"></div><div class="ncs-section-title"><span>${concluded ? 'Conflitto concluso' : 'Risultato provvisorio'}</span></div>
                <div class="ncs-result" id="ncs-roll-result">${resultHtml(res)}${concluded ? effectsHtml(c, res) : ''}</div>`);
        }
        body.innerHTML = parts.join('');
    }

    // Pulsanti degli effetti a conflitto concluso. Dominanza: vale per TUTTI i partecipanti (Protagonista e aiutanti),
    // ognuno sulla propria scheda (chi la possiede; il Master se non e' di nessuno). Fallimento: Master, solo Protagonista.
    function effectsHtml(c, res) {
        if (usedFor !== c.id) { used = new Set(); usedFor = c.id; }
        const dm = isDM();
        const blocks = [];
        const parts = [{ tokenId: c.tokenId, owners: c.owners || [], main: true }]
            .concat((c.helpers || []).map(h => ({ tokenId: h.tokenId, owners: h.player ? [h.player] : [], main: false, name: h.heroName })));
        parts.forEach(pt => {
            const tok = tokenById(pt.tokenId);
            if (!tok || !S() || !S().canEdit(tok)) return;
            const mine = dm ? !(pt.owners || []).length : (pt.owners || []).some(o => String(o).trim().toLowerCase() === myName());
            const sheet = S().getSheetOf(tok);
            const key = (a) => a + '@' + pt.tokenId;
            const btn = (a, label, disabled) => `<button type="button" data-act="${key(a)}"${disabled || used.has(key(a)) ? ' disabled' : ''}>${label}</button>`;
            const freeOf = (type) => sheet.reactions.some(r => !r.filled && r.type === type);
            const anyFree = sheet.reactions.some(r => !r.filled);
            const anyFilled = sheet.reactions.some(r => r.filled);
            const out = [], alerts = [];
            if (mine) {
                const domChoiceUsed = used.has(key('dom-lessExh')) || used.has(key('dom-freeReaction'));
                if (res.dominant === 'discipline') {
                    out.push(btn('dom-lessExh', '⚪ −1 Sfinimento', sheet.exhaustion <= 0 || domChoiceUsed));
                    out.push(btn('dom-freeReaction', '⚪ Libera una Reazione', !anyFilled || domChoiceUsed));
                }
                if (res.dominant === 'exhaustion') {
                    if (sheet.exhaustion >= MAX_EXH && !used.has(key('dom-moreExh'))) alerts.push('Crolli!');
                    out.push(btn('dom-moreExh', sheet.exhaustion >= MAX_EXH ? '⚫ Crollo' : '⚫ +1 Sfinimento', false));
                }
                if (res.dominant === 'madness') {
                    const fillUsed = used.has(key('dom-fillFight')) || used.has(key('dom-fillFlight')) || used.has(key('dom-snap'));
                    if (!anyFree && !fillUsed) { alerts.push('Schizzi!'); out.push(btn('dom-snap', '🔴 Schizzi', false)); }
                    else {
                        out.push(btn('dom-fillFight', '🔴 Riempi Lotta', !freeOf('fight') || fillUsed));
                        out.push(btn('dom-fillFlight', '🔴 Riempi Fuggi', !freeOf('flight') || fillUsed));
                    }
                }
            }
            if (dm && pt.main && res.winner === 'gm') {
                const failUsed = ['fail-moreExh', 'fail-fillFight', 'fail-fillFlight', 'fail-snap'].some(a => used.has(key(a)));
                if (res.failureOptions.includes('gainExhaustion')) out.push(btn('fail-moreExh', sheet.exhaustion >= MAX_EXH ? 'GM: Crollo' : 'GM: +1 Sfinimento', failUsed));
                if (res.failureOptions.includes('fillReaction')) {
                    if (!anyFree && !failUsed) out.push(btn('fail-snap', 'GM: Schizzi', false));
                    else {
                        out.push(btn('fail-fillFight', 'GM: Riempi Lotta', !freeOf('fight') || failUsed));
                        out.push(btn('fail-fillFlight', 'GM: Riempi Fuggi', !freeOf('flight') || failUsed));
                    }
                }
            }
            if (!out.length) return;
            const title = parts.length > 1 ? `<div class="ncs-hint">${pt.main ? '' : '🤝 '}${esc(sheet.name || tok.name || '')}</div>` : '';
            blocks.push(`${title}${alerts.map(a => `<div class="ncs-alert">⚠️ <span>${a}</span></div>`).join('')}<div class="ncs-fx">${out.join('')}</div>`);
        });
        return blocks.join('');
    }

    // ---------------- Effetti sulla scheda ----------------
    const fillReaction = (s, type) => { const r = s.reactions.find(x => !x.filled && x.type === type); if (r) r.filled = true; };
    const freeReaction = (s) => { const r = s.reactions.find(x => x.filled); if (r) r.filled = false; };
    const snap = (s) => { s.reactions.forEach(r => { r.filled = false; }); s.discipline = Math.max(0, s.discipline - 1); s.permanentMadness += 1; };
    const crash = (s) => { s.exhaustion = 0; s.reactions.forEach(r => { r.filled = false; }); };
    const moreExhaustion = (s) => { if (s.exhaustion >= MAX_EXH) crash(s); else s.exhaustion += 1; };
    const EFFECTS = {
        'dom-lessExh': s => { s.exhaustion = Math.max(0, s.exhaustion - 1); },
        'dom-freeReaction': freeReaction,
        'dom-moreExh': moreExhaustion,
        'dom-fillFight': s => fillReaction(s, 'fight'),
        'dom-fillFlight': s => fillReaction(s, 'flight'),
        'dom-snap': snap,
        'fail-moreExh': moreExhaustion,
        'fail-fillFight': s => fillReaction(s, 'fight'),
        'fail-fillFlight': s => fillReaction(s, 'flight'),
        'fail-snap': snap
    };
    // act: 'dom-moreExh@tokenId' (senza @ = Protagonista del conflitto)
    function applyEffect(actKey) {
        const c = conflict;
        if (!c || c.status !== 'concluded') return false;
        const at = String(actKey).indexOf('@');
        const act = at >= 0 ? actKey.slice(0, at) : actKey;
        const tokenId = at >= 0 ? actKey.slice(at + 1) : c.tokenId;
        const key = act + '@' + tokenId;
        if (!EFFECTS[act]) return false;
        if (act.startsWith('fail-') && tokenId !== c.tokenId) return false;
        if (tokenId !== c.tokenId && !(c.helpers || []).some(h => h.tokenId === tokenId)) return false;
        if (usedFor !== c.id) { used = new Set(); usedFor = c.id; }
        if (used.has(key)) return false;
        const tok = tokenById(tokenId);
        const ok = !!(tok && S().applyToToken(tok, EFFECTS[act]));
        if (ok) used.add(key);
        render();
        return ok;
    }

    // ---------------- Azioni ----------------
    function rollPlayerPart() {
        const tok = tokenById(currentTokenId());
        const sheet = heroSheet();
        if (!tok || !sheet || !R() || !S().canEdit(tok)) return null;
        if (conflict && conflict.status !== 'cancelled' && conflict.status !== 'concluded' && conflict.tokenId !== tok.id) { warn(REJECT_TEXT.busy); return null; }
        if (!conflict || conflict.status === 'cancelled' || conflict.status === 'concluded' || conflict.tokenId !== tok.id) conflict = newConflict(tok, sheet);
        if (conflict.playerDice) { warn(REJECT_TEXT.already); return null; }
        const voluntary = !!choices.voluntary && sheet.exhaustion < MAX_EXH;
        const dp = R().dicePools(sheet, { chosenMadness: choices.chosenMadness, voluntaryExhaustion: voluntary });
        let dice;
        if (nextDice) { dice = nextDice; nextDice = null; }
        else { const r = R().rollDice({ discipline: dp.discipline, exhaustion: dp.exhaustion, madness: dp.madness }); dice = { discipline: r.discipline, exhaustion: r.exhaustion, madness: r.madness }; }
        const ch = { chosenMadness: choices.chosenMadness, voluntary, talent: choices.talent };
        // Il +1 volontario resta: diventa subito la nuova base della scheda
        if (voluntary) S().applyToToken(tok, s => { s.exhaustion = dp.newExhaustion; });
        choices = { chosenMadness: 0, voluntary: false, talent: 'none' };
        stats.playerRolls++;
        conflict.playerDice = dice;
        conflict.choices = ch;
        conflict.heroName = sheet.name || tok.name || conflict.heroName;
        if (isDM()) {
            if (conflict.status === 'draft') conflict.status = 'open';
            broadcastState();
        } else {
            conflict.status = 'open';
            const net = getNetwork();
            send('dm', 'playerRoll', { tokenId: tok.id, player: (net && net.playerName) || null, dice, choices: ch, heroName: conflict.heroName });
        }
        render();
        return dice;
    }

    function rollPain() {
        if (!isDM() || !conflict || !isActive(conflict) || conflict.painDice) return null;
        let pain;
        if (nextPain) { pain = nextPain; nextPain = null; }
        else pain = R().rollDice({ pain: conflict.pain }).pain;
        stats.painRolls++;
        conflict.painDice = pain;
        conflict.status = 'open';
        broadcastState();
        render();
        return pain;
    }

    function conclude() {
        if (!isDM() || !conflict || !isActive(conflict) || !conflict.playerDice || !conflict.painDice) return null;
        conflict.status = 'concluded';
        broadcastState();
        stats.concluded++;
        // Le Monete spese per Gettare un'Ombra passano nella Coppa della Speranza a fine conflitto
        const sh = shadowCount(conflict);
        if (sh && window.ncsCoins && typeof window.ncsCoins.addHope === 'function') window.ncsCoins.addHope(sh);
        sendToChat(conflict.result);
        // Il Dolore Domina: +1 Moneta nella Coppa della Disperazione (non se il Dolore Domina grazie a un'Ombra)
        if (conflict.result && conflict.result.despairGain && window.ncsCoins && typeof window.ncsCoins.addDespair === 'function') window.ncsCoins.addDespair(conflict.result.despairGain);
        render();
        return conflict.result;
    }

    // ---- Monete e Cicatrici nel conflitto (C5) ----
    function castShadow(pool, action) {
        if (!isDM() || !conflict || conflict.status !== 'open') return false;
        const cur = currentPools(conflict);
        const test = R().castShadow(cur, pool, action);
        if (!test.ok) return false;
        if (!window.ncsCoins || !window.ncsCoins.spendDespair(1)) { warn(REJECT_TEXT.notEnoughDespair); return false; }
        conflict.mods.push({ type: 'shadow', pool, action });
        broadcastState(); render();
        return true;
    }
    // Il Master applica una richiesta (approvata, o sua diretta): { ok, reason }
    function applyRequest(q) {
        const c = conflict;
        if (!c || c.status !== 'open' || !c.playerDice) return { ok: false, reason: 'noConflict' };
        if (q.kind === 'hope') {
            if (!window.ncsCoins || !window.ncsCoins.spendHope(1)) return { ok: false, reason: 'notEnoughHope' };
            c.mods.push({ type: 'hope' });
            return { ok: true };
        }
        if (q.kind === 'scar') {
            const tok = tokenById(c.tokenId);
            const sh = tok && S() ? S().getSheetOf(tok) : null;
            const sc = sh && sh.scars[q.scarIndex];
            const n = (c.playerDice[q.pool] || []).length;
            if (!sc || sc.marked || sc.transformed || !n) return { ok: false, reason: 'invalid' };
            let dice;
            if (nextReroll) { dice = nextReroll; nextReroll = null; } else dice = R().rollDice({ [q.pool]: n })[q.pool];
            c.playerDice[q.pool] = dice;
            c.rerolls = (c.rerolls || 0) + 1;
            S().applyToToken(tok, s => { if (s.scars[q.scarIndex]) s.scars[q.scarIndex].marked = true; });
            return { ok: true };
        }
        return { ok: false, reason: 'invalid' };
    }
    function answer(q, res) {
        send('players', 'reject', { player: q.player, tokenId: conflict && conflict.tokenId, reason: res.ok ? 'ok' : res.reason, ok: !!res.ok, kind: q.kind });
    }
    function resolvePending(id, ok) {
        if (!isDM() || !conflict) return null;
        const i = (conflict.pending || []).findIndex(q => q.id === id);
        if (i < 0) return null;
        const q = conflict.pending.splice(i, 1)[0];
        const res = ok ? applyRequest(q) : { ok: false, reason: 'requestRejected' };
        if (ok && !res.ok) warn(REJECT_TEXT[res.reason] || REJECT_TEXT.invalid);
        answer(q, res);
        broadcastState(); render();
        return res;
    }
    // Il Giocatore (o il Master per un Protagonista senza proprietario) chiede Luce o una Cicatrice
    function requestLive(kind, extra) {
        const c = conflict;
        if (!c || c.status !== 'open' || !c.playerDice) return null;
        if (isDM()) {
            const res = applyRequest(Object.assign({ kind }, extra || {}));
            if (!res.ok) warn(REJECT_TEXT[res.reason] || REJECT_TEXT.invalid);
            broadcastState(); render();
            return res;
        }
        if (kind === 'hope' && coinsNow().hope < 1) { warn(REJECT_TEXT.notEnoughHope); return null; }
        const net = getNetwork();
        const msgKind = kind === 'hope' ? 'hopeSuccess' : 'scarRequest';
        send('dm', msgKind, Object.assign({ tokenId: c.tokenId, player: (net && net.playerName) || null }, extra || {}));
        c.pending = (c.pending || []).concat([{ id: 'local', kind, player: (net && net.playerName) || '' }]);
        render();
        return { ok: true, sent: true };
    }
    // Aiuto: il Giocatore tira la Disciplina del proprio Protagonista e la manda al Master
    function helpRoll() {
        const c = conflict;
        const tok = tokenById(helperTokenId);
        if (!c || c.status !== 'open' || !c.playerDice || !tok || !S() || !S().canEdit(tok) || tok.id === c.tokenId) return null;
        const sh = S().getSheetOf(tok);
        let dice;
        if (nextHelp) { dice = nextHelp; nextHelp = null; } else dice = R().rollDice({ discipline: sh.discipline }).discipline;
        if (isDM()) { addHelper(tok, (ownersOf(tok)[0] || ''), dice, sh.name || tok.name); return dice; }
        const net = getNetwork();
        send('dm', 'helpRoll', { tokenId: tok.id, player: (net && net.playerName) || null, dice, heroName: sh.name || tok.name || '' });
        return dice;
    }
    function addHelper(tok, player, dice, heroName) {
        if (conflict.helpers.some(h => h.tokenId === tok.id)) return { ok: false, reason: 'alreadyHelped' };
        conflict.helpers.push({ tokenId: tok.id, player: player || '', heroName: String(heroName || tok.name || '').slice(0, 80), dice });
        broadcastState(); render();
        return { ok: true };
    }

    function sendToChat(res) {
        if (!res) return;
        const id = 'roll_ncs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        const payload = {
            id, sender: res.heroName || 'Protagonista', isPublic: true, customHtml: resultHtml(res),
            formula: 'Non Cedere al Sonno', result: `${res.playerGrade}-${res.gmGrade}`,
            ncsRoll: { tokenId: conflict && conflict.tokenId, playerGrade: res.playerGrade, gmGrade: res.gmGrade, winner: res.winner, dominant: res.dominant, despairGain: res.despairGain, pools: res.pools }
        };
        if (typeof window.appendRollToChat === 'function') window.appendRollToChat(payload);
        const cp = document.getElementById('chat-panel');
        if (cp) cp.style.display = 'flex';
        const net = getNetwork();
        try { if (net && net.mode && typeof net.send === 'function') net.send({ type: 'DICE_ROLL', payload }); }
        catch (e) { console.warn('[NCS] invio del tiro:', e); }
    }

    // ---------------- Messaggi in arrivo ----------------
    function onMasterMessage(data, ctx) {
        const p0 = data.payload || {};
        if (data.kind === 'hopeSuccess' || data.kind === 'scarRequest' || data.kind === 'helpRoll') {
            const sender = ctx.senderName || p0.player || '';
            const tok = tokenById(p0.tokenId);
            const no = (reason) => { stats.rejects++; send('players', 'reject', { player: sender, tokenId: p0.tokenId, reason }); };
            if (!conflict || conflict.status !== 'open' || !conflict.playerDice) return no('noConflict');
            if (!tok) return no('noToken');
            const owned = typeof isTokenOwnedBy === 'function' ? isTokenOwnedBy(tok, sender) : ownersOf(tok).some(o => o.toLowerCase() === String(sender).toLowerCase());
            if (!owned) return no('notOwner');
            if (data.kind === 'helpRoll') {
                if (tok.id === conflict.tokenId) return no('invalid');
                const clean = (Array.isArray(p0.dice) ? p0.dice : []).slice(0, 6).map(v => Math.max(1, Math.min(6, Math.floor(Number(v)) || 1)));
                const res = addHelper(tok, sender, clean, p0.heroName);
                if (!res.ok) no(res.reason);
                show();
                return;
            }
            if (tok.id !== conflict.tokenId) return no('invalid');
            const q = { id: 'pq_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), kind: data.kind === 'hopeSuccess' ? 'hope' : 'scar', player: sender };
            if (q.kind === 'scar') {
                const sh = S() ? S().getSheetOf(tok) : null;
                const idx = Math.floor(Number(p0.scarIndex));
                const pool = ['discipline', 'exhaustion', 'madness'].includes(p0.pool) ? p0.pool : null;
                if (!sh || !sh.scars[idx] || sh.scars[idx].marked || sh.scars[idx].transformed || !pool) return no('invalid');
                q.scarIndex = idx; q.pool = pool; q.scarText = sh.scars[idx].text;
            }
            conflict.pending.push(q);
            dismissed = null;
            broadcastState(); show();
            return;
        }
        if (data.kind !== 'playerRoll') return;
        const p = data.payload || {};
        const tok = tokenById(p.tokenId);
        const reject = (reason) => { stats.rejects++; send('players', 'reject', { player: p.player || ctx.senderName || null, tokenId: p.tokenId, reason }); };
        if (!tok) return reject('noToken');
        const sender = ctx.senderName || p.player || '';
        const owned = typeof isTokenOwnedBy === 'function' ? isTokenOwnedBy(tok, sender) : ownersOf(tok).some(o => o.toLowerCase() === String(sender).toLowerCase());
        if (!owned) return reject('notOwner');
        if (isBlocking(conflict) && conflict.tokenId !== tok.id) return reject('busy');
        if (isActive(conflict) && conflict.tokenId === tok.id && conflict.playerDice) return reject('already');
        if (!(isActive(conflict) && conflict.tokenId === tok.id)) conflict = newConflict(tok, S() ? S().getSheetOf(tok) : null);
        const d = p.dice || {};
        const clean = (a) => (Array.isArray(a) ? a : []).slice(0, 30).map(v => Math.max(1, Math.min(6, Math.floor(Number(v)) || 1)));
        conflict.playerDice = { discipline: clean(d.discipline), exhaustion: clean(d.exhaustion), madness: clean(d.madness) };
        const ch = p.choices || {};
        conflict.choices = { chosenMadness: Math.max(0, Math.min(MAX_CHOSEN, Number(ch.chosenMadness) || 0)), voluntary: !!ch.voluntary, talent: (ch.talent === 'minor' || ch.talent === 'major') ? ch.talent : 'none' };
        if (p.heroName) conflict.heroName = String(p.heroName).slice(0, 80);
        conflict.owners = ownersOf(tok);
        conflict.status = 'open';
        dismissed = null;
        broadcastState();
        show();
    }

    function applyState(c) {
        if (!c || !c.id) return;
        const stamp = c.id + '@' + c.updatedAt;
        if (stamp === lastApplied) return;
        lastApplied = stamp;
        if (c.status === 'cancelled') {
            if (conflict && conflict.id === c.id) { conflict = null; if (isOpen()) hide(); }
            return;
        }
        // Un mio tiro preparato (in attesa) per lo stesso Protagonista viene sostituito dallo stato del Master
        conflict = c;
        if (involvedHere(c)) {
            if (dismissed && dismissed.id === c.id && dismissed.updatedAt === c.updatedAt) return;
            show();
        } else if (isOpen()) hide();
    }

    function onPlayerMessage(data) {
        const p = data.payload || {};
        if (data.kind === 'state') applyState(p.conflict);
        else if (data.kind === 'reject') {
            if (!p.player || String(p.player).trim().toLowerCase() !== myName()) return;
            if (p.kind) {                        // risposta a Luce / Cicatrice: lo stato arriva a parte
                if (!p.ok) warn(REJECT_TEXT[p.reason] || REJECT_TEXT.requestRejected);
                return;
            }
            if (['noConflict', 'alreadyHelped', 'invalid'].includes(p.reason)) { warn(REJECT_TEXT[p.reason]); return; }
            if (conflict && conflict.tokenId === p.tokenId && conflict.status === 'open' && !conflict.painDice) {
                conflict = null;
                if (isOpen()) render();
            }
            warn(REJECT_TEXT[p.reason] || REJECT_TEXT.busy);
        }
    }

    // ---------------- Eventi ----------------
    function onClick(e) {
        const btn = e.target.closest('[data-act]');
        if (!btn || btn.disabled) return;
        doAction(btn.getAttribute('data-act'));
    }

    function doAction(act) {
        if (act === 'close') { api.close(); return; }
        if (act === 'rollMine') { rollPlayerPart(); return; }
        if (act === 'rollPain') { rollPain(); return; }
        if (act === 'conclude') { conclude(); return; }
        if (act === 'cancel') {
            if (isDM() && conflict) {
                // Le Monete spese in un conflitto annullato tornano nelle loro Coppe
                const back = { despair: shadowCount(conflict), hope: hopeCount(conflict) };
                if ((back.despair || back.hope) && window.ncsCoins && window.ncsCoins.refund) window.ncsCoins.refund(back);
                conflict.status = 'cancelled'; broadcastState(); conflict = null;
            }
            hide(); return;
        }
        if (act.startsWith('shadow:')) { const [, pool, how] = act.split(':'); castShadow(pool, how); return; }
        if (act.startsWith('pend-ok:')) { resolvePending(act.slice(8), true); return; }
        if (act.startsWith('pend-no:')) { resolvePending(act.slice(8), false); return; }
        if (act === 'hopeSuccess') { requestLive('hope'); return; }
        if (act === 'scarReroll') {
            const w = document.getElementById(WIN_ID);
            const iSel = w && w.querySelector('[data-f="scarIdx"]'), pSel = w && w.querySelector('[data-f="scarPool"]');
            if (iSel && pSel) requestLive('scar', { scarIndex: Number(iSel.value), pool: pSel.value });
            return;
        }
        if (act === 'helpRoll') { helpRoll(); return; }
        if (act === 'openConflict') { if (isDM() && conflict && conflict.status === 'draft') { conflict.status = 'open'; broadcastState(); render(); } return; }
        if (act.startsWith('dom-') || act.startsWith('fail-')) { applyEffect(act); return; }
        if (act === 'mad-') choices.chosenMadness = Math.max(0, choices.chosenMadness - 1);
        else if (act === 'mad+') choices.chosenMadness = Math.min(MAX_CHOSEN, choices.chosenMadness + 1);
        else if (act === 'pain-' || act === 'pain+') {
            const d = act === 'pain+' ? 1 : -1;
            if (conflict && isActive(conflict) && !conflict.painDice) {
                conflict.pain = Math.max(0, Math.min(30, (conflict.pain || 0) + d)); masterPain = conflict.pain;
                if (conflict.status === 'open') broadcastState();
            } else masterPain = Math.max(0, Math.min(30, masterPain + d));
        } else return;
        render();
    }

    function onChange(e) {
        const el = e.target;
        const f = el.getAttribute && el.getAttribute('data-f');
        if (f === 'voluntary') choices.voluntary = !!el.checked;
        else if (f === 'talent') {
            choices.talent = (el.value === 'minor' || el.value === 'major') ? el.value : 'none';
            if (choices.talent === 'major') choices.voluntary = true; // l'uso maggiore richiede il +1 Sfinimento
        } else if (f === 'showAll') {
            if (isDM() && conflict) { conflict.showAll = !!el.checked; if (conflict.status !== 'draft') broadcastState(); }
        } else return;
        render();
    }

    const api = {
        // Dal pulsante 🎲 Tira della scheda
        open(tok) {
            if (!tok || !S() || !S().canEdit(tok)) return;
            if (isBlocking(conflict) && conflict.tokenId !== tok.id) {
                if (isDM()) { warn(REJECT_TEXT.busy); dismissed = null; show(); return; } // mostra il conflitto in corso
                // Un altro Giocatore puo' aiutare con la Disciplina del proprio Protagonista
                if (conflict.status === 'open' && conflict.playerDice) { helperTokenId = tok.id; dismissed = null; show(); return; }
                warn(REJECT_TEXT.busy); return;
            }
            helperTokenId = null;
            if (!(isActive(conflict) && conflict.tokenId === tok.id)) {
                if (viewTokenId !== tok.id) choices = { chosenMadness: 0, voluntary: false, talent: 'none' };
                viewTokenId = tok.id;
                if (isDM()) conflict = newConflict(tok, S().getSheetOf(tok)); // bozza del Master: parte solo con "Apri" o un tiro
                else if (conflict && !isActive(conflict)) conflict = null;
            }
            dismissed = null;
            show();
        },
        close() {
            if (conflict) dismissed = { id: conflict.id, updatedAt: conflict.updatedAt };
            if (isDM() && conflict && conflict.status === 'draft' && !conflict.playerDice) conflict = null; // bozza abbandonata
            hide();
        },
        refresh() { if (isOpen()) render(); },
        onNetworkMessage(data, ctx) {
            if (!data) return;
            if (ctx && ctx.isDM) { if (data.to === 'dm') onMasterMessage(data, ctx || {}); }
            else if (data.to === 'players') onPlayerMessage(data);
        },
        getSharedState() { return (isDM() && conflict && conflict.status === 'open') ? { conflict } : null; },
        applySharedState(sys) { if (!isDM() && sys && sys.conflict) applyState(sys.conflict); },
        // Per i test
        _do: doAction,
        _rollPlayer: rollPlayerPart,
        _rollPain: rollPain,
        _conclude: conclude,
        _applyEffect: applyEffect,
        _setNextDice(d) { nextDice = d; },
        _setNextPain(d) { nextPain = d; },
        _setNextReroll(d) { nextReroll = d; },
        _setNextHelp(d) { nextHelp = d; },
        _castShadow: castShadow,
        _requestHope: () => requestLive('hope'),
        _requestScar: (scarIndex, pool) => requestLive('scar', { scarIndex, pool }),
        _resolvePending: resolvePending,
        _helpRoll: helpRoll,
        _currentPools: () => currentPools(conflict),
        _setChoices(o) { Object.assign(choices, o || {}); if (isOpen()) render(); },
        _setPain(n) { if (conflict && isActive(conflict)) conflict.pain = n; masterPain = n; if (isOpen()) render(); },
        _state: () => ({ conflict: conflict ? JSON.parse(JSON.stringify(conflict)) : null, choices: Object.assign({}, choices), used: Array.from(used), open: isOpen(), stats: Object.assign({}, stats) }),
        _preview: () => { const s = heroSheet(); return s ? preview(s) : null; }
    };

    if (typeof window !== 'undefined') window.ncsRoll = api;
})();
