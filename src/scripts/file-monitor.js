var Events     = require('events');
var Path       = require('path');
var Watch      = require('watch');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class FileMonitor extends Events {

	constructor(fileName) {
		super();

        this.fileName = fileName;
        this.monitor  = undefined;

	}

    start() {

		var path = Path.dirname(this.fileName);

		debug('Monitoring path ', path);

		Watch.createMonitor(path, (monitor) => {

            this.monitor = monitor;

			monitor.on('created', (file, stat) => {
				this.emit('created', file, stat);
			});

			monitor.on('changed', (file, stat) => {
				this.emit('changed', file, stat);
			});

			monitor.on('removed', (file, stat) => {
				this.emit('removed', file, stat);
			});


		});

	}

    stop() {
        if (this.monitor != undefined)
            this.monitor.stop();
    }


};
