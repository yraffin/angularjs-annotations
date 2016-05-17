import { Pipe, PipeTransform, Inject } from "angularjs-annotations/core";

@Pipe({ name: "upperCase"})
export class UpperCasePipe implements PipeTransform{
    @Inject("$http")
    private _http: angular.IHttpService;
    
    transform(value: string, toto:any) {
        return this.upperCaseValue(value);
    }
    
    upperCaseValue(value:string):string{
        return (value || "").toUpperCase();
    }
}  