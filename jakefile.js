/*global desc, task, jake, fail, complete */
(function() {
    "use strict";

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint everything");
    task("lint", [], function(){
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        var passed = lint.validateFileList(files.toArray(), nodeLintOptions(), {});
        if (!passed)
            fail("Lint failed");
    });

    desc("Test everything");
    task("test", [], function(){
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(["test"]);
    });

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
