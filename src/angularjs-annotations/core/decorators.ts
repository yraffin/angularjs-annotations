import {DirectiveMetadata, IDirectiveMetadata} from "angularjs-annotations/core/metadata/directive.metadata";
import {ComponentMetadata, IComponentMetadata} from "angularjs-annotations/core/metadata/component.metadata";
import {InjectionMetadata, IInjectableProperty} from "angularjs-annotations/core/metadata/injection.metadata";
import {InputMetadata, IInputProperty} from "angularjs-annotations/core/metadata/input.metadata";
import {ServiceMetadata, FactoryMetadata, ProviderMetadata, FilterMetadata, ValueMetadata, ConstantMetadata} from "angularjs-annotations/core/metadata/providers.metadata";
import {ConfigBlockMetadata, RunBlockMetadata} from "angularjs-annotations/core/metadata/blocks.metadata"
import {Class} from "angularjs-annotations/core/types"
import {METADATA_KEY, defineMetadata, setPropertyKey} from "angularjs-annotations/core/decorators.utils"

export function Directive(options: IDirectiveMetadata): (target: Class) => void {
    return defineMetadata(new DirectiveMetadata(options));
}

export function Component(options: IComponentMetadata): (target: Class) => void {
    return defineMetadata(new ComponentMetadata(options));
}

export function Service(name?: string): (target: Class) => void {
    return defineMetadata(new ServiceMetadata(name));
}

export function Factory(name?: string): (target: Class) => void {
    return defineMetadata(new FactoryMetadata(name));
}

export function Provider(name?: string): (target: Class) => void {
    return defineMetadata(new ProviderMetadata(name));
}

export function Filter(name?: string): (target: Class) => void {
    return defineMetadata(new FilterMetadata(name));
}

export function Config(options: Class): (target: Class) => void {
    return defineMetadata(new ConfigBlockMetadata(options));
}

export function Run(options: Class): (target: Class) => void {
    return defineMetadata(new RunBlockMetadata(options));
}

export function Value(name: string, value: any): (target: Class) => void {
    return defineMetadata(new ValueMetadata(name, value));
}

export function Constant(name: string, value: any): (target: Class) => void {
    return defineMetadata(new ConstantMetadata(name, value));
}

export function Inject(name?: string): (target: Object, targetKey: string) => void {
    return (target: Class, targetKey: string): void => {
        var types = Reflect.getMetadata("design:type", target, targetKey);
        let targetClass = target.prototype ? target : target.constructor;
        let metadata = Reflect.getMetadata(METADATA_KEY, targetClass) || [];
        let injectionMetaData = _.find(metadata, (item) => item instanceof InjectionMetadata) as InjectionMetadata;
        if (!injectionMetaData) {
            injectionMetaData = new InjectionMetadata();
            metadata.push(injectionMetaData);
        }
        injectionMetaData.data.push({
            injectionName: name,
            propertyName: targetKey,
            propertyType: types
        });

        Reflect.defineMetadata(METADATA_KEY, metadata, targetClass);
    };
}

export function Input(name?: string): (target: Object, targetKey: string) => void {
    return (target: Class, targetKey: string): void => {
        var types = Reflect.getMetadata("design:type", target, targetKey);
        let targetClass = target.prototype ? target : target.constructor;
        let metadata = Reflect.getMetadata(METADATA_KEY, targetClass) || [];
        let inputMetaData = _.find(metadata, (item) => item instanceof InputMetadata) as InputMetadata;
        if (!inputMetaData) {
            inputMetaData = new InputMetadata();
            metadata.push(inputMetaData);
        }
        inputMetaData.data.push({
            inputName: name,
            propertyName: targetKey,
            propertyType: types
        });

        Reflect.defineMetadata(METADATA_KEY, metadata, targetClass);
    };
}