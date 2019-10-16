var config = require('./config.js');

module.exports = class Command {

	constructor(options) {
		var {module, name, description, aliases, defaultConfig} = options;

		if (!module || !name || !description)
			throw new Error('The module, command name and description must be specified.');

		module.exports.command  = `${name} [options]`;
		module.exports.desc     = description;
		module.exports.aliases  = aliases;

		module.exports.builder  = (yargs) => {
			yargs.wrap(null);
			yargs.option('help',  {describe:'Display help', default:false});
			yargs.option('debug', {describe:'Debug mode', boolean:true, default:false});
	

			this.defineArgs(yargs);
		};

		module.exports.handler  = (argv) => {

			if (argv.debug) {
				this.log(argv);
				this.debug = this.log;
			}

			return this.run(argv)
		};

		this.log = console.log;
		this.debug = () => {};
		this.config = Object.assign({}, defaultConfig || {}, (config.commands && config.commands[name]) || {});

	}

	defineArgs(yargs) {
	}

	run(argv) {
	}
}