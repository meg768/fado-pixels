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

		var localConfigFile = path.join(parts.dir, parts.name + '.json');
		var bootConfigFile  = path.join('/boot', parts.name + '.json');

		if (fs.existsSync(localConfigFile)) {
			merge(config, JSON.parse(fs.readFileSync(localConfigFile)));
		}

		if (fs.existsSync(bootConfigFile)) {
			merge(config, JSON.parse(fs.readFileSync(bootConfigFile)));
		}

		process.on('unhandledRejection', (reason, p) => {
			console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
		});

		this.run();
	
	}


	run() {
		try {
			var Fado = require('./scripts/fado.js');
			var fado = new Fado(argv);

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
