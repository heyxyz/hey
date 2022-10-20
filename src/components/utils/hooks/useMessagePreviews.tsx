import { useQuery } from '@apollo/client';
import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import type { Profile } from '@generated/types';
import { ProfilesDocument } from '@generated/types';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey, parseConversationKey } from '@lib/conversationKey';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { Conversation, Message, Stream } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const useMessagePreviews = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { client } = useXmtpClient();
  const isMessagesEnabled = isFeatureEnabled('messages', currentProfile?.id);

  const [stream, setStream] = useState<Stream<Conversation>>();
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const setPreviewMessages = useMessageStore((state) => state.setPreviewMessages);
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>());
  const [messagesLoading, setMessagesLoading] = useState<boolean>();

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key);
    const userProfileId = currentProfile?.id;
    if (!parsed || !userProfileId) {
      return null;
    }

    return parsed.members.find((member) => member !== userProfileId) ?? null;
  };

  const request = { profileIds: Array.from(profileIds.values()) };
  const { loading: profilesLoading, error: profilesError } = useQuery(ProfilesDocument, {
    variables: {
      request: request
    },
    skip: !currentProfile?.id || profileIds.size === 0,
    onCompleted: async (data) => {
      if (!data?.profiles?.items.length) {
        return;
      }
      const profiles = data.profiles.items as Profile[];
      const newMessageProfiles = new Map(messageProfiles);
      for (const profile of profiles) {
        const peerAddress = profile.ownedBy as string;
        const key = buildConversationKey(peerAddress, buildConversationId(currentProfile?.id, profile.id));
        newMessageProfiles.set(key, profile);
      }
      setMessageProfiles(newMessageProfiles);

      // TODO: Add pagination of results once Lens fixes an issue with their API where pagination and cursor
      // are not respected when querying by profileIds.
    }
  });

  const reset = () => {
    setConversations(new Map());
    setMessageProfiles(new Map());
    setPreviewMessages(new Map());
    setMessagesLoading(false);
  };

  useEffect(() => {
    if (!isMessagesEnabled || !client || !currentProfile) {
      return;
    }

    const fetchMostRecentMessage = async (
      convo: Conversation
    ): Promise<{ key: string; message?: Message }> => {
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

    const listConversations = async () => {
      setMessagesLoading(true);
      const newPreviewMessages = new Map(previewMessages);
      const newConversations = new Map(conversations);
      const newProfileIds = new Set(profileIds);
      const convos = await client.conversations.list();
      const matcherRegex = conversationMatchesProfile(currentProfile.id);
      const previews = await Promise.all(
        convos
          .filter((convo) => convo.context?.conversationId && matcherRegex.test(convo.context.conversationId))
          .map(async (convo) => {
            newConversations.set(
              buildConversationKey(convo.peerAddress, convo.context?.conversationId as string),
              convo
            );

            return await fetchMostRecentMessage(convo);
          })
      );

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
      setConversations(newConversations);
      setMessagesLoading(false);
      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds);
      }
    };

    const closeStream = async () => {
      if (!stream) {
        return;
      }
      await stream.return();
    };
    const streamConversations = async () => {
      closeStream();
      const newStream = (await client?.conversations?.stream()) || [];
      setStream(newStream);
      const matcherRegex = conversationMatchesProfile(currentProfile?.id);
      for await (const convo of newStream) {
        // Ignore any new conversations not matching the current profile
        if (!convo.context?.conversationId || !matcherRegex.test(convo.context.conversationId)) {
          continue;
        }
        const newPreviewMessages = new Map(previewMessages);
        const newConversations = new Map(conversations);
        const newProfileIds = new Set(profileIds);
        const key = buildConversationKey(convo.peerAddress, convo.context.conversationId);
        newConversations.set(key, convo);
        const profileId = getProfileFromKey(key);
        if (profileId && !profileIds.has(profileId)) {
          newProfileIds.add(profileId);
          setProfileIds(newProfileIds);
        }
        const preview = await fetchMostRecentMessage(convo);
        if (preview.message) {
          newPreviewMessages.set(preview.key, preview.message);
        }
        setPreviewMessages(newPreviewMessages);
        setConversations(newConversations);
      }
    };

    listConversations();
    streamConversations();

    return () => {
      closeStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile?.id]);

  useEffect(() => {
    if (!currentProfile) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return {
    loading: messagesLoading || profilesLoading,
    messages: previewMessages,
    profiles: messageProfiles,
    profilesError: profilesError
  };
};

export default useMessagePreviews;
