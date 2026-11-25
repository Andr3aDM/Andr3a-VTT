// js/systems/7thsea/token_bar.js
// Barre Ferite & Soglie Drammatiche 7th Sea (2ª Edizione) per il Canvas VTT
// Modulo 100% isolato dentro js/systems/7thsea/: si registra sull'adattatore '7thsea' di systemManager.
// Se il modulo 7th Sea viene escluso dalla pubblicazione, il core (engine.js) continua a disegnare la barra standard (5e).
//
// Modelli implementati (scelti dall'utente):
//   - Eroi / PG (anche Eroi PNG con pcSheet): Modello 1 — barra alta (20px) a 4 o 5 segmenti FD con testo inciso dentro,
//     nessuna scritta sopra la barra, accumulo ferite da sinistra a destra (0 -> 20/25).
//   - Squadre di Sgherri (Brute Squad): Modello 4A — tasselli discreti per ogni sgherro rimasto + contatore interno "⚔️ X/Y".
//   - Malvagi (Villain, anche se impostati in categoria PNG): Modello 4B — barra a 4 segmenti FD in livrea ametista con corona 👑.
//   - Mostri & Syrneth: Modello 4C — livrea cremisi con 🐙 (segmenti FD se multiplo di 5, altrimenti barra accumulo ferite).

