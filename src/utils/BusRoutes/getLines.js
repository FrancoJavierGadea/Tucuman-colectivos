import { getRoutes } from "./getRoutes.js";


export async function getLines(params = {}) {
    

    const ROUTES = await getRoutes(params);

    const LINES = Object.groupBy(ROUTES, (metadata) => {

        return metadata.line;
    });

    return Object.keys(LINES)
    .toSorted((lineA, lineB) => {

        const numA = Number(lineA);
        const numB = Number(lineB);

        if(numA && numB) return numA - numB;

        if(numA) return -1;
        if(numB) return 1; 

        return lineA.localeCompare(lineB);
    })
    .map(line => {

        const routes = LINES[line];

        return {
            line,
            name: routes.at(0).name,
            routes
        }
    });
}