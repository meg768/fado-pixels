#!/usr/bin/env node

var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('rpi-animations').Queue;
var PulseAnimation   = require('../scripts/pulse-animation.js');

function debug() {
}

var Module = new function() {



	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.option('color', {describe:'Color', default:'red'});
		args.option('duration', {describe:'Duration', default:60000});
		args.option('interval', {describe:'Interval', default:500});


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

		var pixels    = new Neopixels();
		var queue     = new AnimationQueue({debug:argv.debug});
		var duration  = argv.duration;
		var color     = argv.color;
		var interval  = argv.interval;

		var animation = new PulseAnimation({pixels:pixels, interval:interval, color:color, duration:duration, priority:'!'});

		queue.enqueue(animation);

	}


	module.exports.command  = 'pulse [options]';
	module.exports.describe = 'Pulse';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
