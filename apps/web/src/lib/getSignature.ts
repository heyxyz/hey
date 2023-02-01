import omit from './omit';

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
