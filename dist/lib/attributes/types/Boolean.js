import { __extends } from "tslib";
import Type from './Type';
var Boolean = /** @class */ (function (_super) {
    __extends(Boolean, _super);
    /**
     * Create a new number instance.
     */
    function Boolean(model, value, mutator) {
        /* istanbul ignore next */
        return _super.call(this, model, value, mutator) || this;
    }
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    Boolean.prototype.make = function (value, _parent, key) {
        return this.mutate(this.fix(value), key);
    };
    /**
     * Transform given data to the boolean.
     */
    Boolean.prototype.fix = function (value) {
        if (value === undefined) {
            return this.value;
        }
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            if (value.length === 0) {
                return false;
            }
            var int = parseInt(value, 0);
            return isNaN(int) ? true : !!int;
        }
        if (typeof value === 'number') {
            return !!value;
        }
        if (value === null && this.isNullable) {
            return value;
        }
        return false;
    };
    return Boolean;
}(Type));
export default Boolean;
//# sourceMappingURL=Boolean.js.map