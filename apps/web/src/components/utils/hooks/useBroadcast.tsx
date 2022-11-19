import type { ApolloCache } from '@apollo/client';
import { useBroadcastMutation } from 'lens';
import toast from 'react-hot-toast';
import { ERRORS } from 'src/constants';

interface Props {
  onCompleted?: (data: any) => void;
  update?: (cache: ApolloCache<any>) => void;
}

const useBroadcast = ({ onCompleted, update }: Props): { broadcast: any; data: any; loading: boolean } => {
  const [broadcast, { data, loading }] = useBroadcastMutation({
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
