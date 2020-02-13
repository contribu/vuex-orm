import { __assign } from "tslib";
var Connection = /** @class */ (function () {
    /**
     * Create a new connection instance.
     */
    function Connection(store, connection, entity) {
        this.store = store;
        this.connection = connection;
        this.entity = entity;
        this.rootState = this.store.state[connection];
        this.state = this.rootState[entity];
    }
    /**
     * Insert the given record.
     */
    Connection.prototype.insert = function (record) {
        var _a;
        this.state.data = __assign(__assign({}, this.state.data), (_a = {}, _a[record.$id] = record, _a));
    };
    /**
     * Insert the given records.
     */
    Connection.prototype.insertRecords = function (records) {
        this.state.data = __assign(__assign({}, this.state.data), records);
    };
    /**
     * Delete records that matches the given id.
     */
    Connection.prototype.delete = function (id) {
        var data = {};
        for (var i in this.state.data) {
            if (!id.includes(i)) {
                data[i] = this.state.data[i];
            }
        }
        this.state.data = data;
    };
    return Connection;
}());
export default Connection;
//# sourceMappingURL=Connection.js.map