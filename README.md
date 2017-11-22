# neopixel-globe


## Setting up the Pi Zero

Visit https://www.raspberrypi.org/downloads to download latest version of Raspberry OS.
Use Pi-Filler or other tool to create an SD-card with the latest image.

### Enable SSH

Create an empty file named ssh and copy it to boot. From the Mac terminal
enter this.

````bash
echo > /Volumes/boot/ssh
````

### Configure Network

Create another file named **wpa_supplicant.conf** on /Volumes/boot.
If the mac terminal, type

````bash
nano /Volumes/boot/wpa_supplicant.conf
````

And paste in the following

    country=GB
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1

    network={
    	ssid="your-network-name"
    	psk="your-password"
    }

Make sure to specify your own network name and password above. Then
save the file by pressing **CTRL+X** followed by **Y**. Now
remove the memory card from your Mac and insert into your Raspberry.

Once it is booted, try to figure out the IP address by using LanScan for Mac.
Then connect to your Raspberry Pi.

````bash
ssh pi@XXX.XXX.XXX.XXX
````

### Update apt-get

When all set up. Update your Pi.

````bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get dist-upgrade -y
sudo rpi-update
````

### Configure using raspi-config

Use **raspi-config** to configure time zone, enable SSH and enable I2C.

````bash
sudo raspi-config
````

### Install Node and npm

````bash
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v6.9.1.sh | bash
````

### Install git and pigpio

````bash
sudo apt-get install git-core pigpio
````
### Set up Bluetooth

Make sure Bluetooth is up and running.

````bash
sudo bluetoothctl
````

Enter the following commands

    power on
    agent NoInputNoOutput
    default-agent
    pairable on
    exit

Follow this link to set up Bluetooth file transfer. https://www.raspberrypi.org/forums/viewtopic.php?p=963751#p963751
It will make your Raspberry Pi accept files from your Mac or PC.


### Clone repository

````bash
git clone https://github.com/meg768/neopixel-globe.git
cd neopixel-globe
````

### Install Node Modules

````bash
npm install
````

### Create Environment File

This project uses the npm module **dotenv** and needs some enviroment variables set up.

````bash
echo > .env
````



## Links
- Send files to RPI over Bluetooth - https://www.raspberrypi.org/forums/viewtopic.php?p=963751#p963751
- Powering lots of leds - http://www.eerkmans.nl/powering-lots-of-leds-from-arduino/
- Adafruit Neopixel Library - https://learn.adafruit.com/adafruit-neopixel-uberguide/arduino-library
- I2C Communication between Raspberry and Arduino - https://oscarliang.com/raspberry-pi-arduino-connected-i2c/
- Drawings of Raspberry Pi PCB - https://www.raspberrypi.org/documentation/hardware/raspberrypi/mechanical/README.md
- Upgrading node - http://thisdavej.com/upgrading-to-more-recent-versions-of-node-js-on-the-raspberry-pi/
- Installing node on Pi Zero - https://blog.miniarray.com/installing-node-js-on-a-raspberry-pi-zero-21a1522db2bb
- Installing later node versions on Pi Zero - https://github.com/sdesalas/node-pi-zero
- More I2C - https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial
