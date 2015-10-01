var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


// Standard Cloud9.IO Node Sendoff Point
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});

// used to initialize the data for the web pages
var livedata = {};

// setup express to use the 'client' directory
app.use( express.static( __dirname + '/client') );


// meat of socket.io connection, right now both devices and webpages comingle, 
// but in the future could be in different rooms, and have the server direct
// as necessary
io.on('connection', function(socket){
  console.log('socket id ' + socket.id + ' is connected.'); 
  var addedDevice = false;

  // nothing grabs ip address consistently, which isn't too much a concern,
  // we have trusted devices so we're free to connect
  //console.log ('connection from:');
  //console.log( socket.handshake.address );
  //console.log( socket.request.headers['x-forwarded-for'] )

  // used to track new devices being created
  socket.on('add device', function(name) {
    addedDevice = true;
    socket.name = name;
    if (!(socket.name in livedata)) {
      livedata[socket.name] = {};
    }
    livedata[ socket.name ].connected = true;
    io.emit( 'signal', { name: socket.name, key: 'connected', val: true });
    console.log('device ' + socket.name + ' is set.'); 
  });
  
  // used to initialize website data as needed
  socket.on('initalize data', function( fn ) {
    fn(livedata);
    console.log('initializing webpage');
  });
  
  // core push from device to webpages
  socket.on('signal', function(signal) {
    if (!(signal.name in livedata)) {
      livedata[signal.name] = {};
    }
    
    livedata[ signal.name ][ signal.key ] = signal.val;
    io.emit( 'signal', signal );
    console.log( 'from ' + socket.name + ', ' + signal.key + ': ' + signal.val );
  });
  
  // track the disconnects, and flag devices
  socket.on('disconnect', function() {
    if ( addedDevice ) {
      livedata[ socket.name ][ 'connected' ] = false;
      io.emit( 'signal', { name: socket.name, key: 'connected', val: false });
      console.log('device ' + socket.name + ' disconnected.'); 
    }
  });
});

// */

//var async = require('async')

//var router = express();
//var server = http.createServer(router);

//var livesignals = Object();




