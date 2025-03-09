import { CATEGORIES } from "../constants.js";
import { exploreDataFolder, readJSON } from "../update/utils.js";
import fs from "node:fs";
import path from "node:path";
import { transformText, URL_UTILS } from "./utils.js";





function generateMarkdown(){

    exploreDataFolder(({folder, url, line, direction, category}) => {


        if(direction !== 'img'){

            const recorrido = (() => {

                if(fs.existsSync(path.join(folder, 'recorrido.v2.geojson'))){

                    return readJSON(path.join(folder, 'recorrido.v2.geojson'));
                } 
                else {

                    return readJSON(path.join(folder, 'recorrido.geojson'));
                }

            })()

            const text = [
                `## Linea ${transformText(line).capitalize} - ${transformText(direction).capitalize}`,
                
                `<p align="center"><img src="../img/landscape.webp" width="500px" /></p>`,

                `### Recorrido`,

                '```geojson\n' + JSON.stringify(recorrido)  + '\n```',
                
                `### Editar en [\`geojson.io\`](https://geojson.io/#map=11/-26.8139/-65.2008)`,
                
                [
                    'recorrido.v2.geojson', 
                    'recorrido.geojson', 
                    'paradas.geojson'
                ]
                .map(file => {

                    const rawUrl = URL_UTILS.github.raw('/public' + `${url}/${file}`);

                    return `- [${file}](${URL_UTILS.geojsonIo.data(rawUrl)})`
                })
                .join('\n\n')
            ]
            .join('\n\n');


            fs.writeFileSync(
                path.join(folder, 'readme.md'),
                text,
                { encoding: 'utf-8' }
            );
        }
    })
}


generateMarkdown();