var isString = require('yow/is').isString;
var PixelAnimation = require('./pixel-animation.js');
var Color = require('color');

module.exports = class extends PixelAnimation {

    constructor(options) {
        var {color = 'red', ...options} = options;

        super(options);

        if (isString(color)) {
            try {
                color = Color(color).rgbNumber();
            }
            catch (error) {
                this.debug('Invalid color value.');

            }
        }

        this.color = color;
    }



}
