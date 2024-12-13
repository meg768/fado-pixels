var Command = require('../scripts/command.js');
var Fado = require('../scripts/fado.js')
var MQTT = require('mqtt');


class MqttCommand extends Command {

	constructor() {
		var defaults = {
			port:3000
		};
		super({ module: module, name: 'mqtt', description: 'MQTT server', defaults: defaults});
	}

	defineArgs(yargs) {

		yargs.option('host',     {describe:'Specifies MQTT host', default:process.env.MQTT_HOST});
		yargs.option('password', {describe:'Password for MQTT broker', default:process.env.MQTT_PASSWORD});
		yargs.option('username', {describe:'User name for MQTT broker', default:process.env.MQTT_USERNAME});
		yargs.option('port',     {describe:'Port for MQTT', default:process.env.MQTT_PORT});
		yargs.option('topic',    {describe:'Topic for MQTT', default:process.env.MQTT_TOPIC});
		
	}

	run(argv) {
		console.log('sdflskdjföalkjasölkfj');

        let args = {};
        let fado = new Fado({log:this.log, debug:this.debug});

		this.debug(`Connecting to host '${argv.host}'...`);
		var mqtt = MQTT.connect(argv.host, {username:argv.username, password:argv.password, port:argv.port});

		mqtt.on('connect', () => {
			this.log(`Connected to ${argv.host}:${argv.port}...`);
		})

		/*
		mqtt.subscribe(argv.topic, (error) => {

        });
		*/

		mqtt.on('message', (topic, message) => {
			try {
                message = message.toString();

                this.log(`MQTT message: '${message}'`);

                if (message == '')
                    return

                try {
                    let payload = JSON.parse(message)
                    let {animation, ...options} = payload;

                    //this.runAnimation(animation, options);
                }
                catch(error) {
                    this.log(error);

                }


            }
			catch(error) {
				this.log(error);
			}
		});


	}

}

new MqttCommand();