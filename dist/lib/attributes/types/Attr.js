import { __extends } from "tslib";
import Type from './Type';
var Attr = /** @class */ (function (_super) {
    __extends(Attr, _super);
    /**
     * Create a new attr instance.
     */
    function Attr(model, value, mutator) {
        /* istanbul ignore next */
        return _super.call(this, model, value, mutator) || this;
    }
    /**
     * Make value to be set to model property. This method is used when
     * instantiating a model or creating a plain object from a model.
     */
    Attr.prototype.make = function (value, _parent, key) {
        value = value !== undefined ? value : this.value;
        // Default Value might be a function (taking no parameter).
        var localValue = value;
        if (typeof value === 'function') {
            localValue = value();
        }
        return this.mutate(localValue, key);
    };
    return Attr;
}(Type));
export default Attr;
//# sourceMappingURL=Attr.js.map