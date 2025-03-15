import { createXYZ } from 'ol/tilegrid.js';
import {fromLonLat} from "ol/proj.js"
import { TUCUMAN } from './constants.js';

/**
 * 
 * @param {{
 *  minZoom:number,
 *  maxZoom:number,
 *  bounds: {west:number, south:number, east:number, north:number}
 * }} params 
 */
export function countTiles(params = {}) {

    const {minZoom, maxZoom, bounds = {} } = params;

    const tileGrid = createXYZ({ 
        maxZoom, minZoom, 
    });

    const minCoord = fromLonLat([bounds.west, bounds.south]);
    const maxCoord = fromLonLat([bounds.east, bounds.north]);

    const result = Array.from({length: (maxZoom - minZoom) + 1}).reduce((acc, _, i) => {

        const zoom = minZoom + i;

        let [z1, minX, minY] = tileGrid.getTileCoordForCoordAndZ(minCoord, zoom);

        let [z2, maxX, maxY] = tileGrid.getTileCoordForCoordAndZ(maxCoord, zoom);

        let tileXCount = Math.abs(maxX - minX) + 1;
        let tileYCount = Math.abs(maxY - minY) + 1;
        let totalTiles = tileXCount * tileYCount;

        acc[zoom] = totalTiles;
        acc.total += totalTiles;

        return acc;

    }, {total: 0});

    return result;
}

//console.log( countTiles({minZoom: 10, maxZoom: 17, bounds: TUCUMAN }) )


