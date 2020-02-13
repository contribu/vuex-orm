import { __extends } from "tslib";
import Relation from './Relation';
var BelongsTo = /** @class */ (function (_super) {
    __extends(BelongsTo, _super);
    /**
     * Create a new belongs to instance.
     */
    function BelongsTo(model, parent, foreignKey, ownerKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.parent = _this.model.relation(parent);
        _this.foreignKey = foreignKey;
        _this.ownerKey = ownerKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    BelongsTo.prototype.define = function (schema) {
        return schema.one(this.parent);
    };
    /**
     * Attach the relational key to the given data. For example, when Post
     * belongs to User, it will attach value to the `user_id` field of
     * Post record.
     */
    BelongsTo.prototype.attach = function (key, record, data) {
        // See if the record has the foreign key, if yes, it means the user has
        // provided the key explicitly so do nothing and return.
        if (record[this.foreignKey] !== undefined) {
            return;
        }
        // If there is no foreign key, let's set it here.
        record[this.foreignKey] = data[this.parent.entity] && data[this.parent.entity][key]
            ? data[this.parent.entity][key][this.ownerKey]
            : key;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    BelongsTo.prototype.make = function (value, _parent, _key) {
        return this.makeOneRelation(value, this.parent);
    };
    /**
     * Load the belongs to relationship for the collection.
     */
    BelongsTo.prototype.load = function (query, collection, name, constraints) {
        var relation = this.getRelation(query, this.parent.entity, constraints);
        this.addEagerConstraints(relation, collection);
        this.match(collection, relation.get(), name);
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    BelongsTo.prototype.addEagerConstraints = function (relation, collection) {
        relation.whereFk(this.ownerKey, this.getKeys(collection, this.foreignKey));
    };
    /**
     * Match the eagerly loaded results to their parents.
     */
    BelongsTo.prototype.match = function (collection, relations, name) {
        var _this = this;
        var dictionary = this.buildDictionary(relations);
        collection.forEach(function (model) {
            var id = model[_this.foreignKey];
            var relation = id !== null ? dictionary[id] : null;
            model[name] = relation || null;
        });
    };
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    BelongsTo.prototype.buildDictionary = function (relations) {
        var _this = this;
        return relations.reduce(function (dictionary, relation) {
            var key = relation[_this.ownerKey];
            dictionary[key] = relation;
            return dictionary;
        }, {});
    };
    return BelongsTo;
}(Relation));
export default BelongsTo;
//# sourceMappingURL=BelongsTo.js.map