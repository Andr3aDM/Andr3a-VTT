// js/diagnostica.js - Registro diagnostico del Giocatore (nucleo, nessun sistema di gioco)
// Spento per impostazione: nessun ascoltatore, nessun timer, nessuna memoria usata.
// Lo accende il Master (DIAG_SET) per capire problemi reali in sessione (es. tablet che perde il controllo del PG).
// Acceso: tiene solo gli ultimi 10 minuti (max 3000 eventi), ne salva una copia sul dispositivo ogni 30 s
// e quando la pagina va in secondo piano, così sopravvive a un ricaricamento (F5).
// Non registra immagini, contenuti delle schede né movimenti continui del dito (solo inizio/fine dei gesti).
(function () {
    'use strict';
    if (window.vttDiag) return;

    const KEEP_MS = 10 * 60 * 1000;
    const MAX_EVENTS = 3000;
    const SAVE_EVERY_MS = 30000;
    const LS_ON = 'vtt_diag_on';
    const LS_LOG = 'vtt_diag_log';
    // Messaggi frequenti: solo conteggio, non una riga per messaggio
    const FREQUENT = new Set(['__PING__', '__PONG__', 'VIEW_SYNC', 'LASER_SYNC', 'GRID_MOVE_LIVE', 'LIVE_DRAW_POINT',
        'HANDOUT_RECT_LIVE', 'PLAYER_MOVE_TOKEN', 'PLAYER_MOVE_SHAPE', 'REMOTE_TOKEN_MOVE', 'REMOTE_TOKENS_MOVE_BATCH',
        'REMOTE_SHAPE_MOVE', 'PING']);

    let events = [];
    let counts = {};
    let installed = false;   // ascoltatori montati (solo dopo la prima accensione)
    let saveTimer = null;
    let pushesSinceTrim = 0;
    const undo = [];         // funzioni per smontare tutto allo spegnimento

    function now() { return Date.now(); }
    function trim() {
        const limit = now() - KEEP_MS;
        let i = 0;
        while (i < events.length && events[i][0] < limit) i++;
        if (i > 0) events.splice(0, i);
        if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
        pushesSinceTrim = 0;
    }
    function short(v, n) {
        try {
            const s = typeof v === 'string' ? v : JSON.stringify(v);
            return s && s.length > n ? s.slice(0, n) + '…' : s;
        } catch (e) { return String(v); }
    }

    const diag = {
        on: false,

        // cat: 'rete' | 'pagina' | 'errore' | 'ricevuto' | 'inviato' | 'tocco' | 'gesto' | 'scheda' | 'stato' | ...
        log(cat, msg, data) {
            if (!diag.on) return;
            const ev = [now(), cat, String(msg)];
            if (data !== undefined) ev.push(data);
            events.push(ev);
            if (events.length > MAX_EVENTS || ++pushesSinceTrim > 200) trim();
        },

        count(key) {
            if (!diag.on) return;
            counts[key] = (counts[key] || 0) + 1;
        },

        // Fornitori facoltativi della pagina (player.js): fotografia dello stato e riassunto dei messaggi
        snapshotProvider: null,
        summarizeIncoming: null,

        enable(on) {
            on = !!on;
            try { localStorage.setItem(LS_ON, on ? '1' : '0'); } catch (e) {}
            if (on === diag.on) return;
            if (on) {
                diag.on = true;
                restoreSaved();
                install();
                diag.log('diagnosi', 'registro acceso');
            } else {
                diag.log('diagnosi', 'registro spento');
                diag.on = false;
                uninstall();
                events = [];
                counts = {};
                try { localStorage.removeItem(LS_LOG); } catch (e) {}
            }
        },

        save() {
            if (!diag.on) return;
            trim();
            try { localStorage.setItem(LS_LOG, JSON.stringify({ savedAt: now(), events, counts })); } catch (e) {}
        },

        report(extra) {
            trim();
            let snapshot = null;
            try { snapshot = typeof diag.snapshotProvider === 'function' ? diag.snapshotProvider() : null; } catch (e) { snapshot = { errore: String(e && e.message) }; }
            return {
                formato: 'vtt-diagnosi-1',
                creato: new Date().toISOString(),
                pagina: location.pathname.split('/').pop() + location.search.replace(/room=[^&]*/i, 'room=…'),
                browser: navigator.userAgent,
                schermo: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1, touch: (navigator.maxTouchPoints || 0) },
                conteggi: counts,
                fotografia: snapshot,
                extra: extra || null,
                eventi: events.map(e => {
                    const o = { t: new Date(e[0]).toISOString().slice(11, 23), c: e[1], m: e[2] };
                    if (e.length > 3) o.d = e[3];
                    return o;
                })
            };
        },

        // Uso interno dei test
        _events() { return events; },
        _installed() { return installed; }
    };

    function restoreSaved() {
        try {
            const raw = localStorage.getItem(LS_LOG);
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (saved && Array.isArray(saved.events) && now() - (saved.savedAt || 0) < KEEP_MS) {
                events = saved.events.concat(events);
                counts = Object.assign({}, saved.counts || {}, counts);
                events.push([now(), 'pagina', '— pagina ricaricata (eventi precedenti recuperati) —']);
                trim();
            }
        } catch (e) {}
    }

    function addListener(target, type, fn, opts) {
        target.addEventListener(type, fn, opts);
        undo.push(() => target.removeEventListener(type, fn, opts));
    }

    function install() {
        // Ascoltatori del browser: montati a ogni accensione, smontati allo spegnimento
        addListener(window, 'error', (ev) => diag.log('errore', (ev.message || 'errore') + ' @' + String(ev.filename || '').split('/').pop() + ':' + ev.lineno));
        addListener(window, 'unhandledrejection', (ev) => diag.log('errore', 'promessa rifiutata: ' + short(ev.reason && (ev.reason.message || ev.reason), 200)));
        addListener(document, 'visibilitychange', () => { diag.log('pagina', 'visibilità: ' + document.visibilityState); if (document.visibilityState === 'hidden') diag.save(); });
        addListener(window, 'pagehide', () => { diag.log('pagina', 'pagina chiusa o ricaricata'); diag.save(); });
        addListener(window, 'online', () => diag.log('rete', 'browser: rete disponibile'));
        addListener(window, 'offline', () => diag.log('rete', 'browser: rete assente'));
        addListener(window, 'focus', () => diag.log('pagina', 'finestra attiva'));
        addListener(window, 'blur', () => diag.log('pagina', 'finestra non attiva'));
        addListener(window, 'touchcancel', (ev) => diag.log('gesto', 'tocco interrotto dal sistema', { dita: ev.touches ? ev.touches.length : 0 }), true);
        addListener(window, 'resize', () => diag.log('pagina', 'dimensioni ' + window.innerWidth + 'x' + window.innerHeight));

        const oErr = console.error;
        console.error = function (...a) {
            try { diag.log('errore', 'console: ' + short(a.map(x => (x && x.message) ? x.message : (typeof x === 'string' ? x : short(x, 120))).join(' '), 300)); } catch (e) {}
            return oErr.apply(console, a);
        };
        undo.push(() => { console.error = oErr; });

        const net = window.network;
        if (net && typeof net.send === 'function') {
            const oSend = net.send;
            net.send = function (data, target) {
                try {
                    const ty = data && data.type;
                    if (ty) {
                        if (FREQUENT.has(ty)) diag.count('inviato ' + ty);
                        else diag.log('inviato', ty, data.payload && data.payload.id ? { id: data.payload.id } : undefined);
                    }
                } catch (e) {}
                return oSend.apply(this, arguments);
            };
            undo.push(() => { if (net.send !== oSend) net.send = oSend; });
        }

        const sm = window.pcSheetManager;
        if (sm && typeof sm.open === 'function') {
            const oOpen = sm.open, oClose = sm.close;
            sm.open = function (tok) { diag.log('scheda', 'apri', { token: tok && tok.name }); return oOpen.apply(this, arguments); };
            if (typeof oClose === 'function') sm.close = function () { diag.log('scheda', 'chiudi'); return oClose.apply(this, arguments); };
            undo.push(() => { sm.open = oOpen; if (typeof oClose === 'function') sm.close = oClose; });
        }

        saveTimer = setInterval(() => diag.save(), SAVE_EVERY_MS);
        undo.push(() => { clearInterval(saveTimer); saveTimer = null; });

        // Ascoltatori di rete senza funzione di rimozione: montati una sola volta, inattivi a registro spento
        if (!installed && net) {
            if (typeof net.onReconnectState === 'function') {
                net.onReconnectState((s) => diag.log('rete', 'rientro: ' + s.state, { tentativo: s.attempt, max: s.max, motivo: s.reason || s.cause }));
            }
            if (typeof net.addListener === 'function') {
                net.addListener((data) => {
                    if (!diag.on || !data) return;
                    const ty = data.__chunked ? 'pezzo di messaggio grande' : data.type;
                    if (!ty) return;
                    if (FREQUENT.has(ty) || data.__chunked) { diag.count('ricevuto ' + ty); return; }
                    let sum;
                    try { sum = typeof diag.summarizeIncoming === 'function' ? diag.summarizeIncoming(data) : undefined; } catch (e) { sum = { errore: String(e && e.message) }; }
                    diag.log('ricevuto', ty, sum);
                });
            }
        }
        installed = true;
    }

    function uninstall() {
        while (undo.length) { try { undo.pop()(); } catch (e) {} }
    }

    window.vttDiag = diag;

    // Era acceso prima di un ricaricamento: riaccendilo subito per non perdere l'inizio della pagina
    try {
        if (localStorage.getItem(LS_ON) === '1') {
            const start = () => diag.enable(true);
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
            else setTimeout(start, 0);
        }
    } catch (e) {}
})();
