const HID = require("node-hid");

class Confetti {
    constructor() {
        const relayDevices = HID.devices().filter(device => {
            return device.product && device.product.indexOf("USBRelay") !== -1;
        });

        if (relayDevices.length === 0) {
            throw new Error("Unable to detect USB relay. Is it connected?");
        }

        if (relayDevices.length > 1) {
            console.warn("Multiple relays found, using the first one connected.");
        }

        const path = relayDevices[0].path;

        console.log(`Using relay at path ${path}`)

        this.device = new HID.HID(path);
    }

    startFire() {
        this.device.sendFeatureReport([0x00, 0xFE, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    }

    stopFire() {
        this.device.sendFeatureReport([0x00, 0xFC, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    }
}

module.exports = Confetti;