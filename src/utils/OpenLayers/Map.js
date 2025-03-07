import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js"
import { XYZ } from "ol/source.js";
import {defaults as InteractionDefaults} from 'ol/interaction/defaults';
import DragRotate from 'ol/interaction/DragRotate.js';
import * as Condition from 'ol/events/condition.js'

import { useGeographic } from "ol/proj.js";
import BusPath from "./BusPath.js";
import { DEFAULT_CONTROLS, PlayButton, CustomControls } from "./MapControls.js";


useGeographic();


//MARK: Class OpenMap
/**
 * @typedef {Object} MapConfig
 *  @property {number[]} center center the map `[LONGITUDE, LATITUDE]`, default: Tucuman
 * 
 */

export default class OpenMap {

    /** @type {MapConfig} */
    static defaultValues = {
        zoom: 12,
        zoomMin: 1,
        zoomMax: 18,
        tilesURL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        center: [-65.2087, -26.83,],
        rotate: 0,
    }

    #tilesLayer = null;

    /**
     * @constructor
     * @param {MapConfig} params 
     */
    constructor(params = {}){

        for (const key in OpenMap.defaultValues) {
            
            params[key] ??= OpenMap.defaultValues[key];
        }
        
        if(!params.element) throw new Error('The map need a DOM Element to render');

        //MARK: Init Map
        this.#tilesLayer = new TileLayer({
            source: new XYZ({
                url: params.tilesURL
            })
        });

        this.map = new Map({

            target: params.element,

            layers: [ 
                this.#tilesLayer 
            ],

            view: new View({
                center: params.center,
                zoom: params.zoom,
                maxZoom: params.zoomMax,
                minZoom: params.zoomMin,
                rotation: params.rotate
            }),

            controls: [
                ...DEFAULT_CONTROLS, 
            ],

            interactions: InteractionDefaults({

                shiftDragZoom: false,
                altShiftDragRotate: false,
                mouseWheelZoom: true
            })
            .extend([
                new DragRotate({
                    condition: (e) => Condition.shiftKeyOnly(e)
                }),
            ]),

        })

        this.renderPath();

        //this.play();
    }


    rotate(angle){

        this.map.getView().setRotation(angle * (Math.PI / 180));
    }

    changeTilesURL(url){

        this.#tilesLayer.getSource().setUrl(url);
    }

    changeCenter(center){

        this.map.getView().setCenter(center);
    }

    changeZoom({zoom, zoomMin, zoomMax}){

        if(zoom != null) this.map.getView().setZoom(zoom);

        if(zoomMin != null) this.map.getView().setMinZoom(zoomMin);

        if(zoomMax != null) this.map.getView().setMaxZoom(this.zoomMax);
    }


    #children = [];

    async renderPath(src = '/data/urbano/7/aget/recorrido.v2.geojson'){

        const response = await fetch(src);

        const json = await response.json();

        const busPath = new BusPath({
            geojson: json,
            style: {
                color: '#756'
            }
        });

        this.#children.push(busPath);

        this.map.addLayer(busPath.layers);
    }



    //MARK: Animations
    #animationID = null;

    play(){

        const loopAnimation = () => {

            const duration = 10000;
    
            const startTime = window.performance.now();
    
            const updateFrame = (currentTime) => {
    
                let elapsedTime = currentTime - startTime;
    
                let fraction = elapsedTime / duration;
    
                if (fraction > 1) fraction = 1;
                
                //----> Update Elements
                for (let i = 0; i < this.#children.length; i++) {
    
                    this.#children[i].animate(fraction);   
                }
    
                if (fraction < 1) this.#animationID = requestAnimationFrame(updateFrame); 
                else loopAnimation(); 
            }
    
            this.#animationID = requestAnimationFrame(updateFrame);  
        }

        loopAnimation();
    }

    stop(){

        if(this.#animationID) cancelAnimationFrame(this.#animationID);
    }
}