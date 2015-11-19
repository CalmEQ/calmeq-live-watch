var io = require('socket.io')(1324);

io.on('connection', function (socket) {
    //io.emit('this', { will: 'be received by everyone'});

    socket.on('connection', function(socket) {
	console.log('Somone connected');
    });

    socket.on( 'noiselvl', function( db ) {
	console.log( 'recieved noise level ' + db );
    }); 
    //socket.on('private message', function (from, msg) {
	//console.log('I received a private message by ', from, ' saying ', msg);
    //});

    socket.on('disconnect', function () {
	io.emit('user disconnected');
    });
});
