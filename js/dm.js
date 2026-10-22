function escapeHTML(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));
}
const engine = new VTTEngine('main-canvas-container', true);

// Modalità Offline di base
network.startOffline();

// Setup online host button
document.getElementById('btn-host-online').addEventListener('click', () => {
    const btn = document.getElementById('btn-host-online');
    const status = document.getElementById('online-status');
    btn.disabled = true;
    btn.innerText = "Creazione Stanza...";
    
    network.hostRoom().then(id => {
        btn.style.display = 'none';
        status.innerHTML = `<span style="color:#4caf50; font-weight:bold;">Online!</span><br>Codice Stanza: <b style="color:#ffcc00; font-size:16px; user-select: all; cursor: pointer; letter-spacing: 1px;" title="Seleziona o clicca per copiare">${escapeHTML(id)}</b>`;
    }).catch(err => {
        btn.disabled = false;
        btn.innerText = "Riprova";
        status.innerHTML = `<span style="color:#f44336;">Errore di connessione.</span>`;
        console.error(err);
    });
});

// Setup button per aprire schermata giocatore online / test con codice
const btnOpenPlayerOnline = document.getElementById('btn-open-player-online');
if (btnOpenPlayerOnline) {
    btnOpenPlayerOnline.addEventListener('click', () => {
        const url = (network && network.roomId) ? `player.html?room=${encodeURIComponent(network.roomId)}` : 'player.html';
        window.open(url, '_blank', 'width=1000,height=700');
    });
}

network.onConnect((playerName, pid) => {
    if(playerName) {
        const div = document.getElementById('online-players');
        if(div.innerText === "Nessun giocatore connesso.") div.innerText = "";
        div.innerHTML += `<div>🟢 ${escapeHTML(playerName)}</div>`;
        // Nota: l'invio di mappa, stato e nebbia avviene in PLAYER_READY mirato solo al nuovo peerId
    }
});

network.onMessage((data, peerId) => {
    if (data.type === 'PLAYER_READY') {
        // Invia STATO immediatamente (<10ms) così token e aure appaiono subito, poi mappa compressa e nebbia
        syncState(true, true, peerId);
        const mapPayload = getNetworkMapPayload();
        if (mapPayload) {
            network.send({ type: 'MAP_UPDATE', payload: mapPayload }, peerId);
        }
        setTimeout(() => {
            syncFog(peerId);
        }, 120);
    } else if (data.type === 'REQUEST_TOKEN_IMAGE') {
        const reqKey = data.imgKey;
        if (reqKey) {
            const cachedSrc = compressedTokenSrcByKey.get(reqKey);
            if (cachedSrc) {
                network.send({ type: 'TOKEN_IMAGE_SYNC', payload: { imgKey: reqKey, src: cachedSrc } }, peerId);
            } else {
                const tok = engine.tokens.find(t => getTokenImgKey(t.src) === reqKey);
                if (tok && tok.src) {
                    const cSrc = getOrCompressTokenSrc(tok);
                    network.send({ type: 'TOKEN_IMAGE_SYNC', payload: { imgKey: reqKey, src: cSrc } }, peerId);
                }
            }
        }
    } else if (data.type === 'REQUEST_IMAGE') {
        if (engine.sharedImageId === data.imageId && engine.sharedImageData) {
            network.send({
                type: 'SHARED_IMAGE_DATA',
                imageId: engine.sharedImageId,
                data: engine.sharedImageData
            }, peerId);
        }
    } else if (data.type === 'PLAYER_MOVE_TOKEN') {
        const payload = data.payload;
        const token = engine.tokens.find(t => t.id === payload.id);
        let pName = (peerId === 'local') ? (token ? token.owner : null) : (network.connections[peerId] ? network.connections[peerId].name : null);
        if (token && token.owner === pName) {
            token.x = payload.x;
            token.y = payload.y;
            engine.renderTokensLayer();
            // Inoltra movimento in tempo reale SOLO agli altri giocatori, mai al mittente
            const moveMsg = {
                type: 'REMOTE_TOKEN_MOVE',
                ephemeral: true,
                payload: { id: token.id, x: token.x, y: token.y }
            };
            if (network.mode === 'host') {
                for (let k in network.connections) {
                    if (k !== peerId) network.send(moveMsg, k);
                }
                if (peerId !== 'local') network.send(moveMsg, 'local');
            }
        }
    } else if (data.type === 'PLAYER_END_TOKEN') {
        const payload = data.payload;
        const token = engine.tokens.find(t => t.id === payload.id);
        let pName = (peerId === 'local') ? (token ? token.owner : null) : (network.connections[peerId] ? network.connections[peerId].name : null);
        if (token && token.owner === pName) {
            token.x = payload.x;
            token.y = payload.y;
            engine.renderTokensLayer();
            const endMsg = {
                type: 'REMOTE_TOKEN_MOVE',
                final: true,
                payload: { id: token.id, x: token.x, y: token.y }
            };
            if (network.mode === 'host') {
                for (let k in network.connections) {
                    if (k !== peerId) network.send(endMsg, k);
                }
                if (peerId !== 'local') network.send(endMsg, 'local');
            } else {
                network.send(endMsg);
            }
        }
    
    } else if (data.type === 'DICE_ROLL') {
        if (window.appendRollToChat) {
            if (window.lastRollId === data.payload.id) return;
            window.lastRollId = data.payload.id;
            window.appendRollToChat(data.payload);
            const cp = document.getElementById('chat-panel');
            if (cp) cp.style.display = 'flex';
        }
        // Rimbalza il tiro del giocatore a tutti gli altri giocatori!
        network.send(data);
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
        if (network.mode === 'host') {
            for (let k in network.connections) {
                if (k !== peerId && network.connections[k].conn) {
                    network.connections[k].conn.send(data);
                }
            }
        }
    } else if (data.type === 'PING') {
        const pingPayload = data.payload || data;
        const pingId = pingPayload.id || (pingPayload.x + '_' + pingPayload.y + '_' + (pingPayload.t || ''));
        if (window.lastReceivedPingId === pingId) return;
        window.lastReceivedPingId = pingId;
        engine.pings.push({x: pingPayload.x, y: pingPayload.y, start: Date.now(), color: pingPayload.color || '#ff0000'});
        engine.renderUI();
        // Invia SOLO ai giocatori remoti via PeerJS (non rimbalzare sul BroadcastChannel locale se è già locale!)
        if (peerId !== 'local' && network.mode === 'offline') {
            network.send(data);
        } else if (network.mode === 'host') {
            for (let k in network.connections) {
                if (k !== peerId && network.connections[k].conn) {
                    network.connections[k].conn.send(data);
                }
            }
        }
    } else if (data.type === 'PLAYER_DRAW') {
        engine.publicStrokes.push(data.payload);
        engine.renderAll();
        syncState(true);
    } else if (data.type === 'PLAYER_ADD_SHAPE') {
        engine.shapes.push(data.payload);
        engine.renderAll();
        syncState(true);
    } else if (data.type === 'PLAYER_MOVE_SHAPE') {
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s) {
            s.x = data.payload.x;
            s.y = data.payload.y;
            engine.renderTokensLayer();
            const moveMsg = {
                type: 'REMOTE_SHAPE_MOVE',
                ephemeral: true,
                payload: { id: s.id, x: s.x, y: s.y }
            };
            if (network.mode === 'host') {
                for (let k in network.connections) {
                    if (k !== peerId) network.send(moveMsg, k);
                }
                if (peerId !== 'local') network.send(moveMsg, 'local');
            }
        }
    } else if (data.type === 'PLAYER_END_SHAPE') {
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s) {
            s.x = data.payload.x;
            s.y = data.payload.y;
            engine.renderTokensLayer();
            const endMsg = {
                type: 'REMOTE_SHAPE_MOVE',
                final: true,
                payload: { id: s.id, x: s.x, y: s.y }
            };
            if (network.mode === 'host') {
                for (let k in network.connections) {
                    if (k !== peerId) network.send(endMsg, k);
                }
                if (peerId !== 'local') network.send(endMsg, 'local');
            } else {
                network.send(endMsg);
            }
        }
    } else if (data.type === 'PLAYER_UPDATE_SHAPE') {
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s) {
            s.sizeFt = data.payload.sizeFt;
            if (data.payload.widthFt !== undefined) s.widthFt = data.payload.widthFt;
            s.angle = data.payload.angle;
            s.color = data.payload.color;
            engine.renderAll();
            syncState(true);
        }
    } else if (data.type === 'PLAYER_DELETE_SHAPE') {
        engine.shapes = engine.shapes.filter(x => x.id !== data.payload.id);
        engine.renderAll();
        syncState(true);
    } else if (data.type === 'PLAYER_UPDATE_TOKEN_AURA') {
        const token = engine.tokens.find(t => t.id === data.payload.id);
        if (token) {
            token.aura = data.payload.auraObj;
            engine.renderAll();
            syncState(true);
        }
    }
});


let currentTool = 'move';
let isDragging = false;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let activeStroke = null;
let activeLaser = null;
let lastLaserSync = 0;
let tokenImages = {};
let currentMapBase64 = null;
let lastClickedTokenId = null;
let lastClickedTokenTime = 0;
let lastStatblockOpenTime = 0;
let clickedTokenForInteraction = null;


window.getSmartTokenName = function(t) {
    if (t.name) return t.name;
    if (t.owner) return t.owner;
    let baseName = t.originalName || 'Mostro';
    baseName = baseName.replace(/\.[^/.]+$/, ""); // Rimuove l'estensione (es. .jpg)
    
    let count = 0;
    if (engine.initiative && engine.initiative.participants) {
        engine.initiative.participants.forEach(p => {
            if (p.tokenId === t.id) return;
            if (p.name === baseName || p.name.startsWith(baseName + ' ')) {
                count++;
            }
        });
    }
    
    if (count > 0 || baseName.toLowerCase() === 'mostro') {
        return baseName + ' ' + (count + 1);
    }
    return baseName;
};

// Inizializza il database locale



let isLockMapActive = false;
const lockMapBtn = document.getElementById('lock-map-toggle');
if (lockMapBtn) {
    lockMapBtn.addEventListener('change', (e) => {
        isLockMapActive = e.target.checked;
        syncState(true);
    });
}

const hpStyleBtn = document.getElementById('hp-display-style');
if (hpStyleBtn) {
    // Inizializza subito lo stile dell'engine
    engine.hpDisplayStyle = hpStyleBtn.value;
    hpStyleBtn.addEventListener('change', (e) => {
        engine.hpDisplayStyle = e.target.value;
        engine.renderAll();
        syncState(true);
    });
}

const condStyleBtn = document.getElementById('condition-display-style');
if (condStyleBtn) {
    engine.conditionDisplayStyle = condStyleBtn.value;
    condStyleBtn.addEventListener('change', (e) => {
        engine.conditionDisplayStyle = e.target.value;
        engine.renderAll();
        syncState(true);
    });
}
let isHideToolbarActive = false;
const hideToolbarBtn = document.getElementById('hide-toolbar-toggle');
if (hideToolbarBtn) {
    hideToolbarBtn.addEventListener('change', (e) => {
        isHideToolbarActive = e.target.checked;
        syncState(true);
    });
}

let isViewSyncActive = false;
let lastViewSyncSend = 0;

function sendViewSync(force = false) {
    if (!isViewSyncActive || engine.scale <= 0 || !engine.container) return;
    const now = Date.now();
    if (!force && now - lastViewSyncSend < 30) return;
    lastViewSyncSend = now;

    const payload = {
        centerX: (engine.container.clientWidth / 2 - engine.offsetX) / engine.scale,
        centerY: (engine.container.clientHeight / 2 - engine.offsetY) / engine.scale,
        scale: engine.scale
    };
    network.send({
        type: 'VIEW_SYNC',
        payload: payload
    });
}

const syncToggleBtn = document.getElementById('sync-view-toggle');
if (syncToggleBtn) {
    syncToggleBtn.addEventListener('change', (e) => {
        isViewSyncActive = e.target.checked;
        if (isViewSyncActive) {
            sendViewSync(true);
        }
        syncState(true);
    });
}


let savedTokensLibrary = [];
let currentTokenTab = 'map';

vttDB.init().then(async () => {
    refreshCampaigns();
    try {
        savedTokensLibrary = await vttDB.getTokens() || [];
        if (typeof updateLibraryGallery === 'function') updateLibraryGallery();
    } catch (e) {
        console.warn("Libreria token:", e);
    }
});

let lastSyncTime = 0;
let syncTimeout = null;
const syncedTokenImageIds = new Set();
const syncedImageKeys = new Set();
const compressedTokenSrcByKey = new Map();
let cachedNetworkMapSource = null;
let cachedNetworkMapOutput = null;

function getTokenImgKey(src) {
    if (!src) return null;
    const len = src.length;
    if (len <= 120) return src;
    const mid = Math.floor(len / 2);
    return 'ik_' + len + '_' + src.slice(22, 46) + '_' + src.slice(mid, mid + 24) + '_' + src.slice(len - 24);
}

