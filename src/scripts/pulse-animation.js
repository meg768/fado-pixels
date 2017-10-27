
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;

var Animation = require('./animation.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.options   = Object.assign({}, {interval:1000, speed:100}, this.options)
        this.name      = 'Pulse Animation';
        this.time      = undefined;
        this.hue       = Color('red').hue();

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
        var now = new Date();

        var pixels = this.pixels;
        var strip  = this.strip;

        if (this.time == undefined || now - this.time > this.options.interval) {

            pixels.fill(Color.hsl(this.hue, 100, 50).rgbNumber());
            strip.render(pixels.getPixels(), {fadeIn:this.options.speed});

            pixels.fill(0);
            strip.render(pixels.getPixels(), {fadeIn:this.options.speed});

            this.time = now;
        }

    }


}
