var Command = require('../scripts/command.js');
var Animation = require('../scripts/animation.js');

class DualColorAnimation extends Animation {

	constructor(options) {
        var {fade = undefined, colorA = 'red', colorB = 'blue', ...options} = options;

        super({name:'DualColorAnimation', ...options});

        this.colorA = Color(colorA).rgbNumber();
        this.colorB = Color(colorB).rgbNumber();
        this.fade = fade;
    }

    render() {
		for (var i = 0; i < this.pixels.width; i++) {
			if (i < this.pixels.width / 2)
				this.pixels.setPixel(i, 0, this.colorA);
			else
				this.pixels.setPixel(i, 0, this.colorB);
		}


        if (this.fade)
            this.pixels.render({transition:'fade', duration:this.fade});
        else
            this.pixels.render();

    }


}

class SplitColorCommand extends Command {

	constructor() {
		var defaults = {
			colorA          : 'red',
			colorB          : 'blue',
			duration        : 10000
		};

		super({module:module, name: 'split', description:'Set two colors', defaults:defaults});


	}

	defineArgs(args) {
		args.option('duration', {describe:'Duration', default:this.defaults.duration});
		args.option('colorA', {describe:'Color A', default:this.defaults.colorA});
		args.option('colorB', {describe:'Color B', default:this.defaults.colorB});
	}


	run(argv) {
		var Neopixels        = require('../scripts/neopixels.js');
		var AnimationQueue   = require('../scripts/animation-queue.js');
		
		var queue      = new AnimationQueue({debug:argv.debug});
		var options    = {pixels:new Neopixels(), renderFrequency:1000, priority:'!', ...argv};	
		var animation  = new DualColorAnimation(options);
	
		queue.enqueue(animation);

	}
}

new SplitColorCommand();


