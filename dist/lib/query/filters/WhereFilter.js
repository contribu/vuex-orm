import Utils from '../../support/Utils';
import Query from '../Query';
var WhereFilter = /** @class */ (function () {
    function WhereFilter() {
    }
    /**
     * Filter the given data by registered where clause.
     */
    WhereFilter.filter = function (query, records) {
        var _this = this;
        if (query.wheres.length === 0) {
            return records;
        }
        return records.filter(function (record) { return _this.check(query, record); });
    };
    /**
     * Checks if given Record matches the registered where clause.
     */
    WhereFilter.check = function (query, record) {
        var whereTypes = Utils.groupBy(query.wheres, function (where) { return where.boolean; });
        var comparator = this.getComparator(query, record);
        var results = [];
        whereTypes.and && results.push(whereTypes.and.every(comparator));
        whereTypes.or && results.push(whereTypes.or.some(comparator));
        return results.indexOf(true) !== -1;
    };
    /**
     * Get comparator for the where clause.
     */
    WhereFilter.getComparator = function (query, record) {
        var _this = this;
        return function (where) {
            // Function with Record and Query as argument.
            if (typeof where.field === 'function') {
                var newQuery = new Query(query.store, query.entity);
                var result = _this.executeWhereClosure(newQuery, record, where.field);
                if (typeof result === 'boolean') {
                    return result;
                }
                // If closure returns undefined, we need to execute the local query.
                var matchingRecords = newQuery.get();
                // And check if current record is part of the result.
                return !Utils.isEmpty(matchingRecords.filter(function (rec) {
                    return rec['$id'] === record['$id'];
                }));
            }
            // Function with Record value as argument.
            if (typeof where.value === 'function') {
                return where.value(record[where.field]);
            }
            // Check if field value is in given where Array.
            if (Array.isArray(where.value)) {
                return where.value.indexOf(record[where.field]) !== -1;
            }
            // Simple equal check.
            return record[where.field] === where.value;
        };
    };
    /**
     * Execute where closure.
     */
    WhereFilter.executeWhereClosure = function (query, record, closure) {
        if (closure.length !== 3) {
            return closure(record, query);
        }
        var model = new query.model(record);
        return closure(record, query, model);
    };
    return WhereFilter;
}());
export default WhereFilter;
//# sourceMappingURL=WhereFilter.js.map