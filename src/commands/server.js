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
		var FadoServer = require('../scripts/fado-server.js')
		var server = new FadoServer(argv);
	}

}

new Server();