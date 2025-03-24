


export async function getRoutes(params = {}) {
 
    const {category, lines = [], routes = []} = params;

    const FILES = import.meta.glob('/public/data/**/metadata.json');


    const ROUTES = await Promise.all(

        Object.entries(FILES).map(async ([filepath, file]) => {


            return await file();
        })
    );

    return ROUTES.filter(metadata => {

        let flag = Boolean(metadata.id);

        if(category) flag &&= category === metadata.category;

        if(lines.length > 0) flag &&= lines.includes(metadata.line);

        if(routes.length > 0) flag &&= routes.includes(metadata.route);

        return flag;
    })
}