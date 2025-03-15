import { countTiles } from "@/utils/OpenLayers/count-tiles.js";
import { TUCUMAN } from "@/utils/OpenLayers/constants.js";
import TILES_STORAGE from "@/utils/tiles/TilesStorage.js";

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizes[i]}`;
}

class TilesInfo extends HTMLElement {

    constructor(){
        super();

        this.$ = (selector) => this.querySelector(selector);

        const observer = new IntersectionObserver(([entry]) => {

            if(entry.isIntersecting){

                this.updateTilesInfo();
            }

        }, {root: null, rootMargin: '0px', threshold: 0.0});

        observer.observe(this);

        this.querySelector('.Update-tiles-info-btn').addEventListener('click', () => this.updateTilesInfo());
    }

    createTileCard({title, total = 0, current = 0, size = 0, zoom} = {}){

        const percentage = (current * 100 / total).toFixed(2);

        const $card = this.querySelector('template')?.content.cloneNode(true);

        $card.querySelector('[data-zoom]').setAttribute('data-zoom', zoom);

        $card.querySelector('[data-current]').textContent = current.toLocaleString("es-ES");
        $card.querySelector('[data-current]').setAttribute('data-current', current);

        $card.querySelector('[data-total]').textContent = total.toLocaleString("es-ES");
        $card.querySelector('[data-total]').setAttribute('data-total', total);

        $card.querySelector('[data-size]').textContent = formatBytes(size);
        $card.querySelector('[data-size]').setAttribute('data-total', size);

        $card.querySelector('h5').textContent = title;

        $card.querySelector('.progress-bar').style.width = `${percentage}%`;
        //$card.querySelector('.progress-bar').textContent = `${percentage}%`;

        $card.querySelector('.progress').title = `${percentage}%`;

        return $card;
    }

    async updateTilesInfo(){

        console.log('Update info tiles');

        const TILES_SIZE = await TILES_STORAGE.getSize();

        const [min, max] = this.getAttribute('data-zoom-range')?.split(',').map(Number)

        const TILES_TOTAL = countTiles({
            minZoom: min,
            maxZoom: max,
            bounds: TUCUMAN
        });

        const fragment = document.createDocumentFragment();

        ['total', ...Array.from({length: max - min + 1}).map((_, i) => min + i)]
        .forEach(zoom => {

            fragment.appendChild(
                this.createTileCard({
                    current: zoom !== 'total' ? TILES_SIZE.tilesCounts[zoom]?.total : TILES_SIZE.tilesTotal,
                    total: zoom !== 'total' ? TILES_TOTAL[zoom] : TILES_TOTAL.total,
                    size: zoom !== 'total' ? TILES_SIZE.tilesCounts[zoom]?.size : TILES_SIZE.tilesSize,
                    zoom,
                    title: zoom !== 'total' ? `Zoom ${zoom}` : `Total`
                })
            );
        })

        this.querySelector('.Tiles-info-content').replaceChildren(fragment);
    }
}

customElements.define('custom-tiles-info', TilesInfo);
