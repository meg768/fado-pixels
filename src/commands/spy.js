var Command          = require('../scripts/command.js');
var Button           = require('pigpio-button');
var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('../scripts/animation-queue.js');
var ColorAnimation   = require('../scripts/color-animation.js');

class SpyAnimation extends ColorAnimation {


	getColor() {
		
	}
	render() {

	}

}

class SpyCommand extends Command {

	constructor() {
		super({module:module, name:'spy', description:'Displays stock market symbol as a color'});
	}

	defineArgs(yargs) {
	}

	run(argv) {
	
		var button           = new Button({debug:argv.debug, autoEnable:true, pin:6});
		var pixels           = new Neopixels({debug:argv.debug});
		var queue            = new AnimationQueue({debug:argv.debug});
		var state            = 'on'
		var defaultOptions   = {...argv, pixels:pixels, duration: -1, renderFrequency:60000, priority:'!'};

		var runAnimation = (animation) => {
			queue.enqueue(animation);
		}

		button.on('click', (clicks) => {
			if (state == 'on') {
				runAnimation(new ColorAnimation({...defaultOptions, color:'black'}));
			}
			else {
				runAnimation(new SpyAnimation({...defaultOptions}));
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

		runAnimation(new SpyAnimation(defaultOptions));
	
	}

}

new SpyCommand();