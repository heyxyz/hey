import { isAddress } from "viem";

/**
 * Format the given EVM address by displaying only the first and last few characters.
 *
 * @param address Complete EVM address
 * @param slice Number of characters to display from the start and end of the address
 * @returns Formatted EVM address
 */
const formatAddress = (address: null | string, slice = 4): string => {
  if (!address) {
    return "";
  }

  const formattedAddress = address.toLowerCase();

  if (isAddress(formattedAddress)) {
    return `${formattedAddress.slice(0, slice + 2)}…${formattedAddress.slice(
      formattedAddress.length - slice
    )}`;
  }

  return formattedAddress;
};

export default formatAddress;
