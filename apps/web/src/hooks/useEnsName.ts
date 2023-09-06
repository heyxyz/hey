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
  const loadEnsDetails = async () => {
    const { data } = await resolveEns([address]);

    return data[0].length ? data[0] : address;
  };

  const { data, isLoading, error } = useQuery(
    ['ensName', address],
    () => loadEnsDetails().then((res) => res),
    { enabled }
  );

  return { ens: data, loading: isLoading, error };
};

export default useEnsName;
