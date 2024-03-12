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
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getNftChainInfo from '@hey/lib/getNftChainInfo';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Spinner, Tooltip } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { NftOpenActionKit } from 'nft-openaction-kit';
import { type FC, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

import DecentOpenActionModule from './Module';

const OPEN_ACTION_EMBED_TOOLTIP = 'Open action embedded';

interface DecentOpenActionProps {
  isFullPublication?: boolean;
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
  og,
  openActionEmbed,
  openActionEmbedLoading,
  publication
}) => {
  const [actionData, setActionData] = useState<ActionData>();
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken>({
    contractAddress: DEFAULT_COLLECT_TOKEN,
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

  const nft: Nft = og.nft
    ? og.nft
    : {
        chain: null,
        collectionName: '',
        contractAddress: '0x0000000000000000000000000000000000000000',
        creatorAddress: '0x0000000000000000000000000000000000000000',
        description: og.description || '',
        endTime: null,
        mediaUrl: og.image || '',
        mintCount: null,
        mintStatus: null,
        mintUrl: null,
        schema: 'erc721',
        sourceUrl: og.url
      };

  useEffect(
    () => {
      const actionDataFromPost = async () => {
        const nftOpenActionKit = new NftOpenActionKit({
          decentApiKey: process.env.NEXT_PUBLIC_DECENT_API_KEY || '',
          openSeaApiKey: process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
          raribleApiKey: process.env.NEXT_PUBLIC_RARIBLE_API_KEY || ''
        });

        const addressParameter = address
          ? address
          : '0x0000000000000000000000000000000000000000';

        // Call the async function and pass the link
        try {
          const pubInfo = formatPublicationData(targetPublication);
          const actionDataResult: ActionData =
            await nftOpenActionKit.actionDataFromPost(
              pubInfo,
              targetPublication.by.id,
              targetPublication.by.ownedBy.address,
              addressParameter as Address,
              '137', // srcChainId, only supported on Polygon POS for now
              selectedQuantity !== 1 ? BigInt(selectedQuantity) : 1n,
              selectedCurrency.contractAddress
            );
          if (actionDataResult) {
            setActionData(actionDataResult);
          }
        } catch (error) {
          errorToast(error);
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
            src={nft.mediaUrl}
          />
        </div>
        {!!actionData && nft ? (
          <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {nft.chain ? (
                <Tooltip
                  content={getNftChainInfo(nft.chain).name}
                  placement="right"
                >
                  <img
                    alt={getNftChainInfo(nft.chain).name}
                    className="size-5"
                    src={getNftChainInfo(nft.chain).logo}
                  />
                </Tooltip>
              ) : null}
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
