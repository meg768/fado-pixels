
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;
var Neopixels = require('rpi-neopixels');

var Color     = require('color');

function debug() {
    //console.log.apply(this, arguments);
}

module.exports = class extends Neopixels.Animation {


    constructor(strip, options) {
        super(strip, Object.assign({}, options));

        this.name = 'Morse';
        this.renderFrequency = 0;
        this.color = Color('white').rgbNumber();

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
        this.pixels.render({fadeIn:this.options.fade});
    }


}
