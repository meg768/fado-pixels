#!/usr/bin/env node

var Color = require('color');
var Animation = require('./src/scripts/animation.js');
var Random = require('yow/random');

class RoundAnimation extends Animation {


    constructor(options) {

        super({name:'RoundAnimation', ...options});

		this.tick = 0;
    }

	async stop() {
		this.pixels.clear();
		this.pixels.render();
		await super.stop();
	}

    render() {
        this.pixels.fill(Color("black").rgbNumber());

		for (let i = 0; i < 24; i++) {
			let color = Color(Random(["orange", "black", "black", "black", "black", "black", , "black", "black", "black", "black", "black", "black", "red"])).rgbNumber();
			this.pixels.setPixel(i, 0, color);
		}
        //this.pixels.render();
        this.pixels.render({transition:'fade', duration:3000});

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
				xiterations : 10,
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
