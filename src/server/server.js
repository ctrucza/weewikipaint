"use strict";

var http = require("http");

exports.start = function(){
    var server = http.createServer();

    server.on("request", function(request, response){
        response.end("Hello World!");
    });

    server.listen(8080);
};