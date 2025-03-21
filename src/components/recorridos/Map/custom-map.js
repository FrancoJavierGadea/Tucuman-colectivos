
import Map from "@/utils/OpenLayers/Map.js";
import Controls_css from "@/utils/OpenLayers/Controls.css?url";
import bootstrapIcons_css from "bootstrap-icons/font/bootstrap-icons.css?url";

export class CustomMap extends HTMLElement {

    static get observedAttributes() {
        return ['zoom', 'min-zoom', 'max-zoom', 'tiles-url', 'center', 'rotate'];
    }

    attributeChangedCallback(name){

        switch(name){

            case 'zoom':
                this.map.changeZoom({zoom: this.zoom})
                break;

            case 'max-zoom':
                this.map.changeZoom({maxZoom: this.maxZoom})
                break;
                
            case 'min-zoom':
                this.map.changeZoom({minZoom: this.minZoom})
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
            maxZoom: this.maxZoom,
            minZoom: this.minZoom,
            rotate: this.rotate,
            tilesURL: this.tilesURL,
        });

        
        this.addRoute({category: 'urbano', id: '1/mitre'});
    }


 //MARK: Getters and Setters

    get zoom(){ 
        const attr = this.getAttribute('zoom');

        return Number(attr ?? Map.defaultValues.zoom); 
    }
    set zoom(value){ 

        value ? this.setAttribute('zoom', value) : this.removeAttribute('zoom');
    }

    get minZoom(){ 

        const attr = this.getAttribute('min-zoom');

        return Number(attr ?? Map.defaultValues.minZoom); 
    }
    set minZoom(value){ 

        value ? this.setAttribute('min-zoom', value) : this.removeAttribute('min-zoom'); 
    }

    get maxZoom(){ 

        const attr = this.getAttribute('max-zoom');

        return Number(attr ?? Map.defaultValues.maxZoom); 
    }
    set maxZoom(value){ 

        value ? this.setAttribute('max-zoom', value) : this.removeAttribute('max-zoom');
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
    
    //MARK: getConfigValues
    getConfigValues(){

        return Object.keys(Map.defaultValues).reduce((acc, key) => {

            acc[key] = this[key];

            return acc;

        }, {});
    }


    //MARK: addRoute
    /**
     * @param {{category:string, id:string, style:import("@/utils/OpenLayers/BusRoute.js").BusRouteStyle}} params 
     */
    async addRoute(params){

        const {category, id, style} = params;

        try {
            const busPath = await (
                await fetch(`/data/${category}/${id}/recorrido.geojson`)
            ).json();
    
            const busStops = await (
                await fetch(`/data/${category}/${id}/paradas.geojson`)
            ).json();

            this.map.addRoute({
                id, busPath, busStops,
            });  
        } 
        catch (error) {
            
            console.log(error);
        }
    }

    //MARK: show / hide route
    /**
     * @param {{category:string, id:string, color:string}} params  
     */
    async showRoute(params = {}){

        const {category, id, color} = params;

        if(!this.map.hasRoute(id)){

            await this.addRoute({id, category});
        }
        
        this.map.getRoute(id).changeStyle({pathColor: color, pointColor: color});
        this.map.getRoute(id).show = true; 
    }

    /**
     * @param {{category:string, id:string}} params  
     */
    async hideRoute(params){

        const {category, id} = params;

        if(this.map.hasRoute(id)){

            this.map.getRoute(id).show = false;
        } 
    }
 
}


