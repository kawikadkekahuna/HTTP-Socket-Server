var PORT = 8080;
var fs = require('fs');
var net = require('net');
var stream = require('stream');
var EventEmitter = require('events');
var SOCKET_CONNECTED = 'connection';
var SOCKET_CLOSE = 'close';
var SOCKET_ERROR = 'error';
var SOCKET_CHUNK = 'data';
var HTTP_MODIFIED_CODE = 304;
var HTTP_OKAY_CODE = 200;
var HTTP_ERR_CODE = 404;
var HTTP_NOT_FOUND = 'Not Found';
var HTTP_OK = 'OK';
var SERVER_TIME = Date.now();

function clientConnected(socket) {
  socket.setEncoding('utf8');
  socket.on(SOCKET_CHUNK, function(chunk) {
    console.log('chunk', chunk);
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
    var modfiedCheck = /(If-Modified-Since): \w+, \d+ \w+ \d+ \d+:\d+:\d+ GMT/g.exec(chunk);

    try {
      var TIMESTAMP = 'Date: ' + new Date().toUTCString();
      var SERVER_NAME = 'Server: Kawika\'s Server 1.0';
      var CONTENT_TYPE = 'Content-Type:  text/html; charset=utf-8'
      var CONTENT_LENGTH = 'Content-Length: ' + fs.readFileSync(requestedFile, 'utf8').length;
      var CONNECTION_STATUS = 'Connection: closed';

      if (!modfiedCheck) {
        var HTTP_SERVER_STATUS = /\HTTP\/\d.+/g.exec(chunk) + ' ' + HTTP_OKAY_CODE + ' ' + HTTP_OK;
        socket.write(HTTP_SERVER_STATUS + '\n');
        socket.write(SERVER_NAME + '\n');
        socket.write(TIMESTAMP + '\n');
        socket.write(CONTENT_LENGTH.toString() + '\n');
        socket.write(CONTENT_TYPE + '\n');
        socket.write(CONNECTION_STATUS + '\n');
        // socket.write('If-Modified-Since : ' + new Date().toUTCString());
        socket.end();
      } else {
        //fix modified check
        var HTTP_SERVER_STATUS = /\HTTP\/\d.+/g.exec(chunk) + ' ' + HTTP_MODIFIED_CODE + ' ' + HTTP_OK
      }

    } catch (err) {
      var HTTP_SERVER_STATUS = /\HTTP\/\d.+/g.exec(chunk) + ' ' + HTTP_ERR_CODE + ' ' + HTTP_NOT_FOUND;
      socket.write(HTTP_SERVER_STATUS + '\n');
      socket.end();

    }

  }

  function generateBodyReponse(chunk, requestedFile) {
    try {
      var BODY = fs.readFileSync(requestedFile, 'utf8');
      socket.write(BODY);
      socket.end();

    } catch (err) {
      socket.write('File not found!');
      socket.end();
    }
  }
}


var server = net.createServer(clientConnected);

server.listen(PORT, function() {

});