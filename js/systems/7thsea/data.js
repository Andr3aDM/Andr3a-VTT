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
      "id": "s7_villain_duelist",
      "name": "Duellante Rivale della Gilda (Malvagio)",
      "type": "Malvagio (Villain)",
      "strength": 10,
      "influence": 2,
      "villainyRank": 12,
      "hp": 20,
      "ac": 15,
      "size": "Media",
      "ability": "Maestro di Scherma: Tira 12d10 nei Rischi Marziali. Può usare tutte le manovre base della Gilda dei Duellanti.",
      "traits": "Vigore 4, Grazia 5, Ingegno 4, Risolutezza 3, Coraggio 4"
    },
    {
      "id": "s7_villain_inquisitor",
      "name": "Alto Inquisitore del Vaticinio (Malvagio)",
      "type": "Malvagio (Villain)",
      "strength": 12,
      "influence": 5,
      "villainyRank": 17,
      "hp": 20,
      "ac": 16,
      "size": "Media",
      "ability": "Terrore Sacro: Spende 1 Punto Pericolo per annullare un Vantaggio di un Eroe per l intero round.",
      "traits": "Vigore 3, Grazia 4, Ingegno 5, Risolutezza 5, Coraggio 5"
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
        "nation": "Eisen",
        "strength": 8,
        "influence": 2,
        "villainyRank": 10,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Non Morirò Qui; Riflessi Rapidi: Mischia; Solo  Contro Tutti • Virtù: Il Mago Determinato. Il Malvagio deve indicare un Eroe  presente quando attiva questa Virtù. Fino alla fine  della Scena, l’Eroe non può spendere Punti Eroe, ma il  Malvagio non potrà spendere Punti Pericolo. • Superbia: I Troni Testardo. Il Malvagio riceve un Punto Pericolo quando si  rifiuta caparbiamente di cambiare idea dinanzi ai fatti.",
        "ability": "Qualità Mostruose: Sebbene Austyn sia ancora umano, l’Orrore ha infuso  in lui parte del proprio potere. Quando si trova in  presenza dell’Orrore, ottiene le Qualità Possente e  Rigenerante.\n\nServitori & Sottoposti: I sottoposti di Austyn sono esclusivamente Mostri.  Ha ai suoi ordini numerosi Sgherri Non Morti. Inoltre,  i boschi sono pattugliati da branchi di feroci cani  rabbiosi guidati da un enorme capobranco. La maggior  parte dei cani è insignificante, ma il capobranco è un  Mostro con Forza 6 e le Qualità Inarrestabile, Rapido e  Terrificante. Infine, la figlia di Austyn, Suse, è posseduta  da un Orrore, le cui capacità sono ignote.",
        "notes": "«Eisen è perduta, morta, finita! Solo  abbandonandoci alla morte potremo ridarle  vita. Il mio padrone sarà il primo dei nostri  nuovi dei, un re giunto dall’oltretomba!»\nArchetipo: Malvagi Belva\n\n📖 Storia:\nAustyn era l'ultimo di una lunga stirpe di cacciatori \ndi mostri, ciascuno più dedito al proprio compito del \nsuo predecessore. Sua nonna, la donna più dura che \nabbia mai conosciuto, lo addestrò sin da bambino a \ncombattere ogni tipo di atrocità. Era in grado di rica-\nricare una balestra più velocemente di chiunque altro \ne maneggiava un'enorme ascia con la stessa facilità con \ncui altri guerrieri avrebbero usato una posata.\nAustyn fu una naturale recluta per i Kreuzritter ma, \nnonostante il suo impressionante pedigree di cacciatore, \nla battaglia non gli dava alcuna soddisfazione. Alla fine \ndell'addestramento, la nonna morì nel corso del loro \nprimo grosso scontro con alcuni ghoul. Austyn soprav-\nvisse, ma non fu più lo stesso, diventando taciturno e \nriservato. Da una breve storia d'amore con un'altra \nagente dei Kreuzritter ebbe una figlia, Susanne detta  \n“Suse” , che rimase con lui dopo che la madre venne \ncatturata dall' Inquisizione. Austyn combatteva per \ndovere e Suse era la sua unica gioia.\nStanco di cacciare mostri e desideroso di passare più \ntempo con la figlia, Austyn andò in pensione molto \npresto. Una notte, dopo una terribile tempesta, trovò \nla figlia in piedi davanti a una finestra rotta che fissava \nle tenebre. Quando le chiese cosa fosse accaduto, Suse si \nvoltò e dopo aver risposto: “V a tutto bene, padre.” andò \na letto e si addormentò. Austyn la svegliò per farle altre \ndomande e ispezionò la casa da cima a fondo, ma tutto \nsembrava a posto, proprio come gli era stato detto.\nQuando Suse cominciò a suggerirgli modi contorti \nper passare il tempo, non gli venne neppure in mente di \ndiscutere. La voce della giovane era diventata più oscura, \ni pensieri distorti, i movimenti incoerenti, ma quando il \npadre la guardava vedeva solo la sua bellissima bambina.\nUna settimana dopo, Austyn uccise tutti i vicini, \neliminando chiunque vivesse in prossimità della loro \nbaita nei boschi. Trascinò i corpi nel suo cortile e, \nall'alba, erano tutti ridotti a una pila di ceneri fumanti. \nSuse, che nel frattempo si era ammalata, disse che \nquesto l'aveva fatta stare meglio e sperava che suo padre \nuccidesse ancora. I morti la facevano sorridere.\nLe cose andarono di male in peggio. Austyn si allontanò \nrapidamente dai suoi vecchi commilitoni, tranne dalla sua \ncollega Whilelmina Rapp, una pistolera specializzata nel \ntrovare tracce e informazioni. Si incontravano ancora per \ncenare insieme una volta al mese, ma non parlavano mai \ndi lavoro, su richiesta di Austyn. Ogni tanto, spinto dalle \nvoci di strane morti e mostri vaganti nella regione, un \nagente dei Kreuzritter contattava Austyn per maggiori \ndettagli. Nessuno di loro tornò vivo per raccontarlo.\nMan mano che il corpo di Suse appassiva lentamente, \nil demonio nella sua mente divenne più forte. Cominciò \na prendere il controllo di altri mostri nella zona, dando \nad Austyn il comando di branchi di ghoul, wight e sirene. \nOrde di mostri hanno cominciato a vagare oltre i confini \ndella parrocchia dove abita Austyn, dando alla zona la \nreputazione di essere un luogo da evitare.\n\n♟️ Macchinazioni:\n(1) Eliminare l’agente dei \nKreuzritter che lo insegue.\nGli ex-commilitoni di Austyn possono non averlo \nancora scoperto, eccetto Mina Rapp. Essendo rimasta \nin contatto con Austyn dopo il suo ritiro, ha notato \ni segni del suo lento decadimento. Austyn deve assi-\ncurarsi che nessun altro lo scopra, ma uccidere Mina \nservirà davvero a mettere un freno a questo problema? \nNon sarebbe meglio corromperla?\n(3) Trovare un ospite più forte\nper l’Orrore.\nCome uno scarafaggio sotto il controllo di un paras-\nsita, Austyn segue istintivamente gli ordini dell' Orrore, \nnon rendendosi realmente conto di chi sta guidando \nla sua mano. L' Orrore dentro Suse la sta divorando \ndall'interno e presto la giovane sarà troppo debole \nper ospitarlo ancora. Austyn ha ricevuto l'ordine di \ntrovare un nuovo corpo per l' Orrore, anche se questo \nsi tradurrà probabilmente nella morte della figlia.\n(5) Stabilire un nuovo principato di \nEisen con l’Orrore come Eisenfurst.\nI mostri innominabili sono la minoranza più nume-\nrosa del Paese. Non è forse ora che abbiano una terra \ndavvero loro? Quando il padrone di Austyn avrà il \ncontrollo di una regione all'interno di Eisen, popo -\nlata solo da Orrori, allora gli umani saranno costretti \na trattarli da eguali. Come ultimo, crudele, scherzo, \nl'Orrore pianifica di rivelarsi e liberare Austyn dal \ncontrollo mentale nel momento del trionfo.\n\n🎭 Consigli di Interpretazione:\nAustyn ha due personalità, ma quella che uccide per  saziare un Orrore sovrannaturale è al comando. I resti  della sua passata umanità combattono per riemergere,  come schegge di dubbi sussurrati sulla correttezza del  suo sentiero… ma sono rare eccezioni. Quando Austyn è vicino alla figlia – che è malata,  quasi moribonda, incapace di parlare e spesso priva  di conoscenza – la sua vecchia personalità riemerge  e torna ad essere gentile e amorevole per alcuni  minuti. Il vero Austyn è ancora nascosto da qualche  parte, e ha silenziosamente raccolto informazioni  sull’Orrore, i suoi punti di forza, debolezze e piani.",
        "archetype": "Malvagi Belva"
    },
    {
        "id": "s7_villain_giuliana_onesta",
        "name": "Giuliana Onesta",
        "category": "villain",
        "type": "Malvagio (Belva)",
        "nation": "Vodacce",
        "strength": 7,
        "influence": 8,
        "villainyRank": 15,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Cecchino; Contatto: Inquisizione Vaticina;  Mira Letale; Scuola di Maniere • Virtù: Il Diavolo Astuta. Il Malvagio può attivare questa Virtù dopo  che un Eroe ha speso degli Incrementi per un’Azione.  L’Azione fallirà automaticamente, ma gli Incrementi  saranno spesi comunque. • Superbia: La Torre Arrogante. Il Malvagio riceve un Punto Pericolo quando  mostra disprezzo o considera indegno di attenzione un  Eroe o chi potrebbe causare danno ai suoi alleati.",
        "ability": "Servitori & Sottoposti: I sottoposti di Giuliana sono quasi sempre Inquisitori. Inquisitori. Quando la Forza della Squadra è sul punto di  essere ridotta mediante l’uso di Allettare, Convincere,  Intimidire o altri simili effetti di coercizione, spendendo  un Punto Pericolo la fede incrollabile di questi Sgherri  permette loro di ignorare tale effetto.",
        "notes": "«Hai due possibilità. Una è morire qui, in modo  vergognoso e scomposto. L’altra è fare esattamente  ciò che ti dirò per il resto della tua miserabile  vita. Spero vivamente che tu scelga la prima.»\nArchetipo: Malvagi Belva\n\n📖 Storia:\nQuando Giuliana aveva solo 6 anni, il padre uccise la \nmadre. Lei non ha un ricordo preciso dell'accaduto \nma, da quella notte, la sua memoria si è arricchita di \ndettagli, nello stesso modo in cui un tronco abbattuto \nsi riempie di muffe. T uttavia, l'immagine del ruolo di \nsua sorella Giachetta è sempre rimasta immutata: fu \nlei a far impazzire il padre e a guidarne la sua mano, \ncostringendolo a uccidere la propria moglie per motivi \nche Giuliana non ha mai saputo, né ha mai voluto \ninvestigare per timore di ciò che potrebbe scoprire. \nQuesto ricordo, mezzo vero e mezzo falso, è il motore \nruggente che muove Giuliana, come devota V aticina \ne Inquisitore.\nL'Inquisizione era uno spettro terrificante per altre \ngiovani dell'età di Giuliana, un mostro che le avrebbe \ncarpite se non dicevano le preghiere o se non anda -\nvano a letto in orario. Per lei, invece, era un obiettivo. \nEra il motivo per cui studiò tanto accanitamente, \nfinché un'università V aticina non le offrì una borsa di \nstudio; era quello per cui si svegliava prima di tutti i \nsuoi compagni di corso per esercitarsi al tiro al bersa-\nglio finché non superò gli istruttori. A 16 anni era già \nun cadetto dell'Inquisizione a tutti gli effetti, a 18 un \nInquisitore a pieno titolo. T uttavia, quando raggiunse \nil suo scopo i suoi compagni le parvero inadeguati.\nLa sete di sangue dell'Inquisizione ne ostacolava \nl'efficacia. Dai suoi studi, Giuliana sapeva che l'orga -\nnizzazione non aveva sempre agito in questo modo. In \norigine, gli Inquisitori erano astuti e riservati, agivano \ncon discrezione, senza rivelare il loro vero scopo \nfinché la preda non veniva catturata. L'Inquisizione \nmoderna non funzionava così, ma Giuliana si rese \nconto che non ne aveva bisogno.\nUsò la sua posizione per legarsi ai Principi Mercanti \ndi V odacce, promettendo di ignorare i loro peccatucci \nse le avessero dato accesso alle loro reti commerciali e \nai loro territori. Liberò dalle carceri dell'Inquisizione \nprigionieri appositamente scelti perché diventassero \nsuoi informatori. Nelle città in cui ha liberato questi \nindividui il numero di crimini è aumentato, ma le \ninformazioni ricevute hanno permesso all'Inquisitore \nOnesta di catturare ed uccidere molte più streghe \ned eretici di quanto avrebbe potuto fare solo con le \nsue pistole.\nOggi, Giuliana viaggia per tutta V odacce, seguendo \nle indicazioni della sue rete di informatori, nella \nsperanza di impedire tragedie come quella accaduta \na lei. La sua unica debolezza è l'abitudine di garan -\ntire una tacita amnistia a chi le è vicino. Per esempio, \nGiachetta vive ancora, travestita da serva in casa \ndella sorella e senza mai usare i suoi poteri magici. \nGiuliana sfoga sugli altri la sua rabbia per l'incapacità \ndi condannare qualcuno che le è caro.\nL'Inquisitore Onesta sarebbe terrorizzata renden-\ndosi conto che ciò che sinora ha considerato un \nsemplice atto di egoismo potrebbe diventare un \nsentimento che non ha mai tollerato: la compassione.\n\n♟️ Macchinazioni:\n(1) Rubare un Malleus Maleficarum \ndalla tomba del Pontefice Sixtus.\nIl celebre “Generale Pontefice” era capace di creare \nmartelli benedetti, che prendevano il nome dal \nfamoso manuale per cacciatori di streghe, da usare \ncontro i nemici della Fede. Giuliana non riesce a \npensare a qualcuno più qualificato di se stessa per \nportare un simile artefatto. Sfortunatamente l' Ufficio \ndel Pontefice controlla l'accesso ai santi sepolcri e non \npermette all'Inquisizione di avvicinarsi.\n(3) Rivelare le Figlie di Sofia \nall’interno del Casato Villanova.\nLa rete di informatori dell'Inquisitore Onesta ha \nscoperto che le Figlie di Sofia sono attive proprio \nsotto il naso di Giovanni Villanova. Riuscire a scovare \nqueste amanti delle streghe in una delle più potenti \nfamiglie di V odacce porrebbe Giuliana al di sopra dei \nsuoi pari e farebbe da trampolino per successi ancora \nmaggiori. Chissà, un giorno potrebbe guidare lei \nl' Inquisizione.\n(5) Trovare e attaccare il quartier \ngenerale delle Figlie di Sofia.\nÈ già un male che le Streghe della Sorte siano diffuse \nin tutta V odacce, ma almeno sono sotto controllo. \nLa sola idea di Streghe fuori dal Paese, dove la loro \neresia si spanderebbe senza controllo, è inconcepibile. \nÈ tempo che l'Inquisitore Onesta si occupi delle Figlie \ndi Sofia in modo esemplare.\n\n🎭 Consigli di Interpretazione:\nGiuliana è bravissima nel proprio ruolo: ha sempre  la schiena perfettamente dritta, le mani vicine alle  pistole e gli occhi attenti al più piccolo segno di  eresia o debolezza. Non sorride mai, eccetto quando  causa dolore al prossimo. Quando la sua natura più  sensibile viene allo scoperto di fronte a qualcuno  a cui è affezionata diventa ansiosa. Il lavoro ha  consumato così tanto della sua identità che non sa  come comportarsi quando emerge questa natura  gentile, che la porterebbe ad affezionarsi ad amici  e familiari. Il senso di colpa e i dubbi sono sempre  presenti e, spesso, si trasformano in rabbia.",
        "archetype": "Malvagi Belva"
    },
    {
        "id": "s7_villain_drieu_riquesse",
        "name": "Drieu Riquesse",
        "category": "villain",
        "type": "Malvagio (Belva)",
        "nation": "Castille",
        "strength": 9,
        "influence": 6,
        "villainyRank": 15,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Divincolarsi; Equilibrio Perfetto; Immunità  ai Veleni; Lavorare sui Tetti; Linguista;  Schermidore; Volontà Indomabile • Virtù: La Notte Senza Luna Discreto. Quando agisce dietro le quinte o attraverso  un intermediario il Malvagio può attivare questa Virtù.  Per il prossimo Rischio ogni dado conterà come un  Incremento senza bisogno di tirare. • Superbia: Il Ritrovo Rancoroso. Il Malvagio riceve un Punto Pericolo quando  si mette nei guai rimanendo ancorato a vecchi rancori e  cattivi sentimenti",
        "ability": "Servitori & Sottoposti: Drieu lavora da solo e quindi ogni sottoposto o  servitore che lo accompagna sarà temporaneo e sacri- ficabile. Può darsi che assoldi, anonimamente è ovvio,  Sgherri locali, Ladri o Pirati per infastidire gli Eroi.",
        "notes": "«Sei riuscito a scuotermi, complimenti.  È una cosa rara e non mi piace. Non temere,  questo non sarà lo scontro ad armi pari che  speri. Per esempio, io ho un moschetto.»\nArchetipo: Malvagi Belva\n\n📖 Storia:\nDrieu Riquesse si sveglia all'alba ogni mattina, si \nprepara il tè per la colazione, lavora in giardino, va \nin città e pranza al Caffè. Quindi torna a casa per \nla siesta, passa il pomeriggio a fare commissioni, si \nprepara la cena a va a letto presto. È sempre cortese \ncon i vicini, ma raramente ha qualcosa d'interessante \ndi cui parlare. T utti sono convinti che abbia una \nrendita o operi nel commercio internazionale, perché \nnon sembra mai lavorare, ma sparisce per settimane \ndicendo di dover partire per visitare la famiglia o \ndei clienti.\nDrieu Risquesse è un assassino professionista.\nIn gioventù, Drieu era pieno di fuoco e passione, come \nil resto della sua famiglia, specie suo fratello minore \nDanilo. Questi non desiderava altro che unirsi alla Gilda \ndei Duellanti e non perdeva occasione per fare pratica… \nanche se ciò significava battersi illegalmente. Danilo \naccettò la sfida di uno spadaccino dilettante, Bertaut, \nconvinto che questi avrebbe onorato l' accordo di uno \nscontro al primo sangue. Invece lo uccise con un colpo \nfatale alla gola.\nAlla notizia, il cuore di Drieu si spezzò. Per lui la \nscherma era una sfida e un passatempo che condivideva \ncon il suo amato fratello. Perdere Danilo gli mostrò che, in \nrealtà, era il contrario: una questione di sangue, orgoglio \ne morte.\nBertaut usò senza risparmio i suoi contatti e la sua \ninfluenza per distruggere ogni speranza di Drieu di \navere una compensazione legale per la morte del fratello. \nIn tutto questo Drieu trovò un' unica valvola di sfogo: la \nmorte. Cominciò a usare la sua abilità con la spada per \nuccidere dietro compenso. Non erano duelli epici e onore-\nvoli, ma omicidi tanto brutali ed efferati da non lasciare \nalcuna traccia per la guardia cittadina.\nOgni morte motivata solo dal denaro o dall' ambizione \naltrui, rafforzava la convinzione di Drieu che la vita \numana fosse priva di significato. L' unico momento in \ncui provava davvero qualcosa era quando le sue vittime \nesalavano l' ultimo respiro e la luce abbandonava i loro \nocchi. In quell' attimo provava rabbia e desiderava sentire \nil risveglio di una furia nel profondo della sua anima.\nDrieu ha un agente, una lontana cugina chiamata \nBarbara Riquesse, che raccoglie offerte di lavoro da nume-\nrosi uffici postali in tutta Montaigne. Drieu è riuscito ad \naccumulare una piccola fortuna, sparsa nelle banche di \ntutta Théah, onorando questi contratti. È un esperto \nlinguista e abile nel travestimento: è capace di trasfor-\nmarsi nella persona più banale che si possa incontrare in \nqualsiasi continente.\n\n♟️ Macchinazioni:\n(1) Completare il contratto \nsu Salvador de Barros.\nDrieu Riquesse ucciderebbe chiunque per denaro, ma \ni suoi contratti preferiti sono quelli che riguardano \ni Duellanti. Loriega, un maestro di scherma di San \nCristobal, continua a perdere studenti a favore della \nscuola Barros e vuole vedere morto il suo omologo. \nT utto ciò che Drieu deve fare è isolare Barros \ne ucciderlo.\n(3) Uccidere Bertaut e tutti \ncoloro che lo conoscono.\nUna volta che Barros sarà morto, Drieu vuole far \nsoffrire Bertaut come ha sofferto lui, dando la caccia \nai suoi amici e familiari per isolarlo. Bertaut si è fatto \nmolti nemici negli anni e Riquesse ha in mente di \nconvincere Loriega e i suoi studenti a eliminare altri \nDuellanti che potrebbero competere con la loro sala \nd'armi.\n(5) Bruciare il tribunale di San \nCristobal senza che nessuno \npossa sfuggire alle fiamme.\nCos'è la giustizia? Una menzogna sorretta da altre \nmenzogne. Un tempo, Drieu credeva nella giustizia, \nnella pietà e nella noblesse oblige, finché la morte di \nDanilo non distrusse queste idee. Drieu ha bisogno \ndi vedere bruciare il tribunale, il luogo dove gli venne \nnegata giustizia per la morte del suo amato fratello, \ninsieme a tutti coloro che credono nella legge.\n\n🎭 Consigli di Interpretazione:\nEducato, gentile e completamente nichilista, Drieu  è capace di pugnalare un uomo e quindi sedersi  tranquillamente a vederlo morire dissanguato.  Il suo tratto più inquietante è l’assoluta calma  con cui commette atrocità, quasi sempre varianti  dell’omicidio.  È improbabile che mostri emozioni, a meno che non  gli si impedisca di raggiungere i suoi scopi e non sarà  mai più di un leggero tic all’occhio o il guizzare di un  muscolo. La sua voce è piatta, calma e disarmante.  Dopo avere passato pochi minuti con lui durante un  lavoro, molti pregano di ritornare alla compagnia di  sanguinari capitani pirata e bearsarker Vesten.",
        "archetype": "Malvagi Belva"
    },
    {
        "id": "s7_villain_liphilt",
        "name": "Liphilt",
        "category": "villain",
        "type": "Malvagio (Belva)",
        "nation": "Eisen",
        "strength": 10,
        "influence": 3,
        "villainyRank": 13,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Divincolarsi; Esperta di Sopravvivenza; Psst, Da  Questa Parte; Pugilatore; Riflessi Rapidi: Rissa; Sguardo di Ghiaccio; Volontà Indomabile • Virtù: Il Matto Scaltra. Attivando questa Virtù, il Malvagio può sfuggire  al pericolo nella Scena in corso. Potrà salvare solo  se stesso. • Superbia: Le Monete Implacabile. Il Malvagio riceve un Punto Pericolo  quando si mette nei guai rifiutandosi di lasciare in pace  qualcuno o di ritirarsi quando è in vantaggio.",
        "ability": "Qualità Mostruose: Liphilt è tecnicamente umana, ma una vita di deliberate  barbarie le ha conferito la Qualità Terrificante.\n\nServitori & Sottoposti: I membri della banda di Liphilt la seguono per paura  delle sue azioni. Molti sono Ladri o Pirati, ma la  maggioranza è formata da Sgherri semplici. Non ci  sono individui carismatici o influenti tra loro: Liphilt li  considera una minaccia.",
        "notes": "«La libertà è a una vita di distanza. Sta a te  scegliere se la tua o quella di un altro.»\nArchetipo: Malvagi Belva\n\n📖 Storia:\nLiphilt rimase orfana durante la Guerra della Croce \nquando la madre si suicidò per paura della sua stessa \nfiglia. Sola nell'oscurità, Liphilt venne ritrovata \ndentro un carrello pieno di minerale nella miniera di \nferro delle famiglia Baaken nei Monti Drachenberg. \nIl minatore che la trovò fu tanto impaurito dallo \nsguardo feroce della bambina da farsi il segno della \ncroce. La portò alla vicina città di Atemlos e la affidò \nalle amorevoli cure dell'Accademia Strauss per orfani \ndi guerra gestita da monache V aticine.\nLiphilt era considerata toccata dalla Legione, una \nbambina malefica. Nessun tentativo delle reverende \nsorelle riuscì a lenire l'odio che albergava nel suo \ncuore di pietra e dovettero spesso rinchiuderla per \nproteggere gli altri bambini. Dalla finestra della cella \nnella torre, Liphilt osservava Atemlos e i suoi abitanti. \nOdiava la città per la sua ricchezza, la cattedrale che \nstava venendo costruita con quei denari e, in parti -\ncolare, Baaken, il magnate delle miniere, che aveva \nfinanziato tali opere. C'era davvero poco al mondo \nche non odiasse.\nCon il passare degli anni, questo odio si trasformò \nin una brutalità che costò la vita alle monache pietose \nche avevano tentato sino all'ultimo di salvarla da \nsé stessa. Una notte Liphilt fuggì e si unì al movi -\nmento Obiezionista, almeno nominalmente. Quegli \nsciocchi le diedero l'opportunità di bruciare, razziare \ne uccidere in una folle missione volta a radere al \nsuolo Atemlos.\nGodendo della distruzione, Liphilt partecipò a non \nmeno di tre assalti contro la città e ogni fallimento \nfece crescere la sua furia e la spinse verso nuovi abissi \ndi depravazione.\nLa famiglia Baaken e gli abitanti di Atemlos riusci-\nrono a sconfiggerla più volte. Quando Liphilt bruciò \ni campi, riseminarono. Quando li torturò, resistettero. \nQuando li attaccò con enorme ferocia, si difesero fino \nall'ultimo. V enne infine catturata dopo un ultimo \nassalto suicida e si ritrovò di fronte all'augusto magi -\nstrato di Atemlos, l'Onorevole Gerhard Stein. Questi \nla condannò ai lavori forzati a vita nella miniera \ndei Baaken.\nAnni di lavoro nel luogo in cui era nata incendiarono \nl'anima di Liphilt di un odio ancor più febbrile, che \naumentava ad ogni scudisciata. Non passò molto \ntempo che Liphilt escogitò un piano di fuga. Dopo \naver strangolato una guardia con i propri ceppi, rubò \nle chiavi e fuggi tra i Monti Drachenberg.\nSfruttando paura e intimidazione, Liphilt riunì una \nbanda di criminali e rifugiati e si preparò a razziare \nle miniere lungo tutto l'arco montano. Durante ogni \nspedizione concedeva ai lavoratori la scelta tra guada-\ngnarsi la libertà uccidendo i sorveglianti o morire per \nmano sua. Per garantirsi la lealtà di queste nuove \nreclute, ognuna è obbligata a lasciare una confessione \nscritta di suo pugno sul corpo della propria vittima. \nPer Liphilt il tempo dell'attesa è finito, sta tornando \nad Atemlos e stavolta nulla potrà fermarla.\n\n♟️ Macchinazioni:\n(1) Rapire il giudice che l’ha condannata \ne farlo lavorare fino alla morte.\nLa prima tappa del viaggio di Liphilt verso la vendetta \nsarà regolare i conti con il magistrato. Gerhard Stein ama \nandare a caccia vicino ai Dranchenberg e non ha idea \nche Liphilt progetti di rapirlo, incatenarlo a chiunque lo \naccompagni e farli lavorare tutti sino alla morte.\n(3) Uccidere il magnate Tomas \nBakeen e la sua famiglia.\nLa seconda fase del piano è uccidere la famiglia Bakeen. \nPreoccupato per i recenti attacchi, T omas ha assoldato \ndelle guardie straniere per proteggere i suoi cari, al \nmomento rinchiusi ad Atemlos. Ciò che non sa è che \nla sua figlia più piccola, Elsa, e il fratello Conrad si \ndivertono a scappare nelle miniere per giocare ai soldati.\n(5) Minare la Cattedrale di \nAtemlos e farla crollare durante \nuna Messa solenne.\nLiphilt ha una vasta conoscenza delle miniere e dei \ntunnel sotto Atemlos. Con il giorno dell' inaugurazione \normai alle porte, ci si aspetta che tutta la popolazione \nsarà presente alla prima Messa solenne e la banda di \nLiphilt sta lavorando senza sosta per minare le fonda-\nmenta dell'edificio e farlo crollare. Una struttura tempo-\nranea in legno reggerà la costruzione sino al momento \nopportuno, poi la banda le darà fuoco e si godrà lo spet-\ntacolo della cattedrale e della città che bruciano.\n\n🎭 Consigli di Interpretazione:\nAgile, con gli occhi scuri e sempre in movimento,  l’odio verso tutto ciò che è buono, onesto e puro  spinge Liphilt ad atti di barbarie sempre più estremi.  Il suo costante sogghigno diventa rapidamente un  sorriso maniacale quando sente il profumo sedu- cente della distruzione deliberata. Non cammina,  avanza a grandi passi. Non sorride, snuda i denti.  Non guarda, fissa intensamente. Liphilt sa che il  suo odio la consumerà un giorno… ma vuole fare in  modo che consumi prima il resto del mondo.",
        "archetype": "Malvagi Belva"
    },
    {
        "id": "s7_villain_luisio_barozzi",
        "name": "Luisio Barozzi",
        "category": "villain",
        "type": "Malvagio (Belva)",
        "nation": "Vodacce",
        "strength": 7,
        "influence": 9,
        "villainyRank": 16,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Compagno Fidato: Enzo Calabrese; Contatto:  Criminalità di Vodacce; Fama: Spietato; Non  Siamo Poi Tanto Diversi…; Orologio Biologico • Virtù: Il Sole Glorioso. Il Malvagio può attivare questa Virtù quando  si trova al centro dell’attenzione. Per il prossimo  Rischio ogni dado conterà come un Incremento senza  bisogno di tirare. • Superbia: L’Imperatore Testa Calda. Il Malvagio riceve un Punto Pericolo  quando perde le staffe o provoca guai.",
        "ability": "Servitori & Sottoposti: In quanto capo di un’influente impresa criminale,  Luisio ha un gran numero di uomini pronti a eseguire  i suoi ordini. Il suo miglior agente è Enzo Calabrese,  consigliere e sicario personale. Luisio ha assoluta  fiducia in lui e con buone ragioni: la lealtà di Enzo è  rivolta solo ed esclusivamente a lui.",
        "notes": "«Se conosceste la sua reputazione, vi rendereste conto  che implorare non farà alcuna differenza.  È tempo di pagare il vostro debito con il sangue»\nArchetipo: Malvagi Belva\n\n📖 Storia:\nLuisio era un ragazzo robusto che viveva tra i picchi di una \nterra che non ricorda più. Un giorno, da lontano, giunsero \nalcuni barbari dagli strani abiti che uccisero la sua famiglia. \nAvrebbero ucciso anche lui, ma la sua forza fu sufficiente \na respingerli. Coperto di sangue e circondato da nemici, \nera confuso e, quando stava per essere infilzato da un \ntirapiedi, il capo degli invasori intervenne ordinando di \nstordirlo. Quando si riprese, era in un luogo straniero e \nnon ricordava più nulla. Luisio decise di sopravvivere con \nogni mezzo e così fece.\nCristiano Barozzi, l' uomo che lo aveva “salvato” , divenne \nsuo padre. Si rese conto subito dell' utilità della forza \ndi Luisio e decise di metterlo alla prova affidandogli i \ncompiti più infami, che persino uomini e donne adulti \nerano riluttanti a eseguire. Che si trattasse di rompere le \ndita a una vecchietta che non aveva ripagato in tempo i \nsuoi debiti o di uccidere degli innocenti che avevano visto \ntroppo, tutto veniva fatto ancora prima che don Barozzi \navesse finito di dare l'ordine.\nLuisio era semplicemente troppo bravo nel suo lavoro e \nCristiano si insospettì. Offrì a Luisio, ormai adulto, tutte \nle possibili tentazioni. Cortigiane? Luisio le rimandò \nindietro educatamente. Ricchezze? Accettò solo il minimo. \nCibi raffinati? Replicò che seguiva una dieta frugale. Infine, \na Cristiano rimase un' ultima carta: gli ordinò di uccidere \nil fratello minore Piero, suo unico rivale all'eredità.\nLuisio, convinto di condividere lo stesso sangue di \nPiero, rifiutò e offrì la sua vita in pegno per tale fallimento. \nInvece di accettare il sacrificio, Cristiano lo abbracciò in \nlacrime: “T u sei mio figlio e sarai capofamiglia quando \nsarò morto, nonostante tu non sia del mio stesso sangue.” \nFu così che Luisio scoprì di essere stato adottato e che \nPiero venne defraudato della sua eredità.\nLuisio non fece alcun commento, né chiese dettagli sulle \nsue origini. Secondo la tradizione baciò la mano al padre, \nmantenendo la sua espressione imperscrutabile. Con il \ntempo, tutti nella famiglia cominciarono a rispettarlo \ne temerlo. Era una figura sempre presente al fianco del \npadre e ogni tanto mormorava qualcosa all'orecchio di \ndon Barozzi.\nQuando Cristiano morì, avvelenato da Piero, Luisio \ndivenne don, il capo della famiglia. Prima che potesse \nricevere la punizione Piero fuggì e, poche settimane dopo, \nl' intera casa fu svegliata dalle urla terrorizzate di Luisio. \nNessuno lo aveva mai sentito gridare e nessuno voleva \nripetere l'esperienza. Le guardie che entrarono nella sua \nstanza raccontarono che era solo, madido di sudore, e \nblaterava di una terra lontana e di una vita che doveva \nritrovare. Don Barozzi non ha più parlato della cosa.\n\n♟️ Macchinazioni:\n(1) Trovare e uccidere l’uomo \nche lo ha rapito da Aztlan.\nLuisio ha un incubo ricorrente, una visione di una \nterra lontana circondata dalle montagne, indossa \nabiti lordi del sangue della sua famiglia. Viene affer-\nrato e gettato su una nave per non rivedere mai più la \nsua patria. Luisio sposterà mari e monti alla ricerca \ndell'uomo che gli ha fatto questo.\n(3) Uccidere il fratello Piero \nper il suo tradimento. \nDopo quanto ha fatto, Piero deve morire. Il problema \nè che molti degli scagnozzi sono riluttanti ad alzare le \nmani su uno dei Barozzi. Al momento Luisio non è in \ncondizione di occuparsi personalmente della faccenda \ne sta cercando qualcuno disposto a catturare Piero vivo. \nLa sua morte sarà un dovere, e un piacere, riservato a lui.\n(5) Distruggere l’impero dei suoi rivali,\ngli Antonini.\nNon appena si sono diffuse voci sullo stato di salute \ndi Luisio, la famiglia Antonini ha tentato di trarne \nun vantaggio. Ora che sono stati tanto sciocchi da \nrivelare pubblicamente le loro mire, Luisio è pronto \nad annichilirli. Ha intenzione di non lasciare neppure \nil ricordo degli Antonini.\n\n🎭 Consigli di Interpretazione:\nLuisio Barozzi è un mostro che è stato raggiunto  dai suoi sensi di colpa. Per la prima volta nella sua  vita mostra debolezza, viene colto da crisi di rabbia  e si sveglia urlando ogni notte a causa degli incubi.  Tuttavia, è ancora in grado di conservare qualche  forma di autocontrollo. Parla sempre attraverso un  intermediario, mantenendo un’espressione neutra. Quando si tratta degli incubi, la sua maschera di  pietra cade. Chiede sempre di parlare in privato con  chiunque abbia informazioni sull’argomento e, finora,  nessuno di questi individui è stato ucciso. È un fatto  inconcepibile per chi conosce Luisio.",
        "archetype": "Malvagi Belva"
    },
    {
        "id": "s7_villain_mary_galloway",
        "name": "Mary Galloway",
        "category": "villain",
        "type": "Malvagio (Belva)",
        "nation": "Le Marche delle Highland",
        "strength": 10,
        "influence": 4,
        "villainyRank": 14,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Comando; Gioco di Squadra; Sala d’Armi:  Boucher; Schermidore; Sposata al Mare;  Stomaco di Ferro • Virtù: La Guerra Vittoriosa. Quando il Malvagio ferisce per la prima volta  un Eroe in combattimento può attivare questa Virtù  per infliggere una Ferita Drammatica aggiuntiva oltre al  normale danno. • Superbia: : L’Eroe Avventata. Il Malvagio riceve un Punto Pericolo quando  la sua eccessiva sicurezza nell’agire mette nei guai lui e  un altro.",
        "ability": "Servitori & Sottoposti: Mary comanda la Pandolce, una Nave originaria di  Avalon con il Background Cacciatrice di Pirati. La Nave  ha un Equipaggio con Forza 10 che segue le normali  regole per le Ciurme, oltre agli Sgherri che Mary può  assoldare con la sua Influenza. La maggior parte di  questi uomini sono Pirati.",
        "notes": "«Credi di poterci sconfiggere? Abbiamo mangiato i  nostri per continuare a vivere! Quando la tua nave sarà  a pezzi e la tua ciurma in catene allora faremo festa.»\nArchetipo: Malvagi Belva\n\n📖 Storia:\nChi conosce la vicenda di Mary Galloway, detta “La \nMacellaia” , sa che suo marito, T eague, in una sera d' au-\ntunno la vendette ai predoni della costa insieme alla figlia \nper salvarsi la pelle. Johanna Galloway era una bellissima \nragazza, agile, aggraziata e con un bel viso. Fu lei ad aiutare \nsua madre a sopportare i primi durissimi mesi di schiavitù, \na farsi amici gli altri prigionieri e a costituire una informale \nsocietà di rapiti.\nPoi la nave viaggiò verso Nord fino a restare intrappolata \ntra i ghiacci sul tetto del mondo, proprio alla fine dell' anno, \nquando le tempeste di neve possono uccidere. Il freddo \ncominciò a coprire ponte e sartiame di cristalli di ghiaccio. \nI giorni duravano appena poche ore e le notti erano lunghe \ne silenziose. T utto il mondo sembrava tremare e sussurrare.\nL'equipaggio cominciò a ricevere mezze razioni e poi \nancora meno. La fame cominciò a fare smagrire le dita e \ntremare le mani; i pirati si nascosero nelle loro brande e \nordinarono agli schiavi di occuparsi della nave. Nessuno \nsi stupì quando il vecchio cordaio morì.\nIl capitano era un uomo pratico. “Fatelo a pezzi e lo \nmangeremo,” disse e così Mary lo macellò. Dopo setti-\nmane di gallette gelate, la carne aveva un sapore delizioso. \nI pirati, però, avevano ancora fame e Johanna aveva \ncontratto una grave tosse.\nAlcuni giorni dopo il capitano arrivò sul ponte e chiamò: \n“Johanna.” La ragazza malata gli si avvicinò e lui le spezzò \nil collo. Quando Mary vide il corpo della sua bambina \nsteso per la macellazione i suoi occhi si spensero e rivolse \nal capitano uno strano sguardo.\n“Su questa nave c'è carne migliore della mia Johanna.” \ndisse prima di tagliare la gola al capitano.\nSeguì un ammutinamento, con gli schiavi che massacra-\nvano i pirati. La morte di Johanna aveva spezzato qualcosa \nin tutti loro. Quando il massacro fu concluso, gli schiavi \nmacellarono i corpi e mangiarono a sazietà. Solo quello di \nJohanna fu risparmiato e consegnato alle acque. Si ingoz-\nzarono per giorni e settimane e, quando furono ridotti \nalle mezze razioni, avvistarono una nave a caccia di pirati.\nLa fame è una padrona severa e la carne umana è dolce. \nL' inverno non era ancora finito e la nave era ancora intrap-\npolata nei ghiacci. Anche i cacciatori di pirati avevano la \ncambusa quasi vuota. Alcuni membri della ciurma di \ncannibali si dissero che non avevano scelta, altri erano \npiù realisti.\nFu al tempo stesso triste e divertente come, persino \nquando giunse la primavera, l'equipaggio di Mary \ncontinuò a nutrirsi di carne umana. Era ormai ciò \nche li definiva, la loro leggenda, ciò che li univa e li \nrendeva diversi dal resto del mondo. Scherzavano su \ncome raccogliere le cervella e litigavano per i pezzi \nmigliori durante i festini.\nL'equipaggio è ormai preda di un'isteria collettiva e \nMary è la più folle di tutti. Si credono mostri invinci-\nbili legati da un tabù, dalla disperazione e dalle loro \nmani lorde di sangue.\n\n♟️ Macchinazioni:\n(1) Attaccare il suo vecchio villaggio\ne uccidere il marito.\nT eague, il macellaio, può avere venduto moglie e figlia ai \npredoni, ma tutti gli abitanti furono complici. Mary vuole \nvendetta. Calerà coi suoi uomini sul villaggio, farà tutti \nprigionieri, ne mangeranno fino a scoppiare e lasceranno \ngli altri affinché raccontino l' accaduto alle autorità. \n(3) Inviare a Re MacDuff i migliori pezzi\ndei suoi cacciatori di pirati.\nMary e il suo equipaggio hanno incontrato i cacciatori \ndi pirati e non li considerano una minaccia. Un uffi-\nciale della flotta delle Highland ha ritrovato la nave \ndei cacciatori cannibalizzati e la notizia ha fatto scal-\npore. Re MacDuff ha inviato diverse navi al solo scopo \ndi identificare e fermare questi cannibali. Mary vuole \nalzare la posta catturando queste navi, macellando gli \nequipaggi e spedendo i pezzi migliori al sovrano. \n(5) Realizzare un blocco navale \ndelle Marche con una flotta \ndi spietati tagliagole. \nNell'oscurità, quando non c'è più cibo, ogni uomo \nè pronto a mangiare il proprio fratello. Durante i \nlunghi inverni, le Marche delle Highland ricevono \nil grosso dei rifornimenti tramite le importazioni, \nquindi una carestia è un pericolo reale. Mary e i suoi \nuomini vogliono effettuare un blocco navale in pieno \ninverno e osservare mentre l'intera popolazione si \ndà al cannibalismo. T uttavia, per farlo dovrà prima \naumentare il suo clan di cannibali, trasformandolo in \nuna vera flotta.\n\n🎭 Consigli di Interpretazione:\nMary parla come un vecchio lupo di mare, ruggendo,  imprecando ed esortando alla violenza. La sua voce  è roca e profonda e brandisce una mannaia con cui  minacciare il prossimo. Il suo senso dell’umorismo  è rozzo e ha una passione per la battute a sfondo  culinario: è stata lei a ribattezzare la nave Pandolce. Quando vuole motivare la ciurma, comincia a  ripetere la litania delle loro passate sofferenze come  un mantra. Sono sopravvissuti alla schiavitù, ai  cacciatori e all’inverno con le loro sole forze. Non  sono più uomini, ormai, ma mostri invincibili.",
        "archetype": "Malvagi Belva"
    },
    {
        "id": "s7_villain_ondro_r_g",
        "name": "Ondro Róg",
        "category": "villain",
        "type": "Malvagio (Belva)",
        "nation": "Confederazione Sarmatiana",
        "strength": 7,
        "influence": 1,
        "villainyRank": 8,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Contatto: Forze dell’ordine; Fama: Incorruttibile; Mano Lesta; Pugilatore; Scafato • Virtù: La Ruota Fortunato. Il Malvagio può attivare questa Virtù per  ritardare un’Opportunità o una Conseguenza di  1 Azione. • Superbia: Il Mendicante Invidioso. Il Malvagio riceve un Punto Pericolo quando  desidera fortemente qualcosa e agisce in modo poco  accorto per ottenerla.",
        "ability": "Servitori & Sottoposti: Ondro non ha sottoposti e ha solo un modesto capitale  per assoldarne. Ha in mente però di reclutare alcuni  disperati che lo aiutino.",
        "notes": "«Gli ignoranti e i creduloni sono il selciato sulla  strada del successo; schiacciali bene sotto  il tuo stivale e avrai un viaggio liscio.»\nArchetipo: Malvagi Belva\n\n📖 Storia:\nProbabilmente chiunque abbia conosciuto Ondro \nRóg da bambino è morto. La vergogna che provava \nper quei primi anni di vita è troppo grande per \nlasciare qualche testimone in grado di raccontare che \ni genitori lo avevano rinchiuso sotto il letto per tre \ngiorni senza cibo e acqua.\nOndro subì 10 anni di abusi prima di riuscire a \nfuggire. Un giorno mentre stava rubando una mela \nper cercare di riempirsi lo stomaco incontrò un uomo \nincredibilmente grasso. Questi lo aiutò e, con una \nstrizzatina d'occhio, si complimentò per la sua abilità. \nFu così che Ondro divenne messaggero del più fami-\ngerato criminale di Rokosz: Cezary Górski. Questi \ndivenne il padre amorevole che il ragazzo non aveva \nmai avuto. Ondro scoprì cosa voleva dire essere ricco \ne potente. Per il suo 21° compleanno Cezary gli fece \nun regalo speciale: lo condusse in un magazzino, gli \nconsegnò la chiave e gli disse di fare ciò che desiderava \ncon quanto vi era all'interno. Ondro vi trovò i suoi \ngenitori e li strangolò entrambi a mani nude, sorri -\ndendo. Per un anno affinò queste tendenze omicide \na beneficio del suo datore di lavoro.\nQuando cadde la prima neve, Cezary invitò Ondro e \npochi altri amici fidati a una cena formale. Li informò \nche il giorno seguente avrebbero firmato il suo ordine \ndi arresto, vivo o morto, e sarebbe stato costretto a \nentrare in clandestinità. Nessuno doveva conoscere \nl'ubicazione del suo nascondiglio e Ondro si sarebbe \ndovuto occupare degli affari nel frattempo.\nOndro svolse questo nuovo incarico per una sola \nsettimana. Dopo aver assistito all'impiccagione di \nun mercante Castilliano si rese conto che poteva \nsoddisfare il suo desiderio di sangue più facilmente \nlavorando per la legge. L'uomo era stato arrestato e \ncondannato per contrabbando, ma Ondro sapeva che \nera onesto.\nPer curiosità, Ondro si interessò della faccenda e \nscoprì che il Castilliano aveva stupidamente ordinato \nla demolizione dell'abitazione della vecchia madre di \nun funzionario, lasciandola sulla strada. Era chiaro \nche il potere e il giusto riconoscimento lo aspettavano \ntra i tutori dell'ordine.\nOndro confidò alle autorità che un corvo lasciava \nla ex-residenza di Cezary ogni sera alle sei in punto \ne che per trovarlo dovevano solo seguire il volatile. \nQuella sera, inviò il corvo con un messaggio di tre \nparole: “Giunge la morte.” Quando Cezary lo lesse, \nmaledì Ondro, ma gli agenti stavano già bussando \nalla porta.\nPer il suo aiuto nell'arresto, Ondro ricevette un \ntitolo onorario e un impiego presso la guardia, ma \nnon appena fu pronto a godersi la sua nuova posi -\nzione, il Re gliela tolse rendendo tutti i Sarmatiani \neguali. Ondro odia la Libertà Dorata e vuole vendetta, \nperché nessuno può sottrargli qualcosa senza pagarne \nil fio.\n\n♟️ Macchinazioni:\n(1) Costruire una rete di informatori \nin tutta la città. \nLa conoscenza è potere. L'informazione è essenziale \nper ricattare e ovviamente è utile sapere chi appoggia \nRe Stanislaw I e suo figlio. Ondro vuole liberarsi di \nloro, se dovessero ancora attraversargli la strada, e \nquali spie sono meglio dei più sfortunati? Per fortuna \nl'orfanotrofio è vicino alla stazione di polizia. \n(3) Superare il record di 37 \nesecuzioni al giorno.\nCos'è la vita senza un poco di sano sport? Confrontare \ni propri risultati con quelli altrui mantiene un \nuomo sempre allerta. Inoltre frutta riconoscimenti \ne rispetto da chi detiene il potere, conducendo a \nmigliori opportunità.\n(5) Ricattare il capitano Zurek affinché \nfaccia di lui un membro della Slachta. \nRe Stanislaw I ha creato la Libertà Dorata, perciò è \nnecessario eliminare il monarca per distruggerla. Chi \nè nella posizione migliore per colpire se non la guardia \nreale? Il capitano Zurek è uno dei pochi in grado di \nconcedere l'onore di essere ammessi alla Slachta e, \ncome ogni buon cittadino, deve avere qualche scheletro \nnell'armadio.\n\n🎭 Consigli di Interpretazione:\nOndro ama uccidere, specie se questo lo porta a  ottenere ciò che desidera. Non gli interessano né  moralità, né ideali e si oppone al Re solo perché  considera la Libertà Dorata un affronto personale.  È in grado di fingere interesse nei confronti del  prossimo ma, in realtà, gli importa solo di sé stesso.  È convinto che se gli altri possono essere usati  significa che sono deboli e che se lo meritano.",
        "archetype": "Malvagi Belva"
    },
    {
        "id": "s7_villain_mikhaila_misha_oksanova",
        "name": "Mikhaila “Misha” Oksanova",
        "category": "villain",
        "type": "Malvagio (Belva)",
        "nation": "Ussura",
        "strength": 3,
        "influence": 7,
        "villainyRank": 10,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Contatto: Criminali di Ekatnava; Mercanteggiare; Virtuosa: Oratoria • Virtù: La Strada Amichevole. Attivando questa Virtù quando il Malvagio  incontra un personaggio per la prima volta, anche un  Eroe, questi lo tratterà amichevolmente per una Scena. • Superbia: Il Mendicante Invidiosa. Il Malvagio riceve un Punto Pericolo quando  desidera fortemente qualcosa e agisce in modo poco  accorto per ottenerla.",
        "ability": "Servitori & Sottoposti: A Misha non mancano teppisti e pendagli da forca  pronti a fare qualunque cosa per guadagnarsi il suo  favore e, quindi, più denaro. Molti sono Ladri e Pirati  ma, quando si trova in luoghi pubblici, ha sempre con  sé un gruppo di Guardie come precauzione.",
        "notes": "«Misha»\nArchetipo: Malvagi Belva\n\n📖 Storia:\nSi potrebbe pensare che Mikhaila “Misha” Oksanova, \nche oggi organizza scontri mortali tra uomini e cani, \nsia stata traumatizzata da piccola, forse per la morte di \nun parente ucciso da un cane. In realtà, i suoi genitori, \nprima di andare in pensione, fabbricavano vele per \nbarche da pesca e volevano trasmettere l'attività alla \nfiglia. Misha, invece, aveva intenzione di andarsene per \nla sua strada.\nOriginariamente, la giovane voleva diventare una \nlottatrice, ma era infastidita dai regolamenti e dalle \nconvenzioni sul “comportamento sportivo” che le \nimpedivano di primeggiare. Decise perciò di diven -\ntare un'organizzatrice di incontri, ma si accorse che \nla concorrenza era troppo spietata. Così cominciò a \nlavorare come addestratrice di cani. Queste povere \ncreature crescevano in condizioni terribili e malsane e \nvenivano vendute a poco prezzo come cani da guardia, \nda caccia o cibo.\nDopo un paio d'anni, il capo di Misha cadde in un \nrecinto e fu sbranato dalle sue stesse bestie. Questo non \nle fece alcuna impressione: era un terribile datore di \nlavoro e osservare la sua morte le fece piacere, soprat-\ntutto perché poté impadronirsi dell'azienda. Fu allora \nche si accorse che potevano esserci altre persone inte-\nressate a questi spettacoli sanguinari e pronte a pagare.\nPortò i suoi cani a Ekatnava e organizzò alcuni \ncombattimenti. Non era un business lucroso o popolare \nquanto gli incontri di lotta, ma aveva alcuni vantaggi: \ni combattenti non dovevano essere pagati, gli scontri \nerano sanguinosi, mortali e facilmente controllabili. \nAssoldò un allibratore e cominciò a prendere una \npercentuale su tutte le scommesse. Se qualcuno tentava \ndi non darle la sua percentuale, mandava sgherri di \nbassa lega a rompere loro le gambe.\nDapprima gli scontri erano solo tra cani. Un giorno, \nperò, un lottatore assai sfortunato le si presentò con \nun' idea: perché non far combattere un lottatore profes-\nsionista con un cane? Oppure con molti cani? Misha \nricordò l'emozione che aveva provato nel vedere il suo \nvecchio capo fatto a pezzi e accettò subito la sfida.\nLo scontro richiamò una gran folla in un campo della \nfiera appena fuori da Ekatnava. Erano in programma \nincontri di pugilato, di lotta, scontri tra cani e, per \nultimo, quello tra il lottatore e i cani.\nL' uomo non sopravvisse, ma uccise tre animali prima \ndi morire e la folla impazzì.\nIl denaro passò di mano in mano e, sentendo l'emo-\nzione e la gioia di un simile scontro, Misha si rese \nconto di quale sarebbe stato il suo futuro. Oggi, le \nlotte tra uomini e cani sono all'ordine del giorno per \nlei. Quando non riesce a trovare un volontario, manda \ni suoi sgherri a prelevare qualcuno che le deve molto \ndenaro e gli fa un'offerta: combattere nell'arena per \nripagare i suoi debiti o morire. È incredibile quanti \naccettino di combattere…\n\n♟️ Macchinazioni:\n(1) Rubare Miron il Gigante, il più forte \ncane da caccia di Théah. \nMisha ha offerto una somma principesca a un celebre \nallevatore per Miron il Gigante, un leggendario \nsegugio che ha accompagnato i Kreuzritter in alcune \nbattute di caccia al mostro. L'allevatore, avendo sentito \nparlare di lei, ha rifiutato. T uttavia questo rifiuto non \nsignifica nulla per Misha: è tempo di passare a droghe \ne rapimenti.\n(3) Assicurarsi la protezione \ndel Trono di Ussura. \nSe Misha riuscisse a convincere il futuro monarca che gli \nscontro tra uomini e cani sono un passatempo da nobili, \npotrebbe diventare ricchissima. A Castille si organiz-\nzano già scontri di uomini contro tori e in questi eventi \nci sono più uomini che tori nell' arena, perciò quelli \nche organizza lei sono probabilmente più equi. Inoltre, \nUssura trarrebbe beneficio da uno sport nazionale.\n(5) Legalizzare gli scontri tra cani \ncome sport internazionale. \nL'idea di competizioni sportive internazionali non ha \nancora preso piede a Théah, a differenza di quanto \navviene nel Nuovo Mondo e nel Mare Atabeano. \nMisha potrebbe cambiare questa situazione. I combat-\ntimenti tra cani non sono ufficialmente illegali, anche \nse le autorità, nelle regioni in cui se ne sono occupate, \nhanno avuto la mano pesante (più per classismo che \nper amore degli animali). Se Misha potesse avere \nl'appoggio dello Zar, Ussura e Eisen sarebbero certa-\nmente interessate all'idea.\n\n🎭 Consigli di Interpretazione:\nEccitata, entusiasta e assolutamente a suo agio di  fronte agli spargimenti di sangue, Misha è prima di  tutto un’appassionata fan e promotrice di eventi  sportivi. Ha un gran sorriso e una voce altrettanto  squillante. Non è mai tanto felice come quando si  trova nel suo box nell’arena a commentare l’azione,  così che anche gli spettatori nei posti peggiori  sappiano cosa sta succedendo. È abile ad infiammare  il desiderio di sangue della folla ed è completamente  devota al suo business, tanto che non le importa se  uomini e cani soffrono o muoiono. Fa tutto parte  dello spettacolo.",
        "archetype": "Malvagi Belva"
    },
    {
        "id": "s7_villain_bogdan_snegovik",
        "name": "Bogdan Snegovik",
        "category": "villain",
        "type": "Malvagio (Camaleontici)",
        "nation": "Ussura",
        "strength": 8,
        "influence": 1,
        "villainyRank": 9,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Oggetto Distintivo: Rasoio da barbiere; Riflessi  Rapidi: Mischia; Schermidore; Sguardo di  Ghiaccio; Sorriso Disarmante • Virtù: La Strada Amichevole. Attivando questa Virtù quando il Malvagio  incontra un personaggio per la prima volta, anche un  Eroe, questi lo tratterà amichevolmente per una Scena. • Superbia: L’Eroe Avventato. Il Malvagio riceve un Punto Pericolo quando  la sua eccessiva sicurezza nell’agire mette nei guai lui e  un altro.",
        "ability": "Servitori & Sottoposti: Bogdan lavora da solo, ma è alla ricerca di un apprendista.",
        "notes": "«Tre colpetti è ciò che si udrà e, al terzo, ahimè,  vicin ti  sarà. È giunto per strapparti al tuo letto, per far rosso  di sangue il tuo giubbetto. Al terzo rintocco dattela a  gambe, o ti aprirà la gola in un istante.»\nArchetipo: Malvagi Camaleontici\n\n📖 Storia:\nIl primo ricordo di Bogdan non è un urlo, né l'odore \ndell'alcol o la madre sanguinante sul pavimento, ma i \ntre brevi colpetti che suo padre dava alla cassa prima \ndi riporre il denaro: odiava quel suono. Il padre era \nun celeberrimo barbiere, sempre pulito ed educato. \nBogdan detestava quella menzogna, quel sorriso che \nsvaniva dopo il tramonto quando l'uomo cominciava a \nbere. Una notte il padre provò a picchiare ancora una \nvolta la moglie, ma Bogdan – ormai un giovane alto, \nmagro e svelto – lo fermò. Prese un rasoio e gli tagliò \nla gola, finché quegli abiti candidi non furono lordi di \nsangue quanto le sue mani.\nLa madre non poteva sopportare il pensiero di \nperdere il figlio e il marito nella stessa notte e lo \nimplorò di fuggire lontano, senza mai fermarsi, per \nevitare il lungo braccio della legge. Due decenni \ndopo, Bogdan è ancora in fuga attraverso Ussura. Ha \nscoperto che non è possibile viaggiare senza denaro, \nperciò, ha intrapreso l'unica professione che conosce: \nil barbiere. Ha scoperto di essere molto bravo, guada-\ngnandosi inviti nelle case di ricchi e potenti, sotto le \nsue molte false identità (di solito astuti anagrammi \ndel suo vero nome).\nQuesta poteva essere la fine della storia, se Bodgan \nnon fosse stato profondamente danneggiato. Bogdan \nha una sete inestinguibile di potere e sangue, forse a \ncausa dell'orrore di essere stato picchiato e di vedere \nla madre malmenata per tutta la vita, oppure per il \nsenso di potere datogli dall'aver infine tagliato la gola \nal padre.\nBogdan annuncia la sua presenza con tre brevi \ncolpetti alla finestra e, dopo essere stato accolto a \ncasa del cliente, prepara gli strumenti da barbiere. \nÈ di una precisione impeccabile: ha sempre con sé \nsalviette calde e profumate, crema da barba morbida \ne schiumosa ed un rasoio affilatissimo. È orgoglioso \ndella sua arte, finché non viene provocato.\nSe un cliente, semplicemente, si rifiuta di parlare con \nun “umile artigiano” , la lama di Bogdan continuerà a \nraderlo sempre più a fondo finché, con un rapido \ngesto, non gli aprirà la gola da un orecchio all'altro. \nDopo di che, si impossesserà di tutti gli oggetti di \nvalore, convinto di esserseli guadagnati semplicemente \nessendo Bogdan il Barbiere.\nBogdan finge di essere un male necessario, un perso-\nnaggio che scopre i segreti dei suoi clienti ed elimina \ni “diavoli” . Sostiene di uccidere solo gli avidi e gli arro-\nganti, ma in realtà sceglie le sue vittime in base alla \nminima provocazione. Le segue a casa dalla piazza \ndel mercato o dal bordello e si presenta come barbiere.\nA Bogdan non importa delle famiglie in lutto che \nlascia dietro di sé. Ai suoi occhi, non ha alcuna impor-\ntanza se la donna che ha ucciso per averlo trattato con \nsufficienza fosse una madre amorevole, o se l'uomo \nche ha sgozzato per arroganza – un'accusa che rivolge \na chiunque abbia maggior successo di lui nella vita – \nabbia trascorso ogni attimo per aiutare i suoi anziani \ngenitori. T utto ciò che importa al suo ego folle è il \nmodo in cui le “prede” lo trattano.\n\n♟️ Macchinazioni:\n(1) Assoldare furfanti di strada \nper portargli clienti che \ndevono essere eliminati.\nBogdan uccide solo coloro che crede se lo meritino, \nma sono così tanti. Ha in mente di espandere la \npropria attività assoldando alcuni Sgherri che gli \nportino nuove vittime. Nonostante sia ricco, grazie \nai suoi furti, paga questi agenti il meno possibile. Per \nlui l'unico denaro di valore è quello nelle sue tasche.\n(3) Addestrare un apprendista, \nmagari un Eroe.\nIl mondo è pieno di persone che ignorano il genio \ndi Bogdan e gli serve aiuto per ucciderle tutte. \nCorrompere un Eroe gli darebbe enorme piacere e \nconfermerebbe la sua grandezza. In realtà, Bogdan si \naccontenterebbe di un qualsiasi teppista, visto che si \nlascia guidare dal proprio desiderio di uccidere.\n(5) Farsi una reputazione tale \nda essere invitato a Corte.\nIl massimo riconoscimento per Bogdan sarebbe \ndivenire il barbiere dello Zar, perché gli darebbe la \npossibilità di passare alla storia come l'uomo che ha \neliminato uno dei due pretendenti al trono di Ussura. \nÈ già sulla buona strada, avendo ricevuto un invito da \nun nobile minore, tale Bort Ivanovich.\n\n🎭 Consigli di Interpretazione:\nBogdan è perfettamente gentile ed educato, finché  non taglia la gola della sua vittima, e si attiene  persino alle regole dell’ospitalità Ussurana. Ha  un palato raffinato, specie per le torte di carne, e  raramente rifiuta un buon pasto. Nonostante la sua  infanzia travagliata, non prova alcun empatia verso il  prossimo, anzi, uccide chi lo offende perché questo  lo fa sentire superiore. È alla ricerca di un ricono- scimento per le proprie imprese, e si vanta dei suoi  omicidi nelle taverne più losche, usando il proprio  contegno terrificante per far tacere il pubblico.           I bambini Ussurani recitano filastrocche sul suo  conto e ne è piuttosto orgoglioso.",
        "archetype": "Malvagi Camaleontici"
    },
    {
        "id": "s7_villain_dana_gwozdek",
        "name": "Dana Gwozdek",
        "category": "villain",
        "type": "Malvagio (Camaleontici)",
        "nation": "Confederazione Sarmatiana",
        "strength": 6,
        "influence": 3,
        "villainyRank": 9,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Comando; Schermidore; Sposato al Mare; Stregoneria: Sanderis 1, Tratto Leggendario:  Acume • Virtù: Il Matto Scaltro. Attivando questa Virtù, il Malvagio può sfuggire al  pericolo nella Scena in corso. Potrà salvare solo se stesso. • Superbia: Il Diavolo Fiducioso. Il Malvagio riceve un Punto Pericolo quando  accetta incondizionatamente una menzogna o un  accordo palesemente truccato. Stregoneria Il dievas di Dana ha il Patto del Mare.",
        "ability": "Servitori & Sottoposti: L’equipaggio di Dana è formato da Mostri, tutti dotati  delle Qualità Non Morto e Notturno, che gli ubbidi- scono senza discutere.",
        "notes": "«Amo il mio Paese sopra ogni altra cosa. I campi  verdeggianti della Confederazione, le città   brulicanti, le montagne, i fiumi… sapete che vi  dico: non intendo dirvi di più. Sulla passerella!»\nArchetipo: Malvagi Camaleontici\n\n📖 Storia:\nQuando tre dievai incontrarono Dana Gwozdek si \nchiesero se non fossero le vittime di un elaborato \nscherzo. Di fronte a loro, nel mezzo di un crocevia \nai margini della città, giaceva un nobile Sarmatiano \nubriaco fradicio dopo una nottata passata con gli \namici, che si disperava per la scomparsa delle diffe -\nrenze tra nobili e plebei nella Confederazione. Lo \nsvegliarono con un calcio e lui bofonchiò qualcosa \nin merito a certi gatti di porcellana, dicendo loro di \nlasciarlo solo.\n“Ti lasceremo solo se prometterai di non tornare \npiù nella tua patria finché non avrai sacrificato \ncento anime davvero nobili per saziarmi.” Rispose \nuno dei dievas, provocando una risata da parte dei \nsuoi compagni.\nFurono tutti sorpresi quando Gwozdek biascicò: “V a \nbene, va bene, qualsiasi cosa tu voglia.”\nIl fatto che questo patto fosse misticamente vinco-\nlante dovrebbe servire da avvertimento: i dievai, gli \nincroci e il troppo liquore Curoniano sono combina-\nzioni pericolose.\nI dievai non lasciarono Dana Gwozdek completa -\nmente solo. Il mattino dopo si risvegliò ben riposato \nsul molo del porto di Memel. Si alzò, spazzolò i vestiti \ne si diresse verso la terraferma, solo per rimbalzare \ncontro un muro invisibile prima di poter toccare il \nsuolo di Curonia. Dopo alcuni attimi di panico Dana \nvenne avvicinato da un monello di strada, che aveva \nricevuto uno zloty da una donna inquietante per \nconsegnargli una lettera. Questa ripeteva, nero su \nbianco, i termini del patto e annunciava che i dievai \ngli avrebbero fornito una nave e un equipaggio per \nfacilitargli il compito. Dana, furioso e ormai diventato \nun losejas, battezzò la fregata: Errore Fatale.\nL'Errore Fatale è una nave impressionante, specie \ngrazie al fatto di essere invisibile. L'equipaggio è \nformato da anime dannate e Dana sospetta che i \ndievai lo stiano usando per liberarsi di tutte le cose \ninutili che sono passate tra le loro mani.\nLa fregata eccelle nell'arrivare non vista addosso \nad altri vascelli, specie se ha le stive vuote. Dana e \nla sua ciurma di dannati, abbigliati con indumenti \ncolor vinaccia, sono oltre la murata prima che qual-\ncuno riesca a capire cos'è accaduto. Spesso i difensori \nrestano tanto a bocca aperta di fronte agli aggressori \nfluttuanti da dimenticarsi di prendere le armi.\nOrmai Dana ha preso l'abitudine di trascorrere i \ngiorni sulle navi che ha catturato, indossando gli abiti \ndei capitani, bevendo la loro birra e mandando lettere \nalle loro amanti. Nessuno di questi giochetti sembra \nlenire la banalità del suo compito, ma lo mettono di \nbuon umore. V edere altre famiglie fatte a pezzi dalla \nscoperta che i loro cari sono morti lo fa sentire meglio \nper aver perso la sua. A Dana importa molto poco \ndella vita altrui e vuole solo togliersi dalle spalle il \nproprio oneroso fardello.\n\n♟️ Macchinazioni:\n(1) Inviare le più grandi ricchezze \nalla sua amata Róża. \nPovera, dolce Róża. Se Dana fosse rimasto a casa con la \nmoglie a sistemare la sua collezione di gatti di porcellana \nnon sarebbe in questo pasticcio. Lei non fu affatto felice, \nper usare un eufemismo, di scoprire che era diventato \nun losejas. Forse qualche barca carica di ricchezze la \nmanterrà fedele, mentre Dana depreda i mari.\n(3) Prendere il comando della \nflotta pirata nella Baia di Stróż. \nDana è abituato a vedere i suoi ordini eseguiti. La \nsua ciurma è formata da poco più che morti viventi \nche non discutono e fanno quanto gli ordina, ma non \ntrova questo spettacolo particolarmente gratificante. \nAvere il comando di un'intera flotta pirata, invece, gli \ndarebbe un vero senso di potere.\n(5) Uccidere il proprio dievas con il \nPugnale d’Osso dei Sette Santi. \nQuell'assurdo demone crede di essere stato tanto \nastuto nel convincere un ubriaco a rinunciare per \nsempre alla sua libertà? Ebbene, Dana ha sentito \nparlare di alcune armi che potrebbero pareggiare i \nconti. Il Pugnale d'Osso dei Sette Santi, creato dai \nmartiri, farebbe al caso suo, se solo potesse strapparlo \ndai reliquiari della Chiesa del V aticinio.\n\n🎭 Consigli di Interpretazione:\nDana è sempre agitato, batte i piedi o affila la sua  lama. Durante qualsiasi conversazione diventerà  annoiato e rabbioso al pensiero di quanto tempo  sta venendo sottratto alla sua agenda di sacrifici di  sangue e omicidi. Nel profondo del suo cuore, Dana ama Sarmatia  (ma non l’attuale Confederazione). Lo si può vedere  nella luce che illumina i suoi occhi o come raddrizza  la schiena quando se ne parla. È nato e cresciuto  considerando la propria identità tutt’uno con la terra  governata dalla sua famiglia.",
        "archetype": "Malvagi Camaleontici"
    },
    {
        "id": "s7_villain_einar_ibsen",
        "name": "Einar Ibsen",
        "category": "villain",
        "type": "Malvagio (Camaleontici)",
        "nation": "Vestenmennavenjar",
        "strength": 5,
        "influence": 10,
        "villainyRank": 15,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Colosso; Contatto: Funzionari Vesten corrotti; Fama: Scaltro; Ricco; Scafato;  Sorriso Disarmante; Un Semplice Malinteso • Virtù: Il Mendicante Perspicace. Attivando questa Virtù, l’Eroe può scoprire il  Grado di un Eroe in un qualsiasi Tratto o Abilità, oppure  il suo Hubris. • Superbia: . Hubris: Il Ritrovo Rancoroso. Il Malvagio riceve un Punto Pericolo quando  si mette nei guai rimanendo ancorato a vecchi rancori e  cattivi sentimenti.",
        "ability": "Servitori & Sottoposti: Einar considera estremamente utili Assassini, Duellanti  e Guardie. Si fida dei Ladri solo se è assolutamente  certo di averli sotto il suo controllo.",
        "notes": "«Non esistono ricchezze oltre la mia immaginazione                                            e le avrò tutte. Potete contarci.»\nArchetipo: Malvagi Camaleontici\n\n📖 Storia:\nA V estenmennavenjar è il denaro a sostenere il dominio \ndella spada, perciò chi controlla i soldi ha il vero \npotere. Questo è ciò che Einar Ibsen continua a dirsi. \nDiscendente di una lunga linea di jarl, Einar era desti-\nnato a continuare la tradizione di famiglia, non appena \navesse ricevuto la sua eredità. Purtroppo questa era già \nmisera quando suo padre la ricevette e nel momento in \ncui arrivò a lui era praticamente inesistente.\nAmici e parenti cercarono di aiutarlo. Gli ricor -\ndarono del Destino, della volontà delle nornir e \ndell'immutabile visione del Padre di T utti all'alba \ndei tempi. Era suo Destino nascere in una famiglia \npotente, ma anche il dover portare sulle spalle il peso \ndi un ufficio gravoso senza alcun denaro. Einar era \ntuttavia inconsolabile.\nRinnegò il proprio titolo, stirpe e destino, scegliendo \nuna nuova vita e un nuovo nome: Ibsen. Chi lo cono-\nsceva lo mise in guardia sui pericoli di una simile \nimpresa, ma si rifiutò di ascoltare. Il suo cuore desi-\nderava denaro e potere. Un potere assoluto. E chi ha \nil potere assoluto? Dio.\nGli dei che avevano negato a Einar la sua eredità \ndecisero di punire questo sacrilegio facendo scompa-\nrire la sua barba. Dopo una serie di sogni febbricitanti, \nEinar si svegliò senza più un pelo sul mento, ora liscio \ncome quello di un neonato. Per un uomo vanitoso \ncome lui fu la peggior punizione possibile. I suoi amici \nrinnovarono i loro avvertimenti, dicendogli che c'era \nancora tempo per redimersi. T uttavia, Einar era ormai \nconcentrato sul potere che lo attendeva al termine del \nsentiero che aveva scelto.\nAbbandonò la spada per la moneta e l'onore di un \nduello per un pugnale nella schiena. In fondo, che \nvalore avevano leggi e regole per un uomo intento a \nforgiare il proprio destino? Mentì, imbrogliò e rubò, \ndiventando in breve tempo il principale azionista della \nCompagnia Commerciale Atabeana. Chiunque cercò \ndi fermarlo fu eliminato con ogni mezzo.\nPoi accadde un miracolo. Una notte, gli apparve uno \nspirito, che si complimentò per la sua determinazione \ne gli disse di non aver mai incontrato un uomo tanto \ninarrestabile e meritevole di un bel aspetto. La crea-\ntura si disperò per la perdita di quella barba un tempo \ntanto maestosa. Chi era più degno di un tale segno di \ndistinzione, se non Einar?\nSedotto, Einar implorò lo spirito di aiutarlo a riavere \nla barba. Ridendo, Blodskjeg la V anitosa, come disse \ndi chiamarsi, gli offrì la possibilità di esaudire questo \ndesiderio che tutto l'oro del mondo non avrebbe \npotuto comprare. Il prezzo? Ben poca cosa: solo la \nvita e l'anima dello jarl Hlodversson.\n\n♟️ Macchinazioni:\n(1) Ingannare un Eroe e \ncostringerlo a servirlo. \nEinar ha bisogno di un buono schiavo, uno che sia \npronto a morire al suo posto se necessario. È parti -\ncolarmente interessato a valutare la forza di un Eroe, \norchestrando attacchi apparentemente causali. Se un \nEroe dovesse cogliere la sua attenzione, cercherà di \nstabilirne il prezzo e non lascerà nulla d'intentato \nfinché non lo avrà fatto suo.\n(3) Sacrificare lo jarl Hlodversson \na Blodskjeg la Vanitosa in cambio \ndi una magnifica barba. \nPer compiere questa impresa nefanda, Einar sta \ncontemplando numerose alternative. Il problema \nprincipale è che lo spirito richiede un vero e proprio \nsacrificio, perciò mandare un gruppo di agenti a \neliminare Hlodversson non è sufficiente. Einar sta \nsfruttando ogni leva politica e sociale per disonorare \nlo jarl e poterlo poi comprare, anima e corpo. \n(5) Trovare la leggendaria Città \ndi Zaffiro nel Nuovo Mondo. \nSin da quando ha sentito parlare di questa meravi -\nglia, Einar non è più soddisfatto della ricchezza che \nottiene normalmente. Ha investito le vaste risorse \ndella Compagnia Commerciale Atabeana, ben oltre \nquelle che può controllare normalmente, per trovare \ninformazioni affidabili sulla città. Einar è determinato \na usare ogni strumento a sua disposizione per trovarla \ne conquistarla, non importa se dovrà passare attra -\nverso l'Inferno.\n\n🎭 Consigli di Interpretazione:\nNel profondo del cuore Einar Ibsen è un codardo,  che compensa questa mancanza comprando ogni  cosa, o persona, che non può avere. È famoso  per la sua vigliaccheria e, quando viene messo di  fronte a questo fatto, la sua reazione sarà quanto  di più violento, crudele e mostruoso possa essere  immaginato. Evita lo scontro fisico ogni volta che può, quando  è nervoso, si accarezza in modo compulsivo  l’inesistente barba. Sa maneggiare una spada se  necessario, ma non ne ha avuto bisogno per anni.  Considera lo scontro fisico come l’ultima risorsa e  preferisce rovinare i suoi nemici da lontano.",
        "archetype": "Malvagi Camaleontici"
    },
    {
        "id": "s7_villain_madre_guineu",
        "name": "Madre Guineu",
        "category": "villain",
        "type": "Malvagio (Camaleontici)",
        "nation": "Castille",
        "strength": 4,
        "influence": 4,
        "villainyRank": 8,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Contatto: Aristocrazia di San Cristobal; Orologio  Biologico; Scuola di Maniere; Sorriso  Disarmante • Virtù: La Notte Senza Luna Discreta. Quando agisce dietro le quinte o attraverso  un intermediario il Malvagio può attivare questa Virtù.  Per il prossimo Rischio ogni dado conterà come un  Incremento senza bisogno di tirare. • Superbia: La Strega Manipolatrice. Il Malvagio riceve un Punto Pericolo  quando tenta di sfruttare qualcun altro per fare il suo  lavoro sporco e la cosa si rivolta contro di lui.",
        "ability": "Servitori & Sottoposti: Nonostante sia ricca a sufficienza da garantirsi la lealtà  di Guardie e altri adulti, il grosso degli agenti di Madre  Guineu sono bambini. Si tratta quasi sempre di Ladri  che evitano il combattimento a ogni costo.",
        "notes": "«È un fatto ben noto che gli innocenti sono coloro  che soffrono di più. Farò in modo che non sia invano.»\nArchetipo: Malvagi Camaleontici\n\n📖 Storia:\nLe strade di Castille sono piene di bambini che \nnessuno vuole e bisognosi di aiuto, bocche affamate \nprive di genitori che badino a loro. È un bene che \nMadre Guineu sia lì per nutrire e vestire questi \ncuccioli perduti. T utto ciò che chiede in cambio è la \nloro eterna devozione e che siano i suoi occhi e orec-\nchie in ogni angolo della società Castilliana.\nEloise Sibyleigne è l'ottava figlia di una famiglia della \npiccola nobiltà, che non riuscì a organizzare ben otto \nmatrimoni confacenti. Mentre le sorelle maggiori \nerano sposate con aristocratici e ricchi mercanti, \nEloise sapeva che non le sarebbe rimasta né una dote \nné alcuna speranza per un fidanzamento decente. \nDecise perciò di dedicarsi alla Chiesa, convinta di \npoter divenire una delle donne più potenti nella gerar-\nchia di San Cristobal.\nNonostante fosse spietata nella sue manipola -\nzioni e abilissima negli inganni, le macchinazioni \ndi Eloise furono presto scoperte da Clara Santoval, \nrecentemente nominata Superiora nella cappella di \nLa Esperanza. La pia donna non credeva alla santità \ndelle intenzioni di Eloise e, indagando, ben presto \nscoprì che questa pianificava di ricattare alcuni nobili \naffinché la appoggiassero. Ne nacque un piccolo scan-\ndalo ed Eloise venne espulsa dalla Chiesa.\nPurtroppo, era già diventata un discreto animale \npolitico: usò le sue conoscenze in città per insabbiare \nla cosa. Ufficialmente, aveva lasciato la vocazione per \nsposare il Conte Bernardo de Balbo. Dopo la prema-\ntura scomparsa del nobiluomo, la moglie ereditò il \ntitolo e la Contessa Eloise de Balbo si adattò a una vita \ntranquilla nella buona società. Dietro le quinte, però, \nle sue macchinazioni continuavano e i suoi nemici non \nriuscivano a capire da dove prendesse informazioni.\nIl segreto era nelle opere di carità: Eloise ha creato \ninfatti un sistema per nutrire, vestire ed educare \nbambini orfani, che chiama i suoi “cuccioli” . Ogni \nbambino che è stato accolto sotto la sua ala protettrice \nsi è trovato in una posizione migliore e tutto ciò che \ngli è stato chiesto in cambio è solo di fare la spia ogni \ntanto. Questi bambini le riportano informazioni da \ntutta Castille, permettendole di influenzare l'intero \npaese e, persino, eventi politici nel resto di Théah. In \ntutti questi rapporti usa l'alias di Madre Guineu.\nOggi, Madre Guineu è una potenza dietro a molte \nmanovre politiche a San Cristobal, ma c'è ancora chi \nle si oppone. Il Conte Didacus de Roja, marito di sua \nsorella maggiore Marjorie, si è rivelato un nemico \nformidabile. Marjorie ed Eloise non si sono mai \npiaciute, neppure da piccole, e quest'ultima ha provato \na distruggere la felicità della sorella.\nQuando il Conte ha compreso che Eloise voleva \ndistruggere sua moglie, ha lanciato una campagna \nvolta a scoprire tutti i suoi segreti e portarli alla luce. \nÈ molto vicino a comprendere il vero legame tra le \ncaritatevole Contessa de Balbo e la diabolica Madre \nGuineu. Da parte sua, Eloise ha messo in guardia i \nsuoi cuccioli contro il malvagio Conte de Roja, che \npotrebbe tentare di portarli via. Sono tutti convinti e \npronti fare qualsiasi cosa per la loro Madre.\n\n♟️ Macchinazioni:\n(1) Reclutare un bambino con \nla magia come arma segreta. \nPoche cose potrebbero far pendere la bilancia a favore \ndi Madre Guineu quanto un bambino con poteri \nmagici. Dato l'odio diffuso verso gli stregoni a Castille \nsi tratta di qualcosa che dovrà essere tenuto segreto, \nma la donna sa che le occorre un asso nella manica. \n(3) Espandere la sua rete di spie \nnella casa di Didacus de Roja. \nI cuccioli di Madre Guineu sono in tutta Castille, \nma nessuno è finora riuscito a infiltrarsi nella casa \ndel Conte de Roja. Eloise deve trovare un modo per \nscoprire i suoi segreti. \n(5) Ricattare Padre Monserrat \nper ottenere una posizione \ndi potere nella Chiesa.\nT utti hanno una debolezza che può essere sfruttata. \nPadre Daniel Monserrat ha sinora bloccato ogni \ntentativo di Madre Guineu di influenzare la Chiesa. \nSe riuscisse a scoprire un modo per ricattarlo e \ntoglierlo di mezzo, potrebbe ottenere molto prestigio \ne autorità.\n\n🎭 Consigli di Interpretazione:\nCome Contessa de Balbo, Eloise è l’immagine di una  nobildonna Castilliana educata e ritirata, l’epitome  delle carità e della cortesia. Purtroppo sotto questa  facciata si nasconde un cuore di una spietata  manipolatrice e animale politico. Madre Guineu  parla sempre in modo gentile, specie ai bambini, ed  è pronta a battersi sino alla morte per proteggere  i suoi cuccioli. I suoi modi gentili nascondono una  mente astuta, spietata e pronta a tutto per il potere.",
        "archetype": "Malvagi Camaleontici"
    },
    {
        "id": "s7_villain_reinhard_vogel",
        "name": "Reinhard Vogel",
        "category": "villain",
        "type": "Malvagio (Camaleontici)",
        "nation": "Eisen",
        "strength": 11,
        "influence": 1,
        "villainyRank": 12,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: , • Virtù: e • Superbia: A differenza di altri Malvagi, Reinhard non ha Vantaggi,  Virtù e Hubris propri. Ottiene invece tutti i Vantaggi  del personaggio che sta interpretando.",
        "ability": "Servitori & Sottoposti: Reinhard fa uso dei servitori e degli agenti di chiunque  stia impersonando.",
        "notes": "«Mi amerai per sempre. Io rappresento tutti i peccati  che non avrai mai il coraggio di commettere.»\nArchetipo: Malvagi Camaleontici\n\n📖 Storia:\nC'era una volta un bambino, figlio di un amatissimo \nprestigiatore. Suo padre però non voleva figli, perché \nli considerava un costo insostenibile. V oleva un'opera \nd'arte, perfetta e soprannaturalmente bella e per questo \nlo allevò per farne un maestro dell' imitazione.\nIl piccolo crebbe osservando il riflesso dei volti \naltrui negli specchi e il suono delle loro voci. Quando \nparlava era solo un eco di qualcun altro. Suo padre \nmescolava colori, ceroni e pozioni per insegnargli \na crearsi nuovi volti, ma non capì che il bambino \ncresceva imparando anche a imitare i desideri altrui.\nUn giorno, quando ormai il figlio era alto quanto \nlui, il padre lo mise di fronte a uno specchio e disse: \n“Diventa me.” E lui così fece.\nIl padre si chiamava Reinhard V ogel e il bambino \nnon aveva avuto un nome fino a quel momento, era \nsolo un riflesso. Non appena si applicò il volto del \npadre, divenne qualcosa di reale: per lui fu un'espe -\nrienza nuova, esilarante e terrificante.\nUn altro uomo avrebbe potuto pensare di usare \nquesta nuova esistenza per fare ciò che voleva, ma \nquesto individuo-che-per-ora-era-Reinhard era solo \nun riflesso, privo di desideri. Perciò fece suoi quelli del \npadre: c'era un ragazza che il padre voleva sedurre e \nil falso Reinhard fece l'amore con lei. Dopo, non era \ncerto che gli fosse piaciuto.\nT ornò quella sera aspettandosi una dimostrazione di \norgoglio paterno per la superba imitazione. Invece il \npadre aveva il volto distorto dalla rabbia e dalla paura \ne impugnava un coltello. “ Andrai all'Inferno.” gli disse.\nReinhard fece un passo indietro. “No,” rispose, “ci \nandrai tu.”\nQuella notte fu trovato un cadavere dietro le quinte, \nma nessuno seppe dire se era il padre o il figlio, eccetto \nReinhard V ogel.\nReinhard fuggì e si fece una nuova vita – fu costrut-\ntore di bare, sentinella e marinaio – ma divenne \nfurioso di fronte all'ipocrisia della gente. Sentirsi \namato era una droga potente, perciò rubò l'identità \ndi personaggi amati e si rivestì dei loro desideri, non \npensando mai di poterne avere di propri.\nAdora le sue vittime e non riesce a capire perché il \nsentimento non sia reciproco, dato che ne vive i sogni \npiù folli. Quando viene respinto, semplicemente getta \nvia una vita e ne cerca un'altra. Ha reso un gioco l'as -\nsumere l'identità delle persone più amate, finché i \nloro cari non le abbandonano. Quando questo accade, \ndroga le sue vittime, le lega e recita la litania dei \npeccati e dei desideri che ha appagato in loro nome. \nQuando ha finito le lascia libere, ma nessuna è tornata \nalla propria vecchia esistenza.\nA volte, in quelle sere maledette in cui non è nessuno, \nsi chiede se esista una persona che non possa distrug-\ngere imitandola e se i peccati che commette in nome \naltrui non siano in realtà i suoi.\n\n♟️ Macchinazioni:\n(1) Sostituirsi a un Eroe e \ndistruggerne la fama. \nReinhard sostiene che le persone siano solo un \ncatalogo di peccati in attesa di essere compiuti, ma è \naffascinato dalla bontà. Imita solo quelle persone che \nconsidera “buone” o perlomeno “amate” . È determinato \nad avere un Eroe tra le sue grinfie per dimostrare che \nquesti è un mostro proprio come lui. Non riesce a \ncapire perché gli Eroi siano amati e lui detestato. \n(3) Scoprire il segreto per divenire \nun autentico doppelgänger. \nGli Eiseniani raccontano dei doppelgänger, creature \nsoprannaturali capaci di trovare e rimpiazzare una \npersona. Reinhard vuole essere uno di loro, ma non \nc'è alcuna magia nelle sue imitazioni. Questi racconti \nsono passati di moda di recente, forse un segno che i \ndoppelgänger sono scomparsi… ma non è proprio ciò \nin cui sono più abili? \n(5) Rapire un regnante e \nsostituirsi ad esso. \nL'elenco dei peccati di un re o una regina deve essere \nmostruoso, ma mai quanto l'indulgenza che viene \nloro concessa dalla gente. Se rimpiazzare un Eroe \nsembra affascinante, impersonare una testa coronata \nlo è ancor di più.\n\n🎭 Consigli di Interpretazione:\nQuando è travestito per ingannare qualcuno,  Reinhard è la persona che sta imitando in ogni  modo possibile. Il suo incredibile addestramento gli  permette di emulare il passo, le maniere e tutte le  peculiarità del linguaggio. Tuttavia, non è un’imi- tazione perfetta, i difetti saranno ingigantiti, le virtù  ridicolizzate e le abilità ridotte. Fuori da un travestimento, Reinhard non è nessuno.  È incerto di come comportarsi come individuo  separato dalla sua maschera, balbetta e si dimentica  le parole. Farà di tutto per trovare qualcun altro da  imitare, pur di non restare se stesso. È sorprenden- temente bisognoso d’affetto.",
        "archetype": "Malvagi Camaleontici"
    },
    {
        "id": "s7_villain_stavros_sarris",
        "name": "Stavros Sarris",
        "category": "villain",
        "type": "Malvagio (Camaleontici)",
        "nation": "Numa",
        "strength": 3,
        "influence": 10,
        "villainyRank": 13,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Contatto: Politici di Vodacce; Linguista;  Mercanteggiare; Ricco • Virtù: L’Imperatore Maestoso. Attivando questa Virtù, il GM otterrà un  Punto Pericolo per ogni Malvagio o Squadra di Sgherri  presente nella Scena. • Superbia: Il Mendicante Invidioso. Il Malvagio riceve un Punto Pericolo quando  desidera fortemente qualcosa e agisce in modo poco  accorto per ottenerla.",
        "ability": "Servitori & Sottoposti: Stavros è molto ricco e in grado di assoldare numerosi  individui per fare il lavoro sporco. Tuttavia, poiché  considera questi personaggi sacrificabili, non ha alcun  agente a lungo termine.",
        "notes": "«C’erano il mio denaro, il mio lavoro e la mia vita  in gioco nella rivoluzione. Se non volete  ripagarmi, allora mi prenderò ciò che mi spetta.»\nArchetipo: Malvagi Camaleontici\n\n📖 Storia:\nMolti di coloro che parteciparono alla guerra d'in -\ndipendenza Numana del Capitano Küçük Metaxas \nfurono sorpresi, dopo la vittoria, nello scoprire \nche non c'era alcun accordo su come organizzare il \ngoverno Numanari. Uno dei più delusi fu Stavros \nSarris, un mercante di grande successo, che aveva \nusato contatti e turpi ricatti per rendere la vita difficile \na quegli stranieri che volevano investire in una Numa \nancora non troppo libera. Fingendosi un contro-ri -\nvoluzionario pronto ad aiutare uomini d'affari da \nV odacce e dalla Mezzaluna a mantenere il controllo \ndell'isola, li convinse a fare degli investimenti, ma \nquando giunsero i soldi mandò tutto a rotoli.\nI lavori procedevano a rilento, uomini e materiali \nscomparivano, le strutture venivano realizzate \nsecondo progetti sbagliati, Stavros si scusava conti -\nnuamente e affermava che i lavori per le guarnigioni \nerano appena un attimo in ritardo. Sosteneva che, con \nun po' di denaro in più, avrebbe realizzato qualcosa \nin grado di mettere fine alla rivoluzione.\nPer un osservatore esterno, il contributo di Stavros \nalla rivoluzione di Numa è stato piccolo, ma lui è \nconvinto del contrario. Restò deluso della diversità \ndi sistemi di governo instaurati dopo l'indipendenza: \nera un macello. Avrebbe voluto prenderne il controllo \nassoluto, ma non sapeva come. Fece il giro di tutti i \nsuoi contatti del tempo di guerra, ma ricevette solo \nrisposte vaghe e deboli promesse, invece della gratitu-\ndine e del supporto che credeva di meritare.\nAbbandonata la politica, Stavros tornò a dedicarsi \nal commercio e si stupì di scoprire che molti dei suoi \ncontatti a V odacce e nell'Impero della Mezzaluna si \nfidavano di lui più dei suoi stessi compatrioti! In parti-\ncolare, i V odacce erano molto comprensivi (un fatto \neccezionale, considerato che il carattere nazionale \nli spinge a prendere ogni tradimento sul personale). \nOgni accordo che Stavros aveva infranto, ogni edificio \nche aveva sabotato era stato per Numa e che ne aveva \nricavato? I suoi connazionali non si fidavano di lui, lo \ntenevano a distanza e non appoggiavano le sue ambi-\nzioni politiche.\nStavros concepì un piano in accordo con i suoi \ncontatti a V odacce, per strappare il controllo di Numa \nagli ingrati che lo avevano messo da parte. \nL'obiettivo è di riportare Numa sotto il controllo di \nun'altra potente Nazione che ne distrugga i commerci, \nfinché Stavros non potrà sedersi sul cadavere del suo \nPaese. Un tempo sognava una Numa indipendente e \nsotto il suo controllo, ma se un dominio straniero è il \nprezzo del comando, così sia.\nIl bersaglio è il Senato, per cui ha in mente qualcosa \ndi meglio. Se Numa dovrà tornare sotto il controllo \ndi V odacce, le isole avranno bisogno di un Principe \nMercante e Stavros ha un'idea precisa di chi mettere \nsul trono.\n\n♟️ Macchinazioni:\n(1) Contrabbandare antichi \nvasi Numanari a Vodacce \nper ottenere influenza. \nI prodotti di Numa si vendono a ottimi prezzi sul \ncontinente e V odacce, capitale del consumismo, ha \nmolto denaro da spendere in oggetti rari e preziosi. \nOvviamente, dopo essere stata depredata per secoli, \nNuma oggi chiede la restituzione delle opere rubate \ne non sarebbe compiaciuta degli sforzi di Stavros per \nfarsi bello coi V odacce.\n(3) Far passare una legge che \nconsenta ai Principi Mercanti di \npossedere terre in Akragosus.\nNuma non si fida affatto di affaristi provenienti da \nV odacce, dalla Mezzaluna o da Sarmatia. Stavros mira \na ottenere una posizione di favore presso i Principi \nMercanti facendo passare un'ordinanza che permetta \na un V odacce di fare ricorso contro chiunque gli neghi \nuna proprietà al giusto prezzo.\n(5) Avvelenare Delia Nikas, del Senato \ndi Akragosus, e prendere il suo posto. \nStavros sogna di diventare il Principe Mercante di \nuna Numa sotto V odacce ma, nel frattempo, deve \naccumulare influenza e potere politico. Un seggio nel \nSenato sarebbe la strada migliore, ma la sua mancanza \ndi carisma rende l'elezione improbabile. Se un seggio, \ncome quello di Delia Nikas, diventasse improvvisa-\nmente vacante potrebbe però sfruttare i suoi contatti \nper ottenerlo.\n\n🎭 Consigli di Interpretazione:\nStavros Sarris considera se stesso e i suoi sforzi  come la colonna portante della Rivoluzione  Numanari. Certo, il suo apporto fu significativo,  ma non ha fatto tutto da solo. Stavros è maligno e  velenoso, sempre alla ricerca di una scappatoia in  ogni accordo. È un concentrato di energia rabbiosa:  i suoi piedi non stanno mai fermi, le dita tambu- rellano, cammina continuamente avanti e indietro  mentre ribolle di risentimento. Si veste bene, ma  sembra sempre che si sia abbigliato in un quinto del  tempo necessario.",
        "archetype": "Malvagi Camaleontici"
    },
    {
        "id": "s7_villain_tassine_bullet",
        "name": "Tassine Bullet",
        "category": "villain",
        "type": "Malvagio (Camaleontici)",
        "nation": "Montaigne",
        "strength": 7,
        "influence": 4,
        "villainyRank": 11,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Cameratismo; Comando; Joie de Vivre;  Schermidore; Sguardo di Ghiaccio • Virtù: Le Monete Adattabile. Attivando questa Virtù, il Malvagio può  eseguire la sua prima Azione anticipando chiunque  altro nel corso di un Round. • Superbia: Gli Amanti Divisi dal Destino. Il Malvagio riceve un Punto  Pericolo ogni volta che si innamora di qualcuno di cui  non dovrebbe.",
        "ability": "Servitori & Sottoposti: Le Ragazze del Nastro d’Oro sono Duellanti, Guardie  e Ladre. Alcune sono infastidite da Tassine e potreb- bero essere persuase a rivoltarsi contro di lei (persino  a diventare la Compagna Fidata di un Eroe), ma la  maggior parte si gode il clima di prestigio, sfarzo  e sorellanza.",
        "notes": "«Cosa fa risaltare di più il bel colore  dei miei capelli? La sciabola o la pistola?»\nArchetipo: Malvagi Camaleontici\n\n📖 Storia:\n“L ’argentea luna crescente dell’autunno luccicava miste-\nriosa tra gli alberi ondeggianti, illuminando la figura \nrobusta eppure procace della famigerata rapinatrice, duel-\nlante e icona della moda, T assine Anastasia Jade de la \nCroix Bullet. ‘Quale ironia’ pensò, ‘che una preda tanto \nallettante mi distragga dalle meditazioni sui tragici anni \ndella mia giovinezza!’ Nonostante tutto, balzò ardita -\nmente in sella al suo destriero color nocciola, Chanson-de-\nMinuit, e galoppò rapida all’inseguimento della carrozza. ”\n—Estratto da T assine Bullet, Regina dei Ladri, di \nModestine Porcher T assine Bullet\nDopo una breve storia d' amore, la madre di Modestine \nsi ritrovò con una figlia non voluta. Sopportò di farle da \ngenitore per circa due anni, prima di lasciare la piccola \nsulla soglia della casa paterna, insieme con un biglietto \nche diceva che la bambina meritava di meglio di quanto \nlei potesse darle.\nL'educazione di Modestine fu seria e banale ma quest' ul-\ntima, grazie alla professione di scrivano di Monsieur \nPorcher, almeno aveva molto da leggere. Divorò romanzi \ndi avventura, idealizzando la madre in un anti-eroina \nromantica e spavalda, in contrasto con il padre noioso. A \n13 anni Modestine scappò di casa e si unì alle Ragazze del \nNastro d' Oro, una banda di rapinatrici che lavorava sulle \nstrade fuori da Charouse e prendeva il nome dall'orna-\nmento che tutte portavano sulle spade.\nMentre si faceva strada tra i ranghi della cricca, la giovane \nscrisse un fiume di storie basate su personaggi popolari. I \nsuoi racconti erano infestati dall' abuso della forma passiva \ne da aggettivi e avverbi poco eleganti, ma Modestine \ncontinuò a credere che fosse la mancanza di soggetti origi-\nnali, non di talento, a impedire la pubblicazione degli scritti.\nSolo dopo essere diventata capo delle Ragazze del \nNastro d' Oro la situazione si rovesciò. Cambiò il suo \nnome in “T assine Bullet” , picchiando chiunque insistesse \na chiamarla Modestine, e rivoluzionò il modus operandi \ndella banda: invece di prendersela con bersagli facili comin-\nciarono a dedicarsi a quelli di alto profilo, per assicurarsi \nche le rapine facessero parlare di loro. T assine è diventata, \nintenzionalmente, la più nota criminale della regione \nintorno a Charouse.\nLe Ragazze si dedicano anche ai rapimenti come \nmetodo per creare la loro leggenda. T engono le vittime \nprigioniere nei boschi, dove T assine le tortura per ore con \nletture drammatiche delle sue avventure e costringendole \na memorizzare resoconti esagerati sulle abilità della banda. \nCosì, una volta liberate, potranno far sapere a tutti di \nT assine Bullet e delle Ragazze del Nastro d' Oro.\nOgni volta che sente parlare di un altro criminale che \nsta diventando famoso, T assine lo cerca e gli stringe le \nmani al collo, finché questi non sceglie un pensionamento \nanticipato. Se sente parlare di un Eroe o Malvagio che sta \ndiventando celebre a Charouse diventa ossessionata dalla \nsua fama e la vuole per sé. Affronta gli Eroi più interessanti \nsolo per crearsi delle rivalità famose. La domanda “Cosa \nposso fare per diventare più famosa?” domina tutte le \nsue azioni.\n\n♟️ Macchinazioni:\n(1) Distruggere il proprio \ncertificato di nascita, ultima \nprova del suo vero nome. \nDi tutti gli errori dei suoi genitori, chiamarla \n“Modestine” è stato certamente il più tragico. A \nT assine non importa quante guardie dovrà ricattare, \nstendere o bruciare vive per entrare negli Archivi \nImperiali e distruggere l'ultima prova di essere mai \nstata altri che T assine Bullet.\n(3) Sedurre il Capitano Cailloux dei \nMoschettieri e farne un alleato. \nIl Capitano Cailloux, ufficiale di collegamento tra i \nMoschettieri e le guardie delle strade, è tanto sexy \nquanto corrotto. Avendolo come alleato (e amante) \nle Ragazze del Nastro d'Oro avrebbero mano libera. \nPurtroppo è già impegnato con T alia Besson! Sarebbe \nun peccato se le accadesse qualcosa…\n(5) Rapire Aron Pons, capo \ndelle guardie delle strade. \nT assine sogna una Montaigne in cui i viaggiatori \npaghino dazi ai banditi e non al governo, in cui le sue \nrapine la rendano un eroe popolare. Aron Pons è uno \ndegli ultimi uomini onesti tra le guardie, incorruttibile \ne immune al fascino di T assine. T oglierlo dalle strade \nmaestre darebbe alle Ragazze lo spazio necessario per \nrubare ed estorcere a loro piacimento.\nEinar Ibsen\nStoria\nA V estenmennavenjar è il denaro a sostenere il \ndominio della spada, perciò chi controlla i soldi ha \nil vero potere. Questo è ciò che Einar Ibsen continua\n\n🎭 Consigli di Interpretazione:\nTassine Bullet porta di proposito molti archetipi  Eroici e Malvagi all’estremo. Se avesse dei baffi li  attorciglierebbe di continuo. Non esiste cliché,  battuta scontata o scelta di guardaroba che consi- deri inadatta. Spesso incarna versioni esagerate  dei tratti Eroici. Se si trova di fronte un Eroe  tragico, comincerà a fare monologhi sulla propria  storia, quasi volesse vincere una partita a chi è più  sfortunato. Le Ragazze del Nastro d’Oro sono la sua più grande  risorsa e più evidente debolezza. La banda ama  la vita avventurosa e di indulgenza che Tassine  promette (e garantisce), ma la considera un capo  faticoso, invadente e paternalista.",
        "archetype": "Malvagi Camaleontici"
    },
    {
        "id": "s7_villain_thora_ulfborn",
        "name": "Thora Ulfborn",
        "category": "villain",
        "type": "Malvagio (Camaleontici)",
        "nation": "Vestenmennavenjar",
        "strength": 7,
        "influence": 3,
        "villainyRank": 10,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Contatto: Rivoluzionari Vesten; Lavorare sui Tetti; Psst, Da Questa Parte; Sguardo di Ghiaccio; Tratto Leggendario: Panache • Virtù: Il Sole Gloriosa. Il Malvagio può attivare questa Virtù quando  si trova al centro dell’attenzione. Per il prossimo  Rischio ogni dado conterà come un Incremento senza  bisogno di tirare. • Superbia: Il Profeta Fanatica. Il Malvagio riceve un Punto Pericolo quando  difende vigorosamente le sue idee nel posto o nel  momento sbagliato. Società Segreta  I Liberatori",
        "ability": "Servitori & Sottoposti: Come membro dei Liberatori, Thora può riunire una  Folla composta da gente del posto e lavoratori. Inoltre,  grazie a questo legame, qualsiasi Squadra di Sgherri  creata attraverso la sua Influenza avrà la propria forza  aumentata del 50%. Per esempio, se crea una Squadra  con Forza 10, questa diventerà di Forza 15.",
        "notes": "«Il fuoco è alto, l’olio è stato versato. Le fiamme  bruceranno la corruzione… una volta per tutte.»\nArchetipo: Malvagi Camaleontici\n\n📖 Storia:\nUn tempo, il mondo era un paradiso, dove tutti potevano \nvivere e morire liberi e con dignità. Questa è la convin-\nzione che guida Thora Ulfborn nella sua battaglia contro \ni due oppressori che corrompono il mondo. Figlia di una \ncoppia di Korren, un minuscolo villaggio all' interno della \nForesta degli Jarl, Thora crebbe ignara dei problemi \ndel mondo.\nMentre cresceva, il carl della regione impose tasse \nsu tasse mandando Korren in bancarotta. Ben presto \ndivenne una città fantasma e chi restò fu condannato \na morire di fame. Durante un inverno particolarmente \nrigido non c'era più cibo a sufficienza per tutti. I suoi \ngenitori arrivarono a bollire della corteccia, mentre a lei \ntoccò l' ultimo pezzo di formaggio. Un mattino non si \nrisvegliarono più e Thora tentò di rianimarli per due \ngiorni, fino all' arrivo dell'esattore delle imposte.\nIl funzionario la portò all'orfanotrofio di Kirk. Thora \nera desiderosa di apprendere e imparò in fretta tanto a \nleggere quanto la storia. Apprese sempre di più sui mali \ndel mondo – guerra, corruzione e intolleranza – tutti \napparentemente causati da due forze: la nobiltà e la \nChiesa. Non sorprende che, quando seppe dell'esi -\nstenza dei Liberatori, fuggì dall'orfanotrofio senza mai \nguardarsi indietro.\nAd appena 16 anni Thora era già un membro di spicco \ndei Liberatori di Kirk. Come i suoi compagni, credeva \nche la nobiltà e la Chiesa stessero distruggendo il mondo, \nma ogni volta che tornava a Kirk non poteva evitare di \ndomandarsi quando tutti i discorsi sarebbero finalmente \ndiventati una vera rivoluzione. Mentre attendeva – osser-\nvando le gente morire di fame, perdere la propria terra e \nla speranza – la sua rabbia cresceva.\nQuando aveva 19 anni Thora raggiunse il punto di non \nritorno. Un conflitto tra due luminari della Chiesa rovinò \ntutti gli istituti di carità di Kirk, compreso l'orfanotrofio \nin cui era cresciuta. Mentre i fondi scarseggiavano, \nThora vide i bambini soffrire la fame mentre l' inverno si \napprossimava. Una notte, alcuni orfani accesero un fuoco \nper scaldarsi e le scintille incendiarono un materasso. \nL' intera ala prese fuoco illuminando la notte: morirono \n46 bambini e 10 inservienti.\nThora fu costretta a osservare tra la folla, incapace di \nsalvarli. Ribollente di rabbia, si diresse verso le abitazioni \ndei due luminari. Bloccò le uscite di entrambi gli edifici e \nli incendiò. In una sola notte Thora uccise due membri \npreminenti della Chiesa dei Profeti a Kirk, oltre a 15 tra \nservitori e parenti intrappolati tra le fiamme.\nThora era convinta che le sue azioni avrebbero dato \ninizio a una rivoluzione e fu sconvolta quando gli altri \nLiberatori la bollarono come una radicale. Con due \nincendi aveva ottenuto più di quanto avessero prodotto \ndue anni di incontri clandestini e propaganda. Thora \nha deciso di prendere posizione rispetto al movimento \ne ha dato il via alla sua guerra personale contro le Due \nTirannie. Intende purificare V estenmennavenjar dall' in-\nterno grazie alla più potente delle sue ossessioni: il fuoco.\n\n♟️ Macchinazioni:\n(1) Organizzare incontri segreti per \ndiffondere il messaggio di combat-\ntere contro la nobiltà e la Chiesa.\nThora è convinta che la gente di V estenmennavenjar \nsia pronta per la rivoluzione. Deve diffondere il \nmessaggio della rivolta imminente, organizzare \nincontri per reclutare persone alla propria versione \nradicale del credo dei Liberatori. Non importa quanto \nforte sia l'opposizione, il messaggio deve passare. \n(3) Condurre un brutale assalto \ncontro i diplomatici di Castille per \nscreditare lo jarl Reinn Sigurdsen. \nLo jarl locale, Reinn Sigurdsen, è diventato il nuovo \nbersaglio della furia di Thora. Fu lui a coordinare i \nsoccorsi durante il rogo dell'orfanotrofio e Thora \nlo incolpa della tragedia. La sua carriera politica è \nbasata soprattutto sul creare forti rapporti diploma-\ntici con Castille e considera gli ambasciatori come il \nsuo tesoro. Se morissero in modo atroce, questo gli \nfarebbe perdere credibilità e minerebbe il suo potere. \n(5) Bruciare Ketil Hall durante \nl’incontro tra gli jarl. \nÈ previsto un grande incontro tra gli jarl per discutere \ndi una riduzione delle tasse e degli assalti lungo le \ncoste. Non ci sarà un'altra occasione per distruggere \ntutti gli oppressori in un colpo solo. Quando saranno \ntutti riuniti, Thora intende bloccare le porte e dar \nfuoco all'intero edificio.\n\n🎭 Consigli di Interpretazione:\nThora è una zelota politica e una piromane seriale.  La sua mente è completamente rivolta agli aspetti  più sanguinosi delle sollevazioni popolari e non  intende fermarsi finché le Due Tirannie non saranno  distrutte. La sua giovane età fa sì che molti la  sottovalutino, un fatto che usa spesso a proprio  vantaggio. Rapida e attenta, si muove con passo  silenzioso e felino quando sta per appiccare un  incendio. Se necessario, è capace di riunire la gente  con discorsi commoventi, predicando il bisogno di  reclamare la perduta libertà di Vestenmennavenjar  attraverso le fiamme.",
        "archetype": "Malvagi Camaleontici"
    },
    {
        "id": "s7_villain_adeliadis_petronilla_fassequele",
        "name": "Adeliadis Petronilla Fassequele",
        "category": "villain",
        "type": "Malvagio (Geni del Male)",
        "nation": "Montaigne",
        "strength": 4,
        "influence": 10,
        "villainyRank": 14,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Amicizie Altolocate, Orologio Biologico,  Scuola di Maniere, Vieni qui • Virtù: Il Sole Gloriosa. Il Malvagio può attivare questa Virtù quando  si trova al centro dell’attenzione. Per il prossimo  Rischio ogni dado conterà come un Incremento senza  bisogno di tirare. • Superbia: La Strega Manipolatrice. Il Malvagio riceve un Punto Pericolo  quando tenta di sfruttare qualcun altro per fare il suo  lavoro sporco e la cosa si rivolta contro di lei.",
        "ability": "Servitori & Sottoposti: Adeliadis ha un piccolo contingente di Guardie pronte a  proteggerla in ogni momento. Può assoldare altri indi- vidui secondo le necessità, ma il grosso del suo potere  deriva dai circoli sociali. È più probabile che cerchi di  ricattare i suoi nemici, piuttosto che farli uccidere con  spade e pallottole.",
        "notes": "«Vediamo, quanto possiamo far diventare rossa  la faccetta bianca di quell’odiosa Fronsac! Voglio  ridimensionarla un po’ prima del Ballo di Primavera…»\nArchetipo: Malvagi Geni del Male\n\n📖 Storia:\nAdeliadis ha sempre avuto tutto: autentica figlia \ndella nobiltà di Charouse, è cresciuta circondata da \nintrighi di Corte, invece di bontà e gentilezza. Il padre, \nEtienne, era un celebre libertino, con un'enorme \ncollezione di amanti. La madre, Genevieve, era un \npubblico ministero con una serie ininterrotta di cause \nvinte. Entrambi avevano raramente tempo l' uno per \nl'altra, ma Adeliadis faceva in modo che avessero \nsempre tempo per lei, non importa quali trucchetti \ndovesse organizzare.\nPrendendo spunto dalle spietate azioni legali della \nmadre, cominciò i suoi primi intrighi manipolando \na proprio vantaggio le amanti del padre. Etienne si \ndisperò dei propri fallimenti romantici e, invece di \npunire ed educare la figlia, cominciò a scrivere tomi su \ntomi di poesie auto-indulgenti. Genevieve comprese \nche era necessario che la figlia, dotata di un simile raffi-\nnato intelletto, apprendesse l'autocontrollo. Insegnò ad \nAdeliadis come destreggiarsi tra le politiche di Corte, \nma morì di consunzione prima di riuscire a mitigarne \ngli istinti depravati. Senza la madre, il genio crudele di \nAdeliadis divenne inarrestabile.\nIl padre tentò di risposarsi, ma Adeliadis sabotò ogni \nfidanzamento. Oggi Etienne è ridotto come un vecchio \neremita e vive recluso nella tenuta di famiglia lontano \nda Charouse. Ogni giorno, riceve dalla figlia lettere \nprofumate, in cui lei gli racconta in modo elegante \nle proprie avventure. Lo incoraggia continuamente a \nscrivere le sue memorie, come tutti gli uomini saggi \ndovrebbero fare negli anni del proprio declino, e gli \npromette che le farà pubblicare, una volta adeguata-\nmente rivedute e corrette.\nIl circolo di cortigiani di Adeliadis – noti come Les \nPapillons – Le Farfalle – è formato da giovani che \neseguono ogni suo desiderio, felici di divertirsi a spese \naltrui. Lei li mette spesso anche gli uni contro gli altri, \nper garantire che la sua posizione dominante non sia \nminacciata. Li sfrutta per eseguire diversi compiti – \nmettere a nudo le vergogne di un giocatore d'azzardo, \nporre in imbarazzo dei giovani amanti di fronte ai \nloro pari o rubare lettere private e compromettenti – \nmentre lei svolazza, come una bella farfallina, e osserva \nla fine delle sue vittime.\nEssendo ormai divenuta una bellissima donna, corteg-\ngiata da decine di giovanotti, Adeliadis ha scoperto \nquanto sia utile eliminare i seccatori facendoli duellare \ntra loro. Per lei vedere questi giovani sciocchi elimi-\nnarsi l' uno con l'altro è un bel passatempo. Queste \nsue abitudini sanguinose hanno cominciato ad attirare \nl'attenzione della Guardia Fulmine, che ha visto il suo \nnome associato di frequente a tali duelli illegali.\n\n♟️ Macchinazioni:\n(1) Ricattare un maestro spadaccino \nper eliminare le sue nemiche.\nLe attuali nemiche di Adeliadis sono un gruppo di \ngiovani dame di Corte – dette “Le Pleiadi” – che \nhanno cominciato ad attaccare lei e Les Papillons \ntramite astute manovre sociali. Il loro capo, Giselle, è \nuna Duellante V alroix e Adeliadis teme che potrebbe \nsfidarla presto. Consapevole di ciò, ha messo gli occhi \nsul Maestro Rodolphe de Saint-Nectaire, che è molto \nindebitato e potrebbe essere “persuaso” a chiudere la \nfaccenda prima che esploda. \n(3) Ottenere prestigio come \namante dell’Empereur.\nL' Empereur sta progettando una festa campestre \ndi primavera durante la quale, come da tradizione, \npasserà del tempo con la sua amante ufficiale. \nAdeliadis vuole fare in modo che quel giorno l'at -\ntuale favorita sia indisposta. T utto ciò che dovrà fare, \nallora, è attendere insieme alle altre dame. Di recente, \nl' Empereur le ha rivolto la parola molto spesso, lei ha \nflirtato inviandogli biglietti e regali e crede di avere \nnotato un interesse.\n(5) Distruggere la reputazione \ndell’Imperatrice con pettegolezzi.\nAdeliadis vuole distruggere la reputazione dell'Im -\nperatrice per poter diventare lei stessa, in quanto \namante dell' Empereur, la donna più potente a Corte. \nT uttavia, l'Imperatrice è una Strega della Sorte, cosa \nche rende qualsiasi attacco estremamente difficile e \npericoloso. Adeliadis ha ordinato a Les Papillons di \norganizzare una serie di piccoli incidenti, apparen -\ntemente causali, contro le figlie dell'Imperatrice per \nindebolire la Strega.\n\n🎭 Consigli di Interpretazione:\nAdeliadis è bella, ha un intelletto finissimo e ne è  consapevole. Se solo lo volesse potrebbe diventare  una grande studiosa o un brillante generale, ma  queste idee per lei non hanno valore. Ciò che le  interessa sono le lievi, ma devastanti, macchinazioni  dei potenti. Parla in tono ritmato e sereno e non  rivela mai la sua crudeltà finché la vittima designata  non è esattamente dove vuole lei. Spesso porta al  guinzaglio un piccolo animale, come una scimmietta,  agghindato oltremisura. Il modo in cui tratta queste  bestiole è un indicatore del suo stato emotivo,  perché non nasconde i propri sentimenti a coloro su  cui ha il controllo totale.",
        "archetype": "Malvagi Geni del Male"
    },
    {
        "id": "s7_villain_agafya_markova",
        "name": "Agafya Markova",
        "category": "villain",
        "type": "Malvagio (Geni del Male)",
        "nation": "Ussura",
        "strength": 8,
        "influence": 8,
        "villainyRank": 16,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Comando, Lavorare sui Tetti, Ricca,  Stregoneria: Tocco della Madre 1, Volontà  Indomabile • Virtù: Il Mendicante Perspicace. Attivando questa Virtù, l’Eroe può scoprire il  Grado di un Eroe in un qualsiasi Tratto o Abilità, oppure  il suo Hubris. • Superbia: . Hubris: I Troni Testardo. Il Malvagio riceve un Punto Pericolo quando si  rifiuta caparbiamente di cambiare idea dinanzi ai fatti. Stregoneria Agafya ha il Dono della Resurrezione e la Restrizione  della Dignità (vedi Appendice).",
        "ability": "Qualità Mostruose: Agafya ha la Qualità Mutaforma, con una limitazione:  può assumere solo l’aspetto di altri umani. Tuttavia  questa Qualità è legata alla Restrizione della sua  Stregoneria (vedi Appendice). Finché non completerà la  sua Penitenza non potrà accedere a questo potere.\n\nServitori & Sottoposti: Agafya ha numerose Guardie e Duellanti pronti a  servirla. Non ha a disposizione alcuna spia affidabile  e, se mai dovesse ottenere simili alleati, sarebbero dei  Ladri che rispondono a lei direttamente.",
        "notes": "«L’unico modo per comandare è attraverso  il controllo assoluto dei propri sudditi. Come  potrei proteggere la mia gente se non seguissero  i miei ordini alla lettera? La resistenza deve essere  colpita duramente, prima che possa diffondersi.»\nArchetipo: Malvagi Geni del Male\n\n📖 Storia:\nSi dice che i gemelli siano un dono dei Leshiye e, \nforse, è per questo che Viktor e Agafya sono entrambi \nnati con gli occhi verdi tipici dei prescelti di Nonna \nInverno. Agafya era tecnicamente la primogenita, \nessendo nata per prima, e avrebbe dovuto ereditare \nla terra dei suoi genitori, ma non riusciva a pensare di \nregnare senza il fratello al suo fianco.\nAgafya ha sempre amato quelle mattine in cui si \nsvegliava e il mondo era coperto da una coltre di neve \nimmacolata. Le ricordavano quando da piccola, usciva \ndi nascosto con il fratello a giocare su quella perfetta \ndistesa bianca. In una di queste mattine, Agafya decise \ndi andare a caccia. Scesa di sotto, trovò Viktor ad \nattenderla con i suoi stivali rossi di pelliccia ai piedi. \nCercò di convincerlo a restare a casa, dato che non \nera stato bene, ma lui insistette ad accompagnarla \nin ricordo dei vecchi tempi. Li colse una tempesta \nmentre tornavano a casa e tutto ciò che poterono \nfare fu scavarsi un rifugio nella neve. La tormenta \ncontinuò per ore, la mano di Viktor, che stringeva \nquella della sorella, divenne gelida e con un leggero \nbrivido esalò l'ultimo respiro.\nAll'improvviso, una mano grinzosa trasse Agafya \ndalla neve e la giovane si rese conto che era Matushka \nin persona, venuta a salvarla. La implorò di salvare \nanche il fratello, terrorizzata all'idea di restare sola. La \nvecchia ridacchiò e trasse una fiala dallo stivale infan-\ngato. Agafya la afferrò, non le importava del terribile \nprezzo: avrebbe dovuto imparare a cavarsela da sola.\nNon raccontò mai a Viktor la verità, perciò lui non \ncomprese perché lei dovette bandirlo per rispettare \nla parola data a Matushka. La mente della giovane \npensò e ripensò alle parole della Madre, ma l'unico \nmodo che aveva trovato per rispettare il patto era \nallontanare il fratello.\nAgafya fu costretta a combattere contro la sua stessa \nnatura e il suo cuore si spezzò, ma come un fiume \ncambia il suo corso anche lei si adattò. La sofferenza \ncostante alimentò una forma di crudele persistenza. \nCominciò a considerare le emozioni come un ostacolo \nalla chiarezza logica di cui aveva bisogno per regnare.\nConcentrandosi su come mantenere il controllo \nassoluto, usò il Dono di Matushka per cambiare il \nproprio aspetto e mescolarsi al popolo, per coglierne \ngli umori. Se intuiva la presenza di ribelli, li faceva \narrestare di notte nei loro letti e giustiziare pubblica-\nmente. T utto procedeva bene finché non arrivò “l' Eroe” .\nViktor era tornato per liberare il popolo da Agafya, \nma le sue forze lo fermarono subito. Quando lo \nportarono di fronte a lei, Agafya fece l'unica cosa che \nsi era ripromessa di non fare mai: risparmiò la vita \nall'ingenuo fratello. Nel tentativo di distruggere l'ul -\ntima scheggia di compassione nel proprio cuore, fece \nscacciare Viktor. Era ormai molto lontano, quando lei \nsi accorse di avere perso il Dono.\n\n♟️ Macchinazioni:\n(1) Fare di un popolano fidato una spia.\nSenza il Dono del Camuffamento, Agafya non è più in \ngrado di spiare la popolazione. Avere un agente fidato \nle renderebbe assai più facile controllare eventuali \nsviluppi indesiderati ma, sin dall'esilio del fratello e \ndalla creazione dei campi di lavoro, la sua immagine \nè stata rovinata e il popolo non si fida più di lei. \n(3) Distruggere i ribelli che \nsi oppongono al suo regno.\nDi recente, un gruppo di ribelli ha intrapreso nume-\nrose azioni di guerriglia. Agafya spera che il fratello sia \nil responsabile, così da poterlo uccidere, fare ammenda \ne riottenere il Dono. Prima di tutto, però, ha bisogno \ndi ottenere maggiori informazioni. Le sue guardie \nl' hanno informata che un mercante, Sergei, potrebbe \nsapere qualcosa.\n(5) Imprigionare tutti i dissidenti \nin un campo di lavoro.\nAgafya crede che il controllo totale sia una necessità \nper un governo efficiente. A questo scopo ha creato \nun campo di prigionia per tutti i dissidenti. Senza \nnessuno che si opponga o organizzi il popolo contro di \nlei, suo fratello avrà enormi difficoltà a detronizzarla.\n\n🎭 Consigli di Interpretazione:\nLa stretta aderenza alla logica di Agafya può  sembrare comprensibile in un primo momento, ma  la sua personalità gelida e la tendenza alla crudeltà  non sono affatto piacevoli da osservare. Sorride di  rado e, quando lo fa, mostra un ghigno tanto falso  da far accapponare la pelle. È dispotica e ha poca  pazienza per gli sciocchi convinti di poterle dire  come governare le sue terre.",
        "archetype": "Malvagi Geni del Male"
    },
    {
        "id": "s7_villain_anatol_akalewicz",
        "name": "Anatol Akalewicz",
        "category": "villain",
        "type": "Malvagio (Geni del Male)",
        "nation": "Confederazione Sarmatiana",
        "strength": 3,
        "influence": 7,
        "villainyRank": 10,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Contatto: Criminalità Sarmatiana, Fama:  Filantropo, Tratto Leggendario: Acume • Virtù: Il Profeta Illuminato. Attivando questa Virtù, per tutta la durata  della scena il Malvagio si accorge automaticamente  quando qualsiasi altro personaggio mente. • Superbia: L’Imperatore Testa Calda. Il Malvagio riceve un Punto Pericolo  quando perde le staffe o provoca guai. Società Segreta  I Liberatori.",
        "ability": "Servitori & Sottoposti: Assassini, Duellanti, Guardie, Ladri e Pirati chiamano  Anatol “capo” .",
        "notes": "«Credi che la Libertà Dorata abbia rivoluzionato  tutto. Quaggiù non è cambiato molto.»\nArchetipo: Malvagi Geni del Male\n\n📖 Storia:\nUn tempo, nella Confederazione, molti credevano \nche Anatol Akalewicz sarebbe diventato uno dei più \ngrandi paladini dei lavoratori. Figlio di un uomo d'af-\nfari, Anatol crebbe ascoltando discorsi politici sulla \nnecessità della sovranità del popolo e sul diritto all'au-\ntodeterminazione. Credeva fermamente di avere una \nparte in tale futuro e faceva esercizio di tali virtù negli \naffari. Lavorò a stretto contatto col padre e, quando \nquesti morì, ereditò l'azienda di famiglia.\nUna volta al comando, Anatol comprese quali livelli \ndi corruzione impedivano al popolo di divenire \ndavvero uguale alla nobiltà: molti tra i privilegiati \nusavano il proprio denaro per tenere la gente comune \nin riga e rigettavano la Libertà Dorata. Nonostante il \ncostante sfruttamento dei poveri lo frustrasse, tentò \ndi essere un buon cittadino.\nInfine, decise di fare la sua parte e di chiedere \nal Sejm una maggiore trasparenza nella politica \ninterna, convinto che un popolo informato avrebbe \npotuto interagire meglio con il sistema. Anatol parlò \nappassionatamente e con eloquenza, sia in pubblico \nsia in privato, difendendo la propria posizione, ma \ncome risultato, la sua azienda fu bruciata e distrutta. \nMentre osservava i suoi uomini bruciare vivi, notò un \nindividuo che fuggiva. Furioso, catturò l'incendiario, \ncon l'intento di portarlo alle autorità, ma questi rise \ndicendo che non ci sarebbe stato alcun processo, \ngrazie al suo protettore.\nLa furia di Anatol esplose e massacrò il criminale \nsul posto a mani nude. Certo di essere arrestato, si \nnascose in una taverna dove entrò in contatto con un \nesponente della criminalità locale: Berchik Russalek. \nQuesti spiegò ad Anatol che poteva aiutarlo ad \nevitare le ripercussioni politiche, l'accusa di omicidio \ne persino a ricostruire la sua azienda. T utto ciò di cui \naveva bisogno era la protezione che il crimine orga -\nnizzato poteva dargli. Anatol fu pronto a fare il patto.\nNegli anni seguenti, Anatol divenne parte dell'am-\nbiente criminale della Confederazione. T utta la sua \nrabbia e la sua frustrazione vennero riversate nell'e-\nliminare ogni avversario e tutti i suoi scrupoli morali \nfurono spazzati via. Ben presto fondò una propria \norganizzazione, predicando un'idea: l'uomo comune \nnon poteva dipendere dai governi.\nOggi, i suoi racket, il contrabbando e i furti di armi \nsono tutti mirati contro la nobiltà e usa i suoi contatti \ncriminali per influenzare la politica. Anatol sogna di \ntrasformare il suo impero criminale in un governo \nombra alternativo al Sejm, un braccio politico della \nclasse mercantile in grado di affrontare ad armi pari \nla nobiltà corrotta.\n\n♟️ Macchinazioni:\n(1) Scoprire la talpa all’interno \ndella sua organizzazione. \nI membri del Sejm hanno tentato per anni di smantel-\nlare l'organizzazione di Anatol. Oggi, le autorità hanno \nmesso le mani su importanti segreti, noti solo ai suoi \nfedelissimi. C'è una talpa e Anatol intende trovarla \nprima che possa distruggere tutto ciò che ha creato. \n(3) Ricattare o “convincere” il \nnobile Adomas Valdas di Curonia \na rinunciare al potere.\nAdomas V aldas non è un brav'uomo: è responsabile \ndi aver quasi fatto morire di fame la popolazione, \nmentre firmava contratti per produrre armi. È impe-\nrativo trovare delle informazioni per ricattarlo e fargli \nperdere potere. Se le armi che ha costruito finissero \nnelle mani di Anatol sarebbe un'ironia deliziosa. \n(5) Far sopprimere i privilegi \ndella Camera Alta del Sejm \nattraverso un voto. \nPersino dopo l'inizio della Libertà Dorata, il Sejm \nconserva troppo potere. Molti amano l'idea che il \npopolo abbia più autorità nella Confederazione, ma \nquesto movimento è stato finora ostacolato. Forse \nè tempo che Anatol esca allo scoperto e trasformi \nquesto programma politico in realtà.\n\n🎭 Consigli di Interpretazione:\nUn tempo, Anatol era un individuo piacevole con  ideali semplici, ma quei giorni sono ormai lontani.  Nonostante mantenga la facciata del carismatico  uomo del popolo, è diventato uno spietato crimi- nale, pronto a commettere qualsiasi nefandezza  pur di ottenere un vantaggio. Gli piace considerarsi  ancora una persona semplice e si circonda di pochi  oggetti accuratamente selezionati, invece che di  lusso e sfarzo. Coraggioso e schietto, non rifiuta  mai lo scontro e ama una bella discussione di  politica. Non si muove mai senza un paio di guardie  del corpo.",
        "archetype": "Malvagi Geni del Male"
    },
    {
        "id": "s7_villain_facio_contarini",
        "name": "Facio Contarini",
        "category": "villain",
        "type": "Malvagio (Geni del Male)",
        "nation": "Vodacce",
        "strength": 3,
        "influence": 13,
        "villainyRank": 16,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Lampo di Genio: Matematica, Orologio Biologico, Scuola di Maniere • Virtù: La Notte Senza Luna Discreto. Quando agisce dietro le quinte o attraverso  un intermediario il Malvagio può attivare questa Virtù.  Per il prossimo Rischio ogni dado conterà come un  Incremento senza bisogno di tirare. • Superbia: Le Monete Implacabile. Il Malvagio riceve un Punto Pericolo  quando si mette nei guai rifiutandosi di lasciare in pace  qualcuno o di ritirarsi quando è in vantaggio.",
        "ability": "Servitori & Sottoposti: Gli agenti di Facio sono di generi diversi: Duellanti,  Guardie, Ladri e Pirati in numero variabile. È tutto ciò  che occorre per portare a termine il lavoro.",
        "notes": "«L’avarizia è per i dilettanti. Perché sprecare   denaro per comprare le pedine, quando   si possono acquistare direttamente i giocatori?»\nArchetipo: Malvagi Geni del Male\n\n📖 Storia:\nFacio Contarini è sempre stato bravo coi numeri. \nFiglio di un piccolo commerciante di Porto Spatia, \nFacio preferì i libri contabili ai piaceri decadenti della \ngrande città. Mentre i suoi amici passavano le gior -\nnate a osservare pigramente le navi che transitavano \nnel porto, il giovane lavorava nell'ufficio del padre. I \nnumeri sembravano cantare di fronte ai suoi occhi e \nlui era il direttore dell'orchestra.\nGli sforzi di Facio, sempre attento, eccellente calco-\nlatore e pronto a trovare ogni possibile vantaggio, \ndiedero i loro frutti: per ogni moneta investita ne \nguadagnava tre. Quando prese in mano l'azienda \nl'aveva ormai già trasformata da piccolo ufficio \ncommerciale a una delle più potenti banche del Paese.\nNonostante la sua ricchezza, Facio divenne irre -\nquieto: far soldi gli veniva facile. La sua natura austera, \nunita alla mancanza di vizi, non era certo un antidoto \nalla noia. Un matrimonio d'interessi con Lucia Sforza, \nerede di una compagnia di navigazione, gli diede un \nletto freddo ma un libro contabile bollente. Grazie ai \ndenari di lui e ai contatti di lei, la Banca Contarini aprì \nfiliali in ogni angolo di Théah.\nOggi Facio è il capo di una delle più ricche banche \ndel continente e ha guadagnato il rispetto e la fiducia \ndei Principi Mercanti, ma ciò non gli basta. Si è \naccorto da tempo che denaro e simboli di ricchezza \nper lui non hanno valore. Il suo piacere non viene \ndall'accumulo di ricchezza, ma dalla manipolazione \nnecessaria a realizzarla.\nAvendo già stracciato ogni possibile avversario nell'a-\nrena finanziaria, Facio si è messo in testa di sfidare \ni Principi Mercanti, convinto che solo loro possano \ndargli il brivido che cerca. Intende partecipare \nal “grande gioco” , anche solo per il gusto della sfida. \nDotato dello stesso intuito di suo padre, ma privo di \nscrupoli morali, Facio manipola la trama della finanza \nper ottenere la fiducia incondizionata dei Principi. \nSinora né i Bernoulli, né i Villanova, né i Caligari, né \nalcun altro hanno potuto dire meno che bene di lui.\nGrazie a una reputazione impeccabile, Facio e la \nBanca Contarini sono diventati il metodo preferito \ndai Principi per gestire le loro proprietà e dirimere \ncomplesse questioni commerciali.\nÈ in questo campo che Facio indulge nel suo piacere \npiù segreto: ingannare i potenti. Lasciato privo di \ncontrollo, distruggerebbe i vassalli dei Principi e ne \npreparerebbe la caduta, solo per il gusto di farlo.\n\n♟️ Macchinazioni:\n(1) Mandare in bancarotta i figli \ndi Gespucci Bernoulli e vendere \ni loro debiti a Villanova.\nFacio lavora giorno e notte per intrappolare i figli \ndecadenti di Gespucci Bernoulli in una rete di vizi \ne debiti da cui non potranno mai scappare. “Zio \nFacio” sta usando i suoi agenti per fornire loro le più \nbelle cortigiane, le spade più raffinate e le droghe più \nesotiche. Quando saranno disperati, Facio venderà \ni loro debiti a Villanova, rendendoli schiavi del loro \npeggior nemico. \n(3) Mettere le mani sui registri \nsegreti della Lega Vendel.\nFacio non limita le sue macchinazioni alla sola \nV odacce e ha preso di mira la Lega V endel. Ha inviato \nuno dei suoi migliori agenti, Antonio Peruzzi, a procu-\nrarsi copia dei registri segreti della Lega. Fingendosi \nun mercante di vini, Antonio ha saldato i debiti di un \nV endel ed è ormai solo questione di tempo prima che \nchieda al suo nuovo “amico” di consentirgli “l'onore” di \npoter dare un'occhiata ai registri.  \n(5) Ricattare i pirati affinché \nconducano la flotta del tesoro \ndei Caligari nelle sue mani.\nFacio è stato informato che una flotta dei Caligari \nprocede lentamente sotto il peso di tesori Syrneth, tra \ncui forse persino il segreto della vita eterna, prove -\nnienti dalla terra maledetta di Ifri. Perseguitata dal \ncattivo tempo e da apparizioni inquietanti, la flotta \nviaggia lentamente di porto in porto e Facio ha inviato \ndei corsari affinché conducano queste navi verso la sua \nisola privata.\n\n🎭 Consigli di Interpretazione:\nFacio è il ritratto, falso, dell'austerità, del rispetto  e della professionalità. I suoi nemici hanno speso  una fortuna, senza alcun successo, alla ricerca di  una minima traccia di vizi, oltre alla sua predilezione  per un bicchiere di Porto di Odisseo dopo cena e  al collezionare monete antiche. Facio non duella,  né gioca d’azzardo o manifesta la decadenza tipica  dei suoi compatrioti. È la rappresentazione fisica  dell’avarizia… abbigliata nella banalità del genio  finanziario. Guarda sempre in faccia le sue vittime e  sorride, prima di strangolarle in una rete di intrighi.",
        "archetype": "Malvagi Geni del Male"
    },
    {
        "id": "s7_villain_fritjof_larsen",
        "name": "Fritjof Larsen",
        "category": "villain",
        "type": "Malvagio (Geni del Male)",
        "nation": "Vestenmennavenjar",
        "strength": 3,
        "influence": 3,
        "villainyRank": 6,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Ispirare Generosità, Ricco, Un Semplice  Malinteso • Virtù: The Road Amichevole. Attivando questa Virtù quando il Malvagio  incontra un personaggio per la prima volta, anche un  Eroe, questi lo tratterà amichevolmente per una Scena. • Superbia: L’Impiccato Indeciso. Il Malvagio riceve un Punto Pericolo quando  spreca un’Azione esitando in preda al dubbio o  all’incertezza.",
        "ability": "Servitori & Sottoposti: Guardie e Ladri costituiscono il grosso degli agenti di  Fritjof, ma ha anche alcuni Pirati ai suoi ordini.",
        "notes": "«Venite a casa mia… convinti di poter fare affari,  senza mostrarmi il dovuto rispetto? Forse una nuotata  nelle gelide acque della baia vi schiarirà le idee.»\nArchetipo: Malvagi Geni del Male\n\n📖 Storia:\nAnita Larsen era di umili origini. La sua famiglia era \nformata da huscarl – guardie della casa – di nobili \nminori nella regione di Kirk, ma finì in rovina quando \ni loro signori vennero uccisi o mandati allo sbando \ndopo aver tentato di depredare la città sbagliata nelle \nHighland. I genitori divennero manovali e raramente \nfacevano lo stesso lavoro per più di due settimane, ma \nlei voleva di meglio per tutti loro. Era tenace, affidabile, \ngradevole e riuscì a farsi strada nella gilda dei carrozzai, \nfino a diventarne rappresentante presso la Lega V endel.\nIl fratello minore, Fritjof, condivideva le sue ambizioni, \nma non le stesse qualità. Aveva passato l' infanzia a \ncercare di essere migliore della sorella, alla ricerca di \nmaggiore attenzione da parte dei genitori o di chiunque \naltro, senza successo. Peggio ancora, la sorella gli dimo-\nstrava un' infinita pazienza e comprensione. Si sentiva \nnon amato, un gremlin di cui tutti semplicemente \naccettavano l'esistenza.\nCon il passare degli anni, Fritjof divenne sempre più \nchiuso e cerebrale e Anita più socievole. Lui si iscrisse \nall' università, ricevendo una costosa educazione, \nmentre lei faticava come conducente di carri, il primo \npasso della sua carriera politica. Fritjof si immerse nei \ntesti di teoria politica, per capire cosa avesse sua sorella \nin più di lui, cosa le dava quei successi a cui lui ambiva.\nLesse per intero Fini e Mezzi di Cristoforo Scarovese, \nsenza comprendere che si trattava di una satira sui \ncattivi regnanti e ignorò completamente Le Discipline \ndello stesso autore. Decise quindi di applicare i metodi \ndei peggiori regnanti della storia di V odacce: qualsiasi \npotere desiderasse se lo sarebbe preso e avrebbe ucciso \ntutti i suoi nemici.\nEbbe dei notevoli successi iniziali: convinse Arvid \nHolt, il suo miglior amico dell' università, a sponso-\nrizzare il suo ingresso nella flotta commerciale della \nLega V endel. Quindi organizzò una serie di incidenti, \navvelenamenti e altri tradimenti per indebolire o elimi-\nnare i suoi rivali. La violenza spesso si risolve a favore \ndell'aggressore e Fritjof era già in lizza per divenire \ncarl di un importante distretto commerciale, senza che \nnessuno sospettasse nulla.\nQuando Anita cominciò a fare campagna elettorale \ncontro di lui, lo colse completamente di sorpresa. T entò \ndi parlarle, ma lei fu fredda e distante: non era disposta \na ritirarsi se lui non si fosse pentito di ciò che aveva \nfatto. Fritjof sfruttò la fiducia della sorella e la avvelenò, \nrimuovendo l' unico vero ostacolo alla sua elezione.\nDa allora Fritjof è diventato sempre meno cauto. \nOrganizza feste lussuose e si intrattiene con esponenti \ntanto della politica quanto del crimine. La Lega V endel \nvorrebbe farlo cadere, ma si è circondato di numerose \nprotezioni, fisiche e politiche. Non è la prima volta che \naccade e la Lega non permetterà che si ripetano gli \neventi della Compagnia Commerciale Atabeana.\n\n♟️ Macchinazioni:\n(1) Incendiare la casa della sorella per \neliminare le prove dei suoi crimini.\nIl piano di Fritjof per uccidere Anita fu astuto: nel \ncorso di numerose visite, grazie all'aiuto di servitori \ncorrotti, le riempì la casa di cibo e bevande contenenti \npiccole quantità di veleno. Questo la fece ammalare \ne poi morire in alcune settimane. Purtroppo le \nvivande avvelenate sono ancora in casa, in attesa degli \ninvestigatori. \n(3) Prendere il comando \ndell’organizzazione criminale \n“Esercito degli Orsi Mannari” di Kirk.\nNeppure la Lega V endel sa come comportarsi nei \nconfronti degli Orsi, che hanno le loro grinfie in ogni \naffare losco di Kirk, dal contrabbando, al traffico di \nesseri umani, alla falsificazione. Fritjof apprezza come \ngli Orsi fanno affari e spera che un patto clandestino \ncon loro gli dia una leva sufficiente a perfezionare tutti \ni suoi piani nefandi.\n(5) Avvelenare il suo miglior \namico, Arvid Holt, e rubarne la \ncompagnia di navigazione. \nArvid e Fritjof erano compagni di stanza all'univer -\nsità e sono rimasti ottimi amici dopo la laurea, ma gli \nenormi successi di Arvid come magnate lo hanno reso \ncompiacente. Il tono sempre più sollecito e moralizza-\ntore delle lettere di Arvid fa temere a Fritjof che il suo \namico possa avere scoperto qualcosa. Il veleno ha già \nfunzionato una volta… quindi, perché non riprovarci?\n\n🎭 Consigli di Interpretazione:\nFritjof è il classico politico corrotto. Indossa sempre  abiti più costosi e sgargianti del necessario. Quando  parla lo fa in tono rilassato e conviviale, come se  fosse amico di tutti. È convinto di essere ben più  subdolo di quanto sia realmente. Forse un tempo era  vero, ma dopo i suoi primi successi nell’avvelenare  e nel ricattare è diventato presuntuoso e pigro. Se  qualcuno lo adula a dovere potrebbe persino comin- ciare a fare un monologo sulle sue ambizioni.",
        "archetype": "Malvagi Geni del Male"
    },
    {
        "id": "s7_villain_gabriella_angelo",
        "name": "Gabriella Angelo",
        "category": "villain",
        "type": "Malvagio (Geni del Male)",
        "nation": "Eisen",
        "strength": 7,
        "influence": 2,
        "villainyRank": 9,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Affascinare, Mano Lesta, Mercanteggiare, Riflessi Rapidi: Nascondersi, Sorriso  Disarmante • Virtù: Il Sole Gloriosa. Il Malvagio può attivare questa Virtù quando  si trova al centro dell’attenzione. Per il prossimo  Rischio ogni dado conterà come un Incremento senza  bisogno di tirare. • Superbia: L’Eroe Avventato. Il Malvagio riceve un Punto Pericolo quando  la sua eccessiva sicurezza nell’agire mette nei guai lui e  un altro.",
        "ability": "Servitori & Sottoposti: Gli agenti di Gabriella sono Duellanti e Ladri.",
        "notes": "«Nulla da scommettere? Non essere sciocca, carina.  Tutti hanno qualcosa da mettere sul piatto.»\nArchetipo: Malvagi Geni del Male\n\n📖 Storia:\nGabriella Angelo imparò a giocare a carte per soldi \nquando aveva 6 anni, un vero prodigio. A 10 era \nconsiderata tanto straordinaria che sua madre riuscì \na uscire dall'indigenza noleggiando a ore la figlia \nper partite contro, i cosiddetti, migliori giocatori \ndi V odacce, ansiosi di misurarsi con questo genio \npre-adolescente.\nGabriella ha bei ricordi di quel periodo. Ogni \npartita e ogni avversario erano una sfida; il denaro \ndi sua madre – e il suo – dipendevano dall'esito di \nqueste giocate. Essere un genio non voleva dire che \nvincesse sempre, ma i clienti pagavano e la madre mise \nin banca parecchi soldi, si sposò con un fioraio e smise \ndi appoggiarsi alla figlia.\nGabriella però continuò a giocare. A 16 anni era \normai assuefatta al brivido del gioco, ma con la tran-\nquillità economica questa sensazione veniva a mancare. \nCosì giocò e perse ogni risparmio, lasciando la madre \ne il patrigno nell'assoluta povertà, e partì alla ricerca \ndei peggiori inferni del gioco clandestino, luoghi dove \nsi scommetteva tanto la vita quanto il denaro.\nGabriella perse entrambe le dita medie durante la \nsua prima notte in una di queste bolge, ma nei suoi \nricordi c'è spazio solo per il brivido che provò, nono-\nstante la paura. La notte successiva scommise e perse \nla sua vita su un semplice lancio di dadi, ma il suo \ncreditore non si presentò, anzi venne trovato morto \nin un canale. Apparentemente aveva fatto la medesima \nscommessa la sera precedente ed era fuggito senza \npagare. Quando capì cos'era accaduto, Gabriella rise \na più non posso. Per i sei giorni seguenti scommise la \nvita su quegli stessi dadi e non perse mai.\nDopo un po', persino queste scommesse sanguinose \ncominciarono a perdere il loro fascino. Molti avver-\nsari potevano cavarsela benissimo senza un dito e le \nscommesse sulla vita stavano diventando sempre più \nrare. Gabriella ritrovò il brivido del gioco nel togliere \nagli avversari ciò che avevano di più caro: si rifiutava \ndi scommettere per una posta inferiore alla loro asso-\nluta rovina.\nHa vinto coniugi, genitori, bambini, vaste proprietà \ne flotte mercantili, ma è pronta a rimettere tutto sul \npiatto, purché l'avversario sia disposto a fare altret -\ntanto. Per molti questa si è rivelata una tentazione \ntroppo grande e quindi Gabriella continua a giocare.\n\n♟️ Macchinazioni:\n(1) Ottenere il veleno perfetto \nper le proprie carte.\nGabriella ha cominciato a fare esperimenti con le \npozioni usate contro di lei da avversari disperati, ma \nogni veleno che ha usato sulle sue carte si è rivelato \ntroppo evidente. Si rifiuta di usare una mistura che \nsia individuabile dopo l'applicazione. Sembra che la \nfamigerata cortigiana Giulia T ofana abbia creato un \nveleno impossibile da individuare una volta applicato \nsulla carta e Gabriella è pronta a giocarsi molto per \nottenerlo. \n(3) Ricattare il capo delle Guardie, \nvincendo tutto ciò che possiede. \nFrancesco Sforza, capo delle Guardie locali, è una \nrarità: un uomo di V odacce prudente. Gioca poco e \nnon scommette mai più di quanto possa permettersi \ndi perdere. Gabriella è ossessionata da lui: se riuscisse \na fargli gettare al vento la prudenza e a vincere tutto \nciò che possiede distruggendo la sua reputazione, \npotrebbe ottenere un alleato potente.\n(5) Prendere il controllo di una casa da \ngioco e continuare a giocare per sempre.\nIl più grande sogno di Gabriella è creare una bisca, \ndove i clienti possano scommettere solo cose che, una \nvolta perse, conducano alla rovina loro o di altri. La \nLuna Dorata – la più pericolosa bolgia di giocatori a \nV odacce – sarebbe il luogo perfetto. Se non dovesse \nfunzionare, Gabriella ha sentito dire di un vero \ninferno aperto ad Eisen.\n\n🎭 Consigli di Interpretazione:\nGabriella è divertente: i suoi occhi brillano, ha un  gran sorriso e vuole solo giocare. Chi potrebbe  mai rifiutare una scommessa con una ragazza  tanto amichevole? Non sembra affatto maliziosa,  ma spericolata. Giocare d’azzardo con Gabriella è  un’esperienza inebriante e intima. Aprirà la serata  scommettendo e perdendo mentre chiede all’avver- sario cosa adora. Alla fine della nottata, la vittima  avrà perso anche la camicia e sarà ridotta a bere e  piangere, mentre lei sorride. Ha numerosi gruppi  di delinquenti indebitati con lei, che la aiutano a  riscuotere i crediti, dato che non scommette mai se  non è sicura di poter raccogliere i frutti.",
        "archetype": "Malvagi Geni del Male"
    },
    {
        "id": "s7_villain_lotje_abbing",
        "name": "Lotje Abbing",
        "category": "villain",
        "type": "Malvagio (Geni del Male)",
        "nation": "Eisen",
        "strength": 11,
        "influence": 8,
        "villainyRank": 19,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Accademia Militare, Mano Pesante, Ricca,  Sala d’Armi: Drexel, Sguardo di Ghiaccio • Virtù: Il Diavolo Astuta. Il Malvagio può attivare questa Virtù dopo  che un Eroe ha speso degli Incrementi per un’Azione.  L’Azione fallirà automaticamente, ma gli Incrementi  saranno spesi comunque. • Superbia: La Torre Arrogante. Il Malvagio riceve un Punto Pericolo quando  mostra disprezzo o considera indegno di attenzione un  Eroe o chi potrebbe causare danno ai suoi amici.",
        "ability": "Servitori & Sottoposti: Le Guardie, i Duellanti e i Ladri che agiscono come spie  per Lotje mostrano un’incredibile lealtà. I suoi agenti  sanno bene che chi la serve viene ben ricompensato.",
        "notes": "«Uccidere non è abbastanza. Tutti possono uccidere.  Per essere un vero predatore è necessario  diventare tutt’uno con la preda.  Essere la mia preda è un privilegio, ti farà  comprendere il tuo posto nell’ordine delle cose.»\nArchetipo: Malvagi Geni del Male\n\n📖 Storia:\nLotje Abbing nacque durante la Guerra della Croce, \nda una famiglia della nobiltà minore padrona di \nvaste foreste ai piedi dei Monti Drachenberg. V enne \neducata in modo rigido alla tradizione famigliare di \ndare la caccia ai banditi e ai mostri che minacciavano \ni loro possedimenti.\nSin da giovane, Lotje amava andare a caccia ma, \ndopo avere combattuto nella Guerra ed avere appreso \nil versatile stile Drexel per la Zweihänder, divenne \nper lei più importante che la preda comprendesse di \nessere stata battuta, più dell'atto dell'uccisione. Si \nrese conto che, tra tutte le prede possibili, erano gli \numani quelli che potevano comprendere con maggior \nchiarezza il loro fato imminente.\nLa Guerra aveva ucciso tutti i parenti di Lotje, \neccetto il suo gemello Lothar. I due erano inseparabili \ne si protessero a vicenda dagli orrori del conflitto, per \npoi tornare a casa e tentare di ricostruire ciò che era \nrimasto. Lothar prese il controllo delle terre, convinto \nche la sorella lo avrebbe appoggiato. Lei invece orga-\nnizzò una Grande Caccia in suo onore, liberando un \nmagnifico cervo e, mentre Lothar festeggiava sul corpo \ndell'animale abbattuto, Lotje gli sparò alla schiena e \nprese la sua testa come trofeo.\nLa dimora di Lotje è ora una collezione di pelli, trofei \ne prodotti della tassidermia, tanto esotici quanto \norripilanti. È andata a caccia in tutto il continente \nper aggiungere alcune di queste meraviglie alla sua \ncollezione di macabre mostruosità. Nelle sue stanze, \nlontana da occhi indiscreti, c'è poi la sua collezione di \nteschi umani, con Lothar al posto d'onore. Solo chi \nsi dimostri suo pari nell'arte della caccia, senza però \nsembrare una minaccia, potrebbe visitare questa colle-\nzione, scoprendo così la soluzione di molti omicidi.\nNonostante la sua indole sanguinaria, Lotje è \nprofondamente protettiva nei confronti dei Bauern \ndel suo feudo. Chi commette crimini viene punito \ndiventando la preda di Lotje, ma chi rispetta la legge \nottiene il tetro rispetto della signora. Mentre i territori \ncircostanti soffrono la fame – e le persone scomparse \nnella foresta sono numerose – Lotje e i suoi cacciatori \nriportano abbastanza carne da mantenere la popola-\nzione ben nutrita.\nIn cambio di questa protezione, i Bauern le segna-\nlano ogni vagabondo, straniero o individuo insolito \nche passi per la regione. Alcuni di questi sono invitati \na restare e certi ritornano persino volentieri. La repu-\ntazione di Lotje è stata gestita con cura e un invito \npresso la sua magione per una caccia è considerato da \nmolti Adel un privilegio, nonostante alcuni sfortunati \nincidenti.\n\n♟️ Macchinazioni:\n(1) Catturare e dare la caccia a \nValentin, ambasciatore di Ussura.\nA una riunione di Adel a Starke, Lotje ha incontrato \nl'ambasciatore di Ussura, V alentin, e ha scoperto il \ncomune interesse per la caccia. Intrigata, lo ha seguito \nquando questi lasciò la città e lo vide tramutarsi in \nlupo. È eccitata all'idea di cacciare una bestia con \nl'intelligenza di un uomo e ha invitato il diplomatico \na farle visita presto, con il pretesto di una possi -\nbile alleanza.\n(3) Invitare degli Eroi a una \nbattuta di caccia, come prede.\nLotje ha sentito parlare del valore e delle imprese \ndi numerosi Eroi. Cinica di fronte all'idea di grandi \nideali, vuole metterne alcuni alla prova, per vedere se \nè più forte l'istinto di sopravvivenza o la loro moralità \ne amicizia. Ha in mente di liberare gli Eroi nel suo \nfeudo assieme a una banda di tagliagole, informando \ntutti che solo a uno di loro sarà permesso di andarsene \nvivo. A prescindere da chi sopravvivrà, è convinta che \nsi rivelerà uno spettacolo interessante.\n(5) Liberare un Drachen e \ndargli la caccia dopo che si \nè nutrito di contadini.\nNelle più antiche carte di famiglia, Lotje ha trovato \ndei riferimenti a un Drachen che pare sia rimasto \nintrappolato in una grotta da una frana. Con l'aiuto \ndi esplosivi ed equipaggiamento minerario all'avan -\nguardia, potrebbe essere possibile liberarlo. Avrà \nbisogno di esperti e ingegneri, oltre a una quantità di \ncarne umana pari a una piccola città, perché la preda \npossa rimettersi in forze. Si potrebbe rivelare la più \ngrande sfida di tutta Théah.\n\n🎭 Consigli di Interpretazione:\nLotje è una donna forte e robusta. Parla per frasi  brevi e tronche, senza mostrare dubbi o esitazioni,  e si aspetta che i sottoposti agiscano sempre in  accordo con la loro posizione. Persino quando è  arrabbiata o alterata il suo tono rimane calmo, come  se qualcosa dentro di lei fosse morto da tempo. È fermamente convinta di essere un predatore alfa  e si sottopone a un regime di brutale disciplina per  restare in cima alla catena alimentare. Si allena per  molte ore al giorno ed è facile che punti l’avversario  fisicamente più prestante in ogni gruppo, oppure  che elimini i più deboli in modo quasi casuale, per  sfoltire il gregge.",
        "archetype": "Malvagi Geni del Male"
    },
    {
        "id": "s7_villain_luck_il_buffone",
        "name": "Luck, il Buffone",
        "category": "villain",
        "type": "Malvagio (Geni del Male)",
        "nation": "Avalon",
        "strength": 3,
        "influence": 7,
        "villainyRank": 10,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Divincolarsi, Equilibrio Perfetto, Minuto, Virtuoso: Commedia • Virtù: La Notte Senza Luna Discreto. Quando agisce dietro le quinte o attraverso  un intermediario il Malvagio può attivare questa Virtù.  Per il prossimo Rischio ogni dado conterà come un  Incremento senza bisogno di tirare. • Superbia: La Strega Manipolatore. Il Malvagio riceve un Punto Pericolo  quando tenta di sfruttare qualcun altro per fare il suo  lavoro sporco e la cosa si rivolta contro di lui.",
        "ability": "Servitori & Sottoposti: Nonostante Luck abbia una buona Influenza non  fa uso di agenti a meno che non sia assolutamente  indispensabile. Preferisce carpire informazioni e segreti  mediante la sua abilità di comunicare e controllare  animali infestanti, di solito ratti o scarafaggi.",
        "notes": "«Sono il potere illimitato; sono il caos incarnato.  Faccio ciò che faccio perché lo trovo divertente.»\nArchetipo: Malvagi Geni del Male\n\n📖 Storia:\nIl progetto finale di Lucian Thompson, detto \nLuck, presso l'Accademia delle Arti Circensi di \nW andesborrow, più nota come “Scuola dei Buffoni” , fu \nun elaborato circo in miniatura. Ratti striati, formiche, \nragni e centopiedi erano i suoi pagliacci, giocolieri, \nacrobati e presentatori. La stella dello spettacolo era \nuno scarafaggio, che Lucian aveva trovato durante un \nviaggio di studio all'estero. A causa della folla in preda \na panico che distrusse questo circo di insetti, oggi gli \nscarafaggi sono diventati un problema comune in \ntutta Avalon.\nLuck ottenne comunque il diploma, ma questa sua \nultima performance – che era solo una delle tante di \nuna lunga serie di opere simili, satire complesse su \nargomenti che nessuno considerava materiale adatto  \n– gli rese difficile trovare lavoro. Si ridusse al minimo \ncomune denominatore della comicità, ad essere un \nintrattenitore itinerante di piazza che viaggiava per \ntutta Théah, sperando di fare abbastanza soldi da \nsbarcare il lunario.\nLuck non si divertiva. Il pubblico non apprezzava \nl'alto registro umoristico, da lui favorito, costrin -\ngendolo invece alla farsa più bassa e volgare. Con il \npassare del tempo il suo desiderio di usare l'umo -\nrismo per favorire profonde riflessioni intellettuali \nandò in pezzi. Nulla aveva più significato per lui.\nMan mano che il nichilismo rimpiazzava i suoi \nprincipi artistici, a Luck rimase un singolo trucco a \ncui appellarsi: l'abilità di comunicare con scarafaggi, \nratti, falene e altri parassiti. Questi potevano passargli \ninformazioni ed eseguire i suoi ordini. Gli animali \nerano più semplici delle persone. Il loro mondo aveva \nsenso per lui, non era pieno di trogloditi incapaci di \napprezzare l'arte autentica.\nFu così che Luck cominciò a riunire una corte di \ncreature tanto detestate dalla gente comune, quanto \nlui odiava l'umanità. Divennero i suoi occhi e orecchie, \nle dita con cui sentiva il pulsare della società. Con i \nsegreti che gli comunicavano, Luck otteneva accesso a \nstrati sempre più alti della società. Usò questa cono-\nscenza per influenzare l'élite di Théah, mettendo gli \nuni contro gli altri e osservandoli mentre si rovina -\nvano a vicenda: era molto divertente.\nOggi Luck si esibisce in ogni nazione di Théah. \nOvunque vada è accompagnato da orde di creature \nstriscianti, che si insinuano come ombre nei buchi dei \nmuri e tra i fili d'erba. Dietro di sé il buffone lascia \nuna serie di cuori infranti e armonie spezzate da bugie \ne incomprensioni. Questa, ne è convinto, è la sua vera \nvocazione: esplorare il caos e la distruzione in modo \ncomico. Ben presto tornerà in patria, dove intende \ncolpire il più grande Eroe della Nazione.\n\n♟️ Macchinazioni:\n(1) Uccidere il giullare di corte di \nAvalon e prenderne il posto. \nFauntleroy e Luck erano compagni di classe alla \nScuola dei Buffoni. Fauntleroy non era intelligente \nquanto Luck, ma otteneva voti più alti e lodi perché \nsi atteneva a un registro più basso e popolare, a fronte \ndelle satire all'avanguardia di Luck. Oggi, Fauntleroy \nè il pupillo della Corte di Avalon. Per Luck, eliminarlo \nsarà come prendere due piccioni con una fava.\n(3) Ingraziarsi i nobili che detestano \nil governo di Elain. \nLa Regina Elaine rappresenta un trionfo dello spirito \nEroico, un'affermazione di tutti quei valori e ideali \npositivi che Luck detesta. La sua salita al trono le ha \nprocurato molte inimicizie e molte invidie. Luck è \nla persona giusta per riunire queste voci di dissenso \nnascoste a Corte.\n(5) Ricattare la Regina affinché faccia \ndi lui il proprio consigliere ufficiale. \nLa perfetta immagine della speranza e della supre -\nmazia di Avalon deve avere degli scheletri nell'ar -\nmadio. Finora nessuno li ha trovati, ma nessuno ha \nmai pensato di usare ratti e scarafaggi come spie. \nPer quanto possa sembrare divertente controllare \nElaine con la minaccia di uno scandalo, Luck sa che \nlei potrebbe resistere… ed è altrettanto interessato a \nvedere cosa accadrà alle Isole Incantate di fronte a una \nsimile rivelazione.\n\n🎭 Consigli di Interpretazione:\nLuck mostra un ampio ventaglio di personalità: può  essere un buffone monello o un sociopatico  funzionale assai intelligente, cioè il suo vero io.   Ha sempre una scorta di commenti e critiche stridenti  sulla società e li presenta in tono calmo e rilassato.  Non crea nulla, ma distrugge tutto ciò che tocca.   Se un Eroe dovesse affrontarlo, Luck lo osserverà, per  poi puntare il dito verso la debolezza che nasce dalle  sue amicizie e dai rapporti con altri Eroi. Se e quando Luck entra a far parte di una vicenda lo  fa come un personaggio secondario, una comparsa  comica. Non vuole che il mondo sappia di lui o lo  veda arrivare.",
        "archetype": "Malvagi Geni del Male"
    },
    {
        "id": "s7_villain_anselet",
        "name": "Anselet",
        "category": "villain",
        "type": "Malvagio (Furie Inarrestabili)",
        "nation": "Castille",
        "strength": 9,
        "influence": 1,
        "villainyRank": 10,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Equilibrio Perfetto; Lavorare sui Tetti; Minuta; Riflessi Rapidi: Mischia; Tratto Leggendario:  Grazia; Volontà Indomabile • Virtù: La Notte Senza Luna Discreta. Quando agisce dietro le quinte o attraverso  un intermediario il Malvagio può attivare questa Virtù.  Per il prossimo Rischio ogni dado conterà come un  Incremento senza bisogno di tirare. • Superbia: La Notte Senza Luna Confusa. Il Malvagio riceve un Punto Pericolo quando  non riesce a capire o a cogliere un elemento impor- tante della vicenda e ciò mette in pericolo lui o altri.",
        "ability": "Servitori & Sottoposti: Anselet lavora da sola, ma potrebbe usare la paura per  costringere altri ad aiutarla temporaneamente.",
        "notes": "«Sono rimasta sola per dieci anni. Voi non siete  venuti a salvarmi e ora nessuno potrà salvare voi.»\nArchetipo: Malvagi Furie Inarrestabili\n\n📖 Storia:\nMuri e pavimenti di pietra, nessuna speranza né via di \nfuga: questa era la vita di Anselet, la sua realtà, ma ora \nè libera. Figlia di ricchi mercanti Castilliani, Anselet \nfu battezzata con il nome di Anna-Lucia Esperanza, \nma ormai non risponde più a questo appellativo. Le \nguardie della torre in cui era prigioniera la chiama -\nvano Anselet e intende incidere questo nome sulle \ntombe dei suoi nemici.\nDurante la prigionia ha rivissuto così tante volte \ni ricordi della gioventù da cristallizzarli in imma -\ngini perfette. Rammenta il giorno in cui giunsero i \nMontaigne. Suo padre Eduardo era un mercante \nche spesso commerciava con l'esercito e, in segreto, \nportava messaggi attraverso il paese sconvolto dalla \nguerra. Le sue attività spionistiche, però, attirarono \nl'attenzione del nemico. I soldati giunti a Corasone \navevano l'ordine di farlo passare dalla loro parte come \nagente doppiogiochista. Il Capitano François LeRoux, \nche comandava l'attacco, prese Anselet in ostaggio \npromettendo a Eduardo che, se avesse agito da loro \nagente, avrebbe rivisto la figlia.\nIl padre accettò e promise ad Anselet che sarebbe \ntornata presto a casa. L'ultimo ricordo che Anslet ha \ndi casa sua sono i genitori che la salutano sulla porta, \nmentre lei si allontana legata sul cavallo di LeRoux.\nSeguirono gli anni di prigionia. La torre si trovava \nnel nordest di Castille, in territorio occupato, era \nvecchia e con una stanza perfetta per mantenere \nisolata la ragazzina. Per anni Anselet visse in questa \ncella, con il minimo indispensabile per sopravvivere. \nNonostante tutto ci riuscì e, nelle notti più fredde, \nsognava di essere al sicuro nella sua vecchia casa.\nUn giorno, Anselet si svegliò e trovò la porta spalan-\ncata. Confusa e indebolita, la giovane si trascinò fino \nal villaggio più vicino e scoprì che la guerra era finita. \nPiena di gioia, trovò un carrettiere che l'accompagnò \na casa. Qui vide dalla finestra che tutti i suoi parenti \nerano vivi e in salute, persino la sorellina Jeannate, \normai cresciuta. Anselet si chiese perché non fossero \nvenuti a cercarla e, mentre li osservava cenare, la \npaura e la disperazione di tanti anni divennero un \nodio cocente.\nEntrò in casa, silenziosa come uno spettro, e affrontò \nla famiglia. Spaventati dalla sua apparizione, i geni-\ntori tentarono di spiegarsi, senza successo. Furiosa \ne sentendosi tradita, Anselet afferrò un coltello da \ncucina e tagliò la gola della madre. Gli altri fuggirono \nterrorizzati dal mostro che un tempo era Anna-Lucia \ne sono tutt'ora in fuga.\nAnselet giurò sul cadavere di sua madre che avrebbe \ntrovato ogni persona responsabile degli anni d'inferno \nda lei passati e che gliela avrebbe fatta pagare.\n\n♟️ Macchinazioni:\n(1) Scoprire dove si trova Jeannate. \nDopo la prima aggressione, la famiglia di Anselet si \nè nascosta. Lei ha intenzione di scoprire dove hanno \nmandato Jeannate e farla soffrire perché è stata tenuta \nin salvo in quanto figlia minore. \n(3) Punire gli abitanti di Corasone \nper averla lasciata rapire. \nGli abitanti di Corasone sapevano che Anselet \nera stata rapita e non mossero un dito per aiutarla. \nL'intero paese deve perciò essere giudicato e punito \nper la sua vigliaccheria. Quale miglior vendetta di \naccanirsi sulle loro pupille, le belle figlie degli abitanti. \nSe Anselet non ha potuto vivere una vita serena, \nnessun altro avrà tale privilegio. \n(5) Distruggere la famiglia LeRoux, \ncompresi servi e animali. \nAnselet ha intenzione di trovare e distruggere ogni \nmembro della famiglia del Capitano François LeRoux, \nil suo rapitore, e di raderne al suolo le proprietà. Ci \nvorrà tempo, ma intende portare la propria vendetta \nsino alle estreme conseguenze.\n\n🎭 Consigli di Interpretazione:\nAnselet sembra un delicato uccellino, con arti magri  e occhi acuti e spettrali. Sotto questo aspetto fragile  c’è un cuore che non sarà mai più imprigionato.  Agile e silenziosa, Anselet preferisce non essere vista  o udita finché non lo decide lei. Salta di ombra in  ombra su piedi leggeri, come un sussurro tra due  batter di palpebre, e svanisce prima che chiunque  se ne accorga. Non prova pietà né rimorso; si  concentra invece sul passato e sull’eterna spirale di  vendetta che la fa muovere.",
        "archetype": "Malvagi Furie Inarrestabili"
    },
    {
        "id": "s7_villain_deargh_kilgore",
        "name": "Deargh Kilgore",
        "category": "villain",
        "type": "Malvagio (Furie Inarrestabili)",
        "nation": "Le Marche delle Highland",
        "strength": 13,
        "influence": 4,
        "villainyRank": 17,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Comando; Esperto di Sopravvivenza;  Oggetto Distintivo: Sciabola incrostata di corallo; Sala d’Armi: Sabat; Scuola di Maniere;  Sposato al Mare • Virtù: Il Mago Determinato. Il Malvagio deve indicare un Eroe  presente quando attiva questa Virtù. Fino alla fine  della Scena, l’Eroe non può spendere Punti Eroe, ma il  Malvagio non potrà spendere Punti Pericolo. • Superbia: Il Profeta Fanatico. Il Malvagio riceve un Punto Pericolo quando  difende vigorosamente le sue idee nel posto o nel  momento sbagliato.",
        "ability": "Servitori & Sottoposti: La ciurma della Abissi Imperituri è formata da Duellanti,  Guardie e Pirati. Nave  La Abissi Imperituri è una Nave originaria di Avalon con  il Background Battaglia Famosa.",
        "notes": "«I vecchi dei giacciono sotto i nostri  piedi, in attesa di rinascere, e ti vedono.  Non temere, li incontrerai presto.»\nArchetipo: Malvagi Furie Inarrestabili\n\n📖 Storia:\nNelle Marche delle Highland vi sono regioni dove \nla popolazione crede ancora fermamente nei vecchi \ndei ed è fedele a tradizioni antiche, spesso sangui -\nnose. Uno di questi individui è l'immortale capitano \nDeargh Kilgore, portavoce degli dei sotto le onde.\nDa seguace devoto dei vecchi dei, Deargh tiene \nalti gli stendardi grigi dell'oceano infinito sulla \nAbissi Imperituri, la sua nave. Naviga lungo le coste \ndi Avalon alla ricerca di sacrifici, nella speranza di \nriportare i vecchi dei alla loro antica gloria e, quindi, \ndivenire uno di loro nell'eternità. Per questo, Deargh \ne la sua ciurma viaggiano di villaggio in villaggio \ndepredando tutto il possibile. Quando conquista un \npaese o cattura un vascello fa una semplice proposta: \ni prigionieri possono abiurare il loro credo e unirsi al \nsuo equipaggio come servi degli antichi dei del mare, \noppure morire.\nChi è riuscito a sfuggirgli racconta delle urla, \ndurante l'iniziazione, di coloro che hanno accettato \ndi unirsi alla ciurma. Il prezzo per diventare un uomo \ndi Deargh è una mutilazione in onore di coloro che \nvivono negli abissi. L'equipaggio è famoso per questo.\nA molti, le convinzioni di Deargh sembrano follia, \nma il capitano è tutto tranne che matto. Nonostante \ni suoi modi da predone, rispetta le regole del “parlay” \ne permette a chi sale a bordo di discutere con lui. Si \nesprime come un uomo di cultura, nonostante sia \nchiaramente di umili origini. Cita spesso testi della \nChiesa di Avalon e di quella dei Profeti ed è capace \ndi dibattere qualsiasi tema teologico persino durante \nuna accanita partita a scacchi.\nDeargh sostiene di essere un ex-capitano della \nMarina di Avalon, la cui nave fu lasciata fatta \naffondare, durante uno scontro, dall'ammiragliato. \nCircondato dai resti della nave e dai corpi dell'equi -\npaggio, Deargh giurò di servire in eterno qualsiasi \ndivinità, vecchia o nuova, che lo avesse aiutato a \nsalvare i suoi uomini. Gli antichi dei risposero e ora \nlui li serve con devozione fanatica, nata da questo \nmiracolo. Da quel giorno il capitano è diventato il \ncampione dei vecchi dei, ed è devoto alla missione di \ndiffondere la loro parola in tutta Avalon.\nAgli occhi di Deargh, è particolarmente importante \nMaab, la Regina degli Oceani. È noto che compia un \nsacrificio alla Regina Sidhe ogni luna piena, legando \ninsieme le mani di una coppia di giovani e gettandoli \nin mare al largo delle Isole delle Banesidhe. Come \nun innamorato, recita antiche ballate per la Regina \ndei Mari.\nQuando si tratta di reclutare nuovi marinai, però, \nquesti suoi modi educati svaniscono. Le sue cerimonie \nai vecchi dei sono devastanti e pensate per legare gli \nuomini al loro destino in modo assoluto. Deargh è \nconvinto che sacrifici e constante devozione siano la \nchiave per il risveglio dei vecchi dei.\n\n♟️ Macchinazioni:\n(1) Rapire nuovi marinai \nper rimpiazzare i morti. \nDepredare in nome dei vecchi dei è un lavoro perico-\nloso. Molti marinai sono morti in battaglia o a causa \ndelle infezioni come conseguenza delle mutilazioni. È \nnecessario costringere nuove leve ad arruolarsi. \n(3) Eseguire un grande sacrificio \nper benedire la nave.\nIl sangue dei miscredenti è ciò che alimenta i vecchi \ndei e farà sì che proteggano la Abissi Imperituri. A \nquesto scopo sarà necessario spargere a bordo il \nsangue di un innocente, per tingere i parapetti da prua \na poppa, quindi bisognerà trovare un uomo davvero \ndevoto e farlo abiurare, dopodiché legarlo alla polena \nprima della battaglia.\n(5) Divenire un profeta, scoprendo i \nnomi dei vecchi dei delle profondità.\nI nomi dei vecchi dei sono ormai persi nelle leggende. \nPer scoprirli di nuovo sarà necessario trovare i loro \nartefatti nelle Isole delle Banesidhe e usarli. Solo \nallora Deargh potrà trovare la via che gli permetterà \ndi camminare tra questi esseri che vivono negli abissi.\n\n🎭 Consigli di Interpretazione:\nDeargh è un vero credente, uno zelota e uno  spietato assassino. Chiunque cerchi di ostacolare il  suo piano per trovare i vecchi dei, e divenire uno di  loro, sarà distrutto. Non gli importa chi dovrà usare  per i suoi scopi; persino la sua ciurma e il suo stesso  corpo sono stati vittime di questa ricerca della gloria  imperitura. Deargh si comporta in due modi: come  un capitano azzimato ed educato, oppure come uno  spietato assassino. Quando è calmo, la sua voce è  ferma e, quasi, ipnotica, mentre, quando è preda  della furia, risuona come una tempesta, ricolma di  follia e fervore religioso.",
        "archetype": "Malvagi Furie Inarrestabili"
    },
    {
        "id": "s7_villain_elena_grigorii",
        "name": "Elena Grigorii",
        "category": "villain",
        "type": "Malvagio (Furie Inarrestabili)",
        "nation": "Confederazione Sarmatiana",
        "strength": 8,
        "influence": 2,
        "villainyRank": 10,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Lampo di Genio: Biologia, Oggetto Distintivo:  Trattati Inquisitoriali, Università • Virtù: La Torre Umile. Attivando questa Virtù, il Malvagio riceverà  1 Punto Pericolo aggiuntivo quando attiverà la sua  Hubris o una delle sue Peculiarità. • Superbia: o una delle sue Peculiarità. Hubris: L’Impiccato Indecisa. Il Malvagio riceve un Punto Pericolo quando  spreca un’Azione esitando in preda al dubbio o  all’incertezza.",
        "ability": "Qualità Mostruose: Elena ha la Qualità Possente.\n\nServitori & Sottoposti: Molti degli esperimenti di Elena hanno trasformato  uomini e animali in Mostri. Queste creature hanno, di  solito, Qualità come Chitinoso, Possente, Rigenerante,  Tentacolare o Terrificante.",
        "notes": "«Dottoressa Ebano»\nArchetipo: Malvagi Furie Inarrestabili\n\n📖 Storia:\nLa Dottoressa Ebano si aggira di notte per le vie \ndi V oruta, avvolta in un manto nero, alla ricerca di \nsoggetti per esperimenti infernali. Nel suo labora -\ntorio, tra i vasi di campioni e le vasche di icore, questi \npoveretti saranno vittime di esperimenti medici. I \npiù fortunati verranno uccisi subito, i loro cuori \nestratti mentre ancora palpitano e messi al sicuro \nin contenitori di vetro. Gli altri moriranno urlando, \nmentre il loro sangue viene drenato per mezzo di \naghi, oppure osservando, riflessa in uno specchio, la \npropria vivisezione.\nSi dice che la Dottoressa Ebano sia stata vittima \ndei suoi stessi esperimenti, che abbia bevuto un elisir \ncapace di conferirle una forza inconcepibile, ma che la \nfarà soffrire in eterno. Questi racconti sono tutti veri: \nla Dottoressa Ebano è reale, ma c'è molto di più da \ndire sul suo conto. Sotto il travestimento si nasconde \nuna brillante teologa, Elena Grigorii, spaventata a \nmorte dall'idea dell'Inferno.\nQuando Elena entrò in seminario era scettica a \nproposito dell'Inferno, l'ipotesi di una punizione \neterna, persino per i peggiori peccatori, le sembrava \ncontrastare con l'immagine di una divinità assolu -\ntamente buona. Non si era però mai resa conto di \nquanto profondo fosse il suo scetticismo, finché un \nprofessore di studi teologici non le diede accesso, \ndirettamente dai banchi dell'Inquisizione, ad alcune \nrecentissime prove dell'esistenza dell'Inferno.\nQueste la preoccuparono perché apparivano incon-\nfutabili, mentre fino a quel momento, ogni dimostra-\nzione le era apparsa fallace. Elena ne fu terrorizzata: \nl'idea della dannazione eterna era troppo terribile \nper essere accettata, eppure le prove erano di fronte \na lei. Dopo sette notti insonni, pianse, perché non \npoteva più pregare: si sentiva tradita dal Creatore \ndell' Universo.\nSe l'Inferno era reale, allora la benevolenza di Theus \nera troppo aliena perché lei potesse accettarla. Aveva \nallenato la mente per comprendere gli enigmi del \nCreatore, ma ciò che in realtà la rodeva non era una \nsemplice incapacità di comprenderli, ma qualcosa di \npiù letale. In coscienza, non poteva servire una divi-\nnità che condannava per un numero definito di peccati \na un'eternità di tormenti. \nSe davvero Theus aveva creato la morte per condurre \na questo, allora l'unica cosa da fare, secondo la mora-\nlità di Elena, era porre fine alla morte stessa.\nFu così che iniziarono i suoi esperimenti. Sono \ntrascorsi tre anni ed Elena crede di aver finalmente \nindividuato il sentiero per l'immortalità. T uttavia, \nil suo progetto è in pericolo: Ambroży Czyżyk, un \nex Ussaro Alato, ha seguito la pista dei senzatetto \nscomparsi e ha quasi catturato Elena mentre stava per \nrapire un bambina. Nello scontro che ne seguì, lei gli \nha gridato in faccia il suo scopo, ma lui è sopravvissuto \na stento e la bambina è fuggita. Da quel momento \nElena ha interrotto i suoi esperimenti. È certa che \nAmbroży sia uno strumento di Theus e che le compa-\nrirà di fronte quando sarà a un passo dall'immortalità. \nRiuscirà ad impossessarsi dell'eternità di fronte agli \nocchi del suo Creatore?\n\n♟️ Macchinazioni:\n(1) Derubare l’obitorio per \ntrovare materiale fresco.\nLa Guardia Cittadina di Ambroży Czyżyk pattuglia le \nstrade, ma non vi sono ancora sentinelle presso l'obi-\ntorio. Se Elena vuole continuare i suoi esperimenti, \nha bisogno di nuovi soggetti. Preferirebbe i vivi, ma \nteme che ulteriori rapimenti possano farla scoprire e \nper questo motivo intende procurarsi dei cadaveri alla \nprima occasione.\n(3) Ottenere da Ifri i rubini Akwanse, \nche possono concentrare le essenze.\nElena ha diverse idee su come produrre l' Elisir della \nVita Eterna, ma per sperimentare la formula più \npromettente ha bisogno di rubini. Pare che i rubini \nAkwanse possano essere usati per ridurre un'anima ai \nsuoi sali essenziali, permettendo a uno scienziato di \nestrarla da un corpo vivente e inserirla in un costrutto \npiù robusto, come un omuncolo.\n(5) Perfezionare l’Elisir \ndella Vita Eterna.\nQuesto è l'obiettivo finale di Elena. La procedura a \ncui si sta dedicando attualmente prevede di estrarre \nun'anima e introdurla in un corpo imperituro, ma è \npronta a tentare altre strade, purché promettenti.\n\n🎭 Consigli di Interpretazione:\nElena si sta consumando a causa della sua determi- nazione a sconfiggere la morte, persino se questo  dovesse significare la sua eterna dannazione. In  un confronto, difenderà appassionatamente le  proprie scelte: certo, per opera sua sono morte delle  persone e continueranno a morirne, ma sono poca  cosa di fronte alla vita eterna! La sua ossessione l’ha ‘svuotata’ (si dimentica  di mangiare e si vede), ma non ha ridotto le sue  capacità intellettive. È incredibilmente intelligente,  ha una capacità logica ferrea ed è abilissima nel  dibattito. Prima di andarsene, era tra gli studenti  più promettenti del seminario; oggi, considera  la teologia non come una forma di filosofia, ma  una scienza esatta e porta sempre con sé le prove  dell’esistenza dell’Inferno fornitele dall’Inquisizione.",
        "archetype": "Malvagi Furie Inarrestabili"
    },
    {
        "id": "s7_villain_isentrud_der_chegir",
        "name": "Isentrud der Chegir",
        "category": "villain",
        "type": "Malvagio (Furie Inarrestabili)",
        "nation": "Eisen",
        "strength": 7,
        "influence": 6,
        "villainyRank": 13,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Dura da Uccidere, Mano Pesante, Non Morirò  Qui, Volontà Indomabile • Virtù: L’Imperatore Maestosa. Attivando questa Virtù, il GM otterrà un  Punto Pericolo per ogni Malvagio o Squadra di Sgherri  presente nella Scena. • Superbia: Il Profeta Fanatica. Il Malvagio riceve un Punto Pericolo quando  difende vigorosamente le sue idee nel posto o nel  momento sbagliato.",
        "ability": "Qualità Mostruose: Isentrud ha la Qualità Chitinoso, che rappresenta la  resistenza superumana conferitale dall’oscurità nella  miniera. Tuttavia, non ha un guscio indurito e sembra  un normale essere umano.\n\nServitori & Sottoposti: La banda di folli di Isentrud è formata quasi solo da  Duellanti, ma include anche un gruppetto di Guardie.",
        "notes": "«Non mi inchinerò mai a un essere piccolo  e debole come voi. Io sono la mano dell’oscurità.  La distrutta e la ricreata. Io sono Eisen.»\nArchetipo: Malvagi Furie Inarrestabili\n\n📖 Storia:\nIsentrud è una donna dalla volontà implacabile. Figlia \ndi un povero minatore di Unterhaid, un villaggio \ndevastato dalla guerra, fu costretta ad aiutare il padre \nnelle miniere di ferro dopo che il conflitto si era preso \nla madre e tutti i fratelli.\nIsentrud doveva spesso nascondersi nelle miniere \nper evitare le periodiche razzie da parte degli uomini \ndi Pösen, ma l'amore di suo padre la mantenne forte \ndi fronte alle avversità. Con il passare del tempo \ncominciò a parlare con l'oscurità… e questa le \nrispose, divenne sua amica, mentore e confidente nei \nmomenti difficili.\nUn giorno tutto cambiò. I mercenari di Pösen giun-\nsero in risposta a un attacco partito da Unterhaid. \nMentre Isentrud fuggiva, il padre fu colpito alle spalle \ne morì lentamente tra le braccia della figlia. In lacrime, \nlei corse alla miniera per nascondersi e pregò l'oscu -\nrità di renderla forte… e così fu. Emerse dal tunnel \nrinata. I suoi oscuri discorsi di vendetta provocarono \nun'insurrezione generale contro Pösen a Unterhaid \ne nei villaggi vicini. Ben presto la folla fu alle porte \ndi Insel, l'imprendibile capitale del Königreich. Con \nlo sguardo fisso sull'odiata fortezza, Isentrud guidò \nl'assalto attraverso il terreno paludoso. Fu un colos-\nsale disastro: i cannoni di Insel massacrarono la folla \nuna bordata dopo l'altra, ma Isentrud non si fermò, \nné rallentò, finché non si trovò faccia a faccia con Elsa \nPösen in armatura completa. Non sentì neppure il \nproiettile che la fece cadere, né ricorda le ore che le \noccorsero per strisciare fuori dall'acquitrino lordo di \nsangue attorno a Insel, fino a raggiungere Salzsumpf.\nMentre ciò che restava del suo sangue si riversava \nnella Salzsumpf, Isentrud sprofondò nelle tenebre. \nIn quel luogo oscuro, tra rovine infestate di ombre e \ncon il lontano lamento delle sirene, abbracciò il gelo, \nil fango e le acque fredde che la sommergevano. Fece \nsuo tutto il dolore, il sangue, l'odio e la disperazione \nche erano penetrati nella terra fangosa di Eisen per \ntrent'anni e rinacque ancora una volta.\nPassarono i mesi e Isentrud reclutò uomini tra i suoi \ncompatrioti che non avevano più alcuna speranza. \nPredoni, mercenari, criminali e uomini senza io \nerano attratti dal suo scopo e  dalla possibilità di \ndivenire immortali.\nLa chiamavano “Eterna” e lei ribattezzò i suoi seguaci \n“Il Circolo Eterno” , trasformandoli in una banda di \nsuicidi fanatici.\nIsentrud vuole liberare se stessa e i propri seguaci \nda ogni debolezza e quale metodo migliore se non \nquello di affrontare Elsa Pösen, l'unica persona che \nl'abbia mai davvero ferita? Al momento la banda sta \neliminando pattuglia dopo pattuglia, nella speranza di \nattirare Pösen nella Salzsumpf. Se questo metodo non \ndovesse funzionare, Isentrud dovrà semplicemente \nfare visita alla Eisenfurst di persona. Isentrud non \nvuole più essere debole un'altra volta.\n\n♟️ Macchinazioni:\n(1) Costringere un funzionario di \ncittà a entrare nel Circolo Eterno.\nDi recente, il capitano della guardie di Insel ha perso \nla moglie, nel corso di uno dei raid comandati da \nIsentrud. Lei intende sedurre l'inconsolabile vedovo \ne convincerlo a unirsi al Circolo Eterno, usando dimo-\nstrazioni di potere e la promessa di far risorgere la \nmoglie in cambio delle chiavi di Insel.\n(3) Attirare i membri della famiglia \nPösen nel suo “terreno di prova” .\nNessuno tra i membri del Circolo Eterno è risorto \ncome Isentrud. Irriducibile, la sua attuale speranza \nè sfidare l'unica persona che considera sua pari: Elsa \nPösen. Ha in mente di attirare i parenti di Elsa nella \nSalzsumpf e costringerli a subire delle “prove” finché la \nEisenfurst non andrà in loro soccorso. Isentrud potrà \nallora affrontarla, ucciderla e vederla rinascere come \nuna sua pari.\n(5) Assaltare frontalmente i bastioni \ndi Insel ed espugnare la città.\nNonostante i numerosi successi contro le pattuglie, i \nmembri del Circolo Eterno sono ancora troppo deboli \ne schiavi della mortalità. Quando avrà forze adeguate, \nIsentrud finirà ciò che ha cominciato: assalterà Insel e \nprenderà la città a qualsiasi costo. Solo i puri soprav-\nvivranno all'ordalia.\n\n🎭 Consigli di Interpretazione:\nIsentrud è l’ombra di Eisen, un riflesso oscuro di un  popolo fiero e resistente. I suoi occhi gelidi sembrano  sempre colmi di delusione, perché ben pochi sono  in grado di soddisfare le sue aspettative. Il tempera- mento glaciale e spietato influenza ogni sua azione.  La paura le sembra incomprensibile e considera la  morte qualcosa per i deboli. Lei è un ghiacciaio, una  montagna, è lo scorrere implacabile del tempo. Non  esita, non fugge e, soprattutto, non muore.",
        "archetype": "Malvagi Furie Inarrestabili"
    },
    {
        "id": "s7_villain_jorunn_sn",
        "name": "Jorunn Snø",
        "category": "villain",
        "type": "Malvagio (Furie Inarrestabili)",
        "nation": "Vestenmennavenjar",
        "strength": 5,
        "influence": 5,
        "villainyRank": 10,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Duro da Uccidere, Mastro Artigiano: Sarto,  Vista d’Aquila, Volontà Indomabile • Virtù: La Torre Umile. Attivando questa Virtù, il Malvagio riceverà  1 Punto Pericolo aggiuntivo quando attiverà la sua  Hubris o una delle sue Peculiarità. • Superbia: o una delle sue Peculiarità. Hubris: Il Ritrovo Rancoroso. Il Malvagio riceve un Punto Pericolo quando  si mette nei guai rimanendo ancorato a vecchi rancori e  cattivi sentimenti.",
        "ability": "Qualità Mostruose: Jorunn ha le Qualità Chitinoso, Elementale (ghiaccio),  Rapido e Terrificante.\n\nServitori & Sottoposti: Jorunn comanda numerose creature e spiriti maligni  che dominano le selve in inverno. I lupi, gli spettri di  chi è rimasto intrappolato sulle montagne, gli spiriti  del vento e del ghiaccio lo seguono nella sua ricerca  della vendetta.",
        "notes": "«Vi prego, mi sentite? Fa così freddo qui fuori… ehi?»\nArchetipo: Malvagi Furie Inarrestabili\n\n📖 Storia:\nSi dice che chi si perde nelle gelide propaggini setten-\ntrionali di V estenmennavenjar non potrà mai fare \nritorno. Il suo cadavere sarà ritrovato sbiancato dal \nghiaccio, con gli occhi vitrei e vuoti. Queste sono \ncaratteristiche che descrivono bene Jorunn Snø, \neccetto un dettaglio: non è morto.\nJorunn crebbe nel paese di V orlenjarl, era il ragaz-\nzino più piccolo e malaticcio della comunità e prefe-\nriva prendersi cura dei piccoli animali delle fattorie, \npiuttosto che fare a botte con i suoi coetanei. Si voci-\nferava che sua madre fosse una grande guerriera, che \nun giorno era partita per non tornare mai più. Gli altri \nragazzi dicevano che sua madre si era presa tutta la \nforza della famiglia non gli aveva lasciato nulla.\nIn genere, Jorunn ignorava i bulli. Trovò rifugio tra \nle vecchie del paese, che gli insegnarono a cucire e a \ntessere. Quando divenne adulto aveva già aperto, con \ngrande successo, una sartoria.\nFu questo, non il suo carattere gentile, ad attrarre \nMara Orlunsdatter, una bellezza dai capelli rossi che \nlo sposò per profitto anziché per amore. Il tranquillo \nJorunn era cotto della moglie e aveva ormai tutto ciò \nche potesse desiderare. Ma aveva anche dei nemici. \nMolti, compreso il locandiere Bjarni Rossiek, lo odia-\nvano sin da ragazzi. Quando Bjarni cominciò una \nstoria con Mara, cospirò con gli altri per liberarsi per \nsempre del timido Jorunn.\nJorunn aveva appena compiuto 26 anni, quando \ngli altri uomini del paese lo invitarono a una battuta \ndi caccia, sostenendo di voler dimenticare il passato. \nEssendo buono e tollerante di natura, Jorunn accettò. \nIl mattino seguente incontrò Bjarni e gli altri nei \nboschi. Questi gli offrirono del vino drogato che gli \nfece perdere i sensi. Quando si riprese, le sue provviste \nerano sparite ed era caduta tanta neve che non riusciva \na orientarsi.\nV agò per i boschi, consumandosi lentamente e \npregando gli dei o chiunque potesse sentirlo. Uno \nspirito del gelo lo trovò ed entrò nel suo corpo, stra-\nvolgendo l'anima di un uomo innocente con la rabbia \ne il desiderio di vendetta.\nTre notti dopo, Jorunn emerse dai boschi e tornò a \ncasa. La sua pelle era sbiancata dalla neve, i suoi occhi \nvitrei e inespressivi. Trovò Bjarni a casa sua, mentre \nabbracciava appassionatamente Mara. Quando lei lo \nvide svenne. L'uomo di ghiaccio prese la moglie tra le \nbraccia, ma appena la toccò lei si congelò e andò in \nmille pezzi. L'amante urlò e scappò, lasciando Jorunn \ntra le rovine della sua vita.\nDa allora, Bjarni non ha mai più smesso di scappare, \nperché Jorunn lo sta inseguendo. L'ex-sarto sente che \nsono stati quei bulli a renderlo ciò che è. Ovunque \nloro fuggano, lui appare, seguito da un freddo intenso \ne dal vento ululante. Guai a chiunque si metterà sulla \nsua strada.\n\n♟️ Macchinazioni:\n(1) Congelare Bjarni ei suoi amici.\nBjarni ha condotto Jorunn alla sua morte nei boschi \nper avere Mara tutta per sé. Ora lei è morta, ma la \nvendetta dell'uomo congelato non è ancora completa. \nBjarni e suoi sono in fuga, ma Jorunn gli sta appresso, \ninevitabile come una tempesta invernale.\n(3) Inseguire un Eroe finché \nnon riuscirà a congelarlo.\nLe persone buone rendono Jorunn furioso. Il suo \ncuore è gelido e amareggiato e vede nel bene solo \nun ricordo di ciò che ha perduto. Vuole prendere un \nEroe e congelarlo, per dimostrare che la virtù non è \nabbastanza forte.\n(5) Trovare la persona più innocente \nin cambio della sua libertà.\nLo spirito che possiede Jorunn è pronto a fare un \npatto: lo libererà se la persona più innocente della \nNazione sarà disposta a prendere il suo posto.\n\n🎭 Consigli di Interpretazione:\nUn tempo, Jorunn Snø era un uomo gentile. Oggi è  un mostro che viene dal freddo e rapisce le persone  per congelarle nella tormenta. Sembra muoversi  con la lentezza di un ghiacciaio, ma è capace di  una velocità animalesca quando è a caccia. I ricordi  della sua vecchia vita sono lontani, coperti dal gelo  dell’odio per coloro che l’hanno lasciato morire.",
        "archetype": "Malvagi Furie Inarrestabili"
    },
    {
        "id": "s7_villain_perrote_glentier",
        "name": "Perrote Églentier",
        "category": "villain",
        "type": "Malvagio (Furie Inarrestabili)",
        "nation": "Montaigne",
        "strength": 8,
        "influence": 2,
        "villainyRank": 10,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Oggetto Distintivo: Schegge di specchi, Rissoso, Stregoneria: Porté 1, Tratto Leggendario:  Grazia • Virtù: Il Matto Scaltro. Attivando questa Virtù, il Malvagio può sfuggire  al pericolo nella Scena in corso. Potrà salvare solo  se stesso. • Superbia: Il Ritrovo Rancoroso. Il Malvagio riceve un Punto Pericolo quando  si mette nei guai rimanendo ancorato a vecchi rancori e  cattivi sentimenti.",
        "ability": "Qualità Mostruose: Perrote ha le Qualità Rapido e Terrificante.\n\nServitori & Sottoposti: Lo spettro all’interno di Perrote lo costringe a vivere  isolato da tutti.",
        "notes": "«Troppe schegge per contarle e troppo  tardi per tornare indietro…»\nArchetipo: Malvagi Furie Inarrestabili\n\n📖 Storia:\nPerrote è figlio di Damien e Phillipa Églentier, intrat-\ntenitori che viaggiavano per Montaigne esibendosi di \nfronte alla più alta nobiltà. Gli Églentier erano grandi \nesperti nel creare fantasmi degli specchi, intrappo -\nlando le anime dei defunti nel momento del trapasso \nmediante la magia Porté.\nQuesto serraglio veniva poi esposto durante le feste \ndella nobiltà. Per anni Perrote non capì davvero \nquale fosse la professione dei genitori, finché il suo \npotere magico non si manifestò e venne introdotto \nall'azienda di famiglia.\nPerrote era un ragazzo discreto ed educato, che non \ndesiderava altro che diventare pittore. Cadde in una \ndepressione tanto profonda che Phillipa, preoccupata \nper la sua salute, convinse il marito a inviarlo dallo \nzio per un po'. Perrote crebbe nel piccolo apparta -\nmento sopra la sartoria di zio Bertrane a Prevoye e vi \nsarebbe rimasto se sua madre non si fosse ammalata \nquando lui aveva appena 20 anni. Corse a Charouse \nper aiutare il padre al capezzale. T entò persino di \nusare le sue deboli facoltà Porté per aiutare la madre, \nmarchiando tutti i parenti, nella speranza di poter \ntrasferirle un po'  della loro salute.\nDamien, bisognoso di soldi per le medicine, accettò \ndi affittare i suoi specchi per una festa, nonostante \nla moglie fosse indisposta. Durante l'evento Perrote, \nesausto, sentì una voce provenire da un angolo della \nlussuosa sala e trovò uno specchio decorato d'argento. \nAl suo interno vi era lo spettro di un uomo con un \nabito da medico della peste, completo di maschera, e \ncon la gola squarciata. Il fantasma disse a Perrote che \npoteva aiutare Phillipa, se lo avesse liberato.\nIl giovane cercò di resistere, ma la preoccupazione \nper madre ebbe la meglio. Damien e gli ospiti udirono \nun terribile fracasso e, corsi nella sala, trovarono \nPerrote in piedi di fronte allo specchio infranto, con \nil corpo che si muoveva come un burattino. Afferrata \nuna scheggia di vetro, Perrote aggredì il padre. Il \nvecchio usò la sua magia per difendersi dal figlio \nposseduto e alla fine Perrote fuggi invocando aiuto.\nOggi il corpo posseduto di Perrote è ancora libero \ne continua a uccidere per tutta la capitale, intrappo-\nlando le anime delle vittime all'interno di un unico \nspecchio. Sulla scena di ogni brutale omicidio scrive \ncon il sangue “J'accuse” , un indizio sulla sua vera \nidentità. Il reale significato di queste parole è ignoto \npersino a Perrote. Quando si trova alle strette, Perrote \ntenta di implorare aiuto, mentre il suo corpo attacca \nchiunque stia per scoprire questo segreto. Lo spettro \ncontrolla il corpo, ma non la bocca, perciò l' ha cucita.\n\n♟️ Macchinazioni:\n(1) Rubare il sangue di uno stregone \nEroico per conservare la sua forza.\nLo spettro ha bisogno di molta magia per sopravvivere. \nIl sangue di un Eroe potrebbe fortificare la sua presa \nsul corpo di Perrote. Lo spirito vuole più tempo tra i \nmortali e se questo significa che un Eroe debba morire \ndissanguato, così sarà.\n(3) Uccidere tutti i famigliari di \nPerrote e poi tagliargli le corde vocali.\nLa famiglia Églentier è alla ricerca di Perrote e lo \nspettro sa che, se non sarà cauto, lo troveranno e lo \nlibereranno. È il loro legame tramite i Marchi del \nPorté che mantiene il giovane cosciente e capace di \nparlare. Lo spirito pianifica di ucciderli tutti e, infine, \ntagliare le corde vocali di Perrote.\n(5) Intrappolare le anime delle \nsue vittime in uno specchio.\nUno specchio è stato la prigione dello spettro per \ndecine e decine di anni. Ora vuole mietere quante più \nanime possibile e intrappolarle allo stesso modo, per \ncreare un coro silente che solo lui possa udire.\n\n🎭 Consigli di Interpretazione:\nPerrote non è più un essere umano, ma solo  un’anima intrappolata in un corpo posseduto, con  la bocca cucita per impedirgli di chiamare aiuto.  Il corpo si muove contro la sua volontà, control- lato dallo spettro, con le braccia che si agitano a  scatti e il passo rapido e incerto. Canticchia nenie  inquietanti ovunque vada e, quando attacca le sue  vittime per intrappolarne le anime negli specchi,  le dita si contorcono di continuo e il volto assume  un’espressione di muto orrore di fronte al massacro.",
        "archetype": "Malvagi Furie Inarrestabili"
    },
    {
        "id": "s7_villain_slepa_miskovna",
        "name": "Slepa Miskovna",
        "category": "villain",
        "type": "Malvagio (Furie Inarrestabili)",
        "nation": "Ussura",
        "strength": 10,
        "influence": 5,
        "villainyRank": 15,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Aggressione Sconsiderata, Comando, Esperta  di Sopravvivenza, Forte come Dieci Uomini,  Pugilatore, Senso dell’Orientamento, Stomaco  di Ferro • Virtù: Il Mendicante Perspicace. Attivando questa Virtù, il Malvagio può  scoprire il Grado di un Eroe in un qualsiasi Tratto o  Abilità, oppure il suo Hubris. • Superbia: . Hubris: Il Mago Ambiziosa. Il Malvagio riceve un Punto Pericolo quando  insegue il potere mettendosi in pericolo o causando guai.",
        "ability": "Qualità Mostruose: Slepa ha le Qualità Inarrestabile, Mutaforma e Rapida.\n\nServitori & Sottoposti: Slepa ha numerosi seguaci, ma ben pochi sono tanto  rilevanti da meritare menzione.",
        "notes": "«Nel profondo sapete tutti che gli umani  nascosti dietro a mura e attrezzi e stretti  attorno ai fuochi non potranno mai capirci,  né comprendere cosa ci renda forti.»\nArchetipo: Malvagi Furie Inarrestabili\n\n📖 Storia:\nQuando Matushka arrivò, era già troppo tardi. Slepa \nMiskovna non esisteva più: aveva abbandonato la \nnatura umana e quella di lupa era impura. Dietro di \nsé aveva lasciato una scia di morti senza curarsene né \nnutrirsene. Era divenuta un ibrido, mezza umana e \nmezza lupa, dall'aspetto orribilmente asimmetrico: la \ntesta era grande e ferina da un lato, piccola e umana \ndall'altro. L'abuso del potere datole da Matushka, \nusato per uccidere e terrorizzare, aveva corrotto il \nsuo corpo e, persino mentre la Madre la osservava, la \nsua forma mutava come quella di un insetto appena \nemerso dalla crisalide, incapace di trovare un equi -\nlibrio. Matushka scosse la testa e si allontanò: certi \nproblemi vanno persino oltre gli enormi poteri di \nNonna Inverno.\nSlepa la vide e si gettò contro la vecchia, ma la \nleggera nevicata divenne all'improvviso una tempesta \ne Slepa ne perse le tracce in un attimo. “Poco male.” \npensò. L'avrebbe rivista prima o poi.\nSin da quella notte di cinque anni fa, Slepa ha \nvagato per Ussura in cerca di prede, divertimento e \nsoddisfazione ideologica. Le piace sfidare e vincere \ncelebri cacciatori, bestie gigantesche e persino squadre \ndi soldati, ma le sue ambizioni sono cresciute oltre \nle mere uccisioni. Dopotutto ha scelto questa vita \nperché sapeva di essere più di un semplice essere \numano. Molti anni or sono, Slepa era andata alla \nricerca di Matushka per mostrarle la sua forza e velo-\ncità, per dimostrare che era davvero la migliore. Se \nMatushka non vuole aiutarla con un Dono adeguato, \nallora Slepa farà da sola.\nOggi è a capo di un culto di primitivi moderni, \nindividui che Matushka ha rifiutato e a cui Slepa ha \ndato una seconda possibilità, non come mutaforma, \nma come suoi seguaci. Questi personaggi abbando -\nnano ogni strumento della civiltà, si vestono di pelli \ne vanno a caccia con armi improvvisate. Ben pochi \nsopravvivono a lungo al freddo o alle malattie, ma \nquesto genere di esistenza breve, che culmina in una \nmorte onorevole combattendo contro la natura, dà \nloro un senso di completezza che non riuscivano a \ntrovare nelle città e nelle fattorie, tutto per la maggior \ngloria di Slepa Miskovna.\nSlepa vuole vedere crollare la società Ussurana, gli \nedifici bruciare e le fattorie reclamate dalla natura. \nVuole che la gente riscopra quella forza che permise \ndi sopravvivere ai primordi nella landa più dura del \nmondo, prima che la vita di città cancellasse anche il \nricordo di tutto ciò che è degno.\nSlepa sa di essere la migliore, ma ha cominciato ad \naccorgersi che la sua influenza deve estendersi oltre i \nselvaggi tremanti che la seguono. I mutaforma sono \nil futuro e, se solo potesse trovarne altri e aprire \nloro gli occhi riguardo alla sua perfetta ideologia, \npotrebbe prepararsi per la sua ultima meta: la caccia \na Nonna Inverno.\n\n♟️ Macchinazioni:\n(1) Uccidere Miron il Gigante, il cane \nche non dimenticherà mai il suo odore.\nI Kreuzritter hanno dato a lungo la caccia a Slepa \ne ogni volta lei è sopravvissuta a stento. Di recente \nMiron il Gigante, un enorme e infaticabile cane da \ncaccia, è stato alla testa dei suoi inseguitori trovando \nle sue tracce in condizioni impossibili, durante le nevi-\ncate e oltre i fiumi.\n(3) Riunire un branco formato dai \npiù letali mutaforma di Ussura.\nUn lupo ha bisogno di un branco e Slepa sa che \nMatushka ha toccato molti altri uomini e animali. La \nsua prima tappa sarà Pavlov, per incontrare un certo \n“Pavel Mordi-Dita” di cui ha sentito parlare, poi la \nForesta Borovoi, per trovare la donna-gufo.\n(5) Dare la caccia e uccidere \nMatushka in persona.\nNonna Inverno ha rinnegato i suoi figli migliori. Usa \nil suo potere sulla natura selvaggia per proteggere e \ncoccolare gli umani, indegni di attenzione. Se insisterà \na non volersi rendere conto del suo vero potere allora \nsentirà le zanne di Slepa e del suo branco.\n\n🎭 Consigli di Interpretazione:\nQuando Slepa mette all’angolo le sue vittime, se  queste sono fortunate verranno rapidamente uccise.  In alternativa, comincerà a parlare con loro. Ha  sviluppato una complessa e spesso contraddittoria  ideologia, secondo la quale gli umani moderni sono  insignificanti. Tuttavia nel loro combattere con la  natura selvaggia, gli Ussurani mantengono alcune  qualità di valore. Secondo Slepa è necessario che  gli Ussurani si arrendano alla natura e che questa  si metta ai suoi ordini. Ogni cosa che fa e ogni  persona che incontra la fanno sentire più forte e  sicura di sé. Nonostante le arie da omicida auto- sufficiente, questa lupa solitaria non è nulla senza  l’adulazione altrui.",
        "archetype": "Malvagi Furie Inarrestabili"
    },
    {
        "id": "s7_villain_venerio_barleto",
        "name": "Venerio Barleto",
        "category": "villain",
        "type": "Malvagio (Furie Inarrestabili)",
        "nation": "Vodacce",
        "strength": 3,
        "influence": 11,
        "villainyRank": 14,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Compagno Fidato: Bianca, Linguista, Ricco • Virtù: La Ruota Fortunato. Il Malvagio può attivare questa Virtù per  ritardare un’Opportunità o una Conseguenza di  1 Azione. • Superbia: La Torre Arrogante. Il Malvagio riceve un Punto Pericolo quando  mostra disprezzo o considera indegno di attenzione un  Eroe o chi potrebbe causare danno ai suoi amici.",
        "ability": "Servitori & Sottoposti: Il grosso degli uomini al soldo di Venerio è formato da  Duellanti e Guardie. La sua alleata più fidata è Bianca,  la sorellastra della moglie assassinata. Oltre alle normali  caratteristiche di un Compagno Fidato, Bianca è una  Strega della Sorte e può attivare i suoi poteri magici  spendendo Punti Pericolo per conto di Venerio.",
        "notes": "«Lontano da me, orrido spettro! Come può crescere  la mia leggenda se tu rovini i miei sogni e fomenti  la mia ira? Ti ucciderò per tale ardire… ma già  l’Inferno ti ha rigettato sul mio cammino.»\nArchetipo: Malvagi Furie Inarrestabili\n\n📖 Storia:\nPer cercare di uscire dall' indigenza, V enerio Barleto, un \nnobile minore, cominciò a frequentare le feste lussuose \ndei Principi Mercanti. T uttavia, neppure la loro carità \npoteva mantenerlo ben nutrito per sempre. Fu così che \ncominciò a corteggiare Lucita Bosque, un'organizzatrice \ndi feste e arbitro delle dispute tra i nobili. Quando gli \naristocratici di V odacce avevano bisogno di un terreno \nneutrale, era Lucita a fornirlo. Come parte dell' accordo \nmatrimoniale, le risorse di Lucita divennero anche di \nV enerio, il business di lei divenne anche quello di lui, e \ncosì V enerio riuscì a farsi strada a V odacce.\nLa sorellastra di Lucita, Bianca, vide in tutto questo \nun'opportunità per appropriarsi dei beni della sorella, \nmettendole contro il marito un poco alla volta. Non \nimportava che Lucita avesse creato l'azienda e avesse \npiù esperienza, V enerio venne convinto che una donna \nnon poteva avere alcun titolo per gestire un' impresa \nalla pari con il marito. Plagiato da Bianca, quando \nscoprì che Lucita usava il loro denaro – nulla di strano, \nfino a poco tempo prima era solo il denaro di lei – per \nmandare avanti l'azienda, le tagliò la gola nel sonno.\nOggi la collaborazione tra V enerio e Bianca ha ulte-\nriormente gonfiato l'ego di lui. Perché non usare la \nsua posizione di arbitro neutrale a proprio vantaggio? \nPerché non vendere questa neutralità a una parte o \nall'altra, in modo da creare legami con i più potenti \nsignori di V odacce, magari sino a diventare lui stesso \nun Principe Mercante?\nDi recente V enerio è cambiato. Pur restando affabile e \ndiplomatico all'apparenza, sospetto, diffidenza e ambi-\nzione crescente lo hanno mutato nel profondo. La sua \nparlata è diventata ripetitiva, ritmica e misurata, come il \nticchettio di un orologio. Si spaventa della sua ombra e \npassa ore a parlare da solo. T uttavia, avendo il controllo \ndei negoziati a V odacce, potrebbe essere inarrestabile.\nGli altri protagonisti della scena politica e sociale di \nV odacce sono preoccupati, perché V enerio ha comin-\nciato ad essere indiscreto. Per gli standard nazionali, \nV enerio è un individuo arrogante e vanaglorioso che \nusa il proprio potere per fare il bullo. Per ora non ha \nancora fatto nulla che possa davvero preoccupare i \nPrincipi Mercanti, ma ricchezza e contatti, uniti alla \ntestardaggine, gli permettono di passare sopra a molti \ne la buona società di V odacce non sa come comportarsi. \nV enerio pare intoccabile. Ogni evento a cui partecipa \n– e si può essere sicuri che apparirà a ogni riunione \nimportante – diventa teso, nella migliore delle ipotesi, \no un'autentica catastrofe. Vuole essere al centro della \nscena e dell'adulazione di tutti i presenti, entra con \nprepotenza in ogni accordo, minacciando di usare la \nsua influenza per distruggere gli affari di chiunque gli \nsi opponga. Violenza o assassinio sarebbero un'opzione, \nma Bianca, una Strega della Sorte, è sempre all'erta, \npronta a chiamare le guardie del corpo al minimo segno \ndi minaccia. V enerio sembra diventare più potente e più \nfolle ogni notte.\n\n♟️ Macchinazioni:\n(1) Assoldare, convincere o \ncostringere uno stregone a \nesorcizzare lo spettro \nvendicativo di Lucita.\nLo spettro di Lucita, moglie assassinata da V enerio, è \nparticolarmente esasperante: appare solo a lui, spesso \nnei momenti meno opportuni. V enerio deve trovare \nuno stregone esperto nel trattare con i fantasmi, \nperché bandisca questa apparizione a cui nessun altro \ncrede, persino in un mondo dove gli spettri sono rela-\ntivamente comuni.\n(3) Gestire un circolo segreto \ndi Streghe della Sorte \nistruite illegalmente.\nIl divieto di insegnare alle Streghe non significa \nnulla per V enerio. Ha in mente di riunire numerose \nStreghe sotto di sé, grazie a Bianca, allettandole con \nl'idea di ricevere un'educazione e quindi ricattarle \nminacciando di rivelare questa istruzione illegale. \nPrima di farlo dovrà però migliorare la sicurezza della \nsua proprietà.\n(5) Usurpare il trono di un \nPrincipe Mercante.\nCon l'aiuto delle Streghe di cui sopra, V enerio ha \nintenzione di insinuarsi nelle grazie di un Principe \nMercante, scoprire i suoi punti deboli e quindi colpire. \nSpera di riuscire ad agire tanto in fretta da prendere il \ncontrollo prima che chiunque abbia sospetti, evitando \ncosì ogni ritorsione.\n\n🎭 Consigli di Interpretazione:\nAgli occhi dei più, Venerio sembra diplomatico e  dotato di grande tatto, ma sotto questa apparenza  è un intrigante e un folle come se ne vedono solo a  teatro, assolutamente implacabile nella sua ricerca  del potere. Bianca è quasi sempre al suo fianco,  dando l’impressione che il marito e la sorella della  defunta Lucita cerchino reciproco conforto. Quando  è solo, o in compagnia di gente fidata, il suo parlare  prende una cadenza ripetitiva, mentre si lancia in  monologhi drammatici sull’ambizione, il destino e  l’odio. Urla contro il fantasma di Lucita, oppure parla  ai muri come se fossero persone con cui sente di  dover condividere il proprio pensiero.",
        "archetype": "Malvagi Furie Inarrestabili"
    },
    {
        "id": "s7_villain_guiomar_palomino",
        "name": "Guiomar Palomino",
        "category": "villain",
        "type": "Malvagio (Folli)",
        "nation": "Castille",
        "strength": 8,
        "influence": 1,
        "villainyRank": 9,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Immunità ai Veleni, Mano Lesta, Riflessi  Rapidi: Esibirsi, Virtuosa: Danza • Virtù: L’Eroe Coraggiosa. Attivando questa Virtù, il Malvagio ottiene  un numero di Dadi Bonus pari al Grado di Paura del  suo avversario. • Superbia: La Ruota Sfortunata. Il Malvagio riceve 1 Punto Pericolo aggiuntivo  ogni volta che decide di fallire volontariamente un Rischio  importante senza lanciare i dadi.",
        "ability": "Qualità Mostruose: Guiomar ha la Qualità Velenosa. Il suo veleno fa sì che  le vittime comincino a contorcersi e agitarsi violente- mente, la sua mente malata interpreta questi movi- menti come una danza. Inoltre, caso unico, Guiomar  può inoculare il suo veleno con un semplice tocco,  invece di un attacco. Questo farà perdere al bersaglio 2  Incrementi, invece di 1, ma non provocherà ferite.\n\nServitori & Sottoposti: Guiomar non ha servitori e vive un’esistenza solitaria,  eccetto per coloro che costringe a danzare ogni notte.",
        "notes": "«Dovete danzare perché è ciò che desidero  e perché non ne comprendete la bellezza.  In piedi, inutili e pigri seccatori!»\nArchetipo: Malvagi Folli\n\n📖 Storia:\nGuiomar è una donna dalla vitalità sfrenata. Sin da \nquando è nata il suo cuore ha battuto al ritmo delle \nchitarre, ha percepito la libertà nelle figure dei danza-\ntori e ora chiunque lei tocchi è vittima di una parodia \ndolorosa di un vero ballo. La sua ambizione – essere \nammirata per le sua abilità di ballerina – si è trasfor -\nmata in un'assuefazione e nel godere delle contorsioni \ndelle sue vittime.\nGuiomar era la campionessa regionale di Malmignatta, \nun ballo frenetico che si dice fosse stato ispirato dalle \nconvulsioni provocate dal morso di un tremendo ragno. \nAveva dedicato l'intera esistenza a questa pratica \ne non era certo restia a mettere sabbia nelle scarpe \ndei suoi avversari o drogare il loro vino per restare la \nprimadonna dello spettacolo. Dopo ogni rappresen-\ntazione, le sue faide di gelosia nei confronti di altri \nballerini erano al centro dei pettegolezzi locali per \nsettimane, cosa che le dava un enorme piacere.\nDopo uno spettacolo particolarmente faticoso, \nGuiomar, stremata e delirante, vagò per i campi e vide \nballare al chiaro di luna uno dei ragni che davano il \nnome alla Malmignatta. Affascinata, lo lasciò risalire \nsul proprio braccio. Il morso dell'animale avrebbe \ndovuto ucciderla, ma l'adrenalina che le scorreva in \ncorpo per la sua esibizione le permise di sopravvivere \nfinché il veleno non la trasformò completamente. Il \npotere ottenuto da quel morso ha reso folle Guiomar: \ninvece di morire, è stata completamente infusa di \ntossina che ora trasmette attraverso saliva e sudore. \nCon un tocco o un bacio può infettare altri con questa \nfollia ed ora le sue notti si concludono sempre in \nmodo tragico per i compagni di ballo.\nGuiomar è completamente matta, vede il mondo \nattraverso la lente del veleno e le sue illusioni di gran-\ndezza: crede di vivere una grande avventura, nella \nquale porta gioia ovunque vada, danzando sotto \nle stelle verso città sempre più lontane. Durante le \nsue giornate normali balla fino allo sfinimento, ma \nla danza continua nei suoi sogni, finché si sveglia e \nriprende. Non è quasi più capace di distinguere sogno \ne realtà e ciò la rende ancor più terrificante.\nViaggia di continuo di città in città, seguendo \npercorsi casuali, alla ricerca di persone che danzino \ncon lei. Chi sopravvive al suo passaggio piange i morti \ne si prende cura dei comatosi, nella speranza che, un \ngiorno, riprendano conoscenza. I paesi dove Guiomar \ntransita perdono anche parte del loro senso della \ncomunità, poiché feste e balli diventano un doloroso \npromemoria di questa donna folle e turbinante.\nChi è abbastanza fortunato da capire cosa sta acca-\ndendo, potrebbe tentare di blandirla danzando di \npropria iniziativa, ma questa è quasi un'ordalia. Prima \no poi se ne andrà, permettendo di prestare soccorso a \ncoloro che ha toccato. Chi non ha la resistenza fisica \no la pazienza di attendere viene avvelenato per aver \ndistrutto il suo ritmo.\n\n♟️ Macchinazioni:\n(1) Ottenere la proprietà di un locale \nper tenervi feste senza interruzioni.\nIl Vino del Corazón è una taverna con sala da ballo \ndove Guiomar trascorreva molto tempo nei suoi \ngiorni più felici. Sin dalla sua trasformazione è stata \nbuttata fuori molte volte a causa del suo comporta -\nmento folle. L'attuale proprietario è un uomo gioviale, \nchiamato Esteban, che intende riempire il locale di \ngioia e senso della comunità.\n(3) Rapire Camila Montoya, una \ndelle migliori chitarriste Castilliane.\nCome si può danzare senza musica? Camila \nMontoya, famosa in tutto il paese per la sua abilità, \nsi sta esibendo a Zepeda. Guiomar è convinta che \npotrebbe usare il suo tocco per costringerla a suonare \nin eterno, così che lei possa danzare per sempre ed \nessere davvero felice.\n(5) Costringere il sindaco a danzare \nfino alla morte di fronte a tutti.\nIn passato Jimon Del Oro, il sindaco, considerava \nGuiomar una povera giovane malata, ma ora la vede \ncome una pericolosa minaccia. Lei vuole punirlo e \nintende colpirlo attraverso il figlio Raul, con cui aveva \navuto una storia prima di essere morsa. Il giovane \nprova ancora qualcosa per lei e la segue ovunque, \ncercando di convincerla a riposare. Sembra immune \nai comandi di Guiomar.\n\n🎭 Consigli di Interpretazione:\nDanzare! Mentre mormora e canticchia tra sé e  sé, Guiomar prova a toccare altri per trascinarli  nel suo mondo. È completamente folle, una forza  della natura più che una persona. È costantemente  ricoperta di sudore, ma non ne ha l’odore rancido,  emana invece il profumo dolciastro del veleno che  le scorre nelle vene. All’interno di una folla potrebbe  scegliere gli individui più aggraziati o in forma per  danzare con lei, un’esperienza che i sopravvissuti  descrivono come fissare negli occhi un serpente  mentre si cavalca un toro infuriato.",
        "archetype": "Malvagi Folli"
    },
    {
        "id": "s7_villain_kolbjorn_wyrm",
        "name": "Kolbjorn Wyrm",
        "category": "villain",
        "type": "Malvagio (Folli)",
        "nation": "Vestenmennavenjar",
        "strength": 12,
        "influence": 6,
        "villainyRank": 18,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Fama: Feroce, Famiglia Allargata Mano  Pesante, Oggetto Distintivo: Pergamene della  Grande Serpe, Sala d’Armi: Leegstra • Virtù: La Guerra Vittorioso. Quando il Malvagio ferisce per la prima volta  un Eroe in combattimento può attivare questa Virtù  per infliggere una Ferita Drammatica aggiuntiva oltre al  normale danno. • Superbia: Il Mago Ambizioso. Il Malvagio riceve un Punto Pericolo quando  insegue il potere mettendosi in pericolo o causando guai.",
        "ability": "Servitori & Sottoposti: I seguaci di Kolbjorn sono principalmente Duellanti e  qualche Assassino. Kolbjorn premia la ferocia nei suoi  uomini e quindi tende a non impiegare chi si specializza  in azioni difensive o furtive.",
        "notes": "«Non soffrirai più, perché è giunta la morte.  La Grande Serpe ti renderà libero!»\nArchetipo: Malvagi Folli\n\n📖 Storia:\nSin da piccolissimo, Bjorn Magmarsson era uno \nstrano bambino. A differenza di molti coetanei era \npigro e scostante. Il padre tentò di insegnargli il valore \ndel duro lavoro, ma senza successo. Alla fine, lo spedì \na vivere con suo zio Malor vicino alla scogliera. Padre \ne figlio non si parlarono mai più.\nQuando Bjorn raggiunse l'adolescenza era consi -\nderato uno degli scioperati del villaggio. Malor non \nera molto diverso e i due sopravvivevano grazie alla \nrendita dello zio. T uttavia, qualcosa infastidiva il \nragazzo che si sentiva uno sbandato privo di scopo.\nUna sera, mentre sedevano a cena, Bjorn confessò \nquesti sentimenti allo zio. Malor poggiò il boccale \ne raggiunse un armadietto lungo e basso. In seguito, \nBjorn comprese che lo zio gli aveva consegnato le \nPergamene della Grande Serpe solo per zittirlo, ma \nquando vide l'emblema che le suggellava ne fu affasci-\nnato. Leggere della Grande Serpe e del suo inevitabile \nritorno colmò il vuoto nella sua anima. Si alzò con un \nnuovo proposito: sarebbe stato lui, Bjorn, a riportare \nla Grande Serpe alla sua antica gloria.\nBjorn lasciò la casa dello zio per iniziare la propria \ncrociata. T utti i testi che ritrovò concordavano \nche la Grande Serpe sarebbe tornata solo grazie al \nsangue e Bjorn cercò i migliori istruttori per divenire \nun autentico guerriero. Un gruppo di mercenari \nV estenmennavenjar, i Figli del V ento del Nord, lo \naccolse e gli insegnò a combattere. Non era un'attività \nfacile per un ragazzo tanto pigro, ma la sua dedizione \nlo spinse a divenire un assassino feroce e selvaggio.\nQuesto impressionò i Figli, ma non quanto le sue \nprediche sulla Grande Serpe. Ben presto numerosi \nmercenari si convertirono all'ideologia di Bjorn. \nQuesto non fece piacere al loro capo che una notte \ntentò di uccidere il giovane. Bjorn ebbe la meglio sul \nvecchio guerriero e gli frantumò la testa: per questo \ni mercenari lo ribattezzarono Kolbjorn Wyrm, ossia \n“ Araldo della Resurrezione della Grande Serpe” .\nSono trascorsi anni da quella notte e i Figli sono \normai completamente dediti alla causa di Kolbjorn. \nPeggio ancora, hanno cominciato ad avere un certo \nseguito tra i perduti, i confusi e i disgraziati delle \ncittà dove si recano i loro predicatori. Questi indi -\nvidui precedono sempre di un giorno un assalto e \noffrono agli abitanti la possibilità di sacrificare i loro \ncompaesani alla Grande Serpe prima dell'arrivo di \nKolbjorn. Chi compie questo atto viene risparmiato \ne chi sopravvive ha la possibilità di unirsi al culto.\n\n♟️ Macchinazioni:\n(1) Depredare nel nome della Serpe.\nI paesi lungo la costa occidentale sono ormai divenuti \nluoghi agiati grazie alle ricchezze della Lega V endel. \nÈ necessario attaccarne uno di essi per mostrare agli \nabitanti che il potere della Serpe è ancora grande \na V estenmennavenjar.\n(3) Trovare i resti dell’antico \nculto della Grande Serpe.\nEsistono racconti che parlano di una caverna, nelle \nprofondità delle rovine di Costa, dove sono nascosti \nantichi documenti, reliquie di un culto della Grande \nSerpe. Per Bjorn è necessario ritrovare la caverna e le \nreliquie che spieghino le pratiche del culto e i poteri \nche nascondono.\n(5) Distruggere la flotta di Avalon \nin nome della Grande Serpe.\nLa flotta di Avalon è simbolo di quest'epoca deca -\ndente che ha dimenticato la vera devozione dei giorni \npassati. Bjorn vuole affrontare la flotta con la sua nave \ne distruggerla nel nome della Grande Serpe.\n\n🎭 Consigli di Interpretazione:\nKolbjorn è un bearsark nel senso più puro del  termine, si dedica alla distruzione come forma di  preghiera verso un potere più grande. Crede di  canalizzare il potere della Serpe in battaglia e nulla  gli dà maggior piacere. In effetti, ignora ogni altra  preoccupazione oltre il ritorno della Grande Serpe.  Kolbjorn è un uomo dall’aspetto poderoso, con lo  sguardo folle e un sorriso terrificante, che compare  sul suo viso quando parla della Grande Serpe e  diventa più grande quando entra in battaglia.",
        "archetype": "Malvagi Folli"
    },
    {
        "id": "s7_villain_ludwika_krzy_anowska",
        "name": "Ludwika Krzyżanowska",
        "category": "villain",
        "type": "Malvagio (Folli)",
        "nation": "Confederazione Sarmatiana",
        "strength": 4,
        "influence": 7,
        "villainyRank": 11,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Affascinare, Ricca, Stomaco di Ferro, Un  Semplice Malinteso • Virtù: La Strada Amichevole. Attivando questa Virtù quando il Malvagio  incontra un personaggio per la prima volta, anche un  Eroe, questi lo tratterà amichevolmente per una Scena. • Superbia: L’Imperatore Testa Calda. Il Malvagio riceve un Punto Pericolo  quando perde le staffe o provoca guai.",
        "ability": "Servitori & Sottoposti: Il grosso degli agenti al soldo di Ludwika sono  Duellanti, Guardie e Ladri. A volte potrebbe reclutare  dei Pirati affinché rapiscano un individuo particolar- mente molesto che sta ficcando il naso nei suoi affari.",
        "notes": "«Prendi quel ragazzino e rinchiudilo nel sotterraneo  finché non avrà imparato a lavarsi le mani per bene.  A volte mi sembra di combattere questa battaglia da sola.»\nArchetipo: Malvagi Folli\n\n📖 Storia:\nDalle stalle alle stelle, la vicenda di Ludwika \nKrzyżanowska è un autentico racconto di successo \nnella Confederazione. Ludwika crebbe tra gli stenti \nin un istituto per orfani di guerra. Molti dei suoi \ncoetanei non sopravvissero e lei stessa fu più volte \nvittima di malnutrizione. Non ce l'avrebbe fatta se, \nquando aveva 12 anni, non fosse stata adottata.\nI suoi nuovi genitori erano anziani e facevano parte \ndella più antica nobiltà. Cercavano una compagna \ndi giochi per loro figlia, Nora. Ludwika li affascinò \ncantando canzoni popolari del suo villaggio con una \nvoce bellissima. I due la avvolsero in una pelliccia e la \nportarono alla loro residenza nel paese di Kazetzk il \ngiorno stesso.\nIn pochi giorni la vita di Ludwika si trasformò: \nniente più notti insonni a causa dei morsi della fame, \nuna stanza tutta per sé e tante belle cose, dai vestiti ai \ngiocattoli. Era come un sogno divenuto realtà, eccetto \nun piccolo dettaglio: Nora. L'altra ragazza spesso \nrubava e rompeva tutti i regali fatti a Ludwika e la \nincolpava di ogni problema nella casa. Nel frattempo, \nLudwika si sforzava, come ossessionata, di diventare \nl'immagine perfetta di una piccola nobile Sarmatiana.\nL'odio tra le due raggiunse il culmine a causa di un \ndono. Per il 15° compleanno di Ludwika, i genitori \nle donarono un ciondolo d'oro, promettendo di \nprendersi sempre cura di lei. Nora lo rubò e corse per \ngettarlo nel fiume. Ludwika riuscì a riprenderselo in \ntempo e, furiosa, spinse la sorella adottiva in acqua e \nse ne andò lasciandola affogare.\nLa coppia era distrutta, ma ogni volta che la loro \ntristezza si acuiva, Ludwika appariva per cantare e \ndar loro conforto. A 18 anni, ereditò la fortuna di \nfamiglia e la proprietà della casa in città, ma non era \nsoddisfatta di vivere come una semplice proprietaria \nterriera. Investì il denaro in progetti per abbellire \nla città, guadagnandosi il rispetto di molte famiglie \ne commercianti.\nIn cinque anni divenne un pilastro della comunità, \ndopo dieci sindaco e Kazetzk si trasformò da paesello \nsonnacchioso a un magnifico paradiso bucolico. Le \nabitazioni squallide e i contadini cenciosi erano spariti. \nLa popolazione era ben pasciuta e le case perfette \nrappresentazioni da cartolina. Era tutta opera di \nLudwika, volta a fare di Kazetzk il luogo più perfetto \ndella Confederazione. Ovviamente, però, la perfezione \nha un prezzo.\nLudwika governa Kazetzk come un tiranno e ha già \nmanipolato tre elezioni per mantenere il controllo \nsul futuro del paese. Nella migliore delle ipotesi, gli \nabitanti che non si adeguano si ritrovano ben presto \nsenza lavoro e buttati fuori.\n\n♟️ Macchinazioni:\n(1) Pubblicare e far rispettare degli \nstandard di bellezza per il paese.\nNulla è mai abbastanza perfetto per Ludwika e i \nsuoi piani per la continua rivitalizzazione di Kazetzk \nrichiedono un codice di abbigliamento, pulizia e \nprogettazione architettonica sempre più rigido. Le \nguardie cittadine sono state informate di questi nuovi \nstandard e hanno ricevuto l'autorizzazione per appli-\ncarli con ogni mezzo necessario.\n(3) Screditare ogni possibile \navversario alla carica di sindaco.\nMila Y udkovitz vuole liberare la città dalla presa di \nLudwika e per questo si è candidata alle prossime \nelezioni. Questo non deve succedere, per cui Mila \ndovrà essere screditata, ma sembra sia un angelo di \nmisericordia senza alcuno scheletro nell'armadio. \nLudwika è pronta a tutto per eliminare l'avversaria.\n(5) Distruggere l’orribile \norfanotrofio Karolżka.\nL'orfanotrofio Karolżka è il simbolo di molti brutti \nricordi per Ludwika, e vorrebbe vederlo ridotto in \ncenere. Attualmente l'istituto ospita 80 bambini, ma \nla sua sola vista rende Ludwika furiosa. Ha un piano \nper incendiarlo e dare la colpa ad alcuni briganti.\n\n🎭 Consigli di Interpretazione:\nLudwika è cresciuta nella miseria più nera e i segni  di quelle antiche privazioni sono ancora visibili.  Tuttavia è molto orgogliosa del suo aspetto e non  uscirebbe mai con un solo capello fuori posto. Il suo  caratterino è leggendario: quando parla di affari è  gentile, flemmatica e carismatica, ma se qualcuno  viola l’etichetta o lorda la sua città, allora si infuria  talmente tanto che le guardie cittadine hanno  imparato a non mettersi sulla sua strada.",
        "archetype": "Malvagi Folli"
    },
    {
        "id": "s7_villain_madama_illuminata",
        "name": "Madama Illuminata",
        "category": "villain",
        "type": "Malvagio (Folli)",
        "nation": "Vodacce",
        "strength": 6,
        "influence": 7,
        "villainyRank": 13,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Senso dell’Orientamento, Sguardo di Ghiaccio, Università, Vieni Qui, Volontà  Indomabile • Virtù: Il Glifo Mite. Attivando questa Virtù, il Malvagio impedisce a  qualsiasi effetto magico (Stregoneria, Artefatti, Mostri  ecc.) di avere effetto su di lei. • Superbia: L’Impiccato Indecisa. Il Malvagio riceve un Punto Pericolo quando  spreca un’Azione esitando in preda al dubbio o  all’incertezza.",
        "ability": "Servitori & Sottoposti: Madama Illuminata ha molta Influenza, ma non  impiega direttamente alcun servitore. Preferisce  comandare le forze del Principe Mercante che sia il suo  attuale benefattore.",
        "notes": "«Cielo, quale delusione.»\nArchetipo: Malvagi Folli\n\n📖 Storia:\nA V odacce ci si aspetta che le donne siano presenti \nma silenziose, almeno finché una giovane non prova \na passare il segno. A questo punto viene avvertita che, \nse non starà attenta, Madama Illuminata verrà a pren-\nderla per trascinarla nell'oscurità. Può sembrare un \nracconto dell'orrore usato per spaventare le ragazze e \ncostringerle all'obbedienza, ma la terribile Madama \nIlluminata è una orrida realtà.\nUn tempo Isabella Lorenzo era un' Eroina. Cresciuta \nnella capitale del principato di V estini, era l'orgogliosa \nprimogenita della famiglia, un esempio perfetto di \ngrazia e buona educazione. V enne data in sposa giova-\nnissima al Conte Roberto Delaga da cui ebbe due figli \ne una figlia, Viola: sembravano una famiglia perfetta.\nIn realtà, dietro le quinte della buona società, era \nun disastro. Il Conte era duro e violento e quando \nIsabella tornò a casa cercando l'aiuto del padre le \nvenne risposto di fare la buona moglie e fu rispedita \ndal marito. Fu allora che un agente delle Figlie di \nSofia la contattò e la aiutò a pianificare la fuga. Nel \nfrattempo, Isabella aiutò altre donne.\nI suoi alleati procurarono un passaggio per lei e i \nfigli su una nave diretta a Numa, ma mentre stava \npreparando Viola, il figlio maggiore apparve seguito \ndal Conte. Il marito la fece arrestare per tentato rapi-\nmento e la chiuse in prigione. Non rivide mai più i figli, \nalmeno non con i suoi veri occhi.\nDurante il tentativo di fuga, Isabella si ruppe una \ncaviglia che non venne curata adeguatamente e la \nlasciò con un dolore lancinante e imperituro. Rimase \nin ceppi per tre settimane, poi il Conte giunse con \nalcuni uomini avvolti in mantelli scuri. La trascina -\nrono in una stanza e le promisero che a breve sarebbe \nstata bene. Mentre lei cercava di combatterli, la lobo-\ntomizzarono. Il suo ultimo ricordo, impresso a fuoco, \nfu il volto piangente di Viola. T utto il resto venne \nspazzato via dalla lobotomia e dagli anni di condizio-\nnamento che seguirono.\nCiò che rimase al termine di questa ordalia lunga \nanni non era più la Contessa Isabella Delaga, ma \nun incubo mascherato: Madama Illuminata. Gli \nagenti dei Principi Mercanti miravano a creare \nl'arma perfetta contro le Figlie di Sofia. Convinsero \nIsabella che un tempo aveva una famiglia, distrutta \ndal comportamento immorale delle Figlie. Indebolita \ncom'era, fu indotta a credere che fosse suo sacro \ndovere sradicare tali comportamenti decadenti \novunque comparissero.\nQuando furono certi della sua lealtà, donarono a \nMadama Illuminata una maschera che ronzava di \npotere e i cui occhi erano pozzi di oscurità. La sua \nposizione di gradita ospite dei Principi Mercanti le dà \naccesso a ogni angolo della società e ne fa un'inquisi -\ntrice sola contro l'indecenza.\n\n♟️ Macchinazioni:\n(1) Umiliare una donna del bel mondo \nmettendo a nudo i suoi difetti.\nNessuno è perfetto, ma le donne di V odacce devono \nsempre aspirare alla perfezione. Dafne Corti è scesa \nsotto gli standard di Madama Illuminata e perciò \ndovrà essere messa al suo posto, pubblicamente \ne dolorosamente.\n(3) Corrompere le Guardie \ndelle Figlie di Sofia.\nLe Figlie di Sofia hanno numerosi protettori che \npossono essere corrotti. Trovare delle Guardie che \nlavorino per lei permetterebbe a Madama Illuminata \ndi scoprire i nomi delle donne che stanno per passare \nil segno.\n(5) Trovare la nipote scappata \ndi casa e lobotomizzarla.\nMadama ricorda Viola come una bambina perfetta. \nCom'è possibile che la figlia – Clarissa, sua nipote – \nsia fuggita per unirsi alle Figlie di Sofia? È necessario \nritrovarla affinché si unisca a Madama Illuminata \nnella sua santa crociata contro l'immoralità.\n\n🎭 Consigli di Interpretazione:\nMadama Illuminata è un incubo incarnato, un  mostro che si nasconde nella notte per spaventare  le giovani e costringerle a comportarsi secondo le  regole della buona società. Prodotto di anni di muti- lazioni, torture e condizionamenti mentali, Madama  Illuminata nasconde la sua malevolenza sotto una  maschera imperscrutabile. Si muove attraverso  la buona società come una minaccia implicita, un  baluardo contro atti sconvenienti, un orrore che i  Principi tollerano perché aiuta a tenere le donne al  loro posto. Le sue calzature di legno strisciano sui  pavimenti di pietra, mentre lei trascina lentamente  la gamba zoppa e dolente.",
        "archetype": "Malvagi Folli"
    },
    {
        "id": "s7_villain_pavel_mordi_dita",
        "name": "Pavel Mordi-Dita",
        "category": "villain",
        "type": "Malvagio (Folli)",
        "nation": "Ussura",
        "strength": 6,
        "influence": 1,
        "villainyRank": 7,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Aggressione Sconsiderata, Equilibrio Perfetto,  Lavorare sui Tetti, Minuto, Pugilatore • Virtù: Le Monete Adattabile. Attivando questa Virtù, il Malvagio può  eseguire la sua prima Azione anticipando chiunque  altro nel corso di un Round. • Superbia: L’Impiccato Indeciso. Il Malvagio riceve un Punto Pericolo quando  spreca un’Azione esitando in preda al dubbio o  all’incertezza.",
        "ability": "Qualità Mostruose: La trasformazione di Pavel in un Mostro non è  completa, ma non è più del tutto umano. Ha la  Qualità Notturno.\n\nServitori & Sottoposti: Al presente, Pavel ha solo la compagnia dei ratti e  nessun servitore.",
        "notes": "«Conosci le mie storie, vero? I ratti  delle fogne te le racconteranno, se li ascolti.  Nessuno li sente, nessuno eccetto me.»\nArchetipo: Malvagi Folli\n\n📖 Storia:\nUn tempo, Pavel Mordi-Dita era solo un personaggio \nusato per spaventare i bambini: “Tieni i piedi sotto \nle coperte, oppure Pavel Mordi-Dita te le staccherà!”\nPavel Ivanovich visse con sua madre fino all'età di \n17 anni e lei continuava a raccomandargli di stare \nattento al suo omonimo. Era una donna fantasiosa, \nmagrissima, malaticcia e appassionata di storie. Molti \ndei compaesani la consideravano decisamente eccen-\ntrica, ma i suoi racconti – che parlavano di bicchieri \ndi latte accanto al letto e di questo Pavel capace di \ntrasformarsi da uomo in ratto e viceversa – affasci -\nnavano tutti.\nIl figlio – piccolo, malaticcio ed eccentrico come \nla madre – la adorava; quando morì soffrì enorme -\nmente. Andò a vivere con lo zio mugnaio e i suoi \nsette figli, robusti e vigorosi, che decisero di curarlo \nattraverso l'umiliazione. Ogni sera, gli venivano date \ncoperte troppo corte per coprirsi completamente, non \nimportava come si avvolgesse. I cugini ridevano del \nsuo contorcersi e gli pizzicavano i piedi finché non \nse la faceva addosso per la paura. Quando succedeva, \nchiamavano il padre che costringeva Pavel a lavare le \nlenzuola nel torrente gelido e a dormire, tremando, \nnella biancheria ancora umida.\nAlla fine Pavel si rese conto di non essere perse -\nguitato da uno spettro nato da un racconto, ma dai \ncugini; decise perciò di vendicarsi. I sette comin -\nciarono a risvegliarsi con segni di denti affilati sui \npiedi. V ennero trovati una decina di ratti nei muri e \nil maggiore dei sette ammise che, forse, Pavel aveva \nragione a temere il Mordi-Dita.\nSarebbe dovuta finire lì, ma Pavel era già andato \ntroppo oltre. La madre credeva nell'esistenza del \nMordi-Dita, quindi… perché lui non avrebbe dovuto \nrendere la favola realtà? Le apparizioni continuarono \nin tutto il villaggio, finché l'isteria non crebbe a tal \npunto che il mugnaio decise di trasferirsi a Pavtlaw. \nPavel era felicissimo, perché si diceva che il Mordi-\nDita fosse originario di Pavtlaw.\nNelle taverne della città i racconti sul Mordi-Dita \nabbondavano: si diceva vivesse nelle fogne e per \nquesto motivo Pavel fuggi di casa e imparò a vivere \nnel sottosuolo.\nCominciò a udire i ratti mormorargli all'orecchio ed \nera ancora abbastanza sano di mente da meravigliarsi.\nFino a quel momento, Pavel dubitava di essere \ndavvero il mostro dei racconti di sua madre, ma \nora sapeva di essere proprio il Mordi-Dita. Questo \ngli impedì di vivere una vita normale perché, come \nraccontava la madre, il Mordi-Dita odiava gli uomini. \nPavel poteva aver deciso di passare la vita a mordere \ngli alluci altrui, ma non aveva mai concepito l'odio. \nOra lo indossa come un manto di pelle di topo.\n\n♟️ Macchinazioni:\n(1) Trovare la tana del Dio dei Ratti.\nSi racconta che Pavel divenne Re dei Ratti trovando e \ndivorando il Leshiye conosciuto come Dio dei Ratti. I \ntopi delle fogne hanno confermato a Pavel che il Dio \nesiste, ma che per suo ordine non possono rivelargli \ndove si trova. Quando non sta terrorizzando gli umani, \nPavel va alla ricerca della tana del Leshiye.\n(3) Divorare il Dio dei Ratti \nper rubarne il potere di \ncomandare i roditori.\nTrovare un Leshiye è una cosa, ma divorarlo è ben \ndiverso. Chi può sapere quali poteri soprannaturali \nha a disposizione? Pavel può essere capace di trasfor-\nmarsi da uomo in ratto, ma questo non sarà sufficiente. \nSe vuole battere il Dio dovrà essere scaltro.\n(5) Usare i ratti infetti per \nscatenare una pestilenza.\nI cacciatori di ratti sostengono che durante un anno \ncon due lune blu, i topi sciameranno fuori dalle fogne \ne provocheranno una pestilenza. Questa rara coinci-\ndenza astrale non è lontana e i cittadini di Pavtlaw \nincolpano il Mordi-Dita dell'aumento dell'attività dei \nratti. Pavel è convinto che, se non dovesse dare il via \na questa pestilenza, tradirebbe il suo ruolo e le storie \nsul Mordi-Dita svanirebbero.\n\n🎭 Consigli di Interpretazione:\nPavel ha dimenticato i modi umani: è lercio, si pulisce  il naso con la manica, mangia le cispe, è ingobbito,  si agita continuamente e squittisce. Quando parla  sputa e si ripete. Non ha alcuna considerazione  per lo spazio personale altrui, perciò tende a stare  fastidiosamente vicino agli altri esseri umani, oppure  lontano. Chi dovesse coglierlo di sorpresa, però,  scoprirebbe che i suoi modi di fare sono diversi  quando non pensa di essere il personaggio di un  racconto: è stato cresciuto da una madre amorevole  e questo, in qualche modo, si nota ancora.",
        "archetype": "Malvagi Folli"
    },
    {
        "id": "s7_villain_sakse_tryggvasson",
        "name": "Sakse Tryggvasson",
        "category": "villain",
        "type": "Malvagio (Folli)",
        "nation": "Vestenmennavenjar",
        "strength": 10,
        "influence": 2,
        "villainyRank": 12,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Mano Pesante, Riflessi Rapidi: Mischia, Solo  Contro Tutti, Ti Porto con Me, Volontà  Indomabile • Virtù: Il Matto Scaltro. Attivando questa Virtù, il Malvagio può sfuggire  al pericolo nella Scena in corso. Potrà salvare solo  se stesso. • Superbia: Gli Amanti Divisi dal Destino. Il Malvagio riceve un Punto  Pericolo ogni volta che si innamora di qualcuno di cui  non dovrebbe.",
        "ability": "Servitori & Sottoposti: Sakse non ha servitori devoti, ma sta cercando un  nuovo equipaggio per la Gyllen. Sa dove trovare  malfattori pronti a tutto per denaro, principalmente  Duellanti, Ladri e Pirati.",
        "notes": "«Comprendi il significato del sacrificio, mia cara?  Qualche ricciolo dorato è un piccolo prezzo  per un amore come il nostro…»\nArchetipo: Malvagi Folli\n\n📖 Storia:\nDa piccolo Sakse era un bullo, un ladruncolo e uno spac-\ncone, l' imbarazzo della famiglia. Con il passare degli anni \nquesti comportamenti divennero rabbia e poi ossessione: \nil solo punto fermo nella sua costante furia era Snorri, la \nfiglia del carl locale, sua amica d' infanzia. Snorri aveva i \ncapelli come l'oro e una voce che rischiarava l' animo di \nSakse, anche se solo per poco.\nMan mano che Sakse cresceva, da bambino rancoroso \nad adulto rabbioso, la sua ossessione per evitare il Fato \ncrebbe di pari passo con “l' amore” per Snorri. La osservava \nda lontano, convinto che un semplice pescatore come lui \nnon avrebbe mai potuto impressionare la figlia del carl… \nma se fosse stato qualcosa di più? Armato del suo fedele \ncoltello per scuoiare abbandonò Kopingsvik e si arruolò \ncome corsaro V endel.\nSakse dimostrò di essere più pirata che corsaro, avido \ne sanguinario in egual misura. Raramente faceva prigio-\nnieri ed era crudele con i pochi sfortunati che catturava. \nUn giorno la sua nave avvistò un mercantile Avaloniano \ndanneggiato che stava entrando in acque V endel. Sakse \ncondusse di persona l' abbordaggio e si trovò di fronte un \nnobiluomo ferito, un ribelle che chiedeva asilo dopo la \nsalita al trono della Regina Elaine.\nFebbricitante per le ferite ricevute durante la fuga da \nAvalon, il nobile parlò di come aveva astutamente nascosto \nil tesoro di famiglia ai piedi di un colle, dove Elaine non \nlo avrebbe mai trovato. Mentre il lord spirava tra le sua \nbraccia, Sakse vide di fronte a sé una strada lastricata di \noro straniero, che lo avrebbe condotto dritto da Snorri. La \nprima cosa che fece fu pugnalare al cuore il suo capitano, \ngettarlo fuoribordo e prendere il comando con la violenza.\nLa banda di Sakse si fece strada per tutta Avalon \nbruciando e terrorizzando finché non giunse al paese di \nSilverdale, distruggendolo fino alle fondamenta e passando \ntutta la popolazione a fil di spada. Mentre scendeva la \nnotte, i razziatori scavarono la collina alle spalle della \nresidenza del lord alla ricerca dell'oro, ma trovarono solo \nla furia incontrollabile di un antico Sidhe. Solo Sakse \nuscì vivo da Silverdale, con appena un barlume di sanità \nmentale intatto, dopo aver subito mezzo scalpo e essere \nstato maledetto con l' incapacità di riconoscere i volti altrui. \nIl Sidhe gli disse che l' unico modo per rompere la maledi-\nzione era di fare lo scalpo all'oggetto della sua ossessione, \nSnorri, e riportargli i capelli.\nT ornato a Kopingsvik, Sakse si introdusse nottetempo \nnella casa del carl. Entrò all' improvviso nella stanza di \nSnorri e vide due bellezze dai capelli dorati che lo fissavano \nterrorizzate. Incapace di distinguerne i volti, Sakse affondò \nil coltello nella più vicina, mentre l' altra fuggiva. Le urla \ndel padrone di casa lo spinsero a scappare in fretta, con le \nguardie alle calcagna.\nIn seguito scoprì di aver ucciso la sorella di Snorri. Un \nsemplice malinteso che, è sicuro, la sua amata gli perdonerà, \nperché l' amore di lei non può essere inferiore al suo. Lo \nvedrà quando tornerà per farle lo scalpo.\n\n♟️ Macchinazioni:\n(1) Riunire un equipaggio per \nrazziare le coste di Avalon.\nUn effetto collaterale della maledizione è che Sakse \nè in grado di percepire gli individui con il potere \ndell'Incanto. Da quando ha ribattezzato la sua nave \nGyllen, Sakse ha cominciato a sfogare la sua rabbia \ncontro le coste di Avalon. L'equipaggio è formato da \nuna banda di V endel esiliati che indossano le chiome \nbionde delle loro vittime come cinture.\n(3) Rubare le “Lacrime del \nSole” , i pugnali del Maestro \ndi Boucher Demarque.\nL'abilità con i coltelli di Demarque, già leggendaria, \nè ulteriormente potenziata dalle “Lacrime del Sole” . \nQuesta coppia di pugnali venne realizzata con il ferro \nestratto da un meteorite, la cui caduta sulla T erra fu \ndescritta come una pioggia d'oro. Il Duellante ha \nsalvato Snorri dal secondo tentativo di Sakse di farle \nlo scalpo, provocando l' ira e l'ossessione del corsaro, \nche non si fermerà davanti a nulla pur di ucciderlo e \nusare i suoi pugnali contro il Sidhe che lo ha maledetto.\n(5) Fare lo scalpo a Snorri per \nrompere la maledizione e \nuccidere il Sidhe per vendicarsi.\nSakse non avrà riposo finché non romperà la male -\ndizione. Il suo primo tentativo è stato rovinato dal \ncaso, il secondo da Demarque. Non intende fallire una \nterza volta, né a causa del carl né di Demarque. Ha \nintenzione di tornare a Silverdale con lo scalpo stretto \nin pugno e poi vendicarsi.\n\n🎭 Consigli di Interpretazione:\nLo sguardo abbattuto di Sakse e i suoi pochi capelli,  nascondono un volto che passa continuamente dalla  confusione all’allegria o alla furia. Fa di tutto per  evitare di guardare gli altri in faccia, ma è diventato  un attento osservatore di abiti, gesti, voci e, soprat- tutto, capelli. Da tempo non conosce la paura e  gode della compagnia della sua ciurma di tagliagole.  Il coltello per scuoiare è sempre al suo fianco e chi lo  nota tende a girare al largo.",
        "archetype": "Malvagi Folli"
    },
    {
        "id": "s7_villain_stewart_il_goblin_della_palude_di_den",
        "name": "Stewart, il Goblin della Palude di Den",
        "category": "villain",
        "type": "Malvagio (Folli)",
        "nation": "Le Marche delle Highland",
        "strength": 5,
        "influence": 1,
        "villainyRank": 6,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Equilibrio Perfetto, Esperto di Sopravvivenza,  La Fortuna del Diavolo, Riflessi Rapidi: Atletica, Senso dell’Orientamento • Virtù: Il Matto Scaltro. Attivando questa Virtù, il Malvagio può sfuggire  al pericolo nella Scena in corso. Potrà salvare solo  se stesso. • Superbia: L’Imperatore Testa Calda. Il Malvagio riceve un Punto Pericolo  quando perde le staffe o provoca guai.",
        "ability": "Servitori & Sottoposti: Stewart non ha amici e lavora da solo.",
        "notes": "«La palude, la palude, la palude è casa nostra.  Lei lo capirà, prima o poi. Io devo solo fare in modo  che mi ami e questo dovrebbe essere facile.»\nArchetipo: Malvagi Folli\n\n📖 Storia:\nLa gente di Bolger Falls, nelle Marche delle Highland, \nsapeva che Stewart era diverso sin dal momento in cui \nnacque. Era un bambino strano, con arti lunghi e denti \naffilati e appuntiti. Poco dopo la morte della madre \ncominciarono le angherie, mentre Stewart cercava solo \ndi vivere una vita normale e di prendersi cura di sé. \nAlla fine decise che, se l'intero paese lo considerava un \nmostro, allora avrebbe recitato quella parte.\nDa quel momento, Stewart divenne un seminatore \ndi zizzania: lasciava regali orridi alle ragazze e metteva \ninsetti nei letti dei paesani. Dopo ogni burla si ritirava \nnella Palude di Den, un'area acquitrinosa appena a \novest di Bolger Falls. Lì si sentiva a casa e scovò un \npiccolo cottage nella palude che divenne il suo regno.\nI suoi scherzi gli procurarono l'odio dei compaesani \ne divenne il bersaglio di tutti. Fu allora che incontrò \nLillian MacDowell, figlia del proprietario terriero \nlocale, molto potente nelle regione. Era famosa per \nessere la ragazza più generosa della zona e, senza farsi \nintimorire, difese Stewart dai paesani.\nI due divennero amici e non ci volle molto perché \nStewart si innamorasse perdutamente di Lillian e \ncominciasse a pianificare il più incredibile dei corteg-\ngiamenti. Era convinto che, se Lillian lo vedeva come \nuna persona normale, era perché voleva stare con lui.\nStewart organizzò una sorpresa per Lillian: un \nmagnifico picnic ai margini della palude, con fiori e \ntutti i suoi piatti preferiti. Quando le confessò il suo \namore Lillian, sorpresa, gli rispose che erano amici e \nnulla più. Con il cuore spezzato, Stewart si infuriò. \nCredendo che Lillian avesse solo bisogno di essere \nconvinta la rapì e la portò nel suo piccolo regno \nnella palude.\nIn paese scoppiò il fermento. La famiglia – soprat-\ntutto la sorella, Deidre, accompagnata dal fidanzato \nFearghal – la cercò ovunque, ma Lillian sembrava \nessere stata ingoiata dagli acquitrini.\nNel cuore della palude, Lillian tentò per giorni di \nsfuggire a Stewart, che provò di blandirla con parole \ne doni, urlandole contro quando lei non gli rivolgeva \nneppure un sorriso. Una notte, Stewart uscì per \ncontinuare a tormentare i paesani e Lillian scappò. \nNonostante fosse libera, decise che non poteva \ntornare a casa prima di aver fermato il giovane, perciò \nsi nascose in un antico rifugio delle fate. Quando \nStewart scoprì la fuga si infuriò, le diede la caccia per \ntutta la palude, ma le pietre incantate la nascosero. \nOggi Stewart si sfoga sugli abitanti: ha intenzione di \nattirare Lillian fuori dal suo nascondiglio in un modo \no nell'altro.\n\n♟️ Macchinazioni:\n(1) Rovinare il matrimonio di Deidre \ne Fearghal con una carica di bovini.\nLa sorella minore di Lillian sta per sposarsi con il \nsuo amato Fearghal e sarà l'evento dell'anno in paese. \nStewart è certo che Lillian uscirà dal suo nascondi -\nglio per essere presente, specie se un piccolo disastro \ndovesse complicare le cose. Il matrimonio avverrà \nproprio vicino ai recinti del bestiame e Stewart ha \nun piano.\n(3) Molestare i paesani con \ntrappole, incendi e animali morti.\nStewart è stato vittima delle prepotenze per molti \nanni e si sta vendicando: tormenta il villaggio con ogni \ngenere di malefatta per pareggiare i conti.\n(5) Rapire il fratellino di Lillian \nper costringerla ad amarlo.\nFinché Lillian resta lontana da Stewart non potrà mai \ninnamorarsi di lui, ma se dovesse venire a salvare il \nsuo fratellino, Colin, dopo che lui lo avrà portato nella \npalude? Quando sarà tornata, Stewart è certo che sarà \nin grado di convincerla ad amarlo.\n\n🎭 Consigli di Interpretazione:\nStewart è stato vittima dei bulli da piccolo e questo  lo ha trasformato nel mostriciattolo viziato che  tutti vedevano mentre cresceva. È l’incarnazione  del classico mostro delle paludi delle Highland.  Ogni grammo di amore che provava lo dedicava a  Lillian e, quando lei lo ha rifiutato, questo affetto  si è tramutato in ossessione. Stewart si comporta  come un mostro, ma quando vede Lillian diventa un  giovane cordiale, anche se un po’ rozzo, che tenta  disperatamente di conquistare l’attenzione della  sua bella.",
        "archetype": "Malvagi Folli"
    },
    {
        "id": "s7_villain_la_dama_bianca_della_torre_di_hirschblut",
        "name": "La Dama Bianca della Torre di Hirschblut",
        "category": "villain",
        "type": "Malvagio (Folli)",
        "nation": "Eisen",
        "strength": 6,
        "influence": 5,
        "villainyRank": 11,
        "hp": 20,
        "size": "Media",
        "traits": "Vantaggi: Compagno Fidato: Groll, Ricca, Scuola di  Maniere • Virtù: La Strada Amichevole. Attivando questa Virtù quando il Malvagio  incontra un personaggio per la prima volta, anche un  Eroe, questi lo tratterà amichevolmente per una Scena. • Superbia: La Guerra Leale. Il Malvagio riceve un Punto Pericolo quando  torna indietro per aiutare un compagno caduto o si  rifiuta di abbandonare un ferito.",
        "ability": "Qualità Mostruose: Di solito la Dama appare come una donna Eiseniana  molto bella e pallida, autentica incarnazione di grazia e  fascino. Quando si trova in pericolo, però, manifesta le  Qualità Elementale (ghiaccio), Rigenerante e Terrificante.\n\nServitori & Sottoposti: I paesani sotto il controllo della Dama sono personaggi  insignificanti che agiscono come normali Sgherri. Di  solito evitano gli scontri e si limitano a mettere in giro  false voci su Schlammann o a cercare pezzi di Groll per  essere ricompensati. Groll era il più potente servitore  della Dama. Se riuscisse a recuperarne tutti i pezzi e a  ridargli vita ritornerebbe a essere una creatura terrifi- cante che risponde solo a lei.",
        "notes": "«Entrate e sedetevi. Riposate i vostri piedi dolenti.  Raccontatemi delle terre lontane che avete   visitato e delle genti che avete incontrato.  Sto morendo dalla voglia di udire il vostro racconto,  devo assolutamente avervi qui per cena.»\nArchetipo: Malvagi Folli\n\n📖 Storia:\nMolti anni fa la Dama Bianca della T orre di Hirschblut \nera solo Anne, la figlia del fornaio. Un inverno il cibo \ndivenne tanto scarso che neppure la sua famiglia aveva \npiù nulla da mangiare. Disperato, il padre mandò \nAnne a raccogliere la legna per il fuoco e, al suo ritorno, \nscoprì che il padre aveva ucciso il suo amato cane, \nArno, per arrostirlo.\nLa furia di Anne fu travolgente. Afferrò un coltello e \ntagliò la gola del padre, poi prese la carcassa di Arno e \ncorse nella foresta. Si fermò solo quando i suoi piedi \nfurono scorticati e i polmoni le bruciavano. Prese a \npugni il terreno diverse volte, finché la follia non si \nimpossessò del suo cuore alla vista della neve sciolta \nche si mescolava al sangue attorno al corpo del cane.\nIn un momento di illuminazione, Anne comprese \ncosa doveva fare. Per giorni uccise piccoli animali e \nli cucì al cadavere, per donargli una nuova vita sacri-\nlega. Cantò canzoni di fronte alla carcassa e la baciò \ndelicatamente. Al settimo giorno, la creatura si rialzò \ndalla neve.\nQuesto essere prese il nome di Groll e offrì la sua \ndevozione ad Anne. Trascorsero l'inverno insieme, \nmassacrando chiunque incontravano. A ogni ucci -\nsione Anne divenne sempre più bella e Groll sempre \npiù deforme. Più potere lei dava al mostro, più la sua \nmagia si rafforzava insieme al loro legame.\nQuando tornarono al paese, Anne era irricono -\nscibile. Un gruppo di banditi stava tormentando la \npopolazione e i due li uccisero, non per bontà d'animo \nma per nutrirsi. Quando gli abitanti vennero a cono-\nscenza degli sforzi di Anne, nella mente della giovane \nbalenò un'idea.\nCompì altre azioni eroiche, usando le sue arti oscure \nsolo durante la notte e, ben presto, gli abitanti la \nnominarono Signora della T orre di Hirschblut. Fu \nallora che Anne lanciò un incantesimo sul paese: \nogni notte cancellava i ricordi di tutta la popolazione. \nHirschblut divenne il terreno di caccia di Groll.\nUn giorno, apparve in paese un uomo coperto di \nfango, che sosteneva che la Dama non fosse la salva-\ntrice di Hirschblut, ma una strega. La Dama e Groll \naffrontarono Schlammann nella piazza e combatte-\nrono sino all'alba del giorno successivo.\nL' Eroe uccise Groll, ma non riuscì a dare il colpo \ndi grazia a una donna tanto bella e se ne andò per \nseppellire i resti del mostro ai quattro angoli di Eisen.\nLa Dama si ritirò nella torre, guarì e pianse il suo \namore in solitudine. La stessa furia che aveva provato \nanni prima a causa delle azioni del padre divampò: \nla morte sarebbe stata una punizione troppo blanda \nper Schlammann; lanciò invece un incantesimo per \ncancellare la sua identità e lo maledisse, costringen-\ndolo a vagare per Théah ignorante della sua vera \nnatura, fino a quando Groll non sarà ricostruito \naffinché possano divorarlo insieme.\n\n♟️ Macchinazioni:\n(1) Diffondere bugie sugli orribili \natti di Schlammann.\nLudwig Schlammann si crede un Eroe di Eisen, ma \naver perso la memoria lo ha portato a basarsi sui \nracconti popolari per decidere come agire. La Dama \nnon riesce a pensare a una punizione più appropriata \ndel trasformarlo in un Malvagio. Quando recupererà \nla memoria vedrà il mostro che è divenuto.\n(3) Divorare uomini per \nrestare giovane.\nLa giovinezza della Dama è legata alla forza vitale \naltrui. Nonostante sia ancora timorosa di un nuovo \nattacco da parte di Schlammann, deve divorare una \npersona alla settimana per mantenersi giovane e \npotente. La popolazione di Hirschblut non potrà \nsostentarla per sempre e inoltre il paese è una \ncopertura troppo importante. Deve trovare i suoi \npasti altrove.\n(5) Resuscitare il suo grande amore, \nGroll, riunendo il suo scheletro.\nLo scheletro di Groll venne disperso ai quattro angoli \ndi Eisen da Schlammann e la magia della Dama non \nè stata abbastanza potente da fermarlo. Ora sta \ninviando i suoi migliori cavalieri a ritrovare queste \nossa per far risorgere il suo amore. Sente che questi \nresti la chiamano e il più vicino si trova nella Wälder.\n\n🎭 Consigli di Interpretazione:\nLa Dama della Torre di Hirshblut è educata e  cortese: non alza mai la voce, che risuona come il  cinguettio di un uccello. Nonostante tutta l’oscurità  e la malignità che albergano nel suo animo, appare  sempre buona e gentile. La sua vera natura viene alla  luce solo nei momenti più intimi e oscuri, quando  sta per divorare una vittima o si dispera per la morte  del suo amato. È allora che si trasforma nel mostro  che è realmente, stravolta dalla rabbia e resa folle da  anni di solitudine e atti innominabili.",
        "archetype": "Malvagi Folli"
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
        "traits": "Vigore 3, Grazia 2, Risolutezza 2, Acume 3, Panache 3 • Virtù: La Strega Intuitivo. Attivando questa Virtù, l’Eroe può porre al GM una domanda con risposta sì/no riguardante un PNG. Il GM dovrà rispondere onestamente e, se possibile, aggiungere dettagli. • Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
        "ability": "«“Senti questo odore? Formaldeide e rame. Lei è qui. Stai giù e zitto, controlla dietro gli angoli e le uscite, assicurati di sapere come tornare indietro. Se la vedi non affrontarla. Se lei ti vede fai rumore.”»\n\nVantaggi: Aggressione Sconsiderata, Gioco di Squadra, L’Unione Fa la Forza, Mano Lesta, Sala d’Armi: Sabat\n\nPeculiarità: Orfano. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo. Ussaro Alato. Ottiene un Punto Eroe ogni volta che, con il suo destriero, si lancia a testa bassa in uno scontro senza badare ai rischi.",
        "notes": "«“Senti questo odore? Formaldeide e rame. Lei è qui. Stai giù e zitto, controlla dietro gli angoli e le uscite, assicurati di sapere come tornare indietro. Se la vedi non affrontarla. Se lei ti vede fai rumore.”»\nArchetipo: Eroi Indomiti\n\n📖 Storia:\nFuggito da una famiglia violenta, Ambroży visse in strada finché non entrò in orfanotrofio. Nonostante le privazioni, rimase tenace, intelligente, percettivo e ottimista, destinato a grandi cose. Che fosse riuscito a entrare negli ussari alati non sorprese nessuno, a differenza del suo ritorno sulle strade. Fu l'ussaro di nascita più umile a raggiungere il grado di rotmistrz – comandante di squadrone – e, dopo 13 anni di servizio, era diventato ricco e famoso. Grazie al suo talento per gli affari divenne ancora più ricco speculando sul grano, ma l'alta società lo annoiava. Si sentiva in balia degli eventi: aveva troppo tempo libero e nessun obiettivo. Ambroży cominciò a cavalcare per le strade durante la notte, per mantenere in esercizio l'enorme destriero nero che aveva acquistato dall'esercito al suo congedo. Ben presto, le sue ronde lo portarono a fare amicizia con i senzatetto di V oruta, che sorprese dando loro denaro e consigli sui rifugi più accoglienti o i locali che davano più cibo. Fu il primo non mendicante ad accorgersi che la popo- lazione delle strade stava scomparendo e non a causa di malattie e cattivo tempo. Nessuno dei due poteva far sparire i corpi. Ambroży cominciò a catalogare le scomparse, gli indizi e gli avvistamenti di un rapitore spettrale che soprannominò “Dottoressa Ebano” . I suoi ex-camerati lo bollarono come un visionario … finché Ambroży non incontrò la Dottoressa in batta- glia. Ambroży era abile nel cavalcare, come ogni ussaro, ma quando la inseguì tra i vicoli finì con inciampare in casse e spazzatura, riuscendo a malapena a raggiun- gerla, e a levare sciabola e scudo per proteggersi dalla sua forza soprannaturale. Mentre combattevano, la Dottoressa discorreva, in tono logico e privo di passione, di Theus, della Legione e il peccato, argo - menti che Ambroży, un V aticino liberale, non riuscì a comprendere. Alla fine la donna fuggì, ma Ambroży le aveva impedito di rapire una bambina. Quando i giornali riportarono notizie dell'incidente, il comandante Czyżyk e la Dottoressa Ebano colpi- rono l'immaginazione popolare, diventando rappre- sentanti di ideologie politiche e i personaggi principali di un dramma di strada. Giovani avventurieri, con più coraggio che buon senso, cominciarono a bussare alla porta di Ambroży per aiutarlo. Pur non essendo ussari avevano molto coraggio e Ambroży fondò con loro la Guardia Cittadina. Non è qualcosa che aveva pianifi- cato e, adesso, non sa cosa potrebbe accadere.\n\n🎯 Obiettivi:\nTrovare una casa per l’orfana soccorsa. Il giorno in cui Ambroży incontrò per la prima volta la Dottoressa Ebano salvò Svajonė, un'orfana di 6 anni, che al momento vive con lui. Nonostante apprezzino la reciproca compagnia, Svajonė ha bisogno di una vera casa. Nessuno conosce i suoi genitori e l'orfanotrofio fu distrutto anni fa. Forse è tempo di ricostruirlo. Scegliere un miglior Capitano della Guardia. Ambroży, un eccellente stratega e guerriero, non è altret- tanto bravo a dare ordini e gestire le pubbliche relazioni. Con il costante afflusso di volontari, sa che servirà un rappresentante carismatico per la guardia cittadina. La sua faccia piena di cicatrici, infatti, non è adatta. Scoprire la fonte della forza sovrumana della Dottoressa. Con semplice gesto della mano la Dottoressa spedì Ambroży per terra e con un calcio attraverso una porta. Com'è possibile che una donna tanto piccola sia così forte?\n\n🎭 Consigli di Interpretazione (Giocare Ambroży Czyżyk):\nMinaccioso, affabile, visionario: il comandante Czyżyk è cambiato molto durante la sua guerra personale contro la Dottoressa. Da veterano con molte cicatrici e una teoria folle su una minaccia fantasma, è diventato abile a descri- vere l' assurdo in termini comprensibili ma, nei momenti critici o emotivi, le sue parole diventano drammatiche e infiorettate come quelle di una tragedia Numanari. Il suo rapporto con la Dottoressa si compone di paura, fascino e odio. A volte si rivolge a stanze vuote come se stesse dialogando con lei. Non lo ammetterebbe mai, ma la teologia che sembra guidare le azioni della donna, di cui ha trovato frammenti scribacchiati nei luoghi dei rapimenti, lo spaventa. Nonostante non la giustifichi, Ambroży sente che la donna potrebbe aver ragione e teme che il pensiero della Dottoressa possa essere persino più pericoloso di lei in persona.",
        "pcData": {
            "name": "Ambroży Czyżyk",
            "nation": "Confederazione Sarmatiana",
            "concept": "Eroi Indomiti • Confederazione Sarmatiana",
            "traits": {
                "Vigore": 3,
                "Grazia": 2,
                "Risolutezza": 2,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 1,
                "Atletica": 3,
                "Cavalcare": 2,
                "Convincere": 2,
                "Empatia": 2,
                "Esibirsi": 0,
                "Furto": 0,
                "Intimidire": 1,
                "Istruzione": 2,
                "Mira": 0,
                "Mischia": 2,
                "Nascondersi": 1,
                "Navigazione": 0,
                "Notare": 3,
                "Rissa": 1
            },
            "advantages": [
                "Aggressione Sconsiderata",
                "Gioco di Squadra",
                "L’Unione Fa la Forza",
                "Mano Lesta",
                "Sala d’Armi: Sabat"
            ],
            "virtue": "Virtù: La Strega Intuitivo. Attivando questa Virtù, l’Eroe può porre al GM una domanda con risposta sì/no riguardante un PNG. Il GM dovrà rispondere onestamente e, se possibile, aggiungere dettagli.",
            "hubris": "Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
            "peculiarities": "Orfano. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo. Ussaro Alato. Ottiene un Punto Eroe ogni volta che, con il suo destriero, si lancia a testa bassa in uno scontro senza badare ai rischi.",
            "story": "Fuggito da una famiglia violenta, Ambroży visse in strada finché non entrò in orfanotrofio. Nonostante le privazioni, rimase tenace, intelligente, percettivo e ottimista, destinato a grandi cose. Che fosse riuscito a entrare negli ussari alati non sorprese nessuno, a differenza del suo ritorno sulle strade. Fu l'ussaro di nascita più umile a raggiungere il grado di rotmistrz – comandante di squadrone – e, dopo 13 anni di servizio, era diventato ricco e famoso. Grazie al suo talento per gli affari divenne ancora più ricco speculando sul grano, ma l'alta società lo annoiava. Si sentiva in balia degli eventi: aveva troppo tempo libero e nessun obiettivo. Ambroży cominciò a cavalcare per le strade durante la notte, per mantenere in esercizio l'enorme destriero nero che aveva acquistato dall'esercito al suo congedo. Ben presto, le sue ronde lo portarono a fare amicizia con i senzatetto di V oruta, che sorprese dando loro denaro e consigli sui rifugi più accoglienti o i locali che davano più cibo. Fu il primo non mendicante ad accorgersi che la popo- lazione delle strade stava scomparendo e non a causa di malattie e cattivo tempo. Nessuno dei due poteva far sparire i corpi. Ambroży cominciò a catalogare le scomparse, gli indizi e gli avvistamenti di un rapitore spettrale che soprannominò “Dottoressa Ebano” . I suoi ex-camerati lo bollarono come un visionario … finché Ambroży non incontrò la Dottoressa in batta- glia. Ambroży era abile nel cavalcare, come ogni ussaro, ma quando la inseguì tra i vicoli finì con inciampare in casse e spazzatura, riuscendo a malapena a raggiun- gerla, e a levare sciabola e scudo per proteggersi dalla sua forza soprannaturale. Mentre combattevano, la Dottoressa discorreva, in tono logico e privo di passione, di Theus, della Legione e il peccato, argo - menti che Ambroży, un V aticino liberale, non riuscì a comprendere. Alla fine la donna fuggì, ma Ambroży le aveva impedito di rapire una bambina. Quando i giornali riportarono notizie dell'incidente, il comandante Czyżyk e la Dottoressa Ebano colpi- rono l'immaginazione popolare, diventando rappre- sentanti di ideologie politiche e i personaggi principali di un dramma di strada. Giovani avventurieri, con più coraggio che buon senso, cominciarono a bussare alla porta di Ambroży per aiutarlo. Pur non essendo ussari avevano molto coraggio e Ambroży fondò con loro la Guardia Cittadina. Non è qualcosa che aveva pianifi- cato e, adesso, non sa cosa potrebbe accadere.",
            "objectives": "Trovare una casa per l’orfana soccorsa. Il giorno in cui Ambroży incontrò per la prima volta la Dottoressa Ebano salvò Svajonė, un'orfana di 6 anni, che al momento vive con lui. Nonostante apprezzino la reciproca compagnia, Svajonė ha bisogno di una vera casa. Nessuno conosce i suoi genitori e l'orfanotrofio fu distrutto anni fa. Forse è tempo di ricostruirlo. Scegliere un miglior Capitano della Guardia. Ambroży, un eccellente stratega e guerriero, non è altret- tanto bravo a dare ordini e gestire le pubbliche relazioni. Con il costante afflusso di volontari, sa che servirà un rappresentante carismatico per la guardia cittadina. La sua faccia piena di cicatrici, infatti, non è adatta. Scoprire la fonte della forza sovrumana della Dottoressa. Con semplice gesto della mano la Dottoressa spedì Ambroży per terra e con un calcio attraverso una porta. Com'è possibile che una donna tanto piccola sia così forte?",
            "quote": "“Senti questo odore? Formaldeide e rame. Lei è qui. Stai giù e zitto, controlla dietro gli angoli e le uscite, assicurati di sapere come tornare indietro. Se la vedi non affrontarla. Se lei ti vede fai rumore.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 3, Acume 3, Panache 2 • Virtù: L’Imperatore Maestoso. Attivando questa Virtù, il GM darà un Punto Eroe a tutti gli altri Eroi presenti nella Scena. • Hubris: Le Monete Implacabile. L’Eroe riceve un Punto Eroe quando si mette nei guai rifiutandosi di lasciare in pace qualcuno o di ritirarsi quando è in vantaggio. Esecuzione Perfetta (2 Punti) L’Eroe deve avere la capacità di eseguire Manovre da Duellante. L’Eroe sceglie una Manovra che conosce e potrà spendere un Punto Eroe invece di un Incremento per eseguirla. Tutte le altre regole relative alle Manovre si applicano normalmente (non è possibile eseguire la stessa Manovra per due Azioni consecutive, ecc.). Se l’ef- fetto di una Manovra si basa sul numero di Incrementi spesi (come Affondo), eseguirla con questo Vantaggio conta come se si fossero spesi 0 Incrementi. Un Eroe può usare questo Vantaggio solo una volta per Round.",
        "ability": "«“Sono nata morta e oggi sono pronta a morire di nuovo. E tu? Questa è la tua ultima possibilità di arrenderti.”»\n\nVantaggi: Comando, Esecuzione Perfetta: Stratagemma Aldana (vedi sotto), Gambe da Marinaio, Sala d’Armi: Aldana, Schermidore, Sposata al Mare\n\nPeculiarità: Capitano di Nave. Ottiene un Punto Eroe ogni volta che è l’ultima del suo equipaggio a mettersi in salvo. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
        "notes": "«“Sono nata morta e oggi sono pronta a morire di nuovo. E tu? Questa è la tua ultima possibilità di arrenderti.”»\nArchetipo: Eroi Indomiti\n\n📖 Storia:\nL' intero equipaggio de La Espada de la Muerte è legato al giuramento di non abbandonare la nave prima di morire, una promessa fatta sulla Corona per redimersi dai loro passati crimini, trasgressioni e rimpianti. T utte le anime a bordo sono legate a questo giuramento, eccetto il capitano, Catalina Morta. Figlia di due marinai innamoratisi su questo vascello dei dannati è nata a bordo e non ha mai giurato. Il vecchio capitano si offrì di lasciar sbarcare Catalina quando i suoi genitori morirono, ma lei si rifiutò. La nave era la sua casa e credeva fermamente nella missione di proteggere la flotta mercantile di Castille. Questa lealtà assoluta, unita a un talento per la scherma, la portò a scalare i ranghi fino a diventare capitano. Catalina era desiderosa di nuove esperienze ma, non potendo mai scendere a terra, furono i nuovi arrivati a bordo a insegnarle; apprese persino l'Al - dana da un Duellante che si era imbarcato per aver ucciso ingiustamente. La dedizione di Catalina a Castille è assoluta, pur non avendo mai messo piede sulle sue coste, ma ha difficoltà con i recenti sviluppi. Si domanda se l' interesse della Nazione sia meglio tutelato dal Concilio dei Cardinali o dal giovane Re e a chi debba la sua lealtà. Essere fisi- camente lontana dagli intrighi di Corte le dà un po' di respiro e le permette di concentrarsi sul guidare i mercan- tili attraverso La Boca del Cielo. La politica non è la sua unica preoccupazione. Si considera una V aticina, ma aderisce al credo più gentile dei suoi genitori che al sentiero dogmatico tracciato dal T erzo Profeta. Mentre continua a lottare con la sua coscienza e senso del dovere, Catalina ha preso una piccola decisione politica: La Espada de la Muerte deve dare la priorità alle navi che trasportano cibo e libri invece che armi. È determinata ad aiutare il suo paese, nonostante nessuno sappia di lei. Mentre i Castilliani gioiscono alla vista delle vele nere stracciate de La Espada de la Muerte, gli abitanti delle altre Nazioni fuggono, temendo le orrifiche voci sulla nave. Catalina non si limita a proteggere Castille, ma insegue le navi straniere per depredarle. In particolare attacca i trasporti carichi di schiavi, che libera, convinta che nessuno debba essere costretto a servire contro la propria volontà. Nonostante tutto, Catalina ha compreso che per essere davvero il capitano deve prima vivere, perché solo chi ha vissuto davvero può abbracciare la morte. Di tanto in tanto, abbandona la sua amata nave al comando del primo ufficiale e si avventura sulla terraferma, per otte- nere l'esperienza necessaria per servire Castille.\n\n🎯 Obiettivi:\nLiberare i mari da Estallio, il serpente gigante. Alcuni sostengono che Estallio sia solo un mito, ma costoro non vivono su questa nave di anime perdute. Per Catalina, Estallio non è leggenda ma una minaccia reale per ogni nave Castilliana che attraversi La Boca del Cielo. Perciò insegue ogni ombra nelle profondità marine, sperando che sia Estallio o la sua progenie. Osservare le scogliere di Avalon con i propri occhi. Il cuore di Catalina è preda del desiderio di viaggiare e le scogliere di Avalon sono, per lei, quanto di più lontano vi sia da La Boca del Cielo. Sono il simbolo di questo desiderio. Vedere La Espada de la Muerte nominata ammiraglia della flotta mercantile Castilliana. I cardinali pensano solo al guadagno. Il Buon Re è troppo giovane per prendere decisioni difficili. Nel frattempo la flotta mercantile è la vita di Castille e qualcuno deve mettere i suoi bisogni sopra ogni cosa: Catalina è pronta per questo.\n\n🎭 Consigli di Interpretazione (Giocare Catalina Morta):\nCatalina pone senza discussioni il bene di Castille sopra il proprio. È pronta a combattere mille navi per salvaguardare la Nazione. Ha però difficoltà con gli usi dei “vivi” , della società civile, ma si è imposta di entrare in questo mondo per la maggior gloria della sua patria. Catalina ride poco, ama cantare canzoni marinaresche e raccontare storie turbolente delle sue avventure per allontanare la fredda oscurità che la circonda. È molto orgogliosa delle sue cicatrici, che considera come meda- glie e spesso racconta la storia dietro ciascuna di esse. Prende e scarta amanti con facilità e non conosce la gelosia.",
        "pcData": {
            "name": "Catalina Morta",
            "nation": "Castille",
            "concept": "Eroi Indomiti • Castille",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 2
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 1,
                "Atletica": 2,
                "Cavalcare": 0,
                "Convincere": 1,
                "Empatia": 2,
                "Esibirsi": 1,
                "Furto": 0,
                "Intimidire": 3,
                "Istruzione": 0,
                "Mira": 1,
                "Mischia": 3,
                "Nascondersi": 0,
                "Navigazione": 3,
                "Notare": 2,
                "Rissa": 0
            },
            "advantages": [
                "Comando",
                "Esecuzione Perfetta: Stratagemma Aldana (vedi sotto)",
                "Gambe da Marinaio",
                "Sala d’Armi: Aldana",
                "Schermidore",
                "Sposata al Mare"
            ],
            "virtue": "Virtù: L’Imperatore Maestoso. Attivando questa Virtù, il GM darà un Punto Eroe a tutti gli altri Eroi presenti nella Scena.",
            "hubris": "Hubris: Le Monete Implacabile. L’Eroe riceve un Punto Eroe quando si mette nei guai rifiutandosi di lasciare in pace qualcuno o di ritirarsi quando è in vantaggio. Esecuzione Perfetta (2 Punti) L’Eroe deve avere la capacità di eseguire Manovre da Duellante. L’Eroe sceglie una Manovra che conosce e potrà spendere un Punto Eroe invece di un Incremento per eseguirla. Tutte le altre regole relative alle Manovre si applicano normalmente (non è possibile eseguire la stessa Manovra per due Azioni consecutive, ecc.). Se l’ef- fetto di una Manovra si basa sul numero di Incrementi spesi (come Affondo), eseguirla con questo Vantaggio conta come se si fossero spesi 0 Incrementi. Un Eroe può usare questo Vantaggio solo una volta per Round.",
            "peculiarities": "Capitano di Nave. Ottiene un Punto Eroe ogni volta che è l’ultima del suo equipaggio a mettersi in salvo. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
            "story": "L' intero equipaggio de La Espada de la Muerte è legato al giuramento di non abbandonare la nave prima di morire, una promessa fatta sulla Corona per redimersi dai loro passati crimini, trasgressioni e rimpianti. T utte le anime a bordo sono legate a questo giuramento, eccetto il capitano, Catalina Morta. Figlia di due marinai innamoratisi su questo vascello dei dannati è nata a bordo e non ha mai giurato. Il vecchio capitano si offrì di lasciar sbarcare Catalina quando i suoi genitori morirono, ma lei si rifiutò. La nave era la sua casa e credeva fermamente nella missione di proteggere la flotta mercantile di Castille. Questa lealtà assoluta, unita a un talento per la scherma, la portò a scalare i ranghi fino a diventare capitano. Catalina era desiderosa di nuove esperienze ma, non potendo mai scendere a terra, furono i nuovi arrivati a bordo a insegnarle; apprese persino l'Al - dana da un Duellante che si era imbarcato per aver ucciso ingiustamente. La dedizione di Catalina a Castille è assoluta, pur non avendo mai messo piede sulle sue coste, ma ha difficoltà con i recenti sviluppi. Si domanda se l' interesse della Nazione sia meglio tutelato dal Concilio dei Cardinali o dal giovane Re e a chi debba la sua lealtà. Essere fisi- camente lontana dagli intrighi di Corte le dà un po' di respiro e le permette di concentrarsi sul guidare i mercan- tili attraverso La Boca del Cielo. La politica non è la sua unica preoccupazione. Si considera una V aticina, ma aderisce al credo più gentile dei suoi genitori che al sentiero dogmatico tracciato dal T erzo Profeta. Mentre continua a lottare con la sua coscienza e senso del dovere, Catalina ha preso una piccola decisione politica: La Espada de la Muerte deve dare la priorità alle navi che trasportano cibo e libri invece che armi. È determinata ad aiutare il suo paese, nonostante nessuno sappia di lei. Mentre i Castilliani gioiscono alla vista delle vele nere stracciate de La Espada de la Muerte, gli abitanti delle altre Nazioni fuggono, temendo le orrifiche voci sulla nave. Catalina non si limita a proteggere Castille, ma insegue le navi straniere per depredarle. In particolare attacca i trasporti carichi di schiavi, che libera, convinta che nessuno debba essere costretto a servire contro la propria volontà. Nonostante tutto, Catalina ha compreso che per essere davvero il capitano deve prima vivere, perché solo chi ha vissuto davvero può abbracciare la morte. Di tanto in tanto, abbandona la sua amata nave al comando del primo ufficiale e si avventura sulla terraferma, per otte- nere l'esperienza necessaria per servire Castille.",
            "objectives": "Liberare i mari da Estallio, il serpente gigante. Alcuni sostengono che Estallio sia solo un mito, ma costoro non vivono su questa nave di anime perdute. Per Catalina, Estallio non è leggenda ma una minaccia reale per ogni nave Castilliana che attraversi La Boca del Cielo. Perciò insegue ogni ombra nelle profondità marine, sperando che sia Estallio o la sua progenie. Osservare le scogliere di Avalon con i propri occhi. Il cuore di Catalina è preda del desiderio di viaggiare e le scogliere di Avalon sono, per lei, quanto di più lontano vi sia da La Boca del Cielo. Sono il simbolo di questo desiderio. Vedere La Espada de la Muerte nominata ammiraglia della flotta mercantile Castilliana. I cardinali pensano solo al guadagno. Il Buon Re è troppo giovane per prendere decisioni difficili. Nel frattempo la flotta mercantile è la vita di Castille e qualcuno deve mettere i suoi bisogni sopra ogni cosa: Catalina è pronta per questo.",
            "quote": "“Sono nata morta e oggi sono pronta a morire di nuovo. E tu? Questa è la tua ultima possibilità di arrenderti.”"
        }
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
        "traits": "Vigore 3, Grazia 2, Risolutezza 4, Acume 2, Panache 2 • Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro. • Hubris: Le Monete Implacabile. L’Eroe riceve un Punto Eroe quando si mette nei guai rifiutandosi di lasciare in pace qualcuno o di ritirarsi quando è in vantaggio. Stregoneria Eadric è l’incarnazione di Wilfrith, la Volitiva. Il suo Tratto Maggiore è Risolutezza, il Minore è Vigore. Conosce gli Incanti Maggiori, Leggendario (Grado 1) e Rinato (Grado 2), e gli Incanti Minori Più forte di Te (Grado 3) e Battere gli Sgherri (Grado 3).",
        "ability": "«“Sono giunto per aiutarvi, se me lo permettete. Non sarà facile, ma continuerò a combattere finché me lo consentirete.”»\n\nVantaggi: Aggressione Sconsiderata, Gambe da Marinaio, Rissoso, Senso dell’Orientamento, Stregoneria: Cavaliere di Avalon 3, Vista d’Aquila\n\nPeculiarità: Cavaliere Errante. Ottiene un Punto Eroe ogni volta che sostiene un ideale di virtù cavalleresca e finisce nei guai per questo. Marinaio. Ottiene un Punto Eroe ogni volta che mette da parte i suoi desideri per garantire la sicurezza o la comodità dei suoi compagni.",
        "notes": "«“Sono giunto per aiutarvi, se me lo permettete. Non sarà facile, ma continuerò a combattere finché me lo consentirete.”»\nArchetipo: Eroi Indomiti\n\n📖 Storia:\nLa vita sulle coste di Avalon può essere pericolosa e pochi lo sanno meglio di Eadric Croft: se il maltempo non spazza via un villaggio poco protetto ci pense - ranno i razziatori. Nato nel piccolo villaggio di Coldwater Bay, nella contea di Kilkenny, Eadric aveva solo 12 anni quando una banda di razziatori decimò la comunità. Si svegliò al suono della battaglia mentre suo padre si batteva contro un invasore armato. Il padre fu ucciso ed Eadric venne spinto nel camino, mentre sua madre afferrava la spada del marito per difenderlo. Il ragazzo si riprese mentre la madre morente lo metteva in una barca e lo spingeva al largo nascosto dalla nebbia. Ferito e sanguinante sul fondo della barca, Eadric Croft ebbe la sua prima visione: una figura incatenata alle rocce in una caverna parzialmente sommersa, la cui triste canzone faceva eco sull'acqua. Quando si risvegliò le sue ferite erano guarite. Coldwater Bay non fu altrettanto fortunata: tutti gli abitanti furono uccisi, i loro beni e animali rubati. Passarono gli anni e la gente si dimenticò del massacro. Il Barone Byron Kilkenny ordinò che si ripopolasse il villaggio per assicurarsi un'area di pesca fondamentale per il territorio. Gli abitanti trucidati ricevettero una sepoltura sommaria di fronte al mare. Passarono nove anni prima che i racconti sullo spettro di Inismore cominciassero a circolare per la contea. Le bande di razziatori erano tornate in forze, dopo anni di relativa pace ma, questa volta, qualcuno li stava affrontando. Le storie parlavano di una barca scura che appariva dal nulla nel mezzo delle razzie, fermando i banditi prima che potessero giungere a terra, e di un uomo coperto di cicatrici su collo, volto e braccia che si faceva avanti per difendere la popo - lazione. Una sola anima coraggiosa osò chiedergli il nome, dopo che aveva salvato il villaggio di Dalefell. “Non sono nessuno,” rispose lo straniero, “solo un fantasma.” Così nacque la leggenda. Eadric Croft non è un fantasma. Quel giovane ferito è diventato un uomo duro e pensieroso, spinto da misteriose visioni verso i luoghi dove la gente è in pericolo. Il resto del tempo lo trascorre in barca, navi- gando su e giù lungo la costa alla ricerca della caverna delle sue visioni. Questo viaggiare lo ha condotto a casa, sulle spiagge di Kilkenny, nel villaggio oggi chiamato Redwater Bay. La popolazione è nuovamente minacciata e il Barone non vuole spendere ulteriori risorse per difenderla. Eadric è solitario per natura, ma sa di non essere in grado di combattere le orde di razziatori da solo.\n\n🎯 Obiettivi:\nCrearsi buoni rapporti con la popolazione. Il passato di Eadric e le visioni che lo perseguitano lo hanno spinto verso una vita solitaria. Senza amici né famiglia, corre il rischio di diventare davvero uno spettro o di soccombere alla follia dell' isolamento. Creare dei legami con la popolazione lo aiuterebbe anche a sbarazzarsi delle voci sospettose messe in giro dal Barone Kilkenny. Organizzare gli abitanti contro i razziatori. Nessuno può combattere una guerra da solo e i continui attacchi contro i villaggi costieri sono un problema che Eadric non può risolvere con le sue forze. Deve riunire gli abitanti e insegnare loro a difendere le proprie case, oppure rischia di vanificare la sua opera non appena se ne andrà. Trovare la fonte delle sue visioni nelle Caverne Marine di Kilkenny. Eadric è perseguitato da immagini terrificanti, in cui vede una caverna sottomarina sotto le scogliere di Kilkenny e una figura incatenata alle rocce. Deve scoprire la fonte di tali visioni, ma teme che se lo farà queste svaniranno lasciandolo privo di poteri.\n\n🎭 Consigli di Interpretazione (Giocare Eadric Croft):\nEadric Croft è un nomade, un'anima senza requie spinta a proteggere la popolazione da una mano ignota che gli invia le sue visioni. Preferisce la compa- gnia del mare a quella delle persone ed è poco a suo agio e distratto quando interagisce con il prossimo. Parla poco e preferisce agire. Eadric si trova meglio sulla sua barca che sulla terraferma e non guarda mai i propri interlocutori negli occhi. In combattimento, però, la sua sicurezza ritorna e diventa l'epitome del cavaliere errante: diretto, coraggioso e sincero.",
        "pcData": {
            "name": "Eadric Croft",
            "nation": "Inismore",
            "concept": "Eroi Indomiti • Inismore",
            "traits": {
                "Vigore": 3,
                "Grazia": 2,
                "Risolutezza": 4,
                "Acume": 2,
                "Panache": 2
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 1,
                "Atletica": 3,
                "Cavalcare": 1,
                "Convincere": 0,
                "Empatia": 0,
                "Esibirsi": 0,
                "Furto": 1,
                "Intimidire": 3,
                "Istruzione": 1,
                "Mira": 0,
                "Mischia": 3,
                "Nascondersi": 0,
                "Navigazione": 3,
                "Notare": 2,
                "Rissa": 2
            },
            "advantages": [
                "Aggressione Sconsiderata",
                "Gambe da Marinaio",
                "Rissoso",
                "Senso dell’Orientamento",
                "Stregoneria: Cavaliere di Avalon 3",
                "Vista d’Aquila"
            ],
            "virtue": "Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro.",
            "hubris": "Hubris: Le Monete Implacabile. L’Eroe riceve un Punto Eroe quando si mette nei guai rifiutandosi di lasciare in pace qualcuno o di ritirarsi quando è in vantaggio. Stregoneria Eadric è l’incarnazione di Wilfrith, la Volitiva. Il suo Tratto Maggiore è Risolutezza, il Minore è Vigore. Conosce gli Incanti Maggiori, Leggendario (Grado 1) e Rinato (Grado 2), e gli Incanti Minori Più forte di Te (Grado 3) e Battere gli Sgherri (Grado 3).",
            "peculiarities": "Cavaliere Errante. Ottiene un Punto Eroe ogni volta che sostiene un ideale di virtù cavalleresca e finisce nei guai per questo. Marinaio. Ottiene un Punto Eroe ogni volta che mette da parte i suoi desideri per garantire la sicurezza o la comodità dei suoi compagni.",
            "story": "La vita sulle coste di Avalon può essere pericolosa e pochi lo sanno meglio di Eadric Croft: se il maltempo non spazza via un villaggio poco protetto ci pense - ranno i razziatori. Nato nel piccolo villaggio di Coldwater Bay, nella contea di Kilkenny, Eadric aveva solo 12 anni quando una banda di razziatori decimò la comunità. Si svegliò al suono della battaglia mentre suo padre si batteva contro un invasore armato. Il padre fu ucciso ed Eadric venne spinto nel camino, mentre sua madre afferrava la spada del marito per difenderlo. Il ragazzo si riprese mentre la madre morente lo metteva in una barca e lo spingeva al largo nascosto dalla nebbia. Ferito e sanguinante sul fondo della barca, Eadric Croft ebbe la sua prima visione: una figura incatenata alle rocce in una caverna parzialmente sommersa, la cui triste canzone faceva eco sull'acqua. Quando si risvegliò le sue ferite erano guarite. Coldwater Bay non fu altrettanto fortunata: tutti gli abitanti furono uccisi, i loro beni e animali rubati. Passarono gli anni e la gente si dimenticò del massacro. Il Barone Byron Kilkenny ordinò che si ripopolasse il villaggio per assicurarsi un'area di pesca fondamentale per il territorio. Gli abitanti trucidati ricevettero una sepoltura sommaria di fronte al mare. Passarono nove anni prima che i racconti sullo spettro di Inismore cominciassero a circolare per la contea. Le bande di razziatori erano tornate in forze, dopo anni di relativa pace ma, questa volta, qualcuno li stava affrontando. Le storie parlavano di una barca scura che appariva dal nulla nel mezzo delle razzie, fermando i banditi prima che potessero giungere a terra, e di un uomo coperto di cicatrici su collo, volto e braccia che si faceva avanti per difendere la popo - lazione. Una sola anima coraggiosa osò chiedergli il nome, dopo che aveva salvato il villaggio di Dalefell. “Non sono nessuno,” rispose lo straniero, “solo un fantasma.” Così nacque la leggenda. Eadric Croft non è un fantasma. Quel giovane ferito è diventato un uomo duro e pensieroso, spinto da misteriose visioni verso i luoghi dove la gente è in pericolo. Il resto del tempo lo trascorre in barca, navi- gando su e giù lungo la costa alla ricerca della caverna delle sue visioni. Questo viaggiare lo ha condotto a casa, sulle spiagge di Kilkenny, nel villaggio oggi chiamato Redwater Bay. La popolazione è nuovamente minacciata e il Barone non vuole spendere ulteriori risorse per difenderla. Eadric è solitario per natura, ma sa di non essere in grado di combattere le orde di razziatori da solo.",
            "objectives": "Crearsi buoni rapporti con la popolazione. Il passato di Eadric e le visioni che lo perseguitano lo hanno spinto verso una vita solitaria. Senza amici né famiglia, corre il rischio di diventare davvero uno spettro o di soccombere alla follia dell' isolamento. Creare dei legami con la popolazione lo aiuterebbe anche a sbarazzarsi delle voci sospettose messe in giro dal Barone Kilkenny. Organizzare gli abitanti contro i razziatori. Nessuno può combattere una guerra da solo e i continui attacchi contro i villaggi costieri sono un problema che Eadric non può risolvere con le sue forze. Deve riunire gli abitanti e insegnare loro a difendere le proprie case, oppure rischia di vanificare la sua opera non appena se ne andrà. Trovare la fonte delle sue visioni nelle Caverne Marine di Kilkenny. Eadric è perseguitato da immagini terrificanti, in cui vede una caverna sottomarina sotto le scogliere di Kilkenny e una figura incatenata alle rocce. Deve scoprire la fonte di tali visioni, ma teme che se lo farà queste svaniranno lasciandolo privo di poteri.",
            "quote": "“Sono giunto per aiutarvi, se me lo permettete. Non sarà facile, ma continuerò a combattere finché me lo consentirete.”"
        }
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
        "traits": "Vigore 3, Grazia 3, Risolutezza 2, Acume 2, Panache 3 •  • Hubris: Le Monete Adattabile. Attivando questa Virtù, l’Eroe può eseguire la sua prima Azione anticipando chiunque altro nel corso di un Round. Hubris: L’Eroe Avventato. L’Eroe riceve un Punto Eroe quando la sua eccessiva sicurezza nell’agire mette nei guai lui e un altro.",
        "ability": "«“Dritto di corsa fino al margine del tetto, poi un salto sull’asta della bandiera, un calcio in avanti… quindi, se scalo l’abbaino sopra il pub, posso raggiungere quella fune tra il tetto e l’albero della nave arenata. A quel punto dovrò solo lanciarmi sul sartiame, quella è la parte facile. Meglio che nessuno di voi mi dica le probabilità.”»\n\nVantaggi: Comando, Equilibrio Perfetto, La Fortuna del Diavolo, Rissoso, Schermidore, Vista d’Aquila",
        "notes": "«“Dritto di corsa fino al margine del tetto, poi un salto sull’asta della bandiera, un calcio in avanti… quindi, se scalo l’abbaino sopra il pub, posso raggiungere quella fune tra il tetto e l’albero della nave arenata. A quel punto dovrò solo lanciarmi sul sartiame, quella è la parte facile. Meglio che nessuno di voi mi dica le probabilità.”»\nArchetipo: Eroi Indomiti\n\n📖 Storia:\nIl giovane Isaac Paige si unì ai Cani di Mare invece che alla Fratellanza della Costa perché i Cani non avevano alcuna regola contro il gioco d'azzardo. Chi non lo conosce bene lo definirebbe un drogato del gioco, ma questo non è del tutto esatto. Isaac ama giocare, la sensazione dei dadi tra le mani, la soddisfa- zione di un mazzo ben mescolato, la matematica delle probabilità, la sfida del tenere il conto delle carte, la gioia di apprendere giochi nuovi da terre lontane e il cameratismo del giocare con gli amici. Isaac era un combattente formidabile, un buon marinaio e un abile capitano, che catturò molti trofei per Avalon e ne ricavò una piccola fortuna. Nei suoi piani voleva ritirarsi presto, sposare il suo compagno Y ves, tenersi la sua fregata, la Lady Luck, e navigare di porto in porto come un semplice mercante e viaggiatore. Isaac sapeva che la rigida madre di Y ves non gli avrebbe neppure rivolto la parola senza una cerimonia costosa, con il cibo migliore, la musica più bella e un numero di invitati pari a un piccolo stato. Perciò, per la prima volta in vita sua, giocò per soldi invece che per diletto. Isaac sovrastimò le sue abilità, come spesso gli accade, e perse la seconda cosa per lui più preziosa, la sua nave. Era convinto di poter battere facilmente ai dadi il capitano pirata Cormick McCormick, ma la pura sfortuna lo fece indebitare al punto che questi si prese la Lady Luck come extra. Oggi, Isaac è un personaggio caratteristico dei tetti di W andesborrow. Non ha più una nave, né equipaggio e, di certo, nessun fidanzamento finché la fortuna non cambierà. I giovani corridori – corrieri, ladri e fuggitivi, che balzano di tetto in tetto, fanno acrobazie sulle aste di bandiera e scivolano giù per le grondaie – sono stupiti dalle apparizioni di questo pirata di mezz'età, armato di spada e pistola, che li segue studiando i loro trucchi. Ridono quando cade (e spesso anche quando non cade), ma Isaac è un uomo con una missione: quando sarà il momento di riprendersi la Lady Luck sarà al massimo delle forze e, fisicamente, più pronto di quanto sia mai stato, persino da giovane.\n\n🎯 Obiettivi:\nRiunire un equipaggio di corsari. Per quanto brutto sia stato perdere la Lady Luck , dirlo all'equipaggio è stato anche peggio. Ogni Cane di Mare, ogni marinaio in realtà, conosce la triste vicenda di Isaac e molti lo ritengono responsabile. Per riunire un nuovo equipaggio Isaac dovrà dimostrarsi ancora una volta un capo, un guerriero e un marinaio. Riprendersi la Lady Luck mentre è alla fonda. Il capitano McCormick è un famigerato pirata e un abile comandante, la Lady Luck è veloce e ben armata e ad Isaac non piace l'idea di riprendersela in mare. Infiltrarsi a bordo mentre si trova alla fonda, con Mc Cormick e il grosso dell'equipaggio impegnati a ubria- carsi, potrebbe essere un'occasione migliore. Chiedere a Yves di sposarlo, con la Lady Luck come dote. Isaac vuole chiedere al suo compagno da ormai quattro anni di sposarlo e la Lady Luck sarebbe il regalo perfetto. Y ves era furioso e ha cominciato a perdonare Isaac solo di recente, ma Isaac sa di dover dimostrare alla famiglia di Y ves di essere affidabile.\n\n🎭 Consigli di Interpretazione (Giocare Isaac Paige):\nIsaac tende a vestirsi in modo fin troppo formale in ogni occasione e la sua espressione più comune è un sorriso affascinante, ma nervoso. È schivo e ha l'abi - tudine di elargire complimenti anche a coloro che ha appena conosciuto. Appare tanto gentile e fiducioso che la sua ferocia e l'acume tattico in battaglia risul - tano sorprendenti, anche se considera combattere solo parte di un lavoro, non qualcosa che ama. Sa di avere fatto molti errori, ma è pronto a dedicarsi anima a corpo per dimostrare di essere cambiato. L'unica cosa a cui non sa resistere è una scommessa: il gioco d'azzardo è la sua debolezza e, nonostante lo voglia disperatamente, gli risulta difficile superarla.",
        "pcData": {
            "name": "Isaac Paige",
            "nation": "Avalon",
            "concept": "Eroi Indomiti • Avalon",
            "traits": {
                "Vigore": 3,
                "Grazia": 3,
                "Risolutezza": 2,
                "Acume": 2,
                "Panache": 3
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 1,
                "Atletica": 2,
                "Cavalcare": 0,
                "Convincere": 1,
                "Empatia": 1,
                "Esibirsi": 0,
                "Furto": 2,
                "Intimidire": 0,
                "Istruzione": 0,
                "Mira": 2,
                "Mischia": 3,
                "Nascondersi": 0,
                "Navigazione": 3,
                "Notare": 2,
                "Rissa": 1
            },
            "advantages": [
                "Comando",
                "Equilibrio Perfetto",
                "La Fortuna del Diavolo",
                "Rissoso",
                "Schermidore",
                "Vista d’Aquila"
            ],
            "virtue": "",
            "hubris": "Hubris: Le Monete Adattabile. Attivando questa Virtù, l’Eroe può eseguire la sua prima Azione anticipando chiunque altro nel corso di un Round. Hubris: L’Eroe Avventato. L’Eroe riceve un Punto Eroe quando la sua eccessiva sicurezza nell’agire mette nei guai lui e un altro.",
            "peculiarities": "",
            "story": "Il giovane Isaac Paige si unì ai Cani di Mare invece che alla Fratellanza della Costa perché i Cani non avevano alcuna regola contro il gioco d'azzardo. Chi non lo conosce bene lo definirebbe un drogato del gioco, ma questo non è del tutto esatto. Isaac ama giocare, la sensazione dei dadi tra le mani, la soddisfa- zione di un mazzo ben mescolato, la matematica delle probabilità, la sfida del tenere il conto delle carte, la gioia di apprendere giochi nuovi da terre lontane e il cameratismo del giocare con gli amici. Isaac era un combattente formidabile, un buon marinaio e un abile capitano, che catturò molti trofei per Avalon e ne ricavò una piccola fortuna. Nei suoi piani voleva ritirarsi presto, sposare il suo compagno Y ves, tenersi la sua fregata, la Lady Luck, e navigare di porto in porto come un semplice mercante e viaggiatore. Isaac sapeva che la rigida madre di Y ves non gli avrebbe neppure rivolto la parola senza una cerimonia costosa, con il cibo migliore, la musica più bella e un numero di invitati pari a un piccolo stato. Perciò, per la prima volta in vita sua, giocò per soldi invece che per diletto. Isaac sovrastimò le sue abilità, come spesso gli accade, e perse la seconda cosa per lui più preziosa, la sua nave. Era convinto di poter battere facilmente ai dadi il capitano pirata Cormick McCormick, ma la pura sfortuna lo fece indebitare al punto che questi si prese la Lady Luck come extra. Oggi, Isaac è un personaggio caratteristico dei tetti di W andesborrow. Non ha più una nave, né equipaggio e, di certo, nessun fidanzamento finché la fortuna non cambierà. I giovani corridori – corrieri, ladri e fuggitivi, che balzano di tetto in tetto, fanno acrobazie sulle aste di bandiera e scivolano giù per le grondaie – sono stupiti dalle apparizioni di questo pirata di mezz'età, armato di spada e pistola, che li segue studiando i loro trucchi. Ridono quando cade (e spesso anche quando non cade), ma Isaac è un uomo con una missione: quando sarà il momento di riprendersi la Lady Luck sarà al massimo delle forze e, fisicamente, più pronto di quanto sia mai stato, persino da giovane.",
            "objectives": "Riunire un equipaggio di corsari. Per quanto brutto sia stato perdere la Lady Luck , dirlo all'equipaggio è stato anche peggio. Ogni Cane di Mare, ogni marinaio in realtà, conosce la triste vicenda di Isaac e molti lo ritengono responsabile. Per riunire un nuovo equipaggio Isaac dovrà dimostrarsi ancora una volta un capo, un guerriero e un marinaio. Riprendersi la Lady Luck mentre è alla fonda. Il capitano McCormick è un famigerato pirata e un abile comandante, la Lady Luck è veloce e ben armata e ad Isaac non piace l'idea di riprendersela in mare. Infiltrarsi a bordo mentre si trova alla fonda, con Mc Cormick e il grosso dell'equipaggio impegnati a ubria- carsi, potrebbe essere un'occasione migliore. Chiedere a Yves di sposarlo, con la Lady Luck come dote. Isaac vuole chiedere al suo compagno da ormai quattro anni di sposarlo e la Lady Luck sarebbe il regalo perfetto. Y ves era furioso e ha cominciato a perdonare Isaac solo di recente, ma Isaac sa di dover dimostrare alla famiglia di Y ves di essere affidabile.",
            "quote": "“Dritto di corsa fino al margine del tetto, poi un salto sull’asta della bandiera, un calcio in avanti… quindi, se scalo l’abbaino sopra il pub, posso raggiungere quella fune tra il tetto e l’albero della nave arenata. A quel punto dovrò solo lanciarmi sul sartiame, quella è la parte facile. Meglio che nessuno di voi mi dica le probabilità.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 4, Acume 2, Panache 2 • Virtù: I Troni Confortante. Attivando questa Virtù, l’Eroe cancella gli effetti della Paura su se stesso e i suoi amici. • Hubris: La Notte Senza Luna Confusa. L’Eroe riceve un Punto Eroe quando non riesce a capire o a cogliere un elemento importante della vicenda e ciò mette in pericolo lei o altri.",
        "ability": "«“Un cavaliere può apparire sotto molti aspetti, ma un cuore puro ci unisce tutti.”»\n\nVantaggi: Gioco di Squadra, Linguista, Sala d’Armi: Donovan, Schermidore, Sorriso Disarmante, Spirito Valoroso\n\nPeculiarità: Diestro. Ottiene un Punto Eroe ogni volta che sconfigge un duellante addestrato. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
        "notes": "«“Un cavaliere può apparire sotto molti aspetti, ma un cuore puro ci unisce tutti.”»\nArchetipo: Eroi Indomiti\n\n📖 Storia:\nIsabeau Durpan non era mai stata come gli altri bambini. Figlia di Cordelia e Arnau Durpan, Isabeau crebbe come una piccola selvaggia ispirata dai racconti su Bastion, il più grande guerriero nella storia di Théah. Credeva che il mondo fosse un posto bellis - simo e perfetto grazie al suo eroe buono e generoso. Quando il padre le disse che la diseguaglianza esisteva ancora, Isabeau giurò di dedicare la propria vita ad essere un guerriero del bene, come il suo eroe. Isabeau concentrò tutti i suoi sforzi per diventare come Bastion: ricevette lezioni di spada, tiro con l'arco e caccia; divenne un'eccellente cavallerizza e imparò tre lingue. Crebbe sempre più orgogliosa delle sue qualità marziali, finché la madre non le ricordò che un guerriero combatte l'ineguaglianza anche mediante la carità. Isabeau si accorse che poteva servire meglio diventando un cavaliere di pace. A 13 anni, lasciò la casa e si presentò al coman - dante militare presso la Corte dell' Empereur. In un primo momento, Sir Callen Alberte schernì l'idea di avere questa giovane dama come scudiero, ma la dedizione di Isabeau lo intrigò. Il vecchio cavaliere la prese sotto la sua ala e la addestrò al codice della cavalleria e, soprattutto, le mostrò quali fossero i veri bisogni del popolo di Montaigne. Per la prima volta, la giovane nobildonna vide come i popolani vivessero e soffrissero sotto il giogo di aristocratici corrotti. Si mise subito all'opera per aiutare ovunque potesse e la sua passione indusse Sir Callen ad accettarla come suo scudiero personale. Si addestrarono insieme per oltre cinque anni. La più grande sfida per Isabeau fu durante l'in - vasione di Castille. In una battaglia al fianco di Sir Callen, fu testimone dei veri orrori della guerra e la sua fede ne fu scossa. Fu il figlio di Sir Callen, Pierre, anch'egli cavaliere ad aiutarla. I due si innamorarono e Isabeau credeva si sarebbero sposati alla fine della guerra, ma Pierre venne ferito a morte pochi giorni prima dell'armistizio. Il dolore per la morte del figlio quasi distrusse Sir Callen, che ritornò a corte ridotto a un guscio vuoto. Isabeau, invece, venne fatta cavaliere per il suo coraggio, sebbene la cerimonia fosse velata di tristezza per la sua perdita. Di fronte all' Empereur giurò di perseverare, non solo in nome del suo eroe Bastion, ma anche di Pierre, di Sir Callen e di tutti coloro che avevano bisogno di un difensore in tempi travagliati. Oggi Isabeau è un Cavaliere della Rosa e della Croce assegnata alla corte dell' Empereur, ma cavalca ovunque ci sia bisogno di lei.\n\n🎯 Obiettivi:\nCondurre Sir Callen in una missione per restituirgli la fiducia. La Morte di Pierre colpì pesantemente Sir Callen. Isabeau ha sentito parlare di alcuni mercanti Montaigne catturati nei pressi di un passo montano, sembra dai coboldi. Questa missione potrebbe essere ciò che serve per ricordare a Sir Callen i suoi voti. Svelare i piani contro i Cavalieri della Rosa e della Croce. Negli ultimi mesi, qualcuno ha sfruttato la sua influenza a corte per mettere i Cavalieri l'uno contro l'altro. Stanno prendendo piede i primi rancori e gli scontri sono iniziati. Isabeau vuole trovare il cuore di questa macchinazione e portarlo alla luce. Essere nominata “Erede di Bastion” dalla Corte. L' Empereur ha creato un nuovo titolo, Erede di Bastion, e tutti gli eroi presenti a Corte possono tentare di impressionarlo per ottenerlo. Isabeau mira a trovare una sfida degna di questo titolo per dimo - strare di essere l'unica vera erede.\n\n🎭 Consigli di Interpretazione (Giocare Isabeau Durpan):\nIsabeau è una donna intelligente e di sangue nobile, che ha scelto di lasciare la vita comoda per i rigori della battaglia e della spada. Il suo sorriso gentile rivela una saggezza superiore ai suoi anni. Si comporta sempre con nobiltà e dignità, parla gentilmente e spesso cita testi religiosi. Preferirebbe una vita semplice e dare ciò che possiede a chi ne ha più bisogno. Isabeau ha un delicato senso dell'umorismo e le sue autocritiche lasciano spiazzati anche i più velenosi oppositori.",
        "pcData": {
            "name": "Isabeau Durpan",
            "nation": "Montaigne",
            "concept": "Eroi Indomiti • Montaigne",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 4,
                "Acume": 2,
                "Panache": 2
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 1,
                "Atletica": 2,
                "Cavalcare": 0,
                "Convincere": 2,
                "Empatia": 3,
                "Esibirsi": 1,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 2,
                "Mira": 2,
                "Mischia": 3,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 0
            },
            "advantages": [
                "Gioco di Squadra",
                "Linguista",
                "Sala d’Armi: Donovan",
                "Schermidore",
                "Sorriso Disarmante",
                "Spirito Valoroso"
            ],
            "virtue": "Virtù: I Troni Confortante. Attivando questa Virtù, l’Eroe cancella gli effetti della Paura su se stesso e i suoi amici.",
            "hubris": "Hubris: La Notte Senza Luna Confusa. L’Eroe riceve un Punto Eroe quando non riesce a capire o a cogliere un elemento importante della vicenda e ciò mette in pericolo lei o altri.",
            "peculiarities": "Diestro. Ottiene un Punto Eroe ogni volta che sconfigge un duellante addestrato. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
            "story": "Isabeau Durpan non era mai stata come gli altri bambini. Figlia di Cordelia e Arnau Durpan, Isabeau crebbe come una piccola selvaggia ispirata dai racconti su Bastion, il più grande guerriero nella storia di Théah. Credeva che il mondo fosse un posto bellis - simo e perfetto grazie al suo eroe buono e generoso. Quando il padre le disse che la diseguaglianza esisteva ancora, Isabeau giurò di dedicare la propria vita ad essere un guerriero del bene, come il suo eroe. Isabeau concentrò tutti i suoi sforzi per diventare come Bastion: ricevette lezioni di spada, tiro con l'arco e caccia; divenne un'eccellente cavallerizza e imparò tre lingue. Crebbe sempre più orgogliosa delle sue qualità marziali, finché la madre non le ricordò che un guerriero combatte l'ineguaglianza anche mediante la carità. Isabeau si accorse che poteva servire meglio diventando un cavaliere di pace. A 13 anni, lasciò la casa e si presentò al coman - dante militare presso la Corte dell' Empereur. In un primo momento, Sir Callen Alberte schernì l'idea di avere questa giovane dama come scudiero, ma la dedizione di Isabeau lo intrigò. Il vecchio cavaliere la prese sotto la sua ala e la addestrò al codice della cavalleria e, soprattutto, le mostrò quali fossero i veri bisogni del popolo di Montaigne. Per la prima volta, la giovane nobildonna vide come i popolani vivessero e soffrissero sotto il giogo di aristocratici corrotti. Si mise subito all'opera per aiutare ovunque potesse e la sua passione indusse Sir Callen ad accettarla come suo scudiero personale. Si addestrarono insieme per oltre cinque anni. La più grande sfida per Isabeau fu durante l'in - vasione di Castille. In una battaglia al fianco di Sir Callen, fu testimone dei veri orrori della guerra e la sua fede ne fu scossa. Fu il figlio di Sir Callen, Pierre, anch'egli cavaliere ad aiutarla. I due si innamorarono e Isabeau credeva si sarebbero sposati alla fine della guerra, ma Pierre venne ferito a morte pochi giorni prima dell'armistizio. Il dolore per la morte del figlio quasi distrusse Sir Callen, che ritornò a corte ridotto a un guscio vuoto. Isabeau, invece, venne fatta cavaliere per il suo coraggio, sebbene la cerimonia fosse velata di tristezza per la sua perdita. Di fronte all' Empereur giurò di perseverare, non solo in nome del suo eroe Bastion, ma anche di Pierre, di Sir Callen e di tutti coloro che avevano bisogno di un difensore in tempi travagliati. Oggi Isabeau è un Cavaliere della Rosa e della Croce assegnata alla corte dell' Empereur, ma cavalca ovunque ci sia bisogno di lei.",
            "objectives": "Condurre Sir Callen in una missione per restituirgli la fiducia. La Morte di Pierre colpì pesantemente Sir Callen. Isabeau ha sentito parlare di alcuni mercanti Montaigne catturati nei pressi di un passo montano, sembra dai coboldi. Questa missione potrebbe essere ciò che serve per ricordare a Sir Callen i suoi voti. Svelare i piani contro i Cavalieri della Rosa e della Croce. Negli ultimi mesi, qualcuno ha sfruttato la sua influenza a corte per mettere i Cavalieri l'uno contro l'altro. Stanno prendendo piede i primi rancori e gli scontri sono iniziati. Isabeau vuole trovare il cuore di questa macchinazione e portarlo alla luce. Essere nominata “Erede di Bastion” dalla Corte. L' Empereur ha creato un nuovo titolo, Erede di Bastion, e tutti gli eroi presenti a Corte possono tentare di impressionarlo per ottenerlo. Isabeau mira a trovare una sfida degna di questo titolo per dimo - strare di essere l'unica vera erede.",
            "quote": "“Un cavaliere può apparire sotto molti aspetti, ma un cuore puro ci unisce tutti.”"
        }
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
        "traits": "Vigore 3, Grazia 4, Risolutezza 2, Acume 2, Panache 2 • Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro. • Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito. Duellante Esperto (3 Punti) L’Eroe deve avere il Vantaggio Sala d’Armi. L’Eroe apprende un secondo Stile di Duello. Se acquisisce questo vantaggio di nuovo otterrà uno Stile di Duello aggiuntivo.",
        "ability": "«“Combatti per orgoglio o per onore? Io ho tre figlie che hanno bisogno di me e questa è tutta la motivazione che mi serve.”»\n\nVantaggi: Duellante Esperto: Aldana (vedi sotto), Duro da Uccidere, Fama: Eroico, Immunità ai Veleni, Sala d’Armi: Ambrogia\n\nPeculiarità: Bravo. Ottiene un Punto Eroe ogni volta che corre un rischio per proteggere la vita della persona che ha giurato di difendere. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
        "notes": "«“Combatti per orgoglio o per onore? Io ho tre figlie che hanno bisogno di me e questa è tutta la motivazione che mi serve.”»\nArchetipo: Eroi Indomiti\n\n📖 Storia:\nLorenzo Caravello era destinato a grandi cose. Abile spadaccino e quasi ineguagliabile come duellante, lasciò la sua casa giovanissimo per farsi un nome come grande maestro di spada di V odacce. Tra la nobiltà, si guadagnò la reputazione di personaggio eroico e sposò Antonia, la bella figlia di un mercante. La coppia andò a vivere in una villa tra le vigne ed ebbe due figlie, Luisa e Stella, che divennero le pupille del padre. T uttavia, Lorenzo viaggiava spesso per conto della Gilda dei Duellanti, tanto era preso dalla vita di spadaccino avventuroso, e passava molto poco tempo con la moglie e le figlie. Credeva che avrebbe rime - diato quando le sue avventure fossero finite. Ma la tragedia colpì senza preavviso. Un messaggio urgente lo fece rientrare di volata a casa, appena in tempo per stringere un'ultima volta la mano di Antonia mentre lei moriva dando alla luce la loro terza figlia. Per fortuna i medici riuscirono a salvare la piccola e Lorenzo, in lacrime, le diede il benve - nuto al mondo. Sebbene fosse quasi inconsolabile, si rese conto di quanto tempo prezioso aveva sprecato lontano dalla famiglia e giurò di non perdersi mai più un momento importante nella vita delle sue bambine. Si ritirò dalla vita avventurosa e divenne un padre premuroso, specie verso la piccola Marianna. Mentre le sorelle maggiori diventavano giovani intelligenti e piene di entusiasmo, Marianna cresceva triste e scon- solata. Si incolpava della morte della madre e rifiu - tava ogni contatto con il mondo. Per questo motivo, a Lorenzo occorse del tempo per accorgersi che Marianna possedeva capacità magiche come le sorelle. Nello stesso periodo i suoi compaesani lo avvicina- rono e gli esposero un nuovo problema: in tutta la regione qualcuno stava rapendo giovani donne, di età simile alle sue figlie. Nonostante sapesse che la sua famiglia aveva bisogno di lui, Lorenzo, rendendosi conto che pochi altri avrebbero difeso queste giovani, impugnò nuovamente la spada. Adesso il vecchio spadaccino divide il proprio tempo tra badare a Marianna e trovare i colpevoli, senza sapere che questi hanno preso di mira proprio la sua famiglia.\n\n🎯 Obiettivi:\nProteggere Marianna dagli abitanti sospettosi. La magia viene vista con sospetto e odio dalla gente di V odacce e i recenti poteri di Marianna hanno cominciato ad attirare l'attenzione. Lorenzo deve proteggere la sua bambina e aiutarla a tenere la magia sotto controllo. La piccola è soggetta a momenti di tristezza o rabbia, che possono scatenare i suoi poteri rendendogli la vita difficile. Trovare un insegnante di magia per le sue bambine. A causa dell'odio diffuso verso la magia, a V odacce ci sono pochi che fanno uso dei propri poteri in pubblico. Lorenzo deve trovare un insegnante che aiuti Marianna a controllare i propri poteri e le sue sorelle ad affinare i loro, così che possano difendersi. Per le sue bambine, non risparmierà nulla. Scovare il misterioso rapitore di fanciulle della regione. I compaesani di Lorenzo gli hanno chiesto aiuto per ritrovare numerose giovani donne rapite nei villaggi della zona. Lorenzo si è messo all'opera per scoprire cosa lega queste fanciulle. Per il momento l' unico indizio è la chiesa locale e un evento di beneficienza promosso da padre Antonio Guellemaine a cui tutte parteciparono.\n\n🎭 Consigli di Interpretazione (Giocare Lorenzo Caravello):\nLorenzo è un affascinante V odacce che ha appena passato i suoi anni migliori. È in forma, nonostante un poco di pancetta, e si presenta sempre con il sorriso orgoglioso, ma stanco, di un uomo con tre figlie turbo- lente. È devoto e prega spesso, ma crede tanto nelle azioni decisive quanto nelle parole gentili. Nonostante sappia essere duro sulle questioni professionali, questa fermezza crolla di fronte alle figlie. Con loro è solo un padre orgoglioso, pieno di affetto e attenzioni. Non è insolito vedere Lorenzo camminare per il paese per recarsi a una lezione di scherma con le figlie al seguito, immagine vivente dell'orgoglio paterno.",
        "pcData": {
            "name": "Lorenzo Caravello",
            "nation": "Vodacce",
            "concept": "Eroi Indomiti • Vodacce",
            "traits": {
                "Vigore": 3,
                "Grazia": 4,
                "Risolutezza": 2,
                "Acume": 2,
                "Panache": 2
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 2,
                "Convincere": 2,
                "Empatia": 2,
                "Esibirsi": 1,
                "Furto": 0,
                "Intimidire": 3,
                "Istruzione": 0,
                "Mira": 0,
                "Mischia": 3,
                "Nascondersi": 2,
                "Navigazione": 0,
                "Notare": 1,
                "Rissa": 0
            },
            "advantages": [
                "Duellante Esperto: Aldana (vedi sotto)",
                "Duro da Uccidere",
                "Fama: Eroico",
                "Immunità ai Veleni",
                "Sala d’Armi: Ambrogia"
            ],
            "virtue": "Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro.",
            "hubris": "Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito. Duellante Esperto (3 Punti) L’Eroe deve avere il Vantaggio Sala d’Armi. L’Eroe apprende un secondo Stile di Duello. Se acquisisce questo vantaggio di nuovo otterrà uno Stile di Duello aggiuntivo.",
            "peculiarities": "Bravo. Ottiene un Punto Eroe ogni volta che corre un rischio per proteggere la vita della persona che ha giurato di difendere. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
            "story": "Lorenzo Caravello era destinato a grandi cose. Abile spadaccino e quasi ineguagliabile come duellante, lasciò la sua casa giovanissimo per farsi un nome come grande maestro di spada di V odacce. Tra la nobiltà, si guadagnò la reputazione di personaggio eroico e sposò Antonia, la bella figlia di un mercante. La coppia andò a vivere in una villa tra le vigne ed ebbe due figlie, Luisa e Stella, che divennero le pupille del padre. T uttavia, Lorenzo viaggiava spesso per conto della Gilda dei Duellanti, tanto era preso dalla vita di spadaccino avventuroso, e passava molto poco tempo con la moglie e le figlie. Credeva che avrebbe rime - diato quando le sue avventure fossero finite. Ma la tragedia colpì senza preavviso. Un messaggio urgente lo fece rientrare di volata a casa, appena in tempo per stringere un'ultima volta la mano di Antonia mentre lei moriva dando alla luce la loro terza figlia. Per fortuna i medici riuscirono a salvare la piccola e Lorenzo, in lacrime, le diede il benve - nuto al mondo. Sebbene fosse quasi inconsolabile, si rese conto di quanto tempo prezioso aveva sprecato lontano dalla famiglia e giurò di non perdersi mai più un momento importante nella vita delle sue bambine. Si ritirò dalla vita avventurosa e divenne un padre premuroso, specie verso la piccola Marianna. Mentre le sorelle maggiori diventavano giovani intelligenti e piene di entusiasmo, Marianna cresceva triste e scon- solata. Si incolpava della morte della madre e rifiu - tava ogni contatto con il mondo. Per questo motivo, a Lorenzo occorse del tempo per accorgersi che Marianna possedeva capacità magiche come le sorelle. Nello stesso periodo i suoi compaesani lo avvicina- rono e gli esposero un nuovo problema: in tutta la regione qualcuno stava rapendo giovani donne, di età simile alle sue figlie. Nonostante sapesse che la sua famiglia aveva bisogno di lui, Lorenzo, rendendosi conto che pochi altri avrebbero difeso queste giovani, impugnò nuovamente la spada. Adesso il vecchio spadaccino divide il proprio tempo tra badare a Marianna e trovare i colpevoli, senza sapere che questi hanno preso di mira proprio la sua famiglia.",
            "objectives": "Proteggere Marianna dagli abitanti sospettosi. La magia viene vista con sospetto e odio dalla gente di V odacce e i recenti poteri di Marianna hanno cominciato ad attirare l'attenzione. Lorenzo deve proteggere la sua bambina e aiutarla a tenere la magia sotto controllo. La piccola è soggetta a momenti di tristezza o rabbia, che possono scatenare i suoi poteri rendendogli la vita difficile. Trovare un insegnante di magia per le sue bambine. A causa dell'odio diffuso verso la magia, a V odacce ci sono pochi che fanno uso dei propri poteri in pubblico. Lorenzo deve trovare un insegnante che aiuti Marianna a controllare i propri poteri e le sue sorelle ad affinare i loro, così che possano difendersi. Per le sue bambine, non risparmierà nulla. Scovare il misterioso rapitore di fanciulle della regione. I compaesani di Lorenzo gli hanno chiesto aiuto per ritrovare numerose giovani donne rapite nei villaggi della zona. Lorenzo si è messo all'opera per scoprire cosa lega queste fanciulle. Per il momento l' unico indizio è la chiesa locale e un evento di beneficienza promosso da padre Antonio Guellemaine a cui tutte parteciparono.",
            "quote": "“Combatti per orgoglio o per onore? Io ho tre figlie che hanno bisogno di me e questa è tutta la motivazione che mi serve.”"
        }
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
        "traits": "Vigore 3, Grazia 2, Risolutezza 4, Acume 2, Panache 2 • Virtù: Il Ritrovo Esemplare. Quando attiva questa Virtù, l’Eroe deve indicare un altro Eroe presente nella Scena. I due sommano i propri Incrementi per il Round e tutte le spese sono effettuate attingendo da questa riserva condivisa. • Hubris: Il Diavolo Fiducioso. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato. Stregoneria Marrok ha i Doni Comando, Purificare, Rigenerazione e Vista. Le sue Restrizioni sono Clemenza e Onestà.",
        "ability": "«“A volte il lupo deve proteggere la pecora.”»\n\nVantaggi: Cecchino, Equilibrio Perfetto, Esperto di Sopravvivenza, Fatto!, Pugilatore, Stregoneria: Tocco della Madre 2\n\nPeculiarità: Cacciatore. Ottiene un Punto Eroe ogni volta che il suo istinto di cacciatore salva qualcuno da un pericolo. Toccato da Matushka. Ottiene un Punto Eroe ogni volta che dà un lezione a qualcuno in un modo che renderebbe Matushka orgogliosa.",
        "notes": "«“A volte il lupo deve proteggere la pecora.”»\nArchetipo: Eroi Indomiti\n\n📖 Storia:\nLa vicenda dell'uomo che sarebbe diventato Marrok comincia con una relazione illecita nel cuore di Ussura. Una semplice contadina, chiamata Irina, viveva nel villaggio di V eche e sposò Boris Ivanovich, un ricco possidente che pareva destinato a farsi strada nel mondo. Il loro matrimonio, ben presto, si guastò e Irina si innamorò di un rampollo della famiglia Novgorov che era in viaggio per la provincia. Quando scoprì di essere incinta, scrisse al suo amante, ma il marito intercettò la lettera, rinchiuse Irina fino al giorno del parto, poi prese il neonato e lo abbandonò nei boschi a morire di freddo nella notte invernale. Forse fu grazie al sangue dei Novgorov, forse perché Ussura si prende cura dei suoi figli, fatto sta che il bambino non morì, ma venne salvato e cresciuto dai lupi. Gli abitanti cominciarono a narrare di un branco di enormi lupi che viaggiavano con un bambino, forte abbastanza da misurarsi con le più feroci tra quelle belve. Chi lo aveva avvistato, lo descriveva come un bel giovane, tragicamente sporco, con occhi verdi e capelli neri arruffati. Per Marrok, la vita era pericolosa, eccitante e asso- lutamente innocente. Le cose cambiarono quando compì 23 anni. Alcuni cacciatori di V eche si convin- sero che quei lupi fossero discendenti dei Leshiye e che le loro pelli avrebbero conferito forza e fortuna in battaglia. Nonostante gli abitanti avessero vietato loro di cacciarli, questi uomini disubbidirono. Marrok non ricorda molto di quanto avvenne durante lo scontro, tranne che il branco moriva intorno a lui, mentre combatteva sopra il cadavere della sua madre lupo. Poi il nulla. Il giorno seguente, Marrok – nudo, coperto di sangue e stringendo in pugno la camicia di uno dei cacciatori – giunse a una fattoria. Una buona conta- dina, Alexi Natalova, accolse il giovane selvaggio, curò le sue ferite e gli insegnò le basi del linguaggio e degli usi della società umana. Grazie a lei, Marrok comprese ciò che di buono c'è nell'umanità e di come il forte poteva proteggere i deboli. Trascorsero dei mesi e, quando ne fu in grado, Marrok raccontò del massacro del suo branco. Mostrando la camicia strappata giurò di trovare i responsabili della morte della sua famiglia adottiva. Lasciò la sua unica amica, Alexi, e si incamminò per rintracciare gli assassini. Oggi Marrok è sulle loro tracce, alla ricerca di indizi che leghino la camicia strappata e il simbolo su di essa alla vendetta che desidera tanto disperatamente.\n\n🎯 Obiettivi:\nTrovare un branco umano con cui viaggiare e da proteggere. Marrok ha il cuore di un lupo, ma non ha un branco, cosa che trova quasi intollerabile. Avendo vissuto tanto a lungo con altre creature, Marrok ha bisogno di compagnia e amicizia per sopravvivere: vuole trovare un branco umano che lo accolga. Portare gli assassini del suo branco di fronte alla giustizia. Marrok deve trovare i responsabili della morte della sua famiglia e vendicarsi. Il suo unico indizio è la camicia strappata e insanguinata di uno dei loro capi. Alexi era preoccupata e gli ha detto che il blasone sulla camicia appartiene alla famiglia V estenova, vassalli dei potenti Riasanova della Knias Douma. Reclamare la sua eredità scoprendo il vero nome di suo padre. Una volta ritornato tra gli umani, Marrok fece molte domande sulle sue origini. Nonostante voglia prima di tutto trovare gli assassini del branco, non può evitare di pensare anche alla sua famiglia umana. L'unico indizio che possiede è la roccia dove venne trovato dai lupi e la sua incredibile somiglianza con il famoso principe e politico Aleksi Novgorov.\n\n🎭 Consigli di Interpretazione (Giocare Marrok):\nMarrok, a volte detto “Il Marrok” , si muove su una linea sottile tra essere una creatura selvatica e un guerriero ferale. Questo gigante si muove con le spalle curve coperte da una pelliccia arruffata, per proteggersi dal freddo, e spessi strati di cuoio. Ha una grazia selvaggia e si muove tanto velocemente a quattro zampe quanto eretto. Parla per frasi corte in tono basso e gutturale. La sua voce è sempre rauca e fissa tutti negli occhi, con una posa che è una chiara sfida per il predominio.",
        "pcData": {
            "name": "Marrok",
            "nation": "Ussura",
            "concept": "Eroi Indomiti • Ussura",
            "traits": {
                "Vigore": 3,
                "Grazia": 2,
                "Risolutezza": 4,
                "Acume": 2,
                "Panache": 2
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 1,
                "Convincere": 0,
                "Empatia": 2,
                "Esibirsi": 1,
                "Furto": 1,
                "Intimidire": 2,
                "Istruzione": 0,
                "Mira": 3,
                "Mischia": 0,
                "Nascondersi": 2,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 3
            },
            "advantages": [
                "Cecchino",
                "Equilibrio Perfetto",
                "Esperto di Sopravvivenza",
                "Fatto!",
                "Pugilatore",
                "Stregoneria: Tocco della Madre 2"
            ],
            "virtue": "Virtù: Il Ritrovo Esemplare. Quando attiva questa Virtù, l’Eroe deve indicare un altro Eroe presente nella Scena. I due sommano i propri Incrementi per il Round e tutte le spese sono effettuate attingendo da questa riserva condivisa.",
            "hubris": "Hubris: Il Diavolo Fiducioso. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato. Stregoneria Marrok ha i Doni Comando, Purificare, Rigenerazione e Vista. Le sue Restrizioni sono Clemenza e Onestà.",
            "peculiarities": "Cacciatore. Ottiene un Punto Eroe ogni volta che il suo istinto di cacciatore salva qualcuno da un pericolo. Toccato da Matushka. Ottiene un Punto Eroe ogni volta che dà un lezione a qualcuno in un modo che renderebbe Matushka orgogliosa.",
            "story": "La vicenda dell'uomo che sarebbe diventato Marrok comincia con una relazione illecita nel cuore di Ussura. Una semplice contadina, chiamata Irina, viveva nel villaggio di V eche e sposò Boris Ivanovich, un ricco possidente che pareva destinato a farsi strada nel mondo. Il loro matrimonio, ben presto, si guastò e Irina si innamorò di un rampollo della famiglia Novgorov che era in viaggio per la provincia. Quando scoprì di essere incinta, scrisse al suo amante, ma il marito intercettò la lettera, rinchiuse Irina fino al giorno del parto, poi prese il neonato e lo abbandonò nei boschi a morire di freddo nella notte invernale. Forse fu grazie al sangue dei Novgorov, forse perché Ussura si prende cura dei suoi figli, fatto sta che il bambino non morì, ma venne salvato e cresciuto dai lupi. Gli abitanti cominciarono a narrare di un branco di enormi lupi che viaggiavano con un bambino, forte abbastanza da misurarsi con le più feroci tra quelle belve. Chi lo aveva avvistato, lo descriveva come un bel giovane, tragicamente sporco, con occhi verdi e capelli neri arruffati. Per Marrok, la vita era pericolosa, eccitante e asso- lutamente innocente. Le cose cambiarono quando compì 23 anni. Alcuni cacciatori di V eche si convin- sero che quei lupi fossero discendenti dei Leshiye e che le loro pelli avrebbero conferito forza e fortuna in battaglia. Nonostante gli abitanti avessero vietato loro di cacciarli, questi uomini disubbidirono. Marrok non ricorda molto di quanto avvenne durante lo scontro, tranne che il branco moriva intorno a lui, mentre combatteva sopra il cadavere della sua madre lupo. Poi il nulla. Il giorno seguente, Marrok – nudo, coperto di sangue e stringendo in pugno la camicia di uno dei cacciatori – giunse a una fattoria. Una buona conta- dina, Alexi Natalova, accolse il giovane selvaggio, curò le sue ferite e gli insegnò le basi del linguaggio e degli usi della società umana. Grazie a lei, Marrok comprese ciò che di buono c'è nell'umanità e di come il forte poteva proteggere i deboli. Trascorsero dei mesi e, quando ne fu in grado, Marrok raccontò del massacro del suo branco. Mostrando la camicia strappata giurò di trovare i responsabili della morte della sua famiglia adottiva. Lasciò la sua unica amica, Alexi, e si incamminò per rintracciare gli assassini. Oggi Marrok è sulle loro tracce, alla ricerca di indizi che leghino la camicia strappata e il simbolo su di essa alla vendetta che desidera tanto disperatamente.",
            "objectives": "Trovare un branco umano con cui viaggiare e da proteggere. Marrok ha il cuore di un lupo, ma non ha un branco, cosa che trova quasi intollerabile. Avendo vissuto tanto a lungo con altre creature, Marrok ha bisogno di compagnia e amicizia per sopravvivere: vuole trovare un branco umano che lo accolga. Portare gli assassini del suo branco di fronte alla giustizia. Marrok deve trovare i responsabili della morte della sua famiglia e vendicarsi. Il suo unico indizio è la camicia strappata e insanguinata di uno dei loro capi. Alexi era preoccupata e gli ha detto che il blasone sulla camicia appartiene alla famiglia V estenova, vassalli dei potenti Riasanova della Knias Douma. Reclamare la sua eredità scoprendo il vero nome di suo padre. Una volta ritornato tra gli umani, Marrok fece molte domande sulle sue origini. Nonostante voglia prima di tutto trovare gli assassini del branco, non può evitare di pensare anche alla sua famiglia umana. L'unico indizio che possiede è la roccia dove venne trovato dai lupi e la sua incredibile somiglianza con il famoso principe e politico Aleksi Novgorov.",
            "quote": "“A volte il lupo deve proteggere la pecora.”"
        }
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
        "traits": "Vigore 3, Grazia 2, Risolutezza 3, Acume 3, Panache 2 • Virtù: La Guerra Vittoriosa. Quando l’Eroe ferisce per la prima volta un Malvagio in combattimento può attivare questa Virtù per infliggere una Ferita Drammatica aggiuntiva oltre al normale danno. • Hubris: L’Imperatore Testa Calda. L’Eroe riceve un Punto Eroe quando perde le staffe o provoca guai.",
        "ability": "«“Vi chiederete perché vi ho invitati qui oggi. Ebbene, quel frastuono che sentite alla vostra sinistra è una carica di alci che i ragazzi del villaggio hanno scatenato poco più su. Se, alla fine, sarete ancora vivi forse ci batteremo.”»\n\nVantaggi: Aggressione Sconsiderata, Bevitrice Emerita, Dura da Uccidere, Sala d’Armi: Leegstra, Ti Porto con Me\n\nPeculiarità: Bearsark. Ottiene un Punto Eroe ogni volta che lascia che sia il GM a decidere la sua prossima azione. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
        "notes": "«“Vi chiederete perché vi ho invitati qui oggi. Ebbene, quel frastuono che sentite alla vostra sinistra è una carica di alci che i ragazzi del villaggio hanno scatenato poco più su. Se, alla fine, sarete ancora vivi forse ci batteremo.”»\nArchetipo: Eroi Indomiti\n\n📖 Storia:\nAl contrario di molti V esten, predoni per tradizione, il clan Olsung è sempre stato formato da contadini. Pur essendo meno emozionante dell'andare a depredare, far crescere carote, rape e radici di pastinaca in una tundra gelata è ben più difficile che passare un uomo a fil di spada. Molti anni or sono, un equipaggio di pirati assaltò la costa e affrontò gli uomini degli Olsung fuori dal loro villaggio. Il clan ne uscì vincitore dopo che una contadinella caricò come una folle le fila nemiche e stese il capitano pirata con un singolo colpo d'ascia che provocò il panico. Il capovillaggio la rimproverò per la sua imprudenza, ma la lodò per aver fatto vincere la battaglia al clan. Lei fu la prima Olin Olle Olsen, un simbolo, un normale membro del clan che grazie al suo coraggio – e ad una fortuna sfacciata – ha protetto le sue terre. È dovere di ogni Olin scegliere un successore, una guerriera a cui trasmettere il titolo dopo che avrà compiuto un atto di valore (se una Olin muore prima di avere scelto il proprio successore sarà il clan a farlo). C'è stata una Olin che ha organizzato una carica di pony sul ponte inferiore di una nave pirata, quella che ha addestrato il suo cane a recuperare i giavellotti e quella che portava corna sull'elmo per incornare i nemici come un toro. Olin Olle Olsen è sempre stata a guardia del clan, sfruttando tattiche bizzarre per respingere avversari dieci volte più numerosi. Solo lo skald del clan e la precedente Olin conoscono la vera identità di questo Eroe, per impedire che i nemici la colpiscano nei suoi affetti. Ogni Olin indossa un'ar- matura per nascondere la propria identità. È passato molto tempo dal giorno in cui una ragazza caricò in battaglia per proteggere la sua famiglia e oggi il titolo è sinonimo di abilità marziale, ma l'attuale Olin incarna lo stesso spirito dell'originale: è una donna fiera e legata alla promessa di difendere le terre del clan Olsung. I nuovi guerrieri del clan possono solo sperare di intra- vedere Olin in azione, mentre danza tra i ranghi nemici con una spada per mano, come una tempesta di morte, finché il nemico non è in fuga. T utti hanno sentito raccontare di come Olin abbia sempre un piano per confondere i suoi avversari fino al momento perfetto per colpire.\n\n🎯 Obiettivi:\nTrovare la prossima Olin grazie a un torneo. L'aspettativa di vita di ogni Olin Olle Olsen è, ovvia - mente, breve. Proteggere i V estenmennavenjar da minacce sia interne che esterne è una questione più di fortuna che di abilità. Purtroppo, man mano che l'influenza della Lega V endel rende V esten un luogo pacifico, trovare combattenti abili diventa sempre più difficile. L'attuale Olin ha in mente di organizzare un epico torneo di abilità marziali e giochi di strategia tradizionali V esten per trovare chi sia degno del titolo. Recuperare l’antico Elmo Spezzatempeste, venduto come oggetto d’arte. L'ultima matriarca del clan vendette il leggendario Elmo Spezzatempeste, indossato dalla prima Olin, alla Compagnia Commerciale Atabeana in cambio di cibo sufficiente per superare l'inverno. T utto conside- rato fu un buon accordo, ma ora il clan ha bisogno di riaverlo per salvaguardare il proprio onore. Sconfiggere i troll tra i colli ancestrali degli Olsung. In passato gli Olsung e i troll avevano buoni rapporti. Gli uomini portavano offerte di cibo e liquori un paio di volte al mese e i troll non calavano dalle loro tane sulle colline, accompagnati dal freddo e dal gelo, per fare a pezzi le case e mangiare le persone. L'attuale capo dei troll, però, è un guerrafondaio nazionalista (a quanto pare anche i troll ne hanno) che vuole riconqui- stare le terre ancestrali, comprese quelle degli Olsung.\n\n🎭 Consigli di Interpretazione (Giocare Olin Olle Olsen):\nMisteriosa, devota ed eccentrica, Olin Olle Olsen è un eroe locale che indossa un costume che nasconde e ispira, come la Primula Rossa, Zorro o il T emibile Pirata Roberts. Olin parla poco e con una voce artifi- ciosamente bassa e roca, in modo da non poter essere identificata dai nemici. È attenta, indagatrice ed è costantemente alla ricerca di possibili uscite, punti sopraelevati o siti per imboscate. Olin pone sopra di tutto il suo dovere di salvaguardare la famiglia e gli amici.",
        "pcData": {
            "name": "Olin Olle Olsen",
            "nation": "Vestenmennavenjar",
            "concept": "Eroi Indomiti • Vestenmennavenjar",
            "traits": {
                "Vigore": 3,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 2
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 2,
                "Atletica": 3,
                "Cavalcare": 0,
                "Convincere": 0,
                "Empatia": 1,
                "Esibirsi": 1,
                "Furto": 0,
                "Intimidire": 3,
                "Istruzione": 0,
                "Mira": 0,
                "Mischia": 3,
                "Nascondersi": 0,
                "Navigazione": 1,
                "Notare": 3,
                "Rissa": 3
            },
            "advantages": [
                "Aggressione Sconsiderata",
                "Bevitrice Emerita",
                "Dura da Uccidere",
                "Sala d’Armi: Leegstra",
                "Ti Porto con Me"
            ],
            "virtue": "Virtù: La Guerra Vittoriosa. Quando l’Eroe ferisce per la prima volta un Malvagio in combattimento può attivare questa Virtù per infliggere una Ferita Drammatica aggiuntiva oltre al normale danno.",
            "hubris": "Hubris: L’Imperatore Testa Calda. L’Eroe riceve un Punto Eroe quando perde le staffe o provoca guai.",
            "peculiarities": "Bearsark. Ottiene un Punto Eroe ogni volta che lascia che sia il GM a decidere la sua prossima azione. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
            "story": "Al contrario di molti V esten, predoni per tradizione, il clan Olsung è sempre stato formato da contadini. Pur essendo meno emozionante dell'andare a depredare, far crescere carote, rape e radici di pastinaca in una tundra gelata è ben più difficile che passare un uomo a fil di spada. Molti anni or sono, un equipaggio di pirati assaltò la costa e affrontò gli uomini degli Olsung fuori dal loro villaggio. Il clan ne uscì vincitore dopo che una contadinella caricò come una folle le fila nemiche e stese il capitano pirata con un singolo colpo d'ascia che provocò il panico. Il capovillaggio la rimproverò per la sua imprudenza, ma la lodò per aver fatto vincere la battaglia al clan. Lei fu la prima Olin Olle Olsen, un simbolo, un normale membro del clan che grazie al suo coraggio – e ad una fortuna sfacciata – ha protetto le sue terre. È dovere di ogni Olin scegliere un successore, una guerriera a cui trasmettere il titolo dopo che avrà compiuto un atto di valore (se una Olin muore prima di avere scelto il proprio successore sarà il clan a farlo). C'è stata una Olin che ha organizzato una carica di pony sul ponte inferiore di una nave pirata, quella che ha addestrato il suo cane a recuperare i giavellotti e quella che portava corna sull'elmo per incornare i nemici come un toro. Olin Olle Olsen è sempre stata a guardia del clan, sfruttando tattiche bizzarre per respingere avversari dieci volte più numerosi. Solo lo skald del clan e la precedente Olin conoscono la vera identità di questo Eroe, per impedire che i nemici la colpiscano nei suoi affetti. Ogni Olin indossa un'ar- matura per nascondere la propria identità. È passato molto tempo dal giorno in cui una ragazza caricò in battaglia per proteggere la sua famiglia e oggi il titolo è sinonimo di abilità marziale, ma l'attuale Olin incarna lo stesso spirito dell'originale: è una donna fiera e legata alla promessa di difendere le terre del clan Olsung. I nuovi guerrieri del clan possono solo sperare di intra- vedere Olin in azione, mentre danza tra i ranghi nemici con una spada per mano, come una tempesta di morte, finché il nemico non è in fuga. T utti hanno sentito raccontare di come Olin abbia sempre un piano per confondere i suoi avversari fino al momento perfetto per colpire.",
            "objectives": "Trovare la prossima Olin grazie a un torneo. L'aspettativa di vita di ogni Olin Olle Olsen è, ovvia - mente, breve. Proteggere i V estenmennavenjar da minacce sia interne che esterne è una questione più di fortuna che di abilità. Purtroppo, man mano che l'influenza della Lega V endel rende V esten un luogo pacifico, trovare combattenti abili diventa sempre più difficile. L'attuale Olin ha in mente di organizzare un epico torneo di abilità marziali e giochi di strategia tradizionali V esten per trovare chi sia degno del titolo. Recuperare l’antico Elmo Spezzatempeste, venduto come oggetto d’arte. L'ultima matriarca del clan vendette il leggendario Elmo Spezzatempeste, indossato dalla prima Olin, alla Compagnia Commerciale Atabeana in cambio di cibo sufficiente per superare l'inverno. T utto conside- rato fu un buon accordo, ma ora il clan ha bisogno di riaverlo per salvaguardare il proprio onore. Sconfiggere i troll tra i colli ancestrali degli Olsung. In passato gli Olsung e i troll avevano buoni rapporti. Gli uomini portavano offerte di cibo e liquori un paio di volte al mese e i troll non calavano dalle loro tane sulle colline, accompagnati dal freddo e dal gelo, per fare a pezzi le case e mangiare le persone. L'attuale capo dei troll, però, è un guerrafondaio nazionalista (a quanto pare anche i troll ne hanno) che vuole riconqui- stare le terre ancestrali, comprese quelle degli Olsung.",
            "quote": "“Vi chiederete perché vi ho invitati qui oggi. Ebbene, quel frastuono che sentite alla vostra sinistra è una carica di alci che i ragazzi del villaggio hanno scatenato poco più su. Se, alla fine, sarete ancora vivi forse ci batteremo.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 3, Acume 3, Panache 2 • Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro. • Hubris: Il Matto Curioso. L’Eroe riceve un Punto Eroe quando investiga su qualcosa di inusuale, specialmente se pericoloso.",
        "ability": "«“Credo sia meglio iniziare con delle scuse. Sinceramente, non avevamo alcuna inten- zione di scoprire accidentalmente (e simulta- neamente) l’ingresso alla biblioteca segreta, risvegliando lo spettro guardiano nella vostra cantina. È stata solo una scoperta fortunata.”»\n\nVantaggi: Cameratismo, Fatto!, Lavorare sui Tetti, Linguista, Oggetto Distintivo: Scatola Rompicapo Syrneth, Riflessi Rapidi: Atletica, Vista d’Aquila\n\nPeculiarità: Archeologa. Ottiene un Punto Eroe ogni volta che consegna un artefatto di valore a un museo, università o altra istituzione pubblica. Esploratrice. Ottiene un Punto Eroe ogni volta che posa lo sguardo su una vista che pochi o nessuno a Théah hanno mai potuto godere.",
        "notes": "«“Credo sia meglio iniziare con delle scuse. Sinceramente, non avevamo alcuna inten- zione di scoprire accidentalmente (e simulta- neamente) l’ingresso alla biblioteca segreta, risvegliando lo spettro guardiano nella vostra cantina. È stata solo una scoperta fortunata.”»\nArchetipo: Eroi Lesti\n\n📖 Storia:\nIl primo ricordo di Bietrix è un letto d'ospedale. Fu malata per buona parte dell'infanzia, passando il tempo tra visite mediche e il tentativo di occupare la mente, non desiderando altro che poter uscire. Bietrix, la più giovane di due sorelle, non avrebbe mai eredi- tato la fortuna di famiglia e per questo motivo i geni- tori si preoccupavano per lei solo fino a un certo punto. Il giorno del suo 13° compleanno, la famiglia era tanto occupata con le prossime nozze della sorella da dimenticarsi di lei. Fu una sorpresa per tutti quando Bietrix scese per il tè del pomeriggio e annunciò: “Sto meglio” , prese un panino al burro dal tavolo e se ne andò. Non aveva idea di dove sarebbe andata, ma era sicura che sarebbe stata un'avventura. Da quel momento la famiglia fu felice di dimenti - carsi nuovamente di lei e anche Bietrix non deside - rava altro. Divenne una sorta di spettro di casa de V eau: tornava dalle sue esplorazioni dei tunnel sotto Charouse sporca di fango e coperta di tagli e di lividi, lasciando dietro di sé una scia di sporcizia e artefatti. Nonostante i molti incidenti in cui sembrava incap- pare, il risultato di queste esplorazioni furono alcune scoperte miracolose: una misteriosa scatola rompi - capo, una collana di gemme e, persino, uno scrigno ricolmo di monete. Una svolta nella vita di Bietrix giunse quando, a 18 anni, prese in prestito la giacca di suo padre per uscire. Troppo pigra per salire le scale e prendere la sua, Bietrix era certa che non sarebbe accaduto nulla di male nel prendere in prestito l'abito paterno per qualche ora. Un crollo e due scontri dopo, rientrò completamente sporca e con un'enorme squarcio nella giacca. Il giorno seguente, Bietrix passò davanti allo studio del padre e lo vide picchiare uno dei servi. Quando chiese cosa stesse accadendo, il padre le disse che la sua giacca da cavallo preferita era stata rovinata. Sconvolta, raccontò l'accaduto, ma il padre le rise in faccia, affermando che la giacca non doveva essere lasciata fuori. Bietrix lasciò lo studio del padre infuriata. Ora era chiaro cosa doveva fare di tutti i tesori che aveva dissotterrato. Il giorno seguente vendette il suo primo artefatto e donò il ricavato alla famiglia del servo affinché potessero essere liberi da suo padre. Da allora Bietrix ha usato il suo denaro e le sue imprese per aiutare la gente di Montaigne.\n\n🎯 Obiettivi:\nRisolvere la scatola rompicapo Syrneth che ha ritrovato. Il primo e più prezioso tesoro ritrovato da Bietrix è una scatola rompicapo Syrneth. È l'unico oggetto che conserva per sé, ma non è ancora riuscita ad aprirlo. Unirsi alla Società degli Esploratori. Bietrix sogna di diventare membro di questa fanta - stica organizzazione. Purtroppo potrebbe avere acci- dentalmente causato alcuni problemi agli agenti della Società. Questi incidenti fortuiti hanno reso molto difficili i suoi rapporti con l'organizzazione stessa. Fare ammenda per aver intrappo- lato Leonore Favre sottoterra. Mentre stava restituendo un'antica chiave “presa in prestito” da casa T anguy, Bietrix incontrò la loro domestica, Leonore Favre. Le due divennero subito amiche e Bietrix convinse Leonore ad accompagnarla in una spedizione. Nelle profondità delle catacombe di Charouse, Bietrix provocò accidentalmente un crollo, che intrappolò Leonore. Quando finalmente Bietrix tornò con gli aiuti, Leonore era già stata salvata dalla guardia cittadina ed era nei guai coi suoi padroni. Da allora Leonore non ha più rivolto a Bietrix la parola.\n\n🎭 Consigli di Interpretazione (Giocare Bietrix de Veau):\nBietrix è assolutamente onesta e tende a blaterare di continuo, come se non si rendesse conto di cosa (o chi) la circonda. Se si accorge di avere ferito i sentimenti altrui, farà tutto il possibile per rime - diare, spesso esagerando nel senso opposto. Bietrix ha passato buona parte della sua infanzia bloccata a letto e ora trascorre l'età adulta all'interno di polve - rose catacombe. A differenza di molti suoi colleghi più induriti, Bietrix è sempre eccitata per l'avventura e adora i misteri. È una donna che vuole assaporare in pieno la vita e tutto ciò che questa ha da offrire.",
        "pcData": {
            "name": "Bietrix de Veau",
            "nation": "Montaigne",
            "concept": "Eroi Lesti • Montaigne",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 2
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 0,
                "Atletica": 3,
                "Cavalcare": 1,
                "Convincere": 2,
                "Empatia": 2,
                "Esibirsi": 0,
                "Furto": 3,
                "Intimidire": 0,
                "Istruzione": 2,
                "Mira": 0,
                "Mischia": 2,
                "Nascondersi": 2,
                "Navigazione": 1,
                "Notare": 1,
                "Rissa": 1
            },
            "advantages": [
                "Cameratismo",
                "Fatto!",
                "Lavorare sui Tetti",
                "Linguista",
                "Oggetto Distintivo: Scatola Rompicapo Syrneth",
                "Riflessi Rapidi: Atletica",
                "Vista d’Aquila"
            ],
            "virtue": "Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro.",
            "hubris": "Hubris: Il Matto Curioso. L’Eroe riceve un Punto Eroe quando investiga su qualcosa di inusuale, specialmente se pericoloso.",
            "peculiarities": "Archeologa. Ottiene un Punto Eroe ogni volta che consegna un artefatto di valore a un museo, università o altra istituzione pubblica. Esploratrice. Ottiene un Punto Eroe ogni volta che posa lo sguardo su una vista che pochi o nessuno a Théah hanno mai potuto godere.",
            "story": "Il primo ricordo di Bietrix è un letto d'ospedale. Fu malata per buona parte dell'infanzia, passando il tempo tra visite mediche e il tentativo di occupare la mente, non desiderando altro che poter uscire. Bietrix, la più giovane di due sorelle, non avrebbe mai eredi- tato la fortuna di famiglia e per questo motivo i geni- tori si preoccupavano per lei solo fino a un certo punto. Il giorno del suo 13° compleanno, la famiglia era tanto occupata con le prossime nozze della sorella da dimenticarsi di lei. Fu una sorpresa per tutti quando Bietrix scese per il tè del pomeriggio e annunciò: “Sto meglio” , prese un panino al burro dal tavolo e se ne andò. Non aveva idea di dove sarebbe andata, ma era sicura che sarebbe stata un'avventura. Da quel momento la famiglia fu felice di dimenti - carsi nuovamente di lei e anche Bietrix non deside - rava altro. Divenne una sorta di spettro di casa de V eau: tornava dalle sue esplorazioni dei tunnel sotto Charouse sporca di fango e coperta di tagli e di lividi, lasciando dietro di sé una scia di sporcizia e artefatti. Nonostante i molti incidenti in cui sembrava incap- pare, il risultato di queste esplorazioni furono alcune scoperte miracolose: una misteriosa scatola rompi - capo, una collana di gemme e, persino, uno scrigno ricolmo di monete. Una svolta nella vita di Bietrix giunse quando, a 18 anni, prese in prestito la giacca di suo padre per uscire. Troppo pigra per salire le scale e prendere la sua, Bietrix era certa che non sarebbe accaduto nulla di male nel prendere in prestito l'abito paterno per qualche ora. Un crollo e due scontri dopo, rientrò completamente sporca e con un'enorme squarcio nella giacca. Il giorno seguente, Bietrix passò davanti allo studio del padre e lo vide picchiare uno dei servi. Quando chiese cosa stesse accadendo, il padre le disse che la sua giacca da cavallo preferita era stata rovinata. Sconvolta, raccontò l'accaduto, ma il padre le rise in faccia, affermando che la giacca non doveva essere lasciata fuori. Bietrix lasciò lo studio del padre infuriata. Ora era chiaro cosa doveva fare di tutti i tesori che aveva dissotterrato. Il giorno seguente vendette il suo primo artefatto e donò il ricavato alla famiglia del servo affinché potessero essere liberi da suo padre. Da allora Bietrix ha usato il suo denaro e le sue imprese per aiutare la gente di Montaigne.",
            "objectives": "Risolvere la scatola rompicapo Syrneth che ha ritrovato. Il primo e più prezioso tesoro ritrovato da Bietrix è una scatola rompicapo Syrneth. È l'unico oggetto che conserva per sé, ma non è ancora riuscita ad aprirlo. Unirsi alla Società degli Esploratori. Bietrix sogna di diventare membro di questa fanta - stica organizzazione. Purtroppo potrebbe avere acci- dentalmente causato alcuni problemi agli agenti della Società. Questi incidenti fortuiti hanno reso molto difficili i suoi rapporti con l'organizzazione stessa. Fare ammenda per aver intrappo- lato Leonore Favre sottoterra. Mentre stava restituendo un'antica chiave “presa in prestito” da casa T anguy, Bietrix incontrò la loro domestica, Leonore Favre. Le due divennero subito amiche e Bietrix convinse Leonore ad accompagnarla in una spedizione. Nelle profondità delle catacombe di Charouse, Bietrix provocò accidentalmente un crollo, che intrappolò Leonore. Quando finalmente Bietrix tornò con gli aiuti, Leonore era già stata salvata dalla guardia cittadina ed era nei guai coi suoi padroni. Da allora Leonore non ha più rivolto a Bietrix la parola.",
            "quote": "“Credo sia meglio iniziare con delle scuse. Sinceramente, non avevamo alcuna inten- zione di scoprire accidentalmente (e simulta- neamente) l’ingresso alla biblioteca segreta, risvegliando lo spettro guardiano nella vostra cantina. È stata solo una scoperta fortunata.”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 4, Acume 2, Panache 3 • Virtù: Il Glifo Mite. Attivando questa Virtù, l’Eroe impedisce a qualsiasi effetto magico (Stregoneria, Artefatti, Mostri ecc.) di avere effetto su di lui. • Hubris: L’Impiccato Indeciso. L’Eroe riceve un Punto Eroe quando spreca un’Azione esitando in preda al dubbio o all’incertezza.",
        "ability": "«“Dovrei avere il mestiere più noioso del mondo, ma Eisen ha un modo tutto suo per trasformare le cose più semplici in avventure micidiali. Quaggiù, tra l’oscurità e il fango, è la terra ad essere tua nemica.”»\n\nVantaggi: Orologio Biologico, Riflessi Rapidi: Navigazione, Rissoso, Scuola di Maniere, Vista d’Aquila, Volontà Indomabile\n\nPeculiarità: Marinaio. Ottiene un Punto Eroe ogni volta che mette da parte i suoi desideri per garantire la sicurezza o la comodità dei suoi compagni. Mercante. Ottiene un Punto Eroe ogni volta che vende un oggetto per molto meno del suo reale valore a chi ne ha un disperato bisogno.",
        "notes": "«“Dovrei avere il mestiere più noioso del mondo, ma Eisen ha un modo tutto suo per trasformare le cose più semplici in avventure micidiali. Quaggiù, tra l’oscurità e il fango, è la terra ad essere tua nemica.”»\nArchetipo: Eroi Lesti\n\n📖 Storia:\nCinque anni fa, Eberhardt Fischer tornò al suo villaggio dopo un viaggio di lavoro, appena in tempo per vedere l' Onda Vivente trascinare qualsiasi cosa sul fondo della palude. L'enorme massa di materia vege- tale animata, con giganteschi occhi di pietra luccicante affogò tutti coloro che Eberhardt amava. Da allora, Fischer soffre di un male comune ad Eisen, detto “nevrosi da guerra” perché colpisce soprattutto i soldati vittime di violenza e stress estremi. È un male poco studiato e i sintomi non sono identici per tutti coloro che ne soffrono. Eberhardt, per esempio, prova tanto terrore e panico quando si avvicina a grandi masse d'acqua, da diventare quasi incapace di parlare o agire. Ciononostante, l'azienda di famiglia lo costringe ad avvicinarsi alle paludi. Il suo lavoro di “semplice mercante” è una copertura per il trasporto di oggetti pericolosi, magici o inestimabili; che si tratti di qual- cosa che brilla, urla, si scuote, saltella o sussurra di ricchezze inimmaginabili. Eberhardt non guarda mai nelle casse che trasporta e non fa mai domande, sebbene alcuni clienti lo informino volontariamente. T utto ciò che sa è che i legami con certi clienti risal- gono a molte generazioni fa. Nonostante la sua malattia, Eberhardt attraversa ancora le paludi con il suo carico particolare e una lunga lista di rituali per calmarsi, concentrarsi e rima- nere attento anche quando è sopraffatto dalla paura. A volte, però, questi non bastano e per un'oretta diventa silenzioso, mentre i suoi occhi fissano vuoti l'orizzonte. Sebbene rimanga consapevole di chi è e dove si trova, gli risulta difficile parlare o muoversi. La paura gli ha dato una specie di sesto senso verso i pericoli della palude. Una iniziale ipersensibilità al rumore e al movimento è diventata, grazie alla pratica, la capacità di identificare i mostri già a grande distanza. Eberhardt è consapevole della vita che vive e che l'aver trasformato la sua debolezza in una capacità tanto straordinaria potrebbe aiutare altri nelle sue condizioni. Per questo assolda soldati affetti da nevrosi da guerra, e quindi inabili alla professione, come scorta per le sue barche. Con la sua opera, Fischer ha inav- vertitamente posto le basi perché molti eroi distrutti possano riprendersi.\n\n🎯 Obiettivi:\nCartografare la parte più pericolosa della palude. La regione intorno al vecchio villaggio di Eberhardt è detta “des T eufels Abfluss” , l'Acquitrino del Diavolo. Si tratta di un'area cruciale per i commerci esteri di Eisen. Fischer conosce alcune rotte attraverso la regione, ma spesso naviga a braccio. Se potesse cartografare il settore, le mappe risultanti gli permetterebbero di espandere il giro di affari e portare rifornimenti nelle aree che ne hanno più bisogno, ma gli occorre qual- cuno che guardi le spalle a lui e agli altri cartografi. Sconfiggere ciò che controlla i ghoul della palude. Eberhardt si è accorto che, a volte, i ghoul della palude mostrano un'insolita organizzazione, si muovono e attaccano in una sorta di formazione mentre circon- dano le vittime. Sospetta che facciano capo a una sorta di autorità. Ma quale scienza o stregoneria può trasformare un'orda non-morta in un esercito? Trasportare un panzerhand di Dracheneisen agli agenti Kreuzritter a Freiburg. Eberhardt non è un vero Kreuzritter, ma questi si fidano di lui per trasporti delicati. La palude è un ottimo deterrente per i comuni banditi e i nemici dell'organizzazione. Il Dracheneisen però è diverso. Eberhardt ha notato un sinistro figuro che si aggira attorno al magazzino dove conserva il panzerhand.\n\n🎭 Consigli di Interpretazione (Giocare Eberhardt Fischer):\nEberhardt Fischer parla piano e in maniera educata, con l' intercalare caratteristico di un mercante navigato, che si interessa sempre della salute dei clienti e li mette a loro agio, evitando però di rivelare troppo su se stesso. Sorride di rado e si guarda intorno costantemente, attento a indi- viduare tutte le uscite in caso di emergenza. Il trauma subito lo ha cambiato, forse in modo irreversibile, ma non definisce la sua intera personalità. Quando è al lavoro, Eberhardt si appoggia a rituali per controllare la sua nevrosi, come regolare il respiro, ripetere mormorando alcune frasi o parlare continuamente con altri di argo- menti generici.",
        "pcData": {
            "name": "Eberhardt Fischer",
            "nation": "Eisen",
            "concept": "Eroi Lesti • Eisen",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 4,
                "Acume": 2,
                "Panache": 3
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 1,
                "Cavalcare": 2,
                "Convincere": 2,
                "Empatia": 2,
                "Esibirsi": 0,
                "Furto": 0,
                "Intimidire": 1,
                "Istruzione": 1,
                "Mira": 0,
                "Mischia": 2,
                "Nascondersi": 0,
                "Navigazione": 3,
                "Notare": 3,
                "Rissa": 1
            },
            "advantages": [
                "Orologio Biologico",
                "Riflessi Rapidi: Navigazione",
                "Rissoso",
                "Scuola di Maniere",
                "Vista d’Aquila",
                "Volontà Indomabile"
            ],
            "virtue": "Virtù: Il Glifo Mite. Attivando questa Virtù, l’Eroe impedisce a qualsiasi effetto magico (Stregoneria, Artefatti, Mostri ecc.) di avere effetto su di lui.",
            "hubris": "Hubris: L’Impiccato Indeciso. L’Eroe riceve un Punto Eroe quando spreca un’Azione esitando in preda al dubbio o all’incertezza.",
            "peculiarities": "Marinaio. Ottiene un Punto Eroe ogni volta che mette da parte i suoi desideri per garantire la sicurezza o la comodità dei suoi compagni. Mercante. Ottiene un Punto Eroe ogni volta che vende un oggetto per molto meno del suo reale valore a chi ne ha un disperato bisogno.",
            "story": "Cinque anni fa, Eberhardt Fischer tornò al suo villaggio dopo un viaggio di lavoro, appena in tempo per vedere l' Onda Vivente trascinare qualsiasi cosa sul fondo della palude. L'enorme massa di materia vege- tale animata, con giganteschi occhi di pietra luccicante affogò tutti coloro che Eberhardt amava. Da allora, Fischer soffre di un male comune ad Eisen, detto “nevrosi da guerra” perché colpisce soprattutto i soldati vittime di violenza e stress estremi. È un male poco studiato e i sintomi non sono identici per tutti coloro che ne soffrono. Eberhardt, per esempio, prova tanto terrore e panico quando si avvicina a grandi masse d'acqua, da diventare quasi incapace di parlare o agire. Ciononostante, l'azienda di famiglia lo costringe ad avvicinarsi alle paludi. Il suo lavoro di “semplice mercante” è una copertura per il trasporto di oggetti pericolosi, magici o inestimabili; che si tratti di qual- cosa che brilla, urla, si scuote, saltella o sussurra di ricchezze inimmaginabili. Eberhardt non guarda mai nelle casse che trasporta e non fa mai domande, sebbene alcuni clienti lo informino volontariamente. T utto ciò che sa è che i legami con certi clienti risal- gono a molte generazioni fa. Nonostante la sua malattia, Eberhardt attraversa ancora le paludi con il suo carico particolare e una lunga lista di rituali per calmarsi, concentrarsi e rima- nere attento anche quando è sopraffatto dalla paura. A volte, però, questi non bastano e per un'oretta diventa silenzioso, mentre i suoi occhi fissano vuoti l'orizzonte. Sebbene rimanga consapevole di chi è e dove si trova, gli risulta difficile parlare o muoversi. La paura gli ha dato una specie di sesto senso verso i pericoli della palude. Una iniziale ipersensibilità al rumore e al movimento è diventata, grazie alla pratica, la capacità di identificare i mostri già a grande distanza. Eberhardt è consapevole della vita che vive e che l'aver trasformato la sua debolezza in una capacità tanto straordinaria potrebbe aiutare altri nelle sue condizioni. Per questo assolda soldati affetti da nevrosi da guerra, e quindi inabili alla professione, come scorta per le sue barche. Con la sua opera, Fischer ha inav- vertitamente posto le basi perché molti eroi distrutti possano riprendersi.",
            "objectives": "Cartografare la parte più pericolosa della palude. La regione intorno al vecchio villaggio di Eberhardt è detta “des T eufels Abfluss” , l'Acquitrino del Diavolo. Si tratta di un'area cruciale per i commerci esteri di Eisen. Fischer conosce alcune rotte attraverso la regione, ma spesso naviga a braccio. Se potesse cartografare il settore, le mappe risultanti gli permetterebbero di espandere il giro di affari e portare rifornimenti nelle aree che ne hanno più bisogno, ma gli occorre qual- cuno che guardi le spalle a lui e agli altri cartografi. Sconfiggere ciò che controlla i ghoul della palude. Eberhardt si è accorto che, a volte, i ghoul della palude mostrano un'insolita organizzazione, si muovono e attaccano in una sorta di formazione mentre circon- dano le vittime. Sospetta che facciano capo a una sorta di autorità. Ma quale scienza o stregoneria può trasformare un'orda non-morta in un esercito? Trasportare un panzerhand di Dracheneisen agli agenti Kreuzritter a Freiburg. Eberhardt non è un vero Kreuzritter, ma questi si fidano di lui per trasporti delicati. La palude è un ottimo deterrente per i comuni banditi e i nemici dell'organizzazione. Il Dracheneisen però è diverso. Eberhardt ha notato un sinistro figuro che si aggira attorno al magazzino dove conserva il panzerhand.",
            "quote": "“Dovrei avere il mestiere più noioso del mondo, ma Eisen ha un modo tutto suo per trasformare le cose più semplici in avventure micidiali. Quaggiù, tra l’oscurità e il fango, è la terra ad essere tua nemica.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 2, Acume 3, Panache 3 • Virtù: Gli Amanti Appassionata. L’Eroe può attivare questa Virtù per negare le Ferite subite da un altro Eroe nel momento in cui vengono inflitte. Chi attiva la Virtù subisce invece una Ferita Drammatica automatica. • Hubris: Il Diavolo Fiducioso. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato. Studioso di Lotta (3 Punti) L’Eroe apprende le Manovre Fendente, Parata e una terza a sua scelta non appartenente a uno Stile e può eseguirle come se fosse un Duellante. Il vantaggio Sala d’Armi costa solo 3 Punti per lui.",
        "ability": "«“La mia musa mi ha aperto gli occhi all’amore e grazie a lei ho ritrovato la passione per la mia bella Castille. La dipingerò con colori vibranti e la difenderò dalla corruzione con la punta della spada.”»\n\nVantaggi: Affascinare, Amicizie Altolocate, Mecenate, Schermidore, Sorriso Disarmante, Studioso di Lotta: Finta (vedi sotto)\n\nPeculiarità: Artista. Ottiene un Punto Eroe ogni volta che si sacrifica per rendere Théah un luogo più bello. Diestro. Ottiene un Punto Eroe ogni volta che sconfigge un duellante addestrato.",
        "notes": "«“La mia musa mi ha aperto gli occhi all’amore e grazie a lei ho ritrovato la passione per la mia bella Castille. La dipingerò con colori vibranti e la difenderò dalla corruzione con la punta della spada.”»\nArchetipo: Eroi Lesti\n\n📖 Storia:\nLa vita della nobiltà Castilliana può sembrare ecci - tante ai contadini che faticano nel fango per nutrire le proprie famiglie, ma questa non è l'esperienza di Inés Maldonado. Figlia di aristocratici senza terra che vivevano presso la magione di uno zio ricco, Inés non fu mai il tipo da restare seduta a chiacchierare ma, non avendo terre di proprietà, sembrava che nessuno si aspettasse altro da lei. Per sfogare questa energia e creatività divenne apprendista del celebre pittore Domingo T omás Aldana. Una sera, Inés si trovò costretta a un'altra soffocante occasione formale e stava pianificando di provocare un innocuo duello tra suo fratello e l'ospite per ravvivare una serata tanto soporifera. I suoi piani svanirono non appena entrò nella sala Francesca, una donna dalla carna - gione molto chiara, magra e abbigliata con un abito da cortigiana V odacce dai colori sgargianti, con una maschera nera a coprirle il volto, a parte per gli occhi grigi e delicati e le labbra rosso acceso. Inés raccolse tutto il suo coraggio, si avvicinò e le chiese un ballo. Danzarono per tutta la notte. Il mattino seguente, quando Inés entrò nella bottega di mastro Domingo, pallida per la stanchezza e con gli occhi cerchiati, lui si limitò a una complice strizzatina d'occhio, le mise un pennello in mano e la lasciò sola con la tela bianca. Quando tornò alla sera la trovò addormentata su una sedia accanto al suo primo vero capolavoro. Queste prime frivole scappatelle divennero un legame forte e molto intimo. Francesca confidò a Inés di essere per nascita una Strega del Fato, non una cortigiana, e che la sua identità era un inganno molto elaborato creato da una società segreta: le Figlie di Sofia. Grazie a loro, Francesca era fuggita da V odacce e dalle grinfie dei suoi futuri suoceri, che la incolpa- vano della sfortunata morte del fidanzato. T emendo che la corte fosse un luogo troppo pericoloso, le due amanti si lasciarono tutto alle spalle e cominciarono una nuova vita nella campagna Castilliana. Vivendo nella loro villetta, Inés scoprì l'amore per la sua patria. I contadini di Castille, non la nobiltà, erano la sua gente, una popolazione tanto dinamica che persino la siesta era un momento ricolmo di attività. Quando l'Inquisizione giunse a minacciare questa sua nuova felicità, Inés impugnò la spada per difen- derla. Di recente è entrata in contatto con un'organiz- zazione chiamata “Los V agabundos” . La loro causa la attrae, ma non ha indossato la maschera… per ora.\n\n🎯 Obiettivi:\nTrovare il pennello magico del grande maestro Ulises. Domingo parlava spesso, e con grande reverenza, di un pennello magico che gli fu, sfortunatamente, rubato durante la Guerra della Croce. Con l'aiuto della Sorte di Francesca, Inés potrebbe ritrovarlo e restituirglielo. Scoprire il traditore che denuncia gli Obiezionisti alla Chiesa. Inés si è molto affezionata agli abitanti del suo paese e non vuole che accada loro alcun male, non importa quali siano le loro convinzioni religiose. Inoltre un simile traditore potrebbe denunciare anche Francesca, se scoprisse che è una Strega. Scovare l’agente dell’Inquisizione noto come “Il Pugno del Profeta” . Di recente, hanno cominciato a circolare storie inquietanti su un agente dell'Inquisizione che terro - rizza la regione. Questo personaggio, che si fa chia - mare “Il Pugno del Profeta” , è uno dei nobili rimasti senza terre dopo la Guerra della Croce e, finora, ha dato lavoro ai boia di tutti i villaggi dove è comparso. Si vocifera che le proprietà confiscate vadano a rimpolpare il suo forziere e non quelli della Chiesa.\n\n🎭 Consigli di Interpretazione (Giocare Inés Maldonado):\nInés può essere molto schietta ma, se questa fran - chezza dovesse offendere qualcuno, tenta subito di alleggerire l'atmosfera con una battuta. Ha una vita - lità contagiosa e la si può trovare al centro di ogni festa o evento. Quando dipinge, concentra questa energia febbrile sulla tela. Inés dà grande importanza alla comunità e la protegge in ogni modo possibile. Quando è di fronte a una minaccia tenta sempre di osservare e informarsi prima di passare alle armi.",
        "pcData": {
            "name": "Inés Maldonado",
            "nation": "Castille",
            "concept": "Eroi Lesti • Castille",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 2,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 1,
                "Convincere": 2,
                "Empatia": 3,
                "Esibirsi": 2,
                "Furto": 0,
                "Intimidire": 1,
                "Istruzione": 3,
                "Mira": 0,
                "Mischia": 3,
                "Nascondersi": 1,
                "Navigazione": 0,
                "Notare": 0,
                "Rissa": 0
            },
            "advantages": [
                "Affascinare",
                "Amicizie Altolocate",
                "Mecenate",
                "Schermidore",
                "Sorriso Disarmante",
                "Studioso di Lotta: Finta (vedi sotto)"
            ],
            "virtue": "Virtù: Gli Amanti Appassionata. L’Eroe può attivare questa Virtù per negare le Ferite subite da un altro Eroe nel momento in cui vengono inflitte. Chi attiva la Virtù subisce invece una Ferita Drammatica automatica.",
            "hubris": "Hubris: Il Diavolo Fiducioso. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato. Studioso di Lotta (3 Punti) L’Eroe apprende le Manovre Fendente, Parata e una terza a sua scelta non appartenente a uno Stile e può eseguirle come se fosse un Duellante. Il vantaggio Sala d’Armi costa solo 3 Punti per lui.",
            "peculiarities": "Artista. Ottiene un Punto Eroe ogni volta che si sacrifica per rendere Théah un luogo più bello. Diestro. Ottiene un Punto Eroe ogni volta che sconfigge un duellante addestrato.",
            "story": "La vita della nobiltà Castilliana può sembrare ecci - tante ai contadini che faticano nel fango per nutrire le proprie famiglie, ma questa non è l'esperienza di Inés Maldonado. Figlia di aristocratici senza terra che vivevano presso la magione di uno zio ricco, Inés non fu mai il tipo da restare seduta a chiacchierare ma, non avendo terre di proprietà, sembrava che nessuno si aspettasse altro da lei. Per sfogare questa energia e creatività divenne apprendista del celebre pittore Domingo T omás Aldana. Una sera, Inés si trovò costretta a un'altra soffocante occasione formale e stava pianificando di provocare un innocuo duello tra suo fratello e l'ospite per ravvivare una serata tanto soporifera. I suoi piani svanirono non appena entrò nella sala Francesca, una donna dalla carna - gione molto chiara, magra e abbigliata con un abito da cortigiana V odacce dai colori sgargianti, con una maschera nera a coprirle il volto, a parte per gli occhi grigi e delicati e le labbra rosso acceso. Inés raccolse tutto il suo coraggio, si avvicinò e le chiese un ballo. Danzarono per tutta la notte. Il mattino seguente, quando Inés entrò nella bottega di mastro Domingo, pallida per la stanchezza e con gli occhi cerchiati, lui si limitò a una complice strizzatina d'occhio, le mise un pennello in mano e la lasciò sola con la tela bianca. Quando tornò alla sera la trovò addormentata su una sedia accanto al suo primo vero capolavoro. Queste prime frivole scappatelle divennero un legame forte e molto intimo. Francesca confidò a Inés di essere per nascita una Strega del Fato, non una cortigiana, e che la sua identità era un inganno molto elaborato creato da una società segreta: le Figlie di Sofia. Grazie a loro, Francesca era fuggita da V odacce e dalle grinfie dei suoi futuri suoceri, che la incolpa- vano della sfortunata morte del fidanzato. T emendo che la corte fosse un luogo troppo pericoloso, le due amanti si lasciarono tutto alle spalle e cominciarono una nuova vita nella campagna Castilliana. Vivendo nella loro villetta, Inés scoprì l'amore per la sua patria. I contadini di Castille, non la nobiltà, erano la sua gente, una popolazione tanto dinamica che persino la siesta era un momento ricolmo di attività. Quando l'Inquisizione giunse a minacciare questa sua nuova felicità, Inés impugnò la spada per difen- derla. Di recente è entrata in contatto con un'organiz- zazione chiamata “Los V agabundos” . La loro causa la attrae, ma non ha indossato la maschera… per ora.",
            "objectives": "Trovare il pennello magico del grande maestro Ulises. Domingo parlava spesso, e con grande reverenza, di un pennello magico che gli fu, sfortunatamente, rubato durante la Guerra della Croce. Con l'aiuto della Sorte di Francesca, Inés potrebbe ritrovarlo e restituirglielo. Scoprire il traditore che denuncia gli Obiezionisti alla Chiesa. Inés si è molto affezionata agli abitanti del suo paese e non vuole che accada loro alcun male, non importa quali siano le loro convinzioni religiose. Inoltre un simile traditore potrebbe denunciare anche Francesca, se scoprisse che è una Strega. Scovare l’agente dell’Inquisizione noto come “Il Pugno del Profeta” . Di recente, hanno cominciato a circolare storie inquietanti su un agente dell'Inquisizione che terro - rizza la regione. Questo personaggio, che si fa chia - mare “Il Pugno del Profeta” , è uno dei nobili rimasti senza terre dopo la Guerra della Croce e, finora, ha dato lavoro ai boia di tutti i villaggi dove è comparso. Si vocifera che le proprietà confiscate vadano a rimpolpare il suo forziere e non quelli della Chiesa.",
            "quote": "“La mia musa mi ha aperto gli occhi all’amore e grazie a lei ho ritrovato la passione per la mia bella Castille. La dipingerò con colori vibranti e la difenderò dalla corruzione con la punta della spada.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 2, Acume 3, Panache 3 • Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro. • Hubris: Il Profeta Fanatico. L’Eroe riceve un Punto Eroe quando difende vigorosamente le sue idee nel posto o nel momento sbagliato.",
        "ability": "«“E allora il coboldo con tre gambe disse… Bene, non ci ascoltano più. Ecco il mio piano per derubare il carro dell’esattore delle tasse e restituire il denaro al popolo.”»\n\nVantaggi: Cameratismo, Fama: Babbeo, Non Siamo Poi Tanto Diversi…, Ricco, Scafato, Sorriso Disarmante\n\nPeculiarità: Aristocratico. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Fuorilegge. Ottiene un Punto Eroe ogni volta che viola la legge per uno scopo nobile.",
        "notes": "«“E allora il coboldo con tre gambe disse… Bene, non ci ascoltano più. Ecco il mio piano per derubare il carro dell’esattore delle tasse e restituire il denaro al popolo.”»\nArchetipo: Eroi Lesti\n\n📖 Storia:\nCaius è il figlio bastardo di Marcus de Bello, ma è anche l' unico. Dopo un matrimonio senza discendenti, durato sette anni, e numerose relazioni, la moglie di Marcus morì ancora giovane e questi adottò ufficialmente Caius. Dopo tutto, crescere un figlio bastardo era meglio che non avere alcun erede. All'epoca, Caius aveva appena cinque anni, non rivide mai più sua madre e tutto ciò che gli rimane di lei sono i ricordi delle ninna nanne e del suo abbraccio. Gli manca ancora terribilmente e, sebbene Marcus gli abbia ripetuto negli anni che la madre era una cortigiana e che è morta, Caius sospetta che questa sia una bugia. Caius avrebbe dovuto rendere il padre orgoglioso, ma sembra fare l'esatto contrario: beve, gioca d'azzardo e ha numerose amanti. La sua pessima reputazione si è diffusa in fretta tra i nobili e Marcus avrebbe grosse difficoltà a trovare un impiego onorevole per suo figlio, se Caius mostrasse mai simili inclinazioni. Questo disonore ha fatto sì che il padre ignorasse Caius, lasciandogli la libertà di dedicarsi alla sua causa. Caius è un fervente egualitario che sfrutta la sua posi- zione privilegiata per proteggere i popolani di V odacce dai nobili capricciosi: avverte i lavoratori indebitati dell'ar- rivo degli esattori, fa fuggire dalla città le cortigiane che hanno fatto adirare la persona sbagliata e dona un sacco di denaro (proveniente sia dalle sue vincite che dalla sua diaria) ai poveri per pagare i conti. Ha persino imbrac- ciato le armi per difenderli sotto il nome di “Il Crociato Mascherato” . Per quanto sembri folle, indossa davvero una maschera e il popolo ha cominciato a chiamarlo così. Il Crociato Mascherato è ormai una figura popolare nelle canzoni, nei racconti e, addirittura, in una serie di romanzi d'ap- pendice, nei quali salva numerosi uomini e donne sfortu- nati. Caius ama particolarmente questi ultimi e legge ad alta voce le parti più sboccate agli amici che conoscono la sua doppia vita. Ha avuto un figlio, Amedeo, con una cortigiana chia- mata Caterina. Sebbene la loro relazione sia finita da tempo, i due restano ottimi amici e si occupano assieme del neonato. Caterina si preoccupa di crescerlo, qualcosa per cui Caius è troppo irresponsabile, mentre lui paga per abiti, libri e insegnanti. Visita il piccolo ogni volta che può, ma lo tiene nascosto a Marcus, per evitare che lo sottragga alla madre come ha fatto con lui a suo tempo. Caterina sa del Crociato Mascherato, ma non intende usare questa informazione contro Caius, neppure se lui decidesse di non aiutare più il figlio.\n\n🎯 Obiettivi:\nConvincere il Principe Vestini a intro- durre la rappresentanza popolare. Caius crede che avere parte nei processi decisionali e nei profitti renda i lavoratori più leali e produttivi. Ne ha discusso animatamente con il Principe V estini, che non ne è convinto, a differenza del suo quartogenito Calero. I due giovani hanno chiesto al Principe il permesso di fare un esperimento con un piccolo gruppo. Divenire il più grande maestro dello stile Ambrogia mai visto. Caius è orgoglioso di tre cose: la sua abilità come amante, la sua resistenza all'alcol e la sua abilità con la spada. È già una buona lama, ma desidera adde - strarsi personalmente con V eronica Ambrogia. Lei ha rifiutato categoricamente di allenare un tale “pagliaccio” e Caius sta pensando di confessarle la verità. Trovare il vero amore in un cuore nobile che accetti suo figlio. Caius è un romantico senza speranza che sogna di innamorarsi alla follia e mettere su casa con l'amore della sua vita. Non ha preferenze di donne o uomini, ma chiunque venga considerato dovrà essere un buon genitore per Amedeo.\n\n🎭 Consigli di Interpretazione (Giocare Caius de Bello):\nRaramente si vede Caius in pubblico senza un bicchiere in mano e un affascinante accompagnatore, o accom- pagnatrice, sottobraccio. Nonostante abbia davvero un problema con il bere, gli piace estremizzarlo in modo che i suoi nemici lo sottovalutino; è deliberatamente rumoroso e spaccone ai limiti della stupidità. Getta questa maschera solo quando si trova con i suoi alleati e allora parla eloquentemente del bisogno di rivolu- zionare il Paese e di abolire le ineguaglianze. Caius passa molto tempo in compagnia di cortigiane colte e indipendenti e ciò lo ha reso cieco verso il sessismo ed è convinto che risolvere i conflitti tra classi sia la panacea universale.",
        "pcData": {
            "name": "Caius de Bello",
            "nation": "Vodacce",
            "concept": "Eroi Lesti • Vodacce",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 2,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 1,
                "Convincere": 2,
                "Empatia": 3,
                "Esibirsi": 0,
                "Furto": 2,
                "Intimidire": 1,
                "Istruzione": 1,
                "Mira": 2,
                "Mischia": 3,
                "Nascondersi": 3,
                "Navigazione": 0,
                "Notare": 0,
                "Rissa": 0
            },
            "advantages": [
                "Cameratismo",
                "Fama: Babbeo",
                "Non Siamo Poi Tanto Diversi…",
                "Ricco",
                "Scafato",
                "Sorriso Disarmante"
            ],
            "virtue": "Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro.",
            "hubris": "Hubris: Il Profeta Fanatico. L’Eroe riceve un Punto Eroe quando difende vigorosamente le sue idee nel posto o nel momento sbagliato.",
            "peculiarities": "Aristocratico. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Fuorilegge. Ottiene un Punto Eroe ogni volta che viola la legge per uno scopo nobile.",
            "story": "Caius è il figlio bastardo di Marcus de Bello, ma è anche l' unico. Dopo un matrimonio senza discendenti, durato sette anni, e numerose relazioni, la moglie di Marcus morì ancora giovane e questi adottò ufficialmente Caius. Dopo tutto, crescere un figlio bastardo era meglio che non avere alcun erede. All'epoca, Caius aveva appena cinque anni, non rivide mai più sua madre e tutto ciò che gli rimane di lei sono i ricordi delle ninna nanne e del suo abbraccio. Gli manca ancora terribilmente e, sebbene Marcus gli abbia ripetuto negli anni che la madre era una cortigiana e che è morta, Caius sospetta che questa sia una bugia. Caius avrebbe dovuto rendere il padre orgoglioso, ma sembra fare l'esatto contrario: beve, gioca d'azzardo e ha numerose amanti. La sua pessima reputazione si è diffusa in fretta tra i nobili e Marcus avrebbe grosse difficoltà a trovare un impiego onorevole per suo figlio, se Caius mostrasse mai simili inclinazioni. Questo disonore ha fatto sì che il padre ignorasse Caius, lasciandogli la libertà di dedicarsi alla sua causa. Caius è un fervente egualitario che sfrutta la sua posi- zione privilegiata per proteggere i popolani di V odacce dai nobili capricciosi: avverte i lavoratori indebitati dell'ar- rivo degli esattori, fa fuggire dalla città le cortigiane che hanno fatto adirare la persona sbagliata e dona un sacco di denaro (proveniente sia dalle sue vincite che dalla sua diaria) ai poveri per pagare i conti. Ha persino imbrac- ciato le armi per difenderli sotto il nome di “Il Crociato Mascherato” . Per quanto sembri folle, indossa davvero una maschera e il popolo ha cominciato a chiamarlo così. Il Crociato Mascherato è ormai una figura popolare nelle canzoni, nei racconti e, addirittura, in una serie di romanzi d'ap- pendice, nei quali salva numerosi uomini e donne sfortu- nati. Caius ama particolarmente questi ultimi e legge ad alta voce le parti più sboccate agli amici che conoscono la sua doppia vita. Ha avuto un figlio, Amedeo, con una cortigiana chia- mata Caterina. Sebbene la loro relazione sia finita da tempo, i due restano ottimi amici e si occupano assieme del neonato. Caterina si preoccupa di crescerlo, qualcosa per cui Caius è troppo irresponsabile, mentre lui paga per abiti, libri e insegnanti. Visita il piccolo ogni volta che può, ma lo tiene nascosto a Marcus, per evitare che lo sottragga alla madre come ha fatto con lui a suo tempo. Caterina sa del Crociato Mascherato, ma non intende usare questa informazione contro Caius, neppure se lui decidesse di non aiutare più il figlio.",
            "objectives": "Convincere il Principe Vestini a intro- durre la rappresentanza popolare. Caius crede che avere parte nei processi decisionali e nei profitti renda i lavoratori più leali e produttivi. Ne ha discusso animatamente con il Principe V estini, che non ne è convinto, a differenza del suo quartogenito Calero. I due giovani hanno chiesto al Principe il permesso di fare un esperimento con un piccolo gruppo. Divenire il più grande maestro dello stile Ambrogia mai visto. Caius è orgoglioso di tre cose: la sua abilità come amante, la sua resistenza all'alcol e la sua abilità con la spada. È già una buona lama, ma desidera adde - strarsi personalmente con V eronica Ambrogia. Lei ha rifiutato categoricamente di allenare un tale “pagliaccio” e Caius sta pensando di confessarle la verità. Trovare il vero amore in un cuore nobile che accetti suo figlio. Caius è un romantico senza speranza che sogna di innamorarsi alla follia e mettere su casa con l'amore della sua vita. Non ha preferenze di donne o uomini, ma chiunque venga considerato dovrà essere un buon genitore per Amedeo.",
            "quote": "“E allora il coboldo con tre gambe disse… Bene, non ci ascoltano più. Ecco il mio piano per derubare il carro dell’esattore delle tasse e restituire il denaro al popolo.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 3, Acume 3, Panache 2 • Virtù: Il Glifo Mite. Attivando questa Virtù, l’Eroe impedisce a qualsiasi effetto magico (Stregoneria, Artefatti, Mostri ecc.) di avere effetto su di lei. • Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito. Stregoneria Lilly è l’incarnazione di Cenhelm, l’Astuto. Il suo Tratto Maggiore è Grazia, il Minore è Acume. Conosce gli Incanti Maggiori Leggendario (Grado 1) e Primo (Grado 1); gli Incanti Minori Eroico (Grado 2) e Evocare Sidhe (Grado 2).",
        "ability": "«“Mi dispiace, ma non sono la persona migliore per gestire i Sidhe — Un attimo. È tuo figlio quello che sento nell’altra stanza? Va bene, ti aiuterò.”»\n\nVantaggi: Aggressione Sconsiderata, La Fortuna del Diavolo, Mano Lesta, Mercanteggiare, Minuta, Senso dell’Orientamento, Stregoneria: Cavaliere di Avalon 2\n\nPeculiarità: Cavaliere Errante. Ottiene un Punto Eroe ogni volta che sostiene un ideale di virtù cavalleresca e finisce nei guai per questo. Orfana. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo.",
        "notes": "«“Mi dispiace, ma non sono la persona migliore per gestire i Sidhe — Un attimo. È tuo figlio quello che sento nell’altra stanza? Va bene, ti aiuterò.”»\nArchetipo: Eroi Lesti\n\n📖 Storia:\nLa vicenda di Lilly cominciò molto prima della sua nascita, quando un gruppo di predoni V esten giunse dopo un durissimo inverno ed Eva, sua madre, fu posta di fronte a una scelta impossibile: condannare a morte la famiglia o fare un patto col diavolo. Una fata le offrì aiuto per scon- figgere i predoni, in cambio del suo futuro secondogenito. Eva pensò di poterla ingannare avendo solo un figlio. Gli anni passarono ed Eva ebbe un bambino, che morì mentre era ancora in fasce. Desiderandone disperatamente un altro e sperando che la Sidhe si fosse dimenticata del patto, Eva ebbe un altro figlio. Appena un giorno dopo, un Sidhe si presentò, nascosto dalla pioggia e dall'oscurità, strappò il piccolo dalle braccia della madre e le lasciò una changeling con una voglia a forma di mezzaluna. Lilly, una changeling abbandonata presso una famiglia non sua, crebbe confusa e arrabbiata. Per molti anni rimase convinta di non essere umana, ma non esibendo nessuna delle debolezza comuni delle fate era incerta sulla propria natura. I suoi genitori l' amavano, ma la sua anima era inquieta. La sua vera patria la chiamava nel sonno e i suoi sogni erano tutti ambientati nell'eterno tramonto delle terre dei Sidhe. Scappò molte volte, viaggiando con vagabondi e truffatori, solo per tornare sempre a casa. Una notte, presso un crocevia, incontrò un uomo incredibilmente alto, rinchiuso in una gabbia di ferro, che la implorò: “Liberami, cugina.” Fu allora che Lilly comprese. Da allora non è più tornata a casa, preoccupata che la famiglia possa leggere la verità nel suo sguardo. Lilly ha paura di ciò che è. I Sidhe sono difensori di Inismore, ma anche demoni e rapitori di bambini. E se lei fosse uno di questi ultimi? Questo timore la spinge ad appellarsi al bene, a non mentire (anche se a volte omette delle informazioni) e a non rubare. Ha una voce incredi- bile e si presenta come bardo girovago. Evita gli scontri e non ha mai alzato le mani su un altro Inish, preferendo risolvere i problemi con azioni rapide e furtive. Molti sottovalutano questa piccola donna disarmata, ma nume- rosi contadini sono giunti ad appoggiarsi a lei. Quando sono minacciati mandano un messaggio alla Locanda del Cervo V erde e Lilly corre sempre in loro aiuto. Lilly ha una certa reputazione per la sua abilità nel trattare con i Sidhe. Non è certa del motivo, ma sembra trovarsi sempre nel mezzo delle loro macchinazioni. Questo è tanto evidente che la sua compagna Rhoswen la chiama “magnete per fate” , ma Lilly non lo trova divertente. È un'esperta nel negoziare accordi favorevoli con i Seelie e nello scacciare gli Unseelie.\n\n🎯 Obiettivi:\nScoprire la verità sul consigliere Sidhe di Hugh Monaghan. Lilly sospetta che vi sia un patto nefando tra un Sidhe e Hugh Monaghan, un brigante locale che sta diven- tando sempre più potente. Non sa che il Sidhe è in realtà uno dei suoi genitori e prigioniero di Monaghan. Quest'ultimo ha messo in giro le voci proprio per atti- rarla e usarla per ricattare il Sidhe. Aprire un portale verso Bryn Bresail per apprendere informazioni sui Sidhe. In passato, Lilly ha incontrato un Sidhe Seelie che l' ha invitata a “casa” , a Bryn Bresail. All'epoca rifiutò cortesemente, ma ora ci sta ripensando. Vuole saperne di più su Bryn Bresail e i suoi abitanti, specie la loro vera natura, ma alle proprie condizioni. Scoprire il significato della voglia a mezzaluna sulla sua mano. Da tempo, Lilly percepisce che c'è qualcosa di strano nella sua voglia. Non ne è consapevole, ma la sua madre fatata l' ha marcata come protettrice del Graal e in ogni momento Lilly sente di dover essere al fianco della Regina Elaine. Se quest'ultima dovesse morire, Lilly dovrà prendere il Graal e consegnarlo al sicuro nelle mani del prossimo Sovrano di Avalon.\n\n🎭 Consigli di Interpretazione (Giocare Lilly Ó Tuama):\nLilly non è capace di restare ferma, viaggia conti - nuamente in lungo e in largo per le Isole Incantate e quando è costretta a restare seduta o in piedi si agita. Adora dormire all'aperto, ma non quando piove, perché la pioggia le porta sogni di Bryn Bresail e questo la spaventa. T uttavia ama l'acqua e nuota ogni volta che può. Lilly ha numerosi amanti, ma la barista Rhoswen, figlia del padrone della Locanda del Cervo V erde, è l'unica a cui sente di appartenere.",
        "pcData": {
            "name": "Lilly Ó Tuama",
            "nation": "Inismore",
            "concept": "Eroi Lesti • Inismore",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 2
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 1,
                "Atletica": 1,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 3,
                "Esibirsi": 2,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 1,
                "Mira": 0,
                "Mischia": 1,
                "Nascondersi": 2,
                "Navigazione": 0,
                "Notare": 0,
                "Rissa": 2
            },
            "advantages": [
                "Aggressione Sconsiderata",
                "La Fortuna del Diavolo",
                "Mano Lesta",
                "Mercanteggiare",
                "Minuta",
                "Senso dell’Orientamento",
                "Stregoneria: Cavaliere di Avalon 2"
            ],
            "virtue": "Virtù: Il Glifo Mite. Attivando questa Virtù, l’Eroe impedisce a qualsiasi effetto magico (Stregoneria, Artefatti, Mostri ecc.) di avere effetto su di lei.",
            "hubris": "Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito. Stregoneria Lilly è l’incarnazione di Cenhelm, l’Astuto. Il suo Tratto Maggiore è Grazia, il Minore è Acume. Conosce gli Incanti Maggiori Leggendario (Grado 1) e Primo (Grado 1); gli Incanti Minori Eroico (Grado 2) e Evocare Sidhe (Grado 2).",
            "peculiarities": "Cavaliere Errante. Ottiene un Punto Eroe ogni volta che sostiene un ideale di virtù cavalleresca e finisce nei guai per questo. Orfana. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo.",
            "story": "La vicenda di Lilly cominciò molto prima della sua nascita, quando un gruppo di predoni V esten giunse dopo un durissimo inverno ed Eva, sua madre, fu posta di fronte a una scelta impossibile: condannare a morte la famiglia o fare un patto col diavolo. Una fata le offrì aiuto per scon- figgere i predoni, in cambio del suo futuro secondogenito. Eva pensò di poterla ingannare avendo solo un figlio. Gli anni passarono ed Eva ebbe un bambino, che morì mentre era ancora in fasce. Desiderandone disperatamente un altro e sperando che la Sidhe si fosse dimenticata del patto, Eva ebbe un altro figlio. Appena un giorno dopo, un Sidhe si presentò, nascosto dalla pioggia e dall'oscurità, strappò il piccolo dalle braccia della madre e le lasciò una changeling con una voglia a forma di mezzaluna. Lilly, una changeling abbandonata presso una famiglia non sua, crebbe confusa e arrabbiata. Per molti anni rimase convinta di non essere umana, ma non esibendo nessuna delle debolezza comuni delle fate era incerta sulla propria natura. I suoi genitori l' amavano, ma la sua anima era inquieta. La sua vera patria la chiamava nel sonno e i suoi sogni erano tutti ambientati nell'eterno tramonto delle terre dei Sidhe. Scappò molte volte, viaggiando con vagabondi e truffatori, solo per tornare sempre a casa. Una notte, presso un crocevia, incontrò un uomo incredibilmente alto, rinchiuso in una gabbia di ferro, che la implorò: “Liberami, cugina.” Fu allora che Lilly comprese. Da allora non è più tornata a casa, preoccupata che la famiglia possa leggere la verità nel suo sguardo. Lilly ha paura di ciò che è. I Sidhe sono difensori di Inismore, ma anche demoni e rapitori di bambini. E se lei fosse uno di questi ultimi? Questo timore la spinge ad appellarsi al bene, a non mentire (anche se a volte omette delle informazioni) e a non rubare. Ha una voce incredi- bile e si presenta come bardo girovago. Evita gli scontri e non ha mai alzato le mani su un altro Inish, preferendo risolvere i problemi con azioni rapide e furtive. Molti sottovalutano questa piccola donna disarmata, ma nume- rosi contadini sono giunti ad appoggiarsi a lei. Quando sono minacciati mandano un messaggio alla Locanda del Cervo V erde e Lilly corre sempre in loro aiuto. Lilly ha una certa reputazione per la sua abilità nel trattare con i Sidhe. Non è certa del motivo, ma sembra trovarsi sempre nel mezzo delle loro macchinazioni. Questo è tanto evidente che la sua compagna Rhoswen la chiama “magnete per fate” , ma Lilly non lo trova divertente. È un'esperta nel negoziare accordi favorevoli con i Seelie e nello scacciare gli Unseelie.",
            "objectives": "Scoprire la verità sul consigliere Sidhe di Hugh Monaghan. Lilly sospetta che vi sia un patto nefando tra un Sidhe e Hugh Monaghan, un brigante locale che sta diven- tando sempre più potente. Non sa che il Sidhe è in realtà uno dei suoi genitori e prigioniero di Monaghan. Quest'ultimo ha messo in giro le voci proprio per atti- rarla e usarla per ricattare il Sidhe. Aprire un portale verso Bryn Bresail per apprendere informazioni sui Sidhe. In passato, Lilly ha incontrato un Sidhe Seelie che l' ha invitata a “casa” , a Bryn Bresail. All'epoca rifiutò cortesemente, ma ora ci sta ripensando. Vuole saperne di più su Bryn Bresail e i suoi abitanti, specie la loro vera natura, ma alle proprie condizioni. Scoprire il significato della voglia a mezzaluna sulla sua mano. Da tempo, Lilly percepisce che c'è qualcosa di strano nella sua voglia. Non ne è consapevole, ma la sua madre fatata l' ha marcata come protettrice del Graal e in ogni momento Lilly sente di dover essere al fianco della Regina Elaine. Se quest'ultima dovesse morire, Lilly dovrà prendere il Graal e consegnarlo al sicuro nelle mani del prossimo Sovrano di Avalon.",
            "quote": "“Mi dispiace, ma non sono la persona migliore per gestire i Sidhe — Un attimo. È tuo figlio quello che sento nell’altra stanza? Va bene, ti aiuterò.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 2, Acume 2, Panache 4 • Virtù: Gli Amanti Appassionato. L’Eroe può attivare questa Virtù per negare le Ferite subite da un altro Eroe nel momento in cui vengono inflitte. Chi attiva la Virtù subisce invece una Ferita Drammatica automatica. • Hubris: Il Diavolo Fiducioso. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato.",
        "ability": "«“Abbiamo poche opzioni per procedere, ma vorrei incoraggiare i miei superiori a scegliere quella che porterà alla minor perdita di vite innocenti. Dubito che i nostri soldati siano pronti a disertare, ma seppellire dei bambini potrebbe spingerli a farlo.”»\n\nVantaggi: Bevitore Emerito, Cameratismo, Divincolarsi, Gambe da Marinaio, Lavorare sui Tetti, Riflessi Rapidi: Notare, Solo Contro Tutti\n\nPeculiarità: Esploratore. Ottiene un Punto Eroe ogni volta che posa lo sguardo su una vista che pochi o nessuno a Théah hanno mai potuto godere. Soldato. Ottiene un Punto Eroe ogni volta che segue il piano a prescindere dai rischi personali.",
        "notes": "«“Abbiamo poche opzioni per procedere, ma vorrei incoraggiare i miei superiori a scegliere quella che porterà alla minor perdita di vite innocenti. Dubito che i nostri soldati siano pronti a disertare, ma seppellire dei bambini potrebbe spingerli a farlo.”»\nArchetipo: Eroi Lesti\n\n📖 Storia:\nMilo era certo che in guerra non vi fosse posto per qualcuno come lui. Sin da piccolo, la famiglia e gli insegnanti applaudivano la sua natura gentile e compassionevole. Solo suo padre, un cavaliere riti - ratosi dopo una ferita al ginocchio, non sembrava apprezzarlo davvero. Dove il padre era forte e sfacciato, Milo era astuto e subdolo. Quando gli ufficiali dell' Empereur giunsero al loro villaggio per una coscrizione, il padre praticamente gettò Milo tra le braccia dei reclutatori. La guerra, pensava, avrebbe indurito quel suo figlio troppo mollaccione. Milo ubbidì, perché era suo padre, ma accettò anche l'idea di non sopravvivere. La morte lo sfiorò quando afferrò una granata Castilliana, caduta nella sua trincea, e la gettò via appena un attimo in ritardo. Perse una mano, ma questo non infranse il suo spirito. Era ancora l'uomo più amato della sua squadra, fisicamente deboluccio, ma pronto ad aiutare tutti quelli che lo circondavano. Si fece un nome come personaggio innocuo, ma retto, che non voleva sparare ai Castilliani, ma aiutava i compagni d'armi con tutto il cuore e tutta l'anima. L'unico a disapprovarlo era il comandante, Lord Bodin. Quando Milo perse la mano non batté ciglio e lo rispedì in trincea il giorno seguente, nonostante il rischio di cancrena. Questa fase oscura della vita militare di Milo, causata da Bodin, venne interrotta da Celeste de Villenc, una donna straordinaria che lo affascinò. Milo incontrò questa geniale stratega per caso una notte e la aiutò a gestire un'emicrania. Era una dura e un'ide- alista, proprio il suo opposto, ma entrambi si resero conto di completarsi. Si sposarono in segreto e non rivelarono la loro relazione fino alla fine delle ostilità. Oggi Milo e Celeste fanno parte della Società degli Esploratori. La loro “luna di miele lavorativa” li ha condotti in una dozzina dei porti più importanti del meridione di Théah dove Milo aiuta negli scavi e Celeste organizza la sicurezza. Il loro lavoro li conduce verso terre lontane, ma Milo ha intenzione di tornare nel luogo dove si sono conosciuti. Ha dei conti in sospeso laggiù.\n\n🎯 Obiettivi:\nMettere al sicuro l’orfano che ha salvato. Milo e Celeste trovarono Pancho disperato sul campo di una enorme battaglia. Il bambino parlava a mala- pena, ma si affezionò a loro come se fossero i suoi genitori. Pancho è terrorizzato da quello che ha visto e ha detto che tornare a Castille sarebbe per lui una condanna a morte. Milo e Celeste devono trovare qualcuno che si occupi di lui senza rivelare che hanno tenuto con loro il piccolo Castilliano, un atto che potrebbe essere considerato tradimento. Far congedare il suo sanguinario ex-comandate, Lord Bodin. Jean-Charles Bodin era tutto ciò che Milo temeva in un ufficiale Montaigne: avido e sanguinario, uccideva anche chi si era già arreso e vendeva in segreto come schiavi i prigionieri alla Compagnia Commerciale Atabeana. Durante la guerra, Celeste riuscì a far trasferire il marito sotto il proprio comando e perciò Milo non ha ancora le prove dei crimini di Bodin. Deve ottenerle senza che il Lord sappia di avere un nemico. Mettere al sicuro lo scavo di Tarago. La Società degli Esploratori ha messo gli occhi su una miniera a nord di T arago, una città devastata dalla guerra, dove, decenni or sono, furono trovati artefatti Syrneth. La miniera incredibilmente non è ancora crollata, ma pattuglie Montaigne e Castille continuano a scontrarsi nella regione.\n\n🎭 Consigli di Interpretazione (Giocare Milo de Villenc):\nMilo è ritroso, ma si illumina come il sole che emerge dalle nuvole quando è vicino a Celeste. Ha un carat- tere straordinario, ma non desidera la gloria. Quando affronta un bullo non è perché ama gli scontri, ma perché la sua coscienza non gli permetterebbe di fare altrimenti. Celeste sostiene che è questo a renderlo un eroe. Milo ha quell' attenzione verso il prossimo che rende possibile fare grandi cose: è sempre il primo a chiedere se tutti hanno ricevuto abbastanza acqua, a chi serva un' altra coperta o se qualcuno si è ripreso da un inci- dente. È attento a tutte quelle piccole necessità che gli altri ignorano quando sono concentrati su un obiettivo lontanissimo, ma che in realtà aiutano a raggiungerlo.",
        "pcData": {
            "name": "Milo de Villenc",
            "nation": "Montaigne",
            "concept": "Eroi Lesti • Montaigne",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 2,
                "Acume": 2,
                "Panache": 4
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 2,
                "Atletica": 1,
                "Cavalcare": 1,
                "Convincere": 3,
                "Empatia": 3,
                "Esibirsi": 0,
                "Furto": 0,
                "Intimidire": 1,
                "Istruzione": 0,
                "Mira": 1,
                "Mischia": 2,
                "Nascondersi": 2,
                "Navigazione": 1,
                "Notare": 3,
                "Rissa": 0
            },
            "advantages": [
                "Bevitore Emerito",
                "Cameratismo",
                "Divincolarsi",
                "Gambe da Marinaio",
                "Lavorare sui Tetti",
                "Riflessi Rapidi: Notare",
                "Solo Contro Tutti"
            ],
            "virtue": "Virtù: Gli Amanti Appassionato. L’Eroe può attivare questa Virtù per negare le Ferite subite da un altro Eroe nel momento in cui vengono inflitte. Chi attiva la Virtù subisce invece una Ferita Drammatica automatica.",
            "hubris": "Hubris: Il Diavolo Fiducioso. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato.",
            "peculiarities": "Esploratore. Ottiene un Punto Eroe ogni volta che posa lo sguardo su una vista che pochi o nessuno a Théah hanno mai potuto godere. Soldato. Ottiene un Punto Eroe ogni volta che segue il piano a prescindere dai rischi personali.",
            "story": "Milo era certo che in guerra non vi fosse posto per qualcuno come lui. Sin da piccolo, la famiglia e gli insegnanti applaudivano la sua natura gentile e compassionevole. Solo suo padre, un cavaliere riti - ratosi dopo una ferita al ginocchio, non sembrava apprezzarlo davvero. Dove il padre era forte e sfacciato, Milo era astuto e subdolo. Quando gli ufficiali dell' Empereur giunsero al loro villaggio per una coscrizione, il padre praticamente gettò Milo tra le braccia dei reclutatori. La guerra, pensava, avrebbe indurito quel suo figlio troppo mollaccione. Milo ubbidì, perché era suo padre, ma accettò anche l'idea di non sopravvivere. La morte lo sfiorò quando afferrò una granata Castilliana, caduta nella sua trincea, e la gettò via appena un attimo in ritardo. Perse una mano, ma questo non infranse il suo spirito. Era ancora l'uomo più amato della sua squadra, fisicamente deboluccio, ma pronto ad aiutare tutti quelli che lo circondavano. Si fece un nome come personaggio innocuo, ma retto, che non voleva sparare ai Castilliani, ma aiutava i compagni d'armi con tutto il cuore e tutta l'anima. L'unico a disapprovarlo era il comandante, Lord Bodin. Quando Milo perse la mano non batté ciglio e lo rispedì in trincea il giorno seguente, nonostante il rischio di cancrena. Questa fase oscura della vita militare di Milo, causata da Bodin, venne interrotta da Celeste de Villenc, una donna straordinaria che lo affascinò. Milo incontrò questa geniale stratega per caso una notte e la aiutò a gestire un'emicrania. Era una dura e un'ide- alista, proprio il suo opposto, ma entrambi si resero conto di completarsi. Si sposarono in segreto e non rivelarono la loro relazione fino alla fine delle ostilità. Oggi Milo e Celeste fanno parte della Società degli Esploratori. La loro “luna di miele lavorativa” li ha condotti in una dozzina dei porti più importanti del meridione di Théah dove Milo aiuta negli scavi e Celeste organizza la sicurezza. Il loro lavoro li conduce verso terre lontane, ma Milo ha intenzione di tornare nel luogo dove si sono conosciuti. Ha dei conti in sospeso laggiù.",
            "objectives": "Mettere al sicuro l’orfano che ha salvato. Milo e Celeste trovarono Pancho disperato sul campo di una enorme battaglia. Il bambino parlava a mala- pena, ma si affezionò a loro come se fossero i suoi genitori. Pancho è terrorizzato da quello che ha visto e ha detto che tornare a Castille sarebbe per lui una condanna a morte. Milo e Celeste devono trovare qualcuno che si occupi di lui senza rivelare che hanno tenuto con loro il piccolo Castilliano, un atto che potrebbe essere considerato tradimento. Far congedare il suo sanguinario ex-comandate, Lord Bodin. Jean-Charles Bodin era tutto ciò che Milo temeva in un ufficiale Montaigne: avido e sanguinario, uccideva anche chi si era già arreso e vendeva in segreto come schiavi i prigionieri alla Compagnia Commerciale Atabeana. Durante la guerra, Celeste riuscì a far trasferire il marito sotto il proprio comando e perciò Milo non ha ancora le prove dei crimini di Bodin. Deve ottenerle senza che il Lord sappia di avere un nemico. Mettere al sicuro lo scavo di Tarago. La Società degli Esploratori ha messo gli occhi su una miniera a nord di T arago, una città devastata dalla guerra, dove, decenni or sono, furono trovati artefatti Syrneth. La miniera incredibilmente non è ancora crollata, ma pattuglie Montaigne e Castille continuano a scontrarsi nella regione.",
            "quote": "“Abbiamo poche opzioni per procedere, ma vorrei incoraggiare i miei superiori a scegliere quella che porterà alla minor perdita di vite innocenti. Dubito che i nostri soldati siano pronti a disertare, ma seppellire dei bambini potrebbe spingerli a farlo.”"
        }
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
        "traits": "Vigore 3, Grazia 3, Risolutezza 3, Acume 2, Panache 2 • Virtù: La Strega Intuitivo. Attivando questa Virtù, l’Eroe può porre al GM una domanda con risposta sì/no riguardante un PNG. Il GM dovrà rispondere onestamente e, se possibile, aggiungere dettagli. • Hubris: L’Eroe Avventato. L’Eroe riceve un Punto Eroe quando la sua eccessiva sicurezza nell’agire mette nei guai lui e un altro.",
        "ability": "«“Non aver paura, ma ascolta gli dei! Il canto del fulmine e del tuono! Il canto del vento e dell’onda! Questo non è semplicemente il tempo, ma una preghiera! Gioiamo e uniamoci a questo coro!”»\n\nVantaggi: Fama: Selvaggio, Gambe da Marinaio, Oggetto Distintivo: Amuleto Runico Skald, Rissoso, Seidr, Vista d’Aquila\n\nPeculiarità: Marinaio. Ottiene un Punto Eroe ogni volta che mette da parte i suoi desideri per garantire la sicurezza o la comodità dei suoi compagni. Skald. Ottiene un Punto Eroe ogni volta che sfrutta la propria abilità di Seidr per aiutare un altro Eroe a risolvere un problema o sconfiggere un Malvagio.",
        "notes": "«“Non aver paura, ma ascolta gli dei! Il canto del fulmine e del tuono! Il canto del vento e dell’onda! Questo non è semplicemente il tempo, ma una preghiera! Gioiamo e uniamoci a questo coro!”»\nArchetipo: Eroi Lesti\n\n📖 Storia:\nReider Ness nacque a Kinsvarik, sulla costa settentrio- nale di V estenmennavenjar. Affascinato da sempre dalle leggende sugli dei, Reider strisciava fuori di casa nelle notti di tempesta per comunicare con il Padre di T utti. Il vento e le onde, il fulmine e il tuono incendiarono il suo cuore e definirono la sua personalità. Una notte, mentre stava comunicando con una tempesta parti- colarmente violenta, venne colpito da un fulmine. Si risvegliò con una visione del Padre di T utti, mentre il suo destino lo chiamava. Reider si alzò e felice come non mai iniziò la sua carriera di profeta, predicando in versi poetici. Il suo miglior amico era Gunnar Haftson. I due erano inseparabili sin da piccoli, avevano esplorato insieme i fiordi di Kinsvarik senza alcuna preoccupazione. Quando divennero adulti i loro destini li spinsero a unirsi alla flotta mercantile V endel. Lavoravano duro e bevevano moltissimo, mentre Reider urlava le sue preghiere agli dei durante le tempeste per ottenere un passaggio sicuro. Divenne ben presto una specie di portafortuna per molti mercanti e la sua fede era pari solo al suo eroismo. Reider affron- tava ogni sfida con allegria spavalda, che si trattasse di tuffarsi nel mezzo di una tempesta per salvare un compagno o affrontare da solo una dozzina di pirati. Le cose cominciarono a cambiare quando Gunnar incontrò Ilse, una ricca eiseniana fuggita dalla Guerra della Croce. Il cambiamento fu graduale, ma la fede Obiezionista di Ilse cominciò a intaccare quella di Gunnar. I due amici si scambiarono parole dure e pugni quando Gunnar tornò a Kinsvarik per sposare Ilse. Trascorsero gli anni e Reider incontrò un miste - rioso skald moribondo, che cantava di Aslaug e della Grande T empesta del Padre di T utti. Quando spirò, un fulmine cadde a Nord e Reider seppe che le sue parole erano vere. Reider tornò a Kinsvarik guidato dal canto dello skald per mostrare a Gunnar il potere del Padre di T utti, ma venne a sapere che il suo amico si era convertito all' Obiezionismo e aveva in mente di costruire una cappella. Reider si diresse alla taverna più vicina, deciso a mettere le cose in chiaro con la sua gente prima di partire per il Nord.\n\n🎯 Obiettivi:\nUsare le canzoni per fare coraggio al codardo Harlad. Il fratello di Reider, Harlad, è tutto il contrario di lui: un vigliacco spaventato dalla sua stessa ombra. Reider ha in mente di insegnargli cos'è il coraggio sul posto di vedetta di una nave V endel in una tempesta. Harlad sa che suo fratello lo sta cercando, ma è rapido a scappare. Scoprire le canzoni perdute degli dei. Aslaug è una skjaldmær (una fanciulla guerriera) dell'epoca delle leggende che si innamorò di un dio minore, che le insegnò una canzone di desiderio tanto potente da far svenire chiunque la udisse. Un giorno, l'amato di Aslaug navigò oltre l'orizzonte per non tornare mai più. Lei cantò la canzone finché la neve non la seppellì completamente. Gli dei ne ebbero pietà e la rinchiusero in un blocco di ghiaccio purissimo. La leggenda dice che chi la libererà con un canto di gioia e speranza otterrà la sua canzone, ma chi fallirà dovrà unirsi alla sua corte di ghiaccio. Reider è alla ricerca di una nave robusta e di un equipaggio coraggioso per ottenere questo premio. Osservare la miracolosa tempesta degli dei. Reider è alla ricerca della madre di tutte le tempeste, la tempesta del Padre di T utti. Si dice che questa comunione assoluta si trovi in cima al tetto del mondo e che incendi il cielo con strisce di fuoco. Si racconta che il luogo sia difeso da giganti di ghiaccio, serpenti con scaglie di ferro e fanciulle guerriere in armature d'argento, ma Reider non si farà fermare.\n\n🎭 Consigli di Interpretazione (Giocare Reider Ness):\nReider Ness detesta la sottigliezza e il silenzio in egual misura. È sempre orgoglioso, rumoroso e non sopporta gli sciocchi. Il suo arrivo è come un fulmine, la sua presenza come un tuono. Ha un appetito vorace nei confronti della vita che si riflette in tutto ciò che fa: affronta ogni viaggio come se fosse il primo, ogni boccale come se fosse l'ultimo e dedica ogni canzone al Padre di T utti. Reider Ness vive rumorosamente come se non ci fosse un domani.",
        "pcData": {
            "name": "Reider Ness",
            "nation": "Vestenmennavenjar",
            "concept": "Eroi Lesti • Vestenmennavenjar",
            "traits": {
                "Vigore": 3,
                "Grazia": 3,
                "Risolutezza": 3,
                "Acume": 2,
                "Panache": 2
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 0,
                "Convincere": 1,
                "Empatia": 0,
                "Esibirsi": 3,
                "Furto": 0,
                "Intimidire": 3,
                "Istruzione": 1,
                "Mira": 0,
                "Mischia": 2,
                "Nascondersi": 0,
                "Navigazione": 2,
                "Notare": 2,
                "Rissa": 3
            },
            "advantages": [
                "Fama: Selvaggio",
                "Gambe da Marinaio",
                "Oggetto Distintivo: Amuleto Runico Skald",
                "Rissoso",
                "Seidr",
                "Vista d’Aquila"
            ],
            "virtue": "Virtù: La Strega Intuitivo. Attivando questa Virtù, l’Eroe può porre al GM una domanda con risposta sì/no riguardante un PNG. Il GM dovrà rispondere onestamente e, se possibile, aggiungere dettagli.",
            "hubris": "Hubris: L’Eroe Avventato. L’Eroe riceve un Punto Eroe quando la sua eccessiva sicurezza nell’agire mette nei guai lui e un altro.",
            "peculiarities": "Marinaio. Ottiene un Punto Eroe ogni volta che mette da parte i suoi desideri per garantire la sicurezza o la comodità dei suoi compagni. Skald. Ottiene un Punto Eroe ogni volta che sfrutta la propria abilità di Seidr per aiutare un altro Eroe a risolvere un problema o sconfiggere un Malvagio.",
            "story": "Reider Ness nacque a Kinsvarik, sulla costa settentrio- nale di V estenmennavenjar. Affascinato da sempre dalle leggende sugli dei, Reider strisciava fuori di casa nelle notti di tempesta per comunicare con il Padre di T utti. Il vento e le onde, il fulmine e il tuono incendiarono il suo cuore e definirono la sua personalità. Una notte, mentre stava comunicando con una tempesta parti- colarmente violenta, venne colpito da un fulmine. Si risvegliò con una visione del Padre di T utti, mentre il suo destino lo chiamava. Reider si alzò e felice come non mai iniziò la sua carriera di profeta, predicando in versi poetici. Il suo miglior amico era Gunnar Haftson. I due erano inseparabili sin da piccoli, avevano esplorato insieme i fiordi di Kinsvarik senza alcuna preoccupazione. Quando divennero adulti i loro destini li spinsero a unirsi alla flotta mercantile V endel. Lavoravano duro e bevevano moltissimo, mentre Reider urlava le sue preghiere agli dei durante le tempeste per ottenere un passaggio sicuro. Divenne ben presto una specie di portafortuna per molti mercanti e la sua fede era pari solo al suo eroismo. Reider affron- tava ogni sfida con allegria spavalda, che si trattasse di tuffarsi nel mezzo di una tempesta per salvare un compagno o affrontare da solo una dozzina di pirati. Le cose cominciarono a cambiare quando Gunnar incontrò Ilse, una ricca eiseniana fuggita dalla Guerra della Croce. Il cambiamento fu graduale, ma la fede Obiezionista di Ilse cominciò a intaccare quella di Gunnar. I due amici si scambiarono parole dure e pugni quando Gunnar tornò a Kinsvarik per sposare Ilse. Trascorsero gli anni e Reider incontrò un miste - rioso skald moribondo, che cantava di Aslaug e della Grande T empesta del Padre di T utti. Quando spirò, un fulmine cadde a Nord e Reider seppe che le sue parole erano vere. Reider tornò a Kinsvarik guidato dal canto dello skald per mostrare a Gunnar il potere del Padre di T utti, ma venne a sapere che il suo amico si era convertito all' Obiezionismo e aveva in mente di costruire una cappella. Reider si diresse alla taverna più vicina, deciso a mettere le cose in chiaro con la sua gente prima di partire per il Nord.",
            "objectives": "Usare le canzoni per fare coraggio al codardo Harlad. Il fratello di Reider, Harlad, è tutto il contrario di lui: un vigliacco spaventato dalla sua stessa ombra. Reider ha in mente di insegnargli cos'è il coraggio sul posto di vedetta di una nave V endel in una tempesta. Harlad sa che suo fratello lo sta cercando, ma è rapido a scappare. Scoprire le canzoni perdute degli dei. Aslaug è una skjaldmær (una fanciulla guerriera) dell'epoca delle leggende che si innamorò di un dio minore, che le insegnò una canzone di desiderio tanto potente da far svenire chiunque la udisse. Un giorno, l'amato di Aslaug navigò oltre l'orizzonte per non tornare mai più. Lei cantò la canzone finché la neve non la seppellì completamente. Gli dei ne ebbero pietà e la rinchiusero in un blocco di ghiaccio purissimo. La leggenda dice che chi la libererà con un canto di gioia e speranza otterrà la sua canzone, ma chi fallirà dovrà unirsi alla sua corte di ghiaccio. Reider è alla ricerca di una nave robusta e di un equipaggio coraggioso per ottenere questo premio. Osservare la miracolosa tempesta degli dei. Reider è alla ricerca della madre di tutte le tempeste, la tempesta del Padre di T utti. Si dice che questa comunione assoluta si trovi in cima al tetto del mondo e che incendi il cielo con strisce di fuoco. Si racconta che il luogo sia difeso da giganti di ghiaccio, serpenti con scaglie di ferro e fanciulle guerriere in armature d'argento, ma Reider non si farà fermare.",
            "quote": "“Non aver paura, ma ascolta gli dei! Il canto del fulmine e del tuono! Il canto del vento e dell’onda! Questo non è semplicemente il tempo, ma una preghiera! Gioiamo e uniamoci a questo coro!”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 3, Acume 2, Panache 3 • Virtù: La Ruota Fortunato. L’Eroe può attivare questa Virtù per ritardare un’Opportunità o una Conseguenza di 1 Azione. • Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
        "ability": "«“Ebbene, vedete, è una storiella divertente. C’erano tre guardie, non una, e non le ho prese a pugni, sono cadute tutte di faccia quando le ho fatte inciampare con un pezzo di corda. Chiunque può battere un avversario goffo con un po’ di astuzia.”»\n\nVantaggi: Colosso, Compagno Fidato: Mishka, Ispirare Generosità, Pugilatore, Sguardo di Ghiaccio, Virtuoso: Lotta Libera\n\nPeculiarità: Intrattenitore. Ottiene un Punto Eroe ogni volta che usa le sue abilità per qualcosa di più del semplice guadagno. Pugile. Ottiene un Punto Eroe ogni volta che getta le armi e si affida ai pugni, a prescindere dall’arma- mento dell’avversario.",
        "notes": "«“Ebbene, vedete, è una storiella divertente. C’erano tre guardie, non una, e non le ho prese a pugni, sono cadute tutte di faccia quando le ho fatte inciampare con un pezzo di corda. Chiunque può battere un avversario goffo con un po’ di astuzia.”»\nArchetipo: Eroi Lesti\n\n📖 Storia:\nIl freddo inverno ussurano scorre nelle vene di Stanimir. Ciò che farebbe morire congelati altri lo spinge a muoversi, lo rende agile e lo riscalda. Stanimir è un artista par excellence, come proclamava un manifesto di Montaigne, che ogni sera si esibisce per stupire e impressionare il pubblico del circo itine- rante ereditato da sua madre Darya. La sua casa e il suo cuore sono sempre stati il circo, una banda mal assortita di personaggi riuniti dal talento e dalle circostanze. Non avendo altri parenti che sua madre, questi artisti sono divenuti la sua fami- glia a cui mancava un solo ruolo: il padre. I racconti che Darya faceva del padre di Stanimir sembravano più favole che realtà. Si erano incontrati mentre viaggiavano per Ussura, lui aveva chiesto di entrare nel circo e, data la sua abilità, era stato accolto. Il loro amore era stato immediato, elettrizzante, del genere che afferra un cuore e non lo lascia più andare. Quando lui annunciò che sarebbe tornato ad Ifri per chiedere alla famiglia il permesso di sposare Darya, lei ne fu felicissima. Se ne andò in una notte nevosa e non tornò mai più. T utto ciò che rimase a Darya del suo amore fu un tatuaggio a forma di cuore, identico a quello di lui, e il bambino nel suo ventre. Ancora oggi, Darya insiste che lui tornerà e si rifiuta di pronunciare il suo nome finché non l'avrà rivisto. Il loro amore era reale e l'unico motivo per il mancato ritorno è che gli sia accaduto qualcosa di terribile. La madre di Stanimir è una donna saggia e il figlio non è tipo da contraddirla, per cui ha fatto in modo di diventare un uomo di cui suo padre possa essere fiero. Oltre ad avere preso il posto del padre nel numero della lotta con gli orsi, ha cominciato a compiere azioni da eroe. T utto ebbe inizio quando lui e il suo orso, Mishka, impedirono a un gruppo di banditi di rapinare una famiglia lungo la strada. Alla vista del padre minacciato, Stanimir si gettò nella mischia per evitare che i due bambini crescessero come lui. Poche settimane dopo impedì una seconda rapina. Dopo questi due episodi, il circo di Stanimir divenne il luogo dove la gente non andava solo per divertirsi, ma anche per chiedere l'aiuto del direttore e del suo orso.\n\n🎯 Obiettivi:\nTrovare un totem che gli permetta di parlare con gli animali. Stanimir è ora direttore del circo, ma ogni sera si presenta sulla pista per affrontare Mishka. A volte vince, a volte no, ma è ormai una tradizione. Spesso, mentre la folla applaude, Stanimir vede un certo sguardo, un'intelligenza negli occhi dell'orso. Trovare un totem che gli permetta di parlare con gli animali non solo migliorerebbe il suo numero, ma gli consen- tirebbe di comunicare con il suo vecchio amico. Lottare con l’uomo più forte di Théah. Molti uomini lottano solo con la pura forza bruta, ma Stanimir sa che è soprattutto una questione di rapidità e gioco di gambe. Ha sentito parlare di un avaloniano tanto forte da aver trascinato una nave fuori dall'acqua. Stanimir vuole affrontarlo per vedere se la rapidità può battere la forza. Esibirsi davanti allo Zar. Il circo di Stanimir sta guadagnando notorietà, ma per lui non è ancora abbastanza. Esibirsi di fronte allo Zar (o Zarina) sarebbe un grande onore e un sogno che vorrebbe veder realizzato prima che sua madre muoia.\n\n🎭 Consigli di Interpretazione (Giocare Stanimir Buscov):\nStanimir è un gigante dai piedi lesti. Ha una figura atletica e riflessi fulminei, che ne fanno un ussurano molto affascinante. È consapevole del suo bell'aspetto e non si fa problemi a togliersi d'impaccio con un sorriso, un comportamento che irriterebbe molti, se non fosse per il suo buon cuore. Nonostante il suo ego, a volte, abbia la meglio, Stanimir ha sempre le migliori intenzioni. È profondamente sensibile e mette sempre i bisogni degli altri prima dei propri.",
        "pcData": {
            "name": "Stanimir Buscov",
            "nation": "Ussura",
            "concept": "Eroi Lesti • Ussura",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 3,
                "Acume": 2,
                "Panache": 3
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 0,
                "Atletica": 3,
                "Cavalcare": 1,
                "Convincere": 2,
                "Empatia": 3,
                "Esibirsi": 3,
                "Furto": 1,
                "Intimidire": 0,
                "Istruzione": 1,
                "Mira": 0,
                "Mischia": 0,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 3
            },
            "advantages": [
                "Colosso",
                "Compagno Fidato: Mishka",
                "Ispirare Generosità",
                "Pugilatore",
                "Sguardo di Ghiaccio",
                "Virtuoso: Lotta Libera"
            ],
            "virtue": "Virtù: La Ruota Fortunato. L’Eroe può attivare questa Virtù per ritardare un’Opportunità o una Conseguenza di 1 Azione.",
            "hubris": "Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
            "peculiarities": "Intrattenitore. Ottiene un Punto Eroe ogni volta che usa le sue abilità per qualcosa di più del semplice guadagno. Pugile. Ottiene un Punto Eroe ogni volta che getta le armi e si affida ai pugni, a prescindere dall’arma- mento dell’avversario.",
            "story": "Il freddo inverno ussurano scorre nelle vene di Stanimir. Ciò che farebbe morire congelati altri lo spinge a muoversi, lo rende agile e lo riscalda. Stanimir è un artista par excellence, come proclamava un manifesto di Montaigne, che ogni sera si esibisce per stupire e impressionare il pubblico del circo itine- rante ereditato da sua madre Darya. La sua casa e il suo cuore sono sempre stati il circo, una banda mal assortita di personaggi riuniti dal talento e dalle circostanze. Non avendo altri parenti che sua madre, questi artisti sono divenuti la sua fami- glia a cui mancava un solo ruolo: il padre. I racconti che Darya faceva del padre di Stanimir sembravano più favole che realtà. Si erano incontrati mentre viaggiavano per Ussura, lui aveva chiesto di entrare nel circo e, data la sua abilità, era stato accolto. Il loro amore era stato immediato, elettrizzante, del genere che afferra un cuore e non lo lascia più andare. Quando lui annunciò che sarebbe tornato ad Ifri per chiedere alla famiglia il permesso di sposare Darya, lei ne fu felicissima. Se ne andò in una notte nevosa e non tornò mai più. T utto ciò che rimase a Darya del suo amore fu un tatuaggio a forma di cuore, identico a quello di lui, e il bambino nel suo ventre. Ancora oggi, Darya insiste che lui tornerà e si rifiuta di pronunciare il suo nome finché non l'avrà rivisto. Il loro amore era reale e l'unico motivo per il mancato ritorno è che gli sia accaduto qualcosa di terribile. La madre di Stanimir è una donna saggia e il figlio non è tipo da contraddirla, per cui ha fatto in modo di diventare un uomo di cui suo padre possa essere fiero. Oltre ad avere preso il posto del padre nel numero della lotta con gli orsi, ha cominciato a compiere azioni da eroe. T utto ebbe inizio quando lui e il suo orso, Mishka, impedirono a un gruppo di banditi di rapinare una famiglia lungo la strada. Alla vista del padre minacciato, Stanimir si gettò nella mischia per evitare che i due bambini crescessero come lui. Poche settimane dopo impedì una seconda rapina. Dopo questi due episodi, il circo di Stanimir divenne il luogo dove la gente non andava solo per divertirsi, ma anche per chiedere l'aiuto del direttore e del suo orso.",
            "objectives": "Trovare un totem che gli permetta di parlare con gli animali. Stanimir è ora direttore del circo, ma ogni sera si presenta sulla pista per affrontare Mishka. A volte vince, a volte no, ma è ormai una tradizione. Spesso, mentre la folla applaude, Stanimir vede un certo sguardo, un'intelligenza negli occhi dell'orso. Trovare un totem che gli permetta di parlare con gli animali non solo migliorerebbe il suo numero, ma gli consen- tirebbe di comunicare con il suo vecchio amico. Lottare con l’uomo più forte di Théah. Molti uomini lottano solo con la pura forza bruta, ma Stanimir sa che è soprattutto una questione di rapidità e gioco di gambe. Ha sentito parlare di un avaloniano tanto forte da aver trascinato una nave fuori dall'acqua. Stanimir vuole affrontarlo per vedere se la rapidità può battere la forza. Esibirsi davanti allo Zar. Il circo di Stanimir sta guadagnando notorietà, ma per lui non è ancora abbastanza. Esibirsi di fronte allo Zar (o Zarina) sarebbe un grande onore e un sogno che vorrebbe veder realizzato prima che sua madre muoia.",
            "quote": "“Ebbene, vedete, è una storiella divertente. C’erano tre guardie, non una, e non le ho prese a pugni, sono cadute tutte di faccia quando le ho fatte inciampare con un pezzo di corda. Chiunque può battere un avversario goffo con un po’ di astuzia.”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 2, Acume 3, Panache 4 • Virtù: La Torre Umile. Attivando questa Virtù, l’Eroe riceverà 1 Punto Eroe aggiuntivo quando attiverà la sua Hubris o una delle sue Peculiarità. • Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
        "ability": "«“Un attimo del vostro tempo! Ho un boccale di birra per voi se mi racconterete quella divertente storiella che avete appena narrato al vostro amico…”»\n\nVantaggi: Affascinare, Amicizie Altolocate, Bevitore Emerito, Contatto: Nobiltà di Montaigne, Linguista, Mecenate: Alta Società, Senso dell’Orientamento, Virtuoso: Narratore\n\nPeculiarità: Artista. Ottiene un Punto Eroe ogni volta che si sacrifica per rendere Théah un luogo più bello. L’Ami du Roi. Ottiene un Punto Eroe ogni volta che sfrutta il favore del sovrano per risolvere un problema.",
        "notes": "«“Un attimo del vostro tempo! Ho un boccale di birra per voi se mi racconterete quella divertente storiella che avete appena narrato al vostro amico…”»\nArchetipo: Eroi Strateghi\n\n📖 Storia:\nLa verità su Adam Vide è fantastica quanto uno dei suoi romanzi. Adam nacque in una bellissima tenuta di campagna presso Rogne con il nome di Annabelle de Malencourt. Era una bambina vispa e curiosa che, nel rigido ambiente della famiglia V euvert, si sentiva costretta nel ruolo di figlia ubbidiente. Sognava, invece, il giorno in cui un galeone sarebbe venuto a prenderla per condurla verso una nuova vita dove avrebbe potuto seguire il suo cuore. Spesso raccontava a Guy, il fratello minore, che, alla prima occasione, gli avrebbe lasciato il titolo di erede e se ne sarebbe andata. Guy non le credette mai e ci furono molti aspri litigi per la successione. Annabelle si costruì con cura una seconda identità di narratore girovago e affinò il proprio talento esiben- dosi in locande e taverne sotto il nome di Adam Vide. Ben presto, Adam fu invitato a una competizione di narratori presso la corte del re. Quando salutò i suoi genitori, che nello stesso periodo erano stati incari - cati di una missione diplomatica segreta, promise che sarebbe tornato presto, pur sapendo che non lo avrebbe mai fatto. Le ultime parole che rivolse loro furono menzogne. Adam giunse a corte mentre le ostilità tra Castille e Montaigne erano al culmine e la gara era stata pensata proprio per distrarre l' Empereur e intrat - tenere i diplomatici stranieri. Adam si buttò nella competizione e vinse per acclamazione popolare. Il giorno seguente, tre uomini furono trascinati in catene di fronte al sovrano, accusati di avere venduto ai castilliani informazioni segrete riguardanti le rotte di viaggio di alcuni nobili diretti a negoziare la pace. T utti questi aristocratici, compresi i genitori di Adam, erano stati uccisi. Uno dei traditori era Guy. L' Empereur stava per condannarli a morte quando Adam si appellò alla clemenza della corte. Pregò Sua Maestà di esiliare Guy, rivelando solo al sovrano di essere l'erede dei V euvert. Promise tutte le terre della famiglia in cambio della vita del fratello. Il monarca, alla disperata ricerca di fondi per la guerra, accettò e Guy fu esiliato. Adam lasciò la corte lo stesso giorno e non è più tornato. Oggi Adam vive come un cantastorie errante. Si dedica completamente ai suoi racconti, scrivendo di come vede Théah: un continente che sta per entrare in una nuova era e una polveriera politica. Crede di poter ispirare, attraverso questi libri, altri a combattere e cambiare in meglio le loro vite. T uttavia, nel profondo del cuore, desidera trovare il fratello e scoprire perché ha tradito il suo re e il suo sangue.\n\n🎯 Obiettivi:\nRiunirsi con Guy, il fratello esiliato. Adam non riesce a comprendere perché Guy avrebbe tradito Montaigne e la loro famiglia a favore di Castille. Guy non ha dato alcuna spiegazione e Adam vuole fargli alcune domande importanti di persona. Ritrovare il suo libro di poesie rubate pubblicato sotto il nome di Férdéric Martin. Qualcuno colse l'occasione di una notte di bevute per derubare Adam della borsa e oggi un libro delle sue migliori composizioni è stato pubblicato a nome di questo tal Martin. Deve ritrovare l'originale per dimostrare la frode. Esibirsi per la corte dell’Empereur. Sono passati molti anni da quando Adam è stato a corte, ma continua a desiderare di essere sotto i riflet- tori. Il ritorno non sarà facile, ma deve fare giungere la sua ultima opera sulla realtà di Théah all'orecchio del Re Sole.\n\n🎭 Consigli di Interpretazione (Giocare Adam Vide):\nAdam è l'epitome di un Montaigne creativo e passio - nale, che ha scelto di seguire il suo cuore invece del suo dovere e ha abbandonato la famiglia. Ama bere, far festa e, soprattutto, una bella storia. Segue ogni avventura che pensa possa diventare un grande racconto e ama farsi nuovi amici che abbiano una bella scorta di avventure da narrare. La natura gioviale e il fascino di Adam nascondono le ombre degli intrighi che hanno distrutto la sua famiglia. Un giorno dovrà affrontare questi misteri per il suo bene e quello del nome dei V euvert.",
        "pcData": {
            "name": "Adam Vide",
            "nation": "Montaigne",
            "concept": "Eroi Strateghi • Montaigne",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 2,
                "Acume": 3,
                "Panache": 4
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 0,
                "Cavalcare": 1,
                "Convincere": 3,
                "Empatia": 3,
                "Esibirsi": 3,
                "Furto": 0,
                "Intimidire": 0,
                "Istruzione": 3,
                "Mira": 0,
                "Mischia": 2,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 3,
                "Rissa": 0
            },
            "advantages": [
                "Affascinare",
                "Amicizie Altolocate",
                "Bevitore Emerito",
                "Contatto: Nobiltà di Montaigne",
                "Linguista",
                "Mecenate: Alta Società",
                "Senso dell’Orientamento",
                "Virtuoso: Narratore"
            ],
            "virtue": "Virtù: La Torre Umile. Attivando questa Virtù, l’Eroe riceverà 1 Punto Eroe aggiuntivo quando attiverà la sua Hubris o una delle sue Peculiarità.",
            "hubris": "Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
            "peculiarities": "Artista. Ottiene un Punto Eroe ogni volta che si sacrifica per rendere Théah un luogo più bello. L’Ami du Roi. Ottiene un Punto Eroe ogni volta che sfrutta il favore del sovrano per risolvere un problema.",
            "story": "La verità su Adam Vide è fantastica quanto uno dei suoi romanzi. Adam nacque in una bellissima tenuta di campagna presso Rogne con il nome di Annabelle de Malencourt. Era una bambina vispa e curiosa che, nel rigido ambiente della famiglia V euvert, si sentiva costretta nel ruolo di figlia ubbidiente. Sognava, invece, il giorno in cui un galeone sarebbe venuto a prenderla per condurla verso una nuova vita dove avrebbe potuto seguire il suo cuore. Spesso raccontava a Guy, il fratello minore, che, alla prima occasione, gli avrebbe lasciato il titolo di erede e se ne sarebbe andata. Guy non le credette mai e ci furono molti aspri litigi per la successione. Annabelle si costruì con cura una seconda identità di narratore girovago e affinò il proprio talento esiben- dosi in locande e taverne sotto il nome di Adam Vide. Ben presto, Adam fu invitato a una competizione di narratori presso la corte del re. Quando salutò i suoi genitori, che nello stesso periodo erano stati incari - cati di una missione diplomatica segreta, promise che sarebbe tornato presto, pur sapendo che non lo avrebbe mai fatto. Le ultime parole che rivolse loro furono menzogne. Adam giunse a corte mentre le ostilità tra Castille e Montaigne erano al culmine e la gara era stata pensata proprio per distrarre l' Empereur e intrat - tenere i diplomatici stranieri. Adam si buttò nella competizione e vinse per acclamazione popolare. Il giorno seguente, tre uomini furono trascinati in catene di fronte al sovrano, accusati di avere venduto ai castilliani informazioni segrete riguardanti le rotte di viaggio di alcuni nobili diretti a negoziare la pace. T utti questi aristocratici, compresi i genitori di Adam, erano stati uccisi. Uno dei traditori era Guy. L' Empereur stava per condannarli a morte quando Adam si appellò alla clemenza della corte. Pregò Sua Maestà di esiliare Guy, rivelando solo al sovrano di essere l'erede dei V euvert. Promise tutte le terre della famiglia in cambio della vita del fratello. Il monarca, alla disperata ricerca di fondi per la guerra, accettò e Guy fu esiliato. Adam lasciò la corte lo stesso giorno e non è più tornato. Oggi Adam vive come un cantastorie errante. Si dedica completamente ai suoi racconti, scrivendo di come vede Théah: un continente che sta per entrare in una nuova era e una polveriera politica. Crede di poter ispirare, attraverso questi libri, altri a combattere e cambiare in meglio le loro vite. T uttavia, nel profondo del cuore, desidera trovare il fratello e scoprire perché ha tradito il suo re e il suo sangue.",
            "objectives": "Riunirsi con Guy, il fratello esiliato. Adam non riesce a comprendere perché Guy avrebbe tradito Montaigne e la loro famiglia a favore di Castille. Guy non ha dato alcuna spiegazione e Adam vuole fargli alcune domande importanti di persona. Ritrovare il suo libro di poesie rubate pubblicato sotto il nome di Férdéric Martin. Qualcuno colse l'occasione di una notte di bevute per derubare Adam della borsa e oggi un libro delle sue migliori composizioni è stato pubblicato a nome di questo tal Martin. Deve ritrovare l'originale per dimostrare la frode. Esibirsi per la corte dell’Empereur. Sono passati molti anni da quando Adam è stato a corte, ma continua a desiderare di essere sotto i riflet- tori. Il ritorno non sarà facile, ma deve fare giungere la sua ultima opera sulla realtà di Théah all'orecchio del Re Sole.",
            "quote": "“Un attimo del vostro tempo! Ho un boccale di birra per voi se mi racconterete quella divertente storiella che avete appena narrato al vostro amico…”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 2, Acume 4, Panache 3 • Virtù: L’Imperatore Maestosa. Attivando questa Virtù, il GM darà un Punto Eroe a tutti gli altri Eroi presenti nella Scena. • Hubris: L’Eroe Avventato. L’Eroe riceve un Punto Eroe quando la sua eccessiva sicurezza nell’agire mette nei guai lui e un altro.",
        "ability": "«“Insieme possiamo farcela. Prosegui e le cose andranno meglio… DEVONO andare meglio. Ho trovato un libro che potrebbe aiutarci e…”»\n\nVantaggi: Amicizie Altolocate, Comando, La Fortuna del Diavolo, Ricca, Sorriso Disarmante, Un Semplice Malinteso\n\nPeculiarità: Aristocratica. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Cortigiana. Ottiene un Punto Eroe ogni volta che, con il suo fascino e il suo stile, impedisce un’esplo- sione di violenza.",
        "notes": "«“Insieme possiamo farcela. Prosegui e le cose andranno meglio… DEVONO andare meglio. Ho trovato un libro che potrebbe aiutarci e…”»\nArchetipo: Eroi Strateghi\n\n📖 Storia:\nAoife crebbe in un eterno crepuscolo di ghiaccio e nebbia. La proprietà del suo nobile padre, piccola e ben tenuta, era illuminata e sicura, ma la giovane avventurosa le preferiva i misteri che strisciavano all'esterno. Quando era bambina si nascondeva sotto gli alberi caduti e osservava con occhi spaventati alte creature con la pelle di ghiaccio che danzavano e ride- vano. In seguito si unì alla loro danza ed ebbe persino un amante Sidhe il giorno del suo 18° compleanno. Aoife sapeva che i Sidhe sono pericolosi, ma non le importava: la vita è breve ed era disposta a pagare il prezzo per viverla al massimo. Non fu la sola a pagare però, suo fratello minore Peadar la seguì alla danza e lei lo ritrovò il mattino seguente mentre vagava, completamente privato di tutti i suoi ricordi. Questa trageda la cambiò la vita: la madre non riuscì più a smettere di piangere e il padre quasi smise di mangiare, fino a sembrare uno scheletro coperto da un mantello. I servitori lasciarono la famiglia maledetta e il ghiaccio si insinuò nelle sale vuote. Rendendosi conto della propria responsabilità, Aoife decise che la sua missione era scacciare gli Unseelie e curare il fratello. Trovò informazioni interessanti, ma incappò in un enorme problema: la salita al trono di Elaine vide il ritorno dell' Incanto e dei Sidhe, buoni e cattivi, in massa. Per ogni fata che benediva un bambino, un' altra ne rapiva uno nella culla. Aoife mise da parte le sue preoccupazioni e si diresse alla corte di Jack O' Bannon, dove si trova ancora in attesa di un' udienza col Re per discutere della minaccia Unseelie contro Inismore. Aoife ha un talento per l' intrigo, capisce subito quando qualcuno le mente, mentre le sue parole suonano sempre veritiere e piacevoli. È abile nel percepire l' umore di una stanza e identificare in fretta alleati e nemici. Niente di tutto questo l' aiuta con l' imprevedibile O' Bannon, ma è diventata l' astro nascente tra i nobili dell' isola. Usa la propria posizione per portare avanti due cause: tenere a bada gli Unseelie e proteggere il popolo di Inismore. Sostiene la necessità di un esercito regolare Inish che protegga la popolazione dai predoni e dagli Sidhe, di alzare le tasse dei ricchi e abbassare quelle dei poveri e di creare un sistema scolastico gratuito per i contadini. Con tutte queste preoccupazioni Aoife non si rilassa mai. Persino le cene e le feste servono a costruire alleanze per proteggere la gente di Avalon. Questa costante vigilanza l' ha resa consapevole di alcune stranezze nel castello di O' Bannon: le ombre sembrano proiettarsi più a lungo del normale e la risata del Re suona un po' troppo folle. Aoife teme che gli Unseelie abbiano potere sul sovrano – un grave ostacolo per lei – ma si ripete che la notte è più buia appena prima dell' alba.\n\n🎯 Obiettivi:\nRestituire al fratello i ricordi rubati dal Camminatore dell’Inverno. Aoife ignora che il Camminatore dell'Inverno ha scambiato quei ricordi con un Unseelie ancor più potente detto “T empesta Silente” . Per fortuna, un suo nemico Seelie, “V alle Ghiacciata” , si sta adoperando per far sapere ad Aoife di questo scambio. Recuperare il Pugnale di Goia, capace di tagliare le magie Sidhe. Goia era un'antica eroina che combatté contro gli Unseelie. Il suo pugnale poteva tagliare l'Incanto: una ferita al braccio per respingere un incantesimo paralizzante o un taglio sotto l'occhio per vedere oltre l'illusione. Aoife sta rovistando nella biblioteca del castello per scoprire dove si trova. Cercare l’alleanza dei Seelie ritrovando la “luna perduta” . Aoife ha sentito parlare di un “bambino della luna” nascosto dopo un attacco degli Unseelie, il cui compito è preservare il patto tra i Sidhe e Avalon. Aoife vuole restituire il bambino ai Seelie come segno di buona fede e sta seguendo la pista di una ragazza Inish con una voglia a forma di mezzaluna.\n\n🎭 Consigli di Interpretazione (Giocare Aoife Ó Raghnaill):\nAoife sa di essere intelligente e usa questo dono con una sincerità che si somma al suo fascino. Ride spesso, ma per poco, perché le sue preoccupazioni si mesco- lano al divertimento. Ha modi impeccabili e taglienti, anche in presenza di chi detesta. Non balla mai e si rabbuia quando qualcuno glielo chiede. È affamata di conoscenze, un'ascoltatrice attenta e una lettrice avida. Rimane attratta dall'oscurità e quella passione che la spinse verso gli Unseelie la rende vulnerabile al fascino del male.",
        "pcData": {
            "name": "Aoife Ó Raghnaill",
            "nation": "Inismore",
            "concept": "Eroi Strateghi • Inismore",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 2,
                "Acume": 4,
                "Panache": 3
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 0,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 3,
                "Esibirsi": 3,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 2,
                "Mira": 1,
                "Mischia": 2,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 0,
                "Rissa": 0
            },
            "advantages": [
                "Amicizie Altolocate",
                "Comando",
                "La Fortuna del Diavolo",
                "Ricca",
                "Sorriso Disarmante",
                "Un Semplice Malinteso"
            ],
            "virtue": "Virtù: L’Imperatore Maestosa. Attivando questa Virtù, il GM darà un Punto Eroe a tutti gli altri Eroi presenti nella Scena.",
            "hubris": "Hubris: L’Eroe Avventato. L’Eroe riceve un Punto Eroe quando la sua eccessiva sicurezza nell’agire mette nei guai lui e un altro.",
            "peculiarities": "Aristocratica. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Cortigiana. Ottiene un Punto Eroe ogni volta che, con il suo fascino e il suo stile, impedisce un’esplo- sione di violenza.",
            "story": "Aoife crebbe in un eterno crepuscolo di ghiaccio e nebbia. La proprietà del suo nobile padre, piccola e ben tenuta, era illuminata e sicura, ma la giovane avventurosa le preferiva i misteri che strisciavano all'esterno. Quando era bambina si nascondeva sotto gli alberi caduti e osservava con occhi spaventati alte creature con la pelle di ghiaccio che danzavano e ride- vano. In seguito si unì alla loro danza ed ebbe persino un amante Sidhe il giorno del suo 18° compleanno. Aoife sapeva che i Sidhe sono pericolosi, ma non le importava: la vita è breve ed era disposta a pagare il prezzo per viverla al massimo. Non fu la sola a pagare però, suo fratello minore Peadar la seguì alla danza e lei lo ritrovò il mattino seguente mentre vagava, completamente privato di tutti i suoi ricordi. Questa trageda la cambiò la vita: la madre non riuscì più a smettere di piangere e il padre quasi smise di mangiare, fino a sembrare uno scheletro coperto da un mantello. I servitori lasciarono la famiglia maledetta e il ghiaccio si insinuò nelle sale vuote. Rendendosi conto della propria responsabilità, Aoife decise che la sua missione era scacciare gli Unseelie e curare il fratello. Trovò informazioni interessanti, ma incappò in un enorme problema: la salita al trono di Elaine vide il ritorno dell' Incanto e dei Sidhe, buoni e cattivi, in massa. Per ogni fata che benediva un bambino, un' altra ne rapiva uno nella culla. Aoife mise da parte le sue preoccupazioni e si diresse alla corte di Jack O' Bannon, dove si trova ancora in attesa di un' udienza col Re per discutere della minaccia Unseelie contro Inismore. Aoife ha un talento per l' intrigo, capisce subito quando qualcuno le mente, mentre le sue parole suonano sempre veritiere e piacevoli. È abile nel percepire l' umore di una stanza e identificare in fretta alleati e nemici. Niente di tutto questo l' aiuta con l' imprevedibile O' Bannon, ma è diventata l' astro nascente tra i nobili dell' isola. Usa la propria posizione per portare avanti due cause: tenere a bada gli Unseelie e proteggere il popolo di Inismore. Sostiene la necessità di un esercito regolare Inish che protegga la popolazione dai predoni e dagli Sidhe, di alzare le tasse dei ricchi e abbassare quelle dei poveri e di creare un sistema scolastico gratuito per i contadini. Con tutte queste preoccupazioni Aoife non si rilassa mai. Persino le cene e le feste servono a costruire alleanze per proteggere la gente di Avalon. Questa costante vigilanza l' ha resa consapevole di alcune stranezze nel castello di O' Bannon: le ombre sembrano proiettarsi più a lungo del normale e la risata del Re suona un po' troppo folle. Aoife teme che gli Unseelie abbiano potere sul sovrano – un grave ostacolo per lei – ma si ripete che la notte è più buia appena prima dell' alba.",
            "objectives": "Restituire al fratello i ricordi rubati dal Camminatore dell’Inverno. Aoife ignora che il Camminatore dell'Inverno ha scambiato quei ricordi con un Unseelie ancor più potente detto “T empesta Silente” . Per fortuna, un suo nemico Seelie, “V alle Ghiacciata” , si sta adoperando per far sapere ad Aoife di questo scambio. Recuperare il Pugnale di Goia, capace di tagliare le magie Sidhe. Goia era un'antica eroina che combatté contro gli Unseelie. Il suo pugnale poteva tagliare l'Incanto: una ferita al braccio per respingere un incantesimo paralizzante o un taglio sotto l'occhio per vedere oltre l'illusione. Aoife sta rovistando nella biblioteca del castello per scoprire dove si trova. Cercare l’alleanza dei Seelie ritrovando la “luna perduta” . Aoife ha sentito parlare di un “bambino della luna” nascosto dopo un attacco degli Unseelie, il cui compito è preservare il patto tra i Sidhe e Avalon. Aoife vuole restituire il bambino ai Seelie come segno di buona fede e sta seguendo la pista di una ragazza Inish con una voglia a forma di mezzaluna.",
            "quote": "“Insieme possiamo farcela. Prosegui e le cose andranno meglio… DEVONO andare meglio. Ho trovato un libro che potrebbe aiutarci e…”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 2, Acume 4, Panache 2 • Virtù: Il Mendicante Perspicace. Attivando questa Virtù, l’Eroe può scoprire la tipologia di una Squadra di Sgherri, oppure il Grado e i Vantaggi di un Malvagio. • Hubris: L’Impiccato Indecisa. L’Eroe riceve un Punto Eroe quando spreca un’Azione esitando in preda al dubbio o all’incertezza.",
        "ability": "«“Non riesci davvero a pensare a più di un modo per uscire di qui? Io ne vedo almeno cinque… e ho anche un gran mal di testa.”»\n\nVantaggi: Accademia Militare, Fama: Geniale, Gioco di Squadra, Linguista, Ricca, Senso dell’Orientamento, Sorriso Disarmante\n\nPeculiarità: Aristocratica. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Ufficiale dell’Esercito. Ottiene un Punto Eroe ogni volta che prende il comando in una situazione di pericolo o estrema violenza.",
        "notes": "«“Non riesci davvero a pensare a più di un modo per uscire di qui? Io ne vedo almeno cinque… e ho anche un gran mal di testa.”»\nArchetipo: Eroi Strateghi\n\n📖 Storia:\nCeleste non voleva andare in guerra. Non che temesse la battaglia, ma la guerra, semplicemente, non valeva lo sforzo. Era la guerra dell' Empereur, dei nobili, persino di suo padre, non la sua, finché sua madre non cadde sul campo. Secondo il rapporto, Elodie de Villenc era morta in modo glorioso ma sciocco, guidando un assalto contro le linee nemiche. La lettera che annunciava la morte della moglie scivolò dalle mani di Duc de Villenc mentre cercava di venire a patti con il dolore. Scioccata dalla notizia, Celeste la raccolse e riuscì solo a dire: “Non si parla della spada.” Quella spada era un cimelio della famiglia de Villenc, passata da madre in figlia da tempo immemora - bile. Non era solo un pezzo di metallo, era l'eredità di Celeste e l'ultimo legame con la madre. Sapeva di dover andare al fronte per ritrovarla o morire nel tentativo. Dopo essere giunta al fronte, Celeste accusò il suo primo grave mal di testa. Gli odori, il freddo, il rumore, tutto le provocava un dolore acuto e penetrante, peggio di qualsiasi cosa avesse mai sperimentato. Non aveva idea che la frequenza e l'intensità di questi episodi sarebbe andata crescendo. La vista del sangue e l'odore della polvere da sparo le diven - nero intollerabili, costringendola a comandare dalle retrovie e distruggendo ogni speranza di ritrovare personalmente la spada. La prima notte in cui Celeste ebbe pace fu grazie a un altro nobiluomo, che le passò una pipa dal profumo fragrante dicendo: “Questo vi aiuterà.” Celeste pensò di rifiutare, ma non ne ebbe il cuore, alla vista di quello sguardo gentile. Inalò profondamente e il tabacco la fece tossire, ma sentì anche il dolore recedere. T ornata alla tenda del comando delineò un piano ingegnoso, ma rischioso. Gli ufficiali riuniti scossero la testa in silenzio eccetto per una voce gentile: “È geniale! Dobbiamo provarci.” Era Milo, l'uomo che le aveva offerto il primo sollievo dal dolore, l'unico ad appoggiare la sua stra - tegia quando tutti gli altri l'avevano rifiutata e, in futuro, suo marito.\n\n🎯 Obiettivi:\nRitrovare la spada della madre perduta a Montaigne. Celeste ha scoperto, per suo sgomento, che la spada di famiglia non è più in mani castilliane, ma è stata rubata da un “nobile” Montaigne alla fine della guerra. Perciò sta usando ogni leva, politica e non, a sua disposizione per scoprire il nome dello sciocco che ha osato rubare la sua eredità. Apprendere nuove tattiche di guerra nell’Impero delle Mezzaluna. L'interesse di Celeste per la strategia non sembra mai saziarsi. Perciò è pronta a viaggiare oltremare per apprendere nuove nozioni dagli abitanti della Mezzaluna, avendo sentito racconti della loro mille- naria tradizione militare. Chiedere alla “Madre” di Ussura di cancellare i suoi mal di testa. Secondo le ricerche svolte insieme a Milo c'è un solo modo per eliminare per sempre i mal di testa di Celeste. Dovranno avventurarsi nelle regioni selvagge di Ussura alla ricerca di Matushka, affrontando chiunque cerchi di fermarli.\n\n🎭 Consigli di Interpretazione (Giocare Celeste de Villenc):\nCeleste è una stratega geniale, con un bel caratterino. È la miglior garanzia di sicurezza per coloro che ama e chi li dovesse minacciare andrà certamente incontro a una sonora sconfitta. Celeste non è particolarmente chiacchierona o emotiva, eccetto quando si parla di tattica e strategia militare. In questo caso diventa l'oratrice più eloquente e appas - sionata che si possa incontrare. T uttavia, i suoi piani raramente trovano l'approvazione altrui, perché tende a scegliere sempre l'opzione migliore anche se questa suona folle, troppo complicata o persino impossibile ai più.",
        "pcData": {
            "name": "Celeste de Villenc",
            "nation": "Montaigne",
            "concept": "Eroi Strateghi • Montaigne",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 2,
                "Acume": 4,
                "Panache": 2
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 3,
                "Atletica": 1,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 2,
                "Esibirsi": 0,
                "Furto": 0,
                "Intimidire": 1,
                "Istruzione": 3,
                "Mira": 2,
                "Mischia": 1,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 0
            },
            "advantages": [
                "Accademia Militare",
                "Fama: Geniale",
                "Gioco di Squadra",
                "Linguista",
                "Ricca",
                "Senso dell’Orientamento",
                "Sorriso Disarmante"
            ],
            "virtue": "Virtù: Il Mendicante Perspicace. Attivando questa Virtù, l’Eroe può scoprire la tipologia di una Squadra di Sgherri, oppure il Grado e i Vantaggi di un Malvagio.",
            "hubris": "Hubris: L’Impiccato Indecisa. L’Eroe riceve un Punto Eroe quando spreca un’Azione esitando in preda al dubbio o all’incertezza.",
            "peculiarities": "Aristocratica. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Ufficiale dell’Esercito. Ottiene un Punto Eroe ogni volta che prende il comando in una situazione di pericolo o estrema violenza.",
            "story": "Celeste non voleva andare in guerra. Non che temesse la battaglia, ma la guerra, semplicemente, non valeva lo sforzo. Era la guerra dell' Empereur, dei nobili, persino di suo padre, non la sua, finché sua madre non cadde sul campo. Secondo il rapporto, Elodie de Villenc era morta in modo glorioso ma sciocco, guidando un assalto contro le linee nemiche. La lettera che annunciava la morte della moglie scivolò dalle mani di Duc de Villenc mentre cercava di venire a patti con il dolore. Scioccata dalla notizia, Celeste la raccolse e riuscì solo a dire: “Non si parla della spada.” Quella spada era un cimelio della famiglia de Villenc, passata da madre in figlia da tempo immemora - bile. Non era solo un pezzo di metallo, era l'eredità di Celeste e l'ultimo legame con la madre. Sapeva di dover andare al fronte per ritrovarla o morire nel tentativo. Dopo essere giunta al fronte, Celeste accusò il suo primo grave mal di testa. Gli odori, il freddo, il rumore, tutto le provocava un dolore acuto e penetrante, peggio di qualsiasi cosa avesse mai sperimentato. Non aveva idea che la frequenza e l'intensità di questi episodi sarebbe andata crescendo. La vista del sangue e l'odore della polvere da sparo le diven - nero intollerabili, costringendola a comandare dalle retrovie e distruggendo ogni speranza di ritrovare personalmente la spada. La prima notte in cui Celeste ebbe pace fu grazie a un altro nobiluomo, che le passò una pipa dal profumo fragrante dicendo: “Questo vi aiuterà.” Celeste pensò di rifiutare, ma non ne ebbe il cuore, alla vista di quello sguardo gentile. Inalò profondamente e il tabacco la fece tossire, ma sentì anche il dolore recedere. T ornata alla tenda del comando delineò un piano ingegnoso, ma rischioso. Gli ufficiali riuniti scossero la testa in silenzio eccetto per una voce gentile: “È geniale! Dobbiamo provarci.” Era Milo, l'uomo che le aveva offerto il primo sollievo dal dolore, l'unico ad appoggiare la sua stra - tegia quando tutti gli altri l'avevano rifiutata e, in futuro, suo marito.",
            "objectives": "Ritrovare la spada della madre perduta a Montaigne. Celeste ha scoperto, per suo sgomento, che la spada di famiglia non è più in mani castilliane, ma è stata rubata da un “nobile” Montaigne alla fine della guerra. Perciò sta usando ogni leva, politica e non, a sua disposizione per scoprire il nome dello sciocco che ha osato rubare la sua eredità. Apprendere nuove tattiche di guerra nell’Impero delle Mezzaluna. L'interesse di Celeste per la strategia non sembra mai saziarsi. Perciò è pronta a viaggiare oltremare per apprendere nuove nozioni dagli abitanti della Mezzaluna, avendo sentito racconti della loro mille- naria tradizione militare. Chiedere alla “Madre” di Ussura di cancellare i suoi mal di testa. Secondo le ricerche svolte insieme a Milo c'è un solo modo per eliminare per sempre i mal di testa di Celeste. Dovranno avventurarsi nelle regioni selvagge di Ussura alla ricerca di Matushka, affrontando chiunque cerchi di fermarli.",
            "quote": "“Non riesci davvero a pensare a più di un modo per uscire di qui? Io ne vedo almeno cinque… e ho anche un gran mal di testa.”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 3, Acume 4, Panache 2 • Virtù: Il Sole Gloriosa. L’Eroe può attivare questa Virtù quando si trova al centro dell’attenzione. Per il prossimo Rischio ogni dado conterà come un Incremento senza bisogno di tirare. • Hubris: Il Matto Curiosa. L’Eroe riceve un Punto Eroe quando investiga su qualcosa di inusuale, specialmente se pericoloso. Stile di Duello: Lakedaimon Agoge L’Eroe può compiere Manovre di Duello usando un arco; in tal caso usa il suo Grado di Mira invece di quello di Mischia per determinare gli effetti. Inoltre la sua Manovra Affondo viene rimpiazzata dal Colpo dell’Agoge, che infligge un numero di Ferite pari al Grado di Mira più il numero di Incrementi spesi, ma richiede che l’Eroe usi la sua Azione seguente nel corso del round per Recuperare, spendendo un Incremento (che non avrà ulteriori effetti). 1 2 3 4",
        "ability": "«“L’unico modo per assicurarsi la vittoria è cono- scere il nemico meglio di noi stessi. Solo allora potremo andare oltre le semplici speculazioni in battaglia. State attenti! Comprendere vuol dire rispettare e rispettare vuol dire amare. Siete in grado di sconfiggere chi amate?”»\n\nVantaggi: Cameratismo, Dura da Uccidere, Gioco di Squadra, Sala d’Armi: Lakedaimon Agoge (vedi sotto), Stomaco di Ferro, Vista d’Aquila\n\nPeculiarità: Precettore. Ottiene un Punto Eroe ogni volta che spinge un altro personaggio a mostrare il suo vero potenziale, anche se questo causa dei guai o complica la situazione. Mercenario. Ottiene un Punto Eroe ogni volta che sceglie di seguire una ragione più nobile del vile denaro.",
        "notes": "«“L’unico modo per assicurarsi la vittoria è cono- scere il nemico meglio di noi stessi. Solo allora potremo andare oltre le semplici speculazioni in battaglia. State attenti! Comprendere vuol dire rispettare e rispettare vuol dire amare. Siete in grado di sconfiggere chi amate?”»\nArchetipo: Eroi Strateghi\n\n📖 Storia:\n“Che ci fa qui? Non è troppo giovane?” Queste erano le domande che uomini e donne potenti si facevano sempre quando incontravano Elpis. Eppure, dopo un incontro anche brevissimo, tutti concordavano che non era solo affascinante, ma anche intelligente oltre ogni aspettativa. Se solo avessero intuito cosa si nascondeva sotto la superficie… Elpis nacque a Numa e, come la maggior parte dei bambini, frequentò l' agoge sin dalla tenera età di 5 anni. Nonostante fosse la più giovane della sua classe, dimostrò che una mente brillante era una risorsa migliore di piedi veloci o braccia robuste. La sua astuzia la rese superiore a tutti i suoi compagni e dopo cinque anni di addestramenti massacranti fu l'unica del corso a diplomarsi. T utti erano convinti che gli Oracoli avrebbero avuto vita facile con lei: era chiaramente nata per essere parte della casta degli haimon, i più disciplinati guerrieri di Théah. Anche Elpis lo credeva, finché Theonoa Dianoia, dea delle Arti e della Conoscenza, non le apparve in sogno. Nel sogno, Elpis andava a incontrare gli Oracoli, ma il suo arrivo provocava una grande catastrofe, un'onda nera che spazzava il mondo intero. Disperata, si rivolse alla dea per sapere se c'era un modo di evitare tale distruzione. “Esiste un modo.” rispose Theonoa, “Ma dovrai lasciare Numa oggi stesso, non incontrare mai gli Oracoli e trovare un haimon da addestrare che sia davvero degno della tua conoscenza.” Ciò che la dea non disse era che la mancata visita agli Oracoli implicava il disonore eterno per Elpis e tutta la sua famiglia. Una macchia sul suo kleos – la sua fama – che solo un atto di incredibile coraggio avrebbe potuto lavare. Elpis voleva saperne di più, fare altre domande ma, come spesso accade con gli dei, si svegliò prima di poter aprire bocca. Questa terribile decisione pesava sulla piccola di appena 10 anni, che restò sveglia fino all'alba a meditare. Quando i primi raggi del sole apparvero era già in viaggio per lasciare Numa. Oggi Elpis è più vecchia e saggia, ha viaggiato per tutta Théah alla ricerca dell'haimon che dovrà istruire. Nei suoi vagabondaggi ha dato consiglio a uomini e donne di potere – specie se coinvolti in conflitti lunghi e sanguinosi – a politici, a personaggi di stato e a chiunque le abbia prestato orecchio. Pochi conoscono le sue imprese, ma Elpis è stata una delle menti dietro la fine degli scontri tra Montaigne e Castille e fu il suo consiglio a permettere alla Jarl Hlodversson di diventare un capo amato e rispettato dalla sua gente. Questi sono solo alcuni degli incredi- bili risultati conseguiti da Elpis da quando ha lasciato la patria.\n\n🎯 Obiettivi:\nAddestrare un haimon al sentiero dell’onore. Elpis ha addestrato molte persone, ma non ha ancora trovate quell'uno “degno” della sua saggezza. È sempre alla ricerca di opportunità per mettere alla prova potenziali candidati, attraverso duelli di spada, di parole o poleis (un classico gioco strategico di Numa). Trovare un idolo della Dea delle Arti e della Conoscenza che le dia una visione. Sin da quella notte che cambiò la vita di Elpis, Theonoa è stata dolorosamente silenziosa, nonostante tutti i tentativi di comunicare con lei. Elpis ha sentito parlare di una statua a V odacce che potrebbe aiutarla ed è pronta a dirigersi là. Cancellare la macchia sul suo kleos. Nonostante sia fuggita per un buon motivo – forse il più importante possibile – Elpis spera di poter lavare la macchia sul suo kleos. Per questo motivo aiuta tutti coloro che incontra, persino i più odiosi.\n\n🎭 Consigli di Interpretazione (Giocare Elpis Moraitis):\nElpis è una giovane donna che ha la saggezza di un veterano. Chiede un compenso minimo per i suoi servigi e si rifiuta di prestare aiuto a chi ha obiettivi per lei disonorevoli. Può apparire arrogante ma, in realtà, è una persona umile e premurosa. Chi la conosce bene sa che il suo comportarsi da ragazzina spensierata è solo una maschera di cui può liberarsi in un attimo. Sotto l'apparenza fanciullesca e rumorosa c'è una guerriera che non conosce rivali.",
        "pcData": {
            "name": "Elpis Moraitis",
            "nation": "Numa",
            "concept": "Eroi Strateghi • Numa",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 4,
                "Panache": 2
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 3,
                "Atletica": 2,
                "Cavalcare": 0,
                "Convincere": 2,
                "Empatia": 2,
                "Esibirsi": 0,
                "Furto": 0,
                "Intimidire": 1,
                "Istruzione": 3,
                "Mira": 3,
                "Mischia": 1,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 1
            },
            "advantages": [
                "Cameratismo",
                "Dura da Uccidere",
                "Gioco di Squadra",
                "Sala d’Armi: Lakedaimon Agoge (vedi sotto)",
                "Stomaco di Ferro",
                "Vista d’Aquila"
            ],
            "virtue": "Virtù: Il Sole Gloriosa. L’Eroe può attivare questa Virtù quando si trova al centro dell’attenzione. Per il prossimo Rischio ogni dado conterà come un Incremento senza bisogno di tirare.",
            "hubris": "Hubris: Il Matto Curiosa. L’Eroe riceve un Punto Eroe quando investiga su qualcosa di inusuale, specialmente se pericoloso. Stile di Duello: Lakedaimon Agoge L’Eroe può compiere Manovre di Duello usando un arco; in tal caso usa il suo Grado di Mira invece di quello di Mischia per determinare gli effetti. Inoltre la sua Manovra Affondo viene rimpiazzata dal Colpo dell’Agoge, che infligge un numero di Ferite pari al Grado di Mira più il numero di Incrementi spesi, ma richiede che l’Eroe usi la sua Azione seguente nel corso del round per Recuperare, spendendo un Incremento (che non avrà ulteriori effetti). 1 2 3 4",
            "peculiarities": "Precettore. Ottiene un Punto Eroe ogni volta che spinge un altro personaggio a mostrare il suo vero potenziale, anche se questo causa dei guai o complica la situazione. Mercenario. Ottiene un Punto Eroe ogni volta che sceglie di seguire una ragione più nobile del vile denaro.",
            "story": "“Che ci fa qui? Non è troppo giovane?” Queste erano le domande che uomini e donne potenti si facevano sempre quando incontravano Elpis. Eppure, dopo un incontro anche brevissimo, tutti concordavano che non era solo affascinante, ma anche intelligente oltre ogni aspettativa. Se solo avessero intuito cosa si nascondeva sotto la superficie… Elpis nacque a Numa e, come la maggior parte dei bambini, frequentò l' agoge sin dalla tenera età di 5 anni. Nonostante fosse la più giovane della sua classe, dimostrò che una mente brillante era una risorsa migliore di piedi veloci o braccia robuste. La sua astuzia la rese superiore a tutti i suoi compagni e dopo cinque anni di addestramenti massacranti fu l'unica del corso a diplomarsi. T utti erano convinti che gli Oracoli avrebbero avuto vita facile con lei: era chiaramente nata per essere parte della casta degli haimon, i più disciplinati guerrieri di Théah. Anche Elpis lo credeva, finché Theonoa Dianoia, dea delle Arti e della Conoscenza, non le apparve in sogno. Nel sogno, Elpis andava a incontrare gli Oracoli, ma il suo arrivo provocava una grande catastrofe, un'onda nera che spazzava il mondo intero. Disperata, si rivolse alla dea per sapere se c'era un modo di evitare tale distruzione. “Esiste un modo.” rispose Theonoa, “Ma dovrai lasciare Numa oggi stesso, non incontrare mai gli Oracoli e trovare un haimon da addestrare che sia davvero degno della tua conoscenza.” Ciò che la dea non disse era che la mancata visita agli Oracoli implicava il disonore eterno per Elpis e tutta la sua famiglia. Una macchia sul suo kleos – la sua fama – che solo un atto di incredibile coraggio avrebbe potuto lavare. Elpis voleva saperne di più, fare altre domande ma, come spesso accade con gli dei, si svegliò prima di poter aprire bocca. Questa terribile decisione pesava sulla piccola di appena 10 anni, che restò sveglia fino all'alba a meditare. Quando i primi raggi del sole apparvero era già in viaggio per lasciare Numa. Oggi Elpis è più vecchia e saggia, ha viaggiato per tutta Théah alla ricerca dell'haimon che dovrà istruire. Nei suoi vagabondaggi ha dato consiglio a uomini e donne di potere – specie se coinvolti in conflitti lunghi e sanguinosi – a politici, a personaggi di stato e a chiunque le abbia prestato orecchio. Pochi conoscono le sue imprese, ma Elpis è stata una delle menti dietro la fine degli scontri tra Montaigne e Castille e fu il suo consiglio a permettere alla Jarl Hlodversson di diventare un capo amato e rispettato dalla sua gente. Questi sono solo alcuni degli incredi- bili risultati conseguiti da Elpis da quando ha lasciato la patria.",
            "objectives": "Addestrare un haimon al sentiero dell’onore. Elpis ha addestrato molte persone, ma non ha ancora trovate quell'uno “degno” della sua saggezza. È sempre alla ricerca di opportunità per mettere alla prova potenziali candidati, attraverso duelli di spada, di parole o poleis (un classico gioco strategico di Numa). Trovare un idolo della Dea delle Arti e della Conoscenza che le dia una visione. Sin da quella notte che cambiò la vita di Elpis, Theonoa è stata dolorosamente silenziosa, nonostante tutti i tentativi di comunicare con lei. Elpis ha sentito parlare di una statua a V odacce che potrebbe aiutarla ed è pronta a dirigersi là. Cancellare la macchia sul suo kleos. Nonostante sia fuggita per un buon motivo – forse il più importante possibile – Elpis spera di poter lavare la macchia sul suo kleos. Per questo motivo aiuta tutti coloro che incontra, persino i più odiosi.",
            "quote": "“L’unico modo per assicurarsi la vittoria è cono- scere il nemico meglio di noi stessi. Solo allora potremo andare oltre le semplici speculazioni in battaglia. State attenti! Comprendere vuol dire rispettare e rispettare vuol dire amare. Siete in grado di sconfiggere chi amate?”"
        }
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
        "traits": "Vigore 4, Grazia 2, Risolutezza 2, Acume 3, Panache 2 • Virtù: La Guerra Vittoriosa. Quando l’Eroe ferisce per la prima volta un Malvagio in combattimento può attivare questa Virtù per infliggere una Ferita Drammatica aggi- untiva oltre al normale danno. • Hubris: L’Imperatore Testa Calda. L’Eroe riceve un Punto Eroe quando perde le staffe o provoca guai.",
        "ability": "«“Non mi serve riposo, né soccorso. Mi serve un’altra battaglia. La gloria attende solo chi muore con una spada in pugno!”»\n\nVantaggi: Bevitrice Emerita, Fama: Pericolosa, Oggetto Distintivo: Kragt, Sala d’Armi: Leegstra, Sola Contro Tutti\n\nPeculiarità: Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale. Soldato. Ottiene un Punto Eroe ogni volta che segue il piano a prescindere dai rischi personali.",
        "notes": "«“Non mi serve riposo, né soccorso. Mi serve un’altra battaglia. La gloria attende solo chi muore con una spada in pugno!”»\nArchetipo: Eroi Strateghi\n\n📖 Storia:\nHulda stava per diventare uno dei più grandi guerrieri V estenmennavenjar, finché una bearsark non la ferì gravemente. Lavorò duro per rimettersi in forze, ma la sua gamba non guarì mai del tutto, quasi fosse maledetta. Ciononostante Hulda perseverò, modificando il suo stile di combattimento, basato sul Leegstra, da spada e ascia a spada e bastone. Aggiunse anche un certo numero di finte per far credere che la gamba fosse sana. Il suo più grande punto di forza era, e rimane, la sua mente acuta: Hulda è capace di creare mappe mentali dell' ambiente circostante, rilevando qualsiasi possibile vantaggio disponibile. Ufficialmente, Hulda si è “ritirata” e il suo comandante le ha affidato l' incarico di addestrare altre V alchirie. Ubbidiente, si dedica a questo compito con impegno ed è genuinamente orgogliosa se una studentessa la supera in abilità. T uttavia si butta ancora da un'avven- tura all'altra seguendo i “presagi divini” , convinta che non vi sia gloria nel morire di vecchiaia e che, per sedere alla tavola degli dei, dovrà morire in battaglia. Tra uno scontro e un addestramento, Hulda passa buona parte del proprio tempo libero con un boccale in mano tra le braccia della sua amante, Ingrid. Dubita che morire ubriaca a letto le darebbe un posto alla tavola degli dei, ma lo considera una buona alternativa. Hulda è stata sposata con un uomo di nome Brøn e ha avuto due bambine e un maschietto, prima che lui morisse combattendo un kraken. La figlia maggiore, Magda, ha ereditato le terre della famiglia tempo fa, ma lo zio di Hulda, Gellir, ha impugnato il testamento. Hulda non conosce la politica, ma sa che lo zio ha l' appoggio di molti carl, perciò sta cercando l' aiuto degli jarl. Ha in mente di convocare un thing per sistemare la cosa appena avrà ottenuto l' appoggio necessario. V estenmennavenjar è una terra pericolosa e, nonostante la sua ossessione per la gloria, Hulda combatte soprattutto per tenere la sua gente al sicuro. Uccide mostri, sbaraglia banditi e pirati e spesso fa da giudice nelle dispute tra signori e vassalli (di norma intimidendo tutte le parti coinvolte). Le canzoni narrano di come abbia combattuto la figlia di un gigante dei ghiacci, che aveva spadroneg- giato per decenni in un villaggio, chiedendo un neonato in sacrificio ogni anno. Si racconta che, per sconfiggere questa nemica tanto forte, Hulda abbia ricoperto la sua spada, Kragt, di cera bollente.\n\n🎯 Obiettivi:\nAddestrare una donna degna della spada runica Kragt. Kragt è un cimelio passato alla V alchiria che deve servire l'attuale Mjötuðr (l'alto re) e la gamba ferita di Hulda la rende indegna di questo incarico. Perciò sta cercando un'altra V alchiria a cui consegnare la lama, ma il suo spirito è in subbuglio: Hulda è intelligente, determinata e ha imparato a compensare la propria ferita. Non basta questo a renderla ancora degna? Fermare la bearsark che l’ha ferita. Hulda ha scoperto l'identità della bearsark che la ferì: Estrid Lowzow. Ha anche scoperto che, da giovanis- sima, Estrid fu l'unica superstite di un attacco contro la sua città. Hulda si chiede se gli dei vogliono la morte o la redenzione della bearsark. Invocare l’aiuto degli jarl per sua figlia. Gellir sostiene che, in quanto V alchiria, Hulda non può possedere terre e le sue proprietà sarebbero dovute tornare alla sua defunta madre e quindi al suo parente più prossimo: Gellir stesso. Hulda è convinta che la terra appartenga a sua figlia. Purtroppo la legge V esten consente entrambe le interpretazioni, rendendo la questione più una prova di forza politica che un dibat- tito legale.\n\n🎭 Consigli di Interpretazione (Giocare Hulda Silje):\nHulda è rapida alla risata quanto alla rabbia o al perdono. Il combattimento è la sua vita: quando non è sul campo di battaglia addestra giovani V alchirie o fa manutenzione alle sue molte armi e bellissime armature decorate. Ama bere e intrattiene il pubblico con racconti delle sue battaglie. Se si sente abbastanza ardita, potrebbe anche portarsi a letto per la notte qualcuno dei presenti. Sul campo, la sua natura spericolata viene meno e diventa una macchina da guerra spietata e calcolatrice. Se vede una debolezza la sfrutta, se scorge un'apertura vi si butta. Conosce mille modi di rispondere a un attacco e sceglie sempre quello migliore. È abilissima a individuare punti di forza e debolezza di un gruppo e ad assumerne il comando per guidarlo alla vittoria.",
        "pcData": {
            "name": "Hulda Silje",
            "nation": "Vestenmennavenjar",
            "concept": "Eroi Strateghi • Vestenmennavenjar",
            "traits": {
                "Vigore": 4,
                "Grazia": 2,
                "Risolutezza": 2,
                "Acume": 3,
                "Panache": 2
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 3,
                "Atletica": 2,
                "Cavalcare": 0,
                "Convincere": 1,
                "Empatia": 2,
                "Esibirsi": 1,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 0,
                "Mira": 1,
                "Mischia": 3,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 2
            },
            "advantages": [
                "Bevitrice Emerita",
                "Fama: Pericolosa",
                "Oggetto Distintivo: Kragt",
                "Sala d’Armi: Leegstra",
                "Sola Contro Tutti"
            ],
            "virtue": "Virtù: La Guerra Vittoriosa. Quando l’Eroe ferisce per la prima volta un Malvagio in combattimento può attivare questa Virtù per infliggere una Ferita Drammatica aggi- untiva oltre al normale danno.",
            "hubris": "Hubris: L’Imperatore Testa Calda. L’Eroe riceve un Punto Eroe quando perde le staffe o provoca guai.",
            "peculiarities": "Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale. Soldato. Ottiene un Punto Eroe ogni volta che segue il piano a prescindere dai rischi personali.",
            "story": "Hulda stava per diventare uno dei più grandi guerrieri V estenmennavenjar, finché una bearsark non la ferì gravemente. Lavorò duro per rimettersi in forze, ma la sua gamba non guarì mai del tutto, quasi fosse maledetta. Ciononostante Hulda perseverò, modificando il suo stile di combattimento, basato sul Leegstra, da spada e ascia a spada e bastone. Aggiunse anche un certo numero di finte per far credere che la gamba fosse sana. Il suo più grande punto di forza era, e rimane, la sua mente acuta: Hulda è capace di creare mappe mentali dell' ambiente circostante, rilevando qualsiasi possibile vantaggio disponibile. Ufficialmente, Hulda si è “ritirata” e il suo comandante le ha affidato l' incarico di addestrare altre V alchirie. Ubbidiente, si dedica a questo compito con impegno ed è genuinamente orgogliosa se una studentessa la supera in abilità. T uttavia si butta ancora da un'avven- tura all'altra seguendo i “presagi divini” , convinta che non vi sia gloria nel morire di vecchiaia e che, per sedere alla tavola degli dei, dovrà morire in battaglia. Tra uno scontro e un addestramento, Hulda passa buona parte del proprio tempo libero con un boccale in mano tra le braccia della sua amante, Ingrid. Dubita che morire ubriaca a letto le darebbe un posto alla tavola degli dei, ma lo considera una buona alternativa. Hulda è stata sposata con un uomo di nome Brøn e ha avuto due bambine e un maschietto, prima che lui morisse combattendo un kraken. La figlia maggiore, Magda, ha ereditato le terre della famiglia tempo fa, ma lo zio di Hulda, Gellir, ha impugnato il testamento. Hulda non conosce la politica, ma sa che lo zio ha l' appoggio di molti carl, perciò sta cercando l' aiuto degli jarl. Ha in mente di convocare un thing per sistemare la cosa appena avrà ottenuto l' appoggio necessario. V estenmennavenjar è una terra pericolosa e, nonostante la sua ossessione per la gloria, Hulda combatte soprattutto per tenere la sua gente al sicuro. Uccide mostri, sbaraglia banditi e pirati e spesso fa da giudice nelle dispute tra signori e vassalli (di norma intimidendo tutte le parti coinvolte). Le canzoni narrano di come abbia combattuto la figlia di un gigante dei ghiacci, che aveva spadroneg- giato per decenni in un villaggio, chiedendo un neonato in sacrificio ogni anno. Si racconta che, per sconfiggere questa nemica tanto forte, Hulda abbia ricoperto la sua spada, Kragt, di cera bollente.",
            "objectives": "Addestrare una donna degna della spada runica Kragt. Kragt è un cimelio passato alla V alchiria che deve servire l'attuale Mjötuðr (l'alto re) e la gamba ferita di Hulda la rende indegna di questo incarico. Perciò sta cercando un'altra V alchiria a cui consegnare la lama, ma il suo spirito è in subbuglio: Hulda è intelligente, determinata e ha imparato a compensare la propria ferita. Non basta questo a renderla ancora degna? Fermare la bearsark che l’ha ferita. Hulda ha scoperto l'identità della bearsark che la ferì: Estrid Lowzow. Ha anche scoperto che, da giovanis- sima, Estrid fu l'unica superstite di un attacco contro la sua città. Hulda si chiede se gli dei vogliono la morte o la redenzione della bearsark. Invocare l’aiuto degli jarl per sua figlia. Gellir sostiene che, in quanto V alchiria, Hulda non può possedere terre e le sue proprietà sarebbero dovute tornare alla sua defunta madre e quindi al suo parente più prossimo: Gellir stesso. Hulda è convinta che la terra appartenga a sua figlia. Purtroppo la legge V esten consente entrambe le interpretazioni, rendendo la questione più una prova di forza politica che un dibat- tito legale.",
            "quote": "“Non mi serve riposo, né soccorso. Mi serve un’altra battaglia. La gloria attende solo chi muore con una spada in pugno!”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 3, Acume 4, Panache 2 • Virtù: Il Profeta Illuminata. Attivando questa Virtù, per tutta la durata della scena l’Eroe si accorge automatica- mente quando qualsiasi altro personaggio mente. • Hubris: Il Diavolo Fiduciosa. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato.",
        "ability": "«“La strada verso una buona vita, amici miei, passa attraverso buone scelte. Possiamo trovare questo cammino insieme.”»\n\nVantaggi: Amicizie Altolocate, Consacrata, Ispirare Generosità, Senso dell’Orientamento, Un Semplice Malinteso, Università\n\nPeculiarità: Cortigiana. Ottiene un Punto Eroe ogni volta che, con il suo fascino e il suo stile, impedisce un’esplo- sione di violenza. Sacerdote. Ottiene un Punto Eroe ogni volta che lascia da parte la retorica e mette in pratica le virtù che professa.",
        "notes": "«“La strada verso una buona vita, amici miei, passa attraverso buone scelte. Possiamo trovare questo cammino insieme.”»\nArchetipo: Eroi Strateghi\n\n📖 Storia:\nOsterhilde era una bambina curiosa. Cresciuta in una famiglia di mugnai, sommergeva di domande i parenti. Aveva una mente vorace che voleva sapere tutto, dalla natura alla politica, dalla vita del villaggio ai pettego - lezzi. La famiglia era molto devota e, sin da piccola, Osterhilde era convinta che la Chiesa V aticina fosse la più grande forza del bene al mondo. A 13 anni, lasciò la casa paterna e cominciò a studiare per diventare parte della gerarchia ecclesiastica. In breve tempo divenne l'astro nascente della chiesa locale, famosa per la dedizione alle opere buone e per aiutare i bisognosi, ma questo non le bastava. V edeva le difficoltà in cui versava la sua amata Eisen e l'oscu - rità che si faceva avanti da ogni angolo. La Guerra della Croce aveva lasciato dietro di sé un paese in frantumi, che faticava a rimettersi in piedi, ed erano in molti ad avere bisogno di ispirazione e supporto. Osterhilde cominciò a credere che nulla potesse salvare Eisen dall'autodistruzione. Durante un dibat- tito su determinismo e libero arbitrio venne colpita dalla forza con cui il relatore presentava l'idea che chiunque ha la possibilità di determinare le proprie azioni. Il libero arbitrio, sosteneva l'insegnante, consi- steva nel fatto che tutti agissero secondo la volontà individuale e che questo desse senso alle loro vite e alle loro azioni. La giovane abbracciò subito questa idea e cominciò a predicare il libero arbitrio come modo per ridare speranza. Sfortunatamente, queste idee non sono sempre ben accolte e molti nella Chiesa sono restii ad abbando- nare il determinismo. Osterhilde continua a spostarsi lungo le pericolose strade di Eisen, per diffondere il suo messaggio. I suoi ultimi vagabondaggi la stanno portando verso il Königreich di Hainzl. Questo angolo del Paese, normalmente placido, è in subbuglio a causa di alcuni mercenari locali, accusati di diser - zione durante la Guerra della Croce. Osterhilde non può fare a meno di chiedersi se non ci sia dell'altro sotto, perché nessuna voce si è levata in difesa di questi soldati, condannandoli implicitamente. Ci sono troppe domande senza risposta in questa vicenda e Osterhilde crede di essere la donna giusta per scoprire la verità.\n\n🎯 Obiettivi:\nConvincere i suoi correligionari del potere del libero arbitrio. L'idea di libero arbitrio è tanto incompresa tra i seguaci della Chiesa V aticina che molti calunniano i suoi sostenitori. Osterhilde deve riuscire a persuadere i suoi pari del potere intrinseco della libertà di scelta o rischiare di vedere questa grande idea sepolta dalla fede cieca nel fato e nella predestinazione. Tenere una conferenza nel Königreich di Hainzl. Hainzl è un punto caldo nel dibattito sulla responsa- bilità e libertà individuale. Per fare in modo che le sue idee siano ascoltate e forse recepite in quest'angolo sonnolento di Eisen, Osterhilde, che è in viaggio da molto tempo, dovrà percorrere ancora strade assai pericolose. Rappresentare Hans Eirleicht al suo processo per diserzione. Poche cose smuovono gli animi quanto la Guerra della Croce e il recente caso presentato alla corte di Hainzl sta facendo stracciare le vesti a tutti. Un'unità di mercenari, comandata da Hans Eirleicht, pare abbia disertato durante il conflitto. Ora sono tutti sotto processo per questo. L'opinione pubblica è contro di loro e nessuno sembra disposto a difendere il coman- dante. Mettersi in mezzo non renderà Osterhilde popolare, ma lei crede che sia la cosa giusta da fare.\n\n🎭 Consigli di Interpretazione (Giocare Osterhilde Hummel):\nOsterhilde Hummel è una donna Eisen piuttosto caparbia. Si muove piano, ma sempre a testa alta, persino quando guarda in basso. Parla lentamente, con un tono gentile ma fermo. Qualunque sia l'argomento della conversazione, Osterhilde rimane sempre calma e controllata e, pur difendendo le proprie convinzioni con passione, non sminuisce mai le opinioni altrui. Ha sempre un sorriso pronto e gentile, ma tra amici sa essere decisamente tagliente e sarcastica.",
        "pcData": {
            "name": "Osterhilde Hummel",
            "nation": "Eisen",
            "concept": "Eroi Strateghi • Eisen",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 4,
                "Panache": 2
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 1,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 2,
                "Esibirsi": 3,
                "Furto": 0,
                "Intimidire": 0,
                "Istruzione": 3,
                "Mira": 0,
                "Mischia": 1,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 3,
                "Rissa": 0
            },
            "advantages": [
                "Amicizie Altolocate",
                "Consacrata",
                "Ispirare Generosità",
                "Senso dell’Orientamento",
                "Un Semplice Malinteso",
                "Università"
            ],
            "virtue": "Virtù: Il Profeta Illuminata. Attivando questa Virtù, per tutta la durata della scena l’Eroe si accorge automatica- mente quando qualsiasi altro personaggio mente.",
            "hubris": "Hubris: Il Diavolo Fiduciosa. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato.",
            "peculiarities": "Cortigiana. Ottiene un Punto Eroe ogni volta che, con il suo fascino e il suo stile, impedisce un’esplo- sione di violenza. Sacerdote. Ottiene un Punto Eroe ogni volta che lascia da parte la retorica e mette in pratica le virtù che professa.",
            "story": "Osterhilde era una bambina curiosa. Cresciuta in una famiglia di mugnai, sommergeva di domande i parenti. Aveva una mente vorace che voleva sapere tutto, dalla natura alla politica, dalla vita del villaggio ai pettego - lezzi. La famiglia era molto devota e, sin da piccola, Osterhilde era convinta che la Chiesa V aticina fosse la più grande forza del bene al mondo. A 13 anni, lasciò la casa paterna e cominciò a studiare per diventare parte della gerarchia ecclesiastica. In breve tempo divenne l'astro nascente della chiesa locale, famosa per la dedizione alle opere buone e per aiutare i bisognosi, ma questo non le bastava. V edeva le difficoltà in cui versava la sua amata Eisen e l'oscu - rità che si faceva avanti da ogni angolo. La Guerra della Croce aveva lasciato dietro di sé un paese in frantumi, che faticava a rimettersi in piedi, ed erano in molti ad avere bisogno di ispirazione e supporto. Osterhilde cominciò a credere che nulla potesse salvare Eisen dall'autodistruzione. Durante un dibat- tito su determinismo e libero arbitrio venne colpita dalla forza con cui il relatore presentava l'idea che chiunque ha la possibilità di determinare le proprie azioni. Il libero arbitrio, sosteneva l'insegnante, consi- steva nel fatto che tutti agissero secondo la volontà individuale e che questo desse senso alle loro vite e alle loro azioni. La giovane abbracciò subito questa idea e cominciò a predicare il libero arbitrio come modo per ridare speranza. Sfortunatamente, queste idee non sono sempre ben accolte e molti nella Chiesa sono restii ad abbando- nare il determinismo. Osterhilde continua a spostarsi lungo le pericolose strade di Eisen, per diffondere il suo messaggio. I suoi ultimi vagabondaggi la stanno portando verso il Königreich di Hainzl. Questo angolo del Paese, normalmente placido, è in subbuglio a causa di alcuni mercenari locali, accusati di diser - zione durante la Guerra della Croce. Osterhilde non può fare a meno di chiedersi se non ci sia dell'altro sotto, perché nessuna voce si è levata in difesa di questi soldati, condannandoli implicitamente. Ci sono troppe domande senza risposta in questa vicenda e Osterhilde crede di essere la donna giusta per scoprire la verità.",
            "objectives": "Convincere i suoi correligionari del potere del libero arbitrio. L'idea di libero arbitrio è tanto incompresa tra i seguaci della Chiesa V aticina che molti calunniano i suoi sostenitori. Osterhilde deve riuscire a persuadere i suoi pari del potere intrinseco della libertà di scelta o rischiare di vedere questa grande idea sepolta dalla fede cieca nel fato e nella predestinazione. Tenere una conferenza nel Königreich di Hainzl. Hainzl è un punto caldo nel dibattito sulla responsa- bilità e libertà individuale. Per fare in modo che le sue idee siano ascoltate e forse recepite in quest'angolo sonnolento di Eisen, Osterhilde, che è in viaggio da molto tempo, dovrà percorrere ancora strade assai pericolose. Rappresentare Hans Eirleicht al suo processo per diserzione. Poche cose smuovono gli animi quanto la Guerra della Croce e il recente caso presentato alla corte di Hainzl sta facendo stracciare le vesti a tutti. Un'unità di mercenari, comandata da Hans Eirleicht, pare abbia disertato durante il conflitto. Ora sono tutti sotto processo per questo. L'opinione pubblica è contro di loro e nessuno sembra disposto a difendere il coman- dante. Mettersi in mezzo non renderà Osterhilde popolare, ma lei crede che sia la cosa giusta da fare.",
            "quote": "“La strada verso una buona vita, amici miei, passa attraverso buone scelte. Possiamo trovare questo cammino insieme.”"
        }
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
        "traits": "Vigore 3, Grazia 2, Risolutezza 2, Acume 3, Panache 3 • Virtù: La Strega Intuitivo. Attivando questa Virtù, l’Eroe può porre al GM una domanda con risposta sì/no riguardante un PNG. Il GM dovrà rispondere onestamente e, se possibile, aggiungere dettagli. • Hubris: Il Sole Orgoglioso. L’Eroe riceve un Punto Eroe quando rifiuta un’offerta d’aiuto, per esempio se un alleato spende un Punto Eroe per dargli Dadi Bonus e lui rifiuta.",
        "ability": "«“Il cuore della Confederazione è la nostra libertà, ora e per sempre. Non dimentichia- molo. Serbiamo questa verità nei nostri cuori e troveremo la via nella notte più oscura.”»\n\nVantaggi: Accademia Militare, Comando, Gioco di Squadra, L’Unione Fa la Forza, Scuola di Maniere, Senso dell’Orientamento\n\nPeculiarità: Poseł. Ottiene un Punto Eroe ogni volta che insiste per una soluzione democratica quando sarebbe vantaggioso non votare. Ufficiale dell’Esercito. Ottiene un Punto Eroe ogni volta che prende il comando in una situazione di pericolo o estrema violenza.",
        "notes": "«“Il cuore della Confederazione è la nostra libertà, ora e per sempre. Non dimentichia- molo. Serbiamo questa verità nei nostri cuori e troveremo la via nella notte più oscura.”»\nArchetipo: Eroi Strateghi\n\n📖 Storia:\nLa storia recente di Sarmatia è stata ricca di eroi scono- sciuti, uomini e donne che hanno appoggiato la causa e i principi della Libertà Dorata. Pochi, però, sono stati tanto devoti quanto Szymon Naumov, generale dell'e- sercito popolare e leale figlio della Confederazione. Szymon nacque in una piccola famiglia di contadini sui Monti Zupan, durante i giorni più oscuri della Confederazione, ben prima della Libertà Dorata. Szymon era un giovane robusto, che conduceva le greggi di famiglia attraverso i passi fino al mercato. La sua giovinezza fu scandita dalle tosature, dalla cura per gli animali e da viaggi a piedi nudi lungo sentieri che avrebbero fatto tremare un alpinista esperto. Un giorno, al mercato, Szymon vide un annuncio sulla bacheca del villaggio: l'esercito stava cercando volontari per difendere la Nazione dagli invasori ussu- rani e chiamava a raccolta ogni vero figlio del Paese. Szymon corse a cercare il padre, gli disse addio e si arruolò volontario. V enne immediatamente notato come una recluta eccezionale e un eccellente soldato, guadagnandosi il soprannome di “Buon Pastore” a causa delle sue origini. Szymon si distinse per il genio tattico e ottenne le più alte onorificenze. L'esercito divenne tutta la sua vita, con l'eccezione del tempo che dedi - cava alla lettura, sua grande passione. Abbandonò il suo posto solo per un breve viaggio a casa per visi - tare suo padre prima che spirasse. Durante questa licenza incontrò Marta, una ragazza che conosceva da giovane; si sposarono ed ebbero cinque figli. Grazie alla dedizione e all'intelligenza, Szymon fece carriera fino a ricevere il brevetto di generale dal Re in persona, appena prima della dichiarazione della Libertà Dorata. Essendo un esperto veterano venne incaricato di difendere la nuova pace della Confederazione e si ritirò solo molto tempo dopo, all'età di 56 anni. Felice della pensione, Szymon seguì la carriera mili- tare di suo figlio Pieter, anche lui distintosi come grande soldato. Pieter ha studiato all'estero, come parte di una missione diplomatica nel resto di Théah per rappre- sentare la rinnovata Confederazione, ed è tornato con numerose idee straniere che preoccupano il padre. T uttavia, quando il Re richiamò il Generale per aiutare a mantenere l'ordine, questi prese il figlio sotto la sua ala e i due oggi si adoperano per risolvere i problemi della Confederazione.\n\n🎯 Obiettivi:\nInsegnare a Pieter i veri valori del Sarmatismo. Pieter, il figlio di Szymon, è un giovanotto intelligente e un figlio devoto. I suoi viaggi all'estero gli hanno inculcato molte idee su come dovrebbe essere gover- nato il Paese, mentre il padre vuole istruirlo sul giusto comportamento di un vero figlio di Sarmatia. Liberare il Sjem da un malefico dievas. Un potente guerriero slachta ha fatto un patto con un dievas per divenire il più grande cavaliere della Confederazione. È necessario scoprire la sua identità e scacciare lo spirito prima che consumi il guerriero e porti il caos o, peggio ancora, ferisca il Re. Mettere a nudo la corruzione del Generale Ignacy Roch. Szymon ha scoperto alcune prove secondo cui il Generale Ignacy Roch è alleato di forze che mirano a destabilizzare la Libertà Dorata e a riportare la Confederazione al passato. Occorre scoprire da dove arrivino le tangenti pagate a Roch e portare le prova alla slachta.\n\n🎭 Consigli di Interpretazione (Giocare Szymon Naumov):\nIl Generale Naumov siede sempre eretto, parla con voce ferma e guarda gli interlocutori dritti negli occhi. Crede che la verità, sopra ogni altra cosa, sia il miglior strumento per agire. Militare di prima linea, Szymon può essere trovato a mangiare e bere in mezzo alle sue truppe, ma non si unisce mai ai loro racconti sboccati. Gli unici momenti in cui si lascia andare a ester - nazioni emotive è nei confronti del figlio. Nessuno ha mai incontrato il Generale senza un'uniforme immacolata, una rasatura perfetta e un buon libro. È l'immagine di tutto ciò che esiste di buono e onesto nella Confederazione Sarmatiana.",
        "pcData": {
            "name": "Szymon Naumov",
            "nation": "Confederazione Sarmatiana",
            "concept": "Eroi Strateghi • Confederazione Sarmatiana",
            "traits": {
                "Vigore": 3,
                "Grazia": 2,
                "Risolutezza": 2,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 3,
                "Atletica": 2,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 2,
                "Esibirsi": 1,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 0,
                "Mira": 2,
                "Mischia": 2,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 0,
                "Rissa": 0
            },
            "advantages": [
                "Accademia Militare",
                "Comando",
                "Gioco di Squadra",
                "L’Unione Fa la Forza",
                "Scuola di Maniere",
                "Senso dell’Orientamento"
            ],
            "virtue": "Virtù: La Strega Intuitivo. Attivando questa Virtù, l’Eroe può porre al GM una domanda con risposta sì/no riguardante un PNG. Il GM dovrà rispondere onestamente e, se possibile, aggiungere dettagli.",
            "hubris": "Hubris: Il Sole Orgoglioso. L’Eroe riceve un Punto Eroe quando rifiuta un’offerta d’aiuto, per esempio se un alleato spende un Punto Eroe per dargli Dadi Bonus e lui rifiuta.",
            "peculiarities": "Poseł. Ottiene un Punto Eroe ogni volta che insiste per una soluzione democratica quando sarebbe vantaggioso non votare. Ufficiale dell’Esercito. Ottiene un Punto Eroe ogni volta che prende il comando in una situazione di pericolo o estrema violenza.",
            "story": "La storia recente di Sarmatia è stata ricca di eroi scono- sciuti, uomini e donne che hanno appoggiato la causa e i principi della Libertà Dorata. Pochi, però, sono stati tanto devoti quanto Szymon Naumov, generale dell'e- sercito popolare e leale figlio della Confederazione. Szymon nacque in una piccola famiglia di contadini sui Monti Zupan, durante i giorni più oscuri della Confederazione, ben prima della Libertà Dorata. Szymon era un giovane robusto, che conduceva le greggi di famiglia attraverso i passi fino al mercato. La sua giovinezza fu scandita dalle tosature, dalla cura per gli animali e da viaggi a piedi nudi lungo sentieri che avrebbero fatto tremare un alpinista esperto. Un giorno, al mercato, Szymon vide un annuncio sulla bacheca del villaggio: l'esercito stava cercando volontari per difendere la Nazione dagli invasori ussu- rani e chiamava a raccolta ogni vero figlio del Paese. Szymon corse a cercare il padre, gli disse addio e si arruolò volontario. V enne immediatamente notato come una recluta eccezionale e un eccellente soldato, guadagnandosi il soprannome di “Buon Pastore” a causa delle sue origini. Szymon si distinse per il genio tattico e ottenne le più alte onorificenze. L'esercito divenne tutta la sua vita, con l'eccezione del tempo che dedi - cava alla lettura, sua grande passione. Abbandonò il suo posto solo per un breve viaggio a casa per visi - tare suo padre prima che spirasse. Durante questa licenza incontrò Marta, una ragazza che conosceva da giovane; si sposarono ed ebbero cinque figli. Grazie alla dedizione e all'intelligenza, Szymon fece carriera fino a ricevere il brevetto di generale dal Re in persona, appena prima della dichiarazione della Libertà Dorata. Essendo un esperto veterano venne incaricato di difendere la nuova pace della Confederazione e si ritirò solo molto tempo dopo, all'età di 56 anni. Felice della pensione, Szymon seguì la carriera mili- tare di suo figlio Pieter, anche lui distintosi come grande soldato. Pieter ha studiato all'estero, come parte di una missione diplomatica nel resto di Théah per rappre- sentare la rinnovata Confederazione, ed è tornato con numerose idee straniere che preoccupano il padre. T uttavia, quando il Re richiamò il Generale per aiutare a mantenere l'ordine, questi prese il figlio sotto la sua ala e i due oggi si adoperano per risolvere i problemi della Confederazione.",
            "objectives": "Insegnare a Pieter i veri valori del Sarmatismo. Pieter, il figlio di Szymon, è un giovanotto intelligente e un figlio devoto. I suoi viaggi all'estero gli hanno inculcato molte idee su come dovrebbe essere gover- nato il Paese, mentre il padre vuole istruirlo sul giusto comportamento di un vero figlio di Sarmatia. Liberare il Sjem da un malefico dievas. Un potente guerriero slachta ha fatto un patto con un dievas per divenire il più grande cavaliere della Confederazione. È necessario scoprire la sua identità e scacciare lo spirito prima che consumi il guerriero e porti il caos o, peggio ancora, ferisca il Re. Mettere a nudo la corruzione del Generale Ignacy Roch. Szymon ha scoperto alcune prove secondo cui il Generale Ignacy Roch è alleato di forze che mirano a destabilizzare la Libertà Dorata e a riportare la Confederazione al passato. Occorre scoprire da dove arrivino le tangenti pagate a Roch e portare le prova alla slachta.",
            "quote": "“Il cuore della Confederazione è la nostra libertà, ora e per sempre. Non dimentichia- molo. Serbiamo questa verità nei nostri cuori e troveremo la via nella notte più oscura.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 2, Acume 3, Panache 3 • Virtù: La Notte Senza Luna Discreta. Quando agisce dietro le quinte o attraverso un intermediario l’Eroe può attivare questa Virtù. Per il prossimo Rischio ogni dado conterà come un Incremento senza bisogno di tirare. • Hubris: Il Mendicante Invidiosa. L’Eroe riceve un Punto Eroe quando desidera fortemente qualcosa e agisce in modo poco accorto per ottenerla.",
        "ability": "«“La società è una danza tra dare e ricevere, dominio e sottomissione. Quando sono equilibrati creano una magnifica armonia, quando non lo sono creano solo sofferenza… e neppure del tipo divertente.”»\n\nVantaggi: Approccio Dinamico, Contatto: Corti di Vodacce, Linguista, Opportunista, Università, Vieni Qui\n\nPeculiarità: Jenny. Ottiene un Punto Eroe ogni volta che risolve un conflitto grazie alla seduzione o a proposte sessuali. Studiosa. Ottiene un Punto Eroe ogni volta che si metti nei guai per ottenere conoscenza.",
        "notes": "«“La società è una danza tra dare e ricevere, dominio e sottomissione. Quando sono equilibrati creano una magnifica armonia, quando non lo sono creano solo sofferenza… e neppure del tipo divertente.”»\nArchetipo: Eroi Strateghi\n\n📖 Storia:\nTitania nacque da una cortigiana e crebbe tra gonne pesanti, sale da ballo affollate e fumosi ritrovi malfa- mati. In questi scenari quasi onirici, uomini e donne si scambiavano segreti troppo importanti per le sue giovani orecchie e la bambina riempiva questi vuoti con la sua immaginazione. La professione di sua madre la intrigava: una corti- giana non è un semplice trofeo colorato, ma ha cultura e ambizioni profondissime e, con ogni segreto sussurrato e promessa di futuri favori, si fa strada nella politica dei suoi amanti. Man mano che Titania cresceva, sentiva il desiderio di fare simili conversazioni di fronte a un piano di battaglia, invece che su un materasso. La madre invecchiò e i clienti diminuirono. Uomini che le avevano fatto visita per anni svanirono, senza curarsi della donna che li aveva accompagnati tanto a lungo. Prima che la famiglia fosse ridotta in povertà, Titania iniziò l'unica professione che conosceva. Come cortigiana, la giovane si assicurò di non fare gli stessi errori della madre. Nonostante il suo amor patrio, Titania si rendeva conto che V odacce stava lentamente collassando su se stessa e che questa rovina era stata costruita col sudore di donne che non avevano alcuna voce in capitolo sul proprio destino, nonostante le fantasie di tante giovinette che pensavano di divenire le eminenze grigie. Se Titania doveva seguire le orme della madre, sarebbe stato per spezzare queste catene invisibili, non per esserne imprigionata. Titania è molto selettiva nella scelta della clientela: ammette solo uomini che cercano una mano ferma che li guidi. Li controlla con pugno di ferro e impone una serie di regole a cui lei si attiene e tutti devono aderire o pagarne le conseguenze. Titania ha iniziato a dare forma alla V odacce dei suoi sogni. Ha collezionato un'enorme quantità di libri, inclusi testi oscuri e trattati filosofici, e progetta di aprire una biblioteca pubblica. Sfruttando i suoi clienti ha fatto pubblicare e distribuire numerosi testi dedicati alla reale condizione delle donne di V odacce. L'amore di Titania per la parola scritta ha attirato l'attenzione del celebre farmacista Agrippa dell'Acqua. Questi ha cominciato a inviarle poesie e scritti. La cortigiana vede l'amore che lo studioso ha river - sato in queste opere, ma non gli ha ancora risposto. Sogna un amore libero dalle catene e alla luce del sole.\n\n🎯 Obiettivi:\nApprendere lo stile Mantovani da un maestro. Per raffinare le sue capacità e migliorare nella sua professione, Titania è alla ricerca di un maestro dello stile Mantovani. Ha sentito parlare di un certo Nicchi, che risiede presso il Principe Lucani. Purtroppo, Titania è malvista presso i Lucani, che la sospettano di aver fatto fuggire una delle loro figlie fuori dal paese. Aprire una biblioteca pubblica per i poveri di Vodacce. Titania ha accumulato un impressionante numero di libri in diversi magazzini sparsi per tutta V odacce. Ora, ciò che le occorre per rendere il suo sogno realtà è la proprietà di un terreno e l'approvazione di un Principe Mercante. Far adottare dalle scuole di Vodacce i suoi scritti sulla parità di diritti. Nel profondo, Titania è una filosofa e crede non solo nella necessità di educare le donne alla libertà, ma anche gli uomini all'eguaglianza. In fondo al cuore, tutti desiderano fare ciò che è giusto, ma devono avere gli strumenti necessari. Se riuscisse a far adottare il suo testo nelle scuole di V odacce, la Nazione farebbe un gigantesco passo avanti.\n\n🎭 Consigli di Interpretazione (Giocare Titania Pagani):\nTitania è un'ascoltatrice attenta, capace di prestare attenzione in silenzio per ore. Una parte importante del controllo è la consapevolezza di ciò che la circonda. Ha una voce calma e quando parla il suo tono è auto- revole. Non è una donna che ama ripetersi, sceglie ogni sillaba con cura e ogni inflessione è significativa. Nel privato, Titania ha un tetro senso dell'umorismo, non ha problemi a fare battute scherzose sulla sua professione e tiene moltissimo ai suoi cari.",
        "pcData": {
            "name": "Titania Pagani",
            "nation": "Vodacce",
            "concept": "Eroi Strateghi • Vodacce",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 2,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 3,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 0,
                "Convincere": 1,
                "Empatia": 2,
                "Esibirsi": 2,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 2,
                "Mira": 1,
                "Mischia": 2,
                "Nascondersi": 1,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 0
            },
            "advantages": [
                "Approccio Dinamico",
                "Contatto: Corti di Vodacce",
                "Linguista",
                "Opportunista",
                "Università",
                "Vieni Qui"
            ],
            "virtue": "Virtù: La Notte Senza Luna Discreta. Quando agisce dietro le quinte o attraverso un intermediario l’Eroe può attivare questa Virtù. Per il prossimo Rischio ogni dado conterà come un Incremento senza bisogno di tirare.",
            "hubris": "Hubris: Il Mendicante Invidiosa. L’Eroe riceve un Punto Eroe quando desidera fortemente qualcosa e agisce in modo poco accorto per ottenerla.",
            "peculiarities": "Jenny. Ottiene un Punto Eroe ogni volta che risolve un conflitto grazie alla seduzione o a proposte sessuali. Studiosa. Ottiene un Punto Eroe ogni volta che si metti nei guai per ottenere conoscenza.",
            "story": "Titania nacque da una cortigiana e crebbe tra gonne pesanti, sale da ballo affollate e fumosi ritrovi malfa- mati. In questi scenari quasi onirici, uomini e donne si scambiavano segreti troppo importanti per le sue giovani orecchie e la bambina riempiva questi vuoti con la sua immaginazione. La professione di sua madre la intrigava: una corti- giana non è un semplice trofeo colorato, ma ha cultura e ambizioni profondissime e, con ogni segreto sussurrato e promessa di futuri favori, si fa strada nella politica dei suoi amanti. Man mano che Titania cresceva, sentiva il desiderio di fare simili conversazioni di fronte a un piano di battaglia, invece che su un materasso. La madre invecchiò e i clienti diminuirono. Uomini che le avevano fatto visita per anni svanirono, senza curarsi della donna che li aveva accompagnati tanto a lungo. Prima che la famiglia fosse ridotta in povertà, Titania iniziò l'unica professione che conosceva. Come cortigiana, la giovane si assicurò di non fare gli stessi errori della madre. Nonostante il suo amor patrio, Titania si rendeva conto che V odacce stava lentamente collassando su se stessa e che questa rovina era stata costruita col sudore di donne che non avevano alcuna voce in capitolo sul proprio destino, nonostante le fantasie di tante giovinette che pensavano di divenire le eminenze grigie. Se Titania doveva seguire le orme della madre, sarebbe stato per spezzare queste catene invisibili, non per esserne imprigionata. Titania è molto selettiva nella scelta della clientela: ammette solo uomini che cercano una mano ferma che li guidi. Li controlla con pugno di ferro e impone una serie di regole a cui lei si attiene e tutti devono aderire o pagarne le conseguenze. Titania ha iniziato a dare forma alla V odacce dei suoi sogni. Ha collezionato un'enorme quantità di libri, inclusi testi oscuri e trattati filosofici, e progetta di aprire una biblioteca pubblica. Sfruttando i suoi clienti ha fatto pubblicare e distribuire numerosi testi dedicati alla reale condizione delle donne di V odacce. L'amore di Titania per la parola scritta ha attirato l'attenzione del celebre farmacista Agrippa dell'Acqua. Questi ha cominciato a inviarle poesie e scritti. La cortigiana vede l'amore che lo studioso ha river - sato in queste opere, ma non gli ha ancora risposto. Sogna un amore libero dalle catene e alla luce del sole.",
            "objectives": "Apprendere lo stile Mantovani da un maestro. Per raffinare le sue capacità e migliorare nella sua professione, Titania è alla ricerca di un maestro dello stile Mantovani. Ha sentito parlare di un certo Nicchi, che risiede presso il Principe Lucani. Purtroppo, Titania è malvista presso i Lucani, che la sospettano di aver fatto fuggire una delle loro figlie fuori dal paese. Aprire una biblioteca pubblica per i poveri di Vodacce. Titania ha accumulato un impressionante numero di libri in diversi magazzini sparsi per tutta V odacce. Ora, ciò che le occorre per rendere il suo sogno realtà è la proprietà di un terreno e l'approvazione di un Principe Mercante. Far adottare dalle scuole di Vodacce i suoi scritti sulla parità di diritti. Nel profondo, Titania è una filosofa e crede non solo nella necessità di educare le donne alla libertà, ma anche gli uomini all'eguaglianza. In fondo al cuore, tutti desiderano fare ciò che è giusto, ma devono avere gli strumenti necessari. Se riuscisse a far adottare il suo testo nelle scuole di V odacce, la Nazione farebbe un gigantesco passo avanti.",
            "quote": "“La società è una danza tra dare e ricevere, dominio e sottomissione. Quando sono equilibrati creano una magnifica armonia, quando non lo sono creano solo sofferenza… e neppure del tipo divertente.”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 3, Acume 4, Panache 2 • Virtù: Il Diavolo Astuto. L’Eroe può attivare questa Virtù dopo che un Malvagio ha speso degli Incrementi per un’Azione. L’Azione fallirà automaticamente, ma gli Incrementi saranno spesi comunque. • Hubris: Il Sole Orgoglioso. L’Eroe riceve un Punto Eroe quando rifiuta un’offerta d’aiuto, per esempio se un alleato spende un Punto Eroe per dargli Dadi Bonus e lui rifiuta.",
        "ability": "«“Non preoccuparti del barone e dei suoi uomini. Sono degli idioti che, aggiungerei, mangiano e bevono troppo in fretta. Una sfortunata debolezza di cui ho approfittato.”»\n\nVantaggi: Contatto: Corti Vodacce, Fautore di Miracoli, Immunità ai Veleni, Manualità, Mastro Artigiano: Farmacista, Orologio Biologico, Scafato\n\nPeculiarità: Artigiano. Ottiene un Punto Eroe ogni volta che sfrutta le modeste abilità artigiane per risolvere problemi considerati troppo complessi per avere una soluzione semplice. Dottore. Ottiene un Punto Eroe ogni volta che si occupa delle ferite di un Malvagio o delle sue vittime innocenti.",
        "notes": "«“Non preoccuparti del barone e dei suoi uomini. Sono degli idioti che, aggiungerei, mangiano e bevono troppo in fretta. Una sfortunata debolezza di cui ho approfittato.”»\nArchetipo: Eroi Baluardo\n\n📖 Storia:\nAgrippa è il figlio maggiore di Marisa Encantada, una delle più celebri cortigiane di V odacce. Sua madre era molto indulgente e fornì ai figli ogni lusso possibile, inclusa una serie di insegnanti di matematica, lingue, etichetta e poesia. Con il passare degli anni, Agrippa si dedicò allo studio delle filosofie orientali e apprese che tutte le cose avevano uno spirito invisibile e che questi erano legati tra loro. Questa nozione gli fece compren- dere che parole come “lui” o “lei” fossero insufficienti e cominciò a parlare di sé al plurale. Crescendo, Agrippa chiese di ricevere un ulteriore istru- zione nell' arte di distillare farmaci e veleni e ben presto cominciò a produrne su richiesta di numerose cortigiane. Tra le sue ricette più celebri ci sono un tè contraccet- tivo e un decotto capace di provocare incubi raggelanti ai clienti che si comportavano male. Ben presto la sua reputazione come “Santo dei V eleni” delle cortigiane divenne solidissima. Agrippa ama giocare a scacchi e ha persino imparato un' infarinatura di Sabat. Considera il gioco simile al produrre veleni: si continua a persistere finché non si trova la giusta combinazione. Profondo ammiratore di menti astute e flessibili, Agrippa è particolarmente affa- scinato da Titania Pagani, una filosofa e cortigiana. È l' unica persona che Agrippa abbia mai desiderato cono- scere a fondo. Incerto sul modo corretto di avvicinarla, le ha inviato poesie in segno d' affetto e come omaggio alla sua bellezza. Preoccupato di non essere invadente, Agrippa è più che contento di attendere la risposta di Titania. Pur essendo privo di fascino e carisma naturali, Agrippa ha costituito una rete di spie e alleati. Un semplice biglietto di pronta guarigione a una cortigiana, seguito da una domanda appropriata o un tocco amichevole sono ottimi argomenti per ingraziarsi queste donne tanto facilmente dimenticate. Agrippa ha costruito un impero dal nulla e oggi è pronto ad agire, a viaggiare per tutta V odacce per aiutare le cortigiane a combattere l'oppressione. Il tempo, però, non è dalla sua parte: un agente della famiglia Villanova lo ha avvelenato, dopo che Agrippa aveva somministrato a un cugino di Giovanni Villanova il suo decotto da incubi. Il veleno agisce molto lentamente e Agrippa teme di avere solo un anno o due di vita, a meno di non scoprire un antidoto.\n\n🎯 Obiettivi:\nProteggere la cortigiana Mizzini, incinta, dal suo ex-cliente. Mizzini sostiene di essere incinta del fratello di Agrippa, Lucius. La sorella Strega di uno dei suoi clienti regolari, Giorgio Salluci, afferma invece, che il bimbo è della sua famiglia. Mizzini si è rivolta ad Agrippa per essere protetta, perché questo genere di disaccordi tende a concludersi male per una cortigiana. Acquisire il famoso veleno “Lamento di Hesta” . Il Lamento di Hesta è un veleno che provoca l'im - potenza. È impossibile da rintracciare e i suoi effetti sono permanenti finché non si assume un antidoto. È una punizione molto popolare nei confronti dei clienti che superano certi limiti. Agrippa vuole usarlo contro Bruno Marzani, un ricco mercante che si rifiuta di pagare la sua cortigiana e minaccia di rivelarne l'iden- tità se la donna dovesse protestare. Trovare un antidoto al Lamento della Vedova. Un agente di Villanova ha avvelenato Agrippa con il Lamento della V edova, nonostante la sua immunità a ogni altra tossina conosciuta. Il Lamento è un veleno ad azione lentissima, che porta alla morte dopo anni, ed è infuso di magia per incrementarne la potenza. Per riuscire a curarsi, Agrippa dovrà prima di tutto annullare la magia all'interno del veleno.\n\n🎭 Consigli di Interpretazione (Giocare Agrippa Dell’Acqua):\nAgrippa è cortese, gentile e lo diventa sempre di più quando si arrabbia. Quando comincia a mormorare è meglio smettere di toccare o ingoiare qualunque cosa a portata di mano. Agrippa indossa sempre abiti larghi per nascondere i danni causati dai veleni. Li toglie solo in presenza di alleati, un segno di fiducia assoluta, o per intimorire quei nemici che lo sottovalutano. Agrippa ama l' arte – parlargli di libri, sculture e dipinti è un ottimo mezzo per avere una conversazione amiche- vole – mentre trova fastidiosi i flirt e le allusioni roman- tiche. Sotto l' apparenza di un eremita amante dell' arte si nasconde una determinazione assoluta: Agrippa non si ferma davanti a nulla per difendere i suoi protetti, cosa che potrebbe condannarlo se non sarà più che attento.",
        "pcData": {
            "name": "Agrippa Dell’Acqua",
            "nation": "Vodacce",
            "concept": "Eroi Baluardo • Vodacce",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 4,
                "Panache": 2
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 0,
                "Atletica": 1,
                "Cavalcare": 1,
                "Convincere": 2,
                "Empatia": 2,
                "Esibirsi": 1,
                "Furto": 2,
                "Intimidire": 0,
                "Istruzione": 3,
                "Mira": 1,
                "Mischia": 0,
                "Nascondersi": 3,
                "Navigazione": 0,
                "Notare": 3,
                "Rissa": 0
            },
            "advantages": [
                "Contatto: Corti Vodacce",
                "Fautore di Miracoli",
                "Immunità ai Veleni",
                "Manualità",
                "Mastro Artigiano: Farmacista",
                "Orologio Biologico",
                "Scafato"
            ],
            "virtue": "Virtù: Il Diavolo Astuto. L’Eroe può attivare questa Virtù dopo che un Malvagio ha speso degli Incrementi per un’Azione. L’Azione fallirà automaticamente, ma gli Incrementi saranno spesi comunque.",
            "hubris": "Hubris: Il Sole Orgoglioso. L’Eroe riceve un Punto Eroe quando rifiuta un’offerta d’aiuto, per esempio se un alleato spende un Punto Eroe per dargli Dadi Bonus e lui rifiuta.",
            "peculiarities": "Artigiano. Ottiene un Punto Eroe ogni volta che sfrutta le modeste abilità artigiane per risolvere problemi considerati troppo complessi per avere una soluzione semplice. Dottore. Ottiene un Punto Eroe ogni volta che si occupa delle ferite di un Malvagio o delle sue vittime innocenti.",
            "story": "Agrippa è il figlio maggiore di Marisa Encantada, una delle più celebri cortigiane di V odacce. Sua madre era molto indulgente e fornì ai figli ogni lusso possibile, inclusa una serie di insegnanti di matematica, lingue, etichetta e poesia. Con il passare degli anni, Agrippa si dedicò allo studio delle filosofie orientali e apprese che tutte le cose avevano uno spirito invisibile e che questi erano legati tra loro. Questa nozione gli fece compren- dere che parole come “lui” o “lei” fossero insufficienti e cominciò a parlare di sé al plurale. Crescendo, Agrippa chiese di ricevere un ulteriore istru- zione nell' arte di distillare farmaci e veleni e ben presto cominciò a produrne su richiesta di numerose cortigiane. Tra le sue ricette più celebri ci sono un tè contraccet- tivo e un decotto capace di provocare incubi raggelanti ai clienti che si comportavano male. Ben presto la sua reputazione come “Santo dei V eleni” delle cortigiane divenne solidissima. Agrippa ama giocare a scacchi e ha persino imparato un' infarinatura di Sabat. Considera il gioco simile al produrre veleni: si continua a persistere finché non si trova la giusta combinazione. Profondo ammiratore di menti astute e flessibili, Agrippa è particolarmente affa- scinato da Titania Pagani, una filosofa e cortigiana. È l' unica persona che Agrippa abbia mai desiderato cono- scere a fondo. Incerto sul modo corretto di avvicinarla, le ha inviato poesie in segno d' affetto e come omaggio alla sua bellezza. Preoccupato di non essere invadente, Agrippa è più che contento di attendere la risposta di Titania. Pur essendo privo di fascino e carisma naturali, Agrippa ha costituito una rete di spie e alleati. Un semplice biglietto di pronta guarigione a una cortigiana, seguito da una domanda appropriata o un tocco amichevole sono ottimi argomenti per ingraziarsi queste donne tanto facilmente dimenticate. Agrippa ha costruito un impero dal nulla e oggi è pronto ad agire, a viaggiare per tutta V odacce per aiutare le cortigiane a combattere l'oppressione. Il tempo, però, non è dalla sua parte: un agente della famiglia Villanova lo ha avvelenato, dopo che Agrippa aveva somministrato a un cugino di Giovanni Villanova il suo decotto da incubi. Il veleno agisce molto lentamente e Agrippa teme di avere solo un anno o due di vita, a meno di non scoprire un antidoto.",
            "objectives": "Proteggere la cortigiana Mizzini, incinta, dal suo ex-cliente. Mizzini sostiene di essere incinta del fratello di Agrippa, Lucius. La sorella Strega di uno dei suoi clienti regolari, Giorgio Salluci, afferma invece, che il bimbo è della sua famiglia. Mizzini si è rivolta ad Agrippa per essere protetta, perché questo genere di disaccordi tende a concludersi male per una cortigiana. Acquisire il famoso veleno “Lamento di Hesta” . Il Lamento di Hesta è un veleno che provoca l'im - potenza. È impossibile da rintracciare e i suoi effetti sono permanenti finché non si assume un antidoto. È una punizione molto popolare nei confronti dei clienti che superano certi limiti. Agrippa vuole usarlo contro Bruno Marzani, un ricco mercante che si rifiuta di pagare la sua cortigiana e minaccia di rivelarne l'iden- tità se la donna dovesse protestare. Trovare un antidoto al Lamento della Vedova. Un agente di Villanova ha avvelenato Agrippa con il Lamento della V edova, nonostante la sua immunità a ogni altra tossina conosciuta. Il Lamento è un veleno ad azione lentissima, che porta alla morte dopo anni, ed è infuso di magia per incrementarne la potenza. Per riuscire a curarsi, Agrippa dovrà prima di tutto annullare la magia all'interno del veleno.",
            "quote": "“Non preoccuparti del barone e dei suoi uomini. Sono degli idioti che, aggiungerei, mangiano e bevono troppo in fretta. Una sfortunata debolezza di cui ho approfittato.”"
        }
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
        "traits": "Vigore 4, Grazia 2, Risolutezza 2, Acume 3, Panache 2 • Virtù: I Troni Confortante. Attivando questa Virtù, l’Eroe cancella gli effetti della Paura su se stesso e i suoi amici. • Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
        "ability": "«“Certo, sono ‘solo una ragazza’ milord, ma quella spada non vi sarà di molto aiuto. Potrei anche ordinare subito il mio whisky perché non sarà uno scontro lungo.”»\n\nVantaggi: Colosso, Esperta di Sopravvivenza, Sala d’Armi: Drexel, Spirito Valoroso, Tratto Leggendario: Vigore, Volontà Indomabile\n\nPeculiarità: Contadina. Ottiene un Punto Eroe ogni volta che risolve un problema complesso usando semplici e vecchie soluzioni contadine. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
        "notes": "«“Certo, sono ‘solo una ragazza’ milord, ma quella spada non vi sarà di molto aiuto. Potrei anche ordinare subito il mio whisky perché non sarà uno scontro lungo.”»\nArchetipo: Eroi Baluardo\n\n📖 Storia:\nGli Highlander sono tenaci, ma pochi di essi sono duri quanto Cadha Mag Raith. Cresciuta nei pressi delle paludi, che furono parte delle terre del clan MacIver, con un padre severissimo e otto fratelli maggiori, fece sempre del suo meglio per seguire il loro esempio. La madre morì di parto e, per questo, Cadha non venne mai educata come una donna delle Highland e preferì le lezioni dei suoi fratelli a base di spada, brocchiere e lividi. Messa in minoranza dai fratelli e mai considerata abbastanza brava dal padre, Cadha si sforzò sempre di renderli fieri di lei. Di giorno faticava nei campi e di notte esplorava le paludi dei MacIver, dove fece amicizia con un gruppo di rifugiati. Tra questi vi era una donna che la prese in simpatia, si chiamava Einhir, aveva un occhio solo e un temperamento feroce. Era veterana di numerose guerre e passò ore ad addestrare Cadha all'arte della spada, del combattimento a mani nude e del bere. Con il passare del tempo, il lavoro costante fece crescere Cadha in modo prodigioso in forza e altezza, tanto che si diceva fosse imparentata con gli ogre. Cominciò a battere i fratelli nella lotta, poi gli sfidanti del villaggio, quindi altri che giungevano da più lontano, sempre costringendo il perdente a pagarle da bere. A un certo punto, giunse notizia che una nuova regina aveva reclamato il trono di Avalon. Laird MacIver si oppose e reclutò il padre e i fratelli di Cadha nel suo esercito. Combatterono tutti valoro- samente, ma nessuno fece ritorno. L'unica famiglia rimasta a Cadha erano gli abitanti della palude, ormai tanto numerosi da attirare l'attenzione del Laird. I suoi uomini arrivarono per reclutare la gente della palude, ma si scontrarono con Cadha e nessuno di loro fece ritorno. Auto-nominatasi “Regina delle Paludi” , Cadha ne protesse gli abitanti contro il signorotto e la popo - lazione locale. Reso sicuro il territorio, rivolse la sua attenzione verso Sud, alla Regina Elaine. Sapeva che c'erano numerosi altri signori prepotenti come il Laird e diventare Campione di questa Regina, che sembrava essere un difensore del popolo e custode del Graal, era il modo migliore per sfidarli. Cadha ritiene che, se l'Alto Re e il parlamento credono in Elaine, allora forse è davvero degna dei suoi servigi. Per questo motivo la Highlander si sta dirigendo verso Sud, per “discutere” con la sovrana.\n\n🎯 Obiettivi:\nAddestrare la prossima Regina delle Paludi. Cadha sa che Laird MacIver non dimentica e che non lascerà per sempre in pace la gente della palude. Per questo motivo, vuole addestrare una nuova “Regina della Paludi” , che la protegga, proprio come Einhir aveva fatto con lei. Divenire il nuovo campione della Regina Elaine. Il desiderio di proteggere il popolo ha ormai supe - rato i confini del “regno” di Cadha. Come campione di Elaine, potrebbe sfruttare la sua incredibile abilità marziale per difendere tutte le Isole Incantate. Se Cadha deciderà che Elaine è davvero degna, avrà un'infinita schiera di nemici. Pochi avversari sono più pericolosi di coloro che vogliono il male della Regina. Sfidare e battere ogni degno avversario. Il viaggio di Cadha verso Sud è rallentato dal suo costante bisogno di affrontare ogni guerriero che incontra. Di recente ha scoperto che un cugino di Laird MacIver è un nobile avaloniano con una folta schiera di letali seguaci e un profondo odio per la Regina. Sembra che il suo viaggio sarà ancora più lungo del previsto.\n\n🎭 Consigli di Interpretazione (Giocare Cadha Mag Raith):\nLa risata di Cadha è come un ruggito che spaventa i mostri. La sua incapacità di opporsi al Laird quando reclutò la sua famiglia e la loro morte la ossessionano ancora, è questo il motivo per cui non abbandona mai chi è in pericolo. Non cerca lo scontro, ma affronta chiunque la sfidi, non importa il luogo e l'ora, e il perdente paga sempre da bere (Cadha non ricorda l'ultima volta che ha pagato). Sempre sicura di sé, sempre alla ricerca di una bella rissa o di un contadino in pericolo, Cadha potrebbe essere la prossima Bonnie McGee… e lo sa bene…",
        "pcData": {
            "name": "Cadha Mag Raith",
            "nation": "Le Marche delle Highland",
            "concept": "Eroi Baluardo • Le Marche delle Highland",
            "traits": {
                "Vigore": 4,
                "Grazia": 2,
                "Risolutezza": 2,
                "Acume": 3,
                "Panache": 2
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 2,
                "Atletica": 3,
                "Cavalcare": 2,
                "Convincere": 1,
                "Empatia": 2,
                "Esibirsi": 2,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 0,
                "Mira": 0,
                "Mischia": 3,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 1
            },
            "advantages": [
                "Colosso",
                "Esperta di Sopravvivenza",
                "Sala d’Armi: Drexel",
                "Spirito Valoroso",
                "Tratto Leggendario: Vigore",
                "Volontà Indomabile"
            ],
            "virtue": "Virtù: I Troni Confortante. Attivando questa Virtù, l’Eroe cancella gli effetti della Paura su se stesso e i suoi amici.",
            "hubris": "Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
            "peculiarities": "Contadina. Ottiene un Punto Eroe ogni volta che risolve un problema complesso usando semplici e vecchie soluzioni contadine. Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.",
            "story": "Gli Highlander sono tenaci, ma pochi di essi sono duri quanto Cadha Mag Raith. Cresciuta nei pressi delle paludi, che furono parte delle terre del clan MacIver, con un padre severissimo e otto fratelli maggiori, fece sempre del suo meglio per seguire il loro esempio. La madre morì di parto e, per questo, Cadha non venne mai educata come una donna delle Highland e preferì le lezioni dei suoi fratelli a base di spada, brocchiere e lividi. Messa in minoranza dai fratelli e mai considerata abbastanza brava dal padre, Cadha si sforzò sempre di renderli fieri di lei. Di giorno faticava nei campi e di notte esplorava le paludi dei MacIver, dove fece amicizia con un gruppo di rifugiati. Tra questi vi era una donna che la prese in simpatia, si chiamava Einhir, aveva un occhio solo e un temperamento feroce. Era veterana di numerose guerre e passò ore ad addestrare Cadha all'arte della spada, del combattimento a mani nude e del bere. Con il passare del tempo, il lavoro costante fece crescere Cadha in modo prodigioso in forza e altezza, tanto che si diceva fosse imparentata con gli ogre. Cominciò a battere i fratelli nella lotta, poi gli sfidanti del villaggio, quindi altri che giungevano da più lontano, sempre costringendo il perdente a pagarle da bere. A un certo punto, giunse notizia che una nuova regina aveva reclamato il trono di Avalon. Laird MacIver si oppose e reclutò il padre e i fratelli di Cadha nel suo esercito. Combatterono tutti valoro- samente, ma nessuno fece ritorno. L'unica famiglia rimasta a Cadha erano gli abitanti della palude, ormai tanto numerosi da attirare l'attenzione del Laird. I suoi uomini arrivarono per reclutare la gente della palude, ma si scontrarono con Cadha e nessuno di loro fece ritorno. Auto-nominatasi “Regina delle Paludi” , Cadha ne protesse gli abitanti contro il signorotto e la popo - lazione locale. Reso sicuro il territorio, rivolse la sua attenzione verso Sud, alla Regina Elaine. Sapeva che c'erano numerosi altri signori prepotenti come il Laird e diventare Campione di questa Regina, che sembrava essere un difensore del popolo e custode del Graal, era il modo migliore per sfidarli. Cadha ritiene che, se l'Alto Re e il parlamento credono in Elaine, allora forse è davvero degna dei suoi servigi. Per questo motivo la Highlander si sta dirigendo verso Sud, per “discutere” con la sovrana.",
            "objectives": "Addestrare la prossima Regina delle Paludi. Cadha sa che Laird MacIver non dimentica e che non lascerà per sempre in pace la gente della palude. Per questo motivo, vuole addestrare una nuova “Regina della Paludi” , che la protegga, proprio come Einhir aveva fatto con lei. Divenire il nuovo campione della Regina Elaine. Il desiderio di proteggere il popolo ha ormai supe - rato i confini del “regno” di Cadha. Come campione di Elaine, potrebbe sfruttare la sua incredibile abilità marziale per difendere tutte le Isole Incantate. Se Cadha deciderà che Elaine è davvero degna, avrà un'infinita schiera di nemici. Pochi avversari sono più pericolosi di coloro che vogliono il male della Regina. Sfidare e battere ogni degno avversario. Il viaggio di Cadha verso Sud è rallentato dal suo costante bisogno di affrontare ogni guerriero che incontra. Di recente ha scoperto che un cugino di Laird MacIver è un nobile avaloniano con una folta schiera di letali seguaci e un profondo odio per la Regina. Sembra che il suo viaggio sarà ancora più lungo del previsto.",
            "quote": "“Certo, sono ‘solo una ragazza’ milord, ma quella spada non vi sarà di molto aiuto. Potrei anche ordinare subito il mio whisky perché non sarà uno scontro lungo.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 3, Acume 2, Panache 3 • Virtù: L’Eroe Coraggioso. Attivando questa Virtù, l’Eroe ottiene un numero di Dadi Bonus pari al Grado di Paura del suo avversario. • Hubris: Il Profeta Fanatico. L’Eroe riceve un Punto Eroe quando difende vigorosamente le sue idee nel posto o nel momento sbagliato. Stregoneria Estandart ha un Marchio Minore su una coperta che sua madre gli cucì quando era piccolo.",
        "ability": "«“Puoi concentrarti sui miei occhi per un attimo? Il mio nome è Estandart e so come ti senti. Hai un dono di cui devi essere orgoglioso, ma… ascoltami: ci sono persone potenti che non apprezzeranno il tuo dono e, se non staremo attenti, potrebbero farti del male o costringerti a fare cose che non vorresti.”»\n\nVantaggi: Fatto!, Gioco di Squadra, In Balia degli Eventi, Opportunista, Orologio Biologico, Stregoneria: Porté 2\n\nPeculiarità: Servitore. Ottiene un Punto Eroe ogni volta che si mette in pericolo per assistere qualcuno in un compito difficile. Sorcier Porté. Ottiene un Punto Eroe ogni volta che chiude una Blessure creata da un Malvagio.",
        "notes": "«“Puoi concentrarti sui miei occhi per un attimo? Il mio nome è Estandart e so come ti senti. Hai un dono di cui devi essere orgoglioso, ma… ascoltami: ci sono persone potenti che non apprezzeranno il tuo dono e, se non staremo attenti, potrebbero farti del male o costringerti a fare cose che non vorresti.”»\nArchetipo: Eroi Baluardo\n\n📖 Storia:\nLa Magie des Portails è un'arte stregonesca solitamente riservata alla nobiltà di Montaigne. In realtà, il Porté si è diffuso in lungo e in largo grazie alle scappatelle e alle storie d'amore degli aristocratici e il numero di stre- goni non registrati cresce costantemente, nonostante gli sforzi dei più crudeli puristi per eliminarli. Il padre del nobile Barnabé de Milly, uno stregone, spesso rimarcava come l'assenza di magia nel figlio fosse una delusione per lui. Neppure i tre figli legittimi di Barnabé, da lui avuti prima della morte della moglie, mostrarono mai alcun potere. Quando il nobiluomo si rese conto che uno dei suoi bastardi, Estandart, era uno stregone, lo fece togliere alla madre, lo riconobbe formalmente e lo mise all'opera per aiutarlo nei suoi piani maligni. Dopo aver passato tutta l' infanzia ad aprire portali per il padre e i suoi complici, Estandart comprese che il Porté non gli avrebbe mai permesso di ottenere l'amore paterno. Quindi riunì le sue proprietà, aprì un portale e Camminò fino all'appartamento della madre. Quando Barnabé giunse sul posto, Estandart e la madre erano fuggiti da tempo. Da allora, sono sempre riusciti a restare un passo avanti ai segugi inviati dal padre. Estandart fa uso del Porté per guadagnare denaro, se necessario, ma trascorre ogni momento libero ad aiutare stregoni ribelli a sfuggire alle grinfie di individui come suo padre. Sebbene un Porté possa sfuggire facilmente a un peri- colo immediato, ben pochi figli bastardi della nobiltà hanno le risorse necessarie per allontanarsi molto da casa. Estandart ha organizzato una rete clandestina di rifugi e amici a cui i suoi protetti possono rivolgersi per sfuggire alle carrozze nere della nobiltà. Spostandosi continuamente tra numerose località all' interno di Charouse, questi sorcier possono nascon- dersi, riposare e addestrarsi in relativa comodità, certi di essere tra amici. Quando il pericolo si avvicina, un sistema di allarmi e sentinelle permette loro di prepa- rare un portale e fuggire prima che i cacciatori assoldati dai nobili facciano la loro comparsa. Alcuni rifugi sono stati scoperti, ma finora Estandart è riuscito a organiz- zarne di nuovi in breve tempo. È il cuore pulsante e la mente di questa organizzazione, ma… se gli dovesse accadere qualcosa la rete potrà sopravvivere?\n\n🎯 Obiettivi:\nAffrontare gli uomini inviati da suo padre per ritrovarlo. Barnabé de Milly non è contento che il figlio stia distruggendo la tradizione elitaria di Montaigne e ha assoldato tre investigatori per ritrovarlo. Estandart ha visto uno di loro fuggire tramite un portale ed è sicuro che non potrà evitarli per sempre. Assicurarsi un nuovo rifugio sicuro. Persino con numerosi Marchi del Sangue, un sorcier ha bisogno di un rifugio. Oltre a numerosi apparta- menti in tutta Charouse, Estandart ha un alloggio sicuro nelle catacombe. Purtroppo, tra i membri della Società degli Esploratori e i ragazzini impertinenti, oggi tutti sembrano esplorare questi cunicoli. Per restare un passo avanti ai suoi nemici dovrà preparare un piano di emergenza. Scoprire chi sta lasciando blessure nelle strade di Charouse. Un sorcier sta creando terribili blessure in tutta Charouse, ma Estandart è convinto che si tratti di un individuo privo di addestramento formale, che agisce per ignoranza e non per malizia. Finora i Moschettieri hanno dovuto far murare almeno una delle principali arterie commerciali della città a causa di una lacera- zione sanguinante e urlante. Le sinistre carrozze nere, pronte a rapire qualsiasi sorcier de Porté “ i m p r e v i s t o ”, non possono essere troppo lontane ed Estandart dovrà trovare questa povera anima per primo.\n\n🎭 Consigli di Interpretazione (Giocare Estandart de Milly):\nEstandart è tanto tollerante e compassionevole verso gli altri, quanto critico verso se stesso. I suoi peccati passati gli pesano sulle spalle, ma non lo lascia traspa- rire, tranne quando crede di essere solo. Per motivi personali e professionali è un ottimo ascoltatore e, quando qualcuno gli parla, ha già formulato nella mente la prossima domanda importante. Passa agilmente da un comportamento nobile e raffinato a uno semplice e diretto, in base alle circostanze. Non è mai altezzoso, ma sa essere fermo e convincente quando necessario.",
        "pcData": {
            "name": "Estandart de Milly",
            "nation": "Montaigne",
            "concept": "Eroi Baluardo • Montaigne",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 3,
                "Acume": 2,
                "Panache": 3
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 0,
                "Cavalcare": 2,
                "Convincere": 2,
                "Empatia": 3,
                "Esibirsi": 0,
                "Furto": 3,
                "Intimidire": 0,
                "Istruzione": 2,
                "Mira": 0,
                "Mischia": 0,
                "Nascondersi": 3,
                "Navigazione": 0,
                "Notare": 3,
                "Rissa": 0
            },
            "advantages": [
                "Fatto!",
                "Gioco di Squadra",
                "In Balia degli Eventi",
                "Opportunista",
                "Orologio Biologico",
                "Stregoneria: Porté 2"
            ],
            "virtue": "Virtù: L’Eroe Coraggioso. Attivando questa Virtù, l’Eroe ottiene un numero di Dadi Bonus pari al Grado di Paura del suo avversario.",
            "hubris": "Hubris: Il Profeta Fanatico. L’Eroe riceve un Punto Eroe quando difende vigorosamente le sue idee nel posto o nel momento sbagliato. Stregoneria Estandart ha un Marchio Minore su una coperta che sua madre gli cucì quando era piccolo.",
            "peculiarities": "Servitore. Ottiene un Punto Eroe ogni volta che si mette in pericolo per assistere qualcuno in un compito difficile. Sorcier Porté. Ottiene un Punto Eroe ogni volta che chiude una Blessure creata da un Malvagio.",
            "story": "La Magie des Portails è un'arte stregonesca solitamente riservata alla nobiltà di Montaigne. In realtà, il Porté si è diffuso in lungo e in largo grazie alle scappatelle e alle storie d'amore degli aristocratici e il numero di stre- goni non registrati cresce costantemente, nonostante gli sforzi dei più crudeli puristi per eliminarli. Il padre del nobile Barnabé de Milly, uno stregone, spesso rimarcava come l'assenza di magia nel figlio fosse una delusione per lui. Neppure i tre figli legittimi di Barnabé, da lui avuti prima della morte della moglie, mostrarono mai alcun potere. Quando il nobiluomo si rese conto che uno dei suoi bastardi, Estandart, era uno stregone, lo fece togliere alla madre, lo riconobbe formalmente e lo mise all'opera per aiutarlo nei suoi piani maligni. Dopo aver passato tutta l' infanzia ad aprire portali per il padre e i suoi complici, Estandart comprese che il Porté non gli avrebbe mai permesso di ottenere l'amore paterno. Quindi riunì le sue proprietà, aprì un portale e Camminò fino all'appartamento della madre. Quando Barnabé giunse sul posto, Estandart e la madre erano fuggiti da tempo. Da allora, sono sempre riusciti a restare un passo avanti ai segugi inviati dal padre. Estandart fa uso del Porté per guadagnare denaro, se necessario, ma trascorre ogni momento libero ad aiutare stregoni ribelli a sfuggire alle grinfie di individui come suo padre. Sebbene un Porté possa sfuggire facilmente a un peri- colo immediato, ben pochi figli bastardi della nobiltà hanno le risorse necessarie per allontanarsi molto da casa. Estandart ha organizzato una rete clandestina di rifugi e amici a cui i suoi protetti possono rivolgersi per sfuggire alle carrozze nere della nobiltà. Spostandosi continuamente tra numerose località all' interno di Charouse, questi sorcier possono nascon- dersi, riposare e addestrarsi in relativa comodità, certi di essere tra amici. Quando il pericolo si avvicina, un sistema di allarmi e sentinelle permette loro di prepa- rare un portale e fuggire prima che i cacciatori assoldati dai nobili facciano la loro comparsa. Alcuni rifugi sono stati scoperti, ma finora Estandart è riuscito a organiz- zarne di nuovi in breve tempo. È il cuore pulsante e la mente di questa organizzazione, ma… se gli dovesse accadere qualcosa la rete potrà sopravvivere?",
            "objectives": "Affrontare gli uomini inviati da suo padre per ritrovarlo. Barnabé de Milly non è contento che il figlio stia distruggendo la tradizione elitaria di Montaigne e ha assoldato tre investigatori per ritrovarlo. Estandart ha visto uno di loro fuggire tramite un portale ed è sicuro che non potrà evitarli per sempre. Assicurarsi un nuovo rifugio sicuro. Persino con numerosi Marchi del Sangue, un sorcier ha bisogno di un rifugio. Oltre a numerosi apparta- menti in tutta Charouse, Estandart ha un alloggio sicuro nelle catacombe. Purtroppo, tra i membri della Società degli Esploratori e i ragazzini impertinenti, oggi tutti sembrano esplorare questi cunicoli. Per restare un passo avanti ai suoi nemici dovrà preparare un piano di emergenza. Scoprire chi sta lasciando blessure nelle strade di Charouse. Un sorcier sta creando terribili blessure in tutta Charouse, ma Estandart è convinto che si tratti di un individuo privo di addestramento formale, che agisce per ignoranza e non per malizia. Finora i Moschettieri hanno dovuto far murare almeno una delle principali arterie commerciali della città a causa di una lacera- zione sanguinante e urlante. Le sinistre carrozze nere, pronte a rapire qualsiasi sorcier de Porté “ i m p r e v i s t o ”, non possono essere troppo lontane ed Estandart dovrà trovare questa povera anima per primo.",
            "quote": "“Puoi concentrarti sui miei occhi per un attimo? Il mio nome è Estandart e so come ti senti. Hai un dono di cui devi essere orgoglioso, ma… ascoltami: ci sono persone potenti che non apprezzeranno il tuo dono e, se non staremo attenti, potrebbero farti del male o costringerti a fare cose che non vorresti.”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 3, Acume 3, Panache 3 • Virtù: La Strada Amichevole. Attivando questa Virtù quando l’Eroe incontra un personaggio per la prima volta, anche un Malvagio, questi lo tratterà amichevolmente per una Scena. • Hubris: La Torre Arrogante. L’Eroe riceve un Punto Eroe quando mostra disprezzo o considera indegno di attenzione un Malvagio o chi potrebbe causare danno ai suoi amici.",
        "ability": "«“Un brindisi! Alla sposa! Alla sposa, allo sposo e a tutti voi qui riuniti! Provate la seconda spina, provatele tutte! Siate felici stanotte e pagate domani!”»\n\nVantaggi: Bevitrice Emerita, Manualità, Mastro Artigiano: Birraia, Orologio Biologico, Rissosa, Scuola di Maniere, Stomaco di Ferro\n\nPeculiarità: Artigiana. Ottiene un Punto Eroe ogni volta che sfrutta le modeste abilità artigiane per risolvere problemi considerati troppo complessi per avere una soluzione semplice. Mercante. Ottiene un Punto Eroe ogni volta che vende un oggetto per molto meno del suo reale valore a chi ne ha un disperato bisogno.",
        "notes": "«“Un brindisi! Alla sposa! Alla sposa, allo sposo e a tutti voi qui riuniti! Provate la seconda spina, provatele tutte! Siate felici stanotte e pagate domani!”»\nArchetipo: Eroi Baluardo\n\n📖 Storia:\nGudrun Hass nacque nella città di Berlitz, a nord di Freiburg, nell'ora più buia della storia di Eisen. Persino dopo la fine della guerra, la Nazione faticava a rimettersi in piedi: la povertà, i terreni devastati e i mostri vagabondi rendevano il paese un luogo difficile in cui crescere. Per fortuna, Berlitz era stata risparmiata dagli scontri peggiori e questo permise alla piccola Gudrun di concentrarsi sulla bellezza del mondo e sulla sua grande passione: produrre birra. Gudrun crebbe all'ombra del celebre Braumeister Adel Nachtman Berlitz, a cui la città doveva il nome. Ascoltò ogni storia sul suo leggendario talento, molte tanto fantastiche da non essere credibili. Sognava di ritrovare il suo favoleggiato ricettario e diventare la migliore Braumeister mai esistita. Le birre di Adel erano tanto buone e avevano reso felice tanta gente che gli era stata dedicata una città. Gudrun voleva superarlo. Molti di coloro che incontrano Gudrun pensano che abbia un chiodo fisso perché non parla d'altro che di birre, ricette e ingredienti. Gudrun ha i suoi motivi, oltre alla passione per l'alcol: essendo cresciuta durante i lunghi inverni e le dure primavere della guerra, ha visto Eisen impazzire sotto i suoi occhi e i mostri strisciare fuori dalle tenebre. Era presente quando riportarono il cadavere di suo padre, uno tra le molte vittime del conflitto. La madre e i fratelli sarebbero morti di fame se lei non avesse iniziato a lavorare come apprendista al birrificio locale. Gudrun crede che l'alcol sollevi lo spirito nei momenti più bui e considera il suo lavoro come un'opera santa e importante. Gudrun ha imparato tutto ciò che poteva dai birrai locali ed è diventata la migliore della città dai tempi di Berlitz. Quando cominciò a diventare irrequieta per la mancanza di stimoli, il Braumeister la mandò a Freiburg per imparare e per tentare la fortuna nell'an- nuale competizione tra Braumeister. Gudrun ha studiato un anno intero per questa gara ed è convinta che non ci sia in gioco solo il suo orgoglio, ma anche la possibilità di riportare alla luce un frammento della tradizione di Eisen.\n\n🎯 Obiettivi:\nOttenere i rari fiori di Aidelweiz per perfezionare la sua Birra al Malto Dorato. Ci sono poche persone, tra cui Gudrun, capaci di produrre la Birra al Malto Dorato secondo la ricetta originale, poiché i fiori di Aidelweiz crescono solo sulle cime più alte all'inizio della primavera e sono difficili da conservare. Questa è un'avventura per un birraio. Vincere la gara di Braumeister a Freiburg. La fiera di Freiburg ospita una delle più prestigiose competizioni di Braumeister del mondo. Persone da tutta Théah vi giungono per assaggiare e gareggiare. È il luogo perfetto perché Gudrun dimostri la sua maestria. Riscoprire il ricettario perduto di Adel Nachtman Berlitz. T empo fa, Adel Nachtman Berlitz creò alcune delle ricette più rivoluzionarie conosciute e si vocifera che esista una copia del ricettario, creduto distrutto in un incendio dopo la sua morte. Ovviamente Gudrun vuole ritrovarlo!\n\n🎭 Consigli di Interpretazione (Giocare Gudrun Hass):\nGudrun Hass è una Braumeister molto impudente e vanitosa, ma ha davvero una grande abilità. Sa quanto è brava e spesso scherza e ride sul suo talento. Sebbene alcuni trovino la sua continua ricerca della perfezione e la tendenza ad auto-congratularsi diffi- cili da sopportare, il suo talento e il buon cuore le fanno guadagnare più amici di quanti ne perda per la sua arroganza. Le feste che organizza sono incre - dibili e la si può sempre trovare nel mezzo della folla, mentre distribuisce bevande e chiede opinioni sulla birra. Gudrun è pronta a scalare qualsiasi montagna, guadare ogni torrente per realizzare il sogno di diven- tare la migliore Braumeister del mondo.",
        "pcData": {
            "name": "Gudrun Hass",
            "nation": "Eisen",
            "concept": "Eroi Baluardo • Eisen",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 0,
                "Atletica": 1,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 2,
                "Esibirsi": 3,
                "Furto": 0,
                "Intimidire": 1,
                "Istruzione": 3,
                "Mira": 0,
                "Mischia": 0,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 2
            },
            "advantages": [
                "Bevitrice Emerita",
                "Manualità",
                "Mastro Artigiano: Birraia",
                "Orologio Biologico",
                "Rissosa",
                "Scuola di Maniere",
                "Stomaco di Ferro"
            ],
            "virtue": "Virtù: La Strada Amichevole. Attivando questa Virtù quando l’Eroe incontra un personaggio per la prima volta, anche un Malvagio, questi lo tratterà amichevolmente per una Scena.",
            "hubris": "Hubris: La Torre Arrogante. L’Eroe riceve un Punto Eroe quando mostra disprezzo o considera indegno di attenzione un Malvagio o chi potrebbe causare danno ai suoi amici.",
            "peculiarities": "Artigiana. Ottiene un Punto Eroe ogni volta che sfrutta le modeste abilità artigiane per risolvere problemi considerati troppo complessi per avere una soluzione semplice. Mercante. Ottiene un Punto Eroe ogni volta che vende un oggetto per molto meno del suo reale valore a chi ne ha un disperato bisogno.",
            "story": "Gudrun Hass nacque nella città di Berlitz, a nord di Freiburg, nell'ora più buia della storia di Eisen. Persino dopo la fine della guerra, la Nazione faticava a rimettersi in piedi: la povertà, i terreni devastati e i mostri vagabondi rendevano il paese un luogo difficile in cui crescere. Per fortuna, Berlitz era stata risparmiata dagli scontri peggiori e questo permise alla piccola Gudrun di concentrarsi sulla bellezza del mondo e sulla sua grande passione: produrre birra. Gudrun crebbe all'ombra del celebre Braumeister Adel Nachtman Berlitz, a cui la città doveva il nome. Ascoltò ogni storia sul suo leggendario talento, molte tanto fantastiche da non essere credibili. Sognava di ritrovare il suo favoleggiato ricettario e diventare la migliore Braumeister mai esistita. Le birre di Adel erano tanto buone e avevano reso felice tanta gente che gli era stata dedicata una città. Gudrun voleva superarlo. Molti di coloro che incontrano Gudrun pensano che abbia un chiodo fisso perché non parla d'altro che di birre, ricette e ingredienti. Gudrun ha i suoi motivi, oltre alla passione per l'alcol: essendo cresciuta durante i lunghi inverni e le dure primavere della guerra, ha visto Eisen impazzire sotto i suoi occhi e i mostri strisciare fuori dalle tenebre. Era presente quando riportarono il cadavere di suo padre, uno tra le molte vittime del conflitto. La madre e i fratelli sarebbero morti di fame se lei non avesse iniziato a lavorare come apprendista al birrificio locale. Gudrun crede che l'alcol sollevi lo spirito nei momenti più bui e considera il suo lavoro come un'opera santa e importante. Gudrun ha imparato tutto ciò che poteva dai birrai locali ed è diventata la migliore della città dai tempi di Berlitz. Quando cominciò a diventare irrequieta per la mancanza di stimoli, il Braumeister la mandò a Freiburg per imparare e per tentare la fortuna nell'an- nuale competizione tra Braumeister. Gudrun ha studiato un anno intero per questa gara ed è convinta che non ci sia in gioco solo il suo orgoglio, ma anche la possibilità di riportare alla luce un frammento della tradizione di Eisen.",
            "objectives": "Ottenere i rari fiori di Aidelweiz per perfezionare la sua Birra al Malto Dorato. Ci sono poche persone, tra cui Gudrun, capaci di produrre la Birra al Malto Dorato secondo la ricetta originale, poiché i fiori di Aidelweiz crescono solo sulle cime più alte all'inizio della primavera e sono difficili da conservare. Questa è un'avventura per un birraio. Vincere la gara di Braumeister a Freiburg. La fiera di Freiburg ospita una delle più prestigiose competizioni di Braumeister del mondo. Persone da tutta Théah vi giungono per assaggiare e gareggiare. È il luogo perfetto perché Gudrun dimostri la sua maestria. Riscoprire il ricettario perduto di Adel Nachtman Berlitz. T empo fa, Adel Nachtman Berlitz creò alcune delle ricette più rivoluzionarie conosciute e si vocifera che esista una copia del ricettario, creduto distrutto in un incendio dopo la sua morte. Ovviamente Gudrun vuole ritrovarlo!",
            "quote": "“Un brindisi! Alla sposa! Alla sposa, allo sposo e a tutti voi qui riuniti! Provate la seconda spina, provatele tutte! Siate felici stanotte e pagate domani!”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 3, Acume 3, Panache 3 • Virtù: Il Profeta Illuminato. Attivando questa Virtù, per tutta la durata della scena l’Eroe si accorge automatica- mente quando qualsiasi altro personaggio mente. • Hubris: Il Ritrovo Rancoroso. L’Eroe riceve un Punto Eroe quando si mette nei guai rimanendo ancorato a vecchi rancori e cattivi sentimenti. Stregoneria Keddy è l’incarnazione di Godric, il Pio. Il suo Tratto Maggiore è Panache, il Minore è Risolutezza. Conosce l’Incanto Maggiore Resistere alla Stregoneria (Grado 1); gli Incanti Minori Il Dolore È Temporaneo (Grado 1) e Nessuna Paura (Grado 1).",
        "ability": "«“Tutto nel creato ha uno schema, dalle pietre sulla terra alle stelle nel cielo. O’Bannon può essere pazzo, ma neppure lui può cambiare questo fatto.”»\n\nVantaggi: Bevitore Emerito, Fautore di Miracoli, Oggetto Distintivo: Bastone da Druido, Orologio Biologico, Stregoneria: Cavaliere di Avalon 1, Virtuoso: Canto\n\nPeculiarità: Bardo. Ottiene un Punto Eroe ogni volta che risolve un problema seguendo l’esempio di una Leggenda. Dottore. Ottiene un Punto Eroe ogni volta che si occupa delle ferite di un Malvagio o delle sue vittime innocenti.",
        "notes": "«“Tutto nel creato ha uno schema, dalle pietre sulla terra alle stelle nel cielo. O’Bannon può essere pazzo, ma neppure lui può cambiare questo fatto.”»\nArchetipo: Eroi Baluardo\n\n📖 Storia:\nKeddy crebbe in un piccolo villaggio Inish presso Loch Stewart. Curioso sin da piccolo, esplorava il lago e ascoltava rapito i racconti paterni sulla miste- riosa roccia di famiglia, la Bhollain Stewart. Questa lo affascinava perché si diceva contenesse l'intera saga dei loro avi, un dettaglio che il padre ometteva sempre. La Bhollain Stewart si trovava al centro del lago, cuore di Inismore, le cui sponde nebbiose avevano protetto la famiglia dalle spade dei conquistatori e dal fuoco della Chiesa. Keddy tentò più volte di raggiungere con una barca a remi Olean Roth, la mitica isola al centro del lago ove si trova la roccia, ma venne sempre respinto da nebbie impenetrabili. Durante il suo ultimo tentativo, vide una donna dai capelli color argento che lo fissava dalle profondità. T ornato a riva, non appena menzionò la donna a suo padre, questi decise di trasferire l'intera famiglia nelle Marche delle Highland. Questa donna sembrava terrorizzare il vecchio Stewart, che si rifiutò di toccare ancora l'argomento. Keddy aveva nostalgia di casa e pregò il padre di insegnargli la via dei druidi, un ultimo legame con la patria. Il vecchio si rifiutò più e più volte, temendo che la natura curiosa del figlio, unita a tali antichi inse - gnamenti, lo avrebbe messo nei guai. Per dimostrargli che si sbagliava, Keddy divenne un giovane gentile e responsabile e, infine, la sua pazienza dette risultati: il vecchio Stewart, di malavoglia, accettò di insegnargli. Ci vollero anni, ma Keddy divenne un ottimo apprendista. La notte della sua iniziazione il padre svanì nell'oscurità con un urlo da far gelare il sangue. Unica prova della scomparsa fu il suo bastone caduto a terra tra una serie di impronte di piedi nudi e due capelli argentati. Keddy giurò di ritrovarlo e non passò molto tempo prima che gli giungesse voce del ritorno del Folle Jack O' Bannon, il re di Inismore, che pare abbia lunghi capelli argentati e cammini sempre scalzo. Percependo una svolta nel grande schema delle cose, Keddy ha osservato in silenzio Inismore, finché non si è convinto che O' Bannon abbia qualcosa a che fare con la sparizione del padre. È tempo di tornare a casa.\n\n🎯 Obiettivi:\nAddestrare un apprendista bardo. Lo schema della creazione ha benedetto la famiglia Stewart con una dinastia di druidi che prosegue ininterrotta sin dai primordi di Inismore. Persino con il padre in pericolo, Keddy non può contrastare l'impulso di iniziare il prossimo Stewart all'enigma del creato. Ha sentito parlare di un cugino con una lingua melliflua, un talento per gli enigmi e gli scherzi. Udire la saga della famiglia presso la Bhollain Stewart. Solo un vero Stewart può orientarsi nei tortuosi sentieri della foresta di Olean Roth, senza perdersi per sempre nel reame dei Sidhe. La leggenda racconta che chi poggia l'orecchio sulla Bhollain Stewart udrà una melodia inquietante che gli trasmetterà tutta la cono- scenza della famiglia. Keddy spera che questa canzone gli conceda il sapere necessario per salvare suo padre. Scoprire perché suo padre è scomparso quando Jack O’Bannon è tornato. Il ritorno di Jack O' Bannon è coinciso con la spari- zione del vecchio Stewart. Alcuni credono che O' Bannon desideri la canzone della Bhollain Stewart e possa raggiungerla solo con un esponente della famiglia come guida; altri credono che non sia stato O' Bannon, ma la sua madre Sidhe giunta a ripren - dersi il figlio con l'aiuto del vecchio Stewart.\n\n🎭 Consigli di Interpretazione (Giocare Keddy Stewart):\nLo sguardo curioso di Keddy esplora tutto ciò che lo circonda con avidità, ma i suoi occhi hanno un' aura di ferrea risolutezza. T utti coloro che l' hanno incontrato, non considerano la voce rimbombante o il tocco guaritore come un segno di debolezza, ma come una manifestazione della sua assoluta dedizione di compiere il ministero druidico. Sin dalla scomparsa del padre la determinazione di Keddy si è rafforzata. Entra in ogni stanza con passo felpato e lo sguardo interrogativo tipico di un druido, ma il suo volto diventa duro come la pietra di fronte a chi si intromette nelle sue investigazioni. Questa maschera cade, raramente, solo di fronte a chi è davvero simpatetico con la sua causa.",
        "pcData": {
            "name": "Keddy Stewart",
            "nation": "Inismore",
            "concept": "Eroi Baluardo • Inismore",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 0,
                "Atletica": 0,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 3,
                "Esibirsi": 3,
                "Furto": 0,
                "Intimidire": 0,
                "Istruzione": 2,
                "Mira": 1,
                "Mischia": 2,
                "Nascondersi": 1,
                "Navigazione": 0,
                "Notare": 3,
                "Rissa": 0
            },
            "advantages": [
                "Bevitore Emerito",
                "Fautore di Miracoli",
                "Oggetto Distintivo: Bastone da Druido",
                "Orologio Biologico",
                "Stregoneria: Cavaliere di Avalon 1",
                "Virtuoso: Canto"
            ],
            "virtue": "Virtù: Il Profeta Illuminato. Attivando questa Virtù, per tutta la durata della scena l’Eroe si accorge automatica- mente quando qualsiasi altro personaggio mente.",
            "hubris": "Hubris: Il Ritrovo Rancoroso. L’Eroe riceve un Punto Eroe quando si mette nei guai rimanendo ancorato a vecchi rancori e cattivi sentimenti. Stregoneria Keddy è l’incarnazione di Godric, il Pio. Il suo Tratto Maggiore è Panache, il Minore è Risolutezza. Conosce l’Incanto Maggiore Resistere alla Stregoneria (Grado 1); gli Incanti Minori Il Dolore È Temporaneo (Grado 1) e Nessuna Paura (Grado 1).",
            "peculiarities": "Bardo. Ottiene un Punto Eroe ogni volta che risolve un problema seguendo l’esempio di una Leggenda. Dottore. Ottiene un Punto Eroe ogni volta che si occupa delle ferite di un Malvagio o delle sue vittime innocenti.",
            "story": "Keddy crebbe in un piccolo villaggio Inish presso Loch Stewart. Curioso sin da piccolo, esplorava il lago e ascoltava rapito i racconti paterni sulla miste- riosa roccia di famiglia, la Bhollain Stewart. Questa lo affascinava perché si diceva contenesse l'intera saga dei loro avi, un dettaglio che il padre ometteva sempre. La Bhollain Stewart si trovava al centro del lago, cuore di Inismore, le cui sponde nebbiose avevano protetto la famiglia dalle spade dei conquistatori e dal fuoco della Chiesa. Keddy tentò più volte di raggiungere con una barca a remi Olean Roth, la mitica isola al centro del lago ove si trova la roccia, ma venne sempre respinto da nebbie impenetrabili. Durante il suo ultimo tentativo, vide una donna dai capelli color argento che lo fissava dalle profondità. T ornato a riva, non appena menzionò la donna a suo padre, questi decise di trasferire l'intera famiglia nelle Marche delle Highland. Questa donna sembrava terrorizzare il vecchio Stewart, che si rifiutò di toccare ancora l'argomento. Keddy aveva nostalgia di casa e pregò il padre di insegnargli la via dei druidi, un ultimo legame con la patria. Il vecchio si rifiutò più e più volte, temendo che la natura curiosa del figlio, unita a tali antichi inse - gnamenti, lo avrebbe messo nei guai. Per dimostrargli che si sbagliava, Keddy divenne un giovane gentile e responsabile e, infine, la sua pazienza dette risultati: il vecchio Stewart, di malavoglia, accettò di insegnargli. Ci vollero anni, ma Keddy divenne un ottimo apprendista. La notte della sua iniziazione il padre svanì nell'oscurità con un urlo da far gelare il sangue. Unica prova della scomparsa fu il suo bastone caduto a terra tra una serie di impronte di piedi nudi e due capelli argentati. Keddy giurò di ritrovarlo e non passò molto tempo prima che gli giungesse voce del ritorno del Folle Jack O' Bannon, il re di Inismore, che pare abbia lunghi capelli argentati e cammini sempre scalzo. Percependo una svolta nel grande schema delle cose, Keddy ha osservato in silenzio Inismore, finché non si è convinto che O' Bannon abbia qualcosa a che fare con la sparizione del padre. È tempo di tornare a casa.",
            "objectives": "Addestrare un apprendista bardo. Lo schema della creazione ha benedetto la famiglia Stewart con una dinastia di druidi che prosegue ininterrotta sin dai primordi di Inismore. Persino con il padre in pericolo, Keddy non può contrastare l'impulso di iniziare il prossimo Stewart all'enigma del creato. Ha sentito parlare di un cugino con una lingua melliflua, un talento per gli enigmi e gli scherzi. Udire la saga della famiglia presso la Bhollain Stewart. Solo un vero Stewart può orientarsi nei tortuosi sentieri della foresta di Olean Roth, senza perdersi per sempre nel reame dei Sidhe. La leggenda racconta che chi poggia l'orecchio sulla Bhollain Stewart udrà una melodia inquietante che gli trasmetterà tutta la cono- scenza della famiglia. Keddy spera che questa canzone gli conceda il sapere necessario per salvare suo padre. Scoprire perché suo padre è scomparso quando Jack O’Bannon è tornato. Il ritorno di Jack O' Bannon è coinciso con la spari- zione del vecchio Stewart. Alcuni credono che O' Bannon desideri la canzone della Bhollain Stewart e possa raggiungerla solo con un esponente della famiglia come guida; altri credono che non sia stato O' Bannon, ma la sua madre Sidhe giunta a ripren - dersi il figlio con l'aiuto del vecchio Stewart.",
            "quote": "“Tutto nel creato ha uno schema, dalle pietre sulla terra alle stelle nel cielo. O’Bannon può essere pazzo, ma neppure lui può cambiare questo fatto.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 3, Acume 3, Panache 2 • Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro. • Hubris: Il Glifo Superstizioso. L’Eroe riceve un Punto Eroe quando si rifiuta di risolvere un problema con l’aiuto della Stregoneria, di un artefatto o di un altro effetto mistico di cui non si fida.",
        "ability": "«“Buona sorte? Cattiva sorte? Niente accade a causa della ‘fortuna’ . Tutto ciò che viviamo, specialmente le nostre sofferenze, è volontà del Creatore. Per quanto mi riguarda, non intendo mettere in discussione i Suoi piani, mi limito ad accettarli e cercare di ricavarne il meglio.”»\n\nVantaggi: Aggressione Sconsiderata, Consacrato, Ispirare Generosità, Mano Lesta, Sorriso Disarmante, Un Semplice Malinteso\n\nPeculiarità: Orfano. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo. Sacerdote. Ottiene un Punto Eroe ogni volta che lascia da parte la retorica e mette in pratica le virtù che professa.",
        "notes": "«“Buona sorte? Cattiva sorte? Niente accade a causa della ‘fortuna’ . Tutto ciò che viviamo, specialmente le nostre sofferenze, è volontà del Creatore. Per quanto mi riguarda, non intendo mettere in discussione i Suoi piani, mi limito ad accettarli e cercare di ricavarne il meglio.”»\nArchetipo: Eroi Baluardo\n\n📖 Storia:\nRodrigo Félix ha sempre avuto una vita difficile, sin dal giorno in cui i suoi genitori lo abbandonarono, ancora in fasce, di fronte alla cappella di La Esperanza. Per fortuna, Rodrigo si è dimostrato resistente e tenace alle avversità della vita. Non importava se doveva studiare una materia difficile o far fronte a un gruppo di bulli, lui resisteva. L'incontro con Madre Clara, la Superiora di La Esperanza, ne cementò il carattere. Lei prese Rodrigo sotto la propria ala. Gli insegnò tutto ciò che sapeva su Theus e il Suo disegno. Insegnò al giovane ragazzo di desiderare la conoscenza, portandolo con sé alla ricerca della Quarta V eglia. Ancor oggi Rodrigo ricorda il Credo e i versi recitati da Madre Clara, con la sua voce calma e pulita. L'unico amico d'infanzia di Rodrigo era un altro orfano chiamato Mario. I due erano l'uno l'opposto dell'altro. Mario era schietto, rumoroso e aveva una tendenza a ignorare le regole. Nonostante questo erano inseparabili, finché la tragedia non colpì: Madre Clara venne accusata di stregoneria. Sebbene Rodrigo considerasse tali accuse inconcepibili, non fu questo a distruggerlo, ma il vedere Mario al banco dell'accusa il giorno del processo. Rodrigo testimoniò a favore di Madre Clara, ma le sue parole furono ignorate. Disperato di salvare la donna che considerava sua madre, tentò di raggiun- gerla, rifiutandosi di arretrare un passo persino sotto la minaccia delle armi. Dovettero stenderlo con una randellata al capo. Scandalizzato dalla scena, l'Alto Inquisitore ordinò che venisse incarcerato affinché potesse “riflettere sulle sue azioni, chiaramente il risultato di un influsso demoniaco” . Rodrigo venne risvegliato dall'odore di carne che bruciava. Balzò in piedi e vide l'intera comunità di La Esperanza che osservava il cadavere bruciato della Superiora. Senza un attimo d'indugio, corse alla cappella alla ricerca di Mario. Quando lo trovò lo prese a pugni con tutta la rabbia che aveva in corpo. V edendo il sangue del suo ex-a- mico macchiargli le mani si riscosse e finalmente parlò: “Perché?” . Dapprima Mario non fu cooperativo, ma dopo altri due pugni mormorò un nome: “Madre Guineu” .\n\n🎯 Obiettivi:\nRintracciare i suoi veri genitori. Rodrigo ha un solo indizio sulle sue origini. Prima del processo, Madre Clara disse che i suoi genitori sarebbero stati fieri dell'uomo che era diventato. Quando Rodrigo chiese di saperne di più lei si rifiutò di rispondere, ma menzionò la Foresta di Sandoval. Scoprire la vera identità della diabolica “Madre Guineu” . Dopo il pestaggio, Mario scomparve misteriosamente da La Esperanza, insieme alle speranze di Rodrigo di sapere altro sul mostro responsabile della morte di Madre Clara. Da quel momento ha cominciato a frequentare taverne e altri luoghi sordidi sperando di scoprire di più. Svelare la verità sulla Quarta Veglia nascosta a Castille. Ora che è padrone della sua vita, Rodrigo è deter - minato ad aiutare la Chiesa quanto più possibile. A questo scopo, sta seguendo una serie di indizi sulla V eglia Perduta nascosta tra le montagne lungo la costa del Golfo del V aticinio.\n\n🎭 Consigli di Interpretazione (Giocare Rodrigo Félix):\nRodrigo è un uomo forte con un cuore d'oro. Possiede una fede incrollabile in Theus e nella Sua Chiesa. Questa devozione lo spinge ad aiutare tutti, credenti o meno. Ascolta molto, parla poco e sceglie con cura le parole per non offendere nessuno. Sorride spesso e la sua risata è come un fiume in piena. Rodrigo fa tutto ciò che è in suo potere per raddrizzare i torti di cui è a conoscenza. Se poi vi è coinvolto un individuo pio o fedele, non si fermerà davanti a nulla per svelare la verità. Non crede che la violenza sia una scelta giusta, ma è pronto a battersi se necessario.",
        "pcData": {
            "name": "Rodrigo Félix",
            "nation": "Castille",
            "concept": "Eroi Baluardo • Castille",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 2
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 1,
                "Convincere": 2,
                "Empatia": 2,
                "Esibirsi": 1,
                "Furto": 0,
                "Intimidire": 1,
                "Istruzione": 3,
                "Mira": 0,
                "Mischia": 0,
                "Nascondersi": 3,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 1
            },
            "advantages": [
                "Aggressione Sconsiderata",
                "Consacrato",
                "Ispirare Generosità",
                "Mano Lesta",
                "Sorriso Disarmante",
                "Un Semplice Malinteso"
            ],
            "virtue": "Virtù: L’Impiccato Altruista. Attivando questa Virtù, l’Eroe può subire le Conseguenze di un Rischio al posto di un altro.",
            "hubris": "Hubris: Il Glifo Superstizioso. L’Eroe riceve un Punto Eroe quando si rifiuta di risolvere un problema con l’aiuto della Stregoneria, di un artefatto o di un altro effetto mistico di cui non si fida.",
            "peculiarities": "Orfano. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo. Sacerdote. Ottiene un Punto Eroe ogni volta che lascia da parte la retorica e mette in pratica le virtù che professa.",
            "story": "Rodrigo Félix ha sempre avuto una vita difficile, sin dal giorno in cui i suoi genitori lo abbandonarono, ancora in fasce, di fronte alla cappella di La Esperanza. Per fortuna, Rodrigo si è dimostrato resistente e tenace alle avversità della vita. Non importava se doveva studiare una materia difficile o far fronte a un gruppo di bulli, lui resisteva. L'incontro con Madre Clara, la Superiora di La Esperanza, ne cementò il carattere. Lei prese Rodrigo sotto la propria ala. Gli insegnò tutto ciò che sapeva su Theus e il Suo disegno. Insegnò al giovane ragazzo di desiderare la conoscenza, portandolo con sé alla ricerca della Quarta V eglia. Ancor oggi Rodrigo ricorda il Credo e i versi recitati da Madre Clara, con la sua voce calma e pulita. L'unico amico d'infanzia di Rodrigo era un altro orfano chiamato Mario. I due erano l'uno l'opposto dell'altro. Mario era schietto, rumoroso e aveva una tendenza a ignorare le regole. Nonostante questo erano inseparabili, finché la tragedia non colpì: Madre Clara venne accusata di stregoneria. Sebbene Rodrigo considerasse tali accuse inconcepibili, non fu questo a distruggerlo, ma il vedere Mario al banco dell'accusa il giorno del processo. Rodrigo testimoniò a favore di Madre Clara, ma le sue parole furono ignorate. Disperato di salvare la donna che considerava sua madre, tentò di raggiun- gerla, rifiutandosi di arretrare un passo persino sotto la minaccia delle armi. Dovettero stenderlo con una randellata al capo. Scandalizzato dalla scena, l'Alto Inquisitore ordinò che venisse incarcerato affinché potesse “riflettere sulle sue azioni, chiaramente il risultato di un influsso demoniaco” . Rodrigo venne risvegliato dall'odore di carne che bruciava. Balzò in piedi e vide l'intera comunità di La Esperanza che osservava il cadavere bruciato della Superiora. Senza un attimo d'indugio, corse alla cappella alla ricerca di Mario. Quando lo trovò lo prese a pugni con tutta la rabbia che aveva in corpo. V edendo il sangue del suo ex-a- mico macchiargli le mani si riscosse e finalmente parlò: “Perché?” . Dapprima Mario non fu cooperativo, ma dopo altri due pugni mormorò un nome: “Madre Guineu” .",
            "objectives": "Rintracciare i suoi veri genitori. Rodrigo ha un solo indizio sulle sue origini. Prima del processo, Madre Clara disse che i suoi genitori sarebbero stati fieri dell'uomo che era diventato. Quando Rodrigo chiese di saperne di più lei si rifiutò di rispondere, ma menzionò la Foresta di Sandoval. Scoprire la vera identità della diabolica “Madre Guineu” . Dopo il pestaggio, Mario scomparve misteriosamente da La Esperanza, insieme alle speranze di Rodrigo di sapere altro sul mostro responsabile della morte di Madre Clara. Da quel momento ha cominciato a frequentare taverne e altri luoghi sordidi sperando di scoprire di più. Svelare la verità sulla Quarta Veglia nascosta a Castille. Ora che è padrone della sua vita, Rodrigo è deter - minato ad aiutare la Chiesa quanto più possibile. A questo scopo, sta seguendo una serie di indizi sulla V eglia Perduta nascosta tra le montagne lungo la costa del Golfo del V aticinio.",
            "quote": "“Buona sorte? Cattiva sorte? Niente accade a causa della ‘fortuna’ . Tutto ciò che viviamo, specialmente le nostre sofferenze, è volontà del Creatore. Per quanto mi riguarda, non intendo mettere in discussione i Suoi piani, mi limito ad accettarli e cercare di ricavarne il meglio.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 3, Acume 3, Panache 2 • Virtù: I Troni Confortante. Attivando questa Virtù, l’Eroe cancella gli effetti della Paura su se stesso e i suoi amici. • Hubris: L’Impiccato Indeciso. L’Eroe riceve un Punto Eroe quando spreca un’Azione esitando in preda al dubbio o all’incertezza.",
        "ability": "«“ … questa, cari bambini, è Gena, un raro esemplare di leopardo ussurano! Oggi, seguiremo Gena mentre va a caccia e impareremo una cosa o due su come realizzare un’imboscata.”»\n\nVantaggi: Cecchino, Compagno Fidato: Animali della Foresta, Esperto di Sopravvivenza, Fatto!, Ispirare Generosità, Virtuoso: Canto\n\nPeculiarità: Cacciatore. Ottiene un Punto Eroe ogni volta che il suo istinto di cacciatore salva qualcuno da un pericolo. Intrattenitore. Ottiene un Punto Eroe ogni volta che usa le sue abilità per qualcosa di più del semplice guadagno.",
        "notes": "«“ … questa, cari bambini, è Gena, un raro esemplare di leopardo ussurano! Oggi, seguiremo Gena mentre va a caccia e impareremo una cosa o due su come realizzare un’imboscata.”»\nArchetipo: Eroi Baluardo\n\n📖 Storia:\nViktor venne esiliato per ordine della sua gemella cattiva Agafya Markova, ma non poteva restare a lungo lontano dalle sue terre e tornò per distribuire cibo e medicine alla popolazione sofferente. Arrestato da una pattuglia, si arrese senza combattere ma, per ragioni misteriose, la sorella lo bandì nuovamente, invece di condannarlo a morte. Viktor vagò per le selve, piangendo e cercando conforto nelle canzoni popolari che aveva imparato da piccolo. Si chiedeva perché sua sorella voleva condannarlo a una vita di solitudine lontano dalle sue terre tanto amate. Quando si addormentò, Mathuska apparve e lo chiamò: “Viktor Markovich, ti offro il potere di controllare gli animali in cambio—” “No grazie, Madre.” rispose Viktor svegliandosi circondato da creature della foresta. “Credo… credo di essere a posto!” Le sue canzoni tristi avevano attirato gli animali. Mathuska, stupita e oberata di cose da fare nella notte, decise di lasciare andare quel ragazzo piangente. Con lo stomaco che brontolava, Viktor si cucinò dei funghi e li condivise con un cinghiale selvatico. Si rese conto che non sarebbe mai stato davvero solo nella natura e il suo spirito si riprese. Oggi, Viktor ha smesso di scappare, ma non di cantare. È diventato un simbolo di speranza contro la tirannia della sorella. Gli animali che tanto ama sono i suoi assistenti: la sua voce li calma e permette agli studenti del giovane ussurano di avvicinarli senza pericolo e apprendere le loro movenze. Viktor insegna a combattere come una tigre, cacciare in branco come dei lupi, muoversi furtivamente come una volpe e correre come una renna. Quando le guardie di Agafya vengono a cercarlo non ha più bisogno di scappare, dato che non sono ancora riuscite a superare i suoi leali cani da guardia. Per ora Viktor ha solo insegnato, ma non si è mai battuto. Ha guadagnato molti amici nei villaggi delle terre dei Markovich e ha addestrato una resistenza organizzata intorno a sé. L'ora di armare il suo arco e dare una svolta allo scontro, però, è sempre più vicina. Scoccherà frecce contro sua sorella? O troverà un'altra via?\n\n🎯 Obiettivi:\nRitrovare il blasone di famiglia. Da oltre una generazione la famiglia di Viktor e Agafya non ha un blasone riconosciuto. Ai tempi del nonno, un misterioso incidente aveva provocato la perdita di tutte le informazioni sull'araldica di famiglia. Se Viktor vuole risultare vincitore dallo scontro con Agafya, avrà bisogno di questo simbolo e ciò significa avventurarsi sul luogo dell'incidente o inviare agenti fidati. Riprendere le terre di famiglia alla sua gemella. Viktor non userebbe mai la violenza, eccetto come ultima risorsa, ma sua sorella non ha di questi problemi e uccide tutti coloro che ne sfidano il dominio. Le sue guardie sono brutali e senza pietà. Viktor deve conti- nuare ad addestrare la popolazione con le lezioni che ha appreso dalla natura, per resistere al dominio di Agafya. Curare la sorella della sua fredda crudeltà. Viktor non ha perso le speranze che la sorella buona e gentile che conosceva sia ancora da qualche parte. Forse è vittima di una maledizione? Oppure viene manipolata? O, magari, ha solo dimenticato l'amore e la speranza che i genitori hanno insegnato loro? Non importa se dovrà farlo attraverso le sbarre di una prigione, Viktor ritroverà sua sorella.\n\n🎭 Consigli di Interpretazione (Giocare Viktor Markovich):\nViktor può sembrare un rude esperto di sopravvivenza, ma chi lo avvicina scopre che è un personaggio pieno di speranza, estroverso e amichevole. Ama incontrare persone nuove, in particolare bambini e animali. È capace di calmare gli animali, selvatici e domestici, cantando. È una fonte inesauribile di canzoni popolari ussurane e passa il suo tempo libero a improvvisare motivetti che insegna agli amici. Viktor non ama la violenza, non importa che stia cacciando per mangiare o combattendo gli uomini di sua sorella. Ferisce altri esseri viventi solo quando è strettamente necessario per sopravvivere. Ogni volta che uccide con una freccia – che sia un cervo o un nemico – rivolge al cielo una preghiera di scusa.",
        "pcData": {
            "name": "Viktor Markovich",
            "nation": "Ussura",
            "concept": "Eroi Baluardo • Ussura",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 2
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 0,
                "Atletica": 3,
                "Cavalcare": 1,
                "Convincere": 0,
                "Empatia": 2,
                "Esibirsi": 3,
                "Furto": 1,
                "Intimidire": 1,
                "Istruzione": 2,
                "Mira": 2,
                "Mischia": 0,
                "Nascondersi": 2,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 0
            },
            "advantages": [
                "Cecchino",
                "Compagno Fidato: Animali della Foresta",
                "Esperto di Sopravvivenza",
                "Fatto!",
                "Ispirare Generosità",
                "Virtuoso: Canto"
            ],
            "virtue": "Virtù: I Troni Confortante. Attivando questa Virtù, l’Eroe cancella gli effetti della Paura su se stesso e i suoi amici.",
            "hubris": "Hubris: L’Impiccato Indeciso. L’Eroe riceve un Punto Eroe quando spreca un’Azione esitando in preda al dubbio o all’incertezza.",
            "peculiarities": "Cacciatore. Ottiene un Punto Eroe ogni volta che il suo istinto di cacciatore salva qualcuno da un pericolo. Intrattenitore. Ottiene un Punto Eroe ogni volta che usa le sue abilità per qualcosa di più del semplice guadagno.",
            "story": "Viktor venne esiliato per ordine della sua gemella cattiva Agafya Markova, ma non poteva restare a lungo lontano dalle sue terre e tornò per distribuire cibo e medicine alla popolazione sofferente. Arrestato da una pattuglia, si arrese senza combattere ma, per ragioni misteriose, la sorella lo bandì nuovamente, invece di condannarlo a morte. Viktor vagò per le selve, piangendo e cercando conforto nelle canzoni popolari che aveva imparato da piccolo. Si chiedeva perché sua sorella voleva condannarlo a una vita di solitudine lontano dalle sue terre tanto amate. Quando si addormentò, Mathuska apparve e lo chiamò: “Viktor Markovich, ti offro il potere di controllare gli animali in cambio—” “No grazie, Madre.” rispose Viktor svegliandosi circondato da creature della foresta. “Credo… credo di essere a posto!” Le sue canzoni tristi avevano attirato gli animali. Mathuska, stupita e oberata di cose da fare nella notte, decise di lasciare andare quel ragazzo piangente. Con lo stomaco che brontolava, Viktor si cucinò dei funghi e li condivise con un cinghiale selvatico. Si rese conto che non sarebbe mai stato davvero solo nella natura e il suo spirito si riprese. Oggi, Viktor ha smesso di scappare, ma non di cantare. È diventato un simbolo di speranza contro la tirannia della sorella. Gli animali che tanto ama sono i suoi assistenti: la sua voce li calma e permette agli studenti del giovane ussurano di avvicinarli senza pericolo e apprendere le loro movenze. Viktor insegna a combattere come una tigre, cacciare in branco come dei lupi, muoversi furtivamente come una volpe e correre come una renna. Quando le guardie di Agafya vengono a cercarlo non ha più bisogno di scappare, dato che non sono ancora riuscite a superare i suoi leali cani da guardia. Per ora Viktor ha solo insegnato, ma non si è mai battuto. Ha guadagnato molti amici nei villaggi delle terre dei Markovich e ha addestrato una resistenza organizzata intorno a sé. L'ora di armare il suo arco e dare una svolta allo scontro, però, è sempre più vicina. Scoccherà frecce contro sua sorella? O troverà un'altra via?",
            "objectives": "Ritrovare il blasone di famiglia. Da oltre una generazione la famiglia di Viktor e Agafya non ha un blasone riconosciuto. Ai tempi del nonno, un misterioso incidente aveva provocato la perdita di tutte le informazioni sull'araldica di famiglia. Se Viktor vuole risultare vincitore dallo scontro con Agafya, avrà bisogno di questo simbolo e ciò significa avventurarsi sul luogo dell'incidente o inviare agenti fidati. Riprendere le terre di famiglia alla sua gemella. Viktor non userebbe mai la violenza, eccetto come ultima risorsa, ma sua sorella non ha di questi problemi e uccide tutti coloro che ne sfidano il dominio. Le sue guardie sono brutali e senza pietà. Viktor deve conti- nuare ad addestrare la popolazione con le lezioni che ha appreso dalla natura, per resistere al dominio di Agafya. Curare la sorella della sua fredda crudeltà. Viktor non ha perso le speranze che la sorella buona e gentile che conosceva sia ancora da qualche parte. Forse è vittima di una maledizione? Oppure viene manipolata? O, magari, ha solo dimenticato l'amore e la speranza che i genitori hanno insegnato loro? Non importa se dovrà farlo attraverso le sbarre di una prigione, Viktor ritroverà sua sorella.",
            "quote": "“ … questa, cari bambini, è Gena, un raro esemplare di leopardo ussurano! Oggi, seguiremo Gena mentre va a caccia e impareremo una cosa o due su come realizzare un’imboscata.”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 3, Acume 3, Panache 3 • Virtù: L’Imperatore Maestoso. Attivando questa Virtù, il GM darà un Punto Eroe a tutti gli altri Eroi presenti nella Scena. • Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
        "ability": "«“Mia cara, non posso. Siete bellissima, ma i dievai mi hanno maledetto e il mio unico amore può essere solo la Confederazione… ciò detto, credo che un bacio non farà male a nessuno.”»\n\nVantaggi: Comando, L’Unione Fa la Forza, Ricco, Scuola di Maniere, Sorriso Disarmante, Vieni Qui\n\nPeculiarità: Aristocratico. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Poseł. Ottiene un Punto Eroe ogni volta che insiste per una soluzione democratica quando sarebbe vantaggioso non votare.",
        "notes": "«“Mia cara, non posso. Siete bellissima, ma i dievai mi hanno maledetto e il mio unico amore può essere solo la Confederazione… ciò detto, credo che un bacio non farà male a nessuno.”»\nArchetipo: Eroi Baluardo\n\n📖 Storia:\nWicus Jachowski era il più ambito scapolo di Stanisławiec e il protagonista di una nuova storia d' amore ogni stagione, finché non incontrò W awyrzyniec, un miste- rioso nuovo arrivato nei circoli dell' alta società. Il suo fascino era tale che Wicus si decise ad accasarsi e dedicò la propria vita a farlo felice, imparando ogni giorno qual- cosa di più sull' uomo che amava. Quando W awyrzyniec si rivelò essere un dievas, venuto a proporgli un patto, il cuore di Wicus si spezzò. Scoprì che se mai avesse avuto, o adottato, un figlio questi sarebbe morto a causa di un male sopran- naturale. W awyrzyniec poteva fornire una cura, ma solo in cambio del sacrificio della vita di uno dei molti contadini che lavoravano le terre dei Jachowski. Tradito dalla persona che più amava al mondo, Wicus scomparve dalla scena sociale, gettò al vento l'amore e la famiglia e si dedicò ai più antichi obblighi della nobiltà: accudire i contadini che lavoravano il suo feudo e praticare le arti della guerra per proteggere la Nazione. Persino nella moderna Rzeczpospolita, questo comportamento da parte di un nobiluomo fece scandalo e gli alleati dei Jachowski, eccetto i suoi amici più cari, lo abbandonarono. Oggi Wicus è invecchiato e, dopo la morte dei genitori, ha cambiato testamento, lasciando le sue terre ai contadini che le lavorano. Ha disseminato informazioni e addestramento, un tempo esclusiva della nobiltà, tra il popolo. Storicamente, la nobiltà Sarmatiana è stata un'élite militare, ma oggi è il popolo ad aver bisogno di queste capacità per difen- dere la Nazione da invasori stranieri, che la conside- rano una preda facile. Wicus trascorre ore ogni giorno ad addestrare la nuova nobiltà di Sarmatia alla scherma, al tiro alla pistola, a cavalcare e ad indossare un'armatura senza uccidersi quando si cade nel fango. Insegna anche scacchi, giochi di strategia, etichetta e negoziato, formando nuovi diplomatici. Il resto delle giornate lo trascorre nei campi. Riempirsi di impegni ha tenuto Wicus a galla, ma persevera perché ha grandi speranze per il futuro della Nazione e di chi lavora nei suoi feudi.\n\n🎯 Obiettivi:\nConvincere l’incorreggibile Lady Leszczyński a lasciarlo in pace. Bogumiła Leszczyński ricorda a Wicus la sua gioventù, occupando quella che fu la sua posizione nei circoli sociali Rzepospolitani. I Leszczyński sono vecchi amici di famiglia, perciò Wicus non può semplice - mente dirle di non farsi più vedere. La cosa peggiore è che sta cercando di coinvolgerlo in una storia d'amore. Wicus sa che è una losejas impenitente e i suoi rapporti con i dievai potrebbero portargli grossi guai. Fortificare le sue terre contro un’invasione da Ussura. Il feudo di Wicus si trova appena a nord di Stanisławiec, al confine tra la Confederazione e i colli, territorio della sanguinaria baronessa ussurana Agafya Markova. Questa vicina ha un formidabile esercito privato e una lunga storia famigliare di conquiste. Se dovesse attaccare Sarmatia, le pianure dei Jachowski cadrebbero in fretta. Ottenere la “Mano dell’Angelo” , la leggendaria pistola in grado di uccidere un dievas. Un secolo fa, un armaiolo che aveva perso tutto, tranne la sua arte, a causa dei dievai, forgiò una pistola perfetta decorata con immagini di angeli in volo. La Chiesa V aticina conserva quest'arma in un deposito segreto, accessibile solo ai cacciatori di streghe dell'In- quisizione. Forse W awyrzyniec non se l'è presa per il rifiuto di Wicus, ma i dievai che lo inviarono potreb- bero non essere altrettanto magnanimi.\n\n🎭 Consigli di Interpretazione (Giocare Wicus Jachowski):\nWicus ha il portamento di un nobiluomo, con un gusto per lo stile e il drammatico che, quando era giovane, fece girare molte teste. È pieno di ardore romantico, che riversa nel lavoro manuale e nello studio delle arti militari. Ha passato molti anni della maturità a convincersi che i suoi grandi ideali sono più importanti dei sentimenti personali. Chi lo conosce nota gli occasionali flirt che superano il velo della cortesia e il modo in cui parla di Sarmatia, come se fosse la sua amante, non il suo Paese.",
        "pcData": {
            "name": "Wicus Jachowski",
            "nation": "Confederazione Sarmatiana",
            "concept": "Eroi Baluardo • Confederazione Sarmatiana",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 2,
                "Atletica": 0,
                "Cavalcare": 1,
                "Convincere": 3,
                "Empatia": 3,
                "Esibirsi": 1,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 2,
                "Mira": 1,
                "Mischia": 1,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 0
            },
            "advantages": [
                "Comando",
                "L’Unione Fa la Forza",
                "Ricco",
                "Scuola di Maniere",
                "Sorriso Disarmante",
                "Vieni Qui"
            ],
            "virtue": "Virtù: L’Imperatore Maestoso. Attivando questa Virtù, il GM darà un Punto Eroe a tutti gli altri Eroi presenti nella Scena.",
            "hubris": "Hubris: La Guerra Leale. L’Eroe riceve un Punto Eroe quando torna indietro per aiutare un compagno caduto o si rifiuta di abbandonare un ferito.",
            "peculiarities": "Aristocratico. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Poseł. Ottiene un Punto Eroe ogni volta che insiste per una soluzione democratica quando sarebbe vantaggioso non votare.",
            "story": "Wicus Jachowski era il più ambito scapolo di Stanisławiec e il protagonista di una nuova storia d' amore ogni stagione, finché non incontrò W awyrzyniec, un miste- rioso nuovo arrivato nei circoli dell' alta società. Il suo fascino era tale che Wicus si decise ad accasarsi e dedicò la propria vita a farlo felice, imparando ogni giorno qual- cosa di più sull' uomo che amava. Quando W awyrzyniec si rivelò essere un dievas, venuto a proporgli un patto, il cuore di Wicus si spezzò. Scoprì che se mai avesse avuto, o adottato, un figlio questi sarebbe morto a causa di un male sopran- naturale. W awyrzyniec poteva fornire una cura, ma solo in cambio del sacrificio della vita di uno dei molti contadini che lavoravano le terre dei Jachowski. Tradito dalla persona che più amava al mondo, Wicus scomparve dalla scena sociale, gettò al vento l'amore e la famiglia e si dedicò ai più antichi obblighi della nobiltà: accudire i contadini che lavoravano il suo feudo e praticare le arti della guerra per proteggere la Nazione. Persino nella moderna Rzeczpospolita, questo comportamento da parte di un nobiluomo fece scandalo e gli alleati dei Jachowski, eccetto i suoi amici più cari, lo abbandonarono. Oggi Wicus è invecchiato e, dopo la morte dei genitori, ha cambiato testamento, lasciando le sue terre ai contadini che le lavorano. Ha disseminato informazioni e addestramento, un tempo esclusiva della nobiltà, tra il popolo. Storicamente, la nobiltà Sarmatiana è stata un'élite militare, ma oggi è il popolo ad aver bisogno di queste capacità per difen- dere la Nazione da invasori stranieri, che la conside- rano una preda facile. Wicus trascorre ore ogni giorno ad addestrare la nuova nobiltà di Sarmatia alla scherma, al tiro alla pistola, a cavalcare e ad indossare un'armatura senza uccidersi quando si cade nel fango. Insegna anche scacchi, giochi di strategia, etichetta e negoziato, formando nuovi diplomatici. Il resto delle giornate lo trascorre nei campi. Riempirsi di impegni ha tenuto Wicus a galla, ma persevera perché ha grandi speranze per il futuro della Nazione e di chi lavora nei suoi feudi.",
            "objectives": "Convincere l’incorreggibile Lady Leszczyński a lasciarlo in pace. Bogumiła Leszczyński ricorda a Wicus la sua gioventù, occupando quella che fu la sua posizione nei circoli sociali Rzepospolitani. I Leszczyński sono vecchi amici di famiglia, perciò Wicus non può semplice - mente dirle di non farsi più vedere. La cosa peggiore è che sta cercando di coinvolgerlo in una storia d'amore. Wicus sa che è una losejas impenitente e i suoi rapporti con i dievai potrebbero portargli grossi guai. Fortificare le sue terre contro un’invasione da Ussura. Il feudo di Wicus si trova appena a nord di Stanisławiec, al confine tra la Confederazione e i colli, territorio della sanguinaria baronessa ussurana Agafya Markova. Questa vicina ha un formidabile esercito privato e una lunga storia famigliare di conquiste. Se dovesse attaccare Sarmatia, le pianure dei Jachowski cadrebbero in fretta. Ottenere la “Mano dell’Angelo” , la leggendaria pistola in grado di uccidere un dievas. Un secolo fa, un armaiolo che aveva perso tutto, tranne la sua arte, a causa dei dievai, forgiò una pistola perfetta decorata con immagini di angeli in volo. La Chiesa V aticina conserva quest'arma in un deposito segreto, accessibile solo ai cacciatori di streghe dell'In- quisizione. Forse W awyrzyniec non se l'è presa per il rifiuto di Wicus, ma i dievai che lo inviarono potreb- bero non essere altrettanto magnanimi.",
            "quote": "“Mia cara, non posso. Siete bellissima, ma i dievai mi hanno maledetto e il mio unico amore può essere solo la Confederazione… ciò detto, credo che un bacio non farà male a nessuno.”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 2, Acume 4, Panache 3 • Virtù: Il Glifo Mite. Attivando questa Virtù, l’Eroe impedisce a qualsiasi effetto magico (Stregoneria, Artefatti, Mostri ecc.) di avere effetto su di lei. • Hubris: La Ruota Sfortunata. L’Eroe riceve 1 Punto Eroe aggiuntivo ogni volta che decide di fallire volontariamente un Rischio importante senza lanciare i dadi. Stregoneria Desideria conosce le Trame di Lettura, Benedizione Minore, Benedizione Maggiore, Arcani Minore, Arcani Maggiore e Trascinare Minore.",
        "ability": "«“No. Ne ho abbastanza di essere una pedina. Questa volta farete ciò che dico io. E vi piacerà.”»\n\nVantaggi: Ispirare Generosità, Opportunista, Orologio Biologico, Ricca, Sorriso Disarmante, Stregoneria: Sorte 2\n\nPeculiarità: Aristocratica. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Strega della Sorte. Ottiene un Punto Eroe ogni volta che si sottomette a un corso d’azione pericoloso convinta che sia il volere del destino.",
        "notes": "«“No. Ne ho abbastanza di essere una pedina. Questa volta farete ciò che dico io. E vi piacerà.”»\nArchetipo: Eroi Ingannatori\n\n📖 Storia:\nDesideria ha sempre ottenuto ciò che voleva. Nuovi vestiti? La madre ordinava un cambio di guardaroba per sé e le figlie. Fiori? Un nuovo spasimante le inviava un'enorme bouquet. Le piaceva un ragazzo? All' improvviso era inna- morato cotto. T uttavia, niente di tutto questo era ciò a cui anelava davvero. Desideria rimaneva imprigionata dietro veli neri, non importa quanto raffinati. I suoi spasimanti volevano solo ottenere il controllo di una Strega della Sorte tanto potente. E quel ragazzo non l' amava davvero, era solo lei a farglielo credere. Per anni, Desideria ebbe difficoltà a convivere con se stessa. Odiava tanto il ruolo sottomesso a cui il suo sesso la costringeva, quanto il non riuscire a controllare coscientemente la sua magia. Passava le giornate a letto e mangiava appena. Un giorno, un ragazzino plebeo in fuga dalle guardie per poco non fece ribaltare il suo calessino. Sembrava tanto piccolo e indifeso che Desideria usò la magia per aiutarlo e, per la prima volta in vita sua, la Sorte rispose ai suoi comandi. Il ragazzo fuggì e questo primo atto di generosità ruppe il ciclo della depressione. Rinfrancata nello spirito, Desideria si scontrò di nuovo con la gabbia dorata in cui viveva. Il padre voleva che usasse la Sorte al suo servizio, mentre la madre le ricordava di essere timida, modesta e di tenere gli occhi bassi dietro il velo. Desideria odiava tutto questo e decise di combat- tere. In un atto di aperta ribellione, rifiutò ogni preten- dente. Potevano presentarsi, portarle regali, ma alla fine li respingeva. In segreto, invece, imparò da sola a leggere, con tempo e fatica, studiando vecchie lettere rubate dallo studio del padre. Sopra ogni altra cosa, Desideria ha usato la Sorte per trasformare V odacce, manipolando uno dei figli della famiglia Bernoulli affinché riducesse le tasse verso i plebei e creasse un sistema di protezione commerciale dei suoi dipendenti. Deve stare attenta, affinché gli alleati dei Bernoulli nella Chiesa non la scoprano, ma crede di potersela cavare. Desideria è un' alleata naturale per chiunque tenti di superare i limiti imposti dalla propria nascita. Non cerca attivamente queste cause, ma tende a simpatizzare con quelle che incontra: sa bene cosa significhi non poter esprimere il proprio potenziale. V odacce presenta così tante diseguaglianze, che Desideria non ha ancora defi- nito il suo vero obiettivo: al momento si sta concentrando sui Bernoulli, ma potrebbe passare facilmente a un' altra famiglia. Per ora, passa da uno scontro all' altro in base a chi incontra sulla sua strada e ciò la rende una risorsa, ma anche un potenziale punto debole.\n\n🎯 Obiettivi:\nRendere pubblico lo sfruttamento dei lavoratori da parte di Facio Contarini. Desideria pianificava di usare la Sorte contro Facio, ma questi la scoprì e la minacciò: se avesse tentato, lui avrebbe reso pubblico il suo tentativo di impa - rare a leggere. Lei ha finto di ritirarsi spaventata e sta cercando un nuovo approccio, ma non teme di affrontare la reciproca distruzione se sarà necessario. Scoprire cos’è accaduto alla sua amica d’infanzia Giuliana Onesta. Desideria e Giuliana crebbero insieme finché, dopo una tragedia famigliare, quest' ultima divenne sempre più ritrosa e infine smise di farle visita. Desideria crede di non essere stata abbastanza presente per consolare l' amica e vuole ritrovarla per scusarsi e riallacciare il legame. Trovare un’insegnante di magia della Sorte. L' attuale insegnante di magia di Desideria è pagata e controllata da suo padre. Lei vuole trovarne un' altra che le insegni ciò che le occorre per essere indipendente.\n\n🎭 Consigli di Interpretazione (Giocare Desideria Colomberia):\nDesideria appare come la perfetta immagine di una nobil- donna timida ed educata, priva di pensieri o ambizioni personali. Lascia cadere questa maschera solo in presenza dei suoi alleati più fidati, quando si scaglia contro le limi- tazioni imposte al suo sesso. Ama discutere con donne straniere delle divisioni di genere nei loro paesi. Giovane, ma profondamente empatica, Desideria combatte contro ogni forma di oppressione, sebbene dia inconsciamente la priorità alla propria situazione e a quella delle altre nobildonne. Se percepisce che un alleato sta cercando di controllarla reagisce aggredendo. In termini di puro potere magico, Desideria ha pochi eguali ma ha difficoltà a controllarlo, specie se è spaventata o furiosa. Ogni volta che una coincidenza fortunata o un alleato improbabile le viene in aiuto, Desideria si chiede se lo ha fatto accadere lei.",
        "pcData": {
            "name": "Desideria Colomberia",
            "nation": "Vodacce",
            "concept": "Eroi Ingannatori • Vodacce",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 2,
                "Acume": 4,
                "Panache": 3
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 0,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 2,
                "Esibirsi": 2,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 2,
                "Mira": 1,
                "Mischia": 0,
                "Nascondersi": 3,
                "Navigazione": 0,
                "Notare": 1,
                "Rissa": 0
            },
            "advantages": [
                "Ispirare Generosità",
                "Opportunista",
                "Orologio Biologico",
                "Ricca",
                "Sorriso Disarmante",
                "Stregoneria: Sorte 2"
            ],
            "virtue": "Virtù: Il Glifo Mite. Attivando questa Virtù, l’Eroe impedisce a qualsiasi effetto magico (Stregoneria, Artefatti, Mostri ecc.) di avere effetto su di lei.",
            "hubris": "Hubris: La Ruota Sfortunata. L’Eroe riceve 1 Punto Eroe aggiuntivo ogni volta che decide di fallire volontariamente un Rischio importante senza lanciare i dadi. Stregoneria Desideria conosce le Trame di Lettura, Benedizione Minore, Benedizione Maggiore, Arcani Minore, Arcani Maggiore e Trascinare Minore.",
            "peculiarities": "Aristocratica. Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte. Strega della Sorte. Ottiene un Punto Eroe ogni volta che si sottomette a un corso d’azione pericoloso convinta che sia il volere del destino.",
            "story": "Desideria ha sempre ottenuto ciò che voleva. Nuovi vestiti? La madre ordinava un cambio di guardaroba per sé e le figlie. Fiori? Un nuovo spasimante le inviava un'enorme bouquet. Le piaceva un ragazzo? All' improvviso era inna- morato cotto. T uttavia, niente di tutto questo era ciò a cui anelava davvero. Desideria rimaneva imprigionata dietro veli neri, non importa quanto raffinati. I suoi spasimanti volevano solo ottenere il controllo di una Strega della Sorte tanto potente. E quel ragazzo non l' amava davvero, era solo lei a farglielo credere. Per anni, Desideria ebbe difficoltà a convivere con se stessa. Odiava tanto il ruolo sottomesso a cui il suo sesso la costringeva, quanto il non riuscire a controllare coscientemente la sua magia. Passava le giornate a letto e mangiava appena. Un giorno, un ragazzino plebeo in fuga dalle guardie per poco non fece ribaltare il suo calessino. Sembrava tanto piccolo e indifeso che Desideria usò la magia per aiutarlo e, per la prima volta in vita sua, la Sorte rispose ai suoi comandi. Il ragazzo fuggì e questo primo atto di generosità ruppe il ciclo della depressione. Rinfrancata nello spirito, Desideria si scontrò di nuovo con la gabbia dorata in cui viveva. Il padre voleva che usasse la Sorte al suo servizio, mentre la madre le ricordava di essere timida, modesta e di tenere gli occhi bassi dietro il velo. Desideria odiava tutto questo e decise di combat- tere. In un atto di aperta ribellione, rifiutò ogni preten- dente. Potevano presentarsi, portarle regali, ma alla fine li respingeva. In segreto, invece, imparò da sola a leggere, con tempo e fatica, studiando vecchie lettere rubate dallo studio del padre. Sopra ogni altra cosa, Desideria ha usato la Sorte per trasformare V odacce, manipolando uno dei figli della famiglia Bernoulli affinché riducesse le tasse verso i plebei e creasse un sistema di protezione commerciale dei suoi dipendenti. Deve stare attenta, affinché gli alleati dei Bernoulli nella Chiesa non la scoprano, ma crede di potersela cavare. Desideria è un' alleata naturale per chiunque tenti di superare i limiti imposti dalla propria nascita. Non cerca attivamente queste cause, ma tende a simpatizzare con quelle che incontra: sa bene cosa significhi non poter esprimere il proprio potenziale. V odacce presenta così tante diseguaglianze, che Desideria non ha ancora defi- nito il suo vero obiettivo: al momento si sta concentrando sui Bernoulli, ma potrebbe passare facilmente a un' altra famiglia. Per ora, passa da uno scontro all' altro in base a chi incontra sulla sua strada e ciò la rende una risorsa, ma anche un potenziale punto debole.",
            "objectives": "Rendere pubblico lo sfruttamento dei lavoratori da parte di Facio Contarini. Desideria pianificava di usare la Sorte contro Facio, ma questi la scoprì e la minacciò: se avesse tentato, lui avrebbe reso pubblico il suo tentativo di impa - rare a leggere. Lei ha finto di ritirarsi spaventata e sta cercando un nuovo approccio, ma non teme di affrontare la reciproca distruzione se sarà necessario. Scoprire cos’è accaduto alla sua amica d’infanzia Giuliana Onesta. Desideria e Giuliana crebbero insieme finché, dopo una tragedia famigliare, quest' ultima divenne sempre più ritrosa e infine smise di farle visita. Desideria crede di non essere stata abbastanza presente per consolare l' amica e vuole ritrovarla per scusarsi e riallacciare il legame. Trovare un’insegnante di magia della Sorte. L' attuale insegnante di magia di Desideria è pagata e controllata da suo padre. Lei vuole trovarne un' altra che le insegni ciò che le occorre per essere indipendente.",
            "quote": "“No. Ne ho abbastanza di essere una pedina. Questa volta farete ciò che dico io. E vi piacerà.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 2, Acume 2, Panache 4 • Virtù: La Strada Amichevole. Attivando questa Virtù quando l’Eroe incontra un personaggio per la prima volta, anche un Malvagio, questi lo tratterà amichevolmente per una Scena. • Hubris: Il Diavolo Fiducioso. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato. Stregoneria Kassidy è l’incarnazione di Sæwine, la Marinaia. Il suo Tratto Maggiore è Panache, il Minore è Grazia. Conosce l’Incanto Maggiore Resistere alla Stregoneria (Grado 1); e l’Incanto Minore Svanire (Grado 2).",
        "ability": "«“Tutti possono essere eroi, specialmente ad Avalon!”»\n\nVantaggi: Bevitore Emerito, Cameratismo, Lavorare sui Tetti, Mercanteggiare, Riflessi Rapidi: Notare, Stregoneria: Cavaliere di Avalon 1, Virtuoso: Flauto di pan\n\nPeculiarità: Bardo. Ottiene un Punto Eroe ogni volta che risolve un problema seguendo l’esempio di una Leggenda. Esploratore. Ottiene un Punto Eroe ogni volta che posa lo sguardo su una vista che pochi o nessuno a Théah hanno mai potuto godere.",
        "notes": "«“Tutti possono essere eroi, specialmente ad Avalon!”»\nArchetipo: Eroi Ingannatori\n\n📖 Storia:\nDa quando ha memoria, a Kassidy Minihan non è mai stato permesso di lasciare la propria casa, per paura che si perdesse inseguendo una persona che non esisteva. Sua madre, una semplice sarta nel piccolo paese di Collen, era terribilmente spaventata all' idea che il figlio fosse matto e facesse del male a se stesso o agli altri. Kassidy non era matto, stava solo conversando con i suoi amici fatati. Era stato toccato, sin dalla nascita, dalle potenti creature che vivono accanto alla popolazione di Avalon. T entò di calmare sua madre e spiegarle che i suoi amici non volevano far male a nessuno, ma lei insistette a tenerlo rinchiuso e lontano da ogni contatto umano. Perciò Kassidy trascorreva le sue giornate a parlare con i suoi amici “immaginari” , ascoltando i loro racconti di eroi e creature fantastiche. Desiderava, sopra ogni altra cosa, essere l'eroe di una di queste storie. Quando Kassidy aveva 16 anni, la madre si ammalò. Lo fece avvicinare al suo capezzale, gli chiese perdono per averlo rinchiuso e gli fece promettere che, dopo la sua morte, sarebbe partito per vedere il mondo e cercare la felicità. Kassidy glielo promise e le rimase accanto fino all' ultimo, poi fece fagotto e partì. Un'anima innocente pronta a esplorare oriz - zonti gloriosi. Ovviamente, appena fu sulla strada Kassidy scoprì che non tutto ad Avalon era bello e maestoso. In molti luoghi le fate, un tempo venerate, venivano derise, erano oggetto di malignità e maltrattamenti. C'erano persone bisognose di aiuto e altre che abusavano degli indifesi. Con lo sguardo ancora puro, Kassidy si diresse dove poteva fare del bene. Giunse alla cittadina di Hallibury, nel nord di Inismore, sotto assedio da parte di mercenari eise - niani. Rimasti bloccati sulle isole senza un soldo, questi soldati avevano deciso di sfruttare le fate per guadagnare il denaro necessario per tornare in patria. Per tutta risposta, le fate avevano minacciato di far ricadere la loro vendetta su tutta la popolazione di Hallibury. Kassidy si fece avanti per negoziare una tregua. Durante le trattative, le fate si lasciarono sfuggire un segreto: sapevano della corona perduta di Inismore. Per Kassidy è tempo di diventare l'eroe che ha sempre sognato.\n\n🎯 Obiettivi:\nCalmare le fate dopo l’incidente con gli eiseniani. Kassidy è giunto a Hallibury appena in tempo per impedire una guerra totale tra fate e umani. T uttavia, con i mercenari eiseniani che ancora depredano la regione e molestano il piccolo popolo per ottenere denaro con cui riparare le loro imbarcazioni, è solo questione di tempo prima che i Sidhe rispondano. Impedirlo dipende solo da lui. Scoprire dove si era diretto il padre prima che lui nascesse. Kassidy non ha mai conosciuto suo padre e si è sempre chiesto cosa gli fosse accaduto. L'unico indizio lasciatogli in eredità è un anello d'argento con una pietra blu. Oggi Kassidy è alla ricerca del padre, nella speranza che l'uomo sappia qualcosa sul suo miste - rioso legame con le fate. Seguire le fate fino alla perduta corona di Inismore. L'aiuto prestato alle fate presso Hallibury ha dato a Kassidy il primo indizio sul luogo dove riposa la corona perduta di Inismore: una scia di farfalle blu lo condurrà laggiù. Kassidy sa che la corona è più che un semplice tesoro e non si fermerà finché non l'avrà ritrovata per il bene del regno.\n\n🎭 Consigli di Interpretazione (Giocare Kassidy Minihan):\nKassidy Minihan è un'anima davvero innocente, un bel giovane con gli occhi pieni di meraviglia, il sorriso facile e nessuna presunzione. Ama tutto ciò che è nuovo e si butta in ogni esperienza inedita con passione, che sia una lunga camminata o un duro lavoro. Prova ogni emozione con enorme intensità ed esprime i suoi sentimenti apertamente, senza alcun velo. Ama parlare e lo fa con fervore, gesticolando e con un sorriso da un orecchio all'altro. Quando tratta con le fate, Kassidy si comporta in modo trascendente e quasi inumano, ma ritorna con facilità al suo umore normale. Sembra confuso da quanto le persone siano intimorite delle fate e, durante i confronti, è altruista, coraggioso e più sicuro di sé di quanto dovrebbe essere.",
        "pcData": {
            "name": "Kassidy Minihan",
            "nation": "Inismore",
            "concept": "Eroi Ingannatori • Inismore",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 2,
                "Acume": 2,
                "Panache": 4
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 3,
                "Esibirsi": 2,
                "Furto": 2,
                "Intimidire": 0,
                "Istruzione": 0,
                "Mira": 1,
                "Mischia": 0,
                "Nascondersi": 2,
                "Navigazione": 0,
                "Notare": 3,
                "Rissa": 0
            },
            "advantages": [
                "Bevitore Emerito",
                "Cameratismo",
                "Lavorare sui Tetti",
                "Mercanteggiare",
                "Riflessi Rapidi: Notare",
                "Stregoneria: Cavaliere di Avalon 1",
                "Virtuoso: Flauto di pan"
            ],
            "virtue": "Virtù: La Strada Amichevole. Attivando questa Virtù quando l’Eroe incontra un personaggio per la prima volta, anche un Malvagio, questi lo tratterà amichevolmente per una Scena.",
            "hubris": "Hubris: Il Diavolo Fiducioso. L’Eroe riceve un Punto Eroe quando accetta incondizionatamente una menzogna o un accordo palesemente truccato. Stregoneria Kassidy è l’incarnazione di Sæwine, la Marinaia. Il suo Tratto Maggiore è Panache, il Minore è Grazia. Conosce l’Incanto Maggiore Resistere alla Stregoneria (Grado 1); e l’Incanto Minore Svanire (Grado 2).",
            "peculiarities": "Bardo. Ottiene un Punto Eroe ogni volta che risolve un problema seguendo l’esempio di una Leggenda. Esploratore. Ottiene un Punto Eroe ogni volta che posa lo sguardo su una vista che pochi o nessuno a Théah hanno mai potuto godere.",
            "story": "Da quando ha memoria, a Kassidy Minihan non è mai stato permesso di lasciare la propria casa, per paura che si perdesse inseguendo una persona che non esisteva. Sua madre, una semplice sarta nel piccolo paese di Collen, era terribilmente spaventata all' idea che il figlio fosse matto e facesse del male a se stesso o agli altri. Kassidy non era matto, stava solo conversando con i suoi amici fatati. Era stato toccato, sin dalla nascita, dalle potenti creature che vivono accanto alla popolazione di Avalon. T entò di calmare sua madre e spiegarle che i suoi amici non volevano far male a nessuno, ma lei insistette a tenerlo rinchiuso e lontano da ogni contatto umano. Perciò Kassidy trascorreva le sue giornate a parlare con i suoi amici “immaginari” , ascoltando i loro racconti di eroi e creature fantastiche. Desiderava, sopra ogni altra cosa, essere l'eroe di una di queste storie. Quando Kassidy aveva 16 anni, la madre si ammalò. Lo fece avvicinare al suo capezzale, gli chiese perdono per averlo rinchiuso e gli fece promettere che, dopo la sua morte, sarebbe partito per vedere il mondo e cercare la felicità. Kassidy glielo promise e le rimase accanto fino all' ultimo, poi fece fagotto e partì. Un'anima innocente pronta a esplorare oriz - zonti gloriosi. Ovviamente, appena fu sulla strada Kassidy scoprì che non tutto ad Avalon era bello e maestoso. In molti luoghi le fate, un tempo venerate, venivano derise, erano oggetto di malignità e maltrattamenti. C'erano persone bisognose di aiuto e altre che abusavano degli indifesi. Con lo sguardo ancora puro, Kassidy si diresse dove poteva fare del bene. Giunse alla cittadina di Hallibury, nel nord di Inismore, sotto assedio da parte di mercenari eise - niani. Rimasti bloccati sulle isole senza un soldo, questi soldati avevano deciso di sfruttare le fate per guadagnare il denaro necessario per tornare in patria. Per tutta risposta, le fate avevano minacciato di far ricadere la loro vendetta su tutta la popolazione di Hallibury. Kassidy si fece avanti per negoziare una tregua. Durante le trattative, le fate si lasciarono sfuggire un segreto: sapevano della corona perduta di Inismore. Per Kassidy è tempo di diventare l'eroe che ha sempre sognato.",
            "objectives": "Calmare le fate dopo l’incidente con gli eiseniani. Kassidy è giunto a Hallibury appena in tempo per impedire una guerra totale tra fate e umani. T uttavia, con i mercenari eiseniani che ancora depredano la regione e molestano il piccolo popolo per ottenere denaro con cui riparare le loro imbarcazioni, è solo questione di tempo prima che i Sidhe rispondano. Impedirlo dipende solo da lui. Scoprire dove si era diretto il padre prima che lui nascesse. Kassidy non ha mai conosciuto suo padre e si è sempre chiesto cosa gli fosse accaduto. L'unico indizio lasciatogli in eredità è un anello d'argento con una pietra blu. Oggi Kassidy è alla ricerca del padre, nella speranza che l'uomo sappia qualcosa sul suo miste - rioso legame con le fate. Seguire le fate fino alla perduta corona di Inismore. L'aiuto prestato alle fate presso Hallibury ha dato a Kassidy il primo indizio sul luogo dove riposa la corona perduta di Inismore: una scia di farfalle blu lo condurrà laggiù. Kassidy sa che la corona è più che un semplice tesoro e non si fermerà finché non l'avrà ritrovata per il bene del regno.",
            "quote": "“Tutti possono essere eroi, specialmente ad Avalon!”"
        }
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
        "traits": "Vigore 3, Grazia 2, Risolutezza 3, Acume 2, Panache 3 • Virtù: Il Glifo Mite. Attivando questa Virtù, l’Eroe impedisce a qualsiasi effetto magico (Stregoneria, Artefatti, Mostri ecc.) di avere effetto su di lui. • Hubris: Il Matto Curioso. L'eroe riceve un Punto Eroe quando investiga su qualcosa di inusuale, specialmente se pericoloso.",
        "ability": "«“Ho promesso di trainare quindici carretti con i denti mentre combatto un’orda di coboldi, di tosare trenta pecore e di fare un massaggio ai piedi di tua nonna, tutto in un giorno? Allora è meglio che mi dia una mossa, perché sarà una lunga giornata.”»\n\nVantaggi: Fama: Coraggioso, Non Morirò Qui, Sala d’Armi: Eisenfaust, Scafato, Senso dell’Orientamento, Volontà Indomabile\n\nPeculiarità: Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale. Ungetümjäger. Ottiene un Punto Eroe ogni volta che si dedica a cacciare una creatura inumana per impedirle di spargere altro male.",
        "notes": "«“Ho promesso di trainare quindici carretti con i denti mentre combatto un’orda di coboldi, di tosare trenta pecore e di fare un massaggio ai piedi di tua nonna, tutto in un giorno? Allora è meglio che mi dia una mossa, perché sarà una lunga giornata.”»\nArchetipo: Eroi Ingannatori\n\n📖 Storia:\nSi racconta che lo Schlammann sia nato direttamente dal fango di Eisen e che ancora in fasce abbia gatto - nato per oscure foreste fino a incontrare un imp. Il demonietto aggredì il bambino ma lo schlammkind (bimbo del fango) era furbo e balzò sulla schiena del mostro. Controllando le ali dell'imp, il bebè volò nei cieli di Eisen. Viaggiò per molti giorni, fino a raggiungere la casa di un fabbro, dove atterrò per riposare. Quando il marito dell'artigiana uscì diretto al pozzo, trovò il piccolo nascosto tra le ombre. Felicissimo, l'uomo lo raccolse e lo portò in casa. La coppia non aveva figli e pensò che il bambino fosse un dono della terra. Lo chiamarono Ludwig. Il bimbo crebbe forte come la madre e saggio quanto il padre. A soli 10 anni aveva già combattuto il suo primo Orrore e a 20 era pronto alla sua più grande sfida: un Orrore era apparso a Est e come Ludwig era fuoruscito dalla terra stessa. Là dove Schlammann era figlio delle foreste, questa creatura era nata dal fango impregnato dal sangue delle battaglie ed era affamata della carne dei vivi. Fu allora che Schlammann scomparve dalle cronache, insieme con la minaccia venuta dall' Est. Alcuni sostengono che abbia sconfitto il mostro, altri che la carne di un eroe tanto grande sia stata sufficiente a saziarlo. Nessuno lo sa con certezza. Ludwig si risvegliò dal suo sonno un anno dopo. Ricordava il proprio nome e tutti i luoghi ove era passato, ma non chi fosse. Alla ricerca di risposte, partì per un nuovo viaggio per ritrovare se stesso. Di città in città, Ludwig cominciò a trovare indizi su chi fosse lo Schlammann. Ovunque andasse sentiva racconti dell'eroe di Eisen e, sebbene molti gli paiano esagerazioni, quest'uomo generoso fa del suo meglio per essere all'altezza di tale fama. Quando giunge in una città, se è fortunato, un frammento dei suoi vecchi ricordi gli ritorna, come un pezzo di un puzzle che compone giorno dopo giorno. Quando dorme, i suoi sogni sono pieni di sangue e di una donna vestita di bianco che urla furibonda. Crede che questa figura sia la chiave per i suoi ricordi e deve ritrovarla.\n\n🎯 Obiettivi:\nAscoltare i racconti sullo Schlammann. Ludwig desidera sapere di più sull'uomo che era e su cosa gli abbia fatto perdere la memoria. Ogni giorno cerca cantastorie, viaggiatori e altri personaggi che conoscano le sue vicende, per scoprire il proprio scopo su questa terra. Trovare la donna con pelle, capelli e abiti candidi come la neve. Quando dorme, Schlammann sogna una donna candida come la neve. Ha sentito parlare di una gran dama di Hirschblut, pallida come la luna, e ciò lo ha colpito. Forse le farà presto visita. Recuperare i ricordi. Appoggiarsi ai racconti va bene, ma ogni volta che si addormenta Ludwig dimentica molto di quanto ha imparato. Quando raggiunge un luogo legato alla sua vecchia vita i ricordi, se sono abbastanza forti, gli ritornano tutti insieme. Spera che, viaggiando e compiendo gesta eroiche come suggeriscono le leggende, un giorno scoprirà chi è davvero.\n\n🎭 Consigli di Interpretazione (Giocare Ludwig Schlammann):\nLudwing non riesce a ricordare da un giorno all'altro, ma questo non gli ha impedito di essere un uomo gentile e pieno di fiducia. Ama sentir raccontare dei suoi atti passati. Nel profondo, sa che alcuni di questi racconti sono esagerazioni, ma sapere che ha fatto del bene gli consente di essere in pace con se stesso. Schlammann non ha paura di ridere di sé, come è capace solo qualcuno che passa la vita coperto di fango, e raramente lo si incontra senza un sorriso stampato sul volto.",
        "pcData": {
            "name": "Ludwig Schlammann",
            "nation": "Eisen",
            "concept": "Eroi Ingannatori • Eisen",
            "traits": {
                "Vigore": 3,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 2,
                "Panache": 3
            },
            "skills": {
                "Allettare": 0,
                "A.d. Guerra": 0,
                "Atletica": 3,
                "Cavalcare": 0,
                "Convincere": 1,
                "Empatia": 2,
                "Esibirsi": 2,
                "Furto": 0,
                "Intimidire": 1,
                "Istruzione": 0,
                "Mira": 1,
                "Mischia": 3,
                "Nascondersi": 2,
                "Navigazione": 0,
                "Notare": 3,
                "Rissa": 2
            },
            "advantages": [
                "Fama: Coraggioso",
                "Non Morirò Qui",
                "Sala d’Armi: Eisenfaust",
                "Scafato",
                "Senso dell’Orientamento",
                "Volontà Indomabile"
            ],
            "virtue": "Virtù: Il Glifo Mite. Attivando questa Virtù, l’Eroe impedisce a qualsiasi effetto magico (Stregoneria, Artefatti, Mostri ecc.) di avere effetto su di lui.",
            "hubris": "Hubris: Il Matto Curioso. L'eroe riceve un Punto Eroe quando investiga su qualcosa di inusuale, specialmente se pericoloso.",
            "peculiarities": "Duellante. Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale. Ungetümjäger. Ottiene un Punto Eroe ogni volta che si dedica a cacciare una creatura inumana per impedirle di spargere altro male.",
            "story": "Si racconta che lo Schlammann sia nato direttamente dal fango di Eisen e che ancora in fasce abbia gatto - nato per oscure foreste fino a incontrare un imp. Il demonietto aggredì il bambino ma lo schlammkind (bimbo del fango) era furbo e balzò sulla schiena del mostro. Controllando le ali dell'imp, il bebè volò nei cieli di Eisen. Viaggiò per molti giorni, fino a raggiungere la casa di un fabbro, dove atterrò per riposare. Quando il marito dell'artigiana uscì diretto al pozzo, trovò il piccolo nascosto tra le ombre. Felicissimo, l'uomo lo raccolse e lo portò in casa. La coppia non aveva figli e pensò che il bambino fosse un dono della terra. Lo chiamarono Ludwig. Il bimbo crebbe forte come la madre e saggio quanto il padre. A soli 10 anni aveva già combattuto il suo primo Orrore e a 20 era pronto alla sua più grande sfida: un Orrore era apparso a Est e come Ludwig era fuoruscito dalla terra stessa. Là dove Schlammann era figlio delle foreste, questa creatura era nata dal fango impregnato dal sangue delle battaglie ed era affamata della carne dei vivi. Fu allora che Schlammann scomparve dalle cronache, insieme con la minaccia venuta dall' Est. Alcuni sostengono che abbia sconfitto il mostro, altri che la carne di un eroe tanto grande sia stata sufficiente a saziarlo. Nessuno lo sa con certezza. Ludwig si risvegliò dal suo sonno un anno dopo. Ricordava il proprio nome e tutti i luoghi ove era passato, ma non chi fosse. Alla ricerca di risposte, partì per un nuovo viaggio per ritrovare se stesso. Di città in città, Ludwig cominciò a trovare indizi su chi fosse lo Schlammann. Ovunque andasse sentiva racconti dell'eroe di Eisen e, sebbene molti gli paiano esagerazioni, quest'uomo generoso fa del suo meglio per essere all'altezza di tale fama. Quando giunge in una città, se è fortunato, un frammento dei suoi vecchi ricordi gli ritorna, come un pezzo di un puzzle che compone giorno dopo giorno. Quando dorme, i suoi sogni sono pieni di sangue e di una donna vestita di bianco che urla furibonda. Crede che questa figura sia la chiave per i suoi ricordi e deve ritrovarla.",
            "objectives": "Ascoltare i racconti sullo Schlammann. Ludwig desidera sapere di più sull'uomo che era e su cosa gli abbia fatto perdere la memoria. Ogni giorno cerca cantastorie, viaggiatori e altri personaggi che conoscano le sue vicende, per scoprire il proprio scopo su questa terra. Trovare la donna con pelle, capelli e abiti candidi come la neve. Quando dorme, Schlammann sogna una donna candida come la neve. Ha sentito parlare di una gran dama di Hirschblut, pallida come la luna, e ciò lo ha colpito. Forse le farà presto visita. Recuperare i ricordi. Appoggiarsi ai racconti va bene, ma ogni volta che si addormenta Ludwig dimentica molto di quanto ha imparato. Quando raggiunge un luogo legato alla sua vecchia vita i ricordi, se sono abbastanza forti, gli ritornano tutti insieme. Spera che, viaggiando e compiendo gesta eroiche come suggeriscono le leggende, un giorno scoprirà chi è davvero.",
            "quote": "“Ho promesso di trainare quindici carretti con i denti mentre combatto un’orda di coboldi, di tosare trenta pecore e di fare un massaggio ai piedi di tua nonna, tutto in un giorno? Allora è meglio che mi dia una mossa, perché sarà una lunga giornata.”"
        }
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
        "traits": "Vigore 2, Grazia 3, Risolutezza 2, Acume 3, Panache 3 • Virtù: Le Monete Adattabile. Attivando questa Virtù, l’Eroe può eseguire la sua prima Azione anticipando chiunque altro nel corso di un Round. • Hubris: L’Eroe Avventata. L’Eroe riceve un Punto Eroe quando la sua eccessiva sicurezza nell’agire mette nei guai lui e un altro.",
        "ability": "«“La disparità tra ricchi e poveri a Montaigne è un problema serio. Tuttavia non credo che dobbiamo lasciarci abbattere neppure dalle peggiori difficoltà, perciò cerchiamo di divertirci mentre proviamo a colmare questo divario.”»\n\nVantaggi: Aggressione Sconsiderata, Approccio Dinamico, Cameratismo, Lavorare sui Tetti, Mano Lesta, Scafata\n\nPeculiarità: Fuorilegge. Ottiene un Punto Eroe ogni volta che viola la legge per uno scopo nobile. Orfana. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo.",
        "notes": "«“La disparità tra ricchi e poveri a Montaigne è un problema serio. Tuttavia non credo che dobbiamo lasciarci abbattere neppure dalle peggiori difficoltà, perciò cerchiamo di divertirci mentre proviamo a colmare questo divario.”»\nArchetipo: Eroi Ingannatori\n\n📖 Storia:\nCome molte pessime idee, questa nacque davanti a un tavolo macchiato di vino nel famigerato bar Auge À Cochon. Era quasi l'alba e due persone sedevano a discutere in tono strascicato: “Dici un sacco di cazzate, Quinn! Imbucarti al banchetto del Duca! Scommetto che non riuscirai mai a sentirne neppure l'odore prima di incontrare Theus!” Quinn non era mai stata capace di rifiutare una sfida e così, su istigazione del suo amico Antoine, cominciò la sua carriera come la più celebre imbucata di Montaigne. Antoine aveva buoni motivi per essere scettico: il duca non era certo uso a invitare chi, come Quinn Leroy, era povera e cresciuta per le strade. La giovane era stata abbandonata in fasce sull'uscio dell'orfano - trofio V aticino e ne era fuggita appena possibile. Stufa di lezioni, coprifuoco e vergate, aveva imparato a sopravvivere con poco, a trovare riparo quando non poteva pagare l'affitto e ad andare a cercare avanzi quando lo stomaco le brontolava. Lavoretti ai moli le procuravano abbastanza denaro per tirare avanti. La vita poteva essere dura, ma era libera di seguire il proprio cuore. La prima truffa di Quinn iniziò con un abito da serva rubato e un pollo, e si concluse con il suo ingresso al Auge À Cochon indossando un vestito di seta della Duchessa accompagnato da un trucco perfetto e gioielli costosissimi. Questa scena viene ancora raccontata dagli habitué che ne furono testi- moni. Infiltrarsi a casa del Duca era stato facile e la sensazione di poter essere scoperta in qualsiasi momento aveva reso l'esperienza ancor più esaltante. Quinn decise, perciò, di riprovarci, alzando la posta ogni volta. Man mano che i bottini si accumulavano nella sua stanza ammuffita al porto, Quinn si accorse che doveva fare qualcosa di tutti questi beni rubati. Non che le rimordesse la coscienza per avere rubato a degli aristocratici che avevano centinaia di oggetti per ognuno di quelli che lei aveva sottratto, ma le dispia- ceva tenere tutto per sé. Questo la faceva sentire simile a uno di quegli avidi nobili. Cominciò a rivendere gli oggetti, pochi alla volta, e a lasciare borse di Guilder sull'uscio dei poveri e degli sfortunati, a partire dalla serva e dal padrone del pollo della sua prima truffa. Entrambi furono generosamente ricompensati delle loro perdite. È poi passata agli orfanotrofi, ai conta- dini bisognosi e a quei cittadini che faticavano per magri salari.\n\n🎯 Obiettivi:\nFare uno scherzo a Sir Leo Aurele Gilbert. A volte Quinn non attende l'occasione di una festa per presentarsi a casa di un nobiluomo che abbia bisogno di una lezione. Sir Leo Aurele Gilbert, detto “Flagello dei Servi” , è uno di questi: la popolazione delle sue provincie è tartassata da tasse micidiali e dalle crudeli punizioni verso gli insolventi. È tempo che questo pomposo buffone riceva una lezione. Imbucarsi a una festa dell’Empereur. Sin dalla sua prima truffa, Quinn è stata in grado di ingannare alcuni dei nobiluomini più rispettati del Paese. Riuscire a imbucarsi a una festa organizzata dall' Empereur sarebbe il suo capolavoro. Rubare i Gioielli della Corona di Avalon a Sir Gerald Maximilien. Il nome di Quinn Leroy può essere ben noto nell'alta società, ma i dettagli del suo passato per le strade non lo sono. T uttavia qualcuno lo ha scoperto e ora minaccia di far del male al suo vecchio amico Antoine, se Quinn non riuscirà a rubare i Gioielli della Corona di Avalon, custoditi da Sir Gerald Maximilien.\n\n🎭 Consigli di Interpretazione (Giocare Quinn Leroy):\nQuinn è sempre alla ricerca del brivido, ama l'emo - zione che le danno le sue avventure, si potrebbe quasi dire che ne è dipendente. Non rifiuta mai una sfida e, persino quando sospetta una trappola, è proba - bile che si getti nelle fauci del pericolo. Nonostante sia una combinaguai e una ladra, il suo cuore è al posto giusto e non ruberebbe mai un oggetto con un valore sentimentale.",
        "pcData": {
            "name": "Quinn Leroy",
            "nation": "Montaigne",
            "concept": "Eroi Ingannatori • Montaigne",
            "traits": {
                "Vigore": 2,
                "Grazia": 3,
                "Risolutezza": 2,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 0,
                "Convincere": 3,
                "Empatia": 2,
                "Esibirsi": 0,
                "Furto": 3,
                "Intimidire": 1,
                "Istruzione": 0,
                "Mira": 1,
                "Mischia": 0,
                "Nascondersi": 2,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 2
            },
            "advantages": [
                "Aggressione Sconsiderata",
                "Approccio Dinamico",
                "Cameratismo",
                "Lavorare sui Tetti",
                "Mano Lesta",
                "Scafata"
            ],
            "virtue": "Virtù: Le Monete Adattabile. Attivando questa Virtù, l’Eroe può eseguire la sua prima Azione anticipando chiunque altro nel corso di un Round.",
            "hubris": "Hubris: L’Eroe Avventata. L’Eroe riceve un Punto Eroe quando la sua eccessiva sicurezza nell’agire mette nei guai lui e un altro.",
            "peculiarities": "Fuorilegge. Ottiene un Punto Eroe ogni volta che viola la legge per uno scopo nobile. Orfana. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo.",
            "story": "Come molte pessime idee, questa nacque davanti a un tavolo macchiato di vino nel famigerato bar Auge À Cochon. Era quasi l'alba e due persone sedevano a discutere in tono strascicato: “Dici un sacco di cazzate, Quinn! Imbucarti al banchetto del Duca! Scommetto che non riuscirai mai a sentirne neppure l'odore prima di incontrare Theus!” Quinn non era mai stata capace di rifiutare una sfida e così, su istigazione del suo amico Antoine, cominciò la sua carriera come la più celebre imbucata di Montaigne. Antoine aveva buoni motivi per essere scettico: il duca non era certo uso a invitare chi, come Quinn Leroy, era povera e cresciuta per le strade. La giovane era stata abbandonata in fasce sull'uscio dell'orfano - trofio V aticino e ne era fuggita appena possibile. Stufa di lezioni, coprifuoco e vergate, aveva imparato a sopravvivere con poco, a trovare riparo quando non poteva pagare l'affitto e ad andare a cercare avanzi quando lo stomaco le brontolava. Lavoretti ai moli le procuravano abbastanza denaro per tirare avanti. La vita poteva essere dura, ma era libera di seguire il proprio cuore. La prima truffa di Quinn iniziò con un abito da serva rubato e un pollo, e si concluse con il suo ingresso al Auge À Cochon indossando un vestito di seta della Duchessa accompagnato da un trucco perfetto e gioielli costosissimi. Questa scena viene ancora raccontata dagli habitué che ne furono testi- moni. Infiltrarsi a casa del Duca era stato facile e la sensazione di poter essere scoperta in qualsiasi momento aveva reso l'esperienza ancor più esaltante. Quinn decise, perciò, di riprovarci, alzando la posta ogni volta. Man mano che i bottini si accumulavano nella sua stanza ammuffita al porto, Quinn si accorse che doveva fare qualcosa di tutti questi beni rubati. Non che le rimordesse la coscienza per avere rubato a degli aristocratici che avevano centinaia di oggetti per ognuno di quelli che lei aveva sottratto, ma le dispia- ceva tenere tutto per sé. Questo la faceva sentire simile a uno di quegli avidi nobili. Cominciò a rivendere gli oggetti, pochi alla volta, e a lasciare borse di Guilder sull'uscio dei poveri e degli sfortunati, a partire dalla serva e dal padrone del pollo della sua prima truffa. Entrambi furono generosamente ricompensati delle loro perdite. È poi passata agli orfanotrofi, ai conta- dini bisognosi e a quei cittadini che faticavano per magri salari.",
            "objectives": "Fare uno scherzo a Sir Leo Aurele Gilbert. A volte Quinn non attende l'occasione di una festa per presentarsi a casa di un nobiluomo che abbia bisogno di una lezione. Sir Leo Aurele Gilbert, detto “Flagello dei Servi” , è uno di questi: la popolazione delle sue provincie è tartassata da tasse micidiali e dalle crudeli punizioni verso gli insolventi. È tempo che questo pomposo buffone riceva una lezione. Imbucarsi a una festa dell’Empereur. Sin dalla sua prima truffa, Quinn è stata in grado di ingannare alcuni dei nobiluomini più rispettati del Paese. Riuscire a imbucarsi a una festa organizzata dall' Empereur sarebbe il suo capolavoro. Rubare i Gioielli della Corona di Avalon a Sir Gerald Maximilien. Il nome di Quinn Leroy può essere ben noto nell'alta società, ma i dettagli del suo passato per le strade non lo sono. T uttavia qualcuno lo ha scoperto e ora minaccia di far del male al suo vecchio amico Antoine, se Quinn non riuscirà a rubare i Gioielli della Corona di Avalon, custoditi da Sir Gerald Maximilien.",
            "quote": "“La disparità tra ricchi e poveri a Montaigne è un problema serio. Tuttavia non credo che dobbiamo lasciarci abbattere neppure dalle peggiori difficoltà, perciò cerchiamo di divertirci mentre proviamo a colmare questo divario.”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 3, Acume 3, Panache 3 • Virtù: La Strega Intuitivo. Attivando questa Virtù, l’Eroe può porre al GM una domanda con risposta sì/no riguardante un PNG. Il GM dovrà rispondere onestamente e, se possibile, aggiungere dettagli. • Hubris: Il Glifo Superstizioso. L’Eroe riceve un Punto Eroe quando si rifiuta di risolvere un problema con l’aiuto della Stregoneria, di un artefatto o di un altro effetto mistico di cui non si fida.",
        "ability": "«“So che è allettante, ma non potete rispondere sì a quella cosa. Non lo dico solo per esperienza personale. Ho parlato con dozzine di persone che hanno sofferto quanto me e non ho mai incontrato nessuno che non se ne sia pentito. Lasciate che vi offra una birra e vi racconti… ma prima troviamo un locale più distante dall’università. Credo che ci sia la mia faccia su quel manifesto da ricercato.”»\n\nVantaggi: Cattedra, Fautore di Miracoli, Gioco di Squadra, Orologio Biologico, Un Semplice Malinteso, Volontà Indomabile\n\nPeculiarità: Dottore. Ottiene un Punto Eroe ogni volta che si occupa delle ferite di un Malvagio o delle sue vittime innocenti. Professore. Ottiene un Punto Eroe ogni volta che usa la conoscenza di un trattato oscuro per risolvere un problema complesso.",
        "notes": "«“So che è allettante, ma non potete rispondere sì a quella cosa. Non lo dico solo per esperienza personale. Ho parlato con dozzine di persone che hanno sofferto quanto me e non ho mai incontrato nessuno che non se ne sia pentito. Lasciate che vi offra una birra e vi racconti… ma prima troviamo un locale più distante dall’università. Credo che ci sia la mia faccia su quel manifesto da ricercato.”»\nArchetipo: Eroi Ingannatori\n\n📖 Storia:\nLa battaglia infuriò per tutta la notte e il Dr. Samo Sokolof era sempre pochi passi avanti al mostro, mentre la sua anima si agitava tra istinti violenti e dubbi schiaccianti. La donna che il dievas aveva resuscitato era un tempo sua moglie ma ora il suo cadavere senz'anima puntava a divorarlo. Già una volta l'aveva vista morire a causa di una malattia che non poteva curare, ora l'aveva dovuta addirittura uccidere. Sconfortato, Samo chiuse il suo ambulatorio, smise di mangiare e dormire. I suoi amici riuscirono a convin- cerlo che c'era ancora qualcosa per cui valeva la pena vivere, ma il ricordo di quella notte lo tormentò sempre. Samo finì per incontrare un gruppo di ex-losejai, che si ritrovavano nella cantina di un locale a Szablewo. T utti loro avevano avuto esperienze diverse con i dievai e mostravano umori e comportamenti differenti. Alcuni tratti, però, sembravano comuni, specie la tristezza. Forse – Samo iniziò a riflettere – chi è vittima di un trauma cade in uno stato simile alla malattia, ma che colpisce l'anima. Aveva sentito parlare della melanconia, ma vi era così tanto di più… Quando Samo presentò le sue ipotesi al convegno di medicina della sua università, venne pubblicamente deriso. L' idea che esistessero mali dell'anima e non del corpo sembrava a tutti assurda e priva di basi scien- tifiche, quasi una vergogna per un medico. T uttavia, quando Samo cominciò a ricevere minacce dalla Ratas e a notare figure che lo seguivano nell'ombra, iniziò a domandarsi se i losejai sapessero qualcosa che la medi- cina ufficiale ignorava. Oggi Samo viaggia per Théah, tenendo conferenze segrete a studenti interessati. La comunità medica lo ha radiato, vietando a medici e studenti di ascol - tarlo, eppure molti si stanno rendendo conto che potrebbe avere ragione. Ovunque vada tende la mano a losejai vittime dei loro dievai o della Ratas, perché queste anime perdute e sole non hanno nessun altro a cui rivolgersi. Samo parla con loro, spiegando quali tecniche possano usare per aiutarli a riprendersi e a reinserirsi nella società. La comunità medica di Théah può credere che il Dr. Sokolof sia solo un ingenuo venditore di fumo, ma un giorno vedrà in lui il fondatore della psico - logia moderna.\n\n🎯 Obiettivi:\nDare la caccia al Wight Urlante che infesta le strade. Samo non è sicuro del perché solo chi soffre di sindromi simili alla sua possa vedere il Wight Urlante. È possi- bile che abbiano qualche qualità che li rende sensibili ai mostri? Sta cercando di trovare un punto di equilibrio tra ricercare un effetto indesiderato affascinante e salvare ulteriori innocenti dagli artigli di questa creatura. Far approvare al Sejm un’amnistia per i losejai pentiti. In molte parti di Sarmatia, specie nella V aticina Rzeczpospolita, è illegale fare patti con i dievai. Poiché le guardie cittadine sono rare, spesso i sospetti losejai vengono linciati da folle inferocite. Una protezione legale per i losejai pentiti non fermerebbe le folle, ma sarebbe un primo passo importante. Identificare il cacciatore di streghe che sta sterminando i losejai. Chiunque stia facendo strage di losejai non è certo un Inquisitore. L'Inquisizione pubblicizza le sue uccisioni, mentre questo misterioso cacciatore di streghe colpisce in silenzio e fa sparire i corpi. Non è neppure un Purificatore, dato che alcuni membri di questo gruppo sono tra le vittime (a meno che non si tratti di una faida interna). Purtroppo Samo è un uomo solo e questo cacciatore, o gruppo di cacciatori, potrebbe nascondersi ovunque.\n\n🎭 Consigli di Interpretazione (Giocare Samo Sokolof):\nSamo è sopravvissuto a un cuore spezzato, al tradimento e al trauma di avere perso sua moglie. Vive in uno stato di melanconia che ha solo iniziato a comprendere. È un ottimo ascoltatore ed è sempre disponibile a prestare orecchio alle vicende altrui, specie se nessun altro vi crede. Ha un eccellente senso dell' umorismo – una neces- sità per sopravvivere quando si è proponenti di teorie mediche impopolari – e lo usa spesso nelle sue conferenze. Nonostante il disprezzo di cui è oggetto, non si è mai opposto alla medicina ufficiale né ha accusato la comunità universitaria di cospirare contro di lui. È fiducioso verso il sistema che lo ha formato, anche se le sue battute sulla loro inflessibilità potrebbero far pensare diversamente.",
        "pcData": {
            "name": "Samo Sokolof",
            "nation": "Confederazione Sarmatiana",
            "concept": "Eroi Ingannatori • Confederazione Sarmatiana",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 0,
                "Atletica": 0,
                "Cavalcare": 2,
                "Convincere": 3,
                "Empatia": 3,
                "Esibirsi": 2,
                "Furto": 0,
                "Intimidire": 0,
                "Istruzione": 3,
                "Mira": 0,
                "Mischia": 0,
                "Nascondersi": 2,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 2
            },
            "advantages": [
                "Cattedra",
                "Fautore di Miracoli",
                "Gioco di Squadra",
                "Orologio Biologico",
                "Un Semplice Malinteso",
                "Volontà Indomabile"
            ],
            "virtue": "Virtù: La Strega Intuitivo. Attivando questa Virtù, l’Eroe può porre al GM una domanda con risposta sì/no riguardante un PNG. Il GM dovrà rispondere onestamente e, se possibile, aggiungere dettagli.",
            "hubris": "Hubris: Il Glifo Superstizioso. L’Eroe riceve un Punto Eroe quando si rifiuta di risolvere un problema con l’aiuto della Stregoneria, di un artefatto o di un altro effetto mistico di cui non si fida.",
            "peculiarities": "Dottore. Ottiene un Punto Eroe ogni volta che si occupa delle ferite di un Malvagio o delle sue vittime innocenti. Professore. Ottiene un Punto Eroe ogni volta che usa la conoscenza di un trattato oscuro per risolvere un problema complesso.",
            "story": "La battaglia infuriò per tutta la notte e il Dr. Samo Sokolof era sempre pochi passi avanti al mostro, mentre la sua anima si agitava tra istinti violenti e dubbi schiaccianti. La donna che il dievas aveva resuscitato era un tempo sua moglie ma ora il suo cadavere senz'anima puntava a divorarlo. Già una volta l'aveva vista morire a causa di una malattia che non poteva curare, ora l'aveva dovuta addirittura uccidere. Sconfortato, Samo chiuse il suo ambulatorio, smise di mangiare e dormire. I suoi amici riuscirono a convin- cerlo che c'era ancora qualcosa per cui valeva la pena vivere, ma il ricordo di quella notte lo tormentò sempre. Samo finì per incontrare un gruppo di ex-losejai, che si ritrovavano nella cantina di un locale a Szablewo. T utti loro avevano avuto esperienze diverse con i dievai e mostravano umori e comportamenti differenti. Alcuni tratti, però, sembravano comuni, specie la tristezza. Forse – Samo iniziò a riflettere – chi è vittima di un trauma cade in uno stato simile alla malattia, ma che colpisce l'anima. Aveva sentito parlare della melanconia, ma vi era così tanto di più… Quando Samo presentò le sue ipotesi al convegno di medicina della sua università, venne pubblicamente deriso. L' idea che esistessero mali dell'anima e non del corpo sembrava a tutti assurda e priva di basi scien- tifiche, quasi una vergogna per un medico. T uttavia, quando Samo cominciò a ricevere minacce dalla Ratas e a notare figure che lo seguivano nell'ombra, iniziò a domandarsi se i losejai sapessero qualcosa che la medi- cina ufficiale ignorava. Oggi Samo viaggia per Théah, tenendo conferenze segrete a studenti interessati. La comunità medica lo ha radiato, vietando a medici e studenti di ascol - tarlo, eppure molti si stanno rendendo conto che potrebbe avere ragione. Ovunque vada tende la mano a losejai vittime dei loro dievai o della Ratas, perché queste anime perdute e sole non hanno nessun altro a cui rivolgersi. Samo parla con loro, spiegando quali tecniche possano usare per aiutarli a riprendersi e a reinserirsi nella società. La comunità medica di Théah può credere che il Dr. Sokolof sia solo un ingenuo venditore di fumo, ma un giorno vedrà in lui il fondatore della psico - logia moderna.",
            "objectives": "Dare la caccia al Wight Urlante che infesta le strade. Samo non è sicuro del perché solo chi soffre di sindromi simili alla sua possa vedere il Wight Urlante. È possi- bile che abbiano qualche qualità che li rende sensibili ai mostri? Sta cercando di trovare un punto di equilibrio tra ricercare un effetto indesiderato affascinante e salvare ulteriori innocenti dagli artigli di questa creatura. Far approvare al Sejm un’amnistia per i losejai pentiti. In molte parti di Sarmatia, specie nella V aticina Rzeczpospolita, è illegale fare patti con i dievai. Poiché le guardie cittadine sono rare, spesso i sospetti losejai vengono linciati da folle inferocite. Una protezione legale per i losejai pentiti non fermerebbe le folle, ma sarebbe un primo passo importante. Identificare il cacciatore di streghe che sta sterminando i losejai. Chiunque stia facendo strage di losejai non è certo un Inquisitore. L'Inquisizione pubblicizza le sue uccisioni, mentre questo misterioso cacciatore di streghe colpisce in silenzio e fa sparire i corpi. Non è neppure un Purificatore, dato che alcuni membri di questo gruppo sono tra le vittime (a meno che non si tratti di una faida interna). Purtroppo Samo è un uomo solo e questo cacciatore, o gruppo di cacciatori, potrebbe nascondersi ovunque.",
            "quote": "“So che è allettante, ma non potete rispondere sì a quella cosa. Non lo dico solo per esperienza personale. Ho parlato con dozzine di persone che hanno sofferto quanto me e non ho mai incontrato nessuno che non se ne sia pentito. Lasciate che vi offra una birra e vi racconti… ma prima troviamo un locale più distante dall’università. Credo che ci sia la mia faccia su quel manifesto da ricercato.”"
        }
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
        "traits": "Vigore 3, Grazia 2, Risolutezza 3, Acume 3, Panache 2 • Virtù: La Torre Umile. Attivando questa Virtù, l’Eroe riceverà 1 Punto Eroe aggiuntivo quando attiverà la sua Hubris o una delle sue Peculiarità. • Hubris: Il Sole Orgogliosa. L’Eroe riceve un Punto Eroe quando rifiuta un’offerta d’aiuto, per esempio se un alleato spende un Punto Eroe per dargli Dadi Bonus e lei rifiuta.",
        "ability": "«“Rubare la spada magica di Ur? Noioso. La coppa di Hymin il Gigante d’altronde… produce BIRRA MAGICA. Si trova nella mani di un tiranno, ma…”»\n\nVantaggi: Cameratismo, Gambe da Marinaio, Gioco di Squadra, Manualità, Mastro Artigiano: Tessitura, Seidr\n\nPeculiarità: Artigiana. Ottiene un Punto Eroe ogni volta che sfrutta le modeste abilità artigiane per risolvere problemi considerati troppo complessi per avere una soluzione semplice. Skald. Ottiene un Punto Eroe ogni volta che sfrutta la propria abilità di Seidr per aiutare un altro Eroe a risolvere un problema o sconfiggere un Malvagio.",
        "notes": "«“Rubare la spada magica di Ur? Noioso. La coppa di Hymin il Gigante d’altronde… produce BIRRA MAGICA. Si trova nella mani di un tiranno, ma…”»\nArchetipo: Eroi Ingannatori\n\n📖 Storia:\nT ove nacque durante la peggiore delle tempeste, quando il mare cercava di affogare la terra. Quella notte, l'oceano si prese suo padre, ma lasciò la bimba tra le braccia della madre, uno scambio duro, ma onesto, per la donna. Forse perché si sentiva in debito con la piccola, il mare è sempre stato gene - roso con T ove. La prima nave su cui si imbarcò andò a depredare un monastero avaloniano e tornò a V estenmennavenjar carica d'oro. La seconda era capitanata da Ketil Ulfsson, da cui ebbe il suo primo figlio. La terza affondò… e T ove fu l'unica a salvarsi. Dopo un decennio come marinaio, T ove fece costruire la propria nave: la Sultry Dog. Il suo equi- paggio divenne famoso, finché una nave Castilliana non li affondò e T ove fu, di nuovo, l'unica a salvarsi. Da allora non si è più spinta in mare, inca - pace di sopportare l'idea di restare di nuovo sola. All'improvviso la benedizione del mare sembrava una maledizione. Da quando ha abbandonato la navigazione, T ove si è dedicata a numerose altre professioni. È una pessima intagliatrice di legno, ma un'ottima tessitrice. È stata per brevissimo tempo una skald e ricorda ancora qualche rudimento di Seidr. Alla fine, si è ritirata in un piccolo villaggio costiero dove vive andando a pesca e il mare le riempie le reti ogni giorno, come se ancora desiderasse questa sua amante perduta. Ogni notte, T ove tesse con fatica la sua magia runica in fazzoletti e reti, che scambia con altri eroi chiedendo servigi e informazioni, mai denaro. Vitale come il mare, T ove ha avuto sette figli da diversi padri, ma non è una buona madre e lascia che siano la nonna e i vicini a crescerli. Ciò non vuol dire che non li ami e ha insegnato loro il Ciclo del Padre T etro – l'unico residuo, oltre al Seidr, del suo passato da skald – e come maneggiare un'arma. È convinta che una lama affilata e un bel racconto possano aprire tutte le porte, perciò ha trasmesso tutta la sua cono- scenza ai figli. Ancora desiderosa di viaggiare, T ove segue spesso altri eroi, aiutandoli con consigli e magia e, dopo il trionfo, suggerendo subito un altro viaggio in memoria dei bei tempi. Ha una sete inestinguibile di avventure ma, soprattutto, ha un profondo senso di giustizia. T ove trova sempre un nuovo tiranno da abbattere e un altro sfortunato da salvare.\n\n🎯 Obiettivi:\nSalvare suo figlio, pirata d’acqua dolce, da Einar Ibsen. Ibsen non sa che il suo prigioniero, Ulf, è figlio di T ove. Per questo motivo lei deve agire con cautela per evitare di essere ricattata. Ha fatto arrivare voce ai rivali di Ibsen che pagherà per avere informazioni su dove è rinchiuso il ragazzo. Addestrare uno studente alla magia delle rune. Preoccupata che il Seidr andrà a morire man mano e che V estenmennavenjar diventi sempre più civiliz- zata sotto l'influsso dei carl, T ove è alla ricerca di un discepolo a cui trasmettere la sua conoscenza. Vuole qualcuno di testardo, selvaggio e con un profondo amore per il suo Paese. Catturare l’antico pesce Nix che sfugge alle sue reti. I nix non smettono mai di crescere e T ove ne aveva preso uno grande quanto tre uomini, ma è riuscito a liberarsi dalle sue reti incantate. T ove non ha idea se quel pesce fosse un emissario degli dei o se la sua magia fosse troppo debole, ma intende scoprirlo.\n\n🎭 Consigli di Interpretazione (Giocare Tove Byströrm):\nQualsiasi sia il piano, T ove dice sempre di essere troppo vecchia, che la sua magia non è più quella di una volta, che la schiena le duole e che preferirebbe restare a casa a bersi un tè. Non appena l'avventura la chiama, però, i suoi occhi luccicano e gridando “Pronta!” afferra la borsa. Certo la sua magia si è inde- bolita, ma non il suo gusto per l'avventura. T ove ama incontrare persone nuove e ascoltare i loro racconti. Narra anche lei i suoi, ma solo la metà sono veri. Nonostante i modi estroversi, l'essere sopravvis- suta a due naufragi le ha insegnato a non affezionarsi alle persone. È sempre pronta a dare una mano e a farsi gli affari altrui, ma non accetta che le si ricambi il favore: T ove non ha bisogno di aiuto e i suoi affari sono strettamente privati!",
        "pcData": {
            "name": "Tove Byströrm",
            "nation": "Vestenmennavenjar",
            "concept": "Eroi Ingannatori • Vestenmennavenjar",
            "traits": {
                "Vigore": 3,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 2
            },
            "skills": {
                "Allettare": 1,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 0,
                "Convincere": 1,
                "Empatia": 1,
                "Esibirsi": 3,
                "Furto": 0,
                "Intimidire": 2,
                "Istruzione": 1,
                "Mira": 0,
                "Mischia": 3,
                "Nascondersi": 0,
                "Navigazione": 2,
                "Notare": 2,
                "Rissa": 2
            },
            "advantages": [
                "Cameratismo",
                "Gambe da Marinaio",
                "Gioco di Squadra",
                "Manualità",
                "Mastro Artigiano: Tessitura",
                "Seidr"
            ],
            "virtue": "Virtù: La Torre Umile. Attivando questa Virtù, l’Eroe riceverà 1 Punto Eroe aggiuntivo quando attiverà la sua Hubris o una delle sue Peculiarità.",
            "hubris": "Hubris: Il Sole Orgogliosa. L’Eroe riceve un Punto Eroe quando rifiuta un’offerta d’aiuto, per esempio se un alleato spende un Punto Eroe per dargli Dadi Bonus e lei rifiuta.",
            "peculiarities": "Artigiana. Ottiene un Punto Eroe ogni volta che sfrutta le modeste abilità artigiane per risolvere problemi considerati troppo complessi per avere una soluzione semplice. Skald. Ottiene un Punto Eroe ogni volta che sfrutta la propria abilità di Seidr per aiutare un altro Eroe a risolvere un problema o sconfiggere un Malvagio.",
            "story": "T ove nacque durante la peggiore delle tempeste, quando il mare cercava di affogare la terra. Quella notte, l'oceano si prese suo padre, ma lasciò la bimba tra le braccia della madre, uno scambio duro, ma onesto, per la donna. Forse perché si sentiva in debito con la piccola, il mare è sempre stato gene - roso con T ove. La prima nave su cui si imbarcò andò a depredare un monastero avaloniano e tornò a V estenmennavenjar carica d'oro. La seconda era capitanata da Ketil Ulfsson, da cui ebbe il suo primo figlio. La terza affondò… e T ove fu l'unica a salvarsi. Dopo un decennio come marinaio, T ove fece costruire la propria nave: la Sultry Dog. Il suo equi- paggio divenne famoso, finché una nave Castilliana non li affondò e T ove fu, di nuovo, l'unica a salvarsi. Da allora non si è più spinta in mare, inca - pace di sopportare l'idea di restare di nuovo sola. All'improvviso la benedizione del mare sembrava una maledizione. Da quando ha abbandonato la navigazione, T ove si è dedicata a numerose altre professioni. È una pessima intagliatrice di legno, ma un'ottima tessitrice. È stata per brevissimo tempo una skald e ricorda ancora qualche rudimento di Seidr. Alla fine, si è ritirata in un piccolo villaggio costiero dove vive andando a pesca e il mare le riempie le reti ogni giorno, come se ancora desiderasse questa sua amante perduta. Ogni notte, T ove tesse con fatica la sua magia runica in fazzoletti e reti, che scambia con altri eroi chiedendo servigi e informazioni, mai denaro. Vitale come il mare, T ove ha avuto sette figli da diversi padri, ma non è una buona madre e lascia che siano la nonna e i vicini a crescerli. Ciò non vuol dire che non li ami e ha insegnato loro il Ciclo del Padre T etro – l'unico residuo, oltre al Seidr, del suo passato da skald – e come maneggiare un'arma. È convinta che una lama affilata e un bel racconto possano aprire tutte le porte, perciò ha trasmesso tutta la sua cono- scenza ai figli. Ancora desiderosa di viaggiare, T ove segue spesso altri eroi, aiutandoli con consigli e magia e, dopo il trionfo, suggerendo subito un altro viaggio in memoria dei bei tempi. Ha una sete inestinguibile di avventure ma, soprattutto, ha un profondo senso di giustizia. T ove trova sempre un nuovo tiranno da abbattere e un altro sfortunato da salvare.",
            "objectives": "Salvare suo figlio, pirata d’acqua dolce, da Einar Ibsen. Ibsen non sa che il suo prigioniero, Ulf, è figlio di T ove. Per questo motivo lei deve agire con cautela per evitare di essere ricattata. Ha fatto arrivare voce ai rivali di Ibsen che pagherà per avere informazioni su dove è rinchiuso il ragazzo. Addestrare uno studente alla magia delle rune. Preoccupata che il Seidr andrà a morire man mano e che V estenmennavenjar diventi sempre più civiliz- zata sotto l'influsso dei carl, T ove è alla ricerca di un discepolo a cui trasmettere la sua conoscenza. Vuole qualcuno di testardo, selvaggio e con un profondo amore per il suo Paese. Catturare l’antico pesce Nix che sfugge alle sue reti. I nix non smettono mai di crescere e T ove ne aveva preso uno grande quanto tre uomini, ma è riuscito a liberarsi dalle sue reti incantate. T ove non ha idea se quel pesce fosse un emissario degli dei o se la sua magia fosse troppo debole, ma intende scoprirlo.",
            "quote": "“Rubare la spada magica di Ur? Noioso. La coppa di Hymin il Gigante d’altronde… produce BIRRA MAGICA. Si trova nella mani di un tiranno, ma…”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 3, Acume 4, Panache 2 • Virtù: La Torre Umile. Attivando questa Virtù, l’Eroe riceverà 1 Punto Eroe aggiuntivo quando attiverà la sua Hubris o una delle sue Peculiarità. • Hubris: Il Glifo Superstizioso. L’Eroe riceve un Punto Eroe quando si rifiuta di risolvere un problema con l’aiuto della Stregoneria, di un artefatto o di un altro effetto mistico di cui non si fida. Stregoneria Vasilii ha i Doni Comando (Corvo), Ricucire, Vista (Corvo) e Vista (Orso). Le sue Restrizioni sono Gentilezza e Moderazione.",
        "ability": "«“Hai fame? Ho del pane da condividere e del fuoco. No, non ho bisogno di nulla in cambio. Forse, dopo che avrai mangiato, potremmo provare a trovare i tuoi genitori.”»\n\nVantaggi: Aggressione Sconsiderata, Esperta di Sopravvivenza, Lavorare sui Tetti, Mano Lesta, Riflessi Rapidi: Nascondersi, Stregoneria: Tocco della Madre 2\n\nPeculiarità: Orfana. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo. Toccata da Matushka. Ottiene un Punto Eroe ogni volta che dà una lezione a qualcuno in un modo che renderebbe Matushka orgogliosa.",
        "notes": "«“Hai fame? Ho del pane da condividere e del fuoco. No, non ho bisogno di nulla in cambio. Forse, dopo che avrai mangiato, potremmo provare a trovare i tuoi genitori.”»\nArchetipo: Eroi Ingannatori\n\n📖 Storia:\nSecondo le leggende, Matushka si prende cura degli orfani, ma questo non avvenne per V asilii e i suoi due fratelli minori. Persino quando riuscì a scovare la famosa capanna della vecchia, questa non era neppure in casa. V asilii, però, gliela fece vedere: se Matushka non voleva dare loro alcun aiuto allora se lo sarebbero preso. Quella notte rubò un ago magico e un occhio di vetro. L' ago aveva il potere di riparare qualsiasi oggetto riuscisse a penetrare, da un abito alla rilegatura di un libro, mentre l'occhio permetteva di vedere attraverso gli occhi di qual- siasi corvo. Con questi due oggetti rubati a Matushka i fratelli ebbero da mangiare e viaggiarono al sicuro. La cosa più importante che V asilii prese quella notte, però, fu se stessa. Per tutta la vita, V asilii aveva dovuto lottare contro le persone che le dicevano che era un ragazzo. Quando si guardò nello specchio d' argento di Matushka vide il suo vero io e da allora, anche tutti gli altri lo videro. Quando lasciò la capanna, V asilii aveva un nuovo corpo e un senso di gratitudine che non dimenticherà mai. Ora la sua anima è visibile a tutti e V asilii è una donna forte e orgogliosa. Matushka rimase impressionata dallo spirito della giovane, ma anche furiosa per il furto. Permise a V asilii di tenere quanto aveva rubato, ma la maledisse, proibendole di prendere ciò che non le veniva libera- mente offerto. Oggi V asilii aiuta chiunque ne abbia bisogno. Si lamenta di continuo mentre lo fa, ma la verità è che ama aiutare il prossimo. Farebbe di tutto per far giun- gere qualcuno a casa sano e salvo e gli metterebbe in mano tutto il suo denaro per fargli superare l' inverno. Si prende cura soprattutto dei bambini e prende sotto la sua ala tutti gli orfani che incontra. Finora ne ha riunito un bel gruppo. Insegna ai più grandi a cacciare, cucinare e badare ai piccini. Quando raggiungono una città, il gruppo si disperde per dare spettacoli in strada, rubare o commerciare, e ripartono non appena V asilii è pronta. V asilii vorrebbe imparare lo stile Mireli, ma non ha ancora trovato un maestro. T uttavia è in grado di imitarlo perché ha assistito a numerosi duelli. Non è, ovviamente, in grado di ingannare un vero duellante, ma spaventa i meno informati. Nonostante sia davvero abile con la spada, V asilii usa questa tattica per evitare gli scontri.\n\n🎯 Obiettivi:\nLevarsi la maledizione di Matushka che le impedisce di rubare. Sin dalla sua avventura nella capanna di Matushka, V asilii non può più prendere nulla che non le venga liberamente offerto. Questo intralcia i suoi sforzi per aiutare la sua famiglia acquisita e ridividere la ricchezza. Non sarebbe meglio se tutto quell'oro fosse diviso tra il popolo invece di essere nella mani di un solo mercante? Se solo potesse convincere Matushka… Ritornare alla capanna di Matushka per rubare il magico cuore di corvo. Oltre a ridistribuire la ricchezza e aiutare i poveri, V asilii ha in animo di impadronirsi del cuore di corvo che aveva visto nella capanna quella notte. Non lo sa, ma il cuore le permetterebbe di trasformarsi in un corvo e volare. Per ora lo desidera solo perché tutto ciò che ha preso dalla capanna si è rivelato utilissimo. Investigare sulle voci secondo cui la sua famiglia discende da Matushka. V asilii ha derubato Nonna Inverno, eppure è ancora viva e in buona salute, maledizione a parte. La ragione potrebbe trovarsi in una storia popolare che un vecchio le ha raccontato: questi conosceva i suoi geni- tori e sosteneva che la madre di V asilii era la nipote di Matushka in persona. V asilii cerca prove a favore o contro questa ipotesi.\n\n🎭 Consigli di Interpretazione (Giocare Vasilii):\nV asilii ha lavorato duramente per ottenere tutto ciò che ha e non vede motivo di vergognarsene. Ha paura di Matushka ed è convinta che essere stata maledetta una volta sia più che sufficiente, perciò segue le regole di Nonna Inverno alla lettera, pur lamentandosi di continuo. V asilii mastica sempre qualcosa, con una preferenza per formaggio duro e pane fresco, ma ha un appetito gagliardo e assaggia di tutto. È burbera nei rapporti con gli altri, anche quando li aiuta, ma ha un debole per gli orfani. In fondo ha un cuore d'oro, ma anche molta rabbia repressa che si porta dietro sin da piccola. Quando affronta dei genitori che hanno abbandonato i loro figli rischia sempre di lasciare che la sua ira abbia la meglio.",
        "pcData": {
            "name": "Vasilii",
            "nation": "Ussura",
            "concept": "Eroi Ingannatori • Ussura",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 4,
                "Panache": 2
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 3,
                "Cavalcare": 0,
                "Convincere": 2,
                "Empatia": 2,
                "Esibirsi": 1,
                "Furto": 3,
                "Intimidire": 2,
                "Istruzione": 0,
                "Mira": 0,
                "Mischia": 0,
                "Nascondersi": 3,
                "Navigazione": 0,
                "Notare": 0,
                "Rissa": 2
            },
            "advantages": [
                "Aggressione Sconsiderata",
                "Esperta di Sopravvivenza",
                "Lavorare sui Tetti",
                "Mano Lesta",
                "Riflessi Rapidi: Nascondersi",
                "Stregoneria: Tocco della Madre 2"
            ],
            "virtue": "Virtù: La Torre Umile. Attivando questa Virtù, l’Eroe riceverà 1 Punto Eroe aggiuntivo quando attiverà la sua Hubris o una delle sue Peculiarità.",
            "hubris": "Hubris: Il Glifo Superstizioso. L’Eroe riceve un Punto Eroe quando si rifiuta di risolvere un problema con l’aiuto della Stregoneria, di un artefatto o di un altro effetto mistico di cui non si fida. Stregoneria Vasilii ha i Doni Comando (Corvo), Ricucire, Vista (Corvo) e Vista (Orso). Le sue Restrizioni sono Gentilezza e Moderazione.",
            "peculiarities": "Orfana. Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo. Toccata da Matushka. Ottiene un Punto Eroe ogni volta che dà una lezione a qualcuno in un modo che renderebbe Matushka orgogliosa.",
            "story": "Secondo le leggende, Matushka si prende cura degli orfani, ma questo non avvenne per V asilii e i suoi due fratelli minori. Persino quando riuscì a scovare la famosa capanna della vecchia, questa non era neppure in casa. V asilii, però, gliela fece vedere: se Matushka non voleva dare loro alcun aiuto allora se lo sarebbero preso. Quella notte rubò un ago magico e un occhio di vetro. L' ago aveva il potere di riparare qualsiasi oggetto riuscisse a penetrare, da un abito alla rilegatura di un libro, mentre l'occhio permetteva di vedere attraverso gli occhi di qual- siasi corvo. Con questi due oggetti rubati a Matushka i fratelli ebbero da mangiare e viaggiarono al sicuro. La cosa più importante che V asilii prese quella notte, però, fu se stessa. Per tutta la vita, V asilii aveva dovuto lottare contro le persone che le dicevano che era un ragazzo. Quando si guardò nello specchio d' argento di Matushka vide il suo vero io e da allora, anche tutti gli altri lo videro. Quando lasciò la capanna, V asilii aveva un nuovo corpo e un senso di gratitudine che non dimenticherà mai. Ora la sua anima è visibile a tutti e V asilii è una donna forte e orgogliosa. Matushka rimase impressionata dallo spirito della giovane, ma anche furiosa per il furto. Permise a V asilii di tenere quanto aveva rubato, ma la maledisse, proibendole di prendere ciò che non le veniva libera- mente offerto. Oggi V asilii aiuta chiunque ne abbia bisogno. Si lamenta di continuo mentre lo fa, ma la verità è che ama aiutare il prossimo. Farebbe di tutto per far giun- gere qualcuno a casa sano e salvo e gli metterebbe in mano tutto il suo denaro per fargli superare l' inverno. Si prende cura soprattutto dei bambini e prende sotto la sua ala tutti gli orfani che incontra. Finora ne ha riunito un bel gruppo. Insegna ai più grandi a cacciare, cucinare e badare ai piccini. Quando raggiungono una città, il gruppo si disperde per dare spettacoli in strada, rubare o commerciare, e ripartono non appena V asilii è pronta. V asilii vorrebbe imparare lo stile Mireli, ma non ha ancora trovato un maestro. T uttavia è in grado di imitarlo perché ha assistito a numerosi duelli. Non è, ovviamente, in grado di ingannare un vero duellante, ma spaventa i meno informati. Nonostante sia davvero abile con la spada, V asilii usa questa tattica per evitare gli scontri.",
            "objectives": "Levarsi la maledizione di Matushka che le impedisce di rubare. Sin dalla sua avventura nella capanna di Matushka, V asilii non può più prendere nulla che non le venga liberamente offerto. Questo intralcia i suoi sforzi per aiutare la sua famiglia acquisita e ridividere la ricchezza. Non sarebbe meglio se tutto quell'oro fosse diviso tra il popolo invece di essere nella mani di un solo mercante? Se solo potesse convincere Matushka… Ritornare alla capanna di Matushka per rubare il magico cuore di corvo. Oltre a ridistribuire la ricchezza e aiutare i poveri, V asilii ha in animo di impadronirsi del cuore di corvo che aveva visto nella capanna quella notte. Non lo sa, ma il cuore le permetterebbe di trasformarsi in un corvo e volare. Per ora lo desidera solo perché tutto ciò che ha preso dalla capanna si è rivelato utilissimo. Investigare sulle voci secondo cui la sua famiglia discende da Matushka. V asilii ha derubato Nonna Inverno, eppure è ancora viva e in buona salute, maledizione a parte. La ragione potrebbe trovarsi in una storia popolare che un vecchio le ha raccontato: questi conosceva i suoi geni- tori e sosteneva che la madre di V asilii era la nipote di Matushka in persona. V asilii cerca prove a favore o contro questa ipotesi.",
            "quote": "“Hai fame? Ho del pane da condividere e del fuoco. No, non ho bisogno di nulla in cambio. Forse, dopo che avrai mangiato, potremmo provare a trovare i tuoi genitori.”"
        }
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
        "traits": "Vigore 2, Grazia 2, Risolutezza 3, Acume 3, Panache 3 • Virtù: Il Sole Glorioso. L’Eroe può attivare questa Virtù quando si trova al centro dell’attenzione. Per il prossimo Rischio ogni dado conterà come un Incremento senza bisogno di tirare. • Hubris: I Troni Testardo. L’Eroe riceve un punto Eroe quando si rifiuta caparbiamente di cambiare idea dinanzi ai fatti.",
        "ability": "«“Sono un rivoluzionario in una terra di tradizionalisti, ma ho visto che il cambiamento è possibile e non avrò riposo finché non otterrò giustizia per la mia gente.”»\n\nVantaggi: Colosso, Contatto: Rivoluzionari Ussurani, Famiglia Allargata, Ispirare Generosità, Manualità, Specialista: Convincere, Virtuoso: Parlare in Pubblico\n\nPeculiarità: Intrattenitore. Ottiene un Punto Eroe ogni volta che usa le sue abilità per qualcosa di più del semplice guadagno. Progressista. Ottiene un Punto Eroe ogni volta che rischia la vita per ottenere una tecnologia avanzata.",
        "notes": "«“Sono un rivoluzionario in una terra di tradizionalisti, ma ho visto che il cambiamento è possibile e non avrò riposo finché non otterrò giustizia per la mia gente.”»\nArchetipo: Eroi Ingannatori\n\n📖 Storia:\nOgni volta che Zaltko Karyevskov deve prendere una decisione importante si chiede: “Cosa ne pense- rebbe Zoya?” Questa domanda evoca il ricordo di quel sorriso indagatore che sua moglie aveva dopo che lui le aveva illustrato una delle sue idee per cambiare il mondo. Il ricordo gli scalda il cuore e gli impedisce di prendere decisioni affrettate. Vuole cambiare il mondo, o almeno Ussura, ma se la sua bellissima moglie gli ha insegnato qualcosa è che la passione è inutile senza un buon piano. Zaltko ha visto questa scena troppe volte: mugichi che lavorano fino a farsi sanguinare le mani per prepa- rarsi a un lungo inverno, finché non arrivano i boiardi a reclamare le tasse e i contadini riescono a malapena a sopravvivere. Quando era bambino, Zaltko chiedeva a suo padre come potessero i padroni pretendere così tanto quando lavoravano così poco e questi gli rispon- deva: “Così è sempre stato.” Quando il Barone Feodor costrinse Zoya a lavorare fino alla morte, Zaltko si rifiutò di attendere oltre, mentre i ricchi continuavano a ingrassare sulle spalle dei poveri. Una notte Zaltko, che era un uomo di grande statura, trascinò il Barone fuori dal letto e lo mise al lavoro nei campi. L'inconsolabile vedovo non aveva un piano: non se la sentiva di ucciderlo a sangue freddo e credeva fosse sufficiente la soddisfazione di vedere umiliato il nobile. Per un mese il Barone visse coi suoi servi, mangiò il loro cibo, faticò accanto a loro e toccò con mano le terribili condizioni di vita della plebe. Zaltko non avrebbe mai osato sperare che Feodor si ravvedesse. Quando lo fece, il contadino si accorse che, forse, qualcosa di buono poteva nascere dal suo dolore e alleviarlo. Oggi, Zaltko viaggia di città in città e parla al popolo della sua visione di una Ussura migliore. I suoi discorsi infuocati non attraggono più piccole folle esitanti alla ricerca di facile divertimento, ma gruppi sempre più fitti di mugichi che fanno miglia per ascoltarlo. Non si limita a predicare, ma prende le armi contro ogni ingiustizia che incontra. Mentre lo Zar e la Zarina si battono per il trono sarebbe facile insediare un nuovo governo ma, secondo Zaltko, questo non dovrà essere retto da un uomo solo, ma da tutto il popolo. La Confederazione Sarmatiana è l'immagine di ciò che potrebbe essere il futuro. Si dice che cambi più una montagna in 80 anni che il popolo di Ussura, ma Zaltko non si arrende. Se un uomo come Feodor è cambiato, altrettanto può fare Ussura.\n\n🎯 Obiettivi:\nReclutare un esercito plebeo per difendere Ussura. Zaltko sa che ha bisogno del supporto del popolo per cambiare la Nazione e che una rivoluzione non può essere combattuta da un uomo solo. Spera di aprire gli occhi dei mugichi affinché si rendano conto dell'in- giustizia di un sistema retto solo dalla tradizione e prendano le armi contro di esso. Far arrivare un agitatore democratico da Sarmatia. Zaltko viaggia per Ussura per riunire i mugichi, ma se un sarmatiano dovesse arrivare e mostrare loro il successo della Libertà Dorata, allora saprebbero che la democrazia non è una fantasia, ma una possibi - lità realistica. Assicurarsi l’aiuto di un banchiere per nascondere le ricchezza rubate. Il denaro che Zaltko rubò a Feodor sarà molto utile per la causa, ma deve prima assicurarsi che sia ben nascosto, perché potrebbe portarlo dritto in prigione. Peggio ancora, se i mugichi scoprissero che è ricco, potrebbero voltargli le spalle.\n\n🎭 Consigli di Interpretazione (Giocare Zaltko Karyevskov):\nZaltko è un uomo dallo sguardo fiammeggiante. Non è nato per lavorare nei campi, anche se vi si dedica con tutta la passione che riversa in ogni impresa. Ha il tipo di voce che chiede di essere ascoltata e una grande abilità nello spiegare le sue idee. Può sembrare un pericoloso fanatico ai suoi nemici, ma capisce bene che nessun fine, neppure la vittoria assoluta, giustifica i mezzi.",
        "pcData": {
            "name": "Zaltko Karyevskov",
            "nation": "Ussura",
            "concept": "Eroi Ingannatori • Ussura",
            "traits": {
                "Vigore": 2,
                "Grazia": 2,
                "Risolutezza": 3,
                "Acume": 3,
                "Panache": 3
            },
            "skills": {
                "Allettare": 2,
                "A.d. Guerra": 0,
                "Atletica": 2,
                "Cavalcare": 1,
                "Convincere": 3,
                "Empatia": 3,
                "Esibirsi": 3,
                "Furto": 1,
                "Intimidire": 2,
                "Istruzione": 0,
                "Mira": 0,
                "Mischia": 0,
                "Nascondersi": 0,
                "Navigazione": 0,
                "Notare": 2,
                "Rissa": 1
            },
            "advantages": [
                "Colosso",
                "Contatto: Rivoluzionari Ussurani",
                "Famiglia Allargata",
                "Ispirare Generosità",
                "Manualità",
                "Specialista: Convincere",
                "Virtuoso: Parlare in Pubblico"
            ],
            "virtue": "Virtù: Il Sole Glorioso. L’Eroe può attivare questa Virtù quando si trova al centro dell’attenzione. Per il prossimo Rischio ogni dado conterà come un Incremento senza bisogno di tirare.",
            "hubris": "Hubris: I Troni Testardo. L’Eroe riceve un punto Eroe quando si rifiuta caparbiamente di cambiare idea dinanzi ai fatti.",
            "peculiarities": "Intrattenitore. Ottiene un Punto Eroe ogni volta che usa le sue abilità per qualcosa di più del semplice guadagno. Progressista. Ottiene un Punto Eroe ogni volta che rischia la vita per ottenere una tecnologia avanzata.",
            "story": "Ogni volta che Zaltko Karyevskov deve prendere una decisione importante si chiede: “Cosa ne pense- rebbe Zoya?” Questa domanda evoca il ricordo di quel sorriso indagatore che sua moglie aveva dopo che lui le aveva illustrato una delle sue idee per cambiare il mondo. Il ricordo gli scalda il cuore e gli impedisce di prendere decisioni affrettate. Vuole cambiare il mondo, o almeno Ussura, ma se la sua bellissima moglie gli ha insegnato qualcosa è che la passione è inutile senza un buon piano. Zaltko ha visto questa scena troppe volte: mugichi che lavorano fino a farsi sanguinare le mani per prepa- rarsi a un lungo inverno, finché non arrivano i boiardi a reclamare le tasse e i contadini riescono a malapena a sopravvivere. Quando era bambino, Zaltko chiedeva a suo padre come potessero i padroni pretendere così tanto quando lavoravano così poco e questi gli rispon- deva: “Così è sempre stato.” Quando il Barone Feodor costrinse Zoya a lavorare fino alla morte, Zaltko si rifiutò di attendere oltre, mentre i ricchi continuavano a ingrassare sulle spalle dei poveri. Una notte Zaltko, che era un uomo di grande statura, trascinò il Barone fuori dal letto e lo mise al lavoro nei campi. L'inconsolabile vedovo non aveva un piano: non se la sentiva di ucciderlo a sangue freddo e credeva fosse sufficiente la soddisfazione di vedere umiliato il nobile. Per un mese il Barone visse coi suoi servi, mangiò il loro cibo, faticò accanto a loro e toccò con mano le terribili condizioni di vita della plebe. Zaltko non avrebbe mai osato sperare che Feodor si ravvedesse. Quando lo fece, il contadino si accorse che, forse, qualcosa di buono poteva nascere dal suo dolore e alleviarlo. Oggi, Zaltko viaggia di città in città e parla al popolo della sua visione di una Ussura migliore. I suoi discorsi infuocati non attraggono più piccole folle esitanti alla ricerca di facile divertimento, ma gruppi sempre più fitti di mugichi che fanno miglia per ascoltarlo. Non si limita a predicare, ma prende le armi contro ogni ingiustizia che incontra. Mentre lo Zar e la Zarina si battono per il trono sarebbe facile insediare un nuovo governo ma, secondo Zaltko, questo non dovrà essere retto da un uomo solo, ma da tutto il popolo. La Confederazione Sarmatiana è l'immagine di ciò che potrebbe essere il futuro. Si dice che cambi più una montagna in 80 anni che il popolo di Ussura, ma Zaltko non si arrende. Se un uomo come Feodor è cambiato, altrettanto può fare Ussura.",
            "objectives": "Reclutare un esercito plebeo per difendere Ussura. Zaltko sa che ha bisogno del supporto del popolo per cambiare la Nazione e che una rivoluzione non può essere combattuta da un uomo solo. Spera di aprire gli occhi dei mugichi affinché si rendano conto dell'in- giustizia di un sistema retto solo dalla tradizione e prendano le armi contro di esso. Far arrivare un agitatore democratico da Sarmatia. Zaltko viaggia per Ussura per riunire i mugichi, ma se un sarmatiano dovesse arrivare e mostrare loro il successo della Libertà Dorata, allora saprebbero che la democrazia non è una fantasia, ma una possibi - lità realistica. Assicurarsi l’aiuto di un banchiere per nascondere le ricchezza rubate. Il denaro che Zaltko rubò a Feodor sarà molto utile per la causa, ma deve prima assicurarsi che sia ben nascosto, perché potrebbe portarlo dritto in prigione. Peggio ancora, se i mugichi scoprissero che è ricco, potrebbero voltargli le spalle.",
            "quote": "“Sono un rivoluzionario in una terra di tradizionalisti, ma ho visto che il cambiamento è possibile e non avrò riposo finché non otterrò giustizia per la mia gente.”"
        }
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
