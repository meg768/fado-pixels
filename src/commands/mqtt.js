var Command = require('../scripts/command.js');


class MqttCommand extends Command {

	constructor() {
		var defaults = {
			port:3000
		};
		super({ module: module, name: 'mqtt', description: 'MQTT server', defaults: defaults});
	}

	defineArgs(yargs) {
		yargs.option('port', { describe: 'Port to listen to', default: this.defaults.port});
	}

	run(argv) {
        let args = {};
		var Fado = require('../scripts/fado.js')
		var fado = new Fado();
        fado.blink();
	}

}

new MqttCommand();