module.exports = class WindowStore {
    constructor() {
        this.windowCollection = [];
    }

    addWindow(window) {
        this.windowCollection.push(window);
    }

    getWindow(index) {
        return this.windowCollection[index];
    }
}

