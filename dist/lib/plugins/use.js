import Model from '../model/Model';
import Attribute from '../attributes/Attribute';
import Type from '../attributes/types/Type';
import Attr from '../attributes/types/Attr';
import String from '../attributes/types/String';
import Number from '../attributes/types/Number';
import Boolean from '../attributes/types/Boolean';
import Uid from '../attributes/types/Uid';
import Relation from '../attributes/relations/Relation';
import HasOne from '../attributes/relations/HasOne';
import BelongsTo from '../attributes/relations/BelongsTo';
import HasMany from '../attributes/relations/HasMany';
import HasManyBy from '../attributes/relations/HasManyBy';
import BelongsToMany from '../attributes/relations/BelongsToMany';
import HasManyThrough from '../attributes/relations/HasManyThrough';
import MorphTo from '../attributes/relations/MorphTo';
import MorphOne from '../attributes/relations/MorphOne';
import MorphMany from '../attributes/relations/MorphMany';
import MorphToMany from '../attributes/relations/MorphToMany';
import MorphedByMany from '../attributes/relations/MorphedByMany';
import Getters from '../modules/Getters';
import Actions from '../modules/Actions';
import RootGetters from '../modules/RootGetters';
import RootActions from '../modules/RootActions';
import RootMutations from '../modules/RootMutations';
import Query from '../query/Query';
export default function (plugin, options) {
    if (options === void 0) { options = {}; }
    var components = {
        Model: Model,
        Attribute: Attribute,
        Type: Type,
        Attr: Attr,
        String: String,
        Number: Number,
        Boolean: Boolean,
        Uid: Uid,
        Relation: Relation,
        HasOne: HasOne,
        BelongsTo: BelongsTo,
        HasMany: HasMany,
        HasManyBy: HasManyBy,
        BelongsToMany: BelongsToMany,
        HasManyThrough: HasManyThrough,
        MorphTo: MorphTo,
        MorphOne: MorphOne,
        MorphMany: MorphMany,
        MorphToMany: MorphToMany,
        MorphedByMany: MorphedByMany,
        Getters: Getters,
        Actions: Actions,
        RootGetters: RootGetters,
        RootActions: RootActions,
        RootMutations: RootMutations,
        Query: Query
    };
    plugin.install(components, options);
}
//# sourceMappingURL=use.js.map