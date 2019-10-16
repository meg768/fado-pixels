var Neopixels = require('rpi-neopixels');
var config = require('./config.js');

function configure() {

    function cleanup() {
        console.log('Cleaning up...');
        var pixels = new Neopixels();

        pixels.fill('black');
        pixels.render();
        
        process.exit();
    }

    Neopixels.configure({stripType:'rgb', width:24, height:1, map:undefined, ...config.neopixels});

    process.on('SIGUSR1', cleanup);
    process.on('SIGUSR2', cleanup);
    process.on('SIGINT',  cleanup);
    process.on('SIGTERM', cleanup);
}


configure();

module.exports = Neopixels;