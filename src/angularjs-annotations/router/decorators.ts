import {RouteConfigMetadata,IRouteDefinition} from "angularjs-annotations/router/metadata/route.config.metadata"
import {Class} from "angularjs-annotations/core/types"
import {METADATA_KEY, defineMetadata, setPropertyKey} from "angularjs-annotations/core/decorators.utils"

export function RouteConfig(options: Array<IRouteDefinition>): (target: Class) => void {
    return defineMetadata(new RouteConfigMetadata(options));
}