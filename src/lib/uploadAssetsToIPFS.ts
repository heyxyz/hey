import { Attachment } from '@generated/lenstertypes'

const uploadAssetsToIPFS = async (data: File): Promise<Attachment> => {
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

export default uploadAssetsToIPFS
