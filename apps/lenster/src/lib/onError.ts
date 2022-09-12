import toast from 'react-hot-toast';
import { ERROR_MESSAGE } from 'src/constants';

const onError = (error: any) => {
  toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
};

export default onError;
