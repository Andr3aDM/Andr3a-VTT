// js/systems/system_manager.js
// Gestore Modulare Multi-Sistema GDR per Andr3a VTT
// Coordina D&D 5e (Default) e 7th Sea (2ª Edizione) garantendo isolamento totale e retrocompatibilità al 100%.

(function () {
    const systems = new Map();
    let activeSystemId = 'dnd5e';
    const listeners = [];

    const systemManager = {
        registerSystem(id, adapter) {
            if (!id || !adapter) return;
            systems.set(id, adapter);
        },

        getSystem(id) {
            return systems.get(id) || systems.get('dnd5e') || null;
        },

        getActiveSystemId() {
            return activeSystemId || 'dnd5e';
        },

        getActiveSystem() {
            return this.getSystem(this.getActiveSystemId());
        },

        setActiveSystem(id) {
            const normalized = (id === '7thsea') ? '7thsea' : 'dnd5e';
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
        // 1. Se il token ha già pcSheet.system === '7thsea', usa 7thsea
        // 2. Se il token ha già pcSheet con struttura D&D 5e (abilities.str, ecc.) e non system='7thsea', usa dnd5e
        // 3. Altrimenti usa il sistema attivo della campagna
        resolveTokenSystem(token) {
            if (token && token.pcSheet) {
                if (token.pcSheet.system === '7thsea') return '7thsea';
                if (token.pcSheet.system === 'dnd5e') return 'dnd5e';
                if (token.pcSheet.traits && token.pcSheet.dramaticWounds) return '7thsea';
                if (token.pcSheet.abilities && token.pcSheet.abilities.str) return 'dnd5e';
            }
            return this.getActiveSystemId();
        },

        getSheetManager(token = null) {
            const sysId = this.resolveTokenSystem(token);
            if (sysId === '7thsea' && window.seventhSeaSheetManager) {
                return window.seventhSeaSheetManager;
            }
            return window.dnd5eSheetManager || window._legacyPcSheetManager || null;
        },

        updateSystemUI() {
            if (typeof document === 'undefined') return;
            const badge = document.getElementById('campaign-system-badge');
            const select = document.getElementById('campaign-system-select');
            if (select && select.value !== activeSystemId) {
                select.value = activeSystemId;
            }
            if (badge) {
                if (activeSystemId === '7thsea') {
                    badge.innerHTML = '⛵ 7th Sea (2ª Ed.)';
                    badge.style.background = '#3e2723';
                    badge.style.color = '#ffd54f';
                    badge.style.borderColor = '#d4af37';
                } else {
                    badge.innerHTML = '⚔️ D&D 5e';
                    badge.style.background = '#1b3a4b';
                    badge.style.color = '#4dd0e1';
                    badge.style.borderColor = '#00acc1';
                }
            }
            const is7th = (activeSystemId === '7thsea');
            const acBox = document.getElementById('token-ac-box');
            const tempHpBox = document.getElementById('token-temp-hp-box');
            if (acBox) acBox.style.display = is7th ? 'none' : 'flex';
            if (tempHpBox) tempHpBox.style.display = is7th ? 'none' : 'flex';

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
                const sysId = systemManager.resolveTokenSystem(target);
                if (sysId === '7thsea' && window.seventhSeaSheetManager) {
                    if (window.dnd5eSheetManager && typeof window.dnd5eSheetManager.close === 'function') {
                        window.dnd5eSheetManager.close();
                    }
                    return window.seventhSeaSheetManager.open(target);
                }
                if (window.seventhSeaSheetManager && typeof window.seventhSeaSheetManager.close === 'function') {
                    window.seventhSeaSheetManager.close();
                }
                if (window.dnd5eSheetManager) {
                    return window.dnd5eSheetManager.open(target);
                }
            },

            close() {
                if (window.dnd5eSheetManager && typeof window.dnd5eSheetManager.close === 'function') {
                    window.dnd5eSheetManager.close();
                }
                if (window.seventhSeaSheetManager && typeof window.seventhSeaSheetManager.close === 'function') {
                    window.seventhSeaSheetManager.close();
                }
            },

            refreshIfOpen(tokenId) {
                if (window.dnd5eSheetManager && typeof window.dnd5eSheetManager.refreshIfOpen === 'function') {
                    window.dnd5eSheetManager.refreshIfOpen(tokenId);
                }
                if (window.seventhSeaSheetManager && typeof window.seventhSeaSheetManager.refreshIfOpen === 'function') {
                    window.seventhSeaSheetManager.refreshIfOpen(tokenId);
                }
            },

            commitSheetChanges(token, syncNetwork) {
                const mgr = systemManager.getSheetManager(token);
                if (mgr && typeof mgr.commitSheetChanges === 'function') {
                    return mgr.commitSheetChanges(token, syncNetwork);
                }
            },

            exportSingleCharacterJson(token) {
                const mgr = systemManager.getSheetManager(token);
                if (mgr && typeof mgr.exportSingleCharacterJson === 'function') {
                    return mgr.exportSingleCharacterJson(token);
                }
                if (window.dnd5eSheetManager && typeof window.dnd5eSheetManager.exportSingleCharacterJson === 'function') {
                    return window.dnd5eSheetManager.exportSingleCharacterJson(token);
                }
            },

            importSingleCharacterJson(token) {
                const mgr = systemManager.getSheetManager(token);
                if (mgr && typeof mgr.importSingleCharacterJson === 'function') {
                    return mgr.importSingleCharacterJson(token);
                }
                if (window.dnd5eSheetManager && typeof window.dnd5eSheetManager.importSingleCharacterJson === 'function') {
                    return window.dnd5eSheetManager.importSingleCharacterJson(token);
                }
            },

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
