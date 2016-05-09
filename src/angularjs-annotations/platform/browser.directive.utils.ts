import { Class } from "angularjs-annotations/core/types"
import { METADATA_KEY } from "angularjs-annotations/core/decorators.utils"
import {DirectiveMetadata, IDirectiveMetadata} from "angularjs-annotations/core/metadata/directive.metadata";
import {ComponentMetadata, IComponentMetadata} from "angularjs-annotations/core/metadata/component.metadata";
import {InputMetadata, IInputProperty} from "angularjs-annotations/core/metadata/input.metadata";

export const PROPERTIES_SYMBOLS = ["=", "&", "@"];
/**
 * Gets the directive link function.
 */
export function getDirectiveLinkFunction(provider:Class, metadata: DirectiveMetadata): Function{
    var controllerName = metadata.exportAs || metadata.getInjectionName(provider);
    return (scope: angular.IScope, element: angular.IAugmentedJQuery, attributes: angular.IAttributes, controllers?: any) => {
        if (scope[controllerName] && _.isFunction(scope[controllerName].link)) {
            scope[controllerName].link(scope, element, attributes, controllers);
        }
        
        // manage css for components
        scope["__styles__"] = {};
        _.each((metadata["styles"] || []) as string[], (style, index) => {
            let code = controllerName + "_style_" + index;
            scope["__styles__"][code] = formatStyleTag(style, code);
            
            // add style to DOM
            $(document).find("head").append(scope["__styles__"][code]);
        });
        _.each((metadata["styleUrls"] || []) as string[], (style, index) => {
            let code = controllerName + "_style_" + index;
            scope["__styles__"][code] = formatStyleTag(style, code, true);
            
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
export function getDirectiveRestriction(selector: string): string {
    if (selector.match(/\[[a-zA-Z0-9\-_]+\]/ig)) {
        return "A";
    }

    if (selector.substr(0, 1) === ".") {
        return "C";
    }

    return "E";
}

/**
 * Format the corresposponding style tag to import in header.
 * @method
 * @param {string} style - The style text to import.
 * @return {string}
 */
export function formatStyleTag(style: string, code: string, isUrl?: boolean): string {
    if (isUrl){
        return "<link rel=\"stylesheet\" type=\"text/css\" data-code=\"" + code + "\" href=\"" + style + "\" />"
    }
    
    return "<style type=\"text/css\" data-code=\"" + code + "\">" + style + "</style>";
}

/**
 * Gets the directive scope.
 * @method
 * @param {DirectiveMetadata} metadata - The current directive metadata.
 * @return {boolean|Object}
 */
export function getDirectiveScope(metadata: DirectiveMetadata): boolean | _.Dictionary<string> {
    var scope: _.Dictionary<string> = {};
    if (!metadata.properties || metadata.properties.length === 0){
        return false;
    }
    
    _.each(metadata.properties, property => {
        let parts = property.split(":");
        if (parts.length > 2){
            throw new Error("Properties are not well formed. Exemple");
        }
        
        scope = _.extend(scope, getBindedPropertyName(parts[0], parts.length === 2 ? parts[1] : undefined));
    });
    
    return scope;
}

/**
 * Get the scope binding properties.
 * @method
 * @param {string} name - The current property name.
 * @param {string} bindingName - The current property binding name.
 * @return {Object}
 */
function getBindedPropertyName(name: string, bindingName?: string): _.Dictionary<string> {
    var property:_.Dictionary<string> = {};
    if (!name){
        return property;
    }
    
    name = name.trim();
    bindingName = (bindingName || name).trim();
    if (PROPERTIES_SYMBOLS.indexOf(bindingName.charAt(0)) === -1){
        // default is '='
        bindingName = "=" + bindingName;
    }
    
    var key = (PROPERTIES_SYMBOLS.indexOf(name.charAt(0)) === -1 ? name : name.substr(1));
    property[key] = bindingName;
    return property;
}