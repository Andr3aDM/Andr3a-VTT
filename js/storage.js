class StorageDB {
    constructor() {
        this.dbName = 'VTT_DB';
        this.dbVersion = 2;
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
                if (!db.objectStoreNames.contains('tokens')) {
                    db.createObjectStore('tokens', { keyPath: 'id' });
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

    async getCampaign(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('campaigns', 'readonly');
            const req = tx.objectStore('campaigns').get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async addCampaign(name) {
        const campaign = { id: 'camp_' + Date.now(), name, folders: [] };
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('campaigns', 'readwrite');
            tx.objectStore('campaigns').add(campaign);
            tx.oncomplete = () => resolve(campaign);
            tx.onerror = () => reject(tx.error);
        });
    }

    async addFolderToCampaign(campaignId, folderName) {
        const campaign = await this.getCampaign(campaignId);
        if (!campaign) throw new Error("Campagna non trovata");
        if (!campaign.folders) campaign.folders = [];
        if (!campaign.folders.includes(folderName)) {
            campaign.folders.push(folderName);
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction('campaigns', 'readwrite');
                tx.objectStore('campaigns').put(campaign);
                tx.oncomplete = () => resolve(campaign);
                tx.onerror = () => reject(tx.error);
            });
        }
        return campaign;
    }

    async deleteFolderFromCampaign(campaignId, folderName) {
        const campaign = await this.getCampaign(campaignId);
        if (!campaign) return;
        if (campaign.folders) {
            campaign.folders = campaign.folders.filter(f => f !== folderName);
        }
        
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['campaigns', 'maps'], 'readwrite');
            tx.objectStore('campaigns').put(campaign);
            
            const mapStore = tx.objectStore('maps');
            const index = mapStore.index('campaignId');
            const req = index.getAll(campaignId);
            req.onsuccess = () => {
                const maps = req.result || [];
                maps.forEach(m => {
                    if (m.folder === folderName) {
                        m.folder = "";
                        mapStore.put(m);
                    }
                });
            };
            
            tx.oncomplete = () => resolve();
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

    async getMap(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('maps', 'readonly');
            const req = tx.objectStore('maps').get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async saveMap(campaignId, mapName, mapImageBase64, state, existingId = null, folder = null) {
        let targetFolder = folder;
        if (existingId && (folder === undefined || folder === null)) {
            const existingMap = await this.getMap(existingId);
            if (existingMap && existingMap.folder) {
                targetFolder = existingMap.folder;
            }
        }
        const map = {
            id: existingId || 'map_' + Date.now(),
            campaignId,
            name: mapName,
            mapImageBase64,
            state,
            folder: targetFolder || ""
        };
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('maps', 'readwrite');
            tx.objectStore('maps').put(map);
            tx.oncomplete = () => resolve(map);
            tx.onerror = () => reject(tx.error);
        });
    }

    async updateMapFolder(mapId, newFolder) {
        const map = await this.getMap(mapId);
        if (!map) throw new Error("Mappa non trovata");
        map.folder = newFolder || "";
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
        data.campaign.folders = data.campaign.folders || [];
        
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['campaigns', 'maps'], 'readwrite');
            tx.objectStore('campaigns').add(data.campaign);
            
            data.maps.forEach(m => {
                m.id = 'map_' + Date.now() + '_' + Math.floor(Math.random()*1000);
                m.campaignId = newCampId;
                m.folder = m.folder || "";
                tx.objectStore('maps').add(m);
            });
            
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async getTokens() {
        return this._getAll('tokens');
    }

    async saveToken(token) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('tokens', 'readwrite');
            tx.objectStore('tokens').put(token);
            tx.oncomplete = () => resolve(token);
            tx.onerror = () => reject(tx.error);
        });
    }

    async saveTokensBatch(tokenList) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('tokens', 'readwrite');
            const store = tx.objectStore('tokens');
            tokenList.forEach(t => store.put(t));
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async deleteToken(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('tokens', 'readwrite');
            tx.objectStore('tokens').delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async clearTokens() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('tokens', 'readwrite');
            tx.objectStore('tokens').clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
}
const vttDB = new StorageDB();
