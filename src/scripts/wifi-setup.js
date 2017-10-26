
var fs = require('fs');
var WiFi = require('./wifi-connection.js');
var isString = require('yow/is').isString;
var Events  = require('events');
var child_process = require('child_process');
var FileMonitor = require('./file-monitor.js');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class WifiSetup extends Events {

    constructor(fileName) {
        super();

        this.fileName = fileName;
        this.monitor  = new FileMonitor(this.fileName);

        this.monitor.on('created', (file) => {
            debug('Wi-Fi file created. Setting up again.');

            this.emit('wifi-changed');
            this.setup();
        });

        this.monitor.on('changed', (file) => {
            debug('Wi-Fi file changed. Setting up again.');

            this.emit('wifi-changed');
            this.setup();
        });


        this.monitor.start();

    }



    setup() {
        var fileName = this.fileName;

        debug('Setting up Wi-Fi using file', fileName);

        function loadFile() {
            try {
                debug('Loading file', fileName);
                return JSON.parse(fs.readFileSync(fileName));
            }
            catch(error) {
                debug(error);
            }
        }

        function deleteFile() {
            try {
                fs.unlinkSync(fileName);
            }
            catch(error) {
                debug(error);
            }

        }

        var wifi = new WiFi();

        Promise.resolve().then(() => {
            return Promise.resolve(loadFile());
        })

        .then((config) => {
            if (config && isString(config.ssid)) {
                this.emit('connecting');

                return wifi.connectToNetwork(config.ssid, config.password, 30000).then(() => {
                    return true;
                })
                .catch((error) => {
                    return false;
                })
            }
            else {
                return wifi.getConnectionState();
            }
        })

        .then((connected) => {
            if (!connected) {
                // Enable Bluetooth
                child_process.exec('sudo hciconfig hci0 piscan', (error, stdout, stderr) => {
                    if (!error) {
                        this.emit('discoverable');
                    }
                });
            }
            else {
                this.emit('ready');
            }

        })

        .catch((error) => {
            debug(error);
            this.emit('error', error);
        })

        .then(() => {
            deleteFile();
        })

    }

}
