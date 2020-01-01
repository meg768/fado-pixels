var Fado = require('../scripts/fado.js');

module.exports = class FadoServer extends Fado {

	constructor(options) {
		var Express = require('express');
		var BodyParser = require('body-parser');

		var {port, ...options} = options;
		super(options);

		this.express = Express();
		this.express.use(BodyParser.json());

		this.port = port;

		this.express.post('/blink', (request, response) => {
			this.blink(request.body);
			response.send('OK');
		});

		this.express.post('/color', (request, response) => {
			this.color(request.body);
			response.send('OK');
		});

		this.express.post('/pulse', (request, response) => {
			this.pulse(request.body);
			response.send('OK');
		});

		this.express.post('/clock', (request, response) => {
			this.clock(request.body);
			response.send('OK');
		});

		this.express.post('/random', (request, response) => {
			this.random(request.body);
			response.send('OK');
		});

		this.express.post('/spy', (request, response) => {
			this.spy(request.body);
			response.send('OK');
		});

		this.debug('Express is listening to port', this.port);
		this.express.listen(this.port);

	}

};
