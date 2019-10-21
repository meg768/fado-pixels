var Command = require('../scripts/command.js');

class ColorCommand extends Command {

	constructor() {
		var defaults = {
			color           : 'green',
			duration        : 10000
		};

		super({module:module, name: 'color', description:'Set color', defaults:defaults});


	}

	defineArgs(args) {
		args.option('duration', {describe:'Duration', default:this.defaults.duration});
		args.option('color', {describe:'Color', default:this.defaults.color});
	}


	run(argv) {
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		var ColorAnimation   = require('../scripts/color-animation.js');
		
		var queue      = new AnimationQueue({debug:argv.debug});
		var options    = {pixels:new Neopixels(), renderFrequency:1000, priority:'!', ...argv};	
		var animation  = new ColorAnimation(options);
	
		queue.enqueue(animation);

	}
}

new ColorCommand();


