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
window.engine = engine;

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

window.VTT_VERSION = 'Beta 1.4';

function updateTokenControlsVisibility(show) {
    const controls = document.getElementById('selected-token-controls');
    const noTok = document.getElementById('no-token-selected-msg');
    if (controls) controls.style.display = show ? 'block' : 'none';
    if (noTok) noTok.style.display = show ? 'none' : 'block';
}

function getTokenOwners(token) {
    if (!token) return [];
    const list = [];
    const seen = new Set();
    const addName = (n) => {
        if (!n || typeof n !== 'string') return;
        const trimmed = n.trim();
        if (!trimmed) return;
        const low = trimmed.toLowerCase();
        if (!seen.has(low)) {
            seen.add(low);
            list.push(trimmed);
        }
    };
    if (Array.isArray(token.owners)) {
        token.owners.forEach(addName);
    } else if (token.owner && typeof token.owner === 'string') {
        addName(token.owner);
    }
    return list;
}

function setTokenOwners(token, ownersArray) {
    if (!token) return;
    const clean = [];
    const seen = new Set();
    (ownersArray || []).forEach(n => {
        if (!n || typeof n !== 'string') return;
        const t = n.trim();
        if (!t) return;
        const low = t.toLowerCase();
        if (!seen.has(low)) {
            seen.add(low);
            clean.push(t);
        }
    });
    token.owners = clean;
    token.owner = clean.length > 0 ? clean[0] : '';
}

function isTokenOwnedBy(token, playerName) {
    if (!token || !playerName) return false;
    const cleanP = String(playerName).trim().toLowerCase();
    if (!cleanP) return false;
    return getTokenOwners(token).some(o => o.toLowerCase() === cleanP);
}

function getSelectedTargetTokens() {
    if (engine.selectedTokens && engine.selectedTokens.size > 0) {
        const list = engine.tokens.filter(t => engine.selectedTokens.has(t.id));
        if (list.length > 0) return list;
    }
    if (engine.selectedTokenId) {
        const single = engine.tokens.find(t => t.id === engine.selectedTokenId);
        if (single) return [single];
    }
    return [];
}
window.getSelectedTargetTokens = getSelectedTargetTokens;
window.getTokenOwners = getTokenOwners;
window.setTokenOwners = setTokenOwners;
window.isTokenOwnedBy = isTokenOwnedBy;

function renderOnlinePlayersList() {
    const div = document.getElementById('online-players');
    if (!div) return;
    const uniqueNames = [];
    const seen = new Set();
    for (let k in network.connections) {
        const entry = network.connections[k];
        if (entry && entry.name) {
            const clean = entry.name.trim();
            const low = clean.toLowerCase();
            if (clean && !seen.has(low)) {
                seen.add(low);
                uniqueNames.push(clean);
            }
        }
    }
    if (uniqueNames.length === 0) {
        div.innerText = "Nessun giocatore connesso.";
    } else {
        div.innerHTML = uniqueNames.map(n => `<div>🟢 ${escapeHTML(n)}</div>`).join('');
    }
}

network.onConnect((playerName, pid, isReconnect) => {
    if (playerName) {
        const cleanJoin = playerName.trim();
        const lowJoin = cleanJoin.toLowerCase();

        // Riallinea il nome su tutti i token, AoE e disegni già assegnati a questo giocatore
        // così se esce e rientra con lo stesso nome conserva tutte le sue assegnazioni!
        engine.tokens.forEach(t => {
            const owners = getTokenOwners(t);
            if (owners.some(o => o.toLowerCase() === lowJoin)) {
                setTokenOwners(t, owners.map(o => o.toLowerCase() === lowJoin ? cleanJoin : o));
            }
        });
        if (engine.shapes) {
            engine.shapes.forEach(s => {
                if (s.owner && s.owner.trim().toLowerCase() === lowJoin) s.owner = cleanJoin;
            });
        }
        if (engine.publicStrokes) {
            engine.publicStrokes.forEach(st => {
                if (st.owner && st.owner.trim().toLowerCase() === lowJoin) st.owner = cleanJoin;
            });
        }

        renderOnlinePlayersList();
        const targets = getSelectedTargetTokens();
        if (targets.length > 0 && typeof window.updateSelectedTokenControls === 'function') {
            window.updateSelectedTokenControls(targets[targets.length - 1]);
        }
        if (typeof showToast === 'function') {
            const pfx = isReconnect
                ? (typeof window.t === 'function' ? window.t('🔄 Giocatore riconnesso:') : '🔄 Giocatore riconnesso:')
                : (typeof window.t === 'function' ? window.t('🟢 Giocatore connesso:') : '🟢 Giocatore connesso:');
            showToast(`${pfx} ${cleanJoin}`);
        }
        // Nota: l'invio di mappa, stato e nebbia avviene in PLAYER_READY mirato solo al nuovo peerId
    }
});

if (typeof network.onDisconnect === 'function') {
    network.onDisconnect((leftName) => {
        renderOnlinePlayersList();
        const targets = getSelectedTargetTokens();
        if (targets.length > 0 && typeof window.updateSelectedTokenControls === 'function') {
            window.updateSelectedTokenControls(targets[targets.length - 1]);
        }
        if (leftName && typeof showToast === 'function') {
            const pfx = typeof window.t === 'function' ? window.t('🔴 Giocatore disconnesso:') : '🔴 Giocatore disconnesso:';
            showToast(`${pfx} ${leftName}`);
        }
    });
}

network.onMessage((data, peerId) => {
    if (data.type === 'PLAYER_READY') {
        if (peerId === 'local' && typeof showToast === 'function') {
            showToast('🟢 Schermo Giocatore Locale connesso!');
        }
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
        const senderName = (peerId === 'local') ? (payload.player || null) : (network.connections[peerId] ? network.connections[peerId].name : null);
        if (token && isTokenOwnedBy(token, senderName)) {
            token.x = payload.x;
            token.y = payload.y;
            engine.requestTokenLayerRender();
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
        const senderName = (peerId === 'local') ? (payload.player || null) : (network.connections[peerId] ? network.connections[peerId].name : null);
        if (token && isTokenOwnedBy(token, senderName)) {
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
            if (window.lastRollId === data.payload?.id) return;
            window.lastRollId = data.payload?.id;
            window.appendRollToChat(data.payload);
            const cp = document.getElementById('chat-panel');
            if (cp) cp.style.display = 'flex';
        }
        // Rimbalza il tiro del giocatore a tutti gli altri giocatori (tranne a chi l'ha inviato)
        if (network.mode === 'host') {
            for (let k in network.connections) {
                if (k !== peerId && network.connections[k].conn) {
                    network.connections[k].conn.send(data);
                }
            }
            if (network.bc && peerId !== 'local') {
                network.bc.postMessage(data);
            }
        } else {
            network.send(data);
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
        if (network.mode === 'host') {
            for (let k in network.connections) {
                if (k !== peerId && network.connections[k].conn) {
                    network.connections[k].conn.send(data);
                }
            }
        }
    } else if (data.type === 'PING') {
        if (!window._lastPeerPingTimes) window._lastPeerPingTimes = new Map();
        const now = Date.now();
        const lastPingTime = window._lastPeerPingTimes.get(peerId) || 0;
        if (now - lastPingTime < 350) return; // Rate-limiting ping per peer
        window._lastPeerPingTimes.set(peerId, now);

        const pingPayload = data.payload || data;
        const pingId = pingPayload.id || (pingPayload.x + '_' + pingPayload.y + '_' + (pingPayload.t || ''));
        if (window.lastReceivedPingId === pingId) return;
        window.lastReceivedPingId = pingId;
        if (engine.pings && engine.pings.length > 20) engine.pings.shift(); // Previene accumulo infinito di ping
        engine.pings.push({id: pingId, x: pingPayload.x, y: pingPayload.y, start: now, color: pingPayload.color || '#ff0000'});
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
            if (network.bc) network.bc.postMessage(data);
        }
    } else if (data.type === 'PLAYER_DRAW') {
        const senderName = (peerId === 'local') ? (data.payload?.owner || 'local') : (network.connections[peerId] ? network.connections[peerId].name : (data.payload?.owner || 'player'));
        if (data.payload) {
            data.payload.owner = senderName;
            if (Array.isArray(data.payload.points) && data.payload.points.length > 5000) {
                data.payload.points = data.payload.points.slice(0, 5000);
            }
            const normSender = senderName.trim().toLowerCase();
            const playerStrokeCount = (engine.publicStrokes || []).filter(st => (st.owner || '').trim().toLowerCase() === normSender).length;
            if (playerStrokeCount >= 150) {
                const oldestIdx = engine.publicStrokes.findIndex(st => (st.owner || '').trim().toLowerCase() === normSender);
                if (oldestIdx !== -1) engine.publicStrokes.splice(oldestIdx, 1);
            }
            engine.publicStrokes.push(data.payload);
            engine.renderAll();
            syncState(true);
        }
    } else if (data.type === 'PLAYER_CLEAR_DRAWINGS') {
        const senderName = (peerId === 'local') ? (data.payload?.owner || 'local') : (network.connections[peerId] ? network.connections[peerId].name : (data.payload?.owner || ''));
        if (senderName) {
            const normSender = String(senderName).trim().toLowerCase();
            engine.publicStrokes = (engine.publicStrokes || []).filter(st => {
                const stOwner = (st.owner || '').trim().toLowerCase();
                return stOwner !== normSender;
            });
            engine.renderAll();
            syncState(true);
        }
    } else if (data.type === 'PLAYER_ADD_SHAPE') {
        const senderName = (peerId === 'local') ? (data.payload?.owner || 'local') : (network.connections[peerId] ? network.connections[peerId].name : null);
        if (!senderName) return;
        const normSender = senderName.trim().toLowerCase();
        const playerShapeCount = (engine.shapes || []).filter(sh => (sh.owner || '').trim().toLowerCase() === normSender).length;
        if (playerShapeCount >= 20) {
            console.warn(`Quota sagome raggiunta per ${senderName}`);
            return;
        }
        if (data.payload) {
            data.payload.owner = senderName;

            // Se non ha ancora casterTokenId/casterName completi, collegalo al token del giocatore se esistente
            if (!data.payload.casterTokenId && engine.tokens && engine.tokens.length > 0) {
                const myTok = engine.tokens.find(t => isTokenOwnedBy(t, senderName) || (t.name && (t.name.trim().toLowerCase() === normSender || t.name.trim().toLowerCase().startsWith(normSender + ' '))));
                if (myTok) {
                    data.payload.casterTokenId = myTok.id;
                    if (!data.payload.casterName || data.payload.casterName === senderName) {
                        data.payload.casterName = myTok.name;
                    }
                }
            }

            // Se in combattimento ed è il turno del giocatore/incantatore:
            if (engine.initiative && engine.initiative.active && engine.initiative.participants && engine.initiative.participants.length > 0) {
                const curP = engine.initiative.participants[engine.initiative.currentTurnIndex];
                if (curP) {
                    const curName = (curP.name || '').trim().toLowerCase();
                    const sCasterName = (data.payload.casterName || '').trim().toLowerCase();
                    const curTok = curP.tokenId ? engine.tokens.find(t => String(t.id).replace(/^tok_/, '') === String(curP.tokenId).replace(/^tok_/, '')) : null;
                    const isCurOwned = curTok ? isTokenOwnedBy(curTok, senderName) : false;
                    const sTokId = data.payload.casterTokenId ? String(data.payload.casterTokenId).replace(/^tok_/, '') : null;
                    const pTokId = curP.tokenId ? String(curP.tokenId).replace(/^tok_/, '') : null;
                    
                    if (isCurOwned || (sTokId && pTokId && sTokId === pTokId) ||
                        (curName && (curName === normSender || curName.startsWith(normSender + ' ') || curName.includes(normSender) ||
                                     curName === sCasterName || curName.startsWith(sCasterName + ' ') || curName.includes(sCasterName)))) {
                        data.payload.skipFirstDecrement = true;
                        data.payload.casterInitiativeId = curP.id;
                        if (!data.payload.casterTokenId && curP.tokenId) {
                            data.payload.casterTokenId = curP.tokenId;
                        }
                        if (!data.payload.casterName || data.payload.casterName === senderName || data.payload.casterName === 'Giocatore') {
                            data.payload.casterName = curP.name;
                        }
                    }
                }
            }

            engine.shapes.push(data.payload);
            engine.renderAll();
            syncState(true);
        }
    } else if (data.type === 'PLAYER_MOVE_SHAPE') {
        const senderName = (peerId === 'local') ? (data.payload?.player || 'local') : (network.connections[peerId] ? network.connections[peerId].name : null);
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s && (peerId === 'local' || !s.owner || (senderName && s.owner.toLowerCase() === senderName.toLowerCase()))) {
            s.x = data.payload.x;
            s.y = data.payload.y;
            engine.requestTokenLayerRender();
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
        const senderName = (peerId === 'local') ? (data.payload?.player || 'local') : (network.connections[peerId] ? network.connections[peerId].name : null);
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s && (peerId === 'local' || !s.owner || (senderName && s.owner.toLowerCase() === senderName.toLowerCase()))) {
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
        const senderName = (peerId === 'local') ? (data.payload?.player || data.payload?.owner || 'local') : (network.connections[peerId] ? network.connections[peerId].name : null);
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s && (peerId === 'local' || !s.owner || (senderName && s.owner.toLowerCase() === senderName.toLowerCase()))) {
            s.sizeFt = data.payload.sizeFt;
            if (data.payload.widthFt !== undefined) s.widthFt = data.payload.widthFt;
            s.angle = data.payload.angle;
            s.color = data.payload.color;
            if (data.payload.highlightTokens !== undefined) s.highlightTokens = data.payload.highlightTokens;
            if (data.payload.durationRounds !== undefined) {
                s.durationRounds = data.payload.durationRounds;
                s.roundsLeft = data.payload.roundsLeft;
            }
            if (data.payload.casterName !== undefined) s.casterName = data.payload.casterName;
            if (data.payload.casterTokenId !== undefined) s.casterTokenId = data.payload.casterTokenId;
            if (data.payload.casterInitiativeId !== undefined) s.casterInitiativeId = data.payload.casterInitiativeId;

            if (data.payload.skipFirstDecrement !== undefined) {
                s.skipFirstDecrement = data.payload.skipFirstDecrement;
            }

            // Se in combattimento ed è stato impostato un timer durante il proprio turno:
            if (s.durationRounds > 0 && engine.initiative && engine.initiative.active && engine.initiative.participants && engine.initiative.participants.length > 0) {
                const curP = engine.initiative.participants[engine.initiative.currentTurnIndex];
                if (curP) {
                    const normSender = senderName ? senderName.trim().toLowerCase() : '';
                    const curName = (curP.name || '').trim().toLowerCase();
                    const sCasterName = (s.casterName || data.payload.casterName || '').trim().toLowerCase();
                    const curTok = curP.tokenId ? engine.tokens.find(t => String(t.id).replace(/^tok_/, '') === String(curP.tokenId).replace(/^tok_/, '')) : null;
                    const isCurOwned = (curTok && senderName) ? isTokenOwnedBy(curTok, senderName) : false;
                    const sTokId = s.casterTokenId ? String(s.casterTokenId).replace(/^tok_/, '') : null;
                    const pTokId = curP.tokenId ? String(curP.tokenId).replace(/^tok_/, '') : null;
                    
                    if (isCurOwned || (sTokId && pTokId && sTokId === pTokId) ||
                        (s.casterInitiativeId && String(s.casterInitiativeId) === String(curP.id)) ||
                        (curName && (curName === normSender || curName.startsWith(normSender + ' ') || curName.includes(normSender) ||
                                     curName === sCasterName || curName.startsWith(sCasterName + ' ') || curName.includes(sCasterName)))) {
                        s.skipFirstDecrement = true;
                        s.casterInitiativeId = curP.id;
                        if (!s.casterTokenId && curP.tokenId) {
                            s.casterTokenId = curP.tokenId;
                        }
                        if (!s.casterName || s.casterName === senderName || s.casterName === 'Giocatore') {
                            s.casterName = curP.name;
                        }
                    }
                }
            } else if (s.durationRounds === 0) {
                delete s.skipFirstDecrement;
                delete s.roundsLeft;
                delete s.casterInitiativeId;
            }

            engine.renderAll();
            syncState(true);
        }
    } else if (data.type === 'PLAYER_DELETE_SHAPE') {
        const senderName = (peerId === 'local') ? (data.payload?.player || 'local') : (network.connections[peerId] ? network.connections[peerId].name : null);
        const s = engine.shapes.find(x => x.id === data.payload.id);
        if (s && (peerId === 'local' || !s.owner || (senderName && s.owner.toLowerCase() === senderName.toLowerCase()))) {
            engine.shapes = engine.shapes.filter(x => x.id !== data.payload.id);
            engine.renderAll();
            syncState(true);
        }
    } else if (data.type === 'PLAYER_UPDATE_TOKEN_AURA') {
        const token = engine.tokens.find(t => t.id === data.payload.id);
        const senderName = (peerId === 'local') ? (data.payload.player || null) : (network.connections[peerId] ? network.connections[peerId].name : null);
        if (token && isTokenOwnedBy(token, senderName)) {
            token.aura = data.payload.auraObj;
            if (engine.initiative && engine.initiative.active && engine.initiative.participants && engine.initiative.participants.length > 0) {
                const curP = engine.initiative.participants[engine.initiative.currentTurnIndex];
                if (curP && (String(curP.tokenId) === String(token.id) || (curP.name && token.name && curP.name.trim().toLowerCase() === token.name.trim().toLowerCase()))) {
                    if (token.aura && token.aura.active && token.aura.durationRounds > 0) {
                        token.aura.skipFirstDecrement = true;
                    }
                }
            }
            engine.renderAll();
            syncState(true);
        }
    } else if (data.type === 'REQUEST_PC_SHEET') {
        const token = engine.tokens.find(t => t.id === data.tokenId);
        if (token) {
            network.send({
                type: 'PC_SHEET_SYNC',
                payload: {
                    tokenId: token.id,
                    pcSheet: token.pcSheet || null,
                    adventureJournal: token.adventureJournal || ''
                }
            }, peerId);
        }
    } else if (data.type === 'PLAYER_UPDATE_PC_SHEET') {
        const payload = data.payload || {};
        const token = engine.tokens.find(t => t.id === payload.tokenId);
        const senderName = (peerId === 'local') ? (payload.player || null) : (network.connections[peerId] ? network.connections[peerId].name : null);
        if (token && (peerId === 'local' || (senderName && isTokenOwnedBy(token, senderName)))) {
            if (payload.pcSheet) {
                token.pcSheet = payload.pcSheet;
                token.pcSheet.updatedAt = Date.now();
            }
            if (payload.adventureJournal !== undefined) {
                token.adventureJournal = payload.adventureJournal;
            }
            if (payload.hpMax !== undefined && payload.hpMax > 0) token.hpMax = payload.hpMax;
            if (payload.hpCurrent !== undefined) token.hpCurrent = payload.hpCurrent;
            if (payload.ac !== undefined && payload.ac > 0) token.ac = payload.ac;

            if (engine.initiative && Array.isArray(engine.initiative.participants)) {
                const p = engine.initiative.participants.find(x => x.tokenId === token.id);
                if (p) {
                    p.hpCurrent = token.hpCurrent;
                    p.hpMax = token.hpMax;
                    p.ac = token.ac;
                }
                if (typeof renderTrackerList === 'function') renderTrackerList();
            }
            if (engine.selectedTokenId === token.id && typeof window.updateSelectedTokenControls === 'function') {
                window.updateSelectedTokenControls(token);
            }
            upsertTokenInCampaign(token);
            if (window.pcSheetManager) window.pcSheetManager.refreshIfOpen(token.id);
            engine.renderTokensLayer();
            window.broadcastPcSheetSync(token);
            syncState(true, false);
        }
    } else if (data.type === 'PLAYER_UPDATE_TOKEN_JOURNAL') {
        const payload = data.payload || {};
        const token = engine.tokens.find(t => t.id === payload.tokenId);
        const senderName = (peerId === 'local') ? (payload.player || null) : (network.connections[peerId] ? network.connections[peerId].name : null);
        if (token && (peerId === 'local' || (senderName && isTokenOwnedBy(token, senderName)))) {
            token.adventureJournal = payload.adventureJournal || '';
            token.adventureJournalUpdatedAt = Date.now();
            if (token.pcSheet) token.pcSheet.adventureJournal = token.adventureJournal;
            upsertTokenInCampaign(token);
            if (window.pcSheetManager) window.pcSheetManager.refreshIfOpen(token.id);
            window.broadcastPcSheetSync(token);
            syncState(true, false);
        }
    }
});


