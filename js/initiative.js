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

// Dragging for Tracker
let isDraggingTracker = false;
let trackerOffsetX = 0;
let trackerOffsetY = 0;

header.addEventListener('mousedown', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    isDraggingTracker = true;
    trackerOffsetX = e.clientX - trackerDiv.getBoundingClientRect().left;
    trackerOffsetY = e.clientY - trackerDiv.getBoundingClientRect().top;
});
header.addEventListener('touchstart', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    isDraggingTracker = true;
    trackerOffsetX = e.touches[0].clientX - trackerDiv.getBoundingClientRect().left;
    trackerOffsetY = e.touches[0].clientY - trackerDiv.getBoundingClientRect().top;
});

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
    if (!isDraggingTracker) return;
    const vw = window.innerWidth || 1000;
    const vh = window.innerHeight || 700;
    const nextX = Math.max(0, Math.min(vw - 80, e.touches[0].clientX - trackerOffsetX));
    const nextY = Math.max(0, Math.min(vh - 45, e.touches[0].clientY - trackerOffsetY));
    trackerDiv.style.left = nextX + 'px';
    trackerDiv.style.top = nextY + 'px';
    trackerDiv.style.right = 'auto';
});

document.addEventListener('mouseup', () => isDraggingTracker = false);
document.addEventListener('touchend', () => isDraggingTracker = false);

document.getElementById('btn-toggle-tracker').addEventListener('click', () => {
    if (trackerDiv.style.display === 'none') {
        trackerDiv.style.display = 'flex';
        clampTrackerToViewport();
        if (!engine.initiative.active && engine.initiative.participants.length === 0) {
            setupInitiative();
        } else {
            renderTrackerList();
        }
    } else {
        trackerDiv.style.display = 'none';
    }
});

document.getElementById('btn-close-tracker').addEventListener('click', () => {
    trackerDiv.style.display = 'none';
});

const groupSimilarCheckbox = document.getElementById('tracker-group-similar');
if (groupSimilarCheckbox) {
    groupSimilarCheckbox.addEventListener('change', () => {
        renderTrackerList();
    });
}

function getParticipantBaseName(name) {
    if (!name) return 'Token';
    return String(name).replace(/\s+\d+$/, '').trim() || String(name).trim() || 'Token';
}

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
            <input type="text" inputmode="numeric" value="${p.init}" onchange="updateParticipantInit(${index}, this.value)" style="width: 100%; text-align:center; background:transparent; color:white; border:none; border-bottom:1px solid #666; font-size:11.5px;">
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

document.getElementById('btn-tracker-state').addEventListener('click', (e) => {
    if (!engine.initiative.active) {
        engine.initiative.active = true;
        engine.initiative.participants.sort((a, b) => (b.init || 0) - (a.init || 0));
        engine.initiative.currentTurnIndex = 0;
        e.target.innerText = 'Riordina/Aggiorna';
        document.getElementById('tracker-combat-controls').style.display = 'flex';
        if (typeof showToast === 'function') showToast('Combattimento avviato!');
    } else {
        engine.initiative.participants.sort((a, b) => (b.init || 0) - (a.init || 0));
        engine.initiative.currentTurnIndex = 0;
        if (typeof showToast === 'function') showToast('Ordine aggiornato!');
    }
    renderTrackerList();
});

document.getElementById('btn-tracker-reset').addEventListener('click', () => {
    engine.initiative.active = false;
    engine.initiative.currentTurnIndex = 0;
    engine.initiative.participants = []; // Svuota i vecchi partecipanti
    setupInitiative(); // Ricarica in base alla nuova selezione
    document.getElementById('btn-tracker-state').innerText = 'Avvia Combattimento';
    document.getElementById('tracker-combat-controls').style.display = 'none';
    renderTrackerList();
});

document.getElementById('btn-next-turn').addEventListener('click', () => {
    if(engine.initiative.participants.length === 0) return;
    engine.initiative.currentTurnIndex = (engine.initiative.currentTurnIndex + 1) % engine.initiative.participants.length;
    renderTrackerList();
});
document.getElementById('btn-prev-turn').addEventListener('click', () => {
    if(engine.initiative.participants.length === 0) return;
    engine.initiative.currentTurnIndex = (engine.initiative.currentTurnIndex - 1 + engine.initiative.participants.length) % engine.initiative.participants.length;
    renderTrackerList();
});

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
