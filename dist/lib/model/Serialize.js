import { __assign } from "tslib";
import Relation from '../attributes/relations/Relation';
var defaultOption = {
    relations: true
};
/**
 * Serialize the given model to attributes. This method will ignore
 * relationships, and it includes the index id.
 */
export function toAttributes(model) {
    var record = toJson(model, { relations: false });
    record.$id = model.$id;
    return record;
}
/**
 * Serialize given model POJO.
 */
export function toJson(model, option) {
    if (option === void 0) { option = {}; }
    option = __assign(__assign({}, defaultOption), option);
    var record = {};
    var fields = model.$fields();
    for (var key in fields) {
        var f = fields[key];
        var v = model[key];
        if (f instanceof Relation) {
            record[key] = option.relations ? relation(v) : emptyRelation(v);
            continue;
        }
        record[key] = value(model[key]);
    }
    return record;
}
/**
 * Serialize given value.
 */
function value(v) {
    if (v === null) {
        return null;
    }
    if (Array.isArray(v)) {
        return array(v);
    }
    if (typeof v === 'object') {
        return object(v);
    }
    return v;
}
/**
 * Serialize an array into json.
 */
function array(a) {
    return a.map(function (v) { return value(v); });
}
/**
 * Serialize an object into json.
 */
function object(o) {
    var obj = {};
    for (var key in o) {
        obj[key] = value(o[key]);
    }
    return obj;
}
function relation(relation) {
    if (relation === null) {
        return null;
    }
    if (Array.isArray(relation)) {
        return relation.map(function (model) { return model.$toJson(); });
    }
    return relation.$toJson();
}
function emptyRelation(relation) {
    return Array.isArray(relation) ? [] : null;
}
//# sourceMappingURL=Serialize.js.map