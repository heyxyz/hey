import { LensterAttachment } from '@generated/lenstertypes'
import axios from 'axios'

const uploadAssetsToIPFS = async (data: any): Promise<LensterAttachment[]> => {
  try {
    const attachments = []
    for (let i = 0; i < data.length; i++) {
      const file = data.item(i)
      const formData = new FormData()
      formData.append('file', file, 'img')
      const upload = await axios('https://ipfs.infura.io:5001/api/v0/add', {
        method: 'POST',
        data: formData
      })
      const { Hash }: { Hash: string } = upload?.data
      attachments.push({
        item: `https://ipfs.infura.io/ipfs/${Hash}`,
        type: file.type,
        altTag: ''
      })
    }

    return attachments
  } catch {
    return []
  }
}

export default uploadAssetsToIPFS
