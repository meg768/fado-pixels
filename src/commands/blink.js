#!/usr/bin/env node

var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('./animation-queue.js');
var BlinkAnimation   = require('../scripts/blink-animation.js');


var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.option('duration', {describe:'Duration', default:undefined});
		args.option('iterations', {describe:'Iterations', default:undefined});


		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {


		var pixels     = new Neopixels();
		var queue      = new AnimationQueue({debug:argv.debug});
		var duration   = argv.duration;
		var iterations = argv.iterations;

		var animation = new BlinkAnimation({pixels:pixels, iterations:iterations, duration:duration, priority:'!'});

		queue.enqueue(animation);

	}


	module.exports.command  = 'blink [options]';
	module.exports.describe = 'Blink';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
