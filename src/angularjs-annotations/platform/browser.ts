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
import {ServiceMetadata, FactoryMetadata, ProviderMetadata, FilterMetadata, ValueMetadata, ConstantMetadata} from "angularjs-annotations/core/metadata/providers.metadata";
import {ConfigBlockMetadata, RunBlockMetadata,BlockMetadata, BlockType} from "angularjs-annotations/core/metadata/blocks.metadata"
import {Class} from "angularjs-annotations/core/types"
import {getInlineAnnotatedFunction, isComponent, isDirective, isService, isFactory, isFilter, isConfigBlock, isRunBlock, isProvider} from "angularjs-annotations/platform/browser.utils"
import {getDirectiveLinkFunction, getDirectiveRestriction, getDirectiveScope,PROPERTIES_SYMBOLS} from "angularjs-annotations/platform/browser.directive.utils"

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
export const OC_LAZYLOAD = "oc.lazyLoad";

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
            
            // register module value service
            this.registerValues(provider);
            
            // register module value service
            this.registerConstants(provider);
            
            // if provider is directive (or component)
            if (isDirective(provider)) {
                this.registerDirective(provider);
                return;
            }

            // if privider is a service
            if (isService(provider)) {
                this.registerService(provider);
            }

            // if privider is a service
            if (isFactory(provider)) {
                this.registerFactory(provider);
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

        if (this._module.requires.indexOf(OC_LAZYLOAD) === -1) {
            this._module.requires.push(OC_LAZYLOAD);
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
            let annotatedFunc = getInlineAnnotatedFunction(block.block);
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
     * Register an angular value service for a module.
     * @method
     * @param {Class} provider - The provider class.
     */
    private registerValues(provider: Class){
        var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        var values = _.filter(metadatas, (metadata) => metadata instanceof ValueMetadata) as ValueMetadata[];
        _.each(values, value => this._module.value(value.name, value.value));
    }
    
    /**
     * Register an angular constant service for a module.
     * @method
     * @param {Class} provider - The provider class.
     */
    private registerConstants(provider: Class){
        var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
        var constants = _.filter(metadatas, (metadata) => metadata instanceof ConstantMetadata) as ConstantMetadata[];
        _.each(constants, constant => this._module.constant(constant.name, constant.value));
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

        if (directiveMetadata instanceof ComponentMetadata) {
            this.registerRoutes(provider);
        }
        
        // if input defined => add to properties
        var inputMetadata = _.find(metadatas, (metadata) => metadata instanceof InputMetadata) as InputMetadata;
        if (inputMetadata && inputMetadata.data.length > 0){
            directiveMetadata.properties = _.union(directiveMetadata.properties || [], _.map(inputMetadata.data, inputData => {
                if (inputData.inputName && PROPERTIES_SYMBOLS.indexOf(inputData.inputName.charAt(0)) === -1 ){
                    // default input => = symbol
                    return inputData.propertyName + ": =" + (inputData.inputName || "");
                } else if (inputData.inputName){
                    return inputData.propertyName + ": " + (inputData.inputName || "");                    
                }
                
                return inputData.propertyName;
            }));
        }

        var directive: angular.IDirective = {};
        directive.restrict = getDirectiveRestriction(directiveMetadata.selector.trim());
        directive.controllerAs = directiveMetadata.exportAs || name;

        // add scope
        directive.scope = getDirectiveScope(directiveMetadata);
        if (_.isObject(directive.scope)){
            directive.bindToController = true;
        }
        
        // add template
        if (directiveMetadata.template) {
            directive.template = directiveMetadata.template;
        } else if (directiveMetadata.templateUrl) {
            directive.templateUrl = directiveMetadata.templateUrl;
        }

        directive.replace = directiveMetadata.replace || false;
        
        // set link function
        directive.link = getDirectiveLinkFunction(provider, directiveMetadata);
        
        // set compile function        
        if (provider["compile"]) {
            directive.compile = provider["compile"];
        }

        // add controller as function or inlineAnnotatedFunction
        directive.controller = getInlineAnnotatedFunction(provider);

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
        var annotatedFunction = getInlineAnnotatedFunction(provider);

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
        var annotatedFunction = getInlineAnnotatedFunction(provider, true) as Array<any>;

        // set module directive
        this._module.factory(name, annotatedFunction);
        this.setAsRegistered(name);
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
                            //template: "<" + REQUIRE_LOADER + " path=\"" + route.loader.path + "\" name=\"" + route.loader.name + "\"></" + REQUIRE_LOADER + ">",
                            template: "<" + REQUIRE_LOADER + " loader=\"loader\"></" + REQUIRE_LOADER + ">",
                            name: route.name,
                            $$routeDefinition: route,
                            controller: ["$scope", ($scope) => {
                                $scope.loader = route.loader;
                            }]
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