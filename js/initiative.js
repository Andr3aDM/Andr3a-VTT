function escapeHTML(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));
}
// Gestione Party (Salvato in localStorage globale)
let party = JSON.parse(localStorage.getItem('dnd_party') || '[]');

function renderPartyList() {
    const list = document.getElementById('party-list');
    list.innerHTML = '';
    party.forEach((name, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.marginBottom = '5px';
        li.style.background = '#444';
        li.style.padding = '5px';
        li.style.borderRadius = '3px';
        
        li.innerHTML = `<span>${escapeHTML(name)}</span> <button style="background:red; color:white; border:none; border-radius:3px; cursor:pointer;" onclick="removePartyMember(${index})">X</button>`;
        list.appendChild(li);
    });
}

function removePartyMember(index) {
    party.splice(index, 1);
    localStorage.setItem('dnd_party', JSON.stringify(party));
    renderPartyList();
    if (typeof window.getSelectedTargetTokens === 'function') {
        const targets = window.getSelectedTargetTokens();
        if (targets.length > 0 && typeof window.updateSelectedTokenControls === 'function') {
            window.updateSelectedTokenControls(targets[targets.length - 1]);
        }
    }
}

document.getElementById('btn-add-player').addEventListener('click', () => {
    const nameInput = document.getElementById('new-player-name');
    const name = nameInput.value.trim();
    if (name) {
        if (!party.some(p => p.trim().toLowerCase() === name.toLowerCase())) {
            party.push(name);
            localStorage.setItem('dnd_party', JSON.stringify(party));
        }
        nameInput.value = '';
        renderPartyList();
        if (typeof window.getSelectedTargetTokens === 'function') {
            const targets = window.getSelectedTargetTokens();
            if (targets.length > 0 && typeof window.updateSelectedTokenControls === 'function') {
                window.updateSelectedTokenControls(targets[targets.length - 1]);
            }
        }
    }
});

// Tracker Iniziativa Logic
engine.initiative = {
    active: false,
    currentTurnIndex: 0,
    participants: [],
    isVisibleToPlayers: true,
    playerPosition: 'top' // top, bottom, left, right
};

const trackerDiv = document.getElementById('dm-tracker');
const header = document.getElementById('dm-tracker-header');
const expandedTrackerGroups = new Set();
let savedTrackerHeight = '420px';

function clampTrackerToViewport() {
    if (!trackerDiv || trackerDiv.style.display === 'none') return;
    const vw = window.innerWidth || 1000;
    const vh = window.innerHeight || 700;
    const rect = trackerDiv.getBoundingClientRect();
    let newLeft = rect.left;
    let newTop = rect.top;
    if (newLeft + 80 > vw) newLeft = Math.max(10, vw - rect.width - 10);
    if (newLeft < 0) newLeft = 10;
    if (newTop + 45 > vh) newTop = Math.max(10, vh - 80);
    if (newTop < 0) newTop = 10;
    trackerDiv.style.left = newLeft + 'px';
    trackerDiv.style.top = newTop + 'px';
    trackerDiv.style.right = 'auto';
}

window.addEventListener('resize', clampTrackerToViewport);

// Dragging for Tracker (PC mouse + Tablet touch)
let isDraggingTracker = false;
let trackerOffsetX = 0;
let trackerOffsetY = 0;

header.style.touchAction = 'none';

header.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
    isDraggingTracker = true;
    trackerOffsetX = e.clientX - trackerDiv.getBoundingClientRect().left;
    trackerOffsetY = e.clientY - trackerDiv.getBoundingClientRect().top;
});
header.addEventListener('touchstart', (e) => {
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
    if (!e.touches || e.touches.length !== 1) return;
    if (e.cancelable) e.preventDefault();
    isDraggingTracker = true;
    trackerOffsetX = e.touches[0].clientX - trackerDiv.getBoundingClientRect().left;
    trackerOffsetY = e.touches[0].clientY - trackerDiv.getBoundingClientRect().top;
}, { passive: false });

document.addEventListener('mousemove', (e) => {
    if (!isDraggingTracker) return;
    const vw = window.innerWidth || 1000;
    const vh = window.innerHeight || 700;
    const nextX = Math.max(0, Math.min(vw - 80, e.clientX - trackerOffsetX));
    const nextY = Math.max(0, Math.min(vh - 45, e.clientY - trackerOffsetY));
    trackerDiv.style.left = nextX + 'px';
    trackerDiv.style.top = nextY + 'px';
    trackerDiv.style.right = 'auto'; // override default right:20px
});
document.addEventListener('touchmove', (e) => {
    if (!isDraggingTracker || !e.touches || e.touches.length !== 1) return;
    if (e.cancelable) e.preventDefault();
    const vw = window.innerWidth || 1000;
    const vh = window.innerHeight || 700;
    const nextX = Math.max(0, Math.min(vw - 80, e.touches[0].clientX - trackerOffsetX));
    const nextY = Math.max(0, Math.min(vh - 45, e.touches[0].clientY - trackerOffsetY));
    trackerDiv.style.left = nextX + 'px';
    trackerDiv.style.top = nextY + 'px';
    trackerDiv.style.right = 'auto';
}, { passive: false });

document.addEventListener('mouseup', () => isDraggingTracker = false);
document.addEventListener('touchend', () => isDraggingTracker = false);
document.addEventListener('touchcancel', () => isDraggingTracker = false);

document.getElementById('btn-toggle-tracker').addEventListener('click', () => {
    if (trackerDiv.style.display === 'none') {
        trackerDiv.style.display = 'flex';
        clampTrackerToViewport();
        if (!engine.initiative.active) {
            setupInitiative();
        } else {
            renderTrackerList();
        }
    } else {
        trackerDiv.style.display = 'none';
    }
});

const btnReloadTracker = document.getElementById('btn-tracker-reload-selection');
if (btnReloadTracker) {
    btnReloadTracker.addEventListener('click', () => {
        setupInitiative();
        if (typeof showToast === 'function') showToast('Selezione ricaricata nel tracker.');
        if (typeof syncState === 'function') syncState();
    });
}

document.getElementById('btn-close-tracker').addEventListener('click', () => {
    trackerDiv.style.display = 'none';
});

const groupSimilarCheckbox = document.getElementById('tracker-group-similar');
if (groupSimilarCheckbox) {
    groupSimilarCheckbox.addEventListener('change', () => {
        const rollModeEl = document.getElementById('tracker-monster-roll-mode');
        if (rollModeEl) {
            rollModeEl.value = groupSimilarCheckbox.checked ? 'group' : 'individual';
        }
        renderTrackerList();
    });
}

function getParticipantBaseName(name) {
    if (!name) return 'Token';
    return String(name).replace(/\s+\d+$/, '').trim() || String(name).trim() || 'Token';
}

function resolveParticipantToken(p) {
    if (!p || typeof engine === 'undefined' || !engine) return null;
    const tokens = Array.isArray(engine.tokens) ? engine.tokens : [];
    if (p.tokenId) {
        const cleanId = String(p.tokenId).replace(/^tok_/, '');
        const byId = tokens.find(t => String(t.id) === String(p.tokenId) || String(t.id) === cleanId);
        if (byId) return byId;
    }
    const pName = (p.name || '').trim().toLowerCase();
    if (!pName) return null;
    const pBase = getParticipantBaseName(p.name).toLowerCase();
    const byExact = tokens.find(t => (t.name || '').trim().toLowerCase() === pName);
    if (byExact) return byExact;
    const byBase = tokens.find(t => getParticipantBaseName(t.name || t.originalName || '').toLowerCase() === pBase);
    if (byBase) return byBase;
    if (typeof currentCampaignTokens !== 'undefined' && Array.isArray(currentCampaignTokens)) {
        const campMatch = currentCampaignTokens.find(ct => {
            const cName = (ct.name || '').trim().toLowerCase();
            return cName === pName || getParticipantBaseName(ct.name || '').toLowerCase() === pBase;
        });
        if (campMatch) return campMatch;
    }
    return null;
}

