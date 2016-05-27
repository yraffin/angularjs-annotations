import {Inject} from "angularjs-annotations/core";

export class LazyLoadRun {

    @Inject("$rootScope")
    private _rootScope: angular.IRootScopeService;
    
    @Inject("$q")
    private _q: angular.IQService;
    
    @Inject("$state")
    private _state: angular.ui.IStateService;

    constructor() {
        this.initialize();
    }

    initialize() {
        this.manageStateNotFound();
    }

    manageStateNotFound() {
        this._rootScope.$on("$stateNotFound", (
            event: angular.IAngularEvent,
            unfoundState: angular.ui.IUnfoundState,
            fromState: angular.ui.IState,
            fromParams: {}
        ) => {
            event.preventDefault();
            // do your module load
            // ... and then transitionTo
            this._state.transitionTo(unfoundState.to, unfoundState.toParams, unfoundState.options);
        });
    }
}