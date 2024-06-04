import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { OG } from '@hey/types/misc';
import type { ActionData, PublicationInfo, UIData } from 'nft-openaction-kit';
import type { FC } from 'react';

import DecentOpenActionShimmer from '@components/Shared/Shimmer/DecentOpenActionShimmer';
import getNftOpenActionKit from '@helpers/getNftOpenActionKit';
import { Leafwatch } from '@helpers/leafwatch';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { REWARDS_PROFILE_ID, ZERO_ADDRESS } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import sanitizeDStorageUrl from '@hey/helpers/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button, Card, Image, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createTrackedSelector } from 'react-tracked';
import { CHAIN } from 'src/constants';
import { useNftOaCurrencyStore } from 'src/store/persisted/useNftOaCurrencyStore';
import { useAccount } from 'wagmi';
import { create } from 'zustand';

import { OPEN_ACTION_NO_EMBED_TOOLTIP, openActionCTA } from '.';
import ActionInfo from './ActionInfo';
import DecentOpenActionModule from './Module';

interface State {
  activeOpenActionModal: null | string;
  selectedQuantity: number;
  setActiveOpenActionModal: (activeOpenActionModal: null | string) => void;
  setSelectedQuantity: (selectedQuantity: number) => void;
}

const store = create<State>((set) => ({
  activeOpenActionModal: null,
  selectedQuantity: 1,
  setActiveOpenActionModal: (activeOpenActionModal) =>
    set({ activeOpenActionModal }),
  setSelectedQuantity: (selectedQuantity) => set({ selectedQuantity })
}));

export const useNftOpenActionStore = createTrackedSelector(store);

enum ActionDataResponseType {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL'
}

const formatPublicationData = (
  targetPublication: MirrorablePublication
): PublicationInfo => {
  const [profileId, pubId] = targetPublication.id.split('-');

  const unknownModules =
    targetPublication.openActionModules as UnknownOpenActionModuleSettings[];
  const actionModules = unknownModules.map(
    (module) => module.contract.address
  ) as string[];
  const actionModulesInitDatas = unknownModules.map(
    (module) => module.initializeCalldata
  ) as string[];

  return {
    actionModules,
    actionModulesInitDatas,
    profileId: parseInt(profileId, 16).toString(),
    pubId: parseInt(pubId, 16).toString()
  };
};

interface FeedEmbedProps {
  og: OG;
  publication: MirrorablePublication;
}

