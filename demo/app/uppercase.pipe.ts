import { Pipe, PipeTransform } from "angularjs-annotations/core";

@Pipe({ name: "upperCase"})
export class UpperCasePipe implements PipeTransform{
    
    transform(value: string) {
        return (value || "").toUpperCase();
    }
}  