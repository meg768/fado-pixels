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
			var io = require('socket.io-client');

			//var socket = require('socket.io-client')('http://app-o.se/neopixels-KALLE');
			//var socket = io.connect('http://app-o.se/neopixels-KALLE', {'forceNew': true});
			//var socket = io.connect('http://app-o.se/neopixels-KALLE', {});
			var socket = io.connect('http://app-o.se/neopixels?instance=KALLE', {});



			function init(socket) {

				socket.on('connect', function() {
					debug('Connected to neopixels', socket.id);



				});

				socket.on('event', function(data) {
					debug('Event:', data);
				});


				socket.on('reconnecting', function(attempt) {
					debug('Reconnecting', attempt);
					//socket.open();

				});

				socket.on('reconnect_error', function(error) {
					debug('Reconnect error', error.message);
					//socket.open();

				});

				socket.on('reconnect', function(attempt) {
					debug('Reconnect', socket.id, attempt);
					//socket.open();
					//socket.io.reconnect();

					//debug(socket);
				});

				socket.on('connect_error', function(error) {
					debug('Connect error', error.message);

				});

				socket.on('disconnecting', function() {
					debug('Disconnecting');

				});
				socket.on('disconnect', function() {
					//init(socket);
					debug('Disconnected from neopixels');

					//socket = io.connect('http://app-o.se/neopixels-KALLE');
					//init(socket);
				});


				socket.on('change', function(params) {
					debug('Neopixels changed!', params);
				});


			}

			init(socket);

			function run() {
				debug('Running. Socket state', socket.connected);
				if (true) {
					socket.emit('blink', {priority:'!', duration:1000, color:'blue'}, function(response) {
						debug('Response from blink');
						debug(response);
					});

				}


			}
			setInterval(run, 5000);

		});


	}

	run();


};


new Module();
