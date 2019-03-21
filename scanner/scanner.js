const cardProcessor = require('./CardProcessor')
const config = require(__dirname + '/../config/config.json')

let string = ''

if(config.input_device == 'acr122') {

  const { NFC } = require("nfc-pcsc");
  const nfc = new NFC();

  nfc.on('reader', reader => {

    console.log(reader.name + ' reader attached, waiting for cards ...');

    reader.on('card', card => {
	string = card.uid;
        cardProcessor.process(string)
    });

    reader.on('error', err => {
	console.error('reader error', err);
    });

    reader.on('end', () => {
	console.log(reader.name + ' reader disconnected.');
    });
  });

  nfc.on('error', err => {
    console.error(err);
  });

} else {

  const InputEvent = require('input-event')
  const keys = 'X^1234567890XXXXqwertzuiopXXXXasdfghjklXXXXXyxcvbnmXXXXXXXXXXXXXXXXXXXXXXX'
  const input = new InputEvent(`/dev/input/${config.input_device}`)
  const keyboard = new InputEvent.Keyboard(input)

  keyboard.on('keyup', function(event) {
    // Enter key
    if (event.code == 28) {
      console.log(`Read Card ID: ${string}`)

      //process code
      cardProcessor.process(string)

      // reset string for next scan
      string = ''
    } else {
      string += keys[event.code]
    }
  });
}
