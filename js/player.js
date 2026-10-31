function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[c] || c));
}

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
window.VTT_VERSION = 'Beta 1.5';
const tokenImageCache = new Map();
const tokenPcSheetCache = new Map();
const tokenStatblockCache = new Map();
window.tokenStatblockCache = tokenStatblockCache;
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

function isSpectatorMode() {
    if (urlParams.get('mode') === 'tv') return false; // La TV non è spettatore
    if (!network || !network.playerName) return false;
    const owned = (engine.tokens || []).filter(t => isTokenOwnedByLocalPlayer(t));
    return owned.length === 0;
}
window.isSpectatorMode = isSpectatorMode;

function updatePlayerRoleAndUI() {
    const isSpec = isSpectatorMode();
    const specBadge = document.getElementById('player-spectator-badge');
    const toggleBtn = document.getElementById('btn-toggle-toolbar');
    const toolbar = document.getElementById('player-toolbar');

    if (isSpec) {
        if (typeof togglePlayerToolbar === 'function') togglePlayerToolbar(false);
        if (toggleBtn) toggleBtn.style.display = 'none';
        if (toolbar) toolbar.style.display = 'none';
        if (specBadge) specBadge.style.display = 'block';

        const tp = document.getElementById('player-token-panel');
        if (tp) tp.style.display = 'none';
        const sp = document.getElementById('player-shape-panel');
        if (sp) sp.style.display = 'none';
        const dp = document.getElementById('dice-panel');
        if (dp) dp.style.display = 'none';
    } else {
        if (toggleBtn) toggleBtn.style.display = 'block';
        if (specBadge) specBadge.style.display = 'none';
    }
}
window.updatePlayerRoleAndUI = updatePlayerRoleAndUI;

const fallbackBadgeCache = new Map();
function createFallbackTokenBadge(name) {
    const key = (name || '?').charAt(0).toUpperCase();
    if (fallbackBadgeCache.has(key)) {
        return fallbackBadgeCache.get(key);
    }
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
    fctx.fillText(key, 32, 32);
    const fbImg = new Image();
    fbImg.src = fbCanvas.toDataURL();
    fallbackBadgeCache.set(key, fbImg);
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

let isQueryingRoomChars = false;
let lastQueriedRoom = '';

async function queryAndPopulateCharacters(roomCode) {
    const cleanRoom = (roomCode || '').trim().toUpperCase();
    if (!cleanRoom || cleanRoom.length < 4) return;
    if (cleanRoom === lastQueriedRoom && isQueryingRoomChars) return;
    lastQueriedRoom = cleanRoom;
    isQueryingRoomChars = true;

    const charContainer = document.getElementById('login-char-container');
    const charSelect = document.getElementById('login-character-select');
    const manualContainer = document.getElementById('login-manual-container');
    const nameInput = document.getElementById('login-name');
    if (!charSelect || !charContainer) return;

    try {
        const chars = await network.queryRoomCharacters(cleanRoom);
        if (Array.isArray(chars) && chars.length > 0) {
            charSelect.innerHTML = '<option value="">-- Seleziona Personaggio --</option>';
            chars.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.name;
                if (c.isTaken) {
                    opt.disabled = true;
                    opt.textContent = `🔒 ${c.name} (Già presente in stanza)`;
                } else {
                    opt.textContent = `🧙 ${c.name}`;
                }
                charSelect.appendChild(opt);
            });
            const manualOpt = document.createElement('option');
            manualOpt.value = '__manual__';
            manualOpt.textContent = '✍️ Altro nome / Spettatore (Manuale)';
            charSelect.appendChild(manualOpt);

            charContainer.style.display = 'block';
            if (nameInput && nameInput.value) {
                const matchOpt = Array.from(charSelect.options).find(o => o.value.toLowerCase() === nameInput.value.toLowerCase());
                if (matchOpt && !matchOpt.disabled) {
                    charSelect.value = matchOpt.value;
                    if (manualContainer) manualContainer.style.display = 'none';
                }
            }
        } else {
            charContainer.style.display = 'none';
            if (manualContainer) manualContainer.style.display = 'block';
        }
    } catch (e) {
        console.warn("Query room characters:", e);
    } finally {
        isQueryingRoomChars = false;
    }
}

const charSelectEl = document.getElementById('login-character-select');
if (charSelectEl) {
    charSelectEl.addEventListener('change', () => {
        const val = charSelectEl.value;
        const nameInput = document.getElementById('login-name');
        const manualContainer = document.getElementById('login-manual-container');
        if (!val || val === '__manual__') {
            if (manualContainer) manualContainer.style.display = 'block';
            if (val === '__manual__' && nameInput) {
                nameInput.value = '';
                nameInput.placeholder = 'Il tuo Nome o Spettatore';
                nameInput.focus();
            }
        } else {
            if (nameInput) nameInput.value = val;
            if (manualContainer) manualContainer.style.display = 'none';
        }
    });
}

