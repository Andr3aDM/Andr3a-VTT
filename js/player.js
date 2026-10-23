let wasViewSyncActive = false;
const engine = new VTTEngine('main-canvas-container', false); // isDM = false
let activeToken = null;
let isDragging = false;
let activeStroke = null;
let activeLaser = null;
let lastLaserSync = 0;
let pingTimeout = null;
let startMouseX = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let isMapLocked = false;
let startMouseY = 0;
window.VTT_VERSION = 'Beta 1.0';
const tokenImageCache = new Map();

function isTokenOwnedByLocalPlayer(token) {
    if (!token || !network || !network.playerName) return false;
    const myName = String(network.playerName).trim().toLowerCase();
    if (!myName) return false;
    if (Array.isArray(token.owners) && token.owners.length > 0) {
        return token.owners.some(o => String(o).trim().toLowerCase() === myName);
    }
    if (token.owner && typeof token.owner === 'string') {
        return token.owner.trim().toLowerCase() === myName;
    }
    return false;
}
window.isTokenOwnedByLocalPlayer = isTokenOwnedByLocalPlayer;

function createFallbackTokenBadge(name) {
    const fbCanvas = document.createElement('canvas');
    fbCanvas.width = 64;
    fbCanvas.height = 64;
    const fctx = fbCanvas.getContext('2d');
    fctx.fillStyle = '#546e7a';
    fctx.beginPath();
    fctx.arc(32, 32, 28, 0, Math.PI * 2);
    fctx.fill();
    fctx.lineWidth = 3;
    fctx.strokeStyle = '#ffffff';
    fctx.stroke();
    fctx.fillStyle = '#ffffff';
    fctx.font = 'bold 28px sans-serif';
    fctx.textAlign = 'center';
    fctx.textBaseline = 'middle';
    fctx.fillText((name || '?').charAt(0).toUpperCase(), 32, 32);
    const fbImg = new Image();
    fbImg.src = fbCanvas.toDataURL();
    return fbImg;
}

// Login logic
document.getElementById('btn-login-offline').addEventListener('click', () => {
    const name = document.getElementById('login-name').value.trim();
    if (name) network.playerName = name;
    engine.localPlayerName = name;
    document.getElementById('login-overlay').style.display = 'none';
    network.startOffline();
    network.send({ type: 'PLAYER_READY' });
});

// Auto-login per Modalità TV / Schermo Locale aperto da Regia Master (?mode=tv)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'tv') {
    const tvName = "Tavolo TV";
    network.playerName = tvName;
    engine.localPlayerName = tvName;
    const loginOverlay = document.getElementById('login-overlay');
    if (loginOverlay) loginOverlay.style.display = 'none';
    network.startOffline();
    network.send({ type: 'PLAYER_READY' });
}

