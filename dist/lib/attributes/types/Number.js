import { __extends } from "tslib";
import Type from './Type';
var Number = /** @class */ (function (_super) {
    __extends(Number, _super);
    /**
     * Create a new number instance.
     */
    function Number(model, value, mutator) {
        /* istanbul ignore next */
        return _super.call(this, model, value, mutator) || this;
    }
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    Number.prototype.make = function (value, _parent, key) {
        return this.mutate(this.fix(value), key);
    };
    /**
     * Transform given data to the number.
     */
    Number.prototype.fix = function (value) {
        if (value === undefined) {
            return this.value;
        }
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        if (value === null && this.isNullable) {
            return value;
        }
        return 0;
    };
    return Number;
}(Type));
export default Number;
//# sourceMappingURL=Number.js.map