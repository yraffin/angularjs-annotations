﻿import {Class} from "angularjs-annotations/core/types"

export interface IInjectableMetadata {
    selector?: string;
    name?: string;
    getInjectionName: (provider?: Class) => string;
    getClassName: () => string;
}

export class InjectableMetadata implements IInjectableMetadata {
    /**
     * Get current class injection name.
     * @method
     * @param {Class} provider - The provider class to inject.
     * @return {string}
     */
    public getInjectionName(provider?: Class) {
        if (this["name"]){
            return this["name"];
        }
        
        if (this["selector"]) {
            return this.getSelectorInjectionName();
        }

        return this.getClassName(provider);
    }

    /**
     * Get current class name.
     * @method
     * @param {Class} provider - The provider class to inject.
     * @return {string}
     */
    public getClassName(provider?:Class) {
        let self = provider ? provider : this.constructor as any;
        if (self.name) {
            return self.name;
        } 

        return self.toString().match(/^function\s*([^\s(]+)/)[1];
    }

    /**
     * Get directive restrict property.
     * @method
     * @return {string} E, C ou A (Element, class or attribute)
     */
    private getSelectorInjectionName(): string {
        var selector = this["selector"].trim();
        if (selector.match(/\[[a-zA-Z0-9\-_]+\]/ig)) {
            let match = selector.match(/\[[a-zA-Z0-9\-_]+\]/ig)[0];
            return this.deNormalize(match.substring(1, match.length - 1));
        }

        if (selector.substr(0, 1) === ".") {
            return this.deNormalize(selector.substr(1));
        }

        return this.deNormalize(selector);
    }

    /**
     * Normalize string for angular html code.
     * @method
     * @param {string} s - string to normalize.
     * @return {string}
     */
    private normalize(s: string): string {
        var normalized = _.isString(s)
            ? s.replace(/[A-Z]/g, (ch: string) => { return "-" + String.fromCharCode(ch.charCodeAt(0) | 32); })
            : s;

        normalized = normalized.replace(/^-+/g, "");
        return normalized;
    }

    /**
     * Normalize string from angular html code.
     * @method
     * @param {string} s - string to normalize.
     * @return {string}
     */
    private deNormalize(s: string): string {
        var normalized = _.isString(s)
            ? s.replace(/\-[a-z]/g, (ch: string) => { return ch.substr(1, 1).toUpperCase(); })
            : s;

        normalized = normalized.replace(/^-+/g, "");
        return normalized;
    }
}