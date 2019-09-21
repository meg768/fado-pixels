
var sprintf    = require('yow/sprintf');
var Animations = require('rpi-animations').Animation;
var Color      = require('color');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class extends Animation {

    constructor(options) {
        var {pixels, ...options} = options;

        super(options);

        this.pixels = pixels;
        this.name = 'Random';
        this.hue = 0;
        this.renderFrequency = 10;

        debug('New random animation', options);

    }

    render() {

        this.hue = (this.hue + 1) % 360;
        this.pixels.fill(Color.hsl(this.hue, 100, 50).rgbNumber());
        this.pixels.render();

    }

}
