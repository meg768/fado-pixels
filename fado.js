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
			var yargs = require('yargs');

			yargs.usage('Usage: $0 <command> [options]');
			yargs.help();

			yargs.command(require('./src/commands/blink.js'));
			yargs.command(require('./src/commands/pulse.js'));
			yargs.command(require('./src/commands/clock.js'));
			yargs.command(require('./src/commands/color.js'));
			yargs.command(require('./src/commands/mqtt.js'));

			yargs.demandCommand(1);

			yargs.argv;
		}

		catch(error) {
			console.log(error.stack);
			process.exit(-1);
		}

	}
} 


module.exports = new App();
