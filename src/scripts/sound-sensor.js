var Timer      = require('yow/timer');
var isFunction = require('yow/is').isFunction;
var Events     = require('events');
var Gpio       = require('pigpio').Gpio;

module.exports = class SoundSensor extends Events {

	constructor(options) {

		super();

		options = Object.assign({}, options);

		if (options.pin == undefined)
			throw new Error('Must supply a pin number.');

		var debug = isFunction(options.debug) ? options.debug : function(){};

		//var gpio = new Gpio(options.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
		var gpio = new Gpio(options.pin, {mode: Gpio.INPUT, alert: true});

		var timeout = null;
		var timestamp = null;

		gpio.on('alert', (level, tick) => {
			if (level > 0) {

				debug('Alert', level, tick);

				if (timeout != null) {
					clearTimeout(timeout);
					timeout = null;
				}

				if (timestamp == null) {
					debug('First tick:', tick);
					timestamp = tick;
				}

				timeout = setTimeout(() => {
					var duration = (tick >> 0) - (timestamp >> 0);

					debug('Sound suration', duration);
					this.emit('sound', duration);

					clearTimeout(timeout);
					timeout = null;
					timestamp = null;

				}, 100);
				
			}

		});
	}



};
