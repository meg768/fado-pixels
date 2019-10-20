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
		var Color = require('color');
		var Button = require('pigpio-button');
		var Fado = require('../scripts/fado.js');
		var Quotes = require('../scripts/quotes.js');

		var {debug, symbol} = argv;


		var quotes = new Quotes({debug:debug, symbol:symbol});
		var button = new Button({debug: debug, autoEnable: true, pin: 6});
		var fado = new Fado({debug: debug});
		var state = 'on';


		quotes.on('marketOpen', () => {
			fado.blink();
		});

		quotes.on('marketClose', () => {
			fado.blink();			
		});

		quotes.on('quote', (quote) => {
			function computeColorFromQuote(quote) {

				var color = Color('purple').rgbNumber();

				if (quote && quote.change) {
					var change     = Math.max(-1, Math.min(1, quote.change));
					var hue        = change >= 0 ? 240 : 0;
					var saturation = 100;
					var luminance  = 25 + (Math.abs(change) * 25);
			
					color = Color.hsl(hue, saturation, luminance).rgbNumber();
			
				}

				return color;
			}

			var color = computeColorFromQuote(quote);
			fado.color({color:color});

		});
/*
		button.on('click', (clicks) => {
			if (state == 'on') {
				fado.color({renderFrequency: 10000, renderOptions: { transition: 'fade', duration: 500 }, duration: -1, color: 'black', priority: '!' });
			}
			else {
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});
*/

	}

}

new SpyCommand();

