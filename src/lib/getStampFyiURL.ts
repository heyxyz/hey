/**
 *
 * @param address - The address to get the cdn.stamp.fyi url for
 * @returns cdn.stamp.fyi url
 */
const getStampFyiURL = (address: string) => {
  return `https://cdn.stamp.fyi/avatar/eth:${address.toLowerCase()}?s=250`;
};

export default getStampFyiURL;
