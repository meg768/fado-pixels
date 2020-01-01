var Command = require('../scripts/command.js');
var Express = require('express');
var BodyParser = require('body-parser');


class FadoServer {

	constructor(options) {
		var {debug, log, port = 3000, ...options} = options;
		var Fado = require('../scripts/fado.js');

		this.express = Express();
		this.express.use(BodyParser.json());

		this.fado     = new Fado({log:log, debug:debug});
		this.port     = port;
        this.debug    = typeof debug == 'function' ? debug : (debug ? console.log : () => {});
        this.log      = typeof log == 'function' ? log : (log ? console.log : () => {});

		this.fado.color({color:'blue', fade:1000, renderFrequency:60000, duration:-1, priority:'!'});

		this.express.post('/blink', (request, response) => {
			this.fado.blink(request.body);
			response.send('OK');
		});

		this.express.post('/color', (request, response) => {
			this.fado.color(request.body);
			response.send('OK');
		});

		this.express.post('/pulse', (request, response) => {
			this.fado.pulse(request.body);
			response.send('OK');
		});

		this.express.post('/clock', (request, response) => {
			this.fado.clock(request.body);
			response.send('OK');
		});

		this.express.post('/random', (request, response) => {
			this.fado.random(request.body);
			response.send('OK');
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
		var server = new FadoServer(argv);
	}

}

new ServerCommand();