/**
 * Returns a new object with the specified property removed.
 *
 * @param obj The object to remove properties from.
 * @param prop The name of the property to remove.
 * @returns A new object with the property removed.
 */
const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  prop: K
): Omit<T, K> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [prop]: _, ...rest } = obj;
  return rest;
};

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
  primaryType: string;
  domain: Record<string, any>;
  types: Record<string, any>;
  message: Record<string, any>;
} => {
  const { domain, types, value } = typedData;

  return {
    primaryType: Object.keys(omit(types, '__typename'))[0],
    domain: omit(domain, '__typename'),
    types: omit(types, '__typename'),
    message: omit(value, '__typename')
  };
};

export default getSignature;
