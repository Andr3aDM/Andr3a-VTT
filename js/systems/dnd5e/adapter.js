// js/systems/dnd5e/adapter.js
// Adattatore del sistema 5ª Edizione (5e) per il SystemManager (id interno 'dnd5e', invariato per compatibilità)

(function () {
    const dnd5eAdapter = {
        id: 'dnd5e',
        name: 'Dungeons & Dragons 5e',
        badge: '⚔️ 5e',
        optionLabel: '⚔️ 5ª Edizione (5e) (Default)',
        // Interfaccia: etichetta della campagna e caselle CA / PV temporanei visibili
        ui: {
            badge: '⚔️ 5e',
            badgeBg: '#1b3a4b',
            badgeColor: '#4dd0e1',
            badgeBorder: '#00acc1',
            hideAc: false,
            hideTempHp: false,
            // Pannello token del Master: pulsanti Scheda Mostro / Scheda PG
            statblockIcon: '📜',
            statblockLabel: '📜 Mostro',
            statblockTitle: 'Cerca e assegna scheda statistiche mostro',
            pcIcon: '🧙',
            pcLabel: '🧙 Scheda PG',
            pcTitle: 'Apri o Importa Scheda Personaggio (PG)',
            pcTitleNamed: 'Apri Scheda PG: {name} (Liv. {level})',
            // Pannello token del Giocatore
            playerPcLabel: '🧙 Apri Scheda PG',
            playerPcTitle: 'Apri la Scheda del tuo Personaggio',
            playerStatblockLabel: '🐉 Scheda Creatura / Mostro',
            // Un token "personaggi" senza scheda puo' aprire la scheda PG col doppio clic?
            pcWithoutSheet: false
        },

        // Una scheda 5e ha le caratteristiche (abilities.str)
        matchesSheet(pcSheet) {
            return !!(pcSheet && pcSheet.abilities && pcSheet.abilities.str);
        },

        // Sempre la scheda 5e vera, mai il router window.pcSheetManager (restituirlo creerebbe un ciclo infinito)
        getSheetManager() {
            return window.dnd5eSheetManager || window._legacyPcSheetManager || null;
        },

        getCompendium() {
            return window.compendium || null;
        },

        // Calcolo iniziativa D&D 5e: 1d20 + Mod Destrezza
        rollInitiativeForToken(token) {
            const d20 = Math.floor(Math.random() * 20) + 1;
            let mod = 0;
            if (token) {
                if (token.pcSheet && typeof token.pcSheet.initBonus === 'number') {
                    mod = token.pcSheet.initBonus;
                } else if (token.pcSheet && token.pcSheet.abilities && token.pcSheet.abilities.dex) {
                    mod = token.pcSheet.abilities.dex.mod || 0;
                } else if (token.statblock && typeof token.statblock.dexterity === 'number') {
                    mod = Math.floor((token.statblock.dexterity - 10) / 2);
                }
            }
            return { roll: d20, mod, total: d20 + mod };
        }
    };

    if (typeof window !== 'undefined' && window.systemManager) {
        window.systemManager.registerSystem('dnd5e', dnd5eAdapter);
    }
})();
