import {METADATA_KEY} from "angularjs-annotations/core/decorators.utils";
import {InjectableMetadata, IInjectableMetadata} from "angularjs-annotations/core/metadata/injectable.metadata";
import {InjectionMetadata, IInjectableProperty} from "angularjs-annotations/core/metadata/injection.metadata";
import {DirectiveMetadata, IDirectiveMetadata} from "angularjs-annotations/core/metadata/directive.metadata";
import {ComponentMetadata, IComponentMetadata} from "angularjs-annotations/core/metadata/component.metadata";
import {InputMetadata, IInputProperty} from "angularjs-annotations/core/metadata/input.metadata";
import {normalize, deNormalize} from "angularjs-annotations/core/core.utils"
import {RouteConfigMetadata, IRouteDefinition } from "angularjs-annotations/router/metadata/route.config.metadata";
import {RequireLoader, REQUIRE_LOADER} from "angularjs-annotations/router/directives/require.loader"
import {IRoute} from "angularjs-annotations/router/providers/router";
import {ServiceMetadata, FactoryMetadata, ProviderMetadata, FilterMetadata} from "angularjs-annotations/core/metadata/providers.metadata";
import {ConfigBlockMetadata, RunBlockMetadata,BlockMetadata, BlockType} from "angularjs-annotations/core/metadata/blocks.metadata"
import {Class} from "angularjs-annotations/core/types"

export interface IModule {
    name: string;
    add: (...providers: Array<Class>) => IModule;
    config: (config: Function | Array<any>) => IModule;
    run: (run: Function | Array<any>) => IModule;
    registerDependency: (componentModule: IModule) => void;
}

/**
 * Modules dictionary by name
 */
const __Modules: _.Dictionary<angular.IModule> = {};

var __BootstrapApplication__: IModule;

export const UI_ROUTER = "ui.router";

/**
 * Application module class
 * @class
 */
export class ApplicationModule implements IModule {
    // module routes
    private _routes: Array<IRouteDefinition> = [];
    private _registeredClass: string[] = [];

    constructor(public name: string, modules?: Array<string | IModule>) {
        let dependencies = [];
        _.each(modules || [], (item: string | IModule) => dependencies.push(_.isString(item) ? item as string : (item as IModule).name));

        let module = this._module;
        if (!module) {
            this._module = angular.module(name, dependencies);
            this.configureRouting();
        } else {
            let deps = _.difference(dependencies, module.requires || []);//module.requires.push(mockModuleName);
            module.requires = _.union(module.requires, deps);
        }
    }

    /**
     * Gets or sets the current module by its name.
     * @property {angular.IModule}
     */
    private get _module(): angular.IModule {
        return __Modules[this.name];
    }
    private set _module(value: angular.IModule) {
        __Modules[this.name] = value;
    }

    //#region ----- IModule implementations -----

    /**
     * Add a list of providers to a module.
     * @method
     * @param {Type[]} providers
     */
    add(...providers: Array<Class>): IModule {
        _.each(providers, (provider: Class) => {
            // register module config/run blocks
            this.registerBlocks(provider);
            
            // if provider is directive (or component)
            if (this.isDirective(provider)) {
                this.registerDirective(provider);
                return;
            }

            // if privider is a service
            if (this.isService(provider)) {
                this.registerService(provider);
            }
        });

        return this;
    }

    /**
     * Sets the module configuration.
     * @method
     * @param {Function|any[]} config - The module configuration to set.
     */
    config(annotatedFunction: Array<any>): IModule;
    config(configFn: Function): IModule;
    config(config: Function | Array<any>): IModule {
        if (!this._module) {
            throw new ReferenceError("The module should be define before adding configuration method");
        }

        this._module.config(config);
        return this;
    }

