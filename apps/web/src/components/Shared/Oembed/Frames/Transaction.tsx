import type { Frame as IFrame } from '@hey/types/misc';
import type { FC } from 'react';

import errorToast from '@helpers/errorToast';
import { getAuthApiHeadersWithAccessToken } from '@helpers/getAuthApiHeaders';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Errors } from '@hey/data';
import { HEY_API_URL } from '@hey/data/constants';
import formatAddress from '@hey/helpers/formatAddress';
import getNftChainId from '@hey/helpers/getNftChainId';
import getNftChainInfo from '@hey/helpers/getNftChainInfo';
import { Button, H4 } from '@hey/ui';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  polygonAmoy,
  zora
} from 'viem/chains';
import { useSendTransaction, useSwitchChain } from 'wagmi';

import { useFramesStore } from '.';

const SUPPORTED_CHAINS = [
  polygon.id,
  polygonAmoy.id,
  optimism.id,
  arbitrum.id,
  mainnet.id,
  zora.id,
  base.id
];

interface TransactionProps {
  publicationId?: string;
}

const Transaction: FC<TransactionProps> = ({ publicationId }) => {
  const { currentProfile } = useProfileStore();
  const { setFrameData, setShowTransaction, showTransaction } =
    useFramesStore();
  const [isLoading, setIsLoading] = useState(false);
  const [txnHash, setTxnHash] = useState<`0x${string}` | null>(null);
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction({
    mutation: { onError: errorToast }
  });

  if (!showTransaction.frame || !showTransaction.transaction) {
    return null;
  }

  const txnData = showTransaction.transaction;
  const chainId = parseInt(txnData.chainId.replace('eip155:', ''));
  const chainData = {
    logo: getNftChainInfo(getNftChainId(chainId.toString())).logo,
    name: getNftChainInfo(getNftChainId(chainId.toString())).name
  };

  if (!SUPPORTED_CHAINS.includes(chainId as any)) {
    return <div className="m-5">Chain not supported</div>;
  }

  const onTransaction = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);

      await switchChainAsync({ chainId });
      const hash = await sendTransactionAsync({
        data: txnData.params.data,
        to: txnData.params.to,
        value: BigInt(txnData.params.value || 0)
      });

      setTxnHash(hash);

      const { data: postedData }: { data: { frame: IFrame } } =
        await axios.post(
          `${HEY_API_URL}/frames/post`,
          {
            acceptsAnonymous: showTransaction.frame?.acceptsAnonymous,
            acceptsLens: showTransaction.frame?.acceptsLens,
            buttonIndex: +1,
            postUrl:
              showTransaction.frame?.buttons[showTransaction.index].postUrl ||
              showTransaction.frame?.postUrl,
            pubId: publicationId
          },
          { headers: getAuthApiHeadersWithAccessToken() }
        );

      if (!postedData.frame) {
        return toast.error(Errors.SomethingWentWrongWithFrame);
      }

      return setFrameData(postedData.frame);
    } catch {
      toast.error(Errors.SomethingWentWrongWithFrame);
    } finally {
      setIsLoading(false);
    }
  };

  if (txnHash) {
    return (
      <div className="m-8 flex flex-col items-center justify-center">
        <H4>Transaction Sent</H4>
        <div className="ld-text-gray-500 mt-3 text-center font-semibold">
          Your transaction will confirm shortly.
        </div>
        <CheckCircleIcon className="mx-auto mt-8 size-14" />
        <Button
          className="mt-5"
          onClick={async () => {
            if (!txnHash) {
              return null;
            }

            await navigator.clipboard.writeText(txnHash);
            toast.success('Transaction hash copied to clipboard!');
          }}
        >
          Copy transaction hash
        </Button>
      </div>
    );
  }

  return (
    <div className="m-5">
      <div>
        <div className="flex items-center justify-between gap-x-10">
          <b>Network</b>
          <span className="ld-text-gray-500 flex items-center gap-x-2 truncate">
            <img alt={chainData.name} className="size-4" src={chainData.logo} />
            <span>{chainData.name}</span>
          </span>
        </div>
        <div className="divider my-1" />
        <div className="flex items-center justify-between gap-x-10">
          <b>Account</b>
          <span className="ld-text-gray-500 truncate">
            {formatAddress(currentProfile?.ownedBy.address)}
          </span>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={onTransaction}
          size="lg"
        >
          Submit
        </Button>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={() =>
            setShowTransaction({
              frame: null,
              index: 0,
              show: false,
              transaction: null
            })
          }
          outline
          size="lg"
          variant="danger"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Transaction;
