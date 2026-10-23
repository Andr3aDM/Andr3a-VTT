// js/lang.js - Motore di Traduzione Internazionale (Italiano / Inglese)

const dict = {
    "DM Console": "DM Console",
    "Apri Schermo Giocatori": "Open Players Screen",
    "Campagne & Salvataggi": "Campaigns & Saves",
    "-- Seleziona Campagna --": "-- Select Campaign --",
    "Nuova": "New",
    "Salva": "Save",
    "Esporta (JSON)": "Export (JSON)",
    "Importa": "Import",
    "Mappa & Griglia": "Map & Grid",
    "Sincronizza Vista Giocatori (Pan/Zoom)": "Sync Players View (Pan/Zoom)",
    "Nascondi Barra Giocatori (Modalità TV)": "Hide Player Toolbar (TV Mode)",
    "-- Seleziona Mappa --": "-- Select Map --",
    "Carica Mappa": "Load Map",
    "Salva Nuova": "Save New",
    "Elimina Mappa Selezionata": "Delete Selected Map",
    "Celle (px):": "Cells (px):",
    "Colore": "Color",
    "Allinea Griglia": "Align Grid",
    "Multiplayer Online (P2P)": "Online Multiplayer (P2P)",
    "Avvia Stanza Online": "Start Online Room",
    "Stato: Offline (Locale)": "Status: Offline (Local)",
    "Nessun giocatore connesso.": "No players connected.",
    "Gestione Party": "Party Management",
    "Nessuno": "None",
    "Strumenti Base": "Basic Tools",
    "Muovi/Seleziona": "Move/Select",
    "(Tieni premuto per Ping)": "(Hold to Ping)",
    "Metro (ft/m)": "Ruler (ft/m)",
    "Disegna (Tutti)": "Draw (All)",
    "Disegna (Solo DM)": "Draw (DM Only)",
    "Seleziona (Lazo)": "Select (Lasso)",
    "+ Aggiungi all'Iniziativa": "+ Add to Initiative",
    "Aggiungi Nebbia": "Add Fog",
    "Cancella Nebbia": "Erase Fog",
    "Pin Segreto (DM)": "Secret Pin (DM)",
    "Impostazioni Nebbia": "Fog Settings",
    "Forma pennello": "Brush Shape",
    "Cerchio": "Circle",
    "Quadrato": "Square",
    "Dimensione Pennello (px)": "Brush Size (px)",
    "Copri tutto di Nebbia": "Cover all with Fog",
    "Rimuovi tutta la Nebbia": "Remove all Fog",
    "Pulisci Dis. (Pub)": "Clear Draw (Pub)",
    "Pulisci Dis. (DM)": "Clear Draw (DM)",
    "Tokens": "Tokens",
    "Carica Tokens (Cartella/File)": "Load Tokens (Folder/Files)",
    "Cerca token per nome...": "Search token by name...",
    "Impostazioni nuovo Token:": "New Token Settings:",
    "Nascosto (Invisibile)": "Hidden (Invisible)",
    "Assegna questo token a un giocatore": "Assign this token to a player",
    "-- Nessuno (Solo DM) --": "-- None (DM Only) --",
    "Aggiungi": "Add",
    "Token Selezionato": "Selected Token",
    "Modifica Taglia": "Edit Size",
    "Media/Piccola (1x1)": "Medium/Small (1x1)",
    "Grande (2x2)": "Large (2x2)",
    "Enorme (3x3)": "Huge (3x3)",
    "Mastodontica (4x4)": "Gargantuan (4x4)",
    "Nascondi/Rivela": "Hide/Reveal",
    "Elimina": "Delete",
    "Punti Ferita (HP)": "Hit Points (HP)",
    "Attuali": "Current",
    "Max (0=Off)": "Max (0=Off)",
    "Mostra stato (colori) ai giocatori": "Show status (colors) to players",
    "Aura Mobile": "Mobile Aura",
    "Raggio Aura": "Aura Radius",
    "Stato / Condizione": "Status / Condition",
    "Lingua": "Language",
    "Accecato / Blinded": "Accecato / Blinded",
    "Affascinato / Charmed": "Affascinato / Charmed",
    "Afferrato / Grappled": "Afferrato / Grappled",
    "Assordato / Deafened": "Assordato / Deafened",
    "Avvelenato / Poisoned": "Avvelenato / Poisoned",
    "Inabile / Incapacitated": "Inabile / Incapacitated",
    "Invisibile / Invisible": "Invisibile / Invisible",
    "Paralizzato / Paralyzed": "Paralizzato / Paralyzed",
    "Pietrificato / Petrified": "Pietrificato / Petrified",
    "Privo di sensi / Unconscious": "Privo di sensi / Unconscious",
    "Prono / Prone": "Prono / Prone",
    "Spaventato / Frightened": "Spaventato / Frightened",
    "Stordito / Stunned": "Stordito / Stunned",
    "Trattenuto / Restrained": "Trattenuto / Restrained",
    "Sfinimento / Exhaustion": "Sfinimento / Exhaustion",
    "Pin Segreto": "Secret Pin",
    "Titolo (es. Trappola)": "Title (e.g. Trap)",
    "Descrizione...": "Description...",
    "Elimina Pin": "Delete Pin",
    "Zone d'Effetto (AoE)": "Area of Effect (AoE)",
    "Visibile ai giocatori": "Visible to players",
    "Dimensione": "Size",
    "Unità": "Unit",
    "Bagliore:": "Glow:",
    "Cerchio (Sfera/Cilindro)": "Circle (Sphere/Cylinder)",
    "Cono": "Cone",
    "Linea": "Line",
    "Crea AoE al Centro": "Create AoE at Center",
    "Modifica AoE Selezionata": "Edit Selected AoE",
    "Modifica Dimensione": "Edit Size",
    "Apri Tracker Iniziativa": "Open Initiative Tracker",
    "Tracker Iniziativa": "Initiative Tracker",
    "Avvia Combattimento": "Start Combat",
    "Ferma/Reset": "Stop/Reset",
    "Mostra ai Giocatori": "Show to Players",
    "In Alto (Orizz.)": "Top (Horiz.)",
    "In Basso (Orizz.)": "Bottom (Horiz.)",
    "A Sinistra (Vert.)": "Left (Vert.)",
    "A Destra (Vert.)": "Right (Vert.)",
    "Nome": "Name",
    "HP (+/-)": "HP (+/-)",
    "Iniz.": "Init.",
    "Azioni": "Actions",
    "Danni/Cure": "Damage/Heal",
    "◀ Precedente": "◀ Previous",
    "Prossimo Turno ▶": "Next Turn ▶",
    "+ Aggiungi Entità Extra": "+ Add Extra Entity",
    "Unisciti alla Partita": "Join the Game",
    "Il tuo Nome (es: Marco)": "Your Name (e.g. Marco)",
    "Codice Stanza (es: ABCD-1234)": "Room Code (e.g. ABCD-1234)",
    "Connetti Online": "Connect Online",
    "Usa Schermo Locale (Offline)": "Use Local Screen (Offline)",
    "Ordine di Iniziativa": "Initiative Order",
    "Opzioni Token": "Token Options",
    "Aura Attiva:": "Active Aura:",
    "Raggio / Lato:": "Radius / Side:",
    "Colore Aura:": "Aura Color:",
    "Chiudi": "Close",
    "Opzioni Magia AoE": "AoE Spell Options",
    "Dimensione / Lunghezza:": "Size / Length:",
    "Rotazione (°):": "Rotation (°):",
    "Colore:": "Color:",
    "Elimina Magia": "Delete Spell",
    "Muovi Token": "Move Token",
    "Disegna (Pubblico)": "Draw (Public)",
    "Metro": "Ruler",
    "Crea Sfera": "Create Sphere",
    "Crea Cono": "Create Cone",
    "Crea Linea": "Create Line",
    "Il tuo Colore (per Disegni e Ping)": "Your Color (for Draws and Pings)",
    "DM Dashboard - VTT": "DM Dashboard - VTT",
    "Andr3a VTT": "Andr3a VTT",
    "Andr3a VTT - Schermo Giocatori": "Andr3a VTT - Player Screen",
    "Immagine Condivisa": "Shared Image",
    "Trasmetti ai Giocatori": "Transmit to Players",
    "Chiudi per Tutti": "Close for All",
    "⚔️ Tracker Iniziativa": "⚔️ Initiative Tracker",
    "Puntatore Laser": "Laser Pointer",
    "♟️ Libreria & Nuovi Token": "♟️ Library & New Tokens",
    "Apri la Libreria Token per caricare cartelle e inserire pedine": "Open Token Library to load folders and spawn tokens",
    "Stile PV Token (Lato Giocatori):": "Token HP Style (Player Side):",
    "Solo Barra (Classico)": "Bar Only (Classic)",
    "Solo Alone (Immersivo)": "Aura Only (Immersive)",
    "Barra + Alone": "Bar + Aura",
    "Stile Condizioni Multiple:": "Multiple Conditions Style:",
    "Anelli Concentrici (Testo Curvo)": "Concentric Rings (Curved Text)",
    "Anello Singolo (Spicchi)": "Single Ring (Segments)",
    "Pillole con Nome (es. Prono)": "Name Pills (e.g. Prone)",
    "Badge Icone Grandi (Alto Contrasto)": "Large Icon Badges (High Contrast)",
    "Anelli + Badge Icone": "Rings + Icon Badges",
    "🎯 Token Selezionato": "🎯 Selected Token",
    "Nome (es. Goblin 1)": "Name (e.g. Goblin 1)",
    "Nome visualizzato nella targhetta": "Name displayed on nameplate",
    "Nome: A tutti": "Name: To All",
    "Nome: Solo DM": "Name: DM Only",
    "Nome: Spento": "Name: Hidden",
    "Visibilità Targhetta Nome": "Nameplate Visibility",
    "Taglia: Media (1x1)": "Size: Medium (1x1)",
    "Taglia: Grande (2x2)": "Size: Large (2x2)",
    "Taglia: Enorme (3x3)": "Size: Huge (3x3)",
    "Taglia: Mastod. (4x4)": "Size: Gargantuan (4x4)",
    "👤 Solo DM": "👤 DM Only",
    "📋 Duplica": "📋 Duplicate",
    "Duplica Token (Ctrl+D)": "Duplicate Token (Ctrl+D)",
    "👁️ Visib.": "👁️ Visib.",
    "Mostra/Nascondi ai Giocatori": "Show/Hide to Players",
    "⚔️ + Iniz.": "⚔️ + Init.",
    "Aggiungi al Tracker di Iniziativa": "Add to Initiative Tracker",
    "🗑️ Del": "🗑️ Del",
    "Elimina Token": "Delete Token",
    "❤️ Punti Ferita": "❤️ Hit Points",
    "Visibile a giocatori": "Visible to players",
    "Mostra barra/alone di salute ai giocatori": "Show health bar/aura to players",
    "HP Attuali": "Current HP",
    "HP Massimi (0=Off)": "Max HP (0=Off)",
    "Att": "Cur",
    "Max": "Max",
    "± Danno": "± Damage",
    "Valore Danno (-) o Cura (+)": "Damage (-) or Healing (+) value",
    "Applica Danno": "Apply Damage",
    "Applica Cura": "Apply Healing",
    "🛡️ CA:": "🛡️ AC:",
    "Classe Armatura (CA)": "Armor Class (AC)",
    "CA": "AC",
    "📜 Scheda Mostro": "📜 Monster Statblock",
    "Apri o Assegna Scheda Statistiche Mostro": "Open or Assign Monster Statblock",
    "✨ Aura:": "✨ Aura:",
    "Attiva/Disattiva Aura": "Toggle Aura",
    "Colore Aura": "Aura Color",
    "Seleziona Condizione": "Select Condition",
    "Lingua tag": "Tag Language",
    "Colore Condizione": "Condition Color",
    "Aggiungi Condizione": "Add Condition",
    "+ Aggiungi": "+ Add",
    "Compendio & Scheda Mostro": "Monster Compendium & Statblock",
    "📥 Incolla JSON": "📥 Paste JSON",
    "📥 Incolla JSON / Testo": "📥 Paste JSON / Text",
    "Incolla JSON Creatura": "Paste Creature JSON",
    "Incolla JSON o Testo Scheda Creatura/PNG": "Paste Creature/NPC JSON or Statblock Text",
    "📥 Incolla JSON o Testo Scheda (Mostro / PNG)": "📥 Paste JSON or Statblock Text (Monster / NPC)",
    "🖼️ Immagine Token (Opzionale)": "🖼️ Token Artwork (Optional)",
    "👹 Mostro": "👹 Monster",
    "🎭 PNG": "🎭 NPC",
    "Importa Scheda": "Import Statblock",
    "Incolla JSON da 5e.tools": "Paste Creature JSON",
    "Cerca": "Search",
    "🔍 Cerca mostro in inglese (es. Goblin, Dragon, Wolf)...": "🔍 Search monster in English (e.g. Goblin, Dragon, Wolf)...",
    "Cerca un mostro dalla barra in alto oppure seleziona un token che ha già una scheda associata.": "Search for a monster from the top bar or select a token that already has an assigned statblock.",
    "👁️ Invia tiri ai Giocatori": "👁️ Send rolls to Players",
    "Se disattivato, i tiri della scheda saranno segreti per il DM": "If unchecked, statblock rolls will be secret for the DM",
    "Clicca sui dadi 🎲 per tirare": "Click on dice 🎲 to roll",
    "⚡ Assegna al Token Selezionato": "⚡ Assign to Selected Token",
    "Assegna questa scheda e i relativi PV/CA al token selezionato": "Assign this statblock and its HP/AC to selected token",
    "♟️ Crea Token": "♟️ Create Token",
    "Crea direttamente un nuovo token sulla mappa": "Spawn a new token on the map directly",
    "📥 Incolla JSON &amp; Token Creatura": "📥 Paste JSON &amp; Creature Token",
    "📥 Incolla JSON &amp; Token da 5e.tools": "📥 Paste JSON &amp; Creature Token",
    "📥 Incolla JSON & Token Creatura": "📥 Paste JSON & Creature Token",
    "📥 Incolla JSON & Token da 5e.tools": "📥 Paste JSON & Creature Token",
    "Copia il mostro in formato JSON (": "Copy the creature in JSON format (",
    "Copia il mostro in formato JSON da 5e.tools (": "Copy the creature in JSON format (",
    ") e incollalo qui sotto:": ") and paste it below:",
    "🖼️ Token Ufficiale Mostro (Opzionale)": "🖼️ Monster Token Artwork (Optional)",
    "Click destro sull'immagine &rarr;": "Right-click the image &rarr;",
    "Click destro sul token in 5e.tools &rarr;": "Right-click the image &rarr;",
    "\"Copia immagine\"": "\"Copy image\"",
    "e premi": "and press",
    "qui.": "here.",
    "✕ Rimuovi": "✕ Remove",
    "Importa Mostro": "Import Monster",
    "Regia & Campagna (P2P, Salvataggi, Party)": "Director & Campaign (P2P, Saves, Party)",
    "Mappa & Griglia (Caricamento, Griglia, Visuale)": "Map & Grid (Upload, Grid, Viewport)",
    "Zone d'Effetto (AoE / Magie)": "Areas of Effect (AoE / Spells)",
    "Audio & Soundboard": "Audio & Soundboard",
    "Libreria Token (Cartella & In Mappa)": "Token Library (Folder & On Map)",
    "Chat Log": "Chat Log",
    "Dadi": "Dice",
    "🎲 Pannello Dadi": "🎲 Dice Panel",
    "✕ Azzera": "✕ Reset",
    "Azzera tutti i dadi e modificatori": "Reset all dice and modifiers",
    "Tiro:": "Roll:",
    "Nessun dado": "No dice",
    "Modificatore:": "Modifier:",
    "Applica a:": "Apply to:",
    "Al Totale (Danno)": "To Total (Damage)",
    "A ciascun dado (Vantaggio)": "To each die (Advantage)",
    "Mostra ai giocatori": "Show to players",
    "🎲 Tira Dadi": "🎲 Roll Dice",
    "Tira Dadi": "Roll Dice",
    "🔄 Ripeti (": "🔄 Reroll (",
    "💬 Storico Tiri": "💬 Roll Log",
    "Invia a Player": "Send to Players",
    "Se attivo, i tiri (anche delle schede mostri) sono inviati ai giocatori. Se disattivato, restano segreti per il DM.": "If checked, rolls (including monster statblocks) are sent to players. If unchecked, they stay secret to the DM.",
    "Chiudi Chat": "Close Chat",
    "⚙️ Regia & Campagna": "⚙️ Director & Campaign",
    "🖥️ Apri Schermo Giocatori (TV / 2° Monitor)": "🖥️ Open Players Screen (TV / 2nd Monitor)",
    "🌐 Multiplayer Online (P2P)": "🌐 Online Multiplayer (P2P)",
    "Avvia Stanza": "Start Room",
    "Apri Schermo Online": "Open Online Screen",
    "Apri Schermo Giocatore per test o accesso con codice stanza": "Open Player Screen for testing or room code access",
    "📁 Campagne & Salvataggi": "📁 Campaigns & Saves",
    "Cartella:": "Folder:",
    "📂 Tutte le Mappe": "📂 All Maps",
    "📄 Senza Cartella (Generale)": "📄 Uncategorized (General)",
    "+ Cartella": "+ Folder",
    "Crea nuova cartella nella campagna": "Create new folder in campaign",
    "Elimina la cartella selezionata (le mappe verranno spostate in Senza Cartella)": "Delete selected folder (maps will be moved to Uncategorized)",
    "Mappe della Campagna:": "Campaign Maps:",
    "Mappa attualmente in uso": "Currently loaded map",
    "Carica": "Load",
    "📁 Sposta in...": "📁 Move to...",
    "Sposta la mappa selezionata in un'altra cartella": "Move selected map to another folder",
    "Elimina Mappa": "Delete Map",
    "👥 Gestione Party": "👥 Party Management",
    "Nome PG": "PC Name",
    "🗺️ Mappa & Griglia": "🗺️ Map & Grid",
    "Visuale & Permessi:": "Viewport & Permissions:",
    "Nascondi Barra Giocatori (Modalit&agrave; TV)": "Hide Player Toolbar (TV Mode)",
    "Blocca Movimento Mappa Master": "Lock DM Map Movement",
    "Blocca Mappa Player": "Lock Player Map",
    "Carica Immagini:": "Upload Images:",
    "📁 Carica Mappa dal PC": "📁 Load Map from PC",
    "🖼️ Condividi Immagine Handout": "🖼️ Share Handout Image",
    "Regolazione Griglia:": "Grid Calibration:",
    "Dimensione Celle (px):": "Cell Size (px):",
    "Bagliore Griglia:": "Grid Glow:",
    "Bianco": "White",
    "Nero": "Black",
    "🪄 Zone d'Effetto (AoE)": "🪄 Areas of Effect (AoE)",
    "Crea Nuova Sagoma:": "Create New Template:",
    "Quadrato (Cubo)": "Square (Cube)",
    "Spessore (solo Linea)": "Thickness (Line only)",
    "+ Crea AoE al Centro Mappa": "+ Create AoE at Map Center",
    "Modifica AoE Selezionata:": "Edit Selected AoE:",
    "↩️ Ruota sx": "↩️ Rotate left",
    "Ruota dx ↪️": "Rotate right ↪️",
    "🎵 Audio & Soundboard": "🎵 Audio & Soundboard",
    "🎵 Audio Partita": "🎵 Session Audio",
    "🎶 Ambiente (BGM)": "🎶 Ambience (BGM)",
    "🔊 Soundboard (SFX)": "🔊 Soundboard (SFX)",
    "In riproduzione:": "Now playing:",
    "Nessuna": "None",
    "Nessuna traccia": "No track",
    "▶ Riprendi": "▶ Resume",
    "⏸ Pausa": "⏸ Pause",
    "⏹ Stop": "⏹ Stop",
    "Loop Continuo": "Continuous Loop",
    "Volume DM:": "DM Volume:",
    "Nuova Traccia:": "New Track:",
    "Nome traccia (es. Taverna)...": "Track name (e.g. Tavern)...",
    "Incolla URL audio (mp3/ogg)...": "Paste audio URL (mp3/ogg)...",
    "📁 Scegli File PC": "📁 Choose PC File",
    "▶ Suona": "▶ Play",
    "+ Playlist": "+ Playlist",
    "Playlist Ambientale:": "Ambient Playlist:",
    "Clicca un pad per riprodurlo all'istante a tutti i giocatori!": "Click a pad to instantly play it to all players!",
    "Aggiungi Effetto Rapido:": "Add Quick Effect:",
    "Nome effetto (es. 💣 Trappola)...": "Effect name (e.g. 💣 Trap)...",
    "Incolla link audio...": "Paste audio link...",
    "+ Aggiungi Pad": "+ Add Pad",
    "♟️ Libreria Token": "♟️ Token Library",
    "📁 Cartella PC": "📁 PC Folder",
    "Seleziona una cartella dal PC (legge tutte le immagini all'interno)": "Select a folder from PC (reads all images inside)",
    "🖼️ File Singoli": "🖼️ Single Files",
    "Seleziona uno o più file immagine": "Select one or more image files",
    "Svuota la libreria personale salvata": "Clear saved personal library",
    "🗺️ In Mappa": "🗺️ On Map",
    "📁 Libreria": "📁 Library",
    "📖 Mostri": "📖 Monsters",
    "Apri Compendio Mostri & Schede Statistiche": "Open Monster Compendium & Statblocks",
    "🔍 Cerca token per nome...": "🔍 Search token by name...",
    "Nessun token trovato. Carica una cartella o apri una mappa con pedine!": "No tokens found. Load a folder or open a map with tokens!",
    "💡 Trascina qui file o cartelle dal PC per caricarli subito": "💡 Drag & drop files or folders here to load immediately",
    "Piazzamento nuovi token:": "New token placement:",
    "👁️ Visibile": "👁️ Visible",
    "🙈 Nascosto": "🙈 Hidden",
    "PV Full": "Full HP",
    "Punti Ferita predefiniti a piena vita (lascia vuoto per disattivare la barra dei PV)": "Default full Hit Points (leave empty to disable HP bar)",
    "Mostra Strumenti (Tasto H)": "Show Tools (Key H)",
    "Chiudi Barra Strumenti (Tasto H)": "Close Toolbar (Key H)",
    "Crea Quadrato": "Create Square",
    "Audio & Volume": "Audio & Volume",
    "🔇 Muta Audio": "🔇 Mute Audio",
    "Volume Personale (max 20%):": "Personal Volume (max 20%):",
    "⚠️ Clicca qui per abilitare l'audio nel browser!": "⚠️ Click here to enable audio in the browser!",
    "Dimensione / Lunghezza": "Size / Length",
    "Immagine trasmessa ai giocatori!": "Image transmitted to players!",
    "Immagine rimossa per tutti.": "Image closed for all.",
    "Carica prima un'immagine!": "Please load an image first!",
    "Combattimento avviato!": "Combat started!",
    "Ordine aggiornato!": "Order updated!",
    "👁️ Tiri mostri/dadi: PUBBLICI (inviati ai giocatori)": "👁️ Monster/dice rolls: PUBLIC (sent to players)",
    "🔒 Tiri mostri/dadi: SEGRETI (visibili solo al DM)": "🔒 Monster/dice rolls: SECRET (DM only)",
    "Avvia prima l'iniziativa col tasto giallo in alto!": "Start initiative first with the yellow button at top!",
    "Seleziona almeno un token prima!": "Select at least one token first!",
    "Inserisci il valore di Iniziativa per il/i token selezionati:": "Enter the Initiative value for selected token(s):",
    "Seleziona o cerca prima un mostro!": "Search or select a monster first!",
    "Nessun mostro trovato": "No monsters found",
    "Errore durante la ricerca": "Search error",
    "Caricamento...": "Loading...",
    "Tavolo TV": "TV Tabletop",
    "Connessione in corso...": "Connecting...",
    "Errore di connessione. Verifica il codice stanza.": "Connection error. Check room code.",
    "Giocatore": "Player",
    "Master": "Master",
    "Nessuna traccia in riproduzione": "No track currently playing",
    "✅ Token acquisito pronto per la mappa!": "✅ Token acquired and ready for map!",
    "Trascina un'immagine o premi Ctrl+V per incollare l'immagine del token": "Drag an image or press Ctrl+V to paste token artwork",

    // --- Nuove traduzioni Beta 1.0 & Beta 1.1 ---
    "🎯 Token Selezionato": "🎯 Selected Token",
    "Gruppo": "Group",
    "➕ Assegna Player...": "➕ Assign Player...",
    "🔒 Solo DM (Revoca tutti)": "🔒 DM Only (Revoke all)",
    "👥 Tutti i Giocatori": "👥 All Players",
    "🔒 Controllo: Solo DM": "🔒 Control: DM Only",
    "Controllo impostato su: Solo DM": "Control set to: DM Only",
    "Controllo assegnato a tutti i giocatori": "Control assigned to all players",
    "Assegna il controllo a uno o più giocatori": "Assign control to one or more players",
    "Cancella i miei disegni a mano libera": "Clear my freehand drawings",
    "Attualmente Visibile ai Giocatori (Clicca per nascondere)": "Currently Visible to Players (Click to hide)",
    "Attualmente Nascosto ai Giocatori (Clicca per rendere visibile)": "Currently Hidden from Players (Click to reveal)",
    "Alcuni token sono nascosti: clicca per renderli TUTTI visibili!": "Some tokens are hidden: click to make ALL visible!",
    "📁 Cartella: Mostri": "📁 Folder: Monsters",
    "📁 Cartella: PNG": "📁 Folder: NPCs",
    "📁 Cartella: Personaggi": "📁 Folder: Characters (PCs)",
    "📁 Cartella: Vari": "📁 Folder: Misc",
    "Assegna cartella nella Libreria Token": "Assign folder in Token Library",
    "💾 In Libreria": "💾 To Library",
    "Salva questo token nella Libreria permanente sotto la cartella scelta": "Save this token to permanent Library under the chosen folder",
    "👹 Mostri": "👹 Monsters",
    "🧑 PNG": "🧑 NPCs",
    "🛡️ Personaggi": "🛡️ Characters",
    "🛡️ PG": "🛡️ PCs",
    "📦 Vari": "📦 Misc",
    "📂 Tutti": "📂 All",
    "Mostri": "Monsters",
    "PNG": "NPCs",
    "Personaggi": "Characters",
    "Vari": "Misc",
    "Cartella:": "Folder:",
    "Cartella assegnata:": "Assigned folder:",
    "Clicca per cambiare cartella": "Click to change folder",
    "Clicca per posizionare:": "Click to place:",
    "salvati in": "saved in",
    "salvati in Libreria": "saved to Library",
    "Cartella di destinazione per i nuovi token caricati": "Destination folder for newly uploaded tokens",
    "Nessun token trovato in questa cartella. Clicca sul badge cartella di un token per spostarlo!": "No tokens found in this folder. Click a token's folder badge to move it!",
    "💡 Trascina file dal PC o clicca il badge cartella (👹/🧑/🛡️/📦) su un token per spostarlo": "💡 Drag files from PC or click the folder badge (👹/🧑/🛡️/📦) on a token to move it",
    "🙈 Crea Invisibile": "🙈 Spawn Invisible",
    "Se attivato, il tasto Crea Token genera il token direttamente come invisibile ai giocatori": "If checked, Create Token spawns the token directly hidden from players",
    "🙈 Crea Token Invisibile": "🙈 Create Invisible Token",
    "Se spuntato, il token creato sarà invisibile ai giocatori finché non lo riveli": "If checked, the created token will be invisible to players until revealed",
    "♟️ Importa & Crea Token": "♟️ Import & Spawn Token",
    "Importa la scheda e crea subito il token sulla mappa": "Import statblock and immediately spawn token on map",
    "Carica la scheda nel Compendio": "Load statblock into Compendium",
    "⚔️ Tracker Iniziativa": "⚔️ Initiative Tracker",
    "📂 Raggruppa Simili": "📂 Group Similar",
    "Raggruppa automaticamente i token con lo stesso nome (es. Goblin 1..5) per mantenere la lista compatta": "Automatically group tokens with the same base name (e.g. Goblin 1..5) to keep the list compact",
    "entità": "entities",
    "0 entità": "0 entities",
    "HP Gruppo": "Group HP",
    "Modifica HP a tutto il gruppo (es. -10)": "Modify HP for the entire group (e.g. -10)",
    "Rimuovi tutto il gruppo dall'iniziativa": "Remove entire group from initiative",
    "Clicca per espandere/comprimere il gruppo": "Click to expand/collapse group",
    "🟢 Giocatore connesso:": "🟢 Player connected:",
    "🔄 Giocatore riconnesso:": "🔄 Player reconnected:",
    "🔴 Giocatore disconnesso:": "🔴 Player disconnected:",
    "🟢 Schermo Giocatore Locale connesso!": "🟢 Local Player Screen connected!",
    "♟️ Token creato:": "♟️ Token created:",
    "🙈 Token creato (Invisibile):": "🙈 Token created (Invisible):",
    "♟️ Creato token": "♟️ Created token",
    "🙈 Creato token INVISIBILE": "🙈 Created INVISIBLE token",
    "💾 Nuova mappa salvata:": "💾 New map saved:",
    "💾 Mappa salvata:": "💾 Map saved:",
    "🗺️ Mappa caricata:": "🗺️ Map loaded:",
    "🏰 Campagna": "🏰 Campaign",
    "Token salvati nella Campagna attiva (PG, PNG e creature della campagna)": "Tokens saved in active Campaign (PCs, NPCs & campaign creatures)",
    "Nessun token nella Campagna in questa cartella.": "No tokens in the Campaign for this folder.",
    "Rimuovi dai token della Campagna": "Remove from Campaign tokens",
    "Presente in mappa": "Present on map",
    "Clicca per mettere in campo (Full Vita) • Tasto destro per cambiare cartella": "Click to place on map (Full HP) • Right-click to change folder",
    "📜 Mostro": "📜 Monster",
    "🧙 Scheda PG": "🧙 PC Sheet",
    "🧙 Apri Scheda PG": "🧙 Open PC Sheet",
    "Apri Scheda Personaggio (PG)": "Open Character Sheet (PC)",
    "Apri o Importa Scheda Personaggio (PG)": "Open or Import Character Sheet (PC)",
    "Apri la Scheda del tuo Personaggio": "Open your Character Sheet",
    "Scheda Personaggio": "Character Sheet",
    "⚔️ Combattimento & Abilità": "⚔️ Combat & Skills",
    "✨ Incantesimi": "✨ Spells",
    "📜 Privilegi & Tratti": "📜 Features & Traits",
    "🎒 Inventario": "🎒 Inventory",
    "🔄 Aggiorna": "🔄 Update",
    "⚙️ Link": "⚙️ Link",
    "🔗 1. Apri Dati": "🔗 1. Open Data",
    "📋 2. Incolla Appunti": "📋 2. Paste Clipboard",
    "Nessun token ti è ancora stato assegnato dal Master sulla mappa!": "No token has been assigned to you by the GM on the map yet!"
};

