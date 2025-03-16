import { TileDownloader } from "./TileDownloader.js";


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

/**
 * 
 * @param {{north:number, south:number, west:number, east:number}} bounds 
 * @param {number} zoom 
 * @param {({x:number, y:number, z:number}) => {}} cb 
 */
export function downloadTilesForBounds(bounds, zoom = 12, cb = () => {}){

    const { minX, minY, maxX, maxY } = latLonToTileBounds(bounds, zoom);

    for (let x = minX; x <= maxX; x++) {

        for (let y = minY; y <= maxY; y++) {

            cb({x, y, z: zoom});
        }
    }
}