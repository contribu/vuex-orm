import { __extends } from "tslib";
import UidGenerator from '../../support/Uid';
import Type from './Type';
var Uid = /** @class */ (function (_super) {
    __extends(Uid, _super);
    /**
     * Create a new uid instance.
     */
    function Uid(model, value) {
        /* istanbul ignore next */
        return _super.call(this, model, value) || this;
    }
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    Uid.prototype.make = function (value) {
        if (typeof value === 'number' || typeof value === 'string') {
            return value;
        }
        if (typeof this.value === 'function') {
            return this.value();
        }
        return UidGenerator.make();
    };
    return Uid;
}(Type));
export default Uid;
//# sourceMappingURL=Uid.js.map