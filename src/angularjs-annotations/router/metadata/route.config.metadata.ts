import {Class} from "angularjs-annotations/core/types"

export interface IAsyncLoader{
    path: string;
    name?: string;
    deps?: Array<string>
}

export interface IRouteDefinition {
    path: string;
    name: string;
    component?: Class;
    useAsDefault?: boolean;
    loader?: IAsyncLoader;
}


export class RouteConfigMetadata {
    constructor(public data: Array<IRouteDefinition>) {
        if (_.any(data, item => !item.loader && !item.component)){
            throw new TypeError("Either component or loader method should be defined in a route definition.");            
        }
    }
}