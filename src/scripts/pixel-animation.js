
var Animation = require('rpi-animations').Animation;

module.exports = class extends Animation {

    constructor(options) {
        var {pixels, iterations, ...options} = options;

        super(options);

        if (typeof options.debug == 'function')
            this.debug = options.debug;
        else
            this.debug = () => {};

        this.pixels = pixels;
        this.iterations = iterations;
        this.iteration = 0;
    }

    start() {
        this.iteration = 0;
        return super.start();
    }
    render() {
        if (this.iterations) {
            this.iteration++;

            if (this.iteration > this.iterations)
                this.cancel();
        }

    }


}
