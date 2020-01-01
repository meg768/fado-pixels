var Command = require('../scripts/command.js');
var express = require('express');

class Server {

	constructor(options) {
		var {debug, log, port = 3000, ...options} = options;
		var Fado = require('../scripts/fado.js');

		this.express  = express();
		this.fado     = new Fado({log:log, debug:debug});
		this.port     = port;
        this.debug    = typeof debug == 'function' ? debug : (debug ? console.log : () => {});
        this.log      = typeof log == 'function' ? log : (log ? console.log : () => {});

		this.fado.color({color:'blue', fade:1000, renderFrequency:60000, duration:-1, priority:'!'});

		this.express.post('/blink', (request, response) => {
			response.send('Hello World');
		});

		this.debug('Express is listening to port', this.port);
		this.express.listen(this.port);

	}

};

class ServerCommand extends Command {

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
		var server = new Server(argv);
	}

}

new ServerCommand