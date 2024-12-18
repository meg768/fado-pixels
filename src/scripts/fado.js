
module.exports = class Fado {
	constructor(options = {}) {
		var {debug, log} = options;

		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('rpi-animations').Queue;

		this.debug   = typeof debug == 'function' ? debug : (debug ? console.debug : () => {});
		this.log     = typeof log == 'function' ? log : (log ? console.log : () => {});
		this.pixels  = new Neopixels({log:false, debug:false});
		this.queue   = new AnimationQueue({log:false, debug:false});
/*
		this.queue.on('idle', () => {
			this.runDefaultAnimation();
		});

		this.setColor('black');
*/

	}
/*
	setColor(color) {
		this.defaultAnimation = {};
		this.defaultAnimation.animation = 'color';
		this.defaultAnimation.color = color;
		this.defaultAnimation.duration = -1;

		this.runAnimation(this.defaultAnimation);
	}

	runDefaultAnimation() {
		this.debug(`Running default animation.`);
		this.runAnimation(this.defaultAnimation);
	}
*/
	runAnimation(params) {

		let FadeAnimation = require('./fade-animation.js');

		let Animation = undefined;
		let {animation, ...options} = params;

		switch (animation) {
			case 'color': {
				//this.defaultAnimation.color = options.color;

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
			//this.queue.enqueue(new FadeAnimation({ debug: this.debug, pixels: this.pixels, priority:'!'}));
			//this.queue.enqueue(new Animation({ debug: this.debug, pixels: this.pixels, priority: '!', ...options }));
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

