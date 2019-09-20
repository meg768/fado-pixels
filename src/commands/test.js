#!/usr/bin/env node

var Path             = require('path');
var sprintf          = require('yow/sprintf');
var isObject         = require('yow/is').isObject;
var isString         = require('yow/is').isString;
var isFunction       = require('yow/is').isFunction;
var Strip            = require('rpi-neopixels').Strip;
var AnimationQueue   = require('rpi-neopixels').AnimationQueue;
var Gpio       = require('pigpio').Gpio;
//var SoundSensor = require('../scripts/sound-sensor.js');

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
		var SoundSensor = require('../scripts/pigpio-vma309.js');
		var sensor = new SoundSensor({pin:19, xdebug:console.log});

		sensor.on('alert', (duration) => {
			console.log('Sound detected', duration);
		});

	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
