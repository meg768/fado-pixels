var Color = require('color');
var Animation = require('./animation.js');

module.exports = class extends Animation {


    constructor(options) {
        var {interval = 500, color = 'red', antiColor = 'black', ...options} = options;

        super({name:'PulseAnimation', renderFrequency:interval, ...options});

        this.interval = interval;
        this.color = Color(color).rgbNumber();
        this.antiColor = Color(antiColor).rgbNumber();
    }

    render() {
        var duration = Math.floor(this.interval / 3);

        this.pixels.fill(this.color);
        this.pixels.render({transition:'fade', duration:duration});

        this.sleep(duration);

        this.pixels.fill(this.antiColor);
        this.pixels.render({transition:'fade', duration:duration});
    }


}
