
var Animation = require('./color-animation.js');
var Color     = require('color');

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.name = 'Clock';
    }



    render() {
        var now = new Date();
        var hue = Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));

        this.color = Color.hsl(hue, 100, 50).rgbNumber();

        super.render();
    }


}
