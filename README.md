# App GDR - Manuale Completo del Master e del Giocatore

Benvenuti in **App GDR**, un Virtual Tabletop (VTT) leggero, reattivo e focalizzato sull'offrire strumenti essenziali e "Quality of Life" per giocare di ruolo online o al tavolo senza configurazioni complesse. Questo manuale vi spiegherà nel dettaglio ogni singola funzione presente.

---

## 🚀 1. Avvio e Modalità di Gioco
Il programma utilizza un sistema *Peer-to-Peer* (P2P). Questo significa che non ci sono server esterni o login da fare: il Master crea la stanza e i giocatori si collegano direttamente a lui.

- **Creare la stanza (Master):** Apri `index.html`. Nella sezione **Multiplayer Online (P2P)** apparirà il tuo "ID Stanza".
- **Invitare i Giocatori:** Condividi il link generato (cliccando sul pulsante di copia) con i tuoi giocatori. Loro apriranno quel link e inseriranno il loro nome per connettersi.
- **Modalità TV Locale:** Se stai giocando dal vivo attorno a un tavolo con uno schermo condiviso (es. TV), clicca su **Apri Schermo TV (Locale)**. Si aprirà una finestra Giocatore che si sincronizzerà istantaneamente col tuo pannello Master, senza usare la rete internet!

---

