import type { MetadataAttribute } from '@hey/lens';

/**
 * Returns the attribute value for a given trait type from an array of publication attributes.
 *
 * @param attributes The array of publication attributes to search through.
 * @param traitType The trait type to search for.
 * @returns The attribute value.
 */
const getPublicationAttribute = (
  attributes: MetadataAttribute[] | undefined,
  key: string
): string => {
  const attribute = attributes?.find((attr) => attr.key === key);
  return attribute?.value ?? '';
};

export default getPublicationAttribute;
