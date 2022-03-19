import { FOLLOW_NFT_URI } from 'src/constants'

export const getFollowNFTURI = (handle: string) =>
  `${FOLLOW_NFT_URI}/?handle=${handle}&isTestNet=1`
