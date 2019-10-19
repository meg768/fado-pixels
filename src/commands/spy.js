var sprintf          = require('yow/sprintf');
var Color            = require('color');

var Command          = require('../scripts/command.js');
var Animation        = require('../scripts/animation.js');
var SpyAnimation     = require('../scripts/spy-animation.js');

var cache = {};

/*
class SpyAnimation extends Animation {

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
        var Yahoo = require('yahoo-finance');

		return new Promise((resolve, reject) => {

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

                resolve(quote);

            })
            .catch((error) => {
                reject(error);
            })
		})
	}

    getLastQuote() {
        var now = new Date();

        // Check if last quote is valid
        if (cache && cache.quote && cache.timestamp && (now - cache.timestamp) < this.fetchFrequency) {
            this.debug(`Cache contains valid quote. Returning cached quote. Fetching in about ${Math.floor((this.fetchFrequency - (now - cache.timestamp)) / 1000)} seconds.`);
            return cache.quote;
        }

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

        // Return what we got
        return cache && cache.quote ? cache.quote : null;
    }

	render() {
        var quote = this.getLastQuote();
        var color = this.computeColorFromQuote(quote);

        this.debug(`Displaying HSL color ${Color(color).hsl().array()}...`);

        this.pixels.fill(color);
        this.pixels.render({transition:'fade', duration:500});
    }

}
*/

class SpyCommand extends Command {

	constructor() {
        var defaults = {
            symbol:'SPY'
        };
		super({module:module, name:'spy', description:'Displays stock market symbol as a color', defaults:defaults});
	}

	defineArgs(yargs) {
		yargs.option('symbol', {describe:'Stock symbol to display', default:this.defaults.symbol});
	}

	run(argv) {
        var Button = require('pigpio-button');
        var Neopixels = require('../scripts/neopixels.js');
        var AnimationQueue = require('../scripts/animation-queue.js');
        var ColorAnimation = require('../scripts/color-animation.js');

		var button           = new Button({debug:argv.debug, autoEnable:true, pin:6});
		var pixels           = new Neopixels({debug:argv.debug});
		var queue            = new AnimationQueue({debug:argv.debug});
		var state            = 'on';
		var defaultOptions   = {...argv, pixels:pixels};

		var runAnimation = (animation) => {
			queue.enqueue(animation);
		}

		button.on('click', (clicks) => {
			if (state == 'on') {
				runAnimation(new ColorAnimation({...defaultOptions, renderFrequency:10000, renderOptions:{transition:'fade', duration:500} , duration:-1, color:'black', priority:'!'}));
			}
			else {
				runAnimation(new SpyAnimation({...defaultOptions, symbol:argv.symbol, priority:'!'}));
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

        runAnimation(new SpyAnimation({...defaultOptions, symbol:argv.symbol, priority:'!'}));
	
	}

}

new SpyCommand();

