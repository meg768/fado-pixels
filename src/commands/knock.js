console.log(`Loading ${__filename}...`);

var Command = require('../scripts/command.js');

class KnockCommand extends Command {

	constructor() {
		super({module:module, name:'knock', description:'Test knock levels', defaults:{}});
	}

	defineArgs(yargs) {
	}

	run(argv) {
        var Button = require('pigpio-button');
		var button = new Button({debug:argv.debug, autoEnable:true, pin:6});
		var state = 'on';

		button.on('click', (clicks) => {
			state = (state == 'on') ? 'off' : 'on';
			this.debug(`Button clicked, state is now ${state}...`);
		});

		runAnimation(new SpyAnimation(defaultOptions));
	
	}

}

new KnockCommand();

console.log(`Finished loading ${__filename}...`);
