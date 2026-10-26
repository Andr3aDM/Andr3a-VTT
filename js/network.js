class NetworkManager {
    constructor(role) {
        this.role = role; // 'dm' or 'player'
        this.mode = 'offline'; // 'offline', 'host', 'client'
        this.peer = null;
        this.connections = {}; // Per il DM: mappa peerId -> { conn, name, chunkQueue, pumping }
        this.hostConn = null;  // Per il giocatore: connessione verso il DM
        this.roomId = null;
        this.playerName = null;
        this.playerId = null;
        
        this.onMessageCallback = null;
        this.onConnectCallback = null;
        this.onDisconnectCallback = null;
        this.listeners = [];
        this._incomingChunks = {}; // chunkId -> { total, received, parts }
        this._chunkSeq = 0;

        // Setup offline channel di base (solo per modalità locale/TV)
        this.bc = new BroadcastChannel('vtt_channel');
        this.bc.onmessage = (e) => {
            // Se questo tab è connesso come client online PeerJS, ignora sempre il BroadcastChannel locale
            // per evitare collisioni e "salti indietro nel tempo" quando si testa sullo stesso PC!
            if (this.mode === 'client') return;
            this._dispatch(e.data, 'local');
        };
    }

    onMessage(cb) { this.onMessageCallback = cb; }
    onConnect(cb) { this.onConnectCallback = cb; }
    onDisconnect(cb) { this.onDisconnectCallback = cb; }
    addListener(cb) {
        if (!this.listeners) this.listeners = [];
        this.listeners.push(cb);
    }

    _handleRawData(data, peerId) {
        if (!data) return;
        if (data.__chunked) {
            const cid = data.id;
            if (!this._incomingChunks[cid]) {
                this._incomingChunks[cid] = {
                    total: data.total,
                    count: 0,
                    parts: new Array(data.total)
                };
            }
            const entry = this._incomingChunks[cid];
            if (entry.parts[data.idx] === undefined) {
                entry.parts[data.idx] = data.chunk;
                entry.count++;
            }
            if (entry.count === entry.total) {
                const fullJson = entry.parts.join('');
                delete this._incomingChunks[cid];
                try {
                    const parsed = JSON.parse(fullJson);
                    this._dispatch(parsed, peerId);
                } catch (err) {
                    console.error("Errore riassemblaggio pacchetto chunked:", err);
                }
            }
            return;
        }
        this._dispatch(data, peerId);
    }

    _dispatch(data, peerId) {
        if (this.onMessageCallback) this.onMessageCallback(data, peerId);
        if (this.listeners) {
            for (let i = 0; i < this.listeners.length; i++) {
                try { this.listeners[i](data, peerId); } catch(e) { console.error(e); }
            }
        }
    }

    // -- INIT OFFLINE --
    startOffline() {
        this.mode = 'offline';
        console.log("Rete: Modalità Offline (Locale)");
        if (this.onConnectCallback) this.onConnectCallback();
    }

    // -- DM HOST --
    async hostRoom() {
        return new Promise((resolve, reject) => {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            const getRandomChar = (charset) => {
                if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
                    const u = new Uint32Array(1);
                    window.crypto.getRandomValues(u);
                    return charset.charAt(u[0] % charset.length);
                }
                return charset.charAt(Math.floor(Math.random() * charset.length));
            };
            let id = "";
            for(let i=0; i<4; i++) id += getRandomChar(letters);
            id += "-";
            for(let i=0; i<4; i++) id += getRandomChar(numbers);
            
            this.roomId = id;
            this.peer = new Peer(id);
            
            this.peer.on('open', (id) => {
                this.mode = 'host';
                console.log('Stanza online creata con ID:', id);
                resolve(id);
            });
            
            this.peer.on('error', (err) => reject(err));
            
            this.peer.on('connection', (conn) => {
                console.log("Nuovo giocatore in connessione...");
                conn.on('open', () => {});
                conn.on('data', (data) => {
                    if (data && data.type === 'PLAYER_JOIN') {
                        const pid = conn.peer;
                        const joinName = (data.payload && data.payload.name ? String(data.payload.name) : '').trim() || 'Giocatore';
                        const normJoin = joinName.toLowerCase();
                        const incomingToken = data.payload ? data.payload.sessionToken : null;

                        // Se esiste già una connessione con lo stesso nome:
                        let isReconnect = false;
                        for (let oldPid in this.connections) {
                            if (oldPid !== pid && this.connections[oldPid]) {
                                const existingName = (this.connections[oldPid].name || '').trim().toLowerCase();
                                if (existingName === normJoin) {
                                    const oldEntry = this.connections[oldPid];
                                    const oldConn = oldEntry.conn;

                                    // Se la vecchia connessione è ancora attiva e ha un token diverso: respingi tentativo di hijacking
                                    if (oldConn && oldConn.open && oldEntry.sessionToken && incomingToken && oldEntry.sessionToken !== incomingToken) {
                                        console.warn(`Tentativo di connessione con nome duplicato rifiutato per ${joinName}`);
                                        conn.send({
                                            type: 'JOIN_REJECTED',
                                            reason: `Il nome "${joinName}" è già utilizzato da un altro giocatore attualmente connesso.`
                                        });
                                        setTimeout(() => { try { conn.close(); } catch (e) {} }, 400);
                                        return;
                                    }

                                    isReconnect = true;
                                    oldEntry.chunkQueue = [];
                                    delete this.connections[oldPid];
                                    try { if (oldConn && oldConn !== conn) oldConn.close(); } catch (e) {}
                                }
                            }
                        }

                        this.connections[pid] = {
                            conn: conn,
                            name: joinName,
                            sessionToken: incomingToken,
                            chunkQueue: [],
                            pumping: false
                        };
                        console.log(`Giocatore ${joinName} unito.`);
                        conn.send({ type: 'JOIN_ACCEPTED', payload: { name: joinName } });
                        if (this.onConnectCallback) this.onConnectCallback(joinName, pid, isReconnect);
                    } else if (!this.connections[conn.peer]) {
                        // Ignora pacchetti non autenticati prima del join
                        return;
                    }
                    this._handleRawData(data, conn.peer);
                });
                const handleConnClose = () => {
                    for (let k in this.connections) {
                        if (this.connections[k].conn === conn) {
                            const leftName = this.connections[k].name;
                            console.log(`Giocatore ${leftName} disconnesso.`);
                            this.connections[k].chunkQueue = [];
                            delete this.connections[k];
                            if (this.onDisconnectCallback) this.onDisconnectCallback(leftName, k);
                            break;
                        }
                    }
                };
                conn.on('close', handleConnClose);
                conn.on('error', handleConnClose);
            });
        });
    }

    // -- PLAYER JOIN --
    async joinRoom(roomId, playerName) {
        return new Promise((resolve, reject) => {
            this.roomId = roomId.toUpperCase();
            this.playerName = playerName;
            this.playerId = 'player_' + Date.now();
            this.mode = 'client';

            let sessionKey = 'vtt_sess_' + this.roomId + '_' + encodeURIComponent(playerName.trim().toLowerCase());
            let sessionToken = null;
            try {
                sessionToken = sessionStorage.getItem(sessionKey);
                if (!sessionToken) {
                    sessionToken = 'tok_' + Math.random().toString(36).substring(2) + '_' + Date.now();
                    sessionStorage.setItem(sessionKey, sessionToken);
                }
            } catch (e) {
                sessionToken = 'tok_' + Math.random().toString(36).substring(2) + '_' + Date.now();
            }
            this.sessionToken = sessionToken;

            // Chiudi subito il BroadcastChannel locale per evitare doppi messaggi e desincronizzazioni
            // quando si aprono più tab sullo stesso PC!
            if (this.bc) {
                try {
                    this.bc.onmessage = null;
                    this.bc.close();
                } catch (e) {}
                this.bc = null;
            }
            
            this.peer = new Peer();
            this.peer.on('open', (id) => {
                this.hostConn = this.peer.connect(this.roomId, { reliable: true });
                
                this.hostConn.on('open', () => {
                    this.mode = 'client';
                    this.hostConn.send({
                        type: 'PLAYER_JOIN',
                        payload: { name: this.playerName, id: this.playerId, sessionToken: this.sessionToken }
                    });
                });
                
                this.hostConn.on('data', (data) => {
                    if (data && data.type === 'JOIN_ACCEPTED') {
                        console.log("Connessione accettata dal DM.");
                        resolve();
                        if(this.onConnectCallback) this.onConnectCallback();
                    } else if (data && data.type === 'JOIN_REJECTED') {
                        console.warn("Connessione rifiutata dal DM:", data.reason);
                        reject(new Error(data.reason || "Accesso rifiutato dal DM."));
                        return;
                    }
                    this._handleRawData(data, 'dm');
                });
                
                this.hostConn.on('error', (err) => reject(err));
            });
            this.peer.on('error', (err) => reject(err));
        });
    }

    _canSendToConn(conn, isEphemeral) {
        if (!conn || !conn.open) return false;
        if (isEphemeral && conn.dataChannel && typeof conn.dataChannel.bufferedAmount === 'number') {
            if (conn.dataChannel.bufferedAmount > 32768) {
                return false;
            }
        }
        return true;
    }

    _isEphemeralMessage(data) {
        if (!data || data.final === true) return false;
        if (data.ephemeral === true) return true;
        const t = data.type;
        return (
            t === 'VIEW_SYNC' ||
            t === 'LASER_SYNC' ||
            t === 'GRID_MOVE_LIVE' ||
            t === 'LIVE_DRAW_POINT' ||
            t === 'HANDOUT_RECT_LIVE' ||
            t === 'PLAYER_MOVE_TOKEN' ||
            t === 'PLAYER_MOVE_SHAPE' ||
            (t === 'REMOTE_TOKEN_MOVE' && !data.final) ||
            (t === 'REMOTE_TOKENS_MOVE_BATCH' && !data.final) ||
            (t === 'REMOTE_SHAPE_MOVE' && !data.final)
        );
    }

    _isLargeMessage(data) {
        if (!data) return false;
        const t = data.type;
        return (
            t === 'MAP_UPDATE' ||
            t === 'FOG_SYNC' ||
            t === 'SHARED_IMAGE_DATA' ||
            t === 'TOKEN_IMAGE_SYNC'
        );
    }

    _enqueueChunkedToPeer(peerEntry, data) {
        if (!peerEntry || !peerEntry.conn || !peerEntry.conn.open) return;
        let jsonStr;
        try {
            jsonStr = JSON.stringify(data);
        } catch (e) {
            return;
        }
        // Se il pacchetto è piccolo (< 24 KB), invialo direttamente senza spezzettare
        const CHUNK_SIZE = 24576;
        if (jsonStr.length <= CHUNK_SIZE) {
            peerEntry.conn.send(data);
            return;
        }

        // Se arriva una nuova MAP_UPDATE o FOG_SYNC per questo peer, rimuovi eventuali vecchi chunk dello stesso tipo ancora in coda!
        if (data.type === 'MAP_UPDATE' || data.type === 'FOG_SYNC') {
            peerEntry.chunkQueue = peerEntry.chunkQueue.filter(item => item.msgType !== data.type);
        }

        const chunkId = 'chk_' + (++this._chunkSeq) + '_' + Date.now();
        const total = Math.ceil(jsonStr.length / CHUNK_SIZE);
        for (let i = 0; i < total; i++) {
            peerEntry.chunkQueue.push({
                msgType: data.type,
                packet: {
                    __chunked: true,
                    id: chunkId,
                    idx: i,
                    total: total,
                    chunk: jsonStr.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
                }
            });
        }
        this._pumpPeerQueue(peerEntry);
    }

    _pumpPeerQueue(peerEntry) {
        if (!peerEntry || peerEntry.pumping) return;
        peerEntry.pumping = true;

        const step = () => {
            if (!peerEntry.conn || !peerEntry.conn.open || peerEntry.chunkQueue.length === 0) {
                peerEntry.pumping = false;
                return;
            }
            const dc = peerEntry.conn.dataChannel;
            // Invia chunk finché il buffer WebRTC è sotto 48 KB, lasciando sempre corsia libera
            // ai messaggi prioritari in tempo reale (movimento token, aure, dadi, visibilità)!
            while (peerEntry.chunkQueue.length > 0) {
                if (dc && typeof dc.bufferedAmount === 'number' && dc.bufferedAmount > 49152) {
                    break;
                }
                const nextItem = peerEntry.chunkQueue.shift();
                try {
                    peerEntry.conn.send(nextItem.packet);
                } catch (e) {
                    break;
                }
            }
            if (peerEntry.chunkQueue.length > 0) {
                setTimeout(step, 12);
            } else {
                peerEntry.pumping = false;
            }
        };
        step();
    }

    // -- INVIO DATI --
    send(data, targetPeerId = null) {
        const isEphemeral = this._isEphemeralMessage(data);
        const isLarge = this._isLargeMessage(data);

        if (this.mode === 'offline') {
            if (this.bc) this.bc.postMessage(data);
        } else if (this.mode === 'host') {
            if (targetPeerId === 'local') {
                if (this.bc) this.bc.postMessage(data);
                return;
            }
            if (targetPeerId && this.connections[targetPeerId]) {
                const peerEntry = this.connections[targetPeerId];
                if (isLarge) {
                    this._enqueueChunkedToPeer(peerEntry, data);
                } else if (this._canSendToConn(peerEntry.conn, isEphemeral)) {
                    peerEntry.conn.send(data);
                }
                return;
            }
            // Broadcast a tutti i giocatori connessi
            for (let k in this.connections) {
                const peerEntry = this.connections[k];
                if (isLarge) {
                    this._enqueueChunkedToPeer(peerEntry, data);
                } else if (this._canSendToConn(peerEntry.conn, isEphemeral)) {
                    peerEntry.conn.send(data);
                }
            }
            // Manda anche sul BroadcastChannel locale per eventuale schermo TV locale
            if (this.bc) this.bc.postMessage(data);
        } else if (this.mode === 'client') {
            if (this._canSendToConn(this.hostConn, isEphemeral)) {
                this.hostConn.send(data);
            }
        }
    }
}
const network = new NetworkManager();
window.network = network;
