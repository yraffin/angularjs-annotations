import { Component, Directive, Inject, OnInit} from "angularjs-annotations/core";
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from "angularjs-annotations/router";
import { HeroService, Hero } from "app/hero.service";

@Component({
    selector: "module-heroes",
    templateUrl: "app/module/heroes.component.html",
    providers: [HeroService]
})
class HeroesComponent implements OnInit{
    heroes: Hero[];
    selectedHero: Hero;

    @Inject()
    private _heroService: HeroService;

    @Inject()
    private _router: Router;

    getHeroes() {
        this._heroService.getHeroes().then(heroes => this.heroes = heroes);
    }

    ngOnInit() {
        console.log("initialise component: HeroesComponent");
        this.getHeroes();
    }

    onSelect(hero: Hero) {
        this.selectedHero = hero;
    }

    gotoDetail() {
        this._router.navigate("HeroDetail", { id: this.selectedHero.id });
    }
}

export {HeroesComponent};