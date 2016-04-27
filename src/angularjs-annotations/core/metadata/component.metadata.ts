import {DirectiveMetadata, IDirectiveMetadata} from "angularjs-annotations/core/metadata/directive.metadata";
import {Class} from "angularjs-annotations/core/types"

export interface IComponentMetadata extends IDirectiveMetadata {
    directives?: Array<Class | string>;
}

export class ComponentMetadata extends DirectiveMetadata implements IComponentMetadata {
    public directives: Array<Class | string>;

    constructor(data: IComponentMetadata) {
        super(data);
        if (!(/^[a-zA-Z0-9\-_]+$/ig).test(data.selector)) {
            throw new TypeError("Component selector should be alphanumeric");
        }

        this.directives = data.directives;
    }

    /**
     * Gets an array of linked Class to register with component.
     * @return {Class[]}
     */
    getLinkedClasses(): Class[] {
        var providers = super.getLinkedClasses();
        var directives = _.filter(this.directives || [], directive => _.isFunction(directive)) as Class[];
        return _.union(providers, directives);
    }
}