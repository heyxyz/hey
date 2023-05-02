/**
 * Returns the cdn.stamp.fyi URL for the specified Ethereum address.
 *
 * @param address The Ethereum address to get the URL for.
 * @returns The cdn.stamp.fyi URL.
 */
const getStampFyiURL = (address: string): string => {
  const lowerCaseAddress = address.toLowerCase();
  return `https://cdn.stamp.fyi/avatar/eth:${lowerCaseAddress}?s=300`;
};

export default getStampFyiURL;
