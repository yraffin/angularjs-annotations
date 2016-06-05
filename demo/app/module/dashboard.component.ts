import { Component, Inject, OnInit } from "angularjs-annotations/core";
import {Router} from "angularjs-annotations/router";
import {Hero, HeroService} from "app/hero.service"

@Component({
    selector: 'module-dashboard',
    templateUrl: 'app/module/dashboard.component.html',
    styleUrls: ['app/dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    @Inject()
    private _router: Router;
    @Inject()
    private _heroService: HeroService;
    
    heroes: Hero[] = [];

    ngOnInit() {
        this._heroService.getHeroes()
        .then(heroes => this.heroes = heroes.slice(1,5));
    }

    gotoDetail(hero: Hero) {
        this._router.navigate('HeroDetail', { id: hero.id });
    }
}
