

module.exports = class Command {

	constructor(options) {
		var config = require('./config.js');
		var merge = require('yow/merge');

		var {module, name, description, aliases, defaults} = options;

		if (!module || !name || !description)
			throw new Error('The module, command name and description must be specified.');

		module.exports.command  = `${name} [options]`;
		module.exports.desc     = description;
		module.exports.aliases  = aliases;

		module.exports.builder  = (yargs) => {
			yargs.wrap(null);
			yargs.option('help',  {describe:'Display help', default:false});
			yargs.option('debug', {describe:'Debug mode', boolean:true, default:false});
			yargs.option('log',   {describe:'Log mode', boolean:true, default:true});


			this.defineArgs(yargs);
		};

		module.exports.handler = (argv) => {

			if (argv.debug) {
				this.debug = console.debug;
			}

			if (argv.log) {
				this.log = console.log;
			}

			return this.run(argv)
		};

		this.log = () => {};
		this.debug = () => {};
		this.defaults = merge({}, defaults, config.commands && config.commands[name]);


	}

	defineArgs(yargs) {
	}

	run(argv) {
	}
}
