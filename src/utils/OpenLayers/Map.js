import { default as OpenLayersMap } from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js"
import { XYZ } from "ol/source.js";
import {defaults as InteractionDefaults} from 'ol/interaction/defaults';
import DragRotate from 'ol/interaction/DragRotate.js';
import * as Condition from 'ol/events/condition.js'

import { useGeographic } from "ol/proj.js";
import { DEFAULT_CONTROLS, PlayButton, CustomControls } from "./MapControls.js";
import { countTiles } from "./count-tiles.js";
import { TUCUMAN } from "./constants.js";
import { MapAnimation } from "./Animation.js";
import BusRoute from "./BusRoute.js";


useGeographic();

//MARK: Class OpenMap
/**
 * @typedef {Object} MapConfig
 *  @property {number[]} center center the map `[lng, lat]`, default: Tucuman `[-65.2087, -26.83]`
 *  @property {number} zoom
 *  @property {number} minZoom
 *  @property {number} maxZoom
 *  @property {number} rotate
 *  @property {String} tilesURL
 *  @property {{west:number, south:number, east:number, north:number}} bounds
 */

export default class OpenMap {

    /** @type {MapConfig} */
    static defaultValues = {
        zoom: 12,
        minZoom: 1,
        maxZoom: 18,
        tilesURL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        center: [-65.2087, -26.83,],
        rotate: 0,
        bounds: TUCUMAN
    }

    /**@type {TileLayer} */
    #tilesLayer = null;

    /**@type {MapConfig} */
    #config = null;

    /**
     * @constructor
     * @param {MapConfig} params 
     */
    constructor(params = {}){

        for (const key in OpenMap.defaultValues) {
            
            params[key] ??= OpenMap.defaultValues[key];
        }
        
        if(!params.element) throw new Error('The map need a DOM Element to render');

        this.#config = params;

        //MARK: Init Map
        this.#tilesLayer = new TileLayer({
            source: new XYZ({
                url: params.tilesURL,
            })
        });

        this.view = new View({
            center: params.center,
            zoom: params.zoom,
            maxZoom: params.maxZoom,
            minZoom: params.minZoom,
            rotation: params.rotate,
            extent: [params.bounds.west, params.bounds.south, params.bounds.east, params.bounds.north]
        });

        this.map = new OpenLayersMap({

            target: params.element,
            layers: [ this.#tilesLayer ],
            view: this.view,

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
        });

        this.map.on('moveend', (e) => {

            //Cambiar la duracion de la animacion segun el nivel zoom, para mantener la misma velocidad
            const zoom = parseInt(this.view.getZoom());
            const duration = 10 + Math.pow(2, (zoom % 10));

            this.#busAnimations.changeDuration(duration);
        });
    }


    //MARK: Update Map
    rotate(angle){

        this.map.getView().setRotation(angle * (Math.PI / 180));
    }

    changeTilesURL(url){

        this.#tilesLayer.getSource().setUrl(url);
    }

    changeCenter(center){

        this.map.getView().setCenter(center);
    }

    changeZoom({zoom, minZoom, maxZoom}){

        if(zoom != null) this.map.getView().setZoom(zoom);

        if(minZoom != null) this.map.getView().setMinZoom(minZoom);

        if(maxZoom != null) this.map.getView().setMaxZoom(maxZoom);
    }


    //MARK: getTotalTiles
    getTotalTiles(){

        const minZoom = this.map.getView().getMinZoom();
        const maxZoom = this.map.getView().getMaxZoom();

        return countTiles({
            minZoom, maxZoom, bounds: this.#config.bounds
        });
    }


    /**@type {Map<String, BusRoute>} */
    #busRoutes = new Map();

    //MARK: Render Path
    addRoute(params = {}){

        const {id, busPath, busStops, style = {}} = params;

        console.log({busPath, busStops});

        if(this.hasRoute(id)) return;

        const busRoute = new BusRoute({
            id,
            busPath, 
            busStops,
            style
        });

        this.#busRoutes.set(id, busRoute);

        this.map.addLayer(busRoute.layers.group);
    }

    hasRoute(id){

        return this.#busRoutes.has(id);
    }

    getRoute(id){

        return this.#busRoutes.get(id);
    }

    getRoutes(){

        return this.#busRoutes;
    }


    //MARK: Animations
    #busAnimations = new MapAnimation((delta) => {

        for (const [key, busRoute] of this.#busRoutes) {

            busRoute.show && busRoute.animate(delta);
        }
        
    }, {loop: true});

    set animations(value){

        if(value){

            this.#busRoutes.forEach(busRoute => {
                busRoute.layers.followPoint.setVisible(true)
            });

            this.#busAnimations.play();
        }
        else {

            this.#busAnimations.stop();

            this.#busRoutes.forEach(busRoute => {

                busRoute.layers.followPoint.setVisible(false);
                busRoute.resetAnimationState();
            });
        }
    }

    get animations(){

        return this.#busAnimations.playing;
    }
}