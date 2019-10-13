
var Animation = require('./animation.js');

module.exports = class extends Animation {

    constructor(options) {
        var {pixels, ...options} = options;

        super(options);

        this.pixels = pixels;
    }
}
