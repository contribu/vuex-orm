import Relation from '../../attributes/relations/Relation';
var Loader = /** @class */ (function () {
    function Loader() {
    }
    /**
     * Set the relationships that should be eager loaded with the query.
     */
    Loader.with = function (query, name, constraint) {
        var _this = this;
        // If the name of the relation is `*`, we'll load all relationships.
        if (name === '*') {
            this.withAll(query);
            return;
        }
        // If we passed an array, we dispatch the bits to with queries.
        if (Array.isArray(name)) {
            name.forEach(function (relationName) { return _this.with(query, relationName, constraint); });
            return;
        }
        // Else parse relations and set appropriate constraints.
        this.parseWithRelations(query, name.split('.'), constraint);
    };
    /**
     * Set all relationships to be eager loaded with the query.
     */
    Loader.withAll = function (query, constraint) {
        if (constraint === void 0) { constraint = function () { return null; }; }
        var fields = query.model.getFields();
        for (var field in fields) {
            fields[field] instanceof Relation && this.with(query, field, constraint);
        }
    };
    /**
     * Set relationships to be recursively eager loaded with the query.
     */
    Loader.withAllRecursive = function (query, depth) {
        this.withAll(query, function (relatedQuery) {
            depth > 0 && relatedQuery.withAllRecursive(depth - 1);
        });
    };
    /**
     * Set eager load relation and constraint.
     */
    Loader.setEagerLoad = function (query, name, constraint) {
        if (constraint === void 0) { constraint = null; }
        if (!query.load[name]) {
            query.load[name] = [];
        }
        constraint && query.load[name].push(constraint);
    };
    /**
     * Parse a list of relations into individuals.
     */
    Loader.parseWithRelations = function (query, relations, constraint) {
        var _this = this;
        // First we'll get the very first relationship from teh whole relations.
        var relation = relations[0];
        // If the first relation has "or" syntax which is `|` for example
        // `posts|videos`, set each of them as separate eager load.
        relation.split('|').forEach(function (name) {
            // If there's only one relationship in relations array, that means
            // there's no nested relationship. So we'll set the given
            // constraint to the relationship loading.
            if (relations.length === 1) {
                _this.setEagerLoad(query, name, constraint);
                return;
            }
            // Else we'll skip adding constraint because the constraint has to be
            // applied to the nested relationship. We'll let `addNestedWiths`
            // method to handle that later.
            _this.setEagerLoad(query, name);
        });
        // If the given relations only contains a single name, which means it
        // doesn't have any nested relations such as `posts.comments`, we
        // don't need go farther so return here.
        if (relations.length === 1) {
            return;
        }
        // Finally, we shift the first relation from the array and handle lest
        // of relations as a nested relation.
        relations.shift();
        this.addNestedWiths(query, relation, relations, constraint);
    };
    /**
     * Parse the nested relationships in a relation.
     */
    Loader.addNestedWiths = function (query, name, children, constraint) {
        this.setEagerLoad(query, name, function (nestedQuery) {
            nestedQuery.with(children.join('.'), constraint);
        });
    };
    /**
     * Eager load the relationships for the given collection.
     */
    Loader.eagerLoadRelations = function (query, collection) {
        var fields = query.model.getFields();
        for (var name_1 in query.load) {
            var constraints = query.load[name_1];
            var relation = fields[name_1];
            if (relation instanceof Relation) {
                relation.load(query, collection, name_1, constraints);
                continue;
            }
            // If no relation was found on the query, it might be run on the
            // base entity of a hierarchy. In this case, we try looking up
            // the relation on the derived entities
            if (query.model.hasTypes()) {
                var candidateRelation = query.model.findRelationInSubTypes(name_1);
                if (candidateRelation !== null) {
                    candidateRelation.load(query, collection, name_1, constraints);
                }
            }
        }
    };
    return Loader;
}());
export default Loader;
//# sourceMappingURL=Loader.js.map