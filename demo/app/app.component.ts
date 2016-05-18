import { Component, Directive, Inject, Config, provide } from "angularjs-annotations/core";
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from "angularjs-annotations/router";
import { HeroesComponent } from "app/heroes.component";
import { DashboardComponent } from "app/dashboard.component";
import {AppConfig} from "app/app.component.config"
import {HttpInterceptor, HTTP_INTERCEPTOR} from "app/http.interceptor"
import {SecurityService} from "app/security.service"
import {UpperCasePipe} from "app/uppercase.pipe"

@Component({
    selector: "my-app",
    template: `<h1>My first angular annotations Application</h1>
        <h2>{{myApp.title}}</h2>
        <nav>
            <a ui-sref="Dashboard">Dashboard</a>
            <a ui-sref="Heroes">Heroes</a>
            <a ng-if="!myApp.securityService.isAuthorized" ng-click="myApp.securityService.login()">Login</a>
            <a ng-if="myApp.securityService.isAuthorized" ng-click="myApp.securityService.logout()">Logout</a>
        </nav>
        <br/>
        <div ui-view></div>
        `,
    styleUrls: ["app/app.component.css"],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS, 
        provide(HTTP_INTERCEPTOR, { useFactory: HttpInterceptor }),
        provide(SecurityService, { useFactory: SecurityService })
    ],
    pipes: [UpperCasePipe]
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

    @Inject()
    securityService: SecurityService;
}

export {AppComponent};