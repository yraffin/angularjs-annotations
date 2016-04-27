import {InjectableMetadata, IInjectableMetadata} from "angularjs-annotations/core/metadata/injectable.metadata";
import {Class} from "angularjs-annotations/core/types"

export interface IDirectiveMetadata {
    selector: string;
    template?: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    templateUrl?: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    exportAs?: string;
    events?: string[];
    providers?: Array<Class | string>;
    properties?: Array<string>
}

export class DirectiveMetadata extends InjectableMetadata implements IDirectiveMetadata, IInjectableMetadata {
    public selector: string;
    public template: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    public templateUrl: string | ((element: angular.IAugmentedJQuery, attributes: angular.IAttributes) => string);
    public exportAs: string;
    public events: string[];
    public providers: Array<Class | string>;
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
        return _.filter(this.providers || [], provider => _.isFunction(provider)) as Class[];
    }
}