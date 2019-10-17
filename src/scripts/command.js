console.log(`Loading ${__filename}...`);



module.exports = class Command {

	constructor(options) {
		var appConfig = require('./config.js');
		var merge = require('./merge.js');

		var {module, name, description, aliases, config} = options;

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
		this.config = merge({}, config, appConfig.commands && appConfig.commands[name]);


	}

	defineArgs(yargs) {
	}

	run(argv) {
	}
}

console.log(`Finished loading ${__filename}...`);
