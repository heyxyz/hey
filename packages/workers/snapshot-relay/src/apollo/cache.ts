import { InMemoryCache } from '@apollo/client';
import result from 'snapshot';

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes
});

export default cache;
