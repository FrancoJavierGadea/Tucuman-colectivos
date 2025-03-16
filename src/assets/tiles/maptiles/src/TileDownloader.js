import path from "node:path";
import http from "node:https";
import fs from "node:fs";

export class TileDownloader {

    /**
     * @constructor
     * @param {{tilesURL:string, output:string}} params 
     */
    constructor(params = {}){

        const {tilesURL, output} = params;

        this.count = 0;
        this.tilesURL = tilesURL;
        this.output = output
    }

    async download({z, x, y} = {}){

        const url = this.tilesURL
            .replace('{z}', z)
            .replace('{x}', x)
            .replace('{y}', y);

        const folder = path.join(this.output, z.toString(), x.toString());
        const file = path.join(folder, `${y}.png`);
        
        
        if(!fs.existsSync(folder)){
            
            fs.mkdirSync(folder, {recursive: true});
        }
            
        if(fs.existsSync(file)){

            this.count++;
            console.log('✅ ' + this.count + ' - File allready exist: ' + url);
            return;
        };
        
            
        const {promise, resolve, reject} = Promise.withResolvers();
        
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
            "cache-control": "no-cache",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua": "\"Chromium\";v=\"133\", \" Not;A Brand\";v=\"99\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        };

        console.log(`⬇️  ${this.count + 1} - Downloading tile: ${url}`);
        
        http.get(url, { headers }, (response) => {
    
            if(response.statusCode !== 200){
    
                reject(new Error(`Failed to download tile: ${response.statusCode}`));
                return;
            }
    
            const fileStream = fs.createWriteStream(file);
    
            response.pipe(fileStream);
    
            fileStream.on('finish', () => {
    
                fileStream.close();

                this.count++;
                console.log('✅ ' + this.count + ' - Downloaded tile success: ' + url);

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
}


//await downloadTile({z: 12, x: 1306, y: 1729});