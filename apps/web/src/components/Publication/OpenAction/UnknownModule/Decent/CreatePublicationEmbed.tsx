import type { Nft, OG } from '@hey/types/misc';
import type { UIData } from 'nft-openaction-kit';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';
import DecentOpenActionShimmer from '@components/Shared/Shimmer/DecentOpenActionShimmer';
import { ZERO_ADDRESS } from '@hey/data/constants';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Spinner, Tooltip } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { NftOpenActionKit } from 'nft-openaction-kit';
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
      const nftOpenActionKit = new NftOpenActionKit({
        decentApiKey: process.env.NEXT_PUBLIC_DECENT_API_KEY || '',
        openSeaApiKey: process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
        raribleApiKey: process.env.NEXT_PUBLIC_RARIBLE_API_KEY || ''
      });

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
    chain: uiData?.dstChainId.toString() ?? og.nft?.chain ?? null,
    collectionName: uiData?.nftName ?? og.nft?.collectionName ?? '',
    contractAddress: og.nft?.contractAddress ?? ZERO_ADDRESS,
    creatorAddress: (uiData?.nftCreatorAddress ??
      og.nft?.creatorAddress ??
      ZERO_ADDRESS) as `0x${string}`,
    description: og.description || '',
    endTime: null,
    mediaUrl:
      sanitizeDStorageUrl(uiData?.nftUri) ?? og.nft?.mediaUrl ?? og.image ?? '',
    mintCount: og.nft?.mintCount ?? null,
    mintStatus: og.nft?.mintStatus ?? null,
    mintUrl: og.nft?.mintUrl ?? null,
    schema: uiData?.tokenStandard ?? og.nft?.schema ?? '',
    sourceUrl: og.url
  };

  return (
    <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
      <div className="relative">
        <img
          alt={nft.mediaUrl !== '' ? nft.collectionName : undefined}
          className="h-[350px] max-h-[350px] w-full rounded-t-xl object-cover"
          src={nft.mediaUrl !== '' ? nft.mediaUrl : undefined}
        />
      </div>
      {!!uiData && !!nft ? (
        <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {uiData && nft.creatorAddress ? (
              <ActionInfo
                collectionName={nft.collectionName}
                creatorAddress={nft.creatorAddress}
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
              <Button className="text-base font-normal" size="lg">
                {openActionCTA(uiData.platformName)}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip
              content={<span>{OPEN_ACTION_NO_EMBED_TOOLTIP}</span>}
              placement="top"
            >
              <Button
                className="text-base font-normal"
                disabled={true}
                size="lg"
              >
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
