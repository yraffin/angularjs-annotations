﻿import { Component, Directive, Inject, Config } from "angularjs-annotations/core";
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from "angularjs-annotations/router";
import { HeroesComponent } from "app/heroes.component";
import { DashboardComponent } from "app/dashboard.component";
import {AppConfig} from "app/app.component.config"
import {HttpInterceptor} from "app/http.interceptor"

@Component({
    selector: "my-app",
    template: `<h1>My first angular annotations Application</h1>
        <h2>{{myApp.title}}</h2>
        <nav>
            <a ui-sref="Dashboard">Dashboard</a>
            <a ui-sref="Heroes">Heroes</a>
        </nav>
        <br/>
        <div ui-view></div>
        `,
    styleUrls: ["app/app.component.css"],
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS, HttpInterceptor]
})
@Config(AppConfig)
@RouteConfig([
    {
        name: "Heroes",
        path: "/heroes",
        component: HeroesComponent
    },
    {
        name: "Dashboard",
        path: "/dashboard",
        component: DashboardComponent,
        useAsDefault: true
    },
    {
        name: "HeroDetail",
        path: "/detail/{id:int}",
        loader: {path: "app/hero-detail.component", name: "HeroDetailComponent"}
    }
])
class AppComponent {
    public title = "Tour of Heroes";
}

export {AppComponent};