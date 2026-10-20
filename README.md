# App GDR / Tabletop VTT - Master & Player Comprehensive Manual
*Manuale Completo del Master e del Giocatore*

---

## 📖 Table of Contents / Indice dei Contenuti

- [Part I: English Manual](#part-i-english-manual)
  - [1. Introduction & Architecture](#1-introduction--architecture)
  - [2. Getting Started & Multiplayer Modes](#2-getting-started--multiplayer-modes)
  - [3. Map & Grid System](#3-map--grid-system)
  - [4. Fog of War (Dynamic Masking)](#4-fog-of-war-dynamic-masking)
  - [5. Token Management & Token Library](#5-token-management--token-library)
  - [6. Health Bar Capsule & Dynamic Auras](#6-health-bar-capsule--dynamic-auras)
  - [7. Status Conditions & Display Styles](#7-status-conditions--display-styles)
  - [8. Basic & Tactical DM Tools](#8-basic--tactical-dm-tools)
  - [9. Area of Effect (AoE / Spell Shapes)](#9-area-of-effect-aoe--spell-shapes)
  - [10. Initiative Tracker](#10-initiative-tracker)
  - [11. Monster Compendium & 5e.tools Integration](#11-monster-compendium--5etools-integration)
  - [12. Virtual Dice Roller & Chat Log](#12-virtual-dice-roller--chat-log)
  - [13. Visual Handout Image Sharing](#13-visual-handout-image-sharing)
  - [14. Audio, Ambient Music & Procedural Soundboard](#14-audio-ambient-music--procedural-soundboard)
  - [15. Campaign, Map Folders & Storage Management](#15-campaign-map-folders--storage-management)
  - [16. Controls & Keyboard Shortcuts Reference](#16-controls--keyboard-shortcuts-reference)
- [Parte II: Manuale in Italiano](#parte-ii-manuale-in-italiano)
  - [1. Introduzione e Architettura](#1-introduzione-e-architettura)
  - [2. Avvio e Modalità di Gioco (P2P e TV Locale)](#2-avvio-e-modalit-di-gioco-p2p-e-tv-locale)
  - [3. Gestione Mappa e Griglia](#3-gestione-mappa-e-griglia)
  - [4. Nebbia di Guerra (Fog of War)](#4-nebbia-di-guerra-fog-of-war)
  - [5. Gestione Token e Libreria Pedine](#5-gestione-token-e-libreria-pedine)
  - [6. Barra dei Punti Ferita (Capsula) e Auree Mobili](#6-barra-dei-punti-ferita-capsula-e-auree-mobili)
  - [7. Condizioni e Stili Visivi](#7-condizioni-e-stili-visivi)
  - [8. Strumenti Base e Tattici del Master](#8-strumenti-base-e-tattici-del-master)
  - [9. Zone d'Effetto (AoE / Sagome Incantesimi)](#9-zone-deffetto-aoe--sagome-incantesimi)
  - [10. Tracker dell'Iniziativa](#10-tracker-delliniziativa)
  - [11. Compendio Mostri e Integrazione 5e.tools](#11-compendio-mostri-e-integrazione-5etools)
  - [12. Lanciatore di Dadi e Registro Chat](#12-lanciatore-di-dadi-e-registro-chat)
  - [13. Condivisione Immagini Handout](#13-condivisione-immagini-handout)
  - [14. Audio, Musica d'Ambiente e Soundboard Procedurale](#14-audio-musica-dambiente-e-soundboard-procedurale)
  - [15. Gestione Campagne, Cartelle Mappe e Salvataggi](#15-gestione-campagne-cartelle-mappe-e-salvataggi)
  - [16. Tabella Scorciatoie da Tastiera e Controlli Rapidi](#16-tabella-scorciatoie-da-tastiera-e-controlli-rapidi)

---

# Part I: English Manual

## 1. Introduction & Architecture
**APP TABLETOP (Andr3a VTT)** is a lightweight, high-performance, browser-native Virtual Tabletop engineered specifically for tabletop role-playing games (such as *Dungeons & Dragons 5e*, *Pathfinder*, and other d20 systems). 

### Key Architectural Strengths
- **100% Client-Side:** No external server, database installation, Node.js daemon, or registration accounts required. Run it directly by opening `index.html` (DM Dashboard) or `player.html` (Player Screen) in modern web browsers (Chrome, Edge, Firefox, Safari).
- **Multi-Layered HTML5 Canvas Engine:** Decoupled canvas layers (Map background, Grid, AoE Shapes, Tokens, Public Drawings, Private Drawings, Fog of War, and UI overlay) guarantee fluid 60 FPS rendering without visual stutter.
- **IndexedDB Persistence:** High-capacity local browser storage saves entire campaigns, maps, token graphics, fog masks, and audio configurations without data loss between sessions.

---

## 2. Getting Started & Multiplayer Modes

The application supports two distinct networking models that can also be used simultaneously (hybrid mode).

### 2.1 Online Multiplayer (Peer-to-Peer WebRTC)
Connect remote players across the internet without intermediate relay servers:
1. Open `index.html`.
2. Click the floating cyan button **⚙️ (Director & Campaign)** at the bottom-right corner.
3. In the **Online Multiplayer (P2P)** card, click **Start Online Room** (`Avvia Stanza`).
4. An alphanumeric Room Code is generated (e.g., `ABCD-1234`).
5. Share the generated link or room code with your players.
6. When players open `player.html`, they enter their nickname and the Room Code (or connect automatically via `player.html?room=ABCD-1234`), then click **Connect Online**.
7. The DM Console instantly displays connected players in the party status list.

### 2.2 Local TV / Second Monitor Mode (Zero-Latency Offline)
Ideal for in-person tabletop sessions where a TV or projector displays the player view:
1. In the **⚙️ Director & Campaign** panel, click **🖥️ Open Players Screen (TV / 2nd Monitor)**.
2. A new browser window opens directly in TV Mode (`player.html?mode=tv`).
3. Communication uses the browser's native `BroadcastChannel('vtt_channel')`, achieving instant, zero-latency synchronization without requiring internet access.
4. Drag the player window onto your secondary TV or tabletop screen and press `F11` for true borderless fullscreen immersion.

---

## 3. Map & Grid System

All map and grid controls are housed inside the floating green button **🗺️ (Map & Grid)**.

### 3.1 Loading Maps
- Click **📁 Load Map from PC** (`Carica Mappa dal PC`) to select any `.jpg`, `.png`, `.webp`, or `.svg` graphic.
- The canvas automatically scales and centers the image within your viewport.

### 3.2 Viewport & Permissions Synchronization
- **Sync Players View (Pan/Zoom):** When checked, any camera pan or zoom executed by the DM is mirrored on all player screens in real-time.
- **Lock Player Map:** Prevents players from scrolling or panning the map freely, locking their camera strictly to the DM's presentation.
- **Lock DM Map Movement:** Prevents accidental map drags while operating tokens or tactical tools on the DM screen.
- **Hide Player Toolbar (TV Mode):** Remotely hides player bottom toolbars, creating a clean display on tabletop monitors.

### 3.3 Grid Calibration
- **Cell Size (px):** Adjust the grid size smoothly via the slider or numerical input (range: 20px to 300px, default: 100px).
- **Grid Line Color:** Customizable color picker (e.g., subtle dark lines for snowy fields, stark white lines for subterranean dungeons).
- **Grid Glow:** Select `None`, `White`, or `Black` glow outlines to ensure grid visibility across high-contrast artwork.
- **Align Grid Tool (`Allinea Griglia`):** Activate this tool on the left sidebar to drag and shift the grid coordinates until they align with battlemap tile artwork.

---

## 4. Fog of War (Dynamic Masking)

Protect dungeon secrets with dynamic masking:
- **Cover All with Fog (`Copri tutto di Nebbia`):** Instantly blankets the entire map in an opaque black shroud.
- **Remove All Fog (`Rimuovi tutta la Nebbia`):** Clears the fog completely.
- **Erase Fog Tool (`Cancella Nebbia`):** Revealing tool. Drag across the map to carve transparent sightlines through the fog.
- **Add Fog Tool (`Aggiungi Nebbia`):** Concealing tool. Restores darkness over previously revealed corridors.
- **Fog Brush Controls:**
  - **Brush Shape:** Switch between **Circle** (for organic caves and torches) and **Square** (for rectangular dungeon rooms).
  - **Brush Size:** Adjustable radius/width in pixels (e.g., 50px to 400px) with real-time hovering brush preview.
- Fog alterations compress to Base64 masks and synchronize across WebRTC/BroadcastChannel.

---

## 5. Token Management & Token Library

### 5.1 Token Library Panel (`♟️ Libreria Token`)
Click the dark teal button **♟️** in the bottom floating dock or click **♟️ Library & New Tokens** in the sidebar:
- **PC Folder Upload (`📁 Cartella PC`):** Uses HTML5 directory picking to load an entire folder of monster and NPC portraits in one click.
- **Single Files (`🖼️ File Singoli`):** Pick one or multiple individual image files.
- **Drag & Drop:** Drag files or entire folders directly onto the library window.
- **Library Tabs:**
  - `🗺️ On Map`: Lists all tokens deployed on the current board.
  - `📁 Library`: Global token repository persistent across maps.
  - `📖 Monsters`: Quick shortcut opening the 5e Compendium.
- **Token Search:** Filter tokens instantly by typing character or creature names.

### 5.2 Deployment & Defaults
Configure token parameters before placement:
- **Size Multiplier:** Medium (1x1), Large (2x2), Huge (3x3), Gargantuan (4x4).
- **Initial Visibility:** Visible (`👁️`) or Hidden (`🙈`).
- **Default HP:** Pre-fill maximum hit points.

### 5.3 Selected Token Controls
Selecting a token displays its property panel:
- **Name & Visibility:** Edit the creature's title. Choose nameplate display: `All` (visible to everyone), `DM Only` (rendered with a distinct purple border visible only to the Master), or `Hidden`.
- **Smart Auto-Numbering:** Deploying multiple tokens of the same base type (e.g., Goblin) automatically assigns sequential names: *Goblin 1*, *Goblin 2*, *Goblin 3*.
- **Ownership Assignment:** Assign a token to a specific connected player. Only that player (and the DM) can move the token.
- **Duplication (`📋 Duplica` / `Ctrl+D`):** Clones the token at an offset position, preserving artwork, maximum HP, AC, conditions, and attached 5e statblock while auto-incrementing its numbering.
- **Visibility Toggle (`👁️ Visib.`):** Toggle token visibility on player screens. Unrevealed tokens render semi-transparently on the DM canvas.
- **Add to Initiative (`⚔️ + Iniz.`):** Prompts for an initiative score and transfers the token directly into the Initiative Tracker.
- **Delete (`🗑️ Del` / Delete key):** Removes the token from the board.

---

## 6. Health Bar Capsule & Dynamic Auras

### 6.1 Pill-Shaped Health Capsule
- **Dynamic Width & Geometry:** The health bar renders as a modern, compact capsule anchored snugly at the base of the token. Its width adapts dynamically to the numerical text value to maximize artwork visibility.
- **Progressive Rounded Fill:** Health depletion is clipped smoothly within rounded border radiuses.
- **Color Coding:**
  - Cyan: 100% full health
  - Green: Above 66% health
  - Yellow: 33% to 66% health (bloodied)
  - Red: Under 33% health (critical)
  - Grey with Skull (`💀`): 0 HP or dead
- **Quick Math Modifiers:** Type a number in `± Danno` and press **`-`** (Damage) or **`+`** (Heal).
- **Armor Class (`🛡️ CA`):** Dedicated AC numeric input rendered in the initiative tracker and token stats.
- **Player Display Modes (`Stile PV Token`):**
  - `Bar`: Classic horizontal pill capsule.
  - `Aura`: Immersive ambient color tint directly overlaid onto token artwork based on damage.
  - `Both`: Combination of pill capsule and damage tint.

### 6.2 Dynamic Mobile Aura
- Check **✨ Aura** to project an area around the token (e.g., *Spirit Guardians*, *Paladin Aura of Protection*).
- **Radius & Units:** Configurable size in feet (`ft`) or meters (`m`).
- **Color Picker:** Choose any color. Auras render with a 20% transparent fill and a solid 2px outline that follows token movement.

---

## 7. Status Conditions & Display Styles

APP TABLETOP provides 15 standard conditions: *Blinded, Charmed, Grappled, Deafened, Poisoned, Incapacitated, Invisible, Paralyzed, Petrified, Unconscious, Prone, Frightened, Stunned, Restrained, Exhaustion*.

Select language (**IT / EN**), pick a custom color, and click **+ Add**.

### Condition Visual Styles (`Stile Condizioni Multiple`)
1. **Pills with Name (`Pillole con Nome`):** High-contrast dark pills with Title Case text labels and colored borders, positioned inside the token border above the health bar and below the nameplate.
2. **Concentric Rings (`Anelli Concentrici`):** Orbiting rings displaying curved radial text.
3. **Segmented Ring (`Anello Singolo a Spicchi`):** A single outer ring divided into colored segments with unified condition labels.
4. **Large High-Contrast Badges (`Badge Icone Grandi`):** Pure white circular badges floating over the token bearing high-resolution condition emoji.
5. **Both (`Anelli + Badge Icone`):** Combines concentric text rings with floating icon badges.

---

## 8. Basic & Tactical DM Tools

The left toolbar contains DM tactical tools:
- **Move / Select (`Muovi/Seleziona`):** Drag tokens and AoE shapes. When released, tokens snap to the grid. Holding left-click for 800ms triggers a pulsating ping.
- **Lasso Multi-Select (`Seleziona (Lazo)`):** Drag a rectangular marquee over multiple tokens to select them simultaneously for group movement. Hold `Shift` to add/remove individual tokens from the group.
- **Ruler (`Metro ft/m`):** Drag across the map to display a live dashed measurement line indicating distance in feet (`ft`), meters (`m`), and grid squares (`sq`).
- **Ping System:** Long-press (800ms) on any empty spot on the map to trigger an expanding neon beacon visible on all player screens.
- **Laser Pointer (`Puntatore Laser`):** Emits a luminous neon trail that follows your mouse or stylus, evaporating after 5 seconds. The DM draws with a distinctive crimson beam; players have vibrant personal/random colors.
- **Secret Pins (`Pin Segreto DM`):** Click anywhere on the map to drop invisible DM pins. Selecting a pin opens a panel for secret notes, trap DC triggers, and hidden treasure descriptions.
- **Freehand Drawings:**
  - `Draw (All)`: Public red pencil visible to everyone.
  - `Draw (DM Only)`: Private yellow pencil visible exclusively on the DM screen.
  - Quick cleanup via `Clear Draw (Pub)` and `Clear Draw (DM)`.

---

## 9. Area of Effect (AoE / Spell Shapes)

The orange button **🪄 (AoE / Spell Zones)** manages spell templates:
- **Auto-Opening Inspector:** Clicking any AoE shape on the map with the *Move* tool opens the AoE inspector panel automatically.
- **Supported Shapes:**
  - **Circle / Sphere / Cylinder:** Configurable radius in feet or meters.
  - **Cone:** Spreads from an origin point at a 53-degree angle.
  - **Line:** Configurable length AND independent width/thickness (ideal for *Wall of Fire* or *Lightning Bolt*).
  - **Square / Cube:** Configurable side length.
- **Rotation Controls:** Rotate clockwise/counterclockwise using the panel buttons or the player slider (0° to 360°).
- **Player Placement:** Players can spawn their own AoE templates using the spell icons on their toolbar.

---

## 10. Initiative Tracker

Click the golden **⚔️ Initiative Tracker** button to open the floating management panel:
- **Adding Combatants:**
  - Select tokens on the map and click **`⚔️ + Iniz.`** (prompts for the roll value).
  - Auto-imports the persistent party list.
  - Click **`+ Add Extra Entity`** for lair actions or reinforcements.
- **Sorting:** Click **Start Combat** (`Avvia Combattimento`) or **Sort/Update** (`Riordina/Aggiorna`) to sort descending by initiative score.
- **Combat Progression:**
  - Advance turns with **`Next Turn ▶`** or reverse with **`◀ Previous`**.
  - **Active Turn Highlight:** A green pulsating ring highlights the active creature's token directly on the battlemap.
  - **In-Tracker Health Math:** Edit HP directly in the tracker row: type `+10` or `-15` and press Enter to adjust token health and update the health bar.
  - Shows Armor Class (`🛡️ CA`) badges next to names.
- **Player Sharing & Docking:** Check **Show to Players** and pick docking: `Top (Horizontal)`, `Bottom (Horizontal)`, `Left (Vertical)`, or `Right (Vertical)`.

---

## 11. Monster Compendium & 5e.tools Integration

The compendium window (**📜 Compendio & Scheda Mostro**) offers monster statblocks and one-click dice rolling.

### 11.1 Online Search & Link Parsing
- Type English creature names (e.g. *Goblin, Adult Red Dragon*) to query the online Open5e SRD database.
- Paste a 5e.tools URL directly into the search bar (e.g. `https://5e.tools/bestiary.html#aarakocra%20skirmisher_xmm`); the app extracts the clean creature name and runs the search automatically.

### 11.2 5e.tools JSON & Token Art Import
Click **📥 Paste JSON** (`Incolla JSON`):
1. Copy creature data from 5e.tools using *"Copy as JSON"*.
2. Paste into the text area.
3. **Tag Cleaning Engine (`clean5eToolsText`):** Automatically cleans proprietary markup tags:
   - `{@atk mw}` $\rightarrow$ *Melee Weapon Attack:*
   - `{@h}` $\rightarrow$ *Hit:*
   - `{@hit 5}` $\rightarrow$ *+5 to hit*
   - `{@damage 2d6+3}` $\rightarrow$ *2d6+3*
   - `{@dc 14}` $\rightarrow$ *DC 14*
4. **Token Art Drag & Drop or Clipboard Paste:** Right-click the token image in 5e.tools, choose *"Copy Image"*, and press **`Ctrl+V`** inside the import modal. You can also drag-and-drop or select a file from disk.

### 11.3 Interactive 1-Click Rolls
All statblock values are interactive buttons:
- **Ability Checks & Saving Throws:** Click stats (STR, DEX, etc.) or saving throw badges to roll 1d20 + modifier.
- **Attack Rolls:** Click `🎲 +X to hit` to roll the attack.
- **Damage Rolls:** Click `🎲 XdY+Z` to roll damage.
- Results output to the chat log with creature name, action title, roll breakdown, and critical markers.

### 11.4 Public vs Secret DM Rolls
- Checkbox **`👁️ Send rolls to Players`** (`Invia tiri ai Giocatori`) is synchronized across the chat header, the statblock footer, and the dice panel.
- When enabled, player screens receive the roll in their chat.
- When disabled, rolls remain private to the DM screen, styled in purple with the marker `(🔒 Segreto DM)`.

### 11.5 Token Spawning & Assignment
- **`⚡ Assign to Selected Token`:** Transcribes the monster's name, HP, AC, and statblock onto the active token.
- **`♟️ Create Token`:** Instantly spawns a new token on the canvas using the creature's art, size, and statistics.

---

## 12. Virtual Dice Roller & Chat Log

Open the floating **🎲 Dice** and **💬 Chat** panels from the bottom-right dock.

### 12.1 Dice Console
- **Dice Types:** d4, d6, d8, d10, d12, d20, d100.
- **Dice Stacking:** Click dice buttons to build a pool (e.g., 2d6 + 1d8). Counters appear as yellow badges. Right-click a button to decrement.
- **Modifiers (`+/-`):** Add flat bonuses or penalties.
- **Modifier Application Mode:**
  - `To Total`: Sums the bonus once to the overall result (standard damage).
  - `To Each Die`: Adds the modifier to every individual die rolled (for advantage/disadvantage or simultaneous skill checks).
- **Reroll (`🔄 Ripeti`):** Repeat the last configured roll with one click.
- **Critical Rolls:**
  - Natural 20: Green border with `★ Natural 20! ★` banner.
  - Natural 1: Red border with `⚠ Natural 1! ⚠` banner.

---

## 13. Visual Handout Image Sharing

Share visual handouts (letters, NPC portraits, quest maps, relics) with your players:
1. In the **🗺️ Map & Grid** panel, click **🖼️ Share Handout Image** (`Condividi Immagine Handout`).
2. Select any image from your computer.
3. The DM Handout window opens with a preview. Click **Transmit to Players** (`Trasmetti ai Giocatori`).
4. The image appears on all player screens as an overlay with preserved aspect ratios.
5. Click **Close for All** (`Chiudi per Tutti`) to dismiss it from player screens.

---

## 14. Audio, Ambient Music & Procedural Soundboard

The purple button **🎵 (Audio & Soundboard)** controls the audio engine.

### 14.1 Background Music & Atmosphere (BGM)
- **Built-in Ambient Tracks:** Taverna, Forest, Dungeon, Rain, Storm, Battle, and more.
- **Custom Streams & Uploads:** Paste any direct audio link (`.mp3`, `.ogg`) or pick a file from your hard drive (`📁 Scegli File PC`).
- **Controls:** Play, Pause, Resume, Stop, and Continuous Loop toggle.
- **Custom Playlists:** Click `+ Playlist` to save audio setups.

### 14.2 Zero-Bandwidth Procedural Soundboard (SFX)
Generates real-time sound effects via the browser's native Web Audio API oscillators and noise buffers—functioning completely offline:
- ⚔️ **Sword Clash**
- 💥 **Explosion**
- ⚡ **Thunder / Lightning**
- ✨ **Magic Shimmer**
- 🔔 **Temple Bell**
- 🦁 **Beast Roar**
- 🎺 **Victory Fanfare**
- 🚪 **Creaky Door**

Custom audio pads can also be added via file uploads or web URLs.

### 14.3 Player Audio Independence
- Players have their own **🔊 Audio** panel on their toolbar.
- Each player controls their personal volume (capped at a safe 20% ceiling) or toggles **Mute** without altering audio for the rest of the table.

---

## 15. Campaign, Map Folders & Storage Management

All campaign and map files are managed in the **⚙️ Director & Campaign** panel.

### 15.1 Campaign Storage
- **Save / New Campaign:** Create dedicated campaigns for different adventures.
- **JSON Export / Import:** Export entire campaigns (maps, tokens, fog masks, drawings, audio playlists) into a portable `.json` file for backups or moving to another PC.

### 15.2 Map Organization & Folders
- **Folder Management:** Organize maps into folders (e.g., *Level 1 - Upper Keep*, *Caves*, *Town*).
- **Map Slot Controls:**
  - `Load`: Loads the selected map onto the canvas.
  - `Save`: Overwrites the active map slot.
  - `Save New`: Saves the current canvas as a new map slot.
  - `Move to...`: Relocates a map to another subfolder.
  - `Delete Map`: Removes the map from storage.

---

## 16. Controls & Keyboard Shortcuts Reference

| Shortcut / Action | Scope | Description |
| :--- | :--- | :--- |
| **Left Click + Drag** | Canvas / Move | Moves tokens, AoE templates, or draws fog/strokes. |
| **Middle Click / Right Click + Drag** | Canvas | Pans the camera view across the battlemap. |
| **Mouse Wheel** | Canvas | Zooms in and out centered on the cursor position. |
| **Long Left-Click (800ms)** | Move Tool | Triggers an expanding neon ping at that position. |
| **`Ctrl + D`** | Tokens | Duplicates selected tokens with auto-incremented numbering. |
| **`Shift + Left Click`** | Selection | Adds or removes tokens from multi-token selection. |
| **Right Click on Dice Button** | Dice Panel | Decrements the selected quantity of that die type. |
| **`H` Key** | Player View | Shows or hides the player floating bottom toolbar. |
| **`F11` Key** | Browser | Toggles true fullscreen mode (ideal for TV screens). |

---

# Parte II: Manuale in Italiano

## 1. Introduzione e Architettura
**APP TABLETOP (Andr3a VTT)** è un Virtual Tabletop leggero, reattivo e utilizzabile direttamente da browser, sviluppato specificamente per giochi di ruolo cartacei (come *D&D 5e*, *Pathfinder* e sistemi d20).

### Caratteristiche Architetturali
- **100% Client-Side:** Nessun server esterno, database da configurare, installazione di Node.js o account obbligatori. Si avvia semplicemente aprendo `index.html` (Console Master) o `player.html` (Schermo Giocatori) in qualsiasi browser moderno (Chrome, Edge, Firefox, Safari).
- **Motore Grafico HTML5 Canvas a Livelli Multipli:** Livelli separati per Sfondo Mappa, Griglia, Sagome AoE, Token, Disegni Pubblici, Disegni DM, Nebbia di Guerra e Overlay UI per garantire 60 FPS costanti senza rallentamenti.
- **Salvataggio Locale su IndexedDB:** Il database interno del browser memorizza intere campagne, mappe ad alta risoluzione, token, nebbia di guerra e tracce audio senza perdere modifiche tra le sessioni.

---

## 2. Avvio e Modalità di Gioco (P2P e TV Locale)

L'applicazione supporta due modalità di connessione utilizzabili anche in parallelo (modalità ibrida).

### 2.1 Multiplayer Online (Peer-to-Peer WebRTC)
Permette di giocare via internet connettendo direttamente Master e Giocatori:
1. Apri `index.html`.
2. Clicca sull'icona flottante azzurra **⚙️ (Regia & Campagna)** in basso a destra.
3. Nella sezione **Multiplayer Online (P2P)**, clicca **Avvia Stanza**.
4. Viene generato un Codice Stanza alfanumerico (es. `ABCD-1234`).
5. Condividi il codice o il link diretto con i tuoi giocatori.
6. I giocatori aprono `player.html`, inseriscono il proprio nome e il Codice Stanza (o usano il link `player.html?room=ABCD-1234`), quindi cliccano **Connetti Online**.
7. La console del Master mostrerà istantaneamente i giocatori connessi nella lista del party.

### 2.2 Modalità TV / Schermo Locale (Zero Latenza Offline)
Ideale per giocare dal vivo attorno al tavolo con un secondo monitor o un televisore:
1. Nel pannello **⚙️ Regia & Campagna**, clicca **🖥️ Apri Schermo Giocatori (TV / 2° Monitor)**.
2. Si aprirà una finestra calibrata per la visualizzazione TV (`player.html?mode=tv`).
3. La sincronizzazione sfrutta l'API nativa del browser `BroadcastChannel('vtt_channel')`, garantendo aggiornamenti istantanei a latenza zero anche in totale assenza di rete internet.
4. Trascina la finestra sul monitor secondario/TV e premi `F11` per la visualizzazione a tutto schermo.

---

## 3. Gestione Mappa e Griglia

Tutte le opzioni della mappa si trovano nel pulsante verde flottante **🗺️ (Mappa & Griglia)**.

### 3.1 Caricamento Mappe
- Clicca su **📁 Carica Mappa dal PC** per selezionare qualsiasi file `.jpg`, `.png`, `.webp` o `.svg`.
- Il sistema dimensiona e centra automaticamente la mappa nell'area di gioco.

### 3.2 Visuale e Permessi Sincronizzati
- **Sincronizza Vista Giocatori (Pan/Zoom):** Quando è attivo, ogni movimento di telecamera (zoom o trascinamento) eseguito dal Master viene replicato all'istante sullo schermo di tutti i giocatori.
- **Blocca Mappa Player:** Impedisce ai giocatori di spostare la telecamera in autonomia, fissando la loro inquadratura sulle coordinate decise dal Master.
- **Blocca Movimento Mappa Master:** Blocca il trascinamento accidentale della mappa durante l'utilizzo degli strumenti tattici del DM.
- **Nascondi Barra Giocatori (Modalità TV):** Nasconde la barra comandi dei giocatori, offrendo una mappa pulita per lo schermo sul tavolo.

### 3.3 Configurazione della Griglia
- **Dimensione Celle (px):** Regola la grandezza dei quadretti tramite slider o valore numerico (da 20px a 300px, default: 100px).
- **Colore Griglia:** Selettore cromatico (es. nero per mappe chiare, bianco o rosso scuro per dungeon bui).
- **Bagliore Griglia:** Scegli tra `Nessuno`, `Bianco` o `Nero` per evidenziare le linee su mappe complesse.
- **Strumento Allinea Griglia (`Allinea Griglia`):** Strumento della barra laterale che consente di trascinare la griglia per farla combaciare con le mattonelle della mappa.

---

## 4. Nebbia di Guerra (Fog of War)

Nascondi le aree inesplorate del dungeon:
- **Copri tutto di Nebbia:** Copre l'intera superficie della mappa con uno strato nero impenetrabile.
- **Rimuovi tutta la Nebbia:** Elimina completamente la nebbia.
- **Strumento Cancella Nebbia (`Cancella Nebbia`):** Pennello di scoperta. Trascina il mouse per rivelare corridoi e stanze ai giocatori.
- **Strumento Aggiungi Nebbia (`Aggiungi Nebbia`):** Pennello coprente. Ripristina l'oscurità nelle aree in cui i personaggi hanno perso la visuale.
- **Impostazioni Pennello Nebbia:**
  - **Forma:** Alterna tra **Cerchio** (per torce e grotte naturali) e **Quadrato** (per stanze rettangolari).
  - **Dimensione Pennello (px):** Regola il diametro/lato con anteprima visiva in tempo reale sotto il cursore.
- Tutte le modifiche vengono compresse in maschere Base64 e sincronizzate via P2P e broadcast locale.

---

## 5. Gestione Token e Libreria Pedine

### 5.1 Pannello Libreria Token (`♟️ Libreria Token`)
Clicca sull'icona circolare ottanio **♟️** in basso a destra o su **♟️ Libreria & Nuovi Token** nella barra laterale:
- **Carica Cartella PC (`📁 Cartella PC`):** Seleziona un'intera cartella dal tuo computer; il programma caricherà tutti i mostri e PNG in essa contenuti.
- **File Singoli (`🖼️ File Singoli`):** Importa immagini singole.
- **Trascina e Rilascia (Drag & Drop):** Trascina cartelle o file direttamente nel riquadro della libreria.
- **Tab della Libreria:**
  - `🗺️ In Mappa`: Elenco dei token posizionati sulla mappa attiva con conteggio.
  - `📁 Libreria`: Archivio globale delle pedine memorizzato su IndexedDB.
  - `📖 Mostri`: Scorciatoia per aprire il Compendio Mostri 5e.
- **Barra di Ricerca:** Filtra le pedine digitando il nome della creatura.

### 5.2 Piazzamento Nuovi Token
Imposta i parametri predefiniti prima dello schieramento:
- **Taglia:** Media (1x1), Grande (2x2), Enorme (3x3), Mastodontica (4x4).
- **Visibilità Iniziale:** Visibile (`👁️`) o Nascosto (`🙈`).
- **PV Pieni:** Definisci i punti ferita di partenza.

### 5.3 Controlli del Token Selezionato
Selezionando una pedina sulla mappa compaiono i suoi parametri:
- **Nome e Visibilità Targhetta:** Modifica il nome del token e la visibilità della targhetta: `A tutti`, `Solo DM` (evidenziata con un bordo viola riservato al Master) o `Spento`.
- **Numerazione Intelligente:** Schierando più copie della stessa creatura (es. Goblin), il sistema assegna automaticamente *Goblin 1*, *Goblin 2*, *Goblin 3*.
- **Assegnazione Giocatore:** Assegna il token a un giocatore connesso. Solo quel giocatore e il Master potranno muoverlo.
- **Duplica Token (`📋 Duplica` / `Ctrl+D`):** Clona istantaneamente il token preservando immagine, dimensioni, PV massimi, CA, condizioni e scheda 5e associata, incrementando la numerazione.
- **Visibilità (`👁️ Visib.`):** Mostra o nasconde la pedina ai giocatori. I token invisibili sono visualizzati semitrasparenti sul monitor del DM.
- **Aggiungi all'Iniziativa (`⚔️ + Iniz.`):** Richiede il tiro di iniziativa e trasferisce il token direttamente nel Tracker.
- **Elimina (`🗑️ Del` / Tasto Canc):** Rimuove la pedina dalla mappa.

---

## 6. Barra dei Punti Ferita (Capsula) e Auree Mobili

### 6.1 Barra della Vita a Capsula
- **Geometria Sagomata Compatta:** La barra dei PV è disegnata come una capsula orizzontale posizionata alla base del token, calibrata in larghezza sul testo dei punti ferita per non coprire l'illustrazione della pedina.
- **Riempimento Progressivo Arrotondato:** La salute cala linearmente all'interno degli angoli stondati della capsula.
- **Codice Colore:**
  - Celeste: 100% vita (piena salute)
  - Verde: Superiore al 66%
  - Giallo: Tra il 33% e il 66% (ferito)
  - Rosso: Inferiore al 33% (critico)
  - Grigio con Teschio (`💀`): 0 PV o inferiore (morto)
- **Modificatori Rapidi:** Inserisci un valore in `± Danno` e clicca **`-`** (Danno) o **`+`** (Cura).
- **Classe Armatura (`🛡️ CA`):** Campo dedicato visualizzato sia sul token che nel Tracker Iniziativa.
- **Stili di Visualizzazione per i Giocatori (`Stile PV Token`):**
  - `Solo Barra`: Classica capsula orizzontale.
  - `Solo Alone`: Tinta radiale colorata applicata direttamente sul disegno del token in base ai danni subiti.
  - `Barra + Alone`: Entrambe le visualizzazioni combinate.

### 6.2 Aura Mobile Dinamica
- Seleziona **✨ Aura** per proiettare un raggio d'effetto (es. *Spiriti Guardiani*, *Aura di Protezione del Paladino*).
- **Raggio e Unità:** Imposta la dimensione in piedi (`ft`) o metri (`m`).
- **Selettore Colore:** Scegli la tonalità desiderata. L'aura viene disegnata con riempimento trasparente al 20% e contorno pieno a 2px che segue fedelmente gli spostamenti del token.

---

## 7. Condizioni e Stili Visivi

L'applicazione include le 15 condizioni standard: *Accecato, Affascinato, Afferrato, Assordato, Avvelenato, Inabile, Invisibile, Paralizzato, Pietrificato, Privo di sensi, Prono, Spaventato, Stordito, Trattenuto, Sfinimento*.

Seleziona la lingua dei tag (**IT / EN**), scegli il colore e premi **+ Aggiungi**.

### Stili di Visualizzazione delle Condizioni (`Stile Condizioni Multiple`)
1. **Pillole con Nome (`Pillole con Nome`):** Targhette scure con testo in Title Case e bordo colorato ad alto contrasto, disposte all'interno del token sopra la barra dei PV e sotto la targhetta del nome.
2. **Anelli Concentrici (`Anelli Concentrici`):** Anelli orbitali che mostrano il nome della condizione in testo curvo rotante.
3. **Anello Singolo a Spicchi (`Anello Singolo a Spicchi`):** Un unico anello esterno suddiviso in spicchi colorati con i nomi delle condizioni concatenati.
4. **Badge Icone Grandi (`Badge Icone Grandi`):** Cerchi bianchi ad alto contrasto posizionati sopra il token con emoji ingrandite.
5. **Entrambi (`Anelli + Badge Icone`):** Combina anelli concentrici e badge icone.

---

## 8. Strumenti Base e Tattici del Master

La barra laterale sinistra racchiude tutti gli strumenti tattici:
- **Muovi/Seleziona:** Seleziona e sposta token e sagome AoE con snap alla griglia. Tenendo premuto per 800ms invia un ping pulsante.
- **Seleziona (Lazo):** Trascina un riquadro per selezionare più token contemporaneamente per spostarli in gruppo. Tieni premuto `Shift` per aggiungere o togliere singoli token dalla selezione.
- **Metro (ft/m):** Linea di misurazione tratteggiata che calcola in tempo reale distanza in piedi (`ft`), metri (`m`) e quadretti (`sq`).
- **Ping:** Tieni premuto il clic sinistro (800ms) su un punto vuoto della mappa per proiettare un mirino luminoso visibile a tutti i giocatori.
- **Puntatore Laser:** Traccia una linea a luce neon che segue il cursore ed evapora gradualmente dopo 5 secondi. Il Master disegna con raggio rosso, mentre i giocatori hanno colori neon vivaci.
- **Pin Segreto (DM):** Clicca sulla mappa per collocare puntine invisibili ai giocatori, dove annotare descrizioni segrete, trappole o dettagli di stanza.
- **Disegno a Mano Libera:**
  - `Disegna (Tutti)`: Tratto rosso pubblico condiviso con tutti.
  - `Disegna (Solo DM)`: Tratto giallo visibile unicamente sul monitor del Master.
  - Tasti rapidi di pulizia `Pulisci Dis. (Pub)` e `Pulisci Dis. (DM)`.

---

## 9. Zone d'Effetto (AoE / Sagome Incantesimi)

Il pulsante arancione **🪄 (Zone d'Effetto / Magie)** gestisce le sagome degli incantesimi:
- **Apertura Automatica del Pannello:** Cliccando una qualsiasi sagoma AoE sulla mappa con lo strumento *Muovi*, il pannello AoE si apre immediatamente per regolarne i parametri.
- **Sagome Disponibili:**
  - **Cerchio / Sfera / Cilindro:** Raggio modificabile in piedi o metri.
  - **Cono:** Si propaga dal vertice con angolo di apertura a 53 gradi.
  - **Linea:** Permette di impostare sia la lunghezza sia lo spessore/larghezza (es. *Muro di Fuoco* o *Fulmine*).
  - **Quadrato / Cubo:** Dimensione del lato configurabile.
- **Controlli di Rotazione:** Tasti dedicati per ruotare la sagoma a sinistra e a destra, oppure slider da 0° a 360° per i giocatori.
- **Creazione Lato Giocatore:** Anche i giocatori possono piazzare autonomamente sfere, coni, linee e cubi dalla propria barra strumenti.

---

## 10. Tracker dell'Iniziativa

Clicca sul pulsante giallo **⚔️ Tracker Iniziativa** in cima alla barra laterale per aprire il pannello di combattimento:
- **Aggiunta Partecipanti:**
  - Seleziona i token in mappa e clicca **`⚔️ + Iniz.`** (richiede il valore del tiro).
  - Importa automaticamente i membri del party salvati.
  - Clicca **`+ Aggiungi Entità Extra`** per pericoli ambientali o mostri non presenti come pedine.
- **Ordinamento:** Clicca **Avvia Combattimento** o **Riordina/Aggiorna** per ordinare i combattenti in ordine decrescente di iniziativa.
- **Gestione dei Turni:**
  - Avanza con **`Prossimo Turno ▶`** o torna indietro con **`◀ Precedente`**.
  - **Evidenziazione Turno Attivo:** Un anello verde pulsante appare direttamente sulla mappa sotto il token del personaggio a cui tocca agire.
  - **Modifica PV Diretta:** Modifica i punti ferita direttamente nella riga del tracker: digita `+10` o `-15` e premi Invio per aggiornare la salute del token e la sua barra vitale.
  - Icona della Classe Armatura (`🛡️ CA`) mostrata accanto al nome.
- **Condivisione e Posizionamento sui Monitor dei Giocatori:** Spunta **Mostra ai Giocatori** e seleziona il dock: `In Alto (Orizz.)`, `In Basso (Orizz.)`, `A Sinistra (Vert.)` o `A Destra (Vert.)`.

---

## 11. Compendio Mostri e Integrazione 5e.tools

La finestra compendio (**📜 Compendio & Scheda Mostro**) permette di consultare schede complete ed effettuare tiri di dado con un solo clic.

### 11.1 Ricerca Online e Riconoscimento Link
- Cerca qualsiasi mostro SRD in lingua inglese (es. *Goblin, Adult Red Dragon*).
- Se incolli nella barra un link diretto da 5e.tools (es. `https://5e.tools/bestiary.html#aarakocra%20skirmisher_xmm`), il programma estrae automaticamente il nome della creatura e avvia la ricerca.

### 11.2 Importazione JSON e Token da 5e.tools
Clicca su **📥 Incolla JSON**:
1. Copia i dati del mostro da 5e.tools tramite la funzione *"Copy as JSON"*.
2. Incolla il testo nell'area dedicata.
3. **Pulizia Automatica dei Tag (`clean5eToolsText`):** Vengono rimossi tutti i tag proprietari:
   - `{@atk mw}` $\rightarrow$ *Melee Weapon Attack:*
   - `{@h}` $\rightarrow$ *Hit:*
   - `{@hit 5}` $\rightarrow$ *+5 to hit*
   - `{@damage 2d6+3}` $\rightarrow$ *2d6+3*
   - `{@dc 14}` $\rightarrow$ *DC 14*
4. **Importazione Token via Appunti (`Ctrl+V`) o Drag & Drop:** Fai clic destro sul token in 5e.tools, seleziona *"Copia immagine"*, quindi premi **`Ctrl+V`** all'interno della finestra modale. Puoi anche trascinare un file immagine o caricarlo dal disco.

### 11.3 Tiri Interattivi con 1 Clic
Tutti i valori della scheda diventano bottoni cliccabili:
- **Caratteristiche e Tiri Salvezza:** Clicca sul punteggio (STR, DEX...) o sul modificatore del tiro salvezza per lanciare 1d20 + bonus.
- **Tiri per Colpire:** Clicca `🎲 +X to hit` per lanciare l'attacco.
- **Tiri per i Danni:** Clicca `🎲 XdY+Z` per lanciare la formula del danno.
- I risultati appaiono nella chat con il nome della creatura, l'azione eseguita, il dettaglio dei dadi e i critici evidenziati.

### 11.4 Tiri Pubblici o Segreti del Master
- La casella di controllo **`👁️ Invia tiri ai Giocatori`** è sincronizzata tra l'intestazione della chat, la scheda del mostro e il pannello dadi.
- Se attiva, i tiri vengono inviati ai giocatori.
- Se disattivata, i tiri restano segreti per il Master, colorati in viola e contrassegnati da `(🔒 Segreto DM)`.

### 11.5 Creazione e Assegnazione Token
- **`⚡ Assegna al Token Selezionato`:** Applica nome, PV, CA e scheda del mostro alla pedina selezionata in mappa.
- **`♟️ Crea Token`:** Spawna direttamente una nuova pedina sulla mappa con l'illustrazione, le dimensioni e i valori della creatura.

---

## 12. Lanciatore di Dadi e Registro Chat

Apri i pannelli flottanti **🎲 Dadi** e **💬 Chat** dall'angolo in basso a destra.

### 12.1 Console di Lancio
- **Tipi di Dadi:** d4, d6, d8, d10, d12, d20, d100.
- **Composizione del Pool:** Clicca sui dadi per aggiungerli al tiro (es. 2d6 + 1d8). Le quantità sono indicate da badge gialli. Fai clic destro sul dado per ridurne la quantità.
- **Modificatore fisso (`+/-`):** Aggiunge bonus o penalità al risultato.
- **Modalità di Applicazione del Modificatore:**
  - `Al Totale`: Somma il bonus al risultato complessivo (tipico per i danni).
  - `A ciascun dado`: Applica il modificatore a ogni singolo dado (utile per tiri con vantaggio/svantaggio o prove multiple).
- **Ripeti Tiro (`🔄 Ripeti`):** Rilancia l'ultima combinazione con un clic.
- **Successi e Fallimenti Critici:**
  - Naturale 20: Bordo verde con avviso `★ Naturale 20! ★`.
  - Naturale 1: Bordo rosso con avviso `⚠ Naturale 1! ⚠`.

---

## 13. Condivisione Immagini Handout

Mostra indizi grafici (lettere, mappe, ritratti, artefatti) direttamente ai giocatori:
1. Nel pannello **🗺️ Mappa & Griglia**, clicca su **🖼️ Condividi Immagine Handout**.
2. Seleziona un file immagine dal computer.
3. Si aprirà la finestra Handout del Master con l'anteprima. Clicca **Trasmetti ai Giocatori**.
4. L'immagine si apre a tutto schermo per i giocatori preservando le proporzioni.
5. Clicca **Chiudi per Tutti** per rimuoverla simultaneamente dagli schermi di tutti i presenti.

---

## 14. Audio, Musica d'Ambiente e Soundboard Procedurale

Il pulsante circolare viola **🎵 (Audio & Soundboard)** apre la regia sonora.

### 14.1 Musica di Sottofondo (BGM)
- **Atmosfere Predefinite:** Taverna, Foresta, Dungeon, Pioggia, Tempesta, Combattimento e altre tracce.
- **Link Web e File Personali:** Incolla stream audio web (`.mp3`, `.ogg`) o seleziona brani dal tuo computer (`📁 Scegli File PC`).
- **Controlli di Riproduzione:** Play, Pausa, Riprendi, Stop e selettore Loop Continuo.
- **Playlist Personalizzate:** Salva brani nella tua playlist tramite il tasto `+ Playlist`.

### 14.2 Soundboard a Sintesi Procedurale (100% Offline)
Genera effetti sonori all'istante tramite oscillatori Web Audio nativi del browser, senza scaricare file audio e funzionando anche offline:
- ⚔️ **Fendente di Spada**
- 💥 **Esplosione**
- ⚡ **Tuono / Fulmine**
- ✨ **Bagliore Magico**
- 🔔 **Rintocco di Campana**
- 🦁 **Ruggito di Bestia**
- 🎺 **Fanfara di Vittoria**
- 🚪 **Porta Cigolante**

Puoi aggiungere ulteriori pad audio personalizzati tramite file o URL.

### 14.3 Autonomia Audio per i Giocatori
- I giocatori hanno un pulsante **🔊 Audio** dedicato sulla propria barra strumenti.
- Ciascun giocatore può regolare il proprio volume individuale (con limite massimo di sicurezza al 20%) o attivare il tasto **Muto** senza interferire con gli altri giocatori o il Master.

---

## 15. Gestione Campagne, Cartelle Mappe e Salvataggi

La gestione completa di salvataggi e file si trova nel pannello **⚙️ Regia & Campagna**.

### 15.1 Gestione delle Campagne
- **Salva / Nuova Campagna:** Crea campagne indipendenti per ciascuna avventura.
- **Esporta / Importa JSON:** Esporta l'intera campagna (mappe, token, nebbia, disegni, playlist audio) in un file `.json` per backup o per trasferirla su un altro PC.

### 15.2 Organizzazione Mappe e Cartelle
- **Gestione Cartelle:** Crea cartelle di suddivisione (es. *Dungeon Livello 1*, *Città*, *Foresta*).
- **Pulsanti di Gestione Mappa:**
  - `Carica`: Carica la mappa selezionata sulla schermata.
  - `Salva`: Sovrascrive lo slot mappa attivo.
  - `Salva Nuova`: Salva lo stato attuale della plancia come nuova mappa nella campagna.
  - `Sposta in...`: Sposta una mappa da una cartella a un'altra.
  - `Elimina Mappa`: Cancella la mappa dallo storage.

---

## 16. Tabella Scorciatoie da Tastiera e Controlli Rapidi

| Tasto / Azione | Contesto | Effetto |
| :--- | :--- | :--- |
| **Clic Sinistro + Trascina** | Mappa / Muovi | Sposta token, sagome AoE o applica nebbia e disegni. |
| **Clic Centrale / Destro + Trascina** | Mappa | Trascina e sposta la telecamera (Pan). |
| **Rotella del Mouse** | Mappa | Zoom progressivo centrato sul puntatore. |
| **Clic Sinistro Prolungato (800ms)** | Strumento Muovi | Attiva un mirino luminoso (Ping) visibile a tutti. |
| **`Ctrl + D`** | Token | Duplica la pedina selezionata incrementandone il nome. |
| **`Shift + Clic Sinistro`** | Selezione | Aggiunge o rimuove singoli token dalla selezione multipla. |
| **Clic Destro sul Dado** | Pannello Dadi | Diminuisce la quantità di quel dado dal pool. |
| **Tasto `H`** | Schermo Giocatore | Mostra o nasconde la barra degli strumenti dei giocatori. |
| **Tasto `F11`** | Browser | Attiva/Disattiva la modalità a schermo intero (ideale per TV). |

---

*Buone avventure e tiri fortunati con APP TABLETOP!*
