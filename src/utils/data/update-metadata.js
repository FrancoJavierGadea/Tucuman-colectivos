import { CATEGORIES, DATA_TYPES } from "./constants.js";
import { exploreDataFolder, readJSON, writeJSON } from "./file-utils.js";
import path from "node:path";
import * as turf from "@turf/turf";


export async function updateMetadata(){

    
    exploreDataFolder(async ({folder, route, line, category, url}) => {

        if(route === 'img') return;

        if(category === CATEGORIES.INTERURBANO){

            const metadata = await readJSON(path.join(folder, 'metadata.json'));

            const recorrido = await readJSON(path.join(folder, 'recorrido.v2.geojson'));

            //
            metadata.route = route;
            metadata.line = line;
            metadata.id = `${line}/${route}`;

            delete metadata.direction;


            //Update Length km
            // const length = +turf.length(recorrido.features.at(0), {units: "kilometers"}).toFixed(2)
    
            // metadata.length_km = length;

            recorrido.features.at(0).properties = metadata;

            await writeJSON(path.join(folder, 'metadata.json'), metadata);

            await writeJSON(path.join(folder, 'recorrido.v2.geojson'), recorrido);
        }

    });
}


updateMetadata();