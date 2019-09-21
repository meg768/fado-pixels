
var sprintf   = require('yow/sprintf');
var isString  = require('yow/is').isString;
var Animation = require('rpi-animations').Animation;
var Color     = require('color');

function debug() {
}

module.exports = class extends Animation {


    constructor(options) {
        var {pixels, ...options} = options;
        super(options);

        this.pixels = pixels;
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
        this.pixels.render({transition:'fade', duration:this.options.fade});
    }


}
