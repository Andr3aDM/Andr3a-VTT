// js/systems/ncs/rules.js
// Modulo "Non Cedere al Sonno" (sistema 'ncs') — calcolatore del tiro, puro e testabile (nessun DOM, nessuna rete).
// Regole riassunte con parole nostre; terminologia ufficiale del gioco. Nessun testo del manuale.
//
// Pool (colori):  discipline = Disciplina (bianchi) · exhaustion = Sfinimento (neri) ·
//                 madness = Follia (rossi: Follia Permanente + 0..6 scelti) · pain = Dolore (viola, del GM)
// - Ogni dado 1-3 e' un successo. Grado = numero di successi.
// - Vince chi ha il Grado piu' alto; a parita' vince il Protagonista.
// - Forza di un pool = il suo dado piu' alto. Il pool piu' forte (Dolore compreso) Domina.
//   Spareggio: si confrontano i dadi dal piu' alto al piu' basso (stesso valore = si va al successivo); se un pool
//   finisce i dadi vince quello con piu' dadi; parita' totale: Disciplina > Follia > Sfinimento > Dolore.
// - Punto di Forza del Protagonista = il suo pool piu' forte (Dolore escluso).
// - Gettare un'Ombra (GM): spende Disperazione per aggiungere o togliere un 6 in un pool che ha almeno un dado;
//   se cosi' il Dolore Domina, non si guadagna una nuova Moneta di Disperazione.
// - Migliorare i Successi (giocatori): spende Speranza per aggiungere un "1" alla Disciplina del Protagonista.
// - Talento di Sfinimento: uso minore = Grado almeno pari ai dadi di Sfinimento; uso maggiore = +Grado pari allo
//   Sfinimento (il +1 Sfinimento obbligatorio si applica prima di tirare, quindi e' gia' nei dadi neri).
// - Aiutanti: aggiungono solo i successi dei propri dadi di Disciplina, senza toccare la Forza.
(function () {
    'use strict';

    const POOLS = ['discipline', 'exhaustion', 'madness', 'pain'];
    const PLAYER_POOLS = ['discipline', 'exhaustion', 'madness'];
    // Parita' totale: Disciplina > Follia > Sfinimento > Dolore (indice piu' basso = vince)
    const TIE_ORDER = ['discipline', 'madness', 'exhaustion', 'pain'];
    const MAX_EXHAUSTION = 6;
    const MAX_CHOSEN_MADNESS = 6;

    const clampInt = (v, min, max) => {
        const n = Math.floor(Number(v));
        if (!isFinite(n)) return min;
        return Math.max(min, Math.min(max, n));
    };
    const cleanDice = (arr) => (Array.isArray(arr) ? arr : []).map(d => clampInt(d, 1, 6));
    const isSuccess = (v) => v >= 1 && v <= 3;
    const countSuccesses = (arr) => cleanDice(arr).filter(isSuccess).length;
    const strength = (arr) => { const d = cleanDice(arr); return d.length ? Math.max(...d) : 0; };

    // Confronto di forza tra due pool: > 0 se a e' piu' forte, < 0 se b, 0 se identici (stessi dadi)
    function compareDice(a, b) {
        const x = cleanDice(a).sort((p, q) => q - p);
        const y = cleanDice(b).sort((p, q) => q - p);
        const n = Math.min(x.length, y.length);
        for (let i = 0; i < n; i++) {
            if (x[i] !== y[i]) return x[i] - y[i];
        }
        return x.length - y.length; // chi ha ancora dadi vince
    }

    // Confronto completo tra due pool per nome (con l'ordine di parita' totale)
    function comparePools(nameA, diceA, nameB, diceB) {
        const c = compareDice(diceA, diceB);
        if (c !== 0) return c;
        return TIE_ORDER.indexOf(nameB) - TIE_ORDER.indexOf(nameA);
    }

    // Il pool piu' forte tra quelli indicati (solo pool con almeno un dado); null se nessuno ha dadi
    function strongestPool(pools, names) {
        let best = null;
        for (const name of names) {
            const dice = cleanDice(pools[name]);
            if (!dice.length) continue;
            if (!best || comparePools(name, dice, best, cleanDice(pools[best])) > 0) best = name;
        }
        return best;
    }

    // Effetto della Dominanza (chiavi, i testi sono nella scheda con le traduzioni)
    const DOMINANCE_EFFECT = {
        discipline: 'reduceExhaustionOrFreeReaction', // a scelta del giocatore, facoltativo
        exhaustion: 'gainExhaustion',                 // +1 Sfinimento
        madness: 'fillReaction',                      // il giocatore riempie una Reazione libera (Lotta o Fuggi)
        pain: 'gainDespair'                           // +1 Moneta nella Coppa della Disperazione
    };

    // Conseguenze che il GM puo' scegliere se il Protagonista fallisce (mai lo stesso effetto della Dominanza)
    function failureOptions(dominant) {
        const all = ['gainExhaustion', 'fillReaction'];
        const already = DOMINANCE_EFFECT[dominant];
        return all.filter(o => o !== already);
    }

    /**
     * Risolve un tiro gia' fatto.
     * @param {object} input
     *   discipline, exhaustion, madness, pain: array di dadi (1-6)
     *   helpers: array di array (dadi di Disciplina degli aiutanti)
     *   talent: 'none' | 'minor' | 'major' (Talento di Sfinimento)
     *   shadowsSpent: numero di Monete di Disperazione spese per Gettare un'Ombra su questo tiro
     *   hopeSpent: numero di Monete di Speranza spese per Migliorare i Successi (gia' aggiunti come "1" nella Disciplina)
     */
    function resolve(input = {}) {
        const pools = {};
        POOLS.forEach(p => { pools[p] = cleanDice(input[p]); });
        const helpers = (Array.isArray(input.helpers) ? input.helpers : []).map(cleanDice);
        const helperSuccesses = helpers.reduce((s, h) => s + countSuccesses(h), 0);

        const successes = {};
        POOLS.forEach(p => { successes[p] = countSuccesses(pools[p]); });
        const diceSuccesses = successes.discipline + successes.exhaustion + successes.madness;
        let playerGrade = diceSuccesses + helperSuccesses;
        const exhaustionDice = pools.exhaustion.length;
        const talent = (input.talent === 'minor' || input.talent === 'major') ? input.talent : 'none';
        let talentBonus = 0;
        if (talent === 'minor' && playerGrade < exhaustionDice) { talentBonus = exhaustionDice - playerGrade; playerGrade = exhaustionDice; }
        if (talent === 'major') { talentBonus = exhaustionDice; playerGrade += exhaustionDice; }
        const gmGrade = successes.pain;
        const winner = (playerGrade >= gmGrade) ? 'player' : 'gm';

        const strengths = {};
        POOLS.forEach(p => { strengths[p] = strength(pools[p]); });
        const dominant = strongestPool(pools, POOLS);
        const strengthPoint = strongestPool(pools, PLAYER_POOLS);
        const shadowsSpent = clampInt(input.shadowsSpent || 0, 0, 999);
        const effect = dominant ? DOMINANCE_EFFECT[dominant] : null;
        // Il GM non guadagna Disperazione se il Dolore Domina grazie a un'Ombra (o comunque dopo averne gettate)
        const despairGain = (dominant === 'pain' && shadowsSpent === 0) ? 1 : 0;

        return {
            pools, helpers, successes, helperSuccesses,
            playerGrade, gmGrade, winner,
            talent, talentBonus,
            strengths, dominant, strengthPoint,
            effect, despairGain,
            failureOptions: winner === 'gm' ? failureOptions(dominant) : [],
            shadowsSpent, hopeSpent: clampInt(input.hopeSpent || 0, 0, 999)
        };
    }

    // --- Modifiche al tiro con le Monete (restituiscono pool nuovi, non toccano quelli passati) ---
    function copyPools(pools) {
        const out = {};
        POOLS.forEach(p => { out[p] = cleanDice(pools && pools[p]); });
        return out;
    }

    // Gettare un'Ombra: aggiunge o toglie un 6 in un pool con almeno un dado. { ok, pools, reason }
    function castShadow(pools, poolName, action) {
        const out = copyPools(pools);
        if (!POOLS.includes(poolName)) return { ok: false, pools: out, reason: 'unknownPool' };
        if (!out[poolName].length) return { ok: false, pools: out, reason: 'emptyPool' };
        if (action === 'add') { out[poolName].push(6); return { ok: true, pools: out }; }
        if (action === 'remove') {
            const i = out[poolName].indexOf(6);
            if (i < 0) return { ok: false, pools: out, reason: 'noSix' };
            out[poolName].splice(i, 1);
            return { ok: true, pools: out };
        }
        return { ok: false, pools: out, reason: 'unknownAction' };
    }

    // Migliorare i Successi: aggiunge un "1" alla Disciplina del Protagonista principale
    function addHopeSuccess(pools) {
        const out = copyPools(pools);
        out.discipline.push(1);
        return { ok: true, pools: out };
    }

    // --- Quanti dadi si tirano, dai valori della scheda ---
    // sheet: { discipline, exhaustion, permanentMadness }  opts: { chosenMadness 0-6, voluntaryExhaustion bool, pain }
    function dicePools(sheet = {}, opts = {}) {
        const discipline = clampInt(sheet.discipline, 0, 99);
        let exhaustion = clampInt(sheet.exhaustion, 0, MAX_EXHAUSTION);
        const voluntary = !!opts.voluntaryExhaustion && exhaustion < MAX_EXHAUSTION;
        if (voluntary) exhaustion += 1;
        const madness = clampInt(sheet.permanentMadness, 0, 99) + clampInt(opts.chosenMadness, 0, MAX_CHOSEN_MADNESS);
        const pain = clampInt(opts.pain, 0, 99);
        return { discipline, exhaustion, madness, pain, voluntaryExhaustion: voluntary, newExhaustion: exhaustion };
    }

    // Tira i dadi: counts = { discipline, exhaustion, madness, pain }; rng opzionale (per i test)
    function rollDice(counts = {}, rng = Math.random) {
        const out = {};
        POOLS.forEach(p => {
            const n = clampInt(counts[p], 0, 99);
            out[p] = [];
            for (let i = 0; i < n; i++) out[p].push(1 + Math.floor(rng() * 6));
        });
        return out;
    }

    const api = {
        POOLS, PLAYER_POOLS, TIE_ORDER, MAX_EXHAUSTION, MAX_CHOSEN_MADNESS, DOMINANCE_EFFECT,
        isSuccess, countSuccesses, strength, compareDice, comparePools, strongestPool, failureOptions,
        resolve, castShadow, addHopeSuccess, dicePools, rollDice
    };
    if (typeof window !== 'undefined') window.ncsRules = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
