import { schema as Normalizr } from 'normalizr';
import Relation from '../attributes/relations/Relation';
import ProcessStrategy from './ProcessStrategy';
var Schema = /** @class */ (function () {
    /**
     * Create a new schema instance.
     */
    function Schema(model) {
        var _this = this;
        /**
         * List of generated schemas.
         */
        this.schemas = {};
        this.model = model;
        var models = model.database().models();
        Object.keys(models).forEach(function (name) { _this.one(models[name]); });
    }
    /**
     * Create a schema for the given model.
     */
    Schema.create = function (model) {
        return (new this(model)).one();
    };
    /**
     * Create a single schema for the given model.
     */
    Schema.prototype.one = function (model) {
        model = model || this.model;
        if (this.schemas[model.entity]) {
            return this.schemas[model.entity];
        }
        var schema = new Normalizr.Entity(model.entity, {}, {
            idAttribute: '$id',
            processStrategy: ProcessStrategy.create(model)
        });
        this.schemas[model.entity] = schema;
        var definition = this.definition(model);
        schema.define(definition);
        return schema;
    };
    /**
     * Create an array schema for the given model.
     */
    Schema.prototype.many = function (model) {
        return new Normalizr.Array(this.one(model));
    };
    /**
     * Create an union schema for the given model.
     */
    Schema.prototype.union = function (callback) {
        return new Normalizr.Union(this.schemas, callback);
    };
    /**
     * Create a dfinition for the given model.
     */
    Schema.prototype.definition = function (model) {
        var _this = this;
        var fields = model.getFields();
        return Object.keys(fields).reduce(function (definition, key) {
            var field = fields[key];
            if (field instanceof Relation) {
                definition[key] = field.define(_this);
            }
            return definition;
        }, {});
    };
    return Schema;
}());
export default Schema;
//# sourceMappingURL=Schema.js.map