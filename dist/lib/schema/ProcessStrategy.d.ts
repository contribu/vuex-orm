import { schema } from 'normalizr';
import Record from '../data/Record';
import Model from '../model/Model';
export default class ProcessStrategy {
    /**
     * Create the process strategy.
     */
    static create(model: typeof Model): schema.StrategyFunction<Record>;
    /**
     * Generate a field that is defined as primary keys. For keys with a proper
     * value set, it will do nothing. If a key is missing, it will generate
     * UID for it.
     */
    private static generateIds;
    /**
     * Generate index id field (which is `$id`) and attach to the given record.
     */
    private static generateIndexId;
}
