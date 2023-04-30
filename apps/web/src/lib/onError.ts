import Errors from 'data/errors';
import toast from 'react-hot-toast';

/**
 * Displays error message to user
 *
 * @param error the error object
 */
const onError = (error: any) => {
  toast.error(
    error?.data?.message ?? error?.message ?? Errors.SomethingWentWrong
  );
};

export default onError;
