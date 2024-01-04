var Command = require('../scripts/command.js');
var Fado = require('../scripts/fado.js')


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
        let fado = new Fado({log:this.log, debug:this.debug});
        fado.flash();
	}

}

new MqttCommand();