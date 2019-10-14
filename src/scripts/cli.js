
mnodule.exports = class CLI {

	constructor(options) {
		var {command, describe} = options;

		module.exports.command  = command;
		module.exports.describe = describe;
		module.exports.builder  = this.defineArgs.bind(this);
		module.exports.handler  = this.run.bind(this);
	}

	defineArgs(args) {
		args.help('help').alias('help', 'h');
	}

	run() {
	}
}