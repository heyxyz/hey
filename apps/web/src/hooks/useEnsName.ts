import { resolveEns } from '@lib/resolveEns';
import { useQuery } from '@tanstack/react-query';

interface UseEnsNameProps {
  address: string;
  enabled?: boolean;
}

const useEnsName = ({
  address,
  enabled
}: UseEnsNameProps): {
  ens: string;
  loading: boolean;
  error: unknown;
} => {
  const getEnsDetails = async () => {
    const { data } = await resolveEns([address]);

    return data[0].length ? data[0] : address;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['ensName', address],
    queryFn: getEnsDetails,
    enabled
  });

  return { ens: data, loading: isLoading, error };
};

export default useEnsName;
