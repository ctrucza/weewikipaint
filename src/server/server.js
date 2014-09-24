"use strict";

var http = require("http");
var fs = require("fs");
var server;

exports.start = function(htmlFileToServe, portNumber){
    if (!htmlFileToServe) throw new Error("file to serve is required");
    if (!portNumber) throw new Error("port number is required");

    server = http.createServer();

    server.on("request", function(request, response){
        fs.readFile(htmlFileToServe, function(err, data){
            if (err) throw err;
            response.end(data);
        });
    });

    server.listen(portNumber);
};

exports.stop = function(callback){
    server.close(callback);
};
