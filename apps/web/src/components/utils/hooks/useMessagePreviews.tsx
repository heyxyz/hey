import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import buildConversationId from '@lib/buildConversationId';
import chunkArray from '@lib/chunkArray';
import { buildConversationKey, parseConversationKey } from '@lib/conversationKey';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import type { Conversation } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import type { DecodedMessage } from '@xmtp/xmtp-js/dist/types/src/Message';
import type { Profile } from 'lens';
import { useProfilesLazyQuery } from 'lens';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const MAX_PROFILES_PER_REQUEST = 50;

const useMessagePreviews = (currentIndex: number) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const setPreviewMessages = useMessageStore((state) => state.setPreviewMessages);
  const selectedProfileId = useMessageStore((state) => state.selectedProfileId);
  const setPreviewMessage = useMessageStore((state) => state.setPreviewMessage);
  const { client } = useXmtpClient();
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>());
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [profilesLoading, setProfilesLoading] = useState<boolean>(false);
  const [profilesError, setProfilesError] = useState<Error | undefined>();
  const [loadProfiles] = useProfilesLazyQuery();
  const addMessages = useMessageStore((state) => state.addMessages);
  const selectedTab = useMessageStore((state) => state.selectedTab);
  const [profilesToShow, setProfilesToShow] = useState<Map<string, Profile>>(new Map());
  const [requestedCount, setRequestedCount] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key);
    const userProfileId = currentProfile?.id;
    if (!parsed || !userProfileId) {
      return null;
    }

    return parsed.members.find((member) => member !== userProfileId) ?? null;
  };

  useEffect(() => {
    if (profilesLoading) {
      return;
    }
    const toQuery = new Set(profileIds);
    // Don't both querying for already seen profiles
    for (const profile of Array.from(messageProfiles.values())) {
      toQuery.delete(profile.id);
    }

    if (!toQuery.size) {
      return;
    }

    const loadLatest = async () => {
      setProfilesLoading(true);
      const newMessageProfiles = new Map(messageProfiles);
      const chunks = chunkArray(Array.from(toQuery), MAX_PROFILES_PER_REQUEST);
      try {
        for (const chunk of chunks) {
          const result = await loadProfiles({ variables: { request: { profileIds: chunk } } });
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
        }
      } catch (error: unknown) {
        setProfilesError(error as Error);
      }

      setMessageProfiles(newMessageProfiles);
      setProfilesLoading(false);
    };
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIds]);

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }
    const matcherRegex = conversationMatchesProfile(currentProfile.id);
    let messageStream: AsyncGenerator<DecodedMessage>;

    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages();

      for await (const message of messageStream) {
        const conversationId = message.conversation.context?.conversationId;
        if (conversationId && matcherRegex.test(conversationId)) {
          const key = buildConversationKey(message.conversation.peerAddress, conversationId);
          setPreviewMessage(key, message);
          addMessages(key, [message]);
        }
      }
    };

    const fetchMostRecentMessage = async (
      convo: Conversation
    ): Promise<{ key: string; message?: DecodedMessage }> => {
      const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);

      const newMessages = await convo.messages({
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING
      });
      if (newMessages.length <= 0) {
        return { key };
      }
      return { key, message: newMessages[0] };
    };

    const loadPreviewMessages = async () => {
      setMessagesLoading(true);
      const newPreviewMessages = new Map(previewMessages);
      const convos = Array.from(conversations.values()).slice(currentIndex, currentIndex + 20);
      const newProfileIds = new Set(profileIds);

      const previews = await Promise.all(convos.map(fetchMostRecentMessage));

      for (const preview of previews) {
        const profileId = getProfileFromKey(preview.key);
        if (profileId) {
          newProfileIds.add(profileId);
        }
        if (preview.message) {
          newPreviewMessages.set(preview.key, preview.message);
        }
      }
      setPreviewMessages(newPreviewMessages);
      setMessagesLoading(false);
      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds);
      }
      if (previewMessages.size >= conversations.size) {
        setHasMore(false);
      }
    };

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
      }
    };

    loadPreviewMessages();
    streamAllMessages();

    return () => {
      closeMessageStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile?.id, selectedProfileId, conversations]);

  useEffect(() => {
    const partitionedProfiles = Array.from(messageProfiles).reduce(
      (result, [key, profile]) => {
        const message = previewMessages.get(key);
        if (message) {
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
    setProfilesToShow(selectedTab === 'Following' ? partitionedProfiles[0] : partitionedProfiles[1]);
    setRequestedCount(partitionedProfiles[1].size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageProfiles, selectedTab]);

  return {
    previewLoading: messagesLoading || profilesLoading,
    messages: previewMessages,
    profilesError: profilesError,
    profilesToShow,
    requestedCount,
    hasMore
  };
};

export default useMessagePreviews;
