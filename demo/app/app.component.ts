import { Component, Directive, Inject } from "angularjs-annotations/core";
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from "angularjs-annotations/router";
import { HeroesComponent } from "app/heroes.component";


@Component({
    selector: "my-app",
    template: "<h1>My first angular annotations Application</h1>\
        <h2>{{myApp.title}}</h2>\
        <button class=\"md-raised md-primary\" ng-click=\"myApp.goToHeroes()\">click me</button>\
        <br/> \
        <router-outlet></router-outlet>\
        ",
    styleUrls: ["app/app.component.css"],
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})
@RouteConfig([
    {
        name: "Heroes",
        path: "/heroes",
        component: HeroesComponent
    },
    // {
    //     name: "HeroDetail",
    //     path: "/detail/{id:int}",
    //     component: HeroDetailComponent
    // }
    {
        name: "HeroDetail",
        path: "/detail/{id:int}",
        loader: {path: "app/hero-detail.component", name: "HeroDetailComponent"}
    }
])
class AppComponent {
    public title = "Tour of Heroes";

    @Inject()
    private _router: Router;

    public goToHeroes() {
        this._router.navigate("Heroes");
    }
}

export {AppComponent};