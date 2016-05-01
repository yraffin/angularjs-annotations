import {DirectiveMetadata, IDirectiveMetadata} from "angularjs-annotations/core/metadata/directive.metadata";
import {Class} from "angularjs-annotations/core/types"

export interface IComponentMetadata extends IDirectiveMetadata {
    directives?: Array<Class | Class[]>;
    styleUrls?: Array<string>;
}

export class ComponentMetadata extends DirectiveMetadata implements IComponentMetadata {
    public directives: Array<Class | Class[]>;
    public styleUrls: Array<string>;

    constructor(data: IComponentMetadata) {
        super(data);
        if (!(/^[a-zA-Z0-9\-_]+$/ig).test(data.selector)) {
            throw new TypeError("Component selector should be alphanumeric");
        }

        this.directives = data.directives;
        this.styleUrls = data.styleUrls;
    }

    /**
     * Gets an array of linked Class to register with component.
     * @return {Class[]}
     */
    getLinkedClasses(): Class[] {
        var providers = super.getLinkedClasses();
        var directives = this.getLinkedClassesFromSource(this.directives);
        return _.union(providers, directives);
    }
}