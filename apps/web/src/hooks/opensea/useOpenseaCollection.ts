import type { OpenSeaCollection } from '@hey/types/opensea-nft';

import { OPENSEA_KEY } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import urlcat from 'urlcat';

interface UseOpenseaCollectionProps {
  enabled?: boolean;
  slug: string;
}

const useOpenseaCollection = ({
  enabled,
  slug
}: UseOpenseaCollectionProps): {
  data: OpenSeaCollection;
  error: unknown;
  loading: boolean;
} => {
  const getOpenseaCollectionDetails = async () => {
    const response = await axios.get(
      urlcat('https://api.opensea.io/api/v1/collection/:slug', { slug }),
      { headers: { 'X-API-KEY': OPENSEA_KEY } }
    );

    return response.data?.collection;
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getOpenseaCollectionDetails,
    queryKey: ['getOpenseaCollectionDetails', slug]
  });

  return { data, error, loading: isLoading };
};

export default useOpenseaCollection;
