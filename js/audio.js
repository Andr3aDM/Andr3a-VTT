// js/audio.js - Sistema Audio e Soundboard Sincronizzato per App GDR

(function() {
    'use strict';

    // Istanza AudioContext e Master Gain per suoni sintetizzati offline
    let audioCtx = null;
    let masterGain = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
                masterGain = audioCtx.createGain();
                masterGain.connect(audioCtx.destination);
                updateEffectiveVolume();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function getMasterDestination(ctx) {
        if (!masterGain) {
            masterGain = ctx.createGain();
            masterGain.connect(ctx.destination);
        }
        // Boost Effetti: se il volume base è al 3% (0.03), gli effetti suonano al 5% (0.05) -> moltiplicatore 1.67
        const sfxVol = AudioState.isMuted ? 0 : Math.max(0, Math.min(1, AudioState.localVolume * (5 / 3)));
        masterGain.gain.setValueAtTime(sfxVol, ctx.currentTime);
        return masterGain;
    }

    // -- SINTETIZZATORE SFX ZERO-BANDWIDTH (Funziona anche 100% offline!) --
    const SoundSynthesizer = {
        sword: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const dest = getMasterDestination(ctx);
            
            const bufferSize = ctx.sampleRate * 0.2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1500, now);
            filter.frequency.exponentialRampToValueAtTime(300, now + 0.2);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);
            
            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(0.3, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            
            osc.connect(oscGain);
            oscGain.connect(dest);
            
            noise.start(now);
            osc.start(now);
            osc.stop(now + 0.45);
        },

        explosion: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const dest = getMasterDestination(ctx);
            
            const bufferSize = ctx.sampleRate * 0.8;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, now);
            filter.frequency.exponentialRampToValueAtTime(80, now + 0.8);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start(now);
        },

        thunder: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const dest = getMasterDestination(ctx);
            
            const bufferSize = ctx.sampleRate * 1.5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, now);
            filter.frequency.linearRampToValueAtTime(150, now + 1.5);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.5, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start(now);
        },

        magic: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const dest = getMasterDestination(ctx);
            
            const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            freqs.forEach((f, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + idx * 0.06);
                
                gain.gain.setValueAtTime(0, now + idx * 0.06);
                gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.06 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.6);
                
                osc.connect(gain);
                gain.connect(dest);
                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.65);
            });
        },

        bell: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const dest = getMasterDestination(ctx);
            
            const baseFreq = 220;
            const partials = [1, 2.76, 5.4, 8.9];
            partials.forEach((mult, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(baseFreq * mult, now);
                
                const vol = 0.3 / (idx + 1);
                gain.gain.setValueAtTime(vol, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
                
                osc.connect(gain);
                gain.connect(dest);
                osc.start(now);
                osc.stop(now + 2.6);
            });
        },

        roar: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const dest = getMasterDestination(ctx);
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.3);
            osc.frequency.linearRampToValueAtTime(60, now + 0.9);
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(500, now);
            filter.frequency.linearRampToValueAtTime(250, now + 0.9);
            
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            osc.start(now);
            osc.stop(now + 0.95);
        },

        fanfare: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const dest = getMasterDestination(ctx);
            
            const notes = [
                { f: 261.63, start: 0, dur: 0.12 },
                { f: 329.63, start: 0.12, dur: 0.12 },
                { f: 392.00, start: 0.24, dur: 0.15 },
                { f: 523.25, start: 0.40, dur: 0.55 }
            ];
            notes.forEach(n => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.f, now + n.start);
                
                gain.gain.setValueAtTime(0, now + n.start);
                gain.gain.linearRampToValueAtTime(0.3, now + n.start + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);
                
                osc.connect(gain);
                gain.connect(dest);
                osc.start(now + n.start);
                osc.stop(now + n.start + n.dur + 0.05);
            });
        },

        door: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const dest = getMasterDestination(ctx);
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.6);
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(400, now);
            filter.Q.value = 5;
            
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            osc.start(now);
            osc.stop(now + 0.7);
        }
    };

    // -- STATO AUDIO GLOBALE --
    const AudioState = {
        isDM: false,
        network: null,
        handledEventIds: new Set(),
        
        bgmAudio: new Audio(),
        bgmCurrent: {
            src: '',
            title: 'Nessuna',
            loop: true,
            isPlaying: false
        },
        
        sfxAudio: new Audio(),
        
        // Volume di default impostato a 3% (0.03), max consentito 20% (0.20)
        localVolume: 0.03,
        isMuted: false,
        
        defaultPlaylist: [
            { id: 'bgm_tavern', title: '🍻 Taverna Vivace', src: 'https://cdn.freesound.org/previews/512/512471_9497060-lq.mp3' },
            { id: 'bgm_rain', title: '🌧️ Pioggia & Tuoni', src: 'https://cdn.freesound.org/previews/518/518882_649468-lq.mp3' },
            { id: 'bgm_dungeon', title: '🕯️ Dungeon & Cripta', src: 'https://cdn.freesound.org/previews/415/415510_5121236-lq.mp3' },
            { id: 'bgm_battle', title: '⚔️ Tamburi di Guerra', src: 'https://cdn.freesound.org/previews/368/368843_6687700-lq.mp3' },
            { id: 'bgm_forest', title: '🌲 Bosco Incantato', src: 'https://cdn.freesound.org/previews/527/527891_5121236-lq.mp3' }
        ],

        defaultSfxPads: [
            { id: 'sfx_sword', title: '⚔️ Spada', synth: 'sword' },
            { id: 'sfx_explosion', title: '💥 Esplosione', synth: 'explosion' },
            { id: 'sfx_thunder', title: '⚡ Fulmine', synth: 'thunder' },
            { id: 'sfx_door', title: '🚪 Porta', synth: 'door' },
            { id: 'sfx_roar', title: '🐺 Ruggito', synth: 'roar' },
            { id: 'sfx_bell', title: '🔔 Rintocco', synth: 'bell' },
            { id: 'sfx_magic', title: '✨ Magia', synth: 'magic' },
            { id: 'sfx_fanfare', title: '🎺 Vittoria', synth: 'fanfare' }
        ]
    };

    // Carica preferenze salvate con limite di sicurezza a 20% (0.20)
    const savedVol = localStorage.getItem('vtt_audio_volume');
    if (savedVol !== null) {
        let parsed = parseFloat(savedVol);
        if (isNaN(parsed) || parsed > 0.20 || parsed < 0) parsed = 0.03;
        AudioState.localVolume = parsed;
    } else {
        AudioState.localVolume = 0.03;
    }

    const savedMute = localStorage.getItem('vtt_audio_muted');
    if (savedMute !== null) AudioState.isMuted = savedMute === 'true';

    // Configura elementi Audio
    AudioState.bgmAudio.loop = true;

    // Gestione Eventi bgmAudio per evitare falsi errori
    AudioState.bgmAudio.onerror = function() {
        if (!AudioState.bgmCurrent.isPlaying || !AudioState.bgmAudio.src) return;
        // Errore 1 = MEDIA_ERR_ABORTED (interruzione normale per cambio brano)
        if (AudioState.bgmAudio.error && AudioState.bgmAudio.error.code === 1) return;
        
        console.warn("Errore caricamento link audio:", AudioState.bgmAudio.error);
        updateUILabel("⚠️ Errore caricamento link audio");
    };

    AudioState.bgmAudio.onplaying = function() {
        if (AudioState.bgmCurrent.isPlaying) {
            updateUILabel(AudioState.bgmCurrent.title);
        }
    };

    AudioState.bgmAudio.oncanplay = function() {
        if (AudioState.bgmCurrent.isPlaying) {
            updateUILabel(AudioState.bgmCurrent.title);
        }
    };

    let isDucking = false;
    let duckTimeout = null;
    let duckFadeInterval = null;

    function applyAudioDucking(durationMs = 1500) {
        if (!AudioState.bgmCurrent.isPlaying || AudioState.isMuted || !AudioState.bgmAudio.src) return;

        const baseVol = AudioState.localVolume;
        // Abbassa la musica a circa un terzo (da 3% a ~1%) durante l'effetto sonoro
        const duckedVol = baseVol * 0.35;

        if (duckFadeInterval) clearInterval(duckFadeInterval);
        if (duckTimeout) clearTimeout(duckTimeout);

        isDucking = true;
        AudioState.bgmAudio.volume = Math.max(0, duckedVol);

        duckTimeout = setTimeout(() => {
            const steps = 10;
            const stepTime = 35; // Ritorno morbido in circa 350ms
            let currentStep = 0;

            duckFadeInterval = setInterval(() => {
                currentStep++;
                const t = currentStep / steps;
                const currentVol = duckedVol + (baseVol - duckedVol) * t;
                if (!AudioState.isMuted) {
                    AudioState.bgmAudio.volume = Math.max(0, Math.min(1, currentVol));
                }
                if (currentStep >= steps) {
                    clearInterval(duckFadeInterval);
                    duckFadeInterval = null;
                    isDucking = false;
                    updateEffectiveVolume();
                }
            }, stepTime);
        }, durationMs);
    }

    function updateEffectiveVolume() {
        const effVol = AudioState.isMuted ? 0 : AudioState.localVolume;
        // Musica BGM: se non sta duckando, aggiorna al volume effettivo
        if (!isDucking) {
            AudioState.bgmAudio.volume = Math.max(0, Math.min(1, effVol));
        }
        // Effetti SFX: incrementati a ~5% quando il volume è al 3%
        const sfxVol = Math.max(0, Math.min(1, effVol * (5 / 3)));
        AudioState.sfxAudio.volume = sfxVol;
        if (masterGain && audioCtx) {
            masterGain.gain.setValueAtTime(sfxVol, audioCtx.currentTime);
        }
    }
    updateEffectiveVolume();

    // Sblocco Autoplay al primo tocco ovunque sulla pagina
    function unlockAudioContext() {
        getAudioContext();
        if (AudioState.bgmCurrent.isPlaying && AudioState.bgmAudio.paused && AudioState.bgmAudio.src) {
            AudioState.bgmAudio.play().catch(() => {});
        }
        window.removeEventListener('click', unlockAudioContext);
        window.removeEventListener('keydown', unlockAudioContext);
        window.removeEventListener('touchstart', unlockAudioContext);
    }
    window.addEventListener('click', unlockAudioContext);
    window.addEventListener('keydown', unlockAudioContext);
    window.addEventListener('touchstart', unlockAudioContext);


    // -- METODI RIPRODUZIONE BGM (Musica) --
    function playBGM(src, title, loop = true, startTime = 0) {
        if (!src) return;

        // Se la traccia è già attiva e in riproduzione, aggiorna solo il titolo ed esci
        if (AudioState.bgmCurrent.src === src && AudioState.bgmCurrent.isPlaying && !AudioState.bgmAudio.paused) {
            AudioState.bgmCurrent.title = title || AudioState.bgmCurrent.title;
            updateUILabel(AudioState.bgmCurrent.title);
            return;
        }

        AudioState.bgmCurrent.src = src;
        AudioState.bgmCurrent.title = title || 'Traccia Sconosciuta';
        AudioState.bgmCurrent.loop = loop;
        AudioState.bgmCurrent.isPlaying = true;

        updateUILabel(AudioState.bgmCurrent.title);

        AudioState.bgmAudio.src = src;
        AudioState.bgmAudio.loop = loop;
        if (startTime > 0) AudioState.bgmAudio.currentTime = startTime;

        updateEffectiveVolume();
        AudioState.bgmAudio.play().catch(err => {
            console.log("Audio play in attesa di interazione utente:", err);
            const hint = document.getElementById('p-audio-unblock-hint');
            if (hint) hint.style.display = 'block';
        });
    }

    function pauseBGM() {
        AudioState.bgmCurrent.isPlaying = false;
        AudioState.bgmAudio.pause();
        updateUILabel(AudioState.bgmCurrent.title + ' (In Pausa)');
    }

    function resumeBGM() {
        if (AudioState.bgmAudio.src) {
            AudioState.bgmCurrent.isPlaying = true;
            updateEffectiveVolume();
            AudioState.bgmAudio.play().catch(() => {});
            updateUILabel(AudioState.bgmCurrent.title);
        }
    }

    function stopBGM() {
        AudioState.bgmCurrent.isPlaying = false;
        AudioState.bgmCurrent.src = '';
        AudioState.bgmCurrent.title = 'Nessuna';
        AudioState.bgmAudio.pause();
        AudioState.bgmAudio.removeAttribute('src');
        AudioState.bgmAudio.load();
        updateUILabel('Nessuna');
    }

    // -- METODI RIPRODUZIONE SFX (Effetti Rapidi) --
    function playSFX(synthName, src, title) {
        AudioState.lastSfx = { title: title || '', kind: synthName ? 'synth' : (src && src.startsWith('blob:') ? 'file' : 'url'), at: Date.now() };
        updateEffectiveVolume();
        if (AudioState.isMuted) return;
        
        // Attiva l'Audio Ducking sulla musica di sottofondo
        applyAudioDucking(1500);

        if (synthName && SoundSynthesizer[synthName]) {
            SoundSynthesizer[synthName]();
        } else if (src) {
            const sfx = new Audio(src);
            // Volume incrementato per file audio esterni (5% quando volume base è 3%)
            const sfxVol = Math.max(0, Math.min(1, AudioState.localVolume * (5 / 3)));
            sfx.volume = sfxVol;
            sfx.play().catch(e => console.error("Errore SFX audio:", e));
        }
    }

    function updateUILabel(title) {
        const dmLabel = document.getElementById('audio-bgm-title');
        if (dmLabel) dmLabel.innerText = title;
        const playerLabel = document.getElementById('p-audio-current');
        if (playerLabel) playerLabel.innerText = title;
    }


    // ===================== ARCHIVIO AUDIO (IndexedDB "VTT_AUDIO") =====================
    // Soundboard e playlist per sistema di gioco + file audio salvati come Blob. Separato da VTT_DB (campagne e mappe).
    // Usato solo dal Master; i Giocatori non lo aprono mai.
    const SFX_FILE_MAX = 2 * 1024 * 1024;    // effetto: massimo 2 MB (consigliati < 300 KB)
    const BGM_FILE_MAX = 20 * 1024 * 1024;   // brano della playlist: massimo 20 MB
    const KNOWN_AUDIO_SYSTEMS = ['dnd5e', '7thsea', 'ncs'];

    function tr(k) { return (typeof window.t === 'function') ? window.t(k) : k; }
    function audioToast(msg) {
        if (typeof window.showToast === 'function') window.showToast(tr(msg));
        else if (typeof window.vttWarn === 'function') window.vttWarn(tr(msg));
        else console.warn(msg);
    }
    const warnedOnce = new Set();
    function warnOnce(msg) { if (warnedOnce.has(msg)) return; warnedOnce.add(msg); audioToast(msg); }

    function defaultBoard(sys) {
        return {
            system: sys,
            pads: AudioState.defaultSfxPads.map(p => Object.assign({}, p)),
            playlist: AudioState.defaultPlaylist.map(p => Object.assign({}, p))
        };
    }

    function dataUrlToBlob(dataUrl) {
        try {
            const comma = dataUrl.indexOf(',');
            if (comma < 0) return null;
            const head = dataUrl.slice(5, comma);
            const mime = head.split(';')[0] || 'application/octet-stream';
            const body = dataUrl.slice(comma + 1);
            if (/;base64/i.test(head)) {
                const bin = atob(body);
                const bytes = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
                return new Blob([bytes], { type: mime });
            }
            return new Blob([decodeURIComponent(body)], { type: mime });
        } catch (e) { return null; }
    }
    function blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result);
            fr.onerror = () => reject(fr.error);
            fr.readAsDataURL(blob);
        });
    }

    const AudioLibrary = (function () {
        let dbPromise = null;
        let migration = null;
        let persistAsked = false;
        function open() {
            if (dbPromise) return dbPromise;
            dbPromise = new Promise((resolve, reject) => {
                if (!window.indexedDB) { reject(new Error('IndexedDB non disponibile')); return; }
                const req = indexedDB.open('VTT_AUDIO', 1);
                req.onupgradeneeded = () => {
                    const db = req.result;
                    if (!db.objectStoreNames.contains('boards')) db.createObjectStore('boards', { keyPath: 'system' });
                    if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'id' });
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
            dbPromise.catch(() => { dbPromise = null; });
            return dbPromise;
        }
        function reqP(r) { return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
        async function store(name, mode) { const db = await open(); return db.transaction(name, mode).objectStore(name); }
        function askPersist() {
            if (persistAsked) return;
            persistAsked = true;
            try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) {}
        }

        const lib = {
            async getBoard(sys) { return reqP((await store('boards', 'readonly')).get(sys)); },
            async getAllBoards() { return reqP((await store('boards', 'readonly')).getAll()); },
            async putBoard(b) {
                const clean = { system: b.system, pads: b.pads.map(p => Object.assign({}, p)), playlist: b.playlist.map(p => Object.assign({}, p)) };
                return reqP((await store('boards', 'readwrite')).put(clean));
            },
            async getFile(id) { return reqP((await store('files', 'readonly')).get(id)); },
            async saveFile(blob, type) {
                const id = 'af_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
                await reqP((await store('files', 'readwrite')).put({ id, blob, type: type || blob.type || '', size: blob.size, savedAt: Date.now() }));
                askPersist();
                return id;
            },
            async deleteFile(id) { return reqP((await store('files', 'readwrite')).delete(id)); },
            async allFileIds() { return reqP((await store('files', 'readonly')).getAllKeys()); },

            allSystems() {
                const set = new Set(KNOWN_AUDIO_SYSTEMS);
                try { if (window.systemManager) window.systemManager.listSystems().forEach(id => set.add(id)); } catch (e) {}
                return Array.from(set);
            },

            // Elimina i file audio non più usati da nessuna soundboard o playlist
            async collectUnused() {
                const boards = await lib.getAllBoards();
                const used = new Set();
                boards.forEach(b => [].concat(b.pads || [], b.playlist || []).forEach(i => { if (i && i.fileId) used.add(i.fileId); }));
                const ids = await lib.allFileIds();
                for (const id of ids) {
                    if (!used.has(id)) {
                        await lib.deleteFile(id);
                        forgetFile(id);
                    }
                }
            },

            // Prima apertura: copia pad e brani salvati finora nel browser (localStorage) in tutte le soundboard.
            // Le vecchie chiavi restano come copia di sicurezza.
            ensureMigrated() {
                if (migration) return migration;
                migration = (async () => {
                    const existing = await lib.getAllBoards();
                    if (existing.length > 0) return;
                    let legacyPads = null, legacyList = null;
                    try { legacyPads = JSON.parse(localStorage.getItem('vtt_audio_sfx_pads') || 'null'); } catch (e) {}
                    try { legacyList = JSON.parse(localStorage.getItem('vtt_audio_playlist') || 'null'); } catch (e) {}
                    const convert = async (arr) => {
                        if (!Array.isArray(arr)) return null;
                        const out = [];
                        for (const it of arr) {
                            if (!it || typeof it !== 'object') continue;
                            const title = String(it.title || '🔊').slice(0, 60);
                            const id = it.id || ('lg_' + Math.random().toString(36).slice(2, 9));
                            if (it.synth) { out.push({ id, title, synth: it.synth }); continue; }
                            if (typeof it.src === 'string' && it.src.startsWith('data:')) {
                                const blob = dataUrlToBlob(it.src);
                                if (!blob) continue;
                                const fileId = await lib.saveFile(blob, blob.type);
                                out.push({ id, title, fileId, size: blob.size });
                            } else if (typeof it.src === 'string' && it.src) {
                                out.push({ id, title, src: it.src });
                            }
                        }
                        return out;
                    };
                    const pads = await convert(legacyPads);
                    const list = await convert(legacyList);
                    for (const sys of lib.allSystems()) {
                        const b = defaultBoard(sys);
                        if (pads) b.pads = pads.map(p => Object.assign({}, p));
                        if (list) b.playlist = list.map(p => Object.assign({}, p));
                        await lib.putBoard(b);
                    }
                })();
                migration.catch(() => { migration = null; });
                return migration;
            }
        };
        return lib;
    })();

    // File del Master già pronti da suonare (URL locali) o da spedire (testo base64), creati solo quando servono
    const fileUrlCache = new Map();
    const fileDataUrlCache = new Map();
    function forgetFile(id) {
        const u = fileUrlCache.get(id);
        if (u) { try { URL.revokeObjectURL(u); } catch (e) {} }
        fileUrlCache.delete(id);
        fileDataUrlCache.delete(id);
    }
    async function getFileUrl(id) {
        if (fileUrlCache.has(id)) return fileUrlCache.get(id);
        const rec = await AudioLibrary.getFile(id);
        if (!rec || !rec.blob) throw new Error('file mancante');
        const url = URL.createObjectURL(rec.blob);
        fileUrlCache.set(id, url);
        return url;
    }
    async function getFileDataUrl(id) {
        if (fileDataUrlCache.has(id)) return fileDataUrlCache.get(id);
        const rec = await AudioLibrary.getFile(id);
        if (!rec || !rec.blob) throw new Error('file mancante');
        const d = await blobToDataUrl(rec.blob);
        fileDataUrlCache.set(id, d);
        if (fileDataUrlCache.size > 8) fileDataUrlCache.delete(fileDataUrlCache.keys().next().value);
        return d;
    }

    // ===================== FILE DEI PAD AI GIOCATORI: una volta sola per sessione =====================
    // Master: alla pressione invia solo AUDIO_SFX_PLAY {fileKey}. Il Giocatore che non ha il file lo chiede
    // (AUDIO_SFX_REQUEST) e il Master glielo manda a pezzi da 24 KB (AUDIO_SFX_DATA), lasciando passare prima
    // i messaggi di gioco. Se il file arriva più di 2 s dopo la pressione non viene suonato (sarebbe fuori tempo).
    const SFX_PART = 24000;
    const SFX_LATE_MS = 2000;
    const sfxSending = new Set();
    const remoteSfx = { urls: new Map(), incoming: new Map(), pending: new Map(), stats: { requests: 0, partsSent: 0, partsReceived: 0 } };

    function waitChannelDrain(dc) {
        if (!dc || typeof dc.bufferedAmount !== 'number' || dc.bufferedAmount < 65536) return Promise.resolve();
        return new Promise(resolve => {
            let t = null;
            const done = () => { try { dc.removeEventListener('bufferedamountlow', done); } catch (e) {} if (t) clearTimeout(t); resolve(); };
            try { dc.addEventListener('bufferedamountlow', done); } catch (e) { resolve(); return; }
            t = setTimeout(done, 4000); // rete di sicurezza
        });
    }

    async function sendSfxFileTo(fileKey, peerId) {
        const net = AudioState.network;
        if (!net || !fileKey || !peerId) return;
        const key = peerId + '|' + fileKey;
        if (sfxSending.has(key)) return;
        sfxSending.add(key);
        try {
            const dataUrl = await getFileDataUrl(fileKey);
            const total = Math.max(1, Math.ceil(dataUrl.length / SFX_PART));
            for (let i = 0; i < total; i++) {
                if (peerId !== 'local') {
                    // destinatario uscito: smetti (un invio a un peer sconosciuto andrebbe a tutti)
                    if (!net.connections || !net.connections[peerId]) return;
                    const c = net.connections[peerId];
                    await waitChannelDrain(c && c.conn && c.conn.dataChannel);
                    if (!net.connections[peerId]) return;
                }
                net.send({ type: 'AUDIO_SFX_DATA', payload: { fileKey, idx: i, total, chunk: dataUrl.slice(i * SFX_PART, (i + 1) * SFX_PART) } }, peerId);
                remoteSfx.stats.partsSent++;
            }
        } catch (e) {
            console.warn('Invio file del pad non riuscito:', e);
        } finally {
            sfxSending.delete(key);
        }
    }

    function playRemoteSfxFile(p) {
        const url = remoteSfx.urls.get(p.fileKey);
        if (url) { playSFX(null, url, p.title); return; }
        remoteSfx.pending.set(p.fileKey, { title: p.title, at: Date.now() });
        const inc = remoteSfx.incoming.get(p.fileKey);
        if (inc && Date.now() - inc.at < 15000) return; // già richiesto, in arrivo
        remoteSfx.incoming.set(p.fileKey, { parts: [], total: 0, at: Date.now() });
        remoteSfx.stats.requests++;
        if (AudioState.network) AudioState.network.send({ type: 'AUDIO_SFX_REQUEST', payload: { fileKey: p.fileKey } });
    }

    function receiveSfxPart(p) {
        if (!p || !p.fileKey || typeof p.chunk !== 'string') return;
        const total = Math.max(1, Math.min(2000, parseInt(p.total, 10) || 1));
        const idx = parseInt(p.idx, 10);
        if (!(idx >= 0 && idx < total)) return;
        let inc = remoteSfx.incoming.get(p.fileKey);
        if (!inc) { inc = { parts: [], total, at: Date.now() }; remoteSfx.incoming.set(p.fileKey, inc); }
        inc.total = total;
        inc.parts[idx] = p.chunk;
        remoteSfx.stats.partsReceived++;
        for (let i = 0; i < total; i++) if (inc.parts[i] === undefined) return;
        remoteSfx.incoming.delete(p.fileKey);
        const blob = dataUrlToBlob(inc.parts.join(''));
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        remoteSfx.urls.set(p.fileKey, url);
        if (remoteSfx.urls.size > 40) { // tetto di memoria: dimentica il più vecchio
            const oldKey = remoteSfx.urls.keys().next().value;
            try { URL.revokeObjectURL(remoteSfx.urls.get(oldKey)); } catch (e) {}
            remoteSfx.urls.delete(oldKey);
        }
        const pend = remoteSfx.pending.get(p.fileKey);
        remoteSfx.pending.delete(p.fileKey);
        if (pend && Date.now() - pend.at <= SFX_LATE_MS) playSFX(null, url, pend.title);
    }

    // -- RETE / SINCRONIZZAZIONE P2P --
    function handleIncomingAudio(data, peerId) {
        if (!data || !data.type || !data.type.startsWith('AUDIO_')) return;

        // File dei pad: richieste e pezzi viaggiano solo tra Master e chi li chiede, mai rimbalzati a tutti
        if (data.type === 'AUDIO_SFX_REQUEST') {
            if (AudioState.isDM && data.payload) sendSfxFileTo(data.payload.fileKey, peerId);
            return;
        }
        if (data.type === 'AUDIO_SFX_DATA') {
            if (!AudioState.isDM) receiveSfxPart(data.payload);
            return;
        }
        
        if (data.payload && data.payload.id) {
            if (AudioState.handledEventIds.has(data.payload.id)) return;
            AudioState.handledEventIds.add(data.payload.id);
            if (AudioState.handledEventIds.size > 100) {
                const arr = Array.from(AudioState.handledEventIds);
                AudioState.handledEventIds = new Set(arr.slice(50));
            }
        }

        if (AudioState.isDM && AudioState.network) {
            AudioState.network.send(data);
        }

        switch (data.type) {
            case 'AUDIO_BGM_PLAY':
                playBGM(data.payload.src, data.payload.title, data.payload.loop, data.payload.time || 0);
                break;
            case 'AUDIO_BGM_PAUSE':
                pauseBGM();
                break;
            case 'AUDIO_BGM_RESUME':
                resumeBGM();
                break;
            case 'AUDIO_BGM_STOP':
                stopBGM();
                break;
            case 'AUDIO_SFX_PLAY':
                if (data.payload.fileKey && !data.payload.synth && !data.payload.src) {
                    if (!AudioState.isDM) playRemoteSfxFile(data.payload);
                } else {
                    playSFX(data.payload.synth, data.payload.src, data.payload.title);
                }
                break;
        }
    }


    // -- SETUP INTERFACCIA MASTER (DM) --
    function initDMUI() {
        const btnToggleAudio = document.getElementById('btn-toggle-audio');
        const audioPanel = document.getElementById('audio-panel');
        if (!audioPanel) return;

        const audioHeader = document.getElementById('audio-panel-header');
        if (window.makeDraggable) window.makeDraggable(audioPanel, audioHeader);

        if (btnToggleAudio) {
            btnToggleAudio.addEventListener('click', () => {
                audioPanel.style.display = audioPanel.style.display === 'none' ? 'flex' : 'none';
            });
        }
        
        const btnClose = document.getElementById('btn-close-audio-panel');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                audioPanel.style.display = 'none';
            });
        }

        const tabMusic = document.getElementById('tab-btn-audio-music');
        const tabSfx = document.getElementById('tab-btn-audio-sfx');
        const secMusic = document.getElementById('audio-section-music');
        const secSfx = document.getElementById('audio-section-sfx');

        if (tabMusic && tabSfx) {
            tabMusic.addEventListener('click', () => {
                tabMusic.style.background = '#9c27b0';
                tabSfx.style.background = '#444';
                secMusic.style.display = 'flex';
                secSfx.style.display = 'none';
            });
            tabSfx.addEventListener('click', () => {
                tabSfx.style.background = '#9c27b0';
                tabMusic.style.background = '#444';
                secMusic.style.display = 'none';
                secSfx.style.display = 'flex';
            });
        }

        document.getElementById('btn-bgm-resume').addEventListener('click', () => {
            resumeBGM();
            const id = Date.now() + '_' + Math.random();
            AudioState.handledEventIds.add(id);
            AudioState.network.send({ type: 'AUDIO_BGM_RESUME', payload: { id } });
        });

        document.getElementById('btn-bgm-pause').addEventListener('click', () => {
            pauseBGM();
            const id = Date.now() + '_' + Math.random();
            AudioState.handledEventIds.add(id);
            AudioState.network.send({ type: 'AUDIO_BGM_PAUSE', payload: { id } });
        });

        document.getElementById('btn-bgm-stop').addEventListener('click', () => {
            stopBGM();
            const id = Date.now() + '_' + Math.random();
            AudioState.handledEventIds.add(id);
            AudioState.network.send({ type: 'AUDIO_BGM_STOP', payload: { id } });
        });

        // Volume DM
        const volSlider = document.getElementById('dm-audio-volume');
        const dmVolLabel = document.getElementById('dm-volume-label');
        if (volSlider) {
            const currentPercent = Math.round(AudioState.localVolume * 100);
            volSlider.value = currentPercent;
            if (dmVolLabel) dmVolLabel.innerText = currentPercent + '%';

            volSlider.addEventListener('input', (e) => {
                AudioState.localVolume = parseInt(e.target.value) / 100;
                localStorage.setItem('vtt_audio_volume_dm', AudioState.localVolume);
                if (dmVolLabel) dmVolLabel.innerText = e.target.value + '%';
                updateEffectiveVolume();
            });
        }

        // Riproduci Traccia Custom / Caricamento File
        const inputTitle = document.getElementById('bgm-custom-title');
        const inputUrl = document.getElementById('bgm-custom-url');
        const inputFile = document.getElementById('bgm-custom-file');
        let selectedFileBase64 = null;
        let selectedFileObj = null;

        if (inputUrl) {
            inputUrl.addEventListener('input', () => {
                selectedFileBase64 = null;
                selectedFileObj = null;
                if (inputFile) inputFile.value = '';
            });
        }

        if (inputFile) {
            inputFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    selectedFileObj = file;
                    if (inputUrl) inputUrl.value = '';
                    if (!inputTitle.value) inputTitle.value = file.name.replace(/\.[^/.]+$/, "");
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        selectedFileBase64 = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        function triggerCustomPlay() {
            const title = inputTitle.value.trim() || 'Traccia Personale';
            const src = (inputUrl && inputUrl.value.trim()) ? inputUrl.value.trim() : selectedFileBase64;
            const loop = document.getElementById('bgm-loop-check').checked;
            if (!src) {
                vttWarn("Incolla prima un URL audio (es. mp3) oppure carica un file dal PC!");
                return;
            }

            playBGM(src, title, loop);
            const id = Date.now() + '_' + Math.random();
            AudioState.handledEventIds.add(id);
            AudioState.network.send({
                type: 'AUDIO_BGM_PLAY',
                payload: {
                    id: id,
                    src: src,
                    title: title,
                    loop: loop,
                    time: 0
                }
            });
        }

        document.getElementById('btn-bgm-play-custom').addEventListener('click', triggerCustomPlay);

        // ===================== SOUNDBOARD E PLAYLIST PER SISTEMA DI GIOCO =====================
        // Una soundboard e una playlist per ogni sistema (5e, 7th Sea, Non Cedere al Sonno), salvate nell'archivio
        // audio del browser (IndexedDB "VTT_AUDIO", separato da campagne e mappe). I file audio sono salvati come
        // file veri e caricati solo quando si preme il pad. Al cambio di campagna si passa alla soundboard del suo sistema.
        const Boards = { active: 'dnd5e', board: null, editMode: false, loadSeq: 0 };

        function sysName(id) {
            try { return (window.systemManager && window.systemManager.displayName(id)) || id; } catch (e) { return id; }
        }
        function currentSystemId() {
            try { return (window.systemManager && window.systemManager.getActiveSystemId()) || 'dnd5e'; } catch (e) { return 'dnd5e'; }
        }

        async function loadActiveBoard(sysId) {
            const seq = ++Boards.loadSeq;
            const target = sysId || currentSystemId();
            let board = null;
            try {
                await AudioLibrary.ensureMigrated();
                board = await AudioLibrary.getBoard(target);
                if (!board) {
                    board = defaultBoard(target);
                    await AudioLibrary.putBoard(board);
                }
            } catch (e) {
                console.warn('Archivio audio non disponibile:', e);
                warnOnce('🔊 Archivio audio del browser non disponibile: soundboard e playlist non verranno salvate.');
                board = (Boards.board && Boards.active === target) ? Boards.board : defaultBoard(target);
            }
            if (seq !== Boards.loadSeq) return; // nel frattempo è stato chiesto un altro sistema
            Boards.active = target;
            Boards.board = board;
            renderSoundboardPads();
            renderPlaylist();
        }

        function saveBoard() {
            if (!Boards.board) return Promise.resolve();
            return AudioLibrary.putBoard(Boards.board).catch(err => {
                console.warn('Salvataggio soundboard non riuscito:', err);
                audioToast('⚠️ Salvataggio della soundboard non riuscito: spazio del browser esaurito?');
            });
        }

        function newId(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

        // ---- Barra della soundboard: nome del sistema, Modifica, Esporta, Importa ----
        const sfxGrid = document.getElementById('audio-sfx-grid');
        let sfxBar = null, sfxEditRow = null, sfxChoice = null, sfxLabelName = null, btnEdit = null, importInput = null;
        if (sfxGrid && !document.getElementById('sfx-board-bar')) {
            const mkBtn = (text, title, bg) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.textContent = text;
                if (title) b.title = title;
                b.style.cssText = `background:${bg || '#444'}; color:white; border:none; padding:3px 7px; border-radius:3px; cursor:pointer; font-size:11px;`;
                return b;
            };
            sfxBar = document.createElement('div');
            sfxBar.id = 'sfx-board-bar';
            sfxBar.style.cssText = 'display:flex; align-items:center; gap:4px; flex-wrap:wrap; font-size:12px;';
            const lbl = document.createElement('span');
            lbl.style.cssText = 'flex:1; min-width:110px; color:#ba68c8; font-weight:bold;';
            const lblText = document.createElement('span');
            lblText.textContent = '🎛️ Soundboard:';
            sfxLabelName = document.createElement('span');
            sfxLabelName.id = 'sfx-board-system';
            sfxLabelName.style.marginLeft = '4px';
            lbl.appendChild(lblText);
            lbl.appendChild(sfxLabelName);
            btnEdit = mkBtn('✏️ Modifica', 'Elimina, sposta o rinomina i pad');
            btnEdit.id = 'btn-sfx-edit';
            const btnExport = mkBtn('⬇️ Esporta', 'Salva soundboard e playlist in un file');
            btnExport.id = 'btn-sfx-export';
            const importLabel = document.createElement('label');
            importLabel.title = 'Carica una soundboard da un file';
            importLabel.style.cssText = 'background:#444; color:white; padding:3px 7px; border-radius:3px; cursor:pointer; font-size:11px;';
            const importText = document.createElement('span');
            importText.textContent = '⬆️ Importa';
            importInput = document.createElement('input');
            importInput.type = 'file';
            importInput.id = 'sfx-import-file';
            importInput.accept = '.json,application/json';
            importInput.style.display = 'none';
            importLabel.appendChild(importText);
            importLabel.appendChild(importInput);
            sfxBar.appendChild(lbl);
            sfxBar.appendChild(btnEdit);
            sfxBar.appendChild(btnExport);
            sfxBar.appendChild(importLabel);

            sfxEditRow = document.createElement('div');
            sfxEditRow.id = 'sfx-edit-row';
            sfxEditRow.style.cssText = 'display:none; align-items:center; gap:6px; flex-wrap:wrap; font-size:11px; color:#aaa;';
            const btnRestore = mkBtn('↺ Ripristina predefiniti', 'Rimette gli 8 suoni originali che hai eliminato', '#555');
            btnRestore.id = 'btn-sfx-restore';
            const hint = document.createElement('span');
            hint.textContent = 'Trascina i pad o usa ◀ ▶ per spostarli; tocca il nome per rinominarlo.';
            sfxEditRow.appendChild(btnRestore);
            sfxEditRow.appendChild(hint);

            sfxChoice = document.createElement('div');
            sfxChoice.id = 'sfx-board-choice';
            sfxChoice.style.cssText = 'display:none; background:#2a2a2a; border:1px solid #7b1fa2; border-radius:5px; padding:6px; font-size:12px; flex-direction:column; gap:6px;';

            sfxGrid.parentNode.insertBefore(sfxBar, sfxGrid);
            sfxGrid.parentNode.insertBefore(sfxEditRow, sfxGrid);
            sfxGrid.parentNode.insertBefore(sfxChoice, sfxGrid);

            btnEdit.addEventListener('click', () => {
                Boards.editMode = !Boards.editMode;
                renderSoundboardPads();
            });
            btnRestore.addEventListener('click', () => {
                if (!Boards.board) return;
                let added = 0;
                AudioState.defaultSfxPads.forEach(d => {
                    if (!Boards.board.pads.some(p => p.synth === d.synth)) { Boards.board.pads.push(Object.assign({}, d)); added++; }
                });
                saveBoard();
                renderSoundboardPads();
                audioToast(added > 0 ? `${tr('↺ Suoni predefiniti ripristinati:')} ${added}` : tr('Tutti i suoni predefiniti sono già presenti.'));
            });
            btnExport.addEventListener('click', () => {
                showChoice(tr('Cosa vuoi esportare?'), [
                    { label: `${tr('Solo')} ${sysName(Boards.active)}`, fn: () => exportBoards(false) },
                    { label: tr('Tutti i sistemi'), fn: () => exportBoards(true) }
                ]);
            });
            importInput.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                importInput.value = '';
                if (file) prepareImport(file);
            });
        }

        function showChoice(message, options) {
            if (!sfxChoice) return;
            sfxChoice.innerHTML = '';
            const msg = document.createElement('div');
            msg.textContent = message;
            sfxChoice.appendChild(msg);
            const row = document.createElement('div');
            row.style.cssText = 'display:flex; gap:5px; flex-wrap:wrap;';
            const close = () => { sfxChoice.style.display = 'none'; sfxChoice.innerHTML = ''; };
            options.concat([{ label: tr('Annulla'), fn: null, muted: true }]).forEach(opt => {
                const b = document.createElement('button');
                b.type = 'button';
                b.textContent = opt.label;
                b.style.cssText = `background:${opt.muted ? '#444' : '#7b1fa2'}; color:white; border:none; padding:4px 8px; border-radius:3px; cursor:pointer; font-size:11px; font-weight:bold;`;
                b.addEventListener('click', () => { close(); if (opt.fn) opt.fn(); });
                row.appendChild(b);
            });
            sfxChoice.appendChild(row);
            sfxChoice.style.display = 'flex';
        }

        // ---- Pad ----
        function triggerPad(pad) {
            const id = Date.now() + '_' + Math.random();
            AudioState.handledEventIds.add(id);
            if (pad.synth) {
                playSFX(pad.synth, null, pad.title);
                AudioState.network.send({ type: 'AUDIO_SFX_PLAY', payload: { id, synth: pad.synth, title: pad.title } });
            } else if (pad.fileId) {
                // Ai giocatori solo l'ordine: chi non ha ancora il file lo chiede una volta (AUDIO_SFX_REQUEST)
                AudioState.network.send({ type: 'AUDIO_SFX_PLAY', payload: { id, fileKey: pad.fileId, title: pad.title, size: pad.size || 0 } });
                getFileUrl(pad.fileId).then(url => playSFX(null, url, pad.title)).catch(() => {
                    audioToast(`${tr('⚠️ File audio del pad non trovato:')} ${pad.title}`);
                });
            } else if (pad.src) {
                playSFX(null, pad.src, pad.title);
                AudioState.network.send({ type: 'AUDIO_SFX_PLAY', payload: { id, src: pad.src, title: pad.title } });
            }
        }

        function movePad(from, to) {
            const pads = Boards.board.pads;
            if (to < 0 || to >= pads.length || from === to) return;
            const [item] = pads.splice(from, 1);
            pads.splice(to, 0, item);
            saveBoard();
            renderSoundboardPads();
        }

        function startRename(span, item, onDone) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = item.title;
            input.maxLength = 60;
            input.style.cssText = 'width:100%; box-sizing:border-box; background:#111; color:white; border:1px solid #ba68c8; border-radius:3px; padding:2px 4px; font-size:12px;';
            let finished = false;
            const finish = (save) => {
                if (finished) return;
                finished = true;
                const v = input.value.trim();
                if (save && v) item.title = v.slice(0, 60);
                onDone(save && !!v);
            };
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); finish(true); }
                else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
            });
            input.addEventListener('blur', () => finish(true));
            span.replaceWith(input);
            input.focus();
            input.select();
        }

        let dragPadIndex = -1;
        function renderSoundboardPads() {
            const grid = document.getElementById('audio-sfx-grid');
            if (!grid) return;
            grid.innerHTML = '';
            if (sfxLabelName) sfxLabelName.textContent = sysName(Boards.active);
            if (btnEdit) {
                btnEdit.textContent = Boards.editMode ? tr('✔ Fine modifica') : tr('✏️ Modifica');
                btnEdit.style.background = Boards.editMode ? '#7b1fa2' : '#444';
            }
            if (sfxEditRow) sfxEditRow.style.display = Boards.editMode ? 'flex' : 'none';
            const pads = Boards.board ? Boards.board.pads : [];

            pads.forEach((pad, index) => {
                if (!Boards.editMode) {
                    const btn = document.createElement('button');
                    btn.innerText = pad.title;
                    btn.style.padding = '8px 5px';
                    btn.style.background = '#333';
                    btn.style.color = 'white';
                    btn.style.border = '1px solid #7b1fa2';
                    btn.style.borderRadius = '5px';
                    btn.style.cursor = 'pointer';
                    btn.style.fontSize = '12px';
                    btn.style.fontWeight = 'bold';
                    btn.style.transition = 'all 0.1s ease';
                    btn.onmousedown = () => { btn.style.background = '#9c27b0'; };
                    btn.onmouseup = () => { btn.style.background = '#333'; };
                    btn.onclick = () => triggerPad(pad);
                    grid.appendChild(btn);
                    return;
                }
                // Modalità Modifica: niente riproduzione, solo elimina / sposta / rinomina
                const cell = document.createElement('div');
                cell.className = 'sfx-edit-cell';
                cell.draggable = true;
                cell.style.cssText = 'display:flex; flex-direction:column; gap:4px; padding:5px; background:#2a2a2a; border:1px dashed #ba68c8; border-radius:5px; cursor:grab;';
                const name = document.createElement('span');
                name.className = 'sfx-edit-name';
                name.textContent = pad.title;
                name.title = tr('Tocca per rinominare');
                name.style.cssText = 'font-size:12px; font-weight:bold; color:white; cursor:text; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
                name.addEventListener('click', () => startRename(name, pad, (changed) => { if (changed) saveBoard(); renderSoundboardPads(); }));
                const tools = document.createElement('div');
                tools.style.cssText = 'display:flex; gap:3px; justify-content:space-between;';
                const mk = (txt, title, fn, bg) => {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.textContent = txt;
                    b.title = title;
                    b.style.cssText = `flex:1; background:${bg || '#444'}; color:white; border:none; border-radius:3px; padding:2px 0; cursor:pointer; font-size:11px;`;
                    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
                    return b;
                };
                tools.appendChild(mk('◀', tr('Sposta indietro'), () => movePad(index, index - 1)));
                tools.appendChild(mk('▶', tr('Sposta avanti'), () => movePad(index, index + 1)));
                tools.appendChild(mk('✕', tr('Elimina pad'), async () => {
                    const ask = (typeof window.t === 'function' ? window.t(`Eliminare il pad "${pad.title}"?`) : `Eliminare il pad "${pad.title}"?`);
                    const okDel = window.vttConfirm ? await window.vttConfirm(ask, { danger: true }) : true;
                    if (!okDel) return;
                    const i = Boards.board.pads.indexOf(pad);
                    if (i >= 0) Boards.board.pads.splice(i, 1);
                    await saveBoard();
                    renderSoundboardPads();
                    collectUnusedFiles();
                }, '#8e2424'));
                cell.appendChild(name);
                cell.appendChild(tools);
                cell.addEventListener('dragstart', (e) => {
                    dragPadIndex = index;
                    try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(index)); } catch (err) {}
                });
                cell.addEventListener('dragover', (e) => { e.preventDefault(); cell.style.borderColor = '#fff'; });
                cell.addEventListener('dragleave', () => { cell.style.borderColor = '#ba68c8'; });
                cell.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const from = dragPadIndex;
                    dragPadIndex = -1;
                    if (from >= 0) movePad(from, index);
                });
                cell.addEventListener('dragend', () => { dragPadIndex = -1; });
                grid.appendChild(cell);
            });
        }

        // ---- Playlist ----
        function playTrack(item) {
            const loop = document.getElementById('bgm-loop-check').checked;
            const sendPlay = (src) => {
                const id = Date.now() + '_' + Math.random();
                AudioState.handledEventIds.add(id);
                AudioState.network.send({ type: 'AUDIO_BGM_PLAY', payload: { id, src, title: item.title, loop, time: 0 } });
            };
            if (item.fileId) {
                getFileUrl(item.fileId).then(url => playBGM(url, item.title, loop)).catch(() => {
                    audioToast(`${tr('⚠️ File audio non trovato:')} ${item.title}`);
                });
                // Ai giocatori il brano dal PC arriva intero (come prima): per la musica sono consigliati i link diretti
                getFileDataUrl(item.fileId).then(sendPlay).catch(() => {});
            } else if (item.src) {
                playBGM(item.src, item.title, loop);
                sendPlay(item.src);
            }
        }

        function renderPlaylist() {
            const listContainer = document.getElementById('audio-playlist-list');
            if (!listContainer) return;
            listContainer.innerHTML = '';
            const list = Boards.board ? Boards.board.playlist : [];

            list.forEach((item, index) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.justifyContent = 'space-between';
                row.style.background = '#2a2a2a';
                row.style.padding = '5px 8px';
                row.style.borderRadius = '4px';
                row.style.fontSize = '13px';

                const titleSpan = document.createElement('span');
                titleSpan.innerText = item.title;
                titleSpan.style.cursor = 'pointer';
                titleSpan.style.flex = '1';
                titleSpan.style.overflow = 'hidden';
                titleSpan.style.textOverflow = 'ellipsis';
                titleSpan.style.whiteSpace = 'nowrap';
                titleSpan.onclick = () => playTrack(item);

                const actions = document.createElement('div');
                actions.style.display = 'flex';
                actions.style.gap = '4px';
                const mk = (txt, title, bg, fn) => {
                    const b = document.createElement('button');
                    b.innerText = txt;
                    b.title = title;
                    b.style.background = bg;
                    b.style.color = 'white';
                    b.style.border = 'none';
                    b.style.borderRadius = '3px';
                    b.style.cursor = 'pointer';
                    b.style.padding = '2px 6px';
                    b.onclick = fn;
                    return b;
                };
                const moveTrack = (to) => {
                    if (to < 0 || to >= list.length) return;
                    const [it] = list.splice(index, 1);
                    list.splice(to, 0, it);
                    saveBoard();
                    renderPlaylist();
                };
                actions.appendChild(mk('▶', tr('Suona'), '#9c27b0', () => playTrack(item)));
                if (index > 0) actions.appendChild(mk('▲', tr('Sposta su'), '#444', () => moveTrack(index - 1)));
                if (index < list.length - 1) actions.appendChild(mk('▼', tr('Sposta giù'), '#444', () => moveTrack(index + 1)));
                actions.appendChild(mk('✕', tr('Elimina brano'), '#555', async () => {
                    const i = list.indexOf(item);
                    if (i >= 0) list.splice(i, 1);
                    await saveBoard();
                    renderPlaylist();
                    collectUnusedFiles();
                }));
                row.appendChild(titleSpan);
                row.appendChild(actions);
                listContainer.appendChild(row);
            });
        }

        document.getElementById('btn-bgm-save-playlist').addEventListener('click', async () => {
            const title = (inputTitle.value.trim() || 'Nuova Traccia').slice(0, 60);
            const url = (inputUrl && inputUrl.value.trim()) ? inputUrl.value.trim() : '';
            if (!url && !selectedFileObj) {
                vttWarn("Inserisci un link audio o scegli un file prima di salvare in playlist!");
                return;
            }
            if (!Boards.board) return;
            let item;
            if (url) {
                item = { id: newId('bgm_'), title, src: url };
            } else {
                if (selectedFileObj.size > BGM_FILE_MAX) {
                    vttWarn(`${tr('File troppo grande per la playlist (massimo 20 MB):')} ${Math.round(selectedFileObj.size / 1048576)} MB`);
                    return;
                }
                try {
                    const fileId = await AudioLibrary.saveFile(selectedFileObj, selectedFileObj.type);
                    item = { id: newId('bgm_'), title, fileId, size: selectedFileObj.size };
                } catch (e) {
                    vttWarn(tr('Salvataggio del file audio non riuscito: spazio del browser esaurito?'));
                    return;
                }
            }
            Boards.board.playlist.push(item);
            await saveBoard();
            renderPlaylist();
            inputTitle.value = '';
            if (inputUrl) inputUrl.value = '';
            if (inputFile) inputFile.value = '';
            selectedFileBase64 = null;
            selectedFileObj = null;
        });

        // ---- Aggiungi pad ----
        const inputSfxTitle = document.getElementById('sfx-custom-title');
        const inputSfxUrl = document.getElementById('sfx-custom-url');
        const inputSfxFile = document.getElementById('sfx-custom-file');
        let selectedSfxFile = null;

        if (inputSfxFile) {
            inputSfxFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                selectedSfxFile = null;
                if (!file) return;
                if (file.size > SFX_FILE_MAX) {
                    vttWarn(`${tr('Effetto troppo grande (massimo 2 MB; consigliati file brevi sotto i 300 KB):')} ${(file.size / 1048576).toFixed(1)} MB`);
                    inputSfxFile.value = '';
                    return;
                }
                selectedSfxFile = file;
                if (!inputSfxTitle.value) inputSfxTitle.value = '🔊 ' + file.name.replace(/\.[^/.]+$/, "");
            });
        }

        document.getElementById('btn-sfx-add-pad').addEventListener('click', async () => {
            const title = (inputSfxTitle.value.trim() || '🔊 Effetto').slice(0, 60);
            const url = inputSfxUrl.value.trim();
            if (!selectedSfxFile && !url) return;
            if (!Boards.board) return;
            let pad;
            if (selectedSfxFile) {
                try {
                    const fileId = await AudioLibrary.saveFile(selectedSfxFile, selectedSfxFile.type);
                    pad = { id: newId('sfx_'), title, fileId, size: selectedSfxFile.size };
                } catch (e) {
                    vttWarn(tr('Salvataggio del file audio non riuscito: spazio del browser esaurito?'));
                    return;
                }
            } else {
                pad = { id: newId('sfx_'), title, src: url };
            }
            Boards.board.pads.push(pad);
            await saveBoard();
            renderSoundboardPads();
            inputSfxTitle.value = '';
            inputSfxUrl.value = '';
            if (inputSfxFile) inputSfxFile.value = '';
            selectedSfxFile = null;
        });

        // ---- Esporta / Importa ----
        async function serializeItem(item, maxSize) {
            const out = { title: item.title };
            if (item.synth) { out.synth = item.synth; return out; }
            if (item.src) { out.src = item.src; return out; }
            if (item.fileId) {
                const rec = await AudioLibrary.getFile(item.fileId).catch(() => null);
                if (!rec || !rec.blob || rec.blob.size > maxSize) return null;
                out.data = await blobToDataUrl(rec.blob);
                return out;
            }
            return null;
        }

        async function exportBoards(all) {
            try {
                await saveBoard();
                const systems = all ? AudioLibrary.allSystems() : [Boards.active];
                const out = { formato: 'vtt-soundboard-1', creato: new Date().toISOString(), sistemi: {} };
                for (const sys of systems) {
                    const board = (sys === Boards.active && Boards.board) ? Boards.board : ((await AudioLibrary.getBoard(sys)) || defaultBoard(sys));
                    const pads = (await Promise.all(board.pads.map(p => serializeItem(p, SFX_FILE_MAX)))).filter(Boolean);
                    const playlist = (await Promise.all(board.playlist.map(p => serializeItem(p, BGM_FILE_MAX)))).filter(Boolean);
                    out.sistemi[sys] = { nome: sysName(sys), pads, playlist };
                }
                const d = new Date();
                const pad2 = (n) => String(n).padStart(2, '0');
                const fname = `soundboard_${all ? 'tutti' : Boards.active}_${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}.json`;
                const blob = new Blob([JSON.stringify(out)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fname;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 5000);
                window._lastSoundboardExport = out; // per i test
                audioToast(`${tr('⬇️ Soundboard esportata:')} ${fname}`);
            } catch (e) {
                console.warn('Esportazione soundboard non riuscita:', e);
                audioToast(tr('⚠️ Esportazione della soundboard non riuscita.'));
            }
        }

        async function prepareImport(file) {
            let data;
            try { data = JSON.parse(await file.text()); } catch (e) { data = null; }
            if (!data || data.formato !== 'vtt-soundboard-1' || !data.sistemi || typeof data.sistemi !== 'object') {
                vttWarn(tr('File non valido: non è una soundboard esportata dal VTT.'));
                return;
            }
            const keys = Object.keys(data.sistemi).filter(k => /^[a-z0-9_-]{1,30}$/i.test(k) && data.sistemi[k] && typeof data.sistemi[k] === 'object');
            if (keys.length === 0) { vttWarn(tr('Il file non contiene nessuna soundboard.')); return; }
            const single = keys.length === 1;
            const where = single ? `${tr('nella soundboard di')} ${sysName(Boards.active)}` : `${tr('in')} ${keys.length} ${tr('sistemi')}: ${keys.map(sysName).join(', ')}`;
            showChoice(`${tr('Importa')} ${where}:`, [
                { label: tr('➕ Aggiungi ai pad attuali'), fn: () => applyImport(data, keys, single, false) },
                { label: tr('♻️ Sostituisci'), fn: () => applyImport(data, keys, single, true) }
            ]);
        }

        async function importItem(src, kind) {
            if (!src || typeof src !== 'object') return null;
            const title = String(src.title || (kind === 'pad' ? '🔊 Effetto' : 'Traccia')).trim().slice(0, 60) || '🔊';
            if (kind === 'pad' && src.synth) {
                return SoundSynthesizer[src.synth] ? { id: newId('sfx_'), title, synth: src.synth } : null;
            }
            if (typeof src.src === 'string' && /^https?:\/\//i.test(src.src)) {
                return { id: newId(kind === 'pad' ? 'sfx_' : 'bgm_'), title, src: src.src };
            }
            if (typeof src.data === 'string' && /^data:(audio\/|application\/octet-stream|video\/ogg|video\/webm)/i.test(src.data)) {
                const blob = dataUrlToBlob(src.data);
                if (!blob) return null;
                if (blob.size > (kind === 'pad' ? SFX_FILE_MAX : BGM_FILE_MAX)) return null;
                const fileId = await AudioLibrary.saveFile(blob, blob.type);
                return { id: newId(kind === 'pad' ? 'sfx_' : 'bgm_'), title, fileId, size: blob.size };
            }
            return null;
        }

        async function applyImport(data, keys, single, replace) {
            let added = 0, skipped = 0;
            try {
                await saveBoard();
                for (const key of keys) {
                    const target = single ? Boards.active : key;
                    const srcBoard = data.sistemi[key];
                    let board = (target === Boards.active && Boards.board) ? Boards.board : ((await AudioLibrary.getBoard(target)) || defaultBoard(target));
                    const newPads = [], newList = [];
                    for (const p of (Array.isArray(srcBoard.pads) ? srcBoard.pads.slice(0, 200) : [])) {
                        const it = await importItem(p, 'pad');
                        if (it) newPads.push(it); else skipped++;
                    }
                    for (const p of (Array.isArray(srcBoard.playlist) ? srcBoard.playlist.slice(0, 200) : [])) {
                        const it = await importItem(p, 'track');
                        if (it) newList.push(it); else skipped++;
                    }
                    if (replace) {
                        board.pads = newPads;
                        board.playlist = newList;
                        added += newPads.length + newList.length;
                    } else {
                        newPads.forEach(p => {
                            if (p.synth && board.pads.some(x => x.synth === p.synth)) return;
                            if (p.src && board.pads.some(x => x.src === p.src)) return;
                            board.pads.push(p); added++;
                        });
                        newList.forEach(p => {
                            if (p.src && board.playlist.some(x => x.src === p.src)) return;
                            board.playlist.push(p); added++;
                        });
                    }
                    await AudioLibrary.putBoard(board);
                    if (target === Boards.active) Boards.board = board;
                }
                renderSoundboardPads();
                renderPlaylist();
                collectUnusedFiles();
                audioToast(`${tr('⬆️ Soundboard importata: elementi')} ${added}` + (skipped ? ` · ${tr('scartati')} ${skipped}` : ''));
            } catch (e) {
                console.warn('Importazione soundboard non riuscita:', e);
                audioToast(tr('⚠️ Importazione non riuscita: spazio del browser esaurito?'));
            }
        }

        let gcTimer = null;
        function collectUnusedFiles() {
            if (gcTimer) clearTimeout(gcTimer);
            gcTimer = setTimeout(() => { gcTimer = null; AudioLibrary.collectUnused().catch(() => {}); }, 400);
        }

        // Soundboard del sistema della campagna aperta: al cambio di campagna si passa a quella del nuovo sistema.
        // audio.js e dm.js sono caricati prima di system_manager.js: ci si aggancia a pagina pronta.
        let systemHooked = false;
        function hookSystemChanges() {
            if (systemHooked) return;
            if (!window.systemManager || typeof window.systemManager.onSystemChange !== 'function') return;
            systemHooked = true;
            window.systemManager.onSystemChange((id) => { Boards.editMode = false; loadActiveBoard(id); });
            if (currentSystemId() !== Boards.active) loadActiveBoard(currentSystemId());
        }
        hookSystemChanges();
        if (!systemHooked) {
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hookSystemChanges, { once: true });
            else setTimeout(hookSystemChanges, 0);
        }
        Boards.active = currentSystemId();
        Boards.board = null;
        renderSoundboardPads();
        renderPlaylist();
        loadActiveBoard(Boards.active);

        window.vttSoundboardDebug = {
            state: () => ({
                active: Boards.active, editMode: Boards.editMode,
                pads: Boards.board ? Boards.board.pads.map(p => ({ title: p.title, kind: p.synth ? 'synth' : (p.fileId ? 'file' : 'url'), fileId: p.fileId || null })) : null,
                playlist: Boards.board ? Boards.board.playlist.map(p => ({ title: p.title, kind: p.fileId ? 'file' : 'url' })) : null
            }),
            reload: () => loadActiveBoard(currentSystemId()),
            library: AudioLibrary
        };
    }


    // -- SETUP INTERFACCIA GIOCATORE (Player) --
    function initPlayerUI() {
        const btnToggleAudio = document.getElementById('pbtn-audio');
        const audioPanel = document.getElementById('player-audio-panel');
        if (!audioPanel) return;

        if (window.makeDraggable) window.makeDraggable(audioPanel);

        if (btnToggleAudio) {
            btnToggleAudio.addEventListener('click', () => {
                audioPanel.style.display = audioPanel.style.display === 'none' ? 'flex' : 'none';
            });
        }

        const btnClose = document.getElementById('pbtn-audio-close');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                audioPanel.style.display = 'none';
            });
        }

        // Slider Volume Giocatore
        const volSlider = document.getElementById('p-volume-slider');
        const volLabel = document.getElementById('p-volume-label');
        if (volSlider) {
            const currentPercent = Math.round(AudioState.localVolume * 100);
            volSlider.value = currentPercent;
            if (volLabel) volLabel.innerText = currentPercent + '%';

            volSlider.addEventListener('input', (e) => {
                AudioState.localVolume = parseInt(e.target.value) / 100;
                localStorage.setItem('vtt_audio_volume', AudioState.localVolume);
                if (volLabel) volLabel.innerText = e.target.value + '%';
                updateEffectiveVolume();
            });
        }

        // Pulsante Muto Giocatore
        const btnMute = document.getElementById('pbtn-audio-mute');
        function updateMuteButtonUI() {
            if (!btnMute) return;
            if (AudioState.isMuted) {
                btnMute.innerText = '🔊 Riattiva Audio';
                btnMute.style.background = '#d32f2f';
                if (btnToggleAudio) btnToggleAudio.innerText = '🔇';
            } else {
                btnMute.innerText = '🔇 Muta Audio';
                btnMute.style.background = '#444';
                if (btnToggleAudio) btnToggleAudio.innerText = '🔊';
            }
        }
        updateMuteButtonUI();

        if (btnMute) {
            btnMute.addEventListener('click', () => {
                AudioState.isMuted = !AudioState.isMuted;
                localStorage.setItem('vtt_audio_muted', AudioState.isMuted);
                updateEffectiveVolume();
                updateMuteButtonUI();
            });
        }

        const hint = document.getElementById('p-audio-unblock-hint');
        if (hint) {
            hint.addEventListener('click', () => {
                unlockAudioContext();
                hint.style.display = 'none';
            });
        }
    }


    // -- FUNZIONE PUBBLICA DI INIZIALIZZAZIONE --
    window.setupAudioSystem = function(isDM, network) {
        AudioState.isDM = isDM;
        AudioState.network = network;

        if (isDM) {
            // Il Master non ha il pulsante Muto: il muto e il volume salvati da una TV o da uno Schermo Giocatore
            // aperti nello stesso browser non devono zittirlo. Volume del Master con chiave propria (limite 20%).
            AudioState.isMuted = false;
            const dmVol = localStorage.getItem('vtt_audio_volume_dm');
            if (dmVol !== null) {
                let parsed = parseFloat(dmVol);
                if (isNaN(parsed) || parsed > 0.20 || parsed < 0) parsed = 0.03;
                AudioState.localVolume = parsed;
            }
            updateEffectiveVolume();
        }

        if (network && network.addListener) {
            network.addListener(handleIncomingAudio);
        }

        if (isDM) {
            initDMUI();
        } else {
            initPlayerUI();
        }
    };

    window.vttAudioDebug = {
        lastSfx: () => AudioState.lastSfx || null,
        level: () => ({ muted: AudioState.isMuted, volume: AudioState.localVolume, ctx: audioCtx ? audioCtx.state : 'nessuno' }),
        remote: () => ({ cached: Array.from(remoteSfx.urls.keys()), stats: Object.assign({}, remoteSfx.stats) })
    };

    window.getAudioState = function() {
        const rawSrc = AudioState.bgmCurrent.src;
        const safeSrc = (rawSrc && (rawSrc.startsWith('data:') || rawSrc.startsWith('blob:'))) ? null : rawSrc;
        return {
            bgm: {
                src: safeSrc,
                title: AudioState.bgmCurrent.title,
                isPlaying: AudioState.bgmCurrent.isPlaying,
                loop: AudioState.bgmCurrent.loop,
                time: AudioState.bgmAudio.currentTime || 0
            }
        };
    };

    window.syncPlayerAudio = function(audioState) {
        if (!audioState || !audioState.bgm) return;
        const bgm = audioState.bgm;
        if (bgm.isPlaying && bgm.src) {
            if (AudioState.bgmCurrent.src !== bgm.src || AudioState.bgmAudio.paused) {
                playBGM(bgm.src, bgm.title, bgm.loop, bgm.time);
            }
        } else if (!bgm.isPlaying && AudioState.bgmCurrent.isPlaying) {
            pauseBGM();
        }
    };

})();
