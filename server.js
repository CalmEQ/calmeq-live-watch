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
var devicedata = [];
var devicemap = {};

// setup express to use the 'client' directory
app.use( express.static( __dirname + '/client') );

// expose bower_components to simplify dev workflow 
app.use( '/bower', express.static( __dirname +'/bower_components'));


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

  function getid( name ) {
    var myid;
    if (!(name in devicemap)) {
      myid = devicedata.push( { name: name } ) - 1;
      devicemap[name] = myid;
    } else {
      myid = devicemap[name];
    }
    return myid;    
  };

  // used to initialize website data as needed
  socket.on('initalize data', function( fn ) {
    fn( devicedata, devicemap );
    console.log('initializing webpage');
  });
  

  // used to track new devices being created
  socket.on('add device', function(name) {
    addedDevice = true;
    socket.name = name;
    var myid = getid( name );
    console.log('Mapped ' + name + ' to ' + myid)
    //console.log(devicemap)
    //console.log(devicedata)
    devicedata[myid].connected = true;
    io.emit( 'signal', { name: socket.name, key: 'connected', val: true });
    console.log('device ' + socket.name + ' is set.'); 
  });
  
  // core push from device to webpages
  socket.on('signal', function(signal) {
    var myid = getid( signal.name );
    devicedata[ myid ][ signal.key ] = signal.val;
    io.emit( 'signal', signal );
    console.log( 'from ' + socket.name + ', ' + signal.key + ': ' + signal.val );
  });
  
  // track the disconnects, and flag devices
  socket.on('disconnect', function() {
    if ( addedDevice ) {
      var myid = getid( socket.name );
      devicedata[ myid ].connected = false;
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




