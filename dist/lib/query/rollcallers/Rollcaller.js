var Rollcaller = /** @class */ (function () {
    function Rollcaller() {
    }
    /**
     * Set where constraint based on relationship existence.
     */
    Rollcaller.has = function (query, relation, operator, count) {
        this.setHas(query, relation, 'exists', operator, count);
    };
    /**
     * Set where constraint based on relationship absence.
     */
    Rollcaller.hasNot = function (query, relation, operator, count) {
        this.setHas(query, relation, 'doesntExist', operator, count);
    };
    /**
     * Add where has condition.
     */
    Rollcaller.whereHas = function (query, relation, constraint) {
        this.setHas(query, relation, 'exists', undefined, undefined, constraint);
    };
    /**
     * Add where has not condition.
     */
    Rollcaller.whereHasNot = function (query, relation, constraint) {
        this.setHas(query, relation, 'doesntExist', undefined, undefined, constraint);
    };
    /**
     * Set `has` condition.
     */
    Rollcaller.setHas = function (query, relation, type, operator, count, constraint) {
        if (operator === void 0) { operator = '>='; }
        if (count === void 0) { count = 1; }
        if (constraint === void 0) { constraint = null; }
        if (typeof operator === 'number') {
            query.have.push({ relation: relation, type: type, operator: '>=', count: operator, constraint: constraint });
            return;
        }
        query.have.push({ relation: relation, type: type, operator: operator, count: count, constraint: constraint });
    };
    /**
     * Convert `has` conditions to where clause. It will check any relationship
     * existence, or absence for the records then set ids of the records that
     * matched the condition to `where` clause.
     *
     * This way, when the query gets executed, only those records that matched
     * the `has` condition get retrieved. In the future, once relationship index
     * mapping is implemented, we can simply do all checks inside the where
     * filter since we can treat `has` condition as usual `where` condition.
     *
     * For now, since we must fetch any relationship by eager loading them, due
     * to performance concern, we'll apply `has` conditions this way to gain
     * maximum performance.
     */
    Rollcaller.applyConstraints = function (query) {
        if (query.have.length === 0) {
            return;
        }
        var newQuery = query.newQuery();
        this.addHasWhereConstraints(query, newQuery);
        this.addHasConstraints(query, newQuery.get());
    };
    /**
     * Add has constraints to the given query. It's going to set all relationship
     * as `with` alongside with its closure constraints.
     */
    Rollcaller.addHasWhereConstraints = function (query, newQuery) {
        query.have.forEach(function (constraint) {
            newQuery.with(constraint.relation, constraint.constraint);
        });
    };
    /**
     * Add has constraints as where clause.
     */
    Rollcaller.addHasConstraints = function (query, collection) {
        var comparators = this.getComparators(query);
        var ids = [];
        collection.forEach(function (model) {
            if (comparators.every(function (comparator) { return comparator(model); })) {
                ids.push(model.$self().getIdFromRecord(model));
            }
        });
        query.whereIdIn(ids);
    };
    /**
     * Get comparators for the has clause.
     */
    Rollcaller.getComparators = function (query) {
        var _this = this;
        return query.have.map(function (constraint) { return _this.getComparator(constraint); });
    };
    /**
     * Get a comparator for the has clause.
     */
    Rollcaller.getComparator = function (constraint) {
        var _this = this;
        var compare = this.getCountComparator(constraint.operator);
        return function (model) {
            var count = _this.getRelationshipCount(model[constraint.relation]);
            var result = compare(count, constraint.count);
            return constraint.type === 'exists' ? result : !result;
        };
    };
    /**
     * Get count of the relationship.
     */
    Rollcaller.getRelationshipCount = function (relation) {
        if (Array.isArray(relation)) {
            return relation.length;
        }
        return relation ? 1 : 0;
    };
    /**
     * Get comparator function for the `has` clause.
     */
    Rollcaller.getCountComparator = function (operator) {
        switch (operator) {
            case '=':
                return function (x, y) { return x === y; };
            case '>':
                return function (x, y) { return x > y; };
            case '>=':
                return function (x, y) { return x >= y; };
            case '<':
                return function (x, y) { return x > 0 && x < y; };
            case '<=':
                return function (x, y) { return x > 0 && x <= y; };
            default:
                return function (x, y) { return x === y; };
        }
    };
    return Rollcaller;
}());
export default Rollcaller;
//# sourceMappingURL=Rollcaller.js.map