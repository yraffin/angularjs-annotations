export interface IInputProperty {
    inputName: string;
    propertyName: string;
    propertyType: any;
}

export class InputMetadata {
    public data: Array<IInputProperty> = [];
}