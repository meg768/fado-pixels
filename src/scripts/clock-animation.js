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
        var now = new Date();
        return Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
    }

    render() {
        this.color = this.getColor();
        this.color = 'dark-green';

        console.log(this.color);
        super.render();
    }


}
