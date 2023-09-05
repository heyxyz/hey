import Markup from '@components/Shared/Markup';
import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { CursorClickIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { ZoraERC721Drop } from '@lenster/abis';
import { ADMIN_ADDRESS } from '@lenster/data/constants';
import type { ZoraNft } from '@lenster/types/zora-nft';
import { Button, Spinner } from '@lenster/ui';
import getZoraChainInfo from '@lib/getZoraChainInfo';
import { t, Trans } from '@lingui/macro';
import Link from 'next/link';
import { type FC } from 'react';
import { useAppStore } from 'src/store/app';
import { parseEther } from 'viem';
import {
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';

import Metadata from './Metadata';
import MintedBy from './MintedBy';

interface MintProps {
  nft: ZoraNft;
  zoraLink: string;
}

const Mint: FC<MintProps> = ({ nft, zoraLink }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const chain = useChainId();
  const erc721Address = nft.address;
  const recipient = currentProfile?.ownedBy;
  const quantity = 1n;
  const comment = 'Minted via Lenster';
  const mintReferral = ADMIN_ADDRESS;
  const mintFee = parseEther('0.000777');

  const { config, isError: isPrepareError } = usePrepareContractWrite({
    chainId: nft.chainId,
    abi: ZoraERC721Drop,
    address: erc721Address,
    functionName: 'mintWithRewards',
    args: [recipient, quantity, comment, mintReferral],
    value: mintFee * quantity
  });
  const {
    write,
    data,
    isLoading: isContractWriteLoading
  } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    chainId: nft.chainId,
    hash: data?.hash
  });

  const mintingOrSuccess = isLoading || isSuccess;

  return (
    <div className="p-5">
      <div className="mb-4">
        <div className="mb-1 text-xl font-bold">{nft.name}</div>
        <MintedBy address={nft.creator} />
        <Markup className="lt-text-gray-500 line-clamp-4">
          {nft.description}
        </Markup>
      </div>
      <Metadata nft={nft} zoraLink={zoraLink} />
      {!mintingOrSuccess ? (
        <div className="flex">
          {chain !== nft.chainId ? (
            <SwitchNetwork
              className="mt-5"
              toChainId={nft.chainId}
              title={t`Switch to ${getZoraChainInfo(nft.chainId).name}`}
            />
          ) : isPrepareError ? (
            <Link href={zoraLink} target="_blank" rel="noopener noreferrer">
              <Button
                className="mt-5"
                icon={<CursorClickIcon className="h-5 w-5" />}
                size="md"
              >
                <Trans>Mint on Zora</Trans>
              </Button>
            </Link>
          ) : (
            <Button
              className="mt-5"
              disabled={!write}
              onClick={() => write?.()}
              icon={
                isContractWriteLoading ? (
                  <Spinner className="mr-1" size="xs" />
                ) : (
                  <CursorClickIcon className="h-5 w-5" />
                )
              }
            >
              <Trans>Mint on Zora</Trans>
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-5 text-sm font-medium">
          {isLoading ? (
            <div className="flex items-center space-x-1.5">
              <Spinner size="xs" />
              <div>
                <Trans>Minting in progress</Trans>
              </div>
            </div>
          ) : null}
          {isSuccess ? (
            <div className="flex items-center space-x-1.5">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <div>
                <Trans>Minted successful</Trans>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Mint;
