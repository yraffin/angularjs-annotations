import { Component, Inject, OnInit } from "angularjs-annotations/core";

export class AppConfig {
    @Inject("$ocLazyLoadProvider")
    private _ocLazyLoadProvider: oc.ILazyLoadProvider;
    
    @Inject("$httpProvider")
    private _httpProvider: angular.IHttpProvider;
    
    constructor(){
        this.initialize();
    }
    
    initialize(){
        this._ocLazyLoadProvider.config({
            debug: true,
            events: true
        });
        
        this._httpProvider.interceptors.push("AuthorizationInterceptor");
    }
}