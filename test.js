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

		var timer = null;

		registerService().then(function() {
			debug('Starting...');

			var socket = require('socket.io-client')('http://app-o.se/neopixels-KALLE');

			socket.on('connect', function() {
				debug('Connected to neopixels');

				if (timer != null) {
					clearInterval(timer);
					timer = null;

				}
			});

			socket.on('disconnect', function() {
				debug('Disconnected from neopixels');

				timer = setInterval(function() {
					debug('Trying to reconnect');
					socket = require('socket.io-client')('http://app-o.se/neopixels-KALLE');

				}, 5000);

			});


			socket.on('change', function(params) {
				debug('Neopixels changed!', params);
			});

			function run() {
				debug('Running!');
				socket.emit('blink', {priority:'!', duration:2000, color:'blue'}, function(response) {
					debug('Response from blink');
					debug(response);
				});

			}
			setInterval(run, 10000);

		});


	}

	run();


};


new Module();
