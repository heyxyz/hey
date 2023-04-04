import { InMemoryCache } from '@apollo/client';

import result from '../generated';

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes
});

export default cache;
