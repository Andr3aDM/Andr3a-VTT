// js/systems/7thsea/rules.js
// Motore Regole Ufficiali 7th Sea (2ª Edizione - Need Games / John Wick):
// - Pool d10 (Tratto + Abilità + Dadi Bonus)
// - Grado 3: Ritiro (Re-roll) di un singolo dado
// - Grado 4: Insiemi da 15 valgono 2 Incrementi (continua a valere 10 = 1 Incremento)
// - Grado 5 / 3ª Ferita Drammatica: I 10 Esplodono a catena (+1d10)
// - Privilegi cumulativi al 100%
// - Spirale della Morte (20 Ferite / 4 Ferite Drammatiche)

(function () {
    // Risolutore Combinatorio Ottimale per gli Incrementi di 7th Sea:
    // Trova la ripartizione dei dadi che massimizza il totale degli Incrementi (totalRaises).
    // Massimizza prima gli Incrementi totali e, a parità di Incrementi, massimizza i dadi non consumati.
    // Supporta coppie e terne da 15 (2 Incr.) e qualsiasi combinazione >= 10 (1 Incr.).
    function calculateRaisesFromDice(rawDice, setsOf15 = false) {
        const dice = [...rawDice].sort((a, b) => b - a);
        const memo = new Map();

        function solve(pool) {
            const key = pool.join(',');
            if (memo.has(key)) return memo.get(key);

            const sumPool = pool.reduce((acc, v) => acc + v, 0);
            if (sumPool < 10) {
                const res = { sets: [], remaining: [...pool], totalRaises: 0 };
                memo.set(key, res);
                return res;
            }

            let best = { sets: [], remaining: [...pool], totalRaises: 0 };

            const first = pool[0];
            const rest = pool.slice(1);

            // 1. Singolo 10 (o superiore se bonus) -> 1 Incremento garantito con 1 solo dado
            if (first >= 10) {
                const sub = solve(rest);
                const total = sub.totalRaises + 1;
                if (total > best.totalRaises ||
                   (total === best.totalRaises && sub.remaining.length > best.remaining.length)) {
                    best = {
                        sets: [{ dice: [first], sum: first, raises: 1, isFifteen: false }, ...sub.sets],
                        remaining: sub.remaining,
                        totalRaises: total
                    };
                }
                // Se setsOf15 è false, usare un 10 da solo per 1 Incremento è matematicamente massimale
                if (!setsOf15) {
                    memo.set(key, best);
                    return best;
                }
            }

            // 2. Grado 4: Insiemi da 15 (valgono 2 Incrementi ciascuno)
            if (setsOf15) {
                // Coppie con somma >= 15 (cercando dai dadi più bassi per risparmiare dadi alti)
                for (let i = rest.length - 1; i >= 0; i--) {
                    const s2 = first + rest[i];
                    if (s2 >= 15) {
                        const nextPool = rest.filter((_, idx) => idx !== i);
                        const sub = solve(nextPool);
                        const total = sub.totalRaises + 2;
                        if (total > best.totalRaises ||
                           (total === best.totalRaises && sub.remaining.length > best.remaining.length)) {
                            best = {
                                sets: [{ dice: [first, rest[i]], sum: s2, raises: 2, isFifteen: true }, ...sub.sets],
                                remaining: sub.remaining,
                                totalRaises: total
                            };
                        }
                    }
                }

                // Terne con somma >= 15 (solo se first < 10 per non sprecare un 10 con 2 altri dadi)
                if (first < 10) {
                    for (let i = rest.length - 1; i >= 0; i--) {
                        for (let j = i - 1; j >= 0; j--) {
                            const s3 = first + rest[i] + rest[j];
                            if (s3 >= 15) {
                                const nextPool = rest.filter((_, idx) => idx !== i && idx !== j);
                                const sub = solve(nextPool);
                                const total = sub.totalRaises + 2;
                                if (total > best.totalRaises ||
                                   (total === best.totalRaises && sub.remaining.length > best.remaining.length)) {
                                    best = {
                                        sets: [{ dice: [first, rest[i], rest[j]], sum: s3, raises: 2, isFifteen: true }, ...sub.sets],
                                        remaining: sub.remaining,
                                        totalRaises: total
                                    };
                                }
                            }
                        }
                    }
                }
            }

            // 3. Coppie con somma >= 10 (1 Incremento - QUALSIASI somma >= 10 è valida, es. 9+8=17, 9+6=15)
            for (let i = rest.length - 1; i >= 0; i--) {
                const s2 = first + rest[i];
                if (s2 >= 10) {
                    const nextPool = rest.filter((_, idx) => idx !== i);
                    const sub = solve(nextPool);
                    const total = sub.totalRaises + 1;
                    if (total > best.totalRaises ||
                       (total === best.totalRaises && sub.remaining.length > best.remaining.length)) {
                        best = {
                            sets: [{ dice: [first, rest[i]], sum: s2, raises: 1, isFifteen: false }, ...sub.sets],
                            remaining: sub.remaining,
                            totalRaises: total
                        };
                    }
                }
            }

            // 4. Terne con somma >= 10 (1 Incremento - QUALSIASI terna >= 10)
            for (let i = rest.length - 1; i >= 0; i--) {
                for (let j = i - 1; j >= 0; j--) {
                    const s3 = first + rest[i] + rest[j];
                    if (s3 >= 10) {
                        const nextPool = rest.filter((_, idx) => idx !== i && idx !== j);
                        const sub = solve(nextPool);
                        const total = sub.totalRaises + 1;
                        if (total > best.totalRaises ||
                           (total === best.totalRaises && sub.remaining.length > best.remaining.length)) {
                            best = {
                                sets: [{ dice: [first, rest[i], rest[j]], sum: s3, raises: 1, isFifteen: false }, ...sub.sets],
                                remaining: sub.remaining,
                                totalRaises: total
                            };
                        }
                    }
                }
            }

            // 5. Opzione di saltare 'first' (se non conviene abbinarlo in questo gruppo)
            const subSkip = solve(rest);
            if (subSkip.totalRaises > best.totalRaises ||
               (subSkip.totalRaises === best.totalRaises && (subSkip.remaining.length + 1) > best.remaining.length)) {
                best = {
                    sets: subSkip.sets,
                    remaining: [first, ...subSkip.remaining],
                    totalRaises: subSkip.totalRaises
                };
            }

            memo.set(key, best);
            return best;
        }

        const sol = solve(dice);

        // Eventuali gruppi residui di 4+ dadi bassi che insieme sommano >= 10
        let remaining = [...sol.remaining];
        const finalSets = [...sol.sets];
        let totalRaises = sol.totalRaises;

        while (remaining.reduce((acc, v) => acc + v, 0) >= 10 && remaining.length >= 4) {
            const grp = [];
            let s = 0;
            while (remaining.length > 0 && s < 10) {
                const d = remaining.shift();
                grp.push(d);
                s += d;
            }
            if (s >= 10) {
                finalSets.push({ dice: grp, sum: s, raises: 1, isFifteen: false });
                totalRaises += 1;
            } else {
                remaining.unshift(...grp);
                break;
            }
        }

        return {
            dice,
            sets: finalSets,
            remaining,
            totalRaises
        };
    }

    // Trova l'indice del dado che conviene ritirare (Grado 3):
    // Priorità: il dado non abbinato con valore più basso (es. 1, 2...);
    // se tutti i dadi sono già abbinati, il dado più basso dell'intera riserva.
    function findBestRerollCandidateIndex(dice, remaining) {
        if (!Array.isArray(dice) || dice.length === 0) return -1;
        if (Array.isArray(remaining) && remaining.length > 0) {
            const minRemVal = Math.min(...remaining);
            const idx = dice.lastIndexOf(minRemVal);
            if (idx !== -1) return idx;
        }
        const minVal = Math.min(...dice);
        return dice.lastIndexOf(minVal);
    }

    function rollSeventhSeaRisk(options = {}) {
        const traitName = options.traitName || 'Grazia';
        const traitVal = typeof options.traitVal === 'number' ? options.traitVal : 2;
        const skillName = options.skillName || 'Mischia';
        const skillVal = typeof options.skillVal === 'number' ? options.skillVal : 0;
        const extraBonus = typeof options.bonusDice === 'number' ? options.bonusDice : 0;
        const dramaticWounds = Array.isArray(options.dramaticWounds) ? options.dramaticWounds : [false, false, false, false];
        const plusOnePerDie = !!options.plusOnePerDie;
        const instituteName = options.instituteName || '';

        // 1ª Ferita Drammatica: +1 Dado Bonus all'Eroe
        const dwBonus = dramaticWounds[0] ? 1 : 0;
        const poolCount = Math.max(1, traitVal + skillVal + extraBonus + dwBonus);

        // Grado 5 o 3ª Ferita Drammatica: i 10 esplodono a catena (+1d10)
        const explodeTens = (skillVal >= 5) || !!dramaticWounds[2];
        // Grado 4: set di 15 valgono 2 Incrementi
        const setsOf15 = (skillVal >= 4);
        // Grado 3: può ritirare 1 dado
        const canReroll = (skillVal >= 3);

        let rolled = [];
        let explosionsCount = 0;

        if (Array.isArray(options.predeterminedDice) && options.predeterminedDice.length > 0) {
            rolled = [...options.predeterminedDice];
            if (plusOnePerDie) {
                rolled = rolled.map(d => Math.min(10, d + 1));
            }
        } else {
            for (let i = 0; i < poolCount; i++) {
                let r = Math.floor(Math.random() * 10) + 1;
                if (plusOnePerDie) {
                    r = Math.min(10, r + 1);
                }
                rolled.push(r);
                let chainDepth = 0;
                // Esplosione a catena: se un dado fa 10, continua ad aggiungere dadi finché non esce < 10
                while (r === 10 && explodeTens && chainDepth < 10) {
                    chainDepth++;
                    explosionsCount++;
                    r = Math.floor(Math.random() * 10) + 1;
                    if (plusOnePerDie) {
                        r = Math.min(10, r + 1);
                    }
                    rolled.push(r);
                }
            }
        }

        const calc = calculateRaisesFromDice(rolled, setsOf15);

        return {
            traitName,
            traitVal,
            skillName,
            skillVal,
            dwBonus,
            extraBonus,
            poolCount,
            plusOnePerDie,
            instituteName,
            explodeTens,
            explosionsCount,
            setsOf15,
            canReroll,
            dice: calc.dice,
            sets: calc.sets,
            remaining: calc.remaining,
            totalRaises: calc.totalRaises
        };
    }

    function applyWoundsToSheet(sheet, newWounds) {
        if (!sheet) return;
        const clamped = Math.max(0, Math.min(20, parseInt(newWounds) || 0));
        sheet.currentWounds = clamped;
        if (!Array.isArray(sheet.dramaticWounds)) {
            sheet.dramaticWounds = [false, false, false, false];
        }
        if (clamped >= 5) sheet.dramaticWounds[0] = true;
        if (clamped >= 10) sheet.dramaticWounds[1] = true;
        if (clamped >= 15) sheet.dramaticWounds[2] = true;
        if (clamped >= 20) sheet.dramaticWounds[3] = true;
    }

    function endSceneHeal(sheet) {
        if (!sheet) return;
        if (!Array.isArray(sheet.dramaticWounds)) {
            sheet.dramaticWounds = [false, false, false, false];
        }
        // Ripristina le ferite superficiali mantenendo la soglia delle Ferite Drammatiche attive
        if (sheet.dramaticWounds[3]) sheet.currentWounds = 20;
        else if (sheet.dramaticWounds[2]) sheet.currentWounds = 15;
        else if (sheet.dramaticWounds[1]) sheet.currentWounds = 10;
        else if (sheet.dramaticWounds[0]) sheet.currentWounds = 5;
        else sheet.currentWounds = 0;
    }

    function broadcastRiskRollToVttChat(heroName, result) {
        if (typeof document === 'undefined' || !result) return;

        const setsBadges = (result.sets || []).map(s => {
            const nums = s.dice.join('+');
            if (s.isFifteen || s.raises === 2) {
                return `<span style="background:rgba(245,158,11,0.25);border:1px solid #f59e0b;color:#fde68a;padding:1px 6px;border-radius:4px;font-weight:900;font-size:11px;margin-right:4px;">[${nums}=${s.sum} &rarr; ⭐⭐ +2 Incr.]</span>`;
            }
            return `<span style="background:rgba(16,185,129,0.22);border:1px solid #10b981;color:#6ee7b7;padding:1px 5px;border-radius:4px;font-weight:bold;font-size:11px;margin-right:3px;">[${nums}=${s.sum} &rarr; +1 Incr.]</span>`;
        }).join(' ');

        const remText = (result.remaining && result.remaining.length > 0)
            ? `<span style="color:#9ca3af;font-size:10.5px;margin-left:4px;">Avanzati: [${result.remaining.join(', ')}]</span>`
            : '';

        const instituteTag = result.instituteName
            ? `<span style="background:#451a03;color:#fde047;border:1px solid #d97706;padding:1px 5px;border-radius:4px;font-size:10px;font-weight:bold;margin-left:6px;">🎓 ${result.instituteName} (+1 ai dadi)</span>`
            : '';

        const advBonusTag = (result.extraBonus && result.extraBonus > 0)
            ? `<span style="background:#064e3b;color:#6ee7b7;border:1px solid #059669;padding:1px 5px;border-radius:4px;font-size:10px;font-weight:bold;margin-left:6px;">+${result.extraBonus}d10 Vantaggio</span>`
            : '';

        const rerollTag = result.wasRerolled
            ? `<span style="background:#3b2d18;color:#fde047;border:1px solid #ca8a04;padding:1px 5px;border-radius:4px;font-size:10px;font-weight:bold;margin-left:6px;">🔄 Ritiro Grado 3</span>`
            : '';

        const explodeTag = (result.explosionsCount && result.explosionsCount > 0)
            ? `<span style="background:#451a1a;color:#fca5a5;border:1px solid #ef4444;padding:1px 5px;border-radius:4px;font-size:10px;font-weight:bold;margin-left:6px;">💥 ${result.explosionsCount} Esplosioni</span>`
            : '';

        const bonusStr = (result.dwBonus ? ' +1 FD' : '') + (result.extraBonus ? ` +${result.extraBonus} Vant.` : '');
        const formulaLabel = `${result.traitName} (${result.traitVal}) + ${result.skillName} (${result.skillVal})${bonusStr} = ${result.dice ? result.dice.length : 0}d10`;

        const htmlMsg = `
            <div style="border-left:3px solid #10b981;padding-left:6px;margin:2px 0;">
                <div style="font-size:11.5px;color:#fcd34d;font-weight:bold;display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
                    <span>⛵ Rischio 7th Sea: ${formulaLabel}</span>
                    ${instituteTag}
                    ${advBonusTag}
                    ${rerollTag}
                    ${explodeTag}
                </div>
                <div style="margin:3px 0;">
                    <span style="background:#065f46;color:#fff;font-weight:900;padding:2px 7px;border-radius:5px;border:1px solid #34d399;font-size:12px;">✨ ${result.totalRaises} Incrementi</span>
                </div>
                <div style="line-height:1.5;">${setsBadges || '<em style="color:#9ca3af;font-size:11px;">Nessun Incremento</em>'} ${remText}</div>
            </div>
        `;

        const chatLog = document.getElementById('chat-log');
        if (chatLog) {
            const li = document.createElement('li');
            li.style.cssText = 'background:#161922;padding:6px 8px;border-radius:6px;border:1px solid #2d3446;margin-bottom:4px;';
            li.innerHTML = `<strong style="color:#38bdf8;">${heroName || 'Eroe'}:</strong> ${htmlMsg}`;
            chatLog.appendChild(li);
            chatLog.scrollTop = chatLog.scrollHeight;
        }

        const net = (typeof network !== 'undefined' && network) ? network : window.network;
        if (net && net.mode) {
            const payload = {
                sender: heroName || 'Eroe',
                formula: `Rischio ${formulaLabel}`,
                result: `${result.totalRaises} Incrementi`,
                details: (result.sets || []).map(s => `[${s.dice.join('+')}=${s.sum}]`).join(' '),
                isPublic: true,
                customHtml: htmlMsg
            };
            if (net.mode === 'host') {
                net.broadcast({ type: 'DICE_ROLL', payload });
            } else if (net.mode === 'client') {
                net.send({ type: 'DICE_ROLL', payload });
            }
        }
    }

    // BROADCAST ATTIVAZIONE VANTAGGIO CON SPESA DI PUNTI EROE IN CHAT VTT
    function broadcastAdvantageActivationToVttChat(heroName, adv, extraMsg = '') {
        const htmlMsg = `
            <div style="border-left:3px solid #f59e0b;padding-left:8px;margin:3px 0;">
                <div style="font-size:12px;color:#fcd34d;font-weight:900;display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                    <span>⚡ Vantaggio: ${adv.name}</span>
                    <span style="background:#78350f;color:#fef08a;border:1px solid #d97706;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:bold;">-1 Punto Eroe</span>
                </div>
                <div style="font-size:11px;color:#e2e8f0;margin-top:2px;line-height:1.4;">
                    ${adv.desc || adv.description || ''}
                </div>
                ${extraMsg ? `<div style="font-size:11px;color:#f87171;font-weight:bold;margin-top:2px;">${extraMsg}</div>` : ''}
            </div>
        `;

        const chatLog = document.getElementById('chat-log');
        if (chatLog) {
            const li = document.createElement('li');
            li.style.cssText = 'background:#161922;padding:6px 8px;border-radius:6px;border:1px solid #2d3446;margin-bottom:4px;';
            li.innerHTML = `<strong style="color:#38bdf8;">${heroName || 'Eroe'}:</strong> ${htmlMsg}`;
            chatLog.appendChild(li);
            chatLog.scrollTop = chatLog.scrollHeight;
        }

        const net = (typeof network !== 'undefined' && network) ? network : window.network;
        if (net && net.mode) {
            const payload = {
                sender: heroName || 'Eroe',
                formula: `Vantaggio ${adv.name}`,
                result: `-1 Punto Eroe`,
                details: adv.desc || adv.description || '',
                isPublic: true,
                customHtml: htmlMsg
            };
            if (net.mode === 'host') {
                net.broadcast({ type: 'DICE_ROLL', payload });
            } else if (net.mode === 'client') {
                net.send({ type: 'DICE_ROLL', payload });
            }
        }
    }

    function hasAdvantage(charObj, name) {
        if (!charObj || !Array.isArray(charObj.advantages)) return false;
        const target = name.toLowerCase().trim();
        return charObj.advantages.some(a => (a && a.name && a.name.toLowerCase().trim() === target));
    }

    function getActiveInstitute(skillName, charObj) {
        if (!skillName || !charObj) return null;
        if (hasAdvantage(charObj, 'Università') && ['Istruzione', 'Empatia', 'Notare'].includes(skillName)) {
            return { name: 'Università', icon: '🎓', label: 'Università (+1 dadi)', skills: ['Istruzione', 'Empatia', 'Notare'] };
        }
        if (hasAdvantage(charObj, 'Accademia Militare') && ['Atletica', 'Cavalcare', 'Arte della Guerra', 'A.d. Guerra'].includes(skillName)) {
            return { name: 'Accademia Militare', icon: '⚔️', label: 'Acc. Militare (+1 dadi)', skills: ['Atletica', 'Cavalcare', 'Arte della Guerra', 'A.d. Guerra'] };
        }
        if (hasAdvantage(charObj, 'Scuola Di Maniere') && ['Convincere', 'Intimidire', 'Allettare'].includes(skillName)) {
            return { name: 'Scuola Di Maniere', icon: '🎭', label: 'Scuola Maniere (+1 dadi)', skills: ['Convincere', 'Intimidire', 'Allettare'] };
        }
        return null;
    }

    const CONTEXTUAL_BONUS_ADVANTAGES = [
        { name: 'Schermidore', icon: '🗡️', bonus: 1, skills: ['Mischia'], label: 'Schermidore (+1d10)' },
        { name: 'Mano Pesante', icon: '🪓', bonus: 1, skills: ['Mischia'], label: 'Mano Pesante (+1d10)' },
        { name: 'Cecchino', icon: '🎯', bonus: 1, skills: ['Mira'], label: 'Cecchino (+1d10)' },
        { name: 'Mira Letale', icon: '🔫', bonus: 1, skills: ['Mira'], label: 'Mira Letale (+1d10)' },
        { name: 'Pugilatore', icon: '🥊', bonus: 1, skills: ['Rissa'], label: 'Pugilatore (+1d10)' },
        { name: 'Rissoso', icon: '🪑', bonus: 1, skills: ['Rissa'], label: 'Rissoso (+1d10)' },
        { name: 'Virtuoso', icon: '🎭', bonus: 1, skills: ['Esibirsi'], label: 'Virtuoso (+1d10)' },
        { name: 'Cattedra', icon: '🏛️', bonus: 2, skills: ['Istruzione'], label: 'Cattedra (+2d10)' },
        { name: 'Gambe Da Marinaio', icon: '⚓', bonus: 1, skills: ['Atletica', 'Navigazione', 'Mischia'], label: 'Nave (+1d10)' },
        { name: 'Colosso', icon: '🛡️', bonus: 1, traits: ['Vigore'], skills: ['Rissa', 'Atletica'], label: 'Colosso (+1d10)' },
        { name: 'Minuto', icon: '🐀', bonus: 1, skills: ['Nascondersi', 'Furto', 'Atletica'], label: 'Minuto (+1d10)' },
        { name: 'Vista d\'Aquila', icon: '🦅', bonus: 1, skills: ['Notare', 'Mira'], label: 'Vista (+1d10)' },
        { name: 'Fama', icon: '👥', bonus: 1, traits: ['Panache'], skills: ['Convincere', 'Intimidire', 'Allettare'], label: 'Fama (+1d10)' }
    ];

    function getApplicableBonusAdvantages(traitName, skillName, charObj) {
        if (!charObj) return [];
        return CONTEXTUAL_BONUS_ADVANTAGES.filter(adv => {
            if (!hasAdvantage(charObj, adv.name)) return false;
            const matchSkill = adv.skills && adv.skills.includes(skillName);
            const matchTrait = adv.traits && adv.traits.includes(traitName);
            return matchSkill || matchTrait;
        });
    }

    const seventhSeaRules = {
        calculateRaisesFromDice,
        findBestRerollCandidateIndex,
        rollSeventhSeaRisk,
        applyWoundsToSheet,
        endSceneHeal,
        broadcastRiskRollToVttChat,
        broadcastAdvantageActivationToVttChat,
        hasAdvantage,
        getActiveInstitute,
        CONTEXTUAL_BONUS_ADVANTAGES,
        getApplicableBonusAdvantages
    };

    if (typeof window !== 'undefined') {
        window.seventhSeaRules = seventhSeaRules;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = seventhSeaRules;
    }
})();
