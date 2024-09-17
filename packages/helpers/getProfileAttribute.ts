import type { Maybe, MetadataAttribute } from "@hey/lens";

type Key = "location" | "website" | "x";

/**
 * Returns the attribute value for a given key from an array of attributes.
 *
 * @param attributes The array of attributes to search through.
 * @param key The key to search for.
 * @returns The attribute value.
 */
const getProfileAttribute = (
  key: Key,
  attributes: Maybe<MetadataAttribute[]> = []
): string => {
  const attribute = attributes?.find((attr) => attr.key === key);
  return attribute?.value || "";
};

export default getProfileAttribute;
