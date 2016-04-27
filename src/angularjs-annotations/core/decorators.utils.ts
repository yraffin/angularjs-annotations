import { Class } from "angularjs-annotations/core/types"

export const METADATA_KEY = "angularjs-annotations:metadata";

export function defineMetadata(value: any) {
    function decorator(target: Class): void;
    function decorator(target: Object, targetKey: string | symbol): void;
    function decorator(target: Object, targetKey?: string | symbol): void {
        if (!_.isUndefined(targetKey)) {
            // property metadata
            if (!_.isObject(target)) {
                throw new TypeError();
            }

            targetKey = setPropertyKey(targetKey);
            let metadata = Reflect.getMetadata(METADATA_KEY, target, targetKey) || [];
            metadata.push(value);
            Reflect.defineMetadata(METADATA_KEY, metadata, target, targetKey);
        }
        else {
            // class metadata
            if (!_.isFunction(target)) {
                throw new TypeError();
            }

            let metadata = Reflect.getMetadata(METADATA_KEY, target) || [];
            metadata.push(value);
            Reflect.defineMetadata(METADATA_KEY, metadata, target);
        }
    }

    return decorator;
}

export function setPropertyKey(value: any): string | symbol {
    if (typeof value === "symbol") {
        return <symbol>value;
    }
    return String(value);
}