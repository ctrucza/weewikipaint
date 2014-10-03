(function(){

    "use strict";

    var child_process = require("child_process");
    var http = require("http");

    exports.smoke = function(test){
        var command = ["src/server/weewikipaint 8080"];
        runServer(command, function(response, responseData){
            console.log("server up");
            setTimeout(function(){
                httpGet("http://localhost:8080", function(){
                    console.log("got page");
                    test.done();
                });
            }, 100000);
        });
    };

    function runServer(nodeArgs, callback){
        console.log("starting server");
        var process = child_process.spawn("node", nodeArgs);
        callback();
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
