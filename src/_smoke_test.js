(function(){

    "use strict";

    var child_process = require("child_process");

    exports.smoke = function(test){
        var command = "node weewikipaint 8080";
        child_process.exec(command, function(error, stdout, stderr){
            if (error !== null) {
                console.log(error);
                console.log(stdout);
                console.log(stderr);
                throw error;
            }
            console.log("exec");
            test.done();
        });
    };

    function runProcess(command){

    }

}());
