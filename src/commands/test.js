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
		var button  = new Button({autoEnable:true, pin:19});

		var pin      = 19;
		var gpio     = new Gpio(pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});

		console.log('Test started.')


		gpio.on('interrupt', (state, time) => {

			console.log(state, time);
		});		


	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
