#!/usr/bin/env node


require('yow/prefixConsole')();
require('dotenv').config();
require('yargs');


class App {

	constructor() {
		


		process.on('unhandledRejection', (reason, p) => {
			console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
		});

		this.run();
	
	}


	getArgv() {
		var yargs = require('yargs');

		yargs.usage('Usage: $0 <command> [options]');
		yargs.help();

		yargs.option('color', {describe:'Color', default:'red'});
		console.log(yargs.argv);

		return yargs.argv;
	}

	run() {
		try {


			var Fado = require('./src/scripts/fado.js');
			var fado = new Fado();
			var argv = this.getArgv();

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
