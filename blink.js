#!/usr/bin/env node



class App {

	constructor() {
		var yargs = require('yargs');

		yargs.usage('Usage: $0 <command> [options]');
		yargs.help();

		yargs.option('color', {describe:'Color', default:'red'});
		console.log(yargs.argv);

		this.run(yargs.argv);
	
	}



	run(argv) {
		try {


			var Fado = require('./src/scripts/fado.js');
			var fado = new Fado();

			var options = {
				color      : argv.color,
				duration   : 60000,
				iterations : 5,
				interval   : 500
			};
	
			fado.blink(options);		
		}

		catch(error) {
			console.log(error.stack);
			process.exit(-1);
		}

	}
} 


module.exports = new App();
