#!/usr/bin/env node

var Path             = require('path');
var sprintf          = require('yow/sprintf');
var isObject         = require('yow/is').isObject;
var isString         = require('yow/is').isString;
var isFunction       = require('yow/is').isFunction;
var Neopixels        = require('rpi-neopixels');
var AnimationQueue   = require('rpi-animations').Queue;
var BlinkAnimation   = require('../scripts/blink-animation.js');

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

		var pixels    = new Neopixels({width:24, height:1, debug:argv.debug});
		var queue     = new AnimationQueue({debug:argv.debug});
		var duration  = 60000;

		var animation = new BlinkAnimation(pixels, {duration:duration, priority:'!'});

		queue.enqueue(animation);

	}


	module.exports.command  = 'blink [options]';
	module.exports.describe = 'Blink';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
