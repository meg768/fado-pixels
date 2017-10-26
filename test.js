#!/usr/bin/env node


var sprintf    = require('yow/sprintf');


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

module.exports = new App();
