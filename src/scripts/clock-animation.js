var ColorAnimation = require('./color-animation.js');
var Color     = require('color');


module.exports = class extends ColorAnimation {



    constructor(strip, options) {
        super(strip, options);

        this.name = 'Clock';
        this.renderFrequency = 15 * 1000;
    }



    render() {
        var now = new Date();
        var hue = Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));

        this.color = Color.hsl(hue, 100, 50).rgbNumber();

        super.render();
    }


}
