
var Animation  = require('./animation');
var Color      = require('color');

module.exports = class extends Animation {

    constructor(options) {
        super({name:'Random', renderFrequency:10, ...options});

        this.hue = 0;

    }

    render() {

        this.hue = (this.hue + 1) % 360;
        this.pixels.fill(Color.hsl(this.hue, 100, 50).rgbNumber());
        this.pixels.render();

    }

}
