/**
 * Format IPFS hash
 * @param hash - User's username
 * @returns formatted ipfs hash
 */
export const formatIPFSHash = (hash: string) => {
  return `${hash.slice(0, 4)}…${hash.slice(hash.length - 4, hash.length)}`
}
