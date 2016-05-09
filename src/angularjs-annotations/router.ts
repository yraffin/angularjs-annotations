import {Class} from "angularjs-annotations/core/types"

export * from "angularjs-annotations/router/decorators"

import {RouterOutlet} from "angularjs-annotations/router/directives/router.outlet"
import {RequireLoader} from "angularjs-annotations/router/directives/require.loader"
import {RouterLink} from "angularjs-annotations/router/directives/router.link"
import {Router} from "angularjs-annotations/router/providers/router"
export{Router};
export const ROUTER_DIRECTIVES: Array<Class> = [RouterOutlet, RequireLoader,RouterLink];
export const ROUTER_PROVIDERS: Array<Class> = [Router];