    /**
     * Sets the module configuration.
     * @method
     * @param {Function|any[]} initialization - The module configuration to set.
     */
    run(annotatedFunction: Array<any>): IModule;
    run(initializationFn: Function): IModule;
    run(initialization: Function | Array<any>): IModule {
        if (!this._module) {
            throw new ReferenceError("The module should be define before adding initialization method");
        }

        this._module.run(initialization as any);
        return this;
    }
    
    registerDependency(componentModule: IModule) {
        this._module.requires = this._module.requires || [];
        this._module.requires.push(componentModule.name); 
    }

    //#endregion

    //#region ----- Module registration Methods ----

    /**
     * Set a provider as registered class in module.
     * @method
     * @param {string} name - the registration name.
     */
    private setAsRegistered(name: string) {
        this._registeredClass.push(name);
    }

    /**
     * Gets a value indicating whether a provider is registered in module.
     * @method
     * @param {string} name - the registration name.
     */
    private isRegistered(name: string): boolean {
        return this._registeredClass.indexOf(name) > -1;
    }

    /**
     * Register an angular route.
     * @method
     * @param {Class} provider - The provider component.
     */
    private registerRoutes(provider: Class) {
        var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        var routeMetadata = _.find(metadatas, (metadata) => metadata instanceof RouteConfigMetadata) as RouteConfigMetadata;
        if (!routeMetadata) {
            return;
        }

        if (this._module.requires.indexOf(UI_ROUTER) === -1) {
            this._module.requires.push(UI_ROUTER);
        }

        if (_.any(routeMetadata.data, (route) => _.any(this._routes, r => r.name === route.name))) {
            throw new Error("Route definition name should be unique");
        }

        // register route components
        _.filter(routeMetadata.data, routeDef => !!routeDef.component && _.isFunction(routeDef.component)).forEach(routeDef => this.add(routeDef.component));

        this._routes = _.union(this._routes, routeMetadata.data);
    }
    
    /**
     * Register an angular config/run block for a module.
     * @method
     * @param {Class} provider - The provider class.
     */
    private registerBlocks(provider: Class){
        var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        var blocks = _.filter(metadatas, (metadata) => metadata instanceof BlockMetadata) as BlockMetadata[];
        _.each(blocks, block => {
            let annotatedFunc = this.getInlineAnnotatedFunction(block.block);
            if (block.blockType === BlockType.CONFIG){
                this.config(annotatedFunc as any);
            } else if (block.blockType === BlockType.RUN){
                this.run(annotatedFunc as any);
            } else {
                throw new TypeError("This block is not a config or run block");
            }
        })
    }

    /**
     * Register an angular directive.
     * @method
     * @param {Class} provider - The provider to register in angular module.
     */
    private registerDirective(provider: Class) {
        var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        var directiveMetadata = _.find(metadatas, (metadata) => metadata instanceof DirectiveMetadata) as DirectiveMetadata;
        if (!directiveMetadata) {
            return;
        }

        var name = directiveMetadata.getInjectionName(provider);
        if (this.isRegistered(name)) {
            // TODO: check if registration is same type or else throw error
            return;
        }

        if (!directiveMetadata.selector) {
            throw new Error("Directive selector should be define");
        }

        if (this.isComponent(provider)) {
            this.registerRoutes(provider);
        }
        
        // if input defined => add to properties
        var inputMetadata = _.find(metadatas, (metadata) => metadata instanceof InputMetadata) as InputMetadata;
        if (inputMetadata && inputMetadata.data.length > 0){
            directiveMetadata.properties = _.union(directiveMetadata.properties || [], _.map(inputMetadata.data, inputData => {                
                return inputData.propertyName + ": =" + (inputData.inputName || "");
            }));
        }

        var directive: angular.IDirective = {};
        directive.restrict = this.getDirectiveRestriction(directiveMetadata.selector.trim());
        directive.controllerAs = directiveMetadata.exportAs || name;

        // add template
        if (directiveMetadata.template) {
            directive.template = directiveMetadata.template;
        } else if (directiveMetadata.templateUrl) {
            directive.templateUrl = directiveMetadata.templateUrl;
        }

        directive.replace = directiveMetadata.replace || false;
        
        // set link function
        directive.link = this.getDirectiveLinkFunction(provider, directiveMetadata);
        
        // set compile function        
        if (provider["compile"]) {
            directive.compile = provider["compile"];
        }

        // add controller as function or inlineAnnotatedFunction
        directive.controller = this.getInlineAnnotatedFunction(provider);

        // set module directive
        this._module.directive(name, () => directive);
        this.setAsRegistered(name);

        // register linked directives and providers
        var linkedClasses = directiveMetadata.getLinkedClasses();
        if (_.isEmpty(linkedClasses)) {
            return;
        }

        _.each(linkedClasses, linkedClass => this.add(linkedClass));
    }
    
