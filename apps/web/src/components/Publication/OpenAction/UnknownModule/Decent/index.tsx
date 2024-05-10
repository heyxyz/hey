import type { AnyPublication } from '@hey/lens';
import type { OG } from '@hey/types/misc';

import { HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getFavicon from '@hey/helpers/getFavicon';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useEffect, useState } from 'react';

import CreatePublicationEmbed from './CreatePublicationEmbed';
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
  mirrorPublication?: AnyPublication;
  nftOpenActionEmbed?: boolean;
  nftOpenActionEmbedLoading?: boolean;
  onLoad?: (og: OG) => void;
  publication?: AnyPublication;
  url: string;
}

const DecentOpenAction: FC<DecentOpenActionProps> = ({
  mirrorPublication,
  nftOpenActionEmbed,
  nftOpenActionEmbedLoading,
  onLoad,
  publication,
  url
}) => {
  const [currentPublication, setCurrentPublication] =
    useState<AnyPublication>();

  const { data } = useQuery({
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
    if (publication) {
      setCurrentPublication(publication);
    }
  }, [publication]);

  useEffect(() => {
    if (onLoad) {
      onLoad(data as OG);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const og: OG = {
    description: data?.description,
    favicon: data?.url ? getFavicon(data.url) : null,
    html: data?.html,
    image: data?.image,
    nft: data?.nft,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  const targetPublication =
    currentPublication && isMirrorPublication(currentPublication)
      ? currentPublication.mirrorOn
      : currentPublication;

  const canPerformDecentAction: boolean = Boolean(
    targetPublication &&
      targetPublication.openActionModules.some(
        (module) =>
          module.contract.address === VerifiedOpenActionModules.DecentNFT
      )
  );

  const embedDecentOpenAction: boolean =
    IS_MAINNET && (canPerformDecentAction || Boolean(nftOpenActionEmbed));

  if (!embedDecentOpenAction) {
    return null;
  }

  if (!publication) {
    return (
      <CreatePublicationEmbed
        og={og}
        openActionEmbed={Boolean(nftOpenActionEmbed)}
        openActionEmbedLoading={Boolean(nftOpenActionEmbedLoading)}
      />
    );
  }

  return (
    <FeedEmbed
      mirrorPublication={mirrorPublication}
      og={og}
      openActionEmbed={Boolean(nftOpenActionEmbed)}
      openActionEmbedLoading={Boolean(nftOpenActionEmbedLoading)}
      publication={publication}
    />
  );
};

export default DecentOpenAction;
