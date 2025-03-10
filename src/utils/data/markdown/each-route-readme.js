import { CATEGORIES } from "../constants.js";

import fs from "node:fs/promises";
import path from "node:path";
import { transformText, URL_UTILS } from "./utils.js";
import { exploreDataFolder, readJSON } from "../file-utils.js";


function generateMarkdown(){

    exploreDataFolder(async ({folder, url, line, direction, category}) => {

        if(direction !== 'img' && category === CATEGORIES.INTERURBANO){

            const recorrido = await readJSON(path.join(folder, 'recorrido.v2.geojson')) || await readJSON(path.join(folder, 'recorrido.geojson'));

            const paradas = await readJSON(path.join(folder, 'paradas.geojson'));

            const text = [
                `## Linea ${transformText(line).capitalize} - ${transformText(direction).capitalize}`,
                
                `<p align="center"><img src="../img/landscape.webp" width="500px" /></p>`,

                `### Recorrido`,
                '```geojson\n' + JSON.stringify(recorrido)  + '\n```',

                `### Paradas`,
                '```geojson\n' + JSON.stringify(paradas)  + '\n```',
                
                `### Editar en [\`geojson.io\`](https://geojson.io/#map=11/-26.8139/-65.2008)`,
                
                [
                    'recorrido.v2.geojson', 
                    'recorrido.geojson', 
                    'paradas.geojson'
                ]
                .map(file => {

                    const rawUrl = URL_UTILS.github.raw(`${url}/${file}`);


                    return `- [${file}](${URL_UTILS.geojsonIo.data(rawUrl)})`
                })
                .join('\n\n')
            ]
            .join('\n\n');

            await fs.writeFile(
                path.join(folder, 'readme.md'),
                text,
                { encoding: 'utf-8' }
            );
        }
    })
}


generateMarkdown();