#!/usr/bin/env node


require('yow/prefixConsole')();
require('dotenv').config();
require('yargs');


class App {

	constructor() {
		
		var fs = require('fs');
		var path = require('path');
		var parts = path.parse(__filename);
		var config = require('./src/scripts/config.js');
		var merge = require('yow/merge');

		config.neopixels = {
			"stripType":"rgb",
			"width": 24,
			"height": 1	
		};


		process.on('unhandledRejection', (reason, p) => {
			console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
		});

		this.run();
	
	}


	run() {
		try {
			var Fado = require('./src/scripts/fado.js');
			var fado = new Fado();

			var options = {
				color      : 'red',
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
