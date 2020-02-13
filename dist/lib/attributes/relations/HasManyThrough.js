import { __extends } from "tslib";
import Relation from './Relation';
var HasManyThrough = /** @class */ (function (_super) {
    __extends(HasManyThrough, _super);
    /**
     * Create a new has many through instance.
     */
    function HasManyThrough(model, related, through, firstKey, secondKey, localKey, secondLocalKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.through = _this.model.relation(through);
        _this.firstKey = firstKey;
        _this.secondKey = secondKey;
        _this.localKey = localKey;
        _this.secondLocalKey = secondLocalKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    HasManyThrough.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given data. Since has many through
     * relationship doesn't have any foreign key, it would do nothing.
     */
    HasManyThrough.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    HasManyThrough.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the has many through relationship for the collection.
     */
    HasManyThrough.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        var throughQuery = query.newQuery(this.through.entity);
        this.addEagerConstraintForThrough(throughQuery, collection);
        var throughs = throughQuery.get();
        this.addEagerConstraintForRelated(relatedQuery, throughs);
        var relateds = this.mapThroughRelations(throughs, relatedQuery);
        collection.forEach(function (item) {
            var related = relateds[item[_this.localKey]];
            item[name] = related || [];
        });
    };
    /**
     * Set the constraints for the through relation.
     */
    HasManyThrough.prototype.addEagerConstraintForThrough = function (query, collection) {
        query.where(this.firstKey, this.getKeys(collection, this.localKey));
    };
    /**
     * Set the constraints for the related relation.
     */
    HasManyThrough.prototype.addEagerConstraintForRelated = function (query, collection) {
        query.where(this.secondKey, this.getKeys(collection, this.secondLocalKey));
    };
    /**
     * Create a new indexed map for the through relation.
     */
    HasManyThrough.prototype.mapThroughRelations = function (throughs, relatedQuery) {
        var _this = this;
        var relateds = this.mapManyRelations(relatedQuery.get(), this.secondKey);
        return throughs.reduce(function (records, record) {
            var id = record[_this.firstKey];
            if (!records[id]) {
                records[id] = [];
            }
            var related = relateds[record[_this.secondLocalKey]];
            if (related === undefined) {
                return records;
            }
            records[id] = records[id].concat(related);
            return records;
        }, {});
    };
    return HasManyThrough;
}(Relation));
export default HasManyThrough;
//# sourceMappingURL=HasManyThrough.js.map