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
        status.innerHTML = `<span style="color:#4caf50; font-weight:bold;">Online!</span><br>Codice Stanza: <b style="color:white; font-size:16px;">${escapeHTML(id)}</b>`;
    }).catch(err => {
        btn.disabled = false;
        btn.innerText = "Riprova";
        status.innerHTML = `<span style="color:#f44336;">Errore di connessione.</span>`;
        console.error(err);
    });
});

network.onConnect((playerName) => {
    if(playerName) {
        const div = document.getElementById('online-players');
        if(div.innerText === "Nessun giocatore connesso.") div.innerText = "";
        div.innerHTML += `<div>🟢 ${escapeHTML(playerName)}</div>`;
        syncState(); // Sincronizza il nuovo arrivato
        syncFog();
        if (currentMapBase64) {
            network.send({ type: 'MAP_UPDATE', payload: currentMapBase64 });
        }
    }
});

network.onMessage((data, peerId) => {
    if (data.type === 'PLAYER_READY') {
        // Un giocatore ha appena aperto la pagina e ricaricato tutto, o si è appena unito offline
        if (currentMapBase64) {
            network.send({ type: 'MAP_UPDATE', payload: currentMapBase64 });
        }
        // Ritardiamo fog e state per dare tempo al giocatore di caricare l'immagine della mappa
        setTimeout(() => {
            syncState(true);
            syncFog();
        }, 200);
    } else if (data.type === 'PLAYER_MOVE_TOKEN' || data.type === 'PLAYER_END_TOKEN') {
        const payload = data.payload;
        const token = engine.tokens.find(t => t.id === payload.id);
        
        // Cerca il nome del giocatore in base al peerId (oppure da locale se 'local')
        let pName = null;
        if (peerId === 'local') {
            // Se sta giocando offline col tab a fianco, non abbiamo un modo sicuro 
            // per sapere chi è a meno di non passare il nome nel payload, ma fidiamoci.
            pName = token ? token.owner : null;
        } else {
            pName = network.connections[peerId] ? network.connections[peerId].name : null;
        }

        if (token && token.owner === pName) {
            token.x = payload.x;
            token.y = payload.y;
            engine.renderAll();
            syncState(data.type === 'PLAYER_END_TOKEN');
        }
    } else if (data.type === 'PING') {
        engine.pings.push({x: data.payload.x, y: data.payload.y, start: Date.now(), color: data.payload.color || '#ff0000'});
        engine.renderUI();
        // Rimbalza a tutti gli altri giocatori
        network.send(data);
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
            engine.renderAll();
            syncState(false);
        }
    } else if (data.type === 'PLAYER_UPDATE_SHAPE') {
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s) {
            s.sizeFt = data.payload.sizeFt;
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
let tokenImages = {};
let currentMapBase64 = null;

// Inizializza il database locale


let isHideToolbarActive = false;
const hideToolbarBtn = document.getElementById('hide-toolbar-toggle');
if (hideToolbarBtn) {
    hideToolbarBtn.addEventListener('change', (e) => {
        isHideToolbarActive = e.target.checked;
        syncState(true);
    });
}

let isViewSyncActive = false;
const syncToggleBtn = document.getElementById('sync-view-toggle');
if (syncToggleBtn) {
    syncToggleBtn.addEventListener('change', (e) => {
        isViewSyncActive = e.target.checked;
        syncState(true);
    });
}


vttDB.init().then(() => {
    refreshCampaigns();
});

let lastSyncTime = 0;
let syncTimeout = null;

function syncState(force = false) {
    const now = Date.now();
    // Limita l'invio a massimo 25 frame al secondo (ogni 40ms) per non intasare la rete P2P
    if (!force && now - lastSyncTime < 40) {
        if (!syncTimeout) {
            syncTimeout = setTimeout(() => {
                syncTimeout = null;
                syncState(true);
            }, 40);
        }
        return;
    }
    
    if (syncTimeout) {
        clearTimeout(syncTimeout);
        syncTimeout = null;
    }
    lastSyncTime = now;

    let viewSyncData = null;
    if (typeof isViewSyncActive !== 'undefined' && isViewSyncActive && engine.scale > 0 && engine.container) {
        viewSyncData = {
            centerX: (engine.container.clientWidth / 2 - engine.offsetX) / engine.scale,
            centerY: (engine.container.clientHeight / 2 - engine.offsetY) / engine.scale,
            scale: engine.scale
        };
    }

    network.send({
        type: 'STATE_SYNC',
        payload: {
            grid: engine.grid,
            tokens: engine.tokens.map(t => ({...t, imageObj: null})),
            shapes: engine.shapes,
            initiative: engine.initiative,
            publicStrokes: engine.publicStrokes,
            viewSync: viewSyncData,
            hideToolbar: typeof isHideToolbarActive !== 'undefined' ? isHideToolbarActive : false
        }
    });
}

function syncFog() {
    network.send({
        type: 'FOG_SYNC',
        payload: engine.getFogBase64()
    });
}

document.getElementById('btn-open-player').addEventListener('click', () => {
    window.open('player.html', '_blank', 'width=800,height=600');
    setTimeout(() => {
        syncState();
        if(engine.mapImage) {
            network.send({ type: 'MAP_UPDATE', payload: engine.mapImage.src });
        }
        syncFog();
    }, 1000);
});

// Load Map
document.getElementById('map-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            currentMapBase64 = ev.target.result;
            const img = new Image();
            img.onload = () => {
                engine.setMap(img);
                network.send({ type: 'MAP_UPDATE', payload: currentMapBase64 });
                syncState();
                syncFog();
            };
            img.src = currentMapBase64;
        };
        reader.readAsDataURL(file);
    }
});

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
        refreshCampaigns();
        document.getElementById('map-manager').style.display = 'none';
    }
});

