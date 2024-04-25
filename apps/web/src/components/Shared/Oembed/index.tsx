import type { AnyPublication } from '@hey/lens';
import type { OG } from '@hey/types/misc';

import DecentOpenAction from '@components/Publication/OpenAction/UnknownModule/Decent';
import { HEY_API_URL } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getFavicon from '@hey/lib/getFavicon';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useEffect, useState } from 'react';

import Embed from './Embed';
import Nft from './Nft';
import Player from './Player';

interface OembedProps {
  className?: string;
  openActionEmbed?: boolean;
  openActionEmbedLoading?: boolean;
  publication?: AnyPublication;
  url?: string;
}

const Oembed: FC<OembedProps> = ({
  className = '',
  openActionEmbed,
  openActionEmbedLoading,
  publication,
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
    queryKey: ['getOembed', url],
    refetchOnMount: false
  });

  const [currentPublication, setCurrentPublication] =
    useState<AnyPublication>();

  useEffect(() => {
    if (publication) {
      setCurrentPublication(publication);
    }
  }, [publication]);

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

  const targetPublication =
    currentPublication && isMirrorPublication(currentPublication)
      ? currentPublication.mirrorOn
      : currentPublication;

  // Check if the publication has an NFT minting open action module
  const canPerformDecentAction: boolean =
    !!targetPublication &&
    targetPublication.openActionModules.some(
      (module) =>
        module.contract.address === VerifiedOpenActionModules.DecentNFT
    );

  const embedDecentOpenAction: boolean =
    canPerformDecentAction || !!openActionEmbed;

  if (!og.title && !og.html && !og.nft && !embedDecentOpenAction) {
    return null;
  }

  return (
    <div className={className}>
      {embedDecentOpenAction ? (
        <DecentOpenAction
          og={og}
          openActionEmbed={!!openActionEmbed}
          openActionEmbedLoading={!!openActionEmbedLoading}
          publication={currentPublication}
        />
      ) : og.html ? (
        <Player og={og} />
      ) : og.nft ? (
        <Nft nft={og.nft} />
      ) : (
        <Embed og={og} publicationId={currentPublication?.id} />
      )}
    </div>
  );
};

export default Oembed;
