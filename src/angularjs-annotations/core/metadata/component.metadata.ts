import {DirectiveMetadata, IDirectiveMetadata} from "angularjs-annotations/core/metadata/directive.metadata";
import {Class} from "angularjs-annotations/core/types"
import {Provider} from "angularjs-annotations/core/provider"

export interface IComponentMetadata extends IDirectiveMetadata {
    directives?: Array<Class | Class[]>;
    styles?: Array<string>;
    styleUrls?: Array<string>;
}

export class ComponentMetadata extends DirectiveMetadata implements IComponentMetadata {
    public directives: Array<Class | Class[]>;
    public styles: Array<string>;
    public styleUrls: Array<string>;

    constructor(data: IComponentMetadata) {
        super(data);
        if (!(/^[a-zA-Z0-9\-_]+$/ig).test(data.selector)) {
            throw new TypeError("Component selector should be alphanumeric");
        }

        this.directives = data.directives || [];
        this.styles = data.styles || [];
        this.styleUrls = data.styleUrls || [];
    }

    /**
     * Gets an array of linked Class to register with component.
     * @return {Class[]}
     */
    getLinkedClasses(): Array<Class|Provider> {
        var providers = super.getLinkedClasses();
        var directives = this.getLinkedClassesFromSource(this.directives);
        return _.union(providers, directives);
    }
}