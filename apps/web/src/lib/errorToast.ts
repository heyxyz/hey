import { Errors } from '@hey/data/errors';
import { toast } from 'react-hot-toast';

/**
 * Error toast
 * @param error Error
 * @returns void
 */
const errorToast = (error: any) => {
  if (
    error?.message.includes('viem') ||
    error?.message?.includes('Usage limit exceeded, please try again later')
  ) {
    return;
  }

  toast.error(
    error?.data?.message || error?.message || Errors.SomethingWentWrong
  );
};

export default errorToast;
