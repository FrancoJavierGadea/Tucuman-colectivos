
class URLParams {

    #listeners = new Set();

    static #instance = null;

    static getInstance() {

        if (!URLParams.#instance) {

            URLParams.#instance = new URLParams();
        }

        return URLParams.#instance;
    }

    constructor(){

        this.params = Object.fromEntries(
            
            new URLSearchParams(window.location.search).entries()
        );

        window.addEventListener('popstate', () => {

            this.params = Object.fromEntries(
                
                new URLSearchParams(window.location.search).entries()
            );
            
            this.#listeners.forEach((callback) => callback(this.params));
        });
    }

    on(callback) {

        this.#listeners.add(callback);

        callback(this.params);
    }
}


export default URLParams.getInstance();