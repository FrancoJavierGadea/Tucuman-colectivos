
import sharp from 'sharp';
import { exploreDataFolder } from './update/utils.js';
import { CATEGORIES } from './constants.js';
import path from 'node:path';
import fs from "node:fs";

export default async function optimizeImages() {

    exploreDataFolder(async ({direction, folder, category, line}) => {

        if(direction === 'img' && category === CATEGORIES.INTERURBANO && line === 'el-provincial'){

            const img = path.join(folder, 'landscape.png');

            if(fs.existsSync(img)) {

                await sharp(img)
                .webp({ quality: 80 })
                .toFile(img.replace('.png', '.webp'));
            }

        }

    });
}

optimizeImages();