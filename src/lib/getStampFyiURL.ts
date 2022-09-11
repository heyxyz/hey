/**
 *
 * @param addresses - Addresses to get stamp.fyi URLs from
 * @returns url
 */
const getStampFyiURL = (addresses: string) => {
  return `https://cdn.stamp.fyi/avatar/eth:${addresses.toLowerCase()}?s=250`;
};

export default getStampFyiURL;
