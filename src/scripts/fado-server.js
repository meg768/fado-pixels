var Express = require('express');
var BodyParser = require('body-parser');
var Fado = require('./fado.js');

module.exports = class FadoServer extends Fado {

	constructor(options) {
		var {port = 3000, ...options} = options;

		super(options);

		this.express = Express();
		this.express.use(BodyParser.json());
		this.port = port;

		this.color({color:'blue', fade:1000, renderFrequency:60000, duration:-1, priority:'!'});

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

		this.debug('Express is listening to port', this.port);
		this.express.listen(this.port);

	}

};
