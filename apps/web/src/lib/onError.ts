import { ERROR_MESSAGE } from 'data/constants';
import toast from 'react-hot-toast';

const onError = (error: any) => {
  toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
};

export default onError;
