
var Animation = require('./animation.js');

module.exports = class extends Animation {

    constructor(options) {
        var {pixels, ...options} = options;

        super(options);

        if (typeof options.debug == 'function')
            this.debug = options.debug;
        else
            this.debug = () => {};

        this.pixels = pixels;
    }
}
