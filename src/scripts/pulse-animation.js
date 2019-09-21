
var Animation = require('./color-animation.js');
var Sleep     = require('sleep');



module.exports = class extends Animation {


    constructor(options) {
        var {length, ...options} = options;

        super({name:'Pulse Animation', ...options});

        this.length = length;
    }



    render() {
        var pixels = this.pixels;

        pixels.fill(this.color);
        pixels.render({transition:'fade', duration:100});

        if (this.length && this.length > 0) {
            Sleep.msleep(this.length);
        }

        pixels.fill(0);
        pixels.render({transition:'fade', duration:100});

    }


}
