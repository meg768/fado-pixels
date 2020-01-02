var Color = require('color');
var Command = require('../scripts/command.js');

class Spy {

	constructor(options) {

		var {debug, symbol, ...options} = options;

		this.symbol = symbol;
		this.debug  = typeof debug === 'function' ? debug : (debug ? console.log : () => {});
		this.log    = console.log;
		this.state  = 'spy';

		this.colors = {
			OFFLINE    : Color('purple').rgbNumber(),
			BLACK      : Color('black').rgbNumber(),
			WHITE      : Color('white').rgbNumber(),
			RED        : Color('red').rgbNumber(),
			WARM_WHITE : Color('rgb(255,255,240)').rgbNumber()
		};

		this.setupFado();
		this.setupButton();
		this.setupQuotes();

	}

	setupFado() {
		var Fado = require('../scripts/fado.js');
		this.fado = new Fado({log:this.log, debug:this.debug});

		this.fado.queue.on('idle', () => {
			this.fado.color({color:this.colors.RED, fade:1000, renderFrequency:60000, duration:-1});
		});

		this.fado.color({color:this.colors.OFFLINE, fade:1000, renderFrequency:60000, duration:-1, priority:'!'});
	}

	setupQuotes()  {
		var Quotes = require('../scripts/quotes.js');
		this.quotes = new Quotes({log:this.log, debug:this.debug, symbol:this.symbol});

		this.quotes.on('initializing', () => {
			this.log('Initializing...');
			this.fado.color({color:Color('orange').rgbNumber(), fade:1000, renderFrequency:10000, duration:-1});
		});

		this.quotes.on('marketOpened', () => {
			this.debug('Market open.');

			if (this.state != 'spy')
				return;

			this.fado.pulse({color:'blue', antiColor:'black', interval:1000, iterations:5, priority: '!'});	
			this.fado.color({color:this.colors.OFFLINE, fade:1000, renderFrequency:10000, duration:-1});
		});

		this.quotes.on('marketClosed', () => {
			this.debug('Market closed.');

			if (this.state != 'spy')
				return;

			this.fado.pulse({color:'red', antiColor:'black', interval:1000, iterations:5, priority: '!'});
			this.fado.color({color:this.colors.OFFLINE, fade:1000, renderFrequency:10000, duration:-1});
		});

		this.quotes.on('quote', (quote) => {
			this.debug('Got quote.', quote);

			if (this.state != 'spy')
				return;

			this.fado.color({color:this.computeColorFromQuote(quote), fade:1000, renderFrequency:60000, duration:-1, priority:'!'});
		});

		this.quotes.startMonitoring();
		this.quotes.requestQuote();

	}

	computeColorFromQuote(quote) {

		var color = this.colors.OFFLINE;

		if (quote && quote.change) {
			var change     = Math.max(-1, Math.min(1, quote.change));
			var hue        = change >= 0 ? 240 : 0;
			var saturation = 100;
			var luminance  = 25 + (Math.abs(change) * 25);
	
			color = Color.hsl(hue, saturation, luminance).rgbNumber();
	
		}

		return color;
	}

	setupButton() {
		var Button = require('pigpio-button');
		this.button = new Button({log:this.log, debug:this.debug, autoEnable: true, pin: 6});

		this.button.on('click', (clicks) => {

			switch (this.state) {
				case 'spy': {
					this.state = 'off';
					break;
				}
				case 'off': {
					this.state = 'on';
					break;
				}
				default: {
					this.state = 'spy';
					break;
				}
			}


			switch (this.state) {
				case 'spy': {
					this.fado.color({color:this.colors.OFFLINE, fade:1000, renderFrequency:60000, duration:-1, priority: '!'});
					this.quotes.requestQuote();
					break;
				}
				case 'off': {
					this.fado.color({color:this.colors.BLACK, fade:1000, renderFrequency:60000, duration:-1, priority: '!'});
					break;
				}
				case 'on': {
					this.fado.color({color:this.colors.WARM_WHITE, fade:1000, renderFrequency:60000, duration:-1, priority: '!'});
					break;
				}
			}

			this.debug(`Button clicked, state is now ${this.state}...`);
		});

	}


}

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
		new Spy(argv);
		return;

		var Color = require('color');
		var Button = require('pigpio-button');
		var Fado = require('../scripts/fado.js');
		var Quotes = require('../scripts/quotes.js');

		var {symbol} = argv;

		var colors = {
			offline: Color('purple').rgbNumber(),
			on: Color('white').rgbNumber(),
			off: Color('black').rgbNumber(),
			white: Color('white').rgbNumber(),
			warmWhite: Color('rgb(255,255,240)').rgbNumber()
		};

		var quotes = new Quotes({log:this.log, debug:this.debug, symbol:symbol});
		var button = new Button({log:this.log, debug:this.debug, autoEnable: true, pin: 6});
		var fado = new Fado({log:this.log, debug: this.debug});
		var state = 'spy';

		fado.queue.on('idle', () => {
			fado.color({color:'red', fade:1000, renderFrequency:60000, duration:-1});
		});


		button.on('click', (clicks) => {

			switch (state) {
				case 'spy': {
					state = 'off';
					break;
				}
				case 'off': {
					state = 'on';
					break;
				}
				default: {
					state = 'spy';
					break;
				}
			}


			switch (state) {
				case 'spy': {
					fado.color({color:colors.offline, fade:1000, renderFrequency:60000, duration:-1, priority: '!'});
					quotes.requestQuote();
					break;
				}
				case 'off': {
					fado.color({color:colors.off, fade:500, renderFrequency:60000, duration:-1, priority: '!'});
					break;
				}
				case 'on': {
					fado.color({color:colors.warmWhite, fade:500, renderFrequency:60000, duration:-1, priority: '!'});
					break;
				}
			}

			this.debug(`Button clicked, state is now ${state}...`);
		});

		quotes.on('marketOpened', () => {
			this.debug('Market open.');

			if (state != 'spy')
				return;

			fado.pulse({color:'blue', antiColor:'black', interval:1000, iterations:5, priority: '!'});	
			fado.color({color:colors.offline, fade:1000, renderFrequency:10000, duration:-1});
		});

		quotes.on('marketClosed', () => {
			this.debug('Market closed.');

			if (state != 'spy')
				return;

			fado.pulse({color:'red', antiColor:'black', interval:1000, iterations:5, priority: '!'});
			fado.color({color:colors.offline, fade:1000, renderFrequency:10000, duration:-1});
		});

		quotes.on('quote', (quote) => {
			this.debug('Got quote.', quote);

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
			fado.color({color:color, fade:1000, renderFrequency:60000, duration:-1, priority:'!'});
		});

		fado.color({color:colors.offline, fade:1000, renderFrequency:60000, duration:-1, priority:'!'});

		quotes.startMonitoring();
		quotes.requestQuote();


	}

}

new SpyCommand();

