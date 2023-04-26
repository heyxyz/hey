import type { DecodedMessage } from '@xmtp/xmtp-js';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Profile } from 'lens';
import { useCallback } from 'react';
import type { LensProfile, PreviewMessage } from 'src/store/message-db';
import { db } from 'src/store/message-db';

const decodedMessageToPreview = (
  conversationKey: string,
  myProfileId: string,
  decoded: DecodedMessage
): PreviewMessage => ({
  conversationKey,
  myProfileId,
  sent: decoded.sent,
  messageBytes: decoded.toBytes()
});

export const useMessageDb = (myProfileId: string) => {
  const batchPersistPreviewMessages = useCallback(
    async (previewMap: Map<string, DecodedMessage>) => {
      await db.transaction('rw', db.previewMessages, async () => {
        for (const [conversationKey, message] of previewMap.entries()) {
          const record = decodedMessageToPreview(conversationKey, myProfileId, message);
          await db.persistPreviewMessage(record);
        }
      });
    },
    [myProfileId]
  );

  const persistPreviewMessage = useCallback(
    async (conversationKey: string, message: DecodedMessage) => {
      const record = decodedMessageToPreview(conversationKey, myProfileId, message);
      await db.persistPreviewMessage(record);
    },
    [myProfileId]
  );

  const batchPersistProfiles = useCallback(
    async (profiles: Map<string, Partial<Profile>>) => {
      await db.transaction('rw', db.lensProfiles, async () => {
        for (const [conversationKey, profile] of profiles.entries()) {
          const record = { ...profile, myProfileId, conversationKey };
          await db.persistProfile(record as LensProfile);
        }
      });
    },
    [myProfileId]
  );

  const previewMessages = useLiveQuery(async () => {
    if (!myProfileId) {
      return;
    }

    return db.previewMessages.where('myProfileId').equals([myProfileId]).sortBy('sent');
  }, [myProfileId]);

  const messageProfiles = useLiveQuery(async () => {
    if (!myProfileId) {
      return;
    }

    const profiles = await db.lensProfiles.where('myProfileId').equals([myProfileId]).sortBy('name');

    return new Map(profiles.map((p) => [p.conversationKey, p]));
  }, [myProfileId]);

  return {
    persistPreviewMessage,
    batchPersistPreviewMessages,
    batchPersistProfiles,
    previewMessages,
    messageProfiles
  };
};

export const useGetProfile = (myProfileId: string | undefined, conversationKey: string) => {
  const profile = useLiveQuery(() => {
    if (!myProfileId) {
      return;
    }
    return db.lensProfiles.get([myProfileId, conversationKey]);
  }, [myProfileId, conversationKey]);

  return {
    profile
  };
};
