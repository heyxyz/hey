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
    const { result } = await resolveEns([address]);
    return result[0].length ? result[0] : address;
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getEnsDetails,
    queryKey: ['getEnsDetails', address]
  });

  return { ens: data, error, loading: isLoading };
};

export default useEnsName;
