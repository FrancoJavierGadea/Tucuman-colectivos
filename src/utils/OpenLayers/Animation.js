
export class MapAnimation {

    #animationID = null;
    playing = false;

    constructor(callback, params = {}){

        this.callback = callback;

        const {
            loop = false,
            duration = 10,
        } = params;

        this.loop = loop;
        this.duration = duration
    }

    #startTime = null;
    #fraction = null;

    play(){

        this.playing = true;

        const loopAnimation = () => {
    
            this.#startTime = window.performance.now();
    
            const updateFrame = (currentTime) => {
    
                let elapsedTime = currentTime - this.#startTime;
    
                this.#fraction = elapsedTime / (this.duration * 1000);
    
                if (this.#fraction > 1) this.#fraction = 1;
                
                //----> Update Elements
                this.callback(this.#fraction);
    
                if (this.#fraction < 1){

                    this.#animationID = requestAnimationFrame(updateFrame); 
                }
                else {

                    if(this.loop) loopAnimation();
                }
            }
    
            this.#animationID = requestAnimationFrame(updateFrame);  
        }

        loopAnimation();
    }

    stop(){

        if(this.#animationID){

            cancelAnimationFrame(this.#animationID);
            this.playing = false;
        }
    }

    changeDuration(duration){

        if(this.duration === duration) return;

        if(this.playing){

            const currentTime = window.performance.now();
            const progress = (currentTime - this.#startTime) / (this.duration * 1000);
    
            // Ajustar startTime para mantener la animación sin saltos
            this.#startTime = currentTime - progress * (duration * 1000);
        }

        this.duration = duration;
    }
}