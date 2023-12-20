import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import getFavicon from '@hey/lib/getFavicon';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Embed from './Embed';
import Player from './Player';

interface OembedProps {
  className?: string;
  onData?: (data: OG) => void;
  publicationId?: string;
  url?: string;
}

const Oembed: FC<OembedProps> = ({
  className = '',
  onData,
  publicationId,
  url
}) => {
  const { data, error, isLoading } = useQuery({
    enabled: Boolean(url),
    queryFn: async () => {
      const response = await axios.get(`${HEY_API_URL}/oembed`, {
        params: { url }
      });
      return response.data.oembed;
    },
    queryKey: ['oembed', url]
  });

  if (isLoading || error || !data) {
    return null;
  }

  onData?.(data);

  const og: OG = {
    description: data?.description,
    favicon: getFavicon(data.url),
    html: data?.html,
    image: data?.image,
    isLarge: data?.isLarge,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (!og.title) {
    return null;
  }

  return (
    <div className={className}>
      {og.html ? (
        <Player og={og} />
      ) : (
        <Embed og={og} publicationId={publicationId} />
      )}
    </div>
  );
};

export default Oembed;
