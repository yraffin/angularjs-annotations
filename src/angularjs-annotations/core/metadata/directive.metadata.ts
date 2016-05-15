import {InjectableMetadata, IInjectableMetadata} from "angularjs-annotations/core/metadata/injectable.metadata";
import {Class} from "angularjs-annotations/core/types"
import {Provider} from "angularjs-annotations/core/provider"

export interface IDirectiveMetadata {
    selector: string;
    template?: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    templateUrl?: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    exportAs?: string;
    events?: string[];
    providers?: Array<Class | Provider | Array<Class | Provider>>;
    properties?: Array<string>;
    replace?: boolean;
}

export class DirectiveMetadata extends InjectableMetadata implements IDirectiveMetadata, IInjectableMetadata {
    public selector: string;
    public template: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    public templateUrl: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    public exportAs: string;
    public events: string[];
    public providers: Array<Class | Provider | Array<Class | Provider>>;
    public properties: Array<string>;
    public replace: boolean;

    constructor(data: IDirectiveMetadata) {
        super();
        this.selector = data.selector;
        this.template = data.template;
        this.templateUrl = data.templateUrl;
        this.exportAs = data.exportAs;
        this.events = data.events;
        this.providers = data.providers;
        this.properties = data.properties;
        this.replace = data.replace;
    }

    /**
     * Gets an array of linked Class to register with directive.
     * @return {Class[]}
     */
    getLinkedClasses(): Array<Class|Provider> {
        return this.getLinkedClassesFromSource(this.providers);
    }

    /**
     * Gets an array of linked Class to register with directive.
     * @return {Class[]}
     */
    getLinkedClassesFromSource(source: Array<any>): Array<Class|Provider> {
        var result = _.filter(source || [], provider => provider instanceof Provider || _.isFunction(provider)) || [] as Array<Class|Provider>;
        _.filter(source || [], provider => _.isArray(provider)).forEach(providerList => {
            result = _.union(result, this.getLinkedClassesFromSource(providerList));
        });
        return result;
    }
}