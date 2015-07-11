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
var request = {
  GET: 'GET',
  HEAD: 'HEAD'
}

var socket = net.createConnection({
  port: PORT
});

socket.on(SOCKET_CONNECT, function() {

  processArgs();

  SOCKET_REQUESTED_FILE = SOCKET_REQUESTED_FILE || '/';
  if (!SOCKET_REQUEST_TYPE) {
    SOCKET_REQUEST_TYPE = '-b';
  } else {
    SOCKET_REQUEST_TYPE = SOCKET_REQUEST_TYPE[0];
  }

  switch (SOCKET_REQUEST_TYPE) {

    case '-h':
      generateRequest(SOCKET_REQUESTED_FILE, request.HEAD);
      break;

    case '-b':
      generateRequest(SOCKET_REQUESTED_FILE, request.GET);
      break;

  }

});

function processArgs() {
  process.argv.forEach(function(val, index, array) {
    if (/(-p)/g.exec(val)) {
      if (/\d{4}/g.exec(val)) {

        var grabPort = val;
        console.log('grabPort', grabPort);
      }
    }
    var grabHost = /(\bl\w+:\d+\/)/g.exec(val);
    var grabRequestedType = /(-h\b|-b\b)/g.exec(val);
    var grabRequestedFile = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/.exec(val);
    if (grabRequestedType) {
      SOCKET_REQUEST_TYPE = grabRequestedType;
    }

    if (grabRequestedFile && grabRequestedFile[0] !== 'client.js') {
      SOCKET_REQUESTED_FILE = grabRequestedFile[0];
    }

    if (grabHost) {
      SOCKET_HOST_NAME = grabHost[0]
    }

  });
}

function generateRequest(requestedFile, requestType) {
  var requestResponse = {
    http_status: requestType + ' ' + requestedFile + ' HTTP/1.1' + '\n',
    host_name: 'Host: ' + SOCKET_HOST_NAME + '\n',
    user_agent: 'User Agent: Kawika\'s Curler/1.0' + '\n',
    accept_status: '*/*'
  }
  for (var key in requestResponse) {
    socket.write(requestResponse[key]);
  }
}


socket.on(SOCKET_DISCONNET, function() {})

socket.on(SOCKET_RECEIVE_DATA, function(chunk) {
  // console.log('chunk', chunk); NO DATA SHOULD BE SENT
  process.stdout.write(chunk);
});

// socket.listen