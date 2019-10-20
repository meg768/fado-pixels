var sprintf = require('yow/sprintf');
var Events = require('events');

module.exports = class extends Events {

	constructor(options) {
		var {log, debug, symbol = 'SPY', ...options} = options;

		super();

        this.debug = typeof debug == 'function' ? debug : (debug ? console.log : () => {});
        this.log = typeof log == 'function' ? log : (log ? console.log : () => {});
        this.symbol = symbol;

        this.isFetching = false;
        this.cache = null;
        this.job = null;
        this.marketState = null;

	}


    fetchQuote() {
        var Yahoo = require('yahoo-finance');

		return new Promise((resolve, reject) => {    
            var options = {};
            var start = new Date();
            var symbol = this.symbol;

            options.symbol = symbol;
            options.modules = ['price', 'summaryProfile', 'summaryDetail'];

            this.debug(`Fetching quotes for ${symbol}...`);

            Yahoo.quote(options).then((data) => {

                var now = new Date();
                var quote = {};

                quote.symbol = symbol;
                quote.name = data.price.longName ? data.price.longName : data.price.shortName;
                quote.sector = data.summaryProfile ? data.summaryProfile.sector : 'n/a';
                quote.industry = data.summaryProfile ? data.summaryProfile.industry : 'n/a';
                quote.exchange = data.price.exchangeName;
                quote.type = data.price.quoteType.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                quote.change = data.price.regularMarketChangePercent * 100;
                quote.time = new Date(data.price.regularMarketTime);
                quote.price = data.price.regularMarketPrice;

                // Fix some stuff
                quote.name = quote.name.replace(/&amp;/g, '&');

                this.log(sprintf('Fetched quote from Yahoo for symbol %s (%s%.2f%%). Took %d ms.', quote.symbol, quote.change >= 0 ? '+' : '-', parseFloat(Math.abs(quote.change)), now - start));
                this.debug(quote);

                resolve(quote);

            })
            .catch((error) => {
                reject(error);
            })
		})
	}


    setMarketState(marketState) {
        if (marketState == this.marketState)
            return;

        this.emit(marketState, this.symbol);
        this.marketState = marketState;
    }

    setQuote(quote) {
        this.emit('quote', quote);
    }


    startMonitoring() {
        var Schedule = require('node-schedule');

        this.stopMonitoring();

        var rule = new Schedule.RecurrenceRule();
        rule.second = [0, 30];

        this.job = Schedule.scheduleJob(rule, () => {
            if (!this.isFetching) {
                this.isFetching = true;

                this.fetchQuote().then((quote) => {
                    if (this.cache && this.cache.quote && this.cache.quote.time == quote.time) {
                        this.cache = {quote:quote, timestamp: new Date()};

                        this.setMarketState('marketClose');
                    }
                    else {
                        this.cache = {quote:quote, timestamp: new Date()};

                        this.setMarketState('marketOpen');
                        this.setQuote(quote);
                    }
                })
                .catch((error) => {
                    this.log(error);
                })
                .then(() => {
                    this.isFetching = false;
                });    
            }
        }); 
    }

    stopMonitoring() {
        if (this.job)
            this.job.cancel();

        this.job = null;

    }


}
