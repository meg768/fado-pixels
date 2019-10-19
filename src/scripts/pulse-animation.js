
var Animation = require('./animation.js');
var Sleep     = require('sleep');

module.exports = class extends Animation {


    constructor(options) {
        var {interval = 500, color = 'red', antiColor = 'black', ...options} = options;

        super({name:'Pulse Animation', renderFrequency:interval, ...options});

        this.interval = interval;
        this.color = Color(color).rgbNumber();
        this.antiColor = Color(antiColor).rgbNumber();
    }



    render() {
        var duration = Math.floor(this.interval);

        this.pixels.fill(this.color);
        this.pixels.render({transition:'fade', duration:duration});

        this.sleep(duration);

        this.pixels.fill(this.antiColor);
        this.pixels.render({transition:'fade', duration:duration});
    }


}
