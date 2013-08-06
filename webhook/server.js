var http      = require('http');

var closeWithStatusCode = function(res, status) {
  res.writeHead(status, {'Content-Type': 'application/json'});
  res.end('{}');
};

var parseBody = function(req, callback){
  var buffer = '';
  req.on("data", function(chunk){
    buffer += chunk;
  });
  req.on("end", function(){
    callback(JSON.stringify(buffer.toString()));
  });
}

http.createServer(function (req, res) {
  if(/\/mirror/.test(req.url)) {
    if(req.method !== "POST") {
      closeWithStatusCode(res, 405);
    } else {
      parseBody(req, function(body){
        console.log(body);
      });
      closeWithStatusCode(res, 201);
    }
  } else {
    closeWithStatusCode(res, 404);
  }
}).listen(process.env.PORT || 8080);
