var sprintf          = require('yow/sprintf');
var Color            = require('color');
var Animation        = require('../scripts/animation.js');

var cache            = {};

module.exports = class SpyAnimation extends Animation {

	constructor(options) {
		var {symbol = 'SPY', ...options} = options;

		super({name:'Spy Animation', renderFrequency: 10000, ...options});

		this.log = console.log;
        this.debug = console.log;
        this.isFetching = false;
        this.fetchFrequency = 1 * 60000;
        this.symbol = symbol;

	}

    computeColorFromQuote(quote) {

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


    fetchQuote(symbol) {

		return new Promise((resolve, reject) => {
            this.debug('Loading yahoo-finance...');
            var Yahoo = require('yahoo-finance');
            this.debug('Done loading yahoo-finance...');
    
            var options = {};
            var start = new Date();

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
                quote.time = data.price.regularMarketTime;
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


    render() {
        var now = new Date();

        var render = (quote) => {
            var color = this.computeColorFromQuote(quote);

            this.pixels.fill(color);
            this.pixels.render({transition:'fade', duration:500});

        };

        // Check if last quote is valid
        if (cache && cache.quote && cache.timestamp && (now - cache.timestamp) < this.fetchFrequency) {
            this.debug(`Cache contains valid quote. Returning cached quote. Fetching in about ${Math.floor((this.fetchFrequency - (now - cache.timestamp)) / 1000)} seconds.`);
            render(cache.quote);
        }
        else {
            render(null);

            // Fetch if not alredy fetching...
            if (!this.isFetching) {
                this.isFetching = true;

                this.fetchQuote(this.symbol).then((quote) => {
                    cache = {quote:quote, timestamp: new Date()};
                    this.render();
                })
                .catch((error) => {
                    this.log(error);
                })
                .then(() => {
                    this.isFetching = false;
                });    
            }
        }

    }


}
