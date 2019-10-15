#!/usr/bin/env node

var CLI = require('../scripts/cli.js');


class Command extends CLI {

	constructor() {
		super({module:module, command:'clock [options]', desc:'Displays time as a color'});
	}

	defineArgs(yargs) {
		super.defineArgs(yargs);


		yargs.check(function(argv) {
			return true;
		});

	}

	run(argv) {
		this.debug('Running clock...');

		var Button           = require('pigpio-button');
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		var ColorAnimation   = require('../scripts/color-animation.js');
		var ClockAnimation   = require('../scripts/clock-animation.js');
	
		var button    = new Button({autoEnable:true, pin:6});
		var pixels    = new Neopixels();
		var queue     = new AnimationQueue({debug:argv.debug});
		var state     = 'on'
		var defaultOptions = {...argv, pixels:pixels, duration: -1, priority:'!'};

		var runAnimation = (animation) => {
			queue.enqueue(animation);
		}

		button.on('click', (clicks) => {
			if (state == 'on') {
				runAnimation(new ColorAnimation({...defaultOptions, color:'black'}));
			}
			else {
				runAnimation(new ClockAnimation(defaultOptions));
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

		runAnimation(new ClockAnimation(defaultOptions);
	
	}

}

new Command();