function getOrCompressTokenSrc(token) {
    if (!token || !token.src) return null;
    if (!token.src.startsWith('data:image') || token.src.length <= 22000) {
        const key = getTokenImgKey(token.src);
        if (key) compressedTokenSrcByKey.set(key, token.src);
        return token.src;
    }
    const origKey = getTokenImgKey(token.src);
    if (origKey && compressedTokenSrcByKey.has(origKey)) {
        const cached = compressedTokenSrcByKey.get(origKey);
        token.src = cached;
        return cached;
    }
    if (token.imageObj && token.imageObj.width > 0 && token.imageObj.height > 0) {
        try {
            const maxDim = 160;
            let w = token.imageObj.width;
            let h = token.imageObj.height;
            if (w > maxDim || h > maxDim) {
                if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
                else { w = Math.round((w * maxDim) / h); h = maxDim; }
            }
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            const ctx = c.getContext('2d');
            ctx.drawImage(token.imageObj, 0, 0, w, h);
            let small = c.toDataURL('image/webp', 0.82);
            if (!small || !small.startsWith('data:image/webp')) {
                small = c.toDataURL('image/png');
            }
            if (small && small.length < token.src.length) {
                token.src = small;
            }
        } catch (e) {
            console.warn("Token compression fallback:", e);
        }
    }
    const newKey = getTokenImgKey(token.src);
    if (origKey) compressedTokenSrcByKey.set(origKey, token.src);
    if (newKey) compressedTokenSrcByKey.set(newKey, token.src);
    return token.src;
}

function getNetworkMapPayload() {
    const raw = currentMapBase64 || (engine.mapImage ? engine.mapImage.src : null);
    if (!raw) return null;
    if (cachedNetworkMapSource === raw && cachedNetworkMapOutput) {
        return cachedNetworkMapOutput;
    }
    if (!raw.startsWith('data:image') || raw.length <= 280000 || !engine.mapImage || !engine.mapImage.width) {
        cachedNetworkMapSource = raw;
        cachedNetworkMapOutput = raw;
        return raw;
    }
    try {
        // Mantiene esattamente width e height originali per preservare al 100% le coordinate di griglia, nebbia e token!
        const c = document.createElement('canvas');
        c.width = engine.mapImage.width;
        c.height = engine.mapImage.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(engine.mapImage, 0, 0);
        let compressed = c.toDataURL('image/webp', 0.72);
        if (!compressed || !compressed.startsWith('data:image/webp')) {
            compressed = c.toDataURL('image/jpeg', 0.75);
        }
        cachedNetworkMapSource = raw;
        cachedNetworkMapOutput = (compressed && compressed.length < raw.length) ? compressed : raw;
        return cachedNetworkMapOutput;
    } catch (e) {
        return raw;
    }
}

window.markTokenImageDirty = function(tokenId) {
    if (tokenId) syncedTokenImageIds.delete(tokenId);
};

function syncState(force = false, sendFullImages = false, targetPeerId = null) {
    const now = Date.now();
    // Debounce intelligente: raggruppa aggiornamenti ravvicinati senza intasare WebRTC
    if (!force && !targetPeerId && now - lastSyncTime < 50) {
        if (!syncTimeout) {
            syncTimeout = setTimeout(() => {
                syncTimeout = null;
                syncState(true, false);
            }, 50);
        }
        return;
    }
    
    if (!targetPeerId && syncTimeout) {
        clearTimeout(syncTimeout);
        syncTimeout = null;
    }
    if (!targetPeerId) {
        lastSyncTime = now;
    }

    if (sendFullImages && !targetPeerId) {
        syncedTokenImageIds.clear();
        syncedImageKeys.clear();
    }

    let viewSyncData = null;
    if (typeof isViewSyncActive !== 'undefined' && isViewSyncActive && engine.scale > 0 && engine.container) {
        viewSyncData = {
            centerX: (engine.container.clientWidth / 2 - engine.offsetX) / engine.scale,
            centerY: (engine.container.clientHeight / 2 - engine.offsetY) / engine.scale,
            scale: engine.scale
        };
    }

    const imagesToSendAfterState = [];
    const batchQueuedKeys = new Set();

    // OTTIMIZZAZIONE CRITICA ZERO-LAG:
    // 1. Filtra i token invisibili (!t.visible): i giocatori non ricevono dati dei mostri nascosti!
    // 2. STATE_SYNC NON contiene MAI stringhe Base64 lunghe (`src: null`), restando sempre < 2-3 KB!
    //    Così rivelare 20 token o attivare un'aura arriva a tutti i giocatori in < 10 millisecondi!
    // 3. Le immagini dei token vengono compresse (~5 KB WebP) e inviate separatamente con TOKEN_IMAGE_SYNC.
    const visibleTokens = engine.tokens.filter(t => t.visible !== false);
    const networkTokens = visibleTokens.map(t => {
        const cleanSrc = getOrCompressTokenSrc(t);
        const imgKey = getTokenImgKey(cleanSrc);
        const isShortUrl = cleanSrc && cleanSrc.length <= 200;

        if (cleanSrc && !isShortUrl && imgKey) {
            const needSend = sendFullImages || !!targetPeerId || !syncedImageKeys.has(imgKey);
            if (needSend && !batchQueuedKeys.has(imgKey)) {
                batchQueuedKeys.add(imgKey);
                imagesToSendAfterState.push({ imgKey: imgKey, src: cleanSrc });
            }
            if (!targetPeerId) {
                syncedTokenImageIds.add(t.id);
                syncedImageKeys.add(imgKey);
            }
        }

        return {
            id: t.id,
            name: t.name,
            nameVisibility: t.nameVisibility,
            originalName: t.originalName,
            x: t.x,
            y: t.y,
            width: t.width,
            height: t.height,
            sizeMultiplier: t.sizeMultiplier,
            visible: true,
            hpMax: t.hpMax,
            hpCurrent: t.hpCurrent,
            hpVisibleToPlayers: t.hpVisibleToPlayers,
            ac: t.ac,
            aura: t.aura,
            conditions: t.conditions,
            condition: t.condition,
            owner: t.owner,
            imgKey: imgKey,
            src: isShortUrl ? cleanSrc : null
        };
    });

    const hpDisplayStyle = document.getElementById('hp-display-style') ? document.getElementById('hp-display-style').value : 'bar';
    const conditionDisplayStyle = document.getElementById('condition-display-style') ? document.getElementById('condition-display-style').value : 'concentric';
    network.send({
        type: 'STATE_SYNC',
        payload: {
            audioState: window.getAudioState ? window.getAudioState() : null,
            hpDisplayStyle: hpDisplayStyle,
            conditionDisplayStyle: conditionDisplayStyle,
            grid: engine.grid,
            tokens: networkTokens,
            shapes: engine.shapes,
            initiative: engine.initiative,
            publicStrokes: engine.publicStrokes,
            viewSync: viewSyncData,
            hideToolbar: typeof isHideToolbarActive !== 'undefined' ? isHideToolbarActive : false,
            lockMap: typeof isLockMapActive !== 'undefined' ? isLockMapActive : false,
            sharedImageId: engine.sharedImageId || null,
            sharedImageRect: {
                left: document.getElementById('dm-handout-window').style.left || 'calc(50% - 250px)',
                top: document.getElementById('dm-handout-window').style.top || '100px',
                width: document.getElementById('dm-handout-window').style.width || '500px',
                height: document.getElementById('dm-handout-window').style.height || '500px'
            }
        }
    }, targetPeerId);

    // Invia le immagini nuove/mancanti in pacchetti separati per non bloccare mai STATE_SYNC
    if (imagesToSendAfterState.length > 0) {
        imagesToSendAfterState.forEach(item => {
            network.send({
                type: 'TOKEN_IMAGE_SYNC',
                payload: item
            }, targetPeerId);
        });
    }
}
window.syncState = syncState;

function syncFog(targetPeerId = null) {
    network.send({
        type: 'FOG_SYNC',
        payload: engine.getFogBase64()
    }, targetPeerId);
}

document.getElementById('btn-open-player').addEventListener('click', () => {
    window.open('player.html?mode=tv', '_blank', 'width=800,height=600');
    setTimeout(() => {
        syncState(true, true);
        const mapPayload = getNetworkMapPayload();
        if (mapPayload) {
            network.send({ type: 'MAP_UPDATE', payload: mapPayload });
        }
        syncFog();
    }, 600);
});

// Load Map
const mapUploadEl = document.getElementById('map-upload');
if (mapUploadEl) {
    mapUploadEl.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                currentMapBase64 = ev.target.result;
                const img = new Image();
                img.onload = () => {
                    engine.setMap(img);
                    network.send({ type: 'MAP_UPDATE', payload: getNetworkMapPayload() });
                    syncState(true, true);
                    syncFog();
                };
                img.src = currentMapBase64;
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    });
}


// Inizializza Sistema Dadi
if (window.setupDiceSystem) {
    window.setupDiceSystem(true, network);
}

// Inizializza Sistema Audio & Soundboard
if (window.setupAudioSystem) {
    window.setupAudioSystem(true, network);
}

// Inizializza Pannello Regia & Campagna
const btnToggleCampaign = document.getElementById('btn-toggle-campaign');
const campaignPanel = document.getElementById('campaign-panel');
if (campaignPanel) {
    const campHeader = document.getElementById('campaign-panel-header');
    if (window.makeDraggable) window.makeDraggable(campaignPanel, campHeader);
    if (btnToggleCampaign) {
        btnToggleCampaign.addEventListener('click', () => {
            campaignPanel.style.display = campaignPanel.style.display === 'none' ? 'flex' : 'none';
        });
    }
    const btnCloseCamp = document.getElementById('btn-close-campaign-panel');
    if (btnCloseCamp) {
        btnCloseCamp.addEventListener('click', () => {
            campaignPanel.style.display = 'none';
        });
    }
}

// Inizializza Pannello Mappa & Griglia
const btnToggleMap = document.getElementById('btn-toggle-map');
const mapPanel = document.getElementById('map-panel');
if (mapPanel) {
    const mapHeader = document.getElementById('map-panel-header');
    if (window.makeDraggable) window.makeDraggable(mapPanel, mapHeader);
    if (btnToggleMap) {
        btnToggleMap.addEventListener('click', () => {
            mapPanel.style.display = mapPanel.style.display === 'none' ? 'flex' : 'none';
        });
    }
    const btnCloseMap = document.getElementById('btn-close-map-panel');
    if (btnCloseMap) {
        btnCloseMap.addEventListener('click', () => {
            mapPanel.style.display = 'none';
        });
    }
}

// Inizializza Pannello Zone d'Effetto (AoE)
const btnToggleAoE = document.getElementById('btn-toggle-aoe');
const aoePanel = document.getElementById('aoe-panel');
if (aoePanel) {
    const aoeHeader = document.getElementById('aoe-panel-header');
    if (window.makeDraggable) window.makeDraggable(aoePanel, aoeHeader);
    if (btnToggleAoE) {
        btnToggleAoE.addEventListener('click', () => {
            aoePanel.style.display = aoePanel.style.display === 'none' ? 'flex' : 'none';
        });
    }
    const btnCloseAoE = document.getElementById('btn-close-aoe-panel');
    if (btnCloseAoE) {
        btnCloseAoE.addEventListener('click', () => {
            aoePanel.style.display = 'none';
        });
    }
}

// Inizializza Pannello Libreria Token
const btnToggleTokens = document.getElementById('btn-toggle-tokens');
const btnOpenTokensSidebar = document.getElementById('btn-open-tokens-sidebar');
const tokenPanel = document.getElementById('token-panel');
if (tokenPanel) {
    const tokenHeader = document.getElementById('token-panel-header');
    if (window.makeDraggable) window.makeDraggable(tokenPanel, tokenHeader);

    const toggleTokenPanel = () => {
        const isHidden = tokenPanel.style.display === 'none' || !tokenPanel.style.display;
        if (isHidden) {
            tokenPanel.style.display = 'flex';
            if (typeof switchTokenTab === 'function') switchTokenTab(currentTokenTab);
        } else {
            tokenPanel.style.display = 'none';
        }
    };

    if (btnToggleTokens) btnToggleTokens.addEventListener('click', toggleTokenPanel);
    if (btnOpenTokensSidebar) btnOpenTokensSidebar.addEventListener('click', toggleTokenPanel);

    const btnCloseToken = document.getElementById('btn-close-token-panel');
    if (btnCloseToken) {
        btnCloseToken.addEventListener('click', () => {
            tokenPanel.style.display = 'none';
        });
    }

    // Drag & Drop sul pannello token
    tokenPanel.addEventListener('dragover', (e) => {
        e.preventDefault();
        tokenPanel.style.borderColor = '#00e676';
    });
    tokenPanel.addEventListener('dragleave', () => {
        tokenPanel.style.borderColor = '#00897b';
    });
    tokenPanel.addEventListener('drop', async (e) => {
        e.preventDefault();
        tokenPanel.style.borderColor = '#00897b';
        if (e.dataTransfer && e.dataTransfer.files) {
            if (typeof processTokenFiles === 'function') {
                await processTokenFiles(e.dataTransfer.files);
            }
        }
    });
}

// -- LOGICA CAMPAGNE E SALVATAGGI --

