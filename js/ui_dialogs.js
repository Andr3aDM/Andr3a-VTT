// js/ui_dialogs.js - Dialoghi in-page NON bloccanti (sostituiscono alert / confirm / prompt nativi)
//
// Perche': alert/confirm/prompt nativi congelano il thread JavaScript (heartbeat P2P, timer
// iniziativa, rendering) e bloccano i test headless e i tablet. Qui tutto e' DOM in-page.
//
// API globale (window.vttDialogs, con alias comodi):
//   vttNotify(msg, level)            -> toast (level 'error' = toast rosso). Usa window.showToast.
//   vttWarn(msg)                     -> come vttNotify(msg,'error'): avviso rosso al posto di alert()
//   vttConfirm(msg, opts)            -> Promise<boolean>   opts: { title, okLabel, cancelLabel, danger }
//   vttPrompt(msg, defaultValue, o)  -> Promise<string|null>  (null = annullato)
//
// I testi passano da window.t() (IT/EN). Il messaggio e' inserito con textContent: sicuro anche
// con nomi di token/campagne digitati dall'utente.
(function () {
    'use strict';

    function tr(s) {
        try { return (typeof window.t === 'function') ? window.t(s) : s; } catch (e) { return s; }
    }

    // ---- Notifica (toast) ----------------------------------------------------------------
    function notify(msg, level) {
        const text = (level === 'error' ? '🔴 ' : '') + tr(String(msg == null ? '' : msg));
        // Durata proporzionale alla lunghezza (min 3,2 s, max 9 s) per i messaggi lunghi.
        const ms = Math.min(9000, Math.max(3200, text.length * 60));
        if (typeof window.showToast === 'function') window.showToast(text, ms);
        else console.warn('[VTT]', text);
    }
    function warn(msg) { notify(msg, 'error'); }

    // ---- Modale in-page (una alla volta, le altre in coda) ---------------------------------
    const queue = [];
    let active = null;

    function el(tag, css, text) {
        const e = document.createElement(tag);
        if (css) e.style.cssText = css;
        if (text != null) e.textContent = text;
        return e;
    }

    function show(spec) {
        return new Promise((resolve) => {
            queue.push({ spec, resolve });
            if (!active) next();
        });
    }

    function next() {
        const job = queue.shift();
        if (!job) { active = null; return; }
        active = job;
        const { spec, resolve } = job;
        const isPrompt = spec.kind === 'prompt';
        const prevFocus = document.activeElement;

        const overlay = el('div',
            'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:100000;display:flex;' +
            'align-items:center;justify-content:center;padding:16px;');
        overlay.id = 'vtt-dialog-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        const box = el('div',
            'background:#1e1e1e;color:#eee;border:1px solid #555;border-radius:8px;max-width:420px;' +
            'width:100%;padding:16px;box-shadow:0 8px 28px rgba(0,0,0,0.7);font-family:inherit;');
        if (spec.title) {
            const h = el('div', 'font-weight:bold;font-size:14px;margin-bottom:8px;color:#ffcc00;', tr(spec.title));
            h.id = 'vtt-dialog-title';
            box.appendChild(h);
        }
        const msg = el('div', 'font-size:13px;line-height:1.45;white-space:pre-line;word-break:break-word;margin-bottom:12px;', tr(spec.message));
        msg.id = 'vtt-dialog-message';
        box.appendChild(msg);

        let input = null;
        if (isPrompt) {
            input = el('input',
                'width:100%;box-sizing:border-box;background:#111;color:#fff;border:1px solid #666;' +
                'border-radius:4px;padding:7px 8px;font-size:13px;margin-bottom:12px;');
            input.type = 'text';
            input.id = 'vtt-dialog-input';
            input.value = spec.defaultValue == null ? '' : String(spec.defaultValue);
            box.appendChild(input);
        }

        const row = el('div', 'display:flex;gap:8px;justify-content:flex-end;');
        const cancel = el('button',
            'background:#333;color:#ddd;border:1px solid #666;padding:7px 14px;font-size:12px;border-radius:4px;cursor:pointer;',
            tr(spec.cancelLabel || 'Annulla'));
        cancel.type = 'button';
        cancel.id = 'vtt-dialog-cancel';
        const okBg = spec.danger ? '#b71c1c' : '#2e7d32';
        const ok = el('button',
            'background:' + okBg + ';color:#fff;border:1px solid rgba(255,255,255,0.35);padding:7px 14px;' +
            'font-size:12px;font-weight:bold;border-radius:4px;cursor:pointer;',
            tr(spec.okLabel || (spec.danger ? 'Elimina' : 'Conferma')));
        ok.type = 'button';
        ok.id = 'vtt-dialog-ok';
        row.appendChild(cancel);
        row.appendChild(ok);
        box.appendChild(row);
        overlay.appendChild(box);

        let done = false;
        function close(result) {
            if (done) return;
            done = true;
            document.removeEventListener('keydown', onKey, true);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch (e) { /* ignora */ }
            active = null;
            resolve(result);
            next();
        }
        const accept = () => close(isPrompt ? input.value : true);
        const reject = () => close(isPrompt ? null : false);

        function onKey(ev) {
            if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); reject(); }
            else if (ev.key === 'Enter') {
                // Invio conferma; sul pulsante Annulla attivo non deve confermare.
                if (document.activeElement === cancel) return;
                ev.preventDefault(); ev.stopPropagation(); accept();
            }
        }
        document.addEventListener('keydown', onKey, true);
        ok.addEventListener('click', accept);
        cancel.addEventListener('click', reject);
        overlay.addEventListener('mousedown', (ev) => { if (ev.target === overlay) reject(); });

        document.body.appendChild(overlay);
        // Per le eliminazioni il focus parte su Annulla (azione sicura), altrimenti su OK / campo testo.
        const focusEl = input || (spec.danger ? cancel : ok);
        try { focusEl.focus(); if (input) input.select(); } catch (e) { /* ignora */ }
    }

    function vttConfirm(message, opts) {
        opts = opts || {};
        return show({ kind: 'confirm', message, title: opts.title, okLabel: opts.okLabel,
            cancelLabel: opts.cancelLabel, danger: !!opts.danger });
    }

    function vttPrompt(message, defaultValue, opts) {
        opts = opts || {};
        return show({ kind: 'prompt', message, defaultValue, title: opts.title,
            okLabel: opts.okLabel || 'OK', cancelLabel: opts.cancelLabel });
    }

    window.vttDialogs = { notify, warn, confirm: vttConfirm, prompt: vttPrompt };
    window.vttNotify = notify;
    window.vttWarn = warn;
    window.vttConfirm = vttConfirm;
    window.vttPrompt = vttPrompt;
})();
