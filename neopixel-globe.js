#!/usr/bin/env node

require('dotenv').config();

var prefixLogs = require('yow/logs').prefix;

var App = function() {

	function loadConfig() {

		function merge() {
			function collate(a, b) {
				if (b) {
					if (b.constructor == Object) {
						for (var p in b) {
							if (b[p].constructor == Object) {
								if (a[p]) {
									collate(a[p], b[p]);
									continue;
								}
							} 
							a[p] = b[p];
						}	
					}
					else if (b.constructor == Array) {
						b.forEach((c) => {
							collate(a, c);
						});
					}
				} 
			};	
			
		
			for (var i = 1; i < arguments.length; i++) {
				collate(arguments[0], arguments[i]);
			}
		
			return arguments[0];
		}
		
	
		var fs = require('fs');
		var path = require('path');
		var parts = path.parse(__filename);
		var config = require('./src/scripts/config.js');

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

			var args = require('yargs');

			args.usage('Usage: $0 <command> [options]');
			args.help();

			//args.command(require('./src/commands/server.js'));
			args.command(require('./src/commands/blink.js'));
			args.command(require('./src/commands/pulse.js'));
			args.command(require('./src/commands/clock.js'));
			args.command(require('./src/commands/spy.js'));

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
