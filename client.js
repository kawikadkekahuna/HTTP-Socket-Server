var PORT = 8080;
var net = require('net');
var stream = require('stream');
var EventEmitter = require('events');
//////////////EVENTS////////////////
var SOCKET_CONNECT = 'connect';
var SOCKET_DISCONNET = 'disconnect'
var SOCKET_RECEIVE_DATA = 'data';
var SOCKET_GET = 'get';
var SOCKET_POST = 'post';
var SOCKET_PUT = 'put';
var SOCKET_DELETE = 'delete';
var SOCKET_HEAD = 'head';
var SOCKET_OPTIONS = 'options';


var socket = net.createConnection({
  port: PORT
});

socket.on(SOCKET_CONNECT, function(request) {
  console.log('socket connected');
});

socket.on(SOCKET_DISCONNET, function() {
  console.log('socket disconnected');
})

socket.on(SOCKET_RECEIVE_DATA, function(chunk) {
  console.log('chunk', chunk);
});

// socket.listen