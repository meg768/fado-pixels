#!/usr/bin/env node


function merge()
{
	function collate(a, b) {
		if (b) {
			if (b.constructor == Object) {
				for (var p in b) {
					if (b[p].constructor == Object) {
						if (a[p]) {
							collate(a[p], b[p]);
							continue;
						}
					} 
					a[p] = b[p];
				}	
			}
			else if (b.constructor == Array) {
				b.forEach((c) => {
					collate(a, c);
				});
			}
		} 
	};	
	

	for (var i = 1; i < arguments.length; i++) {
		collate(arguments[0], arguments[i]);
	}

	return arguments[0];
}

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
