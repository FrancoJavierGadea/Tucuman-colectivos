import JSZip from "jszip";
import TILES_STORAGE from './TilesStorage.js';

//Download Tiles from ZIP
export async function downloadTiles(zipURL = '/tiles.zip'){

    try {
        const response = await fetch(zipURL);

        const blob = await response.blob();

        const ZIP = await JSZip.loadAsync(blob);

        const promises = [];

        ZIP.forEach(async (relativePath, file) => {

            if(!file.dir){

                const [id, type] = relativePath.split('.');

                const [z, x, y] = id.split('/');

                const promise = TILES_STORAGE.addTile({
                    id: `${z}/${x}/${y}`, 
                    type, 
                    z: Number(z), 
                    x: Number(x), 
                    y: Number(y),
                    blob: await file.async('blob')
                });

                promises.push(promise);
            }
        });

        await Promise.all(promises);

        return {
            message: 'Tiles downloaded !'
        }
    }
    catch(err){

       throw err;
    }
}