module.exports = class CLI {

	constructor(options) {
		var {module, command, describe} = options;

		if (!module || !command || !describe)
			throw new Error('The module, command name and description must be specified.');

		module.exports.command  = command;
		module.exports.describe = describe;
		module.exports.builder  = this.defineArgs.bind(this);
		module.exports.handler  = this.run.bind(this);
	}

	defineArgs(args) {
		//args.option('help').alias('help', 'h');
		args.option('help',  {alias:'H', describe:'Display help', default:false});
		args.option('debug', {alias:'D', describe:'Debug mode', default:false});

		args.wrap(null);

	}

	run() {
	}
}