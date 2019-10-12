var ColorAnimation = require('./color-animation.js');
var Color          = require('color');

module.exports = class extends ColorAnimation {


    constructor(options) {
        super({name:'Clock Animation', renderFrequency: 1 * 1000, ...options});
    }

    getColor() {
        return Color.hsl([this.getHue(), 100, 50]).rgbNumber();
    }

    getHue() {
        return Math.floor(360 * (((this.date.getHours() % 12) * 60) + this.date.getMinutes()) / (12 * 60));
    }

    render() {
        var now = new Date();
        var hue = Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));

        this.color = this.getColor();

        console.log(this.color);
        super.render();
    }


}
