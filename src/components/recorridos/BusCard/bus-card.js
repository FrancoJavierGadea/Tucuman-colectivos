import SAVED_BUS_ROUTES from '@/scripts/localStorage/SavedBusRoutes.js';


const BUS_CARD_COLORS = [
    '#11448F',
    '#D32F2F',
    '#388E3C',
    '#7B1FA2',
    '#00695C',
    '#C2185B',
];

function getColor(){

    getColor.index ??= 0;

    const color = BUS_CARD_COLORS.at(getColor.index % BUS_CARD_COLORS.length);

    getColor.index++;

    return color;
}

export class BusCard extends HTMLElement {

    constructor() {
        super();

        this.routeID = this.getAttribute('route-id');
        this.busCategory = this.getAttribute('bus-category');

        this.$ = (selector) => this.querySelector(selector);

        //Main button
        this.$('.Bus-content').addEventListener('click', () => this.toogleRoute());
        
        //Save Button
        this.saved = SAVED_BUS_ROUTES.has(this.routeID);

        SAVED_BUS_ROUTES.on((savedRoutes) => {

            this.saved = savedRoutes.has(this.routeID);
        });

        this.$('.Save-btn').addEventListener('click', () => {

            this.saved = !this.saved;
            
            this.saved ? SAVED_BUS_ROUTES.add(this.routeID) : SAVED_BUS_ROUTES.remove(this.routeID);
        });
    }

    toogleRoute(){

        this.active = !this.active;

        if(this.active){

            this.color ??= getColor();

            document.querySelector('custom-map').showRoute({
                id: this.routeID, 
                category: this.busCategory, 
                color: this.color
            });
        }
        else {

            document.querySelector('custom-map').hideRoute({
                id: this.routeID, 
                category: this.busCategory
            });
        }
    }

    set active(value){

        document.querySelectorAll(`${this.tagName}[route-id="${this.routeID}"]`)
        .forEach((busCard) => {

            value ? busCard.setAttribute('active', '') : busCard.removeAttribute('active');
        });
    }
    get active(){

        return this.hasAttribute('active');
    }

    set saved(value){

        document.querySelectorAll(`${this.tagName}[route-id="${this.routeID}"]`)
        .forEach((busCard) => {

            value ? busCard.setAttribute('saved', '') : busCard.removeAttribute('saved');
        });
    }
    get saved(){

        return this.hasAttribute('saved');
    }


    set color(color){

        document.querySelectorAll(`${this.tagName}[route-id="${this.routeID}"]`)
        .forEach((busCard) => {

            if(color){

                busCard.setAttribute('color', color);
                busCard.style.setProperty('--bus-card-active-bg', color);
            }
            else {

                busCard.removeAttribute('color');
            }
        }); 
    }
    get color(){

        return this.getAttribute('color');
    }
}