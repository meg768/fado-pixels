#!/usr/bin/env node

class App {

	constructor() {
		var yargs = require('yargs');
		yargs.help();

		this.run(yargs.argv);
	}

	run(argv) {
		try {
			var Animation = require('./src/scripts/clock-animation.js'); 
			var Fado = require('./src/scripts/fado.js');
			var fado = new Fado();
	
			var options = {
				pixels:fado.pixels
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