// Prefill codice stanza se passato come parametro URL (?room=...) o memorizzato
const roomParam = urlParams.get('room');
const roomInput = document.getElementById('login-room');
if (roomInput) {
    const savedRoom = localStorage.getItem('vtt_last_room_code') || '';
    if (roomParam) {
        roomInput.value = roomParam;
    } else if (savedRoom) {
        roomInput.value = savedRoom;
    }

    let roomDebounce = null;
    roomInput.addEventListener('input', () => {
        if (roomDebounce) clearTimeout(roomDebounce);
        roomDebounce = setTimeout(() => {
            const val = roomInput.value.trim().toUpperCase();
            if (val.length >= 6) {
                queryAndPopulateCharacters(val);
            }
        }, 350);
    });

    const initRoom = roomInput.value.trim();
    if (initRoom && initRoom.length >= 4) {
        setTimeout(() => queryAndPopulateCharacters(initRoom), 300);
    }
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
            try { localStorage.setItem('vtt_last_room_code', room); } catch (e) {}
            document.getElementById('login-overlay').style.display = 'none';
            updatePlayerRoleAndUI();
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
    if (data.type === 'ROOM_CLOSED') {
        const msg = (data.payload && data.payload.reason) ? data.payload.reason : (typeof window.t === 'function' ? window.t('Il Master ha terminato la sessione.') : 'Il Master ha terminato la sessione.');
        alert(msg);
        window.location.reload();
        return;
    } else if (data.type === 'KICKED') {
        const msg = (data.payload && data.payload.reason) ? data.payload.reason : (typeof window.t === 'function' ? window.t('Sei stato espulso dalla stanza dal Master.') : 'Sei stato espulso dalla stanza dal Master.');
        alert(msg);
        window.location.reload();
        return;
    }

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
        if (engine.ensureLayerSize) engine.ensureLayerSize('drawPublic');
        engine._lastDrawSig = null;
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
                        tok.src = null; // Rilascia la stringa base64 dalla memoria RAM
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
    } else if (data.type === 'TOKEN_STATBLOCK_SYNC') {
        const p = data.payload;
        if (p && p.tokenId && p.statblock) {
            tokenStatblockCache.set(p.tokenId, p.statblock);
            const tok = engine.tokens.find(t => t.id === p.tokenId);
            if (tok) {
                tok.statblock = p.statblock;
                tok.hasStatblock = true;
                if (p.statblock.name) tok.statblockName = p.statblock.name;
            }
            if (window.compendium && window.compendium._activeTargetTokenId === p.tokenId) {
                const statWin = document.getElementById('dm-statblock-window');
                if (statWin && statWin.style.display !== 'none') {
                    window.compendium.loadMonster(p.statblock);
                }
            }
            const btnStat = document.getElementById('pbtn-open-statblock');
            if (btnStat && p.statblock.name && window.editingPlayerToken && window.editingPlayerToken.id === p.tokenId) {
                btnStat.innerHTML = `<span>📜 ${escapeHTML(p.statblock.name)}</span>`;
                btnStat.style.background = '#00897b';
                btnStat.style.borderColor = '#80cbc4';
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

            // Preserva proprietà di evocazione e scheda se presenti localmente
            if (t.isEvocation === undefined && existing && existing.isEvocation) {
                t.isEvocation = existing.isEvocation;
            }
            if (!t.category && existing && existing.category) {
                t.category = existing.category;
            }
            // Ripristina lo statblock dalla cache locale se disponibile
            if (tokenStatblockCache.has(t.id)) {
                t.statblock = tokenStatblockCache.get(t.id);
            } else if (existing && existing.statblock) {
                t.statblock = existing.statblock;
                tokenStatblockCache.set(t.id, existing.statblock);
            }
            if (t.hasStatblock === undefined) {
                t.hasStatblock = !!t.statblock || (existing && existing.hasStatblock);
            }
            if (!t.statblockName && existing && existing.statblockName) {
                t.statblockName = existing.statblockName;
            }
            if (t.evokerName === undefined && existing && existing.evokerName !== undefined) {
                t.evokerName = existing.evokerName;
            }
            if (t.durationRounds === undefined && existing && existing.durationRounds !== undefined) {
                t.durationRounds = existing.durationRounds;
            }
            if (t.roundsLeft === undefined && existing && existing.roundsLeft !== undefined) {
                t.roundsLeft = existing.roundsLeft;
            }
            if (t.color === undefined && existing && existing.color !== undefined) {
                t.color = existing.color;
            }

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
        updatePlayerRoleAndUI();
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
    const normType = type === 'sphere' ? 'circle' : type;
    const centerPos = (engine.getSafeAoESpawnPosition) 
        ? engine.getSafeAoESpawnPosition(normType, 15, 5) 
        : engine.screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
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
    window.editingPlayerShape = shape;
    const pPanel = document.getElementById('player-shape-panel');
    if (pPanel) {
        pPanel.style.display = 'block';
        const pWidth = document.getElementById('pshape-width');
        if (pWidth) pWidth.style.display = shape.type === 'line' ? 'block' : 'none';
        const pSize = document.getElementById('pshape-size');
        if (pSize) pSize.value = shape.sizeFt || 15;
        const pAngle = document.getElementById('pshape-angle');
        if (pAngle) pAngle.value = shape.angle || 0;
    }
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
    if (isSpectatorMode()) {
        ptb.style.display = 'none';
        if (btnToggleToolbar) btnToggleToolbar.style.display = 'none';
        return;
    }
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

// Scorciatoia da tastiera 'H' per mostrare/nascondere la barra strumenti + tracciamento tasto Shift
window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') window._vttShiftDown = true;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
    if (e.key === 'h' || e.key === 'H') {
        if (isToolbarHiddenByDm || isSpectatorMode()) return;
        togglePlayerToolbar();
    }
});
window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') window._vttShiftDown = false;
});
window.addEventListener('blur', () => {
    window._vttShiftDown = false;
});


