var Timer      = require('yow/timer');
var Events     = require('events');
var Gpio       = require('pigpio').Gpio;

module.exports = class SoundSensor extends Events {

	constructor(options) {

		super();

		options = Object.assign({}, options);

		if (options.pin == undefined)
			throw new Error('Must supply a pin number.');

		//var gpio = new Gpio(options.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
		var gpio = new Gpio(options.pin, {mode: Gpio.INPUT, alert: true});

		var timeout = null;
		var timestamp = null;

		gpio.on('alert', (level, tick) => {
			if (level > 0) {

				console.log('alert', level, tick);
				if (timeout != null) {
					clearTimeout(timeout);
					timeout = null;
				}

				if (timestamp == null) {
					console.log('First tick', tick);
					timestamp = tick;
				}

				timeout = setTimeout(() => {
					//console.log('Last tick', tick);
					var duration = (tick >> 0) - (timestamp >> 0);
					console.log('dB-ish', duration);

					this.emit('sound', duration);

					clearTimeout(timeout);
					timeout = null;
					timestamp = null;

				}, 100);
				
			}

		});
	}


};
