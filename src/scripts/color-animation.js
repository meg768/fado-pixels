var Color = require('color');
var Animation = require('./animation.js');

module.exports = class extends Animation {

    constructor(options) {
        var {fade = undefined, renderFrequency = 60000, color = 'red', ...options} = options;

        super({name:'ColorAnimation', ...options});

        this.color = Color(color).rgbNumber();
        this.fade = fade;
    }

    render() {
        this.pixels.fill(this.color);

        console('render');
        if (this.fade)
            this.pixels.render({transition:'fade', duration:this.fade});
        else
            this.pixels.render();

    }


}