// --- PLAYER INPUT LOGIC ---
const uiLayer = document.getElementById('main-canvas-container');
let _cachedPlayerUiRect = null;
let _cachedPlayerUiRectTime = 0;
window.addEventListener('resize', () => { _cachedPlayerUiRect = null; });
function getPlayerUiRect() {
    const now = performance.now();
    if (!_cachedPlayerUiRect || (now - _cachedPlayerUiRectTime > 250)) {
        _cachedPlayerUiRect = uiLayer.getBoundingClientRect();
        _cachedPlayerUiRectTime = now;
    }
    return _cachedPlayerUiRect;
}

function getEventPos(e) {
    const rect = getPlayerUiRect();
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

        const rect = getPlayerUiRect();
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
    
    if (isSpectatorMode()) {
        // In modalità Spettatore, sono consentiti solo pan (spostamento visuale) e zoom
        return;
    }
    
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
                    
                    activeToken = {
                        type: 'token',
                        ref: t,
                        _hasMovedDuringDrag: false,
                        _freeMoveShift: !!(e && e.shiftKey) || !!window._vttShiftDown
                    };
                    isDragging = true;
                    hitEntity = true;
                    clickedTok = t;
                    break;
                }
            }
        }
        
        // 3. Fallback ricerca forma (maniglia o corpo della forma)
        if (!hitEntity && engine.shapes && engine.shapes.length > 0) {
            const handleRadius = Math.max(28, 28 / Math.min(1, engine.scale || 1));

            // 3.1 Cerca prima maniglia
            for (let i = engine.shapes.length - 1; i >= 0; i--) {
                const s = engine.shapes[i];
                if (!s.visible) continue;
                if (s.owner !== network.playerName) continue;
                if (engine.isPointInFog && engine.isPointInFog(s.x, s.y)) continue;

                const dist = Math.hypot(worldPos.x - s.x, worldPos.y - s.y);
                if (dist <= handleRadius) {
                    activeToken = { type: 'shape', ref: s };
                    isDragging = true;
                    hitEntity = true;
                    break;
                }
            }

            // 3.2 Se non ha preso la maniglia, cerca corpo della sagoma
            if (!hitEntity && engine.isPointInShape) {
                for (let i = engine.shapes.length - 1; i >= 0; i--) {
                    const s = engine.shapes[i];
                    if (!s.visible) continue;
                    if (s.owner !== network.playerName) continue;
                    if (engine.isPointInFog && engine.isPointInFog(worldPos.x, worldPos.y)) continue;

                    if (engine.isPointInShape(worldPos.x, worldPos.y, s)) {
                        activeToken = { type: 'shape', ref: s };
                        isDragging = true;
                        hitEntity = true;
                        break;
                    }
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
        const rect = getPlayerUiRect();
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
            if (!activeToken._hasMovedDuringDrag && Math.hypot(moveRawX - startMouseX, moveRawY - startMouseY) < 4) {
                return;
            }
            activeToken._hasMovedDuringDrag = true;
            activeToken._freeMoveShift = !!(e.shiftKey || window._vttShiftDown);

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
            if (engine.clampShapePosition) engine.clampShapePosition(activeToken.ref);
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
        if (engine.ensureLayerSize) engine.ensureLayerSize('drawPublic');
        engine._lastDrawSig = null;
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
        const gSize = (engine.grid && engine.grid.size) ? engine.grid.size : 50;
        const effOffsetX = ((engine.grid && engine.grid.offsetX) || 0) % gSize;
        const effOffsetY = ((engine.grid && engine.grid.offsetY) || 0) % gSize;
        
        if (activeToken.type === 'token') {
            if (activeToken._hasMovedDuringDrag) {
                const isFreeMove = !!(e && e.shiftKey) || !!window._vttShiftDown || !!activeToken._freeMoveShift;
                const targetX = (!isFreeMove && gSize > 0)
                    ? (Math.round((activeToken.ref.x - effOffsetX) / gSize) * gSize + effOffsetX)
                    : activeToken.ref.x;
                const targetY = (!isFreeMove && gSize > 0)
                    ? (Math.round((activeToken.ref.y - effOffsetY) / gSize) * gSize + effOffsetY)
                    : activeToken.ref.y;
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
            } else {
                engine.renderAll();
            }
            
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
                const isRealPc = (clickedTok.category === 'personaggi' || clickedTok.pcSheet || clickedTok.hasPcSheet) && !clickedTok.isEvocation && clickedTok.category !== 'evocazioni';
                if (lastPlayerClickedTokenId === clickedTok.id && (nowClick - lastPlayerClickedTokenTime) < maxInterval) {
                    lastPlayerClickedTokenId = null;
                    lastPlayerClickedTokenTime = 0;
                    if (!isRealPc) {
                        if (window.compendium) {
                            if (!clickedTok.statblock && (clickedTok.hasStatblock || clickedTok.statblockName)) {
                                network.send({ type: 'REQUEST_TOKEN_STATBLOCK', tokenId: clickedTok.id });
                            }
                            window.compendium.open(clickedTok.statblock || null);
                        }
                    } else {
                        if (window.pcSheetManager) {
                            window.pcSheetManager.open(clickedTok);
                        }
                    }
                } else {
                    lastPlayerClickedTokenId = clickedTok.id;
                    lastPlayerClickedTokenTime = nowClick;
                    document.getElementById('player-token-panel').style.display = 'block';
                    const btnStat = document.getElementById('pbtn-open-statblock');
                    const btnPc = document.getElementById('pbtn-open-pcsheet');
                    if (btnStat && btnPc) {
                        if (!isRealPc) {
                            btnStat.style.display = 'flex';
                            btnPc.style.display = 'none';
                            const stName = (clickedTok.statblock && clickedTok.statblock.name) || clickedTok.statblockName;
                            if (stName) {
                                btnStat.innerHTML = `<span>📜 ${escapeHTML(stName)}</span>`;
                                btnStat.style.background = '#00897b';
                                btnStat.style.borderColor = '#80cbc4';
                            } else {
                                btnStat.innerHTML = `<span>🐉 Scheda Creatura / Mostro</span>`;
                                btnStat.style.background = '#0277bd';
                                btnStat.style.borderColor = '#4fc3f7';
                            }
                        } else {
                            btnStat.style.display = 'none';
                            btnPc.style.display = 'flex';
                        }
                    }
                    const dismissBtn = document.getElementById('pbtn-dismiss-token');
                    if (dismissBtn) {
                        dismissBtn.style.display = (clickedTok && clickedTok.isEvocation && isTokenOwnedByLocalPlayer(clickedTok)) ? 'block' : 'none';
                    }
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
                    const pTokDur = document.getElementById('ptoken-duration');
                    if (pTokDur) {
                        const tLeft = (clickedTok.roundsLeft !== undefined && clickedTok.roundsLeft !== null) ? clickedTok.roundsLeft : clickedTok.durationRounds;
                        pTokDur.value = (tLeft !== undefined && tLeft !== null && Number(tLeft) > 0) ? tLeft : '';
                    }
                }
            }        } else if (activeToken.type === 'shape') {
            if (engine.clampShapePosition) engine.clampShapePosition(activeToken.ref);
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
    const tokDurEl = document.getElementById('ptoken-duration');
    let tokDurVal = tokDurEl ? parseInt(tokDurEl.value) : 0;
    if (isNaN(tokDurVal) || tokDurVal <= 0) tokDurVal = 0;
    if (tokDurVal > 0) {
        window.editingPlayerToken.durationRounds = tokDurVal;
        window.editingPlayerToken.roundsLeft = tokDurVal;
        window.editingPlayerToken.skipFirstDecrement = skipFirst;
    } else {
        delete window.editingPlayerToken.durationRounds;
        delete window.editingPlayerToken.roundsLeft;
        delete window.editingPlayerToken.skipFirstDecrement;
    }

    network.send({
        type: 'PLAYER_UPDATE_TOKEN_AURA',
        payload: {
            id: window.editingPlayerToken.id,
            auraObj: window.editingPlayerToken.aura,
            durationRounds: tokDurVal,
            player: network.playerName
        }
    });
}
document.getElementById('ptoken-aura-active').addEventListener('change', updatePlayerTokenAura);
document.getElementById('ptoken-aura-highlight')?.addEventListener('change', updatePlayerTokenAura);
document.getElementById('ptoken-aura-size').addEventListener('input', updatePlayerTokenAura);
document.getElementById('ptoken-aura-duration')?.addEventListener('input', updatePlayerTokenAura);
document.getElementById('ptoken-duration')?.addEventListener('input', updatePlayerTokenAura);
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
    if (!targetTok || !isTokenOwnedByLocalPlayer(targetTok) || targetTok.isEvocation) {
        const ownedList = engine.tokens.filter(t => isTokenOwnedByLocalPlayer(t));
        targetTok = ownedList.find(t => (t.pcSheet || t.hasPcSheet) && !t.isEvocation) || ownedList.find(t => !t.isEvocation) || null;
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
document.getElementById('pbtn-open-statblock')?.addEventListener('click', () => {
    const tok = window.editingPlayerToken || (engine.selectedTokenId ? engine.tokens.find(t => t.id === engine.selectedTokenId) : null);
    if (tok && window.compendium) {
        if (!tok.statblock && (tok.hasStatblock || tok.statblockName)) {
            network.send({ type: 'REQUEST_TOKEN_STATBLOCK', tokenId: tok.id });
        }
        window.compendium.open(tok.statblock || null);
    }
});






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


// =========================================================================
// EVOCATION & SUMMON TOKEN LOGIC (Zero-Memory Procedural Tokens & Presets)
// =========================================================================

function createEvocationTokenDataUrl(name, color = '#b388ff', evokerName = '') {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const cx = 64, cy = 64, r = 58;

    // Sfondo gradiente radiale dark-fantasy profondo
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
    grad.addColorStop(0, '#1c1b29');
    grad.addColorStop(0.7, '#11101a');
    grad.addColorStop(1, '#0a0912');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Sottile alone/glow interno
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Motivo geometrico arcano di sfondo (glifo e cerchio runico interno)
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 16, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy - (r - 16));
    ctx.lineTo(cx + (r - 16), cy);
    ctx.lineTo(cx, cy + (r - 16));
    ctx.lineTo(cx - (r - 16), cy);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Bordo esterno brillante con il colore scelto
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Rifinitura bianca sottile
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Monogramma centrale elegante (2 lettere maiuscole)
    const words = (name || 'Evocazione').trim().split(/\s+/);
    let initials = '';
    if (words.length >= 2) {
        initials = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words[0].length >= 2) {
        initials = words[0].substring(0, 2).toUpperCase();
    } else {
        initials = words[0].toUpperCase();
    }

    ctx.save();
    ctx.font = 'bold 36px "Cinzel", "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText(initials, cx, cy);
    ctx.fillText(initials, cx, cy);
    ctx.restore();

    return canvas.toDataURL('image/png');
}

function findFreeAdjacentCell(baseToken, sizeMultiplier = 1) {
    if (!engine || !baseToken) return null;
    const gridSize = engine.grid.size || 50;
    const tokenSize = gridSize * sizeMultiplier;
    const mapW = engine.mapImage ? engine.mapImage.width : 2000;
    const mapH = engine.mapImage ? engine.mapImage.height : 2000;

    const effOffsetX = (engine.grid.offsetX || 0) % gridSize;
    const effOffsetY = (engine.grid.offsetY || 0) % gridSize;

    const baseGridX = Math.round((baseToken.x - effOffsetX) / gridSize);
    const baseGridY = Math.round((baseToken.y - effOffsetY) / gridSize);

    // Spirale adiacente r = 1 (8 caselle), poi r = 2
    for (let r = 1; r <= 3; r++) {
        const offsets = [];
        for (let dx = -r; dx <= r; dx++) {
            for (let dy = -r; dy <= r; dy++) {
                if (Math.max(Math.abs(dx), Math.abs(dy)) === r) {
                    offsets.push({ dx, dy });
                }
            }
        }
        for (const { dx, dy } of offsets) {
            const candX = (baseGridX + dx) * gridSize + effOffsetX;
            const candY = (baseGridY + dy) * gridSize + effOffsetY;

            if (candX < 0 || candX + tokenSize > mapW || candY < 0 || candY + tokenSize > mapH) {
                continue;
            }

            const isColliding = (engine.tokens || []).some(t => {
                if (!t.visible && !engine.isDM) return false;
                return !(candX + tokenSize <= t.x || candX >= t.x + t.width ||
                         candY + tokenSize <= t.y || candY >= t.y + t.height);
            });

            if (!isColliding) {
                return { x: candX, y: candY };
            }
        }
    }

    return {
        x: Math.max(0, Math.min(mapW - tokenSize, baseToken.x + gridSize)),
        y: Math.max(0, Math.min(mapH - tokenSize, baseToken.y))
    };
}

function getLocalPlayerMainToken() {
    if (window.editingPlayerToken && isTokenOwnedByLocalPlayer(window.editingPlayerToken) && !window.editingPlayerToken.isEvocation) {
        return window.editingPlayerToken;
    }
    if (engine.tokens && engine.tokens.length > 0) {
        // Cerca prima token principale di categoria 'personaggi'
        const pcTok = engine.tokens.find(t => isTokenOwnedByLocalPlayer(t) && !t.isEvocation && t.category === 'personaggi');
        if (pcTok) return pcTok;
        // Altrimenti qualsiasi token non evocazione posseduto
        const nonEvoke = engine.tokens.find(t => isTokenOwnedByLocalPlayer(t) && !t.isEvocation);
        if (nonEvoke) return nonEvoke;
        // Fallback qualsiasi token posseduto
        return engine.tokens.find(t => isTokenOwnedByLocalPlayer(t));
    }
    return null;
}

function getPlayerEvocationPresets() {
    const mainTok = getLocalPlayerMainToken();
    let presets = [];
    if (mainTok && Array.isArray(mainTok.evocationPresets) && mainTok.evocationPresets.length > 0) {
        presets = mainTok.evocationPresets;
    } else {
        const pName = (network && network.playerName) ? network.playerName.trim().toLowerCase() : 'default';
        try {
            const raw = localStorage.getItem('vtt_evocation_presets_' + pName);
            if (raw) presets = JSON.parse(raw);
        } catch (e) {}
    }
    return Array.isArray(presets) ? presets : [];
}

function savePlayerEvocationPresets(presets) {
    const pName = (network && network.playerName) ? network.playerName.trim().toLowerCase() : 'default';
    try {
        localStorage.setItem('vtt_evocation_presets_' + pName, JSON.stringify(presets));
    } catch (e) {}

    const mainTok = getLocalPlayerMainToken();
    if (mainTok) {
        mainTok.evocationPresets = presets;
        if (window.pcSheetManager && typeof window.pcSheetManager.commitSheetChanges === 'function') {
            window.pcSheetManager.commitSheetChanges(mainTok, false);
        }
    }
}

function populateEvocationPresetsDropdown() {
    const select = document.getElementById('pevoke-preset-select');
    const group = document.getElementById('pevoke-custom-presets-group');
    const delBtn = document.getElementById('pevoke-btn-delete-preset');
    if (!select || !group) return;

    group.innerHTML = '';
    const presets = getPlayerEvocationPresets();
    presets.forEach((p, idx) => {
        const opt = document.createElement('option');
        opt.value = 'custom_' + (p.id || idx);
        const durTag = (p.durationRounds && Number(p.durationRounds) > 0) ? ` - ⏳${p.durationRounds}r` : '';
        opt.textContent = `✦ ${p.name} (${p.sizeMultiplier === 2 ? 'Grande' : (p.sizeMultiplier === 3 ? 'Enorme' : 'Media')}${p.hp ? ' - ' + p.hp + ' PF' : ''}${durTag})`;
        opt.dataset.presetJson = JSON.stringify(p);
        group.appendChild(opt);
    });

    if (delBtn) delBtn.style.display = 'none';
}

// Preset selection change
const pevokeSelect = document.getElementById('pevoke-preset-select');
if (pevokeSelect) {
    pevokeSelect.addEventListener('change', () => {
        const val = pevokeSelect.value;
        const delBtn = document.getElementById('pevoke-btn-delete-preset');
        const nameInput = document.getElementById('pevoke-name');
        const sizeSelect = document.getElementById('pevoke-size');
        const colorInput = document.getElementById('pevoke-color');
        const hpInput = document.getElementById('pevoke-hp');
        const durInput = document.getElementById('pevoke-duration');

        if (delBtn) delBtn.style.display = val.startsWith('custom_') ? 'inline-block' : 'none';

        if (val === '__builtin_arma_spirituale') {
            nameInput.value = 'Arma Spirituale';
            sizeSelect.value = '1';
            colorInput.value = '#00e5ff';
            hpInput.value = '';
            if (durInput) durInput.value = '';
            window._pendingEvocationStatblock = JSON.parse(JSON.stringify(SPIRITUAL_WEAPON_STATBLOCK));
        } else if (val === '__builtin_mano_magica') {
            nameInput.value = 'Mano Magica';
            sizeSelect.value = '1';
            colorInput.value = '#b388ff';
            hpInput.value = '1';
            if (durInput) durInput.value = '';
            window._pendingEvocationStatblock = JSON.parse(JSON.stringify(MAGE_HAND_STATBLOCK));
        } else if (val === '__builtin_lupo') {
            nameInput.value = 'Lupo';
            sizeSelect.value = '1';
            colorInput.value = '#8d6e63';
            hpInput.value = '11';
            if (durInput) durInput.value = '';
            window._pendingEvocationStatblock = JSON.parse(JSON.stringify(WOLF_STATBLOCK));
        } else if (val.startsWith('custom_')) {
            const opt = pevokeSelect.options[pevokeSelect.selectedIndex];
            if (opt && opt.dataset.presetJson) {
                try {
                    const p = JSON.parse(opt.dataset.presetJson);
                    if (p.name) nameInput.value = p.name;
                    if (p.sizeMultiplier) sizeSelect.value = String(p.sizeMultiplier);
                    if (p.color) colorInput.value = p.color;
                    hpInput.value = (p.hp !== undefined && p.hp !== null) ? p.hp : '';
                    if (durInput) durInput.value = (p.durationRounds !== undefined && p.durationRounds !== null && Number(p.durationRounds) > 0) ? p.durationRounds : '';
                    window._pendingEvocationStatblock = p.statblock ? JSON.parse(JSON.stringify(p.statblock)) : null;
                } catch(e) {}
            }
        } else {
            if (durInput) durInput.value = '';
            window._pendingEvocationStatblock = null;
        }
        if (typeof window.updateEvocationStatblockBadge === 'function') {
            window.updateEvocationStatblockBadge();
        }
    });
}

// Delete custom preset button
const pevokeDeleteBtn = document.getElementById('pevoke-btn-delete-preset');
if (pevokeDeleteBtn) {
    pevokeDeleteBtn.addEventListener('click', () => {
        const select = document.getElementById('pevoke-preset-select');
        const val = select ? select.value : '';
        if (!val.startsWith('custom_')) return;

        const opt = select.options[select.selectedIndex];
        let pId = null;
        if (opt && opt.dataset.presetJson) {
            try { pId = JSON.parse(opt.dataset.presetJson).id; } catch(e) {}
        }

        let presets = getPlayerEvocationPresets();
        if (pId) {
            presets = presets.filter(p => p.id !== pId);
        } else {
            const idx = parseInt(val.replace('custom_', ''));
            if (!isNaN(idx)) presets.splice(idx, 1);
        }

        savePlayerEvocationPresets(presets);
        populateEvocationPresetsDropdown();
        select.value = '';
        pevokeDeleteBtn.style.display = 'none';
        if (typeof showPlayerToast === 'function') {
            showPlayerToast('🗑️ Preset eliminato.');
        }
    });
}

// Toggle Evocation Panel button in toolbar
const pbtnEvoke = document.getElementById('pbtn-evoke');
const pEvokePanel = document.getElementById('player-evoke-panel');
if (pbtnEvoke && pEvokePanel) {
    pbtnEvoke.addEventListener('click', () => {
        const isHidden = pEvokePanel.style.display === 'none' || !pEvokePanel.style.display;
        if (isHidden) {
            populateEvocationPresetsDropdown();
            const playerCol = document.getElementById('player-color');
            const evCol = document.getElementById('pevoke-color');
            if (playerCol && evCol) evCol.value = playerCol.value || '#b388ff';
            pEvokePanel.style.display = 'block';
        } else {
            pEvokePanel.style.display = 'none';
        }
    });
}

const pbtnCloseEvoke = document.getElementById('pbtn-close-evoke');
if (pbtnCloseEvoke && pEvokePanel) {
    pbtnCloseEvoke.addEventListener('click', () => {
        pEvokePanel.style.display = 'none';
    });
}


const WOLF_STATBLOCK = {
    name: "Lupo (Wolf)",
    size: "Media",
    type: "Bestia, Senza Allineamento",
    armor_class: 13,
    hit_points: 11,
    speed: "40 ft.",
    strength: 12, dexterity: 15, constitution: 12, intelligence: 3, wisdom: 12, charisma: 6,
    skills: "Furtività +4, Percezione +3",
    senses: "Percezione passiva 13",
    special_abilities: [
        { name: "Udito e Olfatto Affinati", desc: "Il lupo ha vantaggio alle prove di Saggezza (Percezione) basate sull'udito o sull'olfatto." },
        { name: "Tattiche di Branco", desc: "Il lupo ha vantaggio ai tiri per colpire contro una creatura se almeno uno dei suoi alleati si trova entro 1,5 metri da essa e non è inabile." }
    ],
    actions: [
        { name: "Morso", desc: "Attacco con Arma da Mischia: +4 per colpire, portata 5 ft., un bersaglio. Colpito: 7 (2d4 + 2) danni perforanti. Se il bersaglio è una creatura, deve superare un tiro salvezza su Forza con CD 11 o cadere a terra prono." }
    ]
};

const MAGE_HAND_STATBLOCK = {
    name: "Mano Magica (Mage Hand)",
    size: "Piccola",
    type: "Costrutto spettrale (Invocazione)",
    armor_class: 10,
    hit_points: 1,
    speed: "Volare 30 ft.",
    strength: 2, dexterity: 14, constitution: 10, intelligence: 10, wisdom: 10, charisma: 1,
    actions: [
        { name: "Manipola Oggetto", desc: "La mano spettrale può manipolare un oggetto, aprire una porta o contenitore non sbarrati, riporre o estrarre un oggetto, o versare una fiala (portata 30 ft., max 4.5 kg)." }
    ]
};

const SPIRITUAL_WEAPON_STATBLOCK = {
    name: "Arma Spirituale (Spiritual Weapon)",
    size: "Media",
    type: "Forza Magica Spettrale",
    armor_class: 15,
    hit_points: 0,
    speed: "Volare 20 ft.",
    strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 16, charisma: 10,
    actions: [
        { name: "Attacco con Arma Spirituale", desc: "Attacco con Incantesimo da Mischia: tiro per colpire da incantesimo del lanciatore, portata 5 ft. Colpito: 1d8 + mod. caratteristica da incantatore danni da forza." }
    ]
};

window.updateEvocationStatblockBadge = function() {
    const badge = document.getElementById('pevoke-statblock-badge');
    const badgeText = document.getElementById('pevoke-statblock-badge-text');
    if (!badge || !badgeText) return;
    if (window._pendingEvocationStatblock && window._pendingEvocationStatblock.name) {
        const sb = window._pendingEvocationStatblock;
        const acStr = sb.armor_class ? `CA ${sb.armor_class}` : '';
        const hpStr = (sb.hit_points !== undefined && sb.hit_points !== null) ? `PF ${sb.hit_points}` : '';
        const details = [acStr, hpStr].filter(Boolean).join(', ');
        badgeText.textContent = `🐉 ${sb.name}${details ? ' (' + details + ')' : ''}`;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
};

window.onEvocationStatblockImported = function(normalized) {
    if (!normalized) return;
    window._pendingEvocationStatblock = normalized;
    const nameInput = document.getElementById('pevoke-name');
    const hpInput = document.getElementById('pevoke-hp');
    const sizeSelect = document.getElementById('pevoke-size');
    if (nameInput && normalized.name) nameInput.value = normalized.name;
    if (hpInput) hpInput.value = (normalized.hit_points !== undefined && normalized.hit_points !== null) ? normalized.hit_points : '';
    if (sizeSelect && normalized.size) {
        const s = String(normalized.size).toLowerCase();
        if (s.includes('large') || s.includes('grande') || s === 'l') sizeSelect.value = '2';
        else if (s.includes('huge') || s.includes('enorme') || s === 'h') sizeSelect.value = '3';
        else if (s.includes('gargantuan') || s.includes('mastodontica') || s === 'g') sizeSelect.value = '3';
        else sizeSelect.value = '1';
    }
    if (typeof window.updateEvocationStatblockBadge === 'function') {
        window.updateEvocationStatblockBadge();
    }
    if (typeof showPlayerToast === 'function') {
        showPlayerToast(`🐉 Scheda "${normalized.name}" pronta per l'evocazione!`);
    }
};

document.getElementById('pevoke-btn-paste-statblock')?.addEventListener('click', () => {
    window._importingForEvocation = true;
    const modal = document.getElementById('modal-json-import');
    if (modal) modal.style.display = 'flex';
});

document.getElementById('pevoke-btn-clear-statblock')?.addEventListener('click', () => {
    window._pendingEvocationStatblock = null;
    if (typeof window.updateEvocationStatblockBadge === 'function') {
        window.updateEvocationStatblockBadge();
    }
});

// Spawn evocation button
const pevokeBtnSpawn = document.getElementById('pevoke-btn-spawn');
if (pevokeBtnSpawn) {
    pevokeBtnSpawn.addEventListener('click', () => {
        const nameInput = document.getElementById('pevoke-name');
        const sizeSelect = document.getElementById('pevoke-size');
        const colorInput = document.getElementById('pevoke-color');
        const hpInput = document.getElementById('pevoke-hp');
        const durInput = document.getElementById('pevoke-duration');
        const saveCheck = document.getElementById('pevoke-save-preset');

        const name = (nameInput ? nameInput.value.trim() : '') || 'Evocazione';
        const sizeMul = parseInt(sizeSelect ? sizeSelect.value : '1') || 1;
        const color = (colorInput ? colorInput.value : '#b388ff') || '#b388ff';
        const rawHp = hpInput ? parseInt(hpInput.value) : NaN;
        const hpVal = (!isNaN(rawHp) && rawHp > 0) ? rawHp : undefined;
        const rawDur = durInput ? parseInt(durInput.value) : NaN;
        const durVal = (!isNaN(rawDur) && rawDur > 0) ? rawDur : undefined;

        // Se spuntato "Salva come mio preset"
        if (saveCheck && saveCheck.checked) {
            let presets = getPlayerEvocationPresets();
            const existingIdx = presets.findIndex(p => p.name.trim().toLowerCase() === name.toLowerCase());
            const newP = {
                id: 'preset_' + Date.now(),
                name: name,
                sizeMultiplier: sizeMul,
                color: color,
                hp: hpVal !== undefined ? hpVal : null,
                durationRounds: durVal !== undefined ? durVal : null,
                statblock: window._pendingEvocationStatblock ? JSON.parse(JSON.stringify(window._pendingEvocationStatblock)) : null
            };
            if (existingIdx >= 0) presets[existingIdx] = newP;
            else presets.push(newP);
            savePlayerEvocationPresets(presets);
            populateEvocationPresetsDropdown();
            saveCheck.checked = false;
        }

        // Calcola posizione di spawn nella prima casella adiacente libera
        const mainTok = getLocalPlayerMainToken();
        const gridSize = (engine && engine.grid && engine.grid.size) ? engine.grid.size : 50;
        const sizePx = gridSize * sizeMul;

        let spawnPos = null;
        if (mainTok) {
            spawnPos = findFreeAdjacentCell(mainTok, sizeMul);
        }
        if (!spawnPos && engine.getSafeAoESpawnPosition) {
            spawnPos = engine.getSafeAoESpawnPosition('circle', sizeMul * 5, 5);
        }
        if (!spawnPos) {
            spawnPos = engine.screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
        }

        // Genera token procedurale vettoriale / canvas (0 KB file, ultraleggero)
        const myName = network.playerName || 'Giocatore';
        const tokenSrc = createEvocationTokenDataUrl(name, color, myName);

        const st = window._pendingEvocationStatblock ? JSON.parse(JSON.stringify(window._pendingEvocationStatblock)) : null;
        let finalHp = hpVal;
        if (finalHp === undefined && st && st.hit_points !== undefined && st.hit_points > 0) {
            finalHp = st.hit_points;
        }
        if (st) {
            if (finalHp !== undefined) st.hit_points = finalHp;
            if (name) st.name = name;
        }
        const finalAc = (st && st.armor_class !== undefined && st.armor_class !== null) ? st.armor_class : 10;

        let skipFirst = false;
        let casterInitId = undefined;
        const casterTokId = mainTok ? mainTok.id : undefined;
        if (durVal !== undefined && engine.initiative && engine.initiative.active && engine.initiative.participants && engine.initiative.participants.length > 0) {
            const curP = engine.initiative.participants[engine.initiative.currentTurnIndex];
            if (curP) {
                const pNorm = myName.trim().toLowerCase();
                const curName = (curP.name || '').trim().toLowerCase();
                const curTok = curP.tokenId && engine.tokens ? engine.tokens.find(t => String(t.id) === String(curP.tokenId)) : null;
                if ((curTok && isTokenOwnedByLocalPlayer(curTok)) ||
                    (casterTokId && String(curP.tokenId) === String(casterTokId)) ||
                    (curName && (curName === pNorm || curName.startsWith(pNorm + ' ') || curName.includes(pNorm)))) {
                    skipFirst = true;
                    casterInitId = curP.id;
                }
            }
        }

        const newTok = {
            id: 'token_evoke_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: name,
            category: 'evocazioni',
            isEvocation: true,
            evokerName: myName,
            casterTokenId: casterTokId,
            casterInitiativeId: casterInitId,
            durationRounds: durVal,
            roundsLeft: durVal,
            skipFirstDecrement: skipFirst || undefined,
            x: spawnPos.x,
            y: spawnPos.y,
            width: sizePx,
            height: sizePx,
            sizeMultiplier: sizeMul,
            color: color,
            src: tokenSrc,
            visible: true,
            hpMax: finalHp,
            hpCurrent: finalHp,
            hpVisibleToPlayers: true,
            ac: finalAc,
            statblock: st,
            owner: myName,
            owners: [myName]
        };
        window._pendingEvocationStatblock = null;
        if (typeof window.updateEvocationStatblockBadge === 'function') {
            window.updateEvocationStatblockBadge();
        }

        // Invia a host Master (solo dati JSON senza elementi DOM)
        network.send({
            type: 'PLAYER_SPAWN_TOKEN',
            payload: newTok
        });

        // Carica immagine localmente per render immediato a 0ms di lag
        const img = new Image();
        img.onload = () => {
            newTok.imageObj = img;
            engine.renderTokensLayer();
        };
        img.src = tokenSrc;
        newTok.imageObj = img;

        // Aggiungi localmente per feedback istantaneo
        engine.tokens.push(newTok);
        window.editingPlayerToken = newTok;
        engine.selectedTokenId = newTok.id;
        engine.renderTokensLayer();

        if (pEvokePanel) pEvokePanel.style.display = 'none';

        if (typeof showPlayerToast === 'function') {
            showPlayerToast(`✨ Hai evocato "${name}"!`);
        }
    });
}

// Dismiss evocation button in player-token-panel
const pbtnDismissToken = document.getElementById('pbtn-dismiss-token');
if (pbtnDismissToken) {
    pbtnDismissToken.addEventListener('click', () => {
        const curTok = window.editingPlayerToken || (engine.selectedTokenId ? engine.tokens.find(t => t.id === engine.selectedTokenId) : null);
        if (!curTok || !curTok.isEvocation) return;

        network.send({
            type: 'PLAYER_DISMISS_TOKEN',
            payload: {
                id: curTok.id,
                player: network.playerName || 'local'
            }
        });

        // Rimuovi localmente
        engine.tokens = engine.tokens.filter(t => t.id !== curTok.id);
        if (engine.selectedTokenId === curTok.id) engine.selectedTokenId = null;
        window.editingPlayerToken = null;

        const tokenPanel = document.getElementById('player-token-panel');
        if (tokenPanel) tokenPanel.style.display = 'none';

        engine.renderTokensLayer();

        if (typeof showPlayerToast === 'function') {
            showPlayerToast(`💨 "${curTok.name}" congedato.`);
        }
    });
}
