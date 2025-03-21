

export class SavedBusRoutes {

    static NAME = 'saved-bus-routes';

    #listeners = new Set();

    constructor() {

        //Init Local Storage
        if (localStorage.getItem(SavedBusRoutes.NAME) === null) {

            localStorage.setItem(SavedBusRoutes.NAME, '[]');
        }

        /**@type {string[]} */
        const routes = JSON.parse(localStorage.getItem(SavedBusRoutes.NAME));

        /**@type {Set<String>} */
        this.savedRoutes = new Set(routes);

        window.addEventListener('storage', (e) => {

            if (e.key === SavedBusRoutes.NAME) {

                /**@type {string[]} */
                const routes = JSON.parse(e.newValue);

                this.savedRoutes = new Set(routes);

                this.#listeners.forEach((callback) => callback(this.savedRoutes));
            }
        });
    }

    /**
     * @param {(savedRoutes:Set<String>) => {}} callback 
     */
    on(callback) {

        this.#listeners.add(callback);
    }

    /**
     * @param {(Set<String>) => {}} callback 
     */
    off(callback) {

        this.#listeners.delete(callback);
    }

    offAll() {
            
        this.#listeners.clear();
    }

    add(route) {

        this.savedRoutes.add(route);

        localStorage.setItem(SavedBusRoutes.NAME, JSON.stringify([...this.savedRoutes]));

        this.#listeners.forEach((callback) => callback(this.savedRoutes));
    }

    remove(route) {
            
        this.savedRoutes.delete(route);
        
        localStorage.setItem(SavedBusRoutes.NAME, JSON.stringify([...this.savedRoutes]));

        this.#listeners.forEach((callback) => callback(this.savedRoutes));
    }

    has(route) {

        return this.savedRoutes.has(route);
    }

    clear() {

        this.savedRoutes.clear();

        localStorage.setItem(SavedBusRoutes.NAME, '[]');

        this.#listeners.forEach((callback) => callback(this.savedRoutes));
    }
}

const SAVED_BUS_ROUTES = new SavedBusRoutes();

export default SAVED_BUS_ROUTES;