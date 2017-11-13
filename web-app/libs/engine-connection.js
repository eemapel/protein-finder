/*jshint sub:true*/

var http = require('http');
var request = require('request');
var portfinder = require('portfinder');
var enableDestroy = require('server-destroy');
var qs = require('querystring');

var Sequence = require('../models/sequence');

// Run custom server for each sequence query
module.exports.connectionManager = function(username, query, callback) {

  // Find open port on range 8000 ->
  portfinder.getPort(function (err, port) {
    if (err) throw err;

    var server = http.createServer();

    server.listen(port, function() {
      enableDestroy(server);
      console.log("Opening connection to bio-engine at port", port);
      request({
          url: "http://bio-engine:7000",
          method: "POST",
          body: { "port": port, "sequence": query.toUpperCase() },
          json: true
        }, function(error, response, body) {
          if(error) {
            console.log("Something went wrong..", error);
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

          var newSequence = new Sequence({
            username: username,
            query: query.toUpperCase(),
            protein: qs.parse(data)["reply"]
          });

          Sequence.createRecord(newSequence, function(err, sequence) {
            if (err) throw err;
            console.log("New sequence created:", sequence);
          });

        } else if (req.method == "DELETE") {
          console.log("Delete received!");
          server.destroy();
          callback();
        }
      });
    });
  });
};

