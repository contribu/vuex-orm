import { __extends } from "tslib";
import Type from './Type';
var String = /** @class */ (function (_super) {
    __extends(String, _super);
    /**
     * Create a new string instance.
     */
    function String(model, value, mutator) {
        /* istanbul ignore next */
        return _super.call(this, model, value, mutator) || this;
    }
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    String.prototype.make = function (value, _parent, key) {
        return this.mutate(this.fix(value), key);
    };
    /**
     * Convert given value to the string.
     */
    String.prototype.fix = function (value) {
        if (value === undefined) {
            return this.value;
        }
        if (typeof value === 'string') {
            return value;
        }
        if (value === null && this.isNullable) {
            return value;
        }
        return value + '';
    };
    return String;
}(Type));
export default String;
//# sourceMappingURL=String.js.map