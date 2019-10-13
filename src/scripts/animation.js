/*
var Animation = require('rpi-animations').Animation;

module.exports = Animation;
*/

var Events  = require('events');


module.exports = class Animation extends Events {

    constructor(options = {}) {
        super();

        console.log('-----------------', options);

        var {debug, renderFrequency, name = 'Noname', priority = 'normal', iterations = undefined, duration = undefined} = options;

        this.name            = name;
        this.priority        = priority;
        this.cancelled       = false;
        this.duration        = duration;
        this.iterations      = iterations;
        this.renderFrequency = renderFrequency;
        this.renderTime      = 0;
        this.debug           = () => {};

        this.debug('Iterations', iterations);

        if (typeof debug === 'function') {
            this.debug = debug;
        }
        else if (debug) {
            this.debug = console.log;
        }


        console.log('ITERATIONS:', this.iterations);
        console.log('DURATION:', this.duration);
    }

    render() {
    }

    start() {
        this.debug('Starting animation', this.name);

        return new Promise((resolve, reject) => {

            this.cancelled  = false;
            this.renderTime = 0;
            this.iteration  = 0;

            this.debug('Animation', this.name, 'started.');
            resolve();

            this.emit('started');

        });

    }

    stop() {
        this.debug('Stopping animation', this.name);

        return new Promise((resolve, reject) => {

            this.debug('Animation', this.name, 'stopped.');
            resolve();

            this.emit('stopped');
        });
    }


    loop() {

        this.debug('Running loop', this.name);

        return new Promise((resolve, reject) => {

            var start = new Date();

            var render = () => {
                this.debug('Rendering...');
                this.render();
                this.renderTime = now;
            };

            var loop = () => {
                console.log('ITERATION', this.iteration);
                console.log('ITERATIONS', this.iterations);

                var now = new Date();

                if (this.cancelled) {
                    resolve();
                }
                else if (this.duration != undefined && (this.duration >= 0 && now - start > this.duration)) {
                    resolve();
                }
                else if (this.iterations != undefined && (this.iteration >= this.iterations)) {
                    console.log('Stopping!!');
                    resolve();
                }
                else {
                    var now = new Date();

                    if (this.iterations || this.renderFrequency == undefined || this.renderFrequency == 0 || now - this.renderTime >= this.renderFrequency) {
                        render();
                    }

                    this.iteration++;

                    setImmediate(loop);
                }
            }

            loop();
        });
    }



    cancel() {
        this.debug('Cancelling animation', this.name);
        this.cancelled = true;
    }

    run(options) {

        if (options) {
            var {priority = this.priority, duration = this.duration} = options;

            this.priority  = priority;
            this.duration  = duration;
    
        }

        return new Promise((resolve, reject) => {

            this.start().then(() => {
                return this.loop();
            })
            .then(() => {
                return this.stop();
            })
            .catch((error) => {
                console.log(error);
            })
            .then(() => {
                resolve();
            });

        });

    }
}
