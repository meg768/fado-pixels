
module.exports = class Fado {
	constructor(options = {}) {
		var {debug, log} = options;

		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('rpi-animations').Queue;

		this.debug   = typeof debug == 'function' ? debug : (debug ? console.debug : () => {});
		this.log     = typeof log == 'function' ? log : (log ? console.log : () => {});
		this.pixels  = new Neopixels({log:false, debug:false});
		this.queue   = new AnimationQueue({log:false, debug:false});

		this.now = new Date();

		this.defaultAnimation = {};
		this.defaultAnimation.animation = 'color';
		this.defaultAnimation.color = 'green';
		this.defaultAnimation.fade = 500;
		this.defaultAnimation.duration = -1;
		this.defaultAnimation.priority = '!';

		this.queue.on('idle', () => {
			this.runDefaultAnimation();
		});

		this.runAnimation(this.defaultAnimation);


	}

	runDefaultAnimation() {
		let now = new Date();
		if (now - this.now < 500) {
			this.log('loop');
			return;
		}
		this.now = now;
		this.debug(`Running default animation.`);
		this.runAnimation(this.defaultAnimation);
	}

	runAnimation(params) {

		let Animation = undefined;
		let {animation, ...options} = params;

		switch (animation) {
			case 'color': {
				Animation = require('./color-animation.js');
				break;
			}
			case 'pulse': {
				Animation = require('./pulse-animation.js');
				break;
			}
			case 'clock': {
				Animation = require('./clock-animation.js');
				break;
			}
			case 'blink': {
				Animation = require('./blink-animation.js');
				break;
			}
			case 'random': {
				Animation = require('./random-animation.js');
				break;
			}
		}

		if (Animation == undefined) {
			this.log(`Animation ${animation} not found.`);
		}



		if (Animation != undefined) {
			this.debug(`Running animation ${animation}...`)
			this.queue.enqueue(new Animation({ debug: this.debug, pixels: this.pixels, ...options }));
		}
	}

	blink(options) {
		this.runAnimation({animation:'blink', ...options});
	}

	pulse(options) {
		this.runAnimation({ animation: 'pulse', ...options });
	}

	color(options) {
		this.runAnimation({ animation: 'color', ...options });
	}

	random(options) {
		this.runAnimation({ animation: 'random', ...options });
	}

	clock(options) {
		this.runAnimation({ animation: 'clock', ...options });
	}

}