function isParticipantPG(p, tok = null) {
    if (!p) return false;
    if (String(p.id || '').startsWith('pg_')) return true;
    const pName = (p.name || '').trim().toLowerCase();
    if (pName && Array.isArray(party) && party.some(x => String(x || '').trim().toLowerCase() === pName)) {
        return true;
    }
    const resolved = tok || resolveParticipantToken(p);
    if (resolved) {
        if (resolved.isEvocation) return false;
        if (resolved.category === 'personaggi' || !!resolved.pcSheet) return true;
        if (!resolved.statblock && resolved.category !== 'mostri' && resolved.category !== 'png') {
            const hasOwner = (Array.isArray(resolved.owners) && resolved.owners.length > 0) || (resolved.owner && String(resolved.owner).trim().length > 0);
            if (hasOwner) return true;
        }
    }
    return false;
}

function getParticipantInitStats(p, tok = null) {
    const resolved = tok || resolveParticipantToken(p);
    if (resolved) {
        if (resolved.pcSheet) {
            const pc = resolved.pcSheet;
            let dexScore = Number(pc.abilities?.dex?.score);
            let dexMod = Number(pc.abilities?.dex?.mod);
            if (isNaN(dexScore)) dexScore = !isNaN(dexMod) ? (10 + dexMod * 2) : 10;
            if (isNaN(dexMod)) dexMod = Math.floor((dexScore - 10) / 2);
            const initMod = (pc.initBonus !== undefined && pc.initBonus !== null && !isNaN(Number(pc.initBonus)))
                ? Number(pc.initBonus)
                : dexMod;
            return { initMod, dexMod, dexScore };
        }
        if (resolved.statblock) {
            const sb = resolved.statblock;
            const dexScore = (sb.dexterity !== undefined && sb.dexterity !== null && !isNaN(Number(sb.dexterity)))
                ? Number(sb.dexterity)
                : 10;
            const dexMod = Math.floor((dexScore - 10) / 2);
            let initMod = dexMod;
            if (sb.initiative_bonus !== undefined && sb.initiative_bonus !== null && !isNaN(Number(sb.initiative_bonus))) {
                initMod = Number(sb.initiative_bonus);
            } else if (sb.initiative) {
                const mInit = String(sb.initiative).match(/([+-]?\d+)/);
                if (mInit) initMod = parseInt(mInit[1], 10);
            }
            return { initMod, dexMod, dexScore };
        }
        const dexScore = (resolved.dexterity !== undefined && !isNaN(Number(resolved.dexterity))) ? Number(resolved.dexterity) : 10;
        const dexMod = (resolved.dexMod !== undefined && !isNaN(Number(resolved.dexMod))) ? Number(resolved.dexMod) : Math.floor((dexScore - 10) / 2);
        const initMod = (resolved.initBonus !== undefined && !isNaN(Number(resolved.initBonus))) ? Number(resolved.initBonus) : dexMod;
        return { initMod, dexMod, dexScore };
    }
    return { initMod: 0, dexMod: 0, dexScore: 10 };
}

function sortInitiativeParticipants() {
    if (!engine.initiative || !Array.isArray(engine.initiative.participants)) return;
    engine.initiative.participants.forEach(p => {
        if (p._dexScore === undefined || p._initMod === undefined) {
            const st = getParticipantInitStats(p);
            p._initMod = st.initMod;
            p._dexScore = st.dexScore;
        }
    });
    engine.initiative.participants.sort((a, b) => {
        const hasA = a.init !== '' && a.init !== null && a.init !== undefined && !isNaN(parseFloat(a.init));
        const hasB = b.init !== '' && b.init !== null && b.init !== undefined && !isNaN(parseFloat(b.init));
        if (hasA && !hasB) return -1;
        if (!hasA && hasB) return 1;
        if (!hasA && !hasB) return 0;

        const valA = parseFloat(a.init) || 0;
        const valB = parseFloat(b.init) || 0;
        if (valB !== valA) return valB - valA;

        const baseA = getParticipantBaseName(a.name).toLowerCase();
        const baseB = getParticipantBaseName(b.name).toLowerCase();
        if (baseA === baseB) {
            const numA = parseInt((String(a.name || '').match(/\s+(\d+)$/) || [])[1], 10) || 0;
            const numB = parseInt((String(b.name || '').match(/\s+(\d+)$/) || [])[1], 10) || 0;
            if (numA !== numB) return numA - numB;
        }

        const dexA = a._dexScore !== undefined ? a._dexScore : 10;
        const dexB = b._dexScore !== undefined ? b._dexScore : 10;
        if (dexB !== dexA) return dexB - dexA;

        const modA = a._initMod !== undefined ? a._initMod : 0;
        const modB = b._initMod !== undefined ? b._initMod : 0;
        if (modB !== modA) return modB - modA;

        return (b._tieBreak || 0) - (a._tieBreak || 0);
    });
}

window.autoRollInitiative = function(includePCs = false) {
    if (!engine.initiative) return;
    if (!Array.isArray(engine.initiative.participants) || engine.initiative.participants.length === 0) {
        setupInitiative();
    } else if (engine.selectedTokens && engine.selectedTokens.size > 0 && Array.isArray(engine.tokens)) {
        // Assicura che eventuali nuovi token selezionati sulla mappa siano presenti nel tracker
        engine.tokens.forEach(t => {
            if (!engine.selectedTokens.has(t.id)) return;
            const alreadyIn = engine.initiative.participants.some(p => String(p.tokenId) === String(t.id));
            if (!alreadyIn) {
                engine.initiative.participants.push({
                    id: 'tok_' + t.id,
                    name: typeof window.getSmartTokenName === 'function' ? window.getSmartTokenName(t) : (t.name || 'Token'),
                    isToken: true,
                    tokenId: t.id,
                    isHidden: !t.visible,
                    init: '',
                    hpCurrent: t.hpCurrent,
                    hpMax: t.hpMax,
                    ac: t.ac || 0
                });
            }
        });
    }

    if (!engine.initiative.participants || engine.initiative.participants.length === 0) {
        if (typeof showToast === 'function') showToast('Nessuna entità presente nel Tracker Iniziativa!');
        return;
    }

    const useGrouping = document.getElementById('tracker-group-similar')
        ? document.getElementById('tracker-group-similar').checked
        : true;

    const groupRolls = new Map();
    let rolledCount = 0;

    engine.initiative.participants.forEach(p => {
        const tok = resolveParticipantToken(p);
        const isPG = isParticipantPG(p, tok);
        const stats = getParticipantInitStats(p, tok);
        p._initMod = stats.initMod;
        p._dexScore = stats.dexScore;

        if (!includePCs && isPG) {
            return; // Escludi i PG: mantengono il loro valore manuale o tiro scheda
        }

        if (useGrouping && !isPG) {
            const groupKey = getParticipantBaseName(p.name).toLowerCase();
            if (!groupRolls.has(groupKey)) {
                const d20 = Math.floor(Math.random() * 20) + 1;
                groupRolls.set(groupKey, {
                    total: d20 + stats.initMod,
                    tieBreak: Math.random()
                });
            }
            const gRoll = groupRolls.get(groupKey);
            p.init = gRoll.total;
            p._tieBreak = gRoll.tieBreak;
        } else {
            const d20 = Math.floor(Math.random() * 20) + 1;
            p.init = d20 + stats.initMod;
            p._tieBreak = Math.random();
        }
        rolledCount++;
    });

    sortInitiativeParticipants();
    if (engine.initiative.active) {
        engine.initiative.currentTurnIndex = 0;
    }
    renderTrackerList();
    if (typeof syncState === 'function') syncState();

    if (typeof showToast === 'function') {
        const modeLbl = includePCs ? 'Tutti (Inclusi PG)' : 'Solo Mostri/PNG (Esclusi PG)';
        const grpLbl = useGrouping ? 'condivisa per gruppo' : 'individuale';
        showToast(`🎲 Auto-Roll Iniziativa [${modeLbl} - ${grpLbl}]: ${rolledCount} tiri effettuati!`);
    }
};

