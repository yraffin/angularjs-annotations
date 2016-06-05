import { Component, Directive, Inject, Config, provide } from "angularjs-annotations/core";
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from "angularjs-annotations/router";
import { HeroesComponent } from "app/module/heroes.component";
import { DashboardComponent } from "app/module/dashboard.component";
import {HttpInterceptor, HTTP_INTERCEPTOR} from "app/http.interceptor"
import {SecurityService} from "app/security.service"

@Component({
    selector: "my-module",
    template: `
        <h2>{{myModule.title}}</h2>
        <nav>
            <a ui-sref="Module.Dashboard">Dashboard</a>
            <a ui-sref="Module.Heroes">Heroes</a>
            <a ng-if="!myApp.securityService.isAuthorized" ng-click="myApp.securityService.login()">Login</a>
            <a ng-if="myApp.securityService.isAuthorized" ng-click="myApp.securityService.logout()">Logout</a>
        </nav>
        <br/>
        <div ui-view></div>
        `,
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS, 
        provide(HTTP_INTERCEPTOR, { useFactory: HttpInterceptor }),
        provide(SecurityService, { useFactory: SecurityService })
    ]
})
@RouteConfig([
    {
        name: "Module.Dashboard",
        path: "/dashboard",
        component: DashboardComponent,
        useAsDefault: true
    },
    {
        name: "Module.Heroes",
        path: "/heroes",
        component: HeroesComponent
    },
    {
        name: "Module.HeroDetail",
        path: "/detail/{id:int}",
        loader: {path: "app/module/hero-detail.component", name: "HeroDetailComponent"}
    }
])
export class ModuleComponent {
    public title = "Tour of Heroes Module";

    @Inject()
    securityService: SecurityService;
}
