import { __assign, __extends } from "tslib";
import Utils from '../../support/Utils';
import Relation from './Relation';
var MorphedByMany = /** @class */ (function (_super) {
    __extends(MorphedByMany, _super);
    /**
     * Create a new belongs to instance.
     */
    function MorphedByMany(model, related, pivot, relatedId, id, type, parentKey, relatedKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.pivot = _this.model.relation(pivot);
        _this.relatedId = relatedId;
        _this.id = id;
        _this.type = type;
        _this.parentKey = parentKey;
        _this.relatedKey = relatedKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    MorphedByMany.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given data. Since morphed by many
     * relationship doesn't have any foreign key, it would do nothing.
     */
    MorphedByMany.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Make value to be set to model property. This method is used when
     * instantiating a model or creating a plain object from a model.
     */
    MorphedByMany.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the morph many relationship for the record.
     */
    MorphedByMany.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        var pivotQuery = query.newQuery(this.pivot.entity);
        this.addEagerConstraintForPivot(pivotQuery, collection, this.related.entity);
        var pivots = pivotQuery.get();
        this.addEagerConstraintForRelated(relatedQuery, pivots);
        var relateds = this.mapPivotRelations(pivots, relatedQuery);
        collection.forEach(function (item) {
            var related = relateds[item[_this.parentKey]];
            item[name] = related || [];
        });
    };
    /**
     * Set the constraints for the pivot relation.
     */
    MorphedByMany.prototype.addEagerConstraintForPivot = function (query, collection, type) {
        query.whereFk(this.type, type).whereFk(this.relatedId, this.getKeys(collection, this.parentKey));
    };
    /**
     * Set the constraints for the related relation.
     */
    MorphedByMany.prototype.addEagerConstraintForRelated = function (query, collection) {
        query.whereFk(this.relatedKey, this.getKeys(collection, this.id));
    };
    /**
     * Create a new indexed map for the pivot relation.
     */
    MorphedByMany.prototype.mapPivotRelations = function (pivots, relatedQuery) {
        var _this = this;
        var relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey);
        return pivots.reduce(function (records, record) {
            var id = record[_this.relatedId];
            if (!records[id]) {
                records[id] = [];
            }
            var related = relateds[record[_this.id]];
            records[id] = records[id].concat(related);
            return records;
        }, {});
    };
    /**
     * Create pivot records for the given records if needed.
     */
    MorphedByMany.prototype.createPivots = function (parent, data, key) {
        var _this = this;
        Utils.forOwn(data[parent.entity], function (record) {
            var related = record[key];
            if (!Array.isArray(related)) {
                return;
            }
            _this.createPivotRecord(data, record, related);
        });
        return data;
    };
    /**
     * Create a pivot record.
     */
    MorphedByMany.prototype.createPivotRecord = function (data, record, related) {
        var _this = this;
        related.forEach(function (id) {
            var _a, _b;
            var parentId = record[_this.parentKey];
            var pivotKey = id + "_" + parentId + "_" + _this.related.entity;
            data[_this.pivot.entity] = __assign(__assign({}, data[_this.pivot.entity]), (_a = {}, _a[pivotKey] = (_b = {
                    $id: pivotKey
                },
                _b[_this.relatedId] = parentId,
                _b[_this.id] = _this.model.getIdFromRecord(data[_this.related.entity][id]),
                _b[_this.type] = _this.related.entity,
                _b), _a));
        });
    };
    return MorphedByMany;
}(Relation));
export default MorphedByMany;
//# sourceMappingURL=MorphedByMany.js.map