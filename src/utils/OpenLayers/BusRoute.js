import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON.js"
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import {Circle, Fill} from "ol/style";
import { Point } from "ol/geom";
import Group from "ol/layer/Group.js";
import { Feature } from "ol";


/**
 * @typedef {Object} BusRouteStyle
 *  @property {String} pathColor
 *  @property {number} pathWidth
 *  @property {String} pointColor
 *  @property {number} pointRadius
 * 
 * @typedef {Object} BusRouteParams
 *  @property {String} id ID 
 *  @property {Object} busPath Bus Path geojson
 *  @property {Object} busStops Bus Stops geojson
 *  @property {BusRouteStyle} style BusRoute styles
 * 
 * @typedef {Object} BusRouteLayers
 *  @property {VectorLayer} path - Bus path layer
 *  @property {VectorLayer} followPoint - Bus point follow path layer
 *  @property {Group} group - A group with all layers to add to the map
 */

export default class BusRoute {

    static defaultStyle = {
        pathColor: '#000',
        pathWidth: 3,
        pointColor: '#000',
        pointRadius: 6  
    };

    #busPath = null;
    #busPathGeometry = null;
    #busStops = null;

    #followPoint = null;

    /**
     * @constructor
     * @param {BusRouteParams} params 
     */
    constructor(params = {}){

        const {
            id, busPath, busStops, style = {}
        } = params;

        this.id = id;

        this.#busPath = new GeoJSON().readFeatures(busPath);
        this.#busStops = new GeoJSON().readFeatures(busStops);

        this.#busPathGeometry = this.#busPath.at(0).getGeometry();

        //MARK: Style
        for (const key in BusRoute.defaultStyle) {
            
            style[key] ??= BusRoute.defaultStyle[key] 
        }

        /**@type {BusRouteStyle} */
        this.style = style;

        //MARK: Layers
        /**@type {BusRouteLayers} */
        this.layers = {
            path: this.#drawPath(),
            followPoint: this.#drawFollowPoint()
        };

        this.layers.group = new Group({
            layers: [
                this.layers.path,
                this.layers.followPoint
            ]
        });
    }

    #drawPath(){

        const layer = new VectorLayer({

            source: new VectorSource({
                features: this.#busPath
            }),

            style: new Style({
                stroke: new Stroke({
                    color: this.style.pathColor,
                    width: this.style.pathWidth
                })
            }),

            updateWhileInteracting: true,
            updateWhileAnimating: true
        });
    
        return layer;
    }

    #drawFollowPoint(){

        const coords = this.#busPathGeometry.getCoordinateAt(0);

        const point = new Feature(new Point(coords))

        point.setStyle(
            new Style({
                image: new Circle({
                    radius: this.style.pointRadius,
                    fill: new Fill({ color: this.style.pointColor })
                })
            })
        );

        const layer = new VectorLayer({

            source: new VectorSource({ features: [point] }),
            updateWhileInteracting: true,
            updateWhileAnimating: true,

            visible: false
        });

        this.#followPoint = point;

        return layer;
    }

    //MARK: FollowPoint Animation
    animate(delta){

        if(this.#followPoint){

            const coord = this.#busPathGeometry.getCoordinateAt(delta);
    
            this.#followPoint.getGeometry().setCoordinates(coord);
        }
    }

    resetAnimationState(){

        if(this.#followPoint){

            const coord = this.#busPathGeometry.getCoordinateAt(0);
    
            this.#followPoint.getGeometry().setCoordinates(coord);
        }
    }

    //MARK: Change Style
    /**
     * 
     * @param {BusRouteStyle} style 
     */
    changeStyle(style = {}){

        const changedStyles = [];

        for (const key in style) {
            
            if(style[key] && this.style[key] !== style[key]){

                this.style[key] = style[key];

                changedStyles.push(key);
            }
        }

        //Bus Path style
        if(['pathColor', 'pathWidth'].some(key => changedStyles.includes(key))){

            /**@type {Stroke} */
            const stroke = this.layers.path.getStyle().getStroke();
    
            stroke.setColor(this.style.pathColor);
            stroke.setWidth(this.style.pathWidth);

            console.log('change path style');

            this.layers.path.changed();
        }

        //Follow Point style
        if(['pointColor', 'pointRadius'].some(key => changedStyles.includes(key))){

            /**@type {Circle} */
            const circle = this.#followPoint.getStyle().getImage();
    
            circle.setRadius(this.style.pointRadius);
            circle.getFill().setColor(this.style.pointColor);

            console.log('change point style');
    
            this.layers.followPoint.changed();
        }

        
    }


    //MARK: Getters y Setters
    set show(value){

        this.layers.group.setVisible(Boolean(value));
    }

    get show(){

        return this.layers.group.getVisible();
    }
}