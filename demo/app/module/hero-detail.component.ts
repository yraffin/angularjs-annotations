import {Component, Inject, OnInit} from "angularjs-annotations/core";
import {Router} from "angularjs-annotations/router";

import {Hero, HeroService} from "app/hero.service"

@Component({
    selector: "module-hero-detail",
    templateUrl: "app/module/hero-detail.component.html",
    styleUrls: ["app/hero-detail.component.css"]
})
export class HeroDetailComponent implements OnInit {
    @Inject()
    private _router: Router;
    @Inject()
    private _heroService: HeroService;
    
    public hero: Hero;
    
    ngOnInit(){
        let id = this._router.getParam("id");
        this._heroService.getHero(id).then(hero => this.hero = hero);
    }
    
    goBack(){
        this._router.goBack();
    }
}