// Configurazione ad alta affidabilità per PeerJS / WebRTC
// Include STUN multipli e relay TURN per oltrepassare NAT simmetrici, reti cellulari 4G/5G mobile e firewall
const PEER_CONFIG = {
    debug: 1,
    config: {
        iceServers: [
            // STUN Primari ad alta affidabilità
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:stun.cloudflare.com:3478' },
            { urls: 'stun:openrelay.metered.ca:80' },
            // TURN Relay OpenRelay (UDP + TCP porta 80 e 443) per superare CGNAT 4G/5G mobile e firewall restrittivi
            {
                urls: 'turn:openrelay.metered.ca:80',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            },
            {
                urls: 'turn:openrelay.metered.ca:443',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            },
            {
                urls: 'turn:openrelay.metered.ca:443?transport=tcp',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            }
        ],
        iceCandidatePoolSize: 10
    }
};
if (typeof window !== 'undefined') window.PEER_CONFIG = PEER_CONFIG;

// Codice Campagna / Stanza: maiuscole, spazi e trattini non contano ("abcd 1234" = "ABCD-1234").
// Il codice visibile è quello scelto dal Master; sul servizio pubblico di collegamento si usa
// un ID con un prefisso proprio del programma, così non si scontra con altre app.
const VTT_ROOM_PREFIX = 'andr3avtt-';
const vttRoomCode = {
    display(code) {
        return String(code || '').trim().toUpperCase()
            .replace(/[\s_]+/g, '-')
            .replace(/[^A-Z0-9-]/g, '')
            .replace(/-{2,}/g, '-')
            .replace(/^-+|-+$/g, '');
    },
    key(code) { return vttRoomCode.display(code).replace(/-/g, ''); },
    isValid(code) { const k = vttRoomCode.key(code); return k.length >= 6 && k.length <= 24; },
    peerId(code) { return VTT_ROOM_PREFIX + vttRoomCode.key(code); }
};
if (typeof window !== 'undefined') window.vttRoomCode = vttRoomCode;

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
        this._heartbeatTimer = null;
        this._leaveListenersAttached = false;
        this._activeQueryPeer = null;
        this._activeQueryRoom = null;

        // Rientro automatico del giocatore dopo un calo di rete (nessun traffico extra: usa i __PING__ del Master)
        this.iceGraceMs = 4000;        // tolleranza a uno stato WebRTC "disconnected" passeggero (Master e Giocatore)
        this.hostSilenceMs = 10000;    // silenzio massimo dal Master prima di considerare persa la connessione
        this.hostWatchIntervalMs = 3000; // controllo locale (nessun messaggio inviato)
        this.reconnectDelays = [1000, 2000, 4000, 8000, 15000, 15000, 15000, 15000, 15000, 15000];
        this._noRetry = false;         // true dopo chiusura stanza, espulsione o accesso rifiutato
        this._reconnect = null;        // stato del ciclo di nuovi tentativi
        this._reconnectFailed = false; // tentativi esauriti: al ritorno in primo piano / rete si riparte
        this._hostWatchTimer = null;
        this._lastHostSeen = 0;
        this._reconnectListeners = [];
        this._resumeListenersAttached = false;
        this._sessionKey = null;
        
        this.onMessageCallback = null;
        this.onConnectCallback = null;
        this.onDisconnectCallback = null;
        this.onGetCharactersCallback = null;
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
    onGetCharacters(cb) { this.onGetCharactersCallback = cb; }
    // Stato del rientro automatico (Giocatore): lost / waiting / trying / reconnected / failed / closed
    onReconnectState(cb) { if (typeof cb === 'function') this._reconnectListeners.push(cb); }
    addListener(cb) {
        if (!this.listeners) this.listeners = [];
        this.listeners.push(cb);
    }

    _handleRawData(data, peerId) {
        if (!data) return;
        const now = Date.now();
        if (!this._lastChunkCleanup || now - this._lastChunkCleanup > 10000) {
            this._lastChunkCleanup = now;
            for (let id in this._incomingChunks) {
                if (this._incomingChunks[id].createdAt && now - this._incomingChunks[id].createdAt > 20000) {
                    delete this._incomingChunks[id];
                }
            }
        }
        if (data.__chunked) {
            const cid = data.id;
            if (!this._incomingChunks[cid]) {
                this._incomingChunks[cid] = {
                    total: data.total,
                    count: 0,
                    parts: new Array(data.total),
                    createdAt: now
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

    // Codice casuale nel formato ABCD-1234
    static generateRoomCode() {
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
        for (let i = 0; i < 4; i++) id += getRandomChar(letters);
        id += "-";
        for (let i = 0; i < 4; i++) id += getRandomChar(numbers);
        return id;
    }

    // -- DM HOST --
    // code: Codice Campagna fisso scelto dal Master (senza codice: casuale, come prima).
    // Se il codice risulta ancora occupato (es. dalla sessione precedente dopo un ricaricamento
    // della pagina), riprova per opts.busyRetryMs avvisando con opts.onStatus({ state: 'busy' }).
    async hostRoom(code = null, opts = {}) {
        const chosen = !!code;
        const display = chosen ? vttRoomCode.display(code) : NetworkManager.generateRoomCode();
        if (!vttRoomCode.isValid(display)) {
            const e = new Error('Codice campagna non valido: servono da 6 a 24 lettere o cifre.');
            e.vttInvalid = true;
            throw e;
        }
        const busyRetryMs = (opts && typeof opts.busyRetryMs === 'number') ? opts.busyRetryMs : 45000;
        const busyRetryIntervalMs = (opts && typeof opts.busyRetryIntervalMs === 'number') ? opts.busyRetryIntervalMs : 3000;
        this.roomLabel = (opts && opts.label) ? String(opts.label).slice(0, 60) : ''; // nome campagna mostrato ai giocatori
        const startedAt = Date.now();
        const attemptToken = {};
        this._hostAttemptToken = attemptToken;
        while (true) {
            try {
                return await this._hostRoomOnce(display);
            } catch (err) {
                const canRetry = err && err.vttBusy && chosen && (Date.now() - startedAt < busyRetryMs) && this._hostAttemptToken === attemptToken;
                if (!canRetry) throw err;
                if (opts && typeof opts.onStatus === 'function') {
                    try { opts.onStatus({ state: 'busy', code: display, elapsedMs: Date.now() - startedAt }); } catch (e) {}
                }
                await new Promise(r => setTimeout(r, busyRetryIntervalMs));
                if (this._hostAttemptToken !== attemptToken) throw new Error('Avvio della stanza annullato.');
            }
        }
    }

    _hostRoomOnce(id) {
        return new Promise((resolve, reject) => {
            this.roomId = id;
            this.peer = new Peer(vttRoomCode.peerId(id), PEER_CONFIG);
            const hostPeer = this.peer;
            
            this.peer.on('disconnected', () => {
                console.warn("PeerJS Host: Disconnessione temporanea dal server broker di segnalazione, tentativo di riconnessione automatica...");
                try {
                    if (this.peer && !this.peer.destroyed) {
                        this.peer.reconnect();
                    }
                } catch (e) {
                    console.error("Errore durante peer.reconnect():", e);
                }
            });

            const handleConnClose = (targetPid) => {
                const pidToClose = targetPid || null;
                if (!pidToClose) return;
                const entry = this.connections[pidToClose];
                if (entry) {
                    const leftName = entry.name;
                    console.log(`Giocatore ${leftName} disconnesso (peer: ${pidToClose}).`);
                    entry.chunkQueue = [];
                    delete this.connections[pidToClose];
                    try { if (entry.conn && entry.conn.open) entry.conn.close(); } catch (e) {}
                    if (this.onDisconnectCallback) this.onDisconnectCallback(leftName, pidToClose);
                }
            };

            let hostResolved = false;
            this.peer.on('open', () => {
                hostResolved = true;
                this.mode = 'host';
                console.log('Stanza online creata con codice:', id);

                // Watchdog Heartbeat attivo ogni 3s per rilevare disconnessioni
                if (this._heartbeatTimer) clearInterval(this._heartbeatTimer);
                this._heartbeatTimer = setInterval(() => {
                    const now = Date.now();
                    for (let pid in this.connections) {
                        const entry = this.connections[pid];
                        if (!entry) continue;
                        if (!entry.conn || !entry.conn.open || (entry.lastSeen && (now - entry.lastSeen > 8000))) {
                            console.warn(`Watchdog: timeout connessione rilevato per ${entry.name} (${pid})`);
                            handleConnClose(pid);
                            continue;
                        }
                        try {
                            if (entry.conn.open) {
                                entry.conn.send({ type: '__PING__' });
                            }
                        } catch (e) {}
                    }
                }, 3000);

                resolve(id);
            });
            
            this.peer.on('error', (err) => {
                console.error("PeerJS Host Error:", err);
                if (!hostResolved) {
                    if (err && err.type === 'unavailable-id') {
                        // Codice già registrato sul servizio di collegamento (sessione precedente o altra stanza)
                        err.vttBusy = true;
                        try { hostPeer.destroy(); } catch (e) {}
                        if (this.peer === hostPeer) this.peer = null;
                    }
                    reject(err);
                }
            });
            
            this.peer.on('connection', (conn) => {
                console.log("Nuovo giocatore in connessione...");
                const pid = conn.peer;
                // Stanza già chiusa (chiusura ritardata in corso): non accettare nuove connessioni
                if (this.peer !== hostPeer) { try { conn.close(); } catch (e) {} return; }

                // Monitoraggio WebRTC a livello di RTCPeerConnection (rileva caduta tab/rete rapida)
                const attachPc = () => {
                    const pc = conn.peerConnection;
                    if (!pc || pc._vttMonitored) return;
                    pc._vttMonitored = true;
                    const isDeadState = () => (pc.connectionState === 'closed' || pc.connectionState === 'failed' ||
                        pc.iceConnectionState === 'closed' || pc.iceConnectionState === 'failed');
                    const isShakyState = () => (pc.connectionState === 'disconnected' || pc.iceConnectionState === 'disconnected');
                    const checkPcState = () => {
                        if (isDeadState()) {
                            if (pc._vttGraceTimer) { clearTimeout(pc._vttGraceTimer); pc._vttGraceTimer = null; }
                            handleConnClose(conn.peer);
                            return;
                        }
                        if (isShakyState()) {
                            // "disconnected" spesso rientra da solo in pochi secondi: aspetta prima di staccare il giocatore
                            if (!pc._vttGraceTimer) {
                                pc._vttGraceTimer = setTimeout(() => {
                                    pc._vttGraceTimer = null;
                                    if (isDeadState() || isShakyState()) handleConnClose(conn.peer);
                                }, this.iceGraceMs);
                            }
                        } else if (pc._vttGraceTimer) {
                            clearTimeout(pc._vttGraceTimer);
                            pc._vttGraceTimer = null;
                        }
                    };
                    try {
                        pc.addEventListener('connectionstatechange', checkPcState);
                        pc.addEventListener('iceconnectionstatechange', checkPcState);
                    } catch(e) {}
                };
                if (conn.peerConnection) attachPc();
                else conn.on('open', attachPc);

                conn.on('data', (data) => {
                    if (data && data.type === '__PING__') {
                        try { conn.send({ type: '__PONG__' }); } catch (e) {}
                        return;
                    }
                    if (data && data.type === '__PONG__') {
                        if (this.connections[conn.peer]) {
                            this.connections[conn.peer].lastSeen = Date.now();
                        }
                        return;
                    }
                    if (data && data.type === 'PLAYER_LEAVE') {
                        handleConnClose(conn.peer);
                        return;
                    }

                    if (this.connections[conn.peer]) {
                        this.connections[conn.peer].lastSeen = Date.now();
                    }

                    if (data && data.type === 'GET_ROOM_CHARACTERS') {
                        let chars = [];
                        try {
                            if (typeof this.onGetCharactersCallback === 'function') {
                                chars = this.onGetCharactersCallback() || [];
                            }
                        } catch (e) {
                            console.error("Errore in onGetCharactersCallback:", e);
                        }
                        conn.send({
                            type: 'ROOM_CHARACTERS_RESPONSE',
                            payload: { characters: chars, roomId: this.roomId }
                        });
                        // 1500ms di margine per garantire il flush del data channel su connessioni mobili
                        setTimeout(() => { try { conn.close(); } catch (e) {} }, 1500);
                        return;
                    }

                    if (data && data.type === 'PLAYER_JOIN') {
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

                                    const pc = oldConn ? oldConn.peerConnection : null;
                                    const isPcDead = !oldConn || !oldConn.open || (pc && (
                                        pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed' ||
                                        pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed'
                                    ));
                                    const isTimeDead = oldEntry.lastSeen && (Date.now() - oldEntry.lastSeen > 6000);
                                    const isSameSession = oldEntry.sessionToken && incomingToken && (oldEntry.sessionToken === incomingToken);

                                    // Rifiuta SOLO se la vecchia connessione è pienamente attiva negli ultimi 5s E il token è chiaramente diverso (un altro dispositivo che tenta di entrare con lo stesso nome mentre il primo sta giocando)
                                    if (!isPcDead && !isTimeDead && !isSameSession) {
                                        console.warn(`Tentativo di connessione con nome duplicato rifiutato per ${joinName}`);
                                        conn.send({
                                            type: 'JOIN_REJECTED',
                                            reason: `Il nome "${joinName}" è già utilizzato da un altro giocatore attualmente connesso.`
                                        });
                                        setTimeout(() => { try { conn.close(); } catch (e) {} }, 400);
                                        return;
                                    }

                                    isReconnect = true;
                                    console.log(`Riconnessione giocatore: ${joinName} (sostituzione vecchio peer ${oldPid} con ${pid})`);
                                    oldEntry.chunkQueue = [];
                                    delete this.connections[oldPid];
                                    if (oldConn && oldConn !== conn && oldConn.open) {
                                        // Stessa sessione ancora viva (es. seconda finestra dello stesso giocatore):
                                        // avvisa la vecchia così non riprova da sola e non si "rubano" il posto a vicenda
                                        try { oldConn.send({ type: 'SESSION_REPLACED', payload: {} }); } catch (e) {}
                                        setTimeout(() => { try { oldConn.close(); } catch (e) {} }, 500);
                                    } else {
                                        try { if (oldConn && oldConn !== conn) oldConn.close(); } catch (e) {}
                                    }
                                }
                            }
                        }

                        let roomChars = [];
                        try {
                            if (typeof this.onGetCharactersCallback === 'function') {
                                roomChars = this.onGetCharactersCallback() || [];
                            }
                        } catch (e) {}

                        this.connections[pid] = {
                            conn: conn,
                            name: joinName,
                            sessionToken: incomingToken,
                            lastSeen: Date.now(),
                            chunkQueue: [],
                            pumping: false
                        };
                        console.log(`Giocatore ${joinName} unito.`);
                        conn.send({ 
                            type: 'JOIN_ACCEPTED', 
                            payload: { 
                                name: joinName,
                                characters: roomChars,
                                roomLabel: this.roomLabel || ''
                            } 
                        });
                        if (this.onConnectCallback) this.onConnectCallback(joinName, pid, isReconnect);
                    } else if (!this.connections[conn.peer]) {
                        // Ignora pacchetti non autenticati prima del join
                        return;
                    }
                    this._handleRawData(data, conn.peer);
                });

                conn.on('close', () => handleConnClose(conn.peer));
                conn.on('error', () => handleConnClose(conn.peer));
            });
        });
    }

    // -- PLAYER JOIN --
    async joinRoom(roomId, playerName, opts = {}) {
        const isAutoRetry = !!(opts && opts.isReconnect);
        if (!isAutoRetry) {
            // Accesso manuale: annulla eventuali tentativi in corso e riabilita il rientro automatico
            this._noRetry = false;
            this._reconnectFailed = false;
            this._stopReconnectLoop();
        }
        this._stopHostWatch();
        return new Promise((resolve, reject) => {
            const cleanRoom = vttRoomCode.display(roomId);
            this.roomId = cleanRoom;
            this.playerName = playerName;
            if (!isAutoRetry || !this.playerId) this.playerId = 'player_' + Date.now();
            this.mode = 'client';

            // Abortisci immediatamente qualsiasi query temporanea ancora aperta per evitare collisioni WebRTC
            if (this._activeQueryPeer && typeof this._activeQueryPeer.abort === 'function') {
                try { this._activeQueryPeer.abort(); } catch (e) {}
                this._activeQueryPeer = null;
                this._activeQueryRoom = null;
            }

            let sessionKey = 'vtt_sess_' + vttRoomCode.key(this.roomId) + '_' + encodeURIComponent(playerName.trim().toLowerCase());
            let sessionToken = null;
            try {
                sessionToken = localStorage.getItem(sessionKey);
                if (!sessionToken) {
                    sessionToken = 'tok_' + Math.random().toString(36).substring(2) + '_' + Date.now();
                    localStorage.setItem(sessionKey, sessionToken);
                }
            } catch (e) {
                // Senza localStorage: riusa il gettone in memoria per la stessa stanza e lo stesso nome (rientro riconosciuto dal Master)
                sessionToken = (this.sessionToken && this._sessionKey === sessionKey)
                    ? this.sessionToken
                    : 'tok_' + Math.random().toString(36).substring(2) + '_' + Date.now();
            }
            this.sessionToken = sessionToken;
            this._sessionKey = sessionKey;

            // Aggancia listener prima della chiusura finestra per notificare il DM in uscita
            if (typeof window !== 'undefined' && !this._leaveListenersAttached) {
                this._leaveListenersAttached = true;
                const handleWindowLeave = () => {
                    if (this.mode === 'client' && this.hostConn && this.hostConn.open) {
                        try {
                            this.hostConn.send({
                                type: 'PLAYER_LEAVE',
                                payload: { name: this.playerName, id: this.playerId, sessionToken: this.sessionToken }
                            });
                        } catch (e) {}
                        try { this.hostConn.close(); } catch (e) {}
                    }
                };
                window.addEventListener('beforeunload', handleWindowLeave);
                window.addEventListener('pagehide', handleWindowLeave);
            }

            // Chiudi subito il BroadcastChannel locale per evitare doppi messaggi e desincronizzazioni
            if (this.bc) {
                try {
                    this.bc.onmessage = null;
                    this.bc.close();
                } catch (e) {}
                this.bc = null;
            }
            
            if (this.peer) {
                try { this.peer.destroy(); } catch (e) {}
                this.peer = null;
            }

            let connectTimeout = null;
            let joinResolved = false;

            const cleanupAndReject = (err) => {
                if (joinResolved) return;
                joinResolved = true;
                if (connectTimeout) clearTimeout(connectTimeout);
                reject(err);
            };

            // Timeout di sicurezza a 15 secondi per la negoziazione
            connectTimeout = setTimeout(() => {
                cleanupAndReject(new Error(`Timeout di negoziazione con la stanza ${this.roomId}. Verifica che il Master abbia la sessione attiva.`));
            }, 15000);

            try {
                this.peer = new Peer(undefined, PEER_CONFIG);
            } catch (err) {
                return cleanupAndReject(err);
            }

            this.peer.on('disconnected', () => {
                console.warn("PeerJS Client: Disconnessione temporanea dal server di segnalazione broker, riconnessione...");
                try {
                    if (this.peer && !this.peer.destroyed) {
                        this.peer.reconnect();
                    }
                } catch (e) {}
            });

            this.peer.on('open', (id) => {
                if (joinResolved) return;
                let conn = null;
                try {
                    conn = this.peer.connect(vttRoomCode.peerId(this.roomId), { reliable: true });
                    this.hostConn = conn;
                } catch (err) {
                    return cleanupAndReject(err);
                }
                
                this.hostConn.on('open', () => {
                    if (joinResolved) return;
                    this.mode = 'client';
                    try {
                        this.hostConn.send({
                            type: 'PLAYER_JOIN',
                            payload: { name: this.playerName, id: this.playerId, sessionToken: this.sessionToken }
                        });
                    } catch (e) {
                        cleanupAndReject(e);
                    }
                });
                
                this.hostConn.on('data', (data) => {
                    if (conn === this.hostConn) this._lastHostSeen = Date.now();
                    if (data && data.type === '__PING__') {
                        try { conn.send({ type: '__PONG__' }); } catch (e) {}
                        return;
                    }
                    if (data && data.type === '__PONG__') {
                        return;
                    }
                    if (data && data.type === 'JOIN_ACCEPTED') {
                        if (joinResolved) return;
                        joinResolved = true;
                        if (connectTimeout) clearTimeout(connectTimeout);
                        console.log("Connessione accettata dal DM.");
                        this._startHostWatch(conn);
                        resolve(data.payload);
                        if (this.onConnectCallback) this.onConnectCallback(data.payload);
                    } else if (data && data.type === 'JOIN_REJECTED') {
                        console.warn("Connessione rifiutata dal DM:", data.reason);
                        const rejErr = new Error(data.reason || "Accesso rifiutato dal DM.");
                        rejErr.vttNoRetry = true; // nome già in uso da un altro dispositivo: non riprovare da soli
                        cleanupAndReject(rejErr);
                        return;
                    }
                    // Chiusura voluta dal Master o espulsione: nessun rientro automatico
                    if (data && (data.type === 'ROOM_CLOSED' || data.type === 'KICKED')) {
                        this._noRetry = true;
                        this._stopReconnectLoop();
                    }
                    // Sostituita da un accesso più recente con la stessa sessione (solo se è la connessione attiva)
                    if (data && data.type === 'SESSION_REPLACED') {
                        if (conn !== this.hostConn) return;
                        this._noRetry = true;
                        this._stopReconnectLoop();
                    }
                    this._handleRawData(data, 'dm');
                });
                
                this.hostConn.on('error', (err) => {
                    if (!joinResolved) cleanupAndReject(err);
                    else this._onHostLost('error', conn);
                });
                this.hostConn.on('close', () => {
                    if (!joinResolved) {
                        cleanupAndReject(new Error(`Connessione chiusa prima del completamento dell'accesso.`));
                    } else {
                        this._onHostLost('close', conn);
                    }
                });
            });

            this.peer.on('error', (err) => cleanupAndReject(err));
        });
    }

    closeRoom() {
        this._hostAttemptToken = null; // annulla eventuali nuovi tentativi di avvio con codice occupato
        if (this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = null;
        }
        const oldConns = this.connections;
        const oldPeer = this.peer;
        for (let pid in oldConns) {
            const entry = oldConns[pid];
            if (entry && entry.conn) {
                entry.chunkQueue = [];
                try {
                    entry.conn.send({ type: 'ROOM_CLOSED', payload: { reason: 'Il Master ha terminato la sessione.' } });
                } catch (e) {}
            }
        }
        this.connections = {};
        this.peer = null;
        this.mode = 'offline';
        this.roomId = null;
        // Chiusura ritardata: lascia arrivare ROOM_CLOSED, così i giocatori sanno che è voluta e non riprovano
        setTimeout(() => {
            for (let pid in oldConns) {
                try { if (oldConns[pid] && oldConns[pid].conn) oldConns[pid].conn.close(); } catch (e) {}
            }
            if (oldPeer) { try { oldPeer.destroy(); } catch (e) {} }
        }, 600);
    }

    kickPlayer(identifier) {
        if (this.mode !== 'host') return false;
        let targetPid = null;
        if (this.connections[identifier]) {
            targetPid = identifier;
        } else {
            for (let pid in this.connections) {
                if (this.connections[pid] && this.connections[pid].name && this.connections[pid].name.toLowerCase() === String(identifier).toLowerCase()) {
                    targetPid = pid;
                    break;
                }
            }
        }
        if (!targetPid || !this.connections[targetPid]) return false;
        const entry = this.connections[targetPid];
        const pName = entry.name;
        entry.chunkQueue = [];
        try {
            entry.conn.send({ type: 'KICKED', payload: { reason: 'Sei stato espulso dalla stanza dal Master.' } });
        } catch (e) {}
        const kickedConn = entry.conn;
        setTimeout(() => { try { if (kickedConn) kickedConn.close(); } catch (e) {} }, 500);
        delete this.connections[targetPid];
        if (this.onDisconnectCallback) this.onDisconnectCallback(pName, targetPid);
        return true;
    }

    // ---- RIENTRO AUTOMATICO DEL GIOCATORE ----
    _emitReconnectState(info) {
        for (let i = 0; i < this._reconnectListeners.length; i++) {
            try { this._reconnectListeners[i](info); } catch (e) { console.error('onReconnectState:', e); }
        }
    }

    // Sorveglia la connessione verso il Master: nessun messaggio in più, solo l'ora dell'ultimo dato ricevuto
    _startHostWatch(conn) {
        this._stopHostWatch();
        this._lastHostSeen = Date.now();
        this._hostWatchTimer = setInterval(() => {
            if (this.mode !== 'client' || this.hostConn !== conn) { this._stopHostWatch(); return; }
            if (!conn.open || (Date.now() - this._lastHostSeen > this.hostSilenceMs)) this._onHostLost('timeout', conn);
        }, this.hostWatchIntervalMs);
        const pc = conn ? conn.peerConnection : null;
        if (pc && !pc._vttClientMonitored && typeof pc.addEventListener === 'function') {
            pc._vttClientMonitored = true;
            const dead = () => pc.connectionState === 'failed' || pc.connectionState === 'closed' ||
                pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed';
            const shaky = () => pc.connectionState === 'disconnected' || pc.iceConnectionState === 'disconnected';
            const check = () => {
                if (this.hostConn !== conn) return;
                if (dead()) { this._onHostLost('webrtc', conn); return; }
                if (shaky()) {
                    if (!pc._vttGraceTimer) {
                        pc._vttGraceTimer = setTimeout(() => {
                            pc._vttGraceTimer = null;
                            if (this.hostConn === conn && (dead() || shaky())) this._onHostLost('webrtc', conn);
                        }, this.iceGraceMs);
                    }
                } else if (pc._vttGraceTimer) {
                    clearTimeout(pc._vttGraceTimer);
                    pc._vttGraceTimer = null;
                }
            };
            try {
                pc.addEventListener('connectionstatechange', check);
                pc.addEventListener('iceconnectionstatechange', check);
            } catch (e) {}
        }
        this._attachResumeListeners();
    }

    _stopHostWatch() {
        if (this._hostWatchTimer) {
            clearInterval(this._hostWatchTimer);
            this._hostWatchTimer = null;
        }
    }

    // Telefono di nuovo in primo piano o rete tornata: riprova subito invece di aspettare
    _attachResumeListeners() {
        if (this._resumeListenersAttached || typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
        this._resumeListenersAttached = true;
        const onResume = () => {
            if (this.mode !== 'client') return;
            if (this._reconnect && this._reconnect.active) { this._scheduleReconnectAttempt(true); return; }
            const conn = this.hostConn;
            // Tentativi esauriti (anche mentre il telefono era in background): riparti da capo al ritorno
            if (this._reconnectFailed) { this.retryNow(); return; }
            if (!conn) return;
            // Lascia arrivare i messaggi accodati in background prima di giudicare la connessione
            setTimeout(() => {
                if (this.hostConn === conn && (!conn.open || Date.now() - this._lastHostSeen > 6000)) this._onHostLost('resume', conn);
            }, 1500);
        };
        window.addEventListener('online', onResume);
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') onResume();
            });
        }
    }

    _onHostLost(reason, conn) {
        if (this.mode !== 'client') return;
        if (conn && conn !== this.hostConn) return; // eventi di una connessione già sostituita
        this._stopHostWatch();
        const old = this.hostConn;
        this.hostConn = null;
        try { if (old && old.open) old.close(); } catch (e) {}
        if (this._noRetry) {
            this._emitReconnectState({ state: 'closed', cause: 'ended', reason });
            return;
        }
        console.warn(`Connessione con il Master persa (${reason}): avvio dei tentativi di rientro.`);
        this._startReconnectLoop(reason);
    }

    _startReconnectLoop(reason) {
        if (this._reconnect && this._reconnect.active) return;
        this._reconnectFailed = false;
        this._reconnect = { active: true, attempt: 0, timer: null, inFlight: false, max: this.reconnectDelays.length };
        this._emitReconnectState({ state: 'lost', reason, attempt: 0, max: this._reconnect.max });
        this._scheduleReconnectAttempt(false);
    }

    _scheduleReconnectAttempt(immediate) {
        const r = this._reconnect;
        if (!r || !r.active || r.inFlight) return;
        if (r.timer) { clearTimeout(r.timer); r.timer = null; }
        if (r.attempt >= r.max) {
            r.active = false;
            this._reconnectFailed = true;
            this._emitReconnectState({ state: 'failed', attempt: r.attempt, max: r.max });
            return;
        }
        const delay = immediate ? 0 : this.reconnectDelays[r.attempt];
        this._emitReconnectState({ state: 'waiting', attempt: r.attempt + 1, max: r.max, delay });
        r.timer = setTimeout(() => { r.timer = null; this._doReconnectAttempt(); }, delay);
    }

    async _doReconnectAttempt() {
        const r = this._reconnect;
        if (!r || !r.active || r.inFlight) return;
        r.inFlight = true;
        r.attempt++;
        this._emitReconnectState({ state: 'trying', attempt: r.attempt, max: r.max });
        try {
            const payload = await this.joinRoom(this.roomId, this.playerName, { isReconnect: true });
            if (this._reconnect !== r) return; // nel frattempo c'è stato un accesso manuale
            r.inFlight = false;
            r.active = false;
            this._reconnect = null;
            console.log('Rientro automatico riuscito.');
            this._emitReconnectState({ state: 'reconnected', attempt: r.attempt, max: r.max, payload });
        } catch (err) {
            if (this._reconnect !== r) return;
            r.inFlight = false;
            // il tentativo fallito lascia una connessione mai aperta: non deve sembrare quella attiva
            if (this.hostConn && !this.hostConn.open) this.hostConn = null;
            if (this._noRetry || (err && err.vttNoRetry)) {
                r.active = false;
                this._reconnect = null;
                this._emitReconnectState({ state: 'closed', cause: this._noRetry ? 'ended' : 'rejected', reason: err && err.message });
                return;
            }
            this._scheduleReconnectAttempt(false);
        }
    }

    _stopReconnectLoop() {
        const r = this._reconnect;
        if (r && r.timer) clearTimeout(r.timer);
        if (r) r.active = false;
        this._reconnect = null;
    }

    // Pulsante "Riprova": anticipa il prossimo tentativo o riparte da capo dopo l'esaurimento
    retryNow() {
        if (this.mode !== 'client' || !this.roomId || !this.playerName || this._noRetry) return false;
        if (this._reconnect && this._reconnect.active) {
            this._scheduleReconnectAttempt(true);
            return true;
        }
        if (this.hostConn && this.hostConn.open) return false;
        this._reconnect = null;
        this._startReconnectLoop('manual');
        return true;
    }

    async queryRoomCharacters(roomId) {
        return new Promise((resolve) => {
            const cleanRoom = vttRoomCode.display(roomId);
            if (!vttRoomCode.isValid(cleanRoom)) return resolve([]);
            if (typeof Peer === 'undefined') return resolve([]);

            if (this._activeQueryPeer && this._activeQueryRoom === cleanRoom) {
                return;
            }

            if (this._activeQueryPeer && typeof this._activeQueryPeer.abort === 'function') {
                try { this._activeQueryPeer.abort(); } catch (e) {}
                this._activeQueryPeer = null;
                this._activeQueryRoom = null;
            }

            const tempPeerId = 'query_' + Math.random().toString(36).substring(2, 8);
            let tempPeer = null;
            let timer = null;
            let done = false;

            const cleanup = () => {
                if (done) return;
                done = true;
                if (timer) clearTimeout(timer);
                this._activeQueryPeer = null;
                this._activeQueryRoom = null;
                try { if (tempPeer) tempPeer.destroy(); } catch (e) {}
            };

            this._activeQueryPeer = { abort: () => { cleanup(); resolve([]); } };
            this._activeQueryRoom = cleanRoom;

            // Timeout a 8 secondi per permettere a reti mobili (4G/5G/LTE) di negoziare STUN/TURN
            timer = setTimeout(() => {
                cleanup();
                resolve([]);
            }, 8000);

            try {
                tempPeer = new Peer(tempPeerId, PEER_CONFIG);
                tempPeer.on('open', () => {
                    if (done) return;
                    let conn = null;
                    try {
                        conn = tempPeer.connect(vttRoomCode.peerId(cleanRoom), { reliable: true });
                    } catch (e) {
                        cleanup();
                        return resolve([]);
                    }
                    conn.on('open', () => {
                        if (done) return;
                        try {
                            conn.send({ type: 'GET_ROOM_CHARACTERS' });
                        } catch (e) {
                            cleanup();
                            resolve([]);
                        }
                    });
                    conn.on('data', (data) => {
                        if (data && data.type === 'ROOM_CHARACTERS_RESPONSE') {
                            const list = (data.payload && Array.isArray(data.payload.characters)) ? data.payload.characters : [];
                            cleanup();
                            resolve(list);
                        }
                    });
                    conn.on('error', () => {
                        cleanup();
                        resolve([]);
                    });
                    conn.on('close', () => {
                        if (!done) {
                            cleanup();
                            resolve([]);
                        }
                    });
                });
                tempPeer.on('error', () => {
                    cleanup();
                    resolve([]);
                });
            } catch (e) {
                cleanup();
                resolve([]);
            }
        });
    }

    _canSendToConn(conn, isEphemeral) {
        if (!conn || !conn.open) return false;
        const dc = conn.dataChannel;
        if (dc && typeof dc.bufferedAmount === 'number') {
            if (isEphemeral && dc.bufferedAmount > 32768) {
                return false;
            }
            if (!isEphemeral && dc.bufferedAmount > 131072) {
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

    broadcast(data, targetPeerId = null) {
        return this.send(data, targetPeerId);
    }
}
const network = new NetworkManager();
window.network = network;