function setupInitiative() {
    engine.initiative.participants = [];
    
    // Aggiungi Party
    party.forEach(p => {
        engine.initiative.participants.push({
            id: 'pg_' + Date.now() + Math.random(),
            name: p,
            isToken: false,
            tokenId: null,
            isHidden: false,
            init: ''
        });
    });
    
    // Aggiungi Tokens (Filtro selezione intelligente)
    const hasSelection = engine.selectedTokens && engine.selectedTokens.size > 0;
    
    engine.tokens.forEach((t, i) => {
        if (hasSelection && !engine.selectedTokens.has(t.id)) return;
        
        engine.initiative.participants.push({
            id: 'tok_' + t.id,
            name: window.getSmartTokenName(t),
            isToken: true,
            tokenId: t.id,
            isHidden: !t.visible,
            init: '',
            hpCurrent: t.hpCurrent,
            hpMax: t.hpMax,
            ac: t.ac || 0
        });
    });
    
    renderTrackerList();
}

function createSingleParticipantRow(p, index, isIndented = false) {
    const isCurrent = engine.initiative.active && engine.initiative.currentTurnIndex === index;
    const bg = isCurrent ? '#2e7d32' : (index % 2 === 0 ? '#2b2b2b' : '#353535');
    const hiddenIcon = p.isHidden ? ' 👁️‍🗨️' : '';
    const acBadge = (p.ac && p.ac > 0) ? `<span style="font-size:10px; color:#4fc3f7; font-weight:bold; margin-left:3px; white-space:nowrap;" title="Classe Armatura: ${p.ac}">🛡️${p.ac}</span>` : '';
    
    const div = document.createElement('div');
    div.className = isCurrent ? 'tracker-row-active' : 'tracker-row';
    div.style.display = 'flex';
    div.style.gap = '4px';
    div.style.padding = isIndented ? '4px 5px 4px 16px' : '5px';
    div.style.background = bg;
    div.style.borderBottom = '1px solid #444';
    if (isIndented) div.style.borderLeft = '3px solid #00897b';
    div.style.alignItems = 'center';
    
    div.innerHTML = `
        <div style="flex: 2.2; font-size: 12px; font-weight: ${isCurrent ? 'bold' : 'normal'}; display:flex; align-items:center; min-width: 0;">
            <input type="text" value="${escapeHTML(p.name)}" onchange="updateParticipantName(${index}, this.value)" style="width: 100%; min-width: 0; background:transparent; color:white; border:none; border-bottom:1px solid #666; font-size: 12px;">
            ${acBadge}
            ${hiddenIcon}
        </div>
        <div style="flex: 1; text-align: center;">
            <input type="text" placeholder="${p.hpCurrent !== undefined ? p.hpCurrent : '-'} / ${p.hpMax || '-'}" onchange="updateParticipantHPMath(${index}, this.value); this.value='';" title="Digita + o - e premi Invio (es. -15)" style="width: 100%; text-align:center; background:transparent; color:white; border:none; border-bottom:1px solid #666; font-size:11px;">
        </div>
        <div style="flex: 0.9; text-align: center;">
            <input type="text" inputmode="numeric" value="${p.init !== undefined && p.init !== null ? p.init : ''}" onchange="updateParticipantInit(${index}, this.value)" style="width: 100%; text-align:center; background:transparent; color:white; border:none; border-bottom:1px solid #666; font-size:11.5px;">
        </div>
        <div style="flex: 0.6; text-align: center;">
            <button onclick="removeParticipant(${index})" style="background: transparent; color: #ff5252; border: none; cursor: pointer; font-weight: bold; font-size: 12px;">✕</button>
        </div>
    `;
    return div;
}

