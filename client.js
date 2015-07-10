var PORT = 8080;
var net = require('net');
var stream = require('stream');
var EventEmitter = require('events');
//////////////EVENTS////////////////
var SOCKET_CONNECT = 'connect';
var SOCKET_DISCONNET = 'disconnect'
var SOCKET_RECEIVE_DATA = 'data';
var SOCKET_REQUESTED_FILE;
var SOCKET_REQUEST_TYPE;
var SOCKET_HOST_NAME;

var socket = net.createConnection({
  port: PORT
});

socket.on(SOCKET_CONNECT, function() {

  process.argv.forEach(function(val, index, array) {
    var grabHost = /(\bl\w+:\d+\/)/g.exec(val);
    var grabRequestedType = /(-h\b|-b\b)/g.exec(val);
    var grabRequestedFile = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/.exec(val);
    if (grabRequestedType) {
      SOCKET_REQUEST_TYPE = grabRequestedType;
    }

    if (grabRequestedFile && grabRequestedFile[0] !== 'client.js') {
      SOCKET_REQUESTED_FILE = grabRequestedFile[0];
    }

    if(grabHost){
      SOCKET_HOST_NAME = grabHost[0]
    }

  });


  SOCKET_REQUESTED_FILE = SOCKET_REQUESTED_FILE || '/';
  if (!SOCKET_REQUEST_TYPE) {
    SOCKET_REQUEST_TYPE = '-b';
  } else {
    SOCKET_REQUEST_TYPE = SOCKET_REQUEST_TYPE[0];
  }

  switch (SOCKET_REQUEST_TYPE) {

    case '-h':
      generateHeadRequest(SOCKET_REQUESTED_FILE);
      break;

    case '-b':
      generateBodyRequest(SOCKET_REQUESTED_FILE);
      break;


  }


});

function generateHeadRequest(requestedFile) {
  var http_status = 'HEAD ' + requestedFile + ' HTTP/1.1'
  var host_name = 'Host: ' + SOCKET_HOST_NAME;
  var user_agent = 'User Agent: Kawika\'s Curler/1.0';
  var accept_status = '*/*';
  socket.write(http_status+'\n');
  socket.write(host_name+'\n');
  socket.write(user_agent+'\n');
  socket.write(accept_status+'\n');
}

function generateBodyRequest(requestedFile) {
  var http_status = 'GET ' + requestedFile + ' HTTP/1.1'
  var host_name = 'Host: ' + SOCKET_HOST_NAME;
  var user_agent = 'User Agent: Kawika\'s Curler/1.0';
  var accept_status = '*/*';
  socket.write(http_status+'\n');
  socket.write(host_name+'\n');
  socket.write(user_agent+'\n');
  socket.write(accept_status+'\n');
}




socket.on(SOCKET_DISCONNET, function() {})

socket.on(SOCKET_RECEIVE_DATA, function(chunk) {
  // console.log('chunk', chunk); NO DATA SHOULD BE SENT
  process.stdout.write(chunk);
});

// socket.listen