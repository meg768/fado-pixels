var Events     = require('events');
var Gpio       = require('pigpio').Gpio;


module.exports = class SoundSensor extends Events {

	constructor(options) {

		super();

        var {pin, event = 'alert', debug, delay = 100} = options;

		if (pin == undefined)
			throw new Error('Must supply a pin number.');

        if (typeof debug !== 'function')
    		debug = function(){};

        debug('Construct options:', {pin:pin, event:event, debug:debug, delay:delay});

        var gpio = new Gpio(pin, {mode: Gpio.INPUT, alert:true});

		var timeout = null;
		var timestamp = null;

		gpio.on('alert', (level, tick) => {
			if (level > 0) {

				debug('GPIO alert: Level: %d, timestamp: %d', level, tick);

				if (timeout != null) {
					clearTimeout(timeout);
					timeout = null;
				}

				if (timestamp == null) {
					timestamp = tick;
				}

				timeout = setTimeout(() => {
					var duration = ((tick >> 0) - (timestamp >> 0)) / 1000;

					debug('Sound duration: %d ms', duration);
					this.emit(event, duration);

					clearTimeout(timeout);
					timeout = null;
					timestamp = null;

				}, delay);
			}

		});
	}
};
