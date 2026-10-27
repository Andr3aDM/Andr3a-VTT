let wasViewSyncActive = false;
const engine = new VTTEngine('main-canvas-container', false); // isDM = false
window.engine = engine;
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
window.VTT_VERSION = 'Beta 1.4';
const tokenImageCache = new Map();
const tokenPcSheetCache = new Map();
let lastPlayerClickedTokenId = null;
let lastPlayerClickedTokenTime = 0;
let isHandoutControlledByDm = false;

function setHandoutControlledByDm(controlled) {
    isHandoutControlledByDm = !!controlled;
    const hw = document.getElementById('handout-window');
    const hwHeader = document.getElementById('handout-header');
    if (!hw) return;
    if (isHandoutControlledByDm) {
        hw.style.resize = 'none';
        if (hwHeader) hwHeader.style.cursor = 'default';
    } else {
        hw.style.resize = 'both';
        if (hwHeader) hwHeader.style.cursor = 'move';
    }
}

function applyHandoutRect(payload) {
    const hw = document.getElementById('handout-window');
    const mapEl = document.getElementById('main-canvas-container');
    if (!hw || !payload) return;
    window.lastHandoutRectPayload = payload;

    // Imposta dimensioni (rispettando i limiti massimi della viewport)
    let w = parseInt(payload.width) || 500;
    let h = parseInt(payload.height) || 500;
    const maxW = Math.max(200, window.innerWidth - 40);
    const maxH = Math.max(200, window.innerHeight - 40);
    w = Math.min(w, maxW);
    h = Math.min(h, maxH);
    hw.style.width = w + 'px';
    hw.style.height = h + 'px';

    const mapRect = mapEl ? mapEl.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const availW = mapRect.width - w;
    const availH = mapRect.height - h;

    let targetLeft, targetTop;

    if (payload.ratioX !== undefined && availW > 0) {
        // Posizionamento proporzionale perfetto sulla mappa del player (escludendo la sidebar del DM)
        targetLeft = mapRect.left + (payload.ratioX * availW);
    } else if (payload.offsetX !== undefined) {
        targetLeft = mapRect.left + payload.offsetX;
    } else if (payload.left) {
        targetLeft = parseInt(payload.left) || 100;
    } else {
        targetLeft = (window.innerWidth - w) / 2;
    }

    if (payload.ratioY !== undefined && availH > 0) {
        targetTop = mapRect.top + (payload.ratioY * availH);
    } else if (payload.offsetY !== undefined) {
        targetTop = mapRect.top + payload.offsetY;
    } else if (payload.top) {
        targetTop = parseInt(payload.top) || 100;
    } else {
        targetTop = 100;
    }

    // Assicura che la finestra rimanga sempre all'interno dello schermo del giocatore
    targetLeft = Math.max(10, Math.min(window.innerWidth - w - 10, targetLeft));
    targetTop = Math.max(10, Math.min(window.innerHeight - h - 10, targetTop));

    hw.style.left = Math.round(targetLeft) + 'px';
    hw.style.top = Math.round(targetTop) + 'px';
    hw.style.right = 'auto';
    hw.style.bottom = 'auto';
}

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

// Auto-login per Modalità TV / Schermo Locale aperto da Regia Master (?mode=tv o ?mode=local)
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

const nameParam = urlParams.get('name');
if (nameParam) {
    const nameInput = document.getElementById('login-name');
    if (nameInput) nameInput.value = nameParam;
}
if (urlParams.get('mode') === 'local' && nameParam) {
    network.playerName = nameParam;
    engine.localPlayerName = nameParam;
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

if (urlParams.get('autojoin') === 'true' && roomParam && nameParam) {
    setTimeout(() => {
        const btnJoin = document.getElementById('btn-login-online');
        if (btnJoin) btnJoin.click();
    }, 400);
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
            const msg = (err && err.message) ? err.message : "Errore di connessione. Verifica il codice stanza.";
            status.innerText = msg;
            console.error("Join Room Error:", err);
            alert(msg);
        });
    } catch(e) {
        alert("Errore javascript nel click: " + e.message);
    }
});

let playerToastTimeout = null;
function showPlayerToast(msg) {
    if (typeof window.t === 'function') msg = window.t(msg);
    let t = document.getElementById('player-toast-msg');
    if (!t) {
        t = document.createElement('div');
        t.id = 'player-toast-msg';
        t.style.position = 'fixed';
        t.style.top = '20px';
        t.style.left = '50%';
        t.style.transform = 'translateX(-50%)';
        t.style.boxShadow = '0 4px 12px rgba(0,0,0,0.6)';
        t.style.color = 'white';
        t.style.padding = '10px 20px';
        t.style.borderRadius = '6px';
        t.style.zIndex = '10000';
        t.style.fontWeight = 'bold';
        t.style.fontSize = '13px';
        t.style.transition = 'opacity 0.25s';
        t.style.pointerEvents = 'none';
        document.body.appendChild(t);
    }
    if (msg.includes('🔴')) {
        t.style.background = 'rgba(198, 40, 40, 0.95)';
        t.style.border = '1px solid #ef5350';
    } else if (msg.includes('🔄')) {
        t.style.background = 'rgba(21, 101, 192, 0.95)';
        t.style.border = '1px solid #64b5f6';
    } else {
        t.style.background = 'rgba(46, 125, 50, 0.95)';
        t.style.border = '1px solid #81c784';
    }
    t.innerText = msg;
    t.style.opacity = '1';
    if (playerToastTimeout) clearTimeout(playerToastTimeout);
    playerToastTimeout = setTimeout(() => {
        t.style.opacity = '0';
        playerToastTimeout = null;
    }, 3200);
}
window.showToast = showPlayerToast;

