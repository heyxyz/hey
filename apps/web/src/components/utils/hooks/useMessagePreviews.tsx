import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import type { Profile } from '@lenster/lens';
import { useProfilesLazyQuery } from '@lenster/lens';
import buildConversationId from '@lib/buildConversationId';
import chunkArray from '@lib/chunkArray';
import {
  buildConversationKey,
  parseConversationKey
} from '@lib/conversationKey';
import { resolveEns } from '@lib/resolveEns';
import type { Conversation, Stream } from '@xmtp/xmtp-js';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MessageTabs } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import { useMessageDb } from './useMessageDb';

const MAX_PROFILES_PER_REQUEST = 50;

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
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>());
  const [nonLensProfiles, setNonLensProfiles] = useState<Set<string>>(
    new Set<string>()
  );

  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [profilesLoading, setProfilesLoading] = useState<boolean>(false);
  const [profilesError, setProfilesError] = useState<Error | undefined>();
  const [loadProfiles] = useProfilesLazyQuery();
  const selectedTab = useMessageStore((state) => state.selectedTab);
  const setEnsNames = useMessageStore((state) => state.setEnsNames);
  const ensNames = useMessageStore((state) => state.ensNames);
  const [profilesToShow, setProfilesToShow] = useState<Map<string, Profile>>(
    new Map()
  );

  const [requestedCount, setRequestedCount] = useState(0);

  const {
    persistPreviewMessage,
    previewMessages: rawPreviewMessages,
    messageProfiles,
    batchPersistProfiles
  } = useMessageDb();

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key);
    const userProfileId = currentProfile?.id;
    if (!parsed || !userProfileId) {
      return null;
    }

    return parsed.members.find((member) => member !== userProfileId) ?? null;
  };

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
      if (
        (selectedTab === 'Other' || selectedTab === 'All') &&
        ensNames.size < nonLensProfiles.size
      ) {
        const chunks = chunkArray(
          Array.from(nonLensProfiles),
          MAX_PROFILES_PER_REQUEST
        );
        let newEnsNames = new Map();
        for (const chunk of chunks) {
          const ensResponse = await resolveEns(chunk);
          const ensNamesData = ensResponse.data;
          let i = 0;
          for (const ensName of ensNamesData) {
            if (ensName !== '') {
              newEnsNames.set(chunk[i], ensName);
            }
            i++;
          }
        }
        setEnsNames(new Map(newEnsNames));
      }
    };
    getEns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  useEffect(() => {
    if (profilesLoading) {
      return;
    }
    const toQuery = new Set(profileIds);
    for (const synced of syncedProfiles) {
      toQuery.delete(synced);
    }

    if (!toQuery.size) {
      return;
    }

    const loadLatest = async () => {
      setProfilesLoading(true);

      const chunks = chunkArray(Array.from(toQuery), MAX_PROFILES_PER_REQUEST);
      try {
        for (const chunk of chunks) {
          const newMessageProfiles = new Map<string, Profile>();
          const result = await loadProfiles({
            variables: { request: { profileIds: chunk } }
          });

          if (!result.data?.profiles.items.length) {
            continue;
          }

          const profiles = result.data.profiles.items as Profile[];
          for (const profile of profiles) {
            const peerAddress = profile.ownedBy as string;
            const key = buildConversationKey(
              peerAddress,
              buildConversationId(currentProfile?.id, profile.id)
            );
            newMessageProfiles.set(key, profile);
          }
          batchPersistProfiles(newMessageProfiles);
          addSyncedProfiles(chunk);
        }
      } catch (error: unknown) {
        setProfilesError(error as Error);
      }

      setProfilesLoading(false);
    };
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIds, syncedProfiles]);

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }
    let messageStream: AsyncGenerator<DecodedMessage>;
    let conversationStream: Stream<Conversation>;

    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages();

      for await (const message of messageStream) {
        const conversationId = message.conversation.context?.conversationId;

        const key = buildConversationKey(
          message.conversation.peerAddress,
          conversationId ?? ''
        );
        persistPreviewMessage(key, message);
      }
    };

    const listConversations = async () => {
      setMessagesLoading(true);
      const newConversations = new Map(conversations);
      const newProfileIds = new Set(profileIds);
      const newNonLensProfiles = new Set(nonLensProfiles);
      const convos = await client.conversations.list();

      for (const convo of convos) {
        const key = buildConversationKey(
          convo.peerAddress,
          (convo.context?.conversationId as string) ?? ''
        );
        const profileId = getProfileFromKey(key);
        if (profileId) {
          newProfileIds.add(profileId);
        } else {
          newNonLensProfiles.add(key);
        }
        newConversations.set(key, convo);
      }

      setConversations(newConversations);

      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds);
      }

      if (newNonLensProfiles.size > nonLensProfiles.size) {
        setNonLensProfiles(newNonLensProfiles);
      }

      setMessagesLoading(false);
    };

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return;
      }
      await conversationStream.return();
    };

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
      }
    };

    const streamConversations = async () => {
      closeConversationStream();
      conversationStream = (await client?.conversations?.stream()) || [];
      for await (const convo of conversationStream) {
        const newConversations = new Map(conversations);
        const newProfileIds = new Set(profileIds);
        const newNonLensProfiles = new Set(nonLensProfiles);
        const key = buildConversationKey(
          convo.peerAddress,
          convo?.context?.conversationId ?? ''
        );
        newConversations.set(key, convo);
        const profileId = getProfileFromKey(key);
        if (profileId && !profileIds.has(profileId)) {
          newProfileIds.add(profileId);
          setProfileIds(newProfileIds);
        } else {
          newNonLensProfiles.add(key);
          setNonLensProfiles(newNonLensProfiles);
        }
        setConversations(newConversations);
      }
    };

    listConversations();
    streamConversations();
    streamAllMessages();

    return () => {
      closeConversationStream();
      closeMessageStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile?.id, selectedProfileId]);

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

  useEffect(() => {
    const partitionedProfiles = Array.from(messageProfiles || []).reduce(
      (result, [key, profile]) => {
        if (previewMessages.has(key)) {
          if (profile.isFollowedByMe) {
            result[0].set(key, profile);
          } else {
            result[1].set(key, profile);
          }
        }
        return result;
      },
      [new Map<string, Profile>(), new Map<string, Profile>()]
    );

    const otherProfiles = new Map();
    Array.from(nonLensProfiles).map((key) => {
      otherProfiles.set(key, {} as Profile);
    });

    if (selectedTab === MessageTabs.Lens) {
      setProfilesToShow(partitionedProfiles[0]);
    } else if (selectedTab === MessageTabs.Requests) {
      setProfilesToShow(partitionedProfiles[1]);
    } else if (selectedTab === MessageTabs.Other) {
      setProfilesToShow(otherProfiles);
    } else {
      setProfilesToShow(new Map([...partitionedProfiles[0], ...otherProfiles]));
    }

    setRequestedCount(partitionedProfiles[1].size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageProfiles, selectedTab]);

  return {
    authenticating: creatingXmtpClient,
    loading: messagesLoading || (profilesLoading && !messageProfiles?.size),
    messages: previewMessages,
    profilesToShow,
    requestedCount,
    profilesError: profilesError
  };
};

export default useMessagePreviews;
