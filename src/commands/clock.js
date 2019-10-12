#!/usr/bin/env node

var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('rpi-animations').Queue;
var ClockAnimation   = require('../scripts/clock-animation.js');
var Button           = require('pigpio-button');

function debug() {
}


var Module = new function() {



	function defineArgs(args) {

		args.help('help').alias('help', 'h');


		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {

        if (argv.debug) {
            debug = function() {
                console.log.apply(this, arguments);
            }
        }

		var button    = new Button({autoEnable:true, pin:6});

		var pixels    = new Neopixels();
		var queue     = new AnimationQueue({debug:argv.debug});
		var duration  = -1;
		var state     = 'on'

		button.on('click', (clicks) => {
			if (state == 'on') {
				runAnimation(new ColorAnimation({pixels:pixels, color:'black', priority:'!', duration:-1}));
			}
			else {
				runAnimation(new ClockAnimation({pixels:pixels, duration:-1, priority:'!'}));
			}

			debug('button click');

			state = (state == 'on') ? 'off' : 'on';
		});


		var animation = new ClockAnimation({pixels:pixels, duration:-1, priority:'!'});

		queue.enqueue(animation);



	}


	module.exports.command  = 'clock [options]';
	module.exports.describe = 'Display clock (as hue)';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
