import {Class} from "angularjs-annotations/core/types"
import {InjectableMetadata, IInjectableMetadata} from "angularjs-annotations/core/metadata/injectable.metadata";

export class ServiceMetadata extends InjectableMetadata {
    constructor() {
        super();
    }
}

export class FactoryMetadata extends InjectableMetadata {
    constructor() {
        super();
    }
}

export class ProviderMetadata extends InjectableMetadata {
    constructor() {
        super();
    }
}

export class FilterMetadata extends InjectableMetadata {
    constructor() {
        super();
    }
}

export class ValueMetadata extends InjectableMetadata {
    constructor(public name: string, public value: any) {
        super();
    }
}

export class ConstantMetadata extends InjectableMetadata {
    constructor(public name: string, public value: any) {
        super();
    }
}