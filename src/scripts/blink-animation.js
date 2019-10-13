
var ColorAnimation = require('./color-animation.js');

module.exports = class extends ColorAnimation {

    constructor(options) {
        super({name:'Blink Animation', renderFrequency:500, ...options});

        this.state = 0;
    }



    render() {
        this.pixels.fill(0);
        this.pixels.render({transition:'fade', duration:100});

        this.pixels.fill(this.color);
        this.pixels.render({transition:'fade', duration:100});

        this.pixels.fill(0);
        this.pixels.render({transition:'fade', duration:100});

    }


}
