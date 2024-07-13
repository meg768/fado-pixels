#!/usr/bin/env node



class App {

	constructor() {
		var yargs = require('yargs');

		yargs.help();
		yargs.option('color', {describe:'Color', default:'red'});
		yargs.option('interval', {describe:'Interval', default:100});
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
				interval   : argv.interval
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