document.getElementById('campaign-select').addEventListener('change', async (e) => {
    const id = e.target.value;
    if (id) {
        document.getElementById('map-manager').style.display = 'block';
        refreshMaps(id);
    } else {
        document.getElementById('map-manager').style.display = 'none';
    }
});

async function refreshMaps(campaignId) {
    const maps = await vttDB.getMapsByCampaign(campaignId);
    const select = document.getElementById('map-select');
    select.innerHTML = '<option value="">-- Seleziona Mappa --</option>';
    maps.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id; opt.textContent = m.name;
        opt.dataset.map = JSON.stringify(m);
        select.appendChild(opt);
    });
}


let currentLoadedMapId = null;
let currentLoadedMapName = "";
let pingTimeout = null;
let startMouseX = 0;
let startMouseY = 0;
let selectedNote = null;


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
        scale: engine.scale
    };

    const savedMap = await vttDB.saveMap(campaignId, name, currentMapBase64, state);
    currentLoadedMapId = savedMap.id;
    currentLoadedMapName = savedMap.name;
    refreshMaps(campaignId);
    alert('Nuova mappa salvata con successo!');
});

document.getElementById('btn-save-map').addEventListener('click', async () => {
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
        scale: engine.scale
    };

    await vttDB.saveMap(campaignId, currentLoadedMapName, currentMapBase64, state, currentLoadedMapId);
    refreshMaps(campaignId);
    // Cambiamo l'alert in qualcosa di meno invasivo per i salvataggi continui
    const btn = document.getElementById('btn-save-map'); const oldText = btn.innerText; btn.innerText = 'Salvato!'; setTimeout(() => btn.innerText = oldText, 1500);
});

