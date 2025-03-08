import { CATEGORIES } from "../constants.js";
import { exploreDataFolder } from "../update/utils.js";
import fs from "node:fs";
import path from "node:path";
import { transformText } from "./utils.js";

'https://raw.githubusercontent.com/FrancoJavierGadea/Tucuman-colectivos/refs/heads/main'

const REPOSITORY = 'https://github.com/FrancoJavierGadea/Tucuman-colectivos';

function generateMarkdown(){

    const rawURL = (path) => {

        return [
            'https://raw.githubusercontent.com',
            new URL(REPOSITORY).pathname,
            '/refs/heads/main/public',
            path
        ].join('');
    }

    const geojsonEditUrl = (url) => {

        return `https://geojson.io/#data=data:text/x-url,${encodeURIComponent(url)}`;
    }

    exploreDataFolder(({folder, url, line, direction, category}) => {


        if(folder !== 'img'){

            let TEXT = [

                `## Linea ${transformText(line).capitalize} - ${transformText(direction).capitalize}`,
            
                `### Editar en [\`geojson.io\`](https://geojson.io/#map=11/-26.8139/-65.2008)`,
            ]
            .join('\n\n');

            TEXT += [
                'recorrido.v2.geojson',
                'recorrido.geojson',
                'paradas.geojson'
            ].
            map(file => `\n\n- [${file}](${ geojsonEditUrl(rawURL(url + '/' + file)) })`)
            .join('');

            fs.writeFileSync(
                path.join(folder, 'readme.md'),
                TEXT,
                { encoding: 'utf-8' }
            );
        }
    })
}


generateMarkdown();