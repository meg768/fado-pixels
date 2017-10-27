
var sprintf = require('yow/sprintf');

var Animation = require('./animation.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class extends Animation {

    constructor(strip, options) {
        super(strip, options);

        this.name       = 'Random';
        this.hue        = 0;

        this.time       = new Date();
        this.tick       = 0;

        debug('New random animation', this.options);

    }

    render() {

        var now = new Date();

        this.tick++;

        this.hue = (this.hue + 1) % 360;
        this.pixels.fill(Color.hsl(this.hue, 100, 50).rgbNumber());
        this.strip.render(this.pixels.getPixels());

        if ((this.tick % 1000) == 0) {
            var fps = this.ticks / (this.time.valueOf() - now.valueOf()) / 1000;
            debug('Frames per second:', tps);
        }
    }


}