document.getElementById('btn-load-map').addEventListener('click', () => {
    const select = document.getElementById('map-select');
    if (!select.value) return alert('Seleziona una mappa da caricare!');
    
    const opt = select.options[select.selectedIndex];
    const mapData = JSON.parse(opt.dataset.map);
    
    currentLoadedMapId = mapData.id;
    currentLoadedMapName = mapData.name;
    
    currentMapBase64 = mapData.mapImageBase64;
    const state = mapData.state;

    const img = new Image();
    img.onload = () => {
        engine.setMap(img);
        
        engine.grid = state.grid || engine.grid;
        if (state.grid) {
            document.getElementById('grid-size').value = state.grid.size;
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
            state.tokens.forEach(t => {
                const tImg = new Image();
                tImg.onload = () => {
                    t.imageObj = tImg;
                    engine.tokens.push(t);
                    engine.renderAll();
                    syncState();
                };
                tImg.src = t.src;
            });
        } else {
            engine.tokens = [];
            engine.renderAll();
            syncState();
        }

        if (state.fogBase64) {
            engine.applyFogImage(state.fogBase64);
            setTimeout(() => { syncFog(); }, 150);
        }
        
        network.send({ type: 'MAP_UPDATE', payload: currentMapBase64 });
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
        refreshMaps(document.getElementById('campaign-select').value);
    }
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
    syncState();
});
document.getElementById('btn-clear-drawings-priv').addEventListener('click', () => {
    engine.privateStrokes = [];
    engine.renderAll();
    syncState();
});

