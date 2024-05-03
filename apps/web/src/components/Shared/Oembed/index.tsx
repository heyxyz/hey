import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { ALLOWED_HTML_HOSTS } from '@hey/data/og';
import getFavicon from '@hey/helpers/getFavicon';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

import Embed from './Embed';
import EmptyOembed from './EmptyOembed';
import Nft from './Nft';
import Player from './Player';

interface OembedProps {
  onLoad?: (og: OG) => void;
  publicationId?: string;
  url: string;
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
    if (error) {
      return null;
    }

    const hostname = new URL(url).hostname.replace('www.', '');

    if (ALLOWED_HTML_HOSTS.includes(hostname)) {
      return <div className="shimmer h-[415px] w-full rounded-xl" />;
    }

    return <EmptyOembed url={url} />;
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

  if (og.html) {
    return <Player og={og} />;
  }

  if (og.nft) {
    return <Nft nft={og.nft} publicationId={publicationId} />;
  }

  return <Embed og={og} publicationId={publicationId} />;
};

export default Oembed;
