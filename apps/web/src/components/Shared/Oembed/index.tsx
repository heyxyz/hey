import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import getFavicon from '@hey/lib/getFavicon';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Embed from './Embed';
import Nft from './Nft';
import Player from './Player';

interface OembedProps {
  className?: string;
  publicationId?: string;
  url?: string;
}

const Oembed: FC<OembedProps> = ({ className = '', publicationId, url }) => {
  const { data, error, isLoading } = useQuery({
    enabled: Boolean(url),
    queryFn: async () => {
      const response = await axios.get(`${HEY_API_URL}/oembed`, {
        params: { url }
      });
      return response.data.oembed;
    },
    queryKey: ['oembed', url],
    refetchOnMount: false
  });

  if (isLoading || error || !data) {
    return null;
  }

  const og: OG = {
    description: data?.description,
    favicon: getFavicon(data.url),
    html: data?.html,
    image: data?.image,
    isLarge: data?.isLarge,
    nft: data?.nft,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (!og.title && !og.html && !og.nft) {
    return null;
  }

  return (
    <div className={className}>
      {og.html ? (
        <Player og={og} />
      ) : og.nft ? (
        <Nft nft={og.nft} publicationId={publicationId} />
      ) : (
        <Embed og={og} publicationId={publicationId} />
      )}
    </div>
  );
};

export default Oembed;