function renderTrackerList() {
    const list = document.getElementById('tracker-list');
    if (!list) return;
    list.innerHTML = '';

    const countBadge = document.getElementById('tracker-count-badge');
    const totalCount = engine.initiative.participants ? engine.initiative.participants.length : 0;
    if (countBadge) {
        const suffix = (typeof window.t === 'function') ? window.t('entità') : 'entità';
        countBadge.textContent = `${totalCount} ${suffix}`;
    }

    const useGrouping = document.getElementById('tracker-group-similar') ? document.getElementById('tracker-group-similar').checked : true;

    if (!useGrouping) {
        engine.initiative.participants.forEach((p, index) => {
            list.appendChild(createSingleParticipantRow(p, index, false));
        });
    } else {
        // Raggruppa i partecipanti con lo stesso nome base (se >= 2)
        const baseNameMap = new Map();
        engine.initiative.participants.forEach((p, index) => {
            const base = getParticipantBaseName(p.name);
            const key = base.toLowerCase();
            if (!baseNameMap.has(key)) {
                baseNameMap.set(key, { baseName: base, key: key, items: [] });
            }
            baseNameMap.get(key).items.push({ p, index });
        });

        const renderedKeys = new Set();
        engine.initiative.participants.forEach((p, index) => {
            const base = getParticipantBaseName(p.name);
            const key = base.toLowerCase();
            if (renderedKeys.has(key)) return;
            const group = baseNameMap.get(key);
            if (!group || group.items.length <= 1) {
                list.appendChild(createSingleParticipantRow(p, index, false));
                return;
            }

            renderedKeys.add(key);
            const isExpanded = expandedTrackerGroups.has(key);
            const activeItemInGroup = engine.initiative.active
                ? group.items.find(it => it.index === engine.initiative.currentTurnIndex)
                : null;
            const isGroupActive = !!activeItemInGroup;
            const allHidden = group.items.every(it => it.p.isHidden);
            const someHidden = group.items.some(it => it.p.isHidden);
            const hiddenBadge = allHidden ? ' 👁️‍🗨️' : (someHidden ? ' 🌗' : '');
            const sampleAc = group.items[0].p.ac;
            const acBadge = (sampleAc && sampleAc > 0) ? `<span style="font-size:10px; color:#4fc3f7; font-weight:bold; margin-left:3px; white-space:nowrap;" title="Classe Armatura: ${sampleAc}">🛡️${sampleAc}</span>` : '';

            // Calcola init condivisa se uguale, altrimenti mostra range/primo
            const firstInit = group.items[0].p.init;
            const groupHeader = document.createElement('div');
            groupHeader.className = isGroupActive ? 'tracker-row-active' : 'tracker-group-header';
            groupHeader.style.cssText = `display: flex; gap: 4px; padding: 5px 6px; background: ${isGroupActive ? '#1b5e20' : '#263238'}; border-bottom: 1px solid #455a64; border-left: 3px solid ${isGroupActive ? '#00e676' : '#ffb300'}; align-items: center;`;

            const activeTurnHint = activeItemInGroup ? `<div style="font-size:9.5px; color:#a5d6a7; font-weight:normal;">⚔️ ${escapeHTML(activeItemInGroup.p.name)}</div>` : '';

            const safeKeyAttr = escapeHTML(key);
            groupHeader.innerHTML = `
                <div style="flex: 2.2; font-size: 12px; font-weight: bold; display: flex; flex-direction: column; min-width: 0; cursor: pointer;" onclick="toggleTrackerGroup('${safeKeyAttr}')" title="Clicca per espandere/comprimere il gruppo">
                    <div style="display: flex; align-items: center; gap: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        <span style="color: #ffcc00; font-size: 10px;">${isExpanded ? '▼' : '▶'}</span>
                        <span style="color: #fff; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(group.baseName)}</span>
                        <span style="background: #00897b; color: white; font-size: 9.5px; padding: 0 5px; border-radius: 8px;">x${group.items.length}</span>
                        ${acBadge}${hiddenBadge}
                    </div>
                    ${activeTurnHint}
                </div>
                <div style="flex: 1; text-align: center;">
                    <input type="text" placeholder="HP Gruppo" onchange="updateGroupHPMath('${safeKeyAttr}', this.value); this.value='';" title="Modifica HP a tutto il gruppo (es. -10)" style="width: 100%; text-align:center; background:rgba(0,0,0,0.25); color:#ffcc80; border:1px solid #555; border-radius:3px; font-size:10.5px; padding:2px 0;">
                </div>
                <div style="flex: 0.9; text-align: center;">
                    <input type="text" inputmode="numeric" value="${firstInit !== undefined ? firstInit : ''}" placeholder="Iniz." onchange="updateGroupInit('${safeKeyAttr}', this.value)" title="Imposta Iniziativa per tutti i ${group.items.length} ${escapeHTML(group.baseName)}" style="width: 100%; text-align:center; background:rgba(0,0,0,0.25); color:#fff; border:1px solid #555; border-radius:3px; font-size:11.5px; font-weight:bold; padding:2px 0;">
                </div>
                <div style="flex: 0.6; text-align: center;">
                    <button onclick="removeTrackerGroup('${safeKeyAttr}')" title="Rimuovi tutto il gruppo dall'iniziativa" style="background: transparent; color: #ff5252; border: none; cursor: pointer; font-weight: bold; font-size: 12px;">✕</button>
                </div>
            `;
            list.appendChild(groupHeader);

            if (isExpanded) {
                group.items.forEach(item => {
                    list.appendChild(createSingleParticipantRow(item.p, item.index, true));
                });
            }
        });
    }

    // Scorri automaticamente alla riga del turno attivo all'interno di #tracker-list
    if (engine.initiative.active) {
        const activeRow = list.querySelector('.tracker-row-active');
        if (activeRow && typeof activeRow.scrollIntoView === 'function') {
            setTimeout(() => {
                try { activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
            }, 20);
        }
    }
    
    // Aggiorna visibilità token correnti (il rendering viene chiamato in dm.js ma qui forziamo)
    if (typeof engine.renderAll === 'function') engine.renderAll();
    if (typeof syncState === 'function') syncState();
}

window.toggleTrackerGroup = function(groupKey) {
    if (expandedTrackerGroups.has(groupKey)) {
        expandedTrackerGroups.delete(groupKey);
    } else {
        expandedTrackerGroups.add(groupKey);
    }
    renderTrackerList();
};

window.updateGroupInit = function(groupKey, initVal) {
    const val = parseFloat(initVal) || 0;
    engine.initiative.participants.forEach(p => {
        if (getParticipantBaseName(p.name).toLowerCase() === groupKey) {
            p.init = val;
        }
    });
    renderTrackerList();
};

window.updateGroupHPMath = function(groupKey, mathStr) {
    if (!mathStr || !mathStr.trim()) return;
    engine.initiative.participants.forEach((p, idx) => {
        if (getParticipantBaseName(p.name).toLowerCase() === groupKey) {
            window.updateParticipantHPMath(idx, mathStr, true);
        }
    });
    renderTrackerList();
    engine.renderAll();
    if (typeof syncState === 'function') syncState();
};

window.removeTrackerGroup = function(groupKey) {
    engine.initiative.participants = engine.initiative.participants.filter(p => getParticipantBaseName(p.name).toLowerCase() !== groupKey);
    if (engine.initiative.active && engine.initiative.currentTurnIndex >= engine.initiative.participants.length) {
        engine.initiative.currentTurnIndex = 0;
    }
    renderTrackerList();
};

// Global functions for inline HTML events
window.updateParticipantName = function(index, name) {
    engine.initiative.participants[index].name = name;
    if (typeof syncState === 'function') syncState();
};
window.updateParticipantInit = function(index, initVal) {
    engine.initiative.participants[index].init = parseFloat(initVal) || 0;
};
window.removeParticipant = function(index) {
    engine.initiative.participants.splice(index, 1);
    // Se rimuoviamo quello corrente, dobbiamo fixare l'indice
    if (engine.initiative.active && engine.initiative.currentTurnIndex >= engine.initiative.participants.length) {
        engine.initiative.currentTurnIndex = 0;
    }
    renderTrackerList();
};

window.handleRollForInitiative = function(data) {
    if (!data || typeof data !== 'object') return;
    if (typeof engine === 'undefined' || !engine || !engine.isDM) return;
    if (!engine.initiative || !Array.isArray(engine.initiative.participants) || engine.initiative.participants.length === 0) return;

    const rawPlayerStr = String(data.player || '');
    const rawVal = (data.result !== undefined && data.result !== null) ? data.result : data.total;
    const resultNum = (typeof rawVal === 'number') ? rawVal : parseInt(rawVal);
    if (isNaN(resultNum)) return;

    // 1. Identifica se è un tiro di Iniziativa da Scheda PG
    const isInitiative = data.rollType === 'initiative' || /\[.*(iniziativa|initiative).*\]/i.test(rawPlayerStr);

    // 2. Identifica se è un tiro DEX da Statblock Mostro
    const isDex = data.rollType === 'dex' || /\[.*(\bdex\b|\bdestrezza\b|\bdexterity\b).*\]/i.test(rawPlayerStr);

    if (!isInitiative && !isDex) return;

    if (isInitiative) {
        let charName = data.charName || '';
        if (!charName) {
            const parenMatch = rawPlayerStr.match(/\(([^)]+)\)/);
            if (parenMatch && parenMatch[1] && !/🔒/i.test(parenMatch[1])) {
                charName = parenMatch[1].trim();
            } else {
                charName = rawPlayerStr.replace(/\[.*\]/g, '').replace(/\(🔒.*?\)/g, '').trim();
            }
        }
        const lowName = charName.toLowerCase();
        const baseName = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(charName).toLowerCase() : lowName;

        let matched = null;
        if (data.tokenId) {
            matched = engine.initiative.participants.find(p => p.tokenId === data.tokenId);
        }
        if (!matched) {
            matched = engine.initiative.participants.find(p => {
                const pName = (p.name || '').trim().toLowerCase();
                const pBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(p.name).toLowerCase() : pName;
                return pName === lowName || pBase === baseName || pName === baseName || pBase === lowName;
            });
        }
        if (!matched) {
            matched = engine.initiative.participants.find(p => {
                const pName = (p.name || '').trim().toLowerCase();
                return (pName.length >= 3 && lowName.includes(pName)) || (lowName.length >= 3 && pName.includes(lowName));
            });
        }

        if (matched) {
            matched.init = resultNum;
            if (typeof renderTrackerList === 'function') renderTrackerList();
            if (typeof syncState === 'function') syncState();
            if (typeof showToast === 'function') {
                showToast(`⚔️ Iniziativa per ${matched.name}: ${resultNum}`);
            }
        }
        return;
    }

    if (isDex) {
        let monsterName = data.creatureName || '';
        if (!monsterName) {
            const parenMatch = rawPlayerStr.match(/\(([^)]+)\)/);
            if (parenMatch && parenMatch[1] && !/🔒/i.test(parenMatch[1])) {
                monsterName = parenMatch[1].trim();
            } else {
                monsterName = rawPlayerStr.replace(/\[.*\]/g, '').replace(/\(🔒.*?\)/g, '').trim();
            }
        }
        const lowMName = monsterName.toLowerCase();
        const baseMName = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(monsterName).toLowerCase() : lowMName;

        const groupCbEl = document.getElementById('tracker-group-similar');
        const rollModeEl = document.getElementById('tracker-monster-roll-mode');
        const rollMode = groupCbEl ? (groupCbEl.checked ? 'group' : 'individual') : (rollModeEl ? rollModeEl.value : 'group'); // 'group' o 'individual'

        if (rollMode === 'group') {
            const matches = engine.initiative.participants.filter(p => {
                const pName = (p.name || '').trim().toLowerCase();
                const pBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(p.name).toLowerCase() : pName;
                return pBase === baseMName || pName === lowMName || pBase === lowMName || pName === baseMName ||
                       (pBase.length >= 3 && baseMName.includes(pBase)) || (baseMName.length >= 3 && pBase.includes(baseMName));
            });

            if (matches.length > 0) {
                matches.forEach(p => {
                    p.init = resultNum;
                });
                if (typeof renderTrackerList === 'function') renderTrackerList();
                if (typeof syncState === 'function') syncState();
                if (typeof showToast === 'function') {
                    showToast(`⚔️ Iniziativa ${monsterName} (${matches.length}): ${resultNum}`);
                }
            }
        } else {
            // Singola / Individuale: assegna a uno specifico o al prossimo senza tiro
            let targetP = null;
            if (engine.selectedTokenId) {
                targetP = engine.initiative.participants.find(p => p.tokenId === engine.selectedTokenId && (
                    getParticipantBaseName(p.name).toLowerCase() === baseMName || p.name.toLowerCase().includes(baseMName)
                ));
            }
            if (!targetP) {
                targetP = engine.initiative.participants.find(p => {
                    const pBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(p.name).toLowerCase() : (p.name || '').toLowerCase();
                    const matches = (pBase === baseMName || pBase.includes(baseMName) || baseMName.includes(pBase));
                    const hasInit = (p.init !== undefined && p.init !== null && p.init !== '' && Number(p.init) > 0);
                    return matches && !hasInit;
                });
            }
            if (!targetP) {
                targetP = engine.initiative.participants.find(p => {
                    const pBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(p.name).toLowerCase() : (p.name || '').toLowerCase();
                    return (pBase === baseMName || pBase.includes(baseMName) || baseMName.includes(pBase));
                });
            }

            if (targetP) {
                targetP.init = resultNum;
                if (typeof renderTrackerList === 'function') renderTrackerList();
                if (typeof syncState === 'function') syncState();
                if (typeof showToast === 'function') {
                    showToast(`⚔️ Iniziativa per ${targetP.name}: ${resultNum}`);
                }
            }
        }
    }
};