    /**
     * Gets the directive link function.
     */
    getDirectiveLinkFunction(provider:Class, metadata: DirectiveMetadata): Function{
        var controllerName = metadata.exportAs || metadata.getInjectionName(provider);
        return (scope: angular.IScope, element: angular.IAugmentedJQuery, attributes: angular.IAttributes, controllers?: any) => {
            if (scope[controllerName] && _.isFunction(scope[controllerName].link)) {
                scope[controllerName].link(scope, element, attributes, controllers);
            }
            
            // manage css for components
            scope["__styles__"] = {};
            _.each((metadata["styles"] || []) as string[], (style, index) => {
                let code = controllerName + "_style_" + index;
                scope["__styles__"][code] = this.formatStyleTag(style, code);
                
                // add style to DOM
                $(document).find("head").append(scope["__styles__"][code]);
            });
            _.each((metadata["styleUrls"] || []) as string[], (style, index) => {
                let code = controllerName + "_style_" + index;
                scope["__styles__"][code] = this.formatStyleTag(style, code, true);
                
                // add style to DOM
                $(document).find("head").append(scope["__styles__"][code]);
            });
            
            // TODO: manage scope on destroy et on init + css if on metadata
            // Manage OnDestroy implementation
            scope.$on('$destroy', () => {
                // OnDestroy implementation
                if (scope[controllerName] && _.isFunction(scope[controllerName].ngOnDestroy)){
                    scope[controllerName].ngOnDestroy();
                }
                
                // Remove component css
                _.each(scope["__styles__"], (value:string, key: string) => {
                   $(document).find("head link[type='text/css'][data-code='" + key + "'],head style[type='text/css'][data-code='" + key + "']").remove();
                });
            });
            
            // Manage OnInit implementation
            var to:number;
            var listener = scope.$watch(() => {
                clearTimeout(to);
                to = setTimeout(() => {                    
                    listener();
                    
                    // OnInit implementation
                    if (scope[controllerName] && _.isFunction(scope[controllerName].ngOnInit) && !scope[controllerName].__ngIsInit__){
                        scope[controllerName].ngOnInit();
                        scope[controllerName].__ngIsInit__ = true;
                    }
                }, 50);
            })
        };
    }

    /**
     * Get directive restrict property.
     * @method
     * @param {string} selector - The metadata selector value.
     * @return {string} E, C ou A (Element, class or attribute)
     */
    private getDirectiveRestriction(selector: string): string {
        if (selector.match(/\[[a-zA-Z0-9\-_]+\]/ig)) {
            return "A";
        }

        if (selector.substr(0, 1) === ".") {
            return "C";
        }

        return "E";
    }

    /**
     * Register an angular service.
     * @method
     * @param {Class} provider - The provider to register in angular module.
     */
    private registerService(provider: Class) {
        var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        var serviceMetadata = _.find(metadatas, (metadata) => metadata instanceof ServiceMetadata) as ServiceMetadata;
        if (!serviceMetadata) {
            return;
        }

        var name = serviceMetadata.getInjectionName(provider);
        if (this.isRegistered(name)) {
            // TODO: check if registration is same type or else throw error
            return;
        }

        // add inline annotated function to directive provider
        var annotatedFunction = this.getInlineAnnotatedFunction(provider);

        // set module directive
        this._module.service(name, annotatedFunction as any);
        this.setAsRegistered(name);
    }

