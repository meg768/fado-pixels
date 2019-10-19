var Command = require('../scripts/command.js');

class RandomAnimation extends Command {

	constructor() {
		var defaults = {
		};

		super({module:module, name: 'random', description:'Random color spinner', defaults:defaults});


	}

	defineArgs(args) {

	}


	run(argv) {
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		
		var queue      = new AnimationQueue({debug:argv.debug});
		var options    = {pixels:new Neopixels(), priority:'!', ...argv};	
	
		queue.enqueue(new RandomAnimation(options));

	}
}


new RandomAnimation();

