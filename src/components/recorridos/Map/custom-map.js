
import Map from "@/utils/OpenLayers/Map.js";
import Controls_css from "@/utils/OpenLayers/Controls.css?url";
import bootstrapIcons_css from "bootstrap-icons/font/bootstrap-icons.css?url";

export class CustomMap extends HTMLElement {

    static get observedAttributes() {
        return ['zoom', 'zoom-min', 'zoom-max', 'tiles-url', 'center', 'rotate'];
    }

    attributeChangedCallback(name){

        switch(name){

            case 'zoom':
                this.map.changeZoom({zoom: this.zoom})
                break;

            case 'zoom-min':
                this.map.changeZoom({zoomMin: this.zoomMin})
                break;

            case 'zoom-max':
                this.map.changeZoom({zoomMax: this.zoomMax})
                break;

            case 'center':
                
                this.map.changeCenter(this.center);
                break;

            case 'tiles-url':

                this.map.changeTilesURL(this.tilesURL);
                break;

            case 'rotate':
                
                this.map.rotate(this.rotate);
                break;
        }
    }


    constructor(){
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                @import url("${bootstrapIcons_css}");
                @import url("${Controls_css}");

                :host {
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    display: block;
                    position: relative;
                }

                .Map-container {
                    width: 100%;
                    height: 100%;
                }
            </style>
            <div class="Map-container"></div>
        `;

        this.map = new Map({
            element: this.shadowRoot.querySelector('.Map-container'),
            zoom: this.zoom,
            zoomMax: this.zoomMax,
            zoomMin: this.zoomMin,
            rotate: this.rotate,
            tilesURL: this.tilesURL,
        });

        //this.renderPath();
    }


 //MARK: Getters and Setters

    get zoom(){ 
        const attr = this.getAttribute('zoom');

        return Number(attr ?? Map.defaultValues.zoom); 
    }
    set zoom(value){ 

        value ? this.setAttribute('zoom', value) : this.removeAttribute('zoom');
    }

    get zoomMin(){ 

        const attr = this.getAttribute('zoom-min');

        return Number(attr ?? Map.defaultValues.zoomMin); 
    }
    set zoomMin(value){ 

        value ? this.setAttribute('zoom-min', value) : this.removeAttribute('zoom-min'); 
    }

    get zoomMax(){ 

        const attr = this.getAttribute('zoom-max');

        return Number(attr ?? Map.defaultValues.zoomMax); 
    }
    set zoomMax(value){ 

        value ? this.setAttribute('zoom-max', value) : this.removeAttribute('zoom-max');
    }

    get center(){ 
        const attr = this.getAttribute('center');

        return attr ? JSON.parse(`[${attr}]`) : Map.defaultValues.center;
    }
    set center(value){

        value ? this.setAttribute('center', value) : this.removeAttribute('center');
    }

    get tilesURL(){ 

        return this.getAttribute('tiles-url') ?? Map.defaultValues.tilesURL;
    }
    set tilesURL(value){

        value ? this.setAttribute('tiles-url', value) : this.removeAttribute('tiles-url');
    }

    get rotate(){

        const attr = this.getAttribute('rotate');

        return Number(attr ?? Map.defaultValues.rotate); 
    }
    set rotate(value){

        value ? this.setAttribute('rotate', value) : this.removeAttribute('rotate');
    }
    
 //
    getConfigValues(){

        return Object.keys(Map.defaultValues).reduce((acc, key) => {

            acc[key] = this[key];

            return acc;

        }, {});
    }
 
}


