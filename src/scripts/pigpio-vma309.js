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

        debug('Construct options:', {pin:pin, event:event, debug:debug, delay:delay});

        var gpio = new Gpio(pin, {mode: Gpio.INPUT, alert:true});

		var timeout = null;
		var timestamp = null;

		gpio.on('alert', (level, tick) => {
			if (level > 0) {

				debug('GPIO alert, level: %d, timestamp: %d', level, tick);

				if (timeout != null) {
					clearTimeout(timeout);
					timeout = null;
				}

				if (timestamp == null) {
					timestamp = tick;
				}

				timeout = setTimeout(() => {
					var duration = (tick >> 0) - (timestamp >> 0);

					debug('Sound duration %d ms', duration / 1000);
					this.emit(event, duration);

					clearTimeout(timeout);
					timeout = null;
					timestamp = null;

				}, delay);
				
			}

		});
	}



};
