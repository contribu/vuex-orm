import { __extends } from "tslib";
import Attribute from '../Attribute';
var Type = /** @class */ (function (_super) {
    __extends(Type, _super);
    /**
     * Create a new type instance.
     */
    function Type(model, value, mutator) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        /**
         * Whether if the attribute can accept `null` as a value.
         */
        _this.isNullable = false;
        _this.value = value;
        _this.mutator = mutator;
        return _this;
    }
    /**
     * Set `isNullable` to be `true`.
     */
    Type.prototype.nullable = function () {
        this.isNullable = true;
        return this;
    };
    /**
     * Mutate the given value by mutator.
     */
    Type.prototype.mutate = function (value, key) {
        var mutator = this.mutator || this.model.mutators()[key];
        return mutator ? mutator(value) : value;
    };
    return Type;
}(Attribute));
export default Type;
//# sourceMappingURL=Type.js.map