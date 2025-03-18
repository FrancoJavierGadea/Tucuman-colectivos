import JSZip from "jszip";
import TILES_STORAGE from './TilesStorage.js';

export const PROGRESS = {
    READ_FILE: 'read-file',
    DOWNLOAD: 'download',
    SAVE_TILES: 'save-tiles'
}


export class TilesDownloader {

    /**@type {Map<string, Set<function>>} */
    #listeners = new Map();

    constructor(){


    }

    on(event, listener) {

        if(!this.#listeners.has(event)){

            this.#listeners.set(event, new Set());
        }

        this.#listeners.get(event).add(listener);
    }

    #emit(event, data) {

        if (this.#listeners.has(event)) {

            this.#listeners.get(event).forEach(listener => listener(data));
        }
    }

    //MARK: download
    /**
     * 
     * @param {string} source Tile file zip url
     * @returns {Promise<Blob>}
     */
    async download(source = '/tiles.zip'){

        const response = await fetch(source);

        if(response.status !== 200) {

            return null;
        }

        const totalSize = parseInt(response.headers.get('Content-Length'), 10);

        const reader = response.body.getReader();

        let downlodedBytes = 0;
        let progress = 0;

        const chunks = [];

        const pump = async () => {

            const {done, value} = await reader.read();

            if(done){

                return new Blob(chunks);
            }

            downlodedBytes += value.length;
            progress = Number( ((downlodedBytes / totalSize) * 100).toFixed(2) );

            chunks.push(value);

            this.#emit('progress', {type: PROGRESS.DOWNLOAD, progress, message: `Descargando el archivo`, data: {downlodedBytes, totalSize}})

            return await pump();
        }

        try {
            const blob = await pump();

            return blob;
        }
        catch (error) {
            
            console.log(error);

        }
    }


    //MARK: readFile
    /**
     * 
     * @param {File} file 
     * @returns {Promise<Blob>}
     */
    async readFile(file){

        const {promise, resolve, reject} = Promise.withResolvers();

        const reader = new FileReader();

        let progress = 0;

        reader.addEventListener('progress', (e) => {

            if(e.lengthComputable){

                progress = Number( ((e.loaded / e.total) * 100).toFixed(2) );
                this.#emit('progress', {type: PROGRESS.READ_FILE, progress, message: `Leyendo el archivo`,})
            }
        });

        reader.addEventListener('load', (e) => {

            const arrayBuffer = e.target.result;

            const blob = new Blob([arrayBuffer], { type: file.type });

            resolve(blob);
        });

        reader.addEventListener('error', (e) => reject(e.target.error));

        reader.readAsArrayBuffer(file);

        return promise;
    }

    //MARK: saveTiles
    /**
     * 
     * @param {Blob} blob Blob zip file
     */
    async saveTiles(blob){

        try {
            
            const ZIP = await JSZip.loadAsync(blob);
            
            const totalFiles = Object.keys(ZIP.files).length;
            let processFiles = 0;
            let progress = 0;
            let savedTiles = 0

            for (const relativePath in ZIP.files) {
                
                const file = ZIP.files[relativePath];
                    
                if(!file.dir){

                    const [id, type] = relativePath.split('.');

                    const [z, x, y] = id.split('/');

                    const tile = await TILES_STORAGE.getTile(`${z}/${x}/${y}`);

                    if(!tile){

                        const blob = await file.async('blob')

                        await TILES_STORAGE.addTile({
                            id: `${z}/${x}/${y}`, 
                            type, 
                            z: Number(z), 
                            x: Number(x), 
                            y: Number(y),
                            blob
                        });

                        await TILES_STORAGE.updateSize({zoom: z, size: blob.size})

                        savedTiles++;
                    }
                }

                processFiles++;
                progress = Number(((processFiles / totalFiles) * 100).toFixed(2));

                this.#emit('progress', {type: PROGRESS.SAVE_TILES, progress, message: `Extrayendo las tiles`, data: {savedTiles}});
            }

            return {savedTiles};
        } 
        catch (error) {
            
            console.log(error);
        }
    }
}

const TILES_DOWNLOADER = new TilesDownloader();

export default TILES_DOWNLOADER;