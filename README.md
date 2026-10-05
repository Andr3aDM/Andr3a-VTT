# 🎲 D&D P2P Virtual Tabletop (VTT)

*🌍 [Italian Version Below / Versione Italiana in basso](#-versione-italiana)*

A lightweight, free, and serverless Virtual Tabletop designed for Dungeons & Dragons and other TTRPGs. Built to be hosted directly on GitHub Pages with no need for a backend or database.

Communication between the Dungeon Master (DM) and the Players is entirely **Peer-to-Peer (P2P)** via WebRTC technology (using PeerJS).

---

## 🌟 Main Features
- **Zero Server Costs:** No database to maintain.
- **Direct Connection:** Players connect directly to the DM's browser via a Room Code.
- **Touch & Desktop Optimized:** Full support for mice and touchscreens.
- **Fog of War:** The DM can obscure the map and gradually reveal it to players.
- **Integrated Initiative Tracker:** Dynamic turn management, with the ability to hide secret monsters from players.
- **Spells and Areas of Effect (AoE):** Cones, Spheres, and Lines fully rotatable and scalable in *Feet* (ft) or *Meters* (m).
- **Autonomous Player Control:** Each player can move their token, manage their Aura (e.g., for a Paladin), draw, measure, and cast their own AoE Spells without waiting for the DM.
- **Bilingual Interface:** Real-time translation switch (IT/EN) available in the app.

---

## 🧙‍♂️ Dungeon Master Guide (`index.html`)

The main page `index.html` is the DM's control panel.

### 1. Game Initialization
- **Load Map:** Click to load an image from your PC. The map will scale to fit the screen.
- **Room Code:** In the top right corner, you will find your Room Code (e.g., `DM_1234`). Share it with the players.
- **Connected Players:** You will see the list of players joining your room update in real-time.

### 2. Toolbar (Left)
- 🖐️ **Move/Ping (Hand):** Allows you to move tokens and AoE shapes. **Long press** anywhere on the map to generate a **Visual Ping** that all players will see.
- 🌫️ **Fog (Cloud):**
  - **Reveal:** Erase the fog (showing the map to players).
  - **Hide:** Re-apply the fog.
  - *Brush Size:* A slider to increase or decrease the brush radius.
- 📏 **Ruler:** Click and drag to measure distances on the map. A button allows switching the calculation from *Feet* to *Meters* and vice versa.
- ✏️ **Draw:** Freehand drawing on the map (visible to everyone).
- 📐 **AoE Spells:** Generate Areas of Effect (Cones, Spheres, Lines).
  - All spells created by the DM can **only** be manipulated by the DM.
  - You can temporarily hide them from players by unchecking "Visible to Players".

### 3. Token Management
When you add a token, clicking on it on the map will open the **Selected Token Panel**:
- Name, Hit Points (HP), and an identifying label for monsters (e.g., "Goblin A").
- You can assign the **Owner** by typing a connected player's name. Only they will be able to move that token.
- **Aura:** Activate a glowing circle around the token (useful for magical auras or torches).

### 4. Initiative Tracker
- Add characters/monsters. You can auto-roll dice ("Roll") or enter the value manually.
- The **Sort** button orders the turns.
- The **Next Turn** button advances the turn, highlighting the current character.
- Checkboxes allow you to keep monsters "Hidden" from players, or display the full Tracker on their screens.

---

## 🗡️ Player Guide (`player.html`)

Players must access the `player.html` page (provided via link by the DM).

### 1. Login
- **Online Mode:** Enter your Name and the Room Code provided by the DM to sync in real-time.
- **Offline Mode:** Useful if you are all playing around the same physical table and using a tablet/screen only as a shared digital map.

### 2. Player Tools
The bottom toolbar provides autonomous actions for the player:
- 🖐️ **Move / Interact:** Allows dragging their own Token.
  - **Ping:** Long press on the map to point out a spot to the DM and the party.
  - **Personal Aura:** A quick click (or tap) on their own Token opens the menu to toggle and adjust their magical/light Aura.
- ✏️ **Draw:** Freehand drawing with color selection.
- 📏 **Ruler:** Measure distances (ft/m) to plan tactics.
- 📐 **AoE Spells (Cone, Sphere, Line):**
  - Players can summon their own magical areas.
  - **Exclusive Ownership:** Spells created by the player will have a small **Center Handle** (dot) visible *only* to that player and the DM. Others won't be able to touch it.
  - **Edit Spell:** Dragging the handle moves the spell. **A single click on the handle** opens the Edit Menu to: enlarge/shrink the area (ft/m), change its color, **rotate it** 360°, or delete it once the spell ends.
  - *Note:* Players cannot interact in any way with tokens or spells owned by the DM or other players.

---

## 🛠️ Built With
- **HTML5 Canvas:** For rendering the map, tokens, drawings, and fog.
- **Vanilla JavaScript:** No external frameworks (React/Vue).
- **PeerJS:** WebRTC wrapper library handling P2P connections and low-latency binary/text data transmission.



<br><br>

---
---

# 🇮🇹 Versione Italiana

Un Virtual Tabletop (Tavolo Virtuale) leggero, gratuito e senza server per giocare a Dungeons & Dragons e altri giochi di ruolo. Progettato per essere ospitato direttamente su GitHub Pages senza bisogno di alcun database o backend.

La comunicazione tra il Dungeon Master (DM) e i Giocatori avviene interamente in modalità **Peer-to-Peer (P2P)** tramite la tecnologia WebRTC (utilizzando PeerJS). 

---

## 🌟 Caratteristiche Principali
- **Zero Costi Server:** Nessun database da mantenere.
- **Connessione Diretta:** I giocatori si collegano direttamente al browser del DM tramite un Codice Stanza.
- **Ottimizzato per Touch & Desktop:** Supporto completo a mouse e schermi touch.
- **Nebbia di Guerra (Fog of War):** Il DM può oscurare la mappa e rivelarla gradualmente ai giocatori.
- **Tracker Iniziativa Integrato:** Gestione dei turni dinamica, con possibilità di nascondere i mostri segreti ai giocatori.
- **Magie e Aree di Effetto (AoE):** Coni, Sfere e Linee completamente ruotabili e scalabili in *Feet* (ft) o *Metri* (m).
- **Controllo Giocatori Autonomo:** Ogni giocatore può muovere la propria pedina, gestire la propria Aura (es. per il Paladino), disegnare, misurare e castare le proprie Magie AoE senza aspettare il DM.
- **Interfaccia Bilingue:** Traduzione istantanea (IT/EN) disponibile all'interno dell'app.

---

## 🧙‍♂️ Guida per il Dungeon Master (`index.html`)

La pagina principale `index.html` è la cabina di regia del DM. 

### 1. Inizializzazione della Partita
- **Carica Mappa:** Clicca per caricare un'immagine dal tuo PC. La mappa si adatterà allo schermo.
- **Codice Stanza:** In alto a destra troverai il tuo Codice Stanza (es. `DM_1234`). Comunicalo ai giocatori.
- **Giocatori Connessi:** Vedrai la lista dei giocatori che entrano nella tua stanza aggiornarsi in tempo reale.

### 2. Barra degli Strumenti (Sinistra)
- 🖐️ **Muovi/Ping (Mano):** Ti permette di spostare i token e le forme AoE. **Tieni premuto** (click prolungato) in un punto qualsiasi della mappa per generare un **Ping visivo** che tutti i giocatori vedranno.
- 🌫️ **Nebbia (Nuvola):**
  - **Rivela:** Cancella la nebbia (mostrando la mappa ai giocatori).
  - **Nascondi:** Ricrea la nebbia.
  - *Regola Pennello:* Uno slider per ingrandire o rimpicciolire l'area di effetto del pennello.
- 📏 **Metro:** Clicca e trascina per misurare le distanze sulla mappa. Un pulsante permette di switchare il calcolo da *Feet* a *Metri* e viceversa.
- ✏️ **Disegna:** Disegno libero sulla mappa (visibile a tutti).
- 📐 **Magie AoE:** Genera Aree di Effetto (Coni, Sfere, Linee).
  - Tutte le magie create dal DM sono manipolabili **solo** dal DM.
  - Puoi nasconderle temporaneamente ai giocatori togliendo la spunta a "Visibile ai Giocatori".

### 3. Gestione Token (Pedine)
Quando aggiungi un token, cliccandolo sulla mappa aprirai il **Pannello Token** per gestirlo:
- Nome, Punti Vita (HP), e un'etichetta identificativa per i mostri (es. "Goblin A").
- Puoi assegnare il **Proprietario (Owner)** inserendo il nome di un giocatore connesso. Solo lui potrà muovere quella pedina.
- **Aura:** Attiva un cerchio luminoso attorno al token (utile per auree magiche o torce).

### 4. Tracker dell'Iniziativa
- Aggiungi i personaggi/mostri. Puoi tirare i dadi in automatico ("Roll") o inserire il valore a mano.
- Il tasto **Sort** mette in ordine i turni.
- Il tasto **Next** fa avanzare il turno, illuminando il personaggio corrente.
- Le spunte ti permettono di mantenere "Nascosti" i mostri ai giocatori, oppure di mostrare il Tracker completo sui loro schermi.

---

## 🗡️ Guida per i Giocatori (`player.html`)

I giocatori devono accedere alla pagina `player.html` (fornita tramite link dal DM).

### 1. Login
- **Modalità Online:** Inserisci il tuo Nome e il Codice Stanza fornito dal DM per sincronizzarti in tempo reale.
- **Modalità Offline:** Utile se state giocando tutti attorno allo stesso tavolo e usi un tablet/schermo solo come mappa digitale condivisa.

### 2. Strumenti del Giocatore
La toolbar in basso offre le azioni autonome del giocatore:
- 🖐️ **Muovi / Interagisci:** Permette di trascinare il proprio Token. 
  - **Ping:** Tieni premuto a lungo sulla mappa per segnalare un punto al DM e al gruppo.
  - **Aura Personale:** Cliccando (o tappando) brevemente sul proprio Token, si apre il menù per accendere e regolare la propria Aura magica/luminosa.
- ✏️ **Disegna:** Disegno a mano libera con scelta del colore.
- 📏 **Metro:** Misura le distanze (ft/m) per pianificare tattiche.
- 📐 **Magie AoE (Cono, Sfera, Linea):**
  - I giocatori possono evocare le proprie aree magiche.
  - **Privilegio di Proprietà:** Le magie create dal giocatore avranno un piccolo **Maniglione Centrale** (pallino) visibile *solo* a quel giocatore e al DM. Gli altri non potranno toccarlo.
  - **Modifica Magia:** Trascinando il pallino la magia si sposta. **Cliccando una volta sul pallino** si apre il Menù di Modifica per: allargare/stringere l'area (ft/m), cambiarne il colore, **ruotarla** a 360°, o cancellarla a incantesimo terminato.
  - *Nota:* I giocatori non possono interagire in alcun modo con i token o le magie di proprietà del DM o degli altri giocatori.

---

## 🛠️ Tecnologie Utilizzate
- **HTML5 Canvas:** Per il rendering della mappa, dei token, dei disegni e della nebbia.
- **Vanilla JavaScript:** Nessun framework esterno (React/Vue).
- **PeerJS:** Libreria wrapper per WebRTC che gestisce le connessioni P2P e l'invio dei dati binari/testuali a bassa latenza.

