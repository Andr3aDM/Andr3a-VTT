// js/dice.js

// Funzione globale per rendere trascinabili i pannelli
window.makeDraggable = function(panel, handle = null) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragElement = handle || panel;
    
    dragElement.style.cursor = 'move';
    
    dragElement.onmousedown = function(e) {
        // Evita il drag se clicchiamo su un bottone o input
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.classList.contains('roll-btn')) return;
        
        e.preventDefault();
        
        // Risoluzione Salto: Prima di muovere, convertiamo bottom/right in top/left assoluti
        if (panel.style.bottom && panel.style.bottom !== 'auto' || panel.style.right && panel.style.right !== 'auto') {
            const rect = panel.getBoundingClientRect();
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
            panel.style.top = rect.top + "px";
            panel.style.left = rect.left + "px";
        }
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Ora possiamo calcolare l'offset top/left in sicurezza
        panel.style.top = (panel.offsetTop - pos2) + "px";
        panel.style.left = (panel.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
};

window.setupDiceSystem = function(isDM, networkObj) {
    window.appendRollToChat = function(playerName, dice, bonus, result) {
        const chatLog = document.getElementById('chat-log');
        if (!chatLog) return;
        
        const li = document.createElement('li');
        li.style.background = 'rgba(255, 255, 255, 0.1)';
        li.style.padding = '5px';
        li.style.borderRadius = '3px';
        li.style.borderLeft = '3px solid #2196f3';
        
        const bStr = bonus > 0 ? `+${bonus}` : (bonus < 0 ? `${bonus}` : '');
        const expression = `1d${dice}${bStr}`;
        
        li.innerHTML = `<strong style="color:#ffcc00;">${playerName}</strong> tira ${expression}: <strong style="font-size:16px;">${result}</strong>`;
        chatLog.appendChild(li);
        
        // Auto-scroll
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    const btnToggleDice = document.getElementById(isDM ? 'btn-toggle-dice' : 'pbtn-dice');
    const btnToggleChat = document.getElementById(isDM ? 'btn-toggle-chat' : 'pbtn-chat');
    const dicePanel = document.getElementById('dice-panel');
    const chatPanel = document.getElementById('chat-panel');
    
    // Rende i pannelli trascinabili
    if (dicePanel) window.makeDraggable(dicePanel);
    if (chatPanel) window.makeDraggable(chatPanel);
    
    if (btnToggleDice && dicePanel) {
        btnToggleDice.addEventListener('click', () => {
            dicePanel.style.display = dicePanel.style.display === 'none' ? 'flex' : 'none';
        });
    }
    
    if (btnToggleChat && chatPanel) {
        btnToggleChat.addEventListener('click', () => {
            chatPanel.style.display = chatPanel.style.display === 'none' ? 'flex' : 'none';
        });
    }

    // Ascolta i click sui dadi
    document.querySelectorAll('.roll-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const dice = parseInt(btn.getAttribute('data-dice'));
            const bonusInput = document.getElementById('dice-bonus');
            const bonus = bonusInput ? (parseInt(bonusInput.value) || 0) : 0;
            const roll = Math.floor(Math.random() * dice) + 1;
            const result = roll + bonus;
            
            let pName = networkObj ? networkObj.playerName : "Sconosciuto";
            if (isDM) pName = "Master";
            if (!pName) pName = "Giocatore Sconosciuto";

            // Appendi localmente
            window.appendRollToChat(pName, dice, bonus, result);
            
            // Invia agli altri
            if (networkObj && networkObj.send) {
                networkObj.send({
                    type: 'DICE_ROLL',
                    payload: {
                        player: pName,
                        dice: dice,
                        bonus: bonus,
                        result: result
                    }
                });
            }
            
            // Forza apertura chat
            if (chatPanel) chatPanel.style.display = 'flex';
        });
    });
};
