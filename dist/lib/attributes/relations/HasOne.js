import { __extends } from "tslib";
import Relation from './Relation';
var HasOne = /** @class */ (function (_super) {
    __extends(HasOne, _super);
    /**
     * Create a new has one instance.
     */
    function HasOne(model, related, foreignKey, localKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.foreignKey = foreignKey;
        _this.localKey = localKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    HasOne.prototype.define = function (schema) {
        return schema.one(this.related);
    };
    /**
     * Attach the relational key to the related data. For example,
     * when User has one Phone, it will attach value to the
     * `user_id` field of Phone record.
     */
    HasOne.prototype.attach = function (key, record, data) {
        // Check if the record has local key set. If not, set the local key to be
        // the id value. This happens if the user defines the custom local key
        // and didn't include it in the data being normalized.
        if (!record[this.localKey]) {
            record[this.localKey] = this.model.getIndexIdFromRecord(record);
        }
        // Then set the foreign key of the related record if it exists to be the
        // local key of this record.
        var related = data[this.related.entity] && data[this.related.entity][key];
        if (related) {
            related[this.foreignKey] = record[this.localKey];
        }
    };
    /**
     * Make value to be set to model property. This method is used when
     * instantiating a model or creating a plain object from a model.
     */
    HasOne.prototype.make = function (value, _parent, _key) {
        return this.makeOneRelation(value, this.related);
    };
    /**
     * Load the has one relationship for the collection.
     */
    HasOne.prototype.load = function (query, collection, name, constraints) {
        var relation = this.getRelation(query, this.related.entity, constraints);
        this.addEagerConstraints(relation, collection);
        this.match(collection, relation.get(), name);
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    HasOne.prototype.addEagerConstraints = function (relation, collection) {
        relation.whereFk(this.foreignKey, this.getKeys(collection, this.localKey));
    };
    /**
     * Match the eagerly loaded results to their parents.
     */
    HasOne.prototype.match = function (collection, relations, name) {
        var _this = this;
        var dictionary = this.buildDictionary(relations);
        collection.forEach(function (model) {
            var id = model[_this.localKey];
            var relation = dictionary[id];
            model[name] = relation || null;
        });
    };
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    HasOne.prototype.buildDictionary = function (relations) {
        var _this = this;
        return relations.reduce(function (dictionary, relation) {
            var key = relation[_this.foreignKey];
            dictionary[key] = relation;
            return dictionary;
        }, {});
    };
    return HasOne;
}(Relation));
export default HasOne;
//# sourceMappingURL=HasOne.js.map