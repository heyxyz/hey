import Markup from '@components/Shared/Markup';
import SwitchNetwork from '@components/Shared/SwitchNetwork';
import {
  CursorClickIcon,
  ExternalLinkIcon,
  UsersIcon
} from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { ZoraERC721Drop } from '@lenster/abis';
import { ADMIN_ADDRESS } from '@lenster/data/constants';
import humanize from '@lenster/lib/humanize';
import type { ZoraNft, ZoraNftMetadata } from '@lenster/types/zora-nft';
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

interface MintProps {
  nft: ZoraNft;
  metadata: ZoraNftMetadata;
}

const Mint: FC<MintProps> = ({ nft, metadata }) => {
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

  const zoraLink = `https://zora.co/collect/${metadata.chain}:${
    metadata.address
  }${metadata.token ? `/${metadata.token}` : ''}`;
  const mintingOrSuccess = isLoading || isSuccess;

  return (
    <div className="p-5">
      <div className="mb-3 space-y-1.5">
        <div className="text-xl font-bold">{nft.name}</div>
        <Markup className="lt-text-gray-500 line-clamp-4">
          {nft.description}
        </Markup>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <UsersIcon className="lt-text-gray-500 h-4 w-4" />
          <b>
            <Trans>{humanize(nft.totalMinted)} minted</Trans>
          </b>
        </div>
        <Link
          href={zoraLink}
          className="flex items-center space-x-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLinkIcon className="lt-text-gray-500 h-4 w-4" />
          <b>
            <Trans>Open in Zora</Trans>
          </b>
        </Link>
      </div>
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
