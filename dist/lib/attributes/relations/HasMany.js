import { __extends } from "tslib";
import Relation from './Relation';
var HasMany = /** @class */ (function (_super) {
    __extends(HasMany, _super);
    /**
     * Create a new has many instance.
     */
    function HasMany(model, related, foreignKey, localKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.foreignKey = foreignKey;
        _this.localKey = localKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    HasMany.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given data.
     */
    HasMany.prototype.attach = function (key, record, data) {
        var _this = this;
        key.forEach(function (index) {
            var related = data[_this.related.entity];
            if (!related || !related[index] || related[index][_this.foreignKey] !== undefined) {
                return;
            }
            related[index][_this.foreignKey] = record[_this.localKey];
        });
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    HasMany.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the has many relationship for the collection.
     */
    HasMany.prototype.load = function (query, collection, name, constraints) {
        var relation = this.getRelation(query, this.related.entity, constraints);
        this.addEagerConstraints(relation, collection);
        this.match(collection, relation.get(), name);
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    HasMany.prototype.addEagerConstraints = function (relation, collection) {
        relation.whereFk(this.foreignKey, this.getKeys(collection, this.localKey));
    };
    /**
     * Match the eagerly loaded results to their parents.
     */
    HasMany.prototype.match = function (collection, relations, name) {
        var _this = this;
        var dictionary = this.buildDictionary(relations);
        collection.forEach(function (model) {
            var id = model[_this.localKey];
            var relation = dictionary[id];
            model[name] = relation || [];
        });
    };
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    HasMany.prototype.buildDictionary = function (relations) {
        var _this = this;
        return relations.reduce(function (dictionary, relation) {
            var key = relation[_this.foreignKey];
            if (!dictionary[key]) {
                dictionary[key] = [];
            }
            dictionary[key].push(relation);
            return dictionary;
        }, {});
    };
    return HasMany;
}(Relation));
export default HasMany;
//# sourceMappingURL=HasMany.js.map