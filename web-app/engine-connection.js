#!/usr/bin/env node

var http = require('http');
var request = require('request');
var portfinder = require('portfinder');
var enableDestroy = require('server-destroy');
var qs = require('querystring');

// Run custom server for each sequence query
function runTemporaryServer() {
  // Find open port on range 8000 ->
  portfinder.getPort(function (err, port) {
    if (err) throw err;

    var server = http.createServer();

    server.listen(port, function() {
      enableDestroy(server);
      console.log("Opening connection to bio-engine at port", port);
      request({
          url: "http://localhost:3000",
          method: "POST",
          body: { "port": port, "sequence": "ABCD" },
          json: true
        }, function(error, response, body) {
          if(error) {
            console.log("Something went wrong..");
          }
        }
      );
    });
 
    server.on('request', function (req, res) {
      var data = '';
      req.on('data', function (chunk) {      
        if (req.method == "PUT") {
          data += chunk;
        }
      });
      
      req.on('end', function () {
        res.end();
        if (req.method == "PUT") {
          console.log(qs.parse(data));
        } else if (req.method == "DELETE") {
          console.log("Delete received!");
          server.destroy();
        }
      });
    });
  });
}

runTemporaryServer();
runTemporaryServer();