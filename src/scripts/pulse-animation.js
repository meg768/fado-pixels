
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;

var Animation = require('./animation.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.options   = Object.assign({}, {frequency:100}, this.options)
        this.name      = 'Pulse Animation';
        this.time      = undefined;
        this.hue       = Color('red').hue();
        this.luminance = 0;
        this.delta     = 1;
        this.ticks     = 0;

        if (isString(this.options.color)) {
            try {
                this.hue = Color(this.options.color).hue();
            }
            catch (error) {
                console.log('Invalid color value.');

            }
        }

        console.log('New color animation', this.options);

    }



    render() {
        if ((this.ticks % this.options.frequency) == 0) {
            var pixels = new Pixels(this.strip.width, this.strip.height);

            pixels.fill(Color.hsl(this.hue, 100, this.luminance).rgbNumber());
            this.strip.render(pixels.getPixels());

            this.luminance += this.delta;

            if (this.luminance >= 50) {
                this.delta = -1;
            }

            if (this.luminance <= 0) {
                this.delta = 1;
            }
        }

        this.ticks++;

    }


}
