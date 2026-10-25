# APP TABLETOP - Manuale Completo & Guida alle Funzionalità
*Manuale Completo del Master e del Giocatore (Italiano & English)*

---

## 📖 Indice dei Contenuti / Table of Contents

- [Parte I: Manuale Completo in Italiano](#parte-i-manuale-completo-in-italiano)
  - [1. Cos'è questo Software e Architettura di Base](#1-cos-questo-software-e-architettura-di-base)
  - [2. Modalità di Connessione e Gioco (P2P, Schermo TV e Server Wi-Fi Locale)](#2-modalit-di-connessione-e-gioco-p2p-schermo-tv-e-server-wi-fi-locale)
  - [3. Gestione Mappe, Griglia e Allineamento Avanzato](#3-gestione-mappe-griglia-e-allineamento-avanzato)
  - [4. Nebbia di Guerra (Fog of War) e Rivelazione Dinamica](#4-nebbia-di-guerra-fog-of-war-e-rivelazione-dinamica)
  - [5. Gestione Pedine (Token) e Libreria](#5-gestione-pedine-token-e-libreria)
  - [6. Barra dei Punti Ferita (Capsula PV), Auree Mobili e Durate](#6-barra-dei-punti-ferita-capsula-pv-auree-mobili-e-durate)
  - [7. Condizioni di Stato e Stili Grafici](#7-condizioni-di-stato-e-stili-grafici)
  - [8. Strumenti Tattici della Barra Laterale](#8-strumenti-tattici-della-barra-laterale)
  - [9. Zone d'Effetto (AoE / Sagome Magiche) e Timer con Clessidra](#9-zone-deffetto-aoe--sagome-magiche-e-timer-con-clessidra)
  - [10. Tracker dell'Iniziativa e Gestione del Combattimento](#10-tracker-delliniziativa-e-gestione-del-combattimento)
  - [11. Scheda Personaggio Completa per Giocatori (PC Sheet)](#11-scheda-personaggio-completa-per-giocatori-pc-sheet)
  - [12. Compendio Mostri, Importazione JSON e Statblock Interattivi](#12-compendio-mostri-importazione-json-e-statblock-interattivi)
  - [13. Lanciatore di Dadi e Registro Chat](#13-lanciatore-di-dadi-e-registro-chat)
  - [14. Condivisione Immagini Handout (Indizi Visivi)](#14-condivisione-immagini-handout-indizi-visivi)
  - [15. Regia Sonora: BGM, Playlist e Soundboard Procedurale Offline](#15-regia-sonora-bgm-playlist-e-soundboard-procedurale-offline)
  - [16. Regia & Campagna: Mappe, Cartelle e Salvataggi](#16-regia--campagna-mappe-cartelle-e-salvataggi)
  - [17. Supporto Completo Touchscreen & Tablet (iPad / Android)](#17-supporto-completo-touchscreen--tablet-ipad--android)
  - [18. Tabella Scorciatoie da Tastiera e Controlli Rapidi](#18-tabella-scorciatoie-da-tastiera-e-controlli-rapidi)
- [Part II: English Comprehensive Manual](#part-ii-english-comprehensive-manual)
  - [1. Introduction & Core Architecture](#1-introduction--core-architecture)
  - [2. Multiplayer Modes (P2P, Local TV & Local Wi-Fi Testing)](#2-multiplayer-modes-p2p-local-tv--local-wi-fi-testing)
  - [3. Map, Grid & Advanced Alignment Calibration](#3-map-grid--advanced-alignment-calibration)
  - [4. Dynamic Fog of War (Masking Engine)](#4-dynamic-fog-of-war-masking-engine)
  - [5. Token Management & Token Library](#5-token-management--token-library)
  - [6. Hit Point Capsule, Mobile Auras & Round Durations](#6-hit-point-capsule-mobile-auras--round-durations)
  - [7. Status Conditions & Visual Styles](#7-status-conditions--visual-styles)
  - [8. Sidebar Tactical Tools](#8-sidebar-tactical-tools)
  - [9. Area of Effect (AoE / Spell Shapes) & Timers](#9-area-of-effect-aoe--spell-shapes--timers)
  - [10. Initiative Tracker & Combat Engine](#10-initiative-tracker--combat-engine)
  - [11. Player Character Sheet (PC Sheet)](#11-player-character-sheet-pc-sheet)
  - [12. Monster Compendium, JSON Import & Interactive Statblocks](#12-monster-compendium-json-import--interactive-statblocks)
  - [13. Virtual Dice Roller & Chat Log](#13-virtual-dice-roller--chat-log)
  - [14. Visual Handout Image Sharing](#14-visual-handout-image-sharing)
  - [15. Audio Engine, BGM & Procedural Offline Soundboard](#15-audio-engine-bgm--procedural-offline-soundboard)
  - [16. Campaign Management, Map Folders & Storage](#16-campaign-management-map-folders--storage)
  - [17. Tablet & Touchscreen Optimization (iPad / Android)](#17-tablet--touchscreen-optimization-ipad--android)
  - [18. Keyboard Shortcuts & Controls Reference](#18-keyboard-shortcuts--controls-reference)

---

# Parte I: Manuale Completo in Italiano

## 1. Cos'è questo Software e Architettura di Base

**APP TABLETOP** è un tavolo virtuale (comunemente noto come *Virtual Tabletop* o *VTT*) progettato per consentire a Master e Giocatori di vivere sessioni di gioco di ruolo da tavolo (come la quinta edizione del gioco di ruolo più famoso al mondo, giochi d20, fantasy o fantascienza) sia dal vivo attorno a un tavolo fisico sia online a distanza.

Un tavolo virtuale sostituisce la classica griglia di battaglia cartacea, le miniature in plastica, i righelli e i manuali con un ambiente digitale interattivo. Sul monitor è possibile caricare mappe illustrate ad alta risoluzione, posizionare pedine virtuali (dette *Token*) raffiguranti eroi e mostri, tracciare punti ferita, gestire la nebbia di guerra che cela le stanze inesplorate di un sotterraneo, lanciare dadi digitali e calcolare automaticamente iniziativa, auree ed effetti ad area.

### Punti di Forza Architetturali
- **Funzionamento 100% Client-Side:** Non richiede l'installazione di server dedicati, database complessi, pacchetti esterni o registrazioni con account obbligatori. È sufficiente aprire `index.html` (Console Master) o `player.html` (Schermo Giocatori) in un qualsiasi browser web moderno (Chrome, Edge, Firefox, Safari).
- **Motore Grafico HTML5 Canvas a Livelli Multipli:** La schermata di gioco è gestita da una gerarchia di livelli grafici indipendenti e disaccoppiati (Sfondo Mappa, Griglia tattica, Sagome di incantesimi AoE, Pedine dei personaggi, Tratti a mano libera pubblici, Tratti segreti del Master, Nebbia di Guerra e Livello dell'interfaccia UI). Questa separazione garantisce una fluidità costante a **60/120 FPS senza rallentamenti o cali di fotogrammi**, anche su computer portatili meno recenti o tablet.
- **Salvataggio Locale su IndexedDB:** Tutta la campagna (mappe in alta risoluzione, pedine, schede mostri, maschere della nebbia, disegni e configurazioni audio) viene salvata in modo sicuro nel database integrato del browser del Master, garantendo la totale persistenza dei dati tra una sessione e l'altra senza dispersioni.
- **Interfaccia Non-Bloccante (`vtt-dragging`):** Durante il trascinamento di token, la selezione multipla con il lazo o lo scorrimento della mappa, il passaggio del puntatore sopra finestre aperte o pannelli comandi non interrompe mai il movimento, rendendo la plancia fluida e indistruttibile.

---

## 2. Modalità di Connessione e Gioco (P2P, Schermo TV e Server Wi-Fi Locale)

Il programma supporta tre modalità di utilizzo per coprire ogni esigenza di gioco.

### 2.1 Multiplayer Online Diretto (Peer-to-Peer WebRTC)
Permette di giocare via internet connettendo Master e giocatori sparsi per il mondo senza passare per server di gioco centralizzati:
1. Il Master apre `index.html`.
2. Clicca sull'icona circolare azzurra **⚙️ (Regia & Campagna)** in basso a destra.
3. Nella sezione **Multiplayer Online (P2P)**, clicca su **Avvia Stanza**.
4. Viene generato un codice stanza univoco (es. `ABCD-1234`).
5. Condividi il codice o il link diretto con i giocatori.
6. I giocatori aprono `player.html`, inseriscono il proprio nickname e il codice stanza (oppure usano direttamente il link ricevuto: `player.html?room=ABCD-1234`) e cliccano su **Connetti Online**.
7. Nella console del Master apparirà l'elenco dei giocatori connessi con conferma visiva in tempo reale.

### 2.2 Modalità TV / Secondo Monitor Locale (Zero Latenza Offline)
Ideale per le sessioni di gioco dal vivo, posizionando un monitor o un televisore orizzontalmente sul tavolo o a parete:
1. Nel pannello **⚙️ Regia & Campagna**, clicca su **🖥️ Apri Schermo Giocatori (TV / 2° Monitor)**.
2. Si apre una finestra dedicata ai giocatori (`player.html?mode=tv`).
3. La sincronizzazione tra la schermata Master e la schermata TV avviene tramite l'API nativa del browser `BroadcastChannel`: la trasmissione delle pedine, della nebbia e dei tiri è **istantanea a latenza zero**, funzionando al 100% anche senza alcuna connessione internet attiva!
4. Trascina la finestra sul monitor secondario e premi `F11` per attivare la visualizzazione a tutto schermo pulita e senza bordi.

### 2.3 Server Locale Wi-Fi Istantaneo per Tablet (Cartella `_server_test/`)
Se desideri provare il VTT su tablet (iPad, Android) o smartphone connessi alla rete Wi-Fi di casa senza dover pubblicare o caricare file sul web:
1. Fai doppio clic sul collegamento **`Avvia Test VTT`** presente sul tuo Desktop (oppure apri `_server_test/AVVIA_SERVER_TEST.bat`).
2. Il server rileva automaticamente l'indirizzo IP locale del tuo PC e apre nel browser una plancia di connessione intuitiva ([connect.html](file:///c:/Users/Gerbi/OneDrive/Desktop/App%20GDR/APP%20TABLETOP/_server_test/connect.html)).
3. Prendi il tablet connesso al Wi-Fi di casa, apri la fotocamera e inquadra il **QR Code** dello Schermo Master o dello Schermo Giocatore.
4. Il tablet aprirà direttamente la plancia di gioco con configurazione **No-Cache automatica**: ogni volta che modifichi un file sul computer, ti basta fare *Ricarica (Refresh)* sul tablet per vedere le novità in tempo reale!
5. Per spegnere il server al termine dei test, chiudi semplicemente la finestra nera del terminale sul PC.

---

## 3. Gestione Mappe, Griglia e Allineamento Avanzato

Tutte le funzionalità relative alla mappa di battaglia sono racchiuse nel pulsante flottante verde **🗺️ (Mappa & Griglia)** e nello strumento **📐 Allinea Griglia** della barra laterale.

### 3.1 Caricamento delle Mappe
- Clicca su **📁 Carica Mappa dal PC** per selezionare qualsiasi file d'immagine (`.jpg`, `.png`, `.webp`, `.svg`).
- L'immagine viene automaticamente centrata, scalata e memorizzata all'interno dello slot mappa corrente della campagna.

### 3.2 Visuale e Permessi Sincronizzati
- **Sincronizza Vista Giocatori (Pan/Zoom):** Se selezionato, qualsiasi ingrandimento o spostamento della telecamera effettuato dal Master viene replicato all'istante sullo schermo di tutti i giocatori.
- **Blocca Mappa Player:** Disattiva lo scorrimento autonomo della mappa da parte dei giocatori, obbligando la loro visuale a seguire fedelmente quella impostata dal Master.
- **Blocca Movimento Mappa Master:** Impedisce lo spostamento involontario della mappa durante la selezione e il movimento delle pedine.
- **Nascondi Barra Giocatori (Modalità TV):** Rimuove tutti i menu inferiori dalla schermata TV dei giocatori per garantire la massima pulizia scenica sul tavolo.

### 3.3 Calibrazione della Griglia Tattica
- **Dimensione Celle (px):** Regola l'ampiezza di ciascun quadretto (da 20px a 300px, valore tipico: 70-100px).
- **Ridimensionamento Non-Distruttivo con Baseline:** Modificando le dimensioni delle celle tramite cursore o input numerico, il programma non accumula errori di arrotondamento. Le pedine, le sagome e i segnalini mantengono con precisione assoluta la loro colonna e riga di appartenenza, scalando proporzionalmente di diametro.
- **Colore Griglia:** Selettore cromatico personalizzato (es. nero per mappe desertiche o innevate, bianco o grigio per dungeon oscuri).
- **Bagliore Griglia:** Permette di applicare un contorno sfumato (`Nessuno`, `Bianco`, `Nero`) per rendere i quadretti visibili su qualsiasi contrasto grafico.

### 3.4 Strumento Allinea Griglia con Ancoraggio Oggetti (`⚓ Ancora Oggetti alla Griglia`)
Quando una mappa ha già una griglia disegnata sull'illustrazione, è necessario far combaciare la griglia virtuale del programma con le mattonelle dell'immagine:
1. Attiva lo strumento **📐 Allinea Griglia** nella barra laterale sinistra.
2. Trascina la mappa con il mouse per far scorrere la griglia virtuale fino a quando le linee non combaciano con precisione con il disegno sottostante.
3. **Casella `⚓ Ancora Oggetti alla Griglia` (Attiva di Default):**
   - **Quando è Attiva:** Tutte le pedine già schierate, le auree, le sagome di incantesimo AoE, le note e le puntine del Master **seguono il movimento all'unisono**, rimanendo perfettamente ancorate alle rispettive caselle della mappa.
   - **Quando è Disattivata:** Si sposta unicamente la griglia virtuale lasciando le pedine ferme nella loro posizione originale sul monitor.

---

## 4. Nebbia di Guerra (Fog of War) e Rivelazione Dinamica

La Nebbia di Guerra è una maschera d'oscurità digitale che nasconde ai giocatori le porzioni di mappa non ancora esplorate o visibili dai loro personaggi.

### Comandi della Nebbia di Guerra
- **Copri tutto di Nebbia:** Stende immediatamente un manto nero impenetrabile sull'intera mappa.
- **Rimuovi tutta la Nebbia:** Elimina completamente ogni velo d'oscurità.
- **Strumento Cancella Nebbia (`Cancella Nebbia`):** Pennello di scoperta. Trascina il mouse (o il dito sul tablet) per "cancellare" l'oscurità e mostrare corridoi, trappole disarmate o stanze ai giocatori.
- **Strumento Aggiungi Nebbia (`Aggiungi Nebbia`):** Pennello coprente. Ripristina l'oscurità in un'area precedentemente rivelata (ad esempio quando una porta viene richiusa o un incantesimo d'oscurità viene lanciato).
- **Forma del Pennello:** Scegli tra **Cerchio** (ottimale per torce, raggi di luce e caverne irregolari) e **Quadrato** (perfetto per stanze e corridoi ortogonali).
- **Dimensione Pennello (px):** Regolabile da 30px a oltre 400px, con cerchio/quadrato di anteprima semitrasparente sotto il cursore.
- Sullo schermo del Master, le aree coperte dalla nebbia vengono mostrate in semitrasparenza scura con un'indicazione tratteggiata per permettergli di orientarsi, mentre sui monitor dei giocatori appaiono come nero totale e opaco.

---

## 5. Gestione Pedine (Token) e Libreria

I Token rappresentano le miniature virtuali di eroi, mostri, creature evocata e PNG (personaggi non giocanti).

### 5.1 Pannello Libreria Token (`♟️ Libreria Token`)
Accessibile cliccando sul pulsante circolare blu/ottanio **♟️** in basso a destra o su **♟️ Libreria & Nuovi Token** nella barra laterale:
- **Carica Cartella PC (`📁 Cartella PC`):** Permette di selezionare un'intera cartella dal disco fisso: tutti i ritratti grafici dei mostri e dei personaggi vengono importati nella libreria con un solo clic.
- **File Singoli (`🖼️ File Singoli`):** Caricamento di una o più immagini selezionate.
- **Drag & Drop:** Trascina immagini o intere cartelle dal desktop del PC direttamente nel riquadro della libreria.
- **Tab della Libreria:**
  - `🗺️ In Mappa`: Elenco compatto di tutte le pedine attualmente presenti sulla plancia con relativo conteggio.
  - `📁 Libreria`: Archivio persistente di tutti i token memorizzati nel database locale della campagna.
  - `📖 Mostri`: Scorciatoia rapida per aprire il compendio mostri e schede 5e.
- **Ricerca Rapida:** Digita qualsiasi parte del nome per filtrare istantaneamente i token disponibili.

### 5.2 Parametri Predefiniti prima del Piazzamento
Nella parte inferiore del pannello della libreria puoi stabilire le caratteristiche con cui verrà generata la pedina:
- **Taglia del Token:** Media (occupa 1x1 caselle), Grande (2x2 caselle), Enorme (3x3 caselle), Mastodontica (4x4 caselle).
- **Visibilità Iniziale:** Visibile (`👁️`) oppure Nascosto ai giocatori (`🙈`).
- **PV Massimi:** Punti ferita predefiniti assegnati al momento del rilascio.

### 5.3 Controlli e Proprietà del Token Selezionato
Selezionando una pedina sulla mappa con lo strumento *Muovi*, si apre il pannello laterale delle proprietà:
- **Targhetta del Nome e Visibilità:**
  - `A tutti`: Il nome è visibile a Master e Giocatori.
  - `Solo DM`: Il nome è visibile esclusivamente sullo schermo del Master (evidenziato con un elegante bordo viola), mantenendo il mostro anonimo ai giocatori finché non viene identificato.
  - `Spento`: Targhetta del nome disattivata.
- **Doppio Clic Diretto per la Scheda:** Facendo doppio clic (o doppio tocco sul tablet) su una pedina, il programma apre istantaneamente la Scheda Personaggio completa associata o lo Statblock del Mostro! Se il token non possiede ancora una scheda, apre automaticamente il Compendio pronto per assegnargliene una.
- **Numerazione Intelligente dei Cloni:** Schierando o duplicando più mostri dello stesso tipo (es. Goblin), il programma assegna automaticamente la sequenza numerica: *Goblin 1, Goblin 2, Goblin 3*, semplificando la distinzione in combattimento.
- **Assegnazione al Giocatore:** Il Master può assegnare il controllo esclusivo di un token a un giocatore connesso. Solo quel giocatore e il Master avranno il permesso di spostarlo.
- **Duplica Token (`📋 Duplica` / `Ctrl+D`):** Crea una copia identica del token posizionata leggermente sfalsata, copiando immagine, dimensioni, CA, punti ferita massimi, condizioni e scheda associata, aggiornandone il numero progressivo.
- **Visibilità Rapida (`👁️ Visib.`):** Mostra o nasconde la pedina ai giocatori con un clic. I token invisibili rimangono visibili al Master in semitrasparenza.
- **Aggiunta all'Iniziativa (`⚔️ + Iniz.`):** Richiede il tiro di iniziativa e trasferisce direttamente il token all'interno del Tracker di combattimento.
- **Eliminazione (`🗑️ Del` / Tasto Canc):** Rimuove la pedina dalla mappa.

---

## 6. Barra dei Punti Ferita (Capsula PV), Auree Mobili e Durate

### 6.1 Barra Vitale a Capsula Sagomata
- **Design a Capsula Dinamica:** La barra della salute è disegnata come una capsula orizzontale compatta posizionata alla base del token. La sua larghezza si calibra automaticamente sul testo numerico per non coprire l'illustrazione della pedina.
- **Sfumatura Cromatica dello Stato di Salute:**
  - **Celeste / Ciano:** 100% della vita (piena salute).
  - **Verde:** Superiore al 66% dei punti ferita.
  - **Giallo:** Tra il 33% e il 66% (ferito / insanguinato).
  - **Rosso:** Inferiore al 33% (stato critico).
  - **Grigio con Teschio (`💀`):** 0 PV o inferiore (creatura svenuta o deceduta).
- **Calcolo Matematico Rapido:** Inserisci un valore nel campo `± Danno` e clicca **`-`** per infliggere danni o **`+`** per applicare cure.
- **Classe Armatura (`🛡️ CA`):** Campo dedicato visualizzato sia sulla pedina che nel Tracker di iniziativa.
- **Modalità di Visualizzazione per i Giocatori (`Stile PV Token`):**
  - `Solo Barra`: Mostra la classica barra orizzontale a capsula.
  - `Solo Alone`: Applica una tinta radiale sfumata direttamente sopra il ritratto del token, il cui colore cambia man mano che subisce ferite (molto suggestivo per evitare metagame matematico).
  - `Barra + Alone`: Mostra contemporaneamente sia la capsula che l'alone.

### 6.2 Auree Mobili Dinamiche e Durata in Round
- Seleziona la casella **✨ Aura** per proiettare un raggio d'effetto circolare attorno al token (ad es. per incantesimi come *Spiriti Guardiani*, *Aura di Vitalità*, *Aura di Protezione del Paladino* o torce).
- **Raggio e Unità:** Impostabile in piedi (`ft`) o metri (`m`).
- **Selettore Cromatico:** Scegli il colore dell'effetto. L'aura viene disegnata con riempimento trasparente al 20% e contorno a 2px che segue fluidamente tutti i movimenti del token.
- **Durata in Round (Timer):** Se l'aura prevede una durata limitata (es. 10 round), puoi impostare il numero di round. Un badge circolare con l'icona della clessidra apparirà sul token scalando automaticamente a ogni avanzamento di turno nel Tracker Iniziativa.

---

## 7. Condizioni di Stato e Stili Grafici

Il programma include tutte le 15 condizioni di stato standard:  
*Accecato (Blinded), Affascinato (Charmed), Afferrato (Grappled), Assordato (Deafened), Avvelenato (Poisoned), Inabile (Incapacitated), Invisibile (Invisible), Paralizzato (Paralyzed), Pietrificato (Petrified), Privo di sensi (Unconscious), Prono (Prone), Spaventato (Frightened), Stordito (Stunned), Trattenuto (Restrained), Sfinimento (Exhaustion)*.

È possibile scegliere la lingua delle condizioni (**IT / EN**), impostare un colore personalizzato e cliccare su **+ Aggiungi**.

### Stili Visivi di Visualizzazione delle Condizioni
Nel menu a tendina *Stile Condizioni Multiple* è possibile scegliere l'aspetto grafico dei badge applicati alla pedina:
1. **Pillole con Nome (`Pillole con Nome`):** Eleganti badge scuri con testo in Title Case e contorno colorato ad alto contrasto, disposti ordinatamente all'interno del token sopra la barra della vita.
2. **Anelli Concentrici (`Anelli Concentrici`):** Anelli orbitali che mostrano il nome della condizione in testo curvo rotante attorno alla pedina.
3. **Anello Singolo a Spicchi (`Anello Singolo a Spicchi`):** Un unico anello esterno suddiviso in sezioni colorate proporzionali al numero di condizioni presenti.
4. **Badge Icone Grandi (`Badge Icone Grandi`):** Cerchietti bianchi ad alto contrasto sovrapposti al bordo del token contenenti l'emoji della condizione ingrandita.
5. **Entrambi (`Anelli + Badge Icone`):** Combina gli anelli orbitali di testo con i badge iconici.

---

## 8. Strumenti Tattici della Barra Laterale

La barra laterale sinistra contiene tutti gli strumenti necessari durante il gioco:
- **🖐️ Muovi/Seleziona:** Seleziona e sposta token e sagome AoE con aggancio magnetico alla griglia. Facendo doppio clic su un token si apre la relativa scheda. Tenendo premuto il clic sinistro (o un tocco lungo di 800ms) su un punto vuoto della mappa si attiva un ping luminoso.
- **⬚ Seleziona (Lazo):** Trascina un riquadro di selezione rettangolare per selezionare più token contemporaneamente e muoverli in gruppo. Tieni premuto `Shift` per aggiungere o rimuovere singoli token dalla selezione.
- **📏 Metro (ft/m):** Linea di misurazione tratteggiata dinamica che calcola in tempo reale la distanza coperta in piedi (`ft`), metri (`m`) e numero di quadretti di griglia (`sq`).
- **💡 Ping Luminoso:** Mirino neon pulsante ad alta visibilità visibile simultaneamente su tutti i monitor di Master e Giocatori per indicare rapidamente un elemento della mappa.
- **🔦 Puntatore Laser:** Traccia una scia luminosa al neon che segue il movimento del mouse o del pennino touch, evaporando gradualmente dopo 5 secondi. Il Master disegna con un laser rosso brillante; ciascun giocatore dispone di un colore personale brillante.
- **📍 Pin Segreto (DM):** Consente al Master di collocare puntine invisibili ai giocatori sulla mappa. Cliccando su un pin si apre un riquadro per annotare informazioni segrete, descrizioni d'ambiente, trappole, CD di percezione e tesori nascosti.
- **✏️ Disegno a Mano Libera:**
  - `Disegna (Tutti)`: Tratto rosso pubblico condiviso con tutti i partecipanti.
  - `Disegna (Solo DM)`: Tratto giallo visibile unicamente sullo schermo del Master (ottimo per pianificare movimenti segreti o segnare pattuglie).
  - Tasti dedicati di cancellazione rapida: `Pulisci Dis. (Pub)` e `Pulisci Dis. (DM)`.

---

## 9. Zone d'Effetto (AoE / Sagome Magiche) e Timer con Clessidra

Il pulsante arancione **🪄 (Zone d'Effetto / Magie)** permette di proiettare sagome grafiche che rappresentano incantesimi, soffi di drago ed esplosioni tattiche:

### Sagome Disponibili
- **Cerchio / Sfera / Cilindro:** Raggio regolabile in piedi o metri (es. *Palla di Fuoco*, *Ragnatela*).
- **Cono:** Si propaga da un vertice di origine con un angolo d'apertura calibrato a 53 gradi (es. *Mani Brucianti*, *Soffio di Drago*).
- **Linea:** Permette di regolare sia la lunghezza sia la larghezza/spessore indipendentemente (es. *Fulmine*, *Muro di Fuoco*).
- **Quadrato / Cubo:** Dimensioni del lato regolabili (es. *Nube Maleodorante*, *Cubo di Forza*).

### Maniglia di Selezione Sagomata e Timer Round con Clessidra
- Cliccando su una sagoma con lo strumento *Muovi*, si apre immediatamente il pannello di modifica.
- **Pulsanti di Rotazione:** Ruota la sagoma a destra o a sinistra tramite i pulsanti rapidi, oppure usa il cursore rotatorio (0° - 360°).
- **Badge di Spostamento Flottante:** Al centro o al vertice della sagoma è presente un badge sagomato che funge da comoda maniglia per afferrare, spostare o modificare l'effetto senza interferire con i token sottostanti.
- **Timer in Round con Clessidra (`⏳`):**
  - Se un incantesimo dura ad esempio 1 minuto (10 round), puoi impostare la durata in round.
  - Sul badge della sagoma compare l'icona della clessidra e il conteggio dei round rimanenti (es. `⏳ 10 R`).
  - Ad ogni avanzamento di round nel Tracker dell'Iniziativa, il conteggio scala automaticamente.
  - Quando il timer si esaurisce (0 round), l'effetto scompare automaticamente dalla mappa.
- **Protezione Totale sotto la Nebbia di Guerra:** Il badge e il timer delle AoE **rispettano scrupolosamente la nebbia di guerra**: se un effetto o una trappola magica si trova sotto la nebbia, i giocatori non vedranno né la sagoma né il pulsante del timer!
- **Creazione Lato Giocatore:** Anche i giocatori possono piazzare sagome dalla propria barra strumenti per mostrare al Master dove intendono lanciare un incantesimo.

---

## 10. Tracker dell'Iniziativa e Gestione del Combattimento

Il pulsante giallo **⚔️ Tracker Iniziativa** apre la console di gestione dei turni e dei round di combattimento:

### 10.1 Gestione dei Partecipanti
- **Aggiunta Rapida:** Seleziona uno o più token sulla mappa e clicca su **`⚔️ + Iniz.`** (il programma ti chiederà il risultato del tiro).
- Importazione automatica del gruppo dei giocatori salvato nel party.
- Pulsante **`+ Aggiungi Entità Extra`** per inserire azioni della tana, pericoli ambientali o PNG di supporto.
- **Raggruppamento Intelligente dei Mostri Simili (`tracker-group-similar`):** Mostri identici (es. 6 Goblin) vengono raggruppati in un unico comodo scomparto a fisarmonica con contatore (`x6`). È possibile impostare l'iniziativa di gruppo o applicare danni collettivi con un solo inserimento!

### 10.2 Controllo dei Turni e Conteggio dei Round
- Clicca su **Avvia Combattimento** per ordinare i combattenti in ordine decrescente di iniziativa.
- Avanza con **`Prossimo Turno ▶`** o retrocedi con **`◀ Precedente`**.
- **Anello Pulsante del Turno Attivo:** Un anello verde neon compare direttamente sulla mappa sotto il token del combattente di turno, rendendo immediatamente chiaro a chi tocca agire.
- **Modifica Rapida PV nel Tracker:** Puoi modificare la salute di qualsiasi creatura direttamente dalla sua riga nel tracker: scrivi ad esempio `+12` o `-18` nel campo dei punti ferita e premi Invio. La vita e la barra del token sulla mappa si aggiorneranno all'istante!
- Icona della Classe Armatura (`🛡️ CA`) ben visibile accanto al nome.

### 10.3 Scalamento Automatico delle Durate e Tasto Ferma / Reset
- Ad ogni passaggio da un round al successivo, il tracker:
  - Riduce automaticamente i round rimanenti di tutte le sagome AoE temporizzate.
  - Riduce i round delle Auree temporizzate sui token.
  - Riduce le condizioni a tempo applicate alle creature.
- **Pulsante Ferma / Reset Iniziativa:** Quando il combattimento si conclude, cliccando su *Ferma / Reset*:
  - L'incontro termina e l'anello del turno attivo viene rimosso dalla mappa.
  - L'elenco dell'iniziativa viene completamente azzerato e svuotato.
  - Tutte le sagome AoE e le auree temporizzate vengono ripulite.
  - La console è immediatamente pronta e azzerata per selezionare un nuovo gruppo di token e avviare il prossimo scontro senza residui del combattimento precedente!

### 10.4 Condivisione e Posizionamento dello Schermo Giocatori
- Spunta **Mostra ai Giocatori** per trasmettere il tracker sui monitor dei giocatori.
- Scegli la posizione di aggancio preferita: `In Alto (Orizzontale)`, `In Basso (Orizzontale)`, `A Sinistra (Verticale)` o `A Destra (Verticale)`.

---

## 11. Scheda Personaggio Completa per Giocatori (PC Sheet)

Il modulo Scheda Personaggio ([js/pcsheet.js](file:///c:/Users/Gerbi/OneDrive/Desktop/App%20GDR/APP%20TABLETOP/js/pcsheet.js)) fornisce una scheda digitale completa in stile quinta edizione, interattiva e ottimizzata per avere zero impatto su memoria e processore:

### 11.1 Sezioni e Schede Tematiche
Facendo doppio clic sul token di un personaggio (o aprendola dal menu), si apre la finestra della scheda articolata in 4 schede:
1. **⚔️ Combattimento:** Punti ferita attuali e massimi, Punti Ferita Temporanei, Dadi Vita, Tiri Salvezza contro la Morte con contatore di successi/fallimenti, Classe Armatura, Velocità, Iniziativa, Caratteristiche (FOR, DES, COS, INT, SAG, CAR) con relativi modificatori e tiri salvezza, Abilità con competenze e maestrie, Armi e Attacchi con pulsanti di tiro con 1 clic.
2. **✨ Incantesimi:** Gestione completa degli slot incantesimi (inclusa tabella di progressione multiclasse), filtro rapido *Tutti / Preparati*, Classe Difficoltà (CD), modificatore di attacco magico e schede dettagliate degli incantesimi con lancio interattivo del danno o della cura.
3. **📜 Privilegi & Tratti:** Tratti di classe, privilegi di razza, talenti e note speciali espandibili con un clic.
4. **🎒 Inventario:** Elenco dell'equipaggiamento, monete (MO, MA, MR, MP, ME), oggetti magici sintonizzati e carico trasportato.

### 11.2 Modalità di Lancio con 1 Clic (Normale / Vantaggio / Svantaggio)
In cima alla scheda sono presenti tre selettori rapidi:
- **Normale:** Lancia 1d20 + bonus.
- **Vantaggio:** Lancia due d20 tenendo automaticamente il valore più alto.
- **Svantaggio:** Lancia due d20 tenendo automaticamente il valore più basso.
Tutti i tiri eseguiti dalla scheda (prove di caratteristica, tiri salvezza, tiri per colpire e formule del danno) vengono inviati direttamente nel registro della chat di gioco con formattazione elegante!

### 11.3 Sincronizzazione con il Token e Backup Indipendente
- La scheda è collegata bidirezionalmente con il token sulla mappa: modificare i punti ferita nella scheda aggiorna la capsula della vita della pedina in tempo reale.
- **Backup Singoli e Multipli:** Nel pannello Regia & Campagna sono disponibili i comandi **Esporta tutti i PG** e **Importa file PG**, permettendo a ciascun giocatore di salvare e ricaricare il proprio personaggio come singolo file autonomo.

---

## 12. Compendio Mostri, Importazione JSON e Statblock Interattivi

La finestra compendio (**📜 Compendio & Scheda Mostro**) permette di consultare schede complete di avversari ed effettuare qualsiasi tiro con un singolo tocco.

### 12.1 Ricerca Online SRD
- Cerca qualsiasi mostro ufficiale di pubblico dominio digitando il nome in inglese (es. *Goblin, Skeleton, Adult Red Dragon*).
- Se incolli nella barra di ricerca l'indirizzo web di una scheda mostro da un bestiario online compatibile, il programma estrae automaticamente il nome pulito della creatura e avvia la ricerca all'istante.

### 12.2 Importazione JSON Intelligente con Pulizia Tag
Clicca su **📥 Incolla JSON** per importare mostri creati con database o generatori personalizzati:
1. Incolla il testo JSON del mostro nell'area di testo.
2. **Motore di Pulizia Automatica dei Tag:** Il programma converte automaticamente tutti i codici di formattazione interni in testo elegante e comprensibile:
   - `{@atk mw}` $\rightarrow$ *Attacco con Arma da Mischia:*
   - `{@h}` $\rightarrow$ *Colpisce:*
   - `{@hit 6}` $\rightarrow$ *+6 per colpire*
   - `{@damage 2d8+4}` $\rightarrow$ *2d8+4*
   - `{@dc 15}` $\rightarrow$ *CD 15*
3. **Incolla Immagine da Appunti (`Ctrl+V`) o Drag & Drop:** Fai clic destro su qualsiasi illustrazione da internet, seleziona *"Copia immagine"*, quindi premi semplicemente **`Ctrl+V`** nella finestra di importazione. Puoi anche trascinare un file immagine direttamente dal computer.

### 12.3 Tiri Interattivi con 1 Clic
Tutti i valori della scheda del mostro sono bottoni interattivi:
- Clicca su una caratteristica o tiro salvezza per lanciare 1d20 + modificatore.
- Clicca su `🎲 +X per colpire` per lanciare l'attacco.
- Clicca su `🎲 XdY+Z` per calcolare automaticamente il tiro del danno.

### 12.4 Tiri Pubblici o Segreti del Master
- La casella **`👁️ Invia tiri ai Giocatori`** è sincronizzata tra la chat, il compendio mostri e il pannello dadi.
- Se attiva, il tiro viene trasmesso ai giocatori.
- Se disattivata, il tiro resta privato per il Master, colorato in viola scuro e contrassegnato dalla dicitura `(🔒 Segreto DM)`.

### 12.5 Assegnazione o Creazione Pedina Istantanea
- **`⚡ Assegna al Token Selezionato`:** Applica nome, PV massimi, CA e scheda del mostro alla pedina selezionata sulla mappa.
- **`♟️ Crea Token`:** Spawna direttamente una nuova pedina sulla plancia con il ritratto grafico, la taglia e tutte le statistiche del mostro pronte all'uso.

---

## 13. Lanciatore di Dadi e Registro Chat

I pannelli flottanti **🎲 Dadi** e **💬 Chat** gestiscono i lanci digitali del tavolo:

### 13.1 Console di Lancio dei Dadi
- **Tipologie di Dadi:** d4, d6, d8, d10, d12, d20, d100.
- **Composizione della Riserva (Dice Pool):** Clicca sui dadi desiderati per accumularli nel lancio (es. 2d6 + 1d8 + 1d20). I quadratini gialli indicano la quantità selezionata. Facendo clic destro su un dado se ne riduce la quantità di uno.
- **Modificatore Fisso (`+/-`):** Aggiungi bonus o penalità numeriche al tiro.
- **Applicazione del Modificatore:**
  - `Al Totale`: Somma il bonus al risultato complessivo (calcolo standard dei danni).
  - `A ciascun dado`: Applica il modificatore a ogni singolo dado del tiro (ideale per prove multiple o tiri contrapposti).
- **Ripeti Ultimo Lancio (`🔄 Ripeti`):** Rilancia l'ultima formula configurata con un clic.
- **Evidenziazione Automatica dei Critici:**
  - Naturale 20 sul d20: Bordo verde brillante con stendardo `★ Naturale 20! ★`.
  - Naturale 1 sul d20: Bordo rosso con stendardo `⚠ Naturale 1! ⚠`.

---

## 14. Condivisione Immagini Handout (Indizi Visivi)

Un *Handout* è qualsiasi documento visivo, lettera pergamenata, mappa del tesoro, ritratto di un PNG o illustrazione che il Master desidera mostrare a tutti i giocatori sul loro schermo:
1. Nel pannello **🗺️ Mappa & Griglia**, clicca su **🖼️ Condividi Immagine Handout**.
2. Seleziona l'immagine dal computer.
3. Si aprirà la finestra Handout del Master con l'anteprima. Clicca su **Trasmetti ai Giocatori**.
4. L'immagine apparirà in primo piano sugli schermi di tutti i giocatori preservando le proporzioni originali.
5. **Sincronizzazione Live di Posizione e Dimensione:** Se il Master sposta o ridimensiona la finestra dell'immagine sul proprio monitor, la nuova geometria può essere replicata in tempo reale sugli schermi dei giocatori!
6. Clicca su **Chiudi per Tutti** per rimuovere l'illustrazione dagli schermi di tutta la tavolata.

---

## 15. Regia Sonora: BGM, Playlist e Soundboard Procedurale Offline

Il pulsante circolare viola **🎵 (Audio & Soundboard)** apre la console sonora integrata:

### 15.1 Musica d'Ambiente e Sottofondo (BGM)
- **Atmosfere Predefinite pronte all'uso:** Taverna, Foresta, Dungeon, Pioggia, Tempesta, Combattimento e altre colonne sonore.
- **Stream Web e Brani dal PC:** Incolla qualsiasi link audio online (`.mp3`, `.ogg`) o seleziona un file musicale dal disco del computer (`📁 Scegli File PC`).
- **Controlli di Riproduzione:** Play, Pausa, Riprendi, Stop e selettore Loop Continuo.
- **Playlist Personalizzate:** Salva i tuoi brani preferiti creando playlist tematiche con il tasto `+ Playlist`.

### 15.2 Soundboard a Sintesi Procedurale (100% Offline e Zero Banda)
Il software include una soundboard speciale che genera effetti sonori istantanei sfruttando l'API nativa `Web Audio` del browser. Non scarica file audio e non consuma banda internet, funzionando anche in totale assenza di rete:
- ⚔️ **Fendente di Spada**
- 💥 **Esplosione**
- ⚡ **Tuono / Fulmine**
- ✨ **Bagliore Magico**
- 🔔 **Rintocco di Campana**
- 🦁 **Ruggito di Mostro**
- 🎺 **Fanfara di Vittoria**
- 🚪 **Porta Cigolante**

### 15.3 Volume e Indipendenza Audio per i Giocatori
- I giocatori hanno a disposizione un pulsante **🔊 Audio** sulla propria interfaccia.
- Ciascun giocatore può regolare il proprio volume d'ascolto personale (con limite di sicurezza impostato al 20% per evitare picchi improvvisi) o attivare il tasto **Muto** senza interferire con gli altri giocatori o con il Master.

---

## 16. Regia & Campagna: Mappe, Cartelle e Salvataggi

La gestione completa dell'archivio si trova nel pannello **⚙️ Regia & Campagna**:

### 16.1 Gestione delle Campagne
- **Nuova / Salva Campagna:** Consente di tenere separate le avventure (es. una campagna horror gotica e una campagna fantasy classica).
- **Esporta / Importa JSON:** Esporta l'intera campagna (tutte le mappe, i token, le nebbie, i disegni e le playlist audio) in un unico file portatile `.json`. Puoi trasferire la tua intera campagna su un altro computer semplicemente reimportando il file.

### 16.2 Organizzazione Mappe in Cartelle
- **Creazione Cartelle:** Organizza le mappe in cartelle tematiche (es. *Dungeon Livello 1*, *Città*, *Taverna*, *Foresta*).
- **Pulsanti di Gestione Mappa:**
  - `Carica`: Carica la mappa selezionata direttamente sulla plancia di gioco.
  - `Salva`: Sovrascrive la mappa corrente salvando lo stato dei token, delle sagome e della nebbia.
  - `Salva Nuova`: Salva lo stato attuale della plancia come nuova mappa all'interno della cartella attiva.
  - `Sposta in...`: Sposta una mappa da una cartella all'altra.
  - `Elimina Mappa`: Rimuove la mappa dall'archivio locale.

---

## 17. Supporto Completo Touchscreen & Tablet (iPad / Android)

Il programma è interamente ottimizzato per essere utilizzato con le dita o pennini touch su tablet e schermi touch:
- **Pinch-to-Zoom e Scorrimento a Due Dita:** Allargando o stringendo due dita sullo schermo, la mappa si ingrandisce o rimpicciolisce con estrema fluidità attorno al punto medio tra le dita. Durante il gesto a due dita i falsi ping vengono automaticamente cancellati.
- **Doppio Tocco (Double-Tap) sui Token:** Toccando due volte rapidamente una pedina con il dito, si apre direttamente la sua Scheda Personaggio o lo Statblock del Mostro.
- **Spostamento delle Finestre Flottanti a Tocco:** Tutte le finestre (Libreria Token, Mappa, Regia, Compendio, Schede PG, Dadi, Chat, Iniziativa, Handout) possono essere spostate trascinando la barra del titolo con il dito a 60/120 FPS senza rallentamenti o interferenze con lo scorrimento del browser (`touch-action: none`).
- **Drag & Drop e Selezione a Prova di Finestra:** Durante il trascinamento di una pedina o di una sagoma, il cursore può passare sopra qualsiasi finestra aperta senza bloccare o interrompere il movimento.

---

## 18. Tabella Scorciatoie da Tastiera e Controlli Rapidi

| Tasto / Gesto | Ambito | Funzione |
| :--- | :--- | :--- |
| **Clic Sinistro + Trascina** | Mappa / Strumento Muovi | Sposta token, sagome AoE, traccia disegni o pennella la nebbia. |
| **Clic Centrale / Destro + Trascina** | Mappa | Trascina e fa scorrere la telecamera della mappa (Pan). |
| **Due Dita (Pinch / Drag)** | Tablet Touchscreen | Zoom progressivo e scorrimento della mappa centrato sulle dita. |
| **Rotella del Mouse** | Mappa su PC | Zoom progressivo centrato sulla posizione del puntatore. |
| **Clic Sinistro Prolungato (800ms)** | Strumento Muovi | Attiva un mirino luminoso (Ping) visibile a tutti i presenti. |
| **Doppio Clic / Doppio Tocco sul Token** | Token | Apre all'istante la Scheda Personaggio o lo Statblock associato. |
| **`Ctrl + D`** | Token | Duplica la pedina selezionata incrementandone il progressivo numerico. |
| **`Shift + Clic Sinistro`** | Selezione Token | Aggiunge o toglie singoli token dalla selezione multipla. |
| **Clic Destro sul Dado** | Pannello Dadi | Diminuisce di 1 la quantità di quel dado dal pool di lancio. |
| **Tasto `H`** | Schermo Giocatore | Mostra o nasconde la barra comandi fluttuante dei giocatori. |
| **Tasto `F11`** | Browser | Attiva/Disattiva la modalità a tutto schermo senza bordi (ideale per TV). |

---

# Part II: English Comprehensive Manual

## 1. Introduction & Core Architecture

**APP TABLETOP** is a modern, high-performance, browser-native Virtual Tabletop (VTT) designed to run tabletop role-playing games (such as the 5th edition of the world's most famous fantasy RPG, d20 systems, and homebrew adventures) both in-person around a physical TV table and online with remote players.

A Virtual Tabletop replaces physical paper battlemats, plastic miniatures, rulers, and thick rulebooks with an interactive digital game board. You can load high-resolution artwork, place virtual creature tokens, manage fog of war, track hit points, roll digital dice, and automate combat turn order, auras, and spell templates.

### Architectural Highlights
- **100% Client-Side:** No external servers, database installations, Node.js daemons, or mandatory cloud accounts required. Simply open `index.html` (DM Dashboard) or `player.html` (Player Screen) in any modern browser (Chrome, Edge, Firefox, Safari).
- **Multi-Layered HTML5 Canvas Architecture:** Decoupled rendering layers (Map background, tactical Grid, AoE Spell shapes, Tokens, Public drawings, Secret DM drawings, Fog of War, and UI overlay) guarantee a rock-solid **60/120 FPS experience** with minimal RAM and CPU consumption.
- **IndexedDB Persistence:** High-capacity local browser storage reliably saves entire campaigns, battlemaps, token graphics, character sheets, and fog masks across game sessions without data loss.
- **Non-Blocking Window Dragging (`vtt-dragging`):** When moving tokens, lasso-selecting groups, or panning the view, hovering over floating windows or panels never interrupts or drops the drag action.

---

## 2. Multiplayer Modes (P2P, Local TV & Local Wi-Fi Testing)

### 2.1 Online Peer-to-Peer Multiplayer (WebRTC)
Connect remote players worldwide directly without middleman servers:
1. The DM opens `index.html`.
2. Click the cyan floating button **⚙️ (Director & Campaign)** in the bottom-right corner.
3. In the **Online Multiplayer (P2P)** card, click **Start Online Room**.
4. An alphanumeric room code is generated (e.g. `ABCD-1234`).
5. Share the generated link or room code with your players.
6. Players open `player.html`, enter their nickname and the room code (or click `player.html?room=ABCD-1234`), then click **Connect Online**.
7. Connected players immediately appear in the DM party status list.

### 2.2 Local TV / Second Monitor Mode (Zero-Latency Offline)
Perfect for in-person tabletop sessions using a television or secondary display:
1. In the **⚙️ Director & Campaign** panel, click **🖥️ Open Players Screen (TV / 2nd Monitor)**.
2. A window opens calibrated specifically for TV presentation (`player.html?mode=tv`).
3. Communication uses the browser's native `BroadcastChannel('vtt_channel')`, achieving instant, zero-latency synchronization **100% offline** without needing internet access.
4. Drag the window onto your gaming table TV and press `F11` for borderless fullscreen immersion.

### 2.3 Instant Local Wi-Fi Testing Server (`_server_test/`)
Test the game on iPads, Android tablets, or phones over your home Wi-Fi network without publishing files online:
1. Double-click **`Avvia Test VTT`** on your Desktop (or run `_server_test/AVVIA_SERVER_TEST.bat`).
2. The server detects your PC's local Wi-Fi IP and opens an intuitive connection dashboard ([connect.html](file:///c:/Users/Gerbi/OneDrive/Desktop/App%20GDR/APP%20TABLETOP/_server_test/connect.html)).
3. Point your tablet's camera at the **QR Code** for either the DM Screen or Player Screen to open the game in Safari or Chrome.
4. Includes automatic **No-Cache headers**: whenever you edit files on your PC, simply tap *Refresh* on the tablet to load the newest code instantly!
5. To stop the server, simply close the black terminal window on your PC.

---

## 3. Map, Grid & Advanced Alignment Calibration

All battlemap options are managed via the green floating button **🗺️ (Map & Grid)** and the **📐 Align Grid** tool on the sidebar.

### 3.1 Loading Battlemaps
- Click **📁 Load Map from PC** to select any `.jpg`, `.png`, `.webp`, or `.svg` image file.
- The image automatically scales, centers, and stores inside the active map slot of your campaign.

### 3.2 Synchronized View & Permissions
- **Sync Players View (Pan/Zoom):** When checked, camera zooming or panning performed by the DM is mirrored across all player screens in real-time.
- **Lock Player Map:** Disables player camera panning, keeping their viewport locked strictly to the DM's presentation.
- **Lock DM Map Movement:** Prevents accidental map dragging while selecting and moving tokens.
- **Hide Player Toolbar (TV Mode):** Removes player bottom docks for a clean map presentation on table monitors.

### 3.3 Grid Calibration
- **Cell Size (px):** Adjust grid square sizes (20px to 300px, standard: 70-100px).
- **Non-Destructive Scaling:** Modifying cell sizes recalculates token scales and positions based on exact cell column and row coordinates, preventing cumulative rounding drift.
- **Grid Color & Glow:** Customizable line colors and glow outlines (`None`, `White`, `Black`) ensure visibility over any battlemap art.

### 3.4 Align Grid with Object Anchoring (`⚓ Anchor Objects to Grid`)
When aligning the virtual grid over pre-gridded map art:
1. Select the **📐 Align Grid** tool from the sidebar.
2. Drag the map to shift the virtual grid lines until they align with the artwork tiles.
3. **`⚓ Anchor Objects to Grid` Checkbox (Enabled by Default):**
   - **When Checked:** All deployed tokens, auras, AoE templates, notes, and DM pins **shift simultaneously in unison**, remaining locked to their battlemap squares.
   - **When Unchecked:** Only the virtual grid lines move, allowing recalibration without disturbing token placement.

---

## 4. Dynamic Fog of War (Masking Engine)

Fog of War conceals unexplored dungeons from player view:
- **Cover All with Fog:** Blankets the entire map in an opaque black shroud.
- **Remove All Fog:** Clears all darkness.
- **Erase Fog Tool (`Cancella Nebbia`):** Reveals sightlines, corridors, and rooms to players as you drag across the canvas.
- **Add Fog Tool (`Aggiungi Nebbia`):** Restores darkness over previously revealed terrain.
- **Brush Controls:** Switch between **Circle** (for organic caves and lanterns) and **Square** (for rectangular rooms), with adjustable size (30px to 400px) and live hovering preview.
- Fog alterations compress into lightweight Base64 masks synchronized instantly across P2P and local channels.

---

## 5. Token Management & Token Library

### 5.1 Token Library Panel (`♟️ Libreria Token`)
Click the dark teal button **♟️** on the dock or **♟️ Library & New Tokens** on the sidebar:
- **Folder Upload (`📁 Cartella PC`):** Select an entire folder from your computer to import creature portraits in a single click.
- **Single Files (`🖼️ File Singoli`):** Pick one or multiple individual images.
- **Drag & Drop:** Drop image files or folders directly into the library window.
- **Library Tabs:** `On Map` (active tokens), `Library` (persistent collection), `Monsters` (compendium shortcut).
- **Instant Search:** Filter tokens by character or monster name.

### 5.2 Deployment Defaults
Pre-configure token parameters before placing them onto the map:
- **Size Multiplier:** Medium (1x1), Large (2x2), Huge (3x3), Gargantuan (4x4).
- **Initial Visibility:** Visible (`👁️`) or Hidden (`🙈`).
- **Default HP:** Pre-fill starting hit points.

### 5.3 Selected Token Inspector
Selecting a token displays its property panel:
- **Nameplate Visibility:** `All` (visible to everyone), `DM Only` (highlighted with an exclusive purple border visible only to the Master), or `Off`.
- **Double-Click Direct Access:** Double-clicking (or double-tapping on tablet) any token on the board opens its attached Character Sheet or Monster Statblock instantly!
- **Auto-Numbering Clones:** Deploying multiple tokens of the same creature (e.g. Goblin) automatically assigns sequential names: *Goblin 1, Goblin 2, Goblin 3*.
- **Ownership Assignment:** Assign a token to a connected player so only that player (and the DM) can move it.
- **Duplicate (`Ctrl+D`):** Clones the token at a slight offset, copying maximum HP, AC, conditions, art, and attached sheets while advancing the sequence number.
- **Visibility Toggle (`👁️ Visib.`):** Toggle token visibility on player screens with one click.
- **Add to Initiative (`⚔️ + Iniz.`):** Prompts for an initiative roll and transfers the token directly into the combat tracker.
- **Delete (`Delete` key):** Removes the token from the board.

---

## 6. Hit Point Capsule, Mobile Auras & Round Durations

### 6.1 Pill-Shaped Health Capsule
- **Dynamic Capsule Geometry:** The health bar is rendered as a sleek horizontal capsule anchored to the bottom of the token, dynamically adjusting its width to the HP text to avoid obscuring character artwork.
- **Color Coding:**
  - Cyan: 100% full health
  - Green: Above 66% health
  - Yellow: 33% to 66% health (bloodied)
  - Red: Under 33% health (critical)
  - Grey with Skull (`💀`): 0 HP or dead
- **Quick Math Modifiers:** Type a number in `± Danno` and press **`-`** (Damage) or **`+`** (Heal).
- **Armor Class (`🛡️ CA`):** Dedicated AC badge displayed on the token and inside the initiative tracker.
- **Player Display Modes (`Stile PV Token`):** `Bar`, `Aura Tint` (ambient damage tint over token artwork), or `Both`.

### 6.2 Mobile Auras & Round Timers
- Check **✨ Aura** to project an area of effect around the token (e.g. *Spirit Guardians*, *Paladin Aura of Protection*).
- **Radius & Units:** Configurable size in feet (`ft`) or meters (`m`) with custom colors and 20% transparent fill.
- **Round Duration (Timer):** Set a duration in rounds. A circular countdown badge appears on the token, decrementing automatically whenever rounds advance in the initiative tracker.

---

## 7. Status Conditions & Visual Styles

Provides the 15 standard RPG conditions: *Blinded, Charmed, Grappled, Deafened, Poisoned, Incapacitated, Invisible, Paralyzed, Petrified, Unconscious, Prone, Frightened, Stunned, Restrained, Exhaustion*.

Select language (**IT / EN**), pick a color, and click **+ Add**.

### Condition Visual Styles
1. **Pills with Name:** Dark pill badges with Title Case text and colored borders inside the token.
2. **Concentric Rings:** Orbiting radial rings displaying rotating curved text.
3. **Segmented Ring:** A single outer ring divided into colored segments.
4. **Large Badges:** High-contrast white circular badges with enlarged emoji icons.
5. **Both:** Combines concentric rings with icon badges.

---

## 8. Sidebar Tactical Tools

- **🖐️ Move / Select:** Select and move tokens and AoE templates with grid snapping. Double-click opens sheets. Long-press (800ms) sends an illuminated ping.
- **⬚ Lasso Multi-Select:** Drag a rectangular marquee over multiple tokens for group movement. Hold `Shift` to add/remove individual tokens.
- **📏 Ruler (ft/m):** Dashed measurement line showing distance in feet (`ft`), meters (`m`), and grid squares (`sq`).
- **💡 Ping System:** High-visibility neon beacon visible across all DM and player screens.
- **🔦 Laser Pointer:** Evanescent neon trail that follows your cursor/stylus and evaporates after 5 seconds.
- **📍 Secret DM Pins:** Click anywhere on the map to place pins invisible to players for secret descriptions, room triggers, and trap DCs.
- **✏️ Freehand Drawing:**
  - `Draw (All)`: Public red pencil shared with everyone.
  - `Draw (DM Only)`: Private yellow pencil visible only on the DM screen.
  - Quick cleanup with `Clear Draw (Pub)` and `Clear Draw (DM)`.

---

## 9. Area of Effect (AoE / Spell Shapes) & Timers

The orange button **🪄 (AoE / Spell Zones)** manages spell templates:
- **Shapes:** Circle / Sphere / Cylinder, Cone (53° spread), Line (independent length and width), Square / Cube.
- **Dimensions & Units:** Configurable in feet or meters with color picker and opacity.
- **Rotation Controls:** Rotate clockwise/counter-clockwise with buttons or the 0°-360° slider.
- **Interactive Move Badge & Round Timers (`⏳`):**
  - AoE shapes feature a central/vertex handle to grab and move the shape without interfering with tokens underneath.
  - Set a duration in rounds: an hourglass badge displays remaining rounds (e.g. `⏳ 10 R`).
  - Round timers decrement automatically with initiative turns and expire when completed.
  - **Complete Fog of War Protection:** AoE handles and timers are hidden under fog of war, ensuring secret spell traps remain hidden from players.
- **Player Spawning:** Players can spawn their own AoE templates from their toolbar.

---

## 10. Initiative Tracker & Combat Engine

The golden **⚔️ Initiative Tracker** button opens the combat console:
- **Adding Combatants:** Select tokens and click **`⚔️ + Iniz.`**, auto-import persistent party members, or click **`+ Add Extra Entity`**.
- **Monster Grouping (`tracker-group-similar`):** Identical creatures (e.g. 6 Goblins) group into an accordion item (`x6`) with shared group HP and initiative controls.
- **Turn & Round Progression:** Click **Start Combat** to sort descending. Advance with **`Next Turn ▶`** or reverse with **`◀ Previous`**.
- **Active Turn Highlight:** A green pulsating neon ring appears under the active combatant's token directly on the battlemap.
- **In-Tracker HP Math:** Type `+10` or `-15` into any HP field and press Enter to adjust token health immediately.
- **Auto-Timers:** Decrements active condition rounds, aura timers, and AoE shape durations on round advancement.
- **Stop / Reset Encounter:** Clicking *Ferma / Reset* ends combat, clears the participant list, removes turn rings, and removes timed spell effects—readying the tracker for the next encounter immediately.
- **Player Sharing & Docking:** Share to player screens and dock `Top`, `Bottom`, `Left`, or `Right`.

---

## 11. Player Character Sheet (PC Sheet)

The Character Sheet module ([js/pcsheet.js](file:///c:/Users/Gerbi/OneDrive/Desktop/App%20GDR/APP%20TABLETOP/js/pcsheet.js)) provides an interactive, zero-overhead 5e-compatible character sheet:
- **Four Dedicated Tabs:**
  1. **⚔️ Combat:** Current/Max HP, Temp HP, Hit Dice, Death Saves counter, Armor Class, Speed, Initiative, Abilities (STR, DEX, CON, INT, WIS, CHA) with saving throws, Skills with proficiency/expertise markers, Weapons & Attacks with 1-click rolls.
  2. **✨ Spells:** Spell slot progression (including multiclass tables), prepared spells filter, Spell Save DC, spell attack bonus, and spell cards with interactive damage/healing buttons.
  3. **📜 Features & Traits:** Class features, racial traits, feats, and expandable notes.
  4. **🎒 Inventory:** Equipment inventory, coin purse (CP, SP, EP, GP, PP), attuned magic items, and carry weight.
- **1-Click Rolls with Advantage / Normal / Disadvantage:** Switch roll modes at the top of the sheet; all rolls format beautifully into the chat log.
- **Bidirectional Token Sync:** Editing HP in the sheet updates the token's health capsule on the map.
- **Independent Character Backups:** Export and import individual character files via the Director & Campaign panel.

---

## 12. Monster Compendium, JSON Import & Interactive Statblocks

The compendium window (**📜 Compendio & Scheda Mostro**) offers monster statblocks with 1-click dice rolling:
- **Online SRD Search:** Look up official open-content monsters (e.g. *Goblin, Adult Red Dragon*). Pasting online web URLs automatically extracts creature names and runs the search.
- **Smart JSON Import with Tag Cleaner:**
  - Paste monster JSON data from homebrew tools.
  - Automatically cleans internal markup: `{@atk mw}` $\rightarrow$ *Melee Weapon Attack:*, `{@h}` $\rightarrow$ *Hit:*, `{@hit 5}` $\rightarrow$ *+5 to hit*, `{@damage 2d6+3}` $\rightarrow$ *2d6+3*, `{@dc 14}` $\rightarrow$ *DC 14*.
  - Paste token artwork directly from your clipboard (**`Ctrl+V`**) or drag-and-drop image files.
- **1-Click Rolls:** Click stats, saving throws, attack bonuses, or damage dice to roll directly to the chat log.
- **Public vs Secret DM Rolls:** Toggle **`👁️ Send rolls to Players`** to keep DM monster rolls private (`(🔒 Segreto DM)`).
- **Spawn or Assign:** Click **`⚡ Assign to Selected Token`** or **`♟️ Create Token`** to generate a battle-ready miniature on the map.

---

## 13. Virtual Dice Roller & Chat Log

- **Dice Types:** d4, d6, d8, d10, d12, d20, d100.
- **Dice Stacking:** Click dice to build a pool (e.g. 2d6 + 1d8). Right-click a die to decrement.
- **Modifiers:** Add flat bonuses applied to the total or to each individual die.
- **Reroll Button (`🔄 Ripeti`):** Repeat the last roll configuration with one click.
- **Automatic Critical Alerts:** Highlighted Natural 20s and Natural 1s.
- **Chat Log:** History of rolls and secret DM rolls with clear formatting.

---

## 14. Visual Handout Image Sharing

Share visual handouts (letters, NPC portraits, quest maps, artifacts) with players:
1. In the **🗺️ Map & Grid** panel, click **🖼️ Share Handout Image**.
2. Select any image from your computer.
3. Click **Transmit to Players** to display it across all player screens with preserved aspect ratios.
4. **Live Geometry Synchronization:** Resizing or moving the DM handout window updates player screens in real-time.
5. Click **Close for All** to dismiss the image from all screens.

---

## 15. Audio Engine, BGM & Procedural Offline Soundboard

- **Background Atmospheres (BGM):** Tavern, Forest, Dungeon, Rain, Storm, Battle, and custom web streams or hard drive audio files (`.mp3`, `.ogg`) with continuous looping and custom playlists.
- **Procedural Soundboard (100% Offline & Zero Bandwidth):** Generates real-time sound effects using the browser's native Web Audio API oscillators:
  - ⚔️ Sword Clash, 💥 Explosion, ⚡ Thunder, ✨ Magic Shimmer, 🔔 Temple Bell, 🦁 Beast Roar, 🎺 Victory Fanfare, 🚪 Creaky Door.
- **Independent Player Audio:** Players can adjust their personal volume (capped at a safe 20% limit) or toggle mute without affecting others.

---

## 16. Campaign Management, Map Folders & Storage

- **Campaign Management:** Create separate campaigns for different adventures. Export and import entire campaigns as portable `.json` files.
- **Map Folder Organization:** Organize maps into folders (e.g. *Level 1 Keep*, *Caverns*, *Town*).
- **Slot Controls:** Load, Save, Save New, Move to folder, and Delete map slots.

---

## 17. Tablet & Touchscreen Optimization (iPad / Android)

- **Two-Finger Pinch-to-Zoom & Pan:** Smooth zoom and pan centered on touch midpoints without accidental ping triggers.
- **Double-Tap Token Access:** Double-tapping tokens opens attached Character Sheets or Monster Statblocks immediately.
- **Touch Window Dragging:** All floating windows can be dragged by touching their headers (`touch-action: none`) at 60/120 FPS.
- **Non-Interfering Drag Operations:** Window layers become transparent to pointer events during dragging, ensuring fluid movement across the canvas.

---

## 18. Keyboard Shortcuts & Controls Reference

| Key / Gesture | Scope | Action |
| :--- | :--- | :--- |
| **Left Click + Drag** | Map / Move | Moves tokens, AoE templates, or draws fog/strokes. |
| **Middle / Right Click + Drag** | Map | Pans the camera view across the battlemap. |
| **Two Fingers (Pinch / Drag)** | Tablet Touchscreen | Smoothly zooms and pans the map centered on fingers. |
| **Mouse Wheel** | Map on PC | Smoothly zooms centered on the cursor position. |
| **Long Left-Click (800ms)** | Move Tool | Triggers an illuminated ping beacon visible to all. |
| **Double-Click / Double-Tap on Token** | Tokens | Opens the attached Character Sheet or Monster Statblock. |
| **`Ctrl + D`** | Tokens | Duplicates selected tokens with incremented numbering. |
| **`Shift + Left Click`** | Token Selection | Adds or removes tokens from multi-token selection. |
| **Right Click on Die Button** | Dice Panel | Decrements the count of that die type from the pool. |
| **`H` Key** | Player View | Shows or hides the player floating bottom toolbar. |
| **`F11` Key** | Browser | Toggles borderless fullscreen mode (ideal for TV screens). |

---

*Buone avventure e tiri fortunati con APP TABLETOP! / Happy adventures and lucky rolls with APP TABLETOP!*
