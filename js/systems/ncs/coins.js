// js/systems/ncs/coins.js
// Modulo "Non Cedere al Sonno" — le due Coppe (passo C4).
// - Coppa della Disperazione (GM) e Coppa della Speranza (Giocatori): valore valido sul Master, salvato nella campagna
//   (campo ncsCoins), inviato a tutti nel pacchetto condiviso (STATE_SYNC.sys) e con SYS_MSG kind 'coins'.
// - +1 Disperazione automatica quando il Dolore Domina alla conclusione del conflitto (chiamata da roll.js).
// - Porta Luce (Speranza): Tirare il Fiato (1 Moneta = -1 Sfinimento oppure libera una Reazione) e Recuperare la
//   Disciplina (5 - Disciplina Monete: -1 Follia Permanente, +1 Disciplina). Il Giocatore chiede, il Master Approva o
//   Rifiuta (decisione utente 17/11); approvata la richiesta, il resto e' automatico. Il Master puo' usarlo direttamente.
// - Fine sessione (Master): conferma, Coppe svuotate, segni delle Cicatrici cancellati sulle schede in mappa.
(function () {
    'use strict';
    const WIN_ID = 'ncs-coins';
    let coins = { despair: 0, hope: 0 };
    let coinsCampaign = null;      // campagna a cui si riferiscono (Master)
    let loading = false;
    let requests = [];             // richieste in attesa (Master)
    let panelOpen = false;         // pannello Porta Luce aperto
    let form = { tokenId: null, action: 'breathExhaustion', count: 1 };
    const stats = { saves: 0, broadcasts: 0, approved: 0, rejected: 0 };

    const T = (s) => { try { return (typeof window.t === 'function') ? window.t(s) : s; } catch (e) { return s; } };
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const getEngine = () => (typeof engine !== 'undefined' && engine) ? engine : window.engine;
    const getNetwork = () => (typeof network !== 'undefined' && network) ? network : window.network;
    const isDM = () => { const e = getEngine(); return !!(e && e.isDM); };
    const S = () => window.ncsSheetManager;
    const isNcs = () => !!(window.systemManager && window.systemManager.getActiveSystemId() === 'ncs');
    const campaignId = () => { try { return (typeof getActiveCampaignIdSafe === 'function') ? getActiveCampaignIdSafe() : ''; } catch (e) { return ''; } };
    const notify = (m, lvl) => { if (lvl === 'warn' && typeof window.vttWarn === 'function') window.vttWarn(T(m)); else if (typeof window.vttNotify === 'function') window.vttNotify(T(m)); };
    const myName = () => { const n = getNetwork(); return (n && n.playerName) ? String(n.playerName).trim() : ''; };
    const clamp = (v) => Math.max(0, Math.min(999, Math.floor(Number(v)) || 0));

    function send(to, kind, payload) {
        const net = getNetwork();
        try { if (net && typeof net.send === 'function') net.send({ type: 'SYS_MSG', sys: 'ncs', to, kind, payload }); } catch (e) { console.warn('[NCS] Coppe:', e); }
    }
    function tokenById(id) { const e = getEngine(); return (e && Array.isArray(e.tokens)) ? (e.tokens.find(t => t.id === id) || null) : null; }
    function ownsToken(tok, name) {
        if (!tok || !name) return false;
        if (typeof isTokenOwnedBy === 'function') return isTokenOwnedBy(tok, name);
        const list = Array.isArray(tok.owners) && tok.owners.length ? tok.owners : (tok.owner ? [tok.owner] : []);
        return list.some(o => String(o).trim().toLowerCase() === String(name).trim().toLowerCase());
    }
    function ncsHeroes() {
        const e = getEngine();
        const list = (e && Array.isArray(e.tokens)) ? e.tokens.filter(t => t.pcSheet && t.pcSheet.system === 'ncs') : [];
        if (isDM()) return list;
        return list.filter(t => S() && S().canEdit(t));
    }

    // ---------------- Master: salvataggio e invio ----------------
    async function ensureCampaign() {
        if (!isDM() || loading) return;
        const id = campaignId();
        if (!id || id === coinsCampaign) return;
        loading = true;
        try {
            const camp = (typeof vttDB !== 'undefined' && vttDB.getCampaign) ? await vttDB.getCampaign(id) : null;
            const c = (camp && camp.ncsCoins) || {};
            coins = { despair: clamp(c.despair), hope: clamp(c.hope) };
            coinsCampaign = id;
            requests = [];
            render();
        } catch (e) { console.warn('[NCS] Coppe, lettura campagna:', e); }
        finally { loading = false; }
    }

    function save() {
        if (!isDM()) return;
        const id = campaignId();
        if (!id) return;
        coinsCampaign = id;
        stats.saves++;
        try { if (typeof vttDB !== 'undefined' && vttDB.updateCampaignField) vttDB.updateCampaignField(id, 'ncsCoins', { despair: coins.despair, hope: coins.hope }); }
        catch (e) { console.warn('[NCS] Coppe, salvataggio:', e); }
    }

    function changed() {
        save();
        stats.broadcasts++;
        send('players', 'coins', { coins: Object.assign({}, coins) });
        render();
    }

    function chatLine(html) {
        const id = 'roll_ncsc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        const payload = { id, sender: '🌙', isPublic: true, customHtml: `<div style="border-left:3px solid #eab308;padding-left:6px;font-size:12px;">${html}</div>`, formula: 'NCS', result: '' };
        if (typeof window.appendRollToChat === 'function') window.appendRollToChat(payload);
        const net = getNetwork();
        try { if (net && net.mode && typeof net.send === 'function') net.send({ type: 'DICE_ROLL', payload }); } catch (e) { /* ignora */ }
    }

    // ---------------- Porta Luce ----------------
    // Costo e modifica della scheda per un'azione; null se non possibile
    function plan(sheet, action, count) {
        const n = Math.max(1, Math.min(10, Math.floor(Number(count)) || 1));
        if (!sheet) return null;
        if (action === 'breathExhaustion') {
            const k = Math.min(n, sheet.exhaustion || 0);
            if (k <= 0) return null;
            return { cost: k, label: 'Tirare il Fiato', detail: `<span>Sfinimento</span> −${k}`, fn: s => { s.exhaustion = Math.max(0, s.exhaustion - k); } };
        }
        if (action === 'breathReaction') {
            const filled = (sheet.reactions || []).filter(r => r.filled).length;
            const k = Math.min(n, filled);
            if (k <= 0) return null;
            return { cost: k, label: 'Tirare il Fiato', detail: `<span>Reazioni liberate</span> ${k}`, fn: s => { let left = k; s.reactions.forEach(r => { if (left > 0 && r.filled) { r.filled = false; left--; } }); } };
        }
        if (action === 'recoverDiscipline') {
            if ((sheet.permanentMadness || 0) <= 0) return null;
            const cost = Math.max(1, 5 - (sheet.discipline || 0));
            return { cost, label: 'Recuperare la Disciplina', detail: '<span>Disciplina</span> +1 · <span>Follia Permanente</span> −1', fn: s => { s.discipline += 1; s.permanentMadness = Math.max(0, s.permanentMadness - 1); } };
        }
        return null;
    }

    // Master: esegue una spesa di Speranza (approvata o diretta). { ok, reason }
    function executeHope(tokenId, action, count, who) {
        const tok = tokenById(tokenId);
        if (!tok || !S()) return { ok: false, reason: 'noToken' };
        const p = plan(S().getSheetOf(tok), action, count);
        if (!p) return { ok: false, reason: 'notApplicable' };
        if (coins.hope < p.cost) return { ok: false, reason: 'notEnough' };
        if (!S().applyToToken(tok, p.fn)) return { ok: false, reason: 'noToken' };
        coins.hope -= p.cost; // la Moneta di Speranza spesa esce dal gioco
        changed();
        chatLine(`🌕 <b>${esc(who || tok.name || '')}</b> · <span>Porta Luce</span>: <span>${p.label}</span> · ${p.detail} · <span>Monete di Speranza</span> −${p.cost}`);
        return { ok: true, cost: p.cost };
    }

    const REASON_TEXT = {
        notEnough: 'Non ci sono abbastanza Monete di Speranza.',
        notApplicable: 'Questa azione non si può usare ora su questo Protagonista.',
        noToken: 'Protagonista non trovato sulla mappa.',
        rejected: 'Il Master ha rifiutato la richiesta di Portare Luce.',
        notOwner: 'Questo Protagonista non è tuo.'
    };

    function approve(reqId) {
        const i = requests.findIndex(r => r.id === reqId);
        if (i < 0) return null;
        const r = requests.splice(i, 1)[0];
        const res = executeHope(r.tokenId, r.action, r.count, r.player);
        send('players', 'hopeAnswer', { player: r.player, ok: res.ok, reason: res.ok ? null : res.reason });
        if (res.ok) stats.approved++; else notify(REASON_TEXT[res.reason] || REASON_TEXT.notApplicable, 'warn');
        render();
        return res;
    }
    function reject(reqId) {
        const i = requests.findIndex(r => r.id === reqId);
        if (i < 0) return;
        const r = requests.splice(i, 1)[0];
        stats.rejected++;
        send('players', 'hopeAnswer', { player: r.player, ok: false, reason: 'rejected' });
        render();
    }

    // Dal pannello: il Master spende subito, il Giocatore chiede al Master
    function submitForm() {
        const tok = tokenById(form.tokenId) || ncsHeroes()[0];
        if (!tok) { notify(REASON_TEXT.noToken, 'warn'); return null; }
        const p = plan(S().getSheetOf(tok), form.action, form.count);
        if (!p) { notify(REASON_TEXT.notApplicable, 'warn'); return null; }
        if (coins.hope < p.cost) { notify(REASON_TEXT.notEnough, 'warn'); return null; }
        if (isDM()) { const res = executeHope(tok.id, form.action, form.count, null); panelOpen = !res.ok; render(); return res; }
        send('dm', 'hopeRequest', { player: myName(), tokenId: tok.id, action: form.action, count: form.count, heroName: tok.name || '' });
        notify('Richiesta inviata al Master.');
        panelOpen = false;
        render();
        return { ok: true, sent: true };
    }

    // ---------------- Riquadro ----------------
    function ensureWindow() {
        let w = document.getElementById(WIN_ID);
        if (w) return w;
        w = document.createElement('div');
        w.id = WIN_ID;
        w.className = 'ncs-coins';
        w.style.display = 'none';
        w.innerHTML = `<div class="ncs-coins-head" id="ncs-coins-head">🌙 <span>Coppe</span></div><div id="ncs-coins-body"></div>`;
        document.body.appendChild(w);
        if (typeof window.makeDraggable === 'function') window.makeDraggable(w, w.querySelector('.ncs-coins-head'));
        w.addEventListener('click', onClick);
        w.addEventListener('change', onChange);
        return w;
    }

    function render() {
        const w = ensureWindow();
        const show = isNcs() && !!(getEngine());
        w.style.display = show ? 'block' : 'none';
        if (!show) return;
        const body = document.getElementById('ncs-coins-body');
        const dm = isDM();
        const ctl = (k) => dm ? `<button type="button" class="ncs-mini-btn" data-act="${k}-">−</button><button type="button" class="ncs-mini-btn" data-act="${k}+">+</button>` : '';
        const parts = [`
            <div class="ncs-coin-row"><span>🌑 <span>Disperazione</span></span><b id="ncs-coin-despair">${coins.despair}</b>${ctl('despair')}</div>
            <div class="ncs-coin-row"><span>🌕 <span>Speranza</span></span><b id="ncs-coin-hope">${coins.hope}</b>${ctl('hope')}</div>
            <div class="ncs-coin-btns">
                <button type="button" class="ncs-mini-btn ncs-light" data-act="panel">✨ <span>Porta Luce</span></button>
                ${dm ? '<button type="button" class="ncs-mini-btn" data-act="endSession">🌙 <span>Fine sessione</span></button>' : ''}
            </div>`];
        if (panelOpen) {
            const heroes = ncsHeroes();
            if (!form.tokenId || !heroes.some(h => h.id === form.tokenId)) form.tokenId = heroes.length ? heroes[0].id : null;
            const tok = tokenById(form.tokenId);
            const p = tok ? plan(S().getSheetOf(tok), form.action, form.count) : null;
            const canDo = !!p && coins.hope >= p.cost;
            parts.push(`<div class="ncs-light-panel">
                ${heroes.length > 1 ? `<select class="ncs-select" data-f="token">${heroes.map(h => `<option value="${esc(h.id)}"${h.id === form.tokenId ? ' selected' : ''}>${esc(h.name || h.id)}</option>`).join('')}</select>` : `<div class="ncs-hint">${esc(tok ? tok.name : '')}</div>`}
                <label class="ncs-mini"><input type="radio" name="ncs-light" data-f="action" value="breathExhaustion"${form.action === 'breathExhaustion' ? ' checked' : ''}> <span>Tirare il Fiato: −1 Sfinimento</span></label>
                <label class="ncs-mini"><input type="radio" name="ncs-light" data-f="action" value="breathReaction"${form.action === 'breathReaction' ? ' checked' : ''}> <span>Tirare il Fiato: libera una Reazione</span></label>
                <label class="ncs-mini"><input type="radio" name="ncs-light" data-f="action" value="recoverDiscipline"${form.action === 'recoverDiscipline' ? ' checked' : ''}> <span>Recuperare la Disciplina</span></label>
                ${form.action !== 'recoverDiscipline' ? `<div class="ncs-coin-row"><span>Monete</span><button type="button" class="ncs-mini-btn" data-act="count-">−</button><b id="ncs-light-count">${form.count}</b><button type="button" class="ncs-mini-btn" data-act="count+">+</button></div>` : ''}
                <div class="ncs-hint"><span>Costo</span>: <b id="ncs-light-cost">${p ? p.cost : '—'}</b> · <span>Speranza</span> ${coins.hope}</div>
                <button type="button" class="ncs-mini-btn ncs-light" data-act="submit"${canDo ? '' : ' disabled'}>${dm ? '<span>Spendi</span>' : '<span>Chiedi al Master</span>'}</button>
            </div>`);
        }
        if (dm && requests.length) {
            parts.push(`<div class="ncs-requests">${requests.map(r => {
                const tok = tokenById(r.tokenId);
                const p = tok ? plan(S().getSheetOf(tok), r.action, r.count) : null;
                return `<div class="ncs-request"><b>${esc(r.player || '')}</b> (${esc(r.heroName || '')}): <span>${p ? p.label : '—'}</span> ${p ? p.detail : ''} · <span>Costo</span> ${p ? p.cost : '—'}
                    <div><button type="button" class="ncs-mini-btn ncs-light" data-act="approve" data-id="${esc(r.id)}">✔ <span>Approva</span></button>
                    <button type="button" class="ncs-mini-btn" data-act="reject" data-id="${esc(r.id)}">✖ <span>Rifiuta</span></button></div></div>`;
            }).join('')}</div>`);
        }
        body.innerHTML = parts.join('');
    }

    async function endSession() {
        if (!isDM()) return false;
        const ok = (typeof window.vttConfirm === 'function')
            ? await window.vttConfirm(T('Fine sessione: le Monete avanzate non passano alla prossima sessione. Avete già speso la Speranza rimasta? Le Coppe verranno svuotate e i segni delle Cicatrici cancellati.'))
            : true;
        if (!ok) return false;
        coins = { despair: 0, hope: 0 };
        requests = [];
        changed();
        // Segni delle Cicatrici rievocate cancellati sulle schede dei Protagonisti in mappa
        ncsHeroes().forEach(tok => {
            const sh = S() ? S().getSheetOf(tok) : null;
            if (sh && sh.scars.some(x => x.marked)) S().applyToToken(tok, s => { s.scars.forEach(x => { x.marked = false; }); });
        });
        chatLine('🌙 <span>Fine sessione: Coppe svuotate e segni delle Cicatrici cancellati.</span>');
        return true;
    }

    function onClick(e) {
        const b = e.target.closest('[data-act]');
        if (!b || b.disabled) return;
        const act = b.getAttribute('data-act');
        if (act === 'despair+' || act === 'despair-' || act === 'hope+' || act === 'hope-') {
            if (!isDM()) return;
            const k = act.startsWith('despair') ? 'despair' : 'hope';
            coins[k] = clamp(coins[k] + (act.endsWith('+') ? 1 : -1));
            changed(); return;
        }
        if (act === 'panel') { panelOpen = !panelOpen; render(); return; }
        if (act === 'count-') { form.count = Math.max(1, form.count - 1); render(); return; }
        if (act === 'count+') { form.count = Math.min(10, form.count + 1); render(); return; }
        if (act === 'submit') { submitForm(); return; }
        if (act === 'approve') { approve(b.getAttribute('data-id')); return; }
        if (act === 'reject') { reject(b.getAttribute('data-id')); return; }
        if (act === 'endSession') { endSession(); return; }
    }
    function onChange(e) {
        const el = e.target, f = el.getAttribute && el.getAttribute('data-f');
        if (f === 'action') { form.action = el.value; form.count = 1; render(); }
        else if (f === 'token') { form.tokenId = el.value; render(); }
    }

    // ---------------- Messaggi ----------------
    function onNetworkMessage(data, ctx) {
        const p = data.payload || {};
        if (ctx && ctx.isDM) {
            if (data.to !== 'dm' || data.kind !== 'hopeRequest') return;
            const sender = ctx.senderName || p.player || '';
            const tok = tokenById(p.tokenId);
            if (!tok) { send('players', 'hopeAnswer', { player: sender, ok: false, reason: 'noToken' }); return; }
            if (!ownsToken(tok, sender)) { send('players', 'hopeAnswer', { player: sender, ok: false, reason: 'notOwner' }); return; }
            const action = ['breathExhaustion', 'breathReaction', 'recoverDiscipline'].includes(p.action) ? p.action : null;
            if (!action) return;
            requests.push({ id: 'hr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), player: sender, tokenId: tok.id, heroName: tok.name || '', action, count: Math.max(1, Math.min(10, Number(p.count) || 1)) });
            notify('Richiesta di Portare Luce da approvare nelle Coppe.');
            render();
        } else {
            if (data.to !== 'players') return;
            if (data.kind === 'coins' && p.coins) { coins = { despair: clamp(p.coins.despair), hope: clamp(p.coins.hope) }; render(); }
            else if (data.kind === 'hopeAnswer') {
                if (!p.player || String(p.player).trim().toLowerCase() !== myName().toLowerCase()) return;
                if (p.ok) notify('Il Master ha approvato: Portare Luce applicato.');
                else notify(REASON_TEXT[p.reason] || REASON_TEXT.rejected, 'warn');
            }
        }
    }

    const api = {
        // Master: +N Disperazione (es. il Dolore Domina alla conclusione del conflitto)
        addDespair(n) { if (!isDM()) return; coins.despair = clamp(coins.despair + (n || 1)); changed(); },
        // Master, conflitto (C5): Gettare un'Ombra spende Disperazione subito; a fine conflitto le Monete vanno nella Speranza
        spendDespair(n) { n = n || 1; if (!isDM() || coins.despair < n) return false; coins.despair -= n; changed(); return true; },
        addHope(n) { if (!isDM() || !n) return; coins.hope = clamp(coins.hope + n); changed(); },
        // Migliorare i Successi: la Moneta di Speranza esce dal gioco
        spendHope(n) { n = n || 1; if (!isDM() || coins.hope < n) return false; coins.hope -= n; changed(); return true; },
        // Conflitto annullato: le Monete spese tornano dove erano
        refund(o) { if (!isDM() || !o) return; coins.despair = clamp(coins.despair + (o.despair || 0)); coins.hope = clamp(coins.hope + (o.hope || 0)); changed(); },
        get: () => Object.assign({}, coins),
        refresh() { if (isDM()) ensureCampaign(); render(); },
        onNetworkMessage,
        getSharedState() { if (!isDM() || !isNcs()) return null; ensureCampaign(); return { coins: Object.assign({}, coins) }; },
        applySharedState(sys) { if (!isDM() && sys && sys.coins) { const c = sys.coins; if (c.despair !== coins.despair || c.hope !== coins.hope) { coins = { despair: clamp(c.despair), hope: clamp(c.hope) }; render(); } else if (document.getElementById(WIN_ID) && document.getElementById(WIN_ID).style.display === 'none' && isNcs()) render(); } },
        // Per i test
        _approve: approve, _reject: reject, _endSession: endSession, _executeHope: executeHope, _plan: plan,
        _setForm(o) { Object.assign(form, o || {}); panelOpen = true; render(); },
        _submit: submitForm,
        _set(c) { if (!isDM()) return; coins = { despair: clamp(c.despair), hope: clamp(c.hope) }; changed(); },
        _state: () => ({ coins: Object.assign({}, coins), requests: requests.slice(), coinsCampaign, stats: Object.assign({}, stats), visible: (document.getElementById(WIN_ID) || {}).style ? document.getElementById(WIN_ID).style.display !== 'none' : false })
    };

    if (typeof window !== 'undefined') {
        window.ncsCoins = api;
        const init = () => {
            if (window.systemManager && typeof window.systemManager.onSystemChange === 'function') window.systemManager.onSystemChange(() => api.refresh());
            api.refresh();
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 0);
    }
})();
