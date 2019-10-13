
var ColorAnimation = require('./color-animation.js');
var Sleep = require('sleep');

module.exports = class extends ColorAnimation {

    constructor(options) {
        var {length = 500, ...options} = options;
        super({name:'Blink Animation', renderFrequency:500, ...options});

        this.state = 0;
        this.length = length;
    }



    render() {
        this.pixels.fill(this.color);
        this.pixels.render({transition:'fade', duration:100});

        Sleep.msleep(this.length);
        
        this.pixels.fill(0);
        this.pixels.render({transition:'fade', duration:100});

    }


}