// Prefill codice stanza se passato come parametro URL (?room=...)
const roomParam = urlParams.get('room');
if (roomParam) {
    const roomInput = document.getElementById('login-room');
    if (roomInput) roomInput.value = roomParam;
}

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

    if (data.type === 'DICE_ROLL') {
        if (data.payload.player !== network.playerName && window.appendRollToChat) {
            if (window.lastRollId === data.payload.id) return;
            window.lastRollId = data.payload.id;
            window.appendRollToChat(data.payload);
            const cp = document.getElementById('chat-panel');
            if (cp) cp.style.display = 'flex';
        }
    } else if (data.type === 'LASER_SYNC') {
        if (!engine.lasers) engine.lasers = [];
        const existing = engine.lasers.find(l => l.id === data.payload.id);
        if (existing) {
            existing.points = data.payload.points;
            existing.active = data.payload.active;
        } else {
            engine.lasers.push(data.payload);
        }
        engine.renderUI();
    } else if (data.type === 'ping' || data.type === 'PING') {
        const pData = data.payload || data;
        const pingId = pData.id || (pData.x + '_' + pData.y + '_' + (pData.t || ''));
        if (window.lastReceivedPlayerPingId === pingId) return;
        window.lastReceivedPlayerPingId = pingId;
        engine.pings.push({x: pData.x, y: pData.y, start: Date.now(), color: pData.color || '#ff0000'});
        engine.renderUI();
    } else if (data.type === 'REMOTE_TOKEN_MOVE') {
        if (activeToken && activeToken.type === 'token' && activeToken.ref && activeToken.ref.id === data.payload.id) return;
        const tok = engine.tokens.find(t => t.id === data.payload.id);
        if (tok) {
            tok.x = data.payload.x;
            tok.y = data.payload.y;
            engine.renderTokensLayer();
        }
    } else if (data.type === 'REMOTE_SHAPE_MOVE') {
        if (activeToken && activeToken.type === 'shape' && activeToken.ref && activeToken.ref.id === data.payload.id) return;
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s) {
            s.x = data.payload.x;
            s.y = data.payload.y;
            engine.renderTokensLayer();
        }
    } else if (data.type === 'VIEW_SYNC') {
        wasViewSyncActive = true;
        const p = data.payload;
        if (p && p.scale > 0 && engine.container) {
            engine.scale = p.scale;
            engine.offsetX = engine.container.clientWidth / 2 - p.centerX * engine.scale;
            engine.offsetY = engine.container.clientHeight / 2 - p.centerY * engine.scale;
            engine.renderViewport();
        }
    } else if (data.type === 'GRID_MOVE_LIVE') {
        if (!engine.grid) engine.grid = {};
        engine.grid.offsetX = data.payload.offsetX;
        engine.grid.offsetY = data.payload.offsetY;
        engine.renderAll();
    } else if (data.type === 'LIVE_DRAW_POINT') {
        const p = data.payload;
        const ctx = engine.ctx.drawPublic;
        if (ctx && p && p.point) {
            ctx.beginPath();
            ctx.arc(p.point.x, p.point.y, (p.width || 10) / 2, 0, Math.PI * 2);
            ctx.fillStyle = p.color || '#ff0000';
            ctx.fill();
        }
    } else if (data.type === 'HANDOUT_RECT_LIVE') {
        const hw = document.getElementById('handout-window');
        if (hw && data.payload) {
            if (data.payload.left) hw.style.left = data.payload.left;
            if (data.payload.top) hw.style.top = data.payload.top;
            if (data.payload.width) hw.style.width = data.payload.width;
            if (data.payload.height) hw.style.height = data.payload.height;
        }
    } else if (data.type === 'MAP_UPDATE') {
        if (!data.payload) return;
        const mapSig = data.payload.length + '_' + data.payload.slice(0, 64) + '_' + data.payload.slice(-64);
        if (window._lastPlayerMapSig === mapSig && engine.mapImage) {
            return; // Ignora MAP_UPDATE duplicati per evitare ricaricamenti e schermate nere
        }
        window._lastPlayerMapSig = mapSig;
        const img = new Image();
        img.onload = () => {
            engine.setMap(img);
            if (engine.pendingFogImage) {
                engine.applyFogImage(engine.pendingFogImage);
                engine.pendingFogImage = null;
            }
        };
        img.src = data.payload;
    } else if (data.type === 'TOKEN_IMAGE_SYNC') {
        const p = data.payload;
        if (p && p.imgKey && p.src) {
            const img = new Image();
            img.onload = () => {
                tokenImageCache.set(p.imgKey, img);
                let updated = false;
                engine.tokens.forEach(tok => {
                    if (tok.imgKey === p.imgKey) {
                        tok.imageObj = img;
                        tok.src = p.src;
                        tokenImageCache.set('id_' + tok.id, img);
                        updated = true;
                    }
                });
                if (updated) {
                    engine.renderTokensLayer();
                }
            };
            img.src = p.src;
        }
    } else if (data.type === 'SHARED_IMAGE_DATA') {
        if (data.imageId === currentSharedImageId) {
            document.getElementById('handout-image').src = data.data;
        }
    } else if (data.type === 'STATE_SYNC') {
        const state = data.payload;
        if (state.audioState && window.syncPlayerAudio) {
            window.syncPlayerAudio(state.audioState);
        }
        
        if (state.sharedImageId !== currentSharedImageId) {
            currentSharedImageId = state.sharedImageId;
            if (currentSharedImageId) {
                document.getElementById('handout-window').style.display = 'flex';
                document.getElementById('handout-image').src = ''; // Clear old
                network.send({ type: 'REQUEST_IMAGE', imageId: currentSharedImageId });
            } else {
                document.getElementById('handout-window').style.display = 'none';
            }
        }
        
        if (state.sharedImageRect) {
            const hw = document.getElementById('handout-window');
            hw.style.left = state.sharedImageRect.left;
            hw.style.top = state.sharedImageRect.top;
            hw.style.width = state.sharedImageRect.width;
            hw.style.height = state.sharedImageRect.height;
        }
        
        // Sync HP Display Style
        engine.hpDisplayStyle = state.hpDisplayStyle || 'bar';
        
        // Sync Condition Style
        engine.conditionDisplayStyle = state.conditionDisplayStyle || 'concentric';

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

        // Se il DM ha revocato il controllo del token mentre il player lo stava muovendo o modificando, rilascia immediatamente!
        state.tokens.forEach(incomingTok => {
            const stillOwned = isTokenOwnedByLocalPlayer(incomingTok);
            if (!stillOwned) {
                if (activeToken && activeToken.type === 'token' && activeToken.ref && activeToken.ref.id === incomingTok.id) {
                    activeToken = null;
                    isDragging = false;
                }
                if (window.editingPlayerToken && window.editingPlayerToken.id === incomingTok.id) {
                    window.editingPlayerToken = null;
                    const ptp = document.getElementById('player-token-panel');
                    if (ptp) ptp.style.display = 'none';
                }
                return;
            }
            const localTok = engine.tokens.find(t => t.id === incomingTok.id);
            if (activeToken && activeToken.type === 'token' && activeToken.ref && activeToken.ref.id === incomingTok.id) {
                incomingTok.x = activeToken.ref.x;
                incomingTok.y = activeToken.ref.y;
                incomingTok._lastLocalEdit = activeToken.ref._lastLocalEdit || Date.now();
            } else if (localTok && localTok._lastLocalEdit && Date.now() - localTok._lastLocalEdit < 2000) {
                incomingTok.x = localTok.x;
                incomingTok.y = localTok.y;
                incomingTok._lastLocalEdit = localTok._lastLocalEdit;
            }
        });
        
        if (state.shapes) {
            state.shapes.forEach(incomingShape => {
                const localShape = engine.shapes.find(s => s.id === incomingShape.id);
                if (activeToken && activeToken.type === 'shape' && activeToken.ref && activeToken.ref.id === incomingShape.id) {
                    incomingShape.x = activeToken.ref.x;
                    incomingShape.y = activeToken.ref.y;
                    incomingShape._lastLocalEdit = activeToken.ref._lastLocalEdit || Date.now();
                } else if (localShape && localShape._lastLocalEdit && Date.now() - localShape._lastLocalEdit < 2000) {
                    incomingShape.x = localShape.x;
                    incomingShape.y = localShape.y;
                    incomingShape._lastLocalEdit = localShape._lastLocalEdit;
                }
            });
        }

        engine.publicStrokes = state.publicStrokes || [];
        engine.shapes = state.shapes || [];

        // --- View Sync Logic ---
        // Nota: la visibilità della barra strumenti è gestita localmente dal giocatore / schermo TV tramite togglePlayerToolbar
        
        if (typeof state.lockMap !== 'undefined') {
            const wasLocked = isMapLocked;
            isMapLocked = state.lockMap;
            if (isMapLocked && !wasLocked) {
                engine.fitToScreen();
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

        if (state.tokens.length === 0) {
            engine.tokens = [];
            engine.renderAll();
            return;
        }

        if (!window._requestedImgKeysAt) window._requestedImgKeysAt = new Map();
        const nowMs = Date.now();

        // RENDERING SINCRONO ISTANTANEO (0ms):
        // Aggiorna posizioni, aure, visibilità e PV immediatamente senza attendere il caricamento asincrono delle immagini!
        const finalTokens = state.tokens.map(t => {
            const existing = engine.tokens.find(et => et.id === t.id);

            if (t.imgKey && tokenImageCache.has(t.imgKey)) {
                t.imageObj = tokenImageCache.get(t.imgKey);
                tokenImageCache.set('id_' + t.id, t.imageObj);
                return t;
            }
            if (existing && existing.imageObj && (!t.imgKey || !existing.imgKey || existing.imgKey === t.imgKey)) {
                t.imageObj = existing.imageObj;
                if (t.imgKey && !existing.imageObj._isFallbackBadge) tokenImageCache.set(t.imgKey, existing.imageObj);
                return t;
            }
            if (t.src && tokenImageCache.has(t.src)) {
                t.imageObj = tokenImageCache.get(t.src);
                if (t.imgKey) tokenImageCache.set(t.imgKey, t.imageObj);
                return t;
            }
            if (tokenImageCache.has('id_' + t.id)) {
                t.imageObj = tokenImageCache.get('id_' + t.id);
                return t;
            }

            // Mostra immediatamente il badge provvisorio così il token e la sua aura sono visibili al millisecondo 0
            const badge = createFallbackTokenBadge(t.name);
            badge._isFallbackBadge = true;
            t.imageObj = badge;

            if (t.src) {
                const img = new Image();
                img.onload = () => {
                    t.imageObj = img;
                    if (t.src) tokenImageCache.set(t.src, img);
                    if (t.imgKey) tokenImageCache.set(t.imgKey, img);
                    tokenImageCache.set('id_' + t.id, img);
                    engine.renderTokensLayer();
                };
                img.src = t.src;
            } else if (t.imgKey) {
                const lastReq = window._requestedImgKeysAt.get(t.imgKey) || 0;
                if (nowMs - lastReq > 3000) {
                    window._requestedImgKeysAt.set(t.imgKey, nowMs);
                    network.send({ type: 'REQUEST_TOKEN_IMAGE', imgKey: t.imgKey });
                }
            }
            return t;
        });

        if (activeToken) {
            const dragId = activeToken.ref.id;
            const dragX = activeToken.ref.x;
            const dragY = activeToken.ref.y;
            const dragEdit = activeToken.ref._lastLocalEdit;
            
            engine.tokens = finalTokens;
            
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
            engine.tokens = finalTokens;
        }
        engine.renderAll();
    } else if (data.type === 'FOG_SYNC') {
        engine.pendingFogImage = data.payload;
        if (engine.mapImage) {
            engine.applyFogImage(data.payload);
        }
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
let currentSharedImageId = null;
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
        widthFt: type === 'line' ? 5 : undefined,
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
document.getElementById('pbtn-square').addEventListener('click', () => spawnShape('square'));

document.getElementById('pbtn-clear-my-drawings')?.addEventListener('click', () => {
    const myOwner = (network.playerName || 'local').trim();
    const normOwner = myOwner.toLowerCase();
    if (engine.publicStrokes && engine.publicStrokes.length > 0) {
        engine.publicStrokes = engine.publicStrokes.filter(st => {
            const stOwner = (st.owner || '').trim().toLowerCase();
            return stOwner !== normOwner;
        });
        engine.renderAll();
    }
    network.send({
        type: 'PLAYER_CLEAR_DRAWINGS',
        payload: { owner: myOwner }
    });
});

// --- GESTIONE BARRA STRUMENTI PLAYER & TV (DEFAULT NASCOSTA) ---
const btnToggleToolbar = document.getElementById('btn-toggle-toolbar');
const ptb = document.getElementById('player-toolbar');
const btnCloseToolbar = document.getElementById('pbtn-close-toolbar');

function togglePlayerToolbar(forceState) {
    if (!ptb) return;
    const isCurrentlyOpen = ptb.style.display === 'flex';
    const nextState = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;
    ptb.style.display = nextState ? 'flex' : 'none';
    if (btnToggleToolbar) {
        btnToggleToolbar.classList.toggle('active', nextState);
        btnToggleToolbar.innerHTML = nextState ? '✕' : '🛠️';
        btnToggleToolbar.title = nextState ? 'Nascondi Strumenti (Tasto H)' : 'Mostra Strumenti (Tasto H)';
    }
    // Se chiusa, chiudi anche i sottomenu aperti (dadi, chat, audio)
    if (!nextState) {
        const dp = document.getElementById('dice-panel');
        if (dp) dp.style.display = 'none';
        const cp = document.getElementById('chat-panel');
        if (cp) cp.style.display = 'none';
        const ap = document.getElementById('player-audio-panel');
        if (ap) ap.style.display = 'none';
    }
}

if (btnToggleToolbar) {
    btnToggleToolbar.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayerToolbar();
    });
}
if (btnCloseToolbar) {
    btnCloseToolbar.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayerToolbar(false);
    });
}