document.getElementById('btn-add-custom-entity').addEventListener('click', () => {
    engine.initiative.participants.push({
        id: 'ext_' + Date.now(),
        name: 'Extra',
        isToken: false,
        tokenId: null,
        isHidden: false,
        init: ''
    });
    renderTrackerList();
});

document.getElementById('btn-tracker-autoroll')?.addEventListener('click', () => {
    window.autoRollInitiative(false);
});
document.getElementById('btn-tracker-autoroll-all')?.addEventListener('click', () => {
    window.autoRollInitiative(true);
});

document.getElementById('btn-tracker-state').addEventListener('click', (e) => {
    if (!engine.initiative.active) {
        if (!engine.initiative.participants || engine.initiative.participants.length === 0) {
            setupInitiative();
        }
        engine.initiative.active = true;
        sortInitiativeParticipants();
        engine.initiative.currentTurnIndex = 0;
        engine.initiative.round = 1;
        e.target.innerText = 'Riordina/Aggiorna';
        document.getElementById('tracker-combat-controls').style.display = 'flex';
        if (typeof showToast === 'function') showToast('Combattimento avviato!');
    } else {
        sortInitiativeParticipants();
        engine.initiative.currentTurnIndex = 0;
        if (typeof showToast === 'function') showToast('Ordine aggiornato!');
    }
    renderTrackerList();
    if (typeof syncState === 'function') syncState();
});

document.getElementById('btn-tracker-reset').addEventListener('click', () => {
    // Se non in combattimento ed è già vuoto, ricarica la selezione attuale dei token
    if (!engine.initiative.active && (!engine.initiative.participants || engine.initiative.participants.length === 0)) {
        setupInitiative();
        if (typeof showToast === 'function') showToast('Selezione caricata nel tracker.');
        if (typeof syncState === 'function') syncState();
        return;
    }

    engine.initiative.active = false;
    engine.initiative.currentTurnIndex = 0;
    engine.initiative.round = 1;
    engine.initiative.participants = []; // Svuota e resetta l'ordine di iniziativa
    document.getElementById('btn-tracker-state').innerText = 'Avvia Combattimento';
    document.getElementById('tracker-combat-controls').style.display = 'none';

    // Rimuovi all'istante tutte le AoE temporizzate (a round)
    if (engine.shapes && engine.shapes.length > 0) {
        const initialCount = engine.shapes.length;
        engine.shapes = engine.shapes.filter(s => {
            const hasTimer = s.durationRounds !== undefined && s.durationRounds !== null && Number(s.durationRounds) > 0;
            return !hasTimer; // mantieni solo quelle senza timer
        });
        if (engine.shapes.length !== initialCount) {
            if (engine.selectedShapeId && !engine.shapes.some(s => s.id === engine.selectedShapeId)) {
                engine.selectedShapeId = null;
                const sc = document.getElementById('selected-shape-controls');
                if (sc) sc.style.display = 'none';
            }
            engine.renderTokensLayer();
            if (typeof syncState === 'function') syncState();
            if (typeof showToast === 'function') showToast('Effetti AoE a tempo dissolti.');
        }
    }

    // Rimuovi/disattiva all'istante tutte le aure e condizioni a tempo dei token
    if (engine.tokens && engine.tokens.length > 0) {
        let auraResetCount = 0;
        engine.tokens.forEach(tok => {
            if (tok.aura && tok.aura.active && tok.aura.durationRounds > 0) {
                tok.aura.active = false;
                delete tok.aura.roundsLeft;
                delete tok.aura.durationRounds;
                delete tok.aura.skipFirstDecrement;
                auraResetCount++;
            }
            if (Array.isArray(tok.conditions) && tok.conditions.length > 0) {
                const beforeLen = tok.conditions.length;
                tok.conditions = tok.conditions.filter(c => !(c.durationRounds !== undefined && c.durationRounds !== null && Number(c.durationRounds) > 0));
                if (tok.conditions.length !== beforeLen) {
                    tok._condRingCacheKey = null;
                    auraResetCount++;
                }
            }
        });

        // Rimuovi i token/evocazioni a tempo (durationRounds > 0) al reset del combattimento
        const beforeTokCount = engine.tokens.length;
        engine.tokens = engine.tokens.filter(tok => {
            const hasTimer = tok.durationRounds !== undefined && tok.durationRounds !== null && Number(tok.durationRounds) > 0;
            if (!hasTimer) return true;
            const isRealPc = !tok.isEvocation && tok.category === 'personaggi' && !!tok.pcSheet;
            if (isRealPc) {
                delete tok.durationRounds;
                delete tok.roundsLeft;
                delete tok.skipFirstDecrement;
                delete tok._lastDecrementedRound;
                auraResetCount++;
                return true;
            }
            if (engine.selectedTokens) engine.selectedTokens.delete(tok.id);
            if (engine.selectedTokenId === tok.id) {
                engine.selectedTokenId = null;
                if (typeof window.updateSelectedTokenControls === 'function') window.updateSelectedTokenControls(null);
            }
            return false;
        });
        if (engine.tokens.length !== beforeTokCount) {
            auraResetCount++;
            if (typeof showToast === 'function') showToast('⏳ Evocazioni/Token a tempo svaniti al termine del combattimento.');
        }

        if (auraResetCount > 0) {
            if (typeof window.renderConditionsList === 'function') window.renderConditionsList();
            engine.renderAll();
            if (typeof syncState === 'function') syncState(true);
        }
    }

    renderTrackerList();
    if (typeof syncState === 'function') syncState();
});

