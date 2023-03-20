import type { Attribute, Maybe } from 'lens';

type Key = 'hasPrideLogo' | 'app' | 'twitter' | 'location' | 'website' | 'statusEmoji' | 'statusMessage';

/**
 *
 * @param attributes The attributes to search through
 * @param key The key to search for
 * @returns the attribute from a trait
 */
const getProfileAttribute = (attributes: Maybe<Attribute[]> | undefined, key: Key): string => {
  return attributes?.find((el) => el.key === key)?.value ?? '';
};

export default getProfileAttribute;
