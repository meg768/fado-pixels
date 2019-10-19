var Command = require('../scripts/command.js');

class RandomCommand extends Command {

	constructor() {
		var defaults = {
			color           : 'green',
			duration        : 10000
		};

		super({module:module, name: 'random', description:'Random colors', defaults:defaults});


	}

	defineArgs(args) {
		args.option('duration', {describe:'Duration', default:this.defaults.duration});
		args.option('color', {describe:'Color', default:this.defaults.color});
	}


	run(argv) {
		var Fado = require('../scripts/fado.js');
		var fado = new Fado(argv);
		fado.random(argv);
	}
}

new RandomCommand();

