import { Client } from '@xmtp/xmtp-js';
import { APP_NAME, APP_VERSION, XMTP_ENV } from 'data/constants';
import { Localstorage } from 'data/storage';
import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useConversationCache } from 'src/store/conversation-cache';
import { useMessageStore } from 'src/store/message';
import { useAccount, useSigner } from 'wagmi';
import { AttachmentCodec, RemoteAttachmentCodec } from 'xmtp-content-type-remote-attachment';

const ENCODING = 'binary';

const buildLocalStorageKey = (walletAddress: string) => `xmtp:${XMTP_ENV}:keys:${walletAddress}`;

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
  localStorage.setItem(buildLocalStorageKey(walletAddress), Buffer.from(keys).toString(ENCODING));
};

/**
 * This will clear the conversation cache + the private keys
 */
const wipeKeys = (walletAddress: string) => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

const useXmtpClient = (cacheOnly = false) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const client = useMessageStore((state) => state.client);
  const setClient = useMessageStore((state) => state.setClient);
  const [awaitingXmtpAuth, setAwaitingXmtpAuth] = useState<boolean>();
  const { data: signer, isLoading } = useSigner();
  const { address } = useAccount();

  const conversationExports = useConversationCache((state) => state.conversations[address as `0x${string}`]);

  useEffect(() => {
    const initXmtpClient = async () => {
      if (signer && !client && currentProfile) {
        let keys = loadKeys(await signer.getAddress());
        if (!keys) {
          if (cacheOnly) {
            return;
          }
          setAwaitingXmtpAuth(true);
          keys = await Client.getKeys(signer, {
            env: XMTP_ENV,
            appVersion: APP_NAME + '/' + APP_VERSION
          });
          storeKeys(await signer.getAddress(), keys);
        }

        const xmtp = await Client.create(null, {
          env: XMTP_ENV,
          appVersion: APP_NAME + '/' + APP_VERSION,
          privateKeyOverride: keys
        });

        xmtp.registerCodec(new AttachmentCodec());
        xmtp.registerCodec(new RemoteAttachmentCodec());

        if (conversationExports && conversationExports.length) {
          // Preload the client with conversations from the cache
          await xmtp.conversations.import(conversationExports);
        }
        setClient(xmtp);
        setAwaitingXmtpAuth(false);
      } else {
        setAwaitingXmtpAuth(false);
      }
    };
    initXmtpClient();
    if (!signer || !currentProfile) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, currentProfile]);

  return {
    client: client,
    loading: isLoading || awaitingXmtpAuth
  };
};

export const useDisconnectXmtp = () => {
  const { data: signer } = useSigner();
  const client = useMessageStore((state) => state.client);
  const setClient = useMessageStore((state) => state.setClient);
  const disconnect = useCallback(async () => {
    if (signer) {
      wipeKeys(await signer.getAddress());
    }
    if (client) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    localStorage.removeItem(Localstorage.MessageStore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, client]);

  return disconnect;
};

export default useXmtpClient;
