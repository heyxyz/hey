import type { Nft, OG } from '@hey/types/misc';
import type { UIData } from 'nft-openaction-kit';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';
import DecentOpenActionShimmer from '@components/Shared/Shimmer/DecentOpenActionShimmer';
import errorToast from '@helpers/errorToast';
import getNftOpenActionKit from '@helpers/getNftOpenActionKit';
import { ZERO_ADDRESS } from '@hey/data/constants';
import sanitizeDStorageUrl from '@hey/helpers/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button, Card, Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { type FC, useEffect, useState } from 'react';

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
  const [uiData, setUiData] = useState<UIData>();

  useEffect(() => {
    const generateUiData = async () => {
      const nftOpenActionKit = getNftOpenActionKit();

      // Call the async function and pass the link
      try {
        const uiDataResult: UIData = await nftOpenActionKit.generateUiData({
          contentURI: og.url
        });

        if (uiDataResult) {
          setUiData(uiDataResult);
        }
      } catch (error) {
        errorToast(error);
      }
    };
    generateUiData();
  }, [og]);

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

  const [isNftCoverLoaded, setIsNftCoverLoaded] = useState(false);

  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <div className="relative">
        <img
          alt={nft.mediaUrl.length ? nft.collectionName : undefined}
          className={cn(
            'h-[350px] max-h-[350px] w-full rounded-t-xl object-contain',
            isNftCoverLoaded ? 'visible' : 'invisible'
          )}
          onLoad={() => setIsNftCoverLoaded(true)}
          src={nft.mediaUrl.length ? nft.mediaUrl : undefined}
        />
      </div>
      {!!uiData && !!nft ? (
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
              <Button size="lg">{openActionCTA(uiData.platformName)}</Button>
            </Tooltip>
          ) : (
            <Tooltip
              content={<span>{OPEN_ACTION_NO_EMBED_TOOLTIP}</span>}
              placement="top"
            >
              <Button disabled={true} size="lg">
                {openActionCTA(uiData.platformName)}
              </Button>
            </Tooltip>
          )}
        </div>
      ) : (
        <DecentOpenActionShimmer />
      )}
    </Card>
  );
};

export default CreatePublicationEmbed;
