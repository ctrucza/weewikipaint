"use strict";

var server = require("./server.js");
var http = require("http");
var fs = require("fs");

var TEST_FILE = "generated/test/test.html";

exports.test_serverServesAFile = function(test){
    var testData = "This is served from a static file";

    fs.writeFileSync(TEST_FILE, testData);

    server.start(TEST_FILE, 8080);
    var request = http.get("http://localhost:8080");
    request.on("response", function(response){
        response.setEncoding("utf8");
        var responseReceived = false;

        test.equals(200, response.statusCode);
        response.on("data", function(chunk){
            test.equals(testData, chunk, "expected Hello World!");
            responseReceived = true;
        });
        response.on("end", function(){
            test.ok(responseReceived, "should have received data");
            server.stop(function(){
                // TODO: this should be run even if the code above fails.
                fs.unlinkSync(TEST_FILE);
                test.ok(!fs.existsSync(TEST_FILE), "file should have been deleted");
                test.done();
            });
        });
    });
};

exports.test_serverNeedsFileToServe = function(test){
    test.throws(function(){
        server.start();
    });
    test.done();
};

exports.test_serverRequiresPortNumber = function(test){
    test.throws(function(){
        server.start(TEST_FILE);
    });
    test.done();
};

exports.test_serverRunsCallbackWhenStopped = function(test){
    server.start(TEST_FILE, 8080);
    server.stop(function(){
        test.done();
    });
};

exports.test_callingStopWhileServerNotRunningThrows = function(test){
    test.throws(function(){
        server.stop();
    });
    test.done();
};