import { Injectable, Inject } from "angularjs-annotations/core";

class Hero {
    id: number;
    name: string;
}

const HEROES: Hero[] = [
    { 'id': 11, 'name': 'Mr. Nice' },
    { 'id': 12, 'name': 'Narco' },
    { 'id': 13, 'name': 'Bombasto' },
    { 'id': 14, 'name': 'Celeritas' },
    { 'id': 15, 'name': 'Magneta' },
    { 'id': 16, 'name': 'RubberMan' },
    { 'id': 17, 'name': 'Dynama' },
    { 'id': 18, 'name': 'Dr IQ' },
    { 'id': 19, 'name': 'Magma' },
    { 'id': 20, 'name': 'Tornado' }
];

@Injectable()
class HeroService {

    @Inject("$q")
    private _q: angular.IQService;

    getHeroes() {
        var defer = this._q.defer<Hero[]>();
        defer.resolve(HEROES);
        return defer.promise;
    }

    getHeroesSlowly() {
        var defer = this._q.defer<Hero[]>();
        setTimeout(() => defer.resolve(HEROES), 2000); // 2 seconds
        return defer.promise;
    }

    getHero(id: number) {
        var defer = this._q.defer<Hero>();
        this.getHeroes().then(heroes => defer.resolve(heroes.filter(hero => hero.id === id)[0]));
        return defer.promise;
    }
}

export {Hero, HeroService, HEROES}