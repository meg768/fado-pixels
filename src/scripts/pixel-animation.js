
var Animation = require('rpi-animations').Animation;

module.exports = class extends Animation {

    constructor(options) {
        console.log('Pixel animation:', options);
        var {pixels, ...options} = options;

        super(options);

        if (typeof options.debug == 'function')
            this.debug = options.debug;
        else
            this.debug = () => {};

        this.pixels = pixels;
    }
}
