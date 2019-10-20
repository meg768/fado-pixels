var Command = require('../scripts/command.js');

class QuoteCommand extends Command {

	constructor() {
		var defaults = {
		};

		super({module:module, name: 'quotes', description:'Test quotes', defaults:defaults});


	}

	defineArgs(args) {
		args.option('symbol', {describe:'Symbol to fetch', default:'SPY'});
	}


	run(argv) {
		var Quotes = require('../scripts/quotes.js');
		var quotes = new Quotes(argv);

		quotes.startMonitoring();

		quotes.on('quote', (quote) => {
			this.log(`Got quote for symbol ${quotes.symbol}...`);
			this.log(JSON.stringify(quote, null, '    '));
		});

		quotes.on('marketClose', () => {
			this.log(`Market closed for symbol ${quotes.symbol}...`);
			this.log(JSON.stringify(quote, null, '    '));
		});

		quotes.on('marketOpen', () => {
			this.log(`Market open for symbol ${quotes.symbol}...`);
			this.log(JSON.stringify(quote, null, '    '));
		});
	}
}

new QuoteCommand();


