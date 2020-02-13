var OptionsBuilder = /** @class */ (function () {
    function OptionsBuilder() {
    }
    /**
     * Get persist options from the given payload.
     */
    OptionsBuilder.createPersistOptions = function (payload) {
        return {
            create: payload.create,
            insert: payload.insert,
            update: payload.update,
            insertOrUpdate: payload.insertOrUpdate
        };
    };
    return OptionsBuilder;
}());
export default OptionsBuilder;
//# sourceMappingURL=OptionsBuilder.js.map