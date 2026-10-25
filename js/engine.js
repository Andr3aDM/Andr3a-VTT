
Math.easeOutQuad = function (t) {
    return t * (2 - t);
};
class VTTEngine {
    constructor(containerId, isDM = false) {
        this.container = document.getElementById(containerId);
        this.isDM = isDM;
        
        this.workspace = document.createElement('div');
        this.workspace.style.position = 'absolute';
        this.workspace.style.top = '0';
        this.workspace.style.left = '0';
        this.workspace.style.transformOrigin = '0 0';
        this.container.appendChild(this.workspace);

        this.layers = {
            bg: this.createCanvas('bg-layer', 0),
            grid: this.createCanvas('grid-layer', 1),
            drawPublic: this.createCanvas('draw-public-layer', 2),
            drawPrivate: this.createCanvas('draw-private-layer', 3),
            tokens: this.createCanvas('tokens-layer', 4),
            tokenEffects: this.createCanvas('token-effects-layer', 5),
            fog: this.createCanvas('fog-layer', 6)
        };

        if (this.isDM) {
            this.layers.fog.style.opacity = '0.55';
        }

        this.layers.ui = document.createElement('canvas');
        this.layers.ui.id = 'ui-layer';
        this.layers.ui.style.position = 'absolute';
        this.layers.ui.style.zIndex = 7;
        this.layers.ui.style.top = '0';
        this.layers.ui.style.left = '0';
        this.container.appendChild(this.layers.ui);

        this.ctx = {
            bg: this.layers.bg.getContext('2d'),
            grid: this.layers.grid.getContext('2d'),
            drawPublic: this.layers.drawPublic.getContext('2d'),
            drawPrivate: this.layers.drawPrivate.getContext('2d'),
            tokens: this.layers.tokens.getContext('2d'),
            tokenEffects: this.layers.tokenEffects.getContext('2d'),
            fog: this.layers.fog.getContext('2d'),
            ui: this.layers.ui.getContext('2d')
        };

        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;

        this.mapImage = null;
        this.grid = { size: 100, color: '#000000', glow: 'none', offsetX: 0, offsetY: 0 };
        
        this.tokens = [];
        this.pings = [];
        this.notes = [];
        this.shapes = []; // AoE shapes
        this.publicStrokes = [];
        this.privateStrokes = [];
        this.ruler = null;
        this.initiative = null;
        this.selectedTokenId = null;
        this.selectedTokens = new Set();
        this.lasso = null;
        this.selectedShapeId = null;
        this._tokenLayerRenderPending = false;

        window.addEventListener('resize', () => this.resizeUI());
        this.resizeUI();
    }

    createCanvas(id, zIndex) {
        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.style.position = 'absolute';
        canvas.style.zIndex = zIndex;
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        this.workspace.appendChild(canvas);
        return canvas;
    }

    resizeUI() {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        this.layers.ui.width = w;
        this.layers.ui.height = h;
        this.renderUI();
    }

    setMap(img) {
        this.mapImage = img;
        const w = img.width;
        const h = img.height;
        
        for (const key in this.layers) {
            if (key === 'ui') continue;
            if (!this.isDM && key === 'drawPrivate') {
                this.layers[key].width = 1;
                this.layers[key].height = 1;
                continue;
            }
            this.layers[key].width = w;
            this.layers[key].height = h;
        }
        
        this._bgDrawn = false;
        this._lastGridSig = null;

        this.fitToScreen();
        if (this.pendingFogImage) {
            this.applyFogImage(this.pendingFogImage);
            this.pendingFogImage = null;
        } else if (!this.isDM && this._lastAppliedFogBase64) {
            this.applyFogImage(this._lastAppliedFogBase64);
        } else {
            this.resetFog();
        }
        this.renderAll();
    }

    fitToScreen() {
        if (!this.mapImage) return;
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        
        this.scale = Math.max(w / this.mapImage.width, h / this.mapImage.height);
        this.offsetX = (w - (this.mapImage.width * this.scale)) / 2;
        this.offsetY = (h - (this.mapImage.height * this.scale)) / 2;
        this.updateWorkspaceTransform();
    }

    updateWorkspaceTransform() {
        this.workspace.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
    }

    renderViewport() {
        if (!this.mapImage) return;
        this.updateWorkspaceTransform();
        this.renderUI();
    }

    renderTokensLayer() {
        this._tokenLayerRenderPending = false;
        if (!this.mapImage) return;
        const w = this.mapImage.width;
        const h = this.mapImage.height;
        if (w > 0 && h > 0) {
            this.ctx.tokens.clearRect(0, 0, w, h);
            this.renderShapes();
            this.renderTokens();
            this.renderShapeHandles();
            this.updateTokensInShapes();
        }
        this.renderUI();
    }

    requestTokenLayerRender() {
        if (this._tokenLayerRenderPending) return;
        this._tokenLayerRenderPending = true;
        requestAnimationFrame(() => {
            this._tokenLayerRenderPending = false;
            this.renderTokensLayer();
        });
    }

    renderAll() {
        if (!this.mapImage) return;
        this.updateWorkspaceTransform();
        const w = this.mapImage.width;
        const h = this.mapImage.height;
        if (w === 0 || h === 0) return;

        // Disegna la mappa statica solo quando cambia
        if (!this._bgDrawn) {
            this.ctx.bg.clearRect(0, 0, w, h);
            this.ctx.bg.drawImage(this.mapImage, 0, 0);
            this._bgDrawn = true;
        }

        // Ridisegna la griglia solo se i parametri griglia sono cambiati
        const gridSig = `${this.grid.size}_${this.grid.color}_${this.grid.glow}_${this.grid.offsetX || 0}_${this.grid.offsetY || 0}_${w}_${h}`;
        if (this._lastGridSig !== gridSig) {
            this.ctx.grid.clearRect(0, 0, w, h);
            this.renderGrid();
            this._lastGridSig = gridSig;
        }

        this.ctx.tokens.clearRect(0, 0, w, h);
        this.ctx.drawPublic.clearRect(0, 0, w, h);
        this.ctx.drawPrivate.clearRect(0, 0, w, h);

        this.renderDrawings();
        this.renderShapes(); // Draw AoE before tokens
        this.renderTokens();
        this.renderShapeHandles(); // Draw handles/badges in foreground over tokens
        this.updateTokensInShapes();
        this.renderUI();
    }

    clearAll() {
        const w = this.mapImage ? this.mapImage.width : 0;
        const h = this.mapImage ? this.mapImage.height : 0;
        if(w === 0) return;

        this.ctx.grid.clearRect(0, 0, w, h);
        this.ctx.tokens.clearRect(0, 0, w, h);
        if (this.ctx.tokenEffects) this.ctx.tokenEffects.clearRect(0, 0, w, h);
        this.ctx.drawPublic.clearRect(0, 0, w, h);
        this.ctx.drawPrivate.clearRect(0, 0, w, h);
    }