let currentTool = 'move';
let isDragging = false;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let activeStroke = null;
let activeStrokeType = null;
let activeLaser = null;
let lastLaserSync = 0;
let tokenImages = {};
let currentMapBase64 = null;
let isMapDirty = false;
let isSuppressingDirty = false;

window.markMapDirty = function(dirty = true) {
    if (isSuppressingDirty && dirty) return;
    if (isMapDirty === dirty) return;
    isMapDirty = dirty;
    updateLoadedMapIndicator();
};

// Blocco chiusura scheda browser se ci sono modifiche alla mappa non salvate
window.addEventListener('beforeunload', (e) => {
    if (isMapDirty && currentMapBase64) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

let lastClickedTokenId = null;
let lastClickedTokenTime = 0;
let lastStatblockOpenTime = 0;
let clickedTokenForInteraction = null;
let clickedShapeForInteraction = null;


window.getSmartTokenName = function(t) {
    if (t.name) return t.name;
    if (t.owner) return t.owner;
    let baseName = t.originalName || 'Mostro';
    baseName = baseName.replace(/\.[^/.]+$/, ""); // Rimuove l'estensione (es. .jpg)
    if (t.category === 'personaggi' || t.category === 'png') {
        return baseName.replace(/\s+1$/, '').trim() || baseName;
    }
    
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
let isHideToolbarActive = document.getElementById('hide-toolbar-toggle')?.checked || false;
const hideToolbarBtn = document.getElementById('hide-toolbar-toggle');
if (hideToolbarBtn) {
    hideToolbarBtn.addEventListener('change', (e) => {
        isHideToolbarActive = e.target.checked;
        syncState(true);
    });
}

let isSyncHandoutActive = false;
const syncHandoutBtn = document.getElementById('sync-handout-toggle');
const dmHandoutSyncCheckbox = document.getElementById('dm-handout-sync-checkbox');

function getDmHandoutRect() {
    const el = document.getElementById('dm-handout-window');
    const mapEl = document.getElementById('main-canvas-container');
    if (!el) {
        return {
            left: '100px', top: '100px', width: '500px', height: '500px',
            offsetX: 100, offsetY: 100, ratioX: 0.5, ratioY: 0.5
        };
    }
    const rect = el.getBoundingClientRect();
    const mapRect = mapEl ? mapEl.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

    const w = Math.round(rect.width) || 500;
    const h = Math.round(rect.height) || 500;

    // Coordinate relative all'area effettiva della mappa (escludendo la sidebar)
    const offsetX = Math.round(rect.left - mapRect.left);
    const offsetY = Math.round(rect.top - mapRect.top);

    // Spazio disponibile nella mappa
    const availW = mapRect.width - w;
    const availH = mapRect.height - h;

    const ratioX = availW > 0 ? (offsetX / availW) : 0.5;
    const ratioY = availH > 0 ? (offsetY / availH) : 0.5;

    return {
        left: Math.round(rect.left) + 'px',
        top: Math.round(rect.top) + 'px',
        width: w + 'px',
        height: h + 'px',
        offsetX: offsetX,
        offsetY: offsetY,
        ratioX: Math.max(0, Math.min(1, ratioX)),
        ratioY: Math.max(0, Math.min(1, ratioY)),
        mapWidth: Math.round(mapRect.width),
        mapHeight: Math.round(mapRect.height)
    };
}

function setSyncHandoutState(val) {
    isSyncHandoutActive = !!val;
    if (syncHandoutBtn) syncHandoutBtn.checked = isSyncHandoutActive;
    if (dmHandoutSyncCheckbox) dmHandoutSyncCheckbox.checked = isSyncHandoutActive;
    if (engine.sharedImageId) {
        network.send({
            type: 'HANDOUT_RECT_LIVE',
            payload: {
                ...getDmHandoutRect(),
                syncHandout: isSyncHandoutActive
            }
        });
    }
    syncState(true);
}

if (syncHandoutBtn) {
    syncHandoutBtn.addEventListener('change', (e) => {
        setSyncHandoutState(e.target.checked);
    });
}
if (dmHandoutSyncCheckbox) {
    dmHandoutSyncCheckbox.addEventListener('change', (e) => {
        setSyncHandoutState(e.target.checked);
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
let currentCampaignTokens = [];
let campaignTokensSaveTimer = null;
let currentTokenTab = 'map';

vttDB.init().then(async () => {
    try {
        savedTokensLibrary = await vttDB.getTokens() || [];
        if (typeof updateLibraryGallery === 'function') updateLibraryGallery();
    } catch (e) {
        console.warn("Libreria token:", e);
    }
    await refreshCampaigns(true);
});

let lastSyncTime = 0;
let syncTimeout = null;
const syncedTokenImageIds = new Set();
const syncedImageKeys = new Set();
const syncedPcSheetVers = new Map();
const compressedTokenSrcByKey = new Map();
let cachedNetworkMapSource = null;
let cachedNetworkMapOutput = null;

window.broadcastPcSheetSync = function(token, targetPeerId = null) {
    if (!token) return;
    const sVer = token.pcSheet ? (token.pcSheet.updatedAt || 1) : 1;
    const jVer = token.adventureJournalUpdatedAt || 1;
    syncedPcSheetVers.set(token.id, `${sVer}_${jVer}`);
    network.send({
        type: 'PC_SHEET_SYNC',
        payload: {
            tokenId: token.id,
            pcSheet: token.pcSheet || null,
            adventureJournal: token.adventureJournal || ''
        }
    }, targetPeerId);
};

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
        if (!isSuppressingDirty && currentMapBase64) {
            markMapDirty(true);
        }
    }

    if (sendFullImages && !targetPeerId) {
        syncedTokenImageIds.clear();
        syncedImageKeys.clear();
        syncedPcSheetVers.clear();
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
    const pcSheetsToSendAfterState = [];
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

        const sheetVer = t.pcSheet ? (t.pcSheet.updatedAt || 1) : 0;
        const jVer = t.adventureJournalUpdatedAt || 1;
        const combKey = `${sheetVer}_${jVer}`;
        if (t.pcSheet || t.adventureJournal) {
            const needSheetSend = sendFullImages || !!targetPeerId || syncedPcSheetVers.get(t.id) !== combKey;
            if (needSheetSend) {
                pcSheetsToSendAfterState.push({
                    tokenId: t.id,
                    pcSheet: t.pcSheet || null,
                    adventureJournal: t.adventureJournal || ''
                });
                if (!targetPeerId) syncedPcSheetVers.set(t.id, combKey);
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
            owners: getTokenOwners(t),
            hasPcSheet: !!t.pcSheet,
            pcSheetVer: sheetVer,
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
            syncHandout: typeof isSyncHandoutActive !== 'undefined' ? isSyncHandoutActive : false,
            sharedImageRect: getDmHandoutRect()
        }
    }, targetPeerId);

    // Invia le immagini nuove/mancanti e le schede PG in pacchetti separati per non bloccare mai STATE_SYNC
    if (imagesToSendAfterState.length > 0) {
        imagesToSendAfterState.forEach(item => {
            network.send({
                type: 'TOKEN_IMAGE_SYNC',
                payload: item
            }, targetPeerId);
        });
    }
    if (pcSheetsToSendAfterState.length > 0) {
        pcSheetsToSendAfterState.forEach(item => {
            network.send({
                type: 'PC_SHEET_SYNC',
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
        const wasDirty = isMapDirty;
        isSuppressingDirty = true;
        syncState(true, true);
        const mapPayload = getNetworkMapPayload();
        if (mapPayload) {
            network.send({ type: 'MAP_UPDATE', payload: mapPayload });
        }
        syncFog();
        isSuppressingDirty = false;
        if (!wasDirty) {
            markMapDirty(false);
        }
    }, 600);
});

// Load Map
const mapUploadEl = document.getElementById('map-upload');
if (mapUploadEl) {
    mapUploadEl.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            checkUnsavedMapChanges(() => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    currentMapBase64 = ev.target.result;
                    const img = new Image();
                    img.onload = () => {
                        gridResizeBaseline = null;
                        engine.setMap(img);
                        network.send({ type: 'MAP_UPDATE', payload: getNetworkMapPayload() });
                        syncState(true, true);
                        syncFog();
                        const cleanMapName = file.name.replace(/\.[^/.]+$/, "");
                        currentLoadedMapId = null;
                        currentLoadedMapName = cleanMapName;
                        markMapDirty(true);
                        if (typeof showToast === 'function') {
                            const pfx = typeof window.t === 'function' ? window.t('🗺️ Mappa caricata:') : '🗺️ Mappa caricata:';
                            showToast(`${pfx} "${cleanMapName}"`);
                        }
                    };
                    img.src = currentMapBase64;
                };
                reader.readAsDataURL(file);
            });
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

async function refreshCampaigns(autoSelectLast = false) {
    const campaigns = await vttDB.getCampaigns();
    const select = document.getElementById('campaign-select');
    const prevValue = select.value || (autoSelectLast ? (localStorage.getItem('vtt_last_campaign_id') || '') : '');
    select.innerHTML = '<option value="">-- Seleziona Campagna --</option>';
    campaigns.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id; opt.textContent = c.name;
        select.appendChild(opt);
    });
    if (prevValue && campaigns.some(c => c.id === prevValue)) {
        select.value = prevValue;
        currentCampaignId = prevValue;
        document.getElementById('map-manager').style.display = 'block';
        await refreshFolders(prevValue);
        await refreshMaps(prevValue, currentLoadedMapId || "");
        await loadCampaignTokensFor(prevValue);
    } else if (autoSelectLast && campaigns.length > 0 && !select.value) {
        const firstId = campaigns[0].id;
        select.value = firstId;
        currentCampaignId = firstId;
        localStorage.setItem('vtt_last_campaign_id', firstId);
        document.getElementById('map-manager').style.display = 'block';
        await refreshFolders(firstId);
        await refreshMaps(firstId, currentLoadedMapId || "");
        await loadCampaignTokensFor(firstId);
    } else {
        currentCampaignId = select.value || '';
        await loadCampaignTokensFor(select.value || '');
    }
}

document.getElementById('btn-new-campaign').addEventListener('click', async () => {
    const name = prompt('Nome della nuova campagna:');
    if (name) {
        const newCamp = await vttDB.addCampaign(name);
        localStorage.setItem('vtt_last_campaign_id', newCamp.id);
        await refreshCampaigns(true);
    }
});

document.getElementById('btn-delete-campaign').addEventListener('click', async () => {
    const id = document.getElementById('campaign-select').value;
    if (id && confirm('Eliminare questa campagna?')) {
        await vttDB.deleteCampaign(id);
        if (localStorage.getItem('vtt_last_campaign_id') === id) {
            localStorage.removeItem('vtt_last_campaign_id');
        }
        currentSelectedFolder = "";
        currentLoadedMapId = null;
        currentLoadedMapName = "";
        updateLoadedMapIndicator();
        document.getElementById('map-manager').style.display = 'none';
        await refreshCampaigns(true);
    }
});

let currentCampaignId = "";
let currentLoadedMapId = null;
let currentLoadedMapName = "";
let currentSelectedFolder = "";
let pingTimeout = null;
let startMouseX = 0;
let startMouseY = 0;
let selectedNote = null;
let pendingDeselect = false;

function updateLoadedMapIndicator() {
    const badge = document.getElementById('current-loaded-map-badge');
    const saveBtn = document.getElementById('btn-save-map');
    if (badge) {
        if (currentLoadedMapName) {
            if (isMapDirty) {
                badge.textContent = `🟡 In uso: ${currentLoadedMapName} * (Non salvata)`;
                badge.style.color = '#ffb74d';
                badge.title = `Ci sono modifiche non salvate su "${currentLoadedMapName}"!`;
            } else {
                badge.textContent = `🟢 In uso: ${currentLoadedMapName}`;
                badge.style.color = '#4caf50';
                badge.title = `Mappa sincronizzata e salvata nel database`;
            }
            badge.style.display = 'inline';
        } else if (currentMapBase64 && isMapDirty) {
            badge.textContent = `🟡 Nuova Mappa * (Non salvata)`;
            badge.style.color = '#ffb74d';
            badge.title = `Mappa caricata ma non ancora salvata nel database`;
            badge.style.display = 'inline';
        } else {
            badge.textContent = '';
            badge.style.display = 'none';
        }
    }
    if (saveBtn) {
        if (currentLoadedMapName) {
            saveBtn.title = isMapDirty 
                ? `⚠️ Salva le modifiche non salvate su "${currentLoadedMapName}"` 
                : `Salva le modifiche su "${currentLoadedMapName}"`;
        } else {
            saveBtn.title = `Salva le modifiche alla mappa`;
        }
        if (isMapDirty) {
            saveBtn.style.boxShadow = '0 0 8px rgba(255, 183, 77, 0.7)';
            saveBtn.style.border = '1px solid #ffd54f';
        } else {
            saveBtn.style.boxShadow = 'none';
            saveBtn.style.border = 'none';
        }
    }
}

document.getElementById('campaign-select').addEventListener('change', async (e) => {
    const id = e.target.value;
    const oldCampaignId = currentCampaignId;
    checkUnsavedMapChanges(async () => {
        currentCampaignId = id;
        currentSelectedFolder = "";
        if (id) {
            localStorage.setItem('vtt_last_campaign_id', id);
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
            await loadCampaignTokensFor(id);
            markMapDirty(false);
            updateLoadedMapIndicator();
        } else {
            document.getElementById('map-manager').style.display = 'none';
            currentLoadedMapId = null;
            currentLoadedMapName = "";
            await loadCampaignTokensFor('');
            markMapDirty(false);
            updateLoadedMapIndicator();
        }
    }, () => {
        if (oldCampaignId !== undefined) {
            e.target.value = oldCampaignId;
        }
    });
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


function getEngineMapState() {
    return {
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
}

async function performSaveNewMap() {
    const campaignId = document.getElementById('campaign-select')?.value;
    if (!campaignId) {
        alert('Seleziona una campagna dal menu a tendina prima di salvare!');
        return false;
    }
    if (!currentMapBase64) {
        alert('Devi caricare una mappa prima di poterla salvare!');
        return false;
    }

    const defaultName = currentLoadedMapName ? `${currentLoadedMapName} (Copia)` : 'Nuova Mappa';
    const name = prompt('Nome di questo nuovo salvataggio (es. "Taverna - Inizio Combattimento"):', defaultName);
    if (!name) return false;

    const state = getEngineMapState();
    const targetFolder = (currentSelectedFolder && currentSelectedFolder !== '__none__') ? currentSelectedFolder : "";
    const savedMap = await vttDB.saveMap(campaignId, name, currentMapBase64, state, null, targetFolder);
    currentLoadedMapId = savedMap.id;
    currentLoadedMapName = savedMap.name;
    await refreshMaps(campaignId, savedMap.id);
    markMapDirty(false);
    updateLoadedMapIndicator();
    if (typeof showToast === 'function') {
        const pfx = typeof window.t === 'function' ? window.t('💾 Nuova mappa salvata:') : '💾 Nuova mappa salvata:';
        showToast(`${pfx} "${savedMap.name}"` + (targetFolder ? ` (${targetFolder})` : ''));
    }
    return true;
}

async function performOverwriteMap() {
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
        return performSaveNewMap();
    }

    let campaignId = document.getElementById('campaign-select')?.value;
    const existingMap = await vttDB.getMap(currentLoadedMapId);
    if (existingMap && existingMap.campaignId) {
        campaignId = existingMap.campaignId;
    }
    if (!campaignId) {
        alert('Seleziona una campagna!');
        return false;
    }
    if (!currentMapBase64) return false;

    const state = getEngineMapState();
    await vttDB.saveMap(campaignId, currentLoadedMapName, currentMapBase64, state, currentLoadedMapId);
    await refreshMaps(campaignId, currentLoadedMapId);
    markMapDirty(false);
    updateLoadedMapIndicator();
    const btn = document.getElementById('btn-save-map');
    if (btn) {
        const oldText = btn.innerText;
        btn.innerText = 'Salvato!';
        setTimeout(() => btn.innerText = oldText, 1500);
    }
    if (typeof showToast === 'function') {
        const pfx = typeof window.t === 'function' ? window.t('💾 Mappa salvata:') : '💾 Mappa salvata:';
        showToast(`${pfx} "${currentLoadedMapName}"`);
    }
    return true;
}

function checkUnsavedMapChanges(onProceed, onCancel = null) {
    if (!isMapDirty || !currentMapBase64) {
        onProceed();
        return;
    }

    const modal = document.getElementById('modal-unsaved-map');
    const textEl = document.getElementById('modal-unsaved-map-text');
    const btnOverwrite = document.getElementById('btn-unsaved-overwrite');
    const btnSaveNew = document.getElementById('btn-unsaved-save-new');
    const btnDiscard = document.getElementById('btn-unsaved-discard');
    const btnCancel = document.getElementById('btn-unsaved-cancel');

    if (!modal || !btnSaveNew || !btnDiscard || !btnCancel) {
        if (confirm(`Ci sono modifiche non salvate alla mappa "${currentLoadedMapName || 'attuale'}"!\nVuoi salvare prima di procedere?`)) {
            performOverwriteMap().then(saved => {
                if (saved) onProceed();
                else if (typeof onCancel === 'function') onCancel();
            });
        } else {
            markMapDirty(false);
            onProceed();
        }
        return;
    }

    const mapName = currentLoadedMapName || 'Mappa attuale';
    if (currentLoadedMapId) {
        if (textEl) {
            textEl.innerHTML = `Ci sono modifiche non salvate su <b>"${mapName}"</b>.<br>Vuoi sovrascrivere il salvataggio esistente, salvarne una nuova copia o eliminare le modifiche?`;
        }
        if (btnOverwrite) {
            btnOverwrite.style.display = 'inline-block';
            btnOverwrite.innerHTML = `💾 Sovrascrivi "${mapName}"`;
        }
        if (btnSaveNew) {
            btnSaveNew.innerHTML = `➕ Salva come Nuova`;
        }
    } else {
        if (textEl) {
            textEl.innerHTML = `Questa mappa ha delle modifiche non salvate.<br>Vuoi salvarla come nuova mappa nella campagna prima di procedere?`;
        }
        if (btnOverwrite) {
            btnOverwrite.style.display = 'none';
        }
        if (btnSaveNew) {
            btnSaveNew.innerHTML = `💾 Salva Nuova Mappa`;
        }
    }

    modal.style.display = 'flex';

    const cleanup = () => {
        modal.style.display = 'none';
        if (btnOverwrite) btnOverwrite.onclick = null;
        btnSaveNew.onclick = null;
        btnDiscard.onclick = null;
        btnCancel.onclick = null;
    };

    if (btnOverwrite) {
        btnOverwrite.onclick = async () => {
            cleanup();
            const saved = await performOverwriteMap();
            if (saved) {
                onProceed();
            } else if (typeof onCancel === 'function') {
                onCancel();
            }
        };
    }

    btnSaveNew.onclick = async () => {
        cleanup();
        const saved = await performSaveNewMap();
        if (saved) {
            onProceed();
        } else if (typeof onCancel === 'function') {
            onCancel();
        }
    };

    btnDiscard.onclick = () => {
        cleanup();
        markMapDirty(false);
        onProceed();
    };

    btnCancel.onclick = () => {
        cleanup();
        if (typeof onCancel === 'function') {
            onCancel();
        }
    };
}

document.getElementById('btn-save-new-map').addEventListener('click', async () => {
    await performSaveNewMap();
});

document.getElementById('btn-save-map').addEventListener('click', async () => {
    await performOverwriteMap();
});

document.getElementById('btn-load-map').addEventListener('click', async () => {
    const select = document.getElementById('map-select');
    const targetMapId = select ? select.value : null;
    if (!targetMapId) return alert('Seleziona una mappa da caricare!');
    
    // Se la mappa selezionata è già quella attualmente caricata e non ci sono modifiche non salvate
    if (targetMapId === currentLoadedMapId && !isMapDirty) {
        return;
    }

    const prevMapId = currentLoadedMapId;

    checkUnsavedMapChanges(async () => {
        const mapData = await vttDB.getMap(targetMapId);
        if (!mapData) return alert('Impossibile leggere la mappa dal database.');
        
        isSuppressingDirty = true;
        currentLoadedMapId = mapData.id;
        currentLoadedMapName = mapData.name;
        if (select) {
            select.value = mapData.id;
        }
        updateLoadedMapIndicator();
        
        currentMapBase64 = mapData.mapImageBase64;
        const state = mapData.state;

        const img = new Image();
        img.onload = () => {
            gridResizeBaseline = null;
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

            if (state.fogBase64) {
                engine.applyFogImage(state.fogBase64);
                setTimeout(() => { syncFog(); }, 150);
            } else {
                engine.clearFog();
                syncFog();
            }

            const finishLoadingMap = () => {
                syncCampaignPlayerCharactersToMap();
                engine.renderAll();
                syncState(true, true);
                if (typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none') {
                    updateMapTokensGallery();
                }
                isSuppressingDirty = false;
                markMapDirty(false);
                updateLoadedMapIndicator();
                if (select) {
                    select.value = mapData.id;
                }
            };

            if (state.tokens && state.tokens.length > 0) {
                engine.tokens = []; // svuota i token vecchi
                let loadedTokensCount = 0;
                const totalToLoad = state.tokens.length;
                const finalizeLoadedTokens = () => {
                    loadedTokensCount++;
                    if (loadedTokensCount === totalToLoad) {
                        finishLoadingMap();
                    }
                };
                state.tokens.forEach(t => {
                    if (t.statblock && t.statblock._raw && t.statblock._raw.tokenSrc) {
                        delete t.statblock._raw.tokenSrc;
                    }
                    const tImg = new Image();
                    tImg.onload = () => {
                        t.imageObj = tImg;
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
                finishLoadingMap();
            }
            
            network.send({ type: 'MAP_UPDATE', payload: getNetworkMapPayload() });
            if (typeof showToast === 'function') {
                const pfx = typeof window.t === 'function' ? window.t('🗺️ Mappa caricata:') : '🗺️ Mappa caricata:';
                showToast(`${pfx} "${mapData.name}"`);
            }
        };
        img.src = currentMapBase64;
    }, () => {
        if (select && prevMapId) {
            select.value = prevMapId;
        }
    });
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
            markMapDirty(false);
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

// Gestione Ancoraggio Oggetti alla Griglia
const cbGridAnchor = document.getElementById('grid-anchor-objects');
const cbMapGridAnchor = document.getElementById('map-grid-anchor-objects');

function syncGridAnchorCheckboxes(val) {
    if (cbGridAnchor) cbGridAnchor.checked = val;
    if (cbMapGridAnchor) cbMapGridAnchor.checked = val;
}
if (cbGridAnchor) {
    cbGridAnchor.addEventListener('change', (e) => syncGridAnchorCheckboxes(e.target.checked));
}
if (cbMapGridAnchor) {
    cbMapGridAnchor.addEventListener('change', (e) => syncGridAnchorCheckboxes(e.target.checked));
}

let gridResizeBaseline = null;

function createGridResizeBaseline() {
    const baseSize = engine.grid.size || 50;
    const baseOffsetX = (engine.grid.offsetX || 0);
    const baseOffsetY = (engine.grid.offsetY || 0);
    const effBaseX = baseOffsetX % baseSize;
    const effBaseY = baseOffsetY % baseSize;

    return {
        baseSize,
        baseOffsetX,
        baseOffsetY,
        tokens: engine.tokens.map(t => {
            const mult = t.sizeMultiplier || 1;
            const col = (t.x - effBaseX) / baseSize;
            const row = (t.y - effBaseY) / baseSize;
            return {
                token: t,
                col: col,
                row: row,
                origX: t.x,
                origY: t.y,
                sizeMultiplier: mult
            };
        }),
        shapes: (engine.shapes || []).map(s => {
            return {
                shape: s,
                col: (s.x - effBaseX) / baseSize,
                row: (s.y - effBaseY) / baseSize,
                origX: s.x,
                origY: s.y
            };
        }),
        notes: (engine.notes || []).map(n => {
            return {
                note: n,
                col: (n.x - effBaseX) / baseSize,
                row: (n.y - effBaseY) / baseSize,
                origX: n.x,
                origY: n.y
            };
        })
    };
}

function updateGrid() {
    const newSize = parseInt(document.getElementById('grid-size').value) || 50;
    engine.grid.size = newSize;
    engine.grid.color = document.getElementById('grid-color').value;
    engine.grid.glow = document.getElementById('grid-glow').value;

    if (!gridResizeBaseline) {
        gridResizeBaseline = createGridResizeBaseline();
    }

    const isAnchor = document.getElementById('grid-anchor-objects')?.checked !== false;
    const effNewOffsetX = (engine.grid.offsetX || 0) % newSize;
    const effNewOffsetY = (engine.grid.offsetY || 0) % newSize;

    if (isAnchor && gridResizeBaseline) {
        gridResizeBaseline.tokens.forEach(item => {
            const t = item.token;
            t.width = newSize * item.sizeMultiplier;
            t.height = newSize * item.sizeMultiplier;
            t.x = effNewOffsetX + item.col * newSize;
            t.y = effNewOffsetY + item.row * newSize;
        });

        gridResizeBaseline.shapes.forEach(item => {
            const s = item.shape;
            s.x = effNewOffsetX + item.col * newSize;
            s.y = effNewOffsetY + item.row * newSize;
        });

        gridResizeBaseline.notes.forEach(item => {
            const n = item.note;
            n.x = effNewOffsetX + item.col * newSize;
            n.y = effNewOffsetY + item.row * newSize;
        });
    } else {
        engine.tokens.forEach(t => {
            if (t.sizeMultiplier) {
                t.width = newSize * t.sizeMultiplier;
                t.height = newSize * t.sizeMultiplier;
            }
        });
    }

    engine.renderAll();
    if (Date.now() - (window.lastGridSizeSync || 0) > 60) {
        window.lastGridSizeSync = Date.now();
        syncState();
    }
}

function finalizeGridResize() {
    if (gridResizeBaseline) {
        const isAnchor = document.getElementById('grid-anchor-objects')?.checked !== false;
        if (isAnchor) {
            const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
            const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
            engine.tokens.forEach(t => {
                t.x = Math.round((t.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
                t.y = Math.round((t.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
            });
        }
        gridResizeBaseline = null;
        if (currentMapBase64) markMapDirty(true);
        syncState(true);
    }
}

const gridSizeInput = document.getElementById('grid-size');
const gridSizeSlider = document.getElementById('grid-size-slider');

if (gridSizeSlider) {
    gridSizeSlider.addEventListener('pointerdown', () => {
        gridResizeBaseline = createGridResizeBaseline();
    });
    gridSizeSlider.addEventListener('input', (e) => {
        if (gridSizeInput) gridSizeInput.value = e.target.value;
        updateGrid();
    });
    gridSizeSlider.addEventListener('change', finalizeGridResize);
    gridSizeSlider.addEventListener('pointerup', finalizeGridResize);
}

if (gridSizeInput) {
    gridSizeInput.addEventListener('focus', () => {
        gridResizeBaseline = createGridResizeBaseline();
    });
    gridSizeInput.addEventListener('input', (e) => {
        if (gridSizeSlider) gridSizeSlider.value = e.target.value;
        updateGrid();
    });
    gridSizeInput.addEventListener('change', finalizeGridResize);
    gridSizeInput.addEventListener('blur', finalizeGridResize);
}

document.getElementById('grid-color').addEventListener('input', updateGrid);
document.getElementById('grid-glow').addEventListener('change', updateGrid);

function updateToolControlsVisibility() {
    const fogControls = document.getElementById('fog-brush-controls');
    if (fogControls) fogControls.style.display = currentTool.startsWith('fog-') ? 'block' : 'none';
    const gridControls = document.getElementById('grid-align-controls');
    if (gridControls) gridControls.style.display = currentTool === 'move-grid' ? 'block' : 'none';
}

document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentTool = e.target.dataset.tool;

        updateToolControlsVisibility();
        if (!currentTool.startsWith('fog-')) {
            engine.brushPreview = null;
            engine.renderAll();
        }
    });
});

document.getElementById('btn-reset-fog').addEventListener('click', () => {
    engine.resetFog();
    syncFog();
    markMapDirty(true);
});

document.getElementById('btn-remove-fog').addEventListener('click', () => {
    engine.clearFog();
    syncFog();
    markMapDirty(true);
});

document.getElementById('btn-clear-drawings-pub').addEventListener('click', () => {
    engine.publicStrokes = [];
    engine.renderAll();
    syncState(true);
    markMapDirty(true);
    if (isViewSyncActive) {
        sendViewSync(true);
    }
});
document.getElementById('btn-clear-drawings-priv').addEventListener('click', () => {
    engine.privateStrokes = [];
    engine.renderAll();
    markMapDirty(true);
    if (isViewSyncActive) {
        sendViewSync(true);
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

const TOKEN_CATEGORIES = ['mostri', 'png', 'personaggi', 'vari'];
let currentTokenCategory = 'all';

function getCategoryMeta(cat) {
    switch (cat) {
        case 'png': return { id: 'png', icon: '🧑', label: 'PNG', bg: '#ef6c00' };
        case 'personaggi': return { id: 'personaggi', icon: '🛡️', label: 'Personaggi', bg: '#1565c0' };
        case 'vari': return { id: 'vari', icon: '📦', label: 'Vari', bg: '#6a1b9a' };
        case 'mostri':
        default:
            return { id: 'mostri', icon: '👹', label: 'Mostri', bg: '#c62828' };
    }
}

function inferTokenCategory(t) {
    if (!t) return 'mostri';
    if (t.category && TOKEN_CATEGORIES.includes(t.category)) return t.category;
    if (getTokenOwners(t).length > 0) return 'personaggi';
    if (t.statblock) return 'mostri';
    if (savedTokensLibrary && savedTokensLibrary.length > 0 && t.src) {
        const libMatch = savedTokensLibrary.find(x => x.src === t.src);
        if (libMatch && libMatch.category && TOKEN_CATEGORIES.includes(libMatch.category)) {
            return libMatch.category;
        }
    }
    return 'mostri';
}

function detectCategoryFromFilePath(file) {
    const pathStr = ((file && (file.webkitRelativePath || file.name)) || '').toLowerCase();
    if (/(^|[\/\\_\-\s])(pg|personaggi|personaggio|pc|players|eroi|party)([\/\\_\-\s]|$)/.test(pathStr)) return 'personaggi';
    if (/(^|[\/\\_\-\s])(png|npc|npcs|alleati|cittadini)([\/\\_\-\s]|$)/.test(pathStr)) return 'png';
    if (/(^|[\/\\_\-\s])(vari|varie|misc|oggetti|props|trappole)([\/\\_\-\s]|$)/.test(pathStr)) return 'vari';
    if (/(^|[\/\\_\-\s])(mostri|mostro|monsters|monster|nemici|boss)([\/\\_\-\s]|$)/.test(pathStr)) return 'mostri';
    if (currentTokenCategory && currentTokenCategory !== 'all') return currentTokenCategory;
    const uploadSel = document.getElementById('token-upload-category');
    return (uploadSel && TOKEN_CATEGORIES.includes(uploadSel.value)) ? uploadSel.value : 'mostri';
}

function getCleanTemplateName(rawName, category) {
    const withoutExt = String(rawName || 'Token').replace(/\.[^/.]+$/, "").trim() || 'Token';
    if (category === 'personaggi' || category === 'png') {
        return withoutExt.replace(/\s+1$/, '').trim() || withoutExt;
    }
    return withoutExt.replace(/\s+\d+$/, '').trim() || withoutExt;
}

function scheduleSaveCampaignTokens() {
    if (campaignTokensSaveTimer) clearTimeout(campaignTokensSaveTimer);
    campaignTokensSaveTimer = setTimeout(async () => {
        campaignTokensSaveTimer = null;
        const campId = document.getElementById('campaign-select')?.value || localStorage.getItem('vtt_last_campaign_id') || '';
        if (campId) {
            try {
                await vttDB.saveCampaignTokens(campId, currentCampaignTokens);
            } catch (e) {
                console.warn("Salvataggio token campagna:", e);
            }
        }
        try {
            localStorage.setItem('vtt_default_campaign_tokens', JSON.stringify(currentCampaignTokens.slice(0, 80)));
        } catch (e) {}
    }, 180);
}

function upsertTokenInCampaign(token, skipGalleryRefresh = false) {
    if (!token || !token.src) return null;
    const cat = inferTokenCategory(token);
    const cleanName = getCleanTemplateName(token.name || token.originalName || 'Token', cat);
    const cleanSrc = getOrCompressTokenSrc(token) || token.src;
    const ownersList = getTokenOwners(token);

    let existing = currentCampaignTokens.find(x => x.src === cleanSrc || x.src === token.src);
    if (!existing && (cat === 'personaggi' || cat === 'png')) {
        existing = currentCampaignTokens.find(x => (x.category === cat) && x.name && x.name.toLowerCase() === cleanName.toLowerCase());
    }

    if (existing) {
        existing.name = cleanName;
        existing.src = cleanSrc;
        existing.category = cat;
        if (token.hpMax !== undefined && token.hpMax > 0) existing.hpMax = token.hpMax;
        if (token.hpCurrent !== undefined) existing.hpCurrent = token.hpCurrent;
        if (token.ac !== undefined && token.ac > 0) existing.ac = token.ac;
        if (token.sizeMultiplier) existing.sizeMultiplier = token.sizeMultiplier;
        if (ownersList.length > 0 || token.owners !== undefined) {
            existing.owners = ownersList;
            existing.owner = ownersList[0] || '';
        }
        if (token.nameVisibility) existing.nameVisibility = token.nameVisibility;
        if (token.hpVisibleToPlayers !== undefined) existing.hpVisibleToPlayers = token.hpVisibleToPlayers;
        if (token.adventureJournal !== undefined) {
            existing.adventureJournal = token.adventureJournal;
        }
        if (token.statblock) {
            const stCopy = JSON.parse(JSON.stringify(token.statblock));
            if (stCopy._raw && stCopy._raw.tokenSrc) delete stCopy._raw.tokenSrc;
            existing.statblock = stCopy;
        }
        if (token.pcSheet) {
            existing.pcSheet = JSON.parse(JSON.stringify(token.pcSheet));
        }
    } else {
        let stCopy = null;
        if (token.statblock) {
            stCopy = JSON.parse(JSON.stringify(token.statblock));
            if (stCopy._raw && stCopy._raw.tokenSrc) delete stCopy._raw.tokenSrc;
        }
        const pcCopy = token.pcSheet ? JSON.parse(JSON.stringify(token.pcSheet)) : null;
        existing = {
            id: 'token_c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            name: cleanName,
            src: cleanSrc,
            category: cat,
            hpMax: token.hpMax || 0,
            hpCurrent: token.hpCurrent !== undefined ? token.hpCurrent : (token.hpMax || 0),
            ac: token.ac || 10,
            sizeMultiplier: token.sizeMultiplier || 1,
            owners: ownersList,
            owner: ownersList[0] || '',
            nameVisibility: token.nameVisibility || 'all',
            hpVisibleToPlayers: token.hpVisibleToPlayers !== false,
            statblock: stCopy,
            pcSheet: pcCopy,
            adventureJournal: token.adventureJournal || ''
        };
        currentCampaignTokens.push(existing);
    }

    scheduleSaveCampaignTokens();
    if (!skipGalleryRefresh && typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none' && currentTokenTab === 'map') {
        updateMapTokensGallery();
    }
    return existing;
}
window.upsertTokenInCampaign = upsertTokenInCampaign;

async function loadCampaignTokensFor(campaignId) {
    let loaded = [];
    if (campaignId) {
        try {
            loaded = await vttDB.getCampaignTokens(campaignId) || [];
            // Migrazione/recupero automatico dai salvataggi mappa della stessa campagna:
            // se la campagna aveva già mappe salvate con PG, PNG o mostri, li recupera tutti nella Campagna!
            const maps = await vttDB.getMapsByCampaign(campaignId) || [];
            let addedFromMaps = false;
            maps.forEach(m => {
                if (m && m.state && Array.isArray(m.state.tokens)) {
                    m.state.tokens.forEach(t => {
                        if (!t || !t.src) return;
                        const cat = inferTokenCategory(t);
                        const cleanName = getCleanTemplateName(t.name || t.originalName || 'Token', cat);
                        const found = loaded.find(x => x.src === t.src || ((cat === 'personaggi' || cat === 'png') && x.category === cat && x.name && x.name.toLowerCase() === cleanName.toLowerCase()));
                        if (!found) {
                            let stCopy = null;
                            if (t.statblock) {
                                stCopy = JSON.parse(JSON.stringify(t.statblock));
                                if (stCopy._raw && stCopy._raw.tokenSrc) delete stCopy._raw.tokenSrc;
                            }
                            const ownersList = getTokenOwners(t);
                            loaded.push({
                                id: 'token_c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                                name: cleanName,
                                src: t.src,
                                category: cat,
                                hpMax: t.hpMax || 0,
                                ac: t.ac || 10,
                                sizeMultiplier: t.sizeMultiplier || 1,
                                owners: ownersList,
                                owner: ownersList[0] || '',
                                nameVisibility: t.nameVisibility || 'all',
                                hpVisibleToPlayers: t.hpVisibleToPlayers !== false,
                                statblock: stCopy,
                                pcSheet: t.pcSheet ? JSON.parse(JSON.stringify(t.pcSheet)) : null
                            });
                            addedFromMaps = true;
                        }
                    });
                }
            });
            if (addedFromMaps) {
                await vttDB.saveCampaignTokens(campaignId, loaded);
            }
        } catch (err) {
            console.warn("Errore caricamento token campagna:", err);
        }
    } else {
        try {
            loaded = JSON.parse(localStorage.getItem('vtt_default_campaign_tokens') || '[]');
        } catch (e) {
            loaded = [];
        }
    }
    currentCampaignTokens = Array.isArray(loaded) ? loaded : [];
    // Assicura che anche eventuali token attualmente in mappa siano sincronizzati nella campagna
    if (engine && Array.isArray(engine.tokens) && engine.tokens.length > 0) {
        engine.tokens.forEach(t => upsertTokenInCampaign(t, true));
    }
    updateMapTokensGallery();
}

function syncCampaignPlayerCharactersToMap() {
    if (!Array.isArray(currentCampaignTokens) || currentCampaignTokens.length === 0) return;
    
    // Trova tutti i token identificati come Personaggi Giocatori (PG) nella campagna
    const campaignPgs = currentCampaignTokens.filter(ct => {
        return ct.category === 'personaggi' || (ct.owners && ct.owners.length > 0) || ct.pcSheet;
    });
    if (campaignPgs.length === 0) return;

    const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
    const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
    const spawnBaseX = Math.round(((engine.mapImage ? engine.mapImage.width / 2 : 400) - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
    const spawnBaseY = Math.round(((engine.mapImage ? engine.mapImage.height / 2 : 400) - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;

    let spawnedCount = 0;
    campaignPgs.forEach(cpg => {
        const cleanName = (cpg.name || '').trim().toLowerCase();
        let mapTok = engine.tokens.find(t => {
            if (t.id === cpg.id) return true;
            if (cleanName && t.name && t.name.trim().toLowerCase() === cleanName) return true;
            return false;
        });

        if (mapTok) {
            // Aggiorna con i dati freschi della campagna (Scheda, Giornale, PV, CA, Proprietari)
            if (cpg.pcSheet) mapTok.pcSheet = JSON.parse(JSON.stringify(cpg.pcSheet));
            if (cpg.adventureJournal !== undefined) mapTok.adventureJournal = cpg.adventureJournal;
            if (cpg.hpCurrent !== undefined) mapTok.hpCurrent = cpg.hpCurrent;
            if (cpg.hpMax !== undefined && cpg.hpMax > 0) mapTok.hpMax = cpg.hpMax;
            if (cpg.ac !== undefined && cpg.ac > 0) mapTok.ac = cpg.ac;
            if (cpg.owners && cpg.owners.length > 0) mapTok.owners = [...cpg.owners];
            if (cpg.owner) mapTok.owner = cpg.owner;
        } else {
            // Porta il token del giocatore automaticamente sulla nuova mappa!
            const spawnX = spawnBaseX + (spawnedCount * engine.grid.size);
            const spawnY = spawnBaseY;
            spawnedCount++;

            const newTok = {
                id: cpg.id || ('token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)),
                name: cpg.name || 'Personaggio',
                category: 'personaggi',
                src: cpg.src,
                x: spawnX,
                y: spawnY,
                width: engine.grid.size * (cpg.sizeMultiplier || 1),
                height: engine.grid.size * (cpg.sizeMultiplier || 1),
                sizeMultiplier: cpg.sizeMultiplier || 1,
                hpMax: cpg.hpMax || 0,
                hpCurrent: cpg.hpCurrent !== undefined ? cpg.hpCurrent : (cpg.hpMax || 0),
                ac: cpg.ac || 10,
                owners: cpg.owners || (cpg.owner ? [cpg.owner] : []),
                owner: cpg.owner || '',
                nameVisibility: cpg.nameVisibility || 'all',
                hpVisibleToPlayers: cpg.hpVisibleToPlayers !== false,
                pcSheet: cpg.pcSheet ? JSON.parse(JSON.stringify(cpg.pcSheet)) : null,
                adventureJournal: cpg.adventureJournal || '',
                visible: true
            };

            if (newTok.src) {
                const img = new Image();
                img.onload = () => {
                    newTok.imageObj = img;
                    engine.renderTokensLayer();
                };
                img.src = newTok.src;
            }
            engine.tokens.push(newTok);
        }
    });
}
window.syncCampaignPlayerCharactersToMap = syncCampaignPlayerCharactersToMap;

function exportAllCampaignCharactersSeparateFiles() {
    const pcTokensMap = new Map();
    if (Array.isArray(currentCampaignTokens)) {
        currentCampaignTokens.forEach(ct => {
            if (ct.category === 'personaggi' || (ct.owners && ct.owners.length > 0) || ct.pcSheet) {
                pcTokensMap.set(ct.name || ct.src, ct);
            }
        });
    }
    if (engine && Array.isArray(engine.tokens)) {
        engine.tokens.forEach(t => {
            if (t.category === 'personaggi' || (t.owners && t.owners.length > 0) || t.pcSheet) {
                pcTokensMap.set(t.name || t.src, t);
            }
        });
    }
    const pcList = Array.from(pcTokensMap.values());
    if (pcList.length === 0) {
        alert(typeof window.t === 'function' ? window.t('Nessun Personaggio Giocatore (PG) trovato nella campagna da esportare!') : 'Nessun Personaggio Giocatore (PG) trovato nella campagna da esportare!');
        return;
    }

    pcList.forEach((token, index) => {
        setTimeout(() => {
            const exportObj = {
                format: 'TABLETOP_CHARACTER_BACKUP',
                version: 1,
                exportedAt: new Date().toISOString(),
                id: token.id || ('char_' + index),
                name: token.name || 'Personaggio',
                category: 'personaggi',
                src: token.src || '',
                hpMax: token.hpMax || 0,
                hpCurrent: token.hpCurrent !== undefined ? token.hpCurrent : (token.hpMax || 0),
                ac: token.ac || 10,
                owners: token.owners || (token.owner ? [token.owner] : []),
                owner: token.owner || '',
                pcSheet: token.pcSheet || null,
                adventureJournal: token.adventureJournal || ''
            };
            const jsonStr = JSON.stringify(exportObj, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safeName = (token.name || ('Personaggio_' + (index + 1))).replace(/[^a-zA-Z0-9_\-]/g, '_');
            a.download = `${safeName}_Scheda_e_Giornale.json`;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, index * 140);
    });

    if (typeof showToast === 'function') {
        showToast(`📦 Esportazione completata: scaricati ${pcList.length} file separati!`);
    }
}
window.exportAllCampaignCharactersSeparateFiles = exportAllCampaignCharactersSeparateFiles;

function importCharacterBackupFiles() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.multiple = true;
    input.onchange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        let importedCount = 0;
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (re) => {
                try {
                    const data = JSON.parse(re.target.result);
                    if (!data || !data.name) return;
                    let existing = engine.tokens.find(t => (data.id && t.id === data.id) || (t.name && t.name.toLowerCase() === data.name.toLowerCase()));
                    if (existing) {
                        if (data.pcSheet) existing.pcSheet = data.pcSheet;
                        if (data.adventureJournal !== undefined) existing.adventureJournal = data.adventureJournal;
                        if (data.hpMax !== undefined) existing.hpMax = data.hpMax;
                        if (data.hpCurrent !== undefined) existing.hpCurrent = data.hpCurrent;
                        if (data.ac !== undefined) existing.ac = data.ac;
                        if (data.owners) existing.owners = data.owners;
                        upsertTokenInCampaign(existing);
                    } else {
                        const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
                        const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
                        const spawnX = Math.round(((engine.mapImage ? engine.mapImage.width / 2 : 400) - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
                        const spawnY = Math.round(((engine.mapImage ? engine.mapImage.height / 2 : 400) - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
                        
                        const newTok = {
                            id: data.id || ('token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)),
                            name: data.name,
                            category: 'personaggi',
                            src: data.src || '',
                            x: spawnX + (importedCount * engine.grid.size),
                            y: spawnY,
                            width: engine.grid.size,
                            height: engine.grid.size,
                            hpMax: data.hpMax || 0,
                            hpCurrent: data.hpCurrent !== undefined ? data.hpCurrent : (data.hpMax || 0),
                            ac: data.ac || 10,
                            owners: data.owners || (data.owner ? [data.owner] : []),
                            owner: data.owner || '',
                            pcSheet: data.pcSheet || null,
                            adventureJournal: data.adventureJournal || '',
                            visible: true
                        };
                        if (newTok.src) {
                            const img = new Image();
                            img.onload = () => { newTok.imageObj = img; engine.renderTokensLayer(); };
                            img.src = newTok.src;
                        }
                        engine.tokens.push(newTok);
                        upsertTokenInCampaign(newTok);
                    }
                    importedCount++;
                    engine.renderTokensLayer();
                    syncState(true);
                    if (importedCount === files.length) {
                        showToast(`✅ Importati con successo ${importedCount} personaggi!`);
                        if (typeof updateMapTokensGallery === 'function') updateMapTokensGallery();
                    }
                } catch (err) {
                    console.error('Errore import backup PG:', err);
                }
            };
            reader.readAsText(file);
        });
    };
    input.click();
}
window.importCharacterBackupFiles = importCharacterBackupFiles;
document.getElementById('btn-export-all-characters')?.addEventListener('click', exportAllCampaignCharactersSeparateFiles);
document.getElementById('btn-import-character-file')?.addEventListener('click', importCharacterBackupFiles);

function getUniqueMapTokens() {
    const mapCounts = new Map();
    if (engine && Array.isArray(engine.tokens)) {
        engine.tokens.forEach(t => {
            if (!t || !t.src) return;
            mapCounts.set(t.src, (mapCounts.get(t.src) || 0) + 1);
            // Sincronizza in memoria eventuali token presenti sulla mappa ma non ancora nel roster campagna
            const existsInCamp = currentCampaignTokens.some(c => c.src === t.src);
            if (!existsInCamp) {
                upsertTokenInCampaign(t, true);
            }
        });
    }

    return currentCampaignTokens.map(ct => {
        const cat = (ct.category && TOKEN_CATEGORIES.includes(ct.category)) ? ct.category : inferTokenCategory(ct);
        const cleanName = getCleanTemplateName(ct.name || 'Token', cat);
        return {
            id: ct.id,
            name: cleanName,
            src: ct.src,
            count: mapCounts.get(ct.src) || 0,
            hpMax: ct.hpMax || 0,
            category: cat,
            template: ct
        };
    });
}

function updateMapTokensGallery() {
    const gallery = document.getElementById('token-gallery-map');
    const badge = document.getElementById('badge-count-map');
    const empty = document.getElementById('token-gallery-empty');
    if (!gallery) return;

    const campaignTokens = getUniqueMapTokens();
    if (badge) badge.textContent = campaignTokens.length;

    gallery.innerHTML = '';
    const query = (document.getElementById('token-search')?.value || '').toLowerCase().trim();

    const fragment = document.createDocumentFragment();
    let visibleCount = 0;
    campaignTokens.forEach(t => {
        const cat = t.category || 'mostri';
        const matchesCat = (currentTokenCategory === 'all' || cat === currentTokenCategory);
        const matchesQuery = !query || t.name.toLowerCase().includes(query);
        if (!matchesCat || !matchesQuery) return;
        visibleCount++;
        const card = createTokenCard(t.name, t.src, t.count, true, t.id, t.hpMax, cat, 'campaign', t.template);
        fragment.appendChild(card);
    });
    gallery.appendChild(fragment);

    if (currentTokenTab === 'map') {
        if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

let filteredLibraryTokensCache = [];
let renderedLibraryCount = 0;
const LIBRARY_RENDER_BATCH = 60;

function renderNextLibraryBatch() {
    const gallery = document.getElementById('token-gallery-library');
    if (!gallery || renderedLibraryCount >= filteredLibraryTokensCache.length) return;
    const nextSlice = filteredLibraryTokensCache.slice(renderedLibraryCount, renderedLibraryCount + LIBRARY_RENDER_BATCH);
    const fragment = document.createDocumentFragment();
    nextSlice.forEach(t => {
        const cat = (t.category && TOKEN_CATEGORIES.includes(t.category)) ? t.category : 'mostri';
        const displayName = getCleanTemplateName(t.name, cat);
        const card = createTokenCard(displayName, t.src, 1, true, t.id, t.hpMax || null, cat, 'library', t);
        fragment.appendChild(card);
    });
    gallery.appendChild(fragment);
    renderedLibraryCount += nextSlice.length;
}

const tokenGalleryScrollEl = document.getElementById('token-gallery-scroll');
if (tokenGalleryScrollEl) {
    tokenGalleryScrollEl.addEventListener('scroll', () => {
        if (currentTokenTab === 'library' && renderedLibraryCount < filteredLibraryTokensCache.length) {
            if (tokenGalleryScrollEl.scrollTop + tokenGalleryScrollEl.clientHeight >= tokenGalleryScrollEl.scrollHeight - 140) {
                renderNextLibraryBatch();
            }
        }
    });
}

function updateLibraryGallery() {
    const gallery = document.getElementById('token-gallery-library');
    const badge = document.getElementById('badge-count-library');
    const empty = document.getElementById('token-gallery-empty');
    if (!gallery) return;

    if (badge) badge.textContent = savedTokensLibrary.length;
    gallery.innerHTML = '';

    const query = (document.getElementById('token-search')?.value || '').toLowerCase().trim();
    filteredLibraryTokensCache = savedTokensLibrary.filter(t => {
        const cat = (t.category && TOKEN_CATEGORIES.includes(t.category)) ? t.category : 'mostri';
        const matchesCat = (currentTokenCategory === 'all' || cat === currentTokenCategory);
        if (!matchesCat) return false;
        if (!query) return true;
        return (t.name || '').toLowerCase().includes(query);
    });

    renderedLibraryCount = 0;
    if (tokenGalleryScrollEl && currentTokenTab === 'library') {
        tokenGalleryScrollEl.scrollTop = 0;
    }
    renderNextLibraryBatch();

    if (currentTokenTab === 'library') {
        if (empty) empty.style.display = filteredLibraryTokensCache.length === 0 ? 'block' : 'none';
    }
}

function createTokenCard(name, src, count = 1, allowDelete = false, id = null, inheritedHp = null, category = 'mostri', sourceType = 'library', templateObj = null) {
    const card = document.createElement('div');
    card.className = 'gallery-token-card';
    let currentCat = TOKEN_CATEGORIES.includes(category) ? category : 'mostri';
    const meta = getCategoryMeta(currentCat);
    const hpTitle = (inheritedHp && inheritedHp > 0) ? ` (❤️ Full PV: ${inheritedHp})` : '';
    const catLabelT = typeof window.t === 'function' ? window.t(meta.label) : meta.label;
    card.title = `${typeof window.t === 'function' ? window.t('Clicca per posizionare:') : 'Clicca per posizionare:'} ${name} [${catLabelT}]${hpTitle}`;
    card.style.cssText = 'display: flex; flex-direction: column; align-items: center; cursor: pointer; position: relative; padding: 5px 4px; border-radius: 6px; background: #1c1c1c; border: 1px solid #333; transition: all 0.15s; user-select: none; min-width: 0; max-width: 100%; width: 100%; overflow: hidden; box-sizing: border-box;';

    card.onmouseenter = () => { card.style.borderColor = '#4db6ac'; card.style.background = '#252525'; };
    card.onmouseleave = () => { card.style.borderColor = '#333'; card.style.background = '#1c1c1c'; };

    const imgWrapper = document.createElement('div');
    imgWrapper.style.cssText = 'position: relative; width: 52px; height: 52px; flex-shrink: 0;';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = src;
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 1px solid #555; pointer-events: none; display: block;';
    imgWrapper.appendChild(img);

    if (count > 1 || (sourceType === 'campaign' && count === 1)) {
        const countBadge = document.createElement('span');
        countBadge.textContent = count > 1 ? `x${count}` : '●';
        countBadge.title = count > 1 ? `${count} in mappa` : 'Presente in mappa';
        countBadge.style.cssText = 'position: absolute; top: -3px; right: -3px; background: #00897b; color: white; font-size: 9.5px; font-weight: bold; border-radius: 8px; padding: 0 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.6); pointer-events: none;';
        imgWrapper.appendChild(countBadge);
    }

    // Badge Cartella cliccabile per spostare rapidamente il token tra Mostri / PNG / Personaggi / Vari
    const catBadge = document.createElement('button');
    catBadge.type = 'button';
    catBadge.textContent = meta.icon;
    catBadge.title = `${typeof window.t === 'function' ? window.t('Cartella:') : 'Cartella:'} ${catLabelT} (${typeof window.t === 'function' ? window.t('Clicca per cambiare cartella') : 'Clicca per cambiare cartella'})`;
    catBadge.style.cssText = `position: absolute; bottom: -2px; right: -3px; background: ${meta.bg}; color: white; border: 1px solid #222; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.7);`;
    catBadge.onclick = async (e) => {
        e.stopPropagation();
        const nextIdx = (TOKEN_CATEGORIES.indexOf(currentCat) + 1) % TOKEN_CATEGORIES.length;
        const nextCat = TOKEN_CATEGORIES[nextIdx];
        currentCat = nextCat;
        const nextMeta = getCategoryMeta(nextCat);

        // Aggiorna in Libreria
        const libItem = savedTokensLibrary.find(x => (id && x.id === id) || x.src === src);
        if (libItem) {
            libItem.category = nextCat;
            libItem.name = getCleanTemplateName(libItem.name, nextCat);
            await vttDB.saveToken(libItem);
        }
        // Aggiorna nei Token della Campagna
        const campItem = currentCampaignTokens.find(x => (id && x.id === id) || x.src === src);
        if (campItem) {
            campItem.category = nextCat;
            campItem.name = getCleanTemplateName(campItem.name, nextCat);
            scheduleSaveCampaignTokens();
        }
        // Aggiorna anche eventuali token in mappa con la stessa immagine
        engine.tokens.forEach(tok => {
            if (tok.src === src) {
                tok.category = nextCat;
                if ((nextCat === 'personaggi' || nextCat === 'png') && tok.name) {
                    tok.name = tok.name.replace(/\s+1$/, '').trim() || tok.name;
                }
            }
        });
        engine.renderAll();
        const targets = getSelectedTargetTokens();
        if (targets.length > 0 && typeof window.updateSelectedTokenControls === 'function') {
            window.updateSelectedTokenControls(targets[targets.length - 1]);
        }
        if (currentTokenTab === 'map') updateMapTokensGallery();
        else updateLibraryGallery();

        if (typeof showToast === 'function') {
            const nextLabelT = typeof window.t === 'function' ? window.t(nextMeta.label) : nextMeta.label;
            showToast(`${nextMeta.icon} "${name}" → ${nextLabelT}`);
        }
    };
    imgWrapper.appendChild(catBadge);

    if (allowDelete && id) {
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '✕';
        delBtn.title = sourceType === 'campaign' ? 'Rimuovi dai token della Campagna' : 'Rimuovi dalla libreria';
        delBtn.style.cssText = 'position: absolute; top: -4px; left: -4px; background: rgba(180, 0, 0, 0.85); color: white; border: none; border-radius: 50%; width: 16px; height: 16px; font-size: 9px; cursor: pointer; display: none; align-items: center; justify-content: center; padding: 0;';
        card.addEventListener('mouseenter', () => delBtn.style.display = 'flex');
        card.addEventListener('mouseleave', () => delBtn.style.display = 'none');
        delBtn.onclick = async (e) => {
            e.stopPropagation();
            if (sourceType === 'campaign') {
                if (confirm(`Rimuovere "${name}" dai token salvati nella Campagna?`)) {
                    currentCampaignTokens = currentCampaignTokens.filter(x => x.id !== id && x.src !== src);
                    scheduleSaveCampaignTokens();
                    updateMapTokensGallery();
                }
            } else {
                if (confirm(`Rimuovere "${name}" dalla libreria salvata?`)) {
                    await vttDB.deleteToken(id);
                    savedTokensLibrary = savedTokensLibrary.filter(x => x.id !== id);
                    updateLibraryGallery();
                }
            }
        };
        imgWrapper.appendChild(delBtn);
    }

    const label = document.createElement('span');
    label.textContent = name;
    label.style.cssText = 'font-size: 10.5px; color: #ddd; margin-top: 3px; text-align: center; width: 100%; max-width: 100%; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none;';

    card.appendChild(imgWrapper);
    card.appendChild(label);

    if (inheritedHp && inheritedHp > 0) {
        const hpTag = document.createElement('span');
        hpTag.textContent = `❤️ ${inheritedHp} PV`;
        hpTag.style.cssText = 'font-size: 9.5px; color: #ef5350; font-weight: bold; margin-top: 1px; pointer-events: none; line-height: 1; white-space: nowrap;';
        card.appendChild(hpTag);
    }

    card.onclick = () => {
        addTokenToMap(name, src, inheritedHp, currentCat, templateObj);
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
            const detectedCat = detectCategoryFromFilePath(file);
            const tokenItem = {
                id: 'token_lib_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                name: cleanName,
                src: optimizedSrc,
                category: detectedCat
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
        if (typeof showToast === 'function') {
            const meta = getCategoryMeta(newTokens[0].category);
            const catName = typeof window.t === 'function' ? window.t(meta.label) : meta.label;
            showToast(`📥 ${newTokens.length} token ${typeof window.t === 'function' ? window.t('salvati in') : 'salvati in'} "${catName}"!`);
        }
    }
}

function setTokenCategoryFilter(cat) {
    currentTokenCategory = cat || 'all';
    document.querySelectorAll('.token-cat-btn').forEach(btn => {
        const isAct = btn.dataset.cat === currentTokenCategory;
        btn.classList.toggle('active', isAct);
        btn.style.background = isAct ? '#00695c' : '#222';
        btn.style.color = isAct ? 'white' : '#bbb';
        btn.style.borderColor = isAct ? '#00897b' : '#444';
        btn.style.fontWeight = isAct ? 'bold' : 'normal';
    });
    if (currentTokenCategory !== 'all') {
        const uploadSel = document.getElementById('token-upload-category');
        if (uploadSel) uploadSel.value = currentTokenCategory;
    }
    if (currentTokenTab === 'map') {
        updateMapTokensGallery();
    } else {
        updateLibraryGallery();
    }
}

document.querySelectorAll('.token-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setTokenCategoryFilter(btn.dataset.cat);
    });
});

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

function getAvailablePlayerNames() {
    const names = [];
    const seen = new Set();
    const add = (n) => {
        if (!n || typeof n !== 'string') return;
        const t = n.trim();
        if (!t) return;
        const low = t.toLowerCase();
        if (!seen.has(low)) {
            seen.add(low);
            names.push(t);
        }
    };
    for (let k in network.connections) {
        if (network.connections[k] && network.connections[k].name) {
            add(network.connections[k].name);
        }
    }
    try {
        const savedParty = JSON.parse(localStorage.getItem('dnd_party') || '[]');
        if (Array.isArray(savedParty)) savedParty.forEach(add);
    } catch (e) {}
    engine.tokens.forEach(t => getTokenOwners(t).forEach(add));
    return names;
}

window.renderTokenOwnersChips = function() {
    const container = document.getElementById('token-owners-chips');
    if (!container) return;
    container.innerHTML = '';

    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;

    // Conta per ogni proprietario su quanti token selezionati è presente
    const ownerCounts = new Map();
    const ownerCanonical = new Map();
    targets.forEach(t => {
        getTokenOwners(t).forEach(o => {
            const low = o.toLowerCase();
            if (!ownerCanonical.has(low)) ownerCanonical.set(low, o);
            ownerCounts.set(low, (ownerCounts.get(low) || 0) + 1);
        });
    });

    if (ownerCounts.size === 0) {
        const dmBadge = document.createElement('span');
        dmBadge.style.cssText = 'font-size: 10.5px; color: #999; background: #1c1c1c; border: 1px solid #3a3a3a; border-radius: 10px; padding: 1px 8px;';
        dmBadge.textContent = '🔒 Controllo: Solo DM';
        container.appendChild(dmBadge);
        return;
    }

    ownerCounts.forEach((count, lowKey) => {
        const displayName = ownerCanonical.get(lowKey);
        const chip = document.createElement('span');
        chip.style.cssText = 'display: inline-flex; align-items: center; gap: 4px; background: #004d40; color: #e0f2f1; border: 1px solid #00897b; border-radius: 12px; padding: 1px 7px; font-size: 10.5px; font-weight: bold;';
        const countSuffix = (targets.length > 1 && count < targets.length) ? ` (${count}/${targets.length})` : '';
        
        const txt = document.createElement('span');
        txt.textContent = `👤 ${displayName}${countSuffix}`;
        
        const btnRevoke = document.createElement('button');
        btnRevoke.type = 'button';
        btnRevoke.textContent = '✕';
        btnRevoke.title = `Revoca controllo a ${displayName}`;
        btnRevoke.style.cssText = 'background: #c62828; color: white; border: none; border-radius: 50%; width: 14px; height: 14px; font-size: 9px; line-height: 1; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 0; margin-left: 2px;';
        btnRevoke.onclick = (e) => {
            e.stopPropagation();
            targets.forEach(t => {
                const updated = getTokenOwners(t).filter(o => o.toLowerCase() !== lowKey);
                setTokenOwners(t, updated);
            });
            window.renderTokenOwnersChips();
            syncState(true);
            if (typeof showToast === 'function') {
                showToast(`Controllo revocato a ${displayName}`);
            }
        };

        chip.appendChild(txt);
        chip.appendChild(btnRevoke);
        container.appendChild(chip);
    });
};

function updateVisibilityButtonUI(targets) {
    const btnVis = document.getElementById('btn-toggle-visibility');
    if (!btnVis || !targets || targets.length === 0) return;
    const hiddenCount = targets.filter(t => t.visible === false).length;
    if (hiddenCount === 0) {
        btnVis.innerHTML = '👁️ Visib.';
        btnVis.style.background = '#2e7d32';
        btnVis.style.borderColor = '#4caf50';
        btnVis.title = 'Attualmente Visibile ai Giocatori (Clicca per nascondere)';
    } else if (hiddenCount === targets.length) {
        btnVis.innerHTML = '🚫 Nasc.';
        btnVis.style.background = '#424242';
        btnVis.style.borderColor = '#777';
        btnVis.title = 'Attualmente Nascosto ai Giocatori (Clicca per rendere visibile)';
    } else {
        btnVis.innerHTML = `👁️ Misti (${targets.length - hiddenCount}/${targets.length})`;
        btnVis.style.background = '#ef6c00';
        btnVis.style.borderColor = '#ffa726';
        btnVis.title = 'Alcuni token sono nascosti: clicca per renderli TUTTI visibili!';
    }
}

window.updateSelectedTokenControls = function(ent) {
    const controls = document.getElementById('selected-token-controls');
    const noTokenMsg = document.getElementById('no-token-selected-msg');
    if (!controls) return;
    const targets = getSelectedTargetTokens();
    if (!ent && targets.length > 0) ent = targets[targets.length - 1];
    if (!ent || targets.length === 0) {
        controls.style.display = 'none';
        if (noTokenMsg) noTokenMsg.style.display = 'block';
        return;
    }
    controls.style.display = 'block';
    if (noTokenMsg) noTokenMsg.style.display = 'none';

    const titleEl = document.getElementById('selected-token-title');
    if (titleEl) {
        if (targets.length > 1) {
            titleEl.innerHTML = `🎯 ${targets.length} Token Selezionati <span style="font-size:10px; background:#00838f; color:white; padding:1px 5px; border-radius:8px; font-weight:normal;">Gruppo</span>`;
        } else {
            titleEl.innerHTML = `🎯 Token Selezionato`;
        }
    }

    updateVisibilityButtonUI(targets);

    const nameInput = document.getElementById('token-name-edit');
    if (nameInput) {
        if (targets.length > 1) {
            nameInput.placeholder = `Rinomina tutti i ${targets.length} token...`;
            nameInput.value = ent.name || (ent.originalName ? ent.originalName.replace(/\.[^/.]+$/, "") : '');
        } else {
            nameInput.placeholder = 'Nome (es. Goblin 1)';
            nameInput.value = ent.name || (ent.originalName ? ent.originalName.replace(/\.[^/.]+$/, "") : '');
        }
    }

    const visInput = document.getElementById('token-name-visibility');
    if (visInput) visInput.value = ent.nameVisibility || 'all';

    const sizeInput = document.getElementById('token-edit-size');
    if (sizeInput) sizeInput.value = ent.sizeMultiplier || 1;

    const catSelect = document.getElementById('token-edit-category');
    if (catSelect) catSelect.value = inferTokenCategory(ent);

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
            btnStat.innerHTML = `<span>📜 ${escapeHTML(ent.statblock.name)}</span>`;
            btnStat.style.background = '#00897b';
            btnStat.title = `Visualizza Scheda Mostro: ${ent.statblock.name}`;
        } else {
            btnStat.innerHTML = `<span>📜 Mostro</span>`;
            btnStat.style.background = '#0277bd';
            btnStat.title = 'Cerca e assegna scheda statistiche mostro';
        }
    }

    // Pulsante Scheda Personaggio (PG)
    const btnPc = document.getElementById('btn-open-pcsheet');
    if (btnPc) {
        if (ent.pcSheet && ent.pcSheet.name) {
            btnPc.innerHTML = `<span>🧙 ${escapeHTML(ent.pcSheet.name)}</span>`;
            btnPc.style.background = '#4a148c';
            btnPc.style.borderColor = '#ffd54f';
            btnPc.title = `Apri Scheda PG: ${ent.pcSheet.name} (Liv. ${ent.pcSheet.level || 1})`;
        } else {
            btnPc.innerHTML = `<span>🧙 Scheda PG</span>`;
            btnPc.style.background = '#6a1b9a';
            btnPc.style.borderColor = '#ab47bc';
            btnPc.title = 'Apri o Importa Scheda Personaggio (PG)';
        }
    }

    const ownerSelect = document.getElementById('token-owner');
    if (ownerSelect) {
        ownerSelect.innerHTML = '<option value="">➕ Assegna Player...</option>';
        const optClear = document.createElement('option');
        optClear.value = '__clear__';
        optClear.innerText = '🔒 Solo DM (Revoca tutti)';
        ownerSelect.appendChild(optClear);

        const players = getAvailablePlayerNames();
        if (players.length > 1) {
            const optAll = document.createElement('option');
            optAll.value = '__all__';
            optAll.innerText = '👥 Tutti i Giocatori';
            ownerSelect.appendChild(optAll);
        }
        players.forEach(pName => {
            const opt = document.createElement('option');
            opt.value = pName;
            opt.innerText = '👤 + ' + pName;
            ownerSelect.appendChild(opt);
        });
        ownerSelect.value = '';
    }
    window.renderTokenOwnersChips();

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
    const auraHl = document.getElementById('token-aura-highlight');
    if (auraHl) auraHl.checked = aura.highlightTokens !== false;
    const auraDur = document.getElementById('token-aura-duration');
    if (auraDur) {
        auraDur.value = (aura.roundsLeft !== undefined) ? aura.roundsLeft : (aura.durationRounds || '');
    }

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
            category: inferTokenCategory(sourceToken),
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
            pcSheet: sourceToken.pcSheet ? JSON.parse(JSON.stringify(sourceToken.pcSheet)) : null,
            aura: sourceToken.aura ? JSON.parse(JSON.stringify(sourceToken.aura)) : null,
            conditions: sourceToken.conditions ? JSON.parse(JSON.stringify(sourceToken.conditions)) : [],
            owner: sourceToken.owner || '',
            owners: getTokenOwners(sourceToken)
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

function addTokenToMap(name, src, explicitHp = null, explicitCategory = null, templateObj = null) {
    const campMatch = templateObj || currentCampaignTokens.find(x => x.src === src);
    const libMatch = savedTokensLibrary.find(x => x.src === src);
    const sizeSelect = document.getElementById('token-size-select');
    const sizeMultiplier = (templateObj && templateObj.sizeMultiplier)
        ? parseInt(templateObj.sizeMultiplier) || 1
        : (parseInt(sizeSelect?.value) || (campMatch && campMatch.sizeMultiplier ? parseInt(campMatch.sizeMultiplier) : 1) || 1);
    const isVisible = (document.getElementById('token-visibility-select')?.value || 'visible') === 'visible';
    const pxSize = engine.grid.size * sizeMultiplier;
    const categoryToAssign = (explicitCategory && TOKEN_CATEGORIES.includes(explicitCategory))
        ? explicitCategory
        : ((templateObj && TOKEN_CATEGORIES.includes(templateObj.category))
            ? templateObj.category
            : ((currentTokenCategory && currentTokenCategory !== 'all')
                ? currentTokenCategory
                : ((campMatch && TOKEN_CATEGORIES.includes(campMatch.category))
                    ? campMatch.category
                    : ((libMatch && TOKEN_CATEGORIES.includes(libMatch.category)) ? libMatch.category : 'mostri'))));
    
    // Calcolo PV, CA, proprietari e statblock predefiniti:
    // 1. templateObj / campMatch (token salvato nella Campagna)
    // 2. explicitHp (ereditato dalla card)
    // 3. Valore digitato nel campo "token-default-hp"
    // 4. Token esistente in mappa o in libreria con stesso nome/src
    let hpToAssign = 0;
    let acToAssign = (campMatch && campMatch.ac > 0) ? campMatch.ac : 10;
    let statblockToAssign = (campMatch && campMatch.statblock) ? JSON.parse(JSON.stringify(campMatch.statblock)) : null;
    let pcSheetToAssign = (campMatch && campMatch.pcSheet) ? JSON.parse(JSON.stringify(campMatch.pcSheet)) : null;
    let ownersToAssign = (campMatch && Array.isArray(campMatch.owners)) ? [...campMatch.owners] : [];
    let ownerStrToAssign = (campMatch && campMatch.owner) ? campMatch.owner : (ownersToAssign[0] || '');
    let nameVisToAssign = (campMatch && campMatch.nameVisibility) ? campMatch.nameVisibility : 'all';
    let hpVisToAssign = (campMatch && campMatch.hpVisibleToPlayers !== undefined) ? campMatch.hpVisibleToPlayers : true;

    const defAcInput = document.getElementById('token-ac');
    if (!campMatch && defAcInput && defAcInput.value !== '') {
        const parsedAc = parseInt(defAcInput.value);
        if (!isNaN(parsedAc) && parsedAc > 0) acToAssign = parsedAc;
    }

    if (explicitHp !== null && explicitHp !== undefined && explicitHp > 0) {
        hpToAssign = parseInt(explicitHp) || 0;
    } else if (campMatch && campMatch.hpMax > 0) {
        hpToAssign = parseInt(campMatch.hpMax) || 0;
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
                if (existingWithHp.pcSheet) pcSheetToAssign = JSON.parse(JSON.stringify(existingWithHp.pcSheet));
            } else if (libMatch && libMatch.hpMax > 0) {
                hpToAssign = libMatch.hpMax;
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

        // Regola numerazione:
        // PG ('personaggi') e PNG ('png') sono unici e NON hanno mai il numero progressivo finale (es. "Rendal" resta "Rendal").
        // Mostri ('mostri') e Vari ('vari') mantengono la numerazione progressiva ("Goblin 1", "Goblin 2", ecc.).
        let assignedName;
        if (categoryToAssign === 'personaggi' || categoryToAssign === 'png') {
            assignedName = (name || 'Token').replace(/\.[^/.]+$/, "").replace(/\s+1$/, '').trim() || 'Token';
        } else {
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
            assignedName = (foundAny || maxNum > 0) ? `${baseName} ${maxNum + 1}` : `${baseName} 1`;
        }

        const token = {
            id: 'token_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: assignedName,
            nameVisibility: nameVisToAssign,
            originalName: name,
            category: categoryToAssign,
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
            hpVisibleToPlayers: hpVisToAssign,
            ac: acToAssign,
            statblock: statblockToAssign,
            pcSheet: pcSheetToAssign,
            owner: ownerStrToAssign,
            owners: ownersToAssign
        };
        engine.tokens.push(token);
        upsertTokenInCampaign(token);

        // Seleziona subito il nuovo token e mostra i controlli con i PV
        engine.selectedTokens.clear();
        engine.selectedTokens.add(token.id);
        engine.selectedTokenId = token.id;
        if (typeof window.updateSelectedTokenControls === 'function') {
            window.updateSelectedTokenControls(token);
        }

        engine.renderAll();
        if (isVisible) syncState(true, false);
        else markMapDirty(true);
        if (typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none') {
            updateMapTokensGallery();
        }
        if (typeof showToast === 'function') {
            const pfx = isVisible
                ? (typeof window.t === 'function' ? window.t('♟️ Token creato:') : '♟️ Token creato:')
                : (typeof window.t === 'function' ? window.t('🙈 Token creato (Invisibile):') : '🙈 Token creato (Invisibile):');
            showToast(`${pfx} "${assignedName}"`);
        }
    };
    imgObj.src = src;
}

document.getElementById('btn-toggle-visibility').addEventListener('click', () => {
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;

    // Se almeno un token del gruppo è nascosto, rendili TUTTI visibili; altrimenti nascondili tutti!
    const makeVisible = targets.some(t => t.visible === false);
    let initUpdated = false;

    targets.forEach(token => {
        token.visible = makeVisible;
        if (engine.initiative && engine.initiative.participants) {
            const pItem = engine.initiative.participants.find(p => p.tokenId === token.id);
            if (pItem) {
                pItem.isHidden = !token.visible;
                initUpdated = true;
            }
        }
    });

    if (initUpdated && typeof renderTrackerList === 'function') {
        renderTrackerList();
    }
    updateVisibilityButtonUI(targets);
    engine.renderAll();
    syncState(true);
    if (targets.length > 1 && typeof showToast === 'function') {
        showToast(makeVisible ? `${targets.length} token resi VISIBILI ai giocatori!` : `${targets.length} token NASCOSTI ai giocatori!`);
    }
});

document.getElementById('token-name-edit').addEventListener('input', (e) => {
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;
    const rawVal = e.target.value;

    if (targets.length === 1) {
        targets[0].name = rawVal;
        if (engine.initiative && engine.initiative.participants) {
            const p = engine.initiative.participants.find(x => x.tokenId === targets[0].id);
            if (p) p.name = rawVal || window.getSmartTokenName(targets[0]);
        }
        upsertTokenInCampaign(targets[0]);
    } else {
        const base = rawVal.replace(/\s+\d+$/, '').trim();
        targets.forEach((t, idx) => {
            const cat = inferTokenCategory(t);
            t.name = base ? ((cat === 'personaggi' || cat === 'png') ? base : `${base} ${idx + 1}`) : '';
            if (engine.initiative && engine.initiative.participants) {
                const p = engine.initiative.participants.find(x => x.tokenId === t.id);
                if (p) p.name = t.name || window.getSmartTokenName(t);
            }
            upsertTokenInCampaign(t);
        });
    }
    if (engine.initiative && typeof renderTrackerList === 'function') renderTrackerList();
    engine.renderAll();
    syncState();
});

document.getElementById('token-name-visibility').addEventListener('change', (e) => {
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;
    targets.forEach(t => {
        t.nameVisibility = e.target.value;
        upsertTokenInCampaign(t);
    });
    engine.renderAll();
    syncState(true);
});

document.getElementById('token-edit-size').addEventListener('change', (e) => {
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;
    const mult = parseInt(e.target.value) || 1;
    targets.forEach(token => {
        token.sizeMultiplier = mult;
        token.width = engine.grid.size * mult;
        token.height = engine.grid.size * mult;
        upsertTokenInCampaign(token);
    });
    engine.renderAll();
    syncState(true);
});

document.getElementById('token-edit-category')?.addEventListener('change', async (e) => {
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;
    const newCat = e.target.value;
    if (!TOKEN_CATEGORIES.includes(newCat)) return;
    for (const token of targets) {
        token.category = newCat;
        if ((newCat === 'personaggi' || newCat === 'png') && token.name) {
            token.name = token.name.replace(/\s+1$/, '').trim();
            const nameInput = document.getElementById('token-name-edit');
            if (nameInput && targets.length === 1) nameInput.value = token.name;
        }
        upsertTokenInCampaign(token);
        const libItem = savedTokensLibrary.find(x => x.src === token.src);
        if (libItem) {
            libItem.category = newCat;
            await vttDB.saveToken(libItem);
        }
    }
    engine.renderAll();
    syncState(true);
    if (typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none') {
        updateMapTokensGallery();
        updateLibraryGallery();
    }
    if (typeof showToast === 'function') {
        const meta = getCategoryMeta(newCat);
        const catName = typeof window.t === 'function' ? window.t(meta.label) : meta.label;
        showToast(`${meta.icon} ${typeof window.t === 'function' ? window.t('Cartella assegnata:') : 'Cartella assegnata:'} ${catName}`);
    }
});

document.getElementById('btn-save-token-to-lib')?.addEventListener('click', async () => {
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;
    const catSelect = document.getElementById('token-edit-category');
    const chosenCat = (catSelect && TOKEN_CATEGORIES.includes(catSelect.value)) ? catSelect.value : 'mostri';
    let savedCount = 0;

    for (const token of targets) {
        if (!token.src) continue;
        token.category = chosenCat;
        if ((chosenCat === 'personaggi' || chosenCat === 'png') && token.name) {
            token.name = token.name.replace(/\s+1$/, '').trim();
        }
        upsertTokenInCampaign(token);
        const cleanSrc = getOrCompressTokenSrc(token) || token.src;
        const baseName = (chosenCat === 'personaggi' || chosenCat === 'png')
            ? ((token.name || token.originalName || 'Token').replace(/\.[^/.]+$/, "").replace(/\s+1$/, '').trim() || 'Token')
            : ((token.name || token.originalName || 'Token').replace(/\.[^/.]+$/, "").replace(/\s+\d+$/, '').trim() || 'Token');
        let existing = savedTokensLibrary.find(x => x.src === cleanSrc || x.src === token.src);
        if (existing) {
            existing.category = chosenCat;
            existing.name = baseName;
            if (token.hpMax > 0) existing.hpMax = token.hpMax;
            await vttDB.saveToken(existing);
        } else {
            const newItem = {
                id: 'token_lib_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                name: baseName,
                src: cleanSrc,
                category: chosenCat,
                hpMax: token.hpMax || 0
            };
            savedTokensLibrary.push(newItem);
            await vttDB.saveToken(newItem);
        }
        savedCount++;
    }

    if (savedCount > 0) {
        updateLibraryGallery();
        updateMapTokensGallery();
        if (typeof showToast === 'function') {
            const meta = getCategoryMeta(chosenCat);
            const catName = typeof window.t === 'function' ? window.t(meta.label) : meta.label;
            showToast(`💾 ${savedCount} token ${typeof window.t === 'function' ? window.t('salvati in Libreria') : 'salvati in Libreria'} (${meta.icon} ${catName})!`);
        }
    }
});

document.getElementById('btn-delete-token').addEventListener('click', () => {
    const toDelete = (engine.selectedTokens && engine.selectedTokens.size > 0)
        ? engine.selectedTokens
        : (engine.selectedTokenId ? new Set([engine.selectedTokenId]) : new Set());

    if (toDelete.size === 0) return;

    const isPlayerToken = (t) => (t && ((Array.isArray(t.owners) && t.owners.length > 0) || (t.owner && t.owner.length > 0) || t.category === 'personaggi' || !!t.pcSheet));
    const pgsInDelete = engine.tokens.filter(t => toDelete.has(t.id) && isPlayerToken(t));

    // Scudo PG: Se stiamo cancellando più token contemporaneamente (es. lasso sui mostri) e sono inclusi accidentalmente dei PG,
    // proteggiamo i PG cancellando solo i mostri/PNG!
    if (toDelete.size > 1 && pgsInDelete.length > 0 && pgsInDelete.length < toDelete.size) {
        engine.tokens = engine.tokens.filter(t => !toDelete.has(t.id) || isPlayerToken(t));
        if (typeof showToast === 'function') {
            showToast("🛡️ Mostri rimossi. I Personaggi dei Giocatori sono stati protetti!");
        }
    } else {
        engine.tokens = engine.tokens.filter(t => !toDelete.has(t.id));
        if (pgsInDelete.length > 0 && typeof showToast === 'function') {
            showToast("🛡️ Token rimosso dalla mappa (è sempre al sicuro nel Roster della Campagna)!");
        }
    }

    engine.selectedTokens.clear();
    engine.selectedTokenId = null;
    updateTokenControlsVisibility(false);
    engine.renderAll();
    syncState();
    if (typeof tokenPanel !== 'undefined' && tokenPanel && tokenPanel.style.display !== 'none') {
        updateMapTokensGallery();
    }
});


function updateTokenHP(e) {
    const targetTokens = getSelectedTargetTokens();
    if (targetTokens.length === 0) return;

    // Se è stata toccata SOLO la checkbox di visibilità PV, aggiorna la visibilità su tutti i token selezionati senza sovrascrivere i loro PV!
    if (e && e.target && e.target.id === 'token-hp-visible') {
        const isVisible = e.target.checked;
        targetTokens.forEach(token => {
            token.hpVisibleToPlayers = isVisible;
            upsertTokenInCampaign(token);
        });
        engine.renderAll();
        syncState(true);
        return;
    }

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

    targetTokens.forEach(token => {
        token.hpMax = maxVal;
        token.hpCurrent = currVal;
        token.hpVisibleToPlayers = isVisible;
        upsertTokenInCampaign(token);
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


document.getElementById('token-owner').addEventListener('change', (e) => {
    const val = e.target.value;
    if (!val) return;
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) {
        e.target.value = '';
        return;
    }

    if (val === '__clear__') {
        targets.forEach(t => { setTokenOwners(t, []); upsertTokenInCampaign(t); });
        if (typeof showToast === 'function') showToast('Controllo impostato su: Solo DM');
    } else if (val === '__all__') {
        const allPlayers = getAvailablePlayerNames();
        targets.forEach(t => { setTokenOwners(t, allPlayers); upsertTokenInCampaign(t); });
        if (typeof showToast === 'function') showToast('Controllo assegnato a tutti i giocatori!');
    } else {
        const cleanVal = val.trim();
        targets.forEach(t => {
            const current = getTokenOwners(t);
            if (!current.some(o => o.toLowerCase() === cleanVal.toLowerCase())) {
                current.push(cleanVal);
            }
            setTokenOwners(t, current);
            upsertTokenInCampaign(t);
        });
        if (typeof showToast === 'function') {
            showToast(targets.length > 1 ? `Giocatore ${cleanVal} assegnato a ${targets.length} token!` : `Giocatore ${cleanVal} assegnato al token!`);
        }
    }

    e.target.value = '';
    window.renderTokenOwnersChips();
    syncState(true);
});

document.getElementById('token-hp-current').addEventListener('input', updateTokenHP);
document.getElementById('token-hp-max').addEventListener('input', updateTokenHP);
document.getElementById('token-hp-current').addEventListener('change', updateTokenHP);
document.getElementById('token-hp-max').addEventListener('change', updateTokenHP);
document.getElementById('token-hp-visible').addEventListener('change', updateTokenHP);

// Listener CA (Classe Armatura)
document.getElementById('token-ac')?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value) || 0;
    const targetTokens = getSelectedTargetTokens();
    targetTokens.forEach(t => {
        t.ac = val;
        upsertTokenInCampaign(t);
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
    const targets = getSelectedTargetTokens();
    const token = targets.length > 0 ? targets[targets.length - 1] : null;
    if (window.compendium) {
        window.compendium.open(token ? token.statblock : null);
    }
});

// Listener apertura Scheda Personaggio (PG)
document.getElementById('btn-open-pcsheet')?.addEventListener('click', () => {
    const targets = getSelectedTargetTokens();
    const token = targets.length > 0 ? targets[targets.length - 1] : null;
    if (window.pcSheetManager) {
        window.pcSheetManager.open(token);
    }
});


function applyHpMod(isHeal) {
    const modInput = document.getElementById('token-hp-mod');
    let modVal = parseInt(modInput.value);
    if (!isNaN(modVal)) {
        modVal = Math.abs(modVal);
        if (!isHeal) modVal = -modVal;
        
        const targetTokens = getSelectedTargetTokens();
        if (targetTokens.length === 0) return;

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

        const primToken = targetTokens[targetTokens.length - 1];
        if (primToken) {
            document.getElementById('token-hp-current').value = primToken.hpCurrent !== undefined ? primToken.hpCurrent : '';
        }

        modInput.value = '';
        if (engine.initiative && engine.initiative.participants && typeof renderTrackerList === 'function') {
            renderTrackerList();
        }
        engine.renderAll();
        syncState(true);
    }
}
document.getElementById('btn-apply-hp-dmg').addEventListener('click', () => applyHpMod(false));
document.getElementById('btn-apply-hp-heal').addEventListener('click', () => applyHpMod(true));

function updateTokenAuraCond() {
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;
    
    let _raw = parseFloat(document.getElementById('token-aura-size').value); if(isNaN(_raw)) _raw = 0; let sizeRaw = Math.max(0.1, _raw);
    
    const unit = document.getElementById('token-aura-unit').value;
    const squares = unit === 'ft' ? sizeRaw / 5 : sizeRaw / 1.5;
    const isActive = document.getElementById('token-aura-active').checked;
    const auraColor = document.getElementById('token-aura-color').value;
    const isHighlight = document.getElementById('token-aura-highlight') ? document.getElementById('token-aura-highlight').checked : true;
    
    const durInput = document.getElementById('token-aura-duration');
    let durVal = durInput ? parseInt(durInput.value) : 0;
    if (isNaN(durVal) || durVal <= 0) durVal = 0;

    let skipFirst = false;
    if (engine.initiative && engine.initiative.active && engine.initiative.participants && engine.initiative.participants.length > 0) {
        const curP = engine.initiative.participants[engine.initiative.currentTurnIndex];
        if (curP && targets.some(t => t.id === curP.tokenId || (t.name && curP.name && t.name.trim().toLowerCase() === curP.name.trim().toLowerCase()))) {
            skipFirst = true;
        }
    }

    targets.forEach(token => {
        token.aura = {
            active: isActive,
            sizeRaw: sizeRaw,
            unit: unit,
            sizePx: squares * engine.grid.size,
            color: auraColor,
            highlightTokens: isHighlight,
            durationRounds: durVal > 0 ? durVal : undefined,
            roundsLeft: durVal > 0 ? durVal : undefined,
            skipFirstDecrement: skipFirst
        };
    });
    
    engine.renderAll();
    syncState(true);
}

document.getElementById('token-aura-active').addEventListener('change', updateTokenAuraCond);
document.getElementById('token-aura-highlight')?.addEventListener('change', updateTokenAuraCond);
document.getElementById('token-aura-size').addEventListener('input', updateTokenAuraCond);
document.getElementById('token-aura-duration')?.addEventListener('input', updateTokenAuraCond);
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

window.renderConditionsList = function() {
    const listDiv = document.getElementById('active-conditions-list');
    if (!listDiv) return;
    listDiv.innerHTML = '';
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;

    // Aggrega tutte le condizioni presenti sui token selezionati
    const condMap = new Map();
    targets.forEach(token => {
        if (token.condition && !token.conditions) {
            if (token.condition.active) token.conditions = [token.condition];
            else token.conditions = [];
            delete token.condition;
        }
        if (!token.conditions) token.conditions = [];
        token.conditions.forEach(cond => {
            const key = (cond.text || cond.type || '').trim();
            if (!key) return;
            if (!condMap.has(key)) {
                condMap.set(key, { cond: cond, count: 1 });
            } else {
                condMap.get(key).count++;
            }
        });
    });

    condMap.forEach((entry, key) => {
        const cond = entry.cond;
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
        const suffix = (targets.length > 1 && entry.count < targets.length) ? ` (${entry.count}/${targets.length})` : '';
        span.innerText = cond.text + suffix;
        
        const btn = document.createElement('button');
        btn.innerText = 'X';
        btn.style.background = '#f44336';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '3px';
        btn.style.cursor = 'pointer';
        
        btn.onclick = () => {
            targets.forEach(token => {
                if (Array.isArray(token.conditions)) {
                    token.conditions = token.conditions.filter(c => (c.text || c.type || '').trim() !== key);
                }
            });
            renderConditionsList();
            engine.renderAll();
            syncState(true);
        };
        
        d.appendChild(span);
        d.appendChild(btn);
        listDiv.appendChild(d);
    });
};

document.getElementById('btn-add-condition').addEventListener('click', () => {
    const targets = getSelectedTargetTokens();
    if (targets.length === 0) return;
    
    const cType = document.getElementById('token-condition-type').value;
    const cLang = document.getElementById('token-condition-lang').value;
    const parts = cType.split(',');
    const text = cLang === 'it' ? parts[0] : parts[1];
    const color = document.getElementById('token-condition-color').value;
    
    targets.forEach(token => {
        if (!token.conditions) {
            if (token.condition && token.condition.active) token.conditions = [token.condition];
            else token.conditions = [];
            delete token.condition;
        }
        const existingIdx = token.conditions.findIndex(c => (c.text || '') === text);
        if (existingIdx >= 0) {
            token.conditions[existingIdx].color = color;
        } else {
            token.conditions.push({
                type: cType,
                lang: cLang,
                color: color,
                text: text
            });
        }
    });
    
    renderConditionsList();
    engine.renderAll();
    syncState(true);
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

document.getElementById('aoe-unit').addEventListener('change', (e) => {
    const input = document.getElementById('aoe-size');
    const inputW = document.getElementById('aoe-width');
    let oldVal = parseFloat(input.value); if (isNaN(oldVal)) oldVal = 0;
    let oldW = parseFloat(inputW.value); if (isNaN(oldW)) oldW = 5;
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

    const highlightTokens = document.getElementById('aoe-highlight-tokens') ? document.getElementById('aoe-highlight-tokens').checked : true;

    const durInput = document.getElementById('aoe-duration');
    let durVal = durInput ? parseInt(durInput.value) : 0;
    if (isNaN(durVal) || durVal <= 0) durVal = 0;

    let casterTokenId = null;
    let casterName = 'DM';
    let casterId = null;
    let skipFirst = false;

    const curP = (engine.initiative && engine.initiative.active && engine.initiative.participants && engine.initiative.participants.length > 0)
        ? engine.initiative.participants[engine.initiative.currentTurnIndex]
        : null;

    if (engine.selectedTokenId) {
        const selTok = engine.tokens.find(t => t.id === engine.selectedTokenId);
        if (selTok) {
            casterTokenId = selTok.id;
            casterName = selTok.name;
            casterId = 'tok_' + selTok.id;
            if (curP && (String(curP.tokenId) === String(selTok.id) || (curP.name && selTok.name && curP.name.trim().toLowerCase() === selTok.name.trim().toLowerCase()))) {
                skipFirst = true;
            }
        }
    } else if (curP) {
        casterId = curP.id;
        casterName = curP.name;
        casterTokenId = curP.tokenId || null;
        skipFirst = true; // Lanciato durante il suo turno: non scalare alla chiusura di questo stesso turno!
    }

    engine.shapes.push({
        id: 'aoe_' + Date.now(),
        type: type,
        x: centerWorld.x,
        y: centerWorld.y,
        sizeFt: sizeFt,
        widthFt: widthFt,
        color: color,
        angle: 0,
        visible: true,
        highlightTokens: highlightTokens,
        durationRounds: durVal > 0 ? durVal : undefined,
        roundsLeft: durVal > 0 ? durVal : undefined,
        casterId: casterId,
        casterTokenId: casterTokenId,
        casterName: casterName,
        skipFirstDecrement: skipFirst
    });
    engine.renderAll();
    syncState();
});

const shapeEditDuration = document.getElementById('shape-edit-duration');
if (shapeEditDuration) {
    shapeEditDuration.addEventListener('input', () => {
        const shape = engine.shapes.find(s => s.id === engine.selectedShapeId);
        if (shape) {
            const raw = parseInt(shapeEditDuration.value);
            if (!isNaN(raw) && raw > 0) {
                shape.durationRounds = raw;
                shape.roundsLeft = raw;

                const curP = (engine.initiative && engine.initiative.active && engine.initiative.participants && engine.initiative.participants.length > 0)
                    ? engine.initiative.participants[engine.initiative.currentTurnIndex]
                    : null;

                // Se la sagoma non ha ancora un incantatore valido, collegala al token selezionato o al partecipante di turno
                if (!shape.casterTokenId && (!shape.casterName || shape.casterName === 'DM')) {
                    if (engine.selectedTokenId) {
                        const selTok = engine.tokens.find(t => t.id === engine.selectedTokenId);
                        if (selTok) {
                            shape.casterTokenId = selTok.id;
                            shape.casterName = selTok.name;
                            shape.casterId = 'tok_' + selTok.id;
                        }
                    } else if (curP) {
                        shape.casterId = curP.id;
                        shape.casterName = curP.name;
                        shape.casterTokenId = curP.tokenId || null;
                    }
                }

                // Se impostato durante il turno dell'incantatore in combattimento, salta il primo decremento
                if (curP) {
                    const curName = (curP.name || '').trim().toLowerCase();
                    const sCaster = (shape.casterName || '').trim().toLowerCase();
                    if ((shape.casterTokenId && String(curP.tokenId) === String(shape.casterTokenId)) ||
                        (shape.casterId && String(curP.id) === String(shape.casterId)) ||
                        (shape.casterInitiativeId && String(curP.id) === String(shape.casterInitiativeId)) ||
                        curName === sCaster || curName.startsWith(sCaster + ' ') || curName.includes(sCaster)) {
                        shape.skipFirstDecrement = true;
                        shape.casterInitiativeId = curP.id;
                    }
                }
            } else {
                shape.durationRounds = 0;
                delete shape.roundsLeft;
                delete shape.skipFirstDecrement;
                delete shape.casterInitiativeId;
            }
            engine.renderTokensLayer();
            syncState();
        }
    });
}

const shapeEditHighlight = document.getElementById('shape-edit-highlight-tokens');
if (shapeEditHighlight) {
    shapeEditHighlight.addEventListener('change', (e) => {
        const shape = engine.shapes.find(s => s.id === engine.selectedShapeId);
        if (shape) {
            shape.highlightTokens = e.target.checked;
            engine.renderTokensLayer();
            syncState();
        }
    });
}

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

function openTokenStatblock(token) {
    if (!token) return;
    const now = Date.now();
    if (now - lastStatblockOpenTime < 350) return;
    lastStatblockOpenTime = now;

    if (token.pcSheet || (inferTokenCategory(token) === 'personaggi' && !token.statblock)) {
        if (window.pcSheetManager) {
            window.pcSheetManager.open(token);
            return;
        }
    }

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

window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove, {passive: false});

window.addEventListener('mouseup', handleEnd);
window.addEventListener('touchend', handleEnd);
window.addEventListener('blur', () => {
    if (isDragging || isPanning || (engine && engine.lasso)) {
        handleEnd({});
    }
});
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

let isPinching = false;
let pinchStartDist = 0;
let pinchStartScale = 1;
let pinchStartWorldPos = null;
let pinchMidX = 0;
let pinchMidY = 0;

function handleStart(e) {
    if (e.touches && e.touches.length >= 2) {
        e.preventDefault();
        if (pingTimeout) {
            clearTimeout(pingTimeout);
            pingTimeout = null;
        }
        isPinching = true;
        isDragging = false;
        isPanning = false;
        activeStroke = null;
        activeStrokeType = null;
        clickedTokenForInteraction = null;
        clickedShapeForInteraction = null;
        pendingDeselect = false;
        if (engine && engine.lasso) engine.lasso = null;

        const rect = uiLayer.getBoundingClientRect();
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        pinchStartDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        pinchStartScale = engine.scale;

        pinchMidX = (t0.clientX + t1.clientX) / 2 - rect.left;
        pinchMidY = (t0.clientY + t1.clientY) / 2 - rect.top;
        pinchStartWorldPos = engine.screenToWorld(pinchMidX, pinchMidY);
        return;
    }

    e.preventDefault();
    const pos = getEventPos(e);
    
    if (e.button === 1 || e.button === 2) {
        if (!document.getElementById('lock-dm-map-toggle').checked) {
            isPanning = true;
            startPanX = pos.x - engine.offsetX;
            startPanY = pos.y - engine.offsetY;
            document.body.classList.add('vtt-dragging');
        }
        return;
    }

    const worldPos = engine.screenToWorld(pos.x, pos.y);
    isDragging = true;
    startMouseX = pos.x;
    startMouseY = pos.y;
    document.body.classList.add('vtt-dragging');

    if (currentTool === 'select-lasso') {
        let clickedToken = null;
        const isTouch = e && e.touches && e.touches.length > 0;
        const pad = isTouch ? (10 / Math.min(1, engine.scale)) : 0;
        for (let i = engine.tokens.length - 1; i >= 0; i--) {
            const t = engine.tokens[i];
            if (worldPos.x >= t.x - pad && worldPos.x <= t.x + t.width + pad &&
                worldPos.y >= t.y - pad && worldPos.y <= t.y + t.height + pad) {
                clickedToken = t;
                break;
            }
        }

        if (clickedToken && engine.selectedTokens && engine.selectedTokens.has(clickedToken.id)) {
            // L'utente ha selezionato con il lazo e ora clicca su un token del gruppo per muoverlo:
            // Passa automaticamente a 'move' e attiva il trascinamento del gruppo senza perdere la selezione!
            currentTool = 'move';
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.toggle('active', b.dataset.tool === 'move'));
            updateToolControlsVisibility();
            activeStroke = clickedToken;
            activeStrokeType = 'token';
            engine.selectedTokenId = clickedToken.id;
            if (engine.selectedTokens.size > 1) {
                activeStroke._groupDragOffsets = engine.tokens
                    .filter(gt => gt.id !== activeStroke.id && engine.selectedTokens.has(gt.id))
                    .map(gt => ({ token: gt, dx: gt.x - activeStroke.x, dy: gt.y - activeStroke.y }));
            } else {
                activeStroke._groupDragOffsets = null;
            }
            if (pingTimeout) { clearTimeout(pingTimeout); pingTimeout = null; }
            pendingDeselect = false;
            
            // Ping su token del gruppo se tenuto premuto
            const pingTargetX = clickedToken.x + (clickedToken.width || 0) / 2;
            const pingTargetY = clickedToken.y + (clickedToken.height || 0) / 2;
            pingTimeout = setTimeout(() => {
                pingTimeout = null;
                isPanning = false;
                pendingDeselect = false;
                isDragging = false;
                activeStroke = null;
                activeStrokeType = null;
                clickedTokenForInteraction = null;
                const pId = 'dm_ping_' + Date.now();
                window.lastReceivedPingId = pId;
                engine.pings.push({id: pId, x: pingTargetX, y: pingTargetY, start: Date.now(), color: '#ffcc00'});
                engine.renderUI();
                network.send({ type: 'PING', payload: { id: pId, x: pingTargetX, y: pingTargetY, color: '#ffcc00', t: Date.now() } });
            }, 600);
            
            engine.renderAll();
            return;
        }

        engine.lasso = { startX: worldPos.x, startY: worldPos.y, endX: worldPos.x, endY: worldPos.y };
        if (!e.shiftKey) {
            engine.selectedTokens.clear();
            engine.selectedTokenId = null;
            updateTokenControlsVisibility(false);
        }
        engine.renderAll();
        if (pingTimeout) { clearTimeout(pingTimeout); pingTimeout = null; }
        pendingDeselect = false;
        return;
    }

    if (currentTool === 'move') {
        selectedNote = null;
        document.getElementById('selected-note-controls').style.display = 'none';
        
        let clickedEntity = null;
        
        // 1. Controlla prima il badge o la maniglia AoE in primo piano (priorità di click assoluta sopra i token)
        if (!clickedEntity && engine.shapes && engine.shapes.length > 0) {
            for (let i = engine.shapes.length - 1; i >= 0; i--) {
                const s = engine.shapes[i];
                const dx = worldPos.x - s.x;
                const dy = worldPos.y - s.y;
                const hasTimer = s.durationRounds !== undefined && s.durationRounds !== null && Number(s.durationRounds) > 0;
                let isHit = false;
                if (hasTimer) {
                    isHit = (Math.abs(dx) <= 26 && Math.abs(dy) <= 16) || (dx*dx + dy*dy <= 650);
                } else {
                    isHit = (dx*dx + dy*dy <= 400);
                }
                if (isHit) {
                    clickedEntity = { type: 'shape', ref: s };
                    break;
                }
            }
        }

        // Cerca Note prima
        if (!clickedEntity) {
            for(const n of engine.notes) {
                if (worldPos.x >= n.x - 15 && worldPos.x <= n.x + 15 && worldPos.y >= n.y - 15 && worldPos.y <= n.y + 15) {
                    clickedEntity = { type: 'note', ref: n };
                    break;
                }
            }
        }

        // Cerca token se non hai cliccato una nota o una sagoma
        if (!clickedEntity) {
            const isTouch = e && e.touches && e.touches.length > 0;
            const pad = isTouch ? (10 / Math.min(1, engine.scale)) : 0;
            for (let i = engine.tokens.length - 1; i >= 0; i--) {
                const t = engine.tokens[i];
                if (worldPos.x >= t.x - pad && worldPos.x <= t.x + t.width + pad &&
                    worldPos.y >= t.y - pad && worldPos.y <= t.y + t.height + pad) {
                    clickedEntity = { type: 'token', ref: t };
                    clickedTokenForInteraction = t;
                    break;
                }
            }
        }

        // Fallback per click su sagoma AoE (raggio fino a ~24px)
        if (!clickedEntity && engine.shapes && engine.shapes.length > 0) {
            for (let i = engine.shapes.length - 1; i >= 0; i--) {
                const s = engine.shapes[i];
                const dx = worldPos.x - s.x;
                const dy = worldPos.y - s.y;
                if (dx*dx + dy*dy < 600) {
                    clickedEntity = { type: 'shape', ref: s };
                    break;
                }
            }
        }

        engine.selectedShapeId = null;
        document.getElementById('selected-shape-controls').style.display = 'none';

        if (clickedEntity) {
            if (pingTimeout) { clearTimeout(pingTimeout); pingTimeout = null; }
            pendingDeselect = false;
            const ent = clickedEntity.ref;
            if (clickedEntity.type === 'note') {
                engine.selectedTokenId = null;
                updateTokenControlsVisibility(false);
                selectedNote = ent;
                document.getElementById('selected-note-controls').style.display = 'block';
                document.getElementById('note-title').value = ent.title || "";
                document.getElementById('note-text').value = ent.text || "";
                activeStroke = ent;
                activeStrokeType = 'note';

                pingTimeout = setTimeout(() => {
                    pingTimeout = null;
                    isPanning = false;
                    pendingDeselect = false;
                    isDragging = false;
                    activeStroke = null;
                    activeStrokeType = null;
                    const pId = 'dm_ping_' + Date.now();
                    window.lastReceivedPingId = pId;
                    engine.pings.push({id: pId, x: ent.x, y: ent.y, start: Date.now(), color: '#ffcc00'});
                    engine.renderUI();
                    network.send({ type: 'PING', payload: { id: pId, x: ent.x, y: ent.y, color: '#ffcc00', t: Date.now() } });
                }, 600);
            } else if (clickedEntity.type === 'token') {
                if (e.shiftKey) {
                    if (engine.selectedTokens.has(ent.id)) {
                        engine.selectedTokens.delete(ent.id);
                        engine.selectedTokenId = engine.selectedTokens.size > 0 ? Array.from(engine.selectedTokens).pop() : null;
                        activeStroke = null;
                        activeStrokeType = null;
                    } else {
                        engine.selectedTokens.add(ent.id);
                        engine.selectedTokenId = ent.id;
                        activeStroke = ent;
                        activeStrokeType = 'token';
                    }
                } else {
                    if (!engine.selectedTokens.has(ent.id)) {
                        engine.selectedTokens.clear();
                        engine.selectedTokens.add(ent.id);
                    }
                    engine.selectedTokenId = ent.id;
                    activeStroke = ent;
                    activeStrokeType = 'token';
                }

                // Se stiamo trascinando un token che fa parte di una selezione multipla, prepara gli offset del gruppo!
                if (activeStroke && engine.selectedTokens && engine.selectedTokens.size > 1 && engine.selectedTokens.has(activeStroke.id)) {
                    activeStroke._groupDragOffsets = engine.tokens
                        .filter(gt => gt.id !== activeStroke.id && engine.selectedTokens.has(gt.id))
                        .map(gt => ({ token: gt, dx: gt.x - activeStroke.x, dy: gt.y - activeStroke.y }));
                } else if (activeStroke) {
                    activeStroke._groupDragOffsets = null;
                }
                
                if (engine.selectedTokenId || (engine.selectedTokens && engine.selectedTokens.size > 0)) {
                    const prim = engine.tokens.find(t => t.id === engine.selectedTokenId) || ent;
                    if (window.updateSelectedTokenControls) window.updateSelectedTokenControls(prim);
                } else {
                    updateTokenControlsVisibility(false);
                }

                // Avvia Ping su Creatura se tenuta premuta (senza shift)
                if (!e.shiftKey) {
                    const pingTargetX = ent.x + (ent.width || 0) / 2;
                    const pingTargetY = ent.y + (ent.height || 0) / 2;
                    pingTimeout = setTimeout(() => {
                        pingTimeout = null;
                        isPanning = false;
                        pendingDeselect = false;
                        isDragging = false;
                        activeStroke = null;
                        activeStrokeType = null;
                        clickedTokenForInteraction = null;
                        const pId = 'dm_ping_' + Date.now();
                        window.lastReceivedPingId = pId;
                        engine.pings.push({id: pId, x: pingTargetX, y: pingTargetY, start: Date.now(), color: '#ffcc00'});
                        engine.renderUI();
                        network.send({ type: 'PING', payload: { id: pId, x: pingTargetX, y: pingTargetY, color: '#ffcc00', t: Date.now() } });
                    }, 600);
                }
            } else if (clickedEntity.type === 'shape') {
                engine.selectedTokenId = null;
                if (engine.selectedTokens) engine.selectedTokens.clear();
                updateTokenControlsVisibility(false);
                activeStroke = ent;
                activeStrokeType = 'shape';
                clickedShapeForInteraction = ent;
            }
        } else {
            activeStroke = null;
            activeStrokeType = null;
            startMouseX = pos.x;
            startMouseY = pos.y;
            if (pingTimeout) { clearTimeout(pingTimeout); pingTimeout = null; }
            pingTimeout = setTimeout(() => {
                pingTimeout = null;
                isPanning = false;
                pendingDeselect = false;
                const pId = 'dm_ping_' + Date.now();
                window.lastReceivedPingId = pId;
                engine.pings.push({id: pId, x: worldPos.x, y: worldPos.y, start: Date.now(), color: '#ffcc00'});
                engine.renderUI();
                network.send({ type: 'PING', payload: { id: pId, x: worldPos.x, y: worldPos.y, color: '#ffcc00', t: Date.now() } });
            }, 600);

            if (!e.shiftKey) {
                pendingDeselect = true;
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
            startWorldY: worldPos.y,
            tokensStart: engine.tokens.map(t => ({ token: t, startX: t.x, startY: t.y })),
            shapesStart: (engine.shapes || []).map(s => ({ shape: s, startX: s.x, startY: s.y })),
            notesStart: (engine.notes || []).map(n => ({ note: n, startX: n.x, startY: n.y }))
        };
        activeStrokeType = 'grid';
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
    if (isPinching && e.touches && e.touches.length >= 2) {
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

        if (pinchStartDist > 5 && pinchStartWorldPos) {
            const factor = curDist / pinchStartDist;
            let newScale = pinchStartScale * factor;
            newScale = Math.max(0.1, Math.min(newScale, 10));
            engine.scale = newScale;

            engine.offsetX = curMidX - pinchStartWorldPos.x * engine.scale;
            engine.offsetY = curMidY - pinchStartWorldPos.y * engine.scale;

            engine.renderAll();
            if (isViewSyncActive && (Date.now() - (window.lastPinchSyncSend || 0) > 40)) {
                window.lastPinchSyncSend = Date.now();
                sendViewSync();
            }
        }
        return;
    }

    if (e.touches && e.touches.length >= 2 && pingTimeout) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
    }

    if ((isDragging || isPanning || (currentTool === 'select-lasso' && engine.lasso)) && e.buttons === 0) {
        handleEnd(e);
        return;
    }

    if (!isDragging && !isPanning && !(currentTool === 'select-lasso' && engine.lasso) && !pingTimeout && !activeLaser && !activeStroke) {
        if (currentTool.startsWith('fog-')) {
            const pos = getEventPos(e);
            const worldPos = engine.screenToWorld(pos.x, pos.y);
            engine.brushPreview = {
                x: worldPos.x,
                y: worldPos.y,
                shape: document.getElementById('fog-brush-shape').value,
                size: parseInt(document.getElementById('fog-brush-size').value) || 150,
                isErase: currentTool === 'fog-erase'
            };
            engine.renderUI();
        } else if (engine.brushPreview) {
            engine.brushPreview = null;
            engine.renderUI();
        }
        return;
    }

    const pos = getEventPos(e);
    const worldPos = engine.screenToWorld(pos.x, pos.y);

    if (pingTimeout) {
        if (Math.hypot(pos.x - startMouseX, pos.y - startMouseY) > 10) {
            clearTimeout(pingTimeout);
            pingTimeout = null;
        } else {
            return;
        }
    }
    if (pendingDeselect && Math.hypot(pos.x - startMouseX, pos.y - startMouseY) > 10) {
        pendingDeselect = false;
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

    if (currentTool === 'move' && typeof activeStroke === 'object' && activeStroke !== null) {
        const isToken = activeStrokeType === 'token' || (activeStroke && engine.tokens.some(t => t === activeStroke || (activeStroke.id && t.id === activeStroke.id)));
        const isShape = !isToken && (activeStrokeType === 'shape' || (activeStroke && ((activeStroke.id && String(activeStroke.id).startsWith('aoe_')) || engine.shapes.some(s => s === activeStroke || (activeStroke.id && s.id === activeStroke.id)))));

        if (isToken) {
            activeStroke.x = worldPos.x - activeStroke.width/2;
            activeStroke.y = worldPos.y - activeStroke.height/2;
            if (activeStroke._groupDragOffsets && activeStroke._groupDragOffsets.length > 0) {
                activeStroke._groupDragOffsets.forEach(item => {
                    item.token.x = activeStroke.x + item.dx;
                    item.token.y = activeStroke.y + item.dy;
                });
            }
            if (Date.now() - (window.lastGmTokenMoveSend || 0) > 35) {
                window.lastGmTokenMoveSend = Date.now();
                if (activeStroke._groupDragOffsets && activeStroke._groupDragOffsets.length > 0) {
                    const batch = [];
                    if (activeStroke.visible !== false) {
                        batch.push({ id: activeStroke.id, x: activeStroke.x, y: activeStroke.y });
                    }
                    activeStroke._groupDragOffsets.forEach(item => {
                        if (item.token.visible !== false) {
                            batch.push({ id: item.token.id, x: item.token.x, y: item.token.y });
                        }
                    });
                    if (batch.length > 0) {
                        network.send({
                            type: 'REMOTE_TOKENS_MOVE_BATCH',
                            ephemeral: true,
                            payload: batch
                        });
                    }
                } else {
                    if (activeStroke.visible !== false) {
                        network.send({
                            type: 'REMOTE_TOKEN_MOVE',
                            ephemeral: true,
                            payload: { id: activeStroke.id, x: activeStroke.x, y: activeStroke.y }
                        });
                    }
                }
            }
            engine.requestTokenLayerRender();
        } else if (isShape) {
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
            engine.requestTokenLayerRender();
        } else {
            activeStroke.x = worldPos.x;
            activeStroke.y = worldPos.y;
            engine.renderAll();
        }
    } else if (currentTool === 'move-grid' && activeStroke) {
        const dx = worldPos.x - activeStroke.startWorldX;
        const dy = worldPos.y - activeStroke.startWorldY;
        engine.grid.offsetX = activeStroke.startOffsetX + dx;
        engine.grid.offsetY = activeStroke.startOffsetY + dy;

        const isAnchor = document.getElementById('grid-anchor-objects')?.checked !== false;
        if (isAnchor) {
            if (activeStroke.tokensStart) {
                activeStroke.tokensStart.forEach(item => {
                    item.token.x = item.startX + dx;
                    item.token.y = item.startY + dy;
                });
            }
            if (activeStroke.shapesStart) {
                activeStroke.shapesStart.forEach(item => {
                    item.shape.x = item.startX + dx;
                    item.shape.y = item.startY + dy;
                });
            }
            if (activeStroke.notesStart) {
                activeStroke.notesStart.forEach(item => {
                    item.note.x = item.startX + dx;
                    item.note.y = item.startY + dy;
                });
            }
        }

        engine.renderAll();
        if (Date.now() - (window.lastGridMoveSend || 0) > 40) {
            window.lastGridMoveSend = Date.now();
            network.send({
                type: 'GRID_MOVE_LIVE',
                payload: {
                    offsetX: engine.grid.offsetX,
                    offsetY: engine.grid.offsetY,
                    dx: dx,
                    dy: dy,
                    anchor: isAnchor
                }
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
    if (isPinching) {
        if (e && e.touches && e.touches.length >= 2) {
            return;
        }
        isPinching = false;
        pinchStartDist = 0;
        pinchStartWorldPos = null;
        if (pingTimeout) {
            clearTimeout(pingTimeout);
            pingTimeout = null;
        }
        document.body.classList.remove('vtt-dragging');
        engine.renderAll();
        if (isViewSyncActive) {
            sendViewSync(true);
        }
        syncState();
        return;
    }

    document.body.classList.remove('vtt-dragging');
    const pos = getEventPos(e);

    if (pingTimeout) {
        clearTimeout(pingTimeout);
        pingTimeout = null;
    }

    if (pendingDeselect) {
        pendingDeselect = false;
        engine.selectedTokens.clear();
        engine.selectedTokenId = null;
        updateTokenControlsVisibility(false);
        engine.renderAll();
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
                const isTouch = e && ((e.touches && e.touches.length > 0) || (e.changedTouches && e.changedTouches.length > 0) || e.pointerType === 'touch');
                const maxInterval = isTouch ? 500 : 380;
                if (lastClickedTokenId === clicked.id && (now - lastClickedTokenTime) < maxInterval) {
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
                        if (engine.selectedTokenId === clicked.id) {
                            engine.selectedTokenId = engine.selectedTokens.size > 0 ? Array.from(engine.selectedTokens).pop() : null;
                        }
                    } else {
                        engine.selectedTokens.add(clicked.id);
                        engine.selectedTokenId = clicked.id;
                    }
                } else {
                    engine.selectedTokens.clear();
                    engine.selectedTokens.add(clicked.id);
                    engine.selectedTokenId = clicked.id;
                }
                currentTool = 'move';
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.toggle('active', b.dataset.tool === 'move'));
                updateToolControlsVisibility();
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
                currentTool = 'move';
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.toggle('active', b.dataset.tool === 'move'));
                updateToolControlsVisibility();
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
            updateTokenControlsVisibility(false);
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

    if (currentTool === 'move' && typeof activeStroke === 'object' && activeStroke !== null) {
        const isToken = activeStrokeType === 'token' || (activeStroke && engine.tokens.some(t => t === activeStroke || (activeStroke.id && t.id === activeStroke.id)));
        const isShape = !isToken && (activeStrokeType === 'shape' || (activeStroke && ((activeStroke.id && String(activeStroke.id).startsWith('aoe_')) || engine.shapes.some(s => s === activeStroke || (activeStroke.id && s.id === activeStroke.id)))));

        // Snap per i token. Le AoE si muovono liberamente e non si "snappano".
        if (isToken) {
            const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
            const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
            
            activeStroke.x = Math.round((activeStroke.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
            activeStroke.y = Math.round((activeStroke.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
            if (activeStroke._groupDragOffsets && activeStroke._groupDragOffsets.length > 0) {
                const batch = [];
                if (activeStroke.visible !== false) {
                    batch.push({ id: activeStroke.id, x: activeStroke.x, y: activeStroke.y });
                }
                activeStroke._groupDragOffsets.forEach(item => {
                    item.token.x = Math.round(((activeStroke.x + item.dx) - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
                    item.token.y = Math.round(((activeStroke.y + item.dy) - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
                    if (item.token.visible !== false) {
                        batch.push({ id: item.token.id, x: item.token.x, y: item.token.y });
                    }
                });
                network.send({
                    type: 'REMOTE_TOKENS_MOVE_BATCH',
                    final: true,
                    payload: batch
                });
                activeStroke._groupDragOffsets = null;
            } else {
                if (activeStroke.visible !== false) {
                    network.send({
                        type: 'REMOTE_TOKEN_MOVE',
                        final: true,
                        payload: { id: activeStroke.id, x: activeStroke.x, y: activeStroke.y }
                    });
                }
            }
            if (currentMapBase64) markMapDirty(true);
            engine.renderTokensLayer();
        } else if (isShape) {
            network.send({
                type: 'REMOTE_SHAPE_MOVE',
                final: true,
                payload: { id: activeStroke.id, x: activeStroke.x, y: activeStroke.y }
            });
            if (currentMapBase64) markMapDirty(true);
        } else {
            syncState(true);
        }
    } else if (currentTool === 'move-grid') {
        const isAnchor = document.getElementById('grid-anchor-objects')?.checked !== false;
        if (isAnchor && activeStroke) {
            const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
            const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
            engine.tokens.forEach(t => {
                t.x = Math.round((t.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
                t.y = Math.round((t.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;
            });
        }
        if (currentMapBase64) markMapDirty(true);
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
        markMapDirty(true);
    } else if (currentTool.startsWith('fog-')) {
        syncFog();
        markMapDirty(true);
    }

    isDragging = false;
    activeStroke = null;
    activeStrokeType = null;
    engine.renderAll();

    // Rilevamento rapido doppio click / doppio tap per aprire la scheda
    if (clickedTokenForInteraction) {
        const isTouch = e && ((e.touches && e.touches.length > 0) || (e.changedTouches && e.changedTouches.length > 0) || e.pointerType === 'touch');
        const maxMove = isTouch ? 25 : 10;
        const maxInterval = isTouch ? 500 : 380;
        const moveDist = Math.hypot(pos.x - startMouseX, pos.y - startMouseY);
        if (moveDist < maxMove) {
            const now = Date.now();
            if (lastClickedTokenId === clickedTokenForInteraction.id && (now - lastClickedTokenTime) < maxInterval) {
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

    if (clickedShapeForInteraction) {
        const isTouch = e && ((e.touches && e.touches.length > 0) || (e.changedTouches && e.changedTouches.length > 0) || e.pointerType === 'touch');
        const maxMove = isTouch ? 25 : 10;
        const moveDist = Math.hypot(pos.x - startMouseX, pos.y - startMouseY);

        if (moveDist < maxMove) {
            // È stato un CLICK/TAP sul bottone AoE: apri il pannello di modifica!
            const ent = clickedShapeForInteraction;
            engine.selectedShapeId = ent.id;
            if (aoePanel) aoePanel.style.display = 'flex';
            document.getElementById('selected-shape-controls').style.display = 'flex';
            document.getElementById('shape-edit-width').style.display = ent.type === 'line' ? 'block' : 'none';
            document.getElementById('shape-edit-unit').value = 'ft';
            document.getElementById('shape-edit-size').step = '5';
            document.getElementById('shape-edit-width').step = '1';
            document.getElementById('shape-edit-size').value = Math.round(ent.sizeFt * 10) / 10;
            document.getElementById('shape-edit-width').value = ent.widthFt !== undefined ? Math.round(ent.widthFt * 10) / 10 : 5;
            const highlightCb = document.getElementById('shape-edit-highlight-tokens');
            if (highlightCb) highlightCb.checked = ent.highlightTokens !== false;
            const durEdit = document.getElementById('shape-edit-duration');
            if (durEdit) {
                durEdit.value = (ent.roundsLeft !== undefined) ? ent.roundsLeft : (ent.durationRounds || '');
            }
            engine.renderTokensLayer();
        } else {
            // È stato un TRASCINAMENTO (spostamento): NON aprire il pannello di modifica!
            engine.selectedShapeId = null;
            document.getElementById('selected-shape-controls').style.display = 'none';
            engine.renderTokensLayer();
        }
        clickedShapeForInteraction = null;
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


let toastHideTimeout = null;
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
        t.style.background = 'rgba(46, 125, 50, 0.95)';
        t.style.border = '1px solid #81c784';
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
    t.innerText = msg;
    t.style.opacity = '1';
    if (toastHideTimeout) clearTimeout(toastHideTimeout);
    toastHideTimeout = setTimeout(() => {
        t.style.opacity = '0';
        toastHideTimeout = null;
    }, 3200);
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
            const dmHw = document.getElementById('dm-handout-window');
            dmHw.style.display = 'flex';
            
            // Posiziona al centro della MAPPA del DM (escludendo la sidebar)
            const mapEl = document.getElementById('main-canvas-container');
            const mapRect = mapEl ? mapEl.getBoundingClientRect() : { left: 350, top: 0, width: window.innerWidth - 350, height: window.innerHeight };
            const initLeft = Math.round(mapRect.left + (mapRect.width - 500) / 2);
            const initTop = Math.round(Math.max(20, (mapRect.height - 500) / 2));
            
            dmHw.style.left = Math.max(mapRect.left + 10, initLeft) + 'px';
            dmHw.style.top = Math.max(20, initTop) + 'px';
            dmHw.style.width = '500px';
            dmHw.style.height = '500px';
            dmHw.style.right = 'auto';
            dmHw.style.bottom = 'auto';
        };
        reader.readAsDataURL(file);
    }
    e.target.value = '';
});


document.getElementById('btn-dm-handout-transmit').addEventListener('click', () => {
    if (engine.sharedImageData) {
        engine.sharedImageId = 'img_' + Date.now();
        if (isSyncHandoutActive) {
            network.send({
                type: 'HANDOUT_RECT_LIVE',
                payload: {
                    ...getDmHandoutRect(),
                    syncHandout: true
                }
            });
        }
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

// Dragging logic for DM Handout Window (PC mouse + Tablet touch)
let isDraggingHandoutDM = false;
let handoutDMOffsetX = 0, handoutDMOffsetY = 0;
const dmHandoutWindow = document.getElementById('dm-handout-window');
const dmHandoutHeader = document.getElementById('dm-handout-header');
if (dmHandoutHeader) {
    dmHandoutHeader.style.touchAction = 'none';
    dmHandoutHeader.addEventListener('mousedown', (e) => {
        if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button') || e.target.closest('label')) return;
        isDraggingHandoutDM = true;
        const rect = dmHandoutWindow.getBoundingClientRect();
        handoutDMOffsetX = e.clientX - rect.left;
        handoutDMOffsetY = e.clientY - rect.top;
    });
    dmHandoutHeader.addEventListener('touchstart', (e) => {
        if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button') || e.target.closest('label')) return;
        if (!e.touches || e.touches.length !== 1) return;
        if (e.cancelable) e.preventDefault();
        isDraggingHandoutDM = true;
        const rect = dmHandoutWindow.getBoundingClientRect();
        handoutDMOffsetX = e.touches[0].clientX - rect.left;
        handoutDMOffsetY = e.touches[0].clientY - rect.top;
        dmHandoutWindow.style.right = 'auto';
        dmHandoutWindow.style.bottom = 'auto';
        dmHandoutWindow.style.left = rect.left + 'px';
        dmHandoutWindow.style.top = rect.top + 'px';
    }, { passive: false });
}

function handleDmHandoutMove(clientX, clientY) {
    if (!isDraggingHandoutDM) return;
    dmHandoutWindow.style.left = (clientX - handoutDMOffsetX) + 'px';
    dmHandoutWindow.style.top = (clientY - handoutDMOffsetY) + 'px';
    dmHandoutWindow.style.right = 'auto';
    dmHandoutWindow.style.bottom = 'auto';
    if (isSyncHandoutActive && Date.now() - (window.lastHandoutMoveSend || 0) > 30) {
        window.lastHandoutMoveSend = Date.now();
        network.send({
            type: 'HANDOUT_RECT_LIVE',
            payload: {
                ...getDmHandoutRect(),
                syncHandout: true
            }
        });
    }
}

document.addEventListener('mousemove', (e) => {
    handleDmHandoutMove(e.clientX, e.clientY);
});
document.addEventListener('touchmove', (e) => {
    if (!isDraggingHandoutDM || !e.touches || e.touches.length !== 1) return;
    if (e.cancelable) e.preventDefault();
    handleDmHandoutMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

function handleDmHandoutEnd() {
    if (isDraggingHandoutDM) {
        isDraggingHandoutDM = false;
        if (isSyncHandoutActive) {
            network.send({
                type: 'HANDOUT_RECT_LIVE',
                payload: {
                    ...getDmHandoutRect(),
                    syncHandout: true
                }
            });
            syncState(false);
        }
    }
}
document.addEventListener('mouseup', handleDmHandoutEnd);
document.addEventListener('touchend', handleDmHandoutEnd);
document.addEventListener('touchcancel', handleDmHandoutEnd);



// Sincronizza geometria handout
const handoutResizeObserver = new ResizeObserver(() => {
    if (isSyncHandoutActive && document.getElementById('dm-handout-window').style.display !== 'none') {
        if (Date.now() - (window.lastHandoutResizeSend || 0) > 30) {
            window.lastHandoutResizeSend = Date.now();
            network.send({
                type: 'HANDOUT_RECT_LIVE',
                payload: {
                    ...getDmHandoutRect(),
                    syncHandout: true
                }
            });
        }
    }
});
handoutResizeObserver.observe(document.getElementById('dm-handout-window'));
