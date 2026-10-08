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
}

document.getElementById('btn-add-player').addEventListener('click', () => {
    const nameInput = document.getElementById('new-player-name');
    const name = nameInput.value.trim();
    if (name) {
        party.push(name);
        localStorage.setItem('dnd_party', JSON.stringify(party));
        nameInput.value = '';
        renderPartyList();
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

// Dragging for Tracker
let isDraggingTracker = false;
let trackerOffsetX = 0;
let trackerOffsetY = 0;

header.addEventListener('mousedown', (e) => {
    isDraggingTracker = true;
    trackerOffsetX = e.clientX - trackerDiv.getBoundingClientRect().left;
    trackerOffsetY = e.clientY - trackerDiv.getBoundingClientRect().top;
});
header.addEventListener('touchstart', (e) => {
    isDraggingTracker = true;
    trackerOffsetX = e.touches[0].clientX - trackerDiv.getBoundingClientRect().left;
    trackerOffsetY = e.touches[0].clientY - trackerDiv.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (!isDraggingTracker) return;
    trackerDiv.style.left = (e.clientX - trackerOffsetX) + 'px';
    trackerDiv.style.top = (e.clientY - trackerOffsetY) + 'px';
    trackerDiv.style.right = 'auto'; // override default right:20px
});
document.addEventListener('touchmove', (e) => {
    if (!isDraggingTracker) return;
    trackerDiv.style.left = (e.touches[0].clientX - trackerOffsetX) + 'px';
    trackerDiv.style.top = (e.touches[0].clientY - trackerOffsetY) + 'px';
    trackerDiv.style.right = 'auto';
});

document.addEventListener('mouseup', () => isDraggingTracker = false);
document.addEventListener('touchend', () => isDraggingTracker = false);

document.getElementById('btn-toggle-tracker').addEventListener('click', () => {
    if (trackerDiv.style.display === 'none') {
        trackerDiv.style.display = 'flex';
        if (!engine.initiative.active && engine.initiative.participants.length === 0) {
            setupInitiative();
        }
    } else {
        trackerDiv.style.display = 'none';
    }
});

document.getElementById('btn-close-tracker').addEventListener('click', () => {
    trackerDiv.style.display = 'none';
});

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
            init: ''
        });
    });
    
    renderTrackerList();
}

function renderTrackerList() {
    const list = document.getElementById('tracker-list');
    list.innerHTML = '';
    
    engine.initiative.participants.forEach((p, index) => {
        const isCurrent = engine.initiative.active && engine.initiative.currentTurnIndex === index;
        const bg = isCurrent ? '#2e7d32' : (index % 2 === 0 ? '#333' : '#444');
        const hiddenIcon = p.isHidden ? ' 👁️‍🗨️' : '';
        
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.gap = '5px';
        div.style.padding = '5px';
        div.style.background = bg;
        div.style.borderBottom = '1px solid #555';
        div.style.alignItems = 'center';
        
                div.innerHTML = `
            <div style="flex: 2; font-size: 13px; font-weight: ${isCurrent ? 'bold' : 'normal'};">
                <input type="text" value="${p.name}" onchange="updateParticipantName(${index}, this.value)" style="width: 80%; background:transparent; color:white; border:none; border-bottom:1px solid #777;">
                ${hiddenIcon}
            </div>
            <div style="flex: 1; text-align: center;">
                <input type="text" placeholder="${p.hpCurrent !== undefined ? p.hpCurrent : '-'} / ${p.hpMax || '-'}" onchange="updateParticipantHPMath(${index}, this.value); this.value='';" title="Digita + o - e premi Invio (es. -15)" style="width: 100%; text-align:center; background:transparent; color:white; border:none; border-bottom:1px solid #777; font-size:11px;">
            </div>
            <div style="flex: 1; text-align: center;">
                <input type="text" inputmode="numeric" value="${p.init}" onchange="updateParticipantInit(${index}, this.value)" style="width: 100%; text-align:center; background:transparent; color:white; border:none; border-bottom:1px solid #777;">
            </div>
            <div style="flex: 1; text-align: center;">
                <button onclick="removeParticipant(${index})" style="background: transparent; color: #ff5252; border: none; cursor: pointer; font-weight: bold;">X</button>
            </div>
        `;
        list.appendChild(div);
    });
    
    // Aggiorna visibilità token correnti (il rendering viene chiamato in dm.js ma qui forziamo)
    if (typeof engine.renderAll === 'function') engine.renderAll();
    if (typeof syncState === 'function') syncState();
}

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
        e.target.innerText = '-';
    } else {
        body.style.display = 'none';
        e.target.innerText = '+';
    }
});


window.updateParticipantHPMath = function(index, mathStr) {
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
    
    renderTrackerList();
    engine.renderAll();
    syncState();
};
