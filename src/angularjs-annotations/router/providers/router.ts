
import {Inject,Service} from "angularjs-annotations/core/decorators"
import {IRouteDefinition} from "angularjs-annotations/router/metadata/route.config.metadata";

export interface IRoute extends angular.ui.IState {
    $$routeDefinition?: IRouteDefinition
}

@Service()
export class Router {
    @Inject("$state")
    private _state: angular.ui.IStateService;
    
    get routes(): Array<IRoute>{
        return this._state.get() as IRoute[];
    }
    
    navigate(stateName: string, params?: {}, options?: angular.ui.IStateOptions){
        this._state.go(stateName, params, options);
    }
}