import SAVED_BUS_PATHS from '@/scripts/localStorage/SavedBusPaths.js';


const BUS_CARD_COLORS = [
    { dark: '#11448F', light: '#84B0F0' },
    { dark: '#D32F2F', light: '#D79D9D' },
    { dark: '#388E3C', light: '#A0D68A' },
    { dark: '#7B1FA2', light: '#C48BFF' },
    { dark: '#00695C', light: '#48A999' },
    { dark: '#C2185B', light: '#FF80AB' },
];



export class BusCard extends HTMLElement {

    saved = false;

    active = false;

    constructor() {
        super();

        this.id = this.getAttribute('data-bus-id');

        this.$ = (selector) => this.querySelector(selector);

        //Main button
        this.$('.Bus-content').addEventListener('click', () => this.addBusPath());
        
        //Save Button
        this.saved = SAVED_BUS_PATHS.has(this.id);
        this.saved && this.setAttribute('saved', '');

        SAVED_BUS_PATHS.on((busPaths) => {

            this.saved = busPaths.includes(this.id);
            this.saved ? this.setAttribute('saved', '') : this.removeAttribute('saved');
        });

        this.$('.Save-btn').addEventListener('click', () => {

            !this.saved ? SAVED_BUS_PATHS.add(this.id) : SAVED_BUS_PATHS.remove(this.id);
        });
    }

    addBusPath(){

        this.active = !this.active;

        if(this.active){

            const index = document.querySelectorAll(`.Bus-lines ${this.tagName}[data-color]`).length % BUS_CARD_COLORS.length;

            const color = BUS_CARD_COLORS[index];

            console.log(color);

            document.querySelectorAll(`${this.tagName}[data-bus-id="${this.id}"]`)
            .forEach((busCard) => {

                busCard.setAttribute('data-color', index);
            });
        }
        else {

            document.querySelectorAll(`${this.tagName}[data-bus-id="${this.id}"]`)
            .forEach((busCard) => {

                busCard.removeAttribute('data-color', index);
            });
        }
    }
}