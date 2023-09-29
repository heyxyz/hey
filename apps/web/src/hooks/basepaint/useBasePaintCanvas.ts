import { NFT_WORKER_URL } from '@hey/data/constants';
import type { BasePaintCanvas } from '@hey/types/nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseBasePaintCanvasProps {
  id: number;
  enabled?: boolean;
}

const useBasePaintCanvas = ({
  id,
  enabled
}: UseBasePaintCanvasProps): {
  data: BasePaintCanvas;
  loading: boolean;
  error: unknown;
} => {
  const loadNftDetails = async () => {
    const response = await axios.get(`${NFT_WORKER_URL}/basepaint`, {
      params: { id }
    });

    return response.data?.canvas;
  };

  const { data, isLoading, error } = useQuery(
    ['basePaintCanvasMetadata', id],
    () => loadNftDetails().then((res) => res),
    { enabled }
  );

  return { data, loading: isLoading, error };
};

export default useBasePaintCanvas;
