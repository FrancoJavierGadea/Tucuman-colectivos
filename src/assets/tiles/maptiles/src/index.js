import path from "node:path";
import { TileDownloader } from "./TileDownloader.js";
import { downloadTilesForBounds } from "./download.js";

process.loadEnvFile();

const OUT_FOLDER = path.join(import.meta.dirname, '../tiles');

//Tucuman
const TUCUMAN = {
    north: -26.4,  
    south: -27.5,
    west: -65.9,
    east: -64.5
};

const tileDownloader = new TileDownloader({
    output: OUT_FOLDER,
    tilesURL: process.env.TILE_SERVER_URL
});

downloadTilesForBounds(TUCUMAN, 8, async ({x, y, z}) => {

    await tileDownloader.download({x, y, z});
});