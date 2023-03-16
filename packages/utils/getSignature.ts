/**
 *
 * @param object - Object to remove properties from
 * @param name - Name of property to remove
 * @returns object with property removed
 */
const omit = (object: Record<string, any>, name: string) => {
  delete object[name];
  return object;
};

/**
 *
 * @param typedData - Typed data to split
 * @returns typed data parts
 */
const getSignature = (typedData: { domain: Object; types: Object; value: Object }) => {
  return {
    domain: omit(typedData.domain, '__typename'),
    types: omit(typedData.types, '__typename'),
    value: omit(typedData.value, '__typename')
  };
};

export default getSignature;
