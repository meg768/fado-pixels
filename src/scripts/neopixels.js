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

    var stripType = 'grb';
    var width     = 24;
    var height    = 1;
    var map       = 'alternating-matrix';
    var gpio      = 24;
    
    Neopixels.configure({gpio:gpio, debug:debug, map:map, width:width, height:height, stripType:stripType});

    process.on('SIGUSR1', cleanup);
    process.on('SIGUSR2', cleanup);
    process.on('SIGINT',  cleanup);
    process.on('SIGTERM', cleanup);
}


configure();

module.exports = Neopixels;