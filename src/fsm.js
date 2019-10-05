class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error;
        } else {
            this.initConfig = config;
            this.currState = config.initial;
            this.prevState;
            this.counter = 0;
            this.undoCount = 0;
            this.canRedo = false;
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.initConfig.states[state]) {
            throw new Error;
        } else {
            this.prevState = this.currState;
            this.currState = state;
            this.counter++;
            this.canRedo = false;
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let exist = this.initConfig.states[this.currState].transitions[event];
        if (exist) {
            this.changeState(exist);
        } else {
            throw new Error;
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.initConfig.initial);
        this.counter = 0;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let states = [];

        if (!event) {
            for (let key in this.initConfig.states){
                states.push(key);
            }
        } else if (event) {
            for (let key in this.initConfig.states){
                if (this.initConfig.states[key].transitions[event]) {
                    states.push(key);
                }
            }
        }

        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.counter) {
            this.changeState(this.prevState);
            this.counter -= 2;
            this.undoCount++;
            this.canRedo = true;
            return true;
        } else return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(!this.canRedo) {
            return false;
        } else {
            this.changeState(this.prevState);
            this.undoCount--;
            if (this.undoCount) {
                this.canRedo = true;
            }
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.currState = this.initConfig.initial;
        this.prevState = 0;
        this.counter = 0;
        this.undoCount = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
