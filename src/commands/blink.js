#!/usr/bin/env node

var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('../scripts/animation-queue.js');
var BlinkAnimation   = require('../scripts/blink-animation.js');


var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.option('duration', {describe:'Duration', default:undefined});
		args.option('iterations', {describe:'Iterations', default:undefined});
		args.option('color', {describe:'Color', default:'white'});
		args.option('length', {describe:'Length', default:500});


		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {


		var pixels     = new Neopixels();
		var queue      = new AnimationQueue({debug:argv.debug});
	
		var animation = new BlinkAnimation({pixels:pixels, length:argv.length, debug:argv.debug, color:argv.color, iterations:argv.iterations, duration:argv.duration, priority:'!'});

		queue.enqueue(animation);

	}


	module.exports.command  = 'blink [options]';
	module.exports.describe = 'Blink';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
