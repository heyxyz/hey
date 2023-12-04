import { HEY_API_URL } from '@hey/data/constants';
import type { UnlonelyNfc } from '@hey/types/nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseUnlonelyNfcProps {
  id: string;
  enabled?: boolean;
}

const useUnlonelyNfc = ({
  id,
  enabled
}: UseUnlonelyNfcProps): {
  data: UnlonelyNfc;
  loading: boolean;
  error: unknown;
} => {
  const getUnlonelyNfcDetails = async () => {
    const response = await axios.get(
      `${HEY_API_URL}/nft/unlonely/getUnlonelyNfc`,
      { params: { id } }
    );

    return response.data?.nfc;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['getUnlonelyNfcDetails', id],
    queryFn: getUnlonelyNfcDetails,
    enabled
  });

  return { data, loading: isLoading, error };
};

export default useUnlonelyNfc;
