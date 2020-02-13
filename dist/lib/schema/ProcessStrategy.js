import Uid from '../support/Uid';
import UidAttribute from '../attributes/types/Uid';
var ProcessStrategy = /** @class */ (function () {
    function ProcessStrategy() {
    }
    /**
     * Create the process strategy.
     */
    ProcessStrategy.create = function (model) {
        var _this = this;
        return function (value, _parentValue, _key) {
            _this.generateIds(value, model);
            _this.generateIndexId(value, model);
            return value;
        };
    };
    /**
     * Generate a field that is defined as primary keys. For keys with a proper
     * value set, it will do nothing. If a key is missing, it will generate
     * UID for it.
     */
    ProcessStrategy.generateIds = function (record, model) {
        var keys = Array.isArray(model.primaryKey) ? model.primaryKey : [model.primaryKey];
        keys.forEach(function (k) {
            if (record[k] !== undefined && record[k] !== null) {
                return;
            }
            var attr = model.getFields()[k];
            record[k] = attr instanceof UidAttribute ? attr.make() : Uid.make();
        });
    };
    /**
     * Generate index id field (which is `$id`) and attach to the given record.
     */
    ProcessStrategy.generateIndexId = function (record, model) {
        record.$id = model.getIndexIdFromRecord(record);
    };
    return ProcessStrategy;
}());
export default ProcessStrategy;
//# sourceMappingURL=ProcessStrategy.js.map