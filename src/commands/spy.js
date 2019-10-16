var Command          = require('../scripts/command.js');
var Button           = require('pigpio-button');
var Neopixels        = require('../scripts/neopixels.js');
var AnimationQueue   = require('../scripts/animation-queue.js');
var Animation        = require('../scripts/pixel-animation.js');
var ColorAnimation   = require('../scripts/color-animation.js');
var Yahoo            = require('yahoo-finance');
var sprintf          = require('yow/sprintf');
var Color            = require('color');

var currentColor     = 'black';

class SpyAnimation extends Animation {

	constructor(options) {
		var {updateInterval = 10000, symbol = 'SPY'} = options;

		super({renderFrequency: 60000, ...options});

		this.lastQuote = undefined;		
		this.log = console.log;
		this.debug = console.log;
		this.symbol = symbol;
		this.updateInterval = updateInterval;
		this.symbol = symbol;

		this.updateLoop();

	}

	getColor() {
		return currentColor;
	}

	setColor(color) {
		currentColor = color;
	}

    computeColor(quote) {
        var change     = Math.max(-1, Math.min(1, quote.change));
        var hue        = change >= 0 ? 240 : 0;
        var saturation = 100;
        var luminance  = 0 + (Math.abs(change) * 50);

        luminance = 100;
        saturation = 50 + (Math.abs(change) * 50);

        return Color.hsl(hue, saturation, luminance).rgbNumber();
    }


    fetch(symbol) {

        var then = new Date();

		return new Promise((resolve, reject) => {
            try {
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
                    this.log(sprintf('Could not get general information about symbol %s. %s', symbol, error.message));
                    reject(error);
                });
    
            }
            catch (error) {
                reject(error);
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
                                color = {red:0, green:0, blue:5};
                            }
                        }
    
                    }
                    
                    this.lastQuote = quote;

                    return color;
                })
                .then((color) => {
					this.log('Color:', color);
					this.setColor(color);
					this.render();

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
        // Get update interval from config, default 5 minutes
        var updateInterval = (parseFloat(this.updateInterval) || 5) * 60000;

        this.update().then(() => {
            setTimeout(this.updateLoop.bind(this), updateInterval);
        })
        .catch((error) => {
            this.log(error.stack);
            setTimeout(this.updateLoop.bind(this), updateInterval);
        });

    }


	render() {
		this.log('Rendering SPY.', this.getColor());
        this.pixels.fill(this.this.getColor());
        this.pixels.render();

	}

}

class SpyCommand extends Command {

	constructor() {
		super({module:module, name:'spy', description:'Displays stock market symbol as a color'});
	}

	defineArgs(yargs) {
	}

	run(argv) {
	
		var button           = new Button({debug:argv.debug, autoEnable:true, pin:6});
		var pixels           = new Neopixels({debug:argv.debug});
		var queue            = new AnimationQueue({debug:argv.debug});
		var state            = 'on'
		var defaultOptions   = {...argv, pixels:pixels, duration: -1, renderFrequency:60000, priority:'!'};

		var runAnimation = (animation) => {
			queue.enqueue(animation);
		}

		button.on('click', (clicks) => {
			if (state == 'on') {
				runAnimation(new ColorAnimation({...defaultOptions, color:'black'}));
			}
			else {
				runAnimation(new SpyAnimation({...defaultOptions}));
			}


			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

		runAnimation(new SpyAnimation(defaultOptions));
	
	}

}

new SpyCommand();