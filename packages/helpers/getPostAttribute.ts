import type { Maybe, MetadataAttributeFragment } from "@hey/indexer";

/**
 * Returns the attribute value for a given trait type from an array of post attributes.
 *
 * @param attributes The array of post attributes to search through.
 * @param key The key of the attribute to find.
 * @returns The attribute value.
 */
const getPostAttribute = (
  attributes: Maybe<MetadataAttributeFragment[]> | undefined,
  key: string
): string => {
  const attribute = attributes?.find((attr) => attr.key === key);
  return attribute?.value || "";
};

export default getPostAttribute;
