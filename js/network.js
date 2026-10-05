class NetworkManager {
    constructor(role) {
        this.role = role; // 'dm' or 'player'
        this.mode = 'offline'; // 'offline', 'host', 'client'
        this.peer = null;
        this.connections = {}; // Per il DM: mappa peerId -> connection
        this.hostConn = null;  // Per il giocatore: connessione verso il DM
        this.roomId = null;
        this.playerName = null;
        this.playerId = null;
        
        this.onMessageCallback = null;
        this.onConnectCallback = null;
        
        // Setup offline channel di base
        this.bc = new BroadcastChannel('vtt_channel');
        this.bc.onmessage = (e) => {
            if (this.onMessageCallback) {
                // Accetta sempre messaggi locali (per debug/multi-tab ibrido)
                this.onMessageCallback(e.data, 'local');
            }
        };
    }

    onMessage(cb) { this.onMessageCallback = cb; }
    onConnect(cb) { this.onConnectCallback = cb; }

    // -- INIT OFFLINE --
    startOffline() {
        this.mode = 'offline';
        console.log("Rete: Modalità Offline (Locale)");
        if (this.onConnectCallback) this.onConnectCallback();
    }

    // -- DM HOST --
    async hostRoom() {
        return new Promise((resolve, reject) => {
            // Generiamo un ID random leggibile (es: ABCD-123)
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            let id = "";
            for(let i=0; i<4; i++) id += letters.charAt(Math.floor(Math.random()*letters.length));
            id += "-";
            for(let i=0; i<4; i++) id += numbers.charAt(Math.floor(Math.random()*numbers.length));
            
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
                conn.on('open', () => {
                    // Aspettiamo che il client mandi il primo messaggio col nome
                });
                conn.on('data', (data) => {
                    if (data.type === 'PLAYER_JOIN') {
                        const pid = conn.peer;
                        this.connections[pid] = {
                            conn: conn,
                            name: data.payload.name
                        };
                        console.log(`Giocatore ${data.payload.name} unito.`);
                        // Notifichiamo il client che è stato accettato
                        conn.send({ type: 'JOIN_ACCEPTED', payload: { } });
                        if (this.onConnectCallback) this.onConnectCallback(data.payload.name);
                    }
                    if (this.onMessageCallback) this.onMessageCallback(data, conn.peer);
                });
                conn.on('close', () => {
                    // Cerca di rimuoverlo se si disconnette
                    for(let k in this.connections) {
                        if (this.connections[k].conn === conn) {
                            console.log(`Giocatore ${this.connections[k].name} disconnesso.`);
                            delete this.connections[k];
                            break;
                        }
                    }
                });
            });
        });
    }

    // -- PLAYER JOIN --
    async joinRoom(roomId, playerName) {
        return new Promise((resolve, reject) => {
            this.roomId = roomId.toUpperCase();
            this.playerName = playerName;
            this.playerId = 'player_' + Date.now();
            
            this.peer = new Peer();
            this.peer.on('open', (id) => {
                this.hostConn = this.peer.connect(this.roomId, { reliable: true });
                
                this.hostConn.on('open', () => {
                    this.mode = 'client';
                    // Invia i dati del giocatore per presentarsi
                    this.hostConn.send({
                        type: 'PLAYER_JOIN',
                        payload: { name: this.playerName, id: this.playerId }
                    });
                });
                
                this.hostConn.on('data', (data) => {
                    if (data.type === 'JOIN_ACCEPTED') {
                        console.log("Connessione accettata dal DM.");
                        resolve();
                        if(this.onConnectCallback) this.onConnectCallback();
                    }
                    if (this.onMessageCallback) this.onMessageCallback(data, 'dm');
                });
                
                this.hostConn.on('error', (err) => reject(err));
            });
            this.peer.on('error', (err) => reject(err));
        });
    }

    // -- INVIO DATI --
    send(data, targetPeerId = null) {
        if (this.mode === 'offline') {
            this.bc.postMessage(data);
        } else if (this.mode === 'host') {
            if (targetPeerId && this.connections[targetPeerId]) {
                // Invia a uno specifico giocatore
                this.connections[targetPeerId].conn.send(data);
            } else {
                // Broadcast a tutti i giocatori
                for (let k in this.connections) {
                    this.connections[k].conn.send(data);
                }
            }
            // Mando anche sul broadcast locale nel caso il DM stia usando 
            // sia il player offline che quelli online (modalità ibrida!)
            this.bc.postMessage(data); 
        } else if (this.mode === 'client') {
            if (this.hostConn) this.hostConn.send(data);
        }
    }
}
const network = new NetworkManager();
