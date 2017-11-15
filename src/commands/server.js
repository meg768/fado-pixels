#!/usr/bin/env node

var Path             = require('path');
var sprintf          = require('yow/sprintf');
var isObject         = require('yow/is').isObject;
var isFunction       = require('yow/is').isFunction;
var Strip            = require('rpi-neopixels').Strip;
var AnimationQueue   = require('rpi-neopixels').AnimationQueue;
var Monitor          = require('rpi-obex-monitor');
var Wifi             = require('rpi-wifi-connection');
var Button           = require('../scripts/button.js');

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

	function registerService() {
		return Promise.resolve();
	}



	function run(argv) {

        if (argv.debug) {
            debug = function() {
                console.log.apply(this, arguments);
            }
        }

		registerService().then(function() {
			var ColorAnimation     = require('../scripts/color-animation.js');
			var RandomAnimation    = require('../scripts/random-animation.js');
            var PulseAnimation     = require('../scripts/pulse-animation.js');
            var ClockAnimation     = require('../scripts/clock-animation.js');

			debug('Connecting...');

			var socket           = require('socket.io-client')('http://app-o.se/neopixel-globe');
			var strip            = new Strip({width:16, height:1, debug:argv.debug});
			var animationQueue   = new AnimationQueue({debug:argv.debug});
            var wifi             = new Wifi({debug:argv.debug});
            var monitor          = new Monitor({debug:argv.debug});
            var animationIndex   = 0;
            var animations       = [ClockAnimation];
            var duration         = 60000;
			var button           = new Button({autoEnable:true, pin:19});
			var onoff            = true;

			button.on('click', () => {
				debug('Click!!');

				if (onoff) {
					runAnimation(new ColorAnimation(strip, {color:'black', priority:'!', duration:-1}));
				}
				else {
					runNextAnimation();
				}

				onoff = !onoff;
			});

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

            monitor.on('upload', (fileName, content) => {

                // The file has already been deleted.
                // File contents is in the contents parameter.
                debug('File uploaded', Path.join(monitor.path, fileName));

                try {
                    var json = JSON.parse(content);

                    if (json.ssid != undefined) {
                        debug('Connecting to network', json.ssid, '...');
                        runAnimation(new PulseAnimation(strip, {priority:'!', color:'orange', duration:-1}));

                        wifi.connect({ssid:json.ssid, psk:json.password}).then(() => {
                            debug('Connected to network.');
                            runNextAnimation();
                        })
                        .catch((error) => {
                            runAnimation(new PulseAnimation(strip, {priority:'!', color:'blue', duration:-1}));
                            console.log(error);
                        });

                    }
                }
                catch(error) {
                    debug('Invalid file contents');
                }
            });

            monitor.enableBluetooth();

            // Start monitoring. Stop by calling stop()
            monitor.start();

            wifi.getState().then((connected) => {
                if (connected) {
                    runNextAnimation();
                }
                else {
                    runAnimation(new PulseAnimation(strip, {priority:'!', color:'blue', duration:-1}));
                }

            })
            .catch(() => {
                runAnimation(new PulseAnimation(strip, {priority:'!', color:'blue', duration:-1}));

            })


		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel Globe';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
