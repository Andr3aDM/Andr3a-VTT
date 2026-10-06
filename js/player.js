let wasViewSyncActive = false;
const engine = new VTTEngine('main-canvas-container', false); // isDM = false
let activeToken = null;
let isDragging = false;
let activeStroke = null;
let pingTimeout = null;
let startMouseX = 0;
let startMouseY = 0;

// Login logic
document.getElementById('btn-login-offline').addEventListener('click', () => {
    const name = document.getElementById('login-name').value.trim();
    if (name) network.playerName = name;
    engine.localPlayerName = name;
    document.getElementById('login-overlay').style.display = 'none';
    network.startOffline();
    network.send({ type: 'PLAYER_READY' });
});

document.getElementById('btn-login-online').addEventListener('click', () => {
    try {
        const name = document.getElementById('login-name').value.trim();
        const room = document.getElementById('login-room').value.trim();
        const status = document.getElementById('login-status');
        
        if (!name || !room) {
            status.innerText = "Inserisci Nome e Codice Stanza";
            return;
        }
        
        status.innerText = "Connessione in corso...";
        console.log("Tentativo di connessione a:", room);
        
        if (typeof network === 'undefined') {
            alert("Errore critico: network.js non è stato caricato!");
            return;
        }
        
        network.joinRoom(room, name).then(() => {
            console.log("Connesso con successo");
            engine.localPlayerName = name; // FONDAMENTALE PER LA VISIBILITA DEL MANIGLIONE!
            document.getElementById('login-overlay').style.display = 'none';
            network.send({ type: 'PLAYER_READY' });
        }).catch(err => {
            status.innerText = "Errore di connessione. Verifica il codice stanza.";
            console.error("Join Room Error:", err);
            alert("Errore PeerJS: " + err);
        });
    } catch(e) {
        alert("Errore javascript nel click: " + e.message);
    }
});

