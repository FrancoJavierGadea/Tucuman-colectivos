
/**
 * @typedef {Object} Tile 
 *  @property {String} id Tile ID: `'z/x/y'`,
 *  @property {String} type Tile type: png, webp
 *  @property {number} z Tile zoom
 *  @property {number} x Tile x coordinate
 *  @property {number} y Tile y coodinate
 *  @property {Blob} blob Tile file
 */


export class TilesStorage {

    static DB_NAME = 'MAP_TILES';
    static DB_VERSION = 1;
    static STORE_NAMES = {
        OSM_TILES: 'osm-tiles',
        DB_METADATA: 'db-metadata'
    };
    static DB_METADATA = {
        TILES_SIZE: 'tiles-size'
    }
    static #instance = null;

    static getInstance(){

        TilesStorage.#instance ??= new TilesStorage();

        return TilesStorage.#instance;
    }

    /** @type {IDBDatabase} */
    #db = null;

    constructor(){}

    //MARK: OpenDatabase
    /**
     * 
     * @returns {Promise<IDBDatabase>}
     */
    async openDatabase() {
    
        const {promise, reject, resolve} = Promise.withResolvers();

        if(this.#db){

            resolve(this.#db);
        }
        else {

            const request = indexedDB.open(TilesStorage.DB_NAME, TilesStorage.DB_VERSION);
        
            request.addEventListener('upgradeneeded', (e) => {
        
                /** @type {IDBDatabase} */
                const db = e.target.result;
        
                if(!db.objectStoreNames.contains(TilesStorage.STORE_NAMES.OSM_TILES)){
        
                    db.createObjectStore(TilesStorage.STORE_NAMES.OSM_TILES, { keyPath: 'id' });
                }

                if(!db.objectStoreNames.contains(TilesStorage.STORE_NAMES.DB_METADATA)){

                    db.createObjectStore(TilesStorage.STORE_NAMES.DB_METADATA, { keyPath: 'key' });
                }
            });
        
            request.addEventListener('success', (e) => {
        
                const db = e.target.result;
        
                this.#db = db;

                resolve(this.#db);
            });
        
            request.addEventListener('error', (e) => reject(e.target.error));
        }

        return promise;
    }

    //MARK: Close and Delete
    closeDatabase(){

        this.#db?.close();

        this.#db = null;
    }

    deleteDatabase(){

        const {promise, reject, resolve} = Promise.withResolvers();

        this.closeDatabase();

        const request = indexedDB.deleteDatabase(TilesStorage.DB_NAME);

        request.addEventListener('success', () => {

            resolve();
        });

        request.addEventListener('error', (e) => reject(e.target.error));

        request.addEventListener('blocked', (e) => reject(e.target.error));

        return promise;
    }

    //MARK: deleteTiles
    async deteleTiles(){

        const db = await this.openDatabase();
    
        const promises = Object.values(TilesStorage.STORE_NAMES).map(storeName => {

            const {promise, reject, resolve} = Promise.withResolvers();

            const transaction = db.transaction(storeName, 'readwrite');

            const store = transaction.objectStore(storeName);
        
            const request = store.clear();
        
            request.addEventListener('success', (e) => resolve());
        
            request.addEventListener('error', (e) => reject(e.target.error));

            return promise;
        })

        await Promise.all(promises);
    
        return {message: 'All tiles delete success'};
    }

    async exist(){

        const databases = await indexedDB.databases();
        
        return databases.some(({name, version}) => {

            return name === TilesStorage.DB_NAME && version === TilesStorage.DB_VERSION;
        });
    }

    //MARK: updateSize
    async updateSize({zoom, size} = {}){

        const {promise, reject, resolve} = Promise.withResolvers();

        const db = await this.openDatabase();
    
        const transaction = db.transaction(TilesStorage.STORE_NAMES.DB_METADATA, 'readwrite');
    
        const store = transaction.objectStore(TilesStorage.STORE_NAMES.DB_METADATA);

        const request = store.get(TilesStorage.DB_METADATA.TILES_SIZE);

        request.addEventListener('success', (e) => {

            const data = e.target.result ?? {
                key: TilesStorage.DB_METADATA.TILES_SIZE, 
                tilesCounts: {}, 
                tilesTotal: 0, 
                tilesSize: 0
            };

            if(zoom && size){

                data.tilesCounts[zoom] ??= { total: 0, size: 0 };
                data.tilesCounts[zoom].total++;
                data.tilesCounts[zoom].size += size;

                data.tilesTotal++;
                data.tilesSize += size;
            }

            const updateRequest = store.put(data);

            updateRequest.addEventListener('success', () => resolve(data));

            updateRequest.addEventListener('error', (e) => reject(e.target.error));
        });

        request.addEventListener('error', (e) => reject(e.target.error));

        return promise;
    }

    //MARK: getSize
    /**
     * 
     * @returns {Promise<{
     *  tilesCounts:Record<number, {total:number, size:number}>, 
     *  tilesTotal:number, 
     *  tilesSize:number
     * }>}
     */
    async getSize(){

        const {promise, reject, resolve} = Promise.withResolvers();
    
        const db = await this.openDatabase();
    
        const transaction = db.transaction(TilesStorage.STORE_NAMES.DB_METADATA, 'readonly');
    
        const store = transaction.objectStore(TilesStorage.STORE_NAMES.DB_METADATA);

        const request = store.get(TilesStorage.DB_METADATA.TILES_SIZE);

        request.addEventListener('success', (e) => {

            const data = e.target.result ?? {
                tilesCounts: {}, 
                tilesTotal: 0, 
                tilesSize: 0
            };
            
            delete data.key;

            resolve(data);
        });

        request.addEventListener('error', (e) => reject(e.target.error));

        return promise;
    }


    //MARK: getTile
    /**
     * 
     * @param {String} id `"z/x/y"` 
     * @returns {Promise<Tile>}
     */
    async getTile(id) {
    
        const {promise, reject, resolve} = Promise.withResolvers();
    
        const db = await this.openDatabase();
    
        const transaction = db.transaction(TilesStorage.STORE_NAMES.OSM_TILES, 'readonly');
    
        const store = transaction.objectStore(TilesStorage.STORE_NAMES.OSM_TILES);
    
        const request = store.get(id);
    
        request.addEventListener('success', (e) => {
    
            const tile = e.target.result;
            
            resolve(tile);
        });
    
        request.addEventListener('error', (e) => reject(e.target.error));
    
        return promise;
    }

    //MARK: addTile
    /**
     * 
     * @param {Tile} tile 
     * @returns {Promise<{id:string, message:string}>}
     */
    async addTile(tile = {}) {
    
        const {promise, reject, resolve} = Promise.withResolvers();

        const {id, type, z, x, y, blob} = tile;

        const db = await this.openDatabase();
    
        const transaction = db.transaction(TilesStorage.STORE_NAMES.OSM_TILES, 'readwrite');
    
        const store = transaction.objectStore(TilesStorage.STORE_NAMES.OSM_TILES);
    
        const request = store.put({id, type, z, x, y, blob});

        request.addEventListener('success', () => {

            resolve({id, message: `Add tile success: ${id}`});
        });

        request.addEventListener('error', (e) => {

            reject({id, message: `Add tile error: ${id}`, error: e.target.error});
        });

        return promise;
    }
}

const TILES_STORAGE = new TilesStorage();

export default TILES_STORAGE;

