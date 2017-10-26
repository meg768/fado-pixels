
var WiFi = require('./wifi-connection.js');
var isString = require('yow/is').isString;
var Events  = require('events');
var child_process = require('child_process');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class WifiSetup extends Events {

    constructor() {
        super();

    }

    enableBluetooth() {

        child_process.exec('sudo hciconfig hci0 piscan', (error, stdout, stderr) => {
            if (!error) {
                this.emit('discoverable');
            }
        });

    }

    setup(fileName) {
        var fs = require('fs');

        function loadFile() {
            try {
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
                throw new Error('No wi-fi connection.');
            }

            this.emit('ready');
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
