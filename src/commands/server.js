#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Timer = require('yow/timer');
var Strip = require('../scripts/neopixel-strip.js');
var io = require('socket.io-client');

var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('clock',     {alias:'c', describe:'Run clock animation',    default:undefined});
		args.option('weather',   {alias:'w', describe:'Run weather animation',  default:undefined});
		args.option('avanza',    {alias:'a', describe:'Run avanza animation',   default:undefined});
		args.option('matrix',    {alias:'m', describe:'Run matrix animation',   default:undefined});

		args.wrap(null);

		args.check(function(argv) {
			if (argv.clock == undefined && argv.weather == undefined && argv.avanza == undefined && argv.matrix == undefined)

				argv.clock   = true;
				argv.weather = true;
				argv.avanza  = true;
				argv.matrix  = true;

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

			var socket           = io.connect("hppt://app-o.se/");
			var strip            = new Strip({width:16, height:1});
			var animationIndex   = 0;
			var animations       = [];
			var currentAnimation = undefined;
			var state            = 0;

			animations.push(new ClockAnimation(strip));

			socket.on('connect', function() {

				console.log('Connected to socket server.');

				socket.emit('i-am-the-provider');
			});

			socket.on('disconnect', function() {
				console.log('Disconnected from socket server');
			});


			socket.on('colorize', function(params, fn) {
				fn({status:'OK'});

				console.log('Colorize!');


			});



			function disableAnimations() {
			}


			function enableAnimations() {
				disableAnimations();
				runNextAnimation();

			}

			function runAnimation(animation) {


                return new Promise((resolve, reject) => {

					if (animation == undefined)
						animation = new BlankAnimation(strip, {timeout:-1});

					currentAnimation = animation;

					animation.run().then(() => {
					})

					.catch((error) => {
						console.log(error);
					})

					.then(() => {
						currentAnimation = undefined;
						resolve();

					})
                });

			}


			function runNextAnimation() {


                return new Promise((resolve, reject) => {

					// Get next animation
					var animation = animations[animationIndex];

					runAnimation(animation).then(() => {
					})

					.catch((error) => {
						console.log(error);
					})

					.then(() => {
						animationIndex = (animationIndex + 1) % animations.length;
						setTimeout(runNextAnimation, 0);

						resolve();

					})
                });

			}

			enableAnimations();


		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel Globe';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
