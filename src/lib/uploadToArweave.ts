import axios from 'axios';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE } from 'src/constants';

/**
 *
 * @param data - Data to upload to arweave
 * @returns arweave transaction id
 */
const uploadToArweave = async (data: any): Promise<string> => {
  try {
    const upload = await axios('/api/upload', {
      method: 'POST',
      data
    });

    const { id }: { id: string } = upload?.data;

    return id;
  } catch (e) {
    toast.error(ERROR_MESSAGE);
    throw new Error(ERROR_MESSAGE);
  }
};

export default uploadToArweave;
