/**
 * Serialize typed data
 * @param typedData Typed data
 * @returns Serialized typed data
 */
const serializedTypedData = (typedData: any): string => {
  return JSON.stringify(typedData, (_, v) =>
    typeof v === 'bigint' ? Number(v) : v
  );
};

export default serializedTypedData;
