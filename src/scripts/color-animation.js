
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;

var Animation = require('./animation.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, Object.assign({}, {fade:10}, options));

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
            var pixels = new Pixels(this.strip.width, this.strip.height);

            pixels.fill(this.color);
            this.strip.render(pixels.getPixels(), {fadeIn:this.options.fade});

            this.time = now;
        }

    }


}
