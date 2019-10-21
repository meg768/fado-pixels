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

		var offlineColor = Color('purple').rgbNumber();
		var quotes = new Quotes({debug:debug, symbol:symbol});
		var button = new Button({debug: debug, autoEnable: true, pin: 6});
		var fado = new Fado({debug: debug});
		var state = 'on';

		button.on('click', (clicks) => {
			if (state == 'on') {
				fado.color({fade:500, iterations:1, color: 'black', priority: '!'});
			}
			else {
				fado.pulse({duration: -1, color: offlineColor, priority: '!' });
			}

			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

		quotes.on('marketOpened', () => {
			fado.pulse({color:'blue', antiColor:'black', interval:1000, iterations:5, priority: '!'});	
			fado.color({color:offlineColor, fade:500, duration:-1, renderFrequency:10000});
		});

		quotes.on('marketClosed', () => {
			fado.pulse({color:'red', antiColor:'black', interval:1000, iterations:5, priority: '!'});
			fado.color({color:offlineColor, fade:500, duration:-1, renderFrequency:10000});
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
			fado.color({color:color, fade:500, renderFrequency:1000, duration:-1, priority:'!'});
		});

		quotes.startMonitoring();
		fado.color({color:offlineColor, fade:500, duration:-1, renderFrequency:10000});


	}

}

new SpyCommand();

