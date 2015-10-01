#!/usr/bin/env node
 
/**
 * Module dependencies.
 */

var os = require('os');
var program = require('commander');
var socket_client = require('socket.io-client');

var hostname = os.hostname()
 
program
  .version('0.0.1')
  .option('-h, --host [server]', 'Hostname, (set 0.0.0.0 for local c9.io)' )
  .option('-p, --port [number]', 'Set port [8080]', '8080')
  .option('-n, --name [string]', 'Set client name [' + hostname + ']', hostname)
  .parse(process.argv);
 
var name = program.name;
var server = 'http://' + program.host + ':' + program.port;
var socket = socket_client(server);

socket.on('connect', function(){ 
    console.log('connected');
    socket.emit( 'add device', name );
});

setInterval( function() { 
    socket.emit( 'signal', { name: name, key: "random", val: Math.random() } );
}, 3000);

socket.on('disconnect', function(){
    console.log('disconnected')
});
  