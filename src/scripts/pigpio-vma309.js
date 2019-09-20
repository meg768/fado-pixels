var Events     = require('events');
var Gpio       = require('pigpio').Gpio;


module.exports = class SoundSensor extends Events {

	constructor(options) {

		super();

        var {pin, event = 'alert', debug, timeout = 100} = options;

		if (pin == undefined)
			throw new Error('Must supply a pin number.');

        if (typeof debug !== 'function')
    		debug = () => {};

        debug('Construct options:', {pin:pin, event:event, debug:debug, timeout:timeout});

        var gpio = new Gpio(pin, {mode: Gpio.INPUT, alert:true});

		var timer = null;
		var timestamp = null;

		gpio.on('alert', (level, tick) => {
			if (level > 0) {

				debug('GPIO alert: Level: %d, timestamp: %d', level, tick);

				if (timer != null) {
					clearTimeout(timer);
					timer = null;
				}

				if (timestamp == null) {
					timestamp = tick;
				}

				timer = setTimeout(() => {
					var duration = ((tick >> 0) - (timestamp >> 0)) / 1000;

					debug('Sound duration: %d ms', duration);
					this.emit(event, duration);

					clearTimeout(timer);
					timer = null;
					timestamp = null;

				}, timeout);
			}

		});
	}
};
