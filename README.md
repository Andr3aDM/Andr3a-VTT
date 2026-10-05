# 🎲 D&D P2P Virtual Tabletop (VTT)

Un Virtual Tabletop (Tavolo Virtuale) leggero, gratuito e senza server per giocare a Dungeons & Dragons e altri giochi di ruolo. Progettato per essere ospitato direttamente su GitHub Pages senza bisogno di alcun database o backend.

La comunicazione tra il Dungeon Master (DM) e i Giocatori avviene interamente in modalità **Peer-to-Peer (P2P)** tramite la tecnologia WebRTC (utilizzando PeerJS). 

---

## 🌟 Caratteristiche Principali
- **Zero Costi Server:** Hostalo gratuitamente (es. GitHub Pages). Nessun database da mantenere.
- **Connessione Diretta:** I giocatori si collegano direttamente al browser del DM tramite un Codice Stanza.
- **Ottimizzato per Touch & Desktop:** Supporto completo a mouse e schermi touch.
- **Nebbia di Guerra (Fog of War):** Il DM può oscurare la mappa e rivelarla gradualmente ai giocatori.
- **Tracker Iniziativa Integrato:** Gestione dei turni dinamica, con possibilità di nascondere i mostri segreti ai giocatori.
- **Magie e Aree di Effetto (AoE):** Coni, Sfere e Linee completamente ruotabili e scalabili in *Feet* (ft) o *Metri* (m).
- **Controllo Giocatori Autonomo:** Ogni giocatore può muovere la propria pedina, gestire la propria Aura (es. per il Paladino), disegnare, misurare e castare le proprie Magie AoE senza aspettare il DM.

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

## 🚀 Come Pubblicare su GitHub Pages
1. Fai un Fork o crea un nuovo Repository Pubblico su GitHub.
2. Fai l'Upload di tutti i file (`index.html`, `player.html`, cartella `js`, cartella `css`).
3. Vai in **Settings > Pages**.
4. Imposta *Source* su `Deploy from a branch` e seleziona il branch `main` (o `master`).
5. Salva. Dopo 2 minuti, il VTT sarà online all'indirizzo fornito da GitHub. Nessun server Node.js o database richiesto!
