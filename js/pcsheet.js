// js/pcsheet.js
// Gestione ultra-leggera Scheda Personaggio (PG) a schede (Tab) per DM e Giocatori
// Progettata per ZERO impatto su CPU/RAM/Rete quando lasciata aperta (Event Delegation pura, nessun timer/polling)

(function () {
    let currentTokenId = null;
    let currentTab = 'combat'; // 'combat' | 'spells' | 'features' | 'inventory'
    let rollMode = 'normal';   // 'normal' | 'adv' | 'dis'
    let spellFilter = 'all';   // 'all' | 'prepared'
    let awaitingClipboardSync = false;
    let expandedSpells = new Set();
    let expandedFeatures = new Set();

    const ABILITY_META = [
        { id: 1, key: 'str', sub: 'strength', labelIt: 'FOR', labelEn: 'STR', fullIt: 'Forza', fullEn: 'Strength' },
        { id: 2, key: 'dex', sub: 'dexterity', labelIt: 'DES', labelEn: 'DEX', fullIt: 'Destrezza', fullEn: 'Dexterity' },
        { id: 3, key: 'con', sub: 'constitution', labelIt: 'COS', labelEn: 'CON', fullIt: 'Costituzione', fullEn: 'Constitution' },
        { id: 4, key: 'int', sub: 'intelligence', labelIt: 'INT', labelEn: 'INT', fullIt: 'Intelligenza', fullEn: 'Intelligence' },
        { id: 5, key: 'wis', sub: 'wisdom', labelIt: 'SAG', labelEn: 'WIS', fullIt: 'Saggezza', fullEn: 'Wisdom' },
        { id: 6, key: 'cha', sub: 'charisma', labelIt: 'CAR', labelEn: 'CHA', fullIt: 'Carisma', fullEn: 'Charisma' }
    ];

    const SKILLS_META = [
        { sub: 'acrobatics', ab: 'dex', it: 'Acrobazia', en: 'Acrobatics' },
        { sub: 'animal-handling', ab: 'wis', it: 'Addestrare Animali', en: 'Animal Handling' },
        { sub: 'arcana', ab: 'int', it: 'Arcano', en: 'Arcana' },
        { sub: 'athletics', ab: 'str', it: 'Atletica', en: 'Athletics' },
        { sub: 'stealth', ab: 'dex', it: 'Furtività', en: 'Stealth' },
        { sub: 'history', ab: 'int', it: 'Storia', en: 'History' },
        { sub: 'deception', ab: 'cha', it: 'Inganno', en: 'Deception' },
        { sub: 'intimidation', ab: 'cha', it: 'Intimidire', en: 'Intimidation' },
        { sub: 'investigation', ab: 'int', it: 'Indagare', en: 'Investigation' },
        { sub: 'insight', ab: 'wis', it: 'Intuizione', en: 'Insight' },
        { sub: 'medicine', ab: 'wis', it: 'Medicina', en: 'Medicine' },
        { sub: 'nature', ab: 'int', it: 'Natura', en: 'Nature' },
        { sub: 'perception', ab: 'wis', it: 'Percezione', en: 'Perception' },
        { sub: 'performance', ab: 'cha', it: 'Intrattenere', en: 'Performance' },
        { sub: 'persuasion', ab: 'cha', it: 'Persuasione', en: 'Persuasion' },
        { sub: 'sleight-of-hand', ab: 'dex', it: 'Rapidità di Mano', en: 'Sleight of Hand' },
        { sub: 'religion', ab: 'int', it: 'Religione', en: 'Religion' },
        { sub: 'survival', ab: 'wis', it: 'Sopravvivenza', en: 'Survival' }
    ];

    const MULTICLASS_SLOTS_TABLE = [
        [],
        [2],
        [3],
        [4, 2],
        [4, 3],
        [4, 3, 2],
        [4, 3, 3],
        [4, 3, 3, 1],
        [4, 3, 3, 2],
        [4, 3, 3, 3, 1],
        [4, 3, 3, 3, 2],
        [4, 3, 3, 3, 2, 1],
        [4, 3, 3, 3, 2, 1],
        [4, 3, 3, 3, 2, 1, 1],
        [4, 3, 3, 3, 2, 1, 1],
        [4, 3, 3, 3, 2, 1, 1, 1],
        [4, 3, 3, 3, 2, 1, 1, 1],
        [4, 3, 3, 3, 2, 1, 1, 1, 1],
        [4, 3, 3, 3, 3, 1, 1, 1, 1],
        [4, 3, 3, 3, 3, 2, 1, 1, 1],
        [4, 3, 3, 3, 3, 2, 2, 1, 1]
    ];

    function esc(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/[&<>'"]/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[c] || c));
    }

    function stripHtml(html, maxLen = 0) {
        if (!html) return '';
        let txt = String(html)
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/li>/gi, '\n')
            .replace(/<li>/gi, '• ')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&rsquo;|&lsquo;|&#39;/g, "'")
            .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
            .replace(/&mdash;|&ndash;/g, '-')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        if (maxLen > 0 && txt.length > maxLen) {
            txt = txt.substring(0, maxLen).trim() + '...';
        }
        return txt;
    }

    function fmtMod(n) {
        const num = parseInt(n) || 0;
        return num >= 0 ? `+${num}` : `${num}`;
    }

    function isEng() {
        return (typeof localStorage !== 'undefined' && localStorage.getItem('vtt_lang') === 'en');
    }

    function tr(itText, enText) {
        return isEng() ? enText : itText;
    }

    function getEngineRef() {
        return (typeof engine !== 'undefined' && engine) ? engine : window.engine;
    }

    function getNetworkRef() {
        return (typeof network !== 'undefined' && network) ? network : window.network;
    }

    function isDMView() {
        const eng = getEngineRef();
        return !!(eng && eng.isDM);
    }

    function getActiveToken() {
        const eng = getEngineRef();
        if (!eng || !Array.isArray(eng.tokens)) return null;
        if (currentTokenId) {
            const found = eng.tokens.find(t => t.id === currentTokenId);
            if (found) return found;
        }
        if (eng.selectedTokenId) {
            return eng.tokens.find(t => t.id === eng.selectedTokenId) || null;
        }
        return null;
    }

    // Estrae l'ID numerico da un URL o stringa (es. "https://.../characters/165409901" -> "165409901")
    function extractCharacterId(input) {
        if (!input || typeof input !== 'string') return '';
        const trimmed = input.trim();
        if (/^\d{5,15}$/.test(trimmed)) return trimmed;
        const m = trimmed.match(/\/characters\/(\d+)/i) || trimmed.match(/\/character\/v\d+\/character\/(\d+)/i) || trimmed.match(/(\d{6,15})/);
        return m ? m[1] : '';
    }

    function buildCharacterDataEndpoint(charId) {
        if (!charId) return '';
        const host = ['character-service', 'dndbeyond', 'com'].join('.');
        return `https://${host}/character/v5/character/${charId}`;
    }

    // =========================================================================
    // PARSER COMPATTO SCHEDA PG (~380 KB JSON grezzo -> ~6 KB oggetto pcSheet)
    // =========================================================================
    function parseCharacterSheetJSON(rawInput, sourceUrl = '', prevSheet = null) {
        let obj = typeof rawInput === 'string' ? JSON.parse(rawInput) : rawInput;
        if (!obj || typeof obj !== 'object') throw new Error('JSON non valido');

        // Se è già un oggetto pcSheet compatto del nostro VTT
        if (obj._vttPcSheet && obj.abilities && obj.skills) {
            obj.updatedAt = Date.now();
            if (sourceUrl) obj.sourceUrl = sourceUrl;
            return obj;
        }

        const d = (obj.data && typeof obj.data === 'object' && (obj.data.stats || obj.data.classes)) ? obj.data : obj;
        if (!d || (!d.stats && !d.classes && !d.name)) {
            throw new Error('Struttura dati scheda non riconosciuta');
        }

        const externalId = String(d.id || extractCharacterId(sourceUrl) || '');
        const cleanSourceUrl = sourceUrl || d.readonlyUrl || externalId;

        // 1. Classi e Livello Totale
        const classesList = Array.isArray(d.classes) ? d.classes : [];
        let totalLevel = 0;
        const classStrings = [];
        let primarySpellAbilityId = null;
        let casterLevelSum = 0;

        classesList.forEach(c => {
            const lvl = parseInt(c.level) || 1;
            totalLevel += lvl;
            const cName = c.definition?.name || 'Avventuriero';
            const subName = c.subclassDefinition?.name ? ` (${c.subclassDefinition.name})` : '';
            classStrings.push(`${cName}${subName} ${lvl}`);

            const spellAbId = c.definition?.spellCastingAbilityId || c.subclassDefinition?.spellCastingAbilityId;
            if (spellAbId && !primarySpellAbilityId) primarySpellAbilityId = spellAbId;

            if (c.definition?.canCastSpells || c.subclassDefinition?.canCastSpells) {
                const div = c.definition?.spellRules?.multiClassSpellSlotDivisor || c.subclassDefinition?.spellRules?.multiClassSpellSlotDivisor || 1;
                if (div === 1) casterLevelSum += lvl;
                else if (div === 2) casterLevelSum += Math.floor(lvl / 2);
                else if (div === 3) casterLevelSum += Math.floor(lvl / 3);
            }
        });
        if (totalLevel <= 0) totalLevel = 1;
        const profBonus = Math.ceil(totalLevel / 4) + 1;

        // Raccogli tutti i modificatori attivi (filtrando oggetti non equipaggiati/non sintonizzati)
        const equippedItemIds = new Set();
        const attunedItemIds = new Set();
        (d.inventory || []).forEach(it => {
            if (!it || !it.definition) return;
            if (it.equipped) equippedItemIds.add(it.definition.id);
            if (it.isAttuned) attunedItemIds.add(it.definition.id);
        });

        const allMods = [];
        const modGroups = d.modifiers || {};
        for (const [groupKey, arr] of Object.entries(modGroups)) {
            if (!Array.isArray(arr)) continue;
            arr.forEach(m => {
                if (!m) return;
                if (groupKey === 'item' && m.componentId) {
                    if (!equippedItemIds.has(m.componentId)) return;
                    if (m.requiresAttunement && !attunedItemIds.has(m.componentId)) return;
                }
                allMods.push({ ...m, _group: groupKey });
            });
        }

        // Helper per estrarre Nomi Personalizzati (typeId: 8) e Note/Descrizioni Personalizzate (typeId: 9)
        const cvList = Array.isArray(d.characterValues) ? d.characterValues : [];
        const getCustomName = (id, defId = null) => {
            if (!id && !defId) return null;
            const cv = cvList.find(x => x.typeId === 8 && (String(x.valueId) === String(id) || (defId && String(x.valueId) === String(defId))));
            return (cv && typeof cv.value === 'string' && cv.value.trim()) ? cv.value.trim() : null;
        };
        const getCustomNotes = (id, defId = null) => {
            if (!id && !defId) return null;
            const cv = cvList.find(x => x.typeId === 9 && (String(x.valueId) === String(id) || (defId && String(x.valueId) === String(defId))));
            return (cv && typeof cv.value === 'string' && cv.value.trim()) ? cv.value.trim() : null;
        };

        // 2. Calcolo Caratteristiche (STR, DEX, CON, INT, WIS, CHA)
        const abilities = {};
        ABILITY_META.forEach(meta => {
            const baseEntry = (d.stats || []).find(s => s.id === meta.id);
            const bonusEntry = (d.bonusStats || []).find(s => s.id === meta.id);
            const overrideEntry = (d.overrideStats || []).find(s => s.id === meta.id);

            let score = (baseEntry && baseEntry.value !== null ? parseInt(baseEntry.value) : 10)
                      + (bonusEntry && bonusEntry.value !== null ? parseInt(bonusEntry.value) : 0);

            let setFloor = null;
            allMods.forEach(m => {
                const val = m.value !== null && m.value !== undefined ? m.value : m.fixedValue;
                if (val === null || val === undefined) return;
                const isThisAbility = (m.subType === `${meta.sub}-score`) ||
                    (m.subType === 'choose-an-ability-score' && m.entityId === meta.id && m.entityTypeId === 1472902489);
                if (!isThisAbility) return;

                if (m.type === 'bonus') {
                    score += parseInt(val) || 0;
                } else if (m.type === 'set') {
                    const setVal = parseInt(val) || 0;
                    if (setFloor === null || setVal > setFloor) setFloor = setVal;
                }
            });

            if (setFloor !== null && setFloor > score) score = setFloor;
            if (overrideEntry && overrideEntry.value !== null && overrideEntry.value !== undefined) {
                score = parseInt(overrideEntry.value) || score;
            }

            const mod = Math.floor((score - 10) / 2);
            const baseVal = (baseEntry && baseEntry.value !== null ? parseInt(baseEntry.value) : 10);
            const bonusVal = (bonusEntry && bonusEntry.value !== null ? parseInt(bonusEntry.value) : 0);
            const fullLbl = isEng() ? meta.fullEn : meta.fullIt;
            let abParts = [`Base: ${baseVal}`];
            if (bonusVal) abParts.push(`Bonus: +${bonusVal}`);
            if (setFloor !== null && setFloor > (baseVal + bonusVal)) abParts.push(`Minimo: ${setFloor}`);
            if (overrideEntry && overrideEntry.value !== null) abParts.push(`Override: ${overrideEntry.value}`);
            const abBreakdown = `${fullLbl}: ${score} [${abParts.join(', ')}] ➔ Modificatore: ${fmtMod(mod)}`;
            abilities[meta.key] = { score, mod, breakdown: abBreakdown };
        });

        // 3. Tiri Salvezza
        let globalSaveBonus = 0;
        allMods.forEach(m => {
            const val = m.value ?? m.fixedValue;
            if (m.type === 'bonus' && m.subType === 'saving-throws' && val) {
                globalSaveBonus += parseInt(val) || 0;
            }
        });

        const saves = {};
        ABILITY_META.forEach(meta => {
            let prof = false;
            let saveBonus = 0;
            allMods.forEach(m => {
                if (m.subType === `${meta.sub}-saving-throws`) {
                    if (m.type === 'proficiency') prof = true;
                    if (m.type === 'bonus') saveBonus += parseInt(m.value ?? m.fixedValue) || 0;
                }
            });
            const total = abilities[meta.key].mod + (prof ? profBonus : 0) + globalSaveBonus + saveBonus;
            const fullLbl = isEng() ? meta.fullEn : meta.fullIt;
            const abShort = isEng() ? meta.labelEn : meta.labelIt;
            let svParts = [`Mod. ${abShort} (${fmtMod(abilities[meta.key].mod)})`];
            if (prof) svParts.push(`Competenza (${fmtMod(profBonus)})`);
            if (saveBonus) svParts.push(`Bonus (${fmtMod(saveBonus)})`);
            if (globalSaveBonus) svParts.push(`Bonus Globale (${fmtMod(globalSaveBonus)})`);
            const svBreakdown = `TS ${fullLbl}: ${svParts.join(' + ')} = ${fmtMod(total)}`;
            saves[meta.key] = { prof, bonus: total, breakdown: svBreakdown };
        });

        // 4. Abilità (18 Skills)
        let jackOfAllTrades = allMods.some(m => m.type === 'half-proficiency' && (m.subType === 'ability-checks' || m.subType === 'round-down'));
        const skills = {};
        SKILLS_META.forEach(sk => {
            let profLevel = 0; // 0 = no, 0.5 = half, 1 = prof, 2 = expertise
            let flatBonus = 0;
            let adv = false;

            allMods.forEach(m => {
                if (m.subType === sk.sub) {
                    if (m.type === 'expertise') profLevel = Math.max(profLevel, 2);
                    else if (m.type === 'proficiency') profLevel = Math.max(profLevel, 1);
                    else if (m.type === 'half-proficiency') profLevel = Math.max(profLevel, 0.5);
                    else if (m.type === 'bonus') flatBonus += parseInt(m.value ?? m.fixedValue) || 0;
                    else if (m.type === 'advantage') adv = true;
                }
            });
            if (profLevel === 0 && jackOfAllTrades) profLevel = 0.5;

            const abMod = abilities[sk.ab].mod;
            const profAdd = profLevel === 2 ? (profBonus * 2) : (profLevel === 1 ? profBonus : (profLevel === 0.5 ? Math.floor(profBonus / 2) : 0));
            const totalBonus = abMod + profAdd + flatBonus;
            const nameDisp = isEng() ? sk.en : sk.it;
            const abMeta = ABILITY_META.find(a => a.key === sk.ab);
            const abShort = isEng() ? abMeta.labelEn : abMeta.labelIt;
            let skParts = [`Mod. ${abShort} (${fmtMod(abMod)})`];
            if (profLevel === 2) skParts.push(`Maestria (${fmtMod(profBonus * 2)})`);
            else if (profLevel === 1) skParts.push(`Competenza (${fmtMod(profBonus)})`);
            else if (profLevel === 0.5) skParts.push(`Mezza Comp. (${fmtMod(Math.floor(profBonus / 2))})`);
            if (flatBonus) skParts.push(`Bonus (${fmtMod(flatBonus)})`);
            const skBreakdown = `${nameDisp}: ${skParts.join(' + ')} = ${fmtMod(totalBonus)}`;

            skills[sk.sub] = {
                ab: sk.ab,
                prof: profLevel,
                bonus: totalBonus,
                adv,
                breakdown: skBreakdown
            };
        });

        // Calcolo Punteggi Passivi Ufficiali (Percezione, Indagare, Intuizione)
        let passivePercBonus = 0;
        let passiveInvBonus = 0;
        let passiveInsBonus = 0;
        allMods.forEach(m => {
            const val = parseInt(m.value ?? m.fixedValue) || 0;
            if (m.type === 'bonus') {
                if (m.subType === 'passive-perception') passivePercBonus += val;
                if (m.subType === 'passive-investigation') passiveInvBonus += val;
                if (m.subType === 'passive-insight') passiveInsBonus += val;
            }
        });

        const percSkillBonus = skills['perception'] ? skills['perception'].bonus : abilities.wis.mod;
        const invSkillBonus = skills['investigation'] ? skills['investigation'].bonus : abilities.int.mod;
        const insSkillBonus = skills['insight'] ? skills['insight'].bonus : abilities.wis.mod;

        const passivePerceptionVal = 10 + percSkillBonus + passivePercBonus;
        const passiveInvestigationVal = 10 + invSkillBonus + passiveInvBonus;
        const passiveInsightVal = 10 + insSkillBonus + passiveInsBonus;

        const passives = {
            perception: {
                value: passivePerceptionVal,
                breakdown: `Percezione Passiva: 10 + Percezione (${fmtMod(percSkillBonus)})${passivePercBonus ? ' + Bonus (' + fmtMod(passivePercBonus) + ')' : ''} = ${passivePerceptionVal}`
            },
            investigation: {
                value: passiveInvestigationVal,
                breakdown: `Indagare Passivo: 10 + Indagare (${fmtMod(invSkillBonus)})${passiveInvBonus ? ' + Bonus (' + fmtMod(passiveInvBonus) + ')' : ''} = ${passiveInvestigationVal}`
            },
            insight: {
                value: passiveInsightVal,
                breakdown: `Intuizione Passiva: 10 + Intuizione (${fmtMod(insSkillBonus)})${passiveInsBonus ? ' + Bonus (' + fmtMod(passiveInsBonus) + ')' : ''} = ${passiveInsightVal}`
            }
        };

        const passivePerception = passivePerceptionVal;

        // 5. Punti Ferita (HP), Classe Armatura (CA), Velocità, Iniziativa
        let hpPerLevelBonus = 0;
        allMods.forEach(m => {
            if (m.type === 'bonus' && m.subType === 'hit-points-per-level') {
                hpPerLevelBonus += parseInt(m.value ?? m.fixedValue) || 0;
            }
        });
        const baseHp = parseInt(d.baseHitPoints) || 10;
        const bonusHp = parseInt(d.bonusHitPoints) || 0;
        const hpMax = d.overrideHitPoints
            ? parseInt(d.overrideHitPoints)
            : Math.max(1, baseHp + bonusHp + (totalLevel * (abilities.con.mod + hpPerLevelBonus)));
        const removedHp = parseInt(d.removedHitPoints) || 0;
        const hpCurrent = Math.max(0, Math.min(hpMax, hpMax - removedHp));
        const hpTemp = parseInt(d.temporaryHitPoints) || 0;

        // Calcolo CA (Armatura equipaggiata + Scudo + Mod Destrezza + Bonus)
        let baseAc = 10 + abilities.dex.mod;
        let hasBodyArmor = false;
        let bodyArmorName = '';
        let bodyArmorRaw = 10;
        let dexModApplied = abilities.dex.mod;
        let shieldBonus = 0;
        let shieldName = '';

        (d.inventory || []).forEach(it => {
            if (!it || !it.equipped || !it.definition) return;
            const def = it.definition;
            if (def.armorClass && def.armorTypeId) {
                // 1: Light, 2: Medium, 3: Heavy, 4: Shield
                let magicAc = 0;
                (def.grantedModifiers || []).forEach(gm => {
                    if (gm.type === 'bonus' && gm.subType === 'armor-class') {
                        magicAc += parseInt(gm.value ?? gm.fixedValue) || 0;
                    }
                });
                if (def.armorTypeId === 4) {
                    shieldBonus += (parseInt(def.armorClass) || 2) + magicAc;
                    shieldName = getCustomName(it.id, def.id) || def.name || 'Scudo';
                } else {
                    hasBodyArmor = true;
                    bodyArmorName = getCustomName(it.id, def.id) || def.name || 'Armatura';
                    bodyArmorRaw = (parseInt(def.armorClass) || 10) + magicAc;
                    if (def.armorTypeId === 1) {
                        dexModApplied = abilities.dex.mod;
                        baseAc = bodyArmorRaw + dexModApplied;
                    } else if (def.armorTypeId === 2) {
                        dexModApplied = Math.min(2, abilities.dex.mod);
                        baseAc = bodyArmorRaw + dexModApplied;
                    } else if (def.armorTypeId === 3) {
                        dexModApplied = 0;
                        baseAc = bodyArmorRaw;
                    }
                }
            }
        });

        let acBonus = 0;
        let unarmoredBonus = 0;
        let unarmoredStatName = '';
        let unarmoredStatMod = 0;

        allMods.forEach(m => {
            if (m._group === 'item' && m.subType === 'armor-class') {
                const invItem = (d.inventory || []).find(i => i.definition && i.definition.id === m.componentId);
                if (invItem && invItem.definition && invItem.definition.armorClass) return;
            }
            if (m.type === 'bonus' && m.subType === 'armor-class') {
                acBonus += parseInt(m.value ?? m.fixedValue) || 0;
            } else if (!hasBodyArmor && m.type === 'bonus' && m.subType === 'unarmored-armor-class') {
                if (m.statId) {
                    const statMeta = ABILITY_META.find(a => a.id === m.statId);
                    if (statMeta && abilities[statMeta.key]) {
                        unarmoredStatName = statMeta.labelIt;
                        unarmoredStatMod = abilities[statMeta.key].mod;
                        unarmoredBonus += unarmoredStatMod;
                    }
                } else {
                    unarmoredBonus += parseInt(m.value ?? m.fixedValue) || 0;
                }
            } else if (!hasBodyArmor && m.type === 'set' && m.subType === 'unarmored-armor-class') {
                // Unarmored Defense (Monaco: Dex + Wis, Barbaro: Dex + Con, Draconic Sorcerer: 13 + Dex)
                const baseVal = parseInt(m.value ?? m.fixedValue) || 10;
                let extraStatMod = 0;
                if (m.statId) {
                    const statMeta = ABILITY_META.find(a => a.id === m.statId);
                    if (statMeta && abilities[statMeta.key]) {
                        if (!(m.statId === 5 && shieldBonus > 0)) {
                            extraStatMod = abilities[statMeta.key].mod;
                            unarmoredStatName = statMeta.labelIt;
                            unarmoredStatMod = extraStatMod;
                        }
                    }
                }
                const setVal = baseVal + abilities.dex.mod + extraStatMod;
                if (setVal > baseAc) baseAc = setVal;
            }
        });
        let ac = baseAc + shieldBonus + acBonus + unarmoredBonus;
        // Controlla eventuali override in characterValues (typeId 1 = AC override, 2 = magic bonus, 3 = misc bonus)
        (d.characterValues || []).forEach(cv => {
            if (cv.typeId === 1 && cv.value) ac = parseInt(cv.value) || ac;
            if ((cv.typeId === 2 || cv.typeId === 3) && cv.value) ac += parseInt(cv.value) || 0;
        });

        let acBreakdownParts = [];
        if (hasBodyArmor) {
            acBreakdownParts.push(`${bodyArmorName} (${bodyArmorRaw})`);
            if (dexModApplied !== 0) acBreakdownParts.push(`DES (${fmtMod(dexModApplied)})`);
        } else if (unarmoredStatName) {
            acBreakdownParts.push(`Base (10)`);
            acBreakdownParts.push(`DES (${fmtMod(abilities.dex.mod)})`);
            acBreakdownParts.push(`Difesa Senz'Armatura ${unarmoredStatName} (${fmtMod(unarmoredStatMod)})`);
        } else {
            acBreakdownParts.push(`Base (10)`);
            acBreakdownParts.push(`DES (${fmtMod(abilities.dex.mod)})`);
        }
        if (shieldBonus > 0) acBreakdownParts.push(`${shieldName || 'Scudo'} (+${shieldBonus})`);
        if (acBonus !== 0) acBreakdownParts.push(`Bonus (${fmtMod(acBonus)})`);
        const acBreakdown = `CA ${ac}: ${acBreakdownParts.join(' + ')}`;

        // Iniziativa (Dex mod + eventuali talenti/competenze/caratteristiche secondarie)
        let initBonus = abilities.dex.mod;
        let initProfApplied = false;
        let initHalfProfApplied = false;
        let initStatName = '';
        let initStatMod = 0;
        let initFlatBonus = 0;

        allMods.forEach(m => {
            if (m.subType === 'initiative') {
                // Bonus numerico diretto (es. Alert 2014 = +5 o oggetti magici)
                if (m.type === 'bonus' && (m.value !== null && m.value !== undefined || m.fixedValue !== null && m.fixedValue !== undefined)) {
                    const fb = parseInt(m.value ?? m.fixedValue) || 0;
                    initBonus += fb;
                    initFlatBonus += fb;
                }
                // Competenza nell'iniziativa (es. Alert 2024 dove bonusTypes = [1] o type = proficiency)
                if (m.bonusTypes && Array.isArray(m.bonusTypes) && m.bonusTypes.includes(1)) {
                    initBonus += profBonus;
                    initProfApplied = true;
                } else if (m.type === 'proficiency') {
                    initBonus += profBonus;
                    initProfApplied = true;
                } else if (m.type === 'half-proficiency') {
                    initBonus += Math.floor(profBonus / 2);
                    initHalfProfApplied = true;
                }
                // Caratteristica secondaria (es. Swashbuckler statId: 6, Chronurgy statId: 4, Gloom Stalker statId: 5)
                if (m.statId) {
                    const statMeta = ABILITY_META.find(a => a.id === m.statId);
                    if (statMeta && abilities[statMeta.key]) {
                        initStatName = statMeta.labelIt;
                        initStatMod = abilities[statMeta.key].mod;
                        initBonus += initStatMod;
                    }
                }
            }
        });

        // Override iniziativa in characterValues (typeId 43)
        (d.characterValues || []).forEach(cv => {
            if (cv.typeId === 43 && cv.value) {
                initBonus = parseInt(cv.value) || initBonus;
            }
        });

        let initBreakdownParts = [`DES (${fmtMod(abilities.dex.mod)})`];
        if (initProfApplied) initBreakdownParts.push(`Competenza [Allerta] (${fmtMod(profBonus)})`);
        if (initHalfProfApplied) initBreakdownParts.push(`Mezza Comp. (${fmtMod(Math.floor(profBonus / 2))})`);
        if (initStatName) initBreakdownParts.push(`${initStatName} (${fmtMod(initStatMod)})`);
        if (initFlatBonus !== 0) initBreakdownParts.push(`Bonus (${fmtMod(initFlatBonus)})`);
        const initBreakdown = `Iniziativa ${fmtMod(initBonus)}: ${initBreakdownParts.join(' + ')}`;

        // Velocità
        let walkFt = d.race?.weightSpeeds?.normal?.walk || 30;
        let speedBonusFt = 0;
        allMods.forEach(m => {
            if (m.type === 'set' && m.subType === 'innate-speed-walking') {
                walkFt = parseInt(m.value ?? m.fixedValue) || walkFt;
            } else if (m.type === 'bonus' && (m.subType === 'speed' || m.subType === 'unarmored-movement')) {
                const b = parseInt(m.value ?? m.fixedValue) || 0;
                walkFt += b;
                speedBonusFt += b;
            }
        });
        const walkMeters = ((walkFt / 5) * 1.5).toFixed(1).replace(/\.0$/, '');
        const speedStr = `${walkMeters}m (${walkFt}ft)`;
        const baseWalkFt = d.race?.weightSpeeds?.normal?.walk || 30;
        let speedBreakdownParts = [`Base (${baseWalkFt}ft)`];
        if (speedBonusFt > 0) speedBreakdownParts.push(`Bonus/Monaco (+${speedBonusFt}ft)`);
        const speedBreakdown = `Velocità ${speedStr}: ${speedBreakdownParts.join(' + ')}`;
        const profBreakdown = `Bonus Competenza: ${fmtMod(profBonus)} (Livello Personaggio: ${totalLevel})`;

        // 6. Incantesimi e Slot
        const spellAbMeta = ABILITY_META.find(a => a.id === primarySpellAbilityId) || ABILITY_META[3]; // default INT
        const spellMod = abilities[spellAbMeta.key].mod;
        let spellDcBonus = 0;
        let spellAtkBonus = 0;
        allMods.forEach(m => {
            if (m.type === 'bonus' && m.subType === 'spell-save-dc') spellDcBonus += parseInt(m.value ?? m.fixedValue) || 0;
            if (m.type === 'bonus' && m.subType === 'spell-attacks') spellAtkBonus += parseInt(m.value ?? m.fixedValue) || 0;
        });
        const spellSaveDC = 8 + profBonus + spellMod + spellDcBonus;
        const spellAttackMod = profBonus + spellMod + spellAtkBonus;

        // Calcolo Slot Incantesimi (Liv 1..9)
        const tableRow = MULTICLASS_SLOTS_TABLE[Math.min(20, Math.max(0, casterLevelSum))] || [];
        const slots = [];
        for (let lvl = 1; lvl <= 9; lvl++) {
            const rawSlot = (d.spellSlots || []).find(s => s.level === lvl);
            const maxSlots = (rawSlot && rawSlot.available > 0) ? rawSlot.available : (tableRow[lvl - 1] || 0);
            let usedSlots = rawSlot ? (parseInt(rawSlot.used) || 0) : 0;
            // Mantiene il conteggio degli slot utilizzati sincronizzato
            if (maxSlots > 0 || usedSlots > 0) {
                slots.push({ level: lvl, max: maxSlots, used: Math.min(maxSlots, usedSlots) });
            }
        }
        // Pact Magic (Warlock)
        (d.pactMagic || []).forEach(pm => {
            if (pm.available > 0) {
                slots.push({ level: pm.level, max: pm.available, used: pm.used || 0, isPact: true });
            }
        });

        // Raccolta Incantesimi (Trucchetti + Livello 1..9)
        const rawSpellsList = [];
        (d.classSpells || []).forEach(cs => {
            if (Array.isArray(cs.spells)) rawSpellsList.push(...cs.spells);
        });
        if (d.spells && typeof d.spells === 'object') {
            for (const arr of Object.values(d.spells)) {
                if (Array.isArray(arr)) rawSpellsList.push(...arr);
            }
        }

        const SAVE_ID_MAP = { 1: 'FOR', 2: 'DES', 3: 'COS', 4: 'INT', 5: 'SAG', 6: 'CAR' };
        const ACT_TYPE_MAP = { 1: '1A', 3: '1BA', 4: '1R', 6: '1min', 7: '10min', 8: '1h' };
        const COMP_MAP = { 1: 'V', 2: 'S', 3: 'M' };

        const seenSpells = new Map();
        rawSpellsList.forEach(sp => {
            if (!sp || !sp.definition || !sp.definition.name) return;
            const def = sp.definition;
            const nameKey = def.name.trim().toLowerCase();
            const isPrep = !!(def.level === 0 || sp.prepared || sp.alwaysPrepared || sp.usesSpellSlot === false);

            if (seenSpells.has(nameKey)) {
                if (isPrep) seenSpells.get(nameKey).prepared = true;
                return;
            }

            // Estrai danno / cura da modifiers dell'incantesimo
            let formula = '';
            let dmgType = '';
            (def.modifiers || []).forEach(m => {
                if ((m.type === 'damage' || m.type === 'bonus') && m.die && m.die.diceString && !formula) {
                    formula = m.die.diceString;
                    dmgType = m.friendlySubtypeName || m.subType || '';
                    // Scala trucchetti con il livello del personaggio (liv 5, 11, 17)
                    if (def.level === 0 && def.canCastAtHigherLevel && Array.isArray(m.atHigherLevels?.higherLevelDefinitions)) {
                        m.atHigherLevels.higherLevelDefinitions.forEach(hd => {
                            const reqLvl = hd.level || 0;
                            if (totalLevel >= reqLvl && hd.dice && hd.dice.diceString) {
                                formula = hd.dice.diceString;
                            }
                        });
                    }
                }
            });

            // Fallback: cerca formula dadi nella descrizione (es. "3d8" o "8d6")
            let cleanDesc = stripHtml(def.description, 0);
            // Include eventuali note o descrizioni personalizzate da characterValues (typeId 9)
            const customSpellDesc = (d.characterValues || []).find(cv => cv.typeId === 9 && (String(cv.valueId) === String(sp.id) || String(cv.valueId) === String(def.id)))?.value;
            if (customSpellDesc) {
                const cleanCustom = stripHtml(customSpellDesc, 0);
                if (cleanCustom) {
                    cleanDesc = cleanCustom + (cleanDesc ? '\n\n' + cleanDesc : '');
                }
            }
            if (!formula && cleanDesc) {
                const dm = cleanDesc.match(/\b(\d+d\d+(?:\s*[+\-]\s*\d+)?)\b/i);
                if (dm) formula = dm[1].replace(/\s+/g, '');
            }

            const rangeStr = def.range?.origin === 'Ranged' && def.range?.rangeValue
                ? `${((def.range.rangeValue / 5) * 1.5).toFixed(0)}m (${def.range.rangeValue}ft)`
                : (def.range?.origin || '');
            const actStr = ACT_TYPE_MAP[def.activation?.activationType] || '1A';
            const comps = Array.isArray(def.components) ? def.components.map(c => COMP_MAP[c] || '').filter(Boolean).join(',') : '';
            const saveStat = def.saveDcAbilityId ? SAVE_ID_MAP[def.saveDcAbilityId] : '';
            const isAttack = !!def.requiresAttackRoll;

            const customSpellName = getCustomName(sp.id, def.id);
            const dispSpellName = customSpellName ? (customSpellName.toLowerCase() === def.name.toLowerCase() ? def.name : `${customSpellName} [${def.name}]`) : def.name;

            seenSpells.set(nameKey, {
                name: dispSpellName,
                originalName: def.name,
                level: parseInt(def.level) || 0,
                school: def.school || '',
                prepared: isPrep,
                ritual: !!def.ritual,
                concentration: !!def.concentration,
                range: rangeStr,
                time: actStr,
                comp: comps,
                isAttack,
                save: saveStat,
                formula,
                dmgType,
                desc: cleanDesc
            });
        });

        const spells = Array.from(seenSpells.values()).sort((a, b) => (a.level - b.level) || a.name.localeCompare(b.name));

        // 7. Attacchi Rapidi (Armi equipaggiate + Trucchetti/Incantesimi d'attacco)
        const attacks = [];

        // Colpo Senz'Armi (Unarmed Strike) universale per tutte le classi
        let unarmedDie = '1';
        let isUnarmedMonk = classesList.some(c => (c.definition?.name || '').toLowerCase() === 'monk');
        if (isUnarmedMonk) {
            classesList.forEach(c => {
                if ((c.definition?.name || '').toLowerCase() === 'monk') {
                    (c.classFeatures || []).forEach(cf => {
                        if ((cf.definition?.name || '').toLowerCase() === 'martial arts' && cf.levelScale?.dice?.diceString) {
                            unarmedDie = cf.levelScale.dice.diceString;
                        }
                    });
                }
            });
            if (unarmedDie === '1') {
                const monkLvl = classesList.find(c => (c.definition?.name || '').toLowerCase() === 'monk')?.level || totalLevel;
                if (monkLvl >= 17) unarmedDie = '1d12';
                else if (monkLvl >= 11) unarmedDie = '1d10';
                else if (monkLvl >= 5) unarmedDie = '1d8';
                else unarmedDie = '1d6';
            }
        } else {
            const hasUnarmedFighting = allMods.some(m => (m.friendlySubtypeName || m.subType || '').toLowerCase().includes('unarmed fighting') || (m.subType || '').includes('unarmed-fighting'));
            const hasTavernBrawler = allMods.some(m => (m.friendlySubtypeName || m.subType || '').toLowerCase().includes('tavern brawler'));
            if (hasUnarmedFighting) unarmedDie = '1d8';
            else if (hasTavernBrawler) unarmedDie = '1d4';
        }

        const unarmedAbMod = isUnarmedMonk ? Math.max(abilities.str.mod, abilities.dex.mod) : abilities.str.mod;
        const unarmedToHit = unarmedAbMod + profBonus;
        let unarmedDmgStr = '';
        if (unarmedDie === '1') {
            const rawDmg = 1 + unarmedAbMod;
            unarmedDmgStr = `${Math.max(1, rawDmg)}`;
        } else {
            unarmedDmgStr = unarmedAbMod === 0 ? unarmedDie : `${unarmedDie}${unarmedAbMod > 0 ? '+' + unarmedAbMod : unarmedAbMod}`;
        }

        let unarmedCustomName = null;
        let unarmedCustomNotes = null;
        if (d.actions && typeof d.actions === 'object') {
            for (const arr of Object.values(d.actions)) {
                if (!Array.isArray(arr)) continue;
                arr.forEach(act => {
                    if (act && (act.name || '').toLowerCase().includes('unarmed')) {
                        const cn = getCustomName(act.id, act.definition?.id);
                        if (cn) unarmedCustomName = cn;
                        const cnote = getCustomNotes(act.id, act.definition?.id);
                        if (cnote) unarmedCustomNotes = cnote;
                    }
                });
            }
        }

        attacks.push({
            name: unarmedCustomName || "👊 Colpo Senz'Armi",
            originalName: 'Unarmed Strike',
            toHit: unarmedToHit,
            damage: unarmedDmgStr,
            dmgType: 'Contundente',
            notes: unarmedCustomNotes ? `Mischia (1.5m) • ${unarmedCustomNotes}` : 'Mischia (1.5m)'
        });

        (d.inventory || []).forEach(it => {
            if (!it || !it.definition) return;
            const def = it.definition;
            const isWeapon = def.filterType === 'Weapon' || (def.damage && def.damage.diceString);
            if (!isWeapon) return;
            if (!it.equipped && (d.inventory || []).filter(x => x.definition?.filterType === 'Weapon').length > 3) return;

            const customWeaponName = getCustomName(it.id, def.id);
            const customWeaponNotes = getCustomNotes(it.id, def.id);
            const dispWeaponName = customWeaponName || def.name;

            const props = (def.properties || []).map(p => (p.name || '').toLowerCase());
            const isFinesse = props.includes('finesse');
            const isRanged = def.attackType === 2 || props.includes('ammunition');
            const isMonk = classesList.some(c => (c.definition?.name || '').toLowerCase() === 'monk');
            const isMonkWeapon = isMonk && def.filterType === 'Weapon' &&
                ((def.type || '').includes('Simple') || (def.name || '').toLowerCase().includes('shortsword') || (def.type || '').includes('Quarterstaff') || (def.type || '').includes('Dagger') || (def.type || '').includes('Spear') || (def.type || '').includes('Handaxe')) &&
                !props.includes('two-handed') && !props.includes('heavy');
            const abMod = (isFinesse || isMonkWeapon)
                ? Math.max(abilities.str.mod, abilities.dex.mod)
                : (isRanged ? abilities.dex.mod : abilities.str.mod);

            let magicBonus = 0;
            (def.grantedModifiers || []).forEach(gm => {
                if (gm.type === 'bonus' && gm.subType === 'magic') {
                    magicBonus += parseInt(gm.value ?? gm.fixedValue) || 0;
                }
            });

            const toHit = abMod + profBonus + magicBonus;
            const dmgDice = def.damage?.diceString || '1d4';
            const totalDmgMod = abMod + magicBonus;
            const dmgFormula = totalDmgMod === 0 ? dmgDice : `${dmgDice}${totalDmgMod > 0 ? '+' + totalDmgMod : totalDmgMod}`;

            let noteParts = [];
            if (def.range) noteParts.push(`${((def.range / 5) * 1.5).toFixed(0)}m`);
            else noteParts.push('Mischia');
            if (customWeaponNotes) noteParts.push(customWeaponNotes);

            attacks.push({
                name: dispWeaponName,
                originalName: def.name,
                toHit: toHit,
                damage: dmgFormula,
                dmgType: def.damageType || '',
                notes: noteParts.join(' • ')
            });
        });

        // Aggiungi trucchetti offensivi e incantesimi offensivi preparati agli attacchi rapidi
        spells.forEach(sp => {
            if ((sp.level === 0 || sp.prepared) && (sp.isAttack || sp.formula)) {
                if (sp.level > 2 && attacks.length >= 8) return;
                attacks.push({
                    name: `✨ ${sp.name}`,
                    toHit: sp.isAttack ? spellAttackMod : null,
                    save: sp.save ? `TS ${sp.save} ${spellSaveDC}` : '',
                    damage: sp.formula || '',
                    dmgType: sp.dmgType || '',
                    notes: sp.range || ''
                });
            }
        });

        // 8. Privilegi, Tratti Razziali, Talenti & Azioni con Usi Limitati
        const features = [];
        const skipNames = new Set([
            'Ability Score Increases', 'Ability Score Improvement', 'Languages',
            'Creature Type', 'Size', 'Speed', 'Proficiencies', 'Hit Points', 'Equipment'
        ]);
        const seenFeatNames = new Set();

        const addFeature = (name, category, descHtml, maxUses = 0, usedUses = 0) => {
            if (!name || skipNames.has(name)) return;
            const key = name.trim().toLowerCase();
            if (seenFeatNames.has(key)) return;
            seenFeatNames.add(key);
            features.push({
                name: name.trim(),
                cat: category, // 'race' | 'class' | 'feat'
                desc: stripHtml(descHtml, 0),
                maxUses: parseInt(maxUses) || 0,
                usedUses: parseInt(usedUses) || 0
            });
        };

        // Mappa usi limitati dalle actions
        const actionUsesMap = new Map();
        if (d.actions && typeof d.actions === 'object') {
            for (const arr of Object.values(d.actions)) {
                if (!Array.isArray(arr)) continue;
                arr.forEach(act => {
                    if (!act || !act.name) return;
                    const maxU = act.limitedUse?.maxUses || (act.limitedUse?.statModifierUsesId ? abilities[ABILITY_META.find(a => a.id === act.limitedUse.statModifierUsesId)?.key || 'int']?.mod : 0) || 0;
                    const usedU = act.limitedUse?.numberUsed || 0;
                    if (maxU > 0) {
                        actionUsesMap.set(act.name.trim().toLowerCase(), { max: maxU, used: usedU });
                    }
                    const customActName = getCustomName(act.id, act.definition?.id) || act.name;
                    const customActNotes = getCustomNotes(act.id, act.definition?.id);
                    let descText = act.snippet || act.description || '';
                    if (customActNotes) descText = customActNotes + (descText ? '\n\n' + descText : '');
                    if (descText) {
                        addFeature(customActName, 'action', descText, maxU, usedU);
                    }
                });
            }
        }

        (d.race?.racialTraits || []).forEach(rt => {
            const def = rt.definition;
            if (!def) return;
            const u = actionUsesMap.get((def.name || '').toLowerCase());
            addFeature(def.name, 'race', def.snippet || def.description, u?.max, u?.used);
        });

        classesList.forEach(c => {
            const cLvl = parseInt(c.level) || 1;
            (c.classFeatures || []).forEach(cf => {
                const def = cf.definition;
                if (!def || (def.requiredLevel && def.requiredLevel > cLvl)) return;
                const u = actionUsesMap.get((def.name || '').toLowerCase()) || (cf.limitedUse ? { max: cf.limitedUse.maxUses, used: cf.limitedUse.numberUsed } : null);
                addFeature(def.name, 'class', def.snippet || def.description, u?.max, u?.used);
            });
            if (c.subclassDefinition && Array.isArray(c.subclassDefinition.classFeatures)) {
                c.subclassDefinition.classFeatures.forEach(scf => {
                    if (!scf || (scf.requiredLevel && scf.requiredLevel > cLvl)) return;
                    const u = actionUsesMap.get((scf.name || '').toLowerCase());
                    addFeature(scf.name, 'class', scf.snippet || scf.description, u?.max, u?.used);
                });
            }
        });

        (d.feats || []).forEach(ft => {
            const def = ft.definition;
            if (!def) return;
            const u = actionUsesMap.get((def.name || '').toLowerCase());
            addFeature(def.name, 'feat', def.snippet || def.description, u?.max, u?.used);
        });

        // 9. Inventario e Valuta
        const currencies = {
            pp: parseInt(d.currencies?.pp) || 0,
            gp: parseInt(d.currencies?.gp) || 0,
            ep: parseInt(d.currencies?.ep) || 0,
            sp: parseInt(d.currencies?.sp) || 0,
            cp: parseInt(d.currencies?.cp) || 0
        };

        const inventory = (d.inventory || []).map(it => {
            if (!it || !it.definition) return null;
            return {
                name: it.definition.name,
                qty: parseInt(it.quantity) || 1,
                equipped: !!it.equipped,
                type: it.definition.filterType || it.definition.type || 'Oggetto',
                weight: it.definition.weight || 0
            };
        }).filter(Boolean);

        return {
            _vttPcSheet: true,
            updatedAt: Date.now(),
            externalId,
            sourceUrl: cleanSourceUrl,
            name: d.name || 'Personaggio',
            race: d.race?.fullName || d.race?.baseName || '',
            classes: classStrings.join(' / ') || 'Avventuriero 1',
            level: totalLevel,
            profBonus,
            avatarUrl: d.decorations?.avatarUrl || '',
            hpMax,
            hpCurrent,
            hpTemp,
            ac,
            acBreakdown,
            initBonus,
            initBreakdown,
            speed: speedStr,
            speedBreakdown,
            profBreakdown,
            passives,
            passivePerception: passives.perception.value,
            passiveInvestigation: passives.investigation.value,
            passiveInsight: passives.insight.value,
            abilities,
            saves,
            skills,
            attacks,
            spellcasting: {
                ability: spellAbMeta.labelIt,
                saveDC: spellSaveDC,
                attackBonus: spellAttackMod,
                slots,
                spells
            },
            features,
            currencies,
            inventory,
            notes: (prevSheet && prevSheet.notes) ? prevSheet.notes : '',
            adventureJournal: (prevSheet && prevSheet.adventureJournal) ? prevSheet.adventureJournal : ''
        };
    }

    // =========================================================================
    // SISTEMA LANCIO DADI (CON SUPPORTO NORMALE / VANTAGGIO / SVANTAGGIO)
    // =========================================================================
    function executePcRoll(charName, formulaStr, labelStr, forceMode = null) {
        if (!formulaStr) return;
        const clean = String(formulaStr).replace(/\s+/g, '');
        let diceCount = 1;
        let diceSides = 20;
        let bonus = 0;

        if (/^[+\-]?\d+$/.test(clean)) {
            diceCount = 1;
            diceSides = 20;
            bonus = parseInt(clean, 10) || 0;
        } else {
            const m = clean.match(/^(\d*)d(\d+)([+\-]\d+)?$/i);
            if (m) {
                diceCount = m[1] ? parseInt(m[1], 10) : 1;
                diceSides = parseInt(m[2], 10) || 20;
                bonus = m[3] ? parseInt(m[3], 10) : 0;
            }
        }

        const effMode = forceMode || rollMode || 'normal';
        const isD20Check = (diceCount === 1 && diceSides === 20);
        const rollAdvDis = isD20Check && (effMode === 'adv' || effMode === 'dis');

        const rolledItems = [];
        let diceSum = 0;
        let finalResult = 0;
        let expr = `${diceCount}d${diceSides}`;
        let modePayload = 'total';

        if (rollAdvDis) {
            const r1 = Math.floor(Math.random() * 20) + 1;
            const r2 = Math.floor(Math.random() * 20) + 1;
            rolledItems.push({ dice: 20, raw: r1, total: r1 + bonus });
            rolledItems.push({ dice: 20, raw: r2, total: r2 + bonus });
            const chosenRaw = effMode === 'adv' ? Math.max(r1, r2) : Math.min(r1, r2);
            finalResult = chosenRaw + bonus;
            diceSum = chosenRaw;
            expr = effMode === 'adv' ? '2d20 (Vantaggio)' : '2d20 (Svantaggio)';
            modePayload = 'each';
        } else {
            for (let i = 0; i < diceCount; i++) {
                const raw = Math.floor(Math.random() * diceSides) + 1;
                diceSum += raw;
                rolledItems.push({ dice: diceSides, raw, total: raw + bonus });
            }
            finalResult = diceSum + bonus;
        }

        const isDM = isDMView();
        const chatPublicCb = document.getElementById('chat-rolls-public');
        const statPublicCb = document.getElementById('statblock-rolls-public');
        const dmPublicCb = document.getElementById('dice-dm-public');
        const isPublic = !isDM || (statPublicCb ? statPublicCb.checked : (chatPublicCb ? chatPublicCb.checked : (dmPublicCb ? dmPublicCb.checked : true)));
        const secretTag = (!isPublic && isDM) ? ' (🔒 Segreto DM)' : '';
        const isInitRoll = /iniziativa|initiative/i.test(labelStr);
        const activeTok = (typeof getActiveToken === 'function') ? getActiveToken() : null;

        const rollId = Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        window.lastRollId = rollId;

        const net = getNetworkRef();
        const senderName = (net && net.playerName) ? net.playerName : (isDM ? 'Master' : 'Giocatore');
        const senderPeerId = (net && net.myPeerId) ? net.myPeerId : null;

        const payload = {
            id: rollId,
            player: `${charName} [${labelStr}]${secretTag}`,
            sender: senderName,
            senderPeerId: senderPeerId,
            expression: expr,
            bonus: bonus,
            mode: modePayload,
            rolls: rolledItems,
            diceSum: diceSum,
            result: finalResult,
            isSecret: !isPublic,
            rollType: isInitRoll ? 'initiative' : null,
            charName: charName,
            tokenId: activeTok ? activeTok.id : null
        };

        if (typeof window.appendRollToChat === 'function') {
            window.appendRollToChat(payload);
        }

        if (isPublic && net && typeof net.send === 'function') {
            net.send({ type: 'DICE_ROLL', payload });
        }

        const chatPanel = document.getElementById('chat-panel');
        if (chatPanel) {
            chatPanel.style.display = 'flex';
            const chatLog = document.getElementById('chat-log');
            if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
        }
    }

    // Trasforma formule dadi (es. 2d8+4, +5) in link cliccabili nelle descrizioni
    function formatTextWithRollButtons(text, labelPrefix) {
        if (!text) return '';
        const escaped = esc(text).replace(/\n/g, '<br>');
        return escaped.replace(/\b(\d+d\d+(?:\s*[+\-]\s*\d+)?)\b/gi, (match) => {
            const cleanF = match.replace(/\s+/g, '');
            return `<span class="pcs-roll-trigger" data-formula="${esc(cleanF)}" data-label="${esc(labelPrefix)}" style="background:#263238; color:#4dd0e1; border:1px solid #00acc1; border-radius:3px; padding:0 4px; cursor:pointer; font-weight:bold; white-space:nowrap;">🎲 ${esc(match)}</span>`;
        });
    }

    // =========================================================================
    // SINCRONIZZAZIONE E SALVATAGGIO STATO TOKEN <-> SCHEDA PG
    // =========================================================================
    function commitSheetChanges(token, syncHpAndAcToToken = false) {
        if (!token || !token.pcSheet) return;
        token.pcSheet.updatedAt = Date.now();

        if (syncHpAndAcToToken) {
            token.hpMax = token.pcSheet.hpMax;
            token.hpCurrent = token.pcSheet.hpCurrent;
            token.hpTemp = token.pcSheet.hpTemp || 0;
            token.ac = token.pcSheet.ac;
        } else if (token.pcSheet.hpTemp !== undefined) {
            token.hpTemp = token.pcSheet.hpTemp || 0;
        }

        const eng = getEngineRef();
        if (eng) {
            if (eng.initiative && Array.isArray(eng.initiative.participants)) {
                const p = eng.initiative.participants.find(x => x.tokenId === token.id);
                if (p) {
                    p.hpCurrent = token.hpCurrent;
                    p.hpMax = token.hpMax;
                    p.ac = token.ac;
                }
                if (typeof window.renderTrackerList === 'function') window.renderTrackerList();
            }
            eng.renderTokensLayer();
        }

        if (isDMView()) {
            if (typeof window.updateSelectedTokenControls === 'function' && eng && eng.selectedTokenId === token.id) {
                window.updateSelectedTokenControls(token);
            }
            if (typeof window.upsertTokenInCampaign === 'function') {
                window.upsertTokenInCampaign(token);
            }
            if (typeof window.broadcastPcSheetSync === 'function') {
                window.broadcastPcSheetSync(token);
            }
            if (typeof window.syncState === 'function') {
                window.syncState(true, false);
            }
        } else {
            // Lato Player: invia aggiornamento leggero al Master
            const net = getNetworkRef();
            if (net && typeof net.send === 'function') {
                net.send({
                    type: 'PLAYER_UPDATE_PC_SHEET',
                    payload: {
                        tokenId: token.id,
                        pcSheet: token.pcSheet,
                        adventureJournal: token.adventureJournal || '',
            evocationPresets: token.evocationPresets || [],
                        hpCurrent: token.hpCurrent,
                        hpMax: token.hpMax,
                        hpTemp: token.hpTemp || 0,
                        ac: token.ac
                    }
                });
            }
        }
    }

    function commitJournalChanges(token) {
        if (!token) return;
        token.adventureJournalUpdatedAt = Date.now();
        if (token.pcSheet) token.pcSheet.adventureJournal = token.adventureJournal;

        if (isDMView()) {
            if (typeof window.upsertTokenInCampaign === 'function') {
                window.upsertTokenInCampaign(token);
            }
            if (typeof window.broadcastPcSheetSync === 'function') {
                window.broadcastPcSheetSync(token);
            }
            if (typeof window.syncState === 'function') {
                window.syncState(true, false);
            }
        } else {
            const net = getNetworkRef();
            if (net && typeof net.send === 'function') {
                net.send({
                    type: 'PLAYER_UPDATE_TOKEN_JOURNAL',
                    payload: {
                        tokenId: token.id,
                        adventureJournal: token.adventureJournal || '',
                        player: net.playerName || ''
                    }
                });
            }
        }
    }

    // =========================================================================
    // IMPORTAZIONE & AGGIORNAMENTO (FETCH RAPIDO + FALLBACK 2-CLICK AUTOMATICO)
    // =========================================================================
    async function tryFetchCharacterJson(charId) {
        const endpoint = buildCharacterDataEndpoint(charId);
        if (!endpoint) throw new Error('ID scheda mancante');

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 1800);
        try {
            const res = await fetch(endpoint, { signal: controller.signal });
            clearTimeout(timer);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const text = await res.text();
            if (text && text.includes('"stats"')) return text;
            throw new Error('Risposta non valida');
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    function applyRawJsonToCurrentToken(rawText, sourceUrlInput = '') {
        const token = getActiveToken();
        if (!token) {
            alert(tr('Seleziona prima un token!', 'Please select a token first!'));
            return false;
        }
        try {
            const prevSheet = token.pcSheet || null;
            const finalUrl = sourceUrlInput || (prevSheet ? prevSheet.sourceUrl : '');
            const parsed = parseCharacterSheetJSON(rawText, finalUrl, prevSheet);

            // Preserva sempre il Giornale dell'Avventura se presente sul token o nella scheda precedente
            const prevJournal = token.adventureJournal || (prevSheet ? prevSheet.adventureJournal : '') || '';
            if (prevJournal) {
                token.adventureJournal = prevJournal;
                parsed.adventureJournal = prevJournal;
            }

            token.pcSheet = parsed;
            token.hpMax = parsed.hpMax;
            token.hpCurrent = parsed.hpCurrent;
            token.ac = parsed.ac;

            // Se il token fa parte di PG o PNG, imposta il nome pulito
            const cat = token.category || 'personaggi';
            if (!token.name || token.name.startsWith('Token') || cat === 'personaggi') {
                token.category = 'personaggi';
                token.name = parsed.name;
            }

            awaitingClipboardSync = false;
            const fbBox = document.getElementById('pcs-fallback-panel');
            if (fbBox) fbBox.style.display = 'none';

            commitSheetChanges(token, true);
            renderSheetModal(token);

            if (typeof window.showToast === 'function') {
                window.showToast(`🧙 ${tr('Scheda PG sincronizzata:', 'PC Sheet synced:')} "${parsed.name}" (Liv. ${parsed.level}, PV ${parsed.hpCurrent}/${parsed.hpMax}, CA ${parsed.ac})`);
            }
            return true;
        } catch (err) {
            alert(tr('Impossibile leggere i dati della scheda: ', 'Could not parse character sheet data: ') + err.message);
            return false;
        }
    }

    async function handleSyncOrImportAction(openSourceAutomatically = false) {
        const token = getActiveToken();
        if (!token) return;

        const urlInput = document.getElementById('pcs-source-input');
        const rawVal = (urlInput ? urlInput.value.trim() : '') || (token.pcSheet ? token.pcSheet.sourceUrl : '');

        if (!rawVal) {
            const fbBox = document.getElementById('pcs-fallback-panel');
            if (fbBox) fbBox.style.display = 'flex';
            if (urlInput) urlInput.focus();
            return;
        }

        // Se l'utente ha incollato direttamente il JSON nel campo input
        if (rawVal.startsWith('{') && rawVal.endsWith('}')) {
            if (urlInput) urlInput.value = token.pcSheet?.sourceUrl || '';
            applyRawJsonToCurrentToken(rawVal, token.pcSheet?.sourceUrl || '');
            return;
        }

        const charId = extractCharacterId(rawVal);
        if (!charId) {
            alert(tr('Inserisci un Link o ID numerico valido (es. 165409901) oppure incolla il JSON.', 'Enter a valid Link or numeric ID (e.g. 165409901) or paste the JSON.'));
            return;
        }

        if (token.pcSheet) {
            token.pcSheet.sourceUrl = rawVal;
            token.pcSheet.externalId = charId;
        }

        // 1. Tenta prima il fetch diretto rapido
        try {
            const jsonText = await tryFetchCharacterJson(charId);
            applyRawJsonToCurrentToken(jsonText, rawVal);
            return;
        } catch (_) {
            // CORS o scheda protetta -> Attiva flusso Fallback 2-Click ultra-rapido
        }

        const fbBox = document.getElementById('pcs-fallback-panel');
        if (fbBox) fbBox.style.display = 'flex';
        awaitingClipboardSync = true;
        const pasteArea = document.getElementById('pcs-json-paste-area');
        if (pasteArea) setTimeout(() => pasteArea.focus(), 50);

        if (openSourceAutomatically) {
            const endpoint = buildCharacterDataEndpoint(charId);
            window.open(endpoint, '_blank', 'width=720,height=520');
        }
    }

    // =========================================================================
    // COSTRUZIONE E RENDERING LEGGERO DELLA FINESTRA MODALE (#pc-sheet-window)
    // =========================================================================
    function ensureModalDOM() {
        let win = document.getElementById('pc-sheet-window');
        if (win) return win;

        const styleEl = document.createElement('style');
        styleEl.textContent = `
            #pc-sheet-window {
                display: none;
                position: fixed;
                top: 45px;
                left: calc(50% - 330px);
                width: 660px;
                height: 640px;
                min-width: 400px;
                min-height: 360px;
                max-width: 96vw;
                max-height: 92vh;
                background: #16181d;
                border: 2px solid #d4af37;
                border-radius: 8px;
                z-index: 1250;
                flex-direction: column;
                box-shadow: 0 10px 28px rgba(0,0,0,0.85);
                resize: both;
                overflow: hidden;
                font-family: 'Segoe UI', Tahoma, sans-serif;
                color: #e0e0e0;
                box-sizing: border-box;
                contain: layout style;
            }
            #pc-sheet-window input[type="number"]::-webkit-outer-spin-button,
            #pc-sheet-window input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            #pc-sheet-window input[type="number"] {
                -moz-appearance: textfield;
                appearance: textfield;
                margin: 0;
                box-sizing: border-box;
                line-height: 1.2;
            }
            #pc-sheet-window input[type="text"],
            #pc-sheet-window textarea {
                margin: 0;
                box-sizing: border-box;
            }
            #pc-sheet-window button {
                margin: 0;
                box-sizing: border-box;
                line-height: 1.1;
            }
            .pcs-tab-btn {
                flex: 1;
                padding: 7px 6px;
                background: #1f2229;
                color: #aaa;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
            }
            .pcs-tab-btn.active {
                background: #282c37;
                color: #ffd54f;
                border-bottom: 2px solid #ffd54f;
            }
            .pcs-roll-trigger {
                cursor: pointer;
                user-select: none;
            }
            .pcs-roll-trigger:hover {
                filter: brightness(1.22);
            }
            .pcs-ability-card {
                background: #20232b;
                border: 1px solid #3a3f4d;
                border-radius: 6px;
                padding: 5px 3px;
                text-align: center;
                cursor: pointer;
                user-select: none;
            }
            .pcs-ability-card:hover {
                border-color: #ffd54f;
                background: #282c37;
            }
            .pcs-row-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 7px;
                border-radius: 4px;
                background: #1d2027;
                border: 1px solid #2d313b;
                margin-bottom: 3px;
                font-size: 11.5px;
            }
            .pcs-row-item:hover {
                border-color: #555b6e;
                background: #242832;
            }
        `;
        document.head.appendChild(styleEl);

        win = document.createElement('div');
        win.id = 'pc-sheet-window';
        win.innerHTML = `
            <div id="pcs-header" style="background: #20232b; padding: 8px 12px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #3a3f4d; user-select: none; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                    <img id="pcs-header-avatar" src="" style="width: 34px; height: 34px; border-radius: 50%; border: 2px solid #ffd54f; object-fit: cover; display: none; background: #111; flex-shrink: 0;">
                    <div style="min-width: 0; flex: 1;">
                        <div id="pcs-header-name" style="font-size: 15px; font-weight: bold; color: #ffd54f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Scheda Personaggio</div>
                        <div id="pcs-header-sub" style="font-size: 11px; color: #9fa8da; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 5px; flex-shrink: 0;">
                    <div style="display: inline-flex; background: #121418; border: 1px solid #444; border-radius: 4px; overflow: hidden; font-size: 10.5px;">
                        <button type="button" class="pcs-mode-btn" data-mode="normal" style="padding: 3px 6px; border: none; cursor: pointer; background: #37474f; color: #fff; font-weight: bold;" title="Tiro Normale (1d20)">Norm</button>
                        <button type="button" class="pcs-mode-btn" data-mode="adv" style="padding: 3px 6px; border: none; cursor: pointer; background: transparent; color: #81c784;" title="Vantaggio (2d20 tenendo il migliore)">Vant</button>
                        <button type="button" class="pcs-mode-btn" data-mode="dis" style="padding: 3px 6px; border: none; cursor: pointer; background: transparent; color: #e57373;" title="Svantaggio (2d20 tenendo il peggiore)">Svant</button>
                    </div>
                    <button type="button" id="pcs-btn-sync" style="background: #00897b; color: white; border: none; padding: 5px 9px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;" title="Aggiorna e sincronizza la scheda">🔄 Aggiorna</button>
                    <button type="button" id="pcs-btn-toggle-import" style="background: #333; color: #ccc; border: 1px solid #555; padding: 4px 7px; border-radius: 4px; font-size: 11px; cursor: pointer;" title="Configura Link / Importa Dati Scheda">⚙️ Link</button>
                    <button type="button" id="pcs-btn-close" style="background: transparent; color: #bbb; border: none; font-size: 16px; cursor: pointer; padding: 0 4px;" title="Chiudi">✕</button>
                </div>
            </div>

            <!-- Barra Link & Pannello Sincronizzazione Rapida (Fallback 2-Click) -->
            <div id="pcs-import-bar" style="display: none; background: #1b1e26; border-bottom: 1px solid #3a3f4d; padding: 7px 10px; flex-direction: column; gap: 6px;">
                <div style="display: flex; gap: 6px; align-items: center;">
                    <input type="text" id="pcs-source-input" placeholder="Link o ID personaggio (es. 165409901) oppure incolla JSON..." style="flex: 1; padding: 5px 8px; background: #101216; color: #fff; border: 1px solid #444; border-radius: 4px; font-size: 11.5px;">
                    <button type="button" id="pcs-btn-open-source" style="background: #1565c0; color: white; border: none; padding: 5px 9px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; white-space: nowrap;">🔗 1. Apri Dati</button>
                    <button type="button" id="pcs-btn-paste-clipboard" style="background: #2e7d32; color: white; border: none; padding: 5px 9px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; white-space: nowrap;">📋 2. Incolla (Ctrl+V)</button>
                </div>
                <div id="pcs-fallback-panel" style="display: none; flex-direction: column; gap: 5px; background: #12141a; padding: 7px; border-radius: 4px; border: 1px dashed #00897b;">
                    <div style="font-size: 11px; color: #80cbc4; line-height: 1.35;">
                        ⚡ <b>Sincronizzazione Istantanea:</b> 1) Nella scheda dati aperta premi <b>Ctrl+A</b> e <b>Ctrl+C</b>. 2) Torna qui e premi direttamente <b>Ctrl+V</b> sulla tastiera (o clicca tasto destro ➔ <b>Incolla</b> nel riquadro qui sotto):
                    </div>
                    <textarea id="pcs-json-paste-area" placeholder="Clicca qui e premi Ctrl+V (o Tasto Destro -> Incolla) per caricare istantaneamente la scheda..." style="width: 100%; height: 48px; background: #0c0e12; color: #a5d6a7; border: 1px solid #00897b; border-radius: 3px; font-family: monospace; font-size: 10.5px; padding: 5px; box-sizing: border-box; resize: vertical;"></textarea>
                </div>
            </div>

            <!-- Barra Navigazione a 5 Tavole (Tab) -->
            <div id="pcs-tabs-bar" style="display: flex; background: #1f2229; border-bottom: 1px solid #333; user-select: none;">
                <button type="button" class="pcs-tab-btn active" data-tab="combat">⚔️ Combattimento & Abilità</button>
                <button type="button" class="pcs-tab-btn" data-tab="spells">✨ Incantesimi</button>
                <button type="button" class="pcs-tab-btn" data-tab="features">📜 Privilegi & Tratti</button>
                <button type="button" class="pcs-tab-btn" data-tab="inventory">🎒 Inventario</button>
                <button type="button" class="pcs-tab-btn" data-tab="journal">📖 Giornale</button>
            </div>

            <!-- Contenuto Scheda (Scrollabile) -->
            <div id="pcs-body" style="flex: 1; overflow-y: auto; padding: 10px; font-size: 12px; box-sizing: border-box;"></div>
        `;

        document.body.appendChild(win);
        if (typeof window.makeDraggable === 'function') {
            window.makeDraggable(win, document.getElementById('pcs-header'));
        }

        bindDelegatedModalEvents(win);
        return win;
    }

    function updateRollModeButtons(win) {
        win.querySelectorAll('.pcs-mode-btn').forEach(btn => {
            const m = btn.getAttribute('data-mode');
            const isAct = m === rollMode;
            if (m === 'normal') {
                btn.style.background = isAct ? '#37474f' : 'transparent';
                btn.style.color = isAct ? '#fff' : '#888';
            } else if (m === 'adv') {
                btn.style.background = isAct ? '#2e7d32' : 'transparent';
                btn.style.color = isAct ? '#fff' : '#81c784';
            } else if (m === 'dis') {
                btn.style.background = isAct ? '#c62828' : 'transparent';
                btn.style.color = isAct ? '#fff' : '#e57373';
            }
        });
    }

    // =========================================================================
    // EVENT DELEGATION UNICA (ZERO LISTENER MULTIPLI, MASSIMA LEGGEREZZA)
    // =========================================================================
    function bindDelegatedModalEvents(win) {
        win.addEventListener('click', async (e) => {
            const target = e.target;

            // Chiusura
            if (target.closest('#pcs-btn-close')) {
                win.style.display = 'none';
                awaitingClipboardSync = false;
                return;
            }

            // Selettore Normale / Vantaggio / Svantaggio
            const modeBtn = target.closest('.pcs-mode-btn');
            if (modeBtn) {
                rollMode = modeBtn.getAttribute('data-mode') || 'normal';
                updateRollModeButtons(win);
                return;
            }

            // Mostra/Nascondi barra Link/Import
            if (target.closest('#pcs-btn-toggle-import')) {
                const bar = document.getElementById('pcs-import-bar');
                if (bar) bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
                return;
            }

            // Pulsante Aggiorna Scheda
            if (target.closest('#pcs-btn-sync')) {
                const bar = document.getElementById('pcs-import-bar');
                const tok = getActiveToken();
                const hasUrl = tok && tok.pcSheet && tok.pcSheet.sourceUrl;
                if (!hasUrl && bar) bar.style.display = 'flex';
                await handleSyncOrImportAction(true);
                return;
            }

            // Pulsante 1: Apri Sorgente Dati JSON
            if (target.closest('#pcs-btn-open-source')) {
                const urlInput = document.getElementById('pcs-source-input');
                const tok = getActiveToken();
                const rawVal = (urlInput ? urlInput.value.trim() : '') || (tok?.pcSheet?.sourceUrl || '');
                const charId = extractCharacterId(rawVal);
                if (!charId) {
                    alert(tr('Inserisci prima il Link o ID numerico del personaggio nella casella!', 'Please enter the character Link or numeric ID in the box first!'));
                    if (urlInput) urlInput.focus();
                    return;
                }
                const fbBox = document.getElementById('pcs-fallback-panel');
                if (fbBox) fbBox.style.display = 'flex';
                const pasteArea = document.getElementById('pcs-json-paste-area');
                if (pasteArea) pasteArea.focus();
                awaitingClipboardSync = true;
                window.open(buildCharacterDataEndpoint(charId), '_blank', 'width=720,height=520');
                return;
            }

            // Pulsante 2: Applica Dati Incollati (senza navigator.clipboard.readText per evitare popup bloccanti del browser)
            if (target.closest('#pcs-btn-paste-clipboard')) {
                const urlInput = document.getElementById('pcs-source-input');
                const pasteArea = document.getElementById('pcs-json-paste-area');
                if (pasteArea && pasteArea.value.trim().startsWith('{')) {
                    const ok = applyRawJsonToCurrentToken(pasteArea.value.trim(), urlInput ? urlInput.value.trim() : '');
                    if (ok) pasteArea.value = '';
                    return;
                }
                if (urlInput && urlInput.value.trim().startsWith('{')) {
                    const rawJson = urlInput.value.trim();
                    urlInput.value = '';
                    applyRawJsonToCurrentToken(rawJson, '');
                    return;
                }
                const fbBox = document.getElementById('pcs-fallback-panel');
                if (fbBox) fbBox.style.display = 'flex';
                if (pasteArea) pasteArea.focus();
                if (typeof window.showToast === 'function') {
                    window.showToast(tr('📋 Premi Ctrl+V (o Tasto Destro ➔ Incolla) per caricare la scheda!', '📋 Press Ctrl+V (or Right Click ➔ Paste) to load the sheet!'));
                }
                return;
            }

            // Cambio Tab
            const tabBtn = target.closest('.pcs-tab-btn');
            if (tabBtn) {
                currentTab = tabBtn.getAttribute('data-tab') || 'combat';
                win.querySelectorAll('.pcs-tab-btn').forEach(b => b.classList.toggle('active', b === tabBtn));
                const tok = getActiveToken();
                if (tok) renderSheetBody(tok);
                return;
            }

            // Esporta singolo PG (.json)
            if (target.closest('#pcs-btn-export-single-json')) {
                const tok = getActiveToken();
                if (tok) exportSingleCharacterJson(tok);
                return;
            }

            // Ripristina singolo PG (.json)
            if (target.closest('#pcs-btn-import-single-json')) {
                const tok = getActiveToken();
                if (tok) importSingleCharacterJson(tok);
                return;
            }

            // Filtro Incantesimi (Tutti / Preparati)
            const spFilterBtn = target.closest('.pcs-spell-filter-btn');
            if (spFilterBtn) {
                spellFilter = spFilterBtn.getAttribute('data-filter') || 'all';
                const tok = getActiveToken();
                if (tok) renderSheetBody(tok);
                return;
            }

            // Espandi / Comprimi descrizione Incantesimo
            const spToggle = target.closest('.pcs-spell-toggle');
            if (spToggle) {
                const spName = spToggle.getAttribute('data-spell');
                if (spName) {
                    if (expandedSpells.has(spName)) expandedSpells.delete(spName);
                    else expandedSpells.add(spName);
                    const tok = getActiveToken();
                    if (tok) renderSheetBody(tok);
                }
                return;
            }

            // Espandi / Comprimi descrizione Privilegio/Tratto
            const ftToggle = target.closest('.pcs-feat-toggle');
            if (ftToggle) {
                const ftName = ftToggle.getAttribute('data-feat');
                if (ftName) {
                    if (expandedFeatures.has(ftName)) expandedFeatures.delete(ftName);
                    else expandedFeatures.add(ftName);
                    const tok = getActiveToken();
                    if (tok) renderSheetBody(tok);
                }
                return;
            }

            // Toggle Slot Incantesimo consumato/disponibile
            const slotPip = target.closest('.pcs-slot-pip');
            if (slotPip) {
                const tok = getActiveToken();
                if (!tok || !tok.pcSheet || !tok.pcSheet.spellcasting) return;
                const sIdx = parseInt(slotPip.getAttribute('data-slot-idx'), 10);
                const pipIdx = parseInt(slotPip.getAttribute('data-pip-idx'), 10);
                const slotObj = tok.pcSheet.spellcasting.slots[sIdx];
                if (slotObj) {
                    if (pipIdx < slotObj.used) slotObj.used = pipIdx;
                    else slotObj.used = pipIdx + 1;
                    commitSheetChanges(tok, false);
                    renderSheetBody(tok);
                }
                return;
            }

            // Toggle Usi Limitati Privilegi
            const featPip = target.closest('.pcs-feat-pip');
            if (featPip) {
                const tok = getActiveToken();
                if (!tok || !tok.pcSheet || !Array.isArray(tok.pcSheet.features)) return;
                const fIdx = parseInt(featPip.getAttribute('data-feat-idx'), 10);
                const pipIdx = parseInt(featPip.getAttribute('data-pip-idx'), 10);
                const featObj = tok.pcSheet.features[fIdx];
                if (featObj) {
                    if (pipIdx < featObj.usedUses) featObj.usedUses = pipIdx;
                    else featObj.usedUses = pipIdx + 1;
                    commitSheetChanges(tok, false);
                    renderSheetBody(tok);
                }
                return;
            }

            // Pulsante Riposo Lungo (ripristina PV, Slot Incantesimi e Usi Limitati)
            if (target.closest('#pcs-btn-long-rest')) {
                const tok = getActiveToken();
                if (!tok || !tok.pcSheet) return;
                tok.pcSheet.hpCurrent = tok.pcSheet.hpMax;
                tok.pcSheet.hpTemp = 0;
                if (tok.pcSheet.spellcasting && Array.isArray(tok.pcSheet.spellcasting.slots)) {
                    tok.pcSheet.spellcasting.slots.forEach(s => { s.used = 0; });
                }
                if (Array.isArray(tok.pcSheet.features)) {
                    tok.pcSheet.features.forEach(f => { f.usedUses = 0; });
                }
                commitSheetChanges(tok, true);
                renderSheetBody(tok);
                if (typeof window.showToast === 'function') {
                    window.showToast(`🌙 ${tok.pcSheet.name}: ${tr('Riposo Lungo completato (PV e Slot ripristinati)!', 'Long Rest completed (HP & Slots restored)!')}`);
                }
                return;
            }

            // Pulsanti Danno (-) e Cura (+) rapidi nella Scheda PG
            const hpModBtn = target.closest('.pcs-hp-quick-btn');
            if (hpModBtn) {
                const tok = getActiveToken();
                if (!tok || !tok.pcSheet) return;
                const deltaInput = document.getElementById('pcs-hp-delta-input');
                const val = Math.abs(parseInt(deltaInput ? deltaInput.value : 1) || 1);
                const isHeal = hpModBtn.getAttribute('data-dir') === 'heal';
                if (isHeal) {
                    tok.pcSheet.hpCurrent = Math.min(tok.pcSheet.hpMax, (tok.pcSheet.hpCurrent || 0) + val);
                } else {
                    let dmg = val;
                    if (tok.pcSheet.hpTemp > 0) {
                        const absorbed = Math.min(tok.pcSheet.hpTemp, dmg);
                        tok.pcSheet.hpTemp -= absorbed;
                        dmg -= absorbed;
                    }
                    tok.pcSheet.hpCurrent = Math.max(0, (tok.pcSheet.hpCurrent || 0) - dmg);
                }
                if (deltaInput) deltaInput.value = '';
                commitSheetChanges(tok, true);
                renderSheetBody(tok);
                return;
            }

            // Trigger di tiro dado cliccabile (.pcs-roll-trigger)
            const rollTrigger = target.closest('.pcs-roll-trigger');
            if (rollTrigger) {
                const tok = getActiveToken();
                const charName = tok?.pcSheet?.name || tok?.name || 'PG';
                const formula = rollTrigger.getAttribute('data-formula');
                const label = rollTrigger.getAttribute('data-label') || 'Tiro';
                const forceMode = e.shiftKey ? 'adv' : ((e.ctrlKey || e.altKey) ? 'dis' : null);
                executePcRoll(charName, formula, label, forceMode);
                return;
            }
        });

        // Listener change per input diretti (PV attuali, PV max, PV temp, CA, Monete, Note)
        win.addEventListener('change', (e) => {
            const target = e.target;
            const tok = getActiveToken();
            if (!tok || !tok.pcSheet) return;

            if (target.id === 'pcs-input-hp-curr') {
                tok.pcSheet.hpCurrent = Math.max(0, parseInt(target.value) || 0);
                commitSheetChanges(tok, true);
            } else if (target.id === 'pcs-input-hp-max') {
                tok.pcSheet.hpMax = Math.max(1, parseInt(target.value) || 1);
                commitSheetChanges(tok, true);
            } else if (target.id === 'pcs-input-hp-temp') {
                tok.pcSheet.hpTemp = Math.max(0, parseInt(target.value) || 0);
                commitSheetChanges(tok, false);
            } else if (target.id === 'pcs-input-ac') {
                tok.pcSheet.ac = Math.max(0, parseInt(target.value) || 10);
                commitSheetChanges(tok, true);
            } else if (target.classList.contains('pcs-currency-input')) {
                const coin = target.getAttribute('data-coin');
                if (coin && tok.pcSheet.currencies) {
                    tok.pcSheet.currencies[coin] = Math.max(0, parseInt(target.value) || 0);
                    commitSheetChanges(tok, false);
                }
            } else if (target.id === 'pcs-inventory-notes') {
                tok.pcSheet.notes = target.value;
                commitSheetChanges(tok, false);
            }
        });

        // Incolla immediato nell'area di testo Fallback
        win.addEventListener('paste', (e) => {
            const target = e.target;
            if (target && (target.id === 'pcs-json-paste-area' || target.id === 'pcs-source-input')) {
                setTimeout(() => {
                    const val = target.value.trim();
                    if (val.startsWith('{') && val.endsWith('}')) {
                        const urlInput = document.getElementById('pcs-source-input');
                        const srcUrl = (target.id !== 'pcs-source-input' && urlInput) ? urlInput.value.trim() : '';
                        target.value = srcUrl;
                        applyRawJsonToCurrentToken(val, srcUrl);
                    }
                }, 40);
            }
        });
        // Auto-salvataggio del Giornale dell'Avventura (Debounced, 350ms)
        let journalDebounceTimer = null;
        win.addEventListener('input', (e) => {
            if (e.target && e.target.id === 'pcs-journal-textarea') {
                const tok = getActiveToken();
                if (!tok) return;
                const text = e.target.value;
                const statusEl = document.getElementById('pcs-journal-status');
                const counterEl = document.getElementById('pcs-journal-counter');
                if (statusEl) {
                    statusEl.textContent = '✍️ ' + tr('Salvataggio...', 'Saving...');
                    statusEl.style.color = '#ffd54f';
                }
                if (counterEl) {
                    const chars = text.length;
                    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                    counterEl.textContent = `${chars} ${tr('caratteri', 'characters')} | ${words} ${tr('parole', 'words')}`;
                }
                if (journalDebounceTimer) clearTimeout(journalDebounceTimer);
                journalDebounceTimer = setTimeout(() => {
                    tok.adventureJournal = text;
                    tok.adventureJournalUpdatedAt = Date.now();
                    if (tok.pcSheet) tok.pcSheet.adventureJournal = text;
                    commitJournalChanges(tok);
                    if (statusEl) {
                        statusEl.textContent = '● ' + tr('Salvato', 'Saved');
                        statusEl.style.color = '#81c784';
                    }
                }, 350);
            }
        });
    }

    // =========================================================================
    // RENDERING DELLE TAVOLE (TAB)
    // =========================================================================
    function renderSheetModal(token) {
        const win = ensureModalDOM();
        if (!token) return;
        currentTokenId = token.id;

        const s = token.pcSheet;
        const nameEl = document.getElementById('pcs-header-name');
        const subEl = document.getElementById('pcs-header-sub');
        const avatarEl = document.getElementById('pcs-header-avatar');
        const srcInput = document.getElementById('pcs-source-input');
        const importBar = document.getElementById('pcs-import-bar');

        if (s) {
            if (nameEl) nameEl.textContent = s.name || token.name || 'Personaggio';
            if (subEl) subEl.textContent = `${s.race ? s.race + ' • ' : ''}${s.classes || ''} (${tr('Liv.', 'Lv.')} ${s.level || 1})`;
            if (avatarEl) {
                const imgSrc = s.avatarUrl || token.src || '';
                if (imgSrc) {
                    avatarEl.src = imgSrc;
                    avatarEl.style.display = 'block';
                } else {
                    avatarEl.style.display = 'none';
                }
            }
            if (srcInput && s.sourceUrl) srcInput.value = s.sourceUrl;
            if (importBar && s._vttPcSheet) importBar.style.display = 'none';
        } else {
            if (nameEl) nameEl.textContent = token.name || tr('Nuova Scheda PG', 'New PC Sheet');
            if (subEl) subEl.textContent = tr('Nessuna scheda associata — Inserisci il Link o ID qui sotto', 'No sheet linked — Enter Link or ID below');
            if (avatarEl) {
                if (token.src) {
                    avatarEl.src = token.src;
                    avatarEl.style.display = 'block';
                } else {
                    avatarEl.style.display = 'none';
                }
            }
            if (srcInput) srcInput.value = '';
            if (importBar) importBar.style.display = 'flex';
        }

        updateRollModeButtons(win);
        renderSheetBody(token);
    }

    function renderSheetBody(token) {
        const body = document.getElementById('pcs-body');
        if (!body) return;

        if (currentTab === 'journal') {
            body.innerHTML = renderJournalTab(token);
            return;
        }

        const s = token ? token.pcSheet : null;

        if (!s) {
            body.innerHTML = `
                <div style="text-align: center; padding: 45px 20px; color: #aaa;">
                    <div style="font-size: 38px; margin-bottom: 10px;">🧙</div>
                    <strong style="font-size: 15px; color: #ffd54f;">${tr('Nessuna Scheda PG caricata per questo Token', 'No PC Sheet loaded for this Token')}</strong>
                    <p style="font-size: 12px; color: #999; max-width: 440px; margin: 10px auto 16px auto; line-height: 1.45;">
                        ${tr('Inserisci il Link o ID numerico della scheda nella barra in alto e clicca <b>"🔗 1. Apri Dati"</b> e poi <b>"📋 2. Incolla Appunti"</b> per configurare automaticamente statistiche, abilità, attacchi e incantesimi.', 'Enter the character Link or numeric ID in the bar above and click <b>"🔗 1. Apri Dati"</b> then <b>"📋 2. Incolla Appunti"</b> to automatically configure stats, skills, attacks, and spells.')}
                    </p>
                </div>
            `;
            return;
        }

        // Sincronizza PV/CA se sono stati cambiati dal canvas/DM
        if (token.hpCurrent !== undefined && token.hpCurrent !== null) s.hpCurrent = token.hpCurrent;
        if (token.hpMax !== undefined && token.hpMax > 0) s.hpMax = token.hpMax;
        if (token.hpTemp !== undefined && token.hpTemp !== null) s.hpTemp = token.hpTemp;
        if (token.ac !== undefined && token.ac > 0) s.ac = token.ac;

        if (currentTab === 'combat') {
            body.innerHTML = renderCombatTab(s);
        } else if (currentTab === 'spells') {
            body.innerHTML = renderSpellsTab(s);
        } else if (currentTab === 'features') {
            body.innerHTML = renderFeaturesTab(s);
        } else if (currentTab === 'inventory') {
            body.innerHTML = renderInventoryTab(s);
        }
    }

    function renderCombatTab(s) {
        // 1. Barra superiore combattimento (CA, Iniziativa, Velocità, Competenza, Percezione Passiva, PV)
        const initSign = fmtMod(s.initBonus);
        const profSign = fmtMod(s.profBonus);

        let abilitiesHtml = '<div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 10px;">';
        ABILITY_META.forEach(meta => {
            const ab = (s.abilities && s.abilities[meta.key]) || { score: 10, mod: 0 };
            const modStr = fmtMod(ab.mod);
            const lbl = isEng() ? meta.labelEn : meta.labelIt;
            const fullLbl = isEng() ? meta.fullEn : meta.fullIt;
            const abTip = esc(ab.breakdown || `${fullLbl}: ${ab.score} [Modificatore: ${modStr}]`);
            abilitiesHtml += `
                <div class="pcs-ability-card pcs-roll-trigger" data-formula="${modStr}" data-label="${tr('Prova', 'Check')} ${fullLbl}" title="${abTip} - ${tr('Clicca per tirare Prova', 'Click to roll Check')} (1d20${modStr})">
                    <div style="font-size: 10.5px; color: #9fa8da; font-weight: bold;">${lbl}</div>
                    <div style="font-size: 16px; font-weight: bold; color: #ffd54f; margin: 1px 0;">🎲 ${modStr}</div>
                    <div style="font-size: 11px; color: #bbb; background: #14161b; display: inline-block; padding: 0 6px; border-radius: 8px;">${ab.score}</div>
                </div>
            `;
        });
        abilitiesHtml += '</div>';

        // 2. Tiri Salvezza (6)
        let savesHtml = '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-bottom: 8px;">';
        ABILITY_META.forEach(meta => {
            const sv = (s.saves && s.saves[meta.key]) || { prof: false, bonus: 0 };
            const modStr = fmtMod(sv.bonus);
            const lbl = isEng() ? meta.labelEn : meta.labelIt;
            const fullLbl = isEng() ? meta.fullEn : meta.fullIt;
            const dot = sv.prof ? '<span style="color:#00e676;" title="Competente">●</span>' : '<span style="color:#555;">○</span>';
            const svTip = esc(sv.breakdown || `TS ${fullLbl}: ${modStr}`);
            savesHtml += `
                <div class="pcs-row-item pcs-roll-trigger" data-formula="${modStr}" data-label="TS ${fullLbl}" title="${svTip} - ${tr('Clicca per tirare', 'Click to roll')} (1d20${modStr})" style="margin-bottom:0;">
                    <span>${dot} <strong>${lbl}</strong></span>
                    <span style="color: #ffd54f; font-weight: bold;">🎲 ${modStr}</span>
                </div>
            `;
        });
        savesHtml += '</div>';

        // 2b. Tre Punteggi Passivi Ufficiali (Percezione, Indagare, Intuizione)
        const passivesObj = s.passives || {};
        const passPercVal = passivesObj.perception?.value ?? (10 + (s.skills?.perception?.bonus || 0));
        const passInvVal = passivesObj.investigation?.value ?? (10 + (s.skills?.investigation?.bonus || 0));
        const passInsVal = passivesObj.insight?.value ?? (10 + (s.skills?.insight?.bonus || 0));

        const passPercTip = esc(passivesObj.perception?.breakdown || `Percezione Passiva: 10 + Percezione (${fmtMod(s.skills?.perception?.bonus || 0)}) = ${passPercVal}`);
        const passInvTip = esc(passivesObj.investigation?.breakdown || `Indagare Passivo: 10 + Indagare (${fmtMod(s.skills?.investigation?.bonus || 0)}) = ${passInvVal}`);
        const passInsTip = esc(passivesObj.insight?.breakdown || `Intuizione Passiva: 10 + Intuizione (${fmtMod(s.skills?.insight?.bonus || 0)}) = ${passInsVal}`);

        const passivesHtml = `
            <div style="margin-bottom: 9px; background: #161820; border: 1px solid #2d313c; border-radius: 5px; padding: 5px 8px;">
                <div style="font-size: 10.5px; font-weight: bold; color: #80cbc4; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
                    <span>👁️ ${tr('Punteggi Passivi', 'Passive Scores')}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                    <div class="pcs-row-item pcs-roll-trigger" data-formula="${fmtMod(s.skills?.perception?.bonus || 0)}" data-label="${tr('Percezione (Passiva)', 'Perception (Passive)')}" style="padding: 3px 6px; margin-bottom: 0; justify-content: space-between; font-size: 11px; cursor: pointer;" title="${passPercTip} - ${tr('Clicca per tirare Prova', 'Click to roll Check')}">
                        <span style="color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">👁️ ${tr('Percezione', 'Perception')}</span>
                        <strong style="color: #80cbc4; margin-left: 3px; font-size: 12px;">${passPercVal}</strong>
                    </div>
                    <div class="pcs-row-item pcs-roll-trigger" data-formula="${fmtMod(s.skills?.investigation?.bonus || 0)}" data-label="${tr('Indagare (Passivo)', 'Investigation (Passive)')}" style="padding: 3px 6px; margin-bottom: 0; justify-content: space-between; font-size: 11px; cursor: pointer;" title="${passInvTip} - ${tr('Clicca per tirare Prova', 'Click to roll Check')}">
                        <span style="color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">🔍 ${tr('Indagare', 'Investigation')}</span>
                        <strong style="color: #80cbc4; margin-left: 3px; font-size: 12px;">${passInvVal}</strong>
                    </div>
                    <div class="pcs-row-item pcs-roll-trigger" data-formula="${fmtMod(s.skills?.insight?.bonus || 0)}" data-label="${tr('Intuizione (Passiva)', 'Insight (Passive)')}" style="padding: 3px 6px; margin-bottom: 0; justify-content: space-between; font-size: 11px; cursor: pointer;" title="${passInsTip} - ${tr('Clicca per tirare Prova', 'Click to roll Check')}">
                        <span style="color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">💡 ${tr('Intuizione', 'Insight')}</span>
                        <strong style="color: #80cbc4; margin-left: 3px; font-size: 12px;">${passInsVal}</strong>
                    </div>
                </div>
            </div>
        `;

        // 3. Attacchi e Azioni Rapide
        let attacksHtml = '';
        const atks = Array.isArray(s.attacks) ? s.attacks : [];
        if (atks.length === 0) {
            attacksHtml = `<div style="color:#777; font-size:11px; padding:6px;">${tr('Nessun attacco rapido configurato.', 'No quick attacks configured.')}</div>`;
        } else {
            atks.forEach(a => {
                const hitBtn = (a.toHit !== null && a.toHit !== undefined)
                    ? `<button type="button" class="pcs-roll-trigger" data-formula="${fmtMod(a.toHit)}" data-label="${esc(a.name)} (${tr('Colpire', 'Hit')})" style="background:#1565c0; color:white; border:none; border-radius:4px; padding:2px 6px; font-size:11px; font-weight:bold;">🎯 ${fmtMod(a.toHit)}</button>`
                    : (a.save ? `<span style="background:#37474f; color:#80cbc4; border-radius:4px; padding:2px 5px; font-size:10px; font-weight:bold;">${esc(a.save)}</span>` : '');
                const dmgBtn = a.damage
                    ? `<button type="button" class="pcs-roll-trigger" data-formula="${esc(a.damage)}" data-label="${esc(a.name)} (${tr('Danni', 'Damage')} ${esc(a.dmgType || '')})" style="background:#b71c1c; color:white; border:none; border-radius:4px; padding:2px 6px; font-size:11px; font-weight:bold;">💥 ${esc(a.damage)}</button>`
                    : '';
                attacksHtml += `
                    <div class="pcs-row-item" style="gap: 4px;">
                        <div style="min-width: 0; flex: 1;">
                            <div style="font-weight: bold; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${esc(a.originalName ? a.name + ' (' + a.originalName + ')' : a.name)}">${esc(a.name)}</div>
                            <div style="font-size: 10px; color: #888;">${esc(a.notes || '')} ${a.dmgType ? '• ' + esc(a.dmgType) : ''}</div>
                        </div>
                        <div style="display: flex; gap: 4px; align-items: center; flex-shrink: 0;">
                            ${hitBtn}
                            ${dmgBtn}
                        </div>
                    </div>
                `;
            });
        }

        // 4. Lista 18 Abilità (Skills)
        let skillsHtml = '';
        SKILLS_META.forEach(sk => {
            const skObj = (s.skills && s.skills[sk.sub]) || { ab: sk.ab, prof: 0, bonus: 0, adv: false };
            const modStr = fmtMod(skObj.bonus);
            const nameDisp = isEng() ? sk.en : sk.it;
            const abMeta = ABILITY_META.find(a => a.key === sk.ab);
            const abShort = isEng() ? abMeta.labelEn : abMeta.labelIt;
            const icon = skObj.prof === 2
                ? '<span style="color:#ffd54f;" title="Maestria (Expertise)">★</span>'
                : (skObj.prof === 1 ? '<span style="color:#00e676;" title="Competente">●</span>' : (skObj.prof === 0.5 ? '<span style="color:#81d4fa;" title="Mezza Competenza">◐</span>' : '<span style="color:#555;">○</span>'));
            const advBadge = skObj.adv ? '<span style="color:#4caf50; font-size:10px; margin-left:3px;" title="Vantaggio sulla prova">▲</span>' : '';
            const skTip = esc(skObj.breakdown || `${nameDisp} (${modStr})`);

            skillsHtml += `
                <div class="pcs-row-item pcs-roll-trigger" data-formula="${modStr}" data-label="${nameDisp}" title="${skTip} - ${tr('Clicca per tirare', 'Click to roll')} (1d20${modStr})">
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${icon} ${esc(nameDisp)} <small style="color:#777;">(${abShort})</small>${advBadge}</span>
                    <span style="color: #ffd54f; font-weight: bold; flex-shrink: 0;">🎲 ${modStr}</span>
                </div>
            `;
        });

        const acTip = esc(s.acBreakdown || `Classe Armatura: ${s.ac || 10}`);
        const initTip = esc(s.initBreakdown || `Iniziativa: ${initSign}`);
        const speedTip = esc(s.speedBreakdown || `Velocità: ${esc(s.speed || '9m')}`);
        const profTip = esc(s.profBreakdown || `Bonus Competenza: ${profSign} (Livello ${s.level || 1})`);

        return `
            <!-- Barra Rapida Statistiche Combattimento & PV (Spaziata e ad alta leggibilità) -->
            <div style="display: flex; flex-direction: column; gap: 7px; margin-bottom: 10px; background: #1e2129; padding: 8px 10px; border-radius: 6px; border: 1px solid #323644;">
                <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: space-between;">
                    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                        <div style="display: inline-flex; align-items: center; gap: 6px; background: #14161c; padding: 4px 10px; border-radius: 5px; border: 1px solid #4fc3f7;" title="${acTip}">
                            <span style="font-size: 11px; color: #4fc3f7; font-weight: bold;">🛡️ CA</span>
                            <input type="number" id="pcs-input-ac" value="${s.ac || 10}" style="width: 56px; height: 26px; padding: 2px 6px; background: #0c0e12; color: #fff; border: 1px solid #4fc3f766; border-radius: 4px; font-weight: bold; font-size: 15px; text-align: center;">
                        </div>
                        <div class="pcs-roll-trigger" data-formula="${initSign}" data-label="Iniziativa" style="display: inline-flex; align-items: center; gap: 5px; background: #14161c; padding: 6px 10px; border-radius: 5px; border: 1px solid #ffb74d;" title="${initTip} - ${tr('Clicca per tirare Iniziativa', 'Click to roll Initiative')} (1d20${initSign})">
                            <span style="font-size: 11px; color: #ffb74d; font-weight: bold;">⚡ Iniz:</span>
                            <strong style="font-size: 13.5px; color: #fff;">🎲 ${initSign}</strong>
                        </div>
                        <div style="display: inline-flex; align-items: center; gap: 5px; background: #14161c; padding: 6px 10px; border-radius: 5px; border: 1px solid #444;" title="${speedTip}">
                            <span style="font-size: 11px; color: #aaa;">🦶 Vel:</span>
                            <strong style="font-size: 12.5px; color: #fff;">${esc(s.speed || '9m')}</strong>
                        </div>
                    </div>
                    <div style="display: inline-flex; align-items: center; gap: 6px; background: #14161c; padding: 6px 10px; border-radius: 5px; border: 1px solid #444;" title="${profTip} • ${passPercTip}">
                        <span style="font-size: 11px; color: #ce93d8; font-weight: bold;">🎯 Comp ${profSign}</span>
                        <span style="color: #555;">•</span>
                        <span style="font-size: 11px; color: #80cbc4; font-weight: bold;">👁️ Pass ${s.passivePerception || 10}</span>
                    </div>
                </div>

                <!-- Gestione Rapida PV (Rettangoli ampliati del +65% e senza frecce di incremento) -->
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; background: #14161c; padding: 6px 10px; border-radius: 5px; border: 1px solid #ef5350;">
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <span style="color: #ef5350; font-weight: bold; font-size: 12px; margin-right: 2px;">❤️ PV:</span>
                        <input type="number" id="pcs-input-hp-curr" value="${s.hpCurrent ?? s.hpMax}" style="width: 66px; height: 26px; padding: 2px 6px; background: #0c0e12; color: #00e676; border: 1px solid #444; border-radius: 4px; text-align: center; font-weight: bold; font-size: 14px;" title="PV Attuali">
                        <span style="color: #888; font-weight: bold; font-size: 13px;">/</span>
                        <input type="number" id="pcs-input-hp-max" value="${s.hpMax || 10}" style="width: 66px; height: 26px; padding: 2px 6px; background: #0c0e12; color: #e0e0e0; border: 1px solid #444; border-radius: 4px; text-align: center; font-weight: bold; font-size: 14px;" title="PV Massimi">
                        <span style="color: #4fc3f7; font-size: 11px; font-weight: bold; margin-left: 6px;">🛡️ Temp:</span>
                        <input type="number" id="pcs-input-hp-temp" value="${s.hpTemp || 0}" placeholder="0" style="width: 60px; height: 26px; padding: 2px 6px; background: #0c0e12; color: #4fc3f7; border: 1px solid #37474f; border-radius: 4px; text-align: center; font-weight: bold; font-size: 13px;" title="PV Temporanei">
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <input type="number" id="pcs-hp-delta-input" placeholder="Danno/Cura" style="width: 82px; height: 26px; padding: 2px 6px; background: #0c0e12; color: #fff; border: 1px solid #555; border-radius: 4px; text-align: center; font-size: 12px; font-weight: bold;" title="Quantità di Danno o Cura da applicare">
                        <button type="button" class="pcs-hp-quick-btn" data-dir="dmg" style="background: #c62828; color: white; border: none; border-radius: 4px; width: 30px; height: 26px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; cursor: pointer;" title="Applica Danno (-)">−</button>
                        <button type="button" class="pcs-hp-quick-btn" data-dir="heal" style="background: #2e7d32; color: white; border: none; border-radius: 4px; width: 30px; height: 26px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; cursor: pointer;" title="Applica Cura (+)">+</button>
                    </div>
                </div>
            </div>

            <!-- 6 Caratteristiche -->
            ${abilitiesHtml}

            <!-- Griglia a 2 Colonne: Sinistra (Tiri Salvezza + Passive + Attacchi) | Destra (18 Abilità) -->
            <div style="display: grid; grid-template-columns: 1.05fr 1fr; gap: 10px; align-items: start;">
                <div>
                    <div style="font-size: 11.5px; font-weight: bold; color: #ffd54f; margin-bottom: 5px; border-bottom: 1px solid #333; padding-bottom: 2px;">🛡️ ${tr('Tiri Salvezza', 'Saving Throws')}</div>
                    ${savesHtml}
                    ${passivesHtml}
                    <div style="font-size: 11.5px; font-weight: bold; color: #ef5350; margin-bottom: 5px; border-bottom: 1px solid #333; padding-bottom: 2px;">⚔️ ${tr('Attacchi & Azioni Rapide', 'Attacks & Quick Actions')}</div>
                    ${attacksHtml}
                </div>
                <div>
                    <div style="font-size: 11.5px; font-weight: bold; color: #4dd0e1; margin-bottom: 5px; border-bottom: 1px solid #333; padding-bottom: 2px;">🎓 ${tr('Abilità (Skills)', 'Skills')}</div>
                    ${skillsHtml}
                </div>
            </div>
        `;
    }

    function renderSpellsTab(s) {
        const sc = s.spellcasting || { ability: 'INT', saveDC: 10, attackBonus: 0, slots: [], spells: [] };
        const atkSign = fmtMod(sc.attackBonus);

        // Barra Slot Incantesimi interattiva
        let slotsHtml = '';
        if (Array.isArray(sc.slots) && sc.slots.length > 0) {
            slotsHtml = '<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">';
            sc.slots.forEach((sl, sIdx) => {
                if (!sl.max || sl.max <= 0) return;
                let pips = '';
                for (let p = 0; p < sl.max; p++) {
                    const isUsed = p < (sl.used || 0);
                    pips += `<span class="pcs-slot-pip" data-slot-idx="${sIdx}" data-pip-idx="${p}" style="cursor:pointer; font-size:15px; color:${isUsed ? '#555' : '#ab47bc'}; padding:0 2px;" title="${isUsed ? tr('Slot consumato (clicca per liberare)', 'Used slot (click to restore)') : tr('Slot disponibile (clicca per consumare)', 'Available slot (click to spend)')}">${isUsed ? '○' : '●'}</span>`;
                }
                slotsHtml += `
                    <div style="background: #1d2027; border: 1px solid #4a148c; border-radius: 5px; padding: 4px 8px; display: flex; align-items: center; gap: 5px;">
                        <strong style="font-size: 11px; color: #ce93d8;">${sl.isPact ? 'Patto' : tr('Liv', 'Lv')} ${sl.level}:</strong>
                        <div style="display: inline-flex; align-items: center;">${pips}</div>
                        <small style="color: #888; font-size: 10px;">(${sl.max - (sl.used || 0)}/${sl.max})</small>
                    </div>
                `;
            });
            slotsHtml += '</div>';
        }

        const allSpells = Array.isArray(sc.spells) ? sc.spells : [];
        const filteredSpells = spellFilter === 'prepared'
            ? allSpells.filter(sp => sp.level === 0 || sp.prepared)
            : allSpells;

        let spellsListHtml = '';
        if (filteredSpells.length === 0) {
            spellsListHtml = `<div style="color:#777; text-align:center; padding:25px;">${tr('Nessun incantesimo presente in questa vista.', 'No spells in this view.')}</div>`;
        } else {
            let lastLvl = -1;
            filteredSpells.forEach(sp => {
                if (sp.level !== lastLvl) {
                    lastLvl = sp.level;
                    const lvlTitle = sp.level === 0 ? `✨ ${tr('Trucchetti (Livello 0)', 'Cantrips (Level 0)')}` : `🔮 ${tr('Incantesimi di', 'Level')} ${sp.level}° ${tr('Livello', 'Spells')}`;
                    spellsListHtml += `<div style="font-size: 12px; font-weight: bold; color: #ce93d8; border-bottom: 1px solid #4a148c; padding-bottom: 2px; margin: 10px 0 5px 0;">${lvlTitle}</div>`;
                }

                const prepBadge = sp.level === 0
                    ? '<span style="color:#80cbc4; font-size:10px;" title="Trucchetto">★</span>'
                    : (sp.prepared ? '<span style="color:#00e676; font-size:10px;" title="Preparato">●</span>' : '<span style="color:#555; font-size:10px;" title="Nel libro / Non preparato">○</span>');
                const concBadge = sp.concentration ? '<span style="background:#311b92; color:#b388ff; padding:0 4px; border-radius:3px; font-size:9.5px; margin-left:4px;" title="Concentrazione">C</span>' : '';
                const ritBadge = sp.ritual ? '<span style="background:#1b5e20; color:#a5d6a7; padding:0 4px; border-radius:3px; font-size:9.5px; margin-left:3px;" title="Rituale">R</span>' : '';

                const atkBtn = sp.isAttack
                    ? `<button type="button" class="pcs-roll-trigger" data-formula="${atkSign}" data-label="${esc(sp.name)} (${tr('Attacco Inc.', 'Spell Atk')})" style="background:#1565c0; color:white; border:none; border-radius:4px; padding:2px 6px; font-size:10.5px; font-weight:bold;">🎯 ${atkSign}</button>`
                    : '';
                const saveBadge = sp.save
                    ? `<span style="background:#263238; color:#80deea; border:1px solid #00838f; border-radius:4px; padding:1px 5px; font-size:10px; font-weight:bold;">TS ${esc(sp.save)} ${sc.saveDC}</span>`
                    : '';
                const dmgBtn = sp.formula
                    ? `<button type="button" class="pcs-roll-trigger" data-formula="${esc(sp.formula)}" data-label="${esc(sp.name)} (${esc(sp.dmgType || 'Effetto')})" style="background:#6a1b9a; color:#fff; border:none; border-radius:4px; padding:2px 6px; font-size:10.5px; font-weight:bold;">🎲 ${esc(sp.formula)}</button>`
                    : '';

                const isExp = expandedSpells.has(sp.name);
                const descBlock = isExp && sp.desc
                    ? `<div style="margin-top:5px; padding-top:5px; border-top:1px dashed #333; color:#ccc; font-size:11px; line-height:1.4;">${formatTextWithRollButtons(sp.desc, sp.name)}</div>`
                    : '';

                spellsListHtml += `
                    <div class="pcs-row-item" style="flex-direction: column; align-items: stretch;">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
                            <div class="pcs-spell-toggle" data-spell="${esc(sp.name)}" style="cursor: pointer; min-width: 0; flex: 1;" title="${tr('Clicca per mostrare/nascondere i dettagli', 'Click to toggle details')}">
                                ${prepBadge} <strong style="color: #fff;">${esc(sp.name)}</strong>${concBadge}${ritBadge}
                                <span style="color: #888; font-size: 10.5px; margin-left: 5px;">${esc(sp.time || '')} • ${esc(sp.range || '')} ${sp.school ? '• ' + esc(sp.school) : ''}</span>
                            </div>
                            <div style="display: flex; gap: 4px; align-items: center; flex-shrink: 0;">
                                ${saveBadge}
                                ${atkBtn}
                                ${dmgBtn}
                                <button type="button" class="pcs-spell-toggle" data-spell="${esc(sp.name)}" style="background:#2c303b; color:#aaa; border:none; border-radius:3px; padding:2px 5px; font-size:10px; cursor:pointer;">${isExp ? '▲' : '📖'}</button>
                            </div>
                        </div>
                        ${descBlock}
                    </div>
                `;
            });
        }

        return `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; background: #1e2129; padding: 7px 10px; border-radius: 6px; border: 1px solid #4a148c; margin-bottom: 8px;">
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                    <span><small style="color:#aaa;">${tr('Caratt.', 'Ability')}:</small> <strong style="color:#ce93d8;">${esc(sc.ability)}</strong></span>
                    <span><small style="color:#aaa;">CD Salvezza:</small> <strong style="color:#ffd54f; font-size:13px;">${sc.saveDC}</strong></span>
                    <span class="pcs-roll-trigger" data-formula="${atkSign}" data-label="${tr('Attacco Incantesimo', 'Spell Attack')}" style="background:#1565c0; color:white; padding:2px 7px; border-radius:4px; font-weight:bold;">🎯 ${tr('Attacco Inc.', 'Spell Atk')} ${atkSign}</span>
                </div>
                <div style="display: flex; gap: 5px; align-items: center;">
                    <button type="button" class="pcs-spell-filter-btn" data-filter="all" style="padding:3px 7px; border-radius:4px; border:1px solid #555; background:${spellFilter === 'all' ? '#4a148c' : '#14161c'}; color:#fff; font-size:11px; cursor:pointer;">${tr('Tutti', 'All')} (${allSpells.length})</button>
                    <button type="button" class="pcs-spell-filter-btn" data-filter="prepared" style="padding:3px 7px; border-radius:4px; border:1px solid #555; background:${spellFilter === 'prepared' ? '#4a148c' : '#14161c'}; color:#fff; font-size:11px; cursor:pointer;">● ${tr('Preparati', 'Prepared')}</button>
                    <button type="button" id="pcs-btn-long-rest" style="padding:3px 7px; border-radius:4px; border:1px solid #00897b; background:#004d40; color:#80cbc4; font-size:11px; font-weight:bold; cursor:pointer;" title="Ripristina tutti gli Slot Incantesimo e i PV al massimo">🌙 ${tr('Riposo Lungo', 'Long Rest')}</button>
                </div>
            </div>
            ${slotsHtml}
            ${spellsListHtml}
        `;
    }

    function renderFeaturesTab(s) {
        const feats = Array.isArray(s.features) ? s.features : [];
        if (feats.length === 0) {
            return `<div style="color:#777; text-align:center; padding:25px;">${tr('Nessun privilegio o tratto registrato.', 'No features or traits recorded.')}</div>`;
        }

        const catLabels = {
            action: `⚡ ${tr('Azioni Speciali & Usi Limitati', 'Special Actions & Limited Uses')}`,
            class: `⚔️ ${tr('Privilegi di Classe & Sottoclasse', 'Class & Subclass Features')}`,
            feat: `🌟 ${tr('Talenti (Feats)', 'Feats')}`,
            race: `🧬 ${tr('Tratti Razziali', 'Racial Traits')}`
        };

        let html = '';
        ['action', 'class', 'feat', 'race'].forEach(catKey => {
            const group = feats.map((f, idx) => ({ f, idx })).filter(x => x.f.cat === catKey);
            if (group.length === 0) return;

            html += `<div style="font-size: 12px; font-weight: bold; color: #ffd54f; border-bottom: 1px solid #444; padding-bottom: 2px; margin: 10px 0 5px 0;">${catLabels[catKey]}</div>`;
            group.forEach(({ f, idx }) => {
                let pipsHtml = '';
                if (f.maxUses > 0) {
                    for (let p = 0; p < f.maxUses; p++) {
                        const isUsed = p < (f.usedUses || 0);
                        pipsHtml += `<span class="pcs-feat-pip" data-feat-idx="${idx}" data-pip-idx="${p}" style="cursor:pointer; font-size:14px; color:${isUsed ? '#555' : '#00e676'}; padding:0 2px;">${isUsed ? '○' : '●'}</span>`;
                    }
                }
                const isExp = expandedFeatures.has(f.name) || f.maxUses > 0;
                const descHtml = (isExp && f.desc)
                    ? `<div style="margin-top:4px; padding-top:4px; border-top:1px dashed #333; color:#ccc; font-size:11px; line-height:1.42;">${formatTextWithRollButtons(f.desc, f.name)}</div>`
                    : '';

                html += `
                    <div class="pcs-row-item" style="flex-direction: column; align-items: stretch;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div class="pcs-feat-toggle" data-feat="${esc(f.name)}" style="cursor: pointer; font-weight: bold; color: #81d4fa; flex: 1;">
                                ${esc(f.name)}
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                ${pipsHtml}
                                <button type="button" class="pcs-feat-toggle" data-feat="${esc(f.name)}" style="background:#2c303b; color:#aaa; border:none; border-radius:3px; padding:1px 5px; font-size:10px; cursor:pointer;">${isExp ? '▲' : '▼'}</button>
                            </div>
                        </div>
                        ${descHtml}
                    </div>
                `;
            });
        });

        return html;
    }

    function renderInventoryTab(s) {
        const cur = s.currencies || { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };
        const items = Array.isArray(s.inventory) ? s.inventory : [];

        const coinsMeta = [
            { k: 'pp', lbl: 'MP (Platino)', color: '#e0e0e0' },
            { k: 'gp', lbl: 'MO (Oro)', color: '#ffd54f' },
            { k: 'ep', lbl: 'ME (Electrum)', color: '#80cbc4' },
            { k: 'sp', lbl: 'MA (Argento)', color: '#b0bec5' },
            { k: 'cp', lbl: 'MR (Rame)', color: '#ff8a65' }
        ];

        let coinsHtml = '<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 10px;">';
        coinsMeta.forEach(c => {
            coinsHtml += `
                <div style="background: #1d2027; border: 1px solid #333; border-radius: 5px; padding: 5px; text-align: center;">
                    <div style="font-size: 10px; color: ${c.color}; font-weight: bold; margin-bottom: 2px;">${c.lbl}</div>
                    <input type="number" class="pcs-currency-input" data-coin="${c.k}" value="${cur[c.k] || 0}" min="0" style="width: 100%; background: #101216; color: #fff; border: 1px solid #444; border-radius: 3px; text-align: center; font-weight: bold; font-size: 12px; padding: 2px; box-sizing: border-box;">
                </div>
            `;
        });
        coinsHtml += '</div>';

        let itemsHtml = '';
        if (items.length === 0) {
            itemsHtml = `<div style="color:#777; padding:12px; text-align:center;">${tr('Nessun oggetto in inventario.', 'No items in inventory.')}</div>`;
        } else {
            items.forEach(it => {
                const eqBadge = it.equipped
                    ? `<span style="background:#1b5e20; color:#a5d6a7; padding:1px 5px; border-radius:3px; font-size:9.5px; font-weight:bold;">${tr('Equip.', 'Equipped')}</span>`
                    : '';
                itemsHtml += `
                    <div class="pcs-row-item">
                        <div>
                            <strong style="color: ${it.equipped ? '#fff' : '#bbb'};">${esc(it.name)}</strong>
                            ${it.qty > 1 ? `<span style="color:#ffd54f; font-weight:bold; margin-left:4px;">x${it.qty}</span>` : ''}
                            <small style="color:#777; margin-left:6px;">${esc(it.type || '')}</small>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                            ${eqBadge}
                            ${it.weight ? `<small style="color:#888;">${it.weight} lb</small>` : ''}
                        </div>
                    </div>
                `;
            });
        }

        return `
            <div style="font-size: 11.5px; font-weight: bold; color: #ffd54f; margin-bottom: 5px;">💰 ${tr('Monete & Valuta', 'Currency')}</div>
            ${coinsHtml}
            <div style="font-size: 11.5px; font-weight: bold; color: #81d4fa; margin-bottom: 5px; border-bottom: 1px solid #333; padding-bottom: 2px;">🎒 ${tr('Equipaggiamento & Zaino', 'Equipment & Backpack')} (${items.length})</div>
            <div style="max-height: 240px; overflow-y: auto; margin-bottom: 10px;">${itemsHtml}</div>
            <div style="font-size: 11.5px; font-weight: bold; color: #a5d6a7; margin-bottom: 4px;">📝 ${tr('Appunti & Oggetti Extra del Giocatore', 'Player Notes & Extra Items')}</div>
            <textarea id="pcs-inventory-notes" placeholder="${tr('Scrivi qui appunti, cariche oggetti, pozioni o note di sessione...', 'Write notes, item charges, potions, or session notes here...')}" style="width: 100%; height: 80px; background: #101216; color: #e0e0e0; border: 1px solid #3a3f4d; border-radius: 5px; padding: 6px; font-family: inherit; font-size: 11.5px; box-sizing: border-box; resize: vertical;">${esc(s.notes || '')}</textarea>
        `;
    }

    function renderJournalTab(token) {
        if (!token) return '';
        const journalText = token.adventureJournal || (token.pcSheet && token.pcSheet.adventureJournal) || '';
        const chars = journalText.length;
        const words = journalText.trim() ? journalText.trim().split(/\s+/).length : 0;
        const charName = token.name || (token.pcSheet ? token.pcSheet.name : 'Personaggio');

        return `
            <div class="pcs-journal-container" style="display:flex; flex-direction:column; height: 100%; min-height: 420px; gap: 8px;">
                <!-- Header Journal -->
                <div style="display: flex; justify-content: space-between; align-items: center; background: #1a1d24; border: 1px solid #333946; border-radius: 6px; padding: 7px 10px; flex-wrap: wrap; gap: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">📖</span>
                        <div>
                            <strong style="color: #ffd54f; font-size: 13.5px;">${tr("Giornale dell'Avventura", "Adventure Journal")}</strong>
                            <span id="pcs-journal-status" style="font-size: 11px; color: #81c784; margin-left: 8px;">● ${tr('Salvato', 'Saved')}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <button type="button" id="pcs-btn-export-single-json" style="background:#263238; color:#80deea; border:1px solid #00838f; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px;" title="${tr('Scarica Scheda e Giornale di questo personaggio in file .json', 'Download Sheet and Journal for this character as .json file')}">💾 ${tr('Esporta PG (.json)', 'Export PC (.json)')}</button>
                        <button type="button" id="pcs-btn-import-single-json" style="background:#263238; color:#ffd54f; border:1px solid #fbc02d; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px;" title="${tr('Ripristina backup Scheda e Giornale da file .json', 'Restore Sheet and Journal backup from .json file')}">📂 ${tr('Ripristina PG', 'Restore PC')}</button>
                    </div>
                </div>

                <!-- Textarea Journal -->
                <div style="flex: 1; display:flex; flex-direction:column; position: relative;">
                    <textarea id="pcs-journal-textarea" placeholder="${tr('Scrivi qui le note di sessione, indizi, nomi di PNG, missioni, promemoria e avventure personali di ' + charName + '...\n\nLe modifiche si salvano automaticamente e NON verranno MAI cancellate né modificate dagli aggiornamenti della scheda!', 'Write session notes, clues, NPC names, quests, reminders and personal adventures for ' + charName + ' here...\n\nChanges save automatically and will NEVER be erased or modified by character sheet updates!')}" style="flex: 1; width: 100%; min-height: 330px; background: #12141a; color: #e0e0e0; border: 1px solid #2d3340; border-radius: 6px; padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; resize: vertical; box-sizing: border-box; outline: none;">${esc(journalText)}</textarea>
                </div>

                <!-- Footer Journal -->
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #78909c; padding: 2px 4px; flex-wrap: wrap; gap: 6px;">
                    <span id="pcs-journal-counter">${chars} ${tr('caratteri', 'characters')} | ${words} ${tr('parole', 'words')}</span>
                    <span style="color: #4db6ac;">🛡️ ${tr('Scollegato da D&D Beyond: i tuoi appunti sono protetti e persistenti', 'Decoupled from D&D Beyond: your notes are protected and persistent')}</span>
                </div>
            </div>
        `;
    }

    function exportSingleCharacterJson(token) {
        if (!token) return;
        const exportObj = {
            format: 'TABLETOP_CHARACTER_BACKUP',
            version: 1,
            exportedAt: new Date().toISOString(),
            id: token.id,
            name: token.name || 'Personaggio',
            category: token.category || 'personaggi',
            src: token.src || '',
            hpMax: token.hpMax || 0,
            hpCurrent: token.hpCurrent !== undefined ? token.hpCurrent : (token.hpMax || 0),
            ac: token.ac || 10,
            owners: token.owners || (token.owner ? [token.owner] : []),
            owner: token.owner || '',
            pcSheet: token.pcSheet || null,
            adventureJournal: token.adventureJournal || '',
            evocationPresets: token.evocationPresets || []
        };
        const jsonStr = JSON.stringify(exportObj, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeName = (token.name || 'Personaggio').replace(/[^a-zA-Z0-9_\-]/g, '_');
        a.download = `${safeName}_Scheda_e_Giornale.json`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof window.showToast === 'function') {
            window.showToast(`💾 Backup salvato per "${token.name || 'Personaggio'}"!`);
        }
    }

    function importSingleCharacterJson(token) {
        if (!token) return;
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,application/json';
        fileInput.style.display = 'none';
        fileInput.onchange = (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (re) => {
                try {
                    const data = JSON.parse(re.target.result);
                    if (data.pcSheet) token.pcSheet = data.pcSheet;
                    if (data.adventureJournal !== undefined) token.adventureJournal = data.adventureJournal;
                    if (data.evocationPresets !== undefined) token.evocationPresets = data.evocationPresets;
                    if (data.hpMax !== undefined) token.hpMax = data.hpMax;
                    if (data.hpCurrent !== undefined) token.hpCurrent = data.hpCurrent;
                    if (data.ac !== undefined) token.ac = data.ac;
                    if (data.name) token.name = data.name;
                    if (data.owners) token.owners = data.owners;
                    if (data.owner) token.owner = data.owner;

                    commitSheetChanges(token, true);
                    renderSheetModal(token);
                    if (typeof window.showToast === 'function') {
                        window.showToast(`✅ Backup ripristinato con successo per "${token.name}"!`);
                    }
                } catch (err) {
                    alert('File di backup non valido o danneggiato: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    // Incolla istantaneo con Ctrl+V ovunque nella finestra Scheda PG (ZERO popup di autorizzazione del browser!)
    if (typeof document !== 'undefined') {
        document.addEventListener('paste', (e) => {
            const win = document.getElementById('pc-sheet-window');
            if (!win || win.style.display === 'none') return;
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.id === 'pcs-inventory-notes' || activeEl.id === 'pcs-journal-textarea')) return;
            const clipData = e.clipboardData || window.clipboardData;
            if (!clipData) return;
            const pastedText = (clipData.getData('text/plain') || '').trim();
            if (pastedText.startsWith('{') && pastedText.endsWith('}')) {
                e.preventDefault();
                const urlInput = document.getElementById('pcs-source-input');
                const pasteArea = document.getElementById('pcs-json-paste-area');
                let srcUrl = '';
                if (urlInput) {
                    const uVal = urlInput.value.trim();
                    if (uVal && !uVal.startsWith('{')) srcUrl = uVal;
                }
                if (pasteArea) pasteArea.value = '';
                applyRawJsonToCurrentToken(pastedText, srcUrl);
            }
        });
    }

    const pcSheetManager = {
        open(token = null) {
            const target = token || getActiveToken();
            if (!target) {
                alert(tr('Seleziona prima un token sulla mappa!', 'Select a token on the map first!'));
                return;
            }
            const win = ensureModalDOM();
            win.style.display = 'flex';
            renderSheetModal(target);
        },
        close() {
            const win = document.getElementById('pc-sheet-window');
            if (win) win.style.display = 'none';
            awaitingClipboardSync = false;
        },
        refreshIfOpen(tokenId) {
            const win = document.getElementById('pc-sheet-window');
            if (!win || win.style.display === 'none') return;
            if (!tokenId || tokenId === currentTokenId) {
                const tok = getActiveToken();
                if (tok) renderSheetModal(tok);
            }
        },
        parseCharacterSheetJSON,
        extractCharacterId,
        exportSingleCharacterJson,
        importSingleCharacterJson
    };

    if (typeof window !== 'undefined') {
        window.pcSheetManager = pcSheetManager;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = pcSheetManager;
    }
})();
