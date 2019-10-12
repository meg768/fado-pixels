var ColorAnimation = require('./color-animation.js');
var Color          = require('color');

module.exports = class extends ColorAnimation {


    constructor(options) {
        super({name:'Clock Animation', renderFrequency: 1 * 1000, ...options});
    }


    render() {
        var now = new Date();
        var hue = Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));

        this.color = Color.hsl(hue, 100, 50).rgbNumber();

        console.log(this.color);
        super.render();
    }


}
