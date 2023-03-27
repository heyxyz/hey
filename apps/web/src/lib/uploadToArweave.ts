import axios from 'axios';
import { ERROR_MESSAGE, METADATA_WORKER_URL } from 'data/constants';
import toast from 'react-hot-toast';

/**
 * Uploads the given data to Arweave.
 *
 * @param data The data to upload.
 * @returns The Arweave transaction ID.
 * @throws An error if the upload fails.
 */
const uploadToArweave = async (data: any): Promise<string> => {
  try {
    const upload = await axios(METADATA_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    });

    const { id }: { id: string } = upload?.data;

    return id;
  } catch {
    toast.error(ERROR_MESSAGE);
    throw new Error(ERROR_MESSAGE);
  }
};

export default uploadToArweave;
