#!/usr/bin/env node

var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('../scripts/animation-queue.js');
var BlinkAnimation   = require('../scripts/blink-animation.js');


var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.option('iterations', {describe:'Iterations', default:undefined});
		args.option('duration', {describe:'Duration', default:undefined});
		args.option('color', {describe:'Color', default:'white'});
		args.option('length', {describe:'Length', default:500});
		args.option('fadeIn', {describe:'Fade in', default:undefined});
		args.option('fadeOut', {describe:'Fade out', default:undefined});


		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {

		console.log(argv);
		var {debug, color, length, iterations, duration} = argv;

		var pixels     = new Neopixels();
		var queue      = new AnimationQueue({debug:argv.debug});
		var options    = {pixels:pixels, priority:'!', ...argv};
	
		//var animation = new BlinkAnimation({pixels:pixels, length:argv.length, debug:argv.debug, color:argv.color, iterations:argv.iterations, duration:argv.duration, priority:'!'});

		var animation = new BlinkAnimation(options);
		queue.enqueue(animation);

	}


	module.exports.command  = 'blink [options]';
	module.exports.describe = 'Blink';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
