#!/usr/bin/env node

require('dotenv').config();

var sprintf    = require('yow/sprintf');
var prefixLogs = require('yow/logs').prefix;
var Watch      = require('watch');

var App = function() {

	watch.watchTree('/boot/bluetooth', function (f, curr, prev) {
	    if (typeof f == "object" && prev === null && curr === null) {
	      console.log('Finished walking the tree');

	    } else if (prev === null) {
	      console.log('new file', f);
	    } else if (curr.nlink === 0) {
			console.log('removed', f);
	    } else {
			console.log('changed', f);
	    }
	  })

};

module.exports = new App();
