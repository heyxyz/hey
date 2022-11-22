import type { Attribute } from 'lens';

/**
 *
 * @param attributes - The attributes to search through
 * @param traitType - The trait type to search for
 * @returns the attribute from a trait
 */
const getAttributeFromTrait = (attributes: Attribute[] | null | undefined, traitType: string) => {
  return attributes?.find((el) => el.traitType === traitType)?.value;
};

export default getAttributeFromTrait;
