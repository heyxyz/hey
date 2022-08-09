import { utils } from 'ethers';

const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export default splitSignature;
