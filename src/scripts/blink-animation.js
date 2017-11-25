
var sprintf   = require('yow/sprintf');
var isString  = require('yow/is').isString;
var Neopixels = require('rpi-neopixels');
var Color     = require('color');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class extends Neopixels.Animation {


    constructor(pixels, options) {
        super(pixels, options);

        this.options = Object.assign({}, {color:'blue', interval:500, softness:0}, this.options);
        this.name = 'Blink Animation';
        this.renderFrequency = this.options.interval;
        this.state = 0;

        try {
            this.color = Color(this.options.color).rgbNumber();
        }
        catch (error) {
            this.color = Color('red').rgbNumber();
        }

    }



    render() {
        var pixels = this.pixels;

        pixels.fill(this.state ? this.color : 0);
        pixels.render({transition:'fade', duration:this.options.softness});

        this.state = !this.state;
    }


}
