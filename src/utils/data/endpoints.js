import path from "node:path";
import { exploreDataFolder, writeJSON } from "./update/utils.js";
import { PUBLIC_FOLDER } from "./constants.js";


function generateApiJSON(){

    const api = {};

    exploreDataFolder(({category, line, direction, folder, url}) => {

        if(direction === 'img') return;

        api[category] ??= {category, lines: {}};

        const name = `Linea ${line.replace(/_/g, ' ')}`;

        api[category]['lines'][line] ??= {routes: [], name};

        api[category]['lines'][line]['routes'].push({
            direction,
            url,
            metadata: `${url}/metadata.json`,
            recorrido: `${url}/recorrido.geojson`,
            paradas:  `${url}/paradas.geojson`,
            images: {
                landscape: `${url}/img/landscape.png`,
                square: `${url}/img/square.png`
            }
        });
    });

    return api;
}

const API = generateApiJSON();

writeJSON(path.join(PUBLIC_FOLDER, 'api.json'), API, {encoding: 'utf-8'});