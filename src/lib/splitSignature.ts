import { utils } from 'ethers'

const splitSignature = (signature: any) => {
  return utils.splitSignature(signature)
}

export default splitSignature
