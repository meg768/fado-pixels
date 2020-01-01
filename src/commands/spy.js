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

		var {symbol} = argv;

		var colors = {
			offline: Color('purple').rgbNumber(),
			on: Color('white').rgbNumber(),
			off: Color('black').rgbNumber()
		};

		var quotes = new Quotes({log:this.log, debug:this.debug, symbol:symbol});
		var button = new Button({log:this.log, debug:this.debug, autoEnable: true, pin: 6});
		var fado = new Fado({log:this.log, debug: this.debug});
		var state = 'spy';

		fado.queue.on('idle', () => {
			fado.color({color:'green', fade:500, renderFrequency:60000, duration:-1});
		});


		button.on('click', (clicks) => {

			switch (state) {
				case 'spy': {
					nextState = 'off';
					break;
				}
				case 'off': {
					nextState = 'on';
					break;
				}
				case 'on': {
					nextState = 'spy';
					break;
				}
			}


			switch (state) {
				case 'spy': {
					fado.color({color:colors.offline, fade:500, renderFrequency:60000, duration:-1, priority: '!'});
					quotes.requestQuote();
					break;
				}
				case 'off': {
					fado.color({color:colors.off, fade:500, renderFrequency:60000, duration:-1, priority: '!'});
					break;
				}
				case 'on': {
					fado.color({color:colors.on, fade:500, renderFrequency:60000, duration:-1, priority: '!'});
					break;
				}
			}

			state = nextState;
			this.debug(`Button clicked, state is now ${state}...`);
		});

		quotes.on('marketOpened', () => {
			if (state != 'spy')
				return;

			fado.pulse({color:'blue', antiColor:'black', interval:1000, iterations:5, priority: '!'});	
			fado.color({color:offlineColor, fade:500, renderFrequency:10000, duration:-1});
		});

		quotes.on('marketClosed', () => {
			if (state != 'spy')
				return;

				fado.pulse({color:'red', antiColor:'black', interval:1000, iterations:5, priority: '!'});
			fado.color({color:offlineColor, fade:500, renderFrequency:10000, duration:-1});
		});

		quotes.on('quote', (quote) => {
			if (state != 'spy')
				return;

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
			fado.color({color:color, fade:500, renderFrequency:10000, duration:-1, priority:'!'});
		});

		fado.color({color:offlineColor, fade:500, renderFrequency:10000, duration:-1});

		quotes.startMonitoring();
		quotes.requestQuote();


	}

}

new SpyCommand();

