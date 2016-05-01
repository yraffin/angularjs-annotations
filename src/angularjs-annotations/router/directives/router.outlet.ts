import {Directive} from "angularjs-annotations/core/decorators"

@Directive({
    selector: "router-outlet",
    template: "<div ui-view></div>",
})
class RouterOutlet {
}

export {RouterOutlet}