(function(){

    "use strict";

    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");
    var assert = require("assert");

    var TEST_FILE = "generated/test/test.html";

    exports.tearDown = function(done)
    {
        if (fs.existsSync(TEST_FILE)){
            fs.unlinkSync(TEST_FILE);
            assert.ok(!fs.existsSync(TEST_FILE));
        }
        done();
    };

    exports.test_serverServesHomePageFromFile = function(test){
        var testData = "This is served from a static file";

        fs.writeFileSync(TEST_FILE, testData);

        httpGet("http://localhost:8080", function(response, responseData){
            test.equals(200, response.statusCode);
            test.equals(testData, responseData, "expected Hello World!");
            test.done();
        });
    };

    exports.test_serverReturnsHomePageWhenAskedForIndex = function(test){
        var testData = "This is served from a static file";

        fs.writeFileSync(TEST_FILE, testData);

        httpGet("http://localhost:8080/index.html", function(response, responseData){
            test.equals(200, response.statusCode);
            test.equals(testData, responseData, "expected Hello World!");
            test.done();
        });
    };

    exports.test_serverReturns404ForEverythingExceptHomePage = function(test){
        httpGet("http://localhost:8080/noSuchPage", function(response, responseData){
            test.equals(404, response.statusCode);
            test.done();
        });
    };

    function httpGet(url, callback)
    {
        server.start(TEST_FILE, 8080);
        var request = http.get(url);
        var responseData = "";
        request.on("response", function(response){
            response.setEncoding("utf8");

            response.on("data", function(chunk){
                responseData += chunk;
            });
            response.on("end", function(){
                server.stop(function(){
                    callback(response, responseData);
                });
            });
        });
    }

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
}());
