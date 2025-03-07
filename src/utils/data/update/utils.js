import { DATA_FOLDER, PUBLIC_FOLDER } from "../constants.js";
import fs from "node:fs";
import path from "node:path";


/**
 * 
 * @param {({category, line, direction, folder, url}) => {}} callback 
 */
export function exploreDataFolder(callback = () => {}){

    const categories = fs.readdirSync(DATA_FOLDER);

    categories.forEach(category => {

        const lines = fs.readdirSync(path.join(DATA_FOLDER, category));

        lines.forEach(line => {

            const directions = fs.readdirSync(path.join(DATA_FOLDER, category, line));

            directions.forEach(direction => {

                const folder = path.join(DATA_FOLDER, category, line, direction);

                const url = folder.replace(PUBLIC_FOLDER, '').replaceAll('\\', '/');

                callback({ category, line, direction, folder, url });
            });
        });
    });

}


export function readJSON(path){

    return JSON.parse(
        fs.readFileSync(path, {encoding: 'utf-8'})
    );
}

export function writeJSON(path, json){

    fs.writeFileSync(
        path,
        JSON.stringify(json, null, 2),
        {encoding: 'utf-8'}
    );
}

//exploreDataFolder((e) => console.log(e));