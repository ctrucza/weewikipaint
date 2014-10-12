(function(){

    "use strict";

    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");
    var assert = require("assert");

    var TEST_HOME_PAGE = "generated/test/test.html";
    var TEST_404_PAGE = "generated/test/test_404.html";
    var TEST_HOME_PAGE_DATA = "This is the home page";
    var TEST_404_PAGE_DATA = "This is the 404 page";

    exports.setUp = function(done){
        fs.writeFileSync(TEST_HOME_PAGE, TEST_HOME_PAGE_DATA);
        fs.writeFileSync(TEST_404_PAGE, TEST_404_PAGE_DATA);
        done();
    };

    exports.tearDown = function(done){
        cleanUpFile(TEST_HOME_PAGE);
        cleanUpFile(TEST_404_PAGE);
        done();
    };

    exports.serves_home_page_from_file = function(test){
        httpGet("http://localhost:8080", function(response, responseData){
            test.equals(200, response.statusCode);
            test.equals(TEST_HOME_PAGE_DATA, responseData, "expected Hello World!");
            test.done();
        });
    };

    exports.returns_home_page_when_asked_for_index = function(test){
        httpGet("http://localhost:8080/index.html", function(response, responseData){
            test.equals(200, response.statusCode);
            test.equals(TEST_HOME_PAGE_DATA, responseData, "expected home page content");
            test.done();
        });
    };

    exports.returns_404_for_everything_except_home_page = function(test){
        httpGet("http://localhost:8080/noSuchPage", function(response, responseData){
            test.equals(404, response.statusCode);
            test.equals(TEST_404_PAGE_DATA, responseData, "expected 404 page content");
            test.done();
        });
    };

    exports.requires_home_page_parameter = function(test){
        test.throws(function(){
            server.start();
        });
        test.done();
    };

    exports.requires_404_page_parameter = function(test){
        test.throws(function(){
            server.start(TEST_HOME_PAGE);
        });
        test.done();
    };

    exports.requires_port_parameter = function(test){
        test.throws(function(){
            server.start(TEST_HOME_PAGE, TEST_404_PAGE);
        });
        test.done();
    };

    exports.stop_runs_callback = function(test){
        server.start(TEST_HOME_PAGE, TEST_404_PAGE, 8080);
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
        server.start(TEST_HOME_PAGE, TEST_404_PAGE, 8080, function(){
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
        });
    }

    function cleanUpFile(fileName){
        fs.unlinkSync(fileName);
        assert.ok(!fs.existsSync(fileName));
    }

}());