const FeedEmbed: FC<FeedEmbedProps> = ({ og, publication }) => {
  const { address } = useAccount();
  const { selectedNftOaCurrency } = useNftOaCurrencyStore();
  const { selectedQuantity, setActiveOpenActionModal } =
    useNftOpenActionStore();

  const [nft, setNft] = useState({
    chain: og.nft?.chain || null,
    collectionName: og.nft?.collectionName || '',
    contractAddress: og.nft?.contractAddress || ZERO_ADDRESS,
    creatorAddress: og.nft?.creatorAddress || ZERO_ADDRESS,
    description: og.description || '',
    endTime: null,
    mediaUrl: og.nft?.mediaUrl || og.image || '',
    mintCount: null,
    mintStatus: null,
    mintUrl: null,
    schema: og.nft?.schema || '',
    sourceUrl: og.url
  });
  const [isNftCoverLoaded, setIsNftCoverLoaded] = useState(false);

  const module = publication.openActionModules.find(
    (module) => module.contract.address === VerifiedOpenActionModules.DecentNFT
  );

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

  const getActionData = async (): Promise<{
    data: ActionData | null | UIData;
    type: ActionDataResponseType;
  }> => {
    const nftOpenActionKit = getNftOpenActionKit();
    const pubInfo = formatPublicationData(publication);

    return await nftOpenActionKit
      .actionDataFromPost({
        executingClientProfileId: REWARDS_PROFILE_ID,
        paymentToken: selectedNftOaCurrency,
        post: pubInfo,
        profileId: publication.by.id,
        profileOwnerAddress: publication.by.ownedBy.address,
        quantity: selectedQuantity,
        senderAddress: address || ZERO_ADDRESS,
        sourceUrl: og.url,
        srcChainId: CHAIN.id.toString()
      })
      .then((actionData) => {
        setNft((prevNft) => ({
          ...prevNft,
          chain: actionData.uiData.dstChainId.toString() || prevNft.chain,
          collectionName: actionData.uiData.nftName || prevNft.collectionName,
          creatorAddress: (actionData.uiData.nftCreatorAddress ||
            prevNft.creatorAddress) as `0x{string}`,
          mediaUrl:
            sanitizeDStorageUrl(actionData.uiData.nftUri) || prevNft.mediaUrl,
          schema: actionData.uiData.tokenStandard || prevNft.schema
        }));

        return { data: actionData, type: ActionDataResponseType.FULL };
      })
      .catch(async () => {
        return await getUiData().then((uiData) => {
          setNft((prevNft) => ({
            ...prevNft,
            chain: uiData?.dstChainId.toString() || prevNft.chain,
            collectionName: uiData?.nftName || prevNft.collectionName,
            creatorAddress: (uiData?.nftCreatorAddress ||
              prevNft.creatorAddress) as `0x{string}`,
            mediaUrl: sanitizeDStorageUrl(uiData?.nftUri) || prevNft.mediaUrl,
            schema: uiData?.tokenStandard || prevNft.schema
          }));

          return { data: uiData, type: ActionDataResponseType.PARTIAL };
        });
      });
  };

  const {
    data: actionDataResponse,
    isLoading: loadingActionData,
    refetch
  } = useQuery({
    enabled:
      Boolean(module) &&
      Boolean(selectedNftOaCurrency) &&
      Boolean(address) &&
      Boolean(publication.id),
    queryFn: getActionData,
    queryKey: [
      'getActionData',
      selectedNftOaCurrency,
      selectedQuantity,
      address,
      publication?.id
    ]
  });

  const { data: uiData } = useQuery({
    queryFn: getUiData,
    queryKey: ['uiData', publication.id],
    staleTime: Infinity
  });

  const actionData = actionDataResponse?.data;
  const dataType = actionDataResponse?.type;

  useEffect(() => {
    refetch();
  }, [selectedNftOaCurrency, address, refetch]);

  if (!module) {
    return null;
  }

  return (
    <>
      <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
        <div className="relative h-[350px] max-h-[350px] w-full overflow-hidden rounded-t-xl">
          <Image
            alt={nft.collectionName}
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl filter"
            src={nft.mediaUrl}
          />
          <div className="absolute inset-0 bg-white opacity-20" />
          <Image
            alt={nft.collectionName}
            className={cn(
              'relative h-full w-full object-contain transition-opacity duration-500',
              isNftCoverLoaded ? 'visible opacity-100' : 'invisible opacity-0'
            )}
            onLoad={() => setIsNftCoverLoaded(true)}
            src={nft.mediaUrl}
          />
        </div>
        {actionData && Boolean(nft) && !loadingActionData ? (
          <div className="flex items-center justify-between border-t px-4 py-2 dark:border-gray-700">
            <ActionInfo
              collectionName={nft.collectionName}
              uiData={
                dataType === ActionDataResponseType.FULL
                  ? (actionData as ActionData)?.uiData
                  : (actionData as UIData)
              }
            />
            {dataType === ActionDataResponseType.FULL ? (
              <Button
                className="px-4 py-1"
                icon={<CursorArrowRaysIcon className="size-4" />}
                onClick={() => {
                  setActiveOpenActionModal(publication.id);
                  Leafwatch.track(PUBLICATION.OPEN_ACTIONS.DECENT.OPEN_DECENT, {
                    publication_id: publication.id
                  });
                }}
                size="sm"
              >
                {openActionCTA((actionData as ActionData).uiData?.platformName)}
              </Button>
            ) : (
              <Tooltip
                content={<span>{OPEN_ACTION_NO_EMBED_TOOLTIP}</span>}
                placement="top"
              >
                <Button
                  className="px-4 py-1"
                  disabled
                  icon={<CursorArrowRaysIcon className="size-4" />}
                  size="sm"
                >
                  Mint
                </Button>
              </Tooltip>
            )}
          </div>
        ) : loadingActionData ? (
          <DecentOpenActionShimmer />
        ) : null}
      </Card>
      <DecentOpenActionModule
        actionData={actionData as ActionData | undefined}
        loadingActionData={loadingActionData}
        module={module as UnknownOpenActionModuleSettings}
        nft={nft}
        publication={publication}
        uiData={uiData}
      />
    </>
  );
};

export default FeedEmbed;
