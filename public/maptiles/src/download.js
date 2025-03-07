import { downloadTile } from "./downloadTile.js";


function latLonToTileBounds(bounds, zoom) {
    function lonToTileX(lon, zoom) {
        return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
    }

    function latToTileY(lat, zoom) {
        return Math.floor(
            ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
            Math.pow(2, zoom)
        );
    }

    return {
        minX: lonToTileX(bounds.west, zoom),
        maxX: lonToTileX(bounds.east, zoom),
        minY: latToTileY(bounds.north, zoom),
        maxY: latToTileY(bounds.south, zoom)
    };
}


export async function downloadTiles(zoom = 12){

    //Tucuman
    const bounds = {
        north: -26.4,  // Latitud norte
        south: -27.5,  // Latitud sur
        west: -65.9,   // Longitud oeste
        east: -64.5    // Longitud este
    };

    const { minX, minY, maxX, maxY } = latLonToTileBounds(bounds, zoom);

    for (let x = minX; x <= maxX; x++) {

        for (let y = minY; y <= maxY; y++) {

            await downloadTile({x, y, z: zoom});
        }
    }
}

await downloadTiles(10);