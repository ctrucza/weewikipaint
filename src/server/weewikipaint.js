(function(){
   "use strict";

    var server = require("./server.js");
    var port = process.argv[2];
    server.start("homepage.html", "404.html", port, function(){
        console.log("Server started");
    });
}());