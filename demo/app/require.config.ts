var requireConfig = {
    baseUrl: ".",
    urlArgs: "b=",
    paths: {
        "reflect-metadata": "vendors/reflect-metadata",
        "angular": "vendors/angular/angular.min",
        "angular-ui-router": "vendors/angular/angular-ui-router.min",
        "jquery": "vendors/jquery.min",
        "underscore": "vendors/underscore-min",
        "angularjs-annotations": "vendors/angularjs-annotations",
        "ocLazyLoad": "vendors/ocLazyLoad",
        "angular-animate": "vendors/angular/angular-animate",
        "angular-aria": "vendors/angular/angular-aria",
        "angular-messages": "vendors/angular/angular-messages",
        "angular-material": "vendors/angular/angular-material"
    },
    shim: {
        "jquery": { "exports": "jquery" },
        "angular": { "exports": "angular", deps: ["jquery"] },
        "angular-ui-router": { deps: ["angular"] },
        "ocLazyLoad": { deps: ["angular"] },
        "angularjs-annotations": { deps: ["angular-ui-router", "underscore", "reflect-metadata", "ocLazyLoad"] },
        "angular-animate": { deps: ["angular"] },
        "angular-aria": { deps: ["angular"] },
        "angular-messages": { deps: ["angular"] },
        "angular-material": {deps:["angular-animate", "angular-aria", "angular-messages"]},
        "app/main": { deps: ["angularjs-annotations", "angular-material"] },
    }
} as RequireConfig;

export { requireConfig };