network.onMessage((data, peerId) => {

    if (data.type === 'ping') {
        engine.pings.push({x: data.x, y: data.y, start: Date.now()});
        engine.renderUI();
    } else if (data.type === 'MAP_UPDATE') {
        const img = new Image();
        img.onload = () => {
            engine.setMap(img);
        };
        img.src = data.payload;
    } 
    else if (data.type === 'STATE_SYNC') {
        const state = data.payload;
        
        // Sync Grid
        engine.grid = state.grid;

        // Sync Initiative
        if (state.initiative && document.getElementById('player-tracker')) {
            engine.initiative = state.initiative;
            const trackerDiv = document.getElementById('player-tracker');
            const trackerList = document.getElementById('player-tracker-list');
            if (state.initiative.active && state.initiative.isVisibleToPlayers) {
                trackerDiv.style.display = 'block';
                trackerDiv.style.top = 'auto';
                trackerDiv.style.bottom = 'auto';
                trackerDiv.style.left = 'auto';
                trackerDiv.style.right = 'auto';
                trackerDiv.style.transform = 'none';
                trackerList.style.flexDirection = 'row';
                
                if (state.initiative.playerPosition === 'top') {
                    trackerDiv.style.top = '20px';
                    trackerDiv.style.left = '50%';
                    trackerDiv.style.transform = 'translateX(-50%)';
                } else if (state.initiative.playerPosition === 'bottom') {
                    trackerDiv.style.bottom = '20px';
                    trackerDiv.style.left = '50%';
                    trackerDiv.style.transform = 'translateX(-50%)';
                } else if (state.initiative.playerPosition === 'left') {
                    trackerDiv.style.left = '20px';
                    trackerDiv.style.top = '50%';
                    trackerDiv.style.transform = 'translateY(-50%)';
                    trackerList.style.flexDirection = 'column';
                } else if (state.initiative.playerPosition === 'right') {
                    trackerDiv.style.right = '20px';
                    trackerDiv.style.top = '50%';
                    trackerDiv.style.transform = 'translateY(-50%)';
                    trackerList.style.flexDirection = 'column';
                }
                
                trackerList.innerHTML = '';
                const visibleParticipants = state.initiative.participants.filter(p => !p.isHidden);
                visibleParticipants.forEach(p => {
                    const originalIndex = state.initiative.participants.findIndex(orig => orig.id === p.id);
                    const isCurrent = state.initiative.currentTurnIndex === originalIndex;
                    
                    const div = document.createElement('div');
                    div.style.padding = '8px 12px';
                    div.style.background = isCurrent ? '#2e7d32' : '#444';
                    div.style.borderRadius = '5px';
                    div.style.fontWeight = isCurrent ? 'bold' : 'normal';
                    div.innerText = `${p.name} (${p.init})`;
                    if (isCurrent) {
                        div.style.border = '2px solid #00e676';
                        div.style.boxShadow = '0 0 10px #00e676';
                    }
                    trackerList.appendChild(div);
                });
            } else {
                trackerDiv.style.display = 'none';
            }
        }

        // Annulla il rubber-banding applicando il Timestamp Lock
        state.tokens.forEach(incomingTok => {
            const localTok = engine.tokens.find(t => t.id === incomingTok.id);
            if (localTok && localTok._lastLocalEdit && Date.now() - localTok._lastLocalEdit < 1000) {
                incomingTok.x = localTok.x;
                incomingTok.y = localTok.y;
                incomingTok._lastLocalEdit = localTok._lastLocalEdit;
            }
        });
        
        if (state.shapes) {
            state.shapes.forEach(incomingShape => {
                const localShape = engine.shapes.find(s => s.id === incomingShape.id);
                if (localShape && localShape._lastLocalEdit && Date.now() - localShape._lastLocalEdit < 1000) {
                    incomingShape.x = localShape.x;
                    incomingShape.y = localShape.y;
                    incomingShape._lastLocalEdit = localShape._lastLocalEdit;
                }
            });
        }

        engine.publicStrokes = state.publicStrokes || [];
        engine.shapes = state.shapes || [];

        // --- View Sync Logic ---
        if (typeof state.hideToolbar !== 'undefined') {
            const ptb = document.getElementById('player-toolbar');
            if (ptb) {
                ptb.style.display = state.hideToolbar ? 'none' : 'flex';
            }
        }
        if (state.viewSync) {
            wasViewSyncActive = true;
            engine.scale = state.viewSync.scale;
            engine.offsetX = engine.container.clientWidth / 2 - state.viewSync.centerX * engine.scale;
            engine.offsetY = engine.container.clientHeight / 2 - state.viewSync.centerY * engine.scale;
        } else if (wasViewSyncActive) {
            wasViewSyncActive = false;
            engine.fitToScreen();
        }
        // -----------------------

        const newTokens = [];
        let loadedCount = 0;
        
        if (state.tokens.length === 0) {
            engine.tokens = [];
            engine.renderAll();
            return;
        }

        const finishLoading = () => {
            if (activeToken) {
                const dragId = activeToken.ref.id;
                const dragX = activeToken.ref.x;
                const dragY = activeToken.ref.y;
                const dragEdit = activeToken.ref._lastLocalEdit;
                
                engine.tokens = newTokens;
                
                if (activeToken.type === 'token') {
                    const found = engine.tokens.find(tok => tok.id === dragId);
                    if (found) {
                        found.x = dragX;
                        found.y = dragY;
                        found._lastLocalEdit = dragEdit;
                        activeToken = { type: 'token', ref: found };
                    } else {
                        activeToken = null;
                    }
                } else if (activeToken.type === 'shape') {
                    const found = engine.shapes.find(s => s.id === dragId);
                    if (found) {
                        found.x = dragX;
                        found.y = dragY;
                        found._lastLocalEdit = dragEdit;
                        activeToken = { type: 'shape', ref: found };
                    } else {
                        activeToken = null;
                    }
                }
            } else {
                engine.tokens = newTokens;
            }
            engine.renderAll();
        };

        state.tokens.forEach(t => {
            const existing = engine.tokens.find(et => et.id === t.id);
            if (existing && existing.src === t.src) {
                t.imageObj = existing.imageObj;
                newTokens.push(t);
                loadedCount++;
                if (loadedCount === state.tokens.length) {
                    finishLoading();
                }
            } else {
                const img = new Image();
                img.onload = () => {
                    t.imageObj = img;
                    newTokens.push(t);
                    loadedCount++;
                    if (loadedCount === state.tokens.length) {
                        finishLoading();
                    }
                };
                img.src = t.src;
            }
        });
    }else if (data.type === 'FOG_SYNC') {
        engine.applyFogImage(data.payload);
    }
});

// Request initial state if opened later
// Adatta sempre la mappa quando la finestra del giocatore viene ridimensionata o messa a schermo intero
window.addEventListener('resize', () => {
    if (!wasViewSyncActive) {
        engine.fitToScreen();
    }
    engine.renderAll();
});



