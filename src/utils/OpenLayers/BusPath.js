import { fromLonLat, transform, useGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON.js"
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import RegularShape from "ol/style/RegularShape.js";
import {Circle, Fill} from "ol/style";
import { Point } from "ol/geom";
import Group from "ol/layer/Group.js";
import { getLength } from 'ol/sphere';
import { Feature } from "ol";

export default class BusPath {


    constructor(params = {}){

        this.features = new GeoJSON().readFeatures(params.geojson);

        this.geometry = this.features.at(0).getGeometry();

        this.source = new VectorSource({
            features: this.features
        });


        this.style = params.style;

        this.layers = new Group({
            layers: [
                this.#drawLine(),
                this.#drawFollowPoint()
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
}