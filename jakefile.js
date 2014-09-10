task("default", [], function(){
   console.log("default");
});


desc("Example!");
task("example", ["dependency"], function(){
   console.log("example taks");
});

task("dependency", function(){
   console.log("dependency");
});