module.exports = class CLI {

	constructor(options) {
		var {module, command, desc, aliases} = options;

		if (!module || !command || !desc)
			throw new Error('The module, command name (command) and description (desc) must be specified.');

		module.exports.command  = command;
		module.exports.desc     = desc;
		module.exports.aliases  = aliases;
		module.exports.builder  = this.defineArgs.bind(this);
		module.exports.handler  = this.run.bind(this);

		this.debug = () => {};
	}

	defineArgs(yargs) {
		yargs.option('help',  {alias:'H', describe:'Display help', default:false});
		yargs.option('debug', {alias:'D', describe:'Debug mode', default:false});

		yargs.wrap(null);

		yargs.check((argv) => {
			if (argv.debug) {
				console.log('DEBUG MODE');
				this.debug = console.log;

			}
			return true;
		});


	}


	run(argv) {
	}
}