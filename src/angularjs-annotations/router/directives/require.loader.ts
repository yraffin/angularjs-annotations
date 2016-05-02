import {Class} from "angularjs-annotations/core/types"
import {METADATA_KEY} from "angularjs-annotations/core/decorators.utils"
import {ComponentMetadata} from "angularjs-annotations/core/metadata/component.metadata"
import {Directive, Input, Inject,Service} from "angularjs-annotations/core/decorators"
import {compile} from "angularjs-annotations/platform/browser"

export const REQUIRE_LOADER = "requirejs-loader";

@Directive({
    selector: REQUIRE_LOADER,
    //replace: true
})
export class RequireLoader{    
    @Inject("$compile")
    private _compile: angular.ICompileService;
    @Inject("$q")
    private _q: angular.IQService;
    
    @Input()
    loader: {path: string; name: string;};
    
    link(scope: angular.IScope, element: angular.IAugmentedJQuery, attributes: angular.IAttributes){
        if (!this.loader){
            this.loader = {
                path: attributes["path"],
                name: attributes["name"]
            };
        }
        this.load(this.loader.name, this.loader.path).then(component => {
            let metadatas = Reflect.getMetadata(METADATA_KEY, component);
            let metadata = _.find(metadatas, (metadata) => metadata instanceof ComponentMetadata) as ComponentMetadata;
            if (!metadata) {
                throw new TypeError("This route object is not a component. Route: " + this.loader.path );
            }
            
            compile(component);
            element.append(angular.element("<" + metadata.selector + "></" + metadata.selector + ">"));
        })    
    }
    
    load(name: string, path: string): angular.IPromise<Class> {
        var defer = this._q.defer();
        require([path], (component:any) => {
            defer.resolve(component[name]);
        });
        
        return defer.promise;
    }
}