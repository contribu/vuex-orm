/**
 * Create a new Query instance.
 */
var query = function (state, _getters, _rootState, rootGetters) { return function () {
    return rootGetters[state.$connection + "/query"](state.$name);
}; };
/**
 * Get all data of given entity.
 */
var all = function (state, _getters, _rootState, rootGetters) { return function () {
    return rootGetters[state.$connection + "/all"](state.$name);
}; };
/**
 * Find a data of the given entity by given id.
 */
var find = function (state, _getters, _rootState, rootGetters) { return function (id) {
    return rootGetters[state.$connection + "/find"](state.$name, id);
}; };
/**
 * Find array of data of the given entity by given ids.
 */
var findIn = function (state, _getters, _rootState, rootGetters) { return function (idList) {
    return rootGetters[state.$connection + "/findIn"](state.$name, idList);
}; };
var Getters = {
    query: query,
    all: all,
    find: find,
    findIn: findIn
};
export default Getters;
//# sourceMappingURL=Getters.js.map