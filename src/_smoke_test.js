(function(){

    "use strict";

    var child_process = require("child_process");
    var http = require("http");

    var child;
    exports.setUp = function(done){
        runServer(done);
    };

    exports.tearDown = function(done){
        child.on("exit", function(code, signal){
            done();
        });
        child.kill();
    };

    exports.can_get_homepage = function(test){
        httpGet("http://localhost:8080", function(response, responseData){
            var foundHomepage = (responseData.indexOf("WeeWikiPaint homepage") !== -1);
            test.ok(foundHomepage, "homepage should contain WeeWikiPaint marker");
            test.done();
        });
    };

    exports.can_get_404_page = function(test){
        httpGet("http://localhost:8080/no_such_page.html", function(response, responseData){
            var found404Page = (responseData.indexOf("WeeWikiPaint 404 page") !== -1);
            test.ok(found404Page, "404 page should contain WeeWikiPaint marker");
            test.done();
        });
    };

    function runServer(callback){
        child = child_process.spawn("node", ["src/server/weewikipaint", "8080"]);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function(chunk){
            if (chunk.trim() === "Server started"){
                callback();
            }
        });
    }

    function httpGet(url, callback)
    {
        var request = http.get(url);
        var responseData = "";
        request.on("response", function(response){
            response.setEncoding("utf8");

            response.on("data", function(chunk){
                responseData += chunk;
            });
            response.on("end", function(){
                callback(response, responseData);
            });
        });
    }

}());
