
var Animation = require('./color-animation.js');

module.exports = class extends Animation {

    constructor(options) {
        super({name:'Blink Animation', renderFrequency:500, ...options});

        this.state = 0;
    }



    render() {
        this.pixels.fill(this.state ? this.color : 0);
        this.pixels.render({transition:'fade', duration:100});

        this.state = !this.state;
    }


}
