import type { AnyPublication } from '@hey/lens';
import type { BasePaintCanvas } from '@hey/types/nft';
import type { FC } from 'react';

import WalletSelector from '@components/Shared/Login/WalletSelector';
import SwitchNetwork from '@components/Shared/SwitchNetwork';
import {
  CurrencyDollarIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { BasePaint } from '@hey/abis';
import { BASEPAINT_CONTRACT } from '@hey/data/contracts';
import { PUBLICATION } from '@hey/data/tracking';
import { Button, Spinner } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import { useUpdateEffect } from 'usehooks-ts';
import { parseEther } from 'viem';
import { base } from 'viem/chains';
import {
  useAccount,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';

import { useBasePaintMintStore } from '.';

const NO_BALANCE_ERROR = 'exceeds the balance of the account';

interface MintActionProps {
  canvas: BasePaintCanvas;
  openEditionPrice: number;
  publication: AnyPublication;
}

const MintAction: FC<MintActionProps> = ({
  canvas,
  openEditionPrice,
  publication
}) => {
  const quantity = useBasePaintMintStore((state) => state.quantity);

  const chain = useChainId();
  const { isDisconnected } = useAccount();

  const nftAddress = BASEPAINT_CONTRACT;
  const day = canvas.id;
  const value = parseEther(openEditionPrice.toString()) * BigInt(quantity);

  const {
    config,
    error: prepareError,
    isError: isPrepareError
  } = usePrepareContractWrite({
    abi: BasePaint,
    address: nftAddress,
    args: [day, quantity],
    chainId: base.id,
    functionName: 'mint',
    value
  });
  const {
    data,
    isLoading: isContractWriteLoading,
    write
  } = useContractWrite({
    ...config
  });
  const {
    data: txnData,
    isLoading,
    isSuccess
  } = useWaitForTransaction({
    chainId: base.id,
    hash: data?.hash
  });

  useUpdateEffect(() => {
    if (txnData?.transactionHash) {
      Leafwatch.track(PUBLICATION.OPEN_ACTIONS.BASEPAINT_NFT.MINT, {
        nft: nftAddress,
        price: openEditionPrice * quantity,
        publication_id: publication.id,
        quantity
      });
    }
  }, [isSuccess]);

  const mintingOrSuccess = isLoading || isSuccess;

  // Errors
  const noBalanceError = prepareError?.message?.includes(NO_BALANCE_ERROR);

  return !mintingOrSuccess ? (
    <div className="flex">
      {isDisconnected ? (
        <div className="mt-5 w-full justify-center">
          <WalletSelector />
        </div>
      ) : chain !== base.id ? (
        <SwitchNetwork
          className="mt-5 w-full justify-center"
          title={`Switch to ${base.name}`}
          toChainId={base.id}
        />
      ) : isPrepareError ? (
        noBalanceError ? (
          <Link
            className="w-full"
            href="https://app.uniswap.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button
              className="mt-5 w-full justify-center"
              icon={<CurrencyDollarIcon className="size-5" />}
              size="md"
            >
              You don't have balance
            </Button>
          </Link>
        ) : null
      ) : (
        <Button
          className="mt-5 w-full justify-center"
          disabled={!write}
          icon={
            isContractWriteLoading ? (
              <Spinner size="xs" />
            ) : (
              <CursorArrowRaysIcon className="size-5" />
            )
          }
          onClick={() => write?.()}
        >
          Mint
        </Button>
      )}
    </div>
  ) : (
    <div className="mt-5 text-sm font-medium">
      {isLoading ? (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div>Minting in progress</div>
        </div>
      ) : null}
      {isSuccess ? (
        <div className="flex items-center space-x-1.5">
          <CheckCircleIcon className="size-5 text-green-500" />
          <div>Minted successful</div>
        </div>
      ) : null}
    </div>
  );
};

export default MintAction;
