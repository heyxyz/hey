import { Maybe } from '@generated/types';

type Attribute = {
  key: string;
  value: string;
};

type Query = 'hasPrideLogo' | 'app' | 'twitter' | 'location' | 'website';

/**
 *
 * @param attributes - Array of attributes
 * @param query - Query to search for
 * @returns attribute if found, otherwise undefined
 */
const getAttribute = (attributes?: Maybe<Attribute[]>, query?: Query): string => {
  return attributes?.find((o) => o.key === query)?.value || '';
};

export default getAttribute;
