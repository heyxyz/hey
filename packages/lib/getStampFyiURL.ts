import urlcat from 'urlcat';

/**
 * Returns the cdn.stamp.fyi URL for the specified Ethereum address.
 *
 * @param address The Ethereum address to get the URL for.
 * @returns The cdn.stamp.fyi URL.
 */
const getStampFyiURL = (address: string): string => {
  const lowerCaseAddress = address.toLowerCase();
  return urlcat('https://cdn.stamp.fyi/avatar/eth::address', {
    address: `eth:${lowerCaseAddress}`,
    s: 300
  });
};

export const getPlaceholderStampFyiURL = (address: string): string => {
  const lowerCaseAddress = address.toLowerCase();
  return urlcat('https://cdn.stamp.fyi/avatar/eth::address', {
    address: `eth:${lowerCaseAddress}`,
    s: 50
  });
};

export default getStampFyiURL;
