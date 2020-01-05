var sprintf = require('yow/sprintf');
var Events = require('events');
var Yahoo = undefined;

module.exports = class extends Events {

	constructor(options) {
		var {log = true, schedule = '*/5 * * * *', debug, symbol = 'SPY', ...options} = options;

		super();

        this.debug      = typeof debug == 'function' ? debug : (debug ? console.log : () => {});
        this.log        = typeof log == 'function' ? log : (log ? console.log : () => {});
        this.symbol     = symbol;
        this.isFetching = false;
        this.cache      = null;
        this.job        = null;
        this.schedule   = schedule;
	}

    fetchQuote() {
        if (Yahoo == undefined) {
            this.emit('initializing'); 
            this.debug('Loading Yahoo Finance...');
            Yahoo = require('yahoo-finance');
            this.debug('Finished loaded Yahoo Finance.');
        }

		return new Promise((resolve, reject) => {    
            var options = {};
            var start = new Date();
            var symbol = this.symbol;

            options.symbol = symbol;
            options.modules = ['price', 'summaryProfile', 'summaryDetail'];

            this.debug(`Fetching quotes for ${symbol}...`);

            Yahoo.quote(options).then((data) => {

                if (!data) {
                    reject(new Error(`Data empty for symbol ${symbol}...`));
                }
                else {

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
                    quote.marketState = data.price.marketState;
    
                    // Fix some stuff
                    quote.name = quote.name.replace(/&amp;/g, '&');
    
                    this.log(sprintf('Fetched quote from Yahoo for symbol %s (%s%.2f%%). Took %d ms.', quote.symbol, quote.change >= 0 ? '+' : '-', parseFloat(Math.abs(quote.change)), now - start));
    
                    resolve(quote);
    
                }

            })
            .catch((error) => {
                reject(new Error(`No data for symbol ${symbol}...`));
            })
		})
    }

    requestQuote() {
        if (!this.isFetching) {
            this.isFetching = true;

            this.fetchQuote().then((quote) => {
                this.cache = {quote:quote, timestamp: new Date()};

                this.debug('Emitting quote', JSON.stringify(quote));
                this.emit('quote', quote);    
            })
            .catch((error) => {
                this.log(error);
            })
            .then(() => {
                this.isFetching = false;
            });    
        }
    }

    setSymbol(symbol) {
        this.symbol = symbol;
        this.requestQuote();
    }


    startMonitoring() {

        this.stopMonitoring();

        var Schedule = require('node-schedule');
        this.job = Schedule.scheduleJob(this.schedule, this.requestQuote.bind(this));
    }

    stopMonitoring() {
        if (this.job)
            this.job.cancel();

        this.job = null;
    }


}
