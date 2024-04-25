import type {
  AnyPublication,
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { AllowedToken } from '@hey/types/hey';
import type { Nft, OG } from '@hey/types/misc';
import type { ActionData, PublicationInfo } from 'nft-openaction-kit';
import type { Address } from 'viem';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';
import DecentOpenActionShimmer from '@components/Shared/Shimmer/DecentOpenActionShimmer';
import { ZERO_ADDRESS } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Spinner, Tooltip } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { NftOpenActionKit } from 'nft-openaction-kit';
import { type FC, useEffect, useRef, useState } from 'react';
import { HEY_REFERRAL_PROFILE_ID } from 'src/constants';
import { useAccount } from 'wagmi';

import DecentOpenActionModule from './Module';

const OPEN_ACTION_EMBED_TOOLTIP = 'Open action embedded';

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

const DecentOpenAction: FC<DecentOpenActionProps> = ({
  mirrorPublication,
  og,
  openActionEmbed,
  openActionEmbedLoading,
  publication
}) => {
  const [actionData, setActionData] = useState<ActionData>();
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken>({
    contractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    decimals: 18,
    id: 'WMATIC',
    name: 'Wrapped MATIC',
    symbol: 'WMATIC'
  });
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const module = targetPublication.openActionModules.find(
    (module) => module.contract.address === VerifiedOpenActionModules.DecentNFT
  );

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { address } = useAccount();

  const prevCurrencyRef = useRef(selectedCurrency);

  const nft: Nft = {
    chain:
      actionData?.actArgumentsFormatted.dstChainId.toString() ??
      og.nft?.chain ??
      null,
    collectionName: actionData?.uiData.nftName ?? og.nft?.collectionName ?? '',
    contractAddress: og.nft?.contractAddress ?? ZERO_ADDRESS,
    creatorAddress: (actionData?.uiData.nftCreatorAddress ??
      og.nft?.creatorAddress ??
      ZERO_ADDRESS) as `0x${string}`,
    description: og.description || '',
    endTime: null,
    mediaUrl:
      sanitizeDStorageUrl(actionData?.uiData.nftUri) ??
      og.nft?.mediaUrl ??
      og.image ??
      '',
    mintCount: og.nft?.mintCount ?? null,
    mintStatus: og.nft?.mintStatus ?? null,
    mintUrl: og.nft?.mintUrl ?? null,
    schema: actionData?.uiData.tokenStandard ?? og.nft?.schema ?? '',
    sourceUrl: og.url
  };

  const [loadingCurrency, setLoadingCurrency] = useState(false);

  useEffect(
    () => {
      const actionDataFromPost = async () => {
        setLoadingCurrency(true);
        const nftOpenActionKit = new NftOpenActionKit({
          decentApiKey: process.env.NEXT_PUBLIC_DECENT_API_KEY || '',
          openSeaApiKey: process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
          raribleApiKey: process.env.NEXT_PUBLIC_RARIBLE_API_KEY || ''
        });

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
              paymentToken: selectedCurrency.contractAddress,
              post: pubInfo,
              profileId: targetPublication.by.id,
              profileOwnerAddress: targetPublication.by.ownedBy.address,
              quantity: selectedQuantity !== 1 ? selectedQuantity : 1,
              senderAddress: addressParameter as Address,
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
        prevCurrencyRef.current.contractAddress !==
        selectedCurrency.contractAddress;
      if ((module && !actionData) || isCurrencyChanged) {
        actionDataFromPost();
        prevCurrencyRef.current = selectedCurrency;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      address,
      module,
      targetPublication,
      selectedQuantity,
      selectedCurrency.contractAddress
    ]
  );

  if (!module) {
    return null;
  }

  return (
    <>
      <Card className="mt-3" forceRounded onClick={stopEventPropagation}>
        <div className="relative">
          <img
            alt={nft.collectionName}
            className="h-[350px] max-h-[350px] w-full rounded-t-xl object-cover"
            src={nft.mediaUrl !== '' ? nft.mediaUrl : undefined}
          />
        </div>
        {!!actionData && nft ? (
          <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {nft.creatorAddress ? (
                <ActionInfo
                  actionData={actionData}
                  collectionName={nft.collectionName}
                  creatorAddress={nft.creatorAddress}
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
                  Mint
                </Button>
              </Tooltip>
            ) : (
              <Button
                className="text-base font-normal"
                onClick={() => {
                  setShowOpenActionModal(true);
                  Leafwatch.track(PUBLICATION.OPEN_ACTIONS.DECENT.OPEN_DECENT, {
                    publication_id: publication.id
                  });
                }}
                size="lg"
              >
                Mint
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
        selectedCurrency={selectedCurrency}
        selectedQuantity={selectedQuantity}
        setSelectedCurrency={setSelectedCurrency}
        setSelectedQuantity={setSelectedQuantity}
        show={showOpenActionModal}
      />
    </>
  );
};

export default DecentOpenAction;
