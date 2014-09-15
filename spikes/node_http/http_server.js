var http = require("http");

var server = http.createServer();

server.on("request", function(request, response){
    console.log("Request received");
    var body = "Hello World!";
    response.end(body);
    console.log("Response sent");
});

server.listen(8080);
console.log("Server started")