import { exists, exploreDataFolder, readJSON, writeJSON } from "./file-utils.js";
import fs from "node:fs/promises";
import path from "node:path";
import { PUBLIC_FOLDER } from "./constants.js";

exploreDataFolder(async ({folder, direction, url}) => {

    const output = path.join(PUBLIC_FOLDER, url);

    if(!(await exists(output))){

        await fs.mkdir(output, { recursive: true });
    }

    if(direction !== 'img'){

        //Copy metadata
        const metadata = await readJSON(path.join(folder, 'metadata.json'));

        metadata && await writeJSON(path.join(output, 'metadata.json'), metadata, {minify: true});

        //Copy recorridos
        const recorrido = await readJSON(path.join(folder, 'recorrido.v2.geojson')) || await readJSON(path.join(folder, 'recorrido.geojson'));

        recorrido && await writeJSON(path.join(output, 'recorrido.geojson'), recorrido, {minify: true});

        //Copy paradas
        const paradas = await readJSON(path.join(folder, 'paradas.geojson'));

        paradas && await writeJSON(path.join(output, 'paradas.geojson'), paradas, {minify: true});
    }
    else {

        //Copy all images webp
        const images = await fs.readdir(folder);

        for (const img of images) {
            
            if(path.extname(img) === '.webp'){

                await fs.copyFile(path.join(folder, img), path.join(output, img));
            }
        }
    }
});