// js/systems/7thsea/data.js
// Database Ufficiale Completo 7th Sea (2ª Edizione - Need Games)
window.SEVENTH_SEA_DATA = {
  "traits": [
    "Vigore",
    "Grazia",
    "Risolutezza",
    "Acume",
    "Panache"
  ],
  "skills": [
    "Allettare",
    "A.d. Guerra",
    "Atletica",
    "Cavalcare",
    "Convincere",
    "Empatia",
    "Esibirsi",
    "Furto",
    "Intimidire",
    "Istruzione",
    "Mira",
    "Mischia",
    "Nascondersi",
    "Navigazione",
    "Notare",
    "Rissa"
  ],
  "skill_ranks": {
    "3": "Ritira un singolo dado non combinato",
    "4": "Somma di 15 = 2 Incrementi",
    "5": "I 10 esplodono (+1d10)"
  },
  "nations": [
    "Avalon",
    "Castille",
    "Eisen",
    "Inismore",
    "Le Marche delle Highland",
    "Montaigne",
    "Confederazione Sarmatiana",
    "Ussura",
    "Vestenmennavenjar",
    "Vodacce"
  ],
  "death_spiral": [
    {
      "rank": 1,
      "name": "1ª Ferita Drammatica",
      "effect": "+1 Dado Bonus a tutti i Rischi"
    },
    {
      "rank": 2,
      "name": "2ª Ferita Drammatica",
      "effect": "I Malvagi ottengono +2 Dadi Bonus"
    },
    {
      "rank": 3,
      "name": "3ª Ferita Drammatica",
      "effect": "Tutti i 10 esplodono"
    },
    {
      "rank": 4,
      "name": "4ª Ferita Drammatica",
      "effect": "Inerme"
    }
  ],
  "arcana": [
  {
    "arcanum": "Il Matto",
    "virtue": "Scaltro",
    "virtueDesc": "Attivando questa Virtù, l'Eroe può sfuggire al pericolo nella Scena in corso. Potrà salvare solo se stesso.",
    "hubris": "Curioso",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando investiga su qualcosa di inusuale, specialmente se pericoloso."
  },
  {
    "arcanum": "La Strada",
    "virtue": "Amichevole",
    "virtueDesc": "Attivando questa Virtù quando l'Eroe incontra un personaggio per la prima volta, anche un Malvagio, questi lo tratterà amichevolmente per una Scena.",
    "hubris": "Insicuro",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando decide di non essere in grado di compiere un'azione senza l'aiuto di un altro personaggio. Per esempio potrebbe insistere perché questi spenda un Punto Eroe per fornirgli Dadi Bonus, oppure affinché usi uno dei suoi Vantaggi per aiutarlo."
  },
  {
    "arcanum": "Il Mago",
    "virtue": "Determinato",
    "virtueDesc": "L'Eroe deve indicare un Malvagio presente quando attiva questa Virtù. Fino alla fine della Scena, l'Eroe non può spendere Punti Eroe, ma il Malvagio non potrà spendere Punti Pericolo.",
    "hubris": "Ambizioso",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando insegue il potere mettendosi in pericolo o causando guai."
  },
  {
    "arcanum": "Gli Amanti",
    "virtue": "Appassionato",
    "virtueDesc": "L'Eroe può attivare questa Virtù per negare le Ferite subite da un altro Eroe nel momento in cui vengono inflitte. Chi attiva la Virtù subisce invece una Ferita Drammatica automatica.",
    "hubris": "Divisi dal Destino",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe ogni volta che si innamora di qualcuno di cui non dovrebbe."
  },
  {
    "arcanum": "La Ruota",
    "virtue": "Fortunato",
    "virtueDesc": "L'Eroe può attivare questa Virtù per ritardare un'Opportunità o una Conseguenza di 1 Azione.",
    "hubris": "Sfortunato",
    "hubrisDesc": "L'Eroe riceve 1 Punto Eroe aggiuntivo ogni volta che decide di fallire volontariamente un Rischio importante senza lanciare i dadi."
  },
  {
    "arcanum": "Il Diavolo",
    "virtue": "Astuto",
    "virtueDesc": "L'Eroe può attivare questa Virtù dopo che un Malvagio ha speso degli Incrementi per un'Azione. L'Azione fallirà automaticamente, ma gli Incrementi saranno spesi comunque.",
    "hubris": "Fiducioso",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato."
  },
  {
    "arcanum": "La Torre",
    "virtue": "Umile",
    "virtueDesc": "Attivando questa Virtù, l'Eroe riceverà 1 Punto Eroe aggiuntivo quando attiverà la sua Hubris o una delle sue Peculiarità.",
    "hubris": "Arrogante",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando mostra disprezzo o considera indegno di attenzione un Malvagio o chi potrebbe causare danno ai suoi amici."
  },
  {
    "arcanum": "Il Mendicante",
    "virtue": "Perspicace",
    "virtueDesc": "Attivando questa Virtù, l'Eroe può scoprire la tipologia di una Squadra di Sgherri, oppure il Grado e i Vantaggi di un Malvagio.",
    "hubris": "Invidioso",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando desidera fortemente qualcosa e agisce in modo poco accorto per ottenerla."
  },
  {
    "arcanum": "La Strega",
    "virtue": "Intuitivo",
    "virtueDesc": "Attivando questa Virtù, l'Eroe può porre al GM una domanda con risposta sì/no riguardante un PNG. Il GM dovrà rispondere onestamente e, se possibile, aggiungere dettagli.",
    "hubris": "Manipolatore",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando tenta di sfruttare qualcun altro per fare il suo lavoro sporco e la cosa si rivolta contro di lui."
  },
  {
    "arcanum": "La Guerra",
    "virtue": "Vittorioso",
    "virtueDesc": "Quando l'Eroe ferisce per la prima volta un Malvagio in combattimento può attivare questa Virtù per infliggere una Ferita Drammatica aggiuntiva oltre al normale danno.",
    "hubris": "Leale",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito."
  },
  {
    "arcanum": "L'Impiccato",
    "virtue": "Altruista",
    "virtueDesc": "Attivando questa Virtù, l'Eroe può subire le Conseguenze di un Rischio al posto di un altro.",
    "hubris": "Indeciso",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando spreca un'Azione esitando in preda al dubbio o all'incertezza."
  },
  {
    "arcanum": "Le Monete (per il Traghettatore)",
    "virtue": "Adattabile",
    "virtueDesc": "Attivando questa Virtù, l'Eroe può eseguire la sua prima Azione anticipando chiunque altro nel corso di un Round.",
    "hubris": "Implacabile",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando si mette nei guai rifiutandosi di lasciare in pace qualcuno o di ritirarsi quando è in vantaggio."
  },
  {
    "arcanum": "I Troni",
    "virtue": "Confortante",
    "virtueDesc": "Attivando questa Virtù, l'Eroe cancella gli effetti della Paura su se stesso e i suoi amici.",
    "hubris": "Testardo",
    "hubrisDesc": "L'Eroe riceve un punto Eroe quando si rifiuta caparbiamente di cambiare idea dinanzi ai fatti."
  },
  {
    "arcanum": "La Notte Senza Luna",
    "virtue": "Discreto",
    "virtueDesc": "Quando agisce dietro le quinte o attraverso un intermediario l'Eroe può attivare questa Virtù. Per il prossimo Rischio ogni dado conterà come un Incremento senza bisogno di tirare.",
    "hubris": "Confuso",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando non riesce a capire o a cogliere un elemento importante della vicenda e ciò mette in pericolo lui o altri."
  },
  {
    "arcanum": "Il Sole",
    "virtue": "Glorioso",
    "virtueDesc": "L'Eroe può attivare questa Virtù quando si trova al centro dell'attenzione. Per il prossimo Rischio ogni dado conterà come un Incremento senza bisogno di tirare.",
    "hubris": "Orgoglioso",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando rifiuta un'offerta d'aiuto, per esempio se un alleato spende un Punto Eroe per dargli Dadi Bonus e lui rifiuta."
  },
  {
    "arcanum": "Il Profeta",
    "virtue": "Illuminato",
    "virtueDesc": "Attivando questa Virtù, per tutta la durata della scena l'Eroe si accorge automaticamente quando qualsiasi altro personaggio mente.",
    "hubris": "Fanatico",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando difende vigorosamente le sue idee nel posto o nel momento sbagliato."
  },
  {
    "arcanum": "Il Ritrovo",
    "virtue": "Esemplare",
    "virtueDesc": "Quando attiva questa Virtù, l'Eroe deve indicare un altro Eroe presente nella Scena. I due sommano i propri Incrementi per il Round e tutte le spese sono effettuate attingendo da questa riserva condivisa.",
    "hubris": "Rancoroso",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando si mette nei guai rimanendo ancorato a vecchi rancori e cattivi sentimenti."
  },
  {
    "arcanum": "L'Eroe",
    "virtue": "Coraggioso",
    "virtueDesc": "Attivando questa Virtù, l'Eroe ottiene un numero di Dadi Bonus pari al Grado di Paura del suo avversario.",
    "hubris": "Avventato",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando la sua eccessiva sicurezza nell'agire mette nei guai lui e un altro."
  },
  {
    "arcanum": "Il Glifo",
    "virtue": "Mite",
    "virtueDesc": "Attivando questa Virtù, l'Eroe impedisce a qualsiasi effetto magico (Stregoneria, Artefatti, Mostri ecc.) di avere effetto su di lui.",
    "hubris": "Superstizioso",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando si rifiuta di risolvere un problema con l'aiuto della Stregoneria, di un artefatto o di un altro effetto mistico di cui non si fida."
  },
  {
    "arcanum": "L'Imperatore",
    "virtue": "Maestoso",
    "virtueDesc": "Attivando questa Virtù, il GM darà un Punto Eroe a tutti gli altri Eroi presenti nella Scena.",
    "hubris": "Testa Calda",
    "hubrisDesc": "L'Eroe riceve un Punto Eroe quando perde le staffe o provoca guai."
  }
],
  "backgrounds": [
    {
        "name": "Archeologo",
        "nation": "Generale",
        "desc": "Studia le rovine Syrneth ed esplora le parti perdute di Terra.",
        "quirk": "Ottiene un Punto Eroe ogni volta che consegna un artefatto di valore a un museo, università o altra istituzione pubblica.",
        "advantages": [
            "Oggetto Distintivo",
            "Vista d'Aquila"
        ],
        "skills": [
            "Atletica",
            "Convincere",
            "Furto",
            "Istruzione",
            "Notare"
        ]
    },
    {
        "name": "Aristocratico",
        "nation": "Generale",
        "desc": "Nato tra la nobiltà del suo paese, è un volto noto nelle corti.",
        "quirk": "Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte.",
        "advantages": [
            "Ricco",
            "Sorriso Disarmante"
        ],
        "skills": [
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Istruzione",
            "Mira"
        ]
    },
    {
        "name": "Artigiano",
        "nation": "Generale",
        "desc": "Lavora continuamente per realizzare oggetti utili.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sfrutta le modeste abilità artigiane per risolvere problemi considerati troppo complessi per avere una soluzione semplice.",
        "advantages": [
            "Manualità",
            "Mastro Artigiano"
        ],
        "skills": [
            "Atletica",
            "Convincere",
            "Esibirsi",
            "Istruzione",
            "Notare"
        ]
    },
    {
        "name": "Artista",
        "nation": "Generale",
        "desc": "Si impegna senza posa per creare opere d'arte.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si sacrifica per rendere Théah un luogo più bello.",
        "advantages": [
            "Affascinare",
            "Mecenate"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Esibirsi"
        ]
    },
    {
        "name": "Assassino",
        "nation": "Generale",
        "desc": "Si nasconde tra le ombre come uno spettro e porta silenziosamente la morte in cambio di denaro insanguinato.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si espone per evitare la morte di un nemico o rifiuta un piano d'azione perché potrebbe causare morti inutili.",
        "advantages": [
            "Psst, da questa parte",
            "Schermidore"
        ],
        "skills": [
            "Atletica",
            "Empatia",
            "Intimidire",
            "Mischia",
            "Nascondersi"
        ]
    },
    {
        "name": "Cacciatore",
        "nation": "Generale",
        "desc": "Dorme sotto le stelle e si procura il cibo da solo.",
        "quirk": "Ottiene un Punto Eroe ogni volta che il suo istinto di cacciatore salva qualcuno da un pericolo.",
        "advantages": [
            "Cecchino",
            "Fatto!"
        ],
        "skills": [
            "Cavalcare",
            "Intimidire",
            "Mira",
            "Nascondersi",
            "Notare"
        ]
    },
    {
        "name": "Capitano di Nave",
        "nation": "Generale",
        "desc": "Comanda un equipaggio sotto qualsiasi bandiera.",
        "quirk": "Ottiene un Punto Eroe ogni volta che è l'ultimo del suo equipaggio a mettersi in salvo.",
        "advantages": [
            "Comando",
            "Gambe da Marinaio",
            "Sposato al Mare"
        ],
        "skills": [
            "Arte della Guerra",
            "Convincere",
            "Mira",
            "Navigazione",
            "Notare"
        ]
    },
    {
        "name": "Cavaliere",
        "nation": "Generale",
        "desc": "È un guerriero a cavallo, parte della gloriosa cavalleria della sua Nazione.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sfrutta la sua esperienza nel cavalcare in una situazione insolita.",
        "advantages": [
            "Mano Pesante",
            "Volontà Indomabile"
        ],
        "skills": [
            "Arte della Guerra",
            "Cavalcare",
            "Intimidire",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Contadino",
        "nation": "Generale",
        "desc": "Cresciuto in una piccola fattoria, è abituato a lavorare per sopravvivere senza avere, finora, conosciuto l'avventura.",
        "quirk": "Ottiene un Punto Eroe ogni volta che risolve un problema complesso usando semplici e vecchie soluzioni contadine.",
        "advantages": [
            "Esperto di Sopravvivenza",
            "Tratto Leggendario"
        ],
        "skills": [
            "Atletica",
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Esibirsi"
        ]
    },
    {
        "name": "Cortigiano",
        "nation": "Generale",
        "desc": "È un volto conosciuto nelle corti della sua patria e un diplomatico in quelle straniere.",
        "quirk": "Ottiene un Punto Eroe ogni volta che, con il suo fascino e il suo stile, impedisce un'esplosione di violenza.",
        "advantages": [
            "Amicizie Altolocate",
            "Un Semplice Malinteso"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Empatia",
            "Esibirsi",
            "Mischia"
        ]
    },
    {
        "name": "Dottore",
        "nation": "Generale",
        "desc": "Cura i malati e i feriti.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si occupa delle ferite di un Malvagio o delle sue vittime innocenti.",
        "advantages": [
            "Fautore di Miracoli",
            "Orologio Biologico"
        ],
        "skills": [
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Istruzione",
            "Notare"
        ]
    },
    {
        "name": "Duellante",
        "nation": "Generale",
        "desc": "Ha dedicato la sua vita alla maestria della scherma.",
        "quirk": "Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
        "advantages": [
            "Sala d'Armi"
        ],
        "skills": [
            "Atletica",
            "Empatia",
            "Esibirsi",
            "Intimidire",
            "Mischia"
        ]
    },
    {
        "name": "Esploratore",
        "nation": "Generale",
        "desc": "Vive per visitare i più remoti angoli del pianeta.",
        "quirk": "Ottiene un Punto Eroe ogni volta che posa lo sguardo su una vista che pochi o nessuno a Théah hanno mai potuto godere.",
        "advantages": [
            "Lavorare sui Tetti",
            "Riflessi Rapidi"
        ],
        "skills": [
            "Atletica",
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Navigazione"
        ]
    },
    {
        "name": "Fuorilegge",
        "nation": "Generale",
        "desc": "Viola le leggi ingiuste per ottenere ciò che crede sia il bene superiore.",
        "quirk": "Ottiene un Punto Eroe ogni volta che viola la legge per uno scopo nobile.",
        "advantages": [
            "Cameratismo",
            "Scafato"
        ],
        "skills": [
            "Atletica",
            "Empatia",
            "Furto",
            "Intimidire",
            "Nascondersi"
        ]
    },
    {
        "name": "Ingegnere",
        "nation": "Generale",
        "desc": "È specializzato nell'applicare ingegno, conoscenze scientifiche e matematiche per risolvere problemi tecnici, sociali e commerciali.",
        "quirk": "Ottiene un Punto Eroe ogni volta che usa la sua conoscenza tecnica per risolvere un problema.",
        "advantages": [
            "Mastro Artigiano",
            "Orologio Biologico",
            "Senso dell'Orientamento"
        ],
        "skills": [
            "Arte della Guerra",
            "Cavalcare",
            "Convincere",
            "Istruzione",
            "Mira"
        ]
    },
    {
        "name": "Intrattenitore",
        "nation": "Generale",
        "desc": "Fatica costantemente per dare al pubblico un'esperienza emozionante.",
        "quirk": "Ottiene un Punto Eroe ogni volta che usa le sue abilità per qualcosa di più del semplice guadagno.",
        "advantages": [
            "Ispirare Generosità",
            "Virtuoso"
        ],
        "skills": [
            "Allettare",
            "Atletica",
            "Empatia",
            "Esibirsi",
            "Furto"
        ]
    },
    {
        "name": "Jenny",
        "nation": "Generale",
        "desc": "Seduce per divertimento e profitto.",
        "quirk": "Ottiene un Punto Eroe ogni volta che risolve un conflitto grazie alla seduzione o a proposte sessuali.",
        "advantages": [
            "Approccio Dinamico",
            "Vieni Qui"
        ],
        "skills": [
            "Allettare",
            "Atletica",
            "Empatia",
            "Esibirsi",
            "Mira"
        ]
    },
    {
        "name": "Marinaio",
        "nation": "Generale",
        "desc": "Non serve alcun paese o signore; la nave e l'equipaggio sono tutta la sua famiglia.",
        "quirk": "Ottiene un Punto Eroe ogni volta che mette da parte i suoi desideri per garantire la sicurezza o la comodità dei suoi compagni.",
        "advantages": [
            "Rissoso",
            "Vista d'Aquila"
        ],
        "skills": [
            "Allettare",
            "Mischia",
            "Navigazione",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Mercante",
        "nation": "Generale",
        "desc": "Viaggia in tutto il paese per vendere le sue merci per terra e per mare.",
        "quirk": "Ottiene un Punto Eroe ogni volta che vende un oggetto per molto meno del suo reale valore a chi ne ha un disperato bisogno.",
        "advantages": [
            "Orologio Biologico",
            "Scuola di Maniere"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Intimidire"
        ]
    },
    {
        "name": "Mercenario",
        "nation": "Generale",
        "desc": "Vende le sue abilità militari al miglior offerente.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sceglie di seguire una ragione più nobile del vile denaro.",
        "advantages": [
            "Duro da Uccidere",
            "Stomaco di Ferro"
        ],
        "skills": [
            "Atletica",
            "Intimidire",
            "Mischia",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Orfano",
        "nation": "Generale",
        "desc": "Ha perso i suoi genitori da piccolo e si è abituato a badare a se stesso.",
        "quirk": "Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo.",
        "advantages": [
            "Aggressione Sconsiderata",
            "Mano Lesta"
        ],
        "skills": [
            "Atletica",
            "Empatia",
            "Intimidire",
            "Nascondersi",
            "Rissa"
        ]
    },
    {
        "name": "Pirata",
        "nation": "Generale",
        "desc": "Naviga per i mari, prendendo ciò che vuole e dando la vera libertà a chi è disposto a seguirlo.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si sacrifica per garantire la libertà di un altro.",
        "advantages": [
            "Mira Letale",
            "Volontà Indomabile"
        ],
        "skills": [
            "Furto",
            "Intimidire",
            "Mira",
            "Navigazione",
            "Notare"
        ]
    },
    {
        "name": "Professore",
        "nation": "Generale",
        "desc": "Insegna presso un istituto prestigioso.",
        "quirk": "Ottiene un Punto Eroe ogni volta che usa la conoscenza di un trattato oscuro per risolvere un problema complesso.",
        "advantages": [
            "Cattedra",
            "Gioco di Squadra"
        ],
        "skills": [
            "Allettare",
            "Convincere",
            "Empatia",
            "Esibirsi",
            "Istruzione"
        ]
    },
    {
        "name": "Pugile",
        "nation": "Generale",
        "desc": "Si affida alle mani e ai piedi per risolvere tutti i problemi violenti della vita.",
        "quirk": "Ottiene un Punto Eroe ogni volta che getta le armi e si affida ai pugni, a prescindere dall'armamento dell'avversario.",
        "advantages": [
            "Pugilatore",
            "Sguardo di Ghiaccio"
        ],
        "skills": [
            "Atletica",
            "Convincere",
            "Empatia",
            "Esibirsi",
            "Rissa"
        ]
    },
    {
        "name": "Quartiermastro",
        "nation": "Generale",
        "desc": "Serve a bordo di una nave, occupandosi di tutto ciò che il resto dell'equipaggio ignora.",
        "quirk": "Ottiene un Punto Eroe ogni volta che risolve un problema dell'equipaggio.",
        "advantages": [
            "Fatto!",
            "Gambe da Marinaio",
            "Manualità"
        ],
        "skills": [
            "Arte della Guerra",
            "Mira",
            "Nascondersi",
            "Navigazione",
            "Rissa"
        ]
    },
    {
        "name": "Sacerdote",
        "nation": "Generale",
        "desc": "Serve una causa superiore con ogni suo respiro.",
        "quirk": "Ottiene un Punto Eroe ogni volta che lascia da parte la retorica e mette in pratica le virtù che professa.",
        "advantages": [
            "Consacrato",
            "Ispirare Generosità"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Empatia",
            "Esibirsi",
            "Istruzione"
        ]
    },
    {
        "name": "Servitore",
        "nation": "Generale",
        "desc": "Lavora per compiere la volontà del proprio signore, qualsiasi essa sia.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si mette in pericolo per assistere qualcuno in un compito difficile.",
        "advantages": [
            "Gioco di Squadra",
            "In Balia degli Eventi"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Furto",
            "Nascondersi",
            "Notare"
        ]
    },
    {
        "name": "Soldato",
        "nation": "Generale",
        "desc": "Sa come combattere e come uccidere; si guadagna da vivere militando sotto gli stendardi e al comando dei lord.",
        "quirk": "Ottiene un Punto Eroe ogni volta che segue il piano a prescindere dai rischi personali.",
        "advantages": [
            "Bevitore Emerito",
            "Solo Contro Tutti"
        ],
        "skills": [
            "Arte della Guerra",
            "Intimidire",
            "Mira",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Spia",
        "nation": "Generale",
        "desc": "Serve la propria Nazione infiltrandosi tra i suoi nemici e carpendo i loro segreti.",
        "quirk": "Ottiene un Punto Eroe ogni volta che corre un grosso rischio per scoprire un segreto.",
        "advantages": [
            "Immunità ai Veleni",
            "Opportunista"
        ],
        "skills": [
            "Allettare",
            "Empatia",
            "Furto",
            "Nascondersi",
            "Notare"
        ]
    },
    {
        "name": "Studioso",
        "nation": "Generale",
        "desc": "Si dedica ad apprendere e documentare tutte le meraviglie del creato.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si metti nei guai per ottenere conoscenza.",
        "advantages": [
            "Linguista",
            "Università"
        ],
        "skills": [
            "Convincere",
            "Empatia",
            "Esibirsi",
            "Istruzione",
            "Notare"
        ]
    },
    {
        "name": "Ufficiale dell'Esercito",
        "nation": "Generale",
        "desc": "Arruolato nell'esercito, ben presto si è trovato in una posizione di comando.",
        "quirk": "Ottiene un Punto Eroe ogni volta che prende il comando in una situazione di pericolo o estrema violenza.",
        "advantages": [
            "Accademia Militare",
            "Senso dell'Orientamento"
        ],
        "skills": [
            "Arte della Guerra",
            "Atletica",
            "Cavalcare",
            "Intimidire",
            "Mira"
        ]
    },
    {
        "name": "Ufficiale di Marina",
        "nation": "Generale",
        "desc": "Arruolato in marina, si è fatto strada fino al comando di una nave.",
        "quirk": "Ottiene un Punto Eroe ogni volta che antepone i bisogni dell'equipaggio alla missione.",
        "advantages": [
            "Equilibrio Perfetto",
            "Gambe da Marinaio",
            "Mercanteggiare"
        ],
        "skills": [
            "Arte della Guerra",
            "Intimidire",
            "Mischia",
            "Navigazione",
            "Notare"
        ]
    },
    {
        "name": "Agente Unificatore",
        "nation": "Avalon",
        "desc": "Ha ricevuto dalla Corona di Avalon il compito di mantenere la pace tra le Isole.",
        "quirk": "Ottiene un Punto Eroe ogni volta che assicura la stabilità dell'alleanza tra le Isole Incantate.",
        "advantages": [
            "Esperto di Sopravvivenza",
            "Università"
        ],
        "skills": [
            "Allettare",
            "Empatia",
            "Istruzione",
            "Mira",
            "Notare"
        ]
    },
    {
        "name": "Bardo",
        "nation": "Avalon",
        "desc": "Narra vecchi racconti, le storie delle Leggende, per assicurarsi che l'anima di Avalon non sia mai dimenticata.",
        "quirk": "Ottiene un Punto Eroe ogni volta che risolve un problema seguendo l'esempio di una Leggenda.",
        "advantages": [
            "Bevitore Emerito",
            "Mercanteggiare",
            "Virtuoso"
        ],
        "skills": [
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Esibirsi",
            "Mira"
        ]
    },
    {
        "name": "Cavaliere Errante",
        "nation": "Avalon",
        "desc": "È imbevuto della leggendaria magia dei Cavalieri di Re Elilodd.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sostiene un ideale di virtù cavalleresca e finisce nei guai per questo.",
        "advantages": [
            "Senso dell'Orientamento",
            "Stregoneria"
        ],
        "skills": [
            "Arte della Guerra",
            "Cavalcare",
            "Intimidire",
            "Mischia",
            "Rissa"
        ]
    },
    {
        "name": "Corsaro",
        "nation": "Avalon",
        "desc": "Ha ricevuto una lettera di corsa per affondare tutte le navi nemiche di Avalon.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sconfigge i nemici di Avalon.",
        "advantages": [
            "Equilibrio Perfetto",
            "La Fortuna del Diavolo"
        ],
        "skills": [
            "Allettare",
            "Furto",
            "Mischia",
            "Navigazione",
            "Notare"
        ]
    },
    {
        "name": "Puritano",
        "nation": "Avalon",
        "desc": "È un Obiezionista riformato che cerca di \"purificare\" la Chiesa di Avalon da tutte le pratiche dei Vaticini.",
        "quirk": "Ottiene un Punto Eroe ogni volta che dimostra la corruzione, l'ipocrisia o l'inefficienza della Chiesa del Vaticinio.",
        "advantages": [
            "Approccio Dinamico",
            "Fama"
        ],
        "skills": [
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Intimidire",
            "Istruzione"
        ]
    },
    {
        "name": "Saoi (Saggio)",
        "nation": "Inismore",
        "desc": "Ha ricevuto la massima onorificenza da parte della *Aosdána*, un'associazione di artisti Inish supportata dallo stato.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si mette in pericolo per proteggere gli artisti di Théah.",
        "advantages": [
            "Bevitore Emerito",
            "Gioco di Squadra",
            "Sorriso Disarmante"
        ],
        "skills": [
            "Atletica",
            "Convincere",
            "Empatia",
            "Esibirsi",
            "Mischia"
        ]
    },
    {
        "name": "Seanchaidh (Poeta-Guerriero)",
        "nation": "Le Marche delle Highland",
        "desc": "È un cantastorie e uno storico, esperto delle leggi e degli antichi costumi della sua gente.",
        "quirk": "Ottiene un Punto Eroe ogni volta che fa rispettare le antiche leggi del suo popolo.",
        "advantages": [
            "Linguista",
            "Solo Contro Tutti"
        ],
        "skills": [
            "Cavalcare",
            "Convincere",
            "Esibirsi",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Alchimista",
        "nation": "Castille",
        "desc": "Ha indagato a lungo e duramente fino a scoprire il mistero della creazione alchemica.",
        "quirk": "Ottiene un Punto Eroe ogni volta che migliora la vita di un altro mediante l'alchimia.",
        "advantages": [
            "Alchimista",
            "Stomaco di Ferro"
        ],
        "skills": [
            "Allettare",
            "Empatia",
            "Furto",
            "Istruzione",
            "Notare"
        ]
    },
    {
        "name": "Antropologo",
        "nation": "Castille",
        "desc": "Affine all'Archeologo, si concentra sullo studio dei popoli anziché sulle rovine lasciate da questi.",
        "quirk": "Ottiene un Punto Eroe ogni volta che risolve i problemi di un gruppo di stranieri.",
        "advantages": [
            "Linguista",
            "Università"
        ],
        "skills": [
            "Atletica",
            "Convincere",
            "Empatia",
            "Istruzione",
            "Notare"
        ]
    },
    {
        "name": "Diestro",
        "nation": "Castille",
        "desc": "Ha dedicato la propria vita allo studio della spada in tutti i suoi aspetti.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sconfigge un duellante addestrato.",
        "advantages": [
            "Schermidore",
            "Sorriso Disarmante"
        ],
        "skills": [
            "Atletica",
            "Empatia",
            "Intimidire",
            "Istruzione",
            "Mischia"
        ]
    },
    {
        "name": "Mirabilis (Sacerdote)",
        "nation": "Castille",
        "desc": "È uno dei più esperti accademici della Chiesa del Vaticinio e membro dell'Ordo Doctorem Mirabilis.",
        "quirk": "Ottiene un Punto Eroe ogni volta che dà prova dell'amore e della compassione della Chiesa.",
        "advantages": [
            "Consacrato",
            "Lampo di Genio"
        ],
        "skills": [
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Esibirsi",
            "Istruzione"
        ]
    },
    {
        "name": "Hexe",
        "nation": "Eisen",
        "desc": "È un maestro dell'*Hexenwerk*, la stregoneria dei morti.",
        "quirk": "Ottiene un Punto Eroe ogni volta che ignora ogni altra responsabilità per assicurarsi che i morti riposino in pace.",
        "advantages": [
            "Stomaco di Ferro",
            "Stregoneria"
        ],
        "skills": [
            "Allettare",
            "Atletica",
            "Intimidire",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Krieger (Guerriero)",
        "nation": "Eisen",
        "desc": "È sopravvissuto alla Guerra della Croce e porta le cicatrici di molte battaglie.",
        "quirk": "Ottiene un Punto Eroe ogni volta che decide di combattere per difendere gli inermi o prevenire distruzioni.",
        "advantages": [
            "Accademia Militare",
            "Sguardo di Ghiaccio"
        ],
        "skills": [
            "Arte della Guerra",
            "Atletica",
            "Cavalcare",
            "Mira",
            "Mischia"
        ]
    },
    {
        "name": "Ungetümjäger (Cacciatore di Mostri)",
        "nation": "Eisen",
        "desc": "Sa che nella sua patria esistono creature innaturali a piede libero e ha giurato di distruggerle.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si dedica a cacciare una creatura inumana per impedirle di spargere altro male.",
        "advantages": [
            "Non Morirò Qui",
            "Volontà Indomabile"
        ],
        "skills": [
            "Atletica",
            "Mira",
            "Mischia",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Vitalienbruder (Pirata)",
        "nation": "Eisen",
        "desc": "È uno dei molti Eiseniani dediti a un commercio più giusto e ad eque divisioni.",
        "quirk": "Ottiene un Punto Eroe ogni volta che ruba ai ricchi per dare ai poveri.",
        "advantages": [
            "Comando",
            "Gambe da Marinaio",
            "Scafato"
        ],
        "skills": [
            "Arte della Guerra",
            "Furto",
            "Nascondersi",
            "Navigazione",
            "Rissa"
        ]
    },
    {
        "name": "L'Ami du Roi (Cortigiano)",
        "nation": "Montaigne",
        "desc": "È letteralmente un favorito dell'Empereur.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sfrutta il favore del sovrano per risolvere un problema.",
        "advantages": [
            "Amicizie Altolocate",
            "Contatto",
            "Linguista"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Convincere",
            "Esibirsi",
            "Mischia"
        ]
    },
    {
        "name": "Mousquetaire",
        "nation": "Montaigne",
        "desc": "Ha fatto giuramento di difendere il sovrano e i suoi compagni moschettieri fino all'ultimo respiro.",
        "quirk": "Ottiene un Punto Eroe ogni volta che subisce una grave ferita per proteggere il Re o i suoi camerati.",
        "advantages": [
            "Cameratismo",
            "Riflessi Rapidi"
        ],
        "skills": [
            "Cavalcare",
            "Intimidire",
            "Mira",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Révolutionnaire",
        "nation": "Montaigne",
        "desc": "Ha promesso di liberare la patria dalla tirannia di nobili.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si sacrifica in nome della libertà.",
        "advantages": [
            "Divincolarsi",
            "Gioia di Vivere"
        ],
        "skills": [
            "Cavalcare",
            "Furto",
            "Mischia",
            "Nascondersi",
            "Notare"
        ]
    },
    {
        "name": "Sorcier Porté",
        "nation": "Montaigne",
        "desc": "È un maestro nell'arte del *Porté*, l'apertura di varchi magici.",
        "quirk": "Ottiene un Punto Eroe ogni volta che chiude una *Blessure* creata da un Malvagio.",
        "advantages": [
            "Orologio Biologico",
            "Stregoneria"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Empatia",
            "Istruzione",
            "Nascondersi"
        ]
    },
    {
        "name": "Poseł (Inviato)",
        "nation": "Sarmatia",
        "desc": "Agisce come consigliere per tutti i votanti della Confederazione.",
        "quirk": "Ottiene un Punto Eroe ogni volta che insiste per una soluzione democratica quando sarebbe vantaggioso non votare.",
        "advantages": [
            "Comando",
            "Scuola di Maniere"
        ],
        "skills": [
            "Allettare",
            "Convincere",
            "Empatia",
            "Esibirsi",
            "Intimidire"
        ]
    },
    {
        "name": "Tremtis (Esule)",
        "nation": "Sarmatia",
        "desc": "Dopo la dichiarazione della Libertà Dorata, è fuggito dalla Confederazione cercando asilo.",
        "quirk": "Ottiene un Punto Eroe ogni volta che un elemento del passato torna a perseguitarlo.",
        "advantages": [
            "Contatto",
            "Oriundo",
            "Scafato"
        ],
        "skills": [
            "Empatia",
            "Furto",
            "Nascondersi",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Ussaro Alato",
        "nation": "Sarmatia",
        "desc": "Serve nel più celebre reggimento di cavalleria, l'élite dell'esercito Sarmatiano.",
        "quirk": "Ottiene un Punto Eroe ogni volta che, con il suo destriero, si lancia a testa bassa in uno scontro senza badare ai rischi.",
        "advantages": [
            "Gioco di Squadra",
            "L'Unione Fa la Forza"
        ],
        "skills": [
            "Arte della Guerra",
            "Cavalcare",
            "Convincere",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Żynys (Veggente)",
        "nation": "Sarmatia",
        "desc": "Ha incontrato e ingannato il Diavolo, che ora è al suo servizio.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sfrutta qualcosa di malvagio per compiere il bene.",
        "advantages": [
            "Linguista",
            "Stregoneria"
        ],
        "skills": [
            "Atletica",
            "Convincere",
            "Esibirsi",
            "Istruzione",
            "Mischia"
        ]
    },
    {
        "name": "Baleniere",
        "nation": "Ussura",
        "desc": "Naviga nelle gelide acque di Ussura armato di arpione, alla caccia dei più pericolosi abitanti del mare.",
        "quirk": "Ottiene un Punto Eroe ogni volta che affronta una creatura tanto grande da poter ingoiare un uomo intero.",
        "advantages": [
            "Bevitore Emerito",
            "Gambe da Marinaio",
            "Mecenate"
        ],
        "skills": [
            "Atletica",
            "Mischia",
            "Navigazione",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Cosacco",
        "nation": "Ussura",
        "desc": "Vive nelle steppe orientali di Ussura, un luogo con una orgogliosa tradizione di allevamento dei cavalli e di guerra.",
        "quirk": "Ottiene un Punto Eroe ogni volta che abbandona qualcosa di importante per viaggiare più leggero.",
        "advantages": [
            "Aggressione Sconsiderata",
            "Forte Come Dieci Uomini"
        ],
        "skills": [
            "Cavalcare",
            "Intimidire",
            "Mischia",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Progressista",
        "nation": "Ussura",
        "desc": "Viaggia in tutta Théah per trovare innovazioni con cui modernizzare la sua patria.",
        "quirk": "Ottiene un Punto Eroe ogni volta che rischia la vita per ottenere una tecnologia avanzata.",
        "advantages": [
            "Contatto",
            "Famiglia Allargata",
            "Manualità"
        ],
        "skills": [
            "Allettare",
            "Atletica",
            "Cavalcare",
            "Convincere",
            "Empatia"
        ]
    },
    {
        "name": "Toccato da Matushka",
        "nation": "Ussura",
        "desc": "Matushka gli ha conferito un grande potere a un prezzo terribile.",
        "quirk": "Ottiene un Punto Eroe ogni volta che dà una lezione a qualcuno in un modo che renderebbe Matushka orgogliosa.",
        "advantages": [
            "Esperto di Sopravvivenza",
            "Stregoneria"
        ],
        "skills": [
            "Allettare",
            "Atletica",
            "Esibirsi",
            "Furto",
            "Intimidire"
        ]
    },
    {
        "name": "Bearsark",
        "nation": "Vestenmennavenjar",
        "desc": "Quando combatte cade in una sorta di trance furiosa e quasi incontrollabile.",
        "quirk": "Ottiene un Punto Eroe ogni volta che lascia che sia il GM a decidere la sua prossima azione.",
        "advantages": [
            "Bevitore Emerito",
            "Duro da Uccidere"
        ],
        "skills": [
            "Arte della Guerra",
            "Intimidire",
            "Mischia",
            "Navigazione",
            "Rissa"
        ]
    },
    {
        "name": "Guildmästaren",
        "nation": "Vestenmennavenjar",
        "desc": "Serve la Lega Vendel e ha un ruolo amministrativo nelle Gilde.",
        "quirk": "Ottiene un Punto Eroe ogni volta che usa le vaste risorse della Lega per qualcosa di più nobile del mero profitto.",
        "advantages": [
            "Mastro Artigiano",
            "Ricco"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Istruzione"
        ]
    },
    {
        "name": "Sjørøver (Pirata)",
        "nation": "Vestenmennavenjar",
        "desc": "Onora l'antica tradizione Vestenmennavenjar di guerra navale e saccheggio.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si espone a un pericolo per garantirsi l'onore di sedere alla tavola del Padre di Tutti.",
        "advantages": [
            "Sguardo di Ghiaccio",
            "Ti Porto Con Me"
        ],
        "skills": [
            "Intimidire",
            "Mischia",
            "Navigazione",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Skald",
        "nation": "Vestenmennavenjar",
        "desc": "Interpreta i misteri del fuoco e delle ossa, condividendo racconti di gloria e sconfitta.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sfrutta la propria abilità di *Seidr* per aiutare un altro Eroe a risolvere un problema o sconfiggere un Malvagio.",
        "advantages": [
            "Gambe da Marinaio",
            "Seidr"
        ],
        "skills": [
            "Esibirsi",
            "Intimidire",
            "Mischia",
            "Navigazione",
            "Rissa"
        ]
    },
    {
        "name": "Ambasciatore Itinerante",
        "nation": "Vodacce",
        "desc": "Viaggia per il mondo in nome e per conto di un Principe Mercante.",
        "quirk": "Ottiene un Punto Eroe ogni volta che usa conoscenze o oggetti non di Théah per risolvere un problema.",
        "advantages": [
            "Linguista",
            "Scuola di Maniere"
        ],
        "skills": [
            "Allettare",
            "Convincere",
            "Empatia",
            "Intimidire",
            "Navigazione"
        ]
    },
    {
        "name": "Bravo",
        "nation": "Vodacce",
        "desc": "Ha giurato di proteggere qualcuno ed è sempre al suo fianco.",
        "quirk": "Ottiene un Punto Eroe ogni volta che corre un rischio per proteggere la vita della persona che ha giurato di difendere.",
        "advantages": [
            "Duro da Uccidere",
            "Immunità ai Veleni"
        ],
        "skills": [
            "Atletica",
            "Empatia",
            "Intimidire",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Consigliere",
        "nation": "Vodacce",
        "desc": "Agisce come braccio destro di un Principe Mercante.",
        "quirk": "Ottiene un Punto Eroe ogni volta che corre un grosso rischio per proteggere i segreti altrui.",
        "advantages": [
            "Non Siamo Poi Così Diversi",
            "Scafato"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Notare"
        ]
    },
    {
        "name": "Strega della Sorte",
        "nation": "Vodacce",
        "desc": "Nota: Solo gli Eroi femminili possono scegliere questo Background. Può percepire, piegare e controllare i fili del Fato con la sua volontà... ma questo ha un prezzo.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si sottomette a un corso d'azione pericoloso convinta che sia il volere del destino.",
        "advantages": [
            "Orologio Biologico",
            "Stregoneria"
        ],
        "skills": [
            "Allettare",
            "Cavalcare",
            "Convincere",
            "Esibirsi",
            "Nascondersi"
        ]
    },
{
        "name": "Scudiero Sidhe",
        "nation": "Isole Incantate",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "I Sidhe sono tornati ad Avalon. Il suo compito è fare in modo che la transizione sia la più pacifica possibile.",
        "quirk": "Ottiene un Punto Eroe quando si mette in pericolo per mediare tra umani e Sidhe, imparando, nel processo, a comprendere meglio entrambi.",
        "advantages": [
            "Un Semplice Malinteso",
            "Stregoneria (Cavaliere di Avalon)"
        ],
        "skills": [
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Istruzione",
            "Mischia"
        ]
    },
    {
        "name": "Conservatore Reale",
        "nation": "Avalon",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Avalon è una terra meravigliosa. La Regina lo ha incaricato di fare in modo che resti tale.",
        "quirk": "Ottiene un Punto Eroe ogni volta che per preservare una meraviglia naturale si mette nei guai.",
        "advantages": [
            "Cecchino",
            "Disciplina di Fuoco",
            "Senso dell’Orientamento"
        ],
        "skills": [
            "Atletica",
            "Empatia",
            "Istruzione",
            "Mira",
            "Notare"
        ]
    },
    {
        "name": "Navigatore delle Shannagary",
        "nation": "Le Marche delle Highland",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Un abile marinaio è capace di portare la propria nave attraverso le Shannagary in tre giorni, con qualche graffio è possibile farlo in due.",
        "quirk": "Ottiene un Punto Eroe ogni volta che decide di sacrificare la sicurezza per la rapidità e ciò lo mette nei guai.",
        "advantages": [
            "Prendere il Vento",
            "Sposato al Mare"
        ],
        "skills": [
            "A.d. Guerra",
            "Atletica",
            "Navigazione",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Dornálaí",
        "nation": "Inismore",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "“Ehi, sei un bestione. Scommetto che sai fare a pugni, vero?”",
        "quirk": "Ottiene un Punto Eroe ogni volta che, dopo uno scontro vinto o perso, si scorda il passato e diventa amico del suo avversario.",
        "advantages": [
            "Bevitore Emerito",
            "Gancio",
            "Pugilatore"
        ],
        "skills": [
            "Atletica",
            "Convincere",
            "Intimidire",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Boticario",
        "nation": "Castille",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "La scienza è meravigliosa.",
        "quirk": "Ottiene un Punto Eroe ogni volta che persegue con determinazione la ricerca di un segreto alchemico e questa insistenza lo mette nei guai.",
        "advantages": [
            "Stomaco di Ferro",
            "Stregoneria (Alquimia)",
            "Stregoneria (Alquimia)"
        ],
        "skills": [
            "Convincere",
            "Empatia",
            "Istruzione",
            "Nascondersi",
            "Notare"
        ]
    },
    {
        "name": "La Joven Promesa",
        "nation": "Castille",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Può non avere vinto il torneo a el Baile, ma è stato riconosciuto come un prodigio da tenere d’occhio.",
        "quirk": "Ottiene un Punto Eroe ogni volta che complica volontariamente una situazione per migliorare le proprie abilità di schermidore e la propria reputazione.",
        "advantages": [
            "Fama",
            "Studioso di Lotta"
        ],
        "skills": [
            "Atletica",
            "Empatia",
            "Esibirsi",
            "Notare",
            "Mischia"
        ]
    },
    {
        "name": "Sabueso Real",
        "nation": "Castille",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "I nemici degli Investigatori Reali possono credere sia solo un altro dei “cani da caccia” del re, ma parlano da dietro le sbarre.",
        "quirk": "Ottiene un Punto Eroe quando si rifiuta di agire finché non ha raccolto ulteriori informazioni, anche se ciò gli causa ancora più problemi.",
        "advantages": [
            "Opportunista",
            "Scafato"
        ],
        "skills": [
            "Empatia",
            "Furto",
            "Mira",
            "Nascondersi",
            "Notare"
        ]
    },
    {
        "name": "Tercio",
        "nation": "Castille",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Ha firmato per arruolarsi e diventare un hidalgo. È andato tutto male, ma non ha ancora perso la speranza.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sposa una causa in cerca di redenzione, del perdono per crimini passati o della possibilità di ottenere un titolo nobiliare.",
        "advantages": [
            "Esperto di Sopravvivenza",
            "Schermidore",
            "Turbine d’Acciaio"
        ],
        "skills": [
            "A.d. Guerra",
            "Atletica",
            "Mira",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Balayeur",
        "nation": "Montaigne",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Per lavoro ripulisce le strade con una “scopa” che sputa piombo e divora polvere nera.",
        "quirk": "Ottiene un Punto Eroe ogni volta che mantiene il controllo di una situazione caotica, anche se in inferiorità numerica.",
        "advantages": [
            "Come Pesci in un Barile",
            "Mira Letale",
            "Senso dell’Orientamento"
        ],
        "skills": [
            "Empatia",
            "Intimidire",
            "Mira",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Épée Sanglante",
        "nation": "Montaigne",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Apprendere l’arte della spada e del sangue conferisce il titolo di épée sanglante, oltre all’ammirazione e al terrore dei propri pari.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sfrutta il timore che gli altri hanno delle sue capacità per evitare uno scontro, a prescindere che questi pregiudizi siano corretti o no.",
        "advantages": [
            "Sala d’Armi (De Vore)",
            "Stregoneria (Porté)"
        ],
        "skills": [
            "Atletica",
            "Intimidire",
            "Istruzione",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Evaso dal Passaggio",
        "nation": "Montaigne",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Per un tempo incalcolabile è stato intrappolato nel Passaggio, ma è riuscito a scappare… non che se ne ricordi. In effetti non ricorda nulla della propria vita prima di quel momento… per ora.",
        "quirk": "Ottiene un Punto Eroe ogni volta che il suo passato torna a perseguitarlo e ciò gli causa problemi.",
        "advantages": [
            "Approccio Dinamico",
            "Spirito Valoroso"
        ],
        "skills": [
            "Allettare",
            "Convincere",
            "Empatia",
            "Intimidire",
            "Notare"
        ]
    },
    {
        "name": "La Souris du Marché",
        "nation": "Montaigne",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Conosce le strade come il palmo della sua mano.",
        "quirk": "Ottiene un Punto Eroe ogni volta che decide di condividere i frutti delle proprie malefatte con chi ne ha più bisogno di lui.",
        "advantages": [
            "Mano Lesta",
            "Questa è la Mia Città"
        ],
        "skills": [
            "Convincere",
            "Empatia",
            "Istruzione",
            "Nascondersi",
            "Notare"
        ]
    },
    {
        "name": "La Voix des Sans-Voix",
        "nation": "Montaigne",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Parla per coloro che non hanno voce, perché troppo deboli o spaventati.",
        "quirk": "Ottiene un Punto Eroe ogni volta che rifiuta una soluzione che gli darebbe un vantaggio personale, ma risulterebbe dannosa per coloro che rappresenta.",
        "advantages": [
            "Fama",
            "Requisitoria Feroce"
        ],
        "skills": [
            "Convincere",
            "Empatia",
            "Intimidire",
            "Istruzione",
            "Notare"
        ]
    },
    {
        "name": "Hrungnir",
        "nation": "Vestenmennavenjar",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Non occorre una spada per essere pericolosi.",
        "quirk": "Ottiene un Punto Eroe ogni volta che qualcuno lo sottovaluta per la mancanza di un’arma e questo pregiudizio viene trasformato in un vantaggio.",
        "advantages": [
            "Bevitore Emerito",
            "Rissoso",
            "Tutto è un’Arma se Usato nel Modo Giusto"
        ],
        "skills": [
            "Atletica",
            "Intimidire",
            "Nascondersi",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Murskaaja",
        "nation": "Vestenmennavenjar",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Una linea di difesa è forte solo quanto l’anello più debole. È un esperto nel trovarlo e distruggerlo.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si getta a testa bassa in una situazione pericolosa per cogliere di sorpresa i propri avversari.",
        "advantages": [
            "Mano Pesante",
            "Senso dell’Orientamento",
            "Sulla Breccia"
        ],
        "skills": [
            "A.d. Guerra",
            "Atletica",
            "Cavalcare",
            "Mischia",
            "Nascondersi"
        ]
    },
    {
        "name": "Pankkiiri",
        "nation": "Vestenmennavenjar",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Il denaro è un linguaggio e possiede un vasto registro linguistico.",
        "quirk": "Ottiene un Punto Eroe ogni volta che sfrutta la propria posizione o il proprio denaro per costringere un altro personaggio ad agire in un certo modo e ciò lo mette nei guai.",
        "advantages": [
            "Mecenate (Lega Vendel)",
            "Indorare la Pillola"
        ],
        "skills": [
            "Convincere",
            "Empatia",
            "Istruzione",
            "Mira",
            "Navigazione"
        ]
    },
    {
        "name": "Vala",
        "nation": "Vestenmennavenjar",
        "source": "Nazioni di Théah Vol. 1",
        "desc": "Scrivani e politici moderni credono che le parole abbiano potere. Non hanno idea di quanto abbiano ragione.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si rifiuta di risolvere un problema ricorrendo alla magia – anche se sarebbe più semplice – perché lo considera insignificante.",
        "advantages": [
            "Linguista",
            "Stregoneria (Galdr)",
            "Stregoneria (Galdr)"
        ],
        "skills": [
            "Cavalcare",
            "Convincere",
            "Esibirsi",
            "Intimidire",
            "Istruzione"
        ]
    },
    {
        "name": "Apostata",
        "nation": "Eisen",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Cacciato dalla patria a causa delle sue capacità. Questo non gli impedirà di fare ciò che è giusto.",
        "quirk": "Ottiene un Punto Eroe quando sceglie di allearsi con qualcuno che trova ripugnante pur di conseguire un obiettivo importante.",
        "advantages": [
            "Fama",
            "Stomaco di Ferro",
            "Stregoneria (Hexenwerk)"
        ],
        "skills": [
            "Atletica",
            "Cavalcare",
            "Empatia",
            "Notare",
            "Rissa"
        ]
    },
    {
        "name": "Befleckte Seele",
        "nation": "Eisen",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Dentro di sé nasconde qualcosa di oscuro e maligno, che attanaglia i margini della sua mente, ma persino questo potere nato dal male può essere usato per il bene.",
        "quirk": "Ottiene un Punto Eroe quando usa la propria natura Mostruosa per risolvere un problema e altri lo respingono per questo.",
        "advantages": [
            "Dono Oscuro"
        ],
        "skills": [
            "Atletica",
            "Cavalcare",
            "Empatia",
            "Furto",
            "Nascondersi"
        ]
    },
    {
        "name": "Eisenblut",
        "nation": "Eisen",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "C’è ancora nobiltà a Eisen e ferro nel sangue dei suoi abitanti.",
        "quirk": "Ottiene un Punto Eroe quando sceglie di sacrificare qualcosa di importante per sé in nome del bene di Eisen e del suo popolo.",
        "advantages": [
            "Ricco",
            "Sguardo Imperioso"
        ],
        "skills": [
            "A.d. Guerra",
            "Cavalcare",
            "Empatia",
            "Intimidire",
            "Istruzione"
        ]
    },
    {
        "name": "Stratega",
        "nation": "Eisen",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Ottimo giocatore di scacchi sin da bambino, ora comprende che tutto il mondo è una scacchiera… e lui è ancora il miglior giocatore.",
        "quirk": "Ottiene un Punto Eroe quando un errore critico nei suoi piani mette nei guai se stesso o i propri alleati.",
        "advantages": [
            "Gioco di Squadra",
            "Mente del Gruppo"
        ],
        "skills": [
            "A.d. Guerra",
            "Empatia",
            "Istruzione",
            "Mira",
            "Mischia"
        ]
    },
    {
        "name": "Macher",
        "nation": "Sarmatia",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Entrare. Arraffare ciò che serve. Uscire… assicurarsi che TUTTI ne escano vivi.",
        "quirk": "Ottiene un Punto Eroe quando decide di rivelare la propria presenza a un nemico per aiutare un altro a cavarsi d’impaccio.",
        "advantages": [
            "Gioco di Squadra",
            "Specialista (Nascondersi)"
        ],
        "skills": [
            "Atletica",
            "Convincere",
            "Furto",
            "Nascondersi",
            "Notare"
        ]
    },
    {
        "name": "Mówca",
        "nation": "Sarmatia",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "C’è del bene in tutti, alcuni hanno solo bisogno di aiuto per trovarlo.",
        "quirk": "Ottiene un Punto Eroe quando risolve un problema convincendo altri ad ascoltare la propria coscienza.",
        "advantages": [
            "Appello Accorato",
            "Un Semplice Malinteso"
        ],
        "skills": [
            "Allettare",
            "Convincere",
            "Empatia",
            "Istruzione",
            "Nascondersi"
        ]
    },
    {
        "name": "Rycerz Ludzi",
        "nation": "Sarmatia",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Un cavaliere del popolo, che difende i comuni cittadini da ogni minaccia.",
        "quirk": "Ottiene un Punto Eroe quando risolve una situazione convincendo un gruppo di persone ad affrontarla uniti e solo con le proprie forze.",
        "advantages": [
            "Comando",
            "Lama Fulminea",
            "Linguista"
        ],
        "skills": [
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Mischia",
            "Notare"
        ]
    },
    {
        "name": "Rycerz Senatu",
        "nation": "Sarmatia",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Porta la parola del Senat. Ha la facoltà di imporre il suo volere e risponde solo alla Camera Alta.",
        "quirk": "Ottiene un Punto Eroe ogni volta che decide di nascondere qualcosa alle autorità per motivi nobili, anche se ciò lo mette nei guai.",
        "advantages": [
            "Linguista",
            "Mecenate (Senat)"
        ],
        "skills": [
            "Atletica",
            "Cavalcare",
            "Convincere",
            "Empatia",
            "Mischia"
        ]
    },
    {
        "name": "Borets",
        "nation": "Ussura",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Celebre per essere un eccezionale praticante di lotta libera Ussurana.",
        "quirk": "Ottiene un Punto Eroe quando viene riconosciuto a causa della propria fama, ma preferirebbe che non fosse successo.",
        "advantages": [
            "Colpo a Segno",
            "Fama"
        ],
        "skills": [
            "Atletica",
            "Esibirsi",
            "Intimidire",
            "Nascondersi",
            "Rissa"
        ]
    },
    {
        "name": "Doverchivii Dusha",
        "nation": "Ussura",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Crede a tutte le storie tristi, ma preferisce fidarsi della persona sbagliata, piuttosto che allontanare chi ha davvero bisogno.",
        "quirk": "Ottiene un Punto Eroe ogni volta che un altro personaggio riesce a mentirgli o manipolarlo e questo lo mette nei guai.",
        "advantages": [
            "Fiducioso",
            "Spirito Valoroso"
        ],
        "skills": [
            "Convincere",
            "Empatia",
            "Furto",
            "Istruzione",
            "Notare"
        ]
    },
    {
        "name": "Razrushitel",
        "nation": "Ussura",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Perché aggirare l’ostacolo quando si può sfondarlo?",
        "quirk": "Ottiene un Punto Eroe ogni volta che sceglie un approccio diretto, roboante e privo di qualsiasi finezza.",
        "advantages": [
            "Forte Come Dieci Uomini",
            "Palla Demolitrice"
        ],
        "skills": [
            "A.d. Guerra",
            "Atletica",
            "Cavalcare",
            "Esibirsi",
            "Rissa"
        ]
    },
    {
        "name": "Maledetto da Tură",
        "nation": "Ussura",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Ha scoperto sulla propria pelle che c’è più di una via per il potere.",
        "quirk": "Ottiene un Punto Eroe ogni volta che si mette nei guai per aver convinto un altro personaggio a sfidare l’autorità o ad agire contro le comuni convenzioni sociali.",
        "advantages": [
            "Senso dell’Orientamento",
            "Stregoneria (Tocco di Tură)",
            "Stregoneria (Tocco di Tură)"
        ],
        "skills": [
            "Allettare",
            "Convincere",
            "Istruzione",
            "Nascondersi",
            "Notare"
        ]
    },
    {
        "name": "Casanova",
        "nation": "Vodacce",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Che senso ha l’amore senza un pizzico – o un bel po' – di pericolo?",
        "quirk": "Ottiene un Punto Eroe quando si mette nei guai per avere lasciato che un altro personaggio la facesse franca perché ne era innamorato.",
        "advantages": [
            "Amoreggiare con il Pericolo",
            "Orologio Biologico"
        ],
        "skills": [
            "Allettare",
            "Convincere",
            "Esibirsi",
            "Furto",
            "Nascondersi"
        ]
    },
    {
        "name": "Comandante",
        "nation": "Vodacce",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Non c’è nulla che non possa fare con una nave sotto i piedi, il vento alle spalle e un equipaggio.",
        "quirk": "Ottiene un Punto Eroe quando intraprende un corso d’azione pericoloso, spinto dal coraggio e dall’ego.",
        "advantages": [
            "O Capitano, Mio Capitano",
            "Gambe da Marinaio",
            "Sposato al Mare"
        ],
        "skills": [
            "Convincere",
            "Empatia",
            "Intimidire",
            "Mira",
            "Navigazione"
        ]
    },
    {
        "name": "Pistola Nascosta",
        "nation": "Vodacce",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Quando vedono la canna della sua pistola è già troppo tardi. Speriamo non si arrivi a tanto.",
        "quirk": "Ottiene un Punto Eroe quando risolve una situazione con la minaccia della violenza, ma senza sfoderare la propria arma.",
        "advantages": [
            "Estrazione Rapida",
            "Sguardo di Ghiaccio"
        ],
        "skills": [
            "Allettare",
            "Atletica",
            "Empatia",
            "Intimidire",
            "Mira"
        ]
    },
    {
        "name": "Strega Selvaggia",
        "nation": "Vodacce",
        "source": "Nazioni di Théah Vol. 2",
        "desc": "Possiede una magia grezza, ma non per questo meno potente o pericolosa.",
        "quirk": "Ottiene un Punto Eroe quando si mette nei guai per avere deciso di aiutare un altro personaggio usando i propri poteri magici non addestrati.",
        "advantages": [
            "Contatto",
            "Oriundo",
            "Stregoneria (Sorte Non Addestrata)"
        ],
        "skills": [
            "Convincere",
            "Empatia",
            "Esibirsi",
            "Furto",
            "Nascondersi"
        ]
    }
],
  "advantages": [
    {
        "name": "Bevitore Emerito",
        "cost": 1,
        "description": "L’alcol non ha mai effetti negativi sull’Eroe, non importa quanto ne beva."
    },
    {
        "name": "Colosso",
        "cost": 1,
        "innate": true,
        "description": "Non cumulabile con 'Minuto'. Ottieni 1 Dado Bonus nei Rischi fisici in cui la mole corporea costituisca un chiaro vantaggio."
    },
    {
        "name": "Esperto Di Sopravvivenza",
        "cost": 1,
        "description": "In qualsiasi regione selvaggia raccogli o cacci cibo sufficiente per te e altri 5 compagni."
    },
    {
        "name": "Gambe Da Marinaio",
        "cost": 1,
        "description": "Ottieni 1 Dado Bonus in tutti i Rischi fisici eseguiti a bordo di navi o sartiame."
    },
    {
        "name": "Linguista",
        "cost": 1,
        "description": "Parli, leggi e scrivi tutte le lingue conosciute di Théah, comprese quelle morte."
    },
    {
        "name": "Minuto",
        "cost": 1,
        "innate": true,
        "description": "Non cumulabile con 'Colosso'. Ottieni 1 Dado Bonus nei Rischi in cui la corporatura minuta è un vantaggio per passare inosservato o fuggire."
    },
    {
        "name": "Oriundo",
        "cost": 1,
        "innate": true,
        "description": "Cresciuto in una Nazione differente dalla patria: ottieni 1 Dado Bonus nei Rischi legati a tale doppia eredità culturale."
    },
    {
        "name": "Orologio Biologico",
        "cost": 1,
        "description": "Sai sempre l'ora esatta con lo scarto di un minuto e stimi con precisione albe e tramonti."
    },
    {
        "name": "Senso dell’Orientamento",
        "cost": 1,
        "description": "Finché hai un punto di riferimento nell'ambiente, non perdi mai la bussola né l'orientamento."
    },
    {
        "name": "Stomaco Di Ferro",
        "cost": 1,
        "description": "Cibo avariato, acqua stagnante o carne cruda non hanno effetti negativi sul tuo organismo."
    },
    {
        "name": "Come Pesci in un Barile",
        "cost": 1,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Requisito: Mira Letale. Quando compi un Rischio di Mira con pistola, archibugio o arma da lancio contro una Squadra di Sgherri, puoi spendere 1 Incremento per ridurne la Forza di un valore pari al tuo Grado di Grazia."
    },
    {
        "name": "Disciplina di Fuoco",
        "cost": 1,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Requisito: Cecchino. In un Rischio di Mira con moschetto, arco lungo o balestra contro una vittima inconsapevole, la prima volta che spendi Incrementi per infliggere Ferite puoi spendere 1 PE per causare 1 Ferita Drammatica aggiuntiva (1 volta per Scena)."
    },
    {
        "name": "Gancio",
        "cost": 1,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Requisito: Pugilatore. In un Rischio di Rissa a mani nude, puoi spendere tutti i tuoi Incrementi nella prima Azione: il bersaglio subisce danni pari agli Incrementi spesi e perde metà dei propri Incrementi (arrotondati per difetto)."
    },
    {
        "name": "Sulla Breccia",
        "cost": 1,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Requisito: Mano Pesante. In un Rischio di Mischia con claymore, zweihander, ascia da battaglia, alabarda o altra arma a due mani, puoi non lanciare i dadi all'inizio del Round ed eliminare automaticamente un'intera Squadra di Sgherri a prescindere dalla Forza."
    },
    {
        "name": "Turbine d’Acciaio",
        "cost": 1,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Requisito: Schermidore. In un Rischio di Mischia con spada da scherma, daga, sciabola o altra arma a una mano, puoi non lanciare i dadi all'inizio del Round e dimezzare (per difetto) la Forza di tutte le Squadre di Sgherri presenti in Scena."
    },
    {
        "name": "Tutto è un’Arma se Usato nel Modo Giusto",
        "cost": 1,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Requisito: Rissoso. In un Rischio di Rissa con un'arma improvvisata, quando spendi 1 Incremento per causare Ferite puoi decidere che l'arma si rompa: le Ferite inflitte non possono essere prevenute in alcun modo (1 volta per Scena, o spendi 1 PE per procurarti una nuova arma)."
    },
    {
        "name": "Avaro",
        "cost": 1,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Per ogni Grado di questo Vantaggio, puoi mettere da parte 1 Ricchezza tra un Episodio e l’altro (non crea Ricchezza dal nulla, permette solo di risparmiarla)."
    },
    {
        "name": "Motto Personale",
        "cost": 1,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Scegli un motto, adagio o grido di guerra. Quando compi un Rischio dopo aver pronunciato il motto in circostanze appropriate, ottieni 1 Dado Bonus."
    },
    {
        "name": "Affascinare",
        "cost": 2,
        "description": "Spendi 1 PE: catturi l'attenzione totale di un bersaglio fino al termine della Scena finché interagisci con lui."
    },
    {
        "name": "Aggressione Sconsiderata",
        "cost": 2,
        "description": "Spendi 1 PE: sconfiggi istantaneamente un'intera Squadra di Sgherri subendo 1 Ferita Drammatica."
    },
    {
        "name": "Amicizie Altolocate",
        "cost": 2,
        "description": "Spendi 1 PE a un evento mondano: riveli che un tuo carissimo alleato dell'alta società è presente."
    },
    {
        "name": "Comando",
        "cost": 2,
        "description": "(1 pt se Sarmatiano) Spendi 1 PE: spingi un gruppo a seguire i tuoi ordini se ragionevoli."
    },
    {
        "name": "Contatto",
        "cost": 2,
        "description": "Hai un informatore o alleato fedele in una fazione o città specifica."
    },
    {
        "name": "Divincolarsi",
        "cost": 2,
        "description": "Spendi 1 PE: scivoli istantaneamente fuori da manette, corde o legacci."
    },
    {
        "name": "Equilibrio Perfetto",
        "cost": 2,
        "description": "Spendi 1 PE: ti muovi su cornicioni stretti, corde o muri con agilità impeccabile."
    },
    {
        "name": "Fama",
        "cost": 2,
        "description": "Ottieni 1 Dado Bonus nei Rischi sociali in cui la tua illustre reputazione incute deferenza o rispetto."
    },
    {
        "name": "Famiglia Allargata",
        "cost": 2,
        "description": "(1 pt se Ussurano) Spendi 1 PE: riveli che un parente lontano vive nei paraggi e può offrire asilo o risorse."
    },
    {
        "name": "Fatto!",
        "cost": 2,
        "description": "Spendi 1 PE: scassini una serratura, apri una cassaforte o disinneschi una trappola sul colpo."
    },
    {
        "name": "Gioco Di Squadra",
        "cost": 2,
        "description": "Spendi 1 Incremento per creare un'Opportunità e 1 secondo per attivarla subito per un compagno."
    },
    {
        "name": "Immunità ai Veleni",
        "cost": 2,
        "description": "(1 pt se Vodacce) Qualsiasi veleno letale o paralizzante ti causa solo un lieve e momentaneo fastidio."
    },
    {
        "name": "Ispirare Generosità",
        "cost": 2,
        "description": "Spendi 1 PE: convinci un PNG a donarti o procurarti un oggetto di cui hai urgente bisogno."
    },
    {
        "name": "Lavorare Sui Tetti",
        "cost": 2,
        "description": "Spendi 1 PE: trovi un varco alternativo sopraelevato per penetrare in un edificio sorvegliato."
    },
    {
        "name": "Manualità",
        "cost": 2,
        "description": "Spendi 1 PE: ripari provvisoriamente un congegno, nave o arma guasta per l'intera Scena."
    },
    {
        "name": "Mercanteggiare",
        "cost": 2,
        "description": "(1 pt se Avaloniano) Spendi 1 PE: ottieni sconti vantaggiosi o convinci un mercante a fidarsi ciecamente."
    },
    {
        "name": "Psst, Da Questa Parte",
        "cost": 2,
        "description": "Spendi 1 PE: da nascosto attiri e stordisci silenziosamente una sentinella nemica."
    },
    {
        "name": "Scafato",
        "cost": 2,
        "description": "Spendi 1 PE: trovi subito ricettatori, contrabbandieri o informatori nei bassifondi locali."
    },
    {
        "name": "Sguardo Di Ghiaccio",
        "cost": 2,
        "description": "(1 pt se Eiseniano) Spendi 1 PE: terrorizzi un bersaglio costringendolo a fuggire o cedere il passo."
    },
    {
        "name": "Sorriso Disarmante",
        "cost": 2,
        "description": "Spendi 1 PE: blocchi un avversario che stava per sguainare la spada, impedendogli di attaccare per primo."
    },
    {
        "name": "Spirito Valoroso",
        "cost": 2,
        "description": "Cominci ogni sessione di gioco con 2 Punti Eroe invece di 1."
    },
    {
        "name": "Sposato Al Mare",
        "cost": 2,
        "description": "Disponi di una Nave e l'equipaggio ti riconosce come leader leggendario delle onde."
    },
    {
        "name": "Stregoneria",
        "cost": 2,
        "description": "Ottieni l'accesso alla Stregoneria del Sangue della tua Nazione nativa."
    },
    {
        "name": "Vieni Qui",
        "cost": 2,
        "description": "Spendi 1 PE: attiri un PNG in disparte e poi ti dilegui, isolandolo dalla Scena d'Azione."
    },
    {
        "name": "Vista d'Aquila",
        "cost": 2,
        "description": "Vedi distintamente dettagli microscopici fino a 2 km e ottieni +1 Dado Bonus nei Rischi visivi."
    },
    {
        "name": "Volontà Indomabile",
        "cost": 2,
        "description": "Spendi 1 PE: annulli e resisti all'istante a un tentativo di intimidazione, seduzione o paura."
    },
    {
        "name": "Duellante Adattabile",
        "cost": 2,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Requisito: Conoscere almeno 2 Stili di Duello. Spendi 1 PE per cambiare lo Stile prescelto nel corso di un Round, purché rispetti i requisiti del nuovo Stile (come le armi). Utilizzabile 1 volta per Round."
    },
    {
        "name": "Questa è la Mia Città",
        "cost": 2,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Quando ti trovi in un luogo familiare, spendi 1 PE per seminare un pedinatore, individuare uno straniero, capire se qualcuno ti segue o trovare una scorciatoia."
    },
    {
        "name": "Appello Accorato",
        "cost": 2,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Spendi 1 PE: implori un altro personaggio di seguire la propria coscienza, guardare dall’altra parte per il bene altrui o compiere un’altra azione giusta, anche se non è nel suo miglior interesse."
    },
    {
        "name": "Nato in Sella",
        "cost": 2,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Spendi 1 PE: fai eseguire un’azione speciale al tuo cavallo (balzo incredibile, richiamo al fianco, evitare un attacco nemico o colpire con zoccoli e denti evitando o causando Ferite pari al tuo Grado di Cavalcare)."
    },
    {
        "name": "O Capitano, Mio Capitano",
        "cost": 2,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Quando intraprendi un Rischio audace o pericoloso in mare, spendi 1 PE per ispirare gli alleati: ognuno ottiene un numero di Dadi Bonus pari al tuo Grado di Navigazione."
    },
    {
        "name": "Palla Demolitrice",
        "cost": 2,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Spendi 1 PE: sfondi una porta, abbatti una barricata, ribalti un carro o distruggi in altro modo un oggetto grazie alla tua forza e impeto."
    },
    {
        "name": "Sguardo Imperioso",
        "cost": 2,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Spendi 1 PE: imponi la tua autorità (reale o percepita) affinché un altro personaggio ti lasci in pace, se ne vada o consideri le tue azioni come il semplice capriccio di un nobile arrogante."
    },
    {
        "name": "Approccio Dinamico",
        "cost": 3,
        "description": "Spendi 1 PE: cambi il tuo Approccio dichiarato durante una Sequenza d'Azione in corso."
    },
    {
        "name": "Cameratismo",
        "cost": 3,
        "description": "(2 pt se Montaigne) Quando spendi 1 PE per aiutare un compagno, questi riceve 4 dadi bonus anziché 3."
    },
    {
        "name": "Cattedra",
        "cost": 3,
        "description": "Ottieni asilo e risorse in ogni ateneo accademico e 2 Dadi Bonus nelle dispute intellettuali."
    },
    {
        "name": "Cecchino",
        "cost": 3,
        "description": "Ottieni 1 Dado Bonus in tutti i Rischi di Mira effettuati con moschetti, archi lunghi o balestre."
    },
    {
        "name": "Consacrato",
        "cost": 3,
        "description": "(2 pt se Castilliano) Hai preso i sacri voti ecclesiastici: ottieni asilo in chiesa e 2 Dadi Bonus coi devoti."
    },
    {
        "name": "In Balia Degli Eventi",
        "cost": 3,
        "description": "Il tuo Eroe ottiene una seconda Storia Personale indipendente per sbloccare più avanzamenti."
    },
    {
        "name": "Mano Lesta",
        "cost": 3,
        "description": "Spendi 1 PE: borseggi o sfili un oggetto a chiunque senza che nessuno possa accorgersene."
    },
    {
        "name": "Mano Pesante",
        "cost": 3,
        "description": "Ottieni 1 Dado Bonus in Mischia usando claymore, zweihander, alabarde o armi a due mani pesanti."
    },
    {
        "name": "Mastro Artigiano",
        "cost": 3,
        "description": "(2 pt se Vesten) Sei in grado di forgiare capolavori pregiati o autentici Oggetti Distintivi leggendari."
    },
    {
        "name": "Mecenate",
        "cost": 3,
        "description": "Un nobile o magnate finanzia le tue imprese: inizi ogni sessione con Ricchezza 1 e appoggi politici."
    },
    {
        "name": "Mira Letale",
        "cost": 3,
        "description": "Ottieni 1 Dado Bonus nei Rischi di Mira usando pistole a pietra focaia, archibugi o daghe da lancio."
    },
    {
        "name": "Oggetto Distintivo",
        "cost": 3,
        "description": "Un'arma o reliquia leggendaria: spendi PE per infliggere ferite titaniche o prevenire danni gravi."
    },
    {
        "name": "Opportunista",
        "cost": 3,
        "description": "Quando un compagno o PNG crea un'Opportunità, spendi 1 PE per trarne beneficio all'istante."
    },
    {
        "name": "Pugilatore",
        "cost": 3,
        "description": "Ottieni 1 Dado Bonus nei Rischi di Rissa quando combatti a mani nude come un vero lottatore."
    },
    {
        "name": "Ricco",
        "cost": 3,
        "description": "Inizi ogni sessione con Ricchezza 3 per acquistare navi, carrozze, palazzi o mercenari d'élite."
    },
    {
        "name": "Riflessi Rapidi",
        "cost": 3,
        "description": "Nell'Abilità scelta calcoli l'iniziativa come se avessi sempre generato 1 Incremento supplementare."
    },
    {
        "name": "Rissoso",
        "cost": 3,
        "description": "Ottieni 1 Dado Bonus in Rissa impugnando tavoli da locanda, sgabelli, boccali o armi improvvisate."
    },
    {
        "name": "Schermidore",
        "cost": 3,
        "description": "Ottieni 1 Dado Bonus in Mischia quando impugni stocchi, daghe, fioretti o sciabole da marinaio."
    },
    {
        "name": "Un Semplice Malinteso",
        "cost": 3,
        "description": "Spendi 1 PE: ritratti un'offesa verbale facendola sembrare il più garbato e raffinato dei complimenti."
    },
    {
        "name": "Virtuoso",
        "cost": 3,
        "description": "Ottieni 1 Dado Bonus in tutti i Rischi di Esibirsi legati alla tua forma d'arte d'elezione."
    },
    {
        "name": "Indorare la Pillola",
        "cost": 3,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Puoi spendere 1 Ricchezza per corrompere un altro personaggio, durante una Sequenza d’Azione o Drammatica, senza usare Incrementi (1 volta per Sequenza)."
    },
    {
        "name": "Prendere il Vento",
        "cost": 3,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Mentre conduci una nave, spendi 1 PE per raggiungere la destinazione più in fretta (la Nave subisce 1 Colpo Critico, ma il tempo di viaggio è ridotto di un quarto, o semini un inseguitore)."
    },
    {
        "name": "Requisitoria Feroce",
        "cost": 3,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Quando compi un Rischio di Convincere o Intimidire, spendi 1 PE per dimezzare (arrotondando per difetto) la Forza di una singola Squadra di Sgherri presente in Scena."
    },
    {
        "name": "Studioso di Lotta",
        "cost": 3,
        "source": "Nazioni di Théah Vol. 1",
        "description": "Apprendi le Manovre Fendente, Parata e una terza a tua scelta non appartenente a uno Stile e puoi eseguirle come se fossi un Duellante. Il vantaggio Sala d’Armi ti costa solo 3 Punti."
    },
    {
        "name": "Colpo a Segno",
        "cost": 3,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Quando spendi Incrementi per infliggere Ferite o eseguire una Manovra durante un Rischio di Rissa, puoi spendere Punti Eroe per causare danni aggiuntivi: ogni PE speso provoca 2 Ferite aggiuntive."
    },
    {
        "name": "Estrazione Rapida",
        "cost": 3,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Quando compi un Rischio di Mira, spendi 1 PE per far sì che ogni coppia di risultati identici ti frutti 1 Incremento aggiuntivo (questi dadi possono essere usati anche per creare Incrementi come di norma)."
    },
    {
        "name": "Fiducioso",
        "cost": 3,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Attivabile dopo che il GM ha acquistato i tuoi dadi non utilizzati durante un Rischio di Empatia: ottieni 2 Punti Eroe, invece del normale 1, per ogni dado acquistato (1 volta per Episodio)."
    },
    {
        "name": "Lama Fulminea",
        "cost": 3,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Durante un Rischio di Mischia, quando spendi Incrementi per infliggere Ferite o eseguire una Manovra contro un personaggio o Squadra di Sgherri, spendi 1 PE per causare un eguale numero di Ferite a un altro personaggio o Squadra presente sulla Scena (1 volta per Round)."
    },
    {
        "name": "Mente del Gruppo",
        "cost": 3,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Quando spendi 1 PE per conferire Dadi Bonus a un alleato durante un Rischio, puoi spenderne un secondo per conferire ulteriori Dadi Bonus pari al tuo Grado di Istruzione."
    },
    {
        "name": "Accademia Militare",
        "cost": 4,
        "innate": true,
        "description": "Aumenti di +1 il risultato di ogni dado tirato con Atletica, Cavalcare e Arte della Guerra."
    },
    {
        "name": "Alchimista",
        "cost": 4,
        "description": "(Solo Castilliani) Spendi 1 PE per miscelare elisir di potenziamento, fumo accecante o oli scivolosi."
    },
    {
        "name": "Compagno Fidato",
        "cost": 4,
        "description": "Hai al tuo fianco un devoto alleato PNG (o animale) che agisce con te lanciando 5 dadi nei Rischi."
    },
    {
        "name": "Duro Da Uccidere",
        "cost": 4,
        "description": "Disponi di un livello extra di salute: diventi Inerme solo alla 5ª Ferita Drammatica anziché alla 4ª."
    },
    {
        "name": "Fautore Di Miracoli",
        "cost": 4,
        "description": "Spendi 1 PE e 1 Incremento: curi un altro Eroe guarendogli immediatamente 1 Ferita Drammatica."
    },
    {
        "name": "Scuola Di Maniere",
        "cost": 4,
        "innate": true,
        "description": "Aumenti di +1 il risultato di ogni dado tirato nei Rischi sociali con Convincere, Intimidire o Allettare."
    },
    {
        "name": "Seidr",
        "cost": 4,
        "description": "(Solo Vesten) Spendi 1 PE per interrogare le rune con una domanda sì/no o scorgere il vero Nome arcano."
    },
    {
        "name": "Solo Contro Tutti",
        "cost": 4,
        "description": "Quando subisci danni da una Squadra di Sgherri, sottrai la tua Risolutezza dalle Ferite subite."
    },
    {
        "name": "Specialista",
        "cost": 4,
        "description": "In una delle tue Abilità a Grado 3+ improvvisi qualsiasi azione senza dover spendere Incrementi extra."
    },
    {
        "name": "Tratto Leggendario",
        "cost": 4,
        "description": "In un Tratto scelto lanci 1 dado in meno convertendolo in un 10 automatico permanente che esplode."
    },
    {
        "name": "Università",
        "cost": 4,
        "innate": true,
        "description": "Aumenti di +1 il risultato di tutti i dadi tirati nei Rischi di Istruzione, Empatia e Notare."
    },
    {
        "name": "Amoreggiare con il Pericolo",
        "cost": 4,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Puoi attivare questo Vantaggio durante un Rischio di Allettare per obbligare il GM a comprare tutti i tuoi dadi inutilizzati (1 volta per Episodio)."
    },
    {
        "name": "Bussola Morale",
        "cost": 4,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Requisito: Aver completato almeno una Storia di Redenzione e non avere Corruzione. Ogni volta che aiuti un altro Eroe a completare un Atto di una Storia di Redenzione, questi rimuove 2 Punti Corruzione invece di 1."
    },
    {
        "name": "Forte Come Dieci Uomini",
        "cost": 5,
        "description": "(3 pt se Ussurano) Spendi 1 PE in prove di pura forza: sommi Vigore a ciascun dado tirato."
    },
    {
        "name": "Joie De Vivre",
        "cost": 5,
        "description": "(3 pt se Montaigne) Spendi 1 PE contro un Malvagio: tutti i compagni considerano 10 i dadi <= al proprio Grado."
    },
    {
        "name": "L’Unione Fa la Forza",
        "cost": 5,
        "description": "(3 pt se Sarmatiano) Spendi 1 PE: trasferisci istantaneamente qualsiasi numero dei tuoi Incrementi a un compagno."
    },
    {
        "name": "La Fortuna Del Diavolo",
        "cost": 5,
        "description": "(3 pt se Avaloniano) Spendi 1 PE dopo un tiro di Rischio: rilanci tutti i dadi che desideri tenendo il nuovo esito."
    },
    {
        "name": "Lampo Di Genio",
        "cost": 5,
        "description": "(3 pt se Castilliano) Spendi 1 PE in un campo di studio: ottieni un numero di Incrementi pari al tuo Acume."
    },
    {
        "name": "Non Morirò Qui",
        "cost": 5,
        "description": "(3 pt se Eiseniano) Spendi 1 PE: ignori ogni penalità delle Ferite Drammatiche per un intero round."
    },
    {
        "name": "Non Siamo Poi Tanto Diversi…",
        "cost": 5,
        "description": "(3 pt se Vodacce) Spendi 1 PE: convinci un Malvagio di essere suo alleato finché non compi un gesto eroico evidente."
    },
    {
        "name": "Sala d’Armi",
        "cost": 5,
        "description": "Entri a far parte della Gilda dei Duellanti e apprendi uno Stile di Duello ufficiale di Théah. Puoi acquistare questo Vantaggio più volte per apprendere ulteriori Stili di Duello (costa 3 Punti se possiedi Studioso di Lotta)."
    },
    {
        "name": "Ti Porto Con Me",
        "cost": 5,
        "description": "(3 pt se Vesten) Spendi 1 PE: incrementi i danni inflitti del numero di Ferite Drammatiche che hai subito."
    },
    {
        "name": "Dono Oscuro",
        "cost": 5,
        "source": "Nazioni di Théah Vol. 2",
        "description": "Scegli una Qualità Mostruosa: spendi 1 PE per attivarla per un Round ottenendo gli stessi benefici di un Malvagio e +1 Punto Corruzione (acquistabile alla creazione o vivendo avventure in Eisen)."
    }
],
  "basic_maneuvers": [
    {
        "name": "Fendente",
        "icon": "⚔️",
        "type": "Attacco",
        "timing": "Durante la propria Azione (1 Incremento)",
        "oncePerRound": false,
        "officialText": "È una semplice Manovra di attacco, ma persino i più dotati malviventi la vorrebbero apprendere. Eseguendo un Fendente, il personaggio infligge un numero di Ferite pari al suo Grado di Mischia."
    },
    {
        "name": "Parata",
        "icon": "🛡️",
        "type": "Difesa (Reazione)",
        "timing": "Immediatamente dopo aver subito Ferite (1 Incremento)",
        "oncePerRound": false,
        "officialText": "Questa è l’arte di porre la propria arma tra sé e il pericolo. Eseguire una Parata previene un numero di Ferite pari al Grado di Mischia del personaggio. È possibile usare questa Manovra solo immediatamente dopo aver subito Ferite."
    },
    {
        "name": "Finta",
        "icon": "🎭",
        "type": "Tattica / Attacco",
        "timing": "Durante la propria Azione (1 Incremento)",
        "oncePerRound": false,
        "officialText": "Porsi e agire in modo che l’avversario apra la guardia o tenti di parare un attacco che non arriverà mai. Quando un personaggio esegue una Finta infligge 1 Ferita; inoltre, se colpisce il suo avversario nuovamente nel corso del Round, questi subirà una Ferita aggiuntiva dal nuovo attacco."
    },
    {
        "name": "Affondo",
        "icon": "⚡",
        "type": "Attacco Finale",
        "timing": "Spende TUTTI gli Incrementi residui",
        "oncePerRound": true,
        "officialText": "L’Affondo è una Manovra sconsiderata e spesso disperata, ma capace di chiudere all’istante uno scontro. Quando la esegue, il personaggio spende tutti i suoi Incrementi e infligge un numero di Ferite pari al suo Grado di Mischia più il numero di Incrementi spesi. Queste Ferite non possono essere evitate o prevenute."
    },
    {
        "name": "Botta",
        "icon": "👊",
        "type": "Controllo / Attacco",
        "timing": "Durante la propria Azione (1 Incremento)",
        "oncePerRound": false,
        "officialText": "Usando il pomo della spada o un pugno, il personaggio sbilancia l’avversario per rendere meno efficace la sua prossima mossa. La Botta infligge 1 Ferita e la prossima volta in cui l’avversario colpisce infliggerà una Ferita in meno per ogni Grado di Mischia del personaggio."
    },
    {
        "name": "Risposta",
        "icon": "🔄",
        "type": "Contrattacco (Reazione)",
        "timing": "Subito dopo aver subito Ferite (Max 1 volta per Round)",
        "oncePerRound": true,
        "officialText": "Più di ogni altra Manovra, l’incapacità di apprendere la Risposta ha fatto sì che numerosi studenti non si siano mai diplomati. Quando esegue una Risposta, un personaggio previene un numero di Ferite pari al suo Grado di Mischia e ne infligge altrettante. È possibile usare questa Manovra solo subito dopo aver subito Ferite, e unicamente una volta per Round."
    }
],
  "dueling_styles": [
    {
        "name": "Aldana",
        "nation": "Castille",
        "source": "Manuale Base (pag. 236)",
        "weapons": "Spada da scherma in una mano e nulla nell’altra",
        "maneuver": "Stratagemma Aldana",
        "cost": "1 Incremento (Max 1/Round)",
        "lore": "Lo Stile preferito di molti Castilliani, uno dei pochi a Théah che rinuncia all’uso della mano sinistra (tenuta dietro la schiena presentando solo il profilo). Combina la scherma e la danza per produrre movimenti inaspettati in base al ritmo della canzone su cui il Duellante sta 'ballando' nella sua mente.",
        "description": "Quando il personaggio impugna una spada da scherma in una mano e nulla nell’altra può eseguire una Manovra speciale detta Stratagemma Aldana, che aumenta del suo Grado di Panache il numero di Ferite inflitte dal prossimo attacco contro l’avversario. Questa Manovra può essere eseguita solo una volta per Round."
    },
    {
        "name": "Ambrogia",
        "nation": "Vodacce",
        "source": "Manuale Base (pag. 237)",
        "weapons": "Spada da scherma (come uno stocco o una sciabola marinaresca) nella sinistra e un pugnale nella destra",
        "maneuver": "Inganno di Veronica",
        "cost": "Passivo / 1 Punto Eroe",
        "lore": "Fondato da Veronica Ambrogia, celebre cortigiana di Vodacce, insegna a combattere tenendo nella sinistra la spada e nella destra la daga per confondere le difese dell'avversario ed enfatizza la praticità sopra ogni cosa.",
        "description": "Quando impugna nella sinistra una spada da scherma (come uno stocco o una sciabola marinaresca) e nella destra un pugnale, il personaggio ottiene la capacità Inganno di Veronica. Quando crea la Riserva di Rischio per Mischia può usare il suo Grado di Grazia o Acume, a scelta. Spendendo 1 Punto Eroe può usarli entrambi."
    },
    {
        "name": "Boucher",
        "nation": "Montaigne",
        "source": "Manuale Base (pag. 237)",
        "weapons": "Un coltello o una daga in una mano e nulla, oppure un secondo coltello o daga, nell’altra",
        "maneuver": "Passo Boucher",
        "cost": "Incrementi delle 2 Manovre (Max 1/Round)",
        "lore": "Stile di lotta nato nelle strade di Montaigne, tra i più veloci insegnati oggi. I discepoli impugnano lunghi coltelli in una raffica di colpi ravvicinati pensati per confondere e disorientare.",
        "description": "Quando impugna un coltello o una daga in una mano e nulla, oppure un secondo coltello o daga, nell’altra, il personaggio ottiene la capacità Passo Boucher. Questa gli permette di eseguire due Manovre una dopo l’altra senza interruzioni, spendendo gli Incrementi per entrambe. Tutte le altre normali regole si applicano ancora, come l’impossibilità di eseguire la stessa Manovra due volte di seguito. Questa capacità può essere usata solo una volta per Round."
    },
    {
        "name": "Donovan",
        "nation": "Avalon",
        "source": "Manuale Base (pag. 237)",
        "weapons": "Un’arma pesante (una spada lunga, una mazza ecc.)",
        "maneuver": "Baluardo di Donovan",
        "replaces": "Parata",
        "cost": "Sostituisce Parata (Opzionale: +1 PE)",
        "lore": "Creato a Carleon da Donovan Durant, la più famosa guardia del corpo di Théah, prevede rigidi esami d'ammissione riservati a chi condivide la sua assoluta dedizione alla protezione altrui.",
        "description": "Quando il personaggio impugna un’arma pesante (una spada lunga, una mazza ecc.) la sua Manovra di Parata è sostituita dal Baluardo di Donovan. Questo previene a lui o un alleato entro portata un numero di Ferite pari al Grado di Mischia del personaggio. Inoltre, quando si esegue il Baluardo, è possibile spendere 1 Punto Eroe per incastrare la propria arma con quella dell’avversario; nel farlo entrambi i contendenti perdono tutti i loro Incrementi residui e non possono più compiere Azioni per quel Round."
    },
    {
        "name": "Drexel",
        "nation": "Eisen",
        "source": "Manuale Base (pagg. 237-238)",
        "weapons": "Un’arma pesante a due mani (zweihander)",
        "maneuver": "Guardie Drexel (Bittner, Metzger, Gerbeck)",
        "cost": "Scelta a inizio Round (1 Incr. per cambiare)",
        "lore": "Sviluppato dal mercenario Kristoff Drexel, capo degli 'Spiriti Sanguinari', sfrutta la versatile zweihander Eiseniana attraverso tre Guardie distinte per adattarsi a ogni situazione tattica.",
        "description": "Quando il personaggio impugna un’arma pesante a due mani può scegliere tra: • Guardia Bittner (Frontale): Le Manovre che prevengono le Ferite bloccheranno un numero di Ferite aggiuntive pari alla Risolutezza del personaggio. Non sarà possibile eseguire Fendenti, si potrà infliggere danno come un non-Duellante. • Guardia Metzger (Posteriore): Il personaggio esegue tutte le Azioni come se avesse un numero di Incrementi extra pari al suo Acume (usati solo per determinare quando agisce, non spendibili). Non potrà però eseguire Parate e dovrà prevenire i danni come un non-Duellante. • Guardia Gerbeck (Alta): Le Manovre che infliggono Ferite causeranno 1 Ferita aggiuntiva, ma il personaggio agirà sempre come se avesse 1 Incremento in meno (minimo 1). Il personaggio sceglie la sua Guardia all’inizio del Round; per cambiarla nel corso del Round dovrà spendere 1 Incremento."
    },
    {
        "name": "Eisenfaust",
        "nation": "Eisen",
        "source": "Manuale Base (pag. 238)",
        "weapons": "Un’arma pesante a una mano e un panzerhand sull’altra",
        "maneuver": "Risposta di Ferro",
        "replaces": "Risposta",
        "cost": "Sostituisce Risposta (Max 1/Round)",
        "lore": "Stile difensivo che impiega una spadona a una mano accompagnata da un guanto d'arme in ferro (panzerhand) sulla sinistra per deflettere o afferrare la lama nemica e contrattaccare con terribili colpi.",
        "description": "Quando il personaggio impugna un’arma pesante a una mano e indossa un panzerhand sull’altra la sua Manovra Risposta sarà sostituita da Risposta di Ferro, che previene un numero di Ferite pari al suo Grado di Risolutezza+Mischia e ne infligge un numero pari al suo Grado di Vigore+Mischia. Questa Manovra, come la normale Risposta, può essere eseguita solo una volta per Round."
    },
    {
        "name": "Leegstra",
        "nation": "Vestenmennavenjar",
        "source": "Manuale Base (pag. 238)",
        "weapons": "Un’arma pesante per mano (di solito asce o martelli, ma anche spade)",
        "maneuver": "Schianto Leegstra",
        "cost": "1 Incremento (Max 1/Round)",
        "lore": "Formalizzato a Thorshofn da Leegstra Eldsdóttir, è uno Stile estremamente offensivo che prevede un'arma pesante in ogni mano per seppellire l'avversario sotto una valanga di attacchi.",
        "description": "Quando il personaggio impugna un’arma pesante per mano (di solito asce o martelli, ma anche spade) può effettuare una Manovra speciale detta Schianto Leegstra. Questa infligge un numero di Ferite pari al Grado di Mischia del personaggio. Un Duellante può eseguire lo Schianto Leegstra solo una volta per Round."
    },
    {
        "name": "Mantovani",
        "nation": "Vodacce",
        "source": "Manuale Base (pag. 238)",
        "weapons": "Una frusta",
        "maneuver": "Sferzata Mantovani",
        "cost": "1 Incremento (Max 1/Round)",
        "lore": "Creato da Vito Mantovani attorno alla frusta e basato su inganno e adattabilità, permette di manipolare l'ambiente o sferzare il dorso della mano armata del nemico.",
        "description": "Quando impugna una frusta, il personaggio ottiene una Manovra speciale detta Sferzata Mantovani. Questa infligge 1 Ferita e permette di scegliere una Manovra che l’avversario può eseguire (sia base, sia concessa da uno Stile). Il bersaglio non potrà eseguire la Manovra indicata perché la sua arma sarà avvolta nelle spire della frusta, avrà subito un colpo doloroso sul dorso della mano o non sarà in grado di reagire per altri motivi. La Sferzata può essere eseguita solo una volta per Round."
    },
    {
        "name": "Mireli",
        "nation": "Ussura",
        "source": "Manuale Base (pag. 239)",
        "weapons": "In una mano un’arma pesante (come una sciabola da cavalleria o un’accetta) oppure due – una per mano",
        "maneuver": "Revisione di Mireli",
        "cost": "1 Incremento",
        "lore": "Creato dalla ballerina Katya Mireli, la cui Sala d'Armi itinerante viaggia con le troupe circensi per tutta Ussura insegnando la celebre e imprevedibile Danza con la Spada.",
        "description": "Quando il personaggio impugna in una mano un’arma pesante (come una sciabola da cavalleria, ma molti Duellanti Mireli preferiscono un’accetta) oppure due – una per mano – può eseguire una manovra speciale detta Revisione di Mireli. Questa funziona come una Manovra di Botta o Parata a scelta di chi la esegue."
    },
    {
        "name": "Sabat",
        "nation": "Confederazione Sarmatiana",
        "source": "Manuale Base (pag. 239)",
        "weapons": "Un’arma pesante in una mano (di solito una sciabola da cavalleria)",
        "maneuver": "Gambetto Sabat",
        "replaces": "Affondo",
        "cost": "Sostituisce Affondo (Tutti gli Incrementi)",
        "lore": "Ideato dal Grande Maestro di scacchi Mirek Sabat, favorisce uno stile difensivo paziente che spinge l'avversario a stancarsi per poi finirlo con un solo colpo decisivo.",
        "description": "Quando impugna un’arma pesante in una mano (di solito una sciabola da cavalleria), la Manovra Affondo del personaggio è sostituita dal Gambetto Sabat. Questo infligge un numero di Ferite pari al suo Grado di Mischia+Grazia+il numero di Incrementi spesi."
    },
    {
        "name": "Torres",
        "nation": "Castille",
        "source": "Manuale Base (pag. 239)",
        "weapons": "Una spada da scherma (come uno stocco o una sciabola marinaresca) in una mano e nulla nell’altra, indossando però una cappa",
        "maneuver": "Svolazzo del Matador",
        "cost": "1 Incremento (Max 1/Round)",
        "lore": "Sviluppato inizialmente per le corride, impiega uno stocco in una mano e una cappa nell'altra per formare un muro di tessuto e acciaio e nascondere i movimenti della lama.",
        "description": "Quando il personaggio impugna una spada da scherma (come uno stocco o una sciabola marinaresca) in una mano e nulla nell’altra, indossando però una cappa, potrà eseguire una Manovra speciale detta Svolazzo del Matador. Questa previene un numero di Ferite pari al Grado di Atletica del Duellante. Lo Svolazzo può essere eseguito solo una volta per Round."
    },
    {
        "name": "Valroux",
        "nation": "Montaigne",
        "source": "Manuale Base (pag. 239)",
        "weapons": "Una spada da scherma nella destra e una daga nella sinistra",
        "maneuver": "Croce Valroux",
        "cost": "1 Incremento (Reazione, Max 1/Round)",
        "lore": "Impiega spada da scherma nella mano principale e daga mancina per parare, muovendosi in cerchio, cambiando ritmo e umiliando l'avversario fino a demoralizzarlo.",
        "description": "Quando impugna una spada da scherma nella destra e una daga nella sinistra, il personaggio può eseguire una Manovra detta Croce Valroux. Questa previene un numero di Ferite pari al Grado di Mischia del personaggio e gli permette di scegliere una Manovra che l’avversario potrebbe eseguire come sua prossima Azione. Eseguire Manovre diverse da quella prescelta costerà un Incremento extra all’avversario. La Croce può essere eseguita solo una volta per Round, subito dopo un’Azione che abbia inflitto Ferite al personaggio."
    },
    {
        "name": "Cleasa di Skatha",
        "nation": "Avalon / Inismore / Highland",
        "source": "Nazioni di Théah Vol. 1 (pag. 53)",
        "weapons": "Qualsiasi arma (in grado di muoversi liberamente, senza protezioni ingombranti e con spazio attorno a sé)",
        "maneuver": "Balzo del Salmone",
        "cost": "1 Incremento (Max 1/Round)",
        "lore": "Antica tradizione marziale di Eithne O'Guaire e Cailean MacCormac basata sugli stratagemmi (cleasa) della dea guerriera Skatha, che enfatizzano fisicità, acrobazie e salti sorprendenti.",
        "description": "Il personaggio in grado di muoversi liberamente – senza protezioni ingombranti e con spazio attorno a sé – salta verso l’alto così da superare la guardia del nemico, a prescindere dall’arma. La Manovra infligge un numero di Ferite pari al Grado di Atletica del personaggio che non possono essere prevenute in alcun modo. Un Duellante può eseguire il Balzo del Salmone solo una volta per Round."
    },
    {
        "name": "Siqueira",
        "nation": "Castille",
        "source": "Nazioni di Théah Vol. 1 (pag. 100)",
        "weapons": "Un bastone o un randello (vara)",
        "maneuver": "Tomar al Toro Por las Astas",
        "cost": "1 Incremento (Max 1/Round)",
        "lore": "Stile dei toreros di el Baile del Toro a Odiseo, originato dalle tecniche dei pastori: usa la vara per provocare l'avversario a caricare a testa bassa e colpirlo al fianco.",
        "description": "Quando il personaggio impugna un bastone o un randello può eseguire una Manovra speciale chiamata Tomar al Toro Por las Astas (Prendere il Toro per le Corna). Questa permette di Mettere Pressione al proprio avversario, che dovrà spendere 2 Incrementi invece di 1 per compiere qualsiasi Azione diversa dall’attaccare (ossia causare Ferite con ogni mezzo disponibile). Se l’avversario attacca, il duellante infligge un numero di Ferite pari al proprio grado di Grazia. Questa Manovra può essere eseguita solo una volta per Round."
    },
    {
        "name": "De Vore",
        "nation": "Montaigne",
        "source": "Nazioni di Théah Vol. 1 (pag. 148)",
        "weapons": "Una spada da scherma nella mano principale",
        "maneuver": "Cortesia de Vore",
        "cost": "Tutti gli Incrementi (Max 1/Round)",
        "lore": "Scuola dello château di Mont de Vore ad Auzat diretta da Riche la Barrè, ex membro della Garde Lumineuse: postura eretta come una statua, lama tenuta alta ed efficienza assoluta.",
        "description": "Quando impugna una spada da scherma nella mano principale, il personaggio può eseguire una Manovra speciale chiamata Cortesia de Vore. Questa richiede la spesa di tutti gli Incrementi e la scelta di un personaggio presente nella Scena (anche il Duellista stesso). La Cortesia de Vore previene tutte le Ferite inflitte al bersaglio da altri personaggi – non quelle frutto di Conseguenze o effetti ambientali. Questo include anche Ferite normalmente impossibili da prevenire, ad esempio causate dalla Manovra Affondo o da un colpo di pistola. Questa Manovra può essere usata solo una volta per Round."
    },
    {
        "name": "Hallbjorn",
        "nation": "Vestenmennavenjar",
        "source": "Nazioni di Théah Vol. 1 (pag. 195)",
        "weapons": "Un’arma pesante (di solito un’ascia, ma a volte un maglio o uno spadone) in una mano e uno scudo nell’altra",
        "maneuver": "Urto Hallbjorn",
        "cost": "1 Incremento (Max 1/Round)",
        "lore": "Fondato dal leggendario razziatore Hallbjorn Ulfsen, impiega leggeri scudi Vesten in legno rinforzato e decorati con rune sia per la difesa sia per creare aperture con attacchi feroci.",
        "description": "Quando impugna un’arma pesante (di solito un’ascia, ma a volte un maglio o uno spadone) in una mano e uno scudo nell’altra, il personaggio può usare una manovra speciale detta “Urto Hallbjorn”. Questa infligge un numero di Ferite pari al Grado di Vigore del Duellante e, inoltre, se l’avversario subisce altre Ferite entro la fine del Round subirà Ferite aggiuntive pari al Grado di Vigore del Duellante. Questa Manovra può essere eseguita solo una volta per Round."
    },
    {
        "name": "Kummerholt",
        "nation": "Eisen",
        "source": "Nazioni di Théah Vol. 2 (pag. 53)",
        "weapons": "Una piccola lama (come un pugnale, un pezzo di vetro o una spada spezzata)",
        "maneuver": "Rintocco di Morte",
        "cost": "Tutti gli Incrementi (Max 1/Scena)",
        "lore": "Adottato dai Duellanti Waisen che hanno perso tutto nella Guerra della Croce: più che una scuola è uno stato mentale disperato per abbattere avversari e Orrori superiori con un ultimo colpo al cuore.",
        "description": "Quando il personaggio impugna una piccola lama (come un pugnale, un pezzo di vetro o una spada spezzata) ottiene una Manovra speciale chiamata Rintocco di Morte. Per usarla dovrà spendere tutti i propri Incrementi, causando un numero di Ferite pari al proprio Grado di Mischia + il numero di Incrementi spesi + la Forza dell’Avversario (o il suo Tratto più alto se non è un Malvagio). Queste Ferite non possono essere evitate o prevenute. Il Rintocco può essere usato solo una volta per Scena."
    },
    {
        "name": "Szybowanie",
        "nation": "Confederazione Sarmatiana",
        "source": "Nazioni di Théah Vol. 2 (pag. 100)",
        "weapons": "Qualsiasi arma mentre si trova in posizione sopraelevata (in sella, ma non solo)",
        "maneuver": "Picchiata dell’Aquila",
        "cost": "1 Incremento + 1 Punto Eroe (Max 1/Round)",
        "lore": "Sviluppato dall'ussara alata Kyra Mikita per sfruttare non solo la sella ma qualsiasi posizione sopraelevata sul campo di battaglia calando sul nemico con impeto devastante.",
        "description": "Quando il personaggio si trova in posizione sopraelevata (in sella, ma non solo) può eseguire una Manovra speciale detta Picchiata dell’Aquila. Il Duellante si avventa sul proprio avversario menando un colpo molto potente che infligge un numero di Ferite pari al suo Grado di Mischia + Cavalcare. Per eseguire questa Manovra è necessario spendere 1 Punto Eroe e può essere eseguita solo una volta per Round."
    },
    {
        "name": "Kulachniy Boi",
        "nation": "Ussura",
        "source": "Nazioni di Théah Vol. 2 (pag. 147)",
        "weapons": "Rukavitsa (speciali guanti e vambraci in acciaio celati sotto le maniche)",
        "maneuver": "Ferro e Velluto",
        "cost": "Passivo + 1 Incremento gratuito per nasconderli",
        "lore": "La tecnica di lotta coi pugni più diffusa di Ussura; nei duelli contro avversari armati impiega speciali guanti e vambraci in acciaio (rukavitsa) celati sotto le maniche.",
        "description": "Quando indossa dei rukavitsa sotto le maniche, il personaggio può usare il proprio Grado di Rissa, invece di quello di Mischia, ai fini delle Manovre. Inoltre ottiene 1 Incremento gratuito per nascondere i propri rukavitsa mentre li indossa."
    },
    {
        "name": "Le Strade",
        "nation": "Vodacce",
        "source": "Nazioni di Théah Vol. 2 (pag. 194)",
        "weapons": "Spada da scherma in una mano, nulla nell’altra, in un ambiente con numerosi ostacoli (città o nave)",
        "maneuver": "La Furia delle Strade",
        "cost": "1 Incremento (Max 1/Round)",
        "lore": "Nato nei vicoli tortuosi e tra le torri delle città di Vodacce, usa una spada agile nella mano dominante lasciando l'altra libera per scalare muri, dondolare da ponti e sfruttare l'ambiente.",
        "description": "Quando il personaggio impugna una spada da scherma in una mano, nulla nell’altra e si trova in un ambiente dove ci sono numerosi ostacoli da scalare, saltare o da cui lanciarsi (come una città o una nave) può eseguire una Manovra Speciale chiamata Furia delle Strade, che previene un numero di Ferite pari al suo Grado di Atletica e crea una Conseguenza ambientale per l’avversario. La Conseguenza richiede 1 Incremento per essere evitata e infligge un numero di Ferite pari al Grado di Grazia del Duellante alla fine del Round. Questa Manovra può essere eseguita solo una volta per Round."
    }
],
  "sorceries": [
  {
    "name": "Hexenwerk",
    "aliases": [
      "Hexenwerk"
    ],
    "nation": "Eisen",
    "source": "Manuale Base pp. 206-209 & Nazioni di Théah Vol. 2 pp. 51-53",
    "description": "L’arte alchemica di Eisen per combattere i non-morti. Ogni Grado di Stregoneria insegna 1 Unguento Maggiore e 2 Unguenti Minori. Preparazione (1 ora + laboratorio/cucina + 1 PE): distilla 1 Unguento Maggiore + 2 Unguenti Minori per Grado di Stregoneria (raddoppiati e non deperibili se si usano parti del corpo di un hexe). Attivazione: 1 Incremento in Sequenza d'Azione. A fine Episodio restano solo 1 Maggiore e 1 Minore.",
    "rulesSummary": "1 PE per distillare (1 Maggiore + 2 Minori × Grado). 1 Incremento per usare. Max conservati a fine Episodio: 1 Maggiore + 1 Minore.",
    "powers": [
      {
        "name": "Camminata Spettrale",
        "type": "Unguento Maggiore",
        "source": "Base",
        "duration": "Fino a fine Scena",
        "doses": 1,
        "recipe": "Un cuore umano tritato, ridotto in poltiglia e mescolato con erbe e blandi sedativi.",
        "desc": "Chi consuma l’unguento cade svenuto e spinge la propria anima fuori dal corpo. Finché è sotto forma di spirito non può essere visto né toccato da chi non ha mezzi sovrannaturali (es. Occhio Spettrale), può volare e attraversare muri ed è soggetto agli effetti contro i non-morti. 1 singola Ferita Drammatica lo rimanda subito nel corpo, dove subisce una 2ª Ferita Drammatica per lo shock. Può tornare nel corpo in qualsiasi momento, ma se non lo fa entro la prossima alba o tramonto muore."
      },
      {
        "name": "Lingua di Cadavere",
        "type": "Unguento Maggiore",
        "source": "Base",
        "duration": "Fino a fine Scena",
        "doses": 1,
        "recipe": "La lingua di un cadavere, marinata nella belladonna e finemente macinata.",
        "desc": "Strofinato sulla lingua dell'hexe, gli permette di parlare con i morti. Può porre a un cadavere 2 domande per ogni Grado di Risolutezza; il cadavere risponde sinceramente al meglio delle conoscenze che aveva in vita. Al termine della conversazione l'hexe vomita violentemente e il cadavere si riduce in polvere."
      },
      {
        "name": "Occhio Spettrale",
        "type": "Unguento Maggiore",
        "source": "Base",
        "duration": "Fino a fine Scena",
        "doses": 1,
        "recipe": "Gli occhi di qualcuno morto recentemente, pestati con acqua benedetta e radici di mandragora fino a formare una pasta densa.",
        "desc": "Applicato sulle palpebre, permette per una Scena di vedere spiriti, fantasmi e altri Mostri che sono normalmente invisibili."
      },
      {
        "name": "Pane del Padrone",
        "type": "Unguento Maggiore",
        "source": "Base",
        "duration": "Fino a fine Scena",
        "doses": 1,
        "recipe": "Cervello morto mescolato con erbe, funghi e sostanze allucinogene essiccate.",
        "desc": "Chi lo mangia può dare 1 singolo ordine a una Squadra di Mostri non-morti (che non può attaccarsi da sola, ma può attaccare altri non-morti), oppure ottiene +1 Incremento bonus in tutti i Rischi per influenzare, persuadere o intimidire un Malvagio non-morto."
      },
      {
        "name": "Porridge da Funerale",
        "type": "Unguento Maggiore",
        "source": "Base",
        "duration": "Speciale (Corruzione)",
        "doses": 1,
        "corruption": true,
        "recipe": "Fegato e reni di un cadavere mescolati con potenti sedativi e veleni.",
        "desc": "Provoca immediatamente 1 Ferita Drammatica a chi lo consuma. Se muore entro 1 giorno, risorge entro 3 giorni come Mostro non-morto agli ordini dell’hexe che ha cucinato il composto. Produrre il Porridge causa sempre Corruzione, così come farlo mangiare (chi fa entrambe le cose subisce 2 volte Corruzione)."
      },
      {
        "name": "Prigione Spettrale",
        "type": "Unguento Maggiore",
        "source": "Base",
        "duration": "Finché la linea è intatta",
        "doses": 1,
        "recipe": "Muschio cresciuto su una lapide o mausoleo, bollito in acqua salata e mescolato con polvere d’ossa.",
        "desc": "Usato per tracciare sul pavimento un circolo o pentacolo: i Mostri non-morti non possono attraversare la linea né interagire fisicamente o usare poteri sovrannaturali attraverso di essa (inclusi attacchi fisici o a distanza), finché la linea rimane intatta."
      },
      {
        "name": "Sangue del Morto",
        "type": "Unguento Maggiore",
        "source": "Base",
        "duration": "Fino a fine Scena",
        "doses": 1,
        "recipe": "Sangue prelevato da un cadavere fresco e mescolato con erbe, radici e veleni.",
        "desc": "Deve essere inserito in grande quantità nel corpo di una creatura non-morta (tramite iniezione o ingestione, non semplicemente spalmato su una lama). Se applicato con successo, rende il Mostro non-morto Inerme per il resto della Scena."
      },
      {
        "name": "Olio di Anosmia",
        "type": "Unguento Maggiore (Apostati)",
        "source": "Vol.2",
        "duration": "Fino a fine Scena",
        "doses": 1,
        "recipe": "Una palla di pelo e dell’urina di Mostro, mescolati con erbe bollite, oli essenziali e acido.",
        "desc": "Strofinato sul corpo, impedisce che i Mostri possano fiutare la persona fino alla fine della Scena. Ai Mostri che tentano di seguire le tracce di chi è coperto d'Olio serve +1 Incremento aggiuntivo."
      },
      {
        "name": "Mobilità Ferina",
        "type": "Unguento Maggiore (Apostati)",
        "source": "Vol.2",
        "duration": "Fino a fine Scena",
        "doses": 1,
        "recipe": "Un dente di Mostro, una rana essiccata e una piuma di corvo ridotti in polvere e mescolati con latte di capra.",
        "desc": "Chi beve la mistura acquisisce la capacità di correre e saltare come una bestia feroce, potendo compiere fino a fine Scena gesti atletici normalmente impossibili per un umano (es. saltare un baratro di 6 metri), nei limiti delle capacità fisiche del Mostro da cui proviene il dente."
      },
      {
        "name": "Polvere di Amnesia",
        "type": "Unguento Maggiore (Apostati)",
        "source": "Vol.2",
        "duration": "Istantanea",
        "doses": 1,
        "recipe": "Un corno di demone, funghi e polvere d’osso ridotti in polvere sottile, cotti a secco e mescolati in una grande quantità di tè.",
        "desc": "Cancella dalla mente di chi lo consuma il ricordo di ciò che è accaduto nell’ultimo giorno."
      },
      {
        "name": "Vista Selvaggia",
        "type": "Unguento Maggiore (Apostati)",
        "source": "Vol.2",
        "duration": "Fino a fine Scena",
        "doses": 1,
        "recipe": "Un ramo appuntito di legno nero, annerito sul fuoco e coperto di una mistura di bacche, fango e un pezzo del Mostro bersaglio.",
        "desc": "Graffiando una persona con il bastone (causandole 1 Ferita Drammatica), questa cade in trance per una Scena e vede attraverso gli occhi del Mostro da cui è stato preso il campione. Spendendo 1 PE può fare un Rischio di Notare per ottenere ulteriori dettagli. Il legame si spezza se il Mostro dorme o se uno dei due subisce una Ferita."
      },
      {
        "name": "Brodo Nero",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Fino a fine Scena",
        "doses": 2,
        "corruption": true,
        "recipe": "Pane ammuffito, sangue di Mostro e acqua fetida di palude.",
        "desc": "Conferisce a chi lo beve 1 Qualità Mostruosa (scelta al momento della preparazione) fino alla fine della Scena. Berlo o farlo bere a qualcun altro è sempre un atto di Corruzione."
      },
      {
        "name": "Cipiglio d’Inverno",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Fino a fine Round (1 uso)",
        "doses": 2,
        "recipe": "Acqua benedetta, uno stelo spinoso di rosa e qualche goccia di sangue di hexe congelati in una lama di ghiaccio.",
        "desc": "Usata come un coltello: se infligge almeno 1 Ferita a un non-morto, questo è stordito per il resto del Round e non può intraprendere azioni (un Malvagio può comunque spendere Incrementi per difendersi). Dopo un singolo uso il ghiaccio si frantuma."
      },
      {
        "name": "Flagello Rovinoso",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Fino a fine Round",
        "doses": 2,
        "recipe": "Una fiasca di erbe, veleni e una goccia di vino della comunione.",
        "desc": "Lanciata contro un Mostro non-morto: se il colpo infligge almeno 1 Ferita, il GM non può spendere Punti Pericolo per attivare le Qualità Mostruose di quel Mostro fino alla fine del Round."
      },
      {
        "name": "Furia Paterna",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Permanente",
        "doses": 2,
        "recipe": "Un paletto di legno di agrifoglio trattato con erbe e veleni naturali e benedetto da un sacerdote.",
        "desc": "Usando 1 Azione per colpire una creatura non-morta Inerme, la vittima viene distrutta completamente e non può più essere resuscitata in alcun modo."
      },
      {
        "name": "Lacrime dei Profeti",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Permanente",
        "doses": 2,
        "recipe": "Olio santo mescolato con spezie rare.",
        "desc": "Applicato su un cadavere non ancora toccato dall'Hexenwerk, impedisce che quel corpo possa mai più essere riportato in vita come non-morto."
      },
      {
        "name": "Pietà Materna",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Istantanea",
        "doses": 2,
        "recipe": "Una zuppa di vegetali selvatici cucinata con acqua benedetta.",
        "desc": "Rimuove immediatamente tutte le maledizioni, malattie o effetti debilitanti causati da creature non-morte (chi ha mangiato il Porridge da Funerale muore all’istante, ma non risorge come Mostro)."
      },
      {
        "name": "Risata di Primavera",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Fino a fine Scena",
        "doses": 2,
        "recipe": "Sciroppo dolce a base di fiori freschi di primavera, resina d’albero e acqua piovana.",
        "desc": "Chi lo beve diventa completamente immune alla Paura causata dai Mostri non-morti per l'intera Scena."
      },
      {
        "name": "Sete Rossa",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Fino a fine Round",
        "doses": 2,
        "recipe": "Carne marcia e bacche bollite con erbe e radici dall'odore pungente.",
        "desc": "Spendendo 1 Incremento per spalmarlo su di sé o su un bersaglio, tutti i Mostri non-morti presenti devono dirigere su quel personaggio tutti i loro Attacchi fino a fine Round."
      },
      {
        "name": "Sorriso d’Estate",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "A fine Scena",
        "doses": 2,
        "recipe": "Poltiglia distillata dall’acqua di un rapido torrente e mescolata con erbe dolciastre.",
        "desc": "Applicato sulle ferite, guarisce 1 Ferita Drammatica causata da un Mostro non-morto alla fine della Scena."
      },
      {
        "name": "Sospiro d’Autunno",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "1 Notte intera",
        "doses": 2,
        "recipe": "Semi di zucca marcia, vino rosso da tavola e una lacrima.",
        "desc": "Chi lo beve dorme un sonno placido e ristoratore per una notte intera, immune a incubi naturali o sovrannaturali."
      },
      {
        "name": "Veleno del Mietitore",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Fino a fine Round",
        "doses": 2,
        "recipe": "Veleni naturali e finissima polvere d’argento sigillati in una fiasca di vetro.",
        "desc": "Lanciato contro un Mostro non-morto: se infligge almeno 1 Ferita, causa 1 ulteriore Ferita non negabile ogni volta che la creatura compie un'azione fino alla fine del Round."
      },
      {
        "name": "Veleno del Redivivo",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "1 Round dopo aver sfoderato",
        "doses": 2,
        "recipe": "Tossina di ragni o serpenti applicata a un’arma da taglio o perforante (non in dracheneisen) e lasciata nel fodero.",
        "desc": "Per 1 Round dopo che l'arma viene sfoderata per la prima volta nella Scena, essa infligge il doppio delle Ferite contro i Mostri non-morti."
      },
      {
        "name": "Velo della Vedova",
        "type": "Unguento Minore",
        "source": "Base",
        "duration": "Finché non viene attivato",
        "doses": 2,
        "recipe": "Un crisantemo appassito preso da una tomba, bagnato con acqua santa e benedetto da un prete.",
        "desc": "Appuntato sui vestiti rende immuni al primo attacco o effetto sovrannaturale generato da un Mostro non-morto, dopodiché il fiore si riduce in polvere."
      }
    ]
  },
  {
    "name": "Glamour",
    "aliases": [
      "Glamour",
      "I Cavalieri di Avalon",
      "Cavaliere di Avalon",
      "Incanto"
    ],
    "nation": "Avalon",
    "source": "Manuale Base pp. 210-216 & Nazioni di Théah Vol. 1 pp. 48-53",
    "description": "La magia leggendaria dei Cavalieri di Re Elilodd e del Graal. Scegli 1 dei 20 Cavalieri di Elilodd (con 1 Tratto Maggiore, 1 Tratto Minore e i suoi Adesivi di Virtù/Hubris). Ogni Grado di Stregoneria conferisce 1 Incanto Maggiore e 2 Incanti Minori (a Grado 1) oppure aumenta il Grado (1-5) di Incanti già noti; gli Incanti di Fortuna sono accessibili a tutti. Attivazione: 1 PE (Minori: 1/Scena, Maggiori: 1/Episodio). Include i 7 Obblighi del Gesa, il Debito del Graal (Vol. 1 p. 48) e l'Incarnazione (Vol. 1 pp. 48-51).",
    "rulesSummary": "1 PE per Incanto (Minori 1/Scena, Maggiori 1/Episodio). Debito del Graal: tira 1d10 prima di lanciare; se ≤ Debito, azzera il Debito e subisci 1 Maledizione Sidhe.",
    "gesaOaths": [
      "1. Mai leverai la tua lama contro un compatriota.",
      "2. Mai abbandonerai il campo prima della fine dello scontro.",
      "3. Mai mancherai alla tua parola o aiuterai qualcuno a mancare alla sua.",
      "4. Mai starai in ozio quando c’è da compiere un’opera.",
      "5. Mai lascerai che la passione ti domini.",
      "6. Mai ti approprierai di ciò che appartiene a un altro per tuo guadagno.",
      "7. Sempre servirai il Graal."
    ],
    "sidheCurses": [
      {
        "name": "Acqua Corrente",
        "desc": "Non può attraversare l’acqua corrente senza l’aiuto dei suoi compagni."
      },
      {
        "name": "Toccato dalle Fate",
        "desc": "Si distrae facilmente: non può mai tenere d'occhio qualcosa di importante o fare la guardia da solo."
      },
      {
        "name": "Vulnerabile al Ferro",
        "desc": "Qualsiasi Ferita subita da armi in ferro o acciaio aumenta di +1."
      },
      {
        "name": "Comportamento Inquietante",
        "desc": "Gli animali domestici ringhiano o fuggono, il latte inacidische e le fiamme tremolano al suo passaggio."
      },
      {
        "name": "Diurno / Notturno",
        "desc": "Perde 1 dado in tutti i Rischi compiuti durante il giorno (se Notturno) o durante la notte (se Diurno)."
      },
      {
        "name": "Sensibile agli Amuleti",
        "desc": "Non può entrare in luoghi protetti da ferri di cavallo, sorbo rosso o campanelle delle fate senza spendere 1 PE."
      }
    ],
    "knights": [
      {
        "name": "Æsc delle Foreste",
        "major": "Risolutezza",
        "minor": "Panache",
        "virtue": "Scaltro",
        "hubris": "Confuso",
        "legendaryName": "Trasformazione",
        "legendaryDesc": "Si trasforma in un grande cervo bianco o in un lupo delle foreste per l'intera Scena."
      },
      {
        "name": "Beorhtsige lo Spezza-assedi",
        "major": "Panache",
        "minor": "Vigore",
        "virtue": "Fortunato",
        "hubris": "Implacabile",
        "legendaryName": "Inamovibile",
        "legendaryDesc": "Finché resta fermo coi piedi piantati a terra, nessuna forza mortale o mostruosa può spostarlo o atterrarlo."
      },
      {
        "name": "Cerhelm l’Acuto",
        "major": "Grazia",
        "minor": "Acume",
        "virtue": "Astuto",
        "hubris": "Fanatico",
        "legendaryName": "Divenire la Lama",
        "legendaryDesc": "Ogni suo attacco in mischia ignora qualsiasi armatura, copertura o riduzione del danno per il resto della Scena."
      },
      {
        "name": "Ceolmund il Protettore",
        "major": "Risolutezza",
        "minor": "Grazia",
        "virtue": "Appassionato",
        "hubris": "Testardo",
        "legendaryName": "Voi Non Morirete Qui",
        "legendaryDesc": "Prende su di sé tutte le Ferite e Ferite Drammatiche inflitte agli alleati nella Scena per un intero Round."
      },
      {
        "name": "Dudda il Rotondo",
        "major": "Vigore",
        "minor": "Risolutezza",
        "virtue": "Glorioso",
        "hubris": "Insicuro",
        "legendaryName": "Banchetto Perpetuo",
        "legendaryDesc": "Evoca un banchetto fatato che guarisce 1 Ferita Drammatica a tutti i commensali che mangiano e bevono in pace."
      },
      {
        "name": "Dunstan lo Straniero",
        "major": "Vigore",
        "minor": "Acume",
        "virtue": "Amichevole",
        "hubris": "Manipolatore",
        "legendaryName": "Fæ Confusion",
        "legendaryDesc": "Confonde i sensi di una Squadra di Sgherri o di un Malvagio facendogli attaccare i propri alleati per 1 Round."
      },
      {
        "name": "Eadburg il Ricco",
        "major": "Panache",
        "minor": "Acume",
        "virtue": "Altruista",
        "hubris": "Invidioso",
        "legendaryName": "Benedizione del Penitente",
        "legendaryDesc": "Donando tutto il proprio oro o un oggetto prezioso a un bisognoso, tutti gli alleati ottengono +2 Incrementi nel prossimo Rischio."
      },
      {
        "name": "Ealdræd il Vecchio",
        "major": "Acume",
        "minor": "Grazia",
        "virtue": "Intuitivo",
        "hubris": "Sfortunato",
        "legendaryName": "Antico Sapere Sidhe",
        "legendaryDesc": "Pone al GM una domanda su qualsiasi segreto antico, rovina o creatura fatata e riceve la risposta completa e veritiera."
      },
      {
        "name": "Frideswide il Pacifico",
        "major": "Acume",
        "minor": "Risolutezza",
        "virtue": "Confortante",
        "hubris": "Leale",
        "legendaryName": "Scossa che Disarma",
        "legendaryDesc": "Un'onda di luce dorata fa cadere di mano le armi a tutti i presenti nella Scena che non spendono 2 Incrementi."
      },
      {
        "name": "Godric il Pio",
        "major": "Panache",
        "minor": "Risolutezza",
        "virtue": "Coraggioso",
        "hubris": "Superstizioso",
        "legendaryName": "Respingere il Blasfemo",
        "legendaryDesc": "I Mostri e gli utilizzatori di stregonerie corrotte non possono avvicinarsi a Godric né attaccarlo in mischia per 1 Scena."
      },
      {
        "name": "Hereward il Consigliere",
        "major": "Acume",
        "minor": "Panache",
        "virtue": "Esemplare",
        "hubris": "Divisi dal Destino",
        "legendaryName": "Saggio Consiglio",
        "legendaryDesc": "Dona immediatamente a un alleato un numero di Incrementi bonus pari al proprio Grado di Acume."
      },
      {
        "name": "Hildræd la Comandante",
        "major": "Grazia",
        "minor": "Vigore",
        "virtue": "Maestoso",
        "hubris": "Curioso",
        "legendaryName": "Raduno di Eroi",
        "legendaryDesc": "Tutti gli Eroi alleati che ubbidiscono al piano di Hildræd sommano +1 a tutti i dadi tirati fino a fine Round."
      },
      {
        "name": "Leofric il Beneamato",
        "major": "Risolutezza",
        "minor": "Acume",
        "virtue": "Mite",
        "hubris": "Arrogante",
        "legendaryName": "Illuminare",
        "legendaryDesc": "Sprigiona un bagliore solare che rivela ogni illusione, creatura invisibile o inganno nella Scena."
      },
      {
        "name": "Mildgyd il Gentile",
        "major": "Vigore",
        "minor": "Panache",
        "virtue": "Umile",
        "hubris": "Indeciso",
        "legendaryName": "Forza dei Giganti",
        "legendaryDesc": "Solleva e scaglia oggetti colossali (carrozze, cannoni, alberi) infliggendo Ferite pari al doppio del Vigore."
      },
      {
        "name": "Osgar il Lanciere",
        "major": "Grazia",
        "minor": "Risolutezza",
        "virtue": "Vittorioso",
        "hubris": "Rancoroso",
        "legendaryName": "Me Ne Occupo Io",
        "legendaryDesc": "Sfida un singolo Malvagio: finché combattono in 1 contro 1, nessun altro può interferire e Osgar ottiene +2 Incrementi."
      },
      {
        "name": "Pæga il Dimenticato",
        "major": "Grazia",
        "minor": "Panache",
        "virtue": "Discreto",
        "hubris": "Ambizioso",
        "legendaryName": "Oscurità",
        "legendaryDesc": "Cancella la propria presenza dalla memoria e dalla vista dei presenti fino a fine Scena finché non attacca."
      },
      {
        "name": "Sæwine la Marinaia",
        "major": "Panache",
        "minor": "Grazia",
        "virtue": "Perspicace",
        "hubris": "Testa Calda",
        "legendaryName": "Richiamo del Mare",
        "legendaryDesc": "Comanda le correnti e i venti attorno alla propria nave, raddoppiandone la velocità e rendendola immune agli scogli per 1 Scena."
      },
      {
        "name": "Sunngifu la Generosa",
        "major": "Acume",
        "minor": "Vigore",
        "virtue": "Illuminato",
        "hubris": "Fiducioso",
        "legendaryName": "Carpe Diem",
        "legendaryDesc": "Permette a un alleato di agire immediatamente come se avesse il numero di Incrementi più alto del Round."
      },
      {
        "name": "Wilfrith la Volitiva",
        "major": "Risolutezza",
        "minor": "Vigore",
        "virtue": "Determinato",
        "hubris": "Orgoglioso",
        "legendaryName": "Guarigione Miracolosa",
        "legendaryDesc": "Con il tocco delle mani guarisce istantaneamente tutte le Ferite ordinarie e 2 Ferite Drammatiche di un alleato."
      },
      {
        "name": "Wulfnoð l’Ardito",
        "major": "Vigore",
        "minor": "Grazia",
        "virtue": "Adattabile",
        "hubris": "Avventato",
        "legendaryName": "Non Sono Ancora Finito",
        "legendaryDesc": "Anche se raggiunge la 4ª Ferita Drammatica, non diventa Inerme e continua a combattere con +2 Incrementi fino a fine Scena."
      }
    ],
    "powers": [
      {
        "name": "Piccola Fortuna",
        "trait": "Fortuna",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Dopo aver tirato i dadi per un Rischio, puoi ritirare un numero di dadi pari al tuo Grado in questo Incanto (1–5)."
      },
      {
        "name": "Grande Fortuna",
        "trait": "Fortuna",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Dopo aver tirato i dadi per un Rischio, scegli 1 singolo dado e aggiungi al suo risultato il tuo Grado in questo Incanto (1–5)."
      },
      {
        "name": "Eroico",
        "trait": "Fortuna",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Scegli 1 Abilità; per questo Rischio puoi ritirare fino a un numero di dadi pari al tuo Grado in questo Incanto (1–5) quando usi quell'Abilità."
      },
      {
        "name": "Mitico",
        "trait": "Fortuna",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Per il resto della Scena, in un singolo Tratto associato al tuo Cavaliere ottieni Incrementi extra pari al tuo Grado in questo Incanto (1–5)."
      },
      {
        "name": "Fortuna Folle",
        "trait": "Fortuna",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Prima di tirare per un Rischio, metti da parte un numero di dadi pari al tuo Grado in questo Incanto (1–5) e disponili sul 10 (contano come 10 tirati)."
      },
      {
        "name": "Leggenda",
        "trait": "Fortuna",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Dona a un alleato un numero di dadi bonus al suo prossimo Rischio pari al doppio del tuo Grado in questo Incanto (2–10 dadi)."
      },
      {
        "name": "Battere gli Sgherri",
        "trait": "Vigore",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Sconfiggi istantaneamente una Squadra di Sgherri di Forza pari o inferiore al doppio del tuo Grado in questo Incanto (2–10)."
      },
      {
        "name": "Più Forte di Te",
        "trait": "Vigore",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Quando spendi 1 Incremento per infliggere Ferite, aggiungi Ferite extra pari al tuo Grado in questo Incanto (1–5)."
      },
      {
        "name": "Battere il Malvagio",
        "trait": "Vigore",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Infliggi immediatamente a un Malvagio un numero di Ferite pari al triplo del tuo Grado in questo Incanto (3–15 Ferite)."
      },
      {
        "name": "Il Più Forte Che C’è",
        "trait": "Vigore",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Per un singolo Rischio di Vigore compi un'impresa di forza sovrumana e aggiungi Incrementi bonus pari al doppio del tuo Grado in questo Incanto (2–10)."
      },
      {
        "name": "Lampo",
        "trait": "Grazia",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Con un attacco a distanza colpisci un bersaglio ovunque si trovi (purché visibile o noto), aggiungendo Ferite pari al tuo Grado in questo Incanto (1–5)."
      },
      {
        "name": "Svanire",
        "trait": "Grazia",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Diventi invisibile per un numero di Azioni o momenti pari al tuo Grado in questo Incanto (1–5); svanisce se attacchi."
      },
      {
        "name": "Primo",
        "trait": "Grazia",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Agisci per primo nel Round e ottieni Incrementi bonus pari al tuo Grado in questo Incanto (1–5) che puoi spendere immediatamente."
      },
      {
        "name": "Colpo Sicuro",
        "trait": "Grazia",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Il tuo prossimo attacco non può essere evitato, parato o ridotto dal bersaglio e infligge Ferite extra pari al doppio del tuo Grado in questo Incanto (2–10)."
      },
      {
        "name": "Percepire la Stregoneria",
        "trait": "Panache",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Percepisci qualsiasi uso di Stregoneria o presenza Sidhe/Mostruosa entro una distanza commisurata al tuo Grado (1–5) e ottieni altrettanti Incrementi per identificarla."
      },
      {
        "name": "Riparare la Nave",
        "trait": "Panache",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Ripari istantaneamente sulla tua nave un numero di Ferite Critiche pari al tuo Grado in questo Incanto (1–5)."
      },
      {
        "name": "Resistere alla Stregoneria",
        "trait": "Panache",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Annulli completamente gli effetti di una Stregoneria o potere di Mostro diretto contro di te o entro portata, fino a una potenza pari al tuo Grado (1–5)."
      },
      {
        "name": "Fondersi alla Nave",
        "trait": "Panache",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Per il resto della Scena la nave su cui ti trovi ottiene Incrementi bonus a tutti i Rischi navali pari al tuo Grado in questo Incanto (1–5)."
      },
      {
        "name": "Il Dolore È Temporaneo",
        "trait": "Risolutezza",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Riduci le Ferite che stai per subire da una singola fonte di un ammontare pari al doppio del tuo Grado in questo Incanto (2–10 Ferite)."
      },
      {
        "name": "Nessuna Paura",
        "trait": "Risolutezza",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Tu e un numero di alleati pari al tuo Grado in questo Incanto (1–5) diventate totalmente immuni alla Paura fino alla fine della Scena."
      },
      {
        "name": "Veglia Eterna",
        "trait": "Risolutezza",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Non puoi cadere Inerme né morire per un numero di Round pari al tuo Grado in questo Incanto (1–5), anche se subisci 4 o più Ferite Drammatiche."
      },
      {
        "name": "Rinato",
        "trait": "Risolutezza",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Guarisci istantaneamente un numero di Ferite Drammatiche (tue o di un alleato toccato) pari al tuo Grado in questo Incanto (1–5, max 3)."
      },
      {
        "name": "Afferrare Frecce",
        "trait": "Acume",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Afferri a mezz'aria frecce, coltelli o proiettili lanciati (non da fuoco), annullando fino a un numero di attacchi o Incrementi pari al tuo Grado (1–5)."
      },
      {
        "name": "Evocare Sidhe",
        "trait": "Acume",
        "type": "Incanto Minore",
        "doses": 1,
        "desc": "1 PE (1/Scena): Richiami uno spirito Sidhe minore che ti assiste concedendo Incrementi bonus pari al tuo Grado in questo Incanto (1–5) in un compito specifico."
      },
      {
        "name": "Afferrare Pallottole",
        "trait": "Acume",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Afferri al volo una palla di moschetto o pistola sparata contro di te o un alleato vicino, annullando la Ferita Drammatica bonus dell'arma da fuoco e riducendo i danni di 2 × Grado."
      },
      {
        "name": "Circolo Sidhe",
        "trait": "Acume",
        "type": "Incanto Maggiore",
        "doses": 1,
        "desc": "1 PE (1/Episodio): Apri un passaggio fatato attraverso un cerchio di funghi o pietre per viaggiare istantaneamente in un altro luogo di Avalon o delle Isole del Glamour con alleati pari al tuo Grado (1–5)."
      }
    ]
  },
  {
    "name": "Dar Matushki",
    "aliases": [
      "Dar Matushki",
      "Tocco della Madre"
    ],
    "nation": "Ussura",
    "source": "Manuale Base pp. 217-218 & Nazioni di Théah Vol. 2 pp. 143-144",
    "description": "Il Tocco della Madre (Nonna Ussura). Ogni Grado di Stregoneria conferisce 1 Lezione, composta da 2 Doni e 1 Restrizione (con relativo Limite e Penitenza). Attivare un Dono costa 1 Punto Eroe. Se l'Eroe viola il Limite della sua Restrizione, perde l'accesso ai 2 Doni di quella Lezione finché non compie la Penitenza.",
    "rulesSummary": "1 Lezione per Grado = 2 Doni + 1 Restrizione. Attivare un Dono costa 1 PE. Violare il Limite blocca i 2 Doni della Lezione fino alla Penitenza.",
    "restrictions": [
      {
        "name": "Efficacia",
        "limit": "Non puoi mai rifiutare una richiesta d'aiuto sincera da chi non può difendersi da solo.",
        "penance": "Costruire o riparare qualcosa di essenziale per una comunità povera lavorando a mani nude dall'alba al tramonto."
      },
      {
        "name": "Clemenza",
        "limit": "Non puoi mai uccidere o giustiziare un nemico che si è arreso o che è stato reso Inerme.",
        "penance": "Vegliare e curare gratuitamente un malato o un nemico ferito per un'intera notte e un intero giorno."
      },
      {
        "name": "Onestà",
        "limit": "Non puoi mai pronunciare una menzogna deliberata né giurare il falso.",
        "penance": "Confessare pubblicamente il proprio inganno davanti alle persone tradite e accettarne le conseguenze senza difendersi."
      },
      {
        "name": "Gentilezza",
        "limit": "Non puoi mai negare cibo, acqua o riparo al tuo fuoco a un viaggiatore o animale affamato.",
        "penance": "Digiunare per tre giorni donando tutto il proprio cibo agli animali selvatici o ai mendicanti."
      },
      {
        "name": "Moderazione",
        "limit": "Non puoi mai accumulare ricchezze superflue né tenere per te più di quanto puoi trasportare a piedi.",
        "penance": "Regalare tutti i propri averi non essenziali (azzerando i punti Ricchezza) ai bisognosi."
      }
    ],
    "animalForms": [
      {
        "name": "Orso",
        "gift": "Grande e feroce: +1 Incremento nei Rischi di Vigore e Intimidire; zampate e morsi letali."
      },
      {
        "name": "Cinghiale",
        "gift": "Testardo e corazzato: ignora la prima Ferita subita in ogni Round."
      },
      {
        "name": "Gatto",
        "gift": "Silenzioso e agile: cade sempre in piedi senza danni e vede al buio."
      },
      {
        "name": "Pesce",
        "gift": "Respira sott'acqua e nuota a velocità prodigiosa nei fiumi e nei mari gelidi."
      },
      {
        "name": "Volpe",
        "gift": "Astuta e sfuggente: +1 Incremento per Nascondersi o sfuggire alle trappole."
      },
      {
        "name": "Capra",
        "gift": "Equilibrio perfetto: scala pareti rocciose quasi verticali e ghiacciai senza scivolare."
      },
      {
        "name": "Cavallo",
        "gift": "Veloce e instancabile: corre a velocità estrema trasportando anche un alleato."
      },
      {
        "name": "Topo",
        "gift": "Minuscolo: si infila in fessure strettissime, serrature e condotti."
      },
      {
        "name": "Gufo",
        "gift": "Volo silenzioso notturno e vista acutissima nell'oscurità."
      },
      {
        "name": "Coniglio",
        "gift": "Udito finissimo e scatti fulminei per sottrarsi al pericolo."
      },
      {
        "name": "Corvo",
        "gift": "Vola in alto, imita la voce umana e osserva dall'alto senza destare sospetti."
      },
      {
        "name": "Renna",
        "gift": "Resistenza assoluta al gelo estremo e alle lunghe marce nella neve."
      },
      {
        "name": "Serpente",
        "gift": "Striscia silenzioso, percepisce il calore corporeo e possiede un morso velenoso."
      },
      {
        "name": "Tartaruga",
        "gift": "Guscio impenetrabile: può ritirarsi nel carapace prevenendo 3 Ferite."
      },
      {
        "name": "Lupo",
        "gift": "Predatore del branco: fiuto infallibile e +1 Incremento quando combatte fianco a fianco con un alleato."
      }
    ],
    "powers": [
      {
        "name": "Comando",
        "type": "Dono di Matushka",
        "doses": 1,
        "desc": "1 PE: Parli con gli animali naturali e puoi chiedere loro un favore o impartire un comando per la durata della Scena (non agiranno in modo suicida)."
      },
      {
        "name": "Illuminare",
        "type": "Dono di Matushka",
        "doses": 1,
        "desc": "1 PE: Un bagliore caldo o il sussurro degli spiriti rivela la via sicura, svela illusioni, passaggi nascosti o la natura sincera delle intenzioni altrui."
      },
      {
        "name": "Purificare",
        "type": "Dono di Matushka",
        "doses": 1,
        "desc": "1 PE: Con il tocco purifichi immediatamente acqua, cibo o il sangue di una creatura da qualsiasi veleno naturale, tossina o malattia."
      },
      {
        "name": "Ricucire",
        "type": "Dono di Matushka",
        "doses": 1,
        "desc": "1 PE: Ripari istantaneamente un oggetto spezzato in legno, stoffa, cuoio, pietra o metallo comune (incluse armi, scudi o parti di una nave)."
      },
      {
        "name": "Rigenerazione",
        "type": "Dono di Matushka",
        "doses": 1,
        "desc": "1 PE: Toccando una creatura vivente (o te stesso), guarisci immediatamente 1 Ferita Drammatica e tutte le Ferite ordinarie."
      },
      {
        "name": "Tempesta",
        "type": "Dono di Matushka",
        "doses": 1,
        "desc": "1 PE: Invochi la furia dell'inverno ussurano (vento gelido, neve, nebbia fitta o pioggia torrenziale) nella Scena, creando Opportunità per gli alleati o Conseguenze per i nemici."
      },
      {
        "name": "Trasformazione",
        "type": "Dono di Matushka",
        "doses": 1,
        "desc": "1 PE: Ti trasformi fino alla fine della Scena in una delle 15 Forme Animali di Nonna Ussura (Orso, Lupo, Corvo, Gufo, Volpe, Pesce, ecc.), conservando la tua mente e ottenendo le doti naturali dell'animale."
      },
      {
        "name": "Vista",
        "type": "Dono di Matushka",
        "doses": 1,
        "desc": "1 PE: Guardando nell'acqua limpida, nel fuoco o nel ghiaccio, osservi a distanza un luogo o una persona che conosci in Ussura o nelle vicinanze."
      }
    ]
  },
  {
    "name": "Porté",
    "aliases": [
      "Porté",
      "Porte"
    ],
    "nation": "Montaigne",
    "source": "Manuale Base pp. 219-221 & Nazioni di Théah Vol. 1 pp. 145-148",
    "description": "La stregoneria del sangue di Montaigne che squarcia il tessuto del mondo per viaggiare attraverso il Passaggio. Ogni Grado di Stregoneria permette di mantenere 1 Marchio Maggiore e 2 Marchi Minori (più i parenti viventi di 1° grado come Marchi Maggiori gratuiti). Attenzione: non guardare mai né ascoltare i Sussurri nel Passaggio!",
    "rulesSummary": "1 Marchio Maggiore + 2 Minori per Grado. Trarre o Camminare infligge 1 Ferita Drammatica (+1 Incr. in Azione). Blessure costa 0 FD ma infligge sempre Corruzione.",
    "powers": [
      {
        "name": "Apporre un Marchio",
        "type": "Azione Base Porté",
        "source": "Base",
        "doses": 1,
        "desc": "Costo: 1 PE. Bagnando un oggetto col proprio sangue, lo rendi un Marchio Minore (trasportabile a una mano; solo su oggetti non viventi) o un Marchio Maggiore (qualsiasi oggetto non vivente, luogo o struttura). Se superi il limite di Marchi, scegli quale vecchio Marchio dissolvere."
      },
      {
        "name": "Percepire un Marchio",
        "type": "Azione Base Porté",
        "source": "Base",
        "doses": 1,
        "desc": "Costo: 1 Incremento in Azione (automatico entro 30 metri). Percepisci la direzione esatta e la distanza approssimativa di tutti i tuoi Marchi attivi."
      },
      {
        "name": "Trarre (Verso un Marchio Minore)",
        "type": "Azione Base Porté",
        "source": "Base",
        "doses": 1,
        "desc": "Costo: 1 Ferita Drammatica (+1 Incremento in Sequenza d'Azione). Apri una piccola lacerazione e tiri a te attraverso il Passaggio uno dei tuoi Marchi Minori finché ti arriva direttamente in mano."
      },
      {
        "name": "Camminare (Verso un Marchio Maggiore)",
        "type": "Azione Base Porté",
        "source": "Base",
        "doses": 1,
        "desc": "Costo: 1 Ferita Drammatica (+1 Incremento in Sequenza d'Azione). Squarci un portale sanguigno ed esci istantaneamente accanto a uno dei tuoi Marchi Maggiori (o parente vivente di 1° grado). Puoi portare con te altri personaggi volontari pagando 1 PE oppure subendo 1 Ferita ordinaria aggiuntiva per ciascun passeggero."
      },
      {
        "name": "Blessure (Ferita Sanguigna)",
        "type": "Segreto Proibito",
        "source": "Base",
        "corruption": true,
        "doses": 1,
        "desc": "Costo: 0 Ferite Drammatiche, ma infligge SEMPRE 1 Punto di Corruzione. Usi il sangue di un'altra persona (ferendola sul posto) per alimentare Trarre o Camminare senza subire la Ferita Drammatica."
      },
      {
        "name": "Ancore Emotive",
        "type": "Potere Alternativo (Vol.1)",
        "source": "Vol.1",
        "doses": 1,
        "desc": "Sostituisce i legami di sangue familiari: puoi considerare come Marchi Maggiori gratuiti le persone a cui sei legato da un sentimento profondo di Amore o Odio reciproco."
      },
      {
        "name": "Riserva di Sangue Estesa",
        "type": "Potere Alternativo (Vol.1)",
        "source": "Vol.1",
        "doses": 1,
        "desc": "La tua padronanza del sangue aumenta la tua capacità: puoi mantenere 1 Marchio Maggiore e 2 Marchi Minori aggiuntivi (come se avessi +1 Grado di Stregoneria per il limite dei Marchi)."
      },
      {
        "name": "Occhio del Passaggio (Spiare)",
        "type": "Potere Alternativo (Vol.1)",
        "source": "Vol.1",
        "doses": 1,
        "desc": "Spendendo 1 PE, apri uno spiraglio minuscolo presso uno dei tuoi Marchi Maggiori per vedere e ascoltare ciò che accade attorno ad esso senza attraversare il Passaggio."
      },
      {
        "name": "Marchio Superiore",
        "type": "Potere Alternativo (Vol.1)",
        "source": "Vol.1",
        "doses": 1,
        "desc": "Puoi designare uno dei tuoi Marchi Minori come Marchio Superiore: Trarre questo specifico oggetto non ti infligge 1 Ferita Drammatica, ma costa solo 1 Punto Eroe."
      },
      {
        "name": "Passo a Vista",
        "type": "Potere Alternativo (Vol.1)",
        "source": "Vol.1",
        "doses": 1,
        "desc": "Subendo 1 Ferita Drammatica (+1 Incremento in Azione), puoi Camminare verso qualsiasi punto che puoi vedere chiaramente a occhio nudo nella Scena, anche se lì non c'è alcun Marchio."
      }
    ]
  },
  {
    "name": "Sanderis",
    "aliases": [
      "Sanderis"
    ],
    "nation": "Confederazione Sarmatiana",
    "source": "Manuale Base pp. 222-227 & Nazioni di Théah Vol. 2 pp. 96-100",
    "description": "Il Patto del losejas sarmatiano con un antico dievas. Ogni Grado di Stregoneria permette di scegliere 2 Favori Minori dal Patto del proprio dievas (Oscurità, Fuoco, Freddo, Tempesta, Mare, Conoscenza, Amore). Invocare un Favore Minore acquisito costa 1 PE (+1 Incremento in Azione). Invocare un Favore Minore non acquisito del proprio Patto costa 1 PE ma obbliga a saldare un debito del dievas. Invocare un Favore Maggiore richiede un Prezzo grave e infligge SEMPRE 1 Punto di Corruzione. A 6 Favori si apre la scelta del Settimo Patto: La Mietitura (Vol. 2 pp. 97-98).",
    "rulesSummary": "2 Favori Minori per Grado. Favore Minore: 1 PE (+1 Incr. in Azione). Favore Maggiore: Prezzo + 1 Punto Corruzione obbligatorio.",
    "dievaiPacts": [
      "Oscurità",
      "Fuoco",
      "Freddo",
      "Tempesta",
      "Mare",
      "Conoscenza",
      "Amore"
    ],
    "powers": [
      {
        "name": "Manto di Tenebra",
        "pact": "Oscurità",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Oscurità] 1 PE: Avvolge un'area o una stanza in un'oscurità soprannaturale impenetrabile alla luce normale per il resto della Scena."
      },
      {
        "name": "Passo nell'Ombra",
        "pact": "Oscurità",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Oscurità] 1 PE: Il losejas entra in un'ombra abbastanza grande da contenerlo ed emerge istantaneamente da un'altra ombra visibile nella Scena."
      },
      {
        "name": "Occhi della Notte",
        "pact": "Oscurità",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Oscurità] 1 PE: Permette di vedere perfettamente nel buio più totale (naturale o magico) fino a fine Scena e dona +1 Incremento a Notare."
      },
      {
        "name": "Sussurri nel Buio",
        "pact": "Oscurità",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Oscurità] 1 PE: Le ombre portano la voce del losejas alle orecchie di chiunque si trovi nell'oscurità, o riferiscono ciò che è stato detto al buio."
      },
      {
        "name": "Lama d'Ombra",
        "pact": "Oscurità",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Oscurità] 1 PE: Condensa un'arma fatta di pura ombra solida che colpisce ignorando le armature fisiche (+2 Ferite ad ogni attacco per 1 Scena)."
      },
      {
        "name": "Eclissi Divoratrice",
        "pact": "Oscurità",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Oscurità - Maggiore] Prezzo + 1 Corruzione: Spegne il sole o tutte le luci su un'intera città o campo di battaglia, accecando tutti i nemici del losejas."
      },
      {
        "name": "Divorare dall'Ombra",
        "pact": "Oscurità",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Oscurità - Maggiore] Prezzo + 1 Corruzione: L'ombra stessa di un bersaglio prende vita e lo trascina nel nulla o gli infligge istantaneamente 2 Ferite Drammatiche."
      },
      {
        "name": "Cuore di Brace",
        "pact": "Fuoco",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Fuoco] 1 PE: Il losejas diventa totalmente immune al fuoco, al calore estremo e al fumo fino alla fine della Scena."
      },
      {
        "name": "Lingua di Fiamma",
        "pact": "Fuoco",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Fuoco] 1 PE: Scaglia un dardo di fuoco o avvolge la propria arma nelle fiamme (+2 Ferite per attacco e incendia materiali infiammabili)."
      },
      {
        "name": "Danza delle Scintille",
        "pact": "Fuoco",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Fuoco] 1 PE: Fa esplodere una fonte di fuoco esistente accecando e disorientando i nemici vicini (subiscono -1 Incremento nel Round)."
      },
      {
        "name": "Sguardo nella Fiamma",
        "pact": "Fuoco",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Fuoco] 1 PE: Osservando un falò o una candela, vede ciò che sta accadendo vicino a qualsiasi altro fuoco acceso che il losejas conosca."
      },
      {
        "name": "Cenere alla Cenere",
        "pact": "Fuoco",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Fuoco] 1 PE: Tocca un oggetto inanimato grande quanto una porta o un baule e lo riduce istantaneamente in cenere fredda."
      },
      {
        "name": "Tempesta di Fuoco",
        "pact": "Fuoco",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Fuoco - Maggiore] Prezzo + 1 Corruzione: Scatena una pioggia di fuoco sull'intera Scena che incenerisce tutte le Squadre di Sgherri e infligge 1 Ferita Drammatica a tutti i nemici."
      },
      {
        "name": "Rinascita dalle Ceneri",
        "pact": "Fuoco",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Fuoco - Maggiore] Prezzo + 1 Corruzione: Se il losejas viene ucciso o reso Inerme, esplode in una colonna di fuoco e risorge illeso con 0 Ferite e 0 Ferite Drammatiche."
      },
      {
        "name": "Sangue d'Inverno",
        "pact": "Freddo",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Freddo] 1 PE: Immunità totale al gelo, all'ipotermia e alle tempeste di neve per tutta la Scena; cammina sul ghiaccio senza mai scivolare."
      },
      {
        "name": "Stretta del Gelo",
        "pact": "Freddo",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Freddo] 1 PE: Congela all'istante una superficie d'acqua, una serratura o gli arti di un avversario (che deve spendere 1 Incremento per liberarsi)."
      },
      {
        "name": "Armatura di Brina",
        "pact": "Freddo",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Freddo] 1 PE: Uno strato di ghiaccio duro come il ferro ricopre il losejas, riducendo di 2 tutte le Ferite subite da ogni attacco per la Scena."
      },
      {
        "name": "Soffio Boreale",
        "pact": "Freddo",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Freddo] 1 PE: Un vento gelido spegne tutti i fuochi e le micce delle armi da fuoco nella Scena, impedendo di sparare per l'intero Round."
      },
      {
        "name": "Scheggia di Ghiaccio",
        "pact": "Freddo",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Freddo] 1 PE: Crea una lancia o spada di ghiaccio eterno che infligge +2 Ferite e rallenta chi viene colpito."
      },
      {
        "name": "Cuore Ghiacciato",
        "pact": "Freddo",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Freddo - Maggiore] Prezzo + 1 Corruzione: Congela il sangue nelle vene di un bersaglio, paralizzandolo completamente in una statua di ghiaccio vivente per l'intera Scena."
      },
      {
        "name": "Era Glaciale",
        "pact": "Freddo",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Freddo - Maggiore] Prezzo + 1 Corruzione: Congela un intero porto, fiume o vallata in pochi istanti, intrappolando flotte o armate nel ghiaccio."
      },
      {
        "name": "Ali del Vento",
        "pact": "Tempesta",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Tempesta] 1 PE: Il vento solleva il losejas permettendogli di compiere balzi prodigiosi o cadere da qualsiasi altezza senza subire danni."
      },
      {
        "name": "Rombo di Tuono",
        "pact": "Tempesta",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Tempesta] 1 PE: Un boato assordante scaraventa a terra tutti i presenti vicini che non spendono 1 Incremento per restare in piedi."
      },
      {
        "name": "Saetta",
        "pact": "Tempesta",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Tempesta] 1 PE: Un fulmine colpisce un bersaglio a vista infliggendo Ferite pari al Grado di Risolutezza o Acume del losejas (+1 se indossa metallo)."
      },
      {
        "name": "Occhio del Ciclone",
        "pact": "Tempesta",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Tempesta] 1 PE: Crea una barriera di vento vorticoso attorno a sé che devia frecce, dardi e proiettili leggeri per tutta la Scena."
      },
      {
        "name": "Chiamare la Burrasca",
        "pact": "Tempesta",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Tempesta] 1 PE: Alza o placa i venti e la pioggia in pochi minuti, raddoppiando la velocità di un veliero o ostacolando gli inseguitori."
      },
      {
        "name": "Collera del Cielo",
        "pact": "Tempesta",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Tempesta - Maggiore] Prezzo + 1 Corruzione: Un urgano devastante o una raffica di fulmini abbatte un edificio, affonda una nave o spazza via un'intera guarnigione."
      },
      {
        "name": "Corpo di Fulmine",
        "pact": "Tempesta",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Tempesta - Maggiore] Prezzo + 1 Corruzione: Il losejas si trasforma in un fulmine vivente per la Scena: si muove istantaneamente ovunque e chiunque lo tocchi subisce 1 Ferita Drammatica."
      },
      {
        "name": "Respiro degli Abissi",
        "pact": "Mare",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Mare] 1 PE: Il losejas (e fino a 2 alleati toccati) può respirare sott'acqua e nuotare come un delfino senza subire la pressione né il freddo per 1 Scena."
      },
      {
        "name": "Richiamo della Marea",
        "pact": "Mare",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Mare] 1 PE: Manipola una massa d'acqua per creare un'onda che travolge i nemici o spinge un'imbarcazione fuori dalle secche."
      },
      {
        "name": "Camminare sulle Onde",
        "pact": "Mare",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Mare] 1 PE: Cammina e corre sulla superficie dell'acqua (anche in mare in tempesta) come se fosse solida terraferma per l'intera Scena."
      },
      {
        "name": "Voce delle Sirene",
        "pact": "Mare",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Mare] 1 PE: Parla con le creature marine o percepisce qualsiasi nave, scoglio o relitto sommerso nel raggio di miglia."
      },
      {
        "name": "Morsa di Corallo",
        "pact": "Mare",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Mare] 1 PE: L'acqua si avvinghia attorno a un bersaglio come tentacoli liquidi, immobilizzandolo o soffocandolo."
      },
      {
        "name": "Maelstrom",
        "pact": "Mare",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Mare - Maggiore] Prezzo + 1 Corruzione: Apre un vortice abissale nel mare capace di inghiottire un galeone intero o risvegliare un leviatano degli abissi."
      },
      {
        "name": "Maledizione dell'Annegato",
        "pact": "Mare",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Mare - Maggiore] Prezzo + 1 Corruzione: Riempie d'acqua salata i polmoni di un nemico anche sulla terraferma, rendendolo immediatamente Inerme salvo spendere tutti i suoi Incrementi."
      },
      {
        "name": "Lingua di Babele",
        "pact": "Conoscenza",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Conoscenza] 1 PE: Comprende, parla e legge qualsiasi lingua mortale (antica o moderna, incluso il Syrneth) per il resto della Scena."
      },
      {
        "name": "Occhio che Tutto Vede",
        "pact": "Conoscenza",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Conoscenza] 1 PE: Scopre istantaneamente se una persona sta mentendo e quale sia il suo timore o desiderio superficiale."
      },
      {
        "name": "Memoria del Sangue",
        "pact": "Conoscenza",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Conoscenza] 1 PE: Toccando un oggetto, assiste a una visione nitida dell'ultimo evento significativo accaduto attorno ad esso."
      },
      {
        "name": "Mente Tagliente",
        "pact": "Conoscenza",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Conoscenza] 1 PE: Il dievas sussurra la soluzione: ottieni +2 Incrementi in qualsiasi Rischio di Istruzione, Notare o Arte della Guerra."
      },
      {
        "name": "Velo dell'Oblio",
        "pact": "Conoscenza",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Conoscenza] 1 PE: Cancella gli ultimi 5 minuti di memoria dalla mente di un PNG non-Malvagio con cui ha appena parlato."
      },
      {
        "name": "Onniscienza Proibita",
        "pact": "Conoscenza",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Conoscenza - Maggiore] Prezzo + 1 Corruzione: Il dievas rivela la verità assoluta su qualsiasi complotto, luogo segreto o punto debole mortale di un Malvagio."
      },
      {
        "name": "Riscrivere la Mente",
        "pact": "Conoscenza",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Conoscenza - Maggiore] Prezzo + 1 Corruzione: Altera profondamente i ricordi, la fedeltà o la personalità di una vittima in modo permanente."
      },
      {
        "name": "Sguardo Magnetico",
        "pact": "Amore",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Amore] 1 PE: Chiunque guardi il losejas prova un'attrazione o simpatia irresistibile: +2 Incrementi nei Rischi di Allettare o Convincere per la Scena."
      },
      {
        "name": "Legame del Cuore",
        "pact": "Amore",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Amore] 1 PE: Percepisce esattamente verso chi sono rivolti l'amore, la gelosia o il tradimento di tutte le persone presenti nella Scena."
      },
      {
        "name": "Bacio della Quiete",
        "pact": "Amore",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Amore] 1 PE: Con una carezza o una parola dolce placa l'ira di un bersaglio; per attaccare il losejas deve spendere 2 Incrementi extra."
      },
      {
        "name": "Scintilla di Passione",
        "pact": "Amore",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Amore] 1 PE: Accende un'infatuazione o una gelosia improvvisa tra due persone presenti per tutta la durata della Scena."
      },
      {
        "name": "Dolore Condiviso",
        "pact": "Amore",
        "type": "Favore Minore",
        "doses": 1,
        "desc": "[Amore] 1 PE: Trasferisce le Ferite ordinarie subite da una persona amata o da un alleato direttamente sul proprio corpo (o viceversa se consenziente)."
      },
      {
        "name": "Ossessione Cieca",
        "pact": "Amore",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Amore - Maggiore] Prezzo + 1 Corruzione: Un bersaglio cade in una devozione fanatica verso il losejas, pronto a tradire i propri alleati o rischiare la vita per lui per 1 Episodio."
      },
      {
        "name": "Cuore Infranto",
        "pact": "Amore",
        "type": "Favore Maggiore",
        "corruption": true,
        "doses": 1,
        "desc": "[Amore - Maggiore] Prezzo + 1 Corruzione: Spezza il cuore di un nemico con un dolore emotivo insostenibile, infliggendogli 2 Ferite Drammatiche e rendendolo incapace di agire nel Round."
      }
    ]
  },
  {
    "name": "Sorte",
    "aliases": [
      "Sorte",
      "Sorte Non Addestrata"
    ],
    "nation": "Vodacce",
    "source": "Manuale Base pp. 228-231 & Nazioni di Théah Vol. 2 pp. 191-194",
    "description": "L’arte delle Streghe del Fato di Vodacce. 1° Grado: Lettura + 2 Effetti Minori + 1 Maggiore; 2° Grado: Lettura + 3 Minori + 2 Maggiori; 3° Grado: Lettura + 4 Minori + 3 Maggiori; 4° Grado: Tutti (Lettura + 4 Minori + 4 Maggiori). Ogni Trama accumula Staffilate (+1 per Effetto Minore, +2 per Maggiore). Con 1 Punto Pericolo il GM annulla tutti i dadi della Strega inferiori alle sue Staffilate attuali. Rimuovere 1 Staffilata costa Sangue (subisce Ferite = Staffilate attuali) o Sfortuna (il GM ottiene Punti Pericolo = Staffilate attuali). Include Tessere Senza Addestramento (Vol. 2 p. 192).",
    "rulesSummary": "Lettura (0 PE, 0 Staffilate). Minori (+1 Staffilata), Maggiori (+2 Staffilate). Rimuovere 1 Staffilata: Sangue (Ferite = Staffilate) o Sfortuna (PP al GM = Staffilate).",
    "powers": [
      {
        "name": "Lettura",
        "category": "Lettura",
        "type": "Base (Sempre attiva)",
        "lashes": 0,
        "doses": 1,
        "desc": "Costo: 0 PE, 0 Staffilate (1 Incremento in Sequenza d'Azione). La Strega apre la vista sui fili del destino: vede i fili d'oro, d'argento, rossi e neri che collegano le persone nella Scena e legge il mazzo della Sorte."
      },
      {
        "name": "Arcani (Minore)",
        "category": "Arcani",
        "type": "Trama Minore (+1 Staffilata)",
        "lashes": 1,
        "doses": 1,
        "desc": "Costo: 1 PE + 1 Staffilata. Estrae una carta per un bersaglio nella Scena: gli conferisce l'Adesivo di Virtù oppure l'Adesivo di Hubris di un Arcano scelto dalla Strega fino alla fine della Scena."
      },
      {
        "name": "Benedizione (Minore)",
        "category": "Benedizione",
        "type": "Trama Minore (+1 Staffilata)",
        "lashes": 1,
        "doses": 1,
        "desc": "Costo: 1 PE + 1 Staffilata. Accarezza il filo di un bersaglio: gli dona un numero di dadi bonus al suo prossimo Rischio pari al Grado di Stregoneria della Strega."
      },
      {
        "name": "Maledizione (Minore)",
        "category": "Maledizione",
        "type": "Trama Minore (+1 Staffilata)",
        "lashes": 1,
        "doses": 1,
        "desc": "Costo: 1 PE + 1 Staffilata. Tende il filo di un nemico: gli sottrae un numero di dadi dal suo prossimo Rischio pari al Grado di Stregoneria della Strega."
      },
      {
        "name": "Trascinare (Minore)",
        "category": "Trascinare",
        "type": "Trama Minore (+1 Staffilata)",
        "lashes": 1,
        "doses": 1,
        "desc": "Costo: 1 PE + 1 Staffilata. Tira fisicamente un filo per attrarre un oggetto incustodito in mano, far inciampare un nemico o spostare una persona nella Scena."
      },
      {
        "name": "Arcani (Maggiore)",
        "category": "Arcani",
        "type": "Trama Maggiore (+2 Staffilate)",
        "lashes": 2,
        "doses": 1,
        "desc": "Costo: 1 PE + 2 Staffilate. Riscrive il destino arcano del bersaglio fino a fine Episodio, sostituendo la sua Virtù e la sua Hubris con quelle dell'Arcano prescelto e attivandole immediatamente."
      },
      {
        "name": "Benedizione (Maggiore)",
        "category": "Benedizione",
        "type": "Trama Maggiore (+2 Staffilate)",
        "lashes": 2,
        "doses": 1,
        "desc": "Costo: 1 PE + 2 Staffilate. Intreccia la fortuna dorata attorno a un alleato: per l'intera Scena l'alleato ottiene Incrementi bonus a ogni Rischio pari al Grado di Stregoneria della Strega."
      },
      {
        "name": "Maledizione (Maggiore)",
        "category": "Maledizione",
        "type": "Trama Maggiore (+2 Staffilate)",
        "lashes": 2,
        "doses": 1,
        "desc": "Costo: 1 PE + 2 Staffilate. Annoda di nero il destino di un bersaglio: per l'intera Scena perde Incrementi ad ogni Rischio pari al Grado di Stregoneria della Strega (e le Ferite subite aumentano)."
      },
      {
        "name": "Trascinare (Maggiore)",
        "category": "Trascinare",
        "type": "Trama Maggiore (+2 Staffilate)",
        "lashes": 2,
        "doses": 1,
        "desc": "Costo: 1 PE + 2 Staffilate. Afferra il filo maestro di una persona o di una Squadra costringendola a compiere un'azione fisica immediata o immobilizzandola nei propri fili per 1 Round."
      }
    ]
  },
  {
    "name": "Alquimia",
    "aliases": [
      "Alquimia",
      "Alchimia"
    ],
    "nation": "Castille",
    "source": "Nazioni di Théah Vol. 1 pp. 95-100",
    "description": "La scienza sacra e proibita dei Boticarios di Castille. Ogni Grado di Stregoneria sblocca 1 delle 5 Juvenilia (Wai Dan, Rasāyana, Chymica, Spagyrica, Takwin); ogni Grado oltre il 1° permette di scegliere 1 composto realizzabile nel proprio Laboratorium ignorandone i Requisiti. Creare un composto costa 1 PE + Requisiti; attivarlo costa 1 Incremento. L'alchimista può trasportare al massimo un numero di composti pari al proprio Grado di Stregoneria (il doppio dentro il Laboratorium). Può inoltre perseguire una Magna Opera (Crisopea, Panacea, Alkahest) come Storia a 5 Atti.",
    "rulesSummary": "1 Juvenilia per Grado. Creazione: 1 PE + Requisiti (o 0 Req nel Laboratorium per composti padroneggiati). Uso: 1 Incremento. Max trasportabili: Grado (2× nel Laboratorium).",
    "juveniliaCategories": [
      "Wai Dan",
      "Rasāyana",
      "Chymica",
      "Spagyrica",
      "Takwin"
    ],
    "magnaOperaList": [
      {
        "name": "Crisopea",
        "desc": "La Grande Opera della trasmutazione dei metalli vili in oro puro incorruttibile e della perfezione della materia."
      },
      {
        "name": "Panacea",
        "desc": "Il rimedio universale capace di debellare qualsiasi morbo, veleno o ferita mortale e prolungare la vita."
      },
      {
        "name": "Alkahest",
        "desc": "Il solvente assoluto in grado di scomporre qualsiasi sostanza creata o artefatto Syrneth nei suoi elementi primordiali."
      }
    ],
    "powers": [
      {
        "name": "Longevità",
        "juvenilia": "Wai Dan",
        "reqs": 1,
        "type": "Wai Dan (1 Req)",
        "doses": 1,
        "desc": "[Wai Dan • 1 Requisito] Tonico vitale che rinvigorisce il corpo: ignora tutte le penalità da stanchezza, fame, sete o vecchiaia e previene 1 Ferita Drammatica nella Scena."
      },
      {
        "name": "Memoria",
        "juvenilia": "Wai Dan",
        "reqs": 1,
        "type": "Wai Dan (1 Req)",
        "doses": 1,
        "desc": "[Wai Dan • 1 Requisito] Permette di ricordare con precisione fotografica qualsiasi testo letto, mappa osservata o conversazione udita in passato (+2 Incrementi ai Rischi di memoria/Istruzione)."
      },
      {
        "name": "Intelligenza",
        "juvenilia": "Wai Dan",
        "reqs": 2,
        "type": "Wai Dan (2 Req)",
        "doses": 1,
        "desc": "[Wai Dan • 2 Requisiti] Espande la lucidità mentale: per il resto della Scena il Grado di Acume aumenta di +1 (fino a 5) e tutti i 10 tirati su Acume contano come 2 Incrementi."
      },
      {
        "name": "Gioventù",
        "juvenilia": "Wai Dan",
        "reqs": 1,
        "type": "Wai Dan (1 Req)",
        "doses": 1,
        "desc": "[Wai Dan • 1 Requisito] Restituisce il vigore e l'aspetto della giovinezza per una Scena, conferendo +1 Incremento a tutti i Rischi fisici (Vigore e Grazia)."
      },
      {
        "name": "Eccellenza della Gloria",
        "juvenilia": "Wai Dan",
        "reqs": 0,
        "type": "Wai Dan (0 Req)",
        "doses": 1,
        "desc": "[Wai Dan • 0 Requisiti] Infonde un'aura radiosa di sicurezza e carisma: +1 Incremento immediato nei Rischi di Panache o sociali nella Scena."
      },
      {
        "name": "Sale della Luce Senza Calore",
        "juvenilia": "Rasāyana",
        "reqs": 0,
        "type": "Rasāyana (0 Req)",
        "doses": 1,
        "desc": "[Rasāyana • 0 Requisiti] Cristalli luminescenti che illuminano a giorno un'intera sala o il ponte di una nave senza produrre calore né fiamma (funziona anche sott'acqua)."
      },
      {
        "name": "Lega Infrangibile",
        "juvenilia": "Rasāyana",
        "reqs": 1,
        "type": "Rasāyana (1 Req)",
        "doses": 1,
        "desc": "[Rasāyana • 1 Requisito] Trattamento metallurgico che rende un'arma, uno scudo o una serratura impossibile da spezzare e conferisce +1 Incremento quando la si usa per parare o colpire."
      },
      {
        "name": "Inchiostro Soporifero",
        "juvenilia": "Rasāyana",
        "reqs": 2,
        "type": "Rasāyana (2 Req)",
        "doses": 1,
        "desc": "[Rasāyana • 2 Requisiti] Inchiostro alchemico: chiunque legga o tocchi la pergamena su cui è steso cade in un sonno profondo per l'intera Scena (un Malvagio deve spendere 2 Incrementi per resistere)."
      },
      {
        "name": "Polvere Anestetica",
        "juvenilia": "Rasāyana",
        "reqs": 1,
        "type": "Rasāyana (1 Req)",
        "doses": 1,
        "desc": "[Rasāyana • 1 Requisito] Annulla il dolore fisico: chi la assume ignora tutte le penalità delle Ferite Drammatiche e riceve 3 Ferite in meno dal prossimo attacco."
      },
      {
        "name": "Sale Essenziale di Magnetite",
        "juvenilia": "Rasāyana",
        "reqs": 0,
        "type": "Rasāyana (0 Req)",
        "doses": 1,
        "desc": "[Rasāyana • 0 Requisiti] Polvere magnetica potentissima che attira o respinge oggetti metallici (armi, chiavi, proiettili) entro portata."
      },
      {
        "name": "Collante del Boticario",
        "juvenilia": "Chymica",
        "reqs": 0,
        "type": "Chymica (0 Req)",
        "doses": 1,
        "desc": "[Chymica • 0 Requisiti] Resina istantanea più forte del ferro: salda insieme due superfici o blocca una porta/arma nel fodero (richiede un Rischio di Vigore con 3 Incrementi per staccarla)."
      },
      {
        "name": "Leggero come una Piuma",
        "juvenilia": "Chymica",
        "reqs": 0,
        "type": "Chymica (0 Req)",
        "doses": 1,
        "desc": "[Chymica • 0 Requisiti] Riduce drasticamente il peso di un oggetto pesante (masso, cannone, forziere) o di una persona per 1 Scena, permettendo di sollevarlo con una mano."
      },
      {
        "name": "Acqua in Ghiaccio",
        "juvenilia": "Chymica",
        "reqs": 1,
        "type": "Chymica (1 Req)",
        "doses": 1,
        "desc": "[Chymica • 1 Requisito] Fiala endotermica che congela istantaneamente una massa d'acqua, spegne un incendio o crea una barriera di ghiaccio solido."
      },
      {
        "name": "Solvente Universale Assoluto",
        "juvenilia": "Chymica",
        "reqs": 1,
        "type": "Chymica (1 Req)",
        "doses": 1,
        "desc": "[Chymica • 1 Requisito] Acido alchemico che scioglie sbarre d'acciaio, lucchetti, catene o pietra in pochi secondi senza danneggiare il vetro che lo contiene."
      },
      {
        "name": "Vero Piombo",
        "juvenilia": "Chymica",
        "reqs": 0,
        "type": "Chymica (0 Req)",
        "doses": 1,
        "desc": "[Chymica • 0 Requisiti] Aumenta enormemente la densità e il peso di un oggetto: fa sprofondare un'imbarcazione leggera o rende uno scudo/arma impossibile da sollevare per un nemico."
      },
      {
        "name": "Amaranthus",
        "juvenilia": "Spagyrica",
        "reqs": 0,
        "type": "Spagyrica (0 Req + 1 PE)",
        "doses": 1,
        "desc": "[Spagyrica • 0 Requisiti + 1 PE] Estratto del fiore immortale: somministrato a un bersaglio, stabilizza una condizione critica e guarisce 1 Ferita Drammatica."
      },
      {
        "name": "Betonica",
        "juvenilia": "Spagyrica",
        "reqs": 2,
        "type": "Spagyrica (2 Req)",
        "doses": 1,
        "desc": "[Spagyrica • 2 Requisiti] Elisir erboristico che protegge la mente: rende immuni alla Paura, alle illusioni e alle manipolazioni mentali o stregonesche per l'intera Scena."
      },
      {
        "name": "Celidonia",
        "juvenilia": "Spagyrica",
        "reqs": 0,
        "type": "Spagyrica (0 Req)",
        "doses": 1,
        "desc": "[Spagyrica • 0 Requisiti] Collirio spagirico che acuisce la vista: permette di vedere al buio, attraverso il fumo o la nebbia e dona +1 Incremento a Notare e Mira."
      },
      {
        "name": "Euforbia",
        "juvenilia": "Spagyrica",
        "reqs": 1,
        "type": "Spagyrica (1 Req)",
        "doses": 1,
        "desc": "[Spagyrica • 1 Requisito] Purgante alchemico che neutralizza istantaneamente qualsiasi veleno, droga o infezione presente nel corpo."
      },
      {
        "name": "Girasole",
        "juvenilia": "Spagyrica",
        "reqs": 1,
        "type": "Spagyrica (1 Req)",
        "doses": 1,
        "desc": "[Spagyrica • 1 Requisito] Infuso solare che infonde coraggio ed energia: chi lo beve ottiene +1 Incremento immediato nel Round e rimuove tutte le Ferite ordinarie."
      },
      {
        "name": "Lenti Amplificatrici a Lunga Distanza",
        "juvenilia": "Takwin",
        "reqs": 0,
        "type": "Takwin (0 Req)",
        "doses": 1,
        "desc": "[Takwin • 0 Requisiti] Dispositivo ottico di precisione che permette di osservare dettagli minimi a chilometri di distanza o mirare senza penalità di gittata (+1 Incremento a Mira/Notare)."
      },
      {
        "name": "Apparato di Respirazione Subacquea",
        "juvenilia": "Takwin",
        "reqs": 0,
        "type": "Takwin (0 Req)",
        "doses": 1,
        "desc": "[Takwin • 0 Requisiti] Maschera alchemica con filtri d'aria che consente di respirare sott'acqua o in ambienti saturi di gas velenosi per un'intera Scena."
      },
      {
        "name": "Rilevatore a Visione Notturna",
        "juvenilia": "Takwin",
        "reqs": 0,
        "type": "Takwin (0 Req)",
        "doses": 1,
        "desc": "[Takwin • 0 Requisiti] Visore alchemico che rivela il calore dei corpi viventi e permette di orientarsi e combattere nell'oscurità totale senza penalità."
      },
      {
        "name": "Braccio Meccanico",
        "juvenilia": "Takwin",
        "reqs": 1,
        "type": "Takwin (1 Req)",
        "doses": 1,
        "desc": "[Takwin • 1 Requisito] Guanto o arto meccanico articolato che aumenta la forza di presa e conferisce +1 Incremento nei Rischi di Vigore, Rissa o Artigianato."
      },
      {
        "name": "Costrutto Semplice",
        "juvenilia": "Takwin",
        "reqs": 2,
        "type": "Takwin (2 Req)",
        "doses": 1,
        "desc": "[Takwin • 2 Requisiti] Un piccolo automa o homunculus alchemico capace di eseguire ordini semplici, fare la guardia, consegnare messaggi o creare un diversivo (+2 Incrementi di supporto)."
      }
    ]
  },
  {
    "name": "Galdr",
    "aliases": [
      "Galdr",
      "Futhark",
      "Galdr & Futhark",
      "Rune"
    ],
    "nation": "Vestenmennavenjar",
    "source": "Nazioni di Théah Vol. 1 pp. 191-195",
    "description": "L'antica magia runica del Futhark praticata dai vala e dagli skald di Vestenmennavenjar. Ogni Grado di Stregoneria insegna 2 Rune del Futhark (su 12 totali). Spendendo 1 Punto Eroe (+1 Incremento in Azione/Drammatica), il vala spezza la runa che porta inciso il proprio nome per attivare contemporaneamente 1 Stort Merke (Marchio Maggiore) e 1 Litet Merke (Marchio Minore) scelti tra le rune che conosce (anche dalla stessa runa).",
    "rulesSummary": "2 Rune del Futhark per Grado. Attivazione (1 PE + 1 Incr. in Azione): attiva insieme 1 Stort Merke (Maggiore) + 1 Litet Merke (Minore) tra le Rune conosciute.",
    "powers": [
      {
        "name": "Runa: Bestia (Dyr)",
        "rune": "Bestia",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Tutti gli animali nella Scena obbediscono ai comandi del vala, oppure il vala assume la ferocia di una bestia ottenendo +2 Incrementi in Mischia/Rissa eAtletica.",
        "litetMerke": "Litet Merke (Minore): Percepisce la presenza e il numero di tutte le creature viventi vicine e ottiene +1 Incremento per seguire tracce o cavalcare.",
        "desc": "Stort Merke: Domina le bestie nella Scena o ottiene +2 Incrementi ferini in combattimento/atletica. • Litet Merke: Percepisce ogni creatura vivente vicina (+1 Incremento a tracce/cavalcare)."
      },
      {
        "name": "Runa: Coraggio (Mot)",
        "rune": "Coraggio",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Il vala e tutti i suoi alleati nella Scena diventano immuni alla Paura e ottengono +1 Incremento in tutti i Rischi finché affrontano il pericolo a viso aperto.",
        "litetMerke": "Litet Merke (Minore): Rimuove immediatamente ogni effetto di Paura o esitazione da un singolo personaggio e gli conferisce +1 dado al prossimo Rischio.",
        "desc": "Stort Merke: Tutti gli alleati sono immuni alla Paura e ottengono +1 Incremento nella Scena. • Litet Merke: Cancella la Paura da un alleato (+1 dado)."
      },
      {
        "name": "Runa: Ferro (Jern)",
        "rune": "Ferro",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Le armi degli alleati infliggono +2 Ferite ad ogni attacco per il resto del Round, oppure spezza istantaneamente l'arma non magica di un nemico.",
        "litetMerke": "Litet Merke (Minore): L'arma o l'armatura toccata dal vala conferisce +1 Incremento nel prossimo attacco o previene 2 Ferite.",
        "desc": "Stort Merke: +2 Ferite alle armi alleate per il Round oppure spezza l'arma di un avversario. • Litet Merke: +1 Incremento con l'arma o previene 2 Ferite."
      },
      {
        "name": "Runa: Inverno (Vinter)",
        "rune": "Inverno",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Scatena il gelo mordente del nord: tutti i nemici nella Scena perdono 1 Incremento per il freddo estremo e l'acqua circostante si congela solidamente.",
        "litetMerke": "Litet Merke (Minore): Rende il vala immune al freddo/fuoco per la Scena o congela un piccolo oggetto/serratura.",
        "desc": "Stort Merke: Gelo nordico che toglie 1 Incremento ai nemici e congela le acque. • Litet Merke: Immunità a freddo/calore o congela un oggetto."
      },
      {
        "name": "Runa: Luce (Lys)",
        "rune": "Luce",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Un lampo accecante svela ogni illusione o nemico nascosto e costringe gli avversari a spendere 1 Incremento per poter attaccare in questo Round.",
        "litetMerke": "Litet Merke (Minore): La runa brilla come una torcia inestinguibile e rivela se una persona ha appena detto la verità.",
        "desc": "Stort Merke: Luce accecante che svela inganni e impone 1 Incremento ai nemici per attaccare. • Litet Merke: Luce inestinguibile e percezione della verità."
      },
      {
        "name": "Runa: Pietra (Stein)",
        "rune": "Pietra",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): La pelle del vala diventa dura come il granito: riduce di 3 tutte le Ferite subite da qualsiasi fonte per il resto della Scena e non può essere atterrato.",
        "litetMerke": "Litet Merke (Minore): Previene 2 Ferite da un singolo attacco o fa tremare il suolo creando un'Opportunità.",
        "desc": "Stort Merke: Pelle di granito (riduce di 3 le Ferite subite per la Scena, inamovibile). • Litet Merke: Previene 2 Ferite subito."
      },
      {
        "name": "Runa: Sangue (Blod)",
        "rune": "Sangue",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Risveglia il furore del sangue: guarisce 1 Ferita Drammatica a sé o a un alleato, oppure converte le proprie Ferite Drammatiche in altrettanti Incrementi bonus per il Round.",
        "litetMerke": "Litet Merke (Minore): Guarisce tutte le Ferite ordinarie di un personaggio o rintraccia chiunque abbia perso sangue nella Scena.",
        "desc": "Stort Merke: Guarisce 1 Ferita Drammatica oppure +1 Incremento per ogni propria FD attiva. • Litet Merke: Cura le Ferite ordinarie."
      },
      {
        "name": "Runa: Spirito (Ånd)",
        "rune": "Spirito",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Richiama gli spiriti degli antenati Einherjar che combattono al fianco del vala o rispondono a 3 domande sul passato o sul destino.",
        "litetMerke": "Litet Merke (Minore): Permette di vedere e comunicare con gli spiriti dei defunti o percepire la magia attiva nella Scena.",
        "desc": "Stort Merke: Richiama gli spiriti degli antenati per combattere o rispondere a 3 domande. • Litet Merke: Vede e parla con gli spiriti."
      },
      {
        "name": "Runa: Stella (Stjerne)",
        "rune": "Stella",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Guida del destino stellare: il vala o un alleato può ritirare tutti i dadi che non hanno dato 10 in un Rischio e ottiene +2 Incrementi in Navigazione.",
        "litetMerke": "Litet Merke (Minore): Conosce con certezza assoluta la propria posizione geografica, la rotta perfetta e il tempo che farà.",
        "desc": "Stort Merke: Ritira tutti i dadi < 10 in un Rischio (+2 Incrementi a Navigazione). • Litet Merke: Orientamento e rotta infallibili."
      },
      {
        "name": "Runa: Tempesta (Storm)",
        "rune": "Tempesta",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Invoca venti impetuosi e onde che spazzano via una Squadra di Sgherri o raddoppiano la velocità della nave del vala per l'intera Scena.",
        "litetMerke": "Litet Merke (Minore): Una folata di vento devia un attacco a distanza contro il vala o gonfia le vele (+1 Incremento).",
        "desc": "Stort Merke: Venti di burrasca che travolgono gli Sgherri o raddoppiano la velocità navale. • Litet Merke: Folata che devia un tiro a distanza (+1 Incremento)."
      },
      {
        "name": "Runa: Tempo (Tid)",
        "rune": "Tempo",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Piega lo scorrere degli istanti: il vala compie immediatamente 2 Azioni distinte prima che chiunque altro possa reagire, oppure annulla un'Azione appena compiuta da un nemico.",
        "litetMerke": "Litet Merke (Minore): Agisce come se avesse +2 Incrementi ai fini dell'ordine di iniziativa nel Round.",
        "desc": "Stort Merke: Compie 2 Azioni immediate o riavvolge un'azione nemica. • Litet Merke: +2 Incrementi per agire per primo nel Round."
      },
      {
        "name": "Runa: Tuono (Torden)",
        "rune": "Tuono",
        "type": "Runa del Futhark",
        "doses": 1,
        "stortMerke": "Stort Merke (Maggiore): Colpisce con il fragore del tuono e del fulmine: infligge Ferite pari al proprio Grado di Vigore + Risolutezza a un bersaglio e stordisce chi gli sta vicino.",
        "litetMerke": "Litet Merke (Minore): La voce del vala rimbomba come il tuono (+1 Incremento a Intimidire/Esibirsi) o un colpo infligge +2 Ferite.",
        "desc": "Stort Merke: Colpo di fulmine e tuono (Ferite = Vigore + Risolutezza e stordisce). • Litet Merke: Voce tonante (+1 Incremento a Intimidire) o +2 Ferite."
      }
    ]
  },
  {
    "name": "Tocco di Tură",
    "aliases": [
      "Tocco di Tură",
      "Tocco di Tura",
      "Tura"
    ],
    "nation": "Ussura",
    "source": "Nazioni di Théah Vol. 2 pp. 145-147",
    "description": "Il dono tempestoso di Tură, il fratello ribelle di Matushka. Chi lo riceve porta un Marchio nero freddo al tocco (sul viso, sul collo o sulle mani; +1 Incremento nelle azioni sociali con gli Ussurani che conoscono il Marchio). Ogni Grado di Stregoneria conferisce 2 Doni di Tură e aggiunge 2 Atti al proprio Compito di Tură (fino a 4 Atti). Attivare un Dono costa 1 Punto Eroe.",
    "rulesSummary": "2 Doni per Grado + Marchio nero freddo (+1 Incr. sociale con Ussurani consapevoli) + Compito di Tură (2 Atti per Grado). Attivare un Dono costa 1 PE.",
    "markLocations": [
      "Viso",
      "Collo",
      "Mani"
    ],
    "tasksOfTura": [
      {
        "name": "Diffondere il Messaggio di Tură",
        "desc": "Dimostrare agli Ussurani che il cambiamento, il progresso e la libertà dal giogo di Matushka sono possibili."
      },
      {
        "name": "Sabotare il Messaggio di Matushka",
        "desc": "Smascherare la crudeltà delle lezioni di Nonna Ussura e ostacolare i suoi servitori più tradizionalisti."
      },
      {
        "name": "Fermare Matushka",
        "desc": "Spezzare il dominio antico di Nonna Ussura sulla terra e sul popolo ussurano."
      }
    ],
    "powers": [
      {
        "name": "Linguaggio degli Uccelli",
        "type": "Dono Esclusivo di Tură",
        "source": "Vol.2",
        "doses": 1,
        "desc": "1 PE: Comprende e parla il linguaggio di tutti gli uccelli; può chiedere agli stormi di esplorare dall'alto, riferire ciò che hanno visto o portare messaggi."
      },
      {
        "name": "Fulmine",
        "type": "Dono Esclusivo di Tură",
        "source": "Vol.2",
        "doses": 1,
        "desc": "1 PE: Scaglia una saetta dal cielo o dalle proprie mani contro un bersaglio visibile, infliggendo istantaneamente un numero di Ferite inevitabili pari al proprio Grado di Istruzione."
      },
      {
        "name": "Leggere il Vento",
        "type": "Dono Esclusivo di Tură",
        "source": "Vol.2",
        "doses": 1,
        "desc": "1 PE: Ascolta le voci e gli odori portati dal vento: può udire conversazioni lontane miglia nella direzione del vento o percepire pericoli imminenti (+2 Incrementi a Notare)."
      },
      {
        "name": "Camminare nel Vento",
        "type": "Dono Esclusivo di Tură",
        "source": "Vol.2",
        "doses": 1,
        "desc": "1 PE: Si solleva sulle correnti d'aria volando o compiendo balzi impossibili attraverso la Scena fino alla fine del Round (o atterrando illeso da qualsiasi altezza)."
      },
      {
        "name": "Illuminare",
        "type": "Dono Condiviso",
        "source": "Base/Vol.2",
        "doses": 1,
        "desc": "1 PE: Un lampo di luce fredda svela la verità, dissipa le illusioni o mostra il cammino nascosto nella tempesta."
      },
      {
        "name": "Purificare",
        "type": "Dono Condiviso",
        "source": "Base/Vol.2",
        "doses": 1,
        "desc": "1 PE: Con un soffio gelido purifica cibo, acqua o il sangue di una creatura da qualsiasi veleno naturale o malattia."
      },
      {
        "name": "Rigenerazione",
        "type": "Dono Condiviso",
        "source": "Base/Vol.2",
        "doses": 1,
        "desc": "1 PE: L'energia elettrica della tempesta richiude le ferite: guarisce 1 Ferita Drammatica e tutte le Ferite ordinarie di una creatura toccata."
      },
      {
        "name": "Tempesta",
        "type": "Dono Condiviso",
        "source": "Base/Vol.2",
        "doses": 1,
        "desc": "1 PE: Scatena una bufera di vento, fulmini e grandine nella Scena, creando Opportunità per gli alleati o Conseguenze per i nemici."
      }
    ]
  }
],
  "faiths": [
    "Chiesa del Vaticinio",
    "Obiezione (Riformisti)",
    "Chiesa di Avalon",
    "I Vecchi Dèi (Glamour / Sidhe)",
    "Fede Ortodossa Ussurana (Matushka)",
    "Al-Dinn (Impero della Mezzaluna)",
    "Dievismo Sarmatiano",
    "Scettico / Nessuna Fede"
  ],
  "antagonists": [
    {
      "id": "s7_brute_pirates",
      "name": "Pirati della Fratellanza (Squadra Sgherri)",
      "type": "Squadra di Sgherri (Brute Squad)",
      "strength": 6,
      "hp": 6,
      "ac": 10,
      "size": "Media",
      "ability": "Abbordaggio Selvaggio: Infligge 6 Ferite a fine round se non ridotta. Ogni Incremento speso riduce di 1 la Forza.",
      "traits": "Rissa, Navigazione, Intimidire"
    },
    {
      "id": "s7_brute_guards",
      "name": "Guardie Cardinalizie di Castille (Squadra Sgherri)",
      "type": "Squadra di Sgherri (Brute Squad)",
      "strength": 8,
      "hp": 8,
      "ac": 12,
      "size": "Media",
      "ability": "Falange Disciplinata: Richiede 2 Incrementi per essere aggirata senza subire danno.",
      "traits": "Armi Bianche, Guerra, Vigilanza"
    },
    {
      "id": "s7_brute_mercs",
      "name": "Mercenari Veterani di Eisen (Squadra Sgherri)",
      "type": "Squadra di Sgherri (Brute Squad)",
      "strength": 10,
      "hp": 10,
      "ac": 14,
      "size": "Media",
      "ability": "Corazza di Ferro: La prima volta in ogni round in cui subisce danni da un Eroe, riduce di 1 le Ferite subite.",
      "traits": "Guerra, Mischia, Risolutezza"
    },
    {
      "id": "s7_brute_assassins",
      "name": "Assassini delle Ombre di Vodacce (Squadra Sgherri)",
      "type": "Squadra di Sgherri (Brute Squad)",
      "strength": 8,
      "hp": 8,
      "ac": 13,
      "size": "Media",
      "ability": "Lame Avvelenate: Se infliggono almeno 3 Ferite in un colpo, il bersaglio perde 1 Incremento nel prossimo round.",
      "traits": "Furtività, Pugnali, Mira"
    },
    {
      "id": "s7_brute_thugs",
      "name": "Bruti dei Bassifondi di Charouse (Squadra Sgherri)",
      "type": "Squadra di Sgherri (Brute Squad)",
      "strength": 5,
      "hp": 5,
      "ac": 10,
      "size": "Media",
      "ability": "Accerchiamento: +1 danno se gli Eroi sono in inferiorità numerica.",
      "traits": "Rissa, Furto"
    },
    {
      "id": "s7_monster_ungetum",
      "name": "Ungetüm delle Foreste di Eisen (Mostro)",
      "type": "Mostro Terribile",
      "strength": 15,
      "hp": 20,
      "ac": 15,
      "size": "Grande",
      "ability": "Paura Primordiale (Grado 3) & Artigli Laceranti: Infligge +2 Ferite ad ogni attacco in mischia.",
      "traits": "Mostro Soprannaturale di Eisen"
    },
    {
      "id": "s7_monster_syrneth",
      "name": "Automa Guardiano Syrneth (Mostro)",
      "type": "Mostro Syrneth",
      "strength": 16,
      "hp": 20,
      "ac": 17,
      "size": "Grande",
      "ability": "Corazza Thallium: Immune alla paura e al veleno. Raggio Syrneth: attacca a distanza infliggendo 4 Ferite.",
      "traits": "Costrutto Antico Syrneth"
    },
    {
      "id": "s7_monster_kraken",
      "name": "Kraken degli Abissi di Théah (Mostro)",
      "type": "Mostro Leggendario",
      "strength": 20,
      "hp": 20,
      "ac": 18,
      "size": "Mastodontica",
      "ability": "Tentacoli Colossali: Può afferrare intere navi o più Eroi contemporaneamente con 1 solo Incremento.",
      "traits": "Leviatano dei Mari"
    },
    {
      "id": "s7_villain_austyn_engelhart",
      "name": "Austyn Engelhart",
      "category": "villain",
      "type": "Malvagio (Belva)",
      "archetype": "Malvagi Belva",
      "nation": "Eisen",
      "strength": 8,
      "influence": 2,
      "villainyRank": 10,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_drieu_riquesse",
      "name": "Drieu Riquesse",
      "category": "villain",
      "type": "Malvagio (Belva)",
      "archetype": "Malvagi Belva",
      "nation": "Castille",
      "strength": 9,
      "influence": 6,
      "villainyRank": 15,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_giuliana_onesta",
      "name": "Giuliana Onesta",
      "category": "villain",
      "type": "Malvagio (Belva)",
      "archetype": "Malvagi Belva",
      "nation": "Vodacce",
      "strength": 7,
      "influence": 8,
      "villainyRank": 15,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_liphilt",
      "name": "Liphilt",
      "category": "villain",
      "type": "Malvagio (Belva)",
      "archetype": "Malvagi Belva",
      "nation": "Eisen",
      "strength": 10,
      "influence": 3,
      "villainyRank": 13,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_luisio_barozzi",
      "name": "Luisio Barozzi",
      "category": "villain",
      "type": "Malvagio (Belva)",
      "archetype": "Malvagi Belva",
      "nation": "Vodacce",
      "strength": 7,
      "influence": 9,
      "villainyRank": 16,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_mary_galloway",
      "name": "Mary Galloway",
      "category": "villain",
      "type": "Malvagio (Belva)",
      "archetype": "Malvagi Belva",
      "nation": "Le Marche delle Highland",
      "strength": 10,
      "influence": 4,
      "villainyRank": 14,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_mikhaila_misha_oksanova",
      "name": "Mikhaila “Misha” Oksanova",
      "category": "villain",
      "type": "Malvagio (Belva)",
      "archetype": "Malvagi Belva",
      "nation": "Ussura",
      "strength": 3,
      "influence": 7,
      "villainyRank": 10,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_ondro_r_g",
      "name": "Ondro Róg",
      "category": "villain",
      "type": "Malvagio (Belva)",
      "archetype": "Malvagi Belva",
      "nation": "Confederazione Sarmatiana",
      "strength": 7,
      "influence": 1,
      "villainyRank": 8,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_bogdan_snegovik",
      "name": "Bogdan Snegovik",
      "category": "villain",
      "type": "Malvagio (Camaleontici)",
      "archetype": "Malvagi Camaleontici",
      "nation": "Ussura",
      "strength": 8,
      "influence": 1,
      "villainyRank": 9,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_dana_gwozdek",
      "name": "Dana Gwozdek",
      "category": "villain",
      "type": "Malvagio (Camaleontici)",
      "archetype": "Malvagi Camaleontici",
      "nation": "Confederazione Sarmatiana",
      "strength": 6,
      "influence": 3,
      "villainyRank": 9,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_einar_ibsen",
      "name": "Einar Ibsen",
      "category": "villain",
      "type": "Malvagio (Camaleontici)",
      "archetype": "Malvagi Camaleontici",
      "nation": "Vestenmennavenjar",
      "strength": 5,
      "influence": 10,
      "villainyRank": 15,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_madre_guineu",
      "name": "Madre Guineu",
      "category": "villain",
      "type": "Malvagio (Camaleontici)",
      "archetype": "Malvagi Camaleontici",
      "nation": "Castille",
      "strength": 4,
      "influence": 4,
      "villainyRank": 8,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_reinhard_vogel",
      "name": "Reinhard Vogel",
      "category": "villain",
      "type": "Malvagio (Camaleontici)",
      "archetype": "Malvagi Camaleontici",
      "nation": "Eisen",
      "strength": 11,
      "influence": 1,
      "villainyRank": 12,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_stavros_sarris",
      "name": "Stavros Sarris",
      "category": "villain",
      "type": "Malvagio (Camaleontici)",
      "archetype": "Malvagi Camaleontici",
      "nation": "Numa",
      "strength": 3,
      "influence": 10,
      "villainyRank": 13,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_tassine_bullet",
      "name": "Tassine Bullet",
      "category": "villain",
      "type": "Malvagio (Camaleontici)",
      "archetype": "Malvagi Camaleontici",
      "nation": "Montaigne",
      "strength": 7,
      "influence": 4,
      "villainyRank": 11,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_thora_ulfborn",
      "name": "Thora Ulfborn",
      "category": "villain",
      "type": "Malvagio (Camaleontici)",
      "archetype": "Malvagi Camaleontici",
      "nation": "Vestenmennavenjar",
      "strength": 7,
      "influence": 3,
      "villainyRank": 10,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_adeliadis_petronilla_fassequele",
      "name": "Adeliadis Petronilla Fassequele",
      "category": "villain",
      "type": "Malvagio (Geni del Male)",
      "archetype": "Malvagi Geni del Male",
      "nation": "Montaigne",
      "strength": 4,
      "influence": 10,
      "villainyRank": 14,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_agafya_markova",
      "name": "Agafya Markova",
      "category": "villain",
      "type": "Malvagio (Geni del Male)",
      "archetype": "Malvagi Geni del Male",
      "nation": "Ussura",
      "strength": 8,
      "influence": 8,
      "villainyRank": 16,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_anatol_akalewicz",
      "name": "Anatol Akalewicz",
      "category": "villain",
      "type": "Malvagio (Geni del Male)",
      "archetype": "Malvagi Geni del Male",
      "nation": "Confederazione Sarmatiana",
      "strength": 3,
      "influence": 7,
      "villainyRank": 10,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_facio_contarini",
      "name": "Facio Contarini",
      "category": "villain",
      "type": "Malvagio (Geni del Male)",
      "archetype": "Malvagi Geni del Male",
      "nation": "Vodacce",
      "strength": 3,
      "influence": 13,
      "villainyRank": 16,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_fritjof_larsen",
      "name": "Fritjof Larsen",
      "category": "villain",
      "type": "Malvagio (Geni del Male)",
      "archetype": "Malvagi Geni del Male",
      "nation": "Vestenmennavenjar",
      "strength": 3,
      "influence": 3,
      "villainyRank": 6,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_gabriella_angelo",
      "name": "Gabriella Angelo",
      "category": "villain",
      "type": "Malvagio (Geni del Male)",
      "archetype": "Malvagi Geni del Male",
      "nation": "Eisen",
      "strength": 7,
      "influence": 2,
      "villainyRank": 9,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_lotje_abbing",
      "name": "Lotje Abbing",
      "category": "villain",
      "type": "Malvagio (Geni del Male)",
      "archetype": "Malvagi Geni del Male",
      "nation": "Eisen",
      "strength": 11,
      "influence": 8,
      "villainyRank": 19,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_luck_il_buffone",
      "name": "Luck, il Buffone",
      "category": "villain",
      "type": "Malvagio (Geni del Male)",
      "archetype": "Malvagi Geni del Male",
      "nation": "Avalon",
      "strength": 3,
      "influence": 7,
      "villainyRank": 10,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_anselet",
      "name": "Anselet",
      "category": "villain",
      "type": "Malvagio (Furie Inarrestabili)",
      "archetype": "Malvagi Furie Inarrestabili",
      "nation": "Castille",
      "strength": 9,
      "influence": 1,
      "villainyRank": 10,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_deargh_kilgore",
      "name": "Deargh Kilgore",
      "category": "villain",
      "type": "Malvagio (Furie Inarrestabili)",
      "archetype": "Malvagi Furie Inarrestabili",
      "nation": "Le Marche delle Highland",
      "strength": 13,
      "influence": 4,
      "villainyRank": 17,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_elena_grigorii",
      "name": "Elena Grigorii",
      "category": "villain",
      "type": "Malvagio (Furie Inarrestabili)",
      "archetype": "Malvagi Furie Inarrestabili",
      "nation": "Confederazione Sarmatiana",
      "strength": 8,
      "influence": 2,
      "villainyRank": 10,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_isentrud_der_chegir",
      "name": "Isentrud der Chegir",
      "category": "villain",
      "type": "Malvagio (Furie Inarrestabili)",
      "archetype": "Malvagi Furie Inarrestabili",
      "nation": "Eisen",
      "strength": 7,
      "influence": 6,
      "villainyRank": 13,
      "hp": 25,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_jorunn_sn",
      "name": "Jorunn Snø",
      "category": "villain",
      "type": "Malvagio (Furie Inarrestabili)",
      "archetype": "Malvagi Furie Inarrestabili",
      "nation": "Vestenmennavenjar",
      "strength": 5,
      "influence": 5,
      "villainyRank": 10,
      "hp": 25,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_perrote_glentier",
      "name": "Perrote Églentier",
      "category": "villain",
      "type": "Malvagio (Furie Inarrestabili)",
      "archetype": "Malvagi Furie Inarrestabili",
      "nation": "Montaigne",
      "strength": 8,
      "influence": 2,
      "villainyRank": 10,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_slepa_miskovna",
      "name": "Slepa Miskovna",
      "category": "villain",
      "type": "Malvagio (Furie Inarrestabili)",
      "archetype": "Malvagi Furie Inarrestabili",
      "nation": "Ussura",
      "strength": 10,
      "influence": 5,
      "villainyRank": 15,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_venerio_barleto",
      "name": "Venerio Barleto",
      "category": "villain",
      "type": "Malvagio (Furie Inarrestabili)",
      "archetype": "Malvagi Furie Inarrestabili",
      "nation": "Vodacce",
      "strength": 3,
      "influence": 11,
      "villainyRank": 14,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_guiomar_palomino",
      "name": "Guiomar Palomino",
      "category": "villain",
      "type": "Malvagio (Folli)",
      "archetype": "Malvagi Folli",
      "nation": "Castille",
      "strength": 8,
      "influence": 1,
      "villainyRank": 9,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_kolbjorn_wyrm",
      "name": "Kolbjorn Wyrm",
      "category": "villain",
      "type": "Malvagio (Folli)",
      "archetype": "Malvagi Folli",
      "nation": "Vestenmennavenjar",
      "strength": 12,
      "influence": 6,
      "villainyRank": 18,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_ludwika_krzy_anowska",
      "name": "Ludwika Krzyżanowska",
      "category": "villain",
      "type": "Malvagio (Folli)",
      "archetype": "Malvagi Folli",
      "nation": "Confederazione Sarmatiana",
      "strength": 4,
      "influence": 7,
      "villainyRank": 11,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_madama_illuminata",
      "name": "Madama Illuminata",
      "category": "villain",
      "type": "Malvagio (Folli)",
      "archetype": "Malvagi Folli",
      "nation": "Vodacce",
      "strength": 6,
      "influence": 7,
      "villainyRank": 13,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_pavel_mordi_dita",
      "name": "Pavel Mordi-Dita",
      "category": "villain",
      "type": "Malvagio (Folli)",
      "archetype": "Malvagi Folli",
      "nation": "Ussura",
      "strength": 6,
      "influence": 1,
      "villainyRank": 7,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_sakse_tryggvasson",
      "name": "Sakse Tryggvasson",
      "category": "villain",
      "type": "Malvagio (Folli)",
      "archetype": "Malvagi Folli",
      "nation": "Vestenmennavenjar",
      "strength": 10,
      "influence": 2,
      "villainyRank": 12,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_stewart_il_goblin_della_palude_di_den",
      "name": "Stewart, il Goblin della Palude di Den",
      "category": "villain",
      "type": "Malvagio (Folli)",
      "archetype": "Malvagi Folli",
      "nation": "Le Marche delle Highland",
      "strength": 5,
      "influence": 1,
      "villainyRank": 6,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_villain_la_dama_bianca_della_torre_di_hirschblut",
      "name": "La Dama Bianca della Torre di Hirschblut",
      "category": "villain",
      "type": "Malvagio (Folli)",
      "archetype": "Malvagi Folli",
      "nation": "Eisen",
      "strength": 6,
      "influence": 5,
      "villainyRank": 11,
      "hp": 20,
      "size": "Media",
      "_lazyVillain": true
    },
    {
      "id": "s7_npc_ambro_y_czy_yk",
      "name": "Ambroży Czyżyk",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Indomiti",
      "nation": "Confederazione Sarmatiana",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_catalina_morta",
      "name": "Catalina Morta",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Indomiti",
      "nation": "Castille",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_eadric_croft",
      "name": "Eadric Croft",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Indomiti",
      "nation": "Inismore",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_isaac_paige",
      "name": "Isaac Paige",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Indomiti",
      "nation": "Avalon",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_isabeau_durpan",
      "name": "Isabeau Durpan",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Indomiti",
      "nation": "Montaigne",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_lorenzo_caravello",
      "name": "Lorenzo Caravello",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Indomiti",
      "nation": "Vodacce",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_marrok",
      "name": "Marrok",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Indomiti",
      "nation": "Ussura",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_olin_olle_olsen",
      "name": "Olin Olle Olsen",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Indomiti",
      "nation": "Vestenmennavenjar",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_bietrix_de_veau",
      "name": "Bietrix de Veau",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Lesti",
      "nation": "Montaigne",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_eberhardt_fischer",
      "name": "Eberhardt Fischer",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Lesti",
      "nation": "Eisen",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_in_s_maldonado",
      "name": "Inés Maldonado",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Lesti",
      "nation": "Castille",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_caius_de_bello",
      "name": "Caius de Bello",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Lesti",
      "nation": "Vodacce",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_lilly_tuama",
      "name": "Lilly Ó Tuama",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Lesti",
      "nation": "Inismore",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_milo_de_villenc",
      "name": "Milo de Villenc",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Lesti",
      "nation": "Montaigne",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_reider_ness",
      "name": "Reider Ness",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Lesti",
      "nation": "Vestenmennavenjar",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_stanimir_buscov",
      "name": "Stanimir Buscov",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Lesti",
      "nation": "Ussura",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_adam_vide",
      "name": "Adam Vide",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Strateghi",
      "nation": "Montaigne",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_aoife_raghnaill",
      "name": "Aoife Ó Raghnaill",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Strateghi",
      "nation": "Inismore",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_celeste_de_villenc",
      "name": "Celeste de Villenc",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Strateghi",
      "nation": "Montaigne",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_elpis_moraitis",
      "name": "Elpis Moraitis",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Strateghi",
      "nation": "Numa",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_hulda_silje",
      "name": "Hulda Silje",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Strateghi",
      "nation": "Vestenmennavenjar",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_osterhilde_hummel",
      "name": "Osterhilde Hummel",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Strateghi",
      "nation": "Eisen",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_szymon_naumov",
      "name": "Szymon Naumov",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Strateghi",
      "nation": "Confederazione Sarmatiana",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_titania_pagani",
      "name": "Titania Pagani",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Strateghi",
      "nation": "Vodacce",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_agrippa_dell_acqua",
      "name": "Agrippa Dell’Acqua",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Baluardo",
      "nation": "Vodacce",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_cadha_mag_raith",
      "name": "Cadha Mag Raith",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Baluardo",
      "nation": "Le Marche delle Highland",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_estandart_de_milly",
      "name": "Estandart de Milly",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Baluardo",
      "nation": "Montaigne",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_gudrun_hass",
      "name": "Gudrun Hass",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Baluardo",
      "nation": "Eisen",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_keddy_stewart",
      "name": "Keddy Stewart",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Baluardo",
      "nation": "Inismore",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_rodrigo_f_lix",
      "name": "Rodrigo Félix",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Baluardo",
      "nation": "Castille",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_viktor_markovich",
      "name": "Viktor Markovich",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Baluardo",
      "nation": "Ussura",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_wicus_jachowski",
      "name": "Wicus Jachowski",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Baluardo",
      "nation": "Confederazione Sarmatiana",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_desideria_colomberia",
      "name": "Desideria Colomberia",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Ingannatori",
      "nation": "Vodacce",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_kassidy_minihan",
      "name": "Kassidy Minihan",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Ingannatori",
      "nation": "Inismore",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_ludwig_schlammann",
      "name": "Ludwig Schlammann",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Ingannatori",
      "nation": "Eisen",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_quinn_leroy",
      "name": "Quinn Leroy",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Ingannatori",
      "nation": "Montaigne",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_samo_sokolof",
      "name": "Samo Sokolof",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Ingannatori",
      "nation": "Confederazione Sarmatiana",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_tove_bystr_rm",
      "name": "Tove Byströrm",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Ingannatori",
      "nation": "Vestenmennavenjar",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_vasilii",
      "name": "Vasilii",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Ingannatori",
      "nation": "Ussura",
      "strength": 4,
      "influence": 0,
      "villainyRank": 4,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    },
    {
      "id": "s7_npc_zaltko_karyevskov",
      "name": "Zaltko Karyevskov",
      "category": "npc",
      "type": "PNG / Eroe Alleato",
      "archetype": "Eroi Ingannatori",
      "nation": "Ussura",
      "strength": 3,
      "influence": 0,
      "villainyRank": 3,
      "hp": 20,
      "size": "Media",
      "_lazyHero": true
    }
  ]
};


    // 40 Eroi & PNG Ufficiali da 'Eroi e Malvagi' (Pregenerati per Scheda PG)
    window.SEVENTH_SEA_DATA.heroes = window.SEVENTH_SEA_DATA.antagonists.filter(a => a.category === 'npc');


