var Command = require('../scripts/command.js');

class QuoteCommand extends Command {

	constructor() {
		var defaults = {
		};

		super({module:module, name: 'quotes', description:'Test quotes', defaults:defaults});


	}

	defineArgs(args) {
	}


	run(argv) {
		var Quotes = require('../scripts/quotes.js');
		var quotes = new Quotes(argv);

		quotes.startMonitoring();

	}
}

new QuoteCommand();


