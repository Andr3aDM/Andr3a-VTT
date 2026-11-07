// js/systems/dnd5e/adapter.js
// Adattatore ufficiale D&D 5ª Edizione per il SystemManager

(function () {
    const dnd5eAdapter = {
        id: 'dnd5e',
        name: 'Dungeons & Dragons 5e',
        badge: '⚔️ D&D 5e',

        getSheetManager() {
            return window.dnd5eSheetManager || window.pcSheetManager;
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
