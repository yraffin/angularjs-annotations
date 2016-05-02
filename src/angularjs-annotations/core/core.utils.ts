import { Class } from "angularjs-annotations/core/types"

/**
 * Normalize string for angular html code.
 * @method
 * @param {string} s - string to normalize.
 * @return {string}
 */
export function normalize(s: string): string {
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
export function deNormalize(s: string): string {
    var normalized = _.isString(s)
        ? s.replace(/\-[a-z]/g, (ch: string) => { return ch.substr(1, 1).toUpperCase(); })
        : s;

    normalized = normalized.replace(/^-+/g, "");
    return normalized;
}