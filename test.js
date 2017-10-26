#!/usr/bin/env node


var sprintf    = require('yow/sprintf');
var Events     = require('events');
var Path       = require('path');
var Watch      = require('watch');

class FileMonitor extends Events {

	constructor(fileName) {
		super();

		this.monitor  = undefined;

	}

	start(fileName) {

		var path = Path.dirname(fileName);

		this.stop();

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

		this.monitor = undefined;
	}

};

var App = function() {


	var monitor = new FileMonitor();

	monitor.start('/boot/bluetooth/wifi.json');

	monitor.on('created', (file) => {
		console.log('Created', file);
		monitor.stop();
	});

	monitor.on('changed', (file) => {
		console.log('Created', file);
		monitor.stop();
	});

	monitor.on('removed', (file) => {
		console.log('removed', file);
		monitor.stop();
	});

}
/*

var App = function() {

	var watch = require('watch')
    watch.createMonitor('/boot/bluetooth', function (monitor) {

      monitor.on("created", function (f, stat) {
        console.log('new', f);
		monitor.stop();
      })
      monitor.on("changed", function (f, curr, prev) {
		  console.log('changed', f);
		  monitor.stop();
      })
      monitor.on("removed", function (f, stat) {
		  console.log('removed', f);
		  monitor.stop();
      })
//      monitor.stop(); // Stop watching
    })

};
*/

module.exports = new App();
