#!/usr/bin/env node

var CLI = require('../scripts/cli.js');

class CLIX {

	constructor(options) {
		var {command, describe} = options;

		module.exports.command  = command;
		module.exports.describe = describe;
		module.exports.builder  = this.defineArgs.bind(this);
		module.exports.handler  = this.run.bind(this);
	}

	defineArgs(args) {
	}

	run() {
	}
}

class BlinkCommand extends CLI {

	constructor() {
		super({command:'blink [options]', describe:'Blink'});
	}

	defineArgs(args) {
		super.defineArgs(args);

		args.option('iterations', {describe:'Iterations', default:undefined});
		args.option('duration', {describe:'Duration', default:undefined});
		args.option('color', {describe:'Color', default:'white'});
		args.option('hold', {describe:'Hold', default:200});
		args.option('fadeIn', {describe:'Fade in', default:undefined});
		args.option('fadeOut', {describe:'Fade out', default:undefined});
		args.option('fade', {describe:'Fade in & out', default:undefined});
		args.option('fadeInOut', {describe:'Fade in & out', default:undefined});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});

	}

	run(argv) {
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		var BlinkAnimation   = require('../scripts/blink-animation.js');
		
		var queue      = new AnimationQueue({debug:argv.debug});
		var options    = {pixels:new Neopixels(), priority:'!', ...argv};	
		var animation  = new BlinkAnimation(options);

		queue.enqueue(animation);

	}
}

new BlinkCommand();


/*
var Module = new function() {

	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.option('iterations', {describe:'Iterations', default:undefined});
		args.option('duration', {describe:'Duration', default:undefined});
		args.option('color', {describe:'Color', default:'white'});
		args.option('hold', {describe:'Hold', default:200});
		args.option('fadeIn', {describe:'Fade in', default:undefined});
		args.option('fadeOut', {describe:'Fade out', default:undefined});
		args.option('fade', {describe:'Fade in & out', default:undefined});
		args.option('fadeInOut', {describe:'Fade in & out', default:undefined});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {

		var queue      = new AnimationQueue({debug:argv.debug});
		var options    = {pixels:new Neopixels(), priority:'!', ...argv};	
		var animation  = new BlinkAnimation(options);

		queue.enqueue(animation);
	}


	module.exports.command  = 'blink [options]';
	module.exports.describe = 'Blink';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

*/