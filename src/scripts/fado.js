
module.exports = class Fado {
	constructor(options) {
		var {debug} = options;

		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('rpi-animations').Queue;


		this.debug   = typeof debug == 'function' ? debug : (debug ? console.log : () => {});
		this.pixels  = new Neopixels({debug:debug});
		this.queue   = new AnimationQueue({debug:debug});
	}

	runAnimation(animation) {
		this.queue.enqueue(animation);
	}

	blink(options) {
		var Animation = require('./blink-animation.js'); 
		this.runAnimation(new Animation({debug:this.debug, pixels:this.pixels, ...options}));
	}

	pulse(options) {
		var Animation = require('./pulse-animation.js'); 
		this.runAnimation(new Animation({debug:this.debug, pixels:this.pixels, ...options}));
	}

	color(options) {
		var Animation = require('./color-animation.js'); 
		this.runAnimation(new Animation({debug:this.debug, pixels:this.pixels, ...options}));
	}

	random(options) {
		var Animation = require('./random-animation.js'); 
		this.runAnimation(new Animation({debug:this.debug, pixels:this.pixels, ...options}));
	}

	clock(options) {
		var Animation = require('./clock-animation.js'); 
		this.runAnimation(new Animation({debug:this.debug, pixels:this.pixels, ...options}));
	}

}

