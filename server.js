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
    var requestedFile = /\/\D\w+.html/g.exec(chunk) || 'index.html';
    if (requestedFile !== 'index.html') {

      requestedFile = requestedFile[0].replace('/', '');
    }

    switch (checkRequest[0]) {

      case 'GET':
        generateBodyReponse(chunk, requestedFile);

        break;

      case 'HEAD':
        generateHeadResponse(chunk, requestedFile);
        break;
    }
  });



  function generateHeadResponse(chunk, requestedFile) {
    try {

      var HTTP_SERVER_STATUS = /\HTTP\/\d.+/g.exec(chunk) + ' ' + HTTP_OKAY_CODE + ' ' + HTTP_OK;
      var TIMESTAMP = 'Date: ' + new Date().toUTCString();
      var SERVER_NAME = 'Server: Kawika\'s Server 1.0';
      var CONTENT_TYPE = 'Content-Type:  text/html; charset=utf-8'
      var CONTENT_LENGTH = 'Content-Length: ' + fs.readFileSync(requestedFile, 'utf8').length;
      var CONNECTION_STATUS = 'Connection: closed';


      socket.write(HTTP_SERVER_STATUS + '\n');
      socket.write(SERVER_NAME + '\n');
      socket.write(TIMESTAMP + '\n');
      socket.write(CONTENT_LENGTH.toString() + '\n');
      socket.write(CONTENT_TYPE + '\n');
      socket.write(CONNECTION_STATUS + '\n');
      socket.destroy();

    } catch (err) {
      socket.write('File not found! ');
      socket.destroy();
    }

  }

  function generateBodyReponse(chunk, requestedFile) {
    try{
    var BODY = fs.readFileSync(requestedFile, 'utf8');
    socket.write(BODY);
    socket.destroy();
      
    }catch (err){
      socket.write('File not found!');
      socket.destroy();
    }
  }
}


var server = net.createServer(clientConnected);

server.listen(PORT, function() {});

server.on(SOCKET_CONNECTED, function(socket) {});