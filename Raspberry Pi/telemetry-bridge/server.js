const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { Server } = require('socket.io');

const ARDUINO_PORT = "/dev/tty.usbmodem2101"

const io = new Server(3001, {
  cors: { origin: '*' }
});

const port = new SerialPort({ path: ARDUINO_PORT, baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

console.log("Listening for Arduino on " + ARDUINO_PORT + " ...");

parser.on('data', (line) => {
  const parts = line.trim().split('#');
  
  if (parts.length === 4) {
    const telemetryData = {
      voltage: parseFloat(parts[0]),
      current: parseFloat(parts[1]),
      temperature: parseFloat(parts[2]),
      acceleration: parseFloat(parts[3]),
      velocity: 0 
    };

    io.emit('telemetry', telemetryData);
  }
});

port.on('error', (err) => {
  console.error('Serial Port Error: ', err.message);
});
