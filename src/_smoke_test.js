(function(){

    "use strict";

    var child_process = require("child_process");
    var http = require("http");

    exports.smoke = function(test){
        runServer(function(){
            console.log("server up");
            httpGet("http://localhost:8080", function(){
                console.log("got page");
                test.done();
            });
        });
    };

    function runServer(callback){
        var child = child_process.spawn("node", ["src/server/weewikipaint", "8080"]);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function(chunk){
            console.log("server stdout: " + chunk);
            if (chunk.trim() === "Server started"){
                callback();
            }
        });
        child.stderr.on("data", function(chunk){
            console.log("server stderr: " + chunk);
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
