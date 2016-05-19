# angularjs-annotations
Develop AngularJS 1.x application the same way as an Angular 2 application, using the power of TypeScript 1.7 decorators.

AngularJS is really nice, and allows you to develop a web site quickly. 

Using Typescript with AngularJS gives you the ability of working even quicker and gives you a better code readability and code maintenability.

What I really liked in Angular 2 with Typescript is the use of decorators and the abstraction of the angular module structural code :

- Decorators specify the function of your typescript class.
- Developer can now focus on their functional code only.
- Code is even more simple and faster to understand.
- Code is easier to maintain.
- Better code modularity with components definitions.

I decided to build this librairie for those who are still working on AngularJS and ES5, and wants to enjoy those Angular 2 benefits.
While developing the library I kept in mind the need to be able to upgrade without too much effort to Angular 2.

## Requirements
 - AngularJS v1.3 or higher.
 - Angular-ui-router for routing in angular app and state management.
 - Typescript v1.7 or higher.
 - Reflect-Metadata : allow us to convert typescript decorators into metadata and annotations.
 - Underscore.
 - Requirejs : for typescript AMD module compilation.
 - oclazyload : combine with requirejs, we can use component lazy loading with routing.

## Installation

In order to install this library and its requirements, please use bower.

#### Usage

In order to use the librarie into your own project, do the following:

```sh
# install via bower
bower install angularjs-annotations
```
##### Be carefull: For now the librarie is written in typescript and compile in javascript using AMD module. For a good usage, you need to use it with RequireJs.

If you don't have requirements installed you can get them from bower as well

```sh
# install angularjs
bower install angular

# install requirejs
bower install requirejs

# install underscore
bower install underscore

# install reflect-metadata
bower install reflect-metadata

# install angular-ui-router
bower install angular-ui-router

# install oclazyload
bower install oclazyload
```

#### Demo