// Database Società Segrete Ufficiali (7th Sea 2ª Edizione)
const secretSocietiesDb = [
  {
    id: "fratellanza_costa",
    name: "La Fratellanza della Costa",
    icon: "🏴‍☠️",
    headquarters: "Mari di Théah • Nave Ammiraglia Dama Roja (Regina Bonaventura)",
    motto: "Libertà sui mari e fedeltà assoluta alla Carta dei Primi Capitani",
    summary: "Una coalizione di corsari e pirati indipendenti che rifiuta l'autorità dei tiranni e saccheggia le ricchezze dei nobili, condividendo bottino, provviste e decisioni in modo rigorosamente egualitario.",
    lore: "In termini di organizzazione, la Fratellanza è un paradosso. Da una parte il suo credo celebra la libertà assoluta, dall'altra i membri sono vincolati al rispetto di una Carta che nessuno oserebbe violare. I marinai che incontrano un vascello battente i colori del gruppo sanno che non verrà fatto loro alcun male se si arrendono senza combattere. Chi non getta le armi affronterà alcuni degli equipaggi più esperti che abbiano mai solcato i mari.",
    creedTitle: "La Carta della Fratellanza (10 Articoli Ufficiali)",
    creedText: `1. Ogni uomo ha diritto a un voto in tutte le questioni ed eguale diritto a provviste e liquore, da usare a propria discrezione, salvo razionamento deliberato a maggioranza.
2. Ogni uomo dovrà presentarsi secondo i turni e le disponibilità per il servizio a bordo.
3. Chiunque imbrogli la Fratellanza per un valore pari o superiore a un Guilder di bottino sarà abbandonato per punizione su un'isola deserta.
4. Nessuno deve giocare a carte o dadi per soldi.
5. Tutte le anime a bordo di una nave catturata dovranno essere liberate affinché possano decidere, a mezzo voto, quale rotta seguire dopo che il loro vascello è stato depredato.
6. A nessun membro di un equipaggio sarà fatto del male in caso di resa senza resistenza.
7. Ogni uomo deve tenere in ordine e pulita l'artiglieria, la propria pistola e la propria spada.
8. Disertare la nave o il posto di battaglia è punito con l'abbandono su un'isola deserta.
9. A bordo non sono ammessi scontri fisici; ogni duello dovrà essere risolto a terra, con la spada o la pistola.
10. Chi perde un arto al servizio della Fratellanza riceve un indennizzo: 600 Guilder per un braccio o l'invalidità, 500 Guilder per una mano, 100 Guilder per un occhio o un dito.`,
    gains: [
      { name: "Informazioni di interesse", amount: 2, desc: "Fornire informazioni non pubbliche ma non gelosamente custodite utili alla Fratellanza." },
      { name: "Assistere un Agente", amount: 4, desc: "Salvare un corsaro o assisterlo nel completamento di una missione sui mari." },
      { name: "Segreto di interesse", amount: 6, desc: "Consegnare segreti custoditi gelosamente (es. rotte riservate, scorte della marina reale)." },
      { name: "Soffiata su Ricco Bottino", amount: 3, bonus: "+1 Ricchezza", desc: "Informazioni che conducono una nave della Fratellanza a una ricca preda (+1 Favore bonus, tot. 3) e 1 punto Ricchezza prelevato dalle spoglie." },
      { name: "Catturare una Preda", amount: 4, bonus: "+2 Ricchezza", desc: "Aiutare attivamente un Agente a catturare una nave o un bottino di grande valore: concede due parti di bottino (Ricchezza 2+) oltre al normale Favore." }
    ],
    spends: [
      { name: "Informazioni Marittime", cost: 1, desc: "Essere messi a conoscenza di informazioni ordinarie in possesso della Fratellanza." },
      { name: "Protezione / Aiuto Agente Corsaro", cost: 3, desc: "Un abile Agente corsaro (Forza 6: lancia 6 dadi e subisce 6 ferite prima di una FD) protegge l'Eroe o lo assiste in missione." },
      { name: "Contrabbandare Oggetto o Persona", cost: 4, desc: "Far passare un oggetto o fuggire una persona oltre un blocco navale o una sorveglianza militare sino al primo porto sicuro." },
      { name: "Segreto Riservato", cost: 5, desc: "Ottenere un segreto ben custodito dalla rete della Fratellanza." },
      { name: "Blocco Navale della Fratellanza", cost: 7, desc: "La flotta della Fratellanza pattuglia e blocca un tratto di mare per circa una settimana, rendendo il transito nemico quasi impossibile." }
    ]
  },
  {
    id: "kreuzritter",
    name: "Die Kreuzritter",
    icon: "⚔️",
    headquarters: "Eisen • Stern (presso la Foresta della Wälder)",
    motto: "Una stella bianca di speranza nell'oscurità della Wälder",
    summary: "Cavalieri veterani di Eisen che operano nell'ombra per dare la caccia agli orrori sovrannaturali, proteggere gli innocenti dai mostri e custodire i segreti del leggendario metallo Dracheneisen.",
    lore: "Nati oltre 500 anni fa per difendere Eisen dalle aberrazioni della Wälder, furono inviati verso sud con l'inganno da un leader traditore per permettere all'Inquisizione di prendere il potere a Stern. Marchiati ingiustamente come eretici, decisero di svanire nelle ombre. Consapevoli che là fuori esistono mostri reali oltre ogni immaginazione, giurarono di non farsi mai più strumentalizzare da politici o religiosi, brillando come una stella di speranza nell'oscurità.",
    creedTitle: "Regole Speciali del Dracheneisen",
    creedText: `• Proprietà del Metallo: Il Dracheneisen è il metallo più raro di Théah, indistruttibile, forgia armi che tagliano la pietra con la stessa facilità con cui l'acciaio fende il legno.
• Rilevamento Mostri: La lama brilla di luce bianca pura se un Mostro si avvicina entro 9 metri.
• Soppressione Pericolo: Se brandito con determinazione contro un Mostro, quest'ultimo deve spendere 2 Punti Pericolo per ottenere i benefici di 1 solo Punto Pericolo.
• Danno Letale contro il Sovrannaturale: Le armi in Dracheneisen infliggono 1 Ferita aggiuntiva a qualsiasi bersaglio dotato del Vantaggio Stregoneria o di una Qualità Mostruosa.
• Politica Rigorosa dell'Ordine: Nessun Eroe può iniziare con il Dracheneisen. Chi ne trova uno nel gioco scoprirà che l'Ordine lo cercherà; solo i cavalieri Kreuzritter possono impugnarlo.`,
    gains: [
      { name: "Informazioni su Mostri / Maledizioni", amount: 2, desc: "Fornire dettagli non pubblici ma non gelosamente custoditi su creature della notte o culti." },
      { name: "Assistere un Crociato", amount: 4, desc: "Soccorrere un cavaliere Kreuzritter o aiutarlo in una caccia a un mostro." },
      { name: "Segreto Sovrannaturale", amount: 6, desc: "Rivelare un segreto gelosamente custodito (es. vera identità di un negromante o punto debole unico di un abominio)." },
      { name: "Eliminazione Mostro o Mago Oscuro", amount: 4, desc: "Fornire informazioni che portano all'eliminazione confermata di un mostro, alla sconfitta di uno stregone o alla distruzione di un artefatto (+2 Favore aggiuntivi, tot. 4)." },
      { name: "Recupero di Dracheneisen", amount: 10, desc: "Consegnare all'Ordine un lingotto, reperto o lama di autentico Dracheneisen strappato all'oblio o a collezioni profane." }
    ],
    spends: [
      { name: "Informazioni Occulte", cost: 1, desc: "Accedere agli archivi dell'Ordine per scoprire punti deboli, anatomia o folklore di un Mostro." },
      { name: "Assistenza di un Cavaliere Crociato", cost: 3, desc: "Un agente Kreuzritter (Forza 6: lancia 6 dadi e subisce 6 ferite per FD) affianca l'Eroe in combattimento." },
      { name: "Accesso al Reliquiario (Dracheneisen)", cost: 4, desc: "L'Ordine concede in prestito per una singola missione (alcune Scene, mai oltre 1 Episodio) un'arma in Dracheneisen o un artefatto protetto. Trattenerla oltre fa scattare l'accusa di tradimento." },
      { name: "Segreto su Magie Oscure", cost: 5, desc: "Rivelazione di una verità pericolosa sulle cospirazioni mostruose a Théah." },
      { name: "Ubicazione di un'Arma in Dracheneisen", cost: 9, desc: "L'Ordine rivela dove giace un'arma in Dracheneisen e assiste l'Eroe aprendo la Storia speciale 'Cercatore di Dracheneisen' (10+ Atti). Una volta completata, l'arma resta all'Eroe finché è membro." }
    ]
  },
  {
    id: "esploratori",
    name: "La Società degli Esploratori",
    icon: "🧭",
    headquarters: "Castille • Lisso (Odiseo) • Sedi a Montaigne, Vendel, Freiburg",
    motto: "Conoscere il passato per migliorare il futuro",
    summary: "Archeologi, cartografi e studiosi che riportano alla luce le rovine Syrneth e Numanari, catalogano artefatti e mappe proteggendoli dai tombaroli e dall'Inquisizione.",
    lore: "Fondata nel 1598 dalla studiosa castilliana Leandra Souza per fermare i tombaroli mercenari, la Società ha catalogato oltre 500 artefatti Syrneth e possiede la più grande raccolta di mappe al mondo. Nonostante la simpatia popolare e l'emblema della bussola d'argento, il Terzo Profeta decretò che indagare le rovine Syrneth corrompe l'anima: la Chiesa Vaticina li persegue come eretici, costringendoli a operare in segretezza tra le rovine di Théah, Ifri e del Nuovo Mondo.",
    creedTitle: "Statuto dell'Esploratore",
    creedText: `• Protezione del Passato: Gli artefatti Syrneth e Numanari devono essere catalogati, compresi e conservati, mai svenduti a nobili oziosi o distrutti per paura superstiziosa.
• Asilo tra Confratelli: Ogni membro è tenuto a dare ospitalità e asilo a qualsiasi collega in fuga dagli agenti dell'Inquisizione.
• Rigore Scientifico: La conoscenza archeologica appartiene a tutta l'umanità per costruire un futuro migliore.`,
    gains: [
      { name: "Mappe o Dati Geografici", amount: 2, desc: "Consegnare mappe inedite, rotte o appunti di viaggio." },
      { name: "Assistere un Ricercatore", amount: 4, desc: "Proteggere un archeologo durante una spedizione o salvarlo da tombaroli." },
      { name: "Consegna di Reliquia o Artefatto", amount: 4, desc: "Consegnare alla Società una reliquia o manufatto Syrneth/Numanari per lo studio (dalle note storiche a frammenti antichi)." },
      { name: "Scoperta di Rovine Syrneth o Numa", amount: 5, desc: "Individuare un nuovo sito archeologico o complesso di rovine inviolate e notificarne le coordinate alla Società." },
      { name: "Segreto Archeologico Maggiore", amount: 6, desc: "Consegnare un segreto gelosamente custodito sulle tecnologie Syrneth o la Vecchia Repubblica." }
    ],
    spends: [
      { name: "Consultazione Mappe & Archivi", cost: 1, desc: "Accedere alla sterminata cartografia o alle schede di scavo della Società." },
      { name: "Accesso a uno Scavo della Società", cost: 2, desc: "Permesso ufficiale di esplorare un sito archeologico attivo protetto (senza diritto di asportare reperti)." },
      { name: "Accesso al Reliquiario degli Esploratori", cost: 3, desc: "La Società affida all'Agente un artefatto Syrneth o reperto per la missione (funziona come il Vantaggio Oggetto Distintivo, da restituire a missione compiuta)." },
      { name: "Scorta di Ricercatori Armati", cost: 3, desc: "Un Agente veterano (Forza 6: 6 dadi e 6 ferite per FD) con equipaggiamento da spedizione affianca l'Eroe." },
      { name: "Segreto Proibito sui Syrneth", cost: 5, desc: "Ottenere un segreto di prima grandezza sui misteri sepolti delle antiche razze." }
    ]
  },
  {
    id: "accademia_invisibile",
    name: "L'Accademia Invisibile",
    icon: "🔬",
    headquarters: "Clandestina in tutta Théah (Ex-Università Vaticine)",
    motto: "La verità della scienza oltre il rogo dell'Inquisizione",
    summary: "Una rete segreta di scienziati, fisici e inventori che portano avanti la sperimentazione scientifica e tecnologica sfuggendo ai roghi dell'Alto Inquisitore Verdugo.",
    lore: "Quando l'Alto Inquisitore Esteban Verdugo bandì la ricerca scientifica proclamando che 'è il momento di prepararsi per il prossimo mondo, non di indagare su questo' e mandò sul rogo i docenti universitari, gli studiosi non si arresero. Sotto il nome di Accademia Invisibile hanno tessuto una rete impenetrabile: ogni accademico ne conosce solo altri due per pseudonimo, scambiandosi formule in codici crittografici mai violati.",
    creedTitle: "Principi dell'Accademia",
    creedText: `• Compartimentazione Rigorosa: Nessun membro deve conoscere l'identità di più di due colleghi per evitare che la cattura comprometta la rete.
• Crittografia Assoluta: Tutti i trattati, formule e appunti devono essere trascritti con codici segreti polialfabetici.
• Eredità di Theus: La natura e la scienza sono gli enigmi lasciati da Theus all'intelletto umano, ed esplorarli è il massimo dovere dello studioso.`,
    gains: [
      { name: "Dati Tecnici o Materiali Chimici", amount: 2, desc: "Fornire reagenti rari, strumenti ottici o calcoli scientifici." },
      { name: "Info / Segreti sull'Inquisizione", amount: 3, desc: "Fornire qualsiasi notizia o segreto legato ai movimenti dell'Alto Inquisitore Verdugo o dei suoi sgherri (+1 Favore bonus, tot. 3)." },
      { name: "Salvataggio di uno Scienziato", amount: 4, desc: "Far evadere o nascondere un membro dell'Accademia ricercato dai fanatici." },
      { name: "Salvataggio di una Scoperta Scientifica", amount: 6, desc: "Recuperare e condividere con l'Accademia una grande scoperta, invenzione o trattato salvato dal rogo." }
    ],
    spends: [
      { name: "Recapito Messaggio Cifrato", cost: 1, desc: "Far giungere un messaggio cifrato o un piccolo pacco ovunque a Théah passandolo di mano in mano nella rete segreta." },
      { name: "Dati Tecnici & Consulenza Scientifica", cost: 1, desc: "Accedere a deduzioni fisiche, chimiche o balistiche per risolvere un ostacolo pratico." },
      { name: "Assistenza di un Ingegnere Clandestino", cost: 3, desc: "Un Agente esperto di congegni e miscele (Forza 6: 6 dadi e 6 ferite per FD) assiste l'Eroe." },
      { name: "Segreto Scientifico Pericoloso", cost: 5, desc: "Ricevere formule avanzate: una nuova polvere pirica, la ricetta di un veleno e del suo antidoto, o le coordinate di archivi segreti proibiti." }
    ]
  },
  {
    id: "rosa_croce",
    name: "I Cavalieri della Rosa e della Croce",
    icon: "🌹",
    headquarters: "Montaigne • Crieux • Capitoli aperti in tutte le Corti di Théah",
    motto: "Come i malvagi non si fermeranno davanti a nulla per fare il male, così i giusti non dovrebbero mai trattenersi dal fare ciò che è giusto",
    summary: "Il più celebre e rispettato ordine di gentiluomini e cavalieri erranti del continente, votati a proteggere gli indifesi, riparare i torti e sfidare la tirannia alla luce del sole.",
    lore: "A differenza delle altre società, i Rosa e Croce operano apertamente. Fondati sui precetti di Rosenkreuz, i loro capitoli sono aperti a chiunque voglia chiedere giustizia. Guidati dal carismatico Aristide Baveaux, contano persino cinque cavalieri nella guardia personale dell'Empereur. Per diventare veri Cavalieri occorrono tre anni di durissimo servizio e missioni temerarie; i nobili facoltosi possono diventare 'Benefattori', finanziando la causa.",
    creedTitle: "Il Codice Cavalleresco di Rosenkreuz",
    creedText: `• Proteggere chi non può difendersi: La spada del cavaliere si sguaina solo per difendere gli orfani, le vedove e i deboli dai prepotenti.
• Generosità e Spirito di Sacrificio: Non tirarsi mai indietro dinanzi a un atto di valore o a una nobile causa, anche a costo della vita.
• Onore e Cortesia: Rispettare la parola data, non mentire mai slealmente e fungere da modello morale per ogni cittadino di Théah.`,
    gains: [
      { name: "Notizie sulle Corti o Torti Subiti", amount: 2, desc: "Segnalare ingiustizie, abusi feudali o intrighi di nobili crudeli." },
      { name: "Reclutare un Benefattore", amount: 4, desc: "Convincere un aristocratico ricco e responsabile a supportare finanziariamente l'Ordine." },
      { name: "Soccorrere un Cavaliere in Duello", amount: 4, desc: "Salvare o scortare un cavaliere dell'Ordine impegnato in una missione temeraria." },
      { name: "Segreto su un Malvagio d'Alto Rango", amount: 6, desc: "Consegnare le prove irrefutabili delle nefandezze di un tiranno nobiliare." },
      { name: "Compiere un'Impresa Cavalleresca", amount: 0, bonus: "Pari agli Atti", desc: "Portare a termine una Storia dell'Eroe affidata dall'Ordine: fornisce Punti Favore pari al numero di Atti della Storia oltre alle ricompense ordinarie." }
    ],
    spends: [
      { name: "Aiuto Finanziario da un Benefattore", cost: 1, desc: "Ottenere fondi e ospitalità di classe da un ricco mecenate dell'Ordine (somme oltre Ricchezza 5 richiedono di sdebitarsi)." },
      { name: "Informazioni sulla Nobiltà", cost: 1, desc: "Accedere ai registri araldici e ai gossip d'onore delle Corti europee." },
      { name: "Scorta di un Cavaliere Guardiano", cost: 3, desc: "Un valoroso Cavaliere della Rosa e della Croce (Forza 6: 6 dadi e 6 ferite per FD) combatte al fianco dell'Eroe." },
      { name: "Segreto d'Onore di Stato", cost: 5, desc: "Ottenere un segreto cruciale su una delle famiglie regnanti di Théah." }
    ]
  },
  {
    id: "vagabundos",
    name: "Los Vagabundos",
    icon: "🎭",
    headquarters: "Castille (operativi nelle Corti di tutta Théah)",
    motto: "Proteggine uno e ne proteggerai mille",
    summary: "Vigilanti mascherati e spie clandestine dedite a proteggere i monarchi illuminati, smascherare i tiranni corrotti e fare giustizia al di là della legge.",
    lore: "Nati a Castille per proteggere il giovanissimo Re da consiglieri traditori, la loro leggenda è esplosa ovunque: sventato un attentato alla Regina Elaine di Avalon, salvato lo Jarl Balderson a Vesten. La loro filosofia è semplice: 'se un eroe indossa la corona il popolo prospera, se la indossa un malvagio il popolo soffre'. I Los Vagabundos proteggono i re giusti e detronizzano quelli malvagi. Non tutti indossano la maschera: molti sono spie, ma solo a 5 eletti è concesso portare una delle 5 vere Maschere purpuree.",
    creedTitle: "Il Giuramento della Maschera",
    creedText: `• Proteggere le Buone Corone: Vigilare sulla vita dei sovrani saggi e abbattere i despoti sanguinari che calpestano il popolo.
• La Legge dei Vigilanti: La vera giustizia supera la legge scritta dei potenti; rubare a un usurpatore per salvare gli affamati è un atto virtuoso.
• Il Mistero di El Vagabundo: El Vagabundo non è un solo uomo, è un'idea viva. Chi indossa la Maschera sacrifica se stesso per incarnare la leggenda.`,
    gains: [
      { name: "Spie e Movimenti di Corte", amount: 2, desc: "Fornire informazioni sui movimenti di guardie, sicari o cospiratori." },
      { name: "Assistere un Agente Mascherato", amount: 4, desc: "Fornire copertura o via di fuga a un affiliato dei Los Vagabundos." },
      { name: "Sventare Cospirazione di Corte", amount: 6, desc: "Svelare un complotto segreto contro un monarca o ministro legittimo." },
      { name: "Salvare un Nobiluomo Eroico", amount: 8, desc: "Salvare la vita a un regnante, duca o nobiluomo giusto ed eroico minacciato di morte." },
      { name: "Sconfiggere un Nobiluomo Malvagio", amount: 8, desc: "Rovesciare, neutralizzare o costringere alla fuga un tiranno o aristocratico crudele e corrotto." }
    ],
    spends: [
      { name: "Informazioni di Intelligence", cost: 1, desc: "Ottenere dettagli su passaggi segreti, guardie del corpo e abitudini di un palazzo nobiliare." },
      { name: "Aiuto di un Agente Solitario (Forza 8)", cost: 3, desc: "I Los Vagabundos operano da soli e sono eccezionalmente abili: il loro Agente ha Forza +2 rispetto al normale (Forza 8: 8 dadi e 8 ferite per FD!)." },
      { name: "Segreto sui Sovrani di Théah", cost: 5, desc: "Ottenere un segreto decisivo su alleanze, testamenti o crimini di una Corona." },
      { name: "Indossare la Maschera di El Vagabundo", cost: 10, desc: "L'Eroe indossa per una Scena la leggendaria Maschera: ottiene +1 Grado in TUTTI i Tratti e in TUTTE le Abilità! Mentre la indossa incarna la leggenda: non può attivare la Virtù né prendere PE da Hubris/Peculiarità (ma può riceverne da dadi non spesi dal GM)." }
    ]
  },
  {
    id: "mociutes_skara",
    name: "Močiutės Skara (Lo Scialle della Nonna)",
    icon: "🧶",
    headquarters: "Confederazione Sarmatiana & Ussura (ovunque vi sia dolore)",
    motto: "Soccorrere chi soffre, lenire le ferite della guerra e fermare le armi",
    summary: "Un movimento umanitario spontaneo e coraggioso che accorre nei teatri di guerra e calamità per portare cibo, cure e coperte a chiunque ne abbia bisogno, operando per fermare i massacri.",
    lore: "Nato durante la Guerra della Croce quando donne curoniane attraversarono il confine con Ussura per sfamare orfani e vedove, oggi è una forza transnazionale senza gerarchie. I suoi membri corrono verso le fiamme per salvare vite, non per combattere. Panettieri, cerusici, madri e contadini curano chiunque senza guardare la divisa. Negli ultimi anni, agenti eroici dello Scialle usano diplomazia, sabotaggi e ricatti per impedire sul nascere nuove guerre devastatrici.",
    creedTitle: "Il Credo dello Scialle",
    creedText: `• Compassione Universale: Nessuna bandiera, nazione o religione giustifica il rifiuto del soccorso a un ferito o a un affamato.
• Fermare le Armi prima del Massacro: L'azione migliore è prevenire la guerra prima che centinaia di giovani siano mandati al macello.
• Rete di Rispetto e Fratellanza: Tutte le Società Segrete di Théah rispettano lo Scialle e aprono loro le porte per la loro purezza d'intenti.`,
    gains: [
      { name: "Notizie su Epidemie o Conflitti", amount: 2, desc: "Segnalare villaggi isolati, carestie o movimenti di truppe mercenarie." },
      { name: "Scortare un Convoglio Umanitario", amount: 4, desc: "Difendere carovane di medicinali, farina e coperte da predoni e banditi." },
      { name: "Cibo e Cure a una Comunità", amount: 5, desc: "Portare acqua potabile, rifornimenti e assistenza medica a un villaggio o quartiere devastato." },
      { name: "Segreto Bellico Cruciale", amount: 6, desc: "Rivelare i piani d'invasione segreti di un generale guerrafondaio." },
      { name: "Impedire a un Esercito di Combattere", amount: 10, desc: "Fermare una battaglia imminente con qualsiasi mezzo: negoziando una tregua, rubando le provviste o neutralizzando il comandante." }
    ],
    spends: [
      { name: "Cure Mediche da Campo", cost: 1, desc: "I cerusici e le guaritrici dello Scialle curano le ferite e leniscono traumi dell'Eroe e dei suoi amici." },
      { name: "Rete Universale: Informazioni Inter-Società", cost: 1, desc: "Grazie al rispetto unanime di cui gode, lo Scialle può richiedere informazioni ordinarie a QUALSIASI altra Società Segreta di Théah!" },
      { name: "Rete Universale: Assistenza di un Agente Alleato", cost: 3, desc: "Chiedere l'intervento di un Agente protettore (Forza 6) attinto dalla rete di supporto di qualsiasi Società amica." },
      { name: "Rete Universale: Segreto Inter-Società", cost: 5, desc: "Ottenere un segreto protetto rivolgendosi ai contatti diplomatici dello Scialle presso altre organizzazioni." }
    ]
  },
  {
    id: "liberatori",
    name: "I Liberatori (Liberi Pensatori)",
    icon: "💧",
    headquarters: "Clandestina in tutta Théah (Organizzata in Mani di 5)",
    motto: "Niente Dei, Niente Re — La goccia scava la roccia",
    summary: "Una rete anarchica e clandestina senza capi che combatte le Due Grandi Tirannie (Monarchia e Chiesa) tramite la guerra mimesica, la satira sferzante, l'autodeterminazione e la propaganda.",
    lore: "Fondata sul diario del misterioso Uppman, l'organizzazione vede la monarchia e la religione come catene create per soggiogare la mente umana. La loro guerra è 'mimesica': non serve uccidere un re se l'idea del trono sopravvive; occorre distruggere l'idea stessa del re nel cuore del popolo. Organizzati in cellule indipendenti di 5 membri chiamate 'Mani', sostituiscono messali sacri con testi comici, liberano debitori dalle carceri e ridicolizzano i governanti coprendoli di pece e piume.",
    creedTitle: "Il Codice di Uppman & Il Codice del Cappotto",
    creedText: `• I Cinque Precetti del Codice:
1. L'omicidio è il furto del più grande dei doni e lo strumento con cui i malvagi mantengono l'ordine.
2. Metti tutto in discussione, anche te stesso.
3. Nessun uomo, donna o bambino dovrebbe mai desiderare.
4. Distruggi il Potere attraverso le sue parole, atti e paure.
5. Non incontrarsi mai in più di cinque (la Mano).
• Il Codice del Cappotto (Saluto Cifrato):
A tende la mano sinistra aperta con le dita allargate; se B risponde, stringono la mano:
A: "Bel cappotto." — B: "Me lo ha dato Uppman." — A: "Potrebbe stare bene anche a me." — B: "Sta bene a tutta la mia famiglia." — A: "Allora sono fortunato ad essere tuo fratello."`,
    gains: [
      { name: "Diffondere Propaganda / Fogli Satirici", amount: 2, desc: "Affiggere manifesti, diffondere canzonature o smascherare ipocrisie di governanti." },
      { name: "Contrastare un Malvagio della Chiesa", amount: 4, desc: "Neutralizzare o svergognare pubblicamente un prelato corrotto o fanatico inquisitore." },
      { name: "Assistere una Mano Clandestina", amount: 4, desc: "Aiutare una cellula di Liberatori a fuggire da una retata della milizia." },
      { name: "Detronizzare o Cacciare un Nobile", amount: 6, desc: "Far cacciare un nobile tiranno dal suo seggio coperto di pece e piume o farlo arrestare." },
      { name: "Segreto Cospirativo di Stato", amount: 6, desc: "Rivelare i piani segreti della nobiltà per affamare il popolo o imporre balzelli." }
    ],
    spends: [
      { name: "Informazioni sulla Sicurezza Cittadina", cost: 1, desc: "Ottenere piante di carceri, turni delle guardie e covi sicuri tra i popolani." },
      { name: "Nominare un 'Amico di Uppman'", cost: 2, desc: "Un individuo ottiene protezione speciale e immunità da azioni punitive dei Liberatori (costa 6 Favore se nobile o ecclesiastico; se tradisce, si perde tutto il Favore)." },
      { name: "Radunare una Squadra di Sgherri (Forza 10)", cost: 3, desc: "Raduna una folla armata di popolani, fabbri e falegnami con Forza 10 per un obiettivo chiaro (es. 'assalite il palazzo!'). Per ogni 3 Favore extra spesi, la Forza aumenta di +10!" },
      { name: "Assistenza di un Agente Sabotatore", cost: 3, desc: "Un Libero Pensatore maestro di travestimenti e sosia (Forza 6: 6 dadi e 6 ferite per FD) affianca l'Eroe." },
      { name: "Segreto Sovversivo", cost: 5, desc: "Ricevere documenti compromettenti capaci di distruggere per sempre la reputazione di un'autorità." }
    ]
  },
  {
    id: "figlie_sofia",
    name: "Le Figlie di Sofia",
    icon: "🦉",
    headquarters: "Vodacce (Palazzo Villanova) • Rifugi sicuri all'estero",
    motto: "Libertà per le Streghe del Fato e fine della tirannia dei Principi Mercanti",
    summary: "Un'audace cospirazione femminile nata nei palazzi di Vodacce per proteggere e far fuggire le Streghe della Sorte, spezzare il giogo dei Principi Mercanti e promuovere il sapere.",
    lore: "Nate dall'incredibile alleanza segreta tra Valentina Villanova (la moglie del Principe) e Juliette (la sua amante cortigiana), le Figlie di Sofia sono cresciute come una rete segreta transnazionale. Finanziano circoli di lettura clandestini per donne, organizzano tratte di fuga verso la libertà per le giovani Streghe della Sorte e forniscono scorte invisibili agli alleati. Quasi tutti i membri sono donne, determinate a far crollare il crudele patriarcato dei Principi.",
    creedTitle: "Il Mandato di Sofia",
    creedText: `• Salvezza delle Streghe del Fato: Nessuna ragazza deve essere considerata una proprietà o una schiava a causa dei suoi occhi magici.
• Sovvertimento dei Principi: Minare la ricchezza e l'arroganza dei Principi Mercanti, mettendoli l'uno contro l'altro.
• Diffusione del Sapere: La cultura e la libertà di pensiero sono armi irresistibili contro la tirannia domestica e feudale.`,
    gains: [
      { name: "Spionaggio nei Palazzi di Vodacce", amount: 2, desc: "Fornire indiscrezioni sulle cortigiane, sui contratti o sulle feste dei Principi." },
      { name: "Proteggere un Circolo di Lettura", amount: 4, desc: "Difendere o finanziare una scuola clandestina o biblioteca segreta femminile." },
      { name: "Assistere un'Agente all'Estero", amount: 4, desc: "Fornire rifugio a una fuggitiva vodacce o a una spia dell'organizzazione." },
      { name: "Minare i Piani di un Principe Mercante", amount: 6, desc: "Sventare un matrimonio forzato, far fallire un monopolio commerciale o aizzare due Principi l'uno contro l'altro." },
      { name: "Far Fuggire una Strega del Fato", amount: 10, desc: "Far evadere una Strega della Sorte dai palazzi di Vodacce e condurla oltre il confine in un rifugio sicuro." }
    ],
    spends: [
      { name: "Pettegolezzi e Intrighi di Corte", cost: 1, desc: "Ottenere informazioni scottanti sui vizi, amanti e debiti dei nobili vodacce." },
      { name: "Nominare un 'Amico di Sofia'", cost: 2, desc: "Garantisce protezione e soccorso dalle Figlie di Sofia (costa 6 Favore se nobile o ecclesiastico)." },
      { name: "Assistenza di una Strega del Fato", cost: 3, desc: "Una Strega affiliata assiste l'Eroe: ha Forza 6 (6 dadi, 6 ferite per FD), possiede Stregoneria (Sorte) e lancia +2 dadi bonus in tutti i Rischi sociali relativi alla politica di Vodacce!" },
      { name: "Scorta di una Cortigiana Spia", cost: 3, desc: "Un'abile Agente sotto copertura (Forza 6) scorta e difende l'Eroe." },
      { name: "Segreto Inconfessabile di un Principe", cost: 5, desc: "Ottenere un ricatto letale capace di piegare la volontà di un Principe Mercante." }
    ]
  },
  {
    id: "novus_ordo_mundi",
    name: "Novus Ordo Mundi (I Sette Seggi)",
    icon: "👁️",
    headquarters: "Ombre di Théah • Esclusivo per il Game Master (Malvagi)",
    motto: "Controllare il fato del mondo attraverso il velo dell'invisibilità",
    summary: "Cabala segreta composta da esattamente sette geni criminali e diabolici Malvagi che manipolano le Nazioni attraverso intermediari, guerre e assassinii. NON accessibile agli Eroi.",
    lore: "Nato ai tempi della Vecchia Repubblica da sette senatori corrotti che manipolavano imperatori fantoccio, il Novus Ordo Mundi non accetta Eroi. Vi sono solo 7 membri e l'unico modo per occupare un Seggio è assassinare a sangue freddo il predecessore (atto che trasforma istantaneamente in un Malvagio). Operano tramite molteplici gradi di intermediari e mercenari per non sporcarsi le mani, eliminando senza pietà chiunque si avvicini al loro segreto.",
    creedTitle: "La Regola dei Sette Seggi (Solo GM)",
    creedText: `• Inaccessibilità: Nessun Eroe può appartenere a questo Ordine in nessuna circostanza.
• Metodi Nefandi: Se un Seggio decide un'azione individuale deve ripagare l'Ordine con un interesse del 10%. Chi tradisce il segreto viene trucidato dai sicari dei restanti Seggi.`,
    gmOnly: true,
    gains: [],
    spends: []
  }
];
window.SEVENTH_SEA_DATA.secret_societies = secretSocietiesDb;
