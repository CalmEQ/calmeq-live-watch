#!/usr/bin/env node
 
/**
 * Module dependencies.
 */

var os = require('os');
var program = require('commander');
var socket_client = require('socket.io-client');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')

var hostname = os.hostname()
 
program
  .version('0.0.1')
  .option('-h, --host [server]', 'Hostname, (set 0.0.0.0 for local c9.io)', 'calmeq-live-watch-alpharigel.c9.io' )
  .option('-p, --port [number]', 'Set port [8080]', '8080')
  .option('-n, --name [string]', 'Set client name [' + hostname + ']', hostname)
  .parse(process.argv);
 
var name = program.name;
var server = 'http://' + program.host + ':' + program.port;
var socket = socket_client(server);

// Connection URL
var url = 'mongodb://localhost:27017/calmeq_live_watch';
// Use connect method to connect to the Server

var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('noisedata');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
	assert.equal(err, null);
	//assert.equal(2, docs.length);
	console.log("Found the following records");
	//console.dir(docs);
	callback(docs);
    });
};

socket.on('connect', function(){ 
    console.log('connected');
    socket.emit( 'add device', name );

    MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	
	findDocuments( db, function( data ) {
	    socket.emit('all data', { name: name, data: data } );
	    db.close();
	});
    });
    
});

socket.on('data request', function( data ) {
    console.log( 'request for data ' + data );
    
});

setInterval( function() { 
    socket.emit( 'signal', { name: name, key: "random", val: Math.random() } );
}, 3000);

socket.on('disconnect', function(){
    console.log('disconnected')
});
  
