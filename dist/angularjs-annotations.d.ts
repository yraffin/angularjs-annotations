declare module "angularjs-annotations/core/metadata/injectable.metadata" {
    export interface IInjectableMetadata {
        selector?: string;
        getInjectionName: () => string;
        getClassName: () => string;
    }
    export class InjectableMetadata implements IInjectableMetadata {
        /**
         * Get current class injection name.
         * @method
         * @return {string}
         */
        getInjectionName(): any;
        /**
         * Get current class name.
         * @method
         * @return {string}
         */
        getClassName(): any;
        /**
         * Get directive restrict property.
         * @method
         * @return {string} E, C ou A (Element, class or attribute)
         */
        private getSelectorInjectionName();
        /**
         * Normalize string for angular html code.
         * @method
         * @param {string} s - string to normalize.
         * @return {string}
         */
        private normalize(s);
        /**
         * Normalize string from angular html code.
         * @method
         * @param {string} s - string to normalize.
         * @return {string}
         */
        private deNormalize(s);
    }
}
declare module "angularjs-annotations/core/types" {
    /**
     * Represents a type which is constructable
     * @interface
     */
    interface Class extends Function {
        new (...args: any[]): any;
    }
    export { Class };
}
declare module "angularjs-annotations/core/metadata/directive.metadata" {
    import { InjectableMetadata, IInjectableMetadata } from "angularjs-annotations/core/metadata/injectable.metadata";
    import { Class } from "angularjs-annotations/core/types";
    export interface IDirectiveMetadata {
        selector: string;
        template?: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
        templateUrl?: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
        exportAs?: string;
        events?: string[];
        providers?: Array<Class | string>;
        properties?: Array<string>;
    }
    export class DirectiveMetadata extends InjectableMetadata implements IDirectiveMetadata, IInjectableMetadata {
        selector: string;
        template: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
        templateUrl: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
        exportAs: string;
        events: string[];
        providers: Array<Class | string>;
        properties: Array<string>;
        constructor(data: IDirectiveMetadata);
        /**
         * Gets an array of linked Class to register with directive.
         * @return {Class[]}
         */
        getLinkedClasses(): Class[];
    }
}
declare module "angularjs-annotations/core/metadata/component.metadata" {
    import { DirectiveMetadata, IDirectiveMetadata } from "angularjs-annotations/core/metadata/directive.metadata";
    import { Class } from "angularjs-annotations/core/types";
    export interface IComponentMetadata extends IDirectiveMetadata {
        directives?: Array<Class | string>;
    }
    export class ComponentMetadata extends DirectiveMetadata implements IComponentMetadata {
        directives: Array<Class | string>;
        constructor(data: IComponentMetadata);
        /**
         * Gets an array of linked Class to register with component.
         * @return {Class[]}
         */
        getLinkedClasses(): Class[];
    }
}
declare module "angularjs-annotations/core/metadata/injection.metadata" {
    export interface IInjectableProperty {
        injectionName: string;
        propertyName: string;
        propertyType: any;
    }
    export class InjectionMetadata {
        data: Array<IInjectableProperty>;
    }
}
declare module "angularjs-annotations/core/metadata/providers.metadata" {
    import { InjectableMetadata } from "angularjs-annotations/core/metadata/injectable.metadata";
    export class ServiceMetadata extends InjectableMetadata {
        constructor();
    }
    export class FactoryMetadata extends InjectableMetadata {
        constructor();
    }
    export class ProviderMetadata extends InjectableMetadata {
        constructor();
    }
    export class FilterMetadata extends InjectableMetadata {
        constructor();
    }
}
declare module "angularjs-annotations/core/decorators.utils" {
    import { Class } from "angularjs-annotations/core/types";
    export const METADATA_KEY: string;
    export function defineMetadata(value: any): {
        (target: Class): void;
        (target: Object, targetKey: string | symbol): void;
    };
    export function setPropertyKey(value: any): string | symbol;
}
declare module "angularjs-annotations/core/decorators" {
    import { IDirectiveMetadata } from "angularjs-annotations/core/metadata/directive.metadata";
    import { IComponentMetadata } from "angularjs-annotations/core/metadata/component.metadata";
    import { Class } from "angularjs-annotations/core/types";
    export function Directive(options: IDirectiveMetadata): (target: Class) => void;
    export function Component(options: IComponentMetadata): (target: Class) => void;
    export function Service(): (target: Class) => void;
    export function Factory(): (target: Class) => void;
    export function Provider(): (target: Class) => void;
    export function Filter(): (target: Class) => void;
    export function Inject(name?: string): (target: Object, targetKey: string) => void;
}
declare module "angularjs-annotations/router/metadata/route.config.metadata" {
    import { Class } from "angularjs-annotations/core/types";
    export interface IRouteDefinition {
        path: string;
        name: string;
        component?: Class;
        useAsDefault?: boolean;
        loader?: angular.IPromise<Function>;
        lazyLoad?: boolean;
    }
    export class RouteConfigMetadata {
        data: Array<IRouteDefinition>;
        constructor(data: Array<IRouteDefinition>);
    }
}
declare module "angularjs-annotations/core/module" {
    import { Class } from "angularjs-annotations/core/types";
    export interface IModule {
        name: string;
        add: (...providers: Array<Class>) => IModule;
        config: (config: Function | Array<any>) => IModule;
        run: (run: Function | Array<any>) => IModule;
    }
    export const UI_ROUTER: string;
    /**
     * Application module class
     * @class
     */
    export class ApplicationModule implements IModule {
        name: string;
        private _routes;
        private _registeredClass;
        constructor(name: string, modules?: Array<string | IModule>);
        /**
         * Gets or sets the current module by its name.
         * @property {angular.IModule}
         */
        private _module;
        /**
         * Add a list of providers to a module.
         * @method
         * @param {Type[]} providers
         */
        add(...providers: Array<Class>): IModule;
        /**
         * Sets the module configuration.
         * @method
         * @param {Function|any[]} config - The module configuration to set.
         */
        config(annotatedFunction: Array<any>): IModule;
        config(configFn: Function): IModule;
        /**
         * Sets the module configuration.
         * @method
         * @param {Function|any[]} initialization - The module configuration to set.
         */
        run(annotatedFunction: Array<any>): IModule;
        run(initializationFn: Function): IModule;
        /**
         * Set a provider as registered class in module.
         * @method
         * @param {string} name - the registration name.
         */
        private setAsRegistered(name);
        /**
         * Gets a value indicating whether a provider is registered in module.
         * @method
         * @param {string} name - the registration name.
         */
        private isRegistered(name);
        /**
         * Register an angular route.
         * @method
         * @param {Class} provider - The provider component.
         */
        private registerRoutes(provider);
        /**
         * Register an angular directive.
         * @method
         * @param {Class} provider - The provider to register in angular module.
         */
        private registerDirective(provider);
        /**
         * Get directive restrict property.
         * @method
         * @param {string} selector - The metadata selector value.
         * @return {string} E, C ou A (Element, class or attribute)
         */
        private getDirectiveRestriction(selector);
        /**
         * Register an angular service.
         * @method
         * @param {Class} provider - The provider to register in angular module.
         */
        private registerService(provider);
        /**
         * Register an angular factory.
         * @method
         * @param {Class} provider - The provider to register in angular module.
         */
        private registerFactory(provider);
        /**
         * Gets the function or inline annotated function if injection.
         * @method
         * @param {Type} provider - the current function to inject.
         * @return {Function|any[]}
         */
        private getInlineAnnotatedFunction(provider);
        /**
         * Utility function to generate instances of a class
         * @param constructor
         * @param arguments
         */
        static construct(constructor: any, args: any): any;
        /**
         * Gets a value indicating whether provider function is angular directive.
         * @method
         * @param {Class} provider - Provider to add to register to angular module
         * @return {boolean}
         */
        private isDirective(provider);
        /**
         * Gets a value indicating whether provider function is angular component.
         * @method
         * @param {Class} provider - Provider to add to register to angular module
         * @return {boolean}
         */
        private isComponent(provider);
        /**
         * Gets a value indicating whether provider function is angular service.
         * @method
         * @param {Class} provider - Provider to add to register to angular module
         * @return {boolean}
         */
        private isService(provider);
        /**
         * Gets a value indicating whether provider function is angular factory.
         * @method
         * @param {Class} provider - Provider to add to register to angular module
         * @return {boolean}
         */
        private isFactory(provider);
        /**
         * Gets a value indicating whether provider function is angular Provider.
         * @method
         * @param {Class} provider - Provider to add to register to angular module
         * @return {boolean}
         */
        private isProvider(provider);
        /**
         * Gets a value indicating whether provider function is angular filter.
         * @method
         * @param {Class} provider - Provider to add to register to angular module
         * @return {boolean}
         */
        private isFilter(provider);
        /**
         * Configure module for routing.
         * @method
         */
        private configureRouting();
    }
    /**
     * Compile a component and its dependencies and create an angular module.
     * @param {Class} component - Component to compile in an angular module.
     * @param {{string|IModule}[]} modules - Module dependencies.
     * @return {IModule}
     */
    export function compile(component: Class, modules?: Array<string | IModule>): IModule;
    /**
     * Bootstrap a component to the DOM
     * @param {Class} component - The component to bootstrap.
     * @param {{string|IModule}[]} modules - Module dependencies.
     */
    export function bootstrap(component: Class, modules?: Array<string | IModule>): void;
}
declare module "angularjs-annotations/core" {
    export * from "angularjs-annotations/core/decorators";
    export * from "angularjs-annotations/core/types";
    interface OnInit {
        ngOnInit(): void;
    }
    export { OnInit };
}
declare module "angularjs-annotations/router/decorators" {
    import { IRouteDefinition } from "angularjs-annotations/router/metadata/route.config.metadata";
    import { Class } from "angularjs-annotations/core/types";
    export function RouteConfig(options: Array<IRouteDefinition>): (target: Class) => void;
}
declare module "angularjs-annotations/router" {
    export * from "angularjs-annotations/router/decorators";
}
