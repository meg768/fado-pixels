var Color = require('color');
var Animation = require('./animation.js');

module.exports = class extends Animation {

    constructor(options) {
        var { fade = 200, color = 'black', ...options} = options;

        super({name: 'FadeAnimation', iterations:1, ...options});

        this.color = Color(color).rgbNumber();
        this.fade = fade;
    }

    render() {
        this.pixels.fill(this.color);
        this.pixels.render({transition:'fade', duration:this.fade});
    }


}
