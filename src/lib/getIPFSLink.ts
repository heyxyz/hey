const getIPFSLink = (hash: string): string => {
  const infuraIPFS = 'https://ipfs.infura.io/ipfs/'

  return hash
    .replace('https://ipfs.io/ipfs/', infuraIPFS)
    .replace('ipfs://', infuraIPFS)
}

export default getIPFSLink
