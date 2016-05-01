import {Class} from "angularjs-annotations/core/types"

export * from "angularjs-annotations/router/decorators"

import {RouterOutlet} from "angularjs-annotations/router/directives/router.outlet"
import {Router} from "angularjs-annotations/router/providers/router"
export{Router};
export const ROUTER_DIRECTIVES: Array<Class> = [RouterOutlet];
export const ROUTER_PROVIDERS: Array<Class> = [Router];