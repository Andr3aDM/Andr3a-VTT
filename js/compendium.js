/**
 * compendium.js - Gestione Compendio Mostri Open5e & Statblock DM
 * Permette di cercare mostri in tempo reale via Open5e, importare JSON e Token creatura,
 * ripulire tutti i tag e formattazioni interne ({h}, {hom}, {atk}, {@recharge}, ecc.),
 * tradurre istantaneamente la scheda in Italiano con la terminologia ufficiale D&D 5e,
 * visualizzare la scheda completa e tirare i dadi con 1 click direttamente in chat!
 */

(function() {
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/[&<>'"]/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[c]));
    }

    function sanitizeImageSrc(src) {
        if (!src || typeof src !== 'string') return '';
        const trimmed = src.trim();
        const low = trimmed.toLowerCase();
        if (low.startsWith('data:image/') || low.startsWith('http://') || low.startsWith('https://') || low.startsWith('./') || low.startsWith('/')) {
            return trimmed;
        }
        return '';
    }

    const searchCache = new Map();
    let currentMonster = null;
    let rawMonster = null;
    let isItalianMode = false;
    let debounceTimer = null;
    let pendingImportTokenSrc = null;

    function getEngine() {
        return (typeof window !== 'undefined' && window.engine) ? window.engine : ((typeof engine !== 'undefined') ? engine : null);
    }

    // ==========================================
    // TRADUZIONE GOOGLE BATCH (ALTA QUALITÀ)
    // ==========================================
    async function translateGoogle(text) {
        if (!text || typeof text !== 'string' || !text.trim()) return text;
        try {
            const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=it&dt=t&q=' + encodeURIComponent(text);
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            if (Array.isArray(data) && Array.isArray(data[0])) {
                return data[0].map(x => x[0]).join('');
            }
            return text;
        } catch (e) {
            return text;
        }
    }

    async function translateBatch(texts) {
        if (!texts || texts.length === 0) return [];
        const validIndexes = [];
        const toTranslate = [];
        texts.forEach((t, i) => {
            if (t && typeof t === 'string' && t.trim()) {
                validIndexes.push(i);
                toTranslate.push(t.trim());
            }
        });
        if (toTranslate.length === 0) return texts;

        const separator = '\n<<<SPLIT>>>\n';
        const joined = toTranslate.join(separator);
        const translatedJoined = await translateGoogle(joined);
        const split = translatedJoined.split(/<<<SPLIT>>>/i).map(s => s.trim());

        const result = [...texts];
        validIndexes.forEach((origIdx, i) => {
            if (split[i] !== undefined) result[origIdx] = split[i];
        });
        return result;
    }

    function preProcessEnglish(text) {
        if (!text || typeof text !== 'string') return text || '';
        let t = text;
        t = t.replace(/(\d+)-foot-radius\s+sphere/gi, 'sfera con raggio di [[$1]]');
        t = t.replace(/(\d+)-foot-radius/gi, 'raggio di [[$1]]');
        t = t.replace(/(\d+)-foot\s+cone/gi, 'cono di [[$1]]');
        t = t.replace(/(\d+)-foot\s+line/gi, 'linea di [[$1]]');
        t = t.replace(/(\d+)-foot\s+cube/gi, 'cubo di [[$1]]');
        t = t.replace(/within\s+(\d+)\s*(?:feet|ft\.)/gi, 'entro [[$1]]');
        return t;
    }

    function postProcessDndItalian(text) {
        if (!text || typeof text !== 'string') return text || '';
        let t = text;

        // Ripristina distanze protette
        t = t.replace(/\[\[\s*(\d+(?:\/\d+)?)\s*(?:ft\.|feet|piedi|m|metri)?\s*\]\]/gi, (m, p1) => p1 + ' ft.');

        // Formule di attacco standard D&D
        t = t.replace(/Melee or Ranged Weapon Attack:/gi, 'Attacco con Arma da Mischia o a Distanza:');
        t = t.replace(/Melee Weapon Attack:/gi, 'Attacco con Arma da Mischia:');
        t = t.replace(/Ranged Weapon Attack:/gi, 'Attacco con Arma a Distanza:');
        t = t.replace(/Melee or Ranged Attack Roll:/gi, 'Attacco con Arma da Mischia o a Distanza:');
        t = t.replace(/Melee Attack Roll:/gi, 'Attacco con Arma da Mischia:');
        t = t.replace(/Ranged Attack Roll:/gi, 'Attacco con Arma a Distanza:');
        t = t.replace(/Melee Spell Attack:/gi, 'Attacco con Incantesimo da Mischia:');
        t = t.replace(/Ranged Spell Attack:/gi, 'Attacco con Incantesimo a Distanza:');
        t = t.replace(/Attacco con arma da mischia o a distanza:/gi, 'Attacco con Arma da Mischia o a Distanza:');
        t = t.replace(/Attacco con arma da mischia:/gi, 'Attacco con Arma da Mischia:');
        t = t.replace(/Attacco con arma a distanza:/gi, 'Attacco con Arma a Distanza:');

        // Hit & Miss
        t = t.replace(/\bHit or Miss:/gi, 'Colpito o Mancato:');
        t = t.replace(/\bHit:/gi, 'Colpito:');
        t = t.replace(/\bMiss:/gi, 'Mancato:');

        // Per colpire
        t = t.replace(/\bto\s+hit\b/gi, 'per colpire');
        t = t.replace(/\bper colpire,\s*portata/gi, 'per colpire, portata');

        // Portata e Gittata
        t = t.replace(/reach\s+(\d+(?:\.\d+)?)\s*ft\./gi, 'portata $1 ft.');
        t = t.replace(/range\s+(\d+(?:\/\d+)?)\s*ft\./gi, 'gittata $1 ft.');
        t = t.replace(/\bor range\b/gi, 'o gittata');
        t = t.replace(/\b\s*or\s*(?=gittata)/gi, ' o ');
        t = t.replace(/portata\s+(\d+(?:[.,]\d+)?)\s*(?:m|metri|piedi|feet)/gi, 'portata 5 ft.');
        t = t.replace(/\b(?:portata|gittata)\s+(\d+\/\d+)\s*(?:piedi|feet|m|metri|ft\.)*/gi, 'gittata $1 ft.');
        t = t.replace(/ft\.\s*ft\./gi, 'ft.');
        t = t.replace(/entro\s+(\d+)\s*(?:piedi|feet|metri)/gi, 'entro $1 ft.');
        t = t.replace(/raggio di\s+(\d+)\s*(?:piedi|feet|metri)/gi, 'raggio di $1 ft.');
        t = t.replace(/one target\b/gi, 'un bersaglio');
        t = t.replace(/one creature\b/gi, 'una creatura');

        // CD & Tiri Salvezza
        t = t.replace(/\bDC\s+(\d+)\b/gi, 'CD $1');
        t = t.replace(/Strength saving throw/gi, 'tiro salvezza su Forza');
        t = t.replace(/Dexterity saving throw/gi, 'tiro salvezza su Destrezza');
        t = t.replace(/Constitution saving throw/gi, 'tiro salvezza su Costituzione');
        t = t.replace(/Intelligence saving throw/gi, 'tiro salvezza su Intelligenza');
        t = t.replace(/Wisdom saving throw/gi, 'tiro salvezza su Saggezza');
        t = t.replace(/Charisma saving throw/gi, 'tiro salvezza su Carisma');
        t = t.replace(/saving throw\b/gi, 'tiro salvezza');
        t = t.replace(/saving throws\b/gi, 'tiri salvezza');
        t = t.replace(/Tiro Salvezza/gi, 'tiro salvezza');
        t = t.replace(/deve riuscire un tiro salvezza/gi, 'deve superare un tiro salvezza');

        // Tipi di Danno
        t = t.replace(/\bpiercing damage\b/gi, 'danni perforanti');
        t = t.replace(/\bslashing damage\b/gi, 'danni taglienti');
        t = t.replace(/\bbludgeoning damage\b/gi, 'danni contundenti');
        t = t.replace(/\bpoison damage\b/gi, 'danni da veleno');
        t = t.replace(/\bfire damage\b/gi, 'danni da fuoco');
        t = t.replace(/\bcold damage\b/gi, 'danni da freddo');
        t = t.replace(/\blightning damage\b/gi, 'danni da fulmine');
        t = t.replace(/\bradiant damage\b/gi, 'danni radiosi');
        t = t.replace(/\bnecrotic damage\b/gi, 'danni necrotici');
        t = t.replace(/\bpsychic damage\b/gi, 'danni psichici');
        t = t.replace(/\bacid damage\b/gi, 'danni da acido');
        t = t.replace(/\bthunder damage\b/gi, 'danni da tuono');
        t = t.replace(/\bforce damage\b/gi, 'danni da forza');

        // Condizioni D&D
        t = t.replace(/\bthe blinded condition\b/gi, 'la condizione di accecato');
        t = t.replace(/\bthe charmed condition\b/gi, 'la condizione di affascinato');
        t = t.replace(/\bthe frightened condition\b/gi, 'la condizione di spaventato');
        t = t.replace(/\bthe paralyzed condition\b/gi, 'la condizione di paralizzato');
        t = t.replace(/\bthe poisoned condition\b/gi, 'la condizione di avvelenato');
        t = t.replace(/\bthe prone condition\b/gi, 'la condizione di prono');
        t = t.replace(/\bthe restrained condition\b/gi, 'la condizione di trattenuto');
        t = t.replace(/\bthe stunned condition\b/gi, 'la condizione di stordito');
        t = t.replace(/\bthe unconscious condition\b/gi, 'la condizione di privo di sensi');

        // Ricariche & Costi Azioni
        t = t.replace(/\(Recharge\s*(\d+–6|\d+|-6)\)/gi, '(Ricarica $1)');
        t = t.replace(/\(Recharge 6\)/gi, '(Ricarica 6)');
        t = t.replace(/\(Costs 2 Actions\)/gi, '(Costa 2 Azioni)');
        t = t.replace(/\(Costs 3 Actions\)/gi, '(Costa 3 Azioni)');
        t = t.replace(/Half damage only\./gi, 'Solo la metà dei danni in caso di successo.');
        t = t.replace(/Half danni only\./gi, 'Solo la metà dei danni in caso di successo.');

        return t;
    }

    function translateAlignment(align) {
        if (!align) return 'senza allineamento';
        let val = Array.isArray(align) ? align.join(' ') : String(align);
        val = val.trim();

        const codeMap = {
            'n': 'neutrale', 'u': 'senza allineamento', 'a': 'qualsiasi allineamento',
            'lg': 'legale buono', 'l g': 'legale buono',
            'ln': 'legale neutrale', 'l n': 'legale neutrale',
            'le': 'legale malvagio', 'l e': 'legale malvagio',
            'ng': 'neutrale buono', 'n g': 'neutrale buono',
            'ne': 'neutrale malvagio', 'n e': 'neutrale malvagio',
            'cg': 'caotico buono', 'c g': 'caotico buono',
            'cn': 'caotico neutrale', 'c n': 'caotico neutrale',
            'ce': 'caotico malvagio', 'c e': 'caotico malvagio',
            'l': 'legale', 'c': 'caotico', 'g': 'buono', 'e': 'malvagio'
        };
        const lower = val.toLowerCase();
        if (codeMap[lower]) return codeMap[lower];

        const phraseMap = [
            [/lawful good/gi, 'legale buono'], [/neutral good/gi, 'neutrale buono'],
            [/chaotic good/gi, 'caotico buono'], [/lawful neutral/gi, 'legale neutrale'],
            [/true neutral/gi, 'neutrale puro'], [/chaotic neutral/gi, 'caotico neutrale'],
            [/lawful evil/gi, 'legale malvagio'], [/neutral evil/gi, 'neutrale malvagio'],
            [/chaotic evil/gi, 'caotico malvagio'], [/unaligned/gi, 'senza allineamento'],
            [/neutral/gi, 'neutrale']
        ];
        for (const [re, it] of phraseMap) {
            val = val.replace(re, it);
        }
        return val;
    }

    function translateLanguages(lang) {
        if (!lang) return '';
        let l = Array.isArray(lang) ? lang.join(', ') : String(lang);
        const langMap = [
            [/thieves'\s*cant\b/gi, 'Gergo Ladresco'],
            [/thieves\s*cant\b/gi, 'Gergo Ladresco'],
            [/\bcommon\b/gi, 'Comune'],
            [/\bdwarvish\b/gi, 'Nanico'],
            [/\belvish\b/gi, 'Elfico'],
            [/\bdraconic\b/gi, 'Draconico'],
            [/\bgiant\b/gi, 'Gigante'],
            [/\bgnomish\b/gi, 'Gnomesco'],
            [/\bgoblin\b/gi, 'Goblin'],
            [/\bhalfling\b/gi, 'Halfling'],
            [/\borc\b/gi, 'Orchesco'],
            [/\babyssal\b/gi, 'Abissale'],
            [/\bcelestial\b/gi, 'Celestiale'],
            [/\bdeep speech\b/gi, 'Parlata Profonda'],
            [/\binfernal\b/gi, 'Infernale'],
            [/\bprimordial\b/gi, 'Primordiale'],
            [/\bsylvan\b/gi, 'Silvano'],
            [/\bundercommon\b/gi, 'Gergo delle Profondità'],
            [/\btelepathy\b/gi, 'telepatia'],
            [/\bunderstands\b/gi, 'comprende'],
            [/\bbut can't speak\b/gi, 'ma non può parlare'],
            [/\bbut cannot speak\b/gi, 'ma non può parlare']
        ];
        for (const [re, it] of langMap) {
            l = l.replace(re, it);
        }
        l = l.replace(/\b(Comune|Nanico|Elfico|Draconico|Gergo Ladresco)\s+(Gergo Ladresco|Comune|Nanico|Elfico|Draconico)/gi, '$1, $2');
        return l;
    }

    // ==========================================
    // GLOSSARIO FISSO D&D 5e ITALIANO
    // ==========================================
    const DND_IT_GLOSSARY = {
        sizes: {
            'tiny': 'Minuscola', 't': 'Minuscola',
            'small': 'Piccola', 's': 'Piccola',
            'medium': 'Media', 'm': 'Media',
            'large': 'Grande', 'l': 'Grande',
            'huge': 'Enorme', 'h': 'Enorme',
            'gargantuan': 'Mastodontica', 'g': 'Mastodontica'
        },
        types: {
            'aberration': 'aberrazione',
            'beast': 'bestia',
            'celestial': 'celestiale',
            'construct': 'costrutto',
            'dragon': 'drago',
            'elemental': 'elementale',
            'fey': 'folletto',
            'fiend': 'immondo',
            'giant': 'gigante',
            'humanoid': 'umanoide',
            'monstrosity': 'mostruosità',
            'ooze': 'melma',
            'plant': 'vegetale',
            'undead': 'non morto'
        },
        subtypes: {
            'any race': 'qualsiasi razza',
            'shapechanger': 'mutaforma',
            'titan': 'titano',
            'demon': 'demone',
            'devil': 'diavolo',
            'goblinoid': 'goblinoide',
            'orc': 'orco',
            'elf': 'elfo',
            'dwarf': 'nano',
            'human': 'umano',
            'kobold': 'coboldo',
            'lizardfolk': 'lucertoloide',
            'gnoll': 'gnoll'
        },
        skills: {
            'acrobatics': 'Acrobazia',
            'animal handling': 'Addestrare Animali',
            'arcana': 'Arcano',
            'athletics': 'Atletica',
            'deception': 'Inganno',
            'history': 'Storia',
            'insight': 'Intuizione',
            'intimidation': 'Intimidire',
            'investigation': 'Indagare',
            'medicine': 'Medicina',
            'nature': 'Natura',
            'perception': 'Percezione',
            'performance': 'Intrattenere',
            'persuasion': 'Persuasione',
            'religion': 'Religione',
            'sleight of hand': 'Rapidità di Mano',
            'stealth': 'Furtività',
            'survival': 'Sopravvivenza'
        },
        saves: {
            'str': 'For', 'strength': 'For',
            'dex': 'Des', 'dexterity': 'Des',
            'con': 'Cos', 'constitution': 'Cos',
            'int': 'Int', 'intelligence': 'Int',
            'wis': 'Sag', 'wisdom': 'Sag',
            'cha': 'Car', 'charisma': 'Car'
        },
        damageTypesList: {
            'bludgeoning': 'contundente',
            'piercing': 'perforante',
            'slashing': 'tagliente',
            'psychic': 'psichico',
            'radiant': 'radioso',
            'necrotic': 'necrotico',
            'fire': 'fuoco',
            'cold': 'freddo',
            'lightning': 'fulmine',
            'thunder': 'tuono',
            'poison': 'veleno',
            'acid': 'acido',
            'force': 'forza'
        },
        conditions: {
            'blinded': 'accecato',
            'charmed': 'affascinato',
            'deafened': 'assordato',
            'exhaustion': 'sfinimento',
            'frightened': 'spaventato',
            'grappled': 'afferrato',
            'incapacitated': 'inabile',
            'invisible': 'invisibile',
            'paralyzed': 'paralizzato',
            'petrified': 'pietrificato',
            'poisoned': 'avvelenato',
            'prone': 'prono',
            'restrained': 'trattenuto',
            'stunned': 'stordito',
            'unconscious': 'privo di sensi'
        },
        senses: {
            'darkvision': 'scurovisione',
            'blindsight': 'vista cieca',
            'tremorsense': 'percezione tellurica',
            'truesight': 'vista pura',
            'passive perception': 'Percezione passiva'
        },
        armor: {
            'natural armor': 'armatura naturale',
            'leather armor': 'armatura di cuoio',
            'studded leather': 'cuoio borchiato',
            'hide armor': 'armatura di pelle',
            'chain shirt': 'giaco di maglia',
            'scale mail': 'corazza di scaglie',
            'breastplate': 'pettorale',
            'half plate': 'mezza armatura',
            'ring mail': 'cotta ad anelli',
            'chain mail': 'cotta di maglia',
            'splint': 'corazza a strisce',
            'plate': 'armatura completa',
            'shield': 'scudo'
        }
    };

    const compendium = {
        init() {
            this.bindEvents();
            if (typeof window.makeDraggable === 'function') {
                const win = document.getElementById('dm-statblock-window');
                const header = document.getElementById('dm-statblock-header');
                if (win && header) window.makeDraggable(win, header);
            }
        },

        clean5eToolsText(val) {
            if (!val) return '';
            if (Array.isArray(val)) return val.map(v => this.clean5eToolsText(v)).filter(Boolean).join(', ');
            if (typeof val === 'object' && val.entries) return this.clean5eToolsText(val.entries);
            if (typeof val !== 'string') return String(val);

            let text = val;

            // 1. Tag attacco flessibile con o senza spazi
            text = text.replace(/\{@atk\s+([a-zA-Z,\s]+)\}/gi, (match, types) => {
                const t = types.toLowerCase().replace(/\s+/g, '');
                if (t.includes('mw') && t.includes('rw')) return 'Melee or Ranged Weapon Attack: ';
                if (t.includes('ms') && t.includes('rs')) return 'Melee or Ranged Spell Attack: ';
                if (t.includes('m') && t.includes('r')) return 'Melee or Ranged Weapon Attack: ';
                if (t.includes('mw')) return 'Melee Weapon Attack: ';
                if (t.includes('rw')) return 'Ranged Weapon Attack: ';
                if (t.includes('ms')) return 'Melee Spell Attack: ';
                if (t.includes('rs')) return 'Ranged Spell Attack: ';
                if (t.includes('m')) return 'Melee Attack Roll: ';
                if (t.includes('r')) return 'Ranged Attack Roll: ';
                return 'Attack: ';
            });

            // 2. Tag Esito colpo
            text = text.replace(/\{@h\}/gi, 'Hit: ');
            text = text.replace(/\{@hom\}/gi, 'Hit or Miss: ');
            text = text.replace(/\{@m\}/gi, 'Miss: ');

            // 3. Modificatori tiro per colpire, CD e Ricarica
            text = text.replace(/\{@hit\s+([+-]?\d+)\}\s*(?:to\s+hit)?/gi, (m, p1) => {
                const sign = p1.startsWith('+') || p1.startsWith('-') ? p1 : `+${p1}`;
                return `${sign} to hit`;
            });
            text = text.replace(/\{@d20\s+([+-]?\d+)\}/gi, '+$1');
            text = text.replace(/\{@dc\s+(\d+)\}/gi, 'DC $1');
            text = text.replace(/\{@recharge\s*([^}]*)\}/gi, (m, p1) => {
                const v = (p1 || '').trim();
                if (!v || v === '6') return '(Recharge 6)';
                if (/^\d$/.test(v)) return `(Recharge ${v}–6)`;
                if (/^\d\s*[-–]\s*6$/.test(v)) return `(Recharge ${v.replace(/\s+/g, '')})`;
                return `(Recharge ${v})`;
            });
            text = text.replace(/\{@chance\s+(\d+)\}/gi, '$1%');

            // 4. Danno e Formule dadi
            text = text.replace(/\{@damage\s+([^}]+)\}/gi, '$1');
            text = text.replace(/\{@dice\s+([^}]+)\}/gi, '$1');
            text = text.replace(/\{@d\s+([^}]+)\}/gi, '$1');
            text = text.replace(/\{@scaledamage\s+[^}]*\|([^}]+)\}/gi, '$1');
            text = text.replace(/\{@scaledice\s+[^}]*\|([^}]+)\}/gi, '$1');

            // 5. Formattazione testo
            text = text.replace(/\{@b\s+([^}]+)\}/gi, '<strong>$1</strong>');
            text = text.replace(/\{@i\s+([^}]+)\}/gi, '<em>$1</em>');
            text = text.replace(/\{@u\s+([^}]+)\}/gi, '<u>$1</u>');
            text = text.replace(/\{@s\s+([^}]+)\}/gi, '<s>$1</s>');
            text = text.replace(/\{@note\s+([^}]+)\}/gi, '($1)');

            // 6. Tag generici con separatore pipe (es. {@creature goblin|mm|Goblin})
            text = text.replace(/\{@[a-zA-Z0-9_]+\s+([^}]+)\}/gi, (match, content) => {
                const parts = content.split('|');
                if (parts.length >= 3 && parts[2].trim()) return parts[2].trim();
                return parts[0].trim();
            });

            // 7. Qualsiasi tag residuo senza parametri
            text = text.replace(/\{@[a-zA-Z0-9_]+\}/gi, '');

            // 8. Eventuali prefissi orfani come "m, r" o "mw, rw" residui all'inizio dell'azione
            text = text.replace(/^\s*(?:mw,rw|mw,\s*rw|m,r|m,\s*r)\b\s*/gi, 'Melee or Ranged Weapon Attack: ');
            text = text.replace(/\b(?:mw,rw|mw,\s*rw|m,r|m,\s*r)\b\s*/gi, 'Melee or Ranged Weapon Attack: ');

            return text.trim();
        },

        async translateMonsterToItalian(m) {
            if (!m) return null;
            const it = JSON.parse(JSON.stringify(m));

            it._raw = m._raw ? JSON.parse(JSON.stringify(m._raw)) : JSON.parse(JSON.stringify(m));
            it._isItalian = true;

            // 1. Taglia
            const rawSize = (m.size || '').toLowerCase();
            it.size = DND_IT_GLOSSARY.sizes[rawSize] || m.size || 'Media';

            // 2. Tipo creatura
            let typeStr = (m.type || '').toLowerCase();
            for (const [en, itType] of Object.entries(DND_IT_GLOSSARY.types)) {
                if (typeStr.includes(en)) {
                    typeStr = typeStr.replace(en, itType);
                    break;
                }
            }
            it.type = typeStr;

            // 3. Sottotipo
            if (m.subtype) {
                let subStr = m.subtype.toLowerCase();
                for (const [en, itSub] of Object.entries(DND_IT_GLOSSARY.subtypes)) {
                    subStr = subStr.replace(new RegExp(`\\b${en}\\b`, 'gi'), itSub);
                }
                it.subtype = subStr;
            }

            // 4. Allineamento
            it.alignment = translateAlignment(m.alignment);

            // 5. Armatura
            if (m.armor_desc) {
                let armor = m.armor_desc.toLowerCase();
                for (const [en, itA] of Object.entries(DND_IT_GLOSSARY.armor)) {
                    armor = armor.replace(new RegExp(`\\b${en}\\b`, 'gi'), itA);
                }
                it.armor_desc = armor;
            }

            // 6. Velocità
            if (typeof m.speed === 'string') {
                let sp = m.speed;
                sp = sp.replace(/\bwalk\b/gi, 'camminare');
                sp = sp.replace(/\bburrow\b/gi, 'scavare');
                sp = sp.replace(/\bclimb\b/gi, 'scalare');
                sp = sp.replace(/\bfly\b/gi, 'volare');
                sp = sp.replace(/\bswim\b/gi, 'nuotare');
                sp = sp.replace(/\bhover\b/gi, 'fluttuare');
                it.speed = sp;
            } else if (typeof m.speed === 'object' && m.speed !== null) {
                const itSpeed = {};
                const speedMap = { 'walk': 'camminare', 'burrow': 'scavare', 'climb': 'scalare', 'fly': 'volare', 'swim': 'nuotare', 'hover': 'fluttuare' };
                for (const [k, v] of Object.entries(m.speed)) {
                    const itK = speedMap[k.toLowerCase()] || k;
                    itSpeed[itK] = v;
                }
                it.speed = itSpeed;
            }

            // 7. Abilità (Skills)
            if (typeof m.skills === 'object' && m.skills !== null) {
                const itSkills = {};
                for (const [k, v] of Object.entries(m.skills)) {
                    const itKey = DND_IT_GLOSSARY.skills[k.toLowerCase()] || k;
                    itSkills[itKey] = v;
                }
                it.skills = itSkills;
            }

            // 8. Resistenze ai danni
            if (m.damage_resistances) {
                let res = m.damage_resistances;
                for (const [en, itDam] of Object.entries(DND_IT_GLOSSARY.damageTypesList)) {
                    res = res.replace(new RegExp(`\\b${en}\\b`, 'gi'), itDam);
                }
                res = res.replace(/from nonmagical attacks/gi, 'da attacchi non magici');
                res = res.replace(/that aren't silvered/gi, 'non d\'argento');
                res = res.replace(/that aren't adamantine/gi, 'non di adamillio');
                it.damage_resistances = res;
            }

            // 9. Immunità ai danni
            if (m.damage_immunities) {
                let imm = m.damage_immunities;
                for (const [en, itDam] of Object.entries(DND_IT_GLOSSARY.damageTypesList)) {
                    imm = imm.replace(new RegExp(`\\b${en}\\b`, 'gi'), itDam);
                }
                imm = imm.replace(/from nonmagical attacks/gi, 'da attacchi non magici');
                it.damage_immunities = imm;
            }

            // 10. Immunità alle condizioni
            if (m.condition_immunities) {
                let cimm = m.condition_immunities;
                for (const [en, itCond] of Object.entries(DND_IT_GLOSSARY.conditions)) {
                    cimm = cimm.replace(new RegExp(`\\b${en}\\b`, 'gi'), itCond);
                }
                it.condition_immunities = cimm;
            }

            // 11. Sensi
            if (m.senses) {
                let senses = m.senses;
                for (const [en, itSens] of Object.entries(DND_IT_GLOSSARY.senses)) {
                    senses = senses.replace(new RegExp(`\\b${en}\\b`, 'gi'), itSens);
                }
                it.senses = senses;
            }

            // 12. Linguaggi
            it.languages = translateLanguages(this.clean5eToolsText(m.languages));

            // ==========================================
            // PREPARAZIONE BATCH TESTI DA TRADURRE
            // ==========================================
            const batchRequests = [];
            const mapping = [];

            // Nome mostro
            batchRequests.push(m.name);
            mapping.push({ type: 'name' });

            // Azioni
            const actions = m.actions || [];
            actions.forEach((act, idx) => {
                batchRequests.push(this.clean5eToolsText(act.name));
                mapping.push({ type: 'action_name', index: idx });
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(act.desc)));
                mapping.push({ type: 'action_desc', index: idx });
            });

            // Tratti (Special Abilities)
            const traits = m.special_abilities || [];
            traits.forEach((tr, idx) => {
                batchRequests.push(this.clean5eToolsText(tr.name));
                mapping.push({ type: 'trait_name', index: idx });
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(tr.desc)));
                mapping.push({ type: 'trait_desc', index: idx });
            });

            // Reazioni
            const reactions = m.reactions || [];
            reactions.forEach((re, idx) => {
                batchRequests.push(this.clean5eToolsText(re.name));
                mapping.push({ type: 'reaction_name', index: idx });
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(re.desc)));
                mapping.push({ type: 'reaction_desc', index: idx });
            });

            // Azioni Leggendarie
            const legActions = m.legendary_actions || [];
            legActions.forEach((la, idx) => {
                batchRequests.push(this.clean5eToolsText(la.name));
                mapping.push({ type: 'legendary_name', index: idx });
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(la.desc)));
                mapping.push({ type: 'legendary_desc_item', index: idx });
            });
            if (m.legendary_desc) {
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(m.legendary_desc)));
                mapping.push({ type: 'legendary_desc' });
            }

            // Esecuzione traduzione in blocco
            const translatedTexts = await translateBatch(batchRequests);

            // Inizializza array clonati
            it.actions = actions.map(a => ({ name: this.clean5eToolsText(a.name), desc: this.clean5eToolsText(a.desc) }));
            it.special_abilities = traits.map(t => ({ name: this.clean5eToolsText(t.name), desc: this.clean5eToolsText(t.desc) }));
            it.reactions = reactions.map(r => ({ name: this.clean5eToolsText(r.name), desc: this.clean5eToolsText(r.desc) }));
            it.legendary_actions = legActions.map(la => ({ name: this.clean5eToolsText(la.name), desc: this.clean5eToolsText(la.desc) }));

            // Applicazione risultati tradotti e post-processati con la terminologia ufficiale
            mapping.forEach((mItem, i) => {
                const res = postProcessDndItalian(translatedTexts[i]);
                if (mItem.type === 'name') {
                    it.name = res;
                } else if (mItem.type === 'action_name') {
                    it.actions[mItem.index].name = res;
                } else if (mItem.type === 'action_desc') {
                    it.actions[mItem.index].desc = res;
                } else if (mItem.type === 'trait_name') {
                    it.special_abilities[mItem.index].name = res;
                } else if (mItem.type === 'trait_desc') {
                    it.special_abilities[mItem.index].desc = res;
                } else if (mItem.type === 'reaction_name') {
                    it.reactions[mItem.index].name = res;
                } else if (mItem.type === 'reaction_desc') {
                    it.reactions[mItem.index].desc = res;
                } else if (mItem.type === 'legendary_name') {
                    it.legendary_actions[mItem.index].name = res;
                } else if (mItem.type === 'legendary_desc_item') {
                    it.legendary_actions[mItem.index].desc = res;
                } else if (mItem.type === 'legendary_desc') {
                    it.legendary_desc = res;
                }
            });

            return it;
        },

        formatActionWithRolls(rawText, actionName) {
            const cleaned = this.clean5eToolsText(rawText);
            if (!cleaned) return '';

            let text = cleaned;

            // 1. Tiri per colpire classici (2014): es. "+4 to hit" o "-1 to hit" o "+4 per colpire"
            text = text.replace(/([+-]?\d+)\s*(?:to\s+hit|per\s+colpire)/gi, (match, bonus) => {
                const cleanBonus = bonus.startsWith('+') ? bonus : (bonus.startsWith('-') ? bonus : `+${bonus}`);
                const hitSuffix = isItalianMode ? 'per colpire' : 'to hit';
                return `<span class="statblock-roll-btn" data-formula="${cleanBonus}" data-label="${actionName} (Attacco)" style="background: rgba(239, 83, 80, 0.22); color: #ffb74d; border: 1px solid #ef5350; border-radius: 4px; padding: 1px 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare l'attacco (${cleanBonus})">🎲 ${cleanBonus} ${hitSuffix}</span>`;
            });

            // 1b. Tiri per colpire formato 2024: es. "Attack Roll: +8," o "Tiro per Colpire: +8,"
            text = text.replace(/((?:Attack\s+Roll|Tiro\s+per\s+Colpire)\s*:\s*)([+-]\d+)/gi, (match, prefix, bonus) => {
                return `${prefix}<span class="statblock-roll-btn" data-formula="${bonus}" data-label="${actionName} (Attacco)" style="background: rgba(239, 83, 80, 0.22); color: #ffb74d; border: 1px solid #ef5350; border-radius: 4px; padding: 1px 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare l'attacco (${bonus})">🎲 ${bonus}</span>`;
            });

            // 2. Formule dadi danno/effetti: es. "1d4", "2d6 + 2", "1d8+3", "3d10 - 1"
            text = text.replace(/\b(\d+d\d+(?:\s*[\+\-]\s*\d+)?)\b/gi, (match, formula) => {
                return `<span class="statblock-roll-btn" data-formula="${formula}" data-label="${actionName} (Danno)" style="background: rgba(255, 183, 77, 0.22); color: #ffe082; border: 1px solid #ffb74d; border-radius: 4px; padding: 1px 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare il dado (${formula})">🎲 ${formula}</span>`;
            });

            return text.replace(/\n/g, '<br>');
        },

        executeRoll(creatureName, formulaStr, rollLabel) {
            if (!formulaStr) return;
            const cleanFormula = formulaStr.trim().replace(/\s+/g, '');
            let diceCount = 1;
            let diceSides = 20;
            let bonus = 0;

            if (/^[+-]?\d+$/.test(cleanFormula)) {
                diceCount = 1;
                diceSides = 20;
                bonus = parseInt(cleanFormula, 10);
            } else {
                const m = cleanFormula.match(/^(\d+)d(\d+)(?:([+-]\d+))?$/i);
                if (m) {
                    diceCount = parseInt(m[1], 10);
                    diceSides = parseInt(m[2], 10);
                    bonus = m[3] ? parseInt(m[3], 10) : 0;
                } else {
                    const m2 = cleanFormula.match(/d(\d+)/i);
                    if (m2) diceSides = parseInt(m2[1], 10);
                }
            }

            const rolledItems = [];
            let diceSum = 0;
            for (let i = 0; i < diceCount; i++) {
                const raw = Math.floor(Math.random() * diceSides) + 1;
                diceSum += raw;
                rolledItems.push({
                    dice: diceSides,
                    raw: raw,
                    total: raw + bonus
                });
            }

            const totalResult = diceSum + bonus;
            const rollId = Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            window.lastRollId = rollId;

            // expr base senza bonus: dice.js aggiungerà automaticamente +bonus evitando il raddoppio
            const expr = `${diceCount}d${diceSides}`;

            // Determina se il tiro deve essere pubblico o segreto per il DM
            const chatPublicCb = document.getElementById('chat-rolls-public');
            const statPublicCb = document.getElementById('statblock-rolls-public');
            const dmPublicCb = document.getElementById('dice-dm-public');
            const isPublic = statPublicCb ? statPublicCb.checked : (chatPublicCb ? chatPublicCb.checked : (dmPublicCb ? dmPublicCb.checked : true));

            const secretTag = isPublic ? '' : ' (🔒 Segreto DM)';
            const isDexRoll = /\bdex\b|\bdestrezza\b|\bdexterity\b/i.test(rollLabel);

            const payload = {
                id: rollId,
                player: creatureName ? `${creatureName} [${rollLabel}]${secretTag}` : `${rollLabel}${secretTag}`,
                expression: expr,
                bonus: bonus,
                mode: 'total',
                rolls: rolledItems,
                diceSum: diceSum,
                result: totalResult,
                isSecret: !isPublic,
                rollType: isDexRoll ? 'dex' : null,
                creatureName: creatureName
            };

            // Appendi localmente alla chat
            if (typeof window.appendRollToChat === 'function') {
                window.appendRollToChat(payload);
            }

            // Invia in rete P2P ai giocatori SOLO se il tiro è pubblico
            const net = (typeof window.network !== 'undefined' && window.network) ? window.network : ((typeof network !== 'undefined') ? network : null);
            if (isPublic && net && typeof net.send === 'function') {
                net.send({
                    type: 'DICE_ROLL',
                    payload: payload
                });
            }

            // Apri e scrolla pannello chat
            const chatPanel = document.getElementById('chat-panel');
            if (chatPanel) {
                chatPanel.style.display = 'flex';
                const chatLog = document.getElementById('chat-log');
                if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
            }
        },

        bindEvents() {
            // Chiusura finestra statblock
            document.getElementById('btn-close-statblock')?.addEventListener('click', () => {
                this.close();
            });

            document.getElementById('btn-open-compendium-from-panel')?.addEventListener('click', () => {
                this.open();
            });

            // Ricerca con debounce e auto-parsing link web/ancore
            const searchInput = document.getElementById('statblock-search-input');
            if (searchInput) {
                const handleSearchValue = (val) => {
                    let q = val.trim();
                    if (q.includes('#')) {
                        const hash = q.split('#')[1];
                        if (hash) {
                            q = decodeURIComponent(hash).split('_')[0].replace(/\+/g, ' ');
                            searchInput.value = q;
                        }
                    }
                    return q;
                };

                searchInput.addEventListener('input', (e) => {
                    const q = handleSearchValue(e.target.value);
                    clearTimeout(debounceTimer);
                    if (q.length < 2) {
                        const resultsBox = document.getElementById('statblock-search-results');
                        if (resultsBox) resultsBox.style.display = 'none';
                        return;
                    }
                    debounceTimer = setTimeout(() => {
                        this.search(q);
                    }, 300);
                });

                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const q = handleSearchValue(searchInput.value);
                        if (q.length >= 2) this.search(q);
                    }
                });
            }

            document.getElementById('btn-statblock-search')?.addEventListener('click', () => {
                const searchInput = document.getElementById('statblock-search-input');
                let q = searchInput?.value.trim() || '';
                if (q.includes('#')) {
                    const hash = q.split('#')[1];
                    if (hash) {
                        q = decodeURIComponent(hash).split('_')[0].replace(/\+/g, ' ');
                        if (searchInput) searchInput.value = q;
                    }
                }
                if (q && q.length >= 2) this.search(q);
            });

            // Traduzione italiano / toggle originale inglese
            document.getElementById('btn-translate-statblock')?.addEventListener('click', () => {
                this.toggleTranslation();
            });

            // Assegnazione a token selezionato
            document.getElementById('btn-assign-statblock')?.addEventListener('click', () => {
                if (!currentMonster) return alert("Seleziona o cerca prima un mostro!");
                this.assignToSelectedToken(currentMonster);
            });

            // Crea nuovo token sulla mappa
            document.getElementById('btn-spawn-statblock-token')?.addEventListener('click', () => {
                if (!currentMonster) return alert("Seleziona o cerca prima un mostro!");
                this.spawnAsToken(currentMonster);
            });

            // Modale Import JSON
            const modal = document.getElementById('modal-json-import');
            document.getElementById('btn-statblock-json-import')?.addEventListener('click', () => {
                this.setImportTokenPreview(null);
                if (modal) modal.style.display = 'flex';
            });
            document.getElementById('btn-close-json-modal')?.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });

            // Dropzone Token nel modale JSON
            const dropzone = document.getElementById('json-token-dropzone');
            const tokenFileInput = document.getElementById('json-token-file-input');
            const clearTokenBtn = document.getElementById('btn-clear-json-token');

            if (dropzone && tokenFileInput) {
                dropzone.addEventListener('click', (e) => {
                    if (e.target !== clearTokenBtn) {
                        tokenFileInput.click();
                    }
                });
                tokenFileInput.addEventListener('change', (e) => {
                    if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            this.setImportTokenPreview(ev.target.result);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }
                });
                dropzone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropzone.style.borderColor = '#4db6ac';
                    dropzone.style.background = '#252525';
                });
                dropzone.addEventListener('dragleave', () => {
                    dropzone.style.borderColor = '#00897b';
                    dropzone.style.background = '#181818';
                });
                dropzone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropzone.style.borderColor = '#00897b';
                    dropzone.style.background = '#181818';
                    const files = e.dataTransfer.files;
                    if (files && files[0] && files[0].type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            this.setImportTokenPreview(ev.target.result);
                        };
                        reader.readAsDataURL(files[0]);
                    }
                });
            }

            if (clearTokenBtn) {
                clearTokenBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.setImportTokenPreview(null);
                });
            }

            // Incolla globale da clipboard (Ctrl+V) per catturare immagini token al volo
            window.addEventListener('paste', (e) => {
                const isModalOpen = modal && modal.style.display === 'flex';
                const statWin = document.getElementById('dm-statblock-window');
                const isStatOpen = statWin && statWin.style.display !== 'none';

                if (!isModalOpen && !isStatOpen) return;

                const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
                if (items) {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                            const blob = items[i].getAsFile();
                            if (blob) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const dataUrl = event.target.result;
                                    if (isModalOpen) {
                                        this.setImportTokenPreview(dataUrl);
                                    } else if (isStatOpen && currentMonster) {
                                        this.setMonsterTokenImage(dataUrl);
                                    }
                                };
                                reader.readAsDataURL(blob);
                                e.preventDefault();
                                return;
                            }
                        }
                    }
                }
            });

            const chkFooterInv = document.getElementById('statblock-spawn-invisible');
            const chkModalInv = document.getElementById('json-import-spawn-invisible');
            if (chkFooterInv && chkModalInv) {
                chkFooterInv.addEventListener('change', () => { chkModalInv.checked = chkFooterInv.checked; });
                chkModalInv.addEventListener('change', () => { chkFooterInv.checked = chkModalInv.checked; });
            }
            const selFooterCat = document.getElementById('statblock-spawn-category');
            const selModalCat = document.getElementById('json-import-spawn-category');
            if (selFooterCat && selModalCat) {
                selFooterCat.addEventListener('change', () => { selModalCat.value = selFooterCat.value; });
                selModalCat.addEventListener('change', () => { selFooterCat.value = selModalCat.value; });
            }
            document.getElementById('btn-confirm-json-spawn')?.addEventListener('click', () => {
                window._autoSpawnNextJsonImport = true;
                document.getElementById('btn-confirm-json-import')?.click();
            });
            document.getElementById('btn-confirm-json-import')?.addEventListener('click', () => {
                const shouldAutoSpawn = !!window._autoSpawnNextJsonImport;
                window._autoSpawnNextJsonImport = false;
                const textarea = document.getElementById('json-import-textarea');
                const raw = textarea ? textarea.value.trim() : '';
                if (!raw) return alert("Incolla prima il JSON o il testo della scheda!");
                try {
                    let normalized = null;
                    if (raw.startsWith('{') || raw.startsWith('[')) {
                        const parsed = JSON.parse(raw);
                        normalized = this.normalize5eToolsMonster(parsed);
                    } else {
                        normalized = this.parsePlainTextStatblock(raw);
                    }
                    if (normalized) {
                        if (pendingImportTokenSrc) {
                            normalized.tokenSrc = pendingImportTokenSrc;
                        }
                        this.loadMonster(normalized);
                        if (modal) modal.style.display = 'none';
                        textarea.value = '';
                        this.setImportTokenPreview(null);
                        if (chkFooterInv && chkModalInv) chkFooterInv.checked = chkModalInv.checked;
                        if (selFooterCat && selModalCat) selFooterCat.value = selModalCat.value;
                        if (shouldAutoSpawn) {
                            window._autoSpawnNextJsonImport = false;
                            if (currentMonster) this.spawnAsToken(currentMonster);
                        } else if (typeof showToast === 'function') {
                            showToast(`Scheda "${normalized.name}" importata con successo!`);
                        }
                    } else {
                        alert("Formato scheda o JSON non riconosciuto o incompleto.");
                    }
                } catch (err) {
                    // Se il testo iniziava con { ma non era JSON valido, prova comunque il parser testuale
                    try {
                        const fallbackNorm = this.parsePlainTextStatblock(raw);
                        if (fallbackNorm) {
                            if (pendingImportTokenSrc) fallbackNorm.tokenSrc = pendingImportTokenSrc;
                            this.loadMonster(fallbackNorm);
                            if (modal) modal.style.display = 'none';
                            textarea.value = '';
                            this.setImportTokenPreview(null);
                            if (shouldAutoSpawn && currentMonster) this.spawnAsToken(currentMonster);
                            return;
                        }
                    } catch (_) {}
                    alert("Errore nella lettura della scheda: " + err.message);
                }
            });

            // Chiudi tendina risultati se si clicca fuori
            document.addEventListener('click', (e) => {
                const resultsBox = document.getElementById('statblock-search-results');
                const searchInput = document.getElementById('statblock-search-input');
                if (resultsBox && !resultsBox.contains(e.target) && e.target !== searchInput) {
                    resultsBox.style.display = 'none';
                }
            });
        },

        compressTokenDataUrl(dataUrl, maxDim = 256) {
            return new Promise((resolve) => {
                if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
                    return resolve(dataUrl);
                }
                const tempImg = new Image();
                tempImg.onload = () => {
                    let w = tempImg.width;
                    let h = tempImg.height;
                    if (w <= maxDim && h <= maxDim && dataUrl.length < 60000) {
                        return resolve(dataUrl);
                    }
                    if (w > maxDim || h > maxDim) {
                        if (w > h) {
                            h = Math.round((h * maxDim) / w);
                            w = maxDim;
                        } else {
                            w = Math.round((w * maxDim) / h);
                            h = maxDim;
                        }
                    }
                    const c = document.createElement('canvas');
                    c.width = w;
                    c.height = h;
                    const ctx = c.getContext('2d');
                    ctx.drawImage(tempImg, 0, 0, w, h);
                    resolve(c.toDataURL('image/png'));
                };
                tempImg.onerror = () => resolve(dataUrl);
                tempImg.src = dataUrl;
            });
        },

        async setImportTokenPreview(dataUrl) {
            if (dataUrl) {
                dataUrl = await this.compressTokenDataUrl(dataUrl, 256);
            }
            pendingImportTokenSrc = dataUrl;
            const img = document.getElementById('json-token-img');
            const icon = document.getElementById('json-token-placeholder-icon');
            const status = document.getElementById('json-token-status-text');
            const clearBtn = document.getElementById('btn-clear-json-token');
            if (img && icon) {
                if (dataUrl) {
                    img.src = dataUrl;
                    img.style.display = 'block';
                    icon.style.display = 'none';
                    if (status) status.innerHTML = '<span style="color:#4caf50; font-weight:bold;">✅ Token acquisito pronto per la mappa!</span>';
                    if (clearBtn) clearBtn.style.display = 'inline-block';
                } else {
                    img.src = '';
                    img.style.display = 'none';
                    icon.style.display = 'inline';
                    if (status) status.innerHTML = 'Click destro sull\'immagine &rarr; <em>"Copia immagine"</em> e premi <strong>Ctrl+V</strong> qui.';
                    if (clearBtn) clearBtn.style.display = 'none';
                }
            }
        },

        async setMonsterTokenImage(dataUrl) {
            if (!currentMonster) return;
            if (dataUrl) {
                dataUrl = await this.compressTokenDataUrl(dataUrl, 256);
            }
            currentMonster.tokenSrc = dataUrl;
            if (rawMonster) rawMonster.tokenSrc = dataUrl;
            if (currentMonster._raw) currentMonster._raw.tokenSrc = dataUrl;

            const img = document.getElementById('statblock-avatar-img');
            if (img) img.src = dataUrl;

            // Se abbiamo token selezionati che usano questa scheda, aggiorniamo la loro immagine live
            const eng = getEngine();
            if (eng && eng.tokens) {
                const targetTokens = (eng.selectedTokens && eng.selectedTokens.size > 0)
                    ? eng.tokens.filter(t => eng.selectedTokens.has(t.id))
                    : (eng.selectedTokenId ? [eng.tokens.find(t => t.id === eng.selectedTokenId)].filter(Boolean) : []);

                const matching = targetTokens.filter(t => t.statblock && (t.statblock.name === currentMonster.name || (rawMonster && t.statblock.name === rawMonster.name)));
                if (matching.length > 0) {
                    const newImg = new Image();
                    newImg.onload = () => {
                        matching.forEach(t => {
                            t.imageObj = newImg;
                            t.src = dataUrl;
                            if (t.statblock) t.statblock.tokenSrc = dataUrl;
                            if (typeof window.markTokenImageDirty === 'function') window.markTokenImageDirty(t.id);
                        });
                        eng.renderAll();
                        if (typeof window.syncState === 'function') window.syncState(true, false);
                    };
                    newImg.src = dataUrl;
                }
            }

            if (typeof showToast === 'function') {
                showToast(`Token immagine abbinato a "${currentMonster.name}"!`);
            }
        },

        async search(query) {
            const resultsBox = document.getElementById('statblock-search-results');
            if (!resultsBox) return;

            const qLower = query.toLowerCase();
            if (searchCache.has(qLower)) {
                this.renderSearchResults(searchCache.get(qLower));
                return;
            }

            resultsBox.style.display = 'block';
            resultsBox.innerHTML = '<div style="padding: 10px; color: #aaa; text-align: center; font-size: 11px;">🔍 Ricerca in corso su Open5e...</div>';

            try {
                const url = `https://api.open5e.com/v1/monsters/?search=${encodeURIComponent(query)}&limit=15`;
                const resp = await fetch(url);
                if (!resp.ok) throw new Error("HTTP " + resp.status);
                const data = await resp.json();
                const list = data.results || [];
                searchCache.set(qLower, list);
                this.renderSearchResults(list);
            } catch (err) {
                console.error("Compendium search error:", err);
                resultsBox.innerHTML = `<div style="padding: 10px; color: #ef5350; text-align: center; font-size: 11px;">Errore connessione: ${err.message}. Verifica la connessione internet.</div>`;
            }
        },

        renderSearchResults(list) {
            const resultsBox = document.getElementById('statblock-search-results');
            if (!resultsBox) return;

            if (!list || list.length === 0) {
                resultsBox.style.display = 'block';
                resultsBox.innerHTML = '<div style="padding: 10px; color: #888; text-align: center; font-size: 11px;">Nessun mostro trovato. Prova un termine in inglese (es. Dragon, Goblin, Skeleton).</div>';
                return;
            }

            resultsBox.innerHTML = '';
            resultsBox.style.display = 'block';

            list.forEach(m => {
                const item = document.createElement('div');
                item.style.cssText = 'padding: 8px 10px; border-bottom: 1px solid #2a2a2a; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.15s; font-size: 11.5px;';
                item.onmouseenter = () => item.style.background = '#2a1a1a';
                item.onmouseleave = () => item.style.background = 'transparent';

                const cr = m.challenge_rating || m.cr || '-';
                const hp = m.hit_points || '-';
                const ac = m.armor_class || '-';
                const type = (m.size ? m.size + ' ' : '') + (m.type || '');

                item.innerHTML = `
                    <div>
                        <strong style="color: #ef5350; font-size: 12px;">${escapeHTML(m.name)}</strong>
                        <div style="color: #888; font-size: 10px;">${escapeHTML(type)}</div>
                    </div>
                    <div style="text-align: right; color: #bbb; font-size: 11px; white-space: nowrap;">
                        <span style="color: #4fc3f7;" title="Classe Armatura">🛡️ ${escapeHTML(ac)}</span> | 
                        <span style="color: #ef5350;" title="Punti Ferita">❤️ ${escapeHTML(hp)}</span> | 
                        <span style="color: #ffb74d;" title="Grado Sfida">CR ${escapeHTML(cr)}</span>
                    </div>
                `;

                item.onclick = () => {
                    resultsBox.style.display = 'none';
                    this.loadMonster(m);
                };

                resultsBox.appendChild(item);
            });
        },

        loadMonster(monster) {
            if (monster && monster._raw) {
                rawMonster = JSON.parse(JSON.stringify(monster._raw));
                isItalianMode = !!monster._isItalian;
                currentMonster = monster;
            } else {
                rawMonster = JSON.parse(JSON.stringify(monster));
                isItalianMode = false;
                currentMonster = monster;
            }
            this.updateTranslateButtonUI();
            this.renderStatblock(currentMonster);
            this.updateAssignButtonText();
        },

        async toggleTranslation() {
            if (!currentMonster && !rawMonster) return alert("Seleziona o cerca prima un mostro!");

            const btn = document.getElementById('btn-translate-statblock');
            const textSpan = document.getElementById('btn-translate-statblock-text');

            if (!isItalianMode) {
                if (btn) {
                    btn.disabled = true;
                    btn.style.opacity = '0.7';
                    if (textSpan) textSpan.textContent = "⏳ Traduzione...";
                }
                try {
                    isItalianMode = true;
                    currentMonster = await this.translateMonsterToItalian(rawMonster);
                    if (typeof showToast === 'function') {
                        showToast(`Scheda tradotta in Italiano (terminologia ufficiale 5e)!`);
                    }
                } catch (err) {
                    console.error("Translation error:", err);
                    isItalianMode = false;
                    alert("Errore durante la traduzione: " + err.message);
                } finally {
                    if (btn) {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                    }
                }
            } else {
                isItalianMode = false;
                currentMonster = JSON.parse(JSON.stringify(rawMonster));
                if (typeof showToast === 'function') {
                    showToast(`Scheda ripristinata in lingua originale (EN).`);
                }
            }
            this.updateTranslateButtonUI();
            this.renderStatblock(currentMonster);
            this.updateAssignButtonText();
        },

        updateTranslateButtonUI() {
            const btn = document.getElementById('btn-translate-statblock');
            const textSpan = document.getElementById('btn-translate-statblock-text');
            if (!btn) return;
            if (isItalianMode) {
                btn.style.background = '#1565c0';
                btn.title = "Ripristina la scheda in lingua originale inglese (EN)";
                if (textSpan) textSpan.textContent = "🇬🇧 Originale EN";
                else btn.innerHTML = "<span>🇬🇧 Originale EN</span>";
            } else {
                btn.style.background = '#6a1b9a';
                btn.title = "Traduci la scheda con la terminologia ufficiale D&D in Italiano";
                if (textSpan) textSpan.textContent = "🇮🇹 Traduci IT";
                else btn.innerHTML = "<span>🇮🇹 Traduci IT</span>";
            }
        },

        updateAssignButtonText() {
            const btn = document.getElementById('btn-assign-statblock');
            const textSpan = document.getElementById('btn-assign-statblock-text');
            if (!btn) return;
            const eng = getEngine();
            const hasSelected = eng && ((eng.selectedTokens && eng.selectedTokens.size > 0) || eng.selectedTokenId);
            if (hasSelected && currentMonster) {
                const count = (eng.selectedTokens && eng.selectedTokens.size > 1) ? ` (${eng.selectedTokens.size})` : '';
                if (textSpan) textSpan.textContent = `⚡ Assegna${count}`;
                else btn.innerHTML = `<span>⚡ Assegna${count}</span>`;
                btn.style.background = '#2e7d32';
            } else if (currentMonster) {
                if (textSpan) textSpan.textContent = `⚡ Assegna Token`;
                else btn.innerHTML = `<span>⚡ Assegna Token</span>`;
                btn.style.background = '#2e7d32';
            }
        },

        formatMod(val) {
            if (val === undefined || val === null) return '+0';
            const num = parseInt(val) || 10;
            const mod = Math.floor((num - 10) / 2);
            return (mod >= 0 ? '+' : '') + mod;
        },

        generateLetterToken(monster) {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');

            let color = '#8d6e63';
            const typeLower = (monster.type || '').toLowerCase();
            if (typeLower.includes('dragon') || typeLower.includes('drago')) color = '#c62828';
            else if (typeLower.includes('undead') || typeLower.includes('non morto')) color = '#455a64';
            else if (typeLower.includes('fiend') || typeLower.includes('immondo')) color = '#ad1457';
            else if (typeLower.includes('aberration') || typeLower.includes('aberrazione')) color = '#6a1b9a';
            else if (typeLower.includes('humanoid') || typeLower.includes('umanoide')) color = '#2e7d32';
            else if (typeLower.includes('beast') || typeLower.includes('bestia')) color = '#e65100';
            else if (typeLower.includes('elemental') || typeLower.includes('elementale')) color = '#00838f';

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(64, 64, 60, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 50px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const initial = (monster.name || 'M').charAt(0).toUpperCase();
            ctx.fillText(initial, 64, 64);

            return canvas.toDataURL('image/png');
        },

        renderStatblock(m) {
            const placeholder = document.getElementById('statblock-placeholder');
            const details = document.getElementById('statblock-details');
            if (!details) return;

            if (placeholder) placeholder.style.display = 'none';
            details.style.display = 'block';

            const defaultSize = isItalianMode ? 'Media' : 'Medium';
            const defaultType = isItalianMode ? 'creatura' : 'creature';
            const defaultAlign = isItalianMode ? 'senza allineamento' : 'unaligned';

            const sizeType = `${m.size || defaultSize} ${m.type || defaultType}${m.subtype ? ' (' + m.subtype + ')' : ''}, ${m.alignment || defaultAlign}`;
            const acDesc = m.armor_desc ? ` (${m.armor_desc})` : '';
            const hpDice = m.hit_dice ? ` (${m.hit_dice})` : '';
            
            // Speed formatting
            let speedStr = '30 ft.';
            if (typeof m.speed === 'string') speedStr = m.speed;
            else if (typeof m.speed === 'object' && m.speed !== null) {
                speedStr = Object.entries(m.speed).map(([k, v]) => `${k} ${v} ft.`).join(', ');
            }

            // Stats row interattiva per tiri su caratteristiche
            const statKeys = isItalianMode 
                ? [ { k: 'FOR', val: m.strength || 10 },
                    { k: 'DES', val: m.dexterity || 10 },
                    { k: 'COS', val: m.constitution || 10 },
                    { k: 'INT', val: m.intelligence || 10 },
                    { k: 'SAG', val: m.wisdom || 10 },
                    { k: 'CAR', val: m.charisma || 10 } ]
                : [ { k: 'STR', val: m.strength || 10 },
                    { k: 'DEX', val: m.dexterity || 10 },
                    { k: 'CON', val: m.constitution || 10 },
                    { k: 'INT', val: m.intelligence || 10 },
                    { k: 'WIS', val: m.wisdom || 10 },
                    { k: 'CHA', val: m.charisma || 10 } ];

            let statsHtml = '<div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; text-align: center; background: #251818; padding: 6px 2px; border-radius: 4px; border: 1px solid #4a2222; margin: 8px 0;">';
            statKeys.forEach(s => {
                const mod = this.formatMod(s.val);
                const rollLabel = isItalianMode ? `Prova ${s.k}` : `Check ${s.k}`;
                statsHtml += `
                    <div class="statblock-roll-btn" data-formula="${mod}" data-label="${rollLabel}" style="cursor: pointer; padding: 4px 1px; border-radius: 4px; background: rgba(0,0,0,0.3); border: 1px solid rgba(239, 83, 80, 0.2); transition: all 0.15s;" title="Clicca per tirare ${rollLabel} (${mod})">
                        <div style="font-weight: bold; color: #ef5350; font-size: 11px;">${s.k}</div>
                        <div style="font-size: 12px; color: #fff;">${s.val} <span style="color:#ffb74d; font-weight:bold; font-size:11px;">(${mod})</span></div>
                    </div>
                `;
            });
            statsHtml += '</div>';

            // Saves & traits
            const saves = [];
            const addSave = (name, val) => {
                if (val !== null && val !== undefined) {
                    const num = parseInt(val);
                    const sign = num >= 0 ? '+' : '';
                    const dispName = isItalianMode ? (DND_IT_GLOSSARY.saves[name.toLowerCase()] || name) : name;
                    saves.push(`<span class="statblock-roll-btn" data-formula="${sign}${num}" data-label="TS ${dispName}" style="background: rgba(239, 83, 80, 0.2); color: #ffb74d; border: 1px solid #ef5350; border-radius: 4px; padding: 1px 5px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare il Tiro Salvezza ${dispName}">🎲 ${dispName} ${sign}${num}</span>`);
                }
            };
            addSave('Str', m.strength_save);
            addSave('Dex', m.dexterity_save);
            addSave('Con', m.constitution_save);
            addSave('Int', m.intelligence_save);
            addSave('Wis', m.wisdom_save);
            addSave('Cha', m.charisma_save);

            let skillsStr = '';
            if (typeof m.skills === 'object' && m.skills !== null) {
                skillsStr = Object.entries(m.skills).map(([k, v]) => {
                    const skillName = k.charAt(0).toUpperCase() + k.slice(1);
                    const num = parseInt(v);
                    const sign = num >= 0 ? '+' : '';
                    return `<span class="statblock-roll-btn" data-formula="${sign}${num}" data-label="${skillName}" style="background: rgba(255, 183, 77, 0.2); color: #ffe082; border: 1px solid #ffb74d; border-radius: 4px; padding: 1px 5px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare la prova ${skillName}">🎲 ${skillName} ${sign}${num}</span>`;
                }).join(', ');
            }

            // Headers dinamici IT / EN
            const lblAc = isItalianMode ? 'Classe Armatura' : 'Armor Class';
            const lblHp = isItalianMode ? 'Punti Ferita' : 'Hit Points';
            const lblSpeed = isItalianMode ? 'Velocità' : 'Speed';
            const lblSaves = isItalianMode ? 'Tiri Salvezza' : 'Saving Throws';
            const lblSkills = isItalianMode ? 'Abilità' : 'Skills';
            const lblRes = isItalianMode ? 'Resistenze ai Danni' : 'Damage Resistances';
            const lblImm = isItalianMode ? 'Immunità ai Danni' : 'Damage Immunities';
            const lblCImm = isItalianMode ? 'Immunità alle Condizioni' : 'Condition Immunities';
            const lblSenses = isItalianMode ? 'Sensi' : 'Senses';
            const lblLang = isItalianMode ? 'Linguaggi' : 'Languages';
            const lblCr = isItalianMode ? 'Grado Sfida' : 'Challenge';
            const lblActions = isItalianMode ? 'Azioni' : 'Actions';
            const lblTraits = isItalianMode ? 'Tratti' : 'Traits';
            const lblReactions = isItalianMode ? 'Reazioni' : 'Reactions';
            const lblLeg = isItalianMode ? 'Azioni Leggendarie' : 'Legendary Actions';

            // Build Actions con tiri dadi clikkabili
            let actionsHtml = '';
            const actions = m.actions || [];
            if (actions.length > 0) {
                actionsHtml += `<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">${lblActions}</div>`;
                actions.forEach(a => {
                    const cleanName = this.clean5eToolsText(a.name);
                    const formattedDesc = this.formatActionWithRolls(a.desc, cleanName);
                    actionsHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${cleanName.replace(/\.+$/, '')}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
            }

            // Special Abilities (Tratti)
            let traitsHtml = '';
            const traits = m.special_abilities || [];
            if (traits.length > 0) {
                traitsHtml += `<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">${lblTraits}</div>`;
                traits.forEach(t => {
                    const cleanName = this.clean5eToolsText(t.name);
                    const formattedDesc = this.formatActionWithRolls(t.desc, cleanName);
                    traitsHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${cleanName.replace(/\.+$/, '')}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
            }

            // Reactions (Reazioni)
            let reactHtml = '';
            const reactions = m.reactions || [];
            if (reactions.length > 0) {
                reactHtml += `<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">${lblReactions}</div>`;
                reactions.forEach(r => {
                    const cleanName = this.clean5eToolsText(r.name);
                    const formattedDesc = this.formatActionWithRolls(r.desc, cleanName);
                    reactHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${cleanName.replace(/\.+$/, '')}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
            }

            // Legendary Actions
            let legHtml = '';
            const leg = m.legendary_actions || [];
            if (leg.length > 0) {
                legHtml += `<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">${lblLeg}</div>`;
                if (m.legendary_desc) legHtml += `<div style="font-style: italic; color: #aaa; margin-bottom: 6px;">${this.clean5eToolsText(m.legendary_desc)}</div>`;
                leg.forEach(a => {
                    const cleanName = this.clean5eToolsText(a.name);
                    const formattedDesc = this.formatActionWithRolls(a.desc, cleanName);
                    legHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${cleanName.replace(/\.+$/, '')}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
            }

            const rawAvatar = m.tokenSrc || this.generateLetterToken(m);
            const tokenAvatarSrc = sanitizeImageSrc(rawAvatar) || this.generateLetterToken(m);

            details.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #b71c1c; padding-bottom: 6px; margin-bottom: 8px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 18px; font-weight: bold; color: #ef5350; font-family: serif; letter-spacing: 0.5px;">${escapeHTML(m.name)}</div>
                        <div style="font-style: italic; color: #9e9e9e; font-size: 11px;">${escapeHTML(sizeType)}</div>
                    </div>
                    <div id="statblock-avatar-wrapper" style="position: relative; cursor: pointer; margin-left: 10px; flex-shrink: 0;" title="Clicca per cambiare immagine o premi Ctrl+V con un token copiato negli appunti">
                        <img id="statblock-avatar-img" src="${escapeHTML(tokenAvatarSrc)}" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid #ef5350; object-fit: cover; background: #111; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">
                        <span style="position: absolute; bottom: -2px; right: -2px; background: #b71c1c; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white;" title="Cambia Token">📷</span>
                        <input type="file" id="statblock-avatar-file-input" accept="image/*" style="display: none;">
                    </div>
                </div>

                <div style="color: #ef9a9a; line-height: 1.4; font-size: 11.5px;">
                    <div><strong style="color: #ef5350;">${lblAc}:</strong> <span style="color: #fff; font-weight:bold;">${m.armor_class || 10}</span>${acDesc}</div>
                    <div><strong style="color: #ef5350;">${lblHp}:</strong> <span style="color: #fff; font-weight:bold;">${m.hit_points || 10}</span>${hpDice}</div>
                    <div><strong style="color: #ef5350;">${lblSpeed}:</strong> <span style="color: #fff;">${speedStr}</span></div>
                </div>

                ${statsHtml}

                <div style="color: #ddd; font-size: 11px; line-height: 1.4;">
                    ${saves.length > 0 ? `<div style="margin-bottom: 3px;"><strong style="color: #ef5350;">${lblSaves}:</strong> ${saves.join(' ')}</div>` : ''}
                    ${skillsStr ? `<div style="margin-bottom: 3px;"><strong style="color: #ef5350;">${lblSkills}:</strong> ${skillsStr}</div>` : ''}
                    ${m.damage_resistances ? `<div><strong style="color: #ef5350;">${lblRes}:</strong> ${this.clean5eToolsText(m.damage_resistances)}</div>` : ''}
                    ${m.damage_immunities ? `<div><strong style="color: #ef5350;">${lblImm}:</strong> ${this.clean5eToolsText(m.damage_immunities)}</div>` : ''}
                    ${m.condition_immunities ? `<div><strong style="color: #ef5350;">${lblCImm}:</strong> ${this.clean5eToolsText(m.condition_immunities)}</div>` : ''}
                    ${m.senses ? `<div><strong style="color: #ef5350;">${lblSenses}:</strong> ${this.clean5eToolsText(m.senses)}</div>` : ''}
                    ${m.languages ? `<div><strong style="color: #ef5350;">${lblLang}:</strong> ${this.clean5eToolsText(m.languages)}</div>` : ''}
                    <div style="margin-top: 3px;"><strong style="color: #ef5350;">${lblCr}:</strong> <span style="color:#ffb74d; font-weight:bold;">${m.challenge_rating || m.cr || '-'}</span></div>
                </div>

                ${traitsHtml}
                ${actionsHtml}
                ${reactHtml}
                ${legHtml}
            `;

            // Bind click eventi sui bottoni tiro dado interattivi
            details.querySelectorAll('.statblock-roll-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const formula = btn.getAttribute('data-formula');
                    const label = btn.getAttribute('data-label') || 'Tiro';
                    this.executeRoll(m.name, formula, label);
                });
                btn.addEventListener('mouseenter', () => {
                    btn.style.filter = 'brightness(1.3)';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.filter = 'none';
                });
            });

            // Bind avatar click & file input
            const avatarWrapper = document.getElementById('statblock-avatar-wrapper');
            const avatarInput = document.getElementById('statblock-avatar-file-input');
            if (avatarWrapper && avatarInput) {
                avatarWrapper.onclick = () => avatarInput.click();
                avatarInput.onchange = (e) => {
                    if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            this.setMonsterTokenImage(ev.target.result);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }
                };
            }
        },

        normalize5eToolsMonster(raw) {
            if (!raw || typeof raw !== 'object') return null;
            const m = Array.isArray(raw.monster) ? raw.monster[0] : (raw.name ? raw : null);
            if (!m || !m.name) return null;

            let ac = 10;
            if (Array.isArray(m.ac)) {
                ac = typeof m.ac[0] === 'number' ? m.ac[0] : (m.ac[0]?.ac || 10);
            } else if (typeof m.ac === 'number') {
                ac = m.ac;
            } else if (m.armor_class) {
                ac = parseInt(m.armor_class) || 10;
            }

            let hp = 10;
            let hpDice = '';
            if (m.hp && typeof m.hp === 'object') {
                hp = m.hp.average || 10;
                hpDice = m.hp.formula || '';
            } else if (m.hit_points) {
                hp = parseInt(m.hit_points) || 10;
            }

            const actions = [];
            const rawActions = m.action || m.actions || [];
            rawActions.forEach(act => {
                actions.push({
                    name: this.clean5eToolsText(act.name) || 'Action',
                    desc: this.clean5eToolsText(act.entries || act.desc)
                });
            });

            const traits = [];
            const rawTraits = m.trait || m.special_abilities || [];
            rawTraits.forEach(tr => {
                traits.push({
                    name: this.clean5eToolsText(tr.name) || 'Trait',
                    desc: this.clean5eToolsText(tr.entries || tr.desc)
                });
            });

            const reactions = [];
            const rawReactions = m.reaction || m.reactions || [];
            rawReactions.forEach(re => {
                reactions.push({
                    name: this.clean5eToolsText(re.name) || 'Reaction',
                    desc: this.clean5eToolsText(re.entries || re.desc)
                });
            });

            const legendary = [];
            const rawLeg = m.legendary || m.legendary_actions || [];
            rawLeg.forEach(leg => {
                legendary.push({
                    name: this.clean5eToolsText(leg.name) || 'Legendary Action',
                    desc: this.clean5eToolsText(leg.entries || leg.desc)
                });
            });

            return {
                name: this.clean5eToolsText(m.name),
                size: Array.isArray(m.size) ? m.size[0] : (m.size || 'Medium'),
                type: typeof m.type === 'object' ? (m.type.type || 'creature') : (m.type || 'creature'),
                alignment: Array.isArray(m.alignment) ? m.alignment.join(' ') : (m.alignment || 'unaligned'),
                armor_class: ac,
                armor_desc: '',
                hit_points: hp,
                hit_dice: hpDice,
                speed: m.speed || '30 ft.',
                strength: m.str || m.strength || 10,
                dexterity: m.dex || m.dexterity || 10,
                constitution: m.con || m.constitution || 10,
                intelligence: m.int || m.intelligence || 10,
                wisdom: m.wis || m.wisdom || 10,
                charisma: m.cha || m.charisma || 10,
                challenge_rating: m.cr ? (typeof m.cr === 'object' ? m.cr.cr : m.cr) : (m.challenge_rating || '-'),
                actions: actions,
                special_abilities: traits,
                reactions: reactions,
                legendary_actions: legendary,
                legendary_desc: m.legendaryHeader ? this.clean5eToolsText(m.legendaryHeader) : '',
                languages: this.clean5eToolsText(m.languages),
                senses: this.clean5eToolsText(m.senses),
                damage_resistances: this.clean5eToolsText(m.resist || m.damage_resistances),
                damage_immunities: this.clean5eToolsText(m.immune || m.damage_immunities),
                condition_immunities: this.clean5eToolsText(m.conditionImmune || m.condition_immunities),
                tokenSrc: m.tokenSrc || null
            };
        },

        /**
         * Parser universale per Testo Statblock copiato da pagine web (es. D&D Beyond, Roll20, PDF, Homebrew)
         * Supporta layout a riga singola o spezzata (2014 e 2024), sia in Inglese che in Italiano.
         */
        parsePlainTextStatblock(rawText) {
            if (!rawText || typeof rawText !== 'string') return null;

            // 1. Pulizia iniziale e normalizzazione caratteri speciali (trattini lunghi -> meno standard)
            const cleanedText = rawText
                .replace(/\r\n/g, '\n')
                .replace(/\u2013|\u2014|\u2212/g, '-')
                .replace(/\u00a0/g, ' ');

            const rawLines = cleanedText.split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 0 && !/^(Roll Initiative!?|View Details Page|Stat Block)$/i.test(l));

            if (rawLines.length < 2) return null;

            // 2. Unisce etichette spezzate su più righe (tipico del copia-incolla da DOM flex/grid)
            const standaloneLabelRe = /^(Armor Class|AC|Classe Armatura|CA|Hit Points|HP|Punti Ferita|Punti Vita|PF|PV|Speed|Velocit[àa]|Saving Throws|Save|Tiri Salvezza|TS|Skills|Abilit[àa]|Damage Vulnerabilities|Vulnerabilit[àa] ai Danni|Vulnerabilities|Damage Resistances|Resistenze ai Danni|Resistances|Damage Immunities|Immunit[àa] ai Danni|Immunities|Condition Immunities|Immunit[àa] alle Condizioni|Senses|Sensi|Languages|Linguaggi|Challenge|CR|Grado Sfida|Sfida|Proficiency Bonus|Bonus di Competenza)\s*:?\s*$/i;
            const abilityTagOnlyRe = /^(STR|DEX|CON|INT|WIS|CHA|FOR|DES|COS|SAG|CAR)$/i;

            const lines = [];
            for (let i = 0; i < rawLines.length; i++) {
                const cur = rawLines[i];

                // Caso A: Etichetta di statistica su una riga e valore sulla riga successiva
                if (standaloneLabelRe.test(cur) && i + 1 < rawLines.length) {
                    const cleanLbl = cur.replace(/:$/, '').trim();
                    lines.push(`${cleanLbl}: ${rawLines[i + 1]}`);
                    i++;
                    continue;
                }

                // Caso B: Caratteristica impilata su 2 o 3 righe: "STR" \n "18 (+4)" oppure "STR" \n "18" \n "(+4)"
                if (abilityTagOnlyRe.test(cur) && i + 1 < rawLines.length) {
                    const next1 = rawLines[i + 1];
                    const next2 = i + 2 < rawLines.length ? rawLines[i + 2] : '';
                    if (/^\d{1,2}\s*\([+-]?\d+\)$/.test(next1) || /^\d{1,2}\s+[+-]?\d+(?:\s+[+-]?\d+)?$/.test(next1)) {
                        lines.push(`${cur.toUpperCase()} ${next1}`);
                        i++;
                        continue;
                    } else if (/^\d{1,2}$/.test(next1) && /^\([+-]?\d+\)$/.test(next2)) {
                        lines.push(`${cur.toUpperCase()} ${next1} ${next2}`);
                        i += 2;
                        continue;
                    } else if (/^\d{1,2}$/.test(next1)) {
                        lines.push(`${cur.toUpperCase()} ${next1}`);
                        i++;
                        continue;
                    }
                }

                lines.push(cur);
            }

            const result = {
                name: lines[0].replace(/\*+/g, '').trim(),
                size: 'Medium',
                type: 'humanoid',
                subtype: '',
                alignment: 'any alignment',
                armor_class: 10,
                armor_desc: '',
                hit_points: 10,
                hit_dice: '',
                speed: '30 ft.',
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                strength_save: null,
                dexterity_save: null,
                constitution_save: null,
                intelligence_save: null,
                wisdom_save: null,
                charisma_save: null,
                skills: {},
                damage_resistances: '',
                damage_immunities: '',
                condition_immunities: '',
                senses: '',
                languages: '',
                challenge_rating: '-',
                special_abilities: [],
                actions: [],
                reactions: [],
                legendary_actions: [],
                legendary_desc: '',
                tokenSrc: null
            };

            let startIdx = 1;
            // Controlla se la seconda riga è il sottotitolo Taglia / Tipo / Allineamento
            const sizeRe = /^(Tiny|Small|Medium|Large|Huge|Gargantuan|Minuscola|Piccola|Media|Grande|Enorme|Mastodontica)\b/i;
            const typeKeywordsRe = /\b(humanoid|aberration|beast|celestial|construct|dragon|elemental|fey|fiend|giant|monstrosity|ooze|plant|undead|swarm|umanoide|aberrazione|bestia|celestiale|costrutto|drago|elementale|folletto|immondo|gigante|mostruosit[àa]|melma|vegetale|non\s*morto)\b/i;
            if (lines.length > 1 && (sizeRe.test(lines[1]) || typeKeywordsRe.test(lines[1]))) {
                const metaLine = lines[1];
                const commaParts = metaLine.split(',');
                const leftPart = commaParts[0].trim();
                if (commaParts.length > 1) {
                    result.alignment = commaParts.slice(1).join(',').trim();
                }
                const szMatch = leftPart.match(sizeRe);
                if (szMatch) {
                    result.size = szMatch[1];
                    const restType = leftPart.slice(szMatch[0].length).trim();
                    const subMatch = restType.match(/^([^\(]+?)(?:\s*\((.+)\))?$/);
                    if (subMatch) {
                        result.type = (subMatch[1] || 'creature').trim();
                        result.subtype = (subMatch[2] || '').trim();
                    } else if (restType) {
                        result.type = restType;
                    }
                } else {
                    result.type = leftPart;
                }
                startIdx = 2;
            }

            // Mappa di conversione per caratteristiche e Tiri Salvezza (EN & IT)
            const abilMap = {
                str: 'strength', for: 'strength', forza: 'strength', strength: 'strength',
                dex: 'dexterity', des: 'dexterity', destrezza: 'dexterity', dexterity: 'dexterity',
                con: 'constitution', cos: 'constitution', costituzione: 'constitution', constitution: 'constitution',
                int: 'intelligence', intelligenza: 'intelligence', intelligence: 'intelligence',
                wis: 'wisdom', sag: 'wisdom', saggezza: 'wisdom', wisdom: 'wisdom',
                cha: 'charisma', car: 'charisma', carisma: 'charisma', charisma: 'charisma'
            };

            // Estrazione globale rapida delle 6 caratteristiche sull'intero blocco (gestisce righe singole, tabelle o griglie)
            const fullJoined = lines.join('\n');
            const singleAbilRegex = /\b(STR|DEX|CON|INT|WIS|CHA|FOR|DES|COS|SAG|CAR)\b[\s:]*(\d{1,2})(?:\s*\(([+-]?\d+)\)|\s+([+-]\d+)(?:\s+([+-]\d+))?)?/gi;
            let abMatch;
            while ((abMatch = singleAbilRegex.exec(fullJoined)) !== null) {
                const key = abilMap[abMatch[1].toLowerCase()];
                const scoreVal = parseInt(abMatch[2], 10);
                if (key && !isNaN(scoreVal) && scoreVal >= 1 && scoreVal <= 30) {
                    result[key] = scoreVal;
                    // Se formato 2024 "STR 18 +4 +6" (dove il secondo modificatore è il Tiro Salvezza)
                    if (abMatch[5] !== undefined) {
                        const modVal = parseInt(abMatch[4], 10);
                        const saveVal = parseInt(abMatch[5], 10);
                        if (!isNaN(saveVal) && saveVal !== modVal) {
                            result[key + '_save'] = saveVal;
                        }
                    }
                }
            }

            // Gestisce anche il formato tabella a 2 righe: "STR DEX CON INT WIS CHA" seguito da "18 (+4) 11 (+0) ..."
            for (let i = startIdx; i < lines.length - 1; i++) {
                if (/^(?:STR|FOR)\s+(?:DEX|DES)\s+(?:CON|COS)\s+INT\s+(?:WIS|SAG)\s+(?:CHA|CAR)\b/i.test(lines[i])) {
                    const nums = [...lines[i + 1].matchAll(/(\d{1,2})\s*(?:\([+-]?\d+\))?/g)].map(m => parseInt(m[1], 10));
                    if (nums.length >= 6) {
                        result.strength = nums[0];
                        result.dexterity = nums[1];
                        result.constitution = nums[2];
                        result.intelligence = nums[3];
                        result.wisdom = nums[4];
                        result.charisma = nums[5];
                    }
                }
            }

            // 3. Scansione sequenziale per Statistiche Base e Sezioni (Tratti, Azioni, Reazioni, Azioni Leggendarie)
            let currentSection = 'header'; // 'header' | 'traits' | 'actions' | 'bonus_actions' | 'reactions' | 'legendary'
            let currentEntry = null;

            const flushEntry = () => {
                if (!currentEntry || !currentEntry.name) return;
                currentEntry.desc = (currentEntry.desc || '').trim();
                if (!currentEntry.desc) return;
                if (currentEntry.section === 'actions') {
                    result.actions.push({ name: currentEntry.name, desc: currentEntry.desc });
                } else if (currentEntry.section === 'bonus_actions') {
                    result.actions.push({ name: `${currentEntry.name} (Bonus Action)`, desc: currentEntry.desc });
                } else if (currentEntry.section === 'reactions') {
                    result.reactions.push({ name: currentEntry.name, desc: currentEntry.desc });
                } else if (currentEntry.section === 'legendary') {
                    result.legendary_actions.push({ name: currentEntry.name, desc: currentEntry.desc });
                } else {
                    result.special_abilities.push({ name: currentEntry.name, desc: currentEntry.desc });
                }
                currentEntry = null;
            };

            for (let i = startIdx; i < lines.length; i++) {
                const line = lines[i];

                // Riconoscimento intestazioni di sezione
                if (/^(Traits|Special Traits|Tratti|Capacit[àa] Speciali)\s*:?$/i.test(line)) {
                    flushEntry();
                    currentSection = 'traits';
                    continue;
                }
                if (/^(Actions|Azioni)\s*:?$/i.test(line)) {
                    flushEntry();
                    currentSection = 'actions';
                    continue;
                }
                if (/^(Bonus Actions|Azioni Bonus)\s*:?$/i.test(line)) {
                    flushEntry();
                    currentSection = 'bonus_actions';
                    continue;
                }
                if (/^(Reactions|Reazioni)\s*:?$/i.test(line)) {
                    flushEntry();
                    currentSection = 'reactions';
                    continue;
                }
                if (/^(Legendary Actions|Azioni Leggendarie|Mythic Actions|Azioni Mitiche)\s*:?$/i.test(line)) {
                    flushEntry();
                    currentSection = 'legendary';
                    continue;
                }

                // Se siamo ancora nell'header/statistiche, controlliamo i campi chiave
                if (currentSection === 'header') {
                    // Salta righe di sole caratteristiche già lette
                    if (/^(?:STR|DEX|CON|INT|WIS|CHA|FOR|DES|COS|SAG|CAR)\b/i.test(line) && !/^(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+Saving/i.test(line)) {
                        continue;
                    }
                    if (/^MOD\s+SAVE$/i.test(line) || /^(?:\d{1,2}\s*\([+-]?\d+\)\s*){2,6}$/.test(line)) {
                        continue;
                    }

                    // Armor Class / CA
                    const acMatch = line.match(/^(?:Armor Class|AC|Classe Armatura|CA)\s*:?\s*(\d+)(?:\s*\(([^)]+)\)|\s+([^I\n]+))?/i);
                    if (acMatch) {
                        result.armor_class = parseInt(acMatch[1], 10) || 10;
                        const descCandidate = (acMatch[2] || acMatch[3] || '').replace(/\bInitiative\b.*$/i, '').trim();
                        if (descCandidate) result.armor_desc = descCandidate;
                        continue;
                    }

                    // Hit Points / PV
                    const hpMatch = line.match(/^(?:Hit Points|HP|Punti Ferita|Punti Vita|PF|PV)\s*:?\s*(\d+)(?:\s*\(([^)]+)\))?/i);
                    if (hpMatch) {
                        result.hit_points = parseInt(hpMatch[1], 10) || 10;
                        if (hpMatch[2]) result.hit_dice = hpMatch[2].trim();
                        continue;
                    }

                    // Speed / Velocità
                    const spMatch = line.match(/^(?:Speed|Velocit[àa])\s*:?\s*(.+)$/i);
                    if (spMatch) {
                        result.speed = spMatch[1].trim();
                        continue;
                    }

                    // Saving Throws / Tiri Salvezza
                    const svMatch = line.match(/^(?:Saving Throws|Save|Tiri Salvezza|TS)\s*:?\s*(.+)$/i);
                    if (svMatch) {
                        const svRegex = /\b(Str|Dex|Con|Int|Wis|Cha|For|Des|Cos|Sag|Car)[a-z]*\s*([+-]\d+)/gi;
                        let sm;
                        while ((sm = svRegex.exec(svMatch[1])) !== null) {
                            const k = abilMap[sm[1].toLowerCase().slice(0, 3)];
                            if (k) result[k + '_save'] = parseInt(sm[2], 10);
                        }
                        continue;
                    }

                    // Skills / Abilità
                    const skMatch = line.match(/^(?:Skills|Abilit[àa])\s*:?\s*(.+)$/i);
                    if (skMatch) {
                        const skRegex = /([A-Za-zÀ-ÿ\s]+?)\s*([+-]\d+)(?:,|;|$)/g;
                        let skm;
                        while ((skm = skRegex.exec(skMatch[1])) !== null) {
                            const skName = skm[1].trim().toLowerCase();
                            if (skName) result.skills[skName] = parseInt(skm[2], 10);
                        }
                        continue;
                    }

                    // Resistances / Immunities / Vulnerabilities
                    const resMatch = line.match(/^(?:Damage Resistances|Resistenze ai Danni|Resistances)\s*:?\s*(.+)$/i);
                    if (resMatch) {
                        result.damage_resistances = resMatch[1].trim();
                        continue;
                    }
                    const immMatch = line.match(/^(?:Damage Immunities|Immunit[àa] ai Danni|Immunities)\s*:?\s*(.+)$/i);
                    if (immMatch) {
                        const val = immMatch[1].trim();
                        if (val.includes(';')) {
                            const parts = val.split(';');
                            result.damage_immunities = parts[0].trim();
                            result.condition_immunities = parts.slice(1).join(';').trim();
                        } else {
                            result.damage_immunities = val;
                        }
                        continue;
                    }
                    const cimmMatch = line.match(/^(?:Condition Immunities|Immunit[àa] alle Condizioni)\s*:?\s*(.+)$/i);
                    if (cimmMatch) {
                        result.condition_immunities = cimmMatch[1].trim();
                        continue;
                    }

                    // Senses / Sensi
                    const senMatch = line.match(/^(?:Senses|Sensi)\s*:?\s*(.+)$/i);
                    if (senMatch) {
                        result.senses = senMatch[1].trim();
                        continue;
                    }

                    // Languages / Linguaggi
                    const langMatch = line.match(/^(?:Languages|Linguaggi)\s*:?\s*(.+)$/i);
                    if (langMatch) {
                        result.languages = langMatch[1].trim();
                        continue;
                    }

                    // Challenge / Grado Sfida / CR
                    const crMatch = line.match(/^(?:Challenge|CR|Grado Sfida|Sfida)\s*:?\s*([0-9\/]+(?:\s*\([^)]+\))?)/i);
                    if (crMatch) {
                        result.challenge_rating = crMatch[1].replace(/\s*XP.*?\)/i, ' XP)').trim();
                        currentSection = 'traits';
                        continue;
                    }

                    // Proficiency Bonus (spesso sulla stessa riga o subito dopo Challenge)
                    if (/^(?:Proficiency Bonus|Bonus di Competenza)\s*:?\s*[+-]?\d+/i.test(line)) {
                        currentSection = 'traits';
                        continue;
                    }

                    // Se incontriamo una riga che inizia chiaramente come Tratto prima ancora di Challenge
                    if (/^[A-ZÀ-Ý][A-Za-zÀ-ÿ0-9\s'’\-\(\)\/]{1,45}\.\s+.+/.test(line)) {
                        currentSection = 'traits';
                    } else {
                        continue;
                    }
                }

                // Ignora eventuale riga isolata di Proficiency Bonus subito dopo Challenge
                if (/^(?:Proficiency Bonus|Bonus di Competenza)\s*:?\s*[+-]?\d+$/i.test(line)) {
                    continue;
                }

                // Se siamo in Azioni Leggendarie e la riga è l'introduzione ("The paladin can take 3 legendary actions...")
                if (currentSection === 'legendary' && !currentEntry && /legendary action|azioni leggendarie/i.test(line) && !/^[A-Z][^.]+\.\s+/.test(line)) {
                    result.legendary_desc = line;
                    continue;
                }

                // Riconoscimento di un nuovo Tratto / Azione / Reazione:
                // Formato 1: "Greatsword. Melee Weapon Attack: +8 to hit..." oppure "Lay on Hands (50 HP/Day). The paladin..."
                const inlineEntryMatch = line.match(/^([A-ZÀ-Ý][A-Za-zÀ-ÿ0-9\s'’\-\(\)\/,]{1,52}?)\.\s+(.+)$/);
                // Evita di scambiare le righe di incantesimi ("1st level (4 slots): ...") o "Hit:" per nuovi blocchi
                const isSpellSlotLine = /^(?:Cantrips|Trucchetti|\d+(?:st|nd|rd|th|°)\s+level|At will|A volont[àa]|\d+\/day|\d+\/giorno|•|-)\b/i.test(line);

                if (inlineEntryMatch && !isSpellSlotLine && !/^(Hit|Miss|Colpito|Mancato|Failure|Success)$/i.test(inlineEntryMatch[1])) {
                    flushEntry();
                    currentEntry = {
                        section: currentSection === 'header' ? 'traits' : currentSection,
                        name: inlineEntryMatch[1].trim(),
                        desc: inlineEntryMatch[2].trim()
                    };
                    continue;
                }

                // Formato 2: Titolo su una riga da solo ("Greatsword" o "Multiattack.") e descrizione sulla riga seguente
                const isShortTitleLine = !isSpellSlotLine && line.length <= 48 && /^[A-ZÀ-Ý][A-Za-zÀ-ÿ0-9\s'’\-\(\)\/]+\.?$/.test(line) && !line.endsWith(':') && !line.endsWith(',');
                if (isShortTitleLine && i + 1 < lines.length) {
                    flushEntry();
                    currentEntry = {
                        section: currentSection === 'header' ? 'traits' : currentSection,
                        name: line.replace(/\.$/, '').trim(),
                        desc: lines[i + 1].trim()
                    };
                    i++;
                    continue;
                }

                // Altrimenti è una riga di continuazione (es. lista incantesimi o paragrafo successivo dell'azione corrente)
                if (currentEntry) {
                    currentEntry.desc += '\n' + line;
                } else {
                    currentEntry = {
                        section: currentSection === 'header' ? 'traits' : currentSection,
                        name: isItalianMode ? 'Tratto' : 'Feature',
                        desc: line
                    };
                }
            }

            flushEntry();
            return result;
        },

        assignToSelectedToken(monster) {
            const eng = getEngine();
            if (!eng || !eng.tokens) return;
            const targetTokens = (eng.selectedTokens && eng.selectedTokens.size > 0)
                ? eng.tokens.filter(t => eng.selectedTokens.has(t.id))
                : (eng.selectedTokenId ? [eng.tokens.find(t => t.id === eng.selectedTokenId)].filter(Boolean) : []);

            if (targetTokens.length === 0) {
                alert("Seleziona prima almeno un token sulla mappa cliccandoci sopra!");
                return;
            }

            const hpVal = parseInt(monster.hit_points) || 10;
            const acVal = parseInt(monster.armor_class) || 10;

            targetTokens.forEach(token => {
                const st = JSON.parse(JSON.stringify(monster));
                st._raw = rawMonster ? JSON.parse(JSON.stringify(rawMonster)) : JSON.parse(JSON.stringify(monster));
                if (st._raw && st._raw.tokenSrc) delete st._raw.tokenSrc;
                st._isItalian = isItalianMode;
                token.statblock = st;

                token.ac = acVal;
                // SEMPRE FULL VITA!
                token.hpMax = hpVal;
                token.hpCurrent = hpVal;
                token.hpVisibleToPlayers = true;
                if (typeof window.upsertTokenInCampaign === 'function') window.upsertTokenInCampaign(token);

                // Se presente in iniziativa, aggiorna
                if (eng.initiative && eng.initiative.participants) {
                    const p = eng.initiative.participants.find(x => x.tokenId === token.id);
                    if (p) {
                        p.hpCurrent = hpVal;
                        p.hpMax = hpVal;
                        p.ac = acVal;
                    }
                }
            });

            // Se il mostro ha un'immagine di token personalizzata, aggiorniamo la grafica una sola volta
            if (monster.tokenSrc) {
                const newImg = new Image();
                newImg.onload = () => {
                    targetTokens.forEach(token => {
                        token.imageObj = newImg;
                        token.src = monster.tokenSrc;
                        if (typeof window.markTokenImageDirty === 'function') window.markTokenImageDirty(token.id);
                    });
                    eng.renderAll();
                    if (typeof window.syncState === 'function') window.syncState(true, false);
                };
                newImg.src = monster.tokenSrc;
            }

            // Aggiorna controlli barra laterale se uno è selezionato
            const prim = eng.tokens.find(t => t.id === eng.selectedTokenId);
            if (prim && typeof window.updateSelectedTokenControls === 'function') {
                window.updateSelectedTokenControls(prim);
            }

            if (eng.initiative && typeof renderTrackerList === 'function') {
                renderTrackerList();
            }

            eng.renderAll();
            if (typeof window.syncState === 'function') window.syncState(true, false);
            else if (typeof syncState === 'function') syncState(true, false);

            if (typeof showToast === 'function') {
                showToast(`Scheda "${monster.name}" assegnata a ${targetTokens.length} token (Full PV: ${hpVal}, CA: ${acVal})!`);
            }
        },

        spawnAsToken(monster) {
            const eng = getEngine();
            if (!eng) return;
            const sizeMap = { 'tiny': 1, 'small': 1, 'medium': 1, 'large': 2, 'huge': 3, 'gargantuan': 4, 't': 1, 's': 1, 'm': 1, 'l': 2, 'h': 3, 'g': 4, 'minuscola': 1, 'piccola': 1, 'media': 1, 'grande': 2, 'enorme': 3, 'mastodontica': 4 };
            const sizeKey = (monster.size || 'm').toLowerCase();
            const sizeMult = sizeMap[sizeKey] || 1;
            const pxSize = eng.grid.size * sizeMult;

            const tokenSrc = monster.tokenSrc || this.generateLetterToken(monster);

            // Posiziona al centro della vista
            const centerWorld = eng.screenToWorld(eng.layers.ui.width/2, eng.layers.ui.height/2);
            const effOffsetX = (eng.grid.offsetX || 0) % eng.grid.size;
            const effOffsetY = (eng.grid.offsetY || 0) % eng.grid.size;
            const snappedX = Math.round((centerWorld.x - effOffsetX) / eng.grid.size) * eng.grid.size + effOffsetX;
            const snappedY = Math.round((centerWorld.y - effOffsetY) / eng.grid.size) * eng.grid.size + effOffsetY;

            // Categoria di destinazione: 'mostri' (numerato 1, 2...) oppure 'png' (nome unico senza numero)
            const targetCat = document.getElementById('statblock-spawn-category')?.value || 'mostri';
            let baseName = monster.name || 'Monster';
            let assignedName = baseName;

            if (targetCat !== 'png' && targetCat !== 'pg') {
                let maxNum = 0;
                let foundAny = false;
                eng.tokens.forEach(t => {
                    const tName = t.name || '';
                    if (tName === baseName) {
                        foundAny = true;
                        if (maxNum < 1) maxNum = 1;
                    } else if (tName.startsWith(baseName + ' ')) {
                        foundAny = true;
                        const numPart = parseInt(tName.substring(baseName.length + 1));
                        if (!isNaN(numPart) && numPart > maxNum) maxNum = numPart;
                    }
                });
                assignedName = (foundAny || maxNum > 0) ? `${baseName} ${maxNum + 1}` : `${baseName} 1`;
            }

            const imgObj = new Image();
            imgObj.onload = () => {
                const hpVal = parseInt(monster.hit_points) || 10;
                const acVal = parseInt(monster.armor_class) || 10;

                const st = JSON.parse(JSON.stringify(monster));
                st._raw = rawMonster ? JSON.parse(JSON.stringify(rawMonster)) : JSON.parse(JSON.stringify(monster));
                if (st._raw && st._raw.tokenSrc) delete st._raw.tokenSrc;
                st._isItalian = isItalianMode;

                const token = {
                    id: 'token_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                    name: assignedName,
                    nameVisibility: 'all',
                    originalName: monster.name,
                    x: snappedX,
                    y: snappedY,
                    width: pxSize,
                    height: pxSize,
                    sizeMultiplier: sizeMult,
                    src: tokenSrc,
                    category: targetCat,
                    visible: !(document.getElementById('statblock-spawn-invisible')?.checked),
                    imageObj: imgObj,
                    // Statistiche complete
                    ac: acVal,
                    hpMax: hpVal,
                    hpCurrent: hpVal,
                    hpVisibleToPlayers: true,
                    statblock: st
                };

                eng.tokens.push(token);
                if (typeof window.upsertTokenInCampaign === 'function') window.upsertTokenInCampaign(token);
                eng.selectedTokens.clear();
                eng.selectedTokens.add(token.id);
                eng.selectedTokenId = token.id;

                if (typeof window.updateSelectedTokenControls === 'function') {
                    window.updateSelectedTokenControls(token);
                }

                eng.renderAll();
                if (typeof window.syncState === 'function') window.syncState(true, false);
                else if (typeof syncState === 'function') syncState(true, false);
                if (typeof updateMapTokensGallery === 'function') updateMapTokensGallery();
                if (typeof showToast === 'function') {
                    const isInv = !token.visible;
                    const pfx = isInv ? (typeof window.t === 'function' ? window.t('🙈 Creato token INVISIBILE') : '🙈 Creato token INVISIBILE') : (typeof window.t === 'function' ? window.t('♟️ Creato token') : '♟️ Creato token');
                    showToast(`${pfx} "${assignedName}" (Full PV: ${hpVal}, CA: ${acVal})!`);
                }
            };
            imgObj.src = tokenSrc;
        },

        open(statblockToDisplay = null) {
            const win = document.getElementById('dm-statblock-window');
            if (!win) return;
            win.style.display = 'flex';
            win.style.zIndex = '1150';

            const eng = getEngine();
            const selectedToken = (eng && eng.selectedTokenId)
                ? eng.tokens.find(tok => tok.id === eng.selectedTokenId)
                : null;
            const targetStatblock = statblockToDisplay || (selectedToken ? selectedToken.statblock : null);

            if (targetStatblock) {
                this.loadMonster(targetStatblock);
            } else if (selectedToken && !selectedToken.statblock) {
                const details = document.getElementById('statblock-details');
                const placeholder = document.getElementById('statblock-placeholder');
                if (details) details.style.display = 'none';
                if (placeholder) {
                    placeholder.style.display = 'block';
                    const tokenName = selectedToken.name || (selectedToken.originalName ? selectedToken.originalName.replace(/\.[^/.]+$/, "") : 'questo token');
                    placeholder.innerHTML = `
                        <div style="text-align: center; color: #aaa; padding: 35px 15px;">
                            <div style="font-size: 32px; margin-bottom: 10px;">📜</div>
                            <strong style="color: #ef5350; font-size: 15px;">Nessuna scheda associata</strong>
                            <p style="font-size: 12px; color: #aaa; margin: 8px 0 15px 0;">Il token <b>"${tokenName}"</b> non ha ancora una scheda mostro/PNG assegnata.</p>
                            <span style="font-size: 11px; color: #888; background: #222; padding: 6px 10px; border-radius: 4px; border: 1px solid #444;">
                                🔍 Cerca un mostro nella barra in alto oppure usa <b>📥 Incolla JSON / Testo</b> per assegnarlo!
                            </span>
                        </div>
                    `;
                }
                currentMonster = null;
                rawMonster = null;
                this.updateAssignButtonText();
            } else {
                this.updateAssignButtonText();
            }
        },

        close() {
            const win = document.getElementById('dm-statblock-window');
            if (win) win.style.display = 'none';
        },

        get currentMonster() { return currentMonster; },
        get rawMonster() { return rawMonster; },
        get isItalianMode() { return isItalianMode; }
    };

    if (typeof window !== 'undefined') {
        window.compendium = compendium;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = compendium;
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => compendium.init());
        } else {
            compendium.init();
        }
    }
})();
