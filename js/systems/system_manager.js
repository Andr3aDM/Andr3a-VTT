// js/systems/system_manager.js
// Gestore Modulare Multi-Sistema GDR per Andr3a VTT
// Coordina i sistemi di gioco registrati (oggi 5e di default e 7th Sea 2ª Edizione) garantendo isolamento totale
// e retrocompatibilità al 100%.
//
// Fase B, passo B1 (16/11/2026): il gestore è pronto per N sistemi. Ogni modulo si registra con un adattatore:
//   { id, name, badge, optionLabel,
//     ui: { badge, badgeBg, badgeColor, badgeBorder, hideAc, hideTempHp,
//           statblockIcon, statblockLabel, statblockTitle, pcIcon, pcLabel, pcTitle, pcTitleNamed, pcWithoutSheet },
//     getSharedState() / applySharedState(dati) -> facoltativi: dati del sistema condivisi coi Giocatori in STATE_SYNC.sys,
//     matchesSheet(pcSheet) -> true se la scheda appartiene al sistema,
//     getSheetManager(), getCompendium() }
// Passo B3 (16/11/2026): niente piu' ripiego sul 5e. Se il modulo di un sistema non e' incluso in questa versione,
// la sua scheda non si apre (avviso) e mai al posto suo la scheda 5e (vedi docs/piano_moduli.md).

