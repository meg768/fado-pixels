
var Animation = require('./color-animation.js');
var Sleep     = require('sleep');


module.exports = class extends Animation {


    constructor(options) {
        var {interval = 500, color = 'red', ...options} = options;

        super({name:'Pulse Animation', renderFrequency:interval, ...options});

        this.interval = interval;
        this.color = color;
    }



    render() {
        this.pixels.fill(this.color);
        this.pixels.render({transition:'fade', duration:this.interval / 3});

        Sleep.msleep(this.interval / 3);

        this.pixels.fill(0);
        this.pixels.render({transition:'fade', duration:this.interval / 3});
    }


}
