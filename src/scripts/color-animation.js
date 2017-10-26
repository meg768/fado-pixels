
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;

var Animation = require('./animation.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

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

        console.log('New color animation', this.options);

    }



    render() {



        var now = new Date();

        if (this.time == undefined || now - this.time > 1000) {
            console.log('Redrawing color', this.color);
            var pixels = new Pixels(this.strip.width, this.strip.height);

            pixels.fill(this.color);
            this.strip.render(pixels.getPixel());

            this.time = now;
        }

    }


}
