var Events     = require('events');
var Path       = require('path');
var Watch      = require('watch');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class FileMonitor extends Events {

	constructor(fileName) {
		super();


		var path = Path.dirname(fileName);

		debug('Monitoring', path);

		Watch.createMonitor(path, (monitor) => {

			monitor.on('created', (file, stat) => {
				this.emit('created', file, stat);
				monitor.stop();
			});

			monitor.on('changed', (file, stat) => {
				this.emit('changed', file, stat);
				monitor.stop();
			});

			monitor.on('removed', (file, stat) => {
				this.emit('removed', file, stat);
				monitor.stop();
			});


		});

	}


};