async function refreshCampaigns() {
    const campaigns = await vttDB.getCampaigns();
    const select = document.getElementById('campaign-select');
    select.innerHTML = '<option value="">-- Seleziona Campagna --</option>';
    campaigns.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id; opt.textContent = c.name;
        select.appendChild(opt);
    });
}

document.getElementById('btn-new-campaign').addEventListener('click', async () => {
    const name = prompt('Nome della nuova campagna:');
    if (name) {
        await vttDB.addCampaign(name);
        refreshCampaigns();
    }
});

document.getElementById('btn-delete-campaign').addEventListener('click', async () => {
    const id = document.getElementById('campaign-select').value;
    if (id && confirm('Eliminare questa campagna?')) {
        await vttDB.deleteCampaign(id);
        currentSelectedFolder = "";
        currentLoadedMapId = null;
        currentLoadedMapName = "";
        updateLoadedMapIndicator();
        refreshCampaigns();
        document.getElementById('map-manager').style.display = 'none';
    }
});

let currentLoadedMapId = null;
let currentLoadedMapName = "";
let currentSelectedFolder = "";
let pingTimeout = null;
let startMouseX = 0;
let startMouseY = 0;
let selectedNote = null;

function updateLoadedMapIndicator() {
    const badge = document.getElementById('current-loaded-map-badge');
    const saveBtn = document.getElementById('btn-save-map');
    if (badge) {
        if (currentLoadedMapName) {
            badge.textContent = `● In uso: ${currentLoadedMapName}`;
            badge.style.display = 'inline';
        } else {
            badge.textContent = '';
            badge.style.display = 'none';
        }
    }
    if (saveBtn) {
        if (currentLoadedMapName) {
            saveBtn.title = `Salva le modifiche su "${currentLoadedMapName}"`;
        } else {
            saveBtn.title = `Salva le modifiche alla mappa`;
        }
    }
}

document.getElementById('campaign-select').addEventListener('change', async (e) => {
    const id = e.target.value;
    currentSelectedFolder = "";
    if (id) {
        if (currentLoadedMapId) {
            const loadedMap = await vttDB.getMap(currentLoadedMapId);
            if (!loadedMap || loadedMap.campaignId !== id) {
                currentLoadedMapId = null;
                currentLoadedMapName = "";
            }
        }
        document.getElementById('map-manager').style.display = 'block';
        await refreshFolders(id);
        await refreshMaps(id, currentLoadedMapId || "");
        updateLoadedMapIndicator();
    } else {
        document.getElementById('map-manager').style.display = 'none';
        currentLoadedMapId = null;
        currentLoadedMapName = "";
        updateLoadedMapIndicator();
    }
});

async function refreshFolders(campaignId) {
    const folderSelect = document.getElementById('folder-select');
    if (!folderSelect) return;
    folderSelect.innerHTML = `
        <option value="">📂 Tutte le Mappe</option>
        <option value="__none__">📄 Senza Cartella (Generale)</option>
    `;
    if (!campaignId) return;
    const campaign = await vttDB.getCampaign(campaignId);
    if (campaign && Array.isArray(campaign.folders)) {
        campaign.folders.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f;
            opt.textContent = `📁 ${f}`;
            folderSelect.appendChild(opt);
        });
    }
    folderSelect.value = currentSelectedFolder || "";
}

const campaignMapsMeta = new Map();

async function refreshMaps(campaignId, selectedMapId = null) {
    if (!campaignId) return;
    const select = document.getElementById('map-select');
    if (!select) return;

    let targetToSelect = null;
    if (selectedMapId !== null && selectedMapId !== undefined) {
        targetToSelect = selectedMapId;
    } else if (currentLoadedMapId) {
        targetToSelect = currentLoadedMapId;
    } else if (select.value) {
        targetToSelect = select.value;
    }

    const maps = await vttDB.getMapsByCampaign(campaignId);
    select.innerHTML = '<option value="">-- Seleziona Mappa --</option>';
    campaignMapsMeta.clear();

    let filteredMaps = maps;
    if (currentSelectedFolder === '__none__') {
        filteredMaps = maps.filter(m => !m.folder || m.folder === "");
    } else if (currentSelectedFolder && currentSelectedFolder !== "") {
        filteredMaps = maps.filter(m => m.folder === currentSelectedFolder);
    }

    let foundTarget = false;
    filteredMaps.forEach(m => {
        campaignMapsMeta.set(String(m.id), { id: m.id, name: m.name, folder: m.folder || "" });
        const opt = document.createElement('option');
        opt.value = m.id;
        if (!currentSelectedFolder && m.folder) {
            opt.textContent = `[${m.folder}] ${m.name}`;
        } else {
            opt.textContent = m.name;
        }
        select.appendChild(opt);
        if (targetToSelect && String(m.id) === String(targetToSelect)) {
            foundTarget = true;
        }
    });

    if (foundTarget && targetToSelect) {
        select.value = targetToSelect;
    } else {
        select.value = "";
    }

    updateLoadedMapIndicator();
}

document.getElementById('folder-select').addEventListener('change', (e) => {
    currentSelectedFolder = e.target.value;
    const campaignId = document.getElementById('campaign-select').value;
    if (campaignId) refreshMaps(campaignId);
});

document.getElementById('btn-new-folder').addEventListener('click', async () => {
    const campaignId = document.getElementById('campaign-select').value;
    if (!campaignId) return alert('Seleziona prima una campagna!');
    const folderName = prompt('Nome della nuova cartella (es. "Barovia", "Terre di Confine"):');
    if (!folderName || !folderName.trim()) return;
    const trimmed = folderName.trim();
    try {
        await vttDB.addFolderToCampaign(campaignId, trimmed);
        currentSelectedFolder = trimmed;
        await refreshFolders(campaignId);
        await refreshMaps(campaignId);
    } catch (err) {
        console.error(err);
        alert('Errore durante la creazione della cartella.');
    }
});

document.getElementById('btn-delete-folder').addEventListener('click', async () => {
    const campaignId = document.getElementById('campaign-select').value;
    if (!campaignId) return alert('Seleziona prima una campagna!');
    if (!currentSelectedFolder || currentSelectedFolder === '__none__') {
        return alert('Seleziona dal menu a tendina una cartella creata da te da eliminare (non puoi eliminare "Tutte le Mappe" o "Senza Cartella")!');
    }
    if (confirm(`Sei sicuro di voler eliminare la cartella "${currentSelectedFolder}"?\nLe mappe al suo interno NON verranno cancellate ma spostate in "Senza Cartella (Generale)".`)) {
        await vttDB.deleteFolderFromCampaign(campaignId, currentSelectedFolder);
        currentSelectedFolder = "";
        await refreshFolders(campaignId);
        await refreshMaps(campaignId);
    }
});


document.getElementById('btn-save-new-map').addEventListener('click', async () => {
    const campaignId = document.getElementById('campaign-select').value;
    if (!campaignId) return alert('Seleziona una campagna dal menu a tendina prima di salvare!');
    if (!currentMapBase64) return alert('Devi caricare una mappa prima di poterla salvare!');

    const name = prompt('Nome di questo salvataggio (es. "Taverna - Inizio Combattimento"):');
    if (!name) return;

    const state = {
        grid: engine.grid,
        tokens: engine.tokens.map(t => ({...t, imageObj: null})),
        shapes: engine.shapes,
            initiative: engine.initiative,
        publicStrokes: engine.publicStrokes,
        privateStrokes: engine.privateStrokes,
        notes: engine.notes,
        fogBase64: engine.getFogBase64(),
        offsetX: engine.offsetX,
        offsetY: engine.offsetY,
        scale: engine.scale,
        sharedImageId: engine.sharedImageId || null
    };

    const targetFolder = (currentSelectedFolder && currentSelectedFolder !== '__none__') ? currentSelectedFolder : "";
    const savedMap = await vttDB.saveMap(campaignId, name, currentMapBase64, state, null, targetFolder);
    currentLoadedMapId = savedMap.id;
    currentLoadedMapName = savedMap.name;
    await refreshMaps(campaignId, savedMap.id);
    updateLoadedMapIndicator();
    alert('Nuova mappa salvata con successo!' + (targetFolder ? ` nella cartella "${targetFolder}"` : ''));
});

document.getElementById('btn-save-map').addEventListener('click', async () => {
    const select = document.getElementById('map-select');
    
    // Se non c'è ancora una mappa caricata ma l'utente ne ha selezionata una dal menu a tendina
    if (!currentLoadedMapId && select && select.value) {
        const meta = campaignMapsMeta.get(String(select.value));
        if (meta) {
            currentLoadedMapId = meta.id;
            currentLoadedMapName = meta.name;
        }
    }

    if (!currentLoadedMapId) {
        return document.getElementById('btn-save-new-map').click();
    }
    const campaignId = document.getElementById('campaign-select').value;
    if (!campaignId) return alert('Seleziona una campagna!');
    if (!currentMapBase64) return;

    const state = {
        grid: engine.grid,
        tokens: engine.tokens.map(t => ({...t, imageObj: null})),
        shapes: engine.shapes,
            initiative: engine.initiative,
        publicStrokes: engine.publicStrokes,
        privateStrokes: engine.privateStrokes,
        notes: engine.notes,
        fogBase64: engine.getFogBase64(),
        offsetX: engine.offsetX,
        offsetY: engine.offsetY,
        scale: engine.scale,
        sharedImageId: engine.sharedImageId || null
    };

    await vttDB.saveMap(campaignId, currentLoadedMapName, currentMapBase64, state, currentLoadedMapId);
    await refreshMaps(campaignId, currentLoadedMapId);
    updateLoadedMapIndicator();
    // Cambiamo l'alert in qualcosa di meno invasivo per i salvataggi continui
    const btn = document.getElementById('btn-save-map'); const oldText = btn.innerText; btn.innerText = 'Salvato!'; setTimeout(() => btn.innerText = oldText, 1500);
});

document.getElementById('btn-load-map').addEventListener('click', async () => {
    const select = document.getElementById('map-select');
    if (!select.value) return alert('Seleziona una mappa da caricare!');
    
    const mapData = await vttDB.getMap(select.value);
    if (!mapData) return alert('Impossibile leggere la mappa dal database.');
    
    currentLoadedMapId = mapData.id;
    currentLoadedMapName = mapData.name;
    updateLoadedMapIndicator();
    
    currentMapBase64 = mapData.mapImageBase64;
    const state = mapData.state;

    const img = new Image();
    img.onload = () => {
        engine.setMap(img);
        
        engine.grid = state.grid || engine.grid;
        if (state.grid) {
              document.getElementById('grid-size').value = state.grid.size;
              if (document.getElementById('grid-size-slider')) document.getElementById('grid-size-slider').value = state.grid.size;
              document.getElementById('grid-color').value = state.grid.color;
            document.getElementById('grid-glow').value = state.grid.glow;
        }
        engine.publicStrokes = state.publicStrokes || [];
        engine.privateStrokes = state.privateStrokes || [];
        engine.shapes = state.shapes || [];
        engine.notes = state.notes || [];
        engine.offsetX = state.offsetX || 0;
        engine.offsetY = state.offsetY || 0;
        engine.scale = state.scale || 1;
        engine.updateWorkspaceTransform();
        
        if (state.tokens && state.tokens.length > 0) {
            engine.tokens = []; // svuota i token vecchi
            let loadedTokensCount = 0;
            const totalToLoad = state.tokens.length;
            const finalizeLoadedTokens = () => {
                loadedTokensCount++;
                if (loadedTokensCount === totalToLoad) {
                    engine.renderAll();
                    syncState(true, true);
                    if (typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none') {
                        updateMapTokensGallery();
                    }
                }
            };
            state.tokens.forEach(t => {
                if (t.statblock && t.statblock._raw && t.statblock._raw.tokenSrc) {
                    delete t.statblock._raw.tokenSrc;
                }
                const tImg = new Image();
                tImg.onload = () => {
                    t.imageObj = tImg;
                    // Comprimi automaticamente in RAM eventuali vecchi token pesanti salvati nel DB!
                    getOrCompressTokenSrc(t);
                    engine.tokens.push(t);
                    finalizeLoadedTokens();
                };
                tImg.onerror = () => {
                    engine.tokens.push(t);
                    finalizeLoadedTokens();
                };
                tImg.src = t.src;
            });
        } else {
            engine.tokens = [];
            engine.renderAll();
            syncState();
            if (typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none') {
                updateMapTokensGallery();
            }
        }

        if (state.fogBase64) {
            engine.applyFogImage(state.fogBase64);
            setTimeout(() => { syncFog(); }, 150);
        }
        
        network.send({ type: 'MAP_UPDATE', payload: getNetworkMapPayload() });
    };
    img.src = currentMapBase64;
});

