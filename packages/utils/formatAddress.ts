import { ADDRESS_REGEX } from 'data/constants';

/**
 *
 * @param address Complete ethereum address
 * @returns formatted ethereum address
 */
const formatAddress = (address: string | null, slice = 4): string => {
  if (!address || !ADDRESS_REGEX.test(address)) {
    return '';
  }

  return `${address.slice(0, slice)}…${address.slice(-slice)}`;
};

export default formatAddress;
