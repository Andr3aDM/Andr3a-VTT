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
        t = t.replace(/Strength Saving Throw:/gi, 'Tiro Salvezza su Forza:');
        t = t.replace(/Dexterity Saving Throw:/gi, 'Tiro Salvezza su Destrezza:');
        t = t.replace(/Constitution Saving Throw:/gi, 'Tiro Salvezza su Costituzione:');
        t = t.replace(/Intelligence Saving Throw:/gi, 'Tiro Salvezza su Intelligenza:');
        t = t.replace(/Wisdom Saving Throw:/gi, 'Tiro Salvezza su Saggezza:');
        t = t.replace(/Charisma Saving Throw:/gi, 'Tiro Salvezza su Carisma:');
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
        t = t.replace(/\bFailure or Success:/gi, 'Fallimento o Successo:');
        t = t.replace(/\bFallimento o successo:/gi, 'Fallimento o Successo:');
        t = t.replace(/\bSecond Failure:/gi, 'Secondo Fallimento:');
        t = t.replace(/\bFailure:/gi, 'Fallimento:');
        t = t.replace(/\bSuccess:/gi, 'Successo:');
        t = t.replace(/\bTrigger:/gi, 'Innesco:');
        t = t.replace(/\bResponse:/gi, 'Risposta:');
        t = t.replace(/\bAt will:/gi, 'A volontà:');
        t = t.replace(/\b(\d+)\/day each:/gi, '$1/giorno ciascuno:');
        t = t.replace(/\b(\d+)\/day:/gi, '$1/giorno:');
        t = t.replace(/\bCantrips\s*\(at will\):/gi, 'Trucchetti (a volontà):');

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

    const CR_XP_TABLE = {
        '0': 10, '1/8': 25, '0.125': 25, '1/4': 50, '0.25': 50, '1/2': 100, '0.5': 100,
        '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800, '6': 2300, '7': 2900, '8': 3900,
        '9': 5000, '10': 5900, '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000,
        '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000, '21': 33000,
        '22': 41000, '23': 50000, '24': 62000, '25': 75000, '26': 90000, '27': 105000,
        '28': 120000, '29': 135000, '30': 155000
    };

    const SOURCE_LABELS = {
        'XMM': "MM'25", 'MM': "MM'14", 'XPHB': "PHB'24", 'PHB': "PHB'14",
        'XDMG': "DMG'24", 'DMG': "DMG'14", 'MPMM': 'MPMM', 'FTD': 'FTD',
        'VGM': 'VGM', 'MTF': 'MTF', 'BGG': 'BGG', 'TCE': 'TCE', 'XGE': 'XGE'
    };

    // Gruppi Leggendari (Effetti Regionali & Tana ufficiali per Draghi e creature iconiche 5eTools)
    const LEGENDARY_GROUPS_DB = {
        'gold dragon': {
            regional_desc: "The region containing an adult or ancient gold dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Dream Messenger", desc: "While in its lair, the dragon can cast {@spell Dream|XPHB}, requiring no Material components and using Charisma as the spellcasting ability. When casting the spell this way, the dragon can target any creature within 6 miles." },
                { name: "Foretelling Fog", desc: "The area within 1 mile of the lair is Lightly Obscured by opalescent fog. While in that area, creatures can't be surprised, as the fog swirls into shapes that warn of danger." }
            ]
        },
        'red dragon': {
            regional_desc: "The region containing an adult or ancient red dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Burning Heat", desc: "The area within 1 mile of the lair is an area of extreme heat. Any water in the area other than magical water is superheated." },
                { name: "Sulfurous Haze", desc: "The area within 1 mile of the lair is Lightly Obscured by foul-smelling sulfur smoke, and fiery fissures open across the terrain." }
            ]
        },
        'black dragon': {
            regional_desc: "The region containing an adult or ancient black dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Accrid Miasma", desc: "The area within 1 mile of the lair is Lightly Obscured by foul fog, and standing water within 1 mile is tainted and acidic." },
                { name: "Tangled Mire", desc: "Overgrown vegetation and thick mud within 1 mile of the lair form Difficult Terrain." }
            ]
        },
        'blue dragon': {
            regional_desc: "The region containing an adult or ancient blue dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Mirage Terrain", desc: "While in its lair, the dragon can cast {@spell Hallucinatory Terrain|XPHB}, requiring no Material components." },
                { name: "Thunderstorms", desc: "Dust devils and electrical storms rage within 1 mile of the lair, making the area Lightly Obscured." }
            ]
        },
        'green dragon': {
            regional_desc: "The region containing an adult or ancient green dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Labyrinthine Woods", desc: "Thickets within 1 mile of the lair form natural mazes and Difficult Terrain, blocking line of sight." },
                { name: "Whispering Wildlife", desc: "Rodents and birds within 1 mile of the lair act as eyes and ears for the dragon, which can cast {@spell Animal Messenger|XPHB} at will." }
            ]
        },
        'white dragon': {
            regional_desc: "The region containing an adult or ancient white dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Freezing Fog", desc: "Chilly fog Lightly Obscures the area within 1 mile of the lair, and extreme cold prevails." },
                { name: "Icy Walls", desc: "Icy surfaces and freezing precipitation coat the terrain within 1 mile of the lair." }
            ]
        },
        'silver dragon': {
            regional_desc: "The region containing an adult or ancient silver dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Cloud Refuge", desc: "While in its lair, the dragon can cast {@spell Control Weather|XPHB} requiring no Material components." },
                { name: "Gentle Winds", desc: "High winds within 1 mile of the lair cushion falling creatures, which take half damage from falling." }
            ]
        },
        'bronze dragon': {
            regional_desc: "The region containing an adult or ancient bronze dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Phantom Mirage", desc: "While in its lair, the dragon can cast {@spell Mirage Arcane|XPHB} and {@spell Control Weather|XPHB} requiring no Material components." },
                { name: "Underwater Breathing", desc: "Friendly creatures chosen by the dragon within 1 mile of the lair can breathe underwater." }
            ]
        },
        'brass dragon': {
            regional_desc: "The region containing an adult or ancient brass dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Desert Mirage", desc: "While in its lair, the dragon can cast {@spell Major Image|XPHB} within 1 mile of the lair." },
                { name: "Revealing Tracks", desc: "Creatures leave clear tracks in the sand within 1 mile of the lair, and water sources remain pure." }
            ]
        },
        'copper dragon': {
            regional_desc: "The region containing an adult or ancient copper dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Stone Carvings", desc: "Magical carvings of the dragon's visage appear on stone surfaces within 1 mile of the lair." },
                { name: "Sylvan Laughter", desc: "Tiny beasts within 1 mile of the lair can speak and understand Draconic." }
            ]
        },
        'deep dragon': {
            regional_desc: "The region containing an adult or ancient deep dragon's lair is altered by its presence, creating the following effects:",
            regional_footer: "If the dragon dies or moves its lair elsewhere, these effects end immediately.",
            regional_effects: [
                { name: "Preservation of Knowledge", desc: "Books and other written forms of communication within 1 mile of the lair become magically protected and can't be damaged by nonmagical means." },
                { name: "Restless Sleep", desc: "When a creature finishes a Long Rest within 1 mile of the lair, it must succeed on a Constitution saving throw or fail to reduce its Exhaustion level." },
                { name: "Verdant Growth", desc: "Vegetation and fungi within 1 mile of the dragon's lair grow faster and cover a greater area than normal." }
            ]
        }
    };

    // ==========================================
    // DATABASE INCANTESIMI RAPIDO + CACHE TOOLTIP HOVER
    // ==========================================
    const BUILTIN_SPELLS_DB = {
        'detect magic': {
            name: 'Detect Magic', nameIt: 'Individuazione del Magico',
            level: 1, school: 'Divination', schoolIt: 'Divinazione',
            time: '1 Action', timeIt: '1 Azione', range: 'Self (30-ft. radius)', rangeIt: 'Incantatore (raggio 30 ft.)',
            components: 'V, S', duration: 'Concentration, up to 10 minutes', durationIt: 'Concentrazione, fino a 10 minuti',
            desc: 'For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can take a Magic action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.',
            descIt: 'Per la durata, percepisci la presenza di magia entro 30 ft. da te. Se percepisci magia in questo modo, puoi usare un\'azione per vedere un debole alone attorno a qualsiasi creatura o oggetto visibile nell\'area che porti magia, e ne apprendi la scuola di magia.'
        },
        'guiding bolt': {
            name: 'Guiding Bolt', nameIt: 'Dardo Tracciante',
            level: 1, school: 'Evocation', schoolIt: 'Invocazione',
            time: '1 Action', timeIt: '1 Azione', range: '120 feet', rangeIt: '120 ft.',
            components: 'V, S', duration: '1 round', durationIt: '1 round',
            desc: 'You hurl a bolt of mystical light toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 Radiant damage, and the next attack roll made against this target before the end of your next turn has Advantage. At Higher Levels: +1d6 Radiant damage for each spell slot level above 1 (Level 4 version: 7d6 Radiant damage).',
            descIt: 'Scagli un dardo di luce mistica contro una creatura entro gittata. Effettua un attacco con incantesimo a distanza. Se colpisci, il bersaglio subisce 4d6 danni radiosi e il prossimo tiro per colpire effettuato contro di esso prima della fine del tuo prossimo turno ha Vantaggio. Ai Livelli Superiori: +1d6 danni radiosi per ogni livello sopra il 1° (Versione di 4° livello: 7d6 danni radiosi).'
        },
        'shapechange': {
            name: 'Shapechange', nameIt: 'Trasformazione',
            level: 9, school: 'Transmutation', schoolIt: 'Trasmutazione',
            time: '1 Action', timeIt: '1 Azione', range: 'Self', rangeIt: 'Incantatore',
            components: 'V, S, M', duration: 'Concentration, up to 1 hour', durationIt: 'Concentrazione, fino a 1 ora',
            desc: 'You assume the form of a different creature for the duration. The new form can be of any creature with a Challenge Rating equal to your level or lower. You retain your Intelligence, Wisdom, and Charisma scores, as well as your alignment, personality, and proficiencies.',
            descIt: 'Assumi la forma di una creatura diversa per la durata. La nuova forma può essere qualsiasi creatura con Grado Sfida pari o inferiore al tuo livello. Mantieni i tuoi punteggi di Intelligenza, Saggezza e Carisma, oltre a personalità, allineamento e competenze.'
        },
        'flame strike': {
            name: 'Flame Strike', nameIt: 'Colpo Infuocato',
            level: 5, school: 'Evocation', schoolIt: 'Invocazione',
            time: '1 Action', timeIt: '1 Azione', range: '60 feet (10-ft. cylinder)', rangeIt: '60 ft. (cilindro 10 ft.)',
            components: 'V, S, M', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'A vertical column of divine fire roars down from above in a 10-foot-radius, 40-foot-high Cylinder. Each creature in the Cylinder makes a Dexterity saving throw, taking 5d6 Fire damage and 5d6 Radiant damage on a failed save, or half as much damage on a successful one. At Higher Levels: +1d6 damage for each slot level above 5.',
            descIt: 'Una colonna verticale di fuoco divino ruggisce dall\'alto in un cilindro con raggio di 10 ft. e alto 40 ft. Ogni creatura nel cilindro effettua un tiro salvezza su Destrezza: subisce 5d6 danni da fuoco e 5d6 danni radiosi in caso di fallimento, o la metà in caso di successo. Ai Livelli Superiori: +1d6 danni per ogni livello sopra il 5°.'
        },
        'word of recall': {
            name: 'Word of Recall', nameIt: 'Parola del Richiamo',
            level: 6, school: 'Conjuration', schoolIt: 'Evocazione',
            time: '1 Action', timeIt: '1 Azione', range: '5 feet', rangeIt: '5 ft.',
            components: 'V', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'You and up to five willing creatures within 5 feet of you instantly teleport to a previously designated sanctuary. You and any creatures that teleport with you appear in the nearest unoccupied space to the spot you designated.',
            descIt: 'Tu e fino a cinque creature consenzienti entro 5 ft. da te vi teletrasportate istantaneamente in un santuario precedentemente designato, apparendo nello spazio libero più vicino al punto scelto.'
        },
        'zone of truth': {
            name: 'Zone of Truth', nameIt: 'Zona di Verità',
            level: 2, school: 'Enchantment', schoolIt: 'Ammaliamento',
            time: '1 Action', timeIt: '1 Azione', range: '60 feet (15-ft. sphere)', rangeIt: '60 ft. (sfera 15 ft.)',
            components: 'V, S', duration: '10 minutes', durationIt: '10 minuti',
            desc: 'You create a magical zone that guards against deception in a 15-foot-radius Sphere centered on a point within range. Until the spell ends, a creature that enters the spell\'s area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can\'t speak a deliberate lie while in the radius.',
            descIt: 'Crei una zona magica contro l\'inganno in una sfera di 15 ft. di raggio. Fino al termine dell\'incantesimo, una creatura che entra nell\'area o vi inizia il turno deve effettuare un tiro salvezza su Carisma. Se fallisce, non può pronunciare alcuna bugia deliberata finché resta nel raggio.'
        },
        'dream': {
            name: 'Dream', nameIt: 'Sogno',
            level: 5, school: 'Illusion', schoolIt: 'Illusione',
            time: '1 Minute', timeIt: '1 Minuto', range: 'Special', rangeIt: 'Speciale',
            components: 'V, S, M', duration: '8 hours', durationIt: '8 ore',
            desc: 'You shape a creature\'s dreams. Choose a creature known to you on the same plane of existence. You or a willing messenger enters a trance and shapes the target\'s dream environment, conversing with it or turning the dream monstrous (Wisdom save or take 3d6 Psychic damage and gain no benefit from the rest).',
            descIt: 'Plasmi i sogni di una creatura a te nota sullo stesso piano di esistenza. Puoi conversare con il bersaglio nel sogno oppure rendere l\'incubo mostruoso (tiro salvezza su Saggezza o subisce 3d6 danni psichici e non ottiene benefici dal riposo).'
        },
        'fireball': {
            name: 'Fireball', nameIt: 'Palla di Fuoco',
            level: 3, school: 'Evocation', schoolIt: 'Invocazione',
            time: '1 Action', timeIt: '1 Azione', range: '150 feet (20-ft. sphere)', rangeIt: '150 ft. (sfera 20 ft.)',
            components: 'V, S, M', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'A bright streak flashes from you to a point you choose within range and blossoms with a low roar into a 20-foot-radius Sphere of flame. Each creature in the Sphere makes a Dexterity saving throw, taking 8d6 Fire damage on a failed save or half as much damage on a successful one.',
            descIt: 'Una scia luminosa esplode in una sfera di fiamme con raggio di 20 ft. Ogni creatura nell\'area effettua un tiro salvezza su Destrezza, subendo 8d6 danni da fuoco in caso di fallimento o la metà in caso di successo.'
        },
        'lightning bolt': {
            name: 'Lightning Bolt', nameIt: 'Fulmine',
            level: 3, school: 'Evocation', schoolIt: 'Invocazione',
            time: '1 Action', timeIt: '1 Azione', range: 'Self (100-ft. line)', rangeIt: 'Incantatore (linea 100 ft.)',
            components: 'V, S, M', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'A stroke of lightning forming a Line 100 feet long and 5 feet wide blasts out from you. Each creature in the Line makes a Dexterity saving throw, taking 8d6 Lightning damage on a failed save or half as much damage on a successful one.',
            descIt: 'Un fulmine lungo 100 ft. e largo 5 ft. scaturisce da te. Ogni creatura nella linea effettua un tiro salvezza su Destrezza, subendo 8d6 danni da fulmine in caso di fallimento o la metà in caso di successo.'
        },
        'counterspell': {
            name: 'Counterspell', nameIt: 'Controincantesimo',
            level: 3, school: 'Abjuration', schoolIt: 'Abiurazione',
            time: '1 Reaction', timeIt: '1 Reazione', range: '60 feet', rangeIt: '60 ft.',
            components: 'S', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'You attempt to interrupt a creature in the process of casting a spell within 60 feet. On a failed Constitution saving throw (or ability check in 2014 rules), the creature\'s spell dissipates with no effect.',
            descIt: 'Tenti di interrompere una creatura mentre sta lanciando un incantesimo entro 60 ft., dissipando la magia prima che abbia effetto.'
        },
        'dispel magic': {
            name: 'Dispel Magic', nameIt: 'Dissolvi Magie',
            level: 3, school: 'Abjuration', schoolIt: 'Abiurazione',
            time: '1 Action', timeIt: '1 Azione', range: '120 feet', rangeIt: '120 ft.',
            components: 'V, S', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'Choose one creature, object, or magical effect within range. Any spell of level 3 or lower on the target ends. For each spell of level 4 or higher on the target, make an ability check using your spellcasting ability (DC 10 + the spell\'s level).',
            descIt: 'Scegli una creatura, oggetto o effetto magico entro gittata. Qualsiasi incantesimo di 3° livello o inferiore termina automaticamente. Per incantesimi di 4° livello o superiore, effettua una prova con la tua caratteristica da incantatore (CD 10 + livello incantesimo).'
        },
        'mage armor': {
            name: 'Mage Armor', nameIt: 'Armatura Magica',
            level: 1, school: 'Abjuration', schoolIt: 'Abiurazione',
            time: '1 Action', timeIt: '1 Azione', range: 'Touch', rangeIt: 'Contatto',
            components: 'V, S, M', duration: '8 hours', durationIt: '8 ore',
            desc: 'You touch a willing creature who isn\'t wearing armor. Until the spell ends, the target\'s base AC becomes 13 + its Dexterity modifier.',
            descIt: 'Tocchi una creatura consenziente che non indossa armatura. Fino al termine dell\'incantesimo, la CA base del bersaglio diventa 13 + il suo modificatore di Destrezza.'
        },
        'shield': {
            name: 'Shield', nameIt: 'Scudo',
            level: 1, school: 'Abjuration', schoolIt: 'Abiurazione',
            time: '1 Reaction', timeIt: '1 Reazione', range: 'Self', rangeIt: 'Incantatore',
            components: 'V, S', duration: '1 round', durationIt: '1 round',
            desc: 'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from Magic Missile.',
            descIt: 'Una barriera invisibile di forza magica ti protegge. Fino all\'inizio del tuo prossimo turno hai un bonus di +5 alla CA (incluso contro l\'attacco innescante) e non subisci danni da Dardo Incantato.'
        },
        'magic missile': {
            name: 'Magic Missile', nameIt: 'Dardo Incantato',
            level: 1, school: 'Evocation', schoolIt: 'Invocazione',
            time: '1 Action', timeIt: '1 Azione', range: '120 feet', rangeIt: '120 ft.',
            components: 'V, S', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 Force damage to its target. The darts all strike simultaneously.',
            descIt: 'Crei tre dardi luminosi di forza magica. Ogni dardo colpisce automaticamente una creatura visibile entro gittata infliggendo 1d4 + 1 danni da forza.'
        },
        'invisibility': {
            name: 'Invisibility', nameIt: 'Invisibilità',
            level: 2, school: 'Illusion', schoolIt: 'Illusione',
            time: '1 Action', timeIt: '1 Azione', range: 'Touch', rangeIt: 'Contatto',
            components: 'V, S, M', duration: 'Concentration, up to 1 hour', durationIt: 'Concentrazione, fino a 1 ora',
            desc: 'A creature you touch has the Invisible condition until the spell ends. The spell ends early immediately after the target makes an attack roll, deals damage, or casts a spell.',
            descIt: 'Una creatura che tocchi ottiene la condizione Invisibile fino al termine dell\'incantesimo. L\'incantesimo termina se il bersaglio attacca, infligge danni o lancia un incantesimo.'
        },
        'greater invisibility': {
            name: 'Greater Invisibility', nameIt: 'Invisibilità Superiore',
            level: 4, school: 'Illusion', schoolIt: 'Illusione',
            time: '1 Action', timeIt: '1 Azione', range: 'Touch', rangeIt: 'Contatto',
            components: 'V, S', duration: 'Concentration, up to 1 minute', durationIt: 'Concentrazione, fino a 1 minuto',
            desc: 'A creature you touch has the Invisible condition until the spell ends (even if it attacks or casts spells).',
            descIt: 'Una creatura che tocchi diventa Invisibile fino al termine dell\'incantesimo (anche se effettua attacchi o lancia incantesimi).'
        },
        'fly': {
            name: 'Fly', nameIt: 'Volare',
            level: 3, school: 'Transmutation', schoolIt: 'Trasmutazione',
            time: '1 Action', timeIt: '1 Azione', range: 'Touch', rangeIt: 'Contatto',
            components: 'V, S, M', duration: 'Concentration, up to 10 minutes', durationIt: 'Concentrazione, fino a 10 minuti',
            desc: 'You touch a willing creature. For the duration, the target gains a Fly Speed of 60 feet and can hover.',
            descIt: 'Tocchi una creatura consenziente. Per la durata, il bersaglio ottiene una velocità di volare di 60 ft.'
        },
        'misty step': {
            name: 'Misty Step', nameIt: 'Passo Velato',
            level: 2, school: 'Conjuration', schoolIt: 'Evocazione',
            time: '1 Bonus Action', timeIt: '1 Azione Bonus', range: 'Self', rangeIt: 'Incantatore',
            components: 'V', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.',
            descIt: 'Avvolto brevemente da una nebbia argentea, ti teletrasporti fino a 30 ft. in uno spazio libero che puoi vedere.'
        },
        'dimension door': {
            name: 'Dimension Door', nameIt: 'Porta Dimensionale',
            level: 4, school: 'Conjuration', schoolIt: 'Evocazione',
            time: '1 Action', timeIt: '1 Azione', range: '500 feet', rangeIt: '500 ft.',
            components: 'V', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'You teleport yourself and up to one willing creature of your size or smaller within 5 feet to any spot within 500 feet.',
            descIt: 'Ti teletrasporti (insieme a un\'eventuale creatura consenziente entro 5 ft.) in qualsiasi punto entro 500 ft.'
        },
        'teleport': {
            name: 'Teleport', nameIt: 'Teletrasporto',
            level: 7, school: 'Conjuration', schoolIt: 'Evocazione',
            time: '1 Action', timeIt: '1 Azione', range: '10 feet', rangeIt: '10 ft.',
            components: 'V', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'This spell instantly transports you and up to eight willing creatures that you can see within range to a destination you select on the same plane of existence.',
            descIt: 'Trasporta istantaneamente te e fino a otto creature consenzienti entro gittata verso una destinazione scelta sullo stesso piano di esistenza.'
        },
        'plane shift': {
            name: 'Plane Shift', nameIt: 'Spostamento Planare',
            level: 7, school: 'Conjuration', schoolIt: 'Evocazione',
            time: '1 Action', timeIt: '1 Azione', range: 'Touch', rangeIt: 'Contatto',
            components: 'V, S, M', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'You and up to eight willing creatures who link hands in a circle are transported to a different plane of existence.',
            descIt: 'Tu e fino a otto creature consenzienti che si tengono per mano venite trasportati su un diverso piano di esistenza.'
        },
        'command': {
            name: 'Command', nameIt: 'Comando',
            level: 1, school: 'Enchantment', schoolIt: 'Ammaliamento',
            time: '1 Action', timeIt: '1 Azione', range: '60 feet', rangeIt: '60 ft.',
            components: 'V', duration: '1 round', durationIt: '1 round',
            desc: 'You speak a one-word command to a creature you can see within range (Approach, Drop, Flee, Grovel, or Halt). The target must succeed on a Wisdom saving throw or follow the command on its next turn.',
            descIt: 'Pronunci un comando di una sola parola a una creatura visibile entro gittata (Avvicinati, Lascia, Fuggi, Inchinati o Fermati). Il bersaglio deve superare un tiro salvezza su Saggezza o eseguire l\'ordine nel suo prossimo turno.'
        },
        'dissonant whispers': {
            name: 'Dissonant Whispers', nameIt: 'Sussurri Dissonanti',
            level: 1, school: 'Enchantment', schoolIt: 'Ammaliamento',
            time: '1 Action', timeIt: '1 Azione', range: '60 feet', rangeIt: '60 ft.',
            components: 'V', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'One creature of your choice within range hears a discordant melody. It makes a Wisdom saving throw, taking 3d6 Psychic damage and immediately using its Reaction to move as far as its Speed allows away from you on a failed save, or half damage only on a success.',
            descIt: 'Una creatura entro gittata sente una melodia discordante. Effettua un tiro salvezza su Saggezza: se fallisce subisce 3d6 danni psichici e usa subito la sua Reazione per allontanarsi da te; se riesce subisce solo la metà dei danni.'
        },
        'faerie fire': {
            name: 'Faerie Fire', nameIt: 'Luminescenza',
            level: 1, school: 'Evocation', schoolIt: 'Invocazione',
            time: '1 Action', timeIt: '1 Azione', range: '60 feet (20-ft. cube)', rangeIt: '60 ft. (cubo 20 ft.)',
            components: 'V', duration: 'Concentration, up to 1 minute', durationIt: 'Concentrazione, fino a 1 minuto',
            desc: 'Objects and creatures in a 20-foot Cube are outlined in light (Dexterity save negates for creatures). Attack rolls against an affected creature or object have Advantage, and it can\'t benefit from being Invisible.',
            descIt: 'Creature e oggetti in un cubo di 20 ft. vengono delineati di luce colorata (tiro salvezza su Destrezza nega). I tiri per colpire contro i bersagli illuminati hanno Vantaggio ed essi non possono beneficiare dell\'Invisibilità.'
        },
        'passwall': {
            name: 'Passwall', nameIt: 'Passapareti',
            level: 5, school: 'Transmutation', schoolIt: 'Trasmutazione',
            time: '1 Action', timeIt: '1 Azione', range: '30 feet', rangeIt: '30 ft.',
            components: 'V, S, M', duration: '1 hour', durationIt: '1 ora',
            desc: 'A passage appears at a point of your choice that you can see on a wooden, plaster, or stone surface within range (up to 5 feet wide, 8 feet tall, and 20 feet deep).',
            descIt: 'Un passaggio (largo fino a 5 ft., alto 8 ft. e profondo 20 ft.) si apre su una superficie di legno, intonaco o pietra visibile entro gittata.'
        },
        'water breathing': {
            name: 'Water Breathing', nameIt: "Respirare Sott'Acqua",
            level: 3, school: 'Transmutation', schoolIt: 'Trasmutazione',
            time: '1 Action', timeIt: '1 Azione', range: '30 feet', rangeIt: '30 ft.',
            components: 'V, S, M', duration: '24 hours', durationIt: '24 ore',
            desc: 'This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends.',
            descIt: 'Conferisce a fino a dieci creature consenzienti visibili entro gittata la capacità di respirare sott\'acqua per 24 ore.'
        },
        'hold person': {
            name: 'Hold Person', nameIt: 'Blocca Persone',
            level: 2, school: 'Enchantment', schoolIt: 'Ammaliamento',
            time: '1 Action', timeIt: '1 Azione', range: '60 feet', rangeIt: '60 ft.',
            components: 'V, S, M', duration: 'Concentration, up to 1 minute', durationIt: 'Concentrazione, fino a 1 minuto',
            desc: 'Choose a Humanoid that you can see within range. The target must succeed on a Wisdom saving throw or have the Paralyzed condition for the duration (repeats save at end of each of its turns).',
            descIt: 'Scegli un Umanoide visibile entro gittata. Il bersaglio deve superare un tiro salvezza su Saggezza o essere Paralizzato per la durata (ripete il tiro alla fine di ogni suo turno).'
        },
        'hold monster': {
            name: 'Hold Monster', nameIt: 'Blocca Mostri',
            level: 5, school: 'Enchantment', schoolIt: 'Ammaliamento',
            time: '1 Action', timeIt: '1 Azione', range: '90 feet', rangeIt: '90 ft.',
            components: 'V, S, M', duration: 'Concentration, up to 1 minute', durationIt: 'Concentrazione, fino a 1 minuto',
            desc: 'Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or have the Paralyzed condition for the duration (repeats save at end of each of its turns).',
            descIt: 'Scegli una creatura visibile entro gittata. Il bersaglio deve superare un tiro salvezza su Saggezza o essere Paralizzato per la durata (ripete il tiro alla fine di ogni suo turno).'
        },
        'polymorph': {
            name: 'Polymorph', nameIt: 'Metamorfosi',
            level: 4, school: 'Transmutation', schoolIt: 'Trasmutazione',
            time: '1 Action', timeIt: '1 Azione', range: '60 feet', rangeIt: '60 ft.',
            components: 'V, S, M', duration: 'Concentration, up to 1 hour', durationIt: 'Concentrazione, fino a 1 ora',
            desc: 'This spell transforms a creature that you can see within range into a new Beast form (Wisdom save negates for unwilling creatures).',
            descIt: 'Trasforma una creatura visibile entro gittata nella forma di una Bestia (tiro salvezza su Saggezza nega se non consenziente).'
        },
        'banishment': {
            name: 'Banishment', nameIt: 'Esilio',
            level: 4, school: 'Abjuration', schoolIt: 'Abiurazione',
            time: '1 Action', timeIt: '1 Azione', range: '60 feet', rangeIt: '60 ft.',
            components: 'V, S, M', duration: 'Concentration, up to 1 minute', durationIt: 'Concentrazione, fino a 1 minuto',
            desc: 'You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished.',
            descIt: 'Tenti di inviare una creatura visibile entro gittata su un altro piano di esistenza. Il bersaglio deve superare un tiro salvezza su Carisma o essere esiliato.'
        },
        'cone of cold': {
            name: 'Cone of Cold', nameIt: 'Cono di Freddo',
            level: 5, school: 'Evocation', schoolIt: 'Invocazione',
            time: '1 Action', timeIt: '1 Azione', range: 'Self (60-ft. cone)', rangeIt: 'Incantatore (cono 60 ft.)',
            components: 'V, S, M', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'A blast of cold air erupts from your hands in a 60-foot Cone. Each creature in the Cone makes a Constitution saving throw, taking 8d8 Cold damage on a failed save or half as much on a success.',
            descIt: 'Un\'esplosione di aria gelida erompe in un cono di 60 ft. Ogni creatura nel cono effettua un tiro salvezza su Costituzione, subendo 8d8 danni da freddo in caso di fallimento o la metà in caso di successo.'
        },
        'wall of force': {
            name: 'Wall of Force', nameIt: 'Muro di Forza',
            level: 5, school: 'Evocation', schoolIt: 'Invocazione',
            time: '1 Action', timeIt: '1 Azione', range: '120 feet', rangeIt: '120 ft.',
            components: 'V, S, M', duration: 'Concentration, up to 10 minutes', durationIt: 'Concentrazione, fino a 10 minuti',
            desc: 'An invisible wall of force springs into existence at a point you choose within range. Nothing can physically pass through the wall, and it is immune to all damage.',
            descIt: 'Un muro invisibile di pura forza appare in un punto scelto entro gittata. Nulla può attraversarlo fisicamente ed è immune a tutti i danni.'
        },
        'time stop': {
            name: 'Time Stop', nameIt: 'Fermare il Tempo',
            level: 9, school: 'Transmutation', schoolIt: 'Trasmutazione',
            time: '1 Action', timeIt: '1 Azione', range: 'Self', rangeIt: 'Incantatore',
            components: 'V', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'You briefly stop the flow of time for everyone but yourself. No time passes for other creatures, while you take 1d4 + 1 turns in a row.',
            descIt: 'Fermi brevemente il flusso del tempo per tutti tranne che per te stesso, effettuando 1d4 + 1 turni consecutivi.'
        },
        'power word kill': {
            name: 'Power Word Kill', nameIt: 'Parola del Potere Uccidere',
            level: 9, school: 'Enchantment', schoolIt: 'Ammaliamento',
            time: '1 Action', timeIt: '1 Azione', range: '60 feet', rangeIt: '60 ft.',
            components: 'V', duration: 'Instantaneous', durationIt: 'Istantanea',
            desc: 'You compel one creature you can see within range to die. If the target has 100 Hit Points or fewer, it dies. Otherwise, it takes 12d12 Psychic damage (2024 rules).',
            descIt: 'Costringi una creatura visibile entro gittata a morire. Se il bersaglio ha 100 Punti Ferita o meno, muore all\'istante (altrimenti subisce 12d12 danni psichici nelle regole 2024).'
        }
    };

    // Registro globale incantesimi rilevati e cache per tooltip
    const knownSpellsRegistry = new Map();
    const spellTooltipCache = new Map();
    for (const [k, v] of Object.entries(BUILTIN_SPELLS_DB)) {
        knownSpellsRegistry.set(k.toLowerCase(), v.name);
        if (v.nameIt) knownSpellsRegistry.set(v.nameIt.toLowerCase(), v.name);
        spellTooltipCache.set(v.name.toLowerCase(), v);
    }
    [
        'Acid Splash', 'Aid', 'Alarm', 'Alter Self', 'Animal Friendship', 'Animal Messenger', 'Animate Dead', 'Animate Objects',
        'Antilife Shell', 'Antimagic Field', 'Arcane Eye', 'Arcane Lock', 'Armor of Agathys', 'Arms of Hadar', 'Astral Projection',
        'Augury', 'Aura of Life', 'Aura of Purity', 'Aura of Vitality', 'Awaken', 'Bane', 'Banishing Smite', 'Barkskin',
        'Beacon of Hope', 'Bestow Curse', 'Bigby\'s Hand', 'Blade Barrier', 'Blade Ward', 'Bless', 'Blight', 'Blinding Smite',
        'Blindness/Deafness', 'Blink', 'Blur', 'Burning Hands', 'Call Lightning', 'Calm Emotions', 'Chain Lightning', 'Charm Monster',
        'Charm Person', 'Chill Touch', 'Chromatic Orb', 'Circle of Death', 'Clairvoyance', 'Clone', 'Cloud of Daggers', 'Cloudkill',
        'Color Spray', 'Compelled Duel', 'Comprehend Languages', 'Compulsion', 'Confusion', 'Conjure Animals', 'Conjure Barrage',
        'Conjure Celestial', 'Conjure Elemental', 'Conjure Fey', 'Conjure Minor Elementals', 'Conjure Volley', 'Conjure Woodland Beings',
        'Contact Other Plane', 'Contagion', 'Contingency', 'Continual Flame', 'Control Water', 'Control Weather', 'Create Food and Water',
        'Create Undead', 'Create or Destroy Water', 'Creation', 'Crown of Madness', 'Crusader\'s Mantle', 'Cure Wounds', 'Dancing Lights',
        'Darkness', 'Darkvision', 'Daylight', 'Death Ward', 'Delayed Blast Fireball', 'Demiplane', 'Destructive Wave', 'Detect Evil and Good',
        'Detect Poison and Disease', 'Detect Thoughts', 'Disguise Self', 'Disintegrate', 'Dispel Evil and Good', 'Divination', 'Divine Favor',
        'Divine Word', 'Dominate Beast', 'Dominate Monster', 'Dominate Person', 'Druidcraft', 'Earthquake', 'Eldritch Blast', 'Elemental Weapon',
        'Enhance Ability', 'Enlarge/Reduce', 'Ensnaring Strike', 'Entangle', 'Enthrall', 'Etherealness', 'Evard\'s Black Tentacles',
        'Expeditious Retreat', 'Eyebite', 'Fabricate', 'False Life', 'Fear', 'Feather Fall', 'Feeblemind', 'Feign Death', 'Find Familiar',
        'Find Steed', 'Find Traps', 'Find the Path', 'Finger of Death', 'Fire Bolt', 'Fire Shield', 'Fire Storm', 'Flaming Sphere',
        'Flesh to Stone', 'Fog Cloud', 'Forbiddance', 'Forcecage', 'Foresight', 'Freedom of Movement', 'Friends', 'Gaseous Form', 'Gate',
        'Geas', 'Gentle Repose', 'Giant Insect', 'Glibness', 'Globe of Invulnerability', 'Glyph of Warding', 'Goodberry', 'Grease',
        'Greater Restoration', 'Guardian of Faith', 'Guards and Wards', 'Guidance', 'Gust of Wind', 'Hail of Thorns', 'Hallow',
        'Hallucinatory Terrain', 'Harm', 'Haste', 'Heal', 'Healing Word', 'Heat Metal', 'Hellish Rebuke', 'Heroes\' Feast', 'Heroism',
        'Hex', 'Holy Aura', 'Hunger of Hadar', 'Hunter\'s Mark', 'Hypnotic Pattern', 'Ice Storm', 'Identify', 'Illusory Script',
        'Imprisonment', 'Incendiary Cloud', 'Inflict Wounds', 'Insect Plague', 'Instant Summons', 'Irresistible Dance', 'Jump', 'Knock',
        'Legend Lore', 'Leomund\'s Secret Chest', 'Leomund\'s Tiny Hut', 'Lesser Restoration', 'Levitate', 'Light', 'Locate Animals or Plants',
        'Locate Creature', 'Locate Object', 'Longstrider', 'Mage Hand', 'Magic Circle', 'Magic Jar', 'Magic Mouth', 'Magic Weapon',
        'Major Image', 'Mass Cure Wounds', 'Mass Heal', 'Mass Healing Word', 'Mass Suggestion', 'Maze', 'Meld into Stone', 'Melf\'s Acid Arrow',
        'Mending', 'Message', 'Meteor Swarm', 'Mind Blank', 'Minor Illusion', 'Mirage Arcane', 'Mirror Image', 'Mislead', 'Modify Memory',
        'Moonbeam', 'Mordenkainen\'s Faithful Hound', 'Mordenkainen\'s Magnificent Mansion', 'Mordenkainen\'s Private Sanctum',
        'Mordenkainen\'s Sword', 'Move Earth', 'Nondetection', 'Nystul\'s Magic Aura', 'Otiluke\'s Freezing Sphere', 'Otiluke\'s Resilient Sphere',
        'Otto\'s Irresistible Dance', 'Pass without Trace', 'Phantasmal Force', 'Phantasmal Killer', 'Phantom Steed', 'Planar Ally',
        'Planar Binding', 'Plant Growth', 'Poison Spray', 'Power Word Heal', 'Power Word Stun', 'Prayer of Healing', 'Prestidigitation',
        'Prismatic Spray', 'Prismatic Wall', 'Produce Flame', 'Programmed Illusion', 'Project Image', 'Protection from Energy',
        'Protection from Evil and Good', 'Protection from Poison', 'Purify Food and Drink', 'Raise Dead', 'Rary\'s Telepathic Bond',
        'Ray of Enfeeblement', 'Ray of Frost', 'Ray of Sickness', 'Regenerate', 'Reincarnate', 'Remove Curse', 'Resistance', 'Resurrection',
        'Reverse Gravity', 'Revivify', 'Rope Trick', 'Sacred Flame', 'Sanctuary', 'Scorching Ray', 'Scrying', 'Searing Smite', 'See Invisibility',
        'Seeming', 'Sending', 'Sequester', 'Shatter', 'Shield of Faith', 'Shillelagh', 'Shocking Grasp', 'Silence', 'Silent Image',
        'Simulacrum', 'Sleep', 'Sleet Storm', 'Slow', 'Spare the Dying', 'Speak with Animals', 'Speak with Dead', 'Speak with Plants',
        'Spider Climb', 'Spike Growth', 'Spirit Guardians', 'Spiritual Weapon', 'Staggering Smite', 'Steed', 'Stone Shape', 'Stoneskin',
        'Storm of Vengeance', 'Suggestion', 'Sunbeam', 'Sunburst', 'Symbol', 'Tasha\'s Hideous Laughter', 'Telekinesis', 'Telepathy',
        'Teleportation Circle', 'Thaumaturgy', 'Thorn Whip', 'Thunderous Smite', 'Thunderwave', 'Toll the Dead', 'Tongues', 'Transport via Plants',
        'Tree Stride', 'True Polymorph', 'True Resurrection', 'True Seeing', 'True Strike', 'Tsunami', 'Unseen Servant', 'Vampiric Touch',
        'Vicious Mockery', 'Wall of Fire', 'Wall of Ice', 'Wall of Stone', 'Wall of Thorns', 'Warding Bond', 'Water Walk', 'Web', 'Weird',
        'Wind Walk', 'Wind Wall', 'Wish', 'Witch Bolt', 'Wrathful Smite'
    ].forEach(sp => {
        if (!knownSpellsRegistry.has(sp.toLowerCase())) {
            knownSpellsRegistry.set(sp.toLowerCase(), sp);
        }
    });

    let spellTooltipEl = null;
    let activeTooltipSpellKey = null;

    function getOrCreateSpellTooltip() {
        if (spellTooltipEl && document.body.contains(spellTooltipEl)) return spellTooltipEl;
        spellTooltipEl = document.createElement('div');
        spellTooltipEl.id = 'statblock-spell-tooltip';
        spellTooltipEl.style.cssText = 'display:none; position:fixed; z-index:999999; width:310px; max-width:90vw; background:linear-gradient(180deg, #1b222c 0%, #12171e 100%); border:1.5px solid #4fc3f7; border-radius:8px; padding:10px 12px; color:#e0e0e0; font-family:sans-serif; font-size:11.5px; line-height:1.4; box-shadow:0 8px 24px rgba(0,0,0,0.85); pointer-events:none;';
        document.body.appendChild(spellTooltipEl);
        return spellTooltipEl;
    }

    function positionSpellTooltip(e) {
        if (!spellTooltipEl || spellTooltipEl.style.display === 'none') return;
        const pad = 14;
        const rect = spellTooltipEl.getBoundingClientRect();
        let x = e.clientX + pad;
        let y = e.clientY + pad;
        if (x + rect.width > window.innerWidth - 8) {
            x = Math.max(8, e.clientX - rect.width - pad);
        }
        if (y + rect.height > window.innerHeight - 8) {
            y = Math.max(8, e.clientY - rect.height - pad);
        }
        spellTooltipEl.style.left = `${x}px`;
        spellTooltipEl.style.top = `${y}px`;
    }

    function renderSpellCardHtml(sp, inItalian) {
        const title = (inItalian && sp.nameIt) ? sp.nameIt : sp.name;
        const school = (inItalian && sp.schoolIt) ? sp.schoolIt : (sp.school || 'Magic');
        const lvlNum = sp.level !== undefined ? Number(sp.level) : 1;
        let lvlSchoolStr = '';
        if (inItalian) {
            lvlSchoolStr = lvlNum === 0 ? `Trucchetto di ${school}` : `${school} di ${lvlNum}° livello`;
        } else {
            const ord = lvlNum === 1 ? '1st-level' : (lvlNum === 2 ? '2nd-level' : (lvlNum === 3 ? '3rd-level' : `${lvlNum}th-level`));
            lvlSchoolStr = lvlNum === 0 ? `${school} cantrip` : `${ord} ${school.toLowerCase()}`;
        }
        const time = (inItalian && sp.timeIt) ? sp.timeIt : (sp.time || '1 Action');
        const range = (inItalian && sp.rangeIt) ? sp.rangeIt : (sp.range || '60 feet');
        const comp = sp.components || 'V, S';
        const dur = (inItalian && sp.durationIt) ? sp.durationIt : (sp.duration || 'Instantaneous');
        const desc = (inItalian && sp.descIt) ? sp.descIt : (sp.desc || '');

        const lblTime = inItalian ? 'Tempo di Lancio' : 'Casting Time';
        const lblRange = inItalian ? 'Gittata' : 'Range';
        const lblComp = inItalian ? 'Componenti' : 'Components';
        const lblDur = inItalian ? 'Durata' : 'Duration';

        return `
            <div style="border-bottom:1px solid #29435c; padding-bottom:5px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:baseline; gap:6px;">
                <strong style="color:#4fc3f7; font-size:13.5px; font-family:serif;">✨ ${escapeHTML(title)}</strong>
                <span style="font-style:italic; color:#90caf9; font-size:10.5px;">${escapeHTML(lvlSchoolStr)}</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:3px 8px; font-size:10.5px; color:#b0bec5; margin-bottom:6px; background:rgba(0,0,0,0.28); padding:5px 7px; border-radius:4px;">
                <div><strong style="color:#81d4fa;">${lblTime}:</strong> ${escapeHTML(time)}</div>
                <div><strong style="color:#81d4fa;">${lblRange}:</strong> ${escapeHTML(range)}</div>
                <div><strong style="color:#81d4fa;">${lblComp}:</strong> ${escapeHTML(comp)}</div>
                <div><strong style="color:#81d4fa;">${lblDur}:</strong> ${escapeHTML(dur)}</div>
            </div>
            <div style="color:#e0e0e0; font-size:11px; max-height:190px; overflow:hidden; text-overflow:ellipsis;">${escapeHTML(desc)}</div>
        `;
    }

    async function showSpellTooltip(spellKey, e) {
        if (!spellKey) return;
        const cleanKey = spellKey.trim().toLowerCase();
        activeTooltipSpellKey = cleanKey;
        const tip = getOrCreateSpellTooltip();

        const canonical = (knownSpellsRegistry.get(cleanKey) || spellKey).toLowerCase();
        let cached = spellTooltipCache.get(canonical) || spellTooltipCache.get(cleanKey);

        if (cached) {
            if (isItalianMode && !cached.descIt && cached.desc) {
                cached.descIt = postProcessDndItalian(await translateGoogle(preProcessEnglish(cached.desc)));
                cached.nameIt = cached.nameIt || await translateGoogle(cached.name);
            }
            if (activeTooltipSpellKey !== cleanKey) return;
            tip.innerHTML = renderSpellCardHtml(cached, isItalianMode);
            tip.style.display = 'block';
            positionSpellTooltip(e);
            return;
        }

        // Mostra stato caricamento leggero e interroga Open5e on-demand
        tip.innerHTML = `<div style="color:#81d4fa; font-weight:bold;">✨ ${escapeHTML(spellKey)}</div><div style="color:#999; font-size:10.5px;">${isItalianMode ? 'Caricamento incantesimo...' : 'Loading spell...'}</div>`;
        tip.style.display = 'block';
        positionSpellTooltip(e);

        try {
            const slug = canonical.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const res = await fetch(`https://api.open5e.com/v1/spells/${encodeURIComponent(slug)}/`);
            let data = null;
            if (res.ok) {
                data = await res.json();
            } else {
                const resSearch = await fetch(`https://api.open5e.com/v1/spells/?search=${encodeURIComponent(canonical)}`);
                if (resSearch.ok) {
                    const sJson = await resSearch.json();
                    if (sJson.results && sJson.results.length > 0) {
                        data = sJson.results.find(r => r.name.toLowerCase() === canonical) || sJson.results[0];
                    }
                }
            }
            if (data && data.name) {
                const entry = {
                    name: data.name,
                    level: data.level_int !== undefined ? data.level_int : 1,
                    school: data.school || 'Magic',
                    time: data.casting_time || '1 Action',
                    range: data.range || '60 feet',
                    components: data.components || 'V, S',
                    duration: (data.concentration === 'yes' ? 'Concentration, ' : '') + (data.duration || 'Instantaneous'),
                    desc: (data.desc || '').slice(0, 520) + ((data.desc || '').length > 520 ? '...' : '')
                };
                if (isItalianMode) {
                    entry.descIt = postProcessDndItalian(await translateGoogle(preProcessEnglish(entry.desc)));
                    entry.nameIt = await translateGoogle(entry.name);
                }
                spellTooltipCache.set(canonical, entry);
                spellTooltipCache.set(cleanKey, entry);
                if (activeTooltipSpellKey === cleanKey) {
                    tip.innerHTML = renderSpellCardHtml(entry, isItalianMode);
                    positionSpellTooltip(e);
                }
            } else if (activeTooltipSpellKey === cleanKey) {
                tip.innerHTML = `<div style="color:#4fc3f7; font-weight:bold;">✨ ${escapeHTML(spellKey)}</div><div style="color:#bbb; font-size:10.5px;">${isItalianMode ? 'Incantesimo D&D 5e' : 'D&D 5e Spell'}</div>`;
            }
        } catch (_) {
            if (activeTooltipSpellKey === cleanKey) {
                tip.innerHTML = `<div style="color:#4fc3f7; font-weight:bold;">✨ ${escapeHTML(spellKey)}</div><div style="color:#bbb; font-size:10.5px;">${isItalianMode ? 'Incantesimo D&D 5e' : 'D&D 5e Spell'}</div>`;
            }
        }
    }

    function hideSpellTooltip() {
        activeTooltipSpellKey = null;
        if (spellTooltipEl) spellTooltipEl.style.display = 'none';
    }

    const compendium = {
        init() {
            this.bindEvents();
            if (typeof window.makeDraggable === 'function') {
                const win = document.getElementById('dm-statblock-window');
                const header = document.getElementById('dm-statblock-header');
                if (win && header) window.makeDraggable(win, header);
            }
        },

        tryParseJson(text) {
            if (!text || typeof text !== 'string') return null;
            let s = text.trim();
            s = s.replace(/^[\uFEFF\xA0\u200B-\u200D]+/, '').trim();
            if (s.startsWith('```')) {
                s = s.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1').trim();
            }
            try {
                return JSON.parse(s);
            } catch (_) {}

            // Normalizzazione riga per riga e gestione traduzioni automatiche di Google Chrome (es. da 5e.tools in italiano)
            s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            s = s.replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
                 .replace(/[\u2018\u2019\u201A\u201B]/g, "'");

            // Booleani italiani tradotti automaticamente
            s = s.replace(/:\s*vero\b/gi, ': true')
                 .replace(/:\s*falso\b/gi, ': false')
                 .replace(/\bvero\b/gi, 'true')
                 .replace(/\bfalso\b/gi, 'false');

            const lines = s.split('\n');
            const fixedLines = [];
            const stack = [];

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                const trimmed = line.trim();
                if (!trimmed) {
                    fixedLines.push(line);
                    continue;
                }

                const currentContext = stack.length > 0 ? stack[stack.length - 1] : null;

                // Caso 1: Chiave isolata senza due punti (es. "resistere" o "lingue" o "trait" a cui Google Translate ha mangiato i due punti/parentesi)
                const isIsolatedKey = /^"[^"]+"\s*,?$/.test(trimmed);
                if (isIsolatedKey && (currentContext === '{' || !currentContext)) {
                    let nextTrimmed = '';
                    for (let j = i + 1; j < lines.length; j++) {
                        if (lines[j].trim()) {
                            nextTrimmed = lines[j].trim();
                            break;
                        }
                    }
                    if (nextTrimmed.startsWith('"') || nextTrimmed.startsWith('{')) {
                        line = line.replace(/^(\s*"[^"]+")\s*,?$/, '$1: [');
                    }
                }

                // Caso 2: Chiave con valore mancante di due punti (es. "camminata" 30,)
                const mMissingColon = /^(\s*"[^"]+")\s+([0-9.\-]+|true|false|null|"[^"]*")(\s*,?)$/.exec(line);
                if (mMissingColon) {
                    line = `${mMissingColon[1]}: ${mMissingColon[2]}${mMissingColon[3]}`;
                }

                // Caso 3: Chiave con virgola al posto dei due punti (es. "tipo", "interno",)
                if (currentContext === '{' || !currentContext) {
                    const mCommaColon = /^(\s*"[^"]+")\s*,\s*("[^"]*"|[0-9.\-]+|true|false|null)(\s*,?)$/.exec(line);
                    if (mCommaColon) {
                        line = `${mCommaColon[1]}: ${mCommaColon[2]}${mCommaColon[3]}`;
                    }
                }

                // Aggiorna lo stack delle parentesi tenendo conto delle stringhe
                let inStr = false;
                for (let c = 0; c < line.length; c++) {
                    const ch = line[c];
                    if (ch === '"' && (c === 0 || line[c - 1] !== '\\')) {
                        inStr = !inStr;
                    } else if (!inStr) {
                        if (ch === '{' || ch === '[') {
                            stack.push(ch);
                        } else if (ch === '}' && stack.length && stack[stack.length - 1] === '{') {
                            stack.pop();
                        } else if (ch === ']' && stack.length && stack[stack.length - 1] === '[') {
                            stack.pop();
                        }
                    }
                }

                fixedLines.push(line);
            }

            s = fixedLines.join('\n');

            // Rimuovi commenti JS
            s = s.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');
            // Rimuovi virgole prima di chiusure } o ]
            s = s.replace(/,\s*([\]\}])/g, '$1');

            try {
                return JSON.parse(s);
            } catch (_) {}

            return null;
        },

        clean5eToolsText(val) {
            if (!val) return '';
            if (Array.isArray(val)) return val.map(v => this.clean5eToolsText(v)).filter(Boolean).join(' ');
            if (typeof val === 'object' && val !== null) {
                if (val.entries) return this.clean5eToolsText(val.entries);
                if (val.items) return this.clean5eToolsText(val.items);
                if (val.entry) return (val.name ? `<b>${val.name}.</b> ` : '') + this.clean5eToolsText(val.entry);
                if (val.rows) return val.rows.map(r => this.clean5eToolsText(r)).join('; ');
                if (val.vulnerable) return this.clean5eToolsText(val.vulnerable) + (val.note ? ` (${val.note})` : '');
                if (val.resist) return this.clean5eToolsText(val.resist) + (val.note ? ` (${val.note})` : '');
                if (val.immune) return this.clean5eToolsText(val.immune) + (val.note ? ` (${val.note})` : '');
                if (val.conditionImmune) return this.clean5eToolsText(val.conditionImmune) + (val.note ? ` (${val.note})` : '');
                if (val.special) return String(val.special);
                return '';
            }
            if (typeof val !== 'string') return String(val);

            let text = val;

            // 1. Tag attacco flessibile 2014 ({@atk ...}) e 2024 ({@atkr ...})
            text = text.replace(/\{@(atk|atkr)\s+([a-zA-Z,\s]+)\}/gi, (match, tagType, types) => {
                const isRoll = tagType.toLowerCase() === 'atkr';
                const t = types.toLowerCase().replace(/\s+/g, '');
                if (t.includes('mw') && t.includes('rw')) return isRoll ? 'Melee or Ranged Weapon Attack Roll: ' : 'Melee or Ranged Weapon Attack: ';
                if (t.includes('ms') && t.includes('rs')) return isRoll ? 'Melee or Ranged Spell Attack Roll: ' : 'Melee or Ranged Spell Attack: ';
                if (t.includes('m') && t.includes('r')) return isRoll ? 'Melee or Ranged Attack Roll: ' : 'Melee or Ranged Weapon Attack: ';
                if (t.includes('mw')) return isRoll ? 'Melee Weapon Attack Roll: ' : 'Melee Weapon Attack: ';
                if (t.includes('rw')) return isRoll ? 'Ranged Weapon Attack Roll: ' : 'Ranged Weapon Attack: ';
                if (t.includes('ms')) return isRoll ? 'Melee Spell Attack Roll: ' : 'Melee Spell Attack: ';
                if (t.includes('rs')) return isRoll ? 'Ranged Spell Attack Roll: ' : 'Ranged Spell Attack: ';
                if (t.includes('m')) return 'Melee Attack Roll: ';
                if (t.includes('r')) return 'Ranged Attack Roll: ';
                return isRoll ? 'Attack Roll: ' : 'Attack: ';
            });

            // 2. Tag Esito colpo e Tiri Salvezza D&D 2024 ({@actSave}, {@actSaveFail}, {@actSaveSuccess}, ecc.)
            text = text.replace(/\{@h\}/gi, 'Hit: ');
            text = text.replace(/\{@hom\}/gi, 'Hit or Miss: ');
            text = text.replace(/\{@m\}/gi, 'Miss: ');

            const saveAbilityNames = {
                'str': 'Strength', 'strength': 'Strength',
                'dex': 'Dexterity', 'dexterity': 'Dexterity',
                'con': 'Constitution', 'constitution': 'Constitution',
                'int': 'Intelligence', 'intelligence': 'Intelligence',
                'wis': 'Wisdom', 'wisdom': 'Wisdom',
                'cha': 'Charisma', 'charisma': 'Charisma'
            };
            text = text.replace(/\{@actSave\s+([a-zA-Z]+)\}/gi, (m, ab) => {
                const full = saveAbilityNames[ab.toLowerCase()] || (ab.charAt(0).toUpperCase() + ab.slice(1));
                return `${full} Saving Throw:`;
            });
            text = text.replace(/\{@actSaveFail\s*(\d*)\}/gi, (m, ord) => {
                if (ord === '2') return 'Second Failure:';
                if (ord === '3') return 'Third Failure:';
                return 'Failure:';
            });
            text = text.replace(/\{@actSaveSuccess\}/gi, 'Success:');
            text = text.replace(/\{@actSaveSuccessOrFail\}/gi, 'Failure or Success:');
            text = text.replace(/\{@actTrigger\}/gi, 'Trigger:');
            text = text.replace(/\{@actResponse(?:\s+[^}]*)?\}/gi, 'Response:');

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

            // 5. Formattazione testo e registrazione automatica incantesimi {@spell ...}
            text = text.replace(/\{@b\s+([^}]+)\}/gi, '<strong>$1</strong>');
            text = text.replace(/\{@i\s+([^}]+)\}/gi, '<em>$1</em>');
            text = text.replace(/\{@u\s+([^}]+)\}/gi, '<u>$1</u>');
            text = text.replace(/\{@s\s+([^}]+)\}/gi, '<s>$1</s>');
            text = text.replace(/\{@note\s+([^}]+)\}/gi, '($1)');
            text = text.replace(/\{@spell\s+([^}]+)\}/gi, (match, content) => {
                const parts = content.split('|');
                const origName = parts[0].trim();
                const dispName = (parts.length >= 3 && parts[2].trim()) ? parts[2].trim() : origName;
                if (origName) {
                    knownSpellsRegistry.set(origName.toLowerCase(), origName);
                    knownSpellsRegistry.set(dispName.toLowerCase(), origName);
                }
                return dispName;
            });

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

            // 8. Vulnerabilità, Resistenze e Immunità ai danni
            if (m.damage_vulnerabilities) {
                let vul = m.damage_vulnerabilities;
                for (const [en, itDam] of Object.entries(DND_IT_GLOSSARY.damageTypesList)) {
                    vul = vul.replace(new RegExp(`\\b${en}\\b`, 'gi'), itDam);
                }
                it.damage_vulnerabilities = vul;
            }
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

            // Effetti Regionali e Azioni di Tana
            const regEffects = m.regional_effects || [];
            regEffects.forEach((re, idx) => {
                batchRequests.push(this.clean5eToolsText(re.name));
                mapping.push({ type: 'regional_name', index: idx });
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(re.desc)));
                mapping.push({ type: 'regional_desc_item', index: idx });
            });
            if (m.regional_desc) {
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(m.regional_desc)));
                mapping.push({ type: 'regional_desc' });
            }
            if (m.regional_footer) {
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(m.regional_footer)));
                mapping.push({ type: 'regional_footer' });
            }

            const lairActions = m.lair_actions || [];
            lairActions.forEach((la, idx) => {
                batchRequests.push(this.clean5eToolsText(la.name));
                mapping.push({ type: 'lair_name', index: idx });
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(la.desc)));
                mapping.push({ type: 'lair_desc_item', index: idx });
            });
            if (m.lair_desc) {
                batchRequests.push(preProcessEnglish(this.clean5eToolsText(m.lair_desc)));
                mapping.push({ type: 'lair_desc' });
            }

            // Esecuzione traduzione in blocco
            const translatedTexts = await translateBatch(batchRequests);

            // Inizializza array clonati
            it.actions = actions.map(a => ({ name: this.clean5eToolsText(a.name), desc: this.clean5eToolsText(a.desc) }));
            it.special_abilities = traits.map(t => ({ name: this.clean5eToolsText(t.name), desc: this.clean5eToolsText(t.desc) }));
            it.reactions = reactions.map(r => ({ name: this.clean5eToolsText(r.name), desc: this.clean5eToolsText(r.desc) }));
            it.legendary_actions = legActions.map(la => ({ name: this.clean5eToolsText(la.name), desc: this.clean5eToolsText(la.desc) }));
            it.regional_effects = regEffects.map(re => ({ name: this.clean5eToolsText(re.name), desc: this.clean5eToolsText(re.desc) }));
            it.lair_actions = lairActions.map(la => ({ name: this.clean5eToolsText(la.name), desc: this.clean5eToolsText(la.desc) }));

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
                } else if (mItem.type === 'regional_name') {
                    it.regional_effects[mItem.index].name = res;
                } else if (mItem.type === 'regional_desc_item') {
                    it.regional_effects[mItem.index].desc = res;
                } else if (mItem.type === 'regional_desc') {
                    it.regional_desc = res;
                } else if (mItem.type === 'regional_footer') {
                    it.regional_footer = res;
                } else if (mItem.type === 'lair_name') {
                    it.lair_actions[mItem.index].name = res;
                } else if (mItem.type === 'lair_desc_item') {
                    it.lair_actions[mItem.index].desc = res;
                } else if (mItem.type === 'lair_desc') {
                    it.lair_desc = res;
                }
            });

            return it;
        },

        formatActionWithRolls(rawText, actionName) {
            const cleaned = this.clean5eToolsText(rawText);
            if (!cleaned) return '';

            let text = cleaned;

            // 0. Evidenzia incantesimi noti con link hover interattivo
            const spellKeys = Array.from(knownSpellsRegistry.keys()).filter(k => k.length >= 3).sort((a, b) => b.length - a.length);
            if (spellKeys.length > 0) {
                const escapedKeys = spellKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                const spellRegex = new RegExp(`\\b(${escapedKeys.join('|')})\\b`, 'gi');
                text = text.replace(spellRegex, (match) => {
                    const canon = knownSpellsRegistry.get(match.toLowerCase()) || match;
                    return `<span class="statblock-spell-link" data-spell="${escapeHTML(canon)}" style="color: #64b5f6; text-decoration: underline dotted #64b5f6; cursor: help; font-weight: 600;">${match}</span>`;
                });
            }

            // 0b. Formattazione etichette Tiri Salvezza / Esiti D&D 2024 in corsivo
            text = text.replace(/\b((?:Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+Saving\s+Throw:|Tiro\s+Salvezza\s+su\s+(?:Forza|Destrezza|Costituzione|Intelligenza|Saggezza|Carisma):)/gi, '<em style="color:#e0e0e0;">$1</em>');
            text = text.replace(/\b(Failure\s+or\s+Success:|Fallimento\s+o\s+Successo:|Second\s+Failure:|Secondo\s+Fallimento:|Third\s+Failure:|Failure:|Fallimento:|Success:|Successo:|Melee\s+or\s+Ranged\s+Weapon\s+Attack(?:\s+Roll)?:|Melee\s+Weapon\s+Attack(?:\s+Roll)?:|Ranged\s+Weapon\s+Attack(?:\s+Roll)?:|Melee\s+Attack\s+Roll:|Ranged\s+Attack\s+Roll:|Melee\s+Spell\s+Attack(?:\s+Roll)?:|Ranged\s+Spell\s+Attack(?:\s+Roll)?:|Hit\s+or\s+Miss:|Hit:|Miss:)/gi, '<em style="color:#e0e0e0;">$1</em>');

            // 1. Tiri per colpire classici (2014): es. "+4 to hit" o "-1 to hit" o "+4 per colpire"
            text = text.replace(/([+-]?\d+)\s*(?:to\s+hit|per\s+colpire)/gi, (match, bonus) => {
                const cleanBonus = bonus.startsWith('+') ? bonus : (bonus.startsWith('-') ? bonus : `+${bonus}`);
                const hitSuffix = isItalianMode ? 'per colpire' : 'to hit';
                return `<span class="statblock-roll-btn" data-formula="${cleanBonus}" data-label="${actionName} (Attacco)" style="background: rgba(239, 83, 80, 0.22); color: #ffb74d; border: 1px solid #ef5350; border-radius: 4px; padding: 1px 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare l'attacco (${cleanBonus})">🎲 ${cleanBonus} ${hitSuffix}</span>`;
            });

            // 1b. Tiri per colpire formato 2024: es. "Attack Roll: +8," o "Tiro per Colpire: +8,"
            text = text.replace(/((?:Attack\s+Roll|Tiro\s+per\s+Colpire)\s*:<\/em>\s*|(?:Attack\s+Roll|Tiro\s+per\s+Colpire)\s*:\s*)([+-]\d+)/gi, (match, prefix, bonus) => {
                return `${prefix}<span class="statblock-roll-btn" data-formula="${bonus}" data-label="${actionName} (Attacco)" style="background: rgba(239, 83, 80, 0.22); color: #ffb74d; border: 1px solid #ef5350; border-radius: 4px; padding: 1px 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare l'attacco (${bonus})">🎲 ${bonus}</span>`;
            });

            // 2. Formule dadi danno/effetti: es. "1d4", "2d6 + 2", "1d8+3", "3d10 - 1"
            text = text.replace(/\b(\d+d\d+(?:\s*[\+\-]\s*\d+)?)\b/gi, (match, formula) => {
                return `<span class="statblock-roll-btn" data-formula="${formula}" data-label="${actionName} (Danno)" style="background: rgba(255, 183, 77, 0.22); color: #ffe082; border: 1px solid #ffb74d; border-radius: 4px; padding: 1px 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare il dado (${formula})">🎲 ${formula}</span>`;
            });

            // 3. Formattazione righe di lancio incantesimi (At will:, 1/day each:, Cantrips, ecc.)
            const lines = text.split('\n');
            return lines.map((line, idx) => {
                if (idx === 0) return line;
                const spellRowMatch = line.match(/^((?:At\s+will|A\s+volontà|Constant|Costante|\d+\/(?:day|giorno)(?:\s+(?:each|ciascuno))?|Cantrips\s*\([^)]+\)|Trucchetti\s*\([^)]+\)|\d+(?:st|nd|rd|th|°)\s+(?:level|livello)(?:\s*\([^)]+\))?)\s*:)\s*(.*)$/i);
                if (spellRowMatch) {
                    return `<div style="margin-top: 3px; padding-left: 6px;"><strong style="color: #e0e0e0;">${spellRowMatch[1]}</strong> ${spellRowMatch[2]}</div>`;
                }
                return `<div style="margin-top: 3px;">${line}</div>`;
            }).join('');
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

            const net = (typeof window.network !== 'undefined' && window.network) ? window.network : ((typeof network !== 'undefined') ? network : null);
            const mySender = (net && net.playerName) ? net.playerName : 'DM';

            const payload = {
                id: rollId,
                sender: mySender,
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
                let raw = textarea ? textarea.value.trim() : '';
                if (!raw) return alert("Incolla prima il JSON o il testo della scheda!");

                // Pulizia BOM, caratteri invisibili e fence markdown ```json ... ```
                raw = raw.replace(/^[\uFEFF\xA0\u200B-\u200D]+/, '').trim();
                if (raw.startsWith('```')) {
                    raw = raw.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1').trim();
                }

                try {
                    let normalized = null;
                    const looksLikeJson = raw.startsWith('{') || raw.startsWith('[') || ((raw.includes('"name"') || raw.includes('"nome"')) && raw.includes('{'));
                    if (looksLikeJson) {
                        const parsed = this.tryParseJson(raw);
                        if (parsed) {
                            normalized = this.normalize5eToolsMonster(parsed);
                        }
                    }

                    if (!normalized && !raw.startsWith('{') && !raw.startsWith('[')) {
                        normalized = this.parsePlainTextStatblock(raw);
                    }

                    if (normalized && normalized.name && normalized.name !== '{' && normalized.name !== '[') {
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
                        } else if (window._importingForEvocation && typeof window.onEvocationStatblockImported === 'function') {
                            window.onEvocationStatblockImported(normalized);
                            window._importingForEvocation = false;
                        } else if (typeof showToast === 'function') {
                            showToast(`Scheda "${normalized.name}" importata con successo!`);
                        } else if (typeof showPlayerToast === 'function') {
                            showPlayerToast(`Scheda "${normalized.name}" importata con successo!`);
                        }
                    } else {
                        alert("Formato scheda o JSON non riconosciuto o incompleto. Verifica il testo o il JSON incollato.");
                    }
                } catch (err) {
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

            // Calcolo Iniziativa (modificatore di Destrezza secondo le regole D&D 5e)
            const dexVal = m.dexterity || 10;
            const dexModNum = Math.floor((dexVal - 10) / 2);
            let initMod = dexModNum >= 0 ? `+${dexModNum}` : `${dexModNum}`;
            let initPassive = 10 + dexModNum;
            if (m.initiative) {
                const mInit = String(m.initiative).match(/([+-]?\d+)(?:\s*\(([+-]?\d+)\))?/);
                if (mInit) {
                    initMod = mInit[1].startsWith('+') || mInit[1].startsWith('-') ? mInit[1] : `+${mInit[1]}`;
                    if (mInit[2]) initPassive = mInit[2];
                }
            }
            const lblInit = isItalianMode ? 'Iniziativa' : 'Initiative';
            if (typeof m.speed === 'string') speedStr = m.speed;
            else if (typeof m.speed === 'object' && m.speed !== null) {
                speedStr = Object.entries(m.speed).map(([k, v]) => `${k} ${v} ft.`).join(', ');
            }

            // Stats row interattiva per tiri su caratteristiche (con MOD e SAVE in stile MM'25)
            const statKeys = isItalianMode 
                ? [ { k: 'FOR', val: m.strength || 10, save: m.strength_save },
                    { k: 'DES', val: m.dexterity || 10, save: m.dexterity_save },
                    { k: 'COS', val: m.constitution || 10, save: m.constitution_save },
                    { k: 'INT', val: m.intelligence || 10, save: m.intelligence_save },
                    { k: 'SAG', val: m.wisdom || 10, save: m.wisdom_save },
                    { k: 'CAR', val: m.charisma || 10, save: m.charisma_save } ]
                : [ { k: 'STR', val: m.strength || 10, save: m.strength_save },
                    { k: 'DEX', val: m.dexterity || 10, save: m.dexterity_save },
                    { k: 'CON', val: m.constitution || 10, save: m.constitution_save },
                    { k: 'INT', val: m.intelligence || 10, save: m.intelligence_save },
                    { k: 'WIS', val: m.wisdom || 10, save: m.wisdom_save },
                    { k: 'CHA', val: m.charisma || 10, save: m.charisma_save } ];

            let statsHtml = '<div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; text-align: center; background: #251818; padding: 6px 2px; border-radius: 4px; border: 1px solid #4a2222; margin: 8px 0;">';
            statKeys.forEach(s => {
                const mod = this.formatMod(s.val);
                const baseModNum = Math.floor((s.val - 10) / 2);
                const saveNum = (s.save !== null && s.save !== undefined && !isNaN(parseInt(s.save))) ? parseInt(s.save) : baseModNum;
                const saveStr = saveNum >= 0 ? `+${saveNum}` : `${saveNum}`;
                const hasSaveProf = saveNum !== baseModNum;
                const rollLabel = isItalianMode ? `Prova ${s.k}` : `Check ${s.k}`;
                const saveLabel = `TS ${s.k}`;
                statsHtml += `
                    <div style="padding: 4px 2px; border-radius: 4px; background: rgba(0,0,0,0.3); border: 1px solid rgba(239, 83, 80, 0.2);">
                        <div style="font-weight: bold; color: #ef5350; font-size: 11px;">${s.k} <span style="color:#fff; font-weight:normal;">${s.val}</span></div>
                        <div style="display:flex; justify-content:center; gap:4px; margin-top:2px; font-size:10.5px;">
                            <span class="statblock-roll-btn" data-formula="${mod}" data-label="${rollLabel}" style="cursor:pointer; color:#90caf9; font-weight:bold; padding:1px 3px; border-radius:3px; background:rgba(100,181,246,0.12);" title="Clicca per tirare ${rollLabel} (${mod})">MOD ${mod}</span>
                            <span class="statblock-roll-btn" data-formula="${saveStr}" data-label="${saveLabel}" style="cursor:pointer; color:${hasSaveProf ? '#ffb74d' : '#b0bec5'}; font-weight:bold; padding:1px 3px; border-radius:3px; background:${hasSaveProf ? 'rgba(255,183,77,0.18)' : 'rgba(255,255,255,0.06)'};" title="Clicca per tirare Tiro Salvezza ${s.k} (${saveStr})">SAVE ${saveStr}</span>
                        </div>
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
            const hasExplicitSaves = m.strength_save !== null || m.dexterity_save !== null || m.constitution_save !== null || m.intelligence_save !== null || m.wisdom_save !== null || m.charisma_save !== null;

            if (hasExplicitSaves) {
                addSave('Str', m.strength_save);
                addSave('Dex', m.dexterity_save);
                addSave('Con', m.constitution_save);
                addSave('Int', m.intelligence_save);
                addSave('Wis', m.wisdom_save);
                addSave('Cha', m.charisma_save);
            } else {
                // In D&D 5e, i mostri senza competenze specifiche usano il normale modificatore di caratteristica
                addSave('Str', Math.floor(((m.strength || 10) - 10) / 2));
                addSave('Dex', Math.floor(((m.dexterity || 10) - 10) / 2));
                addSave('Con', Math.floor(((m.constitution || 10) - 10) / 2));
                addSave('Int', Math.floor(((m.intelligence || 10) - 10) / 2));
                addSave('Wis', Math.floor(((m.wisdom || 10) - 10) / 2));
                addSave('Cha', Math.floor(((m.charisma || 10) - 10) / 2));
            }

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
            const lblVuln = isItalianMode ? 'Vulnerabilità ai Danni' : 'Damage Vulnerabilities';
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
            const lblLair = isItalianMode ? 'Azioni della Tana' : 'Lair Actions';
            const lblReg = isItalianMode ? 'Effetti Regionali' : 'Regional Effects';

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

            // Lair Actions (Azioni della Tana)
            let lairHtml = '';
            const lair = m.lair_actions || [];
            if (lair.length > 0) {
                lairHtml += `<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">${lblLair}</div>`;
                if (m.lair_desc) lairHtml += `<div style="font-style: italic; color: #aaa; margin-bottom: 6px;">${this.clean5eToolsText(m.lair_desc)}</div>`;
                lair.forEach(a => {
                    const cleanName = this.clean5eToolsText(a.name);
                    const formattedDesc = this.formatActionWithRolls(a.desc, cleanName);
                    lairHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${cleanName.replace(/\.+$/, '')}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
            }

            // Regional Effects (Effetti Regionali)
            let regHtml = '';
            const reg = m.regional_effects || [];
            if (reg.length > 0) {
                regHtml += `<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">${lblReg}</div>`;
                if (m.regional_desc) regHtml += `<div style="color: #bbb; margin-bottom: 6px;">${this.clean5eToolsText(m.regional_desc)}</div>`;
                reg.forEach(a => {
                    const cleanName = this.clean5eToolsText(a.name);
                    const formattedDesc = this.formatActionWithRolls(a.desc, cleanName);
                    regHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45; padding-left: 6px;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${cleanName.replace(/\.+$/, '')}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
                if (m.regional_footer) regHtml += `<div style="color: #bbb; margin-top: 4px;">${this.clean5eToolsText(m.regional_footer)}</div>`;
            }

            const rawAvatar = m.tokenSrc || this.generateLetterToken(m);
            const tokenAvatarSrc = sanitizeImageSrc(rawAvatar) || this.generateLetterToken(m);
            const sourceBadgeHtml = m.source_badge ? `<span style="font-size: 11px; color: #4fc3f7; font-family: sans-serif; font-weight: bold; margin-left: 8px;">${escapeHTML(m.source_badge)}</span>` : '';

            details.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #b71c1c; padding-bottom: 6px; margin-bottom: 8px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap;">
                            <div style="font-size: 18px; font-weight: bold; color: #ef5350; font-family: serif; letter-spacing: 0.5px;">${escapeHTML(m.name)}</div>
                            ${sourceBadgeHtml}
                        </div>
                        <div style="font-style: italic; color: #9e9e9e; font-size: 11px;">${escapeHTML(sizeType)}</div>
                    </div>
                    <div id="statblock-avatar-wrapper" style="position: relative; cursor: pointer; margin-left: 10px; flex-shrink: 0;" title="Clicca per cambiare immagine o premi Ctrl+V con un token copiato negli appunti">
                        <img id="statblock-avatar-img" src="${escapeHTML(tokenAvatarSrc)}" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid #ef5350; object-fit: cover; background: #111; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">
                        <span style="position: absolute; bottom: -2px; right: -2px; background: #b71c1c; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white;" title="Cambia Token">📷</span>
                        <input type="file" id="statblock-avatar-file-input" accept="image/*" style="display: none;">
                    </div>
                </div>

                <div style="color: #ef9a9a; line-height: 1.4; font-size: 11.5px;">
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <div><strong style="color: #ef5350;">${lblAc}:</strong> <span style="color: #fff; font-weight:bold;">${m.armor_class || 10}</span>${acDesc}</div>
                        <div><strong style="color: #ef5350;">${lblInit}:</strong> <span class="statblock-roll-btn" data-formula="${initMod}" data-label="${lblInit}" style="background: rgba(239, 83, 80, 0.2); color: #ffb74d; border: 1px solid #ef5350; border-radius: 4px; padding: 1px 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare l'Iniziativa (${initMod})">🎲 ${initMod} <span style="font-size: 10px; color: #aaa;">(${initPassive})</span></span></div>
                    </div>
                    <div><strong style="color: #ef5350;">${lblHp}:</strong> <span style="color: #fff; font-weight:bold;">${m.hit_points || 10}</span>${hpDice}</div>
                    <div><strong style="color: #ef5350;">${lblSpeed}:</strong> <span style="color: #fff;">${speedStr}</span></div>
                </div>

                ${statsHtml}

                <div style="color: #ddd; font-size: 11px; line-height: 1.4;">
                    ${saves.length > 0 ? `<div style="margin-bottom: 3px;"><strong style="color: #ef5350;">${lblSaves}:</strong> ${saves.join(' ')}</div>` : ''}
                    ${skillsStr ? `<div style="margin-bottom: 3px;"><strong style="color: #ef5350;">${lblSkills}:</strong> ${skillsStr}</div>` : ''}
                    ${m.damage_vulnerabilities ? `<div><strong style="color: #ef5350;">${lblVuln}:</strong> ${this.clean5eToolsText(m.damage_vulnerabilities)}</div>` : ''}
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
                ${lairHtml}
                ${regHtml}
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

            // Bind hover eventi sugli incantesimi per mostrare il tooltip interattivo
            details.querySelectorAll('.statblock-spell-link').forEach(link => {
                link.addEventListener('mouseenter', (e) => {
                    const spName = link.getAttribute('data-spell') || link.textContent;
                    showSpellTooltip(spName, e);
                });
                link.addEventListener('mousemove', (e) => {
                    positionSpellTooltip(e);
                });
                link.addEventListener('mouseleave', () => {
                    hideSpellTooltip();
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
            let m = null;
            if (Array.isArray(raw)) {
                m = raw.find(item => item && (item.name || item.nome)) || raw[0];
            } else if (Array.isArray(raw.monster)) {
                m = raw.monster[0];
            } else if (raw.monster && typeof raw.monster === 'object') {
                m = raw.monster;
            } else if (raw.name || raw.nome) {
                m = raw;
            } else if (Array.isArray(raw.creature)) {
                m = raw.creature[0];
            } else if (raw.creature && typeof raw.creature === 'object') {
                m = raw.creature;
            } else if (Array.isArray(raw.data)) {
                m = raw.data[0];
            } else if (raw.data && typeof raw.data === 'object' && (raw.data.name || raw.data.nome)) {
                m = raw.data;
            }

            if (!m || (!m.name && !m.nome)) return null;

            const monsterName = this.clean5eToolsText(m.name || m.nome);
            if (!monsterName) return null;

            const capFirst = (s) => s ? (s.charAt(0).toUpperCase() + s.slice(1)) : '';

            // Fonte e Pagina (es. XMM p146 -> MM'25 p146)
            const rawSource = String(m.source || m.fonte || '').trim();
            const cleanSource = SOURCE_LABELS[rawSource.toUpperCase()] || rawSource;
            const rawPage = m.page || m.pagina;
            const sourceBadge = cleanSource ? (rawPage ? `${cleanSource} p${rawPage}` : cleanSource) : '';

            // Taglia (supporta anche 'misurare' o 'taglia')
            const sizeMap = {
                'T': 'Tiny', 'S': 'Small', 'M': 'Medium', 'L': 'Large', 'H': 'Huge', 'G': 'Gargantuan',
                'P': 'Piccola', 'Piccola': 'Piccola', 'Media': 'Media', 'Grande': 'Grande', 'Enorme': 'Enorme', 'Gargantuesca': 'Gargantuesca'
            };
            const sizeRaw = m.size || m.misurare || m.taglia;
            let size = 'Medium';
            if (Array.isArray(sizeRaw) && sizeRaw.length > 0) {
                const c = String(sizeRaw[0]).toUpperCase();
                size = sizeMap[c] || sizeRaw[0];
            } else if (typeof sizeRaw === 'string') {
                const c = sizeRaw.toUpperCase();
                size = sizeMap[c] || sizeRaw;
            }

            // Tipo e sottotipo (supporta anche 'tipo' e 'sottotipo')
            const typeRaw = m.type || m.tipo;
            let typeStr = 'Creature';
            let subtypeStr = '';
            if (typeof typeRaw === 'string') {
                typeStr = capFirst(typeRaw);
            } else if (typeof typeRaw === 'object' && typeRaw !== null) {
                typeStr = capFirst(typeRaw.type || typeRaw.tipo || 'creature');
                if (Array.isArray(typeRaw.tags)) {
                    subtypeStr = typeRaw.tags.map(t => typeof t === 'object' ? capFirst(t.tag || t.prefix || '') : capFirst(String(t))).filter(Boolean).join(', ');
                }
            }
            if (!subtypeStr && (m.subtype || m.sottotipo)) {
                subtypeStr = Array.isArray(m.subtype || m.sottotipo) ? (m.subtype || m.sottotipo).map(capFirst).join(', ') : capFirst(String(m.subtype || m.sottotipo));
            }

            // Allineamento (supporta anche 'allineamento')
            const alignMap = {
                'L': 'Lawful', 'N': 'Neutral', 'C': 'Chaotic', 'G': 'Good', 'E': 'Evil', 'U': 'Unaligned', 'A': 'Any',
                'LN': 'Lawful Neutral', 'LE': 'Lawful Evil', 'LG': 'Lawful Good',
                'CN': 'Chaotic Neutral', 'CE': 'Chaotic Evil', 'CG': 'Chaotic Good',
                'NE': 'Neutral Evil', 'NG': 'Neutral Good', 'NN': 'Neutral'
            };
            const alignRaw = m.alignment || m.allineamento;
            let alignStr = 'any alignment';
            if (Array.isArray(alignRaw)) {
                alignStr = alignRaw.map(a => alignMap[a] || a).join(' ');
            } else if (typeof alignRaw === 'string') {
                alignStr = alignMap[alignRaw] || alignRaw;
            }

            // CA (supporta ac, ca, armor_class, classe_armatura, e anche 'E' tipico di Google Translate)
            const acRaw = m.ac || m.ca || m.armor_class || m.classe_armatura || m.E;
            let ac = 10;
            let acDesc = '';
            if (Array.isArray(acRaw) && acRaw.length > 0) {
                const first = acRaw[0];
                if (typeof first === 'number') {
                    ac = first;
                } else if (typeof first === 'object' && first !== null) {
                    ac = parseInt(first.ac || first.ca) || 10;
                    if (Array.isArray(first.from)) {
                        acDesc = this.clean5eToolsText(first.from);
                    }
                }
            } else if (typeof acRaw === 'number') {
                ac = acRaw;
            } else if (typeof acRaw === 'string') {
                ac = parseInt(acRaw) || 10;
            }

            // Fallback intelligente per AC: scansione valori numerici tipici di CA
            if (ac === 10) {
                for (const [k, v] of Object.entries(m)) {
                    if (Array.isArray(v) && v.length === 1 && typeof v[0] === 'number' && v[0] >= 5 && v[0] <= 30 && k !== 'cr' && k !== 'pagina' && k !== 'passivo') {
                        ac = v[0];
                        break;
                    }
                }
            }

            // Punti Ferita (supporta hp, pf, punti_ferita, media, formula)
            const hpRaw = m.hp || m.pf || m.punti_ferita;
            let hp = 10;
            let hpDice = '';
            if (typeof hpRaw === 'object' && hpRaw !== null) {
                hp = parseInt(hpRaw.average || hpRaw.media || hpRaw.hp) || 10;
                hpDice = hpRaw.formula || hpRaw.dadi_vita || '';
            } else if (typeof hpRaw === 'number') {
                hp = hpRaw;
            } else if (typeof hpRaw === 'string') {
                hp = parseInt(hpRaw) || 10;
            }

            // Velocità (supporta speed, velocità, velocita, camminata, volare, nuotare...)
            const speedRaw = m.speed || m.velocità || m.velocita;
            let speedStr = '30 ft.';
            if (typeof speedRaw === 'string') {
                speedStr = speedRaw;
            } else if (typeof speedRaw === 'object' && speedRaw !== null) {
                const parts = [];
                const speedTrans = {
                    'camminata': 'walk', 'volare': 'Fly', 'nuotare': 'Swim', 'scalare': 'Climb', 'scavare': 'Burrow',
                    'walk': 'walk', 'fly': 'Fly', 'swim': 'Swim', 'climb': 'Climb', 'burrow': 'Burrow'
                };
                for (const [k, v] of Object.entries(speedRaw)) {
                    if (k === 'canHover' || typeof v === 'boolean') continue;
                    const label = speedTrans[k.toLowerCase()] || capFirst(k);
                    const isWalk = label.toLowerCase() === 'walk';
                    if (typeof v === 'object' && v !== null && v.number !== undefined) {
                        const cond = v.condition ? ` ${this.clean5eToolsText(v.condition)}` : (speedRaw.canHover && label === 'Fly' ? ' (hover)' : '');
                        parts.push(isWalk ? `${v.number} ft.${cond}` : `${label} ${v.number} ft.${cond}`);
                    } else if (typeof v === 'number' || typeof v === 'string') {
                        const cond = (speedRaw.canHover && label === 'Fly') ? ' (hover)' : '';
                        parts.push(isWalk ? `${v} ft.${cond}` : `${label} ${v} ft.${cond}`);
                    }
                }
                if (parts.length > 0) speedStr = parts.join(', ');
            }

            // Statistiche (supporta abbreviazioni inglesi e traduzioni Google Translate es. 'già'=WIS, 'di'=CHA)
            const strVal = m.str || m.for || m.forza || m.strength || 10;
            const dexVal = m.dex || m.des || m.destrezza || m.dexterity || 10;
            const conVal = m.con || m.cos || m.costituzione || m.constitution || 10;
            const intVal = m.int || m.intelligenza || m.intelligence || 10;
            const wisVal = m.wis || m.sag || m.saggezza || m['già'] || m['gia'] || m.wisdom || 10;
            const chaVal = m.cha || m.car || m.carisma || m['di'] || m.charisma || 10;

            // Tiri Salvezza
            const saveRaw = m.save || m.tiri_salvezza || m.salvezza || {};
            const parseSave = (val) => {
                if (val === undefined || val === null) return null;
                const n = parseInt(String(val).replace('+', ''));
                return isNaN(n) ? null : n;
            };
            const strSave = parseSave(saveRaw.str || saveRaw.for || m.strength_save);
            const dexSave = parseSave(saveRaw.dex || saveRaw.des || m.dexterity_save);
            const conSave = parseSave(saveRaw.con || saveRaw.cos || m.constitution_save);
            const intSave = parseSave(saveRaw.int || m.intelligence_save);
            const wisSave = parseSave(saveRaw.wis || saveRaw.sag || saveRaw['già'] || saveRaw['gia'] || m.wisdom_save);
            const chaSave = parseSave(saveRaw.cha || saveRaw.car || saveRaw['di'] || m.charisma_save);

            // Abilità (supporta skill, skills, abilità, abilita)
            const skillRaw = m.skill || m.skills || m['abilità'] || m['abilita'] || {};
            const skillsObj = {};
            if (typeof skillRaw === 'object' && skillRaw !== null) {
                for (const [k, v] of Object.entries(skillRaw)) {
                    skillsObj[k] = String(v);
                }
            }

            // Helper per estrarre liste di azioni/tratti (supporta 'voci', 'nome', 'voce')
            const toEntriesArray = (rawArr) => {
                if (!rawArr) return [];
                if (!Array.isArray(rawArr)) {
                    if (typeof rawArr === 'object') rawArr = [rawArr];
                    else return [];
                }
                return rawArr.map(act => {
                    if (!act) return null;
                    if (typeof act === 'string') return { name: 'Nota', desc: this.clean5eToolsText(act) };
                    return {
                        name: this.clean5eToolsText(act.name || act.nome) || 'Azione',
                        desc: this.clean5eToolsText(act.entries || act.voci || act.entry || act.voce || act.desc || act.text)
                    };
                }).filter(Boolean);
            };

            // CR, XP, Lair XP e Bonus di Competenza (PB)
            let crStr = '-';
            let crNum = 0;
            let xpVal = null;
            let xpLairVal = null;
            const crRaw = m.cr !== undefined ? m.cr : (m.gs !== undefined ? m.gs : m.grado_sfida);
            if (crRaw !== undefined && crRaw !== null) {
                if (typeof crRaw === 'object') {
                    crStr = String(crRaw.cr || '-');
                    if (crRaw.xp) xpVal = crRaw.xp;
                    if (crRaw.xpLair || crRaw.lair) xpLairVal = crRaw.xpLair || crRaw.lair;
                } else {
                    crStr = String(crRaw);
                }
            }
            const crClean = crStr.split(/\s+/)[0].trim();
            if (crClean === '1/8') crNum = 0.125;
            else if (crClean === '1/4') crNum = 0.25;
            else if (crClean === '1/2') crNum = 0.5;
            else crNum = parseFloat(crClean) || 0;
            const pb = crStr !== '-' ? Math.max(2, Math.floor((crNum - 1) / 4) + 2) : 2;
            if (crStr !== '-' && !crStr.includes('(')) {
                const baseXp = xpVal !== null ? Number(xpVal) : CR_XP_TABLE[crClean];
                if (baseXp !== undefined && !isNaN(baseXp)) {
                    const xpFormatted = baseXp.toLocaleString('en-US');
                    if (xpLairVal && !isNaN(Number(xpLairVal))) {
                        const lairFormatted = Number(xpLairVal).toLocaleString('en-US');
                        crStr = `${crClean} (XP ${xpFormatted}, or ${lairFormatted} in lair; PB +${pb})`;
                    } else {
                        crStr = `${crClean} (XP ${xpFormatted}; PB +${pb})`;
                    }
                }
            }

            // Iniziativa (supporta D&D 2024 initiative.proficiency, bonus numerici o stringhe)
            const dexNum = parseInt(dexVal) || 10;
            const dexMod = Math.floor((dexNum - 10) / 2);
            let initBonus = dexMod;
            const initRaw = m.initiative !== undefined ? m.initiative : m.iniziativa;
            if (initRaw !== undefined && initRaw !== null) {
                if (typeof initRaw === 'number') {
                    initBonus = initRaw;
                } else if (typeof initRaw === 'string') {
                    const mInit = initRaw.match(/([+-]?\d+)/);
                    if (mInit) initBonus = parseInt(mInit[1], 10);
                } else if (typeof initRaw === 'object') {
                    if (initRaw.initiative !== undefined) {
                        initBonus = parseInt(initRaw.initiative, 10);
                    } else if (initRaw.proficiency !== undefined) {
                        const profMult = Number(initRaw.proficiency) || 0;
                        initBonus = dexMod + Math.floor(pb * profMult);
                    } else if (initRaw.bonus !== undefined) {
                        initBonus = dexMod + (parseInt(initRaw.bonus, 10) || 0);
                    }
                }
            }
            const initSign = initBonus >= 0 ? `+${initBonus}` : `${initBonus}`;
            const initiativeStr = `${initSign} (${10 + initBonus})`;

            // Liste Azioni, Tratti, Reazioni e Azioni Leggendarie
            const traitsList = toEntriesArray(m.trait || m.traits || m.tratto || m.tratti || m.special_abilities);
            const actionsList = toEntriesArray(m.action || m.actions || m.azione || m.azioni);
            const reactionsList = toEntriesArray(m.reaction || m.reactions || m.reazione || m.reazioni);
            const legendaryList = toEntriesArray(m.legendary || m.legendary_actions || m.leggendarie);

            // Parsing universale Spellcasting (2014 & 2024: will, daily, constant, slots 0-9, footerEntries)
            const scRaw = m.spellcasting || m.incantesimi;
            if (Array.isArray(scRaw)) {
                scRaw.forEach(sc => {
                    if (!sc || typeof sc !== 'object') return;
                    const scName = this.clean5eToolsText(sc.name || sc.nome || 'Spellcasting');
                    const scLines = [];
                    if (sc.headerEntries || sc.intestazione) {
                        scLines.push(this.clean5eToolsText(sc.headerEntries || sc.intestazione));
                    }
                    if (Array.isArray(sc.constant) && sc.constant.length > 0) {
                        scLines.push(`Constant: ${sc.constant.map(s => this.clean5eToolsText(s)).join(', ')}`);
                    }
                    if (Array.isArray(sc.will || sc.volonta) && (sc.will || sc.volonta).length > 0) {
                        scLines.push(`At will: ${(sc.will || sc.volonta).map(s => this.clean5eToolsText(s)).join(', ')}`);
                    }
                    const dailyObj = sc.daily || sc.giornaliero;
                    if (dailyObj && typeof dailyObj === 'object') {
                        const sortedDailyKeys = Object.keys(dailyObj).sort((a, b) => parseInt(b) - parseInt(a));
                        sortedDailyKeys.forEach(k => {
                            const list = dailyObj[k];
                            if (Array.isArray(list) && list.length > 0) {
                                const num = parseInt(k, 10) || 1;
                                const isEach = k.toLowerCase().endsWith('e');
                                const label = isEach ? `${num}/day each:` : `${num}/day:`;
                                scLines.push(`${label} ${list.map(s => this.clean5eToolsText(s)).join(', ')}`);
                            }
                        });
                    }
                    if (sc.spells && typeof sc.spells === 'object') {
                        const ordMap = { '1': '1st', '2': '2nd', '3': '3rd', '4': '4th', '5': '5th', '6': '6th', '7': '7th', '8': '8th', '9': '9th' };
                        for (let lvl = 0; lvl <= 9; lvl++) {
                            const spObj = sc.spells[String(lvl)];
                            if (spObj && Array.isArray(spObj.spells) && spObj.spells.length > 0) {
                                const spListStr = spObj.spells.map(s => this.clean5eToolsText(s)).join(', ');
                                if (lvl === 0) {
                                    scLines.push(`Cantrips (at will): ${spListStr}`);
                                } else {
                                    const ord = ordMap[String(lvl)] || `${lvl}th`;
                                    const slots = spObj.slots;
                                    const label = slots ? `${ord} level (${slots} slot${slots > 1 ? 's' : ''}):` : `${ord} level:`;
                                    scLines.push(`${label} ${spListStr}`);
                                }
                            }
                        }
                    }
                    if (sc.footerEntries) {
                        scLines.push(this.clean5eToolsText(sc.footerEntries));
                    }
                    const scEntry = { name: scName, desc: scLines.join('\n') };
                    const dispAs = String(sc.displayAs || 'trait').toLowerCase();
                    if (dispAs === 'action') {
                        // Inserisci in ordine alfabetico tra le azioni non d'attacco dopo Multiattack
                        let inserted = false;
                        for (let idx = 0; idx < actionsList.length; idx++) {
                            const aName = actionsList[idx].name || '';
                            const aDesc = actionsList[idx].desc || '';
                            const isMulti = /^multiattack/i.test(aName);
                            const isAttack = /(?:Attack\s+Roll|Weapon\s+Attack|Spell\s+Attack)/i.test(aDesc);
                            if (!isMulti && !isAttack && aName.localeCompare(scName) > 0) {
                                actionsList.splice(idx, 0, scEntry);
                                inserted = true;
                                break;
                            }
                        }
                        if (!inserted) actionsList.push(scEntry);
                    } else if (dispAs === 'bonus') {
                        actionsList.push({ name: `[Bonus] ${scName}`, desc: scEntry.desc });
                    } else if (dispAs === 'reaction') {
                        reactionsList.push(scEntry);
                    } else if (dispAs === 'legendary') {
                        legendaryList.push(scEntry);
                    } else {
                        traitsList.push(scEntry);
                    }
                });
            }

            // Combina Bonus actions esplicite
            const bonusList = toEntriesArray(m.bonus || m.bonus_actions || m['azioni_bonus']);
            if (bonusList.length > 0) {
                bonusList.forEach(b => {
                    actionsList.push({ name: `[Bonus] ${b.name}`, desc: b.desc });
                });
            }

            // Descrizione e numero usi Azioni Leggendarie (2014 & 2024)
            let legendaryDesc = m.legendaryHeader ? this.clean5eToolsText(m.legendaryHeader) : '';
            if (!legendaryDesc && legendaryList.length > 0) {
                const baseUses = m.legendaryActions || 3;
                const lairUses = m.legendaryActionsLair;
                const usesStr = lairUses ? `${baseUses} (${lairUses} in Lair)` : `${baseUses}`;
                const cTypeLow = (typeStr || 'creature').toLowerCase();
                legendaryDesc = `Legendary Action Uses: ${usesStr}. Immediately after another creature's turn, the ${cTypeLow} can expend a use to take one of the following actions. The ${cTypeLow} regains all expended uses at the start of each of its turns.`;
            }

            // Effetti Regionali e Azioni della Tana (da campi diretti o da legendaryGroup)
            let regionalEffects = toEntriesArray(m.regional || m.regionalEffects || m.regional_effects);
            let regionalDesc = m.regional_desc || '';
            let regionalFooter = m.regional_footer || '';
            let lairActions = toEntriesArray(m.lair || m.lairActions || m.lair_actions);
            let lairDesc = m.lair_desc || '';

            const legGroupRaw = m.legendaryGroup || m.gruppo_leggendario;
            if (legGroupRaw && regionalEffects.length === 0) {
                const groupName = (typeof legGroupRaw === 'string' ? legGroupRaw : (legGroupRaw.name || legGroupRaw.nome || '')).trim().toLowerCase();
                const groupData = LEGENDARY_GROUPS_DB[groupName];
                if (groupData) {
                    if (groupData.regional_desc) regionalDesc = this.clean5eToolsText(groupData.regional_desc);
                    if (groupData.regional_footer) regionalFooter = this.clean5eToolsText(groupData.regional_footer);
                    if (Array.isArray(groupData.regional_effects)) {
                        regionalEffects = groupData.regional_effects.map(re => ({
                            name: this.clean5eToolsText(re.name),
                            desc: this.clean5eToolsText(re.desc)
                        }));
                    }
                }
            }

            // Formattazione liste separate da virgola (Sensi + Percezione Passiva, Linguaggi, Immunità, Resistenze)
            const formatCommaList = (rawField, capitalizeItems = false) => {
                if (!rawField) return '';
                if (Array.isArray(rawField)) {
                    return rawField.map(item => {
                        const cleaned = this.clean5eToolsText(item);
                        return capitalizeItems ? capFirst(cleaned) : cleaned;
                    }).filter(Boolean).join(', ');
                }
                const str = this.clean5eToolsText(rawField);
                return capitalizeItems ? capFirst(str) : str;
            };

            let sensesStr = formatCommaList(m.senses || m.sensi, false);
            const passiveVal = m.passive !== undefined ? m.passive : m.passivo;
            if (passiveVal !== undefined && passiveVal !== null && !/passive\s+perception/i.test(sensesStr)) {
                sensesStr = sensesStr ? `${sensesStr}, Passive Perception ${passiveVal}` : `Passive Perception ${passiveVal}`;
            }

            return {
                name: monsterName,
                source_badge: sourceBadge,
                size: size,
                type: typeStr,
                subtype: subtypeStr,
                alignment: alignStr,
                armor_class: ac,
                ac: ac,
                armor_desc: acDesc,
                initiative: initiativeStr,
                hit_points: hp,
                hp: hp,
                hit_dice: hpDice,
                speed: speedStr,
                strength: parseInt(strVal) || 10,
                dexterity: parseInt(dexVal) || 10,
                constitution: parseInt(conVal) || 10,
                intelligence: parseInt(intVal) || 10,
                wisdom: parseInt(wisVal) || 10,
                charisma: parseInt(chaVal) || 10,
                strength_save: strSave,
                dexterity_save: dexSave,
                constitution_save: conSave,
                intelligence_save: intSave,
                wisdom_save: wisSave,
                charisma_save: chaSave,
                skills: skillsObj,
                challenge_rating: crStr,
                cr: crClean,
                pb: pb,
                actions: actionsList,
                special_abilities: traitsList,
                reactions: reactionsList,
                legendary_actions: legendaryList,
                legendary_desc: legendaryDesc,
                lair_actions: lairActions,
                lair_desc: lairDesc,
                regional_effects: regionalEffects,
                regional_desc: regionalDesc,
                regional_footer: regionalFooter,
                languages: formatCommaList(m.languages || m.lingue || m.linguaggi, true),
                senses: sensesStr,
                damage_vulnerabilities: formatCommaList(m.vulnerable || m.vulnerabilita || m.damage_vulnerabilities, true),
                damage_resistances: formatCommaList(m.resist || m.resistere || m.resistenze, true),
                damage_immunities: formatCommaList(m.immune || m.immunita || m['immunità'], true),
                condition_immunities: formatCommaList(m.conditionImmune || m.condition_immune || m.immunita_condizioni, true)
            };
        },
        parsePlainTextStatblock(rawText) {
    if (!rawText || typeof rawText !== 'string') return null;

    let text = rawText
        .replace(/\r\n/g, '\n')
        .replace(/\u2013|\u2014|\u2212/g, '-')
        .replace(/\u00a0/g, ' ');

    // Rileva eventuale Proficiency Bonus (es. PB +6) o CR per ripulire le formule opzionali "Proficiency Die" (+1d4..+1d12, +2d4..+2d12, DC 1d4..1d12)
    let pb = null;
    const mPb = text.match(/\bPB\s*([+-]?\d+)/i);
    if (mPb) {
        pb = parseInt(mPb[1], 10);
    } else {
        const mCr = text.match(/\b(?:Challenge|CR|Grado Sfida|Sfida)\s*:?\s*(\d+)/i);
        if (mCr) {
            const crNum = parseInt(mCr[1], 10);
            if (!isNaN(crNum)) {
                pb = Math.max(2, Math.floor((crNum - 1) / 4) + 2);
            }
        }
    }
    const resolveProfBonus = (dieSides) => (pb !== null && !isNaN(pb)) ? pb : Math.max(2, Math.round(parseInt(dieSides, 10) / 2));

    // Pulizia formule regole opzionali "Proficiency Die" di 5e.tools (+1d0, +1d4..1d12, +2d4..2d12, DC 1d4..1d12)
    text = text.replace(/\+1d0\s*([+-])\s*(\d+)/gi, (m, sign, n) => (sign === '-' ? `-${n}` : `+${n}`))
               .replace(/\+1d(4|6|8|10|12)\s*([+-])\s*(\d+)/gi, (m, die, sign, n) => {
                   const val = resolveProfBonus(die) + (sign === '-' ? -parseInt(n, 10) : parseInt(n, 10));
                   return (val >= 0 ? `+${val}` : `${val}`);
               })
               .replace(/\+2d(4|6|8|10|12)\s*([+-])\s*(\d+)/gi, (m, die, sign, n) => {
                   const val = 2 * resolveProfBonus(die) + (sign === '-' ? -parseInt(n, 10) : parseInt(n, 10));
                   return (val >= 0 ? `+${val}` : `${val}`);
               })
               .replace(/\bDC\s+1d(4|6|8|10|12)\s*([+-])\s*(\d+)/gi, (m, die, sign, n) => {
                   const val = resolveProfBonus(die) + (sign === '-' ? -parseInt(n, 10) : parseInt(n, 10));
                   return `DC ${val}`;
               });

    // Rimuovi link markdown di 5e.tools [Citazione](url) o [Termine](url) -> Termine
    text = text.replace(/\[(?:MM|PHB|DMG|XMM|XPHB|XDMG|p\d+)[^\]]*\]\([^\)]+\)/gi, '');
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    const rawLines = text.split('\n')
        .map(l => l.trim())
        .filter(l => {
            if (!l) return false;
            if (/^(?:Roll Initiative!?|View Details Page|Stat Block)$/i.test(l)) return false;
            if (/^(?:(?:score|mod|save|mod\.|ts)\s*)+$/i.test(l)) return false;
            return true;
        });

    if (rawLines.length < 2) return null;
    if (rawLines[0].startsWith('{') || rawLines[0].startsWith('[')) return null;

    const standaloneLabelRe = /^(Armor Class|AC|Classe Armatura|CA|Initiative|Init\.?|Iniziativa|Hit Points|HP|Punti Ferita|Punti Vita|PF|PV|Speed|Velocit[àa]|Saving Throws|Save|Tiri Salvezza|TS|Skills|Abilit[àa]|Damage Vulnerabilities|Vulnerabilit[àa] ai Danni|Vulnerabilities|Vuln\.?|Damage Resistances|Resistenze ai Danni|Resistances|Res\.?|Damage Immunities|Immunit[àa] ai Danni|Immunities|Immunit[àa]|Imm\.?|Condition Immunities|Immunit[àa] alle Condizioni|Senses|Sensi|Languages|Linguaggi|Gear|Equipment|Equipaggiamento|Challenge|CR|Grado Sfida|Sfida|Proficiency Bonus|Bonus di Competenza)\s*:?\s*$/i;
    const abilityTagOnlyRe = /^(STR|DEX|CON|INT|WIS|CHA|FOR|DES|COS|SAG|CAR)$/i;
    const multiAbilityHeaderRe = /^(?:(?:STR|DEX|CON|INT|WIS|CHA|FOR|DES|COS|SAG|CAR)\s+){1,5}(?:STR|DEX|CON|INT|WIS|CHA|FOR|DES|COS|SAG|CAR)$/i;

    const lines = [];
    for (let i = 0; i < rawLines.length; i++) {
        const cur = rawLines[i];

        if (standaloneLabelRe.test(cur) && i + 1 < rawLines.length) {
            const cleanLbl = cur.replace(/:$/, '').trim();
            lines.push(`${cleanLbl}: ${rawLines[i + 1]}`);
            i++;
            continue;
        }

        // Gestione tabella orizzontale su 2 righe: Riga 1 = "STR DEX CON INT WIS CHA", Riga 2 = "6 (-2) 13 (+1) ..."
        if (multiAbilityHeaderRe.test(cur) && i + 1 < rawLines.length) {
            const headers = cur.trim().split(/\s+/);
            const valLine = rawLines[i + 1];
            const valMatches = [...valLine.matchAll(/(\d{1,2})(?:\s*\(([+-]?\d+)\)|\s+([+-]\d+)(?:\s+([+-]\d+))?)?/g)];
            if (valMatches.length === headers.length) {
                headers.forEach((h, idx) => {
                    const vm = valMatches[idx];
                    const score = vm[1];
                    const mod = vm[2] || vm[3];
                    const save = vm[4];
                    let built = `${h.toUpperCase()} ${score}`;
                    if (mod !== undefined) {
                        const mStr = mod.startsWith('+') || mod.startsWith('-') ? mod : `+${mod}`;
                        built += ` (${mStr})`;
                    }
                    if (save !== undefined) {
                        const sStr = save.startsWith('+') || save.startsWith('-') ? save : `+${save}`;
                        built += ` SAVE ${sStr}`;
                    }
                    lines.push(built);
                });
                i++;
                continue;
            }
        }

        if (abilityTagOnlyRe.test(cur) && i + 1 < rawLines.length) {
            const next1 = rawLines[i + 1];
            const next2 = i + 2 < rawLines.length ? rawLines[i + 2] : '';
            const next3 = i + 3 < rawLines.length ? rawLines[i + 3] : '';
            const mSingleSave = next1.match(/^(\d{1,2})\s+([+-]?\d+)\s+([+-]?\d+)$/);
            if (mSingleSave) {
                const modVal = mSingleSave[2].startsWith('+') || mSingleSave[2].startsWith('-') ? mSingleSave[2] : `+${mSingleSave[2]}`;
                const saveVal = mSingleSave[3].startsWith('+') || mSingleSave[3].startsWith('-') ? mSingleSave[3] : `+${mSingleSave[3]}`;
                lines.push(`${cur.toUpperCase()} ${mSingleSave[1]} (${modVal}) SAVE ${saveVal}`);
                i++;
                continue;
            } else if (/^\d{1,2}\s*\([+-]?\d+\)$/.test(next1) || /^\d{1,2}\s+[+-]?\d+$/.test(next1)) {
                lines.push(`${cur.toUpperCase()} ${next1}`);
                i++;
                continue;
            } else if (/^\d{1,2}$/.test(next1) && /^\([+-]?\d+\)$/.test(next2)) {
                lines.push(`${cur.toUpperCase()} ${next1} ${next2}`);
                i += 2;
                continue;
            } else if (/^\d{1,2}$/.test(next1) && /^[+-]?\d+$/.test(next2)) {
                const modVal = next2.startsWith('+') || next2.startsWith('-') ? next2 : `+${next2}`;
                if (/^[+-]?\d+$/.test(next3)) {
                    const saveVal = next3.startsWith('+') || next3.startsWith('-') ? next3 : `+${next3}`;
                    lines.push(`${cur.toUpperCase()} ${next1} (${modVal}) SAVE ${saveVal}`);
                    i += 3;
                } else {
                    lines.push(`${cur.toUpperCase()} ${next1} (${modVal})`);
                    i += 2;
                }
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
        name: lines[0].replace(/^#+\s*/, '').replace(/\*+/g, '').trim(),
        size: 'Medium',
        type: 'humanoid',
        subtype: '',
        alignment: 'any alignment',
        armor_class: 10,
        armor_desc: '',
        initiative: null,
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
        damage_vulnerabilities: '',
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
        lair_actions: [],
        lair_desc: '',
        regional_effects: [],
        regional_desc: '',
        regional_footer: '',
        tokenSrc: null
    };

    let startIdx = 1;
    const sizeWord = '(?:Tiny|Small|Medium|Large|Huge|Gargantuan|Minuscola|Piccola|Media|Grande|Enorme|Mastodontica|Gargantuesca)';
    const sizeRe = new RegExp(`^(${sizeWord}(?:\\s+(?:or|o)\\s+${sizeWord})?)\\b`, 'i');
    const typeKeywordsRe = /\b(humanoid|aberration|beast|celestial|construct|dragon|elemental|fey|fiend|giant|monstrosity|ooze|plant|undead|swarm|umanoide|aberrazione|bestia|celestiale|costrutto|drago|elementale|folletto|immondo|gigante|mostruosit[àa]|melma|vegetale|non\s*morto)\b/i;
    const statLineStartRe = /^(?:Armor Class|AC|Classe Armatura|CA|Initiative|Init\.?|Iniziativa|Hit Points|HP|Punti Ferita|PF|PV|Speed|Velocit[àa])\b/i;

    // Cerca la riga Taglia/Specie/Allineamento nelle prime righe (saltando eventuali codici manuale/pagina di 5e.tools come "FRAiF", "p259")
    for (let k = 1; k < Math.min(lines.length, 7); k++) {
        const cand = lines[k];
        if (statLineStartRe.test(cand)) break;
        if (sizeRe.test(cand) || typeKeywordsRe.test(cand)) {
            const commaParts = cand.split(',');
            const leftPart = commaParts[0].trim();
            if (commaParts.length > 1) {
                result.alignment = commaParts.slice(1).join(',').trim();
            }
            const sm = leftPart.match(sizeRe);
            if (sm) {
                result.size = sm[1].split(/\s+(?:or|o)\s+/i)[0].trim();
                const rest = leftPart.slice(sm[0].length).trim();
                const parenM = rest.match(/^(.*?)(?:\s*\(([^)]+)\))?$/);
                if (parenM) {
                    result.type = parenM[1].trim() || 'creature';
                    result.subtype = parenM[2] ? parenM[2].trim() : '';
                }
            } else {
                result.type = leftPart;
            }
            startIdx = k + 1;
            break;
        }
    }

    const abilMap = {
        'str': 'strength', 'dex': 'dexterity', 'con': 'constitution',
        'int': 'intelligence', 'wis': 'wisdom', 'cha': 'charisma',
        'for': 'strength', 'des': 'dexterity', 'cos': 'constitution',
        'sag': 'wisdom', 'car': 'charisma'
    };

    const knownConditionsSet = new Set([
        ...Object.keys(DND_IT_GLOSSARY.conditions),
        ...Object.values(DND_IT_GLOSSARY.conditions)
    ].map(s => s.toLowerCase()));

    // Pattern rigoroso per riga caratteristiche: l'intera riga deve essere composta SOLO da blocchi caratteristica (evita collisioni con "for 1 minute" o "con 10" nel testo)
    const abTokenStr = '(?:STR|DEX|CON|INT|WIS|CHA|FOR|DES|COS|SAG|CAR)\\s*:?\\s*\\d{1,2}(?:\\s*\\([+-]?\\d+\\)|\\s+[+-]\\d+)?(?:\\s+(?:SAVE\\s+)?\\(?[+-]?\\d+\\)?)?';
    const abFullLineRe = new RegExp(`^\\s*${abTokenStr}(?:[\\s,;|]+${abTokenStr})*\\s*$`, 'i');
    const abTokenExtractRe = /\b(STR|DEX|CON|INT|WIS|CHA|FOR|DES|COS|SAG|CAR)\b\s*:?\s*(\d{1,2})(?:\s*\(([+-]?\d+)\)|\s+([+-]\d+))?(?:\s+(?:SAVE\s+)?\(?([+-]?\d+)\)?)?/gi;

    let inHeaderPhase = true;
    let currentSection = 'special_abilities';
    let isBonusSubSection = false;
    let inVariantBlock = false;
    let currentEntry = null;

    const flushEntry = () => {
        if (currentEntry) {
            currentEntry.desc = currentEntry.desc.trim();
            if (currentEntry.name || currentEntry.desc) {
                if (currentSection === 'actions') result.actions.push(currentEntry);
                else if (currentSection === 'reactions') result.reactions.push(currentEntry);
                else if (currentSection === 'legendary_actions') result.legendary_actions.push(currentEntry);
                else if (currentSection === 'lair_actions') result.lair_actions.push(currentEntry);
                else if (currentSection === 'regional_effects') result.regional_effects.push(currentEntry);
                else result.special_abilities.push(currentEntry);
            }
            currentEntry = null;
        }
    };

    for (let i = startIdx; i < lines.length; i++) {
        let line = lines[i];

        // Ignora righe di citazione fonte isolate (es. "FRAiF", "FTD", "p259", "MM'14 p86", "Source: FTD", "Habitat: ...", "Treasure: ...")
        if (/^(?:p\d+|page\s+\d+|Source\s*:.*|Habitat\s*:.*|Treasure\s*:.*)$/i.test(line)) continue;
        if (/^(?:FRAiF|XMM|MM(?:'\d+)?|FTD|FToD|MPMM|VGM|MTF|BGG|TCE|XGE|VRGR|ERLW|EGW|MOT|SCAG|DMG|XDMG|PHB|XPHB)(?:\s+p?\d+)?$/i.test(line)) continue;

        // Sezioni principali
        if (/^actions?\s*$/i.test(line) || /^azioni?\s*$/i.test(line)) {
            flushEntry();
            inHeaderPhase = false;
            currentSection = 'actions';
            isBonusSubSection = false;
            inVariantBlock = false;
            continue;
        }
        if (/^bonus\s+actions?\s*$/i.test(line) || /^azioni?\s+bonus\s*$/i.test(line)) {
            flushEntry();
            inHeaderPhase = false;
            currentSection = 'actions';
            isBonusSubSection = true;
            inVariantBlock = false;
            continue;
        }
        if (/^reactions?\s*$/i.test(line) || /^reazioni?\s*$/i.test(line)) {
            flushEntry();
            inHeaderPhase = false;
            currentSection = 'reactions';
            isBonusSubSection = false;
            inVariantBlock = false;
            continue;
        }
        if (/^legendary\s+actions?\s*$/i.test(line) || /^azioni?\s+leggendarie?\s*$/i.test(line)) {
            flushEntry();
            inHeaderPhase = false;
            currentSection = 'legendary_actions';
            isBonusSubSection = false;
            inVariantBlock = false;
            continue;
        }
        if (/^traits?\s*$/i.test(line) || /^tratti?\s*$/i.test(line)) {
            flushEntry();
            inHeaderPhase = false;
            currentSection = 'special_abilities';
            isBonusSubSection = false;
            inVariantBlock = false;
            continue;
        }
        if (/^(?:regional\s+effects?|effetti\s+regionali)\s*$/i.test(line)) {
            flushEntry();
            inHeaderPhase = false;
            currentSection = 'regional_effects';
            isBonusSubSection = false;
            inVariantBlock = false;
            continue;
        }
        if (/^(?:lair\s+actions?|azioni\s+di\s+tana)\s*$/i.test(line)) {
            flushEntry();
            inHeaderPhase = false;
            currentSection = 'lair_actions';
            isBonusSubSection = false;
            inVariantBlock = false;
            continue;
        }
        if (/^(?:mythic\s+actions?|azioni\s+mitiche)\s*$/i.test(line)) {
            flushEntry();
            inHeaderPhase = false;
            inVariantBlock = false;
            currentEntry = { name: line.trim(), desc: '' };
            continue;
        }
        if (/^(?:variant|variante)\s*:/i.test(line)) {
            flushEntry();
            inHeaderPhase = false;
            inVariantBlock = true;
            currentEntry = { name: line.trim(), desc: '' };
            continue;
        }

        if (inHeaderPhase) {
            // Armor Class (con eventuale Initiative sulla stessa riga, es. "AC 22 Init +16 (26)")
            const acMatch = line.match(/^(?:Armor Class|AC|Classe Armatura|CA)\s*:?\s*(\d+)(?:\s*\(([^)]+)\))?(?:\s+(?:Initiative|Init\.?|Iniziativa)\s*:?\s*([+-]?\d+)(?:\s*\(([+-]?\d+)\))?)?/i);
            if (acMatch) {
                result.armor_class = parseInt(acMatch[1], 10) || 10;
                if (acMatch[2]) result.armor_desc = acMatch[2].trim();
                if (acMatch[3]) {
                    result.initiative = acMatch[3] + (acMatch[4] ? ` (${acMatch[4]})` : '');
                }
                continue;
            }

            // Initiative
            const initMatch = line.match(/^(?:Initiative|Init\.?|Iniziativa)\s*:?\s*([+-]?\d+)(?:\s*\(([+-]?\d+)\))?/i);
            if (initMatch) {
                result.initiative = initMatch[1] + (initMatch[2] ? ` (${initMatch[2]})` : '');
                continue;
            }

            // Hit Points
            const hpMatch = line.match(/^(?:Hit Points|HP|Punti Ferita|Punti Vita|PF|PV)\s*:?\s*(\d+)(?:\s*\((.*?)\))?/i);
            if (hpMatch) {
                result.hit_points = parseInt(hpMatch[1], 10) || 10;
                if (hpMatch[2]) result.hit_dice = hpMatch[2].trim();
                continue;
            }

            // Speed
            const spMatch = line.match(/^(?:Speed|Velocit[àa])\s*:?\s*(.+)$/i);
            if (spMatch) {
                result.speed = spMatch[1].trim();
                continue;
            }

            // Ability row: processa SOLO se l'intera riga è composta da blocchi caratteristica validi
            if (abFullLineRe.test(line)) {
                abTokenExtractRe.lastIndex = 0;
                let abM;
                let matchedAb = false;
                while ((abM = abTokenExtractRe.exec(line)) !== null) {
                    const k = abilMap[abM[1].toLowerCase().slice(0, 3)];
                    if (k) {
                        result[k] = parseInt(abM[2], 10);
                        if (abM[5] !== undefined && abM[5] !== null) {
                            result[k + '_save'] = parseInt(abM[5], 10);
                        }
                        matchedAb = true;
                    }
                }
                if (matchedAb) continue;
            }

            // Saving Throws
            const svMatch = line.match(/^(?:Saving Throws|Save|Tiri Salvezza|TS)\s*:?\s*(.+)$/i);
            if (svMatch) {
                const svRegex = /\b(Str|Dex|Con|Int|Wis|Cha|For|Des|Cos|Sag|Car)[a-z]*\s*([+-]?\d+)/gi;
                let sm;
                while ((sm = svRegex.exec(svMatch[1])) !== null) {
                    const k = abilMap[sm[1].toLowerCase().slice(0, 3)];
                    if (k) result[k + '_save'] = parseInt(sm[2], 10);
                }
                continue;
            }

            // Skills
            const skMatch = line.match(/^(?:Skills|Abilit[àa])\s*:?\s*(.+)$/i);
            if (skMatch) {
                const skRegex = /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'\-]*?)\s*([+-]?\d+)(?=\s*(?:,|;|$|[A-Za-zÀ-ÿ]|\())/g;
                let skm;
                while ((skm = skRegex.exec(skMatch[1])) !== null) {
                    const skName = skm[1].replace(/^[,;\s]+/, '').trim().toLowerCase();
                    if (skName) result.skills[skName] = parseInt(skm[2], 10);
                }
                continue;
            }

            // Damage Vulnerabilities / Resistances
            const vulnMatch = line.match(/^(?:Damage Vulnerabilities|Vulnerabilit[àa] ai Danni|Vulnerabilities|Vuln\.?)\s*:?\s*(.+)$/i);
            if (vulnMatch) {
                result.damage_vulnerabilities = vulnMatch[1].trim();
                continue;
            }

            const resMatch = line.match(/^(?:Damage Resistances|Resistenze ai Danni|Resistances|Res\.?)\s*:?\s*(.+)$/i);
            if (resMatch) {
                result.damage_resistances = resMatch[1].trim();
                continue;
            }

            // Condition Immunities esplicite
            const cImmMatch = line.match(/^(?:Condition Immunities|Immunit[àa] alle Condizioni)\s*:?\s*(.+)$/i);
            if (cImmMatch) {
                result.condition_immunities = cImmMatch[1].trim();
                continue;
            }

            // Damage Immunities / Immunities (supporta anche il formato 2024 combinato "Immunities Fire; Charmed, Frightened, Poisoned" o "Imm. Fire")
            const dImmMatch = line.match(/^(?:Damage Immunities|Immunit[àa] ai Danni|Immunities|Immunit[àa]|Imm\.?)\s*:?\s*(.+)$/i);
            if (dImmMatch) {
                const rawImm = dImmMatch[1].trim();
                const isExplicitDamage = /^(?:Damage Immunities|Immunit[àa] ai Danni)/i.test(line);
                if (isExplicitDamage) {
                    result.damage_immunities = rawImm;
                } else if (rawImm.includes(';')) {
                    const semiParts = rawImm.split(';').map(s => s.trim()).filter(Boolean);
                    const dmgParts = [];
                    const condParts = [];
                    semiParts.forEach(part => {
                        const tokens = part.split(',').map(t => t.trim()).filter(Boolean);
                        const allCond = tokens.length > 0 && tokens.every(t => knownConditionsSet.has(t.toLowerCase()));
                        if (allCond) condParts.push(part);
                        else dmgParts.push(part);
                    });
                    if (dmgParts.length > 0) result.damage_immunities = dmgParts.join('; ');
                    if (condParts.length > 0) result.condition_immunities = condParts.join(', ');
                } else {
                    const tokens = rawImm.split(',').map(t => t.trim()).filter(Boolean);
                    const dmgTokens = [];
                    const condTokens = [];
                    tokens.forEach(t => {
                        if (knownConditionsSet.has(t.toLowerCase())) condTokens.push(t);
                        else dmgTokens.push(t);
                    });
                    if (dmgTokens.length > 0) result.damage_immunities = dmgTokens.join(', ');
                    if (condTokens.length > 0) result.condition_immunities = condTokens.join(', ');
                }
                continue;
            }

            // Senses
            const sensMatch = line.match(/^(?:Senses|Sensi)\s*:?\s*(.+)$/i);
            if (sensMatch) {
                result.senses = sensMatch[1].trim();
                continue;
            }

            // Languages
            const langMatch = line.match(/^(?:Languages|Linguaggi)\s*:?\s*(.+)$/i);
            if (langMatch) {
                result.languages = langMatch[1].trim();
                continue;
            }

            // Gear / Equipment (D&D 2024)
            const gearMatch = line.match(/^(?:Gear|Equipment|Equipaggiamento)\s*:?\s*(.+)$/i);
            if (gearMatch) {
                result.gear = gearMatch[1].trim();
                continue;
            }

            // Challenge / CR (con eventuale XP e PB tra parentesi o sulla stessa riga)
            const crMatch = line.match(/^(?:Challenge|CR|Grado Sfida|Sfida)\s*:?\s*([0-9\/\.]+)(?:\s*\((.*?)\))?(?:\s+(?:Proficiency Bonus|Bonus di Competenza|PB)\s*:?\s*([+-]?\d+))?/i);
            if (crMatch) {
                let crText = crMatch[1];
                const parenContent = crMatch[2] ? crMatch[2].trim() : '';
                const inlinePb = crMatch[3] ? crMatch[3].trim() : '';
                if (parenContent && inlinePb && !/\bPB\b/i.test(parenContent)) {
                    const pbSign = inlinePb.startsWith('+') || inlinePb.startsWith('-') ? inlinePb : `+${inlinePb}`;
                    crText += ` (${parenContent}; PB ${pbSign})`;
                } else if (parenContent) {
                    crText += ` (${parenContent})`;
                } else if (inlinePb) {
                    const pbSign = inlinePb.startsWith('+') || inlinePb.startsWith('-') ? inlinePb : `+${inlinePb}`;
                    crText += ` (PB ${pbSign})`;
                }
                result.challenge_rating = crText;
                continue;
            }

            // Proficiency Bonus su riga dedicata (es. D&D Beyond "Proficiency Bonus +2")
            const pbLineMatch = line.match(/^(?:Proficiency Bonus|Bonus di Competenza|PB)\s*:?\s*([+-]?\d+)$/i);
            if (pbLineMatch) {
                const pbSign = pbLineMatch[1].startsWith('+') || pbLineMatch[1].startsWith('-') ? pbLineMatch[1] : `+${pbLineMatch[1]}`;
                if (result.challenge_rating && result.challenge_rating !== '-' && !/\bPB\b/i.test(result.challenge_rating)) {
                    if (result.challenge_rating.endsWith(')')) {
                        result.challenge_rating = result.challenge_rating.slice(0, -1) + `; PB ${pbSign})`;
                    } else {
                        result.challenge_rating += ` (PB ${pbSign})`;
                    }
                }
                continue;
            }
        }

        // Header descrittivo di Azioni Leggendarie (2014 o 2024 "Legendary Action Uses: 3...")
        if (currentSection === 'legendary_actions' && !result.legendary_desc && result.legendary_actions.length === 0 && !currentEntry) {
            if (/^(?:Legendary Action Uses|The\s+.+?\s+can\s+take\s+\d+\s+legendary\s+actions)/i.test(line)) {
                result.legendary_desc = line;
                continue;
            }
        }
        // Header o Footer di Effetti Regionali
        if (currentSection === 'regional_effects' && !currentEntry && result.regional_effects.length === 0 && /^The\s+region\s+containing/i.test(line)) {
            result.regional_desc = line;
            continue;
        }
        if (currentSection === 'regional_effects' && /^If\s+the\s+.+?\s+dies\s+or\s+moves\s+its\s+lair/i.test(line)) {
            flushEntry();
            result.regional_footer = line;
            continue;
        }

        // Se siamo dentro un blocco "Variant: ...", mantieni il testo nel blocco variante
        if (inVariantBlock && currentEntry) {
            if (/^[a-z][a-z\s'\-]{1,30}$/.test(line)) {
                const sep = currentEntry.desc.endsWith('.') || currentEntry.desc.endsWith(':') ? ' — Incantesimi: ' : ', ';
                currentEntry.desc += sep + line;
            } else {
                if (currentEntry.desc && !currentEntry.desc.endsWith('.')) currentEntry.desc += '.';
                currentEntry.desc += (currentEntry.desc ? ' ' : '') + line;
            }
            continue;
        }

        // Righe elenco incantesimi (At will:, 1/day each:, Cantrips, ecc.) vanno a capo dentro l'azione corrente
        if (currentEntry && /^(?:At\s+will|A\s+volontà|Constant|Costante|\d+\/(?:day|giorno)(?:\s+(?:each|ciascuno))?|Cantrips\s*\([^)]+\)|Trucchetti\s*\([^)]+\)|\d+(?:st|nd|rd|th|°)\s+(?:level|livello))\s*:/i.test(line)) {
            currentEntry.desc += (currentEntry.desc ? '\n' : '') + line;
            continue;
        }

        // Action / Trait item (Titolo breve seguito da punto, evitando normali frasi lunghe del testo)
        const entryMatch = line.match(/^([A-ZÀ-Ý0-9][A-Za-zÀ-ÿ0-9\s\(\)\/\-\'\’\–\,\:\+]{0,60}?)\.\s+(.+)$/);
        if (entryMatch) {
            const candidateName = entryMatch[1].trim();
            const isSentenceStart = /^(?:This|The|A|An|If|When|Each|Any|On|While|After|Before|In|At|For|See|Its|Creature|Creatures|Books|Vegetation|Dragons)\b/i.test(candidateName) && candidateName.split(/\s+/).length > 3;
            if (!isSentenceStart) {
                flushEntry();
                inHeaderPhase = false;
                const finalName = (currentSection === 'actions' && isBonusSubSection && !candidateName.startsWith('[Bonus]'))
                    ? `[Bonus] ${candidateName}`
                    : candidateName;
                currentEntry = {
                    name: finalName,
                    desc: entryMatch[2].trim()
                };
                continue;
            }
        }

        if (currentEntry) {
            currentEntry.desc += (currentEntry.desc ? ' ' : '') + line;
        }
    }

    flushEntry();
    return result;
        },

        assignToSelectedToken(monster) {
            const eng = getEngine();
            if (!eng || !eng.tokens) return;
            let targetTokens = (eng.selectedTokens && eng.selectedTokens.size > 0)
                ? eng.tokens.filter(t => eng.selectedTokens.has(t.id))
                : (eng.selectedTokenId ? [eng.tokens.find(t => t.id === eng.selectedTokenId)].filter(Boolean) : []);
            if (targetTokens.length === 0 && window.editingPlayerToken) {
                targetTokens = [window.editingPlayerToken];
            }
            if (targetTokens.length === 0 && this._activeTargetTokenId) {
                const found = eng.tokens.find(t => t.id === this._activeTargetTokenId);
                if (found) targetTokens = [found];
            }

            if (targetTokens.length === 0) {
                alert("Seleziona prima almeno un token sulla mappa cliccandoci sopra!");
                return;
            }

            const hpVal = parseInt(monster.hit_points) || 10;
            const acVal = parseInt(monster.armor_class) || 10;
            const sizeMap = { 'tiny': 1, 'small': 1, 'medium': 1, 'large': 2, 'huge': 3, 'gargantuan': 4, 't': 1, 's': 1, 'm': 1, 'l': 2, 'h': 3, 'g': 4, 'minuscola': 1, 'piccola': 1, 'media': 1, 'grande': 2, 'enorme': 3, 'mastodontica': 4, 'gargantuesca': 4 };
            const sizeKey = (monster.size || 'm').toLowerCase().trim().split(/\s+/)[0];
            const sizeMult = sizeMap[sizeKey] || 1;
            const gridSize = (eng.grid && eng.grid.size) ? eng.grid.size : 50;
            const pxSize = gridSize * sizeMult;

            targetTokens.forEach(token => {
                const st = JSON.parse(JSON.stringify(monster));
                st._raw = rawMonster ? JSON.parse(JSON.stringify(rawMonster)) : JSON.parse(JSON.stringify(monster));
                if (st._raw && st._raw.tokenSrc) delete st._raw.tokenSrc;
                st._isItalian = isItalianMode;
                token.statblock = st;
                delete token.pcSheet;
                delete token.hasPcSheet;

                token.sizeMultiplier = sizeMult;
                token.width = pxSize;
                token.height = pxSize;
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
            if (typeof window.syncState === 'function') {
                window.syncState(true, false);
                const net = (typeof window.network !== 'undefined' && window.network) ? window.network : ((typeof network !== 'undefined') ? network : null);
                if (net && typeof net.send === 'function') {
                    targetTokens.forEach(t => {
                        net.send({
                            type: 'TOKEN_STATBLOCK_SYNC',
                            payload: {
                                tokenId: t.id,
                                statblock: t.statblock
                            }
                        });
                    });
                }
            } else if (typeof syncState === 'function') {
                syncState(true, false);
                const net = (typeof window.network !== 'undefined' && window.network) ? window.network : ((typeof network !== 'undefined') ? network : null);
                if (net && typeof net.send === 'function') {
                    targetTokens.forEach(t => {
                        net.send({
                            type: 'TOKEN_STATBLOCK_SYNC',
                            payload: {
                                tokenId: t.id,
                                statblock: t.statblock
                            }
                        });
                    });
                }
            } else {
                const net = (typeof window.network !== 'undefined' && window.network) ? window.network : ((typeof network !== 'undefined') ? network : null);
                if (net && typeof net.send === 'function') {
                    targetTokens.forEach(t => {
                        net.send({
                            type: 'PLAYER_UPDATE_TOKEN_STATBLOCK',
                            payload: {
                                tokenId: t.id,
                                statblock: t.statblock,
                                hpMax: t.hpMax,
                                hpCurrent: t.hpCurrent,
                                ac: t.ac,
                                name: t.name
                            }
                        });
                    });
                }
            }

            this.loadMonster(monster);
            const pBtnStat = document.getElementById('pbtn-open-statblock');
            if (pBtnStat && monster.name) {
                pBtnStat.innerHTML = `<span>📜 ${escapeHTML(monster.name)}</span>`;
                pBtnStat.style.background = '#00897b';
                pBtnStat.style.borderColor = '#80cbc4';
            }
            if (typeof showToast === 'function') {
                showToast(`Scheda "${monster.name}" assegnata a ${targetTokens.length} token (Full PV: ${hpVal}, CA: ${acVal})!`);
            } else if (typeof showPlayerToast === 'function') {
                showPlayerToast(`📜 Scheda "${monster.name}" assegnata (PV: ${hpVal}, CA: ${acVal})!`);
            }
        },

        spawnAsToken(monster) {
            const eng = getEngine();
            if (!eng) return;
            const sizeMap = { 'tiny': 1, 'small': 1, 'medium': 1, 'large': 2, 'huge': 3, 'gargantuan': 4, 't': 1, 's': 1, 'm': 1, 'l': 2, 'h': 3, 'g': 4, 'minuscola': 1, 'piccola': 1, 'media': 1, 'grande': 2, 'enorme': 3, 'mastodontica': 4, 'gargantuesca': 4 };
            const sizeKey = (monster.size || 'm').toLowerCase().trim().split(/\s+/)[0];
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
                : ((typeof window !== 'undefined' && window.editingPlayerToken) ? window.editingPlayerToken : null);
            this._activeTargetTokenId = selectedToken ? selectedToken.id : null;
            const targetStatblock = statblockToDisplay || (selectedToken ? selectedToken.statblock : null);

            if (targetStatblock) {
                this.loadMonster(targetStatblock);
            } else if (selectedToken && (selectedToken.hasStatblock || selectedToken.statblockName) && !selectedToken.statblock) {
                const details = document.getElementById('statblock-details');
                const placeholder = document.getElementById('statblock-placeholder');
                if (details) details.style.display = 'none';
                if (placeholder) {
                    placeholder.style.display = 'block';
                    placeholder.innerHTML = `
                        <div style="text-align: center; color: #aaa; padding: 35px 15px;">
                            <div style="font-size: 32px; margin-bottom: 10px;">📜</div>
                            <strong style="color: #4caf50; font-size: 15px;">Caricamento scheda in corso...</strong>
                            <p style="font-size: 12px; color: #aaa; margin: 8px 0 15px 0;">Sincronizzazione della scheda mostro dal Master...</p>
                        </div>
                    `;
                }
                const net = (typeof window.network !== 'undefined' && window.network) ? window.network : ((typeof network !== 'undefined') ? network : null);
                if (net && typeof net.send === 'function') {
                    net.send({ type: 'REQUEST_TOKEN_STATBLOCK', tokenId: selectedToken.id });
                }
                currentMonster = null;
                rawMonster = null;
                this.updateAssignButtonText();
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
            hideSpellTooltip();
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