window.nextInitiativeTurn = function() {
    if (!engine.initiative.participants || engine.initiative.participants.length === 0) return;

    const curIdx = engine.initiative.currentTurnIndex;
    const isEndOfRound = (curIdx === engine.initiative.participants.length - 1);
    const finishingParticipant = engine.initiative.participants[curIdx];
    const currentRound = engine.initiative.round || 1;

    // Helper per verificare se un partecipante corrisponde all'incantatore della sagoma
    const doesParticipantMatchShape = (p, shape) => {
        if (!p || !shape) return false;
        const pName = (p.name || '').trim().toLowerCase();
        const pBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(p.name).toLowerCase() : pName;
        const pTokenId = p.tokenId ? String(p.tokenId).replace(/^tok_/, '') : null;
        const pId = p.id ? String(p.id) : null;

        const sTokenId = shape.casterTokenId ? String(shape.casterTokenId).replace(/^tok_/, '') : null;
        const sId = shape.casterId ? String(shape.casterId) : null;
        const sInitId = shape.casterInitiativeId ? String(shape.casterInitiativeId) : null;
        const sName = shape.casterName ? shape.casterName.trim().toLowerCase() : '';
        const sBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(shape.casterName).toLowerCase() : sName;
        const sOwner = shape.owner ? shape.owner.trim().toLowerCase() : '';

        // 1. Match per Token ID (con prefisso 'tok_' normalizzato)
        if (sTokenId && pTokenId && sTokenId === pTokenId) {
            return true;
        }

        // 2. Match per ID partecipante tracker di iniziativa
        if (sInitId && pId && sInitId === pId) return true;
        if (sId && pId && sId === pId) return true;
        if (sId && pTokenId && sId.replace(/^tok_/, '') === pTokenId) return true;

        // Se l'incantatore della sagoma fa riferimento a un token presente nella mappa:
        if (sTokenId && engine.tokens && engine.tokens.length > 0) {
            const casterTok = engine.tokens.find(t => String(t.id).replace(/^tok_/, '') === sTokenId);
            if (casterTok && casterTok.name) {
                const cTokName = casterTok.name.trim().toLowerCase();
                const cTokBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(casterTok.name).toLowerCase() : cTokName;
                if (cTokName === pName || cTokBase === pBase || cTokName === pBase || cTokBase === pName ||
                    pName.startsWith(cTokName + ' ') || cTokName.startsWith(pName + ' ') ||
                    pBase.startsWith(cTokBase + ' ') || cTokBase.startsWith(pBase + ' ')) {
                    return true;
                }
            }
        }

        // Se entrambi hanno un numero distintivo finale e non sono identici (es. "Orco 1" vs "Orco 2"), NON possono coincidere!
        const sHasNum = /\d+$/.test(shape.casterName || '');
        const pHasNum = /\d+$/.test(p.name || '');
        if (sHasNum && pHasNum && sName !== pName) {
            return false;
        }

        // 3. Match per Nome o Nome Base (es. "Jude Morningstar" vs "Jude", "Mago 1" vs "Mago")
        if (sName && sName !== 'giocatore' && sName !== 'dm') {
            if (sName === pName || sBase === pBase || sName === pBase || sBase === pName) return true;
            if (pName.startsWith(sName + ' ') || sName.startsWith(pName + ' ')) return true;
            if (pBase.startsWith(sName + ' ') || sBase.startsWith(pBase + ' ')) return true;
            if (pName.startsWith(sBase + ' ') || sBase.startsWith(pName + ' ')) return true;
            const pFirst = pBase.split(/\s+/)[0];
            const sFirst = sBase.split(/\s+/)[0];
            if (pFirst && sFirst && pFirst.length >= 3 && pFirst === sFirst) return true;
        }

        // 4. Match per Proprietario del Token
        const pTok = pTokenId
            ? (engine.tokens && engine.tokens.find(t => String(t.id).replace(/^tok_/, '') === pTokenId))
            : (engine.tokens && engine.tokens.find(t => (t.name || '').trim().toLowerCase() === pName));

        if (sOwner && sOwner !== 'giocatore' && sOwner !== 'dm') {
            if (pTok && typeof isTokenOwnedBy === 'function' && isTokenOwnedBy(pTok, sOwner)) return true;
            if (sOwner === pName || sOwner === pBase) return true;
            if (pName.startsWith(sOwner + ' ') || sOwner.startsWith(pName + ' ')) return true;
            if (pBase.startsWith(sOwner + ' ') || sBase.startsWith(pBase + ' ')) return true;
            const pFirst = pBase.split(/\s+/)[0];
            const oFirst = sOwner.split(/\s+/)[0];
            if (pFirst && oFirst && pFirst.length >= 3 && pFirst === oFirst) return true;
            if (pTok && pTok.name) {
                const tName = pTok.name.trim().toLowerCase();
                if (tName === sOwner || tName.startsWith(sOwner + ' ') || sOwner.startsWith(tName + ' ')) return true;
            }
        }

        return false;
    };

    // Gestione decremento turni per le AoE temporizzate
    if (finishingParticipant && engine.shapes && engine.shapes.length > 0) {
        let changed = false;
        const expiredShapes = [];

        engine.shapes = engine.shapes.filter(shape => {
            const hasTimer = shape.durationRounds !== undefined && shape.durationRounds !== null && Number(shape.durationRounds) > 0;
            if (!hasTimer) return true; // Le forme permanenti non scalano mai

            const matchesCurrentCaster = doesParticipantMatchShape(finishingParticipant, shape);
            const hasCasterInTracker = engine.initiative.participants.some(p => doesParticipantMatchShape(p, shape));

            // Scaliamo se:
            // A) Questo partecipante che termina il turno è l'incantatore della sagoma presente nel tracker
            // B) Oppure la sagoma non ha nessun partecipante attivo nel tracker (es. DM, Ambiente, Trappola) ed è finito il round!
            const shouldDecrement = hasCasterInTracker ? matchesCurrentCaster : isEndOfRound;

            if (shouldDecrement) {
                // Se è stata appena creata durante questo stesso turno dell'incantatore, salta il primo decremento
                if (shape.skipFirstDecrement) {
                    shape.skipFirstDecrement = false;
                    shape._lastDecrementedRound = currentRound;
                    return true;
                }

                // Evita doppio decremento nello stesso round
                if (shape._lastDecrementedRound === currentRound) {
                    return true;
                }

                if (shape.roundsLeft === undefined || shape.roundsLeft === null) {
                    shape.roundsLeft = Number(shape.durationRounds);
                }

                shape.roundsLeft--;
                shape._lastDecrementedRound = currentRound;
                changed = true;

                if (shape.roundsLeft <= 0) {
                    expiredShapes.push(shape);
                    return false; // Rimuovi la sagoma scaduta!
                }
            }
            return true;
        });

        if (expiredShapes.length > 0) {
            expiredShapes.forEach(exp => {
                const cName = exp.casterName || (finishingParticipant ? finishingParticipant.name : '') || 'Incantatore';
                if (typeof showToast === 'function') {
                    showToast(`⏳ L'effetto AoE di ${cName} è svanito!`);
                }
                if (engine.selectedShapeId === exp.id) {
                    engine.selectedShapeId = null;
                    const sc = document.getElementById('selected-shape-controls');
                    if (sc) sc.style.display = 'none';
                }
            });
        }

        if (changed || expiredShapes.length > 0) {
            engine.renderTokensLayer();
            if (typeof syncState === 'function') syncState();
        }
    }

    // Gestione decremento turni per le Aure a tempo dei Token
    if (finishingParticipant && engine.tokens && engine.tokens.length > 0) {
        let auraChanged = false;
        const pName = (finishingParticipant.name || '').trim().toLowerCase();
        const pBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(finishingParticipant.name).toLowerCase() : pName;
        const pTokenId = finishingParticipant.tokenId ? String(finishingParticipant.tokenId) : null;

        engine.tokens.forEach(tok => {
            if (!tok.aura || !tok.aura.active || !tok.aura.durationRounds || Number(tok.aura.durationRounds) <= 0) return;
            const tokIdStr = String(tok.id);
            const tokName = (tok.name || '').trim().toLowerCase();
            const tokBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(tok.name).toLowerCase() : tokName;

            let isMatch = false;
            if (pTokenId) {
                // Se il partecipante è un token specifico, l'aura deve appartenere a QUESTO specifico token
                isMatch = (pTokenId === tokIdStr);
            } else {
                // Altrimenti (partecipante party o custom non collegato direttamente a ID token), match per nome
                const tokHasNum = /\d+$/.test(tok.name || '');
                const pHasNum = /\d+$/.test(finishingParticipant.name || '');
                if (tokHasNum && pHasNum && tokName !== pName) {
                    isMatch = false;
                } else {
                    isMatch = (
                        tokName === pName || tokBase === pBase || tokName === pBase || tokBase === pName ||
                        pName.startsWith(tokName + ' ') || tokName.startsWith(pName + ' ') ||
                        pBase.startsWith(tokBase + ' ') || tokBase.startsWith(pBase + ' ')
                    );
                }
            }

            // Se il token è nel tracker, scala solo sul suo turno. Se non è nel tracker (es. evocazione DM o neutrale), scala a fine round!
            const hasTokInTracker = engine.initiative.participants.some(p => {
                if (p.tokenId && String(p.tokenId) === tokIdStr) return true;
                const pN = (p.name || '').trim().toLowerCase();
                const pB = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(p.name).toLowerCase() : pN;
                return tokName === pN || tokBase === pB || tokName === pB || tokBase === pN;
            });
            const shouldDecrement = hasTokInTracker ? isMatch : isEndOfRound;

            if (shouldDecrement) {
                if (tok.aura.skipFirstDecrement) {
                    tok.aura.skipFirstDecrement = false;
                    tok.aura._lastDecrementedRound = currentRound;
                    return;
                }
                if (tok.aura._lastDecrementedRound === currentRound) {
                    return;
                }
                if (tok.aura.roundsLeft === undefined || tok.aura.roundsLeft === null) {
                    tok.aura.roundsLeft = Number(tok.aura.durationRounds);
                }
                tok.aura.roundsLeft--;
                tok.aura._lastDecrementedRound = currentRound;
                auraChanged = true;

                if (tok.aura.roundsLeft <= 0) {
                    tok.aura.active = false;
                    delete tok.aura.roundsLeft;
                    delete tok.aura.durationRounds;
                    delete tok.aura.skipFirstDecrement;
                    delete tok.aura._lastDecrementedRound;
                    if (typeof showToast === 'function') {
                        showToast(`⏳ L'aura di ${tok.name || 'Token'} si è dissolta!`);
                    }
                }
            }
        });

        if (auraChanged) {
            engine.renderTokensLayer();
            if (typeof syncState === 'function') syncState();
        }

        // Gestione decremento turni per le Condizioni a tempo dei Token
        let condChanged = false;
        engine.tokens.forEach(tok => {
            if (!Array.isArray(tok.conditions) || tok.conditions.length === 0) return;
            const hasTimedCond = tok.conditions.some(c => c.durationRounds !== undefined && c.durationRounds !== null && Number(c.durationRounds) > 0);
            if (!hasTimedCond) return;

            const tokIdStr = String(tok.id);
            const tokName = (tok.name || '').trim().toLowerCase();
            const tokBase = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(tok.name).toLowerCase() : tokName;

            let isMatch = false;
            if (pTokenId) {
                isMatch = (pTokenId === tokIdStr);
            } else {
                const tokHasNum = /\d+$/.test(tok.name || '');
                const pHasNum = /\d+$/.test(finishingParticipant.name || '');
                if (tokHasNum && pHasNum && tokName !== pName) {
                    isMatch = false;
                } else {
                    isMatch = (
                        tokName === pName || tokBase === pBase || tokName === pBase || tokBase === pName ||
                        pName.startsWith(tokName + ' ') || tokName.startsWith(pName + ' ') ||
                        pBase.startsWith(tokBase + ' ') || tokBase.startsWith(pBase + ' ')
                    );
                }
            }

            const hasTokInTracker = engine.initiative.participants.some(p => {
                if (p.tokenId && String(p.tokenId) === tokIdStr) return true;
                const pN = (p.name || '').trim().toLowerCase();
                const pB = (typeof getParticipantBaseName === 'function') ? getParticipantBaseName(p.name).toLowerCase() : pN;
                return tokName === pN || tokBase === pB || tokName === pB || tokBase === pN;
            });
            const shouldDecrement = hasTokInTracker ? isMatch : isEndOfRound;

            if (shouldDecrement) {
                tok.conditions = tok.conditions.filter(cond => {
                    const hasTimer = cond.durationRounds !== undefined && cond.durationRounds !== null && Number(cond.durationRounds) > 0;
                    if (!hasTimer) return true;

                    if (cond.skipFirstDecrement) {
                        cond.skipFirstDecrement = false;
                        cond._lastDecrementedRound = currentRound;
                        return true;
                    }
                    if (cond._lastDecrementedRound === currentRound) {
                        return true;
                    }
                    if (cond.roundsLeft === undefined || cond.roundsLeft === null) {
                        cond.roundsLeft = Number(cond.durationRounds);
                    }
                    cond.roundsLeft--;
                    cond._lastDecrementedRound = currentRound;
                    condChanged = true;
                    tok._condRingCacheKey = null;

                    if (cond.roundsLeft <= 0) {
                        if (typeof showToast === 'function') {
                            showToast(`⏳ La condizione "${cond.text || 'Stato'}" su ${tok.name || 'Token'} è terminata!`);
                        }
                        return false;
                    }
                    return true;
                });
            }
        });

        if (condChanged) {
            if (typeof window.renderConditionsList === 'function') window.renderConditionsList();
            engine.renderTokensLayer();
            if (typeof syncState === 'function') syncState();
        }

        // Gestione decremento turni per la Durata dei Token / Evocazioni (durationRounds > 0)
        let tokDurChanged = false;
        const expiredTokens = [];

        const doesParticipantMatchTokenSelf = (p, tok) => {
            if (!p || !tok) return false;
            const tokIdStr = String(tok.id).replace(/^tok_/, '');
            if (p.tokenId && String(p.tokenId).replace(/^tok_/, '') === tokIdStr) return true;
            const tokName = (tok.name || '').trim().toLowerCase();
            const pN = (p.name || '').trim().toLowerCase();
            if (!tokName || !pN) return false;
            const tokHasNum = /\d+$/.test(tok.name || '');
            const pHasNum = /\d+$/.test(p.name || '');
            if (tokHasNum && pHasNum && tokName !== pN) return false;
            return tokName === pN;
        };

        const doesParticipantMatchTokenCaster = (p, tok) => {
            if (!p || !tok) return false;
            return doesParticipantMatchShape(p, {
                casterTokenId: tok.casterTokenId || null,
                casterId: tok.casterId || null,
                casterInitiativeId: tok.casterInitiativeId || null,
                casterName: tok.evokerName || tok.owner || (Array.isArray(tok.owners) && tok.owners[0]) || '',
                owner: tok.owner || (Array.isArray(tok.owners) && tok.owners[0]) || ''
            });
        };

        engine.tokens = engine.tokens.filter(tok => {
            const hasTimer = tok.durationRounds !== undefined && tok.durationRounds !== null && Number(tok.durationRounds) > 0;
            if (!hasTimer) return true;

            const hasSelfInTracker = engine.initiative.participants.some(p => doesParticipantMatchTokenSelf(p, tok));
            const hasCasterInTracker = engine.initiative.participants.some(p => doesParticipantMatchTokenCaster(p, tok));

            let shouldDecrement = false;
            if (hasSelfInTracker) {
                shouldDecrement = doesParticipantMatchTokenSelf(finishingParticipant, tok);
            } else if (hasCasterInTracker) {
                shouldDecrement = doesParticipantMatchTokenCaster(finishingParticipant, tok);
            } else {
                shouldDecrement = isEndOfRound;
            }

            if (shouldDecrement) {
                if (tok.skipFirstDecrement) {
                    tok.skipFirstDecrement = false;
                    tok._lastDecrementedRound = currentRound;
                    return true;
                }
                if (tok._lastDecrementedRound === currentRound) {
                    return true;
                }
                if (tok.roundsLeft === undefined || tok.roundsLeft === null) {
                    tok.roundsLeft = Number(tok.durationRounds);
                }
                tok.roundsLeft--;
                tok._lastDecrementedRound = currentRound;
                tokDurChanged = true;

                if (tok.roundsLeft <= 0) {
                    expiredTokens.push(tok);
                    return false; // Rimuovi il token/evocazione scaduto!
                }
            }
            return true;
        });

        if (expiredTokens.length > 0) {
            expiredTokens.forEach(expTok => {
                if (typeof showToast === 'function') {
                    const evokerSuffix = expTok.evokerName ? ` di ${expTok.evokerName}` : '';
                    showToast(`⏳ "${expTok.name || 'Evocazione'}"${evokerSuffix} è svanito (durata terminata)!`);
                }
                if (engine.selectedTokens) engine.selectedTokens.delete(expTok.id);
                if (engine.selectedTokenId === expTok.id) {
                    engine.selectedTokenId = engine.selectedTokens && engine.selectedTokens.size > 0
                        ? Array.from(engine.selectedTokens).pop()
                        : null;
                    const nextSel = engine.selectedTokenId ? engine.tokens.find(t => t.id === engine.selectedTokenId) : null;
                    if (typeof window.updateSelectedTokenControls === 'function') {
                        window.updateSelectedTokenControls(nextSel);
                    }
                }
                // Se il token scaduto era presente anche come riga separata nel tracker di iniziativa, rimuovilo in sicurezza
                const pIdx = engine.initiative.participants.findIndex(p => p.tokenId && String(p.tokenId) === String(expTok.id));
                if (pIdx !== -1) {
                    engine.initiative.participants.splice(pIdx, 1);
                    if (pIdx <= engine.initiative.currentTurnIndex && engine.initiative.currentTurnIndex > 0) {
                        engine.initiative.currentTurnIndex--;
                    }
                }
            });
        }

        if (tokDurChanged || expiredTokens.length > 0) {
            if (engine.selectedTokenId && typeof window.updateSelectedTokenControls === 'function') {
                const selTok = engine.tokens.find(t => t.id === engine.selectedTokenId);
                if (selTok) window.updateSelectedTokenControls(selTok);
            }
            engine.renderAll();
            if (typeof syncState === 'function') syncState(true);
        }
    }

    if (isEndOfRound) {
        engine.initiative.round = currentRound + 1;
    }
    engine.initiative.currentTurnIndex = (engine.initiative.currentTurnIndex + 1) % engine.initiative.participants.length;
    renderTrackerList();
};

