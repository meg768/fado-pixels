#!/usr/bin/env node

var Path             = require('path');
var sprintf          = require('yow/sprintf');
var isObject         = require('yow/is').isObject;
var isFunction       = require('yow/is').isFunction;

function debug() {
	console.log.apply(this, arguments);
}

var Module =  function() {



	function defineArgs(args) {

		args.help('help').alias('help', 'h');


		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}

	function registerService() {
		return Promise.resolve();
	}



	function run() {


		registerService().then(function() {
			debug('Starting...');

			var socket = require('socket.io-client')('http://app-o.se/neopixels/KALLE');

			socket.on('connect', function() {
				debug('Connected to neopixels');
			});

			socket.on('disconnect', function() {
				debug('Disconnected from neopixels');
			});


			socket.on('change', function(params) {
				debug('Neopixels changed!', params);
			});

			function run() {
				debug('Running!');
				socket.emit('blink', {}, function(response) {
					debug('Response from blink');
					debug(response);
				});

			}
			setTimeout(run, 3000);

		});


	}

	run();


};


new Module();
