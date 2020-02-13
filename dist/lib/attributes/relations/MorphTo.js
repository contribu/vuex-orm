import { __extends } from "tslib";
import Relation from './Relation';
var MorphTo = /** @class */ (function (_super) {
    __extends(MorphTo, _super);
    /**
     * Create a new morph to instance.
     */
    function MorphTo(model, id, type) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.id = id;
        _this.type = type;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    MorphTo.prototype.define = function (schema) {
        var _this = this;
        return schema.union(function (_value, parentValue) { return parentValue[_this.type]; });
    };
    /**
     * Attach the relational key to the given record. Since morph to
     * relationship doesn't have any foreign key, it would do nothing.
     */
    MorphTo.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    MorphTo.prototype.make = function (value, parent, _key) {
        var related = parent[this.type];
        try {
            var model = this.model.relation(related);
            return this.makeOneRelation(value, model);
        }
        catch (_a) {
            return null;
        }
    };
    /**
     * Load the morph to relationship for the collection.
     */
    MorphTo.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var types = this.getTypes(collection);
        var relateds = types.reduce(function (relateds, type) {
            var relatedQuery = _this.getRelation(query, type, constraints);
            relateds[type] = _this.mapSingleRelations(relatedQuery.get(), '$id');
            return relateds;
        }, {});
        collection.forEach(function (item) {
            var id = item[_this.id];
            var type = item[_this.type];
            var related = relateds[type][id];
            item[name] = related || null;
        });
    };
    /**
     * Get all types from the collection.
     */
    MorphTo.prototype.getTypes = function (collection) {
        var _this = this;
        return collection.reduce(function (types, item) {
            var type = item[_this.type];
            !types.includes(type) && types.push(type);
            return types;
        }, []);
    };
    return MorphTo;
}(Relation));
export default MorphTo;
//# sourceMappingURL=MorphTo.js.map