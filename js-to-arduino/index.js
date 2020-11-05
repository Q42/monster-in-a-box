// var HID = require('node-hid');
// var devices = HID.devices();
// console.log('found devices:', devices);

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)

parser.on('data', line => console.log(`> ${line}`))

setTimeout(() => {
  port.write('wipe-red\n')
  console.log('sent wipe-red');
},5000)