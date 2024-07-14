#!/usr/bin/env node

class App {

	constructor() {
		var yargs = require('yargs');

		yargs.option('color', {describe:'Color', default:'red'});
		yargs.option('duration', {describe:'Duration', default:10000});
		yargs.option('interval', {describe:'Interval', default:1000});

		yargs.help();

		this.run(yargs.argv);
	}

	run(argv) {
		try {
			var Animation = require('./src/scripts/pulse-animation.js'); 
			var Fado = require('./src/scripts/fado.js');
			var fado = new Fado();
	
			var options = {
				pixels     : fado.pixels,
				debug      : console.log,
				color      : argv.color,
				duration   : argv.duration,
				interval   : argv.interval
			};
	
			fado.runAnimation(new Animation(options));
		}

		catch(error) {
			console.log(error.stack);
			process.exit(-1);
		}

	}
} 


new App();
