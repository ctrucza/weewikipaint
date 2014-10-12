(function(){
   "use strict";

    var server = require("./server.js");
    var port = process.argv[2];
    var CONTENT_DIR = "src/server/content";
    server.start(CONTENT_DIR + "/homepage.html", CONTENT_DIR + "/404.html", port, function(){
        console.log("Server started");
    });
}());