import type { AnyPublication } from '@hey/lens';
import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import DecentOpenActionShimmer from '@components/Shared/Shimmer/DecentOpenActionShimmer';
import { HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getFavicon from '@hey/helpers/getFavicon';
import getPublicationData from '@hey/helpers/getPublicationData';
import getURLs from '@hey/helpers/getURLs';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Card } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

import FeedEmbed from './FeedEmbed';

export const OPEN_ACTION_EMBED_TOOLTIP = 'Open action embedded';
export const OPEN_ACTION_NO_EMBED_TOOLTIP = 'Mint not availabe anymore';

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

  const canPerformDecentAction = Boolean(
    targetPublication &&
      targetPublication.openActionModules.some(
        (module) =>
          module.contract.address === VerifiedOpenActionModules.DecentNFT
      )
  );

  const embedDecentOpenAction = IS_MAINNET && canPerformDecentAction;

  if (isLoading) {
    return (
      <Card forceRounded onClick={stopEventPropagation}>
        <div className="shimmer h-[350px] max-h-[350px] rounded-t-xl" />
        <DecentOpenActionShimmer />
      </Card>
    );
  }
  if (error || !data || !embedDecentOpenAction || !og.nft) {
    return null;
  }

  return <FeedEmbed og={og} publication={currentPublication} />;
};

export default DecentOpenAction;
