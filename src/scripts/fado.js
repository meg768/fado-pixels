
module.exports = class Fado {
	constructor(options) {
		var {debug, log} = options;

		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('rpi-animations').Queue;

		this.debug   = typeof debug == 'function' ? debug : (debug ? console.debug : () => {});
		this.log     = typeof log == 'function' ? log : (log ? console.log : () => {});
		this.pixels  = new Neopixels({log:false, debug:false});
		this.queue   = new AnimationQueue({log:false, debug:false});

		this.installAnimation('blink',  require('./blink-animation.js'));
		this.installAnimation('pulse',  require('./pulse-animation.js'));
		this.installAnimation('color',  require('./color-animation.js'));
		this.installAnimation('random', require('./random-animation.js'));
		this.installAnimation('clock',  require('./clock-animation.js'));
		this.installAnimation('spy',    require('./spy-animation.js'));
	}

	runAnimation(animation) {
		this.queue.enqueue(animation);
	}

	installAnimation(name, Animation) {
		this[name] = (options) => {
			this.runAnimation(new Animation({debug:this.debug, pixels:this.pixels, ...options}));
		};
	}
/*
	xblink(options) {
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

	spy(options) {
		var Animation = require('./spy-animation.js'); 
		this.runAnimation(new Animation({debug:this.debug, pixels:this.pixels, ...options}));
	}
*/
}

