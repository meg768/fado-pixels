var Command = require('../scripts/command.js');

class SpyCommand extends Command {

	constructor() {
		var defaults = {
			symbol: 'SPY'
		};
		super({ module: module, name: 'spy', description: 'Displays stock market symbol as a color', defaults: defaults });
	}

	defineArgs(yargs) {
		yargs.option('symbol', { describe: 'Stock symbol to display', default: this.defaults.symbol });
	}

	run(argv) {
		var Fado = require('../scripts/fado.js');
		var Button = require('pigpio-button');

		var button = new Button({debug: argv.debug, autoEnable: true, pin: 6});
		var fado = new Fado({debug: argv.debug});
		var state = 'on';

		button.on('click', (clicks) => {
			if (state == 'on') {
				fado.color({ ...argv, renderFrequency: 10000, renderOptions: { transition: 'fade', duration: 500 }, duration: -1, color: 'black', priority: '!' });
			}
			else {
				fado.spy({ ...argv, priority: '!' });
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

		fado.spy({...argv, priority: '!'});

	}

}

new SpyCommand();