If you want to try the demo, start by cloning the repository. The demo is based on [Angular 2 Tour of Heroes](https://github.com/johnpapa/angular2-tour-of-heroes).

You can find the demo runing over [Plunker](http://plnkr.co/edit/r1tVRe?p=preview). This is the javascript compile code.

```sh
# install angularjs
git clone git@github.com:yraffin/angularjs-annotations.git angularjs-annotations
cd angularjs-annotations

# install bower dependencies
bower install

# install npm dependencies
npm install

#install typings before in global if not already done
npm install -g typings

# install typings for typescript
typings install

# launch the demo
grunt demo
```

## Annotations API

#### Bootstrap application

For bootstraping an application you first have to create the main application component and then to bootstrap this component to the DOM:

##### Create the Application component (File ./app/app.component.ts):

```typescript
import { Component } from "angularjs-annotations/core";

@Component({
    selector: "my-app",
    template: "<h1>My First AngularJS Annotations Application</h1>"
})
export class AppComponent { }
```

##### Bootstrap the component to the DOM (File ./app/main.ts):

```typescript
import {bootstrap} from "angularjs-annotations/platform/browser"

import {AppComponent} from "app/app.component"

bootstrap(AppComponent);
```

If you want to specify other angularjs module dependencies, you can add the dependencies in the bootstrap method

```typescript
import {bootstrap} from "angularjs-annotations/platform/browser"

import {AppComponent} from "app/app.component"

bootstrap(AppComponent, ["ngResource", "ngCookies"]);
```

##### Configure you html file to use your component:

RequireJS Config (File ./app/require.config.ts):

```typescript
var requireConfig = {
    baseUrl: ".",
    urlArgs: "b=",
    paths: {
        "reflect-metadata": "vendors/reflect-metadata",
        "angular": "vendors/angular/angular.min",
        "angular-ui-router": "vendors/angular/angular-ui-router.min",
        "jquery": "vendors/jquery.min",
        "underscore": "vendors/underscore-min",
        "angularjs-annotations": "vendors/angularjs-annotations",
        "ocLazyLoad": "vendors/ocLazyLoad"
    },
    shim: {
        "jquery": { "exports": "jquery" },
        "angular": { "exports": "angular", deps: ["jquery"] },
        "angular-ui-router": { deps: ["angular"] },
        "ocLazyLoad": { deps: ["angular"] },
        "angularjs-annotations": { deps: ["angular-ui-router", "underscore", "reflect-metadata", "ocLazyLoad"] },
        "app/main": { deps: ["angularjs-annotations"] },
    }
} as RequireConfig;

export { requireConfig };
```

Index.html (File ./index.html)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <base href="/" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AngularJS Annotations Tour of Heroes</title>
    <link rel="stylesheet" href="css/style.css" />
</head>
<body>
    <my-app>Loading...</my-app>

    <script type="text/javascript" src="vendors/requirejs/require.js"></script>
    <script type="text/javascript">
        window.require(["app/require.config.js"], function (config) {
            let requireConfig = config.requireConfig;
            window.require.config(requireConfig);
            window.require(["app/main"], function () {
                console.log("loaded");
            });
        })
    </script>
</body>
</html>
```


#### Component

In order to create a component, use the `@Component` decorator from `angularjs-annotations/core`. The component metadata is an object containing a least "selector" string property. This property will defined the DOM element associated to our component.

While using `OnInit` implementation from `angularjs-annotations/core`, you will be able to execute initialization code when component is loaded and not just when its created (use the constructor class for this.)

##### Component metadata Properties:

- **`selector`**  **string (required)**  The component DOM element selector. It should be a CSS tag selector.
- **`template`**  **string|Function**  The component HTML template string (or function returning the template HTML code).
- **`templateUrl`**  **string|Function**  The component HTML template URL string (or function returning the template url).
- **`exportAs`**  **string**  The component alias (to use like `contollerAs` in angularJS template). If not defined, we use a normalized name from the component class selector: "my-app" selector => "myApp" `export as` name.
- **`styles`**  **Array&lt;string&gt;**  A list of styles code to use with this component.
- **`styleUrls`**  **Array&lt;string&gt;**  A list of styles url to link with this component.
- **`directives`**  **Array&lt;Class|Class[]&gt;** A List of `Directive` class to use in the component template.
- **`pipes`**  **Array&lt;Class|Class[]&gt;** A List of `Pipe` class to use in the component template.
- **`providers`**  **Array&lt;Class|Provider|Array&lt;Class|Provider&gt;&gt;** A List of `Providers` to use and inject in the component.
- **`properties`**  **Array&lt;string&gt;**  A list of attributes properties to link with this component.

##### Exemple:

```typescript

import {Component, Inject, OnInit} from "angularjs-annotations/core";
import {Router} from "angularjs-annotations/router";
import {Hero, HeroService} from "app/hero.service"

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard.component.html',
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
```

#### Directive

You might need to add custom directives in your component template. You will have to add them to the component directive property.

A directive can be create the same way you create a component, by using `@Directive` decorator from `angularjs-annotations/core`.

##### Directive metadata Properties:

- **`selector`**  **string (required)**  The component DOM element selector. It should be a CSS attribute selector like `[my-attr]`.
- **`template`**  **string|Function**  The component HTML template string (or function returning the template HTML code).
- **`templateUrl`**  **string|Function**  The component HTML template URL string (or function returning the template url).
- **`exportAs`**  **string**  The component alias (to use like `contollerAs` in angularJS template). If not defined, we use a normalized name from the component class selector: "my-app" selector => "myApp" `export as` name.
- **`pipes`**  **Array&lt;Class|Class[]&gt;** A List of `Pipe` class to use in the component template.
- **`providers`**  **Array&lt;Class|Provider|Array&lt;Class|Provider&gt;&gt;** A List of `Providers` to use and inject in the component.
- **`properties`**  **Array&lt;string&gt;**  A list of attributes properties to link with this directive.

##### Exemple:

```typescript

import {Directive, Component} from "angularjs-annotations/core"

@Directive({
    selector: "[router-outlet]",
    template: "<div ui-view></div>"
})
class RouterOutlet {
}

@Component({
    selector: "my-app",
    template: `
        <h1>My First AngularJS Annotations Application</h1>
        <div router-outlet></div>
    `,
    directives: [RouterOutlet]
})
export class AppComponent { }
```


`properties` array will allow you to define 3 kind of isolated scope binding properties :

- *text attribute* by using '`@`'.
- *value expression* by using '`=`'.
- *action expression* by using '`&amp;`'.

You can also use `@Input(name?: string)` decorator on class properties to define a *value expression* binding properties ('=').

##### Exemple:

```typescript

import {Directive, Component, Input} from "angularjs-annotations/core"

@Directive({
    selector: "my-directive",
    template: "<div></div>",
    properties: [
        "param3", // same as "param3: =param3"
        "myText: @param4",
        "myAction: &action",
    ]
})
class MyDirective {
    @Input()
    param1: any;

    @Input("param2")
    myParam2: any;

    param3: any;
    myText: string;

    myAction: Function;
}

@Component({
    selector: "my-app",
    template: `
        <h1>My First AngularJS Annotations Application</h1>
        <my-directive param1="myApp.param1" param2="myApp.param2" param3="myApp.param3" param4="{{myApp.text}}" action="myApp.launch()"></my-directive>
    `,
    directives: [MyDirective]
})
export class AppComponent {
    param1: any;
    param2: any;
    param3: any;
    text: string;
    
    launch() {
        alert("une action");
    }
}
```

#### Injectable

If you need to create a service or factory, that will be injectable with *AngularJs injector service*, you will need to use the `@Injectable` decorator from `angularjs-annotations/core`.

You will then be able to reference it to your component/directive using the `providers` parameter.

##### Exemple:

```typescript

import {Component, Injectable, provide} from "angularjs-annotations/core";

@Injectable()
export class SecurityService {
    isAuthorized: boolean;
    isAdmin: boolean;
    
    login() {
        this.isAuthorized = true;
    }
    
    logout() {
        this.isAuthorized = false;
    }
}

@Component({
    selector: "my-app",
    template: `
        <h1>My First AngularJS Annotations Application</h1>
        <a ng-if="!myApp.securityService.isAuthorized" ng-click="myApp.securityService.login()">Login</a>
        <a ng-if="myApp.securityService.isAuthorized" ng-click="myApp.securityService.logout()">Logout</a>
    `,
    providers: [
        provide(SecurityService, { useClass: SecurityService })
    ]
})
export class AppComponent {
    @Inject()
    securityService: SecurityService;
}
```

#### Providers

You can add to a component or directive different type of providers. You just need to use to use the `provide` function from `angularjs-annotations/core`.

##### *Provide* Parameters:

- **`providerKey`**  **string|Class (required)**  The injection key. If `Injectable` Class is using, it will get its Class name as injector key.
- **`providable`**  **IProvidable**  Providable object to inject in angular. `IProvidable` properties are:
    - **`useClass`**  **Class** This represents a `Injectable` Class which will be injected as a `angular service`.
    - **`useFactory`**  **Class** This represents a `Injectable` Class which will be injected as a `angular factory`.
    - **`useValue`**  **Object** This represents an object which will be injected as a `angular value`.
    - **`useConstant`**  **Object** This represents an object which will be injected as a `angular constant`.

##### Exemple:

```typescript

import {Component, Injectable, provide} from "angularjs-annotations/core";

@Injectable()
class MyService {
}

@Injectable()
class MySecondService {
}

@Injectable()
class MyFactory {
}

var myValue = {};
var myConstant = {};

@Component({
    selector: "my-app",
    template: `
        <h1>My First AngularJS Annotations Application</h1>
    `,
    providers: [
        // will register MyService as an angular service with name 'MyService'
        MyService,
        // will register MySecondService as an angular service with name 'MySecondService'
        provide(MySecondService),
        // will register MyService as an angular service with name 'myService2'
        provide("myService2", { useClass: MyService }),
        // will register MyFactory as an angular factory with name 'MyFactory'
        provide(MyFactory, { useFactory: MyFactory }),
        provide("myValueKey", { useValue: myValue }),
        provide("myConstantKey", { useValue: myConstant })
    ]
})
export class AppComponent {
    @Inject()
    myService: MyService;

    @Inject("factoryKey")
    myService: MyFactory;

    @Inject()
    myService: MyService;

    @Inject()
    myService: MyService;
}
```

#### Pipe

If you need to create a `Pipe` (or `angular filter`), you just need to use to use the `Pipe` decorator and `PripeTransform` interface from `angularjs-annotations/core`.

You will then be able to reference it to your component/directive using the `pipes` parameter.

##### Pipe metadata Parameters:

- **`name`**  **string (required)**  The pipe named which will be used in the template.

##### Exemple:

```typescript
import {Component, Pipe, PipeTransform, Inject } from "angularjs-annotations/core";

@Pipe({ name: "upperCase"})
export class UpperCasePipe implements PipeTransform{
    @Inject("$http")
    private _http: angular.IHttpService;
    
    transform(value: string) {
        return this.upperCaseValue(value);
    }
    
    upperCaseValue(value:string):string{
        return (value || "").toUpperCase();
    }
}  

@Component({
    selector: "my-app",
    template: `
        <h1>My First AngularJS Annotations Application</h1>
        <h4>{{myApp.title | upperCase}}</h4>
    `,
    pipes: [UpperCasePipe]
})
export class AppComponent {
    @Inject()
    securityService: SecurityService;

    title: string;

    constructor(){
        this.title = "My first Pipe filter..."
    }
}
```

#### Inject

`Inject` decorator is a class property decorator. It will define which *AngularJs providers* you want to *inject* into your class by using *AngularJs injector service*.

##### Inject Parameter:

- **`name`**  **string**  The injection name. If not defined, It will then use the *property type* if `Injectable` metadata is defined. If not it will then use the *property name*.

##### Exemple:

```typescript
import {Inject} from "angularjs-annotations/core";

@Injectable()
export class SecurityService {
    isAuthorized: boolean;
    isAdmin: boolean;
    
    login() {
        this.isAuthorized = true;
    }
    
    logout() {
        this.isAuthorized = false;
    }
}

@Component({
    selector: "my-app",
    template: `
        <h1>My First AngularJS Annotations Application</h1>
    `,
    providers: [SecurityService]
})
export class AppComponent {
    @Inject()
    private _securityService: SecurityService;
    
    @Inject("$q")
    private _q: angular.IQService;

    @Inject()
    private $http: angular.IHttpService;

}
```

#### Run and Config blocks

You might need to define some specific config or run block for you angular module. To do this, you just need to use `@Config` or `@Run` decorators from `angularjs-annotations/core`.

##### Run / Config Parameter:

- **`options`**  **Class**  The `Config` or `Run` class to use as *angular module config or run block*.

##### Exemple:

```typescript

import { Component, Injectable, Inject, Config, provide } from "angularjs-annotations/core";

export const HTTP_INTERCEPTOR = "HttpInterceptorFactory";

@Injectable()
export class HttpInterceptor {
    @Inject("$q")
    private _q: angular.IQService;
    
    request(config: angular.IRequestConfig){
        console.log("'" + config.method + "' method on URL '" + config.url + "'");
        return config;
    }
    
    responseError(responseFailure){
        console.log("Http request error:", responseFailure);
    }
}

export class AppConfig {
    @Inject("$ocLazyLoadProvider")
    private _ocLazyLoadProvider: oc.ILazyLoadProvider;
    
    @Inject("$httpProvider")
    private _httpProvider: angular.IHttpProvider;

    @Inject()
    private $locationProvider: angular.ILocationProvider;
    
    constructor(){
        this.initialize();
    }
    
    initialize(){
        this._ocLazyLoadProvider.config({
            debug: true,
            events: true
        });
        
        this.$locationProvider.html5Mode(true);
        this._httpProvider.interceptors.push(HTTP_INTERCEPTOR);
    }
}

@Component({
    selector: "my-app",
    template: `<h1>My first angular annotations Application</h1>
        <h2>{{myApp.title}}</h2>
        `,
    styleUrls: ["app/app.component.css"],
    providers: [
        provide(HTTP_INTERCEPTOR, { useFactory: HttpInterceptor })
    ]
})
@Config(AppConfig)
class AppComponent {
    public title = "Tour of Heroes";

    @Inject()
    securityService: SecurityService;
}

export {AppComponent};
```


#### RouteConfig

Routing is using [angular-ui-router](https://github.com/angular-ui/ui-router). You can check the [wiki](https://github.com/angular-ui/ui-router/wiki) if you don't know how to use it.

The `@RouteConfig` decorator from `angularjs-annotations/router` will allow you to define in your component an array list of `IRouteDefinition`.

##### `IRouteDefinition` properties:

- **`path`**  **string|Class (required)**  The route definition (*state*) url.
- **`name`**  **string|Class (required)**  The route definition (*state*) name.
- **`useAsDefault`**  **boolean**  Value indicating whether route definition is the component default route.
- **`component`**  **Class**  The component we want to use as root component of the route. If a component is defined, it will be automatically registered in the module with its parent component.
- **`loader`**  **{path: string, name?:string}**  *WIP* represents an object with path of the component to lazy load and optionaly the name of exported component to load for the route.


#### Directive and Providers

When using the routing, you will need to register routing directives and providers from `angularjs-annotations/router`.

You will then be able to inject `Router` service to navigate in your component.

```typescript
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from "angularjs-annotations/router";
@Component({
    selector: "my-app",
    ...
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS
    ]
})
@RouteConfig([
    ...
])
class AppComponent {
    public title = "Tour of Heroes";

    @Inject()
    private _router: Router;
}
```

##### Exemple:

```typescript

import {Component, Directive, Inject, Config, provide} from "angularjs-annotations/core";
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from "angularjs-annotations/router";
import {HeroesComponent} from "app/heroes.component";
import {AppConfig} from "app/app.component.config"
import {HttpInterceptor, HTTP_INTERCEPTOR} from "app/http.interceptor"
import {SecurityService} from "app/security.service"
import {UpperCasePipe} from "app/uppercase.pipe"

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard.component.html',
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

```
