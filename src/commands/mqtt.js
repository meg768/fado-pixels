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
        let args = {};
        let fado = new Fado({log:this.log, debug:this.debug});

		this.debug(`Connecting to host '${this.argv.host}'...`);
		var mqtt = MQTT.connect(this.argv.host, {username:this.argv.username, password:this.argv.password, port:this.argv.port});

		mqtt.on('connect', () => {
			this.log(`Connected to ${this.argv.host}:${this.argv.port}...`);
//			this.displayText(`Listening to MQTT topic ${this.argv.topic}... 🤪`);
		})

		mqtt.subscribe(this.argv.topic, (error) => {

        });


		mqtt.on('message', (topic, message) => {
			try {
                message = message.toString();

                this.log(`MQTT message: '${message}'`);

                if (message == '')
                    return

                try {
                    let payload = JSON.parse(message)
                    let {animation, ...options} = payload;

                    this.runAnimation(animation, options);
                }
                catch(error) {
                    this.displayText(error);

                }


            }
			catch(error) {
				this.log(error);
			}
		});


	}

}

new MqttCommand();