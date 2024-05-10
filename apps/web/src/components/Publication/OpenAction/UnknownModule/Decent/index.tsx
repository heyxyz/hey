import type { AnyPublication } from '@hey/lens';
import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import EmptyOembed from '@components/Shared/Oembed/EmptyOembed';
import { HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
import { ALLOWED_HTML_HOSTS } from '@hey/data/og';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getFavicon from '@hey/helpers/getFavicon';
import getPublicationData from '@hey/helpers/getPublicationData';
import getURLs from '@hey/helpers/getURLs';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

import FeedEmbed from './FeedEmbed';

export const OPEN_ACTION_EMBED_TOOLTIP = 'Open action embedded';
export const OPEN_ACTION_NO_EMBED_TOOLTIP = 'Unable to embed open action';

export const openActionCTA = (platformName?: string): string => {
  const name = platformName || '';
  const platform = name.toLowerCase();
  return ['opensea', 'rarible', 'superrare'].includes(platform)
    ? 'Buy'
    : 'Mint';
};
interface DecentOpenActionProps {
  publication: AnyPublication;
}

const DecentOpenAction: FC<DecentOpenActionProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { metadata } = targetPublication;
  const filteredContent = getPublicationData(metadata)?.content || '';

  const urls = getURLs(filteredContent);
  const url = urls[0] as string;

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

  const [currentPublication, setCurrentPublication] =
    useState<AnyPublication>(publication);

  useEffect(() => {
    if (publication) {
      setCurrentPublication(publication);
    }
  }, [publication]);

  const og: OG = {
    description: data?.description,
    favicon: data?.url ? getFavicon(data.url) : null,
    html: data?.html,
    image: data?.image,
    nft: data?.nft,
    site: data?.site,
    title: data?.title,
    url: url
  };

  const canPerformDecentAction: boolean = Boolean(
    targetPublication &&
      targetPublication.openActionModules.some(
        (module) =>
          module.contract.address === VerifiedOpenActionModules.DecentNFT
      )
  );

  const embedDecentOpenAction: boolean = IS_MAINNET && canPerformDecentAction;

  if (isLoading || error || !data) {
    if (error) {
      return null;
    }

    const hostname = new URL(url).hostname.replace('www.', '');

    if (ALLOWED_HTML_HOSTS.includes(hostname)) {
      return <div className="shimmer mt-4 h-[415px] w-full rounded-xl" />;
    }

    return <EmptyOembed url={url} />;
  }

  if (!og.title && !og.html && !og.nft && !embedDecentOpenAction) {
    return null;
  }

  if (!embedDecentOpenAction) {
    return null;
  }

  return <FeedEmbed og={og} publication={currentPublication} />;
};

export default DecentOpenAction;
