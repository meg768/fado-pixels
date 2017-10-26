
var sprintf = require('yow/sprintf');

var Animation = require('./animation.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.name       = 'Clock';
        this.lastRender = 0;
        this.hue        = 0;

    }



    start() {
        return new Promise((resolve, reject) => {
            super.start().then(() => {
                this.render();
                resolve();
            })
            .catch((error) => {
                reject(error);
            })
        });
    }

    render() {
        var now = new Date();

        this.hue = (this.hue + 1) % 360;

        var pixels  = new Pixels(this.strip.width, this.strip.height);
        var hue     = this.getHue();

        for (var y = 0; y < this.strip.height; y++) {
            for (var x = 0; x < this.strip.width; x++) {
                pixels.setPixelHSL(x, y, this.hue, 100, 50);
            }
        }


        this.strip.render(pixels.getPixels(), {});
        this.lastRender = new Date();

    }

    getHue() {
        var now = new Date();
        return Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
    }

}
