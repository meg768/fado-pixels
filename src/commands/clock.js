#!/usr/bin/env node

var Command = require('../scripts/command.js');


class ClockCommand extends Command {

	constructor() {
		super({module:module, name:'clock', description:'Displays time as a color'});
	}

	defineArgs(yargs) {
	}

	run(argv) {
		var Button           = require('pigpio-button');
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		var ColorAnimation   = require('../scripts/color-animation.js');
		var ClockAnimation   = require('../scripts/clock-animation.js');
	
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
				runAnimation(new ClockAnimation({...defaultOptions}));
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

		runAnimation(new ClockAnimation(defaultOptions));
	
	}

}

new ClockCommand();