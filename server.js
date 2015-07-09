var PORT = 8080;
var net = require('net');
var stream = require('stream');
var EventEmitter = require('events');
var SOCKET_CONNECTED = 'connection';
var SOCKET_CLOSE = 'close';
var SOCKET_ERROR = 'error';
var SOCKET_CHUNK = 'data';

function clientConnected(socket) {
  socket.setEncoding('utf8');

  socket.on(SOCKET_CHUNK, function(chunk) {
     console.log('chunk',chunk); 
    var checkRequest = /^\w+/g.exec(chunk);

    switch (checkRequest[0]) {

      case 'GET':
        console.log('get');
        break;

      case 'HEAD':
        generateHeadResponse(chunk);
        break;
    }
  });



  function generateHeadResponse(chunk) {
     console.log('chunk',chunk); 
    var HTTP_SERVER_STATUS = /\HTTP\/\d.+/g.exec(chunk);
    // var DESTINATION = 
    var TIMESTAMP = (new Date()).toJSON().split('T').join(' ');
    TIMESTAMP = TIMESTAMP.substring(0,TIMESTAMP.indexOf('.'));
    var SERVER_NAME = 'Kawika\'s Server 1.0';
    var CONNETION_STATUS = 'closed';
    // ventar CONTENT_LENGTH = 


  }
}


var server = net.createServer(clientConnected);

server.listen(PORT, function() {
  console.log('server bound');
});

server.on(SOCKET_CONNECTED, function(socket) {
  console.log('socket connected');
});