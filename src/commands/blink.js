var Command = require('../scripts/command.js');

class BlinkCommand extends Command {
	constructor() {
		var defaults = {
			color      : 'red',
			duration   : 60000,
			interval   : 500
		};

		super({module:module, name: 'blink', description:'Blink light', defaults:defaults});
	}

	defineArgs(args) {
		args.option('color', {describe:'Color', default:this.defaults.color});
		args.option('duration', {describe:'Duration', default:this.defaults.duration});
		args.option('interval', {describe:'Interval', default:this.defaults.interval});
	}

	run(argv) {
		var Fado = require('../scripts/fado.js');
		var fado = new Fado(argv);
		fado.blink(argv);

	};
}

new BlinkCommand();
