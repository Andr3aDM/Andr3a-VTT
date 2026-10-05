class StorageDB {
    constructor() {
        this.dbName = 'VTT_DB';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.dbName, this.dbVersion);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('campaigns')) {
                    db.createObjectStore('campaigns', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('maps')) {
                    const mapStore = db.createObjectStore('maps', { keyPath: 'id' });
                    mapStore.createIndex('campaignId', 'campaignId', { unique: false });
                }
            };
            req.onsuccess = (e) => { this.db = e.target.result; resolve(); };
            req.onerror = (e) => reject(e.target.error);
        });
    }

    async _getAll(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async getCampaigns() {
        return this._getAll('campaigns');
    }

    async addCampaign(name) {
        const campaign = { id: 'camp_' + Date.now(), name };
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('campaigns', 'readwrite');
            tx.objectStore('campaigns').add(campaign);
            tx.oncomplete = () => resolve(campaign);
            tx.onerror = () => reject(tx.error);
        });
    }

    async deleteCampaign(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['campaigns', 'maps'], 'readwrite');
            tx.objectStore('campaigns').delete(id);
            
            // Delete associated maps
            const index = tx.objectStore('maps').index('campaignId');
            const req = index.getAllKeys(id);
            req.onsuccess = () => {
                req.result.forEach(mapId => {
                    tx.objectStore('maps').delete(mapId);
                });
            };
            
            tx.oncomplete = () => resolve();
        });
    }

    async getMapsByCampaign(campaignId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('maps', 'readonly');
            const index = tx.objectStore('maps').index('campaignId');
            const req = index.getAll(campaignId);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async saveMap(campaignId, mapName, mapImageBase64, state, existingId = null) {
        const map = {
            id: existingId || 'map_' + Date.now(),
            campaignId,
            name: mapName,
            mapImageBase64,
            state
        };
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('maps', 'readwrite');
            tx.objectStore('maps').put(map);
            tx.oncomplete = () => resolve(map);
            tx.onerror = () => reject(tx.error);
        });
    }

    async deleteMap(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('maps', 'readwrite');
            tx.objectStore('maps').delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async exportCampaign(campaignId) {
        const tx = this.db.transaction(['campaigns', 'maps'], 'readonly');
        const campaignReq = tx.objectStore('campaigns').get(campaignId);
        const mapsIndex = tx.objectStore('maps').index('campaignId');
        const mapsReq = mapsIndex.getAll(campaignId);
        
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => {
                resolve({
                    campaign: campaignReq.result,
                    maps: mapsReq.result
                });
            };
            tx.onerror = () => reject(tx.error);
        });
    }

    async importCampaign(data) {
        if (!data.campaign || !data.maps) throw new Error("Formato salvataggio non valido");
        
        // Generate new IDs to prevent collisions across devices
        const newCampId = 'camp_' + Date.now() + '_' + Math.floor(Math.random()*1000);
        data.campaign.id = newCampId;
        
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['campaigns', 'maps'], 'readwrite');
            tx.objectStore('campaigns').add(data.campaign);
            
            data.maps.forEach(m => {
                m.id = 'map_' + Date.now() + '_' + Math.floor(Math.random()*1000);
                m.campaignId = newCampId;
                tx.objectStore('maps').add(m);
            });
            
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
}
const vttDB = new StorageDB();