const dynamicPatterns = [
    { re: /^🎯\s*(\d+)\s*Token Selezionati$/i, en: (m) => `🎯 ${m[1]} Selected Tokens` },
    { re: /^👁️\s*Misti\s*\((\d+\/\d+)\)$/i, en: (m) => `👁️ Mixed (${m[1]})` },
    { re: /^Rinomina tutti i\s*(\d+)\s*token\.\.\.$/i, en: (m) => `Rename all ${m[1]} tokens...` },
    { re: /^(\d+)\s*entità$/i, en: (m) => `${m[1]} entities` },
    { re: /^Revoca controllo a\s+(.+)$/i, en: (m) => `Revoke control from ${m[1]}` },
    { re: /^Controllo revocato a\s+(.+)$/i, en: (m) => `Control revoked from ${m[1]}` },
    { re: /^Controllo aggiunto a:\s+(.+)$/i, en: (m) => `Control added to: ${m[1]}` },
    { re: /^(\d+)\s*token resi VISIBILI ai giocatori!$/i, en: (m) => `${m[1]} tokens made VISIBLE to players!` },
    { re: /^(\d+)\s*token NASCOSTI ai giocatori!$/i, en: (m) => `${m[1]} tokens HIDDEN from players!` },
    { re: /^Duplicato\s+(.+)\s+\(Full PV\)!$/i, en: (m) => `Duplicated ${m[1]} (Full HP)!` },
    { re: /^Duplicati\s+(\d+)\s+token\s+\(Full PV\)!$/i, en: (m) => `Duplicated ${m[1]} tokens (Full HP)!` },
    { re: /^Aggiunti\s+(\d+)\s+token all'Iniziativa!$/i, en: (m) => `Added ${m[1]} tokens to Initiative!` },
    { re: /^Condizione applicata a\s+(\d+)\s+token!$/i, en: (m) => `Condition applied to ${m[1]} tokens!` },
    { re: /^Condizione rimossa da\s+(\d+)\s+token!$/i, en: (m) => `Condition removed from ${m[1]} tokens!` }
];

let currentLang = localStorage.getItem('vtt_lang') || 'it';

// Funzione globale helper per tradurre stringhe dinamiche
window.t = function(key) {
    if (!key) return key;
    if (currentLang === 'en') {
        if (dict[key]) return dict[key];
        const clean = String(key).replace(/:$/, '').trim();
        if (dict[clean]) {
            return dict[clean] + (String(key).endsWith(':') ? ':' : '');
        }
        return translateText(String(key));
    }
    return key;
};

function translateText(original) {
    if (!original || typeof original !== 'string') return original;
    const trimmed = original.trim();
    if (trimmed === '' || trimmed.length <= 1) return original;
    if (/^[0-9\s.,:\-+*/\\()#%€$!?|><=_]+$/.test(trimmed)) return original;

    if (dict[trimmed]) return dict[trimmed];

    // Prova togliendo i due punti finali
    const clean = trimmed.replace(/:$/, '').trim();
    if (dict[clean]) {
        return dict[clean] + (trimmed.endsWith(':') ? ':' : '');
    }

    // Prova decodificando eventuali entità HTML
    if (trimmed.includes('&')) {
        const temp = document.createElement('textarea');
        temp.innerHTML = trimmed;
        const decoded = temp.value;
        if (dict[decoded]) return dict[decoded];
    }

    // Prova pattern dinamici con numeri/nomi
    for (let i = 0; i < dynamicPatterns.length; i++) {
        const m = trimmed.match(dynamicPatterns[i].re);
        if (m) return dynamicPatterns[i].en(m);
    }

    return trimmed;
}

function translateNode(node) {
    if (node.nodeType === 3) { // Text node
        const text = node.nodeValue.trim();
        if (text === '' || text.length <= 1) return;
        if (/^[0-9\s.,:\-+*/\\()#%€$!?|><=_]+$/.test(text)) return;
        
        // Se il testo è stato modificato dinamicamente via JS, aggiorna originalText
        if (!node.originalText || (node.lastTranslatedText && text !== node.lastTranslatedText && text !== node.originalText)) {
            node.originalText = text;
        }
        
        let targetText = node.originalText; // Default Italiano
        
        if (currentLang === 'en') {
            targetText = translateText(node.originalText);
        }
        
        node.lastTranslatedText = targetText;
        if (node.nodeValue.trim() !== targetText) {
            const leading = node.nodeValue.match(/^\s*/)[0];
            const trailing = node.nodeValue.match(/\s*$/)[0];
            node.nodeValue = leading + targetText + trailing;
        }
    } else if (node.nodeType === 1) { // Element node
        if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;

        // Traduzione per elementi <option>
        if (node.tagName === 'OPTION') {
            const optText = node.textContent.trim();
            if (optText) {
                if (!node.originalOptionText || (node.lastTranslatedOptionText && optText !== node.lastTranslatedOptionText && optText !== node.originalOptionText)) {
                    node.originalOptionText = optText;
                }
                let target = node.originalOptionText;
                if (currentLang === 'en') target = translateText(node.originalOptionText);
                node.lastTranslatedOptionText = target;
                if (node.textContent.trim() !== target) {
                    node.textContent = target;
                }
            }
        }
        
        // Traduzione per placeholder
        if (node.hasAttribute('placeholder')) {
            const curPh = node.getAttribute('placeholder');
            if (!node.originalPlaceholder || (node.lastTranslatedPlaceholder && curPh !== node.lastTranslatedPlaceholder && curPh !== node.originalPlaceholder)) {
                node.originalPlaceholder = curPh;
            }
            let target = node.originalPlaceholder;
            if (currentLang === 'en') target = translateText(node.originalPlaceholder);
            node.lastTranslatedPlaceholder = target;
            if (curPh !== target) node.setAttribute('placeholder', target);
        }
        
        // Traduzione per title / tooltip
        if (node.hasAttribute('title')) {
            const curTitle = node.getAttribute('title');
            if (!node.originalTitle || (node.lastTranslatedTitle && curTitle !== node.lastTranslatedTitle && curTitle !== node.originalTitle)) {
                node.originalTitle = curTitle;
            }
            let target = node.originalTitle;
            if (currentLang === 'en') target = translateText(node.originalTitle);
            node.lastTranslatedTitle = target;
            if (curTitle !== target) node.setAttribute('title', target);
        }

        // Traduzione per input buttons / submit
        if (node.tagName === 'INPUT' && (node.type === 'button' || node.type === 'submit')) {
            if (!node.originalValue) node.originalValue = node.value;
            let target = node.originalValue;
            if (currentLang === 'en') target = translateText(node.originalValue);
            if (node.value !== target) node.value = target;
        }

        // Traduzione per elementi marcati con data-i18n
        if (node.hasAttribute('data-i18n')) {
            const key = node.getAttribute('data-i18n');
            if (!node.originalI18n) node.originalI18n = key;
            let target = node.originalI18n;
            if (currentLang === 'en') target = translateText(node.originalI18n);
            
            if (node.children && node.children.length > 0) {
                // Non distruggere elementi figli (es. input, icone) se marcato con data-i18n
                const textChild = Array.from(node.childNodes).find(n => n.nodeType === 3 && n.nodeValue.trim().length > 0);
                if (textChild) {
                    textChild.nodeValue = target;
                }
            } else if (node.textContent.trim() !== target) {
                node.textContent = target;
            }
        }

        // Ricorsione sui figli
        for (let child of node.childNodes) {
            translateNode(child);
        }
    }
}

function applyLanguage() {
    translateNode(document.body);
    
    const btn = document.getElementById('lang-toggle');
    if (btn) {
        btn.innerText = currentLang === 'it' ? '🇮🇹 IT' : '🇬🇧 EN';
        btn.title = currentLang === 'it' ? 'Lingua: Italiano (Clicca per Inglese)' : 'Language: English (Click for Italian)';
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'it' ? 'en' : 'it';
    localStorage.setItem('vtt_lang', currentLang);
    applyLanguage();
}

let isTranslating = false;
const observer = new MutationObserver((mutations) => {
    if (isTranslating) return;
    let shouldTranslate = false;
    for (let mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            shouldTranslate = true;
            break;
        }
    }
    if (shouldTranslate) {
        isTranslating = true;
        applyLanguage();
        setTimeout(() => { isTranslating = false; }, 50);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // Inserisci pulsante toggle lingua accanto al titolo in index.html
    const title = document.querySelector('#sidebar h2');
    if (title && !document.getElementById('lang-toggle')) {
        const btn = document.createElement('button');
        btn.id = 'lang-toggle';
        btn.style.marginTop = '10px';
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.padding = '6px';
        btn.style.background = '#333';
        btn.style.color = '#fff';
        btn.style.border = '1px solid #666';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '12px';
        btn.onclick = toggleLanguage;
        title.parentNode.insertBefore(btn, title.nextSibling);
    }
    
    // Inserisci pulsante in player.html
    const loginOverlay = document.getElementById('login-overlay');
    if (loginOverlay && !title && !document.getElementById('lang-toggle')) {
        const btn = document.createElement('button');
        btn.id = 'lang-toggle';
        btn.style.position = 'absolute';
        btn.style.top = '20px';
        btn.style.right = '20px';
        btn.style.padding = '6px 12px';
        btn.style.background = '#333';
        btn.style.color = '#fff';
        btn.style.border = '1px solid #ffcc00';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '12px';
        btn.onclick = toggleLanguage;
        loginOverlay.appendChild(btn);
    }

    applyLanguage();
    observer.observe(document.body, { childList: true, subtree: true });
});
