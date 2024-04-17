import type { FC } from 'react';

import {
  getMessagesBySrcTxHash,
  MessageStatus
} from '@layerzerolabs/scan-client';
import getToastOptions from '@lib/getToastOptions';
import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useOaTransactionStore } from 'src/store/persisted/useOaTransactionStore';

interface OaTransactionToasterProps {
  onClose: () => void;
  platformName?: string;
  txHash: string;
}

const OaTransactionToaster: FC<OaTransactionToasterProps> = ({
  onClose,
  platformName,
  txHash
}) => {
  const { resolvedTheme } = useTheme();
  const polygonLayerZeroChainId = 109;

  useEffect(() => {
    const toastId = toast.loading(
      <div
        onClick={() => {
          useOaTransactionStore.getState().removeTransaction(txHash);
          toast.dismiss(toastId);
          onClose();
        }}
      >
        <div className="flex flex-col items-start">
          <p>Minting NFT {platformName ? ` on ${platformName}` : ''}</p>
          <a
            className="text-sm underline opacity-50"
            href={`https://layerzeroscan.com/tx/${txHash}`}
            rel="noreferrer"
            target="_blank"
          >
            Check transaction
          </a>
        </div>
      </div>,
      {
        duration: Infinity,
        ...getToastOptions(resolvedTheme)
      }
    );

    let interval: NodeJS.Timeout;
    const fetchCrossChainStatus = async () => {
      const { messages } = await getMessagesBySrcTxHash(
        polygonLayerZeroChainId,
        txHash
      );
      const lastStatus = messages[messages.length - 1]?.status;
      if (lastStatus === MessageStatus.DELIVERED) {
        toast.dismiss(toastId);
        onClose(); // Clean up
        clearInterval(interval);
      }
    };

    interval = setInterval(fetchCrossChainStatus, 10000);

    return () => {
      clearInterval(interval);
      toast.dismiss(toastId);
    };
  }, [txHash, onClose, platformName, resolvedTheme]);

  return null;
};

export default OaTransactionToaster;
