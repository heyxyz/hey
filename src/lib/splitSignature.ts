import { utils } from 'ethers'

export const splitSignature = (signature: any) => {
  return utils.splitSignature(signature)
}
