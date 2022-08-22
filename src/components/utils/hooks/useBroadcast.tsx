import { gql, useMutation } from '@apollo/client';
import { Mixpanel } from '@lib/mixpanel';
import toast from 'react-hot-toast';
import { ERRORS } from 'src/constants';

const BROADCAST_MUTATION = gql`
  mutation Broadcast($request: BroadcastRequest!) {
    broadcast(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
    }
  }
`;

interface Props {
  trackingString: string;
  onCompleted?: () => void;
}

const useBroadcast = ({ trackingString, onCompleted }: Props) => {
  const [broadcast, { data, loading }] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError: (error) => {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
      Mixpanel.track(trackingString, {
        result: 'broadcast_error',
        error: error?.message
      });
    }
  });

  return {
    broadcast: ({ request }: any) => broadcast({ variables: { request } }),
    data,
    loading
  };
};

export default useBroadcast;
