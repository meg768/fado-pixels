#!/usr/bin/env node


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
		var SoundSensor = require('pigpio-vma309');
		var sensor = new SoundSensor({pin:19});

		sensor.on('alert', (duration) => {
			console.log('Sound detected for %d milliseconds', duration);
		});

	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
