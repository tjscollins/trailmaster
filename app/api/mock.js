var http = require('http'),
  mockserver = require('mockserver');

http
  .createServer(mockserver('app/api/mocks'))
  .listen('3000');
