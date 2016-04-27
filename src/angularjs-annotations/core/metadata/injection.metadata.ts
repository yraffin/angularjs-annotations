export interface IInjectableProperty {
    injectionName: string;
    propertyName: string;
    propertyType: any;
}

export class InjectionMetadata {
    public data: Array<IInjectableProperty> = [];
}