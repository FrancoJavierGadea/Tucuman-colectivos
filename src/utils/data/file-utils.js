import fs from "node:fs/promises";
import path from "node:path";
import { DATA_FOLDER } from "./constants.js";
import { error } from "node:console";


/**
 * 
 * @param {({category, line, direction, folder, url}) => {}} callback 
 */
export async function exploreDataFolder(callback = () => {}){

    const categories = await fs.readdir(DATA_FOLDER);

    for (const category of categories) {
        
        const lines = await fs.readdir(path.join(DATA_FOLDER, category));

        for (const line of lines) {
            
            const directions = await fs.readdir(path.join(DATA_FOLDER, category, line));

            for (const direction of directions) {
                
                const folder = path.join(DATA_FOLDER, category, line, direction);

                const url = folder.replace(process.cwd(), '').replaceAll('\\', '/');

                await callback({ category, line, direction, folder, url });
            }
        }
    }
}


export async function readJSON(path){

    if(await exists(path)){

        const data = await fs.readFile(path, {encoding: 'utf-8'});
    
        return JSON.parse(data);
    }

    return null;
}

export async function writeJSON(path, json, {minify = false} = {}){

    const data = minify ? JSON.stringify(json) : JSON.stringify(json, null, 2);

    await fs.writeFile(path, data, {encoding: 'utf-8'});

    return `Complete JSON write in: ` + path;
}


export async function exists(path){

    try {

        await fs.access(path);

        return true;
        
    } catch (error) {
        
        return false;
    }
}

//exploreDataFolder((e) => console.log(e));