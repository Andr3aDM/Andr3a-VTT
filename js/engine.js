
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
            fog: this.createCanvas('fog-layer', 5)
        };

        if (this.isDM) {
            this.layers.fog.style.opacity = '0.55';
        }

        this.layers.ui = document.createElement('canvas');
        this.layers.ui.id = 'ui-layer';
        this.layers.ui.style.position = 'absolute';
        this.layers.ui.style.zIndex = 6;
        this.layers.ui.style.top = '0';
        this.layers.ui.style.left = '0';
        this.container.appendChild(this.layers.ui);

        this.ctx = {
            bg: this.layers.bg.getContext('2d'),
            grid: this.layers.grid.getContext('2d'),
            drawPublic: this.layers.drawPublic.getContext('2d'),
            drawPrivate: this.layers.drawPrivate.getContext('2d'),
            tokens: this.layers.tokens.getContext('2d'),
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
        this.selectedShapeId = null;

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
        if (zIndex < 6) canvas.style.pointerEvents = 'none';
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
            if (key !== 'ui') {
                this.layers[key].width = w;
                this.layers[key].height = h;
            }
        }
        
        this.fitToScreen();
        this.resetFog();
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

    renderAll() {
        if (!this.mapImage) return;
        this.updateWorkspaceTransform();
        this.clearAll();
        
        this.ctx.bg.drawImage(this.mapImage, 0, 0);
        this.renderGrid();
        this.renderDrawings();
        this.renderShapes(); // Draw AoE before tokens
        this.renderTokens();
        this.renderUI();
    }

    clearAll() {
        const w = this.mapImage ? this.mapImage.width : 0;
        const h = this.mapImage ? this.mapImage.height : 0;
        if(w === 0) return;

        this.ctx.grid.clearRect(0, 0, w, h);
        this.ctx.tokens.clearRect(0, 0, w, h);
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
            const sizePx = shape.sizeFt * pixelsPerFoot;
            
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
                // Line standard 5ft width
                const halfWidth = 2.5 * pixelsPerFoot;
                ctx.rect(0, -halfWidth, sizePx, halfWidth * 2);
            }
            ctx.fill();
            ctx.stroke();
            ctx.restore();            // Maniglione centrale solo per DM o se il giocatore è l'owner della magia
            const isMyShape = shape.owner && shape.owner === this.localPlayerName;
            if (this.isDM || isMyShape) {
                ctx.save();
                ctx.translate(shape.x, shape.y);
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, Math.PI*2);
                
                const isSelected = this.isDM ? (this.selectedShapeId === shape.id) : (window.editingPlayerShape && window.editingPlayerShape.id === shape.id);
                ctx.fillStyle = isSelected ? '#00ffff' : '#ffffff';
                ctx.fill();
                ctx.stroke();
                
                ctx.rotate(shape.angle * Math.PI / 180);
                ctx.fillStyle = '#000';
                ctx.fillRect(0, -2, 15, 4);
                ctx.restore();
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
            }
        });

        // Draw Conditions on top
        this.tokens.forEach(token => {
            if (!this.isDM && !token.visible) return;
            
            const px = token.x;
            const py = token.y;
            const sizePx = token.width;
            
            if (token.condition && token.condition.active) {
                const condRadius = sizePx/2 + 10; // 10px padding
                const cx = px + sizePx/2;
                const cy = py + sizePx/2;
                
                ctx.save();
                ctx.translate(cx, cy);
                
                // Anello
                ctx.beginPath();
                ctx.arc(0, 0, condRadius, 0, Math.PI * 2);
                ctx.strokeStyle = token.condition.color;
                ctx.lineWidth = 4;
                ctx.stroke();
                
                // Testo curvo
                let text = (token.condition.text || "CONDIZIONE").toUpperCase() + "  •  ";
                ctx.font = `bold 16px Arial`;
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 3;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                
                const textWidth = ctx.measureText(text).width;
                const circumference = 2 * Math.PI * condRadius;
                
                // Quante volte la scritta entra interamente nella circonferenza aggiungendo respiro extra?
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
                ctx.restore();
            }

            
            // Health Bar
            if (token.hpMax && token.hpMax > 0) {
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
                    
                    const barHeight = 8;
                    const barY = token.y + token.height - barHeight - 2;
                    const barWidth = token.width - 4;
                    const barX = token.x + 2;
                    
                    ctx.save();
                    // Background
                    ctx.fillStyle = 'rgba(0,0,0,0.7)';
                    ctx.fillRect(barX, barY, barWidth, barHeight);
                    
                    if (this.isDM) {
                        // DM View: barra progressiva + testino
                        const fillWidth = barWidth * percent;
                        ctx.fillStyle = barColor;
                        ctx.fillRect(barX, barY, fillWidth, barHeight);
                        
                        ctx.fillStyle = 'white';
                        ctx.font = '9px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 2;
                        const text = `${hpCurr}/${hpMax}`;
                        ctx.strokeText(text, token.x + token.width/2, barY + barHeight/2 + 1);
                        ctx.fillText(text, token.x + token.width/2, barY + barHeight/2 + 1);
                    } else {
                        // Player View: barra sempre piena ma colorata
                        ctx.fillStyle = barColor;
                        ctx.fillRect(barX, barY, barWidth, barHeight);
                    }
                    ctx.restore();
                }
            }

            if (this.isDM && this.selectedTokenId === token.id) {
                ctx.strokeStyle = '#0288d1';
                ctx.lineWidth = 4;
                ctx.strokeRect(token.x, token.y, token.width, token.height);
            }
        });
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
            const maxRadius = 100 * this.scale;
            const radius = maxRadius * Math.easeOutQuad(progress);
            
            const rgb = (ping.color && ping.color.startsWith('#')) ? 
                `${parseInt(ping.color.slice(1,3),16)}, ${parseInt(ping.color.slice(3,5),16)}, ${parseInt(ping.color.slice(5,7),16)}` : '255, 0, 0';
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgb}, ${1 - progress})`;
            ctx.lineWidth = 5;
            ctx.stroke();
            
            // Cerchio fisso al centro
            ctx.beginPath();
            ctx.arc(px, py, 10 * this.scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${1 - progress})`;
            ctx.fill();
        }
        
        let hasActiveInitiative = (this.initiative && this.initiative.active && this.initiative.participants.length > 0);
        
        if (hasActiveInitiative) {
            const currentParticipant = this.initiative.participants[this.initiative.currentTurnIndex];
            if (currentParticipant && currentParticipant.isToken && currentParticipant.tokenId) {
                const token = this.tokens.find(t => t.id === currentParticipant.tokenId);
                if (token && (this.isDM || token.visible)) {
                    // Pulsing highlight
                    const pulse = (Math.sin(Date.now() / 200) + 1) / 2; // 0 to 1
                    ctx.strokeStyle = `rgba(0, 255, 0, ${0.4 + pulse * 0.6})`;
                    ctx.lineWidth = 6 * this.scale;
                    
                    const px = (token.x + token.width/2) * this.scale + this.offsetX;
                    const py = (token.y + token.height/2) * this.scale + this.offsetY;
                    const r = (token.width/2 + 10) * this.scale;
                    
                    ctx.beginPath();
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }

        if (hasActivePings || hasActiveInitiative) {
            requestAnimationFrame(() => this.renderUI());
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
        const img = new Image();
        img.onload = () => {
            const ctx = this.ctx.fog;
            ctx.clearRect(0,0, this.layers.fog.width, this.layers.fog.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = base64Image;
    }

    getFogBase64() {
        return this.layers.fog.toDataURL('image/png');
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.offsetX) / this.scale,
            y: (screenY - this.offsetY) / this.scale
        };
    }
}
