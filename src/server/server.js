(function(){
    "use strict";

    var http = require("http");
    var fs = require("fs");
    var server;

    exports.start = function(homePage, notFoundPage, portNumber){
        if (!homePage) throw new Error("Home page is required");
        if (!notFoundPage) throw new Error("404 page is required");
        if (!portNumber) throw new Error("Port number is required");

        server = http.createServer();

        server.on("request", function(request, response){
            if (request.url === "/" || request.url === "/index.html")
            {
                response.statusCode = 200;
                serveFile(response, homePage);
            }
            else
            {
                response.statusCode = 404;
                serveFile(response, notFoundPage);
            }
        });

        server.listen(portNumber);
    };

    function serveFile(response, file){
        fs.readFile(file, function(err, data){
            if (err) throw err;
            response.end(data);
        });
    }

    exports.stop = function(callback){
        server.close(callback);
    };
}());
