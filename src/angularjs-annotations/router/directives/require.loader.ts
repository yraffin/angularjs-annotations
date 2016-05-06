import {Class} from "angularjs-annotations/core/types"
import {METADATA_KEY} from "angularjs-annotations/core/decorators.utils"
import {ComponentMetadata} from "angularjs-annotations/core/metadata/component.metadata"
import {Directive, Input, Inject,Service} from "angularjs-annotations/core/decorators"
import {compile} from "angularjs-annotations/platform/browser"

export const REQUIRE_LOADER = "requirejs-loader";

@Directive({
    selector: REQUIRE_LOADER
})
export class RequireLoader{    
    @Inject("$compile")
    private _compile: angular.ICompileService;
    @Inject("$q")
    private _q: angular.IQService;
    @Inject("$ocLazyLoad")
    private _ocLazyLoad: oc.ILazyLoad;
    
    @Input()
    loader: {path: string; name: string;};
    
    link(scope: angular.IScope, element: angular.IAugmentedJQuery, attributes: angular.IAttributes){
        if (!this.loader){
            this.loader = {
                path: attributes["path"],
                name: attributes["name"]
            };
        }
        this.load(this.loader.path, this.loader.name).then(component => {
            let metadatas = Reflect.getMetadata(METADATA_KEY, component);
            let metadata = _.find(metadatas, (metadata) => metadata instanceof ComponentMetadata) as ComponentMetadata;
            if (!metadata) {
                throw new TypeError("This route object is not a component. Route: " + this.loader.path );
            }
            
            let newModuleName = compile(component).name;
            
            this._ocLazyLoad.inject(newModuleName).then(data => {
                let componentElement = angular.element("<" + metadata.selector + "></" + metadata.selector + ">");
                this._compile(componentElement)(scope);
                element.replaceWith(componentElement);
            }, (reason) => {
                console.log(reason);
            });
        })    
    }
    
    load(path: string, name: string): angular.IPromise<Class> {
        var defer = this._q.defer();
        require([path], (component:any) => {
            defer.resolve(name ? component[name] : component);
        });
        
        return defer.promise;
    }
}