var http      = require('http');

var closeWithStatusCode = function(res, status) {
  res.writeHead(status, {'Content-Type': 'application/json'});
  res.end('{}');
};

http.createServer(function (req, res) {
  if(/\/mirror/.test(req.url)) {
    if(req.method !== "POST") {
      closeWithStatusCode(res, 405);
    } else {
      console.log(req);
      closeWithStatusCode(res, 201);
    }
  } else {
    closeWithStatusCode(res, 404);
  }
}).listen(process.env.PORT || 8080);
