import Connection from '../connections/Connection';
/**
 * Execute generic mutation. This method is used by `Model.commit` method so
 * that user can commit any state changes easily through models.
 */
function $mutate(state, payload) {
    payload.callback(state[payload.entity]);
}
/**
 * Insert the given record.
 */
function insert(state, payload) {
    var entity = payload.entity, record = payload.record;
    (new Connection(this, state.$name, entity)).insert(record);
}
/**
 * Insert the given records.
 */
function insertRecords(state, payload) {
    var entity = payload.entity, records = payload.records;
    (new Connection(this, state.$name, entity)).insertRecords(records);
}
/**
 * Delete records from the store. The actual name for this mutation is
 * `delete`, but named `destroy` here because `delete` can't be declared at
 * this scope level.
 */
function destroy(state, payload) {
    var entity = payload.entity, id = payload.id;
    (new Connection(this, state.$name, entity)).delete(id);
}
var RootMutations = {
    $mutate: $mutate,
    insert: insert,
    insertRecords: insertRecords,
    delete: destroy
};
export default RootMutations;
//# sourceMappingURL=RootMutations.js.map