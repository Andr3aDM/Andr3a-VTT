// js/systems/7thsea/initiative.js
// Sequenza d'Azione di 7th Sea 2ª Edizione per il Tracker del core (Manuale Base pp. 178-182, 191-194).
//
// Attivo SOLO nelle campagne 7th Sea: js/initiative.js (core) gli passa la mano in pochi punti di ingresso
// (disegno dell'elenco, Prossimo/Precedente, Auto-Roll, tiri d'iniziativa D&D dalla chat).
// Nelle campagne D&D questo file non fa nulla e il tracker resta esattamente quello di sempre.
//
// Fasi (le cambia SOLO il Master con i pulsanti):
//   nessuna Sequenza  -> i Rischi vanno solo in chat
//   Fase Tiri         -> l'ultimo Rischio di ogni partecipante (dalla sua scheda / compendio) diventa i suoi Incrementi
//   Fase Azioni       -> Incrementi bloccati: agisce chi ne ha di più (pareggio: prima i Malvagi), il Master li spende
//   Fine Round        -> tutti a 0: Nuovo Round (durate -1, si torna ai Tiri) oppure Termina Sequenza (come Ferma/Reset)
(function () {
    'use strict';

    const PH_ROLLS = 'rolls';
    const PH_ACTIONS = 'actions';
    const PH_END = 'roundEnd';
    // Sequenza Drammatica (pp. 186-190): un solo tiro per tutta la Sequenza, nessun ordine fisso, nessun Round
    function isDrama(S) { return !!S && S.mode === 'drama'; }
    // Riserva di Pericolo (p. 176): risorsa del Master per la sessione (1 Punto per Eroe), salvata nella campagna.
    // Non viaggia nello STATE_SYNC: i giocatori non la vedono.
    const danger = { camp: null, value: 0, touched: false };
    function ensureDangerLoaded() {
        const c = campId();
        if (danger.camp === c) return;
        danger.camp = c; danger.value = 0; danger.touched = false;
        if (!c || typeof vttDB === 'undefined' || !vttDB || typeof vttDB.getCampaign !== 'function') return;
        vttDB.getCampaign(c).then(camp => {
            if (danger.camp !== c || danger.touched) return;      // il Master l'ha già cambiata nel frattempo
            const v = camp ? parseInt(camp.s7DangerPool, 10) : NaN;
            danger.value = isNaN(v) ? 0 : Math.max(0, v);
            if (isActive()) renderBar(document.getElementById('s7-seq-bar'), seq());
        }).catch(() => {});
    }
    function setDanger(v) {
        ensureDangerLoaded();
        danger.value = Math.max(0, parseInt(v, 10) || 0);
        danger.touched = true;
        const c = danger.camp;
        if (c && typeof vttDB !== 'undefined' && vttDB && typeof vttDB.updateCampaignField === 'function') {
            vttDB.updateCampaignField(c, 's7DangerPool', danger.value).catch(e => console.warn('[7thSea] Riserva di Pericolo:', e));
        }
    }
    function hasDanger(label) {
        ensureDangerLoaded();
        if (danger.value >= 1) return true;
        toast(`☠️ Riserva di Pericolo vuota: serve 1 Punto Pericolo per ${label}.`);
        return false;
    }
    function spendDanger() { setDanger(danger.value - 1); return danger.value; }
    function heroCountForSession() {
        return (typeof engine !== 'undefined' && engine && Array.isArray(engine.tokens)) ? engine.tokens.filter(t => t && t.pcSheet && t.pcSheet.traits && !t.isEvocation).length : 0;
    }
    // +5 al valore per fare un Incremento (p. 176): un Rischio o un Round, tutti gli Eroi in Scena, mai +10
    function plus5() { const I = ini(); return I && I.s7Plus5 && I.s7Plus5.active ? I.s7Plus5 : null; }
    function plus5Scope(S) { return S ? (isDrama(S) ? 'questa Sequenza Drammatica' : `il Round ${S.round}`) : 'il prossimo Rischio (toglilo con ✕)'; }
    function activatePlus5() {
        const I = ini();
        if (!I || plus5()) return;
        if (!hasDanger('il +5 al valore per Incremento')) return;
        spendDanger();
        const S = seq();
        I.s7Plus5 = { active: true, round: S ? S.round : null, at: Date.now() };
        toast(`☠️ +5: per ${plus5Scope(S)} gli Eroi hanno bisogno di 15 per ogni Incremento (Riserva di Pericolo ${danger.value}).`);
        renderTrackerList();
    }
    function clearPlus5(silent) {
        const I = ini();
        if (!I || !I.s7Plus5) return;
        delete I.s7Plus5;
        if (!silent) toast('☠️ +5 tolto: si torna a 10 per Incremento.');
    }
    function spendDangerPoint(label) {
        if (!hasDanger(label || 'questo uso')) return false;
        spendDanger();
        toast(`☠️ Speso 1 Punto Pericolo: ${label || ''} (Riserva ${danger.value}).`);
        if (isActive()) renderBar(document.getElementById('s7-seq-bar'), seq());
        return true;
    }
    function dangerHtml() {
        ensureDangerLoaded();
        const n = heroCountForSession();
        const p5 = plus5();
        const B = 'background:#5d2a2a; color:#fff; border:none; border-radius:3px; font-size:11px; font-weight:bold; padding:1px 7px; cursor:pointer;';
        return `<div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#ef9a9a; background:#2a1414; border:1px solid #5d2a2a; border-radius:4px; padding:3px 6px;" title="Riserva di Pericolo del Master (p. 176): 1 Punto Pericolo per ogni Eroe a inizio sessione. I giocatori non la vedono.">
            <span style="flex:1;">☠️ Riserva di Pericolo: <b>${danger.value}</b></span>
            <button type="button" data-s7-cmd="danger-minus" style="${B}" title="Spendi 1 Punto Pericolo (uso a mano)">−</button>
            <button type="button" data-s7-cmd="danger-plus" style="${B}" title="Aggiungi 1 Punto Pericolo (es. Staffilata della Sorte)">+</button>
            <button type="button" data-s7-cmd="danger-session" style="${B} background:#7f1d1d;" title="Inizio sessione: 1 Punto Pericolo per ogni Eroe in mappa">Nuova sessione (${n})</button>
            ${p5 ? '' : `<button type="button" data-s7-cmd="plus5" style="${B} background:#4a0000;" title="1 Punto Pericolo: per un Rischio o un Round gli Eroi in Scena hanno bisogno di 15 per ogni Incremento (non cumulabile)">+5 Incr.</button>`}
        </div>${p5 ? `<div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#fecaca; background:#3b0d0d; border:1px solid #7f1d1d; border-radius:4px; padding:3px 6px;"><span style="flex:1;">☠️ <b>+5 attivo</b>: 15 per ogni Incremento degli Eroi${p5.round ? ` (Round ${p5.round})` : ''}</span><button type="button" data-s7-cmd="plus5-off" style="${B}" title="Togli il +5 (il Punto Pericolo non torna)">✕</button></div>` : ''}`;
    }
    const KIND_ICON = { hero: '🦸', ally: '🤝', villain: '👑', squad: '⚔️' };
    const KIND_LABEL = { hero: 'Eroe', ally: 'Alleato', villain: 'Malvagio / Antagonista', squad: 'Squadra di Sgherri' };

    const processedRollIds = new Set();
    let coreUiHidden = false;
    let terminateArmedUntil = 0;
    let terminateTimer = null;
    let listHandlersAttached = false;
    let squadPanelFor = null;
    let attackPanelFor = null;           // id del partecipante che sta preparando un attacco            // id del partecipante che sta scegliendo la Squadra da colpire
    const squadTargetChoice = {};        // Turno degli Sgherri: Eroe scelto dal Master per ogni Squadra

    // ---------- utilità ----------
    function isActive() {
        try {
            return !!(window.systemManager && typeof window.systemManager.getActiveSystemId === 'function' &&
                window.systemManager.getActiveSystemId() === '7thsea');
        } catch (e) { return false; }
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
    function toast(m) { if (typeof showToast === 'function') showToast(m); }
    function campId() {
        try { return (typeof currentCampaignId !== 'undefined' && currentCampaignId) ? String(currentCampaignId) : ''; } catch (e) { return ''; }
    }
    function ini() {
        return (typeof engine !== 'undefined' && engine && engine.initiative) ? engine.initiative : null;
    }
    function clearSeqState(I) {
        if (!I) return;
        delete I.s7;
        delete I.s7Label;
        delete I.s7Notes;
        delete I.s7Plus5;
        if (Array.isArray(I.participants)) {
            I.participants.forEach(p => {
                delete p.s7Raises; delete p.s7Start; delete p.s7Pick; delete p.s7Kind; delete p._s7Order; delete p.s7AttackedRound; delete p.s7Unused; delete p.s7SecondRound;
                if (typeof p.init === 'string' && (p.init === '⏳' || p.init === '✅' || p.init === '?' || /^Forza /.test(p.init))) p.init = '';
            });
        }
    }
    // Stato della Sequenza della campagna attiva (una Sequenza di un'altra campagna viene scartata)
    function seq() {
        const I = ini();
        if (!I || !I.s7) return null;
        if (I.s7.campaignId && I.s7.campaignId !== campId()) { clearSeqState(I); return null; }
        return I.s7;
    }
    function tokOf(p) {
        try { return (typeof resolveParticipantToken === 'function') ? resolveParticipantToken(p) : null; } catch (e) { return null; }
    }
    function kindOf(p) {
        const tok = tokOf(p);
        const cat = (tok && tok.statblock && tok.statblock.s7Category) ? String(tok.statblock.s7Category).toLowerCase() : '';
        if (cat === 'brute') return 'squad';
        let pg = false;
        try { pg = (typeof isParticipantPG === 'function') ? isParticipantPG(p, tok) : false; } catch (e) {}
        if (pg) return 'hero';
        if (cat === 'npc') return 'ally';
        return 'villain';
    }
    function isHelpless(tok) {
        const pc = tok && tok.pcSheet;
        if (!pc || !Array.isArray(pc.dramaticWounds)) return false;
        const n = pc.dramaticWounds.filter(Boolean).length;
        let max = 4;
        try {
            if (window.seventhSeaRules && typeof window.seventhSeaRules.hasAdvantage === 'function' &&
                window.seventhSeaRules.hasAdvantage(pc, 'Duro da Uccidere')) max = 5;
        } catch (e) {}
        return n >= max;
    }
    function squadStrength(p) {
        const tok = tokOf(p);
        if (!tok) return null;
        if (tok.hpCurrent !== undefined && tok.hpCurrent !== null && !isNaN(Number(tok.hpCurrent))) return Math.max(0, Number(tok.hpCurrent));
        if (tok.statblock && tok.statblock.s7Strength !== undefined) return Math.max(0, Number(tok.statblock.s7Strength) || 0);
        return null;
    }
    function raisesOf(p) { return (p.s7Raises === null || p.s7Raises === undefined) ? 0 : Number(p.s7Raises) || 0; }
    function isActor(p) { return p.s7Kind !== 'squad'; }
    function findById(id) {
        const I = ini();
        return I && Array.isArray(I.participants) ? I.participants.find(p => String(p.id) === String(id)) : null;
    }

    // ---------- ordine e fasi ----------
    function prepareParticipants() {
        const I = ini();
        let maxOrder = -1;
        I.participants.forEach(p => { if (typeof p._s7Order === 'number' && p._s7Order > maxOrder) maxOrder = p._s7Order; });
        I.participants.forEach(p => {
            p.s7Kind = kindOf(p);
            if (p.s7Raises === undefined) p.s7Raises = null;
            if (typeof p._s7Order !== 'number') p._s7Order = ++maxOrder;
        });
    }
    function normalizePhase(S) {
        const I = ini();
        const anyLeft = I.participants.some(p => isActor(p) && raisesOf(p) > 0);
        if (S.phase === PH_ACTIONS && !anyLeft) S.phase = PH_END;
        else if (S.phase === PH_END && anyLeft) S.phase = PH_ACTIONS; // il Master ha corretto un valore
    }
    const rollsRank = { hero: 0, ally: 0, villain: 1, squad: 2 };
    function cmpActions(a, b) {
        const sa = a.s7Kind === 'squad' ? 1 : 0, sb = b.s7Kind === 'squad' ? 1 : 0;
        if (sa !== sb) return sa - sb;                       // Sgherri in fondo: non hanno Incrementi
        const ra = raisesOf(a), rb = raisesOf(b);
        if (ra !== rb) return rb - ra;                       // più Incrementi rimasti agisce prima
        const va = a.s7Kind === 'villain' ? 0 : 1, vb = b.s7Kind === 'villain' ? 0 : 1;
        if (va !== vb) return va - vb;                       // i Malvagi vincono i pareggi (p. 179)
        const pa = a.s7Pick || 0, pb = b.s7Pick || 0;
        if (pa !== pb) return pb - pa;                       // tra Eroi alla pari sceglie il Master
        return a._s7Order - b._s7Order;
    }
    function sortForPhase(S) {
        const I = ini();
        if (S.phase === PH_ROLLS || isDrama(S)) {
            I.participants.sort((a, b) => (rollsRank[a.s7Kind] - rollsRank[b.s7Kind]) || (a._s7Order - b._s7Order));
        } else {
            I.participants.sort(cmpActions);
        }
        const first = I.participants[0];
        I.currentTurnIndex = (!isDrama(S) && S.phase === PH_ACTIONS && first && isActor(first) && raisesOf(first) > 0) ? 0 : -1;
    }
    // Valore mostrato sugli schermi dei giocatori (player.js mostra "Nome (valore)")
    function playerFacingValue(p, S) {
        if (p.s7Kind === 'squad') {
            const st = squadStrength(p);
            return st !== null ? `Forza ${st}` : '';
        }
        if (isDefeated(p)) return 'Sconfitto';
        if (S.phase === PH_ROLLS) return (p.s7Raises === null || p.s7Raises === undefined) ? '⏳' : '✅';
        if (p.s7Kind === 'villain') { if (isDefeated(p)) return 'Sconfitto'; return raisesOf(p) > 0 ? '?' : '0'; } // non rivela gli Incrementi dei Malvagi
        return String(raisesOf(p));
    }
    function phaseName(S) {
        if (isDrama(S)) return S.phase === PH_ROLLS ? 'Tiri' : (S.phase === PH_ACTIONS ? 'Azioni' : 'Incrementi esauriti');
        return S.phase === PH_ROLLS ? 'Tiri' : (S.phase === PH_ACTIONS ? 'Azioni' : 'Fine Round');
    }
    function labelFor(S) { return isDrama(S) ? `🎭 Sequenza Drammatica · ${phaseName(S)}` : `⚔️ Sequenza d'Azione · Round ${S.round} · ${phaseName(S)}`; }

    // ---------- interfaccia del Master ----------
    function coreEls() {
        const list = document.getElementById('tracker-list');
        const els = [];
        const st = document.getElementById('btn-tracker-state');
        if (st && st.parentElement) els.push(st.parentElement);                 // Avvia Combattimento / Ferma-Reset
        const ar = document.getElementById('btn-tracker-autoroll');
        if (ar && ar.parentElement) els.push(ar.parentElement);                 // Auto-Roll d20
        const gs = document.getElementById('tracker-group-similar');
        if (gs && gs.closest('label')) els.push(gs.closest('label'));           // Raggruppa Simili
        if (list && list.previousElementSibling && list.previousElementSibling.id !== 's7-seq-bar') els.push(list.previousElementSibling); // intestazione colonne D&D
        const cc = document.getElementById('tracker-combat-controls');
        if (cc) els.push(cc);                                                   // Precedente / Prossimo Turno
        return els;
    }
    function hideCoreUi() {
        if (coreUiHidden) return;
        coreEls().forEach(el => {
            if (el.dataset.s7Hidden === '1') return;
            el.dataset.s7PrevDisplay = el.style.display || '';
            el.dataset.s7Hidden = '1';
            el.style.display = 'none';
        });
        coreUiHidden = true;
    }
    function restoreCoreTrackerUi() {
        const I = ini();
        if (I && (I.s7 || I.s7Label || I.s7Notes)) clearSeqState(I);
        if (!coreUiHidden) return;
        document.querySelectorAll('[data-s7-hidden="1"]').forEach(el => {
            el.style.display = el.dataset.s7PrevDisplay || '';
            delete el.dataset.s7PrevDisplay;
            delete el.dataset.s7Hidden;
        });
        const bar = document.getElementById('s7-seq-bar');
        if (bar) bar.remove();
        coreUiHidden = false;
    }
    function ensureBar() {
        let bar = document.getElementById('s7-seq-bar');
        if (bar) return bar;
        const list = document.getElementById('tracker-list');
        if (!list || !list.parentElement) return null;
        bar = document.createElement('div');
        bar.id = 's7-seq-bar';
        bar.style.cssText = 'display:flex; flex-direction:column; gap:5px; margin-bottom:5px;';
        list.parentElement.insertBefore(bar, list);
        bar.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-s7-cmd]');
            if (!btn) return;
            const cmd = btn.getAttribute('data-s7-cmd');
            if (cmd === 'start') startSequence('action');
            else if (cmd === 'start-drama') startSequence('drama');
            else if (cmd === 'to-action') switchMode('action');
            else if (cmd === 'to-drama') switchMode('drama');
            else if (cmd === 'danger-minus') { if (hasDanger('questo uso')) { spendDanger(); toast(`☠️ Speso 1 Punto Pericolo (Riserva ${danger.value}).`); } renderBar(bar, seq()); }
            else if (cmd === 'plus5') activatePlus5();
            else if (cmd === 'plus5-off') { clearPlus5(); renderTrackerList(); }
            else if (cmd === 'danger-plus') { setDanger(danger.value + 1); renderBar(bar, seq()); }
            else if (cmd === 'danger-session') { const n = heroCountForSession(); setDanger(n); toast(`☠️ Nuova sessione: Riserva di Pericolo = ${n} (1 per Eroe).`); renderBar(bar, seq()); }
            else if (cmd === 'actions') beginActions();
            else if (cmd === 'newround') newRound();
            else if (cmd === 'end') terminateSequence();
            else if (cmd === 'squad-attack') squadAttack(btn.getAttribute('data-s7-squad'));
            else if (cmd === 'item-form') { itemForm.open = !itemForm.open; renderBar(bar, seq()); }
            else if (cmd === 'item-add') itemAdd();
            else if (cmd === 'item-remove') itemRemove(btn.getAttribute('data-s7-item'));
            else if (cmd === 'item-apply') itemApply(btn.getAttribute('data-s7-item'));
            else if (cmd === 'item-each') {
                const iid = btn.getAttribute('data-s7-item'), hid = btn.getAttribute('data-s7-hero');
                const inp = bar.querySelector(`[data-s7-item-k="${CSS.escape(iid + '|' + hid)}"]`);
                itemEach(iid, hid, inp ? inp.value : 1);
            } else if (cmd === 'item-shared' || cmd === 'item-take') {
                const iid = btn.getAttribute('data-s7-item');
                const sel = bar.querySelector(`[data-s7-item-hero="${CSS.escape(iid)}"]`);
                const num = bar.querySelector(`[data-s7-item-n="${CSS.escape(iid)}"]`);
                if (cmd === 'item-shared') itemShared(iid, sel ? sel.value : '', num ? num.value : 1);
                else itemTake(iid, sel ? sel.value : '');
            }
        });
        const onFormInput = (e) => {
            const f = e.target.closest('[data-s7-form]');
            if (f) itemForm[f.getAttribute('data-s7-form')] = f.value;
        };
        bar.addEventListener('input', onFormInput);
        bar.addEventListener('change', (e) => {
            onFormInput(e);
            const sel = e.target.closest('[data-s7-squad-target]');
            if (sel) squadTargetChoice[sel.getAttribute('data-s7-squad-target')] = sel.value;
        });
        return bar;
    }
    const BTN = 'border:none; border-radius:4px; padding:5px 6px; font-size:11.5px; font-weight:bold; cursor:pointer; flex:1;';
    function renderBar(bar, S) {
        if (!bar) return;
        const I = ini();
        let html = dangerHtml();
        if (!S) {
            html += `<div style="font-size:11px; color:#bbb; line-height:1.35;">⛵ <b>7th Sea</b>: l'ordine lo decidono gli <b>Incrementi</b>. Carica i partecipanti (🔄 Ricarica) e avvia la Sequenza: da quel momento i Rischi tirati dalle schede vengono contati. <b>Azione</b> = pericolo immediato, a Round; <b>Drammatica</b> = tensione (feste, infiltrazioni, indagini), un solo tiro e nessun ordine fisso.</div>`;
            html += `<div style="display:flex; gap:5px;"><button type="button" data-s7-cmd="start" style="${BTN} background:#4caf50; color:#fff;">⚔️ Avvia Sequenza d'Azione</button><button type="button" data-s7-cmd="start-drama" style="${BTN} background:#6a1b9a; color:#fff;">🎭 Avvia Sequenza Drammatica</button></div>`;
        } else {
            const actors = I.participants.filter(isActor);
            let info = '';
            let color = '#ffcc00';
            if (S.phase === PH_ROLLS) {
                const rolled = actors.filter(p => p.s7Raises !== null && p.s7Raises !== undefined).length;
                info = `🎲 Dichiarate l'Approccio e tirate il Rischio${isDrama(S) ? ' (una sola volta per tutta la Sequenza)' : ''} · <b>${rolled}/${actors.length}</b> hanno tirato`;
            } else if (isDrama(S)) {
                info = S.phase === PH_ACTIONS
                    ? '🎭 Nessun ordine fisso: il Master narra e chi vuole spende Incrementi per Azioni, Opportunità e Conseguenze.'
                    : '🏁 Incrementi esauriti: chi non ne ha più partecipa senza spenderne (non si ritira).';
                color = S.phase === PH_ACTIONS ? '#ce93d8' : '#ffb74d';
            } else if (S.phase === PH_ACTIONS) {
                const cur = I.participants[I.currentTurnIndex];
                info = cur ? `▶ Agisce: <b>${esc(cur.name)}</b> (${raisesOf(cur)} Incrementi) · si spendono anche fuori turno per evitare le Ferite` : '';
                color = '#81c784';
            } else {
                info = '🏁 Tutti a 0 Incrementi: il Round è finito.' + squadTurnHtml(S);
                color = '#ffb74d';
            }
            html += `<div style="font-size:12px; font-weight:bold; color:${color};">${esc(labelFor(S))}</div>`;
            if (info) html += `<div style="font-size:11px; color:#ddd; line-height:1.35;">${info}</div>`;
            const armed = Date.now() < terminateArmedUntil;
            const endBtn = `<button type="button" data-s7-cmd="end" style="${BTN} background:${armed ? '#ff1744' : '#b71c1c'}; color:#fff;">${armed ? '⏹ Conferma: termina' : '⏹ Termina Sequenza'}</button>`;
            const swBtn = isDrama(S)
                ? `<button type="button" data-s7-cmd="to-action" style="${BTN} background:#e65100; color:#fff;" title="La situazione precipita (es. infiltrazione scoperta): nuova Scena d'Azione, nuovo Approccio e nuovo tiro">⚔️ Diventa Sequenza d'Azione</button>`
                : `<button type="button" data-s7-cmd="to-drama" style="${BTN} background:#6a1b9a; color:#fff;" title="Lo scontro si trasforma in tensione (es. si tratta con le spade puntate): nuova Scena Drammatica, nuovo Approccio e nuovo tiro">🎭 Diventa Drammatica</button>`;
            if (S.phase === PH_ROLLS) {
                html += `<div style="display:flex; gap:5px;"><button type="button" data-s7-cmd="actions" style="${BTN} background:#2196f3; color:#fff;">▶ Inizia Azioni</button>${swBtn}${endBtn}</div>`;
            } else if (S.phase === PH_ACTIONS || isDrama(S)) {
                html += `<div style="display:flex; gap:5px;">${swBtn}${endBtn}</div>`;
            } else {
                html += `<div style="display:flex; gap:5px;"><button type="button" data-s7-cmd="newround" style="${BTN} background:#4caf50; color:#fff;">🔄 Nuovo Round</button>${swBtn}${endBtn}</div>`;
            }
        }
        if (S) html += itemsHtml(S);
        // intestazione colonne
        html += `<div style="display:flex; gap:4px; font-size:10.5px; color:#aaa; padding:0 5px; border-bottom:1px solid #444;">
                    <div style="flex:2.2;">Nome</div>
                    <div style="flex:1.1; text-align:center;">Incrementi</div>
                    <div style="flex:1.3; text-align:center;">${S && S.phase !== PH_ROLLS ? 'Spendi' : ''}</div>
                    <div style="width:18px; text-align:center;">✕</div>
                 </div>`;
        bar.innerHTML = html;
    }
    // Turno degli Sgherri (p. 191): ogni Squadra con Forza infligge tante Ferite quanta Forza le resta, tutte a un solo Eroe scelto dal Master
    function heroTargets() {
        return ini().participants.filter(p => p.s7Kind === 'hero' || p.s7Kind === 'ally').filter(p => tokOf(p));
    }
    function squadTurnHtml(S) {
        const squads = ini().participants.filter(p => p.s7Kind === 'squad').map(p => ({ p, st: squadStrength(p) })).filter(x => x.st && x.st > 0);
        if (!squads.length) return '';
        const heroes = heroTargets();
        let html = '<div style="margin-top:4px;">⚔️ <b>Turno degli Sgherri</b>:</div>';
        squads.forEach(x => {
            const done = x.p.s7AttackedRound === S.round;
            const chosen = squadTargetChoice[x.p.id] && heroes.some(h => h.id === squadTargetChoice[x.p.id]) ? squadTargetChoice[x.p.id] : (heroes[0] ? heroes[0].id : '');
            const opts = heroes.map(h => `<option value="${esc(h.id)}"${h.id === chosen ? ' selected' : ''}>${esc(h.name)}</option>`).join('');
            html += `<div style="display:flex; align-items:center; gap:4px; margin-top:3px; flex-wrap:wrap;">
                <span>${esc(x.p.name)} infligge <b>${x.st}</b> Ferite a</span>
                <select data-s7-squad-target="${esc(x.p.id)}" ${done || !heroes.length ? 'disabled' : ''} style="background:#111; color:#fff; border:1px solid #555; border-radius:3px; font-size:11px; max-width:120px;">${opts || '<option value="">(nessun Eroe)</option>'}</select>
                ${done ? '<span style="color:#81c784;">✓ applicate</span>' : `<button type="button" data-s7-cmd="squad-attack" data-s7-squad="${esc(x.p.id)}" ${heroes.length ? '' : 'disabled'} style="background:#b71c1c; color:#fff; border:none; border-radius:3px; font-size:11px; font-weight:bold; padding:2px 7px; cursor:pointer;">Applica</button>`}
            </div>`;
        });
        return html;
    }
    function squadAttack(squadId) {
        const S = seq();
        const squad = findById(squadId);
        if (!S || isDrama(S) || S.phase !== PH_END || !squad || squad.s7Kind !== 'squad' || squad.s7AttackedRound === S.round) return;
        const st = squadStrength(squad);
        if (!st || st <= 0) return;
        const heroes = heroTargets();
        const targetId = squadTargetChoice[squadId] && heroes.some(h => h.id === squadTargetChoice[squadId]) ? squadTargetChoice[squadId] : (heroes[0] && heroes[0].id);
        const target = targetId ? findById(targetId) : null;
        const ttok = target ? tokOf(target) : null;
        if (!ttok) { toast('Scegli un Eroe da colpire.'); return; }
        squad.s7AttackedRound = S.round;
        squadHit(squad, target, st);
        renderTrackerList();
    }
    function squadHit(squad, target, st, why) {
        const ttok = tokOf(target);
        if (!ttok) return;
        const tag = why ? ` (${why})` : '';
        let res = null;
        if (ttok.pcSheet && ttok.pcSheet.traits && window.seventhSeaSheetManager && typeof window.seventhSeaSheetManager.applyExternalWounds === 'function') {
            res = window.seventhSeaSheetManager.applyExternalWounds(ttok.id, st, squad.name);
        }
        if (res) {
            toast(`🩸 ${squad.name}${tag} infligge ${st} Ferite a ${target.name}: ${res.wounds} Ferite, ${res.dramatic} Ferite Drammatiche.`);
        } else {
            // personaggio senza scheda 7th Sea: le Ferite scalano i PV del token
            if (ttok.hpCurrent !== undefined && ttok.hpCurrent !== null) ttok.hpCurrent = Math.max(0, Number(ttok.hpCurrent) - st);
            toast(`🩸 ${squad.name}${tag} infligge ${st} Ferite a ${target.name}.`);
        }
    }
    // ---------- Squadre di Sgherri speciali (p. 192): una Capacità attivata con 1 Punto Pericolo ----------
    const CAPS = {
        guardie: { label: 'Guardie', desc: "deviano su di sé un attacco rivolto a un Malvagio: Ferite −1, il resto toglie Forza alla Squadra" },
        assassini: { label: 'Assassini', desc: "agiscono subito, prima dell'Eroe più veloce: infliggono ora le loro Ferite (al posto del Turno degli Sgherri)" },
        duellanti: { label: 'Duellanti', desc: "dopo il Turno degli Sgherri attaccano una seconda volta lo stesso Eroe o un altro" },
        pirati: { label: 'Pirati', desc: "rapiscono un personaggio non-Eroe dalla Scena: Forza −1" },
        ladri: { label: 'Ladri', desc: "rubano un oggetto in possesso di un Eroe: Forza −1" }
    };
    let capPanelFor = null;
    const capChoice = {};
    function guessCap(name) {
        const n = String(name || '').toLowerCase();
        if (/guardi/.test(n)) return 'guardie';
        if (/assassin/.test(n)) return 'assassini';
        if (/duellant|spadaccin/.test(n)) return 'duellanti';
        if (/pirat|corsar/.test(n)) return 'pirati';
        if (/ladr|borseggi/.test(n)) return 'ladri';
        return 'guardie';
    }
    function capOf(squad) { return CAPS[capChoice[squad.id]] ? capChoice[squad.id] : guessCap(squad.name); }
    function villainPendings() { return pendingList().filter(pd => { const t = findById(pd.targetId); return t && t.s7Kind === 'villain'; }); }
    function useCapacity(squadId, type, heroId, pendId) {
        const S = seq();
        const squad = findById(squadId);
        if (!S || isDrama(S) || S.phase === PH_ROLLS || !squad || squad.s7Kind !== 'squad' || !CAPS[type]) return;
        const st = squadStrength(squad);
        if (!st || st <= 0) return;
        const stok = tokOf(squad);
        const heroes = heroTargets();
        const hero = heroes.find(h => String(h.id) === String(heroId)) || heroes[0];
        const lbl = CAPS[type].label;
        if (type === 'guardie') {
            const list = villainPendings();
            const pd = list.find(x => x.id === pendId) || list[0];
            if (!pd) { toast('🛡️ Guardie: nessun attacco in arrivo su un Malvagio da deviare.'); return; }
            if (!hasDanger(`la Capacità delle ${lbl}`)) return;
            spendDanger();
            pendingList().splice(pendingList().indexOf(pd), 1);
            const n = Math.max(0, pd.amount - 1);
            stok.hpCurrent = Math.max(0, st - n);
            toast(`🛡️ ${squad.name} devia l'attacco di ${pd.attackerName}: ${n} Ferite alla Squadra invece del Malvagio (Forza ${stok.hpCurrent}). Riserva di Pericolo ${danger.value}.`);
        } else if (type === 'assassini') {
            if (S.phase !== PH_ACTIONS || squad.s7AttackedRound === S.round) { toast('🗡️ Assassini: si usa durante la Fase Azioni, prima che la Squadra abbia attaccato in questo Round.'); return; }
            if (!hero) { toast('Scegli un Eroe da colpire.'); return; }
            if (!hasDanger(`la Capacità degli ${lbl}`)) return;
            spendDanger();
            squad.s7AttackedRound = S.round;
            squadHit(squad, hero, st, 'Assassini, agiscono subito');
        } else if (type === 'duellanti') {
            if (squad.s7AttackedRound !== S.round || squad.s7SecondRound === S.round) { toast('⚔️ Duellanti: il secondo attacco si usa dopo il Turno degli Sgherri, una volta per Round.'); return; }
            if (!hero) { toast('Scegli un Eroe da colpire.'); return; }
            if (!hasDanger(`la Capacità dei ${lbl}`)) return;
            spendDanger();
            squad.s7SecondRound = S.round;
            squadHit(squad, hero, st, 'Duellanti, secondo attacco');
        } else {
            if (!hasDanger(`la Capacità dei ${lbl}`)) return;
            spendDanger();
            stok.hpCurrent = Math.max(0, st - 1);
            toast(`${type === 'pirati' ? '🏴‍☠️' : '👝'} ${squad.name}: ${CAPS[type].desc} (Forza ${stok.hpCurrent}). Riserva di Pericolo ${danger.value}.`);
        }
        capPanelFor = null;
        renderTrackerList();
    }
    function capPanelRow(squad, S) {
        const type = capOf(squad);
        const div = document.createElement('div');
        div.style.cssText = 'padding:4px 6px 6px 18px; background:#2a1414; border-bottom:1px solid #5d2a2a; font-size:11px; color:#ddd;';
        const opts = Object.keys(CAPS).map(k => `<option value="${k}"${k === type ? ' selected' : ''}>${CAPS[k].label}</option>`).join('');
        let extra = '';
        if (type === 'assassini' || type === 'duellanti') {
            extra = `<select data-s7-cap-hero="${esc(squad.id)}" style="background:#111; color:#fff; border:1px solid #555; border-radius:3px; font-size:11px; max-width:120px;">${heroTargets().map(h => `<option value="${esc(h.id)}">${esc(h.name)}</option>`).join('')}</select>`;
        } else if (type === 'guardie') {
            const vp = villainPendings();
            extra = vp.length ? `<select data-s7-cap-pend="${esc(squad.id)}" style="background:#111; color:#fff; border:1px solid #555; border-radius:3px; font-size:11px; max-width:170px;">${vp.map(pd => `<option value="${esc(pd.id)}">${esc(pd.attackerName)} → ${esc((findById(pd.targetId) || {}).name || '')} (${pd.amount})</option>`).join('')}</select>` : '<span style="color:#999;">(nessun attacco su un Malvagio)</span>';
        }
        div.innerHTML = `<div style="margin-bottom:3px;">☠️ Capacità di ${esc(squad.name)} (1 Punto Pericolo · Riserva ${danger.value}):</div>
            <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
                <select data-s7-cap-type="${esc(squad.id)}" style="background:#111; color:#fff; border:1px solid #555; border-radius:3px; font-size:11px;">${opts}</select>
                ${extra}
                <button type="button" data-s7-cap-go="${esc(squad.id)}" style="background:#7f1d1d; color:#fff; border:none; border-radius:3px; font-size:11px; font-weight:bold; padding:2px 7px; cursor:pointer;">Usa</button>
                <button type="button" data-s7-cap-close="1" style="background:transparent; color:#aaa; border:1px solid #555; border-radius:3px; font-size:10.5px; padding:1px 6px; cursor:pointer;">Chiudi</button>
            </div>
            <div style="margin-top:3px; color:#bbb; font-size:10.5px;">${esc(CAPS[type].desc)}</div>`;
        return div;
    }
    // ---------- Comprare i dadi (p. 173): per ogni dado non usato l'Eroe prende 1 Punto Eroe e il Master 1 Punto Pericolo ----------
    function buyDie(id) {
        const p = findById(id);
        const tok = p ? tokOf(p) : null;
        if (!p || p.s7Kind !== 'hero' || !tok || !(parseInt(p.s7Unused, 10) > 0)) return;
        const mgr = window.seventhSeaSheetManager;
        const pe = (mgr && typeof mgr.applyExternalHeroPoints === 'function') ? mgr.applyExternalHeroPoints(tok.id, 1, 'Dado comprato dal Master') : null;
        if (pe === null) { toast(`🎲 Impossibile dare il Punto Eroe a ${p.name} (scheda 7th Sea mancante).`); return; }
        p.s7Unused = parseInt(p.s7Unused, 10) - 1;
        setDanger(danger.value + 1);
        toast(`🎲 Il Master compra un dado di ${p.name}: +1 Punto Eroe (ora ${pe}), +1 Punto Pericolo (Riserva ${danger.value}).`);
        renderTrackerList();
    }
    // Incrementi spesi contro una Squadra (p. 191): ogni Incremento toglie 1 Forza (= 1 PV del token)
    function aliveSquads() {
        return ini().participants.filter(p => p.s7Kind === 'squad').map(p => ({ p, st: squadStrength(p) })).filter(x => x.st && x.st > 0);
    }
    function spendOnSquad(actorId, squadId, amount) {
        const S = seq();
        const actor = findById(actorId), squad = findById(squadId);
        if (!S || isDrama(S) || S.phase !== PH_ACTIONS || !actor || !isActor(actor) || !squad || squad.s7Kind !== 'squad') return;
        const st = squadStrength(squad);
        const left = raisesOf(actor);
        if (!st || st <= 0 || left <= 0) return;
        if (!actionGate(actor)) return;
        const n = Math.min(left, st, Math.max(1, parseInt(amount, 10) || 1));
        actor.s7Raises = left - n;
        if (actor.s7Raises === 0) delete actor.s7Pick;
        const stok = tokOf(squad);
        stok.hpCurrent = st - n;
        if (typeof engine !== 'undefined' && engine && engine.selectedTokenId === stok.id && typeof window.updateSelectedTokenControls === 'function') {
            window.updateSelectedTokenControls(stok);
        }
        squadPanelFor = null;
        toast(stok.hpCurrent <= 0
            ? `🏳️ ${actor.name} spende ${n} Incrementi: ${squad.name} è sconfitta!`
            : `⚔️ ${actor.name} spende ${n} Incrementi contro ${squad.name}: Forza ${stok.hpCurrent}.`);
        renderTrackerList();
    }
    function squadPanelRow(actor) {
        const div = document.createElement('div');
        div.style.cssText = 'padding:4px 6px 6px 18px; background:#1e272c; border-bottom:1px solid #444; font-size:11px; color:#ddd;';
        const left = raisesOf(actor);
        let html = `<div style="margin-bottom:3px;">⚔️ ${esc(actor.name)} spende Incrementi contro una Squadra (1 Incremento = −1 Forza):</div>`;
        aliveSquads().forEach(x => {
            const def = Math.min(left, x.st);
            html += `<div style="display:flex; align-items:center; gap:4px; margin-top:2px;">
                <span style="flex:1;">${esc(x.p.name)} (Forza ${x.st})</span>
                <input type="text" inputmode="numeric" data-s7-squad-n="${esc(x.p.id)}" value="${def}" style="width:28px; text-align:center; background:#111; color:#fff; border:1px solid #555; border-radius:3px; font-size:11px;">
                <button type="button" data-s7-squad-apply="${esc(x.p.id)}" data-s7-actor="${esc(actor.id)}" style="background:#b71c1c; color:#fff; border:none; border-radius:3px; font-size:11px; font-weight:bold; padding:2px 7px; cursor:pointer;">Applica</button>
            </div>`;
        });
        html += `<div style="text-align:right; margin-top:3px;"><button type="button" data-s7-squad-close="1" style="background:transparent; color:#aaa; border:1px solid #555; border-radius:3px; font-size:10.5px; padding:1px 6px; cursor:pointer;">Chiudi</button></div>`;
        div.innerHTML = html;
        return div;
    }

    const MINI = 'color:#fff; border:none; border-radius:3px; font-size:9.5px; font-weight:bold; padding:0 4px; cursor:pointer; line-height:15px;';
    const SMALL = 'background:#37474f; color:#fff; border:1px solid #607d8b; border-radius:3px; font-size:10.5px; font-weight:bold; padding:1px 0; cursor:pointer; flex:1; min-width:0;';
    // ---------- Conseguenze, Opportunità e Limiti di Tempo (pp. 174-175, 179) ----------
    // type: 'each' = ogni Eroe evita spendendo fino a N Incrementi in una sola volta; 'shared' = Ferite ridotte insieme,
    // il resto a tutti; 'opp' = Opportunità (1 Incremento per prenderla). limit = scatta quando a TUTTI gli Eroi restano
    // meno di N Incrementi. Il Master applica le Ferite con un clic (niente automatismi nascosti).
    const itemForm = { open: false, type: 'each', text: '', wounds: '', limit: '' };
    let oppPanelFor = null;
    function itemsList() {
        const S = seq();
        if (!S) return [];
        if (!Array.isArray(S.items)) S.items = [];
        return S.items;
    }
    function findItem(id) { return itemsList().find(x => x.id === id); }
    function heroParts() {
        return ini().participants.filter(p => (p.s7Kind === 'hero' || p.s7Kind === 'ally') && tokOf(p));
    }
    function hasLimit(it) { return it.limit !== null && it.limit !== undefined && it.limit !== '' && !isNaN(Number(it.limit)); }
    function evaluateItems(S) {
        if (!S || S.phase === PH_ROLLS) return;
        const maxR = heroParts().reduce((m, p) => Math.max(m, raisesOf(p)), 0);
        itemsList().forEach(it => {
            if (it.state !== 'open') return;
            const expired = hasLimit(it) ? (maxR < Number(it.limit)) : (S.phase === PH_END);
            if (!expired) return;
            if (it.type === 'opp') {
                if (hasLimit(it)) { it.state = 'lost'; toast(`⌛ Opportunità persa: ${it.text}`); }
            } else {
                it.state = 'triggered';
                toast(`💥 ${it.text}: la Conseguenza scatta! Premi "Applica Ferite".`);
            }
        });
    }
    function woundTarget(p, n, label) {
        const tok = tokOf(p);
        if (!tok || n <= 0) return null;
        if (tok.pcSheet && tok.pcSheet.traits && window.seventhSeaSheetManager && typeof window.seventhSeaSheetManager.applyExternalWounds === 'function') {
            return window.seventhSeaSheetManager.applyExternalWounds(tok.id, n, label);
        }
        if (tok.hpCurrent !== undefined && tok.hpCurrent !== null) tok.hpCurrent = Math.max(0, Number(tok.hpCurrent) - n);
        return null;
    }
    function itemAdd() {
        const S = seq();
        if (!S) return;
        const type = ['each', 'shared', 'opp'].includes(itemForm.type) ? itemForm.type : 'each';
        const wounds = Math.max(0, parseInt(itemForm.wounds, 10) || 0);
        const lim = parseInt(itemForm.limit, 10);
        const text = String(itemForm.text || '').trim() || (type === 'opp' ? 'Opportunità' : 'Conseguenza');
        if (type !== 'opp' && wounds <= 0) { toast('Indica quante Ferite infligge la Conseguenza.'); return; }
        itemsList().push({
            id: 'it_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            type, text: text.slice(0, 80), wounds, limit: (!isNaN(lim) && lim > 0) ? lim : null,
            remaining: type === 'shared' ? wounds : 0, spent: {}, state: 'open'
        });
        itemForm.text = ''; itemForm.wounds = ''; itemForm.limit = ''; itemForm.open = false;
        renderTrackerList();
    }
    function itemEach(itemId, heroId, k) {
        const S = seq();
        const it = findItem(itemId), h = findById(heroId);
        if (!S || S.phase !== PH_ACTIONS || !it || it.type !== 'each' || (it.state !== 'open' && it.state !== 'triggered') || !h) return;
        if (!it.spent) it.spent = {};
        if (it.spent[h.id] !== undefined) return;            // in una sola volta (p. 179)
        const left = raisesOf(h);
        if (left <= 0) return;
        const n = Math.min(left, it.wounds, Math.max(1, parseInt(k, 10) || 1));
        if (!actionGate(h)) return;
        h.s7Raises = left - n;
        if (h.s7Raises === 0) delete h.s7Pick;
        it.spent[h.id] = n;
        toast(`🛡️ ${h.name} spende ${n} Incrementi contro "${it.text}": ne subirà ${Math.max(0, it.wounds - n)}.`);
        renderTrackerList();
    }
    function itemShared(itemId, heroId, k) {
        const S = seq();
        const it = findItem(itemId), h = findById(heroId);
        if (!S || S.phase !== PH_ACTIONS || !it || it.type !== 'shared' || (it.state !== 'open' && it.state !== 'triggered') || !h) return;
        const left = raisesOf(h);
        if (left <= 0 || it.remaining <= 0) return;
        const n = Math.min(left, it.remaining, Math.max(1, parseInt(k, 10) || 1));
        if (!actionGate(h)) return;
        h.s7Raises = left - n;
        if (h.s7Raises === 0) delete h.s7Pick;
        it.remaining -= n;
        if (it.remaining <= 0) { it.state = 'overcome'; toast(`✅ "${it.text}" superata: nessuna Ferita.`); }
        else toast(`🛡️ ${h.name} riduce "${it.text}" di ${n}: restano ${it.remaining} Ferite per tutti.`);
        renderTrackerList();
    }
    function itemTake(itemId, heroId) {
        const S = seq();
        const it = findItem(itemId), h = findById(heroId);
        if (!S || S.phase !== PH_ACTIONS || !it || it.type !== 'opp' || it.state !== 'open' || !h) return;
        if (it.createdBy && String(it.createdBy) === String(h.id)) return;   // l'Opportunità creata è per un altro Eroe
        const left = raisesOf(h);
        if (left <= 0) return;
        if (!actionGate(h)) return;
        h.s7Raises = left - 1;
        if (h.s7Raises === 0) delete h.s7Pick;
        it.state = 'taken';
        it.takenBy = h.name;
        toast(`✨ ${h.name} coglie l'Opportunità "${it.text}" (1 Incremento).`);
        renderTrackerList();
    }
    function itemApply(itemId) {
        const it = findItem(itemId);
        if (!seq() || !it || it.type === 'opp' || it.state !== 'triggered') return;
        const parts = [];
        heroParts().forEach(p => {
            const n = it.type === 'each' ? Math.max(0, it.wounds - ((it.spent && it.spent[p.id]) || 0)) : Math.max(0, it.remaining);
            if (n > 0) { woundTarget(p, n, it.text); parts.push(`${p.name} ${n}`); }
        });
        it.state = 'applied';
        toast(parts.length ? `💥 "${it.text}": Ferite applicate (${parts.join(', ')}).` : `"${it.text}": nessuno subisce Ferite.`);
        renderTrackerList();
    }
    function itemRemove(itemId) {
        const list = itemsList();
        const i = list.findIndex(x => x.id === itemId);
        if (i === -1) return;
        list.splice(i, 1);
        renderTrackerList();
    }
    function createOpportunity(heroId, text) {
        const S = seq();
        const h = findById(heroId);
        if (!S || S.phase !== PH_ACTIONS || !h || !isActor(h) || h.s7Kind === 'villain' || raisesOf(h) <= 0) return;
        if (!actionGate(h)) return;
        h.s7Raises = raisesOf(h) - 1;
        if (h.s7Raises === 0) delete h.s7Pick;
        const t = String(text || '').trim() || `Opportunità creata da ${h.name}`;
        itemsList().push({ id: 'it_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), type: 'opp', text: t.slice(0, 80), wounds: 0, limit: null, remaining: 0, spent: {}, state: 'open', createdBy: h.id, createdByName: h.name });
        oppPanelFor = null;
        toast(`✨ ${h.name} crea un'Opportunità per i compagni: "${t}" (1 Incremento).`);
        renderTrackerList();
    }
    function itemsBlockingNewRound() {
        return itemsList().some(it => it.type !== 'opp' && (it.state === 'open' || it.state === 'triggered'));
    }
    function itemsNotesForPlayers() {
        return itemsList().filter(it => it.state === 'open' || it.state === 'triggered').map(it => {
            const lim = hasLimit(it) ? ` · scatta a ${it.limit} Incrementi` : '';
            if (it.type === 'opp') return `✨ ${it.text}${lim}`;
            const dmg = it.type === 'shared' ? `${it.remaining} Ferite da ridurre insieme` : `${it.wounds} Ferite a testa`;
            return `${it.state === 'triggered' ? '💥' : '⚠️'} ${it.text}: ${dmg}${lim}`;
        });
    }
    const IBTN = 'border:none; border-radius:3px; font-size:10.5px; font-weight:bold; padding:1px 6px; cursor:pointer; color:#fff;';
    const IINP = 'background:#111; color:#fff; border:1px solid #555; border-radius:3px; font-size:11px;';
    function itemsHtml(S) {
        const items = itemsList();
        let html = `<div style="border-top:1px solid #444; padding-top:4px;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#ffcc80;">
                <b>⏳ Conseguenze e Opportunità${items.length ? ` (${items.length})` : ''}</b>
                <button type="button" data-s7-cmd="item-form" style="${IBTN} background:#455a64;">${itemForm.open ? 'Chiudi' : '+ Aggiungi'}</button>
            </div>`;
        if (itemForm.open) {
            html += `<div style="display:flex; flex-wrap:wrap; gap:4px; align-items:center; margin-top:4px; font-size:11px; color:#ddd;">
                <select data-s7-form="type" style="${IINP}">
                    <option value="each"${itemForm.type === 'each' ? ' selected' : ''}>Conseguenza per ogni Eroe</option>
                    <option value="shared"${itemForm.type === 'shared' ? ' selected' : ''}>Conseguenza condivisa</option>
                    <option value="opp"${itemForm.type === 'opp' ? ' selected' : ''}>Opportunità</option>
                </select>
                <input type="text" data-s7-form="text" value="${esc(itemForm.text)}" placeholder="es. La santabarbara esplode" style="${IINP} flex:1; min-width:120px;">
                <span>Ferite</span><input type="text" inputmode="numeric" data-s7-form="wounds" value="${esc(itemForm.wounds)}" style="${IINP} width:28px; text-align:center;">
                <span title="Scatta quando a tutti gli Eroi restano meno Incrementi di questo numero (vuoto = fine Round)">Limite a</span><input type="text" inputmode="numeric" data-s7-form="limit" value="${esc(itemForm.limit)}" placeholder="—" style="${IINP} width:28px; text-align:center;"><span>Incr.</span>
                <button type="button" data-s7-cmd="item-add" style="${IBTN} background:#2e7d32;">Aggiungi</button>
            </div>`;
        }
        const heroes = heroParts();
        items.forEach(it => {
            const lim = hasLimit(it) ? ` · ⏳ a ${it.limit}` : '';
            let badge = '';
            if (it.state === 'triggered') badge = '<span style="color:#ff8a80; font-weight:bold;">💥 Scattata</span>';
            else if (it.state === 'applied') badge = '<span style="color:#81c784;">✓ Applicata</span>';
            else if (it.state === 'overcome') badge = '<span style="color:#81c784;">✓ Superata</span>';
            else if (it.state === 'taken') badge = `<span style="color:#81c784;">✓ Presa da ${esc(it.takenBy || '')}</span>`;
            else if (it.state === 'lost') badge = '<span style="color:#aaa;">⌛ Persa</span>';
            const head = it.type === 'opp'
                ? `✨ <b>${esc(it.text)}</b>${it.createdByName ? ` <span style="color:#aaa;">(creata da ${esc(it.createdByName)})</span>` : ''}${lim}`
                : `${it.type === 'shared' ? '⚠️ <b>' + esc(it.text) + `</b> · Ferite <b>${it.remaining}</b>/${it.wounds} condivise` : '⚠️ <b>' + esc(it.text) + `</b> · ${it.wounds} Ferite a testa`}${lim}`;
            html += `<div style="margin-top:4px; padding:3px 5px; background:#1f1b16; border:1px solid #4e342e; border-radius:4px; font-size:11px; color:#ddd;">
                <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;"><span style="flex:1;">${head}</span>${badge}
                    <button type="button" data-s7-cmd="item-remove" data-s7-item="${esc(it.id)}" title="Togli" style="background:transparent; color:#ff5252; border:none; cursor:pointer; font-weight:bold;">✕</button></div>`;
            const live = it.state === 'open' || it.state === 'triggered';
            if (live && S.phase === PH_ACTIONS && it.type === 'each') {
                heroes.forEach(h => {
                    const sp = it.spent ? it.spent[h.id] : undefined;
                    if (sp !== undefined) html += `<div style="color:#a5d6a7;">${esc(h.name)}: −${sp} → subisce ${Math.max(0, it.wounds - sp)}</div>`;
                    else if (raisesOf(h) > 0) html += `<div style="display:flex; align-items:center; gap:4px; margin-top:2px;"><span style="flex:1;">${esc(h.name)}</span>
                        <input type="text" inputmode="numeric" data-s7-item-k="${esc(it.id)}|${esc(h.id)}" value="${Math.min(raisesOf(h), it.wounds)}" style="${IINP} width:26px; text-align:center;">
                        <button type="button" data-s7-cmd="item-each" data-s7-item="${esc(it.id)}" data-s7-hero="${esc(h.id)}" style="${IBTN} background:#1565c0;">Evita</button></div>`;
                });
            } else if (live && S.phase === PH_ACTIONS && it.type === 'shared' && it.remaining > 0) {
                const opts = heroes.filter(h => raisesOf(h) > 0).map(h => `<option value="${esc(h.id)}">${esc(h.name)}</option>`).join('');
                if (opts) html += `<div style="display:flex; align-items:center; gap:4px; margin-top:2px;">
                    <select data-s7-item-hero="${esc(it.id)}" style="${IINP} max-width:110px;">${opts}</select>
                    <input type="text" inputmode="numeric" data-s7-item-n="${esc(it.id)}" value="1" style="${IINP} width:26px; text-align:center;">
                    <button type="button" data-s7-cmd="item-shared" data-s7-item="${esc(it.id)}" style="${IBTN} background:#1565c0;">Riduci</button></div>`;
            } else if (it.state === 'open' && S.phase === PH_ACTIONS && it.type === 'opp') {
                const opts = heroes.filter(h => raisesOf(h) > 0 && String(h.id) !== String(it.createdBy || '')).map(h => `<option value="${esc(h.id)}">${esc(h.name)}</option>`).join('');
                if (opts) html += `<div style="display:flex; align-items:center; gap:4px; margin-top:2px;">
                    <select data-s7-item-hero="${esc(it.id)}" style="${IINP} max-width:110px;">${opts}</select>
                    <button type="button" data-s7-cmd="item-take" data-s7-item="${esc(it.id)}" style="${IBTN} background:#6a1b9a;">Presa (−1)</button></div>`;
            }
            if (it.state === 'triggered') html += `<div style="margin-top:3px;"><button type="button" data-s7-cmd="item-apply" data-s7-item="${esc(it.id)}" style="${IBTN} background:#b71c1c; padding:2px 8px;">Applica Ferite</button></div>`;
            html += '</div>';
        });
        html += '</div>';
        return html;
    }
    function oppPanelRow(h) {
        const div = document.createElement('div');
        div.style.cssText = 'padding:4px 6px 6px 18px; background:#231a2b; border-bottom:1px solid #444; font-size:11px; color:#ddd; display:flex; align-items:center; gap:4px; flex-wrap:wrap;';
        div.innerHTML = `<span>✨ ${esc(h.name)} crea un'Opportunità per un compagno (1 Incremento):</span>
            <input type="text" data-s7-opp-text="${esc(h.id)}" placeholder="es. Faccio scivolare la pistola verso Elena" style="${IINP} flex:1; min-width:120px;">
            <button type="button" data-s7-opp-go="${esc(h.id)}" style="${IBTN} background:#6a1b9a;">Crea</button>
            <button type="button" data-s7-opp-close="1" style="background:transparent; color:#aaa; border:1px solid #555; border-radius:3px; font-size:10.5px; padding:1px 6px; cursor:pointer;">Chiudi</button>`;
        return div;
    }

    // ---------- Ferite dei Malvagi (p. 194): Forza Ferite, la successiva è Drammatica; 4 Ferite Drammatiche = sconfitto ----------
    function villainForza(p) {
        const tok = tokOf(p);
        const f = (tok && tok.statblock) ? parseInt(tok.statblock.s7Strength, 10) : NaN;
        return (isNaN(f) || f <= 0) ? null : f;
    }
    function villainTrack(p) {
        if (p.s7Kind !== 'villain') return null;
        const F = villainForza(p);
        if (!F) return null;
        const tok = tokOf(p);
        const cyc = F + 1;
        const max = 4 * cyc;
        const W = Math.max(0, Math.min(max, parseInt(tok.s7VillainWounds, 10) || 0));
        const fd = Math.min(4, Math.floor(W / cyc));
        return { F, W, fd, w: fd >= 4 ? F : (W % cyc), defeated: fd >= 4, max, cyc };
    }
    function setVillainWounds(p, W) {
        const tok = tokOf(p);
        const F = villainForza(p);
        if (!tok || !F) return;
        const max = 4 * (F + 1);
        tok.s7VillainWounds = Math.max(0, Math.min(max, W));
        tok.hpMax = max;                                   // la barra del token mostra quanto manca alla sconfitta
        tok.hpCurrent = max - tok.s7VillainWounds;
    }
    function isDefeated(p) { const tr = villainTrack(p); return !!(tr && tr.defeated); }
    function heroWoundsInfo(tok) {
        const pc = tok && tok.pcSheet;
        if (!pc || !pc.traits) return null;
        return { w: parseInt(pc.currentWounds, 10) || 0, fd: Array.isArray(pc.dramaticWounds) ? pc.dramaticWounds.filter(Boolean).length : 0, pe: parseInt(pc.heroPoints, 10) || 0 };
    }
    // Eroe Inerme (pp. 177, 181): ogni Azione decisa dal tracker costa 1 Punto Eroe dalla sua scheda. false = Azione negata
    function payHelplessAction(p) {
        if (!p || p.s7Kind !== 'hero') return true;
        const tok = tokOf(p);
        if (!isHelpless(tok)) return true;
        const mgr = window.seventhSeaSheetManager;
        const left = (mgr && typeof mgr.applyExternalHeroPoints === 'function') ? mgr.applyExternalHeroPoints(tok.id, -1, 'Azione da Inerme') : null;
        if (left === null) {
            toast(`💀 ${p.name} è Inerme senza Punti Eroe: non può compiere Azioni.`);
            return false;
        }
        toast(`💀 ${p.name} agisce da Inerme: speso 1 Punto Eroe (ne restano ${left}).`);
        return true;
    }

    // ---------- Pressione (p. 176; Pressione Malvagia p. 197) e Improvvisare (p. 173) ----------
    // Chi mette Pressione spende 1 Incremento (un'Azione) e sceglie l'Azione che il bersaglio deve compiere; la prima Azione
    // diversa gli costa 1 Incremento in più e rompe la Pressione (lo decide il Master: "Rompi +1"). Un personaggio sotto
    // Pressione non può riceverne una seconda finché la prima non è risolta. Un Malvagio può metterla a tutti gli Eroi
    // della Scena con 1 Incremento + 1 Punto Pericolo (scalato dalla Riserva di Pericolo).
    let pressPanelFor = null;
    function newId(pfx) { return pfx + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
    function pressureList() {
        const S = seq();
        if (!S) return [];
        if (!Array.isArray(S.pressures)) S.pressures = [];
        return S.pressures;
    }
    function pressureOn(p) { return p ? (pressureList().find(x => String(x.targetId) === String(p.id)) || null) : null; }
    function pressureTargets(actor) { return attackTargets(actor).filter(t => t !== actor && !pressureOn(t)); }
    function canPressAll(actor) { return actor.s7Kind === 'villain' && heroParts().some(t => !pressureOn(t)); }
    function canAct(S, a) { return !!S && S.phase === PH_ACTIONS && !!a && isActor(a) && raisesOf(a) > 0 && !isDefeated(a); }
    function pressureReminder(p) {
        const pr = pressureOn(p);
        if (pr) toast(`🎯 ${p.name} è sotto Pressione di ${pr.fromName} («${pr.action}»): se questa Azione è diversa, premi Rompi (+1).`);
    }
    // Ogni Azione decisa dal tracker: costo da Inerme + promemoria della Pressione
    function actionGate(p) {
        if (!payHelplessAction(p)) return false;
        pressureReminder(p);
        return true;
    }
    function applyPressure(actorId, targetId, action) {
        const S = seq();
        const a = findById(actorId);
        if (!canAct(S, a)) return;
        const what = String(action || '').trim().slice(0, 60);
        if (!what) { toast("🎯 Scrivi l'Azione che il bersaglio è costretto a compiere (es. «Attaccami», «Fuggi»)."); return; }
        const all = targetId === '__all__';
        if (all && a.s7Kind !== 'villain') return;
        const targets = all ? heroParts().filter(t => !pressureOn(t)) : pressureTargets(a).filter(t => String(t.id) === String(targetId));
        if (!targets.length) { toast(all ? '🎯 Tutti gli Eroi sono già sotto Pressione.' : '🎯 Bersaglio non valido o già sotto Pressione.'); return; }
        if (all && !hasDanger('la Pressione a tutti gli Eroi')) return;
        if (!actionGate(a)) return;
        a.s7Raises = raisesOf(a) - 1;
        if (a.s7Raises === 0) delete a.s7Pick;
        const group = all ? newId('pg_') : null;
        targets.forEach(t => pressureList().push({ id: newId('pr_'), fromId: a.id, fromName: a.name, targetId: t.id, targetName: t.name, action: what, group }));
        if (all) spendDanger();
        pressPanelFor = null;
        toast(all ? `🎯 ${a.name} mette Pressione a tutti gli Eroi: «${what}» (1 Incremento + 1 Punto Pericolo, Riserva ${danger.value}).`
                  : `🎯 ${a.name} mette Pressione a ${targets[0].name}: «${what}» (1 Incremento).`);
        renderTrackerList();
    }
    function breakPressure(prId) {
        const S = seq();
        const list = pressureList();
        const pr = list.find(x => x.id === prId);
        if (!S || !pr || S.phase !== PH_ACTIONS) return;
        const t = findById(pr.targetId);
        if (!t || raisesOf(t) <= 0) return;
        t.s7Raises = raisesOf(t) - 1;
        if (t.s7Raises === 0) delete t.s7Pick;
        list.splice(list.indexOf(pr), 1);
        toast(`💥 ${t.name} rompe la Pressione di ${pr.fromName}: 1 Incremento in più (ne restano ${t.s7Raises}).`);
        renderTrackerList();
    }
    function resolvePressure(prId) {
        const list = pressureList();
        const pr = list.find(x => x.id === prId);
        if (!pr) return;
        list.splice(list.indexOf(pr), 1);
        toast(`🎯 Pressione di ${pr.fromName} su ${pr.targetName} risolta.`);
        renderTrackerList();
    }
    // Improvvisare: un'Azione fuori dall'Approccio dichiarato costa 1 Incremento in più (non è un'Azione in più)
    function improvise(id) {
        const S = seq();
        const p = findById(id);
        if (!canAct(S, p) || (p.s7Kind !== 'hero' && p.s7Kind !== 'ally')) return;
        p.s7Raises = raisesOf(p) - 1;
        if (p.s7Raises === 0) delete p.s7Pick;
        toast(`🔀 ${p.name} agisce fuori dal suo Approccio: 1 Incremento in più (ne restano ${p.s7Raises}).`);
        renderTrackerList();
    }
    function pressureNotesForPlayers() {
        const out = [], seen = new Set(), list = pressureList();
        list.forEach(pr => {
            if (pr.group) {
                if (seen.has(pr.group)) return;
                seen.add(pr.group);
                const names = list.filter(x => x.group === pr.group).map(x => x.targetName).join(', ');
                out.push(`🎯 ${names} sotto Pressione di ${pr.fromName}: «${pr.action}» (Azione diversa = +1 Incremento)`);
            } else {
                out.push(`🎯 ${pr.targetName} sotto Pressione di ${pr.fromName}: «${pr.action}» (Azione diversa = +1 Incremento)`);
            }
        });
        return out;
    }
    function pressPanelRow(actor) {
        const div = document.createElement('div');
        div.style.cssText = 'padding:4px 6px 6px 18px; background:#1f1d2e; border-bottom:1px solid #444; font-size:11px; color:#ddd; display:flex; align-items:center; gap:4px; flex-wrap:wrap;';
        let opts = pressureTargets(actor).map(x => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
        if (canPressAll(actor)) opts += `<option value="__all__">Tutti gli Eroi (+1 Punto Pericolo)</option>`;
        div.innerHTML = `<span>🎯 ${esc(actor.name)} mette Pressione (1 Incremento):</span>
            <select data-s7-press-target="${esc(actor.id)}" style="${IINP} max-width:140px;">${opts}</select>
            <input type="text" data-s7-press-text="${esc(actor.id)}" placeholder="Azione imposta, es. Attaccami" style="${IINP} flex:1; min-width:110px;">
            <button type="button" data-s7-press-go="${esc(actor.id)}" style="${IBTN} background:#4527a0;">Metti Pressione</button>
            <button type="button" data-s7-press-close="1" style="background:transparent; color:#aaa; border:1px solid #555; border-radius:3px; font-size:10.5px; padding:1px 6px; cursor:pointer;">Chiudi</button>`;
        return div;
    }
    function pressureRow(pr, S) {
        const t = findById(pr.targetId);
        const canBreak = !!t && S.phase === PH_ACTIONS && raisesOf(t) > 0;
        const div = document.createElement('div');
        div.style.cssText = 'padding:3px 6px 4px 18px; background:#241f3a; border-bottom:1px solid #3d3566; font-size:11px; color:#d1c4e9; display:flex; align-items:center; gap:4px; flex-wrap:wrap;';
        div.innerHTML = `<span style="flex:1; min-width:120px;">🎯 Sotto Pressione di <b>${esc(pr.fromName)}</b>: «${esc(pr.action)}» · Azione diversa = +1 Incremento</span>
            <button type="button" data-s7-press-break="${esc(pr.id)}" ${canBreak ? '' : 'disabled'} title="Il bersaglio compie un'Azione diversa: paga 1 Incremento in più e la Pressione si rompe" style="${IBTN} background:${canBreak ? '#6a1b9a' : '#37474f'}; cursor:${canBreak ? 'pointer' : 'default'};">Rompi (+1)</button>
            <button type="button" data-s7-press-resolve="${esc(pr.id)}" title="Situazione risolta: togli la Pressione senza costi" style="background:transparent; color:#bbb; border:1px solid #555; border-radius:3px; font-size:10.5px; padding:1px 6px; cursor:pointer;">✕ Risolta</button>`;
        return div;
    }

    // ---------- Omicidio dell'Eroe Inerme (p. 181) ----------
    // Il Malvagio spende 1 Punto Pericolo e tutti i suoi Incrementi: l'Eroe Inerme muore alla fine del Round. Un altro Eroe
    // può salvarlo spendendo subito tutti i suoi Incrementi e 1 Punto Eroe: il salvato è protetto per il resto della Scena
    // (finché il salvatore non diventa Inerme). Fuori da una Sequenza d'Azione basta 1 Punto Eroe, ma è la sola Azione possibile.
    function murderList() {
        const S = seq();
        if (!S) return [];
        if (!Array.isArray(S.murders)) S.murders = [];
        return S.murders;
    }
    function murderOn(p) { return p ? (murderList().find(m => String(m.targetId) === String(p.id)) || null) : null; }
    function isProtected(p) {
        const S = seq();
        const sid = S && S.protected ? S.protected[p.id] : null;
        if (!sid) return false;
        const sav = findById(sid);
        return !!sav && !isHelpless(tokOf(sav));            // la protezione finisce se il salvatore diventa Inerme
    }
    function murderTargets() {
        return ini().participants.filter(p => p.s7Kind === 'hero' && isHelpless(tokOf(p)) && !isProtected(p) && !murderOn(p));
    }
    function saviorsFor(m) {
        const S = seq();
        return ini().participants.filter(p => p.s7Kind === 'hero' && String(p.id) !== String(m.targetId) && tokOf(p) && !isHelpless(tokOf(p)) && (isDrama(S) || raisesOf(p) > 0));
    }
    function murder(villainId, targetId) {
        const S = seq();
        const v = findById(villainId);
        if (!canAct(S, v) || v.s7Kind !== 'villain') return;
        const t = murderTargets().find(x => String(x.id) === String(targetId));
        if (!t) { toast('💀 Nessun Eroe Inerme non protetto da colpire.'); return; }
        if (!hasDanger("l'Omicidio")) return;
        if (!actionGate(v)) return;
        spendDanger();
        const spent = raisesOf(v);
        v.s7Raises = 0;
        delete v.s7Pick;
        murderList().push({ id: newId('mu_'), villainId: v.id, villainName: v.name, targetId: t.id, targetName: t.name, state: 'pending' });
        murderPanelFor = null;
        toast(isDrama(S)
            ? `💀 ${v.name} vuole uccidere ${t.name} (Inerme): 1 Punto Pericolo (Riserva ${danger.value}). Un compagno può fermarlo con 1 Punto Eroe.`
            : `💀 ${v.name} spende ${spent} Incrementi e 1 Punto Pericolo (Riserva ${danger.value}) per uccidere ${t.name}: si compie alla fine del Round, salvo che un compagno lo salvi.`);
        renderTrackerList();
    }
    function saveFromMurder(murderId, saviorId) {
        const S = seq();
        const m = murderList().find(x => x.id === murderId);
        if (!S || !m || m.state !== 'pending') return;
        const s = saviorsFor(m).find(x => String(x.id) === String(saviorId));
        if (!s) { toast(isDrama(S) ? '🛡️ Scegli un compagno non Inerme.' : '🛡️ Serve un compagno non Inerme con almeno 1 Incremento.'); return; }
        const mgr = window.seventhSeaSheetManager;
        const pe = (mgr && typeof mgr.applyExternalHeroPoints === 'function') ? mgr.applyExternalHeroPoints(tokOf(s).id, -1, 'Salva un compagno dall\'Omicidio') : null;
        if (pe === null) { toast(`🛡️ ${s.name} non ha Punti Eroe: non può salvare ${m.targetName}.`); return; }
        const spent = raisesOf(s);
        s.s7Raises = 0;                                     // tutti i suoi Incrementi (nella Drammatica: è la sola Azione possibile)
        delete s.s7Pick;
        murderList().splice(murderList().indexOf(m), 1);
        if (!S.protected) S.protected = {};
        S.protected[m.targetId] = s.id;
        toast(`🛡️ ${s.name} ferma la mano di ${m.villainName}${isDrama(S) ? '' : ` (${spent} Incrementi)`} e 1 Punto Eroe: ${m.targetName} è salvo e protetto per il resto della Scena.`);
        renderTrackerList();
    }
    function murderDone(m) {
        m.state = 'done';
        toast(`💀 ${m.villainName} uccide ${m.targetName}. Conferma sulla sua riga quando hai narrato la scena.`);
    }
    function resolveMurders(S) {
        if (!S || isDrama(S) || S.phase !== PH_END) return;  // nella Sequenza d'Azione si compie alla fine del Round
        murderList().forEach(m => { if (m.state === 'pending') murderDone(m); });
    }
    function murderAct(murderId, what) {
        const list = murderList();
        const m = list.find(x => x.id === murderId);
        if (!m) return;
        if (what === 'now' && m.state === 'pending' && isDrama(seq())) murderDone(m);
        else if (what === 'confirm' && m.state === 'done') list.splice(list.indexOf(m), 1);
        else if (what === 'cancel') { list.splice(list.indexOf(m), 1); toast(`💀 Omicidio di ${m.targetName} annullato dal Master.`); }
        renderTrackerList();
    }
    function murdersNotesForPlayers() {
        const S = seq();
        return murderList().map(m => m.state === 'done'
            ? `💀 ${m.targetName} è stato ucciso da ${m.villainName}`
            : `💀 ${m.villainName} vuole uccidere ${m.targetName} (Inerme): ${isDrama(S) ? 'un compagno può fermarlo con 1 Punto Eroe' : 'si compie a fine Round, un compagno può salvarlo (tutti gli Incrementi + 1 Punto Eroe)'}`);
    }
    let murderPanelFor = null;
    function murderPanelRow(v) {
        const div = document.createElement('div');
        div.style.cssText = 'padding:4px 6px 6px 18px; background:#1a0f0f; border-bottom:1px solid #5d2a2a; font-size:11px; color:#ddd; display:flex; align-items:center; gap:4px; flex-wrap:wrap;';
        const opts = murderTargets().map(x => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
        div.innerHTML = `<span>💀 ${esc(v.name)} uccide un Eroe Inerme (1 Punto Pericolo + tutti gli Incrementi · Riserva ${danger.value}):</span>
            <select data-s7-murder-target="${esc(v.id)}" style="${IINP} max-width:130px;">${opts}</select>
            <button type="button" data-s7-murder-go="${esc(v.id)}" style="${IBTN} background:#4a0000;">Omicidio</button>
            <button type="button" data-s7-murder-close="1" style="background:transparent; color:#aaa; border:1px solid #555; border-radius:3px; font-size:10.5px; padding:1px 6px; cursor:pointer;">Chiudi</button>`;
        return div;
    }
    function murderRow(m, S) {
        const div = document.createElement('div');
        div.style.cssText = 'padding:4px 6px 5px 18px; background:#2b0a0a; border-bottom:1px solid #6d1b1b; font-size:11px; color:#fecaca; display:flex; align-items:center; gap:4px; flex-wrap:wrap;';
        const cancel = `<button type="button" data-s7-murder-act="cancel" data-s7-murder="${esc(m.id)}" title="Il Master annulla l'Omicidio" style="background:transparent; color:#bbb; border:1px solid #555; border-radius:3px; font-size:10.5px; padding:1px 6px; cursor:pointer;">✕ Annulla</button>`;
        if (m.state === 'done') {
            div.innerHTML = `<span style="flex:1; min-width:120px;">💀 <b>Ucciso da ${esc(m.villainName)}</b></span>
                <button type="button" data-s7-murder-act="confirm" data-s7-murder="${esc(m.id)}" style="${IBTN} background:#4a0000;">Conferma</button>`;
            return div;
        }
        const sav = saviorsFor(m);
        const opts = sav.map(x => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
        const cost = isDrama(S) ? '1 Punto Eroe, sola Azione' : 'tutti gli Incrementi + 1 Punto Eroe';
        div.innerHTML = `<span style="flex:1; min-width:120px;">💀 ${esc(m.villainName)} vuole ucciderlo: ${isDrama(S) ? 'lo fermi un compagno' : 'si compie a fine Round'}</span>
            ${sav.length ? `<select data-s7-save-hero="${esc(m.id)}" style="${IINP} max-width:110px;">${opts}</select>
            <button type="button" data-s7-save="${esc(m.id)}" title="Salva il compagno (${cost})" style="${IBTN} background:#1565c0;">🛡️ Salva</button>` : '<span style="color:#999;">(nessun compagno può salvarlo)</span>'}
            ${isDrama(S) ? `<button type="button" data-s7-murder-act="now" data-s7-murder="${esc(m.id)}" style="${IBTN} background:#4a0000;">Si compie</button>` : ''}
            ${cancel}`;
        return div;
    }

    // ---------- Attacchi e Ferite in arrivo (p. 180) ----------
    function attackTargets(attacker) {
        const parts = ini().participants;
        if (attacker.s7Kind === 'villain') return parts.filter(p => (p.s7Kind === 'hero' || p.s7Kind === 'ally') && tokOf(p));
        return parts.filter(p => p.s7Kind === 'villain' && tokOf(p) && !isDefeated(p));
    }
    function pendingList() {
        const S = seq();
        if (!S) return [];
        if (!Array.isArray(S.pending)) S.pending = [];
        return S.pending;
    }
    function attack(attackerId, targetId, amount, firearm) {
        const S = seq();
        const a = findById(attackerId), t = findById(targetId);
        if (!S || isDrama(S) || S.phase !== PH_ACTIONS || !a || !isActor(a) || !t || isDefeated(a)) return;
        if (!attackTargets(a).some(x => x === t)) return;
        const left = raisesOf(a);
        if (left <= 0) return;
        if (!actionGate(a)) return;
        const n = Math.min(left, Math.max(1, parseInt(amount, 10) || 1));
        a.s7Raises = left - n;
        if (a.s7Raises === 0) delete a.s7Pick;
        pendingList().push({ id: 'pd_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), attackerId: a.id, attackerName: a.name, targetId: t.id, amount: n, firearm: !!firearm });
        attackPanelFor = null;
        toast(`🗡️ ${a.name} spende ${n} Incrementi contro ${t.name}: ${n} Ferite in arrivo${firearm ? ' (+1 Ferita Drammatica da arma da fuoco)' : ''}.`);
        renderTrackerList();
    }
    function evade(pendId) {
        const S = seq();
        const list = pendingList();
        const pd = list.find(x => x.id === pendId);
        if (!S || !pd) return;
        const t = findById(pd.targetId);
        if (!t || pd.amount <= 0 || raisesOf(t) <= 0 || S.phase === PH_ROLLS) return;
        t.s7Raises = raisesOf(t) - 1;           // Incremento speso fuori turno, 1 per Ferita evitata
        if (t.s7Raises === 0) delete t.s7Pick;
        pd.amount -= 1;
        if (pd.amount <= 0 && !pd.firearm) {
            list.splice(list.indexOf(pd), 1);
            toast(`💨 ${t.name} evita tutte le Ferite di ${pd.attackerName}.`);
        }
        renderTrackerList();
    }
    function suffer(pendId) {
        const S = seq();
        const list = pendingList();
        const pd = list.find(x => x.id === pendId);
        if (!S || !pd) return;
        list.splice(list.indexOf(pd), 1);
        const t = findById(pd.targetId);
        const ttok = t ? tokOf(t) : null;
        if (!t || !ttok) { renderTrackerList(); return; }
        const n = Math.max(0, pd.amount);
        const extra = pd.firearm ? ' + 1 Ferita Drammatica (arma da fuoco)' : '';
        if (t.s7Kind === 'villain' && villainForza(t)) {
            const tr = villainTrack(t);
            let W = tr.W + n;
            if (pd.firearm) W = (Math.floor(W / tr.cyc) + 1) * tr.cyc;  // riempie la prossima Ferita Drammatica
            setVillainWounds(t, W);
            const now = villainTrack(t);
            if (now.defeated) {
                t.s7Raises = 0;
                delete t.s7Pick;
                toast(`🏳️ ${t.name} subisce ${n} Ferite${extra}: 4 Ferite Drammatiche, è sconfitto!`);
            } else {
                toast(`🩸 ${t.name} subisce ${n} Ferite${extra}: Ferite ${now.w}/${now.F}, Ferite Drammatiche ${now.fd}/4.`);
            }
        } else if (ttok.pcSheet && ttok.pcSheet.traits && window.seventhSeaSheetManager && typeof window.seventhSeaSheetManager.applyExternalWounds === 'function') {
            const res = window.seventhSeaSheetManager.applyExternalWounds(ttok.id, n, pd.attackerName, { dramatic: pd.firearm ? 1 : 0 });
            if (res) toast(`🩸 ${t.name} subisce ${n} Ferite${extra}: ${res.wounds} Ferite, ${res.dramatic} Ferite Drammatiche.`);
        } else {
            if (ttok.hpCurrent !== undefined && ttok.hpCurrent !== null) ttok.hpCurrent = Math.max(0, Number(ttok.hpCurrent) - n);
            toast(`🩸 ${t.name} subisce ${n} Ferite${extra}.`);
        }
        renderTrackerList();
    }
    function pendingRow(pd, S) {
        const t = findById(pd.targetId);
        const div = document.createElement('div');
        div.style.cssText = 'padding:4px 6px 5px 18px; background:#3b1219; border-bottom:1px solid #6d2a33; font-size:11px; color:#fecaca; display:flex; align-items:center; gap:4px; flex-wrap:wrap;';
        const canEvade = t && raisesOf(t) > 0 && pd.amount > 0 && S.phase !== PH_ROLLS;
        div.innerHTML = `<span style="flex:1; min-width:120px;">🗡️ ${esc(pd.attackerName)}: <b>${pd.amount}</b> Ferite in arrivo${pd.firearm ? ' <b>+1 FD</b> (arma da fuoco, inevitabile)' : ''}</span>
            <button type="button" data-s7-evade="${esc(pd.id)}" ${canEvade ? '' : 'disabled'} title="Il bersaglio spende 1 Incremento fuori turno per evitare 1 Ferita" style="background:${canEvade ? '#1565c0' : '#37474f'}; color:#fff; border:none; border-radius:3px; font-size:10.5px; font-weight:bold; padding:2px 6px; cursor:${canEvade ? 'pointer' : 'default'};">Evita −1</button>
            <button type="button" data-s7-suffer="${esc(pd.id)}" title="Applica le Ferite rimaste" style="background:#b71c1c; color:#fff; border:none; border-radius:3px; font-size:10.5px; font-weight:bold; padding:2px 6px; cursor:pointer;">Subisci</button>`;
        return div;
    }
    function attackPanelRow(attacker) {
        const div = document.createElement('div');
        div.style.cssText = 'padding:4px 6px 6px 18px; background:#2a1d1d; border-bottom:1px solid #444; font-size:11px; color:#ddd;';
        const targets = attackTargets(attacker);
        const left = raisesOf(attacker);
        const opts = targets.map(x => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
        div.innerHTML = `<div style="margin-bottom:3px;">🗡️ ${esc(attacker.name)} attacca (1 Incremento = 1 Ferita):</div>
            <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
                <select data-s7-attack-target="${esc(attacker.id)}" style="background:#111; color:#fff; border:1px solid #555; border-radius:3px; font-size:11px; max-width:120px;">${opts}</select>
                <input type="text" inputmode="numeric" data-s7-attack-n="${esc(attacker.id)}" value="${Math.min(1, left)}" title="Incrementi da spendere = Ferite inflitte" style="width:28px; text-align:center; background:#111; color:#fff; border:1px solid #555; border-radius:3px; font-size:11px;">
                <label style="display:flex; align-items:center; gap:2px; cursor:pointer;" title="Chi viene colpito da un'arma da fuoco subisce anche 1 Ferita Drammatica che non si può evitare"><input type="checkbox" data-s7-attack-fire="${esc(attacker.id)}" style="margin:0;"> <span>Arma da fuoco</span></label>
                <button type="button" data-s7-attack-go="${esc(attacker.id)}" style="background:#b71c1c; color:#fff; border:none; border-radius:3px; font-size:11px; font-weight:bold; padding:2px 7px; cursor:pointer;">Attacca</button>
                <button type="button" data-s7-attack-close="1" style="background:transparent; color:#aaa; border:1px solid #555; border-radius:3px; font-size:10.5px; padding:1px 6px; cursor:pointer;">Chiudi</button>
            </div>`;
        return div;
    }

    function rowFor(p, idx, S) {
        const I = ini();
        const tok = tokOf(p);
        const isCurrent = !!S && S.phase === PH_ACTIONS && idx === I.currentTurnIndex;
        const div = document.createElement('div');
        div.className = isCurrent ? 'tracker-row-active' : 'tracker-row';
        div.style.cssText = `display:flex; gap:4px; padding:5px; align-items:center; border-bottom:1px solid #444; background:${isCurrent ? '#2e7d32' : (idx % 2 === 0 ? '#2b2b2b' : '#353535')};`;
        if (p.s7Kind === 'squad') div.style.borderLeft = '3px solid #8d6e63';
        else if (p.s7Kind === 'villain') div.style.borderLeft = '3px solid #c62828';
        const helpless = p.s7Kind === 'hero' && isHelpless(tok);
        const hidden = p.isHidden ? ' 👁️‍🗨️' : '';
        const tr = villainTrack(p);
        const hw = (p.s7Kind === 'hero' || p.s7Kind === 'ally') ? heroWoundsInfo(tok) : null;
        let sub = '';
        if (tr) sub = tr.defeated ? '🏳️ Sconfitto' : `Ferite ${tr.w}/${tr.F} · FD ${'★'.repeat(tr.fd)}${'☆'.repeat(4 - tr.fd)}`;
        else if (hw) sub = `🩸 ${hw.w} Ferite · FD ${hw.fd}${helpless ? ` · 💀 PE ${hw.pe}` : ''}`;
        // azioni secondarie (seconda riga): scelta tra Eroi alla pari, Sgherri, attacco
        let acts = '';
        if (S && p.s7Kind === 'hero' && parseInt(p.s7Unused, 10) > 0) acts += `<button type="button" data-s7-buy="${esc(p.id)}" style="${MINI} background:#455a64;" title="Il Master compra un dado rimasto fuori dagli Incrementi: +1 Punto Eroe all'Eroe, +1 Punto Pericolo al Master (p. 173)">🎲 ${parseInt(p.s7Unused, 10)} dadi inutilizzati: Compra</button>`;
        if (S && !isDrama(S) && S.phase !== PH_ROLLS && p.s7Kind === 'squad' && squadStrength(p) > 0) acts += `<button type="button" data-s7-cap-open="${esc(p.id)}" style="${MINI} background:#7f1d1d;" title="Capacità speciale della Squadra con 1 Punto Pericolo (p. 192)">☠️ Capacità</button>`;
        if (S && S.phase === PH_ACTIONS && isActor(p) && raisesOf(p) > 0 && !isDefeated(p)) {
            if (!isCurrent && isTiedWithCurrent(p)) acts += `<button type="button" data-s7-pick="${esc(p.id)}" style="${MINI} background:#1565c0;" title="Pareggio tra Eroi: fai agire lui">▶ Agisce</button>`;
            if (!isDrama(S) && p.s7Kind !== 'villain' && aliveSquads().length) acts += `<button type="button" data-s7-squad-open="${esc(p.id)}" style="${MINI} background:#6d4c41;" title="Spendi Incrementi contro una Squadra di Sgherri (−1 Forza ciascuno)">⚔️ Sgherri</button>`;
            if (p.s7Kind !== 'villain' && heroParts().length > 1) acts += `<button type="button" data-s7-opp-open="${esc(p.id)}" style="${MINI} background:#6a1b9a;" title="Spendi 1 Incremento per creare un'Opportunità per un compagno">✨ Opportunità</button>`;
            if (p.s7Kind === 'villain' && murderTargets().length) acts += `<button type="button" data-s7-murder-open="${esc(p.id)}" style="${MINI} background:#4a0000;" title="Omicidio di un Eroe Inerme: 1 Punto Pericolo e tutti gli Incrementi (p. 181)">💀 Omicidio</button>`;
            if (pressureTargets(p).length || canPressAll(p)) acts += `<button type="button" data-s7-press-open="${esc(p.id)}" style="${MINI} background:#4527a0;" title="Spendi 1 Incremento: il bersaglio deve compiere l'Azione che scegli, altrimenti paga 1 Incremento in più">🎯 Pressione</button>`;
            if (p.s7Kind === 'hero' || p.s7Kind === 'ally') acts += `<button type="button" data-s7-improvise="${esc(p.id)}" style="${MINI} background:#00695c;" title="Improvvisare: un'Azione fuori dall'Approccio dichiarato costa 1 Incremento in più">🔀 +1 Approccio</button>`;
            if (!isDrama(S) && attackTargets(p).length) acts += `<button type="button" data-s7-attack-open="${esc(p.id)}" style="${MINI} background:#8e2424;" title="Spendi Incrementi per infliggere Ferite (1 per Incremento)">🗡️ Attacca</button>`;
        }
        const subLine = (sub || acts) ? `<div style="display:flex; align-items:center; gap:3px; flex-wrap:wrap; margin-top:2px; font-size:10px; font-weight:normal; color:${tr ? '#ef9a9a' : '#bbb'};">${sub ? `<span>${sub}</span>` : ''}${acts}</div>` : '';
        const nameCell = `<div style="flex:2.2; min-width:0; font-size:12px; font-weight:${isCurrent ? 'bold' : 'normal'};" title="${esc(KIND_LABEL[p.s7Kind] || '')}${helpless ? ' · INERME: 1 Punto Eroe per ogni Azione' : ''}"><div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${KIND_ICON[p.s7Kind] || ''} ${esc(p.name)}${hidden}${helpless ? ' 💀' : ''}</div>${subLine}</div>`;
        let raisesCell = '';
        let spendCell = '<div style="flex:1.3;"></div>';
        if (p.s7Kind === 'squad') {
            const st = squadStrength(p);
            raisesCell = `<div style="flex:2.4; text-align:center; font-size:11px; color:#d7ccc8;" title="Forza = PV del token: ogni Incremento speso contro la Squadra toglie 1 Forza">${st ? `Forza ${st}` : (st === 0 ? '🏳️ Sconfitta' : 'Forza —')}</div>`;
            spendCell = '';
        } else if (S) {
            const val = (p.s7Raises === null || p.s7Raises === undefined) ? '' : p.s7Raises;
            const startTxt = (S.phase !== PH_ROLLS && p.s7Start !== null && p.s7Start !== undefined) ? `<span style="color:#888; font-size:10px;">/${p.s7Start}</span>` : '';
            const mark = (S.phase === PH_ROLLS) ? (val === '' ? '<span title="Deve ancora tirare">⏳</span>' : '<span title="Ha tirato">✅</span>') : '';
            raisesCell = `<div style="flex:1.1; display:flex; align-items:center; justify-content:center; gap:2px;">${mark}<input type="text" inputmode="numeric" data-s7-raises="${esc(p.id)}" value="${esc(val)}" placeholder="—" title="Incrementi (modificabili a mano dal Master)" style="width:28px; text-align:center; background:transparent; color:#fff; border:none; border-bottom:1px solid #666; font-size:12px; font-weight:bold;">${startTxt}</div>`;
            if (S.phase !== PH_ROLLS && raisesOf(p) > 0) {
                spendCell = `<div style="flex:1.3; display:flex; gap:2px;">
                    <button type="button" data-s7-spend="1" data-s7-id="${esc(p.id)}" style="${SMALL}" title="Spendi 1 Incremento">−1</button>
                    <button type="button" data-s7-spend="2" data-s7-id="${esc(p.id)}" style="${SMALL}" title="Spendi 2 Incrementi">−2</button>
                    <button type="button" data-s7-spend="3" data-s7-id="${esc(p.id)}" style="${SMALL}" title="Spendi 3 Incrementi">−3</button>
                </div>`;
            }
        } else {
            raisesCell = '<div style="flex:1.1; text-align:center; color:#666; font-size:11px;">—</div>';
        }
        const removeCell = `<div style="width:18px; text-align:center;"><button type="button" data-s7-remove="${esc(p.id)}" style="background:transparent; color:#ff5252; border:none; cursor:pointer; font-weight:bold; font-size:12px; padding:0;">✕</button></div>`;
        div.innerHTML = nameCell + raisesCell + spendCell + removeCell;
        return div;
    }

    function isTiedWithCurrent(p) {
        const I = ini();
        const cur = I.participants[I.currentTurnIndex];
        if (!cur || cur === p) return false;
        return cur.s7Kind !== 'villain' && p.s7Kind !== 'villain' && p.s7Kind !== 'squad' && raisesOf(cur) === raisesOf(p) && raisesOf(p) > 0;
    }
    function attachListHandlers() {
        if (listHandlersAttached) return;
        const list = document.getElementById('tracker-list');
        if (!list) return;
        listHandlersAttached = true;
        // Delegati: agiscono solo sulle righe di questo modulo (attributi data-s7-*), mai sulle righe D&D
        list.addEventListener('click', (e) => {
            if (!isActive()) return;
            const sp = e.target.closest('[data-s7-spend]');
            if (sp) { spend(sp.getAttribute('data-s7-id'), parseInt(sp.getAttribute('data-s7-spend'), 10) || 1); return; }
            const pk = e.target.closest('[data-s7-pick]');
            if (pk) { pick(pk.getAttribute('data-s7-pick')); return; }
            const so = e.target.closest('[data-s7-squad-open]');
            if (so) { const id = so.getAttribute('data-s7-squad-open'); squadPanelFor = (squadPanelFor === id) ? null : id; attackPanelFor = null; pressPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const oo = e.target.closest('[data-s7-opp-open]');
            if (oo) { const id = oo.getAttribute('data-s7-opp-open'); oppPanelFor = (oppPanelFor === id) ? null : id; squadPanelFor = null; attackPanelFor = null; pressPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const oc = e.target.closest('[data-s7-opp-close]');
            if (oc) { oppPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const og = e.target.closest('[data-s7-opp-go]');
            if (og) { const hid = og.getAttribute('data-s7-opp-go'); const ti = list.querySelector(`[data-s7-opp-text="${CSS.escape(hid)}"]`); createOpportunity(hid, ti ? ti.value : ''); return; }
            const mo = e.target.closest('[data-s7-murder-open]');
            if (mo) { const id = mo.getAttribute('data-s7-murder-open'); murderPanelFor = (murderPanelFor === id) ? null : id; pressPanelFor = null; attackPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const mc = e.target.closest('[data-s7-murder-close]');
            if (mc) { murderPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const mg = e.target.closest('[data-s7-murder-go]');
            if (mg) { const vid = mg.getAttribute('data-s7-murder-go'); const sel = list.querySelector(`[data-s7-murder-target="${CSS.escape(vid)}"]`); murder(vid, sel ? sel.value : ''); return; }
            const sv = e.target.closest('[data-s7-save]');
            if (sv) { const mid = sv.getAttribute('data-s7-save'); const sel = list.querySelector(`[data-s7-save-hero="${CSS.escape(mid)}"]`); saveFromMurder(mid, sel ? sel.value : ''); return; }
            const ma = e.target.closest('[data-s7-murder-act]');
            if (ma) { murderAct(ma.getAttribute('data-s7-murder'), ma.getAttribute('data-s7-murder-act')); return; }
            const by = e.target.closest('[data-s7-buy]');
            if (by) { buyDie(by.getAttribute('data-s7-buy')); return; }
            const co = e.target.closest('[data-s7-cap-open]');
            if (co) { const id = co.getAttribute('data-s7-cap-open'); capPanelFor = (capPanelFor === id) ? null : id; renderTrackerList({ skipRenderAndSync: true }); return; }
            const cc = e.target.closest('[data-s7-cap-close]');
            if (cc) { capPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const cg = e.target.closest('[data-s7-cap-go]');
            if (cg) {
                const sid = cg.getAttribute('data-s7-cap-go');
                const q = (attr) => list.querySelector(`[${attr}="${CSS.escape(sid)}"]`);
                const ty = q('data-s7-cap-type'), he = q('data-s7-cap-hero'), pe = q('data-s7-cap-pend');
                useCapacity(sid, ty ? ty.value : '', he ? he.value : '', pe ? pe.value : '');
                return;
            }
            const po = e.target.closest('[data-s7-press-open]');
            if (po) { const id = po.getAttribute('data-s7-press-open'); pressPanelFor = (pressPanelFor === id) ? null : id; squadPanelFor = null; attackPanelFor = null; oppPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const pc = e.target.closest('[data-s7-press-close]');
            if (pc) { pressPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const pg = e.target.closest('[data-s7-press-go]');
            if (pg) {
                const aid = pg.getAttribute('data-s7-press-go');
                const sel = list.querySelector(`[data-s7-press-target="${CSS.escape(aid)}"]`), txt = list.querySelector(`[data-s7-press-text="${CSS.escape(aid)}"]`);
                applyPressure(aid, sel ? sel.value : '', txt ? txt.value : '');
                return;
            }
            const pb = e.target.closest('[data-s7-press-break]');
            if (pb) { breakPressure(pb.getAttribute('data-s7-press-break')); return; }
            const pv = e.target.closest('[data-s7-press-resolve]');
            if (pv) { resolvePressure(pv.getAttribute('data-s7-press-resolve')); return; }
            const im = e.target.closest('[data-s7-improvise]');
            if (im) { improvise(im.getAttribute('data-s7-improvise')); return; }
            const ao = e.target.closest('[data-s7-attack-open]');
            if (ao) { const id = ao.getAttribute('data-s7-attack-open'); attackPanelFor = (attackPanelFor === id) ? null : id; squadPanelFor = null; pressPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const ac = e.target.closest('[data-s7-attack-close]');
            if (ac) { attackPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const ag = e.target.closest('[data-s7-attack-go]');
            if (ag) {
                const aid = ag.getAttribute('data-s7-attack-go');
                const q = (attr) => list.querySelector(`[${attr}="${CSS.escape(aid)}"]`);
                const sel = q('data-s7-attack-target'), num = q('data-s7-attack-n'), fire = q('data-s7-attack-fire');
                attack(aid, sel ? sel.value : '', num ? num.value : 1, fire ? fire.checked : false);
                return;
            }
            const ev = e.target.closest('[data-s7-evade]');
            if (ev) { evade(ev.getAttribute('data-s7-evade')); return; }
            const sf = e.target.closest('[data-s7-suffer]');
            if (sf) { suffer(sf.getAttribute('data-s7-suffer')); return; }
            const sc = e.target.closest('[data-s7-squad-close]');
            if (sc) { squadPanelFor = null; renderTrackerList({ skipRenderAndSync: true }); return; }
            const sa = e.target.closest('[data-s7-squad-apply]');
            if (sa) {
                const sqId = sa.getAttribute('data-s7-squad-apply');
                const inp = list.querySelector(`[data-s7-squad-n="${CSS.escape(sqId)}"]`);
                spendOnSquad(sa.getAttribute('data-s7-actor'), sqId, inp ? inp.value : 1);
                return;
            }
            const rm = e.target.closest('[data-s7-remove]');
            if (rm) { removeById(rm.getAttribute('data-s7-remove')); }
        });
        list.addEventListener('change', (e) => {
            if (!isActive()) return;
            const inp = e.target.closest('[data-s7-raises]');
            if (inp) setRaises(inp.getAttribute('data-s7-raises'), inp.value);
            const ct = e.target.closest('[data-s7-cap-type]');
            if (ct) { capChoice[ct.getAttribute('data-s7-cap-type')] = ct.value; renderTrackerList({ skipRenderAndSync: true }); }
        });
    }

    function renderTrackerList(opts) {
        const I = ini();
        const list = document.getElementById('tracker-list');
        if (!I || !list) return;
        if (!Array.isArray(I.participants)) I.participants = [];
        hideCoreUi();
        const bar = ensureBar();
        attachListHandlers();
        prepareParticipants();
        const S = seq();
        if (S) {
            normalizePhase(S);
            evaluateItems(S);
            S.pressures = pressureList().filter(pr => findById(pr.targetId));   // bersaglio tolto dal tracker = Pressione finita
            S.murders = murderList().filter(m => findById(m.targetId));
            resolveMurders(S);
            sortForPhase(S);
            I.participants.forEach(p => { p.init = playerFacingValue(p, S); });
            I.s7Label = labelFor(S);
            I.s7Notes = (plus5() ? ['☠️ Il Master ha alzato la posta: servono 15 per ogni Incremento'] : []).concat(itemsNotesForPlayers(), pressureNotesForPlayers(), murdersNotesForPlayers());
            I.round = S.round || 1;
            if (isDrama(S)) { squadPanelFor = null; attackPanelFor = null; }
        } else {
            I.currentTurnIndex = -1;
            delete I.s7Label;
            delete I.s7Notes;
        }
        renderBar(bar, S);
        const countBadge = document.getElementById('tracker-count-badge');
        if (countBadge) {
            const suffix = (typeof window.t === 'function') ? window.t('entità') : 'entità';
            countBadge.textContent = `${I.participants.length} ${suffix}`;
        }
        list.innerHTML = '';
        if (!S || S.phase !== PH_ACTIONS) { squadPanelFor = null; attackPanelFor = null; oppPanelFor = null; pressPanelFor = null; murderPanelFor = null; }
        if (!S || isDrama(S) || S.phase === PH_ROLLS) capPanelFor = null;
        const pend = S ? pendingList() : [];
        I.participants.forEach((p, idx) => {
            list.appendChild(rowFor(p, idx, S));
            if (squadPanelFor && String(p.id) === String(squadPanelFor) && isActor(p) && raisesOf(p) > 0 && aliveSquads().length) list.appendChild(squadPanelRow(p));
            if (attackPanelFor && String(p.id) === String(attackPanelFor) && isActor(p) && raisesOf(p) > 0 && attackTargets(p).length) list.appendChild(attackPanelRow(p));
            if (oppPanelFor && String(p.id) === String(oppPanelFor) && isActor(p) && raisesOf(p) > 0) list.appendChild(oppPanelRow(p));
            if (pressPanelFor && String(p.id) === String(pressPanelFor) && canAct(S, p) && (pressureTargets(p).length || canPressAll(p))) list.appendChild(pressPanelRow(p));
            if (capPanelFor && String(p.id) === String(capPanelFor) && p.s7Kind === 'squad' && squadStrength(p) > 0) list.appendChild(capPanelRow(p, S));
            if (murderPanelFor && String(p.id) === String(murderPanelFor) && canAct(S, p) && p.s7Kind === 'villain' && murderTargets().length) list.appendChild(murderPanelRow(p));
            const muOn = S ? murderOn(p) : null;
            if (muOn) list.appendChild(murderRow(muOn, S));
            const prOn = S ? pressureOn(p) : null;
            if (prOn) list.appendChild(pressureRow(prOn, S));
            pend.filter(pd => String(pd.targetId) === String(p.id)).forEach(pd => list.appendChild(pendingRow(pd, S)));
        });
        // Avvisa la scheda 7th Sea aperta sul Master: una sola riserva di Incrementi (scheda <-> tracker)
        try { window.dispatchEvent(new CustomEvent('s7-sequence-updated')); } catch (e) {}
        if (opts && opts.skipRenderAndSync === true) return;
        if (typeof engine.renderAll === 'function') engine.renderAll();
        if (typeof syncState === 'function') syncState();
    }

    // ---------- comandi ----------
    function startSequence(mode) {
        const I = ini();
        if (!I) return;
        if (!Array.isArray(I.participants) || I.participants.length === 0) {
            if (typeof setupInitiative === 'function') setupInitiative();
        }
        if (!I.participants || I.participants.length === 0) {
            toast('Nessun partecipante: seleziona i token sulla mappa e premi 🔄 Ricarica.');
            return;
        }
        I.participants.forEach((p, i) => { p.s7Raises = null; delete p.s7Start; delete p.s7Pick; delete p.s7Unused; p._s7Order = i; });
        I.active = true;
        const drama = mode === 'drama';
        I.round = 1;
        I.currentTurnIndex = -1;
        I.s7 = { phase: PH_ROLLS, round: drama ? 0 : 1, campaignId: campId(), mode: drama ? 'drama' : 'action' };
        if (plus5()) I.s7Plus5.round = drama ? null : 1;
        stampExistingTimedEffects(0);
        processedRollIds.clear();
        terminateArmedUntil = 0;
        toast(drama ? "🎭 Sequenza Drammatica avviata: dichiarate l'Approccio e tirate il Rischio (una sola volta per tutta la Sequenza)."
                    : "⚔️ Sequenza d'Azione avviata: dichiarate l'Approccio e tirate il Rischio dalle schede.");
        renderTrackerList();
    }
    function beginActions() {
        const S = seq();
        if (!S || S.phase !== PH_ROLLS) return;
        ini().participants.forEach(p => {
            if (!isActor(p)) return;
            if (p.s7Raises === null || p.s7Raises === undefined) p.s7Raises = 0;
            p.s7Start = p.s7Raises;
        });
        S.phase = PH_ACTIONS;
        renderTrackerList();
    }
    // Cambio di Scena (p. 186): Drammatica <-> Azione = nuovo Approccio e nuovo tiro. Restano le Pressioni e le
    // Opportunità aperte senza Limite di Tempo; prima vanno risolte Ferite in arrivo e Conseguenze.
    function switchMode(target) {
        const I = ini(), S = seq();
        if (!S) return;
        const toDrama = target === 'drama';
        if (toDrama === isDrama(S)) return;
        if (pendingList().length) { toast('Ci sono Ferite in arrivo da risolvere (Evita / Subisci) prima di cambiare Sequenza.'); return; }
        if (itemsList().some(it => it.type !== 'opp' && (it.state === 'open' || it.state === 'triggered'))) { toast('Ci sono Conseguenze aperte: applicale (Applica Ferite) o toglile prima di cambiare Sequenza.'); return; }
        if (murderList().length) { toast("C'è un Omicidio in corso: risolvilo prima di cambiare Sequenza."); return; }
        S.items = itemsList().filter(it => it.type === 'opp' && it.state === 'open' && !hasLimit(it));
        S.protected = {};                                      // nuova Scena: finisce la protezione dall'Omicidio
        clearPlus5(true);                                      // nuova Scena = nuovo Rischio: il +5 non vale più
        if (toDrama) {
            S.mode = 'drama';                                  // il Round interrotto non fa scalare le durate
        } else {
            S.mode = 'action';
            S.round = (parseInt(S.round, 10) || 0) + 1;
            stampExistingTimedEffects(S.round - 1);            // gli effetti già in scena scalano alla fine di questo Round
        }
        I.round = S.round || 1;
        S.phase = PH_ROLLS;
        I.participants.forEach(p => { p.s7Raises = isDefeated(p) ? 0 : null; delete p.s7Start; delete p.s7Pick; delete p.s7Unused; });
        squadPanelFor = null; attackPanelFor = null; oppPanelFor = null; pressPanelFor = null;
        toast(toDrama ? "🎭 La Scena diventa una Sequenza Drammatica: nuovo Approccio e nuovo tiro (uno solo per tutta la Sequenza)."
                      : `⚔️ La Scena diventa una Sequenza d'Azione (Round ${S.round}): nuovo Approccio e nuovo tiro.`);
        renderTrackerList({ skipRenderAndSync: true });
        if (typeof engine.renderAll === 'function') engine.renderAll();
        if (typeof syncState === 'function') syncState(true);
    }
    function newRound() {
        const I = ini(), S = seq();
        if (!S || S.phase !== PH_END || isDrama(S)) return;
        if (pendingList().length) { toast('Ci sono Ferite in arrivo da risolvere (Evita / Subisci) prima del Nuovo Round.'); return; }
        if (itemsBlockingNewRound()) { toast('Ci sono Conseguenze da applicare (Applica Ferite) prima del Nuovo Round.'); return; }
        if (murderList().length) { toast("C'è un Omicidio da confermare (o annullare) prima del Nuovo Round."); return; }
        // restano solo le Opportunità aperte senza Limite di Tempo (valgono per la Scena)
        S.items = itemsList().filter(it => it.type === 'opp' && it.state === 'open' && !hasLimit(it));
        decrementTimedEffects(S.round);
        if (plus5()) { clearPlus5(true); toast('☠️ Il +5 al valore per Incremento è scaduto con il Round.'); }
        S.round += 1;
        I.round = S.round;
        S.phase = PH_ROLLS;
        I.participants.forEach(p => { p.s7Raises = isDefeated(p) ? 0 : null; delete p.s7Start; delete p.s7Pick; delete p.s7Unused; });
        toast(`🔄 Round ${S.round}: dichiarate l'Approccio e tirate il Rischio.`);
        renderTrackerList({ skipRenderAndSync: true });
        if (typeof engine.renderAll === 'function') engine.renderAll();
        if (typeof syncState === 'function') syncState(true);
    }
    function terminateSequence() {
        const now = Date.now();
        if (now > terminateArmedUntil) {
            // Doppio clic di conferma (niente finestre del browser): gli effetti a tempo verranno tolti
            terminateArmedUntil = now + 3500;
            renderBar(document.getElementById('s7-seq-bar'), seq());
            if (terminateTimer) clearTimeout(terminateTimer);
            terminateTimer = setTimeout(() => { terminateArmedUntil = 0; if (isActive() && document.getElementById('s7-seq-bar')) renderBar(document.getElementById('s7-seq-bar'), seq()); }, 3600);
            toast('Premi di nuovo ⏹ per terminare la Sequenza (gli effetti a tempo verranno tolti).');
            return;
        }
        terminateArmedUntil = 0;
        if (terminateTimer) { clearTimeout(terminateTimer); terminateTimer = null; }
        const I = ini();
        clearSeqState(I);
        clearStamps();
        // Stesso comportamento di Ferma/Reset del core: svuota il tracker e toglie gli effetti a tempo
        const resetBtn = document.getElementById('btn-tracker-reset');
        if (resetBtn) {
            I.active = true; // forza il percorso completo di Ferma/Reset
            resetBtn.click();
        } else {
            I.active = false;
            renderTrackerList();
        }
        toast("⏹ Sequenza d'Azione terminata: si torna al gioco normale.");
    }
    function setRaises(id, raw) {
        const S = seq();
        const p = findById(id);
        if (!S || !p || !isActor(p)) { renderTrackerList({ skipRenderAndSync: true }); return; }
        const txt = String(raw == null ? '' : raw).trim();
        const n = txt === '' ? null : Math.max(0, parseInt(txt, 10) || 0);
        if (S.phase === PH_ROLLS) {
            p.s7Raises = n;
            p.s7Start = n;
        } else {
            p.s7Raises = n === null ? 0 : n;
            if (p.s7Start === null || p.s7Start === undefined || p.s7Raises > p.s7Start) p.s7Start = p.s7Raises;
        }
        renderTrackerList();
    }
    function spend(id, n) {
        const S = seq();
        const p = findById(id);
        if (!S || S.phase === PH_ROLLS || !p || !isActor(p) || raisesOf(p) <= 0) return;
        if (!actionGate(p)) return;
        p.s7Raises = Math.max(0, raisesOf(p) - Math.max(1, n));
        if (p.s7Raises === 0) delete p.s7Pick;
        renderTrackerList();
    }
    function pick(id) {
        const p = findById(id);
        if (!p) return;
        p.s7Pick = Date.now();
        renderTrackerList();
    }
    function removeById(id) {
        const I = ini();
        const idx = I.participants.findIndex(p => String(p.id) === String(id));
        if (idx === -1) return;
        I.participants.splice(idx, 1);
        renderTrackerList();
    }

    // ---------- Rischi dalle schede / dal compendio ----------
    function matchParticipant(info) {
        const I = ini();
        const parts = I.participants || [];
        const tid = (info.tokenId !== undefined && info.tokenId !== null && info.tokenId !== '') ? String(info.tokenId).replace(/^tok_/, '') : null;
        if (tid) {
            const byTok = parts.find(p => p.tokenId !== undefined && p.tokenId !== null && String(p.tokenId).replace(/^tok_/, '') === tid);
            if (byTok) return byTok;
        }
        const nm = String(info.name || '').trim().toLowerCase();
        if (!nm) return null;
        const cands = parts.filter(p => {
            if (!isActor(p)) return false;
            const tok = tokOf(p);
            const names = [p.name, tok && tok.name, tok && tok.pcSheet && tok.pcSheet.name, tok && tok.statblock && tok.statblock.name]
                .filter(Boolean).map(x => String(x).trim().toLowerCase());
            return names.includes(nm);
        });
        if (cands.length === 1) return cands[0];
        if (cands.length > 1) {
            const sel = (typeof engine !== 'undefined' && engine) ? engine.selectedTokenId : null;
            const bySel = (sel !== null && sel !== undefined) ? cands.find(p => String(p.tokenId) === String(sel)) : null;
            if (bySel) return bySel;
            const free = cands.find(p => p.s7Raises === null || p.s7Raises === undefined);
            if (free) return free;
            toast(`Più partecipanti si chiamano "${info.name}": inserisci gli Incrementi a mano.`);
        }
        return null;
    }
    // info = { totalRaises, tokenId, name } (da js/systems/7thsea/rules.js), rollId = id univoco del tiro
    function onRiskRoll(info, rollId) {
        if (!info || !isActive()) return;
        if (typeof engine === 'undefined' || !engine || !engine.isDM) return;
        const S = seq();
        if (!S) return; // fuori da una Sequenza: il tiro resta solo in chat
        if (rollId) {
            if (processedRollIds.has(rollId)) return;
            processedRollIds.add(rollId);
            if (processedRollIds.size > 300) { processedRollIds.clear(); processedRollIds.add(rollId); }
        }
        prepareParticipants();
        const p = matchParticipant(info);
        if (!p) return; // non partecipa alla Sequenza: solo chat
        if (S.phase !== PH_ROLLS) {
            toast(isDrama(S) ? `Tiro di ${p.name} non conteggiato: nella Sequenza Drammatica si tira una sola volta (chi finisce gli Incrementi non ritira).`
                             : `Tiro di ${p.name} non conteggiato: siamo nella fase ${S.phase === PH_ACTIONS ? 'Azioni' : 'di Fine Round'}.`);
            return;
        }
        if (isDefeated(p)) { toast(`${p.name} è sconfitto: il tiro non viene contato.`); return; }
        const n = Math.max(0, parseInt(info.totalRaises, 10) || 0);
        p.s7Raises = n;
        p.s7Start = n;
        const tk = tokOf(p);
        p.s7Unused = (p.s7Kind === 'hero' && tk && tk.pcSheet && tk.pcSheet.traits) ? Math.max(0, parseInt(info.unused, 10) || 0) : 0;
        renderTrackerList();
    }

    // ---------- Incrementi spesi dalla scheda dell'Eroe (manovre di duello, "Spendi 1 Incremento") ----------
    // Una sola riserva per Round (Manuale Base p. 179): ciò che l'Eroe spende dalla scheda scala anche il tracker.
    // Il Master resta l'arbitro: accettato solo in Fase Azioni, per un partecipante, entro gli Incrementi rimasti.
    const processedSpendIds = new Set();
    function applySheetSpend(tokenId, amount, reason, spendId) {
        if (!isActive()) return false;
        if (typeof engine === 'undefined' || !engine || !engine.isDM) return false;
        const S = seq();
        if (!S || S.phase !== PH_ACTIONS) return false;
        if (spendId) {
            if (processedSpendIds.has(spendId)) return false;
            processedSpendIds.add(spendId);
            if (processedSpendIds.size > 300) { processedSpendIds.clear(); processedSpendIds.add(spendId); }
        }
        prepareParticipants();
        const tid = (tokenId !== undefined && tokenId !== null) ? String(tokenId).replace(/^tok_/, '') : null;
        if (!tid) return false;
        const p = (ini().participants || []).find(x => isActor(x) && x.tokenId !== undefined && x.tokenId !== null && String(x.tokenId).replace(/^tok_/, '') === tid);
        if (!p) return false;
        const before = raisesOf(p);
        if (before <= 0) { renderTrackerList(); return false; } // rimanda lo stato giusto alla scheda
        const n = Math.min(before, Math.max(1, parseInt(amount, 10) || 1));
        p.s7Raises = before - n;
        if (p.s7Raises === 0) delete p.s7Pick;
        pressureReminder(p);
        toast(`💠 ${p.name} spende ${n} ${n === 1 ? 'Incremento' : 'Incrementi'}${reason ? ` (${reason})` : ''}: ne restano ${p.s7Raises}.`);
        renderTrackerList();
        return true;
    }

    // ---------- durate a Round (una volta per Round, al Nuovo Round) ----------
    function hasTimer(o) { return !!o && o.durationRounds !== undefined && o.durationRounds !== null && Number(o.durationRounds) > 0; }
    function timedAura(tok) { return tok && tok.aura && tok.aura.active && hasTimer(tok.aura) ? tok.aura : null; }
    function stampExistingTimedEffects(round) {
        if (typeof engine === 'undefined' || !engine) return;
        (engine.shapes || []).forEach(s => { if (hasTimer(s)) s._s7SeenRound = round; });
        (engine.tokens || []).forEach(tok => {
            const a = timedAura(tok);
            if (a) a._s7SeenRound = round;
            if (Array.isArray(tok.conditions)) tok.conditions.forEach(c => { if (hasTimer(c)) c._s7SeenRound = round; });
            if (hasTimer(tok)) tok._s7SeenRound = round;
        });
    }
    function clearStamps() {
        if (typeof engine === 'undefined' || !engine) return;
        (engine.shapes || []).forEach(s => { delete s._s7SeenRound; });
        (engine.tokens || []).forEach(tok => {
            if (tok.aura) delete tok.aura._s7SeenRound;
            if (Array.isArray(tok.conditions)) tok.conditions.forEach(c => { delete c._s7SeenRound; });
            delete tok._s7SeenRound;
        });
    }
    // Ritorna true se l'oggetto va scalato in questo Round; gli effetti nati durante il Round saltano il primo scatto
    function tickTimed(o, R) {
        if (o._s7SeenRound === undefined || o.skipFirstDecrement) {
            o._s7SeenRound = R;
            o.skipFirstDecrement = false;
            o._lastDecrementedRound = R;
            return false;
        }
        if (o._lastDecrementedRound === R) return false;
        if (o.roundsLeft === undefined || o.roundsLeft === null) o.roundsLeft = Number(o.durationRounds);
        o.roundsLeft--;
        o._lastDecrementedRound = R;
        return true;
    }
    function decrementTimedEffects(R) {
        if (typeof engine === 'undefined' || !engine) return;
        const I = ini();
        // Zone d'effetto
        if (Array.isArray(engine.shapes) && engine.shapes.length) {
            engine.shapes = engine.shapes.filter(s => {
                if (!hasTimer(s)) return true;
                if (!tickTimed(s, R)) return true;
                if (s.roundsLeft > 0) return true;
                toast(`⏳ L'effetto AoE di ${s.casterName || 'Incantatore'} è svanito!`);
                if (engine.selectedShapeId === s.id) {
                    engine.selectedShapeId = null;
                    const sc = document.getElementById('selected-shape-controls');
                    if (sc) sc.style.display = 'none';
                }
                return false;
            });
        }
        if (!Array.isArray(engine.tokens)) return;
        let condChanged = false;
        engine.tokens.forEach(tok => {
            // Aure
            const a = timedAura(tok);
            if (a && tickTimed(a, R) && a.roundsLeft <= 0) {
                a.active = false;
                delete a.roundsLeft; delete a.durationRounds; delete a.skipFirstDecrement; delete a._lastDecrementedRound; delete a._s7SeenRound;
                toast(`⏳ L'aura di ${tok.name || 'Token'} si è dissolta!`);
            }
            // Condizioni
            if (Array.isArray(tok.conditions) && tok.conditions.some(hasTimer)) {
                tok.conditions = tok.conditions.filter(c => {
                    if (!hasTimer(c)) return true;
                    if (!tickTimed(c, R)) return true;
                    condChanged = true;
                    tok._condRingCacheKey = null;
                    if (c.roundsLeft > 0) return true;
                    toast(`⏳ La condizione "${c.text || 'Stato'}" su ${tok.name || 'Token'} è terminata!`);
                    return false;
                });
            }
        });
        if (condChanged && typeof window.renderConditionsList === 'function') window.renderConditionsList();
        // Token / evocazioni a tempo
        const expired = [];
        engine.tokens = engine.tokens.filter(tok => {
            if (!hasTimer(tok)) return true;
            if (!tickTimed(tok, R)) return true;
            if (tok.roundsLeft > 0) return true;
            expired.push(tok);
            return false;
        });
        expired.forEach(t => {
            toast(`⏳ "${t.name || 'Evocazione'}"${t.evokerName ? ` di ${t.evokerName}` : ''} è svanito (durata terminata)!`);
            if (engine.selectedTokens) engine.selectedTokens.delete(t.id);
            if (engine.selectedTokenId === t.id) {
                engine.selectedTokenId = null;
                if (typeof window.updateSelectedTokenControls === 'function') window.updateSelectedTokenControls(null);
            }
            if (I && Array.isArray(I.participants)) {
                const idx = I.participants.findIndex(p => p.tokenId !== undefined && p.tokenId !== null && String(p.tokenId) === String(t.id));
                if (idx !== -1) I.participants.splice(idx, 1);
            }
        });
    }

    // ---------- tiri dei giocatori in arrivo dalla rete (solo console del Master) ----------
    try {
        if (typeof network !== 'undefined' && network && typeof network.addListener === 'function') {
            network.addListener((data, peerId) => {
                if (data && data.type === 'DICE_ROLL' && data.payload && data.payload.s7Risk) {
                    onRiskRoll(data.payload.s7Risk, data.payload.id);
                } else if (data && data.type === 'S7_RAISES_SPEND' && data.payload) {
                    const pl = data.payload;
                    // Online: solo chi controlla quel token può spenderne gli Incrementi
                    const conn = (peerId && network.connections) ? network.connections[peerId] : null;
                    if (conn && conn.name && typeof isTokenOwnedBy === 'function' && typeof engine !== 'undefined' && engine) {
                        const tok = (engine.tokens || []).find(x => String(x.id).replace(/^tok_/, '') === String(pl.tokenId).replace(/^tok_/, ''));
                        if (!tok || !isTokenOwnedBy(tok, conn.name)) return;
                    }
                    applySheetSpend(pl.tokenId, pl.amount, pl.reason, pl.id);
                }
            });
        }
    } catch (e) { console.warn('[7thSea Iniziativa] listener rete:', e); }

    window.seventhSeaInitiative = {
        handlesTracker: isActive,
        spendDangerPoint,
        renderTrackerList,
        restoreCoreTrackerUi,
        onRiskRoll,
        applySheetSpend,
        // per i test
        _startSequence: startSequence,
        _switchMode: switchMode,
        _dangerSet: (v) => setDanger(v), _dangerGet: () => { ensureDangerLoaded(); return danger.value; },
        _buyDie: buyDie, _useCapacity: useCapacity,
        _plus5: activatePlus5, _clearPlus5: clearPlus5,
        _murder: murder, _saveFromMurder: saveFromMurder, _murderAct: murderAct,
        _beginActions: beginActions,
        _newRound: newRound,
        _terminate: terminateSequence,
        _spend: spend,
        _setRaises: setRaises,
        _pick: pick,
        _spendOnSquad: spendOnSquad,
        _attack: attack,
        _itemAdd: (o) => { Object.assign(itemForm, o || {}); itemAdd(); },
        _itemEach: itemEach, _itemShared: itemShared, _itemTake: itemTake, _itemApply: itemApply, _createOpportunity: createOpportunity,
        _evade: evade,
        _pressure: applyPressure, _breakPressure: breakPressure, _resolvePressure: resolvePressure, _improvise: improvise,
        _suffer: suffer,
        _squadAttack: squadAttack
    };
})();
