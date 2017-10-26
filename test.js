#!/usr/bin/env node


var sprintf    = require('yow/sprintf');
var prefixLogs = require('yow/logs').prefix;

var App = function() {

	var watch = require('watch')
    watch.createMonitor('/boot/bluetooth', function (monitor) {

      monitor.on("created", function (f, stat) {
        console.log('new', f);
      })
      monitor.on("changed", function (f, curr, prev) {
		  console.log('changed', f);
      })
      monitor.on("removed", function (f, stat) {
		  console.log('removed', f);
      })
//      monitor.stop(); // Stop watching
    })

};

module.exports = new App();
