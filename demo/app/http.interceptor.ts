import { Injectable, Inject } from "angularjs-annotations/core";

export const HTTP_INTERCEPTOR = "HttpInterceptorFactory";

@Injectable()
export class HttpInterceptor {
    @Inject("$q")
    private _q: angular.IQService;
    
    request(config: angular.IRequestConfig){
        console.log("'" + config.method + "' method on URL '" + config.url + "'");
        return config;
    }
    
    responseError(responseFailure){
        console.log("Http request error:", responseFailure);
    }
}