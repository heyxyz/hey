import type { DecodedMessage } from '@xmtp/xmtp-js';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Profile } from 'lens';
import { useCallback } from 'react';
import type { LensProfile, PreviewMessage } from 'src/store/message-db';
import { db } from 'src/store/message-db';

const decodedMessageToPreview = (
  conversationKey: string,
  myAddress: string,
  myProfileId: string,
  decoded: DecodedMessage
): PreviewMessage => ({
  conversationKey,
  myAddress,
  myProfileId,
  sent: decoded.sent,
  messageBytes: decoded.toBytes()
});

export const useMessageDb = (myAddress: string, myProfileId: string) => {
  const batchPersistPreviewMessages = useCallback(
    async (previewMap: Map<string, DecodedMessage>) => {
      await db.transaction('rw', db.previewMessages, async () => {
        for (const [conversationKey, message] of previewMap.entries()) {
          const record = decodedMessageToPreview(conversationKey, myAddress, myProfileId, message);
          await db.persistPreviewMessage(record);
        }
      });
    },
    [myAddress, myProfileId]
  );

  const persistPreviewMessage = useCallback(
    async (conversationKey: string, message: DecodedMessage) => {
      const record = decodedMessageToPreview(conversationKey, myAddress, myProfileId, message);
      await db.persistPreviewMessage(record);
    },
    [myAddress, myProfileId]
  );

  const batchPersistProfiles = useCallback(
    async (profiles: Map<string, Partial<Profile>>) => {
      await db.transaction('rw', db.lensProfiles, async () => {
        for (const [conversationKey, profile] of profiles.entries()) {
          const record = { ...profile, myAddress, myProfileId, conversationKey };
          await db.persistProfile(record as LensProfile);
        }
      });
    },
    [myAddress, myProfileId]
  );

  const previewMessages = useLiveQuery(async () => {
    if (!myAddress || !myProfileId) {
      return;
    }

    return db.previewMessages
      .where('[myAddress+myProfileId]')
      .equals([myAddress, myProfileId])
      .sortBy('sent');
  }, [myAddress, myProfileId]);

  const messageProfiles = useLiveQuery(async () => {
    if (!myAddress || !myProfileId) {
      return;
    }

    const profiles = await db.lensProfiles
      .where('[myAddress+myProfileId]')
      .equals([myAddress, myProfileId])
      .sortBy('name');

    return new Map(profiles.map((p) => [p.conversationKey, p]));
  }, [myAddress, myProfileId]);

  return {
    persistPreviewMessage,
    batchPersistPreviewMessages,
    batchPersistProfiles,
    previewMessages,
    messageProfiles
  };
};

export const useGetProfile = (
  myAddress: string | undefined,
  myProfileId: string | undefined,
  conversationKey: string
) => {
  const profile = useLiveQuery(() => {
    if (!myAddress || !myProfileId) {
      return;
    }
    return db.lensProfiles.get([myAddress, myProfileId, conversationKey]);
  }, [myAddress, myProfileId, conversationKey]);

  return {
    profile
  };
};
