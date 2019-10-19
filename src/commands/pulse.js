var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('rpi-animations').Queue;
var PulseAnimation   = require('../scripts/pulse-animation.js');
var Command          = require('../scripts/command.js');

class PulseCommand extends Command {
	constructor() {
		var config = {
			color      : 'red',
			duration   : 60000,
			interval   : 500
		};

		super({module:module, name: 'pulse', description:'Pulse light', config:config});
	}

	defineArgs(args) {
		args.option('color', {describe:'Color', default:this.config.color});
		args.option('duration', {describe:'Duration', default:this.config.duration});
		args.option('interval', {describe:'Interval', default:this.color.interval});
	}

	run(argv) {
		var pixels    = new Neopixels();
		var queue     = new AnimationQueue({debug:argv.debug});
		var animation = new PulseAnimation({pixels:pixels, ...argv});

		queue.enqueue(animation);

	};
}

new PulseCommand();
