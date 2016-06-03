import {Inject} from "angularjs-annotations/core";

export class LazyLoadRun {

    @Inject("$rootScope")
    private _rootScope: angular.IRootScopeService;
    
    @Inject("$q")
    private _q: angular.IQService;
    
    @Inject("$urlRouter")
    private _urlRouter: angular.ui.IUrlRouterService;
    
    @Inject("$state")
    private _state: angular.ui.IStateService;

    constructor() {
        this.initialize();
    }

    initialize() {
        this.manageLocationNotFound();
    }

    manageLocationNotFound() {
        this._rootScope.$on("$locationChangeStart", (event: angular.IAngularEvent) => {
            // event.preventDefault();
            // // find lazy states
            // let lazyStates = this._state.get().filter((state:any) => state.$$routeDefinition && !state.$$routeDefinition.component && state.$$routeDefinition.loader);
            // console.log(lazyStates);
            
            // // ... and then resync with router
            // this._urlRouter.sync();
        });
    }
}