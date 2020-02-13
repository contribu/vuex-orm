import { __awaiter, __generator } from "tslib";
import Query from '../query/Query';
import OptionsBuilder from './support/OptionsBuilder';
/**
 * Create new data with all fields filled by default values.
 */
function newRecord(_context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (new Query(this, payload.entity)).new()];
        });
    });
}
/**
 * Save given data to the store by replacing all existing records in the
 * store. If you want to save data without replacing existing records,
 * use the `insert` method instead.
 */
function create(_context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var entity, data, options;
        return __generator(this, function (_a) {
            entity = payload.entity;
            data = payload.data;
            options = OptionsBuilder.createPersistOptions(payload);
            return [2 /*return*/, (new Query(this, entity)).create(data, options)];
        });
    });
}
/**
 * Insert given data to the state. Unlike `create`, this method will not
 * remove existing data within the state, but it will update the data
 * with the same primary key.
 */
function insert(_context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var entity, data, options;
        return __generator(this, function (_a) {
            entity = payload.entity;
            data = payload.data;
            options = OptionsBuilder.createPersistOptions(payload);
            return [2 /*return*/, (new Query(this, entity)).insert(data, options)];
        });
    });
}
/**
 * Update data in the store.
 */
function update(_context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var entity, data, where, options;
        return __generator(this, function (_a) {
            entity = payload.entity;
            data = payload.data;
            where = payload.where || null;
            options = OptionsBuilder.createPersistOptions(payload);
            return [2 /*return*/, (new Query(this, entity)).update(data, where, options)];
        });
    });
}
/**
 * Insert or update given data to the state. Unlike `insert`, this method
 * will not replace existing data within the state, but it will update only
 * the submitted data with the same primary key.
 */
function insertOrUpdate(_context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var entity, data, options;
        return __generator(this, function (_a) {
            entity = payload.entity;
            data = payload.data;
            options = OptionsBuilder.createPersistOptions(payload);
            return [2 /*return*/, (new Query(this, entity)).insertOrUpdate(data, options)];
        });
    });
}
function destroy(_context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var entity, where;
        return __generator(this, function (_a) {
            entity = payload.entity, where = payload.where;
            return [2 /*return*/, (new Query(this, entity)).delete(where)];
        });
    });
}
/**
 * Delete all data from the store.
 */
function deleteAll(_context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (payload && payload.entity) {
                (new Query(this, payload.entity)).deleteAll();
                return [2 /*return*/];
            }
            Query.deleteAll(this);
            return [2 /*return*/];
        });
    });
}
var RootActions = {
    new: newRecord,
    create: create,
    insert: insert,
    update: update,
    insertOrUpdate: insertOrUpdate,
    delete: destroy,
    deleteAll: deleteAll
};
export default RootActions;
//# sourceMappingURL=RootActions.js.map