import type {
  AnyPublication,
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { Nft, OG } from '@hey/types/misc';
import type { ActionData, PublicationInfo } from 'nft-openaction-kit';
import type { Address } from 'viem';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';
import DecentOpenActionShimmer from '@components/Shared/Shimmer/DecentOpenActionShimmer';
import errorToast from '@helpers/errorToast';
import getNftOpenActionKit from '@helpers/getNftOpenActionKit';
import { Leafwatch } from '@helpers/leafwatch';
import { ZERO_ADDRESS } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import sanitizeDStorageUrl from '@hey/helpers/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button, Card, Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { type FC, useEffect, useRef, useState } from 'react';
import { HEY_REFERRAL_PROFILE_ID } from 'src/constants';
import { useNftOaCurrencyStore } from 'src/store/persisted/useNftOaCurrencyStore';
import { useAccount } from 'wagmi';

import { OPEN_ACTION_EMBED_TOOLTIP, openActionCTA } from '.';
import DecentOpenActionModule from './Module';

interface DecentOpenActionProps {
  isFullPublication?: boolean;
  mirrorPublication?: AnyPublication;
  og: OG;
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
  publication: AnyPublication;
}

function formatPublicationData(
  targetPublication: MirrorablePublication
): PublicationInfo {
  const [profileHex, pubHex] = targetPublication.id.split('-');

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
    profileId: parseInt(profileHex, 16).toString(),
    pubId: parseInt(pubHex, 16).toString()
  };
}

const FeedEmbed: FC<DecentOpenActionProps> = ({
  mirrorPublication,
  og,
  openActionEmbed,
  openActionEmbedLoading,
  publication
}) => {
  const [actionData, setActionData] = useState<ActionData>();
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const { selectedNftOaCurrency } = useNftOaCurrencyStore();
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const module = targetPublication.openActionModules.find(
    (module) => module.contract.address === VerifiedOpenActionModules.DecentNFT
  );

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { address } = useAccount();

  const prevCurrencyRef = useRef(selectedNftOaCurrency);

  const nft: Nft = {
    chain: actionData?.uiData.dstChainId.toString() || og.nft?.chain || null,
    collectionName: actionData?.uiData.nftName || og.nft?.collectionName || '',
    contractAddress: og.nft?.contractAddress || ZERO_ADDRESS,
    creatorAddress: (actionData?.uiData.nftCreatorAddress ||
      og.nft?.creatorAddress ||
      ZERO_ADDRESS) as `0x${string}`,
    description: og.description || '',
    endTime: null,
    mediaUrl:
      sanitizeDStorageUrl(actionData?.uiData.nftUri) ||
      og.nft?.mediaUrl ||
      og.image ||
      '',
    mintCount: og.nft?.mintCount || null,
    mintStatus: og.nft?.mintStatus || null,
    mintUrl: og.nft?.mintUrl || null,
    schema: actionData?.uiData.tokenStandard || og.nft?.schema || '',
    sourceUrl: og.url
  };

  const [loadingCurrency, setLoadingCurrency] = useState(false);

  useEffect(
    () => {
      const actionDataFromPost = async () => {
        setLoadingCurrency(true);
        const nftOpenActionKit = getNftOpenActionKit();

        const addressParameter = address ? address : ZERO_ADDRESS;

        // Call the async function and pass the link
        try {
          const pubInfo = formatPublicationData(targetPublication);
          const actionDataResult: ActionData =
            await nftOpenActionKit.actionDataFromPost({
              executingClientProfileId: HEY_REFERRAL_PROFILE_ID,
              mirrorerProfileId: !!mirrorPublication
                ? mirrorPublication.by.id
                : undefined,
              mirrorPubId: !!mirrorPublication
                ? mirrorPublication.id
                : undefined,
              paymentToken: selectedNftOaCurrency,
              post: pubInfo,
              profileId: targetPublication.by.id,
              profileOwnerAddress: targetPublication.by.ownedBy.address,
              quantity: selectedQuantity !== 1 ? selectedQuantity : 1,
              senderAddress: addressParameter as Address,
              sourceUrl: nft.sourceUrl,
              srcChainId: '137' // srcChainId, only supported on Polygon POS for now
            });
          setLoadingCurrency(false);
          if (actionDataResult) {
            setActionData(actionDataResult);
          }
        } catch (error) {
          errorToast(error);
          setLoadingCurrency(false);
        }
      };

      const isCurrencyChanged =
        prevCurrencyRef.current !== selectedNftOaCurrency;
      if ((module && !actionData) || isCurrencyChanged) {
        actionDataFromPost();
        prevCurrencyRef.current = selectedNftOaCurrency;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      address,
      module,
      targetPublication,
      selectedQuantity,
      selectedNftOaCurrency
    ]
  );

  const [isNftCoverLoaded, setIsNftCoverLoaded] = useState(false);

  if (!module) {
    return null;
  }

  return (
    <>
      <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
        <div className="relative">
          <img
            alt={nft.mediaUrl !== '' ? nft.collectionName : undefined}
            className={cn(
              'h-[350px] max-h-[350px] w-full rounded-t-xl object-contain',
              isNftCoverLoaded ? 'visible' : 'invisible'
            )}
            onLoad={() => setIsNftCoverLoaded(true)}
            src={nft.mediaUrl !== '' ? nft.mediaUrl : undefined}
          />
        </div>
        {!!actionData && nft ? (
          <div className="flex flex-col items-start justify-between gap-4 border-t p-4 sm:flex-row sm:items-center sm:gap-0 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {nft.creatorAddress ? (
                <ActionInfo
                  actionData={actionData}
                  collectionName={nft.collectionName}
                  creatorAddress={nft.creatorAddress}
                  uiData={actionData.uiData}
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
                <Button
                  className="w-full text-base font-normal sm:w-auto"
                  size="lg"
                >
                  {openActionCTA(actionData.uiData.platformName)}
                </Button>
              </Tooltip>
            ) : (
              <Button
                className="w-full text-base font-normal sm:w-auto"
                onClick={() => {
                  setShowOpenActionModal(true);
                  Leafwatch.track(PUBLICATION.OPEN_ACTIONS.DECENT.OPEN_DECENT, {
                    publication_id: publication.id
                  });
                }}
                size="lg"
              >
                {openActionCTA(actionData.uiData.platformName)}
              </Button>
            )}
          </div>
        ) : (
          <DecentOpenActionShimmer />
        )}
      </Card>
      <DecentOpenActionModule
        actionData={actionData}
        loadingCurrency={loadingCurrency}
        module={module as UnknownOpenActionModuleSettings}
        nft={nft}
        onClose={() => setShowOpenActionModal(false)}
        publication={targetPublication}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        show={showOpenActionModal}
      />
    </>
  );
};

export default FeedEmbed;
