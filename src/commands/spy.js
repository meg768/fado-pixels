var Color = require('color');
var Command = require('../scripts/command.js');

class Spy {

	constructor(options) {

		var {debug = true, schedule = '*/2 * * * *', symbol = 'SPY', port = 3000, ...options} = options;

		this.symbol   = symbol;
		this.port     = port;
		this.debug    = typeof debug === 'function' ? debug : (debug ? console.log : () => {});
		this.log      = console.log;
		this.state    = 'spy';
		this.schedule = schedule;
		this.marketState = 'UNKNOWN';

		this.colors = {
			OFFLINE       : Color('purple').rgbNumber(),
			BLACK         : Color('black').rgbNumber(),
			MARKED_CLOSED : Color('brown').rgbNumber(),
			WHITE         : Color('white').rgbNumber(),
			RED           : Color('red').rgbNumber(),
			WARM_WHITE    : Color('rgb(255,255,240)').rgbNumber()
		};

		this.setupFado();
		this.setupButton();
		this.setupQuotes();
		this.setupExpress();

	}

	setupExpress() {
		var Express = require('express');
		var BodyParser = require('body-parser');

		this.express = Express();
		this.express.use(BodyParser.json());


		this.express.post('/blink', (request, response) => {
			this.fado.blink(request.body);
			response.send('OK');
		});

		this.express.post('/color', (request, response) => {
			this.fado.color(request.body);
			response.send('OK');
		});

		this.express.post('/pulse', (request, response) => {
			this.fado.pulse(request.body);
			response.send('OK');
		});

		this.express.post('/clock', (request, response) => {
			this.fado.clock(request.body);
			response.send('OK');
		});

		this.express.post('/random', (request, response) => {
			this.fado.random(request.body);
			response.send('OK');
		});

		this.express.post('/spy', (request, response) => {
			var {symbol} = request.body;

			if (symbol) {
				this.symbol = symbol;

				this.debug(`Setting new symbol ${this.symbol}...`);
				this.quotes.setSymbol(this.symbol);
			}

			response.send('OK');
		});

		this.debug('Express is listening to port', this.port);
		this.express.listen(this.port);

	}

	setupFado() {
		var Fado = require('../scripts/fado.js');
		this.fado = new Fado({log:this.log, debug:this.debug});

		this.fado.queue.on('idle', () => {
			this.fado.color({color:Color('orange').rgbNumber(), fade:1000, renderFrequency:60000, duration:-1, priority:'!'});
		});

		this.fado.color({color:Color('orange').rgbNumber(), fade:1000, renderFrequency:60000, duration:-1, priority:'!'});

	}

	setupQuotes()  {
		var Quotes = require('../scripts/quotes.js');
		this.quotes = new Quotes({log:this.log, debug:this.debug, symbol:this.symbol});

		this.quotes.on('quote', (quote) => {
			if (this.state != 'spy')
				return;

			var color = quote.marketState == 'REGULAR' ? this.computeColorFromQuote(quote) : this.colors.OFFLINE;

			if (quote.marketState == 'REGULAR' && this.marketState != 'REGULAR') {
				this.fado.random({color:color, duration:5000, priority:'!'});
				this.fado.color({color:color, fade:1000, renderFrequency:60000, duration:-1, priority:'normal'});
			}
			else {
				this.fado.color({color:color, fade:1000, renderFrequency:60000, duration:-1, priority:'!'});
			}

			this.marketState = quote.marketState;
		});

		this.quotes.startMonitoring(this.schedule);
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
				default: {
					this.fado.color({color:this.colors.BLACK, fade:1000, renderFrequency:60000, duration:-1, priority: '!'});
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
			symbol: 'SPY',
			schedule: '*/5 * * * *'
		};
		super({ module: module, name: 'spy', description: 'Displays stock market symbol as a color', defaults:defaults});
	}

	defineArgs(yargs) {
		yargs.option('symbol', {describe: 'Stock symbol to display', default: this.defaults.symbol});
		yargs.option('schedule', {describe: 'Polling schedule using cron syntax', default: this.defaults.schedule});
	}

	run(argv) {
		new Spy(argv);
	}

}

new SpyCommand();

