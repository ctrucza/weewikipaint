(function(){

    "use strict";

    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");
    var assert = require("assert");

    var TEST_FILE = "generated/test/test.html";
    var TEST_DATA = "This is served from a static file";

    exports.setUp = function(done){
        fs.writeFileSync(TEST_FILE, TEST_DATA);
        done();
    };

    exports.tearDown = function(done){
        fs.unlinkSync(TEST_FILE);
        assert.ok(!fs.existsSync(TEST_FILE));
        done();
    };

    exports.serves_home_page_from_file = function(test){
        httpGet("http://localhost:8080", function(response, responseData){
            test.equals(200, response.statusCode);
            test.equals(TEST_DATA, responseData, "expected Hello World!");
            test.done();
        });
    };

    exports.returns_home_page_when_asked_for_index = function(test){
        httpGet("http://localhost:8080/index.html", function(response, responseData){
            test.equals(200, response.statusCode);
            test.equals(TEST_DATA, responseData, "expected Hello World!");
            test.done();
        });
    };

    exports.returns_404_for_everything_except_home_page = function(test){
        httpGet("http://localhost:8080/noSuchPage", function(response, responseData){
            test.equals(404, response.statusCode);
            test.done();
        });
    };

    exports.requires_file_to_serve = function(test){
        test.throws(function(){
            server.start();
        });
        test.done();
    };

    exports.requires_port_number = function(test){
        test.throws(function(){
            server.start(TEST_FILE);
        });
        test.done();
    };

    exports.stop_runs_callback = function(test){
        server.start(TEST_FILE, 8080);
        server.stop(function(){
            test.done();
        });
    };

    exports.stop_throws_if_not_running = function(test){
        test.throws(function(){
            server.stop();
        });
        test.done();
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
}());
