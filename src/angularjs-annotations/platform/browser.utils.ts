import { Class } from "angularjs-annotations/core/types"
import { METADATA_KEY } from "angularjs-annotations/core/decorators.utils"
import { IInjectableProperty, InjectionMetadata } from "angularjs-annotations/core/metadata/injection.metadata"
import { InjectableMetadata } from "angularjs-annotations/core/metadata/injectable.metadata"
import {DirectiveMetadata, IDirectiveMetadata} from "angularjs-annotations/core/metadata/directive.metadata";
import {ComponentMetadata, IComponentMetadata} from "angularjs-annotations/core/metadata/component.metadata";
import {ConfigBlockMetadata, RunBlockMetadata,BlockMetadata, BlockType} from "angularjs-annotations/core/metadata/blocks.metadata"
import {ServiceMetadata, FactoryMetadata, ValueMetadata, ConstantMetadata} from "angularjs-annotations/core/metadata/providers.metadata";
import {PipeMetadata} from 'angularjs-annotations/core/metadata/pipe.metadata'
import {RouteConfigMetadata, IRouteDefinition } from "angularjs-annotations/router/metadata/route.config.metadata";

/**
 * Gets the function or inline annotated function if injection.
 * @method
 * @param {Type} provider - the current function to inject.
 * @param {boolean} isFactory - Value indicating whether we get inline annotated factory function.
 * @param {boolean} isPipe - Value indicating whether we get inline annotated factory function for pipe filter.
 * @return {Function|any[]}
 */
export function getInlineAnnotatedFunction(provider: Class, isFactory = false, isPipe = false): Function | Array<any> {
    var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
    var injection = _.find(metadatas, (metadata) => metadata instanceof InjectionMetadata) as InjectionMetadata;
    if (!injection || _.isEmpty(injection.data)) {
        injection = { data: [] };
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
    var annotatedFunc = function (...args) {
        let providerArguments = args.slice(injection.data.length);
        let dataInjections: _.Dictionary<any> = {};
        for (let index = 0; index < injection.data.length; index++) {
            dataInjections[injection.data[index].propertyName] = args[index];
        }
        
        let obj = construct(provider, providerArguments, dataInjections);

        return obj;
    }

    // copy prototype so intanceof operator still works
    annotatedFunc.prototype = provider.prototype;
    
    if (!isFactory){
        result.push(annotatedFunc);
        return result;
    }
    
    // set the factory constructor
    var factory = function(...args: any[]){
        if (isPipe){
            var filter = construct(annotatedFunc, args); 
            return (...filterArgs) => filter.transform.apply(filter, filterArgs);
        }
        
        return construct(annotatedFunc, args);
    }

    result.push(factory);
    return result;
}

/**
 * Utility function to generate instances of a class
 * @method
 * @param {Function} constructor - The class constructor to invoke.
 * @param {any[]} arguments - The contructor arguments.
 * @param {Object} dataInjections - The injected data to initialize on the class.
 */
export function construct(constructor:Function, args: Array<any>, dataInjections?: _.Dictionary<any>) {
    var component: any = function () {
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
   
/**
 * Gets a value indicating whether text is a valid url.
 * @method
 * @param {string} text - Text to check.
 * @return {boolean}
 */
export function isUrl(text: string): boolean{
    var regexp = new RegExp('^(https?:\/\/)?'+ // protocol
                '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
                '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
                '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
                '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
                '(\#[-a-z\d_]*)?$','i'); // fragment locater
    return regexp.test(text);
}

export function lazyLoadingRoute() {
    
}

/**
 * Gets a value indicating whether provider function is angular directive.
 * @method
 * @param {Class} provider - Provider to add to register to angular module
 * @return {boolean}
 */
export function isDirective(provider: Class) {
    var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
    return _.any(metadatas, (metadata) => metadata instanceof DirectiveMetadata);
}

/**
 * Gets a value indicating whether provider function is angular component.
 * @method
 * @param {Class} provider - Provider to add to register to angular module
 * @return {boolean}
 */
export function isComponent(provider: Class) {
    var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
    return _.any(metadatas, (metadata) => metadata instanceof ComponentMetadata);
}

/**
 * Gets a value indicating whether provider function is angular injectable.
 * @method
 * @param {Class} provider - Provider to add to register to angular module
 * @return {boolean}
 */
export function isInjectable(provider: Class) {
    var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
    return _.any(metadatas, (metadata) => metadata instanceof InjectableMetadata);
}

/**
 * Gets a value indicating whether provider function is angular service.
 * @method
 * @param {Class} provider - Provider to add to register to angular module
 * @return {boolean}
 */
export function isService(provider: Class) {
    var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
    return _.any(metadatas, (metadata) => metadata instanceof ServiceMetadata);
}

/**
 * Gets a value indicating whether provider function is angular factory.
 * @method
 * @param {Class} provider - Provider to add to register to angular module
 * @return {boolean}
 */
export function isFactory(provider: Class) {
    var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
    return _.any(metadatas, (metadata) => metadata instanceof FactoryMetadata);
}

/**
 * Gets a value indicating whether provider function is angular filter.
 * @method
 * @param {Class} provider - Provider to add to register to angular module
 * @return {boolean}
 */
export function isPipe(provider: Class) {
    var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
    return _.any(metadatas, (metadata) => metadata instanceof PipeMetadata);
}

/**
 * Gets a value indicating whether provider function is angular config block.
 * @method
 * @param {Class} provider - Provider to add to register to angular module
 * @return {boolean}
 */
export function isConfigBlock(provider: Class) {
    var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
    return _.any(metadatas, (metadata) => metadata instanceof ConfigBlockMetadata);
}

/**
 * Gets a value indicating whether provider function is angular run block.
 * @method
 * @param {Class} provider - Provider to add to register to angular module
 * @return {boolean}
 */
export function isRunBlock(provider: Class) {
    var metadatas = Reflect.getMetadata(METADATA_KEY, provider);
    return _.any(metadatas, (metadata) => metadata instanceof RunBlockMetadata);
}