    renderGrid() {
        const ctx = this.ctx.grid;
        if (this.grid.size <= 0) return;
        
        ctx.strokeStyle = this.grid.color;
        ctx.lineWidth = 1;

        if (this.grid.glow !== 'none') {
            ctx.shadowColor = this.grid.glow === 'white' ? 'white' : 'black';
            ctx.shadowBlur = 4;
        } else {
            ctx.shadowColor = 'transparent';
        }

        ctx.beginPath();
        
        const offsetX = this.grid.offsetX || 0;
        const offsetY = this.grid.offsetY || 0;
        
        let startX = offsetX % this.grid.size;
        if (startX > 0) startX -= this.grid.size;

        for (let x = startX; x <= this.mapImage.width; x += this.grid.size) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.mapImage.height);
        }
        
        let startY = offsetY % this.grid.size;
        if (startY > 0) startY -= this.grid.size;

        for (let y = startY; y <= this.mapImage.height; y += this.grid.size) {
            ctx.moveTo(0, y);
            ctx.lineTo(this.mapImage.width, y);
        }
        ctx.stroke();
    }

    renderShapes() {
        const ctx = this.ctx.tokens; 
        this.shapes.forEach(shape => {
            if (!this.isDM && !shape.visible) return;

            const pixelsPerFoot = this.grid.size / 5;
            const sizePx = Math.max(0.1, shape.sizeFt * pixelsPerFoot);
            
            ctx.save();
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.angle * Math.PI / 180);
            
            ctx.fillStyle = shape.color + '66'; // semi-transparent
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 2;

            ctx.beginPath();
            if (shape.type === 'circle') {
                ctx.arc(0, 0, sizePx, 0, Math.PI * 2);
            } else if (shape.type === 'cone') {
                const halfAngle = Math.atan(0.5); 
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, sizePx, -halfAngle, halfAngle, false);
                ctx.closePath();
            } else if (shape.type === 'line') {
                const widthFt = shape.widthFt || 5;
                const halfWidth = (widthFt / 2) * pixelsPerFoot;
                ctx.rect(0, -halfWidth, sizePx, halfWidth * 2);
            } else if (shape.type === 'square') {
                ctx.rect(-sizePx/2, -sizePx/2, sizePx, sizePx);
            }
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });
    }

    renderShapeHandles() {
        const ctx = this.ctx.tokens;
        if (!this.shapes || this.shapes.length === 0) return;

        this.shapes.forEach(shape => {
            if (!this.isDM && !shape.visible) return;

            const isMyShape = shape.owner && shape.owner === this.localPlayerName;
            const canControl = this.isDM || isMyShape;
            const isSelected = this.isDM ? (this.selectedShapeId === shape.id) : (window.editingPlayerShape && window.editingPlayerShape.id === shape.id);
            const hasTimer = shape.durationRounds !== undefined && shape.durationRounds !== null && Number(shape.durationRounds) > 0;
            const roundsLeft = shape.roundsLeft !== undefined ? shape.roundsLeft : shape.durationRounds;

            // Se ha il timer: visibile a tutti (DM e Players)!
            // Se permanente: visibile solo se canControl (DM o proprietario) per mantenere la mappa pulita per gli altri player
            if (!hasTimer && !canControl) return;

            ctx.save();
            ctx.translate(shape.x, shape.y);

            if (hasTimer) {
                // Pillola compatta tipo badge condizioni: ⏳ 3
                const text = `⏳ ${roundsLeft}`;
                ctx.font = 'bold 11px sans-serif';
                const textMetrics = ctx.measureText(text);
                const padX = 6;
                const pillH = 18;
                const pillW = Math.max(30, Math.round(textMetrics.width + padX * 2));
                const rx = -pillW / 2;
                const ry = -pillH / 2;
                const pillRadius = Math.round(pillH / 2);

                // 1. Ombra esterna per stacco netto sopra qualsiasi token
                ctx.save();
                ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                ctx.shadowBlur = 5;
                ctx.shadowOffsetY = 1;

                // 2. Sfondo scuro compatto
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(rx, ry, pillW, pillH, pillRadius);
                } else {
                    ctx.rect(rx, ry, pillW, pillH);
                }
                ctx.fillStyle = isSelected ? '#003747' : '#141414';
                ctx.fill();
                ctx.restore();

                // 3. Bordo vivo con colore sagoma (o ciano evidenziato se selezionata)
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(rx, ry, pillW, pillH, pillRadius);
                } else {
                    ctx.rect(rx, ry, pillW, pillH);
                }
                ctx.strokeStyle = isSelected ? '#00ffff' : (shape.color || '#ff5722');
                ctx.lineWidth = isSelected ? 2 : 1.5;
                ctx.stroke();

                // 4. Testo centrato nitido
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 0, 1);

                // 5. Se controllabile, piccolo indicatore di rotazione
                if (canControl) {
                    ctx.rotate(shape.angle * Math.PI / 180);
                    ctx.fillStyle = isSelected ? '#00ffff' : '#ffffff';
                    ctx.fillRect(pillW / 2 + 1, -1.5, 6, 3);
                }
            } else if (canControl) {
                // Sagoma PERMANENTE: classico bottone circolare con tacca di rotazione
                // Disegnato in primo piano sopra i token!
                ctx.save();
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, Math.PI * 2);
                ctx.fillStyle = isSelected ? '#00ffff' : '#ffffff';
                ctx.fill();
                ctx.restore();

                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.rotate(shape.angle * Math.PI / 180);
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, -2, 14, 4);
            }

            ctx.restore();
        });
    }

    hexToRgba(hexOrColor, alpha = 1) {
        if (!hexOrColor) return `rgba(255, 87, 34, ${alpha})`;
        if (hexOrColor.startsWith('rgba')) {
            return hexOrColor.replace(/[\d\.]+\)$/, `${alpha})`);
        }
        if (hexOrColor.startsWith('rgb')) {
            return hexOrColor.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        }
        let c = hexOrColor.replace('#', '').trim();
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        if (c.length >= 6) {
            const num = parseInt(c.slice(0, 6), 16);
            if (!isNaN(num)) {
                const r = (num >> 16) & 255;
                const g = (num >> 8) & 255;
                const b = num & 255;
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
        }
        return `rgba(255, 87, 34, ${alpha})`;
    }

    isTokenInShape(token, shape, pixelsPerFoot) {
        if (!token || !shape) return false;
        const sizePx = (shape.sizeFt || 15) * pixelsPerFoot;
        
        // 1. Cerchio / Sfera
        if (shape.type === 'circle') {
            const cx = Math.max(token.x, Math.min(shape.x, token.x + token.width));
            const cy = Math.max(token.y, Math.min(shape.y, token.y + token.height));
            return ((shape.x - cx) ** 2 + (shape.y - cy) ** 2) <= sizePx * sizePx;
        }
        
        // 2. Quadrato (Cubo) / Linea (Rettangolo Orientato)
        if (shape.type === 'square' || shape.type === 'line') {
            const isLine = shape.type === 'line';
            const halfWidth = isLine ? (((shape.widthFt || 5) / 2) * pixelsPerFoot) : (sizePx / 2);
            const minL_X = isLine ? 0 : -sizePx / 2;
            const maxL_X = isLine ? sizePx : sizePx / 2;
            const minL_Y = -halfWidth;
            const maxL_Y = halfWidth;
            
            const shapeAngle = shape.angle || 0;
            const rad = -shapeAngle * Math.PI / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            
            const toLocal = (px, py) => {
                const dx = px - shape.x;
                const dy = py - shape.y;
                return { x: dx * cos - dy * sin, y: dx * sin + dy * cos };
            };
            
            const c1 = toLocal(token.x, token.y);
            const c2 = toLocal(token.x + token.width, token.y);
            const c3 = toLocal(token.x + token.width, token.y + token.height);
            const c4 = toLocal(token.x, token.y + token.height);
            
            const minLX = Math.min(c1.x, c2.x, c3.x, c4.x);
            const maxLX = Math.max(c1.x, c2.x, c3.x, c4.x);
            if (maxLX < minL_X || minLX > maxL_X) return false;
            
            const minLY = Math.min(c1.y, c2.y, c3.y, c4.y);
            const maxLY = Math.max(c1.y, c2.y, c3.y, c4.y);
            if (maxLY < minL_Y || minLY > maxL_Y) return false;
            
            // Verifica separazione sugli assi del mondo
            const wrad = shapeAngle * Math.PI / 180;
            const wcos = Math.cos(wrad);
            const wsin = Math.sin(wrad);
            const toWorld = (lx, ly) => ({
                x: shape.x + lx * wcos - ly * wsin,
                y: shape.y + lx * wsin + ly * wcos
            });
            
            const sc1 = toWorld(minL_X, minL_Y);
            const sc2 = toWorld(maxL_X, minL_Y);
            const sc3 = toWorld(maxL_X, maxL_Y);
            const sc4 = toWorld(minL_X, maxL_Y);
            
            const minWX = Math.min(sc1.x, sc2.x, sc3.x, sc4.x);
            const maxWX = Math.max(sc1.x, sc2.x, sc3.x, sc4.x);
            if (maxWX < token.x || minWX > token.x + token.width) return false;
            
            const minWY = Math.min(sc1.y, sc2.y, sc3.y, sc4.y);
            const maxWY = Math.max(sc1.y, sc2.y, sc3.y, sc4.y);
            if (maxWY < token.y || minWY > token.y + token.height) return false;
            
            return true;
        }
        
        // 3. Cono
        if (shape.type === 'cone') {
            const cx = Math.max(token.x, Math.min(shape.x, token.x + token.width));
            const cy = Math.max(token.y, Math.min(shape.y, token.y + token.height));
            if ((shape.x - cx)**2 + (shape.y - cy)**2 > sizePx * sizePx) return false;
            
            if (shape.x >= token.x && shape.x <= token.x + token.width && shape.y >= token.y && shape.y <= token.y + token.height) return true;
            
            const shapeAngleRad = (shape.angle || 0) * Math.PI / 180;
            const halfAngle = Math.atan(0.5);
            
            const testPoints = [
                { x: token.x, y: token.y },
                { x: token.x + token.width, y: token.y },
                { x: token.x + token.width, y: token.y + token.height },
                { x: token.x, y: token.y + token.height },
                { x: token.x + token.width / 2, y: token.y + token.height / 2 },
                { x: token.x + token.width / 2, y: token.y },
                { x: token.x + token.width / 2, y: token.y + token.height },
                { x: token.x, y: token.y + token.height / 2 },
                { x: token.x + token.width, y: token.y + token.height / 2 }
            ];
            
            for (let i = 0; i < testPoints.length; i++) {
                const pt = testPoints[i];
                const dSq = (pt.x - shape.x)**2 + (pt.y - shape.y)**2;
                if (dSq <= sizePx * sizePx) {
                    const a = Math.atan2(pt.y - shape.y, pt.x - shape.x);
                    let diff = (a - shapeAngleRad + Math.PI * 3) % (Math.PI * 2) - Math.PI;
                    if (Math.abs(diff) <= halfAngle) return true;
                }
            }
            
            function segIntersectsBox(x0, y0, x1, y1, minX, minY, maxX, maxY) {
                let dx = x1 - x0, dy = y1 - y0;
                let p = [-dx, dx, -dy, dy];
                let q = [x0 - minX, maxX - x0, y0 - minY, maxY - y0];
                let u1 = 0, u2 = 1;
                for (let i = 0; i < 4; i++) {
                    if (p[i] === 0) {
                        if (q[i] < 0) return false;
                    } else {
                        let t = q[i] / p[i];
                        if (p[i] < 0) { if (t > u2) return false; if (t > u1) u1 = t; }
                        else { if (t < u1) return false; if (t < u2) u2 = t; }
                    }
                }
                return true;
            }
            
            const a1 = shapeAngleRad - halfAngle;
            const a2 = shapeAngleRad + halfAngle;
            if (segIntersectsBox(shape.x, shape.y, shape.x + Math.cos(a1) * sizePx, shape.y + Math.sin(a1) * sizePx, token.x, token.y, token.x + token.width, token.y + token.height)) return true;
            if (segIntersectsBox(shape.x, shape.y, shape.x + Math.cos(a2) * sizePx, shape.y + Math.sin(a2) * sizePx, token.x, token.y, token.x + token.width, token.y + token.height)) return true;
            
            return false;
        }
        
        return false;
    }

    updateTokensInShapes() {
        if (!this.tokens || this.tokens.length === 0) {
            if (this._tokensWithAoE && this._tokensWithAoE.size > 0) {
                this._tokensWithAoE.clear();
            }
            return;
        }
        
        if (!this._tokensWithAoE) {
            this._tokensWithAoE = new Map();
        } else {
            this._tokensWithAoE.clear();
        }
        
        const pixelsPerFoot = (this.grid && this.grid.size ? this.grid.size : 50) / 5;
        
        const activeShapes = (this.shapes || []).filter(s => {
            if (!this.isDM && !s.visible) return false;
            return s.highlightTokens !== false;
        });

        const activeTokenAuras = this.tokens.filter(t => {
            if (!this.isDM && !t.visible) return false;
            return t.aura && t.aura.active && t.aura.sizePx > 0 && t.aura.highlightTokens !== false;
        });
        
        if (activeShapes.length === 0 && activeTokenAuras.length === 0) return;
        
        const precomputedAuras = [];
        for (let i = 0; i < activeTokenAuras.length; i++) {
            const st = activeTokenAuras[i];
            const size = st.width || (this.grid ? this.grid.size : 50);
            precomputedAuras.push({
                id: st.id,
                cx: st.x + size / 2,
                cy: st.y + size / 2,
                radiusSq: st.aura.sizePx * st.aura.sizePx,
                color: st.aura.color || '#ffff00'
            });
        }
        
        this.tokens.forEach(token => {
            if (!this.isDM && !token.visible) return;
            const colors = [];

            // 1. Sagome AoE sulla mappa
            activeShapes.forEach(shape => {
                if (this.isTokenInShape(token, shape, pixelsPerFoot)) {
                    colors.push(shape.color || '#ff5722');
                }
            });

            // 2. Aure mobili emanate da altri token
            for (let i = 0; i < precomputedAuras.length; i++) {
                const pa = precomputedAuras[i];
                if (pa.id === token.id) continue;
                const cx = Math.max(token.x, Math.min(pa.cx, token.x + token.width));
                const cy = Math.max(token.y, Math.min(pa.cy, token.y + token.height));
                const dx = pa.cx - cx;
                const dy = pa.cy - cy;
                if ((dx * dx + dy * dy) <= pa.radiusSq) {
                    colors.push(pa.color);
                }
            }

            if (colors.length > 0) {
                this._tokensWithAoE.set(token.id, colors);
            }
        });
    }

    renderTokens() {
        const ctx = this.ctx.tokens;
        
        // Draw Auras first so they are under tokens
        this.tokens.forEach(token => {
            if (!this.isDM && !token.visible) return;
            
            const px = token.x;
            const py = token.y;
            const sizePx = token.width;
            
            if (token.aura && token.aura.active && token.aura.sizePx > 0) {
                const auraRadius = token.aura.sizePx;
                ctx.beginPath();
                ctx.arc(px + sizePx/2, py + sizePx/2, auraRadius, 0, Math.PI * 2);
                ctx.fillStyle = token.aura.color + '33'; // 20% opacity
                ctx.fill();
                ctx.strokeStyle = token.aura.color;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });

        // Draw Tokens
        this.tokens.forEach(token => {
            if (!this.isDM && !token.visible) return;

            if (token.imageObj) {
                if (this.isDM && !token.visible) {
                    ctx.globalAlpha = 0.5;
                } else {
                    ctx.globalAlpha = 1.0;
                }
                ctx.drawImage(token.imageObj, token.x, token.y, token.width, token.height);
                ctx.globalAlpha = 1.0;
                
                // Draw Aura if enabled
                const style = this.hpDisplayStyle || 'bar';
                if (style === 'aura' || style === 'both') {
                    if (this.isDM || token.hpVisibleToPlayers !== false) {
                        if (token.hpMax && token.hpMax > 0 && token.hpCurrent !== undefined && token.hpCurrent !== null && token.hpCurrent > 0) {
                            const percent = Math.max(0, Math.min(1, token.hpCurrent / token.hpMax));
                            if (percent < 1.0) {
                                let barColor = '#4caf50';
                                if (percent <= 0.66 && percent > 0.33) barColor = '#ffeb3b';
                                else if (percent <= 0.33) barColor = '#f44336';
                                
                                if (!this.tintCanvas) {
                                    this.tintCanvas = document.createElement('canvas');
                                    this.tintCtx = this.tintCanvas.getContext('2d');
                                }
                                this.tintCanvas.width = token.width;
                                this.tintCanvas.height = token.height;
                                this.tintCtx.clearRect(0, 0, token.width, token.height);
                                this.tintCtx.drawImage(token.imageObj, 0, 0, token.width, token.height);
                                this.tintCtx.globalCompositeOperation = 'source-in';
                                this.tintCtx.fillStyle = barColor;
                                this.tintCtx.fillRect(0, 0, token.width, token.height);
                                
                                ctx.save();
                                ctx.globalAlpha = 0.35;
                                ctx.drawImage(this.tintCanvas, token.x, token.y);
                                ctx.restore();
                            }
                        }
                    }
                }
            }
// Teschio Morte (HP <= 0)
                if (token.hpCurrent !== undefined && token.hpCurrent !== null && token.hpCurrent !== "" && parseFloat(token.hpCurrent) <= 0) {
                    ctx.font = `bold ${token.width * 0.7}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#ff3333';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = Math.max(2, token.width * 0.05);
                    const skullX = token.x + token.width / 2;
                    const skullY = token.y + token.height / 2;
                    ctx.strokeText('💀', skullX, skullY);
                    ctx.fillText('💀', skullX, skullY);
                }
        });

        // Draw Overlays: Nome, Barra PV, e Condizioni in PRIMO PIANO
        this.tokens.forEach(token => {
            this.drawTokenOverlays(ctx, token);
        });
    }

    isPointInFog(worldX, worldY) {
        if (!this.mapImage || !this.layers.fog) return false;
        const x = Math.floor(worldX);
        const y = Math.floor(worldY);
        if (x < 0 || y < 0 || x >= this.layers.fog.width || y >= this.layers.fog.height) return false;
        try {
            const pixel = this.ctx.fog.getImageData(x, y, 1, 1).data;
            return pixel[3] > 25; // alpha > 10% coperto da nebbia
        } catch (e) {
            return false;
        }
    }

    renderTokenEffects() {
        if (!this.mapImage || !this.ctx.tokenEffects) return;
        const ctx = this.ctx.tokenEffects;
        ctx.clearRect(0, 0, this.layers.tokenEffects.width, this.layers.tokenEffects.height);

        let hasActiveInitiative = (this.initiative && this.initiative.active && this.initiative.participants.length > 0);
        let turnToken = null;
        if (hasActiveInitiative) {
            const currentParticipant = this.initiative.participants[this.initiative.currentTurnIndex];
            if (currentParticipant && currentParticipant.isToken && currentParticipant.tokenId) {
                const t = this.tokens.find(tok => tok.id === currentParticipant.tokenId);
                if (t && (this.isDM || t.visible)) {
                    turnToken = t;
                }
            }
        }

        const hasAoEHighlights = this._tokensWithAoE && this._tokensWithAoE.size > 0;
        if (!turnToken && !hasAoEHighlights) return;

        const now = Date.now();
        const pulse = (Math.sin(now / 200) + 1) / 2; // 0 to 1

        // Raccogli tutti i token che necessitano di anelli
        const tokensWithRings = new Set();
        if (turnToken) tokensWithRings.add(turnToken);
        if (hasAoEHighlights) {
            const tokenMap = new Map();
            for (let i = 0; i < this.tokens.length; i++) {
                tokenMap.set(this.tokens[i].id, this.tokens[i]);
            }
            this._tokensWithAoE.forEach((colors, tokenId) => {
                const tok = tokenMap.get(tokenId);
                if (tok && (this.isDM || tok.visible)) {
                    tokensWithRings.add(tok);
                }
            });
        }

        const useFastNeon = tokensWithRings.size > 8;

        tokensWithRings.forEach(token => {
            const cx = token.x + token.width / 2;
            const cy = token.y + token.height / 2;
            const R = token.width / 2;
            const isCurrentTurn = (turnToken && turnToken.id === token.id);
            const aoeColors = (this._tokensWithAoE && this._tokensWithAoE.get(token.id)) || null;

            // 1. AURA ESTERNA: AoE (se presente) - Subito dopo il token, raggio R + 4
            if (aoeColors && aoeColors.length > 0) {
                let aoeColor = aoeColors[0];
                if (aoeColors.length > 1) {
                    const cycleIndex = Math.floor((now / 200 - Math.PI * 1.5) / (2 * Math.PI));
                    const safeIndex = ((cycleIndex % aoeColors.length) + aoeColors.length) % aoeColors.length;
                    aoeColor = aoeColors[safeIndex];
                }
                const r_aoe = R + 4;
                ctx.save();

                // Livello 1: Sottile contorno scuro per contrasto su qualsiasi sfondo/mappa
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(cx, cy, r_aoe, 0, Math.PI * 2);
                ctx.stroke();

                if (useFastNeon) {
                    ctx.strokeStyle = this.hexToRgba(aoeColor, 0.35 * (0.75 + pulse * 0.25));
                    ctx.lineWidth = 9;
                    ctx.beginPath();
                    ctx.arc(cx, cy, r_aoe, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.strokeStyle = this.hexToRgba(aoeColor, 0.85);
                    ctx.lineWidth = 4.5;
                    ctx.beginPath();
                    ctx.arc(cx, cy, r_aoe, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    const aoeAlpha = 0.75 + pulse * 0.25;
                    ctx.strokeStyle = this.hexToRgba(aoeColor, aoeAlpha);
                    ctx.lineWidth = 4.5;
                    ctx.shadowColor = aoeColor;
                    ctx.shadowBlur = 10 + pulse * 6;
                    ctx.beginPath();
                    ctx.arc(cx, cy, r_aoe, 0, Math.PI * 2);
                    ctx.stroke();
                }

                if (!useFastNeon) {
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 4;
                }
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 + pulse * 0.25})`;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.arc(cx, cy, r_aoe, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            // 2. AURA INTERNA: Turno Iniziativa (se è il suo turno) - Leggermente interno al bordo, raggio R - 3
            if (isCurrentTurn) {
                const r_turn = Math.max(1, R - 3);
                ctx.save();

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(cx, cy, r_turn, 0, Math.PI * 2);
                ctx.stroke();

                if (useFastNeon) {
                    ctx.strokeStyle = `rgba(0, 255, 0, ${0.35 * (0.75 + pulse * 0.25)})`;
                    ctx.lineWidth = 7.5;
                    ctx.beginPath();
                    ctx.arc(cx, cy, r_turn, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.strokeStyle = `rgba(0, 255, 0, 0.85)`;
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.arc(cx, cy, r_turn, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    const turnAlpha = 0.75 + pulse * 0.25;
                    ctx.strokeStyle = `rgba(0, 255, 0, ${turnAlpha})`;
                    ctx.lineWidth = 3.5;
                    ctx.shadowColor = '#00ff00';
                    ctx.shadowBlur = 8 + pulse * 4;
                    ctx.beginPath();
                    ctx.arc(cx, cy, r_turn, 0, Math.PI * 2);
                    ctx.stroke();
                }

                if (!useFastNeon) {
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 3;
                }
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 + pulse * 0.3})`;
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.arc(cx, cy, r_turn, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            // 3. OVERLAYS IN PRIMO PIANO: Nome, Barra PV, Condizioni
            this.drawTokenOverlays(ctx, token);
        });
    }

    drawTokenOverlays(ctx, token) {
        if (!this.isDM && !token.visible) return;
        
        const px = token.x;
        const py = token.y;
        const sizePx = token.width;
            
            // 1. Targhetta con Nome (ALL'INTERNO del token, ZONA ALTA)
            const displayName = token.name || (token.originalName ? token.originalName.replace(/\.[^/.]+$/, "") : '');
            const nameVis = token.nameVisibility || 'all'; // 'all', 'dm', 'hidden'
            const canShowName = this.isDM ? (nameVis !== 'hidden') : (nameVis === 'all');

            if (canShowName && displayName) {
                ctx.save();
                
                const badgeH = 18;
                const badgeW = token.width - 4;
                const badgeX = token.x + 2;
                const badgeY = token.y + 2; // In cima, dentro al riquadro

                // Sfondo barra superiore
                const isDMOnly = (this.isDM && nameVis === 'dm');
                ctx.fillStyle = isDMOnly ? 'rgba(45, 15, 60, 0.88)' : 'rgba(0, 0, 0, 0.75)';

                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 3);
                } else {
                    ctx.rect(badgeX, badgeY, badgeW, badgeH);
                }
                ctx.fill();

                ctx.strokeStyle = isDMOnly ? '#ba68c8' : 'rgba(255, 255, 255, 0.25)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Calcolo dinamico dimensione testo per massima leggibilità
                let fontSize = 14;
                ctx.font = `bold ${fontSize}px Arial`;
                const maxTextW = badgeW - 6;
                while (ctx.measureText(displayName).width > maxTextW && fontSize > 9) {
                    fontSize--;
                    ctx.font = `bold ${fontSize}px Arial`;
                }

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Contorno nero marcato per renderlo chiarissimo
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3.5;
                ctx.strokeText(displayName, token.x + token.width / 2, badgeY + badgeH / 2 + 1);

                ctx.fillStyle = isDMOnly ? '#f3e5f5' : '#ffffff';
                ctx.fillText(displayName, token.x + token.width / 2, badgeY + badgeH / 2 + 1);
                ctx.restore();
            }

            // 2. Health Bar (ZONA BASSA)
            const hpStyle = this.hpDisplayStyle || 'bar';
            const showBar = this.isDM || hpStyle === 'bar' || hpStyle === 'both';
            
            if (showBar && token.hpMax && token.hpMax > 0) {
                if (this.isDM || token.hpVisibleToPlayers !== false) {
                    const hpMax = token.hpMax;
                    const hpCurr = token.hpCurrent || 0;
                    const percent = Math.max(0, Math.min(1, hpCurr / hpMax));
                    
                    let barColor = '#9e9e9e'; // Grigiastra (morto)
                    if (percent > 0) {
                        if (percent > 0.66) barColor = '#4caf50'; // Verde
                        else if (percent > 0.33) barColor = '#ffeb3b'; // Gialla
                        else barColor = '#f44336'; // Rossa
                    }
                    if (percent >= 1.0) barColor = '#00bcd4'; // Celeste
                    
                    const isDMBar = this.isDM;
                    const barHeight = isDMBar ? 16 : 10;
                    const barY = token.y + token.height - barHeight - 3;
                    
                    const text = `${hpCurr}/${hpMax}`;
                    const fontSize = Math.max(10, Math.min(12, Math.round(barHeight * 0.72)));
                    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                    const textW = ctx.measureText(text).width;
                    
                    // Capsula compatta ed agile: larghezza calibrata per ospitare comodamente gli HP
                    const desiredW = isDMBar ? Math.round(textW + 24) : Math.round(Math.min(token.width * 0.55, 60));
                    const maxBarW = Math.max(30, token.width - 8);
                    const barWidth = Math.min(Math.max(desiredW, isDMBar ? 50 : 36), maxBarW);
                    const barX = Math.round(token.x + (token.width - barWidth) / 2);
                    const barRadius = Math.round(barHeight / 2);
                    
                    ctx.save();
                    // 1. Sfondo scuro della capsula con leggera ombra
                    ctx.save();
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
                    ctx.shadowBlur = 4;
                    ctx.shadowOffsetY = 1;
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(barX, barY, barWidth, barHeight, barRadius);
                    } else {
                        ctx.rect(barX, barY, barWidth, barHeight);
                    }
                    ctx.fillStyle = 'rgba(18, 18, 18, 0.88)';
                    ctx.fill();
                    ctx.restore();
                    
                    // 2. Clip per il riempimento progressivo arrotondato ai bordi
                    ctx.save();
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(barX, barY, barWidth, barHeight, barRadius);
                    } else {
                        ctx.rect(barX, barY, barWidth, barHeight);
                    }
                    ctx.clip();
                    
                    if (this.isDM) {
                        const fillWidth = barWidth * percent;
                        if (fillWidth > 0) {
                            ctx.fillStyle = barColor;
                            ctx.fillRect(barX, barY, fillWidth, barHeight);
                        }
                    } else {
                        ctx.fillStyle = barColor;
                        ctx.fillRect(barX, barY, barWidth, barHeight);
                    }
                    ctx.restore();
                    
                    // 3. Bordo sottile di rifinitura per la capsula
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(barX, barY, barWidth, barHeight, barRadius);
                    } else {
                        ctx.rect(barX, barY, barWidth, barHeight);
                    }
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    
                    // 4. Testo HP centrato (DM View)
                    if (this.isDM) {
                        ctx.fillStyle = '#ffffff';
                        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = 2.5;
                        ctx.strokeText(text, token.x + token.width / 2, barY + barHeight / 2 + 0.5);
                        ctx.fillText(text, token.x + token.width / 2, barY + barHeight / 2 + 0.5);
                    }
                    ctx.restore();
                }
            }

            // 3. Draw Conditions IN PRIMO PIANO (sopra a nome e barra PV!)
            let rawConditions = [];
            if (token.conditions && token.conditions.length > 0) {
                rawConditions = token.conditions.slice();
            } else if (token.condition && token.condition.active) {
                rawConditions = [token.condition];
            }

            // Se il token ha un'Aura a tempo attiva, aggiungi il badge dell'Aura
            const hasAuraTimer = token.aura && token.aura.active && token.aura.durationRounds > 0;
            const auraRoundsLeft = hasAuraTimer ? (token.aura.roundsLeft !== undefined ? token.aura.roundsLeft : token.aura.durationRounds) : null;

            let activeConditions = rawConditions.slice();
            if (hasAuraTimer) {
                activeConditions.unshift({
                    text: `⏳ ${auraRoundsLeft}`,
                    color: token.aura.color || '#ffee58',
                    isAuraTimer: true
                });
            }
            
            if (activeConditions.length > 0) {
                const cx = px + sizePx/2;
                const cy = py + sizePx/2;
                const style = this.conditionDisplayStyle || 'concentric';
                const ringConditions = activeConditions.filter(c => !c.isAuraTimer);
                
                // A) Anelli Concentrici / Spicchi
                if ((style === 'concentric' || style === 'segmented') && ringConditions.length > 0) {
                    ctx.save();
                    ctx.translate(cx, cy);
                    
                    if (style === 'concentric') {
                        ringConditions.forEach((cond, index) => {
                            const condRadius = sizePx/2 + 10 + (index * 20); // Ogni anello è più largo di 20px
                            
                            // Anello
                            ctx.beginPath();
                            ctx.arc(0, 0, condRadius, 0, Math.PI * 2);
                            ctx.strokeStyle = cond.color;
                            ctx.lineWidth = 4;
                            ctx.stroke();
                            
                            // Testo curvo
                            let text = (cond.text || "CONDIZIONE").toUpperCase() + "  •  ";
                            ctx.font = `bold 16px Arial`;
                            ctx.fillStyle = "white";
                            ctx.strokeStyle = "black";
                            ctx.lineWidth = 3;
                            ctx.textBaseline = "middle";
                            ctx.textAlign = "center";
                            
                            const textWidth = ctx.measureText(text).width;
                            const circumference = 2 * Math.PI * condRadius;
                            
                            let repeats = Math.floor(circumference / (textWidth + 15));
                            if (repeats < 1) repeats = 1;
                            
                            const arcPerRepeat = (2 * Math.PI) / repeats;
                            
                            for (let r = 0; r < repeats; r++) {
                                let currentAngle = -Math.PI / 2 + r * arcPerRepeat;
                                
                                for (let i = 0; i < text.length; i++) {
                                    const char = text[i];
                                    const charWidth = ctx.measureText(char).width;
                                    const angle = charWidth / condRadius;
                                    
                                    ctx.save();
                                    ctx.rotate(currentAngle + angle/2);
                                    ctx.translate(0, -condRadius);
                                    ctx.strokeText(char, 0, 0);
                                    ctx.fillText(char, 0, 0);
                                    ctx.restore();
                                    
                                    currentAngle += angle;
                                }
                            }
                        });
                    } else if (style === 'segmented') {
                        const condRadius = sizePx/2 + 10;
                        const numConds = ringConditions.length;
                        const arcLen = (2 * Math.PI) / numConds;
                        
                        // Disegna gli spicchi colorati
                        for (let i = 0; i < numConds; i++) {
                            ctx.beginPath();
                            ctx.arc(0, 0, condRadius, i * arcLen, (i + 1) * arcLen);
                            ctx.strokeStyle = ringConditions[i].color;
                            ctx.lineWidth = 4;
                            ctx.stroke();
                        }
                        
                        // Testo curvo unito
                        let text = ringConditions.map(c => (c.text || "").toUpperCase()).join(" • ") + " • ";
                        ctx.font = `bold 16px Arial`;
                        ctx.fillStyle = "white";
                        ctx.strokeStyle = "black";
                        ctx.lineWidth = 3;
                        ctx.textBaseline = "middle";
                        ctx.textAlign = "center";
                        
                        const textWidth = ctx.measureText(text).width;
                        const circumference = 2 * Math.PI * condRadius;
                        
                        let repeats = Math.floor(circumference / (textWidth + 15));
                        if (repeats < 1) repeats = 1;
                        
                        const arcPerRepeat = (2 * Math.PI) / repeats;
                        
                        for (let r = 0; r < repeats; r++) {
                            let currentAngle = -Math.PI / 2 + r * arcPerRepeat;
                            
                            for (let i = 0; i < text.length; i++) {
                                const char = text[i];
                                const charWidth = ctx.measureText(char).width;
                                const angle = charWidth / condRadius;
                                    
                                ctx.save();
                                ctx.rotate(currentAngle + angle/2);
                                ctx.translate(0, -condRadius);
                                ctx.strokeText(char, 0, 0);
                                ctx.fillText(char, 0, 0);
                                ctx.restore();
                                
                                currentAngle += angle;
                            }
                        }
                    }
                    
                    ctx.restore();
                }

                // B) Pillole con Nome (es. [ Prono ]) - Ancorate sopra la vita / sotto il nome
                if (style === 'pills') {
                    const hasHpBar = (this.isDM || hpStyle === 'bar' || hpStyle === 'both') && 
                                     token.hpMax && token.hpMax > 0 && 
                                     (this.isDM || token.hpVisibleToPlayers !== false);
                    const barHeight = this.isDM ? 16 : 10;
                    const barTopY = hasHpBar ? (py + sizePx - barHeight - 3) : (py + sizePx - 2);

                    const canShowName = (this.isDM || token.nameVisibleToPlayers !== false) && token.name && token.name.trim() !== '';
                    const nameBottomY = canShowName ? (py + 21) : (py + 2);

                    const pillH = Math.max(16, Math.min(22, Math.round(sizePx * 0.20)));
                    const fontSize = Math.max(9, Math.min(12, Math.round(pillH * 0.58)));
                    ctx.font = `bold ${fontSize}px Arial, sans-serif`;

                    const formatTitleCase = (str) => {
                        if (!str) return 'Condizione';
                        if (String(str).startsWith('⏳')) return String(str);
                        return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                    };

                    const pillItems = activeConditions.map(cond => {
                        const labelText = formatTitleCase(cond.text || cond.type);
                        const textW = ctx.measureText(labelText).width;
                        const padX = Math.max(6, Math.round(pillH * 0.35));
                        const w = Math.round(textW + (padX * 2));
                        return { cond, text: labelText, w };
                    });

                    // Distribuzione delle righe:
                    // Riga Bassa (sopra barra PV): condizioni 1 e 2
                    // Riga Alta (sotto targhetta nome): condizioni 3 e 4
                    let bottomRow = [];
                    let topRow = [];

                    if (pillItems.length === 1) {
                        bottomRow = [pillItems[0]];
                    } else if (pillItems.length === 2) {
                        // Se due condizioni lunghe eccedono eccessivamente la larghezza del token, le dividiamo
                        if ((pillItems[0].w + pillItems[1].w + 4) > (sizePx * 1.35) && sizePx < 90) {
                            bottomRow = [pillItems[0]];
                            topRow = [pillItems[1]];
                        } else {
                            bottomRow = [pillItems[0], pillItems[1]];
                        }
                    } else if (pillItems.length === 3) {
                        bottomRow = [pillItems[0], pillItems[1]];
                        topRow = [pillItems[2]];
                    } else {
                        // 4 o più
                        bottomRow = [pillItems[0], pillItems[1]];
                        topRow = [pillItems[2], pillItems[3]];
                    }

                    const bottomRowY = barTopY - pillH - 1;
                    const topRowY = nameBottomY + 1;

                    const drawPillRow = (items, rowY) => {
                        if (!items || items.length === 0) return;
                        const gap = 3;
                        const totalW = items.reduce((sum, it) => sum + it.w, 0) + ((items.length - 1) * gap);
                        let startX = px + (sizePx / 2) - (totalW / 2);

                        ctx.save();
                        items.forEach(item => {
                            const pillX = Math.round(startX);
                            const pillW = item.w;
                            const pillRadius = Math.round(pillH / 2);

                            // 1. Ombra esterna netta
                            ctx.save();
                            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                            ctx.shadowBlur = 4;
                            ctx.shadowOffsetY = 1;

                            // 2. Sfondo scuro compatto
                            ctx.beginPath();
                            if (ctx.roundRect) {
                                ctx.roundRect(pillX, rowY, pillW, pillH, pillRadius);
                            } else {
                                ctx.rect(pillX, rowY, pillW, pillH);
                            }
                            ctx.fillStyle = '#141414';
                            ctx.fill();
                            ctx.restore();

                            // 3. Bordo vivo con colore della condizione
                            ctx.beginPath();
                            if (ctx.roundRect) {
                                ctx.roundRect(pillX, rowY, pillW, pillH, pillRadius);
                            } else {
                                ctx.rect(pillX, rowY, pillW, pillH);
                            }
                            ctx.strokeStyle = item.cond.color || '#ff9800';
                            ctx.lineWidth = 2.2;
                            ctx.stroke();

                            // 4. Testo nitido centrato ad alto contrasto
                            ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            ctx.strokeStyle = '#000000';
                            ctx.lineWidth = 2.5;
                            ctx.strokeText(item.text, pillX + (pillW / 2), rowY + (pillH / 2) + 0.5);

                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(item.text, pillX + (pillW / 2), rowY + (pillH / 2) + 0.5);

                            startX += pillW + gap;
                        });
                        ctx.restore();
                    };

                    drawPillRow(bottomRow, bottomRowY);
                    drawPillRow(topRow, topRowY);
                } else if (hasAuraTimer) {
                    // Se lo stile condizioni è concentric o segmented, mostra comunque la pillola dell'Aura sopra la barra PV
                    const hasHpBar = (this.isDM || hpStyle === 'bar' || hpStyle === 'both') && 
                                     token.hpMax && token.hpMax > 0 && 
                                     (this.isDM || token.hpVisibleToPlayers !== false);
                    const barHeight = this.isDM ? 16 : 10;
                    const barTopY = hasHpBar ? (py + sizePx - barHeight - 3) : (py + sizePx - 2);
                    const pillH = Math.max(16, Math.min(22, Math.round(sizePx * 0.20)));
                    const fontSize = Math.max(9, Math.min(12, Math.round(pillH * 0.58)));
                    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                    const labelText = `⏳ ${auraRoundsLeft}`;
                    const textW = ctx.measureText(labelText).width;
                    const padX = Math.max(6, Math.round(pillH * 0.35));
                    const pillW = Math.round(textW + (padX * 2));
                    const pillX = Math.round(px + (sizePx / 2) - (pillW / 2));
                    const pillY = barTopY - pillH - 1;
                    const pillRadius = Math.round(pillH / 2);

                    ctx.save();
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                    ctx.shadowBlur = 4;
                    ctx.shadowOffsetY = 1;

                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(pillX, pillY, pillW, pillH, pillRadius);
                    else ctx.rect(pillX, pillY, pillW, pillH);
                    ctx.fillStyle = '#141414';
                    ctx.fill();
                    ctx.restore();

                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(pillX, pillY, pillW, pillH, pillRadius);
                    else ctx.rect(pillX, pillY, pillW, pillH);
                    ctx.strokeStyle = token.aura.color || '#ffee58';
                    ctx.lineWidth = 2.2;
                    ctx.stroke();

                    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 2.5;
                    ctx.strokeText(labelText, pillX + (pillW / 2), pillY + (pillH / 2) + 0.5);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(labelText, pillX + (pillW / 2), pillY + (pillH / 2) + 0.5);
                }
            }

            // 4. Bordo Selezione
            if (this.isDM && (this.selectedTokenId === token.id || this.selectedTokens.has(token.id))) {
                ctx.strokeStyle = this.selectedTokenId === token.id ? '#0288d1' : '#00bcd4';
                ctx.lineWidth = 4;
                ctx.strokeRect(token.x, token.y, token.width, token.height);
            }
    }

    renderDrawings() {
        this.drawStrokes(this.ctx.drawPublic, this.publicStrokes);
        if (this.isDM) {
            this.drawStrokes(this.ctx.drawPrivate, this.privateStrokes);
            
            for (const note of this.notes) {
                const nx = note.x;
                const ny = note.y;
                
                // Icona Pin (Coordinate nel mondo, non serve moltiplicare per scale perché il canvas bg/drawPrivate non sono scalati!)
                this.ctx.drawPrivate.fillStyle = '#ffcc00';
                this.ctx.drawPrivate.fillRect(nx - 15, ny - 15, 30, 30);
                this.ctx.drawPrivate.strokeStyle = 'black';
                this.ctx.drawPrivate.lineWidth = 2;
                this.ctx.drawPrivate.strokeRect(nx - 15, ny - 15, 30, 30);
                
                this.ctx.drawPrivate.fillStyle = 'black';
                this.ctx.drawPrivate.font = 'bold 20px Arial';
                this.ctx.drawPrivate.textAlign = 'center';
                this.ctx.drawPrivate.textBaseline = 'middle';
                this.ctx.drawPrivate.fillText('N', nx, ny);
            }
        }
    }

    drawStrokes(ctx, strokes) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        strokes.forEach(stroke => {
            if (stroke.points.length < 2) return;
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.width;
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
                ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            ctx.stroke();
        });
    }

    renderUI() {
        const ctx = this.ctx.ui;
        ctx.clearRect(0, 0, this.layers.ui.width, this.layers.ui.height);

        const now = Date.now();
        let hasActivePings = false;
        let hasActiveLasers = false;
        
        if (!this.lasers) this.lasers = [];
        
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            // Rimuovi punti vecchi di 5 secondi
            laser.points = laser.points.filter(p => now - p.t < 5000);
            
            if (laser.points.length === 0 && !laser.active) {
                this.lasers.splice(i, 1);
                continue;
            }
            if (laser.points.length > 0) hasActiveLasers = true;
            
            if (laser.points.length > 1) {
                ctx.save();
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.lineWidth = 6 * this.scale;
                
                // Effetto Neon
                ctx.shadowBlur = 12 * this.scale;
                ctx.shadowColor = laser.color || '#ff00ff';
                ctx.strokeStyle = laser.color || '#ff00ff';
                
                ctx.beginPath();
                for (let j = 0; j < laser.points.length; j++) {
                    const pt = laser.points[j];
                    const px = pt.x * this.scale + this.offsetX;
                    const py = pt.y * this.scale + this.offsetY;
                    
                    if (j === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();
                
                // Anima interna bianca (laser)
                ctx.lineWidth = 2 * this.scale;
                ctx.strokeStyle = '#ffffff';
                ctx.shadowBlur = 0;
                ctx.stroke();
                
                ctx.restore();
            }
        }
        
        for (let i = this.pings.length - 1; i >= 0; i--) {
            const p = this.pings[i];
            const age = now - p.start;
            if (age > 1500) {
                this.pings.splice(i, 1);
                continue;
            }
            hasActivePings = true;
            
            const px = p.x * this.scale + this.offsetX;
            const py = p.y * this.scale + this.offsetY;
            
            // Animazione cerchio che si espande
            const progress = age / 1500; // da 0 a 1
            const maxRadius = Math.max(35, 100 * this.scale);
            const radius = maxRadius * Math.easeOutQuad(progress);
            
            let rgb = '255, 0, 0';
            if (p.color && typeof p.color === 'string' && p.color.startsWith('#')) {
                let hex = p.color.slice(1);
                if (hex.length === 3) {
                    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
                }
                if (hex.length >= 6) {
                    const r = parseInt(hex.slice(0, 2), 16) || 0;
                    const g = parseInt(hex.slice(2, 4), 16) || 0;
                    const b = parseInt(hex.slice(4, 6), 16) || 0;
                    rgb = `${r}, ${g}, ${b}`;
                }
            }
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgb}, ${1 - progress})`;
            ctx.lineWidth = Math.max(3, 5 * Math.min(this.scale, 1.5));
            ctx.stroke();
            
            // Cerchio fisso al centro
            ctx.beginPath();
            ctx.arc(px, py, Math.max(5, 10 * this.scale), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${1 - progress})`;
            ctx.fill();
        }
        
        let hasActiveInitiative = (this.initiative && this.initiative.active && this.initiative.participants.length > 0);
        const hasAoEHighlights = this._tokensWithAoE && this._tokensWithAoE.size > 0;

        // Disegna anelli Turno (verde, interno), AoE e Overlays su layer tokenEffects (sotto la nebbia!)
        this.renderTokenEffects();

        if (this.lasso) {
            ctx.strokeStyle = 'rgba(0, 153, 255, 0.8)';
            ctx.fillStyle = 'rgba(0, 153, 255, 0.2)';
            ctx.lineWidth = 2;
            const x = Math.min(this.lasso.startX, this.lasso.endX) * this.scale + this.offsetX;
            const y = Math.min(this.lasso.startY, this.lasso.endY) * this.scale + this.offsetY;
            const w = Math.abs(this.lasso.startX - this.lasso.endX) * this.scale;
            const h = Math.abs(this.lasso.startY - this.lasso.endY) * this.scale;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }
        
        if (hasActivePings || hasActiveInitiative || hasActiveLasers || hasAoEHighlights) {
            if (!this._uiAnimFrameId) {
                this._uiAnimFrameId = requestAnimationFrame(() => {
                    this._uiAnimFrameId = null;
                    this.renderUI();
                });
            }
        }


        if (this.ruler) {
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            
            const startX = this.ruler.startX * this.scale + this.offsetX;
            const startY = this.ruler.startY * this.scale + this.offsetY;
            const endX = this.ruler.endX * this.scale + this.offsetX;
            const endY = this.ruler.endY * this.scale + this.offsetY;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.setLineDash([]);

            const dx = this.ruler.endX - this.ruler.startX;
            const dy = this.ruler.endY - this.ruler.startY;
            const distancePx = Math.sqrt(dx*dx + dy*dy);
            const squares = distancePx / this.grid.size;
            
            const distanceFeet = Math.round(squares * 5);
            const distanceMeters = (squares * 1.5).toFixed(1);

            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText(`${distanceFeet} ft / ${distanceMeters}m (${squares.toFixed(1)} sq)`, endX + 12, endY + 12);
            ctx.fillStyle = 'yellow';
            ctx.fillText(`${distanceFeet} ft / ${distanceMeters}m (${squares.toFixed(1)} sq)`, endX + 10, endY + 10);
        }

        if (this.brushPreview) {
            const size = this.brushPreview.size * this.scale;
            const px = this.brushPreview.x * this.scale + this.offsetX;
            const py = this.brushPreview.y * this.scale + this.offsetY;

            ctx.strokeStyle = this.brushPreview.isErase ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
            ctx.fillStyle = this.brushPreview.isErase ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 2;
            
            if (this.brushPreview.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(px, py, size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            } else {
                ctx.fillRect(px - size/2, py - size/2, size, size);
                ctx.strokeRect(px - size/2, py - size/2, size, size);
            }
        }
    }

    resetFog() {
        if (!this.mapImage) return;
        const ctx = this.ctx.fog;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.layers.fog.width, this.layers.fog.height);
    }

    clearFog() {
        if (!this.mapImage) return;
        const ctx = this.ctx.fog;
        ctx.clearRect(0, 0, this.layers.fog.width, this.layers.fog.height);
    }

    drawFogStroke(points, isErase, shape = 'circle', size = 150) {
        const ctx = this.ctx.fog;
        ctx.lineJoin = shape === 'circle' ? 'round' : 'miter';
        ctx.lineCap = shape === 'circle' ? 'round' : 'square';
        ctx.lineWidth = size;

        if (isErase) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = 'black';
        }

        ctx.beginPath();
        if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }
        
        ctx.globalCompositeOperation = 'source-over';
    }

    applyFogImage(base64Image) {
        if (!base64Image) return;
        this._lastAppliedFogBase64 = base64Image;
        const img = new Image();
        img.onload = () => {
            if (this.layers.fog.width > 0 && this.layers.fog.height > 0) {
                const ctx = this.ctx.fog;
                ctx.clearRect(0, 0, this.layers.fog.width, this.layers.fog.height);
                ctx.drawImage(img, 0, 0, this.layers.fog.width, this.layers.fog.height);
            }
        };
        img.src = base64Image;
    }

    getFogBase64() {
        const fw = this.layers.fog.width;
        const fh = this.layers.fog.height;
        if (!fw || !fh) return '';
        const maxDim = 1024;
        if (fw <= maxDim && fh <= maxDim) {
            return this.layers.fog.toDataURL('image/png');
        }
        const ratio = Math.min(maxDim / fw, maxDim / fh);
        const tw = Math.max(1, Math.round(fw * ratio));
        const th = Math.max(1, Math.round(fh * ratio));
        if (!this._fogExportCanvas) {
            this._fogExportCanvas = document.createElement('canvas');
            this._fogExportCtx = this._fogExportCanvas.getContext('2d');
        }
        this._fogExportCanvas.width = tw;
        this._fogExportCanvas.height = th;
        this._fogExportCtx.clearRect(0, 0, tw, th);
        this._fogExportCtx.drawImage(this.layers.fog, 0, 0, tw, th);
        return this._fogExportCanvas.toDataURL('image/png');
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.offsetX) / this.scale,
            y: (screenY - this.offsetY) / this.scale
        };
    }
}
