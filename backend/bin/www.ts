#!/usr/bin/env node

// 모듈 가져오기
import app from '../app';
import http from 'http';

//var debug = require('debug')('portpoliosite:server');
import Debug from 'debug';
import { HttpError } from 'http-errors';
const debug = Debug('portpoliosite:server');

// 포트 설정
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// HTTP 서버 생성
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string, or false.
function normalizePort(val: string): string | number | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// HTTP 서버 에러 이벤트를 위한 리스너
function onError(error:HttpError):void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  let addr = server.address();
  if (addr === null) {
    addr = 'null';
  }

  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

  debug('Listening on ' + bind);
}
