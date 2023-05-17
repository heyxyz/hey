import { Client } from '@xmtp/xmtp-js';
import { APP_NAME, APP_VERSION, XMTP_ENV } from 'data/constants';
import { Localstorage } from 'data/storage';
import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useXmtpMessageStore } from 'src/store/xmtp-message';
import {
  AttachmentCodec,
  RemoteAttachmentCodec
} from 'xmtp-content-type-remote-attachment';

import useEthersWalletClient from './useEthersWalletClient';

const ENCODING = 'binary';

const buildLocalStorageKey = (walletAddress: string) =>
  `xmtp:${XMTP_ENV}:keys:${walletAddress}`;

const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

/**
 * Anyone copying this code will want to be careful about leakage of sensitive keys.
 * Make sure that there are no third party services, such as bug reporting SDKs or ad networks, exporting the contents
 * of your LocalStorage before implementing something like this.
 */
const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  );
};

/**
 * This will clear the conversation cache + the private keys
 */
const wipeKeys = (walletAddress: string) => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

const useXmtpClient = (cacheOnly = false) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const client = useXmtpMessageStore((state) => state.client);
  const setClient = useXmtpMessageStore((state) => state.setClient);
  const [awaitingXmtpAuth, setAwaitingXmtpAuth] = useState<boolean>();
  const { data: walletClient, isLoading } = useEthersWalletClient();

  useEffect(() => {
    const initXmtpClient = async () => {
      if (walletClient && !client && currentProfile) {
        let keys = loadKeys(await walletClient.getAddress());
        if (!keys) {
          if (cacheOnly) {
            return;
          }
          setAwaitingXmtpAuth(true);
          keys = await Client.getKeys(walletClient, {
            env: XMTP_ENV,
            appVersion: APP_NAME + '/' + APP_VERSION,
            persistConversations: false,
            skipContactPublishing: true
          });
          storeKeys(await walletClient.getAddress(), keys);
        }

        const xmtp = await Client.create(null, {
          env: XMTP_ENV,
          appVersion: APP_NAME + '/' + APP_VERSION,
          privateKeyOverride: keys,
          persistConversations: true
        });

        xmtp.registerCodec(new AttachmentCodec());
        xmtp.registerCodec(new RemoteAttachmentCodec());

        setClient(xmtp);
        setAwaitingXmtpAuth(false);
      } else {
        setAwaitingXmtpAuth(false);
      }
    };
    initXmtpClient();
    if (!walletClient || !currentProfile) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return {
    client: client,
    loading: isLoading || awaitingXmtpAuth
  };
};

export const useDisconnectXmtp = () => {
  const client = useXmtpMessageStore((state) => state.client);
  const setClient = useXmtpMessageStore((state) => state.setClient);
  const { data: walletClient } = useEthersWalletClient();
  const disconnect = useCallback(async () => {
    if (walletClient) {
      wipeKeys(await walletClient.getAddress());
    }
    if (client) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    localStorage.removeItem(Localstorage.MessageStore);
    localStorage.removeItem(Localstorage.AttachmentCache);
    localStorage.removeItem(Localstorage.AttachmentStore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletClient, client]);

  return disconnect;
};

export default useXmtpClient;
