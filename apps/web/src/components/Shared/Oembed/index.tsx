import type { AnyPublication } from '@hey/lens';
import type { OG } from '@hey/types/misc';

import DecentOpenAction from '@components/Publication/OpenAction/UnknownModule/Decent';
import { HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
import { ALLOWED_HTML_HOSTS } from '@hey/data/og';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getFavicon from '@hey/helpers/getFavicon';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useEffect, useState } from 'react';

import Embed from './Embed';
import EmptyOembed from './EmptyOembed';
import Player from './Player';

interface OembedProps {
  onLoad?: (og: OG) => void;
  openActionEmbed?: boolean;
  openActionEmbedLoading?: boolean;
  publication?: AnyPublication;
  url: string;
}

const Oembed: FC<OembedProps> = ({
  onLoad,
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
      return <div className="shimmer mt-4 h-[415px] w-full rounded-xl" />;
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

  const targetPublication =
    currentPublication && isMirrorPublication(currentPublication)
      ? currentPublication.mirrorOn
      : currentPublication;

  // Check if the publication has an NFT minting open action module
  const canPerformDecentAction: boolean = Boolean(
    targetPublication &&
      targetPublication.openActionModules.some(
        (module) =>
          module.contract.address === VerifiedOpenActionModules.DecentNFT
      )
  );

  // display NFT mint / purchase embed if open action is attached to publication or new publication is being created with action attached
  // action is only available on Polygon mainnet
  const embedDecentOpenAction: boolean =
    IS_MAINNET && (canPerformDecentAction || Boolean(openActionEmbed));

  if (!og.title && !og.html && !og.nft && !embedDecentOpenAction) {
    return null;
  }

  if (embedDecentOpenAction) {
    return (
      <DecentOpenAction
        og={og}
        openActionEmbed={Boolean(openActionEmbed)}
        openActionEmbedLoading={Boolean(openActionEmbedLoading)}
        publication={currentPublication}
      />
    );
  }

  if (og.html) {
    return <Player og={og} />;
  }

  return <Embed og={og} publicationId={currentPublication?.id} />;
};

export default Oembed;
