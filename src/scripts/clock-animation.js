
var sprintf = require('yow/sprintf');

var Animation = require('./animation.js');
var Layout    = require('./layout.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.name       = 'Clock';
        this.lastRender = 0;

        this.setTiemout(20000);
    }



    tick() {
        var now = new Date();

        if (now - this.lastRender > 30000) {
            this.render();
        }

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

    render(options) {
        console.log('Redrawing clock');

        var pixels  = new Pixels(this.strip.width, this.strip.height);
        var display = new Layout();
        var text    = this.getTime();
        var hue     = this.getHue();

        for (var y = 0; y < this.strip.height; y++) {
            for (var x = 0; x < this.strip.width; x++) {
                pixels.setPixelHSL(word.x + i, word.y, hue, 100, 50);
            }
        }


        this.strip.render(pixels.getPixels(), options);
        this.lastRender = new Date();

    }

    getHue() {
        var now = new Date();
        return Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
    }

}
