
module.exports = class Fado {
	constructor(options) {
		var {debug} = options;

		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('rpi-animations').Queue;

		this.debug   = debug;
		this.pixels  = new Neopixels({debug:debug});
		this.queue   = new AnimationQueue({debug:debug});
	}

	runAnimation(animation) {
		this.queue.enqueue(animation);
	}

	blink(options) {
		var Animation = require('./blink-animation.js'); 
		this.runAnimation(new Animation({debug:debug, pixels:this.pixels, ...options}));
	}

	pulse(options) {
		var Animation = require('./pulse-animation.js'); 
		this.runAnimation(new Animation({debug:debug, pixels:this.pixels, ...options}));
	}

	color(options) {
		var Animation = require('./color-animation.js'); 
		this.runAnimation(new Animation({debug:debug, pixels:this.pixels, ...options}));
	}



}

