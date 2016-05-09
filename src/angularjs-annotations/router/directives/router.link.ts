import {Directive, Input} from "angularjs-annotations/core/decorators"

@Directive({
    selector: "[router-link]"
})
export class RouterLink {
    @Input("@routerLink")
    _link: any;
    
    link(scope: angular.IScope, element: angular.IAugmentedJQuery, attributes: angular.IAttributes){
        console.log(this._link);
    }
}
