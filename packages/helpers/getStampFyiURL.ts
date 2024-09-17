import urlcat from "urlcat";

/**
 * Returns the cdn.stamp.fyi URL for the specified Ethereum address.
 *
 * @param address The Ethereum address to get the URL for.
 * @returns The cdn.stamp.fyi URL.
 */
const getStampFyiURL = (address: string): string => {
  const lowerCaseAddress = address.toLowerCase();
  return urlcat("https://cdn.stamp.fyi/avatar/eth::address", {
    address: lowerCaseAddress,
    s: 300
  });
};

export default getStampFyiURL;
