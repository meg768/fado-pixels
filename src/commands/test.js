#!/usr/bin/env node

var Path             = require('path');
var sprintf          = require('yow/sprintf');
var isObject         = require('yow/is').isObject;
var isFunction       = require('yow/is').isFunction;

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

        if (argv.debug) {
            debug = function() {
                console.log.apply(this, arguments);
            }
        }

		registerService().then(function() {
			debug('Starting...');

			var socket           = require('socket.io-client')('http://app-o.se/neopixels/KALLE');


			socket.on('connect', function() {
				debug('Connected to neopixels server.');
			});

			socket.on('disconnect', function() {
				debug('Disconnected from socket server');
			});


			socket.on('change', function(params) {
				debug('Neopixels changed!', params);
			});


		});


	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Run Test';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
