#!/usr/bin/env node

var merge = require('yow/merge');

var a = {
	a:10,
	b:5,
	c:{
		a:2,
		b:3,
		c:{
			a:1
		}
	}
};

var b = {
	b:[500],
	c:{
		a:200,
		c:{
			b:300
		}
	}
};

console.log(JSON.stringify(a, null, '    '));
console.log(JSON.stringify(b, null, '    '));
console.log(JSON.stringify(merge({}, a, b,  {olle:4}), null, '    '));
