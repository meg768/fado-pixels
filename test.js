#!/usr/bin/env node


var sprintf    = require('yow/sprintf');
var Events     = require('events');
var Path       = require('path');
var Watch      = require('watch');
var FileMonitor = require('./src/scripts/file-monitor.js');

function debug() {
    console.log.apply(this, arguments);
}


var App = function() {


	var monitor = new FileMonitor('/boot/bluetooth/wifi.json');

    monitor.start();

	monitor.on('created', (file) => {
		debug('Created', file);
        monitor.stop();
	});

	monitor.on('changed', (file) => {
		debug('Changed', file);
        monitor.stop();
	});

	monitor.on('removed', (file) => {
		debug('removed', file);
        monitor.stop();
	});

}


module.exports = new App();
