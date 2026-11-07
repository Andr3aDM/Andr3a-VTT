// js/systems/7thsea/sheet.js
// Gestore Nativo Scheda Personaggio 7th Sea (2ª Edizione) per Andr3a VTT
// Include Creazione Guidata con Benefici Passo-Passo (Nazione +1 Tratto, Background +1 alle 5 Abilità & Vantaggi Gratuiti),
// Blocco Lucchetto con Layout Compatto Verticale in Gioco (Zero Sbordamenti e Finestra Stretta),
// 6 Stregonerie Ufficiali, 11 Scuole di Duello, Fedi di Théah + Libera, Spirale Ferite Drammatiche a 4 Colonne e Calcolatore Incrementi Verde Smeraldo.

(function () {
    let currentTokenId = null;
    let isInitialized = false;
    window._s7LoadingFromToken = false;

    function getEngineRef() {
        return (typeof engine !== 'undefined' && engine) ? engine : window.engine;
    }

    function getNetworkRef() {
        return (typeof network !== 'undefined' && network) ? network : window.network;
    }

    function getActiveToken() {
        const eng = getEngineRef();
        if (!eng || !Array.isArray(eng.tokens)) return null;
        if (currentTokenId) {
            const found = eng.tokens.find(t => t.id === currentTokenId);
            if (found) return found;
        }
        if (eng.selectedTokenId) {
            return eng.tokens.find(t => t.id === eng.selectedTokenId) || null;
        }
        return null;
    }

    function showS7Toast(message, type = 'info') {
        let toast = document.getElementById('s7-sheet-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 's7-sheet-toast';
            toast.style.cssText = 'position:absolute;top:54px;left:50%;transform:translateX(-50%);z-index:9999;padding:7px 16px;border-radius:10px;font-size:12px;font-weight:bold;box-shadow:0 6px 20px rgba(0,0,0,0.85);transition:all 0.25s ease;pointer-events:none;display:none;';
            const win = document.getElementById('seventh-sea-sheet-window');
            if (win) win.appendChild(toast);
            else document.body.appendChild(toast);
        }
        if (type === 'danger' || type === 'error') {
            toast.style.background = '#450a0a';
            toast.style.color = '#fca5a5';
            toast.style.border = '1px solid #ef4444';
        } else if (type === 'success') {
            toast.style.background = '#064e3b';
            toast.style.color = '#a7f3d0';
            toast.style.border = '1px solid #10b981';
        } else {
            toast.style.background = '#1e1b4b';
            toast.style.color = '#c7d2fe';
            toast.style.border = '1px solid #6366f1';
        }
        toast.innerHTML = message;
        toast.style.display = 'block';
        toast.style.opacity = '1';
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 250);
        }, 3200);
    }

    const SHEET_INNER_HTML = `
  <div class="max-w-6xl mx-auto space-y-3">

    <!-- HEADER PRINCIPALE & COMANDI RAPIDI -->
    <header class="sheet-card rounded-xl p-3 md:p-3.5 flex flex-wrap items-center justify-between gap-3 border border-[#373f50]">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl shadow-lg border border-amber-300/40">
          ⚓
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg md:text-xl font-black tracking-wide text-amber-400 font-serif leading-tight" id="hero-title">Nuovo Eroe</h1>
            <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800" id="hero-nation-badge">Castille</span>
          </div>
          <p class="text-xs text-gray-400 leading-tight mt-0.5" id="hero-subtitle">Avventuriero Audace &bull; Chiesa del Vaticinio &bull; 7th Sea 2ª Edizione</p>
        </div>
      </div>

      <!-- COMANDI: BLOCCO/SBLOCCO, ESEMPIO, SCHEDA VERGINE, PUNTI EROE -->
      <div class="flex flex-wrap items-center gap-2">
        <button onclick="toggleLock()" id="lock-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow">
          <span id="lock-icon">🔓</span>
          <span id="lock-text">Sbloccata (Creazione)</span>
        </button>

        <button onclick="loadExampleHero()" id="s7-btn-example" class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 border border-blue-600/60 rounded-lg text-xs font-bold text-blue-200 transition-all shadow" title="Carica l'Eroe Esempio per provare il gioco">
          <span>⚡</span>
          <span>Esempio (Kasper)</span>
        </button>

        <button onclick="openBlankSheetModal()" id="s7-btn-blank" class="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-700/60 rounded-lg text-xs font-bold text-red-300 transition-all shadow" title="Azzera la scheda per iniziare un nuovo Eroe">
          <span>🗑️</span>
          <span>Scheda Vergine</span>
        </button>

        <!-- PUNTI EROE RAPIDI -->
        <div class="flex items-center gap-2 bg-[#101217] px-3 py-1 rounded-lg border border-[#2b303d]">
          <span class="text-xs font-bold text-amber-400">Punti Eroe:</span>
          <button onclick="changeHeroPoints(-1)" class="w-6 h-6 rounded bg-[#202532] hover:bg-[#2e3546] font-bold text-xs text-gray-300 flex items-center justify-center">-</button>
          <span class="font-black text-amber-300 text-sm w-4 text-center" id="hero-points">2</span>
          <button onclick="changeHeroPoints(1)" class="w-6 h-6 rounded bg-[#202532] hover:bg-[#2e3546] font-bold text-xs text-amber-400 flex items-center justify-center">+</button>
        </div>
      </div>
    </header>

    <!-- MODALE DI CONFERMA PER SCHEDA VERGINE (IN-PAGE, 100% AFFIDABILE) -->
    <div id="blank-sheet-modal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="sheet-card rounded-2xl p-5 max-w-md w-full border border-red-500/50 shadow-2xl space-y-4 text-center">
        <div class="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/60 flex items-center justify-center text-2xl mx-auto shadow-lg">
          ⚠️
        </div>
        <div>
          <h3 class="text-base font-bold text-red-400">Azzerare la Scheda?</h3>
          <p class="text-xs text-gray-300 mt-1.5 leading-relaxed">
            Sei sicuro di voler creare una nuova <b>Scheda Vergine</b> vuota? Tutti i tratti, le abilità, i vantaggi e le storie attuali verranno reimpostati ai valori iniziali di creazione.
          </p>
        </div>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button onclick="confirmBlankSheet()" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all">
            Sì, Azzera e Crea Scheda Vergine
          </button>
          <button onclick="closeBlankSheetModal()" class="px-4 py-2 bg-[#252a36] hover:bg-[#343b4d] text-gray-300 font-semibold text-xs rounded-xl border border-gray-600">
            Annulla
          </button>
        </div>
      </div>
    </div>

    <!-- PANNELLO WIZARD CREAZIONE COMPATTO (VISIBILE SOLO QUANDO SBLOCCATA 🔓) -->
    <div id="creation-wizard-panel" class="sheet-card rounded-xl p-3 md:p-3.5 border-amber-500/30 bg-[#14161e] space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#252a35] pb-2">
        <div class="flex items-center gap-2">
          <span class="text-amber-400 text-base">🛠️</span>
          <h2 class="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400">Pannello Creazione Personaggio & Regole</h2>
          <span class="text-[10px] bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-semibold">Modifica Libera Attiva</span>
        </div>
        <!-- RIEPILOGO PUNTI CREAZIONE REAL-TIME & SELETTORE FASE EROE -->
        <div class="flex flex-wrap items-center gap-2.5 text-xs">
          <button onclick="toggleHeroPhase()" id="btn-hero-phase" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all shadow-sm bg-[#1c202a] border-[#373f52] text-amber-300 hover:bg-[#282e3c]" title="Alterna tra Cap di Creazione al 1° Livello (Max 3) e Avanzamento Eroe in Campagna (Fino a 5)">
            <span id="hero-phase-icon">🌱</span>
            <span id="hero-phase-text">Creazione (Cap 3)</span>
          </button>
          <div class="bg-[#0e0f14] px-2.5 py-1 rounded-lg border border-[#262c38]">
            <span class="text-gray-400">Tratti liberi:</span> <b class="text-amber-400" id="cnt-traits">0 / 2</b>
          </div>
          <div class="bg-[#0e0f14] px-2.5 py-1 rounded-lg border border-[#262c38]">
            <span class="text-gray-400">Abilità libere:</span> <b class="text-amber-400" id="cnt-skills">0 / 10</b>
          </div>
          <div class="bg-[#0e0f14] px-2.5 py-1 rounded-lg border border-[#262c38]">
            <span class="text-gray-400">Vantaggi spesi:</span> <b class="text-amber-400" id="cnt-adv">0 pt</b>
          </div>
        </div>
      </div>

      <!-- PRIMA RIGA WIZARD: IDENTITA, NAZIONE, TRATTO BONUS, SCHERMA, STREGONERIA -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">Nome Eroe</label>
          <input type="text" id="inp-hero-name" oninput="onNameChange(this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-gray-200 outline-none text-xs focus:border-amber-400">
        </div>
        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">Concetto</label>
          <input type="text" id="inp-hero-concept" oninput="onConceptChange(this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-gray-200 outline-none text-xs focus:border-amber-400">
        </div>

        <!-- RELIGIONE / FEDE CON MENU A TENDINA + CAMPO LIBERO -->
        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">Religione / Fede</label>
          <select id="sel-faith" onchange="onFaithSelectChange(this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2 py-1.5 text-gray-200 outline-none text-xs focus:border-amber-400">
            <option value="Chiesa del Vaticinio">Chiesa del Vaticinio (Castille/Vodacce)</option>
            <option value="Obiezione">Obiezione (Riforma Lieber - Eisen)</option>
            <option value="Chiesa di Avalon">Chiesa di Avalon (Scisma Reale)</option>
            <option value="I Vecchi Dèi">I Vecchi Dèi (Pantheon Vani - Vesten)</option>
            <option value="Fede Ortodossa Ussurana">Ortodossia Ussurana (Madre Ussura)</option>
            <option value="Al-Dinn">Al-Dinn (Impero della Mezzaluna)</option>
            <option value="Dievismo Sarmatiano">Dievismo (Patti Antichi - Sarmatia)</option>
            <option value="Scettico / Nessuna Fede">Scettico / Nessuna Fede</option>
            <option value="custom">✏️ Altro / Personalizzato...</option>
          </select>
          <input type="text" id="inp-hero-faith" oninput="onFaithChange(this.value)" placeholder="Specifica fede o setta..." class="hidden w-full mt-1.5 bg-[#0d0e12] border border-amber-500/60 rounded-lg px-2 py-1 text-gray-200 outline-none text-xs">
        </div>

        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">Nazione d'Origine</label>
          <select id="sel-nation" onchange="onNationChange(this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2 py-1.5 text-gray-200 outline-none text-xs focus:border-amber-400">
            <option value="Avalon">Avalon</option>
            <option value="Castille">Castille</option>
            <option value="Eisen">Eisen</option>
            <option value="Highland Marches">Highland Marches</option>
            <option value="Inismore">Inismore</option>
            <option value="Montaigne">Montaigne</option>
            <option value="Sarmatia">Confed. Sarmatiana</option>
            <option value="Ussura">Ussura</option>
            <option value="Vestenmennavenjar">Vestenmennavenjar</option>
            <option value="Vodacce">Vodacce</option>
          </select>
        </div>

        <!-- SELETTORE TRATTO BONUS NAZIONALE (+1 GRATUITO) -->
        <div>
          <label class="block text-amber-400 text-[11px] font-semibold mb-1">Bonus Tratto Naz. (+1)</label>
          <select id="sel-nation-trait" onchange="onNationTraitChange(this.value)" class="w-full bg-[#0d0e12] border border-amber-500/60 rounded-lg px-2 py-1.5 text-amber-300 font-bold outline-none text-xs focus:border-amber-400">
            <!-- Popolato dinamicamente da NATIONS_CONFIG -->
          </select>
        </div>

        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">Stregoneria</label>
          <select id="sel-sorcery" onchange="onSorceryChange(this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2 py-1.5 text-purple-300 font-semibold outline-none text-xs focus:border-purple-400">
            <option value="Nessuna">Nessuna Stregoneria</option>
            <option value="Hexenwerk">Hexenwerk (Eisen - Unguenti)</option>
            <option value="Glamour">Glamour (Avalon - Incanti)</option>
            <option value="Porté">Porté (Montaigne - Squarci)</option>
            <option value="Sanderis">Sanderis (Sarmatia - Patti)</option>
            <option value="Sorte">Sorte (Vodacce - Fili del Fato)</option>
            <option value="Dar Matushki">Dar Matushki (Ussura - Tocchi)</option>
          </select>
        </div>
      </div>

      <!-- SECONDA RIGA WIZARD: I 2 BACKGROUND (CON RIEPILOGO ABILITA/VANTAGGI), VIRTU E SUPERBIA, SCHERMA -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs pt-1.5 border-t border-[#252a35]/60">
        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">1° Background</label>
          <select id="sel-bg1" onchange="onBgChange(0, this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2 py-1.5 text-gray-200 outline-none text-xs focus:border-amber-400">
            <!-- Popolato dinamicamente -->
          </select>
          <div id="bg1-summary" class="text-[10px] text-amber-300/80 mt-1 truncate" title="Benefici 1° Background"></div>
        </div>

        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">2° Background</label>
          <select id="sel-bg2" onchange="onBgChange(1, this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2 py-1.5 text-gray-200 outline-none text-xs focus:border-amber-400">
            <!-- Popolato dinamicamente -->
          </select>
          <div id="bg2-summary" class="text-[10px] text-amber-300/80 mt-1 truncate" title="Benefici 2° Background"></div>
        </div>

        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">Scuola di Scherma</label>
          <select id="sel-style" onchange="onStyleChange(this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2 py-1.5 text-gray-200 outline-none text-xs focus:border-amber-400">
            <!-- Popolato da duelingStylesDb -->
          </select>
        </div>

        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">Virtù (Sorte Deck)</label>
          <select id="sel-virtue" onchange="onVirtueChange(this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2 py-1.5 text-emerald-300 font-semibold outline-none text-xs focus:border-emerald-400">
            <!-- Popolato dinamicamente -->
          </select>
        </div>

        <div>
          <label class="block text-gray-400 text-[11px] font-semibold mb-1">Superbia / Hubris</label>
          <select id="sel-hubris" onchange="onHubrisChange(this.value)" class="w-full bg-[#0d0e12] border border-[#2c3240] rounded-lg px-2 py-1.5 text-rose-300 font-semibold outline-none text-xs focus:border-rose-400">
            <!-- Popolato dinamicamente -->
          </select>
        </div>
      </div>
    </div>

    <!-- BARRA NAVIGAZIONE PANNELLI (TAB) -->
    <div class="flex items-center gap-1 border-b border-[#252b37] px-1">
      <button onclick="switchTab('main')" id="tab-btn-main" class="tab-btn active flex items-center gap-2">
        <span>⚔️</span>
        <span>Scheda Principale & Rischi</span>
      </button>
      <button onclick="switchTab('details')" id="tab-btn-details" class="tab-btn flex items-center gap-2">
        <span>📜</span>
        <span>Vantaggi, Duelli & Stregoneria</span>
      </button>
      <button onclick="switchTab('stories')" id="tab-btn-stories" class="tab-btn flex items-center gap-2">
        <span>📖</span>
        <span>Storie & Avanzamento</span>
      </button>
      <button onclick="switchTab('journal')" id="tab-btn-journal" class="tab-btn flex items-center gap-2">
        <span>📓</span>
        <span>Giornale & Note</span>
      </button>
    </div>

    <!-- TAB 1: SCHEDA PRINCIPALE (TRATTI, ABILITÀ, FERITE, DADI) -->
    <div id="tab-main" class="tab-content space-y-3">
      <div id="s7-main-grid" class="grid grid-cols-1 lg:grid-cols-12 gap-3">

        <!-- COLONNA SINISTRA: TRATTI E SALUTE/FERITE (4 COLS) -->
        <div id="s7-col-left" class="lg:col-span-4 space-y-3">

          <!-- TRATTI DELL'EROE (COMPATTO & ZERO SBORDAMENTO) -->
          <div class="sheet-card rounded-xl p-3 md:p-3.5">
            <div class="flex items-center justify-between border-b border-[#252a35] pb-2 mb-2.5">
              <h2 class="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span>🛡️</span> I 5 Tratti dell\'Eroe
              </h2>
              <span class="text-[11px] text-gray-400" id="trait-mode-hint">Clicca per Dado</span>
            </div>

            <div class="space-y-2" id="traits-list">
              <!-- Renderizzato via JS -->
            </div>
          </div>

          <!-- SALUTE & MORTE: FERITE DRAMMATICHE & FERITE NORMALI (COMPATTA ORIZZONTALE) -->
          <div class="sheet-card rounded-xl p-3 md:p-3.5 space-y-2.5 border-rose-500/25">
            <div class="flex items-center justify-between border-b border-[#252a35] pb-1.5">
              <div class="flex items-center gap-1.5">
                <span class="text-rose-500 font-bold text-sm">🩸</span>
                <h2 class="text-xs md:text-sm font-bold uppercase tracking-wider text-rose-400">Ferite & Salute</h2>
              </div>
              <span class="text-xs text-rose-300 font-bold" id="dw-count-label">0 / 4 FD</span>
            </div>

            <!-- LE FERITE DRAMMATICHE IN GRIGLIA ORIZZONTALE (4 o 5 COLONNE CON DURO DA UCCIDERE) -->
            <div class="grid grid-cols-4 gap-2 text-center dw-cols-4" id="dw-cards-container">
              <!-- 1a FD -->
              <div onclick="toggleDramaticWound(1)" id="dw-card-1" class="dw-box" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1">
                  <span id="dw-check-1">🔲</span> 1ª
                </div>
                <div class="dw-sub text-[10px] text-emerald-400 font-bold leading-tight mt-0.5">+1 Dado</div>
              </div>

              <!-- 2a FD -->
              <div onclick="toggleDramaticWound(2)" id="dw-card-2" class="dw-box" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1">
                  <span id="dw-check-2">🔲</span> 2ª
                </div>
                <div class="dw-sub text-[10px] text-amber-400 font-bold leading-tight mt-0.5">+2 Nemici</div>
              </div>

              <!-- 3a FD -->
              <div onclick="toggleDramaticWound(3)" id="dw-card-3" class="dw-box" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1">
                  <span id="dw-check-3">🔲</span> 3ª
                </div>
                <div class="dw-sub text-[10px] text-purple-300 font-bold leading-tight mt-0.5">💥 10 Espl.</div>
              </div>

              <!-- 4a FD -->
              <div onclick="toggleDramaticWound(4)" id="dw-card-4" class="dw-box" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-black text-red-400 flex items-center justify-center gap-1">
                  <span id="dw-check-4">💀</span> 4ª
                </div>
                <div class="dw-sub text-[10px] text-red-400 font-black leading-tight mt-0.5">INERME</div>
              </div>
            </div>

            <!-- BADGE SOLO CONTRO TUTTI (SE ATTIVO) -->
            <div id="solo-contro-tutti-badge" class="hidden text-[11px] px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/50 text-blue-200 font-medium"></div>

            <!-- RIGA FERITE NORMALI (SOGLIA 4 PALLINI + TASTI) -->
            <div class="flex items-center justify-between bg-[#12141a] px-3 py-2 rounded-xl border border-[#272c38] text-xs">
              <div class="flex items-center gap-2">
                <span class="text-gray-300 font-bold text-xs">Ferite:</span>
                <span id="current-wounds" class="font-black text-rose-400 text-sm">0</span>
                <span class="text-gray-500 text-xs">/ 4</span>
                <div class="s7-dots-row ml-1">
                  <div id="w-dot-1" class="dot !w-3 !h-3 !bg-[#1c202a] !border-gray-600"></div>
                  <div id="w-dot-2" class="dot !w-3 !h-3 !bg-[#1c202a] !border-gray-600"></div>
                  <div id="w-dot-3" class="dot !w-3 !h-3 !bg-[#1c202a] !border-gray-600"></div>
                  <div id="w-dot-4" class="dot !w-3 !h-3 !bg-[#1c202a] !border-gray-600"></div>
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <button onclick="addWound(1)" class="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-bold text-xs" title="Aggiungi 1 Ferita">+1 Ferita</button>
                <button onclick="addWound(-1)" class="px-2.5 py-1 rounded-lg bg-[#202531] hover:bg-[#2c3343] border border-gray-600 text-gray-300 font-bold text-xs" title="Rimuovi 1 Ferita">-1</button>
                <button onclick="clearNormalWounds()" class="px-2 py-1 rounded-lg bg-[#1c1e26] hover:bg-[#272a36] border border-[#373d4d] text-gray-400 hover:text-gray-200 text-xs font-semibold" title="Azzera le ferite ordinarie a fine Scena d'Azione">Azzera</button>
              </div>
            </div>

            <!-- ARCANO: VIRTU & SUPERBIA (LAYOUT ROBUSTO, MAI TRONCATO) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-0.5">
              <div class="bg-[#12141a] p-2.5 rounded-xl border border-[#272c38]">
                <div class="flex items-center justify-between">
                  <span class="text-emerald-400 font-bold text-xs">Virtù</span>
                  <span class="text-xs text-emerald-300 font-bold" id="virtue-display-name">Scaltro</span>
                </div>
                <p class="text-[10px] text-gray-400 mt-1 leading-snug" id="virtue-display-desc">Attiva per un grande vantaggio narrativo o di scena.</p>
              </div>

              <div class="bg-[#12141a] p-2.5 rounded-xl border border-[#272c38] flex flex-col justify-between gap-1.5">
                <div class="min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="text-rose-400 font-bold text-xs">Superbia:</span>
                    <span class="text-xs text-rose-300 font-bold truncate ml-1" id="hubris-display-name">Curioso</span>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-0.5 leading-snug" id="hubris-display-desc">Ricevi 1 PE quando cedi al tuo difetto.</p>
                </div>
                <button onclick="triggerHubris()" class="w-full py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-[11px] font-bold text-rose-300 rounded-lg shadow-sm transition">
                  Cedi (+1 PE)
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- COLONNA DESTRA: LE 16 ABILITA & ROLLER DEI RISCHI (8 COLS) -->
        <div id="s7-col-right" class="lg:col-span-8 space-y-3">

          <!-- PANNELLO ABILITA UFFICIALI (COMPATTO A 2 COLONNE SENZA SBORDAMENTI) -->
          <div class="sheet-card rounded-xl p-3 md:p-3.5">
            <div class="flex items-center justify-between border-b border-[#252a35] pb-2 mb-2.5">
              <div class="flex items-center gap-2">
                <span class="text-amber-400 text-sm">🎯</span>
                <h2 class="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400">Le 16 Abilità Ufficiali</h2>
                <span class="text-[11px] text-gray-400 ml-2 hidden md:inline">(G3: ritira 1 dado &bull; G4: 15=2 Incr. &bull; G5: 10 esplodono)</span>
              </div>
              <span class="text-[11px] text-gray-400" id="skill-mode-hint">Clicca per Dado</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5" id="skills-list">
              <!-- Renderizzato via JS -->
            </div>
          </div>

          <!-- RISCHIO & ROLLER DADI 7TH SEA INTEGRATO -->
          <div class="sheet-card rounded-xl p-3 md:p-3.5 space-y-2.5 border-amber-500/30">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#252a35] pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">🎲</span>
                <div>
                  <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400">Lancio del Rischio (Riserva di d10)</h3>
                  <p class="text-xs text-gray-200 font-semibold" id="pool-formula-desc">Grazia (2) + Mischia (0) = 2 d10</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button onclick="rollRisk()" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-95">
                  Lancia Rischio 🎲
                </button>
                <button onclick="resetDice()" class="px-3 py-2 bg-[#202532] hover:bg-[#2e3546] text-gray-300 font-bold text-xs rounded-xl border border-[#3b4356]">
                  Azzera
                </button>
                <!-- TOGGLE DADI BONUS CONTESTUALI & BADGE ISTITUZIONALI (SPAZIO CERCHIATO IN ROSSO) -->
                <div id="risk-advantage-toggles" class="flex flex-wrap items-center gap-1.5 ml-1"></div>
              </div>
            </div>

            <!-- RISULTATI DADI E INCREMENTI -->
            <div id="dice-results-container" class="min-h-[90px] bg-[#111318] rounded-xl p-3 border border-[#262c3a] flex flex-col justify-center items-center text-center">
              <p class="text-gray-400 italic text-xs">Seleziona un Tratto e un\'Abilità sopra, poi clicca &quot;Lancia Rischio&quot; per visualizzare i dadi e calcolare gli Incrementi (Abbinamenti di 10 evidenziati in verde).</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- TAB 2: VANTAGGI, DUELLI & STREGONERIA -->
    <div id="tab-details" class="tab-content hidden space-y-3">

      <!-- SCUOLA DI SCHERMA (GILDA DEI DUELLANTI) -->
      <div class="sheet-card rounded-xl p-3.5 md:p-4" id="dueling-school-panel">
        <div class="flex items-center justify-between border-b border-[#252a35] pb-2.5 mb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">🤺</span>
            <div>
              <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400" id="dueling-style-title">Scuola di Scherma: Nessuna</h3>
              <p class="text-xs text-gray-400" id="dueling-weapons-desc">Armi: Ordinarie &bull; Privilegio della Gilda dei Duellanti</p>
            </div>
          </div>
          <span class="text-xs bg-[#1c202a] text-amber-300 px-2.5 py-1 rounded-lg border border-[#373f52] font-bold" id="dueling-cost-badge">5 Punti</span>
        </div>

        <div id="dueling-details-content" class="text-xs text-gray-300 space-y-2">
          <!-- Popolato via JS -->
        </div>
      </div>

      <!-- VANTAGGI ACQUISITI -->
      <div class="sheet-card rounded-xl p-3.5 md:p-4 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#252a35] pb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-amber-400 font-bold text-base">⭐</span>
            <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400">Vantaggi Acquisiti</h3>
            <span class="text-xs text-gray-400">(Totale: <b class="text-amber-300" id="total-advantage-points">0</b> pt spesi)</span>
          </div>

          <div id="add-adv-btn-container">
            <button onclick="toggleAddAdvantagePanel()" class="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-bold transition-all">
              + Aggiungi Vantaggio
            </button>
          </div>
        </div>

        <!-- FORM INLINE AGGIUNTA VANTAGGIO (CATALOGO UFFICIALE CON SCONTI O PERSONALIZZATO) -->
        <div id="add-advantage-panel" class="hidden bg-[#151722] p-3 rounded-xl border border-amber-500/30 space-y-3">
          <div class="flex items-center gap-2 border-b border-[#262c3a] pb-2">
            <label class="text-xs text-gray-300 font-bold">Tipo Vantaggio:</label>
            <label class="inline-flex items-center text-xs text-amber-300 cursor-pointer">
              <input type="radio" name="adv-source-type" value="catalog" checked onchange="toggleAdvSourceType(this.value)" class="mr-1"> Da Catalogo
            </label>
            <label class="inline-flex items-center text-xs text-amber-300 cursor-pointer ml-3">
              <input type="radio" name="adv-source-type" value="custom" onchange="toggleAdvSourceType(this.value)" class="mr-1"> ✏️ Personalizzato
            </label>
          </div>

          <div id="adv-catalog-row" class="flex flex-wrap items-center gap-2">
            <div class="flex-1 min-w-[240px]">
              <label class="block text-xs text-gray-400 mb-1">Seleziona Vantaggio Ufficiale:</label>
              <select id="sel-new-adv" class="w-full bg-[#0d0e12] border border-[#373f52] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none">
                <!-- Popolato da advantagesDb -->
              </select>
            </div>
            <div class="flex items-end gap-2 pt-3">
              <button onclick="confirmAddAdvantage()" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg shadow">
                Aggiungi
              </button>
              <button onclick="toggleAddAdvantagePanel()" class="px-3 py-1.5 bg-[#202532] hover:bg-[#2c3342] text-gray-300 text-xs rounded-lg">
                Annulla
              </button>
            </div>
          </div>

          <div id="adv-custom-row" class="hidden space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div class="md:col-span-2">
                <label class="block text-xs text-gray-400 mb-1">Nome Vantaggio</label>
                <input type="text" id="inp-custom-adv-name" placeholder="Es: Fama nei Bassifondi" class="w-full bg-[#0d0e12] border border-[#373f52] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none">
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Costo (Punti)</label>
                <input type="number" id="inp-custom-adv-cost" value="2" min="0" max="10" class="w-full bg-[#0d0e12] border border-[#373f52] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none">
              </div>
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1">Descrizione & Effetto Meccanico</label>
              <textarea id="inp-custom-adv-desc" rows="2" placeholder="Descrivi il beneficio conferito all'Eroe..." class="w-full bg-[#0d0e12] border border-[#373f52] rounded-lg p-2 text-xs text-gray-200 outline-none"></textarea>
            </div>
            <div class="flex items-center justify-end gap-2 pt-1">
              <button onclick="confirmAddCustomAdvantage()" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg shadow">
                Aggiungi Personalizzato
              </button>
              <button onclick="toggleAddAdvantagePanel()" class="px-3 py-1.5 bg-[#202532] hover:bg-[#2c3342] text-gray-300 text-xs rounded-lg">
                Annulla
              </button>
            </div>
          </div>
        </div>

        <!-- LISTA CARDS VANTAGGI -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5" id="advantages-list-container">
          <!-- Popolato via JS -->
        </div>
      </div>

      <!-- SEZIONE STREGONERIA (DINAMICA: SE 'NESSUNA' SCOMPARE AL 100% IN MODALITA GIOCO) -->
      <div id="sorcery-container">
        <!-- Renderizzato via JS -->
      </div>
    </div>

    <!-- TAB 3: STORIE & TRASCORSI (AVANZAMENTO EROE) -->
    <div id="tab-stories" class="tab-content hidden space-y-3">
      <div class="sheet-card rounded-xl p-3.5 md:p-4">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#252a35] pb-2.5 mb-3">
          <div>
            <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>📖</span> Storie dell\'Eroe (Avanzamento di Livello)
            </h3>
            <p class="text-xs text-gray-400">In 7th Sea l'Eroe aumenta Tratti, Abilità e Vantaggi completando le Fasi delle sue Storie personali.</p>
          </div>

          <div id="new-story-btn-container">
            <button onclick="addNewStoryPrompt()" class="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-bold transition-all">
              + Nuova Storia
            </button>
          </div>
        </div>

        <!-- FORM INLINE NUOVA STORIA -->
        <div id="new-story-inline-form" class="hidden bg-[#151722] p-3.5 rounded-xl border border-amber-500/30 mb-3.5 space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block text-gray-400 mb-1 font-semibold text-xs">Titolo della Storia:</label>
              <input type="text" id="inp-story-title" placeholder="Es: Vendetta contro il Barone Von Sieger" class="w-full bg-[#0d0e12] border border-[#2d3444] rounded-lg px-2.5 py-1.5 text-gray-200 outline-none text-xs">
            </div>
            <div>
              <label class="block text-gray-400 mb-1 font-semibold text-xs">Ricompensa (Obiettivo):</label>
              <input type="text" id="inp-story-goal" placeholder="Es: +1 Risolutezza, o Vantaggio Volontà Indomita" class="w-full bg-[#0d0e12] border border-[#2d3444] rounded-lg px-2.5 py-1.5 text-gray-200 outline-none text-xs">
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <button onclick="confirmAddNewStory()" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg shadow">
              Crea Storia
            </button>
            <button onclick="toggleNewStoryForm()" class="px-3 py-1.5 bg-[#202532] hover:bg-[#2c3342] text-gray-300 text-xs rounded-lg">
              Annulla
            </button>
          </div>
        </div>

        <div class="space-y-2.5" id="stories-list-container">
          <!-- Popolato via JS -->
        </div>
      </div>

      <!-- TRASCORSI & PECULIARITA (BACKGROUNDS) -->
      <div class="sheet-card rounded-xl p-3.5 md:p-4 space-y-2.5">
        <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-[#252a35] pb-2">
          <span>🎭</span> Trascorsi & Peculiarità (Backgrounds)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div class="bg-[#151722] p-3 rounded-xl border border-[#2d3444]" id="bg-display-1">
            <!-- Popolato via JS -->
          </div>
          <div class="bg-[#151722] p-3 rounded-xl border border-[#2d3444]" id="bg-display-2">
            <!-- Popolato via JS -->
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: GIORNALE D'AVVENTURA & NOTE DI SESSIONE -->
    <div id="tab-journal" class="tab-content hidden space-y-3">
      <div class="sheet-card rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-[#252a35] pb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">📓</span>
            <div>
              <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400">Giornale di Bordo & Diario d'Avventura</h3>
              <p class="text-xs text-gray-400">Appunti di viaggio, indizi, PNG incontrati a Théah e cronache della campagna (sincronizzato col Token)</p>
            </div>
          </div>
        </div>
        <textarea id="s7-adventure-journal" oninput="onS7JournalChange(this.value)" rows="10" placeholder="Scrivi qui il diario di bordo del tuo Eroe..." class="w-full bg-[#12141c] border border-[#2e3546] rounded-xl p-3 text-xs md:text-sm text-gray-200 focus:border-amber-500 outline-none leading-relaxed"></textarea>
      </div>
    </div>

  </div>`;

    function ensureS7ModalDOM() {
        let win = document.getElementById('seventh-sea-sheet-window');
        if (win) return win;

        win = document.createElement('div');
        win.id = 'seventh-sea-sheet-window';
        win.className = 's7-unlocked';
        win.innerHTML = `
            <div id="s7-window-titlebar">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:18px;">⛵</span>
                    <strong style="color:#fcd34d;font-size:13.5px;letter-spacing:0.4px;" id="s7-window-title-text">Scheda Eroe 7th Sea (2ª Edizione)</strong>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                    <button type="button" id="s7-btn-export-json" style="background:#1b5e20;color:#a5d6a7;border:1px solid #2e7d32;border-radius:5px;padding:3px 9px;font-size:11px;font-weight:bold;cursor:pointer;" title="Esporta Scheda Eroe e Giornale in formato .json">💾 Esporta (.json)</button>
                    <button type="button" id="s7-btn-import-json" style="background:#263238;color:#80cbc4;border:1px solid #37474f;border-radius:5px;padding:3px 9px;font-size:11px;font-weight:bold;cursor:pointer;" title="Importa Scheda Eroe da file .json">📂 Importa (.json)</button>
                    <button type="button" id="s7-btn-close-window" style="background:#3b1219;color:#fca5a5;border:1px solid #ef4444;border-radius:5px;padding:2px 9px;font-size:13px;font-weight:bold;cursor:pointer;margin-left:4px;" title="Chiudi Scheda">✕</button>
                </div>
            </div>
            <div id="s7-sheet-scroll-body">
                ${SHEET_INNER_HTML}
            </div>
        `;
        document.body.appendChild(win);

        // Dragging support on titlebar
        const titlebar = document.getElementById('s7-window-titlebar');
        let isDraggingWin = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDraggingWin = true;
            const rect = win.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            win.style.left = rect.left + 'px';
            win.style.top = rect.top + 'px';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingWin) return;
            const nx = Math.max(0, Math.min(window.innerWidth - 120, e.clientX - dragOffsetX));
            const ny = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffsetY));
            win.style.left = nx + 'px';
            win.style.top = ny + 'px';
        });

        window.addEventListener('mouseup', () => {
            isDraggingWin = false;
        });

        document.getElementById('s7-btn-close-window').addEventListener('click', () => {
            seventhSeaSheetManager.close();
        });

        document.getElementById('s7-btn-export-json').addEventListener('click', () => {
            const tok = getActiveToken();
            if (tok) seventhSeaSheetManager.exportSingleCharacterJson(tok);
        });

        document.getElementById('s7-btn-import-json').addEventListener('click', () => {
            const tok = getActiveToken();
            if (tok) seventhSeaSheetManager.importSingleCharacterJson(tok);
        });

        populateDropdowns();
        isInitialized = true;
        return win;
    }

    function isDuroDaUccidere() {
        return (window.seventhSeaRules && typeof window.seventhSeaRules.hasAdvantage === 'function')
            ? window.seventhSeaRules.hasAdvantage(character, 'Duro Da Uccidere')
            : (character && character.advantages || []).some(a => (a.name || '').toLowerCase() === 'duro da uccidere');
    }

    function isSoloControTutti() {
        return (window.seventhSeaRules && typeof window.seventhSeaRules.hasAdvantage === 'function')
            ? window.seventhSeaRules.hasAdvantage(character, 'Solo Contro Tutti')
            : (character && character.advantages || []).some(a => (a.name || '').toLowerCase() === 'solo contro tutti');
    }

    // Sincronizza lo stato di character nel token VTT e trasmette in rete
    window.saveCharacterToVttToken = function (forceSync = true) {
        if (window._s7LoadingFromToken) return;
        const tok = getActiveToken();
        if (!tok || !character) return;

        character.system = '7thsea';
        character.isLocked = !!isLocked;
        character.updatedAt = Date.now();

        tok.pcSheet = JSON.parse(JSON.stringify(character));
        tok.hasPcSheet = true;

        if (character.name && character.name.trim() && character.name !== 'Nuovo Eroe') {
            tok.name = character.name.trim();
        }

        // Sincronizza la Salute (20 Ferite totali = 20 PV nel token, oppure 25 con Duro da Uccidere)
        const maxHP = isDuroDaUccidere() ? 25 : 20;
        const wounds = Math.max(0, Math.min(maxHP, parseInt(character.currentWounds) || 0));
        tok.hpMax = maxHP;
        tok.hpCurrent = Math.max(0, maxHP - wounds);

        const titleEl = document.getElementById('s7-window-title-text');
        if (titleEl) {
            titleEl.textContent = `Scheda Eroe 7th Sea — ${tok.name || 'Nuovo Eroe'}`;
        }

        if (!forceSync) return;

        const eng = getEngineRef();
        const net = getNetworkRef();

        if (eng && eng.isDM) {
            if (typeof window.upsertTokenInCampaign === 'function') {
                window.upsertTokenInCampaign(tok);
            }
            if (typeof window.broadcastPcSheetSync === 'function') {
                window.broadcastPcSheetSync(tok);
            }
            if (typeof window.syncState === 'function') {
                window.syncState(true, false);
            }
            if (typeof eng.renderTokensLayer === 'function') {
                eng.renderTokensLayer();
            }
        } else if (net && net.mode === 'client') {
            net.send({
                type: 'PLAYER_UPDATE_PC_SHEET',
                payload: {
                    tokenId: tok.id,
                    player: net.playerName || null,
                    pcSheet: tok.pcSheet,
                    adventureJournal: tok.adventureJournal || '',
                    hpMax: tok.hpMax,
                    hpCurrent: tok.hpCurrent
                }
            });
            if (eng && typeof eng.renderTokensLayer === 'function') {
                eng.renderTokensLayer();
            }
        }
    };

    window.onS7JournalChange = function (val) {
        const tok = getActiveToken();
        if (!tok) return;
        tok.adventureJournal = val;
        if (tok.pcSheet) tok.pcSheet.adventureJournal = val;
        window.saveCharacterToVttToken(true);
    };

    // DATI STATO GLOBALE
    let character = {};
    let isLocked = false;
    let selectedTrait = "Vigore";
    let selectedSkill = "Mischia";
    let currentRaises = 0;

    // CONFIGURAZIONE NAZIONI UFFICIALI 7TH SEA 2E (TRATTI BONUS & STREGONERIE)
    const NATIONS_CONFIG = {
        "Avalon": { traits: ["Panache", "Risolutezza"], sorcery: "Glamour" },
        "Castille": { traits: ["Grazia", "Acume"], sorcery: "Nessuna" },
        "Eisen": { traits: ["Vigore", "Risolutezza"], sorcery: "Hexenwerk" },
        "Highland Marches": { traits: ["Vigore", "Risolutezza"], sorcery: "Glamour" },
        "Inismore": { traits: ["Panache", "Acume"], sorcery: "Glamour" },
        "Montaigne": { traits: ["Grazia", "Panache"], sorcery: "Porté" },
        "Sarmatia": { traits: ["Vigore", "Grazia"], sorcery: "Sanderis" },
        "Ussura": { traits: ["Risolutezza", "Acume"], sorcery: "Dar Matushki" },
        "Vestenmennavenjar": { traits: ["Vigore", "Acume"], sorcery: "Nessuna" },
        "Vodacce": { traits: ["Grazia", "Acume"], sorcery: "Sorte" }
    };

    // DATABASE EMBEDDED CON NAZIONE ASSEGNATA AD OGNI BACKGROUND
    const backgroundsDb = [
        {"name":"Archeologo","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che consegna un artefatto di valore a un museo, università o altra istituzione pubblica.","advantages":["Oggetto Distintivo","Vista d'Aquila"],"skills":["Atletica","Convincere","Furto","Istruzione","Notare"]},
        {"name":"Aristocratico","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte.","advantages":["Ricco","Sorriso Disarmante"],"skills":["Cavalcare","Convincere","Empatia","Istruzione","Mira"]},
        {"name":"Artigiano","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta le modeste abilità artigiane per risolvere problemi considerati troppo complessi per avere una soluzione semplice.","advantages":["Manualità","Mastro Artigiano"],"skills":["Atletica","Convincere","Esibirsi","Istruzione","Notare"]},
        {"name":"Artista","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che si sacrifica per rendere Théah un luogo più bello.","advantages":["Affascinare","Mecenate"],"skills":["Allettare","Cavalcare","Convincere","Empatia","Esibirsi"]},
        {"name":"Assassino","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che si espone per evitare la morte di un nemico o rifiuta un piano d’azione perché potrebbe causare morti inutili.","advantages":["Psst, da questa parte","Schermidore"],"skills":["Atletica","Empatia","Intimidire","Mischia","Nascondersi"]},
        {"name":"Cacciatore","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che il suo istinto di cacciatore salva qualcuno da un pericolo.","advantages":["Cecchino","Fatto!"],"skills":["Cavalcare","Intimidire","Mira","Nascondersi","Notare"]},
        {"name":"Capitano Di Nave","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che è l’ultimo del suo equipaggio a mettersi in salvo.","advantages":["Comando","Gambe da Marinaio","Sposato al Mare"],"skills":["A.d. Guerra","Convincere","Mira","Navigazione","Notare"]},
        {"name":"Cavaliere","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta la sua esperienza nel cavalcare in una situazione insolita.","advantages":["Mano Pesante","Volontà Indomabile"],"skills":["A.d. Guerra","Cavalcare","Intimidire","Mischia","Notare"]},
        {"name":"Contadino","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che risolve un problema complesso usando semplici e vecchie soluzioni contadine.","advantages":["Esperto di Sopravvivenza","Tratto Leggendario"],"skills":["Atletica","Cavalcare","Convincere","Empatia","Esibirsi"]},
        {"name":"Cortigiano","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che, con il suo fascino e il suo stile, impedisce un’esplosione di violenza.","advantages":["Amicizie Altolocate","Un Semplice Malinteso"],"skills":["Allettare","Cavalcare","Empatia","Esibirsi","Mischia"]},
        {"name":"Dottore","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che si occupa delle ferite di un Malvagio o delle sue vittime innocenti.","advantages":["Fautore di Miracoli","Orologio Biologico"],"skills":["Cavalcare","Convincere","Empatia","Istruzione","Notare"]},
        {"name":"Duellante","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.","advantages":["Sala d’Armi"],"skills":["Atletica","Empatia","Esibirsi","Intimidire","Mischia"]},
        {"name":"Esploratore","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che posa lo sguardo su una vista che pochi o nessuno a Théah hanno mai potuto godere.","advantages":["Lavorare sui Tetti","Riflessi Rapidi"],"skills":["Atletica","Cavalcare","Convincere","Empatia","Navigazione"]},
        {"name":"Fuorilegge","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che viola la legge per uno scopo nobile.","advantages":["Cameratismo","Scafato"],"skills":["Atletica","Empatia","Furto","Intimidire","Nascondersi"]},
        {"name":"Ingegnere","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che usa la sua conoscenza tecnica per risolvere un problema.","advantages":["Mastro Artigiano","Orologio Biologico","Senso dell’Orientamento"],"skills":["A.d. Guerra","Cavalcare","Convincere","Istruzione","Mira"]},
        {"name":"Intrattenitore","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che usa le sue abilità per qualcosa di più del semplice guadagno.","advantages":["Ispirare Generosità","Virtuoso"],"skills":["Allettare","Atletica","Empatia","Esibirsi","Furto"]},
        {"name":"Jenny","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che risolve un conflitto grazie alla seduzione o a proposte sessuali.","advantages":["Approccio Dinamico","Vieni Qui"],"skills":["Allettare","Atletica","Empatia","Esibirsi","Mira"]},
        {"name":"Marinaio","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che mette da parte i suoi desideri per garantire la sicurezza o la comodità dei suoi compagni.","advantages":["Rissoso","Vista d'Aquila"],"skills":["Allettare","Mischia","Navigazione","Notare","Rissa"]},
        {"name":"Mercante","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che vende un oggetto per molto meno del suo reale valore a chi ne ha un disperato bisogno.","advantages":["Orologio Biologico","Scuola di Maniere"],"skills":["Allettare","Cavalcare","Convincere","Empatia","Intimidire"]},
        {"name":"Mercenario","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che sceglie di seguire una ragione più nobile del vile denaro.","advantages":["Duro da Uccidere","Stomaco di Ferro"],"skills":["Atletica","Intimidire","Mischia","Notare","Rissa"]},
        {"name":"Orfano","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo.","advantages":["Aggressione Sconsiderata","Mano Lesta"],"skills":["Atletica","Empatia","Intimidire","Nascondersi","Rissa"]},
        {"name":"Pirata","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che si sacrifica per garantire la libertà di un altro.","advantages":["Mira Letale","Volontà Indomabile"],"skills":["Intimidire","Furto","Mira","Navigazione","Notare"]},
        {"name":"Professore","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che usa la conoscenza di un trattato oscuro per risolvere un problema complesso.","advantages":["Cattedra","Gioco di Squadra"],"skills":["Allettare","Convincere","Empatia","Esibirsi","Istruzione"]},
        {"name":"Pugile","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che getta le armi e si affida ai pugni, a prescindere dall’armamento dell’avversario.","advantages":["Pugilatore","Sguardo di Ghiaccio"],"skills":["Atletica","Convincere","Empatia","Esibirsi","Rissa"]},
        {"name":"Quartiermastro","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che risolve un problema dell’equipaggio.","advantages":["Fatto!","Gambe da Marinaio","Manualità"],"skills":["A.d. Guerra","Mira","Nascondersi","Navigazione","Rissa"]},
        {"name":"Sacerdote","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che lascia da parte la retorica e mette in pratica le virtù che professa.","advantages":["Consacrato","Ispirare Generosità"],"skills":["Allettare","Cavalcare","Empatia","Esibirsi","Istruzione"]},
        {"name":"Servitore","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che si mette in pericolo per assistere qualcuno in un compito difficile.","advantages":["Gioco di Squadra","In Balia degli Eventi"],"skills":["Allettare","Cavalcare","Furto","Nascondersi","Notare"]},
        {"name":"Soldato","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che segue il piano a prescindere dai rischi personali.","advantages":["Bevitore Emerito","Solo Contro Tutti"],"skills":["A.d. Guerra","Intimidire","Mira","Mischia","Notare"]},
        {"name":"Spia","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che corre un grosso rischio per scoprire un segreto.","advantages":["Immunità ai Veleni","Opportunista"],"skills":["Allettare","Empatia","Furto","Nascondersi","Notare"]},
        {"name":"Studioso","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che si metti nei guai per ottenere conoscenza.","advantages":["Linguista","Università"],"skills":["Convincere","Empatia","Esibirsi","Istruzione","Notare"]},
        {"name":"Ufficiale Di Marina","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che antepone i bisogni dell’equipaggio alla missione.","advantages":["Equilibrio Perfetto","Mercanteggiare","Gambe da Marinaio"],"skills":["A.d. Guerra","Intimidire","Mischia","Navigazione","Notare"]},
        {"name":"Agente Unificatore","nation":"Avalon","quirk":"Ottiene un Punto Eroe ogni volta che assicura la stabilità dell’alleanza tra le Isole Incantate.","advantages":["Esperto di Sopravvivenza","Università"],"skills":["Allettare","Empatia","Istruzione","Mira","Notare"]},
        {"name":"Bardo","nation":"Avalon","quirk":"Ottiene un Punto Eroe ogni volta che risolve un problema seguendo l’esempio di una Leggenda.","advantages":["Bevitore Emerito","Mercanteggiare","Virtuoso"],"skills":["Cavalcare","Convincere","Empatia","Esibirsi","Mira"]},
        {"name":"Cavaliere Errante","nation":"Avalon","quirk":"Ottiene un Punto Eroe ogni volta che sostiene un ideale di virtù cavalleresca e finisce nei guai per questo.","advantages":["Senso dell’Orientamento","Stregoneria"],"skills":["A.d. Guerra","Cavalcare","Intimidire","Mischia","Rissa"]},
        {"name":"Corsaro","nation":"Avalon","quirk":"Ottiene un Punto Eroe ogni volta che sconfigge i nemici di Avalon.","advantages":["Equilibrio Perfetto","La Fortuna del Diavolo"],"skills":["Allettare","Furto","Mischia","Navigazione","Notare"]},
        {"name":"Puritano","nation":"Avalon","quirk":"Ottiene un Punto Eroe ogni volta che dimostra la corruzione o ipocrisia.","advantages":["Approccio Dinamico","Fama"],"skills":["Cavalcare","Convincere","Empatia","Intimidire","Istruzione"]},
        {"name":"Alquimista","nation":"Castille","quirk":"Ottiene un Punto Eroe ogni volta che migliora la vita di un altro mediante l’alchimia.","advantages":["Alchimista","Stomaco di Ferro"],"skills":["Allettare","Empatia","Istruzione","Furto","Notare"]},
        {"name":"Antropologo","nation":"Castille","quirk":"Ottiene un Punto Eroe ogni volta che risolve i problemi di un gruppo di stranieri.","advantages":["Linguista","Università"],"skills":["Atletica","Convincere","Empatia","Istruzione","Notare"]},
        {"name":"Diestro","nation":"Castille","quirk":"Ottiene un Punto Eroe ogni volta che sconfigge un duellante addestrato.","advantages":["Schermidore","Sorriso Disarmante"],"skills":["Atletica","Empatia","Intimidire","Istruzione","Mischia"]},
        {"name":"Hexe","nation":"Eisen","quirk":"Ottiene un Punto Eroe ogni volta che ignora ogni altra responsabilità per assicurarsi che i morti riposino in pace.","advantages":["Stomaco di Ferro","Stregoneria"],"skills":["Allettare","Atletica","Intimidire","Mischia","Notare"]},
        {"name":"Mousquetaire","nation":"Montaigne","quirk":"Ottiene un Punto Eroe ogni volta che subisce una grave ferita per proteggere il Re o i suoi camerati.","advantages":["Cameratismo","Riflessi Rapidi"],"skills":["Cavalcare","Intimidire","Mira","Mischia","Notare"]},
        {"name":"Révolutionnaire","nation":"Montaigne","quirk":"Ottiene un Punto Eroe ogni volta che si sacrifica in nome della libertà.","advantages":["Divincolarsi","Gioia di Vivere"],"skills":["Cavalcare","Furto","Nascondersi","Notare","Mischia"]},
        {"name":"Sorcier Porté","nation":"Montaigne","quirk":"Ottiene un Punto Eroe ogni volta che chiude una Blessure creata da un Malvagio.","advantages":["Orologio Biologico","Stregoneria"],"skills":["Allettare","Cavalcare","Empatia","Istruzione","Nascondersi"]},
        {"name":"Ussaro Alato","nation":"Sarmatia","quirk":"Ottiene un Punto Eroe ogni volta che, con il suo destriero, si lancia a testa bassa in uno scontro senza badare ai rischi.","advantages":["Gioco di Squadra","L’Unione Fa la Forza"],"skills":["A.d. Guerra","Cavalcare","Convincere","Mischia","Notare"]},
        {"name":"Baleniere","nation":"Ussura","quirk":"Ottiene un Punto Eroe ogni volta che affronta una creatura tanto grande da poter ingoiare un uomo intero.","advantages":["Bevitore Emerito","Gambe da Marinaio","Mecenate"],"skills":["Atletica","Mischia","Navigazione","Notare","Rissa"]},
        {"name":"Cosacco","nation":"Ussura","quirk":"Ottiene un Punto Eroe ogni volta che abbandona qualcosa di importante per viaggiare più leggero.","advantages":["Aggressione Sconsiderata","Forte Come Dieci Uomini"],"skills":["Cavalcare","Intimidire","Mischia","Notare","Rissa"]},
        {"name":"Progressista","nation":"Ussura","quirk":"Ottiene un Punto Eroe ogni volta che rischia la vita per ottenere una tecnologia avanzata.","advantages":["Contatto","Famiglia Allargata","Manualità"],"skills":["Allettare","Atletica","Cavalcare","Convincere","Empatia"]},
        {"name":"Toccato Da Matushka","nation":"Ussura","quirk":"Ottiene un Punto Eroe ogni volta che dà una lezione a qualcuno in un modo che renderebbe Matushka orgogliosa.","advantages":["Esperto di Sopravvivenza","Stregoneria"],"skills":["Allettare","Atletica","Esibirsi","Furto","Intimidire"]},
        {"name":"Bearsark","nation":"Vestenmennavenjar","quirk":"Ottiene un Punto Eroe ogni volta che lascia che sia il GM a decidere la sua prossima azione.","advantages":["Bevitore Emerito","Duro da Uccidere"],"skills":["A.d. Guerra","Intimidire","Mischia","Navigazione","Rissa"]},
        {"name":"Skald","nation":"Vestenmennavenjar","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta la propria abilità di Seidr per aiutare un altro Eroe.","advantages":["Gambe da Marinaio","Seidr"],"skills":["Esibirsi","Intimidire","Mischia","Navigazione","Rissa"]},
        {"name":"Ambasciatore Itinerante","nation":"Vodacce","quirk":"Ottiene un Punto Eroe ogni volta che usa conoscenze o oggetti non di Théah per risolvere un problema.","advantages":["Linguista","Scuola di Maniere"],"skills":["Allettare","Convincere","Empatia","Intimidire","Navigazione"]},
        {"name":"Bravo","nation":"Vodacce","quirk":"Ottiene un Punto Eroe ogni volta che corre un rischio per proteggere la vita della persona che ha giurato di difendere.","advantages":["Duro da Uccidere","Immunità ai Veleni"],"skills":["Atletica","Empatia","Intimidire","Mischia","Notare"]},
        {"name":"Consigliere","nation":"Vodacce","quirk":"Ottiene un Punto Eroe ogni volta che corre un grosso rischio per proteggere i segreti altrui.","advantages":["Non Siamo Poi Così Diversi","Scafato"],"skills":["Allettare","Cavalcare","Convincere","Empatia","Notare"]},
        {"name":"Strega Della Sorte","nation":"Vodacce","quirk":"Ottiene un Punto Eroe ogni volta che si sottomette a un corso d’azione pericoloso convinta che sia il volere del destino.","advantages":["Orologio Biologico","Stregoneria"],"skills":["Allettare","Cavalcare","Convincere","Esibirsi","Nascondersi"]},
        {"name":"Ufficiale dell'Esercito","nation":"Generale","quirk":"Ottiene un Punto Eroe ogni volta che prende il comando in una situazione di pericolo o estrema violenza.","advantages":["Accademia Militare","Senso dell'Orientamento"],"skills":["A.d. Guerra","Atletica","Cavalcare","Intimidire","Mira"]},
        {"name":"Saoi (Saggio)","nation":"Inismore","quirk":"Ottiene un Punto Eroe ogni volta che si mette in pericolo per proteggere gli artisti di Théah.","advantages":["Bevitore Emerito","Gioco di Squadra","Sorriso Disarmante"],"skills":["Atletica","Convincere","Empatia","Esibirsi","Mischia"]},
        {"name":"Seanchaidh (Poeta-Guerriero)","nation":"Le Marche delle Highland","quirk":"Ottiene un Punto Eroe ogni volta che fa rispettare le antiche leggi del suo popolo.","advantages":["Linguista","Solo Contro Tutti"],"skills":["Cavalcare","Convincere","Esibirsi","Mischia","Notare"]},
        {"name":"Mirabilis (Sacerdote)","nation":"Castille","quirk":"Ottiene un Punto Eroe ogni volta che dà prova dell'amore e della compassione della Chiesa.","advantages":["Consacrato","Lampo di Genio"],"skills":["Cavalcare","Convincere","Empatia","Esibirsi","Istruzione"]},
        {"name":"Krieger (Guerriero)","nation":"Eisen","quirk":"Ottiene un Punto Eroe ogni volta che decide di combattere per difendere gli inermi o prevenire distruzioni.","advantages":["Accademia Militare","Sguardo di Ghiaccio"],"skills":["A.d. Guerra","Atletica","Cavalcare","Mira","Mischia"]},
        {"name":"Ungetümjäger (Cacciatore di Mostri)","nation":"Eisen","quirk":"Ottiene un Punto Eroe ogni volta che si dedica a cacciare una creatura inumana per impedirle di spargere altro male.","advantages":["Non Morirò Qui","Volontà Indomabile"],"skills":["Atletica","Mira","Mischia","Notare","Rissa"]},
        {"name":"Vitalienbruder (Pirata)","nation":"Eisen","quirk":"Ottiene un Punto Eroe ogni volta che ruba ai ricchi per dare ai poveri.","advantages":["Comando","Gambe da Marinaio","Scafato"],"skills":["A.d. Guerra","Furto","Nascondersi","Navigazione","Rissa"]},
        {"name":"L'Ami du Roi (Cortigiano)","nation":"Montaigne","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta il favore del sovrano per risolvere un problema.","advantages":["Amicizie Altolocate","Contatto","Linguista"],"skills":["Allettare","Cavalcare","Convincere","Esibirsi","Mischia"]},
        {"name":"Poseł (Inviato)","nation":"Sarmatia","quirk":"Ottiene un Punto Eroe ogni volta che insiste per una soluzione democratica quando sarebbe vantaggioso non votare.","advantages":["Comando","Scuola di Maniere"],"skills":["Allettare","Convincere","Empatia","Esibirsi","Intimidire"]},
        {"name":"Tremtis (Esule)","nation":"Sarmatia","quirk":"Ottiene un Punto Eroe ogni volta che un elemento del passato torna a perseguitarlo.","advantages":["Contatto","Oriundo","Scafato"],"skills":["Empatia","Furto","Nascondersi","Notare","Rissa"]},
        {"name":"Žynys (Veggente)","nation":"Sarmatia","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta qualcosa di malvagio per compiere il bene.","advantages":["Linguista","Stregoneria"],"skills":["Atletica","Convincere","Esibirsi","Istruzione","Mischia"]},
        {"name":"Guildmästaren","nation":"Vestenmennavenjar","quirk":"Ottiene un Punto Eroe ogni volta che usa le vaste risorse della Lega per qualcosa di più nobile del mero profitto.","advantages":["Mastro Artigiano","Ricco"],"skills":["Allettare","Cavalcare","Convincere","Empatia","Istruzione"]},
        {"name":"Sjørøver (Pirata)","nation":"Vestenmennavenjar","quirk":"Ottiene un Punto Eroe ogni volta che si espone a un pericolo per garantirsi l'onore di sedere alla tavola del Padre di Tutti.","advantages":["Sguardo di Ghiaccio","Ti Porto con Me"],"skills":["Intimidire","Mischia","Navigazione","Notare","Rissa"]}
    ];

    const advantagesDb = [
        {"name": "Bevitore Emerito", "cost": 1, "description": "L’alcol non ha mai effetti negativi sull’Eroe, non importa quanto ne beva."},
        {"name": "Colosso", "cost": 1, "description": "Non cumulabile con 'Minuto'. Ottieni 1 Dado Bonus nei Rischi fisici in cui la mole corporea costituisca un chiaro vantaggio."},
        {"name": "Esperto Di Sopravvivenza", "cost": 1, "description": "In qualsiasi regione selvaggia raccogli o cacci cibo sufficiente per te e altri 5 compagni."},
        {"name": "Gambe Da Marinaio", "cost": 1, "description": "Ottieni 1 Dado Bonus in tutti i Rischi fisici eseguiti a bordo di navi o sartiame."},
        {"name": "Linguista", "cost": 1, "description": "Parli, leggi e scrivi tutte le lingue conosciute di Théah, comprese quelle morte."},
        {"name": "Minuto", "cost": 1, "description": "Non cumulabile con 'Colosso'. Ottieni 1 Dado Bonus nei Rischi in cui la corporatura minuta è un vantaggio per passare inosservato o fuggire."},
        {"name": "Oriundo", "cost": 1, "description": "Cresciuto in una Nazione differente dalla patria: ottieni 1 Dado Bonus nei Rischi legati a tale doppia eredità culturale."},
        {"name": "Orologio Biologico", "cost": 1, "description": "Sai sempre l'ora esatta con lo scarto di un minuto e stimi con precisione albe e tramonti."},
        {"name": "Senso dell’Orientamento", "cost": 1, "description": "Finché hai un punto di riferimento nell'ambiente, non perdi mai la bussola né l'orientamento."},
        {"name": "Stomaco Di Ferro", "cost": 1, "description": "Cibo avariato, acqua stagnante o carne cruda non hanno effetti negativi sul tuo organismo."},
        {"name": "Affascinare", "cost": 2, "description": "Spendi 1 PE: catturi l'attenzione totale di un bersaglio fino al termine della Scena finché interagisci con lui."},
        {"name": "Aggressione Sconsiderata", "cost": 2, "description": "Spendi 1 PE: sconfiggi istantaneamente un'intera Squadra di Sgherri subendo 1 Ferita Drammatica."},
        {"name": "Amicizie Altolocate", "cost": 2, "description": "Spendi 1 PE a un evento mondano: riveli che un tuo carissimo alleato dell'alta società è presente."},
        {"name": "Comando", "cost": 2, "description": "(1 pt se Sarmatiano) Spendi 1 PE: spingi un gruppo a seguire i tuoi ordini se ragionevoli."},
        {"name": "Contatto", "cost": 2, "description": "Hai un informatore o alleato fedele in una fazione o città specifica."},
        {"name": "Divincolarsi", "cost": 2, "description": "Spendi 1 PE: scivoli istantaneamente fuori da manette, corde o legacci."},
        {"name": "Equilibrio Perfetto", "cost": 2, "description": "Spendi 1 PE: ti muovi su cornicioni stretti, corde o muri con agilità impeccabile."},
        {"name": "Fama", "cost": 2, "description": "Ottieni 1 Dado Bonus nei Rischi sociali in cui la tua illustre reputazione incute deferenza o rispetto."},
        {"name": "Famiglia Allargata", "cost": 2, "description": "(1 pt se Ussurano) Spendi 1 PE: riveli che un parente lontano vive nei paraggi e può offrire asilo o risorse."},
        {"name": "Fatto!", "cost": 2, "description": "Spendi 1 PE: scassini una serratura, apri una cassaforte o disinneschi una trappola sul colpo."},
        {"name": "Gioco Di Squadra", "cost": 2, "description": "Spendi 1 Incremento per creare un'Opportunità e 1 secondo per attivarla subito per un compagno."},
        {"name": "Immunità ai Veleni", "cost": 2, "description": "(1 pt se Vodacce) Qualsiasi veleno letale o paralizzante ti causa solo un lieve e momentaneo fastidio."},
        {"name": "Ispirare Generosità", "cost": 2, "description": "Spendi 1 PE: convinci un PNG a donarti o procurarti un oggetto di cui hai urgente bisogno."},
        {"name": "Lavorare Sui Tetti", "cost": 2, "description": "Spendi 1 PE: trovi un varco alternativo sopraelevato per penetrare in un edificio sorvegliato."},
        {"name": "Manualità", "cost": 2, "description": "Spendi 1 PE: ripari provvisoriamente un congegno, nave o arma guasta per l'intera Scena."},
        {"name": "Mercanteggiare", "cost": 2, "description": "(1 pt se Avaloniano) Spendi 1 PE: ottieni sconti vantaggiosi o convinci un mercante a fidarsi ciecamente."},
        {"name": "Psst, Da Questa Parte", "cost": 2, "description": "Spendi 1 PE: da nascosto attiri e stordisci silenziosamente una sentinella nemica."},
        {"name": "Scafato", "cost": 2, "description": "Spendi 1 PE: trovi subito ricettatori, contrabbandieri o informatori nei bassifondi locali."},
        {"name": "Sguardo Di Ghiaccio", "cost": 2, "description": "(1 pt se Eiseniano) Spendi 1 PE: terrorizzi un bersaglio costringendolo a fuggire o cedere il passo."},
        {"name": "Sorriso Disarmante", "cost": 2, "description": "Spendi 1 PE: blocchi un avversario che stava per sguainare la spada, impedendogli di attaccare per primo."},
        {"name": "Spirito Valoroso", "cost": 2, "description": "Cominci ogni sessione di gioco con 2 Punti Eroe invece di 1."},
        {"name": "Sposato Al Mare", "cost": 2, "description": "Disponi di una Nave e l'equipaggio ti riconosce come leader leggendario delle onde."},
        {"name": "Stregoneria", "cost": 2, "description": "Ottieni l'accesso alla Stregoneria del Sangue della tua Nazione nativa."},
        {"name": "Vieni Qui", "cost": 2, "description": "Spendi 1 PE: attiri un PNG in disparte e poi ti dilegui, isolandolo dalla Scena d'Azione."},
        {"name": "Vista d'Aquila", "cost": 2, "description": "Vedi distintamente dettagli microscopici fino a 2 km e ottieni +1 Dado Bonus nei Rischi visivi."},
        {"name": "Volontà Indomabile", "cost": 2, "description": "Spendi 1 PE: annulli e resisti all'istante a un tentativo di intimidazione, seduzione o paura."},
        {"name": "Approccio Dinamico", "cost": 3, "description": "Spendi 1 PE: cambi il tuo Approccio dichiarato durante una Sequenza d'Azione in corso."},
        {"name": "Cameratismo", "cost": 3, "description": "(2 pt se Montaigne) Quando spendi 1 PE per aiutare un compagno, questi riceve 4 dadi bonus anziché 3."},
        {"name": "Cattedra", "cost": 3, "description": "Ottieni asilo e risorse in ogni ateneo accademico e 2 Dadi Bonus nelle dispute intellettuali."},
        {"name": "Cecchino", "cost": 3, "description": "Ottieni 1 Dado Bonus in tutti i Rischi di Mira effettuati con moschetti, archi lunghi o balestre."},
        {"name": "Consacrato", "cost": 3, "description": "(2 pt se Castilliano) Hai preso i sacri voti ecclesiastici: ottieni asilo in chiesa e 2 Dadi Bonus coi devoti."},
        {"name": "In Balia Degli Eventi", "cost": 3, "description": "Il tuo Eroe ottiene una seconda Storia Personale indipendente per sbloccare più avanzamenti."},
        {"name": "Mano Lesta", "cost": 3, "description": "Spendi 1 PE: borseggi o sfili un oggetto a chiunque senza che nessuno possa accorgersene."},
        {"name": "Mano Pesante", "cost": 3, "description": "Ottieni 1 Dado Bonus in Mischia usando claymore, zweihander, alabarde o armi a due mani pesanti."},
        {"name": "Mastro Artigiano", "cost": 3, "description": "(2 pt se Vesten) Sei in grado di forgiare capolavori pregiati o autentici Oggetti Distintivi leggendari."},
        {"name": "Mecenate", "cost": 3, "description": "Un nobile o magnate finanzia le tue imprese: inizi ogni sessione con Ricchezza 1 e appoggi politici."},
        {"name": "Mira Letale", "cost": 3, "description": "Ottieni 1 Dado Bonus nei Rischi di Mira usando pistole a pietra focaia, archibugi o daghe da lancio."},
        {"name": "Oggetto Distintivo", "cost": 3, "description": "Un'arma o reliquia leggendaria: spendi PE per infliggere ferite titaniche o prevenire danni gravi."},
        {"name": "Opportunista", "cost": 3, "description": "Quando un compagno o PNG crea un'Opportunità, spendi 1 PE per trarne beneficio all'istante."},
        {"name": "Pugilatore", "cost": 3, "description": "Ottieni 1 Dado Bonus nei Rischi di Rissa quando combatti a mani nude come un vero lottatore."},
        {"name": "Ricco", "cost": 3, "description": "Inizi ogni sessione con Ricchezza 3 per acquistare navi, carrozze, palazzi o mercenari d'élite."},
        {"name": "Riflessi Rapidi", "cost": 3, "description": "Nell'Abilità scelta calcoli l'iniziativa come se avessi sempre generato 1 Incremento supplementare."},
        {"name": "Rissoso", "cost": 3, "description": "Ottieni 1 Dado Bonus in Rissa impugnando tavoli da locanda, sgabelli, boccali o armi improvvisate."},
        {"name": "Schermidore", "cost": 3, "description": "Ottieni 1 Dado Bonus in Mischia quando impugni stocchi, daghe, fioretti o sciabole da marinaio."},
        {"name": "Un Semplice Malinteso", "cost": 3, "description": "Spendi 1 PE: ritratti un'offesa verbale facendola sembrare il più garbato e raffinato dei complimenti."},
        {"name": "Virtuoso", "cost": 3, "description": "Ottieni 1 Dado Bonus in tutti i Rischi di Esibirsi legati alla tua forma d'arte d'elezione."},
        {"name": "Accademia Militare", "cost": 4, "description": "Aumenti di +1 il risultato di ogni dado tirato con Atletica, Cavalcare e Arte della Guerra."},
        {"name": "Alchimista", "cost": 4, "description": "(Solo Castilliani) Spendi 1 PE per miscelare elisir di potenziamento, fumo accecante o oli scivolosi."},
        {"name": "Compagno Fidato", "cost": 4, "description": "Hai al tuo fianco un devoto alleato PNG (o animale) che agisce con te lanciando 5 dadi nei Rischi."},
        {"name": "Duro Da Uccidere", "cost": 4, "description": "Disponi di un livello extra di salute: diventi Inerme solo alla 5ª Ferita Drammatica anziché alla 4ª."},
        {"name": "Fautore Di Miracoli", "cost": 4, "description": "Spendi 1 PE e 1 Incremento: curi un altro Eroe guarendogli immediatamente 1 Ferita Drammatica."},
        {"name": "Scuola Di Maniere", "cost": 4, "description": "Aumenti di +1 il risultato di ogni dado tirato nei Rischi sociali con Convincere, Intimidire o Allettare."},
        {"name": "Seidr", "cost": 4, "description": "(Solo Vesten) Spendi 1 PE per interrogare le rune con una domanda sì/no o scorgere il vero Nome arcano."},
        {"name": "Solo Contro Tutti", "cost": 4, "description": "Quando subisci danni da una Squadra di Sgherri, sottrai la tua Risolutezza dalle Ferite subite."},
        {"name": "Specialista", "cost": 4, "description": "In una delle tue Abilità a Grado 3+ improvvisi qualsiasi azione senza dover spendere Incrementi extra."},
        {"name": "Tratto Leggendario", "cost": 4, "description": "In un Tratto scelto lanci 1 dado in meno convertendolo in un 10 automatico permanente che esplode."},
        {"name": "Università", "cost": 4, "description": "Aumenti di +1 il risultato di tutti i dadi tirati nei Rischi di Istruzione, Empatia e Notare."},
        {"name": "Forte Come Dieci Uomini", "cost": 5, "description": "(3 pt se Ussurano) Spendi 1 PE in prove di pura forza: sommi Vigore a ciascun dado tirato."},
        {"name": "Joie De Vivre", "cost": 5, "description": "(3 pt se Montaigne) Spendi 1 PE contro un Malvagio: tutti i compagni considerano 10 i dadi <= al proprio Grado."},
        {"name": "L’Unione Fa la Forza", "cost": 5, "description": "(3 pt se Sarmatiano) Spendi 1 PE: trasferisci istantaneamente qualsiasi numero dei tuoi Incrementi a un compagno."},
        {"name": "La Fortuna Del Diavolo", "cost": 5, "description": "(3 pt se Avaloniano) Spendi 1 PE dopo un tiro di Rischio: rilanci tutti i dadi che desideri tenendo il nuovo esito."},
        {"name": "Lampo Di Genio", "cost": 5, "description": "(3 pt se Castilliano) Spendi 1 PE in un campo di studio: ottieni un numero di Incrementi pari al tuo Acume."},
        {"name": "Non Morirò Qui", "cost": 5, "description": "(3 pt se Eiseniano) Spendi 1 PE: ignori ogni penalità delle Ferite Drammatiche per un intero round."},
        {"name": "Non Siamo Poi Tanto Diversi…", "cost": 5, "description": "(3 pt se Vodacce) Spendi 1 PE: convinci un Malvagio di essere suo alleato finché non compi un gesto eroico evidente."},
        {"name": "Sala d’Armi", "cost": 5, "description": "Entri a far parte della Gilda dei Duellanti e apprendi uno Stile di Duello ufficiale di Théah."},
        {"name": "Ti Porto Con Me", "cost": 5, "description": "(3 pt se Vesten) Spendi 1 PE: incrementi i danni inflitti del numero di Ferite Drammatiche che hai subito."}
    ];

    const duelingStylesDb = {
        "Nessuna": {
            name: "Nessuna",
            nation: "Nessuna",
            weapons: "Armi ordinarie",
            maneuver: "Nessuna",
            cost: "-",
            description: "Il personaggio non fa parte della Gilda dei Duellanti e usa lo stile di combattimento ordinario."
        },
        "Aldana": {
            name: "Aldana",
            nation: "Castille",
            weapons: "Spada da scherma in una mano e nulla nell’altra",
            maneuver: "Stratagemma Aldana",
            cost: "1 Incremento",
            description: "Aumenta del tuo Grado di Panache il numero di Ferite inflitte dal prossimo attacco contro l’avversario."
        },
        "Ambrogia": {
            name: "Ambrogia",
            nation: "Vodacce",
            weapons: "Spada da scherma nella sinistra e pugnale nella destra",
            maneuver: "Inganno di Veronica",
            cost: "Passivo / 1 PE",
            description: "Nel Rischio di Mischia puoi usare Grazia o Acume a scelta. Con 1 PE puoi sommare entrambi i Tratti!"
        },
        "Boucher": {
            name: "Boucher",
            nation: "Montaigne",
            weapons: "Coltello o daga da duello in ciascuna mano",
            maneuver: "Passo Boucher",
            cost: "1 Incremento",
            description: "Finta fulminea: il bersaglio deve spendere 1 Incremento supplementare per ogni Manovra di difesa in questo Round."
        },
        "Donovan": {
            name: "Donovan",
            nation: "Avalon",
            weapons: "Spada da scherma e brocchiere robusto",
            maneuver: "Baluardo Donovan",
            cost: "1 Incremento",
            description: "Previeni Ferite pari a Risolutezza + Mischia a te stesso e a un compagno adiacente."
        },
        "Dresden": {
            name: "Dresden",
            nation: "Eisen",
            weapons: "Zweihänder o spadone a due mani",
            maneuver: "Impatto di Eisen",
            cost: "2 Incrementi",
            description: "Infliggi Ferite pari al tuo Vigore + 3 spezzando all'istante la guardia o la parata dell'avversario."
        },
        "Eisenfaust": {
            name: "Eisenfaust",
            nation: "Eisen",
            weapons: "Spada larga nella destra e Panzerhand (guanto d’acciaio) nella sinistra",
            maneuver: "Pugno di Ferro",
            cost: "1 Incremento",
            description: "Disarma l’avversario e infliggi contemporaneamente un numero di Ferite pari al tuo Grado di Vigore."
        },
        "Leegstra": {
            name: "Leegstra",
            nation: "Vestenmennavenjar",
            weapons: "Sciabola pesante d'arrembaggio",
            maneuver: "Forza del Kraken",
            cost: "1 Incremento",
            description: "Ignora la parata ordinaria e somma ai danni il numero di Ferite Drammatiche già subite nel duello."
        },
        "Mantovani": {
            name: "Mantovani",
            nation: "Vodacce",
            weapons: "Spada da scherma e sciarpa di seta piombata",
            maneuver: "Intrigo di Seta",
            cost: "1 Incremento",
            description: "Intrecci e blocchi l'arma dell'avversario: egli non può eseguire Manovre d'attacco nel suo prossimo turno."
        },
        "Marozzo": {
            name: "Marozzo",
            nation: "Vodacce",
            weapons: "Spadone da cavaliere classico",
            maneuver: "Guardia d’Onore",
            cost: "1 Incremento",
            description: "Passaggio istantaneo da offesa a difesa: esegui una Parata gratuita subito dopo un Fendente."
        },
        "Sabat": {
            name: "Sabat",
            nation: "Confederazione Sarmatiana",
            weapons: "Sciabola curva e stivali ferrati con calci acrobatici",
            maneuver: "Danza Cosacca",
            cost: "1 Incremento",
            description: "Ti muovi liberamente nella Scena calpestando gli sgherri e infliggendo Ferite pari a Grazia."
        },
        "Valroux": {
            name: "Valroux",
            nation: "Montaigne",
            weapons: "Stocco d'alta scuola e mano sinistra sfrontata",
            maneuver: "Beffa di Valroux",
            cost: "1 Incremento",
            description: "Sberleffo nobiliare: se l'avversario attacca te, infliggi Ferite pari a Panache prima che il suo colpo vada a segno."
        }
    };

    const arcanaDb = [
        {"arcanum":"Il Matto","virtue":"Scaltro","virtueDesc":"Spendi la Virtù per sfuggire illeso dal pericolo nella Scena in corso.","hubris":"Curioso","hubrisDesc":"Ricevi 1 PE quando investigi su qualcosa di rischioso o pericoloso trascurando la prudenza."},
        {"arcanum":"La Strada","virtue":"Amichevole","virtueDesc":"Quando incontri un PNG per la prima volta, anche un Malvagio, ti tratterà con cordialità per l'intera Scena.","hubris":"Insicuro","hubrisDesc":"Ricevi 1 PE quando rifiuti di agire da solo pretendendo l'aiuto o i dadi di un compagno."},
        {"arcanum":"Il Mago","virtue":"Determinato","virtueDesc":"Fino alla fine della Scena né tu né il Malvagio presente potete spendere Punti Eroe o Punti Pericolo.","hubris":"Ambizioso","hubrisDesc":"Ricevi 1 PE quando ricerchi gloria, prestigio o potere personale mettendoti nei guai."},
        {"arcanum":"Gli Amanti","virtue":"Appassionato","virtueDesc":"Annulli le Ferite subite da un compagno in un singolo colpo prendendo tu 1 Ferita Drammatica.","hubris":"Divisi dal Destino","hubrisDesc":"Ricevi 1 PE quando persegui un amore proibito o complicato dalle circostanze."},
        {"arcanum":"La Ruota","virtue":"Fortunato","virtueDesc":"Raddoppia il numero di Incrementi ottenuti da un lancio di Rischio particolarmente critico.","hubris":"Sfortunato","hubrisDesc":"Ricevi 1 PE quando un imprevisto beffardo vanifica all'improvviso il tuo piano."},
        {"arcanum":"Il Diavolo","virtue":"Astuto","virtueDesc":"Volgi a tuo favore una minaccia o clausola contrattuale con una deduzione brillante.","hubris":"Fiducioso","hubrisDesc":"Ricevi 1 PE quando credi ingenuamente alla parola di una persona manifestamente inaffidabile."},
        {"arcanum":"La Torre","virtue":"Umile","virtueDesc":"Accetti di passare in secondo piano per garantire che la missione collettiva abbia successo.","hubris":"Arrogante","hubrisDesc":"Ricevi 1 PE quando rifiuti di ascoltare consigli sensati credendoti infallibile."},
        {"arcanum":"Il Mendicante","virtue":"Perspicace","virtueDesc":"Intuisci al primo sguardo il desiderio segreto o il punto debole morale di un avversario.","hubris":"Invidioso","hubrisDesc":"Ricevi 1 PE quando pretendi qualcosa che appartiene a un altro per mero orgoglio."},
        {"arcanum":"La Strega","virtue":"Intuitivo","virtueDesc":"Prevedi con precisione la mossa tattica successiva del Malvagio.","hubris":"Manipolatore","hubrisDesc":"Ricevi 1 PE quando inganni un alleato convincendoti che sia a fin di bene."},
        {"arcanum":"La Guerra","virtue":"Vittorioso","virtueDesc":"Disperdi all'istante una Squadra di Sgherri o metti con le spalle al muro un duellante nemico.","hubris":"Leale","hubrisDesc":"Ricevi 1 PE quando metti a repentaglio te stesso pur di non infrangere una promessa."},
        {"arcanum":"L'Impiccato","virtue":"Altruista","virtueDesc":"Interponi il tuo corpo per salvare una vita innocente da una fine sicura.","hubris":"Indeciso","hubrisDesc":"Ricevi 1 PE quando l'esitazione morale ti fa perdere un'opportunità decisiva."},
        {"arcanum":"Le Monete","virtue":"Adattabile","virtueDesc":"Improvvisi una soluzione efficace con risorse ordinarie o denaro sonante.","hubris":"Implacabile","hubrisDesc":"Ricevi 1 PE quando rifiuti categoricamente la resa di un nemico sconfitto."},
        {"arcanum":"I Troni","virtue":"Confortante","virtueDesc":"Ristabilisci il coraggio di tutti i compagni azzerando gli stati di paura o sconforto.","hubris":"Testardo","hubrisDesc":"Ricevi 1 PE quando prosegui a testa bassa su una via fallimentare."},
        {"arcanum":"La Notte Senza Luna","virtue":"Discreto","virtueDesc":"Scompari nelle ombre o mimetizzi le tue tracce in modo del tutto impercettibile.","hubris":"Confuso","hubrisDesc":"Ricevi 1 PE quando dubiti delle tue stesse motivazioni o della lealtà degli amici."},
        {"arcanum":"Il Sole","virtue":"Glorioso","virtueDesc":"Compi un gesto epico che entusiasma una folla intera trasformandola in tuoi alleati.","hubris":"Orgoglioso","hubrisDesc":"Ricevi 1 PE quando un affronto al tuo onore ti spinge a una sfida suicida."},
        {"arcanum":"Il Profeta","virtue":"Illuminato","virtueDesc":"Ricevi una visione rivelatrice sulla verità nascosta dietro una cospirazione.","hubris":"Fanatico","hubrisDesc":"Ricevi 1 PE quando segui i dettami della tua fede o codice morale senza compromessi."},
        {"arcanum":"L’Eroe","virtue":"Coraggioso","virtueDesc":"Affronti una minaccia soverchiante senza arretrare di un solo passo.","hubris":"Avventato","hubrisDesc":"Ricevi 1 PE quando ti getti nella mischia senza un piano né supporto."},
        {"arcanum":"Il Glifo","virtue":"Mite","virtueDesc":"Disinneschi l'ira di un nemico crudele con compostezza e nobiltà d'animo.","hubris":"Superstizioso","hubrisDesc":"Ricevi 1 PE quando modifichi le tue azioni per timore di presagi o maledizioni."},
        {"arcanum":"L’Imperatore","virtue":"Maestoso","virtueDesc":"Imponi il rispetto assoluto a chiunque si trovi al tuo cospetto con la tua sola aura.","hubris":"Testa Calda","hubrisDesc":"Ricevi 1 PE quando reagisci con foga furibonda a una provocazione personale."},
        {"arcanum":"Il Ritrovo","virtue":"Esemplare","virtueDesc":"Indica un altro Eroe: sommate i vostri Incrementi per il Round in una riserva condivisa.","hubris":"Rancoroso","hubrisDesc":"Ricevi 1 PE quando ti metti nei guai rimanendo ancorato a vecchi rancori e cattivi sentimenti."}
    ];

    const sorceriesDb = [
        {
            name: "Hexenwerk",
            nation: "Eisen",
            description: "Unguenti alchemici di Eisen estratti da cadaveri e metalli per combattere e dominare non-morti.",
            powers: [
                { name: "Occhio Spettrale", type: "Maggiore", doses: 1, desc: "Vista astrale: svela spiriti incorporei, nemici invisibili e menzogne." },
                { name: "Camminata Spettrale", type: "Maggiore", doses: 1, desc: "L'anima vola incorporea attraversando pareti e ostacoli fisici." },
                { name: "Lingua di Cadavere", type: "Maggiore", doses: 1, desc: "Poni 2 domande a un cadavere per ogni Grado di Risolutezza posseduto." },
                { name: "Pelle Putrida", type: "Minore", doses: 2, desc: "I non-morti ti considerano loro simile e non ti attaccano mai per primi." },
                { name: "Carne di Pietra", type: "Minore", doses: 2, desc: "Riduce di 2 le Ferite subite dal prossimo attacco fisico nemico." },
                { name: "Lacrime dei Profeti", type: "Minore", doses: 2, desc: "Immunità totale a tossine, gas e veleni per l'intera Scena d'Azione." }
            ]
        },
        {
            name: "Glamour",
            nation: "Avalon",
            description: "La magia leggendaria dei Sidhe di Avalon: incarna i miti di Robin Goodfellow, Jack e Re Elilodd.",
            powers: [
                { name: "Grande Fortuna", type: "Minore", doses: 1, desc: "Somma il Grado al dado: se fa 10 esplode generando 1 Incremento supplementare." },
                { name: "Piccola Fortuna", type: "Minore", doses: 1, desc: "Ritira 1 singolo dado dopo il lancio di Rischio tenendo il miglior esito." },
                { name: "Il Più Forte Che C'è", type: "Maggiore", doses: 1, desc: "Raddoppia il Vigore per sollevare portoni, alberi maestri o massi titanici." },
                { name: "Re Elilodd", type: "Maggiore", doses: 1, desc: "Tutti i compagni nella Scena ricevono +1 Incremento bonus immediato." }
            ]
        },
        {
            name: "Porté",
            nation: "Montaigne",
            description: "Squarcia la trama dello spazio aprendo varchi sanguigni verso l'Urlo interdimensionale.",
            powers: [
                { name: "Saltare il Passaggio", type: "Maggiore", doses: 1, desc: "Teletrasporto istantaneo verso un Marchio di Sangue distante." },
                { name: "Tasca d'Ombra", type: "Minore", doses: 2, desc: "Estrai all'istante dal vuoto un'arma o oggetto precedentemente marchiato." },
                { name: "Lama di Sangue", type: "Minore", doses: 2, desc: "Infliggi 2 Ferite non prevenibili bagnando la lama con l'essenza di Porté." }
            ]
        },
        {
            name: "Sanderis",
            nation: "Sarmatia",
            description: "Patti di sangue con i Dievas sarmatiani per ottenere miracoli in cambio di voti solenni.",
            powers: [
                { name: "Patto della Carne Inviolabile", type: "Maggiore", doses: 1, desc: "Il Dievas assorbe tutte le Ferite subite dal tuo Eroe per un intero Round." },
                { name: "Patto dell'Illusione", type: "Maggiore", doses: 1, desc: "Riscrive completamente le percezioni visive e uditive dei presenti." },
                { name: "Favore dell'Ombra Silenziosa", type: "Minore", doses: 2, desc: "Sopprime ogni calpestio o rumore per muoversi nel silenzio assoluto." }
            ]
        },
        {
            name: "Sorte",
            nation: "Vodacce",
            description: "Le Streghe della Sorte manipolano i fili invisibili del destino che legano ogni vivente.",
            powers: [
                { name: "Spezzare il Filo Vitale", type: "Maggiore", doses: 1, desc: "Recide un legame karmico infliggendo 1 Ferita Drammatica diretta al nemico." },
                { name: "Benedizione del Destino", type: "Maggiore", doses: 1, desc: "Un compagno trasforma tutti i 9 e 10 tirati in 2 Incrementi ciascuno." },
                { name: "Vedere i Fili", type: "Minore", doses: 3, desc: "Riconosce i legami di Amore (Coppe), Odio (Spade) e Fato (Monete)." }
            ]
        },
        {
            name: "Dar Matushki",
            nation: "Ussura",
            description: "La benedizione di Nonna Ussura: mutaforma animale e dominio sul gelo della taiga selvaggia.",
            powers: [
                { name: "Forma di Orso", type: "Maggiore", doses: 1, desc: "Mutazione in un enorme orso bruno ussurano con +3 Vigore e zampate titaniche." },
                { name: "Rigenerazione della Terra", type: "Maggiore", doses: 1, desc: "A contatto con la madre terra guarisci 1 Ferita Drammatica." },
                { name: "Tocco dell'Inverno", type: "Minore", doses: 2, desc: "Congela specchi d'acqua per camminarvi sopra e raffredda lame incandescenti." }
            ]
        }
    ];

    // MODALE CONFERMA SCHEDA VERGINE
    function openBlankSheetModal() {
        const m = document.getElementById('blank-sheet-modal');
        if (m) m.classList.remove('hidden');
    }

    function closeBlankSheetModal() {
        const m = document.getElementById('blank-sheet-modal');
        if (m) m.classList.add('hidden');
    }

    function confirmBlankSheet() {
        closeBlankSheetModal();
        doSetBlankSheet();
        showS7Toast("Scheda azzerata: pronta per la creazione di un nuovo Eroe!", "success");
    }

    // CARICA EROE ESEMPIO COMPLETO (Kasper van Baarle)
    function loadExampleHero() {
        isLocked = false;
        character = {
            name: "Kasper van Baarle",
            nation: "Eisen",
            nationBonusTrait: "Risolutezza",
            concept: "Mercenario Erudito & Cacciatore di Mostri",
            faith: "Obiezione",
            heroPoints: 3,
            duelingStyle: "Eisenfaust",
            sorcery: "Hexenwerk",
            sorceryItems: [
                { name: "Occhio Spettrale", type: "Maggiore", doses: 1, desc: "Vista astrale: svela spiriti incorporei, nemici invisibili e menzogne." },
                { name: "Pelle Putrida", type: "Minore", doses: 2, desc: "I non-morti ti considerano loro simile e non ti attaccano mai per primi." }
            ],
            traits: { "Vigore": 3, "Grazia": 3, "Risolutezza": 4, "Acume": 4, "Panache": 2 },
            skills: {
                "Allettare": 1, "A.d. Guerra": 3, "Atletica": 2, "Cavalcare": 1,
                "Convincere": 2, "Empatia": 1, "Esibirsi": 0, "Furto": 0,
                "Intimidire": 3, "Istruzione": 2, "Mira": 1, "Mischia": 3,
                "Nascondersi": 1, "Navigazione": 0, "Notare": 3, "Rissa": 2
            },
            backgrounds: ["Mercenario", "Cacciatore"],
            bgAppliedSkills: [
                ["Atletica", "Intimidire", "Mischia", "Notare", "Rissa"],
                ["Cavalcare", "Intimidire", "Mira", "Nascondersi", "Notare"]
            ],
            bgAppliedAdvantages: [[], []],
            virtue: "Determinato",
            hubris: "Curioso",
            advantages: [
                { name: "Accademia Militare", cost: 4, desc: "Aumenti di +1 i dadi di Atletica, Cavalcare e Arte della Guerra." },
                { name: "Sala d'Armi", cost: 5, desc: "Membro ufficiale della Gilda dei Duellanti (Eisenfaust)." },
                { name: "Stregoneria", cost: 2, desc: "Conosci le formule di Hexenwerk." },
                { name: "Volontà Indomabile", cost: 2, desc: "Resisti a terrore o manipolazione." }
            ],
            stories: [
                {
                    title: "Vendetta contro l'Ombra di Sieger",
                    goal: "Sconfiggere il Barone Von Sieger e liberare la contea",
                    steps: [
                        { desc: "Trovare la formula per spezzare il Patto dei non-morti", done: true },
                        { desc: "Infiltrarsi nella fortezza di Siegerstein", done: true },
                        { desc: "Duellare contro il Campione delle Tenebre", done: false },
                        { desc: "Purificare la terra consacrata", done: false }
                    ]
                }
            ],
            isAdvanced: true,
            dramaticWounds: [true, false, false, false],
            currentWounds: 2,
            maxWoundsPerThreshold: 5
        };
        selectedTrait = "Grazia";
        selectedSkill = "Mischia";
        isLocked = true;
        syncDropdownsWithCharacter();
        updateLockUI();
        renderSeventhSeaSheet();
        showS7Toast("Eroe esempio 'Kasper van Baarle' caricato con successo!", "info");
    }

    // SCHEDA VERGINE VUOTA PER NUOVO PERSONAGGIO
    function doSetBlankSheet() {
        isLocked = false;
        const startHeroPoints = 2;
        character = {
            name: "Nuovo Eroe",
            nation: "Castille",
            nationBonusTrait: null,
            concept: "Avventuriero Audace",
            faith: "Chiesa del Vaticinio",
            heroPoints: startHeroPoints,
            duelingStyle: "Nessuna",
            sorcery: "Nessuna",
            sorceryItems: [],
            traits: { "Vigore": 2, "Grazia": 2, "Risolutezza": 2, "Acume": 2, "Panache": 2 },
            skills: {
                "Allettare": 0, "A.d. Guerra": 0, "Atletica": 0, "Cavalcare": 0,
                "Convincere": 0, "Empatia": 0, "Esibirsi": 0, "Furto": 0,
                "Intimidire": 0, "Istruzione": 0, "Mira": 0, "Mischia": 0,
                "Nascondersi": 0, "Navigazione": 0, "Notare": 0, "Rissa": 0
            },
            backgrounds: ["Nessuno", "Nessuno"],
            bgAppliedSkills: [[], []],
            bgAppliedAdvantages: [[], []],
            virtue: "Scaltro",
            hubris: "Curioso",
            advantages: [],
            stories: [],
            isAdvanced: false,
            dramaticWounds: [false, false, false, false],
            currentWounds: 0,
            maxWoundsPerThreshold: 5
        };
        selectedTrait = "Vigore";
        selectedSkill = "Mischia";
        syncDropdownsWithCharacter();
        updateLockUI();
        renderSeventhSeaSheet();
    }

    function setBlankSheet(promptConfirm = true) {
        if (promptConfirm) openBlankSheetModal();
        else doSetBlankSheet();
    }

    // TOGGLE LOCK: GESTIONE MODALITA GIOCO COMPATTA VERTICALE VS CREAZIONE
    function toggleLock() {
        isLocked = !isLocked;
        updateLockUI();
        renderSeventhSeaSheet();
    }

    function updateLockUI() {
        const win = document.getElementById('seventh-sea-sheet-window');
        const icon = document.getElementById('lock-icon');
        const text = document.getElementById('lock-text');
        const btn = document.getElementById('lock-btn');
        const wizard = document.getElementById('creation-wizard-panel');
        const traitHint = document.getElementById('trait-mode-hint');
        const skillHint = document.getElementById('skill-mode-hint');
        const addAdvBtnContainer = document.getElementById('add-adv-btn-container');
        const newStoryBtnContainer = document.getElementById('new-story-btn-container');
        const btnExample = document.getElementById('s7-btn-example');
        const btnBlank = document.getElementById('s7-btn-blank');

        if (win) {
            if (isLocked) {
                win.classList.remove('s7-unlocked');
                win.classList.add('s7-locked');
            } else {
                win.classList.remove('s7-locked');
                win.classList.add('s7-unlocked');
            }
        }

        if (isLocked) {
            if (icon) icon.innerText = "🔒";
            if (text) text.innerText = "Bloccata (Gioco)";
            if (btn) btn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow bg-emerald-950/70 border-emerald-600/70 text-emerald-300";
            if (wizard) wizard.classList.add('hidden');
            if (traitHint) traitHint.innerText = "Clicca per Dado";
            if (skillHint) skillHint.innerText = "Clicca per Dado";
            if (addAdvBtnContainer) addAdvBtnContainer.classList.add('hidden');
            if (newStoryBtnContainer) newStoryBtnContainer.classList.add('hidden');
            if (btnExample) btnExample.classList.add('hidden');
            if (btnBlank) btnBlank.classList.add('hidden');
        } else {
            if (icon) icon.innerText = "🔓";
            if (text) text.innerText = "Sbloccata (Creazione)";
            if (btn) btn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow bg-amber-950/70 border-amber-600/70 text-amber-300";
            if (wizard) wizard.classList.remove('hidden');
            if (traitHint) traitHint.innerText = "Clicca pallini";
            if (skillHint) skillHint.innerText = "Clicca pallini";
            if (addAdvBtnContainer) addAdvBtnContainer.classList.remove('hidden');
            if (newStoryBtnContainer) newStoryBtnContainer.classList.remove('hidden');
            if (btnExample) btnExample.classList.remove('hidden');
            if (btnBlank) btnBlank.classList.remove('hidden');
        }
        updateHeroPhaseUI();
    }

    function toggleHeroPhase() {
        character.isAdvanced = !character.isAdvanced;
        updateHeroPhaseUI();
        renderTraits();
        renderSkills();
        updatePoolFormula();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        if (character.isAdvanced) {
            showS7Toast("Modalità <b>Avanzamento Eroe (Campagna)</b> attiva: Cap a 3 rimosso! Tratti e Abilità sbloccati fino a 5.", "success");
        } else {
            showS7Toast("Modalità <b>Creazione Eroe (1° Livello)</b> attiva: Cap massimo a 3 secondo le regole ufficiali.", "info");
        }
    }

    function updateHeroPhaseUI() {
        const icon = document.getElementById('hero-phase-icon');
        const text = document.getElementById('hero-phase-text');
        const btn = document.getElementById('btn-hero-phase');
        const isAdv = !!character.isAdvanced;
        if (icon) icon.innerText = isAdv ? '⚔️' : '🌱';
        if (text) text.innerText = isAdv ? 'Avanzamento (Cap 5)' : 'Creazione (Cap 3)';
        if (btn) {
            btn.className = isAdv
                ? 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all shadow-sm bg-emerald-950/70 border-emerald-500/70 text-emerald-300 hover:bg-emerald-900'
                : 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all shadow-sm bg-[#1c202a] border-[#373f52] text-amber-300 hover:bg-[#282e3c]';
            btn.title = isAdv
                ? 'Fase Avanzamento Eroe in Campagna: Cap a 3 rimosso! Puoi assegnare i Gradi 4 e 5 spendendo gli avanzamenti delle Storie.'
                : 'Fase Creazione Eroe (1° Livello): Cap a 3 attivo su Tratti e Abilità. Clicca per passare all\'Avanzamento in Campagna.';
        }
    }

    function syncDropdownsWithCharacter() {
        const inpName = document.getElementById('inp-hero-name');
        const inpConcept = document.getElementById('inp-hero-concept');
        const selFaith = document.getElementById('sel-faith');
        const inpFaith = document.getElementById('inp-hero-faith');
        const selNation = document.getElementById('sel-nation');
        const selNationTrait = document.getElementById('sel-nation-trait');
        const selStyle = document.getElementById('sel-style');
        const selSorcery = document.getElementById('sel-sorcery');
        const selBg1 = document.getElementById('sel-bg1');
        const selBg2 = document.getElementById('sel-bg2');
        const selVirtue = document.getElementById('sel-virtue');
        const selHubris = document.getElementById('sel-hubris');

        if (inpName) inpName.value = character.name || "";
        if (inpConcept) inpConcept.value = character.concept || "";

        if (selFaith && inpFaith) {
            const curFaith = character.faith || "Chiesa del Vaticinio";
            let found = false;
            for (let opt of selFaith.options) {
                if (opt.value === curFaith) {
                    selFaith.value = curFaith;
                    inpFaith.classList.add('hidden');
                    inpFaith.value = curFaith;
                    found = true;
                    break;
                }
            }
            if (!found) {
                selFaith.value = "custom";
                inpFaith.classList.remove('hidden');
                inpFaith.value = curFaith;
            }
        }

        if (selNation) {
            selNation.value = character.nation || "Castille";
            populateNationTraitsDropdown(character.nation || "Castille");
        }

        if (selNationTrait && character.nationBonusTrait) {
            selNationTrait.value = character.nationBonusTrait;
        }

        if (selStyle) selStyle.value = character.duelingStyle || "Nessuna";
        if (selSorcery) selSorcery.value = character.sorcery || "Nessuna";
        if (selBg1) selBg1.value = (character.backgrounds && character.backgrounds[0]) || "Nessuno";
        if (selBg2) selBg2.value = (character.backgrounds && character.backgrounds[1]) || "Nessuno";
        if (selVirtue) selVirtue.value = character.virtue || "Scaltro";
        if (selHubris) selHubris.value = character.hubris || "Curioso";
    }

    function onNameChange(v) { character.name = v; updateHeroHeader(); }
    function onConceptChange(v) { character.concept = v; updateHeroHeader(); }

    function onFaithSelectChange(v) {
        const inp = document.getElementById('inp-hero-faith');
        if (v === 'custom') {
            if (inp) {
                inp.classList.remove('hidden');
                inp.focus();
                character.faith = inp.value.trim() || "Fede Personalizzata";
            }
        } else {
            if (inp) {
                inp.classList.add('hidden');
                inp.value = v;
            }
            character.faith = v;
        }
        updateHeroHeader();
    }

    function onFaithChange(v) {
        character.faith = v.trim() || "Fede";
        updateHeroHeader();
    }

    function updateHeroHeader() {
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        const t = document.getElementById('hero-title');
        const sub = document.getElementById('hero-subtitle');
        const nb = document.getElementById('hero-nation-badge');
        if (t) t.innerText = character.name || "Nuovo Eroe";
        if (nb) nb.innerText = character.nation || "Castille";
        if (sub) sub.innerText = `${character.concept || 'Avventuriero'} • ${character.faith || 'Fede'} • 7th Sea 2ª Edizione`;
    }

    function switchTab(tabId) {
        document.querySelectorAll('#seventh-sea-sheet-window .tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('#seventh-sea-sheet-window .tab-btn').forEach(el => el.classList.remove('active'));

        const activeTab = document.getElementById(`tab-${tabId}`);
        const activeBtn = document.getElementById(`tab-btn-${tabId}`);
        if (activeTab) activeTab.classList.remove('hidden');
        if (activeBtn) activeBtn.classList.add('active');
    }

    // PASSO 1: SELEZIONE NAZIONE E TRATTO BONUS NAZIONALE (+1 GRATUITO)
    function populateNationTraitsDropdown(nationName) {
        const sel = document.getElementById('sel-nation-trait');
        if (!sel) return;
        sel.innerHTML = '';
        const conf = NATIONS_CONFIG[nationName] || { traits: ["Panache", "Risolutezza"] };
        conf.traits.forEach(tName => {
            const opt = document.createElement('option');
            opt.value = tName;
            opt.innerText = `+1 ${tName}`;
            sel.appendChild(opt);
        });
    }

    function onNationChange(val) {
        character.nation = val;
        populateNationTraitsDropdown(val);
        const conf = NATIONS_CONFIG[val] || { traits: ["Vigore", "Risolutezza"] };
        const defaultBonusTrait = conf.traits[0];
        onNationTraitChange(defaultBonusTrait);
        updateHeroHeader();
        showS7Toast(`Nazione impostata su <b>${val}</b> (+1 ${defaultBonusTrait})`, "info");
    }

    function onNationTraitChange(newTrait) {
        if (!character.traits) character.traits = { Vigore: 2, Grazia: 2, Risolutezza: 2, Acume: 2, Panache: 2 };
        const oldTrait = character.nationBonusTrait;
        if (oldTrait && oldTrait !== newTrait && character.traits[oldTrait]) {
            character.traits[oldTrait] = Math.max(2, character.traits[oldTrait] - 1);
        }
        character.nationBonusTrait = newTrait;
        character.traits[newTrait] = (character.traits[newTrait] || 2) + 1;

        const sel = document.getElementById('sel-nation-trait');
        if (sel) sel.value = newTrait;

        renderTraits();
        updatePoolFormula();
    }

    // PASSO 2: APPLICAZIONE AUTOMATICA DEI 2 BACKGROUND (+1 A 5 ABILITA, VANTAGGI GRATUITI, SBLOCCO STREGONERIA/DUELLO)
    function onBgChange(idx, val) {
        if (!character.backgrounds) character.backgrounds = ["Nessuno", "Nessuno"];
        if (!character.bgAppliedSkills) character.bgAppliedSkills = [[], []];
        if (!character.bgAppliedAdvantages) character.bgAppliedAdvantages = [[], []];

        // 1. Rimuovi i benefici precedentemente applicati dallo slot idx
        if (Array.isArray(character.bgAppliedSkills[idx])) {
            character.bgAppliedSkills[idx].forEach(skName => {
                if (character.skills && character.skills[skName]) {
                    character.skills[skName] = Math.max(0, character.skills[skName] - 1);
                }
            });
        }
        character.bgAppliedSkills[idx] = [];

        // Rimuovi vantaggi concessi dallo slot idx
        if (Array.isArray(character.advantages)) {
            character.advantages = character.advantages.filter(a => a.fromBgSlot !== idx);
        }

        character.backgrounds[idx] = val;

        const bg = backgroundsDb.find(b => b.name.toLowerCase() === val.toLowerCase());
        const summaryEl = document.getElementById(`bg${idx + 1}-summary`);

        if (bg) {
            // 2. Applica +1 a ognuna delle 5 abilità
            bg.skills.forEach(sName => {
                const normSkill = sName === "Arte della Guerra" ? "A.d. Guerra" : sName;
                if (character.skills[normSkill] !== undefined) {
                    character.skills[normSkill] = Math.min(5, (character.skills[normSkill] || 0) + 1);
                    character.bgAppliedSkills[idx].push(normSkill);
                }
            });

            // 3. Assegna i Vantaggi gratuiti associati (costo 0 pt di creazione)
            bg.advantages.forEach(advName => {
                const catalogAdv = advantagesDb.find(a => a.name.toLowerCase() === advName.toLowerCase());
                const advObj = {
                    name: advName,
                    cost: 0,
                    fromBgSlot: idx,
                    fromBgName: bg.name,
                    desc: catalogAdv ? catalogAdv.description : `Vantaggio conferito dal Background ${bg.name}.`
                };
                character.advantages.push(advObj);

                // Auto-sblocco Stregoneria se conferito dal background
                if (advName.toLowerCase().includes("stregoneria") && (!character.sorcery || character.sorcery === "Nessuna")) {
                    const natSorc = (NATIONS_CONFIG[character.nation] && NATIONS_CONFIG[character.nation].sorcery) || "Nessuna";
                    if (natSorc !== "Nessuna") onSorceryChange(natSorc);
                }

                // Auto-sblocco Scuola di Scherma se conferito dal background
                if ((advName.toLowerCase().includes("sala d’armi") || advName.toLowerCase().includes("sala d'armi") || advName.toLowerCase().includes("schermidore")) && (!character.duelingStyle || character.duelingStyle === "Nessuna")) {
                    const foundStyle = Object.values(duelingStylesDb).find(s => s.nation && s.nation.toLowerCase().includes(character.nation.toLowerCase()));
                    if (foundStyle) onStyleChange(foundStyle.name);
                }
            });

            if (summaryEl) {
                summaryEl.innerText = `+1 a: ${character.bgAppliedSkills[idx].join(', ')} • ${bg.advantages.join(', ')}`;
                summaryEl.title = `Peculiarità: ${bg.quirk}`;
            }
        } else {
            if (summaryEl) summaryEl.innerText = '';
        }

        updateBgDisplays();
        renderSkills();
        renderAdvantages();
        updatePoolFormula();
        updateCreationTrackers();
        if (bg) showS7Toast(`${idx + 1}° Background applicato: <b>${bg.name}</b> (+1 alle sue 5 Abilità & Vantaggi Gratuiti)`, "success");
    }

    function updateBgDisplays() {
        const d1 = document.getElementById('bg-display-1');
        const d2 = document.getElementById('bg-display-2');
        const bg1Name = (character.backgrounds && character.backgrounds[0]) || "Nessuno";
        const bg2Name = (character.backgrounds && character.backgrounds[1]) || "Nessuno";
        const bg1 = backgroundsDb.find(b => b.name.toLowerCase() === bg1Name.toLowerCase());
        const bg2 = backgroundsDb.find(b => b.name.toLowerCase() === bg2Name.toLowerCase());

        if (d1) d1.innerHTML = `<b class="text-white">1° ${bg1Name} (${bg1 ? bg1.nation : 'Generale'}):</b><p class="text-gray-300 text-xs mt-1 leading-relaxed">${bg1 ? bg1.quirk : 'Nessuna peculiarità selezionata.'}</p>`;
        if (d2) d2.innerHTML = `<b class="text-white">2° ${bg2Name} (${bg2 ? bg2.nation : 'Generale'}):</b><p class="text-gray-300 text-xs mt-1 leading-relaxed">${bg2 ? bg2.quirk : 'Nessuna peculiarità selezionata.'}</p>`;
    }

    function onStyleChange(val) {
        character.duelingStyle = val;
        renderDuelingStyle();
        const sel = document.getElementById('sel-style');
        if (sel) sel.value = val;
    }

    function onSorceryChange(val) {
        character.sorcery = val;
        const currentSorc = sorceriesDb.find(s => s.name.toLowerCase().includes(val.toLowerCase()) || val.toLowerCase().includes(s.name.toLowerCase()));
        if (currentSorc && currentSorc.powers && currentSorc.powers.length > 0) {
            character.sorceryItems = currentSorc.powers.slice(0, 2).map(p => ({
                name: p.name,
                type: p.type,
                doses: p.doses || 1,
                desc: p.desc
            }));
        } else {
            character.sorceryItems = [];
        }
        const sel = document.getElementById('sel-sorcery');
        if (sel) sel.value = val;
        renderSorcery();
    }

    function onVirtueChange(val) {
        character.virtue = val;
        const arc = arcanaDb.find(a => a.virtue === val);
        const nameEl = document.getElementById('virtue-display-name');
        const descEl = document.getElementById('virtue-display-desc');
        if (nameEl) nameEl.innerText = val;
        if (descEl && arc) descEl.innerText = arc.virtueDesc || `Dall'Arcano ${arc.arcanum}.`;
    }

    function onHubrisChange(val) {
        character.hubris = val;
        const arc = arcanaDb.find(a => a.hubris === val);
        const nameEl = document.getElementById('hubris-display-name');
        const descEl = document.getElementById('hubris-display-desc');
        if (nameEl) nameEl.innerText = val;
        if (descEl && arc) descEl.innerText = arc.hubrisDesc || `Dall'Arcano ${arc.arcanum}.`;
    }

    // CALCOLO PUNTI CREAZIONE REAL-TIME
    function updateCreationTrackers() {
        let traitPointsSpent = 0;
        const bonusNat = character.nationBonusTrait;
        Object.entries(character.traits || {}).forEach(([tKey, v]) => {
            const base = (tKey === bonusNat) ? 3 : 2;
            if (v > base) traitPointsSpent += (v - base);
        });
        const cntTraits = document.getElementById('cnt-traits');
        if (cntTraits) {
            cntTraits.innerText = `${traitPointsSpent} / 2`;
            cntTraits.className = traitPointsSpent > 2 ? 'text-red-400 font-black' : 'text-amber-400 font-bold';
        }

        // Punti abilità libere (le 5 abilità di ciascun background sono gratis)
        let totalSkillRanks = 0;
        Object.values(character.skills || {}).forEach(v => { totalSkillRanks += v; });
        const bgSkillsCount = (character.bgAppliedSkills && character.bgAppliedSkills[0] ? character.bgAppliedSkills[0].length : 0) +
                              (character.bgAppliedSkills && character.bgAppliedSkills[1] ? character.bgAppliedSkills[1].length : 0);
        const freeSkillPointsSpent = Math.max(0, totalSkillRanks - bgSkillsCount);
        const cntSkills = document.getElementById('cnt-skills');
        if (cntSkills) {
            cntSkills.innerText = `${freeSkillPointsSpent} / 10`;
            cntSkills.className = freeSkillPointsSpent > 10 ? 'text-red-400 font-black' : 'text-amber-400 font-bold';
        }

        // Vantaggi spesi (esclusi quelli gratuiti da background)
        let advPointsSpent = 0;
        (character.advantages || []).forEach(a => {
            if (a.cost && !a.fromBgName) advPointsSpent += a.cost;
        });
        const cntAdv = document.getElementById('cnt-adv');
        if (cntAdv) cntAdv.innerText = advPointsSpent + " pt";
    }

    // GESTIONE TOGGLE DADI BONUS CONTESTUALI PER VANTAGGI (SPAZIO CERCHIATO IN ROSSO)
    let activeAdvToggles = {};

    function toggleBonusAdvDie(advName) {
        activeAdvToggles[advName] = !activeAdvToggles[advName];
        updatePoolFormula();
    }

    function getActiveAdvantageBonusDice() {
        if (!window.seventhSeaRules || typeof window.seventhSeaRules.getApplicableBonusAdvantages !== 'function') return 0;
        const applicable = window.seventhSeaRules.getApplicableBonusAdvantages(selectedTrait, selectedSkill, character);
        let bonus = 0;
        applicable.forEach(adv => {
            if (activeAdvToggles[adv.name] === true) {
                bonus += (adv.bonus || 1);
            }
        });
        return bonus;
    }

    function renderAdvantageToggles() {
        const container = document.getElementById('risk-advantage-toggles');
        if (!container) return;
        container.innerHTML = '';

        if (!window.seventhSeaRules) return;

        // 1. Badge Istituto Accademico (+1 ai Dadi)
        const activeInst = (typeof window.seventhSeaRules.getActiveInstitute === 'function')
            ? window.seventhSeaRules.getActiveInstitute(selectedSkill, character)
            : null;
        if (activeInst) {
            const b = document.createElement('span');
            b.className = 's7-adv-badge-institute';
            b.title = `Vantaggio ${activeInst.name}: Aumenti di +1 il risultato di ciascun dado tirato con ${activeInst.skills.join(', ')}.`;
            b.innerHTML = `<span>${activeInst.icon}</span> <span>${activeInst.label}</span>`;
            container.appendChild(b);
        }

        // 2. Toggle Dadi Bonus Contestuali (Schermidore, Cecchino, Pugilatore, Virtuoso, ecc.)
        const applicable = (typeof window.seventhSeaRules.getApplicableBonusAdvantages === 'function')
            ? window.seventhSeaRules.getApplicableBonusAdvantages(selectedTrait, selectedSkill, character)
            : [];

        applicable.forEach(adv => {
            if (activeAdvToggles[adv.name] === undefined) {
                activeAdvToggles[adv.name] = false;
            }
            const isActive = !!activeAdvToggles[adv.name];
            const pill = document.createElement('div');
            pill.className = `s7-adv-toggle ${isActive ? 'active' : ''}`;
            pill.title = `Clicca per ${isActive ? 'disattivare' : 'attivare'} il dado bonus di ${adv.name}`;
            pill.onclick = () => toggleBonusAdvDie(adv.name);
            pill.innerHTML = `<span>${adv.icon}</span> <span>${adv.label}</span>`;
            container.appendChild(pill);
        });
    }

    // RENDER TRATTI (NESSUN BADGE INGOMBRANTE IN TIRO: ICONA 🎲 DORATA & PALLINI PROTETTI)
    function renderTraits() {
        const container = document.getElementById('traits-list');
        if (!container) return;
        container.innerHTML = '';

        const traitIcons = { "Vigore": "💪", "Grazia": "🏃", "Risolutezza": "🛡️", "Acume": "🧠", "Panache": "🦚" };
        const natBonus = character.nationBonusTrait;
        const isCreationPhase = !character.isAdvanced;

        Object.entries(character.traits).forEach(([trait, val]) => {
            const isSelected = selectedTrait === trait;
            const isNatBonus = trait === natBonus;
            const row = document.createElement('div');
            row.className = `flex items-center justify-between py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                isSelected ? 'bg-amber-500/20 border border-amber-400/60 shadow-sm' : 'bg-[#12141a] hover:bg-[#1b1f2a] border border-transparent'
            }`;

            row.onclick = () => selectTrait(trait);

            let dotsHtml = '<div class="s7-dots-row" onclick="event.stopPropagation()">';
            for (let i = 1; i <= 5; i++) {
                const filled = i <= val;
                const isCreationLocked = (isCreationPhase && i > 3);
                const clickHandler = isLocked ? '' : `onclick="setTrait('${trait}', ${i})"`;
                const cursorClass = isLocked ? 'cursor-default' : (isCreationLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-115');
                const lockClass = isCreationLocked ? ' creation-locked' : '';
                const lockTitle = isCreationLocked ? 'Bloccato alla Creazione (Max 3). Si sblocca in Campagna con le Storie.' : (isLocked ? '' : 'Imposta ' + i);

                dotsHtml += `<div ${clickHandler} class="dot ${filled ? 'filled' : ''} ${cursorClass}${lockClass}" title="${lockTitle}"></div>`;
            }
            dotsHtml += '</div>';

            row.innerHTML = `
                <div class="s7-row-label">
                    <span class="text-sm">${isSelected ? '🎲' : (traitIcons[trait] || '🔹')}</span>
                    <span class="text-xs md:text-sm font-bold ${isSelected ? 'text-amber-300' : 'text-gray-200'}">${trait}</span>
                    ${isNatBonus ? '<span class="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-800" title="Bonus Nazione">+1 Naz.</span>' : ''}
                </div>
                ${dotsHtml}
            `;
            container.appendChild(row);
        });
        updateCreationTrackers();
    }

    // RENDER ABILITA (IN 2 COLONNE COMPATTE, ZERO TESTO A CAPO, PALLINI PROTETTI IN S7-DOTS-ROW)
    function renderSkills() {
        const container = document.getElementById('skills-list');
        if (!container) return;
        container.innerHTML = '';

        const isCreationPhase = !character.isAdvanced;

        Object.entries(character.skills).forEach(([skill, val]) => {
            const isSelected = selectedSkill === skill;
            const row = document.createElement('div');
            row.className = `flex items-center justify-between py-1 px-2.5 rounded-lg transition-all cursor-pointer ${
                isSelected ? 'bg-amber-500/20 border border-amber-400/60 shadow-sm' : 'bg-[#12141a] hover:bg-[#1b1f2a] border border-transparent'
            }`;

            row.onclick = () => selectSkill(skill);

            let perksBadge = '';
            if (val >= 5) perksBadge = '<span class="s7-mastery-badge s7-mastery-badge-5" title="Grado 5: I 10 Esplodono a catena (+1d10) + Insiemi da 15 = 2 Incr. + Ritiro 1 Dado">💥 G5</span>';
            else if (val >= 4) perksBadge = '<span class="s7-mastery-badge s7-mastery-badge-4" title="Grado 4: Insiemi da 15 valgono 2 Incrementi + Ritiro 1 Dado">⭐ G4</span>';
            else if (val >= 3) perksBadge = '<span class="s7-mastery-badge s7-mastery-badge-3" title="Grado 3: Ritiro di 1 dado a scelta">🔄 G3</span>';

            let dotsHtml = '<div class="s7-dots-row" onclick="event.stopPropagation()">';
            for (let i = 1; i <= 5; i++) {
                const filled = i <= val;
                const isCreationLocked = (isCreationPhase && i > 3);
                const clickHandler = isLocked ? '' : `onclick="setSkill('${skill}', ${i})"`;
                const cursorClass = isLocked ? 'cursor-default' : (isCreationLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-115');
                const lockClass = isCreationLocked ? ' creation-locked' : '';
                const lockTitle = isCreationLocked ? 'Grado 4/5 bloccato alla Creazione (Max 3). Si sblocca in Campagna con le Storie.' : (isLocked ? '' : 'Imposta ' + i);

                dotsHtml += `<div ${clickHandler} class="dot ${filled ? 'filled' : ''} ${cursorClass}${lockClass}" title="${lockTitle}"></div>`;
            }
            dotsHtml += '</div>';

            row.innerHTML = `
                <div class="s7-row-label">
                    ${isSelected ? '<span class="text-amber-400 text-xs">🎲</span>' : ''}
                    <span class="text-xs truncate ${isSelected ? 'text-amber-300 font-bold' : 'text-gray-300 font-medium'}">${skill}</span>
                    ${perksBadge}
                </div>
                ${dotsHtml}
            `;
            container.appendChild(row);
        });
        updateCreationTrackers();
    }

    function selectTrait(name) { selectedTrait = name; renderTraits(); updatePoolFormula(); }
    function selectSkill(name) { selectedSkill = name; renderSkills(); updatePoolFormula(); }

    function setTrait(name, val) {
        if (isLocked) return;
        const minVal = (name === character.nationBonusTrait) ? 3 : 2;
        if (!character.isAdvanced && val > 3) {
            showS7Toast("Regola 7th Sea: Durante la Creazione dell'Eroe (1° Livello), nessun Tratto può superare 3. I valori 4 e 5 si sbloccano in Campagna con le Storie!", "warning");
            return;
        }
        character.traits[name] = (character.traits[name] === val && val > minVal) ? val - 1 : Math.max(minVal, val);
        renderTraits();
        updatePoolFormula();
    }

    function setSkill(name, val) {
        if (isLocked) return;
        if (!character.isAdvanced && val > 3) {
            showS7Toast("Regola 7th Sea: Durante la Creazione dell'Eroe (1° Livello), nessuna Abilità può superare il Grado 3. I Gradi 4 e 5 si sbloccano in Campagna con le Storie!", "warning");
            return;
        }
        character.skills[name] = (character.skills[name] === val) ? val - 1 : val;
        renderSkills();
        updatePoolFormula();
    }

    function updatePoolFormula() {
        const tVal = (character.traits && character.traits[selectedTrait]) || 2;
        const sVal = (character.skills && character.skills[selectedSkill]) || 0;
        const bonusDie = (character.dramaticWounds && character.dramaticWounds[0]) ? 1 : 0;
        const advBonus = getActiveAdvantageBonusDice();
        const total = tVal + sVal + bonusDie + advBonus;
        const descEl = document.getElementById('pool-formula-desc');
        if (descEl) {
            let text = `${selectedTrait} (${tVal}) + ${selectedSkill} (${sVal})`;
            if (bonusDie > 0) text += ` + 1 FD`;
            if (advBonus > 0) text += ` + ${advBonus} Vant.`;
            text += ` = ${total} d10`;

            const perks = [];
            if (sVal >= 5 || (character.dramaticWounds && character.dramaticWounds[2])) perks.push("💥 10 Esplodono");
            if (sVal >= 4) perks.push("⭐ 15=2 Incr.");
            if (sVal >= 3) perks.push("🔄 Ritiro 1 Dado");

            const activeInst = (window.seventhSeaRules && typeof window.seventhSeaRules.getActiveInstitute === 'function')
                ? window.seventhSeaRules.getActiveInstitute(selectedSkill, character)
                : null;
            if (activeInst) {
                perks.push(`${activeInst.icon} +1 a tutti i dadi`);
            }

            if (perks.length > 0) {
                text += ` • <span class="text-amber-300 font-bold">${perks.join(' • ')}</span>`;
                descEl.innerHTML = text;
            } else {
                descEl.innerText = text;
            }
        }
        renderAdvantageToggles();
    }

    // RENDER SCUOLA DI SCHERMA (DUELLI)
    function renderDuelingStyle() {
        const styleName = character.duelingStyle || "Nessuna";
        const style = duelingStylesDb[styleName] || duelingStylesDb["Nessuna"];
        const titleEl = document.getElementById('dueling-style-title');
        const weaponsEl = document.getElementById('dueling-weapons-desc');
        const costEl = document.getElementById('dueling-cost-badge');
        const detailsEl = document.getElementById('dueling-details-content');

        if (titleEl) titleEl.innerText = `Scuola di Scherma: ${style.name}`;
        if (weaponsEl) weaponsEl.innerHTML = `<b>Armi:</b> ${style.weapons || 'Nessuna'} • <b>Nazione:</b> ${style.nation || '-'}`;
        if (costEl) costEl.innerText = style.cost || '5 Punti';

        if (detailsEl) {
            if (styleName === "Nessuna") {
                detailsEl.innerHTML = `
                    <div class="bg-[#12141a] p-3 rounded-xl border border-[#252a35]">
                        <p class="text-gray-400 italic text-xs">Il personaggio non fa parte della Gilda dei Duellanti. Combatte usando Mischia o Rissa secondo le normali regole d'Azione.</p>
                        ${!isLocked ? '<p class="text-amber-400 text-xs mt-1.5 font-medium">💡 Sblocca la scheda e seleziona una Scuola di Scherma nel menu in alto per unirti alla Gilda dei Duellanti.</p>' : ''}
                    </div>
                `;
            } else {
                detailsEl.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="bg-[#12141a] p-3 rounded-xl border border-[#252a35] space-y-1">
                            <b class="text-amber-400 uppercase text-xs tracking-wider block">Manovra Speciale:</b>
                            <p class="text-amber-200 font-bold text-xs">${style.maneuver || 'Nessuna'}</p>
                            <p class="text-gray-300 text-xs leading-relaxed pt-1">${style.description || ''}</p>
                        </div>
                        <div class="bg-[#12141a] p-3 rounded-xl border border-[#252a35] space-y-1">
                            <b class="text-amber-400 uppercase text-xs tracking-wider block">Privilegi della Gilda:</b>
                            <ul class="text-gray-300 text-xs list-disc list-inside space-y-1">
                                <li>Manovre Base: Affondo, Finta, Parata, Ripulita.</li>
                                <li>Generi 1 Incremento bonus spendibile solo in Manovre di Scherma.</li>
                                <li>Riconoscimento e rispetto presso tutti i gentiluomini di Théah.</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        }
    }

    // RENDER VANTAGGI
    function renderAdvantages() {
        const container = document.getElementById('advantages-list-container');
        const totalPointsEl = document.getElementById('total-advantage-points');
        if (!container) return;
        container.innerHTML = '';

        let totalPts = 0;
        (character.advantages || []).forEach((adv, idx) => {
            if (adv.cost && !adv.fromBgName) totalPts += adv.cost;
            const card = document.createElement('div');
            card.className = 'bg-[#151722] border border-[#2c3242] p-3 rounded-xl space-y-1.5';

            const deleteBtn = isLocked ? '' : `
                <button onclick="removeAdvantage(${idx})" class="text-red-400 hover:text-red-300 text-xs font-bold float-right ml-1" title="Rimuovi Vantaggio">🗑️</button>
            `;

            const bgBadge = adv.fromBgName ? `<span class="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.2 rounded font-bold mr-1">BG</span>` : '';
            const costBadge = adv.fromBgName ? `<span class="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-bold">Gratuito</span>` : `<span class="text-xs bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold">${adv.cost || 0} pt</span>`;

            const descText = adv.desc || adv.description || '';
            const canSpendPE = /spendi\s+1\s+pe/i.test(descText) || /spend\s+1\s+hero\s+point/i.test(descText) || (adv.name && adv.name.toLowerCase().includes('aggressione sconsiderata'));
            const activateBtn = canSpendPE ? `
                <button onclick="activateAdvantageEffect(${idx})" class="w-full mt-2 py-1 px-2.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs shadow-md transition transform active:scale-95 flex items-center justify-center gap-1.5" title="Consuma 1 Punto Eroe per attivare questo effetto speciale">
                    <span>⚡</span> Spendi 1 PE: Attiva
                </button>
            ` : '';

            card.innerHTML = `
                <div class="flex items-center justify-between border-b border-[#242938] pb-1.5">
                    <div class="flex items-center gap-1 min-w-0">
                        ${bgBadge}
                        <b class="text-xs md:text-sm text-amber-300 truncate">${adv.name}</b>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                        ${costBadge}
                        ${deleteBtn}
                    </div>
                </div>
                <p class="text-gray-300 text-xs leading-relaxed">${descText}</p>
                ${activateBtn}
            `;
            container.appendChild(card);
        });

        if (totalPointsEl) totalPointsEl.innerText = totalPts;
        updateCreationTrackers();
    }

    function activateAdvantageEffect(idx) {
        if (!character.advantages || !character.advantages[idx]) return;
        const adv = character.advantages[idx];
        const curPE = parseInt(character.heroPoints) || 0;
        if (curPE < 1) {
            showS7Toast(`Punti Eroe insufficienti! Ti serve 1 PE per attivare <b>${adv.name}</b>.`, "error");
            return;
        }

        // Spende 1 PE
        changeHeroPoints(-1);

        let extraMsg = '';
        if (adv.name.toLowerCase().includes('aggressione sconsiderata')) {
            addWound(5);
            extraMsg = 'Subisce 5 Ferite immediate per sferrare un attacco devastante!';
        }

        if (window.seventhSeaRules && typeof window.seventhSeaRules.broadcastAdvantageActivationToVttChat === 'function') {
            window.seventhSeaRules.broadcastAdvantageActivationToVttChat(character.name || 'Eroe', adv, extraMsg);
        }

        showS7Toast(`⚡ Vantaggio <b>${adv.name}</b> attivato (-1 PE)! ${extraMsg}`, "success");
    }

    // GESTIONE AGGIUNTA VANTAGGIO (CATALOGO O CUSTOM)
    function toggleAddAdvantagePanel() {
        const p = document.getElementById('add-advantage-panel');
        if (p) p.classList.toggle('hidden');
    }

    function toggleAdvSourceType(type) {
        const catRow = document.getElementById('adv-catalog-row');
        const cusRow = document.getElementById('adv-custom-row');
        if (type === 'custom') {
            if (catRow) catRow.classList.add('hidden');
            if (cusRow) cusRow.classList.remove('hidden');
        } else {
            if (cusRow) cusRow.classList.add('hidden');
            if (catRow) catRow.classList.remove('hidden');
        }
    }

    function confirmAddAdvantage() {
        const sel = document.getElementById('sel-new-adv');
        if (!sel) return;
        const found = advantagesDb.find(a => a.name === sel.value);
        if (found) {
            if (character.advantages.some(a => a.name.toLowerCase() === found.name.toLowerCase())) {
                showS7Toast("L'Eroe possiede già questo Vantaggio!", "error");
                return;
            }
            character.advantages.push({
                name: found.name,
                cost: found.cost,
                desc: found.description
            });
            renderAdvantages();
            renderDramaticWoundsGrid();
            updateDramaticWoundsUI();
            updatePoolFormula();
            if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
            toggleAddAdvantagePanel();
            showS7Toast(`Vantaggio <b>${found.name}</b> aggiunto!`, "success");
        }
    }

    function confirmAddCustomAdvantage() {
        const nameEl = document.getElementById('inp-custom-adv-name');
        const costEl = document.getElementById('inp-custom-adv-cost');
        const descEl = document.getElementById('inp-custom-adv-desc');
        if (!nameEl || !nameEl.value.trim()) {
            showS7Toast("Specifica il nome del Vantaggio personalizzato!", "error");
            return;
        }
        const customAdv = {
            name: nameEl.value.trim(),
            cost: Math.max(0, parseInt(costEl.value) || 0),
            desc: descEl ? descEl.value.trim() : "Vantaggio personalizzato."
        };
        character.advantages.push(customAdv);
        nameEl.value = '';
        if (descEl) descEl.value = '';
        renderAdvantages();
        renderDramaticWoundsGrid();
        updateDramaticWoundsUI();
        updatePoolFormula();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        toggleAddAdvantagePanel();
        showS7Toast(`Vantaggio personalizzato <b>${customAdv.name}</b> creato!`, "success");
    }

    function removeAdvantage(idx) {
        if (!character.advantages) return;
        const removed = character.advantages.splice(idx, 1);
        renderAdvantages();
        renderDramaticWoundsGrid();
        updateDramaticWoundsUI();
        updatePoolFormula();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        if (removed && removed[0]) showS7Toast(`Vantaggio '${removed[0].name}' rimosso.`, "info");
    }

    // RENDER STREGONERIA (SE NESSUNA, SCOMPARE AL 100% IN MODALITA GIOCO!)
    function renderSorcery() {
        const container = document.getElementById('sorcery-container');
        if (!container) return;

        if (!character.sorcery || character.sorcery === "Nessuna") {
            if (isLocked) {
                container.innerHTML = '';
            } else {
                container.innerHTML = `
                    <div class="sheet-card rounded-xl p-3.5 text-center border-purple-500/20 bg-[#12131b]">
                        <p class="text-purple-300 text-xs font-bold">🧪 Stregoneria Non Attiva</p>
                        <p class="text-gray-400 text-xs mt-1">Se il tuo eroe ha sangue magico, seleziona una Stregoneria (Hexenwerk, Glamour, Porté, Sanderis, Sorte, Dar Matushki) nel pannello di creazione in alto.</p>
                    </div>
                `;
            }
            return;
        }

        let itemsHtml = '';
        (character.sorceryItems || []).forEach((item, idx) => {
            const removeBtn = isLocked ? '' : `<button onclick="removeSorceryItem(${idx})" class="text-red-400 hover:text-red-300 text-xs font-bold ml-1.5">🗑️</button>`;
            const doseBtns = isLocked ? `Dosi: ${item.doses}` : `
                <button onclick="changeSorceryDose(${idx}, -1)" class="w-5 h-5 rounded bg-[#2c243c] hover:bg-[#3f3258] text-purple-300 font-bold text-xs flex items-center justify-center">-</button>
                <span class="font-bold text-purple-200 text-xs px-1">${item.doses}</span>
                <button onclick="changeSorceryDose(${idx}, 1)" class="w-5 h-5 rounded bg-[#2c243c] hover:bg-[#3f3258] text-purple-300 font-bold text-xs flex items-center justify-center">+</button>
            `;

            itemsHtml += `
                <div class="bg-[#171626] border border-[#372d4c] p-3 rounded-xl space-y-1.5">
                    <div class="flex items-center justify-between border-b border-[#292238] pb-1.5">
                        <b class="text-purple-300 text-xs md:text-sm font-bold">${item.name} <span class="text-xs text-purple-400 font-normal">(${item.type || 'Potere'})</span></b>
                        <div class="flex items-center gap-1.5">
                            <div class="flex items-center gap-1 text-xs bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                                ${doseBtns}
                            </div>
                            ${removeBtn}
                        </div>
                    </div>
                    <p class="text-gray-300 text-xs leading-relaxed">${item.desc}</p>
                </div>
            `;
        });

        const addBtn = isLocked ? '' : `
            <button onclick="toggleAddSorceryPanel()" class="px-3 py-1 bg-purple-900/60 hover:bg-purple-800 border border-purple-600/50 rounded-lg text-purple-200 text-xs font-bold transition-all">
                + Aggiungi Potere
            </button>
        `;

        container.innerHTML = `
            <div class="sheet-card rounded-xl p-3.5 md:p-4 border-purple-500/30 bg-[#141320] space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#292238] pb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">🧪</span>
                        <div>
                            <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-purple-400">Stregoneria: ${character.sorcery}</h3>
                            <p class="text-xs text-gray-400">Poteri arcani del sangue &bull; Consuma Incrementi o PE</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="text-xs bg-purple-950 text-purple-300 border border-purple-700/50 px-2.5 py-0.5 rounded-lg font-bold">Retaggio Magico</span>
                        ${addBtn}
                    </div>
                </div>

                <!-- FORM INLINE AGGIUNTA POTERE STREGONERIA -->
                <div id="add-sorcery-panel" class="hidden bg-[#1c182c] p-3 rounded-xl border border-purple-500/40 space-y-2.5">
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="flex-1 min-w-[220px]">
                            <label class="block text-xs text-purple-300 mb-1 font-semibold">Seleziona Potere Ufficiale (${character.sorcery}):</label>
                            <select id="sel-new-sorcery-power" class="w-full bg-[#0d0c14] border border-[#433360] rounded-lg px-2.5 py-1.5 text-xs text-purple-200 outline-none">
                                <!-- Popolato dinamicamente da sorceriesDb -->
                            </select>
                        </div>
                        <div class="flex items-end gap-2 pt-3">
                            <button onclick="confirmAddSorceryPower()" class="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow">
                                Aggiungi
                            </button>
                            <button onclick="toggleAddSorceryPanel()" class="px-3 py-1.5 bg-[#252033] hover:bg-[#342c47] text-gray-300 text-xs rounded-lg">
                                Annulla
                            </button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                    ${itemsHtml || '<p class="text-gray-400 italic col-span-2 text-center py-2">Nessun potere memorizzato. Clicca su "+ Aggiungi Potere" per selezionarne uno.</p>'}
                </div>
            </div>
        `;

        populateSorceryPowersDropdown();
    }

    function toggleAddSorceryPanel() {
        const p = document.getElementById('add-sorcery-panel');
        if (p) p.classList.toggle('hidden');
    }

    function populateSorceryPowersDropdown() {
        const sel = document.getElementById('sel-new-sorcery-power');
        if (!sel) return;
        sel.innerHTML = '';

        const currentSorc = sorceriesDb.find(s => s.name.toLowerCase().includes(character.sorcery.toLowerCase()) || character.sorcery.toLowerCase().includes(s.name.toLowerCase()));
        const powers = (currentSorc && currentSorc.powers) ? currentSorc.powers : [];

        powers.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.name;
            opt.innerText = `[${p.type}] ${p.name}`;
            sel.appendChild(opt);
        });
    }

    function confirmAddSorceryPower() {
        const sel = document.getElementById('sel-new-sorcery-power');
        if (!sel) return;
        const powerName = sel.value;
        const currentSorc = sorceriesDb.find(s => s.name.toLowerCase().includes(character.sorcery.toLowerCase()) || character.sorcery.toLowerCase().includes(s.name.toLowerCase()));
        const found = currentSorc && currentSorc.powers ? currentSorc.powers.find(p => p.name === powerName) : null;

        if (found) {
            if (!character.sorceryItems) character.sorceryItems = [];
            character.sorceryItems.push({
                name: found.name,
                type: found.type,
                doses: found.doses || 1,
                desc: found.desc
            });
            renderSorcery();
            toggleAddSorceryPanel();
            showS7Toast(`Potere di stregoneria '${found.name}' preparato!`, "success");
        }
    }

    function changeSorceryDose(idx, delta) {
        if (!character.sorceryItems || !character.sorceryItems[idx]) return;
        character.sorceryItems[idx].doses = Math.max(0, (character.sorceryItems[idx].doses || 1) + delta);
        renderSorcery();
    }

    function removeSorceryItem(idx) {
        if (!character.sorceryItems) return;
        character.sorceryItems.splice(idx, 1);
        renderSorcery();
    }

    // RENDER STORIE
    function renderStories() {
        const container = document.getElementById('stories-list-container');
        if (!container) return;
        container.innerHTML = '';

        if (!character.stories || character.stories.length === 0) {
            container.innerHTML = '<p class="text-gray-400 italic text-xs text-center py-4">Nessuna Storia attiva. Clicca su "+ Nuova Storia" per iniziare il percorso di avanzamento dell\'Eroe.</p>';
            return;
        }

        character.stories.forEach((st, sIdx) => {
            let stepsHtml = '';
            (st.steps || []).forEach((step, stepIdx) => {
                const isDone = step.done;
                const checkIcon = isDone ? '☑️' : '🔲';
                stepsHtml += `
                    <div onclick="toggleStoryStep(${sIdx}, ${stepIdx})" class="flex items-center gap-2 cursor-pointer text-xs p-1.5 rounded-lg hover:bg-[#202532] ${isDone ? 'text-emerald-400 line-through opacity-75' : 'text-gray-200'}">
                        <span class="text-sm">${checkIcon}</span>
                        <span class="text-xs">Fase ${stepIdx + 1}: ${step.desc}</span>
                    </div>
                `;
            });

            const deleteStoryBtn = isLocked ? '' : `
                <button onclick="removeStory(${sIdx})" class="text-red-400 hover:text-red-300 text-xs font-bold ml-2">🗑️</button>
            `;

            const card = document.createElement('div');
            card.className = 'bg-[#151722] border border-[#2c3242] p-3.5 rounded-xl space-y-2';
            card.innerHTML = `
                <div class="flex items-center justify-between border-b border-[#242938] pb-2">
                    <div>
                        <b class="text-xs md:text-sm text-amber-300">${st.title}</b>
                        <p class="text-xs text-gray-400"><b>Ricompensa:</b> ${st.goal}</p>
                    </div>
                    ${deleteStoryBtn}
                </div>
                <div class="space-y-1 pt-1">
                    ${stepsHtml}
                </div>
            `;
            container.appendChild(card);
        });
    }

    function toggleStoryStep(sIdx, stepIdx) {
        if (character.stories && character.stories[sIdx] && character.stories[sIdx].steps[stepIdx]) {
            character.stories[sIdx].steps[stepIdx].done = !character.stories[sIdx].steps[stepIdx].done;
            renderStories();
        }
    }

    function toggleNewStoryForm() {
        const f = document.getElementById('new-story-inline-form');
        if (f) f.classList.toggle('hidden');
    }

    function addNewStoryPrompt() {
        toggleNewStoryForm();
    }

    function confirmAddNewStory() {
        const t = document.getElementById('inp-story-title');
        const g = document.getElementById('inp-story-goal');
        if (!t || !t.value.trim()) {
            showS7Toast("Inserisci un titolo per la Storia!", "error");
            return;
        }
        if (!character.stories) character.stories = [];
        character.stories.push({
            title: t.value.trim(),
            goal: (g && g.value.trim()) ? g.value.trim() : "Avanzamento Tratto / Abilità",
            steps: [
                { desc: "Indagare sugli indizi e scoprire il mandante", done: false },
                { desc: "Ottenere l'alleanza di un contatto fidato", done: false },
                { desc: "Affrontare l'antagonista o risolvere la crisi", done: false }
            ]
        });
        t.value = '';
        if (g) g.value = '';
        toggleNewStoryForm();
        renderStories();
        showS7Toast("Nuova Storia creata con successo!", "success");
    }

    function removeStory(sIdx) {
        if (!character.stories) return;
        character.stories.splice(sIdx, 1);
        renderStories();
    }

    // POPOLA MENU A TENDINA (ORDINAMENTO CORRETTO E ZERO UNDEFINED)
    function populateDropdowns() {
        const selBg1 = document.getElementById('sel-bg1');
        const selBg2 = document.getElementById('sel-bg2');
        if (selBg1 && selBg2) {
            selBg1.innerHTML = '<option value="Nessuno">-- 1° Background --</option>';
            selBg2.innerHTML = '<option value="Nessuno">-- 2° Background --</option>';
            const sortedBgs = [...backgroundsDb].sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));
            sortedBgs.forEach(b => {
                const opt1 = document.createElement('option');
                opt1.value = b.name;
                opt1.innerText = `${b.name} (${b.nation || 'Generale'})`;
                selBg1.appendChild(opt1);

                const opt2 = document.createElement('option');
                opt2.value = b.name;
                opt2.innerText = `${b.name} (${b.nation || 'Generale'})`;
                selBg2.appendChild(opt2);
            });
        }

        const selStyle = document.getElementById('sel-style');
        if (selStyle) {
            selStyle.innerHTML = '<option value="Nessuna">Nessuna Scuola (Ordinario)</option>';
            Object.values(duelingStylesDb).forEach(s => {
                if (s.name !== "Nessuna") {
                    const opt = document.createElement('option');
                    opt.value = s.name;
                    opt.innerText = `${s.name} (${s.nation || 'Gilda'})`;
                    selStyle.appendChild(opt);
                }
            });
        }

        const selVirtue = document.getElementById('sel-virtue');
        const selHubris = document.getElementById('sel-hubris');
        if (selVirtue && selHubris) {
            selVirtue.innerHTML = '';
            selHubris.innerHTML = '';

            // Virtù in ordine alfabetico
            const sortedVirtues = [...arcanaDb].sort((a, b) => a.virtue.localeCompare(b.virtue, 'it', { sensitivity: 'base' }));
            sortedVirtues.forEach(a => {
                const optV = document.createElement('option');
                optV.value = a.virtue;
                optV.innerText = `${a.virtue} (${a.arcanum})`;
                selVirtue.appendChild(optV);
            });

            // Superbia (Hubris) in ordine alfabetico
            const sortedHubris = [...arcanaDb].sort((a, b) => a.hubris.localeCompare(b.hubris, 'it', { sensitivity: 'base' }));
            sortedHubris.forEach(a => {
                const optH = document.createElement('option');
                optH.value = a.hubris;
                optH.innerText = `${a.hubris} (${a.arcanum})`;
                selHubris.appendChild(optH);
            });
        }

        const selAdv = document.getElementById('sel-new-adv');
        if (selAdv) {
            selAdv.innerHTML = '';
            const sortedAdv = [...advantagesDb].sort((a, b) => (a.cost || 0) - (b.cost || 0) || a.name.localeCompare(b.name));
            sortedAdv.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.name;
                opt.innerText = `[${a.cost || 0} pt] ${a.name}`;
                selAdv.appendChild(opt);
            });
        }

        populateNationTraitsDropdown(character.nation || "Castille");
    }

    // LOGICA ROLLER DEI RISCHI (7TH SEA 2E) CON AUTOMAZIONE GRADO 3, 4 E 5
    let currentRollState = null;

    function rollRisk() {
        const tVal = (character.traits && character.traits[selectedTrait]) || 2;
        const sVal = (character.skills && character.skills[selectedSkill]) || 0;
        const bonusDie = (character.dramaticWounds && character.dramaticWounds[0]) ? 1 : 0;
        const advBonus = getActiveAdvantageBonusDice();
        const totalDice = tVal + sVal + bonusDie + advBonus;

        if (totalDice <= 0) {
            showS7Toast("La riserva di dadi deve contenere almeno 1 dado!", "error");
            return;
        }

        const activeInst = (window.seventhSeaRules && typeof window.seventhSeaRules.getActiveInstitute === 'function')
            ? window.seventhSeaRules.getActiveInstitute(selectedSkill, character)
            : null;
        const plusOnePerDie = !!activeInst;

        const explodeTens = (sVal >= 5) || !!(character.dramaticWounds && character.dramaticWounds[2]);
        const setsOf15 = (sVal >= 4);
        const canReroll = (sVal >= 3);

        let diceObjects = [];
        let explosionsCount = 0;

        for (let i = 0; i < totalDice; i++) {
            let rawRoll = Math.floor(Math.random() * 10) + 1;
            let roll = plusOnePerDie ? Math.min(10, rawRoll + 1) : rawRoll;
            const isBoosted = plusOnePerDie && (roll > rawRoll);
            const isExp = (roll === 10 && explodeTens);

            diceObjects.push({
                val: roll,
                rawVal: rawRoll,
                isBoosted: isBoosted,
                isExploded: isExp,
                isBonus: false,
                wasRerolled: false
            });

            let depth = 0;
            while (roll === 10 && explodeTens && depth < 10) {
                depth++;
                explosionsCount++;
                let chainRaw = Math.floor(Math.random() * 10) + 1;
                let chainRoll = plusOnePerDie ? Math.min(10, chainRaw + 1) : chainRaw;
                diceObjects.push({
                    val: chainRoll,
                    rawVal: chainRaw,
                    isBoosted: plusOnePerDie && (chainRoll > chainRaw),
                    isExploded: (chainRoll === 10 && explodeTens),
                    isBonus: true,
                    wasRerolled: false
                });
                roll = chainRoll;
            }
        }

        const activeTogglesList = Object.keys(activeAdvToggles).filter(k => activeAdvToggles[k]);

        currentRollState = {
            traitName: selectedTrait,
            traitVal: tVal,
            skillName: selectedSkill,
            skillVal: sVal,
            bonusDie: bonusDie,
            advBonus: advBonus,
            activeAdvToggles: activeTogglesList,
            plusOnePerDie: plusOnePerDie,
            instituteName: activeInst ? activeInst.name : null,
            explodeTens: explodeTens,
            explosionsCount: explosionsCount,
            setsOf15: setsOf15,
            canReroll: canReroll,
            hasRerolled: false,
            hasDevilsLuckUsed: false,
            diceObjects: diceObjects
        };

        renderRollResults(true);
    }

    function renderRollResults(broadcast = false) {
        if (!currentRollState) return;

        const rawDice = currentRollState.diceObjects.map(d => d.val);
        const calc = (window.seventhSeaRules && typeof window.seventhSeaRules.calculateRaisesFromDice === 'function')
            ? window.seventhSeaRules.calculateRaisesFromDice(rawDice, currentRollState.setsOf15)
            : { dice: rawDice, sets: [], remaining: rawDice, totalRaises: 0 };

        currentRollState.calc = calc;
        currentRaises = calc.totalRaises;

        if (broadcast && window.seventhSeaRules && typeof window.seventhSeaRules.broadcastRiskRollToVttChat === 'function') {
            window.seventhSeaRules.broadcastRiskRollToVttChat(character.name || 'Eroe', {
                traitName: currentRollState.traitName,
                traitVal: currentRollState.traitVal,
                skillName: currentRollState.skillName,
                skillVal: currentRollState.skillVal,
                dwBonus: currentRollState.bonusDie,
                extraBonus: currentRollState.advBonus,
                advantageToggles: currentRollState.activeAdvToggles,
                plusOnePerDie: currentRollState.plusOnePerDie,
                instituteName: currentRollState.instituteName,
                dice: calc.dice,
                sets: calc.sets,
                remaining: calc.remaining,
                totalRaises: currentRaises,
                wasRerolled: currentRollState.hasRerolled,
                explosionsCount: currentRollState.explosionsCount
            });
        }

        const resContainer = document.getElementById('dice-results-container');
        if (!resContainer) return;

        // Render Dadi Tirati
        const isRerollAvailable = (currentRollState.canReroll && !currentRollState.hasRerolled);

        const rolledDiceHtml = currentRollState.diceObjects.map((dObj, idx) => {
            const isExploded = dObj.isExploded;
            const isBonus = dObj.isBonus;
            const wasRerolled = dObj.wasRerolled;

            let extraClasses = '';
            let clickAttr = '';
            let titleAttr = `Dado ${dObj.val}`;

            if (isRerollAvailable) {
                extraClasses += ' s7-clickable-die';
                clickAttr = `onclick="rerollRiskDie(${idx})"`;
                titleAttr = `Clicca per ritirare questo dado [${dObj.val}] (Grado 3)`;
            }

            let badgeBg = 'bg-[#242938] border-[#3b4458] text-amber-300';
            if (wasRerolled) {
                badgeBg = 'bg-amber-950/80 border-amber-500 text-amber-200';
            } else if (isExploded) {
                badgeBg = 'bg-red-950/80 border-red-500 text-red-200';
            }

            let cornerBadgeHtml = '';
            if (isExploded) {
                cornerBadgeHtml += '<span class="die-corner-badge badge-explode" title="10 Esploso">💥</span>';
            } else if (isBonus) {
                cornerBadgeHtml += '<span class="die-corner-badge badge-bonus" title="Dado Bonus da Esplosione">⚡</span>';
            }

            if (wasRerolled) {
                const posClass = cornerBadgeHtml ? 'badge-top-left' : '';
                cornerBadgeHtml += `<span class="die-corner-badge badge-reroll ${posClass}" title="Dado Ritirato">🔄</span>`;
            }

            if (dObj.isBoosted) {
                const posClass = (cornerBadgeHtml.includes('badge-top-left') || cornerBadgeHtml) ? 'badge-top-left' : '';
                cornerBadgeHtml += `<span class="die-corner-badge badge-plusone ${posClass}" title="+1 Applicato da ${currentRollState.instituteName || 'Istituto'}">+1</span>`;
            }

            return `
                <div ${clickAttr} class="dice-badge ${badgeBg} border font-black shadow relative ${extraClasses}" title="${titleAttr}">
                    ${dObj.val}
                    ${cornerBadgeHtml}
                </div>
            `;
        }).join('');

        // Vantaggio "La Fortuna del Diavolo" (spendi 1 PE per ritirare tutti i non abbinati)
        const hasDevilsLuck = window.seventhSeaRules && typeof window.seventhSeaRules.hasAdvantage === 'function'
            ? window.seventhSeaRules.hasAdvantage(character, 'La Fortuna del Diavolo')
            : (character.advantages || []).some(a => (a.name || '').toLowerCase() === 'la fortuna del diavolo');
        const canUseDevilsLuck = hasDevilsLuck && !currentRollState.hasDevilsLuckUsed && calc.remaining.length > 0 && (character.heroPoints || 0) > 0;

        const devilsLuckBtnHtml = canUseDevilsLuck ? `
            <button onclick="rerollWithDevilsLuck()" class="px-2.5 py-1 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1 active:scale-95 ml-auto" title="Spendi 1 PE per ritirare tutti i ${calc.remaining.length} dadi non abbinati">
                <span>🍀</span> Fortuna del Diavolo (-1 PE)
            </button>
        ` : '';

        // Banner per il Ritiro Grado 3 & Fortuna del Diavolo
        let rerollBannerHtml = '';
        if (isRerollAvailable) {
            rerollBannerHtml = `
                <div class="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#2a1d0d] to-[#1e160a] border border-amber-500/60 shadow">
                    <div class="flex items-center gap-1.5 text-amber-200 text-xs">
                        <span class="text-sm">🔄</span>
                        <span><b>Grado 3:</b> Clicca un dado sopra per ritirarlo, oppure usa:</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="autoRerollWorstRiskDie()" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-lg shadow transition transform active:scale-95 flex items-center gap-1">
                            <span>⚡</span> Auto-Ritira Peggiore
                        </button>
                        ${devilsLuckBtnHtml}
                    </div>
                </div>
            `;
        } else if (currentRollState.hasRerolled || currentRollState.hasDevilsLuckUsed) {
            const rerollMsg = currentRollState.hasDevilsLuckUsed
                ? '🍀 <b>La Fortuna del Diavolo applicata</b> (Dadi non abbinati ritirati).'
                : '🔄 <b>Ritiro Grado 3 applicato</b> con successo.';
            rerollBannerHtml = `
                <div class="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-blue-950/40 border border-blue-500/40 text-[11px] text-blue-200">
                    <div class="flex items-center gap-1.5">
                        <span>${currentRollState.hasDevilsLuckUsed ? '🍀' : '🔄'}</span>
                        <span>${rerollMsg} Incrementi ricalcolati!</span>
                    </div>
                    ${devilsLuckBtnHtml}
                </div>
            `;
        } else if (devilsLuckBtnHtml) {
            rerollBannerHtml = `
                <div class="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/40 text-[11px] text-purple-200">
                    <span>🍀 Puoi usare <b>La Fortuna del Diavolo</b> per ritirare i dadi rimasti fuori.</span>
                    ${devilsLuckBtnHtml}
                </div>
            `;
        }

        // Render Abbinamenti (Set da 15 con cornice dorata, Set da 10 con cornice verde)
        let setsHtml = '';
        calc.sets.forEach(s => {
            const is15 = (s.isFifteen || s.raises === 2);
            const badgeClass = is15 ? 'bg-amber-600 border-amber-400 text-white' : 'bg-emerald-600 border-emerald-400 text-white';
            const plusClass = is15 ? 'text-amber-400' : 'text-emerald-400';
            const sumClass = is15 ? 'text-amber-300' : 'text-emerald-300';
            const cardClass = is15 ? 'raise-group raise-group-15' : 'raise-group';
            const tagText = is15 ? '⭐⭐' : '+1';
            const tagTitle = is15 ? '2 Incrementi (Grado 4: Insieme da 15)' : '1 Incremento (Insieme da 10)';
            const tagBadgeClass = is15
                ? 'bg-amber-950/90 text-amber-300 border-amber-400/90'
                : 'bg-emerald-950 text-emerald-300 border-emerald-500/80';

            const dBadges = s.dice.map(d => `<div class="dice-badge ${badgeClass} border font-black shadow">${d}</div>`).join(`<span class="${plusClass} font-black text-xs mx-0.5">+</span>`);

            setsHtml += `
                <div class="${cardClass} flex items-center justify-between gap-1.5 p-2 rounded-xl">
                    <div class="flex items-center gap-1 flex-wrap">
                        ${dBadges}
                        <span class="text-xs font-bold ${sumClass} ml-1">= <b>${s.sum}</b></span>
                    </div>
                    <span class="text-xs font-black px-1.5 py-0.5 rounded ${tagBadgeClass} border shadow ml-auto whitespace-nowrap" title="${tagTitle}">${tagText}</span>
                </div>
            `;
        });

        // Dadi Avanzati non abbinati
        let leftoverHtml = '';
        if (calc.remaining.length > 0) {
            const chips = calc.remaining.map(d => `<div class="dice-badge bg-[#1f2430] border border-[#373e4f] text-gray-400 font-bold shadow-sm">${d}</div>`).join('');
            const sumLeft = calc.remaining.reduce((a, b) => a + b, 0);
            leftoverHtml = `
                <div class="flex flex-wrap items-center gap-2 bg-[#14161f] border border-[#262c3a] px-3 py-2 rounded-xl text-xs">
                    <span class="text-gray-400 font-bold mr-1">Dadi non abbinati (${calc.remaining.length}):</span>
                    <div class="flex flex-wrap items-center gap-1">${chips}</div>
                    <span class="text-xs text-gray-500 ml-1 italic">(Somma residua: ${sumLeft})</span>
                </div>
            `;
        }

        resContainer.innerHTML = `
            <div class="w-full space-y-2.5">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b38] pb-2 text-xs">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-gray-300 font-bold">Dadi Tirati (${currentRollState.diceObjects.length}):</span>
                        <div class="flex flex-wrap items-center gap-1">${rolledDiceHtml}</div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        ${currentRollState.instituteName ? `<span class="text-[10px] text-amber-300 bg-amber-950/80 border border-amber-500 px-2 py-0.5 rounded font-bold" title="+1 a tutti i dadi">🏛️ ${currentRollState.instituteName} (+1)</span>` : ''}
                        ${currentRollState.explodeTens ? '<span class="text-[10px] text-red-300 bg-red-950/80 border border-red-800 px-2 py-0.5 rounded font-bold">💥 10 Esplosivi</span>' : ''}
                        ${currentRollState.setsOf15 ? '<span class="text-[10px] text-amber-300 bg-amber-950/80 border border-amber-600 px-2 py-0.5 rounded font-bold">⭐ 15 = 2 Incr.</span>' : ''}
                    </div>
                </div>

                ${rerollBannerHtml}

                <div class="flex flex-wrap items-center justify-between gap-2.5 bg-gradient-to-r from-emerald-950/60 via-[#13221b] to-[#111c16] p-2.5 rounded-xl border border-emerald-500/50 shadow-lg">
                    <div class="flex items-center gap-2.5">
                        <span class="text-3xl font-black text-emerald-400" id="total-raises-num">${currentRaises}</span>
                        <div class="text-left">
                            <span class="text-xs uppercase tracking-wider text-emerald-300 block font-bold leading-tight">Incrementi Generati</span>
                            <span class="text-[11px] text-emerald-200/80 leading-tight">Spendibili per Azioni, Manovre o Prevenire Danni</span>
                        </div>
                    </div>
                    <button onclick="spendRaise()" class="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-lg shadow-md transition transform active:scale-95">
                        Spendi 1
                    </button>
                </div>

                <div class="text-left space-y-1.5">
                    <div class="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <span>✨</span> Abbinamenti che formano Incrementi:
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        ${setsHtml || '<p class="text-gray-400 italic text-xs col-span-3 text-center py-1">Nessun set raggiunto con questo lancio.</p>'}
                    </div>
                    ${leftoverHtml}
                </div>
            </div>
        `;
    }

    function rerollRiskDie(dieIndex) {
        if (!currentRollState || !currentRollState.canReroll || currentRollState.hasRerolled) return;
        if (!currentRollState.diceObjects || !currentRollState.diceObjects[dieIndex]) return;

        const targetObj = currentRollState.diceObjects[dieIndex];
        const oldVal = targetObj.val;
        let newRaw = Math.floor(Math.random() * 10) + 1;
        let newRoll = currentRollState.plusOnePerDie ? Math.min(10, newRaw + 1) : newRaw;

        targetObj.rawVal = newRaw;
        targetObj.val = newRoll;
        targetObj.isBoosted = (currentRollState.plusOnePerDie && newRoll > newRaw);
        targetObj.wasRerolled = true;
        targetObj.isExploded = (newRoll === 10 && currentRollState.explodeTens);
        currentRollState.hasRerolled = true;

        // Se il dado ritirato è un 10 e l'esplosione è attiva, esplode a catena!
        let depth = 0;
        let chainRoll = newRoll;
        while (chainRoll === 10 && currentRollState.explodeTens && depth < 10) {
            depth++;
            currentRollState.explosionsCount++;
            let chainRaw = Math.floor(Math.random() * 10) + 1;
            let nextRoll = currentRollState.plusOnePerDie ? Math.min(10, chainRaw + 1) : chainRaw;
            currentRollState.diceObjects.push({
                val: nextRoll,
                rawVal: chainRaw,
                isBoosted: currentRollState.plusOnePerDie && (nextRoll > chainRaw),
                isExploded: (nextRoll === 10 && currentRollState.explodeTens),
                isBonus: true,
                wasRerolled: false
            });
            chainRoll = nextRoll;
        }

        showS7Toast(`Dado ritirato: [${oldVal}] ➔ <b>[${newRoll}]</b>! Incrementi ricalcolati.`, "info");
        renderRollResults(true);
    }

    function rerollWithDevilsLuck() {
        if (!currentRollState || !currentRollState.calc) return;
        const hasDevilsLuck = window.seventhSeaRules && typeof window.seventhSeaRules.hasAdvantage === 'function'
            ? window.seventhSeaRules.hasAdvantage(character, 'La Fortuna del Diavolo')
            : (character.advantages || []).some(a => (a.name || '').toLowerCase() === 'la fortuna del diavolo');

        if (!hasDevilsLuck) {
            showS7Toast("L'Eroe non possiede il Vantaggio 'La Fortuna del Diavolo'!", "error");
            return;
        }

        const rem = currentRollState.calc.remaining || [];
        if (rem.length === 0) {
            showS7Toast("Tutti i dadi sono già abbinati in Incrementi! Nessun dado residuo da ritirare.", "info");
            return;
        }

        const curPE = parseInt(character.heroPoints) || 0;
        if (curPE < 1) {
            showS7Toast("Punti Eroe insufficienti! Serve 1 PE per attivare 'La Fortuna del Diavolo'.", "error");
            return;
        }

        // Spende 1 PE
        changeHeroPoints(-1);
        currentRollState.hasDevilsLuckUsed = true;

        // Ritira ciascun dado non abbinato
        const remCopy = [...rem];
        currentRollState.diceObjects.forEach(dObj => {
            const remIdx = remCopy.indexOf(dObj.val);
            if (remIdx !== -1) {
                remCopy.splice(remIdx, 1);
                const oldVal = dObj.val;
                let newRaw = Math.floor(Math.random() * 10) + 1;
                let newRoll = currentRollState.plusOnePerDie ? Math.min(10, newRaw + 1) : newRaw;
                dObj.rawVal = newRaw;
                dObj.val = newRoll;
                dObj.isBoosted = (currentRollState.plusOnePerDie && newRoll > newRaw);
                dObj.wasRerolled = true;
                dObj.isExploded = (newRoll === 10 && currentRollState.explodeTens);

                // Esplosione a catena se 10
                let depth = 0;
                let chainRoll = newRoll;
                while (chainRoll === 10 && currentRollState.explodeTens && depth < 10) {
                    depth++;
                    currentRollState.explosionsCount++;
                    let chainRaw = Math.floor(Math.random() * 10) + 1;
                    let nextRoll = currentRollState.plusOnePerDie ? Math.min(10, chainRaw + 1) : chainRaw;
                    currentRollState.diceObjects.push({
                        val: nextRoll,
                        rawVal: chainRaw,
                        isBoosted: currentRollState.plusOnePerDie && (nextRoll > chainRaw),
                        isExploded: (nextRoll === 10 && currentRollState.explodeTens),
                        isBonus: true,
                        wasRerolled: false
                    });
                    chainRoll = nextRoll;
                }
            }
        });

        showS7Toast(`🍀 <b>La Fortuna del Diavolo</b> attivata! Speso 1 PE per ritirare tutti i ${rem.length} dadi non abbinati.`, "success");
        renderRollResults(true);
    }

    function autoRerollWorstRiskDie() {
        if (!currentRollState || !currentRollState.canReroll || currentRollState.hasRerolled) return;
        const rawDice = currentRollState.diceObjects.map(d => d.val);
        const rem = currentRollState.calc ? currentRollState.calc.remaining : [];
        const candIdx = (window.seventhSeaRules && typeof window.seventhSeaRules.findBestRerollCandidateIndex === 'function')
            ? window.seventhSeaRules.findBestRerollCandidateIndex(rawDice, rem)
            : 0;

        if (candIdx >= 0 && candIdx < currentRollState.diceObjects.length) {
            rerollRiskDie(candIdx);
        }
    }

    function spendRaise() {
        if (currentRaises <= 0) {
            showS7Toast("Non hai più Incrementi da spendere!", "error");
            return;
        }
        currentRaises--;
        const el = document.getElementById('total-raises-num');
        if (el) el.innerText = currentRaises;
    }

    function resetDice() {
        currentRaises = 0;
        currentRollState = null;
        const resContainer = document.getElementById('dice-results-container');
        if (resContainer) {
            resContainer.innerHTML = '<p class="text-gray-400 italic text-xs">Seleziona un Tratto e un\'Abilità sopra, poi clicca &quot;Lancia Rischio&quot; per visualizzare i dadi e calcolare gli Incrementi (Abbinamenti di 10 evidenziati in verde).</p>';
        }
    }

    // PUNTI EROE & SUPERBIA
    function changeHeroPoints(delta) {
        character.heroPoints = Math.max(0, (character.heroPoints || 0) + delta);
        const hpEl = document.getElementById('hero-points');
        if (hpEl) hpEl.innerText = character.heroPoints;
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function triggerHubris() {
        changeHeroPoints(1);
        showS7Toast(`Hai ceduto alla tua Superbia (<b>${character.hubris || 'Tragica'}</b>)! Guadagni <b>+1 Punto Eroe</b>.`, "info");
    }

    // SALUTE & FERITE DRAMMATICHE (FASCE DA 5 FERITE SU 20 PV O 25 PV CON DURO DA UCCIDERE)
    function renderDramaticWoundsGrid() {
        const container = document.getElementById('dw-cards-container');
        if (!container) return;
        const isDuro = isDuroDaUccidere();
        const totalFD = isDuro ? 5 : 4;

        container.className = isDuro ? 'grid grid-cols-5 gap-1.5 text-center dw-cols-5' : 'grid grid-cols-4 gap-2 text-center dw-cols-4';

        let html = '';
        if (!isDuro) {
            html = `
              <div onclick="toggleDramaticWound(1)" id="dw-card-1" class="dw-box" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1">
                  <span id="dw-check-1">🔲</span> 1ª
                </div>
                <div class="dw-sub text-[10px] text-emerald-400 font-bold leading-tight mt-0.5">+1 Dado</div>
              </div>
              <div onclick="toggleDramaticWound(2)" id="dw-card-2" class="dw-box" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1">
                  <span id="dw-check-2">🔲</span> 2ª
                </div>
                <div class="dw-sub text-[10px] text-amber-400 font-bold leading-tight mt-0.5">+2 Nemici</div>
              </div>
              <div onclick="toggleDramaticWound(3)" id="dw-card-3" class="dw-box" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1">
                  <span id="dw-check-3">🔲</span> 3ª
                </div>
                <div class="dw-sub text-[10px] text-purple-300 font-bold leading-tight mt-0.5">💥 10 Espl.</div>
              </div>
              <div onclick="toggleDramaticWound(4)" id="dw-card-4" class="dw-box" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-black text-red-400 flex items-center justify-center gap-1">
                  <span id="dw-check-4">💀</span> 4ª
                </div>
                <div class="dw-sub text-[10px] text-red-400 font-black leading-tight mt-0.5">INERME</div>
              </div>
            `;
        } else {
            html = `
              <div onclick="toggleDramaticWound(1)" id="dw-card-1" class="dw-box dw-box-5" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1 whitespace-nowrap">
                  <span id="dw-check-1">🔲</span> 1ª
                </div>
                <div class="dw-sub text-[9.5px] text-emerald-400 font-bold leading-tight mt-0.5 whitespace-nowrap">+1 Dado</div>
              </div>
              <div onclick="toggleDramaticWound(2)" id="dw-card-2" class="dw-box dw-box-5" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1 whitespace-nowrap">
                  <span id="dw-check-2">🔲</span> 2ª
                </div>
                <div class="dw-sub text-[9.5px] text-amber-400 font-bold leading-tight mt-0.5 whitespace-nowrap">+2 Nemici</div>
              </div>
              <div onclick="toggleDramaticWound(3)" id="dw-card-3" class="dw-box dw-box-5" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1 whitespace-nowrap">
                  <span id="dw-check-3">🔲</span> 3ª
                </div>
                <div class="dw-sub text-[9.5px] text-purple-300 font-bold leading-tight mt-0.5 whitespace-nowrap">💥 10 Espl.</div>
              </div>
              <div onclick="toggleDramaticWound(4)" id="dw-card-4" class="dw-box dw-box-5" title="4ª Ferita Drammatica: I Malvagi ottengono 3 Dadi Bonus (invece di 2, +1 rispetto alla 2ª FD)">
                <div class="dw-title text-xs font-bold text-rose-300 flex items-center justify-center gap-1 whitespace-nowrap">
                  <span id="dw-check-4">🔲</span> 4ª
                </div>
                <div class="dw-sub text-[9.5px] text-amber-400 font-bold leading-tight mt-0.5 whitespace-nowrap">+1 Nemici</div>
              </div>
              <div onclick="toggleDramaticWound(5)" id="dw-card-5" class="dw-box dw-box-5" title="Clicca per segnare/rimuovere">
                <div class="dw-title text-xs font-black text-rose-400 flex items-center justify-center gap-1 whitespace-nowrap">
                  <span id="dw-check-5">💀</span> 5ª
                </div>
                <div class="dw-sub text-[9.5px] text-rose-400 font-black leading-tight mt-0.5 whitespace-nowrap">INERME</div>
              </div>
            `;
        }
        container.innerHTML = html;
        updateDramaticWoundsUI();
    }

    function toggleDramaticWound(num) {
        if (!character.dramaticWounds) character.dramaticWounds = [false, false, false, false, false];
        while (character.dramaticWounds.length < 5) character.dramaticWounds.push(false);
        const idx = num - 1;
        character.dramaticWounds[idx] = !character.dramaticWounds[idx];
        let dwCount = 0;
        character.dramaticWounds.forEach(w => { if (w) dwCount++; });
        if (character.currentWounds < dwCount * 5) {
            character.currentWounds = dwCount * 5;
        }
        updateDramaticWoundsUI();
        updateWoundsUI();
        updatePoolFormula();
    }

    function updateDramaticWoundsUI() {
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        const isDuro = isDuroDaUccidere();
        const maxFD = isDuro ? 5 : 4;
        let activeCount = 0;
        for (let i = 1; i <= maxFD; i++) {
            const isActive = character.dramaticWounds && character.dramaticWounds[i - 1];
            if (isActive) activeCount++;
            const card = document.getElementById(`dw-card-${i}`);
            const check = document.getElementById(`dw-check-${i}`);
            if (card) {
                card.className = `dw-box ${isDuro ? 'dw-box-5' : ''} ${isActive ? 'active-' + i : ''}`;
            }
            if (check) {
                const isFinal = (i === maxFD);
                check.innerText = isActive ? (isFinal ? '💀' : '☑️') : (isFinal ? '☠️' : '🔲');
            }
        }
        const label = document.getElementById('dw-count-label');
        if (label) label.innerText = `${activeCount} / ${maxFD} FD`;

        // Indicatore Vantaggio "Solo Contro Tutti"
        const soloBadge = document.getElementById('solo-contro-tutti-badge');
        if (soloBadge) {
            if (isSoloControTutti()) {
                const resVal = (character.traits && character.traits["Risolutezza"]) || 2;
                soloBadge.classList.remove('hidden');
                soloBadge.innerHTML = `🛡️ <b>Solo Contro Tutti:</b> -${resVal} Danni subiti da Squadre di Sgherri (Risolutezza)`;
            } else {
                soloBadge.classList.add('hidden');
            }
        }
    }

    function addWound(delta) {
        let current = parseInt(character.currentWounds) || 0;
        const maxWounds = isDuroDaUccidere() ? 25 : 20;
        current = Math.max(0, Math.min(maxWounds, current + delta));
        character.currentWounds = current;

        if (!character.dramaticWounds) character.dramaticWounds = [false, false, false, false, false];
        while (character.dramaticWounds.length < 5) character.dramaticWounds.push(false);

        // Attiva automaticamente le Ferite Drammatiche raggiunte (a 5, 10, 15, 20 o 25 ferite)
        const dwThresholds = isDuroDaUccidere() ? [5, 10, 15, 20, 25] : [5, 10, 15, 20];
        dwThresholds.forEach((th, idx) => {
            if (current >= th && !character.dramaticWounds[idx]) {
                character.dramaticWounds[idx] = true;
                showS7Toast(`💥 Raggiunta la ${idx + 1}ª Ferita Drammatica (${current} ferite totali)!`, "danger");
            }
        });

        updateDramaticWoundsUI();
        updateWoundsUI();
        updatePoolFormula();
    }

    function clearNormalWounds() {
        let activeCount = 0;
        (character.dramaticWounds || []).forEach(w => { if (w) activeCount++; });
        character.currentWounds = activeCount * 5;
        updateWoundsUI();
        showS7Toast("Fine Scena: ferite ordinarie azzerate (preservate le Ferite Drammatiche).", "info");
    }

    function updateWoundsUI() {
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        const total = character.currentWounds || 0;
        const curInTier = total % 5;
        const curEl = document.getElementById('current-wounds');
        if (curEl) curEl.innerText = curInTier;

        for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`w-dot-${i}`);
            if (dot) {
                if (i <= curInTier) {
                    dot.className = 'dot !w-3 !h-3 !cursor-default !bg-red-500 !border-red-400 !shadow-[0_0_6px_rgba(239,68,68,0.7)]';
                } else {
                    dot.className = 'dot !w-3 !h-3 !cursor-default !bg-[#1c202a] !border-gray-600';
                }
            }
        }
    }

    function renderSeventhSeaSheet() {
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        updateHeroHeader();
        updateHeroPhaseUI();
        renderTraits();
        renderSkills();
        updatePoolFormula();
        renderDramaticWoundsGrid();
        updateWoundsUI();
        updateDramaticWoundsUI();
        renderDuelingStyle();
        renderAdvantages();
        renderSorcery();
        renderStories();
        updateBgDisplays();
        const hpEl = document.getElementById('hero-points');
        if (hpEl) hpEl.innerText = character.heroPoints || 2;
    }

    // Esportazione su window per compatibilità con gli attributi onclick/oninput della scheda
    const exportedFns = {
        openBlankSheetModal, closeBlankSheetModal, confirmBlankSheet,
        loadExampleHero, doSetBlankSheet, setBlankSheet,
        toggleLock, updateLockUI, toggleHeroPhase, updateHeroPhaseUI,
        syncDropdownsWithCharacter,
        onNameChange, onConceptChange, onFaithSelectChange, onFaithChange,
        updateHeroHeader, switchTab, updateCreationTrackers,
        renderTraits, renderSkills, selectTrait, selectSkill,
        setTrait, setSkill, updatePoolFormula,
        toggleBonusAdvDie, getActiveAdvantageBonusDice, renderAdvantageToggles,
        renderDuelingStyle, renderAdvantages, activateAdvantageEffect, renderSorcery,
        toggleAddSorceryPanel, populateSorceryPowersDropdown, confirmAddSorceryPower,
        changeSorceryDose, removeSorceryItem,
        renderStories, toggleStoryStep, toggleNewStoryForm,
        addNewStoryPrompt, confirmAddNewStory, removeStory,
        onNationChange, onNationTraitChange, onBgChange, updateBgDisplays,
        onStyleChange, onSorceryChange, onVirtueChange, onHubrisChange,
        toggleAddAdvantagePanel, toggleAdvSourceType, confirmAddAdvantage, confirmAddCustomAdvantage, removeAdvantage,
        populateDropdowns, rollRisk, rerollRiskDie, autoRerollWorstRiskDie, rerollWithDevilsLuck, spendRaise, resetDice,
        changeHeroPoints, triggerHubris, toggleDramaticWound, renderDramaticWoundsGrid,
        updateDramaticWoundsUI, addWound, clearNormalWounds,
        updateWoundsUI, renderSeventhSeaSheet,
        getCharacter: () => character, isDuroDaUccidere, isSoloControTutti
    };
    Object.assign(window, exportedFns);

    function loadTokenIntoS7Sheet(token) {
        if (!token) return;
        window._s7LoadingFromToken = true;
        try {
            if (token.pcSheet && (token.pcSheet.system === '7thsea' || token.pcSheet.traits)) {
                character = JSON.parse(JSON.stringify(token.pcSheet));
                isLocked = !!character.isLocked;
            } else {
                doSetBlankSheet();
                if (token.name && token.name !== 'Nuovo Eroe') {
                    character.name = token.name;
                }
                character.system = '7thsea';
                isLocked = false;
            }

            const jArea = document.getElementById('s7-adventure-journal');
            if (jArea) {
                jArea.value = token.adventureJournal || (character && character.adventureJournal) || '';
            }

            const titleEl = document.getElementById('s7-window-title-text');
            if (titleEl) {
                titleEl.textContent = `Scheda Eroe 7th Sea — ${character.name || token.name || 'Nuovo Eroe'}`;
            }

            syncDropdownsWithCharacter();
            updateLockUI();
            renderSeventhSeaSheet();
        } finally {
            window._s7LoadingFromToken = false;
        }
        window.saveCharacterToVttToken(false);
    }

    function exportSingleCharacterJson(token) {
        const target = token || getActiveToken();
        if (!target) return;
        const payload = {
            vttBackupType: 'character_sheet_7thsea_v1',
            exportedAt: new Date().toISOString(),
            system: '7thsea',
            name: target.name || (target.pcSheet && target.pcSheet.name) || 'Eroe_7thSea',
            hpMax: target.hpMax || 20,
            hpCurrent: target.hpCurrent !== undefined ? target.hpCurrent : 20,
            owner: target.owner || null,
            owners: target.owners || [],
            pcSheet: target.pcSheet || character || null,
            adventureJournal: target.adventureJournal || ''
        };
        const jsonStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeName = (payload.name || 'Eroe_7thSea').replace(/[^a-zA-Z0-9_\\-]/g, '_');
        a.download = `${safeName}_7thSea_Scheda.json`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importSingleCharacterJson(token) {
        const target = token || getActiveToken();
        if (!target) return;
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,application/json';
        fileInput.style.display = 'none';
        fileInput.onchange = (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (re) => {
                try {
                    const data = JSON.parse(re.target.result);
                    if (data.pcSheet) {
                        target.pcSheet = data.pcSheet;
                        target.pcSheet.system = '7thsea';
                    }
                    if (data.adventureJournal !== undefined) target.adventureJournal = data.adventureJournal;
                    if (data.name) target.name = data.name;
                    loadTokenIntoS7Sheet(target);
                    window.saveCharacterToVttToken(true);
                    showS7Toast("Scheda Eroe importata con successo!", "success");
                } catch (err) {
                    showS7Toast('File JSON non valido: ' + err.message, "error");
                }
            };
            reader.readAsText(file);
        };
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    const seventhSeaSheetManager = {
        open(token = null) {
            const target = token || getActiveToken();
            if (!target) {
                showS7Toast('Seleziona prima il token del tuo Eroe sulla mappa!', "error");
                return;
            }
            currentTokenId = target.id;
            const win = ensureS7ModalDOM();
            win.style.display = 'flex';
            loadTokenIntoS7Sheet(target);
        },

        close() {
            const win = document.getElementById('seventh-sea-sheet-window');
            if (win) win.style.display = 'none';
        },

        refreshIfOpen(tokenId) {
            const win = document.getElementById('seventh-sea-sheet-window');
            if (!win || win.style.display === 'none') return;
            if (!tokenId || tokenId === currentTokenId) {
                const tok = getActiveToken();
                if (tok) loadTokenIntoS7Sheet(tok);
            }
        },

        commitSheetChanges(token, syncNetwork = true) {
            if (token && token.id === currentTokenId) {
                window.saveCharacterToVttToken(syncNetwork);
            }
        },

        exportSingleCharacterJson,
        importSingleCharacterJson
    };

    if (typeof window !== 'undefined') {
        window.seventhSeaSheetManager = seventhSeaSheetManager;
        if (window.systemManager) {
            window.systemManager.registerSystem('7thsea', {
                id: '7thsea',
                name: '7th Sea (2ª Edizione)',
                badge: '⛵ 7th Sea 2e',
                getSheetManager() {
                    return seventhSeaSheetManager;
                },
                getCompendium() {
                    return window.seventhSeaCompendium || window.compendium || null;
                }
            });
        }
    }
})();
