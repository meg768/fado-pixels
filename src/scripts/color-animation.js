
var isString  = require('yow/is').isString;
var Animation = require('./animation.js');
var Color     = require('color');

module.exports = class extends Animation {

    constructor(options) {
        
        super({name:'Color Animation', color:'red', renderFrequency:1000, ...options});

        if (isString(color)) {
            try {
                color = Color(color).rgbNumber();
            }
            catch (error) {
                console.log('Invalid color value.');

            }
        }

        this.color = color;

    }

    render() {
        this.pixels.fill(this.color);
        this.pixels.render({transition:'fade', duration:100});
    }


}
