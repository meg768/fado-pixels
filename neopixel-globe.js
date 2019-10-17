#!/usr/bin/env node

console.log('Loading yargs...');
var yargs = require('yargs');
var Button           = require('pigpio-button');
var Yahoo            = require('yahoo-finance');
var sprintf          = require('yow/sprintf');
var Color            = require('color');

console.log('Finished loading yargs...');

require('dotenv').config();

var prefixLogs = require('yow/logs').prefix;

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

			loadConfig();

			yargs.usage('Usage: $0 <command> [options]');
			yargs.help();

			yargs.command(require('./src/commands/blink.js'));
			yargs.command(require('./src/commands/pulse.js'));
			yargs.command(require('./src/commands/clock.js'));
			yargs.command(require('./src/commands/spy.js'));

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
	prefixLogs();
	run();
};

module.exports = new App();
