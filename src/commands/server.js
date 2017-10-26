#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Timer = require('yow/timer');
var Strip = require('../scripts/neopixel-strip.js');

var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

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
			var ClockAnimation     = require('../scripts/clock-animation.js');
			var BlankAnimation     = require('../scripts/animation.js');

			console.log('Connecting...');

			var socket           = require('socket.io-client')('http://app-o.se/neopixel-globe');
			var strip            = new Strip({width:16, height:1});
			var currentAnimation = undefined;
			var animationQueue   = [];
			var state            = 0;
			var busy             = false;


			socket.on('connect', function() {

				console.log('Connected to socket server.');

				socket.emit('i-am-the-provider');
			});

			socket.on('disconnect', function() {
				console.log('Disconnected from socket server');
			});


			socket.on('colorize', function(params, fn) {
				fn({status:'OK'});

				console.log('Colorize!', params);
				enqueue(new ClockAnimation(strip, params));

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

				if (animation.priority == 'low' && busy)
					return;

				if (animation.priority == '!') {
					animationQueue = [animation];

					if (currentAnimation != undefined) {
						currentAnimation.cancel();
					}
				}
				else if (animation.priority == 'high') {
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
						//socket.emit('idle', {});

					})

				}
			}



			enqueue(new ClockAnimation(strip));


		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel Globe';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
