import {Class} from "angularjs-annotations/core/types"
import {METADATA_KEY} from "angularjs-annotations/core/decorators.utils"
import {ComponentMetadata} from "angularjs-annotations/core/metadata/component.metadata"
import {Directive, Input, Inject,Service} from "angularjs-annotations/core/decorators"
import {compile} from "angularjs-annotations/platform/browser"
import {IAsyncLoader, IRouteDefinition} from "angularjs-annotations/router/metadata/route.config.metadata";

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
    route: IRouteDefinition;
    
    link(scope: angular.IScope, element: angular.IAugmentedJQuery, attributes: angular.IAttributes){
        if (!this.route || !this.route.loader){
            return;
        }
        
        // if route already loaded => rebind the template
        if (this.route.loader.loadedTemplate){
            return;
        }
        
        // load the component by its path and potential name.
        this.load().then(component => {
            let metadatas = Reflect.getMetadata(METADATA_KEY, component);
            let metadata = _.find(metadatas, (metadata) => metadata instanceof ComponentMetadata) as ComponentMetadata;
            if (!metadata) {
                throw new TypeError("This route object is not a component. Route: " + this.route.loader.path );
            }
            
            let newModuleName = compile(component, this.route.loader.deps || []).name;
            
            this._ocLazyLoad.inject(newModuleName).then(data => {
                this.route.loader.loadedTemplate = "<" + metadata.selector + "></" + metadata.selector + ">";
                let componentElement = angular.element(this.route.loader.loadedTemplate);
                this._compile(componentElement)(scope);
                element.replaceWith(componentElement);
            });
        })    
    }
    
    /**
     * Load a component by its path and name with requirejs.
     * @method
     */
    load(): angular.IPromise<Class> {
        var defer = this._q.defer();
        require([this.route.loader.path], (component:any) => {
            defer.resolve(this.route.loader.name ? component[this.route.loader.name] : component);
        });
        
        return defer.promise;
    }
}