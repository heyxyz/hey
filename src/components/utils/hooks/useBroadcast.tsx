import { ApolloCache, useMutation } from '@apollo/client';
import { BroadcastDocument } from '@generated/documents';
import toast from 'react-hot-toast';
import { ERRORS } from 'src/constants';

interface Props {
  // eslint-disable-next-line no-unused-vars
  onCompleted?: (data: any) => void;
  // eslint-disable-next-line no-unused-vars
  update?: (cache: ApolloCache<any>) => void;
}

const useBroadcast = ({ onCompleted, update }: Props): { broadcast: any; data: any; loading: boolean } => {
  const [broadcast, { data, loading }] = useMutation(BroadcastDocument, {
    onCompleted,
    update,
    onError: (error) => {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
    }
  });

  return {
    broadcast: ({ request }: any) => broadcast({ variables: { request } }),
    data,
    loading
  };
};

export default useBroadcast;
