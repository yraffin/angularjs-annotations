declare module "angularjs-annotations/core/types" {
    interface Class extends Function {
        new (...args: any[]): any;
    }
    export { Class };
}
declare module "angularjs-annotations/core/core.utils" {
    export function normalize(s: string): string;
    export function deNormalize(s: string): string;
}
declare module "angularjs-annotations/core/metadata/injectable.metadata" {
    import { Class } from "angularjs-annotations/core/types";
    export interface IInjectableMetadata {
        selector?: string;
        name?: string;
        getInjectionName: (provider?: Class) => string;
        getClassName: () => string;
    }
    export class InjectableMetadata implements IInjectableMetadata {
        getInjectionName(provider?: Class): any;
        getClassName(provider?: Class): any;
        private getSelectorInjectionName();
    }
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
        providers?: Array<Class | Class[]>;
        properties?: Array<string>;
        replace?: boolean;
    }
    export class DirectiveMetadata extends InjectableMetadata implements IDirectiveMetadata, IInjectableMetadata {
        selector: string;
        template: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
        templateUrl: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
        exportAs: string;
        events: string[];
        providers: Array<Class | Class[]>;
        properties: Array<string>;
        replace: boolean;
        constructor(data: IDirectiveMetadata);
        getLinkedClasses(): Class[];
        getLinkedClassesFromSource(source: Array<any>): Class[];
    }
}
declare module "angularjs-annotations/core/metadata/component.metadata" {
    import { DirectiveMetadata, IDirectiveMetadata } from "angularjs-annotations/core/metadata/directive.metadata";
    import { Class } from "angularjs-annotations/core/types";
    export interface IComponentMetadata extends IDirectiveMetadata {
        directives?: Array<Class | Class[]>;
        styles?: Array<string>;
        styleUrls?: Array<string>;
    }
    export class ComponentMetadata extends DirectiveMetadata implements IComponentMetadata {
        directives: Array<Class | Class[]>;
        styles: Array<string>;
        styleUrls: Array<string>;
        constructor(data: IComponentMetadata);
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
declare module "angularjs-annotations/core/metadata/input.metadata" {
    export interface IInputProperty {
        inputName: string;
        propertyName: string;
        propertyType: any;
    }
    export class InputMetadata {
        data: Array<IInputProperty>;
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
    export function Input(name?: string): (target: Object, targetKey: string) => void;
}
declare module "angularjs-annotations/core" {
    export * from "angularjs-annotations/core/decorators";
    export * from "angularjs-annotations/core/types";
    export interface OnInit {
        ngOnInit(): void;
    }
    export interface OnDestroy {
        ngOnDestroy(): void;
    }
}
declare module "angularjs-annotations/router/metadata/route.config.metadata" {
    import { Class } from "angularjs-annotations/core/types";
    export interface IRouteDefinition {
        path: string;
        name: string;
        component?: Class;
        useAsDefault?: boolean;
        loader?: {
            path: string;
            name?: string;
        };
    }
    export class RouteConfigMetadata {
        data: Array<IRouteDefinition>;
        constructor(data: Array<IRouteDefinition>);
    }
}
declare module "angularjs-annotations/router/directives/require.loader" {
    import { Class } from "angularjs-annotations/core/types";
    export const REQUIRE_LOADER: string;
    export class RequireLoader {
        private _compile;
        private _q;
        private _ocLazyLoad;
        loader: {
            path: string;
            name: string;
        };
        link(scope: angular.IScope, element: angular.IAugmentedJQuery, attributes: angular.IAttributes): void;
        load(name: string, path: string): angular.IPromise<Class>;
    }
}
declare module "angularjs-annotations/router/providers/router" {
    import { IRouteDefinition } from "angularjs-annotations/router/metadata/route.config.metadata";
    export interface IRoute extends angular.ui.IState {
        $$routeDefinition?: IRouteDefinition;
    }
    export class Router {
        private _state;
        private _stateParams;
        routes: Array<IRoute>;
        getParam(name: string): any;
        navigate(stateName: string, params?: {}, options?: angular.ui.IStateOptions): void;
        goBack(distance?: any): void;
    }
}
declare module "angularjs-annotations/platform/browser" {
    import { DirectiveMetadata } from "angularjs-annotations/core/metadata/directive.metadata";
    import { Class } from "angularjs-annotations/core/types";
    export interface IModule {
        name: string;
        add: (...providers: Array<Class>) => IModule;
        config: (config: Function | Array<any>) => IModule;
        run: (run: Function | Array<any>) => IModule;
        registerDependency: (componentModule: IModule) => void;
    }
    export const UI_ROUTER: string;
    export class ApplicationModule implements IModule {
        name: string;
        private _routes;
        private _registeredClass;
        constructor(name: string, modules?: Array<string | IModule>);
        private _module;
        add(...providers: Array<Class>): IModule;
        config(annotatedFunction: Array<any>): IModule;
        config(configFn: Function): IModule;
        run(annotatedFunction: Array<any>): IModule;
        run(initializationFn: Function): IModule;
        registerDependency(componentModule: IModule): void;
        private setAsRegistered(name);
        private isRegistered(name);
        private registerRoutes(provider);
        private registerDirective(provider);
        getDirectiveLinkFunction(provider: Class, metadata: DirectiveMetadata): Function;
        private getDirectiveRestriction(selector);
        private registerService(provider);
        private registerFactory(provider);
        private getInlineAnnotatedFunction(provider);
        static construct(constructor: any, args: any): any;
        private isUrl(text);
        private formatStyleTag(style, code, isUrl?);
        private isDirective(provider);
        private isComponent(provider);
        private isService(provider);
        private isFactory(provider);
        private isProvider(provider);
        private isFilter(provider);
        private configureRouting();
        private getTemplateProvider(route);
    }
    export function compile(component: Class, modules?: Array<string | IModule>): IModule;
    export function bootstrap(component: Class, modules?: Array<string | IModule>): void;
}
declare module "angularjs-annotations/router/decorators" {
    import { IRouteDefinition } from "angularjs-annotations/router/metadata/route.config.metadata";
    import { Class } from "angularjs-annotations/core/types";
    export function RouteConfig(options: Array<IRouteDefinition>): (target: Class) => void;
}
declare module "angularjs-annotations/router/directives/router.outlet" {
    class RouterOutlet {
    }
    export { RouterOutlet };
}
declare module "angularjs-annotations/router" {
    import { Class } from "angularjs-annotations/core/types";
    export * from "angularjs-annotations/router/decorators";
    import { Router } from "angularjs-annotations/router/providers/router";
    export { Router };
    export const ROUTER_DIRECTIVES: Array<Class>;
    export const ROUTER_PROVIDERS: Array<Class>;
}
