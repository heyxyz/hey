import type { FC } from 'react';

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

    return () => {
      toast.dismiss(toastId); // Ensure clean up if the component unmounts
    };
  }, [txHash, onClose, resolvedTheme]);

  return null;
};

export default OaTransactionToaster;
