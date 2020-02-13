import { __assign, __spreadArrays } from "tslib";
import Utils from '../support/Utils';
import Model from '../model/Model';
import Processor from './processors/Processor';
import Filter from './filters/Filter';
import Loader from './loaders/Loader';
import Rollcaller from './rollcallers/Rollcaller';
var Query = /** @class */ (function () {
    /**
     * Create a new Query instance.
     */
    function Query(store, entity) {
        /**
         * This flag lets us know if current Query instance applies to
         * a base class or not (in order to know when to filter out
         * some records).
         */
        this.appliedOnBase = true;
        /**
         * Primary key ids to filter records by. It is used for filtering records
         * direct key lookup when a user is trying to fetch records by its
         * primary key.
         *
         * It should not be used if there is a logic which prevents index usage, for
         * example, an "or" condition which already requires a full scan of records.
         */
        this.idFilter = null;
        /**
         * Whether to use `idFilter` key lookup. True if there is a logic which
         * prevents index usage, for example, an "or" condition which already
         * requires full scan.
         */
        this.cancelIdFilter = false;
        /**
         * Primary key ids to filter joined records. It is used for filtering
         * records direct key lookup. It should not be cancelled, because it
         * is free from the effects of normal where methods.
         */
        this.joinedIdFilter = null;
        /**
         * The where constraints for the query.
         */
        this.wheres = [];
        /**
         * The has constraints for the query.
         */
        this.have = [];
        /**
         * The orders of the query result.
         */
        this.orders = [];
        /**
         * Number of results to skip.
         */
        this.offsetNumber = 0;
        /**
         * Maximum number of records to return.
         *
         * We use polyfill of `Number.MAX_SAFE_INTEGER` for IE11 here.
         */
        this.limitNumber = Math.pow(2, 53) - 1;
        /**
         * The relationships that should be eager loaded with the result.
         */
        this.load = {};
        this.store = store;
        this.database = store.$db();
        this.model = this.getModel(entity);
        this.baseModel = this.getBaseModel(entity);
        this.entity = entity;
        this.baseEntity = this.baseModel.entity;
        this.rootState = this.database.getState();
        this.state = this.rootState[this.baseEntity];
        this.appliedOnBase = this.baseEntity === this.entity;
    }
    /**
     * Delete all records from the store.
     */
    Query.deleteAll = function (store) {
        var database = store.$db();
        var models = database.models();
        for (var entity in models) {
            var state = database.getState()[entity];
            state && (new this(store, entity)).deleteAll();
        }
    };
    /**
     * Register a global hook. It will return ID for the hook that users may use
     * it to unregister hooks.
     */
    Query.on = function (on, callback) {
        var id = ++this.lastHookId;
        if (!this.hooks[on]) {
            this.hooks[on] = [];
        }
        this.hooks[on].push({ id: id, callback: callback });
        return id;
    };
    /**
     * Unregister global hook with the given id.
     */
    Query.off = function (id) {
        var _this = this;
        return Object.keys(this.hooks).some(function (on) {
            var hooks = _this.hooks[on];
            var index = hooks.findIndex(function (h) { return h.id === id; });
            if (index === -1) {
                return false;
            }
            hooks.splice(index, 1);
            return true;
        });
    };
    /**
     * Get query class.
     */
    Query.prototype.self = function () {
        return this.constructor;
    };
    /**
     * Create a new query instance.
     */
    Query.prototype.newQuery = function (entity) {
        entity = entity || this.entity;
        return (new Query(this.store, entity));
    };
    /**
     * Get model of given name from the container.
     */
    Query.prototype.getModel = function (name) {
        var entity = name || this.entity;
        return this.database.model(entity);
    };
    /**
     * Get all models from the container.
     */
    Query.prototype.getModels = function () {
        return this.database.models();
    };
    /**
     * Get base model of given name from the container.
     */
    Query.prototype.getBaseModel = function (name) {
        return this.database.baseModel(name);
    };
    /**
     * Returns all record of the query chain result. This method is alias
     * of the `get` method.
     */
    Query.prototype.all = function () {
        return this.get();
    };
    /**
     * Find the record by the given id.
     */
    Query.prototype.find = function (id) {
        var indexId = Array.isArray(id) ? JSON.stringify(id) : id;
        var record = this.state.data[indexId];
        if (!record) {
            return null;
        }
        return this.item(this.hydrate(record));
    };
    /**
     * Get the record of the given array of ids.
     */
    Query.prototype.findIn = function (idList) {
        var _this = this;
        return idList.reduce(function (collection, id) {
            var indexId = Array.isArray(id) ? JSON.stringify(id) : id;
            var record = _this.state.data[indexId];
            if (!record) {
                return collection;
            }
            collection.push(_this.hydrate(record));
            return collection;
        }, []);
    };
    /**
     * Returns all record of the query chain result.
     */
    Query.prototype.get = function () {
        var records = this.select();
        return this.collect(records);
    };
    /**
     * Returns the first record of the query chain result.
     */
    Query.prototype.first = function () {
        var records = this.select();
        if (records.length === 0) {
            return null;
        }
        return this.item(this.hydrate(records[0]));
    };
    /**
     * Returns the last record of the query chain result.
     */
    Query.prototype.last = function () {
        var records = this.select();
        if (records.length === 0) {
            return null;
        }
        return this.item(this.hydrate(records[records.length - 1]));
    };
    /**
     * Add a and where clause to the query.
     */
    Query.prototype.where = function (field, value) {
        if (this.isIdfilterable(field)) {
            this.setIdFilter(value);
        }
        this.wheres.push({ field: field, value: value, boolean: 'and' });
        return this;
    };
    /**
     * Add a or where clause to the query.
     */
    Query.prototype.orWhere = function (field, value) {
        // Cacncel id filter usage, since "or" needs full scan.
        this.cancelIdFilter = true;
        this.wheres.push({ field: field, value: value, boolean: 'or' });
        return this;
    };
    /**
     * Filter records by their primary key.
     */
    Query.prototype.whereId = function (value) {
        return this.where(this.model.primaryKey, value);
    };
    /**
     * Filter records by their primary keys.
     */
    Query.prototype.whereIdIn = function (values) {
        return this.where(this.model.primaryKey, values);
    };
    /**
     * Fast comparison for foreign keys. If the foreign key is the primary key,
     * it uses object lookup, fallback normal where otherwise.
     *
     * Why separate `whereFk` instead of just `where`? Additional logic needed
     * for the distinction between where and orWhere in normal queries, but
     * Fk lookups are always "and" type.
     */
    Query.prototype.whereFk = function (field, value) {
        var values = Array.isArray(value) ? value : [value];
        // If lookup filed is the primary key. Initialize or get intersection,
        // because boolean and could have a condition such as
        // `whereId(1).whereId(2).get()`.
        if (field === this.model.primaryKey) {
            this.setJoinedIdFilter(values);
            return this;
        }
        // Else fallback to normal where.
        this.where(field, values);
        return this;
    };
    /**
     * Check whether the given field and value combination is filterable through
     * primary key direct look up.
     */
    Query.prototype.isIdfilterable = function (field) {
        return field === this.model.primaryKey && !this.cancelIdFilter;
    };
    /**
     * Set id filter for the given where condition.
     */
    Query.prototype.setIdFilter = function (value) {
        var _this = this;
        var values = Array.isArray(value) ? value : [value];
        // Initialize or get intersection, because boolean and could have a
        // condition such as `whereIdIn([1,2,3]).whereIdIn([1,2]).get()`.
        if (this.idFilter === null) {
            this.idFilter = new Set(values);
            return;
        }
        this.idFilter = new Set(values.filter(function (v) { return _this.idFilter.has(v); }));
    };
    /**
     * Set joined id filter for the given where condition.
     */
    Query.prototype.setJoinedIdFilter = function (values) {
        var _this = this;
        // Initialize or get intersection, because boolean and could have a
        // condition such as `whereId(1).whereId(2).get()`.
        if (this.joinedIdFilter === null) {
            this.joinedIdFilter = new Set(values);
            return;
        }
        this.joinedIdFilter = new Set(values.filter(function (v) { return _this.joinedIdFilter.has(v); }));
    };
    /**
     * Add an order to the query.
     */
    Query.prototype.orderBy = function (key, direction) {
        if (direction === void 0) { direction = 'asc'; }
        this.orders.push({ key: key, direction: direction });
        return this;
    };
    /**
     * Add an offset to the query.
     */
    Query.prototype.offset = function (offset) {
        this.offsetNumber = offset;
        return this;
    };
    /**
     * Add limit to the query.
     */
    Query.prototype.limit = function (limit) {
        this.limitNumber = limit;
        return this;
    };
    /**
     * Set the relationships that should be loaded.
     */
    Query.prototype.with = function (name, constraint) {
        if (constraint === void 0) { constraint = null; }
        Loader.with(this, name, constraint);
        return this;
    };
    /**
     * Query all relations.
     */
    Query.prototype.withAll = function () {
        Loader.withAll(this);
        return this;
    };
    /**
     * Query all relations recursively.
     */
    Query.prototype.withAllRecursive = function (depth) {
        if (depth === void 0) { depth = 3; }
        Loader.withAllRecursive(this, depth);
        return this;
    };
    /**
     * Set where constraint based on relationship existence.
     */
    Query.prototype.has = function (relation, operator, count) {
        Rollcaller.has(this, relation, operator, count);
        return this;
    };
    /**
     * Set where constraint based on relationship absence.
     */
    Query.prototype.hasNot = function (relation, operator, count) {
        Rollcaller.hasNot(this, relation, operator, count);
        return this;
    };
    /**
     * Add where has condition.
     */
    Query.prototype.whereHas = function (relation, constraint) {
        Rollcaller.whereHas(this, relation, constraint);
        return this;
    };
    /**
     * Add where has not condition.
     */
    Query.prototype.whereHasNot = function (relation, constraint) {
        Rollcaller.whereHasNot(this, relation, constraint);
        return this;
    };
    /**
     * Get all records from the state and convert them into the array of
     * model instances.
     */
    Query.prototype.records = function () {
        var _this = this;
        this.finalizeIdFilter();
        return this.getIdsToLookup().reduce(function (models, id) {
            var record = _this.state.data[id];
            if (!record) {
                return models;
            }
            var model = _this.hydrate(record);
            // Ignore if the model is not current type of model.
            if (!_this.appliedOnBase && !(_this.model.entity === model.$self().entity)) {
                return models;
            }
            models.push(model);
            return models;
        }, []);
    };
    /**
     * Check whether if id filters should on select. If not, clear out id filter.
     */
    Query.prototype.finalizeIdFilter = function () {
        if (!this.cancelIdFilter || this.idFilter === null) {
            return;
        }
        this.where(this.model.primaryKey, Array.from(this.idFilter.values()));
        this.idFilter = null;
    };
    /**
     * Get a list of id that should be used to lookup when fetching records
     * from the state.
     */
    Query.prototype.getIdsToLookup = function () {
        var _this = this;
        // If both id filter and joined id filter are set, intersect them.
        if (this.idFilter && this.joinedIdFilter) {
            return Array.from(this.idFilter.values()).filter(function (id) {
                return _this.joinedIdFilter.has(id);
            });
        }
        // If only either one is set, return which one is set.
        if (this.idFilter || this.joinedIdFilter) {
            return Array.from((this.idFilter || this.joinedIdFilter).values());
        }
        // If none is set, return all keys.
        return Object.keys(this.state.data);
    };
    /**
     * Process the query and filter data.
     */
    Query.prototype.select = function () {
        // At first, well apply any `has` condition to the query.
        Rollcaller.applyConstraints(this);
        // Next, get all record as an array and then start filtering it through.
        var records = this.records();
        // Process `beforeSelect` hook.
        records = this.executeSelectHook('beforeSelect', records);
        // Let's filter the records at first by the where clauses.
        records = this.filterWhere(records);
        // Process `afterWhere` hook.
        records = this.executeSelectHook('afterWhere', records);
        // Next, lets sort the data.
        records = this.filterOrderBy(records);
        // Process `afterOrderBy` hook.
        records = this.executeSelectHook('afterOrderBy', records);
        // Finally, slice the record by limit and offset.
        records = this.filterLimit(records);
        // Process `afterLimit` hook.
        records = this.executeSelectHook('afterLimit', records);
        return records;
    };
    /**
     * Filter the given data by registered where clause.
     */
    Query.prototype.filterWhere = function (records) {
        return Filter.where(this, records);
    };
    /**
     * Sort the given data by registered orders.
     */
    Query.prototype.filterOrderBy = function (records) {
        return Filter.orderBy(this, records);
    };
    /**
     * Limit the given records by the lmilt and offset.
     */
    Query.prototype.filterLimit = function (records) {
        return Filter.limit(this, records);
    };
    /**
     * Get the count of the retrieved data.
     */
    Query.prototype.count = function () {
        return this.get().length;
    };
    /**
     * Get the max value of the specified filed.
     */
    Query.prototype.max = function (field) {
        var numbers = this.get().reduce(function (numbers, item) {
            if (typeof item[field] === 'number') {
                numbers.push(item[field]);
            }
            return numbers;
        }, []);
        return numbers.length === 0 ? 0 : Math.max.apply(Math, numbers);
    };
    /**
     * Get the min value of the specified filed.
     */
    Query.prototype.min = function (field) {
        var numbers = this.get().reduce(function (numbers, item) {
            if (typeof item[field] === 'number') {
                numbers.push(item[field]);
            }
            return numbers;
        }, []);
        return numbers.length === 0 ? 0 : Math.min.apply(Math, numbers);
    };
    /**
     * Get the sum value of the specified filed.
     */
    Query.prototype.sum = function (field) {
        return this.get().reduce(function (sum, item) {
            if (typeof item[field] === 'number') {
                sum += item[field];
            }
            return sum;
        }, 0);
    };
    /**
     * Create a item from given record.
     */
    Query.prototype.item = function (item) {
        if (Object.keys(this.load).length > 0) {
            Loader.eagerLoadRelations(this, [item]);
        }
        return item;
    };
    /**
     * Create a collection (array) from given records.
     */
    Query.prototype.collect = function (collection) {
        var _this = this;
        if (collection.length < 1) {
            return [];
        }
        if (Object.keys(this.load).length > 0) {
            collection = collection.map(function (item) {
                var model = _this.model.getModelFromRecord(item);
                return new model(item);
            });
            Loader.eagerLoadRelations(this, collection);
        }
        return collection;
    };
    /**
     * Create new data with all fields filled by default values.
     */
    Query.prototype.new = function () {
        var model = (new this.model()).$generateId();
        this.commitInsert(model.$getAttributes());
        return model;
    };
    /**
     * Save given data to the store by replacing all existing records in the
     * store. If you want to save data without replacing existing records,
     * use the `insert` method instead.
     */
    Query.prototype.create = function (data, options) {
        return this.persist('create', data, options);
    };
    /**
     * Create records to the state.
     */
    Query.prototype.createRecords = function (records) {
        this.deleteAll();
        return this.insertRecords(records);
    };
    /**
     * Insert given data to the store. Unlike `create`, this method will not
     * remove existing data within the store, but it will update the data
     * with the same primary key.
     */
    Query.prototype.insert = function (data, options) {
        return this.persist('insert', data, options);
    };
    /**
     * Insert records to the store.
     */
    Query.prototype.insertRecords = function (records) {
        var collection = this.mapHydrateRecords(records);
        collection = this.executeMutationHooks('beforeCreate', collection);
        this.commitInsertRecords(this.convertCollectionToRecords(collection));
        this.executeMutationHooks('afterCreate', collection);
        return collection;
    };
    /**
     * Update data in the state.
     */
    Query.prototype.update = function (data, condition, options) {
        // If the data is array, simply normalize the data and update them.
        if (Array.isArray(data)) {
            return this.persist('update', data, options);
        }
        // OK, the data is not an array. Now let's check `data` to see what we can
        // do if it's a closure.
        if (typeof data === 'function') {
            // If the data is closure, but if there's no condition, we wouldn't know
            // what record to update so raise an error and abort.
            if (!condition) {
                throw new Error('You must specify `where` to update records by specifying `data` as a closure.');
            }
            // If the condition is a closure, then update records by the closure.
            if (typeof condition === 'function') {
                return this.updateByCondition(data, condition);
            }
            // Else the condition is either String or Number, so let's
            // update the record by ID.
            return this.updateById(data, condition);
        }
        // Now the data is not a closure, and it's not an array, so it should be an object.
        // If the condition is closure, we can't normalize the data so let's update
        // records using the closure.
        if (typeof condition === 'function') {
            return this.updateByCondition(data, condition);
        }
        // If there's no condition, let's normalize the data and update them.
        if (!condition) {
            return this.persist('update', data, options);
        }
        // Now since the condition is either String or Number, let's check if the
        // model's primary key is not a composite key. If yes, we can't set the
        // condition as ID value for the record so throw an error and abort.
        if (Array.isArray(this.model.primaryKey)) {
            throw new Error("\n        You can't specify `where` value as `string` or `number` when you\n        have a composite key defined in your model. Please include composite\n        keys to the `data` fields.\n      ");
        }
        // Finally, let's add condition as the primary key of the object and
        // then normalize them to update the records.
        return this.updateById(data, condition);
    };
    /**
     * Update all records.
     */
    Query.prototype.updateRecords = function (records) {
        var models = this.hydrateRecordsByMerging(records);
        return this.performUpdate(models);
    };
    /**
     * Update the state by id.
     */
    Query.prototype.updateById = function (data, id) {
        var _a;
        id = typeof id === 'number' ? id.toString() : id;
        var record = this.state.data[id];
        if (!record) {
            return null;
        }
        var model = this.hydrate(record);
        var instances = (_a = {},
            _a[id] = this.processUpdate(data, model),
            _a);
        this.performUpdate(instances);
        return instances[id];
    };
    /**
     * Update the state by condition.
     */
    Query.prototype.updateByCondition = function (data, condition) {
        var _this = this;
        var instances = Object.keys(this.state.data).reduce(function (instances, id) {
            var instance = _this.hydrate(_this.state.data[id]);
            if (!condition(instance)) {
                return instances;
            }
            instances[id] = _this.processUpdate(data, instance);
            return instances;
        }, {});
        return this.performUpdate(instances);
    };
    /**
     * Update the given record with given data.
     */
    Query.prototype.processUpdate = function (data, instance) {
        if (typeof data === 'function') {
            data(instance);
            return instance;
        }
        // When the updated instance is not the base model, we tell te hydrate what model to use
        if (instance.constructor !== this.model && instance instanceof Model) {
            return this.hydrate(__assign(__assign({}, instance), data), instance.constructor);
        }
        return this.hydrate(__assign(__assign({}, instance), data));
    };
    /**
     * Commit `update` to the state.
     */
    Query.prototype.performUpdate = function (models) {
        var _this = this;
        models = this.updateIndexes(models);
        var beforeHooks = this.buildHooks('beforeUpdate');
        var afterHooks = this.buildHooks('afterUpdate');
        var updated = [];
        var _loop_1 = function (id) {
            var model = models[id];
            if (beforeHooks.some(function (hook) { return hook(model, null, _this.entity) === false; })) {
                return "continue";
            }
            this_1.commitInsert(model.$getAttributes());
            afterHooks.forEach(function (hook) { hook(model, null, _this.entity); });
            updated.push(model);
        };
        var this_1 = this;
        for (var id in models) {
            _loop_1(id);
        }
        return updated;
    };
    /**
     * Update the key of the instances. This is needed when a user updates
     * record's primary key. We must then update the index key to
     * correspond with new id value.
     */
    Query.prototype.updateIndexes = function (instances) {
        var _this = this;
        return Object.keys(instances).reduce(function (instances, key) {
            var instance = instances[key];
            var id = String(_this.model.getIndexIdFromRecord(instance));
            if (key !== id) {
                instance.$id = id;
                instances[id] = instance;
                delete instances[key];
            }
            return instances;
        }, instances);
    };
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    Query.prototype.insertOrUpdate = function (data, options) {
        return this.persist('insertOrUpdate', data, options);
    };
    /**
     * Insert or update the records.
     */
    Query.prototype.insertOrUpdateRecords = function (records) {
        var _this = this;
        var toBeInserted = {};
        var toBeUpdated = {};
        Object.keys(records).forEach(function (id) {
            var record = records[id];
            if (_this.state.data[id]) {
                toBeUpdated[id] = record;
                return;
            }
            toBeInserted[id] = record;
        });
        return __spreadArrays(this.insertRecords(toBeInserted), this.updateRecords(toBeUpdated));
    };
    /**
     * Persist data into the state.
     */
    Query.prototype.persist = function (method, data, options) {
        var _this = this;
        var normalizedData = this.normalize(data);
        if (Utils.isEmpty(normalizedData)) {
            if (method === 'create') {
                this.emptyState();
            }
            return {};
        }
        return Object.entries(normalizedData).reduce(function (collections, _a) {
            var entity = _a[0], records = _a[1];
            var newQuery = _this.newQuery(entity);
            var methodForEntity = _this.getPersistMethod(entity, options, method);
            var collection = newQuery.persistRecords(methodForEntity, records);
            if (collection.length > 0) {
                collections[entity] = collection;
            }
            return collections;
        }, {});
    };
    /**
     * Persist given records to the store by the given method.
     */
    Query.prototype.persistRecords = function (method, records) {
        switch (method) {
            case 'create':
                return this.createRecords(records);
            case 'insert':
                return this.insertRecords(records);
            case 'update':
                return this.updateRecords(records);
            case 'insertOrUpdate':
                return this.insertOrUpdateRecords(records);
        }
    };
    /**
     * Get persist method from given information.
     */
    Query.prototype.getPersistMethod = function (entity, options, fallback) {
        if (options.create && options.create.includes(entity)) {
            return 'create';
        }
        if (options.insert && options.insert.includes(entity)) {
            return 'insert';
        }
        if (options.update && options.update.includes(entity)) {
            return 'update';
        }
        if (options.insertOrUpdate && options.insertOrUpdate.includes(entity)) {
            return 'insertOrUpdate';
        }
        return fallback;
    };
    Query.prototype.delete = function (condition) {
        if (typeof condition === 'function') {
            return this.deleteByCondition(condition);
        }
        return this.deleteById(condition);
    };
    /**
     * Delete all records from the store. Even when deleting all records, we'll
     * iterate over all records to ensure that before and after hook will be
     * called for each existing records.
     */
    Query.prototype.deleteAll = function () {
        var _this = this;
        // If the target entity is the base entity and not inherited entity, we can
        // just delete all records.
        if (this.appliedOnBase) {
            return this.deleteByCondition(function () { return true; });
        }
        // Otherwise, we should filter out any derived entities from being deleted
        // so we'll add such filter here.
        return this.deleteByCondition(function (model) { return model.$self().entity === _this.model.entity; });
    };
    /**
     * Delete a record from the store by given id.
     */
    Query.prototype.deleteById = function (id) {
        var item = this.find(id);
        if (!item) {
            return null;
        }
        return this.deleteByCondition(function (model) { return model.$id === item.$id; })[0];
    };
    /**
     * Perform the actual delete query to the store.
     */
    Query.prototype.deleteByCondition = function (condition) {
        var collection = this.mapHydrateAndFilterRecords(this.state.data, condition);
        collection = this.executeMutationHooks('beforeDelete', collection);
        if (collection.length === 0) {
            return [];
        }
        this.commitDelete(collection.map(function (model) { return model.$id; }));
        this.executeMutationHooks('afterDelete', collection);
        return collection;
    };
    /**
     * Commit mutation.
     */
    Query.prototype.commit = function (name, payload) {
        this.store.commit(this.database.namespace + "/" + name, __assign({ entity: this.baseEntity }, payload));
    };
    /**
     * Commit insert mutation.
     */
    Query.prototype.commitInsert = function (record) {
        this.commit('insert', { record: record });
    };
    /**
     * Commit insert records mutation.
     */
    Query.prototype.commitInsertRecords = function (records) {
        this.commit('insertRecords', { records: records });
    };
    /**
     * Commit delete mutation.
     */
    Query.prototype.commitDelete = function (id) {
        this.commit('delete', { id: id });
    };
    /**
     * Normalize the given data.
     */
    Query.prototype.normalize = function (data) {
        return Processor.normalize(this, data);
    };
    /**
     * Convert given record to the model instance.
     */
    Query.prototype.hydrate = function (record, forceModel) {
        var _a;
        if (forceModel) {
            return new forceModel(record);
        }
        var newModel = this.model.getModelFromRecord(record);
        if (newModel !== null) {
            return new newModel(record);
        }
        if (!this.appliedOnBase && record[this.model.typeKey] === undefined) {
            var typeValue = this.model.getTypeKeyValueFromModel();
            record = __assign(__assign({}, record), (_a = {}, _a[this.model.typeKey] = typeValue, _a));
            return new this.model(record);
        }
        var baseModel = this.getBaseModel(this.entity);
        return new baseModel(record);
    };
    /**
     * Convert given records to instances by merging existing record. If there's
     * no existing record, that record will not be included in the result.
     */
    Query.prototype.hydrateRecordsByMerging = function (records) {
        var _this = this;
        return Object.keys(records).reduce(function (instances, id) {
            var recordInStore = _this.state.data[id];
            if (!recordInStore) {
                return instances;
            }
            var record = records[id];
            var modelForRecordInStore = _this.model.getModelFromRecord(recordInStore);
            if (modelForRecordInStore === null) {
                instances[id] = _this.hydrate(__assign(__assign({}, recordInStore), record));
                return instances;
            }
            instances[id] = _this.hydrate(__assign(__assign({}, recordInStore), record), modelForRecordInStore);
            return instances;
        }, {});
    };
    /**
     * Convert all given records and return it as a collection.
     */
    Query.prototype.mapHydrateRecords = function (records) {
        var _this = this;
        return Utils.map(records, function (record) { return _this.hydrate(record); });
    };
    /**
     * Convert all given records and return it as a collection.
     */
    Query.prototype.mapHydrateAndFilterRecords = function (records, condition) {
        var collection = [];
        for (var key in records) {
            var model = this.hydrate(records[key]);
            condition(model) && collection.push(model);
        }
        return collection;
    };
    /**
     * Convert given collection to records by using index id as a key.
     */
    Query.prototype.convertCollectionToRecords = function (collection) {
        return collection.reduce(function (carry, model) {
            carry[model['$id']] = model.$getAttributes();
            return carry;
        }, {});
    };
    /**
     * Clears the current state from any data related to current model.
     *
     * - Everything if not in a inheritance scheme.
     * - Only derived instances if applied to a derived entity.
     */
    Query.prototype.emptyState = function () {
        this.deleteAll();
    };
    /**
     * Build executable hook collection for the given hook.
     */
    Query.prototype.buildHooks = function (on) {
        var hooks = this.getGlobalHookAsArray(on);
        var localHook = this.model[on];
        localHook && hooks.push(localHook.bind(this.model));
        return hooks;
    };
    /**
     * Get global hook of the given name as array by stripping id key and keep
     * only hook functions.
     */
    Query.prototype.getGlobalHookAsArray = function (on) {
        var _this = this;
        var hooks = this.self().hooks[on];
        return hooks ? hooks.map(function (h) { return h.callback.bind(_this); }) : [];
    };
    /**
     * Execute mutation hooks to the given collection.
     */
    Query.prototype.executeMutationHooks = function (on, collection) {
        var _this = this;
        var hooks = this.buildHooks(on);
        if (hooks.length === 0) {
            return collection;
        }
        return collection.filter(function (model) {
            return !hooks.some(function (hook) { return hook(model, null, _this.entity) === false; });
        });
    };
    /**
     * Execute retrieve hook for the given method.
     */
    Query.prototype.executeSelectHook = function (on, models) {
        var _this = this;
        var hooks = this.buildHooks(on);
        return hooks.reduce(function (collection, hook) {
            collection = hook(models, _this.entity);
            return collection;
        }, models);
    };
    /**
     * The global lifecycle hook registries.
     */
    Query.hooks = {};
    /**
     * The counter to generate the UID for global hooks.
     */
    Query.lastHookId = 0;
    return Query;
}());
export default Query;
//# sourceMappingURL=Query.js.map