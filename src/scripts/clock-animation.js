var Animation = require('./animation.js');
var Color = require('color');

module.exports = class extends Animation {

    constructor(options) {        
        super({name:'ClockAnimation', renderFrequency: 15000, ...options});
    }

    getHue() {
        var now = new Date();
        return Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
    }

    getColor() {        
        return Color.hsl([this.getHue(), 100, 50]).rgbNumber();
    }

    render() {
        this.debug('Rendering clock animation...');
        this.pixels.fill(this.getColor());
        this.pixels.render();
    }


}
