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
		var Quotes = require('../scripts/quotes.js');
		var quotes = new Quotes({argv, ...{log:this.log, debug:this.debug}});

		quotes.startMonitoring();

		quotes.on('quote', (quote) => {
			this.log(`Got quote for symbol ${quotes.symbol}...`);
		});

		quotes.on('marketClose', (symbol) => {
			this.log(`Market closed for symbol ${symbol}...`);
		});

		quotes.on('marketOpen', (symbol) => {
			this.log(`Market open for symbol ${symbol}...`);
		});
	}
}

new QuoteCommand();


