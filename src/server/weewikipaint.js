(function(){
   "use strict";

    console.log("weewikipaint starting");
    var server = require("./server.js");
    server.start("homepage.html", "404.html", 8080);
}());