// js/dice.js

// Safe HTML escape helper
function safeEscape(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

// Funzione globale per rendere trascinabili i pannelli (PC mouse + Tablet touch)
window.makeDraggable = function(panel, handle = null) {
    if (!panel) return;
    const dragElement = handle || panel;
    
    dragElement.style.cursor = 'move';
    dragElement.style.touchAction = 'none'; // Previene gesture di scroll/zoom del browser durante il trascinamento
    
    function isInteractive(target) {
        if (!target) return false;
        return !!(
            target.closest('button') ||
            target.closest('input') ||
            target.closest('select') ||
            target.closest('textarea') ||
            target.closest('label') ||
            target.classList.contains('roll-btn') ||
            target.closest('.no-drag')
        );
    }

    // --- GESTIONE MOUSE (PC) ---
    dragElement.onmousedown = function(e) {
        if (e.button !== 0) return; // Solo tasto sinistro
        if (isInteractive(e.target)) return;
        e.preventDefault();
        
        const rect = panel.getBoundingClientRect();
        panel.style.bottom = 'auto';
        panel.style.right = 'auto';
        
        let initialTop = rect.top;
        let initialLeft = rect.left;
        
        panel.style.top = initialTop + "px";
        panel.style.left = initialLeft + "px";
        
        const startX = e.clientX;
        const startY = e.clientY;
        
        function elementDrag(ev) {
            ev.preventDefault();
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            
            panel.style.top = (initialTop + dy) + "px";
            panel.style.left = (initialLeft + dx) + "px";
        }
        
        function closeDragElement() {
            window.removeEventListener('mousemove', elementDrag);
            window.removeEventListener('mouseup', closeDragElement);
            document.onmousemove = null;
            document.onmouseup = null;
            initialTop = parseFloat(panel.style.top) || 0;
            initialLeft = parseFloat(panel.style.left) || 0;
        }
        
        window.addEventListener('mousemove', elementDrag);
        window.addEventListener('mouseup', closeDragElement);
        document.onmousemove = elementDrag;
        document.onmouseup = closeDragElement;
    };

    // --- GESTIONE TOUCH (TABLET / SMARTPHONE) ---
    dragElement.addEventListener('touchstart', function(e) {
        if (isInteractive(e.target)) return;
        if (!e.touches || e.touches.length !== 1) return; // Solo tocco singolo per il drag della finestra
        
        if (e.cancelable) e.preventDefault();
        
        const touch = e.touches[0];
        const rect = panel.getBoundingClientRect();
        panel.style.bottom = 'auto';
        panel.style.right = 'auto';
        
        const tInitialTop = rect.top;
        const tInitialLeft = rect.left;
        
        panel.style.top = tInitialTop + "px";
        panel.style.left = tInitialLeft + "px";
        
        const tStartX = touch.clientX;
        const tStartY = touch.clientY;
        
        function onTouchMove(ev) {
            if (!ev.touches || ev.touches.length !== 1) return;
            if (ev.cancelable) ev.preventDefault();
            
            const curTouch = ev.touches[0];
            const dx = curTouch.clientX - tStartX;
            const dy = curTouch.clientY - tStartY;
            
            panel.style.top = (tInitialTop + dy) + "px";
            panel.style.left = (tInitialLeft + dx) + "px";
        }
        
        function onTouchEnd() {
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchcancel', onTouchEnd);
        }
        
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    }, { passive: false });
};

window.appendRollToChat = function(playerOrData, dice, bonus, result) {
    const chatLog = document.getElementById('chat-log');
    if (!chatLog) return;
    
    const li = document.createElement('li');
    li.style.background = 'rgba(255, 255, 255, 0.08)';
    li.style.padding = '6px 8px';
    li.style.borderRadius = '4px';
    li.style.borderLeft = '3px solid #ffcc00';
    li.style.marginBottom = '4px';
    li.style.fontSize = '13px';
    li.style.lineHeight = '1.4';
    
    if (typeof playerOrData === 'object' && playerOrData !== null) {
        const data = playerOrData;
        const pName = safeEscape(data.player || "Giocatore");
        
        if (data.mode === 'each') {
            // Modalità: A ciascun dado (Vantaggio / Svantaggio / Prove)
            const bSign = data.bonus > 0 ? `+${data.bonus}` : (data.bonus < 0 ? `${data.bonus}` : '');
            const bLabel = data.bonus !== 0 ? ` (${bSign} cad.)` : '';
            li.style.borderLeft = '3px solid #2196f3';
            
            let badgesHtml = '';
            if (data.rolls && data.rolls.length > 0) {
                badgesHtml = '<div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">';
                data.rolls.forEach((r, idx) => {
                    const isNat20 = r.dice === 20 && r.raw === 20;
                    const isNat1 = r.dice === 20 && r.raw === 1;
                    const borderColor = isNat20 ? '#4caf50' : (isNat1 ? '#f44336' : '#555');
                    const critBadge = isNat20 ? ' <b style="color:#4caf50;">★ Nat 20!</b>' : (isNat1 ? ' <b style="color:#f44336;">⚠ Nat 1</b>' : '');
                    const calcStr = data.bonus !== 0 ? ` (${r.raw}${bSign})` : '';
                    
                    badgesHtml += `<span style="background: rgba(0,0,0,0.5); padding: 3px 7px; border-radius: 4px; border: 1px solid ${borderColor}; font-size: 12px;">` +
                        `d${r.dice} #${idx+1}: <strong style="font-size:14px; color:${isNat20 ? '#4caf50' : (isNat1 ? '#f44336' : '#ffcc00')};">${r.total}</strong>` +
                        `<span style="color:#aaa; font-size:11px;">${calcStr}</span>${critBadge}</span>`;
                });
                badgesHtml += '</div>';
            }
            
            li.innerHTML = `<div><strong style="color:#ffcc00;">${pName}</strong> tira <strong>${safeEscape(data.expression || '')}</strong>${bLabel}:</div>${badgesHtml}`;
        } else {
            // Modalità: Al Totale (Danno / Somma)
            const bSign = data.bonus > 0 ? `+${data.bonus}` : (data.bonus < 0 ? `${data.bonus}` : '');
            const rawDiceList = data.rolls ? data.rolls.map(r => r.raw) : [];
            const isSingleD20 = data.rolls && data.rolls.length === 1 && data.rolls[0].dice === 20;
            const isNat20 = isSingleD20 && data.rolls[0].raw === 20;
            const isNat1 = isSingleD20 && data.rolls[0].raw === 1;
            const critBadge = isNat20 ? ' <b style="color:#4caf50; font-size:12px;">★ Naturale 20! ★</b>' : (isNat1 ? ' <b style="color:#f44336; font-size:12px;">⚠ Naturale 1! ⚠</b>' : '');
            
            if (data.isSecret) {
                li.style.borderLeft = '3px solid #ab47bc';
                li.style.background = 'rgba(171, 71, 188, 0.15)';
            } else if (isNat20) {
                li.style.borderLeft = '3px solid #4caf50';
            } else if (isNat1) {
                li.style.borderLeft = '3px solid #f44336';
            } else {
                li.style.borderLeft = '3px solid #ffcc00';
            }
            
            let detailStr = '';
            if (rawDiceList.length > 1 || data.bonus !== 0) {
                detailStr = `<div style="font-size: 11px; color: #aaa; margin-top: 2px;">Dadi: [${rawDiceList.join(', ')}]${bSign ? ` ${bSign}` : ''}</div>`;
            }
            
            li.innerHTML = `<div><strong style="color:#ffcc00;">${pName}</strong> tira <strong>${safeEscape(data.expression || '')}${bSign}</strong>: ` +
                `<strong style="font-size:16px; color:${isNat20 ? '#4caf50' : (isNat1 ? '#f44336' : '#ffcc00')};">${data.result}</strong>${critBadge}</div>${detailStr}`;
        }
    } else {
        // Fallback classico: (playerName, dice, bonus, result)
        const pName = safeEscape(playerOrData || "Giocatore");
        const bStr = bonus > 0 ? `+${bonus}` : (bonus < 0 ? `${bonus}` : '');
        const expression = `1d${dice}${bStr}`;
        li.innerHTML = `<strong style="color:#ffcc00;">${pName}</strong> tira ${expression}: <strong style="font-size:16px;">${result}</strong>`;
    }
    
    chatLog.appendChild(li);
    chatLog.scrollTop = chatLog.scrollHeight;
};

window.setupDiceSystem = function(isDM, networkObj) {
    const btnToggleDice = document.getElementById(isDM ? 'btn-toggle-dice' : 'pbtn-dice');
    const btnToggleChat = document.getElementById(isDM ? 'btn-toggle-chat' : 'pbtn-chat');
    const dicePanel = document.getElementById('dice-panel');
    const chatPanel = document.getElementById('chat-panel');
    const diceHeader = document.getElementById('dice-panel-header');
    const chatHeader = document.getElementById('chat-panel-header');
    
    // Rende i pannelli trascinabili
    if (dicePanel) window.makeDraggable(dicePanel, diceHeader || dicePanel);
    if (chatPanel) window.makeDraggable(chatPanel, chatHeader || chatPanel);
    
    if (btnToggleDice && dicePanel) {
        btnToggleDice.addEventListener('click', () => {
            const isHidden = dicePanel.style.display === 'none' || !dicePanel.style.display;
            dicePanel.style.display = isHidden ? 'flex' : 'none';
        });
    }
    
    if (btnToggleChat && chatPanel) {
        btnToggleChat.addEventListener('click', () => {
            const isHidden = chatPanel.style.display === 'none' || !chatPanel.style.display;
            chatPanel.style.display = isHidden ? 'flex' : 'none';
        });
    }

    const btnCloseChat = document.getElementById('btn-close-chat');
    if (btnCloseChat && chatPanel) {
        btnCloseChat.addEventListener('click', () => {
            chatPanel.style.display = 'none';
        });
    }

    // State per selezione dadi
    const selectedDice = { 4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0 };
    let lastRollConfig = null;

    const dicePoolDisplay = document.getElementById('dice-pool-display');
    const btnDiceReset = document.getElementById('btn-dice-reset');
    const bonusInput = document.getElementById('dice-bonus');
    const btnBonusMinus = document.getElementById('btn-bonus-minus');
    const btnBonusPlus = document.getElementById('btn-bonus-plus');
    const modModeSelect = document.getElementById('dice-mod-mode');
    const btnRollDice = document.getElementById('btn-roll-dice');
    const diceRerollContainer = document.getElementById('dice-reroll-container');
    const btnDiceReroll = document.getElementById('btn-dice-reroll');
    const diceRerollLabel = document.getElementById('dice-reroll-label');

    function getSelectedFormula() {
        const parts = [];
        const order = [4, 6, 8, 10, 12, 20, 100];
        order.forEach(d => {
            if (selectedDice[d] > 0) {
                parts.push(`${selectedDice[d]}d${d}`);
            }
        });
        return parts.join(' + ');
    }

    function updateDiceUI() {
        // Aggiorna badge e stile su ogni pulsante dado
        document.querySelectorAll('.roll-btn').forEach(btn => {
            const d = parseInt(btn.getAttribute('data-dice'));
            const count = selectedDice[d] || 0;
            const badge = btn.querySelector('.dice-badge');
            if (badge) {
                if (count > 0) {
                    badge.innerText = count;
                    badge.style.display = 'inline-block';
                    btn.style.borderColor = '#ffcc00';
                    btn.style.color = '#ffcc00';
                    btn.style.background = '#4a4a4a';
                } else {
                    badge.style.display = 'none';
                    btn.style.borderColor = '#484848';
                    btn.style.color = 'white';
                    btn.style.background = '#383838';
                }
            }
        });

        // Aggiorna formula nel display
        if (dicePoolDisplay) {
            const formula = getSelectedFormula();
            const bonus = bonusInput ? (parseInt(bonusInput.value) || 0) : 0;
            const bSign = bonus > 0 ? `+${bonus}` : (bonus < 0 ? `${bonus}` : '');
            const mode = modModeSelect ? modModeSelect.value : 'total';
            
            if (formula) {
                let modSuffix = '';
                if (bonus !== 0) {
                    modSuffix = mode === 'each' ? ` (${bSign} cad.)` : ` (${bSign})`;
                }
                dicePoolDisplay.innerText = formula + modSuffix;
                dicePoolDisplay.style.color = '#ffcc00';
            } else {
                dicePoolDisplay.innerText = 'Nessun dado';
                dicePoolDisplay.style.color = '#888';
            }
        }
    }

    // Reset completo di dadi, bonus e stato
    function resetAll() {
        for (let k in selectedDice) selectedDice[k] = 0;
        if (bonusInput) bonusInput.value = 0;
        if (modModeSelect) modModeSelect.value = 'total';
        lastRollConfig = null;
        if (diceRerollContainer) diceRerollContainer.style.display = 'none';
        updateDiceUI();
    }

    // Ascolta click sui bottoni dadi (incrementa quantità)
    document.querySelectorAll('.roll-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const d = parseInt(btn.getAttribute('data-dice'));
            if (d) {
                selectedDice[d] = (selectedDice[d] || 0) + 1;
                updateDiceUI();
            }
        });

        // Click destro per decrementare
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const d = parseInt(btn.getAttribute('data-dice'));
            if (d && selectedDice[d] > 0) {
                selectedDice[d]--;
                updateDiceUI();
            }
        });
    });

    // Reset dadi e modificatore
    if (btnDiceReset) {
        btnDiceReset.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetAll();
        });
    }

    // Pulsanti Bonus + e -
    if (btnBonusMinus && bonusInput) {
        btnBonusMinus.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            bonusInput.value = (parseInt(bonusInput.value) || 0) - 1;
            updateDiceUI();
        });
    }
    if (btnBonusPlus && bonusInput) {
        btnBonusPlus.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            bonusInput.value = (parseInt(bonusInput.value) || 0) + 1;
            updateDiceUI();
        });
    }
    if (bonusInput) {
        bonusInput.addEventListener('input', () => updateDiceUI());
    }
    if (modModeSelect) {
        modModeSelect.addEventListener('change', () => updateDiceUI());
    }

    // Funzione principale di lancio dadi
    function rollCurrentPool(customConfig = null) {
        let diceList = [];
        let formulaBase = "";
        let bonus = 0;
        let mode = 'total';

        if (customConfig) {
            diceList = customConfig.diceList;
            formulaBase = customConfig.formulaBase;
            bonus = customConfig.bonus;
            mode = customConfig.mode;
        } else {
            let formula = getSelectedFormula();
            bonus = bonusInput ? (parseInt(bonusInput.value) || 0) : 0;
            mode = modModeSelect ? modModeSelect.value : 'total';

            if (!formula) {
                // Se nessun dado selezionato, seleziona e lancia 1d20 di default
                selectedDice[20] = 1;
                updateDiceUI();
                diceList.push(20);
                formulaBase = "1d20";
            } else {
                formulaBase = formula;
                const order = [4, 6, 8, 10, 12, 20, 100];
                order.forEach(d => {
                    const count = selectedDice[d] || 0;
                    for (let i = 0; i < count; i++) {
                        diceList.push(d);
                    }
                });
            }
        }

        // Esegui i tiri casuali
        const rolledItems = [];
        let diceSum = 0;

        diceList.forEach(d => {
            const raw = Math.floor(Math.random() * d) + 1;
            diceSum += raw;
            rolledItems.push({
                dice: d,
                raw: raw,
                total: raw + bonus
            });
        });

        const totalResult = diceSum + bonus;

        // Determina nome giocatore
        let pName = "Giocatore";
        if (isDM) {
            pName = "Master";
        } else if (networkObj && networkObj.playerName) {
            pName = networkObj.playerName;
        }

        const rollId = Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        window.lastRollId = rollId;

        const payload = {
            id: rollId,
            player: pName,
            expression: formulaBase,
            bonus: bonus,
            mode: mode,
            rolls: rolledItems,
            diceSum: diceSum,
            result: totalResult
        };

        // Salva per "Ripeti ultimo tiro"
        lastRollConfig = {
            diceList: [...diceList],
            formulaBase: formulaBase,
            bonus: bonus,
            mode: mode
        };
        if (diceRerollContainer && diceRerollLabel) {
            const bSign = bonus > 0 ? `+${bonus}` : (bonus < 0 ? `${bonus}` : '');
            diceRerollLabel.innerText = formulaBase + bSign;
            diceRerollContainer.style.display = 'block';
        }

        // Appendi localmente
        window.appendRollToChat(payload);

        // Invia agli altri solo se il tiro è pubblico
        const dmPublicCheckbox = document.getElementById('dice-dm-public');
        const chatPublicCheckbox = document.getElementById('chat-rolls-public');
        const isPublic = !isDM || ((chatPublicCheckbox ? chatPublicCheckbox.checked : true) && (!dmPublicCheckbox || dmPublicCheckbox.checked));
        payload.isSecret = !isPublic;

        if (isPublic && networkObj && networkObj.send) {
            networkObj.send({
                type: 'DICE_ROLL',
                payload: payload
            });
        }

        // Apri pannello chat
        if (chatPanel) chatPanel.style.display = 'flex';
    }

    // Bottone Tira Dadi
    if (btnRollDice) {
        btnRollDice.addEventListener('click', (e) => {
            e.preventDefault();
            rollCurrentPool();
        });
    }

    // Bottone Ripeti Tiro
    if (btnDiceReroll) {
        btnDiceReroll.addEventListener('click', (e) => {
            e.preventDefault();
            if (lastRollConfig) rollCurrentPool(lastRollConfig);
        });
    }

    // Sincronizzazione checkbox Pubblico / Segreto (Chat, Statblock, Pannello Dadi)
    const publicCheckboxIds = ['chat-rolls-public', 'statblock-rolls-public', 'dice-dm-public'];
    publicCheckboxIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', (e) => {
                const checked = e.target.checked;
                publicCheckboxIds.forEach(otherId => {
                    const otherEl = document.getElementById(otherId);
                    if (otherEl && otherEl !== e.target) otherEl.checked = checked;
                });
                if (typeof showToast === 'function') {
                    showToast(checked ? "👁️ Tiri mostri/dadi: PUBBLICI (inviati ai giocatori)" : "🔒 Tiri mostri/dadi: SEGRETI (visibili solo al DM)");
                }
            });
        }
    });

    // Inizializza UI
    updateDiceUI();
};
