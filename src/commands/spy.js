var Command          = require('../scripts/command.js');


class SpyCommand extends Command {

	constructor() {
        var defaults = {
            symbol:'SPY'
        };
		super({module:module, name:'spy', description:'Displays stock market symbol as a color', defaults:defaults});
	}

	defineArgs(yargs) {
		yargs.option('symbol', {describe:'Stock symbol to display', default:this.defaults.symbol});
	}

	run(argv) {
        
        var Button = require('pigpio-button');
        var Neopixels = require('../scripts/neopixels.js');
        var AnimationQueue = require('../scripts/animation-queue.js');
        var ColorAnimation = require('../scripts/color-animation.js');
        var SpyAnimation = require('../scripts/spy-animation.js');

		var button           = new Button({debug:argv.debug, autoEnable:true, pin:6});
		var pixels           = new Neopixels({debug:argv.debug});
		var queue            = new AnimationQueue({debug:argv.debug});
		var state            = 'on';
		var defaultOptions   = {...argv, pixels:pixels};

		var runAnimation = (animation) => {
			queue.enqueue(animation);
		}

		button.on('click', (clicks) => {
			if (state == 'on') {
				runAnimation(new ColorAnimation({...defaultOptions, renderFrequency:10000, renderOptions:{transition:'fade', duration:500} , duration:-1, color:'black', priority:'!'}));
			}
			else {
				runAnimation(new SpyAnimation({...defaultOptions, symbol:argv.symbol, priority:'!'}));
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

        runAnimation(new SpyAnimation({...defaultOptions, symbol:argv.symbol, priority:'!'}));
	
	}

}

new SpyCommand();

