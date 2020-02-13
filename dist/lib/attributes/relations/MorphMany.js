import { __extends } from "tslib";
import Relation from './Relation';
var MorphMany = /** @class */ (function (_super) {
    __extends(MorphMany, _super);
    /**
     * Create a new belongs to instance.
     */
    function MorphMany(model, related, id, type, localKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.id = id;
        _this.type = type;
        _this.localKey = localKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    MorphMany.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given data.
     */
    MorphMany.prototype.attach = function (key, record, data) {
        var _this = this;
        var relatedItems = data[this.related.entity];
        key.forEach(function (id) {
            var relatedItem = relatedItems[id];
            relatedItem[_this.id] = relatedItem[_this.id] || _this.related.getIdFromRecord(record);
            relatedItem[_this.type] = relatedItem[_this.type] || _this.model.entity;
        });
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    MorphMany.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the morph many relationship for the record.
     */
    MorphMany.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        this.addEagerConstraintForMorphMany(relatedQuery, collection, query.entity);
        var relations = this.mapManyRelations(relatedQuery.get(), this.id);
        collection.forEach(function (item) {
            var related = relations[item[_this.localKey]];
            item[name] = related || [];
        });
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    MorphMany.prototype.addEagerConstraintForMorphMany = function (query, collection, type) {
        query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.localKey));
    };
    return MorphMany;
}(Relation));
export default MorphMany;
//# sourceMappingURL=MorphMany.js.map