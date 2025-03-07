import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_FOLDER = path.join(import.meta.dirname, '../tiles/optimized/tucuman');

const TARGET_FOLDER = path.join(import.meta.dirname, '../tiles/tucuman');


async function optimizeImages(zoom = 10){

    const folder = path.join(TARGET_FOLDER, zoom.toString());

    const content = fs.readdirSync(folder);

    let imagesCount = 0;

    for (let i = 0; i < content.length; i++) {
        
        const subFolder = path.join(folder, content[i]);
        const newFolder = path.join(OUT_FOLDER, zoom.toString(), content[i]);

        if(!fs.existsSync(newFolder)){

            fs.mkdirSync(newFolder, {recursive: true});
        }

        const images = fs.readdirSync(subFolder);

        for (let j = 0; j < images.length; j++) {

            imagesCount++;

            const img = path.join(subFolder, images[j]);

            const webp = await sharp(img)
                .webp({quality: 80})
                .toBuffer();

            fs.writeFileSync(
                path.join(newFolder, images[j].replace('png', 'webp')),
                webp
            );

            console.log(imagesCount);
        }
        
    }
}

optimizeImages(16);