#!/usr/bin/env node

require('dotenv').config();

var prefixLogs = require('yow/logs').prefix;

var App = function() {

	function loadConfig() {

		var fs = require('fs');
		var path = require('path');
		var parts = path.parse(__filename);
		var config = require('./scripts/config.js');
		var json = {};

		var configFile = path.join(parts.dir, parts.name, '.json');

		if (fs.existsSync(configFile)) {
			json = JSON.parse(fs.readFileSync(configFile));
		}

		Object.assign(config, json);

		console.log('Config', config);	
	}

	function run() {
		try {
			loadConfig();

			var args = require('yargs');

			args.usage('Usage: $0 <command> [options]');
			args.help();

			//args.command(require('./src/commands/server.js'));
			args.command(require('./src/commands/blink.js'));
			args.command(require('./src/commands/pulse.js'));
			args.command(require('./src/commands/clock.js'));
			args.command(require('./src/commands/test.js'));

			args.demandCommand(1);

			args.argv;
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
