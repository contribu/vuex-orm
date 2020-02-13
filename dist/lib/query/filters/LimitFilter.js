var LimitFilter = /** @class */ (function () {
    function LimitFilter() {
    }
    /**
     * Limit the given records by the lmilt and offset.
     */
    LimitFilter.filter = function (query, records) {
        return records.slice(query.offsetNumber, query.offsetNumber + query.limitNumber);
    };
    return LimitFilter;
}());
export default LimitFilter;
//# sourceMappingURL=LimitFilter.js.map