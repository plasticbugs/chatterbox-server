var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var persistData = {results:[]};


exports.requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var splitURL = request.url.indexOf('?');
  if (splitURL > -1) {
    var splitURL = request.url.split('?')[0];
  } else {
    splitURL = request.url;
  }
  var statusCode = 200;

  if(splitURL !== '/classes/messages') {
    statusCode = 404;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    response.end('invalid endpoint');
  }

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  response.writeHead(statusCode, headers);


  if (request.method === 'POST' && request.url === '/classes/messages'){
    statusCode = 201;
    response.writeHead(statusCode, headers);
    var messageBody = [];
    request.on('data', function(chunk){
      messageBody.push(chunk);
    }).on('end', function(){
      messageBody = Buffer.concat(messageBody).toString();
      persistData.results.push(JSON.parse(messageBody));
      console.log(persistData);
      response.end('Message received');
    })

  }

  response.end(JSON.stringify(persistData));
};

