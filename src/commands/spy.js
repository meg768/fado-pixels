console.log(`Loading ${__filename}...`);

var sprintf          = require('yow/sprintf');
var Color            = require('color');

var Command          = require('../scripts/command.js');
var Animation        = require('../scripts/pixel-animation.js');

var currentColor     = Color('blue').rgbNumber();

class SpyAnimation extends Animation {

	constructor(options) {
		var {updateInterval = 60000, symbol = 'SPY', ...options} = options;

		super({renderFrequency: 60000, ...options});

		this.lastQuote = undefined;		
		this.log = console.log;
		this.debug = console.log;
		this.symbol = symbol;
		this.updateInterval = updateInterval;

        this.updateLoop();

	}

	getColor() {
		return Color(currentColor);
	}

	setColor(color) {
		currentColor = Color(color);
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

        var then = new Date();

		return new Promise((resolve, reject) => {
            try {
                var Yahoo = require('yahoo-finance');

                var options = {};

                options.symbol = symbol;
                options.modules = ['price', 'summaryProfile', 'summaryDetail'];
  
				this.debug(`Fetching quotes for ${symbol}...`);

                Yahoo.quote(options).then((data) => {
                    var now = new Date();
                    var time = Math.floor(now.valueOf() - then.valueOf());

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

                    this.log(sprintf('Fetched quote from Yahoo for symbol %s (%s%.2f%%). Took %d ms.', quote.symbol, quote.change >= 0 ? '+' : '-', parseFloat(Math.abs(quote.change)), time));
    
                    resolve(quote);
    
                })
                .catch((error) => {
                    this.log(sprintf('Could not get quote for symbol %s. %s', symbol, error.message));
                    reject(error);
                });
    
            }
            catch (error) {
                this.log(error);
                reolve();
            }
		})
	}


    update() {
        return new Promise((resolve, reject) => {

            try {

                this.fetch(this.symbol).then((quote) => {

                    var color = this.computeColor(quote);

                    // Set to blue when market closed...
                    if (false) {
                        if (this.lastQuote && quote.time) {
                            if (this.lastQuote.time.valueOf() == quote.time.valueOf()) {
                                color = Color.rgb(0, 0, 5).rgbNumber();
                            }
                        }
    
                    }
                    
                    this.lastQuote = quote;

                    return color;
                })
                .then((color) => {
					this.setColor(color);

                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    resolve();
                })
    
            }
            catch (error) {
                reject(error);
            }
        });
    }

	updateLoop() {
        this.update().then(() => {
            setTimeout(this.updateLoop.bind(this), this.updateInterval);
        })
        .catch((error) => {
            this.log(error.stack);
            setTimeout(this.updateLoop.bind(this), this.updateInterval);
        });

    }

	render() {
		var color = this.getColor();
		this.log('Rendering SPY with color', color);
        this.pixels.fill(color);
        this.pixels.render({transition:'fade', duration:500});
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
				runAnimation(new ColorAnimation({...defaultOptions, renderOptions:{transition:'fade', duration:500} , duration:-1, color:'black', priority:'!'}));
			}
			else {
				runAnimation(new SpyAnimation({...defaultOptions, symbol:argv.symbol, priority:'!'}));
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

		runAnimation(new SpyAnimation(defaultOptions));
	
	}

}

new SpyCommand();

console.log(`Finished loading ${__filename}...`);
