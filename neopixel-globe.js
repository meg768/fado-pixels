#!/usr/bin/env node

require('yow/logs').prefix();

var debug = console.log;

debug('Loading dotenv...');
require('dotenv').config();
debug('Loading yargs...');
require('yargs');
debug('Finished loading...');



var App = function() {

	function loadConfig() {

		
		var fs = require('fs');
		var path = require('path');
		var parts = path.parse(__filename);
		var config = require('./src/scripts/config.js');
		var merge = require('./src/scripts/merge.js');

		var localConfigFile = path.join(parts.dir, parts.name + '.json');
		var bootConfigFile  = path.join('/boot', parts.name + '.json');

		if (fs.existsSync(localConfigFile)) {
			merge(config, JSON.parse(fs.readFileSync(localConfigFile)));
		}

		if (fs.existsSync(bootConfigFile)) {
			merge(config, JSON.parse(fs.readFileSync(bootConfigFile)));
		}
	}

	function run() {
		try {
			var yargs = require('yargs');

			loadConfig();

			yargs.usage('Usage: $0 <command> [options]');
			yargs.help();

			debug('Loading commands...')
			yargs.command(require('./src/commands/blink.js'));
			yargs.command(require('./src/commands/pulse.js'));
			yargs.command(require('./src/commands/clock.js'));
			yargs.command(require('./src/commands/spy.js'));
			debug('Finished loading commands...')

			yargs.demandCommand(1);

			yargs.parse();
		}

		catch(error) {
			console.log(error.stack);
			process.exit(-1);
		}

	};

/*
	process.on('unhandledRejection', (reason, p) => {
		console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	});
*/
	run();
};

module.exports = new App();
