var PORT = 8080;
var net = require('net');
var stream = require('stream');
var EventEmitter = require('events');
//////////////EVENTS////////////////
var SOCKET_CONNECT = 'connect';
var SOCKET_DISCONNET = 'disconnect'
var SOCKET_RECEIVE_DATA = 'data';
var SOCKET_REQUESTED_FILE;


var socket = net.createConnection({
  port: PORT
});

socket.on(SOCKET_CONNECT, function(request) {
  

  process.argv.forEach(function(val, index, array) {
    SOCKET_REQUESTED_FILE = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/.exec(val);
  });
  
  SOCKET_REQUESTED_FILE = SOCKET_REQUESTED_FILE[0];
  console.log('SOCKET_REQUESTED_FILE', SOCKET_REQUESTED_FILE);

});

socket.on(SOCKET_DISCONNET, function() {
  console.log('socket disconnected');
})

socket.on(SOCKET_RECEIVE_DATA, function(chunk) {
  console.log('chunk', chunk);
});

// socket.listen