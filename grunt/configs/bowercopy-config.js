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
                "angular/ui-router-extras.js": "ui-router-extras/release/ct-ui-router-extras.js",
                "ocLazyLoad.js": "oclazyload/dist/ocLazyLoad.js",
                "angular/angular-aria.js": "angular-aria/angular-aria.min.js",
                "angular/angular-animate.js": "angular-animate/angular-animate.min.js",
                "angular/angular-messages.js": "angular-messages/angular-messages.min.js",
                "angular/angular-material.js": "angular-material/angular-material.min.js",
            }
        },
        src_demo:{
            options:{
                srcPrefix: "<%= srcFolder %>",
                destPrefix: "<%= demoFolder %>/src"
            },
            src: "**/*.ts"
        },
        css: {
            options: {
                destPrefix: "<%= demoFolder %>/css"
            },
            files: {
                "angular-material.css": "angular-material/angular-material.css",
            }
        }
    }
}