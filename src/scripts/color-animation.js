var Color = require('color');
var Animation = require('./pixel-animation.js');

module.exports = class extends Animation {

    constructor(options) {
        var {renderOptions = undefined, color = 'red', ...options} = options;

        super(options);

        if (typeof color == 'string') {
            try {
                color = Color(color).rgbNumber();
            }
            catch (error) {
                this.debug('Invalid color value.');
            }
        }

        this.color = color;
        this.renderOptions = renderOptions;
    }

    getColor() {
        return this.color;
    }

    render() {
        this.pixels.fill(this.getColor());

        if (this.renderOptions)
            this.pixels.render(this.renderOptions);
        else
            this.pixels.render();

    }


}
