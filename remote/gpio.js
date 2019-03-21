const Gpio = require('onoff').Gpio;
const led = new Gpio(17, 'out');
const button = new Gpio(4, 'in', 'rising', {debounceTimeout: 10});

button.watch((err, value) => console.log(value));

process.on('SIGINT', () => {
  led.unexport();
  button.unexport();
});