// Load Tokens
document.getElementById('token-folder-upload').addEventListener('change', (e) => {
    const files = e.target.files;
    const gallery = document.getElementById('token-gallery');
    
    for (let file of files) {
        if (!file.type.startsWith('image/')) continue;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const src = ev.target.result;
            const imgEl = document.createElement('img');
            imgEl.src = src;
            imgEl.className = 'gallery-token';
            imgEl.title = file.name;
            tokenImages[file.name] = src;
            
            imgEl.addEventListener('click', () => addTokenToMap(file.name, src));
            gallery.appendChild(imgEl);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('token-search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.gallery-token').forEach(img => {
        if (img.title.toLowerCase().includes(query)) {
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }
    });
});

function addTokenToMap(name, src) {
    const sizeMultiplier = parseInt(document.getElementById('token-size-select').value) || 1;
    const isVisible = document.getElementById('token-visibility-select').value === 'visible';
    const pxSize = engine.grid.size * sizeMultiplier;
    
    const imgObj = new Image();
    imgObj.onload = () => {
        const centerWorld = engine.screenToWorld(engine.layers.ui.width/2, engine.layers.ui.height/2);
        
        const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
        const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;

        const snappedX = Math.round((centerWorld.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
        const snappedY = Math.round((centerWorld.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;

        const token = {
            id: 'token_' + Date.now(),
            x: snappedX,
            y: snappedY,
            width: pxSize,
            height: pxSize,
            sizeMultiplier: sizeMultiplier,
            src: src,
            visible: isVisible,
            imageObj: imgObj
        };
        engine.tokens.push(token);
        engine.renderAll();
        syncState();
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
    engine.tokens = engine.tokens.filter(t => t.id !== engine.selectedTokenId);
    engine.selectedTokenId = null;
    document.getElementById('selected-token-controls').style.display = 'none';
    engine.renderAll();
    syncState();
});


function updateTokenHP() {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (!token) return;
    token.hpCurrent = parseInt(document.getElementById('token-hp-current').value) || 0;
    token.hpMax = parseInt(document.getElementById('token-hp-max').value) || 0;
    token.hpVisibleToPlayers = document.getElementById('token-hp-visible').checked;
    if(engine.initiative && engine.initiative.participants) {
        const pItem = engine.initiative.participants.find(p => p.tokenId === token.id);
        if(pItem) { pItem.hpCurrent = token.hpCurrent; pItem.hpMax = token.hpMax; if(typeof renderTrackerList === 'function') renderTrackerList(); }
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

document.getElementById('token-hp-current').addEventListener('change', updateTokenHP);
document.getElementById('token-hp-max').addEventListener('change', updateTokenHP);
document.getElementById('token-hp-visible').addEventListener('change', updateTokenHP);


function applyHpMod(isHeal) {
    const modInput = document.getElementById('token-hp-mod');
    let modVal = parseInt(modInput.value);
    if (!isNaN(modVal)) {
        // Se c'è già un segno meno per errore e clicco cura, o simili
        modVal = Math.abs(modVal);
        if (!isHeal) modVal = -modVal;
        
        const currInput = document.getElementById('token-hp-current');
        let newHp = (parseInt(currInput.value) || 0) + modVal;
        const maxHp = parseInt(document.getElementById('token-hp-max').value) || 0;
        if (newHp > maxHp && maxHp > 0) newHp = maxHp;
        if (newHp < 0) newHp = 0;
        currInput.value = newHp;
        modInput.value = '';
        updateTokenHP();
    }
}
document.getElementById('btn-apply-hp-dmg').addEventListener('click', () => applyHpMod(false));
document.getElementById('btn-apply-hp-heal').addEventListener('click', () => applyHpMod(true));

function updateTokenAuraCond() {
    const token = engine.tokens.find(t => t.id === engine.selectedTokenId);
    if (!token) return;
    
    let sizeRaw = parseFloat(document.getElementById('token-aura-size').value) || 0;
    if (sizeRaw < 0) sizeRaw = 0;
    
    const unit = document.getElementById('token-aura-unit').value;
    const squares = unit === 'ft' ? sizeRaw / 5 : sizeRaw / 1.5;
    
    token.aura = {
        active: document.getElementById('token-aura-active').checked,
        sizeRaw: sizeRaw,
        unit: unit,
        sizePx: squares * engine.grid.size,
        color: document.getElementById('token-aura-color').value
    };
    
    const cType = document.getElementById('token-condition-type').value;
    const cLang = document.getElementById('token-condition-lang').value;
    const parts = cType.split(','); // "Accecato,Blinded"
    const text = cLang === 'it' ? parts[0] : parts[1];
    
    token.condition = {
        active: document.getElementById('token-condition-active').checked,
        type: cType,
        lang: cLang,
        color: document.getElementById('token-condition-color').value,
        text: text
    };
    
    engine.renderAll();
    syncState();
}

document.getElementById('token-aura-active').addEventListener('change', updateTokenAuraCond);
document.getElementById('token-aura-size').addEventListener('input', updateTokenAuraCond);
document.getElementById('token-aura-unit').addEventListener('change', (e) => {
    const input = document.getElementById('token-aura-size');
    const oldVal = parseFloat(input.value) || 0;
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

document.getElementById('token-condition-active').addEventListener('change', updateTokenAuraCond);
document.getElementById('token-condition-type').addEventListener('change', updateTokenAuraCond);
document.getElementById('token-condition-lang').addEventListener('change', updateTokenAuraCond);
document.getElementById('token-condition-color').addEventListener('input', updateTokenAuraCond);

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

// AoE Logic
document.getElementById('btn-add-aoe').addEventListener('click', () => {
    const type = document.getElementById('aoe-type').value;
    const rawSize = parseFloat(document.getElementById('aoe-size').value) || 15;
    const unit = document.getElementById('aoe-unit').value;
    const sizeFt = unit === 'm' ? (rawSize / 1.5) * 5 : rawSize;
    const color = document.getElementById('aoe-color').value;
    const centerWorld = engine.screenToWorld(engine.layers.ui.width/2, engine.layers.ui.height/2);

    engine.shapes.push({
        id: 'aoe_' + Date.now(),
        type: type,
        x: centerWorld.x,
        y: centerWorld.y,
        sizeFt: sizeFt,
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
        const rawSize = parseFloat(document.getElementById('shape-edit-size').value) || 15;
        const unit = document.getElementById('shape-edit-unit').value;
        shape.sizeFt = unit === 'm' ? (rawSize / 1.5) * 5 : rawSize;
        engine.renderAll(); syncState(); 
    }
}
document.getElementById('shape-edit-size').addEventListener('input', updateShapeSize);
document.getElementById('shape-edit-unit').addEventListener('change', (e) => {
    const input = document.getElementById('shape-edit-size');
    const oldVal = parseFloat(input.value) || 0;
    if (e.target.value === 'ft') {
        input.step = '5';
        input.value = Math.round(oldVal / 1.5 * 5);
    } else {
        input.step = '1.5';
        let newVal = (oldVal / 5 * 1.5);
        input.value = Number.isInteger(newVal) ? newVal : newVal.toFixed(1);
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

uiLayer.addEventListener('mousedown', handleStart);
uiLayer.addEventListener('touchstart', handleStart, {passive: false});

uiLayer.addEventListener('mousemove', handleMove);
uiLayer.addEventListener('touchmove', handleMove, {passive: false});

uiLayer.addEventListener('mouseup', handleEnd);
uiLayer.addEventListener('touchend', handleEnd);
uiLayer.addEventListener('mouseleave', handleEnd);

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
        isPanning = true;
        startPanX = pos.x - engine.offsetX;
        startPanY = pos.y - engine.offsetY;
        return;
    }

    const worldPos = engine.screenToWorld(pos.x, pos.y);
    isDragging = true;

    // Ping Timer
    startMouseX = pos.x;
    startMouseY = pos.y;
    pingTimeout = setTimeout(() => {
        pingTimeout = null;
        engine.pings.push({x: worldPos.x, y: worldPos.y, start: Date.now()});
        engine.renderUI();
        if (typeof channel !== 'undefined') {
            network.send({ type: 'ping', x: worldPos.x, y: worldPos.y });
        }
    }, 800);

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
                engine.selectedTokenId = ent.id;
                document.getElementById('selected-token-controls').style.display = 'block';
                document.getElementById('token-edit-size').value = ent.sizeMultiplier || 1;
                // Popola il menu a tendina dei proprietari
                const ownerSelect = document.getElementById('token-owner');
                ownerSelect.innerHTML = '<option value="">-- Nessuno (Solo DM) --</option>';
                
                // Raccogli tutti i giocatori attualmente connessi
                let players = [];
                for (let k in network.connections) {
                    if (network.connections[k].name) players.push(network.connections[k].name);
                }
                
                // Se il token ha già un proprietario che non è connesso, aggiungiamolo per non perderlo
                if (ent.owner && !players.includes(ent.owner)) {
                    players.push(ent.owner);
                }
                
                players.forEach(pName => {
                    const opt = document.createElement('option');
                    opt.value = pName;
                    opt.innerText = pName;
                    ownerSelect.appendChild(opt);
                });
                
                ownerSelect.value = ent.owner || '';
                // Popola HP
                document.getElementById('token-hp-current').value = ent.hpCurrent || 0;
                document.getElementById('token-hp-max').value = ent.hpMax || 0;
                document.getElementById('token-hp-visible').checked = ent.hpVisibleToPlayers !== false;
                document.getElementById('token-hp-mod').value = '';
                
                // Popola Aura e Condizione
                const token = ent;
                if (token) {
                    const aura = token.aura || {};
                    document.getElementById('token-aura-active').checked = !!aura.active;
                    document.getElementById('token-aura-size').value = aura.sizeRaw || 20;
                    document.getElementById('token-aura-unit').value = aura.unit || 'ft';
                    document.getElementById('token-aura-size').step = (aura.unit || 'ft') === 'ft' ? '5' : '1.5';
                    document.getElementById('token-aura-color').value = aura.color || '#ffff00';
                    
                    const cond = token.condition || {};
                    document.getElementById('token-condition-active').checked = !!cond.active;
                    document.getElementById('token-condition-type').value = cond.type || 'Accecato,Blinded';
                    document.getElementById('token-condition-lang').value = cond.lang || 'it';
                    document.getElementById('token-condition-color').value = cond.color || '#ff0000';
                }
            } else if (clickedEntity.type === 'shape') {
                engine.selectedShapeId = ent.id;
                document.getElementById('selected-shape-controls').style.display = 'block';
                document.getElementById('shape-edit-unit').value = 'ft';
                document.getElementById('shape-edit-size').step = '5';
                document.getElementById('shape-edit-size').value = Math.round(ent.sizeFt * 10) / 10;
            }
            activeStroke = ent; 
        } else {
            isPanning = true;
            startPanX = pos.x - engine.offsetX;
            startPanY = pos.y - engine.offsetY;
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
    } else if (currentTool.startsWith('fog-')) {
        activeStroke = [worldPos];
        const shape = document.getElementById('fog-brush-shape').value;
        const size = parseInt(document.getElementById('fog-brush-size').value) || 150;
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

    if (!isDragging && !isPanning) {
        if (currentTool.startsWith('fog-')) engine.renderAll();
        return;
    }
    e.preventDefault();

    if (isPanning) {
        engine.offsetX = pos.x - startPanX;
        engine.offsetY = pos.y - startPanY;
        engine.renderAll();
        syncState(); 
        return;
    }

    if (currentTool === 'move' && typeof activeStroke === 'object') {
        if (activeStroke.id && activeStroke.id.startsWith('token_')) {
            activeStroke.x = worldPos.x - activeStroke.width/2;
            activeStroke.y = worldPos.y - activeStroke.height/2;
        } else if (activeStroke.id && activeStroke.id.startsWith('aoe_')) {
            activeStroke.x = worldPos.x;
            activeStroke.y = worldPos.y;
        } else {
            // Nota (non ha id)
            activeStroke.x = worldPos.x;
            activeStroke.y = worldPos.y;
        }
        engine.renderAll();
        syncState(); // Real-time sync for tokens/shapes/notes
    } else if (currentTool === 'move-grid' && activeStroke) {
        engine.grid.offsetX = activeStroke.startOffsetX + (worldPos.x - activeStroke.startWorldX);
        engine.grid.offsetY = activeStroke.startOffsetY + (worldPos.y - activeStroke.startWorldY);
        engine.renderAll();
        // Evitiamo sync continui se risulta pesante, ma su griglia leggera va bene.
        syncState();
    } else if (currentTool === 'ruler') {
        engine.ruler.endX = worldPos.x;
        engine.ruler.endY = worldPos.y;
        engine.renderAll();
    } else if (currentTool.startsWith('draw-')) {
        activeStroke.points.push(worldPos);
        engine.renderAll();
        if (currentTool === 'draw-public') syncState(); // Real-time drawing sync
    } else if (currentTool.startsWith('fog-')) {
        const shape = document.getElementById('fog-brush-shape').value;
        const size = parseInt(document.getElementById('fog-brush-size').value) || 150;
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
    if (!isDragging && !isPanning) return;
    
    if (isPanning) {
        isPanning = false;
        return;
    }

    if (currentTool === 'move' && typeof activeStroke === 'object') {
        // Snap per i token. Le AoE si muovono liberamente e non si "snappano".
        if (activeStroke.id && activeStroke.id.startsWith('token_')) {
            const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
            const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
            
            activeStroke.x = Math.round((activeStroke.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
            activeStroke.y = Math.round((activeStroke.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
        }
        syncState(true);
    } else if (currentTool === 'move-grid') {
        syncState(true);
    } else if (currentTool === 'ruler') {
        engine.ruler = null;
    } else if (currentTool.startsWith('draw-')) {
        syncState();
    } else if (currentTool.startsWith('fog-')) {
        syncFog();
    }

    isDragging = false;
    activeStroke = null;
    engine.renderAll();
}
