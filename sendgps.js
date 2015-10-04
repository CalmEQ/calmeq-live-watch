#!/usr/bin/env node

var gpsd = require('node-gpsd')
var os = require('os');
var program = require('commander');
var socket_client = require('socket.io-client');

var DEFAULTDIST = 2;

var hostname = os.hostname()

program
    .version('0.0.1')
    .option('-h, --host [server]', 'Hostname, (set 0.0.0.0 for local c9.io)' )
    .option('-p, --port [number]', 'Set port [8080]', '8080')
    .option('-n, --name [string]', 'Set client name [' + hostname + ']', hostname)
    .option('-d, --mindistance [meters]', 'Minimum distance for updates [' + DEFAULTDIST + ']', DEFAULTDIST )
    .parse(process.argv);

var name = program.name;
var server = 'http://' + program.host + ':' + program.port;
var socket = socket_client(server);
var mindist = program.mindistance;

socket.on('connect', function(){
    console.log('connected to server ' + server);
    socket.emit( 'add device', name );
});

socket.on('disconnect', function(){
    console.log('disconnected from server ' + server);
});

var GPSPORT = 2948;


//var daemon = new gpsd.Daemon({
//    device: '/dev/ttyUSB0',
//    port: GPSPORT // one more than default due to odd error
//});

//daemon.start(function() {
//    console.log('Started');
//});
var lastlat = 0;
var lastlon = 0;

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
	Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

var listener = new gpsd.Listener({
    port: GPSPORT,
    hostname: 'localhost'
});

listener.on('TPV', function (tpv) {
    // got a position report, log it.
    //console.log(tpv);
    pushit = function( key, newkey ) {
	if ( key in tpv ) {
	    socket.emit( 'signal', { name: name, key: newkey, val: tpv[key] } );
	} else {
	    console.log('No ' + key + ' found in tpv object')
	};
    };
    if (!( 'lat' in tpv && 'lon' in tpv ) ) {
	console.log('No lat and lon in TPV' );
	return
    };
    var dist = measure( lastlat, lastlon, tpv.lat, tpv.lon );
    if ( dist > mindist ) {
	lastlat = tpv.lat;
	lastlon = tpv.lon;
	pushit( 'lat', 'latitude' );
	pushit( 'lon', 'longitude' );
	pushit( 'alt', 'altitude' );
    } else {
	//console.log('Distance ' + dist + ' less than ' + mindist );
    };
});

	   
listener.connect(function() {
    console.log('connected to gpsd on port ' + GPSPORT);
    listener.watch();
});
