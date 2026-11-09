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

        <!-- CONTATORI RISORSE ACCOPPIATI (PUNTI EROE & RICCHEZZA SEMPRE UNITI) -->
        <div class="flex items-center gap-1.5 flex-nowrap">
          <!-- PUNTI EROE RAPIDI -->
          <div class="flex items-center gap-1.5 bg-[#101217] px-2.5 py-1 rounded-lg border border-[#2b303d]" title="Punti Eroe: risorsa narrativa per acquistare dadi, attivare Vantaggi e Virtù">
            <span class="text-xs font-bold text-amber-400">Punti Eroe:</span>
            <button onclick="changeHeroPoints(-1)" class="w-5 h-5 rounded bg-[#202532] hover:bg-[#2e3546] font-bold text-xs text-gray-300 flex items-center justify-center transition-all hover:text-white">-</button>
            <span class="font-black text-amber-300 text-xs w-4 text-center" id="hero-points">2</span>
            <button onclick="changeHeroPoints(1)" class="w-5 h-5 rounded bg-[#202532] hover:bg-[#2e3546] font-bold text-xs text-amber-400 flex items-center justify-center transition-all hover:bg-amber-950/60">+</button>
          </div>

          <!-- PUNTI RICCHEZZA RAPIDI -->
          <div class="flex items-center gap-1.5 bg-[#101217] px-2.5 py-1 rounded-lg border border-[#2b303d]" title="Punti Ricchezza: risorsa economica per corruzione nei Rischi sociali, assoldare sgherri, acquistare navi/equipaggiamento e cure mediche (Manuale Base pag. 164)">
            <span class="text-xs font-bold text-amber-400 flex items-center gap-1"><span>💰</span> Ricchezza:</span>
            <button onclick="changeWealth(-1)" class="w-5 h-5 rounded bg-[#202532] hover:bg-[#2e3546] font-bold text-xs text-gray-300 flex items-center justify-center transition-all hover:text-white" title="Riduci Ricchezza">-</button>
            <span class="font-black text-amber-300 text-xs min-w-[14px] text-center" id="wealth-points">0</span>
            <button onclick="changeWealth(1)" class="w-5 h-5 rounded bg-[#202532] hover:bg-[#2e3546] font-bold text-xs text-amber-400 flex items-center justify-center transition-all hover:bg-amber-950/60" title="Aumenta Ricchezza">+</button>
          </div>
        </div>
      </div>
    </header>

    <!-- POPUP LATERALE HOVER DETTAGLI BACKGROUND (NON DISTURBA LA SCELTA) -->
    <div id="bg-hover-popup" class="hidden fixed z-[99999] pointer-events-none w-80 md:w-96 bg-[#090b11] border-2 border-amber-500/70 rounded-xl p-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.98)] space-y-2.5 transition-opacity duration-150" style="background-color: #090b11;">
      <!-- Popolato via JS al mouseenter -->
    </div>

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
            <option value="">-- Seleziona Religione / Fede --</option>
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
            <option value="">-- Seleziona Nazione d'Origine --</option>
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
            <option value="Glamour">I Cavalieri di Avalon / Glamour (Avalon)</option>
            <option value="Dar Matushki">Tocco della Madre / Dar Matushki (Ussura)</option>
            <option value="Porté">Porté (Montaigne - Marchi di Sangue)</option>
            <option value="Sanderis">Sanderis (Sarmatia - Patti coi Dievai)</option>
            <option value="Sorte">Sorte (Vodacce - Trame del Fato)</option>
            <option value="Alquimia">Alquimia (Castille - Juvenilia &amp; Magna Opera)</option>
            <option value="Galdr">Galdr &amp; Futhark (Vestenmennavenjar - Rune)</option>
            <option value="Tocco di Tură">Tocco di Tură (Ussura - Vento &amp; Tempesta)</option>
          </select>
        </div>
      </div>

      <!-- SECONDA RIGA WIZARD: I 2 BACKGROUND (CON RIEPILOGO ABILITA/VANTAGGI), VIRTU E SUPERBIA, SCHERMA -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs pt-1.5 border-t border-[#252a35]/60">
        <!-- 1° BACKGROUND CON TENDINA PERSONALIZZATA & HOVER POPUP -->
        <div class="relative" id="bg-selector-wrapper-0">
          <label class="block text-gray-400 text-[11px] font-semibold mb-1 flex items-center justify-between">
            <span>1° Background</span>
            <span class="text-[9px] text-amber-400/80 font-normal">Passa il mouse per info</span>
          </label>
          <select id="sel-bg1" onchange="onBgChange(0, this.value)" class="hidden">
            <!-- Popolato dinamicamente per compatibilità e test -->
          </select>
          <button type="button" id="bg-custom-btn-0" onclick="toggleBgCustomDropdown(0)" class="w-full bg-[#0d0e12] hover:bg-[#151822] border border-[#2c3240] focus:border-amber-400 rounded-lg px-2 py-1.5 text-left text-xs text-gray-200 flex items-center justify-between transition-colors shadow-sm">
            <span id="bg-custom-btn-label-0" class="truncate text-gray-400">-- Seleziona 1° Background --</span>
            <span class="text-[9px] text-amber-400 ml-1 transition-transform" id="bg-custom-chevron-0">▼</span>
          </button>
          <div id="bg1-summary" class="text-[10px] text-amber-300/80 mt-1 truncate" title="Benefici 1° Background"></div>

          <div id="bg-custom-dropdown-0" class="hidden s7-custom-dropdown-panel">
            <div class="p-2 border-b border-[#232838] bg-[#0c0e15] space-y-1.5">
              <input type="text" id="bg-search-inp-0" oninput="filterBgCustomDropdown(0)" placeholder="🔍 Cerca Background o Nazione..." class="w-full bg-[#161a25] border border-[#2a3142] focus:border-amber-400 text-xs text-gray-200 rounded-lg px-2.5 py-1.5 outline-none">
              <div class="flex items-center gap-1 overflow-x-auto pt-0.5" id="bg-filter-pills-0">
                <button type="button" onclick="setBgSourceFilter(0, 'all')" class="s7-cat-pill active" id="bg-pill-0-all">Tutti (100)</button>
                <button type="button" onclick="setBgSourceFilter(0, 'Base')" class="s7-cat-pill" id="bg-pill-0-base">📖 Base (67)</button>
                <button type="button" onclick="setBgSourceFilter(0, 'Vol. 1')" class="s7-cat-pill" id="bg-pill-0-vol1">⚔️ Vol. 1 (17)</button>
                <button type="button" onclick="setBgSourceFilter(0, 'Vol. 2')" class="s7-cat-pill" id="bg-pill-0-vol2">🛡️ Vol. 2 (16)</button>
              </div>
            </div>
            <div class="s7-dropdown-scroll-list overflow-y-auto flex-1 divide-y divide-[#1b1f2c]" id="bg-custom-list-0">
              <!-- Popolato via JS -->
            </div>
          </div>
        </div>

        <!-- 2° BACKGROUND CON TENDINA PERSONALIZZATA & HOVER POPUP -->
        <div class="relative" id="bg-selector-wrapper-1">
          <label class="block text-gray-400 text-[11px] font-semibold mb-1 flex items-center justify-between">
            <span>2° Background</span>
            <span class="text-[9px] text-amber-400/80 font-normal">Passa il mouse per info</span>
          </label>
          <select id="sel-bg2" onchange="onBgChange(1, this.value)" class="hidden">
            <!-- Popolato dinamicamente per compatibilità e test -->
          </select>
          <button type="button" id="bg-custom-btn-1" onclick="toggleBgCustomDropdown(1)" class="w-full bg-[#0d0e12] hover:bg-[#151822] border border-[#2c3240] focus:border-amber-400 rounded-lg px-2 py-1.5 text-left text-xs text-gray-200 flex items-center justify-between transition-colors shadow-sm">
            <span id="bg-custom-btn-label-1" class="truncate text-gray-400">-- Seleziona 2° Background --</span>
            <span class="text-[9px] text-amber-400 ml-1 transition-transform" id="bg-custom-chevron-1">▼</span>
          </button>
          <div id="bg2-summary" class="text-[10px] text-amber-300/80 mt-1 truncate" title="Benefici 2° Background"></div>

          <div id="bg-custom-dropdown-1" class="hidden s7-custom-dropdown-panel">
            <div class="p-2 border-b border-[#232838] bg-[#0c0e15] space-y-1.5">
              <input type="text" id="bg-search-inp-1" oninput="filterBgCustomDropdown(1)" placeholder="🔍 Cerca Background o Nazione..." class="w-full bg-[#161a25] border border-[#2a3142] focus:border-amber-400 text-xs text-gray-200 rounded-lg px-2.5 py-1.5 outline-none">
              <div class="flex items-center gap-1 overflow-x-auto pt-0.5" id="bg-filter-pills-1">
                <button type="button" onclick="setBgSourceFilter(1, 'all')" class="s7-cat-pill active" id="bg-pill-1-all">Tutti (100)</button>
                <button type="button" onclick="setBgSourceFilter(1, 'Base')" class="s7-cat-pill" id="bg-pill-1-base">📖 Base (67)</button>
                <button type="button" onclick="setBgSourceFilter(1, 'Vol. 1')" class="s7-cat-pill" id="bg-pill-1-vol1">⚔️ Vol. 1 (17)</button>
                <button type="button" onclick="setBgSourceFilter(1, 'Vol. 2')" class="s7-cat-pill" id="bg-pill-1-vol2">🛡️ Vol. 2 (16)</button>
              </div>
            </div>
            <div class="s7-dropdown-scroll-list overflow-y-auto flex-1 divide-y divide-[#1b1f2c]" id="bg-custom-list-1">
              <!-- Popolato via JS -->
            </div>
          </div>
        </div>

        <!-- SCUOLA DI SCHERMA CON TENDINA PERSONALIZZATA & HOVER POPUP -->
        <div class="relative" id="style-selector-wrapper">
          <label class="block text-gray-400 text-[11px] font-semibold mb-1 flex items-center justify-between">
            <span>Scuola di Scherma</span>
            <span class="text-[9px] text-amber-400/80 font-normal">Passa il mouse per info</span>
          </label>
          <select id="sel-style" onchange="onStyleChange(this.value)" class="hidden">
            <!-- Popolato da duelingStylesDb per compatibilità e test -->
          </select>
          <button type="button" id="style-custom-btn" onclick="toggleStyleCustomDropdown()" class="w-full bg-[#0d0e12] hover:bg-[#151822] border border-[#2c3240] focus:border-amber-400 rounded-lg px-2 py-1.5 text-left text-xs text-gray-200 flex items-center justify-between transition-colors shadow-sm">
            <span id="style-custom-btn-label" class="truncate text-gray-400">Nessuna Scuola (Ordinario)</span>
            <span class="text-[9px] text-amber-400 ml-1 transition-transform" id="style-custom-chevron">▼</span>
          </button>
          <div id="style-summary" class="text-[10px] text-amber-300/80 mt-1 truncate" title="Stile di Duello attivo"></div>

          <div id="style-custom-dropdown" class="hidden s7-custom-dropdown-panel">
            <div class="p-2 border-b border-[#232838] bg-[#0c0e15] space-y-1.5">
              <input type="text" id="style-search-inp" oninput="filterStyleCustomDropdown()" placeholder="🔍 Cerca Stile, Nazione o Arma..." class="w-full bg-[#161a25] border border-[#2a3142] focus:border-amber-400 text-xs text-gray-200 rounded-lg px-2.5 py-1.5 outline-none">
              <div class="flex items-center gap-1 overflow-x-auto pt-0.5" id="style-filter-pills">
                <button type="button" onclick="setStyleSourceFilter('all')" class="s7-cat-pill active" id="style-pill-all">Tutti (20)</button>
                <button type="button" onclick="setStyleSourceFilter('Base')" class="s7-cat-pill" id="style-pill-base">📖 Base (12)</button>
                <button type="button" onclick="setStyleSourceFilter('Vol. 1')" class="s7-cat-pill" id="style-pill-vol1">⚔️ Vol. 1 (4)</button>
                <button type="button" onclick="setStyleSourceFilter('Vol. 2')" class="s7-cat-pill" id="style-pill-vol2">🛡️ Vol. 2 (4)</button>
              </div>
            </div>
            <div class="s7-dropdown-scroll-list overflow-y-auto flex-1 divide-y divide-[#1b1f2c]" id="style-custom-list">
              <!-- Popolato via JS -->
            </div>
          </div>
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
            <!-- FINESTRINA DADI BONUS NEMICI (SOLO GM) -->
            <div id="s7-hero-gm-enemy-bonus-container"></div>

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
                <!-- STEPPER MODIFICATORE DADI BONUS / MALUS -->
                <div class="s7-dice-mod-container" title="Modificatore Manuale Dadi Bonus / Malus alla Riserva">
                  <span class="s7-dice-mod-label">Dadi ±:</span>
                  <button type="button" onclick="adjustCustomDiceModifier(-1)" class="s7-dice-mod-btn btn-minus" title="Riduci Riserva (-1 Dado Malus)">−</button>
                  <span id="custom-dice-mod-val" class="s7-dice-mod-val">0</span>
                  <button type="button" onclick="adjustCustomDiceModifier(1)" class="s7-dice-mod-btn btn-plus" title="Aumenta Riserva (+1 Dado Bonus)">+</button>
                  <button type="button" onclick="resetCustomDiceModifier()" id="btn-reset-dice-mod" class="s7-dice-mod-reset hidden" title="Azzera modificatore a 0">✕</button>
                </div>
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
              <select id="sel-new-adv" onchange="onNewAdvSelectChange(this.value)" class="w-full bg-[#0d0e12] border border-[#373f52] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none">
                <!-- Popolato da advantagesDb -->
              </select>
            </div>
            <div id="adv-duel-style-picker-wrap" class="hidden flex-1 min-w-[220px]">
              <label class="block text-xs text-amber-300 font-semibold mb-1">Scegli Stile di Duello (Sala d’Armi):</label>
              <select id="sel-adv-duel-style" class="w-full bg-[#0d0e12] border border-amber-500/60 rounded-lg px-2.5 py-1.5 text-xs text-amber-200 outline-none">
                <!-- Popolato via JS -->
              </select>
            </div>
            <div id="adv-studioso-maneuver-picker-wrap" class="hidden flex-1 min-w-[220px]">
              <label class="block text-xs text-amber-300 font-semibold mb-1">3ª Manovra Base (Studioso di Lotta):</label>
              <select id="sel-adv-studioso-maneuver" class="w-full bg-[#0d0e12] border border-amber-500/60 rounded-lg px-2.5 py-1.5 text-xs text-amber-200 outline-none">
                <option value="Finta">Finta</option>
                <option value="Affondo">Affondo</option>
                <option value="Botta">Botta</option>
                <option value="Risposta">Risposta</option>
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

          <!-- BOX ANTEPRIMA LIVE VANTAGGIO SELEZIONATO -->
          <div id="adv-preview-card" class="bg-[#0f1118] border border-[#2b3142] rounded-xl p-3 space-y-2 text-xs">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#212634] pb-2">
              <div class="flex items-center gap-2">
                <span id="adv-preview-icon" class="text-base">⭐</span>
                <span id="adv-preview-title" class="font-bold text-amber-300 text-sm">Nessun Vantaggio Selezionato</span>
              </div>
              <div class="flex flex-wrap items-center gap-1.5" id="adv-preview-badges">
                <span class="text-[11px] text-gray-500 italic">Scegli un vantaggio dal menu sopra</span>
              </div>
            </div>
            <div id="adv-preview-desc" class="text-gray-300 leading-relaxed text-xs">
              Scegli un vantaggio dal menu a tendina sopra per visualizzarne la descrizione, l'effetto e verificare se è Innato o acquisibile tramite Storie.
            </div>
            <div id="adv-preview-rule-note" class="text-[11px] text-gray-400 border-t border-[#212634]/60 pt-1.5">
              💡 <b>Regola Ufficiale (pag. 160):</b> I vantaggi standard richiedono un numero di Atti pari al loro costo in punti. I vantaggi Innati (🧬) possono essere scelti solo alla creazione dell'Eroe.
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

        <!-- FORM INLINE NUOVA / MODIFICA STORIA (5 ATTI SECONDO SCHEMA) -->
        <div id="new-story-inline-form" class="hidden bg-[#151722] p-4 rounded-xl border border-amber-500/40 mb-3.5 space-y-3.5 shadow-xl">
          <input type="hidden" id="inp-story-edit-index" value="-1">

          <div class="flex flex-wrap items-center justify-between border-b border-[#252a35] pb-2">
            <div>
              <h4 id="story-form-heading" class="text-xs md:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <span>📜</span> Componi Nuova Storia Personale
              </h4>
              <p class="text-[11px] text-gray-400">Secondo il Manuale (pag. 159-160), imposta Titolo, Ricompensa e compila da 1 a 5 Atti. Solo gli Atti compilati faranno parte della storia.</p>
            </div>
            <div class="flex flex-wrap gap-1 text-[10px]">
              <span class="px-1.5 py-0.5 rounded bg-[#101217] border border-[#2e3444] text-amber-300/80">1 Atto = Abilità G1 / Vant. 1 pt</span>
              <span class="px-1.5 py-0.5 rounded bg-[#101217] border border-[#2e3444] text-amber-300/80">2 Atti = Abilità G2 / Vant. 2 pt</span>
              <span class="px-1.5 py-0.5 rounded bg-[#101217] border border-[#2e3444] text-amber-300/80">3 Atti = G3 / Vant. 3 pt / Peculiarità</span>
              <span class="px-1.5 py-0.5 rounded bg-[#101217] border border-[#2e3444] text-amber-300/80">4 Atti = G4 / Vant. 4 pt / Arcano</span>
              <span class="px-1.5 py-0.5 rounded bg-[#101217] border border-[#2e3444] text-amber-300/80">5 Atti = G5 / Vant. 5 pt / +1 Tratto</span>
            </div>
          </div>

          <!-- TOP ROW: TITOLO E RICOMPENSA (ESATTAMENTE COME NEL PROGETTO) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block text-gray-300 mb-1 font-bold text-xs uppercase tracking-wide">Titolo della Storia:</label>
              <input type="text" id="inp-story-title" placeholder="Es: Vendetta contro il Barone Von Sieger" class="w-full bg-[#0d0e12] border border-[#2d3444] focus:border-amber-400 rounded-lg px-3 py-2 text-gray-200 outline-none text-xs transition-colors">
            </div>
            <div>
              <label class="block text-gray-300 mb-1 font-bold text-xs uppercase tracking-wide">Ricompensa (Obiettivo):</label>
              <input type="text" id="inp-story-goal" placeholder="Es: Vantaggio Mira Letale (3 pt) o Abilità Mira Grado 3" class="w-full bg-[#0d0e12] border border-[#2d3444] focus:border-amber-400 rounded-lg px-3 py-2 text-gray-200 outline-none text-xs transition-colors">
            </div>
          </div>

          <!-- 5 RIGHE ATTI / OBIETTIVI (CHECKBOX + OBIETTIVO 1..5) -->
          <div class="space-y-2 pt-1">
            <div class="flex items-center justify-between text-xs border-b border-[#202532] pb-1">
              <span class="font-bold text-gray-300 uppercase tracking-wide text-[11px]">Atti della Storia (Compila solo quelli previsti per la tua Ricompensa):</span>
              <span class="text-[10px] text-gray-400 italic">I campi lasciati vuoti verranno esclusi automaticamente</span>
            </div>

            <!-- OBIETTIVO 1 -->
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-[#202532] border border-amber-500/50 flex items-center justify-center text-amber-300 font-bold text-xs flex-shrink-0" title="Obiettivo 1 (Primo Atto)">
                1
              </div>
              <input type="text" id="inp-story-step-1" placeholder="Obiettivo 1 (Primo Atto - Obbligatorio) Es: Viaggiare fino a Balig e fare domande sul mio conto" class="w-full bg-[#0d0e12] border border-[#2d3444] focus:border-amber-400 rounded-lg px-3 py-1.5 text-gray-200 outline-none text-xs transition-colors">
            </div>

            <!-- OBIETTIVO 2 -->
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-[#202532] border border-[#3b4356] flex items-center justify-center text-gray-400 font-bold text-xs flex-shrink-0" title="Obiettivo 2">
                2
              </div>
              <input type="text" id="inp-story-step-2" placeholder="Obiettivo 2: Es: Incontrare la Principessa Mary che mi riconosce (Opzionale)" class="w-full bg-[#0d0e12] border border-[#2d3444] focus:border-amber-400 rounded-lg px-3 py-1.5 text-gray-200 outline-none text-xs transition-colors">
            </div>

            <!-- OBIETTIVO 3 -->
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-[#202532] border border-[#3b4356] flex items-center justify-center text-gray-400 font-bold text-xs flex-shrink-0" title="Obiettivo 3">
                3
              </div>
              <input type="text" id="inp-story-step-3" placeholder="Obiettivo 3: Es: Ritornare a Carleon e appellarmi alla Regina (Opzionale)" class="w-full bg-[#0d0e12] border border-[#2d3444] focus:border-amber-400 rounded-lg px-3 py-1.5 text-gray-200 outline-none text-xs transition-colors">
            </div>

            <!-- OBIETTIVO 4 -->
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-[#202532] border border-[#3b4356] flex items-center justify-center text-gray-400 font-bold text-xs flex-shrink-0" title="Obiettivo 4">
                4
              </div>
              <input type="text" id="inp-story-step-4" placeholder="Obiettivo 4: (Lascia vuoto se la Storia ha meno di 4 Atti)" class="w-full bg-[#0d0e12] border border-[#2d3444] focus:border-amber-400 rounded-lg px-3 py-1.5 text-gray-200 outline-none text-xs transition-colors">
            </div>

            <!-- OBIETTIVO 5 -->
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-[#202532] border border-[#3b4356] flex items-center justify-center text-gray-400 font-bold text-xs flex-shrink-0" title="Obiettivo 5">
                5
              </div>
              <input type="text" id="inp-story-step-5" placeholder="Obiettivo 5: (Lascia vuoto se la Storia ha meno di 5 Atti)" class="w-full bg-[#0d0e12] border border-[#2d3444] focus:border-amber-400 rounded-lg px-3 py-1.5 text-gray-200 outline-none text-xs transition-colors">
            </div>
          </div>

          <!-- AZIONI FORM -->
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#202532]">
            <button onclick="confirmAddNewStory()" id="btn-submit-story" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-all">
              <span>✓</span> Salva e Avvia Storia
            </button>
            <button onclick="toggleNewStoryForm(false)" class="px-3.5 py-2 bg-[#202532] hover:bg-[#2c3342] text-gray-300 text-xs rounded-lg transition-all">
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
        <textarea id="s7-adventure-journal" oninput="onS7JournalChange(this.value)" rows="12" placeholder="Scrivi qui il diario di bordo del tuo Eroe (appunti, indizi, nomi di PNG, cronache)..." style="background-color: #ffffff !important; color: #111111 !important; caret-color: #111111 !important; border: 1.5px solid #d1d5db !important; font-size: 13.5px !important; font-weight: 500 !important; line-height: 1.6 !important; padding: 14px !important; border-radius: 12px !important; width: 100% !important; box-sizing: border-box !important; outline: none !important; resize: vertical;" class="w-full rounded-xl outline-none leading-relaxed shadow-inner"></textarea>
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
        "Castille": { traits: ["Grazia", "Acume"], sorcery: "Alquimia" },
        "Eisen": { traits: ["Vigore", "Risolutezza"], sorcery: "Hexenwerk" },
        "Highland Marches": { traits: ["Vigore", "Risolutezza"], sorcery: "Glamour" },
        "Inismore": { traits: ["Panache", "Acume"], sorcery: "Glamour" },
        "Montaigne": { traits: ["Grazia", "Panache"], sorcery: "Porté" },
        "Sarmatia": { traits: ["Vigore", "Grazia"], sorcery: "Sanderis" },
        "Ussura": { traits: ["Risolutezza", "Acume"], sorcery: "Dar Matushki" },
        "Vestenmennavenjar": { traits: ["Vigore", "Acume"], sorcery: "Galdr" },
        "Vodacce": { traits: ["Grazia", "Acume"], sorcery: "Sorte" }
    };

    // DATABASE EMBEDDED CON NAZIONE ASSEGNATA AD OGNI BACKGROUND
    const backgroundsDb = [
        {"name":"Archeologo","nation":"Generale","desc":"Studia le rovine Syrneth ed esplora le parti perdute di Terra.","quirk":"Ottiene un Punto Eroe ogni volta che consegna un artefatto di valore a un museo, università o altra istituzione pubblica.","advantages":["Oggetto Distintivo","Vista d'Aquila"],"skills":["Atletica","Convincere","Furto","Istruzione","Notare"]},
        {"name":"Aristocratico","nation":"Generale","desc":"Nato tra la nobiltà del suo paese, è un volto noto nelle corti.","quirk":"Ottiene un Punto Eroe ogni volta che dimostra che essere nobile è ben più che indossare abiti costosi e partecipare a balli di corte.","advantages":["Ricco","Sorriso Disarmante"],"skills":["Cavalcare","Convincere","Empatia","Istruzione","Mira"]},
        {"name":"Artigiano","nation":"Generale","desc":"Lavora continuamente per realizzare oggetti utili.","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta le modeste abilità artigiane per risolvere problemi considerati troppo complessi per avere una soluzione semplice.","advantages":["Manualità","Mastro Artigiano"],"skills":["Atletica","Convincere","Esibirsi","Istruzione","Notare"]},
        {"name":"Artista","nation":"Generale","desc":"Si impegna senza posa per creare opere d'arte.","quirk":"Ottiene un Punto Eroe ogni volta che si sacrifica per rendere Théah un luogo più bello.","advantages":["Affascinare","Mecenate"],"skills":["Allettare","Cavalcare","Convincere","Empatia","Esibirsi"]},
        {"name":"Assassino","nation":"Generale","desc":"Si nasconde tra le ombre come uno spettro e porta silenziosamente la morte in cambio di denaro insanguinato.","quirk":"Ottiene un Punto Eroe ogni volta che si espone per evitare la morte di un nemico o rifiuta un piano d'azione perché potrebbe causare morti inutili.","advantages":["Psst, da questa parte","Schermidore"],"skills":["Atletica","Empatia","Intimidire","Mischia","Nascondersi"]},
        {"name":"Cacciatore","nation":"Generale","desc":"Dorme sotto le stelle e si procura il cibo da solo.","quirk":"Ottiene un Punto Eroe ogni volta che il suo istinto di cacciatore salva qualcuno da un pericolo.","advantages":["Cecchino","Fatto!"],"skills":["Cavalcare","Intimidire","Mira","Nascondersi","Notare"]},
        {"name":"Capitano di Nave","nation":"Generale","desc":"Comanda un equipaggio sotto qualsiasi bandiera.","quirk":"Ottiene un Punto Eroe ogni volta che è l'ultimo del suo equipaggio a mettersi in salvo.","advantages":["Comando","Gambe da Marinaio","Sposato al Mare"],"skills":["Arte della Guerra","Convincere","Mira","Navigazione","Notare"]},
        {"name":"Cavaliere","nation":"Generale","desc":"È un guerriero a cavallo, parte della gloriosa cavalleria della sua Nazione.","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta la sua esperienza nel cavalcare in una situazione insolita.","advantages":["Mano Pesante","Volontà Indomabile"],"skills":["Arte della Guerra","Cavalcare","Intimidire","Mischia","Notare"]},
        {"name":"Contadino","nation":"Generale","desc":"Cresciuto in una piccola fattoria, è abituato a lavorare per sopravvivere senza avere, finora, conosciuto l'avventura.","quirk":"Ottiene un Punto Eroe ogni volta che risolve un problema complesso usando semplici e vecchie soluzioni contadine.","advantages":["Esperto di Sopravvivenza","Tratto Leggendario"],"skills":["Atletica","Cavalcare","Convincere","Empatia","Esibirsi"]},
        {"name":"Cortigiano","nation":"Generale","desc":"È un volto conosciuto nelle corti della sua patria e un diplomatico in quelle straniere.","quirk":"Ottiene un Punto Eroe ogni volta che, con il suo fascino e il suo stile, impedisce un'esplosione di violenza.","advantages":["Amicizie Altolocate","Un Semplice Malinteso"],"skills":["Allettare","Cavalcare","Empatia","Esibirsi","Mischia"]},
        {"name":"Dottore","nation":"Generale","desc":"Cura i malati e i feriti.","quirk":"Ottiene un Punto Eroe ogni volta che si occupa delle ferite di un Malvagio o delle sue vittime innocenti.","advantages":["Fautore di Miracoli","Orologio Biologico"],"skills":["Cavalcare","Convincere","Empatia","Istruzione","Notare"]},
        {"name":"Duellante","nation":"Generale","desc":"Ha dedicato la sua vita alla maestria della scherma.","quirk":"Ottiene un Punto Eroe ogni volta che la sua spada difende un nobile ideale.","advantages":["Sala d'Armi"],"skills":["Atletica","Empatia","Esibirsi","Intimidire","Mischia"]},
        {"name":"Esploratore","nation":"Generale","desc":"Vive per visitare i più remoti angoli del pianeta.","quirk":"Ottiene un Punto Eroe ogni volta che posa lo sguardo su una vista che pochi o nessuno a Théah hanno mai potuto godere.","advantages":["Lavorare sui Tetti","Riflessi Rapidi"],"skills":["Atletica","Cavalcare","Convincere","Empatia","Navigazione"]},
        {"name":"Fuorilegge","nation":"Generale","desc":"Viola le leggi ingiuste per ottenere ciò che crede sia il bene superiore.","quirk":"Ottiene un Punto Eroe ogni volta che viola la legge per uno scopo nobile.","advantages":["Cameratismo","Scafato"],"skills":["Atletica","Empatia","Furto","Intimidire","Nascondersi"]},
        {"name":"Ingegnere","nation":"Generale","desc":"È specializzato nell'applicare ingegno, conoscenze scientifiche e matematiche per risolvere problemi tecnici, sociali e commerciali.","quirk":"Ottiene un Punto Eroe ogni volta che usa la sua conoscenza tecnica per risolvere un problema.","advantages":["Mastro Artigiano","Orologio Biologico","Senso dell'Orientamento"],"skills":["Arte della Guerra","Cavalcare","Convincere","Istruzione","Mira"]},
        {"name":"Intrattenitore","nation":"Generale","desc":"Fatica costantemente per dare al pubblico un'esperienza emozionante.","quirk":"Ottiene un Punto Eroe ogni volta che usa le sue abilità per qualcosa di più del semplice guadagno.","advantages":["Ispirare Generosità","Virtuoso"],"skills":["Allettare","Atletica","Empatia","Esibirsi","Furto"]},
        {"name":"Jenny","nation":"Generale","desc":"Seduce per divertimento e profitto.","quirk":"Ottiene un Punto Eroe ogni volta che risolve un conflitto grazie alla seduzione o a proposte sessuali.","advantages":["Approccio Dinamico","Vieni Qui"],"skills":["Allettare","Atletica","Empatia","Esibirsi","Mira"]},
        {"name":"Marinaio","nation":"Generale","desc":"Non serve alcun paese o signore; la nave e l'equipaggio sono tutta la sua famiglia.","quirk":"Ottiene un Punto Eroe ogni volta che mette da parte i suoi desideri per garantire la sicurezza o la comodità dei suoi compagni.","advantages":["Rissoso","Vista d'Aquila"],"skills":["Allettare","Mischia","Navigazione","Notare","Rissa"]},
        {"name":"Mercante","nation":"Generale","desc":"Viaggia in tutto il paese per vendere le sue merci per terra e per mare.","quirk":"Ottiene un Punto Eroe ogni volta che vende un oggetto per molto meno del suo reale valore a chi ne ha un disperato bisogno.","advantages":["Orologio Biologico","Scuola di Maniere"],"skills":["Allettare","Cavalcare","Convincere","Empatia","Intimidire"]},
        {"name":"Mercenario","nation":"Generale","desc":"Vende le sue abilità militari al miglior offerente.","quirk":"Ottiene un Punto Eroe ogni volta che sceglie di seguire una ragione più nobile del vile denaro.","advantages":["Duro da Uccidere","Stomaco di Ferro"],"skills":["Atletica","Intimidire","Mischia","Notare","Rissa"]},
        {"name":"Orfano","nation":"Generale","desc":"Ha perso i suoi genitori da piccolo e si è abituato a badare a se stesso.","quirk":"Ottiene un Punto Eroe ogni volta che corre un rischio per assicurarsi che qualcun altro non debba restare solo.","advantages":["Aggressione Sconsiderata","Mano Lesta"],"skills":["Atletica","Empatia","Intimidire","Nascondersi","Rissa"]},
        {"name":"Pirata","nation":"Generale","desc":"Naviga per i mari, prendendo ciò che vuole e dando la vera libertà a chi è disposto a seguirlo.","quirk":"Ottiene un Punto Eroe ogni volta che si sacrifica per garantire la libertà di un altro.","advantages":["Mira Letale","Volontà Indomabile"],"skills":["Furto","Intimidire","Mira","Navigazione","Notare"]},
        {"name":"Professore","nation":"Generale","desc":"Insegna presso un istituto prestigioso.","quirk":"Ottiene un Punto Eroe ogni volta che usa la conoscenza di un trattato oscuro per risolvere un problema complesso.","advantages":["Cattedra","Gioco di Squadra"],"skills":["Allettare","Convincere","Empatia","Esibirsi","Istruzione"]},
        {"name":"Pugile","nation":"Generale","desc":"Si affida alle mani e ai piedi per risolvere tutti i problemi violenti della vita.","quirk":"Ottiene un Punto Eroe ogni volta che getta le armi e si affida ai pugni, a prescindere dall'armamento dell'avversario.","advantages":["Pugilatore","Sguardo di Ghiaccio"],"skills":["Atletica","Convincere","Empatia","Esibirsi","Rissa"]},
        {"name":"Quartiermastro","nation":"Generale","desc":"Serve a bordo di una nave, occupandosi di tutto ciò che il resto dell'equipaggio ignora.","quirk":"Ottiene un Punto Eroe ogni volta che risolve un problema dell'equipaggio.","advantages":["Fatto!","Gambe da Marinaio","Manualità"],"skills":["Arte della Guerra","Mira","Nascondersi","Navigazione","Rissa"]},
        {"name":"Sacerdote","nation":"Generale","desc":"Serve una causa superiore con ogni suo respiro.","quirk":"Ottiene un Punto Eroe ogni volta che lascia da parte la retorica e mette in pratica le virtù che professa.","advantages":["Consacrato","Ispirare Generosità"],"skills":["Allettare","Cavalcare","Empatia","Esibirsi","Istruzione"]},
        {"name":"Servitore","nation":"Generale","desc":"Lavora per compiere la volontà del proprio signore, qualsiasi essa sia.","quirk":"Ottiene un Punto Eroe ogni volta che si mette in pericolo per assistere qualcuno in un compito difficile.","advantages":["Gioco di Squadra","In Balia degli Eventi"],"skills":["Allettare","Cavalcare","Furto","Nascondersi","Notare"]},
        {"name":"Soldato","nation":"Generale","desc":"Sa come combattere e come uccidere; si guadagna da vivere militando sotto gli stendardi e al comando dei lord.","quirk":"Ottiene un Punto Eroe ogni volta che segue il piano a prescindere dai rischi personali.","advantages":["Bevitore Emerito","Solo Contro Tutti"],"skills":["Arte della Guerra","Intimidire","Mira","Mischia","Notare"]},
        {"name":"Spia","nation":"Generale","desc":"Serve la propria Nazione infiltrandosi tra i suoi nemici e carpendo i loro segreti.","quirk":"Ottiene un Punto Eroe ogni volta che corre un grosso rischio per scoprire un segreto.","advantages":["Immunità ai Veleni","Opportunista"],"skills":["Allettare","Empatia","Furto","Nascondersi","Notare"]},
        {"name":"Studioso","nation":"Generale","desc":"Si dedica ad apprendere e documentare tutte le meraviglie del creato.","quirk":"Ottiene un Punto Eroe ogni volta che si metti nei guai per ottenere conoscenza.","advantages":["Linguista","Università"],"skills":["Convincere","Empatia","Esibirsi","Istruzione","Notare"]},
        {"name":"Ufficiale dell'Esercito","nation":"Generale","desc":"Arruolato nell'esercito, ben presto si è trovato in una posizione di comando.","quirk":"Ottiene un Punto Eroe ogni volta che prende il comando in una situazione di pericolo o estrema violenza.","advantages":["Accademia Militare","Senso dell'Orientamento"],"skills":["Arte della Guerra","Atletica","Cavalcare","Intimidire","Mira"]},
        {"name":"Ufficiale di Marina","nation":"Generale","desc":"Arruolato in marina, si è fatto strada fino al comando di una nave.","quirk":"Ottiene un Punto Eroe ogni volta che antepone i bisogni dell'equipaggio alla missione.","advantages":["Equilibrio Perfetto","Gambe da Marinaio","Mercanteggiare"],"skills":["Arte della Guerra","Intimidire","Mischia","Navigazione","Notare"]},
        {"name":"Agente Unificatore","nation":"Avalon","desc":"Ha ricevuto dalla Corona di Avalon il compito di mantenere la pace tra le Isole.","quirk":"Ottiene un Punto Eroe ogni volta che assicura la stabilità dell'alleanza tra le Isole Incantate.","advantages":["Esperto di Sopravvivenza","Università"],"skills":["Allettare","Empatia","Istruzione","Mira","Notare"]},
        {"name":"Bardo","nation":"Avalon","desc":"Narra vecchi racconti, le storie delle Leggende, per assicurarsi che l'anima di Avalon non sia mai dimenticata.","quirk":"Ottiene un Punto Eroe ogni volta che risolve un problema seguendo l'esempio di una Leggenda.","advantages":["Bevitore Emerito","Mercanteggiare","Virtuoso"],"skills":["Cavalcare","Convincere","Empatia","Esibirsi","Mira"]},
        {"name":"Cavaliere Errante","nation":"Avalon","desc":"È imbevuto della leggendaria magia dei Cavalieri di Re Elilodd.","quirk":"Ottiene un Punto Eroe ogni volta che sostiene un ideale di virtù cavalleresca e finisce nei guai per questo.","advantages":["Senso dell'Orientamento","Stregoneria"],"skills":["Arte della Guerra","Cavalcare","Intimidire","Mischia","Rissa"]},
        {"name":"Corsaro","nation":"Avalon","desc":"Ha ricevuto una lettera di corsa per affondare tutte le navi nemiche di Avalon.","quirk":"Ottiene un Punto Eroe ogni volta che sconfigge i nemici di Avalon.","advantages":["Equilibrio Perfetto","La Fortuna del Diavolo"],"skills":["Allettare","Furto","Mischia","Navigazione","Notare"]},
        {"name":"Puritano","nation":"Avalon","desc":"È un Obiezionista riformato che cerca di \"purificare\" la Chiesa di Avalon da tutte le pratiche dei Vaticini.","quirk":"Ottiene un Punto Eroe ogni volta che dimostra la corruzione, l'ipocrisia o l'inefficienza della Chiesa del Vaticinio.","advantages":["Approccio Dinamico","Fama"],"skills":["Cavalcare","Convincere","Empatia","Intimidire","Istruzione"]},
        {"name":"Saoi (Saggio)","nation":"Inismore","desc":"Ha ricevuto la massima onorificenza da parte della *Aosdána*, un'associazione di artisti Inish supportata dallo stato.","quirk":"Ottiene un Punto Eroe ogni volta che si mette in pericolo per proteggere gli artisti di Théah.","advantages":["Bevitore Emerito","Gioco di Squadra","Sorriso Disarmante"],"skills":["Atletica","Convincere","Empatia","Esibirsi","Mischia"]},
        {"name":"Seanchaidh (Poeta-Guerriero)","nation":"Le Marche delle Highland","desc":"È un cantastorie e uno storico, esperto delle leggi e degli antichi costumi della sua gente.","quirk":"Ottiene un Punto Eroe ogni volta che fa rispettare le antiche leggi del suo popolo.","advantages":["Linguista","Solo Contro Tutti"],"skills":["Cavalcare","Convincere","Esibirsi","Mischia","Notare"]},
        {"name":"Alchimista","nation":"Castille","desc":"Ha indagato a lungo e duramente fino a scoprire il mistero della creazione alchemica.","quirk":"Ottiene un Punto Eroe ogni volta che migliora la vita di un altro mediante l'alchimia.","advantages":["Alchimista","Stomaco di Ferro"],"skills":["Allettare","Empatia","Furto","Istruzione","Notare"]},
        {"name":"Antropologo","nation":"Castille","desc":"Affine all'Archeologo, si concentra sullo studio dei popoli anziché sulle rovine lasciate da questi.","quirk":"Ottiene un Punto Eroe ogni volta che risolve i problemi di un gruppo di stranieri.","advantages":["Linguista","Università"],"skills":["Atletica","Convincere","Empatia","Istruzione","Notare"]},
        {"name":"Diestro","nation":"Castille","desc":"Ha dedicato la propria vita allo studio della spada in tutti i suoi aspetti.","quirk":"Ottiene un Punto Eroe ogni volta che sconfigge un duellante addestrato.","advantages":["Schermidore","Sorriso Disarmante"],"skills":["Atletica","Empatia","Intimidire","Istruzione","Mischia"]},
        {"name":"Mirabilis (Sacerdote)","nation":"Castille","desc":"È uno dei più esperti accademici della Chiesa del Vaticinio e membro dell'Ordo Doctorem Mirabilis.","quirk":"Ottiene un Punto Eroe ogni volta che dà prova dell'amore e della compassione della Chiesa.","advantages":["Consacrato","Lampo di Genio"],"skills":["Cavalcare","Convincere","Empatia","Esibirsi","Istruzione"]},
        {"name":"Hexe","nation":"Eisen","desc":"È un maestro dell'*Hexenwerk*, la stregoneria dei morti.","quirk":"Ottiene un Punto Eroe ogni volta che ignora ogni altra responsabilità per assicurarsi che i morti riposino in pace.","advantages":["Stomaco di Ferro","Stregoneria"],"skills":["Allettare","Atletica","Intimidire","Mischia","Notare"]},
        {"name":"Krieger (Guerriero)","nation":"Eisen","desc":"È sopravvissuto alla Guerra della Croce e porta le cicatrici di molte battaglie.","quirk":"Ottiene un Punto Eroe ogni volta che decide di combattere per difendere gli inermi o prevenire distruzioni.","advantages":["Accademia Militare","Sguardo di Ghiaccio"],"skills":["Arte della Guerra","Atletica","Cavalcare","Mira","Mischia"]},
        {"name":"Ungetümjäger (Cacciatore di Mostri)","nation":"Eisen","desc":"Sa che nella sua patria esistono creature innaturali a piede libero e ha giurato di distruggerle.","quirk":"Ottiene un Punto Eroe ogni volta che si dedica a cacciare una creatura inumana per impedirle di spargere altro male.","advantages":["Non Morirò Qui","Volontà Indomabile"],"skills":["Atletica","Mira","Mischia","Notare","Rissa"]},
        {"name":"Vitalienbruder (Pirata)","nation":"Eisen","desc":"È uno dei molti Eiseniani dediti a un commercio più giusto e ad eque divisioni.","quirk":"Ottiene un Punto Eroe ogni volta che ruba ai ricchi per dare ai poveri.","advantages":["Comando","Gambe da Marinaio","Scafato"],"skills":["Arte della Guerra","Furto","Nascondersi","Navigazione","Rissa"]},
        {"name":"L'Ami du Roi (Cortigiano)","nation":"Montaigne","desc":"È letteralmente un favorito dell'Empereur.","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta il favore del sovrano per risolvere un problema.","advantages":["Amicizie Altolocate","Contatto","Linguista"],"skills":["Allettare","Cavalcare","Convincere","Esibirsi","Mischia"]},
        {"name":"Mousquetaire","nation":"Montaigne","desc":"Ha fatto giuramento di difendere il sovrano e i suoi compagni moschettieri fino all'ultimo respiro.","quirk":"Ottiene un Punto Eroe ogni volta che subisce una grave ferita per proteggere il Re o i suoi camerati.","advantages":["Cameratismo","Riflessi Rapidi"],"skills":["Cavalcare","Intimidire","Mira","Mischia","Notare"]},
        {"name":"Révolutionnaire","nation":"Montaigne","desc":"Ha promesso di liberare la patria dalla tirannia di nobili.","quirk":"Ottiene un Punto Eroe ogni volta che si sacrifica in nome della libertà.","advantages":["Divincolarsi","Gioia di Vivere"],"skills":["Cavalcare","Furto","Mischia","Nascondersi","Notare"]},
        {"name":"Sorcier Porté","nation":"Montaigne","desc":"È un maestro nell'arte del *Porté*, l'apertura di varchi magici.","quirk":"Ottiene un Punto Eroe ogni volta che chiude una *Blessure* creata da un Malvagio.","advantages":["Orologio Biologico","Stregoneria"],"skills":["Allettare","Cavalcare","Empatia","Istruzione","Nascondersi"]},
        {"name":"Poseł (Inviato)","nation":"Sarmatia","desc":"Agisce come consigliere per tutti i votanti della Confederazione.","quirk":"Ottiene un Punto Eroe ogni volta che insiste per una soluzione democratica quando sarebbe vantaggioso non votare.","advantages":["Comando","Scuola di Maniere"],"skills":["Allettare","Convincere","Empatia","Esibirsi","Intimidire"]},
        {"name":"Tremtis (Esule)","nation":"Sarmatia","desc":"Dopo la dichiarazione della Libertà Dorata, è fuggito dalla Confederazione cercando asilo.","quirk":"Ottiene un Punto Eroe ogni volta che un elemento del passato torna a perseguitarlo.","advantages":["Contatto","Oriundo","Scafato"],"skills":["Empatia","Furto","Nascondersi","Notare","Rissa"]},
        {"name":"Ussaro Alato","nation":"Sarmatia","desc":"Serve nel più celebre reggimento di cavalleria, l'élite dell'esercito Sarmatiano.","quirk":"Ottiene un Punto Eroe ogni volta che, con il suo destriero, si lancia a testa bassa in uno scontro senza badare ai rischi.","advantages":["Gioco di Squadra","L'Unione Fa la Forza"],"skills":["Arte della Guerra","Cavalcare","Convincere","Mischia","Notare"]},
        {"name":"Żynys (Veggente)","nation":"Sarmatia","desc":"Ha incontrato e ingannato il Diavolo, che ora è al suo servizio.","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta qualcosa di malvagio per compiere il bene.","advantages":["Linguista","Stregoneria"],"skills":["Atletica","Convincere","Esibirsi","Istruzione","Mischia"]},
        {"name":"Baleniere","nation":"Ussura","desc":"Naviga nelle gelide acque di Ussura armato di arpione, alla caccia dei più pericolosi abitanti del mare.","quirk":"Ottiene un Punto Eroe ogni volta che affronta una creatura tanto grande da poter ingoiare un uomo intero.","advantages":["Bevitore Emerito","Gambe da Marinaio","Mecenate"],"skills":["Atletica","Mischia","Navigazione","Notare","Rissa"]},
        {"name":"Cosacco","nation":"Ussura","desc":"Vive nelle steppe orientali di Ussura, un luogo con una orgogliosa tradizione di allevamento dei cavalli e di guerra.","quirk":"Ottiene un Punto Eroe ogni volta che abbandona qualcosa di importante per viaggiare più leggero.","advantages":["Aggressione Sconsiderata","Forte Come Dieci Uomini"],"skills":["Cavalcare","Intimidire","Mischia","Notare","Rissa"]},
        {"name":"Progressista","nation":"Ussura","desc":"Viaggia in tutta Théah per trovare innovazioni con cui modernizzare la sua patria.","quirk":"Ottiene un Punto Eroe ogni volta che rischia la vita per ottenere una tecnologia avanzata.","advantages":["Contatto","Famiglia Allargata","Manualità"],"skills":["Allettare","Atletica","Cavalcare","Convincere","Empatia"]},
        {"name":"Toccato da Matushka","nation":"Ussura","desc":"Matushka gli ha conferito un grande potere a un prezzo terribile.","quirk":"Ottiene un Punto Eroe ogni volta che dà una lezione a qualcuno in un modo che renderebbe Matushka orgogliosa.","advantages":["Esperto di Sopravvivenza","Stregoneria"],"skills":["Allettare","Atletica","Esibirsi","Furto","Intimidire"]},
        {"name":"Bearsark","nation":"Vestenmennavenjar","desc":"Quando combatte cade in una sorta di trance furiosa e quasi incontrollabile.","quirk":"Ottiene un Punto Eroe ogni volta che lascia che sia il GM a decidere la sua prossima azione.","advantages":["Bevitore Emerito","Duro da Uccidere"],"skills":["Arte della Guerra","Intimidire","Mischia","Navigazione","Rissa"]},
        {"name":"Guildmästaren","nation":"Vestenmennavenjar","desc":"Serve la Lega Vendel e ha un ruolo amministrativo nelle Gilde.","quirk":"Ottiene un Punto Eroe ogni volta che usa le vaste risorse della Lega per qualcosa di più nobile del mero profitto.","advantages":["Mastro Artigiano","Ricco"],"skills":["Allettare","Cavalcare","Convincere","Empatia","Istruzione"]},
        {"name":"Sjørøver (Pirata)","nation":"Vestenmennavenjar","desc":"Onora l'antica tradizione Vestenmennavenjar di guerra navale e saccheggio.","quirk":"Ottiene un Punto Eroe ogni volta che si espone a un pericolo per garantirsi l'onore di sedere alla tavola del Padre di Tutti.","advantages":["Sguardo di Ghiaccio","Ti Porto Con Me"],"skills":["Intimidire","Mischia","Navigazione","Notare","Rissa"]},
        {"name":"Skald","nation":"Vestenmennavenjar","desc":"Interpreta i misteri del fuoco e delle ossa, condividendo racconti di gloria e sconfitta.","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta la propria abilità di *Seidr* per aiutare un altro Eroe a risolvere un problema o sconfiggere un Malvagio.","advantages":["Gambe da Marinaio","Seidr"],"skills":["Esibirsi","Intimidire","Mischia","Navigazione","Rissa"]},
        {"name":"Ambasciatore Itinerante","nation":"Vodacce","desc":"Viaggia per il mondo in nome e per conto di un Principe Mercante.","quirk":"Ottiene un Punto Eroe ogni volta che usa conoscenze o oggetti non di Théah per risolvere un problema.","advantages":["Linguista","Scuola di Maniere"],"skills":["Allettare","Convincere","Empatia","Intimidire","Navigazione"]},
        {"name":"Bravo","nation":"Vodacce","desc":"Ha giurato di proteggere qualcuno ed è sempre al suo fianco.","quirk":"Ottiene un Punto Eroe ogni volta che corre un rischio per proteggere la vita della persona che ha giurato di difendere.","advantages":["Duro da Uccidere","Immunità ai Veleni"],"skills":["Atletica","Empatia","Intimidire","Mischia","Notare"]},
        {"name":"Consigliere","nation":"Vodacce","desc":"Agisce come braccio destro di un Principe Mercante.","quirk":"Ottiene un Punto Eroe ogni volta che corre un grosso rischio per proteggere i segreti altrui.","advantages":["Non Siamo Poi Così Diversi","Scafato"],"skills":["Allettare","Cavalcare","Convincere","Empatia","Notare"]},
        {"name":"Strega della Sorte","nation":"Vodacce","desc":"Nota: Solo gli Eroi femminili possono scegliere questo Background. Può percepire, piegare e controllare i fili del Fato con la sua volontà... ma questo ha un prezzo.","quirk":"Ottiene un Punto Eroe ogni volta che si sottomette a un corso d'azione pericoloso convinta che sia il volere del destino.","advantages":["Orologio Biologico","Stregoneria"],"skills":["Allettare","Cavalcare","Convincere","Esibirsi","Nascondersi"]},
        // NAZIONI DI THÉAH: VOLUME 1 (pagg. 203-205)
        {"name":"Scudiero Sidhe","nation":"Isole Incantate","source":"Nazioni di Théah Vol. 1","desc":"I Sidhe sono tornati ad Avalon. Il suo compito è fare in modo che la transizione sia la più pacifica possibile.","quirk":"Ottiene un Punto Eroe quando si mette in pericolo per mediare tra umani e Sidhe, imparando, nel processo, a comprendere meglio entrambi.","advantages":["Un Semplice Malinteso","Stregoneria (Cavaliere di Avalon)"],"skills":["Cavalcare","Convincere","Empatia","Istruzione","Mischia"]},
        {"name":"Conservatore Reale","nation":"Avalon","source":"Nazioni di Théah Vol. 1","desc":"Avalon è una terra meravigliosa. La Regina lo ha incaricato di fare in modo che resti tale.","quirk":"Ottiene un Punto Eroe ogni volta che per preservare una meraviglia naturale si mette nei guai.","advantages":["Cecchino","Disciplina di Fuoco","Senso dell’Orientamento"],"skills":["Atletica","Empatia","Istruzione","Mira","Notare"]},
        {"name":"Navigatore delle Shannagary","nation":"Le Marche delle Highland","source":"Nazioni di Théah Vol. 1","desc":"Un abile marinaio è capace di portare la propria nave attraverso le Shannagary in tre giorni, con qualche graffio è possibile farlo in due.","quirk":"Ottiene un Punto Eroe ogni volta che decide di sacrificare la sicurezza per la rapidità e ciò lo mette nei guai.","advantages":["Prendere il Vento","Sposato al Mare"],"skills":["A.d. Guerra","Atletica","Navigazione","Notare","Rissa"]},
        {"name":"Dornálaí","nation":"Inismore","source":"Nazioni di Théah Vol. 1","desc":"“Ehi, sei un bestione. Scommetto che sai fare a pugni, vero?”","quirk":"Ottiene un Punto Eroe ogni volta che, dopo uno scontro vinto o perso, si scorda il passato e diventa amico del suo avversario.","advantages":["Bevitore Emerito","Gancio","Pugilatore"],"skills":["Atletica","Convincere","Intimidire","Notare","Rissa"]},
        {"name":"Boticario","nation":"Castille","source":"Nazioni di Théah Vol. 1","desc":"La scienza è meravigliosa.","quirk":"Ottiene un Punto Eroe ogni volta che persegue con determinazione la ricerca di un segreto alchemico e questa insistenza lo mette nei guai.","advantages":["Stomaco di Ferro","Stregoneria (Alquimia)","Stregoneria (Alquimia)"],"skills":["Convincere","Empatia","Istruzione","Nascondersi","Notare"]},
        {"name":"La Joven Promesa","nation":"Castille","source":"Nazioni di Théah Vol. 1","desc":"Può non avere vinto il torneo a el Baile, ma è stato riconosciuto come un prodigio da tenere d’occhio.","quirk":"Ottiene un Punto Eroe ogni volta che complica volontariamente una situazione per migliorare le proprie abilità di schermidore e la propria reputazione.","advantages":["Fama","Studioso di Lotta"],"skills":["Atletica","Empatia","Esibirsi","Notare","Mischia"]},
        {"name":"Sabueso Real","nation":"Castille","source":"Nazioni di Théah Vol. 1","desc":"I nemici degli Investigatori Reali possono credere sia solo un altro dei “cani da caccia” del re, ma parlano da dietro le sbarre.","quirk":"Ottiene un Punto Eroe quando si rifiuta di agire finché non ha raccolto ulteriori informazioni, anche se ciò gli causa ancora più problemi.","advantages":["Opportunista","Scafato"],"skills":["Empatia","Furto","Mira","Nascondersi","Notare"]},
        {"name":"Tercio","nation":"Castille","source":"Nazioni di Théah Vol. 1","desc":"Ha firmato per arruolarsi e diventare un hidalgo. È andato tutto male, ma non ha ancora perso la speranza.","quirk":"Ottiene un Punto Eroe ogni volta che sposa una causa in cerca di redenzione, del perdono per crimini passati o della possibilità di ottenere un titolo nobiliare.","advantages":["Esperto di Sopravvivenza","Schermidore","Turbine d’Acciaio"],"skills":["A.d. Guerra","Atletica","Mira","Mischia","Notare"]},
        {"name":"Balayeur","nation":"Montaigne","source":"Nazioni di Théah Vol. 1","desc":"Per lavoro ripulisce le strade con una “scopa” che sputa piombo e divora polvere nera.","quirk":"Ottiene un Punto Eroe ogni volta che mantiene il controllo di una situazione caotica, anche se in inferiorità numerica.","advantages":["Come Pesci in un Barile","Mira Letale","Senso dell’Orientamento"],"skills":["Empatia","Intimidire","Mira","Notare","Rissa"]},
        {"name":"Épée Sanglante","nation":"Montaigne","source":"Nazioni di Théah Vol. 1","desc":"Apprendere l’arte della spada e del sangue conferisce il titolo di épée sanglante, oltre all’ammirazione e al terrore dei propri pari.","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta il timore che gli altri hanno delle sue capacità per evitare uno scontro, a prescindere che questi pregiudizi siano corretti o no.","advantages":["Sala d’Armi (De Vore)","Stregoneria (Porté)"],"skills":["Atletica","Intimidire","Istruzione","Mischia","Notare"]},
        {"name":"Evaso dal Passaggio","nation":"Montaigne","source":"Nazioni di Théah Vol. 1","desc":"Per un tempo incalcolabile è stato intrappolato nel Passaggio, ma è riuscito a scappare… non che se ne ricordi. In effetti non ricorda nulla della propria vita prima di quel momento… per ora.","quirk":"Ottiene un Punto Eroe ogni volta che il suo passato torna a perseguitarlo e ciò gli causa problemi.","advantages":["Approccio Dinamico","Spirito Valoroso"],"skills":["Allettare","Convincere","Empatia","Intimidire","Notare"]},
        {"name":"La Souris du Marché","nation":"Montaigne","source":"Nazioni di Théah Vol. 1","desc":"Conosce le strade come il palmo della sua mano.","quirk":"Ottiene un Punto Eroe ogni volta che decide di condividere i frutti delle proprie malefatte con chi ne ha più bisogno di lui.","advantages":["Mano Lesta","Questa è la Mia Città"],"skills":["Convincere","Empatia","Istruzione","Nascondersi","Notare"]},
        {"name":"La Voix des Sans-Voix","nation":"Montaigne","source":"Nazioni di Théah Vol. 1","desc":"Parla per coloro che non hanno voce, perché troppo deboli o spaventati.","quirk":"Ottiene un Punto Eroe ogni volta che rifiuta una soluzione che gli darebbe un vantaggio personale, ma risulterebbe dannosa per coloro che rappresenta.","advantages":["Fama","Requisitoria Feroce"],"skills":["Convincere","Empatia","Intimidire","Istruzione","Notare"]},
        {"name":"Hrungnir","nation":"Vestenmennavenjar","source":"Nazioni di Théah Vol. 1","desc":"Non occorre una spada per essere pericolosi.","quirk":"Ottiene un Punto Eroe ogni volta che qualcuno lo sottovaluta per la mancanza di un’arma e questo pregiudizio viene trasformato in un vantaggio.","advantages":["Bevitore Emerito","Rissoso","Tutto è un’Arma se Usato nel Modo Giusto"],"skills":["Atletica","Intimidire","Nascondersi","Notare","Rissa"]},
        {"name":"Murskaaja","nation":"Vestenmennavenjar","source":"Nazioni di Théah Vol. 1","desc":"Una linea di difesa è forte solo quanto l’anello più debole. È un esperto nel trovarlo e distruggerlo.","quirk":"Ottiene un Punto Eroe ogni volta che si getta a testa bassa in una situazione pericolosa per cogliere di sorpresa i propri avversari.","advantages":["Mano Pesante","Senso dell’Orientamento","Sulla Breccia"],"skills":["A.d. Guerra","Atletica","Cavalcare","Mischia","Nascondersi"]},
        {"name":"Pankkiiri","nation":"Vestenmennavenjar","source":"Nazioni di Théah Vol. 1","desc":"Il denaro è un linguaggio e possiede un vasto registro linguistico.","quirk":"Ottiene un Punto Eroe ogni volta che sfrutta la propria posizione o il proprio denaro per costringere un altro personaggio ad agire in un certo modo e ciò lo mette nei guai.","advantages":["Mecenate (Lega Vendel)","Indorare la Pillola"],"skills":["Convincere","Empatia","Istruzione","Mira","Navigazione"]},
        {"name":"Vala","nation":"Vestenmennavenjar","source":"Nazioni di Théah Vol. 1","desc":"Scrivani e politici moderni credono che le parole abbiano potere. Non hanno idea di quanto abbiano ragione.","quirk":"Ottiene un Punto Eroe ogni volta che si rifiuta di risolvere un problema ricorrendo alla magia – anche se sarebbe più semplice – perché lo considera insignificante.","advantages":["Linguista","Stregoneria (Galdr)","Stregoneria (Galdr)"],"skills":["Cavalcare","Convincere","Esibirsi","Intimidire","Istruzione"]},
        // NAZIONI DI THÉAH: VOLUME 2 (pagg. 203-204)
        {"name":"Apostata","nation":"Eisen","source":"Nazioni di Théah Vol. 2","desc":"Cacciato dalla patria a causa delle sue capacità. Questo non gli impedirà di fare ciò che è giusto.","quirk":"Ottiene un Punto Eroe quando sceglie di allearsi con qualcuno che trova ripugnante pur di conseguire un obiettivo importante.","advantages":["Fama","Stomaco di Ferro","Stregoneria (Hexenwerk)"],"skills":["Atletica","Cavalcare","Empatia","Notare","Rissa"]},
        {"name":"Befleckte Seele","nation":"Eisen","source":"Nazioni di Théah Vol. 2","desc":"Dentro di sé nasconde qualcosa di oscuro e maligno, che attanaglia i margini della sua mente, ma persino questo potere nato dal male può essere usato per il bene.","quirk":"Ottiene un Punto Eroe quando usa la propria natura Mostruosa per risolvere un problema e altri lo respingono per questo.","advantages":["Dono Oscuro"],"skills":["Atletica","Cavalcare","Empatia","Furto","Nascondersi"]},
        {"name":"Eisenblut","nation":"Eisen","source":"Nazioni di Théah Vol. 2","desc":"C’è ancora nobiltà a Eisen e ferro nel sangue dei suoi abitanti.","quirk":"Ottiene un Punto Eroe quando sceglie di sacrificare qualcosa di importante per sé in nome del bene di Eisen e del suo popolo.","advantages":["Ricco","Sguardo Imperioso"],"skills":["A.d. Guerra","Cavalcare","Empatia","Intimidire","Istruzione"]},
        {"name":"Stratega","nation":"Eisen","source":"Nazioni di Théah Vol. 2","desc":"Ottimo giocatore di scacchi sin da bambino, ora comprende che tutto il mondo è una scacchiera… e lui è ancora il miglior giocatore.","quirk":"Ottiene un Punto Eroe quando un errore critico nei suoi piani mette nei guai se stesso o i propri alleati.","advantages":["Gioco di Squadra","Mente del Gruppo"],"skills":["A.d. Guerra","Empatia","Istruzione","Mira","Mischia"]},
        {"name":"Macher","nation":"Sarmatia","source":"Nazioni di Théah Vol. 2","desc":"Entrare. Arraffare ciò che serve. Uscire… assicurarsi che TUTTI ne escano vivi.","quirk":"Ottiene un Punto Eroe quando decide di rivelare la propria presenza a un nemico per aiutare un altro a cavarsi d’impaccio.","advantages":["Gioco di Squadra","Specialista (Nascondersi)"],"skills":["Atletica","Convincere","Furto","Nascondersi","Notare"]},
        {"name":"Mówca","nation":"Sarmatia","source":"Nazioni di Théah Vol. 2","desc":"C’è del bene in tutti, alcuni hanno solo bisogno di aiuto per trovarlo.","quirk":"Ottiene un Punto Eroe quando risolve un problema convincendo altri ad ascoltare la propria coscienza.","advantages":["Appello Accorato","Un Semplice Malinteso"],"skills":["Allettare","Convincere","Empatia","Istruzione","Nascondersi"]},
        {"name":"Rycerz Ludzi","nation":"Sarmatia","source":"Nazioni di Théah Vol. 2","desc":"Un cavaliere del popolo, che difende i comuni cittadini da ogni minaccia.","quirk":"Ottiene un Punto Eroe quando risolve una situazione convincendo un gruppo di persone ad affrontarla uniti e solo con le proprie forze.","advantages":["Comando","Lama Fulminea","Linguista"],"skills":["Cavalcare","Convincere","Empatia","Mischia","Notare"]},
        {"name":"Rycerz Senatu","nation":"Sarmatia","source":"Nazioni di Théah Vol. 2","desc":"Porta la parola del Senat. Ha la facoltà di imporre il suo volere e risponde solo alla Camera Alta.","quirk":"Ottiene un Punto Eroe ogni volta che decide di nascondere qualcosa alle autorità per motivi nobili, anche se ciò lo mette nei guai.","advantages":["Linguista","Mecenate (Senat)"],"skills":["Atletica","Cavalcare","Convincere","Empatia","Mischia"]},
        {"name":"Borets","nation":"Ussura","source":"Nazioni di Théah Vol. 2","desc":"Celebre per essere un eccezionale praticante di lotta libera Ussurana.","quirk":"Ottiene un Punto Eroe quando viene riconosciuto a causa della propria fama, ma preferirebbe che non fosse successo.","advantages":["Colpo a Segno","Fama"],"skills":["Atletica","Esibirsi","Intimidire","Nascondersi","Rissa"]},
        {"name":"Doverchivii Dusha","nation":"Ussura","source":"Nazioni di Théah Vol. 2","desc":"Crede a tutte le storie tristi, ma preferisce fidarsi della persona sbagliata, piuttosto che allontanare chi ha davvero bisogno.","quirk":"Ottiene un Punto Eroe ogni volta che un altro personaggio riesce a mentirgli o manipolarlo e questo lo mette nei guai.","advantages":["Fiducioso","Spirito Valoroso"],"skills":["Convincere","Empatia","Furto","Istruzione","Notare"]},
        {"name":"Razrushitel","nation":"Ussura","source":"Nazioni di Théah Vol. 2","desc":"Perché aggirare l’ostacolo quando si può sfondarlo?","quirk":"Ottiene un Punto Eroe ogni volta che sceglie un approccio diretto, roboante e privo di qualsiasi finezza.","advantages":["Forte Come Dieci Uomini","Palla Demolitrice"],"skills":["A.d. Guerra","Atletica","Cavalcare","Esibirsi","Rissa"]},
        {"name":"Maledetto da Tură","nation":"Ussura","source":"Nazioni di Théah Vol. 2","desc":"Ha scoperto sulla propria pelle che c’è più di una via per il potere.","quirk":"Ottiene un Punto Eroe ogni volta che si mette nei guai per aver convinto un altro personaggio a sfidare l’autorità o ad agire contro le comuni convenzioni sociali.","advantages":["Senso dell’Orientamento","Stregoneria (Tocco di Tură)","Stregoneria (Tocco di Tură)"],"skills":["Allettare","Convincere","Istruzione","Nascondersi","Notare"]},
        {"name":"Casanova","nation":"Vodacce","source":"Nazioni di Théah Vol. 2","desc":"Che senso ha l’amore senza un pizzico – o un bel po' – di pericolo?","quirk":"Ottiene un Punto Eroe quando si mette nei guai per avere lasciato che un altro personaggio la facesse franca perché ne era innamorato.","advantages":["Amoreggiare con il Pericolo","Orologio Biologico"],"skills":["Allettare","Convincere","Esibirsi","Furto","Nascondersi"]},
        {"name":"Comandante","nation":"Vodacce","source":"Nazioni di Théah Vol. 2","desc":"Non c’è nulla che non possa fare con una nave sotto i piedi, il vento alle spalle e un equipaggio.","quirk":"Ottiene un Punto Eroe quando intraprende un corso d’azione pericoloso, spinto dal coraggio e dall’ego.","advantages":["O Capitano, Mio Capitano","Gambe da Marinaio","Sposato al Mare"],"skills":["Convincere","Empatia","Intimidire","Mira","Navigazione"]},
        {"name":"Pistola Nascosta","nation":"Vodacce","source":"Nazioni di Théah Vol. 2","desc":"Quando vedono la canna della sua pistola è già troppo tardi. Speriamo non si arrivi a tanto.","quirk":"Ottiene un Punto Eroe quando risolve una situazione con la minaccia della violenza, ma senza sfoderare la propria arma.","advantages":["Estrazione Rapida","Sguardo di Ghiaccio"],"skills":["Allettare","Atletica","Empatia","Intimidire","Mira"]},
        {"name":"Strega Selvaggia","nation":"Vodacce","source":"Nazioni di Théah Vol. 2","desc":"Possiede una magia grezza, ma non per questo meno potente o pericolosa.","quirk":"Ottiene un Punto Eroe quando si mette nei guai per avere deciso di aiutare un altro personaggio usando i propri poteri magici non addestrati.","advantages":["Contatto","Oriundo","Stregoneria (Sorte Non Addestrata)"],"skills":["Convincere","Empatia","Esibirsi","Furto","Nascondersi"]}
    ];

    const advantagesDb = [
        {"name": "Bevitore Emerito", "cost": 1, "description": "L’alcol non ha mai effetti negativi sull’Eroe, non importa quanto ne beva."},
        {"name": "Colosso", "cost": 1, "innate": true, "description": "Non cumulabile con 'Minuto'. Ottieni 1 Dado Bonus nei Rischi fisici in cui la mole corporea costituisca un chiaro vantaggio."},
        {"name": "Esperto Di Sopravvivenza", "cost": 1, "description": "In qualsiasi regione selvaggia raccogli o cacci cibo sufficiente per te e altri 5 compagni."},
        {"name": "Gambe Da Marinaio", "cost": 1, "description": "Ottieni 1 Dado Bonus in tutti i Rischi fisici eseguiti a bordo di navi o sartiame."},
        {"name": "Linguista", "cost": 1, "description": "Parli, leggi e scrivi tutte le lingue conosciute di Théah, comprese quelle morte."},
        {"name": "Minuto", "cost": 1, "innate": true, "description": "Non cumulabile con 'Colosso'. Ottieni 1 Dado Bonus nei Rischi in cui la corporatura minuta è un vantaggio per passare inosservato o fuggire."},
        {"name": "Oriundo", "cost": 1, "innate": true, "description": "Cresciuto in una Nazione differente dalla patria: ottieni 1 Dado Bonus nei Rischi legati a tale doppia eredità culturale."},
        {"name": "Orologio Biologico", "cost": 1, "description": "Sai sempre l'ora esatta con lo scarto di un minuto e stimi con precisione albe e tramonti."},
        {"name": "Senso dell’Orientamento", "cost": 1, "description": "Finché hai un punto di riferimento nell'ambiente, non perdi mai la bussola né l'orientamento."},
        {"name": "Stomaco Di Ferro", "cost": 1, "description": "Cibo avariato, acqua stagnante o carne cruda non hanno effetti negativi sul tuo organismo."},
        {"name": "Come Pesci in un Barile", "cost": 1, "source": "Nazioni di Théah Vol. 1", "description": "Requisito: Mira Letale. Quando compi un Rischio di Mira con pistola, archibugio o arma da lancio contro una Squadra di Sgherri, puoi spendere 1 Incremento per ridurne la Forza di un valore pari al tuo Grado di Grazia."},
        {"name": "Disciplina di Fuoco", "cost": 1, "source": "Nazioni di Théah Vol. 1", "description": "Requisito: Cecchino. In un Rischio di Mira con moschetto, arco lungo o balestra contro una vittima inconsapevole, la prima volta che spendi Incrementi per infliggere Ferite puoi spendere 1 PE per causare 1 Ferita Drammatica aggiuntiva (1 volta per Scena)."},
        {"name": "Gancio", "cost": 1, "source": "Nazioni di Théah Vol. 1", "description": "Requisito: Pugilatore. In un Rischio di Rissa a mani nude, puoi spendere tutti i tuoi Incrementi nella prima Azione: il bersaglio subisce danni pari agli Incrementi spesi e perde metà dei propri Incrementi (arrotondati per difetto)."},
        {"name": "Sulla Breccia", "cost": 1, "source": "Nazioni di Théah Vol. 1", "description": "Requisito: Mano Pesante. In un Rischio di Mischia con claymore, zweihander, ascia da battaglia, alabarda o altra arma a due mani, puoi non lanciare i dadi all'inizio del Round ed eliminare automaticamente un'intera Squadra di Sgherri a prescindere dalla Forza."},
        {"name": "Turbine d’Acciaio", "cost": 1, "source": "Nazioni di Théah Vol. 1", "description": "Requisito: Schermidore. In un Rischio di Mischia con spada da scherma, daga, sciabola o altra arma a una mano, puoi non lanciare i dadi all'inizio del Round e dimezzare (per difetto) la Forza di tutte le Squadre di Sgherri presenti in Scena."},
        {"name": "Tutto è un’Arma se Usato nel Modo Giusto", "alias": "Tutto Può Essere un'Arma se Usato nel Modo Giusto", "cost": 1, "source": "Nazioni di Théah Vol. 1", "description": "Requisito: Rissoso. In un Rischio di Rissa con un'arma improvvisata, quando spendi 1 Incremento per causare Ferite puoi decidere che l'arma si rompa: le Ferite inflitte non possono essere prevenute in alcun modo (1 volta per Scena, o spendi 1 PE per procurarti una nuova arma)."},
        {"name": "Avaro", "cost": 1, "source": "Nazioni di Théah Vol. 2", "description": "Per ogni Grado di questo Vantaggio, puoi mettere da parte 1 Ricchezza tra un Episodio e l’altro (non crea Ricchezza dal nulla, permette solo di risparmiarla)."},
        {"name": "Motto Personale", "cost": 1, "source": "Nazioni di Théah Vol. 2", "description": "Scegli un motto, adagio o grido di guerra. Quando compi un Rischio dopo aver pronunciato il motto in circostanze appropriate, ottieni 1 Dado Bonus."},
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
        {"name": "Duellante Adattabile", "cost": 2, "source": "Nazioni di Théah Vol. 1", "description": "Requisito: Conoscere almeno 2 Stili di Duello. Spendi 1 PE per cambiare lo Stile prescelto nel corso di un Round, purché rispetti i requisiti del nuovo Stile (come le armi). Utilizzabile 1 volta per Round."},
        {"name": "Questa è la Mia Città", "cost": 2, "source": "Nazioni di Théah Vol. 1", "description": "Quando ti trovi in un luogo familiare, spendi 1 PE per seminare un pedinatore, individuare uno straniero, capire se qualcuno ti segue o trovare una scorciatoia."},
        {"name": "Appello Accorato", "cost": 2, "source": "Nazioni di Théah Vol. 2", "description": "Spendi 1 PE: implori un altro personaggio di seguire la propria coscienza, guardare dall’altra parte per il bene altrui o compiere un’altra azione giusta, anche se non è nel suo miglior interesse."},
        {"name": "Nato in Sella", "cost": 2, "source": "Nazioni di Théah Vol. 2", "description": "Spendi 1 PE: fai eseguire un’azione speciale al tuo cavallo (balzo incredibile, richiamo al fianco, evitare un attacco nemico o colpire con zoccoli e denti evitando o causando Ferite pari al tuo Grado di Cavalcare)."},
        {"name": "O Capitano, Mio Capitano", "cost": 2, "source": "Nazioni di Théah Vol. 2", "description": "Quando intraprendi un Rischio audace o pericoloso in mare, spendi 1 PE per ispirare gli alleati: ognuno ottiene un numero di Dadi Bonus pari al tuo Grado di Navigazione."},
        {"name": "Palla Demolitrice", "cost": 2, "source": "Nazioni di Théah Vol. 2", "description": "Spendi 1 PE: sfondi una porta, abbatti una barricata, ribalti un carro o distruggi in altro modo un oggetto grazie alla tua forza e impeto."},
        {"name": "Sguardo Imperioso", "cost": 2, "source": "Nazioni di Théah Vol. 2", "description": "Spendi 1 PE: imponi la tua autorità (reale o percepita) affinché un altro personaggio ti lasci in pace, se ne vada o consideri le tue azioni come il semplice capriccio di un nobile arrogante."},
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
        {"name": "Indorare la Pillola", "cost": 3, "source": "Nazioni di Théah Vol. 1", "description": "Puoi spendere 1 Ricchezza per corrompere un altro personaggio, durante una Sequenza d’Azione o Drammatica, senza usare Incrementi (1 volta per Sequenza)."},
        {"name": "Prendere il Vento", "cost": 3, "source": "Nazioni di Théah Vol. 1", "description": "Mentre conduci una nave, spendi 1 PE per raggiungere la destinazione più in fretta (la Nave subisce 1 Colpo Critico, ma il tempo di viaggio è ridotto di un quarto, o semini un inseguitore)."},
        {"name": "Requisitoria Feroce", "cost": 3, "source": "Nazioni di Théah Vol. 1", "description": "Quando compi un Rischio di Convincere o Intimidire, spendi 1 PE per dimezzare (arrotondando per difetto) la Forza di una singola Squadra di Sgherri presente in Scena."},
        {"name": "Studioso di Lotta", "cost": 3, "source": "Nazioni di Théah Vol. 1", "description": "Apprendi le Manovre Fendente, Parata e una terza a tua scelta non appartenente a uno Stile e puoi eseguirle come se fossi un Duellante. Il vantaggio Sala d’Armi ti costa solo 3 Punti."},
        {"name": "Colpo a Segno", "cost": 3, "source": "Nazioni di Théah Vol. 2", "description": "Quando spendi Incrementi per infliggere Ferite o eseguire una Manovra durante un Rischio di Rissa, puoi spendere Punti Eroe per causare danni aggiuntivi: ogni PE speso provoca 2 Ferite aggiuntive."},
        {"name": "Estrazione Rapida", "cost": 3, "source": "Nazioni di Théah Vol. 2", "description": "Quando compi un Rischio di Mira, spendi 1 PE per far sì che ogni coppia di risultati identici ti frutti 1 Incremento aggiuntivo (questi dadi possono essere usati anche per creare Incrementi come di norma)."},
        {"name": "Fiducioso", "cost": 3, "source": "Nazioni di Théah Vol. 2", "description": "Attivabile dopo che il GM ha acquistato i tuoi dadi non utilizzati durante un Rischio di Empatia: ottieni 2 Punti Eroe, invece del normale 1, per ogni dado acquistato (1 volta per Episodio)."},
        {"name": "Lama Fulminea", "cost": 3, "source": "Nazioni di Théah Vol. 2", "description": "Durante un Rischio di Mischia, quando spendi Incrementi per infliggere Ferite o eseguire una Manovra contro un personaggio o Squadra di Sgherri, spendi 1 PE per causare un eguale numero di Ferite a un altro personaggio o Squadra presente sulla Scena (1 volta per Round)."},
        {"name": "Mente del Gruppo", "cost": 3, "source": "Nazioni di Théah Vol. 2", "description": "Quando spendi 1 PE per conferire Dadi Bonus a un alleato durante un Rischio, puoi spenderne un secondo per conferire ulteriori Dadi Bonus pari al tuo Grado di Istruzione."},
        {"name": "Accademia Militare", "cost": 4, "innate": true, "description": "Aumenti di +1 il risultato di ogni dado tirato con Atletica, Cavalcare e Arte della Guerra."},
        {"name": "Alchimista", "cost": 4, "description": "(Solo Castilliani) Spendi 1 PE per miscelare elisir di potenziamento, fumo accecante o oli scivolosi."},
        {"name": "Compagno Fidato", "cost": 4, "description": "Hai al tuo fianco un devoto alleato PNG (o animale) che agisce con te lanciando 5 dadi nei Rischi."},
        {"name": "Duro Da Uccidere", "cost": 4, "description": "Disponi di un livello extra di salute: diventi Inerme solo alla 5ª Ferita Drammatica anziché alla 4ª."},
        {"name": "Fautore Di Miracoli", "cost": 4, "description": "Spendi 1 PE e 1 Incremento: curi un altro Eroe guarendogli immediatamente 1 Ferita Drammatica."},
        {"name": "Scuola Di Maniere", "cost": 4, "innate": true, "description": "Aumenti di +1 il risultato di ogni dado tirato nei Rischi sociali con Convincere, Intimidire o Allettare."},
        {"name": "Seidr", "cost": 4, "description": "(Solo Vesten) Spendi 1 PE per interrogare le rune con una domanda sì/no o scorgere il vero Nome arcano."},
        {"name": "Solo Contro Tutti", "cost": 4, "description": "Quando subisci danni da una Squadra di Sgherri, sottrai la tua Risolutezza dalle Ferite subite."},
        {"name": "Specialista", "cost": 4, "description": "In una delle tue Abilità a Grado 3+ improvvisi qualsiasi azione senza dover spendere Incrementi extra."},
        {"name": "Tratto Leggendario", "cost": 4, "description": "In un Tratto scelto lanci 1 dado in meno convertendolo in un 10 automatico permanente che esplode."},
        {"name": "Università", "cost": 4, "innate": true, "description": "Aumenti di +1 il risultato di tutti i dadi tirati nei Rischi di Istruzione, Empatia e Notare."},
        {"name": "Amoreggiare con il Pericolo", "cost": 4, "source": "Nazioni di Théah Vol. 2", "description": "Puoi attivare questo Vantaggio durante un Rischio di Allettare per obbligare il GM a comprare tutti i tuoi dadi inutilizzati (1 volta per Episodio)."},
        {"name": "Bussola Morale", "cost": 4, "source": "Nazioni di Théah Vol. 2", "description": "Requisito: Aver completato almeno una Storia di Redenzione e non avere Corruzione. Ogni volta che aiuti un altro Eroe a completare un Atto di una Storia di Redenzione, questi rimuove 2 Punti Corruzione invece di 1."},
        {"name": "Forte Come Dieci Uomini", "cost": 5, "description": "(3 pt se Ussurano) Spendi 1 PE in prove di pura forza: sommi Vigore a ciascun dado tirato."},
        {"name": "Gioia di Vivere", "alias": "Joie De Vivre", "cost": 5, "description": "(3 pt se Montaigne) Spendi 1 PE contro un Malvagio: tutti i compagni considerano 10 i dadi <= al proprio Grado."},
        {"name": "L’Unione Fa la Forza", "cost": 5, "description": "(3 pt se Sarmatiano) Spendi 1 PE: trasferisci istantaneamente qualsiasi numero dei tuoi Incrementi a un compagno."},
        {"name": "La Fortuna Del Diavolo", "cost": 5, "description": "(3 pt se Avaloniano) Spendi 1 PE dopo un tiro di Rischio: rilanci tutti i dadi che desideri tenendo il nuovo esito."},
        {"name": "Lampo Di Genio", "cost": 5, "description": "(3 pt se Castilliano) Spendi 1 PE in un campo di studio: ottieni un numero di Incrementi pari al tuo Acume."},
        {"name": "Non Morirò Qui", "cost": 5, "description": "(3 pt se Eiseniano) Spendi 1 PE: ignori ogni penalità delle Ferite Drammatiche per un intero round."},
        {"name": "Non Siamo Poi Così Diversi", "alias": "Non Siamo Poi Tanto Diversi…", "cost": 5, "description": "(3 pt se Vodacce) Spendi 1 PE: convinci un Malvagio di essere suo alleato finché non compi un gesto eroico evidente."},
        {"name": "Sala d’Armi", "cost": 5, "description": "Entri a far parte della Gilda dei Duellanti e apprendi uno Stile di Duello ufficiale di Théah. Puoi acquistare questo Vantaggio più volte per apprendere ulteriori Stili di Duello (costa 3 Punti se possiedi Studioso di Lotta)."},
        {"name": "Ti Porto Con Me", "cost": 5, "description": "(3 pt se Vesten) Spendi 1 PE: incrementi i danni inflitti del numero di Ferite Drammatiche che hai subito."},
        {"name": "Dono Oscuro", "cost": 5, "source": "Nazioni di Théah Vol. 2", "description": "Scegli una Qualità Mostruosa: spendi 1 PE per attivarla per un Round ottenendo gli stessi benefici di un Malvagio e +1 Punto Corruzione (acquistabile alla creazione o vivendo avventure in Eisen)."}
    ];

    // LE 6 MANOVRE BASE UFFICIALI DELLA GILDA DEI DUELLANTI (Manuale Base pag. 235)
    const basicManeuversDb = [
        {
            name: "Fendente",
            icon: "⚔️",
            type: "Attacco",
            timing: "Durante la propria Azione (1 Incremento)",
            oncePerRound: false,
            officialText: "È una semplice Manovra di attacco, ma persino i più dotati malviventi la vorrebbero apprendere. Eseguendo un Fendente, il personaggio infligge un numero di Ferite pari al suo Grado di Mischia."
        },
        {
            name: "Parata",
            icon: "🛡️",
            type: "Difesa (Reazione)",
            timing: "Immediatamente dopo aver subito Ferite (1 Incremento)",
            oncePerRound: false,
            officialText: "Questa è l’arte di porre la propria arma tra sé e il pericolo. Eseguire una Parata previene un numero di Ferite pari al Grado di Mischia del personaggio. È possibile usare questa Manovra solo immediatamente dopo aver subito Ferite."
        },
        {
            name: "Finta",
            icon: "🎭",
            type: "Tattica / Attacco",
            timing: "Durante la propria Azione (1 Incremento)",
            oncePerRound: false,
            officialText: "Porsi e agire in modo che l’avversario apra la guardia o tenti di parare un attacco che non arriverà mai. Quando un personaggio esegue una Finta infligge 1 Ferita; inoltre, se colpisce il suo avversario nuovamente nel corso del Round, questi subirà una Ferita aggiuntiva dal nuovo attacco."
        },
        {
            name: "Affondo",
            icon: "⚡",
            type: "Attacco Finale",
            timing: "Spende TUTTI gli Incrementi residui",
            oncePerRound: true,
            officialText: "L’Affondo è una Manovra sconsiderata e spesso disperata, ma capace di chiudere all’istante uno scontro. Quando la esegue, il personaggio spende tutti i suoi Incrementi e infligge un numero di Ferite pari al suo Grado di Mischia più il numero di Incrementi spesi. Queste Ferite non possono essere evitate o prevenute."
        },
        {
            name: "Botta",
            icon: "👊",
            type: "Controllo / Attacco",
            timing: "Durante la propria Azione (1 Incremento)",
            oncePerRound: false,
            officialText: "Usando il pomo della spada o un pugno, il personaggio sbilancia l’avversario per rendere meno efficace la sua prossima mossa. La Botta infligge 1 Ferita e la prossima volta in cui l’avversario colpisce infliggerà una Ferita in meno per ogni Grado di Mischia del personaggio."
        },
        {
            name: "Risposta",
            icon: "🔄",
            type: "Contrattacco (Reazione)",
            timing: "Subito dopo aver subito Ferite (Max 1 volta per Round)",
            oncePerRound: true,
            officialText: "Più di ogni altra Manovra, l’incapacità di apprendere la Risposta ha fatto sì che numerosi studenti non si siano mai diplomati. Quando esegue una Risposta, un personaggio previene un numero di Ferite pari al suo Grado di Mischia e ne infligge altrettante. È possibile usare questa Manovra solo subito dopo aver subito Ferite, e unicamente una volta per Round."
        }
    ];

    // I 20 STILI DI DUELLO UFFICIALI (12 Manuale Base + 4 Nazioni di Théah Vol. 1 + 4 Nazioni di Théah Vol. 2)
    const duelingStylesDb = {
        "Nessuna": {
            name: "Nessuna",
            nation: "Nessuna",
            source: "Manuale Base",
            weapons: "Armi ordinarie",
            maneuver: "Nessuna",
            cost: "-",
            lore: "Il personaggio non appartiene alla Gilda dei Duellanti (salvo possegga il Vantaggio Studioso di Lotta per le 3 Manovre base).",
            description: "Il personaggio non fa parte della Gilda dei Duellanti e combatte secondo le normali regole delle Sequenze d'Azione."
        },
        // === 12 STILI DEL MANUALE BASE (pagg. 236-239) ===
        "Aldana": {
            name: "Aldana",
            nation: "Castille",
            source: "Manuale Base (pag. 236)",
            weapons: "Spada da scherma in una mano e nulla nell’altra",
            maneuver: "Stratagemma Aldana",
            cost: "1 Incremento (Max 1/Round)",
            lore: "Lo Stile preferito di molti Castilliani, uno dei pochi a Théah che rinuncia all’uso della mano sinistra (tenuta dietro la schiena presentando solo il profilo). Combina la scherma e la danza per produrre movimenti inaspettati in base al ritmo della canzone su cui il Duellante sta 'ballando' nella sua mente.",
            description: "Quando il personaggio impugna una spada da scherma in una mano e nulla nell’altra può eseguire una Manovra speciale detta Stratagemma Aldana, che aumenta del suo Grado di Panache il numero di Ferite inflitte dal prossimo attacco contro l’avversario. Questa Manovra può essere eseguita solo una volta per Round."
        },
        "Ambrogia": {
            name: "Ambrogia",
            nation: "Vodacce",
            source: "Manuale Base (pag. 237)",
            weapons: "Spada da scherma (come uno stocco o una sciabola marinaresca) nella sinistra e un pugnale nella destra",
            maneuver: "Inganno di Veronica",
            cost: "Passivo / 1 Punto Eroe",
            lore: "Fondato da Veronica Ambrogia, celebre cortigiana di Vodacce, insegna a combattere tenendo nella sinistra la spada e nella destra la daga per confondere le difese dell'avversario ed enfatizza la praticità sopra ogni cosa.",
            description: "Quando impugna nella sinistra una spada da scherma (come uno stocco o una sciabola marinaresca) e nella destra un pugnale, il personaggio ottiene la capacità Inganno di Veronica. Quando crea la Riserva di Rischio per Mischia può usare il suo Grado di Grazia o Acume, a scelta. Spendendo 1 Punto Eroe può usarli entrambi."
        },
        "Boucher": {
            name: "Boucher",
            nation: "Montaigne",
            source: "Manuale Base (pag. 237)",
            weapons: "Un coltello o una daga in una mano e nulla, oppure un secondo coltello o daga, nell’altra",
            maneuver: "Passo Boucher",
            cost: "Incrementi delle 2 Manovre (Max 1/Round)",
            lore: "Stile di lotta nato nelle strade di Montaigne, tra i più veloci insegnati oggi. I discepoli impugnano lunghi coltelli in una raffica di colpi ravvicinati pensati per confondere e disorientare.",
            description: "Quando impugna un coltello o una daga in una mano e nulla, oppure un secondo coltello o daga, nell’altra, il personaggio ottiene la capacità Passo Boucher. Questa gli permette di eseguire due Manovre una dopo l’altra senza interruzioni, spendendo gli Incrementi per entrambe. Tutte le altre normali regole si applicano ancora, come l’impossibilità di eseguire la stessa Manovra due volte di seguito. Questa capacità può essere usata solo una volta per Round."
        },
        "Donovan": {
            name: "Donovan",
            nation: "Avalon",
            source: "Manuale Base (pag. 237)",
            weapons: "Un’arma pesante (una spada lunga, una mazza ecc.)",
            maneuver: "Baluardo di Donovan",
            replaces: "Parata",
            cost: "Sostituisce Parata (Opzionale: +1 PE)",
            lore: "Creato a Carleon da Donovan Durant, la più famosa guardia del corpo di Théah, prevede rigidi esami d'ammissione riservati a chi condivide la sua assoluta dedizione alla protezione altrui.",
            description: "Quando il personaggio impugna un’arma pesante (una spada lunga, una mazza ecc.) la sua Manovra di Parata è sostituita dal Baluardo di Donovan. Questo previene a lui o un alleato entro portata un numero di Ferite pari al Grado di Mischia del personaggio. Inoltre, quando si esegue il Baluardo, è possibile spendere 1 Punto Eroe per incastrare la propria arma con quella dell’avversario; nel farlo entrambi i contendenti perdono tutti i loro Incrementi residui e non possono più compiere Azioni per quel Round."
        },
        "Drexel": {
            name: "Drexel",
            nation: "Eisen",
            source: "Manuale Base (pagg. 237-238)",
            weapons: "Un’arma pesante a due mani (zweihander)",
            maneuver: "Guardie Drexel (Bittner, Metzger, Gerbeck)",
            cost: "Scelta a inizio Round (1 Incr. per cambiare)",
            lore: "Sviluppato dal mercenario Kristoff Drexel, capo degli 'Spiriti Sanguinari', sfrutta la versatile zweihander Eiseniana attraverso tre Guardie distinte per adattarsi a ogni situazione tattica.",
            description: "Quando il personaggio impugna un’arma pesante a due mani può scegliere tra: • Guardia Bittner (Frontale): Le Manovre che prevengono le Ferite bloccheranno un numero di Ferite aggiuntive pari alla Risolutezza del personaggio. Non sarà possibile eseguire Fendenti, si potrà infliggere danno come un non-Duellante. • Guardia Metzger (Posteriore): Il personaggio esegue tutte le Azioni come se avesse un numero di Incrementi extra pari al suo Acume (usati solo per determinare quando agisce, non spendibili). Non potrà però eseguire Parate e dovrà prevenire i danni come un non-Duellante. • Guardia Gerbeck (Alta): Le Manovre che infliggono Ferite causeranno 1 Ferita aggiuntiva, ma il personaggio agirà sempre come se avesse 1 Incremento in meno (minimo 1). Il personaggio sceglie la sua Guardia all’inizio del Round; per cambiarla nel corso del Round dovrà spendere 1 Incremento."
        },
        "Eisenfaust": {
            name: "Eisenfaust",
            nation: "Eisen",
            source: "Manuale Base (pag. 238)",
            weapons: "Un’arma pesante a una mano e un panzerhand sull’altra",
            maneuver: "Risposta di Ferro",
            replaces: "Risposta",
            cost: "Sostituisce Risposta (Max 1/Round)",
            lore: "Stile difensivo che impiega una spadona a una mano accompagnata da un guanto d'arme in ferro (panzerhand) sulla sinistra per deflettere o afferrare la lama nemica e contrattaccare con terribili colpi.",
            description: "Quando il personaggio impugna un’arma pesante a una mano e indossa un panzerhand sull’altra la sua Manovra Risposta sarà sostituita da Risposta di Ferro, che previene un numero di Ferite pari al suo Grado di Risolutezza+Mischia e ne infligge un numero pari al suo Grado di Vigore+Mischia. Questa Manovra, come la normale Risposta, può essere eseguita solo una volta per Round."
        },
        "Leegstra": {
            name: "Leegstra",
            nation: "Vestenmennavenjar",
            source: "Manuale Base (pag. 238)",
            weapons: "Un’arma pesante per mano (di solito asce o martelli, ma anche spade)",
            maneuver: "Schianto Leegstra",
            cost: "1 Incremento (Max 1/Round)",
            lore: "Formalizzato a Thorshofn da Leegstra Eldsdóttir, è uno Stile estremamente offensivo che prevede un'arma pesante in ogni mano per seppellire l'avversario sotto una valanga di attacchi.",
            description: "Quando il personaggio impugna un’arma pesante per mano (di solito asce o martelli, ma anche spade) può effettuare una Manovra speciale detta Schianto Leegstra. Questa infligge un numero di Ferite pari al Grado di Mischia del personaggio. Un Duellante può eseguire lo Schianto Leegstra solo una volta per Round."
        },
        "Mantovani": {
            name: "Mantovani",
            nation: "Vodacce",
            source: "Manuale Base (pag. 238)",
            weapons: "Una frusta",
            maneuver: "Sferzata Mantovani",
            cost: "1 Incremento (Max 1/Round)",
            lore: "Creato da Vito Mantovani attorno alla frusta e basato su inganno e adattabilità, permette di manipolare l'ambiente o sferzare il dorso della mano armata del nemico.",
            description: "Quando impugna una frusta, il personaggio ottiene una Manovra speciale detta Sferzata Mantovani. Questa infligge 1 Ferita e permette di scegliere una Manovra che l’avversario può eseguire (sia base, sia concessa da uno Stile). Il bersaglio non potrà eseguire la Manovra indicata perché la sua arma sarà avvolta nelle spire della frusta, avrà subito un colpo doloroso sul dorso della mano o non sarà in grado di reagire per altri motivi. La Sferzata può essere eseguita solo una volta per Round."
        },
        "Mireli": {
            name: "Mireli",
            nation: "Ussura",
            source: "Manuale Base (pag. 239)",
            weapons: "In una mano un’arma pesante (come una sciabola da cavalleria o un’accetta) oppure due – una per mano",
            maneuver: "Revisione di Mireli",
            cost: "1 Incremento",
            lore: "Creato dalla ballerina Katya Mireli, la cui Sala d'Armi itinerante viaggia con le troupe circensi per tutta Ussura insegnando la celebre e imprevedibile Danza con la Spada.",
            description: "Quando il personaggio impugna in una mano un’arma pesante (come una sciabola da cavalleria, ma molti Duellanti Mireli preferiscono un’accetta) oppure due – una per mano – può eseguire una manovra speciale detta Revisione di Mireli. Questa funziona come una Manovra di Botta o Parata a scelta di chi la esegue."
        },
        "Sabat": {
            name: "Sabat",
            nation: "Confederazione Sarmatiana",
            source: "Manuale Base (pag. 239)",
            weapons: "Un’arma pesante in una mano (di solito una sciabola da cavalleria)",
            maneuver: "Gambetto Sabat",
            replaces: "Affondo",
            cost: "Sostituisce Affondo (Tutti gli Incrementi)",
            lore: "Ideato dal Grande Maestro di scacchi Mirek Sabat, favorisce uno stile difensivo paziente che spinge l'avversario a stancarsi per poi finirlo con un solo colpo decisivo.",
            description: "Quando impugna un’arma pesante in una mano (di solito una sciabola da cavalleria), la Manovra Affondo del personaggio è sostituita dal Gambetto Sabat. Questo infligge un numero di Ferite pari al suo Grado di Mischia+Grazia+il numero di Incrementi spesi."
        },
        "Torres": {
            name: "Torres",
            nation: "Castille",
            source: "Manuale Base (pag. 239)",
            weapons: "Una spada da scherma (come uno stocco o una sciabola marinaresca) in una mano e nulla nell’altra, indossando però una cappa",
            maneuver: "Svolazzo del Matador",
            cost: "1 Incremento (Max 1/Round)",
            lore: "Sviluppato inizialmente per le corride, impiega uno stocco in una mano e una cappa nell'altra per formare un muro di tessuto e acciaio e nascondere i movimenti della lama.",
            description: "Quando il personaggio impugna una spada da scherma (come uno stocco o una sciabola marinaresca) in una mano e nulla nell’altra, indossando però una cappa, potrà eseguire una Manovra speciale detta Svolazzo del Matador. Questa previene un numero di Ferite pari al Grado di Atletica del Duellante. Lo Svolazzo può essere eseguito solo una volta per Round."
        },
        "Valroux": {
            name: "Valroux",
            nation: "Montaigne",
            source: "Manuale Base (pag. 239)",
            weapons: "Una spada da scherma nella destra e una daga nella sinistra",
            maneuver: "Croce Valroux",
            cost: "1 Incremento (Reazione, Max 1/Round)",
            lore: "Impiega spada da scherma nella mano principale e daga mancina per parare, muovendosi in cerchio, cambiando ritmo e umiliando l'avversario fino a demoralizzarlo.",
            description: "Quando impugna una spada da scherma nella destra e una daga nella sinistra, il personaggio può eseguire una Manovra detta Croce Valroux. Questa previene un numero di Ferite pari al Grado di Mischia del personaggio e gli permette di scegliere una Manovra che l’avversario potrebbe eseguire come sua prossima Azione. Eseguire Manovre diverse da quella prescelta costerà un Incremento extra all’avversario. La Croce può essere eseguita solo una volta per Round, subito dopo un’Azione che abbia inflitto Ferite al personaggio."
        },
        // === 4 STILI DI NAZIONI DI THÉAH: VOLUME 1 (pagg. 53, 100, 148, 195) ===
        "Cleasa di Skatha": {
            name: "Cleasa di Skatha",
            nation: "Avalon / Inismore / Highland",
            source: "Nazioni di Théah Vol. 1 (pag. 53)",
            weapons: "Qualsiasi arma (in grado di muoversi liberamente, senza protezioni ingombranti e con spazio attorno a sé)",
            maneuver: "Balzo del Salmone",
            cost: "1 Incremento (Max 1/Round)",
            lore: "Antica tradizione marziale di Eithne O'Guaire e Cailean MacCormac basata sugli stratagemmi (cleasa) della dea guerriera Skatha, che enfatizzano fisicità, acrobazie e salti sorprendenti.",
            description: "Il personaggio in grado di muoversi liberamente – senza protezioni ingombranti e con spazio attorno a sé – salta verso l’alto così da superare la guardia del nemico, a prescindere dall’arma. La Manovra infligge un numero di Ferite pari al Grado di Atletica del personaggio che non possono essere prevenute in alcun modo. Un Duellante può eseguire il Balzo del Salmone solo una volta per Round."
        },
        "Siqueira": {
            name: "Siqueira",
            nation: "Castille",
            source: "Nazioni di Théah Vol. 1 (pag. 100)",
            weapons: "Un bastone o un randello (vara)",
            maneuver: "Tomar al Toro Por las Astas",
            cost: "1 Incremento (Max 1/Round)",
            lore: "Stile dei toreros di el Baile del Toro a Odiseo, originato dalle tecniche dei pastori: usa la vara per provocare l'avversario a caricare a testa bassa e colpirlo al fianco.",
            description: "Quando il personaggio impugna un bastone o un randello può eseguire una Manovra speciale chiamata Tomar al Toro Por las Astas (Prendere il Toro per le Corna). Questa permette di Mettere Pressione al proprio avversario, che dovrà spendere 2 Incrementi invece di 1 per compiere qualsiasi Azione diversa dall’attaccare (ossia causare Ferite con ogni mezzo disponibile). Se l’avversario attacca, il duellante infligge un numero di Ferite pari al proprio grado di Grazia. Questa Manovra può essere eseguita solo una volta per Round."
        },
        "De Vore": {
            name: "De Vore",
            nation: "Montaigne",
            source: "Nazioni di Théah Vol. 1 (pag. 148)",
            weapons: "Una spada da scherma nella mano principale",
            maneuver: "Cortesia de Vore",
            cost: "Tutti gli Incrementi (Max 1/Round)",
            lore: "Scuola dello château di Mont de Vore ad Auzat diretta da Riche la Barrè, ex membro della Garde Lumineuse: postura eretta come una statua, lama tenuta alta ed efficienza assoluta.",
            description: "Quando impugna una spada da scherma nella mano principale, il personaggio può eseguire una Manovra speciale chiamata Cortesia de Vore. Questa richiede la spesa di tutti gli Incrementi e la scelta di un personaggio presente nella Scena (anche il Duellista stesso). La Cortesia de Vore previene tutte le Ferite inflitte al bersaglio da altri personaggi – non quelle frutto di Conseguenze o effetti ambientali. Questo include anche Ferite normalmente impossibili da prevenire, ad esempio causate dalla Manovra Affondo o da un colpo di pistola. Questa Manovra può essere usata solo una volta per Round."
        },
        "Hallbjorn": {
            name: "Hallbjorn",
            nation: "Vestenmennavenjar",
            source: "Nazioni di Théah Vol. 1 (pag. 195)",
            weapons: "Un’arma pesante (di solito un’ascia, ma a volte un maglio o uno spadone) in una mano e uno scudo nell’altra",
            maneuver: "Urto Hallbjorn",
            cost: "1 Incremento (Max 1/Round)",
            lore: "Fondato dal leggendario razziatore Hallbjorn Ulfsen, impiega leggeri scudi Vesten in legno rinforzato e decorati con rune sia per la difesa sia per creare aperture con attacchi feroci.",
            description: "Quando impugna un’arma pesante (di solito un’ascia, ma a volte un maglio o uno spadone) in una mano e uno scudo nell’altra, il personaggio può usare una manovra speciale detta “Urto Hallbjorn”. Questa infligge un numero di Ferite pari al Grado di Vigore del Duellante e, inoltre, se l’avversario subisce altre Ferite entro la fine del Round subirà Ferite aggiuntive pari al Grado di Vigore del Duellante. Questa Manovra può essere eseguita solo una volta per Round."
        },
        // === 4 STILI DI NAZIONI DI THÉAH: VOLUME 2 (pagg. 53, 100, 147, 194) ===
        "Kummerholt": {
            name: "Kummerholt",
            nation: "Eisen",
            source: "Nazioni di Théah Vol. 2 (pag. 53)",
            weapons: "Una piccola lama (come un pugnale, un pezzo di vetro o una spada spezzata)",
            maneuver: "Rintocco di Morte",
            cost: "Tutti gli Incrementi (Max 1/Scena)",
            lore: "Adottato dai Duellanti Waisen che hanno perso tutto nella Guerra della Croce: più che una scuola è uno stato mentale disperato per abbattere avversari e Orrori superiori con un ultimo colpo al cuore.",
            description: "Quando il personaggio impugna una piccola lama (come un pugnale, un pezzo di vetro o una spada spezzata) ottiene una Manovra speciale chiamata Rintocco di Morte. Per usarla dovrà spendere tutti i propri Incrementi, causando un numero di Ferite pari al proprio Grado di Mischia + il numero di Incrementi spesi + la Forza dell’Avversario (o il suo Tratto più alto se non è un Malvagio). Queste Ferite non possono essere evitate o prevenute. Il Rintocco può essere usato solo una volta per Scena."
        },
        "Szybowanie": {
            name: "Szybowanie",
            nation: "Confederazione Sarmatiana",
            source: "Nazioni di Théah Vol. 2 (pag. 100)",
            weapons: "Qualsiasi arma mentre si trova in posizione sopraelevata (in sella, ma non solo)",
            maneuver: "Picchiata dell’Aquila",
            cost: "1 Incremento + 1 Punto Eroe (Max 1/Round)",
            lore: "Sviluppato dall'ussara alata Kyra Mikita per sfruttare non solo la sella ma qualsiasi posizione sopraelevata sul campo di battaglia calando sul nemico con impeto devastante.",
            description: "Quando il personaggio si trova in posizione sopraelevata (in sella, ma non solo) può eseguire una Manovra speciale detta Picchiata dell’Aquila. Il Duellante si avventa sul proprio avversario menando un colpo molto potente che infligge un numero di Ferite pari al suo Grado di Mischia + Cavalcare. Per eseguire questa Manovra è necessario spendere 1 Punto Eroe e può essere eseguita solo una volta per Round."
        },
        "Kulachniy Boi": {
            name: "Kulachniy Boi",
            nation: "Ussura",
            source: "Nazioni di Théah Vol. 2 (pag. 147)",
            weapons: "Rukavitsa (speciali guanti e vambraci in acciaio celati sotto le maniche)",
            maneuver: "Ferro e Velluto",
            cost: "Passivo + 1 Incremento gratuito per nasconderli",
            lore: "La tecnica di lotta coi pugni più diffusa di Ussura; nei duelli contro avversari armati impiega speciali guanti e vambraci in acciaio (rukavitsa) celati sotto le maniche.",
            description: "Quando indossa dei rukavitsa sotto le maniche, il personaggio può usare il proprio Grado di Rissa, invece di quello di Mischia, ai fini delle Manovre. Inoltre ottiene 1 Incremento gratuito per nascondere i propri rukavitsa mentre li indossa."
        },
        "Le Strade": {
            name: "Le Strade",
            nation: "Vodacce",
            source: "Nazioni di Théah Vol. 2 (pag. 194)",
            weapons: "Spada da scherma in una mano, nulla nell’altra, in un ambiente con numerosi ostacoli (città o nave)",
            maneuver: "La Furia delle Strade",
            cost: "1 Incremento (Max 1/Round)",
            lore: "Nato nei vicoli tortuosi e tra le torri delle città di Vodacce, usa una spada agile nella mano dominante lasciando l'altra libera per scalare muri, dondolare da ponti e sfruttare l'ambiente.",
            description: "Quando il personaggio impugna una spada da scherma in una mano, nulla nell’altra e si trova in un ambiente dove ci sono numerosi ostacoli da scalare, saltare o da cui lanciarsi (come una città o una nave) può eseguire una Manovra Speciale chiamata Furia delle Strade, che previene un numero di Ferite pari al suo Grado di Atletica e crea una Conseguenza ambientale per l’avversario. La Conseguenza richiede 1 Incremento per essere evitata e infligge un numero di Ferite pari al Grado di Grazia del Duellante alla fine del Round. Questa Manovra può essere eseguita solo una volta per Round."
        }
    };

    const arcanaDb = [
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
    ];

    const sorceriesDb = [
        {
            name: "Hexenwerk",
            aliases: ["Hexenwerk"],
            nation: "Eisen",
            source: "Manuale Base pp. 206-209 & Nazioni di Théah Vol. 2 pp. 51-53",
            description: "L’arte alchemica di Eisen per combattere i non-morti. Ogni Grado di Stregoneria insegna 1 Unguento Maggiore e 2 Unguenti Minori. Preparazione (1 ora + laboratorio/cucina + 1 PE): distilla 1 Unguento Maggiore + 2 Unguenti Minori per Grado di Stregoneria (raddoppiati e non deperibili se si usano parti del corpo di un hexe). Attivazione: 1 Incremento in Sequenza d'Azione. A fine Episodio restano solo 1 Maggiore e 1 Minore.",
            rulesSummary: "1 PE per distillare (1 Maggiore + 2 Minori × Grado). 1 Incremento per usare. Max conservati a fine Episodio: 1 Maggiore + 1 Minore.",
            powers: [
                // 7 Unguenti Maggiori (Manuale Base pp. 207-208)
                { name: "Camminata Spettrale", type: "Unguento Maggiore", source: "Base", duration: "Fino a fine Scena", doses: 1, recipe: "Un cuore umano tritato, ridotto in poltiglia e mescolato con erbe e blandi sedativi.", desc: "Chi consuma l’unguento cade svenuto e spinge la propria anima fuori dal corpo. Finché è sotto forma di spirito non può essere visto né toccato da chi non ha mezzi sovrannaturali (es. Occhio Spettrale), può volare e attraversare muri ed è soggetto agli effetti contro i non-morti. 1 singola Ferita Drammatica lo rimanda subito nel corpo, dove subisce una 2ª Ferita Drammatica per lo shock. Può tornare nel corpo in qualsiasi momento, ma se non lo fa entro la prossima alba o tramonto muore." },
                { name: "Lingua di Cadavere", type: "Unguento Maggiore", source: "Base", duration: "Fino a fine Scena", doses: 1, recipe: "La lingua di un cadavere, marinata nella belladonna e finemente macinata.", desc: "Strofinato sulla lingua dell'hexe, gli permette di parlare con i morti. Può porre a un cadavere 2 domande per ogni Grado di Risolutezza; il cadavere risponde sinceramente al meglio delle conoscenze che aveva in vita. Al termine della conversazione l'hexe vomita violentemente e il cadavere si riduce in polvere." },
                { name: "Occhio Spettrale", type: "Unguento Maggiore", source: "Base", duration: "Fino a fine Scena", doses: 1, recipe: "Gli occhi di qualcuno morto recentemente, pestati con acqua benedetta e radici di mandragora fino a formare una pasta densa.", desc: "Applicato sulle palpebre, permette per una Scena di vedere spiriti, fantasmi e altri Mostri che sono normalmente invisibili." },
                { name: "Pane del Padrone", type: "Unguento Maggiore", source: "Base", duration: "Fino a fine Scena", doses: 1, recipe: "Cervello morto mescolato con erbe, funghi e sostanze allucinogene essiccate.", desc: "Chi lo mangia può dare 1 singolo ordine a una Squadra di Mostri non-morti (che non può attaccarsi da sola, ma può attaccare altri non-morti), oppure ottiene +1 Incremento bonus in tutti i Rischi per influenzare, persuadere o intimidire un Malvagio non-morto." },
                { name: "Porridge da Funerale", type: "Unguento Maggiore", source: "Base", duration: "Speciale (Corruzione)", doses: 1, corruption: true, recipe: "Fegato e reni di un cadavere mescolati con potenti sedativi e veleni.", desc: "Provoca immediatamente 1 Ferita Drammatica a chi lo consuma. Se muore entro 1 giorno, risorge entro 3 giorni come Mostro non-morto agli ordini dell’hexe che ha cucinato il composto. Produrre il Porridge causa sempre Corruzione, così come farlo mangiare (chi fa entrambe le cose subisce 2 volte Corruzione)." },
                { name: "Prigione Spettrale", type: "Unguento Maggiore", source: "Base", duration: "Finché la linea è intatta", doses: 1, recipe: "Muschio cresciuto su una lapide o mausoleo, bollito in acqua salata e mescolato con polvere d’ossa.", desc: "Usato per tracciare sul pavimento un circolo o pentacolo: i Mostri non-morti non possono attraversare la linea né interagire fisicamente o usare poteri sovrannaturali attraverso di essa (inclusi attacchi fisici o a distanza), finché la linea rimane intatta." },
                { name: "Sangue del Morto", type: "Unguento Maggiore", source: "Base", duration: "Fino a fine Scena", doses: 1, recipe: "Sangue prelevato da un cadavere fresco e mescolato con erbe, radici e veleni.", desc: "Deve essere inserito in grande quantità nel corpo di una creatura non-morta (tramite iniezione o ingestione, non semplicemente spalmato su una lama). Se applicato con successo, rende il Mostro non-morto Inerme per il resto della Scena." },
                // 4 Unguenti Maggiori degli Apostati (Nazioni di Théah Vol. 2 p. 51)
                { name: "Olio di Anosmia", type: "Unguento Maggiore (Apostati)", source: "Vol.2", duration: "Fino a fine Scena", doses: 1, recipe: "Una palla di pelo e dell’urina di Mostro, mescolati con erbe bollite, oli essenziali e acido.", desc: "Strofinato sul corpo, impedisce che i Mostri possano fiutare la persona fino alla fine della Scena. Ai Mostri che tentano di seguire le tracce di chi è coperto d'Olio serve +1 Incremento aggiuntivo." },
                { name: "Mobilità Ferina", type: "Unguento Maggiore (Apostati)", source: "Vol.2", duration: "Fino a fine Scena", doses: 1, recipe: "Un dente di Mostro, una rana essiccata e una piuma di corvo ridotti in polvere e mescolati con latte di capra.", desc: "Chi beve la mistura acquisisce la capacità di correre e saltare come una bestia feroce, potendo compiere fino a fine Scena gesti atletici normalmente impossibili per un umano (es. saltare un baratro di 6 metri), nei limiti delle capacità fisiche del Mostro da cui proviene il dente." },
                { name: "Polvere di Amnesia", type: "Unguento Maggiore (Apostati)", source: "Vol.2", duration: "Istantanea", doses: 1, recipe: "Un corno di demone, funghi e polvere d’osso ridotti in polvere sottile, cotti a secco e mescolati in una grande quantità di tè.", desc: "Cancella dalla mente di chi lo consuma il ricordo di ciò che è accaduto nell’ultimo giorno." },
                { name: "Vista Selvaggia", type: "Unguento Maggiore (Apostati)", source: "Vol.2", duration: "Fino a fine Scena", doses: 1, recipe: "Un ramo appuntito di legno nero, annerito sul fuoco e coperto di una mistura di bacche, fango e un pezzo del Mostro bersaglio.", desc: "Graffiando una persona con il bastone (causandole 1 Ferita Drammatica), questa cade in trance per una Scena e vede attraverso gli occhi del Mostro da cui è stato preso il campione. Spendendo 1 PE può fare un Rischio di Notare per ottenere ulteriori dettagli. Il legame si spezza se il Mostro dorme o se uno dei due subisce una Ferita." },
                // 13 Unguenti Minori (Manuale Base pp. 208-209)
                { name: "Brodo Nero", type: "Unguento Minore", source: "Base", duration: "Fino a fine Scena", doses: 2, corruption: true, recipe: "Pane ammuffito, sangue di Mostro e acqua fetida di palude.", desc: "Conferisce a chi lo beve 1 Qualità Mostruosa (scelta al momento della preparazione) fino alla fine della Scena. Berlo o farlo bere a qualcun altro è sempre un atto di Corruzione." },
                { name: "Cipiglio d’Inverno", type: "Unguento Minore", source: "Base", duration: "Fino a fine Round (1 uso)", doses: 2, recipe: "Acqua benedetta, uno stelo spinoso di rosa e qualche goccia di sangue di hexe congelati in una lama di ghiaccio.", desc: "Usata come un coltello: se infligge almeno 1 Ferita a un non-morto, questo è stordito per il resto del Round e non può intraprendere azioni (un Malvagio può comunque spendere Incrementi per difendersi). Dopo un singolo uso il ghiaccio si frantuma." },
                { name: "Flagello Rovinoso", type: "Unguento Minore", source: "Base", duration: "Fino a fine Round", doses: 2, recipe: "Una fiasca di erbe, veleni e una goccia di vino della comunione.", desc: "Lanciata contro un Mostro non-morto: se il colpo infligge almeno 1 Ferita, il GM non può spendere Punti Pericolo per attivare le Qualità Mostruose di quel Mostro fino alla fine del Round." },
                { name: "Furia Paterna", type: "Unguento Minore", source: "Base", duration: "Permanente", doses: 2, recipe: "Un paletto di legno di agrifoglio trattato con erbe e veleni naturali e benedetto da un sacerdote.", desc: "Usando 1 Azione per colpire una creatura non-morta Inerme, la vittima viene distrutta completamente e non può più essere resuscitata in alcun modo." },
                { name: "Lacrime dei Profeti", type: "Unguento Minore", source: "Base", duration: "Permanente", doses: 2, recipe: "Olio santo mescolato con spezie rare.", desc: "Applicato su un cadavere non ancora toccato dall'Hexenwerk, impedisce che quel corpo possa mai più essere riportato in vita come non-morto." },
                { name: "Pietà Materna", type: "Unguento Minore", source: "Base", duration: "Istantanea", doses: 2, recipe: "Una zuppa di vegetali selvatici cucinata con acqua benedetta.", desc: "Rimuove immediatamente tutte le maledizioni, malattie o effetti debilitanti causati da creature non-morte (chi ha mangiato il Porridge da Funerale muore all’istante, ma non risorge come Mostro)." },
                { name: "Risata di Primavera", type: "Unguento Minore", source: "Base", duration: "Fino a fine Scena", doses: 2, recipe: "Sciroppo dolce a base di fiori freschi di primavera, resina d’albero e acqua piovana.", desc: "Chi lo beve diventa completamente immune alla Paura causata dai Mostri non-morti per l'intera Scena." },
                { name: "Sete Rossa", type: "Unguento Minore", source: "Base", duration: "Fino a fine Round", doses: 2, recipe: "Carne marcia e bacche bollite con erbe e radici dall'odore pungente.", desc: "Spendendo 1 Incremento per spalmarlo su di sé o su un bersaglio, tutti i Mostri non-morti presenti devono dirigere su quel personaggio tutti i loro Attacchi fino a fine Round." },
                { name: "Sorriso d’Estate", type: "Unguento Minore", source: "Base", duration: "A fine Scena", doses: 2, recipe: "Poltiglia distillata dall’acqua di un rapido torrente e mescolata con erbe dolciastre.", desc: "Applicato sulle ferite, guarisce 1 Ferita Drammatica causata da un Mostro non-morto alla fine della Scena." },
                { name: "Sospiro d’Autunno", type: "Unguento Minore", source: "Base", duration: "1 Notte intera", doses: 2, recipe: "Semi di zucca marcia, vino rosso da tavola e una lacrima.", desc: "Chi lo beve dorme un sonno placido e ristoratore per una notte intera, immune a incubi naturali o sovrannaturali." },
                { name: "Veleno del Mietitore", type: "Unguento Minore", source: "Base", duration: "Fino a fine Round", doses: 2, recipe: "Veleni naturali e finissima polvere d’argento sigillati in una fiasca di vetro.", desc: "Lanciato contro un Mostro non-morto: se infligge almeno 1 Ferita, causa 1 ulteriore Ferita non negabile ogni volta che la creatura compie un'azione fino alla fine del Round." },
                { name: "Veleno del Redivivo", type: "Unguento Minore", source: "Base", duration: "1 Round dopo aver sfoderato", doses: 2, recipe: "Tossina di ragni o serpenti applicata a un’arma da taglio o perforante (non in dracheneisen) e lasciata nel fodero.", desc: "Per 1 Round dopo che l'arma viene sfoderata per la prima volta nella Scena, essa infligge il doppio delle Ferite contro i Mostri non-morti." },
                { name: "Velo della Vedova", type: "Unguento Minore", source: "Base", duration: "Finché non viene attivato", doses: 2, recipe: "Un crisantemo appassito preso da una tomba, bagnato con acqua santa e benedetto da un prete.", desc: "Appuntato sui vestiti rende immuni al primo attacco o effetto sovrannaturale generato da un Mostro non-morto, dopodiché il fiore si riduce in polvere." }
            ]
        },
        {
            name: "Glamour",
            aliases: ["Glamour", "I Cavalieri di Avalon", "Cavaliere di Avalon", "Incanto"],
            nation: "Avalon",
            source: "Manuale Base pp. 210-216 & Nazioni di Théah Vol. 1 pp. 48-53",
            description: "La magia leggendaria dei Cavalieri di Re Elilodd e del Graal. Scegli 1 dei 20 Cavalieri di Elilodd (con 1 Tratto Maggiore, 1 Tratto Minore e i suoi Adesivi di Virtù/Hubris). Ogni Grado di Stregoneria conferisce 1 Incanto Maggiore e 2 Incanti Minori (a Grado 1) oppure aumenta il Grado (1-5) di Incanti già noti; gli Incanti di Fortuna sono accessibili a tutti. Attivazione: 1 PE (Minori: 1/Scena, Maggiori: 1/Episodio). Include i 7 Obblighi del Gesa, il Debito del Graal (Vol. 1 p. 48) e l'Incarnazione (Vol. 1 pp. 48-51).",
            rulesSummary: "1 PE per Incanto (Minori 1/Scena, Maggiori 1/Episodio). Debito del Graal: tira 1d10 prima di lanciare; se ≤ Debito, azzera il Debito e subisci 1 Maledizione Sidhe.",
            gesaOaths: [
                "1. Mai leverai la tua lama contro un compatriota.",
                "2. Mai abbandonerai il campo prima della fine dello scontro.",
                "3. Mai mancherai alla tua parola o aiuterai qualcuno a mancare alla sua.",
                "4. Mai starai in ozio quando c’è da compiere un’opera.",
                "5. Mai lascerai che la passione ti domini.",
                "6. Mai ti approprierai di ciò che appartiene a un altro per tuo guadagno.",
                "7. Sempre servirai il Graal."
            ],
            sidheCurses: [
                { name: "Acqua Corrente", desc: "Non può attraversare l’acqua corrente senza l’aiuto dei suoi compagni." },
                { name: "Toccato dalle Fate", desc: "Si distrae facilmente: non può mai tenere d'occhio qualcosa di importante o fare la guardia da solo." },
                { name: "Vulnerabile al Ferro", desc: "Qualsiasi Ferita subita da armi in ferro o acciaio aumenta di +1." },
                { name: "Comportamento Inquietante", desc: "Gli animali domestici ringhiano o fuggono, il latte inacidische e le fiamme tremolano al suo passaggio." },
                { name: "Diurno / Notturno", desc: "Perde 1 dado in tutti i Rischi compiuti durante il giorno (se Notturno) o durante la notte (se Diurno)." },
                { name: "Sensibile agli Amuleti", desc: "Non può entrare in luoghi protetti da ferri di cavallo, sorbo rosso o campanelle delle fate senza spendere 1 PE." }
            ],
            knights: [
                { name: "Æsc delle Foreste", major: "Risolutezza", minor: "Panache", virtue: "Scaltro", hubris: "Confuso", legendaryName: "Trasformazione", legendaryDesc: "Si trasforma in un grande cervo bianco o in un lupo delle foreste per l'intera Scena." },
                { name: "Beorhtsige lo Spezza-assedi", major: "Panache", minor: "Vigore", virtue: "Fortunato", hubris: "Implacabile", legendaryName: "Inamovibile", legendaryDesc: "Finché resta fermo coi piedi piantati a terra, nessuna forza mortale o mostruosa può spostarlo o atterrarlo." },
                { name: "Cerhelm l’Acuto", major: "Grazia", minor: "Acume", virtue: "Astuto", hubris: "Fanatico", legendaryName: "Divenire la Lama", legendaryDesc: "Ogni suo attacco in mischia ignora qualsiasi armatura, copertura o riduzione del danno per il resto della Scena." },
                { name: "Ceolmund il Protettore", major: "Risolutezza", minor: "Grazia", virtue: "Appassionato", hubris: "Testardo", legendaryName: "Voi Non Morirete Qui", legendaryDesc: "Prende su di sé tutte le Ferite e Ferite Drammatiche inflitte agli alleati nella Scena per un intero Round." },
                { name: "Dudda il Rotondo", major: "Vigore", minor: "Risolutezza", virtue: "Glorioso", hubris: "Insicuro", legendaryName: "Banchetto Perpetuo", legendaryDesc: "Evoca un banchetto fatato che guarisce 1 Ferita Drammatica a tutti i commensali che mangiano e bevono in pace." },
                { name: "Dunstan lo Straniero", major: "Vigore", minor: "Acume", virtue: "Amichevole", hubris: "Manipolatore", legendaryName: "Fæ Confusion", legendaryDesc: "Confonde i sensi di una Squadra di Sgherri o di un Malvagio facendogli attaccare i propri alleati per 1 Round." },
                { name: "Eadburg il Ricco", major: "Panache", minor: "Acume", virtue: "Altruista", hubris: "Invidioso", legendaryName: "Benedizione del Penitente", legendaryDesc: "Donando tutto il proprio oro o un oggetto prezioso a un bisognoso, tutti gli alleati ottengono +2 Incrementi nel prossimo Rischio." },
                { name: "Ealdræd il Vecchio", major: "Acume", minor: "Grazia", virtue: "Intuitivo", hubris: "Sfortunato", legendaryName: "Antico Sapere Sidhe", legendaryDesc: "Pone al GM una domanda su qualsiasi segreto antico, rovina o creatura fatata e riceve la risposta completa e veritiera." },
                { name: "Frideswide il Pacifico", major: "Acume", minor: "Risolutezza", virtue: "Confortante", hubris: "Leale", legendaryName: "Scossa che Disarma", legendaryDesc: "Un'onda di luce dorata fa cadere di mano le armi a tutti i presenti nella Scena che non spendono 2 Incrementi." },
                { name: "Godric il Pio", major: "Panache", minor: "Risolutezza", virtue: "Coraggioso", hubris: "Superstizioso", legendaryName: "Respingere il Blasfemo", legendaryDesc: "I Mostri e gli utilizzatori di stregonerie corrotte non possono avvicinarsi a Godric né attaccarlo in mischia per 1 Scena." },
                { name: "Hereward il Consigliere", major: "Acume", minor: "Panache", virtue: "Esemplare", hubris: "Divisi dal Destino", legendaryName: "Saggio Consiglio", legendaryDesc: "Dona immediatamente a un alleato un numero di Incrementi bonus pari al proprio Grado di Acume." },
                { name: "Hildræd la Comandante", major: "Grazia", minor: "Vigore", virtue: "Maestoso", hubris: "Curioso", legendaryName: "Raduno di Eroi", legendaryDesc: "Tutti gli Eroi alleati che ubbidiscono al piano di Hildræd sommano +1 a tutti i dadi tirati fino a fine Round." },
                { name: "Leofric il Beneamato", major: "Risolutezza", minor: "Acume", virtue: "Mite", hubris: "Arrogante", legendaryName: "Illuminare", legendaryDesc: "Sprigiona un bagliore solare che rivela ogni illusione, creatura invisibile o inganno nella Scena." },
                { name: "Mildgyd il Gentile", major: "Vigore", minor: "Panache", virtue: "Umile", hubris: "Indeciso", legendaryName: "Forza dei Giganti", legendaryDesc: "Solleva e scaglia oggetti colossali (carrozze, cannoni, alberi) infliggendo Ferite pari al doppio del Vigore." },
                { name: "Osgar il Lanciere", major: "Grazia", minor: "Risolutezza", virtue: "Vittorioso", hubris: "Rancoroso", legendaryName: "Me Ne Occupo Io", legendaryDesc: "Sfida un singolo Malvagio: finché combattono in 1 contro 1, nessun altro può interferire e Osgar ottiene +2 Incrementi." },
                { name: "Pæga il Dimenticato", major: "Grazia", minor: "Panache", virtue: "Discreto", hubris: "Ambizioso", legendaryName: "Oscurità", legendaryDesc: "Cancella la propria presenza dalla memoria e dalla vista dei presenti fino a fine Scena finché non attacca." },
                { name: "Sæwine la Marinaia", major: "Panache", minor: "Grazia", virtue: "Perspicace", hubris: "Testa Calda", legendaryName: "Richiamo del Mare", legendaryDesc: "Comanda le correnti e i venti attorno alla propria nave, raddoppiandone la velocità e rendendola immune agli scogli per 1 Scena." },
                { name: "Sunngifu la Generosa", major: "Acume", minor: "Vigore", virtue: "Illuminato", hubris: "Fiducioso", legendaryName: "Carpe Diem", legendaryDesc: "Permette a un alleato di agire immediatamente come se avesse il numero di Incrementi più alto del Round." },
                { name: "Wilfrith la Volitiva", major: "Risolutezza", minor: "Vigore", virtue: "Determinato", hubris: "Orgoglioso", legendaryName: "Guarigione Miracolosa", legendaryDesc: "Con il tocco delle mani guarisce istantaneamente tutte le Ferite ordinarie e 2 Ferite Drammatiche di un alleato." },
                { name: "Wulfnoð l’Ardito", major: "Vigore", minor: "Grazia", virtue: "Adattabile", hubris: "Avventato", legendaryName: "Non Sono Ancora Finito", legendaryDesc: "Anche se raggiunge la 4ª Ferita Drammatica, non diventa Inerme e continua a combattere con +2 Incrementi fino a fine Scena." }
            ],
            powers: [
                // Fortuna (6)
                { name: "Piccola Fortuna", trait: "Fortuna", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Dopo aver tirato i dadi per un Rischio, puoi ritirare un numero di dadi pari al tuo Grado in questo Incanto (1–5)." },
                { name: "Grande Fortuna", trait: "Fortuna", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Dopo aver tirato i dadi per un Rischio, scegli 1 singolo dado e aggiungi al suo risultato il tuo Grado in questo Incanto (1–5)." },
                { name: "Eroico", trait: "Fortuna", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Scegli 1 Abilità; per questo Rischio puoi ritirare fino a un numero di dadi pari al tuo Grado in questo Incanto (1–5) quando usi quell'Abilità." },
                { name: "Mitico", trait: "Fortuna", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Per il resto della Scena, in un singolo Tratto associato al tuo Cavaliere ottieni Incrementi extra pari al tuo Grado in questo Incanto (1–5)." },
                { name: "Fortuna Folle", trait: "Fortuna", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Prima di tirare per un Rischio, metti da parte un numero di dadi pari al tuo Grado in questo Incanto (1–5) e disponili sul 10 (contano come 10 tirati)." },
                { name: "Leggenda", trait: "Fortuna", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Dona a un alleato un numero di dadi bonus al suo prossimo Rischio pari al doppio del tuo Grado in questo Incanto (2–10 dadi)." },
                // Vigore (4)
                { name: "Battere gli Sgherri", trait: "Vigore", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Sconfiggi istantaneamente una Squadra di Sgherri di Forza pari o inferiore al doppio del tuo Grado in questo Incanto (2–10)." },
                { name: "Più Forte di Te", trait: "Vigore", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Quando spendi 1 Incremento per infliggere Ferite, aggiungi Ferite extra pari al tuo Grado in questo Incanto (1–5)." },
                { name: "Battere il Malvagio", trait: "Vigore", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Infliggi immediatamente a un Malvagio un numero di Ferite pari al triplo del tuo Grado in questo Incanto (3–15 Ferite)." },
                { name: "Il Più Forte Che C’è", trait: "Vigore", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Per un singolo Rischio di Vigore compi un'impresa di forza sovrumana e aggiungi Incrementi bonus pari al doppio del tuo Grado in questo Incanto (2–10)." },
                // Grazia (4)
                { name: "Lampo", trait: "Grazia", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Con un attacco a distanza colpisci un bersaglio ovunque si trovi (purché visibile o noto), aggiungendo Ferite pari al tuo Grado in questo Incanto (1–5)." },
                { name: "Svanire", trait: "Grazia", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Diventi invisibile per un numero di Azioni o momenti pari al tuo Grado in questo Incanto (1–5); svanisce se attacchi." },
                { name: "Primo", trait: "Grazia", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Agisci per primo nel Round e ottieni Incrementi bonus pari al tuo Grado in questo Incanto (1–5) che puoi spendere immediatamente." },
                { name: "Colpo Sicuro", trait: "Grazia", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Il tuo prossimo attacco non può essere evitato, parato o ridotto dal bersaglio e infligge Ferite extra pari al doppio del tuo Grado in questo Incanto (2–10)." },
                // Panache (4)
                { name: "Percepire la Stregoneria", trait: "Panache", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Percepisci qualsiasi uso di Stregoneria o presenza Sidhe/Mostruosa entro una distanza commisurata al tuo Grado (1–5) e ottieni altrettanti Incrementi per identificarla." },
                { name: "Riparare la Nave", trait: "Panache", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Ripari istantaneamente sulla tua nave un numero di Ferite Critiche pari al tuo Grado in questo Incanto (1–5)." },
                { name: "Resistere alla Stregoneria", trait: "Panache", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Annulli completamente gli effetti di una Stregoneria o potere di Mostro diretto contro di te o entro portata, fino a una potenza pari al tuo Grado (1–5)." },
                { name: "Fondersi alla Nave", trait: "Panache", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Per il resto della Scena la nave su cui ti trovi ottiene Incrementi bonus a tutti i Rischi navali pari al tuo Grado in questo Incanto (1–5)." },
                // Risolutezza (4)
                { name: "Il Dolore È Temporaneo", trait: "Risolutezza", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Riduci le Ferite che stai per subire da una singola fonte di un ammontare pari al doppio del tuo Grado in questo Incanto (2–10 Ferite)." },
                { name: "Nessuna Paura", trait: "Risolutezza", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Tu e un numero di alleati pari al tuo Grado in questo Incanto (1–5) diventate totalmente immuni alla Paura fino alla fine della Scena." },
                { name: "Veglia Eterna", trait: "Risolutezza", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Non puoi cadere Inerme né morire per un numero di Round pari al tuo Grado in questo Incanto (1–5), anche se subisci 4 o più Ferite Drammatiche." },
                { name: "Rinato", trait: "Risolutezza", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Guarisci istantaneamente un numero di Ferite Drammatiche (tue o di un alleato toccato) pari al tuo Grado in questo Incanto (1–5, max 3)." },
                // Acume (4)
                { name: "Afferrare Frecce", trait: "Acume", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Afferri a mezz'aria frecce, coltelli o proiettili lanciati (non da fuoco), annullando fino a un numero di attacchi o Incrementi pari al tuo Grado (1–5)." },
                { name: "Evocare Sidhe", trait: "Acume", type: "Incanto Minore", doses: 1, desc: "1 PE (1/Scena): Richiami uno spirito Sidhe minore che ti assiste concedendo Incrementi bonus pari al tuo Grado in questo Incanto (1–5) in un compito specifico." },
                { name: "Afferrare Pallottole", trait: "Acume", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Afferri al volo una palla di moschetto o pistola sparata contro di te o un alleato vicino, annullando la Ferita Drammatica bonus dell'arma da fuoco e riducendo i danni di 2 × Grado." },
                { name: "Circolo Sidhe", trait: "Acume", type: "Incanto Maggiore", doses: 1, desc: "1 PE (1/Episodio): Apri un passaggio fatato attraverso un cerchio di funghi o pietre per viaggiare istantaneamente in un altro luogo di Avalon o delle Isole del Glamour con alleati pari al tuo Grado (1–5)." }
            ]
        },
        {
            name: "Dar Matushki",
            aliases: ["Dar Matushki", "Tocco della Madre"],
            nation: "Ussura",
            source: "Manuale Base pp. 217-218 & Nazioni di Théah Vol. 2 pp. 143-144",
            description: "Il Tocco della Madre (Nonna Ussura). Ogni Grado di Stregoneria conferisce 1 Lezione, composta da 2 Doni e 1 Restrizione (con relativo Limite e Penitenza). Attivare un Dono costa 1 Punto Eroe. Se l'Eroe viola il Limite della sua Restrizione, perde l'accesso ai 2 Doni di quella Lezione finché non compie la Penitenza.",
            rulesSummary: "1 Lezione per Grado = 2 Doni + 1 Restrizione. Attivare un Dono costa 1 PE. Violare il Limite blocca i 2 Doni della Lezione fino alla Penitenza.",
            restrictions: [
                { name: "Efficacia", limit: "Non puoi mai rifiutare una richiesta d'aiuto sincera da chi non può difendersi da solo.", penance: "Costruire o riparare qualcosa di essenziale per una comunità povera lavorando a mani nude dall'alba al tramonto." },
                { name: "Clemenza", limit: "Non puoi mai uccidere o giustiziare un nemico che si è arreso o che è stato reso Inerme.", penance: "Vegliare e curare gratuitamente un malato o un nemico ferito per un'intera notte e un intero giorno." },
                { name: "Onestà", limit: "Non puoi mai pronunciare una menzogna deliberata né giurare il falso.", penance: "Confessare pubblicamente il proprio inganno davanti alle persone tradite e accettarne le conseguenze senza difendersi." },
                { name: "Gentilezza", limit: "Non puoi mai negare cibo, acqua o riparo al tuo fuoco a un viaggiatore o animale affamato.", penance: "Digiunare per tre giorni donando tutto il proprio cibo agli animali selvatici o ai mendicanti." },
                { name: "Moderazione", limit: "Non puoi mai accumulare ricchezze superflue né tenere per te più di quanto puoi trasportare a piedi.", penance: "Regalare tutti i propri averi non essenziali (azzerando i punti Ricchezza) ai bisognosi." }
            ],
            animalForms: [
                { name: "Orso", gift: "Grande e feroce: +1 Incremento nei Rischi di Vigore e Intimidire; zampate e morsi letali." },
                { name: "Cinghiale", gift: "Testardo e corazzato: ignora la prima Ferita subita in ogni Round." },
                { name: "Gatto", gift: "Silenzioso e agile: cade sempre in piedi senza danni e vede al buio." },
                { name: "Pesce", gift: "Respira sott'acqua e nuota a velocità prodigiosa nei fiumi e nei mari gelidi." },
                { name: "Volpe", gift: "Astuta e sfuggente: +1 Incremento per Nascondersi o sfuggire alle trappole." },
                { name: "Capra", gift: "Equilibrio perfetto: scala pareti rocciose quasi verticali e ghiacciai senza scivolare." },
                { name: "Cavallo", gift: "Veloce e instancabile: corre a velocità estrema trasportando anche un alleato." },
                { name: "Topo", gift: "Minuscolo: si infila in fessure strettissime, serrature e condotti." },
                { name: "Gufo", gift: "Volo silenzioso notturno e vista acutissima nell'oscurità." },
                { name: "Coniglio", gift: "Udito finissimo e scatti fulminei per sottrarsi al pericolo." },
                { name: "Corvo", gift: "Vola in alto, imita la voce umana e osserva dall'alto senza destare sospetti." },
                { name: "Renna", gift: "Resistenza assoluta al gelo estremo e alle lunghe marce nella neve." },
                { name: "Serpente", gift: "Striscia silenzioso, percepisce il calore corporeo e possiede un morso velenoso." },
                { name: "Tartaruga", gift: "Guscio impenetrabile: può ritirarsi nel carapace prevenendo 3 Ferite." },
                { name: "Lupo", gift: "Predatore del branco: fiuto infallibile e +1 Incremento quando combatte fianco a fianco con un alleato." }
            ],
            powers: [
                { name: "Comando", type: "Dono di Matushka", doses: 1, desc: "1 PE: Parli con gli animali naturali e puoi chiedere loro un favore o impartire un comando per la durata della Scena (non agiranno in modo suicida)." },
                { name: "Illuminare", type: "Dono di Matushka", doses: 1, desc: "1 PE: Un bagliore caldo o il sussurro degli spiriti rivela la via sicura, svela illusioni, passaggi nascosti o la natura sincera delle intenzioni altrui." },
                { name: "Purificare", type: "Dono di Matushka", doses: 1, desc: "1 PE: Con il tocco purifichi immediatamente acqua, cibo o il sangue di una creatura da qualsiasi veleno naturale, tossina o malattia." },
                { name: "Ricucire", type: "Dono di Matushka", doses: 1, desc: "1 PE: Ripari istantaneamente un oggetto spezzato in legno, stoffa, cuoio, pietra o metallo comune (incluse armi, scudi o parti di una nave)." },
                { name: "Rigenerazione", type: "Dono di Matushka", doses: 1, desc: "1 PE: Toccando una creatura vivente (o te stesso), guarisci immediatamente 1 Ferita Drammatica e tutte le Ferite ordinarie." },
                { name: "Tempesta", type: "Dono di Matushka", doses: 1, desc: "1 PE: Invochi la furia dell'inverno ussurano (vento gelido, neve, nebbia fitta o pioggia torrenziale) nella Scena, creando Opportunità per gli alleati o Conseguenze per i nemici." },
                { name: "Trasformazione", type: "Dono di Matushka", doses: 1, desc: "1 PE: Ti trasformi fino alla fine della Scena in una delle 15 Forme Animali di Nonna Ussura (Orso, Lupo, Corvo, Gufo, Volpe, Pesce, ecc.), conservando la tua mente e ottenendo le doti naturali dell'animale." },
                { name: "Vista", type: "Dono di Matushka", doses: 1, desc: "1 PE: Guardando nell'acqua limpida, nel fuoco o nel ghiaccio, osservi a distanza un luogo o una persona che conosci in Ussura o nelle vicinanze." }
            ]
        },
        {
            name: "Porté",
            aliases: ["Porté", "Porte"],
            nation: "Montaigne",
            source: "Manuale Base pp. 219-221 & Nazioni di Théah Vol. 1 pp. 145-148",
            description: "La stregoneria del sangue di Montaigne che squarcia il tessuto del mondo per viaggiare attraverso il Passaggio. Ogni Grado di Stregoneria permette di mantenere 1 Marchio Maggiore e 2 Marchi Minori (più i parenti viventi di 1° grado come Marchi Maggiori gratuiti). Attenzione: non guardare mai né ascoltare i Sussurri nel Passaggio!",
            rulesSummary: "1 Marchio Maggiore + 2 Minori per Grado. Trarre o Camminare infligge 1 Ferita Drammatica (+1 Incr. in Azione). Blessure costa 0 FD ma infligge sempre Corruzione.",
            powers: [
                { name: "Apporre un Marchio", type: "Azione Base Porté", source: "Base", doses: 1, desc: "Costo: 1 PE. Bagnando un oggetto col proprio sangue, lo rendi un Marchio Minore (trasportabile a una mano; solo su oggetti non viventi) o un Marchio Maggiore (qualsiasi oggetto non vivente, luogo o struttura). Se superi il limite di Marchi, scegli quale vecchio Marchio dissolvere." },
                { name: "Percepire un Marchio", type: "Azione Base Porté", source: "Base", doses: 1, desc: "Costo: 1 Incremento in Azione (automatico entro 30 metri). Percepisci la direzione esatta e la distanza approssimativa di tutti i tuoi Marchi attivi." },
                { name: "Trarre (Verso un Marchio Minore)", type: "Azione Base Porté", source: "Base", doses: 1, desc: "Costo: 1 Ferita Drammatica (+1 Incremento in Sequenza d'Azione). Apri una piccola lacerazione e tiri a te attraverso il Passaggio uno dei tuoi Marchi Minori finché ti arriva direttamente in mano." },
                { name: "Camminare (Verso un Marchio Maggiore)", type: "Azione Base Porté", source: "Base", doses: 1, desc: "Costo: 1 Ferita Drammatica (+1 Incremento in Sequenza d'Azione). Squarci un portale sanguigno ed esci istantaneamente accanto a uno dei tuoi Marchi Maggiori (o parente vivente di 1° grado). Puoi portare con te altri personaggi volontari pagando 1 PE oppure subendo 1 Ferita ordinaria aggiuntiva per ciascun passeggero." },
                { name: "Blessure (Ferita Sanguigna)", type: "Segreto Proibito", source: "Base", corruption: true, doses: 1, desc: "Costo: 0 Ferite Drammatiche, ma infligge SEMPRE 1 Punto di Corruzione. Usi il sangue di un'altra persona (ferendola sul posto) per alimentare Trarre o Camminare senza subire la Ferita Drammatica." },
                // 5 Poteri Porté Alternativi (Nazioni di Théah Vol. 1 p. 148)
                { name: "Ancore Emotive", type: "Potere Alternativo (Vol.1)", source: "Vol.1", doses: 1, desc: "Sostituisce i legami di sangue familiari: puoi considerare come Marchi Maggiori gratuiti le persone a cui sei legato da un sentimento profondo di Amore o Odio reciproco." },
                { name: "Riserva di Sangue Estesa", type: "Potere Alternativo (Vol.1)", source: "Vol.1", doses: 1, desc: "La tua padronanza del sangue aumenta la tua capacità: puoi mantenere 1 Marchio Maggiore e 2 Marchi Minori aggiuntivi (come se avessi +1 Grado di Stregoneria per il limite dei Marchi)." },
                { name: "Occhio del Passaggio (Spiare)", type: "Potere Alternativo (Vol.1)", source: "Vol.1", doses: 1, desc: "Spendendo 1 PE, apri uno spiraglio minuscolo presso uno dei tuoi Marchi Maggiori per vedere e ascoltare ciò che accade attorno ad esso senza attraversare il Passaggio." },
                { name: "Marchio Superiore", type: "Potere Alternativo (Vol.1)", source: "Vol.1", doses: 1, desc: "Puoi designare uno dei tuoi Marchi Minori come Marchio Superiore: Trarre questo specifico oggetto non ti infligge 1 Ferita Drammatica, ma costa solo 1 Punto Eroe." },
                { name: "Passo a Vista", type: "Potere Alternativo (Vol.1)", source: "Vol.1", doses: 1, desc: "Subendo 1 Ferita Drammatica (+1 Incremento in Azione), puoi Camminare verso qualsiasi punto che puoi vedere chiaramente a occhio nudo nella Scena, anche se lì non c'è alcun Marchio." }
            ]
        },
        {
            name: "Sanderis",
            aliases: ["Sanderis"],
            nation: "Confederazione Sarmatiana",
            source: "Manuale Base pp. 222-227 & Nazioni di Théah Vol. 2 pp. 96-100",
            description: "Il Patto del losejas sarmatiano con un antico dievas. Ogni Grado di Stregoneria permette di scegliere 2 Favori Minori dal Patto del proprio dievas (Oscurità, Fuoco, Freddo, Tempesta, Mare, Conoscenza, Amore). Invocare un Favore Minore acquisito costa 1 PE (+1 Incremento in Azione). Invocare un Favore Minore non acquisito del proprio Patto costa 1 PE ma obbliga a saldare un debito del dievas. Invocare un Favore Maggiore richiede un Prezzo grave e infligge SEMPRE 1 Punto di Corruzione. A 6 Favori si apre la scelta del Settimo Patto: La Mietitura (Vol. 2 pp. 97-98).",
            rulesSummary: "2 Favori Minori per Grado. Favore Minore: 1 PE (+1 Incr. in Azione). Favore Maggiore: Prezzo + 1 Punto Corruzione obbligatorio.",
            dievaiPacts: ["Oscurità", "Fuoco", "Freddo", "Tempesta", "Mare", "Conoscenza", "Amore"],
            powers: [
                // 1. OSCURITÀ (7)
                { name: "Manto di Tenebra", pact: "Oscurità", type: "Favore Minore", doses: 1, desc: "[Oscurità] 1 PE: Avvolge un'area o una stanza in un'oscurità soprannaturale impenetrabile alla luce normale per il resto della Scena." },
                { name: "Passo nell'Ombra", pact: "Oscurità", type: "Favore Minore", doses: 1, desc: "[Oscurità] 1 PE: Il losejas entra in un'ombra abbastanza grande da contenerlo ed emerge istantaneamente da un'altra ombra visibile nella Scena." },
                { name: "Occhi della Notte", pact: "Oscurità", type: "Favore Minore", doses: 1, desc: "[Oscurità] 1 PE: Permette di vedere perfettamente nel buio più totale (naturale o magico) fino a fine Scena e dona +1 Incremento a Notare." },
                { name: "Sussurri nel Buio", pact: "Oscurità", type: "Favore Minore", doses: 1, desc: "[Oscurità] 1 PE: Le ombre portano la voce del losejas alle orecchie di chiunque si trovi nell'oscurità, o riferiscono ciò che è stato detto al buio." },
                { name: "Lama d'Ombra", pact: "Oscurità", type: "Favore Minore", doses: 1, desc: "[Oscurità] 1 PE: Condensa un'arma fatta di pura ombra solida che colpisce ignorando le armature fisiche (+2 Ferite ad ogni attacco per 1 Scena)." },
                { name: "Eclissi Divoratrice", pact: "Oscurità", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Oscurità - Maggiore] Prezzo + 1 Corruzione: Spegne il sole o tutte le luci su un'intera città o campo di battaglia, accecando tutti i nemici del losejas." },
                { name: "Divorare dall'Ombra", pact: "Oscurità", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Oscurità - Maggiore] Prezzo + 1 Corruzione: L'ombra stessa di un bersaglio prende vita e lo trascina nel nulla o gli infligge istantaneamente 2 Ferite Drammatiche." },
                // 2. FUOCO (7)
                { name: "Cuore di Brace", pact: "Fuoco", type: "Favore Minore", doses: 1, desc: "[Fuoco] 1 PE: Il losejas diventa totalmente immune al fuoco, al calore estremo e al fumo fino alla fine della Scena." },
                { name: "Lingua di Fiamma", pact: "Fuoco", type: "Favore Minore", doses: 1, desc: "[Fuoco] 1 PE: Scaglia un dardo di fuoco o avvolge la propria arma nelle fiamme (+2 Ferite per attacco e incendia materiali infiammabili)." },
                { name: "Danza delle Scintille", pact: "Fuoco", type: "Favore Minore", doses: 1, desc: "[Fuoco] 1 PE: Fa esplodere una fonte di fuoco esistente accecando e disorientando i nemici vicini (subiscono -1 Incremento nel Round)." },
                { name: "Sguardo nella Fiamma", pact: "Fuoco", type: "Favore Minore", doses: 1, desc: "[Fuoco] 1 PE: Osservando un falò o una candela, vede ciò che sta accadendo vicino a qualsiasi altro fuoco acceso che il losejas conosca." },
                { name: "Cenere alla Cenere", pact: "Fuoco", type: "Favore Minore", doses: 1, desc: "[Fuoco] 1 PE: Tocca un oggetto inanimato grande quanto una porta o un baule e lo riduce istantaneamente in cenere fredda." },
                { name: "Tempesta di Fuoco", pact: "Fuoco", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Fuoco - Maggiore] Prezzo + 1 Corruzione: Scatena una pioggia di fuoco sull'intera Scena che incenerisce tutte le Squadre di Sgherri e infligge 1 Ferita Drammatica a tutti i nemici." },
                { name: "Rinascita dalle Ceneri", pact: "Fuoco", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Fuoco - Maggiore] Prezzo + 1 Corruzione: Se il losejas viene ucciso o reso Inerme, esplode in una colonna di fuoco e risorge illeso con 0 Ferite e 0 Ferite Drammatiche." },
                // 3. FREDDO (7)
                { name: "Sangue d'Inverno", pact: "Freddo", type: "Favore Minore", doses: 1, desc: "[Freddo] 1 PE: Immunità totale al gelo, all'ipotermia e alle tempeste di neve per tutta la Scena; cammina sul ghiaccio senza mai scivolare." },
                { name: "Stretta del Gelo", pact: "Freddo", type: "Favore Minore", doses: 1, desc: "[Freddo] 1 PE: Congela all'istante una superficie d'acqua, una serratura o gli arti di un avversario (che deve spendere 1 Incremento per liberarsi)." },
                { name: "Armatura di Brina", pact: "Freddo", type: "Favore Minore", doses: 1, desc: "[Freddo] 1 PE: Uno strato di ghiaccio duro come il ferro ricopre il losejas, riducendo di 2 tutte le Ferite subite da ogni attacco per la Scena." },
                { name: "Soffio Boreale", pact: "Freddo", type: "Favore Minore", doses: 1, desc: "[Freddo] 1 PE: Un vento gelido spegne tutti i fuochi e le micce delle armi da fuoco nella Scena, impedendo di sparare per l'intero Round." },
                { name: "Scheggia di Ghiaccio", pact: "Freddo", type: "Favore Minore", doses: 1, desc: "[Freddo] 1 PE: Crea una lancia o spada di ghiaccio eterno che infligge +2 Ferite e rallenta chi viene colpito." },
                { name: "Cuore Ghiacciato", pact: "Freddo", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Freddo - Maggiore] Prezzo + 1 Corruzione: Congela il sangue nelle vene di un bersaglio, paralizzandolo completamente in una statua di ghiaccio vivente per l'intera Scena." },
                { name: "Era Glaciale", pact: "Freddo", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Freddo - Maggiore] Prezzo + 1 Corruzione: Congela un intero porto, fiume o vallata in pochi istanti, intrappolando flotte o armate nel ghiaccio." },
                // 4. TEMPESTA (7)
                { name: "Ali del Vento", pact: "Tempesta", type: "Favore Minore", doses: 1, desc: "[Tempesta] 1 PE: Il vento solleva il losejas permettendogli di compiere balzi prodigiosi o cadere da qualsiasi altezza senza subire danni." },
                { name: "Rombo di Tuono", pact: "Tempesta", type: "Favore Minore", doses: 1, desc: "[Tempesta] 1 PE: Un boato assordante scaraventa a terra tutti i presenti vicini che non spendono 1 Incremento per restare in piedi." },
                { name: "Saetta", pact: "Tempesta", type: "Favore Minore", doses: 1, desc: "[Tempesta] 1 PE: Un fulmine colpisce un bersaglio a vista infliggendo Ferite pari al Grado di Risolutezza o Acume del losejas (+1 se indossa metallo)." },
                { name: "Occhio del Ciclone", pact: "Tempesta", type: "Favore Minore", doses: 1, desc: "[Tempesta] 1 PE: Crea una barriera di vento vorticoso attorno a sé che devia frecce, dardi e proiettili leggeri per tutta la Scena." },
                { name: "Chiamare la Burrasca", pact: "Tempesta", type: "Favore Minore", doses: 1, desc: "[Tempesta] 1 PE: Alza o placa i venti e la pioggia in pochi minuti, raddoppiando la velocità di un veliero o ostacolando gli inseguitori." },
                { name: "Collera del Cielo", pact: "Tempesta", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Tempesta - Maggiore] Prezzo + 1 Corruzione: Un urgano devastante o una raffica di fulmini abbatte un edificio, affonda una nave o spazza via un'intera guarnigione." },
                { name: "Corpo di Fulmine", pact: "Tempesta", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Tempesta - Maggiore] Prezzo + 1 Corruzione: Il losejas si trasforma in un fulmine vivente per la Scena: si muove istantaneamente ovunque e chiunque lo tocchi subisce 1 Ferita Drammatica." },
                // 5. MARE (7)
                { name: "Respiro degli Abissi", pact: "Mare", type: "Favore Minore", doses: 1, desc: "[Mare] 1 PE: Il losejas (e fino a 2 alleati toccati) può respirare sott'acqua e nuotare come un delfino senza subire la pressione né il freddo per 1 Scena." },
                { name: "Richiamo della Marea", pact: "Mare", type: "Favore Minore", doses: 1, desc: "[Mare] 1 PE: Manipola una massa d'acqua per creare un'onda che travolge i nemici o spinge un'imbarcazione fuori dalle secche." },
                { name: "Camminare sulle Onde", pact: "Mare", type: "Favore Minore", doses: 1, desc: "[Mare] 1 PE: Cammina e corre sulla superficie dell'acqua (anche in mare in tempesta) come se fosse solida terraferma per l'intera Scena." },
                { name: "Voce delle Sirene", pact: "Mare", type: "Favore Minore", doses: 1, desc: "[Mare] 1 PE: Parla con le creature marine o percepisce qualsiasi nave, scoglio o relitto sommerso nel raggio di miglia." },
                { name: "Morsa di Corallo", pact: "Mare", type: "Favore Minore", doses: 1, desc: "[Mare] 1 PE: L'acqua si avvinghia attorno a un bersaglio come tentacoli liquidi, immobilizzandolo o soffocandolo." },
                { name: "Maelstrom", pact: "Mare", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Mare - Maggiore] Prezzo + 1 Corruzione: Apre un vortice abissale nel mare capace di inghiottire un galeone intero o risvegliare un leviatano degli abissi." },
                { name: "Maledizione dell'Annegato", pact: "Mare", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Mare - Maggiore] Prezzo + 1 Corruzione: Riempie d'acqua salata i polmoni di un nemico anche sulla terraferma, rendendolo immediatamente Inerme salvo spendere tutti i suoi Incrementi." },
                // 6. CONOSCENZA (7)
                { name: "Lingua di Babele", pact: "Conoscenza", type: "Favore Minore", doses: 1, desc: "[Conoscenza] 1 PE: Comprende, parla e legge qualsiasi lingua mortale (antica o moderna, incluso il Syrneth) per il resto della Scena." },
                { name: "Occhio che Tutto Vede", pact: "Conoscenza", type: "Favore Minore", doses: 1, desc: "[Conoscenza] 1 PE: Scopre istantaneamente se una persona sta mentendo e quale sia il suo timore o desiderio superficiale." },
                { name: "Memoria del Sangue", pact: "Conoscenza", type: "Favore Minore", doses: 1, desc: "[Conoscenza] 1 PE: Toccando un oggetto, assiste a una visione nitida dell'ultimo evento significativo accaduto attorno ad esso." },
                { name: "Mente Tagliente", pact: "Conoscenza", type: "Favore Minore", doses: 1, desc: "[Conoscenza] 1 PE: Il dievas sussurra la soluzione: ottieni +2 Incrementi in qualsiasi Rischio di Istruzione, Notare o Arte della Guerra." },
                { name: "Velo dell'Oblio", pact: "Conoscenza", type: "Favore Minore", doses: 1, desc: "[Conoscenza] 1 PE: Cancella gli ultimi 5 minuti di memoria dalla mente di un PNG non-Malvagio con cui ha appena parlato." },
                { name: "Onniscienza Proibita", pact: "Conoscenza", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Conoscenza - Maggiore] Prezzo + 1 Corruzione: Il dievas rivela la verità assoluta su qualsiasi complotto, luogo segreto o punto debole mortale di un Malvagio." },
                { name: "Riscrivere la Mente", pact: "Conoscenza", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Conoscenza - Maggiore] Prezzo + 1 Corruzione: Altera profondamente i ricordi, la fedeltà o la personalità di una vittima in modo permanente." },
                // 7. AMORE (7)
                { name: "Sguardo Magnetico", pact: "Amore", type: "Favore Minore", doses: 1, desc: "[Amore] 1 PE: Chiunque guardi il losejas prova un'attrazione o simpatia irresistibile: +2 Incrementi nei Rischi di Allettare o Convincere per la Scena." },
                { name: "Legame del Cuore", pact: "Amore", type: "Favore Minore", doses: 1, desc: "[Amore] 1 PE: Percepisce esattamente verso chi sono rivolti l'amore, la gelosia o il tradimento di tutte le persone presenti nella Scena." },
                { name: "Bacio della Quiete", pact: "Amore", type: "Favore Minore", doses: 1, desc: "[Amore] 1 PE: Con una carezza o una parola dolce placa l'ira di un bersaglio; per attaccare il losejas deve spendere 2 Incrementi extra." },
                { name: "Scintilla di Passione", pact: "Amore", type: "Favore Minore", doses: 1, desc: "[Amore] 1 PE: Accende un'infatuazione o una gelosia improvvisa tra due persone presenti per tutta la durata della Scena." },
                { name: "Dolore Condiviso", pact: "Amore", type: "Favore Minore", doses: 1, desc: "[Amore] 1 PE: Trasferisce le Ferite ordinarie subite da una persona amata o da un alleato direttamente sul proprio corpo (o viceversa se consenziente)." },
                { name: "Ossessione Cieca", pact: "Amore", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Amore - Maggiore] Prezzo + 1 Corruzione: Un bersaglio cade in una devozione fanatica verso il losejas, pronto a tradire i propri alleati o rischiare la vita per lui per 1 Episodio." },
                { name: "Cuore Infranto", pact: "Amore", type: "Favore Maggiore", corruption: true, doses: 1, desc: "[Amore - Maggiore] Prezzo + 1 Corruzione: Spezza il cuore di un nemico con un dolore emotivo insostenibile, infliggendogli 2 Ferite Drammatiche e rendendolo incapace di agire nel Round." }
            ]
        },
        {
            name: "Sorte",
            aliases: ["Sorte", "Sorte Non Addestrata"],
            nation: "Vodacce",
            source: "Manuale Base pp. 228-231 & Nazioni di Théah Vol. 2 pp. 191-194",
            description: "L’arte delle Streghe del Fato di Vodacce. 1° Grado: Lettura + 2 Effetti Minori + 1 Maggiore; 2° Grado: Lettura + 3 Minori + 2 Maggiori; 3° Grado: Lettura + 4 Minori + 3 Maggiori; 4° Grado: Tutti (Lettura + 4 Minori + 4 Maggiori). Ogni Trama accumula Staffilate (+1 per Effetto Minore, +2 per Maggiore). Con 1 Punto Pericolo il GM annulla tutti i dadi della Strega inferiori alle sue Staffilate attuali. Rimuovere 1 Staffilata costa Sangue (subisce Ferite = Staffilate attuali) o Sfortuna (il GM ottiene Punti Pericolo = Staffilate attuali). Include Tessere Senza Addestramento (Vol. 2 p. 192).",
            rulesSummary: "Lettura (0 PE, 0 Staffilate). Minori (+1 Staffilata), Maggiori (+2 Staffilate). Rimuovere 1 Staffilata: Sangue (Ferite = Staffilate) o Sfortuna (PP al GM = Staffilate).",
            powers: [
                { name: "Lettura", category: "Lettura", type: "Base (Sempre attiva)", lashes: 0, doses: 1, desc: "Costo: 0 PE, 0 Staffilate (1 Incremento in Sequenza d'Azione). La Strega apre la vista sui fili del destino: vede i fili d'oro, d'argento, rossi e neri che collegano le persone nella Scena e legge il mazzo della Sorte." },
                // 4 Effetti Minori (+1 Staffilata)
                { name: "Arcani (Minore)", category: "Arcani", type: "Trama Minore (+1 Staffilata)", lashes: 1, doses: 1, desc: "Costo: 1 PE + 1 Staffilata. Estrae una carta per un bersaglio nella Scena: gli conferisce l'Adesivo di Virtù oppure l'Adesivo di Hubris di un Arcano scelto dalla Strega fino alla fine della Scena." },
                { name: "Benedizione (Minore)", category: "Benedizione", type: "Trama Minore (+1 Staffilata)", lashes: 1, doses: 1, desc: "Costo: 1 PE + 1 Staffilata. Accarezza il filo di un bersaglio: gli dona un numero di dadi bonus al suo prossimo Rischio pari al Grado di Stregoneria della Strega." },
                { name: "Maledizione (Minore)", category: "Maledizione", type: "Trama Minore (+1 Staffilata)", lashes: 1, doses: 1, desc: "Costo: 1 PE + 1 Staffilata. Tende il filo di un nemico: gli sottrae un numero di dadi dal suo prossimo Rischio pari al Grado di Stregoneria della Strega." },
                { name: "Trascinare (Minore)", category: "Trascinare", type: "Trama Minore (+1 Staffilata)", lashes: 1, doses: 1, desc: "Costo: 1 PE + 1 Staffilata. Tira fisicamente un filo per attrarre un oggetto incustodito in mano, far inciampare un nemico o spostare una persona nella Scena." },
                // 4 Effetti Maggiori (+2 Staffilate)
                { name: "Arcani (Maggiore)", category: "Arcani", type: "Trama Maggiore (+2 Staffilate)", lashes: 2, doses: 1, desc: "Costo: 1 PE + 2 Staffilate. Riscrive il destino arcano del bersaglio fino a fine Episodio, sostituendo la sua Virtù e la sua Hubris con quelle dell'Arcano prescelto e attivandole immediatamente." },
                { name: "Benedizione (Maggiore)", category: "Benedizione", type: "Trama Maggiore (+2 Staffilate)", lashes: 2, doses: 1, desc: "Costo: 1 PE + 2 Staffilate. Intreccia la fortuna dorata attorno a un alleato: per l'intera Scena l'alleato ottiene Incrementi bonus a ogni Rischio pari al Grado di Stregoneria della Strega." },
                { name: "Maledizione (Maggiore)", category: "Maledizione", type: "Trama Maggiore (+2 Staffilate)", lashes: 2, doses: 1, desc: "Costo: 1 PE + 2 Staffilate. Annoda di nero il destino di un bersaglio: per l'intera Scena perde Incrementi ad ogni Rischio pari al Grado di Stregoneria della Strega (e le Ferite subite aumentano)." },
                { name: "Trascinare (Maggiore)", category: "Trascinare", type: "Trama Maggiore (+2 Staffilate)", lashes: 2, doses: 1, desc: "Costo: 1 PE + 2 Staffilate. Afferra il filo maestro di una persona o di una Squadra costringendola a compiere un'azione fisica immediata o immobilizzandola nei propri fili per 1 Round." }
            ]
        },
        {
            name: "Alquimia",
            aliases: ["Alquimia", "Alchimia"],
            nation: "Castille",
            source: "Nazioni di Théah Vol. 1 pp. 95-100",
            description: "La scienza sacra e proibita dei Boticarios di Castille. Ogni Grado di Stregoneria sblocca 1 delle 5 Juvenilia (Wai Dan, Rasāyana, Chymica, Spagyrica, Takwin); ogni Grado oltre il 1° permette di scegliere 1 composto realizzabile nel proprio Laboratorium ignorandone i Requisiti. Creare un composto costa 1 PE + Requisiti; attivarlo costa 1 Incremento. L'alchimista può trasportare al massimo un numero di composti pari al proprio Grado di Stregoneria (il doppio dentro il Laboratorium). Può inoltre perseguire una Magna Opera (Crisopea, Panacea, Alkahest) come Storia a 5 Atti.",
            rulesSummary: "1 Juvenilia per Grado. Creazione: 1 PE + Requisiti (o 0 Req nel Laboratorium per composti padroneggiati). Uso: 1 Incremento. Max trasportabili: Grado (2× nel Laboratorium).",
            juveniliaCategories: ["Wai Dan", "Rasāyana", "Chymica", "Spagyrica", "Takwin"],
            magnaOperaList: [
                { name: "Crisopea", desc: "La Grande Opera della trasmutazione dei metalli vili in oro puro incorruttibile e della perfezione della materia." },
                { name: "Panacea", desc: "Il rimedio universale capace di debellare qualsiasi morbo, veleno o ferita mortale e prolungare la vita." },
                { name: "Alkahest", desc: "Il solvente assoluto in grado di scomporre qualsiasi sostanza creata o artefatto Syrneth nei suoi elementi primordiali." }
            ],
            powers: [
                // 1. WAI DAN (5)
                { name: "Longevità", juvenilia: "Wai Dan", reqs: 1, type: "Wai Dan (1 Req)", doses: 1, desc: "[Wai Dan • 1 Requisito] Tonico vitale che rinvigorisce il corpo: ignora tutte le penalità da stanchezza, fame, sete o vecchiaia e previene 1 Ferita Drammatica nella Scena." },
                { name: "Memoria", juvenilia: "Wai Dan", reqs: 1, type: "Wai Dan (1 Req)", doses: 1, desc: "[Wai Dan • 1 Requisito] Permette di ricordare con precisione fotografica qualsiasi testo letto, mappa osservata o conversazione udita in passato (+2 Incrementi ai Rischi di memoria/Istruzione)." },
                { name: "Intelligenza", juvenilia: "Wai Dan", reqs: 2, type: "Wai Dan (2 Req)", doses: 1, desc: "[Wai Dan • 2 Requisiti] Espande la lucidità mentale: per il resto della Scena il Grado di Acume aumenta di +1 (fino a 5) e tutti i 10 tirati su Acume contano come 2 Incrementi." },
                { name: "Gioventù", juvenilia: "Wai Dan", reqs: 1, type: "Wai Dan (1 Req)", doses: 1, desc: "[Wai Dan • 1 Requisito] Restituisce il vigore e l'aspetto della giovinezza per una Scena, conferendo +1 Incremento a tutti i Rischi fisici (Vigore e Grazia)." },
                { name: "Eccellenza della Gloria", juvenilia: "Wai Dan", reqs: 0, type: "Wai Dan (0 Req)", doses: 1, desc: "[Wai Dan • 0 Requisiti] Infonde un'aura radiosa di sicurezza e carisma: +1 Incremento immediato nei Rischi di Panache o sociali nella Scena." },
                // 2. RASĀYANA (5)
                { name: "Sale della Luce Senza Calore", juvenilia: "Rasāyana", reqs: 0, type: "Rasāyana (0 Req)", doses: 1, desc: "[Rasāyana • 0 Requisiti] Cristalli luminescenti che illuminano a giorno un'intera sala o il ponte di una nave senza produrre calore né fiamma (funziona anche sott'acqua)." },
                { name: "Lega Infrangibile", juvenilia: "Rasāyana", reqs: 1, type: "Rasāyana (1 Req)", doses: 1, desc: "[Rasāyana • 1 Requisito] Trattamento metallurgico che rende un'arma, uno scudo o una serratura impossibile da spezzare e conferisce +1 Incremento quando la si usa per parare o colpire." },
                { name: "Inchiostro Soporifero", juvenilia: "Rasāyana", reqs: 2, type: "Rasāyana (2 Req)", doses: 1, desc: "[Rasāyana • 2 Requisiti] Inchiostro alchemico: chiunque legga o tocchi la pergamena su cui è steso cade in un sonno profondo per l'intera Scena (un Malvagio deve spendere 2 Incrementi per resistere)." },
                { name: "Polvere Anestetica", juvenilia: "Rasāyana", reqs: 1, type: "Rasāyana (1 Req)", doses: 1, desc: "[Rasāyana • 1 Requisito] Annulla il dolore fisico: chi la assume ignora tutte le penalità delle Ferite Drammatiche e riceve 3 Ferite in meno dal prossimo attacco." },
                { name: "Sale Essenziale di Magnetite", juvenilia: "Rasāyana", reqs: 0, type: "Rasāyana (0 Req)", doses: 1, desc: "[Rasāyana • 0 Requisiti] Polvere magnetica potentissima che attira o respinge oggetti metallici (armi, chiavi, proiettili) entro portata." },
                // 3. CHYMICA (5)
                { name: "Collante del Boticario", juvenilia: "Chymica", reqs: 0, type: "Chymica (0 Req)", doses: 1, desc: "[Chymica • 0 Requisiti] Resina istantanea più forte del ferro: salda insieme due superfici o blocca una porta/arma nel fodero (richiede un Rischio di Vigore con 3 Incrementi per staccarla)." },
                { name: "Leggero come una Piuma", juvenilia: "Chymica", reqs: 0, type: "Chymica (0 Req)", doses: 1, desc: "[Chymica • 0 Requisiti] Riduce drasticamente il peso di un oggetto pesante (masso, cannone, forziere) o di una persona per 1 Scena, permettendo di sollevarlo con una mano." },
                { name: "Acqua in Ghiaccio", juvenilia: "Chymica", reqs: 1, type: "Chymica (1 Req)", doses: 1, desc: "[Chymica • 1 Requisito] Fiala endotermica che congela istantaneamente una massa d'acqua, spegne un incendio o crea una barriera di ghiaccio solido." },
                { name: "Solvente Universale Assoluto", juvenilia: "Chymica", reqs: 1, type: "Chymica (1 Req)", doses: 1, desc: "[Chymica • 1 Requisito] Acido alchemico che scioglie sbarre d'acciaio, lucchetti, catene o pietra in pochi secondi senza danneggiare il vetro che lo contiene." },
                { name: "Vero Piombo", juvenilia: "Chymica", reqs: 0, type: "Chymica (0 Req)", doses: 1, desc: "[Chymica • 0 Requisiti] Aumenta enormemente la densità e il peso di un oggetto: fa sprofondare un'imbarcazione leggera o rende uno scudo/arma impossibile da sollevare per un nemico." },
                // 4. SPAGYRICA (5)
                { name: "Amaranthus", juvenilia: "Spagyrica", reqs: 0, type: "Spagyrica (0 Req + 1 PE)", doses: 1, desc: "[Spagyrica • 0 Requisiti + 1 PE] Estratto del fiore immortale: somministrato a un bersaglio, stabilizza una condizione critica e guarisce 1 Ferita Drammatica." },
                { name: "Betonica", juvenilia: "Spagyrica", reqs: 2, type: "Spagyrica (2 Req)", doses: 1, desc: "[Spagyrica • 2 Requisiti] Elisir erboristico che protegge la mente: rende immuni alla Paura, alle illusioni e alle manipolazioni mentali o stregonesche per l'intera Scena." },
                { name: "Celidonia", juvenilia: "Spagyrica", reqs: 0, type: "Spagyrica (0 Req)", doses: 1, desc: "[Spagyrica • 0 Requisiti] Collirio spagirico che acuisce la vista: permette di vedere al buio, attraverso il fumo o la nebbia e dona +1 Incremento a Notare e Mira." },
                { name: "Euforbia", juvenilia: "Spagyrica", reqs: 1, type: "Spagyrica (1 Req)", doses: 1, desc: "[Spagyrica • 1 Requisito] Purgante alchemico che neutralizza istantaneamente qualsiasi veleno, droga o infezione presente nel corpo." },
                { name: "Girasole", juvenilia: "Spagyrica", reqs: 1, type: "Spagyrica (1 Req)", doses: 1, desc: "[Spagyrica • 1 Requisito] Infuso solare che infonde coraggio ed energia: chi lo beve ottiene +1 Incremento immediato nel Round e rimuove tutte le Ferite ordinarie." },
                // 5. TAKWIN (5)
                { name: "Lenti Amplificatrici a Lunga Distanza", juvenilia: "Takwin", reqs: 0, type: "Takwin (0 Req)", doses: 1, desc: "[Takwin • 0 Requisiti] Dispositivo ottico di precisione che permette di osservare dettagli minimi a chilometri di distanza o mirare senza penalità di gittata (+1 Incremento a Mira/Notare)." },
                { name: "Apparato di Respirazione Subacquea", juvenilia: "Takwin", reqs: 0, type: "Takwin (0 Req)", doses: 1, desc: "[Takwin • 0 Requisiti] Maschera alchemica con filtri d'aria che consente di respirare sott'acqua o in ambienti saturi di gas velenosi per un'intera Scena." },
                { name: "Rilevatore a Visione Notturna", juvenilia: "Takwin", reqs: 0, type: "Takwin (0 Req)", doses: 1, desc: "[Takwin • 0 Requisiti] Visore alchemico che rivela il calore dei corpi viventi e permette di orientarsi e combattere nell'oscurità totale senza penalità." },
                { name: "Braccio Meccanico", juvenilia: "Takwin", reqs: 1, type: "Takwin (1 Req)", doses: 1, desc: "[Takwin • 1 Requisito] Guanto o arto meccanico articolato che aumenta la forza di presa e conferisce +1 Incremento nei Rischi di Vigore, Rissa o Artigianato." },
                { name: "Costrutto Semplice", juvenilia: "Takwin", reqs: 2, type: "Takwin (2 Req)", doses: 1, desc: "[Takwin • 2 Requisiti] Un piccolo automa o homunculus alchemico capace di eseguire ordini semplici, fare la guardia, consegnare messaggi o creare un diversivo (+2 Incrementi di supporto)." }
            ]
        },
        {
            name: "Galdr",
            aliases: ["Galdr", "Futhark", "Galdr & Futhark", "Rune"],
            nation: "Vestenmennavenjar",
            source: "Nazioni di Théah Vol. 1 pp. 191-195",
            description: "L'antica magia runica del Futhark praticata dai vala e dagli skald di Vestenmennavenjar. Ogni Grado di Stregoneria insegna 2 Rune del Futhark (su 12 totali). Spendendo 1 Punto Eroe (+1 Incremento in Azione/Drammatica), il vala spezza la runa che porta inciso il proprio nome per attivare contemporaneamente 1 Stort Merke (Marchio Maggiore) e 1 Litet Merke (Marchio Minore) scelti tra le rune che conosce (anche dalla stessa runa).",
            rulesSummary: "2 Rune del Futhark per Grado. Attivazione (1 PE + 1 Incr. in Azione): attiva insieme 1 Stort Merke (Maggiore) + 1 Litet Merke (Minore) tra le Rune conosciute.",
            powers: [
                { name: "Runa: Bestia (Dyr)", rune: "Bestia", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Tutti gli animali nella Scena obbediscono ai comandi del vala, oppure il vala assume la ferocia di una bestia ottenendo +2 Incrementi in Mischia/Rissa eAtletica.", litetMerke: "Litet Merke (Minore): Percepisce la presenza e il numero di tutte le creature viventi vicine e ottiene +1 Incremento per seguire tracce o cavalcare.", desc: "Stort Merke: Domina le bestie nella Scena o ottiene +2 Incrementi ferini in combattimento/atletica. • Litet Merke: Percepisce ogni creatura vivente vicina (+1 Incremento a tracce/cavalcare)." },
                { name: "Runa: Coraggio (Mot)", rune: "Coraggio", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Il vala e tutti i suoi alleati nella Scena diventano immuni alla Paura e ottengono +1 Incremento in tutti i Rischi finché affrontano il pericolo a viso aperto.", litetMerke: "Litet Merke (Minore): Rimuove immediatamente ogni effetto di Paura o esitazione da un singolo personaggio e gli conferisce +1 dado al prossimo Rischio.", desc: "Stort Merke: Tutti gli alleati sono immuni alla Paura e ottengono +1 Incremento nella Scena. • Litet Merke: Cancella la Paura da un alleato (+1 dado)." },
                { name: "Runa: Ferro (Jern)", rune: "Ferro", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Le armi degli alleati infliggono +2 Ferite ad ogni attacco per il resto del Round, oppure spezza istantaneamente l'arma non magica di un nemico.", litetMerke: "Litet Merke (Minore): L'arma o l'armatura toccata dal vala conferisce +1 Incremento nel prossimo attacco o previene 2 Ferite.", desc: "Stort Merke: +2 Ferite alle armi alleate per il Round oppure spezza l'arma di un avversario. • Litet Merke: +1 Incremento con l'arma o previene 2 Ferite." },
                { name: "Runa: Inverno (Vinter)", rune: "Inverno", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Scatena il gelo mordente del nord: tutti i nemici nella Scena perdono 1 Incremento per il freddo estremo e l'acqua circostante si congela solidamente.", litetMerke: "Litet Merke (Minore): Rende il vala immune al freddo/fuoco per la Scena o congela un piccolo oggetto/serratura.", desc: "Stort Merke: Gelo nordico che toglie 1 Incremento ai nemici e congela le acque. • Litet Merke: Immunità a freddo/calore o congela un oggetto." },
                { name: "Runa: Luce (Lys)", rune: "Luce", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Un lampo accecante svela ogni illusione o nemico nascosto e costringe gli avversari a spendere 1 Incremento per poter attaccare in questo Round.", litetMerke: "Litet Merke (Minore): La runa brilla come una torcia inestinguibile e rivela se una persona ha appena detto la verità.", desc: "Stort Merke: Luce accecante che svela inganni e impone 1 Incremento ai nemici per attaccare. • Litet Merke: Luce inestinguibile e percezione della verità." },
                { name: "Runa: Pietra (Stein)", rune: "Pietra", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): La pelle del vala diventa dura come il granito: riduce di 3 tutte le Ferite subite da qualsiasi fonte per il resto della Scena e non può essere atterrato.", litetMerke: "Litet Merke (Minore): Previene 2 Ferite da un singolo attacco o fa tremare il suolo creando un'Opportunità.", desc: "Stort Merke: Pelle di granito (riduce di 3 le Ferite subite per la Scena, inamovibile). • Litet Merke: Previene 2 Ferite subito." },
                { name: "Runa: Sangue (Blod)", rune: "Sangue", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Risveglia il furore del sangue: guarisce 1 Ferita Drammatica a sé o a un alleato, oppure converte le proprie Ferite Drammatiche in altrettanti Incrementi bonus per il Round.", litetMerke: "Litet Merke (Minore): Guarisce tutte le Ferite ordinarie di un personaggio o rintraccia chiunque abbia perso sangue nella Scena.", desc: "Stort Merke: Guarisce 1 Ferita Drammatica oppure +1 Incremento per ogni propria FD attiva. • Litet Merke: Cura le Ferite ordinarie." },
                { name: "Runa: Spirito (Ånd)", rune: "Spirito", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Richiama gli spiriti degli antenati Einherjar che combattono al fianco del vala o rispondono a 3 domande sul passato o sul destino.", litetMerke: "Litet Merke (Minore): Permette di vedere e comunicare con gli spiriti dei defunti o percepire la magia attiva nella Scena.", desc: "Stort Merke: Richiama gli spiriti degli antenati per combattere o rispondere a 3 domande. • Litet Merke: Vede e parla con gli spiriti." },
                { name: "Runa: Stella (Stjerne)", rune: "Stella", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Guida del destino stellare: il vala o un alleato può ritirare tutti i dadi che non hanno dato 10 in un Rischio e ottiene +2 Incrementi in Navigazione.", litetMerke: "Litet Merke (Minore): Conosce con certezza assoluta la propria posizione geografica, la rotta perfetta e il tempo che farà.", desc: "Stort Merke: Ritira tutti i dadi < 10 in un Rischio (+2 Incrementi a Navigazione). • Litet Merke: Orientamento e rotta infallibili." },
                { name: "Runa: Tempesta (Storm)", rune: "Tempesta", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Invoca venti impetuosi e onde che spazzano via una Squadra di Sgherri o raddoppiano la velocità della nave del vala per l'intera Scena.", litetMerke: "Litet Merke (Minore): Una folata di vento devia un attacco a distanza contro il vala o gonfia le vele (+1 Incremento).", desc: "Stort Merke: Venti di burrasca che travolgono gli Sgherri o raddoppiano la velocità navale. • Litet Merke: Folata che devia un tiro a distanza (+1 Incremento)." },
                { name: "Runa: Tempo (Tid)", rune: "Tempo", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Piega lo scorrere degli istanti: il vala compie immediatamente 2 Azioni distinte prima che chiunque altro possa reagire, oppure annulla un'Azione appena compiuta da un nemico.", litetMerke: "Litet Merke (Minore): Agisce come se avesse +2 Incrementi ai fini dell'ordine di iniziativa nel Round.", desc: "Stort Merke: Compie 2 Azioni immediate o riavvolge un'azione nemica. • Litet Merke: +2 Incrementi per agire per primo nel Round." },
                { name: "Runa: Tuono (Torden)", rune: "Tuono", type: "Runa del Futhark", doses: 1, stortMerke: "Stort Merke (Maggiore): Colpisce con il fragore del tuono e del fulmine: infligge Ferite pari al proprio Grado di Vigore + Risolutezza a un bersaglio e stordisce chi gli sta vicino.", litetMerke: "Litet Merke (Minore): La voce del vala rimbomba come il tuono (+1 Incremento a Intimidire/Esibirsi) o un colpo infligge +2 Ferite.", desc: "Stort Merke: Colpo di fulmine e tuono (Ferite = Vigore + Risolutezza e stordisce). • Litet Merke: Voce tonante (+1 Incremento a Intimidire) o +2 Ferite." }
            ]
        },
        {
            name: "Tocco di Tură",
            aliases: ["Tocco di Tură", "Tocco di Tura", "Tura"],
            nation: "Ussura",
            source: "Nazioni di Théah Vol. 2 pp. 145-147",
            description: "Il dono tempestoso di Tură, il fratello ribelle di Matushka. Chi lo riceve porta un Marchio nero freddo al tocco (sul viso, sul collo o sulle mani; +1 Incremento nelle azioni sociali con gli Ussurani che conoscono il Marchio). Ogni Grado di Stregoneria conferisce 2 Doni di Tură e aggiunge 2 Atti al proprio Compito di Tură (fino a 4 Atti). Attivare un Dono costa 1 Punto Eroe.",
            rulesSummary: "2 Doni per Grado + Marchio nero freddo (+1 Incr. sociale con Ussurani consapevoli) + Compito di Tură (2 Atti per Grado). Attivare un Dono costa 1 PE.",
            markLocations: ["Viso", "Collo", "Mani"],
            tasksOfTura: [
                { name: "Diffondere il Messaggio di Tură", desc: "Dimostrare agli Ussurani che il cambiamento, il progresso e la libertà dal giogo di Matushka sono possibili." },
                { name: "Sabotare il Messaggio di Matushka", desc: "Smascherare la crudeltà delle lezioni di Nonna Ussura e ostacolare i suoi servitori più tradizionalisti." },
                { name: "Fermare Matushka", desc: "Spezzare il dominio antico di Nonna Ussura sulla terra e sul popolo ussurano." }
            ],
            powers: [
                // 4 Doni esclusivi di Tură (Vol. 2 pp. 146-147)
                { name: "Linguaggio degli Uccelli", type: "Dono Esclusivo di Tură", source: "Vol.2", doses: 1, desc: "1 PE: Comprende e parla il linguaggio di tutti gli uccelli; può chiedere agli stormi di esplorare dall'alto, riferire ciò che hanno visto o portare messaggi." },
                { name: "Fulmine", type: "Dono Esclusivo di Tură", source: "Vol.2", doses: 1, desc: "1 PE: Scaglia una saetta dal cielo o dalle proprie mani contro un bersaglio visibile, infliggendo istantaneamente un numero di Ferite inevitabili pari al proprio Grado di Istruzione." },
                { name: "Leggere il Vento", type: "Dono Esclusivo di Tură", source: "Vol.2", doses: 1, desc: "1 PE: Ascolta le voci e gli odori portati dal vento: può udire conversazioni lontane miglia nella direzione del vento o percepire pericoli imminenti (+2 Incrementi a Notare)." },
                { name: "Camminare nel Vento", type: "Dono Esclusivo di Tură", source: "Vol.2", doses: 1, desc: "1 PE: Si solleva sulle correnti d'aria volando o compiendo balzi impossibili attraverso la Scena fino alla fine del Round (o atterrando illeso da qualsiasi altezza)." },
                // 4 Doni condivisi con Matushka (Vol. 2 p. 146)
                { name: "Illuminare", type: "Dono Condiviso", source: "Base/Vol.2", doses: 1, desc: "1 PE: Un lampo di luce fredda svela la verità, dissipa le illusioni o mostra il cammino nascosto nella tempesta." },
                { name: "Purificare", type: "Dono Condiviso", source: "Base/Vol.2", doses: 1, desc: "1 PE: Con un soffio gelido purifica cibo, acqua o il sangue di una creatura da qualsiasi veleno naturale o malattia." },
                { name: "Rigenerazione", type: "Dono Condiviso", source: "Base/Vol.2", doses: 1, desc: "1 PE: L'energia elettrica della tempesta richiude le ferite: guarisce 1 Ferita Drammatica e tutte le Ferite ordinarie di una creatura toccata." },
                { name: "Tempesta", type: "Dono Condiviso", source: "Base/Vol.2", doses: 1, desc: "1 PE: Scatena una bufera di vento, fulmini e grandine nella Scena, creando Opportunità per gli alleati o Conseguenze per i nemici." }
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
            wealth: 0,
            duelingStyle: "Eisenfaust",
            duelingStyles: ["Eisenfaust"],
            drexelGuard: "Bittner",
            studiosoManeuver: "Finta",
            lastManeuverUsed: "",
            sorcery: "Hexenwerk",
            sorceryRank: 1,
            sorceryItems: [
                { name: "Occhio Spettrale", type: "Unguento Maggiore", source: "Base", duration: "Fino a fine Scena", doses: 1, recipe: "Gli occhi di qualcuno morto recentemente, pestati con acqua benedetta e radici di mandragora fino a formare una pasta densa.", desc: "Applicato sulle palpebre, permette per una Scena di vedere spiriti, fantasmi e altri Mostri che sono normalmente invisibili." },
                { name: "Lacrime dei Profeti", type: "Unguento Minore", source: "Base", duration: "Permanente", doses: 2, recipe: "Olio santo mescolato con spezie rare.", desc: "Applicato su un cadavere non ancora toccato dall'Hexenwerk, impedisce che quel corpo possa mai più essere riportato in vita come non-morto." },
                { name: "Flagello Rovinoso", type: "Unguento Minore", source: "Base", duration: "Fino a fine Round", doses: 2, recipe: "Una fiasca di erbe, veleni e una goccia di vino della comunione.", desc: "Lanciata contro un Mostro non-morto: se il colpo infligge almeno 1 Ferita, il GM non può spendere Punti Pericolo per attivare le Qualità Mostruose di quel Mostro fino alla fine del Round." }
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
                { name: "Sala d’Armi (Eisenfaust)", cost: 5, duelStyle: "Eisenfaust", desc: "Membro ufficiale della Gilda dei Duellanti (Stile: Eisenfaust)." },
                { name: "Stregoneria", cost: 2, desc: "Conosci le formule di Hexenwerk (1 Unguento Maggiore e 2 Unguenti Minori per Grado)." },
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
            dramaticWounds: [false, false, false, false],
            currentWounds: 0,
            maxWoundsPerThreshold: 5
        };
        normalizeCharacterSorceryState(character);
        selectedTrait = "Grazia";
        selectedSkill = "Mischia";
        isLocked = true;
        syncDropdownsWithCharacter();
        updateLockUI();
        renderSeventhSeaSheet();
        showS7Toast("Eroe esempio 'Kasper van Baarle' caricato con successo!", "info");
    }

    // RISOLUZIONE ALIAS E NORMALIZZAZIONE STATO STREGONERIA UFFICIALE (9 TRADIZIONI)
    function resolveOfficialSorceryName(rawVal, nationHint = "") {
        if (!rawVal || rawVal === "Nessuna") return "Nessuna";
        const clean = String(rawVal).trim();
        const low = clean.toLowerCase();
        if (low === "nessuna" || low === "nessuna stregoneria") return "Nessuna";
        if (low.includes("hexenwerk") || low.includes("unguent")) return "Hexenwerk";
        if (low.includes("glamour") || low.includes("avalon") || low.includes("incant") || low.includes("elilodd") || low.includes("graal")) return "Glamour";
        if (low.includes("tură") || low.includes("tura") || low.includes("vento")) return "Tocco di Tură";
        if (low.includes("matushk") || low.includes("madre") || low.includes("nonna ussura")) return "Dar Matushki";
        if (low.includes("porté") || low.includes("porte") || low.includes("passaggio")) return "Porté";
        if (low.includes("sanderis") || low.includes("dieva") || low.includes("losejas")) return "Sanderis";
        if (low.includes("sorte") || low.includes("strega") || low.includes("streghe") || low.includes("tessitrice")) return "Sorte";
        if (low.includes("alquimia") || low.includes("alchimia") || low.includes("boticario") || low.includes("juvenilia")) return "Alquimia";
        if (low.includes("galdr") || low.includes("futhark") || low.includes("runa") || low.includes("rune") || low.includes("vala")) return "Galdr";
        const found = sorceriesDb.find(s =>
            s.name.toLowerCase() === low ||
            (Array.isArray(s.aliases) && s.aliases.some(al => al.toLowerCase() === low))
        );
        if (found) return found.name;
        if (nationHint && NATIONS_CONFIG[nationHint] && NATIONS_CONFIG[nationHint].sorcery !== "Nessuna") {
            return NATIONS_CONFIG[nationHint].sorcery;
        }
        return "Nessuna";
    }

    function getDefaultSorceryMeta() {
        return {
            corruptionPoints: 0,
            // Hexenwerk
            hexenwerkUsingHexeParts: false,
            // Glamour (Cavalieri di Avalon)
            glamourKnight: "Æsc delle Foreste",
            grailDebt: 0,
            sidheCurses: [],
            incarnationUnlocked: false,
            // Dar Matushki
            matushkaLessons: [
                { restriction: "Gentilezza", gift1: "Trasformazione", gift2: "Rigenerazione", broken: false }
            ],
            matushkaActiveAnimal: "Orso",
            // Porté
            porteMarks: [
                { name: "Dimora di Famiglia", type: "Maggiore", location: "Montaigne", isFamily: false },
                { name: "Daga col Pomolo d'Oro", type: "Minore", location: "Fodero", isSuperior: false },
                { name: "Medaglione del Casato", type: "Minore", location: "Tasca", isSuperior: false }
            ],
            // Sanderis
            sanderisDievasName: "Velnias delle Ombre",
            sanderisPact: "Oscurità",
            sanderisDebtCount: 0,
            sanderisSeventhPactReaped: false,
            // Sorte
            sorteLashes: 0,
            sorteUntrained: false,
            // Alquimia
            alquimiaJuvenilia: ["Chymica"],
            alquimiaLabCompounds: [],
            alquimiaInLaboratorium: false,
            alquimiaMagnaOpera: "Panacea",
            // Galdr & Futhark
            galdrSelectedStort: "Runa: Ferro (Jern)",
            galdrSelectedLitet: "Runa: Coraggio (Mot)",
            // Tocco di Tură
            turaMarkLocation: "Mani",
            turaTask: "Diffondere il Messaggio di Tură",
            turaTaskActsDone: 0
        };
    }

    function getDefaultSorceryItemsForTradition(sorcName, meta) {
        const sObj = sorceriesDb.find(s => s.name === sorcName);
        if (!sObj || !Array.isArray(sObj.powers)) return [];
        const cloneItem = (p, extra = {}) => ({
            name: p.name,
            type: p.type,
            source: p.source || "Base",
            duration: p.duration || "",
            recipe: p.recipe || "",
            trait: p.trait || "",
            pact: p.pact || "",
            juvenilia: p.juvenilia || "",
            reqs: p.reqs !== undefined ? p.reqs : undefined,
            lashes: p.lashes !== undefined ? p.lashes : undefined,
            corruption: !!p.corruption,
            stortMerke: p.stortMerke || "",
            litetMerke: p.litetMerke || "",
            doses: p.doses || 1,
            rank: 1,
            desc: p.desc,
            ...extra
        });

        if (sorcName === "Hexenwerk") {
            const maj = sObj.powers.find(p => p.name === "Occhio Spettrale") || sObj.powers[0];
            const min1 = sObj.powers.find(p => p.name === "Lacrime dei Profeti") || sObj.powers[11];
            const min2 = sObj.powers.find(p => p.name === "Flagello Rovinoso") || sObj.powers[12];
            return [maj, min1, min2].filter(Boolean).map(p => cloneItem(p));
        }
        if (sorcName === "Glamour") {
            const kName = (meta && meta.glamourKnight) || "Æsc delle Foreste";
            const kObj = (sObj.knights || []).find(k => k.name === kName) || sObj.knights[0];
            const maj = sObj.powers.find(p => p.trait === kObj.major && p.type.includes("Maggiore")) || sObj.powers.find(p => p.name === "Veglia Eterna");
            const min1 = sObj.powers.find(p => p.name === "Piccola Fortuna");
            const min2 = sObj.powers.find(p => p.trait === kObj.minor && p.type.includes("Minore")) || sObj.powers.find(p => p.name === "Grande Fortuna");
            return [maj, min1, min2].filter(Boolean).map(p => cloneItem(p, { rank: 1 }));
        }
        if (sorcName === "Dar Matushki") {
            const g1 = sObj.powers.find(p => p.name === "Trasformazione");
            const g2 = sObj.powers.find(p => p.name === "Rigenerazione");
            return [g1, g2].filter(Boolean).map(p => cloneItem(p));
        }
        if (sorcName === "Porté") {
            return sObj.powers.slice(0, 4).map(p => cloneItem(p));
        }
        if (sorcName === "Sanderis") {
            const pact = (meta && meta.sanderisPact) || "Oscurità";
            const minors = sObj.powers.filter(p => p.pact === pact && p.type === "Favore Minore").slice(0, 2);
            return minors.map(p => cloneItem(p));
        }
        if (sorcName === "Sorte") {
            const lettura = sObj.powers.find(p => p.name === "Lettura");
            const min1 = sObj.powers.find(p => p.name === "Benedizione (Minore)");
            const min2 = sObj.powers.find(p => p.name === "Maledizione (Minore)");
            const maj1 = sObj.powers.find(p => p.name === "Arcani (Maggiore)");
            return [lettura, min1, min2, maj1].filter(Boolean).map(p => cloneItem(p));
        }
        if (sorcName === "Alquimia") {
            const juv = (meta && Array.isArray(meta.alquimiaJuvenilia) && meta.alquimiaJuvenilia[0]) || "Chymica";
            const comps = sObj.powers.filter(p => p.juvenilia === juv).slice(0, 2);
            return comps.map(p => cloneItem(p));
        }
        if (sorcName === "Galdr") {
            const r1 = sObj.powers.find(p => p.name.includes("Ferro")) || sObj.powers[0];
            const r2 = sObj.powers.find(p => p.name.includes("Coraggio")) || sObj.powers[1];
            return [r1, r2].filter(Boolean).map(p => cloneItem(p));
        }
        if (sorcName === "Tocco di Tură") {
            const t1 = sObj.powers.find(p => p.name === "Fulmine");
            const t2 = sObj.powers.find(p => p.name === "Camminare nel Vento");
            return [t1, t2].filter(Boolean).map(p => cloneItem(p));
        }
        return sObj.powers.slice(0, 2).map(p => cloneItem(p));
    }

    function normalizeCharacterSorceryState(charObj) {
        if (!charObj) return;
        const defaults = getDefaultSorceryMeta();
        if (!charObj.sorceryMeta || typeof charObj.sorceryMeta !== 'object') {
            charObj.sorceryMeta = JSON.parse(JSON.stringify(defaults));
        } else {
            for (const [k, v] of Object.entries(defaults)) {
                if (charObj.sorceryMeta[k] === undefined) {
                    charObj.sorceryMeta[k] = JSON.parse(JSON.stringify(v));
                }
            }
        }

        // Controlla se dai Vantaggi emerge una Stregoneria e/o il suo Grado (es. "Stregoneria: Cavalieri di Avalon 2")
        let detectedSorc = resolveOfficialSorceryName(charObj.sorcery, charObj.nation);
        let detectedRank = parseInt(charObj.sorceryRank) || 0;
        let isUntrainedSorte = false;

        if (Array.isArray(charObj.advantages)) {
            let advSorcCount = 0;
            charObj.advantages.forEach(adv => {
                const aName = typeof adv === 'string' ? adv : (adv && adv.name ? adv.name : "");
                if (!aName) return;
                const low = aName.toLowerCase();
                if (low.includes("sorte non addestrata") || low.includes("tessere senza addestramento")) {
                    isUntrainedSorte = true;
                    if (detectedSorc === "Nessuna") detectedSorc = "Sorte";
                }
                if (low.includes("stregoneria")) {
                    const numMatch = aName.match(/(\d+)\s*$/);
                    if (numMatch) {
                        advSorcCount = Math.max(advSorcCount, parseInt(numMatch[1]));
                    } else {
                        advSorcCount += 1;
                    }
                    if (detectedSorc === "Nessuna") {
                        const sub = aName.replace(/stregoneria\s*:?\s*/i, '').replace(/\d+\s*$/, '').replace(/[()]/g, '').trim();
                        const resolved = resolveOfficialSorceryName(sub, charObj.nation);
                        if (resolved !== "Nessuna") detectedSorc = resolved;
                    }
                }
            });
            if (advSorcCount > 0 && detectedRank < advSorcCount) {
                detectedRank = advSorcCount;
            }
        }

        if (String(charObj.sorcery || "").toLowerCase().includes("non addestrata")) {
            isUntrainedSorte = true;
        }
        if (isUntrainedSorte) {
            charObj.sorceryMeta.sorteUntrained = true;
        }

        charObj.sorcery = detectedSorc;
        if (detectedSorc === "Nessuna") {
            charObj.sorceryRank = 1;
            if (!Array.isArray(charObj.sorceryItems)) charObj.sorceryItems = [];
            return;
        }

        charObj.sorceryRank = Math.max(1, Math.min(5, detectedRank || 1));

        // Migra o popola sorceryItems eliminando qualsiasi vecchio potere inventato
        const sObj = sorceriesDb.find(s => s.name === detectedSorc);
        const validPowers = (sObj && Array.isArray(sObj.powers)) ? sObj.powers : [];
        if (!Array.isArray(charObj.sorceryItems)) charObj.sorceryItems = [];

        // Filtra solo poteri ufficiali (oppure arricchisci quelli con nome corrispondente)
        const migrated = [];
        charObj.sorceryItems.forEach(it => {
            if (!it || !it.name) return;
            const official = validPowers.find(p => p.name.toLowerCase() === it.name.toLowerCase());
            if (official) {
                migrated.push({
                    ...official,
                    doses: it.doses !== undefined ? it.doses : (official.doses || 1),
                    rank: it.rank || 1
                });
            }
        });

        if (migrated.length === 0) {
            charObj.sorceryItems = getDefaultSorceryItemsForTradition(detectedSorc, charObj.sorceryMeta);
        } else {
            charObj.sorceryItems = migrated;
        }
    }

    // NORMALIZZAZIONE E MIGRAZIONE STILI DI DUELLO PER RETROCOMPATIBILITÀ
    function normalizeCharacterDuelingState(charObj) {
        if (!charObj) return;
        const legacyMap = {
            "Dresden": "Drexel",
            "Marozzo": "Ambrogia"
        };
        if (charObj.duelingStyle && legacyMap[charObj.duelingStyle]) {
            charObj.duelingStyle = legacyMap[charObj.duelingStyle];
        }
        if (charObj.duelingStyle && !duelingStylesDb[charObj.duelingStyle]) {
            charObj.duelingStyle = "Nessuna";
        }
        if (!Array.isArray(charObj.duelingStyles)) {
            charObj.duelingStyles = [];
        }
        charObj.duelingStyles = charObj.duelingStyles
            .map(s => legacyMap[s] || s)
            .filter(s => s && s !== "Nessuna" && duelingStylesDb[s]);

        // Estrai eventuali stili dai vantaggi "Sala d'Armi (Stile)"
        if (Array.isArray(charObj.advantages)) {
            charObj.advantages.forEach(adv => {
                if (!adv || !adv.name) return;
                if (adv.duelStyle && legacyMap[adv.duelStyle]) adv.duelStyle = legacyMap[adv.duelStyle];
                const m = adv.name.match(/sala d[’']armi\s*\(([^)]+)\)/i);
                if (m && m[1]) {
                    const stName = legacyMap[m[1].trim()] || m[1].trim();
                    if (duelingStylesDb[stName] && stName !== "Nessuna" && !charObj.duelingStyles.includes(stName)) {
                        charObj.duelingStyles.push(stName);
                    }
                } else if (adv.duelStyle && duelingStylesDb[adv.duelStyle] && adv.duelStyle !== "Nessuna" && !charObj.duelingStyles.includes(adv.duelStyle)) {
                    charObj.duelingStyles.push(adv.duelStyle);
                }
            });
        }

        if (charObj.duelingStyle && charObj.duelingStyle !== "Nessuna" && !charObj.duelingStyles.includes(charObj.duelingStyle)) {
            charObj.duelingStyles.unshift(charObj.duelingStyle);
        }
        if ((!charObj.duelingStyle || charObj.duelingStyle === "Nessuna") && charObj.duelingStyles.length > 0) {
            charObj.duelingStyle = charObj.duelingStyles[0];
        }
        if (!charObj.drexelGuard) charObj.drexelGuard = "Bittner";
        if (!charObj.studiosoManeuver) charObj.studiosoManeuver = "Finta";
        if (charObj.lastManeuverUsed === undefined) charObj.lastManeuverUsed = "";
    }

    // CARICA UN EROE UFFICIALE / PNG PREGENERATO (DA EROI & MALVAGI)
    function loadHeroData(pcData) {
        if (!pcData) return;
        isLocked = false;
        customDiceModifier = 0;
        updateCustomDiceModifierUI();
        
        let startWealth = 0;
        if (pcData.wealth !== undefined) {
            startWealth = pcData.wealth;
        } else if (pcData.advantages && Array.isArray(pcData.advantages)) {
            const hasRicco = pcData.advantages.some(a => (typeof a === 'string' ? a : (a.name || '')).toLowerCase().includes('ricco'));
            const hasMecenate = pcData.advantages.some(a => (typeof a === 'string' ? a : (a.name || '')).toLowerCase().includes('mecenate'));
            if (hasRicco) startWealth = 3;
            else if (hasMecenate) startWealth = 1;
        }

        character = {
            name: pcData.name || "Eroe di Théah",
            nation: pcData.nation || "Castille",
            nationBonusTrait: null,
            concept: pcData.concept || `${pcData.archetype || 'Eroe'} • ${pcData.nation || 'Théah'}`,
            faith: pcData.faith || "Chiesa del Vaticinio",
            heroPoints: 3,
            wealth: startWealth,
            duelingStyle: pcData.duelingStyle || "Nessuna",
            duelingStyles: Array.isArray(pcData.duelingStyles) ? [...pcData.duelingStyles] : (pcData.duelingStyle && pcData.duelingStyle !== "Nessuna" ? [pcData.duelingStyle] : []),
            drexelGuard: pcData.drexelGuard || "Bittner",
            studiosoManeuver: pcData.studiosoManeuver || "Finta",
            lastManeuverUsed: "",
            sorcery: pcData.sorcery || "Nessuna",
            sorceryItems: [],
            traits: {
                "Vigore": pcData.traits?.Vigore || 2,
                "Grazia": pcData.traits?.Grazia || 2,
                "Risolutezza": pcData.traits?.Risolutezza || 2,
                "Acume": pcData.traits?.Acume || 2,
                "Panache": pcData.traits?.Panache || 2
            },
            skills: {
                "Allettare": pcData.skills?.Allettare || 0,
                "A.d. Guerra": pcData.skills?.["A.d. Guerra"] || 0,
                "Atletica": pcData.skills?.Atletica || 0,
                "Cavalcare": pcData.skills?.Cavalcare || 0,
                "Convincere": pcData.skills?.Convincere || 0,
                "Empatia": pcData.skills?.Empatia || 0,
                "Esibirsi": pcData.skills?.Esibirsi || 0,
                "Furto": pcData.skills?.Furto || 0,
                "Intimidire": pcData.skills?.Intimidire || 0,
                "Istruzione": pcData.skills?.Istruzione || 0,
                "Mira": pcData.skills?.Mira || 0,
                "Mischia": pcData.skills?.Mischia || 0,
                "Nascondersi": pcData.skills?.Nascondersi || 0,
                "Navigazione": pcData.skills?.Navigazione || 0,
                "Notare": pcData.skills?.Notare || 0,
                "Rissa": pcData.skills?.Rissa || 0
            },
            backgrounds: pcData.peculiarities ? [pcData.peculiarities.slice(0, 35)] : ["Eroe di Théah"],
            bgAppliedSkills: [[], []],
            bgAppliedAdvantages: [[], []],
            virtue: pcData.virtue ? pcData.virtue.replace(/^Virtù:\s*/i, '').slice(0, 30) : "Scaltro",
            hubris: pcData.hubris ? pcData.hubris.replace(/^(Hubris|Superbia):\s*/i, '').slice(0, 30) : "Curioso",
            advantages: (pcData.advantages || []).map(adv => (typeof adv === 'string' ? { name: adv, cost: 2, desc: adv } : adv)),
            stories: [
                {
                    title: `Destino di ${pcData.name}`,
                    goal: pcData.objectives ? pcData.objectives.slice(0, 90) : "Compiere la propria missione",
                    steps: [
                        { desc: pcData.objectives || "Inseguire il proprio ideale", done: false }
                    ]
                }
            ],
            isAdvanced: true,
            dramaticWounds: [false, false, false, false],
            currentWounds: 0,
            maxWoundsPerThreshold: 5
        };

        normalizeCharacterDuelingState(character);
        normalizeCharacterSorceryState(character);

        // Trova il tratto e l'abilità più alti per la selezione predefinita
        let bestTrait = "Vigore", maxT = -1;
        for (let [t, v] of Object.entries(character.traits)) {
            if (v > maxT) { maxT = v; bestTrait = t; }
        }
        let bestSkill = "Mischia", maxS = -1;
        for (let [s, v] of Object.entries(character.skills)) {
            if (v > maxS) { maxS = v; bestSkill = s; }
        }
        selectedTrait = bestTrait;
        selectedSkill = bestSkill;

        isLocked = true;
        syncDropdownsWithCharacter();
        updateLockUI();
        renderSeventhSeaSheet();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`Eroe ufficiale '${character.name}' (${character.nation}) caricato con successo!`, "success");
    }

    // SCHEDA VERGINE VUOTA PER NUOVO PERSONAGGIO
    function doSetBlankSheet() {
        isLocked = false;
        customDiceModifier = 0;
        updateCustomDiceModifierUI();
        const startHeroPoints = 2;
        character = {
            name: "Nuovo Eroe",
            nation: "",
            nationBonusTrait: null,
            concept: "",
            faith: "",
            heroPoints: startHeroPoints,
            wealth: 0,
            duelingStyle: "Nessuna",
            duelingStyles: [],
            drexelGuard: "Bittner",
            studiosoManeuver: "Finta",
            lastManeuverUsed: "",
            sorcery: "Nessuna",
            sorceryRank: 1,
            sorceryItems: [],
            sorceryMeta: getDefaultSorceryMeta(),
            traits: { "Vigore": 2, "Grazia": 2, "Risolutezza": 2, "Acume": 2, "Panache": 2 },
            skills: {
                "Allettare": 0, "A.d. Guerra": 0, "Atletica": 0, "Cavalcare": 0,
                "Convincere": 0, "Empatia": 0, "Esibirsi": 0, "Furto": 0,
                "Intimidire": 0, "Istruzione": 0, "Mira": 0, "Mischia": 0,
                "Nascondersi": 0, "Navigazione": 0, "Notare": 0, "Rissa": 0
            },
            backgrounds: ["", ""],
            bgAppliedSkills: [[], []],
            bgAppliedAdvantages: [[], []],
            virtue: "",
            hubris: "",
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
            const curFaith = character.faith || "";
            if (!curFaith) {
                selFaith.value = "";
                inpFaith.classList.add('hidden');
                inpFaith.value = "";
            } else {
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
        }

        if (selNation) {
            selNation.value = character.nation || "";
            populateNationTraitsDropdown(character.nation || "");
        }

        if (selNationTrait) {
            selNationTrait.value = character.nationBonusTrait || "";
        }

        if (selStyle) selStyle.value = character.duelingStyle || "Nessuna";
        if (selSorcery) selSorcery.value = character.sorcery || "Nessuna";
        if (selBg1) selBg1.value = (character.backgrounds && character.backgrounds[0] && character.backgrounds[0] !== "Nessuno") ? character.backgrounds[0] : "";
        if (selBg2) selBg2.value = (character.backgrounds && character.backgrounds[1] && character.backgrounds[1] !== "Nessuno") ? character.backgrounds[1] : "";

        // Sincronizza etichette pulsanti custom background
        [0, 1].forEach(slot => {
            const btnLabel = document.getElementById(`bg-custom-btn-label-${slot}`);
            const curBg = (character.backgrounds && character.backgrounds[slot] && character.backgrounds[slot] !== "Nessuno") ? character.backgrounds[slot] : "";
            if (btnLabel) {
                if (!curBg) {
                    btnLabel.textContent = `-- Seleziona ${slot + 1}° Background --`;
                    btnLabel.className = 'truncate text-gray-400';
                } else {
                    const b = backgroundsDb.find(x => x.name === curBg);
                    btnLabel.textContent = `${curBg} (${b ? (b.nation || 'Generale') : 'Generale'})`;
                    btnLabel.className = 'truncate text-amber-200 font-medium';
                }
            }
        });
        // Sincronizza etichetta pulsante custom stile di duello
        const styleBtnLabel = document.getElementById('style-custom-btn-label');
        if (styleBtnLabel) {
            const curStyle = character.duelingStyle || "Nessuna";
            if (!curStyle || curStyle === "Nessuna") {
                styleBtnLabel.textContent = "Nessuno Stile (Non Duellante)";
                styleBtnLabel.className = 'truncate text-gray-400';
            } else {
                const stObj = duelingStylesDb[curStyle];
                styleBtnLabel.textContent = `${curStyle} (${stObj ? (stObj.nation || 'Gilda') : 'Gilda'})`;
                styleBtnLabel.className = 'truncate text-amber-200 font-medium';
            }
        }
        if (selVirtue) selVirtue.value = character.virtue || "";
        if (selHubris) selHubris.value = character.hubris || "";
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
        if (nb) nb.innerText = character.nation || "Théah";
        const parts = [
            character.concept || 'Avventuriero',
            character.faith || '',
            '7th Sea 2ª Edizione'
        ].filter(Boolean);
        if (sub) sub.innerText = parts.join(' • ');
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
        if (!nationName || !NATIONS_CONFIG[nationName]) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.innerText = '-- Seleziona prima Nazione --';
            sel.appendChild(opt);
            return;
        }
        const optDefault = document.createElement('option');
        optDefault.value = '';
        optDefault.innerText = '-- Scegli Tratto Bonus (+1) --';
        sel.appendChild(optDefault);

        const conf = NATIONS_CONFIG[nationName];
        conf.traits.forEach(tName => {
            const opt = document.createElement('option');
            opt.value = tName;
            opt.innerText = `+1 ${tName}`;
            sel.appendChild(opt);
        });
    }

    function onNationChange(val) {
        if (character.nationBonusTrait && character.traits && character.traits[character.nationBonusTrait]) {
            character.traits[character.nationBonusTrait] = Math.max(2, character.traits[character.nationBonusTrait] - 1);
        }
        character.nationBonusTrait = null;

        if (!val) {
            character.nation = "";
            populateNationTraitsDropdown("");
            updateHeroHeader();
            renderTraits();
            updatePoolFormula();
            updateCreationTrackers();
            return;
        }

        character.nation = val;
        populateNationTraitsDropdown(val);
        const conf = NATIONS_CONFIG[val];
        if (conf && conf.traits && conf.traits.length > 0) {
            const defaultBonusTrait = conf.traits[0];
            onNationTraitChange(defaultBonusTrait);
            showS7Toast(`Nazione impostata su <b>${val}</b> (+1 ${defaultBonusTrait})`, "info");
        } else {
            updateHeroHeader();
            renderTraits();
            updatePoolFormula();
        }
        updateCreationTrackers();
    }

    function onNationTraitChange(newTrait) {
        if (!character.traits) character.traits = { Vigore: 2, Grazia: 2, Risolutezza: 2, Acume: 2, Panache: 2 };
        const oldTrait = character.nationBonusTrait;
        if (oldTrait && oldTrait !== newTrait && character.traits[oldTrait]) {
            character.traits[oldTrait] = Math.max(2, character.traits[oldTrait] - 1);
        }
        if (!newTrait) {
            character.nationBonusTrait = null;
        } else {
            character.nationBonusTrait = newTrait;
            character.traits[newTrait] = (character.traits[newTrait] || 2) + 1;
        }

        const sel = document.getElementById('sel-nation-trait');
        if (sel) sel.value = newTrait || "";

        renderTraits();
        updatePoolFormula();
        updateCreationTrackers();
    }

    // PASSO 2: APPLICAZIONE AUTOMATICA DEI 2 BACKGROUND (+1 A 5 ABILITA, VANTAGGI GRATUITI, SBLOCCO STREGONERIA/DUELLO)
    function onBgChange(idx, val) {
        if (!character.backgrounds) character.backgrounds = ["Nessuno", "Nessuno"];
        if (!character.bgAppliedSkills) character.bgAppliedSkills = [[], []];
        if (!character.bgAppliedAdvantages) character.bgAppliedAdvantages = [[], []];
        if (!Array.isArray(character.duelingStyles)) character.duelingStyles = [];

        // 1. Rimuovi i benefici precedentemente applicati dallo slot idx
        if (Array.isArray(character.bgAppliedSkills[idx])) {
            character.bgAppliedSkills[idx].forEach(skName => {
                if (character.skills && character.skills[skName]) {
                    character.skills[skName] = Math.max(0, character.skills[skName] - 1);
                }
            });
        }
        character.bgAppliedSkills[idx] = [];

        // Rimuovi eventuali stili sbloccati dallo slot idx
        if (Array.isArray(character.advantages)) {
            character.advantages.forEach(a => {
                if (a.fromBgSlot === idx && a.duelStyle && Array.isArray(character.duelingStyles)) {
                    character.duelingStyles = character.duelingStyles.filter(s => s !== a.duelStyle);
                    if (character.duelingStyle === a.duelStyle) {
                        character.duelingStyle = character.duelingStyles[0] || "Nessuna";
                    }
                }
            });
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
                const baseAdvName = advName.replace(/\s*\([^)]*\)\s*$/, '').trim();
                const catalogAdv = advantagesDb.find(a => a.name.toLowerCase() === advName.toLowerCase() || a.name.toLowerCase() === baseAdvName.toLowerCase());
                let resolvedAdvName = advName;
                let assignedStyle = null;

                // Sblocco ufficiale Stile di Duello SOLO tramite Sala d'Armi (MAI tramite Schermidore!)
                const isSalaDArmi = /sala d[’']armi/i.test(advName);
                if (isSalaDArmi) {
                    const specMatch = advName.match(/\(([^)]+)\)/);
                    const rawStyle = specMatch && specMatch[1] ? specMatch[1].trim() : "";
                    const matchedStyleKey = rawStyle ? Object.keys(duelingStylesDb).find(k => k.toLowerCase() === rawStyle.toLowerCase() || k.replace(/\s+/g, '').toLowerCase() === rawStyle.replace(/\s+/g, '').toLowerCase()) : null;
                    if (matchedStyleKey && duelingStylesDb[matchedStyleKey]) {
                        assignedStyle = matchedStyleKey;
                    } else {
                        const foundStyle = Object.values(duelingStylesDb).find(s => s.name !== "Nessuna" && s.nation && character.nation && s.nation.toLowerCase().includes(character.nation.toLowerCase())) || duelingStylesDb["Valroux"];
                        assignedStyle = foundStyle ? foundStyle.name : "Valroux";
                        resolvedAdvName = `Sala d’Armi (${assignedStyle})`;
                    }
                    if (assignedStyle && !character.duelingStyles.includes(assignedStyle)) {
                        character.duelingStyles.push(assignedStyle);
                    }
                    if (!character.duelingStyle || character.duelingStyle === "Nessuna") {
                        character.duelingStyle = assignedStyle;
                    }
                }

                // Se Studioso di Lotta (es. La Joven Promesa), inizializza la 3ª manovra base
                if (advName.toLowerCase().includes("studioso di lotta") && !character.studiosoManeuver) {
                    character.studiosoManeuver = "Finta";
                }

                const advObj = {
                    name: resolvedAdvName,
                    cost: 0,
                    fromBgSlot: idx,
                    fromBgName: bg.name,
                    duelStyle: assignedStyle || undefined,
                    desc: catalogAdv ? catalogAdv.description : `Vantaggio conferito dal Background ${bg.name}.`
                };
                character.advantages.push(advObj);

                // Auto-sblocco Stregoneria se conferito dal background (inclusa Sorte Non Addestrata)
                const lowAdv = advName.toLowerCase();
                if (lowAdv.includes("sorte non addestrata") || lowAdv.includes("tessere senza addestramento")) {
                    if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
                    character.sorceryMeta.sorteUntrained = true;
                    onSorceryChange("Sorte");
                } else if (lowAdv.includes("stregoneria") && (!character.sorcery || character.sorcery === "Nessuna")) {
                    const specSorc = advName.match(/\(([^)]+)\)/);
                    if (specSorc && specSorc[1]) {
                        onSorceryChange(resolveOfficialSorceryName(specSorc[1].trim(), character.nation));
                    } else {
                        const natSorc = (NATIONS_CONFIG[character.nation] && NATIONS_CONFIG[character.nation].sorcery) || "Nessuna";
                        if (natSorc !== "Nessuna") onSorceryChange(natSorc);
                    }
                }
            });

            if (summaryEl) {
                summaryEl.innerText = `+1 a: ${character.bgAppliedSkills[idx].join(', ')} • ${bg.advantages.join(', ')}`;
                summaryEl.title = `Peculiarità: ${bg.quirk}`;
            }
        } else {
            if (summaryEl) summaryEl.innerText = '';
        }

        const btnLabel = document.getElementById(`bg-custom-btn-label-${idx}`);
        if (btnLabel) {
            if (!val) {
                btnLabel.textContent = `-- Seleziona ${idx + 1}° Background --`;
                btnLabel.className = 'truncate text-gray-400';
            } else {
                const b = backgroundsDb.find(x => x.name.toLowerCase() === val.toLowerCase());
                btnLabel.textContent = `${b ? b.name : val} (${b ? (b.nation || 'Generale') : 'Generale'})`;
                btnLabel.className = 'truncate text-amber-200 font-medium';
            }
        }

        syncDropdownsWithCharacter();
        updateBgDisplays();
        renderSkills();
        renderAdvantages();
        renderDuelingStyle();
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
        const styleVal = (val && duelingStylesDb[val]) ? val : "Nessuna";
        character.duelingStyle = styleVal;
        if (!Array.isArray(character.duelingStyles)) character.duelingStyles = [];
        if (styleVal !== "Nessuna" && !character.duelingStyles.includes(styleVal)) {
            character.duelingStyles.push(styleVal);
        }
        const sel = document.getElementById('sel-style');
        if (sel) sel.value = styleVal;
        const styleBtnLabel = document.getElementById('style-custom-btn-label');
        if (styleBtnLabel) {
            if (styleVal === "Nessuna") {
                styleBtnLabel.textContent = "Nessuno Stile (Non Duellante)";
                styleBtnLabel.className = 'truncate text-gray-400';
            } else {
                const stObj = duelingStylesDb[styleVal];
                styleBtnLabel.textContent = `${styleVal} (${stObj ? (stObj.nation || 'Gilda') : 'Gilda'})`;
                styleBtnLabel.className = 'truncate text-amber-200 font-medium';
            }
        }
        renderDuelingStyle();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function onSorceryChange(val) {
        const canonical = resolveOfficialSorceryName(val, character ? character.nation : "");
        character.sorcery = canonical;
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        if (String(val || "").toLowerCase().includes("non addestrata")) {
            character.sorceryMeta.sorteUntrained = true;
        }
        if (canonical === "Nessuna") {
            character.sorceryItems = [];
        } else {
            if (!character.sorceryRank || character.sorceryRank < 1) character.sorceryRank = 1;
            character.sorceryItems = getDefaultSorceryItemsForTradition(canonical, character.sorceryMeta);
        }
        const sel = document.getElementById('sel-sorcery');
        if (sel) sel.value = canonical;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function onVirtueChange(val) {
        character.virtue = val || "";
        const arc = val ? arcanaDb.find(a => a.virtue === val) : null;
        const nameEl = document.getElementById('virtue-display-name');
        const descEl = document.getElementById('virtue-display-desc');
        if (nameEl) nameEl.innerText = val || "-- Seleziona --";
        if (descEl) descEl.innerText = arc ? (arc.virtueDesc || `Dall'Arcano ${arc.arcanum}.`) : "Nessuna Virtù selezionata.";
    }

    function onHubrisChange(val) {
        character.hubris = val || "";
        const arc = val ? arcanaDb.find(a => a.hubris === val) : null;
        const nameEl = document.getElementById('hubris-display-name');
        const descEl = document.getElementById('hubris-display-desc');
        if (nameEl) nameEl.innerText = val || "-- Seleziona --";
        if (descEl) descEl.innerText = arc ? (arc.hubrisDesc || `Dall'Arcano ${arc.arcanum}.`) : "Nessuna Superbia selezionata.";
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

    let customDiceModifier = 0;

    function updateCustomDiceModifierUI() {
        const valEl = document.getElementById('custom-dice-mod-val');
        const resetBtn = document.getElementById('btn-reset-dice-mod');
        if (valEl) {
            valEl.classList.remove('positive', 'negative');
            if (customDiceModifier > 0) {
                valEl.innerText = `+${customDiceModifier}`;
                valEl.classList.add('positive');
            } else if (customDiceModifier < 0) {
                valEl.innerText = `${customDiceModifier}`;
                valEl.classList.add('negative');
            } else {
                valEl.innerText = '0';
            }
        }
        if (resetBtn) {
            if (customDiceModifier !== 0) {
                resetBtn.classList.remove('hidden');
                resetBtn.style.display = 'inline-block';
            } else {
                resetBtn.classList.add('hidden');
                resetBtn.style.display = 'none';
            }
        }
    }

    function adjustCustomDiceModifier(delta) {
        customDiceModifier = Math.max(-10, Math.min(20, (customDiceModifier || 0) + delta));
        updateCustomDiceModifierUI();
        updatePoolFormula();
    }

    function resetCustomDiceModifier() {
        customDiceModifier = 0;
        updateCustomDiceModifierUI();
        updatePoolFormula();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function isGMClient() {
        if (typeof window === 'undefined') return false;
        if (window.isGMOverride !== undefined) return !!window.isGMOverride;
        if (window.location && window.location.pathname && window.location.pathname.toLowerCase().includes('player.html')) return false;
        if (typeof document !== 'undefined' && document.body && (document.body.classList.contains('player-page') || document.body.classList.contains('player-mode'))) return false;
        return true;
    }

    let activeHeroTarget = null; // { name: 'Luca', bonus: 3, prevModifier: 0 }

    function renderHeroEnemyBonusWidget() {
        const container = document.getElementById('s7-hero-gm-enemy-bonus-container');
        if (!container) return;

        // Solo GM (mai su player.html o player-mode)
        if (!isGMClient()) {
            container.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        container.style.display = 'block';

        if (!window.seventhSeaRules || typeof window.seventhSeaRules.getHeroesGrantingEnemyBonus !== 'function') {
            container.innerHTML = '';
            return;
        }

        const heroes = window.seventhSeaRules.getHeroesGrantingEnemyBonus(character);
        if (!heroes || heroes.length === 0) {
            container.innerHTML = `
                <div class="s7-enemy-bonus-card" style="margin-bottom:8px; padding:6px 9px;">
                    <div class="s7-eb-header">
                        <span class="s7-eb-title">⚔️ Dadi Bonus Nemici</span>
                        <span class="s7-eb-badge-gm">Solo GM</span>
                    </div>
                    <div style="font-size:10px; color:#9ca3af; font-style:italic;">
                        🛡️ Nessun Eroe sulla mappa ha raggiunto la 2ª Ferita Drammatica (+0 Dadi ai Nemici).
                    </div>
                </div>
            `;
            return;
        }

        const btnsHtml = heroes.map(h => {
            const isActive = activeHeroTarget && activeHeroTarget.name.toLowerCase() === h.name.toLowerCase();
            return `
                <button type="button" class="s7-eb-target-btn ${isActive ? 'active' : ''}" 
                    onclick="toggleHeroTarget('${escapeHtml(h.name)}', ${h.bonus})"
                    title="${h.breakdown || ''} - Clicca per applicare +${h.bonus} dadi contro ${escapeHtml(h.name)}">
                    🎯 ${escapeHtml(h.name)} <span class="s7-eb-bonus-pill">+${h.bonus}</span>
                    ${isActive ? ' ✔️' : ''}
                </button>
            `;
        }).join(' ');

        const activeBanner = activeHeroTarget ? `
            <div class="s7-eb-status-banner">
                <span>🎯 Bersaglio attivo: <b>${escapeHtml(activeHeroTarget.name)}</b> (+${activeHeroTarget.bonus} dadi applicati). Si azzera al termine del tiro.</span>
                <button type="button" class="s7-eb-cancel-btn" onclick="cancelHeroTarget()">Annulla</button>
            </div>
        ` : '';

        container.innerHTML = `
            <div class="s7-enemy-bonus-card" style="margin-bottom:8px;">
                <div class="s7-eb-header">
                    <span class="s7-eb-title">⚔️ Dadi Bonus Nemici (Bersaglio Eroe)</span>
                    <span class="s7-eb-badge-gm">Solo GM</span>
                </div>
                <div class="s7-eb-desc">
                    Applica i dadi bonus conferiti dalle Ferite Drammatiche dell'Eroe bersaglio. <b>Si azzereranno automaticamente al termine del tiro</b>:
                </div>
                <div class="s7-eb-targets-list">
                    ${btnsHtml}
                </div>
                ${activeBanner}
            </div>
        `;
    }

    function toggleHeroTarget(heroName, bonus) {
        if (activeHeroTarget && activeHeroTarget.name.toLowerCase() === heroName.toLowerCase()) {
            customDiceModifier = activeHeroTarget.prevModifier;
            activeHeroTarget = null;
        } else {
            const prevMod = activeHeroTarget ? activeHeroTarget.prevModifier : customDiceModifier;
            activeHeroTarget = {
                name: heroName,
                bonus: bonus,
                prevModifier: prevMod
            };
            customDiceModifier = prevMod + bonus;
        }
        updateCustomDiceModifierUI();
        updatePoolFormula();
        renderHeroEnemyBonusWidget();
    }

    function cancelHeroTarget() {
        if (activeHeroTarget) {
            customDiceModifier = activeHeroTarget.prevModifier;
        }
        activeHeroTarget = null;
        updateCustomDiceModifierUI();
        updatePoolFormula();
        renderHeroEnemyBonusWidget();
    }

    function updatePoolFormula() {
        const tVal = (character.traits && character.traits[selectedTrait]) || 2;
        const sVal = (character.skills && character.skills[selectedSkill]) || 0;
        const bonusDie = (character.dramaticWounds && character.dramaticWounds[0]) ? 1 : 0;
        const advBonus = getActiveAdvantageBonusDice();
        const mod = customDiceModifier || 0;
        const total = Math.max(0, tVal + sVal + bonusDie + advBonus + mod);
        const descEl = document.getElementById('pool-formula-desc');
        if (descEl) {
            let text = `${selectedTrait} (${tVal}) + ${selectedSkill} (${sVal})`;
            if (bonusDie > 0) text += ` + 1 FD`;
            if (advBonus > 0) text += ` + ${advBonus} Vant.`;
            if (mod > 0) text += ` <span class="text-emerald-400 font-bold">+${mod} Bonus</span>`;
            if (mod < 0) text += ` <span class="text-rose-400 font-bold">${mod} Malus</span>`;
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
        updateCustomDiceModifierUI();
        renderAdvantageToggles();
    }

    // RENDER SCUOLA DI SCHERMA E MANOVRE DI DUELLO (MANUALE BASE PAG. 234-239, NAZIONI VOL. 1 & VOL. 2)
    function hasCharacterAdvantage(advName) {
        if (!character || !Array.isArray(character.advantages)) return false;
        const target = advName.toLowerCase().trim().replace(/’/g, "'");
        return character.advantages.some(a => {
            if (!a || !a.name) return false;
            const n = a.name.toLowerCase().trim().replace(/’/g, "'");
            return n === target || n.startsWith(target + " (");
        });
    }

    function setDrexelGuard(guardName) {
        character.drexelGuard = guardName;
        renderDuelingStyle();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`Postura Drexel impostata su <b>Guardia ${guardName}</b>!`, "info");
    }

    function setStudiosoManeuverChoice(maneuverName) {
        character.studiosoManeuver = maneuverName;
        renderDuelingStyle();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`3ª Manovra Base di Studioso di Lotta impostata su <b>${maneuverName}</b>!`, "info");
    }

    function resetDuelManeuverLock() {
        character.lastManeuverUsed = "";
        renderDuelingStyle();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast("Nuovo Round / Azione intermedia: puoi nuovamente eseguire qualsiasi Manovra!", "info");
    }

    function switchActiveDuelingStyle(styleName, spendPE = false) {
        if (!styleName || !duelingStylesDb[styleName]) return;
        if (spendPE) {
            const curPE = parseInt(character.heroPoints) || 0;
            if (curPE < 1) {
                showS7Toast("Punti Eroe insufficienti per attivare Duellante Adattabile (serve 1 PE)!", "error");
                return;
            }
            changeHeroPoints(-1);
        }
        character.duelingStyle = styleName;
        const sel = document.getElementById('sel-style');
        if (sel) sel.value = styleName;
        syncDropdownsWithCharacter();
        renderDuelingStyle();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        if (spendPE) {
            showS7Toast(`⚡ <b>Duellante Adattabile</b> (-1 PE): Stile cambiato durante il Round in <b>${styleName}</b>!`, "success");
        } else {
            showS7Toast(`Stile di Duello attivo per il Round: <b>${styleName}</b>`, "info");
        }
    }

    function activateVeronicaInganno() {
        const curPE = parseInt(character.heroPoints) || 0;
        if (curPE < 1) {
            showS7Toast("Punti Eroe insufficienti! Serve 1 PE per sommare Grazia + Acume con l'Inganno di Veronica.", "error");
            return;
        }
        changeHeroPoints(-1);
        const witsVal = (character.traits && character.traits["Acume"]) || 2;
        selectedTrait = "Grazia";
        selectedSkill = "Mischia";
        customDiceModifier = (customDiceModifier || 0) + witsVal;
        updateCustomDiceModifierUI();
        renderTraits();
        renderSkills();
        updatePoolFormula();
        showS7Toast(`⚡ <b>Inganno di Veronica</b> (Ambrogia, -1 PE): Aggiunto Acume (+${witsVal} dadi) alla Riserva di Rischio con Grazia + Mischia!`, "success");
    }

    function computeManeuverEffectForHero(maneuverKey) {
        const activeStyle = character.duelingStyle || "Nessuna";
        const isKulachniy = activeStyle === "Kulachniy Boi";
        const meleeSkillName = isKulachniy ? "Rissa" : "Mischia";
        const meleeRank = (character.skills && character.skills[meleeSkillName]) || 0;
        const brawn = (character.traits && character.traits["Vigore"]) || 2;
        const finesse = (character.traits && character.traits["Grazia"]) || 2;
        const resolve = (character.traits && character.traits["Risolutezza"]) || 2;
        const wits = (character.traits && character.traits["Acume"]) || 2;
        const panache = (character.traits && character.traits["Panache"]) || 2;
        const athletics = (character.skills && character.skills["Atletica"]) || 0;
        const ride = (character.skills && character.skills["Cavalcare"]) || 0;

        // Modificatori Guardie Drexel (Manuale Base pagg. 237-238):
        // - Guardia Bittner (Frontale): Le Manovre che prevengono le Ferite bloccheranno un numero di Ferite aggiuntive pari alla Risolutezza del personaggio. Non sarà possibile eseguire Fendenti, si potrà infliggere danno come un non-Duellante.
        // - Guardia Metzger (Posteriore): Il personaggio esegue tutte le Azioni come se avesse un numero di Incrementi extra pari al suo Acume (usati solo per determinare quando agisce, non spendibili). Non potrà però eseguire Parate e dovrà prevenire i danni come un non-Duellante.
        // - Guardia Gerbeck (Alta): Le Manovre che infliggono Ferite causeranno 1 Ferita aggiuntiva, ma il personaggio agirà sempre come se avesse 1 Incremento in meno (minimo 1).
        const isDrexel = activeStyle === "Drexel";
        const guard = character.drexelGuard || "Bittner";
        const bittnerPrevMod = (isDrexel && guard === "Bittner") ? resolve : 0;
        const gerbeckDmgMod = (isDrexel && guard === "Gerbeck") ? 1 : 0;

        switch (maneuverKey) {
            case "Fendente": {
                if (isDrexel && guard === "Bittner") {
                    return {
                        name: "Fendente (Bloccato in Guardia Bittner)",
                        costRaises: 1,
                        costPE: 0,
                        costText: "1 Incremento (Non-Duellante)",
                        shortCalc: `Guardia Bittner attiva: Non è possibile eseguire Fendenti (infliggi 1 Ferita per Incremento come un non-Duellante)`,
                        description: basicManeuversDb[0].officialText,
                        isBlockedByGuard: true
                    };
                }
                const dmg = meleeRank + gerbeckDmgMod;
                return {
                    name: "Fendente",
                    costRaises: 1,
                    costPE: 0,
                    costText: "1 Incremento",
                    shortCalc: `Infligge ${dmg} Ferite (${meleeSkillName} ${meleeRank}${gerbeckDmgMod ? ' +1 Guardia Gerbeck' : ''})`,
                    description: basicManeuversDb[0].officialText
                };
            }
            case "Parata": {
                if (activeStyle === "Donovan") {
                    const prev = meleeRank;
                    return {
                        name: "Baluardo di Donovan (sostituisce Parata)",
                        costRaises: 1,
                        costPE: 0,
                        costText: "1 Incremento (Opz: +1 PE)",
                        shortCalc: `Previene ${prev} Ferite a te o a un alleato entro portata (${meleeSkillName} ${meleeRank}) • Opzionale (+1 PE): incastra l'arma ed entrambi perdete tutti gli Incrementi residui nel Round`,
                        description: duelingStylesDb["Donovan"].description,
                        isStyleReplacement: true
                    };
                }
                if (isDrexel && guard === "Metzger") {
                    return {
                        name: "Parata (Bloccata in Guardia Metzger)",
                        costRaises: 1,
                        costPE: 0,
                        costText: "1 Incremento (Non-Duellante)",
                        shortCalc: `Guardia Metzger attiva (+${wits} Incr. iniziativa): Non puoi eseguire Parate (previeni i danni come un non-Duellante)`,
                        description: basicManeuversDb[1].officialText,
                        isBlockedByGuard: true
                    };
                }
                const prev = meleeRank + bittnerPrevMod;
                return {
                    name: "Parata",
                    costRaises: 1,
                    costPE: 0,
                    costText: "1 Incremento (Reazione)",
                    shortCalc: `Previene ${prev} Ferite (${meleeSkillName} ${meleeRank}${bittnerPrevMod ? ` +${resolve} Risolutezza [Guardia Bittner]` : ''})`,
                    description: basicManeuversDb[1].officialText
                };
            }
            case "Finta": {
                const dmg = 1 + gerbeckDmgMod;
                return {
                    name: "Finta",
                    costRaises: 1,
                    costPE: 0,
                    costText: "1 Incremento",
                    shortCalc: `Infligge ${dmg} ${dmg === 1 ? 'Ferita' : 'Ferite'}${gerbeckDmgMod ? ' (1 +1 Guardia Gerbeck)' : ''} + se colpisci di nuovo nel Round infliggi +1 Ferita aggiuntiva`,
                    description: basicManeuversDb[2].officialText
                };
            }
            case "Affondo": {
                if (activeStyle === "Sabat") {
                    const avail = Math.max(1, currentRaises || 1);
                    const total = meleeRank + finesse + avail;
                    return {
                        name: "Gambetto Sabat (sostituisce Affondo)",
                        costRaises: "all",
                        costPE: 0,
                        costText: "Tutti gli Incrementi",
                        shortCalc: `Infligge ${meleeSkillName} (${meleeRank}) + Grazia (${finesse}) + Incrementi spesi (con ${avail} Incr. = ${total} Ferite)`,
                        description: duelingStylesDb["Sabat"].description,
                        isStyleReplacement: true
                    };
                }
                const avail = Math.max(1, currentRaises || 1);
                const dmg = meleeRank + avail + gerbeckDmgMod;
                return {
                    name: "Affondo",
                    costRaises: "all",
                    costPE: 0,
                    costText: "Tutti gli Incrementi",
                    shortCalc: `Infligge ${meleeSkillName} (${meleeRank}) + Incrementi spesi${gerbeckDmgMod ? ' +1 Guardia Gerbeck' : ''} Ferite INEVITABILI (con ${avail} Incr. = ${dmg} Ferite)`,
                    description: basicManeuversDb[3].officialText
                };
            }
            case "Botta": {
                const dmg = 1 + gerbeckDmgMod;
                const red = meleeRank;
                return {
                    name: "Botta",
                    costRaises: 1,
                    costPE: 0,
                    costText: "1 Incremento",
                    shortCalc: `Infligge ${dmg} ${dmg === 1 ? 'Ferita' : 'Ferite'}${gerbeckDmgMod ? ' (1 +1 Guardia Gerbeck)' : ''} e il prossimo colpo dell'avversario infligge -${red} Ferite (${meleeSkillName} ${meleeRank})`,
                    description: basicManeuversDb[4].officialText
                };
            }
            case "Risposta": {
                if (activeStyle === "Eisenfaust") {
                    const prev = resolve + meleeRank;
                    const dmg = brawn + meleeRank;
                    return {
                        name: "Risposta di Ferro (sostituisce Risposta)",
                        costRaises: 1,
                        costPE: 0,
                        costText: "1 Incremento (Max 1/Round)",
                        shortCalc: `Previene ${prev} Ferite (Risolutezza ${resolve} + ${meleeSkillName} ${meleeRank}) e infligge ${dmg} Ferite (Vigore ${brawn} + ${meleeSkillName} ${meleeRank})`,
                        description: duelingStylesDb["Eisenfaust"].description,
                        isStyleReplacement: true
                    };
                }
                const prev = meleeRank + bittnerPrevMod;
                const dmg = meleeRank + gerbeckDmgMod;
                return {
                    name: "Risposta",
                    costRaises: 1,
                    costPE: 0,
                    costText: "1 Incremento (Max 1/Round)",
                    shortCalc: `Previene ${prev} Ferite (${meleeSkillName} ${meleeRank}${bittnerPrevMod ? ` +${resolve} Risolutezza [Bittner]` : ''}) e infligge ${dmg} Ferite (${meleeSkillName} ${meleeRank}${gerbeckDmgMod ? ' +1 Gerbeck' : ''})`,
                    description: basicManeuversDb[5].officialText
                };
            }
            case "STYLE_MANEUVER": {
                const st = duelingStylesDb[activeStyle];
                if (!st || activeStyle === "Nessuna") return null;
                let calcText = st.cost;
                let cRaises = 1;
                let cPE = 0;
                if (activeStyle === "Aldana") {
                    calcText = `Aumenta di +${panache} Ferite (Panache) il prossimo attacco contro l'avversario (Max 1/Round)`;
                } else if (activeStyle === "Ambrogia") {
                    calcText = `Riserva Mischia con Grazia (${finesse}) o Acume (${wits}); spendendo 1 PE sommi Grazia + Acume (${finesse + wits} dadi + Mischia ${meleeRank})!`;
                    cRaises = 0;
                    cPE = 1;
                } else if (activeStyle === "Boucher") {
                    calcText = `Esegui 2 Manovre una dopo l'altra senza interruzioni spendendo gli Incrementi per entrambe (senza ripetere la stessa Manovra, Max 1/Round)`;
                    cRaises = 2;
                } else if (activeStyle === "Donovan") {
                    calcText = `Previene ${meleeRank} Ferite (Mischia) a te o a un alleato entro portata; spendendo +1 PE incastri l'arma ed entrambi perdete tutti gli Incrementi residui nel Round`;
                } else if (activeStyle === "Drexel") {
                    const gDesc = guard === "Bittner"
                        ? `Guardia Bittner (Frontale): Le Manovre che prevengono le Ferite bloccano +${resolve} Ferite (Risolutezza); non puoi eseguire Fendenti`
                        : (guard === "Metzger"
                            ? `Guardia Metzger (Posteriore): Agisci come se avessi +${wits} Incrementi extra (Acume, solo per l'ordine d'azione); non puoi eseguire Parate`
                            : "Guardia Gerbeck (Alta): Le Manovre che infliggono Ferite causano +1 Ferita aggiuntiva, ma agisci come se avessi 1 Incremento in meno (min 1)");
                    calcText = `Attiva: ${gDesc}`;
                } else if (activeStyle === "Eisenfaust") {
                    calcText = `Previene ${resolve + meleeRank} Ferite (Risolutezza ${resolve} + Mischia ${meleeRank}) e infligge ${brawn + meleeRank} Ferite (Vigore ${brawn} + Mischia ${meleeRank})`;
                } else if (activeStyle === "Leegstra") {
                    calcText = `Infligge ${meleeRank} Ferite (Mischia ${meleeRank}) (Max 1/Round — combinabile con Fendente senza violare la regola di ripetizione)`;
                } else if (activeStyle === "Mantovani") {
                    calcText = `Infligge 1 Ferita e scegli 1 Manovra (base o di Stile) che l'avversario non potrà eseguire in questo Round (Max 1/Round)`;
                } else if (activeStyle === "Mireli") {
                    calcText = `Funziona a tua scelta come Botta (1 Ferita e -${meleeRank} Ferite al prossimo attacco nemico) oppure come Parata (previene ${meleeRank} Ferite)`;
                } else if (activeStyle === "Sabat") {
                    const avail = Math.max(1, currentRaises || 1);
                    calcText = `Spende tutti gli Incrementi: infligge Mischia (${meleeRank}) + Grazia (${finesse}) + Incrementi spesi (${avail}) = ${meleeRank + finesse + avail} Ferite`;
                    cRaises = "all";
                } else if (activeStyle === "Torres") {
                    calcText = `Previene ${athletics} Ferite (Atletica ${athletics}) indossando una cappa (Max 1/Round)`;
                } else if (activeStyle === "Valroux") {
                    calcText = `Reazione subito dopo aver subito Ferite: previene ${meleeRank} Ferite (Mischia) e scegli la prossima Manovra dell'avversario (usarne una diversa gli costerà +1 Incremento extra, Max 1/Round)`;
                } else if (activeStyle === "Cleasa di Skatha") {
                    calcText = `Salta oltre la guardia: infligge ${athletics} Ferite (Atletica) INEVITABILI che non possono essere prevenute in alcun modo (Max 1/Round)`;
                } else if (activeStyle === "Siqueira") {
                    calcText = `Mette Pressione (2 Incr. per azioni non d'attacco); se l'avversario attacca, subisce ${finesse} Ferite (Grazia) (Max 1/Round)`;
                } else if (activeStyle === "De Vore") {
                    calcText = `Spende tutti gli Incrementi: previene TUTTE le Ferite inflitte al bersaglio scelto da altri personaggi nel Round (anche da Affondo o pistola, Max 1/Round)`;
                    cRaises = "all";
                } else if (activeStyle === "Hallbjorn") {
                    calcText = `Infligge ${brawn} Ferite (Vigore) + se l'avversario subisce altre Ferite entro fine Round, subisce +${brawn} Ferite aggiuntive (Max 1/Round)`;
                } else if (activeStyle === "Kummerholt") {
                    const avail = Math.max(1, currentRaises || 1);
                    calcText = `Spende tutti gli Incrementi (Max 1/Scena): infligge Mischia (${meleeRank}) + Incr. (${avail}) + Forza Avversario = ${meleeRank + avail}+ Ferite INEVITABILI`;
                    cRaises = "all";
                } else if (activeStyle === "Szybowanie") {
                    calcText = `Da posizione sopraelevata (1 Incr. + 1 PE): infligge ${meleeRank + ride} Ferite (Mischia ${meleeRank} + Cavalcare ${ride}) (Max 1/Round)`;
                    cRaises = 1;
                    cPE = 1;
                } else if (activeStyle === "Kulachniy Boi") {
                    calcText = `Passivo: usa Rissa (${meleeRank}) invece di Mischia per tutte le Manovre + 1 Incremento gratuito per nascondere i rukavitsa`;
                    cRaises = 0;
                } else if (activeStyle === "Le Strade") {
                    calcText = `Previene ${athletics} Ferite (Atletica) + Conseguenza ambientale per l'avversario (${finesse} Ferite di Grazia a fine Round se non spende 1 Incr., Max 1/Round)`;
                }
                return {
                    name: st.maneuver,
                    costRaises: cRaises,
                    costPE: cPE,
                    costText: st.cost,
                    shortCalc: calcText,
                    description: st.description,
                    styleName: st.name
                };
            }
            default:
                return null;
        }
    }

    function executeDuelManeuver(maneuverKey) {
        const activeStyle = character.duelingStyle || "Nessuna";

        const info = computeManeuverEffectForHero(maneuverKey);
        if (!info) return;

        if (info.isBlockedByGuard) {
            showS7Toast(`🛡️ <b>Guardia Drexel (${character.drexelGuard || 'Bittner'}):</b> ${info.shortCalc}`, "warning");
            return;
        }

        // Regola ufficiale pag. 235: Non si può mai eseguire la stessa Manovra per due volte di seguito
        if (character.lastManeuverUsed && character.lastManeuverUsed === info.name && info.costRaises !== 0) {
            showS7Toast(`⚠️ <b>Regola del Duello (pag. 235):</b> Non puoi eseguire <b>${info.name}</b> per due volte di seguito! Esegui prima un'altra Manovra (o clicca "Reset / Nuovo Round").`, "warning");
            return;
        }

        // Controllo spesa Punti Eroe (es. Svolazzo del Matador di Torres o Picchiata dell'Aquila di Szybowanie)
        if (info.costPE && info.costPE > 0) {
            const curPE = parseInt(character.heroPoints) || 0;
            if (curPE < info.costPE) {
                showS7Toast(`Punti Eroe insufficienti per eseguire <b>${info.name}</b> (serve ${info.costPE} PE)!`, "error");
                return;
            }
            changeHeroPoints(-info.costPE);
        }

        // Gestione consumo Incrementi se c'è un lancio attivo
        let spentRaisesText = info.costText;
        if (currentRaises > 0) {
            if (info.costRaises === "all") {
                spentRaisesText = `${currentRaises} Incrementi spesi`;
                currentRaises = 0;
                const el = document.getElementById('total-raises-num');
                if (el) el.innerText = "0";
            } else if (typeof info.costRaises === "number" && info.costRaises > 0) {
                currentRaises = Math.max(0, currentRaises - info.costRaises);
                const el = document.getElementById('total-raises-num');
                if (el) el.innerText = currentRaises;
            }
        }

        if (info.costRaises !== 0) {
            character.lastManeuverUsed = info.name;
        }

        // Effetto speciale Colpo a Segno (Vol. 2 pag. 205) e Lama Fulminea (Vol. 2 pag. 206)
        renderDuelingStyle();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();

        if (window.seventhSeaRules && typeof window.seventhSeaRules.broadcastDuelManeuverToVttChat === "function") {
            window.seventhSeaRules.broadcastDuelManeuverToVttChat(character.name || "Eroe", {
                name: info.name,
                styleName: activeStyle,
                costText: spentRaisesText,
                calculatedEffect: info.shortCalc,
                description: info.description
            });
        }

        showS7Toast(`⚔️ Manovra eseguita: <b>${info.name}</b> — ${info.shortCalc}`, "success");
    }

    function renderDuelingStyle() {
        normalizeCharacterDuelingState(character);
        const styleName = character.duelingStyle || "Nessuna";
        const style = duelingStylesDb[styleName] || duelingStylesDb["Nessuna"];
        const titleEl = document.getElementById('dueling-style-title');
        const weaponsEl = document.getElementById('dueling-weapons-desc');
        const costEl = document.getElementById('dueling-cost-badge');
        const detailsEl = document.getElementById('dueling-details-content');

        const hasSalaDArmi = (styleName !== "Nessuna") || hasCharacterAdvantage("Sala d’Armi") || hasCharacterAdvantage("Sala d'Armi");
        const hasStudioso = hasCharacterAdvantage("Studioso di Lotta");
        const hasAdattabile = hasCharacterAdvantage("Duellante Adattabile");
        const hasColpoASegno = hasCharacterAdvantage("Colpo a Segno");
        const hasLamaFulminea = hasCharacterAdvantage("Lama Fulminea");

        if (titleEl) {
            if (styleName !== "Nessuna") {
                titleEl.innerText = `Stile di Duello: ${style.name} (${style.nation || 'Gilda'})`;
            } else if (hasStudioso) {
                titleEl.innerText = `Duello: Studioso di Lotta (3 Manovre Base)`;
            } else {
                titleEl.innerText = `Scuola di Scherma: Nessuna`;
            }
        }
        if (weaponsEl) {
            if (styleName !== "Nessuna") {
                weaponsEl.innerHTML = `<b>Armi:</b> ${style.weapons || 'Nessuna'} &bull; <b>Fonte:</b> ${style.source || 'Manuale Base'}`;
            } else {
                weaponsEl.innerHTML = `<b>Armi:</b> Ordinarie &bull; Acquisisci <b>Sala d’Armi (5 pt)</b> o <b>Studioso di Lotta (3 pt)</b> per usare le Manovre di Duello`;
            }
        }
        if (costEl) {
            costEl.innerText = styleName !== "Nessuna" ? (style.maneuver || '5 Punti') : (hasStudioso ? 'Studioso (3 pt)' : 'Non Duellante');
        }

        if (!detailsEl) return;

        // Caso 1: Né Duellante né Studioso di Lotta
        if (styleName === "Nessuna" && !hasStudioso) {
            detailsEl.innerHTML = `
                <div class="bg-[#12141a] p-3.5 rounded-xl border border-[#252a35] space-y-2">
                    <p class="text-gray-300 text-xs leading-relaxed">
                        Il personaggio non possiede il Vantaggio <b>Sala d’Armi</b> né <b>Studioso di Lotta</b>. Secondo il <b>Manuale Base (pag. 234)</b>, solo i personaggi con <i>Sala d’Armi</i> (o <i>Studioso di Lotta</i> per 3 Manovre Base) possono eseguire le Manovre di Duello spendendo Incrementi.
                    </p>
                    ${!isLocked ? '<p class="text-amber-400 text-xs font-medium">💡 Sblocca la scheda e seleziona uno dei <b>20 Stili di Duello Ufficiali</b> nel menu in alto (oppure aggiungi <i>Sala d’Armi</i> / <i>Studioso di Lotta</i> tra i Vantaggi) per attivare la plancia interattiva del Duello.</p>' : ''}
                </div>
            `;
            return;
        }

        // Caso 2: Duellante con Stile di Duello (oppure Studioso di Lotta)
        const knownStyles = Array.isArray(character.duelingStyles) ? character.duelingStyles : [];
        let multiStyleBarHtml = '';
        if (knownStyles.length > 1) {
            const styleBtns = knownStyles.map(st => {
                const isAct = st === styleName;
                const safeSt = st.replace(/'/g, "\\'");
                return `
                    <button type="button" onclick="switchActiveDuelingStyle('${safeSt}', false)"
                        class="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${isAct ? 'bg-amber-500 text-black border-amber-400 shadow' : 'bg-[#171b26] text-gray-300 border-[#2e364a] hover:border-amber-500/50'}">
                        🤺 ${st} ${isAct ? '✓' : ''}
                    </button>
                `;
            }).join('');

            const adaptableBtns = hasAdattabile ? knownStyles.filter(st => st !== styleName).map(st => {
                const safeSt = st.replace(/'/g, "\\'");
                return `
                    <button type="button" onclick="switchActiveDuelingStyle('${safeSt}', true)"
                        class="px-2 py-0.5 rounded bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/50 text-[11px] font-bold transition-all"
                        title="Vantaggio Duellante Adattabile (Nazioni Vol. 1 pag. 205): Spendi 1 PE per cambiare Stile durante il Round">
                        ⚡ Cambia in ${st} (-1 PE)
                    </button>
                `;
            }).join(' ') : '';

            multiStyleBarHtml = `
                <div class="bg-[#111520] p-2.5 rounded-xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-[11px] font-bold text-amber-300 uppercase mr-1">Stili Conosciuti (${knownStyles.length}):</span>
                        ${styleBtns}
                    </div>
                    ${adaptableBtns ? `<div class="flex flex-wrap items-center gap-1.5">${adaptableBtns}</div>` : '<span class="text-[10px] text-gray-400 italic">Scegli lo Stile attivo all\'inizio del Round (pag. 234)</span>'}
                </div>
            `;
        }

        // Selettore Guardie Drexel se lo stile attivo è Drexel
        let specialStyleControlsHtml = '';
        if (styleName === "Drexel") {
            const curG = character.drexelGuard || "Bittner";
            const rVal = (character.traits && character.traits["Risolutezza"]) || 2;
            const wVal = (character.traits && character.traits["Acume"]) || 2;
            specialStyleControlsHtml = `
                <div class="bg-[#141824] p-2.5 rounded-xl border border-amber-500/40 space-y-1.5">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-amber-300">🛡️ Guardie Drexel (Scegli la tua Postura a inizio Round — 1 Incr. per cambiarla):</span>
                        <span class="text-[10px] text-gray-400">Manuale Base pagg. 237-238</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <button type="button" onclick="setDrexelGuard('Bittner')" class="p-2 rounded-lg border text-left transition-all ${curG === 'Bittner' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-[#0e1017] border-[#262c3d] text-gray-300 hover:border-amber-500/40'}">
                            <div class="font-bold text-xs">🛡️ Guardia Bittner (Frontale) ${curG === 'Bittner' ? '✓' : ''}</div>
                            <div class="text-[10px] text-gray-400 mt-0.5">Le Manovre che prevengono Ferite bloccano +${rVal} Ferite (Risolutezza). Non puoi eseguire Fendenti (infliggi danno come non-Duellante).</div>
                        </button>
                        <button type="button" onclick="setDrexelGuard('Metzger')" class="p-2 rounded-lg border text-left transition-all ${curG === 'Metzger' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-[#0e1017] border-[#262c3d] text-gray-300 hover:border-amber-500/40'}">
                            <div class="font-bold text-xs">⚡ Guardia Metzger (Posteriore) ${curG === 'Metzger' ? '✓' : ''}</div>
                            <div class="text-[10px] text-gray-400 mt-0.5">Agisci come se avessi +${wVal} Incrementi extra (Acume, solo per l'ordine d'azione). Non puoi eseguire Parate.</div>
                        </button>
                        <button type="button" onclick="setDrexelGuard('Gerbeck')" class="p-2 rounded-lg border text-left transition-all ${curG === 'Gerbeck' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-[#0e1017] border-[#262c3d] text-gray-300 hover:border-amber-500/40'}">
                            <div class="font-bold text-xs">⚔️ Guardia Gerbeck (Alta) ${curG === 'Gerbeck' ? '✓' : ''}</div>
                            <div class="text-[10px] text-gray-400 mt-0.5">Le Manovre che infliggono Ferite causano +1 Ferita aggiuntiva, ma agisci sempre come se avessi 1 Incremento in meno (min 1).</div>
                        </button>
                    </div>
                </div>
            `;
        } else if (styleName === "Ambrogia") {
            const fVal = (character.traits && character.traits["Grazia"]) || 2;
            const wVal = (character.traits && character.traits["Acume"]) || 2;
            const mVal = (character.skills && character.skills["Mischia"]) || 0;
            specialStyleControlsHtml = `
                <div class="bg-[#141824] p-2.5 rounded-xl border border-amber-500/40 flex flex-wrap items-center justify-between gap-2">
                    <div class="text-xs text-gray-200">
                        <b class="text-amber-300">🗡️ Inganno di Veronica (Ambrogia):</b> Puoi tirare Mischia usando Grazia (${fVal}) o Acume (${wVal}), oppure spendere 1 PE per sommare entrambi (<b>${fVal + wVal + mVal}d10</b>)!
                    </div>
                    <button type="button" onclick="activateVeronicaInganno()" class="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs rounded-lg shadow">
                        ⚡ Spendi 1 PE: Grazia + Acume (+${wVal}d10)
                    </button>
                </div>
            `;
        } else if (styleName === "Kulachniy Boi") {
            const bVal = (character.skills && character.skills["Rissa"]) || 0;
            specialStyleControlsHtml = `
                <div class="bg-[#141824] p-2.5 rounded-xl border border-emerald-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span class="text-emerald-300 font-bold">🥊 Ferro e Velluto (Kulachniy Boi attivo): Tutte le Manovre usano automaticamente il tuo Grado di <u>Rissa (${bVal})</u> al posto di Mischia!</span>
                    <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-200 border border-emerald-700 text-[10px] font-bold">+1 Incr. gratuito per celare i rukavitsa</span>
                </div>
            `;
        }

        // Controllo se solo Studioso di Lotta (senza Sala d'Armi)
        let studiosoBannerHtml = '';
        if (!hasSalaDArmi && hasStudioso) {
            const cur3rd = character.studiosoManeuver || "Finta";
            studiosoBannerHtml = `
                <div class="bg-[#141824] p-2.5 rounded-xl border border-blue-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                        <b class="text-blue-300">📚 Studioso di Lotta (Nazioni Vol. 1 pag. 206):</b> Puoi eseguire <b>Fendente</b>, <b>Parata</b> e una 3ª Manovra Base a tua scelta. Inoltre il Vantaggio <i>Sala d’Armi</i> ti costa <b>3 pt</b> invece di 5!
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="text-[11px] text-gray-300 font-semibold">3ª Manovra:</span>
                        <select onchange="setStudiosoManeuverChoice(this.value)" class="bg-[#0d0e12] border border-blue-500/50 rounded px-2 py-1 text-xs text-blue-200 outline-none">
                            <option value="Finta" ${cur3rd === 'Finta' ? 'selected' : ''}>Finta</option>
                            <option value="Affondo" ${cur3rd === 'Affondo' ? 'selected' : ''}>Affondo</option>
                            <option value="Botta" ${cur3rd === 'Botta' ? 'selected' : ''}>Botta</option>
                            <option value="Risposta" ${cur3rd === 'Risposta' ? 'selected' : ''}>Risposta</option>
                        </select>
                    </div>
                </div>
            `;
        }

        // Card Stile Attivo (Lore + Bonus di Stile)
        let styleCardHtml = '';
        if (styleName !== "Nessuna") {
            const stMan = computeManeuverEffectForHero("STYLE_MANEUVER");
            const isLast = character.lastManeuverUsed && stMan && character.lastManeuverUsed === stMan.name;
            styleCardHtml = `
                <div class="bg-gradient-to-br from-[#191d2b] to-[#12151f] p-3 rounded-xl border border-amber-500/50 shadow-md space-y-2">
                    <div class="flex flex-wrap items-start justify-between gap-2 border-b border-[#262c3d] pb-2">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-amber-400 font-black text-xs uppercase tracking-wider">🌟 Bonus di Stile (${style.name}):</span>
                                <span class="text-amber-200 font-bold text-xs md:text-sm">${style.maneuver}</span>
                            </div>
                            <p class="text-[11px] text-gray-400 italic mt-0.5">${style.lore || ''}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-700 text-[11px] font-bold">${style.cost}</span>
                            <button type="button" onclick="executeDuelManeuver('STYLE_MANEUVER')"
                                class="px-3 py-1 rounded-lg font-black text-xs shadow transition transform active:scale-95 ${isLast ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-black'}">
                                ${isLast ? '⏳ Appena Usata' : '⚔️ Esegui Bonus Stile'}
                            </button>
                        </div>
                    </div>
                    ${stMan ? `<div class="text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-700/40 px-2.5 py-1 rounded-lg">📊 Calcolo Attuale: ${stMan.shortCalc}</div>` : ''}
                    <p class="text-gray-300 text-xs leading-relaxed">${style.description}</p>
                </div>
            `;
        }

        // Griglia interattiva delle 6 Manovre Base Ufficiali (Manuale Base pag. 235)
        const baseKeys = ["Fendente", "Parata", "Finta", "Affondo", "Botta", "Risposta"];
        const studiosoAllowed = ["Fendente", "Parata", character.studiosoManeuver || "Finta"];

        const maneuversGridHtml = baseKeys.map(mKey => {
            const mInfo = computeManeuverEffectForHero(mKey);
            if (!mInfo) return '';
            const isAllowed = hasSalaDArmi || (hasStudioso && studiosoAllowed.includes(mKey));
            const isLast = character.lastManeuverUsed && character.lastManeuverUsed === mInfo.name;
            const isBlocked = !!mInfo.isBlockedByGuard;
            const borderClass = isBlocked
                ? 'border-rose-600/60 bg-[#1a1216]'
                : (mInfo.isStyleReplacement
                    ? 'border-amber-500/70 bg-[#171a26]'
                    : (isLast ? 'border-rose-500/50 bg-[#16131a]' : 'border-[#272d3d] bg-[#12151e]'));

            return `
                <div class="p-2.5 rounded-xl border ${borderClass} flex flex-col justify-between space-y-1.5 transition-all ${!isAllowed ? 'opacity-50' : ''}">
                    <div class="space-y-1">
                        <div class="flex items-center justify-between gap-1 border-b border-[#222736] pb-1">
                            <b class="text-xs ${isBlocked ? 'text-rose-300' : (mInfo.isStyleReplacement ? 'text-amber-300' : 'text-gray-100')}">${mInfo.name}</b>
                            <span class="text-[10px] px-1.5 py-0.2 rounded bg-[#1c2230] text-amber-300 border border-[#323b52] font-semibold whitespace-nowrap">${mInfo.costText}</span>
                        </div>
                        <div class="text-[11px] font-bold ${isBlocked ? 'text-rose-400' : 'text-emerald-400'} leading-snug">${mInfo.shortCalc}</div>
                        <p class="text-[10.5px] text-gray-400 leading-tight">${mInfo.description}</p>
                    </div>
                    <div class="pt-1 flex items-center justify-between gap-1">
                        ${isAllowed ? `
                            <button type="button" onclick="executeDuelManeuver('${mKey}')"
                                class="w-full py-1 px-2 rounded-lg font-bold text-xs transition transform active:scale-95 ${(isLast || isBlocked) ? 'bg-rose-950/60 text-rose-300 border border-rose-700/50 cursor-not-allowed' : 'bg-[#202738] hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/40'}">
                                ${isBlocked ? '🚫 Bloccata dalla Guardia' : (isLast ? '🚫 Ultima Eseguita (Non Ripetibile)' : `⚔️ Usa ${mInfo.name.split(' (')[0]}`)}
                            </button>
                        ` : `
                            <span class="text-[10px] text-gray-500 italic">Richiede Sala d’Armi</span>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        // Badge Vantaggi da Duellante extra (Colpo a Segno, Lama Fulminea, Duellante Adattabile)
        const extraDuelAdvBadges = [];
        if (hasColpoASegno) extraDuelAdvBadges.push(`<span class="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60 text-[10px] font-bold" title="Nazioni Vol. 2 pag. 205: Quando una tua Manovra costringe l'avversario a rinunciare a Incrementi (o gliene aumenta il costo), subisce anche 1 Ferita per ogni Incremento perso/speso in più">🩸 Colpo a Segno attivo (+1 Ferita per Incr. perso dal nemico)</span>`);
        if (hasLamaFulminea) extraDuelAdvBadges.push(`<span class="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-700/60 text-[10px] font-bold" title="Nazioni Vol. 2 pag. 206: Spendi 1 PE durante un Rischio di Mischia per causare un eguale numero di Ferite anche a un altro bersaglio sulla Scena (1/Round)">⚡ Lama Fulminea attiva (1 PE = stesse Ferite a 2° bersaglio)</span>`);
        if (hasAdattabile) extraDuelAdvBadges.push(`<span class="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-700/60 text-[10px] font-bold">🔄 Duellante Adattabile attivo</span>`);

        const lastManBanner = character.lastManeuverUsed ? `
            <div class="flex flex-wrap items-center justify-between gap-2 bg-[#1a1520] border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs">
                <span class="text-rose-200">⚠️ <b>Ultima Manovra eseguita:</b> <b class="text-amber-300">${character.lastManeuverUsed}</b> — <i>Non puoi eseguire la stessa Manovra due volte di seguito (Manuale Base pag. 235).</i></span>
                <button type="button" onclick="resetDuelManeuverLock()" class="px-2.5 py-0.5 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-[11px] font-bold border border-rose-600/50">
                    🔄 Nuovo Round / Reset
                </button>
            </div>
        ` : '';

        detailsEl.innerHTML = `
            <div class="space-y-3">
                ${multiStyleBarHtml}
                ${studiosoBannerHtml}
                ${specialStyleControlsHtml}
                ${styleCardHtml}
                ${lastManBanner}
                <div class="space-y-1.5">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-xs font-bold uppercase tracking-wider text-amber-400">⚔️ Le 6 Manovre Base del Duello (Manuale Base pag. 235):</span>
                        <div class="flex flex-wrap items-center gap-1.5">${extraDuelAdvBadges.join(' ')}</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        ${maneuversGridHtml}
                    </div>
                </div>
            </div>
        `;
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

    // ANTEPRIMA LIVE & GESTIONE VANTAGGI
    function populateAdvDuelStylePicker() {
        const sel = document.getElementById('sel-adv-duel-style');
        if (!sel) return;
        sel.innerHTML = '';
        const known = Array.isArray(character.duelingStyles) ? character.duelingStyles : [];
        Object.values(duelingStylesDb).forEach(st => {
            if (st.name === "Nessuna") return;
            const opt = document.createElement('option');
            opt.value = st.name;
            const isKnown = known.includes(st.name);
            opt.innerText = `${st.name} (${st.nation || 'Gilda'})${isKnown ? ' [Già appreso]' : ''}`;
            sel.appendChild(opt);
        });
        // Preseleziona il primo non ancora appreso
        const firstUnlearned = Object.values(duelingStylesDb).find(st => st.name !== "Nessuna" && !known.includes(st.name));
        if (firstUnlearned) sel.value = firstUnlearned.name;
    }

    function onNewAdvSelectChange(advName) {
        const duelWrap = document.getElementById('adv-duel-style-picker-wrap');
        const studiosoWrap = document.getElementById('adv-studioso-maneuver-picker-wrap');
        const isSala = advName && /sala d[’']armi/i.test(advName);
        const isStudioso = advName && advName.toLowerCase() === 'studioso di lotta';

        if (duelWrap) {
            if (isSala) {
                duelWrap.classList.remove('hidden');
                populateAdvDuelStylePicker();
            } else {
                duelWrap.classList.add('hidden');
            }
        }
        if (studiosoWrap) {
            if (isStudioso) {
                studiosoWrap.classList.remove('hidden');
            } else {
                studiosoWrap.classList.add('hidden');
            }
        }
        updateAdvantagePreview(advName);
    }

    function updateAdvantagePreview(advName) {
        const titleEl = document.getElementById('adv-preview-title');
        const iconEl = document.getElementById('adv-preview-icon');
        const badgesEl = document.getElementById('adv-preview-badges');
        const descEl = document.getElementById('adv-preview-desc');
        const noteEl = document.getElementById('adv-preview-rule-note');

        if (!titleEl) return;

        if (!advName) {
            titleEl.innerText = "Nessun Vantaggio Selezionato";
            if (iconEl) iconEl.innerText = "⭐";
            if (badgesEl) badgesEl.innerHTML = '<span class="text-[11px] text-gray-500 italic">Scegli un vantaggio dal menu sopra</span>';
            if (descEl) descEl.innerText = "Scegli un vantaggio dal menu a tendina sopra per visualizzarne la descrizione, l'effetto e verificare se è Innato o acquisibile tramite Storie.";
            if (noteEl) noteEl.innerHTML = "💡 <b>Regola Ufficiale (pag. 160):</b> I vantaggi standard richiedono un numero di Atti pari al loro costo in punti. I vantaggi Innati (🧬) possono essere scelti solo alla creazione dell'Eroe.";
            return;
        }

        const adv = advantagesDb.find(a => a.name.toLowerCase() === advName.toLowerCase());
        if (!adv) return;

        const isSala = /sala d[’']armi/i.test(adv.name);
        const hasStudiosoDiscount = isSala && hasCharacterAdvantage("Studioso di Lotta");
        const effectiveCost = hasStudiosoDiscount ? 3 : adv.cost;

        titleEl.innerText = adv.name;
        if (iconEl) iconEl.innerText = adv.innate ? "🧬" : "⭐";

        let badgesHtml = `<span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">Costo: ${effectiveCost} pt${hasStudiosoDiscount ? ' (Sconto Studioso di Lotta da 5 a 3 pt!)' : ''}</span>`;

        if (adv.innate) {
            badgesHtml += ` <span class="px-2 py-0.5 rounded text-xs font-bold bg-purple-950 text-purple-300 border border-purple-700">🧬 Vantaggio Innato</span>`;
        } else {
            badgesHtml += ` <span class="px-2 py-0.5 rounded text-xs font-bold bg-blue-950 text-blue-300 border border-blue-700">📖 Acquisibile in Gioco (Storia: ${effectiveCost} ${effectiveCost === 1 ? 'Atto' : 'Atti'})</span>`;
        }

        if (adv.description && adv.description.toLowerCase().includes('spendi 1 pe')) {
            badgesHtml += ` <span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-900/60 text-amber-200 border border-amber-700/60">⚡ Talento (1 PE)</span>`;
        }

        if (badgesEl) badgesEl.innerHTML = badgesHtml;
        if (descEl) descEl.innerText = adv.description;

        if (noteEl) {
            if (adv.innate) {
                const warnLocked = isLocked ? '<br><b class="text-rose-400">⚠️ Attenzione: la scheda è in Modalità Gioco. I Vantaggi Innati non possono essere acquisiti tramite normali Storie in corso di campagna (salvo speciale accordo narrativo col GM).</b>' : '';
                noteEl.innerHTML = `🧬 <b>Vantaggio Innato (Manuale Base pag. 148):</b> Rappresenta una dote fisica congenita, un retaggio o un'educazione giovanile. <b>Selezionabile solo durante la creazione dell'Eroe.</b>${warnLocked}`;
            } else {
                noteEl.innerHTML = `📖 <b>Avanzamento in Campagna (Manuale Base pag. 160):</b> Puoi acquisire questo vantaggio completando una <b>Storia da ${effectiveCost} ${effectiveCost === 1 ? 'Atto' : 'Atti'}</b> durante la campagna, oppure spendendo ${effectiveCost} punti durante la creazione iniziale.`;
            }
        }
    }

    // GESTIONE AGGIUNTA VANTAGGIO (CATALOGO O CUSTOM)
    function toggleAddAdvantagePanel() {
        const p = document.getElementById('add-advantage-panel');
        if (p) {
            p.classList.toggle('hidden');
            if (!p.classList.contains('hidden')) {
                const sel = document.getElementById('sel-new-adv');
                onNewAdvSelectChange(sel ? sel.value : "");
            }
        }
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
            const isSala = /sala d[’']armi/i.test(found.name);
            const isStudioso = found.name.toLowerCase() === 'studioso di lotta';
            const isStregoneriaAdv = found.name.toLowerCase().includes('stregoneria');

            if (isSala) {
                const stylePicker = document.getElementById('sel-adv-duel-style');
                const chosenStyle = (stylePicker && stylePicker.value) ? stylePicker.value : "Valroux";
                if (!Array.isArray(character.duelingStyles)) character.duelingStyles = [];
                if (character.duelingStyles.includes(chosenStyle)) {
                    showS7Toast(`L'Eroe padroneggia già lo stile <b>${chosenStyle}</b>! Seleziona uno Stile differente.`, "error");
                    return;
                }
                const hasStudiosoDiscount = hasCharacterAdvantage("Studioso di Lotta");
                const finalCost = hasStudiosoDiscount ? 3 : found.cost;
                const stObj = duelingStylesDb[chosenStyle];
                character.duelingStyles.push(chosenStyle);
                character.duelingStyle = chosenStyle;
                character.advantages.push({
                    name: `Sala d’Armi (${chosenStyle})`,
                    cost: finalCost,
                    duelStyle: chosenStyle,
                    desc: `${found.description} — Stile appreso: ${chosenStyle} (${stObj ? stObj.maneuver : ''}).`
                });
                syncDropdownsWithCharacter();
                renderDuelingStyle();
                renderAdvantages();
                updatePoolFormula();
                if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
                toggleAddAdvantagePanel();
                showS7Toast(`Vantaggio <b>Sala d’Armi (${chosenStyle})</b> aggiunto (${finalCost} pt)!`, "success");
                return;
            }

            if (isStregoneriaAdv) {
                const curSorcCount = (character.advantages || []).filter(a => a && a.name && a.name.toLowerCase().includes('stregoneria')).length;
                const nextRank = curSorcCount + 1;
                character.sorceryRank = Math.max(character.sorceryRank || 1, nextRank);
                if (!character.sorcery || character.sorcery === "Nessuna") {
                    const natSorc = (NATIONS_CONFIG[character.nation] && NATIONS_CONFIG[character.nation].sorcery) || "Hexenwerk";
                    onSorceryChange(natSorc !== "Nessuna" ? natSorc : "Hexenwerk");
                }
                character.advantages.push({
                    name: nextRank > 1 ? `${found.name} (${nextRank}° Grado)` : found.name,
                    cost: found.cost,
                    desc: `${found.description} (Grado Stregoneria: ${character.sorceryRank}).`
                });
                syncDropdownsWithCharacter();
                renderAdvantages();
                renderSorcery();
                updatePoolFormula();
                if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
                toggleAddAdvantagePanel();
                showS7Toast(`Vantaggio <b>${found.name}</b> acquisito (Grado Stregoneria: ${character.sorceryRank})!`, "success");
                return;
            }

            if (character.advantages.some(a => a.name.toLowerCase() === found.name.toLowerCase())) {
                showS7Toast("L'Eroe possiede già questo Vantaggio!", "error");
                return;
            }

            let descToSave = found.description;
            if (isStudioso) {
                const manPicker = document.getElementById('sel-adv-studioso-maneuver');
                const chosenMan = (manPicker && manPicker.value) ? manPicker.value : "Finta";
                character.studiosoManeuver = chosenMan;
                descToSave = `${found.description} (3ª Manovra scelta: ${chosenMan}).`;
            }

            character.advantages.push({
                name: found.name,
                cost: found.cost,
                desc: descToSave
            });
            renderAdvantages();
            renderDuelingStyle();
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
        renderDuelingStyle();
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
        if (removed && removed[0]) {
            const remAdv = removed[0];
            const styleMatch = remAdv.duelStyle || (remAdv.name && remAdv.name.match(/sala d[’']armi\s*\(([^)]+)\)/i)?.[1]);
            if (styleMatch && Array.isArray(character.duelingStyles)) {
                character.duelingStyles = character.duelingStyles.filter(s => s !== styleMatch);
                if (character.duelingStyle === styleMatch) {
                    character.duelingStyle = character.duelingStyles[0] || "Nessuna";
                }
            }
        }
        syncDropdownsWithCharacter();
        renderAdvantages();
        renderDuelingStyle();
        renderDramaticWoundsGrid();
        updateDramaticWoundsUI();
        updatePoolFormula();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        if (removed && removed[0]) showS7Toast(`Vantaggio '${removed[0].name}' rimosso.`, "info");
    }

    // =========================================================================
    // STREGONERIA UFFICIALE 7TH SEA 2E (9 TRADIZIONI DAI 3 MANUALI UFFICIALI)
    // =========================================================================

    function setSorceryRank(newRank) {
        const r = Math.max(1, Math.min(5, parseInt(newRank) || 1));
        character.sorceryRank = r;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`Grado di Stregoneria (${character.sorcery}) impostato a <b>${r}</b>.`, "info");
    }

    function changeSorceryCorruption(delta) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.corruptionPoints = Math.max(0, (character.sorceryMeta.corruptionPoints || 0) + delta);
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    // 1. HEXENWERK HELPERS
    function toggleHexenwerkHexeParts() {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.hexenwerkUsingHexeParts = !character.sorceryMeta.hexenwerkUsingHexeParts;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function distillHexenwerkUnguents() {
        if ((character.heroPoints || 0) < 1) {
            showS7Toast("Serve almeno <b>1 Punto Eroe</b> per distillare gli Unguenti di Hexenwerk (Manuale Base p. 206)!", "error");
            return;
        }
        changeHeroPoints(-1);
        const rank = character.sorceryRank || 1;
        const mult = (character.sorceryMeta && character.sorceryMeta.hexenwerkUsingHexeParts) ? 2 : 1;
        const majAdd = 1 * mult;
        const minAdd = (2 * rank) * mult;
        let majDone = false;
        let minRemaining = minAdd;

        (character.sorceryItems || []).forEach(it => {
            const isMaj = (it.type || "").toLowerCase().includes("maggiore");
            if (isMaj && !majDone) {
                it.doses = (it.doses || 0) + majAdd;
                majDone = true;
            } else if (!isMaj && minRemaining > 0) {
                it.doses = (it.doses || 0) + minAdd;
                minRemaining = 0;
            }
        });
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`🧪 Distillazione completata (-1 PE): preparate <b>+${majAdd}</b> dose Maggiore e <b>+${minAdd}</b> dosi Minori${mult === 2 ? ' (Parti di Hexe: dosi raddoppiate e non deperibili!)' : ''}!`, "success");
    }

    function decayHexenwerkEndEpisode() {
        if (character.sorceryMeta && character.sorceryMeta.hexenwerkUsingHexeParts) {
            showS7Toast("🧪 Gli unguenti distillati con parti del corpo di un hexe non si deteriorano a fine Episodio (Manuale Base p. 206)!", "info");
            return;
        }
        let keptMajor = false;
        let keptMinor = false;
        (character.sorceryItems || []).forEach(it => {
            const isMaj = (it.type || "").toLowerCase().includes("maggiore");
            if (isMaj) {
                if (!keptMajor && (it.doses || 0) > 0) {
                    it.doses = 1;
                    keptMajor = true;
                } else {
                    it.doses = 0;
                }
            } else {
                if (!keptMinor && (it.doses || 0) > 0) {
                    it.doses = 1;
                    keptMinor = true;
                } else {
                    it.doses = 0;
                }
            }
        });
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast("Fine Episodio (Hexenwerk): conservati 1 Unguento Maggiore e 1 Unguento Minore; gli altri si sono deteriorati.", "info");
    }

    // 2. GLAMOUR / CAVALIERI DI AVALON HELPERS
    function setGlamourKnight(knightName) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.glamourKnight = knightName;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`Cavaliere di Elilodd selezionato: <b>${knightName}</b>`, "info");
    }

    function changeGlamourSpellRank(idx, delta) {
        if (!character.sorceryItems || !character.sorceryItems[idx]) return;
        const cur = character.sorceryItems[idx].rank || 1;
        character.sorceryItems[idx].rank = Math.max(1, Math.min(5, cur + delta));
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function changeGrailDebt(delta) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.grailDebt = Math.max(0, (character.sorceryMeta.grailDebt || 0) + delta);
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function rollGrailDebtCheck() {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        const debt = character.sorceryMeta.grailDebt || 0;
        const roll = Math.floor(Math.random() * 10) + 1;
        const glObj = sorceriesDb.find(s => s.name === "Glamour");
        const curses = (glObj && glObj.sidheCurses) ? glObj.sidheCurses : [];
        if (debt > 0 && roll <= debt) {
            character.sorceryMeta.grailDebt = 0;
            if (!Array.isArray(character.sorceryMeta.sidheCurses)) character.sorceryMeta.sidheCurses = [];
            const available = curses.filter(c => !character.sorceryMeta.sidheCurses.includes(c.name));
            const picked = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : curses[0];
            if (picked && !character.sorceryMeta.sidheCurses.includes(picked.name)) {
                character.sorceryMeta.sidheCurses.push(picked.name);
            }
            renderSorcery();
            if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
            showS7Toast(`🎲 Tiro Debito del Graal: <b>${roll}</b> (≤ Debito ${debt})! Il Debito si azzera ma subisci la Maledizione Sidhe: <b>${picked ? picked.name : 'Maledizione'}</b> (+1 PP al GM a inizio Episodio)!`, "danger");
        } else {
            showS7Toast(`🎲 Tiro Debito del Graal: <b>${roll}</b> (> Debito ${debt}). Nessuna Maledizione Sidhe subita!`, "success");
        }
    }

    function toggleSidheCurse(curseName) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        if (!Array.isArray(character.sorceryMeta.sidheCurses)) character.sorceryMeta.sidheCurses = [];
        if (character.sorceryMeta.sidheCurses.includes(curseName)) {
            character.sorceryMeta.sidheCurses = character.sorceryMeta.sidheCurses.filter(c => c !== curseName);
        } else {
            character.sorceryMeta.sidheCurses.push(curseName);
        }
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function toggleGlamourIncarnation() {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.incarnationUnlocked = !character.sorceryMeta.incarnationUnlocked;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    // 3. DAR MATUSHKI HELPERS
    function setMatushkaAnimal(animalName) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.matushkaActiveAnimal = animalName;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function addMatushkaLesson() {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        if (!Array.isArray(character.sorceryMeta.matushkaLessons)) character.sorceryMeta.matushkaLessons = [];
        character.sorceryMeta.matushkaLessons.push({
            restriction: "Clemenza",
            gift1: "Comando",
            gift2: "Purificare",
            broken: false
        });
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function updateMatushkaLessonField(lIdx, field, val) {
        if (!character.sorceryMeta || !Array.isArray(character.sorceryMeta.matushkaLessons) || !character.sorceryMeta.matushkaLessons[lIdx]) return;
        character.sorceryMeta.matushkaLessons[lIdx][field] = val;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function toggleMatushkaLessonBroken(lIdx) {
        if (!character.sorceryMeta || !Array.isArray(character.sorceryMeta.matushkaLessons) || !character.sorceryMeta.matushkaLessons[lIdx]) return;
        const lesson = character.sorceryMeta.matushkaLessons[lIdx];
        lesson.broken = !lesson.broken;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        if (lesson.broken) {
            showS7Toast(`⚠️ Limite di <b>${lesson.restriction}</b> infranto! I Doni (${lesson.gift1}, ${lesson.gift2}) sono bloccati finché non compi la Penitenza.`, "danger");
        } else {
            showS7Toast(`🌿 Penitenza di <b>${lesson.restriction}</b> compiuta! I Doni della Lezione sono nuovamente attivi.`, "success");
        }
    }

    function removeMatushkaLesson(lIdx) {
        if (!character.sorceryMeta || !Array.isArray(character.sorceryMeta.matushkaLessons)) return;
        character.sorceryMeta.matushkaLessons.splice(lIdx, 1);
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    // 4. PORTÉ HELPERS
    function addPorteBloodMark() {
        const nameEl = document.getElementById('inp-porte-mark-name');
        const typeEl = document.getElementById('sel-porte-mark-type');
        const locEl = document.getElementById('inp-porte-mark-loc');
        if (!nameEl || !nameEl.value.trim()) {
            showS7Toast("Inserisci il nome dell'oggetto, luogo o famigliare da marchiare!", "error");
            return;
        }
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        if (!Array.isArray(character.sorceryMeta.porteMarks)) character.sorceryMeta.porteMarks = [];
        const mType = typeEl ? typeEl.value : "Minore";
        const isFam = mType === "Famigliare";
        character.sorceryMeta.porteMarks.push({
            name: nameEl.value.trim(),
            type: isFam ? "Maggiore" : mType,
            location: locEl && locEl.value.trim() ? locEl.value.trim() : "Montaigne",
            isFamily: isFam,
            isSuperior: mType === "Superiore"
        });
        nameEl.value = '';
        if (locEl) locEl.value = '';
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`🩸 Marchio di Sangue <b>${mType}</b> registrato!`, "success");
    }

    function removePorteBloodMark(mIdx) {
        if (!character.sorceryMeta || !Array.isArray(character.sorceryMeta.porteMarks)) return;
        character.sorceryMeta.porteMarks.splice(mIdx, 1);
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function executePorteAction(mode) {
        if (mode === "Blessure") {
            changeSorceryCorruption(1);
            showS7Toast("🩸 <b>Blessure</b> attivata: hai usato il sangue di un'altra vittima! 0 Ferite Drammatiche subite, ma ricevi <b>+1 Punto Corruzione</b> (Manuale Base p. 221).", "danger");
            return;
        }
        // Trarre o Camminare infligge 1 Ferita Drammatica diretta (1-based per toggleDramaticWound)
        if (!Array.isArray(character.dramaticWounds)) character.dramaticWounds = [false, false, false, false];
        const nextDwIdx = character.dramaticWounds.findIndex(w => !w);
        if (nextDwIdx !== -1) {
            toggleDramaticWound(nextDwIdx + 1);
        }
        showS7Toast(`🩸 Porté — <b>${mode}</b>: squarci il Passaggio subendo <b>1 Ferita Drammatica</b> (+1 Incremento in Sequenza d'Azione). Non guardare e non ascoltare i Sussurri!`, "info");
    }

    // 5. SANDERIS HELPERS
    function setSanderisPact(pactName) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.sanderisPact = pactName;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`Patto del Dievas impostato su: <b>${pactName}</b>`, "info");
    }

    function setSanderisDievasName(val) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.sanderisDievasName = val || "Dievas";
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function changeSanderisDebt(delta) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.sanderisDebtCount = Math.max(0, (character.sorceryMeta.sanderisDebtCount || 0) + delta);
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function toggleSanderisSeventhPact() {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.sanderisSeventhPactReaped = !character.sorceryMeta.sanderisSeventhPactReaped;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    // 6. SORTE HELPERS
    function changeSorteLashes(delta) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.sorteLashes = Math.max(0, (character.sorceryMeta.sorteLashes || 0) + delta);
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function removeSorteLashByBlood() {
        if (!character.sorceryMeta || (character.sorceryMeta.sorteLashes || 0) <= 0) {
            showS7Toast("Nessuna Staffilata attiva da rimuovere!", "info");
            return;
        }
        const currentLashes = character.sorceryMeta.sorteLashes;
        addWound(currentLashes);
        character.sorceryMeta.sorteLashes = currentLashes - 1;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`🩸 Staffilata rimossa col <b>Sangue</b> (Manuale Base p. 229): subisci <b>${currentLashes} Ferite</b> e le Staffilate scendono a <b>${character.sorceryMeta.sorteLashes}</b>.`, "danger");
    }

    function removeSorteLashByMisfortune() {
        if (!character.sorceryMeta || (character.sorceryMeta.sorteLashes || 0) <= 0) {
            showS7Toast("Nessuna Staffilata attiva da rimuovere!", "info");
            return;
        }
        const currentLashes = character.sorceryMeta.sorteLashes;
        character.sorceryMeta.sorteLashes = currentLashes - 1;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
        showS7Toast(`🎴 Staffilata rimossa con la <b>Sfortuna</b> (Manuale Base p. 229): il GM riceve <b>+${currentLashes} Punti Pericolo</b> e le Staffilate scendono a <b>${character.sorceryMeta.sorteLashes}</b>.`, "info");
    }

    function toggleSorteUntrained() {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.sorteUntrained = !character.sorceryMeta.sorteUntrained;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    // 7. ALQUIMIA HELPERS
    function toggleAlquimiaJuvenilia(juvName) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        if (!Array.isArray(character.sorceryMeta.alquimiaJuvenilia)) character.sorceryMeta.alquimiaJuvenilia = [];
        if (character.sorceryMeta.alquimiaJuvenilia.includes(juvName)) {
            character.sorceryMeta.alquimiaJuvenilia = character.sorceryMeta.alquimiaJuvenilia.filter(j => j !== juvName);
        } else {
            character.sorceryMeta.alquimiaJuvenilia.push(juvName);
        }
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function toggleAlquimiaLaboratorium() {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.alquimiaInLaboratorium = !character.sorceryMeta.alquimiaInLaboratorium;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function setAlquimiaMagnaOpera(operaName) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.alquimiaMagnaOpera = operaName;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    // 8. GALDR & FUTHARK HELPERS
    function setGaldrSelectedRune(slot, runeName) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        if (slot === 'stort') character.sorceryMeta.galdrSelectedStort = runeName;
        else character.sorceryMeta.galdrSelectedLitet = runeName;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function activateGaldrRuneInvocation() {
        if ((character.heroPoints || 0) < 1) {
            showS7Toast("Serve almeno <b>1 Punto Eroe</b> per spezzare la runa col tuo nome e invocare il Galdr (Vol. 1 p. 192)!", "error");
            return;
        }
        changeHeroPoints(-1);
        const stort = (character.sorceryMeta && character.sorceryMeta.galdrSelectedStort) || "Stort Merke";
        const litet = (character.sorceryMeta && character.sorceryMeta.galdrSelectedLitet) || "Litet Merke";
        showS7Toast(`🪨 <b>Galdr Invocato (-1 PE)</b>: spezzi la runa del tuo nome attivando lo <b>Stort Merke</b> di <i>${stort}</i> + il <b>Litet Merke</b> di <i>${litet}</i>!`, "success");
    }

    // 9. TOCCO DI TURĂ HELPERS
    function setTuraMarkLocation(loc) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.turaMarkLocation = loc;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function setTuraTask(taskName) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        character.sorceryMeta.turaTask = taskName;
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function changeTuraTaskActs(delta) {
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        const maxActs = Math.min(4, (character.sorceryRank || 1) * 2);
        character.sorceryMeta.turaTaskActsDone = Math.max(0, Math.min(maxActs, (character.sorceryMeta.turaTaskActsDone || 0) + delta));
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    // ATTIVAZIONE DIRETTA DI UN POTERE DI STREGONERIA DALLA CARD
    function activateSorceryPowerItem(idx) {
        if (!character.sorceryItems || !character.sorceryItems[idx]) return;
        const item = character.sorceryItems[idx];
        const sorc = character.sorcery;
        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();

        if (sorc === "Hexenwerk") {
            if ((item.doses || 0) <= 0) {
                showS7Toast(`Non hai dosi pronte di <b>${item.name}</b>! Distilla nuovi unguenti o aumenta le dosi.`, "error");
                return;
            }
            item.doses = Math.max(0, (item.doses || 1) - 1);
            if (item.corruption) {
                character.sorceryMeta.corruptionPoints = (character.sorceryMeta.corruptionPoints || 0) + 1;
            }
            if (item.name === "Porridge da Funerale" || item.name === "Vista Selvaggia") {
                if (!Array.isArray(character.dramaticWounds)) character.dramaticWounds = [false, false, false, false];
                const nextDw = character.dramaticWounds.findIndex(w => !w);
                if (nextDw !== -1) toggleDramaticWound(nextDw + 1);
            }
            renderSorcery();
            if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
            showS7Toast(`🧪 Unguento <b>${item.name}</b> utilizzato (-1 dose, richiede 1 Incremento in Azione)!`, "success");
            return;
        }

        if (sorc === "Sorte") {
            if (item.name === "Lettura") {
                showS7Toast("🎴 <b>Lettura della Sorte</b> attiva (0 PE, 0 Staffilate; 1 Incremento in Azione): vedi i fili del destino nella Scena!", "info");
                return;
            }
            if ((character.heroPoints || 0) < 1) {
                showS7Toast("Serve almeno <b>1 Punto Eroe</b> per tessere una Trama della Sorte!", "error");
                return;
            }
            changeHeroPoints(-1);
            const lashesToAdd = item.lashes !== undefined ? item.lashes : ((item.type || "").includes("Maggiore") ? 2 : 1);
            character.sorceryMeta.sorteLashes = (character.sorceryMeta.sorteLashes || 0) + lashesToAdd;
            renderSorcery();
            if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
            showS7Toast(`🎴 Trama <b>${item.name}</b> tessuta (-1 PE, <b>+${lashesToAdd} ${lashesToAdd === 1 ? 'Staffilata' : 'Staffilate'}</b>; totale Staffilate: ${character.sorceryMeta.sorteLashes})!`, "success");
            return;
        }

        if (sorc === "Porté") {
            if (item.name.startsWith("Trarre")) {
                executePorteAction("Trarre");
            } else if (item.name.startsWith("Camminare") || item.name === "Passo a Vista") {
                executePorteAction("Camminare");
            } else if (item.name.startsWith("Blessure")) {
                executePorteAction("Blessure");
            } else if (item.name === "Apporre un Marchio" || item.name.startsWith("Occhio del Passaggio") || item.name === "Marchio Superiore") {
                if ((character.heroPoints || 0) < 1) {
                    showS7Toast(`Serve almeno <b>1 Punto Eroe</b> per attivare <b>${item.name}</b>!`, "error");
                    return;
                }
                changeHeroPoints(-1);
                showS7Toast(`🩸 <b>${item.name}</b> attivato (-1 PE)!`, "success");
            } else {
                showS7Toast(`🩸 <b>${item.name}</b> attivato!`, "info");
            }
            return;
        }

        if (sorc === "Alquimia") {
            if ((item.doses || 0) <= 0) {
                showS7Toast(`Nessuna dose pronta di <b>${item.name}</b>!`, "error");
                return;
            }
            item.doses = Math.max(0, (item.doses || 1) - 1);
            renderSorcery();
            if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
            showS7Toast(`⚗️ Composto Alchemico <b>${item.name}</b> attivato (-1 dose; richiede 1 Incremento in Azione)!`, "success");
            return;
        }

        if (sorc === "Sanderis") {
            const isMajor = (item.type || "").includes("Maggiore") || item.corruption;
            if (isMajor) {
                character.sorceryMeta.corruptionPoints = (character.sorceryMeta.corruptionPoints || 0) + 1;
                renderSorcery();
                if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
                showS7Toast(`🔥 Favore Maggiore <b>${item.name}</b> invocato: paghi il Prezzo del dievas e subisci <b>+1 Punto Corruzione</b> obbligatorio (Manuale Base p. 223)!`, "danger");
                return;
            }
            if ((character.heroPoints || 0) < 1) {
                showS7Toast(`Serve almeno <b>1 Punto Eroe</b> per invocare il Favore Minore <b>${item.name}</b>!`, "error");
                return;
            }
            changeHeroPoints(-1);
            showS7Toast(`🔥 Favore Minore <b>${item.name}</b> invocato (-1 PE, +1 Incremento in Azione)!`, "success");
            return;
        }

        if (sorc === "Tocco di Tură" && item.name === "Fulmine") {
            if ((character.heroPoints || 0) < 1) {
                showS7Toast("Serve almeno <b>1 Punto Eroe</b> per invocare <b>Fulmine</b>!", "error");
                return;
            }
            changeHeroPoints(-1);
            const istruzioneRank = (character.skills && character.skills["Istruzione"]) || 0;
            showS7Toast(`⚡ <b>Fulmine di Tură</b> scagliato (-1 PE): infligge istantaneamente <b>${istruzioneRank} Ferite inevitabili</b> (pari al tuo Grado di Istruzione ${istruzioneRank})!`, "success");
            return;
        }

        // Glamour, Dar Matushki, Galdr, altri Doni di Tură: 1 PE
        if ((character.heroPoints || 0) < 1) {
            showS7Toast(`Serve almeno <b>1 Punto Eroe</b> per attivare <b>${item.name}</b>!`, "error");
            return;
        }
        changeHeroPoints(-1);
        showS7Toast(`✨ Potere <b>${item.name}</b> (${sorc}) attivato (-1 PE)!`, "success");
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
                        <p class="text-gray-400 text-xs mt-1">Se il tuo Eroe possiede una Stregoneria, selezionala nel pannello di creazione in alto (Hexenwerk, Glamour, Dar Matushki, Porté, Sanderis, Sorte, Alquimia, Galdr, Tocco di Tură) o acquisisci il Vantaggio Stregoneria.</p>
                    </div>
                `;
            }
            return;
        }

        if (!character.sorceryMeta) character.sorceryMeta = getDefaultSorceryMeta();
        const meta = character.sorceryMeta;
        const sorcName = resolveOfficialSorceryName(character.sorcery, character.nation);
        character.sorcery = sorcName;
        const currentSorc = sorceriesDb.find(s => s.name === sorcName);
        if (!currentSorc) return;

        const sorcRank = Math.max(1, Math.min(5, parseInt(character.sorceryRank) || 1));
        character.sorceryRank = sorcRank;

        // Costruisci il cruscotto specifico per ciascuna delle 9 tradizioni ufficiali
        let dashboardHtml = '';

        if (sorcName === "Hexenwerk") {
            const maxMinorPerBrew = (2 * sorcRank) * (meta.hexenwerkUsingHexeParts ? 2 : 1);
            const maxMajorPerBrew = 1 * (meta.hexenwerkUsingHexeParts ? 2 : 1);
            dashboardHtml = `
                <div class="bg-[#191627] border border-purple-500/30 rounded-xl p-3 space-y-2 text-xs">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span class="font-bold text-purple-200">⚗️ Laboratorio Hexenwerk (Grado ${sorcRank}):</span>
                            <span class="text-gray-300 ml-1">Conosci <b>${sorcRank}</b> Unguenti Maggiori e <b>${sorcRank * 2}</b> Minori. Distillazione (1 PE + 1h): <b>${maxMajorPerBrew}</b> Maggiore + <b>${maxMinorPerBrew}</b> Minori.</span>
                        </div>
                        <div class="flex flex-wrap items-center gap-1.5">
                            <button onclick="distillHexenwerkUnguents()" class="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-lg shadow text-[11px]">
                                🧪 Distilla Unguenti (1 PE)
                            </button>
                            <button onclick="decayHexenwerkEndEpisode()" class="px-2 py-1 bg-[#252036] hover:bg-[#322b49] border border-purple-500/40 text-purple-200 rounded-lg text-[11px]" title="A fine Episodio restano solo 1 Unguento Maggiore e 1 Unguento Minore">
                                ⏳ Fine Episodio (Deterioramento)
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#2b2440] text-[11px]">
                        <label class="flex items-center gap-1.5 cursor-pointer text-amber-300">
                            <input type="checkbox" ${meta.hexenwerkUsingHexeParts ? 'checked' : ''} onchange="toggleHexenwerkHexeParts()" class="rounded border-purple-500">
                            <span>Usa parti del corpo di un <b>hexe</b> (raddoppia le dosi e impedisce il deterioramento a fine Episodio — Manuale Base p. 206)</span>
                        </label>
                        <div class="flex items-center gap-1.5 text-rose-300 font-bold">
                            <span>💀 Punti Corruzione:</span>
                            <button onclick="changeSorceryCorruption(-1)" class="w-5 h-5 rounded bg-rose-950 border border-rose-700 text-rose-200">-</button>
                            <span class="px-1.5">${meta.corruptionPoints || 0}</span>
                            <button onclick="changeSorceryCorruption(1)" class="w-5 h-5 rounded bg-rose-950 border border-rose-700 text-rose-200">+</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (sorcName === "Glamour") {
            const knights = currentSorc.knights || [];
            const activeKnight = knights.find(k => k.name === meta.glamourKnight) || knights[0];
            const knightOptions = knights.map(k => `<option value="${k.name}" ${k.name === activeKnight.name ? 'selected' : ''}>${k.name} (Magg: ${k.major} • Min: ${k.minor})</option>`).join('');
            const cursesList = currentSorc.sidheCurses || [];
            const activeCurses = Array.isArray(meta.sidheCurses) ? meta.sidheCurses : [];
            const cursesBadges = cursesList.map(c => {
                const isOn = activeCurses.includes(c.name);
                return `<button onclick="toggleSidheCurse('${c.name}')" title="${c.desc}" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${isOn ? 'bg-rose-900/80 border-rose-400 text-rose-100' : 'bg-[#12101b] border-[#2f2846] text-gray-400 hover:text-gray-200'}">${isOn ? '⚠️ ' : ''}${c.name}</button>`;
            }).join('');

            dashboardHtml = `
                <div class="bg-[#191627] border border-purple-500/30 rounded-xl p-3 space-y-2.5 text-xs">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 items-center">
                        <div>
                            <label class="block text-[11px] text-purple-300 font-bold mb-1">🛡️ Cavaliere di Re Elilodd Prescelto (20 Cavalieri Ufficiali):</label>
                            <select id="sel-glamour-knight" onchange="setGlamourKnight(this.value)" class="w-full bg-[#0d0c14] border border-purple-500/50 rounded-lg px-2.5 py-1.5 text-xs text-amber-200 font-bold outline-none">
                                ${knightOptions}
                            </select>
                        </div>
                        <div class="bg-[#12101b] border border-[#2d2544] rounded-lg p-2 text-[11px] space-y-0.5">
                            <div class="flex items-center justify-between">
                                <span class="text-purple-300 font-bold">${activeKnight.name}</span>
                                <span class="text-amber-300 font-semibold">Magg: ${activeKnight.major} • Min: ${activeKnight.minor}</span>
                            </div>
                            <div class="text-gray-300">Adesivi Cavaliere: <b class="text-emerald-300">Virtù: ${activeKnight.virtue}</b> &bull; <b class="text-rose-300">Hubris: ${activeKnight.hubris}</b></div>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[#2b2440]">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="text-[11px] font-bold text-amber-300">🏆 Debito del Graal (Vol. 1 p. 48):</span>
                            <div class="flex items-center gap-1 bg-[#12101b] px-2 py-0.5 rounded border border-amber-500/40">
                                <button onclick="changeGrailDebt(-1)" class="w-5 h-5 rounded bg-amber-950 text-amber-200 font-bold">-</button>
                                <span id="grail-debt-val" class="font-bold text-amber-300 px-1.5">${meta.grailDebt || 0}</span>
                                <button onclick="changeGrailDebt(1)" class="w-5 h-5 rounded bg-amber-950 text-amber-200 font-bold">+</button>
                            </div>
                            <button onclick="rollGrailDebtCheck()" class="px-2.5 py-1 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] shadow">
                                🎲 Tira 1d10 Debito
                            </button>
                            <span class="text-[10px] text-gray-400">(+1° Grado extra = +1 Debito; +2° = +2; +3° = +3)</span>
                        </div>
                        <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-purple-200 font-semibold">
                            <input type="checkbox" ${meta.incarnationUnlocked ? 'checked' : ''} onchange="toggleGlamourIncarnation()" class="rounded border-purple-500">
                            <span>🌟 Incarnazione Sbloccata (Storia a 5 Atti - Vol. 1 p. 48)</span>
                        </label>
                    </div>

                    ${meta.incarnationUnlocked ? `
                        <div class="bg-amber-950/30 border border-amber-500/50 rounded-lg p-2 text-[11px] text-amber-200">
                            <b>🌟 Incanto Leggendario (${activeKnight.name} — <i>${activeKnight.legendaryName}</i>):</b> ${activeKnight.legendaryDesc}
                        </div>
                    ` : ''}

                    <div class="space-y-1 pt-1 border-t border-[#2b2440]">
                        <div class="flex items-center justify-between text-[11px]">
                            <span class="text-rose-300 font-bold">🧚 Maledizioni Sidhe Attive (+1 PP al GM a inizio Episodio ciascuna):</span>
                            <span class="text-gray-400 text-[10px]">Clicca per attivare/rimuovere</span>
                        </div>
                        <div class="flex flex-wrap gap-1">${cursesBadges}</div>
                    </div>

                    <details class="text-[11px] text-gray-300 bg-[#12101b] rounded-lg p-2 border border-[#29223a]">
                        <summary class="cursor-pointer font-bold text-purple-300">📜 I 7 Obblighi del Gesa (Manuale Base p. 211 — infrangerli blocca il Glamour per la Scena)</summary>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1.5 text-[11px] text-gray-300">
                            ${(currentSorc.gesaOaths || []).map(o => `<div>• ${o}</div>`).join('')}
                        </div>
                    </details>
                </div>
            `;
        } else if (sorcName === "Dar Matushki") {
            const restrictions = currentSorc.restrictions || [];
            const gifts = currentSorc.powers || [];
            const animals = currentSorc.animalForms || [];
            const lessons = Array.isArray(meta.matushkaLessons) ? meta.matushkaLessons : [];
            const curAnimal = animals.find(a => a.name === meta.matushkaActiveAnimal) || animals[0];

            const lessonsHtml = lessons.map((les, lIdx) => {
                const rObj = restrictions.find(r => r.name === les.restriction) || restrictions[0];
                const rOpts = restrictions.map(r => `<option value="${r.name}" ${r.name === les.restriction ? 'selected' : ''}>${r.name}</option>`).join('');
                const g1Opts = gifts.map(g => `<option value="${g.name}" ${g.name === les.gift1 ? 'selected' : ''}>${g.name}</option>`).join('');
                const g2Opts = gifts.map(g => `<option value="${g.name}" ${g.name === les.gift2 ? 'selected' : ''}>${g.name}</option>`).join('');
                return `
                    <div class="bg-[#12101b] border ${les.broken ? 'border-rose-500/70 bg-rose-950/20' : 'border-[#2d2544]'} rounded-lg p-2.5 space-y-1.5">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <span class="font-bold text-purple-300 text-[11px]">📖 ${lIdx + 1}ª Lezione di Matushka</span>
                            <div class="flex items-center gap-1.5">
                                <button onclick="toggleMatushkaLessonBroken(${lIdx})" class="px-2 py-0.5 rounded text-[10px] font-bold border ${les.broken ? 'bg-emerald-800 border-emerald-500 text-white' : 'bg-rose-950/70 border-rose-700 text-rose-200'}">
                                    ${les.broken ? '✓ Compi Penitenza' : '⚠️ Infrangi Limite'}
                                </button>
                                ${!isLocked && lessons.length > 1 ? `<button onclick="removeMatushkaLesson(${lIdx})" class="text-red-400 hover:text-red-300 text-xs">🗑️</button>` : ''}
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-1.5 text-[11px]">
                            <div>
                                <span class="text-gray-400 block text-[10px]">Restrizione:</span>
                                <select onchange="updateMatushkaLessonField(${lIdx}, 'restriction', this.value)" class="w-full bg-[#0d0c14] border border-[#3a2f54] rounded px-1.5 py-1 text-amber-200 font-bold">
                                    ${rOpts}
                                </select>
                            </div>
                            <div>
                                <span class="text-gray-400 block text-[10px]">1° Dono:</span>
                                <select onchange="updateMatushkaLessonField(${lIdx}, 'gift1', this.value)" class="w-full bg-[#0d0c14] border border-[#3a2f54] rounded px-1.5 py-1 text-purple-200">
                                    ${g1Opts}
                                </select>
                            </div>
                            <div>
                                <span class="text-gray-400 block text-[10px]">2° Dono:</span>
                                <select onchange="updateMatushkaLessonField(${lIdx}, 'gift2', this.value)" class="w-full bg-[#0d0c14] border border-[#3a2f54] rounded px-1.5 py-1 text-purple-200">
                                    ${g2Opts}
                                </select>
                            </div>
                        </div>
                        <div class="text-[10px] text-gray-300 leading-snug">
                            <b class="text-rose-300">Limite (${rObj.name}):</b> ${rObj.limit}<br>
                            <b class="text-emerald-300">Penitenza:</b> ${rObj.penance}
                        </div>
                    </div>
                `;
            }).join('');

            dashboardHtml = `
                <div class="bg-[#191627] border border-purple-500/30 rounded-xl p-3 space-y-2.5 text-xs">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span class="font-bold text-purple-200">🐻 Lezioni di Nonna Ussura (Grado ${sorcRank}):</span>
                            <span class="text-gray-300 ml-1">Ogni Grado conferisce 1 Lezione (2 Doni + 1 Restrizione).</span>
                        </div>
                        ${!isLocked ? `<button onclick="addMatushkaLesson()" class="px-2.5 py-1 bg-purple-800 hover:bg-purple-700 text-purple-100 rounded-lg text-[11px] font-bold">+ Aggiungi Lezione</button>` : ''}
                    </div>
                    <div class="space-y-2">${lessonsHtml}</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 items-center pt-1.5 border-t border-[#2b2440]">
                        <div>
                            <label class="block text-[11px] text-amber-300 font-bold mb-1">🐾 Forma Animale Attiva (15 Forme Ufficiali - Manuale Base p. 218):</label>
                            <select id="sel-matushka-animal" onchange="setMatushkaAnimal(this.value)" class="w-full bg-[#0d0c14] border border-amber-500/40 rounded-lg px-2 py-1 text-xs text-amber-200 font-bold">
                                ${animals.map(a => `<option value="${a.name}" ${a.name === curAnimal.name ? 'selected' : ''}>${a.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="bg-[#12101b] border border-[#2d2544] rounded-lg p-2 text-[11px] text-gray-200">
                            <b class="text-amber-300">Dote di ${curAnimal.name}:</b> ${curAnimal.gift}
                        </div>
                    </div>
                </div>
            `;
        } else if (sorcName === "Porté") {
            const hasExtendedPool = (character.sorceryItems || []).some(i => i.name === "Riserva di Sangue Estesa");
            const effectiveRank = sorcRank + (hasExtendedPool ? 1 : 0);
            const maxMajor = effectiveRank;
            const maxMinor = effectiveRank * 2;
            const marks = Array.isArray(meta.porteMarks) ? meta.porteMarks : [];
            const usedMajor = marks.filter(m => m.type === "Maggiore" && !m.isFamily).length;
            const usedMinor = marks.filter(m => m.type === "Minore" || m.type === "Superiore").length;

            const marksHtml = marks.map((m, mIdx) => `
                <div class="flex items-center justify-between bg-[#12101b] border border-[#32243b] rounded-lg px-2.5 py-1.5 text-[11px]">
                    <div>
                        <b class="text-rose-300">${m.name}</b>
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-700/50 text-rose-200 ml-1">${m.isFamily ? 'Famigliare 1° Grado (Gratis)' : (m.isSuperior ? 'Marchio Superiore (1 PE)' : m.type)}</span>
                        <span class="text-gray-400 ml-1">📍 ${m.location || 'Montaigne'}</span>
                    </div>
                    <button onclick="removePorteBloodMark(${mIdx})" class="text-red-400 hover:text-red-300 text-xs ml-2" title="Dissolvi Marchio">✕</button>
                </div>
            `).join('');

            dashboardHtml = `
                <div class="bg-[#191627] border border-rose-500/30 rounded-xl p-3 space-y-2.5 text-xs">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span class="font-bold text-rose-300">🩸 Registro dei Marchi di Sangue (Grado ${sorcRank}${hasExtendedPool ? '+1 Riserva Estesa' : ''}):</span>
                            <span class="text-gray-300 ml-1">Maggiori: <b>${usedMajor}/${maxMajor}</b> &bull; Minori: <b>${usedMinor}/${maxMinor}</b> (Famigliari di 1° grado gratuiti)</span>
                        </div>
                        <div class="flex flex-wrap items-center gap-1.5">
                            <button onclick="executePorteAction('Trarre')" class="px-2 py-1 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded text-[11px]">✋ Trarre (+1 FD)</button>
                            <button onclick="executePorteAction('Camminare')" class="px-2 py-1 bg-purple-800 hover:bg-purple-700 text-white font-bold rounded text-[11px]">🚪 Camminare (+1 FD)</button>
                            <button onclick="executePorteAction('Blessure')" class="px-2 py-1 bg-red-950 hover:bg-red-900 border border-red-500 text-red-200 font-bold rounded text-[11px]" title="Usa il sangue altrui: 0 FD ma +1 Punto Corruzione">💀 Blessure (+1 Corruzione)</button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        ${marksHtml || '<div class="text-gray-400 italic col-span-2 text-[11px]">Nessun Marchio attivo registrato.</div>'}
                    </div>
                    <div class="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-[#2b2440]">
                        <input id="inp-porte-mark-name" type="text" placeholder="Oggetto, luogo o parente..." class="flex-1 min-w-[140px] bg-[#0d0c14] border border-[#3a2f54] rounded px-2 py-1 text-[11px] text-gray-200">
                        <select id="sel-porte-mark-type" class="bg-[#0d0c14] border border-[#3a2f54] rounded px-2 py-1 text-[11px] text-rose-200">
                            <option value="Minore">Marchio Minore (Oggetto a 1 mano)</option>
                            <option value="Maggiore">Marchio Maggiore (Luogo/Oggetto)</option>
                            <option value="Famigliare">Parente Vivente 1° Grado (Gratis)</option>
                            <option value="Superiore">Marchio Superiore (Vol.1 - Trarre a 1 PE)</option>
                        </select>
                        <input id="inp-porte-mark-loc" type="text" placeholder="Posizione..." class="w-28 bg-[#0d0c14] border border-[#3a2f54] rounded px-2 py-1 text-[11px] text-gray-200">
                        <button onclick="addPorteBloodMark()" class="px-2.5 py-1 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded text-[11px]">+ Marchia (1 PE)</button>
                    </div>
                </div>
            `;
        } else if (sorcName === "Sanderis") {
            const pacts = currentSorc.dievaiPacts || ["Oscurità", "Fuoco", "Freddo", "Tempesta", "Mare", "Conoscenza", "Amore"];
            dashboardHtml = `
                <div class="bg-[#191627] border border-purple-500/30 rounded-xl p-3 space-y-2.5 text-xs">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <div>
                            <label class="block text-[11px] text-purple-300 font-bold mb-1">👹 Nome del Dievas:</label>
                            <input type="text" value="${meta.sanderisDievasName || 'Velnias'}" oninput="setSanderisDievasName(this.value)" class="w-full bg-[#0d0c14] border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-amber-200 font-bold">
                        </div>
                        <div>
                            <label class="block text-[11px] text-purple-300 font-bold mb-1">🔥 Dominio del Patto (7 Dievai Ufficiali):</label>
                            <select id="sel-sanderis-pact" onchange="setSanderisPact(this.value)" class="w-full bg-[#0d0c14] border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-purple-200 font-bold">
                                ${pacts.map(p => `<option value="${p}" ${p === meta.sanderisPact ? 'selected' : ''}>Patto: ${p}</option>`).join('')}
                            </select>
                        </div>
                        <div class="flex flex-col gap-1 bg-[#12101b] border border-[#2d2544] rounded-lg p-2 text-[11px]">
                            <div class="flex items-center justify-between">
                                <span class="text-amber-300 font-bold">⚖️ Debiti col Dievas:</span>
                                <div class="flex items-center gap-1">
                                    <button onclick="changeSanderisDebt(-1)" class="w-5 h-5 rounded bg-amber-950 text-amber-200">-</button>
                                    <span class="font-bold px-1 text-amber-200">${meta.sanderisDebtCount || 0}</span>
                                    <button onclick="changeSanderisDebt(1)" class="w-5 h-5 rounded bg-amber-950 text-amber-200">+</button>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-rose-300 font-bold">💀 Corruzione (Favori Maggiori):</span>
                                <div class="flex items-center gap-1">
                                    <button onclick="changeSorceryCorruption(-1)" class="w-5 h-5 rounded bg-rose-950 text-rose-200">-</button>
                                    <span class="font-bold px-1 text-rose-200">${meta.corruptionPoints || 0}</span>
                                    <button onclick="changeSorceryCorruption(1)" class="w-5 h-5 rounded bg-rose-950 text-rose-200">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[#2b2440] text-[11px]">
                        <span class="text-gray-300">Grado ${sorcRank}: conosci <b>${sorcRank * 2} Favori Minori</b>. I Favori Minori non acquisiti del tuo Patto costano 1 PE + 1 Debito col dievas.</span>
                        <label class="flex items-center gap-1.5 cursor-pointer text-amber-300 font-semibold">
                            <input type="checkbox" ${meta.sanderisSeventhPactReaped ? 'checked' : ''} onchange="toggleSanderisSeventhPact()" class="rounded border-amber-500">
                            <span>⚔️ Settimo Patto: La Mietitura (Vol. 2 pp. 97-98)</span>
                        </label>
                    </div>
                    ${meta.sanderisSeventhPactReaped ? `
                        <div class="bg-amber-950/30 border border-amber-500/50 rounded-lg p-2 text-[11px] text-amber-200">
                            <b>⚔️ La Mietitura Compiuta:</b> Il losejas ha spezzato i 7 Patti rendendo il dievas corporeo e mortale! Benefici della Mietitura attivi (+1 a un Tratto fino a 5, immunità alla Paura dei Mostri, arma benedetta contro i dievai).
                        </div>
                    ` : ''}
                </div>
            `;
        } else if (sorcName === "Sorte") {
            const lashes = meta.sorteLashes || 0;
            const slotsByRank = {
                1: "Lettura + 2 Minori + 1 Maggiore",
                2: "Lettura + 3 Minori + 2 Maggiori",
                3: "Lettura + 4 Minori + 3 Maggiori",
                4: "Tutte (Lettura + 4 Minori + 4 Maggiori)",
                5: "Tutte (Lettura + 4 Minori + 4 Maggiori)"
            };
            dashboardHtml = `
                <div class="bg-[#191627] border border-purple-500/30 rounded-xl p-3 space-y-2.5 text-xs">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span class="font-bold text-purple-200">🎴 Trame della Sorte (Grado ${sorcRank}):</span>
                            <span class="text-amber-300 font-semibold ml-1">${slotsByRank[sorcRank]}</span>
                        </div>
                        <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-rose-300 font-semibold">
                            <input type="checkbox" ${meta.sorteUntrained ? 'checked' : ''} onchange="toggleSorteUntrained()" class="rounded border-rose-500">
                            <span>🩸 Tessere Senza Addestramento (Vol. 2 p. 192: costa Ferite Drammatiche invece di PE)</span>
                        </label>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-2 bg-[#12101b] border border-[#2d2544] rounded-lg p-2.5">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-rose-300">🕸️ Staffilate del Fato Attuali:</span>
                            <div class="flex items-center gap-1 bg-rose-950/70 border border-rose-600/60 px-2 py-0.5 rounded">
                                <button onclick="changeSorteLashes(-1)" class="w-5 h-5 rounded bg-rose-900 text-white font-bold">-</button>
                                <span id="sorte-lashes-val" class="font-extrabold text-sm text-rose-200 px-2">${lashes}</span>
                                <button onclick="changeSorteLashes(1)" class="w-5 h-5 rounded bg-rose-900 text-white font-bold">+</button>
                            </div>
                            <span class="text-[10px] text-gray-400">(Con 1 PP il GM annulla tutti i tuoi dadi &lt; ${lashes})</span>
                        </div>
                        <div class="flex flex-wrap items-center gap-1.5">
                            <button onclick="removeSorteLashByBlood()" class="px-2.5 py-1 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] shadow" title="Subisci tante Ferite quante le Staffilate attuali per rimuovere 1 Staffilata">
                                🩸 Rimuovi col Sangue (${lashes} Ferite)
                            </button>
                            <button onclick="removeSorteLashByMisfortune()" class="px-2.5 py-1 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shadow" title="Dai al GM tanti Punti Pericolo quante le Staffilate attuali per rimuovere 1 Staffilata">
                                🎲 Rimuovi con Sfortuna (+${lashes} PP al GM)
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else if (sorcName === "Alquimia") {
            const juvCats = currentSorc.juveniliaCategories || ["Wai Dan", "Rasāyana", "Chymica", "Spagyrica", "Takwin"];
            const unlockedJuv = Array.isArray(meta.alquimiaJuvenilia) ? meta.alquimiaJuvenilia : ["Chymica"];
            const maxCarry = meta.alquimiaInLaboratorium ? (sorcRank * 2) : sorcRank;
            const totalDosesCarried = (character.sorceryItems || []).reduce((acc, it) => acc + (parseInt(it.doses) || 0), 0);
            const magnaList = currentSorc.magnaOperaList || [];
            const curMagna = magnaList.find(m => m.name === meta.alquimiaMagnaOpera) || magnaList[0];

            const juvButtons = juvCats.map(j => {
                const isOn = unlockedJuv.includes(j);
                return `<button onclick="toggleAlquimiaJuvenilia('${j}')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${isOn ? 'bg-amber-700/80 border-amber-400 text-white shadow' : 'bg-[#12101b] border-[#2d2544] text-gray-400 hover:text-gray-200'}">${isOn ? '⚗️ ' : ''}${j}</button>`;
            }).join('');

            dashboardHtml = `
                <div class="bg-[#191627] border border-purple-500/30 rounded-xl p-3 space-y-2.5 text-xs">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span class="font-bold text-amber-300">⚗️ Juvenilia Sbloccate (${unlockedJuv.length}/${sorcRank} per Grado):</span>
                            <span class="text-gray-300 ml-1">Composti trasportati: <b class="${totalDosesCarried > maxCarry ? 'text-rose-400' : 'text-emerald-300'}">${totalDosesCarried}/${maxCarry}</b></span>
                        </div>
                        <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-purple-200 font-semibold">
                            <input type="checkbox" ${meta.alquimiaInLaboratorium ? 'checked' : ''} onchange="toggleAlquimiaLaboratorium()" class="rounded border-purple-500">
                            <span>🏛️ Dentro il Laboratorium (Capacità raddoppiata: ${sorcRank * 2} composti &bull; ${Math.max(0, sorcRank - 1)} ricette a 0 Requisiti)</span>
                        </label>
                    </div>
                    <div class="flex flex-wrap gap-1.5">${juvButtons}</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 items-center pt-1.5 border-t border-[#2b2440]">
                        <div>
                            <label class="block text-[11px] text-purple-300 font-bold mb-1">🌟 Magna Opera (Storia a 5 Atti - Vol. 1 pp. 99-100):</label>
                            <select onchange="setAlquimiaMagnaOpera(this.value)" class="w-full bg-[#0d0c14] border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-amber-200 font-bold">
                                ${magnaList.map(m => `<option value="${m.name}" ${m.name === curMagna.name ? 'selected' : ''}>Magna Opera: ${m.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="bg-[#12101b] border border-[#2d2544] rounded-lg p-2 text-[11px] text-gray-300">
                            <b class="text-amber-300">${curMagna.name}:</b> ${curMagna.desc}
                        </div>
                    </div>
                </div>
            `;
        } else if (sorcName === "Galdr") {
            const knownRunes = (character.sorceryItems || []).length > 0 ? character.sorceryItems : currentSorc.powers.slice(0, 2);
            const activeStort = knownRunes.find(r => r.name === meta.galdrSelectedStort) || knownRunes[0] || currentSorc.powers[0];
            const activeLitet = knownRunes.find(r => r.name === meta.galdrSelectedLitet) || knownRunes[knownRunes.length - 1] || currentSorc.powers[0];

            dashboardHtml = `
                <div class="bg-[#191627] border border-purple-500/30 rounded-xl p-3 space-y-2.5 text-xs">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span class="font-bold text-amber-300">🪨 Futhark &amp; Galdr (Grado ${sorcRank} = ${sorcRank * 2} Rune Conosciute):</span>
                            <span class="text-gray-300 ml-1">Spezza la runa col tuo nome (1 PE + 1 Incr. in Azione) per attivare 1 Stort Merke + 1 Litet Merke!</span>
                        </div>
                        <button onclick="activateGaldrRuneInvocation()" class="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold rounded-lg text-xs shadow">
                            🪨 Invoca Galdr (1 PE: Stort + Litet)
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 border-t border-[#2b2440]">
                        <div class="bg-[#12101b] border border-amber-500/40 rounded-lg p-2 space-y-1">
                            <label class="block text-[11px] text-amber-300 font-bold">⚡ 1° Effetto: Stort Merke (Marchio Maggiore)</label>
                            <select id="sel-galdr-stort" onchange="setGaldrSelectedRune('stort', this.value)" class="w-full bg-[#0d0c14] border border-[#3a2f54] rounded px-2 py-1 text-xs text-amber-200 font-bold">
                                ${knownRunes.map(r => `<option value="${r.name}" ${r.name === activeStort.name ? 'selected' : ''}>${r.name}</option>`).join('')}
                            </select>
                            <p class="text-[11px] text-gray-300 leading-snug">${activeStort ? (activeStort.stortMerke || activeStort.desc) : ''}</p>
                        </div>
                        <div class="bg-[#12101b] border border-purple-500/40 rounded-lg p-2 space-y-1">
                            <label class="block text-[11px] text-purple-300 font-bold">✨ 2° Effetto: Litet Merke (Marchio Minore)</label>
                            <select id="sel-galdr-litet" onchange="setGaldrSelectedRune('litet', this.value)" class="w-full bg-[#0d0c14] border border-[#3a2f54] rounded px-2 py-1 text-xs text-purple-200 font-bold">
                                ${knownRunes.map(r => `<option value="${r.name}" ${r.name === activeLitet.name ? 'selected' : ''}>${r.name}</option>`).join('')}
                            </select>
                            <p class="text-[11px] text-gray-300 leading-snug">${activeLitet ? (activeLitet.litetMerke || activeLitet.desc) : ''}</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (sorcName === "Tocco di Tură") {
            const locations = currentSorc.markLocations || ["Viso", "Collo", "Mani"];
            const tasks = currentSorc.tasksOfTura || [];
            const curTask = tasks.find(t => t.name === meta.turaTask) || tasks[0];
            const maxActs = Math.min(4, sorcRank * 2);
            const doneActs = Math.min(maxActs, meta.turaTaskActsDone || 0);
            const istruzioneVal = (character.skills && character.skills["Istruzione"]) || 0;

            dashboardHtml = `
                <div class="bg-[#191627] border border-purple-500/30 rounded-xl p-3 space-y-2.5 text-xs">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <div>
                            <label class="block text-[11px] text-purple-300 font-bold mb-1">❄️ Marchio Nero di Tură (+1 Incr. Sociale Ussura):</label>
                            <select onchange="setTuraMarkLocation(this.value)" class="w-full bg-[#0d0c14] border border-purple-500/40 rounded-lg px-2 py-1 text-xs text-purple-200 font-bold">
                                ${locations.map(l => `<option value="${l}" ${l === meta.turaMarkLocation ? 'selected' : ''}>Marchio Nero su: ${l}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] text-amber-300 font-bold mb-1">⚡ Compito di Tură (${maxActs} Atti a Grado ${sorcRank}):</label>
                            <select onchange="setTuraTask(this.value)" class="w-full bg-[#0d0c14] border border-amber-500/40 rounded-lg px-2 py-1 text-xs text-amber-200 font-bold">
                                ${tasks.map(t => `<option value="${t.name}" ${t.name === curTask.name ? 'selected' : ''}>${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="bg-[#12101b] border border-[#2d2544] rounded-lg p-2 flex items-center justify-between">
                            <div>
                                <span class="text-[11px] text-amber-300 font-bold block">Progresso Compito:</span>
                                <span class="text-[10px] text-gray-400">Fulmine = <b>${istruzioneVal} Ferite</b> (Istruzione)</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <button onclick="changeTuraTaskActs(-1)" class="w-5 h-5 rounded bg-amber-950 text-amber-200 font-bold">-</button>
                                <span class="font-bold text-amber-200 px-1.5">${doneActs}/${maxActs} Atti</span>
                                <button onclick="changeTuraTaskActs(1)" class="w-5 h-5 rounded bg-amber-950 text-amber-200 font-bold">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="text-[11px] text-gray-300 bg-[#12101b] rounded-lg px-2.5 py-1.5 border border-[#29223a]">
                        <b class="text-amber-300">${curTask.name}:</b> ${curTask.desc}
                    </div>
                </div>
            `;
        }

        // Renderizza le card dei singoli poteri memorizzati/preparati
        let itemsHtml = '';
        (character.sorceryItems || []).forEach((item, idx) => {
            const removeBtn = isLocked ? '' : `<button onclick="removeSorceryItem(${idx})" class="text-red-400 hover:text-red-300 text-xs font-bold ml-1" title="Rimuovi potere">🗑️</button>`;
            const usesDoses = (sorcName === "Hexenwerk" || sorcName === "Alquimia");
            const usesSpellRank = (sorcName === "Glamour");

            let rightControlHtml = '';
            if (usesDoses) {
                rightControlHtml = `
                    <div class="flex items-center gap-1 text-xs bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800" title="Dosi preparate">
                        <span class="text-[10px] text-purple-400 mr-0.5">Dosi:</span>
                        <button onclick="changeSorceryDose(${idx}, -1)" class="w-4 h-4 rounded bg-[#2c243c] hover:bg-[#3f3258] text-purple-200 font-bold text-xs flex items-center justify-center">-</button>
                        <span class="font-bold text-purple-100 text-xs px-1">${item.doses !== undefined ? item.doses : 1}</span>
                        <button onclick="changeSorceryDose(${idx}, 1)" class="w-4 h-4 rounded bg-[#2c243c] hover:bg-[#3f3258] text-purple-200 font-bold text-xs flex items-center justify-center">+</button>
                    </div>
                `;
            } else if (usesSpellRank) {
                rightControlHtml = `
                    <div class="flex items-center gap-1 text-xs bg-amber-950/80 text-amber-200 px-2 py-0.5 rounded border border-amber-700/60" title="Grado dell'Incanto (1-5)">
                        <span class="text-[10px] text-amber-300">Grado:</span>
                        <button onclick="changeGlamourSpellRank(${idx}, -1)" class="w-4 h-4 rounded bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center">-</button>
                        <span class="font-bold text-amber-100 text-xs px-1">${item.rank || 1}</span>
                        <button onclick="changeGlamourSpellRank(${idx}, 1)" class="w-4 h-4 rounded bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center">+</button>
                    </div>
                `;
            }

            const activateLabel = sorcName === "Hexenwerk" ? "Usa Dose"
                : sorcName === "Alquimia" ? "Attiva (1 Incr.)"
                : sorcName === "Sorte" ? (item.name === "Lettura" ? "Attiva (0 PE)" : `Tessi (1 PE +${item.lashes || 1} Staff.)`)
                : sorcName === "Porté" ? "Esegui"
                : "Attiva (1 PE)";

            const recipeSub = item.recipe ? `<div class="text-[11px] text-amber-300/90 italic bg-[#12101d] px-2 py-1 rounded border border-[#2a233d]"><b>Ricetta:</b> ${item.recipe} ${item.duration ? `• <b>Durata:</b> ${item.duration}` : ''}</div>` : '';

            itemsHtml += `
                <div class="bg-[#171626] border border-[#372d4c] p-3 rounded-xl space-y-1.5 flex flex-col justify-between">
                    <div class="space-y-1.5">
                        <div class="flex flex-wrap items-center justify-between gap-1 border-b border-[#292238] pb-1.5">
                            <div>
                                <b class="text-purple-200 text-xs md:text-sm font-bold">${item.name}</b>
                                <span class="text-[10px] text-purple-300 bg-purple-950/80 border border-purple-700/50 px-1.5 py-0.5 rounded ml-1">${item.type || 'Potere'}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                ${rightControlHtml}
                                <button onclick="activateSorceryPowerItem(${idx})" class="px-2 py-0.5 bg-purple-700 hover:bg-purple-600 text-white font-bold text-[11px] rounded shadow transition-all">
                                    ⚡ ${activateLabel}
                                </button>
                                ${removeBtn}
                            </div>
                        </div>
                        ${recipeSub}
                        <p class="text-gray-300 text-xs leading-relaxed">${item.desc}</p>
                    </div>
                </div>
            `;
        });

        const addBtn = `
            <button onclick="toggleAddSorceryPanel()" class="px-3 py-1 bg-purple-900/70 hover:bg-purple-800 border border-purple-500/60 rounded-lg text-purple-100 text-xs font-bold transition-all shadow-sm">
                + Aggiungi Potere (${currentSorc.powers.length} Ufficiali)
            </button>
        `;

        container.innerHTML = `
            <div class="sheet-card rounded-xl p-3.5 md:p-4 border-purple-500/30 bg-[#141320] space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#292238] pb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">🧪</span>
                        <div>
                            <div class="flex flex-wrap items-center gap-2">
                                <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-purple-300">Stregoneria: ${currentSorc.name} (${currentSorc.nation})</h3>
                                <span class="text-[10px] bg-[#1f1a30] text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-semibold">${currentSorc.source || 'Manuale Ufficiale'}</span>
                            </div>
                            <p class="text-[11px] text-gray-300 mt-0.5">${currentSorc.rulesSummary || currentSorc.description}</p>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="flex items-center gap-1 bg-[#1c182c] border border-purple-600/50 px-2 py-1 rounded-lg text-xs">
                            <span class="text-purple-300 font-bold text-[11px]">Grado Stregoneria:</span>
                            <select id="sel-sorcery-rank" onchange="setSorceryRank(this.value)" class="bg-[#0d0c14] border border-purple-500/50 rounded px-1.5 py-0.5 text-amber-300 font-extrabold text-xs outline-none">
                                ${[1, 2, 3, 4, 5].map(r => `<option value="${r}" ${r === sorcRank ? 'selected' : ''}>Grado ${r}</option>`).join('')}
                            </select>
                        </div>
                        ${addBtn}
                    </div>
                </div>

                ${dashboardHtml}

                <!-- FORM INLINE AGGIUNTA POTERE STREGONERIA CON ANTEPRIMA UFFICIALE -->
                <div id="add-sorcery-panel" class="hidden bg-[#1c182c] p-3 rounded-xl border border-purple-500/40 space-y-2.5">
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="flex-1 min-w-[240px]">
                            <label class="block text-xs text-purple-300 mb-1 font-semibold">Catalogo Ufficiale ${currentSorc.name} (${currentSorc.powers.length} poteri dai manuali):</label>
                            <select id="sel-new-sorcery-power" onchange="updateSorceryPowerPreview()" class="w-full bg-[#0d0c14] border border-[#433360] rounded-lg px-2.5 py-1.5 text-xs text-purple-200 outline-none">
                                <!-- Popolato dinamicamente da sorceriesDb -->
                            </select>
                        </div>
                        <div class="flex items-end gap-2 pt-4">
                            <button onclick="confirmAddSorceryPower()" class="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow">
                                Aggiungi alla Scheda
                            </button>
                            <button onclick="toggleAddSorceryPanel()" class="px-3 py-1.5 bg-[#252033] hover:bg-[#342c47] text-gray-300 text-xs rounded-lg">
                                Chiudi
                            </button>
                        </div>
                    </div>
                    <div id="sorcery-power-preview" class="bg-[#12101c] border border-[#2f2646] rounded-lg p-2.5 text-xs text-gray-300">
                        Seleziona un potere per leggerne gli effetti ufficiali completi.
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                    ${itemsHtml || '<p class="text-gray-400 italic col-span-2 text-center py-2">Nessun potere memorizzato. Clicca su "+ Aggiungi Potere" per selezionarne uno dal catalogo ufficiale.</p>'}
                </div>
            </div>
        `;

        populateSorceryPowersDropdown();
    }

    function toggleAddSorceryPanel() {
        const p = document.getElementById('add-sorcery-panel');
        if (p) {
            p.classList.toggle('hidden');
            if (!p.classList.contains('hidden')) {
                updateSorceryPowerPreview();
            }
        }
    }

    function populateSorceryPowersDropdown() {
        const sel = document.getElementById('sel-new-sorcery-power');
        if (!sel) return;
        sel.innerHTML = '';

        const sorcName = resolveOfficialSorceryName(character.sorcery, character.nation);
        const currentSorc = sorceriesDb.find(s => s.name === sorcName);
        const powers = (currentSorc && currentSorc.powers) ? currentSorc.powers : [];

        powers.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.name;
            const extraTag = p.trait ? ` • ${p.trait}` : (p.pact ? ` • ${p.pact}` : (p.juvenilia ? ` • ${p.juvenilia}` : ''));
            opt.innerText = `[${p.type}${extraTag}] ${p.name}`;
            sel.appendChild(opt);
        });
        updateSorceryPowerPreview();
    }

    function updateSorceryPowerPreview() {
        const sel = document.getElementById('sel-new-sorcery-power');
        const prev = document.getElementById('sorcery-power-preview');
        if (!sel || !prev) return;
        const sorcName = resolveOfficialSorceryName(character.sorcery, character.nation);
        const currentSorc = sorceriesDb.find(s => s.name === sorcName);
        const found = currentSorc && currentSorc.powers ? currentSorc.powers.find(p => p.name === sel.value) : null;
        if (!found) {
            prev.innerHTML = 'Seleziona un potere per leggerne gli effetti ufficiali.';
            return;
        }
        const recHtml = found.recipe ? `<div class="text-amber-300/90 text-[11px] italic mb-1"><b>Ricetta:</b> ${found.recipe} (${found.duration || 'Scena'})</div>` : '';
        prev.innerHTML = `
            <div class="font-bold text-purple-200 mb-0.5">${found.name} <span class="text-[10px] text-purple-400">(${found.type})</span></div>
            ${recHtml}
            <div class="text-gray-300 leading-relaxed">${found.desc}</div>
        `;
    }

    function confirmAddSorceryPower() {
        const sel = document.getElementById('sel-new-sorcery-power');
        if (!sel) return;
        const powerName = sel.value;
        const sorcName = resolveOfficialSorceryName(character.sorcery, character.nation);
        const currentSorc = sorceriesDb.find(s => s.name === sorcName);
        const found = currentSorc && currentSorc.powers ? currentSorc.powers.find(p => p.name === powerName) : null;

        if (found) {
            if (!character.sorceryItems) character.sorceryItems = [];
            character.sorceryItems.push({
                ...found,
                doses: found.doses || 1,
                rank: 1
            });
            renderSorcery();
            if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
            showS7Toast(`Potere ufficiale <b>${found.name}</b> (${sorcName}) aggiunto alla scheda!`, "success");
        }
    }

    function changeSorceryDose(idx, delta) {
        if (!character.sorceryItems || !character.sorceryItems[idx]) return;
        character.sorceryItems[idx].doses = Math.max(0, (character.sorceryItems[idx].doses || 0) + delta);
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    function removeSorceryItem(idx) {
        if (!character.sorceryItems) return;
        character.sorceryItems.splice(idx, 1);
        renderSorcery();
        if (typeof saveCharacterToVttToken === "function" && !window._s7LoadingFromToken) saveCharacterToVttToken();
    }

    // RENDER STORIE
    // RENDER STORIE DELL'EROE (AVANZAMENTO LIVELLO SECONDO IL MANUALE)
    function renderStories() {
        const container = document.getElementById('stories-list-container');
        if (!container) return;
        container.innerHTML = '';

        if (!character.stories || character.stories.length === 0) {
            container.innerHTML = `
                <div class="bg-[#101217] border border-dashed border-[#2b303d] rounded-xl p-5 text-center space-y-2">
                    <p class="text-gray-300 font-semibold text-xs">Nessuna Storia attiva al momento.</p>
                    <p class="text-[11px] text-gray-400 max-w-md mx-auto">
                        In 7th Sea l'Eroe avanza completando gli Atti della sua Storia Personale (Manuale pag. 159-160).
                        Clicca su <b class="text-amber-400">+ Nuova Storia</b> per impostare il Titolo, la Ricompensa e gli Atti necessari.
                    </p>
                </div>
            `;
            return;
        }

        character.stories.forEach((st, sIdx) => {
            const steps = st.steps || [];
            const totalCount = steps.length;
            const doneCount = steps.filter(s => s.done).length;
            const isComplete = totalCount > 0 && doneCount === totalCount;
            const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

            let stepsHtml = '';
            steps.forEach((step, stepIdx) => {
                const isDone = !!step.done;
                stepsHtml += `
                    <div onclick="toggleStoryStep(${sIdx}, ${stepIdx})" 
                         class="group flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${isDone ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-[#101217] border-[#242938] hover:border-amber-500/40 hover:bg-[#181b24] text-gray-200'}">
                        <div class="mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center text-xs font-bold transition-all ${isDone ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-gray-500 bg-[#1a1e2b] text-transparent group-hover:border-amber-400'}">
                            ✓
                        </div>
                        <div class="flex-1 text-xs select-none">
                            <span class="font-bold mr-1.5 ${isDone ? 'text-emerald-400' : 'text-amber-400/90'}">Atto ${stepIdx + 1}:</span>
                            <span class="${isDone ? 'line-through opacity-75' : ''}">${step.desc}</span>
                        </div>
                    </div>
                `;
            });

            const card = document.createElement('div');
            card.className = `bg-[#151722] border rounded-xl p-3.5 md:p-4 space-y-3 shadow-md transition-all ${isComplete ? 'border-emerald-500/50 shadow-emerald-950/20' : 'border-[#2c3242] hover:border-amber-500/40'}`;
            card.innerHTML = `
                <div class="flex flex-wrap items-start justify-between gap-2 border-b border-[#242938] pb-2.5">
                    <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="text-base">${isComplete ? '🏆' : '📜'}</span>
                            <h4 class="text-xs md:text-sm font-bold ${isComplete ? 'text-emerald-300' : 'text-amber-300'}">${st.title}</h4>
                            <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${isComplete ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}">
                                ${isComplete ? '🎉 Conclusa' : `🟡 In Corso (${doneCount}/${totalCount} Atti)`}
                            </span>
                        </div>
                        <p class="text-xs text-gray-300 flex items-center gap-1.5">
                            <span class="text-amber-400 font-semibold">🎁 Ricompensa:</span>
                            <span class="bg-[#101217] px-2 py-0.5 rounded text-amber-200 border border-[#2b303d] font-medium">${st.goal || 'Avanzamento'}</span>
                        </p>
                    </div>

                    <div class="flex items-center gap-1.5">
                        <button onclick="openEditStory(${sIdx})" class="px-2.5 py-1 bg-[#202532] hover:bg-[#2c3342] text-xs text-gray-300 hover:text-white rounded-lg border border-[#32394a] transition-all flex items-center gap-1" title="Modifica titolo, ricompensa o aggiungi nuovi atti">
                            <span>✏️</span> Modifica
                        </button>
                        <button onclick="removeStory(${sIdx})" class="px-2 py-1 bg-red-950/30 hover:bg-red-900/50 text-xs text-red-400 hover:text-red-300 rounded-lg border border-red-800/40 transition-all" title="Elimina storia">
                            🗑️
                        </button>
                    </div>
                </div>

                <!-- PROGRESS BAR -->
                <div class="space-y-1">
                    <div class="w-full bg-[#0d0e12] rounded-full h-1.5 overflow-hidden border border-[#232834]">
                        <div class="h-full transition-all duration-300 ${isComplete ? 'bg-emerald-400' : 'bg-amber-400'}" style="width: ${progressPct}%"></div>
                    </div>
                </div>

                <!-- LISTA ATTI / OBIETTIVI (SOLO QUELLI COMPILATI) -->
                <div class="space-y-1.5 pt-0.5">
                    ${stepsHtml}
                </div>

                ${isComplete ? `
                    <div class="bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 border border-emerald-500/40 rounded-xl p-2.5 flex items-center gap-2.5 text-xs text-emerald-200 shadow-inner">
                        <span class="text-lg">🎉</span>
                        <div>
                            <b>Storia Conclusa!</b> L'Eroe ha portato a termine tutti gli Atti e sblocca la Ricompensa: <span class="text-emerald-300 font-bold">${st.goal}</span>.
                        </div>
                    </div>
                ` : ''}
            `;
            container.appendChild(card);
        });
    }

    function toggleStoryStep(sIdx, stepIdx) {
        if (character.stories && character.stories[sIdx] && character.stories[sIdx].steps && character.stories[sIdx].steps[stepIdx]) {
            const step = character.stories[sIdx].steps[stepIdx];
            step.done = !step.done;
            const steps = character.stories[sIdx].steps;
            const allDone = steps.every(s => s.done);
            renderStories();
            if (step.done && allDone) {
                showS7Toast("🎉 Congratulazioni! Hai completato tutti gli Atti della Storia!", "success");
            } else if (step.done) {
                showS7Toast(`Atto ${stepIdx + 1} completato!`, "info");
            }
        }
    }

    function toggleNewStoryForm(show) {
        const f = document.getElementById('new-story-inline-form');
        if (!f) return;
        if (show === undefined) {
            f.classList.toggle('hidden');
        } else if (show) {
            f.classList.remove('hidden');
        } else {
            f.classList.add('hidden');
        }
    }

    function addNewStoryPrompt() {
        const editIdxInput = document.getElementById('inp-story-edit-index');
        if (editIdxInput) editIdxInput.value = '-1';
        const heading = document.getElementById('story-form-heading');
        if (heading) heading.innerHTML = '<span>📜</span> Componi Nuova Storia Personale';
        const btn = document.getElementById('btn-submit-story');
        if (btn) btn.innerHTML = '<span>✓</span> Salva e Avvia Storia';

        const t = document.getElementById('inp-story-title');
        const g = document.getElementById('inp-story-goal');
        if (t) t.value = '';
        if (g) g.value = '';
        for (let i = 1; i <= 5; i++) {
            const inp = document.getElementById(`inp-story-step-${i}`);
            if (inp) inp.value = '';
        }
        toggleNewStoryForm(true);
        t?.focus();
    }

    function openEditStory(sIdx) {
        if (!character.stories || !character.stories[sIdx]) return;
        const st = character.stories[sIdx];
        const editIdxInput = document.getElementById('inp-story-edit-index');
        if (editIdxInput) editIdxInput.value = String(sIdx);
        const heading = document.getElementById('story-form-heading');
        if (heading) heading.innerHTML = '<span>✏️</span> Modifica Storia Personale';
        const btn = document.getElementById('btn-submit-story');
        if (btn) btn.innerHTML = '<span>✓</span> Salva Modifiche';

        const t = document.getElementById('inp-story-title');
        const g = document.getElementById('inp-story-goal');
        if (t) t.value = st.title || '';
        if (g) g.value = st.goal || '';

        for (let i = 1; i <= 5; i++) {
            const inp = document.getElementById(`inp-story-step-${i}`);
            if (inp) {
                const existingStep = st.steps && st.steps[i - 1];
                inp.value = existingStep ? existingStep.desc : '';
            }
        }
        toggleNewStoryForm(true);
        const f = document.getElementById('new-story-inline-form');
        f?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function confirmAddNewStory() {
        const t = document.getElementById('inp-story-title');
        const g = document.getElementById('inp-story-goal');
        const editIdxInput = document.getElementById('inp-story-edit-index');
        const editIdx = editIdxInput ? parseInt(editIdxInput.value, 10) : -1;

        const title = t ? t.value.trim() : '';
        const goal = (g && g.value.trim()) ? g.value.trim() : 'Avanzamento Narrativo';

        if (!title) {
            showS7Toast("Inserisci un titolo per la Storia!", "error");
            t?.focus();
            return;
        }

        // Raccogli solo gli Atti effettivamente compilati (da 1 a 5)
        const compiledSteps = [];
        for (let i = 1; i <= 5; i++) {
            const inp = document.getElementById(`inp-story-step-${i}`);
            const val = inp ? inp.value.trim() : '';
            if (val.length > 0) {
                let wasDone = false;
                if (editIdx >= 0 && character.stories && character.stories[editIdx]) {
                    const oldSteps = character.stories[editIdx].steps || [];
                    const match = oldSteps.find(s => s.desc === val) || oldSteps[compiledSteps.length];
                    if (match && match.desc === val) {
                        wasDone = !!match.done;
                    }
                }
                compiledSteps.push({ desc: val, done: wasDone });
            }
        }

        if (compiledSteps.length === 0) {
            showS7Toast("Inserisci almeno il Primo Atto (Obiettivo 1) per la tua Storia!", "error");
            document.getElementById('inp-story-step-1')?.focus();
            return;
        }

        if (!character.stories) character.stories = [];

        const storyObj = {
            title: title,
            goal: goal,
            steps: compiledSteps
        };

        if (editIdx >= 0 && character.stories[editIdx]) {
            character.stories[editIdx] = storyObj;
            showS7Toast("Storia aggiornata con successo!", "success");
        } else {
            character.stories.push(storyObj);
            showS7Toast(`Nuova Storia avviata con ${compiledSteps.length} Atti!`, "success");
        }

        toggleNewStoryForm(false);
        renderStories();
    }

    function removeStory(sIdx) {
        if (!character.stories || !character.stories[sIdx]) return;
        const title = character.stories[sIdx].title || 'questa Storia';
        if (confirm(`Sei sicuro di voler eliminare o abbandonare "${title}"?`)) {
            character.stories.splice(sIdx, 1);
            renderStories();
            showS7Toast("Storia rimossa.", "info");
        }
    }


    // GESTIONE ELEVAZIONE Z-INDEX WIZARD DURANTE APERTURA MENU A TENDINA
    function updateDropdownWizardZIndex() {
        const wizardPanel = document.getElementById('creation-wizard-panel');
        if (!wizardPanel) return;
        const bg0 = document.getElementById('bg-custom-dropdown-0');
        const bg1 = document.getElementById('bg-custom-dropdown-1');
        const st = document.getElementById('style-custom-dropdown');
        const isAnyOpen = (bg0 && !bg0.classList.contains('hidden')) ||
                          (bg1 && !bg1.classList.contains('hidden')) ||
                          (st && !st.classList.contains('hidden'));
        if (isAnyOpen) {
            wizardPanel.classList.add('has-dropdown-open');
        } else {
            wizardPanel.classList.remove('has-dropdown-open');
        }
    }

    // STATI FILTRO PER SORGENTE MANUALE (Base / Vol. 1 / Vol. 2)
    let currentBgSourceFilter = { 0: 'all', 1: 'all' };
    let currentStyleSourceFilter = 'all';

    function setBgSourceFilter(slot, src) {
        currentBgSourceFilter[slot] = src;
        const container = document.getElementById(`bg-filter-pills-${slot}`);
        if (container) {
            const pills = container.querySelectorAll('.s7-cat-pill');
            pills.forEach(p => p.classList.remove('active'));
            const keyMap = { 'all': 'all', 'Base': 'base', 'Vol. 1': 'vol1', 'Vol. 2': 'vol2' };
            const activeId = `bg-pill-${slot}-${keyMap[src] || 'all'}`;
            const targetPill = document.getElementById(activeId);
            if (targetPill) targetPill.classList.add('active');
        }
        filterBgCustomDropdown(slot);
    }

    function setStyleSourceFilter(src) {
        currentStyleSourceFilter = src;
        const container = document.getElementById('style-filter-pills');
        if (container) {
            const pills = container.querySelectorAll('.s7-cat-pill');
            pills.forEach(p => p.classList.remove('active'));
            const keyMap = { 'all': 'all', 'Base': 'base', 'Vol. 1': 'vol1', 'Vol. 2': 'vol2' };
            const activeId = `style-pill-${keyMap[src] || 'all'}`;
            const targetPill = document.getElementById(activeId);
            if (targetPill) targetPill.classList.add('active');
        }
        filterStyleCustomDropdown();
    }

    // LOGICA MENU A TENDINA PERSONALIZZATO BACKGROUND & POPUP LATERALE HOVER
    function toggleBgCustomDropdown(slot) {
        const dd0 = document.getElementById('bg-custom-dropdown-0');
        const dd1 = document.getElementById('bg-custom-dropdown-1');
        const chev0 = document.getElementById('bg-custom-chevron-0');
        const chev1 = document.getElementById('bg-custom-chevron-1');
        
        const target = slot === 0 ? dd0 : dd1;
        const other = slot === 0 ? dd1 : dd0;
        const targetChev = slot === 0 ? chev0 : chev1;
        const otherChev = slot === 0 ? chev1 : chev0;

        if (other) other.classList.add('hidden');
        if (otherChev) otherChev.style.transform = 'rotate(0deg)';

        // Chiudi anche menu stili se aperto
        const stDd = document.getElementById('style-custom-dropdown');
        const stChev = document.getElementById('style-custom-chevron');
        if (stDd) stDd.classList.add('hidden');
        if (stChev) stChev.style.transform = 'rotate(0deg)';

        hideBgHoverPopup();

        if (target) {
            const isHidden = target.classList.contains('hidden');
            if (isHidden) {
                target.classList.remove('hidden');
                if (targetChev) targetChev.style.transform = 'rotate(180deg)';
                const searchInp = document.getElementById(`bg-search-inp-${slot}`);
                if (searchInp) {
                    searchInp.value = '';
                    filterBgCustomDropdown(slot, '');
                    setTimeout(() => searchInp.focus(), 50);
                }
            } else {
                target.classList.add('hidden');
                if (targetChev) targetChev.style.transform = 'rotate(0deg)';
            }
        }
        updateDropdownWizardZIndex();
    }

    function filterBgCustomDropdown(slot, query) {
        const inp = document.getElementById(`bg-search-inp-${slot}`);
        const q = (query !== undefined ? query : (inp ? inp.value : '')).toLowerCase().trim();
        const activeSrc = currentBgSourceFilter[slot] || 'all';
        const list = document.getElementById(`bg-custom-list-${slot}`);
        if (!list) return;

        const items = list.querySelectorAll('.bg-dropdown-item');
        items.forEach(el => {
            const isNone = el.hasAttribute('data-bg-none');
            if (isNone) {
                el.style.display = (!q || 'nessuno'.includes(q) || 'deseleziona'.includes(q)) ? '' : 'none';
                return;
            }
            const name = (el.getAttribute('data-bg-name') || '').toLowerCase();
            const nation = (el.getAttribute('data-bg-nation') || '').toLowerCase();
            const src = el.getAttribute('data-bg-source') || 'Base';

            const matchQuery = !q || name.includes(q) || nation.includes(q);
            const matchSrc = (activeSrc === 'all') || (src === activeSrc);

            if (matchQuery && matchSrc) {
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        });

        const headers = list.querySelectorAll('.bg-section-header');
        headers.forEach(h => {
            const hSrc = h.getAttribute('data-header-source');
            if (activeSrc !== 'all' && hSrc !== activeSrc) {
                h.style.display = 'none';
            } else {
                const visibleSiblings = list.querySelectorAll(`.bg-dropdown-item[data-bg-source="${hSrc}"]:not([style*="display: none"])`);
                h.style.display = visibleSiblings.length > 0 ? '' : 'none';
            }
        });
    }

    function selectBgCustom(slot, bgName) {
        const nativeSel = document.getElementById(`sel-bg${slot + 1}`);
        if (nativeSel) {
            nativeSel.value = bgName;
        }
        onBgChange(slot, bgName);

        const btnLabel = document.getElementById(`bg-custom-btn-label-${slot}`);
        if (btnLabel) {
            if (!bgName) {
                btnLabel.textContent = `-- Seleziona ${slot + 1}° Background --`;
                btnLabel.className = 'truncate text-gray-400';
            } else {
                const bg = backgroundsDb.find(b => b.name === bgName);
                btnLabel.textContent = `${bgName} (${bg ? (bg.nation || 'Generale') : 'Generale'})`;
                btnLabel.className = 'truncate text-amber-200 font-medium';
            }
        }

        const dd = document.getElementById(`bg-custom-dropdown-${slot}`);
        if (dd) dd.classList.add('hidden');
        const chev = document.getElementById(`bg-custom-chevron-${slot}`);
        if (chev) chev.style.transform = 'rotate(0deg)';
        hideBgHoverPopup();
        updateDropdownWizardZIndex();
    }

    function showBgHoverPopup(bgName, event) {
        const popup = document.getElementById('bg-hover-popup');
        if (!popup) return;
        const bg = backgroundsDb.find(b => b.name === bgName);
        if (!bg) {
            popup.classList.add('hidden');
            return;
        }

        let advsHtml = '';
        (bg.advantages || []).forEach(advName => {
            const cleanAdv = advName.replace(/\s*\([^)]*\)\s*$/, '').trim();
            const advObj = advantagesDb.find(a => {
                const aName = a.name.toLowerCase().replace(/['’]/g, "'").replace(/…|\.\.\./g, '').trim();
                const bName = advName.toLowerCase().replace(/['’]/g, "'").replace(/…|\.\.\./g, '').trim();
                const cName = cleanAdv.toLowerCase().replace(/['’]/g, "'").replace(/…|\.\.\./g, '').trim();
                if (aName === bName || aName === cName) return true;
                if (a.alias && (a.alias.toLowerCase().includes(bName) || bName.includes(a.alias.toLowerCase()))) return true;
                if ((bName === 'gioia di vivere' || bName === 'joie de vivre') && (aName === 'gioia di vivere' || aName === 'joie de vivre')) return true;
                if (bName.includes('non siamo poi') && aName.includes('non siamo poi')) return true;
                return false;
            });
            const costStr = advObj ? `${advObj.cost} pt` : '';
            const descStr = advObj ? (advObj.description || advObj.desc || '') : '';
            advsHtml += `
                <div class="bg-[#151822] p-1.5 rounded-lg border border-[#272e3d] space-y-0.5">
                    <div class="flex items-center justify-between text-xs">
                        <b class="text-amber-300 text-[11px]">⭐ ${advName}</b>
                        <span class="text-[9px] text-amber-400/90 bg-amber-500/10 px-1 rounded border border-amber-500/30">${costStr}</span>
                    </div>
                    <p class="text-[10px] text-gray-300 leading-tight">${descStr}</p>
                </div>
            `;
        });

        let skillsHtml = (bg.skills || []).map(s => 
            `<span class="px-1.5 py-0.5 rounded bg-[#161a25] text-amber-200 border border-[#2b3345] text-[10px] font-semibold">${s}</span>`
        ).join(' ');

        popup.innerHTML = `
            <div class="flex items-start justify-between gap-2 border-b border-[#232838] pb-1.5">
                <div>
                    <h4 class="text-xs md:text-sm font-bold text-amber-300 flex items-center gap-1.5">
                        <span>🎭</span> ${bg.name}
                    </h4>
                    <p class="text-[11px] text-gray-300 italic pt-0.5">${bg.desc || ''}</p>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#1a2030] text-amber-300 border border-amber-500/40 whitespace-nowrap">
                    ${bg.nation || 'Generale'}
                </span>
            </div>

            <div class="space-y-1">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">5 Abilità Gratuite:</span>
                <div class="flex flex-wrap gap-1">
                    ${skillsHtml}
                </div>
            </div>

            <div class="space-y-1">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">2 Vantaggi Gratuiti:</span>
                <div class="space-y-1">
                    ${advsHtml}
                </div>
            </div>

            <div class="bg-[#12151f] p-1.5 rounded-lg border border-amber-500/30 text-[10px] text-gray-300 space-y-0.5">
                <b class="text-amber-400 flex items-center gap-1">
                    <span>⚡</span> Peculiarità (Punti Eroe):
                </b>
                <p class="text-gray-300 leading-tight text-[10px]">${bg.quirk || ''}</p>
            </div>
        `;

        // Smart side positioning:
        const targetEl = event.currentTarget || event.target;
        const rect = targetEl.getBoundingClientRect();
        const popupWidth = 360;
        const popupHeight = 350;

        let left = rect.right + 12;
        if (left + popupWidth > window.innerWidth - 10) {
            left = rect.left - popupWidth - 12;
        }
        if (left < 10) left = 10;

        let top = rect.top - 15;
        if (top + popupHeight > window.innerHeight - 10) {
            top = window.innerHeight - popupHeight - 10;
        }
        if (top < 10) top = 10;

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        popup.classList.remove('hidden');
    }

    function hideBgHoverPopup() {
        const popup = document.getElementById('bg-hover-popup');
        if (popup) popup.classList.add('hidden');
    }

    // LOGICA MENU A TENDINA PERSONALIZZATO STILI DI DUELLO & POPUP LATERALE HOVER
    function toggleStyleCustomDropdown() {
        const dd = document.getElementById('style-custom-dropdown');
        const chev = document.getElementById('style-custom-chevron');
        // Chiudi eventuali dropdown background aperti
        [0, 1].forEach(slot => {
            const bgDd = document.getElementById(`bg-custom-dropdown-${slot}`);
            const bgChev = document.getElementById(`bg-custom-chevron-${slot}`);
            if (bgDd) bgDd.classList.add('hidden');
            if (bgChev) bgChev.style.transform = 'rotate(0deg)';
        });
        hideBgHoverPopup();

        if (dd) {
            const isHidden = dd.classList.contains('hidden');
            if (isHidden) {
                dd.classList.remove('hidden');
                if (chev) chev.style.transform = 'rotate(180deg)';
                const searchInp = document.getElementById('style-search-inp');
                if (searchInp) {
                    searchInp.value = '';
                    filterStyleCustomDropdown('');
                    setTimeout(() => searchInp.focus(), 50);
                }
            } else {
                dd.classList.add('hidden');
                if (chev) chev.style.transform = 'rotate(0deg)';
            }
        }
        updateDropdownWizardZIndex();
    }

    function filterStyleCustomDropdown(query) {
        const inp = document.getElementById('style-search-inp');
        const q = (query !== undefined ? query : (inp ? inp.value : '')).toLowerCase().trim();
        const activeSrc = currentStyleSourceFilter || 'all';
        const list = document.getElementById('style-custom-list');
        if (!list) return;

        const items = list.querySelectorAll('.style-dropdown-item');
        items.forEach(el => {
            const isNone = el.hasAttribute('data-style-none');
            if (isNone) {
                el.style.display = (!q || 'nessuno'.includes(q) || 'non duellante'.includes(q)) ? '' : 'none';
                return;
            }
            const name = (el.getAttribute('data-style-name') || '').toLowerCase();
            const nation = (el.getAttribute('data-style-nation') || '').toLowerCase();
            const weapons = (el.getAttribute('data-style-weapons') || '').toLowerCase();
            const man = (el.getAttribute('data-style-maneuver') || '').toLowerCase();
            const src = el.getAttribute('data-style-source') || 'Base';

            const matchQuery = !q || name.includes(q) || nation.includes(q) || weapons.includes(q) || man.includes(q);
            const matchSrc = (activeSrc === 'all') || (src === activeSrc);

            if (matchQuery && matchSrc) {
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        });

        const headers = list.querySelectorAll('.style-section-header');
        headers.forEach(h => {
            const hSrc = h.getAttribute('data-header-source');
            if (activeSrc !== 'all' && hSrc !== activeSrc) {
                h.style.display = 'none';
            } else {
                const visibleSiblings = list.querySelectorAll(`.style-dropdown-item[data-style-source="${hSrc}"]:not([style*="display: none"])`);
                h.style.display = visibleSiblings.length > 0 ? '' : 'none';
            }
        });
    }

    function selectStyleCustom(styleName) {
        const val = styleName || "Nessuna";
        onStyleChange(val);
        const dd = document.getElementById('style-custom-dropdown');
        if (dd) dd.classList.add('hidden');
        const chev = document.getElementById('style-custom-chevron');
        if (chev) chev.style.transform = 'rotate(0deg)';
        hideStyleHoverPopup();
        updateDropdownWizardZIndex();
    }

    function showStyleHoverPopup(styleName, event) {
        const popup = document.getElementById('bg-hover-popup');
        if (!popup) return;
        const st = duelingStylesDb[styleName];
        if (!st || styleName === "Nessuna") {
            popup.classList.add('hidden');
            return;
        }

        popup.innerHTML = `
            <div class="flex items-start justify-between gap-2 border-b border-[#232838] pb-1.5">
                <div>
                    <h4 class="text-xs md:text-sm font-bold text-amber-300 flex items-center gap-1.5">
                        <span>🤺</span> ${st.name}
                    </h4>
                    <p class="text-[10px] text-amber-400/90 font-semibold pt-0.5">📖 ${st.source || 'Manuale Base'}</p>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#1a2030] text-amber-300 border border-amber-500/40 whitespace-nowrap">
                    ${st.nation || 'Gilda'}
                </span>
            </div>

            <div class="space-y-1">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">🗡️ Armi Richieste:</span>
                <div class="bg-[#151822] px-2 py-1 rounded-lg border border-[#272e3d] text-[11px] text-amber-200 font-medium">
                    ${st.weapons || 'Qualsiasi arma'}
                </div>
            </div>

            <div class="space-y-1">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">🏛️ Tradizione & Lore:</span>
                <p class="text-[10.5px] text-gray-300 italic leading-snug">${st.lore || ''}</p>
            </div>

            <div class="bg-[#12151f] p-2 rounded-lg border border-amber-500/40 space-y-1">
                <div class="flex items-center justify-between gap-1">
                    <b class="text-amber-300 text-[11px] flex items-center gap-1">
                        <span>🌟</span> Bonus di Stile: ${st.maneuver}
                    </b>
                    <span class="text-[9px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-600/40 font-bold">${st.cost || ''}</span>
                </div>
                <p class="text-gray-200 leading-snug text-[10.5px]">${st.description || ''}</p>
            </div>
        `;

        const targetEl = event.currentTarget || event.target;
        const rect = targetEl.getBoundingClientRect();
        const popupWidth = 370;
        const popupHeight = 360;

        let left = rect.right + 12;
        if (left + popupWidth > window.innerWidth - 10) {
            left = rect.left - popupWidth - 12;
        }
        if (left < 10) left = 10;

        let top = rect.top - 15;
        if (top + popupHeight > window.innerHeight - 10) {
            top = window.innerHeight - popupHeight - 10;
        }
        if (top < 10) top = 10;

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        popup.classList.remove('hidden');
    }

    function hideStyleHoverPopup() {
        hideBgHoverPopup();
    }

    // Chiudi dropdown background e stili cliccando all'esterno
    document.addEventListener('click', (e) => {
        let changed = false;
        [0, 1].forEach(slot => {
            const wrapper = document.getElementById(`bg-selector-wrapper-${slot}`);
            const dd = document.getElementById(`bg-custom-dropdown-${slot}`);
            const chev = document.getElementById(`bg-custom-chevron-${slot}`);
            if (wrapper && dd && !wrapper.contains(e.target)) {
                if (!dd.classList.contains('hidden')) {
                    dd.classList.add('hidden');
                    if (chev) chev.style.transform = 'rotate(0deg)';
                    hideBgHoverPopup();
                    changed = true;
                }
            }
        });
        const stWrapper = document.getElementById('style-selector-wrapper');
        const stDd = document.getElementById('style-custom-dropdown');
        const stChev = document.getElementById('style-custom-chevron');
        if (stWrapper && stDd && !stWrapper.contains(e.target)) {
            if (!stDd.classList.contains('hidden')) {
                stDd.classList.add('hidden');
                if (stChev) stChev.style.transform = 'rotate(0deg)';
                hideStyleHoverPopup();
                changed = true;
            }
        }
        if (changed) {
            updateDropdownWizardZIndex();
        }
    });

    // POPOLA MENU A TENDINA (ORDINAMENTO CORRETTO E ZERO UNDEFINED)
    function populateDropdowns() {
        const selBg1 = document.getElementById('sel-bg1');
        const selBg2 = document.getElementById('sel-bg2');
        if (selBg1 && selBg2) {
            selBg1.innerHTML = '<option value="">-- Seleziona 1° Background --</option>';
            selBg2.innerHTML = '<option value="">-- Seleziona 2° Background --</option>';
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

            // Suddividi per manuale ufficiale
            const bgsBase = sortedBgs.filter(b => !b.source || (!b.source.includes('Vol. 1') && !b.source.includes('Vol. 2')));
            const bgsVol1 = sortedBgs.filter(b => b.source && b.source.includes('Vol. 1'));
            const bgsVol2 = sortedBgs.filter(b => b.source && b.source.includes('Vol. 2'));

            const renderBgItem = (b, slot, srcTag) => {
                const nat = b.nation || 'Generale';
                const safeName = b.name.replace(/'/g, "\\'");
                return `
                    <div onclick="selectBgCustom(${slot}, '${safeName}')" 
                         onmouseenter="showBgHoverPopup('${safeName}', event)" 
                         onmouseleave="hideBgHoverPopup()"
                         class="bg-dropdown-item px-3 py-2 cursor-pointer hover:bg-[#1a2030] hover:text-amber-300 text-gray-200 text-xs flex items-center justify-between transition-colors group"
                         data-bg-name="${escapeHtml(b.name)}" data-bg-nation="${escapeHtml(nat)}" data-bg-source="${srcTag}">
                        <span class="font-medium group-hover:text-amber-300">${escapeHtml(b.name)}</span>
                        <span class="text-[10px] px-1.5 py-0.2 rounded bg-[#151822] border border-[#2b3242] text-gray-400 group-hover:border-amber-500/40 group-hover:text-amber-300/80">${escapeHtml(nat)}</span>
                    </div>
                `;
            };

            // Popola menu a tendina personalizzati con intestazioni di sezione e anteprima hover
            [0, 1].forEach(slot => {
                const customList = document.getElementById(`bg-custom-list-${slot}`);
                if (customList) {
                    let html = `
                        <div onclick="selectBgCustom(${slot}, '')" onmouseenter="hideBgHoverPopup()" class="bg-dropdown-item px-3 py-2 cursor-pointer hover:bg-[#1a2030] text-gray-400 text-xs italic transition-colors" data-bg-none="true" data-bg-name="" data-bg-nation="">
                            -- Nessuno (Deseleziona) --
                        </div>
                        <div class="s7-dropdown-header-divider bg-section-header" data-header-source="Base">
                            <span>📖 MANUALE BASE</span>
                            <span class="text-[9px] text-amber-400/90 font-semibold">${bgsBase.length} background</span>
                        </div>
                        ${bgsBase.map(b => renderBgItem(b, slot, 'Base')).join('')}
                        <div class="s7-dropdown-header-divider bg-section-header" data-header-source="Vol. 1">
                            <span>⚔️ NAZIONI DI THÉAH VOL. 1</span>
                            <span class="text-[9px] text-amber-400/90 font-semibold">${bgsVol1.length} background</span>
                        </div>
                        ${bgsVol1.map(b => renderBgItem(b, slot, 'Vol. 1')).join('')}
                        <div class="s7-dropdown-header-divider bg-section-header" data-header-source="Vol. 2">
                            <span>🛡️ NAZIONI DI THÉAH VOL. 2</span>
                            <span class="text-[9px] text-amber-400/90 font-semibold">${bgsVol2.length} background</span>
                        </div>
                        ${bgsVol2.map(b => renderBgItem(b, slot, 'Vol. 2')).join('')}
                    `;
                    customList.innerHTML = html;
                }
            });
        }

        const selStyle = document.getElementById('sel-style');
        if (selStyle) {
            selStyle.innerHTML = '<option value="Nessuna">Nessuno Stile (Non Duellante)</option>';
            Object.values(duelingStylesDb).forEach(s => {
                if (s.name !== "Nessuna") {
                    const opt = document.createElement('option');
                    opt.value = s.name;
                    opt.innerText = `${s.name} (${s.nation || 'Gilda'})`;
                    selStyle.appendChild(opt);
                }
            });
        }

        const customStyleList = document.getElementById('style-custom-list');
        if (customStyleList) {
            const allStyles = Object.values(duelingStylesDb).filter(s => s.name !== "Nessuna");
            const stylesBase = allStyles.filter(s => !s.source || (!s.source.includes('Vol. 1') && !s.source.includes('Vol. 2')));
            const stylesVol1 = allStyles.filter(s => s.source && s.source.includes('Vol. 1'));
            const stylesVol2 = allStyles.filter(s => s.source && s.source.includes('Vol. 2'));

            const renderStyleItem = (s, srcTag, shortSrc) => {
                const nat = s.nation || 'Gilda';
                const safeName = s.name.replace(/'/g, "\\'");
                return `
                    <div onclick="selectStyleCustom('${safeName}')"
                         onmouseenter="showStyleHoverPopup('${safeName}', event)"
                         onmouseleave="hideStyleHoverPopup()"
                         class="style-dropdown-item px-3 py-2 cursor-pointer hover:bg-[#1a2030] hover:text-amber-300 text-gray-200 text-xs flex items-center justify-between transition-colors group"
                         data-style-name="${escapeHtml(s.name)}"
                         data-style-nation="${escapeHtml(nat)}"
                         data-style-weapons="${escapeHtml(s.weapons || '')}"
                         data-style-maneuver="${escapeHtml(s.maneuver || '')}"
                         data-style-source="${srcTag}">
                        <div class="flex flex-col min-w-0 pr-2">
                            <span class="font-bold group-hover:text-amber-300 truncate">🤺 ${escapeHtml(s.name)} <span class="text-[10px] font-normal text-amber-400/80">(${escapeHtml(s.maneuver)})</span></span>
                            <span class="text-[10px] text-gray-400 truncate">${escapeHtml(s.weapons || '')}</span>
                        </div>
                        <div class="flex items-center gap-1 flex-shrink-0">
                            <span class="text-[9px] px-1.5 py-0.2 rounded bg-[#151822] border border-[#2b3242] text-gray-400 group-hover:border-amber-500/40 group-hover:text-amber-300/80">${escapeHtml(nat)}</span>
                            <span class="text-[9px] px-1 py-0.2 rounded bg-amber-950/60 border border-amber-700/40 text-amber-300 font-semibold">${shortSrc}</span>
                        </div>
                    </div>
                `;
            };

            let stHtml = `
                <div onclick="selectStyleCustom('Nessuna')" onmouseenter="hideStyleHoverPopup()" class="style-dropdown-item px-3 py-2 cursor-pointer hover:bg-[#1a2030] text-gray-400 text-xs italic transition-colors" data-style-none="true" data-style-name="nessuna" data-style-nation="" data-style-weapons="" data-style-maneuver="">
                    -- Nessuno Stile (Non Duellante) --
                </div>
                <div class="s7-dropdown-header-divider style-section-header" data-header-source="Base">
                    <span>📖 MANUALE BASE</span>
                    <span class="text-[9px] text-amber-400/90 font-semibold">${stylesBase.length} stili</span>
                </div>
                ${stylesBase.map(s => renderStyleItem(s, 'Base', 'Base')).join('')}
                <div class="s7-dropdown-header-divider style-section-header" data-header-source="Vol. 1">
                    <span>⚔️ NAZIONI DI THÉAH VOL. 1</span>
                    <span class="text-[9px] text-amber-400/90 font-semibold">${stylesVol1.length} stili</span>
                </div>
                ${stylesVol1.map(s => renderStyleItem(s, 'Vol. 1', 'Vol.1')).join('')}
                <div class="s7-dropdown-header-divider style-section-header" data-header-source="Vol. 2">
                    <span>🛡️ NAZIONI DI THÉAH VOL. 2</span>
                    <span class="text-[9px] text-amber-400/90 font-semibold">${stylesVol2.length} stili</span>
                </div>
                ${stylesVol2.map(s => renderStyleItem(s, 'Vol. 2', 'Vol.2')).join('')}
            `;
            customStyleList.innerHTML = stHtml;
        }

        const selVirtue = document.getElementById('sel-virtue');
        const selHubris = document.getElementById('sel-hubris');
        if (selVirtue && selHubris) {
            selVirtue.innerHTML = '<option value="">-- Seleziona Virtù --</option>';
            selHubris.innerHTML = '<option value="">-- Seleziona Superbia --</option>';

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
            selAdv.innerHTML = '<option value="">-- Seleziona un Vantaggio da consultare o aggiungere --</option>';
            const sortedAdv = [...advantagesDb].sort((a, b) => (a.cost || 0) - (b.cost || 0) || a.name.localeCompare(b.name));
            sortedAdv.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.name;
                const tag = a.innate ? '🧬 [Innato] ' : '';
                opt.innerText = `${tag}[${a.cost || 0} pt] ${a.name}`;
                selAdv.appendChild(opt);
            });
        }

        populateNationTraitsDropdown(character.nation || "");
        updateAdvantagePreview("");
    }

    // LOGICA ROLLER DEI RISCHI (7TH SEA 2E) CON AUTOMAZIONE GRADO 3, 4 E 5
    let currentRollState = null;

    function rollRisk() {
        const tVal = (character.traits && character.traits[selectedTrait]) || 2;
        const sVal = (character.skills && character.skills[selectedSkill]) || 0;
        const bonusDie = (character.dramaticWounds && character.dramaticWounds[0]) ? 1 : 0;
        const advBonus = getActiveAdvantageBonusDice();
        const mod = customDiceModifier || 0;
        const totalDice = tVal + sVal + bonusDie + advBonus + mod;

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
        const targetName = activeHeroTarget ? activeHeroTarget.name : null;
        const targetBonus = activeHeroTarget ? activeHeroTarget.bonus : 0;

        currentRollState = {
            traitName: selectedTrait,
            traitVal: tVal,
            skillName: selectedSkill,
            skillVal: sVal,
            bonusDie: bonusDie,
            advBonus: advBonus,
            customDiceModifier: mod,
            targetHeroName: targetName,
            targetHeroBonus: targetBonus,
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
            try {
                window.seventhSeaRules.broadcastRiskRollToVttChat(character.name || 'Eroe', {
                    traitName: currentRollState.traitName,
                    traitVal: currentRollState.traitVal,
                    skillName: currentRollState.skillName,
                    skillVal: currentRollState.skillVal,
                    dwBonus: currentRollState.bonusDie,
                    extraBonus: currentRollState.advBonus,
                    customModifier: currentRollState.customDiceModifier,
                    targetHeroName: currentRollState.targetHeroName,
                    targetHeroBonus: currentRollState.targetHeroBonus,
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
            } catch (bErr) {
                console.warn('[7thSea Sheet] Errore broadcast rischio:', bErr);
            }

            // Auto-reset del bersaglio e del modificatore dadi subito dopo il tiro
            if (activeHeroTarget) {
                customDiceModifier = activeHeroTarget.prevModifier || 0;
                activeHeroTarget = null;
                updateCustomDiceModifierUI();
                updatePoolFormula();
                renderHeroEnemyBonusWidget();
            }
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
                        ${currentRollState.targetHeroName ? `<span class="text-[10px] font-bold text-purple-200 bg-purple-900/80 border border-purple-500 px-2 py-0.5 rounded shadow" title="Dadi nemici applicati contro questo Eroe">🎯 vs ${escapeHtml(currentRollState.targetHeroName)} (+${currentRollState.targetHeroBonus} Nemici)</span>` : ''}
                        ${currentRollState.instituteName ? `<span class="text-[10px] text-amber-300 bg-amber-950/80 border border-amber-500 px-2 py-0.5 rounded font-bold" title="+1 a tutti i dadi">🏛️ ${currentRollState.instituteName} (+1)</span>` : ''}
                        ${currentRollState.customDiceModifier > 0 ? `<span class="text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-600 px-2 py-0.5 rounded font-bold">+${currentRollState.customDiceModifier} Bonus</span>` : (currentRollState.customDiceModifier < 0 ? `<span class="text-[10px] text-rose-300 bg-rose-950/80 border border-rose-600 px-2 py-0.5 rounded font-bold">${currentRollState.customDiceModifier} Malus</span>` : '')}
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

    // PUNTI RICCHEZZA
    function changeWealth(delta) {
        character.wealth = Math.max(0, (character.wealth || 0) + delta);
        const wEl = document.getElementById('wealth-points');
        if (wEl) wEl.innerText = character.wealth;
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
        const isDuro = isDuroDaUccidere();
        const maxFD = isDuro ? 5 : 4;
        const idx = num - 1;
        const currentlyActive = !!character.dramaticWounds[idx];
        const curNormal = (parseInt(character.currentWounds) || 0) % 5;

        if (currentlyActive) {
            // Disattiva da questo livello in su (scendere a mano)
            for (let i = idx; i < 5; i++) {
                character.dramaticWounds[i] = false;
            }
            const newActiveFD = idx;
            character.currentWounds = (newActiveFD * 5) + curNormal;
            showS7Toast(`Ferita Drammatica ${num}ª rimossa a mano. Ferite totali: ${character.currentWounds}`, "info");
        } else {
            // Attiva fino a questo livello compreso
            for (let i = 0; i <= idx; i++) {
                character.dramaticWounds[i] = true;
            }
            const newActiveFD = num;
            character.currentWounds = (newActiveFD * 5) + (newActiveFD === maxFD ? 0 : curNormal);
            showS7Toast(`Ferita Drammatica ${num}ª attivata a mano. Ferite totali: ${character.currentWounds}`, "warning");
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

        renderHeroEnemyBonusWidget();
        if (window.seventhSeaCompendium && typeof window.seventhSeaCompendium.refreshEnemyBonusWidget === 'function') {
            window.seventhSeaCompendium.refreshEnemyBonusWidget();
        }
    }

    function addWound(delta) {
        let current = parseInt(character.currentWounds) || 0;
        const isDuro = isDuroDaUccidere();
        const maxWounds = isDuro ? 25 : 20;
        current = Math.max(0, Math.min(maxWounds, current + delta));
        character.currentWounds = current;

        if (!character.dramaticWounds) character.dramaticWounds = [false, false, false, false, false];
        while (character.dramaticWounds.length < 5) character.dramaticWounds.push(false);

        // Attiva o disattiva le Ferite Drammatiche in base alle soglie (a 5, 10, 15, 20 o 25 ferite)
        const dwThresholds = isDuro ? [5, 10, 15, 20, 25] : [5, 10, 15, 20];
        dwThresholds.forEach((th, idx) => {
            if (current >= th) {
                if (!character.dramaticWounds[idx] && delta > 0) {
                    showS7Toast(`💥 Raggiunta la ${idx + 1}ª Ferita Drammatica (${current} ferite totali)!`, "danger");
                }
                character.dramaticWounds[idx] = true;
            } else {
                // Quando si scende sotto la soglia (guarigione o -1), la FD si deseleziona automaticamente
                character.dramaticWounds[idx] = false;
            }
        });

        updateDramaticWoundsUI();
        updateWoundsUI();
        updatePoolFormula();
    }

    function clearNormalWounds() {
        const total = parseInt(character.currentWounds) || 0;
        const curNormal = total % 5;
        let activeCount = 0;
        (character.dramaticWounds || []).forEach(w => { if (w) activeCount++; });

        if (curNormal > 0) {
            // Fine Scena d'Azione standard: azzera le ferite ordinarie parziali (0..4), preservando le Ferite Drammatiche
            character.currentWounds = activeCount * 5;
            updateWoundsUI();
            showS7Toast("Fine Scena: ferite ordinarie azzerate (preservate le Ferite Drammatiche).", "info");
        } else if (activeCount > 0) {
            // Se le ferite ordinarie sono già a 0, un clic su Azzera guarisce completamente anche le Ferite Drammatiche
            character.currentWounds = 0;
            character.dramaticWounds = [false, false, false, false, false];
            updateDramaticWoundsUI();
            updateWoundsUI();
            updatePoolFormula();
            showS7Toast("Eroe completamente risanato: tutte le Ferite e Ferite Drammatiche azzerate!", "success");
        } else {
            character.currentWounds = 0;
            updateWoundsUI();
            showS7Toast("Salute già al massimo (0 Ferite subite).", "info");
        }
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
        renderHeroEnemyBonusWidget();
        const hpEl = document.getElementById('hero-points');
        if (hpEl) hpEl.innerText = character.heroPoints || 2;
        const wEl = document.getElementById('wealth-points');
        if (wEl) wEl.innerText = character.wealth !== undefined ? character.wealth : 0;
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
        toggleAddSorceryPanel, populateSorceryPowersDropdown, updateSorceryPowerPreview, confirmAddSorceryPower,
        changeSorceryDose, removeSorceryItem, activateSorceryPowerItem,
        setSorceryRank, changeSorceryCorruption, resolveOfficialSorceryName, normalizeCharacterSorceryState,
        toggleHexenwerkHexeParts, distillHexenwerkUnguents, decayHexenwerkEndEpisode,
        setGlamourKnight, changeGlamourSpellRank, changeGrailDebt, rollGrailDebtCheck, toggleSidheCurse, toggleGlamourIncarnation,
        setMatushkaAnimal, addMatushkaLesson, updateMatushkaLessonField, toggleMatushkaLessonBroken, removeMatushkaLesson,
        addPorteBloodMark, removePorteBloodMark, executePorteAction,
        setSanderisPact, setSanderisDievasName, changeSanderisDebt, toggleSanderisSeventhPact,
        changeSorteLashes, removeSorteLashByBlood, removeSorteLashByMisfortune, toggleSorteUntrained,
        toggleAlquimiaJuvenilia, toggleAlquimiaLaboratorium, setAlquimiaMagnaOpera,
        setGaldrSelectedRune, activateGaldrRuneInvocation,
        setTuraMarkLocation, setTuraTask, changeTuraTaskActs,
        renderStories, toggleStoryStep, toggleNewStoryForm,
        addNewStoryPrompt, openEditStory, confirmAddNewStory, removeStory,
        onNationChange, onNationTraitChange, onBgChange, updateBgDisplays, toggleBgCustomDropdown, filterBgCustomDropdown, selectBgCustom, setBgSourceFilter, showBgHoverPopup, hideBgHoverPopup,
        onStyleChange, toggleStyleCustomDropdown, filterStyleCustomDropdown, selectStyleCustom, setStyleSourceFilter, showStyleHoverPopup, hideStyleHoverPopup,
        setDrexelGuard, setStudiosoManeuverChoice, resetDuelManeuverLock, switchActiveDuelingStyle, activateVeronicaInganno, computeManeuverEffectForHero, executeDuelManeuver,
        onSorceryChange, onVirtueChange, onHubrisChange,
        toggleAddAdvantagePanel, toggleAdvSourceType, populateAdvDuelStylePicker, onNewAdvSelectChange, updateAdvantagePreview, confirmAddAdvantage, confirmAddCustomAdvantage, removeAdvantage,
        populateDropdowns, rollRisk, rerollRiskDie, autoRerollWorstRiskDie, rerollWithDevilsLuck, spendRaise, resetDice,
        adjustCustomDiceModifier, resetCustomDiceModifier, updateCustomDiceModifierUI,
        changeHeroPoints, changeWealth, triggerHubris, toggleDramaticWound, renderDramaticWoundsGrid,
        updateDramaticWoundsUI, addWound, clearNormalWounds,
        updateWoundsUI, renderSeventhSeaSheet,
        toggleHeroTarget, cancelHeroTarget, renderHeroEnemyBonusWidget, isGMClient,
        getCharacter: () => character, getCustomDiceModifier: () => customDiceModifier, getActiveHeroTarget: () => activeHeroTarget, isDuroDaUccidere, isSoloControTutti,
        getDuelingStylesDb: () => duelingStylesDb, getBasicManeuversDb: () => basicManeuversDb, getAdvantagesDb: () => advantagesDb, getBackgroundsDb: () => backgroundsDb, getSorceriesDb: () => sorceriesDb
    };
    Object.assign(window, exportedFns);

    function loadTokenIntoS7Sheet(token) {
        if (!token) return;
        window._s7LoadingFromToken = true;
        customDiceModifier = 0;
        updateCustomDiceModifierUI();
        try {
            if (token.pcSheet && token.pcSheet.traits && typeof token.pcSheet.traits === 'object') {
                character = JSON.parse(JSON.stringify(token.pcSheet));
                if (character.wealth === undefined) character.wealth = 0;
                normalizeCharacterDuelingState(character);
                normalizeCharacterSorceryState(character);
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

        loadHeroData(pcData) {
            const win = ensureS7ModalDOM();
            win.style.display = 'flex';
            loadHeroData(pcData);
        },

        changeWealth,
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