window.prevInitiativeTurn = function() {
    if (!engine.initiative.participants || engine.initiative.participants.length === 0) return;
    engine.initiative.currentTurnIndex = (engine.initiative.currentTurnIndex - 1 + engine.initiative.participants.length) % engine.initiative.participants.length;
    renderTrackerList();
};

const _btnNextEl = document.getElementById('btn-next-turn');
if (_btnNextEl) {
    const _cleanNext = _btnNextEl.cloneNode(true);
    _btnNextEl.parentNode.replaceChild(_cleanNext, _btnNextEl);
    _cleanNext.onclick = window.nextInitiativeTurn;
}

const _btnPrevEl = document.getElementById('btn-prev-turn');
if (_btnPrevEl) {
    const _cleanPrev = _btnPrevEl.cloneNode(true);
    _btnPrevEl.parentNode.replaceChild(_cleanPrev, _btnPrevEl);
    _cleanPrev.onclick = window.prevInitiativeTurn;
}

document.getElementById('tracker-player-visible').addEventListener('change', (e) => {
    engine.initiative.isVisibleToPlayers = e.target.checked;
    if (typeof syncState === 'function') syncState();
});
document.getElementById('tracker-player-pos').addEventListener('change', (e) => {
    engine.initiative.playerPosition = e.target.value;
    if (typeof syncState === 'function') syncState();
});

