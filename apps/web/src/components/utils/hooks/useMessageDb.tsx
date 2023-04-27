import type { DecodedMessage } from '@xmtp/xmtp-js';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Profile } from 'lens';
import { useCallback } from 'react';
import { useAppStore } from 'src/store/app';
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

const assertProfileId = (profileId: string | undefined) => {
  if (!profileId) {
    throw new Error('No profile id');
  }
};

export const useMessageDb = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const batchPersistPreviewMessages = useCallback(
    async (previewMap: Map<string, DecodedMessage>) => {
      const myProfileId = currentProfile?.id;
      assertProfileId(myProfileId);
      await db.transaction('rw', db.previewMessages, async () => {
        for (const [conversationKey, message] of previewMap.entries()) {
          const record = decodedMessageToPreview(conversationKey, currentProfile?.id, message);
          await db.persistPreviewMessage(record);
        }
      });
    },
    [currentProfile]
  );

  const persistPreviewMessage = useCallback(
    async (conversationKey: string, message: DecodedMessage) => {
      const myProfileId = currentProfile?.id;
      assertProfileId(myProfileId);
      const record = decodedMessageToPreview(conversationKey, myProfileId, message);
      await db.persistPreviewMessage(record);
    },
    [currentProfile]
  );

  const batchPersistProfiles = useCallback(
    async (profiles: Map<string, Partial<Profile>>) => {
      const myProfileId = currentProfile?.id;
      assertProfileId(myProfileId);
      await db.transaction('rw', db.lensProfiles, async () => {
        for (const [conversationKey, profile] of profiles.entries()) {
          const record = { ...profile, myProfileId, conversationKey };
          await db.persistProfile(record as LensProfile);
        }
      });
    },
    [currentProfile]
  );

  const persistProfile = useCallback(
    async (conversationKey: string, profile: Profile) => {
      const myProfileId = currentProfile?.id;
      assertProfileId(myProfileId);
      const record = { ...profile, myProfileId, conversationKey };
      await db.persistProfile(record as LensProfile);
    },
    [currentProfile]
  );

  const previewMessages = useLiveQuery(async () => {
    if (!currentProfile) {
      console.log('No current profile');
      return;
    }
    return db.previewMessages.where('myProfileId').equals(currentProfile.id).sortBy('sent');
  }, [currentProfile]);

  const messageProfiles = useLiveQuery(async () => {
    if (!currentProfile) {
      return;
    }

    const profiles = await db.lensProfiles.where('myProfileId').equals(currentProfile.id).sortBy('name');

    return new Map(profiles.map((p) => [p.conversationKey, p]));
  }, [currentProfile]);

  return {
    persistPreviewMessage,
    batchPersistPreviewMessages,
    batchPersistProfiles,
    persistProfile,
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
