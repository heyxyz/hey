import type { Attribute, Maybe } from 'lens';

type Key = 'hasPrideLogo' | 'app' | 'twitter' | 'location' | 'website' | 'statusEmoji' | 'statusMessage';

/**
 * ProfileAttributeFinder type for better readability.
 *
 * @param attributes - The attributes to search through
 * @param key - The key to search for
 * @returns the attribute from a trait
 */
type ProfileAttributeFinder = (attributes: Maybe<Attribute[]> | undefined, key: Key) => string;

/**
 * Get profile attribute by key from the attributes list.
 *
 * @param attributes - The attributes to search through
 * @param key - The key to search for
 * @returns the attribute from a trait
 */
const getProfileAttribute: ProfileAttributeFinder = (attributes, key) => {
  return attributes?.find((attribute) => attribute.key === key)?.value ?? '';
};

export default getProfileAttribute;
