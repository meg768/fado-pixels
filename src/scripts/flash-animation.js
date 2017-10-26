
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;

var Animation = require('./animation.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');
var Sleep     = require('sleep');

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.name = 'Color';
        this.time = undefined;
        this.color = Color('red').rgbNumber();

        if (isString(this.options.color)) {
            try {
                this.color = Color(this.options.color).rgbNumber();
            }
            catch (error) {
                console.log('Invalid color value.');

            }
        }

        console.log('New flash animation', this.options);

    }



    render() {

        var now = new Date();
        var pixels = new Pixels(this.strip.width, this.strip.height);


        if (this.time == undefined || now - this.time > 500) {
            this.time = now;

            pixels.fill(this.color);
            this.strip.render(pixels.getPixels());

            Sleep.msleep(100);

            pixels.fill(0);
            this.strip.render(pixels.getPixels());
        }


    }


}
