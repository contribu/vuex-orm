import { __assign, __extends } from "tslib";
import { mapValues } from '../support/Utils';
import Schema from '../schema/Schema';
import Model from '../model/Model';
import RootGetters from '../modules/RootGetters';
import RootActions from '../modules/RootActions';
import RootMutations from '../modules/RootMutations';
import Getters from '../modules/Getters';
import Actions from '../modules/Actions';
var Database = /** @class */ (function () {
    function Database() {
        /**
         * The list of entities. It contains models and modules with its name.
         * The name is going to be the namespace for the Vuex Modules.
         */
        this.entities = [];
        /**
         * The normalizr schema.
         */
        this.schemas = {};
        /**
         * Whether the database has already been installed to Vuex or not.
         * Model registration steps depend on its value.
         */
        this.isStarted = false;
    }
    /**
     * Initialize the database before a user can start using it.
     */
    Database.prototype.start = function (store, namespace) {
        this.store = store;
        this.namespace = namespace;
        this.connect();
        this.registerModules();
        this.createSchema();
        this.isStarted = true;
    };
    /**
     * Register a model and a module to Database.
     */
    Database.prototype.register = function (model, module) {
        if (module === void 0) { module = {}; }
        this.checkModelTypeMappingCapability(model);
        var entity = {
            name: model.entity,
            base: model.baseEntity || model.entity,
            model: this.createBindingModel(model),
            module: module
        };
        this.entities.push(entity);
        if (this.isStarted) {
            this.registerModule(entity);
            this.registerSchema(entity);
        }
    };
    Database.prototype.model = function (model) {
        var name = typeof model === 'string' ? model : model.entity;
        var m = this.models()[name];
        if (!m) {
            throw new Error("[Vuex ORM] Could not find the model `" + name + "`. Please check if you " +
                'have registered the model to the database.');
        }
        return m;
    };
    Database.prototype.baseModel = function (model) {
        var name = typeof model === 'string' ? model : model.entity;
        var m = this.baseModels()[name];
        if (!m) {
            throw new Error("[Vuex ORM] Could not find the model `" + name + "`. Please check if you " +
                'have registered the model to the database.');
        }
        return m;
    };
    /**
     * Get all models from the entities list.
     */
    Database.prototype.models = function () {
        return this.entities.reduce(function (models, entity) {
            models[entity.name] = entity.model;
            return models;
        }, {});
    };
    /**
     * Get all base models from the entities list.
     */
    Database.prototype.baseModels = function () {
        var _this = this;
        return this.entities.reduce(function (models, entity) {
            models[entity.name] = _this.model(entity.base);
            return models;
        }, {});
    };
    /**
     * Get the module of the given name from the entities list.
     */
    Database.prototype.module = function (name) {
        var module = this.modules()[name];
        if (!module) {
            throw new Error("[Vuex ORM] Could not find the module `" + name + "`. Please check if you " +
                'have registered the module to the database.');
        }
        return module;
    };
    /**
     * Get all modules from the entities list.
     */
    Database.prototype.modules = function () {
        return this.entities.reduce(function (modules, entity) {
            modules[entity.name] = entity.module;
            return modules;
        }, {});
    };
    /**
     * Get the root state from the store.
     */
    Database.prototype.getState = function () {
        return this.store.state[this.namespace];
    };
    /**
     * Create a new model that binds the database.
     */
    Database.prototype.createBindingModel = function (model) {
        var database = this;
        var c = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.store = function () {
                return database.store;
            };
            return class_1;
        }(model));
        Object.defineProperty(c, 'name', { get: function () { return model.name; } });
        return c;
    };
    /**
     * Create Vuex Module from the registered entities, and register to
     * the store.
     */
    Database.prototype.registerModules = function () {
        this.store.registerModule(this.namespace, this.createModule());
    };
    /**
     * Generate module from the given entity, and register to the store.
     */
    Database.prototype.registerModule = function (entity) {
        this.store.registerModule([this.namespace, entity.name], this.createSubModule(entity));
    };
    /**
     * Create Vuex Module from the registered entities.
     */
    Database.prototype.createModule = function () {
        var _this = this;
        var module = this.createRootModule();
        this.entities.forEach(function (entity) {
            module.modules[entity.name] = _this.createSubModule(entity);
        });
        return module;
    };
    /**
     * Create root module.
     */
    Database.prototype.createRootModule = function () {
        return {
            namespaced: true,
            state: this.createRootState(),
            getters: this.createRootGetters(),
            actions: this.createRootActions(),
            mutations: this.createRootMutations(),
            modules: {}
        };
    };
    /**
     * Create root state.
     */
    Database.prototype.createRootState = function () {
        var _this = this;
        return function () { return ({ $name: _this.namespace }); };
    };
    /**
     * Create root getters. For the getters, we bind the store instance to each
     * function to retrieve database instances within getters. We only need this
     * for the getter since actions and mutations are already bound to store.
     */
    Database.prototype.createRootGetters = function () {
        var _this = this;
        return mapValues(RootGetters, function (_getter, name) {
            return RootGetters[name].bind(_this.store);
        });
    };
    /**
     * Create root actions.
     */
    Database.prototype.createRootActions = function () {
        return RootActions;
    };
    /**
     * Create root mutations.
     */
    Database.prototype.createRootMutations = function () {
        return RootMutations;
    };
    /**
     * Create sub module.
     */
    Database.prototype.createSubModule = function (entity) {
        return {
            namespaced: true,
            state: this.createSubState(entity),
            getters: this.createSubGetters(entity),
            actions: this.createSubActions(entity),
            mutations: this.createSubMutations(entity)
        };
    };
    /**
     * Create sub state.
     */
    Database.prototype.createSubState = function (entity) {
        var _this = this;
        var name = entity.name, model = entity.model, module = entity.module;
        var modelState = typeof model.state === 'function' ? model.state() : model.state;
        var moduleState = typeof module.state === 'function' ? module.state() : module.state;
        return function () { return (__assign(__assign(__assign({}, modelState), moduleState), { $connection: _this.namespace, $name: name, data: {} })); };
    };
    /**
     * Create sub getters.
     */
    Database.prototype.createSubGetters = function (entity) {
        return __assign(__assign({}, Getters), entity.module.getters);
    };
    /**
     * Create sub actions.
     */
    Database.prototype.createSubActions = function (entity) {
        return __assign(__assign({}, Actions), entity.module.actions);
    };
    /**
     * Create sub mutations.
     */
    Database.prototype.createSubMutations = function (entity) {
        var _a;
        return _a = entity.module.mutations, (_a !== null && _a !== void 0 ? _a : {});
    };
    /**
     * Create the schema definition from registered entities list and set it to
     * the `schema` property. This schema will be used by the normalizer
     * to normalize data before persisting them to the Vuex Store.
     */
    Database.prototype.createSchema = function () {
        var _this = this;
        this.entities.forEach(function (entity) {
            _this.registerSchema(entity);
        });
    };
    /**
     * Generate schema from the given entity.
     */
    Database.prototype.registerSchema = function (entity) {
        this.schemas[entity.name] = Schema.create(entity.model);
    };
    /**
     * Inject database to the store instance.
     */
    Database.prototype.connect = function () {
        var _this = this;
        this.store.$db = function () { return _this; };
    };
    /**
     * Warn user if the given model is a type of an inherited model that is being
     * defined without overwriting `Model.types()` because the user will not be
     * able to use the type mapping feature in this case.
     */
    Database.prototype.checkModelTypeMappingCapability = function (model) {
        // We'll not be logging any warning if it's on a production environment,
        // so let's return here if it is.
        /* istanbul ignore next */
        if (process.env.NODE_ENV === 'production') {
            return;
        }
        // If the model doesn't have `baseEntity` property set, we'll assume it is
        // not an inherited model so we can stop here.
        if (!model.baseEntity) {
            return;
        }
        // Now it seems like the model is indeed an inherited model. Let's check if
        // it has `types()` method declared, or we'll warn the user that it's not
        // possible to use type mapping feature.
        var baseModel = this.model(model.baseEntity);
        if (baseModel && baseModel.types === Model.types) {
            console.warn("[Vuex ORM] Model `" + model.name + "` extends `" + baseModel.name + "` which doesn't " +
                'overwrite Model.types(). You will not be able to use type mapping.');
        }
    };
    return Database;
}());
export default Database;
//# sourceMappingURL=Database.js.map