var ColorAnimation = require('./color-animation.js');
var Color          = require('color');

module.exports = class extends ColorAnimation {


    constructor(options) {
        super({name:'Clock Animation', renderFrequency: 1 * 1000, ...options});
    }

    getHue() {
        var now = new Date();
        return Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
    }


    getColor() {
        return Color.hsl([this.getHue(), 100, 50]).rgbNumber();
    }


    render() {
        this.color = this.getColor();
        super.render();
    }


}
