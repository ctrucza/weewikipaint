(function(){
   "use strict";

    var server = require("./server.js");
    server.start("homepage.html", "404.html", 8080, function(){
        console.log("Server started");
    });
}());