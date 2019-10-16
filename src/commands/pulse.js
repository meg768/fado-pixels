var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('rpi-animations').Queue;
var PulseAnimation   = require('../scripts/pulse-animation.js');
var Command          = require('../scripts/command.js');

class PulseCommand extends Command {
	constructor() {
		super({module:module, command:'pulse [options]', desc:'Pulse light'});
	}

	defineArgs(args) {
		args.option('color', {describe:'Color', default:'red'});
		args.option('duration', {describe:'Duration', default:60000});
		args.option('interval', {describe:'Interval', default:500});
	}

	run(argv) {
		var pixels    = new Neopixels();
		var queue     = new AnimationQueue({debug:argv.debug});
		var duration  = argv.duration;
		var color     = argv.color;
		var interval  = argv.interval;

		var animation = new PulseAnimation({pixels:pixels, interval:interval, color:color, duration:duration, priority:'!'});

		queue.enqueue(animation);

	};
}

new PulseCommand();
