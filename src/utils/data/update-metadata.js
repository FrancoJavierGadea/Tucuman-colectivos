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

            console.log(`https://raw.githubusercontent.com/FrancoJavierGadea/Tucuman-colectivos/refs/heads/main${url}/metadata.json`);

            const oldMetadata = await (await fetch(new URL(`https://raw.githubusercontent.com/FrancoJavierGadea/Tucuman-colectivos/refs/heads/main${url}/metadata.json`).href)).json();

            //
            metadata["route_description"] = oldMetadata.direction;


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