if (typeof network.onDisconnect === 'function') {
    network.onDisconnect(() => {
        showPlayerToast(typeof window.t === 'function' ? window.t('🔴 Connessione con il Master interrotta.') : '🔴 Connessione con il Master interrotta.');
    });
}

network.onMessage((data, peerId) => {

    if (data.type === 'PLAYER_DISCONNECTED_NOTICE') {
        const left = data.payload?.name;
        if (left) {
            const pfx = typeof window.t === 'function' ? window.t('🔴 Giocatore disconnesso:') : '🔴 Giocatore disconnesso:';
            showPlayerToast(pfx + ' ' + left);
        }
    } else if (data.type === 'PLAYER_CONNECTED_NOTICE') {
        const joined = data.payload?.name;
        const isRec = data.payload?.isReconnect;
        if (joined && joined !== network.playerName) {
            const pfx = isRec
                ? (typeof window.t === 'function' ? window.t('🔄 Giocatore riconnesso:') : '🔄 Giocatore riconnesso:')
                : (typeof window.t === 'function' ? window.t('🟢 Giocatore connesso:') : '🟢 Giocatore connesso:');
            showPlayerToast(pfx + ' ' + joined);
        }
    } else if (data.type === 'DICE_ROLL') {
        const payload = data.payload || {};
        const isFromMe = (payload.sender && payload.sender === network.playerName) ||
                         (payload.senderPeerId && payload.senderPeerId === network.myPeerId) ||
                         (payload.player === network.playerName);
        if (isFromMe) return; // Non duplicare i propri tiri ricevuti indietro dal DM o BroadcastChannel

        if (window.appendRollToChat) {
            if (window.lastRollId === payload.id) return;
            window.lastRollId = payload.id;
            window.appendRollToChat(payload);
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
        engine.pings.push({id: pingId, x: pData.x, y: pData.y, start: Date.now(), color: pData.color || '#ff0000'});
        engine.renderUI();
    } else if (data.type === 'REMOTE_TOKEN_MOVE') {
        if (activeToken && activeToken.type === 'token' && activeToken.ref && activeToken.ref.id === data.payload.id) return;
        const tok = engine.tokens.find(t => t.id === data.payload.id);
        if (tok) {
            tok.x = data.payload.x;
            tok.y = data.payload.y;
            if (data.final) {
                engine.renderTokensLayer();
            } else {
                engine.requestTokenLayerRender();
            }
        }
    } else if (data.type === 'REMOTE_TOKENS_MOVE_BATCH') {
        if (Array.isArray(data.payload)) {
            data.payload.forEach(item => {
                if (activeToken && activeToken.type === 'token' && activeToken.ref && activeToken.ref.id === item.id) return;
                const tok = engine.tokens.find(t => t.id === item.id);
                if (tok) {
                    tok.x = item.x;
                    tok.y = item.y;
                }
            });
            if (data.final) {
                engine.renderTokensLayer();
            } else {
                engine.requestTokenLayerRender();
            }
        }
    } else if (data.type === 'REMOTE_SHAPE_MOVE') {
        if (activeToken && activeToken.type === 'shape' && activeToken.ref && activeToken.ref.id === data.payload.id) return;
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s) {
            s.x = data.payload.x;
            s.y = data.payload.y;
            if (data.final) {
                engine.renderTokensLayer();
            } else {
                engine.requestTokenLayerRender();
            }
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
        if (data.payload.anchor && data.payload.dx !== undefined && data.payload.dy !== undefined) {
            if (!window._playerLiveGridStart) {
                window._playerLiveGridStart = {
                    tokens: engine.tokens.map(t => ({ token: t, startX: t.x, startY: t.y })),
                    shapes: (engine.shapes || []).map(s => ({ shape: s, startX: s.x, startY: s.y }))
                };
            }
            window._playerLiveGridStart.tokens.forEach(item => {
                item.token.x = item.startX + data.payload.dx;
                item.token.y = item.startY + data.payload.dy;
            });
            window._playerLiveGridStart.shapes.forEach(item => {
                item.shape.x = item.startX + data.payload.dx;
                item.shape.y = item.startY + data.payload.dy;
            });
        }
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
            if (data.payload.syncHandout !== undefined) {
                setHandoutControlledByDm(data.payload.syncHandout);
            }
            if (isHandoutControlledByDm) {
                applyHandoutRect(data.payload);
            }
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
    } else if (data.type === 'PC_SHEET_SYNC') {
        const p = data.payload;
        if (p && p.tokenId && p.pcSheet) {
            tokenPcSheetCache.set(p.tokenId, p.pcSheet);
            const tok = engine.tokens.find(t => t.id === p.tokenId);
            if (tok) {
                tok.pcSheet = p.pcSheet;
                tok.hasPcSheet = true;
                tok.pcSheetVer = p.pcSheet.updatedAt || 1;
                if (p.adventureJournal !== undefined) {
                    tok.adventureJournal = p.adventureJournal;
                }
            }
            if (window.pcSheetManager) {
                window.pcSheetManager.refreshIfOpen(p.tokenId);
            }
        }
    } else if (data.type === 'TOKEN_JOURNAL_SYNC') {
        const p = data.payload;
        if (p && p.tokenId) {
            const tok = engine.tokens.find(t => t.id === p.tokenId);
            if (tok) {
                tok.adventureJournal = p.adventureJournal || '';
            }
            if (window.pcSheetManager && window.pcSheetManager.refreshIfOpen) {
                window.pcSheetManager.refreshIfOpen(p.tokenId);
            }
        }
    } else if (data.type === 'SHARED_IMAGE_DATA') {
        if (data.imageId === currentSharedImageId) {
            document.getElementById('handout-image').src = data.data;
        }
    } else if (data.type === 'STATE_SYNC') {
        window._playerLiveGridStart = null;
        const state = data.payload;
        if (state.audioState && window.syncPlayerAudio) {
            window.syncPlayerAudio(state.audioState);
        }
        
        if (state.sharedImageId !== currentSharedImageId) {
            currentSharedImageId = state.sharedImageId;
            const hw = document.getElementById('handout-window');
            if (currentSharedImageId) {
                if (hw) {
                    hw.style.display = 'flex';
                    setHandoutControlledByDm(!!state.syncHandout);
                    // Se il Master comanda la posizione oppure se il player non l'ha ancora posizionata:
                    if (state.sharedImageRect && (state.syncHandout || !hw.dataset.userPositioned)) {
                        applyHandoutRect(state.sharedImageRect);
                    }
                }
                document.getElementById('handout-image').src = ''; // Clear old
                network.send({ type: 'REQUEST_IMAGE', imageId: currentSharedImageId });
            } else {
                // CHIUSURA FORZATA DAL MASTER (SEMPRE):
                if (hw) {
                    hw.style.display = 'none';
                    delete hw.dataset.userPositioned;
                }
                const img = document.getElementById('handout-image');
                if (img) img.src = '';
            }
        } else {
            // L'immagine è già la stessa
            const hw = document.getElementById('handout-window');
            if (state.sharedImageId) {
                setHandoutControlledByDm(!!state.syncHandout);
                if (state.syncHandout && state.sharedImageRect && hw) {
                    applyHandoutRect(state.sharedImageRect);
                }
            } else if (hw) {
                // Se non c'è sharedImageId, assicurati che sia chiusa SEMPRE
                hw.style.display = 'none';
                delete hw.dataset.userPositioned;
                const img = document.getElementById('handout-image');
                if (img) img.src = '';
            }
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
                trackerDiv.style.display = 'flex';
                trackerDiv.style.flexDirection = 'column';
                trackerDiv.style.top = 'auto';
                trackerDiv.style.bottom = 'auto';
                trackerDiv.style.left = 'auto';
                trackerDiv.style.right = 'auto';
                trackerDiv.style.transform = 'none';
                trackerDiv.style.boxSizing = 'border-box';

                const pos = state.initiative.playerPosition || 'top';
                const isVertical = (pos === 'left' || pos === 'right');

                if (pos === 'top') {
                    trackerDiv.style.top = '12px';
                    trackerDiv.style.left = '50%';
                    trackerDiv.style.transform = 'translateX(-50%)';
                    trackerDiv.style.maxWidth = 'calc(100vw - 24px)';
                    trackerDiv.style.maxHeight = '32vh';
                    trackerList.style.flexDirection = 'row';
                    trackerList.style.flexWrap = 'wrap';
                    trackerList.style.maxHeight = 'calc(32vh - 36px)';
                    trackerList.style.overflowY = 'auto';
                } else if (pos === 'bottom') {
                    trackerDiv.style.bottom = '16px';
                    trackerDiv.style.left = '50%';
                    trackerDiv.style.transform = 'translateX(-50%)';
                    trackerDiv.style.maxWidth = 'calc(100vw - 120px)';
                    trackerDiv.style.maxHeight = '30vh';
                    trackerList.style.flexDirection = 'row';
                    trackerList.style.flexWrap = 'wrap';
                    trackerList.style.maxHeight = 'calc(30vh - 36px)';
                    trackerList.style.overflowY = 'auto';
                } else if (pos === 'left') {
                    trackerDiv.style.left = '12px';
                    trackerDiv.style.top = '50%';
                    trackerDiv.style.transform = 'translateY(-50%)';
                    trackerDiv.style.maxWidth = '210px';
                    trackerDiv.style.maxHeight = 'calc(100vh - 110px)';
                    trackerList.style.flexDirection = 'column';
                    trackerList.style.flexWrap = 'nowrap';
                    trackerList.style.maxHeight = 'calc(100vh - 150px)';
                    trackerList.style.overflowY = 'auto';
                } else if (pos === 'right') {
                    trackerDiv.style.right = '12px';
                    trackerDiv.style.top = '50%';
                    trackerDiv.style.transform = 'translateY(-50%)';
                    trackerDiv.style.maxWidth = '210px';
                    trackerDiv.style.maxHeight = 'calc(100vh - 110px)';
                    trackerList.style.flexDirection = 'column';
                    trackerList.style.flexWrap = 'nowrap';
                    trackerList.style.maxHeight = 'calc(100vh - 150px)';
                    trackerList.style.overflowY = 'auto';
                }
                
                trackerList.innerHTML = '';
                const visibleParticipants = state.initiative.participants.filter(p => !p.isHidden);
                const isCompact = visibleParticipants.length > 7;
                let activeElement = null;

                visibleParticipants.forEach(p => {
                    const originalIndex = state.initiative.participants.findIndex(orig => orig.id === p.id);
                    const isCurrent = state.initiative.currentTurnIndex === originalIndex;
                    
                    const div = document.createElement('div');
                    div.style.padding = isCompact ? '4px 8px' : '6px 10px';
                    div.style.fontSize = isCompact ? '11.5px' : '13px';
                    div.style.background = isCurrent ? '#2e7d32' : '#3a3a3a';
                    div.style.borderRadius = '5px';
                    div.style.fontWeight = isCurrent ? 'bold' : 'normal';
                    div.style.whiteSpace = 'nowrap';
                    div.style.maxWidth = isVertical ? '180px' : '200px';
                    div.style.overflow = 'hidden';
                    div.style.textOverflow = 'ellipsis';
                    div.style.boxSizing = 'border-box';
                    if (isVertical) div.style.width = '100%';
                    div.innerText = `${p.name} (${p.init !== '' && p.init !== undefined ? p.init : 0})`;
                    div.title = `${p.name} (${p.init !== '' && p.init !== undefined ? p.init : 0})`;
                    if (isCurrent) {
                        div.style.border = '2px solid #00e676';
                        div.style.boxShadow = '0 0 8px #00e676';
                        activeElement = div;
                    } else {
                        div.style.border = '1px solid #555';
                    }
                    trackerList.appendChild(div);
                });

                if (activeElement && typeof activeElement.scrollIntoView === 'function') {
                    setTimeout(() => {
                        try { activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' }); } catch (e) {}
                    }, 30);
                }
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

            if (window.editingPlayerShape && !state.shapes.some(s => s.id === window.editingPlayerShape.id)) {
                window.editingPlayerShape = null;
                const psp = document.getElementById('player-shape-panel');
                if (psp) psp.style.display = 'none';
            }
            if (activeToken && activeToken.type === 'shape' && activeToken.ref && !state.shapes.some(s => s.id === activeToken.ref.id)) {
                activeToken = null;
            }
        }

        engine.publicStrokes = state.publicStrokes || [];
        engine.shapes = state.shapes || [];

        // --- Toolbar Visibility (Modalità TV Master) ---
        if (typeof state.hideToolbar !== 'undefined') {
            isToolbarHiddenByDm = !!state.hideToolbar;
            if (isToolbarHiddenByDm) {
                togglePlayerToolbar(false);
                if (btnToggleToolbar) btnToggleToolbar.style.display = 'none';
            } else {
                if (btnToggleToolbar) btnToggleToolbar.style.display = 'flex';
            }
        }
        
        // --- View Sync Logic ---
        
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
        if (!window._requestedPcSheetsAt) window._requestedPcSheetsAt = new Map();
        const nowMs = Date.now();

        // RENDERING SINCRONO ISTANTANEO (0ms):
        // Aggiorna posizioni, aure, visibilità e PV immediatamente senza attendere il caricamento asincrono delle immagini!
        const finalTokens = state.tokens.map(t => {
            const existing = engine.tokens.find(et => et.id === t.id);

            // Ripristina la scheda PG dalla cache locale o richiedila se aggiornata
            if (tokenPcSheetCache.has(t.id)) {
                t.pcSheet = tokenPcSheetCache.get(t.id);
            } else if (existing && existing.pcSheet) {
                t.pcSheet = existing.pcSheet;
                tokenPcSheetCache.set(t.id, existing.pcSheet);
            }
            if (t.adventureJournal === undefined && existing && existing.adventureJournal !== undefined) {
                t.adventureJournal = existing.adventureJournal;
            }
            if (t.hasPcSheet && (!t.pcSheet || (t.pcSheetVer && t.pcSheet.updatedAt !== t.pcSheetVer))) {
                const lastSheetReq = window._requestedPcSheetsAt.get(t.id) || 0;
                if (nowMs - lastSheetReq > 3000) {
                    window._requestedPcSheetsAt.set(t.id, nowMs);
                    network.send({ type: 'REQUEST_PC_SHEET', tokenId: t.id });
                }
            }

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
        if (window.pcSheetManager) {
            window.pcSheetManager.refreshIfOpen();
        }
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
    if (isHandoutControlledByDm && window.lastHandoutRectPayload) {
        applyHandoutRect(window.lastHandoutRectPayload);
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
    const highlight = document.getElementById('pshape-highlight') ? document.getElementById('pshape-highlight').checked : true;
    let casterTokenId = null;
    let casterName = network.playerName || 'Giocatore';
    let myTok = null;

    if (window.editingPlayerToken) {
        myTok = window.editingPlayerToken;
    } else if (engine.selectedTokenId && engine.tokens) {
        myTok = engine.tokens.find(t => t.id === engine.selectedTokenId && isTokenOwnedByLocalPlayer(t));
    }
    if (!myTok && engine.tokens && engine.tokens.length > 0) {
        myTok = engine.tokens.find(t => isTokenOwnedByLocalPlayer(t));
        if (!myTok && network.playerName) {
            const pNorm = network.playerName.trim().toLowerCase();
            myTok = engine.tokens.find(t => {
                if (!t.name) return false;
                const tNorm = t.name.trim().toLowerCase();
                return tNorm === pNorm || tNorm.startsWith(pNorm + ' ') || tNorm.includes(pNorm);
            });
        }
    }

    if (myTok) {
        casterTokenId = myTok.id;
        casterName = myTok.name || network.playerName;
    }

    let skipFirst = false;
    let casterInitiativeId = null;
    if (engine.initiative && engine.initiative.active && engine.initiative.participants && engine.initiative.participants.length > 0) {
        const curP = engine.initiative.participants[engine.initiative.currentTurnIndex];
        if (curP) {
            const pNorm = (network.playerName || '').trim().toLowerCase();
            const curName = (curP.name || '').trim().toLowerCase();
            const cName = casterName.trim().toLowerCase();
            const sTokId = casterTokenId ? String(casterTokenId).replace(/^tok_/, '') : null;
            const pTokId = curP.tokenId ? String(curP.tokenId).replace(/^tok_/, '') : null;
            const curTok = curP.tokenId && engine.tokens ? engine.tokens.find(t => String(t.id).replace(/^tok_/, '') === pTokId) : null;
            const isCurOwned = curTok ? isTokenOwnedByLocalPlayer(curTok) : false;

            if (isCurOwned || (sTokId && pTokId && sTokId === pTokId) ||
                (curName && (curName === pNorm || curName.startsWith(pNorm + ' ') || curName.includes(pNorm) ||
                             curName === cName || curName.startsWith(cName + ' ') || curName.includes(cName)))) {
                skipFirst = true;
                casterInitiativeId = curP.id;
                if (!casterTokenId && curP.tokenId) casterTokenId = curP.tokenId;
                if (!casterName || casterName === 'Giocatore') casterName = curP.name;
            }
        }
    }

    const shape = {
        id: 'aoe_' + Date.now() + Math.floor(Math.random()*1000),
        type: type === 'sphere' ? 'circle' : type,
        x: centerPos.x, y: centerPos.y,
        sizeFt: 15,
        widthFt: type === 'line' ? 5 : undefined,
        angle: 0,
        visible: true,
        highlightTokens: highlight,
        owner: network.playerName,
        casterName: casterName,
        casterTokenId: casterTokenId,
        casterInitiativeId: casterInitiativeId,
        skipFirstDecrement: skipFirst,
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
let isToolbarHiddenByDm = false;
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
        if (isToolbarHiddenByDm) return; // Disabilitato se il Master ha forzato la modalità TV
        togglePlayerToolbar();
    }
});


// --- PLAYER INPUT LOGIC ---
const uiLayer = document.getElementById('main-canvas-container');

function getEventPos(e) {
    const rect = uiLayer.getBoundingClientRect();
    if (e && e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    if (e && e.changedTouches && e.changedTouches.length > 0) {
        return { x: e.changedTouches[0].clientX - rect.left, y: e.changedTouches[0].clientY - rect.top };
    }
    if (e && e.clientX !== undefined) {
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    return { x: typeof startMouseX !== 'undefined' ? startMouseX : 0, y: typeof startMouseY !== 'undefined' ? startMouseY : 0 };
}

let pIsPinching = false;
let pPinchStartDist = 0;
let pPinchStartScale = 1;
let pPinchStartWorldPos = null;
let pPinchMidX = 0;
let pPinchMidY = 0;

function pHandleStart(e) {
    if (!isMapLocked && e.touches && e.touches.length >= 2) {
        e.preventDefault();
        if (pingTimeout) {
            clearTimeout(pingTimeout);
            pingTimeout = null;
        }
        pIsPinching = true;
        isDragging = false;
        isPanning = false;
        activeToken = null;
        activeLaser = null;
        activeStroke = null;

        const rect = uiLayer.getBoundingClientRect();
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        pPinchStartDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        pPinchStartScale = engine.scale;

        pPinchMidX = (t0.clientX + t1.clientX) / 2 - rect.left;
        pPinchMidY = (t0.clientY + t1.clientY) / 2 - rect.top;
        pPinchStartWorldPos = engine.screenToWorld(pPinchMidX, pPinchMidY);
        return;
    }

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
        document.body.classList.add('vtt-dragging');
        return;
    }
    
    const worldPos = engine.screenToWorld(pos.x, pos.y);
    
    if (currentTool === 'laser') {
        isDragging = true;
        document.body.classList.add('vtt-dragging');
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
        document.body.classList.add('vtt-dragging');
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
        document.body.classList.add('vtt-dragging');
        engine.ruler = { startX: worldPos.x, startY: worldPos.y, endX: worldPos.x, endY: worldPos.y };
        engine.renderUI();
        return;
    }
    
    if (currentTool === 'move') {
        document.body.classList.add('vtt-dragging');
        let hitEntity = false;
        let clickedTok = null;
        
        // 1. Cerca prima se ha cliccato la maniglia o il badge di una forma AoE in primo piano (priorità assoluta)
        if (engine.shapes && engine.shapes.length > 0) {
            for (let i = engine.shapes.length - 1; i >= 0; i--) {
                const s = engine.shapes[i];
                if (!s.visible) continue;
                if (s.owner !== network.playerName) continue;
                // Se la sagoma è coperta da nebbia di guerra, il giocatore non può vederla né cliccarla!
                if (engine.isPointInFog && engine.isPointInFog(s.x, s.y)) continue;

                const hasTimer = s.durationRounds !== undefined && s.durationRounds !== null && Number(s.durationRounds) > 0;
                let isHit = false;
                const scaleFactor = Math.min(1, engine.scale);
                const dx = Math.abs(worldPos.x - s.x);
                const dy = Math.abs(worldPos.y - s.y);
                if (hasTimer) {
                    isHit = (dx <= 26 / scaleFactor && dy <= 16 / scaleFactor) || (Math.hypot(dx, dy) <= 25 / scaleFactor);
                } else {
                    isHit = (Math.hypot(dx, dy) <= 20 / scaleFactor);
                }
                if (isHit) {
                    activeToken = { type: 'shape', ref: s };
                    isDragging = true;
                    hitEntity = true;
                    break;
                }
            }
        }

        // 2. Se non ha colpito la maniglia AoE, cerca token di proprietà
        if (!hitEntity) {
            const isTouch = e && e.touches && e.touches.length > 0;
            const pad = isTouch ? (10 / Math.min(1, engine.scale)) : 0;
            for (let i = engine.tokens.length - 1; i >= 0; i--) {
                const t = engine.tokens[i];
                if (isTokenOwnedByLocalPlayer(t) && 
                    worldPos.x >= t.x - pad && worldPos.x <= t.x + t.width + pad &&
                    worldPos.y >= t.y - pad && worldPos.y <= t.y + t.height + pad) {
                    
                    activeToken = { type: 'token', ref: t };
                    isDragging = true;
                    hitEntity = true;
                    clickedTok = t;
                    break;
                }
            }
        }
        
        // 3. Fallback ricerca forma (fino a 24px)
        if (!hitEntity && engine.shapes && engine.shapes.length > 0) {
            for (let i = engine.shapes.length - 1; i >= 0; i--) {
                const s = engine.shapes[i];
                if (!s.visible) continue;
                if (s.owner !== network.playerName) continue;
                if (engine.isPointInFog && engine.isPointInFog(s.x, s.y)) continue;

                const dist = Math.hypot(worldPos.x - s.x, worldPos.y - s.y);
                if (dist <= 24 / Math.min(1, engine.scale)) {
                    activeToken = { type: 'shape', ref: s };
                    isDragging = true;
                    hitEntity = true;
                    break;
                }
            }
        }
        
        // Se non ha colpito nulla, avvia il pan
        if (!hitEntity && !isMapLocked) {
            isPanning = true;
            startPanX = pos.x - engine.offsetX;
            startPanY = pos.y - engine.offsetY;
        }

        // Cerca se ha cliccato su qualsiasi creatura visibile (anche non di sua proprietà!)
        let targetCreature = clickedTok;
        if (!targetCreature) {
            for (let i = engine.tokens.length - 1; i >= 0; i--) {
                const t = engine.tokens[i];
                if (t.visible !== false &&
                    worldPos.x >= t.x && worldPos.x <= t.x + t.width &&
                    worldPos.y >= t.y && worldPos.y <= t.y + t.height) {
                    if (engine.isPointInFog && engine.isPointInFog(worldPos.x, worldPos.y)) {
                        continue;
                    }
                    targetCreature = t;
                    break;
                }
            }
        }

        // Ping Timer (su creatura o mappa vuota)
        if (pingTimeout) { clearTimeout(pingTimeout); pingTimeout = null; }
        const pColor = (document.getElementById('player-color') && document.getElementById('player-color').value) ? document.getElementById('player-color').value : '#00ffff';
        const pingTargetX = targetCreature ? (targetCreature.x + targetCreature.width / 2) : worldPos.x;
        const pingTargetY = targetCreature ? (targetCreature.y + targetCreature.height / 2) : worldPos.y;

        pingTimeout = setTimeout(() => {
            pingTimeout = null;
            isPanning = false;
            if (activeToken) {
                isDragging = false;
                activeToken = null;
            }
            const pId = 'p_ping_' + Date.now();
            window.lastReceivedPlayerPingId = pId;
            engine.pings.push({id: pId, x: pingTargetX, y: pingTargetY, start: Date.now(), color: pColor});
            engine.renderUI();
            network.send({type: 'PING', payload: {id: pId, x: pingTargetX, y: pingTargetY, color: pColor, t: Date.now()}});
        }, 600);
    }
}

function pHandleMove(e) {
    if (pIsPinching && e.touches && e.touches.length >= 2) {
        e.preventDefault();
        if (pingTimeout) {
            clearTimeout(pingTimeout);
            pingTimeout = null;
        }
        const rect = uiLayer.getBoundingClientRect();
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const curDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        const curMidX = (t0.clientX + t1.clientX) / 2 - rect.left;
        const curMidY = (t0.clientY + t1.clientY) / 2 - rect.top;

        if (pPinchStartDist > 5 && pPinchStartWorldPos) {
            const factor = curDist / pPinchStartDist;
            let newScale = pPinchStartScale * factor;
            newScale = Math.max(0.1, Math.min(newScale, 10));
            engine.scale = newScale;

            engine.offsetX = curMidX - pPinchStartWorldPos.x * engine.scale;
            engine.offsetY = curMidY - pPinchStartWorldPos.y * engine.scale;

            engine.renderViewport();
        }
        return;
    }

    if (e.touches && e.touches.length >= 2 && pingTimeout) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
    }

    if ((isDragging || isPanning || activeLaser || activeStroke) && e.buttons === 0) {
        pHandleEnd(e);
        return;
    }

    if (!isDragging && !isPanning && !pingTimeout && !activeLaser && !activeStroke) return;

    const pos = getEventPos(e);
    const moveRawX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : ((e.clientX !== undefined) ? e.clientX : startMouseX);
    const moveRawY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : ((e.clientY !== undefined) ? e.clientY : startMouseY);
    
    if (pingTimeout) {
        if (Math.hypot(moveRawX - startMouseX, moveRawY - startMouseY) > 10) {
            clearTimeout(pingTimeout);
            pingTimeout = null;
        } else {
            return;
        }
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
            engine.requestTokenLayerRender();
            
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
            engine.requestTokenLayerRender();
            
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
    if (pIsPinching) {
        if (e && e.touches && e.touches.length >= 2) {
            return;
        }
        pIsPinching = false;
        pPinchStartDist = 0;
        pPinchStartWorldPos = null;
        if (pingTimeout) {
            clearTimeout(pingTimeout);
            pingTimeout = null;
        }
        document.body.classList.remove('vtt-dragging');
        engine.renderViewport();
        return;
    }

    document.body.classList.remove('vtt-dragging');
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
            let endX = (e && e.clientX !== undefined) ? e.clientX : startMouseX;
            let endY = (e && e.clientY !== undefined) ? e.clientY : startMouseY;
            if (e && e.changedTouches && e.changedTouches.length > 0) {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
            }
            const isTouch = e && ((e.touches && e.touches.length > 0) || (e.changedTouches && e.changedTouches.length > 0));
            const maxMove = isTouch ? 25 : 10;
            const maxInterval = isTouch ? 500 : 380;
            if (Math.abs(endX - startMouseX) < maxMove && Math.abs(endY - startMouseY) < maxMove) {
                const clickedTok = activeToken.ref;
                window.editingPlayerToken = clickedTok;
                engine.selectedTokenId = clickedTok.id;

                const nowClick = Date.now();
                if (lastPlayerClickedTokenId === clickedTok.id && (nowClick - lastPlayerClickedTokenTime) < maxInterval) {
                    lastPlayerClickedTokenId = null;
                    lastPlayerClickedTokenTime = 0;
                    if (window.pcSheetManager) {
                        window.pcSheetManager.open(clickedTok);
                    }
                } else {
                    lastPlayerClickedTokenId = clickedTok.id;
                    lastPlayerClickedTokenTime = nowClick;
                    document.getElementById('player-token-panel').style.display = 'block';
                    const aura = clickedTok.aura || {};
                    document.getElementById('ptoken-aura-active').checked = aura.active || false;
                    document.getElementById('ptoken-aura-size').value = aura.sizeRaw || 15;
                    document.getElementById('ptoken-aura-color').value = aura.color || '#ffff00';
                    const auraHl = document.getElementById('ptoken-aura-highlight');
                    if (auraHl) auraHl.checked = aura.highlightTokens !== false;
                    const pAuraDur = document.getElementById('ptoken-aura-duration');
                    if (pAuraDur) {
                        pAuraDur.value = (aura.roundsLeft !== undefined) ? aura.roundsLeft : (aura.durationRounds || '');
                    }
                }
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
            
            let endX = (e && e.clientX !== undefined) ? e.clientX : startMouseX;
            let endY = (e && e.clientY !== undefined) ? e.clientY : startMouseY;
            if (e && e.changedTouches && e.changedTouches.length > 0) {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
            }
            const isTouch = e && ((e.touches && e.touches.length > 0) || (e.changedTouches && e.changedTouches.length > 0));
            const maxMove = isTouch ? 25 : 10;
            if (Math.abs(endX - startMouseX) < maxMove && Math.abs(endY - startMouseY) < maxMove) {
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
                const hlEl = document.getElementById('pshape-highlight');
                if (hlEl) hlEl.checked = activeToken.ref.highlightTokens !== false;
                const pDurEl = document.getElementById('pshape-duration');
                if (pDurEl) {
                    pDurEl.value = (activeToken.ref.roundsLeft !== undefined) ? activeToken.ref.roundsLeft : (activeToken.ref.durationRounds || '');
                }
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

window.addEventListener('mousemove', pHandleMove);
window.addEventListener('touchmove', pHandleMove, {passive: false});

window.addEventListener('mouseup', pHandleEnd);
window.addEventListener('touchend', pHandleEnd);
window.addEventListener('blur', () => {
    if (isDragging || isPanning || activeLaser || activeStroke) {
        pHandleEnd({});
    }
});

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
    const hlEl = document.getElementById('pshape-highlight');
    if (hlEl) window.editingPlayerShape.highlightTokens = hlEl.checked;
    const durEl = document.getElementById('pshape-duration');
    if (durEl) {
        const dVal = parseInt(durEl.value);
        if (!isNaN(dVal) && dVal > 0) {
            window.editingPlayerShape.durationRounds = dVal;
            window.editingPlayerShape.roundsLeft = dVal;
            if (!window.editingPlayerShape.casterTokenId && engine.tokens) {
                let myTok = window.editingPlayerToken || (engine.selectedTokenId ? engine.tokens.find(t => t.id === engine.selectedTokenId && isTokenOwnedByLocalPlayer(t)) : null);
                if (!myTok) myTok = engine.tokens.find(t => isTokenOwnedByLocalPlayer(t));
                if (!myTok && network.playerName) {
                    const pNorm = network.playerName.trim().toLowerCase();
                    myTok = engine.tokens.find(t => {
                        if (!t.name) return false;
                        const tNorm = t.name.trim().toLowerCase();
                        return tNorm === pNorm || tNorm.startsWith(pNorm + ' ') || tNorm.includes(pNorm);
                    });
                }
                if (myTok) {
                    window.editingPlayerShape.casterTokenId = myTok.id;
                    window.editingPlayerShape.casterName = myTok.name || network.playerName;
                }
            }

            // Iniziativa: Se impostato o modificato durante il proprio turno in combattimento, salta il primo decremento
            if (engine.initiative && engine.initiative.active && engine.initiative.participants && engine.initiative.participants.length > 0) {
                const curP = engine.initiative.participants[engine.initiative.currentTurnIndex];
                if (curP) {
                    const pNorm = (network.playerName || '').trim().toLowerCase();
                    const curName = (curP.name || '').trim().toLowerCase();
                    const sCasterName = (window.editingPlayerShape.casterName || '').trim().toLowerCase();
                    const sTokId = window.editingPlayerShape.casterTokenId ? String(window.editingPlayerShape.casterTokenId).replace(/^tok_/, '') : null;
                    const pTokId = curP.tokenId ? String(curP.tokenId).replace(/^tok_/, '') : null;
                    const curTok = curP.tokenId && engine.tokens ? engine.tokens.find(t => String(t.id).replace(/^tok_/, '') === pTokId) : null;
                    const isCurOwned = curTok ? isTokenOwnedByLocalPlayer(curTok) : false;

                    if (isCurOwned || (sTokId && pTokId && sTokId === pTokId) ||
                        (window.editingPlayerShape.casterInitiativeId && String(window.editingPlayerShape.casterInitiativeId) === String(curP.id)) ||
                        (curName && (curName === pNorm || curName.startsWith(pNorm + ' ') || curName.includes(pNorm) ||
                                     curName === sCasterName || curName.startsWith(sCasterName + ' ') || curName.includes(sCasterName)))) {
                        window.editingPlayerShape.skipFirstDecrement = true;
                        window.editingPlayerShape.casterInitiativeId = curP.id;
                        if (!window.editingPlayerShape.casterTokenId && curP.tokenId) {
                            window.editingPlayerShape.casterTokenId = curP.tokenId;
                        }
                        if (!window.editingPlayerShape.casterName || window.editingPlayerShape.casterName === 'Giocatore') {
                            window.editingPlayerShape.casterName = curP.name;
                        }
                    }
                }
            }
        } else {
            window.editingPlayerShape.durationRounds = 0;
            delete window.editingPlayerShape.roundsLeft;
            delete window.editingPlayerShape.skipFirstDecrement;
            delete window.editingPlayerShape.casterInitiativeId;
        }
    }
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
document.getElementById('pshape-highlight')?.addEventListener('change', updatePlayerShape);
document.getElementById('pshape-duration')?.addEventListener('input', updatePlayerShape);
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
    
    const durEl = document.getElementById('ptoken-aura-duration');
    let durVal = durEl ? parseInt(durEl.value) : 0;
    if (isNaN(durVal) || durVal <= 0) durVal = 0;

    let skipFirst = false;
    if (engine.initiative && engine.initiative.active && engine.initiative.participants) {
        const curP = engine.initiative.participants[engine.initiative.currentTurnIndex];
        if (curP && (curP.tokenId === window.editingPlayerToken.id || (curP.name && window.editingPlayerToken.name && curP.name.trim().toLowerCase() === window.editingPlayerToken.name.trim().toLowerCase()))) {
            skipFirst = true;
        }
    }

    const auraHl = document.getElementById('ptoken-aura-highlight');
    window.editingPlayerToken.aura = {
        active: document.getElementById('ptoken-aura-active').checked,
        sizeRaw: sizeRaw,
        unit: unit,
        sizePx: squares * engine.grid.size,
        color: document.getElementById('ptoken-aura-color').value,
        highlightTokens: auraHl ? auraHl.checked : true,
        durationRounds: durVal > 0 ? durVal : undefined,
        roundsLeft: durVal > 0 ? durVal : undefined,
        skipFirstDecrement: skipFirst
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
document.getElementById('ptoken-aura-highlight')?.addEventListener('change', updatePlayerTokenAura);
document.getElementById('ptoken-aura-size').addEventListener('input', updatePlayerTokenAura);
document.getElementById('ptoken-aura-duration')?.addEventListener('input', updatePlayerTokenAura);
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

function openLocalPlayerPcSheet() {
    let targetTok = window.editingPlayerToken;
    if (!targetTok || !isTokenOwnedByLocalPlayer(targetTok)) {
        const ownedList = engine.tokens.filter(t => isTokenOwnedByLocalPlayer(t));
        targetTok = ownedList.find(t => t.pcSheet || t.hasPcSheet) || ownedList[0] || null;
    }
    if (!targetTok) {
        alert(typeof window.t === 'function' ? window.t('Nessun token ti è ancora stato assegnato dal Master sulla mappa!') : 'Nessun token ti è ancora stato assegnato dal Master sulla mappa!');
        return;
    }
    engine.selectedTokenId = targetTok.id;
    if (window.pcSheetManager) {
        window.pcSheetManager.open(targetTok);
    }
}

document.getElementById('pbtn-open-pcsheet')?.addEventListener('click', openLocalPlayerPcSheet);
document.getElementById('pbtn-toolbar-pcsheet')?.addEventListener('click', openLocalPlayerPcSheet);






// Player self close
document.getElementById('btn-handout-close-self')?.addEventListener('click', () => {
    document.getElementById('handout-window').style.display = 'none';
});

// Player Handout Window: Trascinamento (Mouse & Touch) e Ridimensionamento
const playerHw = document.getElementById('handout-window');
const playerHwHeader = document.getElementById('handout-header');
if (playerHw && playerHwHeader) {
    let isDraggingHw = false;
    let hwOffsetX = 0, hwOffsetY = 0;

    playerHwHeader.addEventListener('mousedown', (e) => {
        if (isHandoutControlledByDm) return; // Bloccato se il DM comanda la posizione!
        if (e.target.tagName.toLowerCase() === 'button') return;
        e.preventDefault();
        isDraggingHw = true;
        playerHw.dataset.userPositioned = 'true';
        const rect = playerHw.getBoundingClientRect();
        playerHw.style.bottom = 'auto';
        playerHw.style.right = 'auto';
        playerHw.style.left = rect.left + 'px';
        playerHw.style.top = rect.top + 'px';
        hwOffsetX = e.clientX - rect.left;
        hwOffsetY = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingHw || isHandoutControlledByDm) return;
        playerHw.style.left = (e.clientX - hwOffsetX) + 'px';
        playerHw.style.top = (e.clientY - hwOffsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDraggingHw) {
            isDraggingHw = false;
        }
    });

    // Supporto Touch per schermi e tablet
    playerHwHeader.style.touchAction = 'none';
    let isTouchDraggingPlayerHw = false;
    let touchStartX = 0, touchStartY = 0, touchInitLeft = 0, touchInitTop = 0;
    playerHwHeader.addEventListener('touchstart', (e) => {
        if (isHandoutControlledByDm) return; // Bloccato se il DM comanda la posizione!
        if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
        if (e.touches && e.touches.length === 1) {
            if (e.cancelable) e.preventDefault();
            isTouchDraggingPlayerHw = true;
            playerHw.dataset.userPositioned = 'true';
            const rect = playerHw.getBoundingClientRect();
            touchInitLeft = rect.left;
            touchInitTop = rect.top;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            playerHw.style.left = touchInitLeft + 'px';
            playerHw.style.top = touchInitTop + 'px';
            playerHw.style.right = 'auto';
            playerHw.style.bottom = 'auto';
        }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (!isTouchDraggingPlayerHw || isHandoutControlledByDm) return;
        if (e.touches && e.touches.length === 1) {
            if (e.cancelable) e.preventDefault();
            const dx = e.touches[0].clientX - touchStartX;
            const dy = e.touches[0].clientY - touchStartY;
            playerHw.style.left = (touchInitLeft + dx) + 'px';
            playerHw.style.top = (touchInitTop + dy) + 'px';
        }
    }, { passive: false });

    window.addEventListener('touchend', () => { isTouchDraggingPlayerHw = false; });
    window.addEventListener('touchcancel', () => { isTouchDraggingPlayerHw = false; });

    // Monitora il ridimensionamento manuale da parte del giocatore
    if (window.ResizeObserver) {
        new ResizeObserver(() => {
            if (!isHandoutControlledByDm && playerHw.style.display !== 'none') {
                playerHw.dataset.userPositioned = 'true';
            }
        }).observe(playerHw);
    }
}

// Inizializza Sistema Dadi
if (window.setupDiceSystem) {
    window.setupDiceSystem(false, network);
}

// Inizializza Sistema Audio & Soundboard
if (window.setupAudioSystem) {
    window.setupAudioSystem(false, network);
}
