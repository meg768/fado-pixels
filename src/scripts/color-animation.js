
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;

var Neopixels = require('rpi-neopixels');
var Color     = require('color');

module.exports = class extends Neopixels.Animation {

    constructor(pixels, options) {
        super(pixels, Object.assign({}, {fade:100}, options));

        this.name = 'Color';
        this.renderFrequency = 1000;
        this.color = Color('red').rgbNumber();

        if (isString(this.options.color)) {
            try {
                this.color = Color(this.options.color).rgbNumber();
            }
            catch (error) {
                console.log('Invalid color value.');

            }
        }

    }

    render() {
        this.pixels.fill(this.color);
        this.pixels.render({transition:'fade', duration:this.options.fade});
    }


}
