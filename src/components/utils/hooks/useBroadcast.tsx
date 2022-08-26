import { ApolloCache, gql, useMutation } from '@apollo/client';
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
  onCompleted?: () => void;
  // eslint-disable-next-line no-unused-vars
  update?: (cache: ApolloCache<any>) => void;
}

const useBroadcast = ({ onCompleted, update }: Props) => {
  const [broadcast, { data, loading }] = useMutation(BROADCAST_MUTATION, {
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
