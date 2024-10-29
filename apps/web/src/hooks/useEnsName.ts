import formatAddress from "@hey/helpers/formatAddress";
import resolveEns from "@hey/helpers/resolveEns";
import { useQuery } from "@tanstack/react-query";

const GET_ENS_DETAILS_QUERY_KEY = "getEnsDetails";

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
    return result[0].length ? result[0] : formatAddress(address);
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getEnsDetails,
    queryKey: [GET_ENS_DETAILS_QUERY_KEY, address]
  });

  return { ens: data, error, loading: isLoading };
};

export default useEnsName;