// Scorciatoia da tastiera 'H' per mostrare/nascondere la barra strumenti
window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
    if (e.key === 'h' || e.key === 'H') {
        togglePlayerToolbar();
    }
});


// --- PLAYER INPUT LOGIC ---
const uiLayer = document.getElementById('main-canvas-container');

function getEventPos(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

function pHandleStart(e) {
    // Rimosso blocco offline no-name per permettere il panning
    e.preventDefault();
    const pos = getEventPos(e);
    
    // Track per capire se è un click o un drag
    if (e.touches && e.touches.length > 0) {
        startMouseX = e.touches[0].clientX;
        startMouseY = e.touches[0].clientY;
    } else {
        startMouseX = e.clientX;
        startMouseY = e.clientY;
    }
    
    if (!isMapLocked && (e.button === 1 || e.button === 2)) {
        isPanning = true;
        startPanX = pos.x - engine.offsetX;
        startPanY = pos.y - engine.offsetY;
        return;
    }
    
    const worldPos = engine.screenToWorld(pos.x, pos.y);
    
    if (currentTool === 'laser') {
        isDragging = true;
        activeLaser = {
            id: Date.now() + '_' + Math.random(),
            color: '#00ffcc',
            active: true,
            points: [{x: worldPos.x, y: worldPos.y, t: Date.now()}]
        };
        const colors = ['#ff0055', '#00ffcc', '#ffff00', '#ff8800', '#ff00ff', '#55ff00'];
        activeLaser.color = colors[Math.floor(Math.random() * colors.length)];
        
        if (!engine.lasers) engine.lasers = [];
        engine.lasers.push(activeLaser);
        
        engine.renderUI();
        return;
    }
    
    if (currentTool === 'draw') {
        isDragging = true;
        activeStroke = {
            id: 'stroke_' + Date.now() + Math.floor(Math.random()*1000),
            owner: network.playerName || 'local',
            color: document.getElementById('player-color').value,
            width: 10,
            points: [worldPos]
        };
        return;
    }
    
    if (currentTool === 'ruler') {
        isDragging = true;
        engine.ruler = { startX: worldPos.x, startY: worldPos.y, endX: worldPos.x, endY: worldPos.y };
        engine.renderUI();
        return;
    }
    
    if (currentTool === 'move') {
        let hitEntity = false;
        
        // Cerca token di proprietà (supporta assegnazione singola o multi-giocatore)
        for (let i = engine.tokens.length - 1; i >= 0; i--) {
            const t = engine.tokens[i];
            if (isTokenOwnedByLocalPlayer(t) && 
                worldPos.x >= t.x && worldPos.x <= t.x + t.width &&
                worldPos.y >= t.y && worldPos.y <= t.y + t.height) {
                
                activeToken = { type: 'token', ref: t };
                isDragging = true;
                hitEntity = true;
                return;
            }
        }
        
        // Cerca shape
        for (let i = engine.shapes.length - 1; i >= 0; i--) {
            const s = engine.shapes[i];
            if (!s.visible) continue;
            if (s.owner !== network.playerName) continue;

            const dist = Math.hypot(worldPos.x - s.x, worldPos.y - s.y);
            if (dist <= 20 / engine.scale) {
                activeToken = { type: 'shape', ref: s };
                isDragging = true;
                hitEntity = true;
                return;
            }
        }
        
        // Se non ha colpito nulla, avvia il pan
        if (!hitEntity && !isMapLocked) {
            isPanning = true;
            startPanX = pos.x - engine.offsetX;
            startPanY = pos.y - engine.offsetY;
        }
    }
    
    // Ping Timer (solo se non sta draggando qualcosa)
    if (currentTool === 'move' && !isDragging) {
        pingTimeout = setTimeout(() => {
            pingTimeout = null;
            const pId = 'p_ping_' + Date.now();
            engine.pings.push({id: pId, x: worldPos.x, y: worldPos.y, start: Date.now(), color: pColor});
            engine.renderUI();
            network.send({type: 'PING', payload: {id: pId, x: worldPos.x, y: worldPos.y, color: pColor, t: Date.now()}});
        }, 500);
    }
}

function pHandleMove(e) {
    const pos = getEventPos(e);
    const moveRawX = e.touches ? e.touches[0].clientX : e.clientX;
    const moveRawY = e.touches ? e.touches[0].clientY : e.clientY;
    
    if (pingTimeout && (Math.abs(moveRawX - startMouseX) > 5 || Math.abs(moveRawY - startMouseY) > 5)) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
    }
    
    if (!isDragging && !isPanning) return;
    e.preventDefault();
    
    if (isPanning) {
        engine.offsetX = pos.x - startPanX;
        engine.offsetY = pos.y - startPanY;
        engine.renderViewport();
        return;
    }
    
    const worldPos = engine.screenToWorld(pos.x, pos.y);
    
    if (currentTool === 'move' && activeToken) {
        if (activeToken.type === 'token') {
            activeToken.ref.x = worldPos.x - activeToken.ref.width / 2;
            activeToken.ref.y = worldPos.y - activeToken.ref.height / 2;
            activeToken.ref._lastLocalEdit = Date.now();
            engine.renderTokensLayer();
            
            if (Date.now() - (window.lastMoveSend || 0) > 40) {
                network.send({
                    type: 'PLAYER_MOVE_TOKEN',
                    payload: { id: activeToken.ref.id, x: activeToken.ref.x, y: activeToken.ref.y, player: network.playerName }
                });
                window.lastMoveSend = Date.now();
            }
        } else if (activeToken.type === 'shape') {
            activeToken.ref.x = worldPos.x;
            activeToken.ref.y = worldPos.y;
            activeToken.ref._lastLocalEdit = Date.now();
            engine.renderTokensLayer();
            
            if (Date.now() - (window.lastMoveSend || 0) > 40) {
                network.send({
                    type: 'PLAYER_MOVE_SHAPE',
                    payload: { id: activeToken.ref.id, x: activeToken.ref.x, y: activeToken.ref.y }
                });
                window.lastMoveSend = Date.now();
            }
        }
    }
    else if (currentTool === 'laser' && activeLaser) {
        activeLaser.points.push({x: worldPos.x, y: worldPos.y, t: Date.now()});
        if (Date.now() - lastLaserSync > 50) {
            network.send({ type: 'LASER_SYNC', payload: activeLaser });
            lastLaserSync = Date.now();
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
    if (isPanning) {
        isPanning = false;
        return;
    }
    if (!isDragging) return;
    isDragging = false;
    
    if (currentTool === 'move' && activeToken) {
        const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
        const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
        
        if (activeToken.type === 'token') {
            const targetX = Math.round((activeToken.ref.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
            const targetY = Math.round((activeToken.ref.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
            activeToken.ref.x = targetX;
            activeToken.ref.y = targetY;
            activeToken.ref._lastLocalEdit = Date.now();
            const localTok = engine.tokens.find(t => t.id === activeToken.ref.id);
            if (localTok) {
                localTok.x = targetX;
                localTok.y = targetY;
                localTok._lastLocalEdit = Date.now();
            }
            engine.renderAll();
            network.send({
                type: 'PLAYER_END_TOKEN',
                payload: { id: activeToken.ref.id, x: targetX, y: targetY, player: network.playerName }
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
            
            const localShape = engine.shapes.find(s => s.id === activeToken.ref.id);
            if (localShape) {
                localShape.x = activeToken.ref.x;
                localShape.y = activeToken.ref.y;
                localShape._lastLocalEdit = Date.now();
            }
            network.send({
                type: 'PLAYER_END_SHAPE',
                payload: { id: activeToken.ref.id, x: activeToken.ref.x, y: activeToken.ref.y }
            });
            
            let endX = e.clientX; let endY = e.clientY;
            if (e.changedTouches && e.changedTouches.length > 0) {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
            }
            if (Math.abs(endX - startMouseX) < 10 && Math.abs(endY - startMouseY) < 10) {
                document.getElementById('player-shape-panel').style.display = 'block';
                document.getElementById('pshape-width').style.display = activeToken.ref.type === 'line' ? 'block' : 'none';
                let sVal = activeToken.ref.sizeFt || 15;
                let wVal = activeToken.ref.widthFt || 5;
                if (document.getElementById('pshape-unit').value === 'm') {
                    sVal = (sVal / 5) * 1.5;
                    wVal = (wVal / 5) * 1.5;
                }
                document.getElementById('pshape-size').value = Number.isInteger(sVal) ? sVal : sVal.toFixed(1);
                document.getElementById('pshape-width').value = Number.isInteger(wVal) ? wVal : wVal.toFixed(1);
                document.getElementById('pshape-angle').value = activeToken.ref.angle || 0;
                document.getElementById('pshape-color').value = activeToken.ref.color || '#00ffff';
                window.editingPlayerShape = activeToken.ref;
            }
        }
        activeToken = null;
    }
    else if (currentTool === 'laser' && activeLaser) {
        activeLaser.active = false;
        network.send({ type: 'LASER_SYNC', payload: activeLaser });
        activeLaser = null;
    }
    else if (currentTool === 'draw' && activeStroke) {
        if (!activeStroke.owner) activeStroke.owner = network.playerName || 'local';
        engine.publicStrokes.push(activeStroke);
        engine.renderAll();
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


uiLayer.addEventListener('contextmenu', e => e.preventDefault());

uiLayer.addEventListener('wheel', (e) => {
    if (isMapLocked) return;
    e.preventDefault();
    const pos = getEventPos(e);
    const worldPosBefore = engine.screenToWorld(pos.x, pos.y);
    
    if (e.deltaY < 0) engine.scale *= 1.1;
    else engine.scale /= 1.1;
    
    engine.offsetX = pos.x - worldPosBefore.x * engine.scale;
    engine.offsetY = pos.y - worldPosBefore.y * engine.scale;
    engine.renderViewport();
});

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
    
    let _raw = parseFloat(document.getElementById('pshape-size').value); if(isNaN(_raw)) _raw = 0; const sizeRaw = Math.max(0.1, _raw);
    let _w = parseFloat(document.getElementById('pshape-width').value); if(isNaN(_w)) _w = 5; _w = Math.max(0.1, _w);
    const unit = document.getElementById('pshape-unit').value;
    
    window.editingPlayerShape.sizeFt = unit === 'm' ? (sizeRaw / 1.5) * 5 : sizeRaw;
    window.editingPlayerShape.widthFt = unit === 'm' ? (_w / 1.5) * 5 : _w;
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
document.getElementById('pshape-width').addEventListener('input', updatePlayerShape);
document.getElementById('pshape-angle').addEventListener('input', updatePlayerShape);
document.getElementById('pshape-color').addEventListener('input', updatePlayerShape);
document.getElementById('pshape-unit').addEventListener('change', (e) => {
    const input = document.getElementById('pshape-size');
    const inputW = document.getElementById('pshape-width');
    let oldVal = parseFloat(input.value); if(isNaN(oldVal)) oldVal = 0;
    let oldW = parseFloat(inputW.value); if(isNaN(oldW)) oldW = 5;
    if (e.target.value === 'ft') {
        input.step = '5';
        input.value = Math.round(oldVal / 1.5 * 5);
        inputW.step = '1';
        inputW.value = Math.round(oldW / 1.5 * 5);
    } else {
        input.step = '1.5';
        let newVal = (oldVal / 5 * 1.5);
        input.value = Number.isInteger(newVal) ? newVal : newVal.toFixed(1);
        inputW.step = '0.5';
        let newW = (oldW / 5 * 1.5);
        inputW.value = Number.isInteger(newW) ? newW : newW.toFixed(1);
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
    
    let _raw = parseFloat(document.getElementById('ptoken-aura-size').value); if(isNaN(_raw)) _raw = 0; const sizeRaw = Math.max(0.1, _raw);
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
    
    if (!isTokenOwnedByLocalPlayer(window.editingPlayerToken)) {
        document.getElementById('player-token-panel').style.display = 'none';
        window.editingPlayerToken = null;
        return;
    }
    // Manda l'aggiornamento al DM
    network.send({
        type: 'PLAYER_UPDATE_TOKEN_AURA',
        payload: {
            id: window.editingPlayerToken.id,
            auraObj: window.editingPlayerToken.aura,
            player: network.playerName
        }
    });
}
document.getElementById('ptoken-aura-active').addEventListener('change', updatePlayerTokenAura);
document.getElementById('ptoken-aura-size').addEventListener('input', updatePlayerTokenAura);
document.getElementById('ptoken-aura-unit').addEventListener('change', (e) => {
    const input = document.getElementById('ptoken-aura-size');
    let oldVal = parseFloat(input.value); if(isNaN(oldVal)) oldVal = 0;
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






// Player self close
document.getElementById('btn-handout-close-self').addEventListener('click', () => {
    document.getElementById('handout-window').style.display = 'none';
});

// Inizializza Sistema Dadi
if (window.setupDiceSystem) {
    window.setupDiceSystem(false, network);
}

// Inizializza Sistema Audio & Soundboard
if (window.setupAudioSystem) {
    window.setupAudioSystem(false, network);
}
