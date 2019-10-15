var PixelAnimation = require('./pixel-animation.js');
var Color = require('color');

module.exports = class extends PixelAnimation {


    constructor(options) {
        super({name:'Clock Animation', renderFrequency: 60000, ...options});
    }

    getHue() {
        var now = new Date();
        return Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
    }

    getColor() {        
        return Color.hsl([this.getHue(), 100, 50]).rgbNumber();
    }


    render() {
        this.pixels.fill(this.getColor());
    }


}
