//var mic = require('microphone');

//mic.startCapture({'mp3output': true});
 
//mic.audioStream.on('data', function(data) {
//    process.stdout.write(data);
//});

 var spawn = require('child_process').spawn
// var PassThrough = require('stream').PassThrough;

// var raw2db = spawn( 'python', [ __dirname + '/rawaudio2rms.py' ] );

// var micaudio = spawn('arecord', ['-D', 'plughw:1,0', '-f', 'dat']);
// //micaudio.stdout.on('data', function(data) {
// //    raw2db.stdin.write(data);
//     //console.log('got data in node');
// //});

// micaudio.stderr.on('data', function(data) {
//     console.log('micaudio stderr: ' + data);
// });

// raw2db.stdout.on('data', function(data) {
//     console.log('raw2db stdout: ' + data);
// });

// raw2db.stderr.on('data', function(data) {
//     console.log('rawdb stderr: ' + data );
// });

//
//var both = spawn( 'bash', [ 'livedata.sh'] );
//both.stdout.on('data', function(data) {
//    console.log('both stdout: ' + data);
//});


process.stdin.setEncoding('utf8');
process.stdin.resume();

process.stdin.on('readable', function() {
    console.log('found node data');
    var chunk = process.stdin.read();
    if (chunk !== null) {
	process.stdout.write('data: ' + chunk);
    }
});


//var readline = require('readline');

//var rl = readline.createInterface({
//    input: process.stdin,
//    output: process.stdout
//});
//
//rl.on('line', function(line) {
//    console.log( 'data: ' + line );
//});
    

//raw2db.stderr.pipe( process.stderr );


//audio.on('data', function(data) {
//    raw2db.stdin.write(
//    process.stdout.write(data);
//});


//var ps = null;

//var audio = new PassThrough;
//var info = new PassThrough;

//var start = function() {
//    if(ps == null) {
//	ps = spawn('arecord', ['-D', 'plughw:1,0', '-f', 'dat']);

//	ps.stdout.pipe(audio);
//	ps.stderr.pipe(info);
//    }
//};

//var stop = function() {
//    if(ps) {
//	ps.kill();
//	ps = null;
//    }
//};

//audio.on('data', function(data) {
//    raw2db.stdin.write(
//    process.stdout.write(data);
//});

//start();


//exports.audioStream = audio;
//exports.infoStream = info;
//exports.startCapture = start;
//exports.stopCapture = stop;
