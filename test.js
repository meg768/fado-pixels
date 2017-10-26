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
