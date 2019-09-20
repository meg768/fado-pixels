var Events     = require('events');
var Gpio       = require('pigpio').Gpio;

function isFunction(obj) {
	return typeof obj === 'function';
};

module.exports = class SoundSensor extends Events {

	constructor(options) {

		super();

        var {pin, event = 'alert', debug, delay = 100} = options;

		if (pin == undefined)
			throw new Error('Must supply a pin number.');

        if (!isFunction(debug))
    		debug = function(){};

		var gpio = new Gpio(pin, {mode: Gpio.INPUT, alert:true});

		var timeout = null;
		var timestamp = null;

		gpio.on(event, (level, tick) => {
			if (level > 0) {

				debug('Alert', level, tick);

				if (timeout != null) {
					clearTimeout(timeout);
					timeout = null;
				}

				if (timestamp == null) {
					timestamp = tick;
				}

				timeout = setTimeout(() => {
					var duration = (tick >> 0) - (timestamp >> 0);

					debug('Sound suration', duration);
					this.emit('alert', duration);

					clearTimeout(timeout);
					timeout = null;
					timestamp = null;

				}, delay);
				
			}

		});
	}



};
