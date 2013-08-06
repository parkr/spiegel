var http = require('http');
var exec = require('child_process').exec;
var fs   = require('fs');

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
    if (buffer[0] !== "{") {
      buffer = decodeURIComponent(buffer);
    }
    if(/^payload=/.test(buffer)) {
      buffer = buffer.substring(8);
    }
    try {
      callback(null, JSON.parse(buffer));
    } catch(e) {
      callback(e);
    }
  });
};

var gitPull = function(errors, path, url){
  console.log("pulling " + url + " to " + path);
  exec("git pull", {cwd: path}, function(error, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.warn('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
};

var gitClone = function(path, url, callback){
  if(!fs.existsSync(path)) {
    console.log("creating " + path);
    fs.mkdirSync(path);

    var command = "git clone " + url + " " + path;
    console.log("cloning " + url + " into " + path);
    exec(command, function(error, stdout, stderr){
      console.log('stdout: ' + stdout);
      console.warn('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      } else {
        callback(null, path, url);
      }
    });
  } else {
    console.log(path + " already exists.");
    callback(null, path, url);
  }
};

http.createServer(function (req, res) {
  if(/\/mirror/.test(req.url)) {
    if(req.method !== "POST") {
      closeWithStatusCode(res, 405);
    } else {
      parseBody(req, function(error, body){
        if(!error){
          console.log(JSON.stringify(body, null, 2));
          var name = body.repository.name;
          var git  = "git@github.com:" + body.repository.owner.name + "/" + name + ".git";
          var path = "/home/ubuntu/" + name;
          console.log("going to try to clone. here goes!");
          gitClone(path, git, gitPull);
        } else {
          console.log(error);
        }
      });
      closeWithStatusCode(res, 201);
    }
  } else {
    closeWithStatusCode(res, 404);
  }
}).listen(process.env.PORT || 8080);
