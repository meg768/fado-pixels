console.log('Loading Blink');

var Command = require('../scripts/command.js');

class BlinkCommand extends Command {

	constructor() {
		var config = {
			color      : 'green',
			iterations : 3,
			hold       : 200
		};

		super({module:module, name: 'blink', description:'Blink', config:config});


	}

	defineArgs(args) {

		console.log('CONFIG', this.config);

		args.option('iterations', {describe:'Iterations', default:this.config.iterations});
		args.option('duration', {describe:'Duration', default:this.config.duration});
		args.option('color', {describe:'Color', default:this.config.color});
		args.option('hold', {describe:'Hold', default:this.config.hold});
		args.option('fadeIn', {describe:'Fade in', default:this.config.fadeIn});
		args.option('fadeOut', {describe:'Fade out', default:this.config.fadeOut});
		args.option('fade', {describe:'Fade in & out', default:this.config.fade});
		args.option('fadeInOut', {describe:'Fade in & out', default:this.config.fadeInOut});

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

console.log('Finished loading Blink');

