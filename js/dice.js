// js/dice.js

// Funzione globale per rendere trascinabili i pannelli
window.makeDraggable = function(panel, handle = null) {
    let startX = 0, startY = 0;
    let initialTop = 0, initialLeft = 0;
    const dragElement = handle || panel;
    
    dragElement.style.cursor = 'move';
    
    dragElement.onmousedown = function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.classList.contains('roll-btn')) return;
        e.preventDefault();
        
        const rect = panel.getBoundingClientRect();
        panel.style.bottom = 'auto';
        panel.style.right = 'auto';
        
        initialTop = rect.top;
        initialLeft = rect.left;
        
        panel.style.top = initialTop + "px";
        panel.style.left = initialLeft + "px";
        
        startX = e.clientX;
        startY = e.clientY;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    function elementDrag(e) {
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        panel.style.top = (initialTop + dy) + "px";
        panel.style.left = (initialLeft + dx) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        // Aggiorna le coordinate iniziali se rinizia un drag
        initialTop = parseFloat(panel.style.top) || 0;
        initialLeft = parseFloat(panel.style.left) || 0;
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
            
            // Invia agli altri (solo se NON è il master)
            if (!isDM && networkObj && networkObj.send) {
                networkObj.send({
                    type: 'DICE_ROLL',
                    payload: {
                        id: Date.now() + '_' + Math.random(),
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
