#!/usr/bin/env node

var Path             = require('path');
var sprintf          = require('yow/sprintf');
var isObject         = require('yow/is').isObject;
var isString         = require('yow/is').isString;
var isFunction       = require('yow/is').isFunction;
var Strip            = require('rpi-neopixels').Strip;
var AnimationQueue   = require('rpi-neopixels').AnimationQueue;
var Gpio       = require('pigpio').Gpio;

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

		var pin      = 19;
		var timeout = null;
		//var gpio     = new Gpio(pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_UP, edge: Gpio.RISING_EDGE});
		var gpio     = new Gpio(pin, {mode: Gpio.INPUT, alert:true});

		console.log('Test started.')

//		gpio.glitchFilter(10000);
		gpio.on('interrupt', (state, time) => {


			console.log('interrupt', state, time);
		});		

		var startTick = null;
		gpio.on('alert', (level, tick) => {

			if (level > 0) {
				//console.log('alert', level, tick);
				if (timeout != null) {
					clearTimeout(timeout);
					timeout = null;
				}
				else {
					//console.log('First tick', tick);
					startTick = tick;
				}
				timeout = setTimeout(() => {
					//console.log('Last tick', tick);
					var endTick = tick;
					var diff = (endTick >> 0) - (startTick >> 0);
					console.log('dB-ish', diff);
					clearTimeout(timeout);
					timeout = null;

				}, 100);
				
			}
		});


	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
