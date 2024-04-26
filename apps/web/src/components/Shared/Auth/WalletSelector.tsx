import type { FC } from 'react';
import type { Connector } from 'wagmi';

import { Leafwatch } from '@helpers/leafwatch';
import { KeyIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { AUTH } from '@hey/data/tracking';
import getWalletDetails from '@hey/helpers/getWalletDetails';
import cn from '@hey/ui/cn';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const WalletSelector: FC = () => {
  const { connectAsync, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { connector: activeConnector } = useAccount();

  const onConnect = async (connector: Connector) => {
    try {
      await connectAsync({ connector });
      Leafwatch.track(AUTH.CONNECT_WALLET, {
        wallet: connector.name.toLowerCase()
      });
    } catch {}
  };

  return activeConnector?.id ? (
    <div className="space-y-2.5">
      <button
        className="flex items-center space-x-1 text-sm underline"
        onClick={() => {
          disconnect?.();
          Leafwatch.track(AUTH.CHANGE_WALLET);
        }}
        type="reset"
      >
        <KeyIcon className="size-4" />
        <div>Change wallet</div>
      </button>
    </div>
  ) : (
    <div className="inline-block w-full space-y-3 overflow-hidden text-left align-middle">
      {connectors
        .filter(
          (connector: any, index: number, self: any) =>
            self.findIndex((c: any) => c.type === connector.type) === index
        )
        .map((connector: any) => {
          return (
            <button
              className={cn(
                {
                  'hover:bg-gray-100 dark:hover:bg-gray-700':
                    connector.id !== activeConnector?.id
                },
                'flex w-full items-center justify-between space-x-2.5 overflow-hidden rounded-xl border px-4 py-3 outline-none dark:border-gray-700'
              )}
              disabled={connector.id === activeConnector?.id || isPending}
              key={connector.id}
              onClick={() => onConnect(connector)}
              type="button"
            >
              <span>
                {connector.id === 'injected'
                  ? 'Browser Wallet'
                  : getWalletDetails(connector.name).name}
              </span>
              <img
                alt={connector.id}
                className="size-6"
                draggable={false}
                height={24}
                src={getWalletDetails(connector.name).logo}
                width={24}
              />
            </button>
          );
        })}
      {error?.message ? (
        <div className="flex items-center space-x-1 text-red-500">
          <XCircleIcon className="size-5" />
          <div>{error?.message || 'Failed to connect'}</div>
        </div>
      ) : null}
    </div>
  );
};

export default WalletSelector;
