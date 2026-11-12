# Andr3a VTT — Manuale d'uso / User Manual
*Tavolo virtuale leggero per giocare di ruolo dal vivo, su TV o online — Lightweight virtual tabletop for in-person, TV and online play*

Versione dell'interfaccia: **Beta 1.5** · Sistemi di gioco: **D&D 5ª Edizione** e **7th Sea 2ª Edizione**

---

## Indice / Table of Contents

**Parte I — Manuale in Italiano**
1. [Panoramica](#1-panoramica)
2. [Avvio e requisiti](#2-avvio-e-requisiti)
3. [Modalità di gioco](#3-modalità-di-gioco)
4. [Campagne, sistemi di gioco e mappe salvate](#4-campagne-sistemi-di-gioco-e-mappe-salvate)
5. [Mappa, griglia e visuale](#5-mappa-griglia-e-visuale)
6. [Strumenti del Master e nebbia di guerra](#6-strumenti-del-master-e-nebbia-di-guerra)
7. [Token pedine](#7-token-pedine)
8. [Punti Ferita, aure e condizioni](#8-punti-ferita-aure-e-condizioni)
9. [Zone d'effetto AoE](#9-zone-deffetto-aoe)
10. [Tracker dell'iniziativa](#10-tracker-delliniziativa)
11. [Dadi e chat](#11-dadi-e-chat)
12. [Immagini condivise handout](#12-immagini-condivise-handout)
13. [Audio musica ed effetti](#13-audio-musica-ed-effetti)
14. [Schermo del Giocatore](#14-schermo-del-giocatore)
15. [Sistema D&D 5e scheda PG e compendio mostri](#15-sistema-dd-5e-scheda-pg-e-compendio-mostri)
16. [Sistema 7th Sea 2e](#16-sistema-7th-sea-2e) — con la [guida passo passo all'iniziativa (Sequenza d'Azione)](#168-guida-pratica-la-prima-sequenza-passo-passo)
17. [Tablet e touchscreen](#17-tablet-e-touchscreen)
18. [Scorciatoie e comandi rapidi](#18-scorciatoie-e-comandi-rapidi)
19. [Salvataggi, prestazioni e limiti noti](#19-salvataggi-prestazioni-e-limiti-noti)

**Part II — English Manual**
1. [Overview](#1-overview)
2. [Getting started](#2-getting-started)
3. [Play modes](#3-play-modes)
4. [Campaigns, game systems and saved maps](#4-campaigns-game-systems-and-saved-maps)
5. [Map, grid and view](#5-map-grid-and-view)
6. [GM tools and fog of war](#6-gm-tools-and-fog-of-war)
7. [Tokens](#7-tokens)
8. [Hit points, auras and conditions](#8-hit-points-auras-and-conditions)
9. [Areas of effect](#9-areas-of-effect)
10. [Initiative tracker](#10-initiative-tracker)
11. [Dice and chat](#11-dice-and-chat)
12. [Shared images handouts](#12-shared-images-handouts)
13. [Audio music and sound effects](#13-audio-music-and-sound-effects)
14. [Player screen](#14-player-screen)
15. [D&D 5e system character sheet and monster compendium](#15-dd-5e-system-character-sheet-and-monster-compendium)
16. [7th Sea 2e system](#16-7th-sea-2e-system) — with the [step-by-step initiative guide (Action Sequence)](#168-practical-guide-your-first-sequence-step-by-step)
17. [Tablets and touchscreens](#17-tablets-and-touchscreens)
18. [Shortcuts and quick controls](#18-shortcuts-and-quick-controls)
19. [Saving, performance and known limits](#19-saving-performance-and-known-limits)

---

# Parte I — Manuale in Italiano

## 1. Panoramica

**Andr3a VTT** è un tavolo virtuale (VTT) che gira interamente nel browser: niente installazioni, niente server da gestire, niente account. È fatto di due pagine:

- **`index.html` — Console del Master (DM):** prepara le mappe, muove i token, gestisce nebbia, iniziativa, audio, schede e connessioni.
- **`player.html` — Schermo dei Giocatori:** è sia lo schermo da mostrare su una TV o un secondo monitor, sia il client che ogni giocatore apre sul proprio PC, tablet o telefono per giocare online.

### Come è organizzato

Il programma è diviso in due parti che restano separate di proposito:

- **Il core**, comune a tutti i giochi: mappe, griglia, token, movimento, nebbia, disegni, zone d'effetto, iniziativa, dadi, chat, audio, rete e salvataggi.
- **I sistemi di gioco**, ognuno con il proprio ecosistema di schede, regole e compendi. Oggi sono due: **D&D 5ª Edizione** e **7th Sea 2ª Edizione**. Ogni campagna è legata a un solo sistema (vedi cap. 4) e il programma apre automaticamente la scheda e il compendio giusti. Una modifica a un sistema non tocca l'altro né il core.

### Principi di progettazione

- **Leggero e fluido** anche su PC datati, tablet Android e TV: le mappe vengono ottimizzate al caricamento, le animazioni sono limitate a 30 fotogrammi al secondo e la mappa si sposta e si ingrandisce tramite la scheda grafica invece di essere ridisegnata.
- **Rete essenziale:** durante il gioco viaggiano solo messaggi molto piccoli (posizioni, stato dei token); immagini, schede e mappe vengono inviate a parte, una volta sola, a pezzi.
- **Bilingue:** l'interfaccia del core e di D&D è disponibile in italiano e inglese.

---

## 2. Avvio e requisiti

- **Browser:** Chrome, Edge o un altro browser moderno (consigliato Chrome). Funziona su Windows, Android, iPad e sulle smart TV/box con un browser moderno.
- **Avvio:** apri `index.html` per la console del Master. Lo schermo giocatori si apre dalla console stessa (cap. 3) oppure, per i giocatori online, dall'indirizzo `player.html` della stessa installazione.
- **Pubblicazione:** essendo composto solo da file statici, può essere ospitato su qualunque hosting statico (per esempio GitHub Pages) e aperto da qualsiasi dispositivo.
- **Connessione internet:** non serve per giocare in locale (Master + TV sullo stesso PC). Serve per: il gioco online (il collegamento iniziale tra i dispositivi passa da servizi pubblici gratuiti), la ricerca online nel compendio mostri D&D e le tracce musicali preimpostate in streaming.
- **Dati:** campagne, mappe e token vengono salvati nel browser del Master (IndexedDB). Restano sul dispositivo finché non cancelli i dati del browser: esporta regolarmente le campagne (cap. 4).

---

## 3. Modalità di gioco

### 3.1 Schermo TV / secondo monitor (locale, senza internet)

1. Nella console del Master apri il pannello **⚙️ Regia & Campagna** e premi **🖥️ Apri Schermo Giocatori (TV / 2° Monitor)**.
2. Si apre una nuova finestra con lo schermo giocatori in modalità TV: trascinala sulla TV o sul secondo monitor e mettila a schermo intero.
3. Le due finestre comunicano direttamente all'interno dello stesso browser, senza rete e senza ritardi.

La modalità TV mostra la mappa così come la vedono i giocatori (nebbia completamente opaca, token nascosti invisibili). Con **Nascondi Barra Giocatori (Modalità TV)** (pannello Mappa & Griglia) lo schermo resta pulito, senza pulsanti.

Dalla schermata di accesso dello schermo giocatori è disponibile anche **Usa Schermo Locale (Offline)**: apre un giocatore locale con nome, collegato al Master dello stesso browser.

### 3.2 Multiplayer online (peer-to-peer)

**Lato Master**
1. Seleziona la campagna. Nel riquadro **🌐 Multiplayer Online (P2P)** il campo **Codice Campagna** mostra il codice fisso di quella campagna: la prima volta ne viene proposto uno casuale (formato `ABCD-1234`), ma puoi scriverne uno tuo (per esempio `STRAHD-2026`, da 6 a 24 lettere o cifre) e confermare con Invio, oppure generarne uno nuovo con 🎲. Il codice è salvato nella campagna e viaggia con l'esportazione; cambiarlo impedisce l'accesso a chi conosce solo quello vecchio.
2. Premi **Avvia Stanza**: la stanza si apre sempre con il Codice Campagna, quindi i giocatori usano lo stesso codice in ogni sessione. Se il codice è ancora occupato dalla sessione precedente, il programma riprova da solo per qualche decina di secondi; se è occupato da un'altra stanza, ti chiede di cambiarlo. **Apri Schermo Online** apre uno schermo giocatore già collegato alla stanza, utile per provare.
3. Durante la sessione la selezione della campagna è bloccata (**🔒 Campagna Bloccata**), così nessuno riceve per errore i dati di un'altra campagna.
4. L'elenco **giocatori connessi** mostra chi è collegato; il pulsante accanto a ogni nome lo espelle dalla stanza.
5. **🔴 Chiudi Stanza** termina la sessione online e scollega tutti: i giocatori vedono un messaggio e non provano a rientrare.
6. Se ricarichi la pagina con la stanza aperta, la stanza riparte da sola con lo stesso codice e i giocatori rientrano senza fare nulla (la mappa va ricaricata come sempre).

**Lato Giocatore**
1. Apri `player.html` e inserisci il **Codice Campagna**: maiuscole, spazi e trattini non contano (`strahd 2026` vale come `STRAHD-2026`).
2. Il menu **Scegli il tuo Personaggio** si riempie con i personaggi giocanti della campagna (solo veri PG: mostri, PNG ed evocazioni non compaiono). In alternativa scegli **✍️ Altro nome / Spettatore** e scrivi un nome.
3. Premi **Connetti Online**. Il Master invia mappa, token, immagini e schede necessarie.

**↩️ Rientra in campagna:** dopo il primo ingresso, la schermata d'accesso mostra fino a 3 pulsanti con nome della campagna e personaggio, validi anche nei giorni successivi: un tocco e si entra, senza riscrivere nulla (la ✕ dimentica l'accesso). Se la pagina si ricarica nella stessa scheda (succede spesso sui telefoni), il giocatore rientra da solo, con un attimo per premere **Annulla** se vuole cambiare personaggio. Con la casella **Entra automaticamente su questo dispositivo** (spenta di base, da attivare solo sul proprio telefono o PC) si entra da soli anche aprendo il browser il giorno dopo.

**Cali di rete:** il collegamento è diretto tra i dispositivi; quando la rete non lo permette (per esempio alcune reti mobili), passa automaticamente da un server di inoltro pubblico. Se la connessione cade, sullo schermo del giocatore compare un avviso e il programma riprova da solo per circa due minuti, con attese crescenti, mantenendo nome, token e sessione; il pulsante **Riprova ora** anticipa il tentativo e, quando il telefono torna in primo piano o la rete rientra, il tentativo parte subito. Un singhiozzo di pochi secondi non stacca nessuno. Se lo stesso personaggio entra da un'altra finestra o da un altro dispositivo, quella vecchia viene avvisata e si ferma.

**Spettatori:** un giocatore che non controlla nessun token entra come spettatore: vede la partita ma non ha la barra degli strumenti né il pannello dadi.

---

## 4. Campagne, sistemi di gioco e mappe salvate

Tutto si trova nel pannello **⚙️ Regia & Campagna** (icona nel dock a destra).

### 4.1 Campagne e sistema di gioco

- **Nuova** apre la finestra **📁 Crea Nuova Campagna**: scegli il nome e il **Sistema di Gioco** (⚔️ D&D 5ª Edizione oppure ⛵ 7th Sea 2ª Edizione).
- Il sistema scelto è **definitivo**: dopo la creazione resta bloccato (**🔒 Fisso**) e il badge accanto al titolo indica il sistema della campagna attiva. In questo modo schede, compendi e regole di un gioco non si mescolano mai con quelli dell'altro.
- **Elimina** cancella la campagna selezionata.
- **Esporta (JSON)** salva l'intera campagna (mappe, cartelle, token, schede, Codice Campagna) in un file `.json`; **Importa** la ricarica.

### 4.2 Mappe e cartelle

- **Cartella:** organizza le mappe della campagna in cartelle (**+ Cartella**, elimina cartella: le mappe tornano in *Senza Cartella*). Il filtro mostra *Tutte le Mappe* o una sola cartella.
- **Mappe della Campagna:** **Carica** apre la mappa selezionata (con token, nebbia, disegni e zone d'effetto); **Sovrascrivi** salva lo stato attuale sulla mappa caricata; **Salva Nuova** la salva come mappa nuova; **📁 Sposta in...** la cambia di cartella; **Elimina Mappa** la cancella. Il badge indica la mappa attualmente in uso.
- **Modifiche non salvate:** se cambi mappa con modifiche in sospeso, una finestra chiede cosa fare: **✕ Annulla**, **🗑️ Elimina modifiche**, **➕ Salva come Nuova** o **💾 Sovrascrivi Mappa**.

### 4.3 Gestione Party

In **👥 Gestione Party** inserisci i nomi dei giocatori. Questi nomi servono per assegnare i token ai giocatori (cap. 7).

---

## 5. Mappa, griglia e visuale

Pannello **🗺️ Mappa & Griglia**.

### 5.1 Caricare le immagini

- **📁 Carica Mappa dal PC**, oppure trascina un'immagine direttamente sull'area di gioco.
- Le mappe vengono ridimensionate automaticamente a un massimo di **2560 px** sul lato lungo e convertite in WebP: restano nitide ma occupano molta meno memoria e arrivano più in fretta ai giocatori.
- **🖼️ Condividi Immagine Handout** carica un'immagine da mostrare ai giocatori (cap. 12).

### 5.2 Visuale e permessi

- **Sincronizza Vista Giocatori (Pan/Zoom):** i giocatori vedono la mappa con lo stesso spostamento e ingrandimento del Master.
- **Sincronizza Posizione Immagine (Master comanda):** la posizione delle immagini condivise segue quella del Master.
- **Nascondi Barra Giocatori (Modalità TV):** nasconde i pulsanti sullo schermo giocatori.
- **Blocca Movimento Mappa Master:** impedisce di spostare per errore la mappa nella console.
- **Blocca Mappa Player:** impedisce ai giocatori di spostare e ingrandire la mappa.

### 5.3 Griglia

- **Dimensione Celle (px):** da 20 a 300 px (predefinito 100).
- **Colore**, **Bagliore Griglia** (Nessuno / Bianco / Nero) per renderla leggibile su qualsiasi mappa, **Opacità Griglia** da 0 a 100%.
- Cambiando la dimensione delle celle, token, sagome e note restano nella stessa casella senza accumulare errori di posizione; gli oggetti finiti fuori mappa vengono riportati all'interno.

### 5.4 Allineare la griglia a una mappa già quadrettata

1. Seleziona lo strumento **Allinea Griglia** nella barra a sinistra.
2. Trascina sulla mappa per far scorrere la griglia virtuale finché combacia con quella disegnata.
3. Con **⚓ Ancora Oggetti alla Griglia** attivo (predefinito) token, aure, sagome e note si spostano insieme alla griglia restando nella loro casella; disattivandolo si sposta solo la griglia.

---

## 6. Strumenti del Master e nebbia di guerra

Barra **Strumenti Base** a sinistra:

| Strumento | Funzione |
|---|---|
| **Muovi/Seleziona** | Clic per selezionare un token, trascina per muoverlo (si aggancia alla griglia). Trascinando su un punto vuoto si sposta la mappa. |
| **Seleziona (Lazo)** | Disegna un'area per selezionare più token e sagome insieme e muoverli in gruppo. |
| **Allinea Griglia** | Vedi cap. 5.4. |
| **Metro (ft/m)** | Trascina per misurare: mostra piedi, metri e caselle (1 casella = 5 ft = 1,5 m). |
| **Disegna (Tutti)** | Disegno a mano libera visibile a tutti. |
| **Disegna (Solo DM)** | Disegno a mano libera visibile solo al Master. |
| **Aggiungi Nebbia / Cancella Nebbia** | Pennello per coprire o rivelare zone della mappa. |
| **Pin Segreto (DM)** | Clic sulla mappa per piazzare una nota con titolo e testo, visibile solo al Master. Il pannello del pin permette di modificarla o eliminarla. |
| **Puntatore Laser** | Traccia una scia luminosa visibile a tutti che svanisce dopo 5 secondi. |

**Ping:** tieni premuto (circa 0,6 secondi) su un punto della mappa per far comparire un segnale visibile a tutti.

**Pulizia disegni:** **Pulisci Dis. (Pub)** e **Pulisci Dis. (DM)** cancellano rispettivamente i disegni pubblici e quelli privati.

### Nebbia di guerra

- **Impostazioni Nebbia:** forma del pennello (Cerchio / Quadrato) e dimensione (predefinita 150 px).
- **Copri tutto di Nebbia** copre l'intera mappa; **Rimuovi tutta la Nebbia** la elimina.
- Il Master vede la nebbia semitrasparente (circa 55%) per poter lavorare sotto; per i giocatori è completamente opaca. I giocatori non possono selezionare, pingare o interagire con ciò che sta sotto la nebbia.

---

## 7. Token (pedine)

### 7.1 Libreria Token

Pannello **♟️ Libreria Token**:

- **Caricamento:** scegli uno o più file immagine, oppure un'intera cartella del PC; il menu accanto decide in quale categoria finiscono (👹 Mostri, 🧑 PNG, 🛡️ Personaggi, 📦 Vari). Puoi anche trascinare le immagini sul pannello.
- **Due schede:** **In Mappa / Campagna** mostra i token salvati nella campagna attiva (PG, PNG, creature); **Libreria** è l'archivio globale di tutte le immagini caricate, condiviso fra le campagne.
- **Filtri per categoria:** Tutti, Mostri, PNG, PG, Vari.
- **Piazzare un token:** clic sulla sua scheda: compare al centro della vista, agganciato alla griglia.
- **Piazzamento nuovi token:** taglia predefinita (Media 1×1, Grande 2×2, Enorme 3×3, Mastodontica 4×4) e visibilità iniziale (👁️ Visibile / 🙈 Nascosto).
- **Esporta / Importa personaggi:** esporta tutti i personaggi giocanti della campagna (scheda + giornale) in file `.json` separati e reimportali per ripristinare scheda, giornale e token.
- Il pulsante **Compendio** apre il compendio del sistema della campagna (cap. 15 e 16).

I mostri con lo stesso nome vengono numerati automaticamente (Orco 1, Orco 2...); PG e PNG mantengono il nome senza numero.

### 7.2 Token selezionato

Selezionando un token si apre il pannello **🎯 Token Selezionato**:

- **Nome** e **visibilità della targhetta** (A tutti / Solo DM / Spento).
- **Taglia** (da 1×1 a 4×4).
- **➕ Assegna Player...:** assegna il controllo del token a uno o più giocatori del party. Solo i proprietari possono muoverlo dal proprio schermo.
- **📁 Cartella** (Mostri, PNG, Personaggi, Vari, ✨ Evocazioni) e **💾 In Libreria** per salvarlo nella libreria permanente.
- **⏳ Durata Token:** numero di round dopo cui il token scompare da solo (vuoto = permanente). Utile per evocazioni ed effetti temporanei.
- **📋 Duplica** (anche Ctrl+D), **👁️ Visib.** (mostra/nasconde ai giocatori), **⚔️ + Iniz.** (aggiunge al tracker).
- **🗑️ Mappa** toglie il token solo dalla mappa attuale; **🗑️ Campagna** lo elimina definitivamente dal roster salvato della campagna.
- **📜 Mostro** apre la scheda creatura/antagonista assegnata; **🧙 Scheda PG** apre la scheda del personaggio (cap. 15 e 16).

### 7.3 Spostamento

- I token si agganciano alla griglia al rilascio. Tenendo premuto **Shift** al rilascio vengono posati liberamente, senza aggancio.
- **Shift + clic** aggiunge token alla selezione; trascinando una selezione multipla si muove tutto il gruppo.
- I movimenti dei giocatori arrivano al Master e agli altri in tempo reale, senza scatti all'indietro.

---

## 8. Punti Ferita, aure e condizioni

### 8.1 Punti Ferita

Nel pannello del token, sezione **❤️ Punti Ferita**:

- PV attuali e massimi (massimo 0 = barra disattivata), campo **Danno (−) / Cura (+)** con i due pulsanti per applicarli.
- **Visibile a giocatori:** decide se i giocatori vedono la barra.
- **💙 PV Temp** (solo D&D): punti ferita temporanei, assorbono i danni prima dei PV normali e compaiono come bordo azzurro.
- **🛡️ CA** (solo D&D): classe armatura del token.
- **Stile:** Barra, Aura (alone colorato attorno al token) o Entrambi. Lo stile predefinito per i giocatori si sceglie nel pannello Libreria Token (**Stile PV (Giocatori)**).
- **Colori della barra:** azzurro a PV pieni, verde sopra i 2/3, giallo sopra 1/3, rosso sotto; a 0 PV il token diventa grigio con 💀.

### 8.2 Aure

**✨ Aura:** raggio, colore e durata in round (vuoto = permanente). L'aura segue il token. Con **🎯 Evidenzia** i token che si trovano dentro l'aura vengono illuminati; i token solo adiacenti al bordo della casella non vengono contati.

### 8.3 Condizioni

- 15 condizioni (Accecato, Affascinato, Afferrato, Assordato, Avvelenato, Inabile, Invisibile, Paralizzato, Pietrificato, Privo di sensi, Prono, Spaventato, Stordito, Trattenuto, Sfinimento), con etichetta in italiano o inglese, colore personalizzabile e durata in round (vuoto = permanente). **+ Aggiungi** la applica.
- **Condizioni Multiple** (pannello Libreria Token) sceglie come vengono disegnate sul token: **Anelli Concentrici** con testo curvo, **Anello Singolo a Spicchi**, oppure **Pillole con Nome**.

---

## 9. Zone d'effetto (AoE)

Pannello **🪄 Zone d'Effetto (AoE)**:

- **Crea Nuova Sagoma:** Cerchio (sfera/cilindro), Cono, Linea, Quadrato (cubo). Imposti dimensione, spessore (solo linea), unità (ft o m), colore, durata in round, visibilità (👁️ Visibile ai Giocatori / 🙈 Nascosta) ed **🎯 Evidenzia token nell'area**. **+ Crea AoE al Centro Mappa** la piazza.
- **Modifica AoE Selezionata:** rotazione (↩️ / ↪️), dimensione, spessore, colore, durata, visibilità (con il pulsante rapido per invertirla) ed **Elimina**.
- La sagoma si sposta trascinandola. La dimensione minima è 0,1.
- Anche i giocatori possono creare le proprie sagome (cap. 14).

---

## 10. Tracker dell'iniziativa

Si apre con **⚔️ Tracker Iniziativa** in alto. Questo capitolo descrive il tracker classico con il d20 (campagne D&D); nelle campagne **7th Sea** il tracker diventa la **Sequenza d'Azione** con gli Incrementi: vedi [16.7](#167-iniziativa-in-7th-sea-sequenza-dazione-e-sequenza-drammatica) e la guida passo passo [16.8](#168-guida-pratica-la-prima-sequenza-passo-passo).

- **Partecipanti:** seleziona i token sulla mappa e usa **🔄 Ricarica** per caricarli; oppure usa **⚔️ + Iniz.** dal pannello del token. **+ Aggiungi Entità Extra** aggiunge una voce senza token.
- **📂 Raggruppa Simili** riunisce i mostri con lo stesso nome in una sola riga.
- **Tiro mostri:** **Condivisa (Gruppo)** — un tiro per tutto il gruppo — oppure **Singola** — un tiro per ciascuno.
- **🎲 Auto-Roll (Escludi PG)** tira l'iniziativa (1d20 + modificatore di Destrezza/Iniziativa) per mostri e PNG; **🎲 Auto-Roll (Includi PG)** la tira per tutti.
- Nella tabella si modificano iniziativa e PV (**HP +/−**) di ogni partecipante.
- **Avvia Combattimento**, **◀ Precedente**, **Prossimo Turno ▶** gestiscono turni e round; il turno attivo viene evidenziato sulla mappa.
- **Durate automatiche:** a ogni round scalano le durate di zone d'effetto, aure, condizioni e token temporanei; allo scadere spariscono da soli. Un effetto non perde un round nel turno stesso in cui è stato creato.
- **Ferma/Reset** termina il combattimento ed elimina gli effetti a tempo, lasciando quelli permanenti.
- **Mostra ai Giocatori** rende visibile l'ordine di iniziativa sugli schermi giocatori, nella posizione scelta (in alto, in basso, a sinistra, a destra). I token nascosti non compaiono.

---

## 11. Dadi e chat

**🎲 Pannello Dadi** (presente sia per il Master sia per i giocatori):

- Clicca i dadi (d4, d6, d8, d10, d12, d20, d100) per comporre il tiro: puoi mescolare dadi diversi.
- **Modificatore** e **Applica a:** *Al Totale* (es. danni) oppure *A ciascun dado*.
- **🎲 Tira Dadi**, **🔄 Ripeti** per rifare l'ultimo tiro, **✕ Azzera** per svuotare.
- Il 20 naturale viene evidenziato (**★ Naturale 20! ★**).

**💬 Storico Tiri (chat):** raccoglie tutti i tiri, compresi quelli dalle schede e dai compendi. I tiri del Master sono **segreti** per impostazione predefinita: spunta **Invia a Player** per mostrarli ai giocatori. Ogni tiro compare una sola volta, anche se arriva da più canali.

---

## 12. Immagini condivise (handout)

1. Carica l'immagine con **🖼️ Condividi Immagine Handout** (pannello Mappa & Griglia).
2. Nella finestra **Immagine Condivisa** premi **Trasmetti ai Giocatori**: l'immagine compare su tutti gli schermi in una finestra che ciascuno può spostare e ingrandire.
3. **Chiudi per Tutti** la ritira. L'opzione *Comanda Posizione* è ancora in fase di rifinitura.

---

## 13. Audio: musica ed effetti

Pannello **🎵 Audio & Soundboard**.

### 13.1 Musica d'ambiente (BGM)

- **Preset in streaming:** 🍻 Taverna Vivace, 🌧️ Pioggia & Tuoni, 🕯️ Dungeon & Cripta, ⚔️ Tamburi di Guerra, 🌲 Bosco Incantato (richiedono internet).
- **Nuova Traccia:** incolla l'URL di un file audio (mp3/ogg) oppure scegli un file dal PC, dai un nome, scegli se ripeterla in loop e premi **▶ Suona**; **+ Playlist** la salva nella playlist della campagna. Per il gioco online è preferibile un URL: un file locale deve essere inviato per intero ai giocatori.
- **▶ Riprendi**, **⏸ Pausa**, **⏹ Stop**. Chi si collega a partita iniziata riceve la traccia in corso.

### 13.2 Soundboard (SFX)

- 8 effetti generati direttamente dal browser, senza file e senza banda: ⚔️ Spada, 💥 Esplosione, ⚡ Fulmine, 🚪 Porta, 🐺 Ruggito, 🔔 Rintocco, ✨ Magia, 🎺 Vittoria.
- **+ Aggiungi Pad** crea pad personalizzati con i tuoi suoni.
- Un clic su un pad lo riproduce subito per tutti; mentre suona un effetto, la musica si abbassa automaticamente e poi torna al volume normale.

### 13.3 Volume

Il volume del Master e quello personale di ogni giocatore vanno da 0 a **20%** (predefinito **3%**): è un tetto di sicurezza per non far saltare casse e cuffie. Ogni giocatore può regolare il proprio volume o **🔇 Muta Audio** senza influire sugli altri.

---

## 14. Schermo del Giocatore

### 14.1 Barra degli strumenti

Si apre con il pulsante 🛠️ o il tasto **H**:

| Pulsante | Funzione |
|---|---|
| 🎨 Colore | Il tuo colore per disegni e ping |
| 🧙 | Apre la scheda del tuo personaggio |
| 💬 | Chat e storico tiri |
| 🖐️ Muovi | Muove i token che ti sono stati assegnati |
| ✏️ Disegna | Disegno a mano libera visibile a tutti |
| 🧹 | Cancella solo i tuoi disegni |
| 📏 Metro | Misura distanze |
| ⚡ Laser | Puntatore laser |
| 📐 ⭕ ➖ 🔲 | Crea Cono, Sfera, Linea, Quadrato |
| ✨ Evoca | Evoca un token (cap. 14.3) |
| 🎲 | Pannello dadi |
| 🔊 | Audio e volume personale |

Il ping funziona come per il Master: tieni premuto sulla mappa.

### 14.2 Token e magie del giocatore

- Un clic su un token apre le sue opzioni, un doppio clic apre direttamente la scheda (PG o creatura).
- **Opzioni Token** (sui token che controlli): apertura della scheda PG o della scheda creatura, aura con raggio, colore, durata ed evidenziazione, durata del token e **✕ Congeda Evocazione**.
- **Opzioni Magia AoE** (sulle tue sagome): dimensione, spessore, rotazione, colore, durata, evidenziazione ed **Elimina Magia**.

### 14.3 Evocazioni

Il pannello **✨ Evoca Token** crea token temporanei (armi spirituali, creature evocate...): nome, taglia, colore, PF opzionali e durata in round, poi **✨ Evoca in Campo**. Preset pronti: Arma Spirituale, Mano Magica, Lupo; con **Salva come mio preset** puoi aggiungerne di tuoi (restano salvati sul tuo dispositivo). Le evocazioni non compaiono mai nell'elenco dei personaggi giocanti.

---

## 15. Sistema D&D 5e: scheda PG e compendio mostri

Disponibile nelle campagne create con il sistema **D&D 5ª Edizione**.

### 15.1 Scheda Personaggio

Si apre con **🧙 Scheda PG** (Master, dal pannello token) o con 🧙 / **Apri Scheda PG** (giocatore), oppure con doppio clic sul token del personaggio.

- **Importazione:** con **Configura Link / Importa Dati Scheda** puoi incollare il link o l'ID numerico di un personaggio pubblico di un servizio online di schede compatibile, oppure incollare direttamente un JSON. Il pulsante di aggiornamento ricarica e risincronizza i dati. È disponibile anche l'importazione di un singolo file `.json`.
- **5 schede:** ⚔️ Combattimento & Abilità, ✨ Incantesimi, 🎒 Inventario, 📜 Privilegi & Tratti, 📖 Giornale.
- **Tiri con un clic** su caratteristiche, tiri salvezza, abilità, attacchi e incantesimi, in modalità **Normale**, **Vantaggio** (2d20, il migliore) o **Svantaggio** (2d20, il peggiore). I risultati vanno in chat.
- **PV:** attuali, massimi e temporanei, con campo Danno/Cura. **Riposo lungo** ripristina PV e slot incantesimo.
- **Incantesimi:** indicatori preparato / nel libro, trucchetto, rituale, concentrazione; competenza, maestria e mezza competenza sulle abilità.
- **Giornale:** appunti personali del personaggio. È protetto: reimportare o aggiornare la scheda non lo cancella mai.
- **Sincronizzazione:** le modifiche del giocatore arrivano al Master e viceversa; la scheda resta legata al token e viene salvata nella campagna. Una scheda aperta non viene ricostruita a ogni movimento sulla mappa, così non perdi quello che stai scrivendo.

### 15.2 Compendio Mostri

Si apre con **📜 Mostro** dal pannello token o dal pulsante Compendio della libreria.

- **Ricerca online** (in inglese, es. *Goblin*, *Dragon*) nel database pubblico Open5e del materiale SRD.
- **📥 Incolla JSON o testo:** incolla un JSON di un mostro, oppure seleziona e copia con il mouse il testo di una scheda da una pagina web (nome, Armor Class, Hit Points, caratteristiche, azioni...) e premi Ctrl+V. Il programma ripulisce i tag di formattazione interni e ripara anche i JSON tradotti automaticamente dal browser. Puoi aggiungere l'immagine del token trascinandola o incollandola con Ctrl+V.
- **🇮🇹 Traduci IT:** traduce la scheda con la terminologia ufficiale italiana di D&D.
- **Tiri con un clic** su attacchi, danni e tiri salvezza della scheda. **👁️ Invia tiri ai Giocatori:** se disattivato, i tiri restano segreti per il Master.
- **⚡ Assegna Token:** collega la scheda (con PV e CA) al token selezionato. **♟️ Crea Token:** crea subito un nuovo token, come **👹 Mostro** (numerato) o **🎭 PNG** (nome singolo), eventualmente **🙈 invisibile** ai giocatori.
- Anche i giocatori hanno un compendio ridotto per le proprie creature evocate (ricerca, importazione, traduzione, assegnazione al token).

---

## 16. Sistema 7th Sea 2e

Disponibile nelle campagne create con il sistema **7th Sea 2ª Edizione**. Tutti i contenuti provengono dai manuali ufficiali (Manuale Base e Nazioni di Théah Vol. 1 e 2): nessuna regola inventata. Il database comprende 100 Background, 103 Vantaggi, 20 Stili di Duello, 20 Arcani, 9 Stregonerie, 10 Società Segrete e 90 Antagonisti.

In una campagna 7th Sea il pannello token nasconde i campi propri di D&D (CA, PV temporanei) e i pulsanti scheda aprono la scheda Eroe e il compendio Antagonisti.

### 16.1 Scheda Eroe

**Intestazione:** nome, nazione, Punti Eroe, 💰 Ricchezza, Favore con la Società Segreta (con − / +), lucchetto 🔓/🔒, **⚡ Esempio (Kasper)** per provare il gioco con un eroe già pronto, **🗑️ Scheda Vergine** per ricominciare (con conferma), **Esporta / Importa** `.json` nella barra del titolo.

**🛠️ Pannello Creazione** (visibile con la scheda sbloccata): nome, concetto, religione/fede, nazione d'origine con il relativo +1 a un Tratto, stregoneria, due Background (con ricerca e filtri per manuale), Scuola di Scherma, Virtù, Superbia e Società Segreta. Contatori di Tratti, Abilità e punti Vantaggio spesi. Il pulsante di fase passa da **Creazione (Cap 3)** — Tratti e Abilità al massimo a 3 — ad **Avanzamento** in campagna — fino a 5.

**4 schede:**
1. **⚔️ Scheda Principale & Rischi** — i 5 Tratti, le 16 Abilità, ferite, Virtù e Superbia, lancio del Rischio.
2. **📜 Vantaggi, Duelli & Società** — Vantaggi acquisiti (dal catalogo o personalizzati), Scuola di Duello con le manovre, Stregoneria, Società Segreta con statuto e favori.
3. **📖 Storie & Avanzamento** — le Storie dell'Eroe.
4. **📓 Giornale & Note** — diario di bordo dell'Eroe.

### 16.2 Lancio del Rischio e Incrementi

1. Clicca un **Tratto** e un'**Abilità**: la formula mostra la riserva (es. *Grazia 2 + Mischia 0 = 2 d10*).
2. Regola eventuali dadi bonus/malus con **Dadi ±** e attiva i Vantaggi che danno dadi extra.
3. **Lancia Rischio 🎲:** il programma calcola automaticamente la combinazione migliore di dadi in gruppi da 10 (**Incrementi**), evidenziandoli in verde, e mostra i dadi non usati.
4. Le regole dei gradi sono applicate da sole: **Grado 3** ritiro di un dado, **Grado 4** gruppi da 15 valgono 2 Incrementi, **Grado 5** i 10 esplodono. Dove previsto puoi spendere Punti Eroe per ritirare i dadi non abbinati.
5. Il risultato viene inviato in chat.

### 16.3 Ferite

- Ogni **5 ferite** si subisce una **Ferita Drammatica** (fino a 4, oppure 5 con il Vantaggio che lo consente). Le Ferite Drammatiche si attivano e disattivano da sole quando le ferite salgono o scendono.
- Effetti: **1ª** +1 dado ai Rischi, **2ª** i nemici ottengono 2 dadi in più contro l'Eroe, **3ª** i tuoi 10 esplodono, **4ª** l'Eroe è **Inerme**.
- **+1 Ferita / −1**, e **Azzera** a fine Scena d'Azione: cancella le ferite ordinarie mantenendo le Ferite Drammatiche.
- **Cedi (+1 PE):** quando l'Eroe cede alla propria Superbia riceve un Punto Eroe.

### 16.4 Storie

Ogni Storia ha titolo, ricompensa e da 1 a 5 Atti (obiettivi); gli Atti lasciati vuoti non vengono considerati. Il numero di Atti determina la ricompensa (1 Atto = Abilità G1 o Vantaggio da 1 punto; fino a 5 Atti = G5, Vantaggio da 5 punti o +1 Tratto). Gli Atti si spuntano man mano; la Storia completata viene registrata.

### 16.5 Modifica e conferma della scheda

Per evitare che modifiche lunghe arrivino a pezzi e in ritardo, la scheda 7th Sea funziona così:

- **🔓 Sbloccata:** le modifiche restano solo sulla scheda aperta e compare il badge **✎ Modifiche non inviate**. Il Master riceve un avviso del tipo *«Marco sta modificando la scheda di Kasper»*.
- **🔒 Bloccare** la scheda conferma le modifiche e le invia in un colpo solo a tutti.
- Se chiudi la scheda con modifiche non inviate, una finestra propone **Torna alla scheda**, **Scarta** (torna all'ultima versione confermata) oppure **Invia al Master** (per il Master: **Conferma modifiche**).
- Se qualcun altro aggiorna la stessa scheda mentre la stai modificando, compare un avviso: bloccando, la tua versione sostituisce la sua; con *Scarta* vedi la sua.
- **Durante il gioco** (scheda bloccata) le variazioni rapide — ferite, Punti Eroe, risorse — vengono inviate automaticamente, raggruppate ogni mezzo secondo circa.
- Il **Giornale** viaggia separatamente dalla scheda, così un appunto non sovrascrive mai altri dati.

### 16.6 Compendio Antagonisti

Si apre con il pulsante scheda del token o il pulsante Compendio della libreria.

- **Categorie:** ⚔️ Sgherri (squadre di sgherri, dove la **Forza è anche il numero di PV del token**: ogni Incremento inflitto toglie 1 Forza), 👑 Malvagi (Forza, Influenza, Grado), 🐙 Mostri & Syrneth. La categoria 👥 PNG & Alleati è predisposta ma non ancora popolata.
- **Archetipi rapidi** (Pirati, Guardie, Assassini, Bruti, Moschettieri, Duellanti, Malvagi, Mostri...) che compilano tratti e capacità speciali, da personalizzare con **✏️ Modifica / Personalizza Scheda**.
- **Lancia Rischio** per l'antagonista con riserva di d10, opzioni **10 Esplodono** e **Set da 15**, tiro **Solo GM** (segreto) e **Dadi Bonus Nemici** calcolati sull'Eroe bersaglio (per esempio quelli dovuti alla sua 2ª Ferita Drammatica). Sulla console del Master, **☠️ +2 dadi** aggiunge 2 dadi al prossimo tiro spendendo 1 Punto Pericolo (cap. 16.7). Il Rischio dell'antagonista entra da solo nella Sequenza d'Azione.
- Il compendio usa la stessa finestra di quello D&D: **⚡ Assegna Token** e **♟️ Crea Token** funzionano allo stesso modo, con la **Taglia Token** scelta nella scheda. **⭐ Carica come Scheda PG** permette di usare un antagonista come personaggio.

### 16.7 Iniziativa in 7th Sea: Sequenza d'Azione e Sequenza Drammatica

In 7th Sea non si tira 1d20: chi agisce prima lo decidono gli **Incrementi** ottenuti con il Rischio (Manuale Base, cap. 4). Nelle campagne 7th Sea il **Tracker Iniziativa** cambia aspetto da solo: i comandi d20 (Avvia Combattimento, Auto-Roll, Prossimo Turno...) spariscono e al loro posto compare la **barra della Sequenza**. Nelle campagne D&D il tracker resta esattamente quello del capitolo 10.

**Chi c'è nel tracker** (il programma lo riconosce dal token):

| Icona | Tipo | Note |
|---|---|---|
| 🦸 | **Eroe** | token con scheda Eroe |
| 👑 | **Malvagio / Antagonista** | token creato dal compendio come Malvagio o Mostro; i giocatori vedono "?" al posto dei suoi Incrementi |
| 🤝 | **Alleato** | PNG creato dal compendio |
| ⚔️ | **Squadra di Sgherri** | non tira e non ha Incrementi: mostra la sua **Forza** (= PV del token) e sta in fondo alla lista |

**Le tre fasi della Sequenza d'Azione** (si passa da una all'altra con i pulsanti della barra):

1. **🎲 Tiri** — ognuno dichiara l'Approccio e tira il Rischio dalla propria scheda (il Master tira i Malvagi dal compendio Antagonisti). Gli Incrementi entrano da soli nel tracker e vale l'ultimo tiro. Il contatore indica quanti hanno già tirato; il Master può sempre scrivere o correggere un numero a mano.
2. **▶ Azioni** — agisce chi ha **più Incrementi rimasti** (riga verde). A parità vince il Malvagio; tra Eroi alla pari il Master sceglie con **▶ Agisce**. Dopo ogni spesa il tracker si riordina. In questa fase un nuovo Rischio non cambia più gli Incrementi.
3. **🏁 Fine Round** — quando tutti sono a 0. Si risolve il **Turno degli Sgherri** e si preme **🔄 Nuovo Round** (nuovi tiri). Le durate a Round di zone d'effetto, aure, condizioni ed evocazioni scalano qui, una volta per Round.

**⏹ Termina Sequenza** (premuto due volte, per conferma) chiude tutto come *Ferma/Reset*: tracker svuotato, effetti a tempo tolti, effetti permanenti lasciati.

**Una sola riserva di Incrementi.** Gli Incrementi della scheda e quelli del tracker sono gli stessi: *Spendi 1 Incremento* o una manovra di duello dalla scheda scalano il tracker, e una spesa del Master dal tracker torna sulla scheda. Durante la Fase Tiri la scheda non lascia spendere. Online, solo chi controlla un token può spenderne gli Incrementi.

**Pulsanti sulla riga di un partecipante** (Fase Azioni):

| Pulsante | Chi | Cosa fa |
|---|---|---|
| **−1 / −2 / −3** | tutti | spende Incrementi per un'Azione qualsiasi |
| **🗡️ Attacca** | Eroi ↔ Malvagi | 1 Incremento = 1 Ferita; opzione *Arma da fuoco* (+1 Ferita Drammatica che non si può evitare). Sotto il bersaglio compaiono le **Ferite in arrivo**: **Evita −1** (il bersaglio spende 1 suo Incremento, anche fuori turno) oppure **Subisci** |
| **⚔️ Sgherri** | Eroi | ogni Incremento toglie 1 Forza alla Squadra scelta |
| **✨ Opportunità** | Eroi | 1 Incremento: crea un'Opportunità che può cogliere solo un compagno |
| **🎯 Pressione** | Eroi e Malvagi | 1 Incremento: il bersaglio deve compiere l'Azione scelta (es. «Attaccami»), altrimenti paga 1 Incremento in più (**Rompi +1**). Un Malvagio può metterla a **tutti gli Eroi** spendendo anche 1 Punto Pericolo |
| **🔀 +1 Approccio** | Eroi | Azione fuori dall'Approccio dichiarato: costa 1 Incremento in più |
| **💀 Omicidio** | Malvagi | solo se c'è un Eroe Inerme: 1 Punto Pericolo + tutti gli Incrementi del Malvagio; si compie a fine Round, a meno che un compagno non lo **🛡️ Salvi** (tutti i suoi Incrementi + 1 Punto Eroe) |
| **☠️ Capacità** | Squadre | capacità speciale con 1 Punto Pericolo: Guardie, Assassini, Duellanti, Pirati, Ladri |
| **🎲 Compra** | Eroi | il Master compra un dado avanzato dal Rischio: +1 Punto Eroe all'Eroe, +1 Punto Pericolo al Master |

**Ferite ed Eroe Inerme**
- Le Ferite agli Eroi vanno direttamente sulla loro scheda (ogni 5 Ferite una Ferita Drammatica).
- Ai Malvagi il tracker mostra *Ferite w/F · FD ★☆☆☆*: dopo tante Ferite quanta Forza arriva una Ferita Drammatica; con 4 Ferite Drammatiche il Malvagio è **Sconfitto**. La barra PV del suo token mostra quanto manca.
- **Turno degli Sgherri:** a fine Round ogni Squadra ancora in piedi infligge tante Ferite quanta Forza le resta a un Eroe scelto dal Master (**Applica**, una volta per Round).
- **Eroe Inerme 💀:** ogni Azione gli costa 1 Punto Eroe (scalato da solo); senza Punti Eroe l'Azione è negata. Evitare Ferite non costa Punti Eroe.

**Conseguenze, Opportunità e Limiti di Tempo** (sezione **⏳** della barra, pulsante **+ Aggiungi**)
- **Conseguenza per ogni Eroe** (es. 3 Ferite a testa): ogni Eroe può evitarne una parte, una sola volta, con **Evita**.
- **Conseguenza condivisa** (es. 4 Ferite): gli Eroi la riducono insieme con **Riduci**; quello che resta colpisce **tutti**.
- **Opportunità:** un Eroe la coglie spendendo 1 Incremento (**Presa −1**).
- **Limite di Tempo** (facoltativo, "scatta a N Incrementi"): quando a tutti gli Eroi restano meno di N Incrementi la Conseguenza **scatta** e l'Opportunità è **Persa**. Senza limite, le Conseguenze scattano a fine Round.
- **Applica Ferite** mette le Ferite sulle schede. Il Nuovo Round resta bloccato finché ci sono Conseguenze, Ferite in arrivo o un Omicidio da risolvere.

**Sequenza Drammatica** (🎭 — feste, infiltrazioni, indagini, interrogatori)
- Un **solo tiro** per tutta la Sequenza: chi finisce gli Incrementi non ritira.
- Nessun ordine e nessun turno evidenziato; niente Round, Attacca, Sgherri o Turno degli Sgherri; le durate a Round non scalano.
- Restano Pressione, +1 Approccio, Opportunità e Conseguenze. Quando tutti sono a 0 la barra dice *Incrementi esauriti*.
- **⚔️ Diventa Sequenza d'Azione** e **🎭 Diventa Drammatica** cambiano Scena con un nuovo tiro; restano le Pressioni e le Opportunità aperte.

**☠️ Riserva di Pericolo** (riga in cima alla barra; la vede solo il Master; viene salvata nella campagna)
- **Nuova sessione:** 1 Punto Pericolo per ogni Eroe in mappa. **− / +** per gli usi a mano (per esempio la Staffilata della Sorte o la capacità speciale di un Malvagio).
- **+5 Incr.** (1 Punto): per un Round — o per tutta la Sequenza Drammatica — gli Eroi hanno bisogno di **15 per ogni Incremento** (con il Grado 4 un set da 20 vale 2 Incrementi); non si somma e scade al Nuovo Round o al cambio di Scena. Anche i tiri fatti dai tablet dei giocatori ne tengono conto, e in chat compare *☠️ 15 per Incremento*.
- **☠️ +2 dadi** nel compendio Antagonisti: 1 Punto per 2 dadi in più al prossimo tiro di un Malvagio, ripetibile.
- La Riserva scende anche con la Pressione a tutti gli Eroi, le Capacità delle Squadre e l'Omicidio; sale con i dadi comprati.

**Cosa vedono i giocatori:** il titolo (es. *⚔️ Sequenza d'Azione · Round 2 · Azioni*), gli Incrementi rimasti di ogni Eroe (⏳/✅ durante i tiri), "?" per i Malvagi, *Forza N* per le Squadre, *Sconfitto*, e sotto il tracker le note: Conseguenze e Opportunità aperte, Pressioni, Omicidi, +5 attivo. Non vedono la Riserva di Pericolo.

### 16.8 Guida pratica: la prima Sequenza passo passo

Esempio: due Eroi, **Kasper** ed **Elena**, affrontano il **Conte** e una Squadra di **5 Pirati**.

**Preparazione (una volta per sessione)**
1. Apri una campagna creata con il sistema **7th Sea** (il sistema si sceglie quando si crea la campagna).
2. Metti in mappa i token degli Eroi (con la loro scheda) e crea il Conte e i Pirati dal **Compendio Antagonisti** con **♟️ Crea Token**: così il programma sa chi è un Malvagio e chi una Squadra.
3. Apri **⚔️ Tracker Iniziativa** e, nella riga ☠️ in cima, premi **Nuova sessione**: la Riserva di Pericolo diventa 2 (1 per Eroe).

**Passo 1 — Carica i partecipanti**

4. Seleziona sulla mappa i token che partecipano (strumento **Seleziona (Lazo)** oppure **Shift + clic**) e premi **🔄 Ricarica** nel tracker. Ogni riga mostra un'icona: 🦸 Eroe, 👑 Malvagio, ⚔️ Squadra. Se manca qualcuno, selezionalo e ricarica; per togliere una riga usa la **✕**.

**Passo 2 — Avvia la Sequenza**

5. Premi **⚔️ Avvia Sequenza d'Azione** (per una scena di tensione senza combattimento usa invece **🎭 Avvia Sequenza Drammatica**). La barra mostra *Round 1 · Tiri* e sugli schermi dei giocatori compare il tracker con ⏳ accanto a ciascuno.
6. *(Facoltativo)* Per rendere la scena più dura premi ora **+5 Incr.**: in questo Round gli Eroi avranno bisogno di 15 per ogni Incremento.

**Passo 3 — Tutti tirano il Rischio**

7. Ogni giocatore dichiara l'Approccio (cosa vuole fare e come) e il Master indica quale Tratto + Abilità tirare.
8. Il giocatore apre la sua scheda, sceglie Tratto e Abilità e preme **Lancia Rischio**: gli Incrementi compaiono da soli nel tracker e la sua icona diventa ✅. Se tira due volte, vale l'ultimo tiro.
9. Per il Conte apri la sua scheda nel compendio Antagonisti e premi **Lancia Rischio** (prima, se vuoi, **☠️ +2 dadi**). Anche i suoi Incrementi arrivano da soli; in alternativa scrivili nella casella della sua riga.
10. Se a un Eroe restano dadi non usati, sulla sua riga compare **🎲 Compra**: ogni clic dà a lui 1 Punto Eroe e a te 1 Punto Pericolo.
11. Quando il contatore dice che hanno tirato tutti (es. *3/3*), premi **▶ Inizia Azioni**.

**Passo 4 — Le Azioni**

12. La **riga verde** è chi agisce: chi ha più Incrementi. Se il Conte ed Elena ne hanno 4, agisce il Conte (i Malvagi vincono i pareggi). Se due Eroi sono pari, premi **▶ Agisce** su quello che preferite.
13. Chi agisce descrive cosa fa e paga con il pulsante giusto:
    - un'Azione qualsiasi: **−1** (o −2 / −3 se costa di più);
    - attaccare: **🗡️ Attacca**, scegli bersaglio e Incrementi (1 Incremento = 1 Ferita), spunta *Arma da fuoco* se serve;
    - colpire i Pirati: **⚔️ Sgherri** (con 2 Incrementi la Forza passa da 5 a 3);
    - convincere, sedurre, intimidire: **🎯 Pressione**, scrivendo l'Azione imposta (es. «Attaccami»);
    - preparare il terreno a un compagno: **✨ Opportunità**;
    - fare qualcosa fuori dall'Approccio dichiarato: aggiungi **🔀 +1 Approccio**.

    Il giocatore può anche spendere dalla sua scheda (*Spendi 1 Incremento* o le manovre di duello): il tracker si aggiorna da solo.
14. Se il Conte attacca Kasper, sotto la riga di Kasper compare il riquadro rosso **Ferite in arrivo**. Kasper può spendere i suoi Incrementi anche fuori turno: **Evita −1** per ogni Ferita evitata. Poi **Subisci** applica il resto alla scheda. Un'arma da fuoco aggiunge 1 Ferita Drammatica che non si può evitare.
15. Se la scena ha un pericolo (il soffitto che crolla, gli archibugieri sulle mura), apri **⏳ Conseguenze e Opportunità → + Aggiungi**, scegli il tipo, scrivi il testo, le Ferite ed eventualmente il Limite di Tempo. Gli Eroi usano **Evita / Riduci / Presa**; quando la Conseguenza scatta premi **Applica Ferite**.
16. Il tracker si riordina dopo ogni spesa. Si continua finché tutti arrivano a 0.

**Passo 5 — Fine del Round**

17. La barra dice *Fine Round*. Se ci sono Squadre ancora in piedi, nel **Turno degli Sgherri** scegli l'Eroe colpito e premi **Applica**: i Pirati infliggono tante Ferite quanta Forza resta loro.
18. Risolvi eventuali Ferite in arrivo, Conseguenze o Omicidi: il programma te li ricorda e blocca il Nuovo Round finché non sono risolti.
19. Premi **🔄 Nuovo Round**: le durate a Round scalano, il +5 scade, gli Incrementi si azzerano e si torna al **Passo 3**.

**Passo 6 — Fine della Scena**

20. Quando lo scontro è finito premi **⏹ Termina Sequenza** due volte: il tracker si svuota, gli effetti a tempo spariscono e si torna al gioco libero. Se invece la scena cambia natura usa **🎭 Diventa Drammatica** (per esempio si inizia a trattare con le spade puntate) oppure **⚔️ Diventa Sequenza d'Azione** (un'infiltrazione viene scoperta).

**Domande frequenti**
- *Il tiro di un giocatore non entra nel tracker.* Controlla di essere in Fase Tiri e che il suo token sia nel tracker; altrimenti scrivi il numero a mano nella sua casella.
- *Ho inserito un numero sbagliato.* Clicca la casella degli Incrementi e correggilo: il Master ha sempre l'ultima parola.
- *Un Eroe è Inerme (4 Ferite Drammatiche).* Può ancora agire, ma ogni Azione gli costa 1 Punto Eroe, scalato da solo. Un Malvagio può tentare l'Omicidio: un compagno lo salva con **🛡️ Salva**.
- *Il programma decide da solo se un'Azione rispetta la Pressione?* No: lo decide il Master con **Rompi (+1)**. Il programma mostra solo un promemoria quando il bersaglio spende Incrementi.
- *I giocatori vedono i miei Punti Pericolo?* No. Vedono il proprio stato, "?" per i Malvagi e le note sotto il tracker.
- *Gioco anche a D&D.* Nelle campagne D&D il tracker resta quello classico con il d20: le due modalità non si toccano.

---

## 17. Tablet e touchscreen

- **Pizzica con due dita** per ingrandire; due dita non fanno mai partire il ping per errore.
- **Trascina** con un dito su un punto vuoto per spostare la mappa, su un token per muoverlo.
- **Tieni premuto** per il ping.
- Tutte le finestre (dadi, schede, compendi, tracker) si spostano trascinandone l'intestazione, anche con il dito, e il trascinamento non si interrompe passando sopra altre finestre.
- Testato su tablet Android (anche in modalità desktop tipo DeX), iPad e TV.

---

## 18. Scorciatoie e comandi rapidi

| Comando | Azione |
|---|---|
| Rotella del mouse | Zoom avanti / indietro |
| Tasto destro o centrale + trascina | Sposta la mappa |
| Trascinamento su area vuota (strumento Muovi) | Sposta la mappa |
| Tenere premuto ~0,6 s | Ping |
| Shift al rilascio di un token | Posizionamento libero, senza aggancio alla griglia |
| Shift + clic | Aggiunge alla selezione |
| Ctrl + D | Duplica il token selezionato (Master) |
| Ctrl + V | Incolla un'immagine token o il testo di una scheda nel compendio |
| Doppio clic su un token | Apre la scheda PG o la scheda creatura |
| H | Mostra / nasconde la barra strumenti (Giocatore) |

---

## 19. Salvataggi, prestazioni e limiti noti

- **Dove sono i dati:** nel browser del Master. Cancellare i dati di navigazione elimina campagne e mappe: usa **Esporta (JSON)** per i backup e l'esportazione dei personaggi per le schede.
- **Prestazioni:** mappe ottimizzate a 2560 px, animazioni limitate a 30 fps, messaggi di stato inferiori a 3 KB, immagini dei token ridotte prima dell'invio. Il programma è pensato per girare anche su PC con poca memoria.
- **Limiti noti:**
  - Il collegamento online attraverso reti mobili molto restrittive è ancora in fase di verifica sul campo.
  - Alcuni messaggi di conferma usano ancora le finestre di dialogo del browser.

---
---

# Part II — English Manual

## 1. Overview

**Andr3a VTT** is a virtual tabletop that runs entirely in the browser: no installation, no server to manage, no accounts. It consists of two pages:

- **`index.html` — GM Console:** prepares maps, moves tokens, manages fog, initiative, audio, sheets and connections.
- **`player.html` — Player Screen:** both the screen to show on a TV or second monitor and the client each player opens on their own PC, tablet or phone to play online.

### How it is organised

The program is deliberately split into two separate parts:

- **The core**, shared by every game: maps, grid, tokens, movement, fog, drawings, areas of effect, initiative, dice, chat, audio, networking and saving.
- **The game systems**, each with its own ecosystem of sheets, rules and compendiums. There are currently two: **D&D 5th Edition** and **7th Sea 2nd Edition**. Each campaign is tied to a single system (see ch. 4) and the program automatically opens the right sheet and compendium. A change to one system does not affect the other or the core.

### Design principles

- **Light and smooth** even on old PCs, Android tablets and TVs: maps are optimised on load, animations are capped at 30 frames per second, and the map is panned and zoomed by the graphics card instead of being redrawn.
- **Minimal network traffic:** during play only very small messages travel (positions, token state); images, sheets and maps are sent separately, once, in chunks.
- **Bilingual:** the core and D&D interface is available in Italian and English.

---

## 2. Getting started

- **Browser:** Chrome, Edge or another modern browser (Chrome recommended). Works on Windows, Android, iPad and smart TVs/boxes with a modern browser.
- **Launch:** open `index.html` for the GM console. The player screen is opened from the console itself (ch. 3) or, for online players, from the `player.html` address of the same installation.
- **Hosting:** since it is made only of static files, it can be hosted on any static host (for example GitHub Pages) and opened from any device.
- **Internet connection:** not needed for local play (GM + TV on the same PC). Needed for: online play (the initial connection between devices goes through free public services), online search in the D&D monster compendium, and the preset streaming music tracks.
- **Data:** campaigns, maps and tokens are saved in the GM's browser (IndexedDB). They stay on the device until browser data is cleared: export your campaigns regularly (ch. 4).

---

## 3. Play modes

### 3.1 TV / second monitor (local, no internet)

1. In the GM console open the **⚙️ Regia & Campagna** panel and press **🖥️ Apri Schermo Giocatori (TV / 2° Monitor)**.
2. A new window opens with the player screen in TV mode: drag it to the TV or second monitor and make it full screen.
3. The two windows communicate directly inside the same browser, with no network and no delay.

TV mode shows the map as players see it (fully opaque fog, hidden tokens invisible). With **Nascondi Barra Giocatori (Modalità TV)** (Map & Grid panel) the screen stays clean, with no buttons.

The player login screen also offers **Usa Schermo Locale (Offline)**: it opens a named local player connected to the GM in the same browser.

### 3.2 Online multiplayer (peer-to-peer)

**GM side**
1. Select the campaign. In the **🌐 Multiplayer Online (P2P)** box the **Campaign Code** field shows that campaign's fixed code: the first time a random one is suggested (format `ABCD-1234`), but you can type your own (for example `STRAHD-2026`, 6 to 24 letters or digits) and confirm with Enter, or generate a new one with 🎲. The code is saved in the campaign and travels with the export; changing it locks out anyone who only knows the old one.
2. Press **Avvia Stanza** (Start Room): the room always opens with the Campaign Code, so players use the same code every session. If the code is still held by the previous session, the program retries on its own for a few dozen seconds; if it is used by another room, it asks you to change it. **Apri Schermo Online** opens a player screen already joined to the room, useful for testing.
3. During the session campaign selection is locked (**🔒 Campagna Bloccata**), so nobody receives another campaign's data by mistake.
4. The **connected players** list shows who is online; the button next to each name kicks that player.
5. **🔴 Chiudi Stanza** ends the online session and disconnects everyone: players see a message and do not try to rejoin.
6. If you reload the page with the room open, the room restarts on its own with the same code and players rejoin without doing anything (the map must be reloaded as usual).

**Player side**
1. Open `player.html` and enter the **Campaign Code**: case, spaces and hyphens do not matter (`strahd 2026` equals `STRAHD-2026`).
2. The **Choose your Character** menu fills with the campaign's player characters (only real PCs: monsters, NPCs and summons are never listed). Alternatively choose **✍️ Altro nome / Spettatore** and type a name.
3. Press **Connetti Online**. The GM sends the map, tokens, images and the needed sheets.

**↩️ Rejoin campaign:** after the first join, the login screen shows up to 3 buttons with campaign name and character, valid on later days too: one tap and you are in, without typing anything (the ✕ forgets the entry). If the page reloads in the same tab (common on phones), the player rejoins on their own, with a moment to press **Annulla** (Cancel) to pick another character. With the **Join automatically on this device** box (off by default, to be enabled only on your own phone or PC) you also join on your own when opening the browser the next day.

**Network drops:** the connection is direct between devices; when the network does not allow it (for example some mobile networks) it automatically falls back to a public relay server. If the connection drops, the player screen shows a notice and the program retries on its own for about two minutes, with growing waits, keeping name, tokens and session; **Retry now** brings the attempt forward, and when the phone returns to the foreground or the network comes back the attempt starts at once. A hiccup of a few seconds disconnects nobody. If the same character joins from another window or device, the old one is notified and stops.

**Spectators:** a player who controls no token joins as a spectator: they see the game but have no toolbar and no dice panel.

---

## 4. Campaigns, game systems and saved maps

Everything lives in the **⚙️ Regia & Campagna** panel (icon in the right-hand dock).

### 4.1 Campaigns and game system

- **Nuova** (New) opens the **📁 Crea Nuova Campagna** window: choose a name and the **Game System** (⚔️ D&D 5th Edition or ⛵ 7th Sea 2nd Edition).
- The chosen system is **permanent**: after creation it is locked (**🔒 Fisso**) and the badge next to the title shows the active campaign's system. This way one game's sheets, compendiums and rules never mix with the other's.
- **Elimina** deletes the selected campaign.
- **Esporta (JSON)** saves the whole campaign (maps, folders, tokens, sheets, Campaign Code) to a `.json` file; **Importa** loads it back.

### 4.2 Maps and folders

- **Folder:** organise the campaign's maps into folders (**+ Cartella**, delete folder: its maps go back to *Senza Cartella*). The filter shows all maps or a single folder.
- **Campaign maps:** **Carica** loads the selected map (with tokens, fog, drawings and areas of effect); **Sovrascrivi** saves the current state over the loaded map; **Salva Nuova** saves it as a new map; **📁 Sposta in...** moves it to another folder; **Elimina Mappa** deletes it. The badge shows the map in use.
- **Unsaved changes:** if you switch map with pending changes, a window asks what to do: **✕ Annulla** (cancel), **🗑️ Elimina modifiche** (discard), **➕ Salva come Nuova** (save as new) or **💾 Sovrascrivi Mappa** (overwrite).

### 4.3 Party management

In **👥 Gestione Party** enter the players' names. These names are used to assign tokens to players (ch. 7).

---

## 5. Map, grid and view

**🗺️ Mappa & Griglia** panel.

### 5.1 Loading images

- **📁 Carica Mappa dal PC**, or drag an image straight onto the play area.
- Maps are automatically resized to at most **2560 px** on the long side and converted to WebP: they stay sharp but use much less memory and reach players faster.
- **🖼️ Condividi Immagine Handout** loads an image to show to players (ch. 12).

### 5.2 View and permissions

- **Sync Player View (Pan/Zoom):** players see the map with the GM's pan and zoom.
- **Sync Image Position (GM controls):** shared images follow the GM's positioning.
- **Hide Player Bar (TV Mode):** hides the buttons on the player screen.
- **Lock GM Map Movement:** prevents accidentally moving the map in the console.
- **Lock Player Map:** prevents players from panning and zooming.

### 5.3 Grid

- **Cell size (px):** 20 to 300 px (default 100).
- **Colour**, **Grid glow** (None / White / Black) for readability on any map, **Grid opacity** 0–100%.
- When the cell size changes, tokens, shapes and notes stay in the same cell without accumulating position errors; objects that end up off the map are brought back inside.

### 5.4 Aligning the grid to a pre-gridded map

1. Select the **Allinea Griglia** (Align Grid) tool in the left bar.
2. Drag on the map to slide the virtual grid until it matches the drawn one.
3. With **⚓ Ancora Oggetti alla Griglia** (Anchor objects to grid) on (default), tokens, auras, shapes and notes move with the grid and stay in their cell; with it off, only the grid moves.

---

## 6. GM tools and fog of war

**Strumenti Base** bar on the left:

| Tool | Function |
|---|---|
| **Move/Select** | Click to select a token, drag to move it (snaps to the grid). Dragging on empty space pans the map. |
| **Lasso Select** | Draw an area to select several tokens and shapes and move them together. |
| **Align Grid** | See ch. 5.4. |
| **Ruler (ft/m)** | Drag to measure: shows feet, metres and squares (1 square = 5 ft = 1.5 m). |
| **Draw (Everyone)** | Freehand drawing visible to all. |
| **Draw (GM only)** | Freehand drawing visible only to the GM. |
| **Add Fog / Erase Fog** | Brush to cover or reveal map areas. |
| **Secret Pin (GM)** | Click the map to place a note with title and text, visible only to the GM. The pin panel lets you edit or delete it. |
| **Laser Pointer** | Draws a glowing trail visible to all that fades after 5 seconds. |

**Ping:** press and hold (about 0.6 seconds) on a map point to show a signal to everyone.

**Clearing drawings:** **Pulisci Dis. (Pub)** and **Pulisci Dis. (DM)** clear public and private drawings respectively.

### Fog of war

- **Fog settings:** brush shape (Circle / Square) and size (default 150 px).
- **Copri tutto di Nebbia** covers the whole map; **Rimuovi tutta la Nebbia** removes it.
- The GM sees the fog semi-transparent (about 55%) to work underneath; for players it is fully opaque. Players cannot select, ping or interact with anything under the fog.

---

## 7. Tokens

### 7.1 Token Library

**♟️ Libreria Token** panel:

- **Upload:** choose one or more image files, or a whole folder from your PC; the menu next to it decides the category (👹 Monsters, 🧑 NPCs, 🛡️ Characters, 📦 Misc). You can also drop images on the panel.
- **Two tabs:** **In Map / Campaign** shows the tokens saved in the active campaign (PCs, NPCs, creatures); **Library** is the global archive of all uploaded images, shared across campaigns.
- **Category filters:** All, Monsters, NPCs, PCs, Misc.
- **Placing a token:** click its card: it appears at the centre of the view, snapped to the grid.
- **New token placement:** default size (Medium 1×1, Large 2×2, Huge 3×3, Gargantuan 4×4) and initial visibility (👁️ Visible / 🙈 Hidden).
- **Export / Import characters:** export all the campaign's player characters (sheet + journal) to separate `.json` files and re-import them to restore sheet, journal and token.
- The **Compendium** button opens the compendium of the campaign's system (ch. 15 and 16).

Monsters with the same name are numbered automatically (Orc 1, Orc 2...); PCs and NPCs keep their name without a number.

### 7.2 Selected token

Selecting a token opens the **🎯 Token Selezionato** panel:

- **Name** and **name-plate visibility** (Everyone / GM only / Off).
- **Size** (1×1 to 4×4).
- **➕ Assign Player...:** gives control of the token to one or more party players. Only owners can move it from their screen.
- **📁 Folder** (Monsters, NPCs, Characters, Misc, ✨ Summons) and **💾 In Libreria** to save it in the permanent library.
- **⏳ Token duration:** number of rounds after which the token disappears on its own (empty = permanent). Useful for summons and temporary effects.
- **📋 Duplicate** (also Ctrl+D), **👁️ Visib.** (show/hide to players), **⚔️ + Init.** (add to tracker).
- **🗑️ Mappa** removes the token from the current map only; **🗑️ Campagna** permanently deletes it from the campaign's saved roster.
- **📜 Monster** opens the assigned creature/antagonist sheet; **🧙 PC Sheet** opens the character sheet (ch. 15 and 16).

### 7.3 Moving

- Tokens snap to the grid on release. Holding **Shift** on release places them freely, without snapping.
- **Shift + click** adds tokens to the selection; dragging a multiple selection moves the whole group.
- Player movements reach the GM and everyone else in real time, without jumping back.

---

## 8. Hit points, auras and conditions

### 8.1 Hit points

In the token panel, **❤️ Punti Ferita** section:

- Current and maximum HP (maximum 0 = bar off), **Damage (−) / Heal (+)** field with two buttons to apply it.
- **Visible to players:** decides whether players see the bar.
- **💙 Temp HP** (D&D only): absorb damage before normal HP and show as a light-blue border.
- **🛡️ AC** (D&D only): the token's armour class.
- **Style:** Bar, Aura (coloured glow around the token) or Both. The default style for players is chosen in the Token Library panel (**Stile PV (Giocatori)**).
- **Bar colours:** cyan at full HP, green above 2/3, yellow above 1/3, red below; at 0 HP the token turns grey with 💀.

### 8.2 Auras

**✨ Aura:** radius, colour and duration in rounds (empty = permanent). The aura follows the token. With **🎯 Highlight**, tokens inside the aura light up; tokens merely touching the cell border are not counted.

### 8.3 Conditions

- 15 conditions (Blinded, Charmed, Grappled, Deafened, Poisoned, Incapacitated, Invisible, Paralyzed, Petrified, Unconscious, Prone, Frightened, Stunned, Restrained, Exhaustion), with an Italian or English label, custom colour and duration in rounds (empty = permanent). **+ Aggiungi** applies it.
- **Multiple conditions** (Token Library panel) chooses how they are drawn on the token: **Concentric rings** with curved text, **Single segmented ring**, or **Name pills**.

---

## 9. Areas of effect

**🪄 Zone d'Effetto (AoE)** panel:

- **Create new shape:** Circle (sphere/cylinder), Cone, Line, Square (cube). Set size, width (line only), unit (ft or m), colour, duration in rounds, visibility (👁️ Visible to players / 🙈 Hidden) and **🎯 Highlight tokens in area**. **+ Crea AoE al Centro Mappa** places it.
- **Edit selected AoE:** rotation (↩️ / ↪️), size, width, colour, duration, visibility (with a quick toggle button) and **Delete**.
- Shapes are moved by dragging. Minimum size is 0.1.
- Players can create their own shapes too (ch. 14).

---

## 10. Initiative tracker

Opened with **⚔️ Tracker Iniziativa** at the top. This chapter describes the classic d20 tracker (D&D campaigns); in **7th Sea** campaigns the tracker becomes the Raise-based **Action Sequence**: see [16.7](#167-7th-sea-initiative-action-sequence-and-dramatic-sequence) and the step-by-step guide [16.8](#168-practical-guide-your-first-sequence-step-by-step).

- **Participants:** select tokens on the map and use **🔄 Reload** to load them, or use **⚔️ + Init.** from the token panel. **+ Add Extra Entity** adds an entry without a token.
- **📂 Group Similar** puts monsters with the same name on a single row.
- **Monster rolls:** **Shared (Group)** — one roll for the whole group — or **Single** — one roll each.
- **🎲 Auto-Roll (Exclude PCs)** rolls initiative (1d20 + Dexterity/Initiative modifier) for monsters and NPCs; **🎲 Auto-Roll (Include PCs)** rolls for everyone.
- The table lets you edit each participant's initiative and HP (**HP +/−**).
- **Start Combat**, **◀ Previous**, **Next Turn ▶** manage turns and rounds; the active turn is highlighted on the map.
- **Automatic durations:** every round, the durations of areas of effect, auras, conditions and temporary tokens tick down; when they expire they disappear on their own. An effect does not lose a round during the same turn it was created.
- **Stop/Reset** ends combat and removes timed effects, keeping permanent ones.
- **Show to Players** displays the initiative order on the player screens, in the chosen position (top, bottom, left, right). Hidden tokens are never shown.

---

## 11. Dice and chat

**🎲 Dice panel** (available to both GM and players):

- Click the dice (d4, d6, d8, d10, d12, d20, d100) to build the roll: different dice can be mixed.
- **Modifier** and **Apply to:** *Total* (e.g. damage) or *Each die*.
- **🎲 Roll**, **🔄 Repeat** to redo the last roll, **✕ Reset** to clear.
- A natural 20 is highlighted (**★ Naturale 20! ★**).

**💬 Roll history (chat):** collects every roll, including those from sheets and compendiums. GM rolls are **secret** by default: tick **Invia a Player** to show them to players. Every roll appears only once, even if it arrives through more than one channel.

---

## 12. Shared images (handouts)

1. Load the image with **🖼️ Condividi Immagine Handout** (Map & Grid panel).
2. In the **Immagine Condivisa** window press **Trasmetti ai Giocatori**: the image appears on every screen in a window each person can move and zoom.
3. **Chiudi per Tutti** withdraws it. The *Comanda Posizione* option is still being refined.

---

## 13. Audio: music and sound effects

**🎵 Audio & Soundboard** panel.

### 13.1 Background music (BGM)

- **Streaming presets:** 🍻 Lively Tavern, 🌧️ Rain & Thunder, 🕯️ Dungeon & Crypt, ⚔️ War Drums, 🌲 Enchanted Forest (internet required).
- **New track:** paste the URL of an audio file (mp3/ogg) or choose a file from your PC, give it a name, choose whether to loop it and press **▶ Suona**; **+ Playlist** saves it in the campaign playlist. For online play a URL is preferable: a local file must be sent in full to the players.
- **▶ Resume**, **⏸ Pause**, **⏹ Stop**. Players joining mid-session receive the current track.

### 13.2 Soundboard (SFX)

- 8 effects generated directly by the browser, with no files and no bandwidth: ⚔️ Sword, 💥 Explosion, ⚡ Lightning, 🚪 Door, 🐺 Roar, 🔔 Bell, ✨ Magic, 🎺 Victory.
- **+ Aggiungi Pad** creates custom pads with your own sounds.
- Clicking a pad plays it immediately for everyone; while an effect plays, the music is automatically lowered and then restored.

### 13.3 Volume

The GM volume and each player's personal volume range from 0 to **20%** (default **3%**): a safety ceiling to protect speakers and headphones. Each player can adjust their own volume or **🔇 Mute** without affecting others.

---

## 14. Player screen

### 14.1 Toolbar

Opened with the 🛠️ button or the **H** key:

| Button | Function |
|---|---|
| 🎨 Colour | Your colour for drawings and pings |
| 🧙 | Opens your character sheet |
| 💬 | Chat and roll history |
| 🖐️ Move | Moves the tokens assigned to you |
| ✏️ Draw | Freehand drawing visible to all |
| 🧹 | Clears only your drawings |
| 📏 Ruler | Measures distances |
| ⚡ Laser | Laser pointer |
| 📐 ⭕ ➖ 🔲 | Create Cone, Sphere, Line, Square |
| ✨ Summon | Summons a token (ch. 14.3) |
| 🎲 | Dice panel |
| 🔊 | Audio and personal volume |

Pings work as for the GM: press and hold on the map.

### 14.2 Player tokens and spells

- A click on a token opens its options; a double-click opens its sheet directly (PC or creature).
- **Token options** (on tokens you control): open the PC sheet or creature sheet, aura with radius, colour, duration and highlight, token duration and **✕ Dismiss Summon**.
- **AoE spell options** (on your shapes): size, width, rotation, colour, duration, highlight and **Delete Spell**.

### 14.3 Summons

The **✨ Evoca Token** panel creates temporary tokens (spiritual weapons, summoned creatures...): name, size, colour, optional HP and duration in rounds, then **✨ Evoca in Campo**. Ready presets: Spiritual Weapon, Mage Hand, Wolf; **Save as my preset** adds your own (stored on your device). Summons never appear in the player-character list.

---

## 15. D&D 5e system: character sheet and monster compendium

Available in campaigns created with the **D&D 5th Edition** system.

### 15.1 Character sheet

Opened with **🧙 PC Sheet** (GM, from the token panel) or 🧙 / **Apri Scheda PG** (player), or by double-clicking the character's token.

- **Import:** with **Configure Link / Import Sheet Data** you can paste the link or numeric ID of a public character from a compatible online character-sheet service, or paste a JSON directly. The refresh button reloads and re-syncs the data. A single `.json` file import is also available.
- **5 tabs:** ⚔️ Combat & Skills, ✨ Spells, 🎒 Inventory, 📜 Features & Traits, 📖 Journal.
- **One-click rolls** on abilities, saving throws, skills, attacks and spells, in **Normal**, **Advantage** (2d20, keep highest) or **Disadvantage** (2d20, keep lowest) mode. Results go to chat.
- **HP:** current, maximum and temporary, with a Damage/Heal field. **Long rest** restores HP and spell slots.
- **Spells:** prepared / in spellbook, cantrip, ritual and concentration markers; proficiency, expertise and half-proficiency on skills.
- **Journal:** the character's personal notes. It is protected: re-importing or refreshing the sheet never erases it.
- **Synchronisation:** player changes reach the GM and vice versa; the sheet stays linked to the token and is saved in the campaign. An open sheet is not rebuilt on every map movement, so you never lose what you are typing.

### 15.2 Monster compendium

Opened with **📜 Monster** from the token panel or the library's Compendium button.

- **Online search** (in English, e.g. *Goblin*, *Dragon*) in the public Open5e database of SRD content.
- **📥 Paste JSON or text:** paste a monster JSON, or select and copy a statblock's text from a web page with the mouse (name, Armor Class, Hit Points, abilities, actions...) and press Ctrl+V. The program strips internal formatting tags and also repairs JSON that was machine-translated by the browser. You can add the token image by dropping it or pasting it with Ctrl+V.
- **🇮🇹 Traduci IT:** translates the sheet into Italian using the official D&D terminology.
- **One-click rolls** on the sheet's attacks, damage and saving throws. **👁️ Send rolls to players:** when off, rolls stay secret to the GM.
- **⚡ Assign Token:** links the sheet (with HP and AC) to the selected token. **♟️ Create Token:** immediately creates a new token, as **👹 Monster** (numbered) or **🎭 NPC** (single name), optionally **🙈 invisible** to players.
- Players also have a reduced compendium for their own summoned creatures (search, import, translation, assigning to a token).

---

## 16. 7th Sea 2e system

Available in campaigns created with the **7th Sea 2nd Edition** system. All content comes from the official books (Core Rulebook and Nations of Théah Vol. 1 and 2): no invented rules. The database includes 100 Backgrounds, 103 Advantages, 20 Dueling Styles, 20 Arcana, 9 Sorceries, 10 Secret Societies and 90 Antagonists. The sheet's labels are in Italian.

In a 7th Sea campaign the token panel hides D&D-specific fields (AC, temporary HP) and the sheet buttons open the Hero sheet and the Antagonist compendium.

### 16.1 Hero sheet

**Header:** name, nation, Hero Points, 💰 Wealth, Favour with the Secret Society (with − / +), 🔓/🔒 lock, **⚡ Esempio (Kasper)** to try the game with a ready-made hero, **🗑️ Scheda Vergine** to start over (with confirmation), **Export / Import** `.json` in the title bar.

**🛠️ Creation panel** (visible when the sheet is unlocked): name, concept, religion/faith, nation of origin with its +1 to a Trait, sorcery, two Backgrounds (with search and per-book filters), Fencing School, Virtue, Hubris and Secret Society. Counters for Traits, Skills and Advantage points spent. The phase button switches from **Creation (Cap 3)** — Traits and Skills max 3 — to **Advancement** during the campaign — up to 5.

**4 tabs:**
1. **⚔️ Main Sheet & Risks** — the 5 Traits, the 16 Skills, wounds, Virtue and Hubris, Risk roll.
2. **📜 Advantages, Duels & Societies** — acquired Advantages (from the catalogue or custom), Dueling School with its maneuvers, Sorcery, Secret Society with charter and favours.
3. **📖 Stories & Advancement** — the Hero's Stories.
4. **📓 Journal & Notes** — the Hero's logbook.

### 16.2 Risk roll and Raises

1. Click a **Trait** and a **Skill**: the formula shows the pool (e.g. *Finesse 2 + Weaponry 0 = 2 d10*).
2. Adjust any bonus/penalty dice with **Dadi ±** and enable the Advantages that grant extra dice.
3. **Lancia Rischio 🎲:** the program automatically finds the best grouping of dice into sets of 10 (**Raises**), highlighting them in green, and shows the unused dice.
4. Rank rules are applied automatically: **Rank 3** reroll one die, **Rank 4** sets of 15 are worth 2 Raises, **Rank 5** 10s explode. Where allowed you can spend Hero Points to reroll unmatched dice.
5. The result is posted to chat.

### 16.3 Wounds

- Every **5 wounds** the Hero takes a **Dramatic Wound** (up to 4, or 5 with the Advantage that allows it). Dramatic Wounds switch on and off by themselves as wounds go up or down.
- Effects: **1st** +1 die on Risks, **2nd** villains get 2 extra dice against the Hero, **3rd** your 10s explode, **4th** the Hero is **Helpless**.
- **+1 Ferita / −1**, and **Azzera** at the end of an Action Scene: clears ordinary wounds while keeping Dramatic Wounds.
- **Cedi (+1 PE):** when the Hero gives in to their Hubris they gain a Hero Point.

### 16.4 Stories

Each Story has a title, a reward and 1 to 5 Steps (goals); empty Steps are ignored. The number of Steps sets the reward (1 Step = Skill Rank 1 or 1-point Advantage; up to 5 Steps = Rank 5, 5-point Advantage or +1 Trait). Steps are ticked off as they are completed; the finished Story is recorded.

### 16.5 Editing and confirming the sheet

To prevent long edits from arriving in pieces and late, the 7th Sea sheet works like this:

- **🔓 Unlocked:** changes stay only on the open sheet and the **✎ Modifiche non inviate** (unsent changes) badge appears. The GM gets a notice such as *"Marco is editing Kasper's sheet"*.
- **🔒 Locking** the sheet confirms the changes and sends them to everyone in one go.
- If you close the sheet with unsent changes, a window offers **Back to sheet**, **Discard** (return to the last confirmed version) or **Send to GM** (for the GM: **Confirm changes**).
- If someone else updates the same sheet while you are editing, a warning appears: locking makes your version replace theirs; *Discard* shows theirs.
- **During play** (sheet locked) quick changes — wounds, Hero Points, resources — are sent automatically, grouped roughly every half second.
- The **Journal** travels separately from the sheet, so a note never overwrites other data.

### 16.6 Antagonist compendium

Opened with the token's sheet button or the library's Compendium button.

- **Categories:** ⚔️ Brute Squads (where **Strength is also the token's HP**: each Raise inflicted removes 1 Strength), 👑 Villains (Strength, Influence, Rank), 🐙 Monsters & Syrneth. The 👥 NPCs & Allies category is prepared but not yet populated.
- **Quick archetypes** (Pirates, Guards, Assassins, Brutes, Musketeers, Duelists, Villains, Monsters...) that fill in traits and special abilities, to be customised with **✏️ Modifica / Personalizza Scheda**.
- **Lancia Rischio** for the antagonist with a d10 pool, **10s Explode** and **Sets of 15** options, a **GM only** (secret) roll and **Enemy Bonus Dice** computed from the target Hero (for example those from their 2nd Dramatic Wound). On the GM console, **☠️ +2 dadi** adds 2 dice to the next roll for 1 Danger Point (ch. 16.7). The antagonist's Risk enters the Action Sequence by itself.
- The compendium uses the same window as the D&D one: **⚡ Assign Token** and **♟️ Create Token** work the same way, with the **Token size** chosen in the sheet. **⭐ Load as PC Sheet** lets you use an antagonist as a character.

### 16.7 7th Sea initiative: Action Sequence and Dramatic Sequence

In 7th Sea nobody rolls 1d20: who acts first is decided by the **Raises** earned with the Risk roll (Core Rulebook, ch. 4). In 7th Sea campaigns the **Initiative Tracker** changes by itself: the d20 controls (Start Combat, Auto-Roll, Next Turn...) disappear and the **Sequence bar** takes their place. In D&D campaigns the tracker stays exactly as described in chapter 10.

**Who is in the tracker** (recognised from the token):

| Icon | Type | Notes |
|---|---|---|
| 🦸 | **Hero** | token with a Hero sheet |
| 👑 | **Villain / Antagonist** | token created from the compendium as a Villain or Monster; players see "?" instead of its Raises |
| 🤝 | **Ally** | NPC created from the compendium |
| ⚔️ | **Brute Squad** | does not roll and has no Raises: it shows its **Strength** (= token HP) and sits at the bottom |

**The three phases of an Action Sequence** (move between them with the bar buttons):

1. **🎲 Rolls** — everyone declares an Approach and rolls the Risk from their sheet (the GM rolls Villains from the Antagonist compendium). Raises flow into the tracker by themselves and the last roll counts. A counter shows how many have rolled; the GM can always type or fix a number by hand.
2. **▶ Actions** — whoever has the **most Raises left** acts (green row). Villains win ties; between tied Heroes the GM picks with **▶ Agisce**. The tracker re-sorts after every spend. In this phase a new Risk roll no longer changes Raises.
3. **🏁 End of Round** — when everyone is at 0. Resolve the **Brute Squads' turn** and press **🔄 Nuovo Round** (new rolls). Round durations of areas of effect, auras, conditions and summons tick down here, once per Round.

**⏹ Termina Sequenza** (press twice to confirm) closes everything like *Stop/Reset*: tracker emptied, timed effects removed, permanent ones kept.

**One single pool of Raises.** The Raises on the sheet and in the tracker are the same: *Spend 1 Raise* or a duelling manoeuvre on the sheet lowers the tracker, and a GM spend in the tracker goes back to the sheet. During the Rolls phase the sheet does not allow spending. Online, only whoever controls a token can spend its Raises.

**Buttons on a participant's row** (Actions phase):

| Button | Who | What it does |
|---|---|---|
| **−1 / −2 / −3** | everyone | spends Raises on any Action |
| **🗡️ Attacca** | Heroes ↔ Villains | 1 Raise = 1 Wound; *Firearm* option (+1 Dramatic Wound that cannot be avoided). **Incoming Wounds** appear under the target: **Evita −1** (the target spends 1 of their Raises, even out of turn) or **Subisci** (take them) |
| **⚔️ Sgherri** | Heroes | each Raise removes 1 Strength from the chosen Squad |
| **✨ Opportunità** | Heroes | 1 Raise: creates an Opportunity that only a companion can take |
| **🎯 Pressione** | Heroes and Villains | 1 Raise: the target must take the chosen Action (e.g. "Attack me"), otherwise it pays 1 extra Raise (**Rompi +1**). A Villain can apply it to **all Heroes** by also spending 1 Danger Point |
| **🔀 +1 Approccio** | Heroes | an Action outside the declared Approach costs 1 extra Raise |
| **💀 Omicidio** | Villains | only if a Hero is Helpless: 1 Danger Point + all the Villain's Raises; it happens at the end of the Round unless a companion **🛡️ Salva** (saves) the Hero (all their Raises + 1 Hero Point) |
| **☠️ Capacità** | Squads | special ability for 1 Danger Point: Guards, Assassins, Duellists, Pirates, Thieves |
| **🎲 Compra** | Heroes | the GM buys a die left over from the Risk: +1 Hero Point to the Hero, +1 Danger Point to the GM |

**Wounds and Helpless Heroes**
- Wounds to Heroes go straight onto their sheet (every 5 Wounds one Dramatic Wound).
- For Villains the tracker shows *Ferite w/F · FD ★☆☆☆*: after as many Wounds as their Strength comes a Dramatic Wound; with 4 Dramatic Wounds the Villain is **Defeated**. Their token's HP bar shows how far that is.
- **Brute Squads' turn:** at the end of the Round every Squad still standing deals as many Wounds as its remaining Strength to a Hero chosen by the GM (**Applica**, once per Round).
- **Helpless Hero 💀:** every Action costs them 1 Hero Point (deducted automatically); without Hero Points the Action is denied. Avoiding Wounds costs no Hero Points.

**Consequences, Opportunities and Time Limits** (the **⏳** section of the bar, **+ Aggiungi** button)
- **Consequence for every Hero** (e.g. 3 Wounds each): each Hero can avoid part of it, once, with **Evita**.
- **Shared Consequence** (e.g. 4 Wounds): the Heroes reduce it together with **Riduci**; whatever is left hits **everyone**.
- **Opportunity:** a Hero takes it by spending 1 Raise (**Presa −1**).
- **Time Limit** (optional, "triggers at N Raises"): when every Hero has fewer than N Raises left, the Consequence **triggers** and the Opportunity is **Lost**. Without a limit, Consequences trigger at the end of the Round.
- **Applica Ferite** puts the Wounds on the sheets. The new Round stays blocked while there are Consequences, Incoming Wounds or a Murder to resolve.

**Dramatic Sequence** (🎭 — parties, infiltrations, investigations, interrogations)
- **One single roll** for the whole Sequence: whoever runs out of Raises does not roll again.
- No order and no highlighted turn; no Rounds, Attack, Squads or Brute Squads' turn; Round durations do not tick.
- Pressure, +1 Approach, Opportunities and Consequences still work. When everyone is at 0 the bar says *Incrementi esauriti* (Raises spent).
- **⚔️ Diventa Sequenza d'Azione** and **🎭 Diventa Drammatica** change Scene with a new roll; Pressures and open Opportunities carry over.

**☠️ Danger Pool** (row at the top of the bar; only the GM sees it; saved in the campaign)
- **Nuova sessione** (new session): 1 Danger Point per Hero on the map. **− / +** for manual uses (e.g. a Fate Lash or a Villain's special ability).
- **+5 Incr.** (1 Point): for one Round — or the whole Dramatic Sequence — Heroes need **15 for each Raise** (with Rank 4 a set of 20 is worth 2 Raises); it does not stack and expires at the new Round or when the Scene changes. Rolls made from the players' tablets take it into account too, and the chat shows *☠️ 15 per Incremento*.
- **☠️ +2 dadi** in the Antagonist compendium: 1 Point for 2 extra dice on a Villain's next roll, repeatable.
- The Pool also goes down with Pressure on all Heroes, Squad abilities and Murder, and goes up with bought dice.

**What players see:** the title (e.g. *⚔️ Sequenza d'Azione · Round 2 · Azioni*), each Hero's remaining Raises (⏳/✅ during rolls), "?" for Villains, *Forza N* for Squads, *Sconfitto* (defeated), and under the tracker the notes: open Consequences and Opportunities, Pressures, Murders, +5 active. They do not see the Danger Pool.

### 16.8 Practical guide: your first Sequence step by step

Example: two Heroes, **Kasper** and **Elena**, face the **Count** and a Squad of **5 Pirates**.

**Setup (once per session)**
1. Open a campaign created with the **7th Sea** system (the system is chosen when the campaign is created).
2. Put the Heroes' tokens on the map (with their sheets) and create the Count and the Pirates from the **Antagonist compendium** with **♟️ Create Token**: this way the program knows who is a Villain and who is a Squad.
3. Open **⚔️ Tracker Iniziativa** and, in the ☠️ row at the top, press **Nuova sessione**: the Danger Pool becomes 2 (1 per Hero).

**Step 1 — Load the participants**

4. Select the participating tokens on the map (**Select (Lasso)** tool or **Shift + click**) and press **🔄 Reload** in the tracker. Each row shows an icon: 🦸 Hero, 👑 Villain, ⚔️ Squad. If someone is missing, select them and reload; use the **✕** to remove a row.

**Step 2 — Start the Sequence**

5. Press **⚔️ Avvia Sequenza d'Azione** (for a tense scene without fighting use **🎭 Avvia Sequenza Drammatica** instead). The bar shows *Round 1 · Tiri* and the tracker appears on the players' screens with ⏳ next to everyone.
6. *(Optional)* To make the scene harder press **+5 Incr.** now: this Round the Heroes will need 15 for each Raise.

**Step 3 — Everyone rolls the Risk**

7. Each player declares their Approach (what they want to do and how) and the GM says which Trait + Skill to roll.
8. The player opens their sheet, picks Trait and Skill and presses **Lancia Rischio**: the Raises appear in the tracker by themselves and their icon turns ✅. If they roll twice, the last roll counts.
9. For the Count, open his sheet in the Antagonist compendium and press **Lancia Rischio** (first, if you like, **☠️ +2 dadi**). His Raises arrive by themselves too; otherwise type them in the box on his row.
10. If a Hero has unused dice, **🎲 Compra** appears on their row: each click gives them 1 Hero Point and you 1 Danger Point.
11. When the counter says everyone has rolled (e.g. *3/3*), press **▶ Inizia Azioni**.

**Step 4 — Actions**

12. The **green row** is who acts: whoever has the most Raises. If the Count and Elena both have 4, the Count acts (Villains win ties). If two Heroes are tied, press **▶ Agisce** on the one you prefer.
13. Whoever acts describes what they do and pays with the right button:
    - any Action: **−1** (or −2 / −3 if it costs more);
    - attacking: **🗡️ Attacca**, choose target and Raises (1 Raise = 1 Wound), tick *Firearm* if needed;
    - hitting the Pirates: **⚔️ Sgherri** (with 2 Raises their Strength goes from 5 to 3);
    - persuading, seducing, intimidating: **🎯 Pressione**, typing the forced Action (e.g. "Attack me");
    - setting something up for a companion: **✨ Opportunità**;
    - doing something outside the declared Approach: add **🔀 +1 Approccio**.

    Players can also spend from their own sheet (*Spend 1 Raise* or duelling manoeuvres): the tracker updates by itself.
14. If the Count attacks Kasper, the red **Incoming Wounds** box appears under Kasper's row. Kasper can spend his Raises even out of turn: **Evita −1** for each Wound avoided. Then **Subisci** applies the rest to his sheet. A firearm adds 1 Dramatic Wound that cannot be avoided.
15. If the scene has a hazard (a collapsing ceiling, arquebusiers on the walls), open **⏳ Conseguenze e Opportunità → + Aggiungi**, choose the type, type the text, the Wounds and optionally the Time Limit. Heroes use **Evita / Riduci / Presa**; when the Consequence triggers press **Applica Ferite**.
16. The tracker re-sorts after every spend. Keep going until everyone reaches 0.

**Step 5 — End of the Round**

17. The bar says *Fine Round*. If any Squads are still standing, in the **Brute Squads' turn** choose the Hero they hit and press **Applica**: the Pirates deal as many Wounds as their remaining Strength.
18. Resolve any Incoming Wounds, Consequences or Murders: the program reminds you and blocks the new Round until they are resolved.
19. Press **🔄 Nuovo Round**: Round durations tick down, the +5 expires, Raises reset and you go back to **Step 3**.

**Step 6 — End of the Scene**

20. When the fight is over press **⏹ Termina Sequenza** twice: the tracker empties, timed effects disappear and you are back to free play. If instead the scene changes nature, use **🎭 Diventa Drammatica** (e.g. negotiating with swords drawn) or **⚔️ Diventa Sequenza d'Azione** (an infiltration is discovered).

**Frequently asked questions**
- *A player's roll does not reach the tracker.* Check that you are in the Rolls phase and that their token is in the tracker; otherwise type the number in their box.
- *I entered a wrong number.* Click the Raises box and fix it: the GM always has the last word.
- *A Hero is Helpless (4 Dramatic Wounds).* They can still act, but every Action costs 1 Hero Point, deducted automatically. A Villain can attempt Murder: a companion saves them with **🛡️ Salva**.
- *Does the program decide whether an Action respects a Pressure?* No: the GM decides with **Rompi (+1)**. The program only shows a reminder when the target spends Raises.
- *Can players see my Danger Points?* No. They see their own status, "?" for Villains and the notes under the tracker.
- *I also play D&D.* In D&D campaigns the tracker stays the classic d20 one: the two modes never interfere.

---

## 17. Tablets and touchscreens

- **Pinch with two fingers** to zoom; two fingers never trigger a ping by mistake.
- **Drag** with one finger on empty space to pan, on a token to move it.
- **Press and hold** to ping.
- Every window (dice, sheets, compendiums, tracker) can be moved by dragging its header, also by finger, and dragging is not interrupted when passing over other windows.
- Tested on Android tablets (including DeX-style desktop mode), iPad and TVs.

---

## 18. Shortcuts and quick controls

| Control | Action |
|---|---|
| Mouse wheel | Zoom in / out |
| Right or middle button + drag | Pan the map |
| Drag on empty area (Move tool) | Pan the map |
| Hold ~0.6 s | Ping |
| Shift when releasing a token | Free placement, no grid snapping |
| Shift + click | Add to selection |
| Ctrl + D | Duplicate the selected token (GM) |
| Ctrl + V | Paste a token image or statblock text into the compendium |
| Double-click a token | Opens the PC sheet or creature sheet |
| H | Show / hide the toolbar (Player) |

---

## 19. Saving, performance and known limits

- **Where the data lives:** in the GM's browser. Clearing browsing data deletes campaigns and maps: use **Esporta (JSON)** for backups and the character export for sheets.
- **Performance:** maps optimised to 2560 px, animations capped at 30 fps, state messages under 3 KB, token images shrunk before sending. The program is designed to run even on low-memory PCs.
- **Known limits:**
  - Online connection through very restrictive mobile networks is still being field-tested.
  - Some confirmation messages still use the browser's dialog boxes.
