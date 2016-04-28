import { Component, Directive, Inject } from "angularjs-annotations/core";
import { RouteConfig } from "angularjs-annotations/router";
import { HeroesComponent } from "app/heroes.component";


@Component({
    selector: "my-app",
    template: "<h1>My first angular annotations Application</h1>\
        <h2>{{myApp.title}}</h2>\
        <button class=\"md-raised md-primary\" ng-click=\"myApp.goToHeroes()\">click me</button>\
        <br/> \
        <div ui-view></div>\
        "
})
@RouteConfig([
    {
        name: "Heroes",
        path: "/heroes",
        component: HeroesComponent
    }
])
class AppComponent {
    public title = "Tour of Heroes";

    @Inject()
    public $state: angular.ui.IStateService;

    public goToHeroes() {
        this.$state.go("Heroes");
    }
}

export {AppComponent};