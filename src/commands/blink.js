var Command = require('../scripts/command.js');

class BlinkCommand extends Command {

	constructor() {
		var defaults = {
			color      : 'red',
			duration   : 60000,
			interval   : 500
		};

		super({module:module, name: 'blink', description:'Blink', defaults:defaults});


	}

	defineArgs(args) {
		args.option('iterations', {describe:'Iterations', default:this.defaults.iterations});
		args.option('duration', {describe:'Duration', default:this.defaults.duration});
		args.option('color', {describe:'Color', default:this.defaults.color});

	}


	run(argv) {
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		var BlinkAnimation   = require('../scripts/blink-animation.js');
		
		var queue      = new AnimationQueue({debug:argv.debug});
		var options    = {pixels:new Neopixels(), ...argv};	
	
		queue.enqueue(new BlinkAnimation(options));

	}
}

new BlinkCommand();

