import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import getFavicon from '@hey/helpers/getFavicon';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

import Embed from './Embed';
import Nft from './Nft';
import Player from './Player';

interface OembedProps {
  onLoad?: (og: OG) => void;
  publicationId?: string;
  url?: string;
}

const Oembed: FC<OembedProps> = ({ onLoad, publicationId, url }) => {
  const { data, error, isLoading } = useQuery({
    enabled: Boolean(url),
    queryFn: async () => {
      const response = await axios.get(`${HEY_API_URL}/oembed`, {
        params: { url }
      });
      return response.data.oembed;
    },
    queryKey: ['getOembed', url],
    refetchOnMount: false
  });

  useEffect(() => {
    if (onLoad) {
      onLoad(data as OG);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading || error || !data) {
    return null;
  }

  const og: OG = {
    description: data?.description,
    favicon: getFavicon(data.url),
    html: data?.html,
    image: data?.image,
    nft: data?.nft,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (!og.title && !og.html && !og.nft) {
    return null;
  }

  return (
    <div>
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
