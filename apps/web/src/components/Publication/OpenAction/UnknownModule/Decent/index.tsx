import type {
  AnyPublication,
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { Nft } from '@hey/types/misc';
import type { ActionData, PublicationInfo } from 'nft-openaction-kit-preview';
import type { FC } from 'react';

import MintedBy from '@components/Shared/Oembed/Nft/MintedBy';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { TipIcon } from '@hey/icons';
import getNftChainInfo from '@hey/lib/getNftChainInfo';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Modal, Tooltip } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { NftOpenActionKit } from 'nft-openaction-kit-preview';
import { useState } from 'react';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { useEffectOnce } from 'usehooks-ts';
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

  const { address } = useAccount();

  useEffectOnce(() => {
    const actionDataFromPost = async () => {
      if (module) {
        const nftOpenActionKit = new NftOpenActionKit({
          decentApiKey: process.env.NEXT_PUBLIC_DECENT_API_KEY || '',
          openSeaApiKey: process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
          raribleApiKey: process.env.NEXT_PUBLIC_RARIBLE_API_KEY || ''
        });

        // Call the async function and pass the link
        try {
          const pubInfo = formatPublicationData(targetPublication);
          const actionDataResult: ActionData =
            await nftOpenActionKit.actionDataFromPost(
              pubInfo,
              '',
              address || '',
              ''
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
  });

  const { actOnUnknownOpenAction, isLoading } = useActOnUnknownOpenAction({
    signlessApproved: false, // TODO: module.signlessApproved
    successToast: 'Initiated cross-chain NFT mint!'
  });

  const act = async () => {
    if (actionData && targetPublication) {
      return await actOnUnknownOpenAction({
        address: VerifiedOpenActionModules.DecentNFT as `0x${string}`,
        data: actionData.actArguments.actionModuleData,
        publicationId: targetPublication.id
      });
    }
  };

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
          {nft.creatorAddress ? (
            <MintedBy address={nft.creatorAddress} />
          ) : null}
        </div>
        <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
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
            <div className="text-sm font-bold">{nft.collectionName}</div>
          </div>
          <Button
            className="text-sm"
            icon={<CursorArrowRaysIcon className="size-4" />}
            onClick={() => {
              setShowOpenActionModal(true);
              Leafwatch.track(PUBLICATION.OPEN_ACTIONS.DECENT.OPEN_DECENT, {
                publication_id: publication.id
              });
            }}
            size="md"
          >
            Mint
          </Button>
        </div>
      </Card>
      <Modal
        icon={<TipIcon className="text-brand-500 size-5" />}
        onClose={() => setShowOpenActionModal(false)}
        show={showOpenActionModal}
        title="Mint NFT"
      >
        <DecentOpenActionModule
          module={module as UnknownOpenActionModuleSettings}
          publication={targetPublication}
        />
      </Modal>
    </>
  );
};

export default DecentOpenAction;
