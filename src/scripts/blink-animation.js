
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;
var Sleep    = require('sleep');

var Animation = require('./animation.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.options   = Object.assign({}, {frequency:1000, color:'red'}, this.options)
        this.name      = 'Blink Animation';
        this.ticks     = 0;
        this.pixels    = new Pixels(this.strip.width, this.strip.height);

        try {
            this.color = Color(this.options.color).rgbNumber();
        }
        catch (error) {
            console.log('Invalid color value.');

        }

        console.log('New color animation', this.options);

    }



    render() {
        if ((this.ticks % this.options.frequency) == 0) {
            this.pixels.fill(this.color);
            this.strip.render(this.pixels.getPixels());

            Sleep.msleep(100);

            this.pixels.fill(0);
            this.strip.render(this.pixels.getPixels());

        }

        this.ticks++;

    }


}
