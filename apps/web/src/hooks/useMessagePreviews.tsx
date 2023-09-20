import type { Profile } from '@lenster/lens';
import { useProfilesLazyQuery } from '@lenster/lens';
import buildConversationId from '@lib/buildConversationId';
import chunkArray from '@lib/chunkArray';
import { buildConversationKey } from '@lib/conversationKey';
import { resolveEns } from '@lib/resolveEns';
import type { Conversation } from '@xmtp/xmtp-js';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { toChecksumAddress } from 'ethereum-checksum-address';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import useXmtpClient from 'src/hooks/useXmtpClient';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import { useMessageDb } from './useMessageDb';
import { useStreamAllMessages } from './useStreamAllMessages';
import { useStreamConversations } from './useStreamConversations';

const MAX_PROFILES_PER_REQUEST = 25;

const useMessagePreviews = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const selectedProfileId = useMessageStore((state) => state.selectedProfileId);
  const setPreviewMessages = useMessageStore(
    (state) => state.setPreviewMessages
  );
  const setSelectedProfileId = useMessageStore(
    (state) => state.setSelectedProfileId
  );
  const reset = useMessageStore((state) => state.reset);
  const syncedProfiles = useMessageStore((state) => state.syncedProfiles);
  const addSyncedProfiles = useMessageStore((state) => state.addSyncedProfiles);
  const { client, loading: creatingXmtpClient } = useXmtpClient();
  const [nonLensProfiles, setNonLensProfiles] = useState<Set<string>>(
    new Set<string>()
  );

  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [profilesLoading, setProfilesLoading] = useState<boolean>(true);
  const [profilesError, setProfilesError] = useState<Error | undefined>();
  const [loadProfiles] = useProfilesLazyQuery();
  const setEnsNames = useMessageStore((state) => state.setEnsNames);

  const {
    persistPreviewMessage,
    previewMessages: rawPreviewMessages,
    messageProfiles,
    batchPersistProfiles
  } = useMessageDb();

  useEffect(() => {
    const mapPreviewMessages = async () => {
      if (!client || !rawPreviewMessages) {
        return;
      }
      const newPreviewMessages = new Map(previewMessages);
      for (const msg of rawPreviewMessages) {
        const existing = newPreviewMessages.get(msg.conversationKey);
        // Only update the cache if the new messsage is newer
        if (!existing || msg.sent > existing.sent) {
          const message = await DecodedMessage.fromBytes(
            msg.messageBytes,
            client
          );
          const { conversationKey } = msg;
          newPreviewMessages.set(conversationKey, message);
        }
      }
      setPreviewMessages(newPreviewMessages);
    };

    mapPreviewMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, rawPreviewMessages]);

  useEffect(() => {
    const getEns = async () => {
      const chunks = chunkArray(
        Array.from(nonLensProfiles),
        MAX_PROFILES_PER_REQUEST
      );
      let newEnsNames = new Map();
      for (const chunk of chunks) {
        const ensResponse = await resolveEns(chunk);
        const ensNamesData = ensResponse.data ?? [];
        let i = 0;
        for (const ensName of ensNamesData) {
          if (ensName !== '') {
            newEnsNames.set(chunk[i], ensName);
          }
          i++;
        }
      }
      setEnsNames(new Map(newEnsNames));
    };
    getEns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonLensProfiles]);

  useEffect(() => {
    if (conversations.size === 0) {
      return;
    }

    const conversationAddresses = Array.from(conversations.keys()).map((key) =>
      toChecksumAddress(key.split('/')[0])
    );

    const toQuery = new Set(conversationAddresses);

    for (const synced of syncedProfiles) {
      toQuery.delete(synced);
    }

    if (!toQuery.size) {
      setProfilesLoading(false);
      return;
    }

    const loadLatest = async () => {
      setProfilesLoading(true);

      const chunks = chunkArray(Array.from(toQuery), MAX_PROFILES_PER_REQUEST);

      try {
        const newNonLensProfiles = new Set(nonLensProfiles);
        for (const chunk of chunks) {
          const newMessageProfiles = new Map<string, Profile>();
          const result = await loadProfiles({
            variables: { request: { ownedBy: chunk } }
          });

          if (!result.data?.profiles.items.length) {
            continue;
          }

          const profiles = result.data.profiles.items as Profile[];

          for (const address of chunk) {
            const userProfiles = profiles.filter(
              (profile) => profile.ownedBy === address
            );

            const defaultProfile =
              userProfiles.length > 1
                ? userProfiles.find((profile) => profile.isDefault)
                : userProfiles[0];

            const key = buildConversationKey(
              address.toLowerCase(),
              buildConversationId(currentProfile?.id, defaultProfile?.id)
            );

            if (conversations.has(key)) {
              newMessageProfiles.set(key, defaultProfile ?? ({} as Profile));
            }

            if (conversations.has(address.toLowerCase())) {
              newMessageProfiles.set(
                address.toLowerCase(),
                defaultProfile ?? ({} as Profile)
              );
            }

            if (!defaultProfile) {
              newNonLensProfiles.add(address);
            }
          }

          batchPersistProfiles(newMessageProfiles);
          addSyncedProfiles(chunk);
        }

        if (newNonLensProfiles.size > nonLensProfiles.size) {
          setNonLensProfiles(newNonLensProfiles);
        }
      } catch (error: unknown) {
        setProfilesError(error as Error);
      }

      setProfilesLoading(false);
    };
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncedProfiles, conversations]);

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }

    const listConversations = async () => {
      setMessagesLoading(true);
      const newConversations = new Map(conversations);

      const convos = await client.conversations.list();

      for (const convo of convos) {
        const key = buildConversationKey(
          convo.peerAddress,
          (convo.context?.conversationId as string) ?? ''
        );

        newConversations.set(key, convo);
      }

      setConversations(newConversations);

      setMessagesLoading(false);
    };

    listConversations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile?.id, selectedProfileId]);

  const onMessage = useCallback(
    (message: DecodedMessage) => {
      const conversationId = message.conversation.context?.conversationId;

      const key = buildConversationKey(
        message.conversation.peerAddress,
        conversationId ?? ''
      );
      persistPreviewMessage(key, message);
    },
    [persistPreviewMessage]
  );

  useStreamAllMessages(onMessage);

  const onConversation = useCallback(
    (convo: Conversation) => {
      const newConversations = new Map(conversations);
      const key = buildConversationKey(
        convo.peerAddress,
        convo?.context?.conversationId ?? ''
      );
      newConversations.set(key, convo);
      setConversations(newConversations);
    },
    [conversations, setConversations]
  );

  useStreamConversations(onConversation);

  useEffect(() => {
    if (selectedProfileId && currentProfile?.id !== selectedProfileId) {
      reset();
      setSelectedProfileId(currentProfile?.id);
      router.push('/messages');
    } else {
      setSelectedProfileId(currentProfile?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return {
    authenticating: creatingXmtpClient,
    loading: messagesLoading || profilesLoading || messageProfiles == undefined,
    messages: previewMessages,
    profilesToShow: messageProfiles ?? new Map(),
    profilesError: profilesError
  };
};

export default useMessagePreviews;
