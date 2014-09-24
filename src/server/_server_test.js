"use strict";

var server = require("./server.js");
var http = require("http");
var fs = require("fs");

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
            server.stop(function(){
                test.done();
            });
        });
    });
};

exports.test_ServerServesAFile = function(test){
    var testDir = "generated/test";
    var testFile = testDir + "/test.html";
    fs.writeFileSync(testFile, "Hello World");

    test.done();
};

exports.test_ServerRequiresPortNumber = function(test){
    test.throws(function(){
        server.start();
    });
    test.done();
};

exports.test_ServerRunsCallbackWhenStopped = function(test){
    server.start(8080);
    server.stop(function(){
        test.done();
    });
};

exports.test_CallingStopWhileServerNotRunningThrows = function(test){
    test.throws(function(){
        server.stop();
    });
    test.done();
};