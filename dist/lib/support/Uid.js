var Uid = /** @class */ (function () {
    function Uid() {
    }
    /**
     * Generate an UUID.
     */
    Uid.make = function () {
        this.count++;
        return "" + this.prefix + this.count;
    };
    /**
     * Reset the count to 0.
     */
    Uid.reset = function () {
        this.count = 0;
    };
    /**
     * Count to create a unique id.
     */
    Uid.count = 0;
    /**
     * Prefix string to be used for the id.
     */
    Uid.prefix = '$uid';
    return Uid;
}());
export default Uid;
//# sourceMappingURL=Uid.js.map