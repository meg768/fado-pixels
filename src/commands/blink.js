var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('rpi-animations').Queue;
var PulseAnimation   = require('../scripts/blink-animation.js');
var Command          = require('../scripts/command.js');

class PulseCommand extends Command {
	constructor() {
		var defaults = {
			color      : 'red',
			duration   : 60000,
			interval   : 500
		};

		super({module:module, name: 'pulse', description:'Pulse light', defaults:defaults});
	}

	defineArgs(args) {
		args.option('color', {describe:'Color', default:this.defaults.color});
		args.option('duration', {describe:'Duration', default:this.defaults.duration});
		args.option('interval', {describe:'Interval', default:this.defaults.interval});
	}

	run(argv) {
		var pixels    = new Neopixels();
		var queue     = new AnimationQueue({debug:argv.debug});
		var animation = new PulseAnimation({pixels:pixels, ...argv});

		queue.enqueue(animation);

	};
}

new PulseCommand();
