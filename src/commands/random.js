var Command = require('../scripts/command.js');

class RandomCommand extends Command {

	constructor() {
		var defaults = {
			color           : 'green',
			duration        : 10000
		};

		super({module:module, name: 'random', description:'Random colors', defaults:defaults});


	}

	defineArgs(args) {
		args.option('duration', {describe:'Duration', default:this.defaults.duration});
		args.option('color', {describe:'Color', default:this.defaults.color});
	}


	run(argv) {
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		var RandomAnimation  = require('../scripts/random-animation.js');
		
		var queue      = new AnimationQueue({debug:argv.debug});
		var options    = {pixels:new Neopixels(), renderFrequency:1000, priority:'!', ...argv};	
		var animation  = new RandomAnimation(options);
	
		queue.enqueue(animation);

	}
}

new RandomCommand();