// -- EXPORT / IMPORT --
document.getElementById('btn-export-campaign').addEventListener('click', async () => {
    const id = document.getElementById('campaign-select').value;
    if (!id) return alert('Seleziona una campagna da esportare!');
    
    const data = await vttDB.exportCampaign(id);
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `VTT_Campagna_${data.campaign.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('import-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                await vttDB.importCampaign(data);
                alert('Campagna importata con successo!');
                refreshCampaigns();
            } catch (err) {
                alert('Errore durante l\'importazione. Il file selezionato non è valido.');
                console.error(err);
            }
        };
        reader.readAsText(file);
    }
    e.target.value = ''; // reseta l'input
});

document.getElementById('btn-delete-map').addEventListener('click', async () => {
    const select = document.getElementById('map-select');
    const id = select.value;
    if (!id) return alert('Seleziona una mappa da eliminare!');
    if (confirm('Sei sicuro di voler eliminare questa mappa?')) {
        await vttDB.deleteMap(id);
        if (currentLoadedMapId === id) {
            currentLoadedMapId = null;
            currentLoadedMapName = "";
        }
        await refreshMaps(document.getElementById('campaign-select').value, (currentLoadedMapId || ""));
        updateLoadedMapIndicator();
    }
});

document.getElementById('btn-move-map').addEventListener('click', async () => {
    const campaignId = document.getElementById('campaign-select').value;
    const select = document.getElementById('map-select');
    const mapId = select.value;
    if (!campaignId || !mapId) return alert('Seleziona prima una mappa dal menu a tendina da spostare!');

    const campaign = await vttDB.getCampaign(campaignId);
    const folders = (campaign && Array.isArray(campaign.folders)) ? campaign.folders : [];

    let promptMsg = "Sposta la mappa selezionata in una cartella:\n\n";
    promptMsg += "0. [Senza cartella - Generale]\n";
    folders.forEach((f, idx) => {
        promptMsg += `${idx + 1}. ${f}\n`;
    });
    promptMsg += "\nInserisci il numero della cartella (es. 1) oppure scrivi direttamente il nome:";

    const choice = prompt(promptMsg);
    if (choice === null) return;

    const trimmed = choice.trim();
    let targetFolder = "";

    if (trimmed === "" || trimmed === "0" || trimmed.toLowerCase() === "nessuna") {
        targetFolder = "";
    } else {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && num >= 1 && num <= folders.length) {
            targetFolder = folders[num - 1];
        } else {
            const found = folders.find(f => f.toLowerCase() === trimmed.toLowerCase());
            if (found) {
                targetFolder = found;
            } else {
                if (confirm(`La cartella "${trimmed}" non esiste ancora. Vuoi crearla e spostare qui la mappa?`)) {
                    await vttDB.addFolderToCampaign(campaignId, trimmed);
                    targetFolder = trimmed;
                    await refreshFolders(campaignId);
                } else {
                    return;
                }
            }
        }
    }

    await vttDB.updateMapFolder(mapId, targetFolder);
    await refreshMaps(campaignId, mapId);
    alert(`Mappa spostata con successo ${targetFolder ? `nella cartella "${targetFolder}"` : 'in "Senza Cartella (Generale)"'}!`);
});

function updateGrid() {
    engine.grid.size = parseInt(document.getElementById('grid-size').value) || 50;
    engine.grid.color = document.getElementById('grid-color').value;
    engine.grid.glow = document.getElementById('grid-glow').value;
    
    const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
    const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;

    // Aggiorna la dimensione dei token e il loro snap
    engine.tokens.forEach(t => {
        if (t.sizeMultiplier) {
            t.width = engine.grid.size * t.sizeMultiplier;
            t.height = engine.grid.size * t.sizeMultiplier;
        }
        // Ri-snappa alla nuova griglia
        t.x = Math.round((t.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
        t.y = Math.round((t.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
    });

    engine.renderAll();
    syncState();
}

const gridSizeInput = document.getElementById('grid-size');
const gridSizeSlider = document.getElementById('grid-size-slider');

gridSizeInput.addEventListener('input', (e) => {
    gridSizeSlider.value = e.target.value;
    updateGrid();
});

gridSizeSlider.addEventListener('input', (e) => {
    gridSizeInput.value = e.target.value;
    updateGrid();
});

document.getElementById('grid-color').addEventListener('input', updateGrid);
document.getElementById('grid-glow').addEventListener('change', updateGrid);

document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentTool = e.target.dataset.tool;

        if (currentTool.startsWith('fog-')) {
            document.getElementById('fog-brush-controls').style.display = 'block';
        } else {
            document.getElementById('fog-brush-controls').style.display = 'none';
            engine.brushPreview = null;
            engine.renderAll();
        }
    });
});

document.getElementById('btn-reset-fog').addEventListener('click', () => {
    engine.resetFog();
    syncFog();
});

document.getElementById('btn-remove-fog').addEventListener('click', () => {
    engine.clearFog();
    syncFog();
});

document.getElementById('btn-clear-drawings-pub').addEventListener('click', () => {
    engine.publicStrokes = [];
    engine.renderAll();
    if (isViewSyncActive) {
        sendViewSync(true);
    }
});
document.getElementById('btn-clear-drawings-priv').addEventListener('click', () => {
    engine.privateStrokes = [];
    engine.renderViewport();
    if (isViewSyncActive) {
        sendViewSync();
    }
});

// -- SISTEMA LIBRERIA TOKEN OTTIMIZZATO --

function resizeTokenImage(fileOrBlob, maxDim = 256) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(fileOrBlob);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
                if (w > h) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                } else {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            let out = canvas.toDataURL('image/webp', 0.85);
            if (!out || !out.startsWith('data:image/webp')) out = canvas.toDataURL('image/png');
            resolve(out);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Errore caricamento immagine"));
        };
        img.src = url;
    });
}

function getUniqueMapTokens() {
    if (!engine || !engine.tokens) return [];
    const map = new Map();
    engine.tokens.forEach(t => {
        if (!t.src) return;
        const rawName = t.name || (t.originalName ? t.originalName.replace(/\.[^/.]+$/, "") : "Token");
        const baseName = rawName.replace(/\s+\d+$/, '').trim() || 'Token';
        const key = t.src;
        if (map.has(key)) {
            const item = map.get(key);
            item.count++;
            if ((!item.hpMax || item.hpMax <= 0) && t.hpMax && t.hpMax > 0) {
                item.hpMax = t.hpMax;
            }
        } else {
            map.set(key, {
                name: baseName,
                src: t.src,
                count: 1,
                hpMax: t.hpMax || 0
            });
        }
    });
    return Array.from(map.values());
}

function updateMapTokensGallery() {
    const gallery = document.getElementById('token-gallery-map');
    const badge = document.getElementById('badge-count-map');
    const empty = document.getElementById('token-gallery-empty');
    if (!gallery) return;

    const uniqueTokens = getUniqueMapTokens();
    if (badge) badge.textContent = uniqueTokens.length;

    gallery.innerHTML = '';
    const query = (document.getElementById('token-search')?.value || '').toLowerCase().trim();

    let visibleCount = 0;
    uniqueTokens.forEach(t => {
        const matches = !query || t.name.toLowerCase().includes(query);
        const card = createTokenCard(t.name, t.src, t.count, false, null, t.hpMax);
        if (!matches) {
            card.style.display = 'none';
        } else {
            visibleCount++;
        }
        gallery.appendChild(card);
    });

    if (currentTokenTab === 'map') {
        if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function updateLibraryGallery() {
    const gallery = document.getElementById('token-gallery-library');
    const badge = document.getElementById('badge-count-library');
    const empty = document.getElementById('token-gallery-empty');
    if (!gallery) return;

    if (badge) badge.textContent = savedTokensLibrary.length;
    gallery.innerHTML = '';

    const query = (document.getElementById('token-search')?.value || '').toLowerCase().trim();
    let visibleCount = 0;
    savedTokensLibrary.forEach(t => {
        const matches = !query || t.name.toLowerCase().includes(query);
        const card = createTokenCard(t.name, t.src, 1, true, t.id);
        if (!matches) {
            card.style.display = 'none';
        } else {
            visibleCount++;
        }
        gallery.appendChild(card);
    });

    if (currentTokenTab === 'library') {
        if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function createTokenCard(name, src, count = 1, allowDelete = false, id = null, inheritedHp = null) {
    const card = document.createElement('div');
    card.className = 'gallery-token-card';
    const hpTitle = (inheritedHp && inheritedHp > 0) ? ` (❤️ Full PV: ${inheritedHp})` : '';
    card.title = `Clicca per posizionare: ${name}${hpTitle}`;
    card.style.cssText = 'display: flex; flex-direction: column; align-items: center; cursor: pointer; position: relative; padding: 4px; border-radius: 6px; background: #1c1c1c; border: 1px solid #333; transition: all 0.15s; user-select: none;';

    card.onmouseenter = () => { card.style.borderColor = '#4db6ac'; card.style.background = '#252525'; };
    card.onmouseleave = () => { card.style.borderColor = '#333'; card.style.background = '#1c1c1c'; };

    const imgWrapper = document.createElement('div');
    imgWrapper.style.cssText = 'position: relative; width: 52px; height: 52px;';

    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 1px solid #555; pointer-events: none;';
    imgWrapper.appendChild(img);

    if (count > 1) {
        const countBadge = document.createElement('span');
        countBadge.textContent = `x${count}`;
        countBadge.style.cssText = 'position: absolute; top: -3px; right: -3px; background: #00897b; color: white; font-size: 9.5px; font-weight: bold; border-radius: 8px; padding: 0 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.6); pointer-events: none;';
        imgWrapper.appendChild(countBadge);
    }

    if (allowDelete && id) {
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '✕';
        delBtn.title = 'Rimuovi dalla libreria';
        delBtn.style.cssText = 'position: absolute; top: -4px; left: -4px; background: rgba(180, 0, 0, 0.85); color: white; border: none; border-radius: 50%; width: 16px; height: 16px; font-size: 9px; cursor: pointer; display: none; align-items: center; justify-content: center; padding: 0;';
        card.addEventListener('mouseenter', () => delBtn.style.display = 'flex');
        card.addEventListener('mouseleave', () => delBtn.style.display = 'none');
        delBtn.onclick = async (e) => {
            e.stopPropagation();
            if (confirm(`Rimuovere "${name}" dalla libreria salvata?`)) {
                await vttDB.deleteToken(id);
                savedTokensLibrary = savedTokensLibrary.filter(x => x.id !== id);
                updateLibraryGallery();
            }
        };
        imgWrapper.appendChild(delBtn);
    }

    const label = document.createElement('span');
    label.textContent = name;
    label.style.cssText = 'font-size: 10.5px; color: #ddd; margin-top: 3px; text-align: center; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none;';

    card.appendChild(imgWrapper);
    card.appendChild(label);

    if (inheritedHp && inheritedHp > 0) {
        const hpTag = document.createElement('span');
        hpTag.textContent = `❤️ ${inheritedHp} PV`;
        hpTag.style.cssText = 'font-size: 9.5px; color: #ef5350; font-weight: bold; margin-top: 1px; pointer-events: none; line-height: 1;';
        card.appendChild(hpTag);
    }

    card.onclick = () => {
        addTokenToMap(name, src, inheritedHp);
        setTimeout(() => {
            updateMapTokensGallery();
        }, 50);
    };

    return card;
}

async function processTokenFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    const newTokens = [];
    for (let file of fileList) {
        if (!file.type || !file.type.startsWith('image/')) continue;
        try {
            const optimizedSrc = await resizeTokenImage(file, 256);
            const cleanName = file.name.replace(/\.[^/.]+$/, "");
            const tokenItem = {
                id: 'tok_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                name: cleanName,
                src: optimizedSrc
            };
            newTokens.push(tokenItem);
            savedTokensLibrary.push(tokenItem);
        } catch (err) {
            console.error("Errore processamento token:", file.name, err);
        }
    }
    if (newTokens.length > 0) {
        await vttDB.saveTokensBatch(newTokens);
        switchTokenTab('library');
    }
}

function switchTokenTab(tab) {
    currentTokenTab = tab;
    const tabMap = document.getElementById('tab-tokens-map');
    const tabLib = document.getElementById('tab-tokens-library');
    const galleryMap = document.getElementById('token-gallery-map');
    const galleryLib = document.getElementById('token-gallery-library');
    const empty = document.getElementById('token-gallery-empty');

    if (tab === 'map') {
        if (tabMap) {
            tabMap.style.background = '#00897b';
            tabMap.style.color = 'white';
            tabMap.style.border = 'none';
            tabMap.style.fontWeight = 'bold';
        }
        if (tabLib) {
            tabLib.style.background = '#222';
            tabLib.style.color = '#aaa';
            tabLib.style.border = '1px solid #444';
            tabLib.style.fontWeight = 'normal';
        }
        if (galleryMap) galleryMap.style.display = 'grid';
        if (galleryLib) galleryLib.style.display = 'none';
        updateMapTokensGallery();
    } else {
        if (tabLib) {
            tabLib.style.background = '#00897b';
            tabLib.style.color = 'white';
            tabLib.style.border = 'none';
            tabLib.style.fontWeight = 'bold';
        }
        if (tabMap) {
            tabMap.style.background = '#222';
            tabMap.style.color = '#aaa';
            tabMap.style.border = '1px solid #444';
            tabMap.style.fontWeight = 'normal';
        }
        if (galleryLib) galleryLib.style.display = 'grid';
        if (galleryMap) galleryMap.style.display = 'none';
        updateLibraryGallery();
    }
}

document.getElementById('tab-tokens-map')?.addEventListener('click', () => switchTokenTab('map'));
document.getElementById('tab-tokens-library')?.addEventListener('click', () => switchTokenTab('library'));

document.getElementById('token-folder-input')?.addEventListener('change', async (e) => {
    await processTokenFiles(e.target.files);
    e.target.value = '';
});

document.getElementById('token-file-input')?.addEventListener('change', async (e) => {
    await processTokenFiles(e.target.files);
    e.target.value = '';
});

document.getElementById('btn-clear-token-library')?.addEventListener('click', async () => {
    if (!savedTokensLibrary || savedTokensLibrary.length === 0) return alert('La libreria è già vuota!');
    if (confirm('Sei sicuro di voler svuotare tutta la libreria di token salvata? (I token già presenti sulle mappe non verranno eliminati)')) {
        await vttDB.clearTokens();
        savedTokensLibrary = [];
        updateLibraryGallery();
    }
});

document.getElementById('token-search')?.addEventListener('input', () => {
    if (currentTokenTab === 'map') {
        updateMapTokensGallery();
    } else {
        updateLibraryGallery();
    }
});

window.updateSelectedTokenControls = function(ent) {
    const controls = document.getElementById('selected-token-controls');
    if (!controls) return;
    if (!ent) {
        controls.style.display = 'none';
        return;
    }
    controls.style.display = 'block';

    const nameInput = document.getElementById('token-name-edit');
    if (nameInput) nameInput.value = ent.name || (ent.originalName ? ent.originalName.replace(/\.[^/.]+$/, "") : '');

    const visInput = document.getElementById('token-name-visibility');
    if (visInput) visInput.value = ent.nameVisibility || 'all';

    const sizeInput = document.getElementById('token-edit-size');
    if (sizeInput) sizeInput.value = ent.sizeMultiplier || 1;

    const hpCurrInput = document.getElementById('token-hp-current');
    if (hpCurrInput) hpCurrInput.value = (ent.hpCurrent !== undefined && ent.hpCurrent !== null) ? ent.hpCurrent : '';

    const hpMaxInput = document.getElementById('token-hp-max');
    if (hpMaxInput) hpMaxInput.value = ent.hpMax || 0;

    const hpVisInput = document.getElementById('token-hp-visible');
    if (hpVisInput) hpVisInput.checked = ent.hpVisibleToPlayers !== false;

    const hpModInput = document.getElementById('token-hp-mod');
    if (hpModInput) hpModInput.value = '';

    // CA (Classe Armatura)
    const acInput = document.getElementById('token-ac');
    if (acInput) acInput.value = (ent.ac !== undefined && ent.ac !== null) ? ent.ac : '';

    // Pulsante Scheda Mostro
    const btnStat = document.getElementById('btn-open-statblock');
    if (btnStat) {
        if (ent.statblock && ent.statblock.name) {
            btnStat.innerHTML = `<span>📜 Scheda (${ent.statblock.name})</span>`;
            btnStat.style.background = '#00897b';
            btnStat.title = `Visualizza Scheda: ${ent.statblock.name}`;
        } else {
            btnStat.innerHTML = `<span>📖 Assegna Scheda</span>`;
            btnStat.style.background = '#0277bd';
            btnStat.title = 'Cerca e assegna scheda statistiche';
        }
    }

    const ownerSelect = document.getElementById('token-owner');
    if (ownerSelect) {
        ownerSelect.innerHTML = '<option value="">👤 Solo DM</option>';
        let players = [];
        for (let k in network.connections) {
            if (network.connections[k].name) players.push(network.connections[k].name);
        }
        if (ent.owner && !players.includes(ent.owner)) players.push(ent.owner);
        players.forEach(pName => {
            const opt = document.createElement('option');
            opt.value = pName;
            opt.innerText = pName;
            ownerSelect.appendChild(opt);
        });
        ownerSelect.value = ent.owner || '';
    }

    const aura = ent.aura || {};
    const auraActive = document.getElementById('token-aura-active');
    if (auraActive) auraActive.checked = !!aura.active;
    const auraSize = document.getElementById('token-aura-size');
    if (auraSize) auraSize.value = aura.sizeRaw || 20;
    const auraUnit = document.getElementById('token-aura-unit');
    if (auraUnit) auraUnit.value = aura.unit || 'ft';
    if (auraSize) auraSize.step = (aura.unit || 'ft') === 'ft' ? '5' : '1.5';
    const auraColor = document.getElementById('token-aura-color');
    if (auraColor) auraColor.value = aura.color || '#ffff00';

    if (typeof window.renderConditionsList === 'function') {
        window.renderConditionsList();
    }
};

function duplicateSelectedTokens() {
    let toDuplicate = [];
    if (engine.selectedTokens && engine.selectedTokens.size > 0) {
        toDuplicate = engine.tokens.filter(t => engine.selectedTokens.has(t.id));
    } else if (engine.selectedTokenId) {
        const t = engine.tokens.find(tok => tok.id === engine.selectedTokenId);
        if (t) toDuplicate.push(t);
    }
    if (toDuplicate.length === 0) return;

    const newSelectedIds = new Set();
    const gridSize = engine.grid ? (engine.grid.size || 50) : 50;

    toDuplicate.forEach(sourceToken => {
        const fullName = sourceToken.name || (sourceToken.originalName ? sourceToken.originalName.replace(/\.[^/.]+$/, "") : 'Token');
        const match = fullName.match(/^(.*?)(?:\s+(\d+))?$/);
        const baseName = (match && match[1] ? match[1].trim() : fullName) || 'Token';

        let maxNum = 0;
        engine.tokens.forEach(t => {
            const tName = t.name || (t.originalName ? t.originalName.replace(/\.[^/.]+$/, "") : '');
            if (tName === baseName) {
                if (maxNum < 1) maxNum = 1;
            } else if (tName.startsWith(baseName + ' ')) {
                const numPart = parseInt(tName.substring(baseName.length + 1));
                if (!isNaN(numPart) && numPart > maxNum) {
                    maxNum = numPart;
                }
            }
        });

        const nextNum = maxNum + 1;
        const newName = `${baseName} ${nextNum}`;
        
        let newX = sourceToken.x + gridSize;
        let newY = sourceToken.y + gridSize;
        const effOffsetX = (engine.grid.offsetX || 0) % gridSize;
        const effOffsetY = (engine.grid.offsetY || 0) % gridSize;
        newX = Math.round((newX - effOffsetX) / gridSize) * gridSize + effOffsetX;
        newY = Math.round((newY - effOffsetY) / gridSize) * gridSize + effOffsetY;

        const maxHpVal = sourceToken.hpMax || 0;
        const newToken = {
            id: 'token_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
            name: newName,
            nameVisibility: sourceToken.nameVisibility || 'all',
            originalName: sourceToken.originalName || baseName,
            x: newX,
            y: newY,
            width: sourceToken.width,
            height: sourceToken.height,
            sizeMultiplier: sourceToken.sizeMultiplier || 1,
            src: sourceToken.src,
            visible: sourceToken.visible !== undefined ? sourceToken.visible : true,
            imageObj: sourceToken.imageObj,
            // SEMPRE A PIENA VITA: hpCurrent = hpMax
            hpMax: maxHpVal,
            hpCurrent: maxHpVal,
            hpVisibleToPlayers: sourceToken.hpVisibleToPlayers !== false,
            // CA E SCHEDA STATISTICHE COPIATE!
            ac: sourceToken.ac !== undefined ? sourceToken.ac : 0,
            statblock: sourceToken.statblock ? JSON.parse(JSON.stringify(sourceToken.statblock)) : null,
            aura: sourceToken.aura ? JSON.parse(JSON.stringify(sourceToken.aura)) : null,
            owner: sourceToken.owner || ''
        };

        engine.tokens.push(newToken);
        newSelectedIds.add(newToken.id);
    });

    engine.selectedTokens = newSelectedIds;
    engine.selectedTokenId = Array.from(newSelectedIds).pop();

    const lastToken = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (lastToken && typeof window.updateSelectedTokenControls === 'function') {
        window.updateSelectedTokenControls(lastToken);
    }

    engine.renderAll();
    syncState(true, false);
    if (typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none') {
        updateMapTokensGallery();
    }
    if (typeof showToast === 'function') {
        showToast(toDuplicate.length === 1 ? `Duplicato ${toDuplicate[0].name} (Full PV)!` : `Duplicati ${toDuplicate.length} token (Full PV)!`);
    }
}

// Scorciatoia da tastiera Ctrl+D per duplicare token selezionati
window.addEventListener('keydown', (e) => {
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        duplicateSelectedTokens();
    }
});

document.getElementById('btn-duplicate-token')?.addEventListener('click', duplicateSelectedTokens);

function addTokenToMap(name, src, explicitHp = null) {
    const sizeMultiplier = parseInt(document.getElementById('token-size-select')?.value) || 1;
    const isVisible = (document.getElementById('token-visibility-select')?.value || 'visible') === 'visible';
    const pxSize = engine.grid.size * sizeMultiplier;
    
    // Calcolo PV predefiniti:
    // 1. explicitHp (ereditato da un token del tab "In Mappa")
    // 2. Valore digitato nel campo "token-default-hp"
    // 3. Cerca un token in mappa con stesso nome o immagine avente già hpMax > 0
    let hpToAssign = 0;
    let acToAssign = 10;
    let statblockToAssign = null;

    const defAcInput = document.getElementById('token-ac');
    if (defAcInput && defAcInput.value !== '') {
        const parsedAc = parseInt(defAcInput.value);
        if (!isNaN(parsedAc) && parsedAc > 0) acToAssign = parsedAc;
    }

    if (explicitHp !== null && explicitHp !== undefined && explicitHp > 0) {
        hpToAssign = parseInt(explicitHp) || 0;
    } else {
        const defHpInput = document.getElementById('token-default-hp');
        const defHpVal = defHpInput ? parseInt(defHpInput.value) : 0;
        if (!isNaN(defHpVal) && defHpVal > 0) {
            hpToAssign = defHpVal;
        } else {
            let testBase = (name || 'Token').replace(/\.[^/.]+$/, "").replace(/\s+\d+$/, '').trim().toLowerCase();
            const existingWithHp = engine.tokens.find(t => {
                if (!t.hpMax || t.hpMax <= 0) return false;
                if (t.src && t.src === src) return true;
                const tBase = (t.name || t.originalName || '').replace(/\.[^/.]+$/, "").replace(/\s+\d+$/, '').trim().toLowerCase();
                return tBase === testBase;
            });
            if (existingWithHp) {
                hpToAssign = existingWithHp.hpMax;
                if (existingWithHp.ac) acToAssign = existingWithHp.ac;
                if (existingWithHp.statblock) statblockToAssign = JSON.parse(JSON.stringify(existingWithHp.statblock));
            }
        }
    }

    const imgObj = new Image();
    imgObj.onload = () => {
        const centerWorld = engine.screenToWorld(engine.layers.ui.width/2, engine.layers.ui.height/2);
        
        const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
        const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;

        const snappedX = Math.round((centerWorld.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
        const snappedY = Math.round((centerWorld.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;

        let baseName = (name || 'Token').replace(/\.[^/.]+$/, "").replace(/\s+\d+$/, '').trim() || 'Token';
        let maxNum = 0;
        let foundAny = false;
        engine.tokens.forEach(t => {
            const tName = t.name || (t.originalName ? t.originalName.replace(/\.[^/.]+$/, "") : '');
            if (tName === baseName) {
                foundAny = true;
                if (maxNum < 1) maxNum = 1;
            } else if (tName.startsWith(baseName + ' ')) {
                foundAny = true;
                const numPart = parseInt(tName.substring(baseName.length + 1));
                if (!isNaN(numPart) && numPart > maxNum) {
                    maxNum = numPart;
                }
            }
        });

        const assignedName = (foundAny || maxNum > 0) ? `${baseName} ${maxNum + 1}` : `${baseName} 1`;

        const token = {
            id: 'token_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: assignedName,
            nameVisibility: 'all',
            originalName: name,
            x: snappedX,
            y: snappedY,
            width: pxSize,
            height: pxSize,
            sizeMultiplier: sizeMultiplier,
            src: src,
            visible: isVisible,
            imageObj: imgObj,
            // SEMPRE FULL VITA!
            hpMax: hpToAssign,
            hpCurrent: hpToAssign,
            hpVisibleToPlayers: true,
            ac: acToAssign,
            statblock: statblockToAssign
        };
        engine.tokens.push(token);

        // Seleziona subito il nuovo token e mostra i controlli con i PV
        engine.selectedTokens.clear();
        engine.selectedTokens.add(token.id);
        engine.selectedTokenId = token.id;
        if (typeof window.updateSelectedTokenControls === 'function') {
            window.updateSelectedTokenControls(token);
        }

        engine.renderAll();
        if (isVisible) syncState(true, false);
        if (typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none') {
            updateMapTokensGallery();
        }
    };
    imgObj.src = src;
}

document.getElementById('btn-toggle-visibility').addEventListener('click', () => {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (token) {
        token.visible = !token.visible;
        if (engine.initiative && engine.initiative.participants) {
            const pItem = engine.initiative.participants.find(p => p.tokenId === token.id);
            if (pItem) {
                pItem.isHidden = !token.visible;
                if (typeof renderTrackerList === 'function') renderTrackerList();
            }
        }
        engine.renderAll();
        syncState();
    }
});

document.getElementById('token-name-edit').addEventListener('input', (e) => {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (token) {
        token.name = e.target.value;
        engine.renderAll();
        syncState();
    }
});

document.getElementById('token-name-visibility').addEventListener('change', (e) => {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (token) {
        token.nameVisibility = e.target.value;
        engine.renderAll();
        syncState();
    }
});

document.getElementById('token-edit-size').addEventListener('change', (e) => {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (token) {
        token.sizeMultiplier = parseInt(e.target.value) || 1;
        token.width = engine.grid.size * token.sizeMultiplier;
        token.height = engine.grid.size * token.sizeMultiplier;
        engine.renderAll();
        syncState();
    }
});

document.getElementById('btn-delete-token').addEventListener('click', () => {
    const toDelete = (engine.selectedTokens && engine.selectedTokens.size > 0)
        ? engine.selectedTokens
        : (engine.selectedTokenId ? new Set([engine.selectedTokenId]) : new Set());

    if (toDelete.size === 0) return;

    engine.tokens = engine.tokens.filter(t => !toDelete.has(t.id));
    engine.selectedTokens.clear();
    engine.selectedTokenId = null;
    document.getElementById('selected-token-controls').style.display = 'none';
    engine.renderAll();
    syncState();
    if (typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none') {
        updateMapTokensGallery();
    }
});


function updateTokenHP(e) {
    const maxInput = document.getElementById('token-hp-max');
    const currInput = document.getElementById('token-hp-current');
    if (!maxInput || !currInput) return;

    let maxVal = parseInt(maxInput.value) || 0;
    let currVal = parseInt(currInput.value);

    const isEditingMax = e && e.target && e.target.id === 'token-hp-max';
    // Se modifichiamo Max e l'attuale era vuoto o 0, porta subito a Full Vita!
    if (isEditingMax && maxVal > 0 && (isNaN(currVal) || currVal === 0 || currInput.value === '')) {
        currVal = maxVal;
        currInput.value = maxVal;
    } else if (isNaN(currVal)) {
        currVal = maxVal > 0 ? maxVal : 0;
        currInput.value = maxVal > 0 ? maxVal : '';
    }

    const isVisible = document.getElementById('token-hp-visible').checked;

    // Se ci sono più token selezionati, applica a tutti in blocco!
    const targetTokens = (engine.selectedTokens && engine.selectedTokens.size > 1)
        ? engine.tokens.filter(t => engine.selectedTokens.has(t.id))
        : (engine.selectedTokenId ? [engine.tokens.find(t => t.id === engine.selectedTokenId)].filter(Boolean) : []);

    if (targetTokens.length === 0) return;

    targetTokens.forEach(token => {
        token.hpMax = maxVal;
        token.hpCurrent = currVal;
        token.hpVisibleToPlayers = isVisible;
        if (engine.initiative && engine.initiative.participants) {
            const pItem = engine.initiative.participants.find(p => p.tokenId === token.id);
            if (pItem) {
                pItem.hpCurrent = token.hpCurrent;
                pItem.hpMax = token.hpMax;
            }
        }
    });

    if (engine.initiative && engine.initiative.participants && typeof renderTrackerList === 'function') {
        renderTrackerList();
    }
    engine.renderAll();
    syncState();
}


document.getElementById('token-owner').addEventListener('change', () => {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (token) {
        token.owner = document.getElementById('token-owner').value.trim();
        syncState();
    }
});

document.getElementById('token-hp-current').addEventListener('input', updateTokenHP);
document.getElementById('token-hp-max').addEventListener('input', updateTokenHP);
document.getElementById('token-hp-current').addEventListener('change', updateTokenHP);
document.getElementById('token-hp-max').addEventListener('change', updateTokenHP);
document.getElementById('token-hp-visible').addEventListener('change', updateTokenHP);

// Listener CA (Classe Armatura)
document.getElementById('token-ac')?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) || 0;
    const targetTokens = (engine.selectedTokens && engine.selectedTokens.size > 1)
        ? engine.tokens.filter(t => engine.selectedTokens.has(t.id))
        : (engine.selectedTokenId ? [engine.tokens.find(t => t.id === engine.selectedTokenId)].filter(Boolean) : []);
    targetTokens.forEach(t => {
        t.ac = val;
        if (engine.initiative && engine.initiative.participants) {
            const p = engine.initiative.participants.find(x => x.tokenId === t.id);
            if (p) p.ac = val;
        }
    });
    if (engine.initiative && typeof renderTrackerList === 'function') renderTrackerList();
    syncState();
});

// Listener apertura Scheda Statistiche Compendio
document.getElementById('btn-open-statblock')?.addEventListener('click', () => {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (window.compendium) {
        window.compendium.open(token ? token.statblock : null);
    }
});


function applyHpMod(isHeal) {
    const modInput = document.getElementById('token-hp-mod');
    let modVal = parseInt(modInput.value);
    if (!isNaN(modVal)) {
        modVal = Math.abs(modVal);
        if (!isHeal) modVal = -modVal;
        
        const targetTokens = (engine.selectedTokens && engine.selectedTokens.size > 1)
            ? engine.tokens.filter(t => engine.selectedTokens.has(t.id))
            : (engine.selectedTokenId ? [engine.tokens.find(t => t.id === engine.selectedTokenId)].filter(Boolean) : []);

        targetTokens.forEach(token => {
            let curr = token.hpCurrent !== undefined ? token.hpCurrent : (token.hpMax || 0);
            let newHp = curr + modVal;
            const maxHp = token.hpMax || 0;
            if (newHp > maxHp && maxHp > 0) newHp = maxHp;
            if (newHp < 0) newHp = 0;
            token.hpCurrent = newHp;
            if (engine.initiative && engine.initiative.participants) {
                const pItem = engine.initiative.participants.find(p => p.tokenId === token.id);
                if (pItem) pItem.hpCurrent = token.hpCurrent;
            }
        });

        const primToken = engine.tokens.find(t => t.id === engine.selectedTokenId);
        if (primToken) {
            document.getElementById('token-hp-current').value = primToken.hpCurrent !== undefined ? primToken.hpCurrent : '';
        }

        modInput.value = '';
        if (engine.initiative && engine.initiative.participants && typeof renderTrackerList === 'function') {
            renderTrackerList();
        }
        engine.renderAll();
        syncState();
    }
}
document.getElementById('btn-apply-hp-dmg').addEventListener('click', () => applyHpMod(false));
document.getElementById('btn-apply-hp-heal').addEventListener('click', () => applyHpMod(true));

function updateTokenAuraCond() {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (!token) return;
    
    let _raw = parseFloat(document.getElementById('token-aura-size').value); if(isNaN(_raw)) _raw = 0; let sizeRaw = Math.max(0.1, _raw);
    
    const unit = document.getElementById('token-aura-unit').value;
    const squares = unit === 'ft' ? sizeRaw / 5 : sizeRaw / 1.5;
    
    token.aura = {
        active: document.getElementById('token-aura-active').checked,
        sizeRaw: sizeRaw,
        unit: unit,
        sizePx: squares * engine.grid.size,
        color: document.getElementById('token-aura-color').value
    };
    
    // Ora la condizione si aggiorna tramite pulsante dedicato
    engine.renderAll();
    syncState();
}

document.getElementById('token-aura-active').addEventListener('change', updateTokenAuraCond);
document.getElementById('token-aura-size').addEventListener('input', updateTokenAuraCond);
document.getElementById('token-aura-unit').addEventListener('change', (e) => {
    const input = document.getElementById('token-aura-size');
    let oldVal = parseFloat(input.value); if(isNaN(oldVal)) oldVal = 0;
    if (e.target.value === 'ft') {
        input.step = '5';
        input.value = Math.round(oldVal / 1.5 * 5);
    } else {
        input.step = '1.5';
        let newVal = (oldVal / 5 * 1.5);
        input.value = Number.isInteger(newVal) ? newVal : newVal.toFixed(1);
    }
    updateTokenAuraCond();
});
document.getElementById('token-aura-color').addEventListener('input', updateTokenAuraCond);

// listeners per l'aura
// Condizioni rimosse dal vecchio listener

window.renderConditionsList = function() {
    const listDiv = document.getElementById('active-conditions-list');
    listDiv.innerHTML = '';
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (!token) return;
    
    // Migrazione al volo se aveva la vecchia condizione singola
    if (token.condition && !token.conditions) {
        if (token.condition.active) {
            token.conditions = [token.condition];
        } else {
            token.conditions = [];
        }
        delete token.condition;
    }
    if (!token.conditions) token.conditions = [];
    
    token.conditions.forEach((cond, index) => {
        const d = document.createElement('div');
        d.style.display = 'flex';
        d.style.justifyContent = 'space-between';
        d.style.alignItems = 'center';
        d.style.background = '#333';
        d.style.padding = '2px 5px';
        d.style.borderRadius = '3px';
        d.style.borderLeft = '4px solid ' + cond.color;
        
        const span = document.createElement('span');
        span.style.fontSize = '12px';
        span.innerText = cond.text;
        
        const btn = document.createElement('button');
        btn.innerText = 'X';
        btn.style.background = '#f44336';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '3px';
        btn.style.cursor = 'pointer';
        
        btn.onclick = () => {
            token.conditions.splice(index, 1);
            renderConditionsList();
            engine.renderAll();
            syncState();
        };
        
        d.appendChild(span);
        d.appendChild(btn);
        listDiv.appendChild(d);
    });
}

document.getElementById('btn-add-condition').addEventListener('click', () => {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (!token) return;
    
    const cType = document.getElementById('token-condition-type').value;
    const cLang = document.getElementById('token-condition-lang').value;
    const parts = cType.split(',');
    const text = cLang === 'it' ? parts[0] : parts[1];
    
    if (!token.conditions) {
        if (token.condition && token.condition.active) token.conditions = [token.condition];
        else token.conditions = [];
        delete token.condition;
    }
    
    token.conditions.push({
        type: cType,
        lang: cLang,
        color: document.getElementById('token-condition-color').value,
        text: text
    });
    
    renderConditionsList();
    engine.renderAll();
    syncState();
});


document.getElementById('note-title').addEventListener('input', () => {
    if(selectedNote) selectedNote.title = document.getElementById('note-title').value;
    syncState();
});
document.getElementById('note-text').addEventListener('input', () => {
    if(selectedNote) selectedNote.text = document.getElementById('note-text').value;
    syncState();
});
document.getElementById('btn-delete-note').addEventListener('click', () => {
    if(!selectedNote) return;
    engine.notes = engine.notes.filter(n => n !== selectedNote);
    selectedNote = null;
    document.getElementById('selected-note-controls').style.display = 'none';
    engine.renderAll();
    syncState();
});

document.getElementById('aoe-type').addEventListener('change', (e) => {
    document.getElementById('aoe-width').style.display = e.target.value === 'line' ? 'block' : 'none';
});

// AoE Logic
document.getElementById('btn-add-aoe').addEventListener('click', () => {
    const type = document.getElementById('aoe-type').value;
    let _raw = parseFloat(document.getElementById('aoe-size').value); if(isNaN(_raw)) _raw = 15; const rawSize = Math.max(0.1, _raw);
    const unit = document.getElementById('aoe-unit').value;
    const sizeFt = unit === 'm' ? (rawSize / 1.5) * 5 : rawSize;
    let _w = parseFloat(document.getElementById('aoe-width').value); if(isNaN(_w)) _w = 5; _w = Math.max(0.1, _w);
    const widthFt = unit === 'm' ? (_w / 1.5) * 5 : _w;
    const color = document.getElementById('aoe-color').value;
    const centerWorld = engine.screenToWorld(engine.layers.ui.width/2, engine.layers.ui.height/2);

    engine.shapes.push({
        id: 'aoe_' + Date.now(),
        type: type,
        x: centerWorld.x,
        y: centerWorld.y,
        sizeFt: sizeFt,
        widthFt: widthFt,
        color: color,
        angle: 0,
        visible: true
    });
    engine.renderAll();
    syncState();
});

document.getElementById('btn-shape-rot-left').addEventListener('click', () => {
    const shape = engine.shapes.find(s => s.id === engine.selectedShapeId);
    if (shape) { shape.angle -= 15; engine.renderAll(); syncState(); }
});

document.getElementById('btn-shape-rot-right').addEventListener('click', () => {
    const shape = engine.shapes.find(s => s.id === engine.selectedShapeId);
    if (shape) { shape.angle += 15; engine.renderAll(); syncState(); }
});

function updateShapeSize() {
    const shape = engine.shapes.find(s => s.id === engine.selectedShapeId);
    if (shape) {
        let _raw = parseFloat(document.getElementById('shape-edit-size').value); if(isNaN(_raw)) _raw = 0; const rawSize = Math.max(0.1, _raw);
        let _w = parseFloat(document.getElementById('shape-edit-width').value); if(isNaN(_w)) _w = 5; _w = Math.max(0.1, _w);
        const unit = document.getElementById('shape-edit-unit').value;
        shape.sizeFt = unit === 'm' ? (rawSize / 1.5) * 5 : rawSize;
        shape.widthFt = unit === 'm' ? (_w / 1.5) * 5 : _w;
        engine.renderAll(); syncState(); 
    }
}
document.getElementById('shape-edit-size').addEventListener('input', updateShapeSize);
document.getElementById('shape-edit-width').addEventListener('input', updateShapeSize);
document.getElementById('shape-edit-unit').addEventListener('change', (e) => {
    const shape = engine.shapes.find(s => s.id === engine.selectedShapeId);
    if (!shape) return;
    const input = document.getElementById('shape-edit-size');
    const inputW = document.getElementById('shape-edit-width');
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
    updateShapeSize();
});

document.getElementById('btn-delete-shape').addEventListener('click', () => {
    engine.shapes = engine.shapes.filter(s => s.id !== engine.selectedShapeId);
    engine.selectedShapeId = null;
    document.getElementById('selected-shape-controls').style.display = 'none';
    engine.renderAll();
    syncState();
});


// Canvas Interactions
const uiLayer = engine.layers.ui;

function getEventPos(e) {
    const rect = uiLayer.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function openTokenStatblock(token) {
    if (!token) return;
    const now = Date.now();
    if (now - lastStatblockOpenTime < 350) return;
    lastStatblockOpenTime = now;

    if (window.compendium) {
        window.compendium.open(token.statblock || null);
    }
}

function handleDoubleClick(e) {
    if (e.button !== 0) return;
    if (currentTool.startsWith('draw-') || currentTool.startsWith('fog-') || currentTool === 'laser') return;

    const pos = getEventPos(e);
    const worldPos = engine.screenToWorld(pos.x, pos.y);

    for (let i = engine.tokens.length - 1; i >= 0; i--) {
        const t = engine.tokens[i];
        if (worldPos.x >= t.x && worldPos.x <= t.x + t.width &&
            worldPos.y >= t.y && worldPos.y <= t.y + t.height) {
            engine.selectedTokens.clear();
            engine.selectedTokens.add(t.id);
            engine.selectedTokenId = t.id;
            if (window.updateSelectedTokenControls) {
                window.updateSelectedTokenControls(t);
            }
            engine.renderAll();
            openTokenStatblock(t);
            break;
        }
    }
}

uiLayer.addEventListener('mousedown', handleStart);
uiLayer.addEventListener('touchstart', handleStart, {passive: false});

uiLayer.addEventListener('mousemove', handleMove);
uiLayer.addEventListener('touchmove', handleMove, {passive: false});

uiLayer.addEventListener('mouseup', handleEnd);
uiLayer.addEventListener('touchend', handleEnd);
uiLayer.addEventListener('mouseleave', handleEnd);
uiLayer.addEventListener('dblclick', handleDoubleClick);

uiLayer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const pos = getEventPos(e);
    const worldPosBefore = engine.screenToWorld(pos.x, pos.y);
    
    if (e.deltaY < 0) engine.scale *= 1.1;
    else engine.scale /= 1.1;
    engine.scale = Math.max(0.1, Math.min(engine.scale, 10));

    const worldPosAfter = engine.screenToWorld(pos.x, pos.y);
    engine.offsetX += (worldPosAfter.x - worldPosBefore.x) * engine.scale;
    engine.offsetY += (worldPosAfter.y - worldPosBefore.y) * engine.scale;

    engine.renderAll();
    syncState();
});

function handleStart(e) {
    e.preventDefault();
    const pos = getEventPos(e);
    
    if (e.button === 1 || e.button === 2) {
        if (!document.getElementById('lock-dm-map-toggle').checked) {
            isPanning = true;
            startPanX = pos.x - engine.offsetX;
            startPanY = pos.y - engine.offsetY;
        }
        return;
    }

    const worldPos = engine.screenToWorld(pos.x, pos.y);
    isDragging = true;

    if (currentTool === 'select-lasso') {
        engine.lasso = { startX: worldPos.x, startY: worldPos.y, endX: worldPos.x, endY: worldPos.y };
        if (!e.shiftKey) {
            engine.selectedTokens.clear();
            engine.selectedTokenId = null;
            document.getElementById('selected-token-controls').style.display = 'none';
        }
        engine.renderAll();
        if (pingTimeout) { clearTimeout(pingTimeout); pingTimeout = null; }
        return;
    }


    // Ping Timer (SOLO per lo strumento 'move', mai per nebbia o disegno)
    if (currentTool === 'move') {
        startMouseX = pos.x;
        startMouseY = pos.y;
        pingTimeout = setTimeout(() => {
            pingTimeout = null;
            const pId = 'dm_ping_' + Date.now();
            engine.pings.push({id: pId, x: worldPos.x, y: worldPos.y, start: Date.now(), color: '#ffcc00'});
            engine.renderUI();
            network.send({ type: 'PING', payload: { id: pId, x: worldPos.x, y: worldPos.y, color: '#ffcc00', t: Date.now() } });
        }, 800);
    }

    if (currentTool === 'move') {
        selectedNote = null;
        document.getElementById('selected-note-controls').style.display = 'none';
        
        let clickedEntity = null;
        
        // Cerca Note prima
        for(const n of engine.notes) {
            if (worldPos.x >= n.x - 15 && worldPos.x <= n.x + 15 && worldPos.y >= n.y - 15 && worldPos.y <= n.y + 15) {
                clickedEntity = { type: 'note', ref: n };
                break;
            }
        }

        // Cerca token se non hai cliccato una nota
        if (!clickedEntity) {
            for (let i = engine.tokens.length - 1; i >= 0; i--) {
                const t = engine.tokens[i];
                if (worldPos.x >= t.x && worldPos.x <= t.x + t.width &&
                    worldPos.y >= t.y && worldPos.y <= t.y + t.height) {
                    clickedEntity = { type: 'token', ref: t };
                    clickedTokenForInteraction = t;
                    break;
                }
            }
        }

        // Se non trovi token, cerca tra le forme (AoE)
        if (!clickedEntity) {
            for (let i = engine.shapes.length - 1; i >= 0; i--) {
                const s = engine.shapes[i];
                const dx = worldPos.x - s.x;
                const dy = worldPos.y - s.y;
                if (dx*dx + dy*dy < 600) { // Click entro ~24px dal centro
                    clickedEntity = { type: 'shape', ref: s };
                    break;
                }
            }
        }

        engine.selectedTokenId = null;
        engine.selectedShapeId = null;
        document.getElementById('selected-token-controls').style.display = 'none';
        document.getElementById('selected-shape-controls').style.display = 'none';

        if (clickedEntity) {
            const ent = clickedEntity.ref;
            if (clickedEntity.type === 'note') {
                selectedNote = ent;
                document.getElementById('selected-note-controls').style.display = 'block';
                document.getElementById('note-title').value = ent.title || "";
                document.getElementById('note-text').value = ent.text || "";
            } else if (clickedEntity.type === 'token') {
                if (e.shiftKey) {
                    if (engine.selectedTokens.has(ent.id)) {
                        engine.selectedTokens.delete(ent.id);
                        if (engine.selectedTokenId === ent.id) engine.selectedTokenId = null;
                        document.getElementById('selected-token-controls').style.display = engine.selectedTokenId ? 'block' : 'none';
                        activeStroke = null;
                    } else {
                        engine.selectedTokens.add(ent.id);
                        engine.selectedTokenId = ent.id;
                        activeStroke = ent;
                    }
                } else {
                    if (!engine.selectedTokens.has(ent.id)) {
                        engine.selectedTokens.clear();
                        engine.selectedTokens.add(ent.id);
                    }
                    engine.selectedTokenId = ent.id;
                    activeStroke = ent;
                }
                
                if (engine.selectedTokenId === ent.id) {
                    if (window.updateSelectedTokenControls) window.updateSelectedTokenControls(ent);
                }
            } else if (clickedEntity.type === 'shape') {
                engine.selectedShapeId = ent.id;
                if (aoePanel) aoePanel.style.display = 'flex';
                document.getElementById('selected-shape-controls').style.display = 'flex';
                document.getElementById('shape-edit-width').style.display = ent.type === 'line' ? 'block' : 'none';
                document.getElementById('shape-edit-unit').value = 'ft';
                document.getElementById('shape-edit-size').step = '5';
                document.getElementById('shape-edit-width').step = '1';
                document.getElementById('shape-edit-size').value = Math.round(ent.sizeFt * 10) / 10;
                document.getElementById('shape-edit-width').value = ent.widthFt !== undefined ? Math.round(ent.widthFt * 10) / 10 : 5;
            }
            activeStroke = ent; 
        } else {
            if (!e.shiftKey) {
                engine.selectedTokens.clear();
                engine.selectedTokenId = null;
                document.getElementById('selected-token-controls').style.display = 'none';
                engine.renderAll();
            }
            if (!document.getElementById('lock-dm-map-toggle').checked) {
                isPanning = true;
                startPanX = pos.x - engine.offsetX;
                startPanY = pos.y - engine.offsetY;
            }
        }
    } else if (currentTool === 'note') {
        engine.notes.push({ x: worldPos.x, y: worldPos.y, title: '', text: '' });
        engine.renderAll();
        syncState(true);
    } else if (currentTool === 'move-grid') {
        activeStroke = {
            startOffsetX: engine.grid.offsetX || 0,
            startOffsetY: engine.grid.offsetY || 0,
            startWorldX: worldPos.x,
            startWorldY: worldPos.y
        };
    } else if (currentTool === 'ruler') {
        engine.ruler = { startX: worldPos.x, startY: worldPos.y, endX: worldPos.x, endY: worldPos.y };
    } else if (currentTool.startsWith('draw-')) {
        activeStroke = {
            color: currentTool === 'draw-public' ? '#ff0000' : '#ffff00',
            width: 10,
            points: [worldPos]
        };
        if (currentTool === 'draw-public') engine.publicStrokes.push(activeStroke);
        else engine.privateStrokes.push(activeStroke);
    } else if (currentTool === 'laser') {
        activeLaser = {
            id: Date.now() + '_' + Math.random(),
            color: '#00ffcc',
            active: true,
            points: [{x: worldPos.x, y: worldPos.y, t: Date.now()}]
        };
        const colors = ['#ff0055', '#00ffcc', '#ffff00', '#ff8800', '#ff00ff', '#55ff00'];
        activeLaser.color = colors[Math.floor(Math.random() * colors.length)];
        if (typeof isDM !== 'undefined' && isDM) activeLaser.color = '#ff0055'; // DM is red
        
        if (!engine.lasers) engine.lasers = [];
        engine.lasers.push(activeLaser);
        
        engine.renderUI();
    } else if (currentTool.startsWith('fog-')) {
        const shape = document.getElementById('fog-brush-shape').value;
        const size = parseInt(document.getElementById('fog-brush-size').value) || 150;
        activeStroke = [worldPos];
        engine.drawFogStroke([worldPos, {x: worldPos.x+0.1, y: worldPos.y}], currentTool === 'fog-erase', shape, size);
    }
    
    engine.renderAll();
}

function handleMove(e) {
    const pos = getEventPos(e);
    const worldPos = engine.screenToWorld(pos.x, pos.y);

    if (pingTimeout && Math.hypot(pos.x - startMouseX, pos.y - startMouseY) > 10) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
    }

    if (currentTool.startsWith('fog-')) {
        engine.brushPreview = {
            x: worldPos.x,
            y: worldPos.y,
            shape: document.getElementById('fog-brush-shape').value,
            size: parseInt(document.getElementById('fog-brush-size').value) || 150,
            isErase: currentTool === 'fog-erase'
        };
    } else {
        engine.brushPreview = null;
    }

    
    if (currentTool === 'select-lasso' && engine.lasso) {
        engine.lasso.endX = worldPos.x;
        engine.lasso.endY = worldPos.y;
        engine.renderUI();
        return;
    }

    if (!isDragging && !isPanning) {
        if (currentTool.startsWith('fog-')) engine.renderUI();
        return;
    }
    e.preventDefault();

    if (isPanning) {
        engine.offsetX = pos.x - startPanX;
        engine.offsetY = pos.y - startPanY;
        engine.renderViewport();
        if (isViewSyncActive) {
            sendViewSync();
        }
        return;
    }

    if (currentTool === 'move' && typeof activeStroke === 'object') {
        if (activeStroke.id && activeStroke.id.startsWith('token_')) {
            activeStroke.x = worldPos.x - activeStroke.width/2;
            activeStroke.y = worldPos.y - activeStroke.height/2;
            if (activeStroke.visible !== false && Date.now() - (window.lastGmTokenMoveSend || 0) > 35) {
                window.lastGmTokenMoveSend = Date.now();
                network.send({
                    type: 'REMOTE_TOKEN_MOVE',
                    ephemeral: true,
                    payload: { id: activeStroke.id, x: activeStroke.x, y: activeStroke.y }
                });
            }
            engine.renderTokensLayer();
        } else if (activeStroke.id && activeStroke.id.startsWith('aoe_')) {
            activeStroke.x = worldPos.x;
            activeStroke.y = worldPos.y;
            if (Date.now() - (window.lastGmShapeMoveSend || 0) > 35) {
                window.lastGmShapeMoveSend = Date.now();
                network.send({
                    type: 'REMOTE_SHAPE_MOVE',
                    ephemeral: true,
                    payload: { id: activeStroke.id, x: activeStroke.x, y: activeStroke.y }
                });
            }
            engine.renderTokensLayer();
        } else {
            activeStroke.x = worldPos.x;
            activeStroke.y = worldPos.y;
            engine.renderAll();
        }
    } else if (currentTool === 'move-grid' && activeStroke) {
        engine.grid.offsetX = activeStroke.startOffsetX + (worldPos.x - activeStroke.startWorldX);
        engine.grid.offsetY = activeStroke.startOffsetY + (worldPos.y - activeStroke.startWorldY);
        engine.renderAll();
        if (Date.now() - (window.lastGridMoveSend || 0) > 40) {
            window.lastGridMoveSend = Date.now();
            network.send({
                type: 'GRID_MOVE_LIVE',
                payload: { offsetX: engine.grid.offsetX, offsetY: engine.grid.offsetY }
            });
        }
    } else if (currentTool === 'ruler') {
        engine.ruler.endX = worldPos.x;
        engine.ruler.endY = worldPos.y;
        engine.renderAll();
    } else if (currentTool === 'laser' && activeLaser) {
        activeLaser.points.push({x: worldPos.x, y: worldPos.y, t: Date.now()});
        if (Date.now() - lastLaserSync > 40) {
            network.send({ type: 'LASER_SYNC', payload: activeLaser });
            lastLaserSync = Date.now();
        }
    } else if (currentTool.startsWith('draw-')) {
        activeStroke.points.push(worldPos);
        engine.renderAll();
        if (currentTool === 'draw-public') {
            if (Date.now() - (window.lastDrawLiveSend || 0) > 40) {
                window.lastDrawLiveSend = Date.now();
                network.send({
                    type: 'LIVE_DRAW_POINT',
                    payload: { color: activeStroke.color, width: activeStroke.width, point: worldPos }
                });
            }
        }
    } else if (currentTool.startsWith('fog-')) {
        const shape = document.getElementById('fog-brush-shape').value;
        const size = parseInt(document.getElementById('fog-brush-size').value) || 150;
        if (!activeStroke || !Array.isArray(activeStroke)) activeStroke = [worldPos];
        activeStroke.push(worldPos);
        engine.drawFogStroke(activeStroke, currentTool === 'fog-erase', shape, size);
        activeStroke = [activeStroke[activeStroke.length-1], worldPos];
        engine.renderUI();
    }
}

function handleEnd(e) {
    if (pingTimeout) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
    }

    if (currentTool === 'select-lasso' && engine.lasso) {
        const minX = Math.min(engine.lasso.startX, engine.lasso.endX);
        const maxX = Math.max(engine.lasso.startX, engine.lasso.endX);
        const minY = Math.min(engine.lasso.startY, engine.lasso.endY);
        const maxY = Math.max(engine.lasso.startY, engine.lasso.endY);
        
        if (maxX - minX < 5 && maxY - minY < 5) {
            let clicked = null;
            for (let i = engine.tokens.length - 1; i >= 0; i--) {
                const t = engine.tokens[i];
                if (engine.lasso.startX >= t.x && engine.lasso.startX <= t.x + t.width &&
                    engine.lasso.startY >= t.y && engine.lasso.startY <= t.y + t.height) {
                    clicked = t;
                    break;
                }
            }
            if (clicked) {
                const now = Date.now();
                if (lastClickedTokenId === clicked.id && (now - lastClickedTokenTime) < 380) {
                    openTokenStatblock(clicked);
                    lastClickedTokenId = null;
                    lastClickedTokenTime = 0;
                } else {
                    lastClickedTokenId = clicked.id;
                    lastClickedTokenTime = now;
                }
                if (e.shiftKey) {
                    if (engine.selectedTokens.has(clicked.id)) {
                        engine.selectedTokens.delete(clicked.id);
                        if (engine.selectedTokenId === clicked.id) engine.selectedTokenId = null;
                    } else {
                        engine.selectedTokens.add(clicked.id);
                        engine.selectedTokenId = clicked.id;
                    }
                } else {
                    engine.selectedTokens.clear();
                    engine.selectedTokens.add(clicked.id);
                    engine.selectedTokenId = clicked.id;
                }
            } else if (!e.shiftKey) {
                engine.selectedTokens.clear();
                engine.selectedTokenId = null;
            }
        } else {
            if (!e.shiftKey) { engine.selectedTokens.clear(); }
            engine.tokens.forEach(t => {
                const tCenterX = t.x + t.width/2;
                const tCenterY = t.y + t.height/2;
                if (tCenterX >= minX && tCenterX <= maxX && tCenterY >= minY && tCenterY <= maxY) {
                    engine.selectedTokens.add(t.id);
                }
            });
            if (engine.selectedTokens.size > 0) {
                engine.selectedTokenId = Array.from(engine.selectedTokens).pop();
            }
        }
        
        engine.lasso = null;
        isDragging = false;
        
        if (engine.selectedTokenId) {
            const ent = engine.tokens.find(t => t.id === engine.selectedTokenId);
            if (ent && window.updateSelectedTokenControls) {
                window.updateSelectedTokenControls(ent);
            }
        } else {
            document.getElementById('selected-token-controls').style.display = 'none';
        }
        engine.renderAll();
        return;
    }

    if (pingTimeout) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
    }
    if (!isDragging && !isPanning) return;
    
    if (isPanning) {
        isPanning = false;
        if (isViewSyncActive) {
            sendViewSync(true);
        }
        return;
    }

    if (currentTool === 'move' && typeof activeStroke === 'object') {
        // Snap per i token. Le AoE si muovono liberamente e non si "snappano".
        if (activeStroke.id && activeStroke.id.startsWith('token_')) {
            const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
            const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
            
            activeStroke.x = Math.round((activeStroke.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
            activeStroke.y = Math.round((activeStroke.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
            if (activeStroke.visible !== false) {
                network.send({
                    type: 'REMOTE_TOKEN_MOVE',
                    final: true,
                    payload: { id: activeStroke.id, x: activeStroke.x, y: activeStroke.y }
                });
            }
        } else if (activeStroke.id && activeStroke.id.startsWith('aoe_')) {
            network.send({
                type: 'REMOTE_SHAPE_MOVE',
                final: true,
                payload: { id: activeStroke.id, x: activeStroke.x, y: activeStroke.y }
            });
        } else {
            syncState(true);
        }
    } else if (currentTool === 'move-grid') {
        syncState(true);
    } else if (currentTool === 'ruler') {
        engine.ruler = null;
    } else if (currentTool === 'laser') {
        if (activeLaser) {
            activeLaser.active = false;
            network.send({ type: 'LASER_SYNC', payload: activeLaser });
            activeLaser = null;
        }
    } else if (currentTool.startsWith('draw-')) {
        syncState(true);
    } else if (currentTool.startsWith('fog-')) {
        syncFog();
    }

    isDragging = false;
    activeStroke = null;
    engine.renderAll();

    // Rilevamento rapido doppio click / doppio tap per aprire la scheda
    if (clickedTokenForInteraction) {
        const moveDist = Math.hypot(pos.x - startMouseX, pos.y - startMouseY);
        if (moveDist < 10) {
            const now = Date.now();
            if (lastClickedTokenId === clickedTokenForInteraction.id && (now - lastClickedTokenTime) < 380) {
                openTokenStatblock(clickedTokenForInteraction);
                lastClickedTokenId = null;
                lastClickedTokenTime = 0;
            } else {
                lastClickedTokenId = clickedTokenForInteraction.id;
                lastClickedTokenTime = now;
            }
        } else {
            lastClickedTokenId = null;
            lastClickedTokenTime = 0;
        }
        clickedTokenForInteraction = null;
    } else {
        lastClickedTokenId = null;
        lastClickedTokenTime = 0;
    }
}


const btnAddToInit = document.getElementById('btn-add-to-init');
if(btnAddToInit) {
    btnAddToInit.addEventListener('click', () => {
        if (!engine.initiative || !engine.initiative.participants) return alert("Avvia prima l'iniziativa col tasto giallo in alto!");
        if (!engine.selectedTokens || engine.selectedTokens.size === 0) return alert("Seleziona almeno un token prima!");
        
        let roll = prompt("Inserisci il valore di Iniziativa per il/i token selezionati:", "10");
        if (roll === null) return;
        
        let count = 0;
        engine.selectedTokens.forEach(tokenId => {
            const t = engine.tokens.find(tok => tok.id === tokenId);
            if (t) {
                const existing = engine.initiative.participants.find(p => p.tokenId === t.id);
                if (existing) {
                    existing.init = parseFloat(roll) || 0;
                    existing.ac = t.ac || 0;
                } else {
                    engine.initiative.participants.push({
                        id: 'tok_' + t.id,
                        name: window.getSmartTokenName(t),
                        isToken: true,
                        tokenId: t.id,
                        isHidden: !t.visible,
                        init: parseFloat(roll) || 0,
                        hpCurrent: t.hpCurrent,
                        hpMax: t.hpMax,
                        ac: t.ac || 0
                    });
                }
                count++;
            }
        });
        
        engine.initiative.participants.sort((a, b) => {
            const valA = parseFloat(a.init) || 0;
            const valB = parseFloat(b.init) || 0;
            return valB - valA;
        });
        
        if (typeof renderTrackerList === 'function') renderTrackerList();
        syncState(true);
        if (typeof showToast === 'function') showToast(`Aggiunti ${count} token all'Iniziativa!`);
    });
}


