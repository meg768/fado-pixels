#!/usr/bin/env node

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
		console.log('---------');
		console.log(config);
		console.log('---------');
	}

	function run() {
		try {
			console.log('RUN started');
			loadConfig();

			var args = require('yargs');

			args.usage('Usage: $0 <command> [options]');
			args.help();

			//args.command(require('./src/commands/server.js'));
			args.command(require('./src/commands/blink.js'));
			//args.command(require('./src/commands/pulse.js'));
			//args.command(require('./src/commands/clock.js'));
//			args.command(require('./src/commands/spy.js'));

			//args.demandCommand(1);

			console.log('Started parsing');
			args.parse();
			console.log('Finished parsing');
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
