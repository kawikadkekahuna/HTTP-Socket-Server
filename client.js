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
var tmp;

var socket = net.createConnection({
  port: PORT
});

socket.on(SOCKET_CONNECT, function() {

  process.argv.forEach(function(val, index, array) {
    grabRequestedType = /(-h\b|-b\b)/g.exec(val);
    grabRequestedFile = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/.exec(val);
    if (grabRequestedType) {
      SOCKET_REQUEST_TYPE = grabRequestedType;
    }

    if (grabRequestedFile && grabRequestedFile[0] !== 'client.js') {
      SOCKET_REQUESTED_FILE = grabRequestedFile[0];
    }

  });

  SOCKET_REQUESTED_FILE = SOCKET_REQUESTED_FILE || 'index.html';

  console.log('SOCKET_REQUESTED_FILE', SOCKET_REQUESTED_FILE);
  console.log('SOCKET_REQUEST_TYPE', SOCKET_REQUEST_TYPE);
  // if (!SOCKET_REQUESTED_FILE) {
  //   SOCKET_REQUESTED_FILE = 'index.html';
  // } else {
  //   SOCKET_REQUESTED_FILE = SOCKET_REQUESTED_FILE[0];
  // }

  // if (!SOCKET_REQUEST_TYPE) {
  //   SOCKET_REQUEST_TYPE = 'ALL';
  // } else {

  // }


  socket.destroy();

});

socket.on(SOCKET_DISCONNET, function() {})

socket.on(SOCKET_RECEIVE_DATA, function(chunk) {
  // console.log('chunk', chunk); NO DATA SHOULD BE SENT
  console.log('should not hit');
  console.log('chunk', chunk);
});

// socket.listen