/**
 * compendium.js - Gestione Compendio Mostri Open5e & Statblock DM
 * Permette di cercare mostri in tempo reale via Open5e, importare JSON e Token da 5e.tools,
 * ripulire tutti i tag e formattazioni interne ({h}, {hom}, {atk}, ecc.),
 * visualizzare la scheda completa e tirare i dadi con 1 click direttamente in chat!
 */

(function() {
    const searchCache = new Map();
    let currentMonster = null;
    let debounceTimer = null;
    let pendingImportTokenSrc = null;

    const compendium = {
        init() {
            this.bindEvents();
            if (typeof window.makeDraggable === 'function') {
                const win = document.getElementById('dm-statblock-window');
                const header = document.getElementById('dm-statblock-header');
                if (win && header) window.makeDraggable(win, header);
            }
        },

        clean5eToolsText(val) {
            if (!val) return '';
            if (Array.isArray(val)) return val.map(v => this.clean5eToolsText(v)).join(' ');
            if (typeof val === 'object' && val.entries) return this.clean5eToolsText(val.entries);
            if (typeof val !== 'string') return String(val);

            let text = val;

            // 1. Tag attacco 5e.tools
            text = text.replace(/\{@atk\s+mw,rw\}/gi, 'Melee or Ranged Weapon Attack: ');
            text = text.replace(/\{@atk\s+mw\}/gi, 'Melee Weapon Attack: ');
            text = text.replace(/\{@atk\s+rw\}/gi, 'Ranged Weapon Attack: ');
            text = text.replace(/\{@atk\s+ms\}/gi, 'Melee Spell Attack: ');
            text = text.replace(/\{@atk\s+rs\}/gi, 'Ranged Spell Attack: ');
            text = text.replace(/\{@atk\s+m,r\}/gi, 'Melee or Ranged Attack Roll: ');
            text = text.replace(/\{@atk\s+m\}/gi, 'Melee Attack Roll: ');
            text = text.replace(/\{@atk\s+r\}/gi, 'Ranged Attack Roll: ');

            // 2. Tag Esito colpo
            text = text.replace(/\{@h\}/gi, 'Hit: ');
            text = text.replace(/\{@hom\}/gi, 'Hit or Miss: ');
            text = text.replace(/\{@m\}/gi, 'Miss: ');

            // 3. Modificatori tiro per colpire e CD
            text = text.replace(/\{@hit\s+([+-]?\d+)\}/gi, '+$1 to hit');
            text = text.replace(/\{@d20\s+([+-]?\d+)\}/gi, '+$1');
            text = text.replace(/\{@dc\s+(\d+)\}/gi, 'DC $1');
            text = text.replace(/\{@recharge\s*(\d*)\}/gi, (m, p1) => p1 ? `(Recharge ${p1}–6)` : '(Recharge 6)');
            text = text.replace(/\{@chance\s+(\d+)\}/gi, '$1%');

            // 4. Danno e Formule dadi
            text = text.replace(/\{@damage\s+([^}]+)\}/gi, '$1');
            text = text.replace(/\{@dice\s+([^}]+)\}/gi, '$1');
            text = text.replace(/\{@d\s+([^}]+)\}/gi, '$1');
            text = text.replace(/\{@scaledamage\s+[^}]*\|([^}]+)\}/gi, '$1');
            text = text.replace(/\{@scaledice\s+[^}]*\|([^}]+)\}/gi, '$1');

            // 5. Formattazione testo
            text = text.replace(/\{@b\s+([^}]+)\}/gi, '<strong>$1</strong>');
            text = text.replace(/\{@i\s+([^}]+)\}/gi, '<em>$1</em>');
            text = text.replace(/\{@u\s+([^}]+)\}/gi, '<u>$1</u>');
            text = text.replace(/\{@s\s+([^}]+)\}/gi, '<s>$1</s>');
            text = text.replace(/\{@note\s+([^}]+)\}/gi, '($1)');

            // 6. Tag generici con separatore pipe (es. {@creature goblin|mm|Goblin})
            text = text.replace(/\{@[a-zA-Z0-9_]+\s+([^}]+)\}/gi, (match, content) => {
                const parts = content.split('|');
                if (parts.length >= 3 && parts[2].trim()) return parts[2].trim();
                return parts[0].trim();
            });

            // 7. Qualsiasi tag residuo senza parametri
            text = text.replace(/\{@[a-zA-Z0-9_]+\}/gi, '');

            return text.trim();
        },

        formatActionWithRolls(rawText, actionName) {
            const cleaned = this.clean5eToolsText(rawText);
            if (!cleaned) return '';

            let text = cleaned;

            // 1. Tiri per colpire: es. "+4 to hit" o "-1 to hit"
            text = text.replace(/([+-]?\d+)\s+to\s+hit/gi, (match, bonus) => {
                const cleanBonus = bonus.startsWith('+') ? bonus : (bonus.startsWith('-') ? bonus : `+${bonus}`);
                return `<span class="statblock-roll-btn" data-formula="${cleanBonus}" data-label="${actionName} (Attacco)" style="background: rgba(239, 83, 80, 0.22); color: #ffb74d; border: 1px solid #ef5350; border-radius: 4px; padding: 1px 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare l'attacco (${cleanBonus})">🎲 ${cleanBonus} to hit</span>`;
            });

            // 2. Formule dadi danno/effetti: es. "1d4", "2d6 + 2", "1d8+3", "3d10 - 1"
            text = text.replace(/\b(\d+d\d+(?:\s*[\+\-]\s*\d+)?)\b/gi, (match, formula) => {
                return `<span class="statblock-roll-btn" data-formula="${formula}" data-label="${actionName} (Danno)" style="background: rgba(255, 183, 77, 0.22); color: #ffe082; border: 1px solid #ffb74d; border-radius: 4px; padding: 1px 6px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare il dado (${formula})">🎲 ${formula}</span>`;
            });

            return text;
        },

        executeRoll(creatureName, formulaStr, rollLabel) {
            if (!formulaStr) return;
            const cleanFormula = formulaStr.trim().replace(/\s+/g, '');
            let diceCount = 1;
            let diceSides = 20;
            let bonus = 0;

            if (/^[+-]?\d+$/.test(cleanFormula)) {
                diceCount = 1;
                diceSides = 20;
                bonus = parseInt(cleanFormula, 10);
            } else {
                const m = cleanFormula.match(/^(\d+)d(\d+)(?:([+-]\d+))?$/i);
                if (m) {
                    diceCount = parseInt(m[1], 10);
                    diceSides = parseInt(m[2], 10);
                    bonus = m[3] ? parseInt(m[3], 10) : 0;
                } else {
                    const m2 = cleanFormula.match(/d(\d+)/i);
                    if (m2) diceSides = parseInt(m2[1], 10);
                }
            }

            const rolledItems = [];
            let diceSum = 0;
            for (let i = 0; i < diceCount; i++) {
                const raw = Math.floor(Math.random() * diceSides) + 1;
                diceSum += raw;
                rolledItems.push({
                    dice: diceSides,
                    raw: raw,
                    total: raw + bonus
                });
            }

            const totalResult = diceSum + bonus;
            const rollId = Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            window.lastRollId = rollId;

            // expr base senza bonus: dice.js aggiungerà automaticamente +bonus evitando il raddoppio
            const expr = `${diceCount}d${diceSides}`;

            // Determina se il tiro deve essere pubblico o segreto per il DM
            const chatPublicCb = document.getElementById('chat-rolls-public');
            const statPublicCb = document.getElementById('statblock-rolls-public');
            const dmPublicCb = document.getElementById('dice-dm-public');
            const isPublic = statPublicCb ? statPublicCb.checked : (chatPublicCb ? chatPublicCb.checked : (dmPublicCb ? dmPublicCb.checked : true));

            const secretTag = isPublic ? '' : ' (🔒 Segreto DM)';

            const payload = {
                id: rollId,
                player: creatureName ? `${creatureName} [${rollLabel}]${secretTag}` : `${rollLabel}${secretTag}`,
                expression: expr,
                bonus: bonus,
                mode: 'total',
                rolls: rolledItems,
                diceSum: diceSum,
                result: totalResult,
                isSecret: !isPublic
            };

            // Appendi localmente alla chat
            if (typeof window.appendRollToChat === 'function') {
                window.appendRollToChat(payload);
            }

            // Invia in rete P2P ai giocatori SOLO se il tiro è pubblico
            const net = (typeof window.network !== 'undefined' && window.network) ? window.network : ((typeof network !== 'undefined') ? network : null);
            if (isPublic && net && typeof net.send === 'function') {
                net.send({
                    type: 'DICE_ROLL',
                    payload: payload
                });
            }

            // Apri e scrolla pannello chat
            const chatPanel = document.getElementById('chat-panel');
            if (chatPanel) {
                chatPanel.style.display = 'flex';
                const chatLog = document.getElementById('chat-log');
                if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
            }
        },

        bindEvents() {
            // Chiusura finestra statblock
            document.getElementById('btn-close-statblock')?.addEventListener('click', () => {
                this.close();
            });

            document.getElementById('btn-open-compendium-from-panel')?.addEventListener('click', () => {
                this.open();
            });

            // Ricerca con debounce e auto-parsing link 5e.tools
            const searchInput = document.getElementById('statblock-search-input');
            if (searchInput) {
                const handleSearchValue = (val) => {
                    let q = val.trim();
                    if (q.includes('5e.tools') && q.includes('#')) {
                        const hash = q.split('#')[1];
                        if (hash) {
                            q = decodeURIComponent(hash).split('_')[0].replace(/\+/g, ' ');
                            searchInput.value = q;
                        }
                    }
                    return q;
                };

                searchInput.addEventListener('input', (e) => {
                    const q = handleSearchValue(e.target.value);
                    clearTimeout(debounceTimer);
                    if (q.length < 2) {
                        const resultsBox = document.getElementById('statblock-search-results');
                        if (resultsBox) resultsBox.style.display = 'none';
                        return;
                    }
                    debounceTimer = setTimeout(() => {
                        this.search(q);
                    }, 300);
                });

                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const q = handleSearchValue(searchInput.value);
                        if (q.length >= 2) this.search(q);
                    }
                });
            }

            document.getElementById('btn-statblock-search')?.addEventListener('click', () => {
                const searchInput = document.getElementById('statblock-search-input');
                let q = searchInput?.value.trim() || '';
                if (q.includes('5e.tools') && q.includes('#')) {
                    const hash = q.split('#')[1];
                    if (hash) {
                        q = decodeURIComponent(hash).split('_')[0].replace(/\+/g, ' ');
                        if (searchInput) searchInput.value = q;
                    }
                }
                if (q && q.length >= 2) this.search(q);
            });

            // Assegnazione a token selezionato
            document.getElementById('btn-assign-statblock')?.addEventListener('click', () => {
                if (!currentMonster) return alert("Seleziona o cerca prima un mostro!");
                this.assignToSelectedToken(currentMonster);
            });

            // Crea nuovo token sulla mappa
            document.getElementById('btn-spawn-statblock-token')?.addEventListener('click', () => {
                if (!currentMonster) return alert("Seleziona o cerca prima un mostro!");
                this.spawnAsToken(currentMonster);
            });

            // Modale Import JSON (5e.tools)
            const modal = document.getElementById('modal-json-import');
            document.getElementById('btn-statblock-json-import')?.addEventListener('click', () => {
                this.setImportTokenPreview(null);
                if (modal) modal.style.display = 'flex';
            });
            document.getElementById('btn-close-json-modal')?.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });

            // Dropzone Token nel modale JSON
            const dropzone = document.getElementById('json-token-dropzone');
            const tokenFileInput = document.getElementById('json-token-file-input');
            const clearTokenBtn = document.getElementById('btn-clear-json-token');

            if (dropzone && tokenFileInput) {
                dropzone.addEventListener('click', (e) => {
                    if (e.target !== clearTokenBtn) {
                        tokenFileInput.click();
                    }
                });
                tokenFileInput.addEventListener('change', (e) => {
                    if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            this.setImportTokenPreview(ev.target.result);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }
                });
                dropzone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropzone.style.borderColor = '#4db6ac';
                    dropzone.style.background = '#252525';
                });
                dropzone.addEventListener('dragleave', () => {
                    dropzone.style.borderColor = '#00897b';
                    dropzone.style.background = '#181818';
                });
                dropzone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropzone.style.borderColor = '#00897b';
                    dropzone.style.background = '#181818';
                    const files = e.dataTransfer.files;
                    if (files && files[0] && files[0].type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            this.setImportTokenPreview(ev.target.result);
                        };
                        reader.readAsDataURL(files[0]);
                    }
                });
            }

            if (clearTokenBtn) {
                clearTokenBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.setImportTokenPreview(null);
                });
            }

            // Incolla globale da clipboard (Ctrl+V) per catturare immagini token al volo
            window.addEventListener('paste', (e) => {
                const isModalOpen = modal && modal.style.display === 'flex';
                const statWin = document.getElementById('dm-statblock-window');
                const isStatOpen = statWin && statWin.style.display !== 'none';

                if (!isModalOpen && !isStatOpen) return;

                const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
                if (items) {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                            const blob = items[i].getAsFile();
                            if (blob) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const dataUrl = event.target.result;
                                    if (isModalOpen) {
                                        this.setImportTokenPreview(dataUrl);
                                    } else if (isStatOpen && currentMonster) {
                                        this.setMonsterTokenImage(dataUrl);
                                    }
                                };
                                reader.readAsDataURL(blob);
                                e.preventDefault();
                                return;
                            }
                        }
                    }
                }
            });

            document.getElementById('btn-confirm-json-import')?.addEventListener('click', () => {
                const textarea = document.getElementById('json-import-textarea');
                const raw = textarea ? textarea.value.trim() : '';
                if (!raw) return alert("Incolla prima il testo JSON!");
                try {
                    const parsed = JSON.parse(raw);
                    const normalized = this.normalize5eToolsMonster(parsed);
                    if (normalized) {
                        if (pendingImportTokenSrc) {
                            normalized.tokenSrc = pendingImportTokenSrc;
                        }
                        this.loadMonster(normalized);
                        if (modal) modal.style.display = 'none';
                        textarea.value = '';
                        this.setImportTokenPreview(null);
                        if (typeof showToast === 'function') showToast(`Mostro "${normalized.name}" importato con successo!`);
                    } else {
                        alert("Formato JSON non riconosciuto o incompleto.");
                    }
                } catch (err) {
                    alert("Errore nel parsing del JSON: " + err.message);
                }
            });

            // Chiudi tendina risultati se si clicca fuori
            document.addEventListener('click', (e) => {
                const resultsBox = document.getElementById('statblock-search-results');
                const searchInput = document.getElementById('statblock-search-input');
                if (resultsBox && !resultsBox.contains(e.target) && e.target !== searchInput) {
                    resultsBox.style.display = 'none';
                }
            });
        },

        setImportTokenPreview(dataUrl) {
            pendingImportTokenSrc = dataUrl;
            const img = document.getElementById('json-token-img');
            const icon = document.getElementById('json-token-placeholder-icon');
            const status = document.getElementById('json-token-status-text');
            const clearBtn = document.getElementById('btn-clear-json-token');
            if (img && icon) {
                if (dataUrl) {
                    img.src = dataUrl;
                    img.style.display = 'block';
                    icon.style.display = 'none';
                    if (status) status.innerHTML = '<span style="color:#4caf50; font-weight:bold;">✅ Token acquisito pronto per la mappa!</span>';
                    if (clearBtn) clearBtn.style.display = 'inline-block';
                } else {
                    img.src = '';
                    img.style.display = 'none';
                    icon.style.display = 'inline';
                    if (status) status.innerHTML = 'Click destro sul token in 5e.tools &rarr; <em>"Copia immagine"</em> e premi <strong>Ctrl+V</strong> qui.';
                    if (clearBtn) clearBtn.style.display = 'none';
                }
            }
        },

        setMonsterTokenImage(dataUrl) {
            if (!currentMonster) return;
            currentMonster.tokenSrc = dataUrl;
            const img = document.getElementById('statblock-avatar-img');
            if (img) img.src = dataUrl;

            // Se abbiamo token selezionati che usano questa scheda, aggiorniamo la loro immagine live
            if (engine && engine.tokens) {
                const targetTokens = (engine.selectedTokens && engine.selectedTokens.size > 0)
                    ? engine.tokens.filter(t => engine.selectedTokens.has(t.id))
                    : (engine.selectedTokenId ? [engine.tokens.find(t => t.id === engine.selectedTokenId)].filter(Boolean) : []);

                targetTokens.forEach(t => {
                    if (t.statblock && t.statblock.name === currentMonster.name) {
                        const newImg = new Image();
                        newImg.onload = () => {
                            t.imageObj = newImg;
                            t.src = dataUrl;
                            engine.renderAll();
                            if (typeof window.syncState === 'function') window.syncState(true, true);
                        };
                        newImg.src = dataUrl;
                    }
                });
            }

            if (typeof showToast === 'function') {
                showToast(`Token immagine abbinato a "${currentMonster.name}"!`);
            }
        },

        async search(query) {
            const resultsBox = document.getElementById('statblock-search-results');
            if (!resultsBox) return;

            const qLower = query.toLowerCase();
            if (searchCache.has(qLower)) {
                this.renderSearchResults(searchCache.get(qLower));
                return;
            }

            resultsBox.style.display = 'block';
            resultsBox.innerHTML = '<div style="padding: 10px; color: #aaa; text-align: center; font-size: 11px;">🔍 Ricerca in corso su Open5e...</div>';

            try {
                const url = `https://api.open5e.com/v1/monsters/?search=${encodeURIComponent(query)}&limit=15`;
                const resp = await fetch(url);
                if (!resp.ok) throw new Error("HTTP " + resp.status);
                const data = await resp.json();
                const list = data.results || [];
                searchCache.set(qLower, list);
                this.renderSearchResults(list);
            } catch (err) {
                console.error("Compendium search error:", err);
                resultsBox.innerHTML = `<div style="padding: 10px; color: #ef5350; text-align: center; font-size: 11px;">Errore connessione: ${err.message}. Verifica la connessione internet.</div>`;
            }
        },

        renderSearchResults(list) {
            const resultsBox = document.getElementById('statblock-search-results');
            if (!resultsBox) return;

            if (!list || list.length === 0) {
                resultsBox.style.display = 'block';
                resultsBox.innerHTML = '<div style="padding: 10px; color: #888; text-align: center; font-size: 11px;">Nessun mostro trovato. Prova un termine in inglese (es. Dragon, Goblin, Skeleton).</div>';
                return;
            }

            resultsBox.innerHTML = '';
            resultsBox.style.display = 'block';

            list.forEach(m => {
                const item = document.createElement('div');
                item.style.cssText = 'padding: 8px 10px; border-bottom: 1px solid #2a2a2a; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.15s; font-size: 11.5px;';
                item.onmouseenter = () => item.style.background = '#2a1a1a';
                item.onmouseleave = () => item.style.background = 'transparent';

                const cr = m.challenge_rating || m.cr || '-';
                const hp = m.hit_points || '-';
                const ac = m.armor_class || '-';
                const type = (m.size ? m.size + ' ' : '') + (m.type || '');

                item.innerHTML = `
                    <div>
                        <strong style="color: #ef5350; font-size: 12px;">${m.name}</strong>
                        <div style="color: #888; font-size: 10px;">${type}</div>
                    </div>
                    <div style="text-align: right; color: #bbb; font-size: 11px; white-space: nowrap;">
                        <span style="color: #4fc3f7;" title="Classe Armatura">🛡️ ${ac}</span> | 
                        <span style="color: #ef5350;" title="Punti Ferita">❤️ ${hp}</span> | 
                        <span style="color: #ffb74d;" title="Grado Sfida">CR ${cr}</span>
                    </div>
                `;

                item.onclick = () => {
                    resultsBox.style.display = 'none';
                    this.loadMonster(m);
                };

                resultsBox.appendChild(item);
            });
        },

        loadMonster(monster) {
            currentMonster = monster;
            this.renderStatblock(monster);
            this.updateAssignButtonText();
        },

        updateAssignButtonText() {
            const btn = document.getElementById('btn-assign-statblock');
            if (!btn) return;
            const hasSelected = engine && ((engine.selectedTokens && engine.selectedTokens.size > 0) || engine.selectedTokenId);
            if (hasSelected && currentMonster) {
                const count = (engine.selectedTokens && engine.selectedTokens.size > 1) ? ` (${engine.selectedTokens.size} Token)` : '';
                btn.innerHTML = `<span>⚡ Assegna "${currentMonster.name}"${count}</span>`;
                btn.style.background = '#2e7d32';
            } else if (currentMonster) {
                btn.innerHTML = `<span>⚡ Assegna al Token Selezionato</span>`;
                btn.style.background = '#388e3c';
            }
        },

        formatMod(val) {
            if (val === undefined || val === null) return '+0';
            const num = parseInt(val) || 10;
            const mod = Math.floor((num - 10) / 2);
            return (mod >= 0 ? '+' : '') + mod;
        },

        generateLetterToken(monster) {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');

            let color = '#8d6e63';
            const typeLower = (monster.type || '').toLowerCase();
            if (typeLower.includes('dragon')) color = '#c62828';
            else if (typeLower.includes('undead')) color = '#455a64';
            else if (typeLower.includes('fiend')) color = '#ad1457';
            else if (typeLower.includes('aberration')) color = '#6a1b9a';
            else if (typeLower.includes('humanoid')) color = '#2e7d32';
            else if (typeLower.includes('beast')) color = '#e65100';
            else if (typeLower.includes('elemental')) color = '#00838f';

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(64, 64, 60, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 50px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const initial = (monster.name || 'M').charAt(0).toUpperCase();
            ctx.fillText(initial, 64, 64);

            return canvas.toDataURL('image/png');
        },

        renderStatblock(m) {
            const placeholder = document.getElementById('statblock-placeholder');
            const details = document.getElementById('statblock-details');
            if (!details) return;

            if (placeholder) placeholder.style.display = 'none';
            details.style.display = 'block';

            const sizeType = `${m.size || 'Medium'} ${m.type || 'creature'}${m.subtype ? ' (' + m.subtype + ')' : ''}, ${m.alignment || 'unaligned'}`;
            const acDesc = m.armor_desc ? ` (${m.armor_desc})` : '';
            const hpDice = m.hit_dice ? ` (${m.hit_dice})` : '';
            
            // Speed formatting
            let speedStr = '30 ft.';
            if (typeof m.speed === 'string') speedStr = m.speed;
            else if (typeof m.speed === 'object' && m.speed !== null) {
                speedStr = Object.entries(m.speed).map(([k, v]) => `${k} ${v} ft.`).join(', ');
            }

            // Stats row interattiva per tiri su caratteristiche
            const stats = [
                { k: 'STR', val: m.strength || 10 },
                { k: 'DEX', val: m.dexterity || 10 },
                { k: 'CON', val: m.constitution || 10 },
                { k: 'INT', val: m.intelligence || 10 },
                { k: 'WIS', val: m.wisdom || 10 },
                { k: 'CHA', val: m.charisma || 10 }
            ];

            let statsHtml = '<div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; text-align: center; background: #251818; padding: 6px 2px; border-radius: 4px; border: 1px solid #4a2222; margin: 8px 0;">';
            stats.forEach(s => {
                const mod = this.formatMod(s.val);
                statsHtml += `
                    <div class="statblock-roll-btn" data-formula="${mod}" data-label="Prova ${s.k}" style="cursor: pointer; padding: 4px 1px; border-radius: 4px; background: rgba(0,0,0,0.3); border: 1px solid rgba(239, 83, 80, 0.2); transition: all 0.15s;" title="Clicca per tirare Prova / Tiro Salvezza ${s.k} (${mod})">
                        <div style="font-weight: bold; color: #ef5350; font-size: 11px;">${s.k}</div>
                        <div style="font-size: 12px; color: #fff;">${s.val} <span style="color:#ffb74d; font-weight:bold; font-size:11px;">(${mod})</span></div>
                    </div>
                `;
            });
            statsHtml += '</div>';

            // Saves & traits
            const saves = [];
            const addSave = (name, val) => {
                if (val !== null && val !== undefined) {
                    const num = parseInt(val);
                    const sign = num >= 0 ? '+' : '';
                    saves.push(`<span class="statblock-roll-btn" data-formula="${sign}${num}" data-label="TS ${name}" style="background: rgba(239, 83, 80, 0.2); color: #ffb74d; border: 1px solid #ef5350; border-radius: 4px; padding: 1px 5px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare il Tiro Salvezza ${name}">🎲 ${name} ${sign}${num}</span>`);
                }
            };
            addSave('Str', m.strength_save);
            addSave('Dex', m.dexterity_save);
            addSave('Con', m.constitution_save);
            addSave('Int', m.intelligence_save);
            addSave('Wis', m.wisdom_save);
            addSave('Cha', m.charisma_save);

            let skillsStr = '';
            if (typeof m.skills === 'object' && m.skills !== null) {
                skillsStr = Object.entries(m.skills).map(([k, v]) => {
                    const skillName = k.charAt(0).toUpperCase() + k.slice(1);
                    const num = parseInt(v);
                    const sign = num >= 0 ? '+' : '';
                    return `<span class="statblock-roll-btn" data-formula="${sign}${num}" data-label="${skillName}" style="background: rgba(255, 183, 77, 0.2); color: #ffe082; border: 1px solid #ffb74d; border-radius: 4px; padding: 1px 5px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Clicca per tirare la prova ${skillName}">🎲 ${skillName} ${sign}${num}</span>`;
                }).join(', ');
            }

            // Build Actions con tiri dadi clikkabili
            let actionsHtml = '';
            const actions = m.actions || [];
            if (actions.length > 0) {
                actionsHtml += '<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">Actions</div>';
                actions.forEach(a => {
                    const formattedDesc = this.formatActionWithRolls(a.desc, a.name);
                    actionsHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${a.name}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
            }

            // Special Abilities (Tratti)
            let traitsHtml = '';
            const traits = m.special_abilities || [];
            if (traits.length > 0) {
                traitsHtml += '<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">Traits</div>';
                traits.forEach(t => {
                    const formattedDesc = this.formatActionWithRolls(t.desc, t.name);
                    traitsHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${t.name}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
            }

            // Reactions (Reazioni)
            let reactHtml = '';
            const reactions = m.reactions || [];
            if (reactions.length > 0) {
                reactHtml += '<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">Reactions</div>';
                reactions.forEach(r => {
                    const formattedDesc = this.formatActionWithRolls(r.desc, r.name);
                    reactHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${r.name}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
            }

            // Legendary Actions
            let legHtml = '';
            const leg = m.legendary_actions || [];
            if (leg.length > 0) {
                legHtml += '<div style="font-size: 13px; font-weight: bold; color: #ef5350; border-bottom: 1px solid #b71c1c; padding-bottom: 2px; margin: 10px 0 6px 0;">Legendary Actions</div>';
                if (m.legendary_desc) legHtml += `<div style="font-style: italic; color: #aaa; margin-bottom: 6px;">${this.clean5eToolsText(m.legendary_desc)}</div>`;
                leg.forEach(a => {
                    const formattedDesc = this.formatActionWithRolls(a.desc, a.name);
                    legHtml += `
                        <div style="margin-bottom: 8px; line-height: 1.45;">
                            <strong style="color: #ffb74d; font-size: 12.5px;">${a.name}.</strong> 
                            <span style="color: #ccc;">${formattedDesc}</span>
                        </div>
                    `;
                });
            }

            const tokenAvatarSrc = m.tokenSrc || this.generateLetterToken(m);

            details.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #b71c1c; padding-bottom: 6px; margin-bottom: 8px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 18px; font-weight: bold; color: #ef5350; font-family: serif; letter-spacing: 0.5px;">${m.name}</div>
                        <div style="font-style: italic; color: #9e9e9e; font-size: 11px;">${sizeType}</div>
                    </div>
                    <div id="statblock-avatar-wrapper" style="position: relative; cursor: pointer; margin-left: 10px; flex-shrink: 0;" title="Clicca per cambiare immagine o premi Ctrl+V con un token copiato negli appunti">
                        <img id="statblock-avatar-img" src="${tokenAvatarSrc}" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid #ef5350; object-fit: cover; background: #111; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">
                        <span style="position: absolute; bottom: -2px; right: -2px; background: #b71c1c; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white;" title="Cambia Token">📷</span>
                        <input type="file" id="statblock-avatar-file-input" accept="image/*" style="display: none;">
                    </div>
                </div>

                <div style="color: #ef9a9a; line-height: 1.4; font-size: 11.5px;">
                    <div><strong style="color: #ef5350;">Armor Class:</strong> <span style="color: #fff; font-weight:bold;">${m.armor_class || 10}</span>${acDesc}</div>
                    <div><strong style="color: #ef5350;">Hit Points:</strong> <span style="color: #fff; font-weight:bold;">${m.hit_points || 10}</span>${hpDice}</div>
                    <div><strong style="color: #ef5350;">Speed:</strong> <span style="color: #fff;">${speedStr}</span></div>
                </div>

                ${statsHtml}

                <div style="color: #ddd; font-size: 11px; line-height: 1.4;">
                    ${saves.length > 0 ? `<div style="margin-bottom: 3px;"><strong style="color: #ef5350;">Saving Throws:</strong> ${saves.join(' ')}</div>` : ''}
                    ${skillsStr ? `<div style="margin-bottom: 3px;"><strong style="color: #ef5350;">Skills:</strong> ${skillsStr}</div>` : ''}
                    ${m.damage_resistances ? `<div><strong style="color: #ef5350;">Damage Resistances:</strong> ${this.clean5eToolsText(m.damage_resistances)}</div>` : ''}
                    ${m.damage_immunities ? `<div><strong style="color: #ef5350;">Damage Immunities:</strong> ${this.clean5eToolsText(m.damage_immunities)}</div>` : ''}
                    ${m.condition_immunities ? `<div><strong style="color: #ef5350;">Condition Immunities:</strong> ${this.clean5eToolsText(m.condition_immunities)}</div>` : ''}
                    ${m.senses ? `<div><strong style="color: #ef5350;">Senses:</strong> ${this.clean5eToolsText(m.senses)}</div>` : ''}
                    ${m.languages ? `<div><strong style="color: #ef5350;">Languages:</strong> ${this.clean5eToolsText(m.languages)}</div>` : ''}
                    <div style="margin-top: 3px;"><strong style="color: #ef5350;">Challenge:</strong> <span style="color:#ffb74d; font-weight:bold;">${m.challenge_rating || m.cr || '-'}</span></div>
                </div>

                ${traitsHtml}
                ${actionsHtml}
                ${reactHtml}
                ${legHtml}
            `;

            // Bind click eventi sui bottoni tiro dado interattivi
            details.querySelectorAll('.statblock-roll-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const formula = btn.getAttribute('data-formula');
                    const label = btn.getAttribute('data-label') || 'Tiro';
                    this.executeRoll(m.name, formula, label);
                });
                btn.addEventListener('mouseenter', () => {
                    btn.style.filter = 'brightness(1.3)';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.filter = 'none';
                });
            });

            // Bind avatar click & file input
            const avatarWrapper = document.getElementById('statblock-avatar-wrapper');
            const avatarInput = document.getElementById('statblock-avatar-file-input');
            if (avatarWrapper && avatarInput) {
                avatarWrapper.onclick = () => avatarInput.click();
                avatarInput.onchange = (e) => {
                    if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            this.setMonsterTokenImage(ev.target.result);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }
                };
            }
        },

        normalize5eToolsMonster(raw) {
            if (!raw || typeof raw !== 'object') return null;
            const m = Array.isArray(raw.monster) ? raw.monster[0] : (raw.name ? raw : null);
            if (!m || !m.name) return null;

            let ac = 10;
            if (Array.isArray(m.ac)) {
                ac = typeof m.ac[0] === 'number' ? m.ac[0] : (m.ac[0]?.ac || 10);
            } else if (typeof m.ac === 'number') {
                ac = m.ac;
            } else if (m.armor_class) {
                ac = parseInt(m.armor_class) || 10;
            }

            let hp = 10;
            let hpDice = '';
            if (m.hp && typeof m.hp === 'object') {
                hp = m.hp.average || 10;
                hpDice = m.hp.formula || '';
            } else if (m.hit_points) {
                hp = parseInt(m.hit_points) || 10;
            }

            const actions = [];
            const rawActions = m.action || m.actions || [];
            rawActions.forEach(act => {
                actions.push({
                    name: act.name || 'Action',
                    desc: this.clean5eToolsText(act.entries || act.desc)
                });
            });

            const traits = [];
            const rawTraits = m.trait || m.special_abilities || [];
            rawTraits.forEach(tr => {
                traits.push({
                    name: tr.name || 'Trait',
                    desc: this.clean5eToolsText(tr.entries || tr.desc)
                });
            });

            const reactions = [];
            const rawReactions = m.reaction || m.reactions || [];
            rawReactions.forEach(re => {
                reactions.push({
                    name: re.name || 'Reaction',
                    desc: this.clean5eToolsText(re.entries || re.desc)
                });
            });

            const legendary = [];
            const rawLeg = m.legendary || m.legendary_actions || [];
            rawLeg.forEach(leg => {
                legendary.push({
                    name: leg.name || 'Legendary Action',
                    desc: this.clean5eToolsText(leg.entries || leg.desc)
                });
            });

            return {
                name: m.name,
                size: Array.isArray(m.size) ? m.size[0] : (m.size || 'Medium'),
                type: typeof m.type === 'object' ? (m.type.type || 'creature') : (m.type || 'creature'),
                alignment: Array.isArray(m.alignment) ? m.alignment.join(' ') : (m.alignment || 'unaligned'),
                armor_class: ac,
                armor_desc: '',
                hit_points: hp,
                hit_dice: hpDice,
                speed: m.speed || '30 ft.',
                strength: m.str || m.strength || 10,
                dexterity: m.dex || m.dexterity || 10,
                constitution: m.con || m.constitution || 10,
                intelligence: m.int || m.intelligence || 10,
                wisdom: m.wis || m.wisdom || 10,
                charisma: m.cha || m.charisma || 10,
                challenge_rating: m.cr ? (typeof m.cr === 'object' ? m.cr.cr : m.cr) : (m.challenge_rating || '-'),
                actions: actions,
                special_abilities: traits,
                reactions: reactions,
                legendary_actions: legendary,
                legendary_desc: m.legendaryHeader ? this.clean5eToolsText(m.legendaryHeader) : '',
                languages: this.clean5eToolsText(m.languages),
                senses: this.clean5eToolsText(m.senses),
                tokenSrc: m.tokenSrc || null
            };
        },

        assignToSelectedToken(monster) {
            if (!engine || !engine.tokens) return;
            const targetTokens = (engine.selectedTokens && engine.selectedTokens.size > 0)
                ? engine.tokens.filter(t => engine.selectedTokens.has(t.id))
                : (engine.selectedTokenId ? [engine.tokens.find(t => t.id === engine.selectedTokenId)].filter(Boolean) : []);

            if (targetTokens.length === 0) {
                alert("Seleziona prima almeno un token sulla mappa cliccandoci sopra!");
                return;
            }

            const hpVal = parseInt(monster.hit_points) || 10;
            const acVal = parseInt(monster.armor_class) || 10;

            targetTokens.forEach(token => {
                token.statblock = JSON.parse(JSON.stringify(monster));
                token.ac = acVal;
                // SEMPRE FULL VITA!
                token.hpMax = hpVal;
                token.hpCurrent = hpVal;
                token.hpVisibleToPlayers = true;

                // Se il mostro ha un'immagine di token personalizzata, aggiorniamo la grafica
                if (monster.tokenSrc) {
                    const newImg = new Image();
                    newImg.onload = () => {
                        token.imageObj = newImg;
                        token.src = monster.tokenSrc;
                        engine.renderAll();
                        if (typeof window.syncState === 'function') window.syncState(true, true);
                    };
                    newImg.src = monster.tokenSrc;
                }

                // Se presente in iniziativa, aggiorna
                if (engine.initiative && engine.initiative.participants) {
                    const p = engine.initiative.participants.find(x => x.tokenId === token.id);
                    if (p) {
                        p.hpCurrent = hpVal;
                        p.hpMax = hpVal;
                        p.ac = acVal;
                    }
                }
            });

            // Aggiorna controlli barra laterale se uno è selezionato
            const prim = engine.tokens.find(t => t.id === engine.selectedTokenId);
            if (prim && typeof window.updateSelectedTokenControls === 'function') {
                window.updateSelectedTokenControls(prim);
            }

            if (engine.initiative && typeof renderTrackerList === 'function') {
                renderTrackerList();
            }

            engine.renderAll();
            if (typeof window.syncState === 'function') window.syncState(true, true);
            else if (typeof syncState === 'function') syncState(true, true);

            if (typeof showToast === 'function') {
                showToast(`Scheda "${monster.name}" assegnata a ${targetTokens.length} token (Full PV: ${hpVal}, CA: ${acVal})!`);
            }
        },

        spawnAsToken(monster) {
            if (!engine) return;
            const sizeMap = { 'tiny': 1, 'small': 1, 'medium': 1, 'large': 2, 'huge': 3, 'gargantuan': 4, 't': 1, 's': 1, 'm': 1, 'l': 2, 'h': 3, 'g': 4 };
            const sizeKey = (monster.size || 'm').toLowerCase();
            const sizeMult = sizeMap[sizeKey] || 1;
            const pxSize = engine.grid.size * sizeMult;

            const tokenSrc = monster.tokenSrc || this.generateLetterToken(monster);

            // Posiziona al centro della vista
            const centerWorld = engine.screenToWorld(engine.layers.ui.width/2, engine.layers.ui.height/2);
            const effOffsetX = (engine.grid.offsetX || 0) % engine.grid.size;
            const effOffsetY = (engine.grid.offsetY || 0) % engine.grid.size;
            const snappedX = Math.round((centerWorld.x - effOffsetX) / engine.grid.size) * engine.grid.size + effOffsetX;
            const snappedY = Math.round((centerWorld.y - effOffsetY) / engine.grid.size) * engine.grid.size + effOffsetY;

            // Progressione nome
            let baseName = monster.name || 'Monster';
            let maxNum = 0;
            let foundAny = false;
            engine.tokens.forEach(t => {
                const tName = t.name || '';
                if (tName === baseName) {
                    foundAny = true;
                    if (maxNum < 1) maxNum = 1;
                } else if (tName.startsWith(baseName + ' ')) {
                    foundAny = true;
                    const numPart = parseInt(tName.substring(baseName.length + 1));
                    if (!isNaN(numPart) && numPart > maxNum) maxNum = numPart;
                }
            });
            const assignedName = (foundAny || maxNum > 0) ? `${baseName} ${maxNum + 1}` : `${baseName} 1`;

            const imgObj = new Image();
            imgObj.onload = () => {
                const hpVal = parseInt(monster.hit_points) || 10;
                const acVal = parseInt(monster.armor_class) || 10;

                const token = {
                    id: 'token_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                    name: assignedName,
                    nameVisibility: 'all',
                    originalName: monster.name,
                    x: snappedX,
                    y: snappedY,
                    width: pxSize,
                    height: pxSize,
                    sizeMultiplier: sizeMult,
                    src: tokenSrc,
                    visible: true,
                    imageObj: imgObj,
                    // Statistiche complete
                    ac: acVal,
                    hpMax: hpVal,
                    hpCurrent: hpVal,
                    hpVisibleToPlayers: true,
                    statblock: JSON.parse(JSON.stringify(monster))
                };

                engine.tokens.push(token);
                engine.selectedTokens.clear();
                engine.selectedTokens.add(token.id);
                engine.selectedTokenId = token.id;

                if (typeof window.updateSelectedTokenControls === 'function') {
                    window.updateSelectedTokenControls(token);
                }

                engine.renderAll();
                if (typeof window.syncState === 'function') window.syncState(true, true);
                else if (typeof syncState === 'function') syncState(true, true);
                if (typeof updateMapTokensGallery === 'function') updateMapTokensGallery();
                if (typeof showToast === 'function') showToast(`Creato token "${assignedName}" (Full PV: ${hpVal}, CA: ${acVal})!`);
            };
            imgObj.src = tokenSrc;
        },

        open(statblockToDisplay = null) {
            const win = document.getElementById('dm-statblock-window');
            if (!win) return;
            win.style.display = 'flex';

            if (statblockToDisplay) {
                this.loadMonster(statblockToDisplay);
            } else if (engine && engine.selectedTokenId) {
                const t = engine.tokens.find(tok => tok.id === engine.selectedTokenId);
                if (t && t.statblock) {
                    this.loadMonster(t.statblock);
                } else {
                    this.updateAssignButtonText();
                }
            } else {
                this.updateAssignButtonText();
            }
        },

        close() {
            const win = document.getElementById('dm-statblock-window');
            if (win) win.style.display = 'none';
        }
    };

    window.compendium = compendium;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => compendium.init());
    } else {
        compendium.init();
    }
})();