## 🗺️ 2. Gestione della Mappa e Griglia
La mappa è il fulcro del gioco.
- **Caricare una mappa:** Clicca su *Scegli File* nella sezione "Mappa & Griglia" per caricare un'immagine dal tuo PC.
- **Sincronizza Vista:** Selezionando questa casella, ovunque il Master inquadri la telecamera (zoom o spostamento), anche la visuale dei giocatori verrà forzata esattamente lì.
- **Blocca Mappa Player:** Se attivato, i giocatori non potranno più muovere la telecamera in autonomia, ma vedranno solo ciò che il Master decide di inquadrare.
- **Personalizzazione Griglia:** Puoi cambiare il colore delle linee della griglia (es. rosso scuro per le caverne, bianco per l'esterno) e l'intensità della luminosità per farla risaltare sullo sfondo.

---

## 😶‍🌫️ 3. Nebbia di Guerra (Fog of War)
Proteggi i segreti dei tuoi dungeon!
- **Copri tutto di Nebbia:** Appena caricata la mappa, puoi nascondere tutto ai giocatori con un click.
- **Aggiungi/Cancella Nebbia:** Usa questi strumenti dal menu per "scavare" nella nebbia o ripristinarla.
- **Pennello Personalizzabile:** Quando selezioni lo strumento Nebbia, appariranno le impostazioni per scegliere la forma del pennello (cerchio o quadrato) e la dimensione in pixel.

---

## 🧙‍♂️ 4. Tokens (Personaggi e Mostri)
- **Caricamento:** Puoi caricare immagini singole o intere cartelle. C'è anche una comoda barra di ricerca per trovare subito il mostro che ti serve.
- **Spawn sulla mappa:** Seleziona "Media", "Grande", "Enorme" ecc., scegli se il mostro è subito "Visibile" o "Nascosto" e clicca un token nella galleria per piazzarlo.
- **Controlli del Token Selezionato:**
  - **Assegnare a un Giocatore:** Nel menu a tendina "Proprietario" puoi assegnare un token a un giocatore connesso. Solo quel giocatore potrà muoverlo!
  - **Punti Ferita (HP):** Inserisci HP massimi e attuali. I giocatori vedranno lo stato di salute cambiare in tempo reale.
  - **Visibilità HP:** Puoi decidere se i giocatori possono vedere la vita di quel particolare token.
  - **Aura:** Puoi attivare un'aura colorata (es. Spiriti Guardiani). Puoi deciderne il raggio (in piedi o metri) e il colore. L'aura seguirà automaticamente il token.

---

## 🎨 5. Stile Visivo di PV e Condizioni
Nella sezione **Tokens**, il Master può decidere l'aspetto estetico globale:
- **Stile PV Token:** 
  - *Barra:* La classica barra orizzontale.
  - *Alone:* Il token si tingerà con un alone in trasparenza (verde, giallo, rosso) in base ai danni subiti, senza ingombrare la mappa.
  - *Barra + Alone:* Entrambi.
- **Stile Condizioni Multiple:**
  Se a un token assegni più condizioni (es. Accecato e Avvelenato), puoi scegliere come visualizzarle:
  - *Anelli Concentrici:* Le condizioni si allargano a spirale attorno al bersaglio.
  - *Anello a Spicchi:* Un singolo anello elegante diviso nei vari colori delle condizioni.

---

## 📏 6. Strumenti Base e Strumenti Tattici
Il pannello di sinistra del DM è pieno di strumenti utilissimi:
- **Muovi/Seleziona:** Strumento base per interagire con i token.
- **Lazo:** Tieni premuto e trascina per selezionare più token contemporaneamente (puoi spostarli in blocco!).
- **Metro (Righello):** Trascina il mouse per misurare istantaneamente distanze in piedi/metri senza dover contare i quadretti.
- **Ping:** Tieni premuto a lungo (clic sinistro) in un punto vuoto della mappa per far apparire un "Ping" pulsante (un mirino colorato) visibile a tutti, utilissimo per dire "Guardate qui!".
- **Puntatore Laser:** Sostituisce il cursore con una linea a luce "Neon". Il tratto disegnato evapora seguendo esattamente la tua mano dopo 5 secondi. Perfetto per indicare percorsi complessi sulla mappa senza sporcarla. Il master ha il laser rosso, i giocatori colori casuali!
- **Pin Segreto (Note):** Il Master può cliccare sulla mappa per lasciare puntine invisibili ai giocatori, contenenti titoli e descrizioni (es. Trappole).
- **Disegna (Pubblico / Solo DM):** Strumenti a mano libera classici. Puoi pulire i disegni tramite gli appositi tasti.

---

## 📐 7. Zone d'Effetto (AoE / Magie)
Dimentica le misurazioni a mano! L'app possiede uno strumento millimetrico per creare Sagome di Magie:
- **Cono, Sfera, Linea, Quadrato.**
- **Dimensionamento Preciso:** Seleziona una zona creata; puoi modificarne l'estensione, l'angolazione (ruotandola comodamente in tempo reale) e, nel caso della Linea, puoi modificarne anche lo spessore (es. un "Muro di Fuoco" largo 5 ft ma lungo 60 ft).
- Anche i giocatori, dal loro pannello, hanno i bottoni rapidi per piazzare Coni, Sfere, Linee e Quadrati del colore che preferiscono!

---

## ⚔️ 8. Tracker dell'Iniziativa
Un mini-programma dentro al programma!
- Trascina il pannello Iniziativa dove vuoi. Clicca "+" per aggiungere i token selezionati sulla mappa all'Iniziativa, oppure usa "Aggiungi Entità Extra" per nemici nascosti.
- Inserisci il valore di Iniziativa per ciascuno. Puoi usare l'ordinamento automatico (`Sort`).
- Quando sei pronto, premi **Avvia Combattimento**. Si attiveranno i tasti **Prossimo Turno** e la visualizzazione del Turno cambierà dinamicamente.
- Sulla mappa, un indicatore pulsante apparirà sotto al token a cui tocca agire!
- Il Tracker può essere condiviso (o nascosto) sullo schermo dei giocatori in varie posizioni (In alto, A destra, ecc.).

---

## 🎲 9. Sistema di Dadi e Chat
Nella parte bassa (destra) dello schermo:
- Troverai due bottoni circolari: **Log** e **Dadi**.
- Aprendo i Dadi, hai una console rapida per tirare d4, d6, d8, d10, d12, d20, d100.
- Puoi inserire un Modificatore (+/-) fisso che verrà sommato automaticamente.
- **Privacy dei Tiri:** Se il Master tira un dado, il risultato appare *solo* nella sua chat (Tiro Nascosto). Se un Giocatore tira un dado dal suo PC o smartphone, il risultato viene letto in tempo reale sulle chat di *tutti i presenti*, incluso il Master, permettendo la massima condivisione!

---

## 🖼️ 10. Handout (Condivisione Immagini)
Il Master può mostrare indizi visivi ai giocatori (come una lettera, il ritratto di un PNG o un oggetto magico).
- Nella sezione "Immagine Handout", carica un'immagine.
- Premi **Mostra ai Giocatori**.
- L'immagine apparirà a tutto schermo per i giocatori. Il Master la vedrà in una piccola finestra ridimensionabile per capire cosa stanno guardando.
- Clicca **Chiudi Immagine (Per tutti)** per farla scomparire istantaneamente dagli schermi dei tuoi giocatori.

---

## 💾 11. Salvataggio e Campagne
Non perdere mai il tuo lavoro!
- Digita un nome nel campo **Nome Campagna** (es. "La Miniera Perduta") e clicca **Salva Campagna**.
- L'app salverà *tutto*: La mappa caricata, i token posizionati, i loro Punti Ferita e Condizioni, la Nebbia, le Zone d'Effetto e i disegni.
- Quando riaprirai l'app un altro giorno, ti basterà selezionare la tua Campagna dal menu a tendina e cliccare **Carica Campagna** per ritrovare la mappa esattamente come l'avevi lasciata!

---
Buone Avventure e tiri fortunati!
