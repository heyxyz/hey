import { resolveEns } from '@hey/lib/resolveEns';
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
  error: unknown;
  loading: boolean;
} => {
  const getEnsDetails = async () => {
    const { data } = await resolveEns([address]);

    return data[0].length ? data[0] : address;
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getEnsDetails,
    queryKey: ['ensName', address]
  });

  return { ens: data, error, loading: isLoading };
};

export default useEnsName;
