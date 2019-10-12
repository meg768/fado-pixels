var Neopixels = require('rpi-neopixels');

function configure() {

    function cleanup() {
        console.log('Cleaning up...');
        var pixels = new Neopixels();

        pixels.fill('black');
        pixels.render();
        
        process.exit();
    }

    function debug() {
        console.log.apply(null, arguments);
    }

    var stripType = 'rgb';
    var width     = 24;
    var height    = 1;
    var map       = undefined;
    
    Neopixels.configure({debug:false, map:map, width:width, height:height, stripType:stripType});

    process.on('SIGUSR1', cleanup);
    process.on('SIGUSR2', cleanup);
    process.on('SIGINT',  cleanup);
    process.on('SIGTERM', cleanup);
}


configure();

module.exports = Neopixels;