// Init
renderPartyList();


document.getElementById('btn-collapse-tracker').addEventListener('click', (e) => {
    const body = document.getElementById('dm-tracker-body');
    if (body.style.display === 'none') {
        body.style.display = 'flex';
        trackerDiv.style.height = savedTrackerHeight || '420px';
        trackerDiv.style.minHeight = '230px';
        trackerDiv.style.resize = 'both';
        e.target.innerText = '-';
    } else {
        savedTrackerHeight = trackerDiv.style.height || '420px';
        body.style.display = 'none';
        trackerDiv.style.height = 'auto';
        trackerDiv.style.minHeight = '0';
        trackerDiv.style.resize = 'none';
        e.target.innerText = '+';
    }
});


window.updateParticipantHPMath = function(index, mathStr, skipRender = false) {
    if(!engine.initiative || !engine.initiative.participants) return;
    const p = engine.initiative.participants[index];
    if(!p) return;
    
    // Evaluate math (like -10, +5, or just setting a number)
    let mod = parseInt(mathStr);
    if(isNaN(mod)) return;
    
    let curr = p.hpCurrent || 0;
    
    // If it starts with + or -, modify. Else, set absolute.
    if(mathStr.trim().startsWith('+') || mathStr.trim().startsWith('-')) {
        curr += mod;
    } else {
        curr = mod;
    }
    
    if(p.hpMax && curr > p.hpMax) curr = p.hpMax;
    if(curr < 0) curr = 0;
    
    p.hpCurrent = curr;
    
    // Sync to token if it exists
    if(p.isToken && p.tokenId) {
        const t = engine.tokens.find(tok => tok.id === p.tokenId);
        if(t) {
            t.hpCurrent = curr;
            // Also update sidebar if currently selected
            if(engine.selectedTokenId === t.id) {
                const ci = document.getElementById('token-hp-current');
                if(ci) ci.value = curr;
            }
        }
    }
    
    if (!skipRender) {
        renderTrackerList();
        engine.renderAll();
        syncState();
    }
};
