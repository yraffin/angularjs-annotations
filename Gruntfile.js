/// <binding BeforeBuild="build" Clean="cleanApp" />
/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    var config = {
        srcFolder: "src",
        distFolder: "dist",
        tempFolder: ".tmp",
        demoFolder: "demo",
        // allows us to reference properties we declared in package.json.
        pkg: grunt.file.readJSON("package.json")
    };

    // initialize the grunt configuration
    grunt.initConfig(config);

    // add config in Tasks folder.
    require("glob").sync("*", { cwd: "grunt/configs/" }).forEach(function (config) {
        grunt.config.merge(require("./grunt/configs/" + config));
    });

    // automatically load NPM grunt tasks
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // load all custom tasks in folder "Tasks"
    //grunt.loadTasks("grunt/tasks");

    // typescript tasks
    grunt.registerTask("default", ["ts:dist"]);
    
    // launch demo
    grunt.registerTask("demo", ["ts:debug", "ts:demo", "bowercopy:scripts", "bowercopy:css", "bowercopy:src_demo", "connect:demo", "watch"]);
};