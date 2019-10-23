
module.exports = class prefixedConsole extends console {

	constructor(prefix) {
		super();

		if (prefix == undefined) {
			prefix = function() {
				var date = new Date();
				return sprintf('%04d-%02d-%02d %02d:%02d.%02d:', date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
			}
		}

		this.prefix = prefix;

	
	}

	log() {
		var isFunction = require('yow/isFunction');
		var args = Array.prototype.slice.call(arguments);
		var prefix = isFunction(this.prefix) ? this.prefix() : this.prefix;
	
		args.unshift(prefix);
	
		super.log.apply(this, args);	

	}


}

