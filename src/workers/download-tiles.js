import { TilesDownloader } from "@/utils/tiles/TilesDownloader.js";


self.addEventListener('message', ({data}) => {

    if(data.key === 'start') (async () => {

        const TILES_DOWNLOADER = new TilesDownloader();

        TILES_DOWNLOADER.on('progress', (e) => postMessage({key: 'progress', ...e}));

        try {

            const source = import.meta.env.PUBLIC_TILES_DOWNLOAD;
    
            const blob = await TILES_DOWNLOADER.download(source);

            const result = await TILES_DOWNLOADER.saveTiles(blob);

            self.postMessage({key: 'complete', data: {...result}});
        } 
        catch (error) {

            postMessage({key: 'error', data: {error}});
        }

        self.close();
    })();
});