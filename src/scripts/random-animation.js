
var sprintf   = require('meg768/yow/sprintf');
var Animation = require('meg768/neopixels/animation');
var Color     = require('color');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class extends Animation {

    constructor(strip, options) {
        super(strip, options);

        this.name = 'Random';
        this.hue = 0;
        this.renderFrequency = 10;

        debug('New random animation', this.options);

    }

    render() {

        this.hue = (this.hue + 1) % 360;
        this.pixels.fill(Color.hsl(this.hue, 100, 50).rgbNumber());
        this.strip.render(this.pixels.getPixels());

    }

}