    /**
     * Register an angular factory.
     * @method
     * @param {Class} provider - The provider to register in angular module.
     */
    private registerFactory(provider: Class) {
        var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        var factoryMetadata = _.find(metadatas, (metadata) => metadata instanceof FactoryMetadata) as FactoryMetadata;
        if (!factoryMetadata) {
            return;
        }

        var name = factoryMetadata.getInjectionName(provider);
        if (this.isRegistered(name)) {
            // TODO: check if registration is same type or else throw error
            return;
        }

        // add inline annotated function to directive provider
        var annotatedFunction = this.getInlineAnnotatedFunction(provider);

        // set module directive
        this._module.factory(name, () => annotatedFunction);
        this.setAsRegistered(name);
    }

    /**
     * Gets the function or inline annotated function if injection.
     * @method
     * @param {Type} provider - the current function to inject.
     * @return {Function|any[]}
     */
    private getInlineAnnotatedFunction(provider: Class): Function | Array<any> {
        var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        var injection = _.find(metadatas, (metadata) => metadata instanceof InjectionMetadata) as InjectionMetadata;
        if (!injection || _.isEmpty(injection.data)) {
            return provider;
        }

        var result = [];
        _.each(injection.data, (param: IInjectableProperty) => {
            if (param.injectionName) {
                result.push(param.injectionName);
                return;
            }

            if (!param.propertyType) {
                result.push(param.propertyName);
                return;
            }

            let injectedTypeMetadata = _.find(Reflect.getMetadata(METADATA_KEY, param.propertyType) || [], (metadata) => metadata instanceof InjectableMetadata) as InjectableMetadata;
            if (!injectedTypeMetadata) {
                result.push(param.propertyName);
                return;
            }

            result.push(injectedTypeMetadata.getInjectionName(param.propertyType));
        });

        // set the new contructor
        let annotatedFunc = function (...args) {
            let providerArguments = args.slice(injection.data.length);
            let dataInjections: _.Dictionary<any> = {};
            for (let index = 0; index < injection.data.length; index++) {
                dataInjections[injection.data[index].propertyName] = args[index];
            }
            
            let obj = ApplicationModule.construct(provider, providerArguments, dataInjections);

            return obj;
        }

        // copy prototype so intanceof operator still works
        annotatedFunc.prototype = provider.prototype;

        result.push(annotatedFunc);

        return result;
    }

    /**
     * Utility function to generate instances of a class
     * @param constructor
     * @param arguments
     */
    static construct(constructor:Function, args: Array<any>, dataInjections: _.Dictionary<any>) {
        let component: any = function () {
            if (dataInjections){
                _.each(dataInjections, (value, key) => {
                    this[key] = value;
                });
            }
            
            return constructor.apply(this, args);
        }
        component.prototype = constructor.prototype;
        return new component();
    }

    //#endregion

    //#region ----- Utils -----
    
    /**
     * Gets a value indicating whether text is a valid url.
     * @method
     * @param {string} text - Text to check.
     * @return {boolean}
     */
    private isUrl(text: string): boolean{
        var regexp = new RegExp('^(https?:\/\/)?'+ // protocol
                    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
                    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
                    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
                    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
                    '(\#[-a-z\d_]*)?$','i'); // fragment locater
        return regexp.test(text);
    }
    
    /**
     * Format the corresposponding style tag to import in header.
     * @method
     * @param {string} style - The style text to import.
     * @return {string}
     */
    private formatStyleTag(style: string, code: string, isUrl?: boolean): string {
        if (isUrl){
            return "<link rel=\"stylesheet\" type=\"text/css\" data-code=\"" + code + "\" href=\"" + style + "\" />"
        }
        
        return "<style type=\"text/css\" data-code=\"" + code + "\">" + style + "</style>";
    }

