
var ColorAnimation = require('./color-animation.js');
var Sleep = require('sleep');

module.exports = class extends ColorAnimation {

    constructor(options) {
        var {length = 500, fade, fadeIn, fadeOut, fadeInOut, ...options} = options;
        super({name:'Blink Animation', renderFrequency:500, ...options});

        if (fade)
            fadeIn = fadeOut = fade;
    
        if (fadeInOut)
            fadeIn = fadeOut = fadeInOut;


        this.length  = length;
        this.fadeIn  = fadeIn;
        this.fadeOut = fadeOut;
    }



    render() {
        this.pixels.fill(this.color);

        if (this.fadeIn)
            this.pixels.render({transition:'fade', duration:this.fadeIn});
        else
            this.pixels.render();

        Sleep.msleep(this.length);
        
        this.pixels.fill(0);

        if (this.fadeOut)
            this.pixels.render({transition:'fade', duration:this.fadeOut});
        else
            this.pixels.render();
    }


}
