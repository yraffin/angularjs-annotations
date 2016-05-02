var requireConfig = {
    baseUrl: ".",
    urlArgs: "b=",
    paths: {
        "reflect-metadata": "vendors/reflect-metadata",
        "angular": "vendors/angular/angular.min",
        "angular-ui-router": "vendors/angular/angular-ui-router.min",
        "jquery": "vendors/jquery.min",
        "underscore": "vendors/underscore-min",
        "angularjs-annotations": "vendors/angularjs-annotations"
    },
    shim: {
        "jquery": { "exports": "jquery" },
        "angular": { "exports": "angular", deps: ["jquery"] },
        "angular-ui-router": { deps: ["angular"] },
        "angularjs-annotations": { deps: ["angular-ui-router", "underscore", "reflect-metadata"] },
        "app/main": { deps: ["angularjs-annotations"] },
    }
} as RequireConfig;

export { requireConfig };