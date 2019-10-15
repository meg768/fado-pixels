var PixelAnimation = require('./pixel-animation.js');
var Color = require('color');

module.exports = class extends PixelAnimation {


    constructor(options) {        
        super({name:'Clock Animation', renderFrequency: 1000, ...options});
        this.debug('New pixel-animation...');
    }

    getHue() {
        var now = new Date();
        return Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
    }

    getColor() {        
        return Color.hsl([this.getHue(), 100, 50]).rgbNumber();
    }


    render() {
        this.debug('Rendering clockl animadasfsd');
        this.pixels.fill(this.getColor());
        this.pixels.render();
    }


}
