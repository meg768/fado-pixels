var Command = require('../scripts/command.js');

class QuoteCommand extends Command {

	constructor() {
		var defaults = {
			symbol: '^OMX'
		};

		super({module:module, name: 'quotes', description:'Test quotes', defaults:defaults});
	}

	defineArgs(args) {
		args.option('symbol', {describe:'Symbol to fetch', default:this.defaults.symbol});
	}


	run(argv) {
		var {symbol} = argv;

		var Quotes = require('../scripts/quotes.js');
		var quotes = new Quotes({symbol:symbol, log:this.log, debug:this.debug});

		quotes.startMonitoring();

		quotes.on('quote', (quote) => {
			this.log(`Got quote for symbol ${quote.symbol}...`);
		});

		quotes.on('marketClosed', (symbol) => {
			this.log(`Market closed for symbol ${symbol}...`);
		});

		quotes.on('marketOpened', (symbol) => {
			this.log(`Market open for symbol ${symbol}...`);
		});
	}
}

new QuoteCommand();


