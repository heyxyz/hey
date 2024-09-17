import omitDeep from "omit-deep";

interface TypedData {
  domain: Record<string, any>;
  types: Record<string, any>;
  value: Record<string, any>;
}

/**
 * Splits the given typed data into three parts, omitting the "__typename" property from each part.
 *
 * @param typedData The typed data to split.
 * @returns An object containing the three parts of the typed data.
 */
const getSignature = (
  typedData: TypedData
): {
  domain: Record<string, any>;
  message: Record<string, any>;
  primaryType: string;
  types: Record<string, any>;
} => {
  const { domain, types, value } = typedData;

  return {
    domain: omitDeep(domain, ["__typename"]),
    message: omitDeep(value, ["__typename"]),
    primaryType: Object.keys(omitDeep(types, ["__typename"]))[0],
    types: omitDeep(types, ["__typename"])
  };
};

export default getSignature;