function showToast(msg) {
    if (typeof window.t === 'function') msg = window.t(msg);
    let t = document.getElementById('toast-msg');
    if(!t) {
        t = document.createElement('div');
        t.id = 'toast-msg';
        t.style.position = 'fixed';
        t.style.top = '20px';
        t.style.left = '50%';
        t.style.transform = 'translateX(-50%)';
        t.style.background = 'rgba(76, 175, 80, 0.9)';
        t.style.color = 'white';
        t.style.padding = '10px 20px';
        t.style.borderRadius = '5px';
        t.style.zIndex = '10000';
        t.style.fontWeight = 'bold';
        t.style.transition = 'opacity 0.3s';
        t.style.pointerEvents = 'none';
        document.body.appendChild(t);
    }
    t.innerText = msg;
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, 3000);
}



// --- LOGICA CONDIVISIONE IMMAGINI (HANDOUTS) ---
engine.sharedImageId = null;
engine.sharedImageData = null;

document.getElementById('share-image-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target.result;
            engine.sharedImageId = null;
              engine.sharedImageData = base64;
              // Mostra al DM
              document.getElementById('dm-handout-image').src = base64;
              document.getElementById('dm-handout-window').style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
    e.target.value = '';
});


document.getElementById('btn-dm-handout-transmit').addEventListener('click', () => {
    if (engine.sharedImageData) {
        engine.sharedImageId = 'img_' + Date.now();
        syncState(true);
        if (typeof showToast === 'function') showToast("Immagine trasmessa ai giocatori!");
    } else {
        if (typeof showToast === 'function') showToast("Carica prima un'immagine!");
    }
});


