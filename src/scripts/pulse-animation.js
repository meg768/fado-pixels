
var sprintf   = require('yow/sprintf');
var isString  = require('yow/is').isString;
var Animation = require('rpi-animations').Animation;

var Color     = require('color');
var Sleep     = require('sleep');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class extends Animation {


    constructor(options) {
        var {pixels, ...options} = options;

        super(options);

        this.pixels = pixels;
        this.options = {interval:1000, delay:1000, ...options};
        this.name = 'Pulse Animation';
        this.renderFrequency = this.options.interval;
        this.color = Color('red').rgbNumber();

        if (isString(this.options.color)) {
            try {
                this.color = Color(this.options.color).rgbNumber();
            }
            catch (error) {
                console.log('Invalid color value.');

            }
        }

        debug('New color animation', this.options);

    }



    render() {
        var pixels = this.pixels;

        pixels.fill(this.color);
        pixels.render({transition:'fade', duration:this.options.delay});

        if (this.options.length && this.options.length > 0) {
            Sleep.msleep(this.options.length);
        }

        pixels.fill(0);
        pixels.render({transition:'fade', duration:this.options.delay});

    }


}