(function () {
    'use strict';

    const HERO_SEG_COLORS = ['#f59e0b', '#f97316', '#e11d48', '#b91c1c', '#991b1b'];
    const VILLAIN_SEG_COLORS = ['#9333ea', '#c026d3', '#e11d48', '#991b1b', '#7f1d1d'];
    const MONSTER_SEG_COLORS = ['#e11d48', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'];

    function drawRoundedRectPath(ctx, x, y, w, h, r) {
        const radius = Math.max(0, Math.min(r, w / 2, h / 2));
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, w, h, radius);
        } else {
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + w - radius, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            ctx.lineTo(x + w, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            ctx.lineTo(x + radius, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }
    }

    /**
     * Classifica con certezza il ruolo 7th Sea del token (anche se un Malvagio è impostato come PNG).
     * Ordine di priorità:
     *   1. Statblock antagonista esplicito (lato Master o sincronizzato)
     *   2. sysMeta inviato dal Master in STATE_SYNC (lato Giocatore, senza esporre lo statblock segreto)
     *   3. Scheda Eroe 7th Sea (pcSheet / hasPcSheet)
     *   4. Fallback su categoria/HP per token manuali senza scheda
     */
    function classifySeventhSeaToken(token) {
        if (!token) return 'hero';

        const sb = token.statblock;
        if (sb && typeof sb === 'object') {
            const cat = String(sb.s7Category || '').toLowerCase();
            const typeStr = String(sb.type || '').toLowerCase();
            if (cat === 'brute' || typeStr.includes('sgherr') || typeStr.includes('brute')) return 'brute';
            if (
                cat === 'villain' ||
                typeStr.includes('malvagio') ||
                typeStr.includes('villain') ||
                sb.s7Influence !== undefined ||
                sb.influence !== undefined ||
                sb.s7VillainyRank !== undefined ||
                sb.villainyRank !== undefined
            ) {
                return 'villain';
            }
            if (cat === 'monster' || typeStr.includes('mostro') || typeStr.includes('monster') || typeStr.includes('syrneth')) {
                return 'monster';
            }
            if (cat === 'npc' || cat === 'hero') return 'hero';
        }

        const sm = token.sysMeta;
        if (sm && sm.s7Role) {
            if (sm.s7Role === 'b') return 'brute';
            if (sm.s7Role === 'v') return 'villain';
            if (sm.s7Role === 'm') return 'monster';
            if (sm.s7Role === 'h') return 'hero';
        }

        if (token.pcSheet && (token.pcSheet.system === '7thsea' || token.pcSheet.traits || token.pcSheet.dramaticWounds)) {
            return 'hero';
        }
        if (token.hasPcSheet && !token.hasStatblock) {
            return 'hero';
        }

        const tokenCat = String(token.category || '').toLowerCase();
        const hpMax = parseInt(token.hpMax, 10) || 0;
        if (tokenCat === 'personaggi') return 'hero';
        if (tokenCat === 'mostri') {
            if (hpMax > 0 && hpMax !== 20 && hpMax !== 25 && hpMax <= 16) return 'brute';
            return 'monster';
        }
        if (tokenCat === 'png') {
            if (hpMax === 20 || hpMax === 25) return 'hero';
            return 'brute';
        }
        return 'hero';
    }

    /**
     * Metadati ultraleggeri per STATE_SYNC (solo per antagonisti 7th Sea: ~15 byte; null per Eroi con pcSheet già sincro).
     * Garantisce che anche i Giocatori vedano Sgherri / Malvagi / Mostri con la barra corretta senza mai inviare lo statblock.
     */
    function getSeventhSeaTokenNetworkMeta(token) {
        if (!token) return null;
        const role = classifySeventhSeaToken(token);
        if (role === 'brute') return { s7Role: 'b' };
        if (role === 'villain') return { s7Role: 'v' };
        if (role === 'monster') return { s7Role: 'm' };
        return null;
    }

    function hasDuroDaUccidere(token, hpMax) {
        if (hpMax >= 25) return true;
        const ps = token && token.pcSheet;
        if (!ps || !Array.isArray(ps.advantages)) return false;
        for (let i = 0; i < ps.advantages.length; i++) {
            const a = ps.advantages[i];
            const name = typeof a === 'object' ? (a && a.name) : a;
            if (name && String(name).toLowerCase().includes('duro da uccidere')) return true;
        }
        return false;
    }

    /**
     * Disegna la barra a segmenti di Ferite Drammatiche (Modello 1 per Eroi, Modello 4B per Malvagi, Modello 4C per Mostri).
     * Nessun testo sopra la barra; etichette nitide integrate dentro ogni segmento.
     */
    function drawSegmentedWoundsBar(ctx, token, opts, role) {
        const showDetailed = !!(opts && opts.showDetailedHp);
        const hpMax = Math.max(1, parseInt(token.hpMax, 10) || 20);
        const hpCurr = Math.max(0, Math.min(hpMax, parseInt(token.hpCurrent, 10) || 0));
        const wounds = Math.max(0, Math.min(hpMax, hpMax - hpCurr));

        let numSegs = 4;
        if (role === 'hero') {
            numSegs = hasDuroDaUccidere(token, hpMax) ? 5 : 4;
        } else if (role === 'villain') {
            numSegs = (hpMax >= 25 && hpMax % 5 === 0) ? Math.min(5, Math.round(hpMax / 5)) : 4;
        } else {
            // monster con multiplo di 5 (es. 20 o 25)
            numSegs = Math.max(2, Math.min(5, Math.round(hpMax / 5)));
        }
        const perSeg = Math.max(1, hpMax / numSegs);
        const isHelpless = wounds >= hpMax;

        const hasPrefixIcon = showDetailed && (role === 'villain' || role === 'monster');
        const prefixW = hasPrefixIcon ? 16 : 0;
        const barHeight = showDetailed ? 20 : 12;

        const minBarW = showDetailed ? (numSegs >= 5 ? 82 : 70) + prefixW : 46;
        const maxBarW = Math.max(minBarW, token.width + 8);
        const barWidth = Math.min(maxBarW, Math.max(minBarW, token.width - 2));
        const barX = Math.round(token.x + (token.width - barWidth) / 2);
        const barY = Math.round(token.y + token.height - barHeight - 2);
        const radius = showDetailed ? 5 : 3.5;

        const palette = role === 'villain' ? VILLAIN_SEG_COLORS : (role === 'monster' ? MONSTER_SEG_COLORS : HERO_SEG_COLORS);
        let borderColor = role === 'villain' ? '#a855f7' : (role === 'monster' ? '#e11d48' : '#d4af37');
        if (isHelpless) borderColor = '#ef4444';

        ctx.save();

        // 1. Sfondo capsula scura
        drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
        ctx.fillStyle = 'rgba(12, 14, 20, 0.92)';
        ctx.fill();

        // 2. Clip interno per prefisso icona + segmenti
        ctx.save();
        drawRoundedRectPath(ctx, barX + 1, barY + 1, barWidth - 2, barHeight - 2, Math.max(2, radius - 1));
        ctx.clip();

        // Prefisso icona integrato a sinistra (solo Malvagi 👑 e Mostri 🐙)
        if (hasPrefixIcon) {
            ctx.fillStyle = role === 'villain' ? 'rgba(88, 28, 135, 0.85)' : 'rgba(136, 19, 55, 0.85)';
            ctx.fillRect(barX + 1, barY + 1, prefixW, barHeight - 2);
            ctx.font = 'bold 10px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(role === 'villain' ? '👑' : '🐙', barX + 1 + prefixW / 2, barY + barHeight / 2 + 0.5);
        }

        const innerX = barX + 2 + prefixW;
        const innerY = barY + 2;
        const innerW = Math.max(10, barWidth - 4 - prefixW);
        const innerH = Math.max(4, barHeight - 4);
        const gap = showDetailed ? 2 : 1.5;
        const segW = (innerW - gap * (numSegs - 1)) / numSegs;

        for (let i = 0; i < numSegs; i++) {
            const sx = innerX + i * (segW + gap);
            const segWounds = Math.max(0, Math.min(perSeg, wounds - i * perSeg));
            const segPct = segWounds / perSeg;
            const isFull = segWounds >= perSeg;
            const isPartial = segWounds > 0 && !isFull;
            const isLast = (i === numSegs - 1);

            // Base slot del segmento
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.fillRect(sx, innerY, segW, innerH);

            // Riempimento progressivo del segmento da sinistra a destra
            if (segPct > 0) {
                const fillW = Math.max(2, segW * segPct);
                ctx.fillStyle = palette[Math.min(i, palette.length - 1)];
                ctx.fillRect(sx, innerY, fillW, innerH);
                // Sottile luce superiore per leggibilità e profondità senza shadowBlur
                ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
                ctx.fillRect(sx, innerY, fillW, Math.max(1, Math.round(innerH * 0.25)));
            }

            // Testo integrato DENTRO il segmento (solo vista dettagliata GM / proprio PG)
            if (showDetailed) {
                const cx = sx + segW / 2;
                const cy = innerY + innerH / 2 + 0.5;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                if (isFull) {
                    const label = isLast ? '💀' : String(i + 1);
                    ctx.font = `bold ${isLast ? 10 : 11}px Arial, sans-serif`;
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
                    ctx.lineWidth = 2.5;
                    ctx.strokeText(label, cx, cy);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(label, cx, cy);
                } else if (isPartial) {
                    const wholeSegWounds = Math.round(segWounds);
                    const wholePerSeg = Math.round(perSeg);
                    const label = (segW >= 22) ? `${wholeSegWounds}/${wholePerSeg}` : String(wholeSegWounds);
                    const fSize = (segW >= 22) ? 9.5 : 11;
                    ctx.font = `bold ${fSize}px Arial, sans-serif`;
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.95)';
                    ctx.lineWidth = 2.6;
                    ctx.strokeText(label, cx, cy);
                    ctx.fillStyle = '#fef08a';
                    ctx.fillText(label, cx, cy);
                } else {
                    const label = isLast ? '💀' : String(i + 1);
                    ctx.font = `bold ${isLast ? 9 : 10}px Arial, sans-serif`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
                    ctx.fillText(label, cx, cy);
                }
            }
        }

        ctx.restore(); // fine clip

        // 3. Cornice esterna di rifinitura
        drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = isHelpless ? 2 : 1.5;
        ctx.stroke();

        ctx.restore();
        return { handled: true, barHeight, role, numSegs, wounds };
    }

    /**
     * Disegna la barra per Mostri con HP personalizzati non multipli di 5 (accumulo cremisi con 🐙 X/Y).
     */
    function drawMonsterCustomWoundsBar(ctx, token, opts) {
        const showDetailed = !!(opts && opts.showDetailedHp);
        const hpMax = Math.max(1, parseInt(token.hpMax, 10) || 10);
        const hpCurr = Math.max(0, Math.min(hpMax, parseInt(token.hpCurrent, 10) || 0));
        const wounds = Math.max(0, Math.min(hpMax, hpMax - hpCurr));
        const pct = wounds / hpMax;

        const barHeight = showDetailed ? 20 : 12;
        const minBarW = showDetailed ? 66 : 44;
        const maxBarW = Math.max(minBarW, token.width + 6);
        const barWidth = Math.min(maxBarW, Math.max(minBarW, token.width - 2));
        const barX = Math.round(token.x + (token.width - barWidth) / 2);
        const barY = Math.round(token.y + token.height - barHeight - 2);
        const radius = showDetailed ? 5 : 3.5;

        ctx.save();
        drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
        ctx.fillStyle = 'rgba(12, 14, 20, 0.92)';
        ctx.fill();

        ctx.save();
        drawRoundedRectPath(ctx, barX + 1, barY + 1, barWidth - 2, barHeight - 2, Math.max(2, radius - 1));
        ctx.clip();

        if (pct > 0) {
            ctx.fillStyle = pct >= 1 ? '#991b1b' : '#e11d48';
            ctx.fillRect(barX + 1, barY + 1, Math.round((barWidth - 2) * pct), barHeight - 2);
        }
        ctx.restore();

        drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
        ctx.strokeStyle = pct >= 1 ? '#ef4444' : '#be123c';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (showDetailed) {
            const text = pct >= 1 ? `💀 ${wounds}/${hpMax}` : `🐙 ${wounds}/${hpMax}`;
            ctx.font = 'bold 11px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2.8;
            ctx.strokeText(text, barX + barWidth / 2, barY + barHeight / 2 + 0.5);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, barX + barWidth / 2, barY + barHeight / 2 + 0.5);
        }

        ctx.restore();
        return { handled: true, barHeight, role: 'monster', wounds };
    }

    /**
     * Disegna la barra per Squadra di Sgherri (Modello 4A):
     * Tasselli discreti per ogni sgherro rimasto (fino a 12 unità) + testo centrato "⚔️ X/Y" (o "💀 0/Y").
     */
    function drawBruteSquadBar(ctx, token, opts) {
        const showDetailed = !!(opts && opts.showDetailedHp);
        const hpMax = Math.max(1, parseInt(token.hpMax, 10) || 6);
        const hpCurr = Math.max(0, Math.min(hpMax, parseInt(token.hpCurrent, 10) || 0));
        const pct = hpCurr / hpMax;

        const barHeight = showDetailed ? 20 : 12;
        const minBarW = showDetailed ? 68 : 44;
        const maxBarW = Math.max(minBarW, token.width + 6);
        const barWidth = Math.min(maxBarW, Math.max(minBarW, token.width - 2));
        const barX = Math.round(token.x + (token.width - barWidth) / 2);
        const barY = Math.round(token.y + token.height - barHeight - 2);
        const radius = showDetailed ? 5 : 3.5;

        const activeColor = pct <= 0 ? '#6b7280' : (pct <= 0.25 ? '#ef4444' : (pct <= 0.5 ? '#f97316' : '#f59e0b'));

        ctx.save();

        // 1. Sfondo capsula scura
        drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
        ctx.fillStyle = 'rgba(14, 15, 22, 0.92)';
        ctx.fill();

        // 2. Tasselli unità (1 per sgherro fino a 12, barra fluida con tacche oltre 12)
        ctx.save();
        drawRoundedRectPath(ctx, barX + 1, barY + 1, barWidth - 2, barHeight - 2, Math.max(2, radius - 1));
        ctx.clip();

        const innerX = barX + 2;
        const innerY = barY + 2;
        const innerW = Math.max(10, barWidth - 4);
        const innerH = Math.max(4, barHeight - 4);

        if (hpMax <= 12) {
            const gap = hpMax >= 9 ? 1 : 1.5;
            const unitW = (innerW - gap * (hpMax - 1)) / hpMax;
            for (let i = 0; i < hpMax; i++) {
                const ux = innerX + i * (unitW + gap);
                const alive = i < hpCurr;
                ctx.fillStyle = alive ? activeColor : 'rgba(255, 255, 255, 0.08)';
                ctx.fillRect(ux, innerY, unitW, innerH);
                if (alive) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
                    ctx.fillRect(ux, innerY, unitW, Math.max(1, Math.round(innerH * 0.25)));
                }
            }
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.fillRect(innerX, innerY, innerW, innerH);
            if (pct > 0) {
                ctx.fillStyle = activeColor;
                ctx.fillRect(innerX, innerY, Math.round(innerW * pct), innerH);
            }
        }
        ctx.restore();

        // 3. Bordo bronzo/ambra
        drawRoundedRectPath(ctx, barX, barY, barWidth, barHeight, radius);
        ctx.strokeStyle = hpCurr <= 0 ? '#6b7280' : '#d97706';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 4. Testo centrato dentro la barra (solo vista dettagliata GM / proprio controllo)
        if (showDetailed) {
            const text = hpCurr <= 0 ? `💀 0/${hpMax}` : `⚔️ ${hpCurr}/${hpMax}`;
            ctx.font = 'bold 11px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.95)';
            ctx.lineWidth = 2.8;
            ctx.strokeText(text, barX + barWidth / 2, barY + barHeight / 2 + 0.5);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, barX + barWidth / 2, barY + barHeight / 2 + 0.5);
        }

        ctx.restore();
        return { handled: true, barHeight, role: 'brute', hpCurr, hpMax };
    }

    function drawSeventhSeaTokenHpBar(ctx, token, opts) {
        if (!ctx || !token || !token.hpMax || token.hpMax <= 0) return null;
        const role = classifySeventhSeaToken(token);

        if (role === 'brute') {
            return drawBruteSquadBar(ctx, token, opts);
        }
        if (role === 'monster') {
            const hpMax = parseInt(token.hpMax, 10) || 20;
            if (hpMax >= 10 && hpMax <= 30 && hpMax % 5 === 0) {
                return drawSegmentedWoundsBar(ctx, token, opts, 'monster');
            }
            return drawMonsterCustomWoundsBar(ctx, token, opts);
        }
        // 'hero' (Modello 1) o 'villain' (Modello 4B)
        return drawSegmentedWoundsBar(ctx, token, opts, role);
    }

    function applySeventhSeaWoundDelta(token, delta, mode) {
        if (!token) return false;
        const role = classifySeventhSeaToken(token);

        if (role === 'brute') {
            const sbStr = (token.statblock && token.statblock.s7Strength !== undefined) ? parseInt(token.statblock.s7Strength, 10) : NaN;
            const hpMax = Math.max(1, parseInt(token.hpMax, 10) || (Number.isFinite(sbStr) && sbStr > 0 ? sbStr : 6));
            const curStr = Number.isFinite(Number(token.hpCurrent))
                ? Math.max(0, Math.min(hpMax, parseInt(token.hpCurrent, 10)))
                : hpMax;
            const nextStr = Math.max(0, Math.min(hpMax, curStr + delta));
            token.hpMax = hpMax;
            token.hpCurrent = nextStr;
            if (token.statblock && typeof token.statblock === 'object') {
                token.statblock.s7Strength = nextStr;
            }
            return false;
        }

        if (role === 'hero') {
            const ps = (token.pcSheet && typeof token.pcSheet === 'object') ? token.pcSheet : null;
            const maxW = hasDuroDaUccidere(token, parseInt(token.hpMax, 10) || 20) ? 25 : 20;
            const curWounds = ps
                ? Math.max(0, Math.min(maxW, parseInt(ps.currentWounds, 10) || 0))
                : Math.max(0, Math.min(maxW, maxW - (Number.isFinite(Number(token.hpCurrent)) ? parseInt(token.hpCurrent, 10) : maxW)));
            const nextWounds = (mode === 'clearOrdinary')
                ? Math.floor(curWounds / 5) * 5
                : Math.max(0, Math.min(maxW, curWounds + delta));

            token.hpMax = maxW;
            token.hpCurrent = Math.max(0, maxW - nextWounds);

            if (ps) {
                ps.currentWounds = nextWounds;
                if (!Array.isArray(ps.dramaticWounds)) ps.dramaticWounds = [false, false, false, false, false];
                while (ps.dramaticWounds.length < 5) ps.dramaticWounds.push(false);
                const thresholds = (maxW >= 25) ? [5, 10, 15, 20, 25] : [5, 10, 15, 20];
                thresholds.forEach((th, i) => { ps.dramaticWounds[i] = nextWounds >= th; });
                if (maxW < 25) ps.dramaticWounds[4] = false;
                ps.updatedAt = Date.now();
                if (typeof window !== 'undefined' && window.seventhSeaSheetManager && typeof window.seventhSeaSheetManager.refreshIfOpen === 'function') {
                    window.seventhSeaSheetManager.refreshIfOpen(token.id);
                }
                return true; // syncSheet
            }
            return false;
        }

        // 'villain' o 'monster'
        const hpMax = Math.max(1, parseInt(token.hpMax, 10) || 20);
        const hpCurr = Number.isFinite(Number(token.hpCurrent))
            ? Math.max(0, Math.min(hpMax, parseInt(token.hpCurrent, 10)))
            : hpMax;
        const curWounds = Math.max(0, Math.min(hpMax, hpMax - hpCurr));
        const nextWounds = Math.max(0, Math.min(hpMax, curWounds + delta));
        token.hpMax = hpMax;
        token.hpCurrent = Math.max(0, hpMax - nextWounds);
        return false;
    }

    function renderSeventhSeaTokenHealthControls(container, token, targets, helpers) {
        if (!container || !token) return false;
        const role = classifySeventhSeaToken(token);
        const targetList = (Array.isArray(targets) && targets.length > 0) ? targets : [token];
        const headerEl = helpers && helpers.headerLabelEl;

        const btnBase = 'padding:0; height:24px; display:inline-flex; align-items:center; justify-content:center; font-size:11.5px; font-weight:bold; border-radius:4px; cursor:pointer; line-height:1; user-select:none;';

        if (role === 'brute') {
            const sbStr = (token.statblock && token.statblock.s7Strength !== undefined) ? parseInt(token.statblock.s7Strength, 10) : NaN;
            const hpMax = Math.max(1, parseInt(token.hpMax, 10) || (Number.isFinite(sbStr) && sbStr > 0 ? sbStr : 6));
            const curStr = Number.isFinite(Number(token.hpCurrent))
                ? Math.max(0, Math.min(hpMax, parseInt(token.hpCurrent, 10)))
                : hpMax;
            if (headerEl) {
                headerEl.textContent = '⚔️ Forza Squadra';
                headerEl.style.color = '#fbbf24';
            }
            container.innerHTML = `
                <div style="display:flex; align-items:center; gap:5px; background:#1c1a16; border:1px solid #5c4520; border-radius:5px; padding:4px 6px;">
                    <button type="button" id="s7-panel-hp-minus" style="${btnBase} width:34px; background:#b91c1c; color:#fff; border:1px solid #ef4444;" title="Infliggi 1 Incremento (−1 Forza)">−1</button>
                    <div style="flex:1; text-align:center; font-size:12px; font-weight:bold; color:${curStr === 0 ? '#ef5350' : '#fde68a'};">
                        ⚔️ <span id="s7-panel-hp-val">${curStr}</span> / ${hpMax}
                    </div>
                    <button type="button" id="s7-panel-hp-plus" style="${btnBase} width:34px; background:#2e7d32; color:#fff; border:1px solid #4caf50;" title="Ripristina +1 Forza">+1</button>
                </div>`;
            const runDelta = (d) => {
                targetList.forEach(t => applySeventhSeaWoundDelta(t, d));
                if (helpers && typeof helpers.onMutate === 'function') helpers.onMutate(targetList, { syncSheet: false });
            };
            container.querySelector('#s7-panel-hp-minus').addEventListener('click', () => runDelta(-1));
            container.querySelector('#s7-panel-hp-plus').addEventListener('click', () => runDelta(+1));
            return true;
        }

        // Eroe, Malvagio o Mostro (accumulo Ferite 0 -> maxW + Soglie Drammatiche)
        const ps = (role === 'hero' && token.pcSheet && typeof token.pcSheet === 'object') ? token.pcSheet : null;
        const rawMax = parseInt(token.hpMax, 10) || 20;
        const maxW = (role === 'hero') ? (hasDuroDaUccidere(token, rawMax) ? 25 : 20) : Math.max(1, rawMax);
        const curWounds = ps
            ? Math.max(0, Math.min(maxW, parseInt(ps.currentWounds, 10) || 0))
            : Math.max(0, Math.min(maxW, maxW - (Number.isFinite(Number(token.hpCurrent)) ? parseInt(token.hpCurrent, 10) : maxW)));

        const numSegs = (role === 'hero')
            ? (maxW >= 25 ? 5 : 4)
            : (role === 'villain')
                ? ((maxW >= 25 && maxW % 5 === 0) ? Math.min(5, Math.round(maxW / 5)) : 4)
                : ((maxW >= 10 && maxW <= 30 && maxW % 5 === 0) ? Math.max(2, Math.min(5, Math.round(maxW / 5))) : 0);
        const perSeg = numSegs > 0 ? Math.max(1, maxW / numSegs) : 5;
        const dwReached = numSegs > 0 ? Math.floor(curWounds / perSeg) : 0;

        if (headerEl) {
            if (role === 'villain') { headerEl.textContent = '👑 Ferite Malvagio'; headerEl.style.color = '#c084fc'; }
            else if (role === 'monster') { headerEl.textContent = '🐙 Ferite Mostro'; headerEl.style.color = '#fb7185'; }
            else { headerEl.textContent = '🩸 Ferite & Soglie'; headerEl.style.color = '#f59e0b'; }
        }

        const accentBorder = role === 'villain' ? '#7e22ce' : (role === 'monster' ? '#be123c' : '#854d0e');
        const accentFill = role === 'villain' ? '#9333ea' : (role === 'monster' ? '#e11d48' : '#d97706');
        let segsHtml = '';
        if (numSegs > 0) {
            const pills = [];
            for (let i = 0; i < numSegs; i++) {
                const full = curWounds >= Math.round((i + 1) * perSeg);
                const partial = !full && curWounds > Math.round(i * perSeg);
                const isLast = i === numSegs - 1;
                const bg = full ? (isLast ? '#b91c1c' : accentFill) : (partial ? 'rgba(245,158,11,0.28)' : '#232328');
                const clr = full ? '#fff' : (partial ? '#fde68a' : '#777');
                const lbl = isLast && full ? '💀' : `${i + 1}ª`;
                pills.push(`<span style="flex:1; text-align:center; font-size:9.5px; font-weight:bold; padding:1px 0; border-radius:3px; background:${bg}; color:${clr}; border:1px solid ${full ? 'rgba(255,255,255,0.25)' : '#38383f'};">${lbl}</span>`);
            }
            segsHtml = `<div style="display:flex; gap:3px; margin-top:4px;">${pills.join('')}</div>`;
        }

        const clearBtnHtml = (role === 'hero')
            ? `<button type="button" id="s7-panel-hp-clear" style="${btnBase} padding:0 6px; font-size:10px; background:#263238; color:#b0bec5; border:1px solid #455a64;" title="Fine Scena: azzera le ferite ordinarie mantenendo le Ferite Drammatiche">Azzera</button>`
            : '';

        container.innerHTML = `
            <div style="background:#1c1a20; border:1px solid ${accentBorder}; border-radius:5px; padding:4px 6px;">
                <div style="display:flex; align-items:center; gap:4px;">
                    <button type="button" id="s7-panel-hp-minus" style="${btnBase} width:32px; background:#2e7d32; color:#fff; border:1px solid #4caf50;" title="Togli 1 Ferita (−1)">−1</button>
                    <div style="flex:1; text-align:center; font-size:12px; font-weight:bold; color:${curWounds >= maxW ? '#ef5350' : '#f3f4f6'}; white-space:nowrap;">
                        🩸 <span id="s7-panel-hp-val">${curWounds}</span>/${maxW}${numSegs > 0 ? ` <span style="font-size:10px; color:#cbd5e1;">(${dwReached}/${numSegs} FD)</span>` : ''}
                    </div>
                    <button type="button" id="s7-panel-hp-plus" style="${btnBase} width:32px; background:#b91c1c; color:#fff; border:1px solid #ef4444;" title="Aggiungi 1 Ferita (+1)">+1</button>
                    ${clearBtnHtml}
                </div>
                ${segsHtml}
            </div>`;

        const runOp = (delta, mode) => {
            let needSheetSync = false;
            targetList.forEach(t => {
                if (applySeventhSeaWoundDelta(t, delta, mode)) needSheetSync = true;
            });
            if (helpers && typeof helpers.onMutate === 'function') {
                helpers.onMutate(targetList, { syncSheet: needSheetSync });
            }
        };
        container.querySelector('#s7-panel-hp-minus').addEventListener('click', () => runOp(-1));
        container.querySelector('#s7-panel-hp-plus').addEventListener('click', () => runOp(+1));
        const clrBtn = container.querySelector('#s7-panel-hp-clear');
        if (clrBtn) clrBtn.addEventListener('click', () => runOp(0, 'clearOrdinary'));
        return true;
    }

    function attachToSeventhSeaAdapter() {
        if (typeof window === 'undefined' || !window.systemManager) return false;
        const adapter = window.systemManager.getAdapter('7thsea');
        if (!adapter) return false;
        adapter.drawTokenHpBar = drawSeventhSeaTokenHpBar;
        adapter.getTokenNetworkMeta = getSeventhSeaTokenNetworkMeta;
        adapter.renderTokenHealthControls = renderSeventhSeaTokenHealthControls;
        return true;
    }

    const api = {
        classifySeventhSeaToken,
        getSeventhSeaTokenNetworkMeta,
        drawSeventhSeaTokenHpBar,
        applySeventhSeaWoundDelta,
        renderSeventhSeaTokenHealthControls,
        attachToSeventhSeaAdapter
    };

    if (typeof window !== 'undefined') {
        window.seventhSeaTokenBar = api;
        attachToSeventhSeaAdapter();
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})();
