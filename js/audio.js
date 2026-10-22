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


    // -- RETE / SINCRONIZZAZIONE P2P --
    function handleIncomingAudio(data, peerId) {
        if (!data || !data.type || !data.type.startsWith('AUDIO_')) return;
        
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
                playSFX(data.payload.synth, data.payload.src, data.payload.title);
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
                localStorage.setItem('vtt_audio_volume', AudioState.localVolume);
                if (dmVolLabel) dmVolLabel.innerText = e.target.value + '%';
                updateEffectiveVolume();
            });
        }

        // Riproduci Traccia Custom / Caricamento File
        const inputTitle = document.getElementById('bgm-custom-title');
        const inputUrl = document.getElementById('bgm-custom-url');
        const inputFile = document.getElementById('bgm-custom-file');
        let selectedFileBase64 = null;

        if (inputUrl) {
            inputUrl.addEventListener('input', () => {
                selectedFileBase64 = null;
                if (inputFile) inputFile.value = '';
            });
        }

        if (inputFile) {
            inputFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
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
                alert("Incolla prima un URL audio (es. mp3) oppure carica un file dal PC!");
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

        // Gestione Playlist
        let savedPlaylist = JSON.parse(localStorage.getItem('vtt_audio_playlist') || 'null');
        if (!savedPlaylist) savedPlaylist = [...AudioState.defaultPlaylist];

        function renderPlaylist() {
            const listContainer = document.getElementById('audio-playlist-list');
            if (!listContainer) return;
            listContainer.innerHTML = '';

            savedPlaylist.forEach((item, index) => {
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
                titleSpan.onclick = () => {
                    const loop = document.getElementById('bgm-loop-check').checked;
                    playBGM(item.src, item.title, loop);
                    const id = Date.now() + '_' + Math.random();
                    AudioState.handledEventIds.add(id);
                    AudioState.network.send({
                        type: 'AUDIO_BGM_PLAY',
                        payload: {
                            id: id,
                            src: item.src,
                            title: item.title,
                            loop: loop,
                            time: 0
                        }
                    });
                };

                const actions = document.createElement('div');
                actions.style.display = 'flex';
                actions.style.gap = '5px';

                const btnPlay = document.createElement('button');
                btnPlay.innerText = '▶';
                btnPlay.style.background = '#9c27b0';
                btnPlay.style.color = 'white';
                btnPlay.style.border = 'none';
                btnPlay.style.borderRadius = '3px';
                btnPlay.style.cursor = 'pointer';
                btnPlay.style.padding = '2px 6px';
                btnPlay.onclick = titleSpan.onclick;

                const btnDel = document.createElement('button');
                btnDel.innerText = '✕';
                btnDel.style.background = '#555';
                btnDel.style.color = 'white';
                btnDel.style.border = 'none';
                btnDel.style.borderRadius = '3px';
                btnDel.style.cursor = 'pointer';
                btnDel.style.padding = '2px 6px';
                btnDel.onclick = () => {
                    savedPlaylist.splice(index, 1);
                    try {
                        localStorage.setItem('vtt_audio_playlist', JSON.stringify(savedPlaylist));
                    } catch(e) {}
                    renderPlaylist();
                };

                actions.appendChild(btnPlay);
                actions.appendChild(btnDel);
                row.appendChild(titleSpan);
                row.appendChild(actions);
                listContainer.appendChild(row);
            });
        }
        renderPlaylist();

        document.getElementById('btn-bgm-save-playlist').addEventListener('click', () => {
            const title = inputTitle.value.trim() || 'Nuova Traccia';
            const src = (inputUrl && inputUrl.value.trim()) ? inputUrl.value.trim() : selectedFileBase64;
            if (!src) {
                alert("Inserisci un link audio o scegli un file prima di salvare in playlist!");
                return;
            }

            savedPlaylist.push({ id: 'bgm_' + Date.now(), title, src });
            try {
                localStorage.setItem('vtt_audio_playlist', JSON.stringify(savedPlaylist));
            } catch(err) {
                console.warn("Spazio localStorage limitato:", err);
                alert("Attenzione: i file audio caricati dal PC sono troppo grandi per essere memorizzati permanentemente nella cache del browser. Usa link diretti (.mp3/.ogg) per salvarli nella Playlist permanente!");
            }
            renderPlaylist();
            inputTitle.value = '';
            if (inputUrl) inputUrl.value = '';
            selectedFileBase64 = null;
            if (inputFile) inputFile.value = '';
        });

        // Gestione Soundboard Pads
        let savedPads = JSON.parse(localStorage.getItem('vtt_audio_sfx_pads') || 'null');
        if (!savedPads) savedPads = AudioState.defaultSfxPads;

        function renderSoundboardPads() {
            const grid = document.getElementById('audio-sfx-grid');
            if (!grid) return;
            grid.innerHTML = '';

            savedPads.forEach((pad, index) => {
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

                btn.onclick = () => {
                    playSFX(pad.synth, pad.src, pad.title);
                    const id = Date.now() + '_' + Math.random();
                    AudioState.handledEventIds.add(id);
                    AudioState.network.send({
                        type: 'AUDIO_SFX_PLAY',
                        payload: {
                            id: id,
                            synth: pad.synth,
                            src: pad.src,
                            title: pad.title
                        }
                    });
                };
                grid.appendChild(btn);
            });
        }
        renderSoundboardPads();

        const inputSfxTitle = document.getElementById('sfx-custom-title');
        const inputSfxUrl = document.getElementById('sfx-custom-url');
        const inputSfxFile = document.getElementById('sfx-custom-file');
        let selectedSfxBase64 = null;

        if (inputSfxFile) {
            inputSfxFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (!inputSfxTitle.value) inputSfxTitle.value = '🔊 ' + file.name.replace(/\.[^/.]+$/, "");
                    const reader = new FileReader();
                    reader.onload = (ev) => { selectedSfxBase64 = ev.target.result; };
                    reader.readAsDataURL(file);
                }
            });
        }

        document.getElementById('btn-sfx-add-pad').addEventListener('click', () => {
            const title = inputSfxTitle.value.trim() || '🔊 Effetto';
            const src = selectedSfxBase64 || inputSfxUrl.value.trim();
            if (!src) return;

            savedPads.push({ id: 'sfx_' + Date.now(), title, src });
            try {
                localStorage.setItem('vtt_audio_sfx_pads', JSON.stringify(savedPads));
            } catch(e) {}
            renderSoundboardPads();
            inputSfxTitle.value = '';
            inputSfxUrl.value = '';
            selectedSfxBase64 = null;
        });
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

        if (network && network.addListener) {
            network.addListener(handleIncomingAudio);
        }

        if (isDM) {
            initDMUI();
        } else {
            initPlayerUI();
        }
    };

    window.getAudioState = function() {
        const rawSrc = AudioState.bgmCurrent.src;
        const safeSrc = (rawSrc && rawSrc.startsWith('data:')) ? null : rawSrc;
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