document.getElementById('btn-dm-handout-close-self').addEventListener('click', () => {
    document.getElementById('dm-handout-window').style.display = 'none';
});

document.getElementById('btn-dm-handout-close-all').addEventListener('click', () => {
    engine.sharedImageId = null;
    engine.sharedImageData = null;
    document.getElementById('dm-handout-window').style.display = 'none';
    syncState(true);
    if (typeof showToast === 'function') showToast("Immagine rimossa per tutti.");
});

// Dragging logic for DM Handout Window
let isDraggingHandoutDM = false;
let handoutDMOffsetX = 0, handoutDMOffsetY = 0;
const dmHandoutWindow = document.getElementById('dm-handout-window');
document.getElementById('dm-handout-header').addEventListener('mousedown', (e) => {
    if(e.target.tagName.toLowerCase() === 'button') return;
    isDraggingHandoutDM = true;
    handoutDMOffsetX = e.clientX - dmHandoutWindow.getBoundingClientRect().left;
    handoutDMOffsetY = e.clientY - dmHandoutWindow.getBoundingClientRect().top;
});
document.addEventListener('mousemove', (e) => {
    if (!isDraggingHandoutDM) return;
    dmHandoutWindow.style.left = (e.clientX - handoutDMOffsetX) + 'px';
    dmHandoutWindow.style.top = (e.clientY - handoutDMOffsetY) + 'px';
    dmHandoutWindow.style.right = 'auto';
    if (Date.now() - (window.lastHandoutMoveSend || 0) > 40) {
        window.lastHandoutMoveSend = Date.now();
        network.send({
            type: 'HANDOUT_RECT_LIVE',
            payload: {
                left: dmHandoutWindow.style.left,
                top: dmHandoutWindow.style.top,
                width: dmHandoutWindow.style.width,
                height: dmHandoutWindow.style.height
            }
        });
    }
});
document.addEventListener('mouseup', () => {
    if (isDraggingHandoutDM) {
        isDraggingHandoutDM = false;
        syncState(true);
    }
});



// Sincronizza geometria handout
const handoutResizeObserver = new ResizeObserver(() => {
    if (document.getElementById('dm-handout-window').style.display !== 'none') {
        syncState(false);
    }
});
handoutResizeObserver.observe(document.getElementById('dm-handout-window'));
