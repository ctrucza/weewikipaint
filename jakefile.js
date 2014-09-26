/*global desc, task, jake, fail, complete, directory */
(function() {
    "use strict";

    var GENERATED_DIR = "generated";
    var TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";

    directory(TEMP_TESTFILE_DIR);

    desc("clean generated files");
    task("clean", [], function(){
       jake.rmRf(GENERATED_DIR);
    });

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint everything");
    task("lint", ["node"], function(){
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        var passed = lint.validateFileList(files.toArray(), nodeLintOptions(), {});
        if (!passed)
            fail("Lint failed");
    });

    desc("Test everything");
    task("test", ["node", TEMP_TESTFILE_DIR], function(){
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(["src/server/_server_test.js"], null, function(failures){
            if (failures)
                fail("failed tests");
            complete();
        });
    }, {async:true});

    desc("Integrate");
    task("integrate", ["default"], function(){
        console.log("1. make sure 'git status' is clean");
        console.log("2. Build on integration machine");
        console.log("   a. 'git pull'");
        console.log("   b. 'jake'");
        console.log("   c. if jake fails, stop!");
        console.log("3. git checkout integration");
        console.log("4. git merge master --no-ff --log");
        console.log("5. git push");
        console.log("6. git checkout master");
    });

//    desc("Ensure correct version of node is present");
    task("node", [], function(){
        var desiredNodeVersion = "v0.10.31";

        sh("node --version", function(stdout){
            if(stdout.trim() !== desiredNodeVersion) fail("Incorrect node version. " + stdout + "Expected " + desiredNodeVersion);
            complete();
        });
    }, {async:true});

    function sh(command, callback){
        //console.log("> " + command);

        var stdout = "";
        var process = jake.createExec(command, {printStdout:true, printStderr:true});
        process.on("stdout", function(chunk){
                stdout += chunk;
        });
        process.on("cmdEnd", function(){
            callback(stdout);
        });
        process.run();
    }

//        jake.exec(command, function(){
//            complete();
//        }, {printStdout:true, printStderr:true});

    function nodeLintOptions() {
        return {
            bitwise: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true,
            node: true
        };
    }
})();
