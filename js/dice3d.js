// js/dice3d.js
// Motore leggero Dadi 3D "Deterministic Outcome" (zero librerie esterne, 0% CPU a riposo).
// - Disegna poliedri 3D nativi (d4, d6, d8, d10, d12, d20, d100) su un <canvas> trasparente (pointer-events: none).
// - Ogni dado ruota e atterra mostrando in alto esattamente il numero già calcolato dal VTT (1:1 con la chat).
// - Copre tiri liberi (dice.js), Scheda PG 5e (pcsheet.js), Compendio 5e (compendium.js), 7th Sea (rules.js) e NCS (roll.js).
(function () {
    'use strict';

    const IS_PLAYER_PAGE = (typeof location !== 'undefined' && /player\.html/i.test(location.pathname || ''));
    const BASE_ROLE_SUFFIX = IS_PLAYER_PAGE ? '_pl' : '_dm';
    const DEFAULT_COLOR = '#0288d1';
    const MAX_VISUAL_DICE = 24;
    const HOLD_MS = 2300;
    const FADE_MS = 400;

    const PRESET_COLORS = ['#0288d1', '#dc2626', '#059669', '#9333ea', '#d97706', '#e5e7eb', '#1f2937'];
    const NCS_COLORS = {
        discipline: '#f3f4f6',
        exhaustion: '#18181b',
        madness: '#b91c1c',
        pain: '#6d28d9'
    };

    const PHI = (1 + Math.sqrt(5)) / 2;

    const T = (s) => {
        try { return (typeof window.t === 'function') ? window.t(s) : s; }
        catch (e) { return s; }
    };
    const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    // ---------------- Matematica Vettori & Quaternioni ----------------
    const vSub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const vAdd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    const vScale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
    const vDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const vCross = (a, b) => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
    const vNorm = (a) => {
        const l = Math.hypot(a[0], a[1], a[2]) || 1;
        return [a[0] / l, a[1] / l, a[2] / l];
    };

    function qMul(a, b) {
        return [
            a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
            a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
            a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
            a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
        ];
    }

    function qFromAxisAngle(axis, angle) {
        const n = vNorm(axis);
        const s = Math.sin(angle / 2);
        return [n[0] * s, n[1] * s, n[2] * s, Math.cos(angle / 2)];
    }

    function qFromTwoVecs(from, to) {
        const f = vNorm(from), t = vNorm(to);
        const d = vDot(f, t);
        if (d > 0.9999) return [0, 0, 0, 1];
        if (d < -0.9999) {
            let ortho = vCross([1, 0, 0], f);
            if (Math.hypot(ortho[0], ortho[1], ortho[2]) < 0.01) ortho = vCross([0, 0, 1], f);
            return qFromAxisAngle(ortho, Math.PI);
        }
        const c = vCross(f, t);
        const q = [c[0], c[1], c[2], 1 + d];
        const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
        return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
    }

    function qRotateVec(q, v) {
        const u = [q[0], q[1], q[2]], s = q[3];
        const uv = vCross(u, v), uuv = vCross(u, uv);
        return vAdd(v, vScale(vAdd(vScale(uv, s), uuv), 2));
    }

    // ---------------- Geometrie Poliedri 3D ----------------
    function buildFaceData(verts, rawFaces) {
        return rawFaces.map(idxs => {
            const pts = idxs.map(i => verts[i]);
            let center = [0, 0, 0];
            pts.forEach(p => { center = vAdd(center, p); });
            center = vScale(center, 1 / pts.length);
            let n = vNorm(vCross(vSub(pts[1], pts[0]), vSub(pts[2], pts[0])));
            let ordered = idxs.slice();
            if (vDot(n, center) < 0) {
                n = vScale(n, -1);
                ordered.reverse();
            }
            const up = vNorm(vSub(verts[ordered[0]], center));
            return { indices: ordered, normal: n, center, up };
        });
    }

    function createPolyhedra() {
        const normAll = (arr) => arr.map(vNorm);

        const tetV = normAll([[0, 0, 1], [0.9428, 0, -0.3333], [-0.4714, 0.8165, -0.3333], [-0.4714, -0.8165, -0.3333]]);
        const tetF = buildFaceData(tetV, [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]]);

        const cubV = normAll([[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]);
        const cubF = buildFaceData(cubV, [[4, 5, 6, 7], [1, 0, 3, 2], [0, 4, 7, 3], [5, 1, 2, 6], [7, 6, 2, 3], [0, 1, 5, 4]]);

        const octV = normAll([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]);
        const octF = buildFaceData(octV, [
            [4, 0, 2], [4, 2, 1], [4, 1, 3], [4, 3, 0],
            [5, 2, 0], [5, 1, 2], [5, 3, 1], [5, 0, 3]
        ]);

        // Trapezoedro pentagonale (d10 / d100)
        const d10V = [[0, 0, 1], [0, 0, -1]];
        const r10 = 0.88, h10 = 0.21;
        for (let i = 0; i < 10; i++) {
            const ang = (i * Math.PI) / 5;
            d10V.push([r10 * Math.cos(ang), r10 * Math.sin(ang), (i % 2 === 0 ? h10 : -h10)]);
        }
        const d10VNorm = normAll(d10V);
        const d10Idx = [];
        for (let k = 0; k < 5; k++) {
            const a = 2 + ((2 * k) % 10), b = 2 + ((2 * k + 1) % 10), c = 2 + ((2 * k + 2) % 10);
            const d = 2 + ((2 * k + 3) % 10);
            d10Idx.push([0, a, b, c]);
            d10Idx.push([1, b, c, d]);
        }
        const d10F = buildFaceData(d10VNorm, d10Idx);

        // Icosaedro (d20)
        const icoV = normAll([
            [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
            [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
            [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]
        ]);
        const icoIdx = [
            [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
            [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
            [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
            [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
        ];
        const icoF = buildFaceData(icoV, icoIdx);

        // Dodecaedro (d12) — duale dell'icosaedro
        const dodV = icoF.map(f => vNorm(f.center));
        const dodIdx = icoV.map((_, vi) => {
            const adj = [];
            icoF.forEach((f, fi) => { if (f.indices.includes(vi)) adj.push(fi); });
            const axis = icoV[vi];
            const ref = vNorm(vSub(dodV[adj[0]], axis));
            const bin = vCross(axis, ref);
            adj.sort((fa, fb) => {
                const aA = Math.atan2(vDot(dodV[fa], bin), vDot(dodV[fa], ref));
                const aB = Math.atan2(vDot(dodV[fb], bin), vDot(dodV[fb], ref));
                return aA - aB;
            });
            return adj;
        });
        const dodF = buildFaceData(dodV, dodIdx);

        return {
            4: { verts: tetV, faces: tetF },
            6: { verts: cubV, faces: cubF },
            8: { verts: octV, faces: octF },
            10: { verts: d10VNorm, faces: d10F },
            12: { verts: dodV, faces: dodF },
            20: { verts: icoV, faces: icoF },
            100: { verts: d10VNorm, faces: d10F }
        };
    }

    const POLY = createPolyhedra();
    const VIEW_DIR = vNorm([0, 0.38, 0.92]);
    const LIGHT_DIR = vNorm([-0.35, 0.55, 0.76]);

    function mapSidesToMesh(rawSides) {
        const s = parseInt(rawSides, 10) || 20;
        if (POLY[s]) return s;
        if (s <= 4) return 4;
        if (s <= 6) return 6;
        if (s <= 8) return 8;
        if (s <= 10) return 10;
        if (s <= 12) return 12;
        return 20;
    }

    function assignLabelsForShape(meshSides, resultVal, winIdx) {
        const fCount = POLY[meshSides].faces.length;
        const labels = new Array(fCount);
        const valStr = String(resultVal);
        if (meshSides === 100) {
            const decs = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'].filter(v => v !== valStr);
            labels[winIdx] = valStr;
            for (let i = 0; i < fCount; i++) {
                if (i !== winIdx) labels[i] = decs.pop() || '00';
            }
        } else {
            const pool = [];
            for (let n = 1; n <= fCount; n++) {
                if (String(n) !== valStr) pool.push(String(n));
            }
            labels[winIdx] = valStr;
            for (let i = 0; i < fCount; i++) {
                if (i !== winIdx) labels[i] = pool.pop() || '';
            }
        }
        return labels;
    }

    // ---------------- Colore & Audio ----------------
    function normalizeHex(hex) {
        if (typeof hex !== 'string') return DEFAULT_COLOR;
        const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
        return m ? '#' + m[1].toLowerCase() : DEFAULT_COLOR;
    }

    function parseHex(hex) {
        const c = normalizeHex(hex).slice(1);
        return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
    }

    function shadeColor(rgb, factor) {
        const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
        return `rgb(${clamp(rgb[0] * factor)},${clamp(rgb[1] * factor)},${clamp(rgb[2] * factor)})`;
    }

    function contrastInk(rgb) {
        const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
        return lum > 152 ? '#111827' : '#ffffff';
    }

    let audioCtx = null;
    let lastClackMs = 0;
    function playRollClack(intensity) {
        if (!isSoundEnabled()) return;
        const nowMs = Date.now();
        if (nowMs - lastClackMs < 48) return;
        lastClackMs = nowMs;
        try {
            const AudioCtor = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtor) return;
            if (!audioCtx) audioCtx = new AudioCtor();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(280 + Math.random() * 240, now);
            osc.frequency.exponentialRampToValueAtTime(95, now + 0.045);
            gain.gain.setValueAtTime(0.055 * (intensity || 1), now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.055);
        } catch (e) { /* ignora ambienti senza Web Audio */ }
    }

    // ---------------- Preferenze isolate per singola finestra/scheda + persistenza per giocatore ----------------
    let enabledState = true;
    let soundState = true;
    let colorState = DEFAULT_COLOR;
    let loadedStorageSuffix = null;
    const userTouched = { enabled: false, sound: false, color: false };

    function getPlayerSlug() {
        if (!IS_PLAYER_PAGE) return '';
        let raw = '';
        try {
            if (typeof window.network !== 'undefined' && window.network && window.network.playerName) {
                raw = String(window.network.playerName);
            } else if (typeof location !== 'undefined' && location.search) {
                raw = new URLSearchParams(location.search).get('name') || '';
            }
        } catch (e) {}
        const slug = raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40);
        return slug;
    }

    function getStorageSuffix() {
        const slug = getPlayerSlug();
        return slug ? (BASE_ROLE_SUFFIX + '_' + slug) : BASE_ROLE_SUFFIX;
    }

    function loadPrefsIfNeeded() {
        const sfx = getStorageSuffix();
        if (loadedStorageSuffix === sfx) return;
        const hadPrev = loadedStorageSuffix !== null;
        loadedStorageSuffix = sfx;
        try {
            if (!userTouched.enabled) {
                const v = localStorage.getItem('vtt_dice3d_enabled' + sfx);
                enabledState = (v !== '0');
            }
            if (!userTouched.sound) {
                const v = localStorage.getItem('vtt_dice3d_sound' + sfx);
                soundState = (v !== '0');
            }
            if (!userTouched.color) {
                const v = localStorage.getItem('vtt_dice3d_color' + sfx);
                colorState = v ? normalizeHex(v) : DEFAULT_COLOR;
            }
        } catch (e) {}
        if (hadPrev) syncControlsUI();
    }

    function isEnabled() {
        loadPrefsIfNeeded();
        return enabledState;
    }
    function setEnabled(val) {
        const on = !!val;
        enabledState = on;
        userTouched.enabled = true;
        try { localStorage.setItem('vtt_dice3d_enabled' + getStorageSuffix(), on ? '1' : '0'); } catch (e) {}
        if (!on) stopAllImmediate();
        syncControlsUI();
    }

    function isSoundEnabled() {
        loadPrefsIfNeeded();
        return soundState;
    }
    function setSoundEnabled(val) {
        const on = !!val;
        soundState = on;
        userTouched.sound = true;
        try { localStorage.setItem('vtt_dice3d_sound' + getStorageSuffix(), on ? '1' : '0'); } catch (e) {}
        syncControlsUI();
    }

    function getColor() {
        loadPrefsIfNeeded();
        return colorState;
    }
    function setColor(hex) {
        const norm = normalizeHex(hex);
        colorState = norm;
        userTouched.color = true;
        try { localStorage.setItem('vtt_dice3d_color' + getStorageSuffix(), norm); } catch (e) {}
        syncControlsUI();
        return norm;
    }

    // ---------------- Stato Overlay & Motore 3D ----------------
    let canvas = null;
    let ctx = null;
    let bannerEl = null;
    let bannerTimer = null;
    let idleCleanupTimer = null;
    let activeDice = [];
    let rafId = null;
    let lastTick = 0;
    let totalLaunches = 0;
    let lastLaunchCount = 0;
    let lastSummaryText = '';
    const seenRollIds = new Set();

    function getHostContainer() {
        return document.getElementById('main-canvas-container') || document.body;
    }

    function ensureOverlay() {
        const host = getHostContainer();
        if (!host) return false;
        if (!canvas || !canvas.isConnected) {
            canvas = document.getElementById('dice3d-canvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.id = 'dice3d-canvas';
                canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:25;display:none;';
                host.appendChild(canvas);
            }
            ctx = canvas.getContext('2d');
        }
        if (!bannerEl || !bannerEl.isConnected) {
            bannerEl = document.getElementById('dice3d-banner');
            if (!bannerEl) {
                bannerEl = document.createElement('div');
                bannerEl.id = 'dice3d-banner';
                bannerEl.style.cssText = [
                    'position:absolute', 'bottom:16px', 'left:50%', 'transform:translateX(-50%)',
                    'pointer-events:none', 'z-index:26', 'display:none',
                    'background:rgba(13,17,23,0.9)', 'border:1px solid #3b4254',
                    'padding:6px 14px', 'border-radius:999px', 'font-size:12px', 'font-weight:700',
                    'color:#f8fafc', 'white-space:nowrap', 'max-width:90%', 'overflow:hidden',
                    'text-overflow:ellipsis', 'box-shadow:0 8px 24px rgba(0,0,0,0.6)',
                    'transition:opacity 0.2s ease', 'font-family:sans-serif'
                ].join(';');
                host.appendChild(bannerEl);
            }
        }
        return !!(canvas && ctx);
    }

    function resizeCanvas() {
        if (!ensureOverlay()) return;
        const host = getHostContainer();
        const w = host.clientWidth || window.innerWidth || 800;
        const h = host.clientHeight || window.innerHeight || 600;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function stopAllImmediate() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        if (bannerTimer) {
            clearTimeout(bannerTimer);
            bannerTimer = null;
        }
        if (idleCleanupTimer) {
            clearTimeout(idleCleanupTimer);
            idleCleanupTimer = null;
        }
        activeDice = [];
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
        }
        if (bannerEl) {
            bannerEl.style.display = 'none';
            bannerEl.style.opacity = '0';
        }
    }

    function drawDie3D(d, cx, cy, groundY, heightPx, q, alpha, settled) {
        ctx.save();
        ctx.globalAlpha = alpha;

        // Ombra morbida dinamica sul tavolo
        const shadowScale = Math.max(0.55, 1 - heightPx / 120);
        ctx.fillStyle = `rgba(0, 0, 0, ${(0.45 * shadowScale).toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(
            cx + heightPx * 0.25,
            groundY + 14,
            d.sizePx * 0.95 * shadowScale,
            d.sizePx * 0.45 * shadowScale,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Alone di evidenziazione (Nat 20, Nat 1, Vantaggio/Svantaggio scelto) a dado fermo
        if (settled && d.ringColor) {
            ctx.strokeStyle = d.ringColor;
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.arc(cx, cy, d.sizePx * 1.18, 0, Math.PI * 2);
            ctx.stroke();
        }

        const scale = d.sizePx * (1 + heightPx / 260);
        const fov = 4.2;
        const rotVerts = d.shape.verts.map(v => qRotateVec(q, v));
        const projVerts = rotVerts.map(v => {
            const k = fov / (fov - v[2]);
            return [cx + v[0] * scale * k, cy - v[1] * scale * k, v[2]];
        });

        const visibleFaces = [];
        for (let i = 0; i < d.shape.faces.length; i++) {
            const f = d.shape.faces[i];
            const wn = qRotateVec(q, f.normal);
            if (wn[2] <= -0.08) continue;
            const wc = qRotateVec(q, f.center);
            visibleFaces.push({ idx: i, f, wn, z: wc[2] });
        }
        visibleFaces.sort((a, b) => a.z - b.z);

        const ink = contrastInk(d.rgb);
        const borderCol = (d.rgb[0] + d.rgb[1] + d.rgb[2] < 130)
            ? 'rgba(255,255,255,0.28)'
            : 'rgba(10,14,22,0.55)';

        for (const vf of visibleFaces) {
            const pts = vf.f.indices.map(vi => projVerts[vi]);
            const light = Math.max(0.42, Math.min(1.22, 0.58 + 0.55 * vDot(vf.wn, LIGHT_DIR)));

            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let p = 1; p < pts.length; p++) ctx.lineTo(pts[p][0], pts[p][1]);
            ctx.closePath();
            ctx.fillStyle = shadeColor(d.rgb, light);
            ctx.fill();
            ctx.strokeStyle = borderCol;
            ctx.lineWidth = 1.25;
            ctx.lineJoin = 'round';
            ctx.stroke();

            if (vf.wn[2] > 0.25) {
                let tx = 0, ty = 0;
                pts.forEach(p => { tx += p[0]; ty += p[1]; });
                tx /= pts.length; ty /= pts.length;

                const labelStr = d.meshSides === 4 ? String(d.value) : (d.labels[vf.idx] || '');
                if (d.meshSides === 4 && vf.f.indices.includes(0)) {
                    const apex = projVerts[0];
                    tx = tx * 0.55 + apex[0] * 0.45;
                    ty = ty * 0.55 + apex[1] * 0.45;
                }

                const len = labelStr.length;
                const baseFactor = d.meshSides >= 20 ? 0.34 : (d.meshSides === 10 || d.meshSides === 100 || d.meshSides === 12 ? 0.38 : 0.46);
                const fontSize = Math.round(scale * baseFactor * (len >= 3 ? 0.72 : (len === 2 ? 0.88 : 1)));

                ctx.save();
                ctx.translate(tx, ty);
                const upRot = qRotateVec(q, vf.f.up);
                if (settled && vf.idx === d.winIdx) {
                    ctx.rotate(0);
                } else {
                    ctx.rotate(Math.atan2(upRot[0], upRot[1]));
                }
                ctx.font = `900 ${fontSize}px "Segoe UI", Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.globalAlpha = alpha * Math.min(1, (vf.wn[2] - 0.2) * 1.45);
                ctx.fillStyle = (settled && vf.idx === d.winIdx && d.meshSides !== 4 && d.ringColor) ? d.ringColor : ink;
                ctx.fillText(labelStr, 0, 1);
                ctx.restore();
            }
        }

        ctx.restore();
    }

    function tick(now) {
        if (now - lastTick < 30) {
            rafId = requestAnimationFrame(tick);
            return;
        }
        lastTick = now;

        if (!ensureOverlay()) {
            stopAllImmediate();
            return;
        }
        const host = getHostContainer();
        const W = host.clientWidth || window.innerWidth || 800;
        const H = host.clientHeight || window.innerHeight || 600;
        ctx.clearRect(0, 0, W, H);

        let anyAlive = false;
        let maxRemainingAlpha = 0;

        for (let i = 0; i < activeDice.length; i++) {
            const d = activeDice[i];
            const elapsed = now - d.startTime;
            if (elapsed < 0) { anyAlive = true; continue; }

            const totalLife = d.duration + HOLD_MS + FADE_MS;
            if (elapsed >= totalLife) continue;
            anyAlive = true;

            const u = Math.min(1, elapsed / d.duration);
            const easeOut = 1 - Math.pow(1 - u, 3);
            const rem = 1 - easeOut;

            if (u > 0.42 && !d.bounced1) { d.bounced1 = true; playRollClack(0.65); }
            if (u > 0.75 && !d.bounced2) { d.bounced2 = true; playRollClack(0.35); }

            const posX = d.startX + (d.endX - d.startX) * easeOut;
            const posY = d.startY + (d.endY - d.startY) * easeOut;
            const bounceH = (u < 1) ? Math.abs(Math.sin(u * Math.PI * 2.5)) * (1 - u) * 56 : 0;

            const qSpin = qFromAxisAngle(d.spinAxis, d.spinTurns * rem);
            const qCur = (u >= 1) ? d.qTarget : qMul(qSpin, d.qTarget);

            let alpha = 1;
            if (elapsed > d.duration + HOLD_MS) {
                alpha = Math.max(0, 1 - (elapsed - d.duration - HOLD_MS) / FADE_MS);
            }
            if (alpha > maxRemainingAlpha) maxRemainingAlpha = alpha;

            drawDie3D(d, posX, posY - bounceH, posY, bounceH, qCur, alpha, u >= 1);
        }

        if (bannerEl && bannerEl.style.display === 'block' && maxRemainingAlpha < 1) {
            bannerEl.style.opacity = String(maxRemainingAlpha.toFixed(2));
        }

        if (anyAlive) {
            rafId = requestAnimationFrame(tick);
        } else {
            stopAllImmediate();
        }
    }

    function launch(items, summaryHtml) {
        if (!isEnabled() || !Array.isArray(items) || items.length === 0) return;
        if (!ensureOverlay()) return;
        resizeCanvas();
        canvas.style.display = 'block';

        const list = items.slice(0, MAX_VISUAL_DICE);
        totalLaunches += 1;
        lastLaunchCount = list.length;

        if (bannerEl) {
            if (bannerTimer) { clearTimeout(bannerTimer); bannerTimer = null; }
            if (summaryHtml) {
                bannerEl.innerHTML = summaryHtml;
                lastSummaryText = bannerEl.textContent || '';
                bannerEl.style.display = 'block';
                bannerEl.style.opacity = '0';
                bannerTimer = setTimeout(() => {
                    if (bannerEl && activeDice.length > 0) bannerEl.style.opacity = '1';
                }, 980);
            } else {
                lastSummaryText = '';
                bannerEl.style.display = 'none';
            }
        }

        const host = getHostContainer();
        const W = host.clientWidth || window.innerWidth || 800;
        const H = host.clientHeight || window.innerHeight || 600;
        const cols = Math.min(list.length, 6);
        const rows = Math.ceil(list.length / cols);
        const cellW = Math.min(92, Math.max(54, (W - 110) / Math.max(1, cols)));
        const cellH = Math.min(90, Math.max(54, (H - 130) / Math.max(1, rows)));
        const startGX = W * 0.5 - ((cols - 1) * cellW) / 2;
        const startGY = H * 0.5 - ((rows - 1) * cellH) / 2;

        const now = performance.now();
        const screenUp = vNorm([0, 0.92, -0.38]);

        activeDice = list.map((item, idx) => {
            const meshSides = mapSidesToMesh(item.sides);
            const shape = POLY[meshSides];
            const winIdx = 0;
            const face = shape.faces[winIdx];
            const labels = assignLabelsForShape(meshSides, item.value, winIdx);

            let qTarget;
            if (meshSides === 4) {
                qTarget = qFromTwoVecs(vNorm(shape.verts[0]), VIEW_DIR);
            } else {
                const q1 = qFromTwoVecs(face.normal, VIEW_DIR);
                const upAfter = qRotateVec(q1, face.up);
                const proj = vNorm(vSub(upAfter, vScale(VIEW_DIR, vDot(upAfter, VIEW_DIR))));
                qTarget = qMul(qFromTwoVecs(proj, screenUp), q1);
            }

            const c = idx % cols;
            const r = Math.floor(idx / cols);
            const endX = startGX + c * cellW + (Math.random() - 0.5) * 18;
            const endY = startGY + r * cellH + (Math.random() - 0.5) * 14;
            const fromLeft = idx % 2 === 0;
            const startX = fromLeft ? -45 : W + 45;
            const startY = H * (0.24 + Math.random() * 0.48);

            const spinAxis = vNorm([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
            const spinTurns = (3 + Math.floor(Math.random() * 3)) * Math.PI * 2;
            const sizePx = (meshSides === 20 || meshSides === 12) ? 31 : (meshSides === 4 ? 29 : 28);

            return {
                meshSides,
                shape,
                labels,
                winIdx,
                qTarget,
                value: item.value,
                rgb: parseHex(item.color || getColor()),
                ringColor: item.ringColor || null,
                startX, startY, endX, endY,
                spinAxis, spinTurns, sizePx,
                startTime: now + idx * 32,
                duration: 1000 + Math.random() * 240,
                bounced1: false,
                bounced2: false
            };
        });

        playRollClack(1.0);
        if (idleCleanupTimer) { clearTimeout(idleCleanupTimer); idleCleanupTimer = null; }
        const maxMs = activeDice.reduce((mx, d) => Math.max(mx, (d.startTime - now) + d.duration + HOLD_MS + FADE_MS), 0);
        idleCleanupTimer = setTimeout(() => {
            idleCleanupTimer = null;
            stopAllImmediate();
        }, Math.ceil(maxMs) + 120);
        if (!rafId) {
            lastTick = 0;
            rafId = requestAnimationFrame(tick);
        }
    }

    // ---------------- Adattatori per i tiri del VTT ----------------
    function markIdSeen(id) {
        if (!id) return true;
        if (seenRollIds.has(id)) return false;
        seenRollIds.add(id);
        if (seenRollIds.size > 200) {
            const first = seenRollIds.values().next().value;
            seenRollIds.delete(first);
        }
        return true;
    }

    function fmtBonus(b) {
        const n = Number(b) || 0;
        return n > 0 ? `+${n}` : (n < 0 ? `${n}` : '');
    }

    function buildBannerForStandard(data, diceColor) {
        const name = esc(data.sender || data.player || '');
        const expr = String(data.expression || '');
        const bonus = Number(data.bonus) || 0;
        const bStr = fmtBonus(bonus);
        const total = data.result !== undefined ? esc(data.result) : '';
        const dot = `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${esc(diceColor)};border:1px solid rgba(255,255,255,0.5);vertical-align:middle;margin-right:6px;"></span>`;

        if (data.mode === 'each' && Array.isArray(data.rolls) && data.rolls.length === 2 && /vantaggio|svantaggio|adv|dis/i.test(expr)) {
            const isDis = /svantaggio|dis/i.test(expr);
            const r1 = data.rolls[0].raw;
            const r2 = data.rolls[1].raw;
            const chosen = isDis ? Math.min(r1, r2) : Math.max(r1, r2);
            const finalVal = chosen + bonus;
            const accent = isDis ? '#fb7185' : '#38bdf8';
            const tag = isDis ? T('Svantaggio') : T('Vantaggio');
            return `${dot}${name ? name + ' · ' : ''}${esc(tag)} 2d20${esc(bStr)} → [${esc(r1)}, ${esc(r2)}] → <span style="color:${accent}">${esc(chosen)}${esc(bStr)} = ${esc(finalVal)}</span>`;
        }

        const countNote = (Array.isArray(data.rolls) && data.rolls.length > MAX_VISUAL_DICE)
            ? ` <span style="color:#94a3b8;font-weight:400;">(${MAX_VISUAL_DICE}/${data.rolls.length} visibili)</span>`
            : '';
        return `${dot}${name ? name + ' · ' : ''}${esc(expr)}${esc(bStr)} → <span style="color:#fbbf24">${total}</span>${countNote}`;
    }

    function onRollPayload(data) {
        if (!data || typeof data !== 'object') return;
        if (!markIdSeen(data.id)) return;
        if (!isEnabled()) return;

        // 1. Non Cedere al Sonno (4 pool colorati canonici)
        if (data.ncsRoll && data.ncsRoll.pools) {
            const p = data.ncsRoll.pools;
            const items = [];
            ['discipline', 'exhaustion', 'madness', 'pain'].forEach(k => {
                const arr = Array.isArray(p[k]) ? p[k] : [];
                arr.forEach(v => items.push({ sides: 6, value: Number(v) || 1, color: NCS_COLORS[k] }));
            });
            if (!items.length) return;
            const summary = `🌙 ${esc(data.sender || '')} · ${esc(data.result || '')}`;
            launch(items, summary);
            return;
        }

        // 2. 7th Sea Rischio (array d10 ricevuto in rete)
        if (Array.isArray(data.s7Dice) && data.s7Dice.length > 0) {
            const col = normalizeHex(data.diceColor || DEFAULT_COLOR);
            const items = data.s7Dice.map(v => ({ sides: 10, value: Number(v) || 1, color: col }));
            const dot = `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${esc(col)};border:1px solid rgba(255,255,255,0.5);vertical-align:middle;margin-right:6px;"></span>`;
            const summary = `${dot}⛵ ${esc(data.sender || 'Eroe')} · <span style="color:#34d399">${esc(data.result || '')}</span>`;
            launch(items, summary);
            return;
        }

        // 3. Dadi standard Core / 5e Scheda PG / 5e Compendio
        if (!Array.isArray(data.rolls) || data.rolls.length === 0) return;
        const col = normalizeHex(data.diceColor || getColor());
        const expr = String(data.expression || '');
        const isAdvDis = data.mode === 'each' && data.rolls.length === 2 && /vantaggio|svantaggio|adv|dis/i.test(expr);
        const isDis = isAdvDis && /svantaggio|dis/i.test(expr);
        const chosenRaw = isAdvDis
            ? (isDis ? Math.min(data.rolls[0].raw, data.rolls[1].raw) : Math.max(data.rolls[0].raw, data.rolls[1].raw))
            : null;

        const items = data.rolls.map(r => {
            const sides = parseInt(r.dice, 10) || 20;
            const raw = Number(r.raw) || 1;
            let ringColor = null;
            if (sides === 20 && raw === 20) ringColor = '#22c55e';
            else if (sides === 20 && raw === 1) ringColor = '#ef4444';
            else if (isAdvDis && raw === chosenRaw) ringColor = isDis ? '#fb7185' : '#38bdf8';
            return { sides, value: raw, color: col, ringColor };
        });

        launch(items, buildBannerForStandard(data, col));
    }

    function onSeventhSeaRoll(heroName, result, customColor, rollId) {
        if (!result || !Array.isArray(result.dice) || result.dice.length === 0) return;
        if (rollId && !markIdSeen(rollId)) return;
        if (!isEnabled()) return;
        const col = normalizeHex(customColor || getColor());
        const items = result.dice.map(v => ({ sides: 10, value: Number(v) || 1, color: col }));
        const dot = `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${esc(col)};border:1px solid rgba(255,255,255,0.5);vertical-align:middle;margin-right:6px;"></span>`;
        const raises = Number(result.totalRaises) || 0;
        const summary = `${dot}⛵ ${esc(heroName || 'Eroe')} · <span style="color:#34d399">✨ ${raises} ${esc(T('Incrementi'))}</span>`;
        launch(items, summary);
    }

    function isLocalOutgoingRoll(data) {
        try {
            const net = (typeof window.network !== 'undefined') ? window.network : null;
            if (!net || !net.myPeerId || !data.senderPeerId) return true;
            return data.senderPeerId === net.myPeerId;
        } catch (e) { return true; }
    }

    function wrapAppendRollToChat() {
        const orig = window.appendRollToChat;
        if (typeof orig !== 'function' || orig._vttDice3dWrapped) return;
        const wrapped = function (playerOrData, dice, bonus, result) {
            if (typeof playerOrData === 'object' && playerOrData !== null) {
                // Propaga il colore scelto dal giocatore prima che net.send() spedisca il payload
                if (!playerOrData.diceColor && isLocalOutgoingRoll(playerOrData)) {
                    playerOrData.diceColor = getColor();
                }
            }
            const ret = orig.apply(this, arguments);
            try {
                if (typeof playerOrData === 'object' && playerOrData !== null) {
                    onRollPayload(playerOrData);
                } else if (dice) {
                    const s = parseInt(dice, 10) || 20;
                    const b = Number(bonus) || 0;
                    const raw = Number(result) ? Math.max(1, Number(result) - b) : 1;
                    onRollPayload({
                        id: 'legacy_' + Date.now() + '_' + Math.random(),
                        sender: String(playerOrData || 'Giocatore'),
                        expression: `1d${s}`,
                        bonus: b,
                        result: result,
                        diceColor: getColor(),
                        rolls: [{ dice: s, raw }]
                    });
                }
            } catch (err) {
                console.warn('[Dice3D] Errore animazione tiro:', err);
            }
            return ret;
        };
        wrapped._vttDice3dWrapped = true;
        window.appendRollToChat = wrapped;
    }

    // ---------------- Collegamento UI nel Pannello Dadi ----------------
    function syncControlsUI() {
        const on = isEnabled();
        const snd = isSoundEnabled();
        const col = getColor();

        const cbOn = document.getElementById('dice3d-enabled');
        if (cbOn) cbOn.checked = on;

        const cbSnd = document.getElementById('dice3d-sound');
        if (cbSnd) cbSnd.checked = snd;

        const picker = document.getElementById('dice3d-color-picker');
        if (picker) picker.value = col;

        const colorRow = document.getElementById('dice3d-color-row');
        if (colorRow) {
            colorRow.style.opacity = on ? '1' : '0.45';
            colorRow.style.pointerEvents = on ? 'auto' : 'none';
        }

        document.querySelectorAll('.dice3d-swatch').forEach(btn => {
            const match = normalizeHex(btn.dataset.color) === col;
            btn.style.outline = match ? '2px solid #fbbf24' : 'none';
            btn.style.outlineOffset = match ? '1px' : '0';
            btn.style.transform = match ? 'scale(1.15)' : 'scale(1)';
        });
    }

    function bindPanelUI() {
        const cbOn = document.getElementById('dice3d-enabled');
        if (cbOn && !cbOn.dataset.bound3d) {
            cbOn.dataset.bound3d = '1';
            cbOn.addEventListener('change', () => setEnabled(cbOn.checked));
        }

        const cbSnd = document.getElementById('dice3d-sound');
        if (cbSnd && !cbSnd.dataset.bound3d) {
            cbSnd.dataset.bound3d = '1';
            cbSnd.addEventListener('change', () => setSoundEnabled(cbSnd.checked));
        }

        const picker = document.getElementById('dice3d-color-picker');
        if (picker && !picker.dataset.bound3d) {
            picker.dataset.bound3d = '1';
            picker.addEventListener('input', () => setColor(picker.value));
        }

        document.querySelectorAll('.dice3d-swatch').forEach(btn => {
            if (btn.dataset.bound3d) return;
            btn.dataset.bound3d = '1';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                setColor(btn.dataset.color);
            });
        });

        const toggleBtn = document.getElementById('pbtn-dice') || document.getElementById('btn-toggle-dice');
        if (toggleBtn && !toggleBtn.dataset.bound3dSync) {
            toggleBtn.dataset.bound3dSync = '1';
            toggleBtn.addEventListener('click', () => {
                loadPrefsIfNeeded();
                syncControlsUI();
            });
        }

        syncControlsUI();
    }

    function init() {
        ensureOverlay();
        wrapAppendRollToChat();
        bindPanelUI();
        window.addEventListener('resize', () => {
            if (activeDice.length > 0) resizeCanvas();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.vttDice3d = {
        PRESET_COLORS,
        isEnabled,
        setEnabled,
        isSoundEnabled,
        setSoundEnabled,
        getColor,
        setColor,
        launch,
        stop: stopAllImmediate,
        onRollPayload,
        onSeventhSeaRoll,
        bindPanelUI,
        getStats: () => ({
            enabled: isEnabled(),
            sound: isSoundEnabled(),
            color: getColor(),
            activeCount: activeDice.length,
            running: !!rafId,
            totalLaunches,
            lastLaunchCount,
            lastSummaryText
        })
    };
})();
