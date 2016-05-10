import { Component, Inject, OnInit } from "angularjs-annotations/core";
import {HTTP_INTERCEPTOR} from "app/http.interceptor"

export class AppConfig {
    @Inject("$ocLazyLoadProvider")
    private _ocLazyLoadProvider: oc.ILazyLoadProvider;
    
    @Inject("$httpProvider")
    private _httpProvider: angular.IHttpProvider;

    @Inject()
    private $locationProvider: angular.ILocationProvider;
    
    constructor(){
        this.initialize();
    }
    
    initialize(){
        this._ocLazyLoadProvider.config({
            debug: true,
            events: true
        });
        
        this.$locationProvider.html5Mode(true);
        this._httpProvider.interceptors.push(HTTP_INTERCEPTOR);
    }
}