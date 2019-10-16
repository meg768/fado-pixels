#!/usr/bin/env node

require('dotenv').config();

var prefixLogs = require('yow/logs').prefix;

var App = function() {

	function loadConfig() {

		var fs = require('fs');
		var path = require('path');
		var parts = path.parse(__filename);
		var config = require('./src/scripts/config.js');

		var localConfigFile = path.join(parts.dir, parts.name + '.json');
		var bootConfigFile  = path.join('/boot', parts.name + '.json');

		console.log('Config files:', localConfigFile, bootConfigFile);

		if (fs.existsSync(localConfigFile)) {
			var json = JSON.parse(fs.readFileSync(localConfigFile));
			Object.assign(config, json);
		}

		if (fs.existsSync(bootConfigFile)) {
			var json = JSON.parse(fs.readFileSync(bootConfigFile));
			Object.assign(config, json);
		}

		console.log('Config', require('./src/scripts/config.js'));	
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
