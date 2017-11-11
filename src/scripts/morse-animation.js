
var sprintf  = require('meg768/yow/sprintf');
var isString = require('meg768/yow/is').isString;

var Animation = require('./animation.js');
var Color     = require('color');

function debug() {
    //console.log.apply(this, arguments);
}

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, Object.assign({}, options));

        this.name = 'Morse';
        this.renderFrequency = 0;
        this.color = Color('white').rgbNumber();

        if (isString(this.options.color)) {
            try {
                this.color = Color(this.options.color).rgbNumber();
            }
            catch (error) {
                console.log('Invalid color value.');

            }
        }

    }



    render() {
        this.pixels.fill(this.color);
        this.strip.render(this.pixels.getPixels(), {fadeIn:this.options.fade});
    }


}
