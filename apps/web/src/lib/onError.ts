import { ERROR_MESSAGE } from 'data/constants';
import toast from 'react-hot-toast';

/**
 * Displays error message to user
 *
 * @param error the error object
 */
const onError = (error: any) => {
  toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
};

export default onError;
