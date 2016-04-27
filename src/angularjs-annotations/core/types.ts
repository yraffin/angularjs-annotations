/**
 * Represents a type which is constructable
 * @interface
 */
interface Class extends Function {
    new (...args: any[]): any;
}

export {Class};