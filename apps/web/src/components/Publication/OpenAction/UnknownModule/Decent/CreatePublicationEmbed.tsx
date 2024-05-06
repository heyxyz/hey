import type { Nft, OG } from '@hey/types/misc';
import type { FC } from 'react';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';
import DecentOpenActionShimmer from '@components/Shared/Shimmer/DecentOpenActionShimmer';
import getNftOpenActionKit from '@helpers/getNftOpenActionKit';
import { ZERO_ADDRESS } from '@hey/data/constants';
import sanitizeDStorageUrl from '@hey/helpers/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button, Card, Image, Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import {
  OPEN_ACTION_EMBED_TOOLTIP,
  OPEN_ACTION_NO_EMBED_TOOLTIP,
  openActionCTA
} from '.';

interface CreatePublicationEmbedProps {
  og: OG;
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
}

const CreatePublicationEmbed: FC<CreatePublicationEmbedProps> = ({
  og,
  openActionEmbed,
  openActionEmbedLoading
}) => {
  const [isNftCoverLoaded, setIsNftCoverLoaded] = useState(false);

  const getUiData = async () => {
    const nftOpenActionKit = getNftOpenActionKit();
    try {
      const uiDataResult = await nftOpenActionKit.generateUiData({
        contentURI: og.url
      });

      return uiDataResult;
    } catch (error) {
      return null;
    }
  };

  const { data: uiData, isLoading } = useQuery({
    enabled: Boolean(og.url),
    queryFn: getUiData,
    queryKey: ['getUiData', og.url]
  });

  const nft: Nft = {
    chain: uiData?.dstChainId.toString() || og.nft?.chain || null,
    collectionName: uiData?.nftName || og.nft?.collectionName || '',
    contractAddress: og.nft?.contractAddress || ZERO_ADDRESS,
    creatorAddress: (uiData?.nftCreatorAddress ||
      og.nft?.creatorAddress ||
      ZERO_ADDRESS) as `0x${string}`,
    description: og.description || '',
    endTime: null,
    mediaUrl:
      sanitizeDStorageUrl(uiData?.nftUri) || og.nft?.mediaUrl || og.image || '',
    mintCount: og.nft?.mintCount || null,
    mintStatus: og.nft?.mintStatus || null,
    mintUrl: og.nft?.mintUrl || null,
    schema: uiData?.tokenStandard || og.nft?.schema || '',
    sourceUrl: og.url
  };

  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <div className="relative">
        <Image
          alt={nft.mediaUrl.length ? nft.collectionName : undefined}
          className={cn(
            'h-[350px] max-h-[350px] w-full rounded-t-xl object-contain',
            isNftCoverLoaded ? 'visible' : 'invisible'
          )}
          onLoad={() => setIsNftCoverLoaded(true)}
          src={nft.mediaUrl.length ? nft.mediaUrl : undefined}
        />
      </div>
      {Boolean(uiData) && Boolean(nft) && !isLoading ? (
        <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {uiData && nft.creatorAddress ? (
              <ActionInfo
                collectionName={nft.collectionName}
                creatorAddress={nft.creatorAddress}
                hidePrice
                uiData={uiData}
              />
            ) : null}
          </div>
          {openActionEmbedLoading ? (
            <Spinner size="xs" />
          ) : openActionEmbed ? (
            <Tooltip
              content={<span>{OPEN_ACTION_EMBED_TOOLTIP}</span>}
              placement="top"
            >
              <Button size="lg">{openActionCTA(uiData?.platformName)}</Button>
            </Tooltip>
          ) : (
            <Tooltip
              content={<span>{OPEN_ACTION_NO_EMBED_TOOLTIP}</span>}
              placement="top"
            >
              <Button disabled={true} size="lg">
                {openActionCTA(uiData?.platformName)}
              </Button>
            </Tooltip>
          )}
        </div>
      ) : isLoading ? (
        <DecentOpenActionShimmer />
      ) : null}
    </Card>
  );
};

export default CreatePublicationEmbed;
