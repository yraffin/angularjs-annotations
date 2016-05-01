import {InjectableMetadata, IInjectableMetadata} from "angularjs-annotations/core/metadata/injectable.metadata";
import {Class} from "angularjs-annotations/core/types"

export interface IDirectiveMetadata {
    selector: string;
    template?: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    templateUrl?: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    exportAs?: string;
    events?: string[];
    providers?: Array<Class | Class[]>;
    properties?: Array<string>
}

export class DirectiveMetadata extends InjectableMetadata implements IDirectiveMetadata, IInjectableMetadata {
    public selector: string;
    public template: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    public templateUrl: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    public exportAs: string;
    public events: string[];
    public providers: Array<Class | Class[]>;
    public properties: Array<string>

    constructor(data: IDirectiveMetadata) {
        super();
        this.selector = data.selector;
        this.template = data.template;
        this.templateUrl = data.templateUrl;
        this.exportAs = data.exportAs;
        this.events = data.events;
        this.providers = data.providers;
        this.properties = data.properties;
    }

    /**
     * Gets an array of linked Class to register with directive.
     * @return {Class[]}
     */
    getLinkedClasses(): Class[] {
        return this.getLinkedClassesFromSource(this.providers);
    }

    /**
     * Gets an array of linked Class to register with directive.
     * @return {Class[]}
     */
    getLinkedClassesFromSource(source: Array<any>): Class[] {
        var result = _.filter(source || [], provider => _.isFunction(provider)) || [] as Class[];
        _.filter(source || [], provider => _.isArray(provider)).forEach(providerList => {
            result = _.union(result, this.getLinkedClassesFromSource(providerList));
        });
        return result;
    }
}