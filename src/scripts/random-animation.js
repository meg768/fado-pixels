
var Animation  = require('./animation.js');
var Color      = require('color');

module.exports = class extends Animation {

    constructor(options) {
        var {hue, ...options} = options;

        super({name:'Random Color Animation', renderFrequency:100, ...options});

        this.hue = hue;
    }

    render() {

        this.hue = (this.hue + 1) % 360;
        this.pixels.fill(Color.hsl(this.hue, 100, 50).rgbNumber());
        this.pixels.render();

    }

}
