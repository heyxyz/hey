import type { MetadataAttributeOutput } from 'lens';

/**
 * PublicationAttributeFinder type for better readability.
 *
 * @param attributes - The attributes to search through
 * @param traitType - The trait type to search for
 * @returns the attribute from a trait
 */
type PublicationAttributeFinder = (
  attributes: MetadataAttributeOutput[] | undefined,
  traitType: string
) => string;

/**
 * Get publication attribute by trait type from the attributes list.
 *
 * @param attributes - The attributes to search through
 * @param traitType - The trait type to search for
 * @returns the attribute from a trait
 */
const getPublicationAttribute: PublicationAttributeFinder = (attributes, traitType) => {
  return attributes?.find((attribute) => attribute.traitType === traitType)?.value ?? '';
};

export default getPublicationAttribute;
