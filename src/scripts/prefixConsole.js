
module.exports = prefixConsole = function(fn) {

	var sprintf = require('yow/sprintf');
	var methods = ['log', 'error', 'warn', 'info'];

	if (fn == undefined) {
		fn = function() {
			var date = new Date();
			return sprintf('%04d-%02d-%02d %02d:%02d.%02d: ', date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
		}
	}

	methods.forEach((method) => {
		console[method] = function() {
			var args = Array.prototype.slice.call(arguments);
			var prefix = typeof fn == 'function' ? fn() : fn;
		
			args.unshift(prefix);
		
			console[method].apply(console, args);	
		}
		
	});

}
