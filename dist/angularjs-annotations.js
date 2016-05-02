var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("angularjs-annotations/core/types", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("angularjs-annotations/core/core.utils", ["require", "exports"], function (require, exports) {
    "use strict";
    function normalize(s) {
        var normalized = _.isString(s)
            ? s.replace(/[A-Z]/g, function (ch) { return "-" + String.fromCharCode(ch.charCodeAt(0) | 32); })
            : s;
        normalized = normalized.replace(/^-+/g, "");
        return normalized;
    }
    exports.normalize = normalize;
    function deNormalize(s) {
        var normalized = _.isString(s)
            ? s.replace(/\-[a-z]/g, function (ch) { return ch.substr(1, 1).toUpperCase(); })
            : s;
        normalized = normalized.replace(/^-+/g, "");
        return normalized;
    }
    exports.deNormalize = deNormalize;
});
define("angularjs-annotations/core/metadata/injectable.metadata", ["require", "exports", "angularjs-annotations/core/core.utils"], function (require, exports, core_utils_1) {
    "use strict";
    var InjectableMetadata = (function () {
        function InjectableMetadata() {
        }
        InjectableMetadata.prototype.getInjectionName = function (provider) {
            if (this["name"]) {
                return this["name"];
            }
            if (this["selector"]) {
                return this.getSelectorInjectionName();
            }
            return this.getClassName(provider);
        };
        InjectableMetadata.prototype.getClassName = function (provider) {
            var self = provider ? provider : this.constructor;
            if (self.name) {
                return self.name;
            }
            return self.toString().match(/^function\s*([^\s(]+)/)[1];
        };
        InjectableMetadata.prototype.getSelectorInjectionName = function () {
            var selector = this["selector"].trim();
            if (selector.match(/\[[a-zA-Z0-9\-_]+\]/ig)) {
                var match = selector.match(/\[[a-zA-Z0-9\-_]+\]/ig)[0];
                return core_utils_1.deNormalize(match.substring(1, match.length - 1));
            }
            if (selector.substr(0, 1) === ".") {
                return core_utils_1.deNormalize(selector.substr(1));
            }
            return core_utils_1.deNormalize(selector);
        };
        return InjectableMetadata;
    }());
    exports.InjectableMetadata = InjectableMetadata;
});
define("angularjs-annotations/core/metadata/directive.metadata", ["require", "exports", "angularjs-annotations/core/metadata/injectable.metadata"], function (require, exports, injectable_metadata_1) {
    "use strict";
    var DirectiveMetadata = (function (_super) {
        __extends(DirectiveMetadata, _super);
        function DirectiveMetadata(data) {
            _super.call(this);
            this.selector = data.selector;
            this.template = data.template;
            this.templateUrl = data.templateUrl;
            this.exportAs = data.exportAs;
            this.events = data.events;
            this.providers = data.providers;
            this.properties = data.properties;
            this.replace = data.replace;
        }
        DirectiveMetadata.prototype.getLinkedClasses = function () {
            return this.getLinkedClassesFromSource(this.providers);
        };
        DirectiveMetadata.prototype.getLinkedClassesFromSource = function (source) {
            var _this = this;
            var result = _.filter(source || [], function (provider) { return _.isFunction(provider); }) || [];
            _.filter(source || [], function (provider) { return _.isArray(provider); }).forEach(function (providerList) {
                result = _.union(result, _this.getLinkedClassesFromSource(providerList));
            });
            return result;
        };
        return DirectiveMetadata;
    }(injectable_metadata_1.InjectableMetadata));
    exports.DirectiveMetadata = DirectiveMetadata;
});
define("angularjs-annotations/core/metadata/component.metadata", ["require", "exports", "angularjs-annotations/core/metadata/directive.metadata"], function (require, exports, directive_metadata_1) {
    "use strict";
    var ComponentMetadata = (function (_super) {
        __extends(ComponentMetadata, _super);
        function ComponentMetadata(data) {
            _super.call(this, data);
            if (!(/^[a-zA-Z0-9\-_]+$/ig).test(data.selector)) {
                throw new TypeError("Component selector should be alphanumeric");
            }
            this.directives = data.directives || [];
            this.styles = data.styles || [];
            this.styleUrls = data.styleUrls || [];
        }
        ComponentMetadata.prototype.getLinkedClasses = function () {
            var providers = _super.prototype.getLinkedClasses.call(this);
            var directives = this.getLinkedClassesFromSource(this.directives);
            return _.union(providers, directives);
        };
        return ComponentMetadata;
    }(directive_metadata_1.DirectiveMetadata));
    exports.ComponentMetadata = ComponentMetadata;
});
define("angularjs-annotations/core/metadata/injection.metadata", ["require", "exports"], function (require, exports) {
    "use strict";
    var InjectionMetadata = (function () {
        function InjectionMetadata() {
            this.data = [];
        }
        return InjectionMetadata;
    }());
    exports.InjectionMetadata = InjectionMetadata;
});
define("angularjs-annotations/core/metadata/input.metadata", ["require", "exports"], function (require, exports) {
    "use strict";
    var InputMetadata = (function () {
        function InputMetadata() {
            this.data = [];
        }
        return InputMetadata;
    }());
    exports.InputMetadata = InputMetadata;
});
define("angularjs-annotations/core/metadata/providers.metadata", ["require", "exports", "angularjs-annotations/core/metadata/injectable.metadata"], function (require, exports, injectable_metadata_2) {
    "use strict";
    var ServiceMetadata = (function (_super) {
        __extends(ServiceMetadata, _super);
        function ServiceMetadata() {
            _super.call(this);
        }
        return ServiceMetadata;
    }(injectable_metadata_2.InjectableMetadata));
    exports.ServiceMetadata = ServiceMetadata;
    var FactoryMetadata = (function (_super) {
        __extends(FactoryMetadata, _super);
        function FactoryMetadata() {
            _super.call(this);
        }
        return FactoryMetadata;
    }(injectable_metadata_2.InjectableMetadata));
    exports.FactoryMetadata = FactoryMetadata;
    var ProviderMetadata = (function (_super) {
        __extends(ProviderMetadata, _super);
        function ProviderMetadata() {
            _super.call(this);
        }
        return ProviderMetadata;
    }(injectable_metadata_2.InjectableMetadata));
    exports.ProviderMetadata = ProviderMetadata;
    var FilterMetadata = (function (_super) {
        __extends(FilterMetadata, _super);
        function FilterMetadata() {
            _super.call(this);
        }
        return FilterMetadata;
    }(injectable_metadata_2.InjectableMetadata));
    exports.FilterMetadata = FilterMetadata;
});
define("angularjs-annotations/core/decorators.utils", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.METADATA_KEY = "angularjs-annotations:metadata";
    function defineMetadata(value) {
        function decorator(target, targetKey) {
            if (!_.isUndefined(targetKey)) {
                if (!_.isObject(target)) {
                    throw new TypeError();
                }
                targetKey = setPropertyKey(targetKey);
                var metadata = Reflect.getMetadata(exports.METADATA_KEY, target, targetKey) || [];
                metadata.push(value);
                Reflect.defineMetadata(exports.METADATA_KEY, metadata, target, targetKey);
            }
            else {
                if (!_.isFunction(target)) {
                    throw new TypeError();
                }
                var metadata = Reflect.getMetadata(exports.METADATA_KEY, target) || [];
                metadata.push(value);
                Reflect.defineMetadata(exports.METADATA_KEY, metadata, target);
            }
        }
        return decorator;
    }
    exports.defineMetadata = defineMetadata;
    function setPropertyKey(value) {
        if (typeof value === "symbol") {
            return value;
        }
        return String(value);
    }
    exports.setPropertyKey = setPropertyKey;
});
define("angularjs-annotations/core/decorators", ["require", "exports", "angularjs-annotations/core/metadata/directive.metadata", "angularjs-annotations/core/metadata/component.metadata", "angularjs-annotations/core/metadata/injection.metadata", "angularjs-annotations/core/metadata/input.metadata", "angularjs-annotations/core/metadata/providers.metadata", "angularjs-annotations/core/decorators.utils"], function (require, exports, directive_metadata_2, component_metadata_1, injection_metadata_1, input_metadata_1, providers_metadata_1, decorators_utils_1) {
    "use strict";
    function Directive(options) {
        return decorators_utils_1.defineMetadata(new directive_metadata_2.DirectiveMetadata(options));
    }
    exports.Directive = Directive;
    function Component(options) {
        return decorators_utils_1.defineMetadata(new component_metadata_1.ComponentMetadata(options));
    }
    exports.Component = Component;
    function Service() {
        return decorators_utils_1.defineMetadata(new providers_metadata_1.ServiceMetadata());
    }
    exports.Service = Service;
    function Factory() {
        return decorators_utils_1.defineMetadata(new providers_metadata_1.FactoryMetadata());
    }
    exports.Factory = Factory;
    function Provider() {
        return decorators_utils_1.defineMetadata(new providers_metadata_1.ProviderMetadata());
    }
    exports.Provider = Provider;
    function Filter() {
        return decorators_utils_1.defineMetadata(new providers_metadata_1.FilterMetadata());
    }
    exports.Filter = Filter;
    function Inject(name) {
        return function (target, targetKey) {
            var types = Reflect.getMetadata("design:type", target, targetKey);
            var targetClass = target.prototype ? target : target.constructor;
            var metadata = Reflect.getMetadata(decorators_utils_1.METADATA_KEY, targetClass) || [];
            var injectionMetaData = _.find(metadata, function (item) { return item instanceof injection_metadata_1.InjectionMetadata; });
            if (!injectionMetaData) {
                injectionMetaData = new injection_metadata_1.InjectionMetadata();
                metadata.push(injectionMetaData);
            }
            injectionMetaData.data.push({
                injectionName: name,
                propertyName: targetKey,
                propertyType: types
            });
            Reflect.defineMetadata(decorators_utils_1.METADATA_KEY, metadata, targetClass);
        };
    }
    exports.Inject = Inject;
    function Input(name) {
        return function (target, targetKey) {
            var types = Reflect.getMetadata("design:type", target, targetKey);
            var targetClass = target.prototype ? target : target.constructor;
            var metadata = Reflect.getMetadata(decorators_utils_1.METADATA_KEY, targetClass) || [];
            var inputMetaData = _.find(metadata, function (item) { return item instanceof input_metadata_1.InputMetadata; });
            if (!inputMetaData) {
                inputMetaData = new input_metadata_1.InputMetadata();
                metadata.push(inputMetaData);
            }
            inputMetaData.data.push({
                inputName: name,
                propertyName: targetKey,
                propertyType: types
            });
            Reflect.defineMetadata(decorators_utils_1.METADATA_KEY, metadata, targetClass);
        };
    }
    exports.Input = Input;
});
define("angularjs-annotations/core", ["require", "exports", "angularjs-annotations/core/decorators"], function (require, exports, decorators_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(decorators_1);
});
define("angularjs-annotations/router/metadata/route.config.metadata", ["require", "exports"], function (require, exports) {
    "use strict";
    var RouteConfigMetadata = (function () {
        function RouteConfigMetadata(data) {
            this.data = data;
            if (_.any(data, function (item) { return !item.loader && !item.component; })) {
                throw new TypeError("Either component or loader method should be defined in a route definition.");
            }
        }
        return RouteConfigMetadata;
    }());
    exports.RouteConfigMetadata = RouteConfigMetadata;
});
define("angularjs-annotations/router/directives/require.loader", ["require", "exports", "angularjs-annotations/core/decorators.utils", "angularjs-annotations/core/metadata/component.metadata", "angularjs-annotations/core/decorators", "angularjs-annotations/platform/browser"], function (require, exports, decorators_utils_2, component_metadata_2, decorators_2, browser_1) {
    "use strict";
    exports.REQUIRE_LOADER = "requirejs-loader";
    var RequireLoader = (function () {
        function RequireLoader() {
        }
        RequireLoader.prototype.link = function (scope, element, attributes) {
            var _this = this;
            if (!this.loader) {
                this.loader = {
                    path: attributes["path"],
                    name: attributes["name"]
                };
            }
            this.load(this.loader.name, this.loader.path).then(function (component) {
                var metadatas = Reflect.getMetadata(decorators_utils_2.METADATA_KEY, component);
                var metadata = _.find(metadatas, function (metadata) { return metadata instanceof component_metadata_2.ComponentMetadata; });
                if (!metadata) {
                    throw new TypeError("This route object is not a component. Route: " + _this.loader.path);
                }
                browser_1.compile(component);
                element.append(angular.element("<" + metadata.selector + "></" + metadata.selector + ">"));
            });
        };
        RequireLoader.prototype.load = function (name, path) {
            var defer = this._q.defer();
            require([path], function (component) {
                defer.resolve(component[name]);
            });
            return defer.promise;
        };
        __decorate([
            decorators_2.Inject("$compile"), 
            __metadata('design:type', Function)
        ], RequireLoader.prototype, "_compile", void 0);
        __decorate([
            decorators_2.Inject("$q"), 
            __metadata('design:type', Function)
        ], RequireLoader.prototype, "_q", void 0);
        __decorate([
            decorators_2.Input(), 
            __metadata('design:type', Object)
        ], RequireLoader.prototype, "loader", void 0);
        RequireLoader = __decorate([
            decorators_2.Directive({
                selector: exports.REQUIRE_LOADER,
            }), 
            __metadata('design:paramtypes', [])
        ], RequireLoader);
        return RequireLoader;
    }());
    exports.RequireLoader = RequireLoader;
});
define("angularjs-annotations/router/providers/router", ["require", "exports", "angularjs-annotations/core/decorators"], function (require, exports, decorators_3) {
    "use strict";
    var Router = (function () {
        function Router() {
        }
        Object.defineProperty(Router.prototype, "routes", {
            get: function () {
                return this._state.get();
            },
            enumerable: true,
            configurable: true
        });
        Router.prototype.getParam = function (name) {
            return this._stateParams[name];
        };
        Router.prototype.navigate = function (stateName, params, options) {
            this._state.go(stateName, params, options);
        };
        Router.prototype.goBack = function (distance) {
            window.history.back(distance);
        };
        __decorate([
            decorators_3.Inject("$state"), 
            __metadata('design:type', Object)
        ], Router.prototype, "_state", void 0);
        __decorate([
            decorators_3.Inject("$stateParams"), 
            __metadata('design:type', Object)
        ], Router.prototype, "_stateParams", void 0);
        Router = __decorate([
            decorators_3.Service(), 
            __metadata('design:paramtypes', [])
        ], Router);
        return Router;
    }());
    exports.Router = Router;
});
define("angularjs-annotations/platform/browser", ["require", "exports", "angularjs-annotations/core/decorators.utils", "angularjs-annotations/core/metadata/injectable.metadata", "angularjs-annotations/core/metadata/injection.metadata", "angularjs-annotations/core/metadata/directive.metadata", "angularjs-annotations/core/metadata/component.metadata", "angularjs-annotations/core/metadata/input.metadata", "angularjs-annotations/router/metadata/route.config.metadata", "angularjs-annotations/router/directives/require.loader", "angularjs-annotations/core/metadata/providers.metadata"], function (require, exports, decorators_utils_3, injectable_metadata_3, injection_metadata_2, directive_metadata_3, component_metadata_3, input_metadata_2, route_config_metadata_1, require_loader_1, providers_metadata_2) {
    "use strict";
    var __Modules = {};
    var __BootstrapApplication__;
    exports.UI_ROUTER = "ui.router";
    var ApplicationModule = (function () {
        function ApplicationModule(name, modules) {
            this.name = name;
            this._routes = [];
            this._registeredClass = [];
            var dependencies = [];
            _.each(modules || [], function (item) { return dependencies.push(_.isString(item) ? item : item.name); });
            var module = this._module;
            if (!module) {
                this._module = angular.module(name, dependencies);
                this.configureRouting();
            }
            else {
                var deps = _.difference(dependencies, module.requires || []);
                module.requires = _.union(module.requires, deps);
            }
        }
        Object.defineProperty(ApplicationModule.prototype, "_module", {
            get: function () {
                return __Modules[this.name];
            },
            set: function (value) {
                __Modules[this.name] = value;
            },
            enumerable: true,
            configurable: true
        });
        ApplicationModule.prototype.add = function () {
            var _this = this;
            var providers = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                providers[_i - 0] = arguments[_i];
            }
            _.each(providers, function (provider) {
                if (_this.isDirective(provider)) {
                    _this.registerDirective(provider);
                    return;
                }
                if (_this.isService(provider)) {
                    _this.registerService(provider);
                }
            });
            return this;
        };
        ApplicationModule.prototype.config = function (config) {
            if (!this._module) {
                throw new ReferenceError("The module should be define before adding configuration method");
            }
            this._module.config(config);
            return this;
        };
        ApplicationModule.prototype.run = function (initialization) {
            if (!this._module) {
                throw new ReferenceError("The module should be define before adding initialization method");
            }
            this._module.run(initialization);
            return this;
        };
        ApplicationModule.prototype.registerDependency = function (componentModule) {
            this._module.requires = this._module.requires || [];
            this._module.requires.push(componentModule.name);
        };
        ApplicationModule.prototype.setAsRegistered = function (name) {
            this._registeredClass.push(name);
        };
        ApplicationModule.prototype.isRegistered = function (name) {
            return this._registeredClass.indexOf(name) > -1;
        };
        ApplicationModule.prototype.registerRoutes = function (provider) {
            var _this = this;
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            var routeMetadata = _.find(metadatas, function (metadata) { return metadata instanceof route_config_metadata_1.RouteConfigMetadata; });
            if (!routeMetadata) {
                return;
            }
            if (this._module.requires.indexOf(exports.UI_ROUTER) === -1) {
                this._module.requires.push(exports.UI_ROUTER);
            }
            if (_.any(routeMetadata.data, function (route) { return _.any(_this._routes, function (r) { return r.name === route.name; }); })) {
                throw new Error("Route definition name should be unique");
            }
            _.filter(routeMetadata.data, function (routeDef) { return !!routeDef.component && _.isFunction(routeDef.component); }).forEach(function (routeDef) { return _this.add(routeDef.component); });
            this._routes = _.union(this._routes, routeMetadata.data);
        };
        ApplicationModule.prototype.registerDirective = function (provider) {
            var _this = this;
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            var directiveMetadata = _.find(metadatas, function (metadata) { return metadata instanceof directive_metadata_3.DirectiveMetadata; });
            if (!directiveMetadata) {
                return;
            }
            var name = directiveMetadata.getInjectionName(provider);
            if (this.isRegistered(name)) {
                return;
            }
            if (!directiveMetadata.selector) {
                throw new Error("Directive selector should be define");
            }
            if (this.isComponent(provider)) {
                this.registerRoutes(provider);
            }
            var inputMetadata = _.find(metadatas, function (metadata) { return metadata instanceof input_metadata_2.InputMetadata; });
            if (inputMetadata && inputMetadata.data.length > 0) {
                directiveMetadata.properties = _.union(directiveMetadata.properties || [], _.map(inputMetadata.data, function (inputData) {
                    return inputData.propertyName + ": =" + (inputData.inputName || "");
                }));
            }
            var directive = {};
            directive.restrict = this.getDirectiveRestriction(directiveMetadata.selector.trim());
            directive.controllerAs = directiveMetadata.exportAs || name;
            if (directiveMetadata.template) {
                directive.template = directiveMetadata.template;
            }
            else if (directiveMetadata.templateUrl) {
                directive.templateUrl = directiveMetadata.templateUrl;
            }
            directive.replace = directiveMetadata.replace || false;
            directive.link = this.getDirectiveLinkFunction(provider, directiveMetadata);
            if (provider["compile"]) {
                directive.compile = provider["compile"];
            }
            directive.controller = this.getInlineAnnotatedFunction(provider);
            this._module.directive(name, function () { return directive; });
            this.setAsRegistered(name);
            var linkedClasses = directiveMetadata.getLinkedClasses();
            if (_.isEmpty(linkedClasses)) {
                return;
            }
            _.each(linkedClasses, function (linkedClass) { return _this.add(linkedClass); });
        };
        ApplicationModule.prototype.getDirectiveLinkFunction = function (provider, metadata) {
            var _this = this;
            var controllerName = metadata.exportAs || metadata.getInjectionName(provider);
            return function (scope, element, attributes, controllers) {
                if (scope[controllerName] && _.isFunction(scope[controllerName].link)) {
                    scope[controllerName].link(scope, element, attributes, controllers);
                }
                scope["__styles__"] = {};
                _.each((metadata["styles"] || []), function (style, index) {
                    var code = controllerName + "_style_" + index;
                    scope["__styles__"][code] = _this.formatStyleTag(style, code);
                    $(document).find("head").append(scope["__styles__"][code]);
                });
                _.each((metadata["styleUrls"] || []), function (style, index) {
                    var code = controllerName + "_style_" + index;
                    scope["__styles__"][code] = _this.formatStyleTag(style, code, true);
                    $(document).find("head").append(scope["__styles__"][code]);
                });
                scope.$on('$destroy', function () {
                    if (scope[controllerName] && _.isFunction(scope[controllerName].ngOnDestroy)) {
                        scope[controllerName].ngOnDestroy();
                    }
                    _.each(scope["__styles__"], function (value, key) {
                        $(document).find("head link[type='text/css'][data-code='" + key + "'],head style[type='text/css'][data-code='" + key + "']").remove();
                    });
                });
                var to;
                var listener = scope.$watch(function () {
                    clearTimeout(to);
                    to = setTimeout(function () {
                        listener();
                        if (scope[controllerName] && _.isFunction(scope[controllerName].ngOnInit) && !scope[controllerName].__ngIsInit__) {
                            scope[controllerName].ngOnInit();
                            scope[controllerName].__ngIsInit__ = true;
                        }
                    }, 50);
                });
            };
        };
        ApplicationModule.prototype.getDirectiveRestriction = function (selector) {
            if (selector.match(/\[[a-zA-Z0-9\-_]+\]/ig)) {
                return "A";
            }
            if (selector.substr(0, 1) === ".") {
                return "C";
            }
            return "E";
        };
        ApplicationModule.prototype.registerService = function (provider) {
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            var serviceMetadata = _.find(metadatas, function (metadata) { return metadata instanceof providers_metadata_2.ServiceMetadata; });
            if (!serviceMetadata) {
                return;
            }
            var name = serviceMetadata.getInjectionName(provider);
            if (this.isRegistered(name)) {
                return;
            }
            var annotatedFunction = this.getInlineAnnotatedFunction(provider);
            this._module.service(name, annotatedFunction);
            this.setAsRegistered(name);
        };
        ApplicationModule.prototype.registerFactory = function (provider) {
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            var factoryMetadata = _.find(metadatas, function (metadata) { return metadata instanceof providers_metadata_2.FactoryMetadata; });
            if (!factoryMetadata) {
                return;
            }
            var name = factoryMetadata.getInjectionName(provider);
            if (this.isRegistered(name)) {
                return;
            }
            var annotatedFunction = this.getInlineAnnotatedFunction(provider);
            this._module.factory(name, function () { return annotatedFunction; });
            this.setAsRegistered(name);
        };
        ApplicationModule.prototype.getInlineAnnotatedFunction = function (provider) {
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            var injection = _.find(metadatas, function (metadata) { return metadata instanceof injection_metadata_2.InjectionMetadata; });
            if (!injection || _.isEmpty(injection.data)) {
                return provider;
            }
            var result = [];
            _.each(injection.data, function (param) {
                if (param.injectionName) {
                    result.push(param.injectionName);
                    return;
                }
                if (!param.propertyType) {
                    result.push(param.propertyName);
                    return;
                }
                var injectedTypeMetadata = _.find(Reflect.getMetadata(decorators_utils_3.METADATA_KEY, param.propertyType) || [], function (metadata) { return metadata instanceof injectable_metadata_3.InjectableMetadata; });
                if (!injectedTypeMetadata) {
                    result.push(param.propertyName);
                    return;
                }
                result.push(injectedTypeMetadata.getInjectionName(param.propertyType));
            });
            var annotatedFunc = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var providerArguments = args.slice(injection.data.length);
                var obj = ApplicationModule.construct(provider, providerArguments);
                for (var index = 0; index < injection.data.length; index++) {
                    obj[injection.data[index].propertyName] = args[index];
                }
                return obj;
            };
            annotatedFunc.prototype = provider.prototype;
            result.push(annotatedFunc);
            return result;
        };
        ApplicationModule.construct = function (constructor, args) {
            var component = function () {
                return constructor.apply(this, args);
            };
            component.prototype = constructor.prototype;
            return new component();
        };
        ApplicationModule.prototype.isUrl = function (text) {
            var regexp = new RegExp('^(https?:\/\/)?' +
                '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' +
                '((\d{1,3}\.){3}\d{1,3}))' +
                '(\:\d+)?(\/[-a-z\d%_.~+]*)*' +
                '(\?[;&a-z\d%_.~+=-]*)?' +
                '(\#[-a-z\d_]*)?$', 'i');
            return regexp.test(text);
        };
        ApplicationModule.prototype.formatStyleTag = function (style, code, isUrl) {
            if (isUrl) {
                return "<link rel=\"stylesheet\" type=\"text/css\" data-code=\"" + code + "\" href=\"" + style + "\" />";
            }
            return "<style type=\"text/css\" data-code=\"" + code + "\">" + style + "</style>";
        };
        ApplicationModule.prototype.isDirective = function (provider) {
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            return _.any(metadatas, function (metadata) { return metadata instanceof directive_metadata_3.DirectiveMetadata; });
        };
        ApplicationModule.prototype.isComponent = function (provider) {
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            return _.any(metadatas, function (metadata) { return metadata instanceof component_metadata_3.ComponentMetadata; });
        };
        ApplicationModule.prototype.isService = function (provider) {
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            return _.any(metadatas, function (metadata) { return metadata instanceof providers_metadata_2.ServiceMetadata; });
        };
        ApplicationModule.prototype.isFactory = function (provider) {
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            return _.any(metadatas, function (metadata) { return metadata instanceof providers_metadata_2.FactoryMetadata; });
        };
        ApplicationModule.prototype.isProvider = function (provider) {
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            return _.any(metadatas, function (metadata) { return metadata instanceof providers_metadata_2.ProviderMetadata; });
        };
        ApplicationModule.prototype.isFilter = function (provider) {
            var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, provider);
            return _.any(metadatas, function (metadata) { return metadata instanceof providers_metadata_2.FilterMetadata; });
        };
        ApplicationModule.prototype.configureRouting = function () {
            var _this = this;
            this._module.config(["$stateProvider", "$urlRouterProvider",
                function ($stateProvider, $urlRouterProvider) {
                    var defaultRoute = _.find(_this._routes, function (route) { return route.useAsDefault; });
                    if (defaultRoute) {
                        $urlRouterProvider.otherwise(defaultRoute.name);
                    }
                    _.each(_this._routes, function (route) {
                        if (!route.component && route.loader) {
                            $stateProvider.state({
                                url: route.path,
                                template: "<" + require_loader_1.REQUIRE_LOADER + " path=\"" + route.loader.path + "\" name=\"" + route.loader.name + "\"></" + require_loader_1.REQUIRE_LOADER + ">",
                                name: route.name,
                                $$routeDefinition: route
                            });
                            return;
                        }
                        var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, route.component);
                        var metadata = _.find(metadatas, function (metadata) { return metadata instanceof component_metadata_3.ComponentMetadata; });
                        if (!metadata) {
                            throw new TypeError("This route object is not a component. Route: " + route.name);
                        }
                        $stateProvider.state({
                            url: route.path,
                            template: "<" + metadata.selector + "></" + metadata.selector + ">",
                            name: route.name,
                            $$routeDefinition: route
                        });
                    });
                }]);
        };
        ApplicationModule.prototype.getTemplateProvider = function (route) {
            if (!route.loader) {
                throw new Error("You have to specify a loader method");
            }
            return ["$q", function ($q) {
                    return require([route.loader.path], function (exportedComponent) {
                        var component = route.loader.name ? exportedComponent[route.loader.name] : exportedComponent;
                        var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, component);
                        var metadata = _.find(metadatas, function (metadata) { return metadata instanceof component_metadata_3.ComponentMetadata; });
                        if (!metadata) {
                            throw new TypeError("This imported object is not a component. Path: " + route.loader.path + " ; Name: " + route.loader.name);
                        }
                        return "<" + metadata.selector + "></" + metadata.selector + ">";
                    });
                }];
        };
        return ApplicationModule;
    }());
    exports.ApplicationModule = ApplicationModule;
    function module(name, modules) {
        return new ApplicationModule(name, modules);
    }
    function compile(component, modules) {
        var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, component);
        var componentMetadata = _.find(metadatas, function (metadata) { return metadata instanceof component_metadata_3.ComponentMetadata; });
        if (!componentMetadata) {
            throw new TypeError("Only module component can be compiled");
        }
        var name = componentMetadata.getInjectionName(component);
        var appModule = compileComponent(name, component, modules);
        if (__BootstrapApplication__) {
            __BootstrapApplication__.registerDependency(appModule);
        }
        return appModule;
    }
    exports.compile = compile;
    function compileComponent(name, component, modules) {
        return module(name, modules).add(component);
    }
    function bootstrap(component, modules) {
        var metadatas = Reflect.getMetadata(decorators_utils_3.METADATA_KEY, component);
        var componentMetadata = _.find(metadatas, function (metadata) { return metadata instanceof component_metadata_3.ComponentMetadata; });
        if (!componentMetadata) {
            throw new TypeError("Only module component can be bootstrapped");
        }
        var name = componentMetadata.getInjectionName(component);
        var appModule = compileComponent(name, component, modules);
        var element = angular.element(componentMetadata.selector);
        if (element.length === 0) {
            console.log("Application not bootstrapped because selector \"" + componentMetadata.selector + "\" not found.");
            return;
        }
        angular.bootstrap(element, [name]);
        $(element).addClass("ng-app: " + name);
        __BootstrapApplication__ = appModule;
    }
    exports.bootstrap = bootstrap;
});
define("angularjs-annotations/router/decorators", ["require", "exports", "angularjs-annotations/router/metadata/route.config.metadata", "angularjs-annotations/core/decorators.utils"], function (require, exports, route_config_metadata_2, decorators_utils_4) {
    "use strict";
    function RouteConfig(options) {
        return decorators_utils_4.defineMetadata(new route_config_metadata_2.RouteConfigMetadata(options));
    }
    exports.RouteConfig = RouteConfig;
});
define("angularjs-annotations/router/directives/router.outlet", ["require", "exports", "angularjs-annotations/core/decorators"], function (require, exports, decorators_4) {
    "use strict";
    var RouterOutlet = (function () {
        function RouterOutlet() {
        }
        RouterOutlet = __decorate([
            decorators_4.Directive({
                selector: "router-outlet",
                template: "<div ui-view></div>",
            }), 
            __metadata('design:paramtypes', [])
        ], RouterOutlet);
        return RouterOutlet;
    }());
    exports.RouterOutlet = RouterOutlet;
});
define("angularjs-annotations/router", ["require", "exports", "angularjs-annotations/router/decorators", "angularjs-annotations/router/directives/router.outlet", "angularjs-annotations/router/directives/require.loader", "angularjs-annotations/router/providers/router"], function (require, exports, decorators_5, router_outlet_1, require_loader_2, router_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(decorators_5);
    exports.Router = router_1.Router;
    exports.ROUTER_DIRECTIVES = [router_outlet_1.RouterOutlet, require_loader_2.RequireLoader];
    exports.ROUTER_PROVIDERS = [router_1.Router];
});
