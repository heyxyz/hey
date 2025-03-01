import type { Maybe, MetadataAttributeFragment } from "@hey/indexer";

type Key = "location" | "website" | "x";

/**
 * Returns the attribute value for a given key from an array of attributes.
 *
 * @param attributes The array of attributes to search through.
 * @param key The key to search for.
 * @returns The attribute value.
 */
const getAccountAttribute = (
  key: Key,
  attributes: Maybe<MetadataAttributeFragment[]> = []
): string => {
  const attribute = attributes?.find((attr) => attr.key === key);
  return attribute?.value || "";
};

export default getAccountAttribute;
