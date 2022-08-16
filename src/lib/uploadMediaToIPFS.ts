import { LensterAttachment } from '@generated/lenstertypes';
import axios from 'axios';

const uploadMediaToIPFS = async (data: any): Promise<LensterAttachment[]> => {
  try {
    const attachments = [];
    for (let i = 0; i < data.length; i++) {
      const file = data.item(i);
      const formData = new FormData();
      formData.append('data', file, 'img');
      const upload = await axios('https://shuttle-4.estuary.tech/content/add', {
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ESTUARY_KEY}`
        }
      });
      const { cid }: { cid: string } = await upload.data;
      attachments.push({
        item: `ipfs://${cid}`,
        type: file.type,
        altTag: ''
      });
    }

    return attachments;
  } catch {
    return [];
  }
};

export default uploadMediaToIPFS;
