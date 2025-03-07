import { downloadTile } from "./downloadTile.js";
import puppeteer from 'puppeteer';
import path from "node:path";

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

await page.setRequestInterception(true);

page.on('request', request => {

    if (request.resourceType() === 'image') {

        const imageUrl = request.url();

        const filename = path.basename(new URL(imageUrl).pathname);

        const result = imageUrl.match(/tile.openstreetmap.org\/([0-9]*)\/([0-9]*)\/([0-9]*).png/);

        if(result){

            const z = parseInt(result[1]);
            const x = parseInt(result[2]);
            const y = parseInt(result[3]);

            downloadTile({z, x, y}).then(() => {

                console.log(`Downloaded tile: ${filename}`);
            });
        }

        request.continue();

    } else {
        request.continue();
    }
});

await page.goto('https://www.openstreetmap.org/#map=11/-26.8179/-65.2162', { waitUntil: 'networkidle2' });