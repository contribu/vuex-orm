import Normalizer from './Normalizer';
import PivotCreator from './PivotCreator';
import Attacher from './Attacher';
var Processor = /** @class */ (function () {
    function Processor() {
    }
    /**
     * Normalize the given data.
     */
    Processor.normalize = function (query, record) {
        // First, let's normalize the data.
        var data = Normalizer.process(query, record);
        // Then, attach any missing foreign keys. For example, if a User has many
        // Post nested but without foreign key such as `user_id`, we can attach
        // the `user_id` value to the Post entities.
        data = Attacher.process(query, data);
        // Now we'll create any missing pivot entities for relationships such as
        // `belongsTo` or `morphMany`.
        data = PivotCreator.process(query, data);
        // And we'll return the result as a normalized data.
        return data;
    };
    return Processor;
}());
export default Processor;
//# sourceMappingURL=Processor.js.map