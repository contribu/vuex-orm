import { __awaiter, __generator } from "tslib";
import Utils from '../support/Utils';
import Uid from '../support/Uid';
import Container from '../container/Container';
import * as Attributes from '../attributes';
import { toAttributes, toJson } from './Serialize';
var Model = /** @class */ (function () {
    /**
     * Create a new model instance.
     */
    function Model(record) {
        /**
         * The index ID for the model.
         */
        this.$id = null;
        this.$fill(record);
    }
    /**
     * The definition of the fields of the model and its relations.
     */
    Model.fields = function () {
        return {};
    };
    /**
     * Create an attr attribute.
     */
    Model.attr = function (value, mutator) {
        return new Attributes.Attr(this, value, mutator);
    };
    /**
     * Create a string attribute.
     */
    Model.string = function (value, mutator) {
        return new Attributes.String(this, value, mutator);
    };
    /**
     * Create a number attribute.
     */
    Model.number = function (value, mutator) {
        return new Attributes.Number(this, value, mutator);
    };
    /**
     * Create a boolean attribute.
     */
    Model.boolean = function (value, mutator) {
        return new Attributes.Boolean(this, value, mutator);
    };
    /**
     * Create an uid attribute.
     */
    Model.uid = function (value) {
        return new Attributes.Uid(this, value);
    };
    /**
     * @deprecated Use `uid` attribute instead.
     */
    Model.increment = function () {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[Vuex ORM] Attribute type `increment` has been deprecated and replaced with `uid`.');
        }
        return this.uid();
    };
    /**
     * Create a has one relationship.
     */
    Model.hasOne = function (related, foreignKey, localKey) {
        return new Attributes.HasOne(this, related, foreignKey, this.localKey(localKey));
    };
    /**
     * Create a belongs to relationship.
     */
    Model.belongsTo = function (parent, foreignKey, ownerKey) {
        return new Attributes.BelongsTo(this, parent, foreignKey, this.relation(parent).localKey(ownerKey));
    };
    /**
     * Create a has many relationship.
     */
    Model.hasMany = function (related, foreignKey, localKey) {
        return new Attributes.HasMany(this, related, foreignKey, this.localKey(localKey));
    };
    /**
     * Create a has many by relationship.
     */
    Model.hasManyBy = function (parent, foreignKey, ownerKey) {
        return new Attributes.HasManyBy(this, parent, foreignKey, this.relation(parent).localKey(ownerKey));
    };
    /**
     * Create a has many through relationship.
     */
    Model.hasManyThrough = function (related, through, firstKey, secondKey, localKey, secondLocalKey) {
        return new Attributes.HasManyThrough(this, related, through, firstKey, secondKey, this.localKey(localKey), this.relation(through).localKey(secondLocalKey));
    };
    /**
     * Create a belongs to many relationship.
     */
    Model.belongsToMany = function (related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
        return new Attributes.BelongsToMany(this, related, pivot, foreignPivotKey, relatedPivotKey, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
    };
    /**
     * Create a morph to relationship.
     */
    Model.morphTo = function (id, type) {
        return new Attributes.MorphTo(this, id, type);
    };
    /**
     * Create a morph one relationship.
     */
    Model.morphOne = function (related, id, type, localKey) {
        return new Attributes.MorphOne(this, related, id, type, this.localKey(localKey));
    };
    /**
     * Create a morph many relationship.
     */
    Model.morphMany = function (related, id, type, localKey) {
        return new Attributes.MorphMany(this, related, id, type, this.localKey(localKey));
    };
    /**
     * Create a morph to many relationship.
     */
    Model.morphToMany = function (related, pivot, relatedId, id, type, parentKey, relatedKey) {
        return new Attributes.MorphToMany(this, related, pivot, relatedId, id, type, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
    };
    /**
     * Create a morphed by many relationship.
     */
    Model.morphedByMany = function (related, pivot, relatedId, id, type, parentKey, relatedKey) {
        return new Attributes.MorphedByMany(this, related, pivot, relatedId, id, type, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
    };
    /**
     * Mutators to mutate matching fields when instantiating the model.
     */
    Model.mutators = function () {
        return {};
    };
    /**
     * Types mapping used to dispatch entities based on their discriminator field
     */
    Model.types = function () {
        return {};
    };
    /**
     * Get the store instance from the container.
     */
    Model.store = function () {
        return Container.store;
    };
    /**
     * Get the database instance from store.
     */
    Model.database = function () {
        return this.store().$db();
    };
    /**
     * Create a namespaced method name for Vuex Module from the given
     * method name.
     */
    Model.namespace = function (method) {
        return this.database().namespace + "/" + this.entity + "/" + method;
    };
    /**
     * Call Vuex Getters.
     */
    Model.getters = function (method) {
        return this.store().getters[this.namespace(method)];
    };
    /**
     * Dispatch Vuex Action.
     */
    Model.dispatch = function (method, payload) {
        return this.store().dispatch(this.namespace(method), payload);
    };
    /**
     * Commit Vuex Mutation.
     */
    Model.commit = function (callback) {
        this.store().commit(this.database().namespace + "/$mutate", {
            entity: this.entity,
            callback: callback
        });
    };
    /**
     * Get the Model schema definition from the cache.
     */
    Model.getFields = function () {
        if (!this.cachedFields) {
            this.cachedFields = {};
        }
        if (this.cachedFields[this.entity]) {
            return this.cachedFields[this.entity];
        }
        this.cachedFields[this.entity] = this.fields();
        return this.cachedFields[this.entity];
    };
    /**
     * Get all records.
     */
    Model.all = function () {
        return this.getters('all')();
    };
    /**
     * Find a record.
     */
    Model.find = function (id) {
        return this.getters('find')(id);
    };
    /**
     * Get the record of the given array of ids.
     */
    Model.findIn = function (idList) {
        return this.getters('findIn')(idList);
    };
    /**
     * Get query instance.
     */
    Model.query = function () {
        return this.getters('query')();
    };
    /**
     * Create new data with all fields filled by default values.
     */
    Model.new = function () {
        return this.dispatch('new');
    };
    /**
     * Save given data to the store by replacing all existing records in the
     * store. If you want to save data without replacing existing records,
     * use the `insert` method instead.
     */
    Model.create = function (payload) {
        return this.dispatch('create', payload);
    };
    /**
     * Insert records.
     */
    Model.insert = function (payload) {
        return this.dispatch('insert', payload);
    };
    /**
     * Update records.
     */
    Model.update = function (payload) {
        return this.dispatch('update', payload);
    };
    /**
     * Insert or update records.
     */
    Model.insertOrUpdate = function (payload) {
        return this.dispatch('insertOrUpdate', payload);
    };
    Model.delete = function (payload) {
        return this.dispatch('delete', payload);
    };
    /**
     * Delete all records from the store.
     */
    Model.deleteAll = function () {
        return this.dispatch('deleteAll');
    };
    /**
     * Check if the given key is the primary key. If the model has composite
     * primary key, this method is going to check if the given key is included
     * in the composite key.
     */
    Model.isPrimaryKey = function (key) {
        if (!Array.isArray(this.primaryKey)) {
            return this.primaryKey === key;
        }
        return this.primaryKey.includes(key);
    };
    /**
     * Get the id (value of primary key) from teh given record. If primary key is
     * not present, or it is invalid primary key value, which is other than
     * `string` or `number`, it's going to return `null`.
     *
     * If the model has composite key, it's going to return array of ids. If any
     * composite key missing, it will return `null`.
     */
    Model.getIdFromRecord = function (record) {
        var _this = this;
        var key = this.primaryKey;
        if (typeof key === 'string') {
            return this.getIdFromValue(record[key]);
        }
        var ids = key.reduce(function (keys, k) {
            var id = _this.getIdFromValue(record[k]);
            id !== null && keys.push(id);
            return keys;
        }, []);
        return ids.length === key.length ? ids : null;
    };
    /**
     * Get correct index id, which is `string` | `number`, from the given value.
     */
    Model.getIdFromValue = function (value) {
        if (typeof value === 'string' && value !== '') {
            return value;
        }
        if (typeof value === 'number') {
            return value;
        }
        return null;
    };
    /**
     * Get the index ID value from the given record. An index ID is a value that
     * used as a key for records within the Vuex Store.
     *
     * Most of the time, it's same as the value for the Model's primary key but
     * it's always `string`, even if the primary key value is `number`.
     *
     * If the Model has a composite primary key, each value corresponding to
     * those primary key will be stringified and become a single string value
     * such as `'[1,2]'`.
     *
     * If the primary key is not present at the given record, it returns `null`.
     * For the composite primary key, every key must exist at a given record,
     * or it will return `null`.
     */
    Model.getIndexIdFromRecord = function (record) {
        var id = this.getIdFromRecord(record);
        if (id === null) {
            return null;
        }
        if (Array.isArray(id)) {
            return JSON.stringify(id);
        }
        return String(id);
    };
    /**
     * Get local key to pass to the attributes.
     */
    Model.localKey = function (key) {
        if (key) {
            return key;
        }
        return typeof this.primaryKey === 'string' ? this.primaryKey : 'id';
    };
    /**
     * Get the model object that matches the given record type. The method is for
     * getting the correct model object when the model has any inheritance
     * children model.
     *
     * For example, if a User Model have `static types()` declared, and if you
     * pass record with `{ type: 'admin' }`, then the method will likely to
     * return SuperUser class.
     */
    Model.getModelFromRecord = function (record) {
        // If the given record is already a model instance, return the
        // model object.
        if (record instanceof this) {
            return record.$self();
        }
        // Else, get the corresponding model for the type value if there's any.
        return this.getTypeModel(record[this.typeKey]);
    };
    /**
     * Get a model from the container.
     */
    Model.relation = function (model) {
        if (typeof model !== 'string') {
            return model;
        }
        return this.database().model(model);
    };
    /**
     * Get all `belongsToMany` fields from the schema.
     */
    Model.pivotFields = function () {
        var fields = [];
        Utils.forOwn(this.getFields(), function (field, key) {
            var _a;
            if (field instanceof Attributes.BelongsToMany || field instanceof Attributes.MorphToMany || field instanceof Attributes.MorphedByMany) {
                fields.push((_a = {}, _a[key] = field, _a));
            }
        });
        return fields;
    };
    /**
     * Check if fields contains the `belongsToMany` field type.
     */
    Model.hasPivotFields = function () {
        return this.pivotFields().length > 0;
    };
    /**
     * Check if the current model has a type definition
     */
    Model.hasTypes = function () {
        return Object.keys(this.types()).length > 0;
    };
    /**
     * Get the model corresponding to the given type name. If it can't be found,
     * it'll return `null`.
     */
    Model.getTypeModel = function (name) {
        var model = this.types()[name];
        if (!model) {
            return null;
        }
        return model;
    };
    /**
     * Given a Model, this returns the corresponding key in the InheritanceTypes mapping
     */
    Model.getTypeKeyValueFromModel = function (model) {
        var modelToCheck = model || this;
        var types = this.types();
        for (var type in types) {
            if (types[type].entity === modelToCheck.entity) {
                return type;
            }
        }
        return null;
    };
    /**
     * Tries to find a Relation field in all types defined in the InheritanceTypes mapping
     */
    Model.findRelationInSubTypes = function (relationName) {
        var types = this.types();
        for (var type in types) {
            var fields = types[type].getFields();
            for (var fieldName in fields) {
                if (fieldName === relationName && fields[fieldName] instanceof Attributes.Relation) {
                    return fields[fieldName];
                }
            }
        }
        return null;
    };
    /**
     * Fill any missing fields in the given record with the default value defined
     * in the model schema.
     */
    Model.hydrate = function (record) {
        return (new this(record)).$getAttributes();
    };
    /**
     * Get the constructor of this model.
     */
    Model.prototype.$self = function () {
        return this.constructor;
    };
    /**
     * Get the primary key for the model.
     */
    Model.prototype.$primaryKey = function () {
        return this.$self().primaryKey;
    };
    /**
     * The definition of the fields of the model and its relations.
     */
    Model.prototype.$fields = function () {
        return this.$self().getFields();
    };
    /**
     * Set index id.
     */
    Model.prototype.$setIndexId = function (id) {
        this.$id = id;
        return this;
    };
    /**
     * Get the store instance from the container.
     */
    Model.prototype.$store = function () {
        return this.$self().store();
    };
    /**
     * Create a namespaced method name for Vuex Module from the given
     * method name.
     */
    Model.prototype.$namespace = function (method) {
        return this.$self().namespace(method);
    };
    /**
     * Call Vuex Getetrs.
     */
    Model.prototype.$getters = function (method) {
        return this.$self().getters(method);
    };
    /**
     * Dispatch Vuex Action.
     */
    Model.prototype.$dispatch = function (method, payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$self().dispatch(method, payload)];
            });
        });
    };
    /**
     * Get all records.
     */
    Model.prototype.$all = function () {
        return this.$getters('all')();
    };
    /**
     * Find a record.
     */
    Model.prototype.$find = function (id) {
        return this.$getters('find')(id);
    };
    /**
     * Find record of the given array of ids.
     */
    Model.prototype.$findIn = function (idList) {
        return this.$getters('findIn')(idList);
    };
    /**
     * Get query instance.
     */
    Model.prototype.$query = function () {
        return this.$getters('query')();
    };
    /**
     * Create records.
     */
    Model.prototype.$create = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$dispatch('create', payload)];
            });
        });
    };
    /**
     * Create records.
     */
    Model.prototype.$insert = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$dispatch('insert', payload)];
            });
        });
    };
    /**
     * Update records.
     */
    Model.prototype.$update = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (Array.isArray(payload)) {
                    return [2 /*return*/, this.$dispatch('update', payload)];
                }
                if (payload.where !== undefined) {
                    return [2 /*return*/, this.$dispatch('update', payload)];
                }
                if (this.$self().getIndexIdFromRecord(payload) === null) {
                    return [2 /*return*/, this.$dispatch('update', { where: this.$id, data: payload })];
                }
                return [2 /*return*/, this.$dispatch('update', payload)];
            });
        });
    };
    /**
     * Insert or update records.
     */
    Model.prototype.$insertOrUpdate = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$dispatch('insertOrUpdate', payload)];
            });
        });
    };
    /**
     * Save record.
     */
    Model.prototype.$save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fields, record, records;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fields = this.$self().getFields();
                        record = Object.keys(fields).reduce(function (record, key) {
                            if (fields[key] instanceof Attributes.Type) {
                                record[key] = _this[key];
                            }
                            return record;
                        }, {});
                        return [4 /*yield*/, this.$dispatch('insertOrUpdate', { data: record })];
                    case 1:
                        records = _a.sent();
                        this.$fill(records[this.$self().entity][0]);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Delete records that matches the given condition.
     */
    Model.prototype.$delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var primaryKey;
            var _this = this;
            return __generator(this, function (_a) {
                primaryKey = this.$primaryKey();
                if (!Array.isArray(primaryKey)) {
                    return [2 /*return*/, this.$dispatch('delete', this[primaryKey])];
                }
                return [2 /*return*/, this.$dispatch('delete', function (model) {
                        return primaryKey.every(function (id) { return model[id] === _this[id]; });
                    })];
            });
        });
    };
    /**
     * Delete all records.
     */
    Model.prototype.$deleteAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$dispatch('deleteAll')];
            });
        });
    };
    /**
     * Fill the model instance with the given record. If no record were passed,
     * or if the record has any missing fields, each value of the fields will
     * be filled with its default value defined at model fields definition.
     */
    Model.prototype.$fill = function (record) {
        if (record === void 0) { record = {}; }
        var fields = this.$fields();
        for (var key in fields) {
            var field = fields[key];
            var value = record[key];
            this[key] = field.make(value, record, key);
        }
        // If the record contains index id, set it to the model.
        record.$id !== undefined && this.$setIndexId(record.$id);
    };
    /**
     * Generate missing primary ids and index id.
     */
    Model.prototype.$generateId = function () {
        return this.$generatePrimaryId().$generateIndexId();
    };
    /**
     * Generate any missing primary ids.
     */
    Model.prototype.$generatePrimaryId = function () {
        var _this = this;
        var key = this.$self().primaryKey;
        var keys = Array.isArray(key) ? key : [key];
        keys.forEach(function (k) {
            if (_this[k] === undefined || _this[k] === null) {
                _this[k] = Uid.make();
            }
        });
        return this;
    };
    /**
     * Generate index id from current model attributes.
     */
    Model.prototype.$generateIndexId = function () {
        return this.$setIndexId(this.$getIndexIdFromAttributes());
    };
    /**
     * Get index id based on current model attributes.
     */
    Model.prototype.$getIndexIdFromAttributes = function () {
        return this.$self().getIndexIdFromRecord(this);
    };
    /**
     * Get all of the current attributes on the model. It includes index id
     * value as well. This method is mainly used when saving a model to
     * the store.
     */
    Model.prototype.$getAttributes = function () {
        return toAttributes(this);
    };
    /**
     * Serialize field values into json.
     */
    Model.prototype.$toJson = function () {
        return toJson(this);
    };
    /**
     * The primary key to be used for the model.
     */
    Model.primaryKey = 'id';
    /**
     * The discriminator key to be used for the model when inheritance is used
     */
    Model.typeKey = 'type';
    /**
     * Vuex Store state definition.
     */
    Model.state = {};
    return Model;
}());
export default Model;
//# sourceMappingURL=Model.js.map