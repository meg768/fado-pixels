#!/usr/bin/env node


var sprintf    = require('yow/sprintf');
var Events     = require('events');
var Path       = require('path');
var Watch      = require('watch');
var FileMonitor = require('./src/scripts/file-monitor.js');

function debug() {
    console.log.apply(this, arguments);
}

/*
class FileMonitor extends Events {

	constructor(fileName) {
		super();


		var path = Path.dirname(fileName);

		console.log('Monitoring', path);

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
*/

var App = function() {


	var monitor = new FileMonitor('/boot/bluetooth/wifi.json');


	monitor.on('created', (file) => {
		debug('Created', file);
	});

	monitor.on('changed', (file) => {
		debug('Changed', file);
	});

	monitor.on('removed', (file) => {
		debug('removed', file);
	});

}


module.exports = new App();