// --- PLAYER TOOLBAR ---
let currentTool = 'move';
document.querySelectorAll('.ptool-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.ptool-btn').forEach(b => b.style.opacity = '0.5');
        e.currentTarget.style.opacity = '1';
        currentTool = e.currentTarget.dataset.tool;
    });
});
// Init opacity
document.querySelectorAll('.ptool-btn').forEach(b => b.style.opacity = b.classList.contains('active') ? '1' : '0.5');

// Shape spawners
function spawnShape(type) {
    const centerPos = engine.screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    const shape = {
        id: 'aoe_' + Date.now() + Math.floor(Math.random()*1000),
        type: type === 'sphere' ? 'circle' : type,
        x: centerPos.x, y: centerPos.y,
        sizeFt: 15,
        angle: 0,
        visible: true,
        owner: network.playerName,
        color: document.getElementById('player-color').value
    };
    network.send({ type: 'PLAYER_ADD_SHAPE', payload: shape });
}
document.getElementById('pbtn-cone').addEventListener('click', () => spawnShape('cone'));
document.getElementById('pbtn-sphere').addEventListener('click', () => spawnShape('sphere'));
document.getElementById('pbtn-line').addEventListener('click', () => spawnShape('line'));


// --- PLAYER INPUT LOGIC ---
const uiLayer = document.getElementById('main-canvas-container');

function getEventPos(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

function pHandleStart(e) {
    if (!network.playerName && currentTool === 'move') return; // Se offline no-name e vuole muovere
    const pos = getEventPos(e);
    
    // Track per capire se è un click o un drag
    if (e.touches && e.touches.length > 0) {
        startMouseX = e.touches[0].clientX;
        startMouseY = e.touches[0].clientY;
    } else {
        startMouseX = e.clientX;
        startMouseY = e.clientY;
    }
    const worldPos = engine.screenToWorld(pos.x, pos.y);
    
    if (currentTool === 'move') {
        // Cerca token di proprietà
        for (let i = engine.tokens.length - 1; i >= 0; i--) {
            const t = engine.tokens[i];
            if (t.owner === network.playerName && 
                worldPos.x >= t.x && worldPos.x <= t.x + t.width &&
                worldPos.y >= t.y && worldPos.y <= t.y + t.height) {
                
                activeToken = { type: 'token', ref: t };
                isDragging = true;
                e.preventDefault();
                return;
            }
        }        // Cerca shape per il maniglione centrale (raggio 15px) e solo se di proprietà
        for (let i = engine.shapes.length - 1; i >= 0; i--) {
            const s = engine.shapes[i];
            if (!s.visible) continue;
            
            // RIGOROSO: Cliccabile solo se l'owner è ESATTAMENTE il giocatore corrente
            if (s.owner !== network.playerName) continue;

            const dist = Math.hypot(worldPos.x - s.x, worldPos.y - s.y);
            // Il maniglione è disegnato con raggio 10, usiamo 20 per comodità touch
            if (dist <= 20 / engine.scale) {
                activeToken = { type: 'shape', ref: s };
                isDragging = true;
                e.preventDefault();
                return;
            }
        }
    }
    
    if (currentTool === 'draw') {
        isDragging = true;
        activeStroke = {
            id: 'stroke_' + Date.now() + Math.floor(Math.random()*1000),
            color: document.getElementById('player-color').value,
            width: 10,
            points: [worldPos]
        };
        e.preventDefault();
        return;
    }
    
    if (currentTool === 'ruler') {
        isDragging = true;
        engine.ruler = { startX: worldPos.x, startY: worldPos.y, endX: worldPos.x, endY: worldPos.y };
        engine.renderUI();
        e.preventDefault();
        return;
    }
    
    // Ping on long press
    if (currentTool === 'move' && !isDragging) {
        pingTimeout = setTimeout(() => {
            const pColor = document.getElementById('player-color').value;
            // Ping locale
            engine.pings.push({x: worldPos.x, y: worldPos.y, start: Date.now(), color: pColor});
            engine.renderUI();
            // Ping remoto
            network.send({type: 'PING', payload: {x: worldPos.x, y: worldPos.y, color: pColor}});
        }, 500);
    }
}

function pHandleMove(e) {
    const moveRawX = e.touches ? e.touches[0].clientX : e.clientX;
    const moveRawY = e.touches ? e.touches[0].clientY : e.clientY;
    
    if (pingTimeout && (Math.abs(moveRawX - startMouseX) > 5 || Math.abs(moveRawY - startMouseY) > 5)) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
    }
    if (!isDragging) return;
    e.preventDefault();
    const pos = getEventPos(e);
    const worldPos = engine.screenToWorld(pos.x, pos.y);
    
    if (currentTool === 'move' && activeToken) {
        if (activeToken.type === 'token') {
            activeToken.ref.x = worldPos.x - activeToken.ref.width / 2;
            activeToken.ref.y = worldPos.y - activeToken.ref.height / 2;
            activeToken.ref._lastLocalEdit = Date.now();
            engine.renderAll();
            
            if (Date.now() - (window.lastMoveSend || 0) > 40) {
                network.send({
                    type: 'PLAYER_MOVE_TOKEN',
                    payload: { id: activeToken.ref.id, x: activeToken.ref.x, y: activeToken.ref.y }
                });
                window.lastMoveSend = Date.now();
            }
        } else if (activeToken.type === 'shape') {
            activeToken.ref.x = worldPos.x;
            activeToken.ref.y = worldPos.y;
            activeToken.ref._lastLocalEdit = Date.now();
            engine.renderAll();
            
            if (Date.now() - (window.lastMoveSend || 0) > 40) {
                network.send({
                    type: 'PLAYER_MOVE_SHAPE',
                    payload: { id: activeToken.ref.id, x: activeToken.ref.x, y: activeToken.ref.y }
                });
                window.lastMoveSend = Date.now();
            }
        }
    }
    else if (currentTool === 'draw' && activeStroke) {
        activeStroke.points.push(worldPos);
        engine.renderAll();
        
        // Render locale temporaneo
        const ctx = engine.ctx.drawPublic;
        ctx.beginPath();
        ctx.strokeStyle = activeStroke.color;
        ctx.lineWidth = 10; // Raddoppiato da 5 a 10
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        activeStroke.points.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
    }
    else if (currentTool === 'ruler') {
        engine.ruler.endX = worldPos.x;
        engine.ruler.endY = worldPos.y;
        engine.renderUI();
    }
}