(function () {
    const systems = new Map();
    let activeSystemId = 'dnd5e';
    const listeners = [];

    // Valori dell'interfaccia quando un adattatore non li dichiara (identici a quelli storici del 5e)
    const DEFAULT_UI = {
        badge: '⚔️ 5e',
        badgeBg: '#1b3a4b',
        badgeColor: '#4dd0e1',
        badgeBorder: '#00acc1',
        hideAc: false,
        hideTempHp: false,
        // Nascondere il pulsante Scheda Mostro (sistemi senza schede degli avversari, es. NCS)
        hideStatblockButton: false,
        // Pannello token del Master: pulsanti Scheda Mostro / Scheda PG
        statblockIcon: '📜',
        statblockLabel: '📜 Mostro',
        statblockTitle: 'Cerca e assegna scheda statistiche mostro',
        pcIcon: '🧙',
        pcLabel: '🧙 Scheda PG',
        pcTitle: 'Apri o Importa Scheda Personaggio (PG)',
        pcTitleNamed: 'Apri Scheda PG: {name} (Liv. {level})',
        // Pannello token del Giocatore
        playerPcLabel: '🧙 Apri Scheda PG',
        playerPcTitle: 'Apri la Scheda del tuo Personaggio',
        playerStatblockLabel: '🐉 Scheda Creatura / Mostro',
        // Un token "personaggi" senza scheda puo' aprire la scheda PG col doppio clic?
        pcWithoutSheet: false
    };

    // Moduli conosciuti dal nucleo (anche quando non sono inclusi in questa versione): nome per l'avviso e
    // riconoscimento del campo pcSheet.system. Un modulo nuovo va aggiunto qui quando nasce.
    const KNOWN_NAMES = { dnd5e: '5ª Edizione (5e)', '7thsea': '7th Sea', ncs: 'Non Cedere al Sonno' };

    function warnMissing(id) {
        const msg = systemManager.missingModuleMessage(id);
        if (typeof window !== 'undefined' && typeof window.vttWarn === 'function') window.vttWarn(msg);
        else console.warn(msg);
    }

    // Gestore della scheda 5e (mai il router stesso)
    function dnd5eManager() {
        if (typeof window === 'undefined') return null;
        const m = window.dnd5eSheetManager || window._legacyPcSheetManager || null;
        return (m && !m._isSystemRouter) ? m : null;
    }

    // Gestore della scheda dichiarato dall'adattatore di un sistema (mai il router stesso)
    function adapterManager(id) {
        if (id === 'dnd5e') return dnd5eManager();
        const a = systems.get(id);
        if (!a || typeof a.getSheetManager !== 'function') return null;
        let m = null;
        try { m = a.getSheetManager(); } catch (e) { console.warn('getSheetManager error (' + id + '):', e); }
        return (m && !m._isSystemRouter) ? m : null;
    }

    // Tutti i gestori delle schede, senza doppioni: prima il 5e, poi gli altri nell'ordine di registrazione
    function allManagers() {
        const out = [];
        const add = (m) => { if (m && out.indexOf(m) < 0) out.push(m); };
        add(dnd5eManager());
        systemManager.listSystems().forEach(id => { if (id !== 'dnd5e') add(adapterManager(id)); });
        return out;
    }

    const systemManager = {
        registerSystem(id, adapter) {
            if (!id || !adapter) return;
            systems.set(id, adapter);
        },

        getSystem(id) {
            return systems.get(id) || systems.get('dnd5e') || null;
        },

        // Adattatore del sistema richiesto, SENZA ripiego sul 5e (null se il modulo non c'è)
        getAdapter(id) {
            return systems.get(id) || null;
        },

        // Id dei sistemi registrati: prima il 5e, poi gli altri nell'ordine di registrazione
        listSystems() {
            const ids = Array.from(systems.keys());
            const i = ids.indexOf('dnd5e');
            if (i > 0) { ids.splice(i, 1); ids.unshift('dnd5e'); }
            return ids;
        },

        isRegistered(id) {
            return !!id && systems.has(id);
        },

        isActiveSystemAvailable() {
            return systems.has(this.getActiveSystemId());
        },

        // Nome leggibile di un sistema, anche se il suo modulo non e' incluso
        displayName(id) {
            const a = systems.get(id);
            if (KNOWN_NAMES[id]) return KNOWN_NAMES[id];
            return (a && a.name) || String(id || '');
        },

        missingModuleMessage(id) {
            return `Questa versione del programma non include il modulo «${this.displayName(id)}».`;
        },

        // Impostazioni dell'interfaccia di un sistema (quelle dell'adattatore fuse con i valori predefiniti)
        ui(id) {
            const sysId = id || this.getActiveSystemId();
            const a = systems.get(sysId) || systems.get('dnd5e') || null;
            return Object.assign({}, DEFAULT_UI, (a && a.ui) || {});
        },

        getActiveSystemId() {
            return activeSystemId || 'dnd5e';
        },

        getActiveSystem() {
            return this.getSystem(this.getActiveSystemId());
        },

        setActiveSystem(id) {
            // B3: qualsiasi id e' accettato (anche di un modulo non incluso: allora nessuna scheda si apre); vuoto -> 5e.
            // Il Master non attiva mai una campagna di un modulo mancante (controllo in dm.js prima di aprirla).
            const normalized = (typeof id === 'string' && id) ? id : 'dnd5e';
            const changed = (activeSystemId !== normalized);
            activeSystemId = normalized;
            if (typeof window !== 'undefined') {
                window._activeGameSystem = activeSystemId;
            }
            // Aggiorna eventuale badge UI del sistema
            this.updateSystemUI();
            if (changed) {
                listeners.forEach(fn => {
                    try { fn(activeSystemId); } catch (e) { console.warn('System listener error:', e); }
                });
            }
            return activeSystemId;
        },

        onSystemChange(fn) {
            if (typeof fn === 'function') listeners.push(fn);
        },

        // Determina quale sistema usare per uno specifico token:
        // 1. Se il token ha già pcSheet.system di un sistema registrato o conosciuto (KNOWN_NAMES), usa quello, anche se
        //    il modulo non e' incluso (allora la scheda non si aprira'). Valori estranei vengono ignorati come prima.
        // 2. Altrimenti chiede a ogni sistema se riconosce la scheda (matchesSheet), provando il 5e per ULTIMO
        //    (7th Sea: traits + dramaticWounds; 5e: abilities.str)
        // 3. Regola storica, valida anche senza il modulo 7th Sea: Tratti + Ferite Drammatiche = 7th Sea
        //    (una vecchia scheda 7th Sea senza "system" non viene mai scambiata per una scheda 5e)
        // 4. Altrimenti usa il sistema attivo della campagna
        resolveTokenSystem(token) {
            if (token && token.pcSheet) {
                const ps = token.pcSheet;
                if (typeof ps.system === 'string' && ps.system && (systems.has(ps.system) || KNOWN_NAMES[ps.system])) return ps.system;
                const order = this.listSystems().filter(id => id !== 'dnd5e');
                if (systems.has('dnd5e')) order.push('dnd5e');
                for (const id of order) {
                    const a = systems.get(id);
                    if (a && typeof a.matchesSheet === 'function') {
                        try { if (a.matchesSheet(ps)) return id; } catch (e) { console.warn('matchesSheet error (' + id + '):', e); }
                    }
                }
                if (ps.traits && ps.dramaticWounds) return '7thsea';
            }
            return this.getActiveSystemId();
        },

        // Gestore della scheda del sistema del token; null se il suo modulo non e' incluso (MAI la scheda 5e al suo posto)
        getSheetManager(token = null) {
            const sysId = this.resolveTokenSystem(token);
            if (sysId === 'dnd5e') return dnd5eManager();
            return adapterManager(sysId);
        },

        updateSystemUI() {
            if (typeof document === 'undefined') return;
            const badge = document.getElementById('campaign-system-badge');
            const select = document.getElementById('campaign-system-select');
            if (select && select.value !== activeSystemId) {
                select.value = activeSystemId;
            }
            const u = this.ui(activeSystemId);
            if (badge) {
                badge.innerHTML = u.badge;
                badge.style.background = u.badgeBg;
                badge.style.color = u.badgeColor;
                badge.style.borderColor = u.badgeBorder;
            }
            const acBox = document.getElementById('token-ac-box');
            const tempHpBox = document.getElementById('token-temp-hp-box');
            if (acBox) acBox.style.display = u.hideAc ? 'none' : 'flex';
            if (tempHpBox) tempHpBox.style.display = u.hideTempHp ? 'none' : 'flex';

            if (typeof window !== 'undefined' && window.seventhSeaCompendium && typeof window.seventhSeaCompendium.syncCompendiumSystemUI === 'function') {
                window.seventhSeaCompendium.syncCompendiumSystemUI();
            }
        }
    };

    // Smart Router per window.pcSheetManager:
    // Intercetta le chiamate da dm.js, player.js e test automatici instradandole al sistema appropriato
    function installPcSheetRouter() {
        if (typeof window === 'undefined') return;
        if (window.pcSheetManager && !window.pcSheetManager._isSystemRouter) {
            window.dnd5eSheetManager = window.pcSheetManager;
            window._legacyPcSheetManager = window.pcSheetManager;
        }

        const router = {
            _isSystemRouter: true,

            open(token = null) {
                let target = token;
                if (!target && window.engine && Array.isArray(window.engine.tokens) && window.engine.selectedTokenId) {
                    target = window.engine.tokens.find(t => t.id === window.engine.selectedTokenId) || null;
                }
                const mgr = systemManager.getSheetManager(target);
                if (!mgr) {
                    // Modulo del sistema non incluso: avviso, nessuna scheda aperta (e mai quella 5e al suo posto)
                    warnMissing(systemManager.resolveTokenSystem(target));
                    return;
                }
                // Chiude le schede degli altri sistemi, poi apre quella giusta
                allManagers().forEach(m => {
                    if (m !== mgr && typeof m.close === 'function') m.close();
                });
                if (typeof mgr.open === 'function') {
                    return mgr.open(target);
                }
            },

            close() {
                allManagers().forEach(m => {
                    if (typeof m.close === 'function') m.close();
                });
            },

            refreshIfOpen(tokenId) {
                allManagers().forEach(m => {
                    if (typeof m.refreshIfOpen === 'function') m.refreshIfOpen(tokenId);
                });
            },

            commitSheetChanges(token, syncNetwork) {
                const mgr = systemManager.getSheetManager(token);
                if (mgr && typeof mgr.commitSheetChanges === 'function') {
                    return mgr.commitSheetChanges(token, syncNetwork);
                }
            },

            exportSingleCharacterJson(token) {
                const mgr = systemManager.getSheetManager(token);
                if (!mgr) { warnMissing(systemManager.resolveTokenSystem(token)); return; }
                if (typeof mgr.exportSingleCharacterJson === 'function') {
                    return mgr.exportSingleCharacterJson(token);
                }
                if (window.dnd5eSheetManager && typeof window.dnd5eSheetManager.exportSingleCharacterJson === 'function') {
                    return window.dnd5eSheetManager.exportSingleCharacterJson(token);
                }
            },

            importSingleCharacterJson(token) {
                const mgr = systemManager.getSheetManager(token);
                if (!mgr) { warnMissing(systemManager.resolveTokenSystem(token)); return; }
                if (typeof mgr.importSingleCharacterJson === 'function') {
                    return mgr.importSingleCharacterJson(token);
                }
                if (window.dnd5eSheetManager && typeof window.dnd5eSheetManager.importSingleCharacterJson === 'function') {
                    return window.dnd5eSheetManager.importSingleCharacterJson(token);
                }
            },

            // Meccaniche protette del 5e: restano legate alla scheda 5e
            parseCharacterSheetJSON(...args) {
                if (window.dnd5eSheetManager && typeof window.dnd5eSheetManager.parseCharacterSheetJSON === 'function') {
                    return window.dnd5eSheetManager.parseCharacterSheetJSON(...args);
                }
                return null;
            },

            extractCharacterId(...args) {
                if (window.dnd5eSheetManager && typeof window.dnd5eSheetManager.extractCharacterId === 'function') {
                    return window.dnd5eSheetManager.extractCharacterId(...args);
                }
                return '';
            }
        };

        window.pcSheetManager = router;
    }

    if (typeof window !== 'undefined') {
        window.systemManager = systemManager;
        installPcSheetRouter();
        window.installPcSheetRouter = installPcSheetRouter;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = systemManager;
    }
})();
