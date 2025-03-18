import { PROGRESS } from "@/utils/tiles/TilesDownloader.js";

class DownloadTiles extends HTMLElement {

    constructor(){
        super();

        //MARK: Events
        this.querySelector('input[type="file"]').addEventListener('change', (e) => {

            const file = e.target.files.item(0);

            this.querySelector('.Download-tiles-progress .alert').style.display = 'none';

            this.#readFile(file);
        });

        this.querySelector('.Download-tiles-btn').addEventListener('click', () => {

            this.querySelector('.Download-tiles-progress .alert').style.display = 'none';

            this.#download();
        });

        this.querySelector('.Alert-close-btn').addEventListener('click', () => {

            this.querySelector('.Download-tiles-progress .alert').style.display = 'none';
        });
    }

    //MARK: updateProgress
    /**
     * 
     * @param {Object} params
     */
    #updateProgress(params = {}){

        const {progress, message, count, complete, error} = params;

        const $progress = this.querySelector('.Download-tiles-progress');

        if(progress != null){

            $progress.querySelector('.Download-tiles-progress-bar').style.display = '';

            $progress.querySelector('[data-message]').textContent = message;
            $progress.querySelector('[data-count]').textContent = count;
            $progress.querySelector('.progress-bar').style.width = `${progress}%`;
        }
        else {

            $progress.querySelector('.Download-tiles-progress-bar').style.display = 'none';
        }

        if(complete || error){

            const $alert = $progress.querySelector('.alert');

            $alert.style.display = '';
            $alert.className = complete ? 'alert alert-success' : 'alert alert-warning';

            $alert.querySelector('[data-alert-message]').textContent = complete || error;
        }
    }

    #disabledControls(disabled = true){

        this.querySelector('input[type="file"]').disabled = disabled ? true :  undefined;
        this.querySelector('.Download-tiles-btn').disabled = disabled ? true :  undefined;
    }

    
    //MARK: readFile
    async #readFile(file){

        this.#disabledControls(true);
    
        const worker = new Worker(new URL('@/workers/upload-tiles-with-file.js', import.meta.url), {
            type: 'module'
        });

        worker.addEventListener('message', ({data}) => {
            
            if(data.key === 'progress'){

                const {progress, message, data: progressData, type} = data;

                if(type === PROGRESS.READ_FILE) 
                    this.#updateProgress({progress, message: `${message}...`, count: `${progress.toFixed(2)}%`});

                if(type === PROGRESS.SAVE_TILES)
                    this.#updateProgress({progress, message: `${message}...`, count: `Tiles guardadas: ${progressData.savedTiles} - ${progress.toFixed(2)}%`});
            }

            if(data.key === 'complete'){

                this.#updateProgress({complete: 'Carga completada'});
                this.#disabledControls(false);

                document.querySelector('custom-tiles-info')?.updateTilesInfo();
            }

            if(data.key === 'error'){

                this.#updateProgress({error: 'Ocurrio un error'});
                this.#disabledControls(false);
            }
        });

        worker.postMessage({key: 'start', file});
    }

    //MARK: download
    #download(){

        this.#disabledControls(true);
    
        const worker = new Worker(new URL('@/workers/download-tiles.js', import.meta.url), {
            type: 'module'
        });

        worker.addEventListener('message', ({data}) => {
            
            if(data.key === 'progress'){

                const {progress, message, data: progressData, type} = data;

                if(type === PROGRESS.DOWNLOAD) 
                    this.#updateProgress({progress, message: `${message}...`, count: `${progress.toFixed(2)}%`});

                if(type === PROGRESS.SAVE_TILES)
                    this.#updateProgress({progress, message: `${message}...`, count: `Tiles guardadas: ${progressData.savedTiles} - ${progress.toFixed(2)}%`});
            }

            if(data.key === 'complete'){

                this.#updateProgress({complete: 'Carga completada'});
                this.#disabledControls(false);

                document.querySelector('custom-tiles-info')?.updateTilesInfo();
            }

            if(data.key === 'error'){

                this.#updateProgress({error: 'Ocurrio un error'});
                this.#disabledControls(false);
            }
        });

        worker.postMessage({key: 'start'});
    }
}

customElements.define('custom-download-tiles', DownloadTiles);