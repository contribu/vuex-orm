import { __extends } from "tslib";
import Relation from './Relation';
var HasManyBy = /** @class */ (function (_super) {
    __extends(HasManyBy, _super);
    /**
     * Create a new has many by instance.
     */
    function HasManyBy(model, parent, foreignKey, ownerKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.parent = _this.model.relation(parent);
        _this.foreignKey = foreignKey;
        _this.ownerKey = ownerKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    HasManyBy.prototype.define = function (schema) {
        return schema.many(this.parent);
    };
    /**
     * Attach the relational key to the given data.
     */
    HasManyBy.prototype.attach = function (key, record, _data) {
        var _this = this;
        if (key.length === 0) {
            return;
        }
        record[this.foreignKey] = key.map(function (parentId) {
            return _this.parent.getIdFromRecord(_data[_this.parent.entity][parentId]);
        });
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    HasManyBy.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.parent);
    };
    /**
     * Load the has many by relationship for the collection.
     */
    HasManyBy.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.parent.entity, constraints);
        this.addConstraintForHasManyBy(relatedQuery, collection);
        var relations = this.mapSingleRelations(relatedQuery.get(), this.ownerKey);
        collection.forEach(function (item) {
            var related = _this.getRelatedRecords(relations, item[_this.foreignKey]);
            item[name] = related;
        });
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    HasManyBy.prototype.addConstraintForHasManyBy = function (query, collection) {
        var _this = this;
        var keys = collection.reduce(function (keys, item) {
            return keys.concat(item[_this.foreignKey]);
        }, []);
        query.where(this.ownerKey, keys);
    };
    /**
     * Get related records.
     */
    HasManyBy.prototype.getRelatedRecords = function (records, keys) {
        return keys.reduce(function (items, id) {
            var related = records[id];
            related && items.push(related);
            return items;
        }, []);
    };
    return HasManyBy;
}(Relation));
export default HasManyBy;
//# sourceMappingURL=HasManyBy.js.map