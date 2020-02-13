import Query from '../query/Query';
/**
 * Create a new Query instance.
 */
function query(_state) {
    var _this = this;
    return function (entity) { return new Query(_this, entity); };
}
/**
 * Get all data of given entity.
 */
function all(_state) {
    var _this = this;
    return function (entity) { return (new Query(_this, entity)).all(); };
}
/**
 * Find a data of the given entity by given id.
 */
function find(_state) {
    var _this = this;
    return function (entity, id) {
        return (new Query(_this, entity)).find(id);
    };
}
/**
 * Find a data of the given entity by given id.
 */
function findIn(_state) {
    var _this = this;
    return function (entity, idList) {
        return (new Query(_this, entity)).findIn(idList);
    };
}
var RootGetters = {
    query: query,
    all: all,
    find: find,
    findIn: findIn
};
export default RootGetters;
//# sourceMappingURL=RootGetters.js.map