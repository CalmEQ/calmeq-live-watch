var gpsd = require('node-gpsd');

// turn into an actual daemon process
require('daemon')();


var daemon = new gpsd.Daemon({
    device: '/dev/ttyUSB0',
    port: 2948,   //adding 1 to the default port 2947
});


daemon.start(function() {
    console.log('Started GPSD dameon process');
});
