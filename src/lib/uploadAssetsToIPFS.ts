/**
 * Upload image to IPFS
 * @param data - File data (images and videos)
 * @returns ipfs URL
 */
export async function uploadAssetsToIPFS(data: File) {
  const formData = new FormData()
  formData.append('file', data, 'img')
  const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    body: formData
  })
  const { Hash }: { Hash: string } = await upload.json()

  return {
    item: `https://ipfs.infura.io/ipfs/${Hash}`,
    type: data.type
  }
}
