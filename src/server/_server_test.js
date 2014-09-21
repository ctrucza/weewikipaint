"use strict";

var server = require("./server.js");
var http = require("http");

exports.tearDown = function(callback){
    server.stop();
    callback();
};

exports.test_ServerReturnsHelloWorld = function(test){
    server.start(8080);

    var request = http.get("http://localhost:8080");
    request.on("response", function(response){
        response.setEncoding("utf8");
        var responseReceived = false;

        test.equals(200, response.statusCode);
        response.on("data", function(chunk){
            test.equals("Hello World", chunk, "expected Hello World!");
            responseReceived = true;
        });
        response.on("end", function(){
            test.ok(responseReceived, "should have received data");
            test.done();
        });
    });
};
