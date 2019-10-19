var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('rpi-animations').Queue;

module.exports = class Fado {
	constructor(options) {
		this.pixels  = new Neopixels();
		this.queue   = new AnimationQueue({debug:options.debug});
	}

	runAnimation(animation) {
		this.queue.enqueue(animation);
	};
}

