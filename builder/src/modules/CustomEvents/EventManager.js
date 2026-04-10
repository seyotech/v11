class EventManager {
    static #instance = null;

    constructor() {
        if (EventManager.#instance) {
            return EventManager.#instance;
        }
        EventManager.#instance = this;
    }

    /**
     * Adds an event listener for the specified event type.
     * @param {string} eventType - The type of the event.
     * @param {Function} listener - The callback function.
     */
    addEvent(eventType, listener) {
        document.addEventListener(eventType, listener);
    }

    /**
     * Removes an event listener for the specified event type.
     * @param {string} eventType - The type of the event.
     * @param {Function} listener - The callback function to remove.
     */
    removeEvent(eventType, listener) {
        document.removeEventListener(eventType, listener);
    }

    /**
     * Dispatches a custom event with the given payload.
     * @param {string} eventType - The type of the event.
     * @param {*} payload - The data to pass with the event.
     */
    dispatchEvent(eventType, payload) {
        const event = new CustomEvent(eventType, { detail: payload });
        document.dispatchEvent(event);
    }

    /**
     * Static method to get the single instance of EventManager.
     * @returns {EventManager} The singleton instance of EventManager.
     */
    static getInstance() {
        if (!EventManager.#instance) {
            EventManager.#instance = new EventManager();
        }
        return EventManager.#instance;
    }
}

// Exporting the singleton instance
const eventManager = EventManager.getInstance();
export default eventManager;
