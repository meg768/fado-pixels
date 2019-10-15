#!/usr/bin/env node

var CLI = require('../scripts/cli.js');


class Command extends CLI {

	constructor() {
		super({module:module, command:'clock [options]', describe:'Displays time as a color'});
	}

	defineArgs(args) {
		super.defineArgs(args);


		args.check(function(argv) {
			return true;
		});

	}

	run(argv) {
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		var ColorAnimation   = require('../scripts/color-animation.js');
		var ClockAnimation   = require('../scripts/clock-animation.js');
	
		var button    = new Button({autoEnable:true, pin:6});
		var pixels    = new Neopixels();
		var queue     = new AnimationQueue({debug:argv.debug});
		var state     = 'on'

		var runAnimation = (animation) => {
			queue.enqueue(animation);
		}

		button.on('click', (clicks) => {
			if (state == 'on') {
				runAnimation(new ColorAnimation({pixels:pixels, color:'black', priority:'!', duration:-1}));
			}
			else {
				runAnimation(new ClockAnimation({pixels:pixels, duration:-1, priority:'!'}));
			}

			this.debug('button click');

			state = (state == 'on') ? 'off' : 'on';
		});


		runAnimation(new ClockAnimation({pixels:pixels, duration:-1, priority:'!'}));
	
	}

}

return new Command();