    //#endregion

    //#region ----- Metadata Utils -----

    /**
     * Gets a value indicating whether provider function is angular directive.
     * @method
     * @param {Class} provider - Provider to add to register to angular module
     * @return {boolean}
     */
    private isDirective(provider: Class) {
        let metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        return _.any(metadatas, (metadata) => metadata instanceof DirectiveMetadata);
    }

    /**
     * Gets a value indicating whether provider function is angular component.
     * @method
     * @param {Class} provider - Provider to add to register to angular module
     * @return {boolean}
     */
    private isComponent(provider: Class) {
        let metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        return _.any(metadatas, (metadata) => metadata instanceof ComponentMetadata);
    }

    /**
     * Gets a value indicating whether provider function is angular service.
     * @method
     * @param {Class} provider - Provider to add to register to angular module
     * @return {boolean}
     */
    private isService(provider: Class) {
        let metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        return _.any(metadatas, (metadata) => metadata instanceof ServiceMetadata);
    }

    /**
     * Gets a value indicating whether provider function is angular factory.
     * @method
     * @param {Class} provider - Provider to add to register to angular module
     * @return {boolean}
     */
    private isFactory(provider: Class) {
        let metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        return _.any(metadatas, (metadata) => metadata instanceof FactoryMetadata);
    }

    /**
     * Gets a value indicating whether provider function is angular Provider.
     * @method
     * @param {Class} provider - Provider to add to register to angular module
     * @return {boolean}
     */
    private isProvider(provider: Class) {
        let metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        return _.any(metadatas, (metadata) => metadata instanceof ProviderMetadata);
    }

    /**
     * Gets a value indicating whether provider function is angular filter.
     * @method
     * @param {Class} provider - Provider to add to register to angular module
     * @return {boolean}
     */
    private isFilter(provider: Class) {
        let metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        return _.any(metadatas, (metadata) => metadata instanceof FilterMetadata);
    }

    /**
     * Gets a value indicating whether provider function is angular config block.
     * @method
     * @param {Class} provider - Provider to add to register to angular module
     * @return {boolean}
     */
    private isConfigBlock(provider: Class) {
        let metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        return _.any(metadatas, (metadata) => metadata instanceof ConfigBlockMetadata);
    }

    /**
     * Gets a value indicating whether provider function is angular run block.
     * @method
     * @param {Class} provider - Provider to add to register to angular module
     * @return {boolean}
     */
    private isRunBlock(provider: Class) {
        let metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        return _.any(metadatas, (metadata) => metadata instanceof RunBlockMetadata);
    }

    //#endregion

    //#region ----- routing Utils -----

    /**
     * Configure module for routing.
     * @method
     */
    private configureRouting() {
        this._module.config(["$stateProvider", "$urlRouterProvider",
            ($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
                // if one default state
                let defaultRoute = _.find(this._routes, route => route.useAsDefault);
                if (defaultRoute) {
                    $urlRouterProvider.otherwise(defaultRoute.path);
                }

                _.each(this._routes, route => {
                    // if lazy loading component
                    if (!route.component && route.loader) {
                        $stateProvider.state({
                            url: route.path,
                            template: "<" + REQUIRE_LOADER + " path=\"" + route.loader.path + "\" name=\"" + route.loader.name + "\"></" + REQUIRE_LOADER + ">",
                            name: route.name,
                            $$routeDefinition: route
                        } as IRoute);
                        return;
                    }
                    
                    // get component metadata
                    let metadatas = Reflect.getMetadata(METADATA_KEY, route.component);
                    let metadata = _.find(metadatas, (metadata) => metadata instanceof ComponentMetadata) as ComponentMetadata;
                    if (!metadata) {
                        throw new TypeError("This route object is not a component. Route: " + route.name );
                    }
                    
                    $stateProvider.state({
                        url: route.path,
                        template: "<" + metadata.selector + "></" + metadata.selector + ">",
                        name: route.name,
                        // TODO: see template provider for lazy loading
                        $$routeDefinition: route
                    } as IRoute);
                });
            }]);
    }
    
