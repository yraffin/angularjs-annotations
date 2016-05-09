import { Factory, Inject } from "angularjs-annotations/core";

@Factory()
export class AuthorizationInterceptor {
    @Inject("$q")
    private _q: angular.IQService;
    
    request(config: angular.IRequestConfig){
        console.log(config.headers);
        return config;
    }
    
    responseError(responseFailure){
        
    }
}