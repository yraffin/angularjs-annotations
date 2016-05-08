import { Component, Inject, OnInit } from "angularjs-annotations/core";

export class AppConfig {
    @Inject("$ocLazyLoadProvider")
    private _ocLazyLoadProvider: oc.ILazyLoadProvider;
    
    constructor(){
        this.initialize();
    }
    
    initialize(){
        this._ocLazyLoadProvider.config({
            debug: true,
            events: true
        });
    }
}