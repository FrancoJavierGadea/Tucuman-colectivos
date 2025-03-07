import { CATEGORIES, DATA_TYPES } from "../constants.js";
import * as turf from "@turf/turf";
import { readJSON, exploreDataFolder, writeJSON } from "./utils.js";
import path from "node:path";

/**
 * Calcula la distancia en km de cada recorrido y actualiza la propiedad `length_km` de los `metadata.json`
 */
export function updateLengthKM(){


    const folders = exploreDataFolder(({category, direction, folder, url}) => {

        if(category === CATEGORIES.INTERURBANO && direction !== 'img'){

            const meta = readJSON(path.join(folder, 'metadata.json'));

            const fol = url.split('/').slice(0, -1).join('/');

            meta.image = {
                landscape: `${fol}/img/landscape.webp`,
                square: `${fol}/img/square.webp`,
            }

            writeJSON(path.join(folder, 'metadata.json'), meta);
        }
    });


    

            // const json = readJSON(file);

            // const coordinates = json.features.at(0).geometry.coordinates;

            // //CALCULANDO LA DISTANCIA
            // const line = turf.lineString(coordinates);

            // const length = turf.length(line, {units: 'kilometers'}).toFixed(2);

            // //UPDATE METADATA
            // const metadataPath = path.join(folder, 'metadata.json');

            // const metadata = readJSON(metadataPath);

            // metadata.length_km = +length;

            // console.log(metadata);

            //writeJSON(metadataPath, metadata);
        
   
}


updateLengthKM();