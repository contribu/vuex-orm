import Record from '../../data/Record';
import NormalizedData from '../../data/NormalizedData';
import Query from '../../query/Query';
export default class Normalizer {
    /**
     * Normalize the data given data.
     */
    static process(query: Query, record: Record | Record[]): NormalizedData;
}
