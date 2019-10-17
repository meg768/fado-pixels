console.log(`Loading ${__filename}...`);

var sprintf          = require('yow/sprintf');
var Color            = require('color');

var Command          = require('../scripts/command.js');
var Animation        = require('../scripts/pixel-animation.js');

var currentColor     = Color('blue').rgbNumber();
var cache            = {};

class SpyAnimation extends Animation {

	constructor(options) {
		var {symbol = 'SPY', ...options} = options;

		super({renderFrequency: 30000, ...options});

		this.log = console.log;
		this.debug = console.log;
        this.symbol = symbol;
        this.cache = cache;


	}

	getColor() {
		return Color(currentColor).rgbNumber();
	}

	setColor(color) {
		currentColor = Color(color).rgbNumber();
	}

    computeColor(quote) {
        var change     = Math.max(-1, Math.min(1, quote.change));
        var hue        = change >= 0 ? 240 : 0;
        var saturation = 100;
        var luminance  = 25 + (Math.abs(change) * 25);

        //saturation = 50 + (Math.abs(change) * 50);

		this.log('Computed Color', hue, saturation, luminance);
        return Color.hsl(hue, saturation, luminance).rgbNumber();
    }


    fetch(symbol) {
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


    update() {
        var now = new Date();

        if (this.cache && this.cache.quote && this.cache.timestamp && (now - this.cache.timestamp) < 60000) {
            console.log('Using cache...');
            return;
        }

        this.fetch(this.symbol).then((quote) => {
            this.cache = {quote:quote, timestamp: new Date()};
            return this.computeColor(quote);
        })
        .then((color) => {
            this.setColor(color);
        })
        .catch((error) => {
            this.log(error);
        })
    }

	render() {
		var color = this.getColor();
		this.log('Rendering SPY with color', color);
        this.pixels.fill(color);
        this.pixels.render({transition:'fade', duration:500});

        this.update();
    }

}

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
				runAnimation(new ColorAnimation({...defaultOptions, renderFrequency:60000, renderOptions:{transition:'fade', duration:500} , duration:-1, color:'black', priority:'!'}));
			}
			else {
				runAnimation(new SpyAnimation({...defaultOptions, renderFrequency:60000, symbol:argv.symbol, priority:'!'}));
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

        runAnimation(new SpyAnimation({...defaultOptions, renderFrequency:60000, symbol:argv.symbol, priority:'!'}));
	
	}

}

new SpyCommand();

console.log(`Finished loading ${__filename}...`);
