import {InjectableMetadata, IInjectableMetadata} from "angularjs-annotations/core/metadata/injectable.metadata";

export interface IPipeMetadata{
    name: string;
    /**
     * Not yet implemented.
     */
    pure?: boolean;
}

export class PipeMetadata extends InjectableMetadata implements IPipeMetadata {
    name: string;
    pure: boolean;
    constructor(options: IPipeMetadata) {
        super();
        
        if (!options || _.isEmpty(options.name)){
            throw new TypeError("Pipe metadata should have a name defined.")
        }
        
        this.name = options.name;
        this.pure = options.pure;
    }
}

export interface PipeTransform {
    transform: (value: any, ...args: any[]) => any;
}