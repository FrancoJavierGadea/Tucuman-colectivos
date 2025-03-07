import path from "node:path";
import http from "node:https";
import fs from "node:fs";


const OUT_FOLDER = path.join(import.meta.dirname, '../tiles');

let downloaded = 0;

export async function downloadTile({z, x, y} = {}) {


    const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

    const folder = path.join(OUT_FOLDER, z.toString(), x.toString());
    const file = path.join(folder, `${y}.png`);

    downloaded++;

    if(!fs.existsSync(folder)){
        
        fs.mkdirSync(folder, {recursive: true});
    }
    
    if(fs.existsSync(file)){
        
        console.log('✅ ' + downloaded + ' - File allready exist: ' + url);
        return;
    };

    console.log(`⬇️  ${downloaded} - Downloading tile: ${url}`);

    const {promise, resolve, reject} = Promise.withResolvers();


    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
        "cache-control": "no-cache",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua": "\"Chromium\";v=\"133\", \" Not;A Brand\";v=\"99\"",
        "sec-ch-ua-platform": "\"Windows\"",
        "accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    };

    http.get(url, { headers }, (response) => {

        if(response.statusCode !== 200){

            reject(new Error(`Failed to download tile: ${response.statusCode}`));
            return;
        }

        const fileStream = fs.createWriteStream(file);

        response.pipe(fileStream);

        fileStream.on('finish', () => {

            fileStream.close();
            resolve();
        });

        fileStream.on('error', (error) => {

            reject(error);
        });

    }).on('error', (error) => {

        reject(error);
    });


    return promise;
}


//await downloadTile({z: 12, x: 1306, y: 1729});