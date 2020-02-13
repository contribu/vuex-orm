import { __assign, __extends } from "tslib";
import Utils from '../../support/Utils';
import Relation from './Relation';
var MorphToMany = /** @class */ (function (_super) {
    __extends(MorphToMany, _super);
    /**
     * Create a new belongs to instance.
     */
    function MorphToMany(model, related, pivot, relatedId, id, type, parentKey, relatedKey) {
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
    MorphToMany.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given record. Since morph to many
     * relationship doesn't have any foreign key, it would do nothing.
     */
    MorphToMany.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    MorphToMany.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the morph to many relationship for the collection.
     */
    MorphToMany.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        var pivotQuery = query.newQuery(this.pivot.entity);
        this.addEagerConstraintForPivot(pivotQuery, collection, query.entity);
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
    MorphToMany.prototype.addEagerConstraintForPivot = function (query, collection, type) {
        query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.parentKey));
    };
    /**
     * Set the constraints for the related relation.
     */
    MorphToMany.prototype.addEagerConstraintForRelated = function (query, collection) {
        query.whereFk(this.relatedKey, this.getKeys(collection, this.relatedId));
    };
    /**
     * Create a new indexed map for the pivot relation.
     */
    MorphToMany.prototype.mapPivotRelations = function (pivots, relatedQuery) {
        var _this = this;
        var relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey);
        return pivots.reduce(function (records, record) {
            var id = record[_this.id];
            if (!records[id]) {
                records[id] = [];
            }
            var related = relateds[record[_this.relatedId]];
            records[id] = records[id].concat(related);
            return records;
        }, {});
    };
    /**
     * Create pivot records for the given records if needed.
     */
    MorphToMany.prototype.createPivots = function (parent, data, key) {
        var _this = this;
        Utils.forOwn(data[parent.entity], function (record) {
            var relatedIds = parent.query().newQuery(_this.pivot.entity)
                .where(_this.id, record[_this.parentKey])
                .where(_this.type, parent.entity)
                .get();
            var relateds = (record[key] || []).filter(function (relatedId) { return !relatedIds.includes(relatedId); });
            if (!Array.isArray(relateds) || relateds.length === 0) {
                return;
            }
            _this.createPivotRecord(parent, data, record, relateds);
        });
        return data;
    };
    /**
     * Create a pivot record.
     */
    MorphToMany.prototype.createPivotRecord = function (parent, data, record, related) {
        var _this = this;
        related.forEach(function (id) {
            var _a, _b;
            var parentId = record[_this.parentKey];
            var relatedId = data[_this.related.entity][id][_this.relatedKey];
            var pivotKey = parentId + "_" + id + "_" + parent.entity;
            data[_this.pivot.entity] = __assign(__assign({}, data[_this.pivot.entity]), (_a = {}, _a[pivotKey] = (_b = {
                    $id: pivotKey
                },
                _b[_this.relatedId] = relatedId,
                _b[_this.id] = parentId,
                _b[_this.type] = parent.entity,
                _b), _a));
        });
    };
    return MorphToMany;
}(Relation));
export default MorphToMany;
//# sourceMappingURL=MorphToMany.js.map