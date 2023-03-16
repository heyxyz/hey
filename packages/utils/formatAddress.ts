import { ADDRESS_REGEX } from 'data/constants';

/**
 *
 * @param address - Complete ethereum address
 * @returns formatted ethereum address
 */
const formatAddress = (address: string | null, slice = 4): string => {
  if (!address) {
    return '';
  }

  const regex = ADDRESS_REGEX;
  if (address.match(regex)) {
    return `${address.slice(0, slice)}…${address.slice(address.length - slice, address.length)}`;
  }

  return address;
};

export default formatAddress;
