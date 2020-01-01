var Command = require('../scripts/command.js');

class Server extends Command {

	constructor() {
		var defaults = {
			port:3000
		};
		super({ module: module, name: 'server', description: 'Fado server', defaults: defaults});
	}

	defineArgs(yargs) {
		yargs.option('port', { describe: 'Port to listen to', default: this.defaults.port});
	}

	run(argv) {
		var Color = require('color');
		var Fado = require('../scripts/fado.js');

		var fado = new Fado({log:this.log, debug: this.debug});

		fado.queue.on('idle', () => {
			fado.color({color:'red', fade:1000, renderFrequency:60000, duration:-1});
		});


		fado.color({color:'red', fade:1000, renderFrequency:60000, duration:-1, priority:'!'});

	}

}

new Server();

