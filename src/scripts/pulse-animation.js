
var Animation = require('./color-animation.js');
var Sleep     = require('sleep');



module.exports = class extends Animation {


    constructor(options) {
        var {interval = 500, ...options} = options;

        super({name:'Pulse Animation', ...options});

        this.interval = interval;
    }



    render() {
        var pixels = this.pixels;

        pixels.fill(this.color);
        pixels.render({transition:'fade', duration:this.interval});

        if (this.interval && this.interval > 0) {
            Sleep.msleep(this.interval);
        }

        pixels.fill(0);
        pixels.render({transition:'fade', duration:this.interval});

    }


}
