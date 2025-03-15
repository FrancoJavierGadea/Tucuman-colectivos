import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import TILES_STORAGE from '../utils/tiles/TilesStorage.js';

//Instalar inmediatamente
self.addEventListener('install', (e) => {

    self.skipWaiting();

    e.waitUntil(
        (async () => {

            return;
        })()
    );
});

//Tomar el control de todas las pestañas abiertas
clientsClaim();

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('activate', (e) => {

    self.console.log('Activate');
});



///Maps tiles
self.addEventListener('fetch', (e) => {

    //

    const url = e.request.url;

    const target = `${self.location.origin}/tiles/`;

    if(url.startsWith(target)){

        const [z, x, y] = url.replace(target, '').split('/');

        self.console.log(z, x, y);

        e.respondWith(
            (async () => {

                try {

                    const tile = await TILES_STORAGE.getTile(`${z}/${x}/${y}`);

                    self.console.log(tile);

                    if(tile){

                        return new Response(tile.blob, {
                            headers: {
                                "Content-Type": tile.type,
                                "Content-Length": tile.blob.size
                            }
                        });
                    }
                    else {

                        const response = await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);
                        
                        const cloneResponse = response.clone();

                        const blob = await response.blob();

                        const result = await TILES_STORAGE.addTile({
                            id: `${z}/${x}/${y}`,
                            z, x, y,
                            type: response.headers.get('Content-Type'),
                            blob
                        });

                        await TILES_STORAGE.updateSize({zoom: z, size: blob.size});

                        console.log(result);

                        return cloneResponse;
                    }
                } 
                catch (error) {

                    console.error('Error fetching tile:', error);
                    
                    return await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);
                }
            })()
        );
    }
});
