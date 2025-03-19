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
 * @typedef {Object} BusLayers
 *  @property {Vector} line - Bus line path layer
 *  @property {Vector} followPoint - Bus point follow path layer
 *  @property {Group} group - A group with all layers to add to the map
 */

export default class BusRoute {

    constructor(params = {}){

        this.features = new GeoJSON().readFeatures(params.geojson);

        this.geometry = this.features.at(0).getGeometry();

        this.source = new VectorSource({
            features: this.features
        });


        this.style = params.style;

        /**@type {BusLayers} */
        this.layers = {
            line: this.#drawLine(),
            followPoint: this.#drawFollowPoint()
        };

        this.layers.group = new Group({
            layers: [
                this.layers.line,
                this.layers.followPoint
            ]
        });
    }

    #drawLine(){

        const layer = new VectorLayer({

            source: this.source,

            style: new Style({

                stroke: new Stroke({
                    color: this.style.color,
                    width: 2
                })
            }),

            updateWhileInteracting: true,
            updateWhileAnimating: true
        });
    
        return layer;
    }

    #followPoint = null;

    #drawFollowPoint(){

        const coords = this.geometry.getCoordinateAt(0);

        const point = new Feature(new Point(coords))

        point.setStyle(
            new Style({
                image: new Circle({
                    radius: 6,
                    fill: new Fill({ color: 'red' })
                })
            })
        );

        const layer = new VectorLayer({

            source: new VectorSource({ features: [point] }),
            updateWhileInteracting: true,
            updateWhileAnimating: true
        });

        this.#followPoint = point;

        return layer;
    }

    animate(delta){

        if(this.#followPoint){

            const coord = this.geometry.getCoordinateAt(delta);
    
            this.#followPoint.getGeometry().setCoordinates(coord);
        }
    }

    resetAnimationState(){

        if(this.#followPoint){

            const coord = this.geometry.getCoordinateAt(0);
    
            this.#followPoint.getGeometry().setCoordinates(coord);
        }
    }
}