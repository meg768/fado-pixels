#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Timer = require('yow/timer');
var Strip = require('../scripts/neopixel-strip.js');
var WifiSetup = require('../scripts/wifi-setup.js');
var AnimationQueue = require('../scripts/animation-queue.js');

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
			var animationQueue   = new AnimationQueue();
            var animationIndex   = 0;
            var animations       = [ClockAnimation, RandomAnimation];
            var duration         = 60000;

			function runNextAnimation() {

				animationIndex = (animationIndex + 1) % animations.length;

				// Get next animation
				var Animation = animations[animationIndex % animations.length];
				var animation = new Animation(strip, {duration:duration, priority:'!'});

				runAnimation(animation);
            }

			function runAnimation(animation) {
				animationQueue.enqueue(animation);

			}

			animationQueue.on('idle', () => {
				debug('Idle. Running next animation');
				runNextAnimation();
			});

			socket.on('connect', function() {
				debug('Connected to socket server.');
				socket.emit('i-am-the-provider');
			});

			socket.on('disconnect', function() {
				debug('Disconnected from socket server');
			});


			socket.on('color', function(params, fn) {
				fn({status:'OK'});
				runAnimation(new ColorAnimation(strip, params));
			});

			socket.on('random', function(params, fn) {
				fn({status:'OK'});
				runAnimation(new RandomAnimation(strip, params));
			});

            socket.on('clock', function(params, fn) {
				fn({status:'OK'});
				runAnimation(new ClockAnimation(strip, params));
			});

            socket.on('flash', function(params, fn) {
				fn({status:'OK'});
                runAnimation(new PulseAnimation(strip, Object.assign({}, {interval:500, delay:0, length:50}, params)));
			});

            socket.on('pulse', function(params, fn) {
				fn({status:'OK'});
				runAnimation(new PulseAnimation(strip, params));
			});

            socket.on('blink', function(params, fn) {
				fn({status:'OK'});
                runAnimation(new PulseAnimation(strip, Object.assign({}, {interval:1000, delay:0, length:500}, params)));
			});


            function startup() {


				var setup = new WifiSetup('/boot/bluetooth/wifi.json');

				setup.on('connecting', () => {
					debug('Connecting to Wi-Fi...');
                    runAnimation(new PulseAnimation(strip, {priority:'!', color:'orange', duration:-1}));
				});

	            setup.on('discoverable', () => {
					debug('Raspberry now discoverable.');
                    runAnimation(new PulseAnimation(strip, {priority:'!', color:'blue', duration:-1}));
				});

	            setup.on('wifi-changed', () => {
				});

				setup.on('ready', () => {
					debug('Ready!');
					runNextAnimation();
				});


				setup.setup();

			}

			startup();



		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel Globe';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
