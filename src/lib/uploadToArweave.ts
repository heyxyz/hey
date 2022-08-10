import axios from 'axios';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE } from 'src/constants';

const uploadToArweave = async (data: any) => {
  try {
    const upload = await axios('/api/upload', {
      method: 'POST',
      data
    });

    const { id }: { id: string } = upload?.data;

    return id;
  } catch (e) {
    return toast.error(ERROR_MESSAGE);
  }
};

export default uploadToArweave;
