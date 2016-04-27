import {Class} from "angularjs-annotations/core/types"

export interface IRouteDefinition {
    path: string;
    name: string;
    component?: Class;
    useAsDefault?: boolean;
    loader?: angular.IPromise<Function>;
    lazyLoad?: boolean;
}


export class RouteConfigMetadata {
    constructor(public data: Array<IRouteDefinition>) {
        // if loader defined => lazy loading
        _.filter(data, item => !!item.loader).forEach(item => item.lazyLoad = true);

        // if component defined => no lazy loading
        _.filter(data, item => !!item.component).forEach(item => item.lazyLoad = false);
    }
}