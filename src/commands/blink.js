console.log(`Loading ${__filename}...`);

var Command = require('../scripts/command.js');

class BlinkCommand extends Command {

	constructor() {
		var defaults = {
			color      : 'green',
			iterations : 3,
			hold       : 200
		};

		super({module:module, name: 'blink', description:'Blink', defaults:defaults});


	}

	defineArgs(args) {

		console.log('CONFIG', this.config);

		args.option('iterations', {describe:'Iterations', default:this.defaults.iterations});
		args.option('duration', {describe:'Duration', default:this.defaults.duration});
		args.option('color', {describe:'Color', default:this.defaults.color});
		args.option('hold', {describe:'Hold', default:this.defaults.hold});
		args.option('fadeIn', {describe:'Fade in', default:this.defaults.fadeIn});
		args.option('fadeOut', {describe:'Fade out', default:this.defaults.fadeOut});
		args.option('fade', {describe:'Fade in & out', default:this.defaults.fade});
		args.option('fadeInOut', {describe:'Fade in & out', default:this.defaults.fadeInOut});

	}


	run(argv) {
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		var BlinkAnimation   = require('../scripts/blink-animation.js');
		
		var queue      = new AnimationQueue({debug:argv.debug});
		var options    = {pixels:new Neopixels(), priority:'!', ...argv};	
		var animation  = new BlinkAnimation(options);

	
		queue.enqueue(animation);

	}
}


new BlinkCommand();

console.log(`Finished loading ${__filename}...`);

