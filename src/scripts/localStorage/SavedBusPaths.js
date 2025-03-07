

export class SavedBusPaths {

    static NAME = 'busPaths';

    static #instance = null;

    static getInstance() {

        if (!SavedBusPaths.#instance) {

            SavedBusPaths.#instance = new SavedBusPaths();
        }

        return SavedBusPaths.#instance;
    }

    #listeners = new Set();

    constructor() {

        //Init Local Storage
        if (localStorage.getItem(SavedBusPaths.NAME) === null) {

            localStorage.setItem(SavedBusPaths.NAME, '[]');
        }

        this.busPaths = JSON.parse(localStorage.getItem('busPaths'));

        window.addEventListener('storage', (e) => {

            if (e.key === SavedBusPaths.NAME) {

                this.busPaths = JSON.parse(e.newValue);

                this.#listeners.forEach((callback) => callback(this.busPaths));
            }
        });
    }

    on(callback) {

        this.#listeners.add(callback);
    }

    off(callback) {

        this.#listeners.delete(callback);
    }

    offAll() {
            
        this.#listeners.clear();
    }

    async add(busPath) {

        this.busPaths.push(busPath);

        localStorage.setItem(SavedBusPaths.NAME, JSON.stringify(this.busPaths));

        this.#listeners.forEach((callback) => callback(this.busPaths));
    }

    async remove(busPath) {
            
        this.busPaths = this.busPaths.filter((path) => path !== busPath);
        
        localStorage.setItem(SavedBusPaths.NAME, JSON.stringify(this.busPaths));

        this.#listeners.forEach((callback) => callback(this.busPaths));
    }

    has(busPath) {

        return this.busPaths.includes(busPath);
    }

    clear() {

        localStorage.setItem(SavedBusPaths.NAME, '[]');
    }
}

const SAVED_BUS_PATHS = SavedBusPaths.getInstance();

export default SAVED_BUS_PATHS;