// js/systems/7thsea/compendium.js
// Modulo Compendio & Costruttore Antagonisti Nativo 7th Sea (2ª Edizione - Need Games):
// - Zero contaminazione D&D 5e (niente CA, Iniziativa, Velocità o STR/DEX/CON/INT/WIS/CHA)
// - Squadre di Sgherri (Brute Squads) dove Forza = Punti Vita del Token (1 Incremento = -1 Forza)
// - Malvagi (Villains) con Forza, Influenza, Grado di Malvagità e Ferite Drammatiche
// - Mostri di Théah e Costrutti Syrneth con Qualità Mostruose
// - Creazione e Modifica 100% Personalizzata + Calcolatore di Rischio con Abbinamenti in Verde integrato!

(function () {
    const customAntagonists = [];

    const OFFICIAL_PRESET_ABILITIES = {
        '': { traits: '', ability: '' },
        'pirati': {
            traits: 'Rissa, Navigazione, Intimidire, Abbordaggio',
            ability: 'Abbordaggio Selvaggio: A fine round infligge Ferite pari alla sua Forza attuale. Spendendo 1 Opportunità può disarmare o spingere a terra un Eroe.'
        },
        'guardie': {
            traits: 'Mischia, Guerra, Notare, Disciplina',
            ability: 'Falange Disciplinata: Protegge un PNG o un punto strategico. Un Eroe deve spendere 1 Incremento extra per superare lo sbarramento della squadra.'
        },
        'assassini': {
            traits: 'Nascondersi, Mira, Mischia, Pugnali',
            ability: 'Colpo nell\'Ombra & Veleno: Se infliggono almeno 3 Ferite a un Eroe in un singolo round, il veleno fa perdere all\'Eroe 1 Incremento nel round successivo.'
        },
        'tiratori': {
            traits: 'Mira, Guerra, Notare, Moschetti',
            ability: 'Fuoco di Fila: Attaccano a distanza da dietro copertura. Riducono di 1 il primo attacco in mischia subito in ogni round.'
        },
        'duellanti': {
            traits: 'Mischia, Atletica, Panache, Scherma',
            ability: 'Lame Incrociate: Una volta per round, la Squadra di Duellanti può parare riducendo di 1 la perdita di Forza causata da un attacco.'
        },
        'bruti': {
            traits: 'Rissa, Intimidire, Atletica',
            ability: 'Accerchiamento Brutale: Infliggono +1 Ferita aggiuntiva se gli Eroi nella scena sono in inferiorità numerica.'
        },
        'malvagio_duellante': {
            traits: 'Vigore 4, Grazia 5, Risolutezza 4, Acume 3, Panache 4 • Scuola di Scherma (Maestro)',
            ability: 'Maestro della Gilda: Può eseguire tutte le 6 Manovre Base del Duello (Fendente, Parata, Finta, Affondo, Botta, Risposta) e spende 1 Punto Pericolo per aggiungere +2d10 a un Rischio Marziale.'
        },
        'malvagio_stregone': {
            traits: 'Vigore 3, Grazia 4, Risolutezza 5, Acume 5, Panache 4 • Retaggio Stregonesco',
            ability: 'Signore dell\'Occulto: Spende 1 Punto Pericolo per attivare un potere di Stregoneria maggiore o costringere tutti gli Eroi a spendere 1 Incremento per resistere.'
        },
        'mostro_paura': {
            traits: 'Qualità Mostruose: Paura Primordiale (Grado 3), Artigli Laceranti',
            ability: 'Paura (Grado 3): All\'inizio della scena gli Eroi devono spendere 3 Incrementi per non restare Pietrificati dal Terrore. Artigli: +2 Ferite ad ogni attacco.'
        },
        'mostro_corazza': {
            traits: 'Qualità Mostruose: Pelle Corazzata, Forza Colossale',
            ability: 'Pelle Corazzata: Ogni volta che il Mostro subisce Ferite da un Eroe, riduce le Ferite subite di 2 (minimo 0), a meno che l\'Eroe non colpisca un punto debole scoperto.'
        },
        'mostro_rigenerazione': {
            traits: 'Qualità Mostruose: Rigenerazione Infernale, Sangue Acido',
            ability: 'Rigenerazione: All\'inizio di ogni round, il Mostro guarisce automaticamente 2 Ferite normali, salvo danni da fuoco o ferro freddo.'
        },
        'mostro_tentacoli': {
            traits: 'Qualità Mostruose: Tentacoli Colossali, Abitante degli Abissi',
            ability: 'Tentacoli Colossali: Con 1 solo Incremento può afferrare e immobilizzare fino a due Eroi contemporaneamente; liberarsi richiede 2 Incrementi.'
        }
    };

    let s7CatalogUnlocked = false;

    // Token in mappa la cui scheda è quella aperta (stesso oggetto o token target selezionato), preferendo quello selezionato all'apertura
    function findTokenOfStatblock(m) {
        const eng = (typeof engine !== 'undefined') ? engine : ((typeof window !== 'undefined' && window.engine) ? window.engine : null);
        if (!eng || !Array.isArray(eng.tokens) || !m) return null;
        const comp = window.compendium;
        const hasExplicitTarget = comp && comp._activeTargetTokenId !== undefined;
        const activeId = hasExplicitTarget ? comp._activeTargetTokenId : (eng.selectedTokenId || null);
        const direct = (activeId && eng.tokens.find(t => t.id === activeId && t.statblock === m))
            || eng.tokens.find(t => t.statblock === m)
            || null;
        if (direct) return direct;
        // Fallback: token selezionato a cui è appena stato assegnato/creato un clone dello stesso statblock
        if (activeId && !s7CatalogUnlocked) {
            const selTok = eng.tokens.find(t => t.id === activeId);
            if (selTok && selTok.statblock) {
                const sameId = !!(m.id && selTok.statblock.id && String(selTok.statblock.id) === String(m.id));
                const sameName = !!(m.name && selTok.statblock.name && String(selTok.statblock.name) === String(m.name));
                if (sameId || sameName) {
                    return selTok;
                }
            }
        }
        return null;
    }

    function applyS7TokenLockMode(isLockedToToken) {
        if (typeof document === 'undefined') return;
        const isS7Active = !!(window.systemManager && typeof window.systemManager.getActiveSystemId === 'function' && window.systemManager.getActiveSystemId() === '7thsea');
        const s7Bar = document.getElementById('s7-compendium-bar');
        const searchBox = s7Bar ? s7Bar.parentElement : null;
        const assignBtn = document.getElementById('btn-assign-statblock');
        const btnRow = assignBtn ? assignBtn.parentElement : null;
        const spawnCat = document.getElementById('statblock-spawn-category');
        const spawnOptsGroup = (spawnCat && spawnCat.parentElement) ? spawnCat.parentElement.parentElement : null;

        if (!isS7Active) {
            if (searchBox) searchBox.style.display = '';
            if (btnRow) btnRow.style.display = 'flex';
            if (spawnOptsGroup) spawnOptsGroup.style.display = 'flex';
            return;
        }

        if (isLockedToToken) {
            if (s7Bar) s7Bar.style.display = 'none';
            if (searchBox) searchBox.style.display = 'none';
            if (btnRow) btnRow.style.display = 'none';
            if (spawnOptsGroup) spawnOptsGroup.style.display = 'none';
        } else {
            if (searchBox) searchBox.style.display = '';
            if (s7Bar) s7Bar.style.display = 'flex';
            if (btnRow) btnRow.style.display = 'flex';
            if (spawnOptsGroup) spawnOptsGroup.style.display = 'flex';
        }
    }

    function syncBruteStrengthToToken(m, newStr) {
        const eng = (typeof engine !== 'undefined') ? engine : ((typeof window !== 'undefined' && window.engine) ? window.engine : null);
        if (!eng || !eng.isDM) return;
        const tok = findTokenOfStatblock(m);
        if (!tok) return; // scheda aperta dal compendio senza token: cambia solo la scheda
        if (tok.statblock && tok.statblock !== m) {
            tok.statblock.s7Strength = newStr;
            tok.statblock.hit_points = newStr;
            tok.statblock.s7VillainyRank = newStr;
            tok.statblock.challenge_rating = `Forza ${newStr}`;
        }
        tok.hpCurrent = newStr;
        if (!(Number(tok.hpMax) >= newStr)) tok.hpMax = newStr;
        if (eng.initiative && Array.isArray(eng.initiative.participants)) {
            eng.initiative.participants.forEach(p => { if (String(p.tokenId) === String(tok.id)) { p.hpCurrent = tok.hpCurrent; p.hpMax = tok.hpMax; } });
        }
        try { if (typeof window.upsertTokenInCampaign === 'function') window.upsertTokenInCampaign(tok); } catch (e) {}
        try { if (typeof renderTrackerList === 'function') renderTrackerList({ skipRenderAndSync: true }); } catch (e) {}
        try { if (eng.selectedTokenId === tok.id && typeof window.updateSelectedTokenControls === 'function') window.updateSelectedTokenControls(tok); } catch (e) {}
        try { eng.renderTokensLayer(); } catch (e) {}
        try { if (typeof window.syncState === 'function') window.syncState(true); } catch (e) {}
    }

    function syncAntagonistHpToToken(m, newHp) {
        const eng = (typeof engine !== 'undefined') ? engine : ((typeof window !== 'undefined' && window.engine) ? window.engine : null);
        if (!eng || !eng.isDM) return;
        const tok = findTokenOfStatblock(m);
        if (!tok) return;
        if (tok.statblock && tok.statblock !== m) {
            tok.statblock.hit_points = newHp;
        }
        tok.hpCurrent = newHp;
        if (!(Number(tok.hpMax) >= newHp)) tok.hpMax = Math.max(1, newHp);
        if (eng.initiative && Array.isArray(eng.initiative.participants)) {
            eng.initiative.participants.forEach(p => { if (String(p.tokenId) === String(tok.id)) { p.hpCurrent = tok.hpCurrent; p.hpMax = tok.hpMax; } });
        }
        try { if (typeof window.upsertTokenInCampaign === 'function') window.upsertTokenInCampaign(tok); } catch (e) {}
        try { if (typeof renderTrackerList === 'function') renderTrackerList({ skipRenderAndSync: true }); } catch (e) {}
        try { if (eng.selectedTokenId === tok.id && typeof window.updateSelectedTokenControls === 'function') window.updateSelectedTokenControls(tok); } catch (e) {}
        try { eng.renderTokensLayer(); } catch (e) {}
        try { if (typeof window.syncState === 'function') window.syncState(true); } catch (e) {}
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/[&<>'"]/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[c]));
    }

    let _heroesLoadPromise = null;
    let _villainsLoadPromise = null;

    function cleanS7TokenName(rawName) {
        const s = String(rawName || '').trim();
        if (!s) return '';
        return s.replace(/\s*\((?:Squadra\s+Sgherri|Squadra\s+di\s+Sgherri|Brute\s+Squad|Malvagio|Villain)\)\s*$/i, '').trim() || s;
    }

    function ensureHeroesLoaded() {
        if (typeof window === 'undefined') return Promise.resolve({});
        if (window.SEVENTH_SEA_HEROES_BY_ID) return Promise.resolve(window.SEVENTH_SEA_HEROES_BY_ID);
        if (_heroesLoadPromise) return _heroesLoadPromise;
        if (typeof document === 'undefined') return Promise.resolve({});

        _heroesLoadPromise = new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'js/systems/7thsea/heroes_data.js?v=1';
            script.async = true;
            script.onload = () => resolve(window.SEVENTH_SEA_HEROES_BY_ID || {});
            script.onerror = () => {
                _heroesLoadPromise = null;
                console.warn('[7thSea Compendium] Impossibile caricare js/systems/7thsea/heroes_data.js');
                resolve({});
            };
            (document.head || document.body || document.documentElement).appendChild(script);
        });
        return _heroesLoadPromise;
    }

    function ensureVillainsLoaded() {
        if (typeof window === 'undefined') return Promise.resolve({});
        if (window.SEVENTH_SEA_VILLAINS_BY_ID) return Promise.resolve(window.SEVENTH_SEA_VILLAINS_BY_ID);
        if (_villainsLoadPromise) return _villainsLoadPromise;
        if (typeof document === 'undefined') return Promise.resolve({});

        _villainsLoadPromise = new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'js/systems/7thsea/villains_data.js?v=1';
            script.async = true;
            script.onload = () => resolve(window.SEVENTH_SEA_VILLAINS_BY_ID || {});
            script.onerror = () => {
                _villainsLoadPromise = null;
                console.warn('[7thSea Compendium] Impossibile caricare js/systems/7thsea/villains_data.js');
                resolve({});
            };
            (document.head || document.body || document.documentElement).appendChild(script);
        });
        return _villainsLoadPromise;
    }

    function resolveFullAntagonist(ant) {
        if (!ant) return ant;
        if (ant._lazyHero) {
            const map = (typeof window !== 'undefined') ? window.SEVENTH_SEA_HEROES_BY_ID : null;
            if (map && map[ant.id]) {
                return Object.assign({}, ant, map[ant.id], { _lazyHero: false });
            }
        }
        if (ant._lazyVillain) {
            const map = (typeof window !== 'undefined') ? window.SEVENTH_SEA_VILLAINS_BY_ID : null;
            if (map && map[ant.id]) {
                return Object.assign({}, ant, map[ant.id], { _lazyVillain: false });
            }
        }
        return ant;
    }

    async function loadHeroDetail(id) {
        if (!id) return null;
        await ensureHeroesLoaded();
        const found = getAllAntagonists().find(a => a.id === id);
        return found ? resolveFullAntagonist(found) : null;
    }

    async function loadVillainDetail(id) {
        if (!id) return null;
        await ensureVillainsLoaded();
        const found = getAllAntagonists().find(a => a.id === id);
        return found ? resolveFullAntagonist(found) : null;
    }

    function getAllAntagonists() {
        const base = (window.SEVENTH_SEA_DATA && Array.isArray(window.SEVENTH_SEA_DATA.antagonists))
            ? window.SEVENTH_SEA_DATA.antagonists
            : [];
        return [...customAntagonists, ...base];
    }

    function convertAntagonistToStatblock(ant) {
        if (!ant) return null;
        ant = resolveFullAntagonist(ant);
        const category = ant.category || (ant.type && ant.type.toLowerCase().includes('malvagio') ? 'villain' : (ant.type && ant.type.toLowerCase().includes('mostro') ? 'monster' : (ant.type && (ant.type.toLowerCase().includes('png') || ant.type.toLowerCase().includes('alleato') || ant.type.toLowerCase().includes('eroe')) ? 'npc' : 'brute')));
        const isBrute = category === 'brute' || (ant.type && ant.type.toLowerCase().includes('sgherri'));
        const isVillain = category === 'villain';
        const isNpc = category === 'npc' || category === 'hero';
        const strength = Math.max(1, parseInt(ant.strength || ant.s7Strength) || 6);
        const influence = Math.max(0, parseInt(ant.influence !== undefined ? ant.influence : ant.s7Influence) || 0);
        const villainyRank = parseInt(ant.villainyRank) || (strength + influence);
        const hpVal = parseInt(ant.hp || ant.hit_points) || (isBrute ? strength : 20);
        const typeLabel = ant.type || (isVillain ? 'Malvagio (Villain)' : (category === 'monster' ? 'Mostro di Théah' : (isNpc ? 'PNG / Eroe Alleato' : 'Squadra di Sgherri (Brute Squad)')));
        const nation = ant.nation || ant.s7Nation || 'Théah';
        const traits = ant.traits || ant.s7Traits || 'Mischia, Intimidire, Atletica';
        const ability = ant.ability || ant.s7Ability || 'Agisce a fine round infliggendo Ferite pari alla propria Forza.';
        const notes = ant.notes || ant.s7Notes || '';

        return {
            id: ant.id || ('s7_custom_' + Date.now()),
            name: ant.name || 'Antagonista di Théah',
            size: ant.size || 'Media',
            type: typeLabel,
            alignment: `${nation} (7th Sea 2e)`,
            armor_class: 10,
            hit_points: hpVal,
            hit_dice: `Forza ${strength}`,
            challenge_rating: `Forza ${strength}`,
            system: '7thsea',
            s7Category: category,
            s7Nation: nation,
            s7Strength: strength,
            s7Influence: influence,
            s7VillainyRank: villainyRank,
            s7Traits: traits,
            s7Ability: ability,
            s7Notes: notes,
            pcData: ant.pcData || undefined,
            tokenSrc: ant.tokenSrc || undefined,
            special_abilities: [
                {
                    name: isBrute ? `Squadra di Sgherri (Forza ${strength})` : (isNpc ? `PNG / Eroe Alleato (Tratto/Forza ${strength})` : `Antagonista Maggiore (Forza ${strength}${influence ? `, Influenza ${influence}` : ''})`),
                    desc: isBrute
                        ? `Forza ${strength} (= ${hpVal} PV sul token). A fine round infligge ${strength} Ferite agli Eroi se non ostacolata. Ogni Incremento speso da un Eroe riduce la Forza (PV) di 1.`
                        : (isNpc
                            ? `PNG / Eroe Alleato di Théah. Lancia ${strength}d10 nei Rischi e possiede 20 Punti Ferita / Ferite Drammatiche.`
                            : `Lancia ${villainyRank}d10 nei Rischi (${strength} Forza${influence ? ` + ${influence} Influenza` : ''}). Possiede 4 Soglie di Ferita Drammatica (${hpVal} Ferite totali).`)
                },
                {
                    name: 'Competenze & Descrittori',
                    desc: traits
                }
            ],
            actions: [
                {
                    name: 'Capacità Speciale di Scena',
                    desc: ability
                }
            ]
        };
    }

    // Sincronizza l'interfaccia di #dm-statblock-window in base al sistema attivo (7th Sea vs D&D 5e)
    function syncCompendiumSystemUI(statblock = null) {
        if (typeof document === 'undefined') return;
        const win = document.getElementById('dm-statblock-window');
        if (!win) return;

        injectS7AntagonistBar();

        const isS7Active = (window.systemManager && window.systemManager.getActiveSystemId() === '7thsea') ||
                           (statblock && statblock.system === '7thsea');

        const dndSearchInput = document.getElementById('statblock-search-input');
        const dndSearchRow = dndSearchInput ? dndSearchInput.parentElement : null;
        const s7Bar = document.getElementById('s7-compendium-bar');
        const translateBtn = document.getElementById('btn-translate-statblock');
        const jsonImportBtn = document.getElementById('btn-statblock-json-import');
        const headerStrong = document.querySelector('#dm-statblock-header strong');

        if (isS7Active) {
            s7CatalogUnlocked = false;
            if (dndSearchRow) dndSearchRow.style.display = 'none';
            applyS7TokenLockMode(false);
            if (translateBtn) translateBtn.style.display = 'none';
            if (jsonImportBtn) jsonImportBtn.style.display = 'none';
            if (headerStrong) {
                headerStrong.innerHTML = '<span>⚓</span> <span style="color:#fcd34d;">Compendio & Scheda Antagonista (7th Sea)</span>';
            }
            win.style.borderColor = '#d4af37';
            const headerBar = document.getElementById('dm-statblock-header');
            if (headerBar) {
                headerBar.style.background = '#1e1912';
                headerBar.style.borderBottomColor = '#d4af37';
            }
        } else {
            s7CatalogUnlocked = false;
            activeS7RenderedEntry = null;
            applyS7TokenLockMode(false);
            if (dndSearchRow) dndSearchRow.style.display = 'flex';
            if (s7Bar) s7Bar.style.display = 'none';
            if (translateBtn) translateBtn.style.display = 'flex';
            if (jsonImportBtn) jsonImportBtn.style.display = 'inline-block';
            if (headerStrong) {
                headerStrong.innerHTML = '<span>📜</span> <span>Compendio & Scheda Mostro</span>';
            }
            win.style.borderColor = '#b71c1c';
            const headerBar = document.getElementById('dm-statblock-header');
            if (headerBar) {
                headerBar.style.background = '#2a1b1b';
                headerBar.style.borderBottomColor = '#b71c1c';
            }
        }
    }

    function getActiveSelectedAntagonistId() {
        const brutesSel = document.getElementById('s7-select-brutes');
        const villainsSel = document.getElementById('s7-select-villains');
        const monstersSel = document.getElementById('s7-select-monsters');
        const npcsSel = document.getElementById('s7-select-npcs');
        const masterSel = document.getElementById('s7-antagonist-select');

        if (brutesSel && brutesSel.value) return brutesSel.value;
        if (villainsSel && villainsSel.value) return villainsSel.value;
        if (monstersSel && monstersSel.value) return monstersSel.value;
        if (npcsSel && npcsSel.value) return npcsSel.value;
        if (masterSel && masterSel.value) return masterSel.value;
        return '';
    }

    function syncSelectorsWithActive(id) {
        const brutesSel = document.getElementById('s7-select-brutes');
        const villainsSel = document.getElementById('s7-select-villains');
        const monstersSel = document.getElementById('s7-select-monsters');
        const npcsSel = document.getElementById('s7-select-npcs');
        const masterSel = document.getElementById('s7-antagonist-select');

        if (masterSel && id) masterSel.value = id;

        const all = getAllAntagonists();
        const found = all.find(a => a.id === id || a.name === id);
        if (!found) {
            if (brutesSel) { brutesSel.value = ''; brutesSel.style.boxShadow = 'none'; }
            if (villainsSel) { villainsSel.value = ''; villainsSel.style.boxShadow = 'none'; }
            if (monstersSel) { monstersSel.value = ''; monstersSel.style.boxShadow = 'none'; }
            if (npcsSel) { npcsSel.value = ''; npcsSel.style.boxShadow = 'none'; }
            return;
        }

        const cat = found.category || ((found.type || '').toLowerCase().includes('sgherri') ? 'brute' : ((found.type || '').toLowerCase().includes('malvagio') ? 'villain' : ((found.type || '').toLowerCase().includes('mostro') ? 'monster' : 'npc')));

        if (brutesSel) {
            brutesSel.value = (cat === 'brute') ? found.id : '';
            brutesSel.style.boxShadow = (cat === 'brute') ? '0 0 6px rgba(245, 158, 11, 0.5)' : 'none';
        }
        if (villainsSel) {
            villainsSel.value = (cat === 'villain') ? found.id : '';
            villainsSel.style.boxShadow = (cat === 'villain') ? '0 0 6px rgba(168, 85, 247, 0.5)' : 'none';
        }
        if (monstersSel) {
            monstersSel.value = (cat === 'monster') ? found.id : '';
            monstersSel.style.boxShadow = (cat === 'monster') ? '0 0 6px rgba(239, 68, 68, 0.5)' : 'none';
        }
        if (npcsSel) {
            npcsSel.value = (cat === 'npc' || cat === 'hero') ? found.id : '';
            npcsSel.style.boxShadow = (cat === 'npc' || cat === 'hero') ? '0 0 6px rgba(56, 189, 248, 0.5)' : 'none';
        }
    }

    function refreshAntagonistSelectOptions(selectedId = '') {
        const brutesSel = document.getElementById('s7-select-brutes');
        const villainsSel = document.getElementById('s7-select-villains');
        const monstersSel = document.getElementById('s7-select-monsters');
        const npcsSel = document.getElementById('s7-select-npcs');
        const masterSel = document.getElementById('s7-antagonist-select');

        const all = getAllAntagonists();
        const brutes = all.filter(a => a.category === 'brute' || (a.type || '').toLowerCase().includes('sgherri'));
        const villains = all.filter(a => a.category === 'villain' || (a.type || '').toLowerCase().includes('malvagio'));
        const monsters = all.filter(a => a.category === 'monster' || (a.type || '').toLowerCase().includes('mostro'));
        const npcs = all.filter(a => a.category === 'npc' || a.category === 'hero' || (a.type || '').toLowerCase().includes('png') || (a.type || '').toLowerCase().includes('alleato') || (a.type || '').toLowerCase().includes('eroe'));

        // Aggiorna contatori visivi nelle etichette
        const countBrutes = document.getElementById('s7-count-brutes');
        const countVillains = document.getElementById('s7-count-villains');
        const countMonsters = document.getElementById('s7-count-monsters');
        const countNpcs = document.getElementById('s7-count-npcs');
        if (countBrutes) countBrutes.textContent = `(${brutes.length})`;
        if (countVillains) countVillains.textContent = `(${villains.length})`;
        if (countMonsters) countMonsters.textContent = `(${monsters.length})`;
        if (countNpcs) countNpcs.textContent = `(${npcs.length})`;

        // 1. SELETTORE SQUADRE DI SGHERRI
        if (brutesSel) {
            let h = `<option value="">-- ⚔️ Scegli Sgherro (${brutes.length}) --</option>`;
            brutes.forEach(a => {
                const str = a.strength || a.s7Strength || 6;
                h += `<option value="${escapeHtml(a.id)}">⚔️ ${escapeHtml(a.name)} [Forza ${str}]</option>`;
            });
            brutesSel.innerHTML = h;
        }

        // 2. SELETTORE MALVAGI UFFICIALI DI THÉAH (Suddivisi per Archetipo)
        if (villainsSel) {
            let h = `<option value="">-- 👑 Scegli Malvagio (${villains.length}) --</option>`;
            const archetypes = [
                { key: 'Malvagi Belva', label: '🐆 Malvagi Belva' },
                { key: 'Malvagi Camaleontici', label: '🦎 Malvagi Camaleontici' },
                { key: 'Geni del Male', label: '🧠 Geni del Male' },
                { key: 'Furie Inarrestabili', label: '⚡ Furie Inarrestabili' },
                { key: 'Malvagi Folli', label: '🎭 Malvagi Folli' }
            ];

            const accounted = new Set();
            archetypes.forEach(arch => {
                const grp = villains.filter(v => (v.archetype === arch.key || (v.type || '').includes(arch.key)));
                if (grp.length > 0) {
                    h += `<optgroup label="${arch.label} (${grp.length})">`;
                    grp.forEach(a => {
                        accounted.add(a.id);
                        const rank = a.villainyRank || ((a.strength || a.s7Strength || 6) + (a.influence || a.s7Influence || 0));
                        const natStr = a.nation ? `${a.nation} • ` : '';
                        h += `<option value="${escapeHtml(a.id)}">👑 ${escapeHtml(a.name)} [${escapeHtml(natStr)}Grado ${rank}]</option>`;
                    });
                    h += '</optgroup>';
                }
            });

            const others = villains.filter(v => !accounted.has(v.id));
            if (others.length > 0) {
                h += `<optgroup label="👑 Altri Malvagi di Théah (${others.length})">`;
                others.forEach(a => {
                    const rank = a.villainyRank || ((a.strength || a.s7Strength || 6) + (a.influence || a.s7Influence || 0));
                    const natStr = a.nation ? `${a.nation} • ` : '';
                    h += `<option value="${escapeHtml(a.id)}">👑 ${escapeHtml(a.name)} [${escapeHtml(natStr)}Grado ${rank}]</option>`;
                });
                h += '</optgroup>';
            }
            villainsSel.innerHTML = h;
        }

        // 3. SELETTORE MOSTRI DI THÉAH & SYRNETH
        if (monstersSel) {
            let h = `<option value="">-- 🐙 Scegli Mostro (${monsters.length}) --</option>`;
            monsters.forEach(a => {
                const str = a.strength || a.s7Strength || 12;
                const icon = (a.id || '').includes('syrneth') ? '⚙️' : ((a.id || '').includes('ragno') ? '🕷️' : '🐙');
                h += `<option value="${escapeHtml(a.id)}">${icon} ${escapeHtml(a.name)} [Forza ${str}]</option>`;
            });
            monstersSel.innerHTML = h;
        }

        // 4. SELETTORE PNG & EROI ALLEATI (Pronto per Fase 2)
        if (npcsSel) {
            let h = `<option value="">-- 👥 Scegli PNG Alleato (${npcs.length}) --</option>`;
            if (npcs.length === 0) {
                h += `<option value="" disabled style="color:#6b7280; font-style:italic;">-- Nessun PNG caricato (In arrivo Fase 2) --</option>`;
            } else {
                const byNat = {};
                npcs.forEach(n => {
                    const nat = n.nation || n.s7Nation || 'Théah';
                    if (!byNat[nat]) byNat[nat] = [];
                    byNat[nat].push(n);
                });
                Object.keys(byNat).sort().forEach(nat => {
                    h += `<optgroup label="🏛️ ${escapeHtml(nat)} (${byNat[nat].length})">`;
                    byNat[nat].forEach(a => {
                        const archShort = (a.archetype || a.role || a.concept || 'Alleato').replace('Eroi ', '');
                        h += `<option value="${escapeHtml(a.id)}">👥 ${escapeHtml(a.name)} [${escapeHtml(archShort)}]</option>`;
                    });
                    h += '</optgroup>';
                });
            }
            npcsSel.innerHTML = h;
        }

        // 5. MASTER HIDDEN SELECT (Indice unico per retrocompatibilità e test automatici)
        if (masterSel) {
            let h = '<option value="">-- Tutti gli Antagonisti di Théah --</option>';
            if (brutes.length > 0) {
                h += '<optgroup label="⚔️ Squadre di Sgherri">';
                brutes.forEach(a => {
                    h += `<option value="${escapeHtml(a.id)}">⚔️ ${escapeHtml(a.name)} [Forza ${a.strength || a.s7Strength || 6}]</option>`;
                });
                h += '</optgroup>';
            }
            if (villains.length > 0) {
                h += '<optgroup label="👑 Malvagi Ufficiali di Théah">';
                villains.forEach(a => {
                    const rank = a.villainyRank || ((a.strength || a.s7Strength || 6) + (a.influence || a.s7Influence || 0));
                    const natStr = a.nation ? `${a.nation} • ` : '';
                    h += `<option value="${escapeHtml(a.id)}">👑 ${escapeHtml(a.name)} [${escapeHtml(natStr)}Grado ${rank}]</option>`;
                });
                h += '</optgroup>';
            }
            if (monsters.length > 0) {
                h += '<optgroup label="🐙 Mostri & Syrneth">';
                monsters.forEach(a => {
                    h += `<option value="${escapeHtml(a.id)}">🐙 ${escapeHtml(a.name)} [Forza ${a.strength || a.s7Strength || 12}]</option>`;
                });
                h += '</optgroup>';
            }
            if (npcs.length > 0) {
                h += '<optgroup label="👥 PNG & Alleati">';
                npcs.forEach(a => {
                    h += `<option value="${escapeHtml(a.id)}">👥 ${escapeHtml(a.name)}</option>`;
                });
                h += '</optgroup>';
            }
            masterSel.innerHTML = h;
            if (selectedId) masterSel.value = selectedId;
        }

        if (selectedId) {
            syncSelectorsWithActive(selectedId);
        }
    }

    function injectS7AntagonistBar() {
        if (typeof document === 'undefined') return;
        const win = document.getElementById('dm-statblock-window');
        if (!win || document.getElementById('s7-compendium-bar')) return;

        const searchContainer = document.getElementById('statblock-search-input')?.parentElement?.parentElement;
        if (!searchContainer) return;

        const bar = document.createElement('div');
        bar.id = 's7-compendium-bar';
        bar.style.cssText = 'display:none; flex-direction:column; gap:5px; width:100%; box-sizing:border-box;';

        bar.innerHTML = `
            <!-- Griglia 2x2 dei 4 Selettori Dedicati -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; width:100%;">
                <!-- 1. Squadre di Sgherri -->
                <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-weight:bold; color:#fbbf24; text-transform:uppercase; letter-spacing:0.3px; padding:0 2px;">
                        <span>⚔️ Sgherri</span>
                        <span id="s7-count-brutes" style="color:#d97706; font-size:9.5px; font-weight:bold;">(5)</span>
                    </div>
                    <select id="s7-select-brutes" style="width:100%; background:#13151f; color:#fef3c7; border:1px solid #d97706; border-radius:5px; padding:5px 6px; font-size:11px; font-weight:600; cursor:pointer; text-overflow:ellipsis; outline:none; box-sizing:border-box; transition:border-color 0.15s, box-shadow 0.15s;" title="Seleziona una Squadra di Sgherri">
                    </select>
                </div>

                <!-- 2. Malvagi Ufficiali di Théah -->
                <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-weight:bold; color:#d8b4fe; text-transform:uppercase; letter-spacing:0.3px; padding:0 2px;">
                        <span>👑 Malvagi</span>
                        <span id="s7-count-villains" style="color:#a855f7; font-size:9.5px; font-weight:bold;">(42)</span>
                    </div>
                    <select id="s7-select-villains" style="width:100%; background:#171324; color:#f3e8ff; border:1px solid #9333ea; border-radius:5px; padding:5px 6px; font-size:11px; font-weight:600; cursor:pointer; text-overflow:ellipsis; outline:none; box-sizing:border-box; transition:border-color 0.15s, box-shadow 0.15s;" title="Seleziona un Malvagio Ufficiale di Théah">
                    </select>
                </div>

                <!-- 3. Mostri di Théah & Syrneth -->
                <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-weight:bold; color:#fca5a5; text-transform:uppercase; letter-spacing:0.3px; padding:0 2px;">
                        <span>🐙 Mostri & Syrneth</span>
                        <span id="s7-count-monsters" style="color:#ef4444; font-size:9.5px; font-weight:bold;">(3)</span>
                    </div>
                    <select id="s7-select-monsters" style="width:100%; background:#1c1315; color:#fee2e2; border:1px solid #dc2626; border-radius:5px; padding:5px 6px; font-size:11px; font-weight:600; cursor:pointer; text-overflow:ellipsis; outline:none; box-sizing:border-box; transition:border-color 0.15s, box-shadow 0.15s;" title="Seleziona un Mostro di Théah o Syrneth">
                    </select>
                </div>

                <!-- 4. PNG & Alleati di Théah (Pronto per Fase 2) -->
                <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-weight:bold; color:#7dd3fc; text-transform:uppercase; letter-spacing:0.3px; padding:0 2px;">
                        <span>👥 PNG & Alleati</span>
                        <span id="s7-count-npcs" style="color:#0284c7; font-size:9.5px; font-weight:bold;">(0)</span>
                    </div>
                    <select id="s7-select-npcs" style="width:100%; background:#101923; color:#e0f2fe; border:1px solid #0284c7; border-radius:5px; padding:5px 6px; font-size:11px; font-weight:600; cursor:pointer; text-overflow:ellipsis; outline:none; box-sizing:border-box; transition:border-color 0.15s, box-shadow 0.15s;" title="Seleziona un PNG o Eroe Alleato">
                    </select>
                </div>
            </div>

            <!-- Barra Pulsanti Azione Rapida -->
            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-top:2px; padding-top:4px; border-top:1px solid #2d2618;">
                <div style="display:flex; gap:6px; align-items:center;">
                    <button type="button" id="s7-btn-new-custom-antagonist" style="background:#262b38; color:#fcd34d; border:1px solid #d4af37; border-radius:4px; padding:3px 8px; font-size:11px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:4px;" title="Crea da zero o personalizza una scheda">
                        <span>➕</span> <span>Personalizza</span>
                    </button>
                    <button type="button" id="s7-btn-clear-selection" style="background:#1f2937; color:#9ca3af; border:1px solid #4b5563; border-radius:4px; padding:3px 8px; font-size:11px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:4px;" title="Deseleziona e svuota la scheda corrente">
                        <span>🔄</span> <span>Svuota</span>
                    </button>
                </div>
                <button type="button" id="s7-btn-roll-antagonist" style="background:#065f46; color:#6ee7b7; border:1px solid #10b981; border-radius:4px; padding:3px 10px; font-size:11px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:4px;" title="Lancia subito i d10 di Rischio dell'Antagonista con Forza/Grado">
                    <span>🎲</span> <span>Lancia Rischio</span>
                </button>
            </div>

            <!-- Selettore Master Invisibile (Retrocompatibilità e Test Suite) -->
            <select id="s7-antagonist-select" style="display:none;"></select>
        `;

        searchContainer.appendChild(bar);
        refreshAntagonistSelectOptions();

        const brutesSel = bar.querySelector('#s7-select-brutes');
        const villainsSel = bar.querySelector('#s7-select-villains');
        const monstersSel = bar.querySelector('#s7-select-monsters');
        const npcsSel = bar.querySelector('#s7-select-npcs');
        const allSelectors = [brutesSel, villainsSel, monstersSel, npcsSel].filter(Boolean);

        function handleSelectChange(activeSel) {
            const id = activeSel.value;
            if (!id) return;

            // Deseleziona visivamente gli altri selettori
            allSelectors.forEach(s => {
                if (s !== activeSel) {
                    s.value = '';
                    s.style.boxShadow = 'none';
                }
            });
            activeSel.style.boxShadow = '0 0 6px rgba(251, 191, 36, 0.5)';

            const master = document.getElementById('s7-antagonist-select');
            if (master) master.value = id;

            if (id === '__custom__') {
                openCustomEditor();
                return;
            }

            const found = getAllAntagonists().find(a => a.id === id);
            if (!found || !window.compendium || typeof window.compendium.loadMonster !== 'function') return;

            s7CatalogUnlocked = true;
            if (found._lazyHero && !(window.SEVENTH_SEA_HEROES_BY_ID && window.SEVENTH_SEA_HEROES_BY_ID[found.id])) {
                ensureHeroesLoaded().then(() => {
                    if (getActiveSelectedAntagonistId() !== id) return;
                    const full = resolveFullAntagonist(found);
                    const sb = convertAntagonistToStatblock(full);
                    window.compendium.loadMonster(sb);
                });
                return;
            }
            if (found._lazyVillain && !(window.SEVENTH_SEA_VILLAINS_BY_ID && window.SEVENTH_SEA_VILLAINS_BY_ID[found.id])) {
                // Mostra subito la scheda base (Forza/Influenza/Grado/Roller) a 0ms per evitare flash dell'entry precedente,
                // poi completa subito con Storia/Macchinazioni/Redenzione appena villains_data.js termina il caricamento.
                window.compendium.loadMonster(convertAntagonistToStatblock(found));
                ensureVillainsLoaded().then(() => {
                    if (getActiveSelectedAntagonistId() !== id) return;
                    const full = resolveFullAntagonist(found);
                    const sb = convertAntagonistToStatblock(full);
                    window.compendium.loadMonster(sb);
                });
                return;
            }
            const sb = convertAntagonistToStatblock(resolveFullAntagonist(found));
            window.compendium.loadMonster(sb);
        }

        if (brutesSel) brutesSel.addEventListener('change', () => handleSelectChange(brutesSel));
        if (villainsSel) villainsSel.addEventListener('change', () => handleSelectChange(villainsSel));
        if (monstersSel) monstersSel.addEventListener('change', () => handleSelectChange(monstersSel));
        if (npcsSel) npcsSel.addEventListener('change', () => handleSelectChange(npcsSel));

        bindToolbarHeroInterceptors();

        const clearBtn = bar.querySelector('#s7-btn-clear-selection');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                s7CatalogUnlocked = false;
                applyS7TokenLockMode(false);
                allSelectors.forEach(s => {
                    s.value = '';
                    s.style.boxShadow = 'none';
                });
                const master = document.getElementById('s7-antagonist-select');
                if (master) master.value = '';
                if (window.compendium) window.compendium.currentMonster = null;
                activeS7RenderedEntry = null;
                activeAntagonistTarget = null;
                const placeholder = document.getElementById('statblock-placeholder');
                const details = document.getElementById('statblock-details');
                if (placeholder) placeholder.style.display = 'block';
                if (details) {
                    details.style.display = 'none';
                    details.innerHTML = '';
                }
                renderAntagonistEnemyBonusWidget();
            });
        }

        const customBtn = bar.querySelector('#s7-btn-new-custom-antagonist');
        customBtn.addEventListener('click', () => {
            const cur = window.compendium ? window.compendium.currentMonster : null;
            if (cur && cur.system === '7thsea') {
                openCustomEditor(cur.name, cur);
            } else {
                openCustomEditor();
            }
        });

        const rollBtn = bar.querySelector('#s7-btn-roll-antagonist');
        rollBtn.addEventListener('click', () => {
            const cur = window.compendium ? window.compendium.currentMonster : null;
            const activeId = getActiveSelectedAntagonistId();
            const found = getAllAntagonists().find(a => a.id === activeId);
            const pool = (cur && cur.s7VillainyRank) ? cur.s7VillainyRank
                       : (cur && cur.s7Strength) ? cur.s7Strength
                       : (found ? (found.villainyRank || found.strength || 6) : 6);
            const name = (cur && cur.name) ? cur.name : (found ? found.name : 'Antagonista di Théah');
            const targetName = activeAntagonistTarget ? activeAntagonistTarget.name : null;
            const targetBonus = activeAntagonistTarget ? activeAntagonistTarget.bonus : 0;
            const originalPool = activeAntagonistTarget ? activeAntagonistTarget.originalPool : null;
            const poolInp = document.getElementById('s7-ant-dice-pool');

            rollAntagonistPool(name, pool, false, false, targetName, targetBonus);

            if (activeAntagonistTarget && poolInp && originalPool !== null) {
                poolInp.value = originalPool;
            }
            activeAntagonistTarget = null;
            renderAntagonistEnemyBonusWidget();
        });
    }

    function isGMClient() {
        if (typeof window === 'undefined') return false;
        if (window.isGMOverride !== undefined) return !!window.isGMOverride;
        if (window.location && window.location.pathname && window.location.pathname.toLowerCase().includes('player.html')) return false;
        if (typeof document !== 'undefined' && document.body && (document.body.classList.contains('player-page') || document.body.classList.contains('player-mode'))) return false;
        return true;
    }

    let activeAntagonistTarget = null; // { name: 'Luca', bonus: 3, originalPool: 6 }

    function renderAntagonistEnemyBonusWidget() {
        const container = document.getElementById('s7-ant-gm-enemy-bonus-container');
        if (!container) return;

        // Solo GM (mai su player.html)
        if (!isGMClient()) {
            container.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        container.style.display = 'block';

        if (!window.seventhSeaRules || typeof window.seventhSeaRules.getHeroesGrantingEnemyBonus !== 'function') {
            container.innerHTML = '';
            return;
        }

        const heroes = window.seventhSeaRules.getHeroesGrantingEnemyBonus();
        if (!heroes || heroes.length === 0) {
            container.innerHTML = `
                <div class="s7-enemy-bonus-card" style="margin-bottom:8px; padding:6px 9px;">
                    <div class="s7-eb-header">
                        <span class="s7-eb-title">⚔️ Dadi Bonus Nemici</span>
                        <span class="s7-eb-badge-gm">Solo GM</span>
                    </div>
                    <div style="font-size:10px; color:#9ca3af; font-style:italic;">
                        🛡️ Nessun Eroe sulla mappa ha raggiunto la 2ª Ferita Drammatica (+0 Dadi ai Nemici).
                    </div>
                </div>
            `;
            return;
        }

        const btnsHtml = heroes.map(h => {
            const isActive = activeAntagonistTarget && activeAntagonistTarget.name.toLowerCase() === h.name.toLowerCase();
            return `
                <button type="button" class="s7-eb-target-btn ${isActive ? 'active' : ''}" 
                    onclick="window.seventhSeaCompendium.toggleAntagonistTarget('${escapeHtml(h.name)}', ${h.bonus})"
                    title="${h.breakdown || ''} - Clicca per applicare +${h.bonus} dadi contro ${escapeHtml(h.name)}">
                    🎯 ${escapeHtml(h.name)} <span class="s7-eb-bonus-pill">+${h.bonus}</span>
                    ${isActive ? ' ✔️' : ''}
                </button>
            `;
        }).join(' ');

        const activeBanner = activeAntagonistTarget ? `
            <div class="s7-eb-status-banner">
                <span>🎯 Bersaglio attivo: <b>${escapeHtml(activeAntagonistTarget.name)}</b> (+${activeAntagonistTarget.bonus} dadi applicati). Si azzera al termine del tiro.</span>
                <button type="button" class="s7-eb-cancel-btn" onclick="window.seventhSeaCompendium.cancelAntagonistTarget()">Annulla</button>
            </div>
        ` : '';

        container.innerHTML = `
            <div class="s7-enemy-bonus-card" style="margin-bottom:8px;">
                <div class="s7-eb-header">
                    <span class="s7-eb-title">⚔️ Dadi Bonus Nemici (Bersaglio Eroe)</span>
                    <span class="s7-eb-badge-gm">Solo GM</span>
                </div>
                <div class="s7-eb-desc">
                    Applica i dadi bonus conferiti dalle Ferite Drammatiche dell'Eroe bersaglio. <b>Si azzereranno automaticamente al termine del tiro</b>:
                </div>
                <div class="s7-eb-targets-list">
                    ${btnsHtml}
                </div>
                ${activeBanner}
            </div>
        `;
    }

    function toggleAntagonistTarget(heroName, bonus) {
        const poolInp = document.getElementById('s7-ant-dice-pool');
        if (!poolInp) return;

        if (activeAntagonistTarget && activeAntagonistTarget.name.toLowerCase() === heroName.toLowerCase()) {
            poolInp.value = activeAntagonistTarget.originalPool;
            activeAntagonistTarget = null;
        } else {
            if (activeAntagonistTarget) {
                poolInp.value = activeAntagonistTarget.originalPool;
            }
            const currentPool = Math.max(1, parseInt(poolInp.value) || 6);
            activeAntagonistTarget = {
                name: heroName,
                bonus: bonus,
                originalPool: currentPool
            };
            poolInp.value = currentPool + bonus;
        }
        renderAntagonistEnemyBonusWidget();
    }

    function cancelAntagonistTarget() {
        const poolInp = document.getElementById('s7-ant-dice-pool');
        if (activeAntagonistTarget && poolInp) {
            poolInp.value = activeAntagonistTarget.originalPool;
        }
        activeAntagonistTarget = null;
        renderAntagonistEnemyBonusWidget();
    }

    let antDangerDice = 0;   // dadi aggiunti con i Punti Pericolo per il prossimo tiro del Malvagio
    function rollAntagonistPool(name, pool, explodeTens = false, setsOf15 = false, targetHeroName = null, targetHeroBonus = 0) {
        if (!window.seventhSeaRules) return;
        const res = window.seventhSeaRules.rollSeventhSeaRisk({
            traitName: 'Forza Antagonista',
            traitVal: Math.max(1, parseInt(pool) || 6),
            skillName: 'Malvagità',
            skillVal: 0,
            explodeTens: !!explodeTens,
            setsOf15: !!setsOf15
        });
        if (targetHeroName) {
            res.targetHeroName = targetHeroName;
            res.targetHeroBonus = targetHeroBonus;
        }
        try {
            window.seventhSeaRules.broadcastRiskRollToVttChat(name, res);
        } catch (bErr) {
            console.warn('[7thSea Compendium] Errore broadcast rischio:', bErr);
        }

        const box = document.getElementById('s7-antagonist-roll-results');
        if (box) {
            const diceBadges = res.dice.map(d =>
                `<span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:5px;background:#242938;border:1px solid #4b5563;color:#fcd34d;font-weight:900;font-size:12px;">${d}</span>`
            ).join(' ');

            const setsBadges = res.sets.map(s =>
                `<div style="display:inline-flex;align-items:center;gap:4px;background:rgba(6,78,59,0.75);border:1px solid #10b981;border-radius:6px;padding:3px 7px;font-size:11px;color:#a7f3d0;">
                    <b>${s.dice.join(' + ')} = ${s.sum}</b>
                    <span style="background:#064e3b;color:#34d399;padding:1px 5px;border-radius:4px;font-weight:900;">+${s.raises} Incr.</span>
                </div>`
            ).join(' ');

            const remBadges = res.remaining.length > 0
                ? `<div style="font-size:10.5px;color:#9ca3af;margin-top:4px;">Dadi non abbinati: ${res.remaining.join(', ')}</div>`
                : '';

            const targetBadge = targetHeroName ? `<span style="font-size:10.5px;font-weight:bold;color:#f3e8ff;background:#581c87;border:1px solid #a855f7;padding:1px 6px;border-radius:4px;margin-left:6px;">🎯 vs ${escapeHtml(targetHeroName)} (+${targetHeroBonus} Nemici)</span>` : '';

            box.style.display = 'block';
            box.innerHTML = `
                <div style="background:#111827;border:1px solid #10b981;border-radius:7px;padding:8px 10px;margin-top:8px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:11px;color:#d1d5db;font-weight:bold;">Dadi Tirati (${res.dice.length}d10) ${targetBadge}:</span>
                        <span style="font-size:14px;font-weight:900;color:#34d399;background:#064e3b;border:1px solid #10b981;padding:2px 9px;border-radius:6px;">🎯 ${res.totalRaises} Incrementi</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;">${diceBadges}</div>
                    <div style="display:flex;flex-wrap:wrap;gap:5px;">${setsBadges || '<span style="color:#9ca3af;font-style:italic;font-size:11px;">Nessun Incremento generato.</span>'}</div>
                    ${remBadges}
                </div>
            `;
        }
    }

    // =========================================================================
    // EROI UFFICIALI 7TH SEA: ANTEPRIMA SINTETICA, SPAWN & ASSEGNAZIONE TOKEN
    // =========================================================================
    let activeS7RenderedEntry = null;
    let toolbarHeroInterceptorsBound = false;

    function isOfficialHeroEntry(m) {
        if (!m || !m.pcData || typeof m.pcData !== 'object') return false;
        const cat = String(m.s7Category || m.category || '').toLowerCase();
        return cat === 'npc' || cat === 'hero';
    }

    function getVttEngineRef() {
        if (typeof window !== 'undefined' && window.engine) return window.engine;
        try { if (typeof engine !== 'undefined' && engine) return engine; } catch (e) {}
        return null;
    }

    function notifyCompendiumMsg(msg, isWarn = false) {
        if (isWarn && typeof window.vttWarn === 'function') {
            window.vttWarn(msg);
        } else if (typeof window.showToast === 'function') {
            window.showToast(msg);
        } else if (typeof showToast === 'function') {
            showToast(msg);
        }
    }

    function buildHeroSheetPayload(heroObj) {
        if (!heroObj || !heroObj.pcData) return null;
        if (!window.seventhSeaSheetManager || typeof window.seventhSeaSheetManager.buildHeroPcSheet !== 'function') {
            return null;
        }
        const pcSheet = window.seventhSeaSheetManager.buildHeroPcSheet(heroObj.pcData);
        if (!pcSheet) return null;
        const hpMax = typeof window.seventhSeaSheetManager.getHeroMaxWounds === 'function'
            ? window.seventhSeaSheetManager.getHeroMaxWounds(pcSheet)
            : 20;
        return { pcSheet, hpMax };
    }

    function assignHeroToSelectedToken(heroObj, compendiumInstance = null) {
        if (!isOfficialHeroEntry(heroObj)) return false;
        const eng = getVttEngineRef();
        if (!eng || !Array.isArray(eng.tokens)) return false;

        const compRef = compendiumInstance || window.compendium || null;
        let targetTokens = (eng.selectedTokens && eng.selectedTokens.size > 0)
            ? eng.tokens.filter(t => eng.selectedTokens.has(t.id))
            : (eng.selectedTokenId ? [eng.tokens.find(t => t.id === eng.selectedTokenId)].filter(Boolean) : []);
        if (targetTokens.length === 0 && window.editingPlayerToken) {
            targetTokens = [window.editingPlayerToken];
        }
        if (targetTokens.length === 0 && compRef && compRef._activeTargetTokenId) {
            const found = eng.tokens.find(t => t.id === compRef._activeTargetTokenId);
            if (found) targetTokens = [found];
        }

        if (targetTokens.length === 0) {
            notifyCompendiumMsg('Seleziona prima almeno un token sulla mappa cliccandoci sopra!', true);
            return false;
        }

        const customTokenSrc = (compRef && compRef.currentMonster && compRef.currentMonster.id === heroObj.id && compRef.currentMonster.tokenSrc)
            ? compRef.currentMonster.tokenSrc
            : heroObj.tokenSrc;

        let assignedHpMax = 20;
        targetTokens.forEach(token => {
            const built = buildHeroSheetPayload(heroObj);
            if (!built) return;
            assignedHpMax = built.hpMax;
            token.pcSheet = built.pcSheet;
            token.hasPcSheet = true;
            delete token.statblock;
            token.name = heroObj.name || built.pcSheet.name || token.name;
            token.originalName = token.name;
            // Se era un PG giocabile scelto per un giocatore resta 'personaggi', altrimenti 'png' (mai nella lista PG login)
            if (token.category !== 'personaggi') {
                token.category = 'png';
            }
            token.hpMax = built.hpMax;
            token.hpCurrent = built.hpMax;
            token.hpVisibleToPlayers = true;

            if (eng.initiative && Array.isArray(eng.initiative.participants)) {
                const p = eng.initiative.participants.find(x => x.tokenId === token.id);
                if (p) {
                    p.name = token.name;
                    p.hpCurrent = built.hpMax;
                    p.hpMax = built.hpMax;
                }
            }
            if (typeof window.upsertTokenInCampaign === 'function') window.upsertTokenInCampaign(token);
        });

        if (customTokenSrc) {
            const newImg = new Image();
            newImg.onload = () => {
                targetTokens.forEach(token => {
                    token.imageObj = newImg;
                    token.src = customTokenSrc;
                    if (typeof window.markTokenImageDirty === 'function') window.markTokenImageDirty(token.id);
                });
                if (typeof eng.renderAll === 'function') eng.renderAll();
                if (typeof window.syncState === 'function') window.syncState(true, false);
            };
            newImg.src = customTokenSrc;
        }

        if (typeof window.updateSelectedTokenControls === 'function' && targetTokens[0]) {
            window.updateSelectedTokenControls(targetTokens[0]);
        }
        if (typeof eng.renderAll === 'function') eng.renderAll();
        if (typeof window.syncState === 'function') window.syncState(true, false);
        else if (typeof syncState === 'function') syncState(true, false);
        if (typeof window.broadcastPcSheetSync === 'function') {
            targetTokens.forEach(t => window.broadcastPcSheetSync(t));
        }
        if (window.pcSheetManager && typeof window.pcSheetManager.refreshIfOpen === 'function') {
            targetTokens.forEach(t => window.pcSheetManager.refreshIfOpen(t.id));
        }
        if (typeof window.updateMapTokensGallery === 'function') window.updateMapTokensGallery();
        else if (typeof updateMapTokensGallery === 'function') updateMapTokensGallery();

        const fdLbl = assignedHpMax === 25 ? '5 FD' : '4 FD';
        notifyCompendiumMsg(`⚓ Scheda Eroe "${heroObj.name}" assegnata a ${targetTokens.length} token (${assignedHpMax} Ferite / ${fdLbl})!`);
        return targetTokens;
    }

    function spawnHeroToken(heroObj, compendiumInstance = null) {
        if (!isOfficialHeroEntry(heroObj)) return null;
        const eng = getVttEngineRef();
        if (!eng || !Array.isArray(eng.tokens)) return null;

        const built = buildHeroSheetPayload(heroObj);
        if (!built) return null;
        const { pcSheet, hpMax } = built;

        const compRef = compendiumInstance || window.compendium || null;
        const gridSize = (eng.grid && eng.grid.size) ? eng.grid.size : 50;
        const pxSize = gridSize;

        let snappedX = 0;
        let snappedY = 0;
        try {
            if (eng.layers && eng.layers.ui && typeof eng.screenToWorld === 'function') {
                const centerWorld = eng.screenToWorld(eng.layers.ui.width / 2, eng.layers.ui.height / 2);
                const effOffsetX = (eng.grid && eng.grid.offsetX ? eng.grid.offsetX : 0) % gridSize;
                const effOffsetY = (eng.grid && eng.grid.offsetY ? eng.grid.offsetY : 0) % gridSize;
                snappedX = Math.round((centerWorld.x - effOffsetX) / gridSize) * gridSize + effOffsetX;
                snappedY = Math.round((centerWorld.y - effOffsetY) / gridSize) * gridSize + effOffsetY;
            }
        } catch (e) {}

        const customTokenSrc = (compRef && compRef.currentMonster && compRef.currentMonster.id === heroObj.id && compRef.currentMonster.tokenSrc)
            ? compRef.currentMonster.tokenSrc
            : heroObj.tokenSrc;
        const tokenSrc = customTokenSrc || (compRef && typeof compRef.generateLetterToken === 'function' ? compRef.generateLetterToken(heroObj) : '');
        const isInvisible = !!(document.getElementById('statblock-spawn-invisible')?.checked);
        const heroName = heroObj.name || pcSheet.name || 'Eroe di Théah';

        const token = {
            id: 'token_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: heroName,
            nameVisibility: 'all',
            originalName: heroName,
            x: snappedX,
            y: snappedY,
            width: pxSize,
            height: pxSize,
            sizeMultiplier: 1,
            src: tokenSrc,
            // Categoria PNG: l'Eroe ufficiale ha pcSheet completa ma NON entra mai nel selettore PG di login dei giocatori
            category: 'png',
            visible: !isInvisible,
            imageObj: null,
            ac: 10,
            hpMax: hpMax,
            hpCurrent: hpMax,
            hpVisibleToPlayers: true,
            hasPcSheet: true,
            pcSheet: pcSheet
        };

        if (tokenSrc) {
            const imgObj = new Image();
            imgObj.onload = () => {
                token.imageObj = imgObj;
                if (typeof eng.renderAll === 'function') eng.renderAll();
            };
            imgObj.src = tokenSrc;
        }

        eng.tokens.push(token);
        if (typeof window.upsertTokenInCampaign === 'function') window.upsertTokenInCampaign(token);
        if (eng.selectedTokens && typeof eng.selectedTokens.clear === 'function') {
            eng.selectedTokens.clear();
            eng.selectedTokens.add(token.id);
        }
        eng.selectedTokenId = token.id;

        if (typeof window.updateSelectedTokenControls === 'function') {
            window.updateSelectedTokenControls(token);
        }
        if (typeof eng.renderAll === 'function') eng.renderAll();
        if (typeof window.syncState === 'function') window.syncState(true, false);
        else if (typeof syncState === 'function') syncState(true, false);
        if (typeof window.broadcastPcSheetSync === 'function') window.broadcastPcSheetSync(token);
        if (typeof window.updateMapTokensGallery === 'function') window.updateMapTokensGallery();
        else if (typeof updateMapTokensGallery === 'function') updateMapTokensGallery();

        const fdLbl = hpMax === 25 ? '5 FD' : '4 FD';
        const pfx = isInvisible ? '🙈 Creato token INVISIBILE Eroe (PNG)' : '⚓ Creato token Eroe (PNG)';
        notifyCompendiumMsg(`${pfx} "${heroName}" — Scheda completa (${hpMax} Ferite / ${fdLbl})!`);
        return token;
    }

    function bindToolbarHeroInterceptors() {
        if (toolbarHeroInterceptorsBound || typeof document === 'undefined') return;
        const assignBtn = document.getElementById('btn-assign-statblock');
        const spawnBtn = document.getElementById('btn-spawn-statblock-token');
        if (!assignBtn && !spawnBtn) return;
        toolbarHeroInterceptorsBound = true;

        const isS7HeroCurrentlyShown = () => {
            const isS7 = window.systemManager && typeof window.systemManager.getActiveSystemId === 'function'
                && window.systemManager.getActiveSystemId() === '7thsea';
            if (!isS7 || !activeS7RenderedEntry || !isOfficialHeroEntry(activeS7RenderedEntry.monster)) return false;
            const det = document.getElementById('statblock-details');
            return !!(det && det.style.display !== 'none');
        };

        if (assignBtn) {
            assignBtn.addEventListener('click', (e) => {
                if (isS7HeroCurrentlyShown()) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    assignHeroToSelectedToken(activeS7RenderedEntry.monster, activeS7RenderedEntry.compendium);
                    return;
                }
                const isS7 = window.systemManager && typeof window.systemManager.getActiveSystemId === 'function'
                    && window.systemManager.getActiveSystemId() === '7thsea';
                if (!isS7) return;
                // Dopo che js/compendium.js ha assegnato il clone dello statblock ai token selezionati,
                // allineiamo il nome del token allo Sgherro/Malvagio/Mostro assegnato (come per gli Eroi)
                // e fissiamo subito la scheda sul token (nascondendo i selettori).
                setTimeout(() => {
                    const eng = getVttEngineRef();
                    const comp = window.compendium;
                    if (!eng || !Array.isArray(eng.tokens) || !comp) return;
                    let targetTokens = (eng.selectedTokens && eng.selectedTokens.size > 0)
                        ? eng.tokens.filter(t => eng.selectedTokens.has(t.id))
                        : (eng.selectedTokenId ? [eng.tokens.find(t => t.id === eng.selectedTokenId)].filter(Boolean) : []);
                    if (targetTokens.length === 0 && comp._activeTargetTokenId) {
                        const found = eng.tokens.find(t => t.id === comp._activeTargetTokenId);
                        if (found) targetTokens = [found];
                    }
                    const s7Tokens = targetTokens.filter(t => t && t.statblock && t.statblock.system === '7thsea');
                    if (s7Tokens.length === 0) return;

                    let nameChanged = false;
                    s7Tokens.forEach(t => {
                        const newName = cleanS7TokenName(t.statblock.name);
                        if (newName && t.name !== newName) {
                            t.name = newName;
                            t.originalName = newName;
                            nameChanged = true;
                        }
                        if (eng.initiative && Array.isArray(eng.initiative.participants)) {
                            eng.initiative.participants.forEach(p => {
                                if (String(p.tokenId) === String(t.id) && newName) p.name = newName;
                            });
                        }
                        try { if (typeof window.upsertTokenInCampaign === 'function') window.upsertTokenInCampaign(t); } catch (err) {}
                    });

                    const primaryTok = (eng.selectedTokenId && s7Tokens.find(t => t.id === eng.selectedTokenId)) || s7Tokens[0];
                    if (nameChanged) {
                        try { if (typeof window.updateSelectedTokenControls === 'function') window.updateSelectedTokenControls(primaryTok); } catch (err) {}
                        try { if (typeof renderTrackerList === 'function') renderTrackerList({ skipRenderAndSync: true }); } catch (err) {}
                        try { if (typeof window.updateMapTokensGallery === 'function') window.updateMapTokensGallery(); else if (typeof updateMapTokensGallery === 'function') updateMapTokensGallery(); } catch (err) {}
                        try { if (typeof eng.renderTokensLayer === 'function') eng.renderTokensLayer(); } catch (err) {}
                        try { if (typeof window.syncState === 'function') window.syncState(true, false); else if (typeof syncState === 'function') syncState(true, false); } catch (err) {}
                    }

                    s7CatalogUnlocked = false;
                    comp._activeTargetTokenId = primaryTok.id;
                    comp.loadMonster(primaryTok.statblock);
                }, 0);
            }, true);
        }
        if (spawnBtn) {
            spawnBtn.addEventListener('click', (e) => {
                if (isS7HeroCurrentlyShown()) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    spawnHeroToken(activeS7RenderedEntry.monster, activeS7RenderedEntry.compendium);
                    return;
                }
                const isS7 = window.systemManager && typeof window.systemManager.getActiveSystemId === 'function'
                    && window.systemManager.getActiveSystemId() === '7thsea';
                if (!isS7) return;
                // Opzione 1: rimuove suffissi "(Squadra Sgherri)" anche dai token appena creati con "Crea Token"
                setTimeout(() => {
                    const eng = getVttEngineRef();
                    if (!eng || !Array.isArray(eng.tokens) || eng.tokens.length === 0) return;
                    const lastTok = eng.tokens[eng.tokens.length - 1];
                    if (lastTok && lastTok.statblock && lastTok.statblock.system === '7thsea' && lastTok.name) {
                        const cleaned = lastTok.name.replace(/\s*\((?:Squadra\s+Sgherri|Squadra\s+di\s+Sgherri|Brute\s+Squad|Malvagio|Villain)\)/i, '').replace(/\s{2,}/g, ' ').trim();
                        if (cleaned && cleaned !== lastTok.name) {
                            lastTok.name = cleaned;
                            lastTok.originalName = cleaned;
                            try { if (typeof window.upsertTokenInCampaign === 'function') window.upsertTokenInCampaign(lastTok); } catch (err) {}
                            try { if (typeof window.updateSelectedTokenControls === 'function') window.updateSelectedTokenControls(lastTok); } catch (err) {}
                            try { if (typeof window.updateMapTokensGallery === 'function') window.updateMapTokensGallery(); } catch (err) {}
                            try { if (typeof eng.renderTokensLayer === 'function') eng.renderTokensLayer(); } catch (err) {}
                            try { if (typeof window.syncState === 'function') window.syncState(true, false); } catch (err) {}
                        }
                    }
                }, 80);
            }, true);
        }
    }

    // Rendering nativo della Scheda Antagonista 7th Sea (ZERO campi D&D 5e!)
    function renderSeventhSeaStatblock(m, compendiumInstance) {
        const placeholder = document.getElementById('statblock-placeholder');
        const details = document.getElementById('statblock-details');
        if (!details) return;
        if (placeholder) placeholder.style.display = 'none';
        details.style.display = 'block';

        activeS7RenderedEntry = { monster: m, compendium: compendiumInstance || window.compendium || null };
        bindToolbarHeroInterceptors();

        const category = m.s7Category || ((m.type || '').toLowerCase().includes('malvagio') ? 'villain' : ((m.type || '').toLowerCase().includes('mostro') ? 'monster' : ((m.type || '').toLowerCase().includes('png') || (m.type || '').toLowerCase().includes('alleato') || (m.type || '').toLowerCase().includes('eroe')) ? 'npc' : 'brute'));
        const isBrute = category === 'brute';
        const isVillain = category === 'villain';
        const isMonster = category === 'monster';
        const isNpc = category === 'npc' || category === 'hero';
        const rawAvatar = m.tokenSrc || (compendiumInstance ? compendiumInstance.generateLetterToken(m) : '');
        const tokenAvatarSrc = rawAvatar || '';

        // === ANTEPRIMA SINTETICA PER I 40 EROI UFFICIALI (CON SCHEDA COMPLETA ON-DEMAND SUL TOKEN) ===
        if (isNpc && m.pcData) {
            const spawnCatSel = document.getElementById('statblock-spawn-category');
            if (spawnCatSel) spawnCatSel.value = 'png';

            const preview = buildHeroSheetPayload(m);
            const sh = preview ? preview.pcSheet : null;
            const heroHpMax = preview ? preview.hpMax : 20;
            const nationLabel = (m.pcData.nationLabel || m.s7Nation || (sh && sh.nation) || 'Théah');
            const archetype = m.archetype || 'Eroe di Théah';
            const traitsObj = (sh && sh.traits) || m.pcData.traits || {};
            const skillsObj = (sh && sh.skills) || m.pcData.skills || {};
            const advList = (sh && Array.isArray(sh.advantages)) ? sh.advantages.map(a => a.name) : (m.pcData.advantages || []);
            const virtueName = (sh && sh.virtue) || '—';
            const hubrisName = (sh && sh.hubris) || '—';
            const duelingList = (sh && Array.isArray(sh.duelingStyles) && sh.duelingStyles.length > 0)
                ? sh.duelingStyles.join(' + ')
                : ((sh && sh.advantages && sh.advantages.some(a => /^studioso di lotta/i.test(a.name || '')))
                    ? `Studioso di Lotta (${sh.studiosoManeuver || 'Finta'})`
                    : 'Nessuno');
            const sorcerySummary = (sh && sh.sorcery && sh.sorcery !== 'Nessuna')
                ? `${sh.sorcery} (Grado ${sh.sorceryRank || 1})`
                : 'Nessuna';
            const quoteShort = m.pcData.quote
                ? (m.pcData.quote.length > 170 ? m.pcData.quote.slice(0, 167).trim() + '…' : m.pcData.quote)
                : '';

            const traitOrder = ['Vigore', 'Grazia', 'Risolutezza', 'Acume', 'Panache'];
            const traitsHtml = traitOrder.map(tName => `
                <div style="background:#141720; border:1px solid #2e3646; border-radius:6px; padding:5px 4px; text-align:center;">
                    <div style="font-size:9.5px; color:#9ca3af; text-transform:uppercase; font-weight:bold;">${tName.slice(0, 5)}</div>
                    <div style="font-size:15px; font-weight:900; color:#fcd34d; margin-top:1px;">${traitsObj[tName] || 2}</div>
                </div>
            `).join('');

            const activeSkills = Object.entries(skillsObj)
                .filter(([, v]) => (parseInt(v, 10) || 0) > 0)
                .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'it'));
            const skillsHtml = activeSkills.map(([sName, sVal]) => `
                <span style="background:#151b26; border:1px solid #2d3b52; color:#e2e8f0; border-radius:4px; padding:2px 6px; font-size:11px;">
                    ${escapeHtml(sName)} <b style="color:#fcd34d;">${sVal}</b>
                </span>
            `).join('');

            const advsHtml = advList.map(aName => `
                <span style="background:#1c1914; border:1px solid #6b5323; color:#fde68a; border-radius:4px; padding:2px 6px; font-size:11px;">
                    ${escapeHtml(aName)}
                </span>
            `).join('');

            details.innerHTML = `
                <div id="s7-hero-compact-preview" style="font-family:'Segoe UI', sans-serif; color:#e5e7eb; display:flex; flex-direction:column; gap:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #0284c7; padding-bottom:8px;">
                        <div style="flex:1; min-width:0;">
                            <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap;">
                                <span style="background:#0284c7; color:#fff; font-size:10px; font-weight:bold; padding:2px 7px; border-radius:4px; text-transform:uppercase;">⚓ Eroe Ufficiale</span>
                                <span style="background:#1e293b; color:#93c5fd; border:1px solid #3b82f6; font-size:10px; font-weight:bold; padding:1px 6px; border-radius:4px;">🏛️ ${escapeHtml(nationLabel)}</span>
                                <span style="font-size:10.5px; color:#9ca3af;">${escapeHtml(archetype)}</span>
                            </div>
                            <div style="font-size:17px; font-weight:900; color:#fcd34d; font-family:Georgia, serif; margin-top:4px; line-height:1.2;">${escapeHtml(m.name)}</div>
                            ${quoteShort ? `<div style="font-size:11px; color:#cbd5e1; font-style:italic; margin-top:3px; line-height:1.35;">“${escapeHtml(quoteShort)}”</div>` : ''}
                            <div style="margin-top:7px; display:flex; gap:6px; flex-wrap:wrap;">
                                <button type="button" id="s7-btn-spawn-hero" style="background:#0f766e; color:#ecfdf5; border:1px solid #14b8a6; border-radius:5px; padding:4px 9px; font-size:11px; font-weight:bold; cursor:pointer;" title="Crea un token PNG sulla mappa con la Scheda Eroe completa (non appare nel login PG dei giocatori)">♟️ Crea Token Eroe (PNG)</button>
                                <button type="button" id="s7-btn-assign-hero" style="background:#b45309; color:#fef3c7; border:1px solid #f59e0b; border-radius:5px; padding:4px 9px; font-size:11px; font-weight:bold; cursor:pointer;" title="Assegna la Scheda Eroe completa al token selezionato sulla mappa">⚡ Assegna a Token</button>
                                <button type="button" id="s7-btn-load-as-pc" style="background:#0369a1; color:#e0f2fe; border:1px solid #38bdf8; border-radius:5px; padding:4px 9px; font-size:11px; font-weight:bold; cursor:pointer;" title="Apri la Scheda Eroe completa in anteprima (senza sovrascrivere altri token)">⚓ Apri Scheda Completa</button>
                            </div>
                        </div>
                        <div id="statblock-avatar-wrapper" style="position:relative; cursor:pointer; margin-left:10px; flex-shrink:0;" title="Clicca per cambiare immagine del Token">
                            <img id="statblock-avatar-img" src="${escapeHtml(tokenAvatarSrc)}" style="width:54px; height:54px; border-radius:50%; border:2px solid #38bdf8; object-fit:cover; background:#111; box-shadow:0 2px 8px rgba(0,0,0,0.6);">
                            <span style="position:absolute; bottom:-2px; right:-2px; background:#0284c7; border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; font-size:10px; color:white;">📷</span>
                            <input type="file" id="statblock-avatar-file-input" accept="image/*" style="display:none;">
                        </div>
                    </div>

                    <!-- 5 TRATTI + SALUTE -->
                    <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px;">
                        ${traitsHtml}
                    </div>

                    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; font-size:11.5px;">
                        <div style="background:#141720; border:1px solid #2e3646; border-left:3px solid #ef4444; border-radius:6px; padding:7px 9px;">
                            <div style="font-size:10px; color:#9ca3af; text-transform:uppercase; font-weight:bold;">🩸 Salute &amp; Risorse</div>
                            <div style="margin-top:2px; color:#fca5a5; font-weight:bold;">${heroHpMax} Ferite (${heroHpMax === 25 ? '5 FD — Duro da Uccidere' : '4 FD'})</div>
                            <div style="font-size:10.5px; color:#cbd5e1; margin-top:2px;">PE: <b>${sh ? sh.heroPoints : 3}</b>${sh && sh.wealth ? ` &bull; Ricchezza: <b>${sh.wealth}</b>` : ''}</div>
                        </div>
                        <div style="background:#141720; border:1px solid #2e3646; border-left:3px solid #10b981; border-radius:6px; padding:7px 9px;">
                            <div style="font-size:10px; color:#9ca3af; text-transform:uppercase; font-weight:bold;">🃏 Arcano (Virtù / Superbia)</div>
                            <div style="margin-top:2px;"><span style="color:#6ee7b7; font-weight:bold;">${escapeHtml(virtueName)}</span> / <span style="color:#fda4af; font-weight:bold;">${escapeHtml(hubrisName)}</span></div>
                            <div style="font-size:10.5px; color:#cbd5e1; margin-top:2px;">⚔️ ${escapeHtml(duelingList)}${sorcerySummary !== 'Nessuna' ? ` &bull; ✨ ${escapeHtml(sorcerySummary)}` : ''}</div>
                        </div>
                    </div>

                    <!-- ABILITÀ PRINCIPALI -->
                    <div style="background:#141720; border:1px solid #2e3646; border-radius:8px; padding:8px 10px;">
                        <div style="font-size:10.5px; font-weight:bold; color:#93c5fd; text-transform:uppercase; margin-bottom:5px;">🎯 Abilità</div>
                        <div style="display:flex; flex-wrap:wrap; gap:5px;">${skillsHtml || '<span style="color:#9ca3af; font-size:11px;">Nessuna abilità</span>'}</div>
                    </div>

                    <!-- VANTAGGI (ELENCO SINTETICO) -->
                    <div style="background:#141720; border:1px solid #2e3646; border-radius:8px; padding:8px 10px;">
                        <div style="font-size:10.5px; font-weight:bold; color:#fcd34d; text-transform:uppercase; margin-bottom:5px;">⭐ Vantaggi (${advList.length})</div>
                        <div style="display:flex; flex-wrap:wrap; gap:5px;">${advsHtml}</div>
                    </div>

                    <div style="font-size:10.5px; color:#94a3b8; background:#0f172a; border:1px solid #1e3a5f; border-radius:6px; padding:6px 9px;">
                        ℹ️ Anteprima leggera: la scheda completa con tutti gli automatismi, Peculiarità (+1 PE), Storia, Obiettivi e Consigli di Interpretazione viene salvata <b>solo sul token</b> quando lo crei o lo assegni.
                    </div>
                </div>
            `;

            const avatarWrapper = document.getElementById('statblock-avatar-wrapper');
            const avatarInput = document.getElementById('statblock-avatar-file-input');
            if (avatarWrapper && avatarInput && compendiumInstance) {
                avatarWrapper.onclick = () => avatarInput.click();
                avatarInput.onchange = (e) => {
                    if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            compendiumInstance.setMonsterTokenImage(ev.target.result);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }
                };
            }

            const spawnHeroBtn = document.getElementById('s7-btn-spawn-hero');
            if (spawnHeroBtn) {
                spawnHeroBtn.addEventListener('click', () => spawnHeroToken(m, compendiumInstance));
            }
            const assignHeroBtn = document.getElementById('s7-btn-assign-hero');
            if (assignHeroBtn) {
                assignHeroBtn.addEventListener('click', () => assignHeroToSelectedToken(m, compendiumInstance));
            }
            const loadPcBtn = document.getElementById('s7-btn-load-as-pc');
            if (loadPcBtn && m.pcData) {
                loadPcBtn.addEventListener('click', () => {
                    if (window.seventhSeaSheetManager && typeof window.seventhSeaSheetManager.loadHeroData === 'function') {
                        window.seventhSeaSheetManager.loadHeroData(m.pcData, { detachToken: true });
                    }
                });
            }

            applyS7TokenLockMode(false);
            syncSelectorsWithActive(m.id || m.name);
            return;
        }

        const linkedTok = findTokenOfStatblock(m);
        const isLockedToToken = !!(linkedTok && !s7CatalogUnlocked);
        applyS7TokenLockMode(isLockedToToken);

        const rawStr = (m.s7Strength !== undefined && m.s7Strength !== null && m.s7Strength !== '')
            ? parseInt(m.s7Strength, 10)
            : parseInt(m.strength, 10);
        const strength = Number.isFinite(rawStr) ? Math.max(0, rawStr) : 6;
        const rawInf = (m.s7Influence !== undefined && m.s7Influence !== null && m.s7Influence !== '')
            ? parseInt(m.s7Influence, 10)
            : parseInt(m.influence, 10);
        const influence = Number.isFinite(rawInf) ? Math.max(0, rawInf) : 0;
        const rawRank = (m.s7VillainyRank !== undefined && m.s7VillainyRank !== null && m.s7VillainyRank !== '')
            ? parseInt(m.s7VillainyRank, 10)
            : NaN;
        const villainyRank = Number.isFinite(rawRank) ? Math.max(0, rawRank) : (isVillain ? (strength + influence) : strength);
        const rawHp = (m.hit_points !== undefined && m.hit_points !== null && m.hit_points !== '')
            ? parseInt(m.hit_points, 10)
            : parseInt(m.hp, 10);
        const baseHpVal = Number.isFinite(rawHp) ? Math.max(0, rawHp) : (isBrute ? strength : 20);
        const tokHpCurr = (linkedTok && linkedTok.hpCurrent !== undefined && linkedTok.hpCurrent !== null && linkedTok.hpCurrent !== '')
            ? parseInt(linkedTok.hpCurrent, 10)
            : NaN;
        const hpVal = Number.isFinite(tokHpCurr) ? Math.max(0, tokHpCurr) : baseHpVal;
        const tokHpMax = (linkedTok && linkedTok.hpMax !== undefined && linkedTok.hpMax !== null && linkedTok.hpMax !== '')
            ? parseInt(linkedTok.hpMax, 10)
            : NaN;
        const hpMaxVal = Number.isFinite(tokHpMax) && tokHpMax > 0 ? tokHpMax : Math.max(1, baseHpVal || (isBrute ? Math.max(1, strength) : 20));
        const woundsTaken = Math.max(0, hpMaxVal - hpVal);
        const nation = m.s7Nation || 'Théah';
        const traits = m.s7Traits || (m.special_abilities && m.special_abilities[1] ? m.special_abilities[1].desc : 'Mischia, Intimidire, Atletica');
        const ability = m.s7Ability || (m.actions && m.actions[0] ? m.actions[0].desc : (isNpc ? 'Supporta gli Eroi nella scena.' : 'Attacca gli Eroi nella scena.'));
        const notes = m.s7Notes || '';

        const catBadgeColor = isVillain ? '#9333ea' : (isMonster ? '#be123c' : (isNpc ? '#0284c7' : '#d97706'));
        const catIcon = isVillain ? '👑' : (isMonster ? '🐙' : (isNpc ? '👥' : '⚔️'));
        const catTitle = isVillain ? 'Malvagio (Villain)' : (isMonster ? 'Mostro di Théah' : (isNpc ? 'PNG / Eroe Alleato' : 'Squadra di Sgherri'));

        details.innerHTML = `
            <div style="font-family:'Segoe UI', sans-serif; color:#e5e7eb; display:flex; flex-direction:column; gap:10px;">
                <!-- INTESTAZIONE ANTAGONISTA 7TH SEA -->
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #d4af37; padding-bottom:8px;">
                    <div style="flex:1; min-width:0;">
                        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            <span style="background:${catBadgeColor}; color:#fff; font-size:10px; font-weight:bold; padding:2px 7px; border-radius:4px; text-transform:uppercase;">${catIcon} ${escapeHtml(catTitle)}</span>
                            <span style="background:#1e293b; color:#93c5fd; border:1px solid #3b82f6; font-size:10px; font-weight:bold; padding:1px 6px; border-radius:4px;">🏛️ ${escapeHtml(nation)}</span>
                            <span style="font-size:10.5px; color:#9ca3af;">Taglia: ${escapeHtml(m.size || 'Media')}</span>
                        </div>
                        <div style="font-size:17px; font-weight:900; color:#fcd34d; font-family:Georgia, serif; margin-top:4px; line-height:1.2;">${escapeHtml(m.name)}</div>
                        <div style="margin-top:5px; display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                            <button type="button" id="s7-btn-edit-current" style="background:#262b38; color:#fcd34d; border:1px solid #d4af37; border-radius:4px; padding:3px 9px; font-size:11px; font-weight:bold; cursor:pointer;">✏️ Modifica / Personalizza Scheda</button>
                            ${isLockedToToken ? `
                            <button type="button" id="s7-btn-unlock-catalog" style="background:#1e293b; color:#93c5fd; border:1px solid #3b82f6; border-radius:4px; padding:3px 9px; font-size:11px; font-weight:bold; cursor:pointer;" title="Mostra il catalogo per cambiare Sgherro, Malvagio o Mostro">🔄 Cambia Antagonista</button>
                            ` : ''}
                            ${m.pcData ? `
                            <button type="button" id="s7-btn-load-as-pc" style="background:#0369a1; color:#e0f2fe; border:1px solid #38bdf8; border-radius:4px; padding:3px 9px; font-size:11px; font-weight:bold; cursor:pointer;" title="Carica questo Eroe direttamente nella Scheda Personaggio giocabile">⭐ Carica come Scheda PG</button>
                            ` : ''}
                        </div>
                    </div>
                    <div id="statblock-avatar-wrapper" style="position:relative; cursor:pointer; margin-left:10px; flex-shrink:0;" title="Clicca per cambiare immagine del Token">
                        <img id="statblock-avatar-img" src="${escapeHtml(tokenAvatarSrc)}" style="width:54px; height:54px; border-radius:50%; border:2px solid #d4af37; object-fit:cover; background:#111; box-shadow:0 2px 8px rgba(0,0,0,0.6);">
                        <span style="position:absolute; bottom:-2px; right:-2px; background:#d97706; border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; font-size:10px; color:white;">📷</span>
                        <input type="file" id="statblock-avatar-file-input" accept="image/*" style="display:none;">
                    </div>
                </div>

                <!-- GRIGLIA PARAMETRI 7TH SEA (NESSUNA STATISTICA D&D!) -->
                <div style="display:grid; grid-template-columns:repeat(${isVillain ? 3 : 2}, 1fr); gap:8px;">
                    <div style="background:#141720; border:1px solid #374151; border-left:3px solid #f59e0b; border-radius:6px; padding:8px 10px;">
                        <div style="font-size:10px; color:#9ca3af; text-transform:uppercase; font-weight:bold;">⚔️ ${isBrute ? 'Forza Squadra' : (isNpc ? 'Dadi Base Tratto' : 'Forza Antagonista')}</div>
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:3px;">
                            <span style="font-size:18px; font-weight:900; color:#fcd34d;" id="s7-disp-strength">${strength}</span>
                            <div style="display:flex; gap:3px;">
                                <button type="button" class="s7-adj-str" data-delta="-1" style="display:inline-flex; align-items:center; justify-content:center; padding:0; line-height:1; font-size:11px; background:#1f2937; color:#fca5a5; border:1px solid #4b5563; border-radius:4px; width:22px; height:22px; font-weight:bold; cursor:pointer;" title="Riduci Forza di 1">-1</button>
                                <button type="button" class="s7-adj-str" data-delta="1" style="display:inline-flex; align-items:center; justify-content:center; padding:0; line-height:1; font-size:11px; background:#1f2937; color:#86efac; border:1px solid #4b5563; border-radius:4px; width:22px; height:22px; font-weight:bold; cursor:pointer;" title="Aumenta Forza di 1">+1</button>
                            </div>
                        </div>
                        <div style="font-size:10px; color:#9ca3af; margin-top:2px;">${isBrute ? 'Infligge ' + strength + ' Ferite a fine round' : (isNpc ? 'Dadi base dal tratto più alto' : 'Dadi base di Forza')}</div>
                    </div>

                    ${isVillain ? `
                    <div style="background:#141720; border:1px solid #374151; border-left:3px solid #a855f7; border-radius:6px; padding:8px 10px;">
                        <div style="font-size:10px; color:#9ca3af; text-transform:uppercase; font-weight:bold;">👑 Influenza & Grado</div>
                        <div style="font-size:15px; font-weight:900; color:#d8b4fe; margin-top:3px;">Influenza ${influence}</div>
                        <div style="font-size:15px; font-weight:900; color:#c084fc; margin-top:2px;">Grado: ${villainyRank}</div>
                        <div style="font-size:10.5px; color:#fcd34d; font-weight:bold; margin-top:3px;">Riserva: ${villainyRank} d10</div>
                    </div>
                    ` : ''}

                    <div style="background:#141720; border:1px solid #374151; border-left:3px solid #ef4444; border-radius:6px; padding:8px 10px;">
                        <div style="font-size:10px; color:#9ca3af; text-transform:uppercase; font-weight:bold;">🩸 Salute sul Token</div>
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:3px; gap:4px;">
                            <span style="font-size:16px; font-weight:900; color:#f87171;" id="s7-disp-hp">${hpVal}/${hpMaxVal} ${isBrute ? 'PV' : 'PV'}</span>
                            <div style="display:flex; gap:3px;">
                                <button type="button" class="s7-adj-hp" data-delta="-1" style="display:inline-flex; align-items:center; justify-content:center; padding:0; line-height:1; font-size:11px; background:#1f2937; color:#fca5a5; border:1px solid #4b5563; border-radius:4px; width:22px; height:22px; font-weight:bold; cursor:pointer;" title="Riduci Salute / Infliggi 1 Ferita">-1</button>
                                <button type="button" class="s7-adj-hp" data-delta="1" style="display:inline-flex; align-items:center; justify-content:center; padding:0; line-height:1; font-size:11px; background:#1f2937; color:#86efac; border:1px solid #4b5563; border-radius:4px; width:22px; height:22px; font-weight:bold; cursor:pointer;" title="Aumenta Salute / Cura 1 Ferita">+1</button>
                            </div>
                        </div>
                        <div style="font-size:10px; color:#9ca3af; margin-top:2px;">${isBrute ? '1 Incremento = -1 Forza/PV' : `Ferite: ${woundsTaken}/${hpMaxVal} (${Math.max(1, Math.round(hpMaxVal / 5))} FD)`}</div>
                    </div>
                </div>

                <!-- ROLLER RISCHIO ANTAGONISTA INTEGRATO -->
                <div style="background:#141824; border:1px solid #d4af37; border-radius:8px; padding:9px 11px;">
                    <!-- FINESTRINA DADI BONUS NEMICI (SOLO GM) -->
                    <div id="s7-ant-gm-enemy-bonus-container"></div>

                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="font-size:15px;">🎲</span>
                            <strong style="color:#fcd34d; font-size:12px;">Riserva di Rischio (d10):</strong>
                            <input type="number" id="s7-ant-dice-pool" value="${villainyRank}" min="1" max="40" style="width:46px; background:#0b0d13; color:#fcd34d; border:1px solid #d4af37; border-radius:4px; padding:3px; text-align:center; font-weight:900; font-size:12.5px;">
                            <span style="font-size:11px; color:#9ca3af;">d10</span>
                            ${(window.seventhSeaInitiative && typeof window.seventhSeaInitiative.spendDangerPoint === 'function') ? `<button type="button" id="s7-btn-ant-danger-dice" title="Il Master spende 1 Punto Pericolo: +2 dadi a questo tiro del Malvagio (ripetibile, p. 176)" style="background:#7f1d1d; color:#fff; border:none; border-radius:4px; padding:3px 7px; font-size:11px; font-weight:bold; cursor:pointer;">☠️ +2 dadi</button><span id="s7-ant-danger-badge" style="font-size:11px; color:#fca5a5; font-weight:bold;"></span>` : ''}
                        </div>
                        <div style="display:flex; align-items:center; gap:8px; font-size:11px;">
                            <label style="display:flex; align-items:center; gap:3px; cursor:pointer; color:#fca5a5;" title="I 10 tirati esplodono aggiungendo un altro d10">
                                <input type="checkbox" id="s7-ant-explode"> 💥 10 Espl.
                            </label>
                            <label style="display:flex; align-items:center; gap:3px; cursor:pointer; color:#93c5fd;" title="Le combinazioni a somma 15 valgono 2 Incrementi">
                                <input type="checkbox" id="s7-ant-sets15"> ⚡ 15=2 Incr.
                            </label>
                            <button type="button" id="s7-btn-exec-ant-roll" style="background:linear-gradient(to right, #f59e0b, #d97706); color:#111; font-weight:900; border:none; border-radius:5px; padding:5px 11px; font-size:11.5px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.4);">Lancia Rischio 🎲</button>
                        </div>
                    </div>
                    <div id="s7-antagonist-roll-results" style="display:none;"></div>
                </div>

                <!-- COMPETENZE, DESCRITTORI E CAPACITÀ SPECIALE -->
                <div style="background:#141720; border:1px solid #2e3646; border-radius:8px; padding:10px 12px; display:flex; flex-direction:column; gap:8px;">
                    <div>
                        <div style="font-size:11px; font-weight:bold; color:#fcd34d; text-transform:uppercase; border-bottom:1px solid #2e3646; padding-bottom:3px; margin-bottom:4px;">🎯 Tratti, Competenze & Descrittori</div>
                        <div style="font-size:12px; color:#e5e7eb; line-height:1.4;">${escapeHtml(traits)}</div>
                    </div>
                    <div>
                        <div style="font-size:11px; font-weight:bold; color:#34d399; text-transform:uppercase; border-bottom:1px solid #2e3646; padding-bottom:3px; margin-bottom:4px;">⚡ Capacità Speciale di Scena / Qualità / Vantaggi</div>
                        <div style="font-size:12px; color:#d1fae5; line-height:1.45; white-space:pre-line;">${escapeHtml(ability)}</div>
                    </div>
                    ${notes ? `
                    <div>
                        <div style="font-size:11px; font-weight:bold; color:#93c5fd; text-transform:uppercase; border-bottom:1px solid #2e3646; padding-bottom:3px; margin-bottom:4px;">📓 Trama & Note del Master</div>
                        <div style="font-size:11.5px; color:#cbd5e1; line-height:1.4; white-space:pre-line;">${escapeHtml(notes)}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Bind Avatar upload
        const avatarWrapper = document.getElementById('statblock-avatar-wrapper');
        const avatarInput = document.getElementById('statblock-avatar-file-input');
        if (avatarWrapper && avatarInput && compendiumInstance) {
            avatarWrapper.onclick = () => avatarInput.click();
            avatarInput.onchange = (e) => {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        compendiumInstance.setMonsterTokenImage(ev.target.result);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            };
        }

        // Bind Edit button
        const editBtn = document.getElementById('s7-btn-edit-current');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                openCustomEditor(m.name, m);
            });
        }

        // Bind Cambia Antagonista (sblocca le tendine catalogo quando la scheda è fissata su un token)
        const unlockBtn = document.getElementById('s7-btn-unlock-catalog');
        if (unlockBtn) {
            unlockBtn.addEventListener('click', () => {
                s7CatalogUnlocked = true;
                applyS7TokenLockMode(false);
                unlockBtn.style.display = 'none';
            });
        }

        // Bind +/- Forza
        details.querySelectorAll('.s7-adj-str').forEach(btn => {
            btn.addEventListener('click', () => {
                const delta = parseInt(btn.getAttribute('data-delta'), 10) || 0;
                const newStr = Math.max(0, strength + delta);
                m.s7Strength = newStr;
                if (isBrute) {
                    m.hit_points = newStr;
                }
                m.s7VillainyRank = isVillain ? (newStr + influence) : newStr;
                m.challenge_rating = `Forza ${newStr}`;
                // Squadra di Sgherri aperta da un token in mappa: la Forza mostrata nel tracker è quella del token (PV),
                // quindi +/− Forza aggiorna anche i PV di quel token (prima restavano al valore vecchio)
                if (isBrute) syncBruteStrengthToToken(m, newStr);
                if (compendiumInstance) {
                    compendiumInstance.loadMonster(m);
                }
            });
        });

        // Bind +/- Salute sul Token (aggiorna in tempo reale la barra sul token per Sgherri, Malvagi e Mostri)
        details.querySelectorAll('.s7-adj-hp').forEach(btn => {
            btn.addEventListener('click', () => {
                const delta = parseInt(btn.getAttribute('data-delta'), 10) || 0;
                const newHp = Math.max(0, hpVal + delta);
                m.hit_points = newHp;
                if (isBrute) {
                    m.s7Strength = newHp;
                    m.s7VillainyRank = newHp;
                    m.challenge_rating = `Forza ${newHp}`;
                    syncBruteStrengthToToken(m, newHp);
                } else {
                    syncAntagonistHpToToken(m, newHp);
                }
                if (compendiumInstance) {
                    compendiumInstance.loadMonster(m);
                }
            });
        });

        // +2 dadi pagati con la Riserva di Pericolo (solo console del Master): valgono per il prossimo tiro
        antDangerDice = 0;
        const dangerBtn = document.getElementById('s7-btn-ant-danger-dice');
        const dangerBadge = () => { const b = document.getElementById('s7-ant-danger-badge'); if (b) b.textContent = antDangerDice ? `+${antDangerDice} dadi Pericolo` : ''; };
        if (dangerBtn) {
            dangerBtn.addEventListener('click', () => {
                if (!window.seventhSeaInitiative.spendDangerPoint(`+2 dadi a ${m.name}`)) return;
                antDangerDice += 2;
                dangerBadge();
            });
        }

        // Bind Roll Risk button
        const execRollBtn = document.getElementById('s7-btn-exec-ant-roll');
        if (execRollBtn) {
            execRollBtn.addEventListener('click', () => {
                const poolInp = document.getElementById('s7-ant-dice-pool');
                const expInp = document.getElementById('s7-ant-explode');
                const s15Inp = document.getElementById('s7-ant-sets15');
                const poolVal = poolInp ? (parseInt(poolInp.value) || 6) : villainyRank;
                const targetName = activeAntagonistTarget ? activeAntagonistTarget.name : null;
                const targetBonus = activeAntagonistTarget ? activeAntagonistTarget.bonus : 0;
                const originalPool = activeAntagonistTarget ? activeAntagonistTarget.originalPool : null;

                rollAntagonistPool(m.name, poolVal + antDangerDice, expInp?.checked, s15Inp?.checked, targetName, targetBonus);
                antDangerDice = 0;
                dangerBadge();

                // Auto-reset del pool e del target subito dopo il lancio
                if (activeAntagonistTarget && poolInp && originalPool !== null) {
                    poolInp.value = originalPool;
                }
                activeAntagonistTarget = null;
                renderAntagonistEnemyBonusWidget();
            });
        }

        // Tasto per caricare l'Eroe ufficiale direttamente nella Scheda Personaggio (PG)
        const loadPcBtn = document.getElementById('s7-btn-load-as-pc');
        if (loadPcBtn && m.pcData) {
            loadPcBtn.addEventListener('click', () => {
                if (window.seventhSeaSheetManager && typeof window.seventhSeaSheetManager.loadHeroData === 'function') {
                    window.seventhSeaSheetManager.loadHeroData(m.pcData);
                }
            });
        }

        // Renderizza la finestrina dadi bonus nemici (solo per GM)
        renderAntagonistEnemyBonusWidget();
        syncSelectorsWithActive(m.id || m.name);
    }

    // Editor / Costruttore interattivo per creare o personalizzare qualsiasi Antagonista 7th Sea
    function openCustomEditor(defaultName = '', existing = null) {
        activeS7RenderedEntry = null;
        const placeholder = document.getElementById('statblock-placeholder');
        const details = document.getElementById('statblock-details');
        if (!details) return;
        if (placeholder) placeholder.style.display = 'none';
        details.style.display = 'block';

        const initName = existing ? existing.name : (defaultName || 'Nuovo Antagonista di Théah');
        const initCat = existing ? (existing.s7Category || 'brute') : 'brute';
        const initNation = existing ? (existing.s7Nation || 'Théah') : 'Théah';
        const initSize = existing ? (existing.size || 'Media') : 'Media';
        const initStr = existing ? (existing.s7Strength || 6) : 6;
        const initInf = existing ? (existing.s7Influence || 0) : 0;
        const initHp = existing ? (existing.hit_points || initStr) : initStr;
        const initTraits = existing ? (existing.s7Traits || 'Mischia, Intimidire, Atletica') : 'Mischia, Intimidire, Atletica';
        const initAbility = existing ? (existing.s7Ability || 'A fine round infligge Ferite pari alla sua Forza attuale.') : 'A fine round infligge Ferite pari alla sua Forza attuale. Ogni Incremento speso riduce la Forza di 1.';
        const initNotes = existing ? (existing.s7Notes || '') : '';

        details.innerHTML = `
            <div style="font-family:'Segoe UI', sans-serif; color:#e5e7eb; background:#141722; border:1px solid #d4af37; border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #374151; padding-bottom:6px;">
                    <strong style="color:#fcd34d; font-size:14px;">🛠️ Crea / Personalizza Scheda Antagonista 7th Sea</strong>
                    <span style="font-size:10px; background:#3e2723; color:#ffd54f; padding:2px 6px; border-radius:4px; border:1px solid #d4af37;">Regole 2ª Edizione</span>
                </div>

                <div style="display:grid; grid-template-columns:1.4fr 1fr; gap:8px;">
                    <div>
                        <label style="display:block; font-size:11px; color:#9ca3af; font-weight:bold; margin-bottom:3px;">Nome Antagonista / Squadra:</label>
                        <input type="text" id="s7-ed-name" value="${escapeHtml(initName)}" placeholder="Es. Spadaccini del Cardinale, Capitano Reis..." style="width:100%; background:#0b0d13; color:#fff; border:1px solid #4b5563; border-radius:5px; padding:6px 8px; font-size:12px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:11px; color:#9ca3af; font-weight:bold; margin-bottom:3px;">Categoria Antagonista:</label>
                        <select id="s7-ed-category" style="width:100%; background:#0b0d13; color:#fcd34d; border:1px solid #d4af37; border-radius:5px; padding:6px 8px; font-size:12px; font-weight:bold; box-sizing:border-box;">
                            <option value="brute" ${initCat === 'brute' ? 'selected' : ''}>⚔️ Squadra di Sgherri (Forza = PV)</option>
                            <option value="villain" ${initCat === 'villain' ? 'selected' : ''}>👑 Malvagio (Villain)</option>
                            <option value="monster" ${initCat === 'monster' ? 'selected' : ''}>🐙 Mostro di Théah / Syrneth</option>
                            <option value="npc" ${initCat === 'npc' ? 'selected' : ''}>👥 PNG / Eroe Alleato</option>
                        </select>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
                    <div>
                        <label style="display:block; font-size:11px; color:#9ca3af; font-weight:bold; margin-bottom:3px;">Nazione / Origine:</label>
                        <select id="s7-ed-nation" style="width:100%; background:#0b0d13; color:#e5e7eb; border:1px solid #4b5563; border-radius:5px; padding:5px; font-size:11.5px; box-sizing:border-box;">
                            ${['Théah', 'Avalon', 'Castille', 'Eisen', 'Highland Marches', 'Inismore', 'Montaigne', 'Sarmatia', 'Ussura', 'Vestenmennavenjar', 'Vodacce', 'Fratellanza della Costa', 'Rovine Syrneth'].map(n => `<option value="${n}" ${initNation === n ? 'selected' : ''}>${n}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="display:block; font-size:11px; color:#fcd34d; font-weight:bold; margin-bottom:3px;">⚔️ Forza (Dadi):</label>
                        <input type="number" id="s7-ed-strength" value="${initStr}" min="1" max="30" style="width:100%; background:#0b0d13; color:#fcd34d; border:1px solid #d4af37; border-radius:5px; padding:5px; font-size:12px; font-weight:bold; text-align:center; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:11px; color:#d8b4fe; font-weight:bold; margin-bottom:3px;">👑 Influenza:</label>
                        <input type="number" id="s7-ed-influence" value="${initInf}" min="0" max="20" style="width:100%; background:#0b0d13; color:#d8b4fe; border:1px solid #4b5563; border-radius:5px; padding:5px; font-size:12px; font-weight:bold; text-align:center; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:11px; color:#f87171; font-weight:bold; margin-bottom:3px;">🩸 Salute (PV Token):</label>
                        <input type="number" id="s7-ed-hp" value="${initHp}" min="1" max="200" style="width:100%; background:#0b0d13; color:#f87171; border:1px solid #ef4444; border-radius:5px; padding:5px; font-size:12px; font-weight:bold; text-align:center; box-sizing:border-box;">
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1.6fr; gap:8px;">
                    <div>
                        <label style="display:block; font-size:11px; color:#9ca3af; font-weight:bold; margin-bottom:3px;">Taglia Token:</label>
                        <select id="s7-ed-size" style="width:100%; background:#0b0d13; color:#e5e7eb; border:1px solid #4b5563; border-radius:5px; padding:5px; font-size:11.5px; box-sizing:border-box;">
                            <option value="Media" ${initSize === 'Media' ? 'selected' : ''}>Media (1x1)</option>
                            <option value="Grande" ${initSize === 'Grande' ? 'selected' : ''}>Grande (2x2)</option>
                            <option value="Enorme" ${initSize === 'Enorme' ? 'selected' : ''}>Enorme (3x3)</option>
                            <option value="Mastodontica" ${initSize === 'Mastodontica' ? 'selected' : ''}>Mastodontica (4x4)</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; font-size:11px; color:#34d399; font-weight:bold; margin-bottom:3px;">⚡ Archetipo Rapido (Opzionale, auto-compila):</label>
                        <select id="s7-ed-preset" style="width:100%; background:#0b0d13; color:#6ee7b7; border:1px solid #10b981; border-radius:5px; padding:5px; font-size:11.5px; box-sizing:border-box;">
                            <option value="">-- Scrittura Libera Personalizzata --</option>
                            <optgroup label="Archetipi Squadre di Sgherri">
                                <option value="pirati">🏴‍☠️ Pirati / Corsari (Abbordaggio)</option>
                                <option value="guardie">🛡️ Guardie / Soldati (Falange)</option>
                                <option value="assassini">🗡️ Assassini / Sicari (Veleno)</option>
                                <option value="tiratori">🔫 Moschettieri / Tiratori (Fuoco di Fila)</option>
                                <option value="duellanti">🤺 Duellanti (Parata di Squadra)</option>
                                <option value="bruti">👊 Bruti / Malviventi (Accerchiamento)</option>
                            </optgroup>
                            <optgroup label="Archetipi Malvagi & Mostri">
                                <option value="malvagio_duellante">👑 Malvagio: Maestro Duellante</option>
                                <option value="malvagio_stregone">👑 Malvagio: Stregone Occulto</option>
                                <option value="mostro_paura">🐙 Mostro: Paura Primordiale & Artigli</option>
                                <option value="mostro_corazza">🐙 Mostro: Pelle Corazzata</option>
                                <option value="mostro_rigenerazione">🐙 Mostro: Rigenerazione</option>
                                <option value="mostro_tentacoli">🐙 Mostro: Tentacoli Colossali</option>
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div>
                    <label style="display:block; font-size:11px; color:#fcd34d; font-weight:bold; margin-bottom:3px;">🎯 Tratti, Competenze & Descrittori (Testo Libero):</label>
                    <input type="text" id="s7-ed-traits" value="${escapeHtml(initTraits)}" placeholder="Es. Mischia, Intimidire, Navigazione oppure Vigore 4, Grazia 5..." style="width:100%; background:#0b0d13; color:#fff; border:1px solid #4b5563; border-radius:5px; padding:6px 8px; font-size:12px; box-sizing:border-box;">
                </div>

                <div>
                    <label style="display:block; font-size:11px; color:#34d399; font-weight:bold; margin-bottom:3px;">⚡ Capacità Speciale di Scena / Manovre / Qualità Mostruose (Testo Libero):</label>
                    <textarea id="s7-ed-ability" rows="3" placeholder="Descrivi le capacità speciali, manovre o qualità mostruose..." style="width:100%; background:#0b0d13; color:#fff; border:1px solid #4b5563; border-radius:5px; padding:6px 8px; font-size:12px; box-sizing:border-box; resize:vertical;">${escapeHtml(initAbility)}</textarea>
                </div>

                <div>
                    <label style="display:block; font-size:11px; color:#93c5fd; font-weight:bold; margin-bottom:3px;">📓 Trama / Note Segrete del Master (Opzionale):</label>
                    <input type="text" id="s7-ed-notes" value="${escapeHtml(initNotes)}" placeholder="Obiettivo nella scena, segreti o ricompensa..." style="width:100%; background:#0b0d13; color:#cbd5e1; border:1px solid #4b5563; border-radius:5px; padding:6px 8px; font-size:11.5px; box-sizing:border-box;">
                </div>

                <div style="display:flex; justify-content:flex-end; gap:8px; padding-top:4px; border-top:1px solid #2e3646;">
                    <button type="button" id="s7-ed-save-btn" style="background:linear-gradient(to right, #10b981, #059669); color:#111; font-weight:900; border:none; border-radius:6px; padding:7px 16px; font-size:12px; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.5);">✅ Conferma & Usa Scheda Antagonista</button>
                </div>
            </div>
        `;

        const catSel = document.getElementById('s7-ed-category');
        const strInp = document.getElementById('s7-ed-strength');
        const hpInp = document.getElementById('s7-ed-hp');
        const presetSel = document.getElementById('s7-ed-preset');
        const traitsInp = document.getElementById('s7-ed-traits');
        const abilityInp = document.getElementById('s7-ed-ability');

        // Auto-sync PV = Forza quando è Squadra di Sgherri
        const syncHpIfBrute = () => {
            if (catSel && catSel.value === 'brute' && strInp && hpInp) {
                hpInp.value = strInp.value;
            } else if (catSel && (catSel.value === 'villain' || catSel.value === 'monster') && hpInp) {
                if (parseInt(hpInp.value) < 15) hpInp.value = 20;
            }
        };
        if (catSel) catSel.addEventListener('change', syncHpIfBrute);
        if (strInp) strInp.addEventListener('input', () => {
            if (catSel && catSel.value === 'brute' && hpInp) {
                hpInp.value = strInp.value;
            }
        });

        if (presetSel) {
            presetSel.addEventListener('change', () => {
                const p = OFFICIAL_PRESET_ABILITIES[presetSel.value];
                if (p && p.ability) {
                    if (traitsInp) traitsInp.value = p.traits;
                    if (abilityInp) abilityInp.value = p.ability;
                }
            });
        }

        const saveBtn = document.getElementById('s7-ed-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const nameVal = (document.getElementById('s7-ed-name')?.value || '').trim() || 'Antagonista Personalizzato';
                const catVal = document.getElementById('s7-ed-category')?.value || 'brute';
                const natVal = document.getElementById('s7-ed-nation')?.value || 'Théah';
                const sizeVal = document.getElementById('s7-ed-size')?.value || 'Media';
                const strVal = Math.max(1, parseInt(document.getElementById('s7-ed-strength')?.value) || 6);
                const infVal = Math.max(0, parseInt(document.getElementById('s7-ed-influence')?.value) || 0);
                const hpVal = Math.max(1, parseInt(document.getElementById('s7-ed-hp')?.value) || strVal);
                const trVal = (document.getElementById('s7-ed-traits')?.value || '').trim();
                const abVal = (document.getElementById('s7-ed-ability')?.value || '').trim();
                const noVal = (document.getElementById('s7-ed-notes')?.value || '').trim();

                const customObj = {
                    id: (existing && existing.id) ? existing.id : ('s7_custom_' + Date.now()),
                    name: nameVal,
                    category: catVal,
                    type: catVal === 'villain' ? 'Malvagio (Villain)' : (catVal === 'monster' ? 'Mostro di Théah' : (catVal === 'npc' ? 'PNG / Eroe Alleato' : 'Squadra di Sgherri (Brute Squad)')),
                    nation: natVal,
                    size: sizeVal,
                    strength: strVal,
                    influence: infVal,
                    villainyRank: catVal === 'villain' ? (strVal + infVal) : strVal,
                    hp: hpVal,
                    traits: trVal,
                    ability: abVal,
                    notes: noVal,
                    tokenSrc: existing ? existing.tokenSrc : undefined
                };

                const existingIdx = customAntagonists.findIndex(x => x.id === customObj.id || x.name.toLowerCase() === customObj.name.toLowerCase());
                if (existingIdx >= 0) customAntagonists[existingIdx] = customObj;
                else customAntagonists.unshift(customObj);

                refreshAntagonistSelectOptions(customObj.id);

                const sb = convertAntagonistToStatblock(customObj);
                if (window.compendium && typeof window.compendium.loadMonster === 'function') {
                    window.compendium.loadMonster(sb);
                }
            });
        }
    }

    if (typeof window !== 'undefined') {
        window.seventhSeaCompendium = {
            convertAntagonistToStatblock,
            cleanS7TokenName,
            ensureHeroesLoaded,
            ensureVillainsLoaded,
            resolveFullAntagonist,
            loadHeroDetail,
            loadVillainDetail,
            assignHeroToSelectedToken,
            spawnHeroToken,
            injectS7AntagonistBar,
            syncCompendiumSystemUI,
            renderSeventhSeaStatblock,
            openCustomEditor,
            toggleAntagonistTarget,
            cancelAntagonistTarget,
            refreshEnemyBonusWidget: renderAntagonistEnemyBonusWidget,
            isGMClient
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                injectS7AntagonistBar();
                syncCompendiumSystemUI();
            });
        } else {
            injectS7AntagonistBar();
            syncCompendiumSystemUI();
        }
    }
})();