function pHandleEnd(e) {
    if (pingTimeout) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
    }
    if (!isDragging) return;
    isDragging = false;
    
    if (currentTool === 'move' && activeToken) {
        const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
        const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
        
        if (activeToken.type === 'token') {
            activeToken.ref.x = Math.round((activeToken.ref.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
            activeToken.ref.y = Math.round((activeToken.ref.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
            activeToken.ref._lastLocalEdit = Date.now();
            engine.renderAll();
            network.send({
                type: 'PLAYER_END_TOKEN',
                payload: { id: activeToken.ref.id, x: activeToken.ref.x, y: activeToken.ref.y }
            });
            
            // Controlla se è stato solo un click (senza drag)
            let endX = e.clientX; let endY = e.clientY;
            if (e.changedTouches && e.changedTouches.length > 0) {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
            }
            if (Math.abs(endX - startMouseX) < 10 && Math.abs(endY - startMouseY) < 10) {
                document.getElementById('player-token-panel').style.display = 'block';
                const aura = activeToken.ref.aura || {};
                document.getElementById('ptoken-aura-active').checked = aura.active || false;
                document.getElementById('ptoken-aura-size').value = aura.sizeRaw || 15;
                document.getElementById('ptoken-aura-color').value = aura.color || '#ffff00';
                window.editingPlayerToken = activeToken.ref;
            }        } else if (activeToken.type === 'shape') {
            activeToken.ref._lastLocalEdit = Date.now();
            engine.renderAll();
            
            network.send({
                type: 'PLAYER_MOVE_SHAPE',
                payload: { id: activeToken.ref.id, x: activeToken.ref.x, y: activeToken.ref.y }
            });
            
            let endX = e.clientX; let endY = e.clientY;
            if (e.changedTouches && e.changedTouches.length > 0) {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
            }
            if (Math.abs(endX - startMouseX) < 10 && Math.abs(endY - startMouseY) < 10) {
                document.getElementById('player-shape-panel').style.display = 'block';
                document.getElementById('pshape-size').value = activeToken.ref.sizeFt || 15;
                document.getElementById('pshape-angle').value = activeToken.ref.angle || 0;
                document.getElementById('pshape-color').value = activeToken.ref.color || '#00ffff';
                window.editingPlayerShape = activeToken.ref;
            }
        }
        activeToken = null;
    }
    else if (currentTool === 'draw' && activeStroke) {
        network.send({
            type: 'PLAYER_DRAW',
            payload: activeStroke
        });
        activeStroke = null;
    }
    else if (currentTool === 'ruler') {
        engine.ruler = null;
        engine.renderUI();
    }
}

uiLayer.addEventListener('mousedown', pHandleStart);
uiLayer.addEventListener('touchstart', pHandleStart, {passive: false});
uiLayer.addEventListener('mousemove', pHandleMove);
uiLayer.addEventListener('touchmove', pHandleMove, {passive: false});
uiLayer.addEventListener('mouseup', pHandleEnd);
uiLayer.addEventListener('touchend', pHandleEnd);
uiLayer.addEventListener('mouseleave', pHandleEnd);

// Gestione Pannello Shape Giocatore
function updatePlayerShape() {
    if (!window.editingPlayerShape) return;
    
    const sizeRaw = parseFloat(document.getElementById('pshape-size').value) || 0;
    const unit = document.getElementById('pshape-unit').value;
    const squares = unit === 'ft' ? sizeRaw / 5 : sizeRaw / 1.5;
    const sizeFt = squares * 5;
    
    window.editingPlayerShape.sizeFt = sizeFt;
    window.editingPlayerShape.angle = parseInt(document.getElementById('pshape-angle').value) || 0;
    window.editingPlayerShape.color = document.getElementById('pshape-color').value;
    window.editingPlayerShape._lastLocalEdit = Date.now();
    engine.renderAll();
    
    network.send({
        type: 'PLAYER_UPDATE_SHAPE',
        payload: window.editingPlayerShape
    });
}
document.getElementById('pshape-size').addEventListener('input', updatePlayerShape);
document.getElementById('pshape-angle').addEventListener('input', updatePlayerShape);
document.getElementById('pshape-color').addEventListener('input', updatePlayerShape);
document.getElementById('pshape-unit').addEventListener('change', (e) => {
    const input = document.getElementById('pshape-size');
    const oldVal = parseFloat(input.value) || 0;
    if (e.target.value === 'ft') {
        input.step = '5';
        input.value = Math.round(oldVal / 1.5 * 5);
    } else {
        input.step = '1.5';
        let newVal = (oldVal / 5 * 1.5);
        input.value = Number.isInteger(newVal) ? newVal : newVal.toFixed(1);
    }
    updatePlayerShape();
});
document.getElementById('pbtn-close-shape').addEventListener('click', () => {
    document.getElementById('player-shape-panel').style.display = 'none';
    window.editingPlayerShape = null;
});
document.getElementById('pbtn-delete-shape').addEventListener('click', () => {
    if (!window.editingPlayerShape) return;
    network.send({
        type: 'PLAYER_DELETE_SHAPE',
        payload: { id: window.editingPlayerShape.id }
    });
    engine.shapes = engine.shapes.filter(s => s.id !== window.editingPlayerShape.id);
    document.getElementById('player-shape-panel').style.display = 'none';
    window.editingPlayerShape = null;
    engine.renderAll();
});


// Gestione Pannello Token Giocatore
function updatePlayerTokenAura() {
    if (!window.editingPlayerToken) return;
    
    const sizeRaw = parseFloat(document.getElementById('ptoken-aura-size').value) || 0;
    const unit = document.getElementById('ptoken-aura-unit').value;
    const squares = unit === 'ft' ? sizeRaw / 5 : sizeRaw / 1.5;
    
    window.editingPlayerToken.aura = {
        active: document.getElementById('ptoken-aura-active').checked,
        sizeRaw: sizeRaw,
        unit: unit,
        sizePx: squares * engine.grid.size,
        color: document.getElementById('ptoken-aura-color').value
    };
    
    engine.renderAll();
    
    // Manda l'aggiornamento al DM
    network.send({
        type: 'PLAYER_UPDATE_TOKEN_AURA',
        payload: {
            id: window.editingPlayerToken.id,
            auraObj: window.editingPlayerToken.aura
        }
    });
}
document.getElementById('ptoken-aura-active').addEventListener('change', updatePlayerTokenAura);
document.getElementById('ptoken-aura-size').addEventListener('input', updatePlayerTokenAura);
document.getElementById('ptoken-aura-unit').addEventListener('change', (e) => {
    const input = document.getElementById('ptoken-aura-size');
    const oldVal = parseFloat(input.value) || 0;
    if (e.target.value === 'ft') {
        input.step = '5';
        input.value = Math.round(oldVal / 1.5 * 5);
    } else {
        input.step = '1.5';
        let newVal = (oldVal / 5 * 1.5);
        input.value = Number.isInteger(newVal) ? newVal : newVal.toFixed(1);
    }
    updatePlayerTokenAura();
});
document.getElementById('ptoken-aura-color').addEventListener('input', updatePlayerTokenAura);
document.getElementById('pbtn-close-token').addEventListener('click', () => {
    document.getElementById('player-token-panel').style.display = 'none';
    window.editingPlayerToken = null;
});

