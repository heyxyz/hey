import type { MetadataAttributeOutput } from 'lens';

/**
 *
 * @param attributes The attributes to search through
 * @param traitType The trait type to search for
 * @returns the attribute from a trait
 */
const getPublicationAttribute = (
  attributes: MetadataAttributeOutput[] | undefined,
  traitType: string
): string => {
  return attributes?.find((el) => el.traitType === traitType)?.value ?? '';
};

export default getPublicationAttribute;
