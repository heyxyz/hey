import type { BasePaintCanvas } from '@hey/types/nft';

import { HEY_API_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseBasePaintCanvasProps {
  enabled?: boolean;
  id: number;
}

const useBasePaintCanvas = ({
  enabled,
  id
}: UseBasePaintCanvasProps): {
  data: BasePaintCanvas;
  error: unknown;
  loading: boolean;
} => {
  const getBasePaintCanvasMetadata = async () => {
    const response = await axios.get(`${HEY_API_URL}/nft/getBasePaintCanvas`, {
      params: { id }
    });

    return response.data?.canvas;
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getBasePaintCanvasMetadata,
    queryKey: ['getBasePaintCanvasMetadata', id]
  });

  return { data, error, loading: isLoading };
};

export default useBasePaintCanvas;
