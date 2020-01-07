var Color = require('color');
var Command = require('../scripts/command.js');



class Spy {

	constructor(options) {

		var {debug = true, schedule, symbol, port = 3000, ...options} = options;

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
		var Cors = require('cors')
		var Express = require('express');
		var BodyParser = require('body-parser');

		this.express = Express();
		this.express.use(BodyParser.json());
		this.express.use(Cors());


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

			this.debug(`Got /spy post`, request.body);

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
				// Market opened
				this.fado.random({duration:5000, priority:'!'});
				this.fado.color({color:color, fade:1000, renderFrequency:60000, duration:-1, priority:'normal'});
			}
			else if (quote.marketState != 'REGULAR' && this.marketState == 'REGULAR') {
				// Market closed
				this.fado.random({duration:5000, priority:'!'});
				this.fado.color({color:color, fade:1000, renderFrequency:60000, duration:-1, priority:'normal'});
			}
			else {
				this.fado.color({color:color, fade:1000, renderFrequency:60000, duration:-1, priority:'!'});
			}

			this.marketState = quote.marketState;
		});

		this.debug(`Monitoring ${this.symbol} using schedule ${this.schedule}...`);
		this.quotes.startMonitoring(this.schedule);
		this.quotes.requestQuote();

	}

	computeColorFromQuoteOLD(quote) {

		var color = this.colors.OFFLINE;

		if (quote && quote.change) {
			var change     = Math.max(-1, Math.min(1, quote.change));
			var hue        = change >= 0 ? 240 : 0;
			var saturation = 100;
			var luminance  = 15 + (Math.abs(change) * 35);
	
			color = Color.hsl(hue, saturation, luminance).rgbNumber();
	
		}

		return color;
	}

	computeColorFromQuote(quote) {

		var COLORS = [
			"rgb(0, 0, 50)", // sleeping
			
			// reds
			"rgb(255, 170, 170)", // 1
			"rgb(255, 160, 160)",
			"rgb(240, 140, 140)",
			"rgb(255, 130, 130)", 
			"rgb(255, 110, 110)",
			"rgb(255, 90, 90)", 
			"rgb(255, 70, 70)", 
			"rgb(255, 51, 51)", 
			"rgb(255, 40, 40)",
			"rgb(255, 0, 0)", // 10
				
			"rgb(209,202,245)", // neutral
			
			// greens
			"rgb(0, 255, 0)", // 12
			"rgb(0, 240, 0)",
			"rgb(0, 230, 0)",
			"rgb(40, 220, 40)",
			"rgb(80, 220, 80)",
			"rgb(70, 240, 70)",
			"rgb(90, 240, 90)",
			"rgb(90, 250, 90)",
			"rgb(110, 250, 110)",
			"rgb(120, 252, 120)" // 21
		];		

		var rgbIndex = 0;

		if (quote && quote.change) {
			var percentage = quote.change;

			switch (true) {
				// Negative
				case (percentage < -0.9):
					rgbIndex = 10; 
					break;
	
				case (percentage < -0.8):
					rgbIndex = 9; 
					break;
	
				case (percentage < -0.7):
					rgbIndex = 8; 
					break;
	
				case (percentage < -0.6):
					rgbIndex = 7; 
					break;
	
				case (percentage < -0.5):
					rgbIndex = 6; 
					break;
	
				case (percentage < -0.4):
					rgbIndex = 5; 
					break;
				
				case (percentage < -0.3):
					rgbIndex = 4; 
					break;
				
				case (percentage < -0.2):
					rgbIndex = 3; 
					break;
				
				case (percentage < -0.1):
					rgbIndex = 2; 
					break;
				
				case (percentage < 0):
					rgbIndex = 1; 
					break;
	
				
				// Neutral
				case (percentage == 0):
					rgbIndex = 11; 
					break;					
							
				// Positive
				case (percentage > 0.9):
					rgbIndex = 12; 
					break;
	
				case (percentage > 0.8):
					rgbIndex = 13; 
					break;
	
				case (percentage > 0.7):
					rgbIndex = 14; 
					break;
	
				case (percentage > 0.6):
					rgbIndex = 15; 
					break;
	
				case (percentage > 0.5):
					rgbIndex = 16; 
					break;
	
				case (percentage > 0.4):
					rgbIndex = 17; 
					break;
	
				case (percentage > 0.3):
					rgbIndex = 18; 
					break;
	
				case (percentage > 0.2):
					rgbIndex = 19; 
					break;
	
				case (percentage > 0.1):
					rgbIndex = 20; 
					break;
				
				case (percentage > 0):
					rgbIndex = 21; 
					break;
									
			}
		}

		return Color(COLORS[rgbIndex]).rgbNumber();
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