    /**
     * Gets the route template provider.
     * @method
     * @param {IRouteDefinition} route - The current route definition.
     * @return {Function|Array<string|Function>}
     */
    private getTemplateProvider(route: IRouteDefinition): Function|Array<string|Function>{
        if (!route.loader){
            throw new Error("You have to specify a loader method");
        }
        
        return ["$q", function($q){
            return require([route.loader.path], exportedComponent => {
                let component = route.loader.name ? exportedComponent[route.loader.name] : exportedComponent as Class;
                let metadatas = Reflect.getMetadata(METADATA_KEY, component);
                let metadata = _.find(metadatas, (metadata) => metadata instanceof ComponentMetadata) as ComponentMetadata;
                if (!metadata) {
                    throw new TypeError("This imported object is not a component. Path: " + route.loader.path + " ; Name: " + route.loader.name );
                }
                
                return "<" + metadata.selector + "></" + metadata.selector + ">";
            });
        }];
    }

    //#endregion
}

/**
 * Create an angular module.
 * @param {string} name - Angular module name.
 * @param {{string|IModule}[]} modules - Module dependencies.
 * @return {IModule}
 */
function module(name: string, modules?: Array<string | IModule>): IModule {
    return new ApplicationModule(name, modules);
}

/**
 * Compile a component and its dependencies and create an angular module.
 * @param {Class} component - Component to compile in an angular module.
 * @param {{string|IModule}[]} modules - Module dependencies.
 * @return {IModule}
 */
export function compile(component: Class, modules?: Array<string | IModule>): IModule {
    var metadatas = Reflect.getMetadata(METADATA_KEY, component);
    var componentMetadata = _.find(metadatas, (metadata) => metadata instanceof ComponentMetadata) as ComponentMetadata;
    if (!componentMetadata) {
        throw new TypeError("Only module component can be compiled");
    }

    var name = componentMetadata.getInjectionName(component);
    var appModule =  compileComponent(name, component, modules);
    
    if (__BootstrapApplication__){
        __BootstrapApplication__.registerDependency(appModule);
    }
    return appModule;
}

/**
 * Compile a component and its dependencies and create an angular module.
 * @param {string} name - Module name.
 * @param {Class} component - Component to compile in an angular module.
 * @param {{string|IModule}[]} modules - Module dependencies.
 * @return {IModule}
 */
function compileComponent(name: string, component: Class, modules?: Array<string | IModule>): IModule {
    return module(name, modules).add(component);
}

/**
 * Bootstrap a component to the DOM
 * @param {Class} component - The component to bootstrap.
 * @param {{string|IModule}[]} modules - Module dependencies.
 */
export function bootstrap(component: Class, modules?: Array<string | IModule>) {
    var metadatas = Reflect.getMetadata(METADATA_KEY, component);
    var componentMetadata = _.find(metadatas, (metadata) => metadata instanceof ComponentMetadata) as ComponentMetadata;
    if (!componentMetadata) {
        throw new TypeError("Only module component can be bootstrapped");
    }
    
    // add oclazyload module
    modules = modules || [];
    if (modules.indexOf("oc.lazyLoad") == -1){
        modules.unshift("oc.lazyLoad");
    }
    
    var name = componentMetadata.getInjectionName(component);
    var appModule = compileComponent(name, component, modules);

    var element = angular.element(componentMetadata.selector);
    if (element.length === 0) {
        console.log("Application not bootstrapped because selector \"" + componentMetadata.selector + "\" not found.");
        return;
    }

    angular.bootstrap(element, [name]);
    // the following is required if you want AngularJS Scenario tests to work
    $(element).addClass("ng-app: " + name);
    __BootstrapApplication__ = appModule;
}