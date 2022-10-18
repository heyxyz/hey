import type { LensterAttachment } from '@generated/lenstertypes';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const infuraAuth =
  'Basic ' +
  Buffer.from(process.env.NEXT_PUBLIC_INFURA_PID + ':' + process.env.NEXT_PUBLIC_INFURA_KEY).toString(
    'base64'
  );

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadMediaToIPFS = async (data: any): Promise<LensterAttachment[]> => {
  try {
    const files = Array.from(data);
    const attachments = await Promise.all(
      files.map(async (_: any, i: number) => {
        const file = data.item(i);
        const formData = new FormData();
        formData.append('data', file, uuid());

        // const upload = await axios(`https://ipfs.infura.io:5001/api/v0/add`, {
        //   method: 'POST',
        //   data: formData,
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_ESTUARY_KEY}`
        //   }
        // });
        // const { cid }: { cid: string } = await upload.data;

        const upload = await axios(`https://ipfs.infura.io:5001/api/v0/add`, {
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: infuraAuth
          }
        });
        const { Hash }: { Hash: string } = await upload.data;
        return {
          item: `ipfs://${Hash}`,
          type: file.type,
          altTag: ''
        };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

export default uploadMediaToIPFS;
