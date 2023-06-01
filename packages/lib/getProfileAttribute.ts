import type { Attribute, Maybe } from '@lenster/lens';

type Key =
  | 'hasPrideLogo'
  | 'app'
  | 'twitter'
  | 'location'
  | 'website'
  | 'statusEmoji'
  | 'statusMessage';

/**
 * Returns the attribute value for a given key from an array of attributes.
 *
 * @param attributes The array of attributes to search through.
 * @param key The key to search for.
 * @returns The attribute value.
 */
const getProfileAttribute = (
  attributes: Maybe<Attribute[]> = [],
  key: Key
): string => {
  const attribute = attributes?.find((attr) => attr.key === key);
  return attribute?.value ?? '';
};

export default getProfileAttribute;
