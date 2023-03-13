import { utils } from 'ethers';

const isValidEthAddress = (address: string) => {
  return utils.isAddress(address);
};

export default isValidEthAddress;
