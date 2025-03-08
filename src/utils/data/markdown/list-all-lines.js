import { DATA_FOLDER, PUBLIC_FOLDER } from "../constants.js";
import fs from "node:fs";
import path from "node:path";
import { transformText } from "./utils.js";


function generateMarkdown(){

    let TEXT = '';

    const COUNTER = {
        lines: 0,
        directions: 0
    }

    const host = 'https://localhost:4321';

    const categories = fs.readdirSync(DATA_FOLDER);

    categories.toReversed().forEach(category => {

        TEXT += `\n\n## ${transformText(category).capitalize}`;

        const lines = fs.readdirSync(path.join(DATA_FOLDER, category));

        lines.toSorted((a, b) => Number(a) - Number(b)).forEach(line => {

            COUNTER.lines++;

            TEXT += `\n- ### Linea ${transformText(line).capitalize}`;

            const directions = fs.readdirSync(path.join(DATA_FOLDER, category, line));

            directions.forEach(direction => {

                COUNTER.directions++;

                TEXT += `\n\t- **${transformText(direction).capitalize}**: `;

                const folder = path.join(DATA_FOLDER, category, line, direction);
                const url = folder.replace(PUBLIC_FOLDER, '').replaceAll('\\', '/');

                const files = fs.readdirSync(folder);

                files.forEach(dataType => {

                    const endpoint = `${host}${url}/${dataType}`;

                    TEXT += `[${transformText(dataType).capitalize}](${endpoint}) `;
                });
            });
        });
    });


    return [
        '# Data Endpoints',
        `> **Lineas**: \`${COUNTER.lines}\` **Recorridos**: \`${COUNTER.directions}\``,
        '<br><br>',
        TEXT
    ]
    .join('\n');
}

//MARK: Write md file
// const md = generateMarkdown();

// fs.writeFileSync(
//     path.join(PUBLIC_FOLDER, 'endpoints.md'),
//     md,
//     {encoding: 'utf-8'}
// );