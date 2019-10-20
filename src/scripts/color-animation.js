var Color = require('color');
var Animation = require('./animation.js');

module.exports = class extends Animation {

    constructor(options) {
        var {renderOptions = undefined, color = 'red', ...options} = options;

        super(options);

        this.color = Color(color).rgbNumber();
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
