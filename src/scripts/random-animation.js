
var sprintf   = require('yow/sprintf');
var Neopixels = require('rpi-neopixels');
var Color     = require('color');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class extends Neopixels.Animation {

    constructor(pixels, options) {
        super(pixels, options);

        this.name = 'Random';
        this.hue = 0;
        this.renderFrequency = 10;

        debug('New random animation', this.options);

    }

    render() {

        this.hue = (this.hue + 1) % 360;
        this.pixels.fill(Color.hsl(this.hue, 100, 50).rgbNumber());
        this.pixels.render();

    }

}
