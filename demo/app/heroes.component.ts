import { Component, Directive, Inject, OnInit} from "angularjs-annotations/core";
import { HeroService, Hero } from "app/hero.service";

@Component({
    selector: "my-heroes",
    templateUrl: "app/heroes.component.html",
    providers: [HeroService]
})
class HeroesComponent implements OnInit{
    heroes: Hero[];
    selectedHero: Hero;

    @Inject()
    private _heroService: HeroService;

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
        alert("Go to detail of hero: " + this.selectedHero.name);
    }
}

export {HeroesComponent};