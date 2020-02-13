import { __assign, __awaiter, __generator } from "tslib";
/**
 * Create new data with all fields filled by default values.
 */
function newRecord(context) {
    return __awaiter(this, void 0, void 0, function () {
        var state, entity;
        return __generator(this, function (_a) {
            state = context.state;
            entity = state.$name;
            return [2 /*return*/, context.dispatch(state.$connection + "/new", { entity: entity }, { root: true })];
        });
    });
}
/**
 * Save given data to the store by replacing all existing records in the
 * store. If you want to save data without replacing existing records,
 * use the `insert` method instead.
 */
function create(context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var state, entity;
        return __generator(this, function (_a) {
            state = context.state;
            entity = state.$name;
            return [2 /*return*/, context.dispatch(state.$connection + "/create", __assign(__assign({}, payload), { entity: entity }), { root: true })];
        });
    });
}
/**
 * Insert given data to the state. Unlike `create`, this method will not
 * remove existing data within the state, but it will update the data
 * with the same primary key.
 */
function insert(context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var state, entity;
        return __generator(this, function (_a) {
            state = context.state;
            entity = state.$name;
            return [2 /*return*/, context.dispatch(state.$connection + "/insert", __assign(__assign({}, payload), { entity: entity }), { root: true })];
        });
    });
}
/**
 * Update data in the store.
 */
function update(context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var state, entity;
        return __generator(this, function (_a) {
            state = context.state;
            entity = state.$name;
            // If the payload is an array, then the payload should be an array of
            // data so let's pass the whole payload as data.
            if (Array.isArray(payload)) {
                return [2 /*return*/, context.dispatch(state.$connection + "/update", { entity: entity, data: payload }, { root: true })];
            }
            // If the payload doesn't have `data` property, we'll assume that
            // the user has passed the object as the payload so let's define
            // the whole payload as a data.
            if (payload.data === undefined) {
                return [2 /*return*/, context.dispatch(state.$connection + "/update", { entity: entity, data: payload }, { root: true })];
            }
            // Else destructure the payload and let root action handle it.
            return [2 /*return*/, context.dispatch(state.$connection + "/update", __assign({ entity: entity }, payload), { root: true })];
        });
    });
}
/**
 * Insert or update given data to the state. Unlike `insert`, this method
 * will not replace existing data within the state, but it will update only
 * the submitted data with the same primary key.
 */
function insertOrUpdate(context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var state, entity;
        return __generator(this, function (_a) {
            state = context.state;
            entity = state.$name;
            return [2 /*return*/, context.dispatch(state.$connection + "/insertOrUpdate", __assign({ entity: entity }, payload), { root: true })];
        });
    });
}
function destroy(context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var state, entity, where;
        return __generator(this, function (_a) {
            state = context.state;
            entity = state.$name;
            where = payload;
            return [2 /*return*/, context.dispatch(state.$connection + "/delete", { entity: entity, where: where }, { root: true })];
        });
    });
}
/**
 * Delete all data from the store.
 */
function deleteAll(context) {
    return __awaiter(this, void 0, void 0, function () {
        var state, entity;
        return __generator(this, function (_a) {
            state = context.state;
            entity = state.$name;
            return [2 /*return*/, context.dispatch(state.$connection + "/deleteAll", { entity: entity }, { root: true })];
        });
    });
}
var Actions = {
    new: newRecord,
    create: create,
    insert: insert,
    update: update,
    insertOrUpdate: insertOrUpdate,
    delete: destroy,
    deleteAll: deleteAll
};
export default Actions;
//# sourceMappingURL=Actions.js.map