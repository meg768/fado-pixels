#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Timer = require('yow/timer');
var Strip = require('../scripts/neopixel-strip.js');
var WifiSetup = require('../scripts/wifi-setup.js');

function debug() {
    console.log.apply(this, arguments);
}

var Module = new function() {



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



	function run(argv) {


		var timer = new Timer();

		registerService().then(function() {
			var ColorAnimation     = require('../scripts/color-animation.js');
			var RandomAnimation    = require('../scripts/random-animation.js');
			var BlankAnimation     = require('../scripts/animation.js');
            var PulseAnimation     = require('../scripts/pulse-animation.js');
            var ClockAnimation     = require('../scripts/clock-animation.js');

			debug('Connecting...');

			var socket           = require('socket.io-client')('http://app-o.se/neopixel-globe');
			var strip            = new Strip({width:16, height:1});
			var currentAnimation = undefined;
			var animationQueue   = [];
			var state            = 0;
			var busy             = false;

			socket.on('connect', function() {
				debug('Connected to socket server.');
				socket.emit('i-am-the-provider');
			});

			socket.on('disconnect', function() {
				debug('Disconnected from socket server');
			});


			socket.on('color', function(params, fn) {
				fn({status:'OK'});
				enqueue(new ColorAnimation(strip, params));
			});

			socket.on('random', function(params, fn) {
				fn({status:'OK'});
				enqueue(new RandomAnimation(strip, params));
			});

            socket.on('clock', function(params, fn) {
				fn({status:'OK'});
				enqueue(new ClockAnimation(strip, params));
			});

            socket.on('flash', function(params, fn) {
				fn({status:'OK'});
                enqueue(new PulseAnimation(strip, Object.assign({}, {interval:500, speed:50}, params)));
			});

            socket.on('pulse', function(params, fn) {
				fn({status:'OK'});
				enqueue(new PulseAnimation(strip, params));
			});

            socket.on('blink', function(params, fn) {
				fn({status:'OK'});
                enqueue(new PulseAnimation(strip, Object.assign({}, {interval:500, speed:250}, params));
			});

			function dequeue() {
				return new Promise(function(resolve, reject) {
					if (animationQueue.length > 0) {

						currentAnimation = animationQueue.splice(0, 1)[0];

						currentAnimation.run().then(function() {
							return dequeue();
						})
						.then(function() {
							currentAnimation = undefined;
							resolve();
						})
						.catch(function(error) {
							currentAnimation = undefined;
							reject(error);
						});
					}
					else {
						resolve();
					}

				});
			}

			function enqueue(animation) {

				var priority = animation.options.priority;

				if (priority == 'low' && busy)
					return;

				if (priority == '!') {
					animationQueue = [animation];

					if (currentAnimation != undefined) {
						currentAnimation.cancel();
					}
				}
				else if (priority == 'high') {
					animationQueue.unshift(message);
				}
				else {
					animationQueue.push(animation);
				}

				if (!busy) {
					busy = true;

					dequeue().catch(function(error) {
						console.log(error);
					})
					.then(function() {
						busy = false;

						debug('Entering idle mode...');

					})

				}
			}

			var setup = new WifiSetup('/boot/bluetooth/wifi.json');

			setup.on('connecting', () => {
				debug('Connecting to Wi-Fi...');
                enqueue(new PulseAnimation(strip, {priority:'!', color:'orange', duration:-1}));
			});

            setup.on('discoverable', () => {
				debug('Raspberry now discoverable.');
                enqueue(new PulseAnimation(strip, {priority:'!', color:'blue', duration:-1}));
			});

            setup.on('wifi-changed', () => {
			});

			setup.on('ready', () => {
				debug('Ready!');
                enqueue(new ClockAnimation(strip, {priority:'!', duration:-1}));
			});


			setup.setup();


		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel Globe';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
