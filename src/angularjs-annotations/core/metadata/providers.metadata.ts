import {Class} from "angularjs-annotations/core/types"
import {InjectableMetadata, IInjectableMetadata} from "angularjs-annotations/core/metadata/injectable.metadata";

export class ProviderBaseMetadata extends InjectableMetadata {
    constructor(public name?: string) {
        super();
    }
}

export class ServiceMetadata extends ProviderBaseMetadata {
    constructor(name?: string) {
        super(name);
    }
}

export class FactoryMetadata extends ProviderBaseMetadata {
    constructor(name?: string) {
        super(name);
    }
}

export class ProviderMetadata extends ProviderBaseMetadata {
    constructor(name?: string) {
        super(name);
    }
}

export class FilterMetadata extends ProviderBaseMetadata {
    constructor(name?: string) {
        super(name);
    }
}

export class ValueMetadata extends ProviderBaseMetadata {
    constructor(name: string, public value: any) {
        super(name);
    }
}

export class ConstantMetadata extends ProviderBaseMetadata {
    constructor(name: string, public value: any) {
        super(name);
    }
}