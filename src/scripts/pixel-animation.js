
var Animation = require('./animation.js');

module.exports = class extends Animation {

    constructor(options) {
        var {pixels, debug, ...options} = options;

        super(options);

        if (typeof debug == 'function')
            this.debug = debug;
        else if (debug)
            this.debug = console.log;

        this.pixels = pixels;
    }
}
