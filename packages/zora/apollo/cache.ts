import { InMemoryCache } from '@apollo/client';

import result from '../generated';

const cache = new InMemoryCache({
  addTypename: false,
  possibleTypes: result.possibleTypes
});

export default cache;
