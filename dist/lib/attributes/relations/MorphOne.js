import { __extends } from "tslib";
import Relation from './Relation';
var MorphOne = /** @class */ (function (_super) {
    __extends(MorphOne, _super);
    /**
     * Create a new belongs to instance.
     */
    function MorphOne(model, related, id, type, localKey) {
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
    MorphOne.prototype.define = function (schema) {
        return schema.one(this.related);
    };
    /**
     * Attach the relational key to the given data.
     */
    MorphOne.prototype.attach = function (key, record, data) {
        var relatedRecord = data[this.related.entity][key];
        relatedRecord[this.id] = relatedRecord[this.id] || this.related.getIdFromRecord(record);
        relatedRecord[this.type] = relatedRecord[this.type] || this.model.entity;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    MorphOne.prototype.make = function (value, _parent, _key) {
        return this.makeOneRelation(value, this.related);
    };
    /**
     * Load the morph many relationship for the record.
     */
    MorphOne.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        this.addEagerConstraintForMorphOne(relatedQuery, collection, query.entity);
        var relations = this.mapSingleRelations(relatedQuery.get(), this.id);
        collection.forEach(function (item) {
            var related = relations[item[_this.localKey]];
            item[name] = related || null;
        });
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    MorphOne.prototype.addEagerConstraintForMorphOne = function (query, collection, type) {
        query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.localKey));
    };
    return MorphOne;
}(Relation));
export default MorphOne;
//# sourceMappingURL=MorphOne.js.map