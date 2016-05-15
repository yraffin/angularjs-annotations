import {Class} from "angularjs-annotations/core/types"
import { METADATA_KEY } from "angularjs-annotations/core/decorators.utils"
import {InjectableMetadata} from "angularjs-annotations/core/metadata/injectable.metadata"

export interface IProvidable {
    useClass?: Class;
    useFactory?: Function;
    useValue?: any;
    useConstant?: any;
    deps?: Array<string|Class|Provider>
}

export class Provider {
    public injectorKey: string;
    public injectable: IProvidable;
    
    constructor(providerKey: string|Class, providable?: IProvidable){
        if (_.isString(providerKey) && !providable) {
            throw new TypeError("Providable object should be defined to provider");
        }
        
        // provider key is class and providable not defined => use class provider key
        if (!_.isString(providerKey) && !providable){
            providable = { useClass: providerKey as Class };            
        }
        
        // get injector key
        if (!_.isString(providerKey)){
            // get class name
            var metadatas = Reflect.getMetadata(METADATA_KEY, providerKey as Class);
            if (!metadatas){
                throw new TypeError("Provider key should be a string or Injectable class");
            }
            
            var injectableMetadata = _.find(metadatas, (metadata) => metadata instanceof InjectableMetadata) as InjectableMetadata;
            if (!injectableMetadata){
                throw new TypeError("Provider key should be a string or Injectable class");
            }
            
            this.injectorKey = injectableMetadata.getInjectionName();
        } else {
            this.injectorKey = providerKey;
        }
        
        // get injectable
        this.injectable = providable;
    }
}

export function provide(providerKey: string|Class, providable?: IProvidable){
    return new Provider(providerKey, providable);
}