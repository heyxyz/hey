import type {
  AnyPublication,
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { Nft } from '@hey/types/misc';
import type { ActionData, PublicationInfo } from 'nft-openaction-kit';

import ActionInfo from '@components/Shared/Oembed/Nft/ActionInfo';
import DecentOpenActionShimmer from '@components/Shared/Shimmer/DecentOpenActionShimmer';
import { PUBLICATION } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getNftChainInfo from '@hey/lib/getNftChainInfo';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Tooltip } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { NftOpenActionKit } from 'nft-openaction-kit';
import { type FC, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import DecentOpenActionModule from './Module';

interface DecentOpenActionProps {
  isFullPublication?: boolean;
  nft: Nft;
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

const DecentOpenAction: FC<DecentOpenActionProps> = ({ nft, publication }) => {
  const [actionData, setActionData] = useState<ActionData>();
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const module = targetPublication.openActionModules.find(
    (module) => module.contract.address === VerifiedOpenActionModules.DecentNFT
  );

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { address } = useAccount();

  useEffect(() => {
    const actionDataFromPost = async () => {
      if (module && address && !actionData) {
        const nftOpenActionKit = new NftOpenActionKit({
          decentApiKey: process.env.NEXT_PUBLIC_DECENT_API_KEY || '',
          openSeaApiKey: process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
          raribleApiKey: process.env.NEXT_PUBLIC_RARIBLE_API_KEY || ''
        });

        // Call the async function and pass the link
        try {
          const pubInfo = formatPublicationData(targetPublication);
          const a = [
            pubInfo,
            targetPublication.by.id,
            targetPublication.by.ownedBy.address,
            address || '',
            '137', // TODO: determined by selected payment token
            selectedQuantity !== 1 ? BigInt(selectedQuantity) : 1n
          ];
          const actionDataResult: ActionData =
            await nftOpenActionKit.actionDataFromPost(
              pubInfo,
              targetPublication.by.id,
              targetPublication.by.ownedBy.address,
              address,
              '137', // TODO: determined by selected payment token
              selectedQuantity !== 1 ? BigInt(selectedQuantity) : 1n
            );
          if (actionDataResult) {
            setActionData(actionDataResult);
          }
        } catch (error) {
          errorToast(error);
        }
      }
    };

    actionDataFromPost();
  }, [actionData, address, module, targetPublication, selectedQuantity]);

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
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        show={showOpenActionModal}
      />
    </>
  );
};

export default DecentOpenAction;
