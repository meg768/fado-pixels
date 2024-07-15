#!/usr/bin/env node

var Color = require('color');
var Animation = require('./src/scripts/animation.js');

class RoundAnimation extends Animation {


    constructor(options) {
        var {interval = 500, color = 'red', antiColor = 'black', ...options} = options;

        super({name:'RoundAnimation', ...options});

		this.tick = 0;
        this.interval = interval;
        this.color = Color(color).rgbNumber();
        this.antiColor = Color(antiColor).rgbNumber();
    }

    render() {
        this.pixels.fill(Color("black").rgbNumber());
		this.pixels.setPixel(this.tick, 0, this.Color("red").rgbNumber());
        this.pixels.render();

		this.tick = (this.tick + 1) % 24

        this.sleep(200);
    }


}

class App {

	constructor() {
		var yargs = require('yargs');

		yargs.help();

		this.run(yargs.argv);
	}

	run(argv) {
		try {
			var Fado = require('./src/scripts/fado.js');
			var fado = new Fado();
	
			var options = {
				pixels     : fado.pixels,
				debug      : console.log,
				duration   : 10000
			};
	
			fado.runAnimation(new RoundAnimation(options));
		}

		catch(error) {
			console.log(error.stack);
			process.exit(-1);
		}

	}
} 


new App();
