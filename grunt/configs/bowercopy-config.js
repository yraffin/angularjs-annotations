module.exports = {
    bowercopy: {
        options: {
            srcPrefix: "bower_components"
        },
        scripts: {
            options: {
                destPrefix: "<%= demoFolder %>/vendors"
            },
            files: {
                "requirejs/require.js": "requirejs/require.js",
                "underscore-min.js": "underscore/underscore-min.js",
                "jquery.min.js": "jquery/dist/jquery.js",
                "angular/angular.min.js": "angular/angular.js",
                "reflect-metadata.js": "reflect-metadata/Reflect.js",
                "angular/angular-ui-router.min.js": "angular-ui-router/release/angular-ui-router.js",
            }
        },
        dist:{
            options:{
                srcPrefix: "<%= distFolder %>",
                destPrefix: "<%= demoFolder %>/vendors"
            },
            files: {
                "angularjs-annotations.js": "angularjs-annotations.js"
            }
        }
    }
}