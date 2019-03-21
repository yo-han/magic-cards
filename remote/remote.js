const HID = require('node-hid');
const { exec } = require('child_process');
const config = require(__dirname + '/../config/remote.json')

let devices = HID.devices();
let path ='';

console.log(devices);

devices.forEach(function(hid_device) {
  path = hid_device.path;
});

let device = new HID.HID(path);
let cmd;

device.on('error', function(error) { console.log(error); } );

device.on("data", function(data) {
  
  let json = JSON.parse(JSON.stringify(data));

  switch(json.data[1]) {
    case 233:
      cmd = config.remote.up;
    break;
    case 234:
      cmd = config.remote.down;
    break;
    case 205:
      cmd = config.remote.center;
    break;
    case 181:
     cmd = config.remote.right;
    break;
    case 182:
      cmd = config.remote.left;
    break;
    default:
     cmd = config.remote.fallback;
  }

  exec(cmd,(err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }

    console.log(`stderr: ${stderr}`);
  });
});
