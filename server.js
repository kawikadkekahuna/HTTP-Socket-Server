var PORT = 8080;
var fs = require('fs');
var net = require('net');
var stream = require('stream');
var EventEmitter = require('events');
var SOCKET_CONNECTED = 'connection';
var SOCKET_CLOSE = 'close';
var SOCKET_ERROR = 'error';
var SOCKET_CHUNK = 'data';
var HTTP_OKAY_CODE = 200;
var HTTP_OK = 'OK';

function clientConnected(socket) {
  socket.setEncoding('utf8');

  socket.on(SOCKET_CHUNK, function(chunk) {
    var checkRequest = /^\w+/g.exec(chunk);

    switch (checkRequest[0]) {

      case 'GET':
        console.log(chunk);

        break;

      case 'HEAD':
        generateHeadResponse(chunk);
        break;
    }
  });



  function generateHeadResponse(chunk) {
    var HTTP_SERVER_STATUS = /\HTTP\/\d.+/g.exec(chunk)+' '+HTTP_OKAY_CODE+' ' + HTTP_OK;
    var DESTINATION = /\/\D\w+.html/g.exec(chunk) || '/';
    var TIMESTAMP = 'Date: '+ new Date().toUTCString();
    var SERVER_NAME = 'Server: Kawika\'s Server 1.0';
    var CONTENT_TYPE = 'text/html; charset=utf-8'
    var CONNECTION_STATUS = 'Connection: closed';
    var CONTENT_LENGTH;
    var test;
    fs.readFile('index.html', function(err, data) {
      if (err) {
        throw err;
      }
      CONTENT_LENGTH = 'Content Length: ' + Number(data.toString().length);
      console.log(CONTENT_LENGTH);
      test = CONTENT_LENGTH;

    });
    process.stdout.write(HTTP_SERVER_STATUS+'\n');
    // process.stdout.write(DESTINATION[0]+'\n');
    process.stdout.write(TIMESTAMP+'\n');
    process.stdout.write(SERVER_NAME+'\n');
    process.stdout.write(CONNECTION_STATUS+'\n');
    // process.stdout.write(CONTENT_LENGTH);
     console.log('CONTENT_LENGTH',test); 
  }
}


var server = net.createServer(clientConnected);

server.listen(PORT, function() {
});

server.on(SOCKET_CONNECTED, function(socket) {
});