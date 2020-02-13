import Container from '../container/Container';
export default (function (database, options) {
    if (options === void 0) { options = {}; }
    var namespace = options.namespace || 'entities';
    return function (store) {
        database.start(store, namespace);
        Container.register(store);
    };
});
//# sourceMappingURL=install.js.map