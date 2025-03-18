import { Zoom, ScaleLine, FullScreen, Rotate, Control, Attribution } from 'ol/control.js';

//MARK: Icons
import zoomIn_icon from "bootstrap-icons/icons/zoom-in.svg?raw";
import zoomOut_icon from "bootstrap-icons/icons/zoom-out.svg?raw";
import fullscreen_icon from "bootstrap-icons/icons/arrows-fullscreen.svg?raw";
import rotation_icon from "bootstrap-icons/icons/arrow-repeat.svg?raw";
import play_icon from "bootstrap-icons/icons/play.svg?raw";
import pause_icon from "bootstrap-icons/icons/pause.svg?raw";

function parseIcon(rawSvg, {className = ''} = {}){

    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = rawSvg;

    return div;
}


//MARK: Animation Button
export class CustomControls extends Control {
    
    constructor(options = {}){

        const element = document.createElement('div');
        element.className = 'ol-unselectable ol-control custom-controls';
        
        super({element, target: options.target});

        options.buttons.forEach(button => {

            element.appendChild(button.button);
        });
    }
}

export class PlayButton {

    #paused = false;

    constructor(params = {}){

        const {paused, onPlay, onPause} = params;

        this.#paused = paused;
        this.onPlay = onPlay ?? (() => {});
        this.onPause = onPause ?? (() => {});

        this.button = document.createElement('button');

        this.button.appendChild(parseIcon(pause_icon, {className: 'pause-icon'}));
        this.button.appendChild(parseIcon(play_icon, {className: 'play-icon'}));

        this.#paused && this.button.setAttribute('data-paused', '');

        this.button.addEventListener('click', (e) => {

            this.#paused = !this.#paused;

            this.#paused ? 
                e.currentTarget.setAttribute('data-paused', '') :
                e.currentTarget.removeAttribute('data-paused');

            this.#paused ? this.onPause() : this.onPlay();
        });
    }
}


//MARK: Controls
export const DEFAULT_CONTROLS = [

    new Zoom({
        zoomInLabel: parseIcon(zoomIn_icon), 
        zoomInTipLabel: 'Acercar',
        zoomOutLabel: parseIcon(zoomOut_icon), 
        zoomOutTipLabel: 'Alejar'
    }),
    new Rotate({
        label: parseIcon(rotation_icon)
    }),
    new Attribution({
        collapsible: false,
        attributions: [
            '<span>© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span>',
            '<a href="https://www.openstreetmap.org/fixthemap">Corregir el mapa</a>'
        